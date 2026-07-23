import type { Goal } from "@/lib/goals-store";
import { SEASON_CHALLENGES, type ChallengeCategory } from "@/lib/challenges";
import { createClient } from "@/lib/supabase/client";

const SIGNALS_KEY = "myszn_signals";

// Every meaningful action a member takes writes one of these, on top of whatever store
// already records it. This is the one place that can answer "what has she actually done
// lately, and where has she gone quiet", instead of that question requiring a cross-reference
// of five separate localStorage keys that don't know about each other.
export type SignalKind = "goal_set" | "goal_progress" | "challenge_completed" | "journal_entry";

export interface Signal {
  id: string;
  kind: SignalKind;
  category: ChallengeCategory; // matches Goal.category / ChallengeTemplate.category, "general" when a signal has no clear life area (e.g. a free-write journal entry)
  season: string;
  refId?: string; // the goalId / challengeId / journalEntryId this signal is about
  createdAt: string;
}

export function loadSignals(): Signal[] {
  try {
    const raw = localStorage.getItem(SIGNALS_KEY);
    return raw ? (JSON.parse(raw) as Signal[]) : [];
  } catch {
    return [];
  }
}

function saveSignals(signals: Signal[]): void {
  try {
    localStorage.setItem(SIGNALS_KEY, JSON.stringify(signals));
  } catch {
    // ignore
  }
}

export function appendSignal(kind: SignalKind, category: ChallengeCategory, season: string, refId?: string): void {
  const signal: Signal = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, kind, category, season, refId, createdAt: new Date().toISOString() };
  saveSignals([signal, ...loadSignals()]);
  syncSignalToSupabase(signal);
}

async function syncSignalToSupabase(signal: Signal): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("signals").insert({
    id: signal.id,
    user_id: user.id,
    kind: signal.kind,
    category: signal.category,
    season: signal.season,
    ref_id: signal.refId,
    created_at: signal.createdAt,
  });
}

// Pulls the signal log down from Supabase into localStorage, for a member logging in on a
// browser that's never seen her activity history before, without this her avoidance-pattern
// detection would wrongly look freshly-started on every new device.
export async function hydrateSignalsFromSupabase(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: rows } = await supabase
    .from("signals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (!rows || rows.length === 0) return;

  const signals: Signal[] = rows.map((row) => ({
    id: row.id,
    kind: row.kind as SignalKind,
    category: row.category as ChallengeCategory,
    season: row.season,
    refId: row.ref_id || undefined,
    createdAt: row.created_at,
  }));
  saveSignals(signals);
}

export interface AvoidancePattern {
  goal: Goal;
  daysSinceLastSignal: number;
  availableThisSeason: number;
  completedThisSeason: number;
  severity: "avoiding" | "quiet" | "active";
}

// Reads the signal log against a member's active goals to answer the question the app has
// never been able to answer before: not "what could you do", but "what have you actually
// been doing, and where has it gone quiet". A goal counts as active the moment it's created
// (so a fresh goal isn't immediately flagged as avoided), then tracks every goal_progress and
// challenge_completed signal tagged with the same category.
export function detectAvoidance(goals: Goal[], signals: Signal[], seasonSign: string): AvoidancePattern[] {
  const dayMs = 86400000;
  const now = Date.now();

  return goals
    .filter((g) => g.status === "active")
    .map((goal) => {
      const related = signals.filter((s) => s.category === goal.category);
      const lastTs = related.length
        ? Math.max(...related.map((s) => new Date(s.createdAt).getTime()))
        : new Date(goal.createdAt).getTime();
      const daysSinceLastSignal = Math.max(0, Math.floor((now - lastTs) / dayMs));

      const pool = SEASON_CHALLENGES[seasonSign]?.challenges.filter((c) => c.category === goal.category) || [];
      const completedThisSeason = related.filter((s) => s.kind === "challenge_completed" && s.season === seasonSign).length;

      let severity: AvoidancePattern["severity"] = "active";
      if (daysSinceLastSignal >= 7 && completedThisSeason === 0) severity = "avoiding";
      else if (daysSinceLastSignal >= 3) severity = "quiet";

      return { goal, daysSinceLastSignal, availableThisSeason: pool.length, completedThisSeason, severity };
    })
    .sort((a, b) => b.daysSinceLastSignal - a.daysSinceLastSignal);
}
