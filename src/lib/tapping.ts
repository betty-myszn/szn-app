// The tapping library: short EFT sessions cut out of the workshop replays, grouped by the feeling
// they move. Nothing is re-edited or re-uploaded. Each session is a start and end time inside a
// replay that already exists, so a new one is a few lines here plus its times in tapping-clips.ts.
//
// This file is bundled into the page, so it holds no video ids and no times. Those live in
// tapping-clips.ts (server only) and come from /api/tapping/clip, members only, the same way the
// workshop replays work.

export interface TappingSession {
  slug: string;
  title: string;
  /** Short label for the card, e.g. "confidence". */
  theme: string;
  /** One line on when to press play. Every card's line is written to stand on its own. */
  purpose: string;
  /** Rounded length, shown on the card so she knows what she's committing to. */
  minutes: number;
  /** The workshop it came from, shown as a credit under the player. */
  from: string;
  cover: string;
  /** What the rounds actually work through, in the order she taps them. */
  inside: string[];
  /** The next session to play when this one runs straight into another, e.g. the selling round. */
  next?: string;
}

export const TAPPING: TappingSession[] = [
  {
    slug: "tapping-to-be-seen",
    title: "Tapping to be seen",
    theme: "confidence",
    purpose: "For when you want to post, speak, launch or go live and your whole body is screaming absolutely not.",
    minutes: 8,
    from: "Visible AF: How to Show Up & Get Paid",
    cover: "/visible-af-cover.jpg",
    inside: [
      "The setup: the part of you that wants to be seen and the part that is terrified of being looked at",
      "Fear of judgement, of being too much, of people from your past watching",
      "Outgrowing people and the old \"who does she think she is\" voice",
      "Perfection as a hiding place, and letting other people's opinions be theirs",
    ],
    next: "tapping-to-sell-without-shrinking",
  },
  {
    slug: "tapping-to-sell-without-shrinking",
    title: "Tapping to sell without shrinking",
    theme: "money confidence",
    purpose: "Three minutes for right before you say your price out loud, share the offer or hit send on the sales email.",
    minutes: 3,
    from: "Visible AF: How to Show Up & Get Paid",
    cover: "/visible-af-cover.jpg",
    inside: [
      "Selling makes your desire visible, and that is allowed",
      "People seeing your prices, saying no or scrolling past, and you staying safe anyway",
      "Holding more attention, more money and more people watching without shrinking",
    ],
  },
  {
    slug: "tapping-to-trust-your-big-dreams",
    title: "Tapping to trust your big dreams",
    theme: "follow-through",
    purpose: "For the dream you keep parking until it can be perfect, and the thing you keep meaning to start on Monday.",
    minutes: 4,
    from: "Virgo New Moon Circle",
    cover: "/virgo-new-moon-cover.jpg",
    inside: [
      "Dreams that feel too big or like they belong to someone else",
      "Fear of failing in public, and the sneakier fear of actually succeeding",
      "Trusting yourself with your own desires and changing the plan without dropping the vision",
      "Daily habits as promises you keep to yourself",
    ],
  },
  {
    slug: "tapping-to-want-more",
    title: "Tapping to want more",
    theme: "receiving",
    purpose: "For when you've talked yourself out of wanting it before anyone else got the chance to.",
    minutes: 5,
    from: "Libra SZN / Aries Full Moon: Call In Your Venus Era",
    cover: "/venus-era-cover.jpg",
    inside: [
      "Wanting too much, and the fear of being judged for wanting more",
      "Forcing, proving and pretending you don't need anyone",
      "People-pleasing, keeping the peace and putting yourself back in the equation",
      "Letting money, love and good things arrive without burning out to earn them",
    ],
  },
];

export function tappingBySlug(slug: string): TappingSession | undefined {
  return TAPPING.find((t) => t.slug === slug);
}
