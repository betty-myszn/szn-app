"use client";

import { useState } from "react";
import Link from "next/link";
import { useSeasonDesign } from "@/lib/use-season-design";
import type { SeasonBlock } from "@/types/season-design";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The season x Human Design reading as it appears inside the dashboard scroll.
//
// This used to render the full 16-section reading inline, which on its own ran longer than the
// rest of the dashboard put together. It is now a compact block in the season HQ language: the
// four facts that matter, the one line that lands, then everything else folded into collapsed
// rows. Nothing was cut, it is all one tap away, and the whole reading still has its own page at
// /your-season/human-design for anyone who wants the long read.
//
// Renders nothing until the reading is ready, or if the season has no Human Design definition
// yet, so it can never break the dashboard for a member without birth data.
export default function SeasonDesignInline() {
  const { reading, loading, unavailable } = useSeasonDesign();
  const [open, setOpen] = useState<string | null>(null);

  if (loading || unavailable || !reading) return null;
  const r = reading;
  const sign = r.season.sign.toLowerCase();
  const toggle = (k: string) => setOpen((cur) => (cur === k ? null : k));

  return (
    <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="tag mb-2">astrology + human design</div>
        <h2
          style={{
            fontFamily: pp,
            fontWeight: 800,
            fontSize: 30,
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            textTransform: "lowercase",
            margin: "0 0 18px",
          }}
        >
          how your energy works with {sign} season
        </h2>

        {/* the four facts worth seeing without a tap */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {[
            ["type", r.snapshot.type],
            ["strategy", r.snapshot.strategy],
            ["authority", r.snapshot.authorityLabel],
            ["profile", r.snapshot.profile],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: "var(--pink-bg)",
                border: "2px solid #FFC2DE",
                borderRadius: 14,
                padding: "12px 16px",
              }}
            >
              <div style={eyebrow}>{label}</div>
              <div style={{ fontFamily: pp, fontWeight: 700, fontSize: 15, lineHeight: 1.25, marginTop: 4 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* the single line that does the most work */}
        <div
          style={{
            background: "var(--lav-light)",
            border: "2px solid var(--lav)",
            borderRadius: 18,
            padding: "18px 22px",
            marginBottom: 18,
          }}
        >
          <div style={eyebrow}>your {r.snapshot.type.toLowerCase()} energy in {sign} szn</div>
          <p style={{ margin: "6px 0 0", fontFamily: pp, fontWeight: 600, fontSize: 18, lineHeight: 1.4 }}>
            {r.snapshot.typeLens.summary}
          </p>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <Row k="design" label="your design, in full" open={open} onToggle={toggle}>
            <StatRow
              items={[
                ["definition", r.snapshot.definition],
                ["cross", r.snapshot.incarnationCross],
                ["signature", r.snapshot.signature],
                ["not-self", r.snapshot.notSelfTheme],
              ]}
            />
            <Block title={`your type: ${r.snapshot.type}`} block={r.snapshot.typeLens} />
            <Block title={r.authority.title} block={r.authority.block} />
            <Block title={`${r.profile.code} · ${r.profile.name}`} block={r.profile.block} />
          </Row>

          <Row k="asks" label={`what ${sign} season asks of you`} open={open} onToggle={toggle}>
            <ul style={{ margin: "0 0 14px", paddingLeft: 18, display: "grid", gap: 8 }}>
              {r.strategy.bullets.map((b, i) => (
                <li key={i} style={{ fontSize: 15, lineHeight: 1.55 }}>{b}</li>
              ))}
            </ul>
            {r.gates.permanent.length > 0 && (
              <>
                <Sub>your own gates, amplified</Sub>
                {r.gates.permanent.map((g) => (
                  <Gate key={g.gate} name={`Gate ${g.gate} · ${g.name}`} keynote={g.keynote} shadow={g.shadow} gift={g.gift} />
                ))}
              </>
            )}
            {r.gates.temporary.length > 0 && (
              <>
                <Sub>borrowed {sign} gates, just for the season</Sub>
                {r.gates.temporary.map((g) => (
                  <Gate key={g.gate} name={`Gate ${g.gate} · ${g.name}`} keynote={g.keynote} shadow={g.shadow} gift={g.gift} />
                ))}
              </>
            )}
            <Sub>channels forming</Sub>
            {r.channelsForming.length === 0 ? (
              <p style={body}>
                No new channels complete for you this season. Your fixed gifts stay steady, and the
                season works through the gates instead.
              </p>
            ) : (
              r.channelsForming.map((ch) => (
                <div key={ch.key} style={innerCard}>
                  <div style={{ fontFamily: pp, fontWeight: 600, marginBottom: 3 }}>
                    {ch.natalGate}&ndash;{ch.seasonalGate} · {ch.name}
                  </div>
                  <p style={body}>{ch.text}</p>
                </div>
              ))
            )}
          </Row>

          <Row k="centres" label="your centres this season" open={open} onToggle={toggle}>
            <p style={{ ...body, marginBottom: 12 }}>
              Defined centres are your consistent energy. Open centres are where you take in the world.
            </p>
            {r.centres.map((c) => (
              <div
                key={c.key}
                style={{
                  ...innerCard,
                  borderLeft: `3px solid ${c.state === "defined" ? "var(--pink)" : "var(--lav)"}`,
                }}
              >
                <div style={{ fontFamily: pp, fontWeight: 600, marginBottom: 3 }}>
                  {c.label}{" "}
                  <span style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>
                    {c.state}
                  </span>
                </div>
                <p style={body}>{c.block.summary}</p>
              </div>
            ))}
          </Row>

          <Row k="life" label="purpose, business, love + money" open={open} onToggle={toggle}>
            <Block
              title={`${r.incarnationCross.angle} · ${r.incarnationCross.gates.join("/")}`}
              block={r.incarnationCross.block}
            />
            <Block title="business" block={r.business} />
            <Block title="relationships" block={r.relationships} />
            <Block title="money" block={r.money} />
          </Row>

          <Row k="shadow" label="the shadow work + practice" open={open} onToggle={toggle}>
            <p style={{ ...body, marginBottom: 12 }}>{r.shadow.intro}</p>
            {r.shadow.items.length === 0 ? (
              <p style={body}>
                You have no open centres, which is rare. Your conditioning shows up less through the
                centres and more through your profile and strategy this season.
              </p>
            ) : (
              r.shadow.items.map((s) => (
                <div key={s.centre} style={{ ...innerCard, borderLeft: "3px solid var(--lav)" }}>
                  <div style={{ fontFamily: pp, fontWeight: 600, marginBottom: 3 }}>
                    {s.centre} <span style={{ fontSize: 11, opacity: 0.5 }}>(open)</span>
                  </div>
                  <p style={body}>{s.text}</p>
                </div>
              ))
            )}
            <Sub>eft &amp; somatic practice</Sub>
            {([
              ["tapping", r.practices.tapping],
              ["breathwork", r.practices.breathwork],
              ["journal prompt", r.practices.journal],
              ["nervous system reset", r.practices.reset],
            ] as const).map(([label, text]) => (
              <div key={label} style={innerCard}>
                <div style={eyebrow}>{label}</div>
                <p style={{ ...body, marginTop: 4 }}>{text}</p>
              </div>
            ))}
            <div style={{ ...innerCard, background: "var(--lav-light)", border: "2px solid var(--lav)" }}>
              <div style={eyebrow}>your affirmation</div>
              <p style={{ margin: "5px 0 0", fontFamily: pp, fontWeight: 600, fontSize: 16, lineHeight: 1.4 }}>
                {r.affirmation}
              </p>
            </div>
          </Row>

          <Row k="weekly" label="your challenge + weekly check-in" open={open} onToggle={toggle}>
            <div style={{ ...innerCard, background: "var(--mint)", border: "2px solid #BFE8D8" }}>
              <div style={eyebrow}>your {sign} season challenge</div>
              <p style={{ margin: "5px 0 0", fontFamily: pp, fontWeight: 600, fontSize: 17, lineHeight: 1.4 }}>
                {r.challenge}
              </p>
            </div>
            <Sub>come back to these each week</Sub>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
              {r.weekly.map((q, i) => (
                <li key={i} style={{ fontSize: 15, lineHeight: 1.55 }}>{q}</li>
              ))}
            </ul>
          </Row>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link
            href="/your-season/human-design"
            className="no-underline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: pp,
              fontWeight: 700,
              fontSize: 14,
              color: "var(--dark)",
              background: "#fff",
              border: "2px solid var(--dark)",
              borderRadius: 40,
              padding: "10px 20px",
            }}
          >
            read the full {sign} szn design read <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── pieces ──────────────────────────────────────────────────────────────────────

function Row({
  k,
  label,
  open,
  onToggle,
  children,
}: {
  k: string;
  label: string;
  open: string | null;
  onToggle: (k: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = open === k;
  return (
    <div style={{ border: "2px solid var(--dark)", borderRadius: 14, background: "#fff", overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => onToggle(k)}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "15px 18px",
          background: isOpen ? "var(--pink-bg)" : "#fff",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: pp,
          fontWeight: 700,
          fontSize: 16,
          textTransform: "lowercase",
          color: "var(--dark)",
        }}
      >
        {label}
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            fontSize: 20,
            lineHeight: 1,
            color: "var(--pink)",
            transform: isOpen ? "rotate(45deg)" : "none",
            transition: "transform 0.18s",
          }}
        >
          +
        </span>
      </button>
      {isOpen && <div style={{ padding: "4px 18px 18px" }}>{children}</div>}
    </div>
  );
}

// Collapsed the reading showed a summary and hid three layers behind another tap. Inside a row
// that is a tap too many, so the layers are just laid out.
function Block({ title, block }: { title: string; block: SeasonBlock }) {
  return (
    <div style={innerCard}>
      <div style={{ fontFamily: pp, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
      <p style={{ ...body, fontWeight: 600, marginBottom: 8 }}>{block.summary}</p>
      {([
        ["who you are here", block.identity],
        ["how the season moves it", block.cycle],
        ["what to do", block.guidance],
      ] as const).map(([label, text]) => (
        <div key={label} style={{ marginTop: 8 }}>
          <div style={eyebrow}>{label}</div>
          <p style={{ ...body, marginTop: 3 }}>{text}</p>
        </div>
      ))}
    </div>
  );
}

function Gate({ name, keynote, shadow, gift }: { name: string; keynote: string; shadow: string; gift: string }) {
  return (
    <div style={innerCard}>
      <div style={{ fontFamily: pp, fontWeight: 600, marginBottom: 3 }}>{name}</div>
      <p style={body}>{keynote}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        <span style={{ ...pill, background: "var(--lav-light)" }}>shadow: {shadow}</span>
        <span style={{ ...pill, background: "var(--pink-bg)" }}>gift: {gift}</span>
      </div>
    </div>
  );
}

function StatRow({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 12 }}>
      {items.map(([label, value]) => (
        <div key={label} style={{ background: "var(--cream)", border: "2px solid #EFE2D2", borderRadius: 12, padding: "10px 14px" }}>
          <div style={eyebrow}>{label}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, lineHeight: 1.3 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...eyebrow, margin: "16px 0 8px", opacity: 0.85 }}>{children}</div>
  );
}

const eyebrow: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--pink)",
};

const body: React.CSSProperties = {
  margin: 0,
  fontSize: 14.5,
  lineHeight: 1.6,
  opacity: 0.85,
};

const innerCard: React.CSSProperties = {
  background: "#fff",
  border: "2px solid #EDEDF2",
  borderRadius: 12,
  padding: "14px 16px",
  marginBottom: 10,
};

const pill: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: 40,
};
