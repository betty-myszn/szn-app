/**
 * Money Blueprint — shadow selection.
 *
 * Scores the fourteen themes against the buyer's actual chart and returns the three to five that
 * carry the most independent evidence. Deterministic: same chart, same shadows, same order.
 *
 * A theme only qualifies when at least two *independent* sources carry it, because a shadow built
 * on one placement reads as a horoscope, and a shadow built on three reads as being seen.
 */

import type { MoneyChartFacts } from "../facts";
import { THEME_CONTENT } from "./vocab";
import { ord, bodyName, centreName } from "./phrases";

export interface PickedShadow {
  theme: string;
  /** Readable evidence labels, strongest first. Used for the Read from band. */
  labels: string[];
  /** Human-readable summary of the evidence, used in the chapter opener and the Read from band. */
  label: string;
  /** Source strings, consumed by the braider. */
  sources: string[];
  score: number;
}

/** Weightings per body when it sits under pressure. */
const BODY_THEMES: Record<string, Array<[string, number]>> = {
  venus: [["worth", 1.0], ["receiving", 0.9]],
  saturn: [["scarcity", 0.9], ["worth", 0.85], ["legitimacy", 0.6], ["safety", 0.5]],
  pluto: [["power", 1.0], ["control", 0.9], ["depth", 0.6]],
  chiron: [["legitimacy", 0.9], ["worth", 0.7], ["depth", 0.5]],
  lilith: [["visibility", 1.0], ["autonomy", 0.7]],
  neptune: [["overgiving", 0.8], ["receiving", 0.4]],
  moon: [["safety", 0.9], ["receiving", 0.4]],
  mars: [["autonomy", 0.7], ["expansion", 0.4]],
  jupiter: [["expansion", 0.45]],
  mercury: [["legitimacy", 0.6], ["visibility", 0.4]],
  sun: [["visibility", 0.7], ["worth", 0.4]],
  north_node: [["expansion", 0.25]],
  south_node: [["depth", 0.4], ["expansion", 0.3]],
};

const OPEN_CENTRE_THEMES: Record<string, Array<[string, number]>> = {
  heart: [["worth", 1.1], ["legitimacy", 0.5]],
  solarplexus: [["overgiving", 1.0], ["belonging", 0.6]],
  sacral: [["sustainability", 1.1], ["overgiving", 0.6]],
  root: [["sustainability", 0.8], ["safety", 0.5]],
  spleen: [["scarcity", 0.8], ["safety", 0.6]],
  ajna: [["legitimacy", 0.9]],
  head: [["legitimacy", 0.6]],
  g: [["belonging", 0.7], ["autonomy", 0.4]],
  throat: [["visibility", 0.9]],
};

const SIGN_THEMES: Record<string, Array<[string, number]>> = {
  Scorpio: [["control", 0.5], ["depth", 0.5]], Capricorn: [["scarcity", 0.4], ["legitimacy", 0.4]],
  Libra: [["overgiving", 0.5], ["belonging", 0.4]], Pisces: [["overgiving", 0.5]],
  Aquarius: [["belonging", 0.5], ["autonomy", 0.4]], Virgo: [["legitimacy", 0.5]],
  Cancer: [["safety", 0.5], ["overgiving", 0.4]], Leo: [["visibility", 0.5]],
  Taurus: [["safety", 0.4]], Aries: [["autonomy", 0.4]], Gemini: [["legitimacy", 0.3]],
  Sagittarius: [["expansion", 0.5]],
};

interface Hit { theme: string; weight: number; source: string; label: string }

