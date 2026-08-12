// Content coverage audit. The interpretation engine is compositional: every reading is assembled
// at render time from complete foundational layers (12 signs, 12 houses, 17 bodies, sign rulers,
// 12 life areas, 12 seasons). This audit proves that composition resolves to real, non-placeholder
// content for EVERY supported combination the live app can produce, so no member ever receives a
// thinner reading because their exact placement wasn't hand-written as an example.
//
// It fails the build if any combination yields empty, undefined, or placeholder output.

import type { ChartData, PlanetPosition, HouseCusp } from "@/types/chart";
import { ZODIAC_SIGNS } from "@/types/chart";
import {
  SIGN_TRAITS,
  SIGN_OVERVIEWS,
  SIGN_RULERS,
  HOUSE_MEANINGS,
  BODY_MEANINGS,
  composeRulerPlacement,
  interpretAspect,
  ordinalHouse,
  houseForSign,
} from "@/lib/interpretations";
import { composeLunation } from "@/lib/moon-content";
import { composeHouseDeepDive } from "@/lib/house-content";
import { composeLifeArea, LIFE_AREAS } from "@/lib/life-areas";
import { SEASONS } from "@/lib/seasons";

const SIGNS: string[] = [...ZODIAC_SIGNS];
const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Every planet id the composition layer can read a ruler or life-area body through.
const CORE_PLANETS: { id: string; name: string }[] = [
  { id: "sun", name: "Sun" },
  { id: "moon", name: "Moon" },
  { id: "mercury", name: "Mercury" },
  { id: "venus", name: "Venus" },
  { id: "mars", name: "Mars" },
  { id: "jupiter", name: "Jupiter" },
  { id: "saturn", name: "Saturn" },
  { id: "uranus", name: "Uranus" },
  { id: "neptune", name: "Neptune" },
  { id: "pluto", name: "Pluto" },
  { id: "chiron", name: "Chiron" },
  { id: "north_node", name: "North Node" },
  { id: "south_node", name: "South Node" },
  { id: "lilith", name: "Lilith" },
  { id: "part_of_fortune", name: "Part of Fortune" },
];

// Anything that means "no real content got composed here". A published reading containing any of
// these is a coverage hole, not a valid interpretation.
const PLACEHOLDER_MARKERS = [
  "undefined",
  "null",
  "NaN",
  "[object",
  "TODO",
  "PLACEHOLDER",
  "lorem",
  "XXX",
  "{{",
  "}}",
  "  ", // a double space usually means a template slot resolved to an empty string
];

// `minLength` distinguishes prose (readings, must be substantial) from short labels like a house
// title or a body's domain word, which are legitimately brief and feed INTO the prose.
function assertRealText(text: unknown, context: string, minLength = 20): void {
  expect(typeof text === "string" ? text : `NON_STRING(${context})`).toEqual(expect.any(String));
  const s = String(text);
  if (s.trim().length < minLength) throw new Error(`Coverage hole (too short): ${context} -> "${s}"`);
  for (const marker of PLACEHOLDER_MARKERS) {
    if (s.includes(marker)) throw new Error(`Placeholder marker "${marker.trim()}" in ${context}: "${s.slice(0, 120)}..."`);
  }
}

function makePlanet(id: string, name: string, sign: string, house: number): PlanetPosition {
  return {
    id,
    name,
    longitude: 0,
    latitude: 0,
    sign,
    signIndex: SIGNS.indexOf(sign),
    degree: 15,
    minute: 30,
    second: 0,
    house,
    retrograde: false,
    formattedDegree: `15°${sign.substring(0, 3)} 30'`,
  };
}

