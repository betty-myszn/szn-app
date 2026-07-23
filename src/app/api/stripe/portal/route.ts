import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

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
  const { origin } = new URL(request.url);
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

  if (!profile?.stripe_customer_id) {
    return NextResponse.redirect(`${origin}/membership`);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/settings`,
  });

  return NextResponse.redirect(session.url);
}
