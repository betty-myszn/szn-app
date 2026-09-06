import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { tierForPriceId, ACCESS_GRANTING_STATUSES } from "@/lib/stripe-tiers";
import { sendWelcomeEmail, planNameForPrice } from "@/lib/email/welcome";
import { sendNewMemberAdminAlert, type NewMemberAlertArgs } from "@/lib/email/admin-notify";
import { syncPaidMemberToBrevo } from "@/lib/email/brevo-contact";
import { logStripeEvent } from "@/lib/stripe/event-log";

export const runtime = "nodejs";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Fire-and-forget welcome email, called only AFTER the membership has been stored (parked or
// applied). sendWelcomeEmail is written never to throw and is idempotent per (session, kind); this
// wrapper is belt-and-braces so an email problem can never fail the webhook. A failed webhook would
// make Stripe retry and could read as a payment problem, so email is deliberately decoupled from
// the 2xx we return.
async function trySendWelcome(
  admin: SupabaseAdmin,
  args: { sessionId: string; email: string | null | undefined; name?: string | null; priceId: string | null | undefined }
): Promise<void> {
  try {
    await sendWelcomeEmail(admin, args);
  } catch (e) {
    console.error("stripe webhook: welcome email threw (membership unaffected)", e instanceof Error ? e.message : e);
  }
}

// Fire-and-forget "a new member just joined" alert to the team, called last, once the membership is
// stored and the buyer's own email is away. Same reasoning as trySendWelcome: sendNewMemberAdminAlert
// is idempotent per checkout session and written never to throw, and this wrapper makes certain an
// alerting problem can never turn a good payment into a failed webhook Stripe will retry.
async function trySendAdminAlert(admin: SupabaseAdmin, args: NewMemberAlertArgs): Promise<void> {
  try {
    await sendNewMemberAdminAlert(admin, args);
  } catch (e) {
    console.error("stripe webhook: admin new-member alert threw (membership unaffected)", e instanceof Error ? e.message : e);
  }
}

// Fire-and-forget Brevo CONTACT upsert, called only AFTER the membership has been stored (parked or
// applied) and before the welcome email. This is the step that explicitly tells Brevo the buyer has
// paid: it creates/updates their contact by email, sets the paid membership attributes + Stripe
// subscription status, and files them on the paid-members list. Like trySendWelcome it is decoupled
// from the 2xx we return, a Brevo problem can never fail the webhook or make Stripe retry a good
// payment. planName is resolved from the price so it matches the welcome email's plan_name exactly.
async function trySyncBrevoContact(args: {
  email: string | null | undefined;
  name?: string | null;
  membershipLevel: string;
  priceId: string | null | undefined;
  subscriptionStatus: string;
  stripeCustomerId: string | null | undefined;
}): Promise<void> {
  try {
    if (!args.email) {
      console.error("stripe webhook: cannot sync Brevo contact, no email on the Stripe object");
      return;
    }
    const planName = planNameForPrice(args.priceId) ?? `${args.membershipLevel} membership`;
    const result = await syncPaidMemberToBrevo({
      email: args.email,
      name: args.name,
      membershipLevel: args.membershipLevel,
      planName,
      subscriptionStatus: args.subscriptionStatus,
      stripeCustomerId: args.stripeCustomerId,
    });
    if (!result.ok) {
      console.error("stripe webhook: Brevo contact sync failed (membership unaffected)", result.error);
    }
  } catch (e) {
    console.error("stripe webhook: Brevo contact sync threw (membership unaffected)", e instanceof Error ? e.message : e);
  }
}

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

// The membership facts we write, identical shape whether they land on a real profile row or get
// parked in pending_memberships for a not-yet-activated buyer.
type MembershipFacts = {
  membership_level: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  subscription_status: string;
  subscription_current_period_end: string | null;
  subscription_cancel_at_period_end: boolean;
};

// Payment-first: a buyer can pay before she has any auth account, so there's no profile to write
// onto yet. Rather than drop the payment, park it keyed by the email she checked out with. When
// she later clicks her activation magic link, auth/callback merges this onto her real profile.
// Email is the primary key so a repeat payment from the same not-yet-activated email upserts.
async function parkPendingMembership(
  admin: SupabaseAdmin,
  email: string | null | undefined,
  facts: MembershipFacts
): Promise<void> {
  if (!email) {
    console.error("stripe webhook: cannot park pending membership, no email on the Stripe object");
    return;
  }
  const { error } = await admin
    .from("pending_memberships")
    .upsert(
      { email: email.toLowerCase(), ...facts, updated_at: new Date().toISOString() },
      { onConflict: "email" }
    );
  if (error) {
    console.error("stripe webhook: failed to park pending membership", error.message);
    return;
  }
  console.log("stripe webhook: parked pending membership for activation", { email: email.toLowerCase(), tier: facts.membership_level });
}

// Applies a Stripe subscription's true current state onto a profile, used by
// customer.subscription.created/updated directly, and by the invoice events (which only carry
// a subscription id, so they re-fetch the subscription rather than trust partial invoice
// fields). This is the one place membership_level actually gets decided, from the Price ID the
// subscription is actually on, never from anything a client passed in. If no profile exists yet
// (a subscription event that arrived before, or without, an activated account) the state is
// parked in pending_memberships against the customer's email instead of being lost.
async function syncSubscriptionOntoProfile(
  admin: SupabaseAdmin,
  stripe: Stripe,
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const tier = tierForPriceId(priceId);
  const grantsAccess = ACCESS_GRANTING_STATUSES.has(subscription.status);
  const item = subscription.items.data[0];

  const facts: MembershipFacts = {
    membership_level: grantsAccess ? tier : "none",
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    subscription_status: subscription.status,
    subscription_current_period_end: item?.current_period_end
      ? new Date(item.current_period_end * 1000).toISOString()
      : null,
    // Stripe schedules a cancellation two different ways and only one of them sets
    // cancel_at_period_end. Cancelling from the Customer Portal during a trial leaves that flag
    // FALSE and sets cancel_at to the trial end instead, verified against a real portal cancel.
    // Reading only the flag meant a member who had just cancelled was still shown "Renews on
    // 13 September", and the paid-through safety net never armed. Either signal means the same
    // thing to us: this subscription is ending and is not coming back on its own.
    subscription_cancel_at_period_end: subscription.cancel_at_period_end || subscription.cancel_at != null,
  };

  const { profileId, matchedBy } = await findProfileId(admin, {
    subscriptionId: subscription.id,
    customerId,
  });
  if (!profileId) {
    // No activated account yet. Look up the customer's email so this can be parked and picked up
    // at activation. A subscription event can genuinely arrive before checkout.session.completed.
    let email: string | null = null;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer && !customer.deleted) email = customer.email ?? null;
    } catch (e) {
      console.error("stripe webhook: could not fetch customer email to park pending", e instanceof Error ? e.message : e);
    }
    await parkPendingMembership(admin, email, facts);
    return;
  }

  await admin
    .from("profiles")
    .update({ ...facts, membership_updated_at: new Date().toISOString() })
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

          const grantsAccess = ACCESS_GRANTING_STATUSES.has(subscription.status);
          const item = subscription.items.data[0];
          const facts: MembershipFacts = {
            membership_level: grantsAccess ? tier : "none",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            subscription_status: subscription.status,
            subscription_current_period_end: item?.current_period_end
              ? new Date(item.current_period_end * 1000).toISOString()
              : null,
            // Stripe schedules a cancellation two different ways and only one of them sets
    // cancel_at_period_end. Cancelling from the Customer Portal during a trial leaves that flag
    // FALSE and sets cancel_at to the trial end instead, verified against a real portal cancel.
    // Reading only the flag meant a member who had just cancelled was still shown "Renews on
    // 13 September", and the paid-through safety net never armed. Either signal means the same
    // thing to us: this subscription is ending and is not coming back on its own.
    subscription_cancel_at_period_end: subscription.cancel_at_period_end || subscription.cancel_at != null,
          };

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
            // Payment-first buyer with no account yet: park it, don't drop it.
            await parkPendingMembership(admin, session.customer_details?.email, facts);
          } else {
            const now = new Date().toISOString();
            await admin
              .from("profiles")
              .update({ ...facts, membership_started_at: now, membership_updated_at: now })
              .eq("id", profileId);
          }

          // Membership is now stored (parked or applied). Tell Brevo the buyer has paid (contact +
          // paid attributes + subscription status on the paid list), then send the welcome email.
          await trySyncBrevoContact({
            email: session.customer_details?.email,
            name: session.customer_details?.name,
            membershipLevel: tier,
            priceId,
            subscriptionStatus: subscription.status,
            stripeCustomerId: customerId,
          });
          await trySendWelcome(admin, {
            sessionId: session.id,
            email: session.customer_details?.email,
            name: session.customer_details?.name,
            priceId,
          });
          await trySendAdminAlert(admin, {
            sessionId: session.id,
            email: session.customer_details?.email,
            name: session.customer_details?.name,
            priceId,
            tier,
            amountTotal: session.amount_total,
            currency: session.currency,
            stripeCustomerId: customerId,
            accountClaimed: !!profileId,
          });
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

          // No subscription object exists for a one-time payment, so there's no Stripe-driven
          // renewal or expiry event coming later, "3 months upfront" is honoured by computing the
          // period end here, once, at purchase time. cancel_at_period_end is set true on purpose
          // (not because anything was cancelled, but because this genuinely will not auto-renew),
          // that's what makes the account page correctly say "ends on" instead of "renews on".
          const periodEnd = new Date();
          periodEnd.setMonth(periodEnd.getMonth() + 3);
          const facts: MembershipFacts = {
            membership_level: tier,
            stripe_customer_id: customerId,
            stripe_subscription_id: null,
            stripe_price_id: priceId,
            subscription_status: "active",
            subscription_current_period_end: periodEnd.toISOString(),
            subscription_cancel_at_period_end: true,
          };

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
            // Payment-first buyer with no account yet: park it, don't drop it.
            await parkPendingMembership(admin, session.customer_details?.email, facts);
          } else {
            const nowIso = new Date().toISOString();
            await admin
              .from("profiles")
              .update({ ...facts, membership_started_at: nowIso, membership_updated_at: nowIso })
              .eq("id", profileId);
            console.log("stripe webhook: one-time payment granted membership", { profileId, matchedBy, tier, periodEnd: periodEnd.toISOString() });
          }

          // Membership is now stored (parked or applied). Tell Brevo the buyer has paid, then send
          // the welcome email. A one-time payment has no subscription object, so the status filed on
          // the contact is "active", matching the membership facts written above.
          await trySyncBrevoContact({
            email: session.customer_details?.email,
            name: session.customer_details?.name,
            membershipLevel: tier,
            priceId,
            subscriptionStatus: "active",
            stripeCustomerId: customerId,
          });
          await trySendWelcome(admin, {
            sessionId: session.id,
            email: session.customer_details?.email,
            name: session.customer_details?.name,
            priceId,
          });
          await trySendAdminAlert(admin, {
            sessionId: session.id,
            email: session.customer_details?.email,
            name: session.customer_details?.name,
            priceId,
            tier,
            amountTotal: session.amount_total,
            currency: session.currency,
            stripeCustomerId: customerId,
            accountClaimed: !!profileId,
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await syncSubscriptionOntoProfile(admin, stripe, event.data.object as Stripe.Subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

        const { profileId } = await findProfileId(admin, { subscriptionId: subscription.id, customerId });
        if (!profileId) {
          // No activated account. If a pending row was parked for this customer, downgrade it so
          // a subscription cancelled before the buyer ever activated can't later grant access.
          let email: string | null = null;
          try {
            const customer = await stripe.customers.retrieve(customerId);
            if (customer && !customer.deleted) email = customer.email ?? null;
          } catch (e) {
            console.error("stripe webhook: could not fetch customer email for pending cancellation", e instanceof Error ? e.message : e);
          }
          if (email) {
            await admin
              .from("pending_memberships")
              .update({ membership_level: "none", subscription_status: "canceled", subscription_cancel_at_period_end: false, updated_at: new Date().toISOString() })
              .eq("email", email.toLowerCase());
          }
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
        await syncSubscriptionOntoProfile(admin, stripe, subscription);
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
        await syncSubscriptionOntoProfile(admin, stripe, subscription);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("stripe webhook handler error", event.type, err instanceof Error ? err.message : err);
    // Roll back the idempotency claim so this event can actually be retried. The event id was
    // recorded up front (before the switch) to dedupe genuine duplicate deliveries, but if the
    // processing itself failed, leaving that row behind would make every Stripe retry hit the
    // duplicate short-circuit above and silently drop the membership/email work forever. Deleting
    // it here lets the next retry reprocess from scratch. Happy-path idempotency is unchanged: on
    // success the row stays and real duplicates are still deduped.
    const { error: rollbackError } = await admin.from("stripe_webhook_events").delete().eq("id", event.id);
    if (rollbackError) {
      console.error("stripe webhook: failed to roll back event record after handler error", rollbackError.message);
    }
    // Fail-soft audit of the failed attempt. Written after the rollback and intentionally not tied
    // to the (now deleted) idempotency row, so the failure record survives. Never throws.
    await logStripeEvent(admin, event, { status: "failed", error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "webhook handler failed" }, { status: 500 });
  }

  // Fail-soft audit of the successful processing. Additive only: does not alter any effect above.
  await logStripeEvent(admin, event, { status: "ok" });
  return NextResponse.json({ received: true });
}
