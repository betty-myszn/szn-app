"use client";

import { useState } from "react";
import type { LifeAreaReading } from "@/lib/life-areas";
import type { AreaDesignReading } from "@/lib/life-area-design";
import { GATE_CONTENT } from "@/lib/human-design-gate-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Astrology and Human Design woven into one read for a single life area, same chart data and the
// same two engines as the live pages. Human Design is threaded INTO the astrology as pink "your
// design" callouts so the two systems sit together rather than in separate blocks.
//
// Two layouts from the same section nodes:
//   - classic: every section stacked open (the original long read)
//   - tabbed (collapsible=true): hero + betty's take stay on top, everything else is grouped into
//     four tabs so the page is about one screen instead of a fourteen-section scroll.
export default function WovenAreaRead({
  reading,
  design,
  seasonSign,
  collapsible = false,
}: {
  reading: LifeAreaReading;
  design: AreaDesignReading | null;
  seasonSign: string;
  collapsible?: boolean;
}) {
  const season = seasonSign.toLowerCase();
  const coreGates = design ? design.gates.filter((g) => g.core) : [];
  const extraGates = design ? design.gates.filter((g) => !g.core) : [];

  const hero = (
    <div style={{ background: "var(--dark)", color: "#fff", borderRadius: 20, padding: "34px 28px", marginBottom: 18 }}>
      <p style={{ ...eyebrow, color: "var(--lav)", opacity: 1 }}>
        {design ? "astrology + human design, one read" : "your personalised read"}
      </p>
      <h1 style={{ fontFamily: poppins, fontSize: 38, fontWeight: 800, lineHeight: 1.04, margin: "8px 0 14px" }}>
        your {reading.label} this <span style={{ color: "var(--pink)" }}>{season} season</span>
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, opacity: 0.9 }}>{reading.whatThisIsAbout}</p>
    </div>
  );

  const ingredients = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
      <Ingredient label="the house" value={reading.quickContext.house} bg="var(--cream)" />
      <Ingredient label="on the cusp" value={reading.quickContext.cuspSign} bg="var(--lav-light)" />
      <Ingredient label="ruled by" value={reading.quickContext.ruler} bg="var(--pink-bg)" />
    </div>
  );

  const bettysTake = (
    <div style={{ background: "var(--pink)", color: "#fff", borderRadius: 18, padding: "26px 26px", marginBottom: 16 }}>
      <div style={{ ...eyebrow, color: "#fff", opacity: 0.85, marginBottom: 8 }}>betty&rsquo;s take</div>
      <p style={{ fontFamily: poppins, fontSize: 18, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{reading.bettysTake}</p>
    </div>
  );

  // ── section nodes, each rendered once, placed either in classic order or inside a tab ──
  const signature = (
    <Band key="signature" bg="#fff" label={`your ${reading.label} signature`}>
      <p style={para}>{reading.signature}</p>
    </Band>
  );

  const aspects = reading.natalAspectLines.length > 0 ? (
    <Band key="aspects" bg="var(--cream)" label="the aspects actually in play">
      <div style={{ display: "grid", gap: 8 }}>
        {reading.natalAspectLines.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "var(--pink)", fontWeight: 800, lineHeight: 1.5 }}>✦</span>
            <span style={{ fontSize: 15, lineHeight: 1.6 }}>{a}</span>
          </div>
        ))}
      </div>
    </Band>
  ) : null;

  const rootPattern = (
    <Band key="root" bg="#fff" label="why it runs the way it does">
      <p style={para}>{reading.rootPattern}</p>
      {design && <DesignCallout heading={`your design, ${design.authority.label.toLowerCase()}`} body={design.authority.body} />}
    </Band>
  );

  const blindSpot = (
    <Band key="blind" bg="var(--gold)" label="your blind spot">
      <p style={para}>{reading.blindSpot}</p>
    </Band>
  );

  const shift = (
    <Band key="shift" bg="#fff" label="how you actually move it">
      <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
        <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: "14px 16px", opacity: 0.7 }}>
          <div style={miniLabel}>the belief running the show</div>
          <p style={{ ...para, margin: 0 }}>&ldquo;{reading.shiftBefore}&rdquo;</p>
        </div>
        <div style={{ textAlign: "center", color: "var(--pink)", fontWeight: 800, fontSize: 18 }}>↓</div>
        <div style={{ background: "var(--pink-bg)", border: "1.5px solid var(--pink)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ ...miniLabel, color: "var(--pink)" }}>the belief you&rsquo;re building</div>
          <p style={{ ...para, margin: 0, fontWeight: 600 }}>&ldquo;{reading.shiftAfter}&rdquo;</p>
        </div>
      </div>
      {design && <DesignCallout heading={`your design, ${design.strategy.label.toLowerCase()}`} body={design.strategy.body} />}
    </Band>
  );

  const deeper = reading.deepSynthesis.length > 0 ? (
    <Band key="deeper" bg="var(--lav-light)" label="what this actually means for you">
      {reading.deepSynthesis.map((p, i) => (
        <p key={i} style={{ ...para, margin: i === reading.deepSynthesis.length - 1 ? 0 : "0 0 12px" }}>{p}</p>
      ))}
    </Band>
  ) : null;

  const priority = reading.priorityLead ? (
    <Band key="priority" bg="#fff" label="what matters most in your chart">
      <p style={para}>{reading.priorityLead}</p>
    </Band>
  ) : null;

  const seasonActivates = reading.inYourChart ? (
    <Band key="activates" bg="var(--cream)" label={`how ${season} season activates this`}>
      <p style={para}>{reading.inYourChart}</p>
    </Band>
  ) : null;

  const gates = coreGates.length > 0 ? (
    <Band key="gates" bg="#fff" label={`the gates ${season} is switching on here`}>
      <p style={{ ...para, opacity: 0.75, fontSize: 14.5 }}>
        Your mind runs on specific circuitry. These are the parts of it the season is lighting up
        right now, what each one is, how it shows up for you, and the move it is asking for.
      </p>
      <div style={{ display: "grid", gap: 12 }}>
        {coreGates.map((g) => <GateCard key={g.gate} g={g} />)}
      </div>
      {extraGates.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ ...miniLabel, marginBottom: 8 }}>also stirring this season</div>
          <div style={{ display: "grid", gap: 8 }}>
            {extraGates.map((g) => (
              <div key={g.gate} style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
                  <strong>gate {g.gate}, {g.name.toLowerCase()}.</strong>{" "}
                  <span style={{ opacity: 0.75 }}>{GATE_CONTENT[g.gate]?.keynote}.</span> {g.lens}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Band>
  ) : null;

  const protocol = reading.protocolDays.length > 0 ? (
    <Band key="protocol" bg="var(--mint)" label={reading.protocolTitle || "the protocol"}>
      <div style={{ display: "grid", gap: 8 }}>
        {reading.protocolDays.map((d, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", borderRadius: 12, padding: "12px 14px" }}>
            <span style={{ fontFamily: poppins, fontWeight: 800, color: "#fff", background: "var(--pink)", borderRadius: 999, width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 14.5, lineHeight: 1.55 }}>{d}</span>
          </div>
        ))}
      </div>
    </Band>
  ) : null;

  const oneMove = (
    <Band key="onemove" bg="#fff" label="your one move this week">
      <p style={para}>{reading.stretchMove}</p>
      {design && (
        <DesignCallout
          heading="your design"
          body={`When you go to do it, decide it through your ${design.authority.label.toLowerCase()}. Let your mind weigh in and let your body make the call.`}
        />
      )}
    </Band>
  );

  const proof = reading.proofMarkers.length > 0 ? (
    <Band key="proof" bg="var(--cream)" label="how you'll know it's working">
      <div style={{ display: "grid", gap: 8 }}>
        {reading.proofMarkers.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "var(--pink)", fontWeight: 800 }}>✓</span>
            <span style={{ fontSize: 14.5, lineHeight: 1.55 }}>{p}</span>
          </div>
        ))}
      </div>
    </Band>
  ) : null;

  const transit = reading.transitLine ? (
    <div key="transit" style={{ background: "var(--dark)", color: "#fff", borderRadius: 16, padding: "22px 24px", marginBottom: 14 }}>
      <div style={{ ...eyebrow, color: "var(--lav)", opacity: 1, marginBottom: 8 }}>the transit hitting this right now</div>
      <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: 0, opacity: 0.92 }}>{reading.transitLine}</p>
    </div>
  ) : null;

  const affirmations = reading.affirmations.length > 0 ? (
    <Band key="affirm" bg="var(--lav-light)" label={`affirmations for ${reading.label}`}>
      <div style={{ display: "grid", gap: 8 }}>
        {reading.affirmations.map((a, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", fontFamily: poppins, fontSize: 16, lineHeight: 1.5 }}>
            &ldquo;{a}&rdquo;
          </div>
        ))}
      </div>
    </Band>
  ) : null;

  const activation = reading.activation ? (
    <Band key="activation" bg="var(--pink-bg)" label={reading.activation.title || "activate it now"}>
      <p style={para}>{reading.activation.ritual}</p>
    </Band>
  ) : null;

  const footer = (
    <p style={{ fontSize: 12, opacity: 0.5, marginTop: 20, lineHeight: 1.6, textAlign: "center" }}>
      Combined astrology + Human Design read for one area, same chart data and the same two engines
      as the live pages.
    </p>
  );

  // ── tabbed layout: one screen, four groups ──
  if (collapsible) {
    return (
      <TabbedRead
        hero={hero}
        ingredients={ingredients}
        bettysTake={bettysTake}
        footer={footer}
        groups={[
          { id: "read", label: "the read", nodes: [signature, aspects, rootPattern, priority, deeper] },
          { id: "shadow", label: "your shadow", nodes: [blindSpot, shift] },
          { id: "szn", label: "this szn", nodes: [seasonActivates, gates, transit] },
          { id: "work", label: "the work", nodes: [protocol, oneMove, proof, affirmations, activation] },
        ]}
      />
    );
  }

  // ── classic layout: everything open, in order ──
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {hero}
      {ingredients}
      {signature}
      {aspects}
      {bettysTake}
      {rootPattern}
      {blindSpot}
      {shift}
      {deeper}
      {priority}
      {seasonActivates}
      {gates}
      {protocol}
      {oneMove}
      {proof}
      {transit}
      {affirmations}
      {activation}
      {footer}
    </div>
  );
}

