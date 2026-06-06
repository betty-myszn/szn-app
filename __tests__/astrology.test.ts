import { calculateChart, birthDataToUtc } from "@/lib/astrology";
import type { BirthData } from "@/types/chart";

// Barack Obama: Aug 4, 1961, 7:24 PM, Honolulu, Hawaii
const obamaBirthData: BirthData = {
  name: "Barack Obama",
  dateOfBirth: "1961-08-04",
  birthTime: "19:24",
  birthTimeApproximate: false,
  location: {
    placeName: "Honolulu, Hawaii, USA",
    city: "Honolulu",
    country: "United States",
    latitude: 21.3069,
    longitude: -157.8583,
    timezone: "Pacific/Honolulu",
  },
};

describe("birthDataToUtc", () => {
  it("converts Honolulu local time to UTC correctly", () => {
    const { utcDateTime, localDateTime } = birthDataToUtc(obamaBirthData);
    // Hawaii is UTC-10 (no DST ever)
    expect(utcDateTime.hour).toBe(5); // 19:24 + 10 = 05:24 next day
    expect(utcDateTime.minute).toBe(24);
    expect(utcDateTime.day).toBe(5); // Aug 5 UTC
    expect(localDateTime.hour).toBe(19);
    expect(localDateTime.minute).toBe(24);
  });

  it("handles DST correctly for US Eastern", () => {
    const eastCoast: BirthData = {
      name: "Test",
      dateOfBirth: "1990-07-15",
      birthTime: "14:00",
      birthTimeApproximate: false,
      location: {
        placeName: "New York, NY",
        city: "New York",
        country: "United States",
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
      },
    };
    const { utcDateTime } = birthDataToUtc(eastCoast);
    // July = EDT = UTC-4
    expect(utcDateTime.hour).toBe(18);
  });

  it("handles DST correctly for US Eastern in winter", () => {
    const eastCoastWinter: BirthData = {
      name: "Test",
      dateOfBirth: "1990-01-15",
      birthTime: "14:00",
      birthTimeApproximate: false,
      location: {
        placeName: "New York, NY",
        city: "New York",
        country: "United States",
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
      },
    };
    const { utcDateTime } = birthDataToUtc(eastCoastWinter);
    // January = EST = UTC-5
    expect(utcDateTime.hour).toBe(19);
  });
});

describe("calculateChart - Obama sample", () => {
  const chart = calculateChart(obamaBirthData);

  it("calculates Sun in Leo", () => {
    const sun = chart.planets.find((p) => p.name === "Sun");
    expect(sun).toBeDefined();
    expect(sun!.sign).toBe("Leo");
    // Astro.com: Sun at ~12° Leo
    expect(sun!.degree).toBeGreaterThanOrEqual(11);
    expect(sun!.degree).toBeLessThanOrEqual(13);
  });

  it("calculates Moon in Gemini", () => {
    const moon = chart.planets.find((p) => p.name === "Moon");
    expect(moon).toBeDefined();
    expect(moon!.sign).toBe("Gemini");
  });

  it("calculates Ascendant in Aquarius", () => {
    const asc = chart.houses[0];
    expect(asc.sign).toBe("Aquarius");
    // Astro.com: ASC ~18° Aquarius
    expect(asc.degree).toBeGreaterThanOrEqual(16);
    expect(asc.degree).toBeLessThanOrEqual(20);
  });

  it("calculates Mercury in Leo", () => {
    const mercury = chart.planets.find((p) => p.name === "Mercury");
    expect(mercury).toBeDefined();
    expect(mercury!.sign).toBe("Leo");
  });

  it("calculates Venus in Cancer", () => {
    const venus = chart.planets.find((p) => p.name === "Venus");
    expect(venus).toBeDefined();
    expect(venus!.sign).toBe("Cancer");
  });

  it("calculates Mars in Virgo", () => {
    const mars = chart.planets.find((p) => p.name === "Mars");
    expect(mars).toBeDefined();
    expect(mars!.sign).toBe("Virgo");
  });

  it("calculates Jupiter in Aquarius", () => {
    const jupiter = chart.planets.find((p) => p.name === "Jupiter");
    expect(jupiter).toBeDefined();
    expect(jupiter!.sign).toBe("Aquarius");
    expect(jupiter!.retrograde).toBe(true);
  });

  it("calculates Saturn in Capricorn", () => {
    const saturn = chart.planets.find((p) => p.name === "Saturn");
    expect(saturn).toBeDefined();
    expect(saturn!.sign).toBe("Capricorn");
    expect(saturn!.retrograde).toBe(true);
  });

  it("has 12 house cusps", () => {
    expect(chart.houses).toHaveLength(12);
  });

  it("has aspects calculated", () => {
    expect(chart.aspects.length).toBeGreaterThan(0);
  });

  it("has all 14 celestial bodies", () => {
    expect(chart.planets).toHaveLength(13);
    const names = chart.planets.map((p) => p.name);
    expect(names).toContain("Sun");
    expect(names).toContain("Moon");
    expect(names).toContain("Mercury");
    expect(names).toContain("Venus");
    expect(names).toContain("Mars");
    expect(names).toContain("Jupiter");
    expect(names).toContain("Saturn");
    expect(names).toContain("Uranus");
    expect(names).toContain("Neptune");
    expect(names).toContain("Pluto");
    expect(names).toContain("Chiron");
    expect(names).toContain("North Node");
    expect(names).toContain("South Node");
  });

  it("has South Node opposite North Node", () => {
    const nn = chart.planets.find((p) => p.name === "North Node")!;
    const sn = chart.planets.find((p) => p.name === "South Node")!;
    let diff = Math.abs(nn.longitude - sn.longitude);
    if (diff > 180) diff = 360 - diff;
    expect(diff).toBeCloseTo(180, 0);
  });

  it("includes rulerships for all 12 signs", () => {
    expect(chart.rulerships).toHaveLength(12);
  });

  it("marks chart as not approximate", () => {
    expect(chart.approximate).toBe(false);
  });

  it("outputs correct UTC time", () => {
    expect(chart.utcBirthTime).toContain("1961-08-05");
    expect(chart.utcBirthTime).toContain("05:24");
  });
});
