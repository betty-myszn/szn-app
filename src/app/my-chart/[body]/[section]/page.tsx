"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { composeSectionDeepDive, SECTION_LABELS, type SectionKey } from "@/lib/placement-sections";
import { getBodyMeaning, ordinalHouse } from "@/lib/interpretations";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const VALID_SECTIONS: SectionKey[] = ["gifts", "shadow", "confidence", "career", "money", "relationships", "growth"];

export default function PlacementSectionPage() {
  const params = useParams<{ body: string; section: string }>();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();

  const bodyId = params.body;
  const sectionKey = params.section as SectionKey;
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

  if (!body || !chart || !VALID_SECTIONS.includes(sectionKey)) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            {!chart ? "add your birth details first." : "we couldn't find that page."}
          </h1>
          <Link href={!chart ? "/onboarding" : "/my-chart"} className="btn-pink">
            {!chart ? "add your chart" : "back to my chart"}
          </Link>
        </div>
      </section>
    );
  }

  let sign = "";
  let house: number | undefined;
  if (bodyId === "rising") {
    sign = chart.houses[0]?.sign || "";
    house = 1;
  } else if (bodyId === "midheaven") {
    sign = chart.houses[9]?.sign || "";
    house = 10;
  } else {
    const planet = chart.planets.find((p) => p.id === bodyId);
    if (planet) {
      sign = planet.sign;
      house = planet.house;
    }
  }

  const deep = sign ? composeSectionDeepDive(bodyId, sectionKey, sign, house, chart) : null;

  if (!deep) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t read that section.
          </h1>
          <Link href={`/my-chart/${bodyId}`} className="btn-pink">back to {body.name.toLowerCase()}</Link>
        </div>
      </section>
    );
  }

  const otherSections = VALID_SECTIONS.filter((s) => s !== sectionKey);

  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/my-chart/${bodyId}`}
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← {body.name.toLowerCase()} in {sign.toLowerCase()}
          </Link>
          <div style={{ fontSize: 36, margin: "18px 0 6px" }}>{deep.emoji}</div>
          <div className="tag mb-2">
            {body.name.toLowerCase()} · {sign.toLowerCase()}{house ? ` · ${ordinalHouse(house)} house` : ""} · deep dive
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5.5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            <span className="pk">{deep.sectionLabel}.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 580 }}>
            {deep.whatThisIsAbout}
          </p>
        </div>
      </section>

      {/* What this planet/point actually is */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
          <div className="tag mb-3">what {body.name.toLowerCase()} actually governs</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>{deep.planetMeaning}</p>
        </div>
      </section>

      {/* What this sign actually is, independent of the planet */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--gold)" }}>
          <div className="tag mb-3">what {sign.toLowerCase()} energy actually is</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "#854F0B" }}>{deep.signMeaning}</p>
        </div>
      </section>

      {/* What this house actually governs */}
      {deep.houseMeaning && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--mint)" }}>
            <div className="tag mb-3">what your {ordinalHouse(house!)} house actually governs</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#0F6E56" }}>{deep.houseMeaning.text}</p>
            <p style={{ fontSize: 12, color: "#0F6E56", marginTop: 14, opacity: 0.8 }}>
              Naturally associated with {deep.houseMeaning.naturalSign}, though your chart places {body.name.toLowerCase()} in {sign.toLowerCase()} here specifically, which is what the rest of this page is actually about.
            </p>
          </div>
        </section>
      )}

      {/* In your chart */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <div className="tag mb-3">putting it together, {deep.sectionLabel} in your chart specifically</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70" }}>{deep.inYourChart}</p>
        </div>
      </section>

      {/* Betty's Take */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>betty&apos;s take</div>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{deep.bettysTake}</p>
        </div>
      </section>

      {/* The real block */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--pink)" }}>
          <div className="tag mb-3" style={{ color: "#fff" }}>the real block</div>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{deep.rootPattern}</p>
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
                &ldquo;{deep.shiftBefore}&rdquo;
              </p>
            </div>
            <div className="p-8" style={{ background: "var(--gold)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#854F0B", marginBottom: 10 }}>
                the belief you&apos;re building instead
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6, color: "#854F0B" }}>
                &ldquo;{deep.shiftAfter}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-day protocol */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-2">the protocol</div>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 10 }}>
            {deep.protocolTitle}.
          </h2>
          <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>
            One small, specific action a day, tied directly to your {deep.bodyName.toLowerCase()} in {deep.sign.toLowerCase()}. Do these in order across five days this week.
          </p>
          <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
            {deep.protocolDays.map((step, i) => (
              <div
                key={step}
                className="p-6 flex gap-5 items-start"
                style={{ borderBottom: i < deep.protocolDays.length - 1 ? "var(--border)" : undefined }}
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
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--mint)" }}>
          <div className="tag mb-3">the stretch move</div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: "#0F6E56", fontWeight: 600 }}>{deep.stretchMove}</p>
          <p style={{ fontSize: 12, color: "#0F6E56", marginTop: 14, opacity: 0.8 }}>
            The protocol builds the muscle, this is where you actually use it for something that matters.
          </p>
        </div>
      </section>

      {/* Proof it's working */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">how you&apos;ll know it&apos;s working</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            {deep.proofMarkers.map((marker, i) => (
              <div
                key={marker}
                className="p-6"
                style={{ borderRight: i < deep.proofMarkers.length - 1 ? "var(--border)" : undefined, background: "var(--lav-light)" }}
              >
                <p style={{ fontSize: 13, lineHeight: 1.75, color: "#3C2A70" }}>{marker}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal + affirmation */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-4">journal on it</div>
            <p style={{ fontFamily: poppins, fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.5, color: "#3C2A70", marginBottom: 20 }}>
              {deep.journalPrompt}
            </p>
            <Link href="/journal" className="btn-pink">open my journal</Link>
          </div>
          <div className="p-8" style={{ background: "var(--pink)" }}>
            <div className="tag mb-4" style={{ color: "#fff" }}>your affirmation</div>
            <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.3, color: "#fff" }}>
              &ldquo;{deep.affirmation}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Other sections of this placement */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">go deeper on another section of your {body.name.toLowerCase()}</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            {otherSections.map((s, i) => {
              const m = SECTION_LABELS[s];
              return (
                <Link
                  key={s}
                  href={`/my-chart/${bodyId}/${s}`}
                  className="no-underline p-5 text-center hover:bg-[#fafafa] transition-colors"
                  style={{
                    borderRight: (i + 1) % 3 !== 0 ? "var(--border)" : undefined,
                    borderBottom: i < otherSections.length - 3 ? "var(--border)" : undefined,
                    color: "var(--dark)",
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{m.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{m.label}</div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/my-chart"
              className="no-underline"
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}
            >
              back to my whole chart →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
