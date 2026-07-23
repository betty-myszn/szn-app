export interface BirthData {
  name: string;
  dateOfBirth: string; // ISO date YYYY-MM-DD
  birthTime: string; // HH:mm (24h)
  birthTimeApproximate: boolean;
  location: BirthLocation;
}

export interface BirthLocation {
  placeName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA timezone identifier
}

export interface PlanetPosition {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  sign: string;
  signIndex: number;
  degree: number;
  minute: number;
  second: number;
  house: number;
  retrograde: boolean;
  formattedDegree: string;
}

export interface HouseCusp {
  house: number;
  longitude: number;
  sign: string;
  degree: number;
  minute: number;
  formattedDegree: string;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: AspectType;
  angle: number;
  orb: number;
  applying: boolean;
}

export type AspectType =
  | "conjunction"
  | "sextile"
  | "square"
  | "trine"
  | "opposition";

export interface PlanetaryRulership {
  sign: string;
  traditionalRuler: string;
  modernRuler: string;
}

export interface ChartData {
  birthData: BirthData;
  localBirthTime: string;
  utcBirthTime: string;
  julianDay: number;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  ascendant: number;
  midheaven: number;
  aspects: Aspect[];
  rulerships: PlanetaryRulership[];
  calculatedAt: string;
  approximate: boolean;
}

export const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export const ZODIAC_SYMBOLS = [
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
] as const;

export const ELEMENT_COLORS: Record<string, string> = {
  fire: "#E25822",
  earth: "#6B8E23",
  air: "#87CEEB",
  water: "#4169E1",
};

export const SIGN_ELEMENTS: Record<string, string> = {
  Aries: "fire",
  Taurus: "earth",
  Gemini: "air",
  Cancer: "water",
  Leo: "fire",
  Virgo: "earth",
  Libra: "air",
  Scorpio: "water",
  Sagittarius: "fire",
  Capricorn: "earth",
  Aquarius: "air",
  Pisces: "water",
};

export const ASPECT_CONFIG: Record<
  AspectType,
  { angle: number; orb: number; color: string; symbol: string }
> = {
  conjunction: { angle: 0, orb: 8, color: "#FFD700", symbol: "☌" },
  sextile: { angle: 60, orb: 6, color: "#87CEEB", symbol: "⚹" },
  square: { angle: 90, orb: 8, color: "#E25822", symbol: "□" },
  trine: { angle: 120, orb: 8, color: "#4169E1", symbol: "△" },
  opposition: { angle: 180, orb: 8, color: "#FF4500", symbol: "☍" },
};

export const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  Chiron: "⚷",
  "North Node": "☊",
  "South Node": "☋",
  Lilith: "⚸",
  "Part of Fortune": "⊗",
  Ascendant: "AC",
  Midheaven: "MC",
};

// --- Transit Types ---

export interface TransitAspect {
  transitPlanet: string;
  transitSign: string;
  transitDegree: number;
  natalPlanet: string;
  natalSign: string;
  natalDegree: number;
  aspectType: AspectType;
  orb: number;
  applying: boolean;
  significance: "major" | "moderate" | "minor";
}

export interface TransitPosition {
  id: string;
  name: string;
  longitude: number;
  sign: string;
  degree: number;
  minute: number;
  retrograde: boolean;
  natalHouse: number; // which natal house the transit planet is in
}

export interface TransitData {
  currentPositions: TransitPosition[];
  transitAspects: TransitAspect[];
  activatedPlacements: ActivatedPlacement[];
  moonPhase: MoonPhase;
  calculatedAt: string;
}

export interface ActivatedPlacement {
  natalPlanet: string;
  natalSign: string;
  natalHouse: number;
  activatedBy: string; // transit planet name
  aspectType: AspectType;
  orb: number;
  theme: string;
}

export interface MoonPhase {
  phase: string;
  illumination: number;
  emoji: string;
}

// --- Focus Area Types ---

export interface FocusArea {
  area: string;
  emoji: string;
  summary: string;
  activePlanets: string[];
}

export interface MonthlyTheme {
  title: string;
  description: string;
  keyTransits: string[];
}

export interface JournalPrompt {
  prompt: string;
  relatedPlacement: string;
}

export interface ManifestationMission {
  mission: string;
  basedOn: string;
  actionStep: string;
}

export interface NextBestStep {
  message: string;
  cta: string;
  link: string;
}

export interface CosmicForecast {
  biggestOpportunity: string;
  biggestChallenge: string;
  sayYesTo: string;
  avoid: string;
  luckyDays: string[];
  manifestationDates: string[];
}

export interface YourSznData {
  birthData: BirthData;
  risingSign: string;
  sunSign: string;
  moonSign: string;
  transits: TransitData;
  theme: MonthlyTheme;
  focusAreas: FocusArea[];
  manifestationMission: ManifestationMission;
  journalPrompts: JournalPrompt[];
  forecast: CosmicForecast;
  nextBestStep: NextBestStep;
  recommendations: Recommendation[];
}

export interface Recommendation {
  type: "article" | "hypnosis" | "tapping" | "workshop" | "reading" | "placement" | "podcast";
  title: string;
  description: string;
  basedOn: string;
  emoji: string;
}
