import { composeTransitContacts } from "@/lib/transit-contact-content";
import type { ActivatedPlacement, AspectType } from "@/types/chart";

// These three cards render side by side, so the failure mode is not a bad sentence, it is the same
// sentence appearing three times. The old composer ended every card with "It is within a degree of
// exact, so this is the one you are most likely to actually be feeling right now", which cannot be
// true of three contacts at once. This suite bans the behaviour rather than the phrase: across any
// set shown together, no shared sentences, no shared openings, no shared closings.

const TRANSITING = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Chiron", "North Node"];
const NATAL = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Chiron", "Ascendant", "Midheaven", "North Node"];
const ASPECTS: AspectType[] = ["conjunction", "opposition", "square", "trine", "sextile"];
const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

function placement(i: number, orb: number): ActivatedPlacement {
  return {
    natalPlanet: NATAL[i % NATAL.length],
    natalSign: SIGNS[(i * 5) % SIGNS.length],
    natalHouse: (i % 12) + 1,
    activatedBy: TRANSITING[(i * 7) % TRANSITING.length],
    aspectType: ASPECTS[i % ASPECTS.length],
    orb,
    theme: "",
  };
}

const sentences = (body: string) => body.split(/(?<=\.)\s+/).filter(Boolean);

describe("the transit cards that sit side by side", () => {
  it("never repeats a sentence across the cards in one row", () => {
    for (let seed = 0; seed < 60; seed++) {
      const items = [0, 1, 2].map((n) => ({
        placement: placement(seed + n * 3, 0.1 + n * 0.4),
        applying: n % 2 === 0,
      }));
      const readings = composeTransitContacts(items);
      const seen = new Map<string, number>();
      readings.forEach((r, i) =>
        sentences(r.body).forEach((s) => {
          const at = seen.get(s);
          expect(at === undefined || at === i).toBe(true);
          seen.set(s, i);
        }),
      );
    }
  });

  it("never opens or closes two cards the same way", () => {
    for (let seed = 0; seed < 60; seed++) {
      const items = [0, 1, 2].map((n) => ({ placement: placement(seed * 2 + n, 0.2 + n * 0.5), applying: true }));
      const readings = composeTransitContacts(items);
      const opens = readings.map((r) => sentences(r.body)[0].split(" ").slice(0, 6).join(" "));
      const closes = readings.map((r) => sentences(r.body).slice(-1)[0]);
      expect(new Set(opens).size).toBe(opens.length);
      expect(new Set(closes).size).toBe(closes.length);
    }
  });

  it("lets only one card in a row claim it is peaking", () => {
    const items = [0, 1, 2].map((n) => ({ placement: placement(n, 0.1 + n * 0.2), applying: false }));
    const readings = composeTransitContacts(items);
    const peaking = readings.filter((r) => /right now|at its|today|peak|sitting right on/i.test(r.body));
    expect(peaking.length).toBeLessThanOrEqual(1);
  });

  it("does not carry the old boilerplate", () => {
    for (let seed = 0; seed < 40; seed++) {
      const readings = composeTransitContacts(
        [0, 1, 2].map((n) => ({ placement: placement(seed + n, 0.3 + n * 0.6), applying: n === 0 })),
      );
      for (const r of readings) {
        expect(r.body).not.toContain("most likely to actually be feeling right now");
        expect(r.body).not.toContain("It is within a degree of exact");
        expect(r.body).not.toContain("facing each other across the chart");
        expect(r.body).not.toMatch(/[—–]/);
        expect(r.body).not.toMatch(/\bis not\b[^.]{0,70}?,\s*(it's|it is)\b/);
        expect(sentences(r.body).length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("interprets the aspect per transiting planet rather than once for all of them", () => {
    const saturn = composeTransitContacts([
      { placement: { ...placement(0, 0.1), activatedBy: "Saturn", natalPlanet: "Sun", aspectType: "opposition" }, applying: false },
    ])[0];
    const uranus = composeTransitContacts([
      { placement: { ...placement(0, 0.9), activatedBy: "Uranus", natalPlanet: "Midheaven", aspectType: "opposition" }, applying: false },
    ])[0];
    // same aspect, different planets, and the explanation of the opposition has to differ
    expect(saturn.body).not.toBe(uranus.body);
    const shared = sentences(saturn.body).filter((s) => sentences(uranus.body).includes(s));
    expect(shared).toHaveLength(0);
  });
});
