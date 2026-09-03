import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getPublicOrigin } from "@/lib/request-origin";
import { STRIPE_PORTAL_URL } from "@/lib/checkout";
import { verifyBillingToken } from "@/lib/billing-portal-link";

export const runtime = "nodejs";

// Where an emailed "manage or cancel" link lands. The link carries a signed token naming her Stripe
// customer (see src/lib/billing-portal-link.ts); this route checks the signature and mints a fresh
// billing-portal session on the spot, so she arrives already inside her own billing with no email
// code to wait for.
//
// Every failure path ends at Stripe's hosted portal login rather than an error page. A member who
// clicked "cancel" in an email and hit a dead end is a chargeback, so an expired or malformed link
// still has to leave her somewhere she can actually cancel, even if it costs her one extra step.
//
// The token is the only authority here, deliberately: this is opened from an inbox, usually on a
// phone that is not logged into MY SZN. /api/stripe/portal remains the session-based door for
// someone already signed in on the site.
export async function GET(request: NextRequest) {
  const origin = getPublicOrigin(request);
  const token = request.nextUrl.searchParams.get("t");
  const customerId = verifyBillingToken(token);

  if (!customerId) {
    console.warn("manage-billing: no valid token, sending to hosted portal login", { hadToken: !!token });
    return NextResponse.redirect(STRIPE_PORTAL_URL);
  }

  try {
    // Created per-request, not at module scope: Next imports this module during the build's page
    // data collection, and the Stripe constructor throws immediately on a missing key, which would
    // fail the whole production build rather than just this route. Same reasoning as
    // src/app/api/stripe/portal/route.ts.
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/settings`,
    });
    return NextResponse.redirect(session.url);
  } catch (e) {
    // A deleted customer, a key rotated between mint and click, Stripe being down. Signature was
    // good, so this is our problem rather than hers: log it and still hand her a way in.
    console.error("manage-billing: portal session failed", customerId, e instanceof Error ? e.message : e);
    return NextResponse.redirect(STRIPE_PORTAL_URL);
  }
}
