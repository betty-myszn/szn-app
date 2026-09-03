import type { createAdminClient } from "@/lib/supabase/admin";
import { mentionTokenFor, fullMentionTokenFor } from "@/lib/community/welcome-message";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

/**
 * Turns the "@tokens" in a piece of member-written text into the user ids they mean. This is the
 * ONE place in the app where a name is turned into a person; everything downstream carries the id.
 *
 * A token matches a member's first name or her whole name run together, so both "@Sarah" and
 * "@SarahElizabeth" reach Sarah Elizabeth. Where several members share a first name they are all
 * matched, which is the honest answer when a first name is all the writer gave: telling one extra
 * Sarah is a smaller failure than telling none. Writing the full name picks someone out exactly,
 * which is what the welcome does automatically when it spots a clash.
 */
export async function resolveMentionedUserIds(
  admin: SupabaseAdmin,
  content: string,
  senderId: string
): Promise<string[]> {
  const tokens = new Set([...content.matchAll(/@([A-Za-z0-9_]+)/g)].map((m) => m[1].toLowerCase()));
  if (tokens.size === 0) return [];

  const { data: profiles, error } = await admin.from("profiles").select("id, name");
  if (error) {
    console.error("mentions: could not read profiles to resolve", error.message);
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
