import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkAndRecordRate, releaseRate, clientIp } from "@/lib/rate-limit";
import { validatePassword } from "@/lib/password";
import { isSignupBlocked } from "@/lib/signup-blocklist";
import { syncTrialMemberToBrevo } from "@/lib/email/brevo-contact";
import { sendNewSignupAdminAlert, sendRepeatTrialAlert } from "@/lib/email/admin-notify";
import { birthFingerprint, claimTrial, hasUsedTrial, isExemptFromTrialGuard } from "@/lib/trial-fingerprint";

export const runtime = "nodejs";

// RETIRED. The 7-day trial now runs through Stripe, which takes a card, charges $0 today and starts
// billing $88 on day 8 unless she cancels. This route minted a trial with NO card at all, so leaving
// it callable would keep a second, free door open next to the paid one: the page no longer posts
// here, but an endpoint does not stop existing because nothing links to it.
//
// The whole handler is kept below the early return rather than deleted, because it is the reference
// for how a trial account was built (profile promotion, birth data, Brevo list 18, auto sign-in) and
// the five members still finishing a card-free trial were created by it.
//
// Members already mid-trial are untouched: they have accounts already, and membership-gate.ts still
// honours membership_level 'trial' until their trial_expires_at passes.

// Free 7-day trial signup. This is the SECOND place the payment-first lockdown is deliberately
// opened (the first is account/create-free): it mints a real account with no Stripe checkout and no
// claim token, on the 'trial' level, which grants the FULL platform but only until trial_expires_at
// passes (see membership-gate.ts). No card is ever taken, so nothing can auto-charge; the trial
// simply ends on its own. Everything paid still flows exclusively through the webhook + claim-token
// path in account/create, and this route can never grant anything above the time-boxed trial.
//
// Eligibility is brand-new emails only: any email that already has an account (free, trial, paid, or
// a used-up trial) is refused and pointed at login/join, which is what prevents someone farming a
// second free week. Same two guards as the free route stand in for the missing payment throttle:
//  1. A rate limit by email + IP.
//  2. A honeypot field, rejected before anything touches the database.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Exactly 7 days from signup, in milliseconds. Betty's spec: sign up Monday 15:42, access ends the
// following Monday ~15:42. Written server-side (service role) so the window can never be tampered
// with from the browser.
const TRIAL_DAYS = 7;

