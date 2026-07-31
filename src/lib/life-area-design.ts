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
import type { HumanDesignData } from "@/types/human-design";
import { ZODIAC_SIGNS } from "@/types/chart";

export interface AreaGate {
  gate: number;
  name: string;
  keynote: string;
  shadow: string;
  gift: string;
  /** True when this is also one of her natal gates, which is the meaningful double hit. */
  natal: boolean;
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
 * mapping. Gates are filtered to the area's own centres and capped deliberately: showing all of
 * her ~26 activated gates would be a data dump, and the whole point is that two or three specific
 * ones are being lit up right now.
 */
export function composeAreaDesign(
  areaId: string,
  hd: HumanDesignData,
  seasonSign: string,
  maxGates = 3
): AreaDesignReading | null {
  const config = AREA_DESIGN[areaId];
  if (!config) return null;

  const authorityContent = AUTHORITY_CONTENT[hd.authority];
  const typeContent = TYPE_CONTENT[hd.type];

  const seasonGates = gatesForSign(seasonSign);
  const natal = new Set(hd.activatedGates);

  // Only gates that are both switched on by this season and topically relevant to this area.
  const relevant = seasonGates.filter((g) => config.centers.includes(GATE_CENTER[g]));

  // Natal gates first: a season activating something she was actually born with is a far stronger
  // signal than a gate she has no personal connection to, and it should never be buried below one.
  const ranked = relevant.sort((a, b) => {
    const an = natal.has(a) ? 0 : 1;
    const bn = natal.has(b) ? 0 : 1;
    return an - bn || a - b;
  });

  const gates: AreaGate[] = ranked.slice(0, maxGates).map((gate) => {
    const content = GATE_CONTENT[gate];
    return {
      gate,
      name: GATE_NAME[gate] ?? `Gate ${gate}`,
      keynote: content?.keynote ?? "",
      shadow: content?.shadow ?? "",
      gift: content?.gift ?? "",
      natal: natal.has(gate),
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
