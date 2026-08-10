/**
 * Money Blueprint — gate calibration against the gold standard.
 *
 * The gates decide whether generated prose ships or gets regenerated, so the first thing to know
 * about them is whether they accept writing Betty has already approved. Every content section of
 * BETTY-REPORT.html is real, hand-checked, 56-page reference prose; if a gate rejects it, the gate
 * is wrong and would silently reject good generated sections for the same reason.
 *
 * The second half of the file does the opposite: hand-written failures that each gate must catch.
 */

import fs from "fs";
import path from "path";
import {
  voice, depth, headline, braiding, entitlement, markup, runGates, stripBlock,
  type GateFailure,
} from "@/lib/money-blueprint/gates";
import type { SectionDraft } from "@/lib/money-blueprint/prompt";
import type { PlannedSection } from "@/lib/money-blueprint/plan";

jest.setTimeout(120_000);

// ---------------------------------------------------------------------------- the gold standard

interface GoldSection {
  page: number;
  label: string;
  headline: string;
  html: string;
  isShadow: boolean;
}

function loadGoldSections(): GoldSection[] {
  const file = path.join(__dirname, "../../money-blueprint/BETTY-REPORT.html");
  const html = fs.readFileSync(file, "utf8");
  const pages = [...html.matchAll(/<section class="page[^"]*"[^>]*>([\s\S]*?)<\/section>/g)].map((m) => m[1]);

  const out: GoldSection[] = [];
  pages.forEach((page, i) => {
    const rule = /class="rule"[^>]*>([\s\S]*?)<\/div>/.exec(page);
    const display = /<h3[^>]*class="display"[^>]*>([\s\S]*?)<\/h3>/.exec(page);
    if (!rule || !display) return; // cover, dividers, contents: no body prose to judge

    // Strip the page furniture the renderer owns rather than the writer: run head, folio, the
    // section rule, the Read from band, the decorative cut-outs, and the headline itself. Balanced
    // stripping matters here, because several of these wrap nested divs.
    let body = page;
    for (const cls of ["runhead", "folio", "rule", "readfrom", "abs", "motif", "frame", "h"]) {
      body = stripBlock(body, cls);
    }
    body = body.replace(/<h3[^>]*class="display"[^>]*>[\s\S]*?<\/h3>/g, " ");

    const label = rule[1].replace(/<[^>]+>/g, "").trim();
    out.push({
      page: i + 1,
      label,
      headline: display[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      html: body,
      isShadow: /^Shadow |^How it runs|^What it costs/.test(label),
    });
  });
  return out;
}

const gold = loadGoldSections();

/** A PlannedSection stub carrying only what the prose gates read. */
function stub(g: GoldSection, over: Partial<PlannedSection> = {}): PlannedSection {
  return {
    number: g.page,
    section: { id: `gold-${g.page}`, title: g.label, shape: "none", purpose: "x".repeat(40) } as PlannedSection["section"],
    part: 1,
    pages: 1,
    facts: [],
    readFrom: [],
    convergences: [],
    contradictions: [],
    maxFactors: 8,
    notes: [],
    ...over,
  } as PlannedSection;
}

const draftOf = (g: GoldSection): SectionDraft => ({ headline: g.headline, html: g.html, claims: [] });
const blocking = (f: GateFailure[]) => f.filter((x) => x.blocking);

describe("the gates accept the approved report", () => {
  it("found the gold standard's content sections", () => {
    expect(gold.length).toBeGreaterThanOrEqual(35);
  });

  it("passes the voice gate on every section Betty approved", () => {
    const rejected = gold
      .map((g) => ({ g, failures: blocking(voice(draftOf(g))) }))
      .filter((x) => x.failures.length);
    expect(
      rejected.map((r) => `p${r.g.page} ${r.g.label}: ${r.failures.map((f) => f.detail).join(" | ")}`)
    ).toEqual([]);
  });

  it("passes the headline gate on every section Betty approved", () => {
    const rejected = gold
      .map((g) => ({ g, failures: blocking(headline(draftOf(g), stub(g))) }))
      .filter((x) => x.failures.length);
    expect(rejected.map((r) => `p${r.g.page}: ${r.failures.map((f) => f.detail).join(" | ")}`)).toEqual([]);
  });

  it("passes the depth gate on every section Betty approved", () => {
    const rejected = gold
      .map((g) => ({ g, failures: blocking(depth(draftOf(g), stub(g))) }))
      .filter((x) => x.failures.length);
    expect(rejected.map((r) => `p${r.g.page} ${r.g.label}: ${r.failures.map((f) => f.detail).join(" | ")}`)).toEqual([]);
  });

  it("passes the braiding gate on every section Betty approved", () => {
    const withHd = stub(gold[0], { facts: [{ key: "humanDesign.type", label: "Manifestor", value: null }] });
    const rejected = gold
      .map((g) => ({ g, failures: blocking(braiding(draftOf(g), { ...withHd, section: stub(g).section })) }))
      .filter((x) => x.failures.length);
    expect(rejected.map((r) => `p${r.g.page} ${r.g.label}: ${r.failures.map((f) => f.detail).join(" | ")}`)).toEqual([]);
  });

  it("passes the markup gate on every section Betty approved", () => {
    const rejected = gold
      .map((g) => ({ g, failures: blocking(markup(draftOf(g))) }))
      .filter((x) => x.failures.length);
    expect(rejected.map((r) => `p${r.g.page}: ${r.failures.map((f) => f.detail).join(" | ")}`)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------- the failures

const CLEAN_HTML = `<p>You quote the number and then, before the sentence has properly finished landing, you soften it with a payment plan that nobody in the room actually asked you for, which is a habit you learned early and have never once examined.</p><p>The mechanism runs in a fixed order, because Venus offers the figure and Saturn arrives immediately afterwards with a correction, and the eighth house adds a layer of taboo on top of both of them, so the price is never simply a price.</p><p>What that costs you is the compounding difference between what you charge and what the work is actually worth, and you have been quietly paying that difference for most of a decade without once putting a figure on it.</p>`;

const cleanDraft = (over: Partial<SectionDraft> = {}): SectionDraft => ({
  headline: "the price and the doubt are the same thought",
  html: CLEAN_HTML,
  claims: ["She softens her price unprompted."],
  ...over,
});

const factSection = (facts: Array<[string, string]>, over: Partial<PlannedSection> = {}): PlannedSection =>
  stub({ page: 1, label: "Pricing Energy", headline: "", html: "", isShadow: false }, {
    facts: facts.map(([key, label]) => ({ key, label, value: null })),
    ...over,
  });

describe("the gates catch what they exist to catch", () => {
  const section = factSection([
    ["placements.venus", "Venus in Scorpio in the 8th house"],
    ["placements.saturn", "Saturn in Scorpio in the 8th house"],
  ]);

  it("accepts clean prose", () => {
    expect(blocking(voice(cleanDraft()))).toEqual([]);
    expect(blocking(entitlement(cleanDraft(), section))).toEqual([]);
  });

  it("catches an invented placement", () => {
    const d = cleanDraft({ html: CLEAN_HTML.replace("Venus offers", "Neptune offers") });
    expect(blocking(entitlement(d, section)).map((f) => f.detail)).toContain(
      'names "neptune", which is not in this section\'s facts'
    );
  });

  it("catches an invented house", () => {
    const d = cleanDraft({ html: CLEAN_HTML.replace("eighth house", "5th house") });
    expect(blocking(entitlement(d, section))[0].detail).toMatch(/5th house/);
  });

  it("catches an invented gate", () => {
    const d = cleanDraft({ html: `${CLEAN_HTML}<p>Gate 21 is what gives you material authority over your own resources, and it never once asks anyone else for permission before it acts.</p>` });
    expect(blocking(entitlement(d, section))[0].detail).toMatch(/gate 21/);
  });

  it("catches a fabricated date, which is the roadmap's worst failure", () => {
    const d = cleanDraft({ html: `${CLEAN_HTML}<p>In 2029 your income structure is tested and rebuilt, and what it builds in that year is the thing that finally lasts beyond the decade.</p>` });
    expect(blocking(entitlement(d, section))[0].detail).toMatch(/2029/);
  });

  it("catches an em dash", () => {
    const d = cleanDraft({ html: CLEAN_HTML.replace("landing,", "landing —") });
    expect(blocking(voice(d))[0].detail).toMatch(/em dash/);
  });

  it("catches a rhetorical question", () => {
    const d = cleanDraft({ html: `${CLEAN_HTML}<p>So what does that actually mean for the way you price your work in practice?</p>` });
    expect(blocking(voice(d))[0].detail).toMatch(/rhetorical question/);
  });

  it("catches the banned negation reframe", () => {
    const d = cleanDraft({ html: `${CLEAN_HTML}<p>This is not a confidence problem at all, it is a structural belief about what your work is worth, and it was installed long before you had any say in it.</p>` });
    expect(blocking(voice(d))[0].detail).toMatch(/negation reframe/);
  });

  it("catches clipped, punchy sentences", () => {
    const d = cleanDraft({
      html: "<p>You undercharge. It happens fast. You know it. You do it anyway. The pattern repeats. Every single time. Nothing changes. The number stays small. Your work does not.</p>",
    });
    expect(blocking(voice(d)).some((f) => /average sentence length/.test(f.detail))).toBe(true);
  });

  it("catches a generic headline", () => {
    expect(blocking(headline(cleanDraft({ headline: "Pricing Energy" }), section))[0].detail).toMatch(/section title/);
    expect(blocking(headline(cleanDraft({ headline: "Your Money" }), section))[0].detail).toMatch(/any buyer/);
  });

  it("catches a thin section", () => {
    const d = cleanDraft({ html: "<p>You undercharge because Venus and Saturn arrive together, which is the whole mechanism and there is not much more to say about it than that.</p>" });
    expect(blocking(depth(d, section)).some((f) => /thin/.test(f.detail))).toBe(true);
  });

  it("catches Human Design bolted on as its own paragraph", () => {
    const hdSection = factSection([
      ["placements.venus", "Venus in Scorpio in the 8th house"],
      ["humanDesign.openCenters", "Open centres: heart, solarplexus"],
    ]);
    const bolted = cleanDraft({
      html: `${CLEAN_HTML}<p>In Human Design you have an open solar plexus centre, which means that you absorb and amplify the emotional weather of whichever room you happen to be standing in, and that openness never resolves into anything consistent of its own, so it keeps handing you feelings that were never yours to begin with.</p>`,
    });
    const failures = blocking(braiding(bolted, hdSection)).map((f) => f.detail);
    expect(failures.some((d) => /bolted-on|on its own/.test(d))).toBe(true);
  });

  it("accepts Human Design braided into the astrological pattern", () => {
    const hdSection = factSection([
      ["placements.venus", "Venus in Scorpio in the 8th house"],
      ["humanDesign.openCenters", "Open centres: heart, solarplexus"],
    ]);
    const braided = cleanDraft({
      html: `${CLEAN_HTML}<p>That Venus in the eighth house is why the number carries so much weight, and your design explains the physical mechanism underneath it, because an open solar plexus reads the emotional temperature of a room before anybody speaks and quietly prices to keep it comfortable.</p>`,
    });
    expect(blocking(braiding(braided, hdSection))).toEqual([]);
  });

  it("catches a section repeating one that came before it", () => {
    const first = { id: "pricing", html: CLEAN_HTML };
    const echo = cleanDraft({ html: CLEAN_HTML.replace("You quote", "So you quote") });
    const result = runGates(echo, section, [first]);
    expect(result.failures.some((f) => f.gate === "repetition")).toBe(true);
    expect(result.passed).toBe(false);
  });

  it("catches markup that would break the PDF", () => {
    const d = cleanDraft({ html: `${CLEAN_HTML}<script>alert(1)</script>` });
    expect(blocking(markup(d))[0].detail).toMatch(/<script>/);
    const d2 = cleanDraft({ html: `<div class="fancy-callout">${CLEAN_HTML}</div>` });
    expect(blocking(markup(d2))[0].detail).toMatch(/fancy-callout/);
  });
});
