import { HOUSE_MEANINGS, ordinalHouse } from "@/lib/interpretations";
import type { ActivatedPlacement } from "@/types/chart";

// Turns computed transit-to-natal contacts into real readings, in the MY SZN voice.
//
// These cards sit in a row, three across, which is the whole design problem. The previous version
// composed each card on its own from three fixed slots: placement line, a stock definition of the
// aspect, then a sentence about the orb. Every card therefore had the same rhythm, every opposition
// got the same four-clause explanation, and three cards in a row told her each one was "the one you
// are most likely to actually be feeling right now", which cannot be true of three things at once.
//
// So this file composes the SET, not the card. composeTransitContacts takes every contact being
// shown together and guarantees that no two cards share a sentence, an opening move or a closing
// move, and that the timing line appears on exactly one card, the tightest.
//
// The other half of the fix is content. An opposition between Saturn and the Sun is a different
// piece of astrology from an opposition between Uranus and the Midheaven, so the aspect is written
// per transiting planet rather than once for all of them. Nothing here decides what is true: the
// positions, orbs and applying flags come from the Swiss Ephemeris in transits.ts.

type AspectFamily = "conjunction" | "opposition" | "square" | "soft";

function familyOf(aspectType: string): AspectFamily {
  if (aspectType === "conjunction") return "conjunction";
  if (aspectType === "opposition") return "opposition";
  if (aspectType === "square") return "square";
  return "soft";
}

// The headline verb. Hard aspects get the planet at full strength, soft aspects get the version
// that supports rather than grinds, because Saturn trine is not Saturn square.
const VERB_HARD: Record<string, string> = {
  Sun: "is shining a light on",
  Moon: "is stirring up",
  Mercury: "is putting words and thinking around",
  Venus: "is softening and sweetening",
  Mars: "is lighting a fire under",
  Jupiter: "is expanding",
  Saturn: "is applying real pressure to",
  Uranus: "is disrupting",
  Neptune: "is blurring the edges of",
  Pluto: "is transforming, at the root,",
  Chiron: "is pressing on the tender part of",
  "North Node": "is pulling forward",
};

const VERB_SOFT: Record<string, string> = {
  Mars: "is giving useful energy to",
  Saturn: "is steadying and giving structure to",
  Uranus: "is opening up fresh room in",
  Neptune: "is adding imagination to",
  Pluto: "is quietly deepening",
  Chiron: "is helping you make peace with",
};

