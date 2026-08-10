/**
 * Money Blueprint — quality gates. Run per section after generation.
 *
 * None of these depend on the model behaving well, which is the point: a failed gate regenerates
 * the section once with the failure named in the retry prompt. At roughly eight cents a section,
 * automatic regeneration is cheaper than any manual step.
 *
 * The gates are deliberately mechanical. They cannot judge whether a section is good, only whether
 * it broke a rule that would make the report wrong, repetitive, or obviously automated.
 */

import type { PlannedSection } from "./plan";
import type { SectionDraft } from "./prompt";

export interface GateFailure {
  gate: string;
  detail: string;
  /** Blocking failures regenerate the section. Advisory ones are logged for sampling. */
  blocking: boolean;
}

export interface GateResult {
  passed: boolean;
  failures: GateFailure[];
  words: number;
}

// ---------------------------------------------------------------------------- vocabulary

const PLANETS = [
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto",
  "chiron", "lilith", "north node", "south node", "part of fortune", "ascendant", "midheaven",
];

const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius",
  "capricorn", "aquarius", "pisces",
];

/**
 * Human Design vocabulary, deliberately precise.
 *
 * An earlier version matched substrings against words like "design", "defined", "individual" and
 * "root", which meant the sentence "Your income was never designed to come from selling a simple
 * product" registered as Human Design and failed the braiding gate on pure astrology prose. Every
 * term here is matched on word boundaries, and the ambiguous English words are gone: a centre is
 * only a centre when the word centre is next to it.
 */
const HD_TERMS = [
  "human design", "manifestor", "manifesting generator", "generator", "projector", "reflector",
  "sacral", "ajna", "splenic", "spleen", "solar plexus", "solarplexus",
  "open centre", "open center", "undefined centre", "undefined center", "defined centre", "defined center",
  "heart centre", "heart center", "throat centre", "throat center", "root centre", "root center",
  "g centre", "g center", "incarnation cross", "not-self", "authority", "hanging gate",
];

const ASTRO_TERMS = [
  ...PLANETS, ...SIGNS, "house", "conjunct", "square", "trine", "opposition", "sextile",
  "retrograde", "rising", "cusp", "ruler", "ruled", "stellium", "orb", "natal", "chart",
];

const hasTerm = (text: string, terms: string[]) =>
  terms.some((term) => new RegExp(`\\b${term.replace(/[-/]/g, "\\$&")}\\b`).test(text));

const PERMITTED_TAGS = new Set([
  "p", "h4", "blockquote", "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td", "div",
  "strong", "em", "br", "span",
]);
/** The design-system classes a section body may use, from BETTY-REPORT.html. `sub` is the pink
 *  uppercase sub-heading and `k` / `pk` are the inline accent spans. */
const PERMITTED_CLASSES = new Set([
  "pull", "howlist", "steps", "grid2", "card", "tool", "action", "sub", "k", "pk", "f",
]);

// ---------------------------------------------------------------------------- helpers

const stripTags = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/**
 * The body prose, with every structural element removed.
 *
 * Lists, steps, cards, tables and the practical tools are all deliberately terser than the prose
 * around them, and the reference report proves it: measured over whole pages its shortest sections
 * average seven words a sentence, because those pages are mostly protocol. Judging voice or
 * second-person density over the structure punishes exactly the pages that are working hardest.
 */
function proseOnly(html: string): string {
  let out = html;
  for (const cls of ["tool", "action", "grid2", "card"]) out = stripBlock(out, cls);
  for (const pattern of [
    /<ul class="howlist">[\s\S]*?<\/ul>/g,
    /<ol class="steps">[\s\S]*?<\/ol>/g,
    /<table[\s\S]*?<\/table>/g,
  ]) out = out.replace(pattern, " ");
  return stripTags(out);
}

/**
 * Remove every `<div class="cls">...</div>` including nested divs.
 *
 * A non-greedy regex stops at the first closing tag, so a `grid2` full of `card` divs kept most of
 * its contents and every card ended up counted as body prose. Depth counting is the only correct
 * way to do this without a parser.
 */
