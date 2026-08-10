/**
 * Money Blueprint — composition.
 *
 * Turns derived facts into prose. Same approach as `interpretations.ts`
 * (`composeRulerPlacement`, `composeHouseChain`): look up meaning, branch on the actual
 * configuration, and compose a sentence that is specific to this chart rather than generic.
 *
 * Every function here is pure. Given the same facts it returns the same prose, which is what makes
 * a report reproducible and reviewable.
 */

import type { MoneyChartFacts, PlacementFact, HouseFact, AspectFact } from "../facts";
import { MONEY_SIGN, MONEY_BODY, MONEY_HOUSE, ASPECT_VOICE, HD_OPEN_CENTRE_MONEY } from "./vocab";

// ---------------------------------------------------------------------------- primitives

export const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export function ord(n: number): string {
  return ORDINAL[n] ?? `${n}th`;
}

export function bodyName(id: string): string {
  return MONEY_BODY[id]?.name ?? id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function lower(s: string): string {
  return s.toLowerCase();
}

export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Joins a list into readable prose: "a, b and c". */
export function list(items: string[], conj = "and"): string {
  const clean = items.filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} ${conj} ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")} ${conj} ${clean[clean.length - 1]}`;
}

/**
 * A deterministic picker. The same chart always gets the same phrasing, so a report can be
 * regenerated identically, while different charts get different sentence shapes and the library
 * does not read as a template.
 */
export function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function pick<T>(options: T[], seed: number, salt = 0): T {
  return options[(seed + salt) % options.length];
}

// ---------------------------------------------------------------------------- placements

/** "Saturn in Scorpio in the 8th house" */
export function placementLabel(p: PlacementFact): string {
  return `${bodyName(p.planet)} in ${p.sign}${p.house ? ` in the ${ord(p.house)} house` : ""}${p.retrograde ? ", retrograde" : ""}`;
}

/**
 * A full money reading of one placement, braiding the body's function with the sign's earning
 * style and the house's territory. Three factors in one sentence, which is the minimum for prose
 * that reads as specific rather than generic.
 */
export function placementProse(p: PlacementFact, seed: number): string {
  const body = MONEY_BODY[p.planet];
  const sign = MONEY_SIGN[p.sign];
  const house = p.house ? MONEY_HOUSE[p.house] : null;
  if (!body || !sign) return placementLabel(p);

  const openers = [
    `${body.name} governs ${body.governs}, and in ${p.sign} it works through ${sign.earns}`,
    `Your ${body.name} sits in ${p.sign}, which means ${body.governs} runs on ${sign.earns}`,
    `${body.name} in ${p.sign} puts ${body.governs} into the hands of ${sign.texture[0]}, ${sign.texture[1]} energy that earns through ${sign.earns}`,
  ];
  let out = pick(openers, seed, p.planet.length);

  if (house) {
    out += `. Sitting in your ${ord(p.house!)} house of ${house.of}, that whole function is pointed at ${house.channel}`;
  }
  out += ".";

  if (p.retrograde) {
    out += ` It is retrograde, which turns the process inward, so this developed privately rather than being worked out in the open.`;
  }
  return out;
}

// ---------------------------------------------------------------------------- houses and rulers

/** "2nd house in Aries, ruled by Mars in Capricorn in the 11th, empty of planets" */
export function houseLabel(h: HouseFact): string {
  const base = `${ord(h.house)} house in ${h.sign}`;
  const ruler = h.rulerSign && h.rulerHouse
    ? `, ruled by ${bodyName(h.ruler)} in ${h.rulerSign} in the ${ord(h.rulerHouse)} house`
    : "";
  const occ = h.occupants.length
    ? `, containing ${list(h.occupants.map(bodyName))}`
    : ", empty of planets";
  return base + ruler + occ;
}

/**
 * The mechanism paragraph for a money house. This is the composition that solves the empty-house
 * problem: an empty house is read entirely through where its ruler actually landed, and the prose
 * branches on whether the ruler sits at home or travelled.
 */
