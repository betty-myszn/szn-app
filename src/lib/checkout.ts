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

export const MONTHLY_CHECKOUT_URL = "https://buy.stripe.com/fZueVe5sj13peCe6ON7kc0l";
export const VIP_CHECKOUT_URL = "https://buy.stripe.com/28EaEY1c3cM73XAehf7kc0i";

/**
 * Stripe's hosted Customer Portal login page.
 *
 * The server route at /api/stripe/portal is the PREFERRED door and should stay the one members
 * click: it creates a portal session for her own customer id, read from her own RLS-protected
 * profile row, so she lands straight in her billing with nothing to type. This URL is the fallback
 * for the one case that route cannot serve, a logged-in member whose profile has no
 * stripe_customer_id yet (a webhook that has not landed, or a legacy account), where the route
 * would otherwise bounce her to the pricing page as though she had never paid. Stripe verifies her
 * by emailing a code, so it is safe to link publicly.
 */
export const STRIPE_PORTAL_URL = "https://billing.stripe.com/p/login/cNi9AUcUL3bx0Lo1ut7kc00";
