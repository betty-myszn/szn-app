// The MY SZN sky bank: every lunation, eclipse, planetary station and nodal sign change for 2026
// and 2027, so the calendar and the content can talk about the whole year ahead rather than only the
// 60 days /api/calendar scans live.
//
// GENERATED, not typed in. Every row was computed from the app's own Swiss Ephemeris (true node,
// same engine as /api/calendar and everyone's natal chart) and then checked against Betty's
// Astro-Seek tables for 2027 lunations and 2026 retrogrades: every lunation lands within a minute
// and every station matches. __tests__/sky-bank.test.ts re-derives the rows from the ephemeris, so a
// hand edit that drifts from the sky fails the build.
//
// Two ways this differs from a pasted table, both on purpose:
//  - An eclipse IS its lunation. Astro-Seek lists "New Moon" and "Solar Eclipse" as two rows a few
//    minutes apart; here each is one event, typed as the eclipse, timed at the exact new or full moon.
//  - Lunar eclipses use a 17° node limit. /api/calendar and /api/eclipses currently use 12°, which
//    drops the real 18 Jul 2027 (15.7° from the node) and 17 Aug 2027 (12.7°) lunar eclipses.
//
// `date` is the calendar day in US Eastern (SKY_ZONE, see lib/sky-zone.ts), matching what the
// calendar publishes. `utc` is the exact moment, matching Astro-Seek's UT tables. `degree` and
// `minute` are the position within the sign.
//
// To extend past 2027, re-run the generator rather than adding rows by hand.

import type { LunationType } from "@/lib/moon-content";

export interface SkyBankEvent {
  type: LunationType;
  /** YYYY-MM-DD in US Eastern. */
  date: string;
  /** Exact moment, ISO UTC to the minute. */
  utc: string;
  /** Stations and node ingresses only. */
  planet?: string;
  sign: string;
  degree: number;
  minute: number;
  /** Eclipses only: which end of the true nodal axis it sits on. */
  nodeEnd?: "north" | "south";
}

