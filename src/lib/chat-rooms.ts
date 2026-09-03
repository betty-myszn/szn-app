import { createClient } from "@/lib/supabase/client";
import { markActivationStep } from "@/lib/activation";

export interface ChatMessage {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  reactions?: Record<string, string[]>; // emoji -> array of author names who reacted
}

export async function loadRoomMessages(spaceId: string): Promise<ChatMessage[]> {
  const supabase = createClient();
  const { data: msgRows } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: true });
  if (!msgRows || msgRows.length === 0) return [];

  const ids = msgRows.map((m) => m.id);
  const { data: reactionRows } = await supabase.from("chat_reactions").select("*").in("message_id", ids);

  return msgRows.map((row) => {
    const reactions: Record<string, string[]> = {};
    (reactionRows || [])
      .filter((r) => r.message_id === row.id)
      .forEach((r) => {
        reactions[r.emoji] = [...(reactions[r.emoji] || []), r.author];
      });
    return {
      id: row.id,
      author: row.author,
      content: row.content,
      createdAt: row.created_at,
      reactions: Object.keys(reactions).length > 0 ? reactions : undefined,
    };
  });
}

export async function addRoomMessage(spaceId: string, author: string, content: string): Promise<ChatMessage[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return loadRoomMessages(spaceId);
  await supabase.from("chat_messages").insert({
    id: `${Date.now()}`,
    space_id: spaceId,
    user_id: user.id,
    author,
    content,
  });
  // Saying something in a room is one of the three first-run steps. Marked here rather than in the
  // room UI so it counts wherever she posted from.
  markActivationStep("room");
  return loadRoomMessages(spaceId);
}

// Toggles the given author's reaction of that emoji on a message, tap again to remove it.
export async function toggleReaction(spaceId: string, messageId: string, emoji: string, author: string): Promise<ChatMessage[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return loadRoomMessages(spaceId);

  const { data: existing } = await supabase
    .from("chat_reactions")
    .select("*")
    .eq("message_id", messageId)
    .eq("emoji", emoji)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("chat_reactions").delete().eq("message_id", messageId).eq("emoji", emoji).eq("user_id", user.id);
  } else {
    await supabase.from("chat_reactions").insert({ message_id: messageId, emoji, user_id: user.id, author });
  }
  return loadRoomMessages(spaceId);
}

// Moderation: removes a single message from a room, for admin use.
export async function deleteRoomMessage(spaceId: string, messageId: string): Promise<ChatMessage[]> {
  const supabase = createClient();
  await supabase.from("chat_messages").delete().eq("id", messageId);
  return loadRoomMessages(spaceId);
}

export function timeLabel(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// A room's "members" for @mention autocomplete: everyone who's posted there, most recent first.
// Takes the messages already loaded for the room rather than re-fetching.
export function getRoomMembers(messages: ChatMessage[]): string[] {
  const seen = new Set<string>();
  const members: string[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const author = messages[i].author;
    if (!seen.has(author)) {
      seen.add(author);
      members.push(author);
    }
  }
  return members;
}

// Unread tracking: compares the timestamp of the newest message against when the room was
// last opened. Marking a room seen records "now", so anything after that counts as unread.
export async function getLastSeen(spaceId: string): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: row } = await supabase
    .from("room_seen")
    .select("seen_at")
    .eq("user_id", user.id)
    .eq("space_id", spaceId)
    .maybeSingle();
  return row?.seen_at || null;
}

export async function markRoomSeen(spaceId: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("room_seen").upsert({ user_id: user.id, space_id: spaceId, seen_at: new Date().toISOString() });
}

export async function hasUnread(spaceId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: latestRow } = await supabase
    .from("chat_messages")
    .select("created_at")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latestRow) return false;

  const lastSeen = await getLastSeen(spaceId);
  if (!lastSeen) return true;
  return new Date(latestRow.created_at).getTime() > new Date(lastSeen).getTime();
}
