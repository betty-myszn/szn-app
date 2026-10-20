import { createClient } from "@/lib/supabase/client";

// Which Human Design lessons she has opened, for the "4 of 11 read" bar. Saved on her auth account
// (user_metadata.hd_lessons_read, same home as her customise-my-szn picks) so it follows her across
// devices, with localStorage as the fallback for logged-out visitors on the free chart.

const LOCAL_KEY = "myszn_hd_lessons_read";

function readLocal(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function loadHdRead(): Promise<string[]> {
  const local = readLocal();
  try {
    const { data } = await createClient().auth.getSession();
    const remote = data.session?.user?.user_metadata?.hd_lessons_read;
    return Array.from(new Set([...local, ...(Array.isArray(remote) ? remote : [])]));
  } catch {
    return local;
  }
}

export async function saveHdRead(ids: string[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
  } catch {
    // private window: the in-memory state still shows her progress this visit
  }
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session) await supabase.auth.updateUser({ data: { hd_lessons_read: ids } });
  } catch {
    // offline or logged out: local copy is enough
  }
}
