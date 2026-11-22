import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Every account, for Betty's members list (/admin/members). Admin-only, 404 for anyone else.
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return new NextResponse(null, { status: auth.status });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, name, email, membership_level, subscription_status, trial_expires_at, created_at, blocked, is_admin")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    members: (data ?? []).map((p) => ({
      id: p.id as string,
      name: ((p.name as string | null) ?? "").trim(),
      email: (p.email as string | null) ?? "",
      level: (p.membership_level as string | null) ?? null,
      status: (p.subscription_status as string | null) ?? null,
      trialEnds: (p.trial_expires_at as string | null) ?? null,
      joined: p.created_at as string,
      blocked: !!p.blocked,
      isAdmin: !!p.is_admin,
    })),
  });
}
