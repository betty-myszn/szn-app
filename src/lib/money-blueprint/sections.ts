import type { Theme } from "./themes";

/**
 * The Money Blueprint report spine: the approved 37 sections, plus the two engines added when the
 * architecture was frozen (the Five-Year Roadmap and the Thread).
 *
 * This is the authoritative structure the planner, the writer, the PDF renderer and the contents
 * page all read from, so the report can never drift out of sync with itself.
 *
 * Page budgets are taken from BETTY-REPORT.html rather than from the part totals in REPORT-SPEC.md,
 * because the gold standard is the thing being reproduced: every content section is exactly one
 * page, every shadow is three, every part opens with a divider. 56 pages, 19,600 words, roughly 350
 * words a page. The roadmap and the Thread take it to about 64.
 *
 * Each section declares:
 *
 *  - `reads`: which derived facts it is entitled to speak about. The "Read from" band at the top of
 *    every section is built from this, and the writer is handed nothing else, which is what stops a
 *    section asserting a placement the buyer does not have.
 *  - `themes`: which money themes it speaks to, so stage ③ can hand it the right convergences as
 *    required material rather than hoping the model notices them.
 *  - `shape`: the structural element that renders after the body paragraphs.
 *  - `onMissing`: whether the section is cut from this buyer's report when its facts are absent.
 *    A section may become shorter, but no buyer receives a section that reads as generic.
 *
 * Every section must answer WHY, not just what: the root, the imprint, the nervous-system pattern,
 * what happens unhealed and what happens when it moves. See money-blueprint/engine/ENGINES.md.
 */

export type SectionSource = "engine" | "llm" | "engine+llm";

/** Which of the seven parts a section belongs to. Drives the dividers and the contents page. */
export type Part = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** The structural element a section renders after its body paragraphs. */
export type Shape = "howlist" | "table" | "steps" | "cards" | "pull" | "protocol" | "years" | "none";

export type Extra = "journal" | "eft" | "hypnosis" | "affirmation" | "somatic" | "ritual" | "dates" | "table";

/**
 * What changes this section's shape rather than just its content. Five engines genuinely become a
 * different section rather than the same one with words swapped, and each needs its variants built
 * explicitly. See engine/ENGINES.md.
 */
export type VariantAxis = "type" | "authority" | "strategy" | "openCentreCount";

export interface ReportSection {
  id: string;
  /** The section number in REPORT-SPEC.md. Null for the shadow template and the two new engines,
   *  whose printed numbers depend on how many shadows this buyer's chart produces. */
  spec: number | null;
  part: Part;
  /** Title as it appears in the contents page. The headline inside the section is written per
   *  buyer and is never this string. */
  title: string;
  /** One line under the chapter title. */
  lede: string;
  /** What question this section answers, in one sentence. Goes into the prompt verbatim. */
  purpose: string;
  source: SectionSource;
  /** Page budget, from the gold standard. Roughly 350 words a page. */
  pages: number;
  /** Which fact groups this section may speak about. */
  reads: string[];
  /** Themes this section speaks to, used to pull the right convergences into its payload. */
  themes: Theme[];
  shape: Shape;
  /** Cut this section when it resolves no facts, or keep it and fall back to a wider read. */
  onMissing: "skip" | "fallback";
  /** Requires Human Design. Birth time is required at checkout, so this should never fire. */
  requiresHd?: boolean;
  variantBy?: VariantAxis;
  /** Practical extras this section must close with, beyond the standard action line. */
  extras?: Extra[];
}

