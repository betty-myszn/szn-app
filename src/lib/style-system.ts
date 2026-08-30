// The style system: a composed fashion read for any rising sign crossed with any Venus sign, for
// any situation she is dressing for.
//
// Architecture matches the rest of the platform (see life-areas.ts): primitives plus a composer,
// never a hand-written page per combination. There are 144 rising/Venus pairs and seven situations,
// so writing them out would be over a thousand dead documents. Instead:
//
//   RISING_STYLE   how she is READ, and therefore the silhouette, proportion and hardware that make
//                  the first impression land. Twelve entries.
//   VENUS_STYLE_NOTES (style-data.ts) what she is DRAWN TO: palette, texture, signature, avoid.
//                  Already written, reused here rather than duplicated.
//   SITUATIONS     what an occasion demands, and which of the two planets should lead in it.
//   blend()        the relationship between her rising and her Venus, which is what stops a read
//                  being two paragraphs stapled together. Two signs in the same element behave very
//                  differently to two at right angles, and that difference is the interesting part.
//
// Voice: warm, direct, second person, flowing sentences, British spelling. No em dashes, no
// rhetorical questions.

import { RISING_VIBES, VENUS_STYLE, VENUS_STYLE_NOTES } from "@/lib/style-data";

export const ZODIAC = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export type Sign = (typeof ZODIAC)[number];

// ── rising: how the room reads you, and the shapes that serve that ──────────────
export interface RisingStyle {
  /** The impression the silhouette needs to carry. */
  readAs: string;
  /** The shapes and cut that work with that impression. */
  silhouette: string;
  /** Where the emphasis of an outfit should sit. */
  proportion: string;
  /** The one move that makes a look unmistakably hers. */
  signatureMove: string;
  /** What flattens this rising, the thing that makes her disappear or misread. */
  breaks: string;
  /** Hardware and metal that suits the impression. */
  metals: string;
}

