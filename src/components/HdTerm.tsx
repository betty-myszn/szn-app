"use client";

import { createGlossary } from "@/components/learn/GlossTerm";
import { GLOSSARY } from "@/lib/human-design-learn";

// Human Design's tap-to-define words (see learn/GlossTerm for how they work).
const hd = createGlossary(GLOSSARY);
export default hd.Term;
export const glossify = hd.glossify;
