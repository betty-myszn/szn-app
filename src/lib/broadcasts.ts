import { createClient } from "@/lib/supabase/client";

export interface Broadcast {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  authorEmail: string;
}

function mapRow(row: { id: string; title: string; body: string; created_at: string; author_email: string }): Broadcast {
  return { id: row.id, title: row.title, body: row.body, createdAt: row.created_at, authorEmail: row.author_email };
}

export async function loadBroadcasts(): Promise<Broadcast[]> {
  const supabase = createClient();
  const { data } = await supabase.from("broadcasts").select("*").order("created_at", { ascending: false });
  return (data || []).map(mapRow);
}

export async function sendBroadcast(title: string, body: string, authorEmail: string): Promise<Broadcast[]> {
  const supabase = createClient();
  await supabase.from("broadcasts").insert({
    id: `${Date.now()}`,
    title: title.trim(),
    body: body.trim(),
    author_email: authorEmail,
  });
  return loadBroadcasts();
}

export async function deleteBroadcast(id: string): Promise<Broadcast[]> {
  const supabase = createClient();
  await supabase.from("broadcasts").delete().eq("id", id);
  return loadBroadcasts();
}

// Read state is tracked separately from the broadcasts themselves, one member's read receipts
// shouldn't affect what anyone else sees as new.
export async function loadReadBroadcastIds(): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("broadcast_reads").select("broadcast_id").eq("user_id", user.id);
  return (data || []).map((r) => r.broadcast_id);
}

export async function markBroadcastRead(id: string): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return loadReadBroadcastIds();
  await supabase.from("broadcast_reads").upsert({ user_id: user.id, broadcast_id: id });
  return loadReadBroadcastIds();
}

export async function markAllBroadcastsRead(broadcasts: Broadcast[]): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || broadcasts.length === 0) return loadReadBroadcastIds();
  await supabase.from("broadcast_reads").upsert(broadcasts.map((b) => ({ user_id: user.id, broadcast_id: b.id })));
  return loadReadBroadcastIds();
}

export function getUnreadCount(broadcasts: Broadcast[], readIds: string[]): number {
  const read = new Set(readIds);
  return broadcasts.filter((b) => !read.has(b.id)).length;
}