export function houseProse(h: HouseFact, seed: number): string {
  const house = MONEY_HOUSE[h.house];
  const sign = MONEY_SIGN[h.sign];
  if (!house || !sign) return houseLabel(h);

  const parts: string[] = [];
  parts.push(
    `Your ${ord(h.house)} house of ${house.of} sits in ${h.sign}, so ${house.money} carries ${sign.texture[0]}, ${sign.texture[1]} colouring and works through ${sign.earns}.`
  );

  if (h.occupants.length === 0 && h.rulerSign && h.rulerHouse) {
    const rulerHouse = MONEY_HOUSE[h.rulerHouse];
    const rulerBody = MONEY_BODY[h.ruler];
    if (h.rulerHouse === h.house) {
      parts.push(
        `It holds no planets, and its ruler ${bodyName(h.ruler)} sits right back inside it, which makes this a self-contained engine: the house runs on its own terms with nothing external pulling it off course.`
      );
    } else {
      parts.push(
        `It holds no planets of its own, which people misread as a weak area and which means nothing of the kind. An empty house is simply told by its ruler, and yours is ${bodyName(h.ruler)} in ${h.rulerSign}, which has travelled to your ${ord(h.rulerHouse)} house of ${rulerHouse?.of ?? "another part of the chart"}. So ${house.money.split(",")[0]} is generated through ${rulerHouse?.channel ?? "that territory"}, powered by ${rulerBody?.role ?? "that planet"} running on ${MONEY_SIGN[h.rulerSign]?.earns ?? "its own style"}.`
      );
    }
  } else if (h.occupants.length > 0) {
    const occNames = list(h.occupants.map(bodyName));
    const heavy = h.occupants.length >= 3;
    parts.push(
      heavy
        ? `${occNames} all sit inside it, which is a stellium and makes this house the loudest single statement in your chart. When this many bodies gather in one house, that house stops being one theme among twelve and becomes the organising principle everything else has to be read against.`
        : `${occNames} ${h.occupants.length > 1 ? "sit" : "sits"} inside it, so ${h.occupants.length > 1 ? "those functions are" : "that function is"} pulled directly into ${house.channel}.`
    );
    if (h.rulerSign && h.rulerHouse && h.rulerHouse !== h.house) {
      parts.push(
        `Its ruler ${bodyName(h.ruler)} then carries the whole story onward into your ${ord(h.rulerHouse)} house of ${MONEY_HOUSE[h.rulerHouse]?.of}, which is where the results of it actually land.`
      );
    }
  }
  return parts.join(" ");
}

// ---------------------------------------------------------------------------- aspects

/** "Venus conjunct Saturn (orb 2.6°)" */
export function aspectLabel(a: AspectFact): string {
  return `${bodyName(a.a)} ${a.type} ${bodyName(a.b)}, orb ${a.orb.toFixed(1)}°`;
}

/** How tight an aspect is, in words, which is how an astrologer would say it. */
export function orbWeight(orb: number): string {
  if (orb <= 1) return "an extraordinarily tight";
  if (orb <= 2.5) return "a very tight";
  if (orb <= 5) return "a close";
  return "a wide";
}

/**
 * The money reading of an aspect. Braids both bodies' functions with the aspect's dynamic, and
 * escalates the language when the orb is tight, because a one-degree aspect genuinely does behave
 * more insistently than a seven-degree one.
 */
export function aspectProse(a: AspectFact, seed: number): string {
  const A = MONEY_BODY[a.a];
  const B = MONEY_BODY[a.b];
  const v = ASPECT_VOICE[a.type];
  if (!A || !B || !v) return aspectLabel(a);

  const tight = orbWeight(a.orb);
  const lead = `${A.name} ${v.verb} ${B.name} at ${a.orb.toFixed(1)} degrees, which is ${tight} aspect`;
  const meaning = `${A.name} governs ${A.governs} and ${B.name} governs ${B.governs}, and ${v.dynamic}`;

  const consequence = a.hard
    ? `In money terms this is where the friction lives: ${A.strain}, meeting ${B.strain}.`
    : `In money terms this is where the ease lives: ${A.gift}, supported by ${B.gift}.`;

  return `${lead}. ${cap(meaning)}. ${consequence}`;
}

// ---------------------------------------------------------------------------- human design

export function openCentreProse(centre: string): string {
  const c = HD_OPEN_CENTRE_MONEY[centre];
  if (!c) return "";
  return `Your ${centreName(centre)} centre is open, so it takes in ${c.absorbs} and amplifies them. The money cost is specific: ${c.cost}. The wisdom in it is that ${c.wisdom}.`;
}

export function centreName(k: string): string {
  const names: Record<string, string> = {
    head: "Head", ajna: "Ajna", throat: "Throat", g: "G", heart: "Heart",
    solarplexus: "Solar Plexus", sacral: "Sacral", spleen: "Spleen", root: "Root",
  };
  return names[k] ?? k;
}

// ---------------------------------------------------------------------------- the braid

