// The general astrology classes: evergreen teaching on the big cosmic stuff, kept apart from the
// season workshops because they have no live date and never leave the shelf.
//
// Same split as workshops.ts: this file is safe for the browser, the YouTube ids are not. They
// live in workshop-replays.ts under these ids and only /api/workshops/replay hands them out.

export interface AstrologyClass {
  id: string;
  /** Short kicker above the title, e.g. "saturn return". */
  label: string;
  title: string;
  blurb: string;
}

export const ASTROLOGY_CLASSES: AstrologyClass[] = [
  {
    id: "astrology-saturn-return",
    label: "saturn return",
    title: "What a Saturn return is, and how to survive it",
    blurb:
      "Your Saturn return lands somewhere between 27 and 30, and it's the reason everything you built on someone else's terms suddenly starts to wobble. This is what it is, what it's asking of you, and how to get throughhh it as the version of you who finally builds a life that's HERS.",
  },
  {
    id: "astrology-pluto-in-aquarius",
    label: "pluto in aquarius",
    title: "Welcome to the new age: Pluto in Aquarius",
    blurb:
      "Pluto moved into Aquarius for good in November 2024 and stays until 2044, so this is the backdrop for the next twenty years of your life. Here's what that shift means for power, tech, community and the way we all live and work, and how to ride it SO well that it carries you instead of dragging you.",
  },
];
