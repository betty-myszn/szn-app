"use client";

import Link from "next/link";
import { useState } from "react";
import Ticker from "@/components/Ticker";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import ChartWheel from "@/components/ChartWheel";
import { BODY_MEANINGS, HOUSE_MEANINGS, interpretAspect, ordinalHouse } from "@/lib/interpretations";
import { PLANET_SYMBOLS } from "@/types/chart";
import { getSymbol } from "@/lib/style-data";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const SYNTHESIS_PAGES = [
  { slug: "personality", title: "personality overview", desc: "who you are, in one deeply accurate read", bg: "var(--pink)", light: true },
  { slug: "main-character", title: "main character energy", desc: "how you're designed to be magnetic and unforgettable", bg: "var(--dark)", light: true },
  { slug: "career", title: "career", desc: "your professional superpowers and ideal path", bg: "#fff", light: false },
  { slug: "money", title: "money", desc: "your wealth codes and receiving style", bg: "var(--gold)", light: false },
  { slug: "love", title: "love & relationships", desc: "how you love and what you need back", bg: "var(--lav-light)", light: false },
  { slug: "healing", title: "healing & shadow work", desc: "your core wound, your patterns, and what integration actually looks like", bg: "var(--dark)", light: true },
  { slug: "power", title: "stepping into your power", desc: "lilith, pluto, mars and saturn, read as one power source", bg: "#fff", light: false },
  { slug: "purpose", title: "soul expression & purpose", desc: "why you're actually here, beyond the job title", bg: "var(--mint)", light: false },
];

// The three placements a beginner actually cares about, in plain English.
const BIG_THREE = [
  { id: "sun", label: "sun", glyph: "☉", role: "your identity" },
  { id: "moon", label: "moon", glyph: "☽", role: "your emotions" },
  { id: "rising", label: "rising", glyph: "↑", role: "how people experience you" },
] as const;

