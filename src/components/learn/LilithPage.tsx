"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ChartData } from "@/types/chart";
import { HOUSE_MEANINGS, ordinalHouse } from "@/lib/interpretations";
import { lilithPersonalReading } from "@/lib/lilith-reading";
import { lilithSerif } from "@/lib/lilith-font";
import { LilithFamily } from "@/components/learn/LilithFamily";
import { LilithMeditation } from "@/components/learn/LilithMeditation";
import { LilithGlyph, LilithMotionStyles } from "@/components/learn/LilithMotif";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const serif = lilithSerif.style.fontFamily;
const WIDE = 1152;

// The Lilith page is its own world: full-width black and white bands (no narrow centred column),
// one chapter on screen at a time instead of one long scroll, and tap-to-open everything.

type Chapter = "meet" | "play" | "yours" | "four";
const CHAPTERS: { id: Chapter; label: string }[] = [
  { id: "meet", label: "🖤 meet her" },
  { id: "play", label: "🎧 press play" },
  { id: "yours", label: "🔮 your lilith" },
  { id: "four", label: "⚸ all four liliths" },
];

// Betty's "Meet Lilith" copy (15 Nov 2026), word for word on the back of each card.
const MEET: { label: string; teaser: string; body: string }[] = [
  {
    label: "the dark goddess",
    teaser: "Night queen. Sex, power, transformation. Zero apologies.",
    body: "In modern witchcraft, Lilith is honoured as a powerful dark goddess associated with feminine independence, sexuality, transformation and the mysteries of the night. She represents the woman who knows her worth, embraces her desires and refuses to surrender her power. Her energy invites you to reclaim the parts of yourself you've been taught to fear or suppress.",
  },
  {
    label: "the protector & liberator",
    teaser: "Your bodyguard against shame, fear and everyone's opinions.",
    body: "Many contemporary witches work with Lilith for spiritual protection, empowerment, boundary-setting and liberation from shame. Her energy is associated with confronting fear, reclaiming your voice and breaking patterns of submission. She's invoked as a fierce protector of personal sovereignty, encouraging women to trust their instincts, honour their boundaries and stand firmly in their power.",
  },
  {
    label: "working with lilith",
    teaser: "Rituals, shadow work and your chart, babe. This is how you call her in.",
    body: "Working with Lilith can involve goddess invocations, meditation, shadow work, affirmations, ritual and exploring your Black Moon Lilith placement in astrology. Her symbolism encourages you to embrace your ambition, sexuality, independence and desire for financial freedom. She's especially meaningful when you're ready to release limiting beliefs, reclaim your confidence and become the woman who makes her own rules.",
  },
];

const btn = (active: boolean, dark: boolean): React.CSSProperties => ({
  background: active ? "var(--pink)" : "transparent",
  color: active ? "var(--dark)" : dark ? "#fff" : "var(--dark)",
  border: `1.5px solid ${active ? "var(--pink)" : dark ? "rgba(255,255,255,.6)" : "var(--dark)"}`,
  borderRadius: 999,
  padding: "10px 16px",
  fontFamily: poppins,
  fontSize: 12.5,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: "uppercase",
  cursor: "pointer",
  whiteSpace: "nowrap",
});

function Band({ dark, children, id }: { dark?: boolean; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} style={{ background: dark ? "#08070a" : "#fff", color: dark ? "#fff" : "var(--dark)" }}>
      <div style={{ maxWidth: WIDE, margin: "0 auto", padding: "40px 20px" }}>{children}</div>
    </section>
  );
}

function Hero({ sign, house, degree, onGo }: { sign: string; house: number; degree: string; onGo: (c: Chapter) => void }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "#000", color: "#fff" }}>
      <div className="lil-moons" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 24, height: 110, backgroundImage: "url(/lilith/moons.png)", backgroundRepeat: "repeat-x", backgroundSize: "auto 110px", opacity: 0.28 }} />
      <div aria-hidden="true" className="lil-glow" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 40%, rgba(200,180,248,.22), transparent 45%)" }} />
      <div style={{ position: "relative", maxWidth: WIDE, margin: "0 auto", padding: "28px 20px 56px", display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "center" }}>
        <div>
          <Link href="/my-chart" className="no-underline" style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "#fff" }}>
            ← back to my chart
          </Link>
          <p style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--pink)", margin: "28px 0 6px" }}>
            your black moon lilith · {sign.toLowerCase()} · {ordinalHouse(house)} house · {degree}
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: "clamp(72px, 13vw, 132px)", lineHeight: 0.9, letterSpacing: "0.04em", margin: 0 }}>LILITH</h1>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(22px, 3vw, 30px)", lineHeight: 1.2, color: "var(--lav)", margin: "10px 0 14px" }}>
            The dark goddess of power, protection &amp; feminine sovereignty
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.6, margin: "0 0 22px", maxWidth: 520 }}>
            She&apos;s the voice that refuses to be silenced, the freedom that refuses to be surrendered and the darkness that teaches you to reclaim your light. {`Your ${sign} Lilith is where she's been waiting for you, babe. 🖤`}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" style={btn(true, true)} onClick={() => onGo("play")}>🎧 press play</button>
            <button type="button" style={btn(false, true)} onClick={() => onGo("yours")}>🔮 read your lilith</button>
          </div>
        </div>
        <div className="lil-float" style={{ position: "relative", width: "100%", maxWidth: 440, justifySelf: "center", aspectRatio: "4 / 5", borderRadius: 22, overflow: "hidden", boxShadow: "0 0 60px rgba(200,180,248,.25)" }}>
          <Image src="/lilith/lilith-hero.jpg" alt="Lilith under a glitter crescent moon with the Black Moon Lilith glyph on her shoulder" fill priority sizes="(max-width: 700px) 100vw, 440px" style={{ objectFit: "cover" }} />
        </div>
      </div>
    </section>
  );
}

