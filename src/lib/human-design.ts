import swisseph from "swisseph";
import path from "path";
import { birthDataToUtc } from "@/lib/astrology";
import type { BirthData } from "@/types/chart";
import {
  type CenterKey,
  CENTERS,
  CENTER_LABELS,
  MOTOR_CENTERS,
  WHEEL_START_DEG,
  GATE_ARC,
  LINE_ARC,
  GATE_WHEEL,
  GATE_CENTER,
  CHANNEL_PAIRS,
  CHANNEL_NAME,
  channelKey,
} from "@/lib/human-design-constants";
import type {
  HumanDesignData,
  HDActivation,
  HDChannel,
  HDTypeName,
  HDAuthorityKey,
  HDDefinition,
  HDCrossAngle,
} from "@/types/human-design";

const EPHE_PATH = path.join(process.cwd(), "ephe");
swisseph.swe_set_ephe_path(EPHE_PATH);

// The 13 bodies of a Human Design chart, in Jovian Archive display order.
// Earth and South Node are derived (opposite Sun / North Node), so only the
// 11 real bodies are queried from the ephemeris.
const BODIES = [
  { id: "Sun", swissId: swisseph.SE_SUN },
  { id: "Moon", swissId: swisseph.SE_MOON },
  { id: "Mercury", swissId: swisseph.SE_MERCURY },
  { id: "Venus", swissId: swisseph.SE_VENUS },
  { id: "Mars", swissId: swisseph.SE_MARS },
  { id: "Jupiter", swissId: swisseph.SE_JUPITER },
  { id: "Saturn", swissId: swisseph.SE_SATURN },
  { id: "Uranus", swissId: swisseph.SE_URANUS },
  { id: "Neptune", swissId: swisseph.SE_NEPTUNE },
  { id: "Pluto", swissId: swisseph.SE_PLUTO },
  { id: "North Node", swissId: swisseph.SE_TRUE_NODE }, // true node, matching astrology.ts
];

const FLAGS = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;

const norm360 = (deg: number): number => ((deg % 360) + 360) % 360;

function sunLongitude(julianDay: number): number {
  const r = swisseph.swe_calc_ut(julianDay, swisseph.SE_SUN, FLAGS) as {
    longitude: number;
  };
  return r.longitude;
}

// Map an ecliptic longitude to a Human Design gate and line (1-6).
export function longitudeToGateLine(longitude: number): { gate: number; line: number } {
  const adjusted = norm360(longitude - WHEEL_START_DEG);
  const index = Math.floor(adjusted / GATE_ARC) % 64;
  const line = Math.floor((adjusted % GATE_ARC) / LINE_ARC) + 1;
  return { gate: GATE_WHEEL[index], line };
}

// The Design chart is taken at the moment the Sun was exactly 88 degrees of arc
// before its birth position (roughly 88 days earlier). Bisection over a ~20-day
// window either side of that: the Sun moves monotonically here, so the signed
// angular difference crosses zero exactly once.
function findDesignJulianDay(personalityJd: number): number {
  const target = norm360(sunLongitude(personalityJd) - 88);
  let lo = personalityJd - 100;
  let hi = personalityJd - 80;
  let mid = (lo + hi) / 2;
  for (let i = 0; i < 60; i++) {
    mid = (lo + hi) / 2;
    const diff = norm360(sunLongitude(mid) - target + 180) - 180; // [-180, 180)
    if (Math.abs(diff) < 1e-7) break;
    if (diff > 0) hi = mid;
    else lo = mid;
  }
  return mid;
}

