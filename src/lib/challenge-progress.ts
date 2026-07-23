import { computeStreak, type StreakInfo } from "@/lib/streaks";
import { SEASON_CHALLENGES, type ChallengeTemplate, type ChallengeCategory } from "@/lib/challenges";
import { appendSignal } from "@/lib/signals";
import { createClient } from "@/lib/supabase/client";

const PROGRESS_KEY = "myszn_challenge_progress";

export interface ChallengeCompletion {
  season: string;
  challengeId: string;
  category: ChallengeCategory;
  xp: number;
  completedAt: string;
  hidden?: boolean;
}

export interface ChallengeProgress {
  completions: ChallengeCompletion[];
  totalXp: number;
}

const EMPTY: ChallengeProgress = { completions: [], totalXp: 0 };

export function loadChallengeProgress(): ChallengeProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as ChallengeProgress) : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

function saveChallengeProgress(progress: ChallengeProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export function isChallengeCompleted(progress: ChallengeProgress, season: string, challengeId: string): boolean {
  return progress.completions.some((c) => c.season === season && c.challengeId === challengeId);
}

export function completeChallenge(season: string, challenge: ChallengeTemplate): ChallengeProgress {
  const progress = loadChallengeProgress();
  if (isChallengeCompleted(progress, season, challenge.id)) return progress;

  const completion: ChallengeCompletion = {
    season,
    challengeId: challenge.id,
    category: challenge.category,
    xp: challenge.xp,
    completedAt: new Date().toISOString(),
    hidden: challenge.hidden,
  };
  const updated: ChallengeProgress = {
    completions: [completion, ...progress.completions],
    totalXp: progress.totalXp + challenge.xp,
  };
  saveChallengeProgress(updated);
  appendSignal("challenge_completed", challenge.category, season, challenge.id);
  syncChallengeCompletionToSupabase(completion);
  return updated;
}

async function syncChallengeCompletionToSupabase(completion: ChallengeCompletion): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("challenge_completions").upsert(
    {
      user_id: user.id,
      season: completion.season,
      challenge_id: completion.challengeId,
      category: completion.category,
      xp: completion.xp,
      hidden: completion.hidden || false,
      completed_at: completion.completedAt,
    },
    { onConflict: "user_id,season,challenge_id" }
  );
}

// Pulls challenge completions down from Supabase into localStorage, for a member logging in on
// a browser that's never seen her season progress before.
export async function hydrateChallengeProgressFromSupabase(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: rows } = await supabase
    .from("challenge_completions")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false });
  if (!rows || rows.length === 0) return;

  const completions: ChallengeCompletion[] = rows.map((row) => ({
    season: row.season,
    challengeId: row.challenge_id,
    category: row.category as ChallengeCategory,
    xp: row.xp,
    completedAt: row.completed_at,
    hidden: row.hidden,
  }));
  saveChallengeProgress({ completions, totalXp: completions.reduce((sum, c) => sum + c.xp, 0) });
}

export function computeChallengeStreak(progress: ChallengeProgress): StreakInfo {
  return computeStreak(progress.completions.map((c) => c.completedAt));
}

export interface SeasonStats {
  completedCount: number;
  xpEarned: number;
}

export function getSeasonStats(progress: ChallengeProgress, season: string): SeasonStats {
  const seasonCompletions = progress.completions.filter((c) => c.season === season);
  return {
    // Excludes the hidden bonus challenge so this stays a clean X / Y against the regular pool.
    completedCount: seasonCompletions.filter((c) => !c.hidden).length,
    xpEarned: seasonCompletions.reduce((sum, c) => sum + c.xp, 0),
  };
}

// --- Badges --------------------------------------------------------------------------

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const BADGE_DEFS: Badge[] = [
  { id: "first-move", label: "first move", emoji: "\u{2728}", description: "completed your first seasonal challenge" },
  { id: "five-day-streak", label: "on a roll", emoji: "\u{1F525}", description: "5 day challenge streak" },
  { id: "ten-day-streak", label: "unstoppable", emoji: "\u{1F451}", description: "10 day challenge streak" },
  { id: "ten-completed", label: "proof collector", emoji: "\u{1F4C8}", description: "completed 10 challenges total" },
  { id: "twenty-five-completed", label: "certified iconic", emoji: "\u{1F48E}", description: "completed 25 challenges total" },
  { id: "season-closer", label: "season closer", emoji: "\u{1F3C6}", description: "completed every challenge in a season" },
  { id: "goal-getter", label: "goal getter", emoji: "\u{1F3AF}", description: "completed 5 challenges matching your active goal" },
];

export function getEarnedBadges(progress: ChallengeProgress, goalCategory?: ChallengeCategory | null): Badge[] {
  const earned: string[] = [];
  const streak = computeChallengeStreak(progress);
  const total = progress.completions.length;

  if (total >= 1) earned.push("first-move");
  if (streak.longest >= 5) earned.push("five-day-streak");
  if (streak.longest >= 10) earned.push("ten-day-streak");
  if (total >= 10) earned.push("ten-completed");
  if (total >= 25) earned.push("twenty-five-completed");
  if (goalCategory) {
    const matched = progress.completions.filter((c) => c.category === goalCategory).length;
    if (matched >= 5) earned.push("goal-getter");
  }

  const seasonsCompleted = new Set(
    Object.entries(SEASON_CHALLENGES)
      .filter(([sign, set]) => {
        const done = new Set(progress.completions.filter((c) => c.season === sign).map((c) => c.challengeId));
        return set.challenges.every((c) => done.has(c.id));
      })
      .map(([sign]) => sign)
  );
  if (seasonsCompleted.size > 0) earned.push("season-closer");

  return BADGE_DEFS.filter((b) => earned.includes(b.id));
}

export function getAllBadges(): Badge[] {
  return BADGE_DEFS;
}
