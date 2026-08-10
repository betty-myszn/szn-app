/**
 * Money Blueprint — timing.
 *
 * Only computes what is genuinely deterministic from birth data plus today's date: annual
 * profections, planetary return schedules, and which natal house each slow transiting planet is
 * currently crossing. Day-level "lucky dates" are deliberately absent rather than invented.
 */

import { calculateChart } from "@/lib/astrology";
import type { BirthData } from "@/types/chart";
import type { MoneyChartFacts } from "../facts";
import { MONEY_HOUSE } from "./vocab";
import { ord, bodyName } from "./phrases";

export interface TimingFacts {
  profection?: { age: number; house: number; sign?: string; ruler?: string; rulerSign?: string; rulerHouse?: number };
  transits?: Array<{ planet: string; sign: string; house: number; note: string }>;
  returns?: Array<{ label: string; when: string; meaning: string }>;
}

const SIGN_RULER: Record<string, string> = {
  Aries: "mars", Taurus: "venus", Gemini: "mercury", Cancer: "moon", Leo: "sun", Virgo: "mercury",
  Libra: "venus", Scorpio: "pluto", Sagittarius: "jupiter", Capricorn: "saturn",
  Aquarius: "uranus", Pisces: "neptune",
};

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

function ageAt(dob: string, now: Date): number {
  const [y, m, d] = dob.split("-").map(Number);
  let age = now.getUTCFullYear() - y;
  const hadBirthday = now.getUTCMonth() + 1 > m || (now.getUTCMonth() + 1 === m && now.getUTCDate() >= d);
  if (!hadBirthday) age--;
  return age;
}

/** Which natal house a given ecliptic longitude falls in, from the natal cusps. */
function houseOf(longitude: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i];
    const b = cusps[(i + 1) % 12];
    const span = (b - a + 360) % 360;
    const off = (longitude - a + 360) % 360;
    if (off < span) return i + 1;
  }
  return 1;
}

const SLOW = ["saturn", "uranus", "neptune", "pluto", "jupiter"];

export function buildTiming(facts: MoneyChartFacts, birthData: BirthData, now: Date, natalCusps: number[] = []): TimingFacts {
  const out: TimingFacts = {};

  // ---- annual profection: age % 12 -> house, that house's sign ruler is the year lord
  const age = ageAt(birthData.dateOfBirth, now);
  const house = (age % 12) + 1;
  const hf = facts.houses[house];
  const sign = hf?.sign;
  const rulerId = sign ? SIGN_RULER[sign] : undefined;
  const rulerPlacement = rulerId ? facts.placements[rulerId] : undefined;
  out.profection = {
    age, house, sign,
    ruler: rulerId,
    rulerSign: rulerPlacement?.sign,
    rulerHouse: rulerPlacement?.house ?? undefined,
  };

  // ---- current slow transits, by natal house
  try {
    const todayChart = calculateChart({
      ...birthData,
      dateOfBirth: now.toISOString().slice(0, 10),
      birthTime: "12:00",
    });
    const cusps = natalCusps;
    if (cusps.length === 12) {
      const transits: TimingFacts["transits"] = [];
      for (const id of SLOW) {
        const t = todayChart.planets.find((p) => p.id === id);
        if (!t) continue;
        const h = houseOf(t.longitude, cusps);
        transits.push({ planet: id, sign: t.sign, house: h, note: transitNote(id, h, t.sign) });
      }
      // most meaningful first: Saturn and outer planets in money houses
      const MONEY = new Set([2, 6, 8, 10, 11]);
      transits.sort((a, b) => Number(MONEY.has(b.house)) - Number(MONEY.has(a.house)));
      out.transits = transits;
    }
  } catch {
    // transit computation is best-effort; the report is complete without it
  }

  // ---- return schedule, deterministic from birth year
  const birthYear = Number(birthData.dateOfBirth.slice(0, 4));
  const returns: TimingFacts["returns"] = [];
  const jupNext = birthYear + Math.ceil((age + 1) / 11.86) * 11.86;
  returns.push({
    label: "Jupiter return", when: `around ${Math.round(jupNext)}, age ${Math.round(jupNext - birthYear)}`,
    meaning: facts.placements.jupiter?.house
      ? `Jupiter returns to your ${ord(facts.placements.jupiter.house)} house, expanding ${MONEY_HOUSE[facts.placements.jupiter.house]?.of}.`
      : "A twelve-year expansion cycle completes and begins again.",
  });
  if (age < 58) returns.push({
    label: age < 29 ? "First Saturn return" : "Second Saturn return",
    when: age < 29 ? `around ${birthYear + 29}, age 29` : `around ${birthYear + 58}, age 58`,
    meaning: facts.placements.saturn?.house
      ? `Saturn returns to your ${ord(facts.placements.saturn.house)} house, maturing ${MONEY_HOUSE[facts.placements.saturn.house]?.of} from restriction into authority.`
      : "Saturn completes its cycle and the area it governs matures into authority.",
  });
  if (age < 52) returns.push({
    label: "Chiron return", when: `around ${birthYear + 50}, age 50`,
    meaning: facts.placements.chiron?.house
      ? `The wound in your ${ord(facts.placements.chiron.house)} house completes its cycle. Historically the point where people finally teach the thing that hurt.`
      : "The core wound completes its cycle and becomes teachable.",
  });
  const nodalNext = birthYear + Math.ceil((age + 1) / 18.6) * 18.6;
  returns.push({
    label: "Nodal return", when: `around ${Math.round(nodalNext)}`,
    meaning: "The nodal lesson comes round again, asking whether you let the steady thing compound.",
  });
  if (age >= 38 && age <= 46) returns.push({
    label: "Uranus opposition", when: `now, across this period (age ${age})`,
    meaning: "The mid-life instruction to do it your own way. Suppressing the unconventional version costs more than expressing it.",
  });
  out.returns = returns.sort((a, b) => (a.when.includes("now") ? -1 : b.when.includes("now") ? 1 : 0));

  return out;
}

function transitNote(planet: string, house: number, sign: string): string {
  const h = MONEY_HOUSE[house];
  const base: Record<string, string> = {
    saturn: `Saturn is moving through your ${ord(house)} house of ${h?.of}, which is one of the most useful money transits there is and one of the least comfortable. It audits. It removes what was never structurally sound, exposes where you have been undercharging, and asks you to build a genuine foundation rather than a run of good months. Anything decided here about rates and structures tends to hold, because Saturn makes things permanent.`,
    uranus: `Uranus is crossing your ${ord(house)} house of ${h?.of}, which disrupts whatever had become settled there. Expect a strong pull to do it your own way, and expect suppressing that to feel worse than usual.`,
    neptune: `Neptune is moving through your ${ord(house)} house of ${h?.of}, which softens the edges there. Inspiration is high and boundaries are low, so put terms in writing during this passage.`,
    pluto: `Pluto is transiting your ${ord(house)} house of ${h?.of}, which rebuilds that area from the foundations. Slow, thorough, and not optional.`,
    jupiter: `Jupiter is passing through your ${ord(house)} house of ${h?.of}, which is a genuine window of expansion in that territory. It lasts roughly a year, so use it rather than admire it.`,
  };
  return base[planet] ?? "";
}
