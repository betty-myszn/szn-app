"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { addGoal, hydrateGoalsFromSupabase, loadGoals, logGoalProgress, type Goal, type GoalCategory } from "@/lib/goals-store";
import { addJournalEntry, hydrateJournalFromSupabase, loadJournalEntries, type JournalEntry, type JournalEntryType } from "@/lib/journal-store";
import { addRoomMessage } from "@/lib/chat-rooms";

const pp = "var(--font-poppins), Poppins, sans-serif";
const RULE = "2px solid var(--dark)";
const SHARED_KEY = "myszn_diary_shared";
const WINS_ROOM = "wins";

const CATEGORIES: GoalCategory[] = ["money", "love", "business", "career", "purpose", "confidence", "wellbeing"];

const KINDS: { type: JournalEntryType; emoji: string; label: string; placeholder: string }[] = [
  { type: "manifestation", emoji: "🌟", label: "it came TRUE", placeholder: "What did you call in that actually landed, babe." },
  { type: "synchronicity", emoji: "🦋", label: "a sign", placeholder: "The number, the song, the stranger, the perfect timing. Write it down." },
  { type: "win", emoji: "🏆", label: "a win", placeholder: "Big or tiny, brag about it here." },
];
const KIND_OF = Object.fromEntries(KINDS.map((k) => [k.type, k]));

