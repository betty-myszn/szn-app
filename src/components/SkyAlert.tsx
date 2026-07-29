"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { daysUntilSkyDate } from "@/lib/sky-zone";

const poppins = "var(--font-poppins), Poppins, sans-serif";

interface CalendarEvent {
  type: "new_moon" | "full_moon" | "solar_eclipse" | "lunar_eclipse" | "retrograde_start" | "retrograde_end" | "node_ingress";
  date: string;
  sign: string;
  degree: number;
  planet?: string;
}

interface MajorTransit {
  type: "ingress" | "retrograde_start" | "retrograde_end" | "aspect";
  date: string;
  planet: string;
  sign?: string;
  otherPlanet?: string;
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
  mercuryShadow: MercuryShadow | null;
  northNodeNow: string;
  eclipseSeason: boolean;
}

// New and full moons used to be excluded here on the reasoning that they are routine and belong
// further down the page. In practice that meant a full moon exact tonight was nowhere on the page
// a member actually looks at, while an eclipse three weeks out sat at the top. A lunation is the
// most immediate thing in the sky and the one people feel, so it belongs in this panel too. Sorting
// is by date, so whatever is closest still leads and the eclipses keep their place.
const BIG_TYPES = new Set([
  "solar_eclipse",
  "lunar_eclipse",
  "node_ingress",
  "full_moon",
  "new_moon",
]);
const MAJOR_WINDOW_DAYS = 45;

// "today" has to be measured in the same zone the API publishes its dates in, otherwise a member
// in Asia sits up to a day ahead of the dates she's reading and every countdown is out by one.
const daysUntil = daysUntilSkyDate;

