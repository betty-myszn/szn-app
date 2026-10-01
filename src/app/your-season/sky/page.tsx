"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { composeSky, type SkyAspect, type SkyEventType, type SkyInput, type SkyPlanet, type SkyTimeline } from "@/lib/personal-sky-content";
import { ZODIAC_SIGNS } from "@/types/chart";

// One fast-moving sky event, read for her: Mercury into Scorpio, Venus stationing, Mars opposite
// Pluto. Laid out as a thread (1/6, 2/6...) because that is how Betty writes these up, so the page
// reads like her post with every part after the collective layer rewritten for this member's chart.

const poppins = "var(--font-poppins), Poppins, sans-serif";
const PLANETS: SkyPlanet[] = ["Mercury", "Venus", "Mars"];
const TYPES: SkyEventType[] = ["now", "ingress", "retrograde_start", "retrograde_end", "aspect"];
const ASPECTS: SkyAspect[] = ["conjunction", "square", "opposition"];
const OTHERS = ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const isSign = (s: string | null): s is string => !!s && (ZODIAC_SIGNS as readonly string[]).includes(s);
const num = (s: string | null) => (s !== null && s !== "" && Number.isFinite(Number(s)) ? Number(s) : undefined);

function SkyPageContent() {
  const params = useSearchParams();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const [timeline, setTimeline] = useState<SkyTimeline | null>(null);

  const planet = params.get("planet") as SkyPlanet | null;
  const type = params.get("type") as SkyEventType | null;
  const sign = params.get("sign");
  const valid = !!planet && PLANETS.includes(planet) && !!type && TYPES.includes(type) && isSign(sign);

  // The stay in a sign (since, until, any stations inside it) comes from the live calendar rather
  // than the link, so an old link still reads correctly.
  useEffect(() => {
    if (!valid || type === "aspect") return;
    fetch("/api/calendar")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const now = (d?.personalNow ?? []).find((p: { planet: string; sign: string }) => p.planet === planet && p.sign === sign);
        if (now) setTimeline({ since: now.since, until: now.until, stations: now.stations ?? [] });
      })
      .catch(() => {});
  }, [valid, planet, sign, type]);

  if (!ready) return null;
  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>members only, babe.</h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
      </div>
    );
  }
  if (!chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>add your birth details to unlock this.</h1>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }
  if (!valid) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>we couldn&apos;t find that one.</h1>
          <Link href="/dashboard" className="btn-pink">back to my szn</Link>
        </div>
      </section>
    );
  }

  const other = params.get("other");
  const otherSign = params.get("otherSign");
  const aspect = params.get("aspect") as SkyAspect | null;
  const input: SkyInput = {
    planet: planet!,
    type: type!,
    sign: sign!,
    degree: num(params.get("degree")),
    date: params.get("date") ?? undefined,
    retrograde: params.get("rx") === "1",
    ...(type === "aspect" && other && OTHERS.includes(other) && isSign(otherSign) && aspect && ASPECTS.includes(aspect)
      ? { otherPlanet: other, otherSign, otherDegree: num(params.get("otherDegree")), aspectType: aspect }
      : {}),
  };
  const r = composeSky(input, chart, timeline);
  const total = r.parts.length + 2;
  const dateLabel = input.date ? new Date(`${input.date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "right now";

  const counter = (n: number) => (
    <span style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "var(--pink)" }}>
      {n}/{total}
    </span>
  );

  return (
    <>
      <section className="px-5 md:px-8 py-12" style={{ background: "var(--pink-bg)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="no-underline" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey)" }}>
            ← back to my szn
          </Link>
          <div className="tag" style={{ margin: "18px 0 10px" }}>
            the sky, for you · {dateLabel}
          </div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 0.98, textTransform: "lowercase", margin: "0 0 22px", textWrap: "balance" }}>
            <span className="szn-holo-text">{r.title}.</span>
          </h1>
          <div className="szn-holo" style={{ position: "relative", border: "2px solid var(--dark)", borderRadius: 20, padding: "22px 20px 18px", boxShadow: "5px 5px 0 var(--pink)" }}>
            <div style={{ marginBottom: 8 }}>{counter(1)}</div>
            <p style={{ fontFamily: poppins, fontSize: "clamp(18px, 2.6vw, 23px)", fontWeight: 800, lineHeight: 1.35, color: "var(--dark)", margin: 0 }}>{r.hook}</p>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {r.parts.map((part, i) => {
            const personal = part.heading === "where it lands for you" || part.heading.startsWith("your own");
            return (
              <article
                key={part.heading}
                style={{
                  border: personal ? "2px solid var(--pink)" : "1.5px solid var(--dark)",
                  borderRadius: 18,
                  padding: "20px 20px 18px",
                  background: personal ? "#fff" : i % 2 ? "var(--cream)" : "#fff",
                  boxShadow: personal ? "4px 4px 0 var(--pink)" : "none",
                  position: "relative",
                }}
              >
                {personal && <span className="szn-sticker">for you</span>}
                <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: 10 }}>
                  <h2 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", textTransform: "lowercase", margin: 0 }}>{part.heading}</h2>
                  {counter(i + 2)}
                </div>
                {part.paragraphs.map((para, j) => (
                  <p key={j} style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", margin: j === 0 ? 0 : "12px 0 0" }}>
                    {para}
                  </p>
                ))}
              </article>
            );
          })}

          <article className="szn-holo" style={{ border: "2px solid var(--dark)", borderRadius: 18, padding: "20px 20px 18px", boxShadow: "4px 4px 0 var(--dark)" }}>
            <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: 10 }}>
              <h2 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", textTransform: "lowercase", margin: 0 }}>your move</h2>
              {counter(total)}
            </div>
            <p style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, lineHeight: 1.45, color: "var(--dark)", margin: 0 }}>{r.move}</p>
          </article>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)", borderRadius: 18, overflow: "hidden" }}>
          <div className="p-8" style={{ background: "#fff" }}>
            <div className="tag mb-4">journal on it</div>
            <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 700, lineHeight: 1.5, color: "#3C2A70", marginBottom: 20 }}>{r.prompt}</p>
            <Link href="/journal" className="btn-pink">open my journal</Link>
          </div>
          <div className="p-8" style={{ background: "var(--pink)" }}>
            <div className="tag mb-4" style={{ color: "#fff" }}>your affirmation</div>
            <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, lineHeight: 1.3, color: "#fff" }}>&ldquo;{r.affirmation}&rdquo;</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function SkyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
        </div>
      }
    >
      <SkyPageContent />
    </Suspense>
  );
}
