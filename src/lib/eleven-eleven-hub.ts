import type { CSSProperties } from "react";
import type { ChartData } from "@/types/chart";
import { houseForLongitude } from "@/lib/interpretations";

// Shared content for the 11/11 portal hub (not to be confused with lib/eleven-eleven.ts, the dashboard 11/11 card) (/your-season/11-11 and its pages). Copy comes from the
// workshop deck (11-11_Portal_Workshop_MYSZN v3 + v4). This week's sky, as taught in the workshop:
// the Scorpio New Moon at 17° Scorpio, and the nodes at 26° Leo (south) / 26° Aquarius (north).

export const pp = "var(--font-poppins), Poppins, sans-serif";
export const NEW_MOON_LON = 227;
export const SOUTH_NODE_LON = 146;
export const NORTH_NODE_LON = 326;
export const HUB_STATE_KEY = "myszn-1111-hub";

export const ORD = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export const PORTAL_HOUSES: Record<number, [string, string]> = {
  1: ["self + identity", "A whole new you."], 2: ["money + worth", "A rich b*tch money story."],
  3: ["voice + ideas", "Saying it out loud."], 4: ["home + roots", "A home that holds you."],
  5: ["pleasure + romance", "More joy. More play."], 6: ["work + routine", "Days that feel like yours."],
  7: ["partnership", "Love that shows up."], 8: ["receiving + intimacy", "Bigger, braver receiving."],
  9: ["beliefs + adventure", "A bigger, freer life."], 10: ["career + legacy", "Your name in lights."],
  11: ["community + future", "Your people. Your future."], 12: ["rest + spirit", "Deep rest. Real healing."],
};

// Keyed by the house the South Node (26° Leo) falls in.
export const NODE_SHIFT: Record<number, string> = {
  1: "From going it alone to letting people in.", 2: "From white-knuckle security to receiving.",
  3: "From endless chatter to your big truth.", 4: "From hiding at home to being seen out there.",
  5: "From the solo spotlight to the collective.", 6: "From constant doing to trust and rest.",
  7: "From living for others to choosing you.", 8: "From other people's money to your own.",
  9: "From searching far away to speaking up.", 10: "From the career mask to coming home.",
  11: "From blending in to taking centre stage.", 12: "From escaping life to building one daily.",
};

export const AUTHORITY: Record<string, [string, string]> = {
  emotional: ["emotional", "Ride the wave first. Circle your wish tonight, then confirm it once your wave settles."],
  sacral: ["sacral", "Your gut answers first. Listen for the uh-huh or the uhn-uhn."],
  splenic: ["splenic", "A quiet, instant knowing. It speaks once. Trust it."],
  ego: ["ego", "Ask your heart what it wants and what you're willing to commit to."],
  self: ["self-projected", "Say it out loud and listen. Your own voice tells you the truth."],
  mental: ["mental", "Talk it through with people you trust, somewhere that feels right."],
  lunar: ["lunar", "Give it a full lunar cycle, about 28 days, before you confirm."],
};

export const WISH_AREAS: [string, string, number[], string][] = [
  ["💸", "money", [2], "Venus"], ["💌", "love", [7], "Venus"], ["💃", "body", [1, 6], ""], ["🏡", "home", [4], "Moon"],
  ["💼", "work", [10, 6], ""], ["👯", "friendship", [11], ""], ["✈️", "adventure", [9], "Jupiter"], ["🎨", "creativity", [5], "Sun"],
  ["🍓", "pleasure", [5], "Venus"], ["🔮", "spirit", [12], "Neptune"], ["✦", "the secret one", [8], "Pluto"],
];
export const MAIN_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

export interface PortalChart {
  portalHouse: number | null;
  southHouse: number | null;
  northHouse: number | null;
  planet: (name: string) => { sign: string; house: number } | null;
  inHouses: (houses: number[]) => string[];
}

export function portalChart(chart: ChartData | null): PortalChart {
  const cusps = chart?.houses?.length === 12 ? chart.houses.map((h) => h.longitude) : null;
  return {
    portalHouse: cusps ? houseForLongitude(NEW_MOON_LON, cusps) : null,
    southHouse: cusps ? houseForLongitude(SOUTH_NODE_LON, cusps) : null,
    northHouse: cusps ? houseForLongitude(NORTH_NODE_LON, cusps) : null,
    planet: (name) => chart?.planets.find((p) => p.name === name) ?? null,
    inHouses: (houses) => (chart ? chart.planets.filter((p) => houses.includes(p.house) && MAIN_PLANETS.includes(p.name)).map((p) => p.name) : []),
  };
}

// How far through the 17 exercises she is, read from the same browser storage the exercises use.
export function savedStep(): number {
  try {
    const raw = localStorage.getItem(HUB_STATE_KEY);
    return raw ? Number(JSON.parse(raw).step) || 0 : 0;
  } catch {
    return 0;
  }
}

// The same look as the coven home: white cards, 20px corners, hard black shadow.
export const card: CSSProperties = { display: "block", background: "#fff", color: "var(--dark)", borderRadius: 20, overflow: "hidden", boxShadow: "6px 6px 0 var(--dark)" };
export const sectionTitle: CSSProperties = { fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1 };
export const label: CSSProperties = { fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark)" };
export const pinkBtn: CSSProperties = { display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 24px", border: "var(--border)", cursor: "pointer" };
export const blackBtn: CSSProperties = { ...pinkBtn, background: "var(--dark)" };
export const TILE_COLOURS: CSSProperties[] = [
  { background: "var(--pink)", color: "var(--dark)" },
  { background: "var(--lav)", color: "var(--dark)" },
  { background: "var(--dark)", color: "#fff" },
  { background: "var(--pink-light)", color: "var(--dark)" },
];