function formatDate(dateIso: string): string {
  return new Date(dateIso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

// Pulls fresh from /api/calendar on every load, no caching layer of its own, so "updated every
// single day" is just true by construction, the ephemeris always computes off today's real date.
// Only surfaces the genuinely rare stuff, eclipses and nodal axis shifts, everyday new/full moons
// stay in the cosmic calendar list further down, this is specifically for the "big deal" events.
export default function SkyAlert() {
  const [data, setData] = useState<CalendarResponse | null>(null);

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => (res.ok ? res.json() : null))
      .then((d: CalendarResponse | null) => d && setData(d))
      .catch(() => {});
  }, []);

  if (!data) return null;

  // Four rather than three, so adding lunations back in cannot push an eclipse off the panel.
  const bigEvents = data.events.filter((e) => BIG_TYPES.has(e.type)).slice(0, 4);
  const nearMajorTransits = (data.majorTransits || [])
    .filter((t) => {
      const until = daysUntil(t.date);
      return until >= 0 && until <= MAJOR_WINDOW_DAYS;
    })
    .slice(0, 2);
  const showShadow = !data.mercuryRetrogradeNow && !!data.mercuryShadow;
  if (bigEvents.length === 0 && !data.mercuryRetrogradeNow && !showShadow && nearMajorTransits.length === 0) return null;

  // Merge eclipses/nodal shifts and bigger-picture transits into one list sorted by date, so the
  // soonest event always leads, a retrograde 4 days out never sits below an eclipse a month away.
  // Each card keeps its own styling via the `kind` discriminator when rendered below.
  type SkyItem =
    | { kind: "big"; date: string; event: CalendarEvent }
    | { kind: "transit"; date: string; transit: MajorTransit };
  const items: SkyItem[] = [
    ...bigEvents.map((e): SkyItem => ({ kind: "big", date: e.date, event: e })),
    ...nearMajorTransits.map((t): SkyItem => ({ kind: "transit", date: t.date, transit: t })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="tag mb-4">what&apos;s actually happening in the sky</div>
        {data.eclipseSeason && (
          <p style={{ fontSize: 12, color: "var(--pink)", fontWeight: 700, marginBottom: 14 }}>
            you&apos;re in eclipse season right now, the window around every eclipse below, not just the exact date. Expect things to move faster and feel less optional than usual.
          </p>
        )}
        <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
          {items.map((item, i) => {
            const showBorder = i < items.length - 1 || data.mercuryRetrogradeNow;

            if (item.kind === "big") {
            const event = item.event;
            const until = daysUntil(event.date);
            const isNow = until <= 0;
            const timing = isNow ? "happening now" : until === 1 ? "tomorrow" : `in ${until} days`;
            const href = `/your-season/moon?type=${event.type}&date=${event.date}&sign=${event.sign}&degree=${event.degree}${event.planet ? `&planet=${encodeURIComponent(event.planet)}` : ""}`;

            const copy = {
              solar_eclipse: {
                label: "solar eclipse",
                body: `a solar eclipse lands in ${event.sign.toLowerCase()} ${timing}. This isn't a normal new moon, expect something to open or close fast, on its own timeline.`,
              },
              lunar_eclipse: {
                label: "lunar eclipse",
                body: `a lunar eclipse lands in ${event.sign.toLowerCase()} ${timing}. Endings land harder here, if something's been overdue to close, this is when it actually does.`,
              },
              node_ingress: {
                label: "the nodal axis shifts",
                body: `the collective's north node moves into ${event.sign.toLowerCase()} ${timing}, the whole cultural growth direction resets for the next ~18 months. Genuinely rare, worth knowing about.`,
              },
              full_moon: {
                label: "full moon",
                body: `a full moon lands in ${event.sign.toLowerCase()} ${timing}. This is the peak of the cycle, the point things become visible whether or not you went looking. Good for finishing, deciding and releasing what the light just made obvious.`,
              },
              new_moon: {
                label: "new moon",
                body: `a new moon lands in ${event.sign.toLowerCase()} ${timing}. The darkest point of the cycle and the start of a fresh one, which makes it the moment to begin something rather than to keep planning it.`,
              },
            }[event.type as "solar_eclipse" | "lunar_eclipse" | "node_ingress" | "full_moon" | "new_moon"];

            return (
              <Link
                key={`${event.type}-${event.date}`}
                href={href}
                className="no-underline p-6 flex items-start gap-4 hover:opacity-90 transition-opacity"
                style={{
                  borderBottom: showBorder ? "var(--border)" : undefined,
                  background: "var(--dark)",
                  color: "#fff",
                }}
              >
                <div style={{ minWidth: 90 }}>
                  <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800 }}>{formatDate(event.date)}</div>
                  <div
                    style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: isNow ? "var(--pink)" : "var(--lav)", marginTop: 2,
                    }}
                  >
                    {timing}
                  </div>
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 4 }}>
                    {copy.label}
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>{copy.body}</p>
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", whiteSpace: "nowrap" }}>
                  read more →
                </div>
              </Link>
            );
            }

            const t = item.transit;
            const until = daysUntil(t.date);
            const isNow = until <= 0;
            const timing = isNow ? "happening now" : until === 1 ? "tomorrow" : `in ${until} days`;
            const href =
              `/your-season/transit?type=${t.type}&date=${t.date}&planet=${encodeURIComponent(t.planet)}` +
              (t.sign ? `&sign=${encodeURIComponent(t.sign)}` : "") +
              (t.otherPlanet ? `&otherPlanet=${encodeURIComponent(t.otherPlanet)}` : "") +
              (t.aspectType ? `&aspectType=${t.aspectType}` : "");

            const label =
              t.type === "ingress"
                ? `${t.planet} shifts era`
                : t.type === "aspect"
                  ? `${t.planet} ${t.aspectType} ${t.otherPlanet}`
                  : t.type === "retrograde_start"
                    ? `${t.planet} turns retrograde`
                    : `${t.planet} turns direct`;

            const body =
              t.type === "ingress"
                ? `${t.planet} moves into ${t.sign?.toLowerCase()} ${timing}, a slow, generational shift, not a today thing, but a whole-era one.`
                : t.type === "aspect"
                  ? `A rare ${t.aspectType} between ${t.planet} and ${t.otherPlanet} lands ${timing}, the kind of backdrop the whole collective is working against right now.`
                  : t.type === "retrograde_start"
                    ? `${t.planet} stations retrograde ${timing}, its domain turns inward for review over the coming weeks.`
                    : `${t.planet} stations direct ${timing}, the review period clears and forward motion becomes reliable again.`;

            return (
              <Link
                key={`${t.type}-${t.date}-${t.planet}`}
                href={href}
                className="no-underline p-6 flex items-start gap-4 hover:opacity-90 transition-opacity"
                style={{
                  borderBottom: showBorder ? "var(--border)" : undefined,
                  background: "var(--dark)",
                  color: "#fff",
                }}
              >
                <div style={{ minWidth: 90 }}>
                  <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800 }}>{formatDate(t.date)}</div>
                  <div
                    style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: isNow ? "var(--pink)" : "var(--lav)", marginTop: 2,
                    }}
                  >
                    {timing}
                  </div>
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)", marginBottom: 4 }}>
                    this season&apos;s bigger picture
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>
                    <strong style={{ color: "#fff" }}>{label}. </strong>
                    {body}
                  </p>
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", whiteSpace: "nowrap" }}>
                  read more →
                </div>
              </Link>
            );
          })}
          {data.mercuryRetrogradeNow && (
            <div className="p-6" style={{ background: "var(--gold)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#854F0B", marginBottom: 4 }}>
                right now
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#854F0B" }}>
                Mercury is retrograde. Reread before you send, review before you sign, this window is for revisiting, not launching.
              </p>
            </div>
          )}
          {showShadow && data.mercuryShadow && (
            <div className="p-6" style={{ background: "var(--gold)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#854F0B", marginBottom: 4 }}>
                right now · mercury shadow
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#854F0B" }}>
                {data.mercuryShadow.phase === "post"
                  ? `Mercury stationed direct on ${formatDate(data.mercuryShadow.date)}, but it's still in its post-retrograde shadow, retracing the same degrees for about two weeks. Treat this as clearing the backlog, not a fresh green light yet.`
                  : `Mercury enters its pre-retrograde shadow around ${formatDate(data.mercuryShadow.date)}, the run-up where things start feeling slightly off before the retrograde officially begins. Worth finishing up loose ends now.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
