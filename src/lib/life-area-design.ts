// Human Design woven into the seasonal life-area readings, rather than sitting on a page of its
// own. The two reference charts (/my-chart and /human-design) stay separate, because they are
// genuinely two different maps. But in "your season" nobody cares which system an answer came
// from, they care what this season is asking of them, so here the two speak with one voice:
// astrology says what's happening now, Human Design says how she is built to handle it.
//
// Client-safe on purpose. human-design.ts imports swisseph and is server-only, so the gate maths
// is redone here from the pure reference constants. It's three lines of arithmetic and no
// ephemeris is involved: gates map onto fixed slices of the zodiac wheel, so which gates a season
// covers is determined by the sign alone.

import {
  type CenterKey,
  GATE_CENTER,
  GATE_NAME,
  WHEEL_START_DEG,
  GATE_ARC,
} from "@/lib/human-design-constants";
import { GATE_CONTENT } from "@/lib/human-design-gate-content";
import { AUTHORITY_CONTENT, TYPE_CONTENT } from "@/lib/human-design-content";
import { gateLensFor } from "@/lib/area-gate-lens";
import type { HumanDesignData } from "@/types/human-design";
import { ZODIAC_SIGNS } from "@/types/chart";

export interface AreaGate {
  gate: number;
  name: string;
  keynote: string;
  shadow: string;
  gift: string;
  /** What this gate means in THIS area specifically. Gate 26 in love isn't gate 26 in money. */
  lens: string;
  /** True when this is also one of her natal gates, which is the meaningful double hit. */
  natal: boolean;
  /** True when the gate sits in one of this area's own centres, so it's core rather than context. */
  core: boolean;
}

/** A plain-language read on the kind of space her energy actually works in. */
export interface EnvironmentNote {
  headline: string;
  body: string;
}

export interface AreaDesignReading {
  /** Only produced for areas where it genuinely applies, currently home & environment. */
  environment?: EnvironmentNote;
  /** How her authority specifically plays out in this area of life. */
  authority: { label: string; body: string };
  /** How her type and strategy specifically play out in this area. */
  strategy: { label: string; body: string };
  /** Framing sentence for the gates, written per area. */
  gatesIntro: string;
  gates: AreaGate[];
}

interface AreaDesignConfig {
  /** Centres whose gates are topically relevant to this area. */
  centers: CenterKey[];
  /** Area-specific bridge sentences. These sit in front of the generic HD content so the reading
   *  is about love or money, rather than a definition of authority pasted into a love page. */
  authorityBridge: string;
  strategyBridge: string;
  gatesIntro: string;
}

