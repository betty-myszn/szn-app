"use client";

import Link from "next/link";
import type { SeasonInfo } from "@/lib/seasons";
import { LIFE_AREAS, composeLifeArea } from "@/lib/life-areas";
import { ordinalHouse } from "@/lib/interpretations";
import type { ChartData } from "@/types/chart";
import type { Goal } from "@/lib/goals-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Compact by design: one card per life area with a single chart-specific line, the real depth
// (planet/sign/house explainers, live transits, protocol, affirmations, activation ritual)
// lives on each area's own landing page at /your-season/life/[area]. Keeping this section
// scannable is the point, the my szn page was drowning in scroll when the full reads sat inline.
export default function LifeAreasGuide({
  season,
  chart,
  goal,
}: {
  season: SeasonInfo;
  chart: ChartData | null;
  goal: Goal | null;
}) {
  return (
    <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="tag mb-2">your szn, area by area</div>
        <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-0.7px", marginBottom: 10 }}>
          how {season.sign.toLowerCase()} szn is hitting every part of your life.
        </h2>
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, marginBottom: 20, maxWidth: 640 }}>
          Tap any area for what&apos;s being activated in your chart, the live transit hitting it right now, your protocol, affirmations and activation ritual.
        </p>
        {!chart ? (
          <div>
            <p style={{ fontSize: 13, color: "var(--grey-light)", marginBottom: 16 }}>Add your birth details to unlock this for every area of your life.</p>
            <Link href="/onboarding" className="btn-pink">add your chart</Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))",
              gap: 10,
            }}
          >
            {LIFE_AREAS.map((area) => {
              const reading = composeLifeArea(area.id, chart, season, goal);
              const tied = Boolean(goal && reading?.goalTieIn);
              return (
                <Link
                  key={area.id}
                  href={`/your-season/life/${area.id}`}
                  className="no-underline hover:opacity-90 transition-opacity"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `2px solid ${tied ? "var(--pink)" : "var(--dark)"}`,
                    background: tied ? "var(--pink-bg)" : "#fff",
                    color: "var(--dark)",
                  }}
                >
                  <span style={{ fontSize: 21, lineHeight: 1, flexShrink: 0 }}>{area.emoji}</span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        display: "block",
                        fontFamily: poppins,
                        fontSize: 15,
                        fontWeight: 800,
                        letterSpacing: "-0.3px",
                        lineHeight: 1.2,
                      }}
                    >
                      {area.label}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: tied ? "var(--pink)" : "#3C2A70",
                        marginTop: 3,
                      }}
                    >
                      {tied ? "tied to your goal" : `${ordinalHouse(area.houseNumbers[0])} house`}
                    </span>
                  </span>
                  <span aria-hidden style={{ fontSize: 15, color: "var(--pink)", flexShrink: 0 }}>
                    &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
