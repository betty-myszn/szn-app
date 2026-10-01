import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";
import { hasFullAccessFromRow, type MembershipRow } from "@/lib/membership-gate";
import { sanitizePicks } from "@/lib/szn-picks";
import { buildSznReport, type ReportMember, type ReportRead, type Segment } from "@/lib/szn-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Data for /admin/szn-report: every member's "customise my szn" picks (auth user_metadata) plus the
// last 30 days of area-read visits (member_activity), turned into a report by szn-report.ts.
// Admin-only; a non-admin gets a 404 so the route does not confirm it exists.
//
// Admin accounts and test addresses are left out so Betty's own clicking and QA runs never skew it.

const READ_WINDOW_DAYS = 30;
const AREA_PATH = /^\/your-season\/life\/([a-z-]+)\/?$/;

type ProfileRow = MembershipRow & { id: string };

function isTestEmail(email: string | undefined): boolean {
  return !email || /@example\.(com|org|net)$/i.test(email);
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse(null, { status: auth.status });

  const admin = createAdminClient();

  // Every auth user, a page at a time.
  const users: { id: string; email?: string; user_metadata?: Record<string, unknown> }[] = [];
  for (let page = 1; page < 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) {
      console.error("szn-report: listUsers failed", error.message);
      return NextResponse.json({ error: "users_failed" }, { status: 500 });
    }
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }

  const { data: profiles, error: pErr } = await admin
    .from("profiles")
    .select(
      "id, is_admin, blocked, onboarded, membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, trial_expires_at",
    );
  if (pErr) {
    console.error("szn-report: profiles failed", pErr.message);
    return NextResponse.json({ error: "profiles_failed" }, { status: 500 });
  }
  const profileById = new Map((profiles as ProfileRow[]).map((p) => [p.id, p]));

  const included = new Set<string>();
  const members: ReportMember[] = [];
  for (const u of users) {
    const p = profileById.get(u.id);
    if (!p || p.is_admin || isTestEmail(u.email)) continue;
    included.add(u.id);
    const meta = u.user_metadata ?? {};
    const full = hasFullAccessFromRow(p);
    const segment: Segment = full ? (p.membership_level === "trial" ? "trial" : "paying") : "lapsed";
    const history = Array.isArray(meta.szn_picks_history)
      ? (meta.szn_picks_history as { s?: unknown; p?: unknown; at?: unknown }[])
          .filter((h) => typeof h?.s === "string" && typeof h?.at === "string")
          .map((h) => ({ s: h.s as string, p: sanitizePicks(h.p), at: h.at as string }))
      : [];
    members.push({
      segment,
      eligible: full && !!p.onboarded,
      picks: Array.isArray(meta.szn_picks) ? sanitizePicks(meta.szn_picks) : null,
      pickedAt: typeof meta.szn_picks_at === "string" ? meta.szn_picks_at : null,
      pickSeason: typeof meta.szn_picks_season === "string" ? meta.szn_picks_season : null,
      history,
      launchSeen: meta.szn_launch_seen === true,
    });
  }

  const since = new Date(Date.now() - READ_WINDOW_DAYS * 86_400_000).toISOString();
  const reads: ReportRead[] = [];
  // Paged so a busy month never silently truncates at the default row limit.
  for (let from = 0; from < 200_000; from += 1000) {
    const { data, error } = await admin
      .from("member_activity")
      .select("user_id, path")
      .like("path", "/your-season/life/%")
      .gte("created_at", since)
      .order("id")
      .range(from, from + 999);
    if (error) {
      console.error("szn-report: activity failed", error.message);
      break;
    }
    for (const row of data ?? []) {
      const m = AREA_PATH.exec(row.path as string);
      if (m && included.has(row.user_id as string)) reads.push({ memberKey: row.user_id as string, areaId: m[1] });
    }
    if (!data || data.length < 1000) break;
  }

  return NextResponse.json(buildSznReport(members, reads));
}
