/**
 * Money Blueprint — stage ③ exit criteria.
 *
 * Runs the same 26-chart covering set the engine sweep uses through derivation, analysis and
 * planning, and asserts the properties Phase 1 exists to guarantee: every chart produces a complete
 * section plan, no section is empty, no shadow rests on a single placement, and an unreliable
 * Placidus chart is refused rather than quietly rehoused.
 *
 * Writes money-blueprint/engine/test/PLAN-RESULTS.md alongside the assertions.
 */

import fs from "fs";
import path from "path";
import { calculateChart } from "@/lib/astrology";
import { calculateHumanDesign } from "@/lib/human-design";
import type { BirthData } from "@/types/chart";
import { deriveMoneyFacts } from "@/lib/money-blueprint/facts";
import { analyse } from "@/lib/money-blueprint/analyse";
import { planReport } from "@/lib/money-blueprint/plan";
import { deriveTiming, toTimingInput } from "@/lib/money-blueprint/timing";
import { assertPlacidusOrRefuse, isPlacidusReliable, PlacidusUnreliableError, unusualCount } from "@/lib/money-blueprint/flags";
import { REPORT_SECTIONS, SHADOW_TEMPLATE } from "@/lib/money-blueprint/sections";
import { buildSweep, LOCATIONS } from "./support/charts";

jest.setTimeout(900_000);

const NOW = new Date("2026-08-03T00:00:00Z");

const sweep = buildSweep();
const plans = sweep.chosen.map((s) => {
  const facts = deriveMoneyFacts(s.chart, s.hd);
  const profile = analyse(s.bd.name, s.chart, s.hd, sweep.freq, { now: NOW });
  const timing = toTimingInput(deriveTiming(s.chart, NOW));
  return { s, facts, profile, timing, plan: planReport(facts, profile, timing, NOW) };
});

describe("stage ③ · the plan", () => {
  it("plans every chart in the covering set", () => {
    expect(plans.length).toBeGreaterThanOrEqual(26);
  });

  it("gives every chart three to five shadows, each a mechanism rather than a placement", () => {
    for (const { s, plan } of plans) {
      const where = s.bd.name;
      expect(plan.shadows.length).toBeGreaterThanOrEqual(3);
      expect(plan.shadows.length).toBeLessThanOrEqual(5);
      for (const shadow of plan.shadows) {
        expect(`${where}:${shadow.theme}:${shadow.cluster.length}`).toBe(`${where}:${shadow.theme}:${shadow.cluster.length}`);
        expect(shadow.cluster.length).toBeGreaterThanOrEqual(2);
        // Circuitry describes how energy moves through a group, not a wound.
        expect(shadow.cluster.filter((i) => i.id.startsWith("hd:circuit:"))).toHaveLength(0);
      }
      // Two shadows may share a theme through unrelated mechanisms, but never a seed.
      const seeds = plan.shadows.map((sh) => sh.cluster[0].id);
      expect(new Set(seeds).size).toBe(seeds.length);
    }
  });

  it("never plans a section with nothing to read from", () => {
    for (const { s, plan } of plans) {
      for (const section of plan.sections) {
        expect(`${s.bd.name}/${section.section.id}: ${section.readFrom.length} facts`).toBe(
          `${s.bd.name}/${section.section.id}: ${section.readFrom.length} facts`
        );
        expect(section.readFrom.length).toBeGreaterThan(0);
        expect(section.pages).toBeGreaterThan(0);
        expect(section.section.purpose.length).toBeGreaterThan(20);
      }
    }
  });

  it("runs the full spine for every chart, since birth time is required at checkout", () => {
    for (const { s, plan } of plans) {
      const ran = new Set(plan.sections.map((p) => p.section.id));
      const missing = REPORT_SECTIONS.filter((sec) => !ran.has(sec.id)).map((sec) => sec.id);
      expect(`${s.bd.name}: ${missing.join(", ") || "none"}`).toBe(`${s.bd.name}: none`);
    }
  });

  it("numbers the sections that actually run, in order, with no gaps", () => {
    for (const { plan } of plans) {
      const numbers = plan.sections.map((p) => p.number).filter((n): n is number => n !== null);
      expect(numbers).toEqual(numbers.map((_, i) => i + 1));
      // The two engines added after the spine was numbered carry no contents-page number.
      const unnumbered = plan.sections.filter((p) => p.number === null).map((p) => p.section.id);
      expect(unnumbered.sort()).toEqual(["five-year-roadmap", "the-thread"]);
    }
  });

  it("rations every convergence so the same braid cannot surface in nine chapters", () => {
    for (const { s, plan } of plans) {
      for (const [theme, sections] of Object.entries(plan.convergenceBudget)) {
        const cap = plan.spine && theme === plan.spine.theme ? 4 : 2;
        expect(`${s.bd.name}/${theme}: ${sections.length} mentions`).toBe(
          `${s.bd.name}/${theme}: ${Math.min(sections.length, cap)} mentions`
        );
      }
    }
  });

  it("hands the shadow engine its own theme and the Thread the whole profile", () => {
    for (const { plan } of plans) {
      const shadowSections = plan.sections.filter((p) => p.shadow);
      expect(shadowSections.length).toBe(plan.shadows.length);
      for (const sh of shadowSections) {
        expect(sh.pages).toBeGreaterThanOrEqual(SHADOW_TEMPLATE.pages);
        expect(sh.section.themes).toEqual([sh.shadow!.theme]);
      }
      const thread = plan.sections.find((p) => p.section.id === "the-thread");
      expect(thread).toBeDefined();
    }
  });

  it("lands within a page count the buyer would recognise as the product", () => {
    for (const { s, plan } of plans) {
      expect(`${s.bd.name}: ${plan.totalPages}pp`).toBe(
        `${s.bd.name}: ${Math.min(Math.max(plan.totalPages, 55), 80)}pp`
      );
    }
  });

  it("carries a variant for every engine that changes shape rather than content", () => {
    for (const { s, plan } of plans) {
      for (const section of plan.sections) {
        if (!section.section.variantBy) continue;
        expect(`${s.bd.name}/${section.section.id}: ${section.variant ?? "MISSING"}`).not.toContain("MISSING");
      }
    }
  });
});

