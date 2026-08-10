import type { MoneyChartFacts, PlacementFact, HouseFact } from "./facts";

/**
 * Assembly: MoneyChartFacts + a section's `reads` -> the facts that section is entitled to.
 *
 * This is the gate that keeps the report honest. Each section declares in sections.ts which facts
 * it may speak about, and this module hands the writer exactly those facts and nothing else. A
 * section physically cannot assert a placement the buyer does not have, because it was never given
 * it. Everything here is pure and synchronous, no model involved.
 *
 * The planner (plan.ts) is the only caller.
 */

/** One date-dependent fact, supplied by timing.ts at generation time. */
export interface TimingFact {
  label: string;
  value: unknown;
}

/**
 * Date-dependent facts are kept apart from natal facts deliberately. Natal facts are birth-data
 * only and cacheable forever; timing facts expire, and caching the wrong one means a roadmap that
 * silently starts in the wrong year.
 */
export type TimingInput = Partial<Record<"profection" | "returns" | "transits" | "eclipses" | "roadmap", TimingFact>>;

/** A single resolved fact, in a shape a prompt can read without knowing our internals. */
export interface ResolvedFact {
  /** Dotted key from the section's `reads`, e.g. "placements.saturn" or "houses.2". */
  key: string;
  /** Human-readable statement of the fact, e.g. "Saturn in Capricorn in the 2nd house". */
  label: string;
  /** The structured value, for engine sections that need to compute rather than read. */
  value: unknown;
}

const ORDINALS = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

function titleCase(id: string): string {
  return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function describePlacement(p: PlacementFact): string {
  return `${titleCase(p.planet)} in ${p.sign}` +
    (p.house ? ` in the ${ORDINALS[p.house] ?? `${p.house}th`} house` : "") +
    (p.retrograde ? ", retrograde" : "");
}

function describeHouse(h: HouseFact): string {
  const base = `${ORDINALS[h.house] ?? `${h.house}th`} house in ${h.sign}`;
  const ruler = h.rulerSign && h.rulerHouse
    ? `, ruled by ${titleCase(h.ruler)} in ${h.rulerSign} in the ${ORDINALS[h.rulerHouse] ?? `${h.rulerHouse}th`} house`
    : "";
  const occ = h.occupants.length ? `, containing ${h.occupants.map(titleCase).join(", ")}` : ", empty of planets";
  return base + ruler + occ;
}

/**
 * Resolves one dotted `reads` key against the facts. Returns null when the buyer's chart simply
 * does not carry that factor, which is normal and is how sections shrink gracefully rather than
 * printing a heading with nothing under it.
 */
function resolve(key: string, f: MoneyChartFacts, timing: TimingInput): ResolvedFact | null {
  const [head, tail] = key.split(".");

  if (head === "placements") {
    if (!tail) {
      const all = Object.values(f.placements);
      return all.length ? { key, label: all.map(describePlacement).join("; "), value: f.placements } : null;
    }
    const p = f.placements[tail];
    return p ? { key, label: describePlacement(p), value: p } : null;
  }

  if (head === "houses") {
    if (!tail) {
      const all = Object.values(f.houses);
      return all.length ? { key, label: all.map(describeHouse).join("; "), value: f.houses } : null;
    }
    const h = f.houses[Number(tail)];
    return h ? { key, label: describeHouse(h), value: h } : null;
  }

  if (head === "humanDesign") {
    const hd = f.humanDesign;
    if (!hd) return null;
    if (!tail) {
      return {
        key,
        label: `${hd.type}, ${hd.authorityLabel}, ${hd.profile} profile, ${hd.definition}. Open centres: ${hd.openCenters.join(", ") || "none"}`,
        value: hd,
      };
    }
    const v = (hd as unknown as Record<string, unknown>)[tail];
    if (v === undefined || v === null) return null;
    const label = Array.isArray(v) ? `${titleCase(tail)}: ${v.join(", ")}` : `${titleCase(tail)}: ${String(v)}`;
    return { key, label, value: v };
  }

  if (head === "chartRuler") {
    const c = f.chartRuler;
    if (!c || !c.sign) return null;
    return {
      key,
      label: `${f.risingSign} rising, ruled by ${titleCase(c.planet)} in ${c.sign}${c.house ? ` in the ${ORDINALS[c.house]} house` : ""}`,
      value: c,
    };
  }

  if (head === "risingSign") {
    return f.risingSign ? { key, label: `${f.risingSign} rising`, value: f.risingSign } : null;
  }

  if (head === "aspects") {
    if (!f.aspects.length) return null;
    const label = f.aspects
      .map((a) => `${titleCase(a.a)} ${a.type} ${titleCase(a.b)} (orb ${a.orb.toFixed(1)}°)${a.hard ? " [hard]" : ""}`)
      .join("; ");
    return { key, label, value: f.aspects };
  }

  if (head === "retrogrades") {
    return f.retrogrades.length
      ? { key, label: `Retrograde at birth: ${f.retrogrades.map(titleCase).join(", ")}`, value: f.retrogrades }
      : null;
  }

  if (head === "balance") {
    const b = f.balance;
    const lacking = b.lackingElements.length ? `, no ${b.lackingElements.join(" or ")}` : "";
    return {
      key,
      label: `Dominant element ${b.dominantElement}, dominant modality ${b.dominantModality}${lacking}`,
      value: b,
    };
  }

  if (head === "stelliums") {
    return f.stelliums.length
      ? {
          key,
          label: f.stelliums
            .map((s) => `Stellium in ${s.kind === "house" ? `the ${ORDINALS[Number(s.where)]} house` : s.where} (${s.planets.map(titleCase).join(", ")})`)
            .join("; "),
          value: f.stelliums,
        }
      : null;
  }

  // Date-dependent groups are supplied by timing.ts at generation time rather than derived here,
  // so a cached fact set can never go stale and start lying about timing.
  if (head === "timing") {
    const t = tail ? timing[tail as keyof TimingInput] : undefined;
    return t ? { key, label: t.label, value: t.value } : null;
  }

  return null;
}

/**
 * The entitlement gate. Returns only the facts behind the keys this section declared, de-duplicated
 * by label so the Read from band never prints the same placement twice.
 */
export function resolveReads(
  reads: readonly string[],
  facts: MoneyChartFacts,
  timing: TimingInput = {}
): ResolvedFact[] {
  const resolved: ResolvedFact[] = [];
  const seen = new Set<string>();
  for (const key of reads) {
    const fact = resolve(String(key), facts, timing);
    if (fact && !seen.has(fact.label)) {
      seen.add(fact.label);
      resolved.push(fact);
    }
  }
  return resolved;
}
