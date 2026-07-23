import { SEASON_CHALLENGES } from "@/lib/challenges";

export interface CommunityProgress {
  poolSize: number;
  yourCompleted: number;
}

// Real progress only, the community leaderboard becomes meaningful once the membership
// backend can aggregate other members' real completions.
export function getCommunityProgress(seasonSign: string, yourCompleted: number): CommunityProgress {
  const pool = SEASON_CHALLENGES[seasonSign]?.challenges.filter((c) => !c.hidden) || [];
  return { poolSize: pool.length, yourCompleted };
}
