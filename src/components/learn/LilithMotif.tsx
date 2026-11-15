"use client";

import { useRef, useState } from "react";

// The Black Moon Lilith glyph, same drawing as the LILITH course page.
export function LilithGlyph({ size = 80, color = "#fff", strokeWidth = 1.4 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 40 60" width={size} height={size * 1.5} fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d="M25 6a14 14 0 1 0 0 26A16 16 0 0 1 25 6Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M20 32v22M12 44h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// Shared keyframes. Motion is switched off for anyone who has asked their device for reduced motion.
export function LilithMotionStyles() {
  return (
    <style>{`
      @keyframes lil-drift { from { background-position-x: 0; } to { background-position-x: -1928px; } }
      @keyframes lil-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      @keyframes lil-glow { 0%,100% { opacity: .55; } 50% { opacity: .9; } }
      .lil-moons { animation: lil-drift 90s linear infinite; }
      .lil-float { animation: lil-float 6s ease-in-out infinite; }
      .lil-glow { animation: lil-glow 5s ease-in-out infinite; }
      .lil-card-glyph { transition: transform .5s cubic-bezier(.2,.8,.2,1); transform-origin: 50% 40%; }
      .lil-card:hover .lil-card-glyph, .lil-card:focus-within .lil-card-glyph { transform: rotate(-14deg) scale(1.08); }
      @media (prefers-reduced-motion: reduce) {
        .lil-moons, .lil-float, .lil-glow { animation: none !important; }
        .lil-card-glyph, .lil-tilt { transition: none !important; }
      }
    `}</style>
  );
}

// A black band of drifting moon phases (full moon at the centre) with a glowing Lilith glyph that
// tilts towards the pointer or finger as it moves over the band.
export function LilithBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: px, y: py });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ position: "relative", height: 190, borderRadius: 18, overflow: "hidden", background: "#000", marginBottom: 14, perspective: 600, touchAction: "pan-y" }}
    >
      <div
        className="lil-moons"
        aria-hidden="true"
        style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 95, transform: "translateY(-50%)", backgroundImage: "url(/lilith/moons.png)", backgroundRepeat: "repeat-x", backgroundSize: "auto 95px", opacity: 0.55 }}
      />
      <div aria-hidden="true" className="lil-glow" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(255,45,135,.35), transparent 38%)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
        <div className="lil-float">
          <div
            className="lil-tilt"
            style={{
              transform: `rotateY(${tilt.x * 40}deg) rotateX(${-tilt.y * 30}deg) rotateZ(${tilt.x * 14}deg)`,
              transition: "transform .35s cubic-bezier(.2,.8,.2,1)",
              filter: "drop-shadow(0 0 14px rgba(255,45,135,.8)) drop-shadow(0 0 30px rgba(200,180,248,.6))",
            }}
          >
            <LilithGlyph size={62} strokeWidth={1.6} />
          </div>
        </div>
      </div>
    </div>
  );
}
