"use client";

import Link from "next/link";
import { useState } from "react";
import Ticker from "@/components/Ticker";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import ChartWheel from "@/components/ChartWheel";
import AstroTerm, { glossify } from "@/components/AstroTerm";
import AstroToday from "@/components/AstroToday";
import AstroShareButton from "@/components/AstroShareCard";
import { Box, LessonPage, LessonProgress, LessonTiles, SectionHead, TONES, makeLead, useLessons, type Lesson } from "@/components/learn/LearnKit";
import {
  BODY_MEANINGS,
  HOUSE_MEANINGS,
  SIGN_OVERVIEWS,
  SIGN_RULERS,
  SIGN_TRAITS,
  composePlacement,
  interpretAspect,
  ordinalHouse,
} from "@/lib/interpretations";
import { ELEMENT_TEXT, MODALITY_TEXT, type Element, type Modality } from "@/lib/astro-learn";
import { PLANET_SYMBOLS, textGlyph, type ChartData } from "@/types/chart";
import { getSymbol } from "@/lib/style-data";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const lead = makeLead(glossify);

// The astrology chart as a set of lessons, the same system as the Human Design page: a foil hero
// card of her big three, the 30-second version, today's sky over her chart, the interactive wheel,
// then colour-block tiles that each open a full-screen, closable lesson (with #chart-<id> links,
// swipe, and progress saved to her account). The full deep-dive pages at /my-chart/<id> stay as
// they were; every lesson links through to its one.

const SYNTHESIS_PAGES = [
  { slug: "personality", title: "personality overview", desc: "who you are, in one deeply accurate read" },
  { slug: "main-character", title: "main character energy", desc: "how you're designed to be magnetic and unforgettable" },
  { slug: "career", title: "career", desc: "your professional superpowers and ideal path" },
  { slug: "money", title: "money", desc: "your wealth codes and receiving style" },
  { slug: "love", title: "love & relationships", desc: "how you love and what you need back" },
  { slug: "healing", title: "healing & shadow work", desc: "your core wound, your patterns, and what integration actually looks like" },
  { slug: "power", title: "stepping into your power", desc: "lilith, pluto, mars and saturn, read as one power source" },
  { slug: "purpose", title: "soul expression & purpose", desc: "why you're actually here, beyond the job title" },
];

type Placement = {
  body: (typeof BODY_MEANINGS)[number];
  sign: string;
  house: number;
  retrograde: boolean;
  degree: number;
  minute: number;
};

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const placementGlyph = (p: Placement) =>
  p.body.id === "rising" ? "↑" : p.body.id === "midheaven" ? "MC" : textGlyph(PLANET_SYMBOLS[p.body.name] || getSymbol(p.sign));

// Planets that count toward her element and modality mix (the big ten plus her rising).
const BALANCE_IDS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "rising"];
const START_IDS = ["sun", "moon", "rising"];

export default function MyChartPage() {
  const { member, ready } = useMember();
  const { chart, loading } = useChart();

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>your chart is waiting inside.</h1>
          <Link href="/login" className="btn-pink">
            log in
          </Link>
        </div>
      </section>
    );
  }

  if (!loading && !chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 12 }}>let&apos;s calculate your chart.</h1>
          <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.7, marginBottom: 20 }}>
            Add your birth details and your entire personalised portal unlocks, placements, houses, aspects, all of it.
          </p>
          <Link href="/onboarding" className="btn-pink">
            add your chart
          </Link>
        </div>
      </section>
    );
  }

  if (loading || !chart) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return <ChartReading chart={chart} />;
}

