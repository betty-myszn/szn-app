// The Quantum Leap Experiment: thirty days, one page each, for Sagittarius SZN 2026 inside the Bad
// B*tch Coven. This file is safe for the browser: dates, types and helpers only. The thirty days
// themselves live in quantum-leap-content.ts and are only ever sent by /api/quantum-leap, after the
// Sun enters Sagittarius (or to an admin), so nothing leaks into the site's code before then.
// Betty's day titles and moves (17 Nov 2026, Days 13 and 17 swapped on her OK so the
// Prosperity Ritual sits on the New Moon) are kept word for word; everything else on a day page is
// written around them. The framework lives at QUANTUM-LEAP-FRAMEWORK.md.
//
// Nothing shows until the Sun enters Sagittarius, the same instant the Sagittarius blog guide goes
// live (blog.ts goLiveAt). Admins see everything early so Betty can preview. Sky times match
// manifestation-calendar.ts and were checked against swisseph.

export const QL_LIVE_AT = Date.parse("2026-11-22T07:23:00Z");
// The promos (Coven home card, season page section) step aside once the new year starts; the day
// pages themselves stay open so she can go back through her thirty days.
export const QL_PROMO_UNTIL = Date.parse("2027-01-01T00:00:00Z");
export const QL_START = "2026-11-22";
export const QL_DAYS = 30;
export const QL_PATH = "/your-season/sagittarius";
const PROGRESS_KEY = "myszn-quantum-leap";

export const qlIsLive = (now: number, isAdmin = false) => isAdmin || now >= QL_LIVE_AT;
export const qlPromoShowing = (now: number, isAdmin = false) => qlIsLive(now, isAdmin) && now < QL_PROMO_UNTIL;
export const dayHref = (n: number) => `${QL_PATH}/day-${n}`;
// The thirty days during which Betty's daily chat post can be due (the chat room asks for it then).
export const leapPostWindow = (now: number) => now >= QL_LIVE_AT && todayNumber(now) <= QL_DAYS;

export type SkyMoment = { emoji: string; name: string; time: string; line: string };
export type Personal = "jupiter-natal" | "new-moon" | "jupiter-transit";

export interface LeapDay {
  n: number;
  title: string;
  move: string;
  emoji: string;
  sky?: SkyMoment;
  personal?: Personal;
  why: string;
  take: string;
  steps: [string, string, string];
  prompt: string;
  link?: [string, string];
}

export interface LeapWeek {
  n: number;
  name: string;
  line: string;
  days: [number, number];
}

// What /api/quantum-leap hands back: one day (with its week, and the Jupiter-by-sign lines on Day 8)
// or the whole thirty as a light list for the season page.
export interface LeapDayPayload { day: LeapDay; week: LeapWeek; jupiterSign?: Record<string, string> }
export interface LeapAllPayload { weeks: LeapWeek[]; days: Pick<LeapDay, "n" | "title" | "move" | "emoji">[] }

// Longitudes for the personal reads: the Sagittarius New Moon (16° Sagittarius) and Jupiter's
// retrograde station (27° Leo), both from swisseph.
export const NEW_MOON_LON = 256;
export const JUPITER_STATION_LON = 147;

// --- dates, always UK time, written out British style ---

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ordinal = (d: number) => `${d}${d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th"}`;

function dayUtc(n: number): Date {
  const [y, m, d] = QL_START.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n - 1));
}

/** "Thursday the 26th of November" */
export function dayDateLong(n: number): string {
  const dt = dayUtc(n);
  return `${WEEKDAYS[dt.getUTCDay()]} the ${ordinal(dt.getUTCDate())} of ${MONTHS[dt.getUTCMonth()]}`;
}

/** "thu 26 nov" */
export function dayDateShort(n: number): string {
  const dt = dayUtc(n);
  return `${WEEKDAYS[dt.getUTCDay()].slice(0, 3)} ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()].slice(0, 3)}`.toLowerCase();
}

/** Which day it is in the UK right now: 0 before it starts, 31 once it's over. */
export function todayNumber(now: number): number {
  const uk = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now));
  const [y, m, d] = uk.split("-").map(Number);
  const [sy, sm, sd] = QL_START.split("-").map(Number);
  const diff = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(sy, sm - 1, sd)) / 86_400_000) + 1;
  return Math.max(0, Math.min(QL_DAYS + 1, diff));
}

// --- which days she's written up, so the thirty-day grid can tick them off ---

export function loadDone(): number[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed?.done) ? parsed.done.filter((n: unknown) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export function markDone(n: number): number[] {
  const done = Array.from(new Set([...loadDone(), n])).sort((a, b) => a - b);
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ done }));
  } catch {
    // private window: the journal entry still saves
  }
  return done;
}
