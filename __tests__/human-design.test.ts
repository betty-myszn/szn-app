import { calculateHumanDesign } from "@/lib/human-design";
import {
  GATE_CENTER,
  GATE_WHEEL,
  CHANNEL_PAIRS,
  CENTERS,
} from "@/lib/human-design-constants";
import type { BirthData } from "@/types/chart";

// Golden fixtures. The expected Type / Authority / activated-gate set / defined
// centres were produced by TWO independent open-source engines (natalengine +
// free-human-design) which agreed with each other exactly on all of these for
// all five births (see hd-research/HANDOFF.md + RESULTS.txt). Our engine runs on
// the real Swiss Ephemeris, so this is a genuine cross-implementation check.
//
// Centre names are normalised: the oracle spike used "solar", our engine uses
// "solarplexus". profileOneOf covers the one known knife-edge (NYC design Sun on
// a line boundary: 2/4 vs 2/5 depending on sub-degree ephemeris differences).

type Fixture = {
  birth: BirthData;
  type: string;
  authority: string;
  gates: number[];
  centers: string[];
  profileOneOf: string[];
};

const birth = (
  name: string,
  dateOfBirth: string,
  birthTime: string,
  timezone: string,
  latitude: number,
  longitude: number
): BirthData => ({
  name,
  dateOfBirth,
  birthTime,
  birthTimeApproximate: false,
  location: { placeName: name, city: name, country: "", latitude, longitude, timezone },
});

const FIXTURES: Fixture[] = [
  {
    birth: birth("NYC", "1990-06-15", "14:30", "America/New_York", 40.7128, -74.006),
    type: "Manifestor",
    authority: "emotional",
    gates: [1, 6, 7, 11, 12, 13, 15, 16, 19, 21, 22, 23, 33, 34, 36, 38, 41, 53, 58, 61],
    centers: ["g", "solarplexus", "throat"],
    profileOneOf: ["2/4", "2/5"],
  },
  {
    birth: birth("Bangkok", "1972-08-02", "14:30", "Asia/Bangkok", 13.75, 100.5),
    type: "Manifesting Generator",
    authority: "sacral",
    gates: [4, 10, 11, 12, 16, 19, 24, 33, 34, 44, 45, 46, 48, 51, 56, 57, 58, 60, 61, 62],
    centers: ["ajna", "g", "head", "sacral", "spleen", "throat"],
    profileOneOf: ["3/5"],
  },
  {
    birth: birth("London", "1985-03-20", "09:15", "Europe/London", 51.5074, -0.1278),
    type: "Generator",
    authority: "sacral",
    gates: [5, 8, 10, 13, 14, 15, 19, 22, 23, 25, 26, 27, 28, 30, 38, 42, 43, 46, 51, 54],
    centers: ["ajna", "g", "heart", "root", "sacral", "spleen", "throat"],
    profileOneOf: ["2/4"],
  },
  {
    birth: birth("Sydney", "2000-11-05", "23:45", "Australia/Sydney", -33.8688, 151.2093),
    type: "Projector",
    authority: "emotional",
    gates: [1, 2, 5, 7, 8, 9, 13, 16, 26, 30, 31, 41, 43, 46, 49, 50, 53, 54, 56, 59, 61, 62],
    centers: ["g", "root", "solarplexus", "throat"],
    profileOneOf: ["1/3"],
  },
  {
    birth: birth("Oprah", "1954-01-29", "04:30", "America/Chicago", 33.0576, -89.5876),
    type: "Generator",
    authority: "emotional",
    gates: [4, 12, 18, 19, 24, 29, 32, 33, 34, 35, 43, 44, 46, 49, 50, 53, 56, 57, 60, 61, 62],
    centers: ["ajna", "g", "head", "root", "sacral", "solarplexus", "spleen"],
    profileOneOf: ["2/4"],
  },
];

describe("human-design constants integrity", () => {
  it("has all 64 gates mapped to a centre exactly once", () => {
    const keys = Object.keys(GATE_CENTER).map(Number).sort((a, b) => a - b);
    expect(keys).toHaveLength(64);
    expect(keys[0]).toBe(1);
    expect(keys[63]).toBe(64);
  });

  it("has a 64-gate wheel with no duplicates", () => {
    expect(GATE_WHEEL).toHaveLength(64);
    expect(new Set(GATE_WHEEL).size).toBe(64);
  });

  it("has 36 channels, all referencing known gates", () => {
    expect(CHANNEL_PAIRS).toHaveLength(36);
    for (const [a, b] of CHANNEL_PAIRS) {
      expect(GATE_CENTER[a]).toBeDefined();
      expect(GATE_CENTER[b]).toBeDefined();
    }
  });
});

describe("calculateHumanDesign vs independent oracle engines", () => {
  for (const f of FIXTURES) {
    describe(f.birth.name, () => {
      const hd = calculateHumanDesign(f.birth);

      it("matches Type", () => {
        expect(hd.type).toBe(f.type);
      });
      it("matches Authority", () => {
        expect(hd.authority).toBe(f.authority);
      });
      it("matches the activated-gate set", () => {
        expect(hd.activatedGates).toEqual(f.gates);
      });
      it("matches the defined centres", () => {
        expect(hd.definedCenters.slice().sort()).toEqual(f.centers.slice().sort());
      });
      it("produces an accepted Profile", () => {
        expect(f.profileOneOf).toContain(hd.profile);
      });
      it("has consistent defined + open centres covering all nine", () => {
        expect(hd.definedCenters.length + hd.openCenters.length).toBe(CENTERS.length);
      });
    });
  }
});
