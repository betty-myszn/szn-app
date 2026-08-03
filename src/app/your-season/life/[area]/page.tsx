"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { useYourSzn } from "@/lib/use-your-szn";
import { composeLifeArea, LIFE_AREAS, resolveAreaId } from "@/lib/life-areas";
import { useHumanDesign } from "@/lib/use-human-design";
import { composeAreaDesign } from "@/lib/life-area-design";
import WovenAreaRead from "@/components/WovenAreaRead";
import { ordinalHouse } from "@/lib/interpretations";
import { getPrimaryGoal, type Goal } from "@/lib/goals-store";
import ShareButtons from "@/components/ShareButtons";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function LifeAreaPage() {
  const params = useParams<{ area: string }>();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const season = useSeason();
  const { data: szn } = useYourSzn();
  // Human Design is loaded alongside the chart rather than on a page of its own, so the two systems
  // can answer the same question together. It resolves independently, and the section below simply
  // does not render until it arrives, so the astrology reading is never held up waiting for it.
  const { hd } = useHumanDesign();
  const [primaryGoal, setPrimaryGoal] = useState<Goal | null>(null);

  useEffect(() => {
    setPrimaryGoal(getPrimaryGoal());
  }, []);

  // Resolves merged areas (business now lives inside career), so an old link still lands.
  const areaId = resolveAreaId(decodeURIComponent(params.area));

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            members only, babe.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            add your birth details to unlock this.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            Life area guidance is personalised to your exact chart. Add your birth details and every area opens up for you.
          </p>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  const reading = composeLifeArea(areaId, chart, season, primaryGoal, szn?.transits);
  // Null for any area Human Design has nothing specific to say about, which is deliberate.
  const design = hd ? composeAreaDesign(areaId, hd, season.sign) : null;

  if (!reading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t find that life area.
          </h1>
          <Link href="/your-season" className="btn-pink">back to this season</Link>
        </div>
      </section>
    );
  }

  const otherAreas = LIFE_AREAS.filter((a) => a.id !== areaId);

  // One clickable "go deeper" link per distinct planet in the framework: the recipe-house rulers,
  // the named planet layers, the point layers and the ascendant ruler, de-duplicated so a planet
  // that plays several roles only appears once.
  const frameworkLinks: { id: string; name: string }[] = [];
  const seenLinks = new Set<string>();
  const addLink = (id: string | undefined, name: string | undefined) => {
    if (!id || !name || seenLinks.has(id)) return;
    seenLinks.add(id);
    frameworkLinks.push({ id, name });
  };
  reading.recipeHouses.forEach((c) => addLink(c.ruler?.rulerId, c.ruler?.rulerName));
  reading.planetLayers.forEach((p) => addLink(p.id, p.name));
  reading.pointLayers.forEach((p) => addLink(p.id, p.name));
  addLink(reading.ascendantLayer?.ruler?.rulerId, reading.ascendantLayer?.ruler?.rulerName);

  // Mindset uses the woven astrology + Human Design read (one voice), the first area on the new
  // format. Other areas keep the current layout until the format is rolled out.
  if (areaId === "mindset") {
    return (
      <>
        <section className="px-5 md:px-8 py-4" style={{ background: "var(--dark)" }}>
          <div className="max-w-4xl mx-auto">
            <Link
              href="/your-season"
              className="no-underline"
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
            >
              back to {season.sign.toLowerCase()} szn
            </Link>
          </div>
        </section>
        <section className="px-5 md:px-8 py-10">
          <WovenAreaRead reading={reading} design={design} seasonSign={season.sign} />
        </section>
        <section className="px-5 md:px-8 pb-12">
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Link href="/journal" className="btn-pink" style={{ display: "inline-block" }}>journal on this area</Link>
          </div>
        </section>
        <section className="px-5 md:px-8 py-12" style={{ borderTop: "var(--border)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="tag mb-5">explore another area of your szn</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
              {otherAreas.map((area, i) => (
                <Link
                  key={area.id}
                  href={`/your-season/life/${area.id}`}
                  className="no-underline p-5 text-center hover:bg-[#fafafa] transition-colors"
                  style={{
                    borderRight: (i + 1) % 4 !== 0 ? "var(--border)" : undefined,
                    borderBottom: Math.floor(i / 4) < Math.floor((otherAreas.length - 1) / 4) ? "var(--border)" : undefined,
                    color: "var(--dark)",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{area.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{area.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/your-season"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            back to {season.sign.toLowerCase()} szn
          </Link>
          <div className="tag mb-2" style={{ marginTop: 18 }}>
            {season.sign.toLowerCase()} szn · life area guide
          </div>
          <div style={{ fontSize: 36, marginBottom: 6 }}>{reading.emoji}</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            how {season.sign.toLowerCase()} szn affects<br />
            <span className="pk">your {reading.label}.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 560 }}>
            {reading.whatThisIsAbout}
          </p>
        </div>
      </section>

      {/* Your Signature: the one paragraph that actually connects house, cusp, ruler and ruler
          placement into a single cohesive read, the piece worth screenshotting. */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "2px solid var(--pink)", background: "var(--pink-light)" }}>
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>your {reading.label} signature</div>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: "var(--dark)", fontWeight: 500, marginBottom: 18 }}>
            {reading.signature}
          </p>
          <ShareButtons text={`my ${reading.label} signature: ${reading.cuspSign.toLowerCase()} on my ${ordinalHouse(reading.house)} house cusp, ruled by ${reading.rulerPlacement?.rulerName.toLowerCase() || reading.sign.toLowerCase()}. this app actually reads charts properly ✨`} />
        </div>
      </section>

      {/* Goal tie-in, only shows when the member's active goal maps to this life area */}
      {reading.goalTieIn && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--pink)" }}>
            <div className="tag mb-3" style={{ color: "#fff" }}>tied to your goal</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#fff", fontWeight: 500 }}>{reading.goalTieIn}</p>
          </div>
        </section>
      )}

      {/* Betty's Take */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>betty&apos;s take</div>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{reading.bettysTake}</p>
        </div>
      </section>

      {/* The real block, this is the depth layer: named from an actual hard aspect where one exists */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--pink)" }}>
          <div className="tag mb-3" style={{ color: "#fff" }}>the real block</div>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{reading.rootPattern}</p>
        </div>
      </section>

      {/* Your Blind Spot */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--gold)" }}>
          <div className="tag mb-3">your blind spot</div>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "#854F0B", fontWeight: 500 }}>{reading.blindSpot}</p>
        </div>
      </section>

      {/* Before / after reframe */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">the shift</div>
          <div className="grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            <div className="p-8" style={{ borderRight: "var(--border)", background: "#fafafa" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 10 }}>
                the belief running the show
              </div>
              <p style={{ fontSize: 17, fontStyle: "italic", lineHeight: 1.6, color: "var(--dark)" }}>
                &ldquo;{reading.shiftBefore}&rdquo;
              </p>
            </div>
            <div className="p-8" style={{ background: "var(--pink)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: 10 }}>
                the belief you're building instead
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6, color: "#fff" }}>
                &ldquo;{reading.shiftAfter}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affirmations */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--pink)" }}>
          <div className="tag mb-4" style={{ color: "#fff" }}>affirmations for {reading.label}</div>
          <div className="flex flex-col gap-5">
            {reading.affirmations.map((aff, i) => (
              <p key={i} style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.35, color: "#fff" }}>
                &ldquo;{aff}&rdquo;
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Activation ritual, one thing to do right now, distinct from the 5-day protocol below */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
          <div className="tag mb-3" style={{ color: "var(--lav)" }}>activate it right now</div>
          <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff", marginBottom: 12 }}>
            {reading.activation.title}.
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.85)" }}>{reading.activation.ritual}</p>
        </div>
      </section>

      {/* 5-day protocol */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-2">the protocol</div>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 10 }}>
            {reading.protocolTitle}.
          </h2>
          <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>
            One small, specific action a day. Real change is built from repetition, not a single grand gesture. Do these in order across five days this week.
          </p>
          <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
            {reading.protocolDays.map((step, i) => (
              <div
                key={step}
                className="p-6 flex gap-5 items-start"
                style={{ borderBottom: i < reading.protocolDays.length - 1 ? "var(--border)" : undefined }}
              >
                <div
                  className="flex flex-col items-center justify-center shrink-0"
                  style={{ width: 56, height: 56, border: "1.5px solid var(--pink)" }}
                >
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>day</span>
                  <span style={{ fontFamily: poppins, fontWeight: 800, fontSize: 18, color: "var(--pink)" }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey)", paddingTop: 8 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stretch move */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--gold)" }}>
          <div className="tag mb-3">the stretch move</div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: "#854F0B", fontWeight: 600 }}>
            {reading.stretchMove}
          </p>
          <p style={{ fontSize: 12, color: "#854F0B", marginTop: 14, opacity: 0.8 }}>
            This is the one action that creates outsized change. The protocol builds the muscle, this is where you actually use it.
          </p>
        </div>
      </section>

      {/* Proof it's working */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">how you&apos;ll know it&apos;s working</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            {reading.proofMarkers.map((marker, i) => (
              <div
                key={marker}
                className="p-6"
                style={{ borderRight: i < reading.proofMarkers.length - 1 ? "var(--border)" : undefined, background: "var(--mint)" }}
              >
                <p style={{ fontSize: 13, lineHeight: 1.75, color: "#0F6E56" }}>{marker}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything above is what to do about it. Everything below is why this is her read and
          not a generic one: the chart mechanics that produced it. Same content as before, moved
          under the actions rather than stacked in front of them. */}
      <section className="px-5 md:px-8 pt-14 pb-2">
        <div className="max-w-4xl mx-auto">
          <div className="rule" style={{ color: "var(--dark)" }}>
            <span>why this is your read</span>
          </div>
        </div>
      </section>

      {/* The interpretive payoff: the 80%. Deep synthesis that connects the whole chain and
          answers why it matters, how the season shifts it, and what to do, in coaching voice. */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">what this actually means for you</div>
          <div className="flex flex-col gap-5">
            {reading.deepSynthesis.map((para, i) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)" }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* What matters most: the engine's prioritisation lead, so the framework opens by telling
          the member what to weight most in their specific chart rather than giving every factor
          equal airtime. */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "2px solid var(--gold)", background: "var(--gold)" }}>
          <div className="tag mb-3" style={{ color: "#854F0B" }}>what matters most in your chart</div>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: "#854F0B", fontWeight: 600 }}>{reading.priorityLead}</p>
        </div>
      </section>

      {/* The full framework: every house in this area's recipe with its complete rulership chain,
          every named planet layer, any chart points and the rising sign, all woven together and
          tied to the season. Generalises the old two-house axis to each area's own recipe. */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "2px solid var(--lav)", background: "var(--lav-light)" }}>
          <div className="tag mb-5">your {reading.axisLabel}</div>
          <div className="flex flex-col gap-5">
            {reading.frameworkSynthesis.map((para, i) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.9, color: "#3C2A70" }}>{para}</p>
            ))}
          </div>
          {frameworkLinks.length > 0 && (
            <div className="flex gap-6 flex-wrap" style={{ marginTop: 22 }}>
              {frameworkLinks.map((l) => (
                <Link
                  key={l.id}
                  href={`/my-chart/${l.id}`}
                  className="pk no-underline"
                  style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1.5px solid currentColor", paddingBottom: 2 }}
                >
                  go deeper on {l.name.toLowerCase()} →
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Human Design, deliberately sitting directly after the live transits rather than on a page
          of its own. The transits above say what the sky is doing to this area right now; this says
          how she is actually built to handle it. Renders nothing at all for an area with no HD
          mapping, or before the design has loaded. */}
      {design && (
        <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)", background: "var(--lav-light)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="tag mb-2" style={{ color: "#3C2A70" }}>your design in this area</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#3C2A70", marginBottom: 22, maxWidth: 620 }}>
              Your chart says what this season is asking of your {reading.label}. Your Human Design
              says how you&apos;re built to answer it. Same question, two maps.
            </p>

            {/* Only on home & environment: the kind of space her energy actually works in. Written
                as the insight rather than the mechanics, she does not need the theory to use it. */}
            {design.environment && (
              <div className="p-7 mb-5" style={{ border: "1.5px solid var(--pink)", background: "#fff" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 6 }}>
                  the spaces your energy works in
                </div>
                <h3 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px", color: "var(--dark)", marginBottom: 8 }}>
                  {design.environment.headline}.
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--dark)" }}>{design.environment.body}</p>
              </div>
            )}

            <div style={{ border: "var(--border)", background: "#fff" }}>
              <div className="p-7">
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 6 }}>
                  how you decide · {design.authority.label.toLowerCase()}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--dark)" }}>{design.authority.body}</p>
              </div>

              <div className="p-7" style={{ borderTop: "var(--border)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 6 }}>
                  how it starts · {design.strategy.label.toLowerCase()}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--dark)" }}>{design.strategy.body}</p>
              </div>
            </div>

            {/* Gates the season is switching on. The ones that sit in this area's own centres are
                the real read and get full cards; the rest genuinely are active this season but
                belong to other areas, so they sit below in a lighter "also stirring" group rather
                than competing with the core ones. */}
            {design.gates.length > 0 && (() => {
              const coreGates = design.gates.filter((g) => g.core);
              const contextGates = design.gates.filter((g) => !g.core);
              // If nothing sits in this area's centres this season, show everything as the main read.
              const mainGates = coreGates.length > 0 ? coreGates : design.gates;
              const extraGates = coreGates.length > 0 ? contextGates : [];
              return (
                <div style={{ marginTop: 26 }}>
                  <div className="tag mb-3" style={{ color: "#3C2A70" }}>
                    the gates {season.sign.toLowerCase()} szn is switching on in your {reading.label}
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "#3C2A70", marginBottom: 16, maxWidth: 620 }}>
                    {design.gatesIntro}
                  </p>
                  <div style={{ border: "var(--border)", background: "#fff" }}>
                    {mainGates.map((gate, i) => (
                      <div key={gate.gate} className="p-6" style={{ borderTop: i === 0 ? undefined : "var(--border)" }}>
                        <div className="flex items-baseline gap-3 flex-wrap" style={{ marginBottom: 6 }}>
                          <h3 style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, color: "var(--dark)" }}>
                            gate {gate.gate}, {gate.name.toLowerCase()}
                          </h3>
                          {gate.natal && (
                            <span
                              style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                background: "var(--pink)", color: "#fff", padding: "3px 8px",
                              }}
                            >
                              one of yours
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", marginBottom: 10 }}>
                          {gate.lens}
                        </p>
                        {gate.natal && (
                          <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--grey)", marginBottom: 10 }}>
                            You were born with this one, so this season is turning up something already
                            running in you.
                          </p>
                        )}
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)" }}>
                          <strong>the trap:</strong> {gate.shadow.toLowerCase()}
                          <span style={{ color: "var(--grey-light)" }}> → </span>
                          <strong>the move:</strong> {gate.gift.toLowerCase()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {extraGates.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div className="tag mb-2" style={{ color: "var(--grey)" }}>
                        also stirring this season
                      </div>
                      <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--grey)", marginBottom: 12, maxWidth: 620 }}>
                        These sit in other centres, so they colour the edges of your {reading.label} rather than its core.
                      </p>
                      <div style={{ border: "var(--border)", background: "#fafafa" }}>
                        {extraGates.map((gate, i) => (
                          <div key={gate.gate} className="px-6 py-4" style={{ borderTop: i === 0 ? undefined : "var(--border)" }}>
                            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--dark)" }}>
                              <strong>gate {gate.gate}, {gate.name.toLowerCase()}</strong>
                              {gate.natal ? " (one of yours). " : ". "}
                              {gate.lens}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <Link
              href="/human-design"
              className="no-underline"
              style={{ display: "inline-block", marginTop: 18, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}
            >
              see your full human design →
            </Link>
          </div>
        </section>
      )}

      {/* Live transits hitting this exact area, real sky right now, not static season copy.
          Shows every current match across both houses, not just the single closest one. */}
      {reading.transitLines.length > 0 && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "1.5px solid var(--pink)", background: "rgba(255,45,135,0.05)" }}>
            <div className="tag mb-3" style={{ color: "var(--pink)" }}>
              {reading.transitLines.length > 1 ? "the transits hitting this right now" : "the transit hitting this right now"}
            </div>
            <div className="flex flex-col gap-4">
              {reading.transitLines.map((line, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.85, color: "var(--dark)" }}>{line}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The 20%: the raw ingredients, compact. Three short lines, not three full textbook
          sections, so the page teaches fast and interprets slow. */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-4">the ingredients, quickly</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            <div className="p-5" style={{ borderRight: "var(--border)", background: "var(--mint)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0F6E56", marginBottom: 6 }}>the house</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#0F6E56" }}>{reading.quickContext.house}</p>
            </div>
            <div className="p-5" style={{ borderRight: "var(--border)", background: "var(--gold)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#854F0B", marginBottom: 6 }}>the sign on it</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#854F0B" }}>{reading.quickContext.cuspSign}</p>
            </div>
            <div className="p-5" style={{ background: "var(--lav-light)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 6 }}>its ruler</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#3C2A70" }}>{reading.quickContext.ruler}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Season edge + journal CTA */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ background: "var(--dark)", borderRight: "var(--border)" }}>
            <div className="tag mb-3" style={{ color: "var(--lav)" }}>this szn&apos;s edge</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.85)" }}>{reading.seasonEdge}</p>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="tag mb-3">track it</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--grey)", marginBottom: 18 }}>
              Log each day of the protocol and what shifts, this is exactly what shadow work and reflection entries are for.
            </p>
            <Link href="/journal" className="btn-pink" style={{ alignSelf: "flex-start" }}>journal on this area</Link>
          </div>
        </div>
      </section>

      {/* Other life areas */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">explore another area of your szn</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
            {otherAreas.map((area, i) => (
              <Link
                key={area.id}
                href={`/your-season/life/${area.id}`}
                className="no-underline p-5 text-center hover:bg-[#fafafa] transition-colors"
                style={{
                  // Right border on every cell except those in the last column. The last item can
                  // land mid-row (11 areas in a 4-col grid ends 4/4/3), so it still needs its right
                  // border to close the box, otherwise it merges into the empty trailing cell.
                  borderRight: (i + 1) % 4 !== 0 ? "var(--border)" : undefined,
                  borderBottom: Math.floor(i / 4) < Math.floor((otherAreas.length - 1) / 4) ? "var(--border)" : undefined,
                  color: "var(--dark)",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>{area.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{area.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
