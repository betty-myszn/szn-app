// The subliminal library. Same shape as the YouTube meditations: the page sits behind the proxy
// (FULL_PLATFORM), so it only has to list what's here, newest first.

export interface Subliminal {
  slug: string;
  title: string;
  /** Short label for the card, e.g. "money". */
  theme: string;
  /** One line on what it's for, shown under the title. */
  purpose: string;
  youtubeId: string;
  publishedAt: string;
}

export const SUBLIMINALS: Subliminal[] = [
  {
    slug: "money-affirmations",
    title: "Money Affirmations",
    theme: "money",
    purpose:
      "Money affirmations layered under the sound, rewiring what you believe you're allowed to earn, hold and receive every single time you press play.",
    youtubeId: "ZHT90lYJZJI",
    publishedAt: "2026-10-01",
  },
];

export function allSubliminals(): Subliminal[] {
  return [...SUBLIMINALS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
