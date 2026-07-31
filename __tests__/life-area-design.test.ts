import { calculateHumanDesign } from "@/lib/human-design";
import { composeAreaDesign, gatesForSign, AREA_DESIGN } from "@/lib/life-area-design";
import { GATE_CENTER } from "@/lib/human-design-constants";
import { GATE_CONTENT } from "@/lib/human-design-gate-content";
import { ZODIAC_SIGNS } from "@/types/chart";

const birth = {
  name: "test",
  dateOfBirth: "1984-10-05",
  birthTime: "16:30",
  birthTimeApproximate: false,
  location: {
    placeName: "Bury",
    city: "Bury",
    country: "United Kingdom",
    latitude: 53.593,
    longitude: -2.298,
    timezone: "Europe/London",
  },
};

const hd = calculateHumanDesign(birth);

describe("gatesForSign", () => {
  it("covers roughly six gates per sign, and every sign resolves", () => {
    for (const sign of ZODIAC_SIGNS) {
      const gates = gatesForSign(sign);
      expect(gates.length).toBeGreaterThanOrEqual(5);
      expect(gates.length).toBeLessThanOrEqual(8);
      // Every gate must be a real gate with content behind it, or the reading would render blanks.
      for (const gate of gates) {
        expect(gate).toBeGreaterThanOrEqual(1);
        expect(gate).toBeLessThanOrEqual(64);
        expect(GATE_CONTENT[gate]).toBeTruthy();
      }
    }
  });

  it("returns nothing for a sign that does not exist, rather than throwing", () => {
    expect(gatesForSign("Ophiuchus")).toEqual([]);
  });
});

describe("composeAreaDesign", () => {
  it("returns null for an area with no Human Design mapping", () => {
    // Deliberate: HD has little specific to say about style, and padding it in reads as filler.
    expect(composeAreaDesign("style-fashion", hd, "Leo")).toBeNull();
  });

  it("builds a reading for a mapped area", () => {
    const reading = composeAreaDesign("relationships", hd, "Leo");
    expect(reading).toBeTruthy();
    expect(reading!.authority.body.length).toBeGreaterThan(100);
    expect(reading!.strategy.body.length).toBeGreaterThan(100);
  });

  it("never names a placement without interpreting it", () => {
    const reading = composeAreaDesign("relationships", hd, "Leo")!;
    for (const gate of reading.gates) {
      expect(gate.keynote).not.toBe("");
      expect(gate.shadow).not.toBe("");
      expect(gate.gift).not.toBe("");
    }
  });

  it("only surfaces gates belonging to the area's own centres", () => {
    for (const [areaId, config] of Object.entries(AREA_DESIGN)) {
      for (const sign of ZODIAC_SIGNS) {
        const reading = composeAreaDesign(areaId, hd, sign);
        if (!reading) continue;
        for (const gate of reading.gates) {
          expect(config.centers).toContain(GATE_CENTER[gate.gate]);
        }
      }
    }
  });

  it("caps the gate list so it can never become a data dump", () => {
    for (const sign of ZODIAC_SIGNS) {
      const reading = composeAreaDesign("relationships", hd, sign);
      if (!reading) continue;
      expect(reading.gates.length).toBeLessThanOrEqual(3);
    }
  });

  it("ranks her own natal gates above ones the season merely activates", () => {
    for (const sign of ZODIAC_SIGNS) {
      const reading = composeAreaDesign("relationships", hd, sign);
      if (!reading || reading.gates.length < 2) continue;
      const flags = reading.gates.map((g) => (g.natal ? 0 : 1));
      expect([...flags].sort()).toEqual(flags);
    }
  });

  it("marks natal gates honestly against the real chart", () => {
    const natal = new Set(hd.activatedGates);
    for (const sign of ZODIAC_SIGNS) {
      const reading = composeAreaDesign("relationships", hd, sign);
      if (!reading) continue;
      for (const gate of reading.gates) {
        expect(gate.natal).toBe(natal.has(gate.gate));
      }
    }
  });
});