// Deliberately not all twelve areas. Human Design has something genuinely specific to say about
// energy, decision-making and visibility, and very little to say about, for example, style. Forcing
// an HD block into an area where it says nothing is exactly how a feature starts reading as filler,
// so an area with no entry here simply renders no Human Design section at all.
export const AREA_DESIGN: Record<string, AreaDesignConfig> = {
  relationships: {
    centers: ["solarplexus", "g", "heart"],
    authorityBridge:
      "Relationships are where your authority gets tested hardest, because this is the area where other people want an answer from you in the moment and where wanting to please someone is most likely to override what you actually know.",
    strategyBridge:
      "Your strategy is really a rule about how connection is supposed to start for you, and love is where most people break their own rule first.",
    gatesIntro:
      "These are the gates this season is switching on that sit in the centres governing love, intimacy and who you're to another person. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  "health-body": {
    centers: ["sacral", "root", "spleen"],
    authorityBridge:
      "Your body is the one place your authority isn't an idea, it's a physical signal. This is the area where overriding it has the most obvious consequences, because the bill arrives as exhaustion rather than as regret.",
    strategyBridge:
      "Human Design is fundamentally an energy mechanic, so this is the area where it has the most to say. Your type describes how your energy is actually built to work, which is usually nothing like how you've been told to work.",
    gatesIntro:
      "These are the gates this season is switching on, read for your body, your energy and how you actually recover. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  career: {
    centers: ["throat", "heart", "sacral"],
    authorityBridge:
      "Career is where you'll be asked to decide fastest, and it'll be someone else holding the deadline. Knowing how you're built to reach clarity is what stops you agreeing to things in meetings that you unpick for the next six months.",
    strategyBridge:
      "Your strategy is a rule about how work is meant to arrive for you, and it's the single thing most people override in their career, because the culture rewards the opposite of what most types are built for.",
    gatesIntro:
      "These are the gates this season is switching on, read for your work, your visibility and what you're building. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  money: {
    centers: ["heart", "sacral", "root"],
    authorityBridge:
      "Money decisions get made under time pressure and someone else's urgency, which is exactly when your authority gets overridden. Almost every financial regret traces back to deciding faster than you're built to.",
    strategyBridge:
      "Your type describes how income is actually meant to arrive for you, and it's not the hustle model everyone is sold. Working against it's expensive in a way that looks like bad luck.",
    gatesIntro:
      "These are the gates this season is switching on, read for your money, your worth and what you're willing to charge. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  purpose: {
    centers: ["g", "throat", "heart"],
    authorityBridge:
      "Purpose is the area where everyone else has an opinion, and where borrowed certainty is most tempting. Your authority is the only thing that can tell you whether a direction is genuinely yours or simply impressive.",
    strategyBridge:
      "Your strategy describes how the right thing is meant to find you. Purpose rarely arrives by being chased down, it arrives by being available to it in the way your design actually works.",
    gatesIntro:
      "These are the gates this season is switching on, read for your direction, your purpose and what you're here to be known for. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  confidence: {
    centers: ["g", "heart", "throat"],
    authorityBridge:
      "Confidence collapses fastest when you make a decision you knew was wrong for you. Every time you override your authority you file away quiet evidence that you can't trust yourself, and that's what actually erodes it.",
    strategyBridge:
      "Most people's confidence problem isn't a mindset problem, it's a design problem. Living against your type means constant low-grade resistance, and then reading that resistance as proof you're not good enough.",
    gatesIntro:
      "These are the gates this season is switching on, read for how you see yourself and how willing you're to be seen. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  mindset: {
    centers: ["head", "ajna", "throat"],
    authorityBridge:
      "Your mind is brilliant at analysis and it's not your decision maker. This is the single most useful thing Human Design has to say about mindset: thinking harder about a decision your authority should be making is what produces the loop.",
    strategyBridge:
      "The head and ajna are pressure and processing centres, not answer machines. How your type is built to engage the world determines whether that mental pressure becomes insight or becomes anxiety.",
    gatesIntro:
      "These are the gates this season is switching on, read for how you think, what you believe and where your mind goes under pressure. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  "spiritual-growth": {
    centers: ["head", "g", "spleen"],
    authorityBridge:
      "Spiritual growth in Human Design isn't about becoming someone more evolved, it's about becoming more accurately yourself. Following your authority consistently is the practice, and it's far less glamorous than most spiritual advice.",
    strategyBridge:
      "Your open centres are where you take in and amplify other people, and they're also where most borrowed spiritual beliefs get installed. Living your strategy is what gradually separates what's genuinely yours from what you absorbed.",
    gatesIntro:
      "These are the gates this season is switching on, read for your inner life, your beliefs and what you're being asked to unlearn. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  healing: {
    centers: ["spleen", "solarplexus", "root"],
    authorityBridge:
      "Most of what needs healing is stored as a habit of overriding yourself. Your authority is the thing that was there before the conditioning, so returning to it's not a technique, it's the actual repair.",
    strategyBridge:
      "The not-self theme of your type is a diagnostic, not a character flaw. Noticing when it shows up tells you precisely where you're living against your design, which is usually where the wound is being reopened.",
    gatesIntro:
      "These are the gates this season is switching on, read for what's asking to be healed and what you're ready to put down. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
  "home-environment": {
    centers: ["g", "spleen", "root"],
    authorityBridge:
      "Where you're changes how clearly you can hear yourself. This is the area where deciding in the wrong room, at someone else's pace, is most likely to produce a choice you unpick later.",
    strategyBridge:
      "Your space isn't decoration, it's infrastructure for your energy. How you're built to engage the world decides what a room needs to give you before you can do anything else in it.",
    gatesIntro:
      "These are the gates this season is switching on, read for your space, your sense of belonging and where you actually feel like yourself. Each one has a trap and a gift. A season hands you both, so you get to choose which one you run with.",
  },
};

// Which gates a zodiac season covers. The Human Design wheel is the zodiac wheel with a fixed
// offset, so a 30 degree sign always spans roughly six gates and the answer is pure arithmetic.
export function gatesForSign(sign: string): number[] {
  const index = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  if (index < 0) return [];
  const gates = new Set<number>();
  const start = index * 30;
  // Half-degree steps, so a gate boundary sitting mid-sign is never stepped over.
  for (let deg = start; deg < start + 30; deg += 0.5) {
    const adjusted = ((deg - WHEEL_START_DEG) % 360 + 360) % 360;
    gates.add((Math.floor(adjusted / GATE_ARC) % 64) + 1);
  }
  return [...gates];
}

// What kind of space actually suits her, worked out from her open centres. An open centre takes in
// and amplifies whatever is around it, so it's the most honest predictor of which rooms leave her
// energised and which quietly drain her. Deliberately written as the insight rather than the
// mechanics: she doesn't need to know what an open centre is to use this.
const OPEN_CENTRE_ENVIRONMENT: Record<string, string> = {
  sacral: "spaces you can leave. Your energy isn't constant, so a room you can walk out of without explaining yourself matters more than the room itself.",
  solarplexus: "emotionally calm rooms. You pick up the mood of a space and the people in it, so who has been in there lingers for you.",
  spleen: "places your body already trusts. If somewhere feels off on arrival, that's information rather than fussiness.",
  heart: "spaces with nothing to prove. You feel the pressure to earn your place in a room, so choose rooms that don't ask you to.",
  g: "spaces that feel like you, not like a look. Your sense of direction is affected by where you sit, more than most people's.",
  throat: "somewhere you can actually speak. If a space makes you go quiet, it's costing you more than a bit of atmosphere.",
  ajna: "low-noise environments. Other people's certainty is loud in your head, so you think best where there's less of it.",
  head: "spaces without constant new input. Your mind takes on everyone else's questions, so a calm room is a calm head.",
  root: "unhurried spaces. You absorb other people's urgency, so a rushed environment becomes a rushed nervous system.",
};

function environmentNote(hd: HumanDesignData): EnvironmentNote {
  // The two or three most defining open centres, in a fixed priority so the read stays stable.
  const priority = ["solarplexus", "sacral", "root", "spleen", "ajna", "head", "throat", "heart", "g"];
  const open = priority.filter((c) => (hd.openCenters as string[]).includes(c)).slice(0, 3);

  if (open.length === 0) {
    return {
      headline: "You set the tone of a room rather than taking it on",
      body: "You've no open centres, which is rare. You're far less affected by the atmosphere of a space than most people, so the question is less where you can cope and more where you actually want to be. Your environment should be chosen for what you want to create in it.",
    };
  }

  return {
    headline: "Your energy thrives in " + open.map((c) => OPEN_CENTRE_ENVIRONMENT[c].split(".")[0]).join(", "),
    body: open.map((c) => OPEN_CENTRE_ENVIRONMENT[c]).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") + " None of this is about having a nicer home. It's about which rooms let your energy come forward instead of quietly spending it.",
  };
}

/**
 * The Human Design layer for one life area in one season, or null when this area has no HD
 * mapping. Every gate that qualifies is returned. There's deliberately no arbitrary limit: the
 * astrology is already the filter, since a season only covers about six gates and only some of
 * those sit in this area's centres, which lands naturally at one to three. Each gate means
 * something different and a season genuinely presses on each one, so truncating the list would
 * throw away real signal rather than protect anyone from a data dump.
 */
export function composeAreaDesign(
  areaId: string,
  hd: HumanDesignData,
  seasonSign: string
): AreaDesignReading | null {
  const config = AREA_DESIGN[areaId];
  if (!config) return null;

  const authorityContent = AUTHORITY_CONTENT[hd.authority];
  const typeContent = TYPE_CONTENT[hd.type];

  const seasonGates = gatesForSign(seasonSign);
  const natal = new Set(hd.activatedGates);

  // Every gate the season activates, not only the ones sitting in this area's centres. Each of the
  // 64 gates means something different and a season genuinely presses on each one it crosses, so
  // dropping a gate purely because of which centre it lives in threw away real signal. What makes
  // it readable is the lens: the same gate is written differently for love than it would be for
  // money, rather than repeating one universal keynote on every area page.
  const isCore = (gate: number) => config.centers.includes(GATE_CENTER[gate]);

  // Ordering, most RELEVANT-to-this-area first: gates that sit in this area's own centres lead,
  // because on a mindset page the mind gates should come before a money or love gate the season
  // also happens to activate. Within the core group, the ones she was born with come first (the
  // double hit), then by number. The page renders core gates as the main read and the rest as a
  // lighter "also active this season" group, so relevance is obvious at a glance.
  const ranked = [...seasonGates].sort((a, b) => {
    const coreRank = (isCore(a) ? 0 : 1) - (isCore(b) ? 0 : 1);
    if (coreRank !== 0) return coreRank;
    const natalRank = (natal.has(a) ? 0 : 1) - (natal.has(b) ? 0 : 1);
    if (natalRank !== 0) return natalRank;
    return a - b;
  });

  const gates: AreaGate[] = ranked.map((gate) => {
    const content = GATE_CONTENT[gate];
    return {
      gate,
      name: GATE_NAME[gate] ?? `Gate ${gate}`,
      keynote: content?.keynote ?? "",
      shadow: content?.shadow ?? "",
      gift: content?.gift ?? "",
      lens: gateLensFor(areaId, gate, content?.keynote ?? ""),
      natal: natal.has(gate),
      core: isCore(gate),
    };
  });

  return {
    environment: areaId === "home-environment" ? environmentNote(hd) : undefined,
    authority: {
      label: hd.authorityLabel,
      body: `${config.authorityBridge} You've ${authorityContent?.title ?? `${hd.authorityLabel.toLowerCase()} authority`}. ${authorityContent?.meaning ?? ""} ${authorityContent?.apply ?? ""}`.trim(),
    },
    strategy: {
      label: `${hd.type}, ${hd.strategy.toLowerCase()}`,
      body: `${config.strategyBridge} You're a ${hd.type}, so your strategy is to ${hd.strategy.toLowerCase()}. ${typeContent?.apply ?? typeContent?.meaning ?? ""} When this goes wrong you'll feel it as ${hd.notSelfTheme.toLowerCase()}, and in this area that's the signal to check whether you initiated something you were meant to wait for.`.trim(),
    },
    gatesIntro: config.gatesIntro,
    gates,
  };
}
