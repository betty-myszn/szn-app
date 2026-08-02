"use client";

import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { useHumanDesign } from "@/lib/use-human-design";
import { composeLifeArea } from "@/lib/life-areas";
import { composeAreaDesign } from "@/lib/life-area-design";
import WovenAreaRead from "@/components/WovenAreaRead";

// TEMPORARY no-login preview of the woven astrology + Human Design read for one area
// (mindset), so the combined voice can be reviewed before rolling it out across the
// gated life-area pages. Delete this route once the pattern is approved.
export default function WovenMindsetPreview() {
  const { chart, loading } = useChart();
  const season = useSeason();
  const { hd } = useHumanDesign();

  const shell = (children: React.ReactNode) => (
    <main style={{ padding: "40px 24px 80px", fontFamily: "var(--font-body, system-ui), sans-serif", color: "var(--dark)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto 20px" }}>
        <div style={{ background: "var(--gold)", borderRadius: 12, padding: "10px 14px", fontSize: 12.5, lineHeight: 1.5 }}>
          Temporary preview of the combined astrology + Human Design voice, mindset only, no login. If
          this is right, it rolls out across every life area.
        </div>
      </div>
      {children}
    </main>
  );

  if (loading) return shell(<p style={{ textAlign: "center", opacity: 0.6 }}>reading your chart...</p>);
  if (!chart) return shell(<p style={{ textAlign: "center" }}>Open your chart once so your birth details cache, then come back.</p>);

  const reading = composeLifeArea("mindset", chart, season, null);
  if (!reading) return shell(<p style={{ textAlign: "center" }}>Could not read this area from your chart.</p>);
  const design = hd ? composeAreaDesign("mindset", hd, season.sign) : null;

  return shell(<WovenAreaRead reading={reading} design={design} seasonSign={season.sign} />);
}
