import swisseph from "swisseph";
import { DateTime } from "luxon";
import { calculateChart } from "@/lib/astrology";
import { ZODIAC_SIGNS, type BirthData, type ChartData } from "@/types/chart";
import { YEAR_HOUSE, YEAR_LORD, SR_RISING, SR_MOON, JUPITER_HOUSE, SATURN_HOUSE, TRADITIONAL_RULER, type YearHouse } from "@/lib/birthday-content";

// The birthday reading: her year from one birthday to the next. Server only (Swiss Ephemeris).
//
//   year house + year lord   annual profection: house = (age mod 12) + 1, counted in whole signs from
//                            her rising sign; the lord is the traditional ruler of that sign
//   solar return             the chart for the exact moment the Sun returns to its natal degree,
//                            cast for her birthplace: its Ascendant and Moon sign
//   Jupiter + Saturn         where the two big social planets sit in her NATAL houses at the return
//
// No reliable birth time means no reliable rising sign or houses, so for those charts everything
// house-based is counted from her Sun sign instead (solar houses) and the page says so.

export interface BirthdayReading {
  age: number;
  /** YYYY-MM-DD of the birthday that opened this year, and of the next one. */
  yearStart: string;
  yearEnd: string;
  solarReturnUtc: string;
  usesSunHouses: boolean;
  year: { house: number; sign: string } & YearHouse;
  lord: { planet: string; natalHouse: number; title: string; body: string };
  rising: { sign: string; body: string } | null;
  moon: { sign: string; body: string };
  jupiter: { sign: string; house: number; body: string };
  saturn: { sign: string; house: number; body: string };
}

const signOf = (lng: number) => ZODIAC_SIGNS[Math.floor((((lng % 360) + 360) % 360) / 30)];
const norm180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

function sunAt(jd: number): number {
  const r = swisseph.swe_calc_ut(jd, swisseph.SE_SUN, swisseph.SEFLG_SWIEPH) as { longitude: number };
  return r.longitude;
}

/** Julian day of the moment the Sun is back at `natalSun`, searching around `approxJd`. */
function solarReturnJd(natalSun: number, approxJd: number): number {
  let jd = approxJd;
  for (let i = 0; i < 12; i++) {
    const diff = norm180(natalSun - sunAt(jd));
    jd += diff / 0.9856; // the Sun's mean daily motion
    if (Math.abs(diff) < 1e-6) break;
  }
  return jd;
}

/** Placidus house of a longitude against a chart's cusps (same rule the chart engine uses). */
function houseOf(lng: number, chart: ChartData): number {
  const cusps = chart.houses.map((h) => h.longitude);
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    const span = (end - start + 360) % 360;
    if ((lng - start + 360) % 360 < span) return i + 1;
  }
  return 1;
}

/** Whole-sign house counted from a sign (used for solar houses). */
const wholeSignHouse = (lng: number, fromSign: string) => ((ZODIAC_SIGNS.indexOf(signOf(lng) as (typeof ZODIAC_SIGNS)[number]) - ZODIAC_SIGNS.indexOf(fromSign as (typeof ZODIAC_SIGNS)[number]) + 12) % 12) + 1;

/** The birthday that opened her current year, in UK dates. 29 February counts as 28 February in other years. */
export function currentBirthdayYear(dateOfBirth: string, now: Date = new Date()): { start: string; end: string; age: number } {
  const [by, bm, bd] = dateOfBirth.split("-").map(Number);
  const today = DateTime.fromJSDate(now).setZone("Europe/London").startOf("day");
  const birthdayIn = (y: number) => {
    const leap = DateTime.fromObject({ year: y, month: 2, day: 29 }).isValid;
    return DateTime.fromObject({ year: y, month: bm, day: bm === 2 && bd === 29 && !leap ? 28 : bd }, { zone: "Europe/London" });
  };
  let start = birthdayIn(today.year);
  if (start > today) start = birthdayIn(today.year - 1);
  const end = birthdayIn(start.year + 1);
  return { start: start.toISODate()!, end: end.toISODate()!, age: start.year - by };
}

