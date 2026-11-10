// The Bad B*tch Coven founding window, in one place so the countdown and every join button flip at
// the same moment. November is GMT, so these are midnight UK time: opens 9 Nov, closes after 12 Nov (extended a day on 10 Nov).
export const COVEN_OPENS = Date.parse("2026-11-09T00:00:00Z");
export const COVEN_CLOSES = Date.parse("2026-11-13T00:00:00Z");

// The $44/month founding Payment Link (Stripe product "The Bad B*tch Coven", price
// price_1UY19kJ6s9fRhiJoJ9kqVlCY). Deactivate it in Stripe once the founding spots are gone.
export const COVEN_CHECKOUT_URL = "https://buy.stripe.com/5kQaEY2g7fYjdya2yx7kc0K";

export function covenIsOpen(now: number): boolean {
  return now >= COVEN_OPENS && now < COVEN_CLOSES;
}