export function stripBlock(html: string, cls: string): string {
  const open = new RegExp(`<div[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, "g");
  let out = html;
  for (;;) {
    open.lastIndex = 0;
    const start = open.exec(out);
    if (!start) return out;
    let depth = 1;
    let i = start.index + start[0].length;
    while (depth > 0 && i < out.length) {
      const nextOpen = out.indexOf("<div", i);
      const nextClose = out.indexOf("</div>", i);
      if (nextClose === -1) return out.slice(0, start.index) + " ";
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        i = nextOpen + 4;
      } else {
        depth--;
        i = nextClose + 6;
      }
    }
    out = `${out.slice(0, start.index)} ${out.slice(i)}`;
  }
}

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

function paragraphs(html: string): string[] {
  return [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => stripTags(m[1]));
}

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

function trigrams(text: string): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + 2 < words.length; i++) out.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const x of a) if (b.has(x)) shared++;
  return shared / (a.size + b.size - shared);
}

// ---------------------------------------------------------------------------- the gates

/**
 * Entitlement. Every placement, sign, house, gate and date the prose names must appear in the
 * facts this section was handed. This is the gate that stops the report inventing a chart.
 */
export function entitlement(draft: SectionDraft, section: PlannedSection): GateFailure[] {
  const entitled = [...section.facts.map((f) => f.label), section.shadow?.cluster.flatMap((c) => c.factors.map((f) => f.label)).join(" ") ?? ""]
    .join(" ")
    .toLowerCase();
  const prose = `${draft.headline} ${stripTags(draft.html)}`.toLowerCase();
  const out: GateFailure[] = [];

  for (const body of PLANETS) {
    if (prose.includes(body) && !entitled.includes(body)) {
      out.push({ gate: "entitlement", detail: `names "${body}", which is not in this section's facts`, blocking: true });
    }
  }

  // Houses, as ordinals. The prose may only name a house the payload named.
  for (const m of prose.matchAll(/\b(\d{1,2})(?:st|nd|rd|th)\s+house\b/g)) {
    const ord = m[1];
    if (!new RegExp(`\\b${ord}(st|nd|rd|th)\\b`).test(entitled)) {
      out.push({ gate: "entitlement", detail: `names the ${m[0]}, which is not in this section's facts`, blocking: true });
    }
  }

  // Gates, which are the easiest thing in the system to invent.
  for (const m of prose.matchAll(/\bgate\s+(\d{1,2})\b/g)) {
    if (!entitled.includes(m[1])) {
      out.push({ gate: "entitlement", detail: `names gate ${m[1]}, which is not in this section's facts`, blocking: true });
    }
  }

  // Dates. Every year in the prose must have come from the timing payload.
  for (const m of prose.matchAll(/\b(19|20)\d{2}\b/g)) {
    if (!entitled.includes(m[0])) {
      out.push({ gate: "entitlement", detail: `states the year ${m[0]}, which did not come from the computed timing facts`, blocking: true });
    }
  }

  return [...new Map(out.map((f) => [f.detail, f])).values()];
}

/** Every required convergence has to actually appear, braided rather than listed. */
export function convergence(draft: SectionDraft, section: PlannedSection): GateFailure[] {
  const prose = stripTags(draft.html).toLowerCase();
  const out: GateFailure[] = [];
  for (const c of section.convergences) {
    const carriers = c.items.flatMap((i) => i.factors.map((f) => f.label.toLowerCase()));
    // A carrier counts as present when a distinctive word from its label appears.
    const present = carriers.filter((label) => {
      const words = label.split(/[^a-z0-9]+/).filter((w) => w.length > 3);
      return words.some((w) => prose.includes(w));
    });
    if (present.length < 2) {
      out.push({
        gate: "convergence",
        detail: `the required ${c.theme} convergence is not braided into the prose; at least two of its carrying factors must be named and connected into one mechanism`,
        blocking: true,
      });
    }
  }
  return out;
}

/**
 * The braiding rule. Human Design may never sit in its own paragraph: it must appear in the same
 * sentence or the adjacent clause as the astrological pattern it explains.
 */
export function braiding(draft: SectionDraft, section: PlannedSection): GateFailure[] {
  const hasHdFacts = section.facts.some((f) => f.key.startsWith("humanDesign"));
  const hasAstroFacts = section.facts.some((f) => !f.key.startsWith("humanDesign") && !f.key.startsWith("timing"));
  if (!hasHdFacts || !hasAstroFacts) return [];

  // The two Human Design sections are the design, front to back. Requiring an astrological pattern
  // in every one of their paragraphs would be asking them to stop being what they are; the braiding
  // rule exists to stop the design being bolted onto an astrology section, not the reverse.
  if (section.section.requiresHd) return [];

  const out: GateFailure[] = [];
  const paras = paragraphs(draft.html);
  let braidedSomewhere = false;

  for (const p of paras) {
    const lower = p.toLowerCase();
    const hd = hasTerm(lower, HD_TERMS);
    const astro = hasTerm(lower, ASTRO_TERMS);
    if (hd && astro) braidedSomewhere = true;
    if (hd && !astro && wordCount(p) > 40) {
      out.push({
        gate: "braiding",
        detail: `a paragraph explains the design on its own with no astrological pattern in it, which is the bolted-on failure: "${p.slice(0, 90)}..."`,
        blocking: true,
      });
    }
  }

  if (!braidedSomewhere && paras.length) {
    out.push({
      gate: "braiding",
      detail: "no paragraph carries the astrology and the design together, so nothing in this section is braided",
      blocking: true,
    });
  }
  return out;
}

