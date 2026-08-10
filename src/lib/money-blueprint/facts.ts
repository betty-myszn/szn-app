import type { ChartData, PlanetPosition, Aspect } from "@/types/chart";

/**
 * Money Blueprint derivation: ChartData (+ Human Design) in, MoneyChartFacts out.
 *
 * The engine owns facts, the bank and the writer own voice. Everything here is deterministic and
 * pure, so the report can never invent a placement: the generator is only ever handed facts that
 * were derived from the real ephemeris. See money-blueprint/content-bank/SCHEMA.md.
 *
 * Astrology and Human Design are both first-class here. They run off the same birth data and the
 * same Swiss Ephemeris (lib/astrology.ts, lib/human-design.ts), so a single fact set can carry a
 * placement and the gate or open centre that colours it, which is what makes the "how did they
 * know that" combinations possible.
 */

/** Money-relevant houses. 2nd = income and self-worth, 8th = other people's money, 11th =
 *  audience and network, 10th = career and visibility, 6th = daily work. */
export const MONEY_HOUSES = [2, 6, 8, 10, 11] as const;

/** Traditional/modern rulers, keyed by sign, as planet ids matching lib/astrology.ts. */
const SIGN_RULER: Record<string, string> = {
  Aries: "mars",
  Taurus: "venus",
  Gemini: "mercury",
  Cancer: "moon",
  Leo: "sun",
  Virgo: "mercury",
  Libra: "venus",
  Scorpio: "pluto",
  Sagittarius: "jupiter",
  Capricorn: "saturn",
  Aquarius: "uranus",
  Pisces: "neptune",
};

const ELEMENT: Record<string, "fire" | "earth" | "air" | "water"> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Cancer: "water", Scorpio: "water", Pisces: "water",
};

const MODALITY: Record<string, "cardinal" | "fixed" | "mutable"> = {
  Aries: "cardinal", Cancer: "cardinal", Libra: "cardinal", Capricorn: "cardinal",
  Taurus: "fixed", Leo: "fixed", Scorpio: "fixed", Aquarius: "fixed",
  Gemini: "mutable", Virgo: "mutable", Sagittarius: "mutable", Pisces: "mutable",
};

/** The planets whose condition actually moves a money reading. Uranus and Neptune are here because
 *  they rule Aquarius and Pisces, so for those risings they are the chart ruler and the report's
 *  whole frame, and because §28 Risks reads Neptune contacts directly. */
const MONEY_PLANETS = ["venus", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "mars", "mercury", "moon", "sun", "lilith", "north_node", "south_node", "part_of_fortune"] as const;

/** Minimal shape we need from lib/human-design.ts, kept structural so this module does not
 *  depend on that file's internals and stays unit-testable with a fixture. */
export interface HumanDesignFactsInput {
  type: string;
  strategy: string;
  notSelfTheme: string;
  signature: string;
  authority: string;
  authorityLabel: string;
  profile: string;
  definition: string;
  incarnationCross: { angle: string; gates: number[] };
  activatedGates: number[];
  definedChannels: Array<{ gates: [number, number]; centers: [string, string] } | { gates: number[]; centers: string[] }>;
  definedCenters: string[];
  openCenters: string[];
}

export interface PlacementFact {
  planet: string;
  sign: string;
  house: number;
  retrograde: boolean;
  degree: number;
}

export interface HouseFact {
  house: number;
  sign: string;
  /** Ruler of the cusp sign, and where that ruler actually lives. This is what gives every buyer
   *  something specific to read even when the house is empty, which is the common case. */
  ruler: string;
  rulerSign: string | null;
  rulerHouse: number | null;
  /** Planets sitting in the house itself. Often empty, deliberately. */
  occupants: string[];
}

export interface AspectFact {
  a: string;
  b: string;
  type: string;
  orb: number;
  /** Squares, oppositions and conjunctions to Saturn/Pluto/Chiron carry the wound stories. */
  hard: boolean;
}

