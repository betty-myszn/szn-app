"use client";

import Link from "next/link";
import { useHumanDesign } from "@/lib/use-human-design";
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
import type { HumanDesignData } from "@/types/human-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The Human Design chart as a guided reading: every element leads with what it
// means for you and how to apply it, mirroring how the astrology chart reads. The
// raw technical activations sit at the bottom for those who want them.

export default function HumanDesignPage() {
  const { hd, loading } = useHumanDesign();

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
        <Link href="/settings" style={linkBtn}>
          add your birth details
        </Link>
      </Shell>
    );
  }

  const type = TYPE_CONTENT[hd.type];
  const authority = AUTHORITY_CONTENT[hd.authority];
  const profile = PROFILE_CONTENT[hd.profile];
  const definition = DEFINITION_CONTENT[hd.definition];
  const cross = CROSS_ANGLE_CONTENT[hd.incarnationCross.angle];

  return (
    <Shell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Link href="/my-chart" style={navLink}>
          &larr; my astrology chart
        </Link>
        <span style={{ ...navLink, opacity: 0.4 }}>human design</span>
      </div>

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

      {/* the guided reading */}
      <Reading title="your type" block={type} />

      <Reading title="how you make decisions" block={authority} accent="var(--pink)" />

      {profile && <Reading title="your profile" block={profile} />}

      <Reading title="how your energy is wired" block={definition} />

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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <ActivationTable title="Personality (conscious)" rows={hd.personality} />
        <ActivationTable title="Design (unconscious)" rows={hd.design} />
      </div>

      <p style={{ fontSize: 12, opacity: 0.5, marginTop: 28, lineHeight: 1.6 }}>
        Design chart taken {hd.designUtcTime}, when the Sun was 88° of arc before your birth
        position. Human Design is sensitive to your exact birth time, a few minutes can shift a line
        or a centre. Computed on the same Swiss Ephemeris as your astrology chart.
      </p>

      <div style={{ marginTop: 32 }}>
        <Link href="/my-chart" style={linkBtnOutline}>
          &larr; back to my astrology chart
        </Link>
      </div>
    </Shell>
  );
}

// ── pieces ──────────────────────────────────────────────────────────────────────

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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "var(--font-body, system-ui), sans-serif",
        color: "var(--dark)",
      }}
    >
      {children}
    </main>
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
