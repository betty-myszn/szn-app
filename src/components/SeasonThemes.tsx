"use client";

import Link from "next/link";
import type { SeasonInfo } from "@/lib/seasons";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// This szn's four themes, each linking to her personalised read of it.
//
// Split out of SeasonExplore.tsx, which renders at the very bottom of the dashboard under
// "explore further". This strip is the season's headline summary, the shortest answer to "what is
// this szn about for me", so it belongs near the top with the other orientation blocks rather than
// below the action rows and the what's-happening hub, where most people never scrolled to it.
// The rest of SeasonExplore (community, wrapped, next-szn teaser) is genuinely go-deeper content
// and stays where it is.
export default function SeasonThemes({ season }: { season: SeasonInfo }) {
  return (
    <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="tag mb-5">this szn&apos;s themes · tap any one for your personalised read</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
          {season.themes.map((theme, i) => (
            <Link
              key={theme}
              href={`/your-season/${theme.replace(/\s+/g, "-")}`}
              className="no-underline p-6 text-center transition-opacity hover:opacity-90"
              style={{
                borderRight: i < season.themes.length - 1 ? "var(--border)" : undefined,
                background: i === 0 ? "var(--pink)" : i === 1 ? "var(--lav-light)" : "#fff",
                color: i === 0 ? "#fff" : "var(--dark)",
              }}
            >
              <div
                style={{
                  fontFamily: poppins,
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: "-0.3px",
                  color: i === 0 ? "#fff" : "var(--dark)",
                  marginBottom: 6,
                }}
              >
                {theme}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: i === 0 ? "rgba(255,255,255,0.75)" : "var(--dark)",
                }}
              >
                read yours →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
