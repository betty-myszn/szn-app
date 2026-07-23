import { createClient } from "@/lib/supabase/client";

const PREFS_KEY = "myszn_email_prefs";

export type EmailPrefId = "newSznDrops" | "eventReminders" | "communityHighlights";

export const EMAIL_PREF_FIELDS: { id: EmailPrefId; label: string; desc: string }[] = [
  { id: "newSznDrops", label: "new szn drops", desc: "when a new season's content goes live" },
  { id: "eventReminders", label: "event reminders", desc: "before every live workshop" },
  { id: "communityHighlights", label: "community highlights", desc: "the best of the feed, weekly" },
];

export type EmailPrefs = Record<EmailPrefId, boolean>;

const DEFAULT_PREFS: EmailPrefs = { newSznDrops: true, eventReminders: true, communityHighlights: false };

export function loadEmailPrefs(): EmailPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<EmailPrefs>) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function saveEmailPrefs(prefs: EmailPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
  syncEmailPrefsToSupabase(prefs);
}

async function syncEmailPrefsToSupabase(prefs: EmailPrefs): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ email_prefs: prefs }).eq("id", user.id);
}

// Pulls saved preferences down from Supabase into localStorage, for a member logging in on a
// browser that's never seen her email preferences before.
export async function hydrateEmailPrefsFromSupabase(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: row } = await supabase.from("profiles").select("email_prefs").eq("id", user.id).maybeSingle();
  if (row?.email_prefs) {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(row.email_prefs));
    } catch {
      // ignore
    }
  }
}