// The tabbed shell: hero, ingredients and betty's take stay put, then a sticky-ish chip row
// switches which group of sections shows below. Groups whose nodes are all empty are dropped.
function TabbedRead({
  hero,
  ingredients,
  bettysTake,
  footer,
  groups,
}: {
  hero: React.ReactNode;
  ingredients: React.ReactNode;
  bettysTake: React.ReactNode;
  footer: React.ReactNode;
  groups: { id: string; label: string; nodes: React.ReactNode[] }[];
}) {
  const live = groups.filter((g) => g.nodes.some(Boolean));
  const [active, setActive] = useState(live[0]?.id ?? "");
  const current = live.find((g) => g.id === active) ?? live[0];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {hero}
      {ingredients}
      {bettysTake}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {live.map((g) => {
          const on = g.id === current?.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActive(g.id)}
              aria-pressed={on}
              style={{
                fontFamily: poppins,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "-0.2px",
                textTransform: "lowercase",
                padding: "10px 18px",
                borderRadius: 40,
                cursor: "pointer",
                border: "2px solid var(--dark)",
                background: on ? "var(--pink)" : "#fff",
                color: on ? "#fff" : "var(--dark)",
                boxShadow: on ? "3px 3px 0 var(--dark)" : "none",
              }}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div>{current?.nodes.filter(Boolean)}</div>
      {footer}
    </div>
  );
}

// A gate card that actually explains the gate: what it is, how it plays here, the move.
function GateCard({ g }: { g: { gate: number; name: string; lens: string; shadow: string; gift: string; natal: boolean } }) {
  const keynote = GATE_CONTENT[g.gate]?.keynote ?? "";
  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--lav-light)", padding: "12px 16px" }}>
        <span style={{ fontFamily: poppins, fontWeight: 800, color: "#fff", background: "var(--dark)", borderRadius: 999, minWidth: 34, height: 34, padding: "0 8px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
          {g.gate}
        </span>
        <span style={{ fontFamily: poppins, fontWeight: 700, fontSize: 15.5 }}>{g.name.toLowerCase()}</span>
        {g.natal && <span style={natalTag}>one of yours</span>}
      </div>
      <div style={{ padding: "14px 16px" }}>
        {keynote && (
          <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: "0 0 8px", color: "var(--grey)", fontStyle: "italic" }}>
            What it is: {keynote.toLowerCase()}.
          </p>
        )}
        <p style={{ ...para, margin: "0 0 12px" }}>{g.lens}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...pill, background: "#f0f0f0", color: "var(--grey)" }}>the trap: {g.shadow.toLowerCase()}</span>
          <span style={{ ...pill, background: "var(--pink)", color: "#fff" }}>the move: {g.gift.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
}

