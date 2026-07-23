import type { JournalEntry } from "@/lib/journal-store";

export interface StreakInfo {
  current: number;
  longest: number;
  activeToday: boolean;
}

function toDateKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

// Computes a daily streak from a list of ISO timestamps, any activity on a day counts once.
// Current streak stays alive through "yesterday" so a member checking in the morning doesn't
// see their streak wrongly reset before they've had a chance to act again today.
export function computeStreak(timestamps: string[]): StreakInfo {
  if (timestamps.length === 0) return { current: 0, longest: 0, activeToday: false };

  const uniqueDays = Array.from(new Set(timestamps.map(toDateKey))).sort();
  const dayMs = 86400000;
  const todayKey = toDateKey(new Date().toISOString());
  const activeToday = uniqueDays.includes(todayKey);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]).getTime();
    const curr = new Date(uniqueDays[i]).getTime();
    if (curr - prev === dayMs) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
  }

  // Current streak: walk backwards from the most recent day while consecutive
  let current = 1;
  for (let i = uniqueDays.length - 1; i > 0; i--) {
    const curr = new Date(uniqueDays[i]).getTime();
    const prev = new Date(uniqueDays[i - 1]).getTime();
    if (curr - prev === dayMs) {
      current += 1;
    } else {
      break;
    }
  }

  // If the most recent day is older than yesterday, the streak is broken
  const lastDay = new Date(uniqueDays[uniqueDays.length - 1]).getTime();
  const todayMs = new Date(todayKey).getTime();
  if (todayMs - lastDay > dayMs) {
    current = 0;
  }

  return { current, longest, activeToday };
}

// Any entry type counts toward the journal streak, including wins.
export function computeJournalStreak(entries: JournalEntry[]): StreakInfo {
  return computeStreak(entries.map((e) => e.createdAt));
}
