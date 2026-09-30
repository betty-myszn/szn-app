import { LIFE_AREAS, type LifeAreaMeta } from "@/lib/life-areas";
import type { ActivatedPlacement } from "@/types/chart";
import { ordinalHouse } from "@/lib/interpretations";

// "Customise my szn": the life areas a member wants MORE of this season. One ordered list, the
// order she tapped them in is the order they lead her dashboard. Everything she didn't pick stays
// on the page, lower and lighter, so her whole chart is always in view.
//
// Pure helpers only, so they can be tested without a browser. Reading and saving live in
// szn-picks-store.ts.

export interface AreaFlavour {
  glyph: string;
  hint: string;
  era: string; // her season gets named from her top picks: "rich girl + main character era"
  yes: string; // what the picker says back when she taps it on
  no: string; // and when she taps it off, which is also how she learns big moments still get flagged
}

// Keyed by LIFE_AREAS id. Written as a set: no two lines share an opening, a closing or a shape.
export const AREA_FLAVOUR: Record<string, AreaFlavour> = {
  money: {
    glyph: "♃",
    hint: "earning, charging, receiving",
    era: "rich girl",
    yes: "YESSS, a girl who wants the bag 💸 your 2nd house just lit up.",
    no: "money's on low for now. if something big hits it, i'll still tell you.",
  },
  confidence: {
    glyph: "☉",
    hint: "being seen, taking up space",
    era: "main character",
    yes: "main character energy UNLOCKED. your 1st house is glowing.",
    no: "confidence down a notch. you're still that girl, obviously.",
  },
  career: {
    glyph: "♄",
    hint: "work, business, reputation",
    era: "CEO",
    yes: "CEO behaviour, noted. saturn has been waiting for you to ask.",
    no: "career off the top spot. your 10th house will survive, promise.",
  },
  purpose: {
    glyph: "☊",
    hint: "the bigger why, your path",
    era: "destiny",
    yes: "the big why, sooo you. your north node approves ✦",
    no: "purpose parked for now. it'll be right here when you want it.",
  },
  relationships: {
    glyph: "♀",
    hint: "dating, partners, what you'll accept",
    era: "lover girl",
    yes: "ooooh, a romance arc. venus is already taking notes 💌",
    no: "love on low, noted. anything big landing in your 7th house still gets flagged.",
  },
  mindset: {
    glyph: "☿",
    hint: "self-talk, beliefs, focus",
    era: "unbothered",
    yes: "a brain glow-up season, OBSESSED. mercury's on it.",
    no: "mindset's quieter now. your 3rd house can take a nap.",
  },
  healing: {
    glyph: "⚷",
    hint: "rest, shadow work, letting go",
    era: "soft life",
    yes: "soft life loading… your 8th house says thank you 🫶",
    no: "healing on pause, babe. rest is still allowed, always.",
  },
  "style-fashion": {
    glyph: "✧",
    hint: "your look, your vibe, your aesthetic",
    era: "it girl",
    yes: "the fits are about to be UNREAL. venus is styling you personally.",
    no: "style on the back burner. you'll still look good, relax.",
  },
  "health-body": {
    glyph: "♂",
    hint: "energy, body, daily rhythm",
    era: "glow-up",
    yes: "body first this season, love that for you. mars brought the energy.",
    no: "health off the top spot. drink your water anyway, babe.",
  },
  "home-environment": {
    glyph: "☽",
    hint: "home, family, your safe space",
    era: "sanctuary",
    yes: "sanctuary mode ON. your 4th house wants candles and clean sheets.",
    no: "home on low. your space will wait for you.",
  },
  "spiritual-growth": {
    glyph: "♆",
    hint: "intuition, faith, the woo",
    era: "high priestess",
    yes: "high priestess energy, i felt that from here 🔮",
    no: "the woo can wait. your 12th house isn't going anywhere.",
  },
};

// The order the picker shows them in: the seven people come for most, then the rest.
const PICKER_ORDER = [
  "money",
  "relationships",
  "career",
  "purpose",
  "confidence",
  "mindset",
  "healing",
  "style-fashion",
  "health-body",
  "home-environment",
  "spiritual-growth",
];

export const PICKABLE_AREAS: LifeAreaMeta[] = PICKER_ORDER.map((id) => LIFE_AREAS.find((a) => a.id === id)).filter(
  (a): a is LifeAreaMeta => !!a && !!AREA_FLAVOUR[a.id],
);

const VALID = new Set(PICKABLE_AREAS.map((a) => a.id));

/** Whatever came out of storage, as a clean ordered list of real area ids with no repeats. */
export function sanitizePicks(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const v of raw) {
    if (typeof v === "string" && VALID.has(v) && !out.includes(v)) out.push(v);
  }
  return out;
}

/** "rich girl era", "rich girl + main character era", "rich girl, main character + destiny era". */
export function eraName(picks: string[]): string {
  const words = picks.slice(0, 3).map((id) => AREA_FLAVOUR[id]?.era).filter(Boolean) as string[];
  if (words.length === 0) return "";
  if (words.length === 1) return `${words[0]} era`;
  if (words.length === 2) return `${words[0]} + ${words[1]} era`;
  return `${words[0]}, ${words[1]} + ${words[2]} era`;
}

