import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { consumeClaimToken } from "@/lib/claim-token";
import { linkPendingMembership } from "@/lib/claim-membership";
import { hasAccessFromRow, postAuthDestination } from "@/lib/membership-gate";
import { validatePassword } from "@/lib/password";

export const runtime = "nodejs";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Step 2 of secure post-payment account creation. Authorised ONLY by a valid single-use claim
// token minted from a verified paid Stripe session, never by a client-side signUp. Creates the
// Supabase user server-side (service role, so it works with public sign-up disabled), claims the
// membership, then establishes a real browser session by signing in with the password the user
// just submitted, no service-role credential or hand-rolled token ever reaches the client.
export async function POST(request: Request) {
  let payload: { claim_token?: string; first_name?: string; password?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const firstName = (payload.first_name ?? "").trim();
  const password = payload.password ?? "";
  if (!payload.claim_token) {
    return NextResponse.json({ error: "claim_token_required" }, { status: 400 });
  }
  if (!firstName) {
    return NextResponse.json({ error: "first_name_required" }, { status: 400 });
  }
  if (!validatePassword(password).ok) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Atomically redeem the token: this is the single-use gate. A used/expired/unknown token stops here.
  const claim = await consumeClaimToken(admin, payload.claim_token, "stripe");
  if (!claim) {
    return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 400 });
  }
  const email = claim.email;

  // Create the account server-side. email_confirm: true because the paid Stripe session already
  // proved this email; no verification round-trip needed.
  const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, password_set: true },
  });
  if (createError || !createdUser?.user) {
    // Someone already owns this email. The token is already spent, which is fine, no account was
    // created and there's nothing to replay. Point her at login.
    if (createError && /already|exists|registered|duplicate/i.test(createError.message)) {
      return NextResponse.json({ error: "already_exists" }, { status: 409 });
    }
    console.error("account/create: admin.createUser failed", createError?.message);
    return NextResponse.json({ error: "create_failed" }, { status: 500 });
  }

  // The signup trigger created her profile synchronously; claim the parked membership onto it.
  const userId = createdUser.user.id;
  let membership = await linkPendingMembership(userId, email);
  // Guard against a webhook that lands a beat late, retry the claim a couple of times so she isn't
  // bounced to pricing right after paying.
  for (let attempt = 0; attempt < 3 && !hasAccessFromRow(membership); attempt++) {
    await sleep(1000);
    membership = await linkPendingMembership(userId, email);
  }

  // Establish the real browser session: sign in with the password she just chose, on the SSR
  // cookie-bound client, so Supabase's own session cookies are written to this response.
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    // Account exists and is claimed; she just needs to log in once. Not a failure of the claim.
    console.error("account/create: post-create sign-in failed", signInError.message);
    return NextResponse.json({ ok: true, destination: "/login" });
  }

  return NextResponse.json({ ok: true, destination: postAuthDestination(membership) });
}
