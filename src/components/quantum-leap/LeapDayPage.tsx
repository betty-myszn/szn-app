"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useChart } from "@/lib/use-chart";
import { houseForLongitude } from "@/lib/interpretations";
import { addJournalEntry } from "@/lib/journal-store";
import { ORD, PORTAL_HOUSES, card, label, pinkBtn, blackBtn, pp } from "@/lib/eleven-eleven-hub";
import { HoloStar } from "@/components/eleven-eleven/Shared";
import LeapGate, { LeapLoadFailed } from "@/components/quantum-leap/LeapGate";
import { useQuantumLeap } from "@/lib/use-quantum-leap";
import {
  dayHref, dayDateLong, loadDone, markDone, NEW_MOON_LON, JUPITER_STATION_LON,
  QL_DAYS, QL_PATH, type LeapDay, type LeapDayPayload, type LeapWeek,
} from "@/lib/quantum-leap";

const field: CSSProperties = { display: "block", width: "100%", minHeight: 130, marginTop: 12, padding: "14px 16px", border: "var(--border)", borderRadius: 14, fontSize: 16, lineHeight: 1.5, fontFamily: "inherit", color: "var(--dark)", background: "#fff", resize: "vertical" };
const pill: CSSProperties = { fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "9px 14px", borderRadius: 999, border: "var(--border)", background: "#fff", color: "var(--dark)", boxShadow: "3px 3px 0 var(--dark)" };

// Her chart, read for the three days that have a personal angle (Jupiter, the New Moon, Jupiter's
// retrograde station). Without a chart it nudges her to add one.
function InYourChart({ day, jupiterSign }: { day: LeapDay; jupiterSign?: Record<string, string> }) {
  const { chart } = useChart();
  const cusps = chart?.houses?.length === 12 ? chart.houses.map((h) => h.longitude) : null;
  let title = "";
  let body = "";
  if (day.personal === "jupiter-natal") {
    const j = chart?.planets.find((p) => p.name === "Jupiter");
    if (j) {
      title = `your jupiter is in ${j.sign.toLowerCase()}, in your ${ORD[j.house]} house.`;
      const area = PORTAL_HOUSES[j.house]?.[0];
      body = `${jupiterSign?.[j.sign] ?? ""}${area ? ` Your ${ORD[j.house]} house is ${area}, so THAT'S where your jackpot loves to land, babe. 🍀` : ""}`;
    }
  } else if (cusps) {
    const lon = day.personal === "new-moon" ? NEW_MOON_LON : JUPITER_STATION_LON;
    const h = houseForLongitude(lon, cusps);
    const [area, line] = PORTAL_HOUSES[h] ?? ["", ""];
    if (day.personal === "new-moon") {
      title = `this new moon lands in your ${ORD[h]} house.`;
      body = `That's ${area}: ${line} Point every single prosperity intention right at it, babe. 🌑`;
    } else {
      title = `jupiter turns retrograde in your ${ORD[h]} house.`;
      body = `That's ${area}, the part of your life Jupiter's been growing allll season. For the next few months it reviews instead, so keep what's truly YOURS there and let the rest go.`;
    }
  }

  return (
    <section className="holo-edge" style={{ ...card, background: "var(--lav)", padding: "clamp(22px, 3.4vw, 32px)" }}>
      <div style={label}>✨ in your chart</div>
      {title ? (
        <>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1, marginTop: 8 }}>{title}</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.55, fontWeight: 600, margin: "10px 0 0" }}>{body}</p>
        </>
      ) : (
        <>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1, marginTop: 8 }}>find it in YOUR chart.</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.55, fontWeight: 600, margin: "10px 0 14px" }}>Add your birth details and this shows you exactly where it lands for you, babe.</p>
          <Link href="/my-chart" className="no-underline" style={blackBtn}>open my chart →</Link>
        </>
      )}
    </section>
  );
}