export const PARTS: Record<Part, { title: string; lede: string }> = {
  1: { title: "Who you are with money", lede: "Before anyone taught you anything about it." },
  2: { title: "Your biggest money shadows", lede: "The patterns quietly setting your ceiling, where each came from, and the way through." },
  3: { title: "The roots underneath all of it", lede: "What you were handed, and what was never yours to carry." },
  4: { title: "Purpose and direction", lede: "What you are actually here to build, and the lesson that keeps arriving until you do." },
  5: { title: "How you actually earn", lede: "The shapes, the streams, the pricing and the being seen." },
  6: { title: "Your money timing", lede: "Where you are now, and what the next five years are asking of you." },
  7: { title: "The work itself", lede: "Everything above, turned into something you can do this week." },
};

// ---------------------------------------------------------------------------- part one

const PART_ONE: ReportSection[] = [
  {
    id: "money-identity",
    spec: 1,
    part: 1,
    title: "Your Money Identity",
    lede: "Who you are with money before anyone taught you anything about it.",
    purpose: "Who is this person before money is even discussed, and what frame does the rest of the report sit inside.",
    source: "engine+llm",
    pages: 1,
    reads: ["risingSign", "chartRuler", "placements.sun", "placements.moon", "placements.lilith", "balance", "humanDesign.type", "humanDesign.profile"],
    themes: ["worth", "autonomy", "visibility", "safety"],
    shape: "pull",
    onMissing: "fallback",
  },
  {
    id: "loudest-house",
    spec: 2,
    part: 1,
    title: "The Loudest Signal In Your Chart",
    lede: "Where your money story physically lives.",
    purpose: "Where this chart's money story physically lives, and what that concentration does to how money behaves.",
    source: "engine+llm",
    pages: 1,
    reads: ["stelliums", "houses", "placements", "aspects"],
    themes: ["depth", "power", "worth", "visibility"],
    shape: "pull",
    // Falls back to the money house whose ruler scores highest. Cut entirely only when no house
    // clears the threshold, and its page goes to the shadows.
    onMissing: "fallback",
  },
  {
    id: "income-mechanism",
    spec: 3,
    part: 1,
    title: "How Money Actually Reaches You",
    lede: "The structural route money takes to arrive.",
    purpose: "How money structurally reaches this person, traced through the second house ruler to wherever it actually lands.",
    source: "engine+llm",
    pages: 1,
    reads: ["houses.2", "houses.6", "houses.10", "houses.11", "humanDesign.profile", "humanDesign.definedCenters"],
    themes: ["worth", "sustainability", "belonging", "visibility"],
    shape: "pull",
    onMissing: "fallback",
  },
  {
    id: "hd-money",
    spec: 4,
    part: 1,
    title: "Your Human Design Money Blueprint",
    lede: "How you are energetically built to work, sell, receive and decide.",
    purpose: "How this person is built to generate, and what that means for the mechanics of their income.",
    source: "engine+llm",
    pages: 1,
    reads: ["humanDesign.type", "humanDesign.strategy", "humanDesign.authority", "humanDesign.profile", "humanDesign.definition", "humanDesign.incarnationCross", "humanDesign.definedCenters"],
    themes: ["autonomy", "sustainability", "legitimacy", "power"],
    shape: "howlist",
    onMissing: "skip",
    requiresHd: true,
    variantBy: "type",
  },
  {
    id: "open-centres",
    spec: 5,
    part: 1,
    title: "Your Open Centres And Conditioning",
    lede: "Where you take on what is not yours, and what it costs.",
    purpose: "Where this person absorbs and amplifies other people's money energy, and the wisdom the same openness gives them.",
    source: "engine+llm",
    pages: 1,
    reads: ["humanDesign.openCenters", "humanDesign.definedCenters", "houses"],
    themes: ["belonging", "overgiving", "worth", "safety", "sustainability"],
    shape: "table",
    onMissing: "skip",
    requiresHd: true,
    variantBy: "openCentreCount",
  },
  {
    id: "money-gifts",
    spec: 6,
    part: 1,
    title: "Your Natural Money Gifts",
    lede: "What you are unusually good at and quietly discount.",
    purpose: "The talents this person discounts precisely because they are easy, and how each one is already worth money.",
    source: "engine+llm",
    pages: 1,
    reads: ["placements", "aspects", "humanDesign.definedCenters", "humanDesign.definedChannels", "balance"],
    themes: ["worth", "legitimacy", "power", "expansion"],
    shape: "cards",
    onMissing: "fallback",
  },
];

