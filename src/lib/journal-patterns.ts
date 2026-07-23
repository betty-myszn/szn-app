import type { JournalEntry } from "@/lib/journal-store";

// Keyword groups scanned across reflective entries to surface recurring themes the writer
// can't easily see from inside a single entry
const PATTERN_KEYWORDS: Record<string, string[]> = {
  "fear of judgement": ["judg"],
  fear: ["afraid", "scared", "anxious", " fear", "fearful"],
  exhaustion: ["exhaust", "burnt out", "burnout", "tired", "drained"],
  money: ["money", "price", "pricing", "charge", "income", "afford", "expensive"],
  rejection: ["reject"],
  "permission-seeking": ["permission"],
  comparison: ["compar"],
  "hiding or invisibility": ["hiding", "hide", "invisible", "unseen", "small"],
  control: ["control"],
  "not feeling enough": ["not enough", "worthy", "worthless", "good enough"],
};

export function analyzeJournalPatterns(entries: JournalEntry[], currentSeason: string): string[] {
  const textEntries = entries.filter((e) => e.type !== "win");
  if (textEntries.length < 3) return [];

  const counts: Record<string, number> = {};
  const hasGroup: Record<string, boolean[]> = {};

  textEntries.forEach((entry, idx) => {
    const lower = `${entry.content} ${entry.prompt || ""}`.toLowerCase();
    for (const [group, keywords] of Object.entries(PATTERN_KEYWORDS)) {
      const hit = keywords.some((kw) => lower.includes(kw));
      if (!hasGroup[group]) hasGroup[group] = [];
      hasGroup[group][idx] = hit;
      if (hit) counts[group] = (counts[group] || 0) + 1;
    }
  });

  const insights: string[] = [];

  const sortedGroups = Object.entries(counts)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1]);
  if (sortedGroups.length > 0) {
    const [topGroup, topCount] = sortedGroups[0];
    insights.push(`You've mentioned ${topGroup} ${topCount} times across your entries.`);
  }

  const moneyHits = hasGroup["money"] || [];
  const exhaustionHits = hasGroup["exhaustion"] || [];
  let coOccur = 0;
  textEntries.forEach((_, idx) => {
    if (moneyHits[idx] && exhaustionHits[idx]) coOccur++;
  });
  if (coOccur >= 2) insights.push("You often write about exhaustion when discussing money, that pairing is worth noticing.");

  const seasonEntries = textEntries.filter((e) => e.season === currentSeason);
  if (seasonEntries.length >= 3) {
    const seasonCounts: Record<string, number> = {};
    seasonEntries.forEach((entry) => {
      const lower = `${entry.content} ${entry.prompt || ""}`.toLowerCase();
      for (const [group, keywords] of Object.entries(PATTERN_KEYWORDS)) {
        if (keywords.some((kw) => lower.includes(kw))) seasonCounts[group] = (seasonCounts[group] || 0) + 1;
      }
    });
    const sortedSeason = Object.entries(seasonCounts).sort((a, b) => b[1] - a[1]);
    if (sortedSeason.length > 0 && sortedSeason[0][1] >= 2) {
      insights.push(`Your biggest emotional trigger this szn appears to be ${sortedSeason[0][0]}.`);
    }
  }

  return insights.slice(0, 3);
}