export default function MyChartPage() {
  const router = useRouter();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  // Shared highlight between the big-three cards and the wheel
  const [activeBody, setActiveBody] = useState<string | null>(null);

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            your chart is waiting inside.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (!loading && !chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            let&apos;s calculate your chart.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            Add your birth details and your entire personalised portal unlocks, placements, houses, aspects, all of it.
          </p>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  if (loading || !chart) {
    return (
      <div className="flex items-center justify-center py-32">
        <div
          className="h-10 w-10 animate-spin rounded-full"
          style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const risingSign = chart.houses[0]?.sign || "";
  const midheavenSign = chart.houses[9]?.sign || "";

  // All 17 placements: rising + midheaven derived from angles, the rest from planets
  const placements = BODY_MEANINGS.map((body) => {
    if (body.id === "rising") return { body, sign: risingSign, house: 1, retrograde: false, degree: chart.houses[0]?.degree ?? 0, minute: chart.houses[0]?.minute ?? 0 };
    if (body.id === "midheaven") return { body, sign: midheavenSign, house: 10, retrograde: false, degree: chart.houses[9]?.degree ?? 0, minute: chart.houses[9]?.minute ?? 0 };
    const planet = chart.planets.find((p) => p.id === body.id);
    return planet ? { body, sign: planet.sign, house: planet.house, retrograde: planet.retrograde, degree: planet.degree, minute: planet.minute } : null;
  }).filter(Boolean) as { body: (typeof BODY_MEANINGS)[number]; sign: string; house: number; retrograde: boolean; degree: number; minute: number }[];

  return (
    <>
      <Ticker
        variant="lav"
        items={["your whole chart, decoded", "the blueprint of you", "awareness to embodiment", "read it, live it"]}
      />
      {/* Hero: your big three first, the wheel beside it as the visual */}
      <section className="px-5 md:px-8 py-12" style={{ background: "var(--dark)", borderBottom: "2px solid var(--pink)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="tag">my chart · your big three</div>
              <Link
                href="/onboarding"
                className="no-underline"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--lav)",
                  borderBottom: "1.5px solid var(--lav)",
                  paddingBottom: 2,
                }}
              >
                chart looks wrong? edit it →
              </Link>
            </div>
            <h1
              style={{
                fontFamily: poppins,
                fontSize: "clamp(30px, 4.4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.08,
                color: "#fff",
                marginBottom: 20,
              }}
            >
              start here. this is <span className="pk">you.</span>
            </h1>

            <div className="flex flex-col gap-3">
              {BIG_THREE.map((b) => {
                const p = placements.find((x) => x.body.id === b.id);
                if (!p) return null;
                return (
                  <Link
                    key={b.id}
                    href={`/my-chart/${b.id}`}
                    className={`big3 no-underline${activeBody === b.id ? " is-active" : ""}`}
                    style={{ color: "#fff" }}
                    onMouseEnter={() => setActiveBody(b.id)}
                    onMouseLeave={() => setActiveBody(null)}
                    onFocus={() => setActiveBody(b.id)}
                    onBlur={() => setActiveBody(null)}
                  >
                    <span className="big3-glyph" aria-hidden>
                      {b.glyph}
                    </span>
                    <span>
                      <span
                        style={{
                          display: "block",
                          fontFamily: poppins,
                          fontSize: 21,
                          fontWeight: 800,
                          letterSpacing: "-0.4px",
                          lineHeight: 1.2,
                        }}
                      >
                        {p.sign.toLowerCase()} {b.label}
                      </span>
                      <span style={{ display: "block", fontSize: 12.5, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>
                        {b.role}
                      </span>
                    </span>
                    <span className="big3-arrow" aria-hidden>
                      &#8594;
                    </span>
                  </Link>
                );
              })}
            </div>

            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 460, marginTop: 20 }}>
              These three run the show. Everything else in your chart adds detail on top. When you&apos;re ready for the
              rest, the wheel is the whole sky the moment you arrived, hover or tap any planet to see what it is.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div style={{ width: "100%", maxWidth: 580 }}>
              <ChartWheel
                chart={chart}
                activeId={activeBody}
                onActiveChange={setActiveBody}
                onSelectPlanet={(id) => router.push(`/my-chart/${id}`)}
              />
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginTop: 14,
              }}
            >
              placidus · tap a planet, tap again to read it
            </div>
          </div>
        </div>
      </section>

      {/* Synthesis pages */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "2px solid var(--pink)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-5">your full-chart readings</div>
          <div className="grid md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
            {SYNTHESIS_PAGES.map((page, i) => (
              <Link
                key={page.slug}
                href={`/my-chart/${page.slug}`}
                className="no-underline p-6 transition-opacity hover:opacity-90"
                style={{
                  background: page.bg,
                  borderRight: (i + 1) % 4 !== 0 && i < SYNTHESIS_PAGES.length - 1 ? "var(--border)" : undefined,
                  borderBottom: Math.floor(i / 4) < Math.floor((SYNTHESIS_PAGES.length - 1) / 4) ? "var(--border)" : undefined,
                  color: page.light ? "#fff" : "var(--dark)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 6 }}>
                  {page.title}
                </h3>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: page.light ? "rgba(255,255,255,0.7)" : "var(--grey)" }}>
                  {page.desc}
                </p>
                <span
                  className="inline-block self-start"
                  style={{
                    marginTop: "auto",
                    paddingTop: 16,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: poppins,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "9px 16px",
                      background: page.bg === "var(--pink)" ? "#fff" : "var(--pink)",
                      color: "var(--dark)",
                    }}
                  >
                    read your reading &#8594;
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Placements grid */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "2px solid var(--pink)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-5">my placements · tap to explore</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
            {placements.map((p, i) => (
              <Link
                key={p.body.id}
                href={`/my-chart/${p.body.id}`}
                className="no-underline p-5 hover:bg-[#fafafa] transition-colors"
                style={{
                  color: "var(--dark)",
                  borderRight: "1px solid #eee",
                  borderBottom: i < placements.length - 4 ? "1px solid #eee" : undefined,
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 6, color: "var(--pink)" }}>
                  {PLANET_SYMBOLS[p.body.name] || getSymbol(p.sign)}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 3 }}>
                  {p.body.name.toLowerCase()} · {p.body.title}
                </div>
                <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, letterSpacing: "-0.3px" }}>
                  {p.sign.toLowerCase()}
                  {p.retrograde && <span style={{ color: "var(--pink)", fontSize: 10, marginLeft: 5 }}>Rx</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 2 }}>
                  {p.degree}&deg;{String(p.minute).padStart(2, "0")}&apos; · {ordinalHouse(p.house)} house
                </div>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    fontFamily: poppins,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "6px 12px",
                    background: "var(--pink)",
                    color: "var(--dark)",
                  }}
                >
                  read &#8594;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Houses */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "2px solid var(--pink)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-5">my houses · your 12 life arenas</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
            {chart.houses.map((h, i) => {
              const meaning = HOUSE_MEANINGS[i];
              const planetsInside = chart.planets.filter((p) => p.house === h.house);
              return (
                <Link
                  key={h.house}
                  href={`/my-chart/house/${h.house}`}
                  className="no-underline p-5 hover:bg-[#fafafa] transition-colors"
                  style={{
                    color: "var(--dark)",
                    borderRight: "1px solid #eee",
                    borderBottom: i < 8 ? "1px solid #eee" : undefined,
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 3 }}>
                    {ordinalHouse(h.house)} house
                  </div>
                  <div style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 3 }}>
                    {meaning.title}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--grey)" }}>
                    {getSymbol(h.sign)} {h.sign.toLowerCase()} {h.degree}&deg;{String(h.minute).padStart(2, "0")}&apos; cusp
                    {planetsInside.length > 0 && (
                      <span style={{ color: "var(--pink)", marginLeft: 6 }}>
                        {planetsInside.map((p) => PLANET_SYMBOLS[p.name] || "•").join(" ")}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 12,
                      fontFamily: poppins,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "6px 12px",
                      background: "var(--pink)",
                      color: "var(--dark)",
                    }}
                  >
                    read &#8594;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Aspects in plain English */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">my aspects · how your planets talk to each other</div>
          <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
            {chart.aspects.slice(0, 12).map((a, i) => {
              const signOf = (name: string) =>
                name === "Ascendant" ? chart.houses[0]?.sign : name === "Midheaven" ? chart.houses[9]?.sign : chart.planets.find((p) => p.name === name)?.sign;
              const text = interpretAspect(a.planet1, a.planet2, a.type, { sign1: signOf(a.planet1), sign2: signOf(a.planet2), orb: a.orb });
              if (!text) return null;
              return (
                <div key={`${a.planet1}-${a.planet2}-${i}`} className="p-6" style={{ borderBottom: i < 11 ? "1px solid #eee" : undefined }}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, color: "var(--dark)" }}>
                      <span style={{ color: "var(--pink)" }}>{PLANET_SYMBOLS[a.planet1] || ""}</span> {a.planet1.toLowerCase()}{" "}
                      <span style={{ color: "var(--pink)" }}>{a.type}</span>{" "}
                      <span style={{ color: "var(--pink)" }}>{PLANET_SYMBOLS[a.planet2] || ""}</span> {a.planet2.toLowerCase()}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--grey-light)" }}>orb {a.orb.toFixed(1)}°</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.75 }}>{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
