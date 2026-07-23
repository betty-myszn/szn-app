"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import type { BirthData, BirthLocation } from "@/types/chart";
import { ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "@/types/chart";
import { saveBirthData, savePlacements, placementsFromChart, getSavedBirthData, type SavedPlacements } from "@/lib/url-params";
import { syncBirthDataToSupabase, syncChartToSupabase, markOnboarded } from "@/lib/chart-sync";
import { addGoal, CATEGORY_STYLES, type GoalCategory } from "@/lib/goals-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const inputStyle: React.CSSProperties = {
  border: "var(--border)",
  padding: "13px 16px",
  fontSize: 14,
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--grey-light)",
  marginBottom: 8,
};

export default function OnboardingPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [checkedExisting, setCheckedExisting] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [approx, setApprox] = useState(false);
  const [location, setLocation] = useState<BirthLocation | null>(null);
  const [goal, setGoal] = useState("");
  const [goalCategory, setGoalCategory] = useState<GoalCategory>("career");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justUpdated, setJustUpdated] = useState(false);
  const [revealPlacements, setRevealPlacements] = useState<SavedPlacements | null>(null);

  // Pre-fill from an existing chart so editing corrects a mistake instead of starting over
  useEffect(() => {
    const existing = getSavedBirthData();
    if (existing) {
      setIsEditing(true);
      setName(existing.name);
      setDob(existing.dateOfBirth);
      setTime(existing.birthTime);
      setApprox(existing.birthTimeApproximate);
      setLocation(existing.location);
    }
    setCheckedExisting(true);
  }, []);

  const handleChartStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!location) {
      setError("Pick your birth place from the suggestions so we can find your exact sky.");
      return;
    }

    const birthData: BirthData = {
      name,
      dateOfBirth: dob,
      birthTime: time,
      birthTimeApproximate: approx,
      location,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Chart calculation failed");
      }
      const chartData = await res.json();
      const placements = placementsFromChart(chartData);
      saveBirthData(birthData);
      savePlacements(placements);
      syncBirthDataToSupabase(birthData);
      syncChartToSupabase(chartData, placements);

      if (isEditing) {
        // Correcting an existing chart, no need to re-ask for a goal, send them
        // straight back to see the fixed chart with a quick confirmation.
        setJustUpdated(true);
        setTimeout(() => router.push("/my-chart"), 1400);
      } else {
        // A brand new member's first ever look at her real chart, worth a moment before the
        // goal-setting form, not just an instant hop to another blank form.
        setRevealPlacements(placements);
        setStep(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong calculating your chart.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoalStep = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal(goal, goalCategory);
    markOnboarded();
    router.push("/dashboard");
  };

  if (!checkedExisting) return null;

  return (
    <section
      className="min-h-[80vh] flex items-center justify-center px-5 py-16"
      style={{ background: "var(--lav-light)" }}
    >
      <div className="w-full max-w-lg bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        {justUpdated ? (
          <>
            <div className="tag mb-3">chart updated</div>
            <h1
              style={{
                fontFamily: poppins,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              fixed. <span className="pk">recalculating your whole portal.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>
              Every placement, reading and season page updates automatically. Taking you to your chart now.
            </p>
          </>
        ) : (
          <>
            <div className="tag mb-3">
              {isEditing ? "edit your birth details" : step === 1 ? "your chart is ready" : `step ${step === 0 ? 1 : 2} of 2`}
            </div>

            {step === 0 ? (
              <>
                <h1
                  style={{
                    fontFamily: poppins,
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: "-1px",
                    lineHeight: 1.15,
                    marginBottom: 12,
                  }}
                >
                  {isEditing ? (
                    <>something <span className="pk">not quite right?</span></>
                  ) : (
                    <>first, your <span className="pk">cosmic blueprint.</span></>
                  )}
                </h1>
                <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
                  {isEditing
                    ? "Fix your name, date, time or place of birth below and we'll recalculate your entire chart, every placement, house and reading updates to match."
                    : "Your birth details unlock everything, we calculate your full chart with the Swiss Ephemeris, the same data professional astrologers use."}
                </p>
                {error && (
                  <div style={{ background: "var(--pink-light)", color: "#993556", padding: "12px 16px", fontSize: 13, border: "1.5px solid var(--pink)", marginBottom: 20 }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleChartStep} className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="onboarding-name" style={labelStyle}>your name</label>
                    <input id="onboarding-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="what should we call you" style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="onboarding-dob" style={labelStyle}>date of birth</label>
                      <input id="onboarding-dob" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="onboarding-time" style={labelStyle}>time of birth</label>
                      <input id="onboarding-time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="onboarding-place" style={labelStyle}>place of birth</label>
                    <PlacesAutocomplete id="onboarding-place" onSelect={setLocation} value={location?.placeName} />
                  </div>
                  <label className="flex items-center gap-2" style={{ fontSize: 12, color: "var(--grey)", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={approx}
                      onChange={(e) => setApprox(e.target.checked)}
                      style={{ accentColor: "var(--pink)" }}
                    />
                    birth time is approximate / unknown
                  </label>
                  <button type="submit" disabled={loading} className="btn-pink w-full disabled:opacity-50" style={{ cursor: "pointer" }}>
                    {loading ? "recalculating your chart..." : isEditing ? "save & recalculate my chart" : "calculate my chart"}
                  </button>
                  {isEditing && (
                    <Link
                      href="/my-chart"
                      className="no-underline text-center"
                      style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)" }}
                    >
                      cancel, keep my current chart
                    </Link>
                  )}
                </form>
              </>
            ) : step === 1 && revealPlacements ? (
              <>
                <h1
                  style={{
                    fontFamily: poppins,
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: "-1px",
                    lineHeight: 1.15,
                    marginBottom: 20,
                  }}
                >
                  this is <span className="pk">you.</span>
                </h1>
                <div className="flex flex-col gap-3 mb-8">
                  {(
                    [
                      { label: "sun", sign: revealPlacements.sun, blurb: "your core identity" },
                      { label: "moon", sign: revealPlacements.moon, blurb: "your emotional world" },
                      { label: "rising", sign: revealPlacements.rising, blurb: "how you come across" },
                      { label: "venus", sign: revealPlacements.venus, blurb: "how you love" },
                    ] as const
                  ).map((p, i) => {
                    const symbolIndex = ZODIAC_SIGNS.indexOf(p.sign as (typeof ZODIAC_SIGNS)[number]);
                    return (
                      <div
                        key={p.label}
                        className="myszn-reveal-item flex items-center gap-4 p-4"
                        style={{ border: "var(--border)", background: "var(--lav-light)", animationDelay: `${i * 0.35}s` }}
                      >
                        <div style={{ fontSize: 26 }}>{symbolIndex >= 0 ? ZODIAC_SYMBOLS[symbolIndex] : "✦"}</div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)" }}>
                            {p.label}
                          </div>
                          <div style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, color: "var(--dark)" }}>
                            {p.sign} <span style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 500, color: "var(--grey)" }}>· {p.blurb}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
                  This is the beginning of the story, not the whole thing. Your full chart, every placement and house, is waiting inside.
                </p>
                <button type="button" onClick={() => setStep(2)} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                  keep going
                </button>
              </>
            ) : (
              <>
                <h1
                  style={{
                    fontFamily: poppins,
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: "-1px",
                    lineHeight: 1.15,
                    marginBottom: 12,
                  }}
                >
                  chart calculated. now, <span className="pk">the vision.</span>
                </h1>
                <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
                  Tell us what you&apos;re calling in. Every reading, prompt and practice inside gets tied back to this.
                </p>
                <form onSubmit={handleGoalStep} className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="onboarding-goal" style={labelStyle}>your biggest goal right now</label>
                    <textarea
                      id="onboarding-goal"
                      required
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g. launch my business, get visible, make my first $10k month, feel confident being seen"
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>which area is this in</label>
                    <div className="flex gap-2 flex-wrap">
                      {(Object.keys(CATEGORY_STYLES) as GoalCategory[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setGoalCategory(c)}
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            padding: "8px 14px",
                            cursor: "pointer",
                            background: goalCategory === c ? CATEGORY_STYLES[c].bg : "#fff",
                            color: goalCategory === c ? CATEGORY_STYLES[c].color : "var(--grey-light)",
                            border: goalCategory === c ? `1.5px solid ${CATEGORY_STYLES[c].color}` : "1.5px solid #eee",
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn-pink w-full" style={{ cursor: "pointer" }}>
                    enter my portal
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--grey-light)",
                      cursor: "pointer",
                    }}
                  >
                    back
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
