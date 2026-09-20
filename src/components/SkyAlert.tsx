"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { daysUntilSkyDate } from "@/lib/sky-zone";
import { HOUSE_MEANINGS, ordinalHouse, houseForLongitude, longitudeForSignDegree } from "@/lib/interpretations";
import type { ChartData } from "@/types/chart";

// What each lunation asks of her, once it has been placed in one of her houses. This used to live
// in the separate "your cosmic calendar" block further down the dashboard, which listed the same
// events a second time purely to add this personal line. The line now rides along on the weather
// card instead, so the sky is described once.
const COACH: Record<string, string> = {
  new_moon: "set intentions, plant what you want to grow",
  full_moon: "release and celebrate, see what's come to light",
  solar_eclipse: "expect the unplanned, this door opens or closes fast",
  lunar_eclipse: "a sudden, undeniable ending or reveal, let it happen",
  node_ingress: "the collective's whole growth direction resets, this one's rare",
};

const poppins = "var(--font-poppins), Poppins, sans-serif";

interface CalendarEvent {
  type: "new_moon" | "full_moon" | "solar_eclipse" | "lunar_eclipse" | "retrograde_start" | "retrograde_end" | "node_ingress";
  date: string;
  sign: string;
  degree: number;
  planet?: string;
  nodeEnd?: "north" | "south";
}

interface MajorTransit {
  type: "ingress" | "retrograde_start" | "retrograde_end" | "aspect";
  date: string;
  planet: string;
  sign?: string;
  otherPlanet?: string;
  otherSign?: string;
  aspectType?: "conjunction" | "sextile" | "square" | "trine" | "opposition";
}

interface MercuryShadow {
  phase: "pre" | "post";
  date: string;
  sign: string;
  degree: number;
}

interface CalendarResponse {
  events: CalendarEvent[];
  majorTransits: MajorTransit[];
  mercuryRetrogradeNow: boolean;
  mercurySignNow?: string;
  mercuryShadow: MercuryShadow | null;
  northNodeNow: string;
  eclipseSeason: boolean;
}

// The soonest events lead; eclipses and nodal shifts are the "big deal" ones, lunations sit in
// among them sorted by date. Kept to a short list so the rail stays scannable.
const BIG_TYPES = new Set([
  "solar_eclipse",
  "lunar_eclipse",
  "node_ingress",
  "full_moon",
  "new_moon",
]);
const MAJOR_WINDOW_DAYS = 45;

// "today" is measured in the zone the API publishes its dates in, so a member in Asia isn't a day
// out on every countdown.
const daysUntil = daysUntilSkyDate;

