/**
 * Money Blueprint — chart flags, computed in stage ② so stage ③ can adapt the plan before a single
 * model call is made.
 *
 * Every flag here corresponds to a case in money-blueprint/engine/EDGE-CASES.md. The standard the
 * flags exist to hold: the report stays premium regardless of how unusual the chart is, and the
 * buyer never learns their chart was awkward. The one deliberate exception is Placidus reliability,
 * which the buyer is told about plainly, before they pay.
 *
 * Pure and deterministic.
 */

import type { ChartData } from "@/types/chart";
import type { HumanDesignData } from "@/types/human-design";
import { WHEEL_START_DEG, GATE_ARC } from "@/lib/human-design-constants";
import { classicalBodies } from "./facts";
import type { EvidencedTheme } from "./evidence";
import type { Theme } from "./themes";

export type AddressRegister = "her" | "them" | "neutral";

export type PlacidusFailure = "extreme-latitude" | "non-finite-cusps" | "non-monotonic-cusps";

export interface ChartFlags {
  emptyMoneyHouses: number[];
  stelliumCount: number;
  intercepted: boolean;
  /** Always Placidus. When unreliable the chart is refused, never recalculated another way. */
  placidusReliable: boolean;
  placidusFailureReason?: PlacidusFailure;
  aspectDensity: "sparse" | "normal" | "dense";
  retrogradeHeavy: boolean;
  convergenceProfile: "diffuse" | "normal" | "monolithic";
  systemConflict: boolean;
  rareDesign: boolean;
  boundaryRisk: string[];
  birthTimeSuspect: boolean;
  southernHemisphere: boolean;
  addressRegister: AddressRegister;
  ageBracket: "young" | "mid" | "mature";
  careRegister: boolean;
}

/** Any report with two or more flags set goes into the human sampling queue at a higher rate. */
export function unusualCount(f: ChartFlags): number {
  let n = 0;
  if (f.intercepted) n++;
  if (f.aspectDensity !== "normal") n++;
  if (f.retrogradeHeavy) n++;
  if (f.convergenceProfile !== "normal") n++;
  if (f.systemConflict) n++;
  if (f.rareDesign) n++;
  if (f.boundaryRisk.length) n++;
  if (f.birthTimeSuspect) n++;
  if (f.careRegister) n++;
  if (f.stelliumCount === 0 || f.stelliumCount > 1) n++;
  return n;
}

// ---------------------------------------------------------------------------- Placidus

const LAT_LIMIT = 66;
const MONEY_HOUSES = [2, 6, 8, 10, 11];
const norm360 = (x: number) => ((x % 360) + 360) % 360;

/**
 * Aspect-density thresholds, measured against 300 charts through this app's own aspect calculation
 * rather than taken from the abstract counts in EDGE-CASES.md, which were written before the orbs
 * were fixed. Observed: p10 30, p50 35, p90 44. These pick out roughly the sparsest and busiest
 * tenth, which is what the edge case is for.
 */
const SPARSE_ASPECTS = 30;
const DENSE_ASPECTS = 44;

/**
 * The Money Blueprint is always generated in Placidus and there is no fallback house system.
 * Silently substituting Whole Sign would mean two buyers receiving reports built on different
 * methodologies with nothing to indicate it, which is worse than declining the chart.
 *
 * Runs twice: at the form, before payment, so the buyer never pays for a report that cannot be
 * produced, and again at generation as a backstop. On failure at generation, do not generate: flag
 * the order for manual handling. Never switch house system, widen orbs or approximate.
 */
export function isPlacidusReliable(
  latitude: number,
  cusps?: Array<{ house: number; longitude: number }>
): { ok: true } | { ok: false; reason: PlacidusFailure; message: string } {
  if (!Number.isFinite(latitude) || Math.abs(latitude) > LAT_LIMIT) {
    return {
      ok: false,
      reason: "extreme-latitude",
      message:
        "This birth location sits too far north or south for the house system this report uses to be calculated accurately.",
    };
  }

  if (!cusps) return { ok: true };

  const ordered = [...cusps].sort((a, b) => a.house - b.house);
  if (ordered.length !== 12) {
    return { ok: false, reason: "non-finite-cusps", message: "This chart did not return a complete set of house cusps." };
  }
  if (ordered.some((c) => !Number.isFinite(c.longitude))) {
    return { ok: false, reason: "non-finite-cusps", message: "This chart's house cusps could not be calculated." };
  }

  // Walking the cusps forward, every step must advance and the twelve steps must close the circle
  // exactly once. Anything else means Placidus has degenerated and every house-based statement in
  // the report would be unfounded.
  let total = 0;
  for (let i = 0; i < 12; i++) {
    const d = norm360(ordered[(i + 1) % 12].longitude - ordered[i].longitude);
    if (d <= 0) {
      return { ok: false, reason: "non-monotonic-cusps", message: "This chart's house cusps do not run in order." };
    }
    total += d;
  }
  if (Math.abs(total - 360) > 0.01) {
    return { ok: false, reason: "non-monotonic-cusps", message: "This chart's house cusps do not run in order." };
  }

  return { ok: true };
}

