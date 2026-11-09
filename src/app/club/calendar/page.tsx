"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MANIFESTATION_CALENDAR } from "@/lib/manifestation-calendar";

const pp = "var(--font-poppins), Poppins, sans-serif";
const RULE = "2px solid var(--dark)";
const ONE_DAY = 86400000;

const ROWS = [
  ["✨ your intention", "intention"],
  ["🕯️ mini ritual", "ritual"],
  ["📓 journal on this", "journal"],
] as const;

export default function ManifestationCalendarPage() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  const months = MANIFESTATION_CALENDAR.map((m) => ({
    ...m,
    days: m.days.filter((d) => now === null || d.at + ONE_DAY > now),
  })).filter((m) => m.days.length > 0);

  return (
    <main className="px-5 md:px-8" style={{ background: "var(--lav-light)", color: "var(--dark)", paddingTop: 40, paddingBottom: 70 }}>
      <div className="max-w-6xl mx-auto">
        <Link href="/club" style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, color: "var(--dark)" }}>← back to the club</Link>
        <h1 className="display" style={{ fontSize: "clamp(46px, 8vw, 96px)", lineHeight: 0.96, marginTop: 18 }}>
          the manifestation <span className="pk">calendar.</span>
        </h1>

        {months.map((m) => (
          <section key={m.month} style={{ marginTop: 40 }}>
            <div style={{ background: "var(--dark)", color: "#fff", padding: "22px 22px 24px" }}>
              <h2 className="display" style={{ fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1, color: "#fff" }}>{m.month}</h2>
              <p style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 700, margin: "8px 0 0" }}>{m.focus}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 16, marginTop: 16, alignItems: "start" }}>
              {m.days.map((d) => (
                <article key={d.id} style={{ background: "#fff", border: RULE, padding: "20px 20px 22px" }}>
                  <div className="flex items-center justify-between gap-3">
                    <span style={{ fontFamily: pp, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.date}</span>
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{d.emoji}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>{d.time}</div>
                  <h3 style={{ fontFamily: pp, fontSize: 23, fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.02em", margin: "12px 0 0" }}>{d.title}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.5, margin: "8px 0 0" }}>{d.meaning}</p>
                  {ROWS.map(([label, key]) => (
                    <div key={key} style={{ background: "var(--lav-light)", padding: "11px 13px", marginTop: 10 }}>
                      <div style={{ fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                      <div style={{ fontSize: 15.5, lineHeight: 1.45, fontWeight: key === "intention" ? 800 : 500, marginTop: 3 }}>{d[key]}</div>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
