/**
 * Money Blueprint — stage ③, the plan.
 *
 * Facts + profile + flags in, a complete ReportPlan out: which sections run for this buyer, how
 * many pages each earns, which facts each is entitled to speak about, which convergences it must
 * braid, and every adaptation the chart's shape demands. Deterministic and model-free, so the
 * entire shape of a report is decided and inspectable before a single token is generated.
 *
 * Two rules underneath everything here:
 *
 *  - A section may become shorter, but no buyer receives a section that reads as generic. If an
 *    engine cannot find enough entitled facts to say something specific, it is cut and the contents
 *    page adjusts.
 *  - No convergence is allowed to appear everywhere. The budget below is what stops forty sections
 *    generated in parallel from all naming the same Venus-Saturn contact.
 *
 * See money-blueprint/engine/ARCHITECTURE.md and EDGE-CASES.md.
 */

import type { MoneyChartFacts } from "./facts";
import type { Profile, ShadowPick } from "./analyse";
import type { EvidencedTheme } from "./evidence";
import type { Theme } from "./themes";
import { type ChartFlags, PlacidusUnreliableError } from "./flags";
import { resolveReads, type ResolvedFact, type TimingInput } from "./assemble";
import {
  REPORT_SPINE, SHADOW_SLOT, SHADOW_TEMPLATE, PARTS, FRONT_MATTER_PAGES,
  type ReportSection, type Part,
} from "./sections";

export interface PlannedSection {
  /** Printed section number, assigned across the sections that actually run. Null for the two
   *  engines that carry no number in the contents page. */
  number: number | null;
  section: ReportSection;
  part: Part;
  pages: number;
  /** Only the facts this section is entitled to use. */
  facts: ResolvedFact[];
  /** The "Read from" band printed at the top of the section. */
  readFrom: string[];
  /** Convergences this section must braid, handed over as required material rather than a hint. */
  convergences: EvidencedTheme[];
  /** Contradictions this section is the right place to name. */
  contradictions: Array<{ a: Theme; b: Theme; tension: number }>;
  /** The shadow this section writes up, for the three-page shadow engine. */
  shadow?: ShadowPick;
  /** Which variant of a shape-changing engine to write. */
  variant?: string;
  /** How many chart factors this section may name before the prose becomes a list. */
  maxFactors: number;
  /** Plan-level adaptations, passed into the prompt verbatim. */
  notes: string[];
}

export interface ReportPlan {
  name: string;
  generatedAt: string;
  flags: ChartFlags;
  /** The report's spine: the highest convergence, which the opening, the Thread and three sections
   *  in between are built around. */
  spine: EvidencedTheme | null;
  shadows: ShadowPick[];
  sections: PlannedSection[];
  parts: Array<{ part: Part; title: string; lede: string; sections: string[] }>;
  totalPages: number;
  /** Which sections are allowed to name each theme, so the same convergence cannot surface in
   *  nine chapters. */
  convergenceBudget: Record<string, string[]>;
  skipped: Array<{ id: string; reason: string }>;
}

// ---------------------------------------------------------------------------- helpers

/** A theme is worth handing to a section as required material once three independent sources
 *  carry it. Below that it is a hint, and hints produce hedged prose. */
const CONVERGENCE_FLOOR = 3;

/** How many sections may name the same convergence. The spine gets more room than the rest. */
const SPINE_MENTIONS = 4;
const OTHER_MENTIONS = 2;
/** On a monolithic chart even the spine is rationed, because it is already going to be everywhere. */
const MONOLITHIC_SPINE_MENTIONS = 3;

const TYPE_VARIANTS: Record<string, string> = {
  Manifestor: "manifestor",
  Generator: "generator",
  "Manifesting Generator": "manifesting-generator",
  Projector: "projector",
  Reflector: "reflector",
};

function variantFor(section: ReportSection, facts: MoneyChartFacts): string | undefined {
  const hd = facts.humanDesign;
  if (!section.variantBy || !hd) return undefined;
  switch (section.variantBy) {
    case "type":
      return TYPE_VARIANTS[hd.type] ?? "generator";
    case "authority":
      return hd.authority;
    case "strategy":
      return TYPE_VARIANTS[hd.type] ?? "generator";
    case "openCentreCount": {
      const n = hd.openCenters.length;
      return n <= 2 ? "few-open" : n <= 5 ? "several-open" : "many-open";
    }
  }
}

