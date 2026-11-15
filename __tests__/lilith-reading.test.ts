import { lilithPersonalReading } from "@/lib/lilith-reading";
import { ZODIAC_SIGNS } from "@/types/chart";

describe("personal Lilith reading", () => {
  test("every sign + house gives a full reading in her own voice", () => {
    for (const sign of ZODIAC_SIGNS)
      for (let h = 1; h <= 12; h++) {
        const r = lilithPersonalReading(sign, h)!;
        expect(r).toBeTruthy();
        for (const q of r.prompts) expect(q).not.toMatch(/\byour\b/i);
        for (const line of [r.shamed, r.where, r.money, r.step, ...r.prompts, ...r.affirmations])
          expect(line).not.toMatch(/—|quietly|cosmic|empire|undefined/i);
      }
  });
});

import { lilithDeepReading, lilithMoneyExercise } from "@/lib/lilith-reading";

describe("deep Lilith reading + money exercise", () => {
  test("every sign + house has the full deep reading and a money exercise", () => {
    for (const sign of ZODIAC_SIGNS)
      for (let h = 1; h <= 12; h++) {
        const r = lilithDeepReading(sign, h, `${h}th`)!;
        const ex = lilithMoneyExercise(sign, h)!;
        expect(r.prompts).toHaveLength(7);
        expect(r.affirmations).toHaveLength(8);
        expect(r.moves).toHaveLength(4);
        expect(ex.steps).toHaveLength(3);
        const all = [
          ...Object.values(r.shamed), ...Object.values(r.where), r.money.pattern, r.money.house,
          ...r.money.blocks, ...r.money.moves, ...r.prompts, ...r.affirmations, ...r.moves, ex.title, ex.focus, ...ex.steps,
        ];
        for (const line of all) expect(line).not.toMatch(/—|quietly|cosmic|empire|undefined/i);
        for (const q of r.prompts) expect(q).not.toMatch(/\byour\b/i);
        expect(new Set(r.affirmations).size).toBe(8);
      }
  });
});
