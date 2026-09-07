import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";
import { RATING_FIELDS, STATUSES } from "@/lib/irl";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATING_KEYS = RATING_FIELDS.map((r) => r.key) as readonly string[];
// The only columns an admin may write. Everything an applicant submitted is deliberately absent:
// her answers are a record of what she said, not a document we edit afterwards.
const EDITABLE = new Set<string>([
  "status", "shortlisted", "admin_notes", "red_flags", "things_we_loved", ...RATING_KEYS,
]);

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse(null, { status: auth.status });
  const { id } = await ctx.params;

  const admin = createAdminClient();
  const { data: application, error } = await admin
    .from("irl_host_applications").select("*").eq("id", id).maybeSingle();
  if (error || !application) return new NextResponse(null, { status: 404 });

  const { data: interviews } = await admin
    .from("irl_interview_notes").select("*").eq("application_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ application, interviews: interviews ?? [] });
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse(null, { status: auth.status });
  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid" }, { status: 400 }); }

  const admin = createAdminClient();

  // An interview note is an append, never an edit, so it comes in on the same PATCH but writes to
  // its own table and leaves the history intact.
  if (body.interview_note && typeof body.interview_note === "object") {
    const n = body.interview_note as Record<string, unknown>;
    const { error } = await admin.from("irl_interview_notes").insert({
      application_id: id,
      interview_date: (n.interview_date as string) || null,
      interviewed_by: (n.interviewed_by as string) || null,
      notes: (n.notes as string) || null,
      strengths: (n.strengths as string) || null,
      concerns: (n.concerns as string) || null,
      suggested_city: (n.suggested_city as string) || null,
      recommendation: (n.recommendation as string) || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!EDITABLE.has(k)) continue;
    if (k === "status" && !STATUSES.includes(v as never)) continue;
    if (RATING_KEYS.includes(k)) {
      const n = Number(v);
      patch[k] = v === null || v === "" ? null : Number.isInteger(n) && n >= 1 && n <= 5 ? n : undefined;
      if (patch[k] === undefined) delete patch[k];
      continue;
    }
    patch[k] = v;
  }

  if (Object.keys(patch).length > 0) {
    // Recompute the overall score from whichever ratings now exist, so sorting the table is a
    // column read rather than an average done in the browser over 500 rows.
    // Typed as unknown because the select list is built at runtime, so supabase-js cannot infer
    // the row shape and hands back a value it will not let us spread.
    const { data: currentRow } = await admin
      .from("irl_host_applications").select(RATING_KEYS.join(",")).eq("id", id).maybeSingle();
    const current = (currentRow ?? {}) as Record<string, unknown>;
    const merged: Record<string, unknown> = { ...current, ...patch };
    const given = RATING_KEYS.map((k) => merged[k]).filter((v): v is number => typeof v === "number");
    patch.overall_score = given.length ? Number((given.reduce((a, b) => a + b, 0) / given.length).toFixed(2)) : null;
    patch.updated_at = new Date().toISOString();

    const { error } = await admin.from("irl_host_applications").update(patch).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Accepting someone moves her into host management, where the job lives. Idempotent: accepting
    // twice does not create a second host.
    if (patch.status === "accepted") {
      const { data: app } = await admin.from("irl_host_applications").select("*").eq("id", id).maybeSingle();
      const { data: existing } = await admin.from("irl_hosts").select("id").eq("application_id", id).maybeSingle();
      if (app && !existing) {
        await admin.from("irl_hosts").insert({
          application_id: id, full_name: app.full_name, email: app.email, phone: app.phone,
          instagram: app.instagram, tiktok: app.tiktok, linkedin: app.linkedin, city_slug: app.city_slug,
        });
      }
    }
  }

  const { data: application } = await admin
    .from("irl_host_applications").select("*").eq("id", id).maybeSingle();
  return NextResponse.json({ ok: true, application });
}
