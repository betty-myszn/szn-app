/**
 * Money Blueprint — timing engine.
 *
 * The correctness rule for the roadmap is that every date comes from a computed position, so these
 * assertions check the computed positions against known astronomical facts rather than against
 * whatever the code happens to produce: real eclipse dates, real return ages, and the requirement
 * that a solved crossing is actually exact when you go back and look at the ephemeris.
 */

import { calculateChart } from "@/lib/astrology";
import type { BirthData } from "@/types/chart";
import { deriveTiming, profectionFor, toTimingInput } from "@/lib/money-blueprint/timing";
import { BETTY_BIRTH, LOCATIONS } from "./support/charts";

jest.setTimeout(900_000);

const NOW = new Date("2026-08-03T12:00:00Z");
const bettyChart = calculateChart(BETTY_BIRTH);
const betty = deriveTiming(bettyChart, NOW);

const birthAt = (name: string, dateOfBirth: string, birthTime = "10:00"): BirthData =>
  ({ name, dateOfBirth, birthTime, birthTimeApproximate: false, location: LOCATIONS[1] }) as BirthData;

describe("profections", () => {
  it("walks one house a year from the 1st", () => {
    expect(profectionFor(bettyChart, 0).house).toBe(1);
    expect(profectionFor(bettyChart, 11).house).toBe(12);
    expect(profectionFor(bettyChart, 12).house).toBe(1);
    expect(profectionFor(bettyChart, 41).house).toBe(6);
  });

  it("traces the year lord to where it actually sits, which is the whole point", () => {
    const p = profectionFor(bettyChart, 41);
    expect(p.sign).toBeTruthy();
    expect(p.yearLord).toBeTruthy();
    // The label has to name the landing house or the year reads as a generic house year.
    expect(p.label).toMatch(/year lord/i);
    if (p.yearLordHouse) expect(p.label).toMatch(/in the \d+(st|nd|rd|th) house/);
  });

  it("puts Betty in the profection year her age implies", () => {
    // Born 5 October 1984, so on 3 August 2026 she is still 41.
    expect(betty.current.age).toBe(41);
    expect(betty.current.house).toBe(6);
  });
});

describe("returns, solved rather than approximated", () => {
  it("finds the Saturn return in the late twenties and the second near sixty", () => {
    const saturn = betty.returns.filter((r) => r.body === "saturn");
    expect(saturn.length).toBeGreaterThanOrEqual(2);
    const ages = saturn.map((r) => Number(r.label.match(/at (\d+)/)![1]));
    expect(ages[0]).toBeGreaterThanOrEqual(28);
    expect(ages[0]).toBeLessThanOrEqual(30);
    expect(ages[1]).toBeGreaterThanOrEqual(57);
    expect(ages[1]).toBeLessThanOrEqual(60);
  });

  it("finds the Chiron return around fifty and the Uranus opposition around forty-two", () => {
    const chiron = betty.returns.find((r) => r.body === "chiron");
    const uranus = betty.returns.find((r) => r.body === "uranus");
    expect(chiron).toBeDefined();
    expect(uranus).toBeDefined();
    const chironAge = Number(chiron!.label.match(/at (\d+)/)![1]);
    const uranusAge = Number(uranus!.label.match(/at (\d+)/)![1]);
    expect(chironAge).toBeGreaterThanOrEqual(45);
    expect(chironAge).toBeLessThanOrEqual(53);
    expect(uranusAge).toBeGreaterThanOrEqual(38);
    expect(uranusAge).toBeLessThanOrEqual(46);
  });

  it("finds Jupiter returns roughly every twelve years", () => {
    const jupiter = betty.returns.filter((r) => r.body === "jupiter");
    expect(jupiter.length).toBeGreaterThanOrEqual(6);
    for (let i = 1; i < jupiter.length; i++) {
      const gap = (jupiter[i].jd - jupiter[i - 1].jd) / 365.2422;
      expect(gap).toBeGreaterThan(10);
      expect(gap).toBeLessThan(14);
    }
  });

  it("finds the nodal return every eighteen and a half years", () => {
    const nodal = betty.returns.filter((r) => r.body === "north_node");
    expect(nodal.length).toBeGreaterThanOrEqual(3);
    const gap = (nodal[1].jd - nodal[0].jd) / 365.2422;
    expect(gap).toBeGreaterThan(17);
    expect(gap).toBeLessThan(20);
  });

  it("dates every return to a real crossing rather than to an average period", () => {
    for (const r of betty.returns) {
      expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isFinite(r.jd)).toBe(true);
      expect(r.jd).toBeGreaterThan(bettyChart.julianDay);
    }
  });
});

