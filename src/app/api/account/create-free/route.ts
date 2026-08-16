import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkAndRecordRate, releaseRate, clientIp } from "@/lib/rate-limit";
import { validatePassword } from "@/lib/password";
import { syncFreeMemberToBrevo } from "@/lib/email/brevo-contact";

export const runtime = "nodejs";

// Free front-door signup. This is the ONE place the payment-first lockdown is deliberately opened:
// it mints a real account with no Stripe checkout and no claim token, on the 'free' tier, which
// unlocks the live chat rooms only (never the rituals or the platform). Everything paid still flows
// exclusively through the webhook + claim-token path in account/create, this route can never grant
// anything above 'free'.
//
// Because there is no payment to prove the email is real or to deter bots, two things guard it:
//  1. A rate limit by email + IP (payment used to be the natural throttle).
//  2. A honeypot field, rejected below before anything touches the database.
//
// Email ownership is NOT verified. It used to be, via a one-time magic link, and that was removed
// deliberately: email providers prefetch links, and a single-use link is consumed by the scanner
// before the member ever clicks it, so accounts arrived already "verified"-then-expired and she
// could not get in. On a free tier that already requires a password, a dead front door costs more
// than unproven email addresses do. Accounts are created confirmed and signed straight in.
// Anything that must assume a real, proven email address cannot rely on this route.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let payload: {
    first_name?: string;
    email?: string;
    password?: string;
    // Honeypot. A hidden field no human ever sees or fills; bots that auto-complete every input
    // will. If it arrives with anything in it, the request is a bot and we reject before touching
    // the database. Zero friction for real people, no external service, no key to configure.
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

  // Honeypot trip: return a plausible-looking success so the bot moves on and doesn't learn it was
  // caught, but create nothing.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return NextResponse.json({ ok: true, signedIn: false });
  }

  const firstName = (payload.first_name ?? "").trim();
  const email = payload.email?.toLowerCase().trim();
  const password = payload.password ?? "";

  if (!firstName) return NextResponse.json({ error: "first_name_required" }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: "email_required" }, { status: 400 });
  if (!validatePassword(password).ok) return NextResponse.json({ error: "weak_password" }, { status: 400 });

  const admin = createAdminClient();

  // Throttle first, by email and IP, so the open door can't be turned into an account/email spam
  // engine now that payment no longer gates signups.
  const rateKey = { bucket: "create_free", email, ip: clientIp(request) };
  const { allowed } = await checkAndRecordRate(admin, {
    ...rateKey,
    emailLimit: 3,
    ipLimit: 10,
    windowMinutes: 60,
  });
  if (!allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  // Already have an account for this email: don't overwrite it or leak its tier, just point her at
  // login. Mirrors account/create's already_exists behaviour. Refund the attempt, since finding out
  // you already have an account is a dead end, not a signup she should be charged quota for.
  const { data: existing } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (existing) {
    await releaseRate(admin, rateKey);
    return NextResponse.json({ error: "already_exists" }, { status: 409 });
  }

  // Create the account server-side (public sign-up stays disabled, so the admin client is the only
  // way in).
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    // Confirmed at creation. The one-time magic-link verification we tried first was consumed by
    // email-provider link scanners (Gmail prefetches the link, which is single-use, so the account
    // was already "verified"-then-expired before she ever clicked). Email ownership isn't worth a
    // dead front door on a free chat tier, especially when a password is already required, so we
    // confirm here and log her straight in with that password below instead of emailing a link.
    email_confirm: true,
    user_metadata: { first_name: firstName, password_set: true },
  });
  if (createError || !created?.user) {
    await releaseRate(admin, rateKey);
    if (createError && /already|exists|registered|duplicate/i.test(createError.message)) {
      return NextResponse.json({ error: "already_exists" }, { status: 409 });
    }
    console.error("account/create-free: admin.createUser failed", createError?.message);
    return NextResponse.json({ error: "create_failed", detail: createError?.message }, { status: 500 });
  }

  // The signup trigger created her profile at 'none'; promote it to 'free'. Uses the admin client
  // because membership_level is REVOKED from authenticated (only the service role may write it).
  // If this fails it's almost certainly the check constraint missing 'free', run the migration in
  // supabase/migrations/2026-08-04-free-tier.sql. Roll the auth user back so she isn't stranded in
  // a half-created state and can retry cleanly.
  const now = new Date().toISOString();
  const { error: promoteError } = await admin
    .from("profiles")
    .update({ membership_level: "free", membership_started_at: now, membership_updated_at: now })
    .eq("id", created.user.id);
  if (promoteError) {
    console.error("account/create-free: could not set free tier", promoteError.message);
    await admin.auth.admin.deleteUser(created.user.id);
    // Nothing survived this request, so it must not count against her: the rollback means retrying
    // is the correct next move, and the usual cause (the 'free' migration not having run yet) is
    // ours to fix, not hers to be throttled for.
    await releaseRate(admin, rateKey);
    // `detail` carries the real Postgres message through to the UI. The generic "something went
    // wrong" that shipped first made a one-line schema fix look like an unknowable bug.
    return NextResponse.json(
      { error: "tier_write_failed", detail: promoteError.message },
      { status: 500 }
    );
  }

  // File her on the Brevo "my szn free members" list (id 15) now that she's a confirmed free member,
  // so free joiners can be emailed and segmented apart from paid members and from the free birth
  // chart list. Only this free-signup path does it; free-chart signups go through /api/subscribe to
  // their own list and are deliberately left off this one. Awaited because serverless can kill work
  // that outlives the response, but non-fatal: syncFreeMemberToBrevo never throws, so a Brevo hiccup
  // can't cost her the account she just created.
  const brevoResult = await syncFreeMemberToBrevo({ email, name: firstName });
  if (!brevoResult.ok) console.error("account/create-free: brevo free-member sync failed", brevoResult.error);

  // Birth details are optional at signup, and when she gives them we store them now so her free
  // birth chart and free human design chart are already waiting the moment she verifies. Written
  // with the admin client because birth_data's RLS policy is owner-only and she has no session yet.
  // Deliberately non-fatal: a bad row here must not cost her the account or the chat rooms, she can
  // always enter her details again from the chart page.
  const birth = payload.birth_data;
  const place = birth?.location;
  if (
    birth?.dateOfBirth &&
    birth.birthTime &&
    place?.placeName &&
    typeof place.latitude === "number" &&
    typeof place.longitude === "number" &&
    place.timezone
  ) {
    const { error: birthError } = await admin.from("birth_data").insert({
      user_id: created.user.id,
      name: (birth.name ?? firstName).trim() || firstName,
      date_of_birth: birth.dateOfBirth,
      birth_time: birth.birthTime,
      birth_time_approximate: birth.birthTimeApproximate === true,
      place_name: place.placeName,
      city: place.city ?? place.placeName,
      country: place.country ?? "",
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone,
    });
    if (birthError) console.error("account/create-free: birth_data insert failed", birthError.message);
  }

  // Log her straight in with the password she just set, on the server client so the session cookies
  // land on this response. This is what replaces the emailed magic link: the account is already
  // confirmed above, so a password sign-in succeeds immediately and she arrives on /home logged in,
  // with nothing to click and nothing a link scanner can break. If for any reason the sign-in
  // fails, the account still exists and works, so fall back to sending her to /login rather than
  // failing the whole signup.
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    console.error("account/create-free: auto sign-in failed", signInError.message);
    return NextResponse.json({ ok: true, signedIn: false });
  }

  return NextResponse.json({ ok: true, signedIn: true });
}
