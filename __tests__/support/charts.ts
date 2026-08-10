/**
 * The shared validation population.
 *
 * Samples a population of real charts from the live ephemeris, measures population frequencies for
 * rarity weighting and selects the covering set of 26 charts that the engine sweep and the plan
 * test both run against. Deterministic: same seed, same population, same covering set, every run.
 *
 * Not a test file. Lives here so the two suites cannot drift onto different charts.
 */

import { calculateChart } from "@/lib/astrology";
import { calculateHumanDesign } from "@/lib/human-design";
import type { BirthData, ChartData } from "@/types/chart";
import type { HumanDesignData } from "@/types/human-design";
import { buildFactors, type Factor } from "@/lib/money-blueprint/evidence";

export const LOCATIONS = [
  { placeName: "Bury, UK", city: "Bury", country: "UK", latitude: 53.5933, longitude: -2.2966, timezone: "Europe/London" },
  { placeName: "New York, US", city: "New York", country: "US", latitude: 40.7128, longitude: -74.006, timezone: "America/New_York" },
  { placeName: "Sydney, AU", city: "Sydney", country: "AU", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney" },
  { placeName: "Singapore", city: "Singapore", country: "SG", latitude: 1.3521, longitude: 103.8198, timezone: "Asia/Singapore" },
  { placeName: "Reykjavik, IS", city: "Reykjavik", country: "IS", latitude: 64.1466, longitude: -21.9426, timezone: "Atlantic/Reykjavik" },
];

export interface Sample {
  bd: BirthData;
  chart: ChartData;
  hd: HumanDesignData;
  tags: string[];
}

export const NEED = [
  "type:Manifestor", "type:Generator", "type:Manifesting Generator", "type:Projector", "type:Reflector",
  "auth:emotional", "auth:sacral", "auth:splenic", "auth:ego", "auth:self", "auth:mental", "auth:lunar",
  "heart:defined", "heart:open", "sacral:defined", "sacral:open",
  "solarplexus:defined", "solarplexus:open", "throat:defined", "throat:open",
  "def:single", "def:split",
  "h2:empty", "h2:full", "h8:empty", "h8:full",
  "aspects:sparse", "aspects:dense",
  "dominant:saturn", "dominant:jupiter", "dominant:pluto",
  "lat:high", "lat:south",
];

export function tag(chart: ChartData, hd: HumanDesignData): string[] {
  const t: string[] = [];
  t.push(`type:${hd.type}`);
  t.push(`auth:${hd.authority}`);
  t.push(`def:${hd.definition}`);
  for (const c of ["heart", "sacral", "solarplexus", "throat"]) {
    t.push(`${c}:${hd.definedCenters.includes(c as never) ? "defined" : "open"}`);
  }
  t.push(`open:${hd.openCenters.length}`);
  const occ = (h: number) => chart.planets.filter((p) => p.house === h).length;
  t.push(`h2:${occ(2) === 0 ? "empty" : occ(2) >= 2 ? "full" : "some"}`);
  t.push(`h8:${occ(8) === 0 ? "empty" : occ(8) >= 3 ? "full" : "some"}`);
  const n = (chart.aspects ?? []).length;
  t.push(`aspects:${n < 12 ? "sparse" : n > 24 ? "dense" : "normal"}`);
  const hardTo = (id: string) =>
    (chart.aspects ?? []).filter(
      (a) =>
        [a.planet1, a.planet2].map((x) => x.toLowerCase()).includes(id) &&
        (a.type === "square" || a.type === "opposition" || a.type === "conjunction")
    ).length;
  const sat = hardTo("saturn"), jup = hardTo("jupiter"), plu = hardTo("pluto");
  const dom = [["saturn", sat], ["jupiter", jup], ["pluto", plu]].sort((a, b) => (b[1] as number) - (a[1] as number))[0];
  if ((dom[1] as number) >= 3) t.push(`dominant:${dom[0]}`);
  t.push(`lat:${chart.birthData.location.latitude > 60 ? "high" : chart.birthData.location.latitude < 0 ? "south" : "mid"}`);
  return t;
}

/** Betty's own chart. The reference the whole report was designed against. */
export const BETTY_BIRTH: BirthData = {
  name: "Betty",
  dateOfBirth: "1984-10-05",
  birthTime: "16:30",
  birthTimeApproximate: false,
  location: LOCATIONS[0],
} as BirthData;

export interface Sweep {
  pop: Sample[];
  freq: Record<string, number>;
  chosen: Sample[];
  covered: Set<string>;
}

export function buildSweep(): Sweep {
  // deterministic PRNG so the sweep is reproducible
  let seed = 20260803;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const pad = (n: number) => String(n).padStart(2, "0");

  const randomBirth = (i: number): BirthData => {
    const year = 1955 + Math.floor(rnd() * 50);
    const month = 1 + Math.floor(rnd() * 12);
    const day = 1 + Math.floor(rnd() * 28);
    const hour = Math.floor(rnd() * 24);
    const minute = Math.floor(rnd() * 60);
    return {
      name: `C${i}`,
      dateOfBirth: `${year}-${pad(month)}-${pad(day)}`,
      birthTime: `${pad(hour)}:${pad(minute)}`,
      birthTimeApproximate: false,
      location: pick(LOCATIONS),
    } as BirthData;
  };

  // ---------------------------------------------------------------- 1. population
  const POP = 300;
  const pop: Sample[] = [];
  for (let i = 0; i < POP; i++) {
    const bd = randomBirth(i);
    try {
      const chart = calculateChart(bd);
      const hd = calculateHumanDesign(bd);
      pop.push({ bd, chart, hd, tags: tag(chart, hd) });
    } catch {
      /* skip charts the ephemeris cannot resolve */
    }
  }

  // ---------------------------------------------------------------- 2. frequencies
  const counts = new Map<string, number>();
  for (const s of pop) {
    const keys = new Set(buildFactors(s.chart, s.hd).map((f: Factor) => f.rarityKey));
    for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const freq: Record<string, number> = {};
  for (const [k, c] of counts) freq[k as string] = (c as number) / pop.length;

  // ---------------------------------------------------------------- 3. covering set
  const covered = new Set<string>();
  const chosen: Sample[] = [];
  for (let round = 0; round < 3; round++) {
    for (const s of pop) {
      if (chosen.includes(s)) continue;
      const gain = s.tags.filter((t) => NEED.includes(t) && !covered.has(t)).length;
      if (gain >= (round === 0 ? 3 : round === 1 ? 2 : 1)) {
        chosen.push(s);
        s.tags.forEach((t) => covered.add(t));
      }
      if (chosen.length >= 24) break;
    }
    if (chosen.length >= 24) break;
  }
  // fill to 24 with the most tag-diverse remaining charts, so the aggregate has enough n
  while (chosen.length < 24) {
    let best: Sample | null = null;
    let bestScore = -1;
    for (const s of pop) {
      if (chosen.includes(s)) continue;
      const seen = new Map<string, number>();
      for (const c of chosen) for (const t of c.tags) seen.set(t, (seen.get(t) ?? 0) + 1);
      const score = s.tags.reduce((a, t) => a + 1 / (1 + (seen.get(t) ?? 0)), 0);
      if (score > bestScore) { bestScore = score; best = s; }
    }
    if (!best) break;
    chosen.push(best);
  }

  // Betty's chart, always last, as the reference
  const bettyChart = calculateChart(BETTY_BIRTH);
  const bettyHd = calculateHumanDesign(BETTY_BIRTH);
  chosen.push({ bd: BETTY_BIRTH, chart: bettyChart, hd: bettyHd, tags: tag(bettyChart, bettyHd) });

  // rounded-birth-time variant of Betty, to test birth-time sensitivity
  const roundedBd: BirthData = { ...BETTY_BIRTH, name: "Betty(rounded 17:00)", birthTime: "17:00" } as BirthData;
  const roundedChart = calculateChart(roundedBd);
  const roundedHd = calculateHumanDesign(roundedBd);
  chosen.push({ bd: roundedBd, chart: roundedChart, hd: roundedHd, tags: tag(roundedChart, roundedHd) });

  return { pop, freq, chosen, covered };
}
