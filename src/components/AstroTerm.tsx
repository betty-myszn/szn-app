"use client";

import { createGlossary } from "@/components/learn/GlossTerm";
import { ASTRO_GLOSSARY } from "@/lib/astro-learn";

// Astrology's tap-to-define words (see learn/GlossTerm for how they work).
const astro = createGlossary(ASTRO_GLOSSARY);
export default astro.Term;
export const glossify = astro.glossify;
