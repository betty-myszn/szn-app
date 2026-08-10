"use client";

import { LINE_CONTENT } from "@/lib/human-design-line-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Breaks a profile (e.g. "4/6") into its two lines and explains each on its own: the
// first number is the conscious (Personality) line, the second the unconscious
// (Design) line. Self-contained so the chart page only drops in one component.
export default function HumanDesignProfileLines({ profile }: { profile: string }) {
  const [consciousLine, unconsciousLine] = profile.split("/").map((n) => parseInt(n, 10));
  const conscious = LINE_CONTENT[consciousLine];
  const unconscious = LINE_CONTENT[unconsciousLine];
  if (!conscious || !unconscious) return null;

  return (
    <div>
      <h2 style={{ fontFamily: poppins, fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.55, margin: "34px 0 12px" }}>
        your two profile lines
      </h2>
      <p style={{ fontSize: 14, opacity: 0.6, margin: "0 0 16px", lineHeight: 1.55 }}>
        Your profile is <strong>{profile}</strong>. The first number is your conscious line, the part
        of you you know you are playing. The second is your unconscious line, the part your body runs
        underneath without you noticing. Together they are how you are here to meet the world.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <LineCard tag="conscious" line={consciousLine} name={conscious.name} body={conscious.body} accent="var(--pink)" />
        <LineCard tag="unconscious" line={unconsciousLine} name={unconscious.name} body={unconscious.body} accent="var(--lav)" />
      </div>
    </div>
  );
}

function LineCard({
  tag,
  line,
  name,
  body,
  accent,
}: {
  tag: string;
  line: number;
  name: string;
  body: string;
  accent: string;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderLeft: `3px solid ${accent}`, borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: poppins, fontWeight: 800, color: "#fff", background: "var(--dark)", borderRadius: 999, width: 30, height: 30, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
          {line}
        </span>
        <span style={{ fontFamily: poppins, fontWeight: 600, fontSize: 15.5 }}>{name}</span>
        <span style={{ marginLeft: "auto", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, opacity: 0.55 }}>{tag}</span>
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>{body}</p>
    </div>
  );
}
