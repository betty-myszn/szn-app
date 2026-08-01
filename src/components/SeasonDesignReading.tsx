"use client";

import { useState } from "react";
import Link from "next/link";
import type { GateActivation, SeasonBlock, SeasonDesignReading } from "@/types/season-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Presentational view for the combined season + Human Design reading. Every element
// is an expandable card: collapsed it shows a one-line summary, opened it reveals
// three layers, who you are here, how Leo moves it for you, and what to do.
export default function SeasonDesignReadingView({ r }: { r: SeasonDesignReading }) {
  return (
    <>
      <p style={eyebrow}>welcome to your</p>
      <h1 style={{ fontFamily: poppins, fontSize: 46, lineHeight: 1.03, margin: "0 0 14px", fontWeight: 700 }}>
        {r.season.title}
      </h1>
      <p style={{ fontSize: 12, opacity: 0.55, margin: "0 0 18px" }}>{r.season.dates}</p>
      <p style={{ fontSize: 16.5, lineHeight: 1.6, margin: "0 0 14px" }}>{r.season.intro}</p>
      <p style={{ fontSize: 16.5, lineHeight: 1.6, margin: "0 0 18px" }}>{r.season.encouraging}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {r.season.activates.map((a) => (
          <span key={a} style={chip}>{a}</span>
        ))}
      </div>

      <div style={{ ...card, background: "var(--dark)", color: "#fff", margin: "28px 0 8px" }}>
        <p style={{ margin: 0, fontFamily: poppins, fontSize: 18, lineHeight: 1.4 }}>
          Here is how <em>your</em> Human Design experiences {r.season.title}. Tap any card to open it up.
        </p>
      </div>

      <SectionHead n={1} title="your human design snapshot" />
      <div style={statGrid}>
        <Stat label="Type" value={r.snapshot.type} />
        <Stat label="Strategy" value={r.snapshot.strategy} />
        <Stat label="Authority" value={r.snapshot.authorityLabel} />
        <Stat label="Profile" value={`${r.snapshot.profile}  ${r.profile.name}`} />
        <Stat label="Definition" value={r.snapshot.definition} />
        <Stat label="Cross" value={r.snapshot.incarnationCross} />
        <Stat label="Signature" value={r.snapshot.signature} />
        <Stat label="Not-self" value={r.snapshot.notSelfTheme} />
      </div>
      <div style={{ marginTop: 12 }}>
        <ExpandableBlock header={`Your type: ${r.snapshot.type}`} block={r.snapshot.typeLens} accent defaultOpen />
      </div>

      <SectionHead n={2} title={`your ${r.season.sign.toLowerCase()} season strategy`} />
      <ul style={bulletList}>
        {r.strategy.bullets.map((b, i) => (
          <li key={i} style={bulletItem}>{b}</li>
        ))}
      </ul>

      <SectionHead n={3} title="how you make decisions this season" />
      <ExpandableBlock header={r.authority.title} block={r.authority.block} accent />

      <SectionHead n={4} title="your profile this season" />
      <ExpandableBlock header={`${r.profile.code} · ${r.profile.name}`} block={r.profile.block} />

      <SectionHead n={5} title="your centres this season" />
      <p style={{ fontSize: 13.5, opacity: 0.6, margin: "0 0 12px", lineHeight: 1.55 }}>
        Defined centres are your consistent energy. Open centres are where you take in the world. Tap each to open it up.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {r.centres.map((c) => (
          <ExpandableBlock
            key={c.key}
            header={c.label}
            block={c.block}
            chip={c.state}
            accentColor={c.state === "defined" ? "var(--pink)" : "var(--lav)"}
          />
        ))}
      </div>

      <SectionHead n={6} title="gates activated this season" />
      {r.gates.permanent.length > 0 && (
        <>
          <SubHead text="your own gates, amplified" />
          <div style={{ display: "grid", gap: 10 }}>
            {r.gates.permanent.map((g) => <GateCard key={g.gate} g={g} />)}
          </div>
        </>
      )}
      {r.gates.temporary.length > 0 && (
        <>
          <SubHead text="temporary leo gates, borrowed for the season" />
          <div style={{ display: "grid", gap: 10 }}>
            {r.gates.temporary.map((g) => <GateCard key={g.gate} g={g} />)}
          </div>
        </>
      )}

      <SectionHead n={7} title="channels forming this season" />
      {r.channelsForming.length === 0 ? (
        <p style={{ margin: 0, opacity: 0.65, fontSize: 15, lineHeight: 1.6 }}>
          No new channels complete for you this season. Your fixed gifts stay steady, and the season
          works through the gates above instead.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {r.channelsForming.map((ch) => (
            <div key={ch.key} style={card}>
              <div style={{ fontFamily: poppins, fontWeight: 600, marginBottom: 3 }}>
                {ch.natalGate}–{ch.seasonalGate} · {ch.name}
              </div>
              <p style={{ fontSize: 14, opacity: 0.82, lineHeight: 1.55, margin: 0 }}>{ch.text}</p>
            </div>
          ))}
        </div>
      )}

      <SectionHead n={8} title="your life purpose this season" />
      <ExpandableBlock
        header={`${r.incarnationCross.angle} · ${r.incarnationCross.gates.join("/")}`}
        block={r.incarnationCross.block}
      />

      <div style={{ ...card, background: "var(--mint)", margin: "34px 0 8px" }}>
        <div style={{ ...eyebrow, marginBottom: 6 }}>your {r.season.sign.toLowerCase()} season challenge</div>
        <p style={{ margin: 0, fontFamily: poppins, fontSize: 18, lineHeight: 1.4 }}>{r.challenge}</p>
      </div>

      <p style={{ fontSize: 12, opacity: 0.5, marginTop: 24, lineHeight: 1.6 }}>
        Combines your natal Human Design with the Sun's journey through {r.season.sign} this season.
        More coming to this reading soon: business, money, relationships, shadow work and a daily
        dashboard.
      </p>
    </>
  );
}

