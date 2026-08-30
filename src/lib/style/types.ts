// The style engine's vocabulary. Every sign, situation and product is described in the same 0-100
// vector space, which is what lets the engine combine placements, apply a situation, and later rank
// real products by cosine similarity against the result.
//
// Architecture (Betty's spec):
//   Rising  = the architecture of the outfit, silhouette, construction, proportion, key pieces.
//   Venus   = the aesthetic layer, colour, fabric, print, detail, jewellery, beauty.
//   Moon    = comfort and what she reaches for repeatedly.
//   Mars    = edge, sex, activewear, night-out energy.
//   Sun     = statement pieces and personal signature.
//   Situation reweights all of the above and nudges individual dimensions.

export const DIMENSIONS = [
  "structure",
  "fluidity",
  "bodyConscious",
  "oversized",
  "minimal",
  "maximal",
  "classic",
  "experimental",
  "romantic",
  "sporty",
  "sensual",
  "polished",
  "casual",
  "feminine",
  "masculine",
  "vintage",
  "futuristic",
  "colourIntensity",
  "printIntensity",
  "texture",
  "glamour",
  "edge",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

/** Every dimension scored 0 to 100. 50 is neutral, not absent. */
export type StyleVector = Record<Dimension, number>;

export const ZODIAC = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export type Sign = (typeof ZODIAC)[number];

export type PlacementKey = "rising" | "venus" | "moon" | "mars" | "sun";

/** A member's style-relevant placements. Only rising and venus are required, because those are the
 *  two the whole system is built on and the two a free chart always produces. */
export interface StylePlacements {
  rising: Sign;
  venus: Sign;
  moon?: Sign;
  mars?: Sign;
  sun?: Sign;
}

// ── colour ─────────────────────────────────────────────────────────────────────
// Colour is its own system rather than five words per sign, because shopping inventory never
// cooperates with a five-colour list. Families carry real hex values so a product's colour metadata
// can be matched numerically, and the tiers let the engine recommend without repeating itself.
export interface ColourSwatch {
  name: string;
  hex: string;
}

export interface ColourSystem {
  /** Strongest recommendation, the colours that always work. */
  hero: ColourSwatch[];
  /** Easy wardrobe colours that carry a whole outfit. */
  supporting: ColourSwatch[];
  /** Accessories and details. */
  accent: ColourSwatch[];
  /** Less obvious, still astrologically compatible, used to stop the edit repeating itself. */
  experimental: ColourSwatch[];
  /** Colour families to downrank in product matching. */
  avoid: string[];
}

// ── helpers ────────────────────────────────────────────────────────────────────
const NEUTRAL = 50;

export const NEUTRAL_VECTOR: StyleVector = Object.fromEntries(
  DIMENSIONS.map((d) => [d, NEUTRAL])
) as StyleVector;

/** Build a vector from partial overrides against a neutral baseline. */
export function vec(overrides: Partial<StyleVector>): StyleVector {
  return { ...NEUTRAL_VECTOR, ...overrides };
}

/** Weighted average of several vectors. Weights need not sum to 1, they are normalised. */
export function blendVectors(parts: { vector: StyleVector; weight: number }[]): StyleVector {
  const total = parts.reduce((sum, p) => sum + p.weight, 0);
  if (total <= 0) return { ...NEUTRAL_VECTOR };
  const out = {} as StyleVector;
  for (const d of DIMENSIONS) {
    out[d] = Math.round(parts.reduce((sum, p) => sum + p.vector[d] * p.weight, 0) / total);
  }
  return out;
}

/** Apply additive nudges from a situation, clamped to 0 to 100. */
export function nudge(vector: StyleVector, deltas: Partial<Record<Dimension, number>>): StyleVector {
  const out = { ...vector };
  for (const [dim, delta] of Object.entries(deltas) as [Dimension, number][]) {
    out[dim] = Math.max(0, Math.min(100, out[dim] + delta));
  }
  return out;
}

/** The dimensions a vector scores highest on, for headline traits and product ranking. */
export function dominantDimensions(vector: StyleVector, count = 5): Dimension[] {
  return [...DIMENSIONS].sort((a, b) => vector[b] - vector[a]).slice(0, count);
}

/** Cosine similarity between two vectors, used to rank products against a member's profile. */
export function similarity(a: StyleVector, b: StyleVector): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const d of DIMENSIONS) {
    dot += a[d] * b[d];
    magA += a[d] * a[d];
    magB += b[d] * b[d];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
