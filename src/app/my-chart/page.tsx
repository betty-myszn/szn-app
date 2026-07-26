"use client";

import Link from "next/link";
import { useState } from "react";
import Ticker from "@/components/Ticker";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import ChartWheel from "@/components/ChartWheel";
import { BODY_MEANINGS, HOUSE_MEANINGS, interpretAspect, ordinalHouse } from "@/lib/interpretations";
import { PLANET_SYMBOLS, textGlyph } from "@/types/chart";
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

// A guided tour instead of a flat grid: the chart, grouped by the story each
// cluster tells, biggest placements first. Every one of the 17 keeps a home.
type Placement = {
  body: (typeof BODY_MEANINGS)[number];
  sign: string;
  house: number;
  retrograde: boolean;
  degree: number;
  minute: number;
};

// One personalised call to action per placement, so no two buttons read alike.
const PLACEMENT_CTA: Record<string, string> = {
  sun: "explore your identity",
  moon: "understand your emotions",
  rising: "see your magnetism",
  mercury: "hear how you think",
  venus: "love deeper",
  mars: "unlock your drive",
  jupiter: "grow your abundance",
  saturn: "master your lessons",
  uranus: "break the mould",
  neptune: "enter your dream world",
  pluto: "meet your power",
  chiron: "heal your wound",
  north_node: "walk toward your destiny",
  south_node: "know your comfort zone",
  lilith: "free your untamed self",
  part_of_fortune: "find your joy",
  midheaven: "claim your legacy",
};

// Size tiers: the big three lead, the personal planets sit in the middle, the
// slower and derived points round it out.
const PLACEMENT_SIZE: Record<string, "lg" | "md" | "sm"> = {
  sun: "lg",
  moon: "lg",
  rising: "lg",
  mercury: "md",
  venus: "md",
  mars: "md",
  jupiter: "md",
  saturn: "md",
  midheaven: "md",
};

// Five groups, a soft brand tint each, ordered for emotional impact.
const PLACEMENT_GROUPS: {
  key: string;
  label: string;
  blurb: string;
  accent: string;
  ids: string[];
  cols: string;
}[] = [
  {
    key: "core",
    label: "core identity",
    blurb: "start here. these four run the whole show.",
    accent: "var(--gold)",
    ids: ["sun", "moon", "rising", "mercury"],
    cols: "md:grid-cols-3",
  },
  {
    key: "love",
    label: "love & connection",
    blurb: "how you're wired to want, attract and pursue.",
    accent: "var(--pink-light)",
    ids: ["venus", "mars"],
    cols: "md:grid-cols-2",
  },
  {
    key: "purpose",
    label: "success & purpose",
    blurb: "where you're built to grow, master and be seen.",
    accent: "var(--mint)",
    ids: ["jupiter", "saturn", "midheaven"],
    cols: "md:grid-cols-3",
  },
  {
    key: "shadow",
    label: "shadow & soul",
    blurb: "the deeper work: your power, your wound, your direction.",
    accent: "var(--lav-light)",
    ids: ["pluto", "chiron", "north_node", "south_node", "lilith"],
    cols: "sm:grid-cols-2 md:grid-cols-3",
  },
  {
    key: "outer",
    label: "the outer edges",
    blurb: "the generational planets and the finishing touches.",
    accent: "var(--cream)",
    ids: ["uranus", "neptune", "part_of_fortune"],
    cols: "sm:grid-cols-2 md:grid-cols-3",
  },
];