// Builds a fully valid synthetic chart. `cuspSigns` sets each house's cusp sign; `placements`
// overrides where specific planets sit. Every core planet is always present so no ruler lookup
// can miss.
function makeChart(opts: {
  cuspSigns?: string[]; // length 12, house 1..12
  placements?: Record<string, { sign: string; house: number }>;
  name?: string;
} = {}): ChartData {
  const cuspSigns = opts.cuspSigns ?? HOUSES.map((h) => SIGNS[(h - 1) % 12]);
  const houses: HouseCusp[] = HOUSES.map((h) => ({
    house: h,
    longitude: (h - 1) * 30,
    sign: cuspSigns[h - 1],
    degree: 5,
    minute: 0,
    formattedDegree: `5°${cuspSigns[h - 1].substring(0, 3)} 0'`,
  }));

  const planets: PlanetPosition[] = CORE_PLANETS.map((p, i) => {
    const override = opts.placements?.[p.id];
    const sign = override?.sign ?? SIGNS[i % 12];
    const house = override?.house ?? ((i % 12) + 1);
    return makePlanet(p.id, p.name, sign, house);
  });

  return {
    birthData: {
      name: opts.name ?? "Audit Member",
      dateOfBirth: "1990-01-01",
      birthTime: "12:00",
      birthTimeApproximate: false,
      location: { placeName: "Test", city: "Test", country: "Test", latitude: 0, longitude: 0, timezone: "UTC" },
    },
    localBirthTime: "1990-01-01T12:00:00",
    utcBirthTime: "1990-01-01T12:00:00Z",
    julianDay: 2447893,
    planets,
    houses,
    ascendant: 0,
    midheaven: 270,
    aspects: [],
    rulerships: [],
    calculatedAt: new Date().toISOString(),
    approximate: false,
  };
}

// ── Foundational layer completeness ──────────────────────────────────────────

describe("foundational layers are complete", () => {
  const TRAIT_FIELDS = ["essence", "gift", "shadow", "confidence", "career", "money", "love", "growth"] as const;

  it("every sign has full SIGN_TRAITS with every field populated", () => {
    for (const sign of SIGNS) {
      const t = SIGN_TRAITS[sign];
      expect(t).toBeDefined();
      for (const field of TRAIT_FIELDS) {
        assertRealText(t[field], `SIGN_TRAITS.${sign}.${field}`);
      }
      expect(Array.isArray(t.flavour) && t.flavour.length).toBeGreaterThan(0);
    }
  });

  it("every sign has a SIGN_OVERVIEW", () => {
    for (const sign of SIGNS) {
      const o = SIGN_OVERVIEWS[sign];
      expect(o).toBeDefined();
      assertRealText(o.archetype, `SIGN_OVERVIEWS.${sign}.archetype`);
    }
  });

  it("every sign maps to a modern ruler, and the 3 dual-ruled signs carry a traditional co-ruler", () => {
    for (const sign of SIGNS) {
      const r = SIGN_RULERS[sign];
      expect(r).toBeDefined();
      expect(r.rulerId).toBeTruthy();
      expect(r.rulerName).toBeTruthy();
    }
    for (const sign of ["Scorpio", "Aquarius", "Pisces"]) {
      expect(SIGN_RULERS[sign].traditionalRulerId).toBeTruthy();
      expect(SIGN_RULERS[sign].traditionalRulerName).toBeTruthy();
    }
  });

  it("all 12 houses have complete HOUSE_MEANINGS", () => {
    expect(HOUSE_MEANINGS.length).toBe(12);
    for (const h of HOUSE_MEANINGS) {
      assertRealText(h.title, `HOUSE_MEANINGS[${h.house}].title`, 4);
      assertRealText(h.deepDive, `HOUSE_MEANINGS[${h.house}].deepDive`);
      assertRealText(h.naturalSign, `HOUSE_MEANINGS[${h.house}].naturalSign`, 3);
    }
  });

  it("all 17 bodies have complete BODY_MEANINGS", () => {
    expect(BODY_MEANINGS.length).toBeGreaterThanOrEqual(17);
    for (const b of BODY_MEANINGS) {
      assertRealText(b.deepDive, `BODY_MEANINGS.${b.id}.deepDive`);
      assertRealText(b.domainShort, `BODY_MEANINGS.${b.id}.domainShort`, 4);
    }
  });
});

// ── Ruler placement: every ruler in every sign in every house ────────────────