// ---------------------------------------------------------------------------- part two

/**
 * The shadow engine. Runs three to five times per report against a different evidence cluster each
 * time, selected in stage ② rather than fixed. Three pages each, per SAMPLE-SHADOW-3PP.html:
 * recognition and origin, then mechanism and evidence, then cost and protocol.
 *
 * The longest and most important part of the report.
 */
export const SHADOW_TEMPLATE: ReportSection = {
  id: "shadow",
  spec: null,
  part: 2,
  title: "Shadow",
  lede: "Where it came from, how it runs, and the way through.",
  purpose: "One self-sabotage mechanism, traced from the felt experience back to the placements that built it, then forward to the protocol that moves it.",
  source: "engine+llm",
  pages: 3,
  reads: ["placements", "houses", "aspects", "humanDesign.openCenters", "humanDesign.definedChannels", "retrogrades"],
  themes: [],
  shape: "protocol",
  onMissing: "skip",
  extras: ["journal", "eft", "hypnosis", "somatic"],
};

// ---------------------------------------------------------------------------- part three

const PART_THREE: ReportSection[] = [
  {
    id: "childhood-programming",
    spec: 11,
    part: 3,
    title: "Childhood Programming",
    lede: "What you learned money meant before you were old enough to question it.",
    purpose: "What the house they grew up in taught them about wanting, and which of those rules is still running the finances.",
    source: "llm",
    pages: 1,
    reads: ["houses.4", "placements.moon", "placements.saturn", "placements.chiron", "aspects"],
    themes: ["safety", "scarcity", "worth", "belonging"],
    shape: "howlist",
    onMissing: "fallback",
    extras: ["journal"],
  },
  {
    id: "chiron-money",
    spec: 12,
    part: 3,
    title: "Chiron And Money",
    lede: "Your deepest money wound, and the medicine hidden in the same place.",
    purpose: "The wound that became the offering, and why this person is paid most for the thing that once hurt.",
    source: "llm",
    pages: 1,
    reads: ["placements.chiron", "aspects", "houses"],
    themes: ["legitimacy", "worth", "depth"],
    shape: "pull",
    onMissing: "skip",
    extras: ["journal", "somatic"],
  },
  {
    id: "inherited-beliefs",
    spec: 13,
    part: 3,
    title: "Inherited Money Beliefs",
    lede: "What was handed down before you could refuse it.",
    purpose: "Which money beliefs arrived from the family line rather than from experience, and which of them are demonstrably untrue for this chart.",
    source: "llm",
    pages: 1,
    reads: ["houses.8", "houses.4", "placements.moon", "placements.pluto", "placements.saturn", "aspects"],
    themes: ["scarcity", "safety", "control", "depth"],
    shape: "table",
    onMissing: "fallback",
    extras: ["journal"],
  },
  {
    id: "receiving",
    spec: 14,
    part: 3,
    title: "Where You Block Receiving",
    lede: "The exact moment money is offered and something in you flinches.",
    purpose: "Why taking is harder than giving for this person, mechanically, and what has to change in the body for that to shift.",
    source: "llm",
    pages: 1,
    reads: ["placements.venus", "placements.sun", "houses.2", "houses.8", "aspects", "retrogrades", "humanDesign.openCenters"],
    themes: ["receiving", "worth", "overgiving"],
    shape: "howlist",
    onMissing: "fallback",
    extras: ["eft", "somatic"],
  },
  {
    id: "nervous-system",
    spec: 15,
    part: 3,
    title: "Your Nervous System And Money",
    lede: "What your body does around money, and what to do about it.",
    purpose: "What happens physiologically in the moments money is discussed, decided or received, and the decision protocol that fits this authority.",
    source: "engine+llm",
    pages: 1,
    reads: ["humanDesign.authority", "humanDesign.openCenters", "humanDesign.definedCenters", "placements.moon", "placements.mars", "aspects"],
    themes: ["safety", "control", "sustainability"],
    shape: "table",
    onMissing: "fallback",
    variantBy: "authority",
    extras: ["somatic"],
  },
];

