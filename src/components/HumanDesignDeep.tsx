"use client";

import Link from "next/link";
import HumanDesignProfileLines from "@/components/HumanDesignProfileLines";
import { CENTER_LABELS, GATE_NAME } from "@/lib/human-design-constants";
import {
  TYPE_CONTENT,
  AUTHORITY_CONTENT,
  PROFILE_CONTENT,
  DEFINITION_CONTENT,
  CROSS_ANGLE_CONTENT,
} from "@/lib/human-design-content";
import type { HumanDesignData } from "@/types/human-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export type DeepTopic = "type" | "authority" | "profile" | "definition" | "cross";

export const DEEP_TOPICS: DeepTopic[] = ["type", "authority", "profile", "definition", "cross"];

// A dedicated deep page for one element of the chart, the Human Design equivalent of an
// individual astrology placement page: the element opens into its own full reading rather
// than a one-line card on the chart. Reused by the gated /human-design/[topic] route.
export default function HumanDesignDeep({ hd, topic }: { hd: HumanDesignData; topic: DeepTopic }) {
  return (
    <main style={shell}>
      <Link href="/human-design" style={back}>&larr; your human design chart</Link>
      {topic === "type" && <TypeDeep hd={hd} />}
      {topic === "authority" && <AuthorityDeep hd={hd} />}
      {topic === "profile" && <ProfileDeep hd={hd} />}
      {topic === "definition" && <DefinitionDeep hd={hd} />}
      {topic === "cross" && <CrossDeep hd={hd} />}
      <div style={{ marginTop: 36 }}>
        <Link href="/human-design" style={backBtn}>&larr; back to your chart</Link>
      </div>
    </main>
  );
}

function TypeDeep({ hd }: { hd: HumanDesignData }) {
  const c = TYPE_CONTENT[hd.type];
  return (
    <>
      <Hero eyebrow="your type" title={hd.type} subtitle={c.title} intro={c.intro} />
      <Section label="what your type means">{c.meaning}</Section>
      <Section label="your strategy">
        {`Your strategy is to ${hd.strategy.toLowerCase()}. ${c.apply}`}
      </Section>
      <Callout label="living it right">
        {`Aligned, it feels like ${hd.signature.toLowerCase()}. Off track, the tell is ${hd.notSelfTheme.toLowerCase()}, and that is your cue to course-correct back to your strategy.`}
      </Callout>
    </>
  );
}

function AuthorityDeep({ hd }: { hd: HumanDesignData }) {
  const c = AUTHORITY_CONTENT[hd.authority];
  return (
    <>
      <Hero eyebrow="how you make decisions" title={hd.authorityLabel} subtitle={c.title} intro={c.intro} />
      <Section label="what your authority means">{c.meaning}</Section>
      <Callout label="how to actually decide">{c.apply}</Callout>
      <Section label="why this matters most">
        This is the single most practical thing your design gives you. Every regret you can trace back
        to a decision made the wrong way for you, and every aligned life is built on decisions made
        this way, over and over.
      </Section>
    </>
  );
}

function ProfileDeep({ hd }: { hd: HumanDesignData }) {
  const c = PROFILE_CONTENT[hd.profile];
  return (
    <>
      <Hero eyebrow="your profile" title={hd.profile} subtitle={c?.title ?? ""} intro={c?.intro ?? ""} />
      {c && <Section label="what your profile means">{c.meaning}</Section>}
      {c && <Callout label="how to work with it">{c.apply}</Callout>}
      <HumanDesignProfileLines profile={hd.profile} />
    </>
  );
}

function DefinitionDeep({ hd }: { hd: HumanDesignData }) {
  const c = DEFINITION_CONTENT[hd.definition];
  return (
    <>
      <Hero eyebrow="how your energy is wired" title={hd.definition} subtitle={c.title} intro={c.intro} />
      <Section label="what your definition means">{c.meaning}</Section>
      <Callout label="how to work with it">{c.apply}</Callout>
      <Section label="your defined centres">
        {`The centres wired together in you are ${hd.definedCenters.map((k) => CENTER_LABELS[k]).join(", ")}. Those are your consistent, always-on energy. Everything else is open, where you take the world in.`}
      </Section>
    </>
  );
}

function CrossDeep({ hd }: { hd: HumanDesignData }) {
  const c = CROSS_ANGLE_CONTENT[hd.incarnationCross.angle];
  const gates = hd.incarnationCross.gates;
  return (
    <>
      <Hero eyebrow="your life theme" title={hd.incarnationCross.angle} subtitle={`gates ${gates.join("/")}`} intro={c.intro} />
      <Section label="what your cross means">{c.meaning}</Section>
      <Callout label="how to live it">{c.apply}</Callout>
      <Section label="the four gates of your cross">
        {`Your cross runs on gates ${gates.join(", ")}: your Personality Sun (${gates[0]}, ${GATE_NAME[gates[0]]?.toLowerCase()}) and Earth (${gates[1]}, ${GATE_NAME[gates[1]]?.toLowerCase()}), and your Design Sun (${gates[2]}, ${GATE_NAME[gates[2]]?.toLowerCase()}) and Earth (${gates[3]}, ${GATE_NAME[gates[3]]?.toLowerCase()}). Together they are the through-line of what you are here to do.`}
      </Section>
    </>
  );
}

// ── shared pieces ───────────────────────────────────────────────────────────────

function Hero({ eyebrow, title, subtitle, intro }: { eyebrow: string; title: string; subtitle: string; intro: string }) {
  return (
    <div style={{ background: "var(--dark)", color: "#fff", borderRadius: 20, padding: "34px 28px", margin: "18px 0 20px" }}>
      <p style={{ ...eyebrowStyle, color: "var(--lav)", opacity: 1 }}>{eyebrow}</p>
      <h1 style={{ fontFamily: poppins, fontSize: 40, fontWeight: 800, lineHeight: 1.04, margin: "8px 0 4px" }}>{title}</h1>
      {subtitle && <p style={{ fontFamily: poppins, fontSize: 17, opacity: 0.85, margin: "0 0 12px" }}>{subtitle}</p>}
      {intro && <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, opacity: 0.9 }}>{intro}</p>}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: "26px 0" }}>
      <div style={{ ...eyebrowStyle, marginBottom: 10, opacity: 0.55 }}>{label}</div>
      <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--cream)", borderLeft: "3px solid var(--pink)", borderRadius: "0 14px 14px 0", padding: "18px 20px", margin: "26px 0" }}>
      <div style={{ ...eyebrowStyle, color: "var(--pink)", opacity: 0.9, marginBottom: 8 }}>{label}</div>
      <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0 }}>{children}</p>
    </div>
  );
}

const shell: React.CSSProperties = { maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px", fontFamily: "var(--font-body, system-ui), sans-serif", color: "var(--dark)" };
const eyebrowStyle: React.CSSProperties = { textTransform: "uppercase", letterSpacing: 1.8, fontSize: 10.5, opacity: 0.5, fontWeight: 700 };
const back: React.CSSProperties = { fontSize: 13, textDecoration: "none", color: "var(--dark)", opacity: 0.6 };
const backBtn: React.CSSProperties = { display: "inline-block", border: "1px solid rgba(0,0,0,0.2)", color: "var(--dark)", padding: "10px 18px", borderRadius: 999, textDecoration: "none", fontSize: 14 };