// What this planet's contact actually asks of a placement. Two phrasings each, so two cards from
// the same transiting planet in one set never open with the same claim.
const DEMAND: Record<string, { hard: string[]; soft: string[] }> = {
  Sun: {
    hard: [
      "The question underneath it is whether this part of you is being lived out loud or kept politely to yourself",
      "Attention lands here for a few days, which tends to make whatever you have been avoiding about it fairly obvious",
    ],
    soft: [
      "There is a warmth to it that makes this part of you easier to own than usual",
      "It is a good few days for being seen doing this rather than doing it quietly",
    ],
  },
  Moon: {
    hard: [
      "It arrives as mood before it arrives as information, so the feeling will be a day or two ahead of the reason",
      "Whatever this touches gets felt at full volume for a day, then settles back down",
    ],
    soft: [
      "Your instincts about this are unusually accurate right now, so the gut read is worth writing down",
      "It softens the edges here, which makes a conversation you have been dreading considerably more possible",
    ],
  },
  Mercury: {
    hard: [
      "It wants this said out loud, and it will keep generating the conversation in your head until some version of it gets out",
      "Expect the thinking to speed up and the certainty to lag behind it",
    ],
    soft: [
      "Words come easily here for a few days, which makes this the window for the message you have been drafting",
      "The thinking is clear rather than loud, which is the rarer and more useful version",
    ],
  },
  Venus: {
    hard: [
      "It raises the question of what you actually want from this, rather than what you have agreed to accept",
      "Desire gets involved, which makes this harder to be sensible about and much easier to be honest about",
    ],
    soft: [
      "There is genuine ease available here, and it will pass unnoticed unless you use it",
      "It makes this part of you more magnetic and considerably less defended",
    ],
  },
  Mars: {
    hard: [
      "The heat is the point. Frustration here is showing you exactly where you have been overriding yourself",
      "It wants action, and it is not fussy about whether the action is wise, so pick the target deliberately",
    ],
    soft: [
      "You have real energy for this right now, and energy is the thing that usually goes missing",
      "Courage is cheaper than usual this week, which is worth spending somewhere specific",
    ],
  },
  Jupiter: {
    hard: [
      "It enlarges whatever it finds, including the parts you would rather keep modest",
      "The temptation is to take on more than the situation can carry, which is Jupiter doing exactly what Jupiter does",
    ],
    soft: [
      "There is room here that was not there last month, and it opens for anybody who asks",
      "This is the kind of luck that requires you to actually put yourself forward for something",
    ],
  },
  Saturn: {
    hard: [
      "It asks what you can realistically carry, and it will not accept an optimistic answer",
      "Responsibility concentrates here, and the parts you have been improvising get found out",
    ],
    soft: [
      "This is the slow, boring, genuinely effective kind of progress, and it holds once it is built",
      "Structure is available for this now, which is usually the thing that was missing",
    ],
  },
  Uranus: {
    hard: [
      "It breaks the arrangement open, usually the one you had decided was permanent",
      "Restlessness here is information rather than a malfunction, and it rarely arrives on a convenient schedule",
    ],
    soft: [
      "Change is available without a crisis attached, which is the unusual version of this planet",
      "It loosens something that has been stuck, and you get to choose what fills the space",
    ],
  },
  Neptune: {
    hard: [
      "Clarity is the thing in short supply here, so this is a poor week to decide anything permanent about it",
      "It dissolves the outline, which is disorienting and occasionally exactly what a rigid situation needed",
    ],
    soft: [
      "Imagination and intuition run high here, which makes it excellent for creating and useless for auditing",
      "Compassion is easier than usual, including toward yourself",
    ],
  },
  Pluto: {
    hard: [
      "Something here gets restructured from underneath, and it takes considerably longer than a week",
      "Power is the theme: where you have it, where you gave it away, and what you have been doing to get it back",
    ],
    soft: [
      "Depth is available without the crisis, which is rare with this planet",
      "It quietly strengthens this, in the way that only shows up when something tests it",
    ],
  },
  Chiron: {
    hard: [
      "The sore spot here is old, and it is being touched rather than created",
      "It aches in a way that tends to be useful, because you can finally see the shape of the thing",
    ],
    soft: [
      "There is a chance to handle this differently without forcing some enormous breakthrough",
      "What you have learned the hard way about this is quietly available to other people right now",
    ],
  },
  "North Node": {
    hard: [
      "This is growth in the direction your chart keeps pointing, which rarely feels comfortable at the time",
      "It pulls this part of you forward, ready or not",
    ],
    soft: [
      "The path of growth is unusually visible here, which makes the next step obvious rather than agonising",
      "Opportunities in this area are pointing somewhere you have been heading for years",
    ],
  },
};

