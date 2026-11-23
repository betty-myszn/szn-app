import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNudge, FIRST_WEEK_SEND_APPROVED, type NudgeKind } from "@/lib/email/member-nudge";
import { sendBirthdayEmail, BIRTHDAY_SEND_APPROVED } from "@/lib/email/birthday";
import { birthdayReading, birthRowToData, isBirthdayToday } from "@/lib/birthday-reading";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Daily member nudges (Betty, 16 Nov 2026: "automate this generally").
//
//   claim   → paid for the Coven, never set up an account: one email at 3 days, one more at 10 days
//   missing → active member with an account who hasn't logged in for 7+ days: at most once per 21 days
//   week1   → day 1, 3 and 7 after her membership starts (held until FIRST_WEEK_SEND_APPROVED)
//   birthday → her year-ahead birthday reading on her birthday (held until BIRTHDAY_SEND_APPROVED)
//
// Called by Supabase pg_cron (supabase/RUN-member-nudge.sql). Idempotent via transactional_emails, so
// running it more often never double-sends. Betty approved both emails on 16 Nov 2026, so it sends by
// default; set MEMBER_NUDGE_SEND=off in Railway to pause it, or POST {"dryRun":true} to preview.
// The owner account (is_admin) and blocked members are never emailed.

const DAY = 24 * 60 * 60 * 1000;
const CLAIM_FIRST_DAYS = 3;
const CLAIM_SECOND_DAYS = 10;
const CLAIM_MAX_AGE_DAYS = 45; // don't chase very old unclaimed payments out of nowhere
const MISSING_AFTER_DAYS = 7;
const MISSING_EVERY_DAYS = 21;
const BATCH_LIMIT = 40;
const FIRST_WEEK_DAYS = [1, 3, 7] as const;

