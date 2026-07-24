import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicOrigin } from "@/lib/request-origin";

export const runtime = "nodejs";

// Sends the post-payment activation magic link. Two ways in, both proving the person actually
// paid before we email anything (so this can't be used as an open relay or to probe who's a
// member): a Stripe checkout session id we verify is genuinely paid, or a raw email we only
// accept if the webhook has already parked a pending_memberships row for it. The link lands on
// /auth/callback, which claims her membership and forces onboarding.
export async function POST(request: NextRequest) {
  const origin = getPublicOrigin(request);

  let payload: { session_id?: string; email?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  let email: string | null = null;

  if (payload.session_id) {
    // Created per-request rather than at module scope so an unset STRIPE_SECRET_KEY can't fail
    // the whole production build, matching the webhook and portal routes.
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    try {
      const session = await stripe.checkout.sessions.retrieve(payload.session_id);
      if (session.payment_status !== "paid") {
        return NextResponse.json({ error: "payment_not_completed" }, { status: 402 });
      }
      email = session.customer_details?.email ?? null;
    } catch (e) {
      console.error("activate: could not retrieve checkout session", e instanceof Error ? e.message : e);
      return NextResponse.json({ error: "could_not_verify_payment" }, { status: 400 });
    }
  } else if (payload.email) {
    const admin = createAdminClient();
    const { data: pending } = await admin
      .from("pending_memberships")
      .select("email")
      .eq("email", payload.email.toLowerCase())
      .maybeSingle();
    if (!pending) {
      return NextResponse.json({ error: "no_purchase_found" }, { status: 404 });
    }
    email = pending.email;
  } else {
    return NextResponse.json({ error: "session_id_or_email_required" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "no_email_on_purchase" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/onboarding` },
  });
  if (error) {
    console.error("activate: failed to send magic link", error.message);
    return NextResponse.json({ error: "could_not_send_link" }, { status: 500 });
  }

  return NextResponse.json({ sent: true, email });
}
