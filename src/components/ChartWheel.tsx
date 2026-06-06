"use client";

import type {
  ChartData,
  PlanetPosition,
  Aspect,
} from "@/types/chart";
import {
  ZODIAC_SYMBOLS,
  ZODIAC_SIGNS,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
  ASPECT_CONFIG,
  PLANET_SYMBOLS,
} from "@/types/chart";

interface ChartWheelProps {
  chart: ChartData;
  size?: number;
}

const CX = 300;
const CY = 300;
const OUTER_R = 280;
const SIGN_R = 245;
const INNER_R = 210;
const HOUSE_R = 130;
const PLANET_R = 170;
const CENTER_R = 70;

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function chartAngle(longitude: number, ascendant: number): number {
  return (ascendant - longitude + 360) % 360;
}

function spreadPlanets(
  planets: PlanetPosition[],
  ascendant: number,
  minGap: number
): { planet: PlanetPosition; angle: number }[] {
  const items = planets.map((p) => ({
    planet: p,
    angle: chartAngle(p.longitude, ascendant),
    originalAngle: chartAngle(p.longitude, ascendant),
  }));

  items.sort((a, b) => a.angle - b.angle);

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 50) {
    changed = false;
    iterations++;
    for (let i = 0; i < items.length; i++) {
      const next = (i + 1) % items.length;
      let diff = items[next].angle - items[i].angle;
      if (diff < 0) diff += 360;
      if (diff < minGap && diff > 0) {
        const shift = (minGap - diff) / 2 + 0.5;
        items[i].angle = (items[i].angle - shift + 360) % 360;
        items[next].angle = (items[next].angle + shift) % 360;
        changed = true;
      }
    }
  }

  return items;
}