describe("ruler placement composes for every combination", () => {
  it("all 144 sign-on-house cusps resolve to a real ruler placement", () => {
    for (const house of HOUSES) {
      for (const cuspSign of SIGNS) {
        const ruler = SIGN_RULERS[cuspSign];
        // Place that cusp sign's ruler somewhere concrete so the lookup has a target.
        const chart = makeChart({
          cuspSigns: HOUSES.map((h) => (h === house ? cuspSign : SIGNS[(h - 1) % 12])),
          placements: { [ruler.rulerId]: { sign: "Capricorn", house: 11 } },
        });
        const rp = composeRulerPlacement(cuspSign, house, chart);
        expect(rp).not.toBeNull();
        assertRealText(rp!.synthesis, `rulerPlacement ${cuspSign} on house ${house}`);
      }
    }
  });

  it("every ruling planet reads in all 12 signs and all 12 houses", () => {
    // Drive one representative cusp sign per ruler, then move that ruler through every sign/house.
    const rulerToCusp: Record<string, string> = {};
    for (const sign of SIGNS) rulerToCusp[SIGN_RULERS[sign].rulerId] = sign;

    for (const [rulerId, cuspSign] of Object.entries(rulerToCusp)) {
      for (const rulerSign of SIGNS) {
        for (const rulerHouse of HOUSES) {
          const chart = makeChart({
            cuspSigns: HOUSES.map((h) => (h === 2 ? cuspSign : SIGNS[(h - 1) % 12])),
            placements: { [rulerId]: { sign: rulerSign, house: rulerHouse } },
          });
          const rp = composeRulerPlacement(cuspSign, 2, chart);
          expect(rp).not.toBeNull();
          assertRealText(rp!.synthesis, `ruler ${rulerId} in ${rulerSign} in house ${rulerHouse}`);
        }
      }
    }
  });
});

// ── House deep dives: empty, single-planet, multi-planet ─────────────────────

describe("house deep dives cover every occupancy pattern", () => {
  it("all 12 houses compose with each of the 12 cusp signs, empty", () => {
    for (const house of HOUSES) {
      for (const cuspSign of SIGNS) {
        // Push every planet out of the target house so it's genuinely empty.
        const placements: Record<string, { sign: string; house: number }> = {};
        for (const p of CORE_PLANETS) placements[p.id] = { sign: "Leo", house: house === 1 ? 2 : 1 };
        const chart = makeChart({
          cuspSigns: HOUSES.map((h) => (h === house ? cuspSign : SIGNS[(h - 1) % 12])),
          placements,
        });
        const dd = composeHouseDeepDive(house, chart);
        expect(dd).not.toBeNull();
        assertRealText(dd!.rulerLine, `empty house ${house} cusp ${cuspSign} rulerLine`);
        assertRealText(dd!.bettysTake, `empty house ${house} cusp ${cuspSign} bettysTake`);
        expect(dd!.rulerPlacement).not.toBeNull();
      }
    }
  });

  it("houses with one planet and with multiple planets both compose", () => {
    for (const house of HOUSES) {
      // one planet
      const one = makeChart({ placements: { mars: { sign: "Aries", house } } });
      const ddOne = composeHouseDeepDive(house, one);
      expect(ddOne).not.toBeNull();
      assertRealText(ddOne!.rootPattern, `single-planet house ${house} rootPattern`);

      // multiple planets
      const many = makeChart({
        placements: {
          mars: { sign: "Aries", house },
          venus: { sign: "Taurus", house },
          jupiter: { sign: "Sagittarius", house },
        },
      });
      const ddMany = composeHouseDeepDive(house, many);
      expect(ddMany).not.toBeNull();
      assertRealText(ddMany!.rootPattern, `multi-planet house ${house} rootPattern`);
    }
  });
});

// ── Life areas across every season ───────────────────────────────────────────

