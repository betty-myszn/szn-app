/**
 * Money Blueprint — evidence: factors, independence collapsing, rarity and confidence.
 *
 * Promoted from lab/ 2026-08-03 after the validation sweep in
 * money-blueprint/engine/test/FINDINGS.md. Architecture is frozen: see money-blueprint/engine/.
 * Pure and deterministic. The engine owns facts, the writer owns voice.
 */

import type { ChartData } from "@/types/chart";
import type { HumanDesignData } from "@/types/human-design";
import { GATE_CENTER } from "@/lib/human-design-constants";
import {
  type Theme, type TW, type Circuit, W,
  PLANET_THEMES, HOUSE_THEMES, ELEMENT_THEMES, ELEMENT, SIGN_RULER,
  OPEN_CENTRE_THEMES, DEFINED_CENTRE_THEMES, CIRCUIT_THEMES, TYPE_THEMES, MONEY_CHANNELS,
} from "./themes";

export type System = "astrology" | "human-design";
export type Side = "personality" | "design";

export interface Factor {
  id: string;
  system: System;
  /** Set on channel factors so dominant-circuit membership can compound their strength. */
  circuit?: Circuit;
  /** Independence key. Factors sharing a source collapse into one evidence item. */
  source: string;
  /** Key for empirical population-frequency lookup. Must encode what makes this factor
   *  distinctive, not merely which body it is: everyone has a Venus, few have it in the 8th
   *  conjunct Saturn. Without this, rarity weighting silently only ever boosts Human Design. */
  rarityKey: string;
  label: string;
  themes: TW;
  strength: number;
  side?: Side;
}

export interface EvidenceItem {
  id: string;
  system: System;
  source: string;
  factors: Factor[];
  themes: TW;
  frequency: number;
  strength: number;
  adjustedStrength: number;
  side?: Side;
}

export type Confidence = "very-high" | "high" | "moderate" | "low" | "insufficient";

export interface EvidencedTheme {
  theme: Theme;
  score: number;
  independence: number;
  crossSystem: boolean;
  confidence: Confidence;
  items: EvidenceItem[];
  why: string;
}

// ---------------------------------------------------------------------------- helpers

const MONEY_HOUSES = [2, 6, 8, 10, 11];
const HEAVY = new Set(["saturn", "pluto", "chiron", "lilith"]);
const toId = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "_");
const ord = (n: number) => `${n}${["th", "st", "nd", "rd"][(n % 100 - 20) % 10] || ["th", "st", "nd", "rd"][n % 100] || "th"}`;

function addThemes(acc: Map<Theme, number>, tw: TW, mult: number) {
  for (const [t, w] of tw) acc.set(t, (acc.get(t) ?? 0) + w * mult);
}

// ---------------------------------------------------------------------------- factors

