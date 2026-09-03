import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMemberNotifications } from "@/lib/notify/send";
import { findRoom } from "@/lib/community-store";
import { mentionTokenFor, fullMentionTokenFor } from "@/lib/community/welcome-message";

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

  const { data: me } = await supabase.from("profiles").select("name").eq("id", user.id).maybeSingle();
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

  return NextResponse.json({ ok: true, id, mentioned: recipients.length });
}

/**
 * Turns the "@tokens" in a message into the user ids they mean. This is the ONE place a name is
 * ever turned into a person, and everything downstream carries the id.
 *
 * A token matches a member's first name or her full name run together, so both "@Sarah" and
 * "@SarahElizabeth" reach Sarah Elizabeth. Where several members share a first name they are all
 * matched, which is the honest answer when a first name is genuinely all the writer gave: telling
 * one extra Sarah is a smaller failure than telling none. Writing "@SarahElizabeth" picks her out
 * exactly, which is what the welcome does automatically when it spots a clash.
 */
async function resolveMentionedUserIds(
  admin: ReturnType<typeof createAdminClient>,
  content: string,
  senderId: string
): Promise<string[]> {
  const tokens = new Set(
    [...content.matchAll(/@([A-Za-z0-9_]+)/g)].map((m) => m[1].toLowerCase())
  );
  if (tokens.size === 0) return [];

  const { data: profiles, error } = await admin.from("profiles").select("id, name");
  if (error) {
    console.error("chat/send: could not read profiles to resolve mentions", error.message);
    return [];
  }

  const ids = new Set<string>();
  for (const row of profiles ?? []) {
    const id = row.id as string;
    if (id === senderId) continue; // never notify someone about their own message
    const name = (row.name as string | null) ?? null;
    const first = mentionTokenFor(name)?.toLowerCase();
    const full = fullMentionTokenFor(name)?.toLowerCase();
    if ((first && tokens.has(first)) || (full && tokens.has(full))) ids.add(id);
  }
  return [...ids];
}
