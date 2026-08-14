"use client";

import { useState } from "react";
import Link from "next/link";
import { useHumanDesign } from "@/lib/use-human-design";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess } from "@/lib/membership-access";
import Bodygraph from "@/components/Bodygraph";
import HumanDesignAreas from "@/components/HumanDesignAreas";
import HumanDesignGates from "@/components/HumanDesignGates";
import HumanDesignProfileLines from "@/components/HumanDesignProfileLines";
import { CENTER_LABELS, GATE_NAME, channelKey } from "@/lib/human-design-constants";
import {
  TYPE_CONTENT,
  AUTHORITY_CONTENT,
  PROFILE_CONTENT,
  DEFINITION_CONTENT,
  CENTER_CONTENT,
  CROSS_ANGLE_CONTENT,
  CHANNEL_GIFT,
} from "@/lib/human-design-content";
import { typeDeep, type HdDeepDive } from "@/lib/human-design-deep-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The Human Design chart as a guided reading: every element leads with what it means for you and how
// to apply it, mirroring how the astrology chart reads. The raw technical activations sit at the
// bottom for those who want them. Extracted from the /human-design page so the SAME reading can be
// shown both on that standalone page and inside the combined free-chart results (the birth-chart /
// human-design tabs), with no duplicated content.
//
// memberNav renders the member-only "my astrology chart" links; it stays off in the free tabbed
// results, where the tab bar is the navigation and /my-chart isn't a free destination.
export default function HumanDesignReading({ memberNav = false }: { memberNav?: boolean }) {
  const { hd, loading } = useHumanDesign();
  const { member } = useMember();

  if (loading) {
    return (
      <Shell>
        <p style={{ opacity: 0.6 }}>reading your design...</p>
      </Shell>
    );
  }

  if (!hd) {
    return (
      <Shell>
        <p style={{ marginBottom: 16 }}>
          We need your birth date, exact time and place to build your Human Design chart.
        </p>
        <Link href="/chart" style={linkBtn}>
          get my free charts
        </Link>
      </Shell>
    );
  }

  // The identity essentials (type, strategy, authority, profile, bodygraph) are free for everyone,
  // the front-door taster. The deeper read (definition, area-by-area, centres, channels, every gate,
  // incarnation cross, technical) is the paid layer, so free members and logged-out visitors see a
  // go-deeper CTA in its place.
  const unlocked = hasActiveAccess(member);

  const type = TYPE_CONTENT[hd.type];
  const authority = AUTHORITY_CONTENT[hd.authority];
  const profile = PROFILE_CONTENT[hd.profile];
  const definition = DEFINITION_CONTENT[hd.definition];
  const cross = CROSS_ANGLE_CONTENT[hd.incarnationCross.angle];

  return (
    <Shell>
      {memberNav && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Link href="/my-chart" style={navLink}>
            &larr; my astrology chart
          </Link>
          <span style={{ ...navLink, opacity: 0.4 }}>human design</span>
        </div>
      )}

      <p style={eyebrow}>your energy blueprint</p>
      <h1 style={{ fontFamily: poppins, fontSize: 44, lineHeight: 1.04, margin: "0 0 8px", fontWeight: 700 }}>
        {hd.type}
      </h1>
      <p style={{ fontSize: 18, opacity: 0.8, margin: "0 0 8px", fontFamily: poppins }}>
        {type.title}
      </p>
      <p style={{ fontSize: 17, opacity: 0.7, margin: "0 0 28px", lineHeight: 1.5 }}>
        {hd.birthData.name ? `${hd.birthData.name}, ` : ""}
        {type.intro.charAt(0).toLowerCase() + type.intro.slice(1)}
      </p>

      {/* quick reference */}
      <div style={statGrid}>
        <Stat label="Type" value={hd.type} />
        <Stat label="Strategy" value={hd.strategy} />
        <Stat label="Authority" value={authority.title.replace(/ authority.*/i, "")} />
        <Stat label="Profile" value={`${hd.profile}  ${profile ? profile.title : ""}`} />
        <Stat label="Definition" value={hd.definition} />
        <Stat label="Cross" value={`${hd.incarnationCross.angle} (${hd.incarnationCross.gates.join("/")})`} />
      </div>

      {/* the bodygraph: the visual chart, defined centres filled, defined channels lit */}
      <div style={{ margin: "8px 0 24px" }}>
        <Bodygraph hd={hd} />
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 14, fontSize: 11, opacity: 0.7 }}>
          <span>
            <span style={{ display: "inline-block", width: 11, height: 11, background: "var(--pink)", marginRight: 6, verticalAlign: "middle" }} />
            defined
          </span>
          <span>
            <span style={{ display: "inline-block", width: 11, height: 11, background: "#fff", border: "1.5px solid var(--dark)", marginRight: 6, verticalAlign: "middle" }} />
            open
          </span>
        </div>
      </div>

      {/* the guided reading. Type opens into the paid deep dive (600 words: for you, in your business,
          the shadow, how to heal). Free members see the unlock prompt instead. */}
      <ExpandableReading title="your type" block={type} deep={typeDeep(hd.type)} unlocked={unlocked} />

      <Reading title="how you make decisions" block={authority} accent="var(--pink)" />

      {profile && <Reading title="your profile" block={profile} />}

      {/* the two profile lines, each explained on its own */}
      <HumanDesignProfileLines profile={hd.profile} />

      {unlocked ? (
        <>
          <Reading title="how your energy is wired" block={definition} />

          {/* how you operate, per life area: the design equivalent of the astrology life-area guide. */}
          <SectionHead title="how you operate, area by area" />
          <p style={{ fontSize: 14, opacity: 0.6, margin: "0 0 16px", lineHeight: 1.55 }}>
            Who you are is above. This is how that design actually plays out in each part of your life,
            tap any area to open it.
          </p>
          <HumanDesignAreas hd={hd} unlocked />

          {/* centres */}
          <SectionHead title="your centres" />
          <p style={{ fontSize: 14, opacity: 0.6, margin: "0 0 16px", lineHeight: 1.55 }}>
            Defined centres are your consistent, reliable energy, the parts of you that do not change.
            Open centres are where you take in and amplify the world, your places of sensitivity and,
            in time, wisdom.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {hd.definedCenters.map((c) => (
              <CenterRow key={c} label={CENTER_LABELS[c]} theme={CENTER_CONTENT[c].theme} text={CENTER_CONTENT[c].defined} defined />
            ))}
            {hd.openCenters.map((c) => (
              <CenterRow key={c} label={CENTER_LABELS[c]} theme={CENTER_CONTENT[c].theme} text={CENTER_CONTENT[c].open} defined={false} />
            ))}
          </div>

          {/* channels */}
          <SectionHead title={`your channels (${hd.definedChannels.length})`} />
          {hd.definedChannels.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.6 }}>
              You have no fully defined channels, which is the open, reflective wiring of your type.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 14, opacity: 0.6, margin: "0 0 16px", lineHeight: 1.55 }}>
                Channels are your fixed gifts, the talents that are always switched on, no matter what.
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                {hd.definedChannels.map((ch) => (
                  <div key={ch.key} style={card}>
                    <div style={{ fontFamily: poppins, fontWeight: 600, marginBottom: 3 }}>
                      {ch.gates[0]}–{ch.gates[1]} · {ch.name || "Channel"}
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
                      {CHANNEL_GIFT[channelKey(ch.gates[0], ch.gates[1])] ?? ""}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* every gate she carries, explained in full */}
          <HumanDesignGates hd={hd} />

          {/* incarnation cross */}
          <Reading
            title="your life theme"
            block={{
              ...cross,
              meaning: `${cross.meaning} Your cross runs on gates ${hd.incarnationCross.gates.join(", ")}, the two Sun and Earth gates of your Personality and Design.`,
            }}
          />

          {/* technical detail */}
          <SectionHead title="the technical detail" />
          <p style={{ fontSize: 14, opacity: 0.6, margin: "0 0 16px", lineHeight: 1.55 }}>
            The raw activations behind your chart. Personality is your conscious side, the person you
            know yourself to be. Design is your unconscious body, set roughly 88 days before you were
            born.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ActivationTable title="Personality (conscious)" rows={hd.personality} />
            <ActivationTable title="Design (unconscious)" rows={hd.design} />
          </div>

          <p style={{ fontSize: 12, opacity: 0.5, marginTop: 28, lineHeight: 1.6 }}>
            Design chart taken {hd.designUtcTime}, when the Sun was 88° of arc before your birth
            position. Human Design is sensitive to your exact birth time, a few minutes can shift a line
            or a centre. Computed on the same Swiss Ephemeris as your astrology chart.
          </p>
        </>
      ) : (
        <GoDeeperCTA name={hd.birthData.name} />
      )}

      {memberNav && (
        <div style={{ marginTop: 32 }}>
          <Link href="/my-chart" style={linkBtnOutline}>
            &larr; back to my astrology chart
          </Link>
        </div>
      )}
    </Shell>
  );
}

