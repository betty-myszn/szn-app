// The recommendation engine. Combines placements into a single style vector, applies a situation,
// and produces both a human-readable look and the machine-readable attributes a product ranker
// needs. This is the piece that makes 144 combinations x 15 situations work without anyone writing
// two thousand pages.

import {
  DIMENSIONS,
  NEUTRAL_VECTOR,
  dominantDimensions,
  similarity,
  type ColourSwatch,
  type Dimension,
  type PlacementKey,
  type Sign,
  type StylePlacements,
  type StyleVector,
} from "./types";
import { SIGN_VECTORS } from "./signs";
import { RISING_ARCHITECTURE, type RisingArchitecture } from "./rising";
import { VENUS_AESTHETIC, type VenusAesthetic } from "./venus";
import { BASE_WEIGHTS, SITUATIONS, situationById, type SituationDef } from "./situations";
import { PRODUCTS, productsForSeason, affiliateWrap, type Product } from "./catalogue";

// Each placement has a job, so it speaks loudly to the dimensions it owns and quietly elsewhere.
// Without this, five placements average into mush and every chart starts looking the same.
const OWNED: Record<PlacementKey, Dimension[]> = {
  rising: ["structure", "fluidity", "oversized", "bodyConscious", "minimal", "maximal", "polished", "classic", "experimental", "masculine"],
  venus: ["colourIntensity", "printIntensity", "texture", "romantic", "sensual", "glamour", "feminine", "vintage", "futuristic"],
  moon: ["casual", "fluidity", "texture", "romantic"],
  mars: ["edge", "sporty", "bodyConscious", "sensual"],
  sun: ["glamour", "maximal", "colourIntensity"],
};

/** How much a placement is heard on a dimension it does not own. */
const OFF_DUTY = 0.25;

function emphasis(placement: PlacementKey, dimension: Dimension): number {
  return OWNED[placement].includes(dimension) ? 1 : OFF_DUTY;
}

export interface StyleProfileOptions {
  situationId?: string;
}

export interface OutfitRecommendation {
  /** One-line assembled look. */
  look: string;
  pieces: string[];
  palette: ColourSwatch[];
  materials: string[];
  details: string[];
  jewellery: string;
  metals: string;
}

export interface StyleProfile {
  placements: StylePlacements;
  situation: SituationDef;
  /** The final weighted vector, after situation reweighting and nudges. */
  vector: StyleVector;
  /** Effective placement weights for this situation, for display and debugging. */
  weights: Record<PlacementKey, number>;
  topTraits: Dimension[];
  architecture: RisingArchitecture;
  aesthetic: VenusAesthetic;
  outfit: OutfitRecommendation;
  /** Attributes a product ranker should push down. */
  downrank: string[];
  brief: string;
}

/**
 * Weighted, per-dimension blend of every placement present, plus any archetypal influence the
 * situation pulls in, then the situation's own nudges.
 */
function buildVector(placements: StylePlacements, situation: SituationDef): {
  vector: StyleVector;
  weights: Record<PlacementKey, number>;
} {
  const weights = { ...BASE_WEIGHTS, ...situation.weights } as Record<PlacementKey, number>;

  const present: { key: PlacementKey; sign: Sign; weight: number }[] = [];
  for (const key of Object.keys(weights) as PlacementKey[]) {
    const sign = placements[key];
    if (sign) present.push({ key, sign, weight: weights[key] });
  }

  const out = {} as StyleVector;
  for (const dim of DIMENSIONS) {
    let weighted = 0;
    let total = 0;
    for (const p of present) {
      const w = p.weight * emphasis(p.key, dim);
      weighted += SIGN_VECTORS[p.sign][dim] * w;
      total += w;
    }
    // Archetypal influence, e.g. Leo at a party, mixed in as an extra voice.
    for (const inf of situation.influence ?? []) {
      weighted += SIGN_VECTORS[inf.sign][dim] * inf.weight;
      total += inf.weight;
    }
    out[dim] = total > 0 ? Math.round(weighted / total) : NEUTRAL_VECTOR[dim];
  }

  // Situation nudges, clamped.
  for (const [dim, delta] of Object.entries(situation.nudges) as [Dimension, number][]) {
    out[dim] = Math.max(0, Math.min(100, out[dim] + delta));
  }

  return { vector: out, weights };
}