function FlipCard({ c }: { c: (typeof MEET)[number] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="lil-card"
      style={{ textAlign: "left", background: flipped ? "#1d1924" : "#121016", color: "#fff", border: flipped ? "2px solid var(--pink)" : "1.5px solid rgba(255,255,255,.18)", borderRadius: 20, padding: "22px 22px 20px", cursor: "pointer", minHeight: 250, display: "flex", flexDirection: "column", fontFamily: "inherit" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontFamily: poppins, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: "var(--pink)" }}>{c.label}</span>
        <span className="lil-card-glyph"><LilithGlyph size={20} color={flipped ? "#FF2D87" : "#C8B4F8"} strokeWidth={2} /></span>
      </div>
      {flipped ? (
        <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "12px 0 0" }}>{c.body}</p>
      ) : (
        <>
          <p style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.1, margin: "18px 0 0", fontWeight: 500 }}>{c.teaser}</p>
          <span style={{ marginTop: "auto", paddingTop: 18, fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--lav)" }}>tap to meet her →</span>
        </>
      )}
    </button>
  );
}

function MeetHer() {
  const [older, setOlder] = useState(false);
  return (
    <Band dark>
      <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(40px, 6vw, 60px)", lineHeight: 1, margin: "0 0 6px" }}>Meet Lilith</h2>
      <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 24, color: "var(--lav)", margin: "0 0 22px" }}>Goddess of the night, feminine sovereignty and untamed power.</p>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {MEET.map((c) => <FlipCard key={c.label} c={c} />)}
      </div>
      <button type="button" onClick={() => setOlder((o) => !o)} aria-expanded={older} style={{ ...btn(older, true), marginTop: 18 }}>
        📜 her older story {older ? "−" : "+"}
      </button>
      {older && (
        <p style={{ fontSize: 15.5, lineHeight: 1.65, margin: "14px 0 0", maxWidth: 760 }}>
          Long before modern witchcraft, Lilith turns up in ancient Mesopotamian demon lore and in a medieval Jewish text where she refuses to lie beneath Adam and leaves Eden rather than submit. Feminists later reclaimed her as the first woman to say no. Black Moon Lilith, the point in your chart, is a modern astrological idea named in her honour.
        </p>
      )}
    </Band>
  );
}

type Tile = "shamed" | "where" | "money" | "shadow" | "affirm" | "move";

