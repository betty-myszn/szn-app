import { calculateChart } from "@/lib/astrology";

// Betty's real stored birth data (Bury, 1984-10-05), the row that triggered the bug.
const base = {
  name: "betty",
  dateOfBirth: "1984-10-05",
  birthTimeApproximate: false,
  location: {
    placeName: "Bury, England, United Kingdom",
    city: "Bury", country: "United Kingdom",
    latitude: 53.593, longitude: -2.298, timezone: "Europe/London",
  },
};

const sunSign = (c: ReturnType<typeof calculateChart>) =>
  c.planets.find((p) => p.name === "Sun")?.sign;

it("recalculates a real chart from the normalised stored time", () => {
  const chart = calculateChart({ ...base, birthTime: "16:30" });
  expect(chart.planets.length).toBeGreaterThan(0);
  expect(chart.houses.length).toBeGreaterThan(0);
  console.log("  local:", chart.localBirthTime, "| utc:", chart.utcBirthTime, "| sun:", sunSign(chart), "| asc:", chart.ascendant.toFixed(2));
});

it("changing the birth time changes the chart, so an edit genuinely takes effect", () => {
  const evening = calculateChart({ ...base, birthTime: "16:30" });
  const morning = calculateChart({ ...base, birthTime: "04:30" });
  console.log("  ascendant 16:30 =", evening.ascendant.toFixed(2), "| 04:30 =", morning.ascendant.toFixed(2));
  expect(evening.ascendant).not.toBeCloseTo(morning.ascendant, 1);
});
