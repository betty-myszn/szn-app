"use client";

import Link from "next/link";
import { SEASONS, formatSeasonDates, type SeasonInfo } from "@/lib/seasons";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The "go deeper" half of the merged my-szn/this-szn page: full theme list, and the
// season-level community/wrapped/next-szn teasers. The life-areas guide used to live here too,
// moved to LifeAreasGuide.tsx and pinned near the top of the page instead, that's the section
// people actually come here for. Split out from dashboard/page.tsx purely to keep that file
// from becoming unreadable, not because this is reused elsewhere.
export default function SeasonExplore({ season }: { season: SeasonInfo }) {
  const next = SEASONS[(SEASONS.findIndex((s) => s.sign === season.sign) + 1) % 12];

  return (
    <>
      {/* The themes strip used to open this component. It moved to SeasonThemes.tsx and now
          renders near the top of the dashboard: it's the season's headline summary, so it was
          being buried under everything else down here. */}

      {/* Season community */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <div>
            <div className="tag mb-2">not just your read</div>
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
              the {season.sign.toLowerCase()} szn community.
            </h2>
            <p style={{ fontSize: 13, color: "#3C2A70", marginTop: 6, maxWidth: 460 }}>
              The {season.sign.toLowerCase()} room, this szn&apos;s polls, and how far everyone else is getting with their challenges.
            </p>
          </div>
          <Link href="/your-season/community" className="btn-pink" style={{ whiteSpace: "nowrap" }}>
            see the community
          </Link>
        </div>
      </section>

      {/* Season wrapped */}
      <section className="px-5 md:px-8 py-10" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="tag mb-2" style={{ color: "var(--pink)" }}>see the receipts</div>
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
              your {season.sign.toLowerCase()} szn, wrapped.
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6, maxWidth: 460 }}>
              Every entry, win and mission this szn, tallied up in one place.
            </p>
          </div>
          <Link href="/your-season/wrapped" className="btn-pink" style={{ whiteSpace: "nowrap" }}>
            see my wrapped
          </Link>
        </div>
      </section>

      {/* Next season teaser */}
      <section className="px-5 md:px-8 py-10" style={{ background: "var(--lav-light)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="tag mb-2">up next</div>
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
              {next.symbol} {next.sign.toLowerCase()} szn · {formatSeasonDates(next)}
            </h2>
            <p style={{ fontSize: 13, color: "#3C2A70", marginTop: 6 }}>{next.tagline}</p>
          </div>
          <Link href="/my-chart" className="btn-pink" style={{ whiteSpace: "nowrap" }}>
            explore my chart
          </Link>
        </div>
      </section>
    </>
  );
}
