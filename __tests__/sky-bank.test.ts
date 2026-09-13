import path from "path";
import swisseph from "swisseph";
import { SKY_BANK, skyEventsFrom, skyEventsInYear, retrogradePeriods } from "@/lib/sky-bank";

// The sky bank is meant to be computed, not typed. These re-derive every row from the same Swiss
// Ephemeris the app uses, so a hand edit that drifts from the real sky, a typo'd degree, a doubled
// eclipse or a missing station fails here instead of on a member's calendar.

swisseph.swe_set_ephe_path(path.join(process.cwd(), "ephe"));
const FLAGS = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;
const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const BODY: Record<string, number> = {
  Mercury: swisseph.SE_MERCURY,
  Venus: swisseph.SE_VENUS,
  Mars: swisseph.SE_MARS,
  Jupiter: swisseph.SE_JUPITER,
  Saturn: swisseph.SE_SATURN,
  Uranus: swisseph.SE_URANUS,
  Neptune: swisseph.SE_NEPTUNE,
  Pluto: swisseph.SE_PLUTO,
  Chiron: swisseph.SE_CHIRON,
  "North Node": swisseph.SE_TRUE_NODE,
};

const calc = (jd: number, id: number) =>
  swisseph.swe_calc_ut(jd, id, FLAGS) as unknown as { longitude: number; longitudeSpeed: number };
const jdOf = (utc: string) => Date.parse(utc) / 86_400_000 + 2440587.5;
const abs = (sign: string, degree: number, minute: number) => SIGNS.indexOf(sign) * 30 + degree + minute / 60;
const gap = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const phase = (jd: number) =>
  (calc(jd, swisseph.SE_MOON).longitude - calc(jd, swisseph.SE_SUN).longitude + 360) % 360;
const etDay = (utc: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(utc));

