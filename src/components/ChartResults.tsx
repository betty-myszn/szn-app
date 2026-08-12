"use client";

import { useState } from "react";
import { track, EVENTS } from "@/lib/analytics";
import type { ChartData } from "@/types/chart";
import {
  ZODIAC_SYMBOLS,
  ZODIAC_SIGNS,
  PLANET_SYMBOLS,
  ASPECT_CONFIG,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
} from "@/types/chart";
import ChartWheel from "./ChartWheel";

import {
  SUN_READINGS,
  MOON_READINGS,
  RISING_READINGS,
  VENUS_READINGS,
  MARS_READINGS,
  CHIRON_READINGS,
  SATURN_READINGS,
  NORTH_NODE_READINGS,
  JUPITER_READINGS,
  MIDHEAVEN_READINGS,
  MERCURY_READINGS,
  HOUSE_READINGS,
} from "@/lib/chart-readings";

interface ChartResultsProps {
  chart: ChartData;
}

function SignBadge({ sign }: { sign: string }) {
  const element = SIGN_ELEMENTS[sign] || "air";
  const color = ELEMENT_COLORS[element];
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  const symbol = idx >= 0 ? ZODIAC_SYMBOLS[idx] : "";

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {symbol} {sign}
    </span>
  );
}

const poppins = "var(--font-poppins), Poppins, sans-serif";

const sectionHeading = {
  fontFamily: poppins,
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: "-0.3px",
  color: "var(--dark)",
  marginBottom: 20,
};

const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--grey-light)",
};

function getSign(chart: ChartData, planetName: string): string {
  const p = chart.planets.find((pl) => pl.name === planetName);
  return p?.sign || "Aries";
}

function getHouse(chart: ChartData, planetName: string): number {
  const p = chart.planets.find((pl) => pl.name === planetName);
  return p?.house || 1;
}

function getRisingSign(chart: ChartData): string {
  return chart.houses[0]?.sign || "Aries";
}

function getMidheavenSign(chart: ChartData): string {
  const mc = chart.houses.find((h) => h.house === 10);
  return mc?.sign || "Aries";
}

function getSymbol(sign: string): string {
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  return idx >= 0 ? ZODIAC_SYMBOLS[idx] : "";
}

interface ReadingSectionProps {
  tag: string;
  title: string;
  subtitle: string;
  bg: string;
  items: { label: string; sign: string; reading: string; house?: number }[];
}

