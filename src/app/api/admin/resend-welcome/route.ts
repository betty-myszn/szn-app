import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email/welcome";

export const runtime = "nodejs";

// Owner-only manual resend of a welcome email. This exists for buyers whose checkout completed
// BEFORE the welcome-email feature shipped (or whose Brevo send failed and needs replaying).
//
// Safety:
//  - Guarded by a shared secret header (ADMIN_TASK_SECRET), so it is never publicly triggerable.
//  - The buyer email and price are re-derived LIVE from the Stripe Checkout Session, so the caller
//    only supplies a session id and cannot choose who gets emailed or spoof the plan.
//  - Respects the same (session, kind) idempotency as the webhook, so repeated calls don't
//    double-send. Pass { "force": true } only to deliberately re-send.
//
// Example:
//   curl -X POST https://<app>/api/admin/resend-welcome \
//     -H "x-admin-secret: $ADMIN_TASK_SECRET" -H "Content-Type: application/json" \
//     -d '{"session_id":"cs_live_..."}'
export async function POST(request: Request) {
  const secret = process.env.ADMIN_TASK_SECRET;
  if (!secret || request.headers.get("x-admin-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { session_id?: string; force?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body.session_id) {
    return NextResponse.json({ error: "session_id_required" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  let email: string | null = null;
  let name: string | null = null;
  let priceId: string | null = null;
  try {
    const session = await stripe.checkout.sessions.retrieve(body.session_id, { expand: ["line_items"] });
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "payment_not_completed" }, { status: 402 });
    }
    email = session.customer_details?.email ?? null;
    name = session.customer_details?.name ?? null;
    priceId = session.line_items?.data?.[0]?.price?.id ?? null;
    // Subscription sessions occasionally need the price read off the subscription itself.
    if (!priceId && session.mode === "subscription" && session.subscription) {
      const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
      const sub = await stripe.subscriptions.retrieve(subId);
      priceId = sub.items.data[0]?.price?.id ?? null;
    }
  } catch (e) {
    return NextResponse.json(
      { error: "could_not_verify_session", detail: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const outcome = await sendWelcomeEmail(admin, {
    sessionId: body.session_id,
    email,
    name,
    priceId,
    force: body.force === true,
  });

  return NextResponse.json({ ok: outcome.status !== "failed", outcome });
}