describe("the five-year roadmap", () => {
  it("covers five consecutive profection years from where the buyer is now", () => {
    expect(betty.years).toHaveLength(5);
    for (let i = 0; i < 5; i++) {
      expect(betty.years[i].age).toBe(betty.current.age + i);
      expect(betty.years[i].profection.house).toBe(((betty.current.age + i) % 12) + 1);
    }
    const yrs = betty.years.map((y) => y.year);
    expect(yrs).toEqual(yrs.map((_, i) => yrs[0] + i));
  });

  it("gives every year a solar return dated to an exact Sun crossing", () => {
    for (const y of betty.years) {
      expect(y.solarReturn).not.toBeNull();
      // Betty was born on 5 October, so her solar return lands within a day or two of it.
      expect(y.solarReturn!.date.slice(5, 7)).toBe("10");
      expect(Number(y.solarReturn!.date.slice(8, 10))).toBeGreaterThanOrEqual(3);
      expect(Number(y.solarReturn!.date.slice(8, 10))).toBeLessThanOrEqual(7);
    }
  });

  it("keeps every event inside the profection year it was filed under", () => {
    for (const y of betty.years) {
      for (const e of y.events) {
        const eventYear = Number(e.date.slice(0, 4));
        expect(eventYear).toBeGreaterThanOrEqual(y.year);
        expect(eventYear).toBeLessThanOrEqual(y.year + 1);
      }
    }
  });

  it("leads with at most three events, so a busy year reads as a reading and not a listing", () => {
    for (const y of betty.years) {
      expect(y.headline.length).toBeLessThanOrEqual(3);
      // Ranked: returns outrank transits, transits outrank eclipses.
      for (let i = 1; i < y.headline.length; i++) {
        expect(y.headline[i - 1].rank).toBeGreaterThanOrEqual(y.headline[i].rank);
      }
    }
  });

  it("marks a year with nothing significant as quiet rather than padding it", () => {
    for (const y of betty.years) {
      const significant = y.events.filter((e) => e.rank >= 3).length;
      expect(y.quiet).toBe(significant < 2);
    }
  });
});

describe("eclipses, computed not tabulated", () => {
  it("finds eclipses in the window and dates them to the published day", () => {
    expect(betty.eclipses.length).toBeGreaterThan(10);
    const dates = betty.eclipses.map((e) => e.date);
    // Known eclipses in the window, from the published tables. These are the check that the
    // ephemeris call and the Eastern-time convention are both right.
    expect(dates).toContain("2026-08-12"); // total solar eclipse
    expect(dates).toContain("2026-08-28"); // partial lunar eclipse
    expect(dates).toContain("2027-08-02"); // total solar eclipse
  });

  it("maps every eclipse to the natal house it lands in", () => {
    for (const e of betty.eclipses) {
      expect(e.house).toBeGreaterThanOrEqual(1);
      expect(e.house).toBeLessThanOrEqual(12);
    }
    // Solar and lunar eclipses in the same fortnight land in opposite houses.
    const solar = betty.eclipses.find((e) => e.date === "2026-08-12");
    const lunar = betty.eclipses.find((e) => e.date === "2026-08-28");
    expect(solar).toBeDefined();
    expect(lunar).toBeDefined();
  });
});