function authorised(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const provided = request.headers.get("x-cron-secret") ?? "";
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return new NextResponse(null, { status: 404 });
  const body = (await request.json().catch(() => ({}))) as { dryRun?: boolean };
  const dryRun = body.dryRun === true || process.env.MEMBER_NUDGE_SEND === "off";

  const admin = createAdminClient();
  const now = Date.now();
  const jobs: { kind: NudgeKind; email: string; key: string }[] = [];

  // ── claim: paid, no account yet ──
  const { data: pending, error: pendingError } = await admin
    .from("pending_memberships")
    .select("email, membership_level, subscription_status, membership_started_at")
    .neq("membership_level", "none")
    .in("subscription_status", ["active", "trialing"])
    .lte("membership_started_at", new Date(now - CLAIM_FIRST_DAYS * DAY).toISOString())
    .gte("membership_started_at", new Date(now - CLAIM_MAX_AGE_DAYS * DAY).toISOString());
  if (pendingError) {
    console.error("cron/member-nudge: pending query failed", pendingError.message);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  // Everyone with an account, with their last sign-in (one page covers the whole membership today).
  const { data: users, error: usersError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (usersError) {
    console.error("cron/member-nudge: listUsers failed", usersError.message);
    return NextResponse.json({ error: "users_failed" }, { status: 500 });
  }
  const accountEmails = new Set(users.users.map((u) => (u.email ?? "").toLowerCase()));
  const userById = new Map(users.users.map((u) => [u.id, u]));

  for (const p of pending ?? []) {
    const email = (p.email as string).toLowerCase();
    if (accountEmails.has(email)) continue; // claimed in the meantime
    const days = (now - Date.parse(p.membership_started_at as string)) / DAY;
    const step = days >= CLAIM_SECOND_DAYS ? 2 : 1;
    jobs.push({ kind: "claim", email, key: `claim:${email}:${step}` });
  }

  // ── missing: active members who haven't logged in for a week ──
  const { data: members, error: membersError } = await admin
    .from("profiles")
    .select("id, name, email, is_admin, blocked, membership_level, subscription_status, membership_started_at")
    .in("membership_level", ["monthly", "vip", "social"])
    .in("subscription_status", ["active", "trialing"])
    .eq("blocked", false);
  if (membersError) {
    console.error("cron/member-nudge: members query failed", membersError.message);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }
  const window = Math.floor(now / (MISSING_EVERY_DAYS * DAY));
  for (const m of members ?? []) {
    if (m.is_admin) continue;
    const u = userById.get(m.id as string);
    const email = ((m.email as string | null) ?? u?.email ?? "").toLowerCase();
    if (!u || !email) continue;
    if (now - Date.parse(u.created_at) < MISSING_AFTER_DAYS * DAY) continue; // brand new, leave her be
    const last = u.last_sign_in_at ? Date.parse(u.last_sign_in_at) : 0;
    if (now - last < MISSING_AFTER_DAYS * DAY) continue;
    jobs.push({ kind: "missing", email, key: `missing:${m.id}:${window}` });
  }

  // ── first week: day 1, 3 and 7 after her membership started ──
  // Each has a two-day window, so a day the cron misses still sends the next morning, while women who
  // joined long before this went live never get a "welcome" out of nowhere.
  for (const m of members ?? []) {
    if (m.is_admin) continue;
    const u = userById.get(m.id as string);
    const email = ((m.email as string | null) ?? u?.email ?? "").toLowerCase();
    if (!u || !email) continue;
    const started = Date.parse((m.membership_started_at as string | null) ?? u.created_at);
    if (!Number.isFinite(started)) continue;
    const days = (now - started) / DAY;
    for (const day of FIRST_WEEK_DAYS) {
      if (days >= day && days < day + 2) jobs.push({ kind: `week1-day${day}` as NudgeKind, email, key: `week1-day${day}:${m.id}` });
    }
  }

  const results: { kind: NudgeKind; email: string; status: string }[] = [];
  for (const job of jobs.slice(0, BATCH_LIMIT)) {
    const held = job.kind.startsWith("week1-") && !FIRST_WEEK_SEND_APPROVED; // until Betty approves the copy
    const outcome = await sendNudge(admin, job.kind, job.email, job.key, dryRun || held);
    results.push({ kind: job.kind, email: job.email, status: outcome.status === "skipped" ? `skipped:${outcome.reason}` : outcome.status });
    if (outcome.status === "failed") console.error("cron/member-nudge: send failed", { email: job.email, error: outcome.error });
  }

  // ── birthday: her year-ahead reading, on her birthday (UK date) ──
  const birthdayResults: { email: string; status: string }[] = [];
  const memberIds = (members ?? []).filter((m) => !m.is_admin).map((m) => m.id as string);
  const { data: births, error: birthsError } = memberIds.length
    ? await admin.from("birth_data").select("*").in("user_id", memberIds)
    : { data: [], error: null };
  if (birthsError) console.error("cron/member-nudge: birth_data query failed", birthsError.message);
  const memberById = new Map((members ?? []).map((m) => [m.id as string, m]));
  for (const row of births ?? []) {
    if (!row.date_of_birth || !isBirthdayToday(row.date_of_birth as string, new Date(now))) continue;
    const m = memberById.get(row.user_id as string);
    const u = userById.get(row.user_id as string);
    const email = ((m?.email as string | null) ?? u?.email ?? "").toLowerCase();
    if (!m || !email) continue;
    try {
      const reading = birthdayReading(birthRowToData(row), new Date(now));
      const firstName = (((m.name as string | null) ?? (row.name as string | null) ?? "").trim().split(/\s+/)[0]) || null;
      const outcome = await sendBirthdayEmail(admin, email, `birthday:${m.id}:${reading.yearStart}`, firstName, reading, dryRun || !BIRTHDAY_SEND_APPROVED);
      birthdayResults.push({ email, status: outcome.status === "skipped" ? `skipped:${outcome.reason}` : outcome.status });
      if (outcome.status === "failed") console.error("cron/member-nudge: birthday send failed", { email, error: outcome.error });
    } catch (e) {
      console.error("cron/member-nudge: birthday reading failed", { email, error: e instanceof Error ? e.message : e });
    }
  }

  const count = (s: string) => results.filter((r) => r.status === s).length;
  console.log("cron/member-nudge", { dryRun, candidates: jobs.length, sent: count("sent"), wouldSend: count("dry_run") });
  return NextResponse.json({ ok: true, dryRun, candidates: jobs.length, results, birthdays: birthdayResults });
}