export const RISING_STYLE: Record<Sign, RisingStyle> = {
  Aries: {
    readAs: "the woman who arrived first and did not wait to be introduced",
    silhouette: "sharp and uncomplicated, a strong shoulder, a clean line, nothing that slows you down on the way out of the door",
    proportion: "weight at the top, shoulder and head, with the leg left long and unfussy underneath",
    signatureMove: "one hard edge or one hit of red, placed where the eye lands first",
    breaks: "fussy layering and anything that needs rearranging every time you stand up",
    metals: "polished silver and chrome, bright and a little aggressive",
  },
  Taurus: {
    readAs: "expensive, unhurried, and completely at home in your own body",
    silhouette: "soft structure in fabric with real weight, skimming rather than clinging, built to be touched",
    proportion: "a long unbroken line with the throat and waist gently marked",
    signatureMove: "one investment piece worn so often it becomes the thing people picture you in",
    breaks: "thin, scratchy or cheap fabric, which undoes the whole impression no matter how good the cut is",
    metals: "warm gold, solid rather than delicate",
  },
  Gemini: {
    readAs: "quick, current, and the most interesting person in the conversation",
    silhouette: "light and mobile, layered pieces that come apart and rebuild into something else",
    proportion: "emphasis on the arms and hands, where you are always moving anyway",
    signatureMove: "a rotating accessory that changes the whole look without changing the outfit",
    breaks: "a rigid one-note uniform, which reads as boredom on you faster than on anyone else",
    metals: "mixed metals worn together on purpose",
  },
  Cancer: {
    readAs: "soft, approachable, and quietly the emotional centre of the room",
    silhouette: "fluid and wrapped, draped shapes with give in them, comfort you can see",
    proportion: "the emphasis high and soft across the collarbone, edges left unsharp",
    signatureMove: "something sentimental worn close to the skin, a locket, an heirloom, a piece with a story",
    breaks: "hard tailoring with no give, which makes you look armoured rather than warm",
    metals: "pearl and soft silver",
  },
  Leo: {
    readAs: "golden and impossible to miss, the main character whether or not you planned to be",
    silhouette: "a defined shape, strong shoulder into a marked waist, drama built into the cut",
    proportion: "everything framing the face and hair, because that is where people look on you",
    signatureMove: "one piece that catches the light and holds it, gold, gloss, a sweep of texture",
    breaks: "quiet beige minimalism, which on you reads as a woman hiding rather than a woman with taste",
    metals: "gold, warm and unapologetic",
  },
  Virgo: {
    readAs: "polished, precise, and visibly on top of your life",
    silhouette: "clean tailoring cut exactly to you, nothing surplus, every line intentional",
    proportion: "a marked waist and clean verticals, tidy from every angle",
    signatureMove: "a fit so exact it looks made for you, plus one quiet detail that rewards a second look",
    breaks: "anything approximate, unfinished or creased, which you feel long before anyone else notices",
    metals: "fine silver, small and exact",
  },
  Libra: {
    readAs: "composed, charming, and easy to look at",
    silhouette: "balanced and coordinated, soft symmetry, pieces that were clearly chosen together",
    proportion: "even and harmonious, nothing extreme at either end",
    signatureMove: "a colour pairing that looks considered rather than accidental",
    breaks: "clashing or off-balance combinations, which unsettle you all day even when nobody comments",
    metals: "rose gold and warm brass",
  },
  Scorpio: {
    readAs: "magnetic, controlled, and holding something back on purpose",
    silhouette: "close to the body and covered, power through shape rather than through skin",
    proportion: "a strong single line with the eyes left as the most exposed thing about you",
    signatureMove: "one dark deliberate piece with real edge, worn like a decision",
    breaks: "busy, bright, over-explained outfits, which spend the mystery that does your work for you",
    metals: "gunmetal and black hardware",
  },
  Sagittarius: {
    readAs: "open, warm, and visibly on the way somewhere",
    silhouette: "relaxed and long, easy movement, nothing that stops you walking fast",
    proportion: "long lines finished with a real boot, unconstricted through the body",
    signatureMove: "one piece with a story attached, brought back from somewhere rather than bought nearby",
    breaks: "stiff formality, which makes you look borrowed rather than yourself",
    metals: "bronze and antique brass",
  },
  Capricorn: {
    readAs: "serious, capable, and the adult in the room before you speak",
    silhouette: "structured and timeless, tailoring that would have worked twenty years ago and will again",
    proportion: "a strong vertical, elongated and controlled",
    signatureMove: "one piece of obvious quality worn without comment, authority rather than trend",
    breaks: "flimsy trend pieces, which cost you the credibility your whole look is built on",
    metals: "brushed silver and steel",
  },
  Aquarius: {
    readAs: "electric, original, and slightly ahead of whatever everyone else is doing",
    silhouette: "clean shapes with something structurally unexpected, precise but never predictable",
    proportion: "a deliberate asymmetry or an odd hemline that makes the eye stop and check",
    signatureMove: "one thing nobody else in the room is wearing, chosen on purpose rather than for shock",
    breaks: "looking like everybody else, which is the only genuine failure state for this rising",
    metals: "chrome, steel and anything faintly futuristic",
  },
  Pisces: {
    readAs: "dreamy, soft-focus, and slightly not of this world",
    silhouette: "fluid and layered, fabric that moves after you have stopped moving",
    proportion: "soft edges throughout, nothing cut sharply against the body",
    signatureMove: "a piece with shift in it, iridescence, sheer layers, something that changes in the light",
    breaks: "rigid corporate hardness, which fights the impression you make instead of carrying it",
    metals: "silver, opal and mother of pearl",
  },
};

// ── situations: what an occasion demands, and which planet should lead ──────────
export interface Situation {
  id: string;
  label: string;
  /** What the occasion is actually asking of an outfit. */
  brief: string;
  /** Rising leads where being read correctly by strangers matters most; Venus leads where how she
   *  feels in it matters more than how it is received. */
  leads: "rising" | "venus";
}

export const SITUATIONS: Situation[] = [
  {
    id: "work",
    label: "work and being taken seriously",
    brief: "You are being assessed by people who do not know you yet, so the outfit has to answer the competence question before you have said anything",
    leads: "rising",
  },
  {
    id: "date",
    label: "a date or anything romantic",
    brief: "Attraction runs on how you feel in the thing, because ease is the actual signal and nobody is checking your hemline",
    leads: "venus",
  },
  {
    id: "event",
    label: "an event, a party, being photographed",
    brief: "You will be seen in a crowd, at distance, and probably in a photograph you did not approve, so shape has to carry from across a room",
    leads: "rising",
  },
  {
    id: "everyday",
    label: "an ordinary day",
    brief: "This is the outfit you actually live in, so it has to survive a real Tuesday without you thinking about it once after you leave",
    leads: "venus",
  },
  {
    id: "visibility",
    label: "presenting, filming, being on a stage",
    brief: "You are being looked at deliberately and at length, so the look has to hold still and hold up under attention",
    leads: "rising",
  },
  {
    id: "travel",
    label: "travelling",
    brief: "Hours of movement and no control over the temperature, so it has to work creased, layered and photographed at the other end",
    leads: "venus",
  },
  {
    id: "rest",
    label: "rest and being at home",
    brief: "Nobody is looking, which is exactly why this one matters, because what you wear alone is what you believe you are worth on an ordinary day",
    leads: "venus",
  },
];