function ChartReading({ chart }: { chart: ChartData }) {
  const router = useRouter();
  const [activeBody, setActiveBody] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const risingSign = chart.houses[0]?.sign || "";
  const midheavenSign = chart.houses[9]?.sign || "";

  // All 17 placements: rising + midheaven from the angles, the rest from planets
  const placements = BODY_MEANINGS.map((body) => {
    if (body.id === "rising") return { body, sign: risingSign, house: 1, retrograde: false, degree: chart.houses[0]?.degree ?? 0, minute: chart.houses[0]?.minute ?? 0 };
    if (body.id === "midheaven") return { body, sign: midheavenSign, house: 10, retrograde: false, degree: chart.houses[9]?.degree ?? 0, minute: chart.houses[9]?.minute ?? 0 };
    const planet = chart.planets.find((p) => p.id === body.id);
    return planet ? { body, sign: planet.sign, house: planet.house, retrograde: planet.retrograde, degree: planet.degree, minute: planet.minute } : null;
  }).filter(Boolean) as Placement[];
  const byId = new Map(placements.map((p) => [p.body.id, p]));
  const sun = byId.get("sun");
  const moon = byId.get("moon");
  const rising = byId.get("rising");

  // chart ruler: the planet ruling her rising sign
  const rulerInfo = SIGN_RULERS[risingSign];
  const ruler = rulerInfo ? byId.get(rulerInfo.rulerId) : undefined;

  // element + modality mix
  const elements: Record<Element, string[]> = { fire: [], earth: [], air: [], water: [] };
  const modalities: Record<Modality, string[]> = { cardinal: [], fixed: [], mutable: [] };
  for (const id of BALANCE_IDS) {
    const p = byId.get(id);
    const o = p ? SIGN_OVERVIEWS[p.sign] : undefined;
    if (!p || !o) continue;
    elements[o.element].push(p.body.name);
    modalities[o.modality].push(p.body.name);
  }
  const topElement = (Object.keys(elements) as Element[]).sort((a, b) => elements[b].length - elements[a].length)[0];
  const topModality = (Object.keys(modalities) as Modality[]).sort((a, b) => modalities[b].length - modalities[a].length)[0];

  const placementLesson = (p: Placement): Lesson => ({
    id: p.body.id,
    eyebrow: `${p.body.name.toLowerCase()} · ${p.body.title}`,
    title: `${p.sign} ${p.body.id === "rising" ? "rising" : p.body.name}`,
    hook: `${cap(p.body.title)}, playing out in your ${ordinalHouse(p.house)} house of ${HOUSE_MEANINGS[p.house - 1]?.title ?? "life"}.`,
    body: <PlacementLesson p={p} />,
  });

  const otherPlacements = placements.filter((p) => !START_IDS.includes(p.body.id));

  const lessons: Lesson[] = [
    ...START_IDS.map((id) => byId.get(id)).filter((p): p is Placement => !!p).map(placementLesson),
    ...(ruler
      ? [
          {
            id: "ruler",
            eyebrow: "your chart ruler",
            title: `${ruler.body.name} in ${ruler.sign}`,
            hook: "The planet steering your whole chart, and where it's driving you.",
            body: <RulerLesson risingSign={risingSign} ruler={ruler} />,
          },
        ]
      : []),
    {
      id: "elements",
      eyebrow: "your element mix",
      title: `${topElement} + ${topModality}`,
      hook: "What comes naturally to you, what you get to learn, and how you handle change.",
      body: <ElementsLesson elements={elements} modalities={modalities} />,
    },
    ...SYNTHESIS_PAGES.map((r) => ({
      id: `r-${r.slug}`,
      eyebrow: "full-chart reading",
      title: r.title,
      hook: r.desc,
      href: `/my-chart/${r.slug}`,
      body: null,
    })),
    ...otherPlacements.map(placementLesson),
    {
      id: "aspects",
      eyebrow: "how your planets talk",
      title: `${Math.min(chart.aspects.length, 12)} conversations`,
      hook: "The angles between your planets that make you one person instead of a list of parts.",
      body: <AspectsLesson chart={chart} />,
    },
    ...chart.houses.map((h) => ({
      id: `house-${h.house}`,
      eyebrow: `${ordinalHouse(h.house)} house`,
      title: HOUSE_MEANINGS[h.house - 1].title,
      hook: `${h.sign} on the cusp, ${(() => {
        const n = chart.planets.filter((p) => p.house === h.house).length;
        return n === 0 ? "no planets living here" : n === 1 ? "1 planet living here" : `${n} planets living here`;
      })()}.`,
      body: <HouseLesson chart={chart} house={h.house} />,
    })),
  ];

  // Readings open their own pages, so they sit outside the lesson pager.
  const isRoute = (l: Lesson) => !!l.href;
  const pager = lessons.filter((l) => !isRoute(l));
  const allIds = lessons.map((l) => l.id);
  const { openId, anchor, read, readCount, open, close, markRead } = useLessons({
    prefix: "chart",
    ids: pager.map((l) => l.id),
    accessible: allIds,
    progressKey: "chart_lessons_read",
  });

  const onOpen = (id: string) => {
    const l = lessons.find((x) => x.id === id);
    if (l?.href) {
      markRead(id);
      router.push(l.href);
    } else open(id);
  };

  const idx = pager.findIndex((l) => l.id === openId);
  const startCount = 3 + (ruler ? 1 : 0) + 1;
  const readings = lessons.filter(isRoute);
  const placementTiles = lessons.slice(startCount + readings.length, startCount + readings.length + otherPlacements.length + 1);
  const houseTiles = lessons.slice(startCount + readings.length + otherPlacements.length + 1);

  const pickedP = picked ? byId.get(picked) : undefined;

  return (
    <>
      <Ticker variant="lav" items={["your whole chart, decoded", "the blueprint of you", "awareness to embodiment", "read it, live it"]} />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px 80px", color: "var(--dark)" }}>
        {/* foil hero card: her big three as a collectable, everything on it solid black or white */}
        <section className="hd-foil" style={{ borderRadius: 26, border: "2px solid var(--dark)", padding: "26px 20px 22px", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            <p style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", margin: 0 }}>
              {chart.birthData.name ? `${chart.birthData.name}'s cosmic blueprint` : "your cosmic blueprint"}
            </p>
            <Link href="/onboarding" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--dark)", borderBottom: "1.5px solid var(--dark)" }}>
              chart looks wrong? edit it →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, margin: "8px 0 14px" }}>
            {[
              { p: sun, label: "sun", role: "who you are" },
              { p: moon, label: "moon", role: "what you feel" },
              { p: rising, label: "rising", role: "how you land" },
            ].map(({ p, label, role }) =>
              p ? (
                <button
                  key={label}
                  type="button"
                  onClick={() => open(p.body.id)}
                  style={{ textAlign: "left", background: "#fff", color: "var(--dark)", border: "2px solid var(--dark)", borderRadius: 18, padding: "14px 14px 12px", cursor: "pointer", fontFamily: "inherit" }}
                >
                  <span style={{ display: "block", fontSize: 26, lineHeight: 1 }}>{placementGlyph(p)}</span>
                  <span style={{ display: "block", fontFamily: poppins, fontSize: 24, fontWeight: 800, lineHeight: 1.1, marginTop: 6 }}>
                    {p.sign.toLowerCase()} {label}
                  </span>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 600, marginTop: 2 }}>{role}</span>
                </button>
              ) : null
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {ruler && (
              <HeroChip>
                <AstroTerm k="ruler">chart ruler</AstroTerm> · {ruler.body.name} in {ruler.sign}
              </HeroChip>
            )}
            <HeroChip>
              <AstroTerm k="element">element</AstroTerm> · {topElement} ({elements[topElement].length})
            </HeroChip>
            <HeroChip>
              <AstroTerm k="modality">modality</AstroTerm> · {topModality}
            </HeroChip>
          </div>
          {sun && moon && rising && (
            <AstroShareButton
              chart={chart}
              big3={{ sun: sun.sign, moon: moon.sign, rising: rising.sign }}
              pills={[...(ruler ? [`CHART RULER · ${ruler.body.name} in ${ruler.sign}`] : []), `ELEMENT · ${topElement}`]}
            />
          )}
        </section>

        {/* the 30-second version */}
        <SectionHead title="your chart in 30 seconds" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 24 }}>
          {sun && (
            <Box tone="pink" label="how you shine">
              <strong>{sun.sign} sun.</strong> You lead with {SIGN_TRAITS[sun.sign]?.essence}.
            </Box>
          )}
          {moon && (
            <Box tone="lav" label="how you feel">
              <strong>{moon.sign} moon.</strong> {cap(SIGN_TRAITS[moon.sign]?.love ?? "")}.
            </Box>
          )}
          {rising && (
            <Box tone="dark" label="how people meet you" wide>
              <strong>{rising.sign} rising.</strong> {cap(SIGN_TRAITS[rising.sign]?.gift ?? "")}, and people clock it before you&apos;ve said a word.
            </Box>
          )}
        </div>

        <AstroToday chart={chart} />

        {/* the wheel on a dark panel with a foil rim; tap a planet, then open its lesson */}
        <section className="holo-edge" style={{ background: "var(--dark)", borderRadius: 26, padding: "18px 12px 16px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <ChartWheel
              chart={chart}
              activeId={activeBody}
              onActiveChange={(id) => {
                setActiveBody(id);
                if (id) setPicked(id);
              }}
              onSelectPlanet={(id) => (pager.some((l) => l.id === id) ? open(id) : router.push(`/my-chart/${id}`))}
            />
          </div>
          <p style={{ textAlign: "center", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", margin: "10px 0 0" }}>
            <AstroTerm k="placidus">placidus</AstroTerm> · hover or tap any planet
          </p>
        </section>
        <div style={{ position: "relative", marginTop: 14, border: "1.5px solid var(--dark)", borderRadius: 18, padding: "18px 20px", minHeight: 110, background: "#fff" }} aria-live="polite">
          {pickedP ? (
            <>
              {/* clear */}
              <button
                type="button"
                onClick={() => setPicked(null)}
                aria-label="Clear selection"
                style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: 999, border: "1.5px solid var(--dark)", background: "#fff", color: "var(--dark)", cursor: "pointer" }}
              >
                ✕
              </button>
              <p style={{ fontFamily: poppins, fontWeight: 700, fontSize: 19, margin: "0 0 2px", paddingRight: 34 }}>
                {placementGlyph(pickedP)} {pickedP.body.name} in {pickedP.sign}
                {pickedP.retrograde && <> · <AstroTerm k="retrograde">Rx</AstroTerm></>}
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 10px" }}>
                {pickedP.body.title} · your {ordinalHouse(pickedP.house)} <AstroTerm k="house">house</AstroTerm> of {HOUSE_MEANINGS[pickedP.house - 1]?.title}
              </p>
              <p style={{ margin: "0 0 12px", lineHeight: 1.6, fontSize: 14.5 }}>
                {pickedP.body.intro} In {pickedP.sign}, that looks like {SIGN_TRAITS[pickedP.sign]?.essence}.
              </p>
              <button
                type="button"
                onClick={() => onOpen(pickedP.body.id)}
                style={{ width: "100%", background: "var(--dark)", color: "#fff", border: "none", borderRadius: 14, padding: "13px 16px", fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer" }}
              >
                open the full lesson on this →
              </button>
            </>
          ) : (
            <p style={{ margin: 0, textAlign: "center", lineHeight: 1.6, fontSize: 14.5 }}>
              Hover or tap any planet on the wheel and it&apos;ll tell you what it is, where it sits in your chart, and what it means for you.
            </p>
          )}
        </div>

        <LessonProgress title="learn your chart" readCount={readCount} total={allIds.length} />
        <LessonTiles title="start here" lessons={lessons.slice(0, startCount)} offset={0} unlocked read={read} onOpen={onOpen} />
        <LessonTiles title="your full-chart readings" lessons={readings} offset={startCount} unlocked read={read} onOpen={onOpen} />
        <LessonTiles title="every placement" lessons={placementTiles} offset={startCount + readings.length} unlocked read={read} onOpen={onOpen} />
        <LessonTiles title="your 12 houses" lessons={houseTiles} offset={startCount + readings.length + placementTiles.length} unlocked read={read} onOpen={onOpen} compact />
      </div>

      {idx >= 0 && (
        <LessonPage
          lesson={pager[idx]}
          tone={TONES[lessons.indexOf(pager[idx]) % TONES.length]}
          locked={false}
          anchor={anchor}
          prev={pager[idx - 1]}
          next={pager[idx + 1]}
          onGo={(id) => open(id)}
          onClose={close}
        />
      )}
    </>
  );
}

function HeroChip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "7px 14px", fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 0.4 }}>
      {children}
    </span>
  );
}

function DeepLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="no-underline"
      style={{ display: "block", textAlign: "center", background: "var(--pink)", color: "var(--dark)", borderRadius: 16, padding: "15px 18px", fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}
    >
      {children}
    </Link>
  );
}

// ── lesson bodies ─────────────────────────────────────────────────────────────────

function PlacementLesson({ p }: { p: Placement }) {
  const s = composePlacement(p.body.id, p.sign, p.house);
  const house = HOUSE_MEANINGS[p.house - 1];
  const o = SIGN_OVERVIEWS[p.sign];
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Chip>
          {p.degree}°{String(p.minute).padStart(2, "0")}&apos; {p.sign}
        </Chip>
        <Chip>
          {ordinalHouse(p.house)} <AstroTerm k="house">house</AstroTerm>
        </Chip>
        {o && (
          <Chip>
            {o.element} · {o.modality}
          </Chip>
        )}
        {p.retrograde && (
          <Chip>
            <AstroTerm k="retrograde">retrograde</AstroTerm>
          </Chip>
        )}
      </div>
      <Box label={`what ${p.body.id === "rising" ? "your rising" : p.body.name} is`}>{lead(p.body.intro)}</Box>
      {s ? (
        <>
          <Box tone="pink" label={`your ${p.sign} gift`}>{lead(s.gifts)}</Box>
          {house && (
            <Box tone="lav" label={`where it plays out · ${ordinalHouse(p.house)} house`}>
              <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>Your house of {house.title}.</strong>
              {glossify(`This lands in ${house.rules}. ${house.coach}`)}
            </Box>
          )}
          <Box tone="dark" label="the shadow">{lead(s.shadow)}</Box>
          <Box tone="pink" label="this week's move">{lead(s.thisWeeksMove)}</Box>
        </>
      ) : (
        <Box tone="pink" label={`in ${p.sign}`}>{lead(`You lead with ${SIGN_TRAITS[p.sign]?.essence ?? p.sign}.`)}</Box>
      )}
      <DeepLink href={`/my-chart/${p.body.id}`}>read the full deep dive →</DeepLink>
    </div>
  );
}