function WriteBox({ day, onDone }: { day: LeapDay; onDone: () => void }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const save = () => {
    if (!text.trim()) return;
    addJournalEntry({ type: "experiment", prompt: `Quantum Leap Day ${day.n}: ${day.title}. ${day.prompt}`, content: text.trim(), season: "Sagittarius" });
    markDone(day.n);
    setSaved(true);
    onDone();
  };
  return (
    <section className="holo-edge" style={{ ...card, padding: "clamp(22px, 3.4vw, 32px)", border: "var(--border)" }}>
      <div style={label}>✍️ write it ALL down</div>
      <p style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, lineHeight: 1.3, margin: "8px 0 0" }}>{day.prompt}</p>
      {saved ? (
        <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 700, margin: "14px 0 0" }}>Saved to your journal, babe ✨ Day {day.n} is DONE.</p>
      ) : (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} aria-label={day.prompt} placeholder="go on, write the big version…" style={field} />
          <button type="button" onClick={save} style={{ ...pinkBtn, marginTop: 14 }}>save to my journal ✨</button>
        </>
      )}
    </section>
  );
}

function EvidenceLog({ n }: { n: number }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const save = () => {
    if (!text.trim()) return;
    addJournalEntry({ type: "win", prompt: `Quantum Leap Day ${n}: tonight's evidence log`, content: text.trim(), season: "Sagittarius" });
    setSaved(true);
  };
  return (
    <section className="hd-foil" style={{ borderRadius: 20, padding: "clamp(22px, 3.4vw, 30px)", border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)" }}>
      <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 11px", transform: "rotate(-2deg)" }}>🧾 tonight&apos;s evidence log</span>
      <p style={{ fontSize: 16.5, lineHeight: 1.5, fontWeight: 700, margin: "12px 0 0" }}>Two minutes before bed: money in, yeses, signs from the universe, brave convos and new people. Log it ALL, this is where the magic gets proven.</p>
      {saved ? (
        <p style={{ fontSize: 17, fontWeight: 800, margin: "12px 0 0" }}>Logged, babe 💖 the evidence is piling UP.</p>
      ) : (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} aria-label="Tonight's evidence log" placeholder="$ in, yeses, signs, brave convos, new people…" style={{ ...field, minHeight: 96 }} />
          <button type="button" onClick={save} style={{ ...blackBtn, marginTop: 12 }}>log my evidence</button>
        </>
      )}
    </section>
  );
}

