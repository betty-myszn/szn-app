"use client";

import { getCurrentSeason, type SeasonInfo } from "@/lib/seasons";

// Season is decided purely by the calendar date table in seasons.ts, a szn starts the day its
// date range says it starts, not whenever the sun's exact ecliptic longitude happens to cross.
export function useSeason(): SeasonInfo {
  return getCurrentSeason();
}
