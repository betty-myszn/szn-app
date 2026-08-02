"use client";

import { useSeasonDesign } from "@/lib/use-season-design";
import SeasonDesignReadingView from "@/components/SeasonDesignReading";

// The season x Human Design reading, rendered inline inside the season scroll on the
// dashboard (not a separate page). Silently renders nothing until the reading is
// ready, or if the current season has no Human Design definition yet, so it never
// breaks the dashboard for a member without birth data.
export default function SeasonDesignInline() {
  const { reading, loading, unavailable } = useSeasonDesign();

  if (loading || unavailable || !reading) return null;

  return (
    <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="tag mb-2">astrology + human design</div>
        <h2
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.08,
            margin: "0 0 20px",
          }}
        >
          how your energy works with {reading.season.sign.toLowerCase()} season
        </h2>
        <SeasonDesignReadingView r={reading} embedded />
      </div>
    </section>
  );
}
