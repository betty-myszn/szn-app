"use client";

import { useEffect, useState } from "react";
import { CHANNEL_PAIRS, CHANNEL_NAME, GATE_NAME, channelKey } from "@/lib/human-design-constants";
import { CHANNEL_GIFT } from "@/lib/human-design-content";
import { GATE_CONTENT } from "@/lib/human-design-gate-content";
import HdTerm from "@/components/HdTerm";
import type { HDActivation, HumanDesignData } from "@/types/human-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Today's sky laid over her chart: the Sun's gate (everyone's theme this week), any channel the
// transits complete for her (a hanging gate of hers + today's partner gate = a channel she gets to
// borrow), and the gates of hers the sky is doubling up on. Fetched from /api/human-design/today,
// which is the same for every member and cached at the edge.

interface Hit {
  key: string;
  label: string;
  text: React.ReactNode;
  tone: "pink" | "lav" | "dark";
}

// Only the fast movers, fastest first: they're what makes today different from yesterday. The outer
// planets sit in one gate for months, so they'd read as "today" for a year.
const SPEED = ["Moon", "Mercury", "Venus", "Sun", "Earth", "Mars"];
const bare = (g: number) => GATE_NAME[g].replace(/^The /, "");

function buildHits(hd: HumanDesignData, sky: HDActivation[]): Hit[] {
  const hers = new Set(hd.activatedGates);
  const definedKeys = new Set(hd.definedChannels.map((c) => c.key));
  const bySpeed = sky.filter((a) => SPEED.includes(a.body)).sort((a, b) => SPEED.indexOf(a.body) - SPEED.indexOf(b.body));
  const hits: Hit[] = [];

  const sun = sky.find((a) => a.body === "Sun");
  if (sun) {
    const gc = GATE_CONTENT[sun.gate];
    hits.push({
      key: "sun",
      label: `this week · Sun in gate ${sun.gate}`,
      text: (
        <>
          <strong>{GATE_NAME[sun.gate]}.</strong> Everyone is swimming in {gc.keynote.charAt(0).toLowerCase() + gc.keynote.slice(1)}. The
          shadow to catch is {gc.shadow.toLowerCase()}, the gift to reach for is {gc.gift.toLowerCase()}.
        </>
      ),
      tone: "lav",
    });
  }

  // channels the sky completes for her
  const seen = new Set<string>();
  for (const t of bySpeed) {
    for (const [a, b] of CHANNEL_PAIRS) {
      const k = channelKey(a, b);
      if (definedKeys.has(k) || seen.has(k)) continue;
      const partner = t.gate === a ? b : t.gate === b ? a : null;
      if (partner === null || !hers.has(partner) || hers.has(t.gate)) continue;
      seen.add(k);
      hits.push({
        key: `ch${k}`,
        label: `${t.body} completes ${a}–${b}`,
        text: (
          <>
            <strong>You get the {CHANNEL_NAME[k]} channel today.</strong> Your{" "}
            <HdTerm k="hanging">hanging gate</HdTerm> {partner} is plugged in by {t.body} in gate {t.gate}, so borrow it while it
            lasts: {CHANNEL_GIFT[k].charAt(0).toLowerCase() + CHANNEL_GIFT[k].slice(1)}
          </>
        ),
        tone: "pink",
      });
    }
    if (seen.size >= 2) break;
  }

  // her own gates the sky is doubling up on (skip the Sun, already covered)
  const doubled = bySpeed.filter((t) => t.body !== "Sun" && t.body !== "Earth" && hers.has(t.gate)).slice(0, 2);
  for (const t of doubled) {
    const gc = GATE_CONTENT[t.gate];
    hits.push({
      key: `g${t.body}`,
      label: `${t.body} on your gate ${t.gate}`,
      text: (
        <>
          <strong>Your {bare(t.gate)} gate is turned up.</strong> Lean into {gc.gift.toLowerCase()}, and notice if{" "}
          {gc.shadow.toLowerCase()} creeps in.
        </>
      ),
      tone: "dark",
    });
  }
  return hits;
}

export default function HdToday({ hd }: { hd: HumanDesignData }) {
  const [sky, setSky] = useState<HDActivation[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let off = false;
    fetch("/api/human-design/today")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !off && setSky(d.activations))
      .catch(() => !off && setFailed(true));
    return () => {
      off = true;
    };
  }, []);

  if (failed) return null;

  const hits = sky ? buildHits(hd, sky) : [];
  const toneStyle = {
    pink: { background: "var(--pink-light)", color: "var(--dark)" },
    lav: { background: "var(--lav-light)", color: "var(--dark)" },
    dark: { background: "var(--dark)", color: "#fff" },
  };
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section className="holo-edge" style={{ background: "#fff", borderRadius: 22, padding: "20px 18px", margin: "8px 0 28px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <h2 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 700, margin: 0 }}>today in your design</h2>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>{today}</span>
      </div>
      {!sky ? (
        <p style={{ margin: 0, fontSize: 14 }}>reading today&apos;s sky...</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {hits.map((h) => (
            <div key={h.key} style={{ ...toneStyle[h.tone], borderRadius: 16, padding: "14px 16px", fontSize: 14.5, lineHeight: 1.55 }}>
              <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 4, color: h.tone === "dark" ? "var(--pink)" : "var(--dark)" }}>
                {h.label}
              </div>
              {h.text}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
