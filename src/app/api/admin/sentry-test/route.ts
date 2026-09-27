import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin only: throws on purpose so Betty can see a server error arrive in Sentry. The error message
// says it is a test, so the alert that follows cannot be mistaken for a real outage.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const { data: me } = await createAdminClient().from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!me?.is_admin) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  throw new Error(`Sentry test from the control room (server), ${new Date().toISOString()}`);
}