export interface MoneyChartFacts {
  name: string;
  /** Money-relevant placements, keyed by planet id. */
  placements: Record<string, PlacementFact>;
  /** The money houses, each with its ruler traced to where it lands. */
  houses: Record<number, HouseFact>;
  /** Ruler of the rising sign, the frame the whole reading sits inside. */
  chartRuler: { planet: string; sign: string | null; house: number | null } | null;
  risingSign: string | null;
  /** Aspects between money-relevant bodies only. */
  aspects: AspectFact[];
  /** Planets retrograde at birth, which changes how worth is internalised. */
  retrogrades: string[];
  /** Element and modality counts, which decide practices and how money is handled. */
  balance: {
    elements: Record<"fire" | "earth" | "air" | "water", number>;
    modalities: Record<"cardinal" | "fixed" | "mutable", number>;
    dominantElement: "fire" | "earth" | "air" | "water";
    lackingElements: Array<"fire" | "earth" | "air" | "water">;
    dominantModality: "cardinal" | "fixed" | "mutable";
  };
  /** Three or more planets in one sign or house, the loudest signal in a chart. */
  stelliums: Array<{ kind: "sign" | "house"; where: string | number; planets: string[] }>;
  /** Human Design, when available. Astrology alone still produces a complete report. */
  humanDesign: HumanDesignFactsInput | null;
  /** Every factor the report is entitled to speak about, for the "Read from" band and the
   *  appendix table. If it is not in here, no section may assert it. */
  readFrom: string[];
}

function planetById(chart: ChartData, id: string): PlanetPosition | undefined {
  return chart.planets.find((p) => p.id === id);
}

function houseOfLongitude(chart: ChartData, longitude: number): number | null {
  const cusps = chart.houses;
  if (!cusps?.length) return null;
  for (let i = 0; i < 12; i++) {
    const start = cusps[i].longitude;
    const end = cusps[(i + 1) % 12].longitude;
    const norm = (x: number) => ((x % 360) + 360) % 360;
    const s = norm(start);
    const e = norm(end);
    const l = norm(longitude);
    const inside = s < e ? l >= s && l < e : l >= s || l < e;
    if (inside) return cusps[i].house;
  }
  return null;
}

const HARD_TYPES = new Set(["square", "opposition"]);
const HEAVY = new Set(["saturn", "pluto", "chiron", "lilith"]);

/** Calculated points and the nodes are not planets, and counting them as stellium members or as
 *  evidence of a temperament inflates both. A Part of Fortune in Taurus does not make someone
 *  earthy, and three bodies in a house is only a stellium if they are actually planets.
 *  Shared with flags.ts so the planner and the sections cannot disagree about what a stellium is. */
const NOT_A_PLANET = ["north_node", "south_node", "part_of_fortune", "lilith", "chiron"];

export function classicalBodies<T extends { id: string }>(planets: T[]): T[] {
  return planets.filter((p) => !NOT_A_PLANET.includes(p.id));
}