// ---------------------------------------------------------------------------- part four

const PART_FOUR: ReportSection[] = [
  {
    id: "purpose",
    spec: 16,
    part: 4,
    title: "Your Purpose",
    lede: "The direction your whole life keeps pulling you, and why your income is part of it.",
    purpose: "What this person is actually here to build, and how the money follows the direction rather than the other way round.",
    source: "llm",
    pages: 1,
    reads: ["placements.north_node", "houses", "aspects", "humanDesign.incarnationCross"],
    themes: ["expansion", "autonomy", "legitimacy"],
    shape: "pull",
    onMissing: "fallback",
    extras: ["journal"],
  },
  {
    id: "money-karma",
    spec: 17,
    part: 4,
    title: "Your Money Karma",
    lede: "The lesson that keeps returning, in a different outfit each time.",
    purpose: "The pattern that repeats across this person's financial life, why it repeats, and what ends it.",
    source: "llm",
    pages: 1,
    reads: ["placements.south_node", "placements.saturn", "houses", "aspects", "retrogrades"],
    themes: ["control", "safety", "scarcity"],
    shape: "howlist",
    onMissing: "fallback",
  },
  {
    id: "power",
    spec: 18,
    part: 4,
    title: "Your Relationship With Power",
    lede: "Agency, other people's money, and what you do with both.",
    purpose: "How this person holds power and other people's money, and where the fear of either is costing them income.",
    source: "llm",
    pages: 1,
    reads: ["placements.pluto", "houses.8", "aspects", "humanDesign.definedChannels", "humanDesign.definedCenters"],
    themes: ["power", "control", "depth", "autonomy"],
    shape: "pull",
    onMissing: "fallback",
  },
];

// ---------------------------------------------------------------------------- part five

