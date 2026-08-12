"use client";

import Link from "next/link";
import type { ChartData } from "@/types/chart";
import { ZODIAC_SYMBOLS, ZODIAC_SIGNS } from "@/types/chart";
import { useHumanDesign } from "@/lib/use-human-design";
import { track, EVENTS } from "@/lib/analytics";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// One form, two charts, so this page is the choice between them and nothing else. The readings
// each live on their own page and are opened from here, rather than one of them being dumped
// underneath: stacked, the Human Design half sat a very long scroll down and most people never
// reached it, so the page read as though only the astrology existed.
//
// Escape sequences are written as real characters on purpose. A JSX attribute does not process
// \u escapes, so passing them through a prop printed the literal text on the page.

function symbolFor(sign: string): string {
  const i = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  return i >= 0 ? ZODIAC_SYMBOLS[i] : "✦";
}

interface CardProps {
  href: string;
  kicker: string;
  glyph: string;
  title: string;
  preview: string;
  action: string;
  bg: string;
  fg: string;
  sub: string;
  onClick: () => void;
}

function ChartCard({ href, kicker, glyph, title, preview, action, bg, fg, sub, onClick }: CardProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block no-underline"
      style={{ background: bg, border: "var(--border)", padding: "34px 30px 30px" }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: sub,
          marginBottom: 18,
        }}
      >
        {kicker}
      </div>

      <div style={{ fontSize: 54, lineHeight: 1, marginBottom: 16, color: fg }}>{glyph}</div>

      <div
        style={{
          fontFamily: poppins,
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800,
          letterSpacing: "-1.4px",
          lineHeight: 1.02,
          color: fg,
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.6, color: sub, fontWeight: 500, marginBottom: 22 }}>
        {preview}
      </div>

      <div
        style={{
          display: "inline-block",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: bg,
          background: fg,
          padding: "13px 22px",
        }}
      >
        {action}
      </div>
    </Link>
  );
}

export default function ChartSwitcher({ chart }: { chart: ChartData }) {
  const { hd } = useHumanDesign();

  const sun = chart.planets.find((p) => p.name === "Sun")?.sign ?? "";
  const moon = chart.planets.find((p) => p.name === "Moon")?.sign ?? "";
  const rising = chart.houses[0]?.sign ?? "";
  const name = chart.birthData?.name?.trim();

  return (
    <section className="px-5 md:px-8 py-16" style={{ background: "var(--dark)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="tag mb-4" style={{ color: "var(--pink)" }}>
          both of your charts are ready
        </div>

        <h1
          style={{
            fontFamily: poppins,
            fontSize: "clamp(34px, 6vw, 60px)",
            fontWeight: 800,
            letterSpacing: "-2px",
            lineHeight: 1.02,
            color: "#fff",
            marginBottom: 16,
          }}
        >
          {name ? `${name.toLowerCase()}, you get ` : "you get "}
          <span className="pk">two charts.</span>
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: 560, marginBottom: 40 }}>
          One set of birth details, two completely different maps. Your astrology says who you are
          here to become. Your Human Design says how you are actually built to get there.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          <ChartCard
            href="/results/chart"
            kicker="chart one · astrology"
            glyph={sun ? symbolFor(sun) : "☉"}
            title="your birth chart"
            preview={sun ? `${sun} sun · ${moon} moon · ${rising} rising` : "every placement, decoded"}
            action="read my chart →"
            bg="var(--pink)"
            fg="#fff"
            sub="rgba(255,255,255,0.85)"
            onClick={() => track(EVENTS.CTA_CLICK, { label: "view_birth_chart", location: "results_chooser" })}
          />

          <ChartCard
            href="/human-design"
            kicker="chart two · human design"
            glyph="◈"
            title="your human design"
            preview={hd ? `${hd.type} · ${hd.authorityLabel} · ${hd.profile}` : "type, strategy and authority"}
            action="read my design →"
            bg="var(--lav)"
            fg="var(--dark)"
            sub="#3C2A70"
            onClick={() => track(EVENTS.CTA_CLICK, { label: "view_human_design", location: "results_chooser" })}
          />
        </div>
      </div>
    </section>
  );
}
