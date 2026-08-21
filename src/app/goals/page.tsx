"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { useChart } from "@/lib/use-chart";
import {
  loadGoals,
  saveGoals,
  addGoal,
  logGoalProgress,
  CATEGORY_STYLES,
  GOAL_CATEGORY_TO_LIFE_AREA,
  type Goal,
  type GoalCategory,
} from "@/lib/goals-store";
import { composeLifeArea } from "@/lib/life-areas";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Fallback guidance for members who haven't added their birth details yet, once a chart exists
// this gets replaced by real chart + season timing from composeLifeArea below.
const ASTRO_GUIDANCE: Record<GoalCategory, string> = {
  career: "Bold, visible career moves get backed right now. Pitch, publish, apply while the season is on your side.",
  business: "Build first, refine later. The astrology backs shipping the imperfect version and adjusting after, not perfecting alone in a drawer.",
  purpose: "Your growth placements are asking for the unfamiliar stretch, not the safe plan. Follow the pull, the clarity comes from moving toward it.",
  money: "Money follows visibility this szn. Talk about your offers like the woman who's already decided she's getting paid.",
  love: "Your venus codes say magnetism over chasing. Show up as your unedited self and let the right people find the real you.",
  confidence: "This szn's entire assignment. Take up space daily, the confidence arrives after the action, never before it.",
  wellbeing: "Sustainable glow-ups need rest. Protect your energy like it's your most expensive asset, because it is.",
};

