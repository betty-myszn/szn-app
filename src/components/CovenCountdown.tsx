"use client";

import { useEffect, useState } from "react";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The Baddie Coven launch window. November is GMT, so these are midnight UK time.
// Before it opens: a countdown to opening. During the three days: "open" plus a countdown to
// closing. After: nothing, so the page never shows a stale clock.
const OPENS = new Date("2026-11-05T00:00:00Z").getTime();
const CLOSES = new Date("2026-11-08T00:00:00Z").getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { n: Math.floor(s / 86400), l: "days" },
    { n: Math.floor((s % 86400) / 3600), l: "hours" },
    { n: Math.floor((s % 3600) / 60), l: "mins" },
    { n: s % 60, l: "secs" },
  ];
}

export default function CovenCountdown() {
  // Null until mounted: the server can't know the visitor's "now", so rendering the clock there
  // would mismatch on hydration.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now === null || now >= CLOSES) return null;
  const open = now >= OPENS;

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 8 }}>
        {open ? "🔓 the coven is OPEN · closes in" : "⏳ the coven opens in"}
      </div>
      <div className="flex gap-2" role="timer" aria-live="off">
        {parts((open ? CLOSES : OPENS) - now).map((p) => (
          <div
            key={p.l}
            className="szn-holo"
            style={{ flex: "1 1 0", minWidth: 0, border: "2px solid var(--dark)", borderRadius: 14, boxShadow: "3px 3px 0 var(--dark)", textAlign: "center", padding: "10px 4px 8px", color: "var(--dark)" }}
          >
            <div style={{ fontFamily: pp, fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {String(p.n).padStart(2, "0")}
            </div>
            <div style={{ fontFamily: pp, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{p.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
