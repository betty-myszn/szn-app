/**
 * Money Blueprint — the generator.
 *
 * birth data in, complete print-ready report out. Fully deterministic: no model, no network, no
 * credentials. The same birth data always produces the same report.
 */

import { calculateChart } from "@/lib/astrology";
import { calculateHumanDesign } from "@/lib/human-design";
import type { BirthData } from "@/types/chart";
import { deriveMoneyFacts, type MoneyChartFacts, type HumanDesignFactsInput } from "../facts";
import { REPORT_SECTIONS, PARTS, SHADOW_TEMPLATE, DERIVED_FROM_SHADOWS } from "../sections";
import { WRITERS } from "./writers";
import type { WrittenSection, Block } from "./blocks";
import { shadowlist, compact } from "./blocks";
import { renderReport, renderForMeasure, pagesNeeded, type RenderInput } from "./render";
import { themeContent, MONEY_HOUSE, MONEY_SIGN } from "./vocab";
import { ord, bodyName, seedFrom, cap, list } from "./phrases";
import { buildTiming } from "./timing-lite";
import { pickShadowThemes } from "./shadows";

export interface GenerateOptions {
  motifs?: { cash?: string; saturn?: string };
  now?: Date;
  /** Exact block heights from a measuring pass, keyed by section id. */
  measured?: Record<string, number[]>;
  /** Emit the measuring document instead of the report. */
  measureMode?: boolean;
}

export interface GeneratedReport {
  html: string;
  facts: MoneyChartFacts;
  sections: WrittenSection[];
  shadows: Array<{ theme: string; label: string; labels: string[]; sources: string[] }>;
  pageCount: number;
  warnings: string[];
}

/** Page budget per section id. Shadows get three each; the rest are set by shape. */
const PAGES: Record<string, number> = {
  "money-identity": 2, "loudest-house": 2, "income-mechanism": 2, "hd-money": 2,
  "open-centres": 2, "money-gifts": 2, "childhood-programming": 2, "chiron-money": 2,
  "inherited-beliefs": 2, receiving: 2, "nervous-system": 2, purpose: 2,
  "money-karma": 1, power: 2, "earning-design": 2, "business-models": 2,
  "income-streams": 2, pricing: 2, visibility: 2, "sales-style": 2,
  "money-management": 2, "current-season": 2, "years-ahead": 2, risks: 2,
  "highest-timeline": 2, "future-self-letter": 2, "the-thread": 1,
  journal: 2, affirmations: 1, rituals: 2, challenge: 2,
  "betty-letter": 1,
};

const PART_OF: Record<string, number> = {
  "money-identity": 1, "loudest-house": 1, "income-mechanism": 1, "hd-money": 1, "open-centres": 1, "money-gifts": 1,
  shadow: 2,
  "childhood-programming": 3, "chiron-money": 3, "inherited-beliefs": 3, receiving: 3, "nervous-system": 3,
  purpose: 4, "money-karma": 4, power: 4,
  "earning-design": 5, "business-models": 5, "income-streams": 5, pricing: 5, visibility: 5, "sales-style": 5, "money-management": 5,
  "current-season": 6, "years-ahead": 6, risks: 6,
  "highest-timeline": 7, "future-self-letter": 7, "the-thread": 7, journal: 7,
  affirmations: 7, rituals: 7, challenge: 7, "betty-letter": 7,
};

