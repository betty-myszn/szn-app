import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { tierForPriceId, ACCESS_GRANTING_STATUSES } from "@/lib/stripe-tiers";

export const runtime = "nodejs";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Recent Stripe API versions moved the subscription reference off the top-level invoice.subscription
// field (removed from this SDK's types entirely) and onto invoice.parent.subscription_details.subscription.
function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const ref = invoice.parent?.subscription_details?.subscription;
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

// Finds the profile a Stripe object belongs to. client_reference_id (only present on the
// checkout session itself) is the reliable path, set the moment CheckoutButton builds the
// Payment Link URL. Everything after checkout only has customer/subscription ids to go on,
// which is fine, by then stripe_customer_id has already been saved onto her profile.
async function findProfileId(
  admin: SupabaseAdmin,
  { clientReferenceId, customerId, subscriptionId, email }: {
    clientReferenceId?: string | null;
    customerId?: string | null;
    subscriptionId?: string | null;
    email?: string | null;
  }
): Promise<{ profileId: string | null; matchedBy: string }> {
  if (clientReferenceId) {
    const { data } = await admin.from("profiles").select("id").eq("id", clientReferenceId).maybeSingle();
    if (data) return { profileId: data.id, matchedBy: "client_reference_id" };
  }
  if (subscriptionId) {
    const { data } = await admin.from("profiles").select("id").eq("stripe_subscription_id", subscriptionId).maybeSingle();
    if (data) return { profileId: data.id, matchedBy: "stripe_subscription_id" };
  }
  if (customerId) {
    const { data } = await admin.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
    if (data) return { profileId: data.id, matchedBy: "stripe_customer_id" };
  }
  // Last resort, and only reachable when client_reference_id was missing (checkout somehow
  // started without going through CheckoutButton). A wrong email here would silently grant
  // membership to the wrong account, so this path is logged loudly every time it fires.
  if (email) {
    const { data } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
    if (data) return { profileId: data.id, matchedBy: "email_fallback" };
  }
  return { profileId: null, matchedBy: "none" };
}

