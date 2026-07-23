import { createClient } from "@/lib/supabase/client";

const PREFS_KEY = "myszn_dashboard_prefs";

// Only the reading/content sections are optional, action-oriented sections (goals, journal,
// community, events) always show, "customize" means "what do I want to read", not "what do I
// want to do".
export type DashboardSectionId = "tarot" | "snapshot" | "goalAstrology" | "recommended";

export const DASHBOARD_SECTIONS: { id: DashboardSectionId; label: string; desc: string }[] = [
  { id: "tarot", label: "card of the day", desc: "your daily tarot pull" },
  { id: "snapshot", label: "today's snapshot", desc: "affirmation, cosmic weather and your big 3" },
  { id: "goalAstrology", label: "astrology behind your goal", desc: "only appears once you've set a goal" },
  { id: "recommended", label: "recommended for you", desc: "reading suggestions based on the szn" },
];

export type DashboardPrefs = Record<DashboardSectionId, boolean>;

const DEFAULT_PREFS: DashboardPrefs = { tarot: true, snapshot: true, goalAstrology: true, recommended: true };

export function loadDashboardPrefs(): DashboardPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<DashboardPrefs>) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function saveDashboardPrefs(prefs: DashboardPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
  syncDashboardPrefsToSupabase(prefs);
}

export function toggleDashboardSection(id: DashboardSectionId): DashboardPrefs {
  const prefs = loadDashboardPrefs();
  const updated = { ...prefs, [id]: !prefs[id] };
  saveDashboardPrefs(updated);
  return updated;
}

async function syncDashboardPrefsToSupabase(prefs: DashboardPrefs): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ dashboard_prefs: prefs }).eq("id", user.id);
}

// Pulls saved preferences down from Supabase into localStorage, for a member logging in on a
// browser that's never seen her dashboard customisation before.
export async function hydrateDashboardPrefsFromSupabase(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: row } = await supabase.from("profiles").select("dashboard_prefs").eq("id", user.id).maybeSingle();
  if (row?.dashboard_prefs) saveDashboardPrefsLocalOnly(row.dashboard_prefs as DashboardPrefs);
}

function saveDashboardPrefsLocalOnly(prefs: DashboardPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}