export function buildFactors(chart: ChartData, hd: HumanDesignData | null): Factor[] {
  const out: Factor[] = [];
  const byId = new Map(chart.planets.map((p) => [p.id, p]));

  // which planets rule a money house
  const rulesMoney = new Set<string>();
  for (const h of MONEY_HOUSES) {
    const cusp = chart.houses.find((c) => c.house === h);
    if (cusp) rulesMoney.add(SIGN_RULER[cusp.sign]);
  }
  const risingSign = chart.houses.find((c) => c.house === 1)?.sign;
  const chartRulerId = risingSign ? SIGN_RULER[risingSign] : null;

  // stelliums
  const byHouse = new Map<number, string[]>();
  for (const p of chart.planets) if (p.house) byHouse.set(p.house, [...(byHouse.get(p.house) ?? []), p.id]);
  const stelliumHouses = new Set([...byHouse].filter(([, v]) => v.length >= 3).map(([k]) => k));

  // ---- placements
  for (const [pid, base] of Object.entries(PLANET_THEMES)) {
    const p = byId.get(pid);
    if (!p) continue;
    let s = W.planetBase;
    if (MONEY_HOUSES.includes(p.house)) s += W.inMoneyHouse;
    if (rulesMoney.has(pid)) s += W.rulesMoneyHouse;
    if (chartRulerId === pid) s += W.chartRuler;
    if (stelliumHouses.has(p.house)) s += W.stellium;
    if (p.retrograde) s += W.retrograde;

    const themes = new Map<Theme, number>();
    addThemes(themes, base, 1);
    if (MONEY_HOUSES.includes(p.house)) addThemes(themes, HOUSE_THEMES[p.house] ?? [], 0.6);
    addThemes(themes, ELEMENT_THEMES[ELEMENT[p.sign]] ?? [], 0.4);

    out.push({
      id: `planet:${pid}`,
      system: "astrology",
      source: `astro:${pid}`,
      rarityKey: `planet:${pid}:h${p.house}${p.retrograde ? ":rx" : ""}`,
      label: `${p.name} in ${p.sign} in the ${ord(p.house)}${p.retrograde ? " retrograde" : ""}`,
      themes: [...themes] as TW,
      strength: s,
    });
  }

  // ---- money houses traced to their ruler (one source per house chain)
  for (const h of MONEY_HOUSES) {
    const cusp = chart.houses.find((c) => c.house === h);
    if (!cusp) continue;
    const rid = SIGN_RULER[cusp.sign];
    const r = rid ? byId.get(rid) : undefined;
    const themes = new Map<Theme, number>();
    addThemes(themes, HOUSE_THEMES[h] ?? [], 1);
    if (r) addThemes(themes, HOUSE_THEMES[r.house] ?? [], 0.5);
    addThemes(themes, ELEMENT_THEMES[ELEMENT[cusp.sign]] ?? [], 0.3);
    const occupants = (byHouse.get(h) ?? []).length;
    out.push({
      id: `house:${h}`,
      system: "astrology",
      source: `astro:house${h}`,
      rarityKey: `house:${h}:r${r ? r.house : 0}:o${occupants >= 3 ? "3+" : occupants}`,
      label: `${ord(h)} house in ${cusp.sign}${r ? `, ruled by ${r.name} in the ${ord(r.house)}` : ""}`,
      themes: [...themes] as TW,
      strength: W.planetBase + W.rulesMoneyHouse + (occupants >= 3 ? W.stellium : 0),
    });
  }

  // ---- aspects, attributed to the heavier body's source
  for (const a of chart.aspects ?? []) {
    const p1 = toId(a.planet1);
    const p2 = toId(a.planet2);
    if (!PLANET_THEMES[p1] || !PLANET_THEMES[p2]) continue;
    const hard = a.type === "square" || a.type === "opposition" || (a.type === "conjunction" && (HEAVY.has(p1) || HEAVY.has(p2)));
    let s = a.orb <= 1 ? W.aspectOrbTight : a.orb <= 3 ? W.aspectOrbMid : W.aspectOrbWide;
    if (hard) s *= W.aspectHardMult;
    if (rulesMoney.has(p1) || rulesMoney.has(p2)) s *= W.aspectRulerMult;
    const heavier = HEAVY.has(p1) ? p1 : HEAVY.has(p2) ? p2 : p1;
    const themes = new Map<Theme, number>();
    addThemes(themes, PLANET_THEMES[p1], hard ? 0.7 : 0.5);
    addThemes(themes, PLANET_THEMES[p2], hard ? 0.7 : 0.5);
    if (hard) addThemes(themes, [["scarcity", 0.4], ["control", 0.3]], 1);
    out.push({
      id: `aspect:${p1}-${p2}`,
      system: "astrology",
      source: `astro:${heavier}`,
      rarityKey: `aspect:${[p1, p2].sort().join("-")}:${a.type}:${a.orb <= 3 ? "tight" : "wide"}`,
      label: `${a.planet1} ${a.type} ${a.planet2}, orb ${a.orb.toFixed(1)}°`,
      themes: [...themes] as TW,
      strength: s,
    });
  }

  if (!hd) return out;

  // ---- HD: channels (defined) — one source each, subsumes its gates and centres
  const definedGates = new Set<number>();
  const personalityGates = new Set(hd.personality.map((a) => a.gate));
  const designGates = new Set(hd.design.map((a) => a.gate));
  const circuits: Record<Circuit, number> = { tribal: 0, collective: 0, individual: 0 };

  for (const ch of hd.definedChannels) {
    const key = [...ch.gates].sort((x, y) => x - y).join("-");
    const meta = MONEY_CHANNELS[key];
    ch.gates.forEach((g) => definedGates.add(g));
    if (!meta) continue;
    circuits[meta.circuit] += 1;
    const side: Side | undefined =
      ch.gates.every((g) => designGates.has(g) && !personalityGates.has(g)) ? "design"
        : ch.gates.every((g) => personalityGates.has(g) && !designGates.has(g)) ? "personality"
        : undefined;
    out.push({
      id: `channel:${key}`,
      system: "human-design",
      source: `hd:channel:${key}`,
      rarityKey: `channel:${key}`,
      label: `Defined channel ${key} (${meta.name})`,
      themes: meta.themes,
      strength: W.channel,
      side,
      circuit: meta.circuit,
    });
  }

  // ---- circuit dominance
  const totalCh = circuits.tribal + circuits.collective + circuits.individual;
  if (totalCh > 0) {
    const domCircuit = (Object.entries(circuits).sort((a, b) => b[1] - a[1])[0][0]) as Circuit;
    for (const f of out) if (f.circuit === domCircuit) f.strength += 0.5;
  }
  if (totalCh > 0) {
    for (const c of ["tribal", "collective", "individual"] as Circuit[]) {
      if (circuits[c] === 0) continue;
      out.push({
        id: `circuit:${c}`,
        system: "human-design",
        source: `hd:circuit:${c}`,
        rarityKey: `circuit:${c}:${circuits[c] / totalCh > 0.5 ? "dom" : "min"}`,
        label: `${c} circuitry (${circuits[c]} of ${totalCh} channels)`,
        themes: CIRCUIT_THEMES[c],
        strength: W.circuit * (circuits[c] / totalCh),
      });
    }
  }

  // ---- hanging gates (activated, channel not defined) that belong to a money channel
  for (const key of Object.keys(MONEY_CHANNELS)) {
    const [g1, g2] = key.split("-").map(Number);
    const has1 = hd.activatedGates.includes(g1);
    const has2 = hd.activatedGates.includes(g2);
    if (has1 === has2) continue; // both = defined channel, neither = absent
    const g = has1 ? g1 : g2;
    const meta = MONEY_CHANNELS[key];
    out.push({
      id: `hanging:${g}`,
      system: "human-design",
      source: `hd:centre:${GATE_CENTER[g] ?? `gate${g}`}`,
      rarityKey: `hanging:${g}`,
      label: `Gate ${g} hanging, seeking ${key} (${meta.name})`,
      themes: meta.themes.map(([t, w]) => [t, w * 0.6] as [Theme, number]),
      strength: W.hangingGate,
      side: designGates.has(g) && !personalityGates.has(g) ? "design" : personalityGates.has(g) && !designGates.has(g) ? "personality" : undefined,
    });
  }

  // ---- centres
  // How many activated-but-hanging gates point into each centre. A centre with several hanging
  // gates is far more conditioned than a bare open centre, and that is real HD mechanics.
  const hangingInto = new Map<string, number>();
  for (const g of hd.activatedGates) {
    if (definedGates.has(g)) continue;
    const c = GATE_CENTER[g];
    if (c) hangingInto.set(c, (hangingInto.get(c) ?? 0) + 1);
  }
  const definingChannels = new Map<string, number>();
  for (const ch of hd.definedChannels) for (const c of ch.centers) definingChannels.set(c, (definingChannels.get(c) ?? 0) + 1);

  for (const c of hd.openCenters) {
    const t = OPEN_CENTRE_THEMES[c];
    if (!t) continue;
    const hang = hangingInto.get(c) ?? 0;
    out.push({
      id: `open:${c}`, system: "human-design", source: `hd:centre:${c}`,
      rarityKey: `open:${c}:h${hang >= 3 ? "3+" : hang}`,
      label: `Open ${c} centre${hang ? `, ${hang} hanging gate${hang > 1 ? "s" : ""}` : ""}`,
      themes: t, strength: W.openCentre + hang * 0.4,
    });
  }
  for (const c of hd.definedCenters) {
    const t = DEFINED_CENTRE_THEMES[c];
    if (!t) continue;
    const def = definingChannels.get(c) ?? 1;
    out.push({
      id: `defined:${c}`, system: "human-design", source: `hd:centre:${c}`,
      rarityKey: `defined:${c}:c${def >= 3 ? "3+" : def}`,
      label: `Defined ${c} centre (${def} channel${def > 1 ? "s" : ""})`,
      themes: t, strength: W.definedCentre + (def - 1) * 0.5,
    });
  }

  // ---- type, authority, definition, cross
  out.push({ id: "type", system: "human-design", source: "hd:type", rarityKey: `type:${hd.type}`, label: `${hd.type}, ${hd.strategy}`, themes: TYPE_THEMES[hd.type] ?? [], strength: W.type });
  out.push({ id: "authority", system: "human-design", source: "hd:authority", rarityKey: `authority:${hd.authority}`, label: hd.authorityLabel, themes: [["safety", 0.7], ["control", 0.4]], strength: W.authority });
  out.push({ id: "definition", system: "human-design", source: "hd:definition", rarityKey: `definition:${hd.definition}`, label: hd.definition, themes: hd.definition === "Single Definition" ? [["autonomy", 0.6] as [Theme, number]] : [["belonging", 0.7] as [Theme, number], ["safety", 0.4] as [Theme, number]], strength: W.definition });
  out.push({ id: "cross", system: "human-design", source: "hd:cross", rarityKey: `cross:${hd.incarnationCross.angle}`, label: `${hd.incarnationCross.angle} Cross, gates ${hd.incarnationCross.gates.join("/")}`, themes: hd.incarnationCross.angle.toLowerCase().includes("left") ? [["belonging", 0.7], ["power", 0.5]] : [["autonomy", 0.7], ["visibility", 0.4]], strength: W.cross });

  return out;
}

