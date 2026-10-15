import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";
import { OFFERS, OFFER_SLUGS, isOfferSlug } from "@/lib/offers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The waitlist dashboard's data. Admin-only (404 for anyone else, so the route doesn't confirm it
// exists). ?offer=<slug> filters, ?format=csv downloads that list (or every list) as a CSV.

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // Leading =,+,-,@ would run as a formula when the CSV is opened in Sheets/Excel.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse(null, { status: auth.status });

  const p = request.nextUrl.searchParams;
  const offer = p.get("offer");
  const admin = createAdminClient();

  let q = admin.from("waitlist_signups").select("email, name, offer, answer, birth_date, birth_time, birth_place, brevo_ok, created_at").order("created_at", { ascending: false });
  if (isOfferSlug(offer)) q = q.eq("offer", offer);
  const { data, error } = await q.limit(10000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = data ?? [];

  if (p.get("format") === "csv") {
    const header = ["email", "name", "offer", "answer", "birth_date", "birth_time", "birth_place", "signed_up", "in_brevo"];
    const lines = [header.join(",")].concat(
      rows.map((r) => [r.email, r.name, OFFERS[r.offer as keyof typeof OFFERS]?.name ?? r.offer, r.answer, r.birth_date, r.birth_time, r.birth_place, r.created_at, r.brevo_ok ? "yes" : "no"].map(csvCell).join(","))
    );
    const file = `myszn-waitlist-${isOfferSlug(offer) ? offer : "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(lines.join("\n"), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${file}"` },
    });
  }

  // Counts per offer always cover every list, whatever the filter.
  const { data: all } = await admin.from("waitlist_signups").select("offer").limit(100000);
  const counts = Object.fromEntries(OFFER_SLUGS.map((s) => [s, 0])) as Record<string, number>;
  for (const r of all ?? []) counts[r.offer] = (counts[r.offer] ?? 0) + 1;

  return NextResponse.json({ rows, counts });
}
