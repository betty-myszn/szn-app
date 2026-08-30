// Situation is the third variable. It does three jobs: it reweights the placements (Venus climbs on
// a date, the rising climbs at work, the moon dominates loungewear), it nudges individual
// dimensions, and it can pull in an archetypal sign influence, which is how "party gets Leo
// attributes" and "interview gets Saturn polish" become real numbers rather than a note in a doc.

import type { Formality } from "./rising";
import type { Dimension, PlacementKey, Sign } from "./types";

/** Betty's baseline weighting. Situations override individual keys, never the whole set. */
export const BASE_WEIGHTS: Record<PlacementKey, number> = {
  venus: 0.4,
  rising: 0.3,
  moon: 0.15,
  mars: 0.1,
  sun: 0.05,
};

export interface SituationDef {
  id: string;
  label: string;
  /** What the occasion actually asks of an outfit. */
  brief: string;
  weights: Partial<Record<PlacementKey, number>>;
  nudges: Partial<Record<Dimension, number>>;
  /** Archetypal sign flavour mixed in at a small weight, e.g. Leo for a party. */
  influence?: { sign: Sign; weight: number }[];
  /** The register of the pieces themselves, which decides which tier is picked. */
  formality: Formality;
  /** Whether the engine should build the look around a dress, separates, or activewear. */
  focus: "dress" | "separates" | "active";
  /** Which colour tiers to lead with, so the edit does not repeat itself across situations. */
  colourTiers: ("hero" | "supporting" | "accent" | "experimental")[];
}