const TITLES: Record<string, string> = {
  "money-identity": "Your Money Identity", "loudest-house": "Your Loudest House",
  "income-mechanism": "Your Income Mechanism", "hd-money": "Your Human Design Money Blueprint",
  "open-centres": "Your Open Centres and Conditioning", "money-gifts": "Your Natural Money Gifts",
  "childhood-programming": "Childhood Programming", "chiron-money": "Chiron and Money",
  "inherited-beliefs": "Inherited Money Beliefs", receiving: "Where You Block Receiving",
  "nervous-system": "Your Nervous System and Money", purpose: "Your Purpose",
  "money-karma": "Your Money Karma", power: "Power and Money",
  "earning-design": "How You're Designed to Earn", "business-models": "Best Business Models",
  "income-streams": "Best Income Streams", pricing: "Pricing Energy",
  visibility: "Your Visibility Blueprint", "sales-style": "Sales and Marketing Style",
  "money-management": "Spending, Saving and Investing", "current-season": "Your Current Money Season",
  "years-ahead": "Your Money Years Ahead", risks: "Risks to Watch",
  "highest-timeline": "Your Highest Financial Timeline", "future-self-letter": "A Letter From Your Wealthiest Self",
  "the-thread": "The Thread", journal: "Journal Prompts",
  affirmations: "Your Affirmations", rituals: "Your Money Rituals",
  challenge: "Your 30-Day Money Challenge", "betty-letter": "A Letter From Betty",
};

/** Rotated so the closing callout does not read as the same stamp on every page. */
export const ACTION_LABELS: Record<number, string[]> = {
  1: ["Your move this week", "Start here", "One thing to try"],
  3: ["The work here", "Where to begin", "Your move this week"],
  4: ["Your next step", "Start here", "The move"],
  5: ["Put it into practice", "Your move this week", "Try this"],
  6: ["This season's instruction", "What to do now", "Your move"],
  7: ["Your move this week", "Begin here", "The practice"],
};

const BG: Record<string, WrittenSection["bg"]> = {
  "money-gifts": "gold", pricing: "cream", "the-thread": "pinkbg",
  "future-self-letter": "gold", "betty-letter": "dark", affirmations: "mint", challenge: "pinkbg",
};