export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: "trial_moved_to_stripe" }, { status: 410 });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function retiredCreateTrial(request: NextRequest) {
  let payload: {
    first_name?: string;
    email?: string;
    password?: string;
    // Honeypot: a hidden field no human fills. If it arrives non-empty, treat as a bot and no-op.
    company?: string;
    birth_data?: {
      name?: string;
      dateOfBirth?: string;
      birthTime?: string;
      birthTimeApproximate?: boolean;
      location?: {
        placeName?: string;
        city?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
        timezone?: string;
      };
    } | null;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // Honeypot trip: look successful so the bot moves on, but create nothing.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return NextResponse.json({ ok: true, signedIn: false });
  }

  const firstName = (payload.first_name ?? "").trim();
  const email = payload.email?.toLowerCase().trim();
  const password = payload.password ?? "";

  if (!firstName) return NextResponse.json({ error: "first_name_required" }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: "email_required" }, { status: 400 });
  if (!validatePassword(password).ok) return NextResponse.json({ error: "weak_password" }, { status: 400 });

  // Birth details are REQUIRED for a trial: the whole point is to put her inside her own
  // chart-powered platform, so a trial without them would be a broken experience.
  const birth = payload.birth_data;
  const place = birth?.location;
  const hasBirth =
    !!birth?.dateOfBirth &&
    !!birth.birthTime &&
    !!place?.placeName &&
    typeof place.latitude === "number" &&
    typeof place.longitude === "number" &&
    !!place.timezone;
  if (!hasBirth) return NextResponse.json({ error: "birth_required" }, { status: 400 });

  const admin = createAdminClient();

  // Blocked from the platform: refuse before anything is created, matching on a normalised
  // email (so +tags and gmail dots resolve to the same identity) or a blocked IP. Returns the
  // same shape as any other rejection so the response gives nothing away.
  if (await isSignupBlocked(admin, { email, ip: clientIp(request) })) {
    return NextResponse.json({ error: "already_exists" }, { status: 409 });
  }

  // Throttle first, by email and IP, so the open door can't be turned into an account/email spam
  // engine now that no payment gates the signup.
  const rateKey = { bucket: "create_trial", email, ip: clientIp(request) };
  const { allowed } = await checkAndRecordRate(admin, {
    ...rateKey,
    emailLimit: 3,
    ipLimit: 10,
    windowMinutes: 60,
  });
  if (!allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  // Already have an account for this email: never overwrite it, never re-grant a trial, and don't
  // leak its tier. Point her at login/join instead. This is the primary repeat-trial guard: a used
  // trial always leaves a profile behind, so "an account exists" already covers "already trialled".
  // Refund the attempt, since finding out you already have an account is a dead end, not a signup.
  const { data: existing } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (existing) {
    await releaseRate(admin, rateKey);
    return NextResponse.json({ error: "already_exists" }, { status: 409 });
  }

  // Second repeat-trial guard, on the one detail a repeat trialler cannot change. The email check
  // above only catches someone reusing an address; this catches the same person arriving with a new
  // address and a different IP, which is what actually happened. Someone farming a second free week
  // has to submit the same birth details, because different details mean a stranger's chart and the
  // trial is worthless to them.
  //
  // Deliberately returns the SAME response as the email check, so the page tells her she already has
  // an account and points her at login. It gives nothing away about how she was recognised, and a
  // genuine person in this position really does already have an account.
  const fingerprint = birthFingerprint({
    dateOfBirth: birth!.dateOfBirth!,
    birthTime: birth!.birthTime!,
    latitude: place!.latitude!,
    longitude: place!.longitude!,
  });
  if (!isExemptFromTrialGuard(email) && (await hasUsedTrial(admin, fingerprint))) {
    await releaseRate(admin, rateKey);
    // Tell the team, because this guard can be wrong and a wrong one costs a real signup. The alert
    // carries the SQL to release it.
    void sendRepeatTrialAlert({ email, firstName, fingerprint });
    return NextResponse.json({ error: "already_exists" }, { status: 409 });
  }

  // Create the account server-side, confirmed at creation and signed in below, so there's no magic
  // link for an email scanner to burn and nothing to click. Mirrors account/create-free.
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, password_set: true },
  });
  if (createError || !created?.user) {
    await releaseRate(admin, rateKey);
    if (createError && /already|exists|registered|duplicate/i.test(createError.message)) {
      return NextResponse.json({ error: "already_exists" }, { status: 409 });
    }
    console.error("account/create-trial: admin.createUser failed", createError?.message);
    return NextResponse.json({ error: "create_failed", detail: createError?.message }, { status: 500 });
  }

  // Promote the just-created 'none' profile to a live trial. membership_level and the trial columns
  // are all REVOKED from authenticated, so only this service-role write can set them. onboarded is
  // set true here because she gives her birth details at signup, so the chart onboarding step is
  // already done and she should land straight in the portal. If this fails (almost always the
  // 'trial' migration not yet run) roll the auth user back so she can retry cleanly.
  const now = new Date();
  const nowIso = now.toISOString();
  const expiresIso = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { error: trialError } = await admin
    .from("profiles")
    .update({
      membership_level: "trial",
      trial_started_at: nowIso,
      trial_expires_at: expiresIso,
      trial_used: true,
      onboarded: true,
      membership_started_at: nowIso,
      membership_updated_at: nowIso,
    })
    .eq("id", created.user.id);
  if (trialError) {
    console.error("account/create-trial: could not set trial", trialError.message);
    await admin.auth.admin.deleteUser(created.user.id);
    await releaseRate(admin, rateKey);
    return NextResponse.json({ error: "trial_write_failed", detail: trialError.message }, { status: 500 });
  }

  // Claim this chart's free week, now that the trial is really live. Deliberately after the rollback
  // path above: a signup that failed and deleted its own auth user must not leave a fingerprint
  // behind, or a real person would be locked out of a trial she never got.
  await claimTrial(admin, fingerprint, created.user.id);

  // File her on the Brevo "free trial my szn" list (id 18) so trial signups are segmented apart from
  // free and paid contacts. Fire-and-forget on purpose: filing a marketing contact is not worth
  // making her wait on an external API (2-3 Brevo round-trips) before she gets inside. This runs on
  // Railway's persistent Node server, so the promise finishes after the response is sent;
  // syncTrialMemberToBrevo never throws and logs its own failures.
  void syncTrialMemberToBrevo({ email, name: firstName }).then((r) => {
    if (!r.ok) console.error("account/create-trial: brevo trial sync failed", r.error);
  });

  // Tell the team someone started a trial. A trial never touches Stripe, so the webhook's
  // new-member alert never fires for one; without this, free signups arrive silently. Same
  // fire-and-forget treatment as the Brevo sync: never allowed to slow down or fail her signup.
  void sendNewSignupAdminAlert(admin, {
    userId: created.user.id,
    email,
    name: firstName,
    signupKind: "trial",
    trialEndsAt: expiresIso,
  });

  // Store her birth details now (admin client, since birth_data RLS is owner-only and she has no
  // session yet), so her chart is ready the moment she's inside. The client also calculates and
  // caches the chart itself right after signup; this server write is the durable copy. Non-fatal:
  // a bad row here must not cost her the account, she can re-enter details from the chart page.
  const { error: birthError } = await admin.from("birth_data").insert({
    user_id: created.user.id,
    name: (birth?.name ?? firstName).trim() || firstName,
    date_of_birth: birth!.dateOfBirth,
    birth_time: birth!.birthTime,
    birth_time_approximate: birth!.birthTimeApproximate === true,
    place_name: place!.placeName,
    city: place!.city ?? place!.placeName,
    country: place!.country ?? "",
    latitude: place!.latitude,
    longitude: place!.longitude,
    timezone: place!.timezone,
  });
  if (birthError) console.error("account/create-trial: birth_data insert failed", birthError.message);

  // Log her straight in with the password she just set, on the server client so the session cookies
  // land on this response. This is what makes signup feel like creating a free account: she's inside
  // immediately, nothing to click. If sign-in somehow fails the account still exists and works, so
  // fall back to sending her to /login rather than failing the whole signup.
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    console.error("account/create-trial: auto sign-in failed", signInError.message);
    return NextResponse.json({ ok: true, signedIn: false });
  }

  return NextResponse.json({ ok: true, signedIn: true });
}
