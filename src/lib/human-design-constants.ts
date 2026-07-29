// Human Design reference data (the fixed Jovian Archive / Ra Uru Hu bodygraph).
//
// This is deterministic reference data, not interpretation. Every value here was
// cross-verified 2026-07-29 against two independent open-source engines
// (natalengine + free-human-design): the 64 gate->centre assignments and the 36
// channels matched byte-for-byte across both. The hobby `human-design-py` engine
// had bugs in exactly this layer (e.g. gate 28 in two centres), so we did NOT
// use it as a source. See hd-research/HANDOFF.md for the validation record.
//
// The astronomy lives in human-design.ts (built on the same swisseph as
// astrology.ts). This file is only the wheel + graph definitions it reads.

export type CenterKey =
  | "head"
  | "ajna"
  | "throat"
  | "g"
  | "heart"
  | "sacral"
  | "solarplexus"
  | "spleen"
  | "root";

// The nine centres, top to bottom of the bodygraph.
export const CENTERS: CenterKey[] = [
  "head",
  "ajna",
  "throat",
  "g",
  "heart",
  "sacral",
  "solarplexus",
  "spleen",
  "root",
];

export const CENTER_LABELS: Record<CenterKey, string> = {
  head: "Head",
  ajna: "Ajna",
  throat: "Throat",
  g: "G (Identity)",
  heart: "Heart (Ego / Will)",
  sacral: "Sacral",
  solarplexus: "Solar Plexus",
  spleen: "Spleen",
  root: "Root",
};

// Motor centres: the energy sources. A motor connected to the Throat is what
// distinguishes a Manifestor/Manifesting Generator from a Projector.
export const MOTOR_CENTERS: CenterKey[] = ["sacral", "heart", "solarplexus", "root"];

// The gate wheel. Ecliptic longitude maps to a gate by walking this sequence
// starting at WHEEL_START_DEG. Gate 25 begins at 358.25 deg (28 deg 15' Pisces);
// each gate spans 360/64 = 5.625 deg and each of its 6 lines spans 0.9375 deg.
export const WHEEL_START_DEG = 358.25;
export const GATE_ARC = 360 / 64; // 5.625
export const LINE_ARC = GATE_ARC / 6; // 0.9375

export const GATE_WHEEL: number[] = [
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53,
  62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44,
  1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55,
  37, 63, 22, 36,
];

// Gate -> centre. All 64 gates present exactly once (asserted in tests).
export const GATE_CENTER: Record<number, CenterKey> = {
  1: "g", 2: "g", 3: "sacral", 4: "ajna", 5: "sacral", 6: "solarplexus",
  7: "g", 8: "throat", 9: "sacral", 10: "g", 11: "ajna", 12: "throat",
  13: "g", 14: "sacral", 15: "g", 16: "throat", 17: "ajna", 18: "spleen",
  19: "root", 20: "throat", 21: "heart", 22: "solarplexus", 23: "throat",
  24: "ajna", 25: "g", 26: "heart", 27: "sacral", 28: "spleen", 29: "sacral",
  30: "solarplexus", 31: "throat", 32: "spleen", 33: "throat", 34: "sacral",
  35: "throat", 36: "solarplexus", 37: "solarplexus", 38: "root", 39: "root",
  40: "heart", 41: "root", 42: "sacral", 43: "ajna", 44: "spleen", 45: "throat",
  46: "g", 47: "ajna", 48: "spleen", 49: "solarplexus", 50: "spleen",
  51: "heart", 52: "root", 53: "root", 54: "root", 55: "solarplexus",
  56: "throat", 57: "spleen", 58: "root", 59: "sacral", 60: "root", 61: "head",
  62: "throat", 63: "head", 64: "head",
};

export const GATE_NAME: Record<number, string> = {
  1: "The Creative", 2: "The Receptive", 3: "Ordering", 4: "Formulization",
  5: "Fixed Rhythms", 6: "Friction", 7: "The Role of Self", 8: "Contribution",
  9: "Focus", 10: "Behavior of Self", 11: "Ideas", 12: "Caution",
  13: "The Listener", 14: "Power Skills", 15: "Extremes", 16: "Skills",
  17: "Opinions", 18: "Correction", 19: "Wanting", 20: "The Now",
  21: "The Hunter", 22: "Openness", 23: "Assimilation", 24: "Rationalization",
  25: "Innocence", 26: "The Trickster", 27: "Caring", 28: "The Player",
  29: "Perseverance", 30: "Recognition of Feelings", 31: "Leading",
  32: "Continuity", 33: "Privacy", 34: "Power", 35: "Change", 36: "Crisis",
  37: "Friendship", 38: "The Fighter", 39: "Provocation", 40: "Aloneness",
  41: "Contraction", 42: "Growth", 43: "Insight", 44: "Coming to Meet",
  45: "Gathering", 46: "Love of Body", 47: "Realization", 48: "Depth",
  49: "Principles", 50: "Values", 51: "Shock", 52: "Stillness",
  53: "Beginnings", 54: "Ambition", 55: "Spirit", 56: "Stimulation",
  57: "Intuition", 58: "Vitality", 59: "Sexuality", 60: "Limitation",
  61: "Mystery", 62: "Details", 63: "Doubt", 64: "Confusion",
};

// The 36 channels as unordered gate pairs (low gate first). The two centres a
// channel connects are derived from GATE_CENTER at runtime so they cannot drift.
export const CHANNEL_PAIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31], [9, 52],
  [10, 20], [10, 34], [10, 57], [11, 56], [12, 22], [13, 33], [16, 48],
  [17, 62], [18, 58], [19, 49], [20, 34], [20, 57], [21, 45], [23, 43],
  [24, 61], [25, 51], [26, 44], [27, 50], [28, 38], [29, 46], [30, 41],
  [32, 54], [34, 57], [35, 36], [37, 40], [39, 55], [42, 53], [47, 64],
];

export const CHANNEL_NAME: Record<string, string> = {
  "1-8": "Inspiration", "2-14": "The Beat", "3-60": "Mutation", "4-63": "Logic",
  "5-15": "Rhythm", "6-59": "Mating", "7-31": "The Alpha", "9-52": "Concentration",
  "10-20": "Awakening", "10-34": "Exploration", "10-57": "Perfected Form",
  "11-56": "Curiosity", "12-22": "Openness", "13-33": "The Prodigal",
  "16-48": "The Wavelength", "17-62": "Acceptance", "18-58": "Judgment",
  "19-49": "Synthesis", "20-34": "Charisma", "20-57": "The Brainwave",
  "21-45": "Money", "23-43": "Structuring", "24-61": "Awareness",
  "25-51": "Initiation", "26-44": "Surrender", "27-50": "Preservation",
  "28-38": "Struggle", "29-46": "Discovery", "30-41": "Recognition",
  "32-54": "Transformation", "34-57": "Power", "35-36": "Transitoriness",
  "37-40": "Community", "39-55": "Emoting", "42-53": "Maturation",
  "47-64": "Abstraction",
};

export const channelKey = (a: number, b: number): string =>
  a < b ? `${a}-${b}` : `${b}-${a}`;
