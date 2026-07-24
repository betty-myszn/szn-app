import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/request-origin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Abandoned-signup recovery. A buyer who paid but never finished creating her account enters the
// email she paid with. We NEVER reveal whether a membership is waiting: the response is identical
// for every email. Only when an unclaimed membership genuinely exists do we send a single one-time
// magic link to that address, which is the proof of inbox ownership. Clicking it lands on
// /auth/callback (real session), claims the membership, and routes to /set-password. Rate-limited
// by email and IP so email knowledge can't be turned into inbox spam or a probing oracle.
const NEUTRAL = { ok: true } as const;

export async function POST(request: NextRequest) {
  const origin = getPublicOrigin(request);
  let payload: { email?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const email = payload.email?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Rate limit first, and stay neutral even when throttled so it can't be used as an oracle.
  const { allowed } = await checkAndRecordRate(admin, {
    bucket: "recover_start",
    email,
    ip: clientIp(request),
    emailLimit: 5,
    ipLimit: 20,
    windowMinutes: 60,
  });
  if (!allowed) return NextResponse.json(NEUTRAL);

  // Only do anything real when an unclaimed membership is actually parked for this email.
  const { data: pending } = await admin.from("pending_memberships").select("email").eq("email", email).maybeSingle();
  if (!pending) return NextResponse.json(NEUTRAL);

  // Ensure an account exists so the one-time login link can be sent (public sign-up is disabled, so
  // this admin create is the only way to mint one). No usable password yet, she sets one after
  // proving ownership via the link.
  const { data: existing } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (!existing) {
    const { error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { password_set: false },
    });
    if (createErr && !/already|exists|registered|duplicate/i.test(createErr.message)) {
      console.error("recover-start: could not ensure account", createErr.message);
      return NextResponse.json(NEUTRAL);
    }
  }

  // Send the single recovery email through Supabase's own mailer. shouldCreateUser:false because
  // the account now exists and we never want this to mint one.
  const supabase = await createClient();
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/callback?next=/set-password`,
    },
  });
  if (otpError) {
    console.error("recover-start: failed to send recovery link", otpError.message);
  }

  return NextResponse.json(NEUTRAL);
}