// ---------------------------------------------------------------------------- evidence

export function buildEvidence(factors: Factor[], freq: Record<string, number>): EvidenceItem[] {
  const bySource = new Map<string, Factor[]>();
  for (const f of factors) bySource.set(f.source, [...(bySource.get(f.source) ?? []), f]);

  const items: EvidenceItem[] = [];
  for (const [source, fs] of bySource) {
    const themes = new Map<Theme, number>();
    // Strongest factor at full weight; correlated siblings at reduced weight. This is the
    // independence rule: three views of one Venus is one Venus.
    const sorted = [...fs].sort((a, b) => b.strength - a.strength);
    sorted.forEach((f, i) => addThemes(themes, f.themes, i === 0 ? 1 : 0.35));
    const strength = sorted[0].strength + sorted.slice(1).reduce((a, f) => a + f.strength * 0.35, 0);
    const frequency = freq[sorted[0].rarityKey] ?? 0.5;
    const rawRarity = 1 + Math.log(1 / Math.max(frequency, 0.02));
    const sides = new Set(fs.map((f) => f.side).filter(Boolean));
    items.push({
      id: source,
      system: fs[0].system,
      source,
      factors: fs,
      themes: [...themes] as TW,
      frequency,
      strength,
      adjustedStrength: strength * rawRarity, // normalised below, within system
      side: sides.size === 1 ? ([...sides][0] as Side) : undefined,
    });
  }

  // Normalise the rarity multiplier within each system so key granularity cannot masquerade as
  // diagnostic value. After this, rarity ranks items against their own system's baseline.
  for (const system of ["astrology", "human-design"] as System[]) {
    const group = items.filter((i) => i.system === system);
    if (!group.length) continue;
    const mean = group.reduce((a, i) => a + i.adjustedStrength / i.strength, 0) / group.length;
    for (const i of group) i.adjustedStrength = i.strength * (i.adjustedStrength / i.strength / mean);
  }
  return items;
}