// The pink "your design" callout that sits inside an astrology section, so the two systems
// visibly join rather than living in separate blocks.
function DesignCallout({ heading, body }: { heading: string; body: string }) {
  return (
    <div style={{ borderLeft: "3px solid var(--pink)", background: "var(--pink-bg)", borderRadius: "0 12px 12px 0", padding: "14px 16px", marginTop: 14 }}>
      <div style={{ ...eyebrow, color: "var(--pink)", opacity: 1, marginBottom: 6 }}>{heading}</div>
      <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{body}</p>
    </div>
  );
}

function Band({ bg, label, children }: { bg: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: bg, borderRadius: 18, padding: "22px 24px", marginBottom: 14, border: bg === "#fff" ? "1px solid rgba(0,0,0,0.08)" : undefined }}>
      <div style={{ ...eyebrow, opacity: 0.6, marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );
}

function Ingredient({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: "12px 12px", textAlign: "center" }}>
      <div style={{ ...eyebrow, fontSize: 9, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: poppins, fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{value}</div>
    </div>
  );
}

const eyebrow: React.CSSProperties = { textTransform: "uppercase", letterSpacing: 1.6, fontSize: 10.5, opacity: 0.5, fontWeight: 700 };
const para: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.7, margin: 0 };
const miniLabel: React.CSSProperties = { textTransform: "uppercase", letterSpacing: 1.2, fontSize: 10, opacity: 0.55, marginBottom: 4, fontWeight: 700 };
const pill: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, padding: "5px 12px", borderRadius: 999 };
const natalTag: React.CSSProperties = { marginLeft: "auto", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "var(--pink)", color: "#fff", padding: "3px 8px", borderRadius: 999 };
