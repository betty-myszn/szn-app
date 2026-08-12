"use client";

import Link from "next/link";
import type { ChartData } from "@/types/chart";
import { ZODIAC_SYMBOLS, ZODIAC_SIGNS } from "@/types/chart";
import ChartResults from "@/components/ChartResults";
import { useHumanDesign } from "@/lib/use-human-design";
import { track, EVENTS } from "@/lib/analytics";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Both free charts come from one form, so the results page has to make it obvious there are two of
// them. Stacked, the Human Design reading sat a very long scroll below the astrology and most
// people would never reach it, so it read as though only the birth chart existed.
//
// Two squares at the top instead, each a real link with a preview of what is behind it: the birth
// chart reads on this page, Human Design opens its own full reading at /human-design.

function symbolFor(sign: string): string {
  const i = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  return i >= 0 ? ZODIAC_SYMBOLS[i] : "\u2726";
}

const CARD_BASE: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  padding: 24,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.2)",
};

function CardInner({
  kicker,
  glyph,
  title,
  preview,
  action,
}: {
  kicker: string;
  glyph: string;
  title: string;
  preview: string;
  action: string;
}) {
  return (
    <>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--lav)",
          marginBottom: 10,
        }}
      >
        {kicker}
      </div>
      <div style={{ fontSize: 30, lineHeight: 1, marginBottom: 10, color: "#fff" }}>{glyph}</div>
      <div
        style={{
          fontFamily: poppins,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          color: "#fff",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>{preview}</div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--pink)",
          marginTop: 14,
        }}
      >
        {action}
      </div>
    </>
  );
}

export default function ChartSwitcher({ chart }: { chart: ChartData }) {
  const { hd } = useHumanDesign();

  const sun = chart.planets.find((p) => p.name === "Sun")?.sign ?? "";
  const moon = chart.planets.find((p) => p.name === "Moon")?.sign ?? "";
  const rising = chart.houses[0]?.sign ?? "";

  return (
    <>
      <section className="px-5 md:px-8 py-10" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-4" style={{ color: "var(--pink)" }}>
            two charts, one set of birth details
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Birth chart: the reading is on this page, so this jumps down to it. */}
            <a
              href="#your-birth-chart"
              style={CARD_BASE}
              onClick={() =>
                track(EVENTS.CTA_CLICK, { label: "view_birth_chart", location: "results_switcher" })
              }
            >
              <CardInner
                kicker="chart one"
                glyph={sun ? symbolFor(sun) : "\u2609"}
                title="your birth chart"
                preview={sun ? `${sun} sun \u00b7 ${moon} moon \u00b7 ${rising} rising` : "every placement, decoded"}
                action="read it \u2192"
              />
            </a>

            {/* Human Design: its own full reading, calculated from the same birth details. */}
            <Link
              href="/human-design"
              style={CARD_BASE}
              onClick={() =>
                track(EVENTS.CTA_CLICK, { label: "view_human_design", location: "results_switcher" })
              }
            >
              <CardInner
                kicker="chart two"
                glyph="\u25c8"
                title="your human design"
                preview={hd ? `${hd.type} \u00b7 ${hd.authorityLabel} \u00b7 ${hd.profile}` : "type, strategy and authority"}
                action="open my design \u2192"
              />
            </Link>
          </div>
        </div>
      </section>

      <div id="your-birth-chart">
        <ChartResults chart={chart} />
      </div>
    </>
  );
}