/** Colours for this situation, drawn from the tiers it leads with. */
function paletteFor(aesthetic: VenusAesthetic, situation: SituationDef): ColourSwatch[] {
  const picked: ColourSwatch[] = [];
  for (const tier of situation.colourTiers) {
    picked.push(...aesthetic.colour[tier]);
  }
  return picked.slice(0, 5);
}

/** Assemble the actual look from the rising's key pieces, dressed in the Venus layer. */
function buildOutfit(
  architecture: RisingArchitecture,
  aesthetic: VenusAesthetic,
  situation: SituationDef,
  vector: StyleVector
): OutfitRecommendation {
  const kp = architecture.keyPieces;
  const palette = paletteFor(aesthetic, situation);
  const lead = palette[0]?.name ?? aesthetic.colour.hero[0].name;
  const active = situation.focus === "active";
  const material = active ? "technical performance fabric" : aesthetic.materials[0];
  const detail = active ? aesthetic.colour.hero[0].name + " as the only colour decision" : aesthetic.details[0];
  // The metals field is written as a sentence, so take its leading clause for inline use.
  const metal = architecture.metals.split(",")[0];

  const tier = situation.formality;
  let pieces: string[];
  if (situation.focus === "active") {
    // Activewear takes the rising's proportion, not its formal pieces, and never Venus's silk.
    pieces = [kp.active, kp.outerwear.casual, kp.shoes.casual];
  } else if (situation.focus === "dress") {
    pieces = [kp.dresses[tier], kp.outerwear[tier], kp.shoes[tier], kp.bags[tier]];
  } else {
    pieces = [kp.tops[tier], kp.bottoms[tier], kp.outerwear[tier], kp.shoes[tier], kp.bags[tier]];
  }

  const glam = vector.glamour >= 65 ? " Let one piece do something showy." : "";
  const look = `${pieces.join(" + ")}, in ${lead}, in ${material}, finished with ${detail} and ${metal}.${glam}`;

  return {
    look,
    pieces,
    palette,
    materials: active ? ["technical performance fabric", "compression knit"] : aesthetic.materials.slice(0, 3),
    details: active ? ["function first", "nothing that needs adjusting"] : aesthetic.details.slice(0, 3),
    jewellery: aesthetic.jewellery,
    metals: architecture.metals,
  };
}

function buildBrief(
  architecture: RisingArchitecture,
  aesthetic: VenusAesthetic,
  situation: SituationDef,
  weights: Record<PlacementKey, number>
): string {
  const risingLed = (weights.rising ?? 0) >= (weights.venus ?? 0);
  const driver = risingLed
    ? `your rising leads here, so build it on ${architecture.silhouette}, with ${architecture.proportion}`
    : `your Venus leads here, so start from what you actually want to wear, ${aesthetic.vibe}`;
  const second = risingLed
    ? `Your Venus still owns the colour, the fabric and the detail, which is what stops correct turning into forgettable.`
    : `Your rising still sets the shape underneath, ${architecture.silhouette}, which is what stops comfortable turning into careless.`;
  return `${situation.brief}, and ${driver}. ${second}`;
}

/**
 * The full profile for a set of placements in a given situation. Defaults to everyday.
 * Returns null if the rising or Venus sign is unrecognised, so a partial chart never renders broken.
 */
export function composeStyleProfile(
  placements: StylePlacements,
  options: StyleProfileOptions = {}
): StyleProfile | null {
  const architecture = RISING_ARCHITECTURE[placements.rising];
  const aesthetic = VENUS_AESTHETIC[placements.venus];
  if (!architecture || !aesthetic) return null;

  const situation = situationById(options.situationId ?? "everyday") ?? SITUATIONS[0];
  const { vector, weights } = buildVector(placements, situation);

  return {
    placements,
    situation,
    vector,
    weights,
    topTraits: dominantDimensions(vector, 6),
    architecture,
    aesthetic,
    outfit: buildOutfit(architecture, aesthetic, situation, vector),
    downrank: Array.from(
      new Set([...architecture.downrank, ...aesthetic.downrank, ...aesthetic.colour.avoid])
    ),
    brief: buildBrief(architecture, aesthetic, situation, weights),
  };
}

/** Every situation for one chart, for the full wardrobe page. */
export function composeAllSituations(placements: StylePlacements): StyleProfile[] {
  return SITUATIONS.map((s) => composeStyleProfile(placements, { situationId: s.id })).filter(
    (p): p is StyleProfile => p !== null
  );
}

