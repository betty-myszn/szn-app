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
};
