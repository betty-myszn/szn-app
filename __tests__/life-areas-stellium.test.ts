import { calculateChart } from "@/lib/astrology";
import { composeLifeArea, LIFE_AREAS } from "@/lib/life-areas";
import { SEASONS } from "@/lib/seasons";
import type { BirthData } from "@/types/chart";

// A stellium (three or more placements in one house) sends the life-area writer down its own
// branch, and in September 2026 that branch fed a list of adjectives into a string helper and threw.
// The throw reached the dashboard's page boundary and blanked the whole season HQ for ten members.
// Every area has to compose for every kind of chart, so this sweeps a year of charts rather than
// trusting a hand-picked few, and checks the sweep really does include stelliums.

const birthOn = (iso: string): BirthData => ({
  name: "Test",
  dateOfBirth: iso,
  birthTime: "06:00",
  birthTimeApproximate: false,
  location: { placeName: "London", city: "London", country: "UK", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
});

describe("life areas compose for every chart", () => {
  const charts = Array.from({ length: 365 }, (_, i) => {
    const d = new Date(Date.UTC(1990, 0, 1 + i));
    return calculateChart(birthOn(d.toISOString().slice(0, 10)));
  });

  it("never throws, for any area, in any season", () => {
    const failures: string[] = [];
    for (const chart of charts) {
      for (const area of LIFE_AREAS) {
        for (const season of SEASONS) {
          try {
            composeLifeArea(area.id, chart, season, null);
          } catch (e) {
            failures.push(`${chart.birthData.dateOfBirth} ${area.id} in ${season.sign}: ${(e as Error).message}`);
          }
        }
      }
    }
    expect(failures.slice(0, 5)).toEqual([]);
  });

  it("includes charts that take the stellium branch, including style & fashion", () => {
    const libra = SEASONS.find((s) => s.sign === "Libra")!;
    const stelliums = charts.filter((c) => JSON.stringify(composeLifeArea("style-fashion", c, libra, null)).includes("genuine stellium"));
    expect(stelliums.length).toBeGreaterThan(0);
  });
});
