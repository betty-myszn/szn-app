import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNudge, type NudgeKind } from "@/lib/email/member-nudge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Daily member nudges (Betty, 16 Nov 2026: "automate this generally").
//
//   claim   → paid for the Coven, never set up an account: one email at 3 days, one more at 10 days
//   missing → active member with an account who hasn't logged in for 7+ days: at most once per 21 days
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
    .select("id, email, is_admin, blocked, membership_level, subscription_status")
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

  const results: { kind: NudgeKind; email: string; status: string }[] = [];
  for (const job of jobs.slice(0, BATCH_LIMIT)) {
    const outcome = await sendNudge(admin, job.kind, job.email, job.key, dryRun);
    results.push({ kind: job.kind, email: job.email, status: outcome.status === "skipped" ? `skipped:${outcome.reason}` : outcome.status });
    if (outcome.status === "failed") console.error("cron/member-nudge: send failed", { email: job.email, error: outcome.error });
  }

  const count = (s: string) => results.filter((r) => r.status === s).length;
  console.log("cron/member-nudge", { dryRun, candidates: jobs.length, sent: count("sent"), wouldSend: count("dry_run") });
  return NextResponse.json({ ok: true, dryRun, candidates: jobs.length, results });
}
