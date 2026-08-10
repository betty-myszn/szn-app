/**
 * Money Blueprint — theme vocabulary, factor mappings and weights.
 *
 * Promoted from lab/ 2026-08-03 after the validation sweep in
 * money-blueprint/engine/test/FINDINGS.md. Architecture is frozen: see money-blueprint/engine/.
 * Pure and deterministic. The engine owns facts, the writer owns voice.
 */


export const THEMES = [
  "worth", "receiving", "visibility", "scarcity", "control", "safety", "overgiving",
  "depth", "autonomy", "legitimacy", "sustainability", "belonging", "power", "expansion",
] as const;
export type Theme = (typeof THEMES)[number];

export const CONTRADICTION_PAIRS: Array<[Theme, Theme]> = [
  ["autonomy", "safety"],
  ["visibility", "belonging"],
  ["expansion", "control"],
  ["depth", "legitimacy"],
  ["receiving", "overgiving"],
  ["power", "safety"],
];

export type TW = Array<[Theme, number]>;

export const PLANET_THEMES: Record<string, TW> = {
  venus: [["worth", 1.0], ["receiving", 0.9], ["belonging", 0.4]],
  saturn: [["scarcity", 0.9], ["worth", 0.8], ["legitimacy", 0.6], ["safety", 0.5]],
  jupiter: [["expansion", 1.0], ["receiving", 0.6]],
  pluto: [["power", 1.0], ["control", 0.8], ["depth", 0.7]],
  chiron: [["legitimacy", 0.9], ["worth", 0.7], ["depth", 0.5]],
  mars: [["autonomy", 0.8], ["visibility", 0.5], ["expansion", 0.4]],
  mercury: [["legitimacy", 0.6], ["visibility", 0.4]],
  moon: [["safety", 1.0], ["receiving", 0.5], ["belonging", 0.4]],
  sun: [["visibility", 0.7], ["worth", 0.5]],
  lilith: [["visibility", 0.9], ["autonomy", 0.7], ["belonging", 0.4]],
  north_node: [["expansion", 0.5]],
  south_node: [["control", 0.6], ["safety", 0.5]],
  part_of_fortune: [["receiving", 0.6], ["expansion", 0.4]],
};

export const HOUSE_THEMES: Record<number, TW> = {
  2: [["worth", 1.0], ["safety", 0.6], ["scarcity", 0.5]],
  6: [["sustainability", 1.0], ["safety", 0.4]],
  8: [["depth", 1.0], ["power", 0.8], ["control", 0.5], ["receiving", 0.5]],
  10: [["visibility", 1.0], ["legitimacy", 0.7]],
  11: [["belonging", 1.0], ["expansion", 0.6], ["visibility", 0.4]],
};

export const ELEMENT_THEMES: Record<string, TW> = {
  fire: [["expansion", 0.3], ["autonomy", 0.3], ["visibility", 0.2]],
  earth: [["safety", 0.3], ["scarcity", 0.2], ["sustainability", 0.2]],
  air: [["belonging", 0.3], ["legitimacy", 0.2]],
  water: [["depth", 0.3], ["receiving", 0.2], ["safety", 0.2]],
};

export const ELEMENT: Record<string, string> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Cancer: "water", Scorpio: "water", Pisces: "water",
};

export const SIGN_RULER: Record<string, string> = {
  Aries: "mars", Taurus: "venus", Gemini: "mercury", Cancer: "moon", Leo: "sun",
  Virgo: "mercury", Libra: "venus", Scorpio: "pluto", Sagittarius: "jupiter",
  Capricorn: "saturn", Aquarius: "uranus", Pisces: "neptune",
};

// HD ---------------------------------------------------------------------------

export const OPEN_CENTRE_THEMES: Record<string, TW> = {
  heart: [["worth", 1.0], ["legitimacy", 0.6]],
  solarplexus: [["belonging", 0.9], ["overgiving", 0.7]],
  sacral: [["sustainability", 1.0], ["overgiving", 0.7]],
  root: [["sustainability", 0.8], ["safety", 0.6]],
  spleen: [["safety", 0.9], ["scarcity", 0.6]],
  g: [["belonging", 0.7], ["autonomy", 0.5]],
  throat: [["visibility", 0.9]],
  ajna: [["legitimacy", 0.9]],
  head: [["legitimacy", 0.7]],
};

// Defined centres are reliable assets: the gift side of the same axis.
export const DEFINED_CENTRE_THEMES: Record<string, TW> = {
  heart: [["worth", 0.8], ["power", 0.4]],
  solarplexus: [["depth", 0.6], ["receiving", 0.4]],
  sacral: [["sustainability", 0.9], ["expansion", 0.4]],
  root: [["sustainability", 0.7]],
  spleen: [["safety", 0.8]],
  g: [["autonomy", 0.6], ["visibility", 0.4]],
  throat: [["visibility", 1.0]],
  ajna: [["legitimacy", 0.8]],
  head: [["legitimacy", 0.5]],
};

