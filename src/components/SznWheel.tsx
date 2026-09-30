"use client";

import { useId } from "react";
import { AREA_FLAVOUR, wheelHouse } from "@/lib/szn-picks";

// Her chart wheel with the houses of her picks lit in pink foil. House 1 starts at the ascendant
// (nine o'clock) and runs counterclockwise, the way a real chart is drawn, so the wheel she lights
// up here is laid out like the chart she sees everywhere else.
export default function SznWheel({
  picks,
  popId = null,
  showCount = true,
  className = "",
}: {
  picks: string[];
  popId?: string | null;
  showCount?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const S = 200;
  const c = S / 2;
  const R = 96;
  const r = 40;

  // First pick to claim a house wins its glyph (style and confidence share the 1st).
  const lit = new Map<number, string>();
  for (const id of picks) {
    const h = wheelHouse(id);
    if (!lit.has(h)) lit.set(h, id);
  }

  const pt = (deg: number, rad: number) => {
    const a = (deg * Math.PI) / 180;
    return [+(c + rad * Math.cos(a)).toFixed(2), +(c - rad * Math.sin(a)).toFixed(2)];
  };

  return (
    <svg className={`szn-wheel ${className}`} viewBox={`0 0 ${S} ${S}`} role="img" aria-label={`Your chart wheel, ${lit.size} houses lit`}>
      <defs>
        <linearGradient id={`${uid}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF2D87" />
          <stop offset=".3" stopColor="#FF8CC6" />
          <stop offset=".5" stopColor="#C8B4F8" />
          <stop offset=".72" stopColor="#FF2D87" />
          <stop offset="1" stopColor="#FFB3D9" />
        </linearGradient>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD1E8" />
          <stop offset=".25" stopColor="#E8DFFE" />
          <stop offset=".45" stopColor="#FFFFFF" />
          <stop offset=".65" stopColor="#FFB3D9" />
          <stop offset=".85" stopColor="#C8B4F8" />
          <stop offset="1" stopColor="#FFF0F7" />
        </linearGradient>
      </defs>
      <circle className="ring" cx={c} cy={c} r={R + 3} />
      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const a0 = 180 + i * 30;
        const a1 = a0 + 30;
        const [x0, y0] = pt(a0, R);
        const [x1, y1] = pt(a1, R);
        const [x2, y2] = pt(a1, r);
        const [x3, y3] = pt(a0, r);
        const [tx, ty] = pt(a0 + 15, (R + r) / 2);
        const on = lit.get(h);
        return (
          <g key={h}>
            <path
              className={`${on ? "" : h % 2 ? "odd" : ""}${on && on === popId ? " pop" : ""}`}
              style={on ? { fill: `url(#${uid}l)` } : undefined}
              d={`M${x0} ${y0} A${R} ${R} 0 0 0 ${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 0 1 ${x3} ${y3} Z`}
            />
            {on ? (
              <text className="g" x={tx} y={ty}>
                {AREA_FLAVOUR[on]?.glyph}
              </text>
            ) : (
              <text x={tx} y={ty}>
                {h}
              </text>
            )}
          </g>
        );
      })}
      <circle className="core" style={{ fill: `url(#${uid}c)` }} cx={c} cy={c} r={r} />
      {showCount && (
        <>
          <text className="cn" x={c} y={c - 6}>
            {lit.size}
          </text>
          <text className="cl" x={c} y={c + 12}>
            LIT UP
          </text>
        </>
      )}
    </svg>
  );
}