// Written per planet, because an opposition from Saturn and an opposition from Uranus are different
// experiences. This is the table that replaced one stock definition per aspect.
const ASPECT_LINE: Record<string, Record<AspectFamily, string>> = {
  Sun: {
    conjunction: "The transiting Sun is sitting right on it, so it is lit up for about three days and then moves on.",
    opposition: "With the Sun opposite, other people tend to be the mirror, which is a fast way to see something you had missed.",
    square: "The Sun at this angle creates just enough friction to make the issue visible rather than comfortable.",
    soft: "The Sun supporting it makes this easy to express and easy to be recognised for.",
  },
  Moon: {
    conjunction: "The Moon is sitting on it today, so it is loud now and considerably quieter by tomorrow.",
    opposition: "The Moon opposite tends to put the feeling in somebody else's mouth before it reaches yours.",
    square: "The Moon at a square makes it emotional first and reasonable later.",
    soft: "The Moon supporting it means your read on this today is worth trusting.",
  },
  Mercury: {
    conjunction: "Mercury sitting on it puts the whole thing into language, often faster than you meant to say it.",
    opposition: "Mercury opposite usually brings the other side of the argument, delivered by an actual person.",
    square: "Mercury at a square makes the thinking sharp and slightly combative, which is fine on a page and expensive in a text.",
    soft: "Mercury supporting it means this is the week the right words are available for it.",
  },
  Venus: {
    conjunction: "Venus sitting on it makes the whole area more attractive, and slightly harder to be objective about.",
    opposition: "Venus opposite tends to show up through somebody else's taste, affection or money rather than your own.",
    square: "Venus at a square creates want without ease, which is the classic setup for overpaying, emotionally or literally.",
    soft: "Venus supporting it sweetens this, and the good it brings usually arrives through other people.",
  },
  Mars: {
    conjunction: "Mars sitting on it is the accelerator. Direct, fast and short lived.",
    opposition: "Mars opposite tends to arrive as somebody else's aggression, or as a fight you did not plan to have.",
    square: "Mars at a square is the frustrating one: the energy is real and the obstacle is real, and neither is going anywhere quietly.",
    soft: "Mars supporting it means the drive is here and it is pointed somewhere useful for once.",
  },
  Jupiter: {
    conjunction: "Jupiter sitting on it opens the area up, generously and without much sense of proportion.",
    opposition: "Jupiter opposite usually arrives through other people offering more than you asked for.",
    square: "Jupiter at a square overshoots. The opportunity is real and the size of it needs checking.",
    soft: "Jupiter supporting it is the kind of luck that waits politely to be taken up.",
  },
  Saturn: {
    conjunction: "Saturn sitting on it is a long, heavy contact. This is a chapter rather than a week.",
    opposition: "Saturn opposite tends to put the limit outside you: a person, a deadline, a rule, something you cannot simply outwork.",
    square: "Saturn at a square is the blockage that makes you build something properly, usually after a period of trying not to.",
    soft: "Saturn supporting it means anything you build here now is likely to hold.",
  },
  Uranus: {
    conjunction: "Uranus sitting on it is the lightning strike placement. Unpredictable, and rarely on your timetable.",
    opposition: "Uranus opposite usually arrives as somebody else changing the terms while you were still working to the old ones.",
    square: "Uranus at a square makes you restless before you know why, and impatient with an arrangement you agreed to.",
    soft: "Uranus supporting it gives you the freedom to change this without anything having to break first.",
  },
  Neptune: {
    conjunction: "Neptune sitting on it removes the edges, which is beautiful for art and dangerous for contracts.",
    opposition: "Neptune opposite tends to arrive as somebody being unclear with you, or you being unclear with yourself about them.",
    square: "Neptune at a square makes this the area where you are most likely to be telling yourself a slightly kind story.",
    soft: "Neptune supporting it opens the intuitive, creative version of this, which is worth actually using.",
  },
  Pluto: {
    conjunction: "Pluto sitting on it is the deepest contact in the chart. It works over years, not weeks.",
    opposition: "Pluto opposite usually shows up as a power dynamic with somebody else, which is considerably easier to see than your own.",
    square: "Pluto at a square applies pressure until the structure changes, and it has no interest in whether you are ready.",
    soft: "Pluto supporting it deepens this quietly, which tends to be noticed only in hindsight.",
  },
  Chiron: {
    conjunction: "Chiron sitting on it brings the old wound right to the surface, which is uncomfortable and unusually workable.",
    opposition: "Chiron opposite tends to show you the sore spot through somebody else's reaction to you.",
    square: "Chiron at a square keeps catching the same nerve until you do something other than flinch.",
    soft: "Chiron supporting it offers the gentler route to something that usually only moves under pressure.",
  },
  "North Node": {
    conjunction: "The node sitting on it marks the direction of travel, and these contacts tend to be remembered later as turning points.",
    opposition: "The node opposite tends to bring the pull of the familiar up against the thing you are actually growing toward.",
    square: "The node at a square means the growth direction and this part of you are temporarily out of step, which is uncomfortable and instructive.",
    soft: "The node supporting it means moving in this direction currently costs less than usual.",
  },
};

// What the NATAL placement is in her: the thing being worked on.
const NATAL_SUBJECT: Record<string, string> = {
  Sun: "your sense of who you are",
  Moon: "your emotional wiring and what you need to feel safe",
  Mercury: "how you think, speak and make decisions",
  Venus: "how you love, attract and decide what you are worth",
  Mars: "your drive, your anger and how you go after things",
  Jupiter: "where you expand and what you believe is possible",
  Saturn: "your discipline, your fears and where you are being built into an authority",
  Uranus: "your need for freedom and the part of you that breaks rules",
  Neptune: "your imagination, your intuition and your blind spots",
  Pluto: "your deepest power and the things you would rather not look at",
  Chiron: "your core wound and where you are quietly still healing",
  "North Node": "your growth direction, the way your chart keeps pointing you",
  "South Node": "the familiar pattern you keep returning to",
  Ascendant: "the way you meet the world and how people first read you",
  Midheaven: "your career, your reputation and the direction your life visibly points in",
};

