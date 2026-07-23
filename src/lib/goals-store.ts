import { appendSignal } from "@/lib/signals";
import { getCurrentSeason } from "@/lib/seasons";
import { createClient } from "@/lib/supabase/client";

const GOALS_KEY = "myszn_goals";

export type GoalCategory = "career" | "business" | "purpose" | "money" | "love" | "confidence" | "wellbeing";

export interface GoalProgressEntry {
  id: string;
  note: string;
  progress: number;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  status: "active" | "completed";
  createdAt: string;
  progress: number; // 0-100
  progressLog: GoalProgressEntry[];
}

export const CATEGORY_STYLES: Record<GoalCategory, { bg: string; color: string }> = {
  career: { bg: "var(--mint)", color: "#0F6E56" },
  business: { bg: "#E8F3FF", color: "#1A5FA8" },
  purpose: { bg: "#F3E8FF", color: "#6B21A8" },
  money: { bg: "var(--gold)", color: "#854F0B" },
  love: { bg: "var(--pink-light)", color: "#993556" },
  confidence: { bg: "var(--lav-light)", color: "#3C2A70" },
  wellbeing: { bg: "var(--cream)", color: "#5F5E5A" },
};

export function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Goal[];
    // Backfill progress fields for goals saved before the progress database existed.
    return parsed.map((g) => ({ ...g, progress: g.progress ?? 0, progressLog: g.progressLog ?? [] }));
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch {
    // ignore
  }
}

export function addGoal(title: string, category: GoalCategory): Goal[] {
  const goal: Goal = {
    id: `${Date.now()}`,
    title: title.trim(),
    category,
    status: "active",
    createdAt: new Date().toISOString(),
    progress: 0,
    progressLog: [],
  };
  const updated = [goal, ...loadGoals()];
  saveGoals(updated);
  appendSignal("goal_set", category, getCurrentSeason().sign, goal.id);
  syncGoalToSupabase(goal);
  return updated;
}

async function syncGoalToSupabase(goal: Goal): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("goals").upsert({
    id: goal.id,
    user_id: user.id,
    title: goal.title,
    category: goal.category,
    status: goal.status,
    progress: goal.progress,
    created_at: goal.createdAt,
  });
}

async function syncGoalProgressToSupabase(goalId: string, entry: GoalProgressEntry): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("goal_progress").insert({
    id: entry.id,
    goal_id: goalId,
    user_id: user.id,
    note: entry.note,
    progress: entry.progress,
    created_at: entry.createdAt,
  });
  await supabase.from("goals").update({ progress: entry.progress }).eq("id", goalId);
}

// Pulls goals + their progress logs down from Supabase into localStorage, for a member who's
// logging in on a browser that's never seen her goals before.
export async function hydrateGoalsFromSupabase(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: goalRows } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (!goalRows || goalRows.length === 0) return;

  const { data: progressRows } = await supabase
    .from("goal_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const goals: Goal[] = goalRows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category as GoalCategory,
    status: row.status as Goal["status"],
    createdAt: row.created_at,
    progress: row.progress,
    progressLog: (progressRows || [])
      .filter((p) => p.goal_id === row.id)
      .map((p) => ({ id: p.id, note: p.note, progress: p.progress, createdAt: p.created_at })),
  }));

  saveGoals(goals);
}

// Records a progress check-in: updates the goal's current % and appends a dated log entry so the
// member can see how a goal actually moved over time, not just where it stands right now.
export function logGoalProgress(goalId: string, progress: number, note: string): Goal[] {
  const entry: GoalProgressEntry = { id: `${Date.now()}`, note: note.trim(), progress, createdAt: new Date().toISOString() };
  const updated = loadGoals().map((g) =>
    g.id === goalId ? { ...g, progress, progressLog: [entry, ...g.progressLog] } : g
  );
  saveGoals(updated);
  const goal = updated.find((g) => g.id === goalId);
  if (goal) appendSignal("goal_progress", goal.category, getCurrentSeason().sign, goal.id);
  syncGoalProgressToSupabase(goalId, entry);
  return updated;
}

// The goal other pages personalise around: the most recently created active goal. This is
// deliberately simple (one clear "north star" at a time) rather than trying to juggle several.
export function getPrimaryGoal(): Goal | null {
  const active = loadGoals().filter((g) => g.status === "active");
  return active[0] || null;
}

// Loosely maps a life-area id (from lib/life-areas.ts) to the goal category it's most related
// to, so a life area page can surface the member's actual goal when it's relevant, not just
// generic astrology. Falls back to "wellbeing" for the areas that don't map cleanly.
export const LIFE_AREA_TO_GOAL_CATEGORY: Record<string, GoalCategory> = {
  mindset: "confidence",
  confidence: "confidence",
  career: "career",
  business: "business",
  purpose: "purpose",
  money: "money",
  "style-fashion": "confidence",
  relationships: "love",
  "health-body": "wellbeing",
  "home-environment": "wellbeing",
  "spiritual-growth": "wellbeing",
  healing: "wellbeing",
};

// The reverse of the mapping above: which life area's chart + transit reading should back a
// given goal category's "this szn" timing. One canonical area per category so a goal always has
// a single real, chart-based source of timing guidance instead of generic static copy.
export const GOAL_CATEGORY_TO_LIFE_AREA: Record<GoalCategory, string> = {
  career: "career",
  business: "business",
  purpose: "purpose",
  money: "money",
  love: "relationships",
  confidence: "confidence",
  wellbeing: "health-body",
};
