"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { britishDate } from "@/lib/format-date";
import type { BirthdayReading } from "@/lib/birthday-reading";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Her birthday reading: the year from this birthday to the next, read from her solar return and
// her annual profection (see src/lib/birthday-reading.ts). The birthday email links here.

const ord = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

function londonToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

const label: React.CSSProperties = { fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 8 };
const cardTitle: React.CSSProperties = { fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.2, color: "var(--dark)", marginBottom: 10 };
const body: React.CSSProperties = { fontSize: 15, lineHeight: 1.75, color: "var(--dark)" };

function Card({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "var(--border)", padding: 22 }}>
      <div style={label}>{kicker}</div>
      <h3 style={cardTitle}>{title}</h3>
      <div style={body}>{children}</div>
    </div>
  );
}

export default function BirthdayReadingPage() {
  const [data, setData] = useState<{ name: string | null; reading: BirthdayReading } | null>(null);
  const [problem, setProblem] = useState<"no_birth_data" | "error" | null>(null);

  useEffect(() => {
    fetch("/api/birthday-reading", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (r.ok) setData(d);
        else setProblem(d.error === "no_birth_data" ? "no_birth_data" : "error");
      })
      .catch(() => setProblem("error"));
  }, []);

  if (problem) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 460 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            {problem === "no_birth_data" ? "add your birth details first, babe." : "that didn't load, my love."}
          </h1>
          <p style={{ ...body, marginBottom: 20 }}>
            {problem === "no_birth_data"
              ? "Your birthday reading is made from your chart, so pop your birth details in and it'll be right here waiting."
              : "Give it a refresh in a sec. If it keeps happening, message me and I'll sort it."}
          </p>
          <Link href={problem === "no_birth_data" ? "/onboarding" : "/messages"} className="btn-pink no-underline">
            {problem === "no_birth_data" ? "add my birth details" : "message betty"}
          </Link>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <p style={body}>reading your year... 🎂</p>
      </section>
    );
  }

  const { name, reading: r } = data;
  const isToday = r.yearStart === londonToday();

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ ...label, marginBottom: 14 }}>your birthday reading 🎂</div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(32px, 5.5vw, 56px)", fontWeight: 800, letterSpacing: "-1.4px", lineHeight: 1.02, color: "#fff", textTransform: "lowercase" }}>
            {isToday ? "happy birthday" : "your birthday year"}
            {name ? <>, <span className="pk">{name.toLowerCase()}.</span></> : <span className="pk">.</span>}
          </h1>
          <p style={{ fontSize: 16, color: "#fff", lineHeight: 1.75, maxWidth: 620, marginTop: 16 }}>
            {isToday ? "Your new year starts TODAY. " : ""}
            From the {britishDate(r.yearStart)} to the {britishDate(r.yearEnd)}, you&apos;re {r.age}, and this is what your chart says the year is all about.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12" style={{ background: "var(--lav-light)" }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* The headline: her profection year */}
          <div style={{ background: "var(--pink)", border: "var(--border)", padding: "26px 24px" }}>
            <div style={{ ...label, color: "var(--dark)" }}>the theme of your year · your {ord(r.year.house)} house</div>
            <h2 style={{ fontFamily: poppins, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.05, color: "var(--dark)", marginBottom: 6 }}>
              {r.year.title}.
            </h2>
            <p style={{ fontFamily: poppins, fontSize: 14, fontWeight: 700, color: "var(--dark)", marginBottom: 14 }}>{r.year.area}</p>
            <p style={{ ...body, maxWidth: 680 }}>{r.year.body}</p>
            <div style={{ background: "#fff", border: "var(--border)", padding: "16px 18px", marginTop: 18 }}>
              <div style={{ ...label, marginBottom: 10 }}>your moves this year</div>
              <ul style={{ margin: 0, paddingLeft: 18, listStyle: "disc", ...body }}>
                {r.year.moves.map((m) => (
                  <li key={m} style={{ marginBottom: 4 }}>{m}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card kicker="who's running your year" title={r.lord.title}>
              <p>{r.lord.body}</p>
              <p style={{ marginTop: 10, fontWeight: 700 }}>
                In your birth chart, {r.lord.planet === "Sun" || r.lord.planet === "Moon" ? `the ${r.lord.planet}` : r.lord.planet} sits in your {ord(r.lord.natalHouse)} house, so that part of your life gets pulled into everything this year.
              </p>
            </Card>
            {r.rising && (
              <Card kicker="how you show up" title={`${r.rising.sign} rising`}>
                <p>{r.rising.body}</p>
              </Card>
            )}
            <Card kicker="what you need" title={`your ${r.moon.sign} Moon year`}>
              <p>{r.moon.body}</p>
            </Card>
            <Card kicker="where life gets bigger" title={`Jupiter in your ${ord(r.jupiter.house)} house`}>
              <p>{r.jupiter.body}</p>
            </Card>
            <Card kicker="where you build" title={`Saturn in your ${ord(r.saturn.house)} house`}>
              <p>{r.saturn.body}</p>
            </Card>
          </div>

          {r.usesSunHouses && (
            <div style={{ background: "#fff", border: "2px solid var(--pink)", padding: "16px 18px" }}>
              <p style={{ ...body, fontSize: 14 }}>
                <strong>No exact birth time on your account yet</strong>, so your houses here are counted from your Sun sign. Add your birth time and this whole reading sharpens up, including your rising sign for the year.{" "}
                <Link href="/settings" style={{ color: "var(--pink)", fontWeight: 700 }}>add my birth time →</Link>
              </p>
            </div>
          )}

          <p style={{ ...body, fontSize: 13, marginTop: 4 }}>
            Made from your solar return (your chart for the exact moment the Sun came back to where it was when you were born) and your profection year (the part of your chart your age switches on).
          </p>
        </div>
      </section>
    </>
  );
}
