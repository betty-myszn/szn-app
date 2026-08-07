// The real Stripe Payment Links, in one place so the membership page and the signup page can never
// drift onto different URLs. Change a link here and every checkout button across the site follows.
//
// The "$333, 3 months upfront" link (buy.stripe.com/7sYfZi7AreUf51E3CB7kc0h) was deliberately
// dropped when that plan was retired, not lost. Its Stripe price is still mapped to the 'monthly'
// tier in stripe-tiers.ts so existing upfront members keep access; only the way to newly buy it is
// gone. Deactivate the payment link in the Stripe dashboard too, otherwise anyone holding the old
// URL can still check out on it.
//
// There is no social ($33) link: that tier is retired from sale. See the note in stripe-tiers.ts.

export const MONTHLY_CHECKOUT_URL = "https://buy.stripe.com/3cIdRacULeUf3XA7SR7kc0g";
export const VIP_CHECKOUT_URL = "https://buy.stripe.com/28EaEY1c3cM73XAehf7kc0i";