describe("life areas compose for every season", () => {
  it("every life area produces a complete reading in all 12 seasons", () => {
    for (const area of LIFE_AREAS) {
      for (const season of SEASONS) {
        const chart = makeChart({ name: "Audit Member" });
        const reading = composeLifeArea(area.id, chart, season, null, null);
        expect(reading).not.toBeNull();
        assertRealText(reading!.signature, `${area.id} signature in ${season.sign}`);
        assertRealText(reading!.whatThisIsAbout, `${area.id} whatThisIsAbout in ${season.sign}`);
        assertRealText(reading!.inYourChart, `${area.id} inYourChart in ${season.sign}`);
        assertRealText(reading!.bettysTake, `${area.id} bettysTake in ${season.sign}`);
        assertRealText(reading!.blindSpot, `${area.id} blindSpot in ${season.sign}`);
        assertRealText(reading!.rootPattern, `${area.id} rootPattern in ${season.sign}`);
        assertRealText(reading!.stretchMove, `${area.id} stretchMove in ${season.sign}`);
        expect(reading!.affirmations.length).toBeGreaterThan(0);
        expect(reading!.protocolDays.length).toBeGreaterThan(0);
        expect(reading!.proofMarkers.length).toBeGreaterThan(0);
        // the signature must carry the full chain, not just a sign name
        expect(reading!.rulerPlacement).not.toBeNull();
        // the deep synthesis (the 80%) must be real multi-paragraph interpretation
        expect(reading!.deepSynthesis.length).toBeGreaterThanOrEqual(3);
        for (let i = 0; i < reading!.deepSynthesis.length; i++) {
          assertRealText(reading!.deepSynthesis[i], `${area.id} deepSynthesis[${i}] in ${season.sign}`, 60);
        }
        assertRealText(reading!.quickContext.house, `${area.id} quickContext.house`);
        assertRealText(reading!.quickContext.cuspSign, `${area.id} quickContext.cuspSign`);
        assertRealText(reading!.quickContext.ruler, `${area.id} quickContext.ruler`);
        // the recipe framework must be fully realised: a prioritisation lead, at least one house
        // chain, and woven synthesis, with every named planet layer producing real interpretation
        assertRealText(reading!.priorityLead, `${area.id} priorityLead in ${season.sign}`, 40);
        expect(reading!.recipeHouses.length).toBeGreaterThanOrEqual(1);
        for (const c of reading!.recipeHouses) {
          expect(c.cuspSign).toBeTruthy();
        }
        expect(reading!.frameworkSynthesis.length).toBeGreaterThanOrEqual(1);
        for (let i = 0; i < reading!.frameworkSynthesis.length; i++) {
          assertRealText(reading!.frameworkSynthesis[i], `${area.id} frameworkSynthesis[${i}] in ${season.sign}`, 60);
        }
        for (const p of reading!.planetLayers) {
          assertRealText(p.synthesis, `${area.id} planetLayer ${p.id} in ${season.sign}`, 40);
        }
        for (const p of reading!.pointLayers) {
          assertRealText(p.synthesis, `${area.id} pointLayer ${p.id} in ${season.sign}`, 40);
        }
      }
    }
  });

  it("life-area signature works with an empty primary house and a crowded one", () => {
    const money = LIFE_AREAS.find((a) => a.id === "money")!;
    const primary = money.houseNumbers[0];
    // empty: move every planet out of the money house
    const emptyPlacements: Record<string, { sign: string; house: number }> = {};
    for (const p of CORE_PLANETS) emptyPlacements[p.id] = { sign: "Leo", house: primary === 1 ? 2 : 1 };
    const emptyChart = makeChart({ placements: emptyPlacements });
    const emptyReading = composeLifeArea("money", emptyChart, SEASONS[4], null, null);
    assertRealText(emptyReading!.signature, "money signature, empty 2nd house");

    // crowded
    const crowded = makeChart({
      placements: {
        jupiter: { sign: "Aries", house: primary },
        venus: { sign: "Taurus", house: primary },
        mercury: { sign: "Gemini", house: primary },
      },
    });
    const crowdedReading = composeLifeArea("money", crowded, SEASONS[4], null, null);
    assertRealText(crowdedReading!.signature, "money signature, crowded 2nd house");
  });
});

// ── Aspect interpretation across every aspect type ───────────────────────────

describe("aspect interpretation covers every aspect type", () => {
  const ASPECT_TYPES = ["conjunction", "sextile", "square", "trine", "opposition"];
  it("each aspect type between two core planets produces real text", () => {
    for (const type of ASPECT_TYPES) {
      const text = interpretAspect("Mars", "Saturn", type, { sign1: "Aries", sign2: "Capricorn", orb: 1.5 });
      assertRealText(text, `aspect ${type}`);
    }
  });
});

// ── Nodal axis readings across every sign and every chart rotation ───────────