/** Sections that carry the care register when the chart shows a heavy trauma signature. */
const CARE_SECTIONS = new Set(["childhood-programming", "chiron-money", "inherited-beliefs", "nervous-system", "shadow"]);
/** Sections whose copy would invert below the equator if it leaned on solar seasons. */
const SEASONAL_SECTIONS = new Set(["five-year-roadmap", "current-season", "rituals"]);
/** Where a retrograde-heavy chart gets its one full retrograde reading. Everywhere else caps at one
 *  mention, or the buyer reads four paragraphs about internalised worth. */
const RETROGRADE_HOME = "receiving";

// ---------------------------------------------------------------------------- the plan

export function planReport(
  facts: MoneyChartFacts,
  profile: Profile,
  timing: TimingInput = {},
  now: Date = new Date()
): ReportPlan {
  const flags = profile.flags;

  // The backstop. Placidus is the only house system this report uses, so an unreliable chart is
  // refused and flagged for manual handling rather than quietly recalculated another way.
  if (!flags.placidusReliable) {
    throw new PlacidusUnreliableError(
      flags.placidusFailureReason ?? "non-finite-cusps",
      `Placidus houses are not reliable for this birth data (${flags.placidusFailureReason}). This report was not generated.`
    );
  }

  const convergences = profile.themes.filter((t) => t.independence >= CONVERGENCE_FLOOR);
  const spine = convergences[0] ?? profile.themes[0] ?? null;

  // ---- convergence budget: which sections may name which theme -----------------------------
  const budget: Record<string, string[]> = {};
  const remaining = new Map<Theme, number>();
  for (const c of convergences) {
    const isSpine = spine !== null && c.theme === spine.theme;
    remaining.set(
      c.theme,
      isSpine ? (flags.convergenceProfile === "monolithic" ? MONOLITHIC_SPINE_MENTIONS : SPINE_MENTIONS) : OTHER_MENTIONS
    );
    budget[c.theme] = [];
  }

  const skipped: ReportPlan["skipped"] = [];
  const planned: PlannedSection[] = [];

  const maxFactors = flags.aspectDensity === "dense" ? 5 : 8;

  const expand = (): Array<ReportSection | ShadowPick> => {
    const out: Array<ReportSection | ShadowPick> = [];
    for (const entry of REPORT_SPINE) {
      if (entry === SHADOW_SLOT) out.push(...profile.shadows);
      else out.push(entry);
    }
    return out;
  };

  for (const entry of expand()) {
    const isShadow = !("id" in entry);
    const section: ReportSection = isShadow
      ? { ...SHADOW_TEMPLATE, themes: [(entry as ShadowPick).theme] }
      : (entry as ReportSection);
    const shadow = isShadow ? (entry as ShadowPick) : undefined;

    if (section.requiresHd && !facts.humanDesign) {
      skipped.push({ id: section.id, reason: "no human design (birth time missing)" });
      continue;
    }

    const resolved = resolveReads(section.reads, facts, timing);
    if (!resolved.length) {
      if (section.onMissing === "skip") {
        skipped.push({ id: section.id, reason: "no entitled facts" });
        continue;
      }
      // A fallback section widens to the chart's strongest material rather than printing a heading
      // with nothing under it.
      resolved.push(...resolveReads(["placements", "houses", "chartRuler"], facts, timing));
      if (!resolved.length) {
        skipped.push({ id: section.id, reason: "no entitled facts after fallback" });
        continue;
      }
    }

    const notes: string[] = [];
    let pages = section.pages;

    // ---- edge-case adaptations ---------------------------------------------------------
    if (section.id === "loudest-house") {
      if (flags.stelliumCount === 0) {
        notes.push("No stellium. Lead with the money house whose ruler is strongest rather than a cluster, and never use the word empty about a house.");
      } else if (flags.stelliumCount > 1) {
        notes.push("More than one stellium. Write the loudest one only, as a chart with a strong chapter rather than as a ranking. The second is covered elsewhere.");
      }
    }
    if (flags.intercepted && (section.id === "income-mechanism" || section.id === "money-karma")) {
      notes.push("This chart has an intercepted sign, so a resource exists here with no direct outlet. Read it as something waiting for a route rather than something missing.");
    }
    if (flags.aspectDensity === "sparse") {
      notes.push("Few tight aspects in this chart. Lean on placements, house rulers and the design rather than on aspect contacts, and never describe an aspect as exact.");
    }
    if (flags.aspectDensity === "dense") {
      notes.push(`Very busy chart. Name at most ${maxFactors} factors and choose decisively; an exhaustive list reads as software rather than as a reading.`);
    }
    if (flags.retrogradeHeavy) {
      notes.push(
        section.id === RETROGRADE_HOME
          ? "Four or more bodies retrograde at birth. This is the one section that braids them into a single reading about worth turned inward."
          : "Four or more bodies retrograde at birth, and they are read in full elsewhere. Mention retrogradation once at most here."
      );
    }
    if (flags.careRegister && CARE_SECTIONS.has(section.id)) {
      notes.push(
        "Care register. Describe the pattern and its money consequence. Never diagnose, never speculate about specific events, and never assert what happened in this person's childhood as fact. Many people with this configuration describe, rather than you were."
      );
    }
    if (flags.southernHemisphere && SEASONAL_SECTIONS.has(section.id)) {
      notes.push("Southern hemisphere buyer. No solar-season metaphor. Lunar practices are safe, spring and new-year framing is not.");
    }
    if (flags.birthTimeSuspect) {
      notes.push("Birth time may be rounded. Prefer factors that do not depend on the house cusps, and never present a house-based statement as the sole basis for a claim.");
    }
    if (flags.boundaryRisk.length && (isShadow || section.id === "hd-money")) {
      notes.push("One or more design activations sit on a gate or line boundary. Do not build the central mechanism on a gate; lead with the stabler factors.");
    }
    if (flags.rareDesign && section.variantBy) {
      notes.push("Rare design. Write this as its own thing rather than as a common type with the words swapped.");
    }
    if (section.id === "five-year-roadmap") {
      pages = flags.ageBracket === "young" ? 7 : 7;
      notes.push(
        flags.ageBracket === "young"
          ? "Young buyer. Weight the roadmap forward and lean on the first Saturn return ahead rather than on financial history."
          : flags.ageBracket === "mature"
            ? "Mature buyer. Never imply the building years are still ahead; this is a roadmap for what is already substantial."
            : "Mid-life buyer. Both retrospect and forward motion are available."
      );
      notes.push(`Generated ${now.toISOString().slice(0, 10)}. Stamp the generation date on the chapter opener so the start year is never ambiguous.`);
      notes.push("Every date must come from the computed timing facts. Never write a date that is not in the payload.");
    }
    if (section.id === "the-thread" && flags.systemConflict) {
      notes.push("Astrology and the design genuinely disagree in this chart. Feature the argument rather than resolving it; it is one of the strongest moments available.");
    }

    // ---- required convergences ---------------------------------------------------------
    const required: EvidencedTheme[] = [];
    if (isShadow && shadow) {
      const own = convergences.find((c) => c.theme === shadow.theme);
      if (own) required.push(own);
    } else {
      for (const c of convergences) {
        if (!section.themes.includes(c.theme)) continue;
        const left = remaining.get(c.theme) ?? 0;
        if (left <= 0) continue;
        required.push(c);
        remaining.set(c.theme, left - 1);
        budget[c.theme].push(section.id);
      }
    }
    // The Thread is the one section that reads the whole profile.
    if (section.id === "the-thread") required.push(...convergences.slice(0, 3));

    const relevantContradictions =
      section.id === "the-thread" || section.id === "money-identity"
        ? profile.contradictions
        : profile.contradictions.filter((c) => section.themes.includes(c.a) && section.themes.includes(c.b));

    planned.push({
      number: null,
      section,
      part: section.part,
      pages,
      facts: resolved,
      readFrom: resolved.map((r) => r.label),
      convergences: required,
      contradictions: relevantContradictions,
      shadow,
      variant: variantFor(section, facts),
      maxFactors,
      notes,
    });
  }

  // A cut section releases its page to the shadows, which are what carry the report.
  const releasedPages = skipped.length;
  if (releasedPages > 0) {
    const shadowSections = planned.filter((p) => p.shadow);
    if (shadowSections.length) shadowSections[0].pages += Math.min(releasedPages, 1);
  }

  // ---- numbering, done last so it reflects what actually runs ------------------------------
  let n = 0;
  for (const p of planned) {
    if (p.shadow) {
      n += 1;
      p.number = n;
    } else if (p.section.spec !== null) {
      n += 1;
      p.number = n;
    }
  }

  const parts = ([1, 2, 3, 4, 5, 6, 7] as Part[]).map((part) => ({
    part,
    title: PARTS[part].title,
    lede: PARTS[part].lede,
    sections: planned.filter((p) => p.part === part).map((p) => p.section.id),
  }));

  const totalPages =
    FRONT_MATTER_PAGES + parts.filter((p) => p.sections.length).length + planned.reduce((a, p) => a + p.pages, 0);

  return {
    name: facts.name || profile.name,
    generatedAt: now.toISOString(),
    flags,
    spine,
    shadows: profile.shadows,
    sections: planned,
    parts,
    totalPages,
    convergenceBudget: budget,
    skipped,
  };
}
