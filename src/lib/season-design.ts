import swisseph from "swisseph";
import path from "path";
import { calculateHumanDesign, longitudeToGateLine } from "@/lib/human-design";
import { getCurrentSeason, formatSeasonDates, SEASONS, type SeasonInfo } from "@/lib/seasons";
import { getSeasonDesign } from "@/lib/season-design-content";
import {
  GATE_NAME,
  GATE_CENTER,
  CENTERS,
  CENTER_LABELS,
  CHANNEL_PAIRS,
  CHANNEL_NAME,
  channelKey,
  type CenterKey,
} from "@/lib/human-design-constants";
import { GATE_CONTENT } from "@/lib/human-design-gate-content";
import { PROFILE_CONTENT } from "@/lib/human-design-content";
import type { BirthData } from "@/types/chart";
import type {
  SeasonDesignReading,
  GateActivation,
  ChannelForming,
} from "@/types/season-design";

const EPHE_PATH = path.join(process.cwd(), "ephe");
swisseph.swe_set_ephe_path(EPHE_PATH);

// The gates the Sun passes through across a season's date range. The Sun moving
// through its own sign is the season's signature Human Design activation: over ~31
// days it sweeps roughly six gates. Sampled twice a day so gate boundaries are not
// missed. Uses the same wheel + ephemeris as the natal engine.
function seasonSunGates(season: SeasonInfo, year: number): Set<number> {
  const gates = new Set<number>();
  const crossesYearEnd = season.endMonth < season.startMonth;
  const startJd = swisseph.swe_julday(year, season.startMonth, season.startDay, 0, swisseph.SE_GREG_CAL) as unknown as number;
  const endJd = swisseph.swe_julday(
    crossesYearEnd ? year + 1 : year,
    season.endMonth,
    season.endDay,
    24,
    swisseph.SE_GREG_CAL
  ) as unknown as number;

  for (let jd = startJd; jd <= endJd; jd += 0.5) {
    const r = swisseph.swe_calc_ut(jd, swisseph.SE_SUN, swisseph.SEFLG_SWIEPH) as { longitude: number };
    gates.add(longitudeToGateLine(r.longitude).gate);
  }
  return gates;
}

function gateActivation(gate: number, natal: boolean): GateActivation {
  const c = GATE_CONTENT[gate];
  return {
    gate,
    name: GATE_NAME[gate] ?? `Gate ${gate}`,
    keynote: c?.keynote ?? "",
    shadow: c?.shadow ?? "",
    gift: c?.gift ?? "",
    natal,
  };
}

