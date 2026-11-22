import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { alertAdmins } from "@/lib/notify/admin-alert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called by the browser right after a member comments on a community post, so Betty hears about it.
// Comments are written from the browser under RLS, so this only takes the comment id and reads the
// real row: a member can only trigger an alert for a comment she actually wrote, with its real text.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  let id = "";
  try {
    id = String((await request.json())?.id ?? "");
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: c } = await admin.from("community_comments").select("id, user_id, author, content, created_at").eq("id", id).eq("user_id", user.id).maybeSingle();
  // Only fresh comments, so replaying the request can't spam Betty with an old one.
  if (!c || Date.now() - new Date(c.created_at as string).getTime() > 5 * 60 * 1000) {
    return NextResponse.json({ ok: false });
  }

  await alertAdmins(admin, {
    authorId: user.id,
    author: ((c.author as string | null) ?? "").trim() || "a member",
    content: c.content as string,
    link: "/community",
    where: "a comment in the community",
  });
  return NextResponse.json({ ok: true });
}