export const SKY_BANK: SkyBankEvent[] = [
  { type: "retrograde_end", date: "2026-01-02", utc: "2026-01-02T14:37Z", planet: "Chiron", sign: "Aries", degree: 22, minute: 35 },
  { type: "full_moon", date: "2026-01-03", utc: "2026-01-03T10:02Z", sign: "Cancer", degree: 13, minute: 1 },
  { type: "new_moon", date: "2026-01-18", utc: "2026-01-18T19:51Z", sign: "Capricorn", degree: 28, minute: 43 },
  { type: "full_moon", date: "2026-02-01", utc: "2026-02-01T22:09Z", sign: "Leo", degree: 13, minute: 3 },
  { type: "retrograde_end", date: "2026-02-03", utc: "2026-02-04T02:33Z", planet: "Uranus", sign: "Taurus", degree: 27, minute: 27 },
  { type: "solar_eclipse", date: "2026-02-17", utc: "2026-02-17T12:01Z", sign: "Aquarius", degree: 28, minute: 49, nodeEnd: "north" },
  { type: "retrograde_start", date: "2026-02-26", utc: "2026-02-26T06:48Z", planet: "Mercury", sign: "Pisces", degree: 22, minute: 33 },
  { type: "lunar_eclipse", date: "2026-03-03", utc: "2026-03-03T11:37Z", sign: "Virgo", degree: 12, minute: 53, nodeEnd: "south" },
  { type: "retrograde_end", date: "2026-03-10", utc: "2026-03-11T03:29Z", planet: "Jupiter", sign: "Cancer", degree: 15, minute: 5 },
  { type: "new_moon", date: "2026-03-18", utc: "2026-03-19T01:23Z", sign: "Pisces", degree: 28, minute: 27 },
  { type: "retrograde_end", date: "2026-03-20", utc: "2026-03-20T19:32Z", planet: "Mercury", sign: "Pisces", degree: 8, minute: 29 },
  { type: "full_moon", date: "2026-04-01", utc: "2026-04-02T02:11Z", sign: "Libra", degree: 12, minute: 21 },
  { type: "new_moon", date: "2026-04-17", utc: "2026-04-17T11:51Z", sign: "Aries", degree: 27, minute: 28 },
  { type: "full_moon", date: "2026-05-01", utc: "2026-05-01T17:23Z", sign: "Scorpio", degree: 11, minute: 20 },
  { type: "retrograde_start", date: "2026-05-06", utc: "2026-05-06T15:34Z", planet: "Pluto", sign: "Aquarius", degree: 5, minute: 30 },
  { type: "new_moon", date: "2026-05-16", utc: "2026-05-16T20:00Z", sign: "Taurus", degree: 25, minute: 57 },
  { type: "full_moon", date: "2026-05-31", utc: "2026-05-31T08:45Z", sign: "Sagittarius", degree: 9, minute: 55 },
  { type: "new_moon", date: "2026-06-14", utc: "2026-06-15T02:54Z", sign: "Gemini", degree: 24, minute: 3 },
  { type: "retrograde_start", date: "2026-06-29", utc: "2026-06-29T17:35Z", planet: "Mercury", sign: "Cancer", degree: 26, minute: 15 },
  { type: "full_moon", date: "2026-06-29", utc: "2026-06-29T23:56Z", sign: "Capricorn", degree: 8, minute: 14 },
  { type: "retrograde_start", date: "2026-07-07", utc: "2026-07-07T10:54Z", planet: "Neptune", sign: "Aries", degree: 4, minute: 25 },
  { type: "new_moon", date: "2026-07-14", utc: "2026-07-14T09:43Z", sign: "Cancer", degree: 21, minute: 59 },
  { type: "retrograde_end", date: "2026-07-23", utc: "2026-07-23T22:57Z", planet: "Mercury", sign: "Cancer", degree: 16, minute: 18 },
  { type: "retrograde_start", date: "2026-07-26", utc: "2026-07-26T19:56Z", planet: "Saturn", sign: "Aries", degree: 14, minute: 44 },
  { type: "node_ingress", date: "2026-07-26", utc: "2026-07-27T00:46Z", planet: "North Node", sign: "Aquarius", degree: 29, minute: 59 },
  { type: "full_moon", date: "2026-07-29", utc: "2026-07-29T14:35Z", sign: "Aquarius", degree: 6, minute: 30 },
  { type: "retrograde_start", date: "2026-08-03", utc: "2026-08-03T20:10Z", planet: "Chiron", sign: "Taurus", degree: 0, minute: 52 },
  { type: "solar_eclipse", date: "2026-08-12", utc: "2026-08-12T17:36Z", sign: "Leo", degree: 20, minute: 1, nodeEnd: "south" },
  { type: "lunar_eclipse", date: "2026-08-28", utc: "2026-08-28T04:18Z", sign: "Pisces", degree: 4, minute: 54, nodeEnd: "north" },
  { type: "retrograde_start", date: "2026-09-10", utc: "2026-09-10T18:27Z", planet: "Uranus", sign: "Gemini", degree: 5, minute: 41 },
  { type: "new_moon", date: "2026-09-10", utc: "2026-09-11T03:26Z", sign: "Virgo", degree: 18, minute: 25 },
  { type: "full_moon", date: "2026-09-26", utc: "2026-09-26T16:48Z", sign: "Aries", degree: 3, minute: 37 },
  { type: "retrograde_start", date: "2026-10-03", utc: "2026-10-03T07:15Z", planet: "Venus", sign: "Scorpio", degree: 8, minute: 29 },
  { type: "new_moon", date: "2026-10-10", utc: "2026-10-10T15:50Z", sign: "Libra", degree: 17, minute: 21 },
  { type: "retrograde_end", date: "2026-10-15", utc: "2026-10-16T02:40Z", planet: "Pluto", sign: "Aquarius", degree: 3, minute: 4 },
  { type: "retrograde_start", date: "2026-10-24", utc: "2026-10-24T07:12Z", planet: "Mercury", sign: "Scorpio", degree: 20, minute: 58 },
  { type: "full_moon", date: "2026-10-26", utc: "2026-10-26T04:11Z", sign: "Taurus", degree: 2, minute: 45 },
  { type: "new_moon", date: "2026-11-09", utc: "2026-11-09T07:02Z", sign: "Scorpio", degree: 16, minute: 53 },
  { type: "retrograde_end", date: "2026-11-13", utc: "2026-11-13T15:53Z", planet: "Mercury", sign: "Scorpio", degree: 5, minute: 2 },
  { type: "retrograde_end", date: "2026-11-13", utc: "2026-11-14T00:27Z", planet: "Venus", sign: "Libra", degree: 22, minute: 51 },
  { type: "full_moon", date: "2026-11-24", utc: "2026-11-24T14:53Z", sign: "Gemini", degree: 2, minute: 20 },
  { type: "new_moon", date: "2026-12-08", utc: "2026-12-09T00:51Z", sign: "Sagittarius", degree: 16, minute: 56 },
  { type: "retrograde_end", date: "2026-12-10", utc: "2026-12-10T23:31Z", planet: "Saturn", sign: "Aries", degree: 7, minute: 55 },
  { type: "retrograde_end", date: "2026-12-12", utc: "2026-12-12T22:17Z", planet: "Neptune", sign: "Aries", degree: 1, minute: 36 },
  { type: "retrograde_start", date: "2026-12-12", utc: "2026-12-13T00:56Z", planet: "Jupiter", sign: "Leo", degree: 27, minute: 1 },
  { type: "full_moon", date: "2026-12-23", utc: "2026-12-24T01:28Z", sign: "Cancer", degree: 2, minute: 13 },
  { type: "retrograde_end", date: "2027-01-06", utc: "2027-01-06T11:00Z", planet: "Chiron", sign: "Aries", degree: 26, minute: 15 },
  { type: "new_moon", date: "2027-01-07", utc: "2027-01-07T20:24Z", sign: "Capricorn", degree: 17, minute: 18 },
  { type: "retrograde_start", date: "2027-01-10", utc: "2027-01-10T12:59Z", planet: "Mars", sign: "Virgo", degree: 10, minute: 25 },
  { type: "full_moon", date: "2027-01-22", utc: "2027-01-22T12:17Z", sign: "Leo", degree: 2, minute: 14 },
  { type: "solar_eclipse", date: "2027-02-06", utc: "2027-02-06T15:56Z", sign: "Aquarius", degree: 17, minute: 37, nodeEnd: "north" },
  { type: "retrograde_end", date: "2027-02-08", utc: "2027-02-08T12:29Z", planet: "Uranus", sign: "Gemini", degree: 1, minute: 40 },
  { type: "retrograde_start", date: "2027-02-09", utc: "2027-02-09T17:36Z", planet: "Mercury", sign: "Pisces", degree: 5, minute: 58 },
  { type: "lunar_eclipse", date: "2027-02-20", utc: "2027-02-20T23:23Z", sign: "Virgo", degree: 2, minute: 5, nodeEnd: "south" },
  { type: "retrograde_end", date: "2027-03-03", utc: "2027-03-03T12:31Z", planet: "Mercury", sign: "Aquarius", degree: 20, minute: 55 },
  { type: "new_moon", date: "2027-03-08", utc: "2027-03-08T09:29Z", sign: "Pisces", degree: 17, minute: 34 },
  { type: "full_moon", date: "2027-03-22", utc: "2027-03-22T10:43Z", sign: "Libra", degree: 1, minute: 35 },
  { type: "retrograde_end", date: "2027-04-01", utc: "2027-04-01T14:08Z", planet: "Mars", sign: "Leo", degree: 20, minute: 55 },
  { type: "new_moon", date: "2027-04-06", utc: "2027-04-06T23:51Z", sign: "Aries", degree: 16, minute: 57 },
  { type: "retrograde_end", date: "2027-04-12", utc: "2027-04-13T02:11Z", planet: "Jupiter", sign: "Leo", degree: 16, minute: 59 },
  { type: "full_moon", date: "2027-04-20", utc: "2027-04-20T22:27Z", sign: "Scorpio", degree: 0, minute: 36 },
  { type: "new_moon", date: "2027-05-06", utc: "2027-05-06T10:58Z", sign: "Taurus", degree: 15, minute: 42 },
  { type: "retrograde_start", date: "2027-05-08", utc: "2027-05-08T12:54Z", planet: "Pluto", sign: "Aquarius", degree: 7, minute: 10 },
  { type: "full_moon", date: "2027-05-20", utc: "2027-05-20T10:58Z", sign: "Scorpio", degree: 29, minute: 13 },
  { type: "new_moon", date: "2027-06-04", utc: "2027-06-04T19:40Z", sign: "Gemini", degree: 13, minute: 58 },
  { type: "retrograde_start", date: "2027-06-10", utc: "2027-06-10T18:15Z", planet: "Mercury", sign: "Cancer", degree: 6, minute: 21 },
  { type: "full_moon", date: "2027-06-18", utc: "2027-06-19T00:44Z", sign: "Sagittarius", degree: 27, minute: 33 },
  { type: "new_moon", date: "2027-07-03", utc: "2027-07-04T03:02Z", sign: "Cancer", degree: 11, minute: 57 },
  { type: "retrograde_end", date: "2027-07-04", utc: "2027-07-04T19:39Z", planet: "Mercury", sign: "Gemini", degree: 27, minute: 28 },
  { type: "retrograde_start", date: "2027-07-09", utc: "2027-07-09T22:41Z", planet: "Neptune", sign: "Aries", degree: 6, minute: 39 },
  { type: "lunar_eclipse", date: "2027-07-18", utc: "2027-07-18T15:44Z", sign: "Capricorn", degree: 25, minute: 48, nodeEnd: "north" },
  { type: "solar_eclipse", date: "2027-08-02", utc: "2027-08-02T10:05Z", sign: "Leo", degree: 9, minute: 55, nodeEnd: "south" },
  { type: "retrograde_start", date: "2027-08-07", utc: "2027-08-08T02:55Z", planet: "Chiron", sign: "Taurus", degree: 4, minute: 40 },
  { type: "retrograde_start", date: "2027-08-09", utc: "2027-08-09T18:05Z", planet: "Saturn", sign: "Aries", degree: 27, minute: 52 },
  { type: "lunar_eclipse", date: "2027-08-17", utc: "2027-08-17T07:28Z", sign: "Aquarius", degree: 24, minute: 11, nodeEnd: "north" },
  { type: "new_moon", date: "2027-08-31", utc: "2027-08-31T17:41Z", sign: "Virgo", degree: 8, minute: 6 },
  { type: "retrograde_start", date: "2027-09-15", utc: "2027-09-15T09:09Z", planet: "Uranus", sign: "Gemini", degree: 9, minute: 57 },
  { type: "full_moon", date: "2027-09-15", utc: "2027-09-15T23:03Z", sign: "Pisces", degree: 22, minute: 52 },
  { type: "new_moon", date: "2027-09-29", utc: "2027-09-30T02:36Z", sign: "Libra", degree: 6, minute: 43 },
  { type: "retrograde_start", date: "2027-10-07", utc: "2027-10-07T14:36Z", planet: "Mercury", sign: "Scorpio", degree: 4, minute: 55 },
  { type: "full_moon", date: "2027-10-15", utc: "2027-10-15T13:46Z", sign: "Aries", degree: 21, minute: 58 },
  { type: "retrograde_end", date: "2027-10-17", utc: "2027-10-18T03:52Z", planet: "Pluto", sign: "Aquarius", degree: 4, minute: 44 },
  { type: "retrograde_end", date: "2027-10-28", utc: "2027-10-28T14:10Z", planet: "Mercury", sign: "Libra", degree: 19, minute: 18 },
  { type: "new_moon", date: "2027-10-29", utc: "2027-10-29T13:36Z", sign: "Scorpio", degree: 5, minute: 54 },
  { type: "full_moon", date: "2027-11-13", utc: "2027-11-14T03:25Z", sign: "Taurus", degree: 21, minute: 31 },
  { type: "new_moon", date: "2027-11-27", utc: "2027-11-28T03:24Z", sign: "Sagittarius", degree: 5, minute: 39 },
  { type: "full_moon", date: "2027-12-13", utc: "2027-12-13T16:08Z", sign: "Gemini", degree: 21, minute: 24 },
  { type: "retrograde_end", date: "2027-12-15", utc: "2027-12-15T09:06Z", planet: "Neptune", sign: "Aries", degree: 3, minute: 51 },
  { type: "retrograde_end", date: "2027-12-23", utc: "2027-12-24T02:46Z", planet: "Saturn", sign: "Aries", degree: 21, minute: 1 },
  { type: "new_moon", date: "2027-12-27", utc: "2027-12-27T20:12Z", sign: "Capricorn", degree: 5, minute: 50 },
];

