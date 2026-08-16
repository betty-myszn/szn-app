"use client";

import Link from "next/link";
import { useSeasonDesign } from "@/lib/use-season-design";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The season x Human Design block on the dashboard.
//
// This has been through three versions. It started as the full 16-section reading rendered
// inline, which ran longer than the rest of the dashboard combined. It then became six collapsed
// accordion rows, which was shorter but still put a whole reading in the middle of a scroll that
// is meant to be scannable. It is now a doorway: the four facts worth seeing without a tap, the
// one line that lands, and a button through to the full read.
//
// The reading itself did not move or shrink. It lives at /your-season/human-design and still
// renders the complete SeasonDesignReadingView.
//
// Renders nothing until the reading is ready, or if the season has no Human Design definition
// yet, so it can never break the dashboard for a member without birth data.
export default function SeasonDesignInline() {
  const { reading, loading, unavailable } = useSeasonDesign();

  if (loading || unavailable || !reading) return null;
  const r = reading;
  const sign = r.season.sign.toLowerCase();

  return (
    <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="tag mb-2">astrology + human design</div>
        <h2
          style={{
            fontFamily: pp,
            fontWeight: 800,
            fontSize: 30,
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            textTransform: "lowercase",
            margin: "0 0 18px",
          }}
        >
          how your energy works with {sign} season
        </h2>

        <div
          style={{
            border: "2px solid var(--dark)",
            borderRadius: 22,
            overflow: "hidden",
            background: "linear-gradient(130deg, #FFEAF3 0%, #F7ECFF 55%, #EEE6FE 100%)",
          }}
        >
          <div style={{ padding: "26px 26px 22px" }}>
            {/* the four facts worth seeing without leaving the page */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 10,
                marginBottom: 18,
              }}
            >
              {[
                ["type", r.snapshot.type],
                ["strategy", r.snapshot.strategy],
                ["authority", r.snapshot.authorityLabel],
                ["profile", r.snapshot.profile],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: "#fff",
                    border: "2px solid var(--dark)",
                    borderRadius: 14,
                    padding: "12px 16px",
                  }}
                >
                  <div style={eyebrow}>{label}</div>
                  <div
                    style={{
                      fontFamily: pp,
                      fontWeight: 700,
                      fontSize: 15,
                      lineHeight: 1.25,
                      marginTop: 4,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* the single line that does the most work */}
            <p
              style={{
                margin: "0 0 18px",
                fontFamily: pp,
                fontWeight: 600,
                fontSize: 19,
                lineHeight: 1.4,
                maxWidth: 620,
              }}
            >
              {r.snapshot.typeLens.summary}
            </p>

            {/* what the full read covers, so the button is a known quantity */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
              {[
                "your centres",
                "gates + channels",
                `what ${sign} asks of you`,
                "business, love + money",
                "shadow work",
                "eft + somatic practice",
                "weekly check-in",
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.7)",
                    border: "1.5px solid rgba(26,26,26,0.18)",
                    borderRadius: 40,
                    padding: "5px 12px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <Link
              href="/your-season/human-design"
              className="no-underline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: pp,
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                background: "var(--dark)",
                borderRadius: 40,
                padding: "13px 24px",
              }}
            >
              open your {sign} szn design read <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const eyebrow: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--pink)",
};