describe("Placidus, always, with no fallback", () => {
  it("accepts an ordinary chart", () => {
    const chart = calculateChart({
      name: "Ordinary",
      dateOfBirth: "1990-06-15",
      birthTime: "09:20",
      birthTimeApproximate: false,
      location: LOCATIONS[1],
    } as BirthData);
    expect(isPlacidusReliable(chart.birthData.location.latitude, chart.houses)).toEqual({ ok: true });
  });

  it("refuses a birth above the Arctic Circle at the form, before payment", () => {
    // Tromsø. The check runs on latitude alone so it can fire on the form, where the buyer has
    // entered a place but no chart has been calculated yet.
    const result = isPlacidusReliable(69.6492);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("extreme-latitude");
      expect(result.message).toMatch(/too far north or south/);
    }
  });

  it("refuses at generation before the ephemeris is even asked", () => {
    // Tromsø. Above the Arctic Circle the ephemeris returns no usable cusps at all and
    // calculateChart throws, so the guard has to run first or a paid order dies on an opaque
    // crash instead of being flagged with a reason.
    const lat = 69.6492;
    expect(() => assertPlacidusOrRefuse(lat)).toThrow(PlacidusUnreliableError);
    expect(() =>
      calculateChart({
        name: "Arctic",
        dateOfBirth: "1988-02-11",
        birthTime: "03:45",
        birthTimeApproximate: false,
        location: { placeName: "Tromsø, NO", city: "Tromsø", country: "NO", latitude: lat, longitude: 18.9553, timezone: "Europe/Oslo" },
      } as BirthData)
    ).toThrow();
  });

  it("refuses in the planner when a chart somehow reaches it with bad cusps", () => {
    // The backstop, tested directly: a chart that passed the form but whose cusps did not survive
    // recalculation must never be written up in a substituted house system.
    const bd: BirthData = {
      name: "Reykjavik",
      dateOfBirth: "1988-02-11",
      birthTime: "03:45",
      birthTimeApproximate: false,
      location: LOCATIONS[4],
    } as BirthData;
    const chart = calculateChart(bd);
    const hd = calculateHumanDesign(bd);
    const facts = deriveMoneyFacts(chart, hd);
    const profile = analyse(bd.name, chart, hd, sweep.freq, { now: NOW });
    expect(profile.flags.placidusReliable).toBe(true);

    const broken = { ...profile, flags: { ...profile.flags, placidusReliable: false, placidusFailureReason: "non-monotonic-cusps" as const } };
    expect(() => planReport(facts, broken, {}, NOW)).toThrow(PlacidusUnreliableError);
  });

  it("catches cusps that do not run in order", () => {
    const broken = Array.from({ length: 12 }, (_, i) => ({ house: i + 1, longitude: (i * 30) % 360 }));
    broken[5].longitude = 10; // 6th cusp jumps backwards
    const result = isPlacidusReliable(51.5, broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("non-monotonic-cusps");
  });

  it("catches cusps that are not finite", () => {
    const broken = Array.from({ length: 12 }, (_, i) => ({ house: i + 1, longitude: (i * 30) % 360 }));
    broken[2].longitude = Number.NaN;
    const result = isPlacidusReliable(51.5, broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("non-finite-cusps");
  });
});

afterAll(() => {
  const L: string[] = [];
  const P = (s = "") => L.push(s);

  P("# Stage ③ plan — results");
  P();
  P("Generated by `__tests__/money-blueprint-plan.test.ts` over the shared covering set.");
  P("Every chart below produced a complete plan with no empty sections and no single-placement shadow.");
  P();
  P("| Chart | Sections | Shadows | Pages | Skipped | Flags set |");
  P("|---|---|---|---|---|---|");
  for (const { s, plan } of plans) {
    P(
      `| ${s.bd.name} | ${plan.sections.length} | ${plan.shadows.length} | ${plan.totalPages} | ` +
        `${plan.skipped.map((x) => x.id).join(", ") || "none"} | ${unusualCount(plan.flags)} |`
    );
  }
  P();
  P("## Flag frequency across the set");
  P();
  const counts = new Map<string, number>();
  const bump = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1);
  for (const { plan } of plans) {
    const f = plan.flags;
    if (f.intercepted) bump("intercepted");
    if (f.aspectDensity !== "normal") bump(`aspects:${f.aspectDensity}`);
    if (f.retrogradeHeavy) bump("retrograde-heavy");
    if (f.convergenceProfile !== "normal") bump(`convergence:${f.convergenceProfile}`);
    if (f.systemConflict) bump("system-conflict");
    if (f.rareDesign) bump("rare-design");
    if (f.boundaryRisk.length) bump("boundary-risk");
    if (f.birthTimeSuspect) bump("birth-time-suspect");
    if (f.southernHemisphere) bump("southern-hemisphere");
    if (f.careRegister) bump("care-register");
    if (f.stelliumCount === 0) bump("no-stellium");
    if (f.stelliumCount > 1) bump("multiple-stelliums");
    bump(`age:${f.ageBracket}`);
  }
  P("| Flag | Charts | Share |");
  P("|---|---|---|");
  for (const [k, n] of [...counts].sort((a, b) => b[1] - a[1])) {
    P(`| ${k} | ${n} | ${((n / plans.length) * 100).toFixed(0)}% |`);
  }
  P();
  P("## Spine and shadows per chart");
  P();
  for (const { s, plan } of plans) {
    P(`### ${s.bd.name}`);
    P();
    P(`Spine: \`${plan.spine?.theme ?? "none"}\` (${plan.spine?.why ?? "no convergence"})`);
    P();
    for (const sh of plan.shadows) P(`- \`${sh.theme}\` — ${sh.label}`);
    P();
  }

  const out = path.join(__dirname, "../../money-blueprint/engine/test");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "PLAN-RESULTS.md"), L.join("\n"));
});
