/**
 * Money Blueprint — cross-reference: shadow selection, contradictions and the chart profile.
 *
 * Promoted from lab/ 2026-08-03 after the validation sweep in
 * money-blueprint/engine/test/FINDINGS.md. Architecture is frozen: see money-blueprint/engine/.
 * Pure and deterministic. The engine owns facts, the writer owns voice.
 */

import type { ChartData } from "@/types/chart";
import type { HumanDesignData } from "@/types/human-design";
import { type Theme, type Circuit, CONTRADICTION_PAIRS } from "./themes";
import {
  type EvidenceItem, type EvidencedTheme, type Side,
  buildFactors, buildEvidence, scoreThemes, type Factor,
} from "./evidence";
import { type ChartFlags, type FlagOptions, computeFlags } from "./flags";

export interface ShadowPick {
  theme: Theme;
  cluster: EvidenceItem[];
  score: number;
  label: string;
  side: Side | "mixed";
}

export interface Profile {
  name: string;
  themes: EvidencedTheme[];
  contradictions: Array<{ a: Theme; b: Theme; tension: number }>;
  shadows: ShadowPick[];
  circuits: Record<Circuit, number>;
  dominantCircuit: Circuit | null;
  astroShare: number;
  hdShare: number;
  factors: Factor[];
  items: EvidenceItem[];
  flags: ChartFlags;
}

// ---------------------------------------------------------------------------- shadows

/** Three at minimum so the part carries the report, five at most so none of them thins out. */
export const MIN_SHADOWS = 3;
export const MAX_SHADOWS = 5;

/**
 * Circuitry describes how someone's energy moves through a group, which is a business-model and
 * earning-style signal. It is not a wound, and a shadow seeded or supported by it reads as a
 * category error. Excluded from shadow evidence entirely; it still drives sections 20 and 21.
 */
const isCircuitry = (i: EvidenceItem) => i.id.startsWith("hd:circuit:");

interface ShadowOptions {
  min?: number;
  max?: number;
  /** On a monolithic chart, shadows past the second must introduce a new theme even at a lower
   *  score, or the buyer reads one shadow written four times. */
  monolithic?: boolean;
}

/**
 * One relaxation level of the selection. Level 0 is the standard pass; 1 and 2 widen only when the
 * chart has not yielded the minimum, because every chart has a money story and if the code cannot
 * find it, the code is wrong rather than the chart.
 */
function attempt(themes: EvidencedTheme[], level: number, opts: Required<ShadowOptions>): ShadowPick[] {
  const picked: ShadowPick[] = [];
  const perTheme = new Map<Theme, number>();
  // An evidence item may seed only one shadow. Without this, the same heavy body (Lilith, Saturn,
  // Pluto) anchors all four and the buyer reads one shadow written four times.
  const usedAsSeed = new Set<string>();
  const usedAsSupport = new Set<string>();

  const eligible = themes.filter((t) =>
    level >= 2 ? t.confidence !== "insufficient" : t.confidence !== "insufficient" && t.confidence !== "low"
  );
  const supportFloor = level === 0 ? 0.35 : 0.15;
  const reuseSupport = level >= 1;

  for (let round = 0; round < 2 && picked.length < opts.max; round++) {
    for (const t of eligible) {
      if (picked.length >= opts.max) break;
      if ((perTheme.get(t.theme) ?? 0) > round) continue;
      // On a monolithic chart the third shadow onward has to come from somewhere new.
      if (opts.monolithic && picked.length >= 2 && perTheme.has(t.theme)) continue;

      // rank this theme's items by how strongly they carry THIS theme
      const weightFor = (i: EvidenceItem) => (i.themes.find(([th]) => th === t.theme)?.[1] ?? 0) * i.adjustedStrength;
      const ranked = [...t.items].filter((i) => !isCircuitry(i)).sort((a, b) => weightFor(b) - weightFor(a));
      const seed = ranked.find((i) => !usedAsSeed.has(i.id));
      if (!seed) continue;

      // supporting items: same theme, meaningful weight, not anchoring another shadow
      const support = ranked
        .filter((i) => i.id !== seed.id && !usedAsSeed.has(i.id))
        .filter((i) => reuseSupport || !usedAsSupport.has(i.id))
        .filter((i) => weightFor(i) >= weightFor(seed) * supportFloor)
        .slice(0, 2);

      // A shadow is a mechanism, and one placement is not a mechanism. Betty's approved shadows
      // each braid two or three factors into a single sequence, and a cluster of one gets written
      // up against a three-page template with nothing to say on pages two and three.
      if (support.length < 1) continue;

      const cluster = [seed, ...support];
      usedAsSeed.add(seed.id);
      support.forEach((s) => usedAsSupport.add(s.id));

      const sides = new Set(cluster.map((i) => i.side).filter(Boolean));
      picked.push({
        theme: t.theme,
        cluster,
        score: cluster.reduce((a, i) => a + weightFor(i), 0),
        label: seed.factors[0].label,
        side: sides.size === 1 ? ([...sides][0] as Side) : "mixed",
      });
      perTheme.set(t.theme, (perTheme.get(t.theme) ?? 0) + 1);
    }
  }
  return picked.sort((a, b) => b.score - a.score);
}

