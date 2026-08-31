import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTrialEndedEmail } from "@/lib/email/trial-ended";

export const runtime = "nodejs";
// Always run fresh: a cached response would report a stale batch and, worse, would mean the send
// never happens on later calls.
export const dynamic = "force-dynamic";

// Sends the "your free week has ended" email to every trial that has passed its expiry and has not
// already had one.
//
// Called on a schedule from outside the app (Supabase pg_cron), because the trial has no scheduled
// job of its own: expiry is computed at request time, so nothing here fires when a week runs out.
//
// Safe to call as often as you like. Idempotency lives in transactional_emails, keyed per member,
// so running this hourly sends each person exactly one email; the rest of the runs find nothing to
// do and cost two queries.
//
// AUTH: a shared secret in a header, compared in constant time. Without it this URL is a button
// that anyone on the internet can press, and while the idempotency check means they could not spam
// a member, they could still burn the send and see who is on the list.

/** Do not email a trial that ended long ago: this is a win-back for someone who just lost access,
 *  and a member who expired six weeks back would get a "your 7 days are up" email out of nowhere.
 *  Also stops the FIRST run after deploy blasting the entire back catalogue of old trials. */
const MAX_AGE_DAYS = 14;

/** Cap per run so one invocation cannot spend an entire Brevo quota. Anything left over is picked
 *  up by the next run, since the query only ever returns members who have not been emailed. */
const BATCH_LIMIT = 50;

function authorised(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  // No secret configured means the endpoint is closed, not open. Failing the other way would leave
  // it publicly callable on any deploy where the variable was forgotten.
  if (!expected) return false;
  const provided = request.headers.get("x-cron-secret") ?? "";
  if (provided.length !== expected.length) return false;
  // Constant-time compare, so a caller cannot learn the secret one character at a time from timing.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return new NextResponse(null, { status: 404 });

  // No template configured means nothing can send, so stop before the query rather than looping
  // over every expired member and writing a 'failed' log row for each one, every hour.
  if (!process.env.BREVO_TEMPLATE_TRIAL_ENDED?.trim()) {
    console.error("cron/trial-ended: BREVO_TEMPLATE_TRIAL_ENDED not set, nothing sent");
    return NextResponse.json({ ok: false, error: "template_not_configured" }, { status: 503 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const nowIso = now.toISOString();
  const floorIso = new Date(now.getTime() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // Still on the trial level (so anyone who converted to paid is excluded automatically), past their
  // expiry, inside the window, and not blocked. A blocked member must never be marketed to.
  const { data: expired, error } = await admin
    .from("profiles")
    .select("id, email, name, trial_expires_at")
    .eq("membership_level", "trial")
    .lt("trial_expires_at", nowIso)
    .gt("trial_expires_at", floorIso)
    .eq("blocked", false)
    .order("trial_expires_at", { ascending: true })
    .limit(BATCH_LIMIT);

  if (error) {
    console.error("cron/trial-ended: query failed", error.message);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const row of expired ?? []) {
    if (!row.email) { skipped += 1; continue; }
    // Sequential on purpose: this is a marketing send to a handful of people, and hitting Brevo with
    // fifty parallel requests is how an API key gets rate limited.
    const outcome = await sendTrialEndedEmail(admin, {
      userId: row.id as string,
      email: row.email as string,
      name: (row.name as string | null) ?? null,
    });
    if (outcome.status === "sent") sent += 1;
    else if (outcome.status === "skipped") skipped += 1;
    else { failed += 1; console.error("cron/trial-ended: send failed", { email: row.email, error: outcome.error }); }
  }

  console.log("cron/trial-ended", { candidates: expired?.length ?? 0, sent, skipped, failed });
  return NextResponse.json({ ok: true, candidates: expired?.length ?? 0, sent, skipped, failed });
}