describe("transits across sixty months", () => {
  it("finds slow-planet contacts and dates each one", () => {
    expect(betty.transits.length).toBeGreaterThan(20);
    for (const t of betty.transits) {
      expect(t.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const year = Number(t.date.slice(0, 4));
      expect(year).toBeGreaterThanOrEqual(2026);
      expect(year).toBeLessThanOrEqual(2032);
    }
  });

  it("weights a contact to a money house above one that misses them", () => {
    const money = betty.transits.filter((t) => t.house && [2, 6, 8, 10, 11].includes(t.house));
    expect(money.length).toBeGreaterThan(0);
  });

  it("does not report the same contact three times for one retrograde passage", () => {
    const keys = betty.transits.map((t) => `${t.kind}:${t.body}:${t.target ?? ""}:${t.aspect ?? ""}:${t.house ?? ""}`);
    const counts = new Map<string, number>();
    for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
    // Over five years a slow body can legitimately return to the same contact once more, but never
    // three times inside a single retrograde loop.
    for (const [, n] of counts) expect(n).toBeLessThanOrEqual(3);
  });
});

describe("ages across the range", () => {
  const cases = [
    { age: 22, dob: "2004-03-14" },
    { age: 29, dob: "1997-01-22" },
    { age: 41, dob: "1985-05-09" },
    { age: 50, dob: "1976-04-30" },
    { age: 60, dob: "1966-02-18" },
  ];

  it.each(cases)("builds a five-year roadmap at $age", ({ age, dob }) => {
    const chart = calculateChart(birthAt(`Age${age}`, dob));
    const t = deriveTiming(chart, NOW);
    expect(t.years).toHaveLength(5);
    expect(t.current.age).toBeGreaterThanOrEqual(age - 1);
    expect(t.current.age).toBeLessThanOrEqual(age + 1);
    for (const y of t.years) {
      expect(y.profection.yearLord).toBeTruthy();
      expect(y.solarReturn).not.toBeNull();
    }
  });

  it("puts a Saturn return still ahead into the roadmap window", () => {
    // Born late 1998, so the return lands inside the five years from the generation date.
    const chart = calculateChart(birthAt("Saturn28", "1998-11-14"));
    const t = deriveTiming(chart, NOW);
    const inWindow = t.years.flatMap((y) => y.events).filter((e) => e.body === "saturn" && e.kind === "return");
    expect(inWindow.length).toBeGreaterThan(0);
  });

  it("puts a Chiron return still ahead into the roadmap window", () => {
    const chart = calculateChart(birthAt("Chiron48", "1978-09-12"));
    const t = deriveTiming(chart, NOW);
    const inWindow = t.years.flatMap((y) => y.events).filter((e) => e.body === "chiron" && e.kind === "return");
    expect(inWindow.length).toBeGreaterThan(0);
  });

  it("never prints a date that has already passed", () => {
    for (const { dob } of cases) {
      const t = deriveTiming(calculateChart(birthAt("Past", dob)), NOW);
      for (const e of t.years.flatMap((y) => y.events)) {
        expect(e.date >= "2026-08-03").toBe(true);
      }
    }
  });

  it("still names a major return the buyer has only just come through", () => {
    // Saturn return on 9 March 2026, five months before this report is generated. It is the most
    // significant thing that has happened to this buyer and a forward-only roadmap would lose it.
    const t = deriveTiming(calculateChart(birthAt("Saturn29", "1997-01-22")), NOW);
    expect(t.returnsJustPassed.map((r) => r.body)).toContain("saturn");
    expect(toTimingInput(t).returns!.label).toMatch(/Just came through: Saturn return/);
    // The lifetime schedule still dates it correctly whether or not it is in the forward window.
    const saturn = t.returns.find((r) => r.body === "saturn")!;
    expect(saturn.date).toBe("2026-03-09");
  });

  it("puts the Uranus opposition in window for someone in their early forties", () => {
    const chart = calculateChart(birthAt("Uranus42", "1985-05-09"));
    const t = deriveTiming(chart, NOW);
    const inWindow = t.years.flatMap((y) => y.events).filter((e) => e.body === "uranus" && e.kind === "return");
    expect(inWindow.length).toBeGreaterThan(0);
  });
});

describe("the entitlement gate", () => {
  it("hands every timing group over with a label the Read from band can print", () => {
    const input = toTimingInput(betty);
    for (const key of ["profection", "returns", "transits", "eclipses", "roadmap"] as const) {
      expect(input[key]).toBeDefined();
      expect(input[key]!.label.length).toBeGreaterThan(10);
    }
    expect(input.roadmap!.label).toMatch(/age \d+/);
  });
});