// ── expandable card ─────────────────────────────────────────────────────────────

function ExpandableBlock({
  header,
  block,
  chip: stateChip,
  accent,
  accentColor,
  defaultOpen,
}: {
  header: string;
  block: SeasonBlock;
  chip?: string;
  accent?: boolean;
  accentColor?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const border = accentColor ?? (accent ? "var(--pink)" : "rgba(0,0,0,0.08)");
  return (
    <div style={{ ...card, borderLeft: `3px solid ${border}`, padding: 0, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "14px 16px",
          font: "inherit",
          color: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: poppins, fontWeight: 600, fontSize: 15.5 }}>{header}</span>
          {stateChip && (
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, padding: "2px 8px", borderRadius: 999, background: stateChip === "defined" ? "var(--pink-light)" : "var(--lav-light)" }}>
              {stateChip}
            </span>
          )}
          <span style={{ marginLeft: "auto", fontSize: 20, lineHeight: 1, opacity: 0.4, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.15s" }}>+</span>
        </div>
        <p style={{ margin: 0, fontSize: 14.5, opacity: 0.82, lineHeight: 1.5 }}>{block.summary}</p>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          <Layer label="who you are here" text={block.identity} />
          <Layer label={`how ${"leo"} moves this for you`} text={block.cycle} />
          <Layer label="what to do" text={block.guidance} highlight />
        </div>
      )}
    </div>
  );
}

function Layer({ label, text, highlight }: { label: string; text: string; highlight?: boolean }) {
  return (
    <div style={{ marginTop: 12, ...(highlight ? { background: "var(--cream)", borderRadius: 10, padding: "10px 12px" } : {}) }}>
      <div style={{ ...eyebrow, marginBottom: 4, color: highlight ? "var(--pink)" : undefined, opacity: highlight ? 0.9 : 0.5 }}>
        {label}
      </div>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function GateCard({ g }: { g: GateActivation }) {
  return (
    <div style={{ ...card, borderLeft: `3px solid ${g.natal ? "var(--pink)" : "var(--lav)"}` }}>
      <div style={{ fontFamily: poppins, fontWeight: 600, marginBottom: 2 }}>
        Gate {g.gate} · {g.name}
      </div>
      <p style={{ fontSize: 13.5, opacity: 0.75, margin: "0 0 8px", lineHeight: 1.5 }}>{g.keynote}.</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13.5 }}>
        <span><strong style={{ opacity: 0.55 }}>shadow</strong> {g.shadow}</span>
        <span><strong style={{ color: "var(--pink)" }}>gift</strong> {g.gift}</span>
      </div>
    </div>
  );
}

function SectionHead({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "38px 0 14px" }}>
      <span style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, color: "var(--pink)", border: "1px solid var(--pink)", borderRadius: 999, width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {n}
      </span>
      <h2 style={{ fontFamily: poppins, fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.7, margin: 0 }}>
        {title}
      </h2>
    </div>
  );
}

function SubHead({ text }: { text: string }) {
  return <p style={{ ...eyebrow, margin: "16px 0 10px" }}>{text}</p>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "12px 14px" }}>
      <div style={{ ...eyebrow, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: poppins, fontSize: 14.5, fontWeight: 600, lineHeight: 1.25 }}>{value}</div>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px", fontFamily: "var(--font-body, system-ui), sans-serif", color: "var(--dark)" }}>
      {children}
    </main>
  );
}

export { Link };

const eyebrow: React.CSSProperties = { textTransform: "uppercase", letterSpacing: 1.8, fontSize: 10.5, opacity: 0.5 };
const statGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "14px 16px" };
const chip: React.CSSProperties = { fontSize: 12, padding: "6px 12px", borderRadius: 999, background: "var(--lav-light)", border: "1px solid var(--lav)" };
const bulletList: React.CSSProperties = { margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 };
const bulletItem: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.55, background: "var(--cream)", borderRadius: 12, padding: "12px 16px" };

export const seasonLinkBtn: React.CSSProperties = { display: "inline-block", background: "var(--pink)", color: "#fff", padding: "12px 20px", borderRadius: 999, textDecoration: "none", fontWeight: 600 };
export const seasonLinkBtnOutline: React.CSSProperties = { display: "inline-block", border: "1px solid rgba(0,0,0,0.2)", color: "var(--dark)", padding: "10px 18px", borderRadius: 999, textDecoration: "none", fontSize: 14 };
