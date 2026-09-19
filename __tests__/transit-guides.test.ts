import { VENUS_RX_SCORPIO, guideFor } from "@/lib/transit-guides";

// A written transit guide replaces the composed page entirely, so a hole in one is a hole in the
// member's whole reading. Every house has to be written, every section has to be substantial, and
// the copy has to hold the writing brief's bans.

const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const NEGATION_REFRAME = /\b(isn't|is not|aren't|are not|wasn't|was not)\b[^.]{0,70}?,\s*(it's|it is|they're|you're|that's)\b/;

describe("the venus retrograde in scorpio guide", () => {
  it("is reachable for the transit that has it, and only that one", () => {
    expect(guideFor("retrograde_start", "Venus", "Scorpio")).toBe(VENUS_RX_SCORPIO);
    expect(guideFor("retrograde_start", "Venus", "Libra")).toBeNull();
    expect(guideFor("ingress", "Venus", "Scorpio")).toBeNull();
    expect(guideFor("retrograde_start", "Mars", "Scorpio")).toBeNull();
  });

  it("carries a full general section", () => {
    expect(VENUS_RX_SCORPIO.sections.length).toBeGreaterThanOrEqual(8);
    const words = VENUS_RX_SCORPIO.sections
      .flatMap((s) => s.body)
      .join(" ")
      .split(/\s+/).length;
    expect(words).toBeGreaterThan(1500);
    for (const section of VENUS_RX_SCORPIO.sections) {
      expect(section.heading.length).toBeGreaterThan(4);
      expect(section.body.length).toBeGreaterThanOrEqual(3);
    }
  });

  for (const house of HOUSES) {
    it(`writes the ${house}th house its own reading and its own action`, () => {
      const paragraphs = VENUS_RX_SCORPIO.house[house];
      expect(paragraphs).toBeDefined();
      expect(paragraphs.length).toBeGreaterThanOrEqual(4);
      expect(paragraphs.join(" ").split(/\s+/).length).toBeGreaterThan(180);
      expect(VENUS_RX_SCORPIO.move.byHouse[house]).toBeTruthy();
    });
  }

  it("holds the writing brief across every paragraph", () => {
    const all = [
      ...VENUS_RX_SCORPIO.sections.flatMap((s) => s.body),
      ...HOUSES.flatMap((h) => VENUS_RX_SCORPIO.house[h]),
      ...VENUS_RX_SCORPIO.bettysTake,
      ...VENUS_RX_SCORPIO.move.steps,
      ...HOUSES.map((h) => VENUS_RX_SCORPIO.move.byHouse[h]),
    ];
    for (const paragraph of all) {
      expect(paragraph).not.toMatch(/[—–]/);
      expect(paragraph.toLowerCase()).not.toContain("oooof");
      expect(paragraph).not.toMatch(NEGATION_REFRAME);
      expect(paragraph.split("**").length % 2).toBe(1);
    }
  });

  it("uses each one-liner once, so the page never repeats itself", () => {
    const whole = [
      ...VENUS_RX_SCORPIO.sections.flatMap((s) => s.body),
      ...VENUS_RX_SCORPIO.bettysTake,
    ].join(" ");
    expect(whole.match(/twin flame/g) ?? []).toHaveLength(1);
    expect(whole.match(/personally offending/g) ?? []).toHaveLength(1);
  });
});