export default function GoalsPage() {
  const { member, ready } = useMember();
  const season = useSeason();
  const { chart } = useChart();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("career");
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [progressDraft, setProgressDraft] = useState(0);
  const [noteDraft, setNoteDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<GoalCategory>("career");

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const timingFor = (goal: Goal): string => {
    if (chart) {
      const reading = composeLifeArea(GOAL_CATEGORY_TO_LIFE_AREA[goal.category], chart, season, goal);
      if (reading?.goalTieIn) return reading.goalTieIn;
    }
    return ASTRO_GUIDANCE[goal.category];
  };

  const startLogging = (goal: Goal) => {
    setLoggingId(goal.id);
    setProgressDraft(goal.progress);
    setNoteDraft("");
  };

  const submitLog = (goalId: string) => {
    const updated = logGoalProgress(goalId, progressDraft, noteDraft);
    setGoals(updated);
    setLoggingId(null);
    setNoteDraft("");
  };

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            your goals live inside the membership.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setGoals(addGoal(title, category));
    setTitle("");
  };

  const toggleGoal = (id: string) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, status: g.status === "active" ? ("completed" as const) : ("active" as const) } : g
    );
    setGoals(updated);
    saveGoals(updated);
  };

  const removeGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  const startEditing = (goal: Goal) => {
    setEditingId(goal.id);
    setEditTitle(goal.title);
    setEditCategory(goal.category);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    const updated = goals.map((g) => (g.id === id ? { ...g, title: editTitle.trim(), category: editCategory } : g));
    setGoals(updated);
    saveGoals(updated);
    setEditingId(null);
  };

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-3">goals · aligned with your chart</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            decide what you want.<br />
            <span className="pk">then become her.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 560 }}>
            Set the goal, and your portal ties the astrology to it, how this szn supports it, what to work on, and the prompts and practices that move it forward. Your most recent active goal is also what personalises your dashboard, journal and season pages.
          </p>
        </div>
      </section>

      {/* Add goal */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-4">call it in</div>
          <form onSubmit={handleAddGoal} className="flex flex-col md:flex-row gap-0" style={{ border: "var(--border)" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. launch my offer, hit my first $10k month, post daily for 30 days"
              aria-label="new goal title"
              className="flex-1"
              style={{ border: "none", outline: "none", padding: "16px 18px", fontSize: 14 }}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GoalCategory)}
              aria-label="new goal category"
              style={{
                border: "none",
                borderLeft: "var(--border)",
                outline: "none",
                padding: "16px 18px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {(Object.keys(CATEGORY_STYLES) as GoalCategory[]).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              className="btn-pink"
              style={{ cursor: "pointer", border: "none", borderLeft: "var(--border)" }}
            >
              add goal
            </button>
          </form>
        </div>
      </section>

      {/* Goals list */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">your goals · {goals.filter((g) => g.status === "active").length} active</div>
          {goals.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>
              No goals yet. The woman you&apos;re becoming has a list, start it here.
            </p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {goals.map((goal, i) => {
                const cat = CATEGORY_STYLES[goal.category];
                const isPrimary = i === goals.findIndex((g) => g.status === "active");
                return (
                  <div
                    key={goal.id}
                    className="p-6"
                    style={{
                      borderBottom: i < goals.length - 1 ? "var(--border)" : undefined,
                      opacity: goal.status === "completed" ? 0.55 : 1,
                      background: isPrimary && goal.status === "active" ? "var(--lav-light)" : undefined,
                    }}
                  >
                    {editingId === goal.id ? (
                      <div className="flex flex-col gap-3" style={{ maxWidth: 480 }}>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          aria-label="goal title"
                          style={{ border: "var(--border)", padding: "10px 12px", fontSize: 15, outline: "none", fontFamily: "inherit" }}
                        />
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as GoalCategory)}
                          aria-label="goal category"
                          style={{ border: "var(--border)", padding: "10px 12px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", outline: "none", background: "#fff" }}
                        >
                          {Object.keys(CATEGORY_STYLES).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-3">
                          <button onClick={() => saveEdit(goal.id)} className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
                            save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{ background: "none", border: "none", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                          >
                            cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                background: cat.bg,
                                color: cat.color,
                                padding: "4px 10px",
                              }}
                            >
                              {goal.category}
                            </span>
                            {isPrimary && goal.status === "active" && (
                              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3C2A70" }}>
                                ✦ personalising your portal
                              </span>
                            )}
                            {goal.status === "completed" && (
                              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>
                                done ✦
                              </span>
                            )}
                          </div>
                          <h3
                            style={{
                              fontFamily: poppins,
                              fontSize: 18,
                              fontWeight: 800,
                              letterSpacing: "-0.4px",
                              marginBottom: 8,
                              textDecoration: goal.status === "completed" ? "line-through" : "none",
                            }}
                          >
                            {goal.title}
                          </h3>
                          <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, maxWidth: 560 }}>
                            <span style={{ fontWeight: 700, color: "var(--pink)" }}>this szn: </span>
                            {timingFor(goal)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleGoal(goal.id)}
                            style={{
                              background: goal.status === "completed" ? "#fff" : "var(--dark)",
                              color: goal.status === "completed" ? "var(--dark)" : "#fff",
                              border: "var(--border)",
                              padding: "8px 14px",
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {goal.status === "completed" ? "reopen" : "mark done"}
                          </button>
                          <button
                            onClick={() => startEditing(goal)}
                            style={{
                              background: "none",
                              border: "none",
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "var(--grey-light)",
                              cursor: "pointer",
                            }}
                          >
                            edit
                          </button>
                          <button
                            onClick={() => removeGoal(goal.id)}
                            style={{
                              background: "none",
                              border: "none",
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "var(--grey-light)",
                              cursor: "pointer",
                            }}
                          >
                            remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Progress database: a % bar plus an optional dated log of check-ins */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)" }}>
                          progress · {goal.progress}%
                        </div>
                        {loggingId !== goal.id && (
                          <button
                            onClick={() => startLogging(goal)}
                            style={{
                              background: "none",
                              border: "none",
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "var(--pink)",
                              cursor: "pointer",
                            }}
                          >
                            log progress
                          </button>
                        )}
                      </div>
                      <div style={{ height: 6, background: "#f0f0f0", width: "100%" }}>
                        <div style={{ height: 6, width: `${goal.progress}%`, background: cat.color, transition: "width 0.3s" }} />
                      </div>

                      {loggingId === goal.id && (
                        <div className="mt-4 p-4" style={{ background: "#fafafa", border: "var(--border)" }}>
                          <label htmlFor={`progress-${goal.id}`} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)", display: "block", marginBottom: 8 }}>
                            update to {progressDraft}%
                          </label>
                          <input
                            id={`progress-${goal.id}`}
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={progressDraft}
                            onChange={(e) => setProgressDraft(Number(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--pink)", marginBottom: 12 }}
                          />
                          <input
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="what moved? (optional)"
                            aria-label="what moved on this goal"
                            className="w-full"
                            style={{ border: "var(--border)", outline: "none", padding: "10px 14px", fontSize: 13, marginBottom: 12 }}
                          />
                          <div className="flex items-center gap-3">
                            <button onClick={() => submitLog(goal.id)} className="btn-pink" style={{ cursor: "pointer", padding: "8px 18px", fontSize: 10 }}>
                              save check-in
                            </button>
                            <button
                              onClick={() => setLoggingId(null)}
                              style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                            >
                              cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {goal.progressLog.length > 0 && (
                        <div className="mt-4 flex flex-col gap-2">
                          {goal.progressLog.map((entry) => (
                            <div key={entry.id} className="flex items-start gap-3" style={{ fontSize: 12, color: "var(--grey)" }}>
                              <span style={{ fontWeight: 700, color: cat.color, whiteSpace: "nowrap" }}>
                                {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {entry.progress}%
                              </span>
                              {entry.note && <span>{entry.note}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 p-7" style={{ background: "var(--lav-light)", border: "var(--border)" }}>
            <div className="tag mb-2">this szn&apos;s edge</div>
            <p style={{ fontSize: 14, color: "#3C2A70", lineHeight: 1.8 }}>
              {season.sign} season amplifies {season.themes.slice(0, 2).join(" and ")}. {season.focus} Goals that lean on this season&apos;s energy get cosmic backup right now, so front-load those.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
