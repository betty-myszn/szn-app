"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useChart } from "@/lib/use-chart";
import { computeLines, distanceKm, PLANETS } from "@/lib/astrocartography/engine";
import { CITIES, GLYPH, TRANSIT_VERB, ANGLE_LINE } from "@/lib/astrocartography/content";
import { britishDate } from "@/lib/format-date";

// "Your lines are lighting up": the one astro map window happening for her right now, with the
// cities it switches on, so the coven home gives her a reason to open the map this month.

type Win = { transit: string; aspect: number; natal: string; start: string; end: string };
const pp = "var(--font-poppins), Poppins, sans-serif";

export default function AstroMapNudge() {
  const { chart } = useChart();
  const [view, setView] = useState<{ w: Win; today: string; cities: { name: string; line: string }[] } | null>(null);

  useEffect(() => {
    if (!chart) return;
    const planets = chart.planets.filter((p) => PLANETS.includes(p.name)).map((p) => ({ name: p.name, longitude: p.longitude, house: p.house }));
    let gone = false;
    fetch("/api/power-places", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "timing", planets }) })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { today: string; windows: Win[] }) => {
        if (gone) return;
        const live = j.windows.filter((w) => w.start <= j.today);
        const pick = live.find((w) => w.transit === "Jupiter") ?? live[0] ?? j.windows[0];
        if (!pick) return;
        const lines = computeLines(chart.julianDay, chart.planets).filter((l) => l.planet === pick.natal);
        const near = CITIES.map((c) => {
          const best = lines.map((l) => ({ l, d: distanceKm(l, c.lat, c.lon) })).sort((a, b) => a.d - b.d)[0];
          return { name: c.name, d: best.d, line: ANGLE_LINE[best.l.angle] };
        }).filter((x) => x.d < 300).sort((a, b) => a.d - b.d).slice(0, 4);
        setView({ w: pick, today: j.today, cities: near });
      })
      .catch(() => {});
    return () => { gone = true; };
  }, [chart]);

  if (!view) return null;
  const { w, today, cities } = view;
  const now = w.start <= today;
  return (
    <Link href="/your-season/places" className="no-underline" style={{ display: "block", border: "var(--border)", borderRadius: 22, padding: "20px 22px", background: "#fff", boxShadow: "5px 5px 0 var(--dark)", color: "var(--dark)" }}>
      <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>
        ⏳ {now ? "your lines lighting up right now" : "your next lines to light up"}
      </div>
      <div className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.1, marginTop: 6 }}>
        {GLYPH[w.transit]} {w.transit} is {TRANSIT_VERB[w.transit]} your {w.natal} lines {now ? `until the ${britishDate(w.end)}` : `from the ${britishDate(w.start)}`}.
      </div>
      {cities.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {cities.map((c) => (
            <span key={c.name} style={{ border: "1.5px solid var(--dark)", borderRadius: 999, padding: "5px 12px", fontSize: 14, fontWeight: 700, background: "var(--pink-light)" }}>{c.name} · {c.line}</span>
          ))}
        </div>
      )}
      <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, textDecoration: "underline", marginTop: 12 }}>see it on your astro map →</div>
    </Link>
  );
}
