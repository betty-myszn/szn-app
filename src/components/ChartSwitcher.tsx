"use client";

import { useState } from "react";
import type { ChartData } from "@/types/chart";
import ChartResults from "@/components/ChartResults";
import HumanDesignReading from "@/components/HumanDesignReading";
import { track, EVENTS } from "@/lib/analytics";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// One set of birth details, both charts, both actually shown. This used to be a two-card chooser
// that sent people off to a separate page for each, so neither reading appeared here; now the two
// readings render inline behind a sticky toggle. The toggle (rather than one long stacked scroll) is
// deliberate: stacked, the Human Design half sat a very long way down and most people never reached
// it, so it read as though only the birth chart existed. With tabs both are present and one tap apart,
// and neither is buried.

type Tab = "astro" | "hd";

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontFamily: poppins,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "12px 22px",
        cursor: "pointer",
        border: active ? "1.5px solid var(--pink)" : "1.5px solid rgba(255,255,255,0.25)",
        background: active ? "var(--pink)" : "transparent",
        color: "#fff",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

export default function ChartSwitcher({ chart }: { chart: ChartData }) {
  const [tab, setTab] = useState<Tab>("astro");
  const name = chart.birthData?.name?.trim();

  const select = (next: Tab) => {
    setTab(next);
    track(EVENTS.CTA_CLICK, {
      label: next === "astro" ? "view_birth_chart" : "view_human_design",
      location: "results_tabs",
    });
  };

  return (
    <>
      {/* Intro + sticky toggle. Sticky so the other chart is always one tap away, never a scroll hunt. */}
      <section className="px-5 md:px-8 pt-14 pb-6" style={{ background: "var(--dark)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>
            both of your charts are ready
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5.5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.6px",
              lineHeight: 1.03,
              color: "#fff",
              marginBottom: 12,
            }}
          >
            {name ? `${name.toLowerCase()}, you get ` : "you get "}
            <span className="pk">two charts.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto" }}>
            One set of birth details, two completely different maps. Your astrology says who you are
            here to become. Your Human Design says how you are actually built to get there. Switch
            between them any time.
          </p>
        </div>
      </section>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--dark)",
          borderBottom: "var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-4 flex items-center justify-center gap-3 flex-wrap">
          <TabButton active={tab === "astro"} onClick={() => select("astro")}>
            ☉ your birth chart
          </TabButton>
          <TabButton active={tab === "hd"} onClick={() => select("hd")}>
            ◈ your human design
          </TabButton>
        </div>
      </div>

      {/* The active reading, rendered inline. Only the selected one mounts, so the page stays light. */}
      {tab === "astro" ? <ChartResults chart={chart} /> : <HumanDesignReading />}
    </>
  );
}