// ── pieces ──────────────────────────────────────────────────────────────────────

// Shown in place of the deep reading for free members and logged-out visitors. Names what sits behind
// the paid gate and sends her to the plans, mirroring the "go deeper" CTA on the free astrology chart.
function GoDeeperCTA({ name }: { name?: string }) {
  const inside = [
    "How your design plays out in money, love, business and confidence, area by area",
    "Every one of your centres, defined and open, read in full",
    "Your channels and all your gates, the fixed gifts you carry",
    "Your incarnation cross, the life theme running underneath it all",
    "Your Human Design and your astrology, woven together across every part of your life",
  ];
  return (
    <div
      style={{
        margin: "40px 0 8px",
        padding: "28px 24px",
        background: "var(--lav-light)",
        border: "var(--border)",
      }}
    >
      <p style={{ ...eyebrow, marginBottom: 8, color: "var(--pink)", opacity: 1 }}>this is the surface</p>
      <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.2, color: "#2E1C63", margin: "0 0 10px" }}>
        {name ? `${name}, go deeper into your design.` : "Go deeper into your design."}
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--dark)", margin: "0 0 16px" }}>
        Your Type, Strategy and Authority above are the front door. The full read is inside MY SZN:
      </p>
      <ul style={{ margin: "0 0 22px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {inside.map((line) => (
          <li key={line} style={{ fontSize: 14, lineHeight: 1.55, color: "var(--dark)", paddingLeft: 22, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: "var(--pink)", fontWeight: 800 }}>✦</span>
            {line}
          </li>
        ))}
      </ul>
      <Link
        href="/membership"
        className="no-underline"
        style={{
          display: "inline-block",
          background: "var(--pink)",
          color: "var(--dark)",
          fontFamily: poppins,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "14px 28px",
        }}
      >
        see the plans
      </Link>
    </div>
  );
}

