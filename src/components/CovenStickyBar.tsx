"use client";

import { useEffect, useState } from "react";
import CovenJoinCta from "@/components/CovenJoinCta";
import { COVEN_CLOSES, COVEN_OPENS } from "@/lib/coven-launch";

const pp = "var(--font-poppins), Poppins, sans-serif";

function left(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60_000));
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  return d > 0 ? `${d}d ${h}h ${m % 60}m` : `${h}h ${m % 60}m`;
}

// Phone-only join bar for the launch: appears once she has scrolled past the hero, and disappears
// when the founding window closes.
export default function CovenStickyBar() {
  const [now, setNow] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const onScroll = () => setScrolled(window.scrollY > 700);
    tick();
    onScroll();
    const t = setInterval(tick, 30_000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (now === null || now >= COVEN_CLOSES || !scrolled) return null;
  const open = now >= COVEN_OPENS;

  return (
    <div
      className="md:hidden flex items-center justify-between gap-3"
      style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 65, background: "var(--dark)", borderTop: "3px solid var(--pink)", padding: "10px 14px calc(10px + env(safe-area-inset-bottom))" }}
    >
      <div style={{ fontFamily: pp, color: "#fff", lineHeight: 1.15 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>{open ? "closes in" : "opens in"}</div>
        <div style={{ fontSize: 17, fontWeight: 800, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{left((open ? COVEN_CLOSES : COVEN_OPENS) - now)}</div>
      </div>
      <CovenJoinCta style={{ background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", padding: "13px 14px", whiteSpace: "nowrap" }} />
    </div>
  );
}