// Build the full Leo-through-Human-Design reading. `sign` defaults to the current
// calendar season; pass one to preview a specific season. Returns null if that
// season has no Human Design definition yet.
export function buildSeasonDesignReading(
  birthData: BirthData,
  date: Date = new Date(),
  sign?: string
): SeasonDesignReading | null {
  const current = getCurrentSeason(date);
  const targetSign = (sign ?? current.sign).toLowerCase();
  const def = getSeasonDesign(targetSign);
  const seasonInfo = SEASONS.find((s) => s.sign.toLowerCase() === targetSign);
  if (!def || !seasonInfo) return null;

  const hd = calculateHumanDesign(birthData);

  const seasonGates = seasonSunGates(seasonInfo, date.getFullYear());
  const natalGates = new Set(hd.activatedGates);

  const permanent: GateActivation[] = [];
  const temporary: GateActivation[] = [];
  for (const gate of Array.from(seasonGates).sort((a, b) => a - b)) {
    if (natalGates.has(gate)) permanent.push(gateActivation(gate, true));
    else temporary.push(gateActivation(gate, false));
  }

  // Channels forming this season: the member holds one gate of a channel, and the
  // season's transit switches on the other. Classic electromagnetic / temporary
  // channel, the "someone appears who completes this energy" experience.
  const channelsForming: ChannelForming[] = [];
  for (const [a, b] of CHANNEL_PAIRS) {
    const aNatal = natalGates.has(a);
    const bNatal = natalGates.has(b);
    if (aNatal === bNatal) continue; // both or neither natal, not a new forming pair
    const natalGate = aNatal ? a : b;
    const otherGate = aNatal ? b : a;
    if (!seasonGates.has(otherGate) || natalGates.has(otherGate)) continue;
    const key = channelKey(a, b);
    channelsForming.push({
      key,
      name: CHANNEL_NAME[key] ?? "",
      natalGate,
      seasonalGate: otherGate,
      centers: [GATE_CENTER[a], GATE_CENTER[b]],
      text: `You already carry gate ${natalGate}, and this season switches on gate ${otherGate}, the other half of the ${CHANNEL_NAME[key] || "channel"} channel. For now you get to feel this whole energy complete, and you may notice people who naturally carry gate ${otherGate} showing up to complete it with you.`,
    });
  }

  const profileContent = PROFILE_CONTENT[hd.profile];
  const definedSet = new Set<CenterKey>(hd.definedCenters);

  // Pass 2 assembly.
  const shortAuthority: Record<string, string> = {
    emotional: "emotional", sacral: "sacral", splenic: "splenic", ego: "heart-led",
    self: "self-projected", mental: "environment-led", lunar: "lunar",
  };
  const weeklyFilled = def.weeklyQuestions.map((q) =>
    q.replace("{strategy}", hd.strategy.toLowerCase()).replace("{authority}", shortAuthority[hd.authority] ?? hd.authority)
  );
  const shadowItems = hd.openCenters.map((c) => ({ centre: CENTER_LABELS[c], text: def.shadowByOpenCentre[c] }));
  const dayIndex = date.getDate();
  const bullets = def.typeStrategy[hd.type];
  const daily = {
    date: date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    astrology: `Today ${seasonInfo.sign} is encouraging ${def.activates.slice(0, 3).join(", ")}.`,
    energy: def.typeLens[hd.type].summary,
    decision: def.authorityLens[hd.authority].summary,
    prompt: weeklyFilled[dayIndex % weeklyFilled.length],
    action: bullets[dayIndex % bullets.length],
    affirmation: def.affirmationByType[hd.type],
  };

  return {
    season: {
      sign: seasonInfo.sign,
      title: def.title,
      dates: formatSeasonDates(seasonInfo),
      intro: def.intro,
      encouraging: def.encouraging,
      activates: def.activates,
    },
    snapshot: {
      type: hd.type,
      strategy: hd.strategy,
      authorityLabel: hd.authorityLabel,
      profile: hd.profile,
      definition: hd.definition,
      signature: hd.signature,
      notSelfTheme: hd.notSelfTheme,
      incarnationCross: `${hd.incarnationCross.angle} (${hd.incarnationCross.gates.join("/")})`,
      typeLens: def.typeLens[hd.type],
    },
    strategy: {
      title: hd.strategy,
      block: def.typeLens[hd.type],
      bullets: def.typeStrategy[hd.type],
    },
    authority: {
      title: hd.authorityLabel,
      block: def.authorityLens[hd.authority],
    },
    profile: {
      code: hd.profile,
      name: profileContent?.title ?? "",
      block: def.profileLens[hd.profile],
    },
    centres: CENTERS.map((key) => {
      const state: "defined" | "open" = definedSet.has(key) ? "defined" : "open";
      return {
        key,
        label: CENTER_LABELS[key],
        state,
        block: def.centreLens[key][state],
      };
    }),
    gates: { permanent, temporary },
    channelsForming,
    incarnationCross: {
      angle: hd.incarnationCross.angle,
      gates: hd.incarnationCross.gates,
      block: def.crossLens[hd.incarnationCross.angle],
    },
    challenge: def.challenge[hd.type],

    business: def.businessLens[hd.type],
    relationships: def.relationshipsLens[hd.type],
    money: def.moneyLens[hd.type],
    shadow: { intro: def.shadowIntro, items: shadowItems },
    practices: def.practices[hd.authority],
    affirmation: def.affirmationByType[hd.type],
    weekly: weeklyFilled,
    daily,

    computedForDate: date.toISOString().slice(0, 10),
  };
}