const CONF_THRESHOLD = 2.5;

export function scoreThemes(items: EvidenceItem[]): EvidencedTheme[] {
  const acc = new Map<Theme, Array<{ item: EvidenceItem; contribution: number }>>();
  for (const it of items) {
    for (const [t, w] of it.themes) {
      if (w <= 0.15) continue;
      acc.set(t, [...(acc.get(t) ?? []), { item: it, contribution: w * it.adjustedStrength }]);
    }
  }
  const out: EvidencedTheme[] = [];
  for (const [theme, contribs] of acc) {
    // Concentration-aware: the strongest source counts in full, the rest at a steep discount.
    // A plain sum lets a theme with ten weak hints outrank one with a tight Venus-Saturn
    // conjunction, which inverts how the chart actually reads.
    const ranked = [...contribs].sort((a, b) => b.contribution - a.contribution);
    const score = ranked[0].contribution + ranked.slice(1).reduce((a, c) => a + c.contribution * 0.4, 0);
    const its = ranked.map((r) => r.item);
    const uniq = [...new Map(its.map((i) => [i.id, i])).values()];
    const isPrimaryCarrier = (i: EvidenceItem) => {
      const w = i.themes.find(([th]) => th === theme)?.[1] ?? 0;
      const max = Math.max(...i.themes.map(([, x]) => x), 0.0001);
      return w >= max * 0.8;
    };
    const independence = uniq.filter(isPrimaryCarrier).length;
    const systems = new Set(uniq.map((i) => i.system));
    const crossSystem = systems.size > 1;
    let confidence: Confidence = "insufficient";
    // Thresholds calibrated from the observed independence distribution across the test set
    // (p50 3, p85 5, p95 7). very-high targets roughly the top 5% of themes, high the next 10%.
    if (independence >= 7 && crossSystem) confidence = "very-high";
    else if (independence >= 5 && crossSystem) confidence = "high";
    else if (independence >= 3) confidence = "moderate";
    else if (independence >= 1) confidence = "low";
    out.push({
      theme, score, independence, crossSystem, confidence, items: uniq,
      why: `${independence} independent source${independence === 1 ? "" : "s"}${crossSystem ? " across both systems" : ` (${[...systems][0]} only)`}`,
    });
  }
  const sorted = out.sort((a, b) => b.score - a.score);
  // Very high is meant to be exceptional. Cap it at the top two themes per chart, or the tier
  // saturates and stops carrying information.
  // Tiers are relative to the chart. Very high is the spine only, high the next band, and
  // anything outside the top six is capped so a long tail of weak themes cannot be asserted.
  const top = sorted[0]?.score ?? 1;
  // Light guard rail only. Evidence, not rank, now does the discriminating.
  sorted.forEach((t) => {
    const rel = t.score / top;
    if (t.confidence === "very-high" && rel < 0.7) t.confidence = "high";
    if (t.confidence === "high" && rel < 0.35) t.confidence = "moderate";
    if (rel < 0.15) t.confidence = "low";
  });
  return sorted;
}