const PART_FIVE: ReportSection[] = [
  {
    id: "earning-design",
    spec: 19,
    part: 5,
    title: "How You're Designed To Earn",
    lede: "The shape of working your chart and your design were built for.",
    purpose: "How this person is built to work day to day, and what happens to the income when they work against it.",
    source: "engine+llm",
    pages: 1,
    reads: ["humanDesign.type", "humanDesign.strategy", "humanDesign.authority", "humanDesign.profile", "houses.6", "houses.2", "placements.mars"],
    themes: ["sustainability", "autonomy", "worth"],
    shape: "table",
    onMissing: "fallback",
    variantBy: "type",
  },
  {
    id: "business-models",
    spec: 20,
    part: 5,
    title: "Best Business Models",
    lede: "The shapes that fit, and the one to stop trying.",
    purpose: "Which business models this chart actively supports, ranked, and which one to stop attempting.",
    source: "engine+llm",
    pages: 1,
    reads: ["houses.2", "houses.6", "houses.10", "houses.11", "humanDesign.type", "humanDesign.profile", "humanDesign.definedChannels", "placements.mercury"],
    themes: ["sustainability", "belonging", "autonomy", "expansion"],
    shape: "cards",
    onMissing: "fallback",
  },
  {
    id: "income-streams",
    spec: 21,
    part: 5,
    title: "Best Income Streams",
    lede: "Where the money comes from, ranked by what your chart supports.",
    purpose: "Which specific income streams this blueprint prefers, with a strength rating, and which one is currently underexploited.",
    source: "engine+llm",
    pages: 1,
    reads: ["houses.2", "houses.8", "houses.11", "placements.jupiter", "placements.part_of_fortune", "humanDesign.definedChannels"],
    themes: ["expansion", "receiving", "sustainability", "belonging"],
    shape: "table",
    onMissing: "fallback",
  },
  {
    id: "pricing",
    spec: 22,
    part: 5,
    title: "Pricing Energy",
    lede: "What happens in your body the moment you say the number out loud.",
    purpose: "How to price without this chart sabotaging it, as rules derived from the design rather than from confidence.",
    source: "engine+llm",
    pages: 1,
    reads: ["placements.venus", "placements.saturn", "placements.lilith", "houses.2", "aspects", "humanDesign.openCenters", "humanDesign.authority"],
    themes: ["worth", "receiving", "legitimacy", "scarcity"],
    shape: "steps",
    onMissing: "fallback",
    extras: ["eft", "affirmation"],
  },
  {
    id: "visibility",
    spec: 23,
    part: 5,
    title: "Your Visibility Blueprint",
    lede: "How much you need to be seen to be paid, and what makes you hide.",
    purpose: "How being seen connects to being paid for this chart specifically, and what the hiding is protecting.",
    source: "llm",
    pages: 1,
    reads: ["chartRuler", "houses.10", "placements.lilith", "placements.sun", "aspects", "humanDesign.type", "humanDesign.profile"],
    themes: ["visibility", "autonomy", "belonging", "legitimacy"],
    shape: "howlist",
    onMissing: "fallback",
  },
  {
    id: "sales-style",
    spec: 24,
    part: 5,
    title: "Sales And Marketing Style",
    lede: "How you are built to sell, which is not how anyone taught you.",
    purpose: "How this person is designed to sell and market, and which standard advice will actively break them.",
    source: "engine+llm",
    pages: 1,
    reads: ["humanDesign.strategy", "humanDesign.type", "humanDesign.profile", "placements.mercury", "houses.3", "houses.11"],
    themes: ["visibility", "belonging", "legitimacy"],
    shape: "howlist",
    onMissing: "fallback",
    variantBy: "strategy",
  },
  {
    id: "money-management",
    spec: 25,
    part: 5,
    title: "Spending, Saving And Investing",
    lede: "What happens to money once it arrives.",
    purpose: "What this person actually does with money once it lands, and the structure that suits their modality rather than a generic budget.",
    source: "engine+llm",
    pages: 1,
    reads: ["placements.venus", "placements.saturn", "placements.jupiter", "houses.2", "houses.8", "balance"],
    themes: ["safety", "scarcity", "sustainability", "expansion"],
    shape: "cards",
    onMissing: "fallback",
  },
];

// ---------------------------------------------------------------------------- part six

const PART_SIX: ReportSection[] = [
  {
    id: "current-season",
    spec: 26,
    part: 6,
    title: "Your Current Money Season",
    lede: "Where you are right now, and what it is asking of you.",
    purpose: "What this year is asking financially, traced through the profected house and its year lord rather than stated as a generic transit.",
    source: "engine+llm",
    pages: 1,
    reads: ["timing.profection", "timing.transits", "houses", "placements"],
    themes: ["expansion", "safety", "worth"],
    shape: "pull",
    onMissing: "fallback",
  },
  {
    id: "years-ahead",
    spec: 27,
    part: 6,
    title: "Your Money Years Ahead",
    lede: "The cycles you can plan around.",
    purpose: "The returns and long cycles shaping the next two decades, dated from real birth data.",
    source: "engine+llm",
    pages: 1,
    reads: ["timing.returns", "placements.saturn", "placements.jupiter", "placements.chiron", "placements.north_node"],
    themes: ["expansion", "legitimacy", "sustainability"],
    shape: "table",
    onMissing: "fallback",
    extras: ["dates"],
  },
  {
    id: "risks",
    spec: 28,
    part: 6,
    title: "Risks To Watch",
    lede: "Where this chart tends to leak, and the guard for each.",
    purpose: "Where this specific chart loses money, named as behaviours with a guard for each, ending with the single worst leak.",
    source: "engine+llm",
    pages: 1,
    reads: ["aspects", "placements.neptune", "placements.saturn", "placements.pluto", "humanDesign.openCenters", "humanDesign.notSelfTheme"],
    themes: ["scarcity", "overgiving", "control", "safety"],
    shape: "table",
    onMissing: "fallback",
  },
  {
    id: "five-year-roadmap",
    spec: null,
    part: 6,
    title: "Your Five-Year Financial Roadmap",
    lede: "What the next chapter looks like, year by year.",
    purpose: "What the next five years are asking of this person financially, one year at a time, from profections, returns and computed transits.",
    source: "engine+llm",
    pages: 7,
    reads: ["timing.roadmap", "timing.profection", "timing.returns", "timing.eclipses", "houses", "placements", "humanDesign.strategy", "humanDesign.authority"],
    themes: ["expansion", "sustainability", "safety", "worth"],
    shape: "years",
    onMissing: "skip",
    extras: ["table", "dates", "journal"],
  },
];

