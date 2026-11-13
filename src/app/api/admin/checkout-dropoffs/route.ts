import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Data for /admin/checkout-dropoffs: everyone who gave their email on the way to Stripe, newest
// first, with whether they paid. Admin-only (404 for anyone else). ?format=csv downloads the
// people who have NOT paid, which is the list to follow up.

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // Leading =,+,-,@ would run as a formula when the CSV is opened in Sheets/Excel.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse(null, { status: auth.status });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("checkout_leads")
    .select("email, offer, page, checkout_url, attempts, created_at, last_started_at, paid_at")
    .order("last_started_at", { ascending: false })
    .limit(10000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = data ?? [];

  if (request.nextUrl.searchParams.get("format") === "csv") {
    const header = ["email", "offer", "page", "times_started", "last_started", "checkout_link"];
    const lines = [header.join(",")].concat(
      rows.filter((r) => !r.paid_at).map((r) => [r.email, r.offer ?? "", r.page ?? "", r.attempts, r.last_started_at, r.checkout_url].map(csvCell).join(","))
    );
    return new NextResponse(lines.join("\n"), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="myszn-checkout-dropoffs-${new Date().toISOString().slice(0, 10)}.csv"` },
    });
  }

  return NextResponse.json({ rows });
}