function ReadingSection({ tag, title, subtitle, bg, items }: ReadingSectionProps) {
  return (
    <div style={{ borderBottom: "var(--border)", paddingBottom: 48 }}>
      <div className="tag mb-3">{tag}</div>
      <h2
        style={{
          fontFamily: poppins,
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          lineHeight: 1.1,
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 32, maxWidth: 600 }}>
        {subtitle}
      </p>
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="p-6 md:p-8"
            style={{ background: bg, border: "var(--border)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontSize: 22 }}>{getSymbol(item.sign)}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>
                  {item.label}{item.house ? ` · house ${item.house}` : ""}
                </div>
                <div style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px" }}>
                  {item.sign}
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)", margin: 0 }}>
              {item.reading}{item.house && HOUSE_READINGS[item.house] ? ` ${HOUSE_READINGS[item.house]}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartResults({ chart }: ChartResultsProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(chart, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const sunSign = getSign(chart, "Sun");
  const moonSign = getSign(chart, "Moon");
  const risingSign = getRisingSign(chart);
  const venusSign = getSign(chart, "Venus");
  const marsSign = getSign(chart, "Mars");
  const chironSign = getSign(chart, "Chiron");
  const saturnSign = getSign(chart, "Saturn");
  const northNodeSign = getSign(chart, "North Node");
  const jupiterSign = getSign(chart, "Jupiter");
  const midheavenSign = getMidheavenSign(chart);
  const mercurySign = getSign(chart, "Mercury");

  const firstName = chart.birthData.name.split(" ")[0];

  return (
    <div>
      {/* Dark header */}
      <div
        className="px-8 py-12 md:py-16"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="tag mb-3">your birth chart</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 6vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: 12,
            }}
          >
            hey, {firstName}. <span className="pk">this is you.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>
            Your complete birth chart, decoded. Every placement. Every sign. Every piece of the cosmic puzzle that makes you, you.
          </p>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.35)", marginTop: 16 }}>
            <p>{chart.localBirthTime} &middot; {chart.birthData.location.placeName}</p>
            {chart.approximate && (
              <p style={{ color: "var(--lav)", marginTop: 4 }}>
                * birth time is approximate
              </p>
            )}
          </div>

          {/* Big 3 badges */}
          <div className="flex gap-3 flex-wrap justify-center mt-8">
            {[
              { label: "sun", sign: sunSign },
              { label: "moon", sign: moonSign },
              { label: "rising", sign: risingSign },
            ].map(({ label, sign }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-5 py-3"
                style={{ border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>
                  {label}
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  {sign} {getSymbol(sign)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={handleCopyUrl}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 18px",
                border: "1.5px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
              }}
            >
              {copiedUrl ? "copied!" : "share link"}
            </button>
            <a
              onClick={() => track(EVENTS.CTA_CLICK, { label: "join_the_membership", location: "results_hero" })}
              href="/membership"
              style={{
                background: "var(--pink)",
                color: "var(--dark)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 18px",
                border: "none",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              join the membership &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Personalised Breakdown */}
      <div className="mx-auto max-w-3xl px-8 py-12 space-y-12">

        {/* THE BIG 3 */}
        <ReadingSection
          tag="the big 3"
          title="who you really are."
          subtitle="Your Sun, Moon, and Rising are the three most important placements in your chart. Together they paint the picture of your identity, your inner world, and how the world sees you."
          bg="var(--pink-light)"
          items={[
            { label: "sun sign", sign: sunSign, reading: SUN_READINGS[sunSign] || "", house: getHouse(chart, "Sun") },
            { label: "moon sign", sign: moonSign, reading: MOON_READINGS[moonSign] || "", house: getHouse(chart, "Moon") },
            { label: "rising sign", sign: risingSign, reading: RISING_READINGS[risingSign] || "" },
          ]}
        />

        {/* LOVE & MAGNETISM */}
        <ReadingSection
          tag="love & magnetism"
          title="how you love and what turns you on."
          subtitle="Venus shows how you attract, what you find beautiful, and your love language. Mars shows how you go after what you want and what lights your fire."
          bg="var(--lav-light)"
          items={[
            { label: "venus", sign: venusSign, reading: VENUS_READINGS[venusSign] || "", house: getHouse(chart, "Venus") },
            { label: "mars", sign: marsSign, reading: MARS_READINGS[marsSign] || "", house: getHouse(chart, "Mars") },
          ]}
        />

        {/* YOUR SHADOW */}
        <ReadingSection
          tag="your shadow"
          title="the hard stuff that makes you powerful."
          subtitle="These placements show your deepest wounds, your biggest life lessons, and the transformation you're here to make. This is where the real growth happens."
          bg="#f5f5f5"
          items={[
            { label: "chiron", sign: chironSign, reading: CHIRON_READINGS[chironSign] || "", house: getHouse(chart, "Chiron") },
            { label: "saturn", sign: saturnSign, reading: SATURN_READINGS[saturnSign] || "", house: getHouse(chart, "Saturn") },
          ]}
        />

        {/* PURPOSE & GROWTH */}
        <ReadingSection
          tag="purpose & growth"
          title="why you're here and where you're going."
          subtitle="Your North Node is your soul's purpose. Your Midheaven is your career destiny. Jupiter is where luck and abundance flow to you most easily."
          bg="var(--mint)"
          items={[
            { label: "north node", sign: northNodeSign, reading: NORTH_NODE_READINGS[northNodeSign] || "", house: getHouse(chart, "North Node") },
            { label: "midheaven", sign: midheavenSign, reading: MIDHEAVEN_READINGS[midheavenSign] || "" },
            { label: "jupiter", sign: jupiterSign, reading: JUPITER_READINGS[jupiterSign] || "", house: getHouse(chart, "Jupiter") },
          ]}
        />

        {/* SUPERPOWERS */}
        <ReadingSection
          tag="your superpowers"
          title="the gifts you were born with."
          subtitle="Mercury is how your mind works. This placement reveals your unique intellectual and creative gifts."
          bg="var(--cream)"
          items={[
            { label: "mercury", sign: mercurySign, reading: MERCURY_READINGS[mercurySign] || "", house: getHouse(chart, "Mercury") },
          ]}
        />
      </div>

      {/* CTA */}
      <div
        className="px-8 py-16"
        style={{ background: "var(--dark)", borderTop: "var(--border)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="tag mb-4">keep going</div>
          <h2
            style={{
              fontFamily: poppins,
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            this is just the <span className="pk">beginning.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            Your chart is a blueprint. Now learn how to use it. Join the MY SZN membership for live workshops, coaching, and a community of women who actually get it.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              onClick={() => track(EVENTS.CTA_CLICK, { label: "join_the_membership", location: "results_footer" })}
              href="/membership"
              style={{
                background: "var(--pink)",
                color: "var(--dark)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "14px 28px",
                textDecoration: "none",
              }}
            >
              join the membership &rarr;
            </a>
            <a
              href="/waitlist"
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "14px 28px",
                border: "1.5px solid rgba(255,255,255,0.25)",
                textDecoration: "none",
              }}
            >
              join the waitlist
            </a>
          </div>
        </div>
      </div>

      {/* Technical Data (collapsible) */}
      <div className="mx-auto max-w-6xl px-8 py-12 space-y-12">
        <details>
          <summary
            className="cursor-pointer"
            style={{
              fontFamily: poppins,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "-0.3px",
              color: "var(--dark)",
              padding: "12px 0",
            }}
          >
            full chart data &amp; technical breakdown
          </summary>

          <div className="mt-8 space-y-12">
            {/* Chart Wheel */}
            <div className="flex justify-center">
              <ChartWheel chart={chart} size={500} />
            </div>

            {/* Planet Positions */}
            <div style={{ borderBottom: "var(--border)", paddingBottom: 48 }}>
              <h2 style={sectionHeading}>planet positions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--pink)" }}>
                      <th className="pb-3 pr-3 text-left" style={labelStyle}>Planet</th>
                      <th className="pb-3 pr-3 text-left" style={labelStyle}>Sign</th>
                      <th className="pb-3 pr-3 text-left" style={labelStyle}>Degree</th>
                      <th className="pb-3 pr-3 text-left" style={labelStyle}>House</th>
                      <th className="pb-3 text-left" style={labelStyle}>Rx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.planets.map((planet) => (
                      <tr
                        key={planet.id}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td className="py-3 pr-3" style={{ color: "var(--dark)", fontWeight: 500 }}>
                          <span className="mr-1.5" style={{ opacity: 0.6 }}>
                            {PLANET_SYMBOLS[planet.name] || ""}
                          </span>
                          {planet.name}
                        </td>
                        <td className="py-3 pr-3">
                          <SignBadge sign={planet.sign} />
                        </td>
                        <td className="py-3 pr-3 font-mono text-xs" style={{ color: "var(--grey)" }}>
                          {planet.degree}&deg; {planet.minute}&apos;
                        </td>
                        <td className="py-3 pr-3" style={{ color: "var(--grey)" }}>
                          {planet.house}
                        </td>
                        <td className="py-3" style={{ color: "var(--pink)", fontWeight: 700, fontSize: 11 }}>
                          {planet.retrograde ? "Rx" : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Houses */}
            <div style={{ borderBottom: "var(--border)", paddingBottom: 48 }}>
              <h2 style={sectionHeading}>house cusps <span style={{ fontWeight: 400, color: "var(--grey-light)" }}>(placidus)</span></h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {chart.houses.map((house) => (
                  <div
                    key={house.house}
                    className="p-4 text-center"
                    style={{ border: "var(--border)", background: "#fafafa" }}
                  >
                    <div style={{ ...labelStyle, marginBottom: 8 }}>House {house.house}</div>
                    <div>
                      <SignBadge sign={house.sign} />
                    </div>
                    <div className="mt-2 font-mono text-xs" style={{ color: "var(--grey)" }}>
                      {house.degree}&deg; {house.minute}&apos;
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aspects */}
            <div style={{ borderBottom: "var(--border)", paddingBottom: 48 }}>
              <h2 style={sectionHeading}>major aspects</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--pink)" }}>
                      <th className="pb-3 pr-3 text-left" style={labelStyle}>Planet 1</th>
                      <th className="pb-3 pr-3 text-left" style={labelStyle}>Aspect</th>
                      <th className="pb-3 pr-3 text-left" style={labelStyle}>Planet 2</th>
                      <th className="pb-3 pr-3 text-left" style={labelStyle}>Orb</th>
                      <th className="pb-3 text-left" style={labelStyle}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.aspects
                      .sort((a, b) => a.orb - b.orb)
                      .map((aspect, i) => {
                        const config = ASPECT_CONFIG[aspect.type];
                        return (
                          <tr
                            key={i}
                            style={{ borderBottom: "1px solid #eee" }}
                          >
                            <td className="py-3 pr-3" style={{ color: "var(--dark)", fontWeight: 500 }}>
                              <span style={{ opacity: 0.5 }}>{PLANET_SYMBOLS[aspect.planet1] || ""}</span>{" "}
                              {aspect.planet1}
                            </td>
                            <td className="py-3 pr-3 font-semibold" style={{ color: config.color }}>
                              {config.symbol}{" "}
                              {aspect.type.charAt(0).toUpperCase() + aspect.type.slice(1)}
                            </td>
                            <td className="py-3 pr-3" style={{ color: "var(--dark)", fontWeight: 500 }}>
                              <span style={{ opacity: 0.5 }}>{PLANET_SYMBOLS[aspect.planet2] || ""}</span>{" "}
                              {aspect.planet2}
                            </td>
                            <td className="py-3 pr-3 font-mono text-xs" style={{ color: "var(--grey)" }}>
                              {aspect.orb.toFixed(2)}&deg;
                            </td>
                            <td className="py-3 text-xs" style={{ color: "var(--grey-light)" }}>
                              {aspect.applying ? "Applying" : "Separating"}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rulerships */}
            <div style={{ borderBottom: "var(--border)", paddingBottom: 48 }}>
              <h2 style={sectionHeading}>planetary rulerships</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {chart.rulerships.map((r) => (
                  <div
                    key={r.sign}
                    className="p-4 text-center"
                    style={{ border: "var(--border)", background: "#fafafa" }}
                  >
                    <div>
                      <SignBadge sign={r.sign} />
                    </div>
                    <div className="mt-3" style={{ fontSize: 13, color: "var(--dark)" }}>
                      <div>
                        <span style={{ opacity: 0.5 }}>{PLANET_SYMBOLS[r.modernRuler] || ""}</span> {r.modernRuler}
                      </div>
                      {r.traditionalRuler !== r.modernRuler && (
                        <div style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 2 }}>
                          trad: {r.traditionalRuler}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* JSON */}
            <details>
              <summary
                className="cursor-pointer"
                style={{
                  ...labelStyle,
                  fontSize: 11,
                  color: "var(--grey-light)",
                  padding: "12px 0",
                }}
              >
                raw chart data (json)
              </summary>
              <pre
                className="mt-3 overflow-auto p-5 text-xs"
                style={{
                  maxHeight: 384,
                  background: "var(--dark)",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "monospace",
                  border: "var(--border)",
                }}
              >
                {JSON.stringify(chart, null, 2)}
              </pre>
            </details>

            <button
              onClick={handleCopyJson}
              style={{
                background: "transparent",
                color: "var(--grey-light)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 18px",
                border: "var(--border)",
                cursor: "pointer",
              }}
            >
              {copiedJson ? "copied!" : "copy json"}
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}