/** "money, confidence + purpose" */
export function pickList(picks: string[]): string {
  const names = picks.map((id) => shortLabel(id));
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} + ${names[names.length - 1]}`;
}

/** The label a member reads on a card: "love" rather than "relationships & love". */
export function shortLabel(id: string): string {
  if (id === "relationships") return "love";
  const meta = LIFE_AREAS.find((a) => a.id === id);
  return (meta?.label ?? id).replace(/ & .*$/, "");
}

/** The house an area lights on her chart wheel. */
export function wheelHouse(id: string): number {
  return LIFE_AREAS.find((a) => a.id === id)?.houseNumbers[0] ?? 1;
}

// Set in sessionStorage when she saves from the menu, so the dashboard can say "saved" once.
export const SAVED_FLAG = "myszn-szn-picks-saved";

// Members who joined after this see the picker as one full screen before their first dashboard.
// Everyone who was already here gets an invitation card on the dashboard instead, so nobody who
// has been using the app for months gets ambushed by a new screen on the way in.
export const FIRST_RUN_FROM = "2026-09-30T00:00:00Z";

export function isFirstRunAccount(memberSince: string | null | undefined): boolean {
  if (!memberSince) return false;
  const joined = new Date(memberSince).getTime();
  return Number.isFinite(joined) && joined >= new Date(FIRST_RUN_FROM).getTime();
}

// "Big" means a slow planet making a hard contact, tight. Those are the multi-week moments she
// would be upset to have missed, and they are rare enough that the flag never becomes noise.
const SLOW_MOVERS = new Set(["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North Node"]);
const HARD_ASPECTS = new Set(["conjunction", "opposition", "square"]);
const BIG_ORB = 2;

/**
 * The one big live transit landing in an area she did NOT pick, if there is one. Matched on the
 * area's primary house so a single contact never gets claimed by two areas. Tightest first.
 */
export function findBreakthrough(
  unpickedIds: string[],
  placements: ActivatedPlacement[] | undefined,
  pickedIds: string[] = [],
): { areaId: string; hit: ActivatedPlacement } | null {
  if (!placements?.length || unpickedIds.length === 0) return null;
  // A house one of her picks already leads with is already on her screen, so it is not "missed".
  const covered = new Set(pickedIds.map(wheelHouse));
  const sorted = [...placements].sort((a, b) => a.orb - b.orb);
  for (const hit of sorted) {
    if (!SLOW_MOVERS.has(hit.activatedBy) || !HARD_ASPECTS.has(hit.aspectType) || hit.orb > BIG_ORB) continue;
    if (covered.has(hit.natalHouse)) continue;
    const areaId = unpickedIds.find((id) => wheelHouse(id) === hit.natalHouse);
    if (areaId) return { areaId, hit };
  }
  return null;
}

export interface PickCardFacts {
  label: string; // "money"
  house: number; // the area's primary house
  bodyLabel: string; // the area's significator: "jupiter", "sun", "north node"
  sign: string; // the sign that significator sits in
  cuspSign: string; // the sign on the primary house cusp
  ruler: { rulerName: string; rulerSign: string; rulerHouse: number } | null; // the cusp sign's ruler, where it natally sits
}

const planetName = (name: string) => {
  const n = name.toLowerCase();
  return n === "sun" || n === "moon" ? `the ${n}` : n;
};

/**
 * The one line on each of her pick cards. The cards sit side by side, so each position in the row
 * gets its own sentence shape, and all of them lead with the area's natural significator (Jupiter
 * for money, the Sun for confidence) before the house mechanics. Real placements only.
 */
export function pickCardLine(f: PickCardFacts, index: number): string {
  const body = f.bodyLabel.toLowerCase();
  const sign = f.sign.toLowerCase();
  const nth = ordinalHouse(f.house);
  const cusp = f.cuspSign.toLowerCase();
  const ruler = f.ruler ? planetName(f.ruler.rulerName) : null;
  const where = f.ruler ? ` in ${f.ruler.rulerSign.toLowerCase()} in your ${ordinalHouse(f.ruler.rulerHouse)} house` : "";
  const same = !!ruler && ruler.replace(/^the /, "") === body;

  if (!ruler || same) {
    const lines = [
      `Your ${body} in ${sign} runs this one start to finish, ${same ? `it rules your ${nth} house too` : `working straight through your ${nth} house`}, so how ${f.label} goes for you comes down to that one placement.`,
      `All roads lead to your ${body} in ${sign} here. ${cap(cusp)} sits on your ${nth} house cusp${same ? `, and ${body} is its ruler as well` : ""}, which keeps ${f.label} unusually focused for you.`,
      `${cap(sign)} ${body} is the whole story for your ${f.label}, anchored in your ${nth} house with ${cusp} on the cusp.`,
      `Watch your ${body} in ${sign}. With ${cusp} on your ${nth} house cusp, it's the single placement setting the pace on ${f.label} this szn.`,
    ];
    return lines[index % lines.length];
  }
  const lines = [
    `Your ${body} in ${sign} leads this one, working through your ${nth} house, where ${cusp} sits on the cusp and hands the keys to ${ruler}${where}.`,
    `This szn, watch your ${body} in ${sign}: it decides how ${f.label} lands for you, and ${ruler}${where} runs your ${nth} house behind the scenes.`,
    `${cap(sign)} ${body} is your way in here. Pair it with ${ruler}${where}, the ruler of your ${cusp} ${nth} house, and you've got the whole mechanism.`,
    `Everything on ${f.label} starts with your ${body} in ${sign}, then routes through ${ruler}${where}, which rules the ${cusp} cusp of your ${nth} house.`,
  ];
  return lines[index % lines.length];
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