describe("sky bank", () => {
  it("is in time order, one row per event", () => {
    for (let i = 1; i < SKY_BANK.length; i++) {
      expect(SKY_BANK[i].utc >= SKY_BANK[i - 1].utc).toBe(true);
    }
    const lunations = SKY_BANK.filter((e) => !e.planet);
    for (let i = 1; i < lunations.length; i++) {
      // Consecutive lunations sit about 15 days apart. Two inside a day means an eclipse was entered
      // as well as its own new or full moon, which is the one mistake a pasted table invites.
      const days = (Date.parse(lunations[i].utc) - Date.parse(lunations[i - 1].utc)) / 86_400_000;
      expect(days).toBeGreaterThan(12);
    }
  });

  it("dates every event on its US Eastern calendar day", () => {
    for (const e of SKY_BANK) expect(e.date).toBe(etDay(e.utc));
  });

  it("puts every lunation at the real moment and degree", () => {
    for (const e of SKY_BANK.filter((x) => !x.planet)) {
      const jd = jdOf(e.utc);
      const target = e.type === "new_moon" || e.type === "solar_eclipse" ? 0 : 180;
      // Within 2 minutes of exact: the moon moves about a degree of phase every 2 hours.
      expect(gap(phase(jd), target)).toBeLessThan(0.02);
      expect(gap(calc(jd, swisseph.SE_MOON).longitude, abs(e.sign, e.degree, e.minute))).toBeLessThan(0.05);
    }
  });

  it("puts every station where the planet actually turns", () => {
    for (const e of SKY_BANK.filter((x) => x.type === "retrograde_start" || x.type === "retrograde_end")) {
      const id = BODY[e.planet!];
      const jd = jdOf(e.utc);
      const before = calc(jd - 0.5, id).longitudeSpeed;
      const after = calc(jd + 0.5, id).longitudeSpeed;
      if (e.type === "retrograde_start") {
        expect(before).toBeGreaterThan(0);
        expect(after).toBeLessThan(0);
      } else {
        expect(before).toBeLessThan(0);
        expect(after).toBeGreaterThan(0);
      }
      expect(gap(calc(jd, id).longitude, abs(e.sign, e.degree, e.minute))).toBeLessThan(0.05);
    }
  });

  it("matches the Astro-Seek 2027 lunation table", () => {
    // Betty's source table, UT. Eclipse rows collapse onto their lunation.
    const expected: [string, string, string, number, number][] = [
      ["2027-01-07T20:24Z", "new_moon", "Capricorn", 17, 18],
      ["2027-01-22T12:17Z", "full_moon", "Leo", 2, 14],
      ["2027-02-06T15:56Z", "solar_eclipse", "Aquarius", 17, 37],
      ["2027-02-20T23:23Z", "lunar_eclipse", "Virgo", 2, 5],
      ["2027-03-08T09:29Z", "new_moon", "Pisces", 17, 34],
      ["2027-07-18T15:44Z", "lunar_eclipse", "Capricorn", 25, 48],
      ["2027-08-02T10:05Z", "solar_eclipse", "Leo", 9, 55],
      ["2027-08-17T07:28Z", "lunar_eclipse", "Aquarius", 24, 11],
      ["2027-08-31T17:41Z", "new_moon", "Virgo", 8, 6],
      ["2027-12-13T16:08Z", "full_moon", "Gemini", 21, 24],
    ];
    for (const [utc, type, sign, degree, minute] of expected) {
      const hit = SKY_BANK.find((e) => !e.planet && Math.abs(Date.parse(e.utc) - Date.parse(utc)) <= 2 * 60_000);
      expect(hit).toBeDefined();
      expect(hit).toMatchObject({ type, sign });
      expect(Math.abs(abs(hit!.sign, hit!.degree, hit!.minute) - abs(sign, degree, minute))).toBeLessThanOrEqual(2 / 60);
    }
    // The last row of the pasted table was cut off before its degree. The ephemeris fills it in.
    expect(SKY_BANK.find((e) => e.utc.startsWith("2027-12-27"))).toMatchObject({ type: "new_moon", sign: "Capricorn", degree: 5 });
  });

  it("matches the Astro-Seek 2026 retrograde table", () => {
    const expected: [string, "retrograde_start" | "retrograde_end", string, string][] = [
      ["2026-02-26", "retrograde_start", "Mercury", "Pisces"],
      ["2026-03-20", "retrograde_end", "Mercury", "Pisces"],
      ["2026-06-29", "retrograde_start", "Mercury", "Cancer"],
      ["2026-07-23", "retrograde_end", "Mercury", "Cancer"],
      ["2026-10-24", "retrograde_start", "Mercury", "Scorpio"],
      ["2026-11-13", "retrograde_end", "Mercury", "Scorpio"],
      ["2026-10-03", "retrograde_start", "Venus", "Scorpio"],
      ["2026-11-14", "retrograde_end", "Venus", "Libra"],
      ["2026-12-13", "retrograde_start", "Jupiter", "Leo"],
      ["2026-07-26", "retrograde_start", "Saturn", "Aries"],
      ["2026-12-10", "retrograde_end", "Saturn", "Aries"],
      ["2026-09-10", "retrograde_start", "Uranus", "Gemini"],
      ["2026-07-07", "retrograde_start", "Neptune", "Aries"],
      ["2026-12-12", "retrograde_end", "Neptune", "Aries"],
      ["2026-05-06", "retrograde_start", "Pluto", "Aquarius"],
      ["2026-10-16", "retrograde_end", "Pluto", "Aquarius"],
      ["2026-08-03", "retrograde_start", "Chiron", "Taurus"],
    ];
    for (const [utcDay, type, planet, sign] of expected) {
      const hit = SKY_BANK.find((e) => e.planet === planet && e.type === type && e.utc.startsWith(utcDay));
      expect(hit).toMatchObject({ sign });
    }
    // No Mars retrograde in 2026, as Astro-Seek says.
    expect(skyEventsInYear(2026, ["retrograde_start"]).some((e) => e.planet === "Mars")).toBe(false);
  });

  it("pairs retrogrades into periods, keeping ones that straddle the bank's edges", () => {
    const mercury2026 = retrogradePeriods(2026).filter((p) => p.planet === "Mercury");
    expect(mercury2026).toHaveLength(3);
    expect(mercury2026.every((p) => p.start && p.end)).toBe(true);
    // Jupiter turned direct in March 2026 from a retrograde that began in 2025, before the bank.
    // 03:29 UT on the 11th is still the evening of the 10th in US Eastern, hence the two dates.
    expect(
      retrogradePeriods(2026).some(
        (p) => p.planet === "Jupiter" && p.start === null && p.end?.utc.startsWith("2026-03-11") && p.end.date === "2026-03-10"
      )
    ).toBe(true);
  });

  it("finds what's coming from a given day", () => {
    const next = skyEventsFrom("2026-09-13", 3);
    expect(next).toHaveLength(3);
    expect(next.every((e) => e.date >= "2026-09-13")).toBe(true);
  });
});
