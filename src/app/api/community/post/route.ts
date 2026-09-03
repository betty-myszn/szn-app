import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMemberNotifications } from "@/lib/notify/send";
import { resolveMentionedUserIds } from "@/lib/notify/mentions";

export const runtime = "nodejs";

// Posting to the community feed, and telling anyone it mentions.
//
// Same shape as the chat send route, deliberately: the feed is the busier of the two surfaces, and
// a mention there was doing nothing at all before this. The post is still written as the member
// herself, under her own session and RLS, so who can post is unchanged. Only the notification
// fan-out uses the admin client, because a member must never be able to write into someone else's
// notification feed.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  let body: { sign?: string; space?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const space = (body.space ?? "").trim();
  const content = (body.content ?? "").trim();
  const sign = (body.sign ?? "").trim() || "my szn";
  if (!space || !content) return NextResponse.json({ error: "space_and_content_required" }, { status: 400 });
  if (content.length > 8000) return NextResponse.json({ error: "too_long" }, { status: 400 });

  const { data: me } = await supabase.from("profiles").select("name").eq("id", user.id).maybeSingle();
  const author = ((me?.name as string | null) ?? "").trim() || "babe";

  const id = `${Date.now()}-${user.id.slice(0, 8)}`;
  const { error } = await supabase.from("community_posts").insert({
    id,
    user_id: user.id,
    author,
    sign,
    space,
    content,
  });
  if (error) {
    console.error("community/post: insert failed", error.message);
    return NextResponse.json({ error: "could_not_post" }, { status: 500 });
  }

  const admin = createAdminClient();
  const recipients = await resolveMentionedUserIds(admin, content, user.id);
  if (recipients.length > 0) {
    await sendMemberNotifications(
      admin,
      recipients.map((userId) => ({
        userId,
        kind: "mention" as const,
        title: `${author} mentioned you in the community`,
        body: content,
        link: "/community",
        actor: author,
        email: true,
        emailSubject: `${author} tagged you in MY SZN 💜`,
        emailCta: "GO AND REPLY",
      }))
    );
  }

  return NextResponse.json({ ok: true, id, mentioned: recipients.length });
}
