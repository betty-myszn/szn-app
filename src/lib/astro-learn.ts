import type { GlossaryEntry } from "@/components/learn/GlossTerm";

// Teaching layer for the astrology chart page: the tap-to-define glossary and the element and
// modality reads. Placement interpretation itself lives in interpretations.ts.

export const ASTRO_GLOSSARY: Record<string, GlossaryEntry> = {
  sign: {
    title: "Sign",
    def: "One of the 12 zodiac signs. The sign is the style a planet works in: the HOW.",
  },
  planet: {
    title: "Planet",
    def: "Each planet runs one part of you, from your identity (Sun) to your love life (Venus). The planet is the WHAT.",
  },
  house: {
    title: "House",
    def: "One of 12 life areas, from money to love to career. The house is WHERE a planet plays out in your life.",
    auto: /\bhouses?\b/i,
  },
  rising: {
    title: "Rising (Ascendant)",
    def: "The sign rising on the horizon the minute you were born. Your first impression, your vibe and how you start things.",
    auto: /\brising\b|\bascendant\b/i,
  },
  midheaven: {
    title: "Midheaven (MC)",
    def: "The very top of your chart. Your public image, career direction and the legacy you're building.",
    auto: /\bmidheaven\b/i,
  },
  aspect: {
    title: "Aspect",
    def: "An angle between two planets. Aspects are how your placements talk to each other, easy or spicy.",
    auto: /\baspects?\b/i,
  },
  conjunction: {
    title: "Conjunction (0°)",
    def: "Two planets in the same spot. Their energies fuse and turn each other UP.",
    auto: /\bconjunct(ion|s)?\b/i,
  },
  sextile: {
    title: "Sextile (60°)",
    def: "A friendly opening between two planets that pays off when you actually act on it.",
    auto: /\bsextiles?\b/i,
  },
  square: {
    title: "Square (90°)",
    def: "Friction that forces growth, the itch that makes you level up.",
    auto: /\bsquares?\b|\bsquaring\b/i,
  },
  trine: {
    title: "Trine (120°)",
    def: "Natural flow between two planets: talent that comes easily, sometimes so easily you undervalue it.",
    auto: /\btrines?\b|\btrining\b/i,
  },
  opposition: {
    title: "Opposition (180°)",
    def: "A tug of war you learn to balance, often played out through the people around you.",
    auto: /\bopposition\b|\bopposing\b/i,
  },
  retrograde: {
    title: "Retrograde",
    def: "When a planet looks like it's moving backwards from Earth. In a birth chart it turns that energy inward, so you process it privately first.",
    auto: /\bretrograde\b/i,
  },
  orb: {
    title: "Orb",
    def: "How close an aspect is to exact, in degrees. The smaller the orb, the louder you feel it.",
    auto: /\borb\b/i,
  },
  cusp: {
    title: "Cusp",
    def: "The starting line of a house. The sign on the cusp colours that whole area of your life.",
    auto: /\bcusp\b/i,
  },
  ruler: {
    title: "Chart ruler",
    def: "The planet that rules your rising sign. It's the driver of your whole chart, so wherever it sits, your life steers.",
    auto: /\bchart ruler\b/i,
  },
  element: {
    title: "Element",
    def: "Fire, earth, air or water. Your mix shows what comes naturally to you and what you get to learn.",
    auto: /\belements?\b/i,
  },
  modality: {
    title: "Modality",
    def: "Cardinal (starters), fixed (keepers) or mutable (adapters). It's how you handle change.",
    auto: /\bmodality\b/i,
  },
  node: {
    title: "The Nodes",
    def: "North and South Node. South is where you've been and what feels comfy, North is where you're growing.",
    auto: /\b(North|South) Node\b/,
  },
  chiron: {
    title: "Chiron",
    def: "The wounded healer. Your tender spot, and the exact place you end up helping other people heal.",
    auto: /\bChiron\b/,
  },
  lilith: {
    title: "Black Moon Lilith",
    def: "Your untamed, unapologetic side, the part of you that refuses to shrink for anyone.",
    auto: /\bLilith\b/,
  },
  fortune: {
    title: "Part of Fortune",
    def: "A calculated point showing where joy and luck flow easiest for you.",
    auto: /\bPart of Fortune\b/i,
  },
  transit: {
    title: "Transit",
    def: "Where a planet is in the sky right now, laid over your birth chart. Transits are your timing.",
    auto: /\btransits?\b/i,
  },
  stellium: {
    title: "Stellium",
    def: "Three or more planets in one sign or house. A full-on spotlight on that part of your life.",
    auto: /\bstellium\b/i,
  },
  placidus: {
    title: "Placidus",
    def: "The house system your chart uses. It splits the sky into 12 houses from your exact birth time and place.",
  },
};

export type Element = "fire" | "earth" | "air" | "water";
export type Modality = "cardinal" | "fixed" | "mutable";

export const ELEMENT_TEXT: Record<Element, { gift: string; missing: string }> = {
  fire: {
    gift: "Fire is the spark: confidence, passion, courage and going first.",
    missing: "confidence is something you build on purpose, so collect your wins and let them COUNT.",
  },
  earth: {
    gift: "Earth is the builder: money, body, routines and making things real.",
    missing: "structure doesn't come built in, so routines and money systems become your secret weapon.",
  },
  air: {
    gift: "Air is the mind: ideas, words, people and connection.",
    missing: "you feel and do before you explain, so journaling and talking it out turns instinct into words.",
  },
  water: {
    gift: "Water is the feeler: intuition, emotion, empathy and depth.",
    missing: "you can lead with logic over feelings, so make space to feel things before you fix them.",
  },
};

export const MODALITY_TEXT: Record<Modality, string> = {
  cardinal: "Cardinal energy starts things. You're a launcher, and you get bored once it's running on its own.",
  fixed: "Fixed energy keeps things going. You're loyal, steady and very hard to move once you've decided.",
  mutable: "Mutable energy adapts. You read the room, shapeshift and thrive on variety.",
};