function activationsAt(julianDay: number): HDActivation[] {
  const out: HDActivation[] = [];

  const sunLng = sunLongitude(julianDay);
  out.push({ body: "Sun", longitude: sunLng, ...longitudeToGateLine(sunLng) });
  const earthLng = norm360(sunLng + 180);
  out.push({ body: "Earth", longitude: earthLng, ...longitudeToGateLine(earthLng) });

  let northNodeLng = 0;
  for (const body of BODIES) {
    if (body.id === "Sun") continue; // already added, plus Earth
    const r = swisseph.swe_calc_ut(julianDay, body.swissId, FLAGS) as {
      longitude: number;
    };
    const lng = r.longitude;
    if (body.id === "North Node") northNodeLng = lng;
    out.push({ body: body.id, longitude: lng, ...longitudeToGateLine(lng) });
  }

  const southNodeLng = norm360(northNodeLng + 180);
  out.push({ body: "South Node", longitude: southNodeLng, ...longitudeToGateLine(southNodeLng) });

  return out;
}

function centerAdjacency(definedChannels: HDChannel[]): Map<CenterKey, Set<CenterKey>> {
  const graph = new Map<CenterKey, Set<CenterKey>>();
  for (const c of CENTERS) graph.set(c, new Set());
  for (const ch of definedChannels) {
    const [a, b] = ch.centers;
    graph.get(a)!.add(b);
    graph.get(b)!.add(a);
  }
  return graph;
}

