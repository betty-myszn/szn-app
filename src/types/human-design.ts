import type { CenterKey } from "@/lib/human-design-constants";
import type { BirthData } from "@/types/chart";

export type HDTypeName =
  | "Manifestor"
  | "Generator"
  | "Manifesting Generator"
  | "Projector"
  | "Reflector";

export type HDAuthorityKey =
  | "emotional"
  | "sacral"
  | "splenic"
  | "ego"
  | "self"
  | "mental"
  | "lunar";

export type HDDefinition =
  | "No Definition"
  | "Single Definition"
  | "Split Definition"
  | "Triple Split Definition"
  | "Quadruple Split Definition";

export type HDCrossAngle = "Right Angle" | "Left Angle" | "Juxtaposition";

// One planetary activation: a body sitting in a gate and line, in either the
// Personality (conscious, birth moment) or Design (unconscious, ~88 deg earlier) chart.
export interface HDActivation {
  body: string;
  longitude: number;
  gate: number;
  line: number;
}

export interface HDChannel {
  key: string; // "10-34"
  gates: [number, number];
  name: string;
  centers: [CenterKey, CenterKey];
}

export interface HDIncarnationCross {
  angle: HDCrossAngle;
  // [personality Sun, personality Earth, design Sun, design Earth]
  gates: [number, number, number, number];
}

export interface HumanDesignData {
  birthData: BirthData;
  utcBirthTime: string;
  designUtcTime: string;

  type: HDTypeName;
  strategy: string;
  notSelfTheme: string;
  signature: string;

  authority: HDAuthorityKey;
  authorityLabel: string;

  profile: string; // "3/5"
  definition: HDDefinition;
  incarnationCross: HDIncarnationCross;

  personality: HDActivation[];
  design: HDActivation[];
  activatedGates: number[];
  definedChannels: HDChannel[];
  definedCenters: CenterKey[];
  openCenters: CenterKey[];

  calculatedAt: string;
}
