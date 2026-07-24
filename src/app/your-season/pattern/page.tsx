"use client";

import { useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { HOUSE_MEANINGS, SIGN_TRAITS, ordinalHouse, houseForSign } from "@/lib/interpretations";
import { getPatternBreaking, whyPatternFormed, getPatternBreakSteps } from "@/lib/season-coaching";
import { addJournalEntry } from "@/lib/journal-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function PatternPage() {
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const season = useSeason();
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  if (!ready || loading) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            members only, babe.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (!chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            add your birth details first.
          </h1>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  const name = chart.birthData.name || "babe";
  const cusps = chart.houses.map((h) => h.longitude);
  const activatedHouse = houseForSign(season.sign, cusps);
  const houseMeaning = HOUSE_MEANINGS[activatedHouse - 1];
  const traits = SIGN_TRAITS[season.sign];
  const pattern = getPatternBreaking(season.sign);
  const why = whyPatternFormed(season.sign, name);
  const steps = getPatternBreakSteps(season.sign);

  const journalPrompt = `Where has "${pattern.pattern}" cost me the most this year? What would ${name === "babe" ? "I" : name} do instead if I were already the woman who ${pattern.replacingWith.replace(/^a woman who /, "")}?`;

  const saveReflection = () => {
    if (!reflection.trim()) return;
    addJournalEntry({
      type: "shadow work",
      prompt: journalPrompt,
      content: reflection.trim(),
      season: season.sign,
    });
    setReflection("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/your-season"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← your season
          </Link>
          <div className="tag mb-2" style={{ marginTop: 18 }}>{season.sign.toLowerCase()} szn · the pattern you&apos;re breaking</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(28px, 4.5vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.15,
              color: "#fff",
              marginBottom: 14,
              maxWidth: 720,
            }}
          >
            {name}, you&apos;re done <span className="pk">{pattern.pattern}.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 580 }}>
            Not a summary, the actual work: why this pattern formed, exactly where it&apos;s still showing up, and three real steps to practise the woman replacing her this szn.
          </p>
        </div>
      </section>

      {/* Old identity / new identity, full */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ background: "var(--pink)", borderRight: "var(--border)" }}>
            <div className="tag mb-3" style={{ color: "#fff" }}>the old identity</div>
            <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.35, color: "#fff", marginBottom: 16 }}>
              {pattern.pattern}.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.9)" }}>{why}</p>
          </div>
          <div className="p-8">
            <div className="tag mb-3">who you&apos;re replacing her with</div>
            <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.35, color: "var(--dark)", marginBottom: 16 }}>
              {pattern.replacingWith}.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>
              This isn&apos;t a mindset shift you think your way into, it&apos;s built by small, repeated choices, the ones below, not a single decision made once.
            </p>
          </div>
        </div>
      </section>

      {/* Where it's actually showing up */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <div className="tag mb-3">where it&apos;s actually showing up for you this szn</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70" }}>
            {`${season.sign} szn is activating your ${ordinalHouse(activatedHouse)} house of ${houseMeaning.title}, so this pattern isn't showing up as an abstract idea, it's showing up specifically around ${houseMeaning.lifeAreas.slice(0, 2).join(" and ")}. That's the exact territory to watch for it in real time, not somewhere safer or more theoretical.`}
          </p>
        </div>
      </section>

      {/* Break it this week */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-2">break it this week</div>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 20 }}>
            three real steps, not three more things to think about.
          </h2>
          <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
            {steps.map((step, i) => (
              <div key={i} className="p-6 flex gap-5 items-start" style={{ borderBottom: i < steps.length - 1 ? "var(--border)" : undefined }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 32, height: 32, border: "1.5px solid var(--pink)", fontFamily: poppins, fontWeight: 800, fontSize: 14, color: "var(--pink)" }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey)", paddingTop: 5 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal reflection */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
          <div className="tag mb-4" style={{ color: "var(--pink)" }}>journal on it</div>
          <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.5, color: "#fff", marginBottom: 18 }}>
            {journalPrompt}
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="write it here..."
            rows={4}
            className="w-full mb-4"
            style={{ border: "1.5px solid rgba(255,255,255,0.25)", outline: "none", padding: "14px 16px", fontSize: 14, lineHeight: 1.7, resize: "vertical", fontFamily: "inherit", background: "rgba(255,255,255,0.05)", color: "#fff" }}
          />
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={saveReflection} className="btn-pink" style={{ cursor: "pointer" }}>
              save to journal
            </button>
            {saved && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)" }}>saved. that&apos;s the work. ✦</span>}
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginLeft: "auto" }}>
              &ldquo;{traits.growth.charAt(0).toUpperCase() + traits.growth.slice(1)}.&rdquo;
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
