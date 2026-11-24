// Client-safe pieces of the Coven offers (prices, links, referral helpers). The server-side handlers
// live in coven-offers.ts, which re-exports these.

export const COVEN_YEARLY_PRICE_ID = "price_1UfPYjJ6s9fRhiJoNukQujnY";
export const COVEN_YEARLY_CHECKOUT_URL = "https://buy.stripe.com/4gM3cw8EvcM751E5KJ7kc17";
export const COVEN_GIFT_PRICE_ID = "price_1UfPYkJ6s9fRhiJo7ONev0us";
export const COVEN_GIFT_LINK_ID = "plink_1UfPYlJ6s9fRhiJoFREPH5Hv";
export const COVEN_GIFT_CHECKOUT_URL = "https://buy.stripe.com/28E8wQ8Ev9zV79M4GF7kc18";
export const COVEN_REFERRAL_CREDIT_CENTS = 4400;

/** Christmas morning, UK. The nightly job (01:00 UTC) delivers scheduled gifts on its first run from here. */
export const CHRISTMAS_DELIVERY_AT = Date.parse("2026-12-25T00:00:00Z");

const SITE = "https://itsmyszn.com";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── referral link helpers (used client-side too) ──

export function referralClientRef(ref: string | null | undefined): string | null {
  const id = ref?.trim().toLowerCase();
  return id && UUID.test(id) ? `ref_${id}` : null;
}

export function referrerFromClientRef(clientRef: string | null | undefined): string | null {
  if (!clientRef?.startsWith("ref_")) return null;
  const id = clientRef.slice(4);
  return UUID.test(id) ? id : null;
}

export function referralLink(profileId: string): string {
  return `${SITE}/baddie-coven?ref=${profileId}`;
}

