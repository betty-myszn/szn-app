"use client";

import { useState } from "react";

// The signature MY SZN animated mark: a glossy pink disco-ball planet with Saturn-style rings.
// Pure SVG + CSS (no Lottie runtime needed), so it's lightweight and themeable everywhere the
// brand needs it, logo, loading states, celebrations, onboarding.

// Deterministic facet grid covering the sphere generously so rotation never reveals a gap,
// generated once rather than randomised per render.
const FACET_GRID: [number, number][] = (() => {
  const facets: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const x = 34 + col * 15 + (row % 2 === 0 ? 0 : 7);
      const y = 34 + row * 14;
      facets.push([x, y]);
    }
  }
  return facets;
})();

// Staggered sparkle positions + delays so sparkles twinkle a couple at a time, "every few
// seconds", rather than all firing in unison.
const SPARKLES = [
  { x: 30, y: 40, size: 11, delay: 0 },
  { x: 168, y: 55, size: 9, delay: 0.9 },
  { x: 150, y: 150, size: 10, delay: 1.8 },
  { x: 44, y: 158, size: 8, delay: 2.6 },
  { x: 100, y: 24, size: 9, delay: 1.3 },
  { x: 178, y: 110, size: 7, delay: 3.4 },
];

export interface DiscoPlanetProps {
  size?: number;
  interactive?: boolean;
  className?: string;
}

export default function DiscoPlanet({ size = 120, interactive = true, className }: DiscoPlanetProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`myszn-disco-planet${hovered ? " is-hovered" : ""}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size, display: "inline-block", lineHeight: 0 }}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="myszn-planet-body" cx="35%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#ffe9f5" />
            <stop offset="30%" stopColor="#ff9ed3" />
            <stop offset="65%" stopColor="#ff2d87" />
            <stop offset="100%" stopColor="#b3125f" />
          </radialGradient>
          <linearGradient id="myszn-ring-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f5c451" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#fff6da" stopOpacity="1" />
            <stop offset="100%" stopColor="#f5c451" stopOpacity="0.75" />
          </linearGradient>
          <clipPath id="myszn-planet-clip">
            <circle cx="100" cy="100" r="58" />
          </clipPath>
        </defs>

        {/* ring, back half */}
        <ellipse cx="100" cy="100" rx="98" ry="24" fill="none" stroke="url(#myszn-ring-gold)" strokeWidth="6" opacity="0.5" />

        {/* sphere body */}
        <circle cx="100" cy="100" r="58" fill="url(#myszn-planet-body)" />

        {/* rotating disco facets, clipped to the sphere so it reads as a mirrored surface catching light */}
        <g clipPath="url(#myszn-planet-clip)">
          <g className="myszn-disco-facets">
            {FACET_GRID.map(([fx, fy], i) => (
              <rect
                key={i}
                x={fx}
                y={fy}
                width="8"
                height="8"
                rx="1"
                fill="#ffffff"
                opacity={0.1 + (i % 5) * 0.055}
                transform={`rotate(${(i * 23) % 360} ${fx + 4} ${fy + 4})`}
              />
            ))}
          </g>
        </g>

        {/* soft static highlight for premium 3D shading */}
        <ellipse cx="76" cy="70" rx="24" ry="15" fill="#ffffff" opacity="0.32" />
        <ellipse cx="100" cy="100" r={58} fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* ring, front half, drawn after the sphere so it appears to pass in front */}
        <ellipse
          cx="100"
          cy="100"
          rx="98"
          ry="24"
          fill="none"
          stroke="url(#myszn-ring-gold)"
          strokeWidth="6"
          strokeDasharray="195 200"
          strokeDashoffset="-98"
        />

        {/* sparkles */}
        {SPARKLES.map((s, i) => (
          <text
            key={i}
            x={s.x}
            y={s.y}
            fontSize={s.size}
            fill="#ffffff"
            className="myszn-sparkle"
            style={{ animationDelay: `${s.delay}s` }}
          >
            ✦
          </text>
        ))}
      </svg>
    </div>
  );
}
