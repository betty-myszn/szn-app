import swisseph from "swisseph";
import { DateTime } from "luxon";
import { ZODIAC_SIGNS } from "@/types/chart";
import { SKY_ZONE } from "@/lib/sky-zone";

// Server-only (Swiss Ephemeris). The fast-moving half of the sky for /api/calendar: where Mercury,
// Venus and Mars are right now, when they change sign or station, the hard contacts Venus and Mars
// make to the outer planets, and which slow planets are retrograde today. The calendar route already
// covered lunations and the outer planets; without this the cosmic weather never mentioned Mercury
// changing sign at all.
//
// Every crossing is bisected to the moment, then published as a date in SKY_ZONE like everything
// else the calendar returns.

export type PersonalPlanet = "Mercury" | "Venus" | "Mars";
export type HardAspect = "conjunction" | "square" | "opposition";

export interface PersonalNow {
  planet: PersonalPlanet;
  sign: string;
  degree: number;
  retrograde: boolean;
  /** The day it entered this sign (null if longer ago than the scan looks back). */
  since: string | null;
  /** The day it leaves this sign (null if further out than the scan looks ahead). */
  until: string | null;
  /** Stations it makes before it leaves this sign. */
  stations: { type: "retrograde_start" | "retrograde_end"; date: string; degree: number }[];
}

export interface PersonalEvent {
  type: "ingress" | "retrograde_start" | "retrograde_end" | "aspect";
  date: string;
  planet: PersonalPlanet;
  sign: string;
  degree: number;
  /** Ingress only: it is backing into the sign. */
  retrograde?: boolean;
  otherPlanet?: string;
  otherSign?: string;
  otherDegree?: number;
  aspectType?: HardAspect;
}

export interface RetrogradeNow {
  planet: string;
  sign: string;
  degree: number;
  since: string | null;
  until: string | null;
}

const PERSONAL: { name: PersonalPlanet; id: number }[] = [
  { name: "Mercury", id: swisseph.SE_MERCURY },
  { name: "Venus", id: swisseph.SE_VENUS },
  { name: "Mars", id: swisseph.SE_MARS },
];

const OUTERS: { name: string; id: number }[] = [
  { name: "Jupiter", id: swisseph.SE_JUPITER },
  { name: "Saturn", id: swisseph.SE_SATURN },
  { name: "Uranus", id: swisseph.SE_URANUS },
  { name: "Neptune", id: swisseph.SE_NEPTUNE },
  { name: "Pluto", id: swisseph.SE_PLUTO },
];

// Slow bodies whose retrogrades sit in the background for months.
const SLOW_RETRO: { name: string; id: number }[] = [...OUTERS, { name: "Chiron", id: swisseph.SE_CHIRON }];

function calc(jd: number, body: number): { lon: number; speed: number } {
  const r = swisseph.swe_calc_ut(jd, body, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED) as {
    longitude: number;
    longitudeSpeed: number;
  };
  return { lon: ((r.longitude % 360) + 360) % 360, speed: r.longitudeSpeed };
}

function jdToIso(jd: number): string {
  return DateTime.fromMillis((jd - 2440587.5) * 86400000, { zone: SKY_ZONE }).toISODate() ?? "";
}

const signIndex = (lon: number) => Math.floor(lon / 30) % 12;
const signOf = (lon: number) => ZODIAC_SIGNS[signIndex(lon)];
const degreeOf = (lon: number) => Math.floor(lon - signIndex(lon) * 30);

function bisect(lo: number, hi: number, isAfter: (jd: number) => boolean): number {
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2;
    if (isAfter(mid)) hi = mid;
    else lo = mid;
  }
  return hi;
}

// Signed distance of A from B relative to a target angle, in -180..180. Crossing zero is the exact
// aspect. A folded 0..180 separation never crosses 0 or 180, so it can never see a conjunction or an
// opposition; the signed form sees all of them.
function signedOff(jd: number, a: number, b: number, target: number): number {
  return ((calc(jd, a).lon - calc(jd, b).lon - target) % 360 + 540) % 360 - 180;
}

/** First sign change after `from` (or before it, stepping back), as a JD. */
function findIngress(body: number, from: number, dir: 1 | -1, maxDays: number): number | null {
  const startSign = signIndex(calc(from, body).lon);
  const step = 0.5 * dir;
  for (let t = step; Math.abs(t) <= maxDays; t += step) {
    const jd = from + t;
    if (signIndex(calc(jd, body).lon) !== startSign) {
      const [lo, hi] = dir === 1 ? [jd - step, jd] : [jd, jd - step];
      const loSign = signIndex(calc(lo, body).lon);
      return bisect(lo, hi, (x) => signIndex(calc(x, body).lon) !== loSign);
    }
  }
  return null;
}