describe("nodal ingress readings cover both ends of the axis", () => {
  // A nodal ingress can land in any of the 12 signs, and that sign can fall in any of the
  // member's 12 houses depending on their rising sign. Every one of those 144 combinations has to
  // resolve to a complete reading, because this event only comes round once every 18 months.
  it("every north node sign against every chart rotation composes fully", () => {
    for (const sign of SIGNS) {
      for (let rotation = 0; rotation < 12; rotation++) {
        const cuspSigns = HOUSES.map((h) => SIGNS[(h - 1 + rotation) % 12]);
        const chart = makeChart({ cuspSigns });
        // the node always ingresses at the very end of a sign, it travels backwards
        const reading = composeLunation(
          { type: "node_ingress", date: "2026-01-11", sign, degree: 29, planet: "North Node" },
          chart,
        );
        const where = `node ingress in ${sign}, rotation ${rotation}`;

        assertRealText(reading.title, `${where} title`, 15);
        assertRealText(reading.whatThisIs, `${where} whatThisIs`, 200);
        assertRealText(reading.bettysTake, `${where} bettysTake`, 300);
        assertRealText(reading.theMove, `${where} theMove`, 100);
        expect(reading.moveOptions?.length).toBe(5);
        for (const option of reading.moveOptions!) {
          assertRealText(option, `${where} move option`, 30);
        }
        assertRealText(reading.journalPrompt, `${where} journalPrompt`, 40);
        assertRealText(reading.affirmation, `${where} affirmation`, 40);

        // The teaching layer: what the nodes are, then what each sign of this specific axis means
        // for everyone, before any personal interpretation happens. 4 generic node sections, then
        // 6 covering the two signs collectively, then the bridge into her own chart.
        expect(reading.primer?.length).toBe(11);
        for (const section of reading.primer!) {
          assertRealText(section.heading, `${where} primer heading`, 10);
          assertRealText(section.body, `${where} primer "${section.heading}"`, 200);
        }

        // both ends of the axis get read, never the north node alone
        expect(reading.chartParagraphs?.length).toBe(5);
        for (const para of reading.chartParagraphs!) {
          assertRealText(para, `${where} chart paragraph`, 150);
        }

        assertRealText(reading.degreeNote?.body, `${where} anaretic note`, 400);

        // Questions are punctuated as questions. They were shipping as full stops, which read as
        // flat instructions rather than as something to actually sit with, and it was inconsistent
        // with every other reading type in moon-content.ts.
        for (const question of reading.moveQuestions!) {
          expect(question.endsWith("?")).toBe(true);
        }
        expect(reading.journalPrompt.endsWith("?")).toBe(true);

        expect(reading.moveQuestions?.length).toBe(5);
        for (const question of reading.moveQuestions!) {
          assertRealText(question, `${where} move question`, 40);
        }
      }
    }
  });

  it("names the opposite house explicitly, so the axis reads as an axis", () => {
    for (const sign of SIGNS) {
      const chart = makeChart();
      const northHouse = houseForSign(sign, chart.houses.map((h) => h.longitude));
      const southHouse = ((northHouse + 5) % 12) + 1;
      const reading = composeLunation(
        { type: "node_ingress", date: "2026-01-11", sign, degree: 29, planet: "North Node" },
        chart,
      );
      const chartText = reading.chartParagraphs!.join(" ");
      expect(chartText).toContain(`${ordinalHouse(northHouse)} house of ${HOUSE_MEANINGS[northHouse - 1].title}`);
      expect(chartText).toContain(`${ordinalHouse(southHouse)} house of ${HOUSE_MEANINGS[southHouse - 1].title}`);
      // the south node is never framed as something to abandon
      expect(chartText).toContain("What you keep");
    }
  });

  it("holds the house style rules: no em dashes, no rhetorical questions in the prose", () => {
    for (const sign of SIGNS) {
      const reading = composeLunation(
        { type: "node_ingress", date: "2026-01-11", sign, degree: 29, planet: "North Node" },
        makeChart(),
      );
      const prose = [
        reading.whatThisIs,
        ...reading.primer!.map((s) => s.body),
        ...reading.chartParagraphs!,
        reading.degreeNote!.body,
        reading.bettysTake,
        reading.theMove,
        reading.affirmation,
      ].join(" ");
      expect(prose).not.toMatch(/[—–]/);
      expect(prose).not.toMatch(/\?/);
    }
  });
});

// ── Lunation and eclipse readings: the five personalised sections ────────────

