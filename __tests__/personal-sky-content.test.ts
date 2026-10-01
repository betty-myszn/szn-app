import { calculateChart } from "@/lib/astrology";
import { HOOKS, HOUSE_READS, SIGN_WANTS, composeSky, natalMeeting, skyForYou, skyHref, type SkyInput } from "@/lib/personal-sky-content";
import { ZODIAC_SIGNS } from "@/types/chart";

const chart = calculateChart({
  name: "Test",
  dateOfBirth: "1992-06-15",
  birthTime: "14:30",
  birthTimeApproximate: false,
  location: { placeName: "London", city: "London", country: "UK", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
});

describe("the fast-moving sky, read for one member", () => {
  it("has copy for every planet in every sign and every house", () => {
    for (const p of ["Mercury", "Venus", "Mars"] as const) {
      for (const s of ZODIAC_SIGNS) expect(HOOKS[p][s]).toBeTruthy();
      expect(HOUSE_READS[p]).toHaveLength(12);
    }
    for (const s of ZODIAC_SIGNS) expect(SIGN_WANTS[s]).toBeTruthy();
  });

  it("never writes an em dash, for any planet, sign or event", () => {
    const types: SkyInput["type"][] = ["now", "ingress", "retrograde_start", "retrograde_end"];
    for (const planet of ["Mercury", "Venus", "Mars"] as const)
      for (const sign of ZODIAC_SIGNS)
        for (const type of types) {
          const r = composeSky({ planet, type, sign, degree: 12, date: "2026-10-24" }, chart, { since: "2026-09-30", until: "2026-12-06", stations: [] });
          const text = [r.title, r.hook, r.move, r.prompt, r.affirmation, ...r.parts.flatMap((x) => x.paragraphs)].join(" ");
          expect(text).not.toMatch(/—/);
          expect(text).not.toMatch(/undefined/);
        }
  });

  it("puts the thread together in order, personal parts after the collective ones", () => {
    const r = composeSky({ planet: "Mercury", type: "now", sign: "Scorpio" }, chart, {
      since: "2026-09-30",
      until: "2026-12-06",
      stations: [
        { type: "retrograde_start", date: "2026-10-24", degree: 20 },
        { type: "retrograde_end", date: "2026-11-13", degree: 5 },
      ],
    });
    expect(r.parts.map((p) => p.heading)).toEqual(["what mercury rules", "what scorpio wants", "how long this lasts", "where it lands for you", "your own mercury"]);
    expect(r.parts[2].paragraphs.join(" ")).toMatch(/30 September to 6 December.*retrograde on 24 October and direct again on 13 November/);
  });

  it("reads an aspect across both of her houses", () => {
    const input: SkyInput = { planet: "Mars", type: "aspect", sign: "Leo", degree: 3, date: "2026-10-03", otherPlanet: "Pluto", otherSign: "Aquarius", otherDegree: 3, aspectType: "opposition" };
    const r = composeSky(input, chart);
    expect(r.title).toBe("mars opposite pluto");
    expect(skyForYou(input, chart)).toMatch(/^Pulls between your \d+(st|nd|rd|th) house/);
  });

  it("names how the transit meets her own placement", () => {
    expect(natalMeeting("Mercury", "Scorpio", "Scorpio")).toMatch(/home turf/);
    expect(natalMeeting("Mercury", "Scorpio", "Taurus")).toMatch(/directly opposite/);
    expect(natalMeeting("Mercury", "Scorpio", "Cancer")).toMatch(/same element/);
    expect(natalMeeting("Venus", "Scorpio", "Leo")).toMatch(/squares/);
  });

  it("sends Venus retrograde in Scorpio to its written guide and everything else to the reading", () => {
    expect(skyHref({ planet: "Venus", type: "retrograde_start", sign: "Scorpio", date: "2026-10-03" })).toMatch(/^\/your-season\/transit\?/);
    expect(skyHref({ planet: "Mercury", type: "now", sign: "Scorpio" })).toBe("/your-season/sky?planet=Mercury&type=now&sign=Scorpio");
  });
});