export function deriveMoneyFacts(
  chart: ChartData,
  humanDesign: HumanDesignFactsInput | null = null
): MoneyChartFacts {
  const readFrom: string[] = [];

  // --- placements -------------------------------------------------------------------------
  const placements: Record<string, PlacementFact> = {};
  for (const id of MONEY_PLANETS) {
    const p = planetById(chart, id);
    if (!p) continue;
    placements[id] = {
      planet: id,
      sign: p.sign,
      house: p.house,
      retrograde: p.retrograde,
      degree: p.degree,
    };
    readFrom.push(`${p.name} in ${p.sign}${p.house ? ` in the ${ordinal(p.house)} house` : ""}${p.retrograde ? " retrograde" : ""}`);
  }

  // --- houses and their rulers ---------------------------------------------------------------
  // All twelve are derived, because the roots and purpose sections read the 4th, the 3rd and
  // wherever the nodes land. Only the money houses go into the appendix band, which is a display
  // choice: the report is entitled to speak about any house it was handed.
  const houses: Record<number, HouseFact> = {};
  for (let h = 1; h <= 12; h++) {
    const cusp = chart.houses?.find((c) => c.house === h);
    if (!cusp) continue;
    const rulerId = SIGN_RULER[cusp.sign];
    const ruler = rulerId ? planetById(chart, rulerId) : undefined;
    const occupants = chart.planets.filter((p) => p.house === h).map((p) => p.id);
    houses[h] = {
      house: h,
      sign: cusp.sign,
      ruler: rulerId ?? "",
      rulerSign: ruler?.sign ?? null,
      rulerHouse: ruler?.house ?? null,
      occupants,
    };
    if ((MONEY_HOUSES as readonly number[]).includes(h)) {
      readFrom.push(
        `${ordinal(h)} house in ${cusp.sign}` +
          (ruler ? `, ruled by ${ruler.name} in the ${ordinal(ruler.house)} house` : "")
      );
    }
  }

  // --- chart ruler ------------------------------------------------------------------------
  const ascHouse = chart.houses?.find((c) => c.house === 1);
  const risingSign = ascHouse?.sign ?? null;
  let chartRuler: MoneyChartFacts["chartRuler"] = null;
  if (risingSign) {
    const rid = SIGN_RULER[risingSign];
    const rp = rid ? planetById(chart, rid) : undefined;
    chartRuler = { planet: rid ?? "", sign: rp?.sign ?? null, house: rp?.house ?? null };
    if (rp) readFrom.push(`${risingSign} rising, ruled by ${rp.name} in the ${ordinal(rp.house)} house`);
  }

  // --- aspects between money-relevant bodies ------------------------------------------------
  // calculateChart emits aspect endpoints as display names ("Sun", "Part of Fortune") while
  // planets carry lowercase ids ("sun", "part_of_fortune"). Comparing the two directly matched
  // nothing, so every aspect was silently dropped and reports lost their aspect content entirely.
  // Normalise to the id form before filtering.
  const toId = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "_");
  const relevant = new Set<string>(MONEY_PLANETS);
  const aspects: AspectFact[] = (chart.aspects ?? [])
    .map((a: Aspect) => ({ ...a, planet1: toId(a.planet1), planet2: toId(a.planet2) }))
    .filter((a) => relevant.has(a.planet1) && relevant.has(a.planet2))
    .map((a) => {
      const hard = HARD_TYPES.has(a.type) || (a.type === "conjunction" && (HEAVY.has(a.planet1) || HEAVY.has(a.planet2)));
      return { a: a.planet1, b: a.planet2, type: a.type, orb: a.orb, hard };
    });
  for (const a of aspects) {
    if (a.hard) readFrom.push(`${title(a.a)} ${a.type} ${title(a.b)}`);
  }

  // --- retrogrades ---------------------------------------------------------------------------
  const retrogrades = Object.values(placements).filter((p) => p.retrograde).map((p) => p.planet);

  // --- element / modality balance -------------------------------------------------------------
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 };
  // Counted over the traditional seven plus the outers, not the calculated points.
  const counted = classicalBodies(chart.planets);
  for (const p of counted) {
    const e = ELEMENT[p.sign];
    const m = MODALITY[p.sign];
    if (e) elements[e]++;
    if (m) modalities[m]++;
  }
  const dominantElement = (Object.keys(elements) as Array<keyof typeof elements>).reduce((a, b) => (elements[a] >= elements[b] ? a : b));
  const lackingElements = (Object.keys(elements) as Array<keyof typeof elements>).filter((k) => elements[k] === 0);
  const dominantModality = (Object.keys(modalities) as Array<keyof typeof modalities>).reduce((a, b) => (modalities[a] >= modalities[b] ? a : b));

  // --- stelliums ------------------------------------------------------------------------------
  const stelliums: MoneyChartFacts["stelliums"] = [];
  const bySign = new Map<string, string[]>();
  const byHouse = new Map<number, string[]>();
  for (const p of counted) {
    bySign.set(p.sign, [...(bySign.get(p.sign) ?? []), p.id]);
    if (p.house) byHouse.set(p.house, [...(byHouse.get(p.house) ?? []), p.id]);
  }
  for (const [sign, ps] of bySign) if (ps.length >= 3) { stelliums.push({ kind: "sign", where: sign, planets: ps }); readFrom.push(`Stellium in ${sign}`); }
  for (const [house, ps] of byHouse) if (ps.length >= 3) { stelliums.push({ kind: "house", where: house, planets: ps }); readFrom.push(`Stellium in the ${ordinal(house)} house`); }

  // --- human design ----------------------------------------------------------------------------
  if (humanDesign) {
    readFrom.push(
      `${humanDesign.type}, ${humanDesign.authorityLabel}`,
      `${humanDesign.profile} profile, ${humanDesign.definition}`,
      `Incarnation Cross gates ${humanDesign.incarnationCross.gates.join("/")}`
    );
    if (humanDesign.openCenters?.length) readFrom.push(`Open centres: ${humanDesign.openCenters.join(", ")}`);
  }

  return {
    name: chart.birthData?.name ?? "",
    placements,
    houses,
    chartRuler,
    risingSign,
    aspects,
    retrogrades,
    balance: { elements, modalities, dominantElement, lackingElements, dominantModality },
    stelliums,
    humanDesign,
    readFrom,
  };
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function title(id: string): string {
  return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
