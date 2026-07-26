"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChartData, PlanetPosition, Aspect } from "@/types/chart";
import {
  ZODIAC_SYMBOLS,
  ZODIAC_SIGNS,
  PLANET_SYMBOLS,
  textGlyph,
} from "@/types/chart";

interface ChartWheelProps {
  chart: ChartData;
  /** Optional max pixel width. Defaults to filling its container. */
  size?: number;
  /** Fired when a planet is chosen (second tap, or the hub CTA). */
  onSelectPlanet?: (planetId: string) => void;
  /** Controlled highlight. Pass alongside onActiveChange to sync with cards outside the wheel. */
  activeId?: string | null;
  onActiveChange?: (id: string | null) => void;
}

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Geometry. viewBox is 600x600. Editorial spacing: the outer circle sits well
// inside the frame so the zodiac glyphs float in the margin beyond it, and the
// aspect web is pulled deep into the centre so planets get their own quiet ring.
const CX = 300;
const CY = 300;
const R_SIGN = 278; // zodiac glyphs, floating OUTSIDE the outer circle
const R_OUTER = 250; // the single outer circle
const R_PLANET = 214; // planet glyphs
const R_AXIS_LABEL = 234; // AC / MC / DC / IC ticks, just inside the circle
const R_HOUSE_NUM = 170; // house numbers
const R_ASPECT = 116; // aspect web, kept small so it never crowds the planets
const R_HUB = 78; // centre hub

// Two brand colours: hot pink leads, lilac carries the line work. White is for
// the planet glyphs only.
const PINK = "#FF2D87";
const WHITE = "#FFFFFF";
const LILAC = "#C8B4F8"; // brand lilac, carries all the non-pink line work
const CANVAS = "#17141C"; // flat, no gradient

// Hard aspects read pink, everything else a hairline lilac. No colour coding
// by element: the web is structure, not decoration.
const ASPECT_TONE: Record<string, string> = {
  conjunction: LILAC,
  sextile: LILAC,
  trine: LILAC,
  square: PINK,
  opposition: PINK,
};

/**
 * Screen position for a chart angle `d`, measured in degrees counterclockwise
 * from the ascendant. d=0 sits at 9 o'clock (AC), d=90 at 6 o'clock (IC),
 * d=180 at 3 o'clock (DC), d=270 at 12 o'clock (MC), which is the standard
 * orientation every published chart uses.
 */
function pt(r: number, d: number): { x: number; y: number } {
  const rad = ((180 - d) * Math.PI) / 180;
  // Rounded because Node and the browser disagree on the last bit of Math.cos/sin,
  // which is enough to trip React's hydration check on every line in the wheel.
  return {
    x: Math.round((CX + r * Math.cos(rad)) * 100) / 100,
    y: Math.round((CY + r * Math.sin(rad)) * 100) / 100,
  };
}

function fromAsc(longitude: number, ascendant: number): number {
  return (longitude - ascendant + 360) % 360;
}