/**
 * Score a product (already described as a style vector) against a profile. This is the hook Shop
 * Your Sign plugs into: rank by similarity, then push down anything carrying a downranked attribute.
 */
export function scoreProduct(
  profile: StyleProfile,
  product: { vector: StyleVector; attributes?: string[] }
): number {
  const base = similarity(profile.vector, product.vector);
  const penalised = (product.attributes ?? []).some((a) => profile.downrank.includes(a));
  return penalised ? base * 0.5 : base;
}

// ── seasonal edit ───────────────────────────────────────────────────────────────

export interface RankedProduct {
  product: Product;
  /** Cosine similarity against her profile, 0 to 1. */
  match: number;
  /** Display score. Raw cosine on all-positive vectors always lands in a narrow band near the top,
   *  so every item would read as 95% and the number would tell her nothing. This spreads the pool
   *  across a readable range so the ordering is visible. It is a relative fit within this edit,
   *  not an absolute claim. */
  vibe: number;
  /** Why this piece is in her edit, e.g. "for your Venus in Scorpio". */
  reason: string;
  url: string;
}

/** The dimension a product leads on, used to explain the pick in her own chart's terms. */
function reasonFor(product: Product, profile: StyleProfile): string {
  const rising = profile.placements.rising;
  const venus = profile.placements.venus;
  const aestheticColours = [
    ...profile.aesthetic.colour.hero,
    ...profile.aesthetic.colour.supporting,
    ...profile.aesthetic.colour.accent,
  ].map((s) => s.name.toLowerCase());
  const colourHit = product.colours.some((c) =>
    aestheticColours.some((a) => a.includes(c.toLowerCase()) || c.toLowerCase().includes(a))
  );
  if (colourHit) return `for your Venus in ${venus}, this is your colour`;
  if (product.seasons.includes(rising)) return `built for your ${rising} rising`;
  if (product.vector.structure >= 80 && profile.vector.structure >= 65) return `the structure your rising wants`;
  if (product.vector.sensual >= 75 && profile.vector.sensual >= 65) return `for your Venus in ${venus}`;
  if (product.vector.texture >= 75 && profile.vector.texture >= 65) return `the texture your Venus reaches for`;
  return `fits your ${rising} rising and ${venus} Venus`;
}

/**
 * Her personalised edit for a season. Products are filtered to the season, scored against her
 * profile, penalised for carrying a downranked attribute, and returned best first.
 */
export function seasonalEdit(
  placements: StylePlacements,
  season: Sign,
  options: { situationId?: string; limit?: number } = {}
): { profile: StyleProfile; items: RankedProduct[] } | null {
  const profile = composeStyleProfile(placements, { situationId: options.situationId });
  if (!profile) return null;

  const pool = productsForSeason(season);
  const scored = pool
    .map((product) => ({ product, match: scoreProduct(profile, product) }))
    .sort((a, b) => b.match - a.match);

  const items = spread(scored).map((s) => ({
    ...s,
    reason: reasonFor(s.product, profile),
    url: affiliateWrap(s.product.url),
  })).slice(0, options.limit ?? 12);

  return { profile, items };
}

/** Spread a sorted pool's raw cosine scores across a readable display range. */
function spread(scored: { product: Product; match: number }[]): { product: Product; match: number; vibe: number }[] {
  if (scored.length === 0) return [];
  const top = scored[0].match;
  const bottom = scored[scored.length - 1].match;
  const range = top - bottom;
  return scored.map((s) => ({
    ...s,
    vibe: range < 1e-6 ? 95 : Math.round(72 + ((s.match - bottom) / range) * 27),
  }));
}

/** Everything in the catalogue, ranked, ignoring season. Useful for a full wardrobe view. */
export function rankedWardrobe(placements: StylePlacements, limit = 20): RankedProduct[] {
  const profile = composeStyleProfile(placements);
  if (!profile) return [];
  const scored = PRODUCTS.map((product) => ({ product, match: scoreProduct(profile, product) })).sort(
    (a, b) => b.match - a.match
  );
  return spread(scored)
    .map((s) => ({ ...s, reason: reasonFor(s.product, profile), url: affiliateWrap(s.product.url) }))
    .slice(0, limit);
}