// What is actually at stake when that point gets touched. Used so a card can say something about
// the natal placement beyond naming it.
const NATAL_STAKE: Record<string, string> = {
  Sun: "how much of your life is genuinely yours",
  Moon: "whether you feel safe enough to be honest",
  Mercury: "what you are willing to say out loud",
  Venus: "what you think you are worth being given",
  Mars: "what you are prepared to fight for",
  Jupiter: "how big you are letting this get",
  Saturn: "what you can carry without resenting it",
  Uranus: "how much freedom you actually need",
  Neptune: "what you are choosing not to look at clearly",
  Pluto: "who is holding the power here",
  Chiron: "the thing you have learned to work around",
  "North Node": "the direction you keep being pointed in",
  "South Node": "the comfort you keep returning to",
  Ascendant: "the version of you people meet first",
  Midheaven: "what you are publicly building",
};

export interface TransitContactReading {
  /** e.g. "Saturn is applying real pressure to your Venus" */
  headline: string;
  /** two or three sentences interpreting this specific combination */
  body: string;
  /** "exact now" / "building" / "easing off" */
  timing: string;
  orb: number;
}

interface Parts {
  placement: string;
  houseArea: string;
  houseOrdinal: string;
  subject: string;
  stake: string;
  demand: string;
  aspectLine: string;
  planet: string;
  natal: string;
}

// Six different shapes. One card opens on the natal placement, another on what she might be
// feeling, another on the tension between the two bodies, another on the house. Which shape a card
// gets is decided across the whole set so no two cards in a row share an architecture.
const SHAPES: ((x: Parts) => string)[] = [
  (x) => `${x.placement}, so this lands on ${x.subject}. ${x.aspectLine} ${x.demand}, and around here that question is really about ${x.stake}.`,
  (x) => `${x.demand}. ${x.placement}, which is why this shows up through ${x.houseArea}. ${x.aspectLine}`,
  (x) => `${x.aspectLine} ${x.placement}, so ${x.stake} is the part of it that matters. ${x.demand}.`,
  (x) => `This one plays out through ${x.houseArea}, because ${x.placement.charAt(0).toLowerCase()}${x.placement.slice(1)}. It is landing on ${x.subject}. ${x.aspectLine} ${x.demand}.`,
  (x) => `${x.demand}, and with your ${x.natal} in the ${x.houseOrdinal} it has a very specific address. ${x.aspectLine} What is genuinely on the table is ${x.stake}.`,
  (x) => `${x.aspectLine} ${x.demand}. ${x.placement}, so ${x.stake} is where you will notice it first.`,
];

// The timing note. It goes on ONE card per set, the tightest, and it is written per planet so it
// says something about that transit rather than restating the orb the label already shows.
const TIGHT_NOTE: Record<string, string> = {
  Sun: "It is at its brightest today, so whatever it is showing you is showing you now rather than next week.",
  Moon: "This is the peak of it, and the Moon moves fast, so use today rather than planning around it.",
  Mercury: "It is at its sharpest right now, which makes this the day to have the conversation rather than rehearse it.",
  Venus: "It is sitting right on the sweet spot, so this is as easy as this particular contact gets.",
  Mars: "It is at full heat right now, which is worth aiming somewhere on purpose before it aims itself.",
  Jupiter: "It is at its widest right now, so anything you ask for this week is being asked at the generous end of the transit.",
  Saturn: "Saturn is sitting right on the pressure point, which is why this one may be considerably louder than the rest of your week.",
  Uranus: "It is at its most unstable right here, which is where the useful disruptions tend to happen.",
  Neptune: "It is at its haziest right now, so trust the intuition and postpone the paperwork.",
  Pluto: "This is the closest it gets on this pass, and Pluto moves slowly enough that it will be back.",
  Chiron: "The window is at its strongest right here, which is the easiest this particular contact gets.",
  "North Node": "It is exact right now, and nodal contacts tend to be recognised as turning points well after the fact.",
};

// The equivalent for a card sitting wide of exact. Also used once per set at most.
const WIDE_NOTE = "At this distance it reads as the weather behind your week rather than a single event you could point at.";

