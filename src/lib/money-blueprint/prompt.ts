/**
 * Money Blueprint — blocks 3 and 4 of the prompt: the engine brief and the per-buyer payload.
 *
 * Everything variable lives here, after the cached prefix, so the voice contract and knowledge
 * layer stay byte-identical across every call. The payload is the hard boundary on what a section
 * may assert: if a fact is not in it, the buyer does not have it.
 */

import type { PlannedSection, ReportPlan } from "./plan";
import type { ShadowPick } from "./analyse";
import type { EvidencedTheme, Confidence } from "./evidence";

/** Roughly the word count of one page of the reference report. */
const WORDS_PER_PAGE = 350;

/** One thing a section asserted, carried forward so later sections advance rather than restate. */
export interface Claim {
  sectionId: string;
  claim: string;
}

/** What the model returns for a section. */
export interface SectionDraft {
  /** The per-buyer headline. Never the section title. */
  headline: string;
  /** The section body as an HTML fragment in the report's design system. */
  html: string;
  /** Three to six things this section asserted, for the claims ledger. */
  claims: string[];
}

export const SECTION_SCHEMA = {
  type: "object",
  properties: {
    headline: {
      type: "string",
      description:
        "The section's own headline, written for this buyer from their dominant factor. Lowercase, no full stop, under ten words. Never the section title.",
    },
    html: {
      type: "string",
      description: "The section body as an HTML fragment using only the permitted tags and classes.",
    },
    claims: {
      type: "array",
      items: { type: "string" },
      description:
        "Three to six short statements of what this section asserted, each one sentence, for the claims ledger.",
    },
  },
  required: ["headline", "html", "claims"],
  additionalProperties: false,
} as const;

// ---------------------------------------------------------------------------- shapes

const SHAPE_BRIEF: Record<string, string> = {
  howlist:
    "Close with a `<ul class=\"howlist\">` of seven or eight concrete behaviours. Behaviours, not traits: something the reader will recognise doing this week.",
  table:
    "Close with a `<table>` with a `<thead>` and three to five rows. Every cell is specific to this chart.",
  steps:
    "Close with an `<ol class=\"steps\">` of five numbered steps, each one an action rather than a principle.",
  cards:
    "Close with `<div class=\"grid2\">` containing four to six `<div class=\"card\">` blocks, each with an `<h4>` and one short paragraph, ranked strongest first.",
  pull:
    "Include one `<blockquote class=\"pull\">` carrying the single sentence this section exists to deliver.",
  protocol:
    "Follow the three-page shadow structure described below exactly.",
  years:
    "Write one block per year, each opening with `<h4>` naming the year's span and its headline, then the year's material. Open the chapter with a `<table>` overview of all five years.",
  none: "No structural element. Body paragraphs only.",
};

const SHADOW_TEMPLATE_BRIEF = `This is a three-page shadow and it carries the report. Write it in exactly this order:

**Page one, recognition and origin.**
- Two paragraphs of the felt experience from the inside, in second person, describing what this
  person actually does rather than what the placement means. No astrology vocabulary yet.
- Two paragraphs on where it came from: the childhood origin traced to the specific placements in
  the payload, then the compounding factors. The braid must appear here.
- One \`<blockquote class="pull">\`.

**Page two, mechanism and evidence.**
- Two paragraphs on the nervous-system mechanism: what fires, in what order, in the body. Name the
  sequence explicitly, the way "Venus offers the number, Saturn corrects immediately, and the
  eighth house adds taboo on top" names it.
- A \`<ul class="howlist">\` of seven or eight concrete money behaviours. These are the lines the
  reader recognises themselves in. Behaviours, never traits.
- One paragraph on where it bites hardest.

**Page three, cost and protocol.**
- A two-column \`<table>\` headed "If this stays unexamined" and "If you work with it", five rows.
- One paragraph of reframe. Never as "it's not X, it's Y".
- An \`<ol class="steps">\` of five steps.
- Three \`<div class="tool">\` blocks: journal (two or three questions), EFT (the setup line said
  three times on the side of the hand, then the point sequence), and hypnosis with a somatic
  practice.
- One \`<div class="action">\` carrying the seven-day challenge.`;

// ---------------------------------------------------------------------------- helpers

const CONFIDENCE_INSTRUCTION: Record<Confidence, string> = {
  "very-high":
    "very-high confidence. State this as fact about this person. It may carry the headline and the pull quote.",
  high: "high confidence. State this as fact about this person. It may carry the headline.",
  moderate:
    "moderate confidence. Write it as a real pattern and one thread among several, never as the defining truth of their life. It may support this section but must not headline it.",
  low: "low confidence. Supporting texture only: one clause at most, never a claim, never the headline, never a mechanism.",
  insufficient: "insufficient evidence. Do not assert this at all.",
};

function describeConvergence(c: EvidencedTheme): string {
  const items = c.items.slice(0, 5).map((i) => i.factors[0]?.label ?? i.id);
  return `- **${c.theme}** (${c.why}, ${CONFIDENCE_INSTRUCTION[c.confidence]})\n  Carried by: ${items.join("; ")}`;
}

function describeShadow(s: ShadowPick): string {
  const cluster = s.cluster.map((i) => i.factors.map((f) => f.label).join(" / ")).join("\n  - ");
  return `Theme: **${s.theme}**\nThe mechanism runs through:\n  - ${cluster}\n${
    s.side === "design"
      ? "This cluster sits on the Design side, which means the reader lives it without having language for it. Naming that is one of the strongest moments in the report."
      : s.side === "personality"
        ? "This cluster sits on the Personality side, so the reader is already conscious of it."
        : ""
  }`;
}

// ---------------------------------------------------------------------------- the prompt

