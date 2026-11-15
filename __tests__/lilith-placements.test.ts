import { LILITH_HOUSES, LILITH_SIGNS, lilithHouseLine, lilithSignLine } from "@/lib/lilith-placements";
import { ZODIAC_SIGNS, type LilithId } from "@/types/chart";

const IDS: LilithId[] = ["lilith", "true_lilith", "asteroid_lilith", "dark_moon_lilith"];

describe("Lilith sign and house content", () => {
  test("every sign has a line for every Lilith", () => {
    for (const sign of ZODIAC_SIGNS) for (const id of IDS) expect(lilithSignLine(id, sign)).toBeTruthy();
  });

  test("every house has a line for every Lilith", () => {
    for (let h = 1; h <= 12; h++) for (const id of IDS) expect(lilithHouseLine(id, h)).toBeTruthy();
  });

  test("no line is reused and no banned copy", () => {
    const all = [...Object.values(LILITH_SIGNS), ...Object.values(LILITH_HOUSES)].flatMap((l) => Object.values(l));
    expect(new Set(all).size).toBe(all.length);
    for (const line of all) {
      expect(line).not.toMatch(/—|quietly|cosmic|empire/i);
      expect(line).not.toMatch(/\?/);
    }
  });
});

import { lilithConnectedReading, lilithReclaim } from "@/lib/lilith-placements";

describe("connected reading and reclaim", () => {
  test("every sign + house combination reads for every Lilith, and no two Liliths share a reclaim", () => {
    for (const sign of ZODIAC_SIGNS)
      for (let h = 1; h <= 12; h++) {
        const seen = new Set<string>();
        for (const id of IDS) {
          expect(lilithConnectedReading(id, sign, h, `${h}th`)).toBeTruthy();
          const r = lilithReclaim(id, sign, h)!;
          for (const line of [r.giveaway, r.reclaim, r.step]) {
            expect(seen.has(line)).toBe(false);
            seen.add(line);
            expect(line).not.toMatch(/—|quietly|cosmic|empire|undefined/i);
          }
        }
      }
  });
});
