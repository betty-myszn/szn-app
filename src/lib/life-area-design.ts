// Human Design woven into the seasonal life-area readings, rather than sitting on a page of its
// own. The two reference charts (/my-chart and /human-design) stay separate, because they are
// genuinely two different maps. But in "your season" nobody cares which system an answer came
// from, they care what this season is asking of them, so here the two speak with one voice:
// astrology says what is happening now, Human Design says how she is built to handle it.
//
// Client-safe on purpose. human-design.ts imports swisseph and is server-only, so the gate maths
// is redone here from the pure reference constants. It is three lines of arithmetic and no
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
  /** What this gate means in THIS area specifically. Gate 26 in love is not gate 26 in money. */
  lens: string;
  /** True when this is also one of her natal gates, which is the meaningful double hit. */
  natal: boolean;
  /** True when the gate sits in one of this area's own centres, so it is core rather than context. */
  core: boolean;
}

export interface AreaDesignReading {
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
      "These are the gates this season is switching on that sit in the centres governing love, intimacy and who you are to another person. Each one has a trap and a gift, and a season tends to hand you both.",
  },
  "health-body": {
    centers: ["sacral", "root", "spleen"],
    authorityBridge:
      "Your body is the one place your authority is not an idea, it is a physical signal. This is the area where overriding it has the most obvious consequences, because the bill arrives as exhaustion rather than as regret.",
    strategyBridge:
      "Human Design is fundamentally an energy mechanic, so this is the area where it has the most to say. Your type describes how your energy is actually built to work, which is usually nothing like how you have been told to work.",
    gatesIntro:
      "These are the gates this season is switching on, read for your body, your energy and how you actually recover. Each one carries a trap and a gift, and a season tends to hand you both.",
  },
  career: {
    centers: ["throat", "heart", "sacral"],
    authorityBridge:
      "Career is where you will be asked to decide fastest, usually by someone with a deadline. Knowing how you are built to reach clarity is what stops you agreeing to things in meetings that you unpick for the next six months.",
    strategyBridge:
      "Your strategy is a rule about how work is meant to arrive for you, and it is the single thing most people override in their career, because the culture rewards the opposite of what most types are built for.",
    gatesIntro:
      "These are the gates this season is switching on, read for your work, your visibility and what you are building. Each one carries a trap and a gift, and a season tends to hand you both.",
  },
  money: {
    centers: ["heart", "sacral", "root"],
    authorityBridge:
      "Money decisions are the ones most often made under time pressure and someone else's urgency, which is exactly when your authority gets overridden. Almost every financial regret traces back to deciding faster than you are built to.",
    strategyBridge:
      "Your type describes how income is actually meant to arrive for you, and it is usually not the hustle model everyone is sold. Working against it is expensive in a way that looks like bad luck.",
    gatesIntro:
      "These are the gates this season is switching on, read for your money, your worth and what you are willing to charge. Each one carries a trap and a gift, and a season tends to hand you both.",
  },
  purpose: {
    centers: ["g", "throat", "heart"],
    authorityBridge:
      "Purpose is the area where everyone else has an opinion, and where borrowed certainty is most tempting. Your authority is the only thing that can tell you whether a direction is genuinely yours or simply impressive.",
    strategyBridge:
      "Your strategy describes how the right thing is meant to find you. Purpose rarely arrives by being chased down, it arrives by being available to it in the way your design actually works.",
    gatesIntro:
      "These are the gates this season is switching on, read for your direction, your purpose and what you are here to be known for. Each one carries a trap and a gift, and a season tends to hand you both.",
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

/**
 * The Human Design layer for one life area in one season, or null when this area has no HD
 * mapping. Every gate that qualifies is returned. There is deliberately no arbitrary limit: the
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

  // Ordering, most personal first: gates she was born with come above ones the season merely
  // activates, and within each group the ones native to this area's centres come first.
  const ranked = [...seasonGates].sort((a, b) => {
    const natalRank = (natal.has(a) ? 0 : 1) - (natal.has(b) ? 0 : 1);
    if (natalRank !== 0) return natalRank;
    const coreRank = (isCore(a) ? 0 : 1) - (isCore(b) ? 0 : 1);
    if (coreRank !== 0) return coreRank;
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
    authority: {
      label: hd.authorityLabel,
      body: `${config.authorityBridge} You have ${authorityContent?.title ?? `${hd.authorityLabel.toLowerCase()} authority`}. ${authorityContent?.meaning ?? ""} ${authorityContent?.apply ?? ""}`.trim(),
    },
    strategy: {
      label: `${hd.type}, ${hd.strategy.toLowerCase()}`,
      body: `${config.strategyBridge} You are a ${hd.type}, so your strategy is to ${hd.strategy.toLowerCase()}. ${typeContent?.apply ?? typeContent?.meaning ?? ""} When this goes wrong you will feel it as ${hd.notSelfTheme.toLowerCase()}, and in this area that is the signal to check whether you initiated something you were meant to wait for.`.trim(),
    },
    gatesIntro: config.gatesIntro,
    gates,
  };
}