export function buildSectionPrompt(
  plan: ReportPlan,
  section: PlannedSection,
  ledger: Claim[],
  retryReason?: string
): string {
  const wordTarget = Math.round(section.pages * WORDS_PER_PAGE);
  const isShadow = !!section.shadow;

  const lines: string[] = [];
  const P = (s = "") => lines.push(s);

  // ---- block 3: the engine brief
  P(`# Section brief`);
  P();
  P(`**Section:** ${section.section.title}`);
  P(`**Purpose:** ${section.section.purpose}`);
  P(`**Length:** about ${wordTarget} words. Within fifteen percent of that, either way.`);
  if (section.variant) P(`**Variant:** ${section.variant}. Write this variant as its own thing, not as another variant with the words swapped.`);
  P();
  P(`Every section must answer WHY, not only what: the root, the childhood imprint, the`);
  P(`nervous-system mechanism, the specific placement or gate, what happens while it is unconscious`);
  P(`and what happens once it is worked with. All nine beats must be present in your reasoning even`);
  P(`where they do not surface as visible headings.`);
  P();
  P(isShadow ? SHADOW_TEMPLATE_BRIEF : SHAPE_BRIEF[section.section.shape] ?? SHAPE_BRIEF.none);
  P();

  if (section.section.extras?.length) {
    P(`This section must also close with: ${section.section.extras.join(", ")}. Each practical tool`);
    P(`goes in its own \`<div class="tool">\` with an \`<h4>\` naming it.`);
    P();
  }

  P(`## Markup`);
  P();
  P(`Return the body as an HTML fragment. Permitted tags only: \`<p>\`, \`<h4>\`,`);
  P(`\`<blockquote class="pull">\`, \`<ul class="howlist">\`, \`<ol class="steps">\`, \`<table>\` with`);
  P(`\`<thead>\`/\`<tbody>\`/\`<tr>\`/\`<th>\`/\`<td>\`, \`<div class="grid2">\`, \`<div class="card">\`,`);
  P(`\`<div class="tool">\`, \`<div class="action">\`, \`<strong>\`, \`<em>\`, \`<li>\`.`);
  P(`Do not write the section title, the section number, or the Read from band: those are rendered`);
  P(`around your output. Do not write \`<html>\`, \`<body>\`, \`<style>\` or any class not listed.`);
  P();

  // ---- block 4: the payload
  P(`# Payload`);
  P();
  P(`This is everything you know about this buyer. Anything not in here, they do not have.`);
  P();
  P(`## The facts this section may speak about`);
  P();
  for (const f of section.facts) P(`- ${f.label}`);
  P();
  P(`Name at most ${section.maxFactors} of these. Choosing decisively is what an astrologer does;`);
  P(`naming all of them is what software does.`);
  P();

  if (section.convergences.length) {
    P(`## Required material: convergences`);
    P();
    P(`Each of these is several independent parts of the chart describing the same lesson. They are`);
    P(`required material rather than optional colour, and each must appear in your output, braided`);
    P(`into a mechanism and named explicitly as two or more systems reaching the same conclusion.`);
    P();
    for (const c of section.convergences) P(describeConvergence(c));
    P();
  }

  if (section.contradictions.length) {
    P(`## Required material: contradictions`);
    P();
    P(`These pull in opposite directions and this person genuinely lives the argument. Do not`);
    P(`resolve it. Name it, and say where they have felt it.`);
    P();
    for (const c of section.contradictions) {
      P(`- **${c.a}** against **${c.b}** (evenly matched, tension ${c.tension.toFixed(2)})`);
    }
    P();
  }

  if (isShadow && section.shadow) {
    P(`## This shadow`);
    P();
    P(describeShadow(section.shadow));
    P();
    P(`Name the shadow yourself, from its dominant factor rather than from its theme. Betty's own`);
    P(`four were called the priced-down depth, the borrowed worth, the absorbed room, and the`);
    P(`too-much woman. That is the register: three or four words, lowercase, specific to the`);
    P(`mechanism. Your headline is that name.`);
    P();
  }

  if (plan.spine) {
    P(`## The report's spine`);
    P();
    P(`This buyer's report is built around **${plan.spine.theme}** (${plan.spine.why}). You do not`);
    P(`have to mention it, and you must not force it, but nothing you write should contradict it.`);
    P();
  }

  if (section.notes.length) {
    P(`## Adaptations for this chart`);
    P();
    for (const n of section.notes) P(`- ${n}`);
    P();
  }

  P(`## Address register`);
  P();
  P(
    plan.flags.addressRegister === "her"
      ? `Write to a woman: she, her. This is the audience the voice was written for.`
      : plan.flags.addressRegister === "them"
        ? `Write to a reader who uses they/them. Never she, never he. "The person you are becoming" rather than "the woman you are becoming".`
        : `Write in a neutral register. Avoid gendered nouns and pronouns for the reader entirely.`
  );
  P();

  if (ledger.length) {
    P(`## The claims ledger: what the report has already said`);
    P();
    P(`Advance the story rather than restating it. You may reference a claim below in a clause to`);
    P(`build on it, but you may not make it again as though it were new.`);
    P();
    for (const c of ledger) P(`- (${c.sectionId}) ${c.claim}`);
    P();
  }

  if (retryReason) {
    P(`# This section is being rewritten`);
    P();
    P(`Your previous attempt failed a quality gate:`);
    P();
    P(`> ${retryReason}`);
    P();
    P(`Fix that specifically. Everything else about the brief is unchanged.`);
    P();
  }

  P(`# Now write`);
  P();
  P(`Return JSON with three fields: \`headline\`, \`html\`, and \`claims\` (three to six one-sentence`);
  P(`statements of what you asserted, which become the ledger for later sections).`);

  return lines.join("\n");
}