function DayBody({ day, week, jupiterSign }: { day: LeapDay; week: LeapWeek; jupiterSign?: Record<string, string> }) {
  const [done, setDone] = useState(false);
  useEffect(() => setDone(loadDone().includes(day.n)), [day.n]);

  return (
    <main style={{ background: "#fff", color: "var(--dark)" }}>
      <div className="max-w-4xl mx-auto px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 72, display: "grid", gap: 28 }}>
        <nav aria-label="Quantum Leap" className="flex flex-wrap gap-2">
          <Link href={QL_PATH} className="no-underline" style={pill}>← all 30 days</Link>
          <span style={{ ...pill, background: "var(--dark)", color: "#fff" }}>week {week.n} · {week.name}</span>
        </nav>

        {/* The day */}
        <section style={{ position: "relative", borderRadius: 26, overflow: "hidden", border: "var(--border)", boxShadow: "8px 8px 0 var(--dark)" }}>
          <div className="hd-foil" style={{ padding: "clamp(26px, 4vw, 44px)" }}>
            <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "7px 14px", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", transform: "rotate(-2deg)" }}>
              {day.emoji} day {String(day.n).padStart(2, "0")} of {QL_DAYS}
            </span>
            <div style={{ ...label, marginTop: 16 }}>{dayDateLong(day.n)}{done ? " · ✓ done" : ""}</div>
            <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 84px)", lineHeight: 0.95, marginTop: 8 }}>{day.title.toLowerCase()}.</h1>
            <p style={{ background: "#fff", border: "var(--border)", borderRadius: 16, boxShadow: "4px 4px 0 var(--dark)", fontFamily: pp, fontSize: "clamp(18px, 2.4vw, 23px)", fontWeight: 800, lineHeight: 1.3, padding: "16px 18px", margin: "18px 0 0" }}>
              {day.move}
            </p>
            <div aria-hidden="true" style={{ marginTop: 20, height: 10, borderRadius: 999, background: "#fff", border: "2px solid var(--dark)", overflow: "hidden" }}>
              <div style={{ width: `${(day.n / QL_DAYS) * 100}%`, height: "100%", background: "var(--dark)" }} />
            </div>
          </div>
          <HoloStar size={52} style={{ top: 16, right: 18 }} />
        </section>

        {/* The sky today */}
        {day.sky && (
          <section className="holo-edge bg-glitter" style={{ borderRadius: 22, padding: "clamp(22px, 3.4vw, 32px)", color: "#fff" }}>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>✨ the sky today</span>
            <h2 className="display" style={{ fontSize: "clamp(30px, 4.4vw, 46px)", lineHeight: 1, marginTop: 14, color: "#fff" }}>{day.sky.emoji} {day.sky.name}.</h2>
            <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 8 }}>{day.sky.time}</div>
            <p style={{ fontSize: 16.5, lineHeight: 1.55, fontWeight: 600, margin: "10px 0 0" }}>{day.sky.line}</p>
          </section>
        )}

        {day.personal && <InYourChart day={day} jupiterSign={jupiterSign} />}

        {/* Why + Betty's take */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="holo-edge" style={{ ...card, background: "var(--pink-light)", padding: "clamp(22px, 3.2vw, 28px)" }}>
            <div style={label}>💖 why this move, babe</div>
            <p style={{ fontSize: 16.5, lineHeight: 1.55, fontWeight: 600, margin: "10px 0 0" }}>{day.why}</p>
          </div>
          <div className="holo-edge" style={{ ...card, background: "var(--lav-light)", padding: "clamp(22px, 3.2vw, 28px)" }}>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/coven/betty-coven-card.jpg" alt="Betty" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", objectPosition: "50% 20%", border: "var(--border)" }} />
              <div style={label}>👑 betty&apos;s take</div>
            </div>
            <p style={{ fontSize: 16.5, lineHeight: 1.55, fontWeight: 600, margin: "10px 0 0" }}>{day.take}</p>
          </div>
        </section>

        {/* How to do it */}
        <section className="holo-edge" style={{ ...card, padding: "clamp(22px, 3.4vw, 32px)", border: "var(--border)" }}>
          <div style={label}>🪄 how to do it</div>
          <ol style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 12 }}>
            {day.steps.map((s, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span style={{ flex: "0 0 auto", width: 34, height: 34, borderRadius: "50%", background: "var(--pink)", border: "var(--border)", display: "grid", placeItems: "center", fontFamily: pp, fontWeight: 800, fontSize: 15 }}>{i + 1}</span>
                <span style={{ fontSize: 16.5, lineHeight: 1.5, fontWeight: 600, paddingTop: 4 }}>{s}</span>
              </li>
            ))}
          </ol>
          {day.link && (
            <Link href={day.link[1]} className="no-underline" style={{ ...blackBtn, marginTop: 20 }}>{day.link[0]} →</Link>
          )}
        </section>

        <WriteBox day={day} onDone={() => setDone(true)} />

        <EvidenceLog n={day.n} />

        <Link href="/community" className="no-underline" style={{ ...pinkBtn, justifySelf: "start" }}>💬 tell the coven what you did</Link>

        {/* Day to day */}
        <nav aria-label="Previous and next day" className="flex flex-wrap justify-between gap-3">
          {day.n > 1 ? <Link href={dayHref(day.n - 1)} className="no-underline" style={pill}>← day {day.n - 1}</Link> : <span />}
          {day.n < QL_DAYS ? (
            <Link href={dayHref(day.n + 1)} className="no-underline" style={{ ...pill, background: "var(--dark)", color: "#fff" }}>day {day.n + 1} →</Link>
          ) : (
            <Link href={QL_PATH} className="no-underline" style={{ ...pill, background: "var(--dark)", color: "#fff" }}>all 30 days →</Link>
          )}
        </nav>
      </div>
    </main>
  );
}

function DayLoader({ n }: { n: number }) {
  const { data, done } = useQuantumLeap<LeapDayPayload>(`day=${n}`);
  if (!done) return null;
  if (!data) return <LeapLoadFailed />;
  return <DayBody day={data.day} week={data.week} jupiterSign={data.jupiterSign} />;
}

export default function LeapDayPage({ n }: { n: number }) {
  return (
    <LeapGate path={dayHref(n)}>
      <DayLoader n={n} />
    </LeapGate>
  );
}
