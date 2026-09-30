import {
  AREA_FLAVOUR,
  PICKABLE_AREAS,
  eraName,
  findBreakthrough,
  isFirstRunAccount,
  pickCardLine,
  pickList,
  sanitizePicks,
  shortLabel,
  wheelHouse,
} from "@/lib/szn-picks";
import { LIFE_AREAS } from "@/lib/life-areas";
import type { ActivatedPlacement } from "@/types/chart";

const hit = (over: Partial<ActivatedPlacement>): ActivatedPlacement => ({
  natalPlanet: "Venus",
  natalSign: "Libra",
  natalHouse: 7,
  activatedBy: "Saturn",
  aspectType: "square",
  orb: 1,
  theme: "love",
  ...over,
});

describe("customise my szn picks", () => {
  it("offers every life area, each with its own flavour", () => {
    expect(PICKABLE_AREAS.map((a) => a.id).sort()).toEqual(LIFE_AREAS.map((a) => a.id).sort());
    const lines = Object.values(AREA_FLAVOUR).flatMap((f) => [f.yes, f.no]);
    expect(new Set(lines).size).toBe(lines.length);
    for (const line of lines) expect(line).not.toMatch(/—/);
  });

  it("cleans whatever comes out of storage into ordered, unique, real ids", () => {
    expect(sanitizePicks(["money", "nope", "money", 4, "relationships"])).toEqual(["money", "relationships"]);
    expect(sanitizePicks("money")).toEqual([]);
    expect(sanitizePicks(undefined)).toEqual([]);
  });

  it("names her era from her top three picks, in the order she tapped", () => {
    expect(eraName([])).toBe("");
    expect(eraName(["money"])).toBe("rich girl era");
    expect(eraName(["money", "confidence"])).toBe("rich girl + main character era");
    expect(eraName(["money", "confidence", "purpose", "healing"])).toBe("rich girl, main character + destiny era");
  });

  it("reads labels the way a member says them", () => {
    expect(shortLabel("relationships")).toBe("love");
    expect(shortLabel("career")).toBe("career");
    expect(shortLabel("style-fashion")).toBe("style");
    expect(pickList(["money", "relationships", "career"])).toBe("money, love + career");
  });

  it("lights each area's primary house on the wheel", () => {
    expect(wheelHouse("money")).toBe(2);
    expect(wheelHouse("relationships")).toBe(7);
    expect(wheelHouse("career")).toBe(10);
  });

  it("only sends the full-screen picker to accounts made after launch", () => {
    expect(isFirstRunAccount("2026-10-02T09:00:00Z")).toBe(true);
    expect(isFirstRunAccount("2026-08-01T09:00:00Z")).toBe(false);
    expect(isFirstRunAccount(null)).toBe(false);
    expect(isFirstRunAccount("not a date")).toBe(false);
  });

  describe("flagging a big moment in an area she didn't pick", () => {
    it("flags a tight hard contact from a slow planet in an unpicked area's house", () => {
      const out = findBreakthrough(["relationships", "career"], [hit({})]);
      expect(out?.areaId).toBe("relationships");
    });

    it("stays quiet for fast planets, soft aspects and wide orbs", () => {
      expect(findBreakthrough(["relationships"], [hit({ activatedBy: "Moon" })])).toBeNull();
      expect(findBreakthrough(["relationships"], [hit({ aspectType: "trine" })])).toBeNull();
      expect(findBreakthrough(["relationships"], [hit({ orb: 3.5 })])).toBeNull();
    });

    it("never flags an area she already picked", () => {
      expect(findBreakthrough(["career"], [hit({})])).toBeNull();
      expect(findBreakthrough([], [hit({})])).toBeNull();
      expect(findBreakthrough(["relationships"], undefined)).toBeNull();
    });

    it("skips a house one of her picks already covers", () => {
      // Style and confidence both live in the 1st: with confidence picked, a 1st-house hit is on her screen already.
      expect(findBreakthrough(["style-fashion"], [hit({ natalHouse: 1 })], ["confidence"])).toBeNull();
    });

    it("takes the tightest contact first", () => {
      const out = findBreakthrough(
        ["relationships", "career"],
        [hit({ natalHouse: 7, orb: 1.8 }), hit({ natalHouse: 10, activatedBy: "Pluto", aspectType: "opposition", orb: 0.3 })],
      );
      expect(out?.areaId).toBe("career");
    });
  });

  it("gives every card in a row its own sentence shape, significator first", () => {
    const facts = {
      label: "money",
      house: 2,
      bodyLabel: "jupiter",
      sign: "Virgo",
      cuspSign: "Scorpio",
      ruler: { rulerName: "Pluto", rulerSign: "Scorpio", rulerHouse: 2 },
    };
    const lines = [0, 1, 2, 3].map((i) => pickCardLine(facts, i));
    expect(new Set(lines.map((l) => l.split(" ").slice(0, 3).join(" "))).size).toBe(4);
    for (const l of lines) {
      expect(l).toMatch(/jupiter/);
      expect(l).not.toMatch(/—/);
    }
    const self = pickCardLine({ ...facts, bodyLabel: "venus", ruler: { rulerName: "Venus", rulerSign: "Gemini", rulerHouse: 7 } }, 0);
    expect(self).not.toMatch(/hands the keys to venus/);
  });
});
