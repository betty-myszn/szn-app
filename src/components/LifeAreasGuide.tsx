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
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, marginBottom: 24, maxWidth: 640 }}>
          Tap any area for its full landing page: what&apos;s actually being activated in your chart, the live transit hitting it right now, Betty&apos;s take, your protocol, affirmations and activation ritual.
        </p>
        {!chart ? (
          <p style={{ fontSize: 13, color: "var(--grey-light)" }}>Add your birth details to unlock this for every area of your life.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            {LIFE_AREAS.map((area, i) => {
              const reading = composeLifeArea(area.id, chart, season, goal);
              return (
                <Link
                  key={area.id}
                  href={`/your-season/life/${area.id}`}
                  className="no-underline p-6 hover:bg-[#fafafa] transition-colors"
                  style={{
                    borderRight: i % 2 === 0 ? "var(--border)" : undefined,
                    borderBottom: i < LIFE_AREAS.length - 2 ? "var(--border)" : undefined,
                    color: "var(--dark)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span style={{ fontSize: 20 }}>{area.emoji}</span>
                    <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px" }}>
                      {area.label}
                    </span>
                    <span
                      style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                        background: "var(--lav-light)", color: "#3C2A70", padding: "3px 9px",
                      }}
                    >
                      {ordinalHouse(area.houseNumbers[0])} house
                    </span>
                    {goal && reading?.goalTieIn && (
                      <span
                        style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                          background: "var(--pink)", color: "var(--dark)", padding: "3px 9px",
                        }}
                      >
                        tied to your goal
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 10 }}>
                    {reading?.quickSummary}
                  </p>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>
                    how {season.sign.toLowerCase()} szn affects your {area.label} →
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