/** Annular wedge from chart angle d1 to d2 (counterclockwise on screen). */
function wedgePath(rIn: number, rOut: number, d1: number, d2: number): string {
  let sweep = d2 - d1;
  if (sweep < 0) sweep += 360;
  const large = sweep > 180 ? 1 : 0;
  const o1 = pt(rOut, d1);
  const o2 = pt(rOut, d1 + sweep);
  const i2 = pt(rIn, d1 + sweep);
  const i1 = pt(rIn, d1);
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${rOut} ${rOut} 0 ${large} 0 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${rIn} ${rIn} 0 ${large} 1 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/** Nudges glyphs apart so tight stelliums stay legible. */
function spreadPlanets(
  planets: PlanetPosition[],
  ascendant: number,
  minGap: number
): { planet: PlanetPosition; angle: number; trueAngle: number }[] {
  const items = planets.map((p) => ({
    planet: p,
    angle: fromAsc(p.longitude, ascendant),
    trueAngle: fromAsc(p.longitude, ascendant),
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

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "★";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Plain-English role for the hub label, so a beginner knows what they tapped.
const ROLE: Record<string, string> = {
  sun: "your identity",
  moon: "your emotions",
  rising: "how people meet you",
  mercury: "your voice and mind",
  venus: "your love codes",
  mars: "your drive",
  jupiter: "your luck",
  saturn: "your mastery path",
  uranus: "your rebel streak",
  neptune: "your dream world",
  pluto: "your power source",
  chiron: "your healing",
  north_node: "your destiny direction",
  south_node: "your comfort zone",
  lilith: "your untamed self",
  part_of_fortune: "your joy",
  midheaven: "your public legacy",
};

export default function ChartWheel({
  chart,
  size,
  onSelectPlanet,
  activeId,
  onActiveChange,
}: ChartWheelProps) {
  const { ascendant } = chart;
  const reduced = usePrefersReducedMotion();

  const [internalActive, setInternalActive] = useState<string | null>(null);
  const controlled = activeId !== undefined;
  const active = controlled ? activeId ?? null : internalActive;

  const setActive = (id: string | null) => {
    if (!controlled) setInternalActive(id);
    onActiveChange?.(id);
  };

  const risingSign = chart.houses[0]?.sign || "";
  const mcSign = chart.houses[9]?.sign || "";

  // Every highlightable body: the 15 calculated points plus the two angles,
  // so cards outside the wheel can drive rising and midheaven too.
  const nodes = useMemo(() => {
    const planetNodes = chart.planets.map((p) => ({
      id: p.id,
      name: p.name,
      symbol: PLANET_SYMBOLS[p.name] || p.name[0],
      sign: p.sign,
      house: p.house,
      degree: p.degree,
      minute: p.minute,
      retrograde: p.retrograde,
      longitude: p.longitude,
    }));
    return [
      ...planetNodes,
      {
        id: "rising",
        name: "Rising",
        symbol: "AC",
        sign: risingSign,
        house: 1,
        degree: chart.houses[0]?.degree ?? 0,
        minute: chart.houses[0]?.minute ?? 0,
        retrograde: false,
        longitude: chart.ascendant,
      },
      {
        id: "midheaven",
        name: "Midheaven",
        symbol: "MC",
        sign: mcSign,
        house: 10,
        degree: chart.houses[9]?.degree ?? 0,
        minute: chart.houses[9]?.minute ?? 0,
        retrograde: false,
        longitude: chart.midheaven,
      },
    ];
  }, [chart, risingSign, mcSign]);

  const activeNode = active ? nodes.find((n) => n.id === active) ?? null : null;

  const signSegments = ZODIAC_SIGNS.map((sign, i) => {
    const start = fromAsc(i * 30, ascendant);
    return { sign, start, mid: (start + 15) % 360, index: i };
  });

  const houseCusps = chart.houses.map((h, i) => {
    const start = fromAsc(h.longitude, ascendant);
    const next = chart.houses[(i + 1) % 12];
    let end = fromAsc(next.longitude, ascendant);
    if (end <= start) end += 360;
    return { house: h.house, start, end, mid: (start + (end - start) / 2) % 360 };
  });

  const activeHouse = houseCusps.find((h) => h.house === activeNode?.house) ?? null;

  const spreadItems = spreadPlanets(chart.planets, ascendant, 14);

  // Fewer lines by default so the centre stays calm: only tight orbs, and when a
  // planet is active we lift the ones that touch it and mute the rest.
  const aspectLines = chart.aspects
    .filter((a) => a.orb <= 3)
    .map((aspect: Aspect, i) => {
      const p1 = chart.planets.find((p) => p.name === aspect.planet1);
      const p2 = chart.planets.find((p) => p.name === aspect.planet2);
      if (!p1 || !p2) return null;
      return {
        key: `${aspect.planet1}-${aspect.planet2}-${i}`,
        pos1: pt(R_ASPECT, fromAsc(p1.longitude, ascendant)),
        pos2: pt(R_ASPECT, fromAsc(p2.longitude, ascendant)),
        tone: ASPECT_TONE[aspect.type] || LILAC,
        touchesActive: activeNode
          ? p1.id === activeNode.id || p2.id === activeNode.id
          : false,
      };
    })
    .filter(Boolean) as {
    key: string;
    pos1: { x: number; y: number };
    pos2: { x: number; y: number };
    tone: string;
    touchesActive: boolean;
  }[];

  // Offset a few degrees off the axis itself so the label never sits on its own line.
  const AXIS_OFFSET = 5;
  const axes = [
    { label: "AC", d: 0 + AXIS_OFFSET },
    { label: "IC", d: fromAsc(chart.midheaven + 180, ascendant) + AXIS_OFFSET },
    { label: "DC", d: 180 + AXIS_OFFSET },
    { label: "MC", d: fromAsc(chart.midheaven, ascendant) + AXIS_OFFSET },
  ];

  const handlePlanet = (id: string) => {
    if (active === id && onSelectPlanet) onSelectPlanet(id);
    else setActive(id);
  };

  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      className="chart-wheel"
      role="img"
      aria-label={`Natal chart wheel for ${chart.birthData.name}`}
      style={{ width: "100%", maxWidth: size ?? "100%", height: "auto", display: "block" }}
      onMouseLeave={() => setActive(null)}
    >
      {/* Flat canvas. No gradient, no glow. */}
      <circle cx={CX} cy={CY} r={296} fill={CANVAS} />

      {/* The active planet's house lights up with a flat, quiet pink wash */}
      {activeHouse && (
        <path
          className="cw-t"
          d={wedgePath(R_HUB, R_OUTER, activeHouse.start, activeHouse.end)}
          fill={PINK}
          fillOpacity="0.08"
        />
      )}

      {/* Outer circle: one crisp line, nothing more */}
      <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke={LILAC} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={R_ASPECT} fill="none" stroke={LILAC} strokeOpacity="0.6" strokeWidth="0.75" />

      {/* Zodiac glyphs float in the margin beyond the circle. Pink, evenly spaced. */}
      <g className="cw-t" opacity={activeNode ? 0.4 : 1}>
        {signSegments.map((seg) => {
          const g = pt(R_SIGN, seg.mid);
          return (
            <text
              key={`sign-${seg.sign}`}
              x={g.x}
              y={g.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={PINK}
              fontSize="24"
            >
              {textGlyph(ZODIAC_SYMBOLS[seg.index])}
            </text>
          );
        })}
      </g>

      {/* House cusps: lilac hairlines from hub to the circle, angles in pink */}
      <g className="cw-t" opacity={activeNode ? 0.5 : 1}>
        {houseCusps.map((h) => {
          const isAngle = [1, 4, 7, 10].includes(h.house);
          const inner = pt(R_HUB, h.start);
          const outer = pt(R_OUTER, h.start);
          return (
            <line
              key={`cusp-${h.house}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={isAngle ? PINK : LILAC}
              strokeOpacity={isAngle ? 0.9 : 0.85}
              strokeWidth={isAngle ? 1.25 : 0.75}
            />
          );
        })}
        {houseCusps.map((h) => {
          const p = pt(R_HOUSE_NUM, h.mid);
          const isActive = activeHouse?.house === h.house;
          return (
            <text
              key={`hn-${h.house}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={PINK}
              fillOpacity={isActive ? 1 : 0.85}
              fontSize="12"
              fontFamily={poppins}
              fontWeight="700"
            >
              {h.house}
            </text>
          );
        })}
      </g>

      {/* Axis markers so beginners can find the horizon */}
      <g className="cw-t" opacity={activeNode ? 0.35 : 1}>
        {axes.map((ax) => {
          const p = pt(R_AXIS_LABEL, ax.d);
          return (
            <text
              key={ax.label}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={PINK}
              fontSize="10"
              fontFamily={poppins}
              fontWeight="700"
              letterSpacing="1"
            >
              {ax.label}
            </text>
          );
        })}
      </g>

      {/* Aspect web: tight orbs only, hairline weight */}
      <g>
        {aspectLines.map((a) => (
          <line
            key={a.key}
            className="cw-t"
            x1={a.pos1.x}
            y1={a.pos1.y}
            x2={a.pos2.x}
            y2={a.pos2.y}
            stroke={a.tone}
            strokeWidth={a.touchesActive ? 1.1 : 0.6}
            strokeOpacity={activeNode ? (a.touchesActive ? 1 : 0.12) : 0.6}
          />
        ))}
      </g>

      {/* Centre hub: a single thin ring, pink when something is active */}
      <circle
        className="cw-t"
        cx={CX}
        cy={CY}
        r={R_HUB}
        fill={CANVAS}
        stroke={activeNode ? PINK : LILAC}
        strokeOpacity={activeNode ? 0.9 : 0.55}
        strokeWidth="1"
      />

      {/* Planet glyphs: all white, pink only when active. No colour coding. */}
      {spreadItems.map(({ planet, angle, trueAngle }) => {
        const pos = pt(R_PLANET, angle);
        const tickOut = pt(R_OUTER - 4, trueAngle);
        const tickIn = pt(R_OUTER - 14, trueAngle);
        const symbol = textGlyph(PLANET_SYMBOLS[planet.name] || planet.name[0]);
        const isActive = activeNode?.id === planet.id;
        const label = `${planet.name} in ${planet.sign}, ${ordinal(planet.house)} house`;

        return (
          <g
            key={planet.id}
            className="cw-t cw-planet"
            opacity={activeNode && !isActive ? 0.28 : 1}
            onMouseEnter={() => setActive(planet.id)}
            onFocus={() => setActive(planet.id)}
            onClick={() => handlePlanet(planet.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (onSelectPlanet) onSelectPlanet(planet.id);
                else setActive(planet.id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={label}
            style={{ cursor: "pointer" }}
          >
            {/* generous hit area for thumbs */}
            <circle cx={pos.x} cy={pos.y} r={20} fill="transparent" />

            {/* a hairline tick tying the planet to its true degree on the rim */}
            <line
              x1={tickIn.x}
              y1={tickIn.y}
              x2={tickOut.x}
              y2={tickOut.y}
              stroke={isActive ? PINK : LILAC}
              strokeOpacity={isActive ? 0.9 : 0.45}
              strokeWidth="0.75"
            />

            {isActive && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={17}
                fill="none"
                stroke={PINK}
                strokeWidth="1"
              />
            )}

            <text
              className="cw-glyph"
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isActive ? PINK : WHITE}
              fontSize={isActive ? 25 : 22}
            >
              {symbol}
            </text>

            {planet.retrograde && (
              <text
                x={pos.x + 15}
                y={pos.y - 12}
                textAnchor="middle"
                dominantBaseline="central"
                fill={PINK}
                fontSize="8"
                fontWeight="700"
                fontFamily={poppins}
              >
                Rx
              </text>
            )}
          </g>
        );
      })}

      {/* Hub content: the label lives here, so the centre earns its space */}
      {activeNode ? (
        <g className="cw-hub-in" key={activeNode.id}>
          <text
            x={CX}
            y={CY - 42}
            textAnchor="middle"
            dominantBaseline="central"
            fill={PINK}
            fontSize="22"
          >
            {textGlyph(activeNode.symbol)}
          </text>
          <text
            x={CX}
            y={CY - 19}
            textAnchor="middle"
            dominantBaseline="central"
            fill={PINK}
            fontSize="9"
            fontFamily={poppins}
            fontWeight="700"
            letterSpacing="1.3"
          >
            {activeNode.name.toUpperCase()}
          </text>
          <text
            x={CX}
            y={CY + 3}
            textAnchor="middle"
            dominantBaseline="central"
            fill={WHITE}
            fontSize="20"
            fontFamily={poppins}
            fontWeight="800"
            letterSpacing="-0.4"
          >
            {activeNode.sign.toLowerCase()}
          </text>
          <text
            x={CX}
            y={CY + 23}
            textAnchor="middle"
            dominantBaseline="central"
            fill={WHITE}
            fillOpacity="0.4"
            fontSize="10"
            fontFamily={poppins}
          >
            {ordinal(activeNode.house)} house
            {activeNode.retrograde ? " · Rx" : ""}
          </text>
          {onSelectPlanet && (
            <g
              onClick={() => onSelectPlanet(activeNode.id)}
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex={0}
              aria-label={`Read your ${activeNode.name} reading`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectPlanet(activeNode.id);
                }
              }}
            >
              <rect x={CX - 46} y={CY + 40} width="92" height="21" fill={PINK} />
              <text
                x={CX}
                y={CY + 50.5}
                textAnchor="middle"
                dominantBaseline="central"
                fill={WHITE}
                fontSize="9"
                fontFamily={poppins}
                fontWeight="700"
                letterSpacing="0.8"
              >
                READ IT →
              </text>
            </g>
          )}
        </g>
      ) : (
        <g className="cw-hub-in">
          <text
            x={CX}
            y={CY - 12}
            textAnchor="middle"
            dominantBaseline="central"
            fill={WHITE}
            fontSize="34"
            fontFamily={poppins}
            fontWeight="800"
            letterSpacing="1"
          >
            {initialsOf(chart.birthData.name)}
          </text>
          <text
            x={CX}
            y={CY + 16}
            textAnchor="middle"
            dominantBaseline="central"
            fill={PINK}
            fontSize="9"
            fontFamily={poppins}
            fontWeight="700"
            letterSpacing="1.6"
          >
            NATAL CHART
          </text>
          <text
            x={CX}
            y={CY + 34}
            textAnchor="middle"
            dominantBaseline="central"
            fill={WHITE}
            fillOpacity="0.35"
            fontSize="9"
            fontFamily={poppins}
          >
            tap a planet
          </text>
        </g>
      )}
    </svg>
  );
}