function partsFor(p: ActivatedPlacement): Parts {
  const family = familyOf(p.aspectType);
  const harmonious = family === "soft";
  const house = HOUSE_MEANINGS[Math.min(Math.max(p.natalHouse, 1), 12) - 1];
  const isAngle = p.natalPlanet === "Ascendant" || p.natalPlanet === "Midheaven";
  const placement = isAngle
    ? `Your ${p.natalPlanet} sits at ${p.natalSign.toLowerCase()}, on the cusp of your ${ordinalHouse(p.natalHouse)} house`
    : `Your ${p.natalPlanet} sits in ${p.natalSign.toLowerCase()} in your ${ordinalHouse(p.natalHouse)} house`;

  const demands = DEMAND[p.activatedBy];
  const pool = demands ? (harmonious ? demands.soft : demands.hard) : [];

  return {
    placement,
    houseArea: house.lifeAreas.slice(0, 2).join(" and "),
    houseOrdinal: `${ordinalHouse(p.natalHouse)} house`,
    subject: NATAL_SUBJECT[p.natalPlanet] ?? "this part of you",
    stake: NATAL_STAKE[p.natalPlanet] ?? "how you want this to work",
    demand: pool[0] ?? "It is worth watching where this lands",
    aspectLine: ASPECT_LINE[p.activatedBy]?.[family] ?? "",
    planet: p.activatedBy,
    natal: p.natalPlanet,
  };
}

// A timing note that repeats a phrase from the card it is being added to is the same failure at a
// smaller scale, so it gets dropped rather than appended.
function echoes(note: string, body: string): boolean {
  const words = note.toLowerCase().replace(/[^a-z ]/g, "").split(" ").filter(Boolean);
  for (let i = 0; i + 5 <= words.length; i++) {
    if (body.toLowerCase().includes(words.slice(i, i + 5).join(" "))) return true;
  }
  return false;
}

function timingFor(orb: number, applying: boolean | undefined): string {
  if (orb <= 1) return applying === false ? "exact now, easing off" : "exact now";
  return applying ? "building" : "easing off";
}

/**
 * Compose every card being shown together.
 *
 * Cards are written as a set on purpose. Sharing a sentence with the card beside it is the single
 * most obvious way this page can look generated, so shapes, demand phrasings and the timing note
 * are allocated across the whole row rather than chosen card by card.
 */
export function composeTransitContacts(
  items: { placement: ActivatedPlacement; applying?: boolean }[],
): TransitContactReading[] {
  // The tightest contact is the only one allowed to claim it is peaking, since three cards cannot
  // each be the one she is most likely to be feeling.
  let tightestIndex = -1;
  let tightestOrb = Infinity;
  items.forEach(({ placement }, i) => {
    if (placement.orb < tightestOrb) {
      tightestOrb = placement.orb;
      tightestIndex = i;
    }
  });
  const widestIndex = items.reduce(
    (best, { placement }, i) => (placement.orb > (items[best]?.placement.orb ?? -1) ? i : best),
    -1,
  );

  const usedShapes = new Set<number>();
  const usedDemands = new Set<string>();
  const usedSentences = new Set<string>();

  return items.map(({ placement: p, applying }, index) => {
    const harmonious = familyOf(p.aspectType) === "soft";
    const verb =
      (harmonious ? VERB_SOFT[p.activatedBy] : undefined) ?? VERB_HARD[p.activatedBy] ?? "is activating";
    const parts = partsFor(p);

    // A demand phrasing already used in this row gets swapped for its alternative.
    const demands = DEMAND[p.activatedBy];
    const pool = demands ? (harmonious ? demands.soft : demands.hard) : [parts.demand];
    parts.demand = pool.find((d) => !usedDemands.has(d)) ?? pool[pool.length - 1];
    usedDemands.add(parts.demand);

    // Shapes are handed out so no two cards in the row share an architecture.
    let shape = (index * 2 + p.natalPlanet.length) % SHAPES.length;
    for (let i = 0; i < SHAPES.length && usedShapes.has(shape); i++) shape = (shape + 1) % SHAPES.length;
    usedShapes.add(shape);

    let body = SHAPES[shape](parts).replace(/\s+/g, " ").trim();

    // Exactly one timing note per row: the tightest contact, or the widest when nothing is close.
    if (index === tightestIndex && p.orb <= 1) {
      const note = TIGHT_NOTE[p.activatedBy];
      if (note && !usedSentences.has(note) && !echoes(note, body)) body = `${body} ${note}`;
    } else if (index === widestIndex && p.orb > 2 && tightestIndex !== widestIndex) {
      if (!usedSentences.has(WIDE_NOTE)) body = `${body} ${WIDE_NOTE}`;
    }

    for (const sentence of body.split(/(?<=\.)\s+/)) usedSentences.add(sentence);

    return {
      headline: `${p.activatedBy} ${verb} your ${p.natalPlanet}`,
      body,
      timing: timingFor(p.orb, applying),
      orb: p.orb,
    };
  });
}