/** Betty's voice rules, mechanically. */
export function voice(draft: SectionDraft): GateFailure[] {
  const out: GateFailure[] = [];
  const html = draft.html;
  // Journal prompts and the practical tools are allowed to ask questions.
  const text = proseOnly(html);

  const emDashes = (html.match(/—/g) ?? []).length;
  if (emDashes) out.push({ gate: "voice", detail: `${emDashes} em dash${emDashes > 1 ? "es" : ""}, which are banned`, blocking: true });

  const questions = sentences(text).filter((s) => s.endsWith("?"));
  if (questions.length) {
    out.push({ gate: "voice", detail: `rhetorical question in the body prose: "${questions[0].slice(0, 80)}"`, blocking: true });
  }

  // The banned construction is the negation-then-restatement pivot ("it's not X, it's Y"), not any
  // sentence containing a negation. The reference report closes a paragraph with a flat two-word
  // rebuttal, "You are not.", which is good writing and must pass: the difference is the comma and
  // the positive clause that follows it.
  const reframe = sentences(text).find((s) =>
    /\b(it|this|that|you|they|the answer)(?:'s|s\b|\s+(?:is|are|was|were))\s+not\b[^.!?]{3,90},\s*(?:it|this|that|you|they|but|rather)\b/i.test(s) ||
    /\b(?:isn't|aren't|wasn't|weren't)\b[^.!?]{3,90},\s*(?:it|this|that|you|they|but|rather)\b/i.test(s)
  );
  if (reframe) {
    out.push({ gate: "voice", detail: `a negation reframe, which Betty has banned: "${reframe.slice(0, 100)}"`, blocking: true });
  }

  // Measured over the reference report's body prose, the median section averages 18.9 words a
  // sentence and the tenth percentile is 14.9. The floor sits just below that: high enough to
  // catch clipped, punchy AI copy, which runs at eight to twelve, and low enough that Betty's own
  // most protocol-heavy pages pass. Sections with too little prose to measure are not judged.
  const proseSentences = sentences(text).filter((s) => wordCount(s) > 2);
  const avg = proseSentences.length ? proseSentences.reduce((a, s) => a + wordCount(s), 0) / proseSentences.length : 0;
  if (proseSentences.length >= 6 && avg < 14) {
    out.push({ gate: "voice", detail: `average sentence length is ${avg.toFixed(1)} words; the voice is long and clause-rich, so it must sit above 14`, blocking: true });
  }

  return out;
}

/** Not thin, not theoretical. */
export function depth(draft: SectionDraft, section: PlannedSection): GateFailure[] {
  const out: GateFailure[] = [];
  const text = stripTags(draft.html);
  const prose = proseOnly(draft.html);
  const words = wordCount(text);
  const target = section.pages * 350;

  // The floor is what the reference report actually does, not what the page budget aims at: its
  // shortest approved page is 154 words and its median is 363. A section under 140 words a page
  // has nothing to say; between the floor and the target, the mechanism and second-person checks
  // below are what actually catch thinness.
  const floor = Math.max(140 * section.pages, target * 0.4);
  if (words < floor) {
    out.push({ gate: "depth", detail: `${words} words against a target of ${target}; the section is thin`, blocking: true });
  }
  if (words > target * 1.25) {
    out.push({ gate: "depth", detail: `${words} words against a target of ${target}; the section is over budget and will not fit its pages`, blocking: false });
  }

  // A mechanism rather than a meaning. This is a keyword heuristic and it cannot actually tell
  // whether an explanation is causal, so it is advisory: it puts a section in front of a human
  // rather than spending a regeneration on prose that may be fine.
  if (!/\b(because|which is why|the reason|what happens|comes from|so that|so you|installed|learned|taught|means that|leaves you|makes you|turns into|fires|arrives|produces|drives)\b/i.test(text)) {
    out.push({ gate: "depth", detail: "nothing in this section reads as a mechanism; check that it explains why rather than what", blocking: false });
  }

  // Lived experience: does the reader appear doing something, or is this only placements?
  //
  // Advisory, not blocking, and the reference report is why. Six of its forty-four approved
  // sections fail a second-person density test, several of them deliberately: the highest-timeline
  // chapter is a third-person portrait of the woman she is becoming, the rituals and challenge
  // pages are instructional, and the returns chapter is a factual timing table. Counting the word
  // "you" turned out to be a poor proxy for lived experience, so it flags for review rather than
  // spending a regeneration on prose that may be doing exactly the right thing.
  //
  // The cost of this is real: a section that lists placements without ever landing them in a life
  // now reaches the sampling queue instead of being caught automatically.
  const isScript = (section.section.extras ?? []).some((e) => e === "eft" || e === "hypnosis" || e === "affirmation");
  const proseWords = wordCount(prose);
  if (!isScript && proseWords >= 120) {
    const secondPerson = (prose.match(/\byou\b/gi) ?? []).length;
    if (secondPerson < Math.max(4, proseWords / 90)) {
      out.push({ gate: "depth", detail: "the section describes placements more than it describes this person's week", blocking: false });
    }
  }

  return out;
}

/** The fastest way a generated report gives itself away. */
export function headline(draft: SectionDraft, section: PlannedSection): GateFailure[] {
  const out: GateFailure[] = [];
  const h = draft.headline.trim();
  const words = wordCount(h);

  if (!h) return [{ gate: "headline", detail: "no headline", blocking: true }];
  if (h.toLowerCase() === section.section.title.toLowerCase()) {
    out.push({ gate: "headline", detail: "the headline is the section title, which is the definition of generic", blocking: true });
  }
  if (words > 12) out.push({ gate: "headline", detail: `headline is ${words} words; it should be under about ten`, blocking: false });
  if (/^(your|the) (money|financial)\b/i.test(h) && words <= 4) {
    out.push({ gate: "headline", detail: `"${h}" would fit any buyer; it must come from this chart's dominant factor`, blocking: true });
  }
  return out;
}

/** Only the report's own design system, so a section cannot break the PDF. */
export function markup(draft: SectionDraft): GateFailure[] {
  const out: GateFailure[] = [];
  for (const m of draft.html.matchAll(/<\s*\/?\s*([a-zA-Z0-9]+)/g)) {
    const tag = m[1].toLowerCase();
    if (!PERMITTED_TAGS.has(tag)) {
      out.push({ gate: "markup", detail: `<${tag}> is not a permitted tag`, blocking: true });
    }
  }
  for (const m of draft.html.matchAll(/class="([^"]+)"/g)) {
    for (const cls of m[1].split(/\s+/)) {
      if (cls && !PERMITTED_CLASSES.has(cls)) {
        out.push({ gate: "markup", detail: `class "${cls}" is not in the design system`, blocking: true });
      }
    }
  }
  return [...new Map(out.map((f) => [f.detail, f])).values()];
}