function motorConnectsToThroat(graph: Map<CenterKey, Set<CenterKey>>): boolean {
  // BFS out from the Throat; if we reach any motor centre, a motor powers the Throat.
  const seen = new Set<CenterKey>(["throat"]);
  const queue: CenterKey[] = ["throat"];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur !== "throat" && MOTOR_CENTERS.includes(cur)) return true;
    for (const next of graph.get(cur) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

function determineType(defined: Set<CenterKey>, graph: Map<CenterKey, Set<CenterKey>>): HDTypeName {
  if (defined.size === 0) return "Reflector";
  const hasSacral = defined.has("sacral");
  const hasThroat = defined.has("throat");
  const motorToThroat = hasThroat && motorConnectsToThroat(graph);
  if (hasSacral) return motorToThroat ? "Manifesting Generator" : "Generator";
  if (motorToThroat) return "Manifestor";
  return "Projector";
}

function determineAuthority(type: HDTypeName, defined: Set<CenterKey>): HDAuthorityKey {
  if (type === "Reflector") return "lunar";
  if (defined.has("solarplexus")) return "emotional";
  if (defined.has("sacral")) return "sacral";
  if (defined.has("spleen")) return "splenic";
  if (defined.has("heart")) return "ego";
  if (defined.has("g")) return "self";
  return "mental"; // mental Projector: no inner authority, decides via environment
}

function countDefinition(defined: Set<CenterKey>, graph: Map<CenterKey, Set<CenterKey>>): HDDefinition {
  if (defined.size === 0) return "No Definition";
  const seen = new Set<CenterKey>();
  let components = 0;
  for (const start of defined) {
    if (seen.has(start)) continue;
    components++;
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      const cur = queue.shift()!;
      for (const next of graph.get(cur) ?? []) {
        if (defined.has(next) && !seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
  }
  return (
    {
      1: "Single Definition",
      2: "Split Definition",
      3: "Triple Split Definition",
      4: "Quadruple Split Definition",
    } as Record<number, HDDefinition>
  )[components] ?? "Quadruple Split Definition";
}

const RIGHT_ANGLE = new Set(["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6"]);
const LEFT_ANGLE = new Set(["5/1", "5/2", "6/2", "6/3"]);

function crossAngle(profile: string): HDCrossAngle {
  if (RIGHT_ANGLE.has(profile)) return "Right Angle";
  if (LEFT_ANGLE.has(profile)) return "Left Angle";
  return "Juxtaposition"; // 4/1
}

const TYPE_PROFILE: Record<HDTypeName, { strategy: string; notSelf: string; signature: string }> = {
  Manifestor: { strategy: "Inform, then act", notSelf: "Anger", signature: "Peace" },
  Generator: { strategy: "Wait to respond", notSelf: "Frustration", signature: "Satisfaction" },
  "Manifesting Generator": {
    strategy: "Wait to respond, then inform",
    notSelf: "Frustration and anger",
    signature: "Satisfaction",
  },
  Projector: { strategy: "Wait for the invitation", notSelf: "Bitterness", signature: "Success" },
  Reflector: { strategy: "Wait a lunar cycle", notSelf: "Disappointment", signature: "Surprise" },
};

const AUTHORITY_LABEL: Record<HDAuthorityKey, string> = {
  emotional: "Emotional (Solar Plexus)",
  sacral: "Sacral",
  splenic: "Splenic",
  ego: "Ego (Heart / Will)",
  self: "Self-Projected (G)",
  mental: "Mental (no inner authority)",
  lunar: "Lunar (Reflector)",
};

export function calculateHumanDesign(birthData: BirthData): HumanDesignData {
  const { utcDateTime } = birthDataToUtc(birthData);
  const hour = utcDateTime.hour + utcDateTime.minute / 60 + utcDateTime.second / 3600;
  const personalityJd = swisseph.swe_julday(
    utcDateTime.year,
    utcDateTime.month,
    utcDateTime.day,
    hour,
    swisseph.SE_GREG_CAL
  ) as unknown as number;

  const designJd = findDesignJulianDay(personalityJd);

  const personality = activationsAt(personalityJd);
  const design = activationsAt(designJd);

  const activatedGates = Array.from(
    new Set([...personality, ...design].map((a) => a.gate))
  ).sort((a, b) => a - b);
  const gateSet = new Set(activatedGates);

  const definedChannels: HDChannel[] = [];
  for (const [g1, g2] of CHANNEL_PAIRS) {
    if (gateSet.has(g1) && gateSet.has(g2)) {
      definedChannels.push({
        key: channelKey(g1, g2),
        gates: [g1, g2],
        name: CHANNEL_NAME[channelKey(g1, g2)] ?? "",
        centers: [GATE_CENTER[g1], GATE_CENTER[g2]],
      });
    }
  }

  const definedSet = new Set<CenterKey>();
  for (const ch of definedChannels) {
    definedSet.add(ch.centers[0]);
    definedSet.add(ch.centers[1]);
  }
  const graph = centerAdjacency(definedChannels);

  const type = determineType(definedSet, graph);
  const authority = determineAuthority(type, definedSet);
  const definition = countDefinition(definedSet, graph);

  const pSun = personality.find((a) => a.body === "Sun")!;
  const pEarth = personality.find((a) => a.body === "Earth")!;
  const dSun = design.find((a) => a.body === "Sun")!;
  const dEarth = design.find((a) => a.body === "Earth")!;
  const profile = `${pSun.line}/${dSun.line}`;

  const typeInfo = TYPE_PROFILE[type];

  return {
    birthData,
    utcBirthTime: utcDateTime.toFormat("yyyy-MM-dd HH:mm:ss 'UTC'"),
    designUtcTime: designDateString(designJd),

    type,
    strategy: typeInfo.strategy,
    notSelfTheme: typeInfo.notSelf,
    signature: typeInfo.signature,

    authority,
    authorityLabel: AUTHORITY_LABEL[authority],

    profile,
    definition,
    incarnationCross: {
      angle: crossAngle(profile),
      gates: [pSun.gate, pEarth.gate, dSun.gate, dEarth.gate],
    },

    personality,
    design,
    activatedGates,
    definedChannels,
    definedCenters: CENTERS.filter((c) => definedSet.has(c)),
    openCenters: CENTERS.filter((c) => !definedSet.has(c)),

    calculatedAt: new Date().toISOString(),
  };
}

function designDateString(julianDay: number): string {
  const rev = swisseph.swe_revjul(julianDay, swisseph.SE_GREG_CAL) as {
    year: number;
    month: number;
    day: number;
    hour: number;
  };
  const h = Math.floor(rev.hour);
  const m = Math.round((rev.hour - h) * 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${rev.year}-${pad(rev.month)}-${pad(rev.day)} ${pad(h)}:${pad(m)} UTC`;
}

// Re-exported so UI and tests can label centres without importing the constants file.
export { CENTER_LABELS };