function Reading({
  title,
  block,
  accent,
}: {
  title: string;
  block: { title: string; intro: string; meaning: string; apply: string };
  accent?: string;
}) {
  return (
    <div style={{ margin: "34px 0" }}>
      <SectionHead title={title} />
      <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 600, margin: "0 0 6px", color: accent ?? "var(--dark)" }}>
        {block.title}
      </p>
      <p style={{ fontSize: 16, fontStyle: "italic", opacity: 0.75, margin: "0 0 14px", lineHeight: 1.5 }}>
        {block.intro}
      </p>
      <p style={{ fontSize: 15.5, lineHeight: 1.65, margin: "0 0 14px" }}>{block.meaning}</p>
      <div style={{ ...card, background: "var(--cream)" }}>
        <div style={{ ...eyebrow, marginBottom: 6 }}>how to work with it</div>
        <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{block.apply}</p>
      </div>
    </div>
  );
}

function DeepSection({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ ...eyebrow, marginBottom: 6, color: "var(--pink)", opacity: 1 }}>{label}</div>
      <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0 }}>{text}</p>
    </div>
  );
}

// A guided reading that opens into the paid 600-word deep dive. The short read shows for everyone; the
// deep dive expands for paid members and shows an unlock prompt to everyone else. Falls back to a
// plain reading when no deep content exists for this element yet.
function ExpandableReading({
  title,
  block,
  accent,
  deep,
  unlocked,
}: {
  title: string;
  block: { title: string; intro: string; meaning: string; apply: string };
  accent?: string;
  deep: HdDeepDive | null;
  unlocked: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: "34px 0" }}>
      <SectionHead title={title} />
      <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 600, margin: "0 0 6px", color: accent ?? "var(--dark)" }}>
        {block.title}
      </p>
      <p style={{ fontSize: 16, fontStyle: "italic", opacity: 0.75, margin: "0 0 14px", lineHeight: 1.5 }}>{block.intro}</p>
      <p style={{ fontSize: 15.5, lineHeight: 1.65, margin: "0 0 14px" }}>{block.meaning}</p>
      <div style={{ ...card, background: "var(--cream)" }}>
        <div style={{ ...eyebrow, marginBottom: 6 }}>how to work with it</div>
        <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{block.apply}</p>
      </div>

      {deep && (
        <div style={{ marginTop: 14 }}>
          {unlocked ? (
            <>
              <button
                onClick={() => setOpen((v) => !v)}
                style={{
                  background: open ? "var(--pink)" : "none",
                  border: "1.5px solid var(--pink)",
                  color: open ? "#fff" : "var(--pink)",
                  fontFamily: poppins,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "10px 18px",
                  cursor: "pointer",
                }}
              >
                {open ? "close the deep dive ▲" : "go deeper into this ▼"}
              </button>
              {open && (
                <div style={{ marginTop: 16, padding: "22px 20px", background: "var(--lav-light)", border: "var(--border)" }}>
                  <DeepSection label="for you" text={deep.forYou} />
                  <DeepSection label="in your business" text={deep.inBusiness} />
                  <DeepSection label="the shadow" text={deep.shadow} />
                  <DeepSection label="how to heal" text={deep.heal} />
                </div>
              )}
            </>
          ) : (
            <Link
              href="/membership"
              className="no-underline"
              style={{
                display: "inline-block",
                border: "1.5px solid var(--pink)",
                color: "var(--pink)",
                fontFamily: poppins,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "10px 18px",
              }}
            >
              ✦ unlock the full breakdown
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function CenterRow({
  label,
  theme,
  text,
  defined,
}: {
  label: string;
  theme: string;
  text: string;
  defined: boolean;
}) {
  return (
    <div style={{ ...card, borderLeft: `3px solid ${defined ? "var(--pink)" : "var(--lav)"}` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
        <span style={{ fontFamily: poppins, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, opacity: 0.5 }}>{theme}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            padding: "2px 8px",
            borderRadius: 999,
            background: defined ? "var(--pink-light)" : "var(--lav-light)",
          }}
        >
          {defined ? "defined" : "open"}
        </span>
      </div>
      <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.55, margin: 0 }}>{text}</p>
    </div>
  );
}

function ActivationTable({
  title,
  rows,
}: {
  title: string;
  rows: { body: string; gate: number; line: number }[];
}) {
  return (
    <div>
      <h3 style={{ fontFamily: poppins, fontSize: 14, margin: "0 0 8px" }}>{title}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.body} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <td style={{ padding: "5px 0", opacity: 0.7 }}>{r.body}</td>
              <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                <strong>
                  {r.gate}.{r.line}
                </strong>{" "}
                <span style={{ opacity: 0.5 }}>{GATE_NAME[r.gate]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "12px 14px" }}>
      <div style={{ ...eyebrow, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: poppins, fontSize: 14.5, fontWeight: 600, lineHeight: 1.25 }}>{value}</div>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <h2 style={{ fontFamily: poppins, fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.55, margin: "34px 0 12px" }}>
      {title}
    </h2>
  );
}

// A plain div, not a <main>: this reading now renders both as a standalone page and inside the
// combined results page, and a nested <main> would be invalid there.
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "var(--font-body, system-ui), sans-serif",
        color: "var(--dark)",
      }}
    >
      {children}
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────

const eyebrow: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: 1.8,
  fontSize: 10.5,
  opacity: 0.5,
};

const statGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10,
};

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 14,
  padding: "14px 16px",
};

const navLink: React.CSSProperties = {
  fontSize: 13,
  textDecoration: "none",
  color: "var(--dark)",
  opacity: 0.65,
};

const linkBtn: React.CSSProperties = {
  display: "inline-block",
  background: "var(--pink)",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
};

const linkBtnOutline: React.CSSProperties = {
  display: "inline-block",
  border: "1px solid rgba(0,0,0,0.2)",
  color: "var(--dark)",
  padding: "10px 18px",
  borderRadius: 999,
  textDecoration: "none",
  fontSize: 14,
};
