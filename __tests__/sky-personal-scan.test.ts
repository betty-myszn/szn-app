import swisseph from "swisseph";
import path from "path";
import { scanPersonalSky } from "@/lib/sky-personal-scan";

swisseph.swe_set_ephe_path(path.join(process.cwd(), "ephe"));

// Pinned to 1 October 2026 so the dates below are the real sky, cross-checked against the published
// tables: Mercury into Scorpio 30 Sep, retrograde 24 Oct, direct 13 Nov, into Sagittarius 6 Dec;
// Mars opposite Pluto 3 Oct (an opposition, Leo to Aquarius, often misreported as a square);
// Venus backs into Libra 25 Oct; Pluto direct 15 Oct (US Eastern; 16 Oct in UTC).
const jd = swisseph.swe_julday(2026, 10, 1, 0, swisseph.SE_GREG_CAL) as unknown as number;
const sky = scanPersonalSky(jd);

describe("the fast-moving sky", () => {
  it("knows where Mercury is and how long it stays", () => {
    const m = sky.personalNow.find((p) => p.planet === "Mercury")!;
    expect(m).toMatchObject({ sign: "Scorpio", retrograde: false, since: "2026-09-30", until: "2026-12-06" });
    expect(m.stations).toEqual([
      { type: "retrograde_start", date: "2026-10-24", degree: 20 },
      { type: "retrograde_end", date: "2026-11-13", degree: 5 },
    ]);
  });

  it("finds Mars in Leo and Venus about to turn", () => {
    expect(sky.personalNow.find((p) => p.planet === "Mars")).toMatchObject({ sign: "Leo", since: "2026-09-27", until: "2026-11-25" });
    expect(sky.personalEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "retrograde_start", planet: "Venus", date: "2026-10-03", sign: "Scorpio" }),
        expect.objectContaining({ type: "ingress", planet: "Venus", date: "2026-10-25", sign: "Libra", retrograde: true }),
        expect.objectContaining({ type: "retrograde_start", planet: "Mercury", date: "2026-10-24", sign: "Scorpio" }),
      ]),
    );
  });

  it("sees oppositions and conjunctions, not just squares", () => {
    expect(sky.personalEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "aspect", planet: "Mars", otherPlanet: "Pluto", aspectType: "opposition", date: "2026-10-03", sign: "Leo", otherSign: "Aquarius" }),
        expect.objectContaining({ type: "aspect", planet: "Mars", otherPlanet: "Jupiter", aspectType: "conjunction", date: "2026-11-16" }),
        expect.objectContaining({ type: "aspect", planet: "Venus", otherPlanet: "Pluto", aspectType: "square", date: "2026-10-20" }),
      ]),
    );
  });

  it("lists the slow planets that are retrograde today", () => {
    const byName = Object.fromEntries(sky.retrogradeNow.map((r) => [r.planet, r]));
    expect(Object.keys(byName).sort()).toEqual(["Chiron", "Neptune", "Pluto", "Saturn", "Uranus"]);
    expect(byName.Saturn).toMatchObject({ sign: "Aries", since: "2026-07-26", until: "2026-12-10" });
    expect(byName.Pluto).toMatchObject({ sign: "Aquarius", until: "2026-10-15" });
    expect(byName.Uranus).toMatchObject({ sign: "Gemini", since: "2026-09-10" });
  });
});
