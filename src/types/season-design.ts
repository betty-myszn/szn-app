import type { CenterKey } from "@/lib/human-design-constants";
import type { HDTypeName, HDAuthorityKey, HDCrossAngle } from "@/types/human-design";

// ── The per-season definition (the ONLY thing that changes between seasons) ──────
// A season supplies the collective astrology framing plus a Human Design "lens"
// for each element. The engine in season-design.ts combines this with the member's
// natal chart, which never changes, to produce the personalised reading.

// Every element opens up into three layers, so a member gets a full read rather
// than a one-liner: who they are here (identity), how the season moves it for them
// (cycle), and what to do about it (guidance). summary is the collapsed teaser.
export interface SeasonBlock {
  summary: string; // one line, shown before the block is opened
  identity: string; // who you are in this part of your design
  cycle: string; // how this season / cycle is impacting it for you
  guidance: string; // what to actually do with it
}

export interface SeasonDesign {
  sign: string;
  title: string; // "Leo Season"
  element: "fire" | "earth" | "air" | "water";
  intro: string; // the collective energy, plain English
  encouraging: string; // what this season is encouraging
  activates: string[]; // confidence, creativity, visibility, leadership...

  typeLens: Record<HDTypeName, SeasonBlock>; // how this type meets the season (snapshot)
  typeStrategy: Record<HDTypeName, string[]>; // section 2 coaching bullets
  authorityLens: Record<HDAuthorityKey, SeasonBlock>; // decision-making this season
  profileLens: Record<string, SeasonBlock>; // 12 profiles, how each meets the season
  centreLens: Record<CenterKey, { defined: SeasonBlock; open: SeasonBlock }>; // per centre
  crossLens: Record<HDCrossAngle, SeasonBlock>; // life purpose through this season
  challenge: Record<HDTypeName, string>; // the season challenge per type

  // Pass 2: coaching + practice sections.
  businessLens: Record<HDTypeName, SeasonBlock>; // section 9
  relationshipsLens: Record<HDTypeName, SeasonBlock>; // section 10
  moneyLens: Record<HDTypeName, SeasonBlock>; // section 11
  shadowIntro: string; // section 12 framing
  shadowByOpenCentre: Record<CenterKey, string>; // what a given OPEN centre gets triggered into this season
  practices: Record<HDAuthorityKey, SomaticPractice>; // section 13, keyed by how she regulates decisions
  affirmationByType: Record<HDTypeName, string>; // section 13 affirmation
  weeklyQuestions: string[]; // section 15, may contain {strategy} and {authority} tokens
}

export interface SomaticPractice {
  tapping: string;
  breathwork: string;
  journal: string;
  reset: string; // nervous-system reset
}

export interface DailyDashboard {
  date: string;
  astrology: string; // what the collective sky is encouraging today
  energy: string; // her energy reminder (from type)
  decision: string; // her decision reminder (from authority)
  prompt: string; // coaching / journal prompt
  action: string; // one small challenge for today
  affirmation: string;
}

// ── The assembled reading returned to the page ──────────────────────────────────

export interface GateActivation {
  gate: number;
  name: string;
  keynote: string;
  shadow: string;
  gift: string;
  natal: boolean; // true = one of the member's own gates, being amplified
}

export interface ChannelForming {
  key: string;
  name: string;
  natalGate: number; // the gate the member already holds
  seasonalGate: number; // the gate the season is switching on
  centers: [CenterKey, CenterKey];
  text: string;
}

export interface SeasonDesignReading {
  season: {
    sign: string;
    title: string;
    dates: string;
    intro: string;
    encouraging: string;
    activates: string[];
  };
  snapshot: {
    type: HDTypeName;
    strategy: string;
    authorityLabel: string;
    profile: string;
    definition: string;
    signature: string;
    notSelfTheme: string;
    incarnationCross: string;
    typeLens: SeasonBlock;
  };
  strategy: { title: string; block: SeasonBlock; bullets: string[] };
  authority: { title: string; block: SeasonBlock };
  profile: { code: string; name: string; block: SeasonBlock };
  centres: {
    key: CenterKey;
    label: string;
    state: "defined" | "open";
    block: SeasonBlock;
  }[];
  gates: {
    permanent: GateActivation[]; // natal gates the season amplifies
    temporary: GateActivation[]; // borrowed seasonal gates
  };
  channelsForming: ChannelForming[];
  incarnationCross: { angle: HDCrossAngle; gates: number[]; block: SeasonBlock };
  challenge: string;

  // Pass 2
  business: SeasonBlock;
  relationships: SeasonBlock;
  money: SeasonBlock;
  shadow: { intro: string; items: { centre: string; text: string }[] };
  practices: SomaticPractice;
  affirmation: string;
  weekly: string[];
  daily: DailyDashboard;

  computedForDate: string;
}