function HouseLesson({ chart, house }: { chart: ChartData; house: number }) {
  const m = HOUSE_MEANINGS[house - 1];
  const cusp = chart.houses[house - 1];
  const inside = chart.planets.filter((p) => p.house === house);
  const traits = SIGN_TRAITS[cusp.sign];
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Box label="what this house runs">
        <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>{m.rules.charAt(0).toUpperCase() + m.rules.slice(1)}.</strong>
        {glossify(m.coach)}
      </Box>
      <Box tone="lav" label={`your ${cusp.sign} cusp`}>
        <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>
          {cusp.sign} at {cusp.degree}° sets the tone here.
        </strong>
        You approach {m.lifeAreas.slice(0, 2).join(" and ")} with {traits?.essence ?? cusp.sign}.
      </Box>
      <Box tone={inside.length ? "pink" : "white"} label={inside.length >= 3 ? "a stellium lives here" : "who lives here"}>
        {inside.length === 0 ? (
          <>
            <strong>An empty house.</strong> No planets here means this area isn&apos;t a lifelong lesson, it runs on its cusp sign and the
            planet that rules it, so it&apos;s more chill than chaotic.
          </>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {inside.map((p) => (
              <div key={p.id} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ fontSize: 18, width: 22, flexShrink: 0 }}>{textGlyph(PLANET_SYMBOLS[p.name] || "•")}</span>
                <span>
                  <strong>
                    {p.name} in {p.sign}
                  </strong>{" "}
                  · {BODY_MEANINGS.find((b) => b.id === p.id)?.domainShort ?? p.name.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Box>
      <Box tone="dark" label="the deeper read">{lead(m.deepDive)}</Box>
      <DeepLink href={`/my-chart/house/${house}`}>step inside the full house reading →</DeepLink>
    </div>
  );
}

function RulerLesson({ risingSign, ruler }: { risingSign: string; ruler: Placement }) {
  const house = HOUSE_MEANINGS[ruler.house - 1];
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Box label="what a chart ruler is">
        <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>Your {risingSign} rising is ruled by {ruler.body.name}.</strong>
        That makes {ruler.body.name} the driver of your whole chart. Wherever it sits is where your life keeps steering, no matter what the
        rest of your placements are doing.
      </Box>
      <Box tone="pink" label={`${ruler.body.name} in ${ruler.sign}`}>
        <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>It drives you with {SIGN_TRAITS[ruler.sign]?.essence}.</strong>
        {glossify(ruler.body.intro)}
      </Box>
      {house && (
        <Box tone="lav" label={`steering toward your ${ordinalHouse(ruler.house)} house`}>
          <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>Your life keeps pulling you toward {house.title}.</strong>
          {glossify(`That's ${house.rules}. ${house.coach}`)}
        </Box>
      )}
      <DeepLink href={`/my-chart/${ruler.body.id}`}>read your {ruler.body.name} deep dive →</DeepLink>
    </div>
  );
}

function ElementsLesson({ elements, modalities }: { elements: Record<Element, string[]>; modalities: Record<Modality, string[]> }) {
  const total = Object.values(elements).reduce((n, l) => n + l.length, 0) || 1;
  const ordered = (Object.keys(elements) as Element[]).sort((a, b) => elements[b].length - elements[a].length);
  const missing = ordered.filter((e) => elements[e].length === 0);
  const topMod = (Object.keys(modalities) as Modality[]).sort((a, b) => modalities[b].length - modalities[a].length)[0];
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Box label="your mix">
        <div style={{ display: "grid", gap: 12 }}>
          {ordered.map((e, i) => (
            <div key={e}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: poppins, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                <span>{e}</span>
                <span>{elements[e].length}</span>
              </div>
              <div style={{ height: 14, borderRadius: 999, background: "var(--lav-light)", border: "1.5px solid var(--dark)", overflow: "hidden" }}>
                <div className={i === 0 ? "hd-foil" : undefined} style={{ height: "100%", width: `${(elements[e].length / total) * 100}%`, background: i === 0 ? undefined : "var(--pink)" }} />
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{elements[e].join(", ") || "none"}</div>
            </div>
          ))}
        </div>
      </Box>
      <Box tone="pink" label={`you're ${ordered[0]}-led`}>
        <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>{ELEMENT_TEXT[ordered[0]].gift}</strong>
        {`With ${elements[ordered[0]].length} of your placements here, that's the energy people feel from you first and the one you can always come back to.`}
      </Box>
      {missing.map((e) => (
        <Box key={e} tone="dark" label={`no ${e}`}>
          <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>Missing {e} is a superpower in disguise.</strong>
          You&apos;ve got no {e} placements, so {ELEMENT_TEXT[e].missing}
        </Box>
      ))}
      <Box tone="lav" label={`mostly ${topMod}`}>
        <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>{MODALITY_TEXT[topMod]}</strong>
        {modalities[topMod].join(", ")} {modalities[topMod].length === 1 ? "is" : "are"} carrying that for you. Cardinal{" "}
        {modalities.cardinal.length}, fixed {modalities.fixed.length}, mutable {modalities.mutable.length}.
      </Box>
    </div>
  );
}

function AspectsLesson({ chart }: { chart: ChartData }) {
  const signOf = (name: string) =>
    name === "Ascendant" ? chart.houses[0]?.sign : name === "Midheaven" ? chart.houses[9]?.sign : chart.planets.find((p) => p.name === name)?.sign;
  const tone = (type: string): "pink" | "lav" | "dark" | "white" =>
    type === "conjunction" ? "pink" : type === "trine" || type === "sextile" ? "lav" : type === "square" || type === "opposition" ? "dark" : "white";
  const items = [...chart.aspects].sort((a, b) => a.orb - b.orb).slice(0, 12);
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Box label="how to read these">
        <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>Tightest first, so the loudest ones lead.</strong>
        Pink boxes are <AstroTerm k="conjunction">conjunctions</AstroTerm> (fused), lilac are <AstroTerm k="trine">trines</AstroTerm> and{" "}
        <AstroTerm k="sextile">sextiles</AstroTerm> (flow), black are <AstroTerm k="square">squares</AstroTerm> and{" "}
        <AstroTerm k="opposition">oppositions</AstroTerm> (the spicy growth ones).
      </Box>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {items.map((a, i) => {
          const text = interpretAspect(a.planet1, a.planet2, a.type, { sign1: signOf(a.planet1), sign2: signOf(a.planet2), orb: a.orb });
          if (!text) return null;
          return (
            <Box
              key={`${a.planet1}-${a.planet2}-${i}`}
              tone={tone(a.type)}
              label={`${textGlyph(PLANET_SYMBOLS[a.planet1] || "")} ${a.planet1} ${a.type} ${textGlyph(PLANET_SYMBOLS[a.planet2] || "")} ${a.planet2} · orb ${a.orb.toFixed(1)}°`}
            >
              {lead(text)}
            </Box>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "#fff", border: "1.5px solid var(--dark)", borderRadius: 999, padding: "5px 12px", fontFamily: poppins, fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}
