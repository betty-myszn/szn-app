"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { card, sectionTitle, label, blackBtn, pinkBtn, pp } from "@/lib/eleven-eleven-hub";
import { HoloStar } from "@/components/eleven-eleven/Shared";
import LeapGate, { LeapLoadFailed } from "@/components/quantum-leap/LeapGate";
import { useQuantumLeap } from "@/lib/use-quantum-leap";
import { QL_DAYS, QL_PATH, dayHref, dayDateShort, todayNumber, loadDone, type LeapAllPayload } from "@/lib/quantum-leap";

// The members' Sagittarius SZN page: the season's challenge, The Quantum Leap Experiment. Today's
// move up top, then all thirty days by week, each one opening its own page.

const HOW: [string, string, string][] = [
  ["🪩", "open today's day", "Every morning there's a brand new move with its own page: the astrology, my take and exactly how to do it."],
  ["✍️", "write it down", "Everything you write saves straight into your journal, ready for your big Quantum Leap Review on Day 29."],
  ["🧾", "log the evidence", "Two minutes every night: money in, yeses, signs, brave convos and new people. This is where the magic gets PROVEN."],
];

function SagSznBody({ weeks, days }: LeapAllPayload) {
  const [now, setNow] = useState<number | null>(null);
  const [done, setDone] = useState<number[]>([]);
  useEffect(() => {
    setNow(Date.now());
    setDone(loadDone());
  }, []);

  const todayN = now === null ? 0 : todayNumber(now);
  const featuredN = todayN >= 1 && todayN <= QL_DAYS ? todayN : todayN > QL_DAYS ? QL_DAYS : 1;
  const featured = days.find((d) => d.n === featuredN) ?? days[0];
  const isToday = todayN >= 1 && todayN <= QL_DAYS;

  return (
    <main style={{ background: "#fff", color: "var(--dark)" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 72, display: "grid", gap: 48 }}>
        <nav aria-label="Back" className="flex flex-wrap gap-2">
          <Link href="/coven" className="no-underline" style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "9px 14px", borderRadius: 999, border: "var(--border)", background: "#fff", color: "var(--dark)", boxShadow: "3px 3px 0 var(--dark)" }}>← the coven</Link>
        </nav>

        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr]" style={{ position: "relative", borderRadius: 26, overflow: "hidden", border: "var(--border)", boxShadow: "8px 8px 0 var(--dark)" }}>
          <div className="hd-foil" style={{ padding: "clamp(26px, 4vw, 44px)" }}>
            <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "7px 14px", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", transform: "rotate(-2deg)" }}>🏹 sagittarius szn · the quantum leap experiment</span>
            <h1 className="display" style={{ fontSize: "clamp(46px, 7vw, 88px)", lineHeight: 0.95, marginTop: 18 }}>how to create a biggggg f*cking life.</h1>
            <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "14px 0 0", maxWidth: 560 }}>
              Sagittarius szn is HERE, babe, and Jupiter&apos;s sign means expansion, adventure and BIGGGG dreams. For the next thirty days we&apos;re running the Quantum Leap Experiment together: one bold move a day, a two-minute evidence log every night and a whole coven of baddies cheering you on, so you walk into 2027 already living like her. 💖🪩💸
            </p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 20 }}>
              {[["the experiment", "30 days"], ["runs", "22 nov to 21 dec"], ["ruled by", "jupiter"]].map(([k, v]) => (
                <div key={k} className="szn-holo" style={{ border: "2px solid var(--dark)", borderRadius: 14, boxShadow: "3px 3px 0 var(--dark)", padding: "10px 16px", minWidth: 96 }}>
                  <div style={{ fontFamily: pp, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>{k}</div>
                  <div className="display" style={{ fontSize: 24, lineHeight: 1 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coven/baddie-money-pink.jpg" alt="" className="block w-full aspect-[4/3] md:aspect-auto md:h-full" style={{ objectFit: "cover", objectPosition: "50% 25%" }} />
          </div>
          <HoloStar size={58} style={{ bottom: 18, right: 18 }} />
        </section>

        {/* Today */}
        <section className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6" style={{ borderRadius: 26, padding: "clamp(26px, 4vw, 44px)", color: "#fff" }}>
          <div>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>
              {isToday ? `✨ today is day ${featured.n}` : todayN > QL_DAYS ? "👑 you did all thirty, babe" : "✨ day one starts the szn"}
            </span>
            <h2 className="display" style={{ fontSize: "clamp(36px, 5.4vw, 64px)", lineHeight: 0.98, marginTop: 16, color: "#fff" }}>{featured.emoji} {featured.title.toLowerCase()}.</h2>
            <p style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 700, margin: "12px 0 0", maxWidth: 640 }}>{featured.move}</p>
          </div>
          <Link href={dayHref(featured.n)} className="no-underline" style={{ ...pinkBtn, justifySelf: "start" }}>open day {featured.n} →</Link>
        </section>

        {/* How it works */}
        <section>
          <h2 className="display" style={sectionTitle}>how the <span className="pk">experiment works.</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ marginTop: 22 }}>
            {HOW.map(([e, t, b], i) => (
              <div key={t} className="holo-edge" style={{ ...card, padding: "22px 22px 24px", background: i === 0 ? "#fff" : i === 1 ? "var(--pink-light)" : "var(--lav-light)", border: "var(--border)" }}>
                <span style={{ background: "#fff", width: 56, height: 56, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 26, boxShadow: "3px 3px 0 var(--dark)" }}>{e}</span>
                <div className="display" style={{ fontSize: 28, lineHeight: 1, marginTop: 14 }}>{t}.</div>
                <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0" }}>{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* All thirty days, by week */}
        {weeks.map((w) => (
          <section key={w.n}>
            <div style={{ background: "var(--dark)", color: "#fff", borderRadius: 20, padding: "22px 22px 24px" }}>
              <div style={{ ...label, color: "#fff" }}>week {w.n} · days {w.days[0]} to {w.days[1]}</div>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4.8vw, 56px)", lineHeight: 1, color: "#fff", marginTop: 6 }}>{w.name}.</h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.5, fontWeight: 700, margin: "8px 0 0" }}>{w.line}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 16 }}>
              {days.filter((d) => d.n >= w.days[0] && d.n <= w.days[1]).map((d) => {
                const today = d.n === todayN;
                const ticked = done.includes(d.n);
                return (
                  <Link key={d.n} href={dayHref(d.n)} className="no-underline holo-edge" style={{ ...card, border: "var(--border)", padding: "18px 18px 20px", background: today ? "var(--pink)" : ticked ? "var(--lav-light)" : "#fff", position: "relative" }}>
                    <div className="flex items-center justify-between gap-3">
                      <span style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>day {String(d.n).padStart(2, "0")} · {dayDateShort(d.n)}</span>
                      <span style={{ fontSize: 26, lineHeight: 1 }}>{ticked ? "✅" : d.emoji}</span>
                    </div>
                    {today && <span style={{ display: "inline-block", marginTop: 10, background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 10px", transform: "rotate(-2deg)" }}>today ✨</span>}
                    <div className="display" style={{ fontSize: 26, lineHeight: 1.02, marginTop: 10 }}>{d.title.toLowerCase()}.</div>
                    <p style={{ fontSize: 15, lineHeight: 1.45, fontWeight: 600, margin: "8px 0 0" }}>{d.move}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <section className="hd-foil flex flex-wrap items-center gap-4" style={{ borderRadius: 20, padding: "20px 24px", border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)" }}>
          <span style={{ background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 11px", transform: "rotate(-2deg)" }}>every friday</span>
          <span className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.1 }}>post your week&apos;s proof on the wins wall in the coven chat, then hype three other baddies.</span>
          <Link href="/community" className="no-underline" style={blackBtn}>open baddie chat →</Link>
        </section>
      </div>
    </main>
  );
}

function SagSznLoader() {
  const { data, done } = useQuantumLeap<LeapAllPayload>("all=1");
  if (!done) return null;
  if (!data) return <LeapLoadFailed />;
  return <SagSznBody weeks={data.weeks} days={data.days} />;
}

export default function SagSznPage() {
  return (
    <LeapGate path={QL_PATH}>
      <SagSznLoader />
    </LeapGate>
  );
}
