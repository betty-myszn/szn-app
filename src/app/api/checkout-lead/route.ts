import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";
import { normaliseCheckoutUrl, offerNameForCheckoutUrl } from "@/lib/checkout-leads";

export const runtime = "nodejs";

// Saves "this email is heading to this payment link" just before Stripe opens (CheckoutEmailGate).
// The browser goes on to Stripe whatever this returns, so nothing here can ever block a sale.

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const checkoutUrl = normaliseCheckoutUrl(body?.checkoutUrl);
  const page = typeof body?.page === "string" && body.page.startsWith("/") ? body.page.slice(0, 200) : null;

  if (!checkoutUrl) return NextResponse.json({ error: "Unknown checkout" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return NextResponse.json({ error: "That email doesn't look quite right, babe" }, { status: 400 });

  const admin = createAdminClient();
  const { allowed } = await checkAndRecordRate(admin, {
    bucket: "checkout-lead", email, ip: clientIp(request), emailLimit: 20, ipLimit: 40, windowMinutes: 60,
  });
  if (!allowed) return NextResponse.json({ error: "Too many tries, give it a minute" }, { status: 429 });

  const now = new Date().toISOString();
  const { data: existing } = await admin
    .from("checkout_leads").select("id, attempts, offer").eq("email", email).eq("checkout_url", checkoutUrl).maybeSingle();

  if (existing) {
    // Back for another go. A fresh attempt after an earlier purchase is a new decision, so it
    // reopens as unpaid until the webhook says otherwise.
    const { error } = await admin.from("checkout_leads")
      .update({ attempts: existing.attempts + 1, last_started_at: now, page, paid_at: null, stripe_session_id: null, offer: existing.offer ?? (await offerNameForCheckoutUrl(checkoutUrl)) })
      .eq("id", existing.id);
    if (error) console.error("checkout lead: update failed", error.message);
    return NextResponse.json({ ok: true });
  }

  const { error } = await admin.from("checkout_leads")
    .insert({ email, checkout_url: checkoutUrl, page, offer: await offerNameForCheckoutUrl(checkoutUrl) });
  if (error && error.code !== "23505") {
    console.error("checkout lead: insert failed", error.message);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