/** Thrown at generation when the backstop check fails. The order is flagged, not silently rehoused. */
export class PlacidusUnreliableError extends Error {
  constructor(readonly reason: PlacidusFailure, message: string) {
    super(message);
    this.name = "PlacidusUnreliableError";
  }
}

/**
 * The guard the generator runs before it calculates anything. Above the Arctic and Antarctic
 * circles the ephemeris does not return a usable set of Placidus cusps at all, so this has to fire
 * before `calculateChart`, not after it: the alternative is an opaque crash on a paid order rather
 * than an order flagged for Betty with a reason attached.
 *
 * The same function backs the form check, where latitude is known and no chart exists yet.
 */
export function assertPlacidusOrRefuse(latitude: number): void {
  const result = isPlacidusReliable(latitude);
  if (!result.ok) throw new PlacidusUnreliableError(result.reason, result.message);
}

// ---------------------------------------------------------------------------- detection

function detectIntercepted(chart: ChartData): boolean {
  const signs = chart.houses.map((c) => c.sign);
  const counts = new Map<string, number>();
  for (const s of signs) counts.set(s, (counts.get(s) ?? 0) + 1);
  // A sign on two cusps means another sign is on none, which is what interception is.
  return [...counts.values()].some((n) => n > 1);
}

/**
 * A body sitting within a hundredth of a degree of a gate or line edge can be moved across it by a
 * birth time the buyer rounded: the Sun covers that arc in about a quarter of an hour. Those
 * factors get their weight dropped rather than dropped outright, and nothing is ever built on them
 * as a primary mechanism.
 *
 * Measured at 0.01°: roughly 5% of charts, which matches the estimate in EDGE-CASES.md. A tenth of
 * a degree flagged half of them and made the caution meaningless.
 */
const BOUNDARY_ORB = 0.01;
const LINE_ARC = GATE_ARC / 6;

function detectBoundaryRisk(hd: HumanDesignData | null): string[] {
  if (!hd) return [];
  const risky: string[] = [];
  const check = (label: string, longitude: number) => {
    const offset = norm360(longitude - WHEEL_START_DEG);
    const inGate = offset % GATE_ARC;
    const inLine = offset % LINE_ARC;
    const nearGate = inGate < BOUNDARY_ORB || GATE_ARC - inGate < BOUNDARY_ORB;
    const nearLine = inLine < BOUNDARY_ORB || LINE_ARC - inLine < BOUNDARY_ORB;
    if (nearGate) risky.push(`${label}:gate`);
    else if (nearLine) risky.push(`${label}:line`);
  };
  for (const a of hd.personality) if (a.body === "Sun" || a.body === "Earth") check(`personality-${a.body.toLowerCase()}`, a.longitude);
  for (const a of hd.design) if (a.body === "Sun" || a.body === "Earth") check(`design-${a.body.toLowerCase()}`, a.longitude);
  return risky;
}

const HEAVY = new Set(["saturn", "pluto", "chiron"]);
const toId = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "_");

/**
 * Hard contacts from Pluto, Saturn or Chiron to the Moon, together with a loaded 4th or 8th. The
 * engine reads these as money material; for some buyers they are also the shape of real abuse,
 * loss or poverty. The care register tells the writer to describe the pattern and its money
 * consequence without ever diagnosing or asserting what happened in someone's childhood.
 *
 * Both halves are required. Measured separately across the population, a hard Moon contact alone
 * fires on 49% of charts and a loaded 4th or 8th on 32%, so either one on its own would hedge most
 * of the reports written. Together they fire on 14%, which is the population this is for.
 */
function detectCareRegister(chart: ChartData): boolean {
  const hardToMoon = (chart.aspects ?? []).some((a) => {
    const p1 = toId(a.planet1);
    const p2 = toId(a.planet2);
    const hard = a.type === "square" || a.type === "opposition" || a.type === "conjunction";
    return hard && ((p1 === "moon" && HEAVY.has(p2)) || (p2 === "moon" && HEAVY.has(p1)));
  });
  const loaded = (h: number) => chart.planets.filter((p) => p.house === h).length >= 3;
  return hardToMoon && (loaded(4) || loaded(8));
}

