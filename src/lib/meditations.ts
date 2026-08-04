// The meditation library. The membership page has always promised "every meditation... inside your
// own library that grows every month", and this is that library.
//
// Audio lives in /public/meditations and is served straight from the app. That is fine at this
// size, and worth revisiting once there are a dozen of these: a season's meditation is roughly
// 11MB, so twelve a year is around 140MB of repo, at which point they belong in object storage
// with a signed URL rather than in git.
//
// Duration is deliberately not stored here. It is read from the audio element's own metadata in
// the browser, so it can never drift out of sync with the file the way a hardcoded number would.

export interface Meditation {
  slug: string;
  title: string;
  /** One line on what this is actually for, shown under the title. */
  purpose: string;
  /** The zodiac season it belongs to, used to surface the right one in your season. */
  sign: string;
  /** Path under /public. */
  src: string;
  /** Longer framing, shown on the player. */
  intro: string[];
  /** What to do with it, kept short because nobody reads instructions before a meditation. */
  howTo: string[];
  publishedAt: string;
}

export const MEDITATIONS: Meditation[] = [
  {
    slug: "leo-season-main-character",
    title: "Main Character",
    purpose: "A Leo season meditation for stepping out of the background of your own life.",
    sign: "Leo",
    src: "/meditations/leo-season-main-character.mp3",
    intro: [
      "Leo season asks one thing of you: stop shrinking. This meditation is for the part of you that already knows what she wants and has been waiting for permission that was never going to arrive from anyone else.",
      "It is not about performing confidence. It is about coming back to the version of you that existed before you learned to make yourself easier to be around.",
    ],
    howTo: [
      "Headphones if you have them, somewhere you will not be interrupted.",
      "Lying down is fine. Falling asleep partway through is also fine.",
      "Repeat it across the season rather than once. This one works by accumulation.",
    ],
    publishedAt: "2026-08-04",
  },
];

export function meditationBySlug(slug: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.slug === slug);
}

/** The meditation for a given zodiac season, if one exists yet. */
export function meditationForSign(sign: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.sign.toLowerCase() === sign.toLowerCase());
}

export function allMeditations(): Meditation[] {
  return [...MEDITATIONS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
