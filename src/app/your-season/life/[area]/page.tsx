"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { useYourSzn } from "@/lib/use-your-szn";
import { composeLifeArea, LIFE_AREAS } from "@/lib/life-areas";
import { ordinalHouse } from "@/lib/interpretations";
import { getPrimaryGoal, type Goal } from "@/lib/goals-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function LifeAreaPage() {
  const params = useParams<{ area: string }>();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const season = useSeason();
  const { data: szn } = useYourSzn();
  const [primaryGoal, setPrimaryGoal] = useState<Goal | null>(null);

  useEffect(() => {
    setPrimaryGoal(getPrimaryGoal());
  }, []);

  const areaId = decodeURIComponent(params.area);

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
          <Link href="/onboarding" className="btn-pink">add my birth details</Link>
        </div>
      </section>
    );
  }

  const reading = composeLifeArea(areaId, chart, season, primaryGoal, szn?.transits);

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

      {/* What the ruling planet actually governs, before any personalised reasoning */}
      {reading.planetMeaning && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
            <div className="tag mb-3">what your {reading.bodyLabel} actually governs</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>{reading.planetMeaning}</p>
          </div>
        </section>
      )}

      {/* What that sign's own energy is, independent of the planet */}
      {reading.signMeaning && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--gold)" }}>
            <div className="tag mb-3">what {reading.sign.toLowerCase()} energy actually is</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#854F0B" }}>{reading.signMeaning}</p>
          </div>
        </section>
      )}

      {/* What the house itself governs */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--mint)" }}>
          <div className="tag mb-3">what your {ordinalHouse(reading.house)} house actually governs</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "#0F6E56" }}>{reading.houseMeaning.text}</p>
          <p style={{ fontSize: 12, color: "#0F6E56", marginTop: 14, opacity: 0.8 }}>
            Naturally associated with {reading.houseMeaning.naturalSign}, in your chart it&apos;s where {reading.label} actually lives, which is what the rest of this page is about.
          </p>
        </div>
      </section>

      {/* The second house feeding this area, when there is one, so the page covers every angle
          of the chart touching this life area, not just the primary house */}
      {reading.secondaryHouse && reading.secondaryHouseMeaning && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--mint)", opacity: 0.85 }}>
            <div className="tag mb-3">and what your {ordinalHouse(reading.secondaryHouse)} house adds on top</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#0F6E56" }}>{reading.secondaryHouseMeaning.text}</p>
            <p style={{ fontSize: 12, color: "#0F6E56", marginTop: 14, opacity: 0.8 }}>
              Naturally associated with {reading.secondaryHouseMeaning.naturalSign}, this is the second angle your chart uses to shape {reading.label}, worth reading alongside your {ordinalHouse(reading.house)} house, not instead of it.
            </p>
          </div>
        </section>
      )}

      {/* In your chart */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <div className="tag mb-3">putting it together, {reading.label} in your chart specifically</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70" }}>{reading.inYourChart}</p>
        </div>
      </section>

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
                  borderRight: (i + 1) % 4 !== 0 && i < otherAreas.length - 1 ? "var(--border)" : undefined,
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