// ---------------------------------------------------------------------------- part seven

const PART_SEVEN: ReportSection[] = [
  {
    id: "highest-timeline",
    spec: 29,
    part: 7,
    title: "Your Highest Financial Timeline",
    lede: "Her ordinary Tuesday, described concretely.",
    purpose: "What an ordinary day looks like at the highest expression of this chart, described concretely enough to be recognised rather than wished for.",
    source: "llm",
    pages: 1,
    reads: ["placements.jupiter", "placements.north_node", "houses.2", "houses.10", "houses.11", "humanDesign.signature", "humanDesign.type"],
    themes: ["expansion", "sustainability", "worth", "autonomy"],
    shape: "pull",
    onMissing: "fallback",
  },
  {
    id: "future-self-letter",
    spec: 30,
    part: 7,
    title: "A Letter From Your Wealthiest Self",
    lede: "From her, to you.",
    purpose: "A first-person letter from this person at their second Saturn return, dated from real birth data and referencing their real placements.",
    source: "llm",
    pages: 1,
    reads: ["timing.returns", "placements", "humanDesign.signature"],
    themes: [],
    shape: "none",
    onMissing: "fallback",
  },
  {
    id: "the-thread",
    spec: null,
    part: 7,
    title: "The Thread",
    lede: "Every system telling one story.",
    purpose: "The report's spine convergence expanded: every factor that contributes, shown as one lesson told in several languages.",
    source: "engine+llm",
    // The only section that reads the whole profile rather than an entitled subset, and the only
    // one allowed to reference earlier sections directly. Runs last.
    pages: 1,
    reads: ["placements", "houses", "aspects", "humanDesign"],
    themes: [],
    shape: "pull",
    onMissing: "skip",
  },
  {
    id: "journal",
    spec: 31,
    part: 7,
    title: "Journal Prompts",
    lede: "Questions built from your placements.",
    purpose: "Prompts grouped by the placement that generated them, so each one is traceable to something in this chart.",
    source: "engine+llm",
    pages: 1,
    reads: ["placements", "houses", "humanDesign"],
    themes: [],
    shape: "none",
    onMissing: "fallback",
    extras: ["journal"],
  },
  {
    id: "eft",
    spec: 32,
    part: 7,
    title: "EFT Scripts",
    lede: "Tapping scripts, one for each shadow.",
    purpose: "One tapping script per selected shadow, in the buyer's own language from that shadow's section.",
    source: "llm",
    pages: 1,
    reads: ["placements", "humanDesign.openCenters"],
    themes: [],
    shape: "none",
    onMissing: "fallback",
    extras: ["eft"],
  },
  {
    id: "hypnosis",
    spec: 33,
    part: 7,
    title: "Hypnosis Scripts",
    lede: "For the parts that do not respond to reasoning.",
    purpose: "Four self-hypnosis scripts, for receiving, pricing, visibility and rest, written for this nervous system.",
    source: "llm",
    pages: 1,
    reads: ["placements.moon", "placements.saturn", "placements.chiron", "humanDesign.authority"],
    themes: [],
    shape: "none",
    onMissing: "fallback",
    extras: ["hypnosis"],
  },
  {
    id: "affirmations",
    spec: 34,
    part: 7,
    title: "Your Affirmations",
    lede: "Written for your chart, grouped by the moment you need them.",
    purpose: "Affirmations that answer this chart's actual blocks, grouped by the moment of use so they land instead of bouncing.",
    source: "engine+llm",
    pages: 1,
    reads: ["placements", "humanDesign.signature", "humanDesign.notSelfTheme"],
    themes: [],
    shape: "none",
    onMissing: "fallback",
    extras: ["affirmation"],
  },
  {
    id: "rituals",
    spec: 35,
    part: 7,
    title: "Your Money Rituals",
    lede: "Practices that fit your design.",
    purpose: "Six practices matched to this element balance, design and moon, plus the lunar practices that suit the moon placement.",
    source: "engine+llm",
    pages: 1,
    reads: ["balance", "placements.moon", "humanDesign.type", "humanDesign.authority", "humanDesign.strategy"],
    themes: [],
    shape: "cards",
    onMissing: "fallback",
    extras: ["ritual"],
  },
  {
    id: "challenge",
    spec: 36,
    part: 7,
    title: "Your 30-Day Money Challenge",
    lede: "One month, built from your own shadows.",
    purpose: "A week per selected shadow, each with one structural task and one daily practice.",
    source: "engine+llm",
    pages: 1,
    reads: ["placements", "humanDesign.type", "humanDesign.strategy", "balance"],
    themes: [],
    shape: "table",
    onMissing: "fallback",
  },
  {
    id: "betty-letter",
    spec: 37,
    part: 7,
    title: "A Letter From Betty",
    lede: "One last thing.",
    purpose: "The close, in Betty's own first person, naming what this particular chart is carrying.",
    source: "llm",
    pages: 1,
    reads: ["risingSign", "humanDesign.type"],
    themes: [],
    shape: "none",
    onMissing: "fallback",
  },
];

