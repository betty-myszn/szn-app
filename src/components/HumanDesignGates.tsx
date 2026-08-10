"use client";

import { useState } from "react";
import {
  GATE_NAME,
  GATE_CENTER,
  CENTER_LABELS,
} from "@/lib/human-design-constants";
import { GATE_CONTENT } from "@/lib/human-design-gate-content";
import { GATE_DESCRIPTION } from "@/lib/human-design-gate-descriptions";
import type { HumanDesignData, HDActivation } from "@/types/human-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Every gate the member actually carries, explained in full: what the gate is, where
// it sits, which planets light it up in Personality and Design, and its shadow and
// gift. Self-contained so the chart page only needs to drop in <HumanDesignGates />.
export default function HumanDesignGates({ hd }: { hd: HumanDesignData }) {
  // gate -> the personality and design activations that light it up
  const byGate = new Map<number, { personality: HDActivation[]; design: HDActivation[] }>();
  for (const a of hd.personality) {
    if (!byGate.has(a.gate)) byGate.set(a.gate, { personality: [], design: [] });
    byGate.get(a.gate)!.personality.push(a);
  }
  for (const a of hd.design) {
    if (!byGate.has(a.gate)) byGate.set(a.gate, { personality: [], design: [] });
    byGate.get(a.gate)!.design.push(a);
  }
  const gates = Array.from(byGate.keys()).sort((x, y) => x - y);

  return (
    <div>
      <SectionHead title={`your gates (${gates.length})`} />
      <p style={{ fontSize: 14, opacity: 0.6, margin: "0 0 16px", lineHeight: 1.55 }}>
        Gates are the specific bits of circuitry switched on in your chart, the raw material behind
        your channels and centres. Each one carries a shadow and a gift. Tap any to open it.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {gates.map((g) => (
          <GateRow key={g} gate={g} act={byGate.get(g)!} />
        ))}
      </div>
    </div>
  );
}

function GateRow({
  gate,
  act,
}: {
  gate: number;
  act: { personality: HDActivation[]; design: HDActivation[] };
}) {
  const [open, setOpen] = useState(false);
  const content = GATE_CONTENT[gate];
  const centre = CENTER_LABELS[GATE_CENTER[gate]];
  const inP = act.personality.length > 0;
  const inD = act.design.length > 0;

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "14px 16px", font: "inherit", color: "inherit" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: poppins, fontWeight: 800, color: "#fff", background: "var(--dark)", borderRadius: 999, minWidth: 32, height: 32, padding: "0 8px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
            {gate}
          </span>
          <span style={{ fontFamily: poppins, fontWeight: 600, fontSize: 15 }}>{GATE_NAME[gate]?.toLowerCase()}</span>
          <span style={{ fontSize: 11, opacity: 0.5 }}>{centre}</span>
          <span style={{ marginLeft: "auto", fontSize: 20, lineHeight: 1, opacity: 0.4, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.15s" }}>+</span>
        </div>
        {!open && content?.keynote && (
          <p style={{ margin: "8px 0 0", fontSize: 13.5, opacity: 0.7, lineHeight: 1.5 }}>{content.keynote}.</p>
        )}
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {inP && <Tag text={`personality · ${act.personality.map((a) => `${a.body} ${a.gate}.${a.line}`).join(", ")}`} bg="var(--pink-light)" />}
            {inD && <Tag text={`design · ${act.design.map((a) => `${a.body} ${a.gate}.${a.line}`).join(", ")}`} bg="var(--lav-light)" />}
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, margin: "0 0 12px" }}>
            {GATE_DESCRIPTION[gate] ?? content?.keynote ?? ""}
          </p>
          {content && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ ...pill, background: "#f0f0f0", color: "var(--grey, #666)" }}>the shadow: {content.shadow.toLowerCase()}</span>
              <span style={{ ...pill, background: "var(--pink)", color: "#fff" }}>the gift: {content.gift.toLowerCase()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Tag({ text, bg }: { text: string; bg: string }) {
  return (
    <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: bg, lineHeight: 1.3 }}>{text}</span>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <h2 style={{ fontFamily: poppins, fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.55, margin: "34px 0 12px" }}>
      {title}
    </h2>
  );
}

const pill: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, padding: "5px 12px", borderRadius: 999 };
