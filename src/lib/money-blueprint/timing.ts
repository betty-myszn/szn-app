/**
 * Money Blueprint — timing. Profections, returns, solar returns, transits and eclipses.
 *
 * The only module in the system that does new ephemeris work, and the only source of dates in the
 * report. The rule it exists to enforce:
 *
 *   **No date reaches the writer that did not come from a computed position.**
 *
 * A roadmap with invented dates is worse than no roadmap, because it is checkable and a buyer will
 * check it. Every event below carries the Julian day it was solved at, so any date in the finished
 * PDF can be traced back to an exact crossing.
 *
 * Kept separate from facts.ts on purpose: natal facts are birth-data only and cacheable forever,
 * timing facts expire. Cache them together and you eventually serve a roadmap that starts in the
 * wrong year.
 *
 * Dates are published in US Eastern, per lib/sky-zone.ts, so they agree with the tables buyers
 * check them against.
 */

import swisseph from "swisseph";
import path from "path";
import { DateTime } from "luxon";
import type { ChartData } from "@/types/chart";
import { SKY_ZONE } from "@/lib/sky-zone";
import type { TimingInput } from "./assemble";

const EPHE_PATH = path.join(process.cwd(), "ephe");
swisseph.swe_set_ephe_path(EPHE_PATH);

// ---------------------------------------------------------------------------- types

export type EventKind = "return" | "ingress" | "aspect" | "eclipse" | "profection" | "solar-return";

export interface TimingEvent {
  /** Calendar date in SKY_ZONE, YYYY-MM-DD. */
  date: string;
  /** The Julian day the crossing was solved at. Every date in the report traces back to one. */
  jd: number;
  kind: EventKind;
  /** Transiting body, or the eclipse type. */
  body: string;
  /** Natal point or house the event lands on. */
  target?: string;
  aspect?: "conjunction" | "sextile" | "square" | "trine" | "opposition";
  /** Natal house involved, where there is one. */
  house?: number;
  /** How much this event outranks the others in its year. Returns outrank transits, transits
   *  outrank eclipses, eclipses outrank the profection. */
  rank: number;
  label: string;
}

export interface Profection {
  age: number;
  house: number;
  sign: string;
  /** Ruler of the profected house's sign. The pivot: the year runs through wherever it sits. */
  yearLord: string;
  yearLordSign: string | null;
  yearLordHouse: number | null;
  label: string;
}

export interface RoadmapYear {
  /** Calendar year the profection year opens in. */
  year: number;
  age: number;
  /** The birthday this profection year begins on. */
  opensOn: string;
  /** The birthday it hands over on. */
  closesOn: string;
  /** How the chapter heads this year, since a profection year runs birthday to birthday rather
   *  than January to December and heading it with one number reads as wrong. */
  span: string;
  /** True for the first year when the buyer is already partway through it. The writer covers what
   *  is left rather than describing months that have already gone. */
  partial: boolean;
  profection: Profection;
  solarReturn: TimingEvent | null;
  /** Everything computed for this year, ranked. */
  events: TimingEvent[];
  /** The two or three that actually get written up. */
  headline: TimingEvent[];
  /** A year with nothing but the profection is a real and useful thing to say, framed as
   *  consolidation rather than as filler. */
  quiet: boolean;
}

export interface TimingFacts {
  generatedAt: string;
  /** Where the buyer is right now. */
  current: Profection;
  currentTransits: TimingEvent[];
  /** The lifetime return schedule, from birth to age 90. */
  returns: TimingEvent[];
  /** Returns still ahead of this buyer. */
  returnsAhead: TimingEvent[];
  /** Major returns inside the last year. Someone who came through their Saturn return five months
   *  ago is still living in it, and a roadmap that starts the day after generation would otherwise
   *  never mention the most significant thing that has just happened to them. */
  returnsJustPassed: TimingEvent[];
  /** Everything sampled across the next 60 months. */
  transits: TimingEvent[];
  eclipses: TimingEvent[];
  years: RoadmapYear[];
}

// ---------------------------------------------------------------------------- ephemeris

const BODIES: Record<string, { name: string; swissId: number }> = {
  jupiter: { name: "Jupiter", swissId: swisseph.SE_JUPITER },
  saturn: { name: "Saturn", swissId: swisseph.SE_SATURN },
  uranus: { name: "Uranus", swissId: swisseph.SE_URANUS },
  neptune: { name: "Neptune", swissId: swisseph.SE_NEPTUNE },
  pluto: { name: "Pluto", swissId: swisseph.SE_PLUTO },
  chiron: { name: "Chiron", swissId: swisseph.SE_CHIRON },
  // True node, never mean, per the convention the rest of the app follows.
  north_node: { name: "North Node", swissId: swisseph.SE_TRUE_NODE },
  sun: { name: "Sun", swissId: swisseph.SE_SUN },
};