function YourLilith({ chart }: { chart: ChartData }) {
  const mean = chart.liliths?.find((l) => l.id === "lilith") ?? chart.planets.find((p) => p.id === "lilith");
  const [open, setOpen] = useState<Tile | null>("shamed");
  if (!mean) return null;
  const r = lilithPersonalReading(mean.sign, mean.house);
  if (!r) return null;
  const hm = HOUSE_MEANINGS[mean.house - 1];
  const ord = ordinalHouse(mean.house);

  const tiles: { id: Tile; emoji: string; title: string; teaser: string; tone: "pink" | "lav" | "dark" | "white"; body: React.ReactNode }[] = [
    { id: "shamed", emoji: "🖤", title: "what they shamed outta you", teaser: `Your ${mean.sign} Lilith, the part that got called too much.`, tone: "dark", body: <p style={{ margin: 0 }}>{r.shamed}</p> },
    { id: "where", emoji: "🏠", title: `where she's been hiding`, teaser: `Your ${ord} house${hm ? ` of ${hm.title}` : ""}.`, tone: "pink", body: <p style={{ margin: 0 }}>{r.where}</p> },
    { id: "money", emoji: "💸", title: "your lilith money era", teaser: "How she prices, negotiates and leads.", tone: "lav", body: <p style={{ margin: 0 }}>{r.money}</p> },
    {
      id: "shadow", emoji: "🌑", title: "shadow work, babe", teaser: "Three questions written for your placement.", tone: "white",
      body: (
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
          {r.prompts.map((q) => <li key={q} style={{ fontWeight: 700 }}>{q}</li>)}
        </ol>
      ),
    },
    {
      id: "affirm", emoji: "👑", title: "say it like you mean it", teaser: "Your Lilith affirmations.", tone: "pink",
      body: (
        <div style={{ display: "grid", gap: 10 }}>
          {r.affirmations.map((a) => <p key={a} style={{ fontFamily: serif, fontSize: 28, lineHeight: 1.15, margin: 0, fontWeight: 600 }}>&ldquo;{a}&rdquo;</p>)}
        </div>
      ),
    },
    { id: "move", emoji: "🔥", title: "your move this week", teaser: "One real-life step.", tone: "lav", body: <p style={{ margin: 0, fontWeight: 700 }}>{r.step}</p> },
  ];

  const toneStyle = (t: string) =>
    t === "dark" ? { background: "#08070a", color: "#fff" } : t === "pink" ? { background: "var(--pink-light)", color: "var(--dark)" } : t === "lav" ? { background: "var(--lav-light)", color: "var(--dark)" } : { background: "#fff", color: "var(--dark)" };
  const active = tiles.find((t) => t.id === open);

  return (
    <Band>
      <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(40px, 6vw, 60px)", lineHeight: 1, margin: "0 0 6px" }}>
        Your Lilith in <span className="pk">{mean.sign}</span>
      </h2>
      <p style={{ fontFamily: poppins, fontWeight: 700, fontSize: 15, margin: "0 0 20px" }}>
        {ord} house · {mean.formattedDegree} · tap a tile to open it up
      </p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
        {tiles.map((t) => {
          const on = open === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-expanded={on}
              onClick={() => setOpen(on ? null : t.id)}
              className="lil-card"
              style={{ ...toneStyle(t.tone), textAlign: "left", border: on ? "2.5px solid var(--pink)" : "1.5px solid var(--dark)", borderRadius: 18, padding: "16px 16px 14px", cursor: "pointer", fontFamily: "inherit", transform: on ? "translateY(-3px)" : "none", transition: "transform .25s ease" }}
            >
              <div style={{ fontSize: 24 }}>{t.emoji}</div>
              <div style={{ fontFamily: poppins, fontSize: 12.5, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", margin: "8px 0 4px" }}>{t.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.4 }}>{t.teaser}</div>
            </button>
          );
        })}
      </div>
      {active && (
        <div style={{ ...toneStyle(active.tone), marginTop: 14, border: "1.5px solid var(--dark)", borderRadius: 20, padding: "22px 22px", fontSize: 16.5, lineHeight: 1.65 }}>
          <div style={{ fontFamily: poppins, fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10, color: active.tone === "dark" ? "var(--pink)" : "var(--dark)" }}>
            {active.emoji} {active.title}
          </div>
          {active.body}
          {active.id === "shadow" && (
            <Link href="/journal" className="no-underline" style={{ display: "inline-block", marginTop: 14, fontWeight: 700, color: "var(--dark)" }}>journal on this →</Link>
          )}
        </div>
      )}
    </Band>
  );
}

export function LilithPage({ chart, isAdmin }: { chart: ChartData; isAdmin: boolean }) {
  const [chapter, setChapter] = useState<Chapter>("meet");
  const navRef = useRef<HTMLDivElement>(null);
  const mean = chart.liliths?.find((l) => l.id === "lilith") ?? chart.planets.find((p) => p.id === "lilith");
  if (!mean) return null;

  const go = (c: Chapter) => {
    setChapter(c);
    requestAnimationFrame(() => navRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className={lilithSerif.className} style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", background: "#fff" }}>
      <LilithMotionStyles />
      <Hero sign={mean.sign} house={mean.house} degree={mean.formattedDegree} onGo={go} />

      {/* Chapter switcher: one chapter on screen at a time, sticky so it's always one tap away */}
      <div ref={navRef} style={{ position: "sticky", top: 0, zIndex: 20, background: "#08070a", borderTop: "1px solid rgba(255,255,255,.12)", borderBottom: "1px solid rgba(255,255,255,.12)", scrollMarginTop: 0 }}>
        <div role="tablist" style={{ maxWidth: WIDE, margin: "0 auto", padding: "12px 20px", display: "flex", gap: 8, overflowX: "auto" }}>
          {CHAPTERS.map((c) => (
            <button key={c.id} type="button" role="tab" aria-selected={chapter === c.id} style={btn(chapter === c.id, true)} onClick={() => go(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {chapter === "meet" && <MeetHer />}
      {chapter === "play" && (
        <Band>
          <LilithMeditation chart={chart} isAdmin={isAdmin} />
        </Band>
      )}
      {chapter === "yours" && <YourLilith chart={chart} />}
      {chapter === "four" && (
        <Band>
          <LilithFamily chart={chart} />
        </Band>
      )}

      {/* Next-chapter nudge so nobody hits a dead end */}
      <Band dark>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 26, margin: 0 }}>She was never the problem, babe. 🖤</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {CHAPTERS.filter((c) => c.id !== chapter).map((c) => (
              <button key={c.id} type="button" style={btn(false, true)} onClick={() => go(c.id)}>{c.label} →</button>
            ))}
          </div>
        </div>
      </Band>
    </div>
  );
}