/**
 * Past the third, a shadow has to earn its three pages. A cluster scoring under this share of the
 * strongest one is a real pattern but a minor one, and writing it up against the full template is
 * how a report starts to feel padded.
 */
const TAIL_FLOOR = 0.4;

export function pickShadows(themes: EvidencedTheme[], options: ShadowOptions = {}): ShadowPick[] {
  const opts: Required<ShadowOptions> = {
    min: options.min ?? MIN_SHADOWS,
    max: options.max ?? MAX_SHADOWS,
    monolithic: options.monolithic ?? false,
  };
  let best: ShadowPick[] = [];
  for (const level of [0, 1, 2]) {
    const picks = attempt(themes, level, opts);
    if (picks.length > best.length) best = picks;
    if (best.length >= opts.min) break;
  }
  // The count comes from the chart rather than from a fixed template: a chart with five distinct
  // mechanisms gets five, a flatter one gets three, and neither reads as padded or as truncated.
  const top = best[0]?.score ?? 0;
  return best.filter((s, i) => i < opts.min || s.score >= top * TAIL_FLOOR);
}

// ---------------------------------------------------------------------------- profile

export function analyse(
  name: string,
  chart: ChartData,
  hd: HumanDesignData | null,
  freq: Record<string, number>,
  flagOptions: FlagOptions = {}
): Profile {
  const factors = buildFactors(chart, hd);
  const items = buildEvidence(factors, freq);
  const themes = scoreThemes(items);

  const contradictions: Profile["contradictions"] = [];
  const scoreOf = (t: Theme) => themes.find((x) => x.theme === t);
  for (const [a, b] of CONTRADICTION_PAIRS) {
    const A = scoreOf(a), B = scoreOf(b);
    if (!A || !B) continue;
    if (A.confidence === "insufficient" || B.confidence === "insufficient") continue;
    if (A.independence < 3 || B.independence < 3) continue;
    const rankA = themes.indexOf(A), rankB = themes.indexOf(B);
    if (rankA > 5 || rankB > 5) continue;
    const idsA = new Set(A.items.map((i) => i.id));
    const shared = B.items.filter((i) => idsA.has(i.id)).length;
    const overlap = shared / Math.min(A.items.length, B.items.length);
    if (overlap > 0.5) continue; // same evidence on both sides is not a contradiction
    const tension = Math.min(A.score, B.score) / Math.max(A.score, B.score);
    if (tension > 0.75) contradictions.push({ a, b, tension });
  }

  const flags = computeFlags(chart, hd, themes, contradictions, flagOptions);
  const shadows = pickShadows(themes, { monolithic: flags.convergenceProfile === "monolithic" });

  const circuits: Record<Circuit, number> = { tribal: 0, collective: 0, individual: 0 };
  for (const f of factors) {
    const m = f.id.match(/^circuit:(\w+)$/);
    if (m) circuits[m[1] as Circuit] = f.strength;
  }
  const dominantCircuit = (Object.entries(circuits).sort((a, b) => b[1] - a[1])[0]?.[1] ?? 0) > 0
    ? (Object.entries(circuits).sort((a, b) => b[1] - a[1])[0][0] as Circuit) : null;

  const top3 = themes.slice(0, 3);
  const top3Items = [...new Map(top3.flatMap((t) => t.items).map((i) => [i.id, i])).values()];
  const astro = top3Items.filter((i) => i.system === "astrology").length;
  const hdN = top3Items.filter((i) => i.system === "human-design").length;

  return {
    name, themes, contradictions, shadows, circuits, dominantCircuit,
    astroShare: astro / Math.max(astro + hdN, 1),
    hdShare: hdN / Math.max(astro + hdN, 1),
    factors, items, flags,
  };
}