describe("every lunation carries the personalised sections and exercise", () => {
  const MOON_TYPES = ["new_moon", "full_moon", "retrograde_start", "retrograde_end"] as const;

  it("new moons, full moons and retrogrades compose brings-up, look-out-for, shadow and an exercise", () => {
    for (const type of MOON_TYPES) {
      for (const sign of SIGNS) {
        for (let rotation = 0; rotation < 12; rotation++) {
          const cuspSigns = HOUSES.map((h) => SIGNS[(h - 1 + rotation) % 12]);
          const chart = makeChart({ cuspSigns });
          const reading = composeLunation(
            { type, date: "2026-08-01", sign, degree: 12, planet: type.startsWith("retrograde") ? "Mercury" : undefined },
            chart,
          );
          const where = `${type} in ${sign}, rotation ${rotation}`;
          assertRealText(reading.bringsUp, `${where} bringsUp`, 120);
          assertRealText(reading.lookOutFor, `${where} lookOutFor`, 120);
          assertRealText(reading.shadow, `${where} shadow`, 100);
          assertRealText(reading.exercise?.title, `${where} exercise title`, 8);
          assertRealText(reading.exercise?.intro, `${where} exercise intro`, 40);
          expect(reading.exercise?.steps.length).toBe(3);
          for (const step of reading.exercise!.steps) assertRealText(step, `${where} exercise step`, 40);
        }
      }
    }
  });
});

describe("eclipse readings add the nodal-axis depth", () => {
  it("solar and lunar eclipses on either node end compose fully", () => {
    for (const type of ["solar_eclipse", "lunar_eclipse"] as const) {
      for (const nodeEnd of ["north", "south"] as const) {
        for (const sign of SIGNS) {
          for (let rotation = 0; rotation < 12; rotation++) {
            const cuspSigns = HOUSES.map((h) => SIGNS[(h - 1 + rotation) % 12]);
            const chart = makeChart({ cuspSigns });
            const reading = composeLunation({ type, date: "2026-08-12", sign, degree: 20, nodeEnd }, chart);
            const where = `${type} in ${sign} on ${nodeEnd} node, rotation ${rotation}`;
            // routed to the dedicated eclipse composer, not the generic lunation one
            expect(reading.title).toContain("eclipse");
            expect(reading.primerTitle).toBe("the eclipse, explained");
            expect(reading.primer?.length).toBe(4);
            for (const s of reading.primer!) {
              assertRealText(s.heading, `${where} primer heading`, 10);
              assertRealText(s.body, `${where} primer "${s.heading}"`, 150);
            }
            expect(reading.chartParagraphs?.length).toBe(4);
            for (const p of reading.chartParagraphs!) assertRealText(p, `${where} chart paragraph`, 150);
            assertRealText(reading.bringsUp, `${where} bringsUp`, 120);
            assertRealText(reading.lookOutFor, `${where} lookOutFor`, 120);
            assertRealText(reading.shadow, `${where} shadow`, 100);
            assertRealText(reading.bettysTake, `${where} bettysTake`, 200);
            expect(reading.exercise?.steps.length).toBe(3);
            for (const step of reading.exercise!.steps) assertRealText(step, `${where} exercise step`, 40);
            assertRealText(reading.journalPrompt, `${where} journalPrompt`, 40);
            expect(reading.journalPrompt.endsWith("?")).toBe(true);
          }
        }
      }
    }
  });

  it("holds the house style rules across lunations and eclipses: no em dashes, no rhetorical questions in prose", () => {
    const cases = [
      { type: "new_moon" as const, extra: {} as Record<string, unknown> },
      { type: "full_moon" as const, extra: {} as Record<string, unknown> },
      { type: "solar_eclipse" as const, extra: { nodeEnd: "north" } },
      { type: "solar_eclipse" as const, extra: { nodeEnd: "south" } },
      { type: "lunar_eclipse" as const, extra: { nodeEnd: "north" } },
      { type: "lunar_eclipse" as const, extra: { nodeEnd: "south" } },
    ];
    for (const { type, extra } of cases) {
      for (const sign of SIGNS) {
        const reading = composeLunation({ type, date: "2026-08-12", sign, degree: 20, ...extra }, makeChart());
        const prose = [
          reading.whatThisIs,
          ...(reading.primer?.map((s) => s.body) ?? []),
          ...(reading.chartParagraphs ?? []),
          reading.bringsUp,
          reading.lookOutFor,
          reading.shadow,
          reading.bettysTake,
          reading.exercise?.intro,
          ...(reading.exercise?.steps ?? []),
        ]
          .filter(Boolean)
          .join(" ");
        expect(prose).not.toMatch(/[—–]/);
        expect(prose).not.toMatch(/\?/);
      }
    }
  });
});
