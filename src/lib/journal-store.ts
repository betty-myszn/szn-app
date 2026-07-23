import { appendSignal } from "@/lib/signals";
import { createClient } from "@/lib/supabase/client";

const ENTRIES_KEY = "myszn_journal_entries";

export type JournalEntryType = "shadow work" | "reflection" | "free write" | "experiment" | "win";

export interface JournalEntry {
  id: string;
  type: JournalEntryType;
  prompt: string | null;
  content: string;
  season: string;
  createdAt: string;
}

export function loadJournalEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntries(entries: JournalEntry[]): void {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function addJournalEntry(entry: Omit<JournalEntry, "id" | "createdAt">): JournalEntry[] {
  const full: JournalEntry = { ...entry, id: `${Date.now()}`, createdAt: new Date().toISOString() };
  const updated = [full, ...loadJournalEntries()];
  saveJournalEntries(updated);
  appendSignal("journal_entry", "general", entry.season, full.id);
  syncJournalEntryToSupabase(full);
  return updated;
}

export function updateJournalEntry(id: string, content: string): JournalEntry[] {
  const updated = loadJournalEntries().map((e) => (e.id === id ? { ...e, content } : e));
  saveJournalEntries(updated);
  syncJournalContentToSupabase(id, content);
  return updated;
}

export function deleteJournalEntry(id: string): JournalEntry[] {
  const updated = loadJournalEntries().filter((e) => e.id !== id);
  saveJournalEntries(updated);
  deleteJournalEntryFromSupabase(id);
  return updated;
}

async function syncJournalEntryToSupabase(entry: JournalEntry): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("journal_entries").upsert({
    id: entry.id,
    user_id: user.id,
    type: entry.type,
    prompt: entry.prompt,
    content: entry.content,
    season: entry.season,
    created_at: entry.createdAt,
  });
}

async function syncJournalContentToSupabase(id: string, content: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("journal_entries").update({ content }).eq("id", id);
}

async function deleteJournalEntryFromSupabase(id: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("journal_entries").delete().eq("id", id);
}

// Pulls journal entries down from Supabase into localStorage, for a member logging in on a
// browser that's never seen her journal before.
export async function hydrateJournalFromSupabase(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: rows } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (!rows || rows.length === 0) return;

  const entries: JournalEntry[] = rows.map((row) => ({
    id: row.id,
    type: row.type as JournalEntryType,
    prompt: row.prompt,
    content: row.content,
    season: row.season,
    createdAt: row.created_at,
  }));
  saveJournalEntries(entries);
}