export const SITUATIONS: SituationDef[] = [
  {
    id: "everyday",
    formality: "casual",
    label: "everyday",
    brief: "The outfit you actually live in, which has to survive a real Tuesday without you thinking about it once after you leave",
    weights: { moon: 0.3, venus: 0.3, rising: 0.25, mars: 0.1, sun: 0.05 },
    nudges: { casual: 20, polished: -10, glamour: -15, structure: -5 },
    focus: "separates",
    colourTiers: ["supporting", "hero"],
  },
  {
    id: "work",
    formality: "formal",
    label: "work",
    brief: "You are being assessed by people who do not know you, so the outfit answers the competence question before you speak",
    weights: { rising: 0.45, venus: 0.3, moon: 0.15, mars: 0.05, sun: 0.05 },
    nudges: { structure: 20, polished: 20, minimal: 15, sensual: -20, edge: -10, printIntensity: -15 },
    influence: [{ sign: "Capricorn", weight: 0.15 }],
    focus: "separates",
    colourTiers: ["supporting", "accent"],
  },
  {
    id: "interview",
    formality: "formal",
    label: "an interview",
    brief: "One impression, no second chance, and everything you wear is read as evidence of how you work",
    weights: { rising: 0.5, venus: 0.25, moon: 0.1, mars: 0.05, sun: 0.1 },
    nudges: { structure: 25, polished: 25, classic: 20, minimal: 15, maximal: -20, edge: -15 },
    influence: [{ sign: "Capricorn", weight: 0.25 }],
    focus: "separates",
    colourTiers: ["supporting"],
  },
  {
    id: "big-meeting",
    formality: "formal",
    label: "a big meeting",
    brief: "You need authority the moment you walk in, and to still look like yourself once you sit down",
    weights: { rising: 0.45, venus: 0.3, moon: 0.1, mars: 0.05, sun: 0.1 },
    nudges: { structure: 20, polished: 20, classic: 15, casual: -20 },
    influence: [{ sign: "Capricorn", weight: 0.2 }],
    focus: "separates",
    colourTiers: ["supporting", "accent"],
  },
  {
    id: "date",
    formality: "smart",
    label: "a date",
    brief: "Attraction runs on how you feel in the thing, because ease is the actual signal",
    weights: { venus: 0.5, rising: 0.25, mars: 0.15, moon: 0.05, sun: 0.05 },
    nudges: { sensual: 25, texture: 20, bodyConscious: 15, romantic: 10, sporty: -15 },
    focus: "dress",
    colourTiers: ["hero", "accent"],
  },
  {
    id: "first-date",
    formality: "smart",
    label: "a first date",
    brief: "A stranger is forming an impression and you want to be attractive and recognisably yourself at once",
    weights: { venus: 0.45, rising: 0.35, mars: 0.1, moon: 0.05, sun: 0.05 },
    nudges: { sensual: 15, polished: 10, texture: 15, experimental: -10 },
    focus: "dress",
    colourTiers: ["hero", "supporting"],
  },
  {
    id: "night-out",
    formality: "smart",
    label: "a night out",
    brief: "Low light, loud room, photographs you did not approve, so the look has to carry on contrast alone",
    weights: { venus: 0.4, mars: 0.25, rising: 0.2, sun: 0.1, moon: 0.05 },
    nudges: { edge: 25, glamour: 20, bodyConscious: 20, sensual: 15, casual: -25 },
    focus: "dress",
    colourTiers: ["hero", "accent"],
  },
  {
    id: "party",
    formality: "smart",
    label: "a party",
    brief: "You will be seen across a room and remembered by silhouette rather than detail",
    weights: { venus: 0.4, sun: 0.2, rising: 0.25, mars: 0.1, moon: 0.05 },
    nudges: { glamour: 25, maximal: 20, colourIntensity: 15, minimal: -20 },
    influence: [{ sign: "Leo", weight: 0.2 }],
    focus: "dress",
    colourTiers: ["hero", "accent", "experimental"],
  },
  {
    id: "luxury-event",
    formality: "formal",
    label: "a luxury event",
    brief: "The room is judging fabric and finish, so materials do more work than novelty",
    weights: { venus: 0.45, rising: 0.3, sun: 0.15, moon: 0.05, mars: 0.05 },
    nudges: { texture: 25, glamour: 20, polished: 20, casual: -30 },
    influence: [{ sign: "Leo", weight: 0.15 }, { sign: "Taurus", weight: 0.1 }],
    focus: "dress",
    colourTiers: ["hero", "supporting"],
  },
  {
    id: "wedding-guest",
    formality: "formal",
    label: "a wedding",
    brief: "Elegant, photographed all day, and never competing with the bride",
    weights: { venus: 0.45, rising: 0.35, sun: 0.1, moon: 0.05, mars: 0.05 },
    nudges: { romantic: 20, polished: 20, glamour: 10, edge: -15 },
    influence: [{ sign: "Libra", weight: 0.15 }],
    focus: "dress",
    colourTiers: ["hero", "supporting"],
  },
  {
    id: "holiday",
    formality: "casual",
    label: "a holiday",
    brief: "Heat, movement and photographs, so it has to work creased and look good in daylight",
    weights: { venus: 0.4, moon: 0.25, rising: 0.25, mars: 0.05, sun: 0.05 },
    nudges: { fluidity: 20, casual: 20, colourIntensity: 15, structure: -20 },
    influence: [{ sign: "Sagittarius", weight: 0.15 }],
    focus: "dress",
    colourTiers: ["hero", "experimental"],
  },
  {
    id: "festival",
    formality: "casual",
    label: "a festival",
    brief: "Long day, unpredictable weather, and a crowd, so comfort and expression have to coexist",
    weights: { venus: 0.35, mars: 0.2, moon: 0.2, rising: 0.2, sun: 0.05 },
    nudges: { casual: 25, experimental: 20, printIntensity: 20, polished: -20 },
    influence: [{ sign: "Aquarius", weight: 0.12 }, { sign: "Sagittarius", weight: 0.12 }],
    focus: "separates",
    colourTiers: ["hero", "experimental"],
  },
  {
    id: "creative-event",
    formality: "smart",
    label: "a creative event",
    brief: "A room that reads clothes as a point of view, where playing safe is the only wrong answer",
    weights: { venus: 0.4, rising: 0.3, sun: 0.15, mars: 0.1, moon: 0.05 },
    nudges: { experimental: 25, maximal: 15, classic: -20, printIntensity: 15 },
    influence: [{ sign: "Aquarius", weight: 0.15 }, { sign: "Gemini", weight: 0.1 }],
    focus: "separates",
    colourTiers: ["experimental", "hero"],
  },
  {
    id: "casual",
    formality: "casual",
    label: "something casual",
    brief: "Seeing people you know, with no dress code, which is where most women overthink it",
    weights: { moon: 0.3, rising: 0.3, venus: 0.25, mars: 0.1, sun: 0.05 },
    nudges: { casual: 25, minimal: 10, glamour: -20, printIntensity: -10 },
    focus: "separates",
    colourTiers: ["supporting"],
  },
  {
    id: "gym",
    formality: "casual",
    label: "the gym",
    brief: "Function first, and still the version of you that you are happy to be seen as",
    weights: { mars: 0.4, rising: 0.3, moon: 0.2, venus: 0.05, sun: 0.05 },
    nudges: { sporty: 35, bodyConscious: 20, structure: 10, romantic: -25, glamour: -25 },
    influence: [{ sign: "Aries", weight: 0.15 }],
    focus: "active",
    colourTiers: ["supporting", "accent"],
  },
];

export function situationById(id: string): SituationDef | undefined {
  return SITUATIONS.find((s) => s.id === id);
}
