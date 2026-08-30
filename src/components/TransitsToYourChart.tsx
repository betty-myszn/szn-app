"use client";

import { composeTransitContact } from "@/lib/transit-contact-content";
import type { TransitData } from "@/types/chart";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// "The sky, but against YOUR chart." Everything above this on the dashboard reads the sky
// collectively; this is the block that says which of her own placements the sky is actually
// touching right now. The astrology is computed in transits.ts from the Swiss Ephemeris (real
// positions at request time, transit-tight orbs, applying/separating); this only renders it.
//
// Renders nothing when nothing is genuinely in orb, rather than padding with a weak contact: an
// empty week is real information, and inventing one would undo the point of the section.
export default function TransitsToYourChart({ transits }: { transits: TransitData | undefined }) {
  const placements = (transits?.activatedPlacements ?? []).slice(0, 3);
  if (placements.length === 0) return null;

  // Pair each activated placement back to its aspect so we know whether it is still closing in.
  const applyingFor = (natalPlanet: string, activatedBy: string): boolean | undefined =>
    transits?.transitAspects?.find(
      (a) => a.natalPlanet === natalPlanet && a.transitPlanet === activatedBy
    )?.applying;

  return (
    <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--pink)",
            marginBottom: 10,
          }}
        >
          the sky, on your chart
        </div>
        <h2
          style={{
            fontFamily: poppins,
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          what&apos;s actually touching <span className="pk">your placements</span> right now.
        </h2>
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, maxWidth: 620, marginBottom: 26 }}>
          Not the general forecast. These are live contacts between where the planets are today and
          the exact degrees you were born with, so this list is yours and nobody else&apos;s.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {placements.map((p) => {
            const r = composeTransitContact(p, applyingFor(p.natalPlanet, p.activatedBy));
            const exact = r.orb <= 1;
            return (
              <div
                key={`${p.activatedBy}-${p.natalPlanet}-${p.aspectType}`}
                style={{
                  border: "var(--border)",
                  background: exact ? "var(--pink-bg)" : "#fff",
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "4px 9px",
                      background: exact ? "var(--pink)" : "var(--lav-light)",
                      color: exact ? "#fff" : "#3C2A70",
                    }}
                  >
                    {r.timing}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--grey-light)", fontVariantNumeric: "tabular-nums" }}>
                    {p.aspectType} · {r.orb.toFixed(1)}°
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: poppins,
                    fontSize: 19,
                    fontWeight: 800,
                    letterSpacing: "-0.4px",
                    lineHeight: 1.2,
                    textTransform: "lowercase",
                  }}
                >
                  {r.headline}
                </div>

                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--grey)" }}>{r.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