// Applies a Stripe subscription's true current state onto a profile, used by
// customer.subscription.created/updated directly, and by the invoice events (which only carry
// a subscription id, so they re-fetch the subscription rather than trust partial invoice
// fields). This is the one place membership_level actually gets decided, from the Price ID the
// subscription is actually on, never from anything a client passed in.
async function syncSubscriptionOntoProfile(
  admin: SupabaseAdmin,
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const tier = tierForPriceId(priceId);

  const { profileId, matchedBy } = await findProfileId(admin, {
    subscriptionId: subscription.id,
    customerId,
  });
  if (!profileId) {
    console.error("stripe webhook: no matching profile for subscription", { customerId, subscriptionId: subscription.id });
    return;
  }

  const grantsAccess = ACCESS_GRANTING_STATUSES.has(subscription.status);
  const item = subscription.items.data[0];

  await admin
    .from("profiles")
    .update({
      membership_level: grantsAccess ? tier : "none",
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      subscription_status: subscription.status,
      subscription_current_period_end: item?.current_period_end
        ? new Date(item.current_period_end * 1000).toISOString()
        : null,
      subscription_cancel_at_period_end: subscription.cancel_at_period_end,
      membership_updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  console.log("stripe webhook: profile synced", { profileId, matchedBy, tier, status: subscription.status });
}

export async function POST(request: Request) {
  // Created per-request rather than at module scope: Next's build-time page-data collection
  // imports this module even without STRIPE_SECRET_KEY set (e.g. before env vars are filled
  // in), and the Stripe constructor throws immediately on a missing key, which would otherwise
  // fail the whole production build rather than just this route at actual request time.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("stripe webhook signature verification failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency: insert the event id before doing any work. A primary-key conflict means this
  // exact event id has already been processed (Stripe retry, or a genuine duplicate delivery),
  // in which case return success immediately without touching profiles a second time.
  const { error: insertError } = await admin
    .from("stripe_webhook_events")
    .insert({ id: event.id, type: event.type });
  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("stripe webhook: failed to record event", insertError.message);
    return NextResponse.json({ error: "could not record event" }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // The "3 months upfront" plan is a one-time payment, not a subscription (confirmed
        // against the live price catalog), it has no session.subscription at all. Handling only
        // mode === "subscription" here would silently grant nothing to anyone who pays that way.
        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
          const priceId = subscription.items.data[0]?.price?.id ?? null;
          const tier = tierForPriceId(priceId);

          if (tier === "none") {
            console.error("stripe webhook: checkout completed with unrecognised price", { priceId, sessionId: session.id });
            break;
          }

          const { profileId, matchedBy } = await findProfileId(admin, {
            clientReferenceId: session.client_reference_id,
            customerId,
            email: session.customer_details?.email,
          });
          if (matchedBy === "email_fallback") {
            console.error("stripe webhook: checkout completed with no client_reference_id, used email fallback", {
              sessionId: session.id,
              email: session.customer_details?.email,
            });
          }
          if (!profileId) {
            console.error("stripe webhook: no matching profile for checkout", { sessionId: session.id, customerId });
            break;
          }

          const grantsAccess = ACCESS_GRANTING_STATUSES.has(subscription.status);
          const item = subscription.items.data[0];
          const now = new Date().toISOString();

          await admin
            .from("profiles")
            .update({
              membership_level: grantsAccess ? tier : "none",
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              stripe_price_id: priceId,
              subscription_status: subscription.status,
              subscription_current_period_end: item?.current_period_end
                ? new Date(item.current_period_end * 1000).toISOString()
                : null,
              subscription_cancel_at_period_end: subscription.cancel_at_period_end,
              membership_started_at: now,
              membership_updated_at: now,
            })
            .eq("id", profileId);
          break;
        }

        if (session.mode === "payment") {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
          const priceId = lineItems.data[0]?.price?.id ?? null;
          const tier = tierForPriceId(priceId);

          if (tier === "none") {
            console.error("stripe webhook: one-time checkout completed with unrecognised price", { priceId, sessionId: session.id });
            break;
          }

          const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

          const { profileId, matchedBy } = await findProfileId(admin, {
            clientReferenceId: session.client_reference_id,
            customerId,
            email: session.customer_details?.email,
          });
          if (matchedBy === "email_fallback") {
            console.error("stripe webhook: one-time checkout completed with no client_reference_id, used email fallback", {
              sessionId: session.id,
              email: session.customer_details?.email,
            });
          }
          if (!profileId) {
            console.error("stripe webhook: no matching profile for one-time checkout", { sessionId: session.id, customerId });
            break;
          }

          // No subscription object exists for a one-time payment, so there's no Stripe-driven
          // renewal or expiry event coming later, "3 months upfront" is honoured by computing the
          // period end here, once, at purchase time. cancel_at_period_end is set true on purpose
          // (not because anything was cancelled, but because this genuinely will not auto-renew),
          // that's what makes the account page correctly say "ends on" instead of "renews on".
          const now = new Date();
          const periodEnd = new Date(now);
          periodEnd.setMonth(periodEnd.getMonth() + 3);
          const nowIso = now.toISOString();

          await admin
            .from("profiles")
            .update({
              membership_level: tier,
              stripe_customer_id: customerId,
              stripe_subscription_id: null,
              stripe_price_id: priceId,
              subscription_status: "active",
              subscription_current_period_end: periodEnd.toISOString(),
              subscription_cancel_at_period_end: true,
              membership_started_at: nowIso,
              membership_updated_at: nowIso,
            })
            .eq("id", profileId);

          console.log("stripe webhook: one-time payment granted membership", { profileId, matchedBy, tier, periodEnd: periodEnd.toISOString() });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await syncSubscriptionOntoProfile(admin, event.data.object as Stripe.Subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

        const { profileId } = await findProfileId(admin, { subscriptionId: subscription.id, customerId });
        if (!profileId) {
          console.error("stripe webhook: no matching profile for subscription deletion", { customerId });
          break;
        }

        // Deliberately does not null out stripe_customer_id / stripe_subscription_id, they stay
        // as subscription history for support, only access and level are actually revoked.
        await admin
          .from("profiles")
          .update({
            membership_level: "none",
            subscription_status: "canceled",
            subscription_cancel_at_period_end: false,
            membership_updated_at: new Date().toISOString(),
          })
          .eq("id", profileId);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = subscriptionIdFromInvoice(invoice);
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await syncSubscriptionOntoProfile(admin, subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = subscriptionIdFromInvoice(invoice);
        if (!subscriptionId) break;

        // Re-fetches rather than trusting the invoice payload: Stripe's own subscription status
        // (active/past_due/unpaid/canceled) is the single source of truth for whether this
        // failed payment should actually cost her access, one failed attempt alone usually
        // leaves the subscription 'past_due', which ACCESS_GRANTING_STATUSES still allows.
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await syncSubscriptionOntoProfile(admin, subscription);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("stripe webhook handler error", event.type, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
