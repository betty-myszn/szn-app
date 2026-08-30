"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { composePlacement, getBodyMeaning, ordinalHouse, HOUSE_MEANINGS, SIGN_OVERVIEWS, degreeMeaning } from "@/lib/interpretations";
import { PLANET_SYMBOLS } from "@/types/chart";
import { getSymbol } from "@/lib/style-data";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const SECTION_META: { key: "gifts" | "shadow" | "confidence" | "career" | "money" | "relationships" | "growth"; title: string; bg?: string; light?: boolean }[] = [
  { key: "gifts", title: "your gifts", bg: "var(--pink)", light: true },
  { key: "shadow", title: "your shadow", bg: "var(--dark)", light: true },
  { key: "confidence", title: "confidence" },
  { key: "career", title: "career" },
  { key: "money", title: "money", bg: "var(--gold)" },
  { key: "relationships", title: "relationships", bg: "var(--lav-light)" },
  { key: "growth", title: "personal growth" },
];

export default function PlacementPage() {
  const params = useParams<{ body: string }>();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();

  const bodyId = params.body;
  const body = getBodyMeaning(bodyId);

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

  if (!body || !chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            {!chart ? "add your birth details first." : "we couldn't find that placement."}
          </h1>
          <Link href={!chart ? "/onboarding" : "/my-chart"} className="btn-pink">
            {!chart ? "add your chart" : "back to my chart"}
          </Link>
        </div>
      </section>
    );
  }

  // Resolve sign + house for this body (rising/midheaven come from the angles)
  let sign = "";
  let house: number | undefined;
  let retrograde = false;
  let degreeLabel = "";
  let degreeNum = 0;
  if (bodyId === "rising") {
    sign = chart.houses[0]?.sign || "";
    house = 1;
    degreeLabel = chart.houses[0]?.formattedDegree || "";
    degreeNum = chart.houses[0]?.degree ?? 0;
  } else if (bodyId === "midheaven") {
    sign = chart.houses[9]?.sign || "";
    house = 10;
    degreeLabel = chart.houses[9]?.formattedDegree || "";
    degreeNum = chart.houses[9]?.degree ?? 0;
  } else {
    const planet = chart.planets.find((p) => p.id === bodyId);
    if (planet) {
      sign = planet.sign;
      house = planet.house;
      retrograde = planet.retrograde;
      degreeLabel = planet.formattedDegree;
      degreeNum = planet.degree;
    }
  }

  const sections = sign ? composePlacement(bodyId, sign, house) : null;

  if (!sections) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t read that placement.
          </h1>
          <Link href="/my-chart" className="btn-pink">back to my chart</Link>
        </div>
      </section>
    );
  }

  const houseMeaning = house ? HOUSE_MEANINGS[house - 1] : undefined;
  const signOverview = SIGN_OVERVIEWS[sign];

  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/my-chart"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← my chart
          </Link>
          <div style={{ fontSize: 40, margin: "18px 0 6px", color: "var(--pink)" }}>
            {PLANET_SYMBOLS[body.name] || getSymbol(sign)}
          </div>
          <div className="tag mb-2">
            {body.name.toLowerCase()} · {body.title} · {degreeLabel} {retrograde ? "· retrograde" : ""}
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            {body.name.toLowerCase()} in <span className="pk">{sign.toLowerCase()}</span>
            {house ? <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.55em", fontWeight: 700 }}> · {ordinalHouse(house)} house</span> : null}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 580 }}>
            {body.intro}
          </p>
        </div>
      </section>

      {/* What this planet/point actually is */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
          <div className="tag mb-3">what {body.name.toLowerCase()} actually governs</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>{body.deepDive}</p>
        </div>
      </section>

      {/* What this sign actually is */}
      {signOverview && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--gold)" }}>
            <div className="tag mb-3">what {sign.toLowerCase()} energy actually is</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70" }}>{signOverview.archetype}</p>
            <div className="flex gap-2 flex-wrap" style={{ marginTop: 16 }}>
              {[`${signOverview.element} element`, `${signOverview.modality} modality`, `ruled by ${signOverview.ruler}`].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    background: "rgba(133,79,11,0.12)", color: "#3C2A70", padding: "5px 12px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What the exact degree means */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "#fafafa" }}>
          <div className="tag mb-3">what {degreeLabel} actually means</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>
            Your {body.name.toLowerCase()} sits at {degreeMeaning(degreeNum)}
          </p>
        </div>
      </section>

      {/* What this house actually governs */}
      {houseMeaning && house && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--mint)" }}>
            <div className="tag mb-3">what your {ordinalHouse(house)} house actually governs</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#0F6E56" }}>{houseMeaning.deepDive}</p>
            <p style={{ fontSize: 12, color: "#0F6E56", marginTop: 14, opacity: 0.8 }}>
              Naturally associated with {houseMeaning.naturalSign}, though your chart places {body.name.toLowerCase()} in {sign.toLowerCase()} here specifically.
            </p>
          </div>
        </section>
      )}

      {/* Betty's Take */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>betty&apos;s take</div>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{sections.bettysTake}</p>
        </div>
      </section>

      {/* Your Blind Spot */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--pink)" }}>
          <div className="tag mb-3" style={{ color: "#fff" }}>your blind spot</div>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{sections.blindSpot}</p>
        </div>
      </section>

      {/* Why it repeats / this week's move / how you'll know */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">from awareness into action</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            <div className="p-7" style={{ borderRight: "var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 10 }}>
                why it keeps happening
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--grey)" }}>{sections.whyItRepeats}</p>
            </div>
            <div className="p-7" style={{ borderRight: "var(--border)", background: "var(--gold)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 10 }}>
                this week&apos;s move
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#3C2A70", fontWeight: 600 }}>{sections.thisWeeksMove}</p>
            </div>
            <div className="p-7" style={{ background: "var(--mint)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0F6E56", marginBottom: 10 }}>
                how you&apos;ll know it&apos;s working
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#0F6E56" }}>{sections.howYoullKnow}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">tap any section for your full deep dive</div>
          <div className="grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          {SECTION_META.map((meta, i) => (
            <Link
              key={meta.key}
              href={`/my-chart/${bodyId}/${meta.key}`}
              className="no-underline p-7 block transition-opacity hover:opacity-90"
              style={{
                background: meta.bg || "#fff",
                borderRight: i % 2 === 0 ? "var(--border)" : undefined,
                borderBottom: i < SECTION_META.length - 2 ? "var(--border)" : undefined,
                color: meta.light ? "#fff" : "var(--dark)",
              }}
            >
              <div className="tag mb-3" style={meta.light ? { color: "#fff" } : undefined}>
                {meta.title}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: meta.light ? "rgba(255,255,255,0.85)" : "var(--grey)", marginBottom: 12 }}>
                {sections[meta.key]}
              </p>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: meta.light ? "rgba(255,255,255,0.75)" : "var(--pink)",
                }}
              >
                go deeper →
              </div>
            </Link>
          ))}
          {/* House context card fills the 8th slot */}
          <div className="p-7" style={{ background: "var(--lav-light)" }}>
            <div className="tag mb-3">where it lives</div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#3C2A70" }}>
              {houseMeaning
                ? `This placement sits in your ${ordinalHouse(house!)} house of ${houseMeaning.title}, ${houseMeaning.rules}. ${houseMeaning.coach}`
                : "This placement colours your whole chart rather than one single life area."}
            </p>
            {house && (
              <Link
                href={`/my-chart/house/${house}`}
                className="no-underline"
                style={{ display: "inline-block", marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", borderBottom: "1.5px solid var(--pink)", paddingBottom: 2 }}
              >
                explore your {ordinalHouse(house)} house →
              </Link>
            )}
          </div>
          </div>
        </div>
      </section>

      {/* Prompts + affirmations */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-4">journal prompts</div>
            <div className="flex flex-col gap-4">
              {sections.prompts.map((prompt, i) => (
                <p key={i} style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px", lineHeight: 1.5, color: "#3C2A70" }}>
                  {i + 1}. {prompt}
                </p>
              ))}
            </div>
            <Link href="/journal" className="btn-pink" style={{ display: "inline-block", marginTop: 20 }}>
              journal on this
            </Link>
          </div>
          <div className="p-8" style={{ background: "var(--pink)" }}>
            <div className="tag mb-4" style={{ color: "#fff" }}>your affirmations</div>
            <div className="flex flex-col gap-5">
              {sections.affirmations.map((aff, i) => (
                <p key={i} style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.35, color: "#fff" }}>
                  &ldquo;{aff}&rdquo;
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
