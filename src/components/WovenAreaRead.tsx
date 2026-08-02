"use client";

import type { LifeAreaReading } from "@/lib/life-areas";
import type { AreaDesignReading } from "@/lib/life-area-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// PROTOTYPE: astrology and Human Design woven into one voice for a single life area.
// Instead of an astrology block followed by a separate "your design" block, each moment
// is read through both maps together: the chart names the pattern, the design says why
// it runs and how you are built to move it. This is the pattern we would roll out across
// every area once the voice is approved.
export default function WovenAreaRead({
  reading,
  design,
  seasonSign,
}: {
  reading: LifeAreaReading;
  design: AreaDesignReading | null;
  seasonSign: string;
}) {
  const season = seasonSign.toLowerCase();
  const coreGates = design ? design.gates.filter((g) => g.core) : [];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <p style={eyebrow}>astrology + human design, one read</p>
      <h1 style={{ fontFamily: poppins, fontSize: 40, fontWeight: 700, lineHeight: 1.05, margin: "6px 0 14px" }}>
        your {reading.label} this {season} season
      </h1>
      <p style={{ fontSize: 16.5, lineHeight: 1.6, margin: "0 0 8px" }}>
        Your chart says what this season is asking of your {reading.label}. Your Human Design says how
        you are built to answer it. Here they are as one read, not two.
      </p>

      {/* WHY IT GETS STUCK, the hero weave: chart pattern + design mechanic */}
      <Section label="why it runs the way it does">
        <p style={para}>{reading.rootPattern}</p>
        {design && (
          <>
            <p style={{ ...bridge }}>
              That is the pattern your chart sees. Your Human Design shows why effort alone does not
              shift it:
            </p>
            <p style={para}>{design.authority.body}</p>
          </>
        )}
      </Section>

      {/* THE SHIFT, woven: astrology belief change + design strategy */}
      <Section label="how you actually move it">
        <div style={{ ...card, marginBottom: 14 }}>
          <div style={miniLabel}>the belief running the show</div>
          <p style={{ ...para, margin: "0 0 12px" }}>&ldquo;{reading.shiftBefore}&rdquo;</p>
          <div style={{ ...miniLabel, color: "var(--pink)" }}>the belief you&rsquo;re building</div>
          <p style={{ ...para, margin: 0 }}>&ldquo;{reading.shiftAfter}&rdquo;</p>
        </div>
        {design && (
          <>
            <p style={bridge}>And here is the move your design actually backs:</p>
            <p style={para}>{design.strategy.body}</p>
          </>
        )}
      </Section>

      {/* WHERE THE SEASON IS SWITCHING IT ON: the core gates for this area */}
      {coreGates.length > 0 && (
        <Section label={`where ${season} season is switching this on`}>
          <p style={{ ...bridge, marginTop: 0 }}>
            The specific circuitry the season is lighting up in your {reading.label} right now, each
            with its trap and its move.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {coreGates.map((g) => (
              <div key={g.gate} style={card}>
                <div style={{ fontFamily: poppins, fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>
                  gate {g.gate}, {g.name.toLowerCase()}
                  {g.natal && <span style={natalTag}>one of yours</span>}
                </div>
                <p style={{ ...para, margin: "0 0 8px" }}>{g.lens}</p>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  <strong>the trap:</strong> {g.shadow.toLowerCase()}
                  <span style={{ opacity: 0.4 }}> → </span>
                  <strong>the move:</strong> {g.gift.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ONE MOVE THIS WEEK: astrology stretch move + design decision cue */}
      <Section label="your one move this week">
        <p style={para}>{reading.stretchMove}</p>
        {design && (
          <p style={{ ...bridge }}>
            When you go to do it, decide it the way you are built to, through your{" "}
            {design.authority.label.toLowerCase()}, not by thinking it round in circles.
          </p>
        )}
      </Section>

      <p style={{ fontSize: 12, opacity: 0.5, marginTop: 24, lineHeight: 1.6 }}>
        Prototype of the combined astrology + Human Design voice for one area. Same chart data and the
        same two engines as the live pages, presented as one read.
      </p>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: "34px 0" }}>
      <div style={{ ...eyebrow, marginBottom: 12, color: "var(--pink)", opacity: 0.9 }}>{label}</div>
      {children}
    </div>
  );
}

const eyebrow: React.CSSProperties = { textTransform: "uppercase", letterSpacing: 1.8, fontSize: 10.5, opacity: 0.5, fontWeight: 700 };
const para: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.7, margin: "0 0 12px" };
const bridge: React.CSSProperties = { fontSize: 15, lineHeight: 1.6, margin: "0 0 12px", fontStyle: "italic", opacity: 0.8 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "16px 18px" };
const miniLabel: React.CSSProperties = { textTransform: "uppercase", letterSpacing: 1.2, fontSize: 10, opacity: 0.55, marginBottom: 4, fontWeight: 700 };
const natalTag: React.CSSProperties = { marginLeft: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "var(--pink)", color: "#fff", padding: "2px 7px" };