/** The slow bodies whose movement is worth a five-year roadmap. */
const TRANSITING = ["jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "north_node"];

const FLAGS = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;

function longitudeAt(jd: number, swissId: number): number {
  const r = swisseph.swe_calc_ut(jd, swissId, FLAGS) as { longitude: number };
  return r.longitude;
}

const norm360 = (x: number) => ((x % 360) + 360) % 360;
/** Signed separation in (-180, 180]. */
const norm180 = (x: number) => {
  const n = norm360(x);
  return n > 180 ? n - 360 : n;
};

function jdFromDate(d: Date): number {
  const dt = DateTime.fromJSDate(d, { zone: "utc" });
  return swisseph.swe_julday(
    dt.year,
    dt.month,
    dt.day,
    dt.hour + dt.minute / 60 + dt.second / 3600,
    swisseph.SE_GREG_CAL
  ) as unknown as number;
}

/** JD to the published calendar date. Eastern, so it agrees with the tables. */
function dateFromJd(jd: number): string {
  const r = swisseph.swe_revjul(jd, swisseph.SE_GREG_CAL) as {
    year: number;
    month: number;
    day: number;
    hour: number;
  };
  const hour = Math.floor(r.hour);
  const minute = Math.round((r.hour - hour) * 60);
  return DateTime.fromObject(
    { year: r.year, month: r.month, day: r.day, hour, minute: Math.min(minute, 59) },
    { zone: "utc" }
  )
    .setZone(SKY_ZONE)
    .toFormat("yyyy-MM-dd");
}

/**
 * Every moment in the window at which a body reaches an exact longitude, bisected to about a
 * quarter of an hour. Retrograde bodies cross the same degree three times, and all three are real
 * events, so every crossing is returned rather than only the first.
 */
function findCrossings(swissId: number, targetLon: number, startJd: number, endJd: number, stepDays: number): number[] {
  const hits: number[] = [];
  let prevJd = startJd;
  let prev = norm180(longitudeAt(startJd, swissId) - targetLon);

  for (let jd = startJd + stepDays; jd <= endJd; jd += stepDays) {
    const cur = norm180(longitudeAt(jd, swissId) - targetLon);
    // A sign change across a short step is a crossing. The 180 guard rejects the wrap-around at
    // the far side of the circle, which is not a crossing of this degree at all.
    if (prev !== 0 && Math.sign(cur) !== Math.sign(prev) && Math.abs(cur - prev) < 180) {
      let lo = prevJd;
      let hi = jd;
      let loV = prev;
      for (let i = 0; i < 40 && hi - lo > 0.01; i++) {
        const mid = (lo + hi) / 2;
        const midV = norm180(longitudeAt(mid, swissId) - targetLon);
        if (Math.sign(midV) === Math.sign(loV)) {
          lo = mid;
          loV = midV;
        } else {
          hi = mid;
        }
      }
      hits.push((lo + hi) / 2);
    }
    prevJd = jd;
    prev = cur;
  }
  return hits;
}

// ---------------------------------------------------------------------------- profections

const SIGN_RULER: Record<string, string> = {
  Aries: "mars", Taurus: "venus", Gemini: "mercury", Cancer: "moon", Leo: "sun",
  Virgo: "mercury", Libra: "venus", Scorpio: "pluto", Sagittarius: "jupiter",
  Capricorn: "saturn", Aquarius: "uranus", Pisces: "neptune",
};

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const titleCase = (id: string) => id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * The annual profection. Age 0 sits in the 1st and the house advances one place every birthday, so
 * the whole thing is deterministic from age alone. The year lord is the ruler of the sign on that
 * house, and where it sits natally is what makes a profection year read as personal rather than as
 * a generic second-house year.
 */
export function profectionFor(chart: ChartData, age: number): Profection {
  const house = (age % 12) + 1;
  const cusp = chart.houses.find((c) => c.house === house);
  const sign = cusp?.sign ?? "";
  const lord = SIGN_RULER[sign] ?? "";
  const lordPlanet = chart.planets.find((p) => p.id === lord);
  return {
    age,
    house,
    sign,
    yearLord: lord,
    yearLordSign: lordPlanet?.sign ?? null,
    yearLordHouse: lordPlanet?.house ?? null,
    label:
      `Profected ${ORDINAL[house]} house in ${sign}, year lord ${titleCase(lord)}` +
      (lordPlanet ? ` in ${lordPlanet.sign} in the ${ORDINAL[lordPlanet.house]} house` : ""),
  };
}

function ageOn(birthJd: number, jd: number): number {
  return Math.floor((jd - birthJd) / 365.2422);
}

// ---------------------------------------------------------------------------- returns

/**
 * The cycles worth planning around, each solved rather than approximated from an average period.
 *
 * `minAge` is the earliest a genuine return is possible for that body. It exists because a body
 * retrograde at birth re-crosses its own natal degree within months, and that re-pass is not a
 * return: without the floor, anyone born under a retrograde Chiron is told their Chiron return
 * happened before their first birthday.
 */
const RETURN_SPEC: Array<{ body: string; angle: number; name: string; rank: number; minAge: number }> = [
  { body: "saturn", angle: 0, name: "Saturn return", rank: 5, minAge: 20 },
  { body: "chiron", angle: 0, name: "Chiron return", rank: 5, minAge: 30 },
  { body: "uranus", angle: 180, name: "Uranus opposition", rank: 5, minAge: 30 },
  { body: "north_node", angle: 0, name: "Nodal return", rank: 4, minAge: 12 },
  { body: "jupiter", angle: 0, name: "Jupiter return", rank: 4, minAge: 8 },
];

function returnSchedule(chart: ChartData, birthJd: number): TimingEvent[] {
  const out: TimingEvent[] = [];
  const end = birthJd + 90 * 365.2422;

  for (const spec of RETURN_SPEC) {
    const natal = chart.planets.find((p) => p.id === spec.body);
    if (!natal) continue;
    const target = norm360(natal.longitude + spec.angle);
    // 20-day steps: Saturn and slower cannot cross a degree and come back inside that.
    const hits = findCrossings(BODIES[spec.body].swissId, target, birthJd + 30, end, 20);
    // Retrograde bodies make the same return two or three times over a few months. Written up as
    // one event with the first exact hit, which is how an astrologer would talk about it.
    let lastYear = -99;
    for (const jd of hits) {
      const age = ageOn(birthJd, jd);
      if (age < spec.minAge) continue;
      if (age - lastYear < 2) continue;
      lastYear = age;
      out.push({
        date: dateFromJd(jd),
        jd,
        kind: "return",
        body: spec.body,
        rank: spec.rank,
        label: `${spec.name} at ${age}`,
      });
    }
  }
  return out.sort((a, b) => a.jd - b.jd);
}

/** The moment the transiting Sun comes back to its exact natal longitude. One solve per year. */
function solarReturn(chart: ChartData, birthJd: number, year: number): TimingEvent | null {
  const sun = chart.planets.find((p) => p.id === "sun");
  if (!sun) return null;
  const start = jdFromDate(new Date(Date.UTC(year, 0, 1)));
  const hits = findCrossings(BODIES.sun.swissId, sun.longitude, start, start + 366, 2);
  if (!hits.length) return null;
  return {
    date: dateFromJd(hits[0]),
    jd: hits[0],
    kind: "solar-return",
    body: "sun",
    rank: 2,
    label: `Solar return, ${dateFromJd(hits[0])}`,
  };
}

// ---------------------------------------------------------------------------- transits

const ASPECTS: Array<{ angle: number; type: TimingEvent["aspect"]; rank: number }> = [
  { angle: 0, type: "conjunction", rank: 3 },
  { angle: 180, type: "opposition", rank: 3 },
  { angle: 90, type: "square", rank: 3 },
  { angle: 120, type: "trine", rank: 2 },
  { angle: 60, type: "sextile", rank: 1 },
];

/** Natal points a slow transit to which is worth a paragraph. */
const NATAL_TARGETS = ["sun", "moon", "venus", "mars", "mercury", "jupiter", "saturn", "pluto", "chiron"];

const MONEY_HOUSES = [2, 6, 8, 10, 11];

function houseOf(chart: ChartData, longitude: number): number | null {
  const cusps = chart.houses;
  if (!cusps?.length) return null;
  const l = norm360(longitude);
  for (let i = 0; i < 12; i++) {
    const s = norm360(cusps[i].longitude);
    const e = norm360(cusps[(i + 1) % 12].longitude);
    const inside = s < e ? l >= s && l < e : l >= s || l < e;
    if (inside) return cusps[i].house;
  }
  return null;
}

function sampleTransits(chart: ChartData, startJd: number, endJd: number): TimingEvent[] {
  const out: TimingEvent[] = [];

  for (const bodyId of TRANSITING) {
    const swissId = BODIES[bodyId].swissId;
    const bodyName = BODIES[bodyId].name;

    // ---- exact aspects to natal points
    for (const targetId of NATAL_TARGETS) {
      const natal = chart.planets.find((p) => p.id === targetId);
      if (!natal) continue;
      // A body does not aspect itself; that is its return, handled above.
      if (targetId === bodyId) continue;
      for (const asp of ASPECTS) {
        for (const sign of asp.angle === 0 || asp.angle === 180 ? [1] : [1, -1]) {
          const target = norm360(natal.longitude + asp.angle * sign);
          for (const jd of findCrossings(swissId, target, startJd, endJd, 10)) {
            out.push({
              date: dateFromJd(jd),
              jd,
              kind: "aspect",
              body: bodyId,
              target: targetId,
              aspect: asp.type,
              house: natal.house,
              rank: asp.rank + (MONEY_HOUSES.includes(natal.house) ? 1 : 0),
              label: `Transiting ${bodyName} ${asp.type} natal ${titleCase(targetId)} in the ${ORDINAL[natal.house]} house`,
            });
          }
        }
      }
    }

    // ---- ingresses into natal houses
    for (const cusp of chart.houses) {
      for (const jd of findCrossings(swissId, cusp.longitude, startJd, endJd, 10)) {
        out.push({
          date: dateFromJd(jd),
          jd,
          kind: "ingress",
          body: bodyId,
          house: cusp.house,
          rank: MONEY_HOUSES.includes(cusp.house) ? 4 : 2,
          label: `Transiting ${bodyName} enters your ${ORDINAL[cusp.house]} house`,
        });
      }
    }
  }

  // An ingress and its immediate retrograde re-entry are one story. Keep the first.
  const seen = new Map<string, number>();
  return out
    .filter((e) => {
      const key = `${e.kind}:${e.body}:${e.target ?? ""}:${e.aspect ?? ""}:${e.house ?? ""}`;
      const last = seen.get(key);
      if (last !== undefined && e.jd - last < 200) return false;
      seen.set(key, e.jd);
      return true;
    })
    .sort((a, b) => a.jd - b.jd);
}

// ---------------------------------------------------------------------------- eclipses

function eclipses(chart: ChartData, startJd: number, endJd: number): TimingEvent[] {
  const out: TimingEvent[] = [];

  let jd = startJd;
  for (let i = 0; i < 40 && jd < endJd; i++) {
    const r = swisseph.swe_sol_eclipse_when_glob(jd, swisseph.SEFLG_SWIEPH, 0, 0) as {
      maximum: number;
      rflag?: number;
    };
    if (!r || !Number.isFinite(r.maximum) || r.maximum > endJd) break;
    const lon = longitudeAt(r.maximum, BODIES.sun.swissId);
    const house = houseOf(chart, lon);
    out.push({
      date: dateFromJd(r.maximum),
      jd: r.maximum,
      kind: "eclipse",
      body: "solar-eclipse",
      house: house ?? undefined,
      rank: house && MONEY_HOUSES.includes(house) ? 3 : 1,
      label: `Solar eclipse in your ${house ? ORDINAL[house] : "chart"}${house ? " house" : ""}`,
    });
    jd = r.maximum + 20;
  }

  jd = startJd;
  for (let i = 0; i < 40 && jd < endJd; i++) {
    const r = swisseph.swe_lun_eclipse_when(jd, swisseph.SEFLG_SWIEPH, 0, 0) as {
      maximum: number;
    };
    if (!r || !Number.isFinite(r.maximum) || r.maximum > endJd) break;
    // A lunar eclipse is the Moon opposite the Sun, so it lands on the house opposite the Sun's.
    const lon = norm360(longitudeAt(r.maximum, BODIES.sun.swissId) + 180);
    const house = houseOf(chart, lon);
    out.push({
      date: dateFromJd(r.maximum),
      jd: r.maximum,
      kind: "eclipse",
      body: "lunar-eclipse",
      house: house ?? undefined,
      rank: house && MONEY_HOUSES.includes(house) ? 3 : 1,
      label: `Lunar eclipse in your ${house ? ORDINAL[house] : "chart"}${house ? " house" : ""}`,
    });
    jd = r.maximum + 20;
  }

  return out.sort((a, b) => a.jd - b.jd);
}

// ---------------------------------------------------------------------------- assembly

/** How many events a year needs before it is not a quiet year. */
const QUIET_THRESHOLD = 2;
/** Ranking and leading with one is what an astrologer does. Listing eight is what software does. */
const HEADLINE_EVENTS = 3;

export function deriveTiming(chart: ChartData, now: Date = new Date()): TimingFacts {
  const birthJd = chart.julianDay;
  const startJd = jdFromDate(now);
  const endJd = startJd + 5 * 365.2422;

  const currentAge = ageOn(birthJd, startJd);
  const current = profectionFor(chart, currentAge);

  const returns = returnSchedule(chart, birthJd);
  const transits = sampleTransits(chart, startJd, endJd);
  const ecl = eclipses(chart, startJd, endJd);

  // ---- five profection years, each opening on the buyer's birthday
  const years: RoadmapYear[] = [];
  for (let i = 0; i < 5; i++) {
    const age = currentAge + i;
    // The profection year opens on the birthday, which is where the solar return sits.
    const opensJd = birthJd + age * 365.2422;
    const opensDate = DateTime.fromISO(dateFromJd(opensJd));
    const calendarYear = opensDate.year;
    const nextOpensJd = birthJd + (age + 1) * 365.2422;

    // Nothing already past is ever printed: the first profection year is usually part elapsed, and
    // a roadmap that opens by describing last spring is a roadmap the buyer stops trusting.
    const from = Math.max(opensJd, startJd);
    const inWindow = (e: TimingEvent) => e.jd >= from && e.jd < nextOpensJd;
    const events = [...returns.filter(inWindow), ...transits.filter(inWindow), ...ecl.filter(inWindow)].sort(
      (a, b) => b.rank - a.rank || a.jd - b.jd
    );

    const closesOn = dateFromJd(nextOpensJd);
    const partial = opensJd < startJd;
    const monthYear = (iso: string) => DateTime.fromISO(iso).toFormat("LLLL yyyy");

    years.push({
      year: calendarYear,
      age,
      opensOn: dateFromJd(opensJd),
      closesOn,
      span: partial
        ? `now to ${monthYear(closesOn)}`
        : `${monthYear(dateFromJd(opensJd))} to ${monthYear(closesOn)}`,
      partial,
      profection: profectionFor(chart, age),
      solarReturn: solarReturn(chart, birthJd, calendarYear),
      events,
      headline: events.slice(0, HEADLINE_EVENTS),
      quiet: events.filter((e) => e.rank >= 3).length < QUIET_THRESHOLD,
    });
  }

  const currentTransits = transits.filter((e) => e.jd < startJd + 365).slice(0, 8);

  return {
    generatedAt: now.toISOString(),
    current,
    currentTransits,
    returns,
    returnsAhead: returns.filter((e) => e.jd > startJd),
    returnsJustPassed: returns.filter((e) => e.jd <= startJd && startJd - e.jd < 365.2422),
    transits,
    eclipses: ecl,
    years,
  };
}

/**
 * Timing facts in the shape the entitlement gate reads, so a section that did not declare
 * `timing.roadmap` in its `reads` cannot mention a single date from it.
 */
export function toTimingInput(t: TimingFacts): TimingInput {
  return {
    profection: { label: t.current.label, value: t.current },
    returns: {
      label: [
        t.returnsJustPassed.length
          ? `Just came through: ${t.returnsJustPassed.map((r) => `${r.label} (${r.date})`).join("; ")}`
          : "",
        t.returnsAhead.length
          ? `Returns ahead: ${t.returnsAhead.slice(0, 5).map((r) => `${r.label} (${r.date})`).join("; ")}`
          : "No further major returns in the next twenty years",
      ]
        .filter(Boolean)
        .join(". "),
      value: { all: t.returns, ahead: t.returnsAhead, justPassed: t.returnsJustPassed },
    },
    transits: {
      label: t.currentTransits.length
        ? `Current transits: ${t.currentTransits.map((e) => `${e.label} (${e.date})`).join("; ")}`
        : "No exact slow-planet contacts in the year ahead",
      value: t.currentTransits,
    },
    eclipses: {
      label: t.eclipses.length
        ? `Eclipses in window: ${t.eclipses.map((e) => `${e.label} (${e.date})`).join("; ")}`
        : "No eclipses landing in a money house in this window",
      value: t.eclipses,
    },
    roadmap: {
      label: t.years
        .map((y) => `${y.span} (age ${y.age}): ${y.profection.label}${y.quiet ? ", consolidating" : ""}`)
        .join(" · "),
      value: t.years,
    },
  };
}