/** First station (speed changing sign) after or before `from`, as a JD. */
function findStation(body: number, from: number, dir: 1 | -1, maxDays: number): number | null {
  const startRetro = calc(from, body).speed < 0;
  const step = 0.5 * dir;
  for (let t = step; Math.abs(t) <= maxDays; t += step) {
    const jd = from + t;
    if (calc(jd, body).speed < 0 !== startRetro) {
      const [lo, hi] = dir === 1 ? [jd - step, jd] : [jd, jd - step];
      const loRetro = calc(lo, body).speed < 0;
      return bisect(lo, hi, (x) => calc(x, body).speed < 0 !== loRetro);
    }
  }
  return null;
}

export function scanPersonalSky(startJd: number, aheadDays = 75): {
  personalNow: PersonalNow[];
  personalEvents: PersonalEvent[];
  retrogradeNow: RetrogradeNow[];
} {
  const personalNow: PersonalNow[] = PERSONAL.map(({ name, id }) => {
    const now = calc(startJd, id);
    const sinceJd = findIngress(id, startJd, -1, 260);
    const untilJd = findIngress(id, startJd, 1, 260);
    const stations: PersonalNow["stations"] = [];
    let cursor = startJd;
    for (let k = 0; k < 3; k++) {
      const st = findStation(id, cursor, 1, untilJd ? untilJd - cursor : 0);
      if (!st || (untilJd && st > untilJd)) break;
      const after = calc(st + 0.01, id);
      stations.push({ type: after.speed < 0 ? "retrograde_start" : "retrograde_end", date: jdToIso(st), degree: degreeOf(after.lon) });
      cursor = st + 0.5;
    }
    return {
      planet: name,
      sign: signOf(now.lon),
      degree: degreeOf(now.lon),
      retrograde: now.speed < 0,
      since: sinceJd ? jdToIso(sinceJd) : null,
      until: untilJd ? jdToIso(untilJd) : null,
      stations,
    };
  });

  const events: PersonalEvent[] = [];
  for (const { name, id } of PERSONAL) {
    // Ingresses and stations, walked forward one crossing at a time.
    let cursor = startJd;
    for (let k = 0; k < 8; k++) {
      const jd = findIngress(id, cursor, 1, startJd + aheadDays - cursor);
      if (!jd) break;
      const p = calc(jd + 0.001, id);
      events.push({ type: "ingress", date: jdToIso(jd), planet: name, sign: signOf(p.lon), degree: 0, ...(p.speed < 0 ? { retrograde: true } : {}) });
      cursor = jd + 0.25;
    }
    cursor = startJd;
    for (let k = 0; k < 4; k++) {
      const jd = findStation(id, cursor, 1, startJd + aheadDays - cursor);
      if (!jd) break;
      const p = calc(jd + 0.01, id);
      events.push({ type: p.speed < 0 ? "retrograde_start" : "retrograde_end", date: jdToIso(jd), planet: name, sign: signOf(p.lon), degree: degreeOf(p.lon) });
      cursor = jd + 0.5;
    }
  }

  // Venus and Mars hard contacts to the slow planets: the "pressure" days people feel. Mercury makes
  // these several times a month, so it would drown the rail; its own sign changes and stations carry it.
  for (const p of PERSONAL.filter((x) => x.name !== "Mercury")) {
    for (const o of OUTERS) {
      for (const [target, aspectType] of [
        [0, "conjunction"],
        [90, "square"],
        [180, "opposition"],
        [270, "square"],
      ] as [number, HardAspect][]) {
        let prev = signedOff(startJd, p.id, o.id, target);
        for (let t = 0.5; t <= aheadDays; t += 0.5) {
          const jd = startJd + t;
          const off = signedOff(jd, p.id, o.id, target);
          // A real crossing moves a little; a jump of ~360 is the wrap at ±180, not an aspect.
          if (Math.sign(off) !== Math.sign(prev) && Math.abs(off - prev) < 20) {
            const exact = bisect(jd - 0.5, jd, (x) => Math.sign(signedOff(x, p.id, o.id, target)) === Math.sign(off));
            const a = calc(exact, p.id).lon;
            const b = calc(exact, o.id).lon;
            events.push({ type: "aspect", date: jdToIso(exact), planet: p.name, sign: signOf(a), degree: degreeOf(a), otherPlanet: o.name, otherSign: signOf(b), otherDegree: degreeOf(b), aspectType });
          }
          prev = off;
        }
      }
    }
  }
  events.sort((a, b) => a.date.localeCompare(b.date));

  const retrogradeNow: RetrogradeNow[] = [];
  for (const { name, id } of SLOW_RETRO) {
    const now = calc(startJd, id);
    if (now.speed >= 0) continue;
    const sinceJd = findStation(id, startJd, -1, 200);
    const untilJd = findStation(id, startJd, 1, 220);
    retrogradeNow.push({
      planet: name,
      sign: signOf(now.lon),
      degree: degreeOf(now.lon),
      since: sinceJd ? jdToIso(sinceJd) : null,
      until: untilJd ? jdToIso(untilJd) : null,
    });
  }

  return { personalNow, personalEvents: events, retrogradeNow };
}
