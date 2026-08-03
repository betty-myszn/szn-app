"use client";

import type { LifeAreaReading } from "@/lib/life-areas";
import type { AreaDesignReading } from "@/lib/life-area-design";
import { GATE_CONTENT } from "@/lib/human-design-gate-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Astrology and Human Design woven into one full, designed read for a single life area.
// The chart keeps its full depth (ingredients, signature, aspects, the block, the deeper
// read, protocol, transit); the Human Design is threaded INTO the moments it belongs to
// as pink "your design" callouts, so the two literally sit together on the page rather
// than in separate blocks. Every section is a coloured band so it never reads as a flat
// wall of text. This is the pattern to roll out across every area.
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
  const extraGates = design ? design.gates.filter((g) => !g.core) : [];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* HERO */}
      <div style={{ background: "var(--dark)", color: "#fff", borderRadius: 20, padding: "34px 28px", marginBottom: 18 }}>
        <p style={{ ...eyebrow, color: "var(--lav)", opacity: 1 }}>astrology + human design, one read</p>
        <h1 style={{ fontFamily: poppins, fontSize: 38, fontWeight: 800, lineHeight: 1.04, margin: "8px 0 14px" }}>
          your {reading.label} this{" "}
          <span style={{ color: "var(--pink)" }}>{season} season</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, opacity: 0.9 }}>{reading.whatThisIsAbout}</p>
      </div>

      {/* INGREDIENTS, at a glance */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
        <Ingredient label="the house" value={reading.quickContext.house} bg="var(--cream)" />
        <Ingredient label="on the cusp" value={reading.quickContext.cuspSign} bg="var(--lav-light)" />
        <Ingredient label="ruled by" value={reading.quickContext.ruler} bg="var(--pink-bg)" />
      </div>

      {/* SIGNATURE */}
      <Band bg="#fff" n={1} label={`your ${reading.label} signature`}>
        <p style={para}>{reading.signature}</p>
      </Band>

      {/* THE ASPECTS IN PLAY, concrete astrology detail */}
      {reading.natalAspectLines.length > 0 && (
        <Band bg="var(--cream)" n={2} label="the aspects actually in play">
          <div style={{ display: "grid", gap: 8 }}>
            {reading.natalAspectLines.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "var(--pink)", fontWeight: 800, lineHeight: 1.5 }}>✦</span>
                <span style={{ fontSize: 15, lineHeight: 1.6 }}>{a}</span>
              </div>
            ))}
          </div>
        </Band>
      )}

      {/* BETTY'S TAKE */}
      <div style={{ background: "var(--pink)", color: "#fff", borderRadius: 18, padding: "26px 26px", marginBottom: 16 }}>
        <div style={{ ...eyebrow, color: "#fff", opacity: 0.85, marginBottom: 8 }}>betty&rsquo;s take</div>
        <p style={{ fontFamily: poppins, fontSize: 18, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{reading.bettysTake}</p>
      </div>

      {/* THE BLOCK, hero weave: chart pattern + design mechanic as a callout */}
      <Band bg="#fff" n={3} label="why it runs the way it does">
        <p style={para}>{reading.rootPattern}</p>
        {design && <DesignCallout heading={`your design, ${design.authority.label.toLowerCase()}`} body={design.authority.body} />}
      </Band>

      {/* BLIND SPOT */}
      <Band bg="var(--gold)" n={4} label="your blind spot">
        <p style={para}>{reading.blindSpot}</p>
      </Band>

      {/* THE SHIFT, before/after + design strategy callout */}
      <Band bg="#fff" n={5} label="how you actually move it">
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

      {/* THE DEEPER READ */}
      {reading.deepSynthesis.length > 0 && (
        <Band bg="var(--lav-light)" n={6} label="what this actually means for you">
          {reading.deepSynthesis.map((p, i) => (
            <p key={i} style={{ ...para, margin: i === reading.deepSynthesis.length - 1 ? 0 : "0 0 12px" }}>{p}</p>
          ))}
        </Band>
      )}

      {/* WHAT MATTERS MOST */}
      {reading.priorityLead && (
        <Band bg="#fff" n={7} label="what matters most in your chart">
          <p style={para}>{reading.priorityLead}</p>
        </Band>
      )}

      {/* HOW THE SEASON ACTIVATES IT */}
      {reading.inYourChart && (
        <Band bg="var(--cream)" n={8} label={`how ${season} season activates this`}>
          <p style={para}>{reading.inYourChart}</p>
        </Band>
      )}

      {/* GATES, enriched: what each gate is + how it plays here + trap/move */}
      {coreGates.length > 0 && (
        <Band bg="#fff" n={9} label={`the gates ${season} is switching on here`}>
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
      )}

      {/* PROTOCOL */}
      {reading.protocolDays.length > 0 && (
        <Band bg="var(--mint)" n={10} label={reading.protocolTitle || "the protocol"}>
          <div style={{ display: "grid", gap: 8 }}>
            {reading.protocolDays.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", borderRadius: 12, padding: "12px 14px" }}>
                <span style={{ fontFamily: poppins, fontWeight: 800, color: "#fff", background: "var(--pink)", borderRadius: 999, width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.55 }}>{d}</span>
              </div>
            ))}
          </div>
        </Band>
      )}

      {/* ONE MOVE THIS WEEK */}
      <Band bg="#fff" n={11} label="your one move this week">
        <p style={para}>{reading.stretchMove}</p>
        {design && (
          <DesignCallout
            heading="your design"
            body={`When you go to do it, decide it through your ${design.authority.label.toLowerCase()}. Let your mind weigh in and let your body make the call.`}
          />
        )}
      </Band>

      {/* PROOF */}
      {reading.proofMarkers.length > 0 && (
        <Band bg="var(--cream)" n={12} label="how you'll know it's working">
          <div style={{ display: "grid", gap: 8 }}>
            {reading.proofMarkers.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "var(--pink)", fontWeight: 800 }}>✓</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.55 }}>{p}</span>
              </div>
            ))}
          </div>
        </Band>
      )}

      {/* LIVE TRANSIT */}
      {reading.transitLine && (
        <div style={{ background: "var(--dark)", color: "#fff", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ ...eyebrow, color: "var(--lav)", opacity: 1, marginBottom: 8 }}>the transit hitting this right now</div>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: 0, opacity: 0.92 }}>{reading.transitLine}</p>
        </div>
      )}

      {/* AFFIRMATIONS */}
      {reading.affirmations.length > 0 && (
        <Band bg="var(--lav-light)" n={13} label={`affirmations for ${reading.label}`}>
          <div style={{ display: "grid", gap: 8 }}>
            {reading.affirmations.map((a, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", fontFamily: poppins, fontSize: 16, lineHeight: 1.5 }}>
                &ldquo;{a}&rdquo;
              </div>
            ))}
          </div>
        </Band>
      )}

      {/* ACTIVATION */}
      {reading.activation && (
        <Band bg="var(--pink-bg)" n={14} label={reading.activation.title || "activate it now"}>
          <p style={para}>{reading.activation.ritual}</p>
        </Band>
      )}

      <p style={{ fontSize: 12, opacity: 0.5, marginTop: 20, lineHeight: 1.6, textAlign: "center" }}>
        Combined astrology + Human Design read for one area, same chart data and the same two engines
        as the live pages.
      </p>
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

function Band({ bg, n, label, children }: { bg: string; n: number; label: string; children: React.ReactNode }) {
  const onDark = false;
  return (
    <div style={{ background: bg, borderRadius: 18, padding: "22px 24px", marginBottom: 14, border: bg === "#fff" ? "1px solid rgba(0,0,0,0.08)" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, color: "var(--pink)", border: "1.5px solid var(--pink)", borderRadius: 999, width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
        <div style={{ ...eyebrow, opacity: onDark ? 1 : 0.6 }}>{label}</div>
      </div>
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
