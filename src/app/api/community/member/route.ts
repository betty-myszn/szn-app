import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { handleMatchesName } from "@/lib/community/mention-tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Who an @mention or profile link means. A member cannot read other members' profile rows, so the
// profile page asked the community feed instead, and anyone who had never posted, which is every
// member the welcome has just tagged, came back as "we couldn't find that member".
//
// Returns only what a room already shows about someone: her display name, and when she joined.
// Nothing from her chart or her account. Signed-in members only.
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const handle = (request.nextUrl.searchParams.get("handle") ?? "").trim().toLowerCase();
  if (!handle || handle.length > 80) return NextResponse.json({ members: [] });

  const admin = createAdminClient();
  const { data, error } = await admin.from("profiles").select("name, created_at, blocked");
  if (error) {
    console.error("community/member: profile lookup failed", error.message);
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }

  const members = (data ?? [])
    .filter((row) => !row.blocked && handleMatchesName(handle, row.name as string | null))
    .slice(0, 5)
    .map((row) => ({ name: (row.name as string).trim(), since: row.created_at as string }));

  return NextResponse.json({ members });
}
