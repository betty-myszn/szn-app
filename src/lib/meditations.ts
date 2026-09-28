// The meditation library. The membership page has always promised "every meditation... inside your
// own library that grows every month", and this is that library.
//
// Audio lives in /public/meditations and is served straight from the app. That is fine at this
// size, and worth revisiting once there are a dozen of these: a season's meditation is roughly
// 11MB, so twelve a year is around 140MB of repo, at which point they belong in object storage
// with a signed URL rather than in git.
//
// A meditation is either self-hosted audio (src) or a YouTube video (youtubeId). The YouTube ones
// play in an embed inside the member area, so the library can take a recording the moment it is
// uploaded without the file ever landing in git.
//
// Duration is deliberately not stored here. It is read from the audio element's own metadata in
// the browser, so it can never drift out of sync with the file the way a hardcoded number would.

export interface Meditation {
  slug: string;
  title: string;
  /** One line on what this is actually for, shown under the title. */
  purpose: string;
  /** The zodiac season it belongs to, used to surface the right one in your season. Evergreen
   * meditations have none and only live in the library. */
  sign?: string;
  /** Short label for the library card, e.g. "leo szn" or "money". */
  theme: string;
  /** Path under /public, for self-hosted audio. */
  src?: string;
  /** YouTube video id, for meditations hosted there. */
  youtubeId?: string;
  /** Longer framing, shown on the player. */
  intro: string[];
  /** Optional "inside this meditation" list. */
  workingWith?: string[];
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
    theme: "leo szn",
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
  {
    slug: "venus-money",
    title: "Venus Money",
    purpose: "Work with Venus around money, receiving, self-worth, pleasure, desire, standards and the way you relate to wealth.",
    theme: "money",
    youtubeId: "4qC3CrVwaEU",
    intro: [
      "Venus rules value, beauty, attraction, pleasure, relationships and receiving, so we're bringing all of that into your money work and looking at what happens when you feel safer having more, holding more and asking for more.",
      "We'll also explore the connection between money and overworking, proving yourself, undercharging, guilt around receiving and the belief that success has to come through struggle.",
      "Money can support your freedom, your choices, your creativity, your pleasure and the kind of life you actually want to create.",
    ],
    workingWith: [
      "💗 Venus energy for self-worth, pleasure and receiving",
      "💸 Money mindset and subconscious reprogramming",
      "✨ Expanding your capacity to receive and hold more",
      "🌹 Releasing guilt around wanting more",
      "💰 Becoming more comfortable with bigger financial numbers",
      "🪞 Future-self visualisation",
      "🔥 Raising your standards around money, work and value",
      "🧠 Creating a calmer relationship with wealth, visibility and success",
      "🌙 A physical anchor you can use before selling, pricing, posting or receiving money",
    ],
    howTo: [
      "Get comfortable, close your eyes and give yourself the space to fully drop in.",
      "Come back to it whenever you feel yourself slipping into scarcity, overworking, shrinking your desires or questioning how much you're comfortable receiving.",
      "Please don't listen while driving or doing anything that requires your full attention.",
    ],
    publishedAt: "2026-09-28",
  },
];

export function meditationBySlug(slug: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.slug === slug);
}

/** The meditation for a given zodiac season, if one exists yet. */
export function meditationForSign(sign: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.sign?.toLowerCase() === sign.toLowerCase());
}

export function allMeditations(): Meditation[] {
  return [...MEDITATIONS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
