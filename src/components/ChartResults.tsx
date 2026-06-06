"use client";

import { useState } from "react";
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
import { encodeBirthData } from "@/lib/url-params";

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

  return (
    <div>
      {/* Dark header */}
      <div
        className="px-8 py-12"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="tag mb-3">your birth chart</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: 12,
            }}
          >
            {chart.birthData.name}&apos;s <span className="pk">chart.</span>
          </h1>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.5)" }}>
            <p>{chart.localBirthTime} &middot; {chart.birthData.location.placeName}</p>
            <p style={{ fontSize: 11 }}>UTC: {chart.utcBirthTime}</p>
            {chart.approximate && (
              <p style={{ color: "var(--lav)", marginTop: 4 }}>
                * birth time is approximate — house cusps and rising sign may vary
              </p>
            )}
          </div>
          <div className="flex gap-3 mt-5">
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
                transition: "all 0.15s",
              }}
            >
              {copiedUrl ? "copied!" : "share link"}
            </button>
            <button
              onClick={handleCopyJson}
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
                transition: "all 0.15s",
              }}
            >
              {copiedJson ? "copied!" : "copy json"}
            </button>
            <a
              href={`/your-szn?${encodeBirthData(chart.birthData)}`}
              style={{
                background: "var(--pink)",
                color: "#fff",
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
              your szn →
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-8 py-12 space-y-12">
        {/* Chart Wheel + Planets Grid */}
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="flex justify-center">
            <ChartWheel chart={chart} size={500} />
          </div>

          {/* Planet Positions */}
          <div style={{ borderBottom: "var(--border)" }}>
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
                        {planet.degree}° {planet.minute}&apos;
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
                  {house.degree}° {house.minute}&apos;
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
                          {aspect.orb.toFixed(2)}°
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

        {/* JSON Output */}
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
      </div>
    </div>
  );
}