/** The same insight in different words, which is the most likely failure in the whole system. */
export const REPETITION_THRESHOLD = 0.16;

export function repetition(draft: SectionDraft, previous: Array<{ id: string; html: string }>): GateFailure[] {
  const mine = trigrams(stripTags(draft.html));
  for (const p of previous) {
    const score = jaccard(mine, trigrams(stripTags(p.html)));
    if (score > REPETITION_THRESHOLD) {
      return [{
        gate: "repetition",
        detail: `this section repeats the ${p.id} section (similarity ${score.toFixed(2)}); advance the story instead of restating it`,
        blocking: true,
      }];
    }
  }
  return [];
}

// ---------------------------------------------------------------------------- runner

export function runGates(
  draft: SectionDraft,
  section: PlannedSection,
  previous: Array<{ id: string; html: string }>
): GateResult {
  const failures = [
    ...markup(draft),
    ...entitlement(draft, section),
    ...convergence(draft, section),
    ...braiding(draft, section),
    ...voice(draft),
    ...depth(draft, section),
    ...headline(draft, section),
    ...repetition(draft, previous),
  ];
  return {
    passed: !failures.some((f) => f.blocking),
    failures,
    words: wordCount(stripTags(draft.html)),
  };
}

/**
 * Report-level checks, run once every section exists. These cannot be fixed by regenerating one
 * section, so they flag the report for review rather than triggering a retry.
 */
export function runReportGates(
  sections: Array<{ id: string; draft: SectionDraft; section: PlannedSection }>,
  spineTheme: string | null
): GateFailure[] {
  const out: GateFailure[] = [];

  if (spineTheme) {
    const carrying = sections.filter((s) => s.section.convergences.some((c) => c.theme === spineTheme));
    if (carrying.length < 3) {
      out.push({
        gate: "report/spine",
        detail: `the spine theme ${spineTheme} was planned into only ${carrying.length} sections; it should carry at least three`,
        blocking: false,
      });
    }
  }

  const shadowHeadlines = sections.filter((s) => s.section.shadow).map((s) => s.draft.headline.toLowerCase());
  if (new Set(shadowHeadlines).size !== shadowHeadlines.length) {
    out.push({ gate: "report/shadows", detail: "two shadows share a name, so they are not distinct mechanisms", blocking: true });
  }

  return out;
}