// ── the blend: how her rising and her Venus actually get along ──────────────────
export type BlendKind =
  | "concentrated"
  | "adjacent"
  | "easy"
  | "friction"
  | "harmonious"
  | "mismatched"
  | "polarity";

export interface Blend {
  kind: BlendKind;
  heading: string;
  body: string;
}

// Only the first character is lowered when a written sentence is spliced into the middle of another
// one. A blanket toLowerCase would also flatten the full stop that separates the two sentences
// inside these fields, producing "pieces with an edge. magnetic beats pretty".
function spliced(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function signIndex(sign: string): number {
  return ZODIAC.indexOf(sign as Sign);
}

/** Shortest distance around the wheel, 0 to 6. */
function signDistance(a: string, b: string): number {
  const i = signIndex(a);
  const j = signIndex(b);
  if (i < 0 || j < 0) return 0;
  const raw = Math.abs(i - j) % 12;
  return raw > 6 ? 12 - raw : raw;
}

/**
 * How the impression she makes (rising) sits with what she is drawn to (Venus). This is the part
 * that makes a read feel like it was written for one person: two women can share a rising and
 * dress completely differently because their Venus pulls the look somewhere else.
 */
export function blend(rising: string, venus: string): Blend {
  const r = RISING_STYLE[rising as Sign];
  const v = VENUS_STYLE_NOTES[venus];
  const d = signDistance(rising, venus);
  const risingLower = rising.toLowerCase();
  const venusLower = venus.toLowerCase();

  if (d === 0) {
    return {
      kind: "concentrated",
      heading: "one clear signal, turned all the way up",
      body: `Your rising and your Venus are both in ${risingLower}, so there is no negotiation happening in your wardrobe at all. How you are read and what you are drawn to are the same instinct, which makes your style unusually coherent and instantly recognisable. The only thing to watch is that a single note played loudly can start to wear you rather than the other way round, so vary the intensity across a week and let some days be the quiet version of the same idea.`,
    };
  }
  if (d === 4 || d === 8) {
    return {
      kind: "harmonious",
      heading: "the same language, spoken twice",
      body: `Your ${risingLower} rising and your ${venusLower} Venus share an element, so they want compatible things and getting dressed is genuinely easier for you than for most people. The impression you make and the pieces you reach for agree. Because it flows this easily, the risk is coasting, so use the ease as a floor rather than a finish and push the styling one step further than feels necessary.`,
    };
  }
  if (d === 2 || d === 10) {
    return {
      kind: "easy",
      heading: "a natural, useful contrast",
      body: `Your ${risingLower} rising and your ${venusLower} Venus sit at a friendly angle, close enough to cooperate and different enough to be interesting. The impression is ${r.readAs}, and the pieces you gravitate to add a note the rising would not have thought of on its own. Let the rising set the shape and the Venus choose the fabric and colour, and it will nearly always land.`,
    };
  }
  if (d === 6) {
    return {
      kind: "polarity",
      heading: "two opposite instincts, one wardrobe",
      body: `Your ${risingLower} rising and your ${venusLower} Venus sit directly across the wheel from each other, which is why your taste can feel like it belongs to two different women. The room reads you as ${r.readAs}, while what you actually reach for is ${spliced(v.wear)} Opposites are the most workable tension in astrology because they need each other, so build the outfit on your rising's shape and let the Venus supply the detail. When you dress from only one end, the other end quietly sabotages the look by the second hour.`,
    };
  }
  if (d === 3 || d === 9) {
    return {
      kind: "friction",
      heading: "the productive argument in your wardrobe",
      body: `Your ${risingLower} rising and your ${venusLower} Venus sit at right angles, which is the most creative tension in a chart and the most annoying one to dress. You are read as ${r.readAs}, yet the things that genuinely appeal to you pull in a different direction, so you can buy something you love and feel wrong in it, or look impeccable and feel like you are in costume. The resolution is not compromise. Lead with the rising for the silhouette so you are read correctly, then let the Venus win completely on colour, fabric and the one piece you actually love. Both get satisfied, in different layers.`,
    };
  }
  if (d === 5 || d === 7) {
    return {
      kind: "mismatched",
      heading: "two signs with nothing obvious in common",
      body: `Your ${risingLower} rising and your ${venusLower} Venus share no element, no modality and no easy conversation, so your style needs a bridge rather than a blend. The way through is a third element that both can live with, usually a neutral, a metal or a single repeated shape that neither sign objects to. Choose that bridge deliberately and your wardrobe stops feeling like two half-finished ideas.`,
    };
  }
  return {
    kind: "adjacent",
    heading: "next-door signs, subtly at odds",
    body: `Your ${risingLower} rising and your ${venusLower} Venus are side by side on the wheel, which sounds harmonious and is actually the fiddliest pairing to style, because they are close enough to blur and different enough to disagree. Keep them in separate jobs. Your rising owns the cut and the proportion, your Venus owns the palette and the texture, and the look stops muddling itself.`,
  };
}

// ── the composed reading ────────────────────────────────────────────────────────
export interface SituationRead {
  id: string;
  label: string;
  guidance: string;
}

export interface StyleReading {
  rising: string;
  venus: string;
  headline: string;
  readAs: string;
  /** The four-step uniform, composed from both planets. */
  formula: string[];
  palette: string[];
  metals: string;
  texture: string;
  signature: string;
  avoid: string;
  scent: string;
  blend: Blend;
  situations: SituationRead[];
}

/** Per-situation guidance, weighted to whichever planet should lead in that context. */
function situationGuidance(s: Situation, rising: Sign, venus: string): string {
  const r = RISING_STYLE[rising];
  const v = VENUS_STYLE_NOTES[venus];
  const risingLower = rising.toLowerCase();
  const venusLower = venus.toLowerCase();

  if (s.leads === "rising") {
    return `${s.brief}, so your ${risingLower} rising leads here. Build it on ${r.silhouette}, with ${r.proportion}. Add ${r.signatureMove}. Your ${venusLower} Venus still gets the palette and the fabric, ${v.colours.slice(0, 3).join(", ")} in ${v.texture} Skip ${r.breaks}.`;
  }
  return `${s.brief}, so your ${venusLower} Venus leads here. Wear ${spliced(v.wear)} Keep ${v.texture} Your ${risingLower} rising still sets the shape underneath, ${r.silhouette}, which is what stops comfortable turning into careless. Avoid ${v.avoid}`;
}

/**
 * The full style read for a rising and Venus pair, optionally narrowed to one situation.
 * Returns null when either sign is unrecognised, so a partial chart never renders a broken page.
 */
export function composeStyle(
  rising: string,
  venus: string,
  options?: { situationId?: string }
): StyleReading | null {
  const r = RISING_STYLE[rising as Sign];
  const v = VENUS_STYLE_NOTES[venus];
  const vStyle = VENUS_STYLE[venus];
  const vibe = RISING_VIBES[rising];
  if (!r || !v || !vStyle || !vibe) return null;

  const situations = (options?.situationId
    ? SITUATIONS.filter((s) => s.id === options.situationId)
    : SITUATIONS
  ).map((s) => ({
    id: s.id,
    label: s.label,
    guidance: situationGuidance(s, rising as Sign, venus),
  }));

  return {
    rising,
    venus,
    headline: `${vibe.desc}, dressed in ${vStyle.style.toLowerCase()}`,
    readAs: `Your rising is what a room decides about you before you speak, and yours reads as ${r.readAs}. Your Venus is what you are actually drawn to, and yours wants ${spliced(v.wear)}`,
    formula: [
      `The base: something in ${v.colours[0]} with ${v.texture}`,
      `The structure: ${r.silhouette}, with ${r.proportion}.`,
      `The signature: ${r.signatureMove}, plus ${v.signature}`,
      `The finish: ${r.metals}, and nothing further. Stop one piece before it feels complete.`,
    ],
    palette: v.colours,
    metals: r.metals,
    texture: v.texture,
    signature: v.signature,
    avoid: `${r.breaks}, and ${v.avoid}`,
    scent: vStyle.scent,
    blend: blend(rising, venus),
    situations,
  };
}