function formatDate(dateIso: string): string {
  return new Date(dateIso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

// Cosmic weather: pulls fresh from /api/calendar on every load (no cache, always today-accurate) and
// renders a compact, light horizontal RAIL of the soonest sky events rather than a long dark list.
export default function SkyAlert({ chart }: { chart?: ChartData | null }) {
  const [data, setData] = useState<CalendarResponse | null>(null);

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => (res.ok ? res.json() : null))
      .then((d: CalendarResponse | null) => d && setData(d))
      .catch(() => {});
  }, []);

  if (!data) return null;

  const bigEvents = data.events.filter((e) => BIG_TYPES.has(e.type)).slice(0, 4);
  const nearMajorTransits = (data.majorTransits || [])
    .filter((t) => {
      const until = daysUntil(t.date);
      return until >= 0 && until <= MAJOR_WINDOW_DAYS;
    })
    .slice(0, 2);
  const showShadow = !data.mercuryRetrogradeNow && !!data.mercuryShadow;
  if (bigEvents.length === 0 && !data.mercuryRetrogradeNow && !showShadow && nearMajorTransits.length === 0) return null;

  type SkyItem =
    | { kind: "big"; date: string; event: CalendarEvent }
    | { kind: "transit"; date: string; transit: MajorTransit };
  const items: SkyItem[] = [
    ...bigEvents.map((e): SkyItem => ({ kind: "big", date: e.date, event: e })),
    ...nearMajorTransits.map((t): SkyItem => ({ kind: "transit", date: t.date, transit: t })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  // One flattened, uniform card model so the big events, transits and mercury notes all render the
  // same compact card in the rail.
  type Card = { key: string; date: string | null; timing: string; hot: boolean; label: string; body: string; href: string | null; gold?: boolean; mine?: string };
  const cards: Card[] = [];

  // Only lunations and eclipses land in a specific house, and only if we have her chart.
  const cusps = chart ? chart.houses.map((h) => h.longitude) : null;
  const personalise = (type: string, sign: string, degree: number): string | undefined => {
    if (!cusps || !COACH[type]) return undefined;
    const lon = longitudeForSignDegree(sign, degree);
    if (lon === null) return undefined;
    const house = houseForLongitude(lon, cusps);
    const meaning = HOUSE_MEANINGS[house - 1];
    if (!meaning) return undefined;
    return `Lands in your ${ordinalHouse(house)} house of ${meaning.title}, so ${COACH[type]} around your ${meaning.lifeAreas[0]}.`;
  };

  for (const item of items) {
    const until = daysUntil(item.date);
    const isNow = until <= 0;
    const timing = isNow ? "now" : until === 1 ? "tomorrow" : `in ${until} days`;
    if (item.kind === "big") {
      const event = item.event;
      // Every label carries its sign, so the card answers "new moon in what" at a glance rather
      // than making her read the body for it.
      const sign = event.sign.toLowerCase();
      const copy = {
        solar_eclipse: { label: `solar eclipse in ${sign}`, body: `Lands in ${sign}. Something opens or closes fast, on its own timeline.` },
        lunar_eclipse: { label: `lunar eclipse in ${sign}`, body: `Lands in ${sign}. Endings land harder, what's overdue to close finally does.` },
        node_ingress: { label: `nodal axis into ${sign}`, body: `The north node moves into ${sign}, resetting the collective's direction for ~18 months.` },
        full_moon: { label: `full moon in ${sign}`, body: `Peak of the cycle in ${sign}. Things get visible. Good for finishing and releasing.` },
        new_moon: { label: `new moon in ${sign}`, body: `Fresh start in ${sign}. The moment to begin, not to keep planning.` },
      }[event.type as "solar_eclipse" | "lunar_eclipse" | "node_ingress" | "full_moon" | "new_moon"];
      cards.push({
        key: `${event.type}-${event.date}`,
        date: event.date,
        timing,
        hot: isNow || event.type === "solar_eclipse" || event.type === "lunar_eclipse",
        label: copy.label,
        body: copy.body,
        mine: personalise(event.type, event.sign, event.degree),
        href: `/your-season/moon?type=${event.type}&date=${event.date}&sign=${event.sign}&degree=${event.degree}${event.planet ? `&planet=${encodeURIComponent(event.planet)}` : ""}${event.nodeEnd ? `&nodeEnd=${event.nodeEnd}` : ""}`,
      });
    } else {
      const t = item.transit;
      // Every card names the sign the event happens in, the same way the lunations do, because "venus
      // retrograde" and "venus retrograde in scorpio" are not the same transit to read.
      const inSign = t.sign ? ` in ${t.sign.toLowerCase()}` : "";
      // An aspect happens in two places at once, so it names both signs, and only once when the
      // two planets share one.
      const aspectLabel =
        t.sign && t.otherSign && t.sign !== t.otherSign
          ? `${t.planet} in ${t.sign.toLowerCase()} ${t.aspectType} ${t.otherPlanet} in ${t.otherSign.toLowerCase()}`
          : `${t.planet} ${t.aspectType} ${t.otherPlanet}${inSign}`;
      const label =
        t.type === "ingress" ? `${t.planet}${inSign ? ` into ${t.sign!.toLowerCase()}` : " shifts era"}`
        : t.type === "aspect" ? aspectLabel
        : t.type === "retrograde_start" ? `${t.planet} retrograde${inSign}`
        : `${t.planet} direct${inSign}`;
      const between =
        t.sign && t.otherSign
          ? `${t.planet} in ${t.sign.toLowerCase()} and ${t.otherPlanet} in ${t.otherSign.toLowerCase()}`
          : `${t.planet} and ${t.otherPlanet}`;
      const body =
        t.type === "ingress" ? `${t.planet} moves into ${t.sign?.toLowerCase()}. A slow, whole-era shift, not a today thing.`
        : t.type === "aspect" ? `A rare ${t.aspectType} between ${between}, the backdrop the collective is working with.`
        : t.type === "retrograde_start" ? `${t.planet} turns retrograde${inSign}, its domain turns inward for review.`
        : `${t.planet} turns direct${inSign}, the review clears and forward motion gets reliable again.`;
      cards.push({
        key: `${t.type}-${t.date}-${t.planet}`,
        date: t.date,
        timing,
        hot: isNow,
        label,
        body,
        href:
          `/your-season/transit?type=${t.type}&date=${t.date}&planet=${encodeURIComponent(t.planet)}` +
          (t.sign ? `&sign=${encodeURIComponent(t.sign)}` : "") +
          (t.otherPlanet ? `&otherPlanet=${encodeURIComponent(t.otherPlanet)}` : "") +
          (t.otherSign ? `&otherSign=${encodeURIComponent(t.otherSign)}` : "") +
          (t.aspectType ? `&aspectType=${t.aspectType}` : ""),
      });
    }
  }

  if (data.mercuryRetrogradeNow) {
    cards.unshift({
      key: "mercury-rx",
      date: null,
      timing: "right now",
      hot: false,
      gold: true,
      label: `mercury retrograde${data.mercurySignNow ? ` in ${data.mercurySignNow.toLowerCase()}` : ""}`,
      body: "Reread before you send, review before you sign. This window is for revisiting, not launching.",
      href: null,
    });
  } else if (showShadow && data.mercuryShadow) {
    cards.push({
      key: "mercury-shadow",
      date: null,
      timing: "right now",
      hot: false,
      gold: true,
      href: null,
      label: `mercury shadow in ${data.mercuryShadow.sign.toLowerCase()}`,
      body:
        data.mercuryShadow.phase === "post"
          ? `Mercury is direct but still in its post-retrograde shadow until about two weeks after ${formatDate(data.mercuryShadow.date)}. Clear the backlog, don't launch yet.`
          : `Mercury enters its pre-retrograde shadow around ${formatDate(data.mercuryShadow.date)}. The run-up where things feel slightly off. Tie up loose ends now.`,
    });
  }

  return (
    <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 56 }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
          your cosmic weather{chart ? " · personalised to your chart" : ""}
        </div>
        <h2 style={{ fontFamily: poppins, fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-1px", textTransform: "lowercase", color: "var(--dark)", lineHeight: 1.05, marginBottom: data.eclipseSeason ? 12 : 22 }}>
          what the sky is <span style={{ color: "var(--pink)" }}>doing.</span>
        </h2>
        {data.eclipseSeason && (
          <p style={{ fontSize: 12.5, color: "var(--pink)", fontWeight: 700, marginBottom: 22, maxWidth: 620, lineHeight: 1.6 }}>
            you&apos;re in eclipse season, the window around each eclipse below, not just the exact date. Things move faster and feel less optional.
          </p>
        )}
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
          {cards.map((c) => {
            const inner = (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, color: "var(--dark)" }}>{c.date ? formatDate(c.date) : "★"}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)", whiteSpace: "nowrap" }}>{c.timing}</span>
                </div>
                <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: c.gold ? "#3C2A70" : c.hot ? "var(--pink)" : "#3C2A70", marginBottom: 8 }}>{c.label}</div>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: c.gold ? "#3C2A70" : "var(--grey)", display: "-webkit-box", WebkitLineClamp: c.mine ? 3 : 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.body}</p>
                {c.mine && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1.5px solid rgba(26,26,26,0.12)" }}>
                    <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 4 }}>
                      for you
                    </div>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--dark)", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {c.mine}
                    </p>
                  </div>
                )}
                {c.href && (
                  <span style={{ marginTop: "auto", paddingTop: 14, fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>read more →</span>
                )}
              </>
            );
            const cardStyle: React.CSSProperties = {
              flex: "0 0 238px",
              borderRadius: 14,
              border: `2px solid ${c.gold ? "#E7C66B" : c.hot ? "var(--pink)" : "var(--dark)"}`,
              background: c.gold ? "var(--gold)" : c.hot ? "var(--pink-bg)" : "#fff",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              minHeight: 168,
            };
            return c.href ? (
              <Link key={c.key} href={c.href} className="no-underline hover:opacity-90 transition-opacity" style={cardStyle}>
                {inner}
              </Link>
            ) : (
              <div key={c.key} style={cardStyle}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