export default function ChartWheel({ chart, size = 600 }: ChartWheelProps) {
  const { ascendant } = chart;

  const signSegments = ZODIAC_SIGNS.map((sign, i) => {
    const startLng = i * 30;
    const endLng = (i + 1) * 30;
    const startAngle = chartAngle(startLng, ascendant);
    const endAngle = chartAngle(endLng, ascendant);
    const midAngle = (startAngle + endAngle) / 2;
    const adjustedMid =
      endAngle < startAngle
        ? ((startAngle + endAngle + 360) / 2) % 360
        : midAngle;

    const element = SIGN_ELEMENTS[sign];
    const color = ELEMENT_COLORS[element];

    return { sign, startAngle, endAngle, adjustedMid, color, index: i };
  });

  const houseLines = chart.houses.map((h) => {
    const angle = chartAngle(h.longitude, ascendant);
    const inner = polarToCartesian(CX, CY, HOUSE_R, angle);
    const outer = polarToCartesian(CX, CY, INNER_R, angle);
    return { house: h.house, angle, inner, outer };
  });

  const houseMidpoints = chart.houses.map((h, i) => {
    const nextI = (i + 1) % 12;
    let start = chartAngle(h.longitude, ascendant);
    let end = chartAngle(chart.houses[nextI].longitude, ascendant);
    if (end < start) end += 360;
    const mid = ((start + end) / 2) % 360;
    return { house: h.house, angle: mid };
  });

  const spreadItems = spreadPlanets(chart.planets, ascendant, 12);

  const aspectLines = chart.aspects
    .filter((a) => a.orb < 6)
    .map((aspect: Aspect) => {
      const p1 = chart.planets.find((p) => p.name === aspect.planet1);
      const p2 = chart.planets.find((p) => p.name === aspect.planet2);
      if (!p1 || !p2) return null;

      const angle1 = chartAngle(p1.longitude, ascendant);
      const angle2 = chartAngle(p2.longitude, ascendant);
      const pos1 = polarToCartesian(CX, CY, HOUSE_R - 5, angle1);
      const pos2 = polarToCartesian(CX, CY, HOUSE_R - 5, angle2);

      const config = ASPECT_CONFIG[aspect.type];
      return { ...aspect, pos1, pos2, color: config.color };
    })
    .filter(Boolean);

  return (
    <svg
      viewBox="0 0 600 600"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="chart-wheel"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0f0f1a" />
        </radialGradient>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e1e38" />
          <stop offset="100%" stopColor="#12122a" />
        </radialGradient>
      </defs>

      {/* Background — clean white with dark chart circle */}
      <rect width="600" height="600" fill="#ffffff" />
      <circle cx={CX} cy={CY} r={OUTER_R + 6} fill="url(#bgGrad)" />

      {/* Rings */}
      <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="#2a2a50" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="#2a2a50" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={HOUSE_R} fill="none" stroke="#2a2a50" strokeWidth="0.5" />
      <circle cx={CX} cy={CY} r={CENTER_R} fill="url(#centerGrad)" stroke="#2a2a50" strokeWidth="0.5" />

      {/* Sign segments */}
      {signSegments.map((seg) => {
        const mid = polarToCartesian(CX, CY, SIGN_R, seg.adjustedMid);
        const tickStart = polarToCartesian(CX, CY, OUTER_R, seg.startAngle);
        const tickEnd = polarToCartesian(CX, CY, INNER_R, seg.startAngle);
        return (
          <g key={seg.sign}>
            <line
              x1={tickStart.x}
              y1={tickStart.y}
              x2={tickEnd.x}
              y2={tickEnd.y}
              stroke="#3a3a6e"
              strokeWidth="0.5"
            />
            <text
              x={mid.x}
              y={mid.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={seg.color}
              fontSize="16"
              fontFamily="serif"
              filter="url(#glow)"
            >
              {ZODIAC_SYMBOLS[seg.index]}
            </text>
          </g>
        );
      })}

      {/* House lines */}
      {houseLines.map((hl) => {
        const isAngle = [1, 4, 7, 10].includes(hl.house);
        const outerPt = isAngle
          ? polarToCartesian(CX, CY, OUTER_R, hl.angle)
          : hl.outer;
        return (
          <line
            key={`house-${hl.house}`}
            x1={hl.inner.x}
            y1={hl.inner.y}
            x2={outerPt.x}
            y2={outerPt.y}
            stroke={isAngle ? "#FF2D87" : "#3a3a6e"}
            strokeWidth={isAngle ? "1.5" : "0.5"}
            opacity={isAngle ? 0.6 : 1}
          />
        );
      })}

      {/* House numbers */}
      {houseMidpoints.map((hm) => {
        const pos = polarToCartesian(CX, CY, (HOUSE_R + CENTER_R) / 2, hm.angle);
        return (
          <text
            key={`house-num-${hm.house}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#6a6a9e"
            fontSize="11"
            fontFamily="sans-serif"
          >
            {hm.house}
          </text>
        );
      })}

      {/* Aspect lines */}
      {aspectLines.map((aspect, i) =>
        aspect ? (
          <line
            key={`aspect-${i}`}
            x1={aspect.pos1.x}
            y1={aspect.pos1.y}
            x2={aspect.pos2.x}
            y2={aspect.pos2.y}
            stroke={aspect.color}
            strokeWidth="0.6"
            opacity="0.35"
          />
        ) : null
      )}

      {/* Planet glyphs */}
      {spreadItems.map(({ planet, angle }) => {
        const pos = polarToCartesian(CX, CY, PLANET_R, angle);
        const tickInner = polarToCartesian(CX, CY, INNER_R + 2, angle);
        const tickOuter = polarToCartesian(CX, CY, INNER_R + 8, angle);

        const element = SIGN_ELEMENTS[planet.sign] || "air";
        const color = ELEMENT_COLORS[element];
        const symbol = PLANET_SYMBOLS[planet.name] || planet.name[0];

        return (
          <g key={planet.id}>
            <line
              x1={tickInner.x}
              y1={tickInner.y}
              x2={tickOuter.x}
              y2={tickOuter.y}
              stroke={color}
              strokeWidth="0.5"
              opacity="0.5"
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={color}
              fontSize="14"
              fontFamily="serif"
              filter="url(#glow)"
            >
              {symbol}
            </text>
            {planet.retrograde && (
              <text
                x={pos.x + 10}
                y={pos.y - 6}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FF2D87"
                fontSize="7"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                Rx
              </text>
            )}
          </g>
        );
      })}

      {/* Center text */}
      <text
        x={CX}
        y={CY - 8}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#C8B4F8"
        fontSize="10"
        fontFamily="sans-serif"
        fontWeight="600"
      >
        {chart.birthData.name}
      </text>
      <text
        x={CX}
        y={CY + 8}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#6a6a9e"
        fontSize="8"
        fontFamily="sans-serif"
      >
        Placidus
      </text>
    </svg>
  );
}
