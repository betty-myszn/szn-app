// Every sign scored across the style dimensions. This is the numeric spine of the engine: the same
// twelve vectors are reused for whichever placement is being read, and the placement's role mask
// (see engine.ts) decides which dimensions that placement is allowed to speak to. So Moon in Taurus
// contributes Taurus-ness but only through comfort and texture, while Venus in Taurus contributes
// the full aesthetic layer.

import { vec, type Sign, type StyleVector } from "./types";

export const SIGN_VECTORS: Record<Sign, StyleVector> = {
  Aries: vec({
    structure: 80, fluidity: 20, bodyConscious: 80, oversized: 20, minimal: 60, maximal: 40,
    classic: 40, experimental: 55, romantic: 15, sporty: 85, sensual: 60, polished: 55,
    casual: 45, feminine: 40, masculine: 70, vintage: 20, futuristic: 45,
    colourIntensity: 85, printIntensity: 25, texture: 40, glamour: 50, edge: 85,
  }),
  Taurus: vec({
    structure: 55, fluidity: 60, bodyConscious: 65, oversized: 35, minimal: 65, maximal: 30,
    classic: 85, experimental: 15, romantic: 60, sporty: 20, sensual: 85, polished: 75,
    casual: 45, feminine: 70, masculine: 30, vintage: 55, futuristic: 10,
    colourIntensity: 35, printIntensity: 20, texture: 95, glamour: 55, edge: 20,
  }),
  Gemini: vec({
    structure: 40, fluidity: 60, bodyConscious: 45, oversized: 55, minimal: 30, maximal: 70,
    classic: 30, experimental: 75, romantic: 40, sporty: 55, sensual: 40, polished: 45,
    casual: 70, feminine: 55, masculine: 45, vintage: 50, futuristic: 55,
    colourIntensity: 75, printIntensity: 85, texture: 55, glamour: 40, edge: 45,
  }),
  Cancer: vec({
    structure: 30, fluidity: 85, bodyConscious: 35, oversized: 60, minimal: 40, maximal: 45,
    classic: 65, experimental: 20, romantic: 90, sporty: 15, sensual: 55, polished: 50,
    casual: 60, feminine: 90, masculine: 10, vintage: 80, futuristic: 10,
    colourIntensity: 30, printIntensity: 35, texture: 70, glamour: 40, edge: 15,
  }),
  Leo: vec({
    structure: 70, fluidity: 45, bodyConscious: 75, oversized: 35, minimal: 15, maximal: 90,
    classic: 50, experimental: 45, romantic: 60, sporty: 30, sensual: 75, polished: 85,
    casual: 25, feminine: 80, masculine: 30, vintage: 45, futuristic: 30,
    colourIntensity: 90, printIntensity: 60, texture: 75, glamour: 95, edge: 50,
  }),
  Virgo: vec({
    structure: 85, fluidity: 35, bodyConscious: 55, oversized: 25, minimal: 95, maximal: 10,
    classic: 85, experimental: 20, romantic: 35, sporty: 40, sensual: 35, polished: 95,
    casual: 40, feminine: 55, masculine: 50, vintage: 35, futuristic: 25,
    colourIntensity: 25, printIntensity: 15, texture: 45, glamour: 30, edge: 25,
  }),
  Libra: vec({
    structure: 65, fluidity: 60, bodyConscious: 55, oversized: 35, minimal: 60, maximal: 40,
    classic: 75, experimental: 25, romantic: 85, sporty: 20, sensual: 60, polished: 90,
    casual: 35, feminine: 85, masculine: 25, vintage: 50, futuristic: 20,
    colourIntensity: 45, printIntensity: 35, texture: 60, glamour: 65, edge: 20,
  }),
  Scorpio: vec({
    structure: 75, fluidity: 50, bodyConscious: 90, oversized: 25, minimal: 65, maximal: 40,
    classic: 55, experimental: 45, romantic: 45, sporty: 25, sensual: 95, polished: 70,
    casual: 20, feminine: 65, masculine: 45, vintage: 40, futuristic: 35,
    colourIntensity: 30, printIntensity: 15, texture: 70, glamour: 65, edge: 90,
  }),
  Sagittarius: vec({
    structure: 35, fluidity: 75, bodyConscious: 30, oversized: 75, minimal: 30, maximal: 65,
    classic: 35, experimental: 60, romantic: 45, sporty: 60, sensual: 40, polished: 30,
    casual: 85, feminine: 50, masculine: 55, vintage: 65, futuristic: 25,
    colourIntensity: 70, printIntensity: 75, texture: 60, glamour: 30, edge: 45,
  }),
  Capricorn: vec({
    structure: 95, fluidity: 25, bodyConscious: 55, oversized: 30, minimal: 80, maximal: 15,
    classic: 90, experimental: 25, romantic: 25, sporty: 30, sensual: 40, polished: 95,
    casual: 25, feminine: 45, masculine: 65, vintage: 45, futuristic: 20,
    colourIntensity: 20, printIntensity: 10, texture: 55, glamour: 55, edge: 45,
  }),
  Aquarius: vec({
    structure: 60, fluidity: 50, bodyConscious: 40, oversized: 70, minimal: 55, maximal: 60,
    classic: 20, experimental: 95, romantic: 25, sporty: 50, sensual: 35, polished: 55,
    casual: 50, feminine: 40, masculine: 60, vintage: 40, futuristic: 95,
    colourIntensity: 65, printIntensity: 50, texture: 50, glamour: 45, edge: 70,
  }),
  Pisces: vec({
    structure: 20, fluidity: 100, bodyConscious: 40, oversized: 60, minimal: 30, maximal: 55,
    classic: 35, experimental: 60, romantic: 90, sporty: 10, sensual: 70, polished: 40,
    casual: 55, feminine: 90, masculine: 10, vintage: 65, futuristic: 35,
    colourIntensity: 45, printIntensity: 45, texture: 80, glamour: 55, edge: 25,
  }),
};