/**
 * The full spine in report order, with the shadow block represented by a single marker that the
 * planner expands into however many shadows this buyer's chart actually earns.
 */
export const SHADOW_SLOT = "__shadows__" as const;

export const REPORT_SPINE: Array<ReportSection | typeof SHADOW_SLOT> = [
  ...PART_ONE,
  SHADOW_SLOT,
  ...PART_THREE,
  ...PART_FOUR,
  ...PART_FIVE,
  ...PART_SIX,
  ...PART_SEVEN,
];

/** Every fixed section, shadows excluded. */
export const REPORT_SECTIONS: ReportSection[] = REPORT_SPINE.filter(
  (s): s is ReportSection => s !== SHADOW_SLOT
);

/** Sections generated from the selected shadows rather than independently written. Generated after
 *  Part Two so they can name the shadows in the buyer's own language. */
export const DERIVED_FROM_SHADOWS = ["journal", "eft", "hypnosis", "affirmations", "rituals", "challenge"];

/** Front matter and dividers, which are rendered rather than written. */
export const FRONT_MATTER_PAGES = 4;

/**
 * Page count for a report with `shadowCount` shadows: front matter, seven part dividers, every
 * fixed section and the shadows. The gold standard is 56 at four shadows.
 */
export function estimatePages(shadowCount: number): number {
  const fixed = REPORT_SECTIONS.reduce((n, s) => n + s.pages, 0);
  return FRONT_MATTER_PAGES + 7 + fixed + shadowCount * SHADOW_TEMPLATE.pages;
}
