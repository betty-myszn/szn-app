import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";
import { HD_TYPES } from "@/lib/irl";
import { ZODIAC_SIGNS } from "@/types/chart";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The recruitment dashboard's data: every application plus the counts the summary cards need.
// Admin-only, and a non-admin gets a 404 rather than a 403 so the route does not confirm it exists.

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse(null, { status: auth.status });

  const admin = createAdminClient();
  const p = request.nextUrl.searchParams;

  let q = admin.from("irl_host_applications").select("*");
  const city = p.get("city");
  const status = p.get("status");
  const astrology = p.get("astrology");
  const hosting = p.get("hosting");
  const availability = p.get("availability");
  const partnerships = p.get("partnerships");

  if (city && city !== "all") q = q.eq("city_slug", city);
  if (status && status !== "all") q = q.eq("status", status);
  if (astrology && astrology !== "all") q = q.eq("astrology_level", astrology);
  if (hosting && hosting !== "all") q = q.eq("hosting_experience", hosting);
  if (availability && availability !== "all") q = q.eq("frequency_ok", availability);
  if (partnerships && partnerships !== "all") q = q.eq("partnerships_interest", partnerships);
  if (p.get("shortlisted") === "1") q = q.eq("shortlisted", true);
  // Chart filters read the summary stored at application time. Both values are checked against the
  // known lists before they reach the query. The sun is a pattern match because a sun that changed
  // sign on an unknown-time birthday is stored as "Virgo/Libra" and belongs under either.
  const hd = p.get("hd");
  const sun = p.get("sun");
  if (hd && (HD_TYPES as readonly string[]).includes(hd)) q = q.eq("chart_summary->>hd_type", hd);
  if (sun && (ZODIAC_SIGNS as readonly string[]).includes(sun)) q = q.ilike("chart_summary->>sun", `%${sun}%`);

  const sort = p.get("sort") ?? "newest";
  if (sort === "oldest") q = q.order("submitted_at", { ascending: true });
  else if (sort === "city") q = q.order("city_slug").order("submitted_at", { ascending: false });
  else if (sort === "status") q = q.order("status").order("submitted_at", { ascending: false });
  else if (sort === "score") q = q.order("overall_score", { ascending: false, nullsFirst: false });
  else q = q.order("submitted_at", { ascending: false });

  const { data, error } = await q.limit(500);
  if (error) {
    console.error("irl/admin: query failed", error.message);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  // Counts come from the whole table rather than the filtered view, so the summary cards keep
  // meaning the same thing while you are filtering the list underneath them.
  const { data: all } = await admin
    .from("irl_host_applications").select("city_slug, status, shortlisted");
  const rows = all ?? [];
  const countWhere = (fn: (r: typeof rows[number]) => boolean) => rows.filter(fn).length;

  return NextResponse.json({
    applications: data ?? [],
    summary: {
      total: rows.length,
      london: countWhere((r) => r.city_slug === "london"),
      new_york: countWhere((r) => r.city_slug === "new-york"),
      los_angeles: countWhere((r) => r.city_slug === "los-angeles"),
      other: countWhere((r) => r.city_slug === "other"),
      shortlisted: countWhere((r) => r.shortlisted),
      interviews: countWhere((r) => r.status === "interview" || r.status === "second_interview"),
      accepted: countWhere((r) => r.status === "accepted"),
    },
  });
}
