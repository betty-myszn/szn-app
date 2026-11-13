import Stripe from "stripe";
import type { createAdminClient } from "@/lib/supabase/admin";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Checkout leads: who gave their email on the way to a Stripe payment link, and whether they went
// on to pay. Written by /api/checkout-lead (from CheckoutEmailGate), closed off by the Stripe
// webhook, read by /admin/checkout-dropoffs. See supabase/migrations/2026-11-13-checkout-leads.sql.

export const STRIPE_LINK_HOST = "buy.stripe.com";

/** The payment link with its query string stripped, so the same link always stores the same way. */
export function normaliseCheckoutUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== STRIPE_LINK_HOST) return null;
    return `https://${STRIPE_LINK_HOST}${url.pathname}`;
  } catch {
    return null;
  }
}

// Payment link url -> the product name Stripe shows for it ("Rich B*tch Rising"). One listing of
// the account's links, kept in memory for ten minutes, so a lead costs no Stripe call most of the
// time. Purely a label for the admin page: any failure returns null and the lead still saves.
let offerNames: { at: number; byUrl: Map<string, string> } | null = null;

export async function offerNameForCheckoutUrl(checkoutUrl: string): Promise<string | null> {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return null;
    if (!offerNames || Date.now() - offerNames.at > 10 * 60_000) {
      offerNames = { at: Date.now(), byUrl: new Map() };
    }
    const cached = offerNames.byUrl.get(checkoutUrl);
    if (cached) return cached;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    for await (const link of stripe.paymentLinks.list({ limit: 100 })) {
      if (link.url !== checkoutUrl) continue;
      const items = await stripe.paymentLinks.listLineItems(link.id, { limit: 1 });
      const name = items.data[0]?.description ?? null;
      if (name) offerNames.byUrl.set(checkoutUrl, name);
      return name;
    }
    return null;
  } catch (e) {
    console.error("checkout leads: offer name lookup failed", e instanceof Error ? e.message : e);
    return null;
  }
}

/**
 * Called by the Stripe webhook on every completed checkout: stamps the matching lead as paid, so it
 * drops out of the drop-off list. Matched on the email she paid with plus the payment link she paid
 * through. Never throws, and never touches membership or access.
 */
export async function markCheckoutLeadPaid(admin: SupabaseAdmin, stripe: Stripe, session: Stripe.Checkout.Session): Promise<void> {
  try {
    const email = (session.customer_details?.email ?? session.customer_email ?? "").toLowerCase();
    const linkId = typeof session.payment_link === "string" ? session.payment_link : session.payment_link?.id;
    if (!email || !linkId) return;
    const link = await stripe.paymentLinks.retrieve(linkId);
    const checkoutUrl = normaliseCheckoutUrl(link.url);
    if (!checkoutUrl) return;
    const { error } = await admin
      .from("checkout_leads")
      .update({ paid_at: new Date().toISOString(), stripe_session_id: session.id })
      .eq("email", email)
      .eq("checkout_url", checkoutUrl)
      .is("paid_at", null);
    if (error) console.error("checkout leads: could not mark paid", error.message);
  } catch (e) {
    console.error("checkout leads: mark paid threw (payment unaffected)", e instanceof Error ? e.message : e);
  }
}
