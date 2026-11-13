import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";
import { detailsUrl } from "@/lib/order-details";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Data for /admin/order-details: every paid report or Baddie Session order that collects birth
// details after payment, newest first. Admin-only (404 for anyone else).

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse(null, { status: auth.status });

  const { data, error } = await createAdminClient()
    .from("order_birth_details")
    .select("stripe_session_id, email, name, offer, promises_48h, birth_date, birth_time, birth_time_unknown, birth_place, paid_at, submitted_at, reminders_sent")
    .order("paid_at", { ascending: false })
    .limit(5000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: (data ?? []).map((r) => ({ ...r, details_url: detailsUrl(r.stripe_session_id) })) });
}