/** Events from a YYYY-MM-DD date (inclusive, US Eastern) onward, soonest first. */
export function skyEventsFrom(date: string, limit?: number): SkyBankEvent[] {
  const upcoming = SKY_BANK.filter((e) => e.date >= date);
  return limit === undefined ? upcoming : upcoming.slice(0, limit);
}

/** Every event of the given types within a calendar year. */
export function skyEventsInYear(year: number, types?: LunationType[]): SkyBankEvent[] {
  const prefix = String(year);
  return SKY_BANK.filter((e) => e.date.startsWith(prefix) && (!types || types.includes(e.type)));
}

/** A retrograde as a single period, its start station paired with its end station. */
export interface RetrogradePeriod {
  planet: string;
  start: SkyBankEvent | null;
  end: SkyBankEvent | null;
}

/** Retrograde periods touching a year. One that began before the bank starts, or ends after it
 *  finishes, comes back with that half null rather than being dropped. */
export function retrogradePeriods(year?: number): RetrogradePeriod[] {
  const periods: RetrogradePeriod[] = [];
  const open = new Map<string, RetrogradePeriod>();
  for (const e of SKY_BANK) {
    if (!e.planet) continue;
    if (e.type === "retrograde_start") {
      const p: RetrogradePeriod = { planet: e.planet, start: e, end: null };
      open.set(e.planet, p);
      periods.push(p);
    } else if (e.type === "retrograde_end") {
      const p = open.get(e.planet);
      if (p) {
        p.end = e;
        open.delete(e.planet);
      } else {
        periods.push({ planet: e.planet, start: null, end: e });
      }
    }
  }
  if (year === undefined) return periods;
  const y = String(year);
  return periods.filter(
    (p) =>
      p.start?.date.startsWith(y) ||
      p.end?.date.startsWith(y) ||
      (!!p.start && !!p.end && p.start.date < y && p.end.date > y)
  );
}
