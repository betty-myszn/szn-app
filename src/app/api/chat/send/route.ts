import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMemberNotifications } from "@/lib/notify/send";
import { findRoom } from "@/lib/community-store";
import { hasAccessFromRow } from "@/lib/membership-gate";
import { resolveMentionedUserIds } from "@/lib/notify/mentions";
import { mentionsAll } from "@/lib/community/mention-tokens";
import { alertAdmins } from "@/lib/notify/admin-alert";

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
  /** Id of the message being replied to, in the same room. */
  replyTo?: string;
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

  const { data: me } = await supabase
    .from("profiles")
    .select("name, is_admin, blocked, membership_level, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end, trial_expires_at")
    .eq("id", user.id)
    .maybeSingle();
  // Paying members only, decided here on the server whatever the browser shows.
  if (!hasAccessFromRow(me)) return NextResponse.json({ error: "members_only" }, { status: 403 });
  const author = ((me?.name as string | null) ?? "").trim() || "babe";

  // A reply has to point at a real message in this same room; anything else is posted as a plain
  // message rather than refused, so a stale reply (original deleted meanwhile) still gets said.
  const replyToId = (body.replyTo ?? "").trim();
  type Original = { id: string; user_id: string; author: string; content: string };
  let original: Original | null = null;
  if (replyToId) {
    const { data } = await supabase
      .from("chat_messages")
      .select("id, user_id, author, content")
      .eq("id", replyToId)
      .eq("space_id", spaceId)
      .maybeSingle();
    original = (data as Original | null) ?? null;
  }

  // The same words from the same member in the same room within a minute are a double send (a
  // slow connection plus another tap), not a new message: say it worked and post nothing. Anna's
  // 21:21 message went in ~15 times this way on 25 Nov 2026.
  const { data: recentSame } = await supabase
    .from("chat_messages")
    .select("id")
    .eq("space_id", spaceId)
    .eq("user_id", user.id)
    .eq("content", content)
    .gte("created_at", new Date(Date.now() - 60_000).toISOString())
    .limit(1);
  if (recentSame && recentSame.length) return NextResponse.json({ ok: true, duplicate: true });

  const id = `${Date.now()}-${user.id.slice(0, 8)}`;
  const row: Record<string, string> = { id, space_id: spaceId, user_id: user.id, author, content };
  let { error: insertError } = await supabase
    .from("chat_messages")
    .insert(original ? { ...row, reply_to: original.id } : row);
  // Until the reply_to column exists (supabase/migrations/2026-11-22-chat-replies.sql) the message is
  // still posted, just without the link to the original, so the chat never breaks over a reply.
  if (insertError && original && /reply_to/.test(insertError.message)) {
    console.error("chat/send: reply_to column missing, posting without it", insertError.message);
    ({ error: insertError } = await supabase.from("chat_messages").insert(row));
  }
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

  // Tell the person being replied to, unless it's her own message or she was already tagged above.
  const repliedTo: string[] = [];
  if (original && original.user_id !== user.id && !recipients.includes(original.user_id)) {
    await sendMemberNotifications(admin, [
      {
        userId: original.user_id,
        kind: "reply" as const,
        title: `${author} replied to you in the chat`,
        body: content,
        link: `/community/room/${spaceId}`,
        actor: author,
        email: true,
        emailSubject: `${author} replied to you in the MY SZN chat 💜`,
        emailCta: "SEE THE REPLY",
      },
    ]);
    repliedTo.push(original.user_id);
  }

  await alertAdmins(admin, {
    authorId: user.id,
    author,
    content,
    link: `/community/room/${spaceId}`,
    where: `in ${findRoom(spaceId)?.label ?? "the chat"}`,
    skip: [...recipients, ...repliedTo],
  });

  return NextResponse.json({ ok: true, id, mentioned: recipients.length, everyone });
}