/** Headline per section, with {pk} marking the accent. Some are chart-dependent. */
function headlineFor(id: string, f: MoneyChartFacts): string {
  const loud = Object.values(f.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
  const second = f.houses[2];
  const map: Record<string, string> = {
    "money-identity": `who you are with {pk}money.{/pk}`,
    "loudest-house": loud ? `${loud.occupants.length} bodies in the house of {pk}${MONEY_HOUSE[loud.house]?.label}.{/pk}` : "your loudest {pk}house.{/pk}",
    "income-mechanism": second?.rulerHouse ? `your money arrives through {pk}${MONEY_HOUSE[second.rulerHouse]?.label}.{/pk}` : "how money {pk}reaches you.{/pk}",
    "hd-money": f.humanDesign ? `a {pk}${f.humanDesign.type.toLowerCase()}{/pk} and what that costs.` : "your {pk}design.{/pk}",
    "open-centres": `where you take on {pk}what is not yours.{/pk}`,
    "money-gifts": `the things that come {pk}easily{/pk} to you.`,
    "childhood-programming": `what you learned money {pk}meant.{/pk}`,
    "chiron-money": `the wound, and what it {pk}built{/pk} in you.`,
    "inherited-beliefs": `the beliefs that arrived {pk}before you did.{/pk}`,
    receiving: `an income is a {pk}receiving{/pk} mechanism.`,
    "nervous-system": `your patterns move through the {pk}body.{/pk}`,
    purpose: `what you came here to {pk}build.{/pk}`,
    "money-karma": `the same lesson, in a different {pk}outfit.{/pk}`,
    power: `your relationship with {pk}power.{/pk}`,
    "earning-design": `the rhythm you were {pk}built for.{/pk}`,
    "business-models": `models your chart actively {pk}supports.{/pk}`,
    "income-streams": `ranked by what your chart {pk}supports.{/pk}`,
    pricing: `price from the {pk}document,{/pk} never the room.`,
    visibility: `the strange parts are what people {pk}pay for.{/pk}`,
    "sales-style": `say the true thing, then say the {pk}price.{/pk}`,
    "money-management": `what you do with money once you {pk}have{/pk} it.`,
    "current-season": `where you are {pk}right now.{/pk}`,
    "years-ahead": `the cycles you can {pk}plan around.{/pk}`,
    risks: `the specific ways this chart {pk}loses money.{/pk}`,
    "highest-timeline": `the woman who charges most for what comes {pk}easiest.{/pk}`,
    "future-self-letter": `a letter from {pk}later.{/pk}`,
    "the-thread": `the block and the gift live in the {pk}same house.{/pk}`,
    journal: `questions built from {pk}your{/pk} placements.`,
    eft: `one script per {pk}shadow.{/pk}`,
    hypnosis: `for the parts that do not respond to {pk}reasoning.{/pk}`,
    affirmations: `say them in {pk}your own voice.{/pk}`,
    rituals: `practices that fit your {pk}design.{/pk}`,
    challenge: `one month, built from your {pk}shadows.{/pk}`,
    "betty-letter": `one last {pk}thing.{/pk}`,
  };
  return map[id] ?? id;
}

/** Which facts each section may name, as readable labels. */
function readFromFor(id: string, f: MoneyChartFacts, shadowSources?: string[]): string[] {
  const out: string[] = [];
  const P = (k: string) => {
    const p = f.placements[k];
    return p ? `${bodyName(p.planet)} in ${p.sign}${p.house ? ` in the ${ord(p.house)} house` : ""}${p.retrograde ? " (Rx)" : ""}` : null;
  };
  const H = (n: number) => {
    const h = f.houses[n];
    if (!h) return null;
    return `${ord(n)} house in ${h.sign}${h.occupants.length ? `, containing ${h.occupants.map(bodyName).join(", ")}` : ", empty"}${h.rulerSign ? `, ruled by ${bodyName(h.ruler)} in ${h.rulerSign}${h.rulerHouse ? ` in the ${ord(h.rulerHouse)}` : ""}` : ""}`;
  };
  const HD = () => f.humanDesign ? `${f.humanDesign.type}, ${f.humanDesign.authorityLabel}, ${f.humanDesign.profile} profile` : null;
  const OPEN = () => f.humanDesign?.openCenters?.length ? `Open centres: ${f.humanDesign.openCenters.join(", ")}` : null;
  const tightHard = f.aspects.filter((a) => a.hard).sort((a, b) => a.orb - b.orb)[0];
  const ASP = (a?: typeof tightHard) => a ? `${bodyName(a.a)} ${a.type} ${bodyName(a.b)}, orb ${a.orb.toFixed(1)}°` : null;

  const push = (...xs: Array<string | null>) => xs.forEach((x) => { if (x && !out.includes(x)) out.push(x); });

  switch (id) {
    case "money-identity": push(f.risingSign ? `${f.risingSign} rising` : null, P("sun"), P("moon"), P("lilith"),
      `${cap(f.balance.dominantElement)} dominant, ${f.balance.dominantModality} modality`); break;
    case "loudest-house": {
      const loud = Object.values(f.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
      push(loud ? H(loud.house) : null, f.stelliums.length ? `Stellium in ${f.stelliums[0].kind === "house" ? `the ${ord(Number(f.stelliums[0].where))} house` : f.stelliums[0].where}` : null);
      break;
    }
    case "income-mechanism": push(H(2), H(11), H(10), HD()); break;
    case "hd-money": push(HD(), OPEN(), f.humanDesign?.definedCenters?.length ? `Defined: ${f.humanDesign.definedCenters.join(", ")}` : null,
      f.humanDesign?.incarnationCross?.gates?.length ? `Incarnation cross gates ${f.humanDesign.incarnationCross.gates.join(", ")}` : null); break;
    case "open-centres": push(OPEN(), f.humanDesign?.definedCenters?.length ? `Defined: ${f.humanDesign.definedCenters.join(", ")}` : null); break;
    case "money-gifts": { const loud = Object.values(f.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
      push(loud ? H(loud.house) : null, P("mercury"), P("jupiter"), P("part_of_fortune"), HD()); break; }
    case "childhood-programming": push(P("chiron"), P("moon"), H(4), P("south_node")); break;
    case "chiron-money": { const ca = f.aspects.filter((a) => a.a === "chiron" || a.b === "chiron").sort((a, b) => a.orb - b.orb)[0];
      push(P("chiron"), ASP(ca), P("part_of_fortune")); break; }
    case "inherited-beliefs": push(H(8), H(4), P("saturn"), P("pluto"), P("moon")); break;
    case "receiving": { const va = f.aspects.filter((a) => (a.a === "venus" || a.b === "venus") && a.hard).sort((a, b) => a.orb - b.orb)[0];
      push(P("venus"), ASP(va), OPEN(), P("sun")); break; }
    case "nervous-system": push(HD(), OPEN(), `${cap(f.balance.dominantElement)} dominant`); break;
    case "purpose": push(P("north_node"), P("south_node"), P("part_of_fortune")); break;
    case "money-karma": push(P("south_node"), P("north_node")); break;
    case "power": push(P("pluto"), P("saturn"), f.humanDesign?.incarnationCross?.gates?.length ? `Cross gates ${f.humanDesign.incarnationCross.gates.join(", ")}` : null); break;
    case "earning-design": push(HD(), H(2), OPEN()); break;
    case "business-models": { const loaded = Object.values(f.houses).filter((h) => h.occupants.length >= 2).sort((a, b) => b.occupants.length - a.occupants.length);
      loaded.slice(0, 3).forEach((h) => push(H(h.house))); push(H(2), HD()); break; }
    case "income-streams": push(H(2), P("part_of_fortune"), P("jupiter"), P("mercury")); break;
    case "pricing": { const va = f.aspects.filter((a) => (a.a === "venus" || a.b === "venus") && a.hard).sort((a, b) => a.orb - b.orb)[0];
      push(ASP(va), OPEN(), H(2), P("sun")); break; }
    case "visibility": push(f.chartRuler?.sign ? `${f.risingSign} rising, ruled by ${bodyName(f.chartRuler.planet)} in ${f.chartRuler.sign}${f.chartRuler.house ? ` in the ${ord(f.chartRuler.house)}` : ""}` : null,
      H(10), P("lilith")); break;
    case "sales-style": push(HD(), P("mercury"), OPEN()); break;
    case "money-management": push(P("venus"), H(2), P("neptune"), `${cap(f.balance.dominantModality)} dominant`); break;
    case "current-season": push("Annual profection", "Current slow-planet transits to your natal houses"); break;
    case "years-ahead": push(P("jupiter"), P("saturn"), P("chiron"), "Nodal cycle"); break;
    case "risks": push(P("neptune"), P("saturn"), OPEN()); break;
    case "highest-timeline": push(f.chartRuler?.sign ? `Chart ruler ${bodyName(f.chartRuler.planet)} in ${f.chartRuler.sign}` : null, H(2), P("north_node"), HD()); break;
    case "the-thread": { const loud = Object.values(f.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
      push(loud ? H(loud.house) : null, ASP(tightHard)); break; }
    case "shadow": (shadowSources ?? []).slice(0, 5).forEach((s) => push(s)); break;
    default: break;
  }
  return out.filter(Boolean).slice(0, 6);
}

export function generateMoneyBlueprint(birthData: BirthData, opts: GenerateOptions = {}): GeneratedReport {
  const warnings: string[] = [];
  const chart = calculateChart(birthData);
  const hd = calculateHumanDesign(birthData) as unknown as HumanDesignFactsInput;
  const facts = deriveMoneyFacts(chart, hd);
  const seed = seedFrom(`${birthData.dateOfBirth}${birthData.birthTime}${birthData.location.latitude}`);
  const timing = buildTiming(facts, birthData, opts.now ?? new Date(), chart.houses.map((h) => h.longitude));
  const shadows = pickShadowThemes(facts);

  if (shadows.length < 3) warnings.push(`Only ${shadows.length} shadows resolved; report will be shorter than standard.`);

  const written: WrittenSection[] = [];
  const claimed = new Set<string>();
  let actionCount = 0;
  let n = 1;

  const orderedIds = [
    "money-identity", "loudest-house", "income-mechanism", "hd-money", "open-centres", "money-gifts",
    "__shadows__",
    "childhood-programming", "chiron-money", "inherited-beliefs", "receiving", "nervous-system",
    "purpose", "money-karma", "power",
    "earning-design", "business-models", "income-streams", "pricing", "visibility", "sales-style", "money-management",
    "current-season", "years-ahead", "risks",
    "highest-timeline", "future-self-letter", "the-thread",
    "journal", "affirmations", "rituals", "challenge", "betty-letter",
  ];

  for (const id of orderedIds) {
    if (id === "__shadows__") {
      // shadow chapter opener
      written.push(Object.assign({
        id: "shadows-opener", number: null as number | null, title: "Your Biggest Money Shadows", part: 2,
        headline: `your biggest money {pk}shadows.{/pk}`, readFrom: [] as string[], bg: "mint" as const,
        blocks: compact([
          { kind: "p" as const, text: `Your chart carries ${shadows.length}. For each one you get where it came from, how it shows up in your money, what it costs, and the protocol for clearing it.` },
          shadowlist(shadows.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: themeContent(s.theme).shadow, s: s.label }))),
        ]),
      }, { pages: 1 }));

      shadows.forEach((s, i) => {
        const blocks = WRITERS.shadow({ facts, seed, readFrom: [], shadow: { ...s, index: i, total: shadows.length }, shadows, timing });
        written.push(Object.assign({
          id: `shadow-${s.theme}`, number: n++, title: themeContent(s.theme).shadow, part: 2,
          headline: `the {pk}${themeContent(s.theme).shadow.replace(/^The /, "").toLowerCase()}.{/pk}`,
          readFrom: s.labels.slice(0, 5), blocks, bg: "cream" as const,
        }, { pages: pagesNeeded(blocks) }));
      });
      continue;
    }

    const writer = WRITERS[id];
    if (!writer) { warnings.push(`No writer for section "${id}".`); continue; }
    const blocks = writer({ facts, seed, readFrom: [], shadows, timing });
    if (!blocks.length) { warnings.push(`Section "${id}" produced no content and was skipped.`); continue; }

    // Claims ledger: a sentence already used verbatim in an earlier chapter is dropped rather than
    // repeated, so each section has to add something new.
    const deduped = blocks.filter((b) => {
      if (b.kind !== "p") return true;
      const key = b.text.slice(0, 90);
      if (claimed.has(key)) return false;
      claimed.add(key);
      return true;
    });
    const part = PART_OF[id] ?? 1;
    const labels = ACTION_LABELS[part] ?? ["Your move this week"];
    let ai = 0;
    for (const b of deduped) {
      if (b.kind === "action" && b.label === "Your move this week") {
        b.label = labels[(actionCount + ai) % labels.length];
        ai++;
      }
    }
    actionCount += ai;

    written.push(Object.assign({
      id, number: n++, title: TITLES[id] ?? id, part,
      headline: headlineFor(id, facts), readFrom: readFromFor(id, facts),
      blocks: deduped, bg: BG[id] ?? ("cream" as const),
    }, { pages: pagesNeeded(deduped) }));
  }

  // ---- front matter data
  const loud = Object.values(facts.houses).sort((a, b) => b.occupants.length - a.occupants.length)[0];
  const second = facts.houses[2];
  const tightHard = facts.aspects.filter((a) => a.hard).sort((a, b) => a.orb - b.orb)[0];

  const glance = {
    cards: [
      loud ? { h: "The headline", p: `${loud.occupants.length} ${loud.occupants.length === 1 ? "body" : "bodies"} in your ${ord(loud.house)} house of ${MONEY_HOUSE[loud.house]?.label}. The loudest signal in your chart, and it changes how everything else reads.` } : { h: "The headline", p: "Your chart spreads its weight evenly, which makes the house rulers the story rather than any single stack." },
      second?.rulerHouse ? { h: "Your income channel", p: `${ord(2)} house in ${second.sign}${second.occupants.length ? "" : ", empty"}, ruled by ${bodyName(second.ruler)} in your ${ord(second.rulerHouse)}. Your money arrives through ${MONEY_HOUSE[second.rulerHouse]?.channel}.` } : { h: "Your income channel", p: "Your second house tells the income story directly." },
      tightHard ? { h: "The worth aspect", p: `${bodyName(tightHard.a)} ${tightHard.type} ${bodyName(tightHard.b)}, orb ${tightHard.orb.toFixed(1)}°. The tightest hard aspect you carry, and the origin of the pricing pattern.` } : { h: "The pattern", p: "No tight hard aspects, which makes this a smoother chart to earn in and an easier one to drift in." },
      facts.humanDesign ? { h: "Your design", p: `${facts.humanDesign.type}, ${facts.humanDesign.authorityLabel}, ${facts.humanDesign.profile} profile, ${facts.humanDesign.openCenters.length} open centres.` } : { h: "Your design", p: "Human Design was not available for this chart." },
    ],
    rows: Object.values(facts.placements).map((p) => [bodyName(p.planet), `${p.sign}${p.retrograde ? ", retrograde" : ""}`, p.house ? `${ord(p.house)}` : "—"]),
    footnote: `Element balance: ${Object.entries(facts.balance.elements).map(([k, v]) => `${k} ${v}`).join(", ")}. Modality: ${Object.entries(facts.balance.modalities).map(([k, v]) => `${k} ${v}`).join(", ")}.${facts.stelliums.length ? ` Stelliums: ${facts.stelliums.map((s) => s.kind === "house" ? `${ord(Number(s.where))} house` : s.where).join(", ")}.` : ""}${facts.retrogrades.length ? ` Retrograde at birth: ${facts.retrogrades.map(bodyName).join(", ")}.` : ""}`,
  };

  const contents: RenderInput["contents"] = [];
  let lastPart = 0;
  for (const s of written) {
    if (s.part !== lastPart) {
      lastPart = s.part;
      contents.push({ number: null, title: `__part__${PART_TITLES[s.part]}`, part: s.part });
    }
    contents.push({ number: s.number, title: s.title, part: s.part });
  }

  const renderInput: RenderInput = {
    name: facts.name,
    birthLine: `${birthData.dateOfBirth} · ${birthData.birthTime} · ${birthData.location.placeName}`,
    chartLine: `${facts.risingSign} rising · ${facts.placements.sun?.sign} Sun · ${facts.placements.moon?.sign} Moon`,
    sections: written,
    parts: [1, 2, 3, 4, 5, 6, 7].map((pn) => ({ part: pn, title: PART_HEADLINES[pn], lede: PART_LEDES[pn] })),
    contents,
    glance,
    motifs: opts.motifs,
    measured: opts.measured,
  };
  const html = opts.measureMode ? renderForMeasure(renderInput) : renderReport(renderInput);

  const pageCount = (html.match(/<section class="page/g) ?? []).length;
  return { html, facts, sections: written, shadows, pageCount, warnings };
}

const PART_TITLES: Record<number, string> = {
  1: "One · Who you are with money", 2: "Two · Your shadows", 3: "Three · The roots",
  4: "Four · Purpose and direction", 5: "Five · How you earn", 6: "Six · Timing", 7: "Seven · The work",
};
const PART_HEADLINES: Record<number, string> = {
  1: "who you are<br>with {pk}money.{/pk}", 2: "your biggest<br>money {pk}shadows.{/pk}",
  3: "the {pk}roots{/pk}<br>underneath it.", 4: "purpose and<br>{pk}direction.{/pk}",
  5: "how you<br>actually {pk}earn.{/pk}", 6: "your money<br>{pk}timing.{/pk}",
  7: "the {pk}work{/pk}<br>itself.",
};
const PART_LEDES: Record<number, string> = {
  1: "The structural material. This part does not change with the seasons and it has been true since the moment you were born.",
  2: "The four patterns that set your ceiling. For each one: where it came from, how it shows up, what it costs, and the way through.",
  3: "Where the shadows were installed. Your childhood, your inherited beliefs, and what your nervous system decided before you could speak.",
  4: "What you came here to build, what you have already mastered, and where your real power with money lives.",
  5: "The practical mechanics, read from your chart rather than from anybody else's playbook.",
  6: "Where you are in your own cycles right now, and the years ahead that matter most for your money.",
  7: "Your timeline, your letter, and every prompt, script, ritual and challenge in one place.",
};