/** Money-relevant channels from engine/HD-ENGINE.md, with circuit and themes. */
export const MONEY_CHANNELS: Record<string, { name: string; circuit: Circuit; themes: TW }> = {
  "21-45": { name: "Money Line", circuit: "tribal", themes: [["control", 1.0], ["power", 0.8], ["worth", 0.6]] },
  "26-44": { name: "Surrender", circuit: "tribal", themes: [["visibility", 0.8], ["power", 0.6], ["worth", 0.5]] },
  "37-40": { name: "Community", circuit: "tribal", themes: [["belonging", 1.0], ["overgiving", 0.7], ["safety", 0.5]] },
  "32-54": { name: "Transformation", circuit: "tribal", themes: [["expansion", 0.9], ["legitimacy", 0.6], ["scarcity", 0.4]] },
  "19-49": { name: "Synthesis", circuit: "tribal", themes: [["belonging", 0.8], ["safety", 0.6], ["overgiving", 0.5]] },
  "16-48": { name: "Wavelength", circuit: "collective", themes: [["legitimacy", 1.0], ["depth", 0.7]] },
  "11-56": { name: "Curiosity", circuit: "collective", themes: [["visibility", 0.8], ["expansion", 0.6]] },
  "35-36": { name: "Transitoriness", circuit: "collective", themes: [["expansion", 0.9], ["sustainability", 0.5]] },
  "29-46": { name: "Discovery", circuit: "collective", themes: [["expansion", 0.8], ["sustainability", 0.5]] },
  "5-15": { name: "Rhythm", circuit: "collective", themes: [["sustainability", 1.0], ["safety", 0.5]] },
  "1-8": { name: "Inspiration", circuit: "individual", themes: [["visibility", 1.0], ["autonomy", 0.7]] },
  "23-43": { name: "Structuring", circuit: "individual", themes: [["autonomy", 0.9], ["legitimacy", 0.7], ["depth", 0.5]] },
  "20-34": { name: "Charisma", circuit: "individual", themes: [["sustainability", 0.8], ["autonomy", 0.6]] },
  "24-61": { name: "Awareness", circuit: "individual", themes: [["depth", 0.8], ["autonomy", 0.5]] },
  "10-34": { name: "Exploration", circuit: "individual", themes: [["autonomy", 0.9]] },
  "10-57": { name: "Perfected Form", circuit: "individual", themes: [["safety", 0.7], ["autonomy", 0.5]] },
  "34-57": { name: "Power", circuit: "individual", themes: [["power", 0.8], ["sustainability", 0.5]] },
  "12-22": { name: "Openness", circuit: "individual", themes: [["visibility", 0.7], ["belonging", 0.5]] },
  "39-55": { name: "Emoting", circuit: "individual", themes: [["depth", 0.7], ["autonomy", 0.5]] },
  "30-41": { name: "Recognition", circuit: "collective", themes: [["expansion", 0.8], ["receiving", 0.5]] },
  "13-33": { name: "Prodigal", circuit: "collective", themes: [["legitimacy", 0.7], ["belonging", 0.5]] },
  "7-31": { name: "Alpha", circuit: "collective", themes: [["visibility", 0.9], ["legitimacy", 0.6]] },
  "17-62": { name: "Acceptance", circuit: "collective", themes: [["legitimacy", 0.8]] },
  "9-52": { name: "Concentration", circuit: "collective", themes: [["sustainability", 0.8]] },
  "18-58": { name: "Judgement", circuit: "collective", themes: [["legitimacy", 0.8]] },
  "28-38": { name: "Struggle", circuit: "individual", themes: [["depth", 0.9], ["autonomy", 0.6]] },
  "3-60": { name: "Mutation", circuit: "individual", themes: [["autonomy", 0.8], ["expansion", 0.4]] },
  "2-14": { name: "The Beat", circuit: "individual", themes: [["power", 0.8], ["autonomy", 0.5]] },
  "6-59": { name: "Mating", circuit: "tribal", themes: [["belonging", 0.8], ["depth", 0.5]] },
  "27-50": { name: "Preservation", circuit: "tribal", themes: [["overgiving", 1.0], ["safety", 0.6]] },
  "4-63": { name: "Logic", circuit: "collective", themes: [["legitimacy", 0.8]] },
  "47-64": { name: "Abstraction", circuit: "collective", themes: [["legitimacy", 0.6], ["depth", 0.5]] },
  "25-51": { name: "Initiation", circuit: "individual", themes: [["autonomy", 0.8], ["power", 0.6]] },
  "42-53": { name: "Maturation", circuit: "collective", themes: [["sustainability", 0.8]] },
  "20-57": { name: "Brainwave", circuit: "individual", themes: [["safety", 0.7], ["visibility", 0.4]] },
};

export type Circuit = "tribal" | "collective" | "individual";

export const CIRCUIT_THEMES: Record<Circuit, TW> = {
  tribal: [["belonging", 0.8], ["control", 0.6], ["safety", 0.5]],
  collective: [["visibility", 0.7], ["legitimacy", 0.7], ["expansion", 0.5]],
  individual: [["autonomy", 1.0], ["visibility", 0.6], ["depth", 0.5]],
};

export const TYPE_THEMES: Record<string, TW> = {
  Manifestor: [["autonomy", 1.0], ["visibility", 0.5]],
  Generator: [["sustainability", 1.0], ["safety", 0.4]],
  "Manifesting Generator": [["sustainability", 0.9], ["autonomy", 0.6]],
  Projector: [["legitimacy", 1.0], ["visibility", 0.6], ["sustainability", 0.5]],
  Reflector: [["belonging", 0.9], ["safety", 0.8], ["sustainability", 0.5]],
};


export const W = {
  // astrology
  planetBase: 1.0,
  inMoneyHouse: 1.0,
  rulesMoneyHouse: 1.5,
  chartRuler: 1.0,
  stellium: 1.0,
  retrograde: 0.5,
  aspectOrbTight: 3.0, // <=1
  aspectOrbMid: 2.0, // <=3
  aspectOrbWide: 1.0, // <=6
  aspectHardMult: 1.5,
  aspectRulerMult: 1.5,
  // human design (engine/HD-ENGINE.md)
  channel: 3.0,
  circuit: 2.5,
  authority: 2.0,
  type: 2.0,
  openCentre: 1.8,
  definedCentre: 1.8,
  cross: 1.8,
  definition: 1.5,
  hangingGate: 1.2,
  profileLine: 1.0,
  bareGate: 0.5,
};