function PlacementCard({ p, size, accent }: { p: Placement; size: "lg" | "md" | "sm"; accent: string }) {
  const symbol = textGlyph(PLANET_SYMBOLS[p.body.name] || getSymbol(p.sign));
  const cta = PLACEMENT_CTA[p.body.id] || "read";
  const tile = size === "lg" ? 52 : size === "md" ? 44 : 36;
  const signSize = size === "lg" ? 26 : size === "md" ? 20 : 16;
  const pad = size === "lg" ? 26 : size === "md" ? 22 : 18;
  const showPreview = size !== "sm";
  const clamp = size === "lg" ? 3 : 2;

  return (
    <Link href={`/my-chart/${p.body.id}`} className="pcard no-underline" style={{ padding: pad }}>
      <div
        aria-hidden
        style={{
          width: tile,
          height: tile,
          display: "grid",
          placeItems: "center",
          background: accent,
          fontSize: tile * 0.46,
          color: "var(--dark)",
          marginBottom: 12,
        }}
      >
        {symbol}
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 4 }}>
        {p.body.name.toLowerCase()} · {p.body.title}
      </div>
      <div style={{ fontFamily: poppins, fontSize: signSize, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.1 }}>
        {p.sign.toLowerCase()}
        {p.retrograde && <span style={{ color: "var(--pink)", fontSize: signSize * 0.5, marginLeft: 6, verticalAlign: "middle" }}>Rx</span>}
      </div>
      <div style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 3 }}>
        {p.degree}&deg;{String(p.minute).padStart(2, "0")}&apos; · {ordinalHouse(p.house)} house
      </div>
      {showPreview && (
        <p
          style={{
            fontSize: 12.5,
            color: "var(--grey)",
            lineHeight: 1.55,
            marginTop: 10,
            display: "-webkit-box",
            WebkitLineClamp: clamp,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {p.body.intro}
        </p>
      )}
      <span className="pcard-cta" style={{ marginTop: "auto", paddingTop: 14 }}>
        {cta} &#8594;
      </span>
    </Link>
  );
}

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
  }).filter(Boolean) as Placement[];

  const byId = new Map(placements.map((p) => [p.body.id, p]));

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

      {/* Placements: a guided tour of the chart, grouped by the story each cluster tells */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "2px solid var(--pink)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-2">your blueprint · a guided tour</div>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, maxWidth: 540 }}>
            Every placement tells a different story about who you are. Start with the foundations, then explore the
            deeper layers of your chart.
          </p>

          {PLACEMENT_GROUPS.map((group) => {
            const items = group.ids.map((id) => byId.get(id)).filter(Boolean) as Placement[];
            if (items.length === 0) return null;

            const heading = (
              <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                <h3 style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, letterSpacing: "-0.4px" }}>
                  {group.label}
                </h3>
                <span style={{ fontSize: 13, color: "var(--grey-light)" }}>{group.blurb}</span>
              </div>
            );

            if (group.key === "core") {
              const lead = items.filter((p) => PLACEMENT_SIZE[p.body.id] === "lg");
              const rest = items.filter((p) => PLACEMENT_SIZE[p.body.id] !== "lg");
              return (
                <div key={group.key} style={{ marginTop: 44 }}>
                  {heading}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {lead.map((p) => (
                      <PlacementCard key={p.body.id} p={p} size="lg" accent={group.accent} />
                    ))}
                  </div>
                  {rest.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      {rest.map((p) => (
                        <PlacementCard key={p.body.id} p={p} size={PLACEMENT_SIZE[p.body.id] || "md"} accent={group.accent} />
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={group.key} style={{ marginTop: 44 }}>
                {heading}
                <div className={`grid grid-cols-1 ${group.cols} gap-3`}>
                  {items.map((p) => (
                    <PlacementCard key={p.body.id} p={p} size={PLACEMENT_SIZE[p.body.id] || "sm"} accent={group.accent} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Houses: the same card language as the placements above */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "2px solid var(--pink)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-2">your 12 life arenas</div>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, maxWidth: 540, marginBottom: 22 }}>
            Every planet lands in a house, the area of life it colours most. This is where your chart actually plays out.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {chart.houses.map((h, i) => {
              const meaning = HOUSE_MEANINGS[i];
              const planetsInside = chart.planets.filter((p) => p.house === h.house);
              return (
                <Link key={h.house} href={`/my-chart/house/${h.house}`} className="pcard no-underline" style={{ padding: 18 }}>
                  <div
                    aria-hidden
                    style={{
                      width: 36,
                      height: 36,
                      display: "grid",
                      placeItems: "center",
                      background: "var(--lav-light)",
                      fontFamily: poppins,
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--dark)",
                      marginBottom: 12,
                    }}
                  >
                    {h.house}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 4 }}>
                    {ordinalHouse(h.house)} house
                  </div>
                  <div style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px", lineHeight: 1.1 }}>
                    {meaning.title}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 3 }}>
                    {textGlyph(getSymbol(h.sign))} {h.sign.toLowerCase()} {h.degree}&deg;{String(h.minute).padStart(2, "0")}&apos; cusp
                  </div>
                  {planetsInside.length > 0 && (
                    <div style={{ fontSize: 14, color: "var(--pink)", marginTop: 6, letterSpacing: "0.06em" }}>
                      {planetsInside.map((p) => textGlyph(PLANET_SYMBOLS[p.name] || "•")).join(" ")}
                    </div>
                  )}
                  <span className="pcard-cta" style={{ marginTop: "auto", paddingTop: 14 }}>
                    step inside &#8594;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Aspects in plain English, as cards to match the rest of the page */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-2">how your planets talk to each other</div>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, maxWidth: 540, marginBottom: 22 }}>
            Aspects are the conversations between your placements, the angles that make your chart hang together as one
            person instead of a list of parts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chart.aspects.slice(0, 12).map((a, i) => {
              const signOf = (name: string) =>
                name === "Ascendant" ? chart.houses[0]?.sign : name === "Midheaven" ? chart.houses[9]?.sign : chart.planets.find((p) => p.name === name)?.sign;
              const text = interpretAspect(a.planet1, a.planet2, a.type, { sign1: signOf(a.planet1), sign2: signOf(a.planet2), orb: a.orb });
              if (!text) return null;
              return (
                <div
                  key={`${a.planet1}-${a.planet2}-${i}`}
                  style={{ background: "#fff", border: "1.5px solid #ececec", padding: 22 }}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, color: "var(--dark)" }}>
                      <span style={{ color: "var(--pink)" }}>{textGlyph(PLANET_SYMBOLS[a.planet1] || "")}</span> {a.planet1.toLowerCase()}{" "}
                      <span style={{ color: "var(--pink)" }}>{a.type}</span>{" "}
                      <span style={{ color: "var(--pink)" }}>{textGlyph(PLANET_SYMBOLS[a.planet2] || "")}</span> {a.planet2.toLowerCase()}
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
