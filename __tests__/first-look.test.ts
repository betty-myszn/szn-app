import { ZODIAC_SIGNS } from "@/types/chart";
import {
  SUN_FIRST_LOOK,
  MOON_FIRST_LOOK,
  RISING_FIRST_LOOK,
  VENUS_FIRST_LOOK,
  composeIntroPost,
} from "@/lib/first-look";

// The four lines render side by side on the onboarding reveal, so the set rules are what matter:
// every sign covered, the house copy bans kept out, and no two cards able to open the same way.
const SETS = { sun: SUN_FIRST_LOOK, moon: MOON_FIRST_LOOK, rising: RISING_FIRST_LOOK, venus: VENUS_FIRST_LOOK };

const firstWord = (s: string) => s.split(/\s+/)[0].replace(/[^A-Za-z]/g, "").toLowerCase();

describe("first look lines", () => {
  it("covers every sign for every placement", () => {
    for (const set of Object.values(SETS)) {
      for (const sign of ZODIAC_SIGNS) expect(set[sign]).toBeTruthy();
    }
  });

  it("keeps the banned copy moves out", () => {
    for (const set of Object.values(SETS)) {
      for (const line of Object.values(set)) {
        expect(line).not.toMatch(/—|–/);
        expect(line).not.toMatch(/\?/);
        expect(line).not.toMatch(/\b(it's|this isn't|you're) not\b/i);
        expect(line.toLowerCase()).not.toContain("honestly");
      }
    }
  });

  it("never lets two placements on the reveal open with the same word", () => {
    const openers = Object.fromEntries(
      Object.entries(SETS).map(([k, set]) => [k, new Set(Object.values(set).map(firstWord))])
    );
    const keys = Object.keys(openers);
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const shared = [...openers[keys[i]]].filter((w) => openers[keys[j]].has(w));
        expect({ pair: `${keys[i]}/${keys[j]}`, shared }).toEqual({ pair: `${keys[i]}/${keys[j]}`, shared: [] });
      }
    }
  });
});

describe("composeIntroPost", () => {
  const base = { name: "Sarah Jane", sun: "Libra", moon: "Scorpio", rising: "Leo", goal: "Launch my business.", seed: "a" };

  it("introduces her by first name with her Big 3 and her goal", () => {
    const post = composeIntroPost(base);
    expect(post).toContain("Sarah");
    expect(post).not.toContain("Jane");
    expect(post).toContain("Libra sun, Scorpio moon, Leo rising");
    expect(post).toContain("launch my business");
    expect(post).not.toMatch(/\{|\}/);
  });

  it("keeps a goal that starts with an acronym as she typed it", () => {
    expect(composeIntroPost({ ...base, goal: "UGC deals" })).toContain("UGC deals");
  });

  it("uses more than one wording across members", () => {
    const seen = new Set(Array.from({ length: 40 }, (_, i) => composeIntroPost({ ...base, seed: `m${i}` })));
    expect(seen.size).toBeGreaterThan(1);
  });

  it("still reads as a whole message with no goal or rising", () => {
    const post = composeIntroPost({ ...base, rising: "", goal: "" });
    expect(post).toContain("Libra sun, Scorpio moon");
    expect(post).not.toContain("rising");
    expect(post).not.toMatch(/\{|\}/);
  });
});
