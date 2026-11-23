import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { birthdayReading, birthRowToData } from "@/lib/birthday-reading";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Her birthday reading, from the birth details saved on her account (the same ones the birthday
// email uses, so the page and the email always agree).
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const admin = createAdminClient();
  const [{ data: row }, { data: profile }] = await Promise.all([
    admin.from("birth_data").select("*").eq("user_id", user.id).maybeSingle(),
    admin.from("profiles").select("name").eq("id", user.id).maybeSingle(),
  ]);
  if (!row) return NextResponse.json({ error: "no_birth_data" }, { status: 404 });

  try {
    const reading = birthdayReading(birthRowToData(row));
    const name = ((profile?.name as string | null) ?? (row.name as string | null) ?? "").trim().split(/\s+/)[0] || null;
    return NextResponse.json({ name, dateOfBirth: row.date_of_birth, reading });
  } catch (e) {
    console.error("birthday-reading: failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "could_not_calculate" }, { status: 500 });
  }
}