const input: CSSProperties = { width: "100%", border: RULE, background: "#fff", color: "var(--dark)", padding: "12px 13px", fontSize: 16, fontFamily: "inherit" };
const blackBtn: CSSProperties = { background: "var(--dark)", color: "#fff", border: "none", cursor: "pointer", fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 20px" };
const heading: CSSProperties = { fontSize: "clamp(34px, 5.5vw, 62px)", lineHeight: 1 };

function loadShared(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SHARED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function ManifestationDiaryPage() {
  const { member } = useMember();
  const season = useSeason();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [shared, setShared] = useState<string[]>([]);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("money");
  const [actions, setActions] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [kind, setKind] = useState<JournalEntryType>("manifestation");
  const [content, setContent] = useState("");

  useEffect(() => {
    setGoals(loadGoals());
    setEntries(loadJournalEntries());
    setShared(loadShared());
    hydrateGoalsFromSupabase().then(() => setGoals(loadGoals())).catch(() => {});
    hydrateJournalFromSupabase().then(() => setEntries(loadJournalEntries())).catch(() => {});
  }, []);

  const active = goals.filter((g) => g.status === "active");
  const diary = entries.filter((e) => e.type in KIND_OF).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const currentKind = KIND_OF[kind];

  const saveGoal = () => {
    if (!title.trim()) return;
    setGoals(addGoal(title.trim(), category));
    setTitle("");
  };

  const saveAction = (goal: Goal) => {
    const note = (actions[goal.id] ?? "").trim();
    if (!note) return;
    setGoals(logGoalProgress(goal.id, progress[goal.id] ?? goal.progress, note));
    setActions((a) => ({ ...a, [goal.id]: "" }));
  };

  const saveEntry = () => {
    if (!content.trim()) return;
    setEntries(addJournalEntry({ type: kind, prompt: currentKind.label, content: content.trim(), season: season?.sign ?? "" }));
    setContent("");
  };

  const share = async (entry: JournalEntry) => {
    await addRoomMessage(WINS_ROOM, member?.name ?? "", `${KIND_OF[entry.type].emoji} ${entry.content}`);
    const next = [...shared, entry.id];
    setShared(next);
    setConfirming(null);
    try {
      localStorage.setItem(SHARED_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    <main className="px-5 md:px-8" style={{ background: "var(--lav-light)", color: "var(--dark)", paddingTop: 40, paddingBottom: 70 }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/club" style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, color: "var(--dark)" }}>← back to the club</Link>
        <h1 className="display" style={{ fontSize: "clamp(46px, 8vw, 92px)", lineHeight: 0.96, marginTop: 18 }}>
          your manifestation <span className="pk">diary.</span>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.5, fontWeight: 700, margin: "14px 0 0" }}>🔒 Everything in here is private, babe. Nothing gets shared unless you tap share.</p>

        <section style={{ marginTop: 38 }}>
          <h2 className="display" style={heading}>what i&apos;m calling in.</h2>
          <div style={{ background: "#fff", border: RULE, padding: 18, marginTop: 16 }}>
            <input aria-label="Your goal" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name the goal, babe. Make it specific." style={input} />
            <div className="flex flex-wrap gap-3" style={{ marginTop: 10 }}>
              <select aria-label="Goal area" value={category} onChange={(e) => setCategory(e.target.value as GoalCategory)} style={{ ...input, width: "auto", flex: "1 1 160px" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" onClick={saveGoal} style={blackBtn}>add my goal</button>
            </div>
          </div>

          {active.map((g) => {
            const value = progress[g.id] ?? g.progress;
            const last = g.progressLog[g.progressLog.length - 1];
            return (
              <article key={g.id} style={{ background: "#fff", border: RULE, padding: 18, marginTop: 14 }}>
                <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{g.category}</div>
                <h3 style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, lineHeight: 1.15, margin: "4px 0 0" }}>{g.title}</h3>
                <label style={{ display: "block", fontSize: 15, fontWeight: 800, marginTop: 12 }}>
                  how close: {value}%{value === 100 ? " YOU DID ITTTT 🎉" : ""}
                  <input type="range" min={0} max={100} step={10} value={value} onChange={(e) => setProgress((p) => ({ ...p, [g.id]: Number(e.target.value) }))} style={{ display: "block", width: "100%", marginTop: 6, accentColor: "var(--pink)" }} />
                </label>
                {last?.note && <p style={{ fontSize: 15, lineHeight: 1.45, margin: "10px 0 0" }}><strong>Last action:</strong> {last.note}</p>}
                <div className="flex flex-wrap gap-3" style={{ marginTop: 12 }}>
                  <input aria-label={`This week's action for ${g.title}`} value={actions[g.id] ?? ""} onChange={(e) => setActions((a) => ({ ...a, [g.id]: e.target.value }))} placeholder="This week's action" style={{ ...input, flex: "1 1 220px", width: "auto" }} />
                  <button type="button" onClick={() => saveAction(g)} style={blackBtn}>log it</button>
                </div>
              </article>
            );
          })}
        </section>

        <section style={{ marginTop: 44 }}>
          <h2 className="display" style={heading}>what&apos;s <span className="pk">landing.</span></h2>
          <div style={{ background: "#fff", border: RULE, padding: 18, marginTop: 16 }}>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <button key={k.type} type="button" aria-pressed={kind === k.type} onClick={() => setKind(k.type)} style={{ background: kind === k.type ? "var(--pink)" : "#fff", color: "var(--dark)", border: RULE, cursor: "pointer", fontFamily: pp, fontSize: 14, fontWeight: 800, padding: "10px 14px" }}>
                  {k.emoji} {k.label}
                </button>
              ))}
            </div>
            <textarea aria-label="Your diary entry" value={content} onChange={(e) => setContent(e.target.value)} placeholder={currentKind.placeholder} rows={3} style={{ ...input, marginTop: 12, resize: "vertical" }} />
            <button type="button" onClick={saveEntry} style={{ ...blackBtn, marginTop: 10 }}>save to my diary</button>
          </div>

          {diary.map((e) => (
            <article key={e.id} style={{ background: "#fff", border: RULE, padding: 18, marginTop: 14 }}>
              <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {KIND_OF[e.type].emoji} {KIND_OF[e.type].label} · {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.45, fontWeight: 600, margin: "8px 0 0", whiteSpace: "pre-wrap" }}>{e.content}</p>
              <div style={{ marginTop: 12 }}>
                {shared.includes(e.id) ? (
                  <span style={{ fontSize: 15, fontWeight: 800 }}>💜 shared in the baddie chat</span>
                ) : confirming === e.id ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span style={{ fontSize: 15, fontWeight: 800 }}>Post this in the baddie chat?</span>
                    <button type="button" onClick={() => share(e)} style={blackBtn}>yes, share it</button>
                    <button type="button" onClick={() => setConfirming(null)} style={{ ...blackBtn, background: "#fff", color: "var(--dark)", border: RULE }}>keep it private</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirming(e.id)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--dark)", fontSize: 15, fontWeight: 800, textDecoration: "underline" }}>share with the baddies 🎉</button>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
