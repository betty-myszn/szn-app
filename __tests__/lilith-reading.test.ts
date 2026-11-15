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