/** True when today (UK) is her birthday. */
export function isBirthdayToday(dateOfBirth: string, now: Date = new Date()): boolean {
  return currentBirthdayYear(dateOfBirth, now).start === DateTime.fromJSDate(now).setZone("Europe/London").toISODate();
}

export function birthdayReading(birthData: BirthData, now: Date = new Date()): BirthdayReading {
  const natal = calculateChart(birthData);
  const { start, end, age } = currentBirthdayYear(birthData.dateOfBirth, now);
  const natalSun = natal.planets.find((p) => p.id === "sun")!.longitude;

  const [y, m, d] = start.split("-").map(Number);
  const approx = swisseph.swe_julday(y, m, d, 12, swisseph.SE_GREG_CAL) as unknown as number;
  const jd = solarReturnJd(natalSun, approx);
  const rev = swisseph.swe_revjul(jd, swisseph.SE_GREG_CAL) as { year: number; month: number; day: number; hour: number };
  const utc = DateTime.fromObject({ year: rev.year, month: rev.month, day: rev.day }, { zone: "utc" }).plus({ milliseconds: Math.round(rev.hour * 3600000) });
  const local = utc.setZone(birthData.location.timezone);

  const sr = calculateChart({
    ...birthData,
    dateOfBirth: local.toISODate()!,
    birthTime: local.toFormat("HH:mm"),
    birthTimeApproximate: false,
  });

  const usesSunHouses = !!birthData.birthTimeApproximate || !!natal.approximate;
  const fromSign = usesSunHouses ? signOf(natalSun) : signOf(natal.ascendant);
  const natalHouse = (lng: number) => (usesSunHouses ? wholeSignHouse(lng, fromSign) : houseOf(lng, natal));

  // Profection: whole signs from the rising (or Sun) sign.
  const yearHouse = (age % 12) + 1;
  const yearSign = ZODIAC_SIGNS[(ZODIAC_SIGNS.indexOf(fromSign as (typeof ZODIAC_SIGNS)[number]) + age) % 12];
  const lordPlanet = TRADITIONAL_RULER[yearSign];
  const lordNatal = natal.planets.find((p) => p.name === lordPlanet)!;

  const srMoon = sr.planets.find((p) => p.id === "moon")!;
  const srJupiter = sr.planets.find((p) => p.id === "jupiter")!;
  const srSaturn = sr.planets.find((p) => p.id === "saturn")!;
  const jupHouse = natalHouse(srJupiter.longitude);
  const satHouse = natalHouse(srSaturn.longitude);
  const risingSign = signOf(sr.ascendant);

  return {
    age,
    yearStart: start,
    yearEnd: end,
    solarReturnUtc: utc.toISO()!,
    usesSunHouses,
    year: { house: yearHouse, sign: yearSign, ...YEAR_HOUSE[yearHouse] },
    lord: { planet: lordPlanet, natalHouse: natalHouse(lordNatal.longitude), ...YEAR_LORD[lordPlanet] },
    // The return's rising sign depends on the exact minute, so without a birth time it is left out.
    rising: usesSunHouses ? null : { sign: risingSign, body: SR_RISING[risingSign] },
    moon: { sign: srMoon.sign, body: SR_MOON[srMoon.sign] },
    jupiter: { sign: srJupiter.sign, house: jupHouse, body: JUPITER_HOUSE[jupHouse] },
    saturn: { sign: srSaturn.sign, house: satHouse, body: SATURN_HOUSE[satHouse] },
  };
}

/** Maps a birth_data row to BirthData. */
export function birthRowToData(row: Record<string, unknown>): BirthData {
  const time = String(row.birth_time ?? "12:00");
  const match = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  return {
    name: String(row.name ?? ""),
    dateOfBirth: String(row.date_of_birth),
    birthTime: match ? `${match[1].padStart(2, "0")}:${match[2]}` : "12:00",
    birthTimeApproximate: !!row.birth_time_approximate,
    location: {
      placeName: String(row.place_name ?? ""),
      city: String(row.city ?? ""),
      country: String(row.country ?? ""),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      timezone: String(row.timezone),
    },
  };
}