function ageFrom(dateOfBirth: string, now: Date): number {
  const dob = new Date(`${dateOfBirth}T00:00:00Z`);
  if (Number.isNaN(dob.getTime())) return 40;
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const before =
    now.getUTCMonth() < dob.getUTCMonth() ||
    (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() < dob.getUTCDate());
  if (before) age -= 1;
  return age;
}

export interface FlagOptions {
  /** Optional field on the birth data form. Defaults to the audience the voice was written for. */
  addressRegister?: AddressRegister;
  /** Generation date, injected so the sweep is reproducible. */
  now?: Date;
}

/**
 * Everything in EDGE-CASES.md, computed once and carried on the profile.
 *
 * `themes` and `contradictions` come from the evidence engine, so this runs after scoring rather
 * than alongside it.
 */
export function computeFlags(
  chart: ChartData,
  hd: HumanDesignData | null,
  themes: EvidencedTheme[],
  contradictions: Array<{ a: Theme; b: Theme; tension: number }>,
  opts: FlagOptions = {}
): ChartFlags {
  const now = opts.now ?? new Date();
  const lat = chart.birthData.location.latitude;
  const placidus = isPlacidusReliable(lat, chart.houses);

  const emptyMoneyHouses = MONEY_HOUSES.filter((h) => !chart.planets.some((p) => p.house === h));

  // Same definition the sections read, so the planner cannot decide there is no stellium while
  // §02 is looking at one.
  const byHouse = new Map<number, number>();
  for (const p of classicalBodies(chart.planets)) if (p.house) byHouse.set(p.house, (byHouse.get(p.house) ?? 0) + 1);
  const stelliumCount = [...byHouse.values()].filter((n) => n >= 3).length;

  const aspects = chart.aspects ?? [];
  const hardCount = aspects.filter((a) => a.type === "square" || a.type === "opposition").length;
  const aspectDensity: ChartFlags["aspectDensity"] =
    aspects.length < SPARSE_ASPECTS || hardCount < 2 ? "sparse" : aspects.length > DENSE_ASPECTS ? "dense" : "normal";

  // The nodes are retrograde most of the time by definition, so counting them makes two thirds of
  // all charts retrograde-heavy and the flag stops meaning anything.
  const retrogradeHeavy = classicalBodies(chart.planets).filter((p) => p.retrograde).length >= 4;

  // A convergence is a theme carried by three or more independent sources.
  const convergences = themes.filter((t) => t.independence >= 3);
  const crossSystem = convergences.filter((t) => t.crossSystem);
  const top = themes[0]?.score ?? 0;
  const second = themes[1]?.score ?? 0;
  const convergenceProfile: ChartFlags["convergenceProfile"] =
    second > 0 && top > second * 2.5
      ? "monolithic"
      : convergences.length < 2 || crossSystem.length < 1
        ? "diffuse"
        : "normal";

  // A contradiction where one side is wholly astrological and the other wholly Human Design is not
  // a problem to resolve. It is one of the strongest moments available in the report.
  const systemConflict = contradictions.some((c) => {
    const A = themes.find((t) => t.theme === c.a);
    const B = themes.find((t) => t.theme === c.b);
    if (!A || !B) return false;
    const sysOf = (t: EvidencedTheme) => new Set(t.items.map((i) => i.system));
    const sa = sysOf(A);
    const sb = sysOf(B);
    return sa.size === 1 && sb.size === 1 && [...sa][0] !== [...sb][0];
  });

  const rareDesign = !!hd && (hd.type === "Reflector" || hd.openCenters.length >= 7 || hd.definition.startsWith("Quadruple"));

  const birthTime = chart.birthData.birthTime ?? "";
  const birthTimeSuspect =
    chart.birthData.birthTimeApproximate === true || birthTime === "12:00" || birthTime === "00:00";

  const age = ageFrom(chart.birthData.dateOfBirth, now);

  return {
    emptyMoneyHouses,
    stelliumCount,
    intercepted: detectIntercepted(chart),
    placidusReliable: placidus.ok,
    placidusFailureReason: placidus.ok ? undefined : placidus.reason,
    aspectDensity,
    retrogradeHeavy,
    convergenceProfile,
    systemConflict,
    rareDesign,
    boundaryRisk: detectBoundaryRisk(hd),
    birthTimeSuspect,
    southernHemisphere: lat < 0,
    addressRegister: opts.addressRegister ?? "her",
    ageBracket: age < 30 ? "young" : age < 55 ? "mid" : "mature",
    careRegister: detectCareRegister(chart),
  };
}
