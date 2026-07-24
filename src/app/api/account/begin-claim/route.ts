import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { mintClaimToken } from "@/lib/claim-token";

export const runtime = "nodejs";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Step 1 of secure post-payment account creation. Proves the caller actually completed this
// checkout by verifying the live Stripe Checkout Session server-side (email knowledge alone gets
// you nowhere here), matches it to the unclaimed pending_memberships row parked by the webhook,
// and exchanges it for a single-use, short-lived claim token. The raw token is returned to the
// page and later spent at /api/account/create. The email is derived from the verified session, so
// account creation is locked to the real payer.
export async function POST(request: NextRequest) {
  let payload: { session_id?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  if (!payload.session_id) {
    return NextResponse.json({ error: "session_id_required" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  let email: string | null = null;
  try {
    const session = await stripe.checkout.sessions.retrieve(payload.session_id);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "payment_not_completed" }, { status: 402 });
    }
    email = session.customer_details?.email?.toLowerCase() ?? null;
  } catch (e) {
    console.error("begin-claim: could not retrieve checkout session", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "could_not_verify_payment" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "no_email_on_purchase" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Already has an account (e.g. an existing member who paid again while logged out): don't create
  // a second one, send her to log in. Her repeat purchase is claimed on her next login.
  const { data: existingProfile } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (existingProfile) {
    return NextResponse.json({ already_exists: true, email });
  }

  // Match the verified session to the parked membership. The webhook usually lands within a second
  // or two of payment, but the browser can reach this route first, so retry briefly rather than
  // fail a legitimate buyer. If it truly never appears, tell the page to retry (webhook lag/outage)
  // instead of creating an account with nothing to claim.
  const ATTEMPTS = 5;
  let pendingFound = false;
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const { data: pending } = await admin.from("pending_memberships").select("email").eq("email", email).maybeSingle();
    if (pending) {
      pendingFound = true;
      break;
    }
    // Don't sleep after the final check, there's nothing left to wait for and it would add a
    // pointless 1.2s to the "not ready yet" response the client is waiting on to retry.
    if (attempt < ATTEMPTS - 1) await sleep(1200);
  }
  if (!pendingFound) {
    return NextResponse.json({ error: "membership_not_ready" }, { status: 202 });
  }

  const claimToken = await mintClaimToken(admin, { email, purpose: "stripe", stripeSessionId: payload.session_id });
  return NextResponse.json({ email, claim_token: claimToken });
}
