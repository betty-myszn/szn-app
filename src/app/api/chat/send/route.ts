import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMemberNotifications } from "@/lib/notify/send";
import { findRoom } from "@/lib/community-store";
import { resolveMentionedUserIds } from "@/lib/notify/mentions";
import { mentionsAll } from "@/lib/community/mention-tokens";

export const runtime = "nodejs";

// Posting a message in a room, and telling anyone it mentions.
//
// This used to be a direct insert from the browser plus a Postgres trigger that matched "@sarah"
// against profiles.name. That trigger could only ever guess: it missed "Sarah Elizabeth" entirely,
// because a mention cannot contain a space, and it notified two unrelated members who happen to be
// called Sarah. Resolution now happens once, here, and everything after it is addressed by user id.
//
// The message is still written as the member herself (her own session, under RLS), so nothing about
// who can post in which room changes. Only the notification fan-out uses the admin client, because
// a member must never be able to write a notification into someone else's feed.

interface SendBody {
  spaceId?: string;
  content?: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  let body: SendBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const spaceId = (body.spaceId ?? "").trim();
  const content = (body.content ?? "").trim();
  if (!spaceId || !content) return NextResponse.json({ error: "space_and_content_required" }, { status: 400 });
  if (!findRoom(spaceId)) return NextResponse.json({ error: "unknown_room" }, { status: 400 });
  if (content.length > 4000) return NextResponse.json({ error: "too_long" }, { status: 400 });

  const { data: me } = await supabase.from("profiles").select("name, is_admin").eq("id", user.id).maybeSingle();
  const author = ((me?.name as string | null) ?? "").trim() || "babe";

  const id = `${Date.now()}-${user.id.slice(0, 8)}`;
  const { error: insertError } = await supabase.from("chat_messages").insert({
    id,
    space_id: spaceId,
    user_id: user.id,
    author,
    content,
  });
  if (insertError) {
    console.error("chat/send: insert failed", insertError.message);
    return NextResponse.json({ error: "could_not_post" }, { status: 500 });
  }

  const admin = createAdminClient();

  // "@all" tells every member, and only an admin can send it, otherwise any member could ping the
  // whole community. It goes to the bell only: an email to everyone for every @all would read as
  // spam and bury the emails that matter. Named mentions in the same message still get their email.
  let everyone = 0;
  if (me?.is_admin && mentionsAll(content)) {
    const { data: all, error: allError } = await admin.from("profiles").select("id, blocked");
    if (allError) {
      console.error("chat/send: could not read members for @all", allError.message);
    } else {
      const ids = (all ?? []).filter((r) => r.id !== user.id && !r.blocked).map((r) => r.id as string);
      if (ids.length > 0) {
        const { error: bellError } = await admin.from("notifications").insert(
          ids.map((userId) => ({
            user_id: userId,
            type: "mention",
            title: `${author} tagged everyone in the chat`,
            body: content.slice(0, 140),
            link: `/community/room/${spaceId}`,
            actor: author,
          }))
        );
        if (bellError) console.error("chat/send: @all notifications failed", bellError.message);
        else everyone = ids.length;
      }
    }
  }

  const recipients = await resolveMentionedUserIds(admin, content, user.id);
  if (recipients.length > 0) {
    await sendMemberNotifications(
      admin,
      recipients.map((userId) => ({
        userId,
        kind: "mention" as const,
        title: `${author} mentioned you in the chat`,
        body: content,
        link: `/community/room/${spaceId}`,
        actor: author,
        email: true,
        emailSubject: `${author} tagged you in the MY SZN chat 💜`,
        emailCta: "GO AND REPLY",
      }))
    );
  }

  return NextResponse.json({ ok: true, id, mentioned: recipients.length, everyone });
}
