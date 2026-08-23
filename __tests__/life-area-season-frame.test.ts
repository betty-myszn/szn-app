import { calculateChart } from "@/lib/astrology";
import type { BirthData } from "@/types/chart";
import { SEASONS } from "@/lib/seasons";
import { composeLifeArea } from "@/lib/life-areas";
import { houseForSign } from "@/lib/interpretations";

// Obama: Aug 4 1961, 7:24pm Honolulu. Aquarius rising, so Virgo season lands in his 7th/8th house,
// NOT in his 2nd (money) or 10th (career). This locks the fix for the bug where the life-area
// signature claimed "<season> season activates your <area house>", conflating the topic's natural
// house with where the season actually falls.
const obama: BirthData = {
  name: "Obama",
  dateOfBirth: "1961-08-04",
  birthTime: "19:24",
  birthTimeApproximate: false,
  location: {
    placeName: "Honolulu",
    city: "Honolulu",
    country: "United States",
    latitude: 21.3069,
    longitude: -157.8583,
    timezone: "Pacific/Honolulu",
  },
};

const virgo = SEASONS.find((s) => s.sign === "Virgo")!;

describe("life-area signature never claims the season activates the area's own house", () => {
  const chart = calculateChart(obama);
  const cusps = chart.houses.map((h) => h.longitude);
  const seasonHouse = houseForSign("Virgo", cusps); // where Virgo actually falls (his 7th)

  for (const area of ["money", "career", "relationships", "health-body"]) {
    it(`${area}: states the topic's house as fact, not as where the season landed`, () => {
      const r = composeLifeArea(area, chart, virgo, null, null);
      expect(r).toBeTruthy();
      const sig = r!.signature;
      // The old bug: "Virgo season activates your Nth house ... that's where this szn's pressure is
      // actually landing", where N was the area's house, not the season's house.
      expect(sig).not.toMatch(/virgo season activates your \d+(st|nd|rd|th) house/i);
      expect(sig).not.toContain("is actually landing");
      // The area's house is stated as a chart fact the season leans on.
      expect(sig).toMatch(/plays out through your \d+(st|nd|rd|th) house/i);
    });
  }

  it("money area's house (2nd) is not the same as where Virgo season falls (7th), proving the distinction matters", () => {
    const r = composeLifeArea("money", chart, virgo, null, null);
    expect(r!.recipeHouses[0].house).toBe(2); // money lives in the 2nd
    expect(seasonHouse).not.toBe(2); // but Virgo season is not in his 2nd
  });
});

describe("life-area affirmations always match the current season, for every area", () => {
  const chart = calculateChart(obama);
  const libra = SEASONS.find((s) => s.sign === "Libra")!;

  for (const area of ["money", "relationships", "career", "mindset"]) {
    it(`${area}: Virgo season affirmations name the season and the area`, () => {
      const r = composeLifeArea(area, chart, virgo, null, null);
      expect(r!.affirmations.length).toBeGreaterThan(0);
      // Every affirmation is woven from Virgo season, not a static area line.
      expect(r!.affirmations.every((a) => a.toLowerCase().includes("virgo") || a.toLowerCase().includes("routines"))).toBe(true);
      // At least one clearly ties the season to this exact area.
      expect(r!.affirmations.some((a) => a.toLowerCase().includes("virgo szn"))).toBe(true);
    });
  }

  it("the same slot re-seasons itself: Libra season produces Libra affirmations, not Virgo", () => {
    const r = composeLifeArea("money", chart, libra, null, null);
    expect(r!.affirmations.some((a) => a.toLowerCase().includes("libra szn"))).toBe(true);
    expect(r!.affirmations.every((a) => !a.toLowerCase().includes("virgo"))).toBe(true);
  });
});
