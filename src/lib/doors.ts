// The doors: when new members can join MY SZN.
//
// MY SZN runs in three-month chapters that follow the zodiac, and new members join together in
// short intakes ("doors") at the start of a season rather than any day of the year. Each door is
// open for a few days and closes at a real sky moment (a new moon or the Sun changing sign), so the
// deadline is a date in the sky rather than "a few weeks". Everyone who joins through a door commits
// to the three seasons that start with it, while everyone inside lives the same current season
// together in one shared room.
//
// Pure data and pure functions, so the sales page, the countdown and the tests all read the same
// schedule. Add the next chapter's doors here before the last one below closes, or the site will
// sit on "doors closed" with no date to offer.
//
// Times are UTC instants. Sky moments match src/lib/sky-bank.ts and the blog guides' goLiveAt
// (Swiss Ephemeris), opening times are 9am New York.

export { sznTheme, SZN_THEMES, type SznTheme } from "@/lib/szn-themes";

export interface Chapter {
  id: string;
  title: string;
  /** The campaign line that sits with the title. */
  campaign: string;
  /** The question the chapter answers. */
  destination: string;
  /** The arc in one line. */
  arc: string;
  /** The three seasons of the chapter, in order. */
  szns: [string, string, string];
  /** When the chapter ends, as a UTC instant (the next cardinal ingress). */
  endsAt: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "q4-2026",
    title: "Become Her Before 2027",
    campaign: "Don't wait until January.",
    destination: "Who are you becoming before 2027?",
    arc: "Love yourself → heal the shadow + claim your power → go after your biggest life",
    szns: ["Libra", "Scorpio", "Sagittarius"],
    endsAt: "2026-12-21T20:50:00Z", // Sun into Capricorn, the solstice
  },
];

/** The chapter running at `nowMs`, or null once the last designed chapter has ended. */
export function currentChapter(nowMs: number): Chapter | null {
  return CHAPTERS.find((c) => nowMs < Date.parse(c.endsAt)) ?? null;
}

export interface Door {
  id: string;
  /** How the intake is named on the page. */
  name: string;
  opensAt: string;
  closesAt: string;
  /** The sky moment the door closes on, written to sit after "doors close at". */
  closesAtMoment: string;
  /** The three seasons this intake commits to, starting with the one they join in. */
  szns: [string, string, string];
}

export const DOORS: Door[] = [
  {
    id: "founding-2026",
    name: "the founding intake",
    opensAt: "2026-10-07T13:00:00Z", // Wed 7 Oct, 9am New York
    closesAt: "2026-10-10T15:50:00Z", // the Libra new moon, 17°21' Libra
    closesAtMoment: "the Libra new moon",
    szns: ["Libra", "Scorpio", "Sagittarius"],
  },
  {
    id: "scorpio-2026",
    name: "the Scorpio intake",
    opensAt: "2026-10-21T13:00:00Z", // Wed 21 Oct, 9am New York
    closesAt: "2026-10-23T09:37:00Z", // Sun into Scorpio
    closesAtMoment: "the start of Scorpio season",
    szns: ["Scorpio", "Sagittarius", "Capricorn"],
  },
  {
    id: "sagittarius-2026",
    name: "the Sagittarius intake",
    opensAt: "2026-11-20T14:00:00Z", // Fri 20 Nov, 9am New York
    closesAt: "2026-11-22T07:23:00Z", // Sun into Sagittarius
    closesAtMoment: "the start of Sagittarius season",
    szns: ["Sagittarius", "Capricorn", "Aquarius"],
  },
  {
    id: "capricorn-2026",
    name: "the Capricorn intake",
    opensAt: "2026-12-19T14:00:00Z", // Sat 19 Dec, 9am New York
    closesAt: "2026-12-21T20:50:00Z", // Sun into Capricorn, the solstice
    closesAtMoment: "the solstice",
    szns: ["Capricorn", "Aquarius", "Pisces"],
  },
];

export interface DoorState {
  /** The door that is open right now, if any. */
  open: Door | null;
  /** The next door to open after now, if one is scheduled. */
  next: Door | null;
}

export function doorState(nowMs: number, doors: Door[] = DOORS): DoorState {
  const open = doors.find((d) => Date.parse(d.opensAt) <= nowMs && nowMs < Date.parse(d.closesAt)) ?? null;
  const next = doors.find((d) => Date.parse(d.opensAt) > nowMs) ?? null;
  return { open, next };
}

/**
 * A manual override on top of the schedule, read from NEXT_PUBLIC_ENROLMENT_OPEN: only "false" can
 * hold the doors shut. "true" is ignored on purpose: it is the old always-open launch value, still
 * set in Railway, and honouring it held the doors open over the schedule.
 */
export function applyOverride(state: DoorState, flag: string | undefined): DoorState {
  if (flag?.trim() === "false") return { open: null, next: state.next };
  return state;
}

const LA = "America/Los_Angeles";
const NY = "America/New_York";

function part(d: Date, zone: string, opts: Intl.DateTimeFormatOptions): string {
  return d.toLocaleString("en-GB", { timeZone: zone, ...opts }).toLowerCase();
}

/** "wednesday 7 october" in LA time. */
export function doorDay(iso: string): string {
  const d = new Date(iso);
  return part(d, LA, { weekday: "long", day: "numeric", month: "long" });
}

/** "6am la · 9am new york" for an instant. */
export function doorTime(iso: string): string {
  const d = new Date(iso);
  const t = (zone: string) =>
    d
      .toLocaleString("en-US", { timeZone: zone, hour: "numeric", minute: "2-digit" })
      .replace(":00", "")
      .replace(" ", "")
      .toLowerCase();
  return `${t(LA)} la · ${t(NY)} new york`;
}

/** How many days a door is open for, rounded: 2 for a normal door, 3 for the founding door (which
 *  holds the Thursday kickoff live inside it). */
export function doorDays(door: Door): number {
  return Math.max(1, Math.round((Date.parse(door.closesAt) - Date.parse(door.opensAt)) / 86_400_000));
}

/** "Libra, Scorpio and Sagittarius". */
export function sznList(door: Door): string {
  const [a, b, c] = door.szns;
  return `${a}, ${b} and ${c}`;
}