export function pickShadowThemes(f: MoneyChartFacts, min = 3, max = 4): PickedShadow[] {
  const hits: Hit[] = [];
  const MONEY_H = new Set([2, 6, 8, 10, 11]);

  // hard aspects: the loudest evidence there is
  for (const a of f.aspects) {
    if (!a.hard) continue;
    // Orb matters enormously. A 2 degree aspect behaves insistently; a 7 degree one is background.
    const tight = a.orb <= 2 ? 1.8 : a.orb <= 4 ? 1.2 : a.orb <= 6 ? 0.6 : 0.25;
    for (const body of [a.a, a.b]) {
      for (const [theme, w] of BODY_THEMES[body] ?? []) {
        hits.push({
          theme, weight: w * tight, source: `${a.a}-${a.type}-${a.b}`,
          label: `${bodyName(a.a)} ${a.type} ${bodyName(a.b)}, orb ${a.orb.toFixed(1)}°`,
        });
      }
    }
  }

  // bodies in money houses
  for (const p of Object.values(f.placements)) {
    if (!p.house) continue;
    const inMoney = MONEY_H.has(p.house);
    const mult = inMoney ? 1.35 : 0.3;
    for (const [theme, w] of BODY_THEMES[p.planet] ?? []) {
      hits.push({
        theme, weight: w * mult, source: `${p.planet}-h${p.house}`,
        label: `${bodyName(p.planet)} in ${p.sign} in the ${ord(p.house)} house`,
      });
    }
    for (const [theme, w] of SIGN_THEMES[p.sign] ?? []) {
      if (["venus", "saturn", "moon", "pluto", "chiron"].includes(p.planet)) {
        hits.push({ theme, weight: w * 0.6 * mult, source: `${p.planet}-${p.sign}`, label: `${bodyName(p.planet)} in ${p.sign}` });
      }
    }
  }

  // empty money houses: worth with no fixed home
  for (const h of Object.values(f.houses)) {
    if (h.occupants.length === 0 && (h.house === 2 || h.house === 8)) {
      hits.push({ theme: "worth", weight: 0.8, source: `house-${h.house}-empty`, label: `empty ${ord(h.house)} house in ${h.sign}` });
      hits.push({ theme: "scarcity", weight: 0.4, source: `house-${h.house}-empty`, label: `empty ${ord(h.house)} house in ${h.sign}` });
    }
  }

  // open centres
  for (const c of f.humanDesign?.openCenters ?? []) {
    for (const [theme, w] of OPEN_CENTRE_THEMES[c] ?? []) {
      hits.push({ theme, weight: w, source: `open-${c}`, label: `open ${centreName(c)} centre` });
    }
  }

  // stelliums intensify whatever they sit on
  for (const s of f.stelliums) {
    if (s.kind === "house" && MONEY_H.has(Number(s.where))) {
      hits.push({ theme: "depth", weight: 0.7, source: `stellium-${s.where}`, label: `stellium in the ${ord(Number(s.where))} house` });
      hits.push({ theme: "power", weight: 0.5, source: `stellium-${s.where}`, label: `stellium in the ${ord(Number(s.where))} house` });
    }
  }

  // aggregate, requiring independent sources
  const byTheme = new Map<string, { score: number; sources: Map<string, { label: string; weight: number }> }>();
  for (const h of hits) {
    if (!THEME_CONTENT[h.theme]) continue;
    let e = byTheme.get(h.theme);
    if (!e) { e = { score: 0, sources: new Map() }; byTheme.set(h.theme, e); }
    e.score += h.weight;
    const prev = e.sources.get(h.source);
    // Keep the strongest weight seen for a source so ordering reflects real contribution.
    if (!prev || h.weight > prev.weight) e.sources.set(h.source, { label: h.label, weight: h.weight });
  }

  /** Sources ordered by how much they actually contribute, strongest first. */
  const ordered = (m: Map<string, { label: string; weight: number }>) =>
    [...m.entries()].sort((a, b) => b[1].weight - a[1].weight);

  // Wound themes are what a shadows chapter is for. Growth themes can still qualify, they simply
  // do not get to outrank a tight, money-housed wound on volume of weak evidence alone.
  const WOUND_BONUS: Record<string, number> = {
    worth: 1.25, receiving: 1.2, scarcity: 1.15, overgiving: 1.15, visibility: 1.1,
    control: 1.1, legitimacy: 1.05, safety: 1.05, power: 1.0, depth: 1.0,
    autonomy: 1.0, belonging: 1.0, sustainability: 1.05, expansion: 0.7,
  };
  const ranked = [...byTheme.entries()]
    .map(([theme, e]) => ({
      theme,
      score: e.score * (1 + 0.25 * (e.sources.size - 1)) * (WOUND_BONUS[theme] ?? 1),
      sources: ordered(e.sources).map(([k]) => k),
      labels: ordered(e.sources).map(([, v]) => v.label),
      independence: e.sources.size,
    }))
    .filter((t) => t.independence >= 2)
    .sort((a, b) => b.score - a.score);

  const chosen = ranked.slice(0, max);
  // if the chart is quiet, relax the independence floor rather than shipping two shadows
  if (chosen.length < min) {
    const extra = [...byTheme.entries()]
      .map(([theme, e]) => ({ theme, score: e.score, sources: ordered(e.sources).map(([k]) => k), labels: ordered(e.sources).map(([, v]) => v.label), independence: e.sources.size }))
      .filter((t) => !chosen.find((c) => c.theme === t.theme))
      .sort((a, b) => b.score - a.score)
      .slice(0, min - chosen.length);
    chosen.push(...extra);
  }

  return chosen.map((c) => ({
    theme: c.theme,
    labels: c.labels,
    label: c.labels.slice(0, 3).join(", "),
    sources: c.sources,
    score: Math.round(c.score * 100) / 100,
  }));
}
