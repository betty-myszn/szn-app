import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/request-origin";
import { STRIPE_PORTAL_URL } from "@/lib/checkout";

export const runtime = "nodejs";

// Opens Stripe's own Billing Portal for whoever is actually logged in, the customer id always
// comes from her own profile row (RLS-protected, read via her own session), never from a query
// param or anything the browser could substitute to reach someone else's billing.
export async function GET(request: NextRequest) {
  // Created per-request rather than at module scope: Next's build-time page-data collection
  // imports this module even without STRIPE_SECRET_KEY set (e.g. a fresh checkout before env
  // vars are filled in), and the Stripe constructor throws immediately on a missing key, which
  // would otherwise fail the whole production build rather than just this route at request time.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const origin = getPublicOrigin(request);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?redirect=/settings`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  // No customer id on the profile. Sending her to the pricing page tells a member who is being
  // charged that she is not a member, and worse, leaves someone mid-trial with no way to cancel
  // before the first $88. Hand her Stripe's own portal login instead, which finds her by email.
  if (!profile?.stripe_customer_id) {
    console.warn("stripe portal: no customer id on profile, using hosted portal login", { userId: user.id });
    return NextResponse.redirect(STRIPE_PORTAL_URL);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/settings`,
  });

  return NextResponse.redirect(session.url);
}