export interface BraidInput {
  /** Short label for the factor, e.g. "Venus conjunct Saturn in the 8th". */
  label: string;
  /** What this factor contributes to the mechanism, as a clause. */
  contributes: string;
}

/**
 * The braid. This is the function that makes the report feel handwritten.
 *
 * Given several factors that all point at the same theme, it writes a paragraph that names them,
 * says what each contributes, and then states the compound mechanism they produce together. The
 * shape changes with how many factors there are, because three factors braided reads very
 * differently from two.
 */
export function braid(factors: BraidInput[], mechanism: string, seed: number): string {
  const n = factors.length;
  if (n === 0) return mechanism;

  if (n === 1) {
    return `${cap(factors[0].label)} ${factors[0].contributes}. ${cap(mechanism)}`;
  }

  if (n === 2) {
    const openers = [
      `Two things in your chart produce this between them.`,
      `This comes from two places at once, which is why it has been hard to shift by working on one of them.`,
      `Two separate parts of your chart carry this.`,
    ];
    return `${pick(openers, seed)} ${cap(factors[0].label)} ${factors[0].contributes}, and ${factors[1].label} ${factors[1].contributes}. Together they compound into one mechanism rather than sitting side by side as separate problems. ${cap(mechanism)}`;
  }

  const openers = [
    `${n} separate factors in your chart converge on this, which is why it has been so persistent.`,
    `This is carried by ${n} different parts of your chart at once, and that convergence is what gives it its grip.`,
    `${n} factors compound here, which is the reason working on any one of them has never quite resolved it.`,
  ];
  // Each factor gets its own sentence. Joining four of these with commas produced a run-on that
  // buried the very specificity the braid exists to deliver.
  const sentences = factors.map((f) => `${cap(f.label)} ${f.contributes}.`);
  return `${pick(openers, seed)} ${sentences.join(" ")} None of those is the whole story alone. Together they produce a single mechanism: ${mechanism}`;
}

/**
 * Turns raw evidence sources into braid inputs. Evidence items carry a source string like
 * "venus-scorpio-8" or "open-heart"; this resolves them back to a readable label and a clause.
 */
export function factorsToBraid(facts: MoneyChartFacts, sources: string[], theme: string): BraidInput[] {
  const out: BraidInput[] = [];
  const seen = new Set<string>();

  for (const src of sources) {
    if (seen.has(src)) continue;
    seen.add(src);

    // planet source
    const p = Object.values(facts.placements).find((x) => src.includes(x.planet));
    // aspect source
    const a = facts.aspects.find((x) => src.includes(x.a) && src.includes(x.b));
    // open centre source
    const centre = Object.keys(HD_OPEN_CENTRE_MONEY).find((c) => src.includes(c));
    // house source
    const h = Object.values(facts.houses).find((x) => src.includes(`house-${x.house}`) || src.includes(`${x.house}th`));

    if (a) {
      const A = MONEY_BODY[a.a], B = MONEY_BODY[a.b];
      out.push({
        label: `${A?.name ?? a.a} ${a.type} ${B?.name ?? a.b} at ${a.orb.toFixed(1)} degrees`,
        contributes: a.hard
          ? `fuses ${A?.role ?? "one function"} to ${B?.role ?? "another"}, so neither one fires cleanly on its own`
          : `lets ${A?.role ?? "one function"} and ${B?.role ?? "another"} work together so smoothly you barely notice the talent involved`,
      });
      continue;
    }
    if (centre && facts.humanDesign?.openCenters.includes(centre)) {
      const c = HD_OPEN_CENTRE_MONEY[centre];
      out.push({
        label: `your open ${centreName(centre)} centre`,
        contributes: `takes in ${c.absorbs} and amplifies them, so ${c.cost}`,
      });
      continue;
    }
    if (h && h.occupants.length === 0) {
      out.push({
        label: `your empty ${ord(h.house)} house in ${h.sign}`,
        contributes: `gives this no fixed home of its own, so it moves with wherever its ruler ${bodyName(h.ruler)} happens to be pointing`,
      });
      continue;
    }
    if (p) {
      const body = MONEY_BODY[p.planet];
      const sign = MONEY_SIGN[p.sign];
      out.push({
        label: `${body?.name ?? p.planet} in ${p.sign}${p.house ? ` in your ${ord(p.house)} house` : ""}`,
        contributes: `puts ${body?.governs ?? "this function"} into ${sign?.texture[0] ?? "that"} territory, and under pressure that shows up as ${body?.strain ?? "strain"}`,
      });
    }
  }
  return out.slice(0, 4);
}
