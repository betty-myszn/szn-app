"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useYourSzn } from "@/lib/use-your-szn";
import { useSeason } from "@/lib/use-season";
import { loadJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, type JournalEntry, type JournalEntryType } from "@/lib/journal-store";
import { analyzeJournalPatterns } from "@/lib/journal-patterns";
import { computeJournalStreak } from "@/lib/streaks";
import { getPrimaryGoal, type Goal } from "@/lib/goals-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Deep coaching-question prompts, not surface-level astrology questions
const SHADOW_PROMPTS = [
  "If nobody judged me, what would I already be doing?",
  "What am I still calling timing when it's actually fear?",
  "What version of me benefits from staying invisible?",
  "What would the future version of me stop tolerating immediately?",
  "What conversation have I been avoiding with myself?",
  "What am I calling protection that's actually just fear wearing a sensible outfit?",
  "Where in my life am I overthinking as a way to avoid actually deciding?",
  "What pattern keeps repeating in my life, and whose voice is really running it?",
  "What am I pretending not to know because knowing it would require me to change something?",
  "Who would I disappoint by finally becoming fully myself, and am I willing to risk that?",
];

const REFLECTION_PROMPTS = [
  "What did you do this week that your past self would be proud of?",
  "Name one moment this szn where you chose visibility over comfort.",
  "What's one thing you're ready to stop apologising for?",
  "What did you tolerate this week that the woman you're becoming wouldn't?",
  "Where did you catch an old pattern in real time instead of realising it a week later?",
  "What decision did you make faster this week than you would have a few months ago?",
  "What's one piece of evidence from this week that you're actually changing, not just thinking about it?",
];

const WIN_CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  career: { bg: "var(--mint)", color: "#0F6E56" },
  money: { bg: "var(--gold)", color: "#3C2A70" },
  confidence: { bg: "var(--pink-light)", color: "#993556" },
  relationships: { bg: "var(--lav-light)", color: "#3C2A70" },
  other: { bg: "var(--cream)", color: "#5F5E5A" },
};

export default function JournalPage() {
  const { member, ready } = useMember();
  const { data: szn } = useYourSzn();
  const season = useSeason();
  const [mode, setMode] = useState<"shadow work" | "reflection" | "free write" | "wins">("shadow work");
  const [promptIndex, setPromptIndex] = useState(0);
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);
  const [winText, setWinText] = useState("");
  const [winCategory, setWinCategory] = useState<keyof typeof WIN_CATEGORY_STYLES>("career");
  const [primaryGoal, setPrimaryGoal] = useState<Goal | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryContent, setEditingEntryContent] = useState("");

  useEffect(() => {
    setEntries(loadJournalEntries());
    setPrimaryGoal(getPrimaryGoal());
  }, []);

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            your journal is a members-only space.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  const livePrompts = szn?.journalPrompts?.map((p) => p.prompt) ?? [];
  const goalPrompt = primaryGoal
    ? `Where did you move closer to "${primaryGoal.title}" this week, and where did you stall on it?`
    : null;
  const prompts =
    mode === "shadow work"
      ? [...livePrompts, ...SHADOW_PROMPTS]
      : mode === "reflection"
      ? goalPrompt
        ? [goalPrompt, ...REFLECTION_PROMPTS]
        : REFLECTION_PROMPTS
      : [];
  const activePrompt = mode !== "wins" && prompts.length > 0 ? prompts[promptIndex % prompts.length] : null;

  const handleSave = () => {
    if (!content.trim()) return;
    const updated = addJournalEntry({
      type: mode as JournalEntryType,
      prompt: activePrompt,
      content: content.trim(),
      season: season.sign,
    });
    setEntries(updated);
    setContent("");
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleSaveWin = () => {
    if (!winText.trim()) return;
    const updated = addJournalEntry({
      type: "win",
      prompt: winCategory,
      content: winText.trim(),
      season: season.sign,
    });
    setEntries(updated);
    setWinText("");
  };

  const startEditingEntry = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setEditingEntryContent(entry.content);
  };

  const saveEntryEdit = (id: string) => {
    if (!editingEntryContent.trim()) return;
    setEntries(updateJournalEntry(id, editingEntryContent.trim()));
    setEditingEntryId(null);
  };

  const removeEntry = (id: string) => {
    setEntries(deleteJournalEntry(id));
  };

  const writtenEntries = entries.filter((e) => e.type !== "win");
  const wins = entries.filter((e) => e.type === "win");
  const patterns = analyzeJournalPatterns(entries, season.sign);
  const streak = computeJournalStreak(entries);

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <div className="tag" style={{ marginBottom: 0 }}>{season.sign.toLowerCase()} szn journal</div>
            {streak.current > 0 && (
              <div
                className="flex items-center gap-2"
                style={{ border: "1.5px solid var(--pink)", padding: "6px 14px", background: "rgba(255,45,135,0.1)" }}
              >
                <span style={{ fontSize: 15 }}>🔥</span>
                <span style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, color: "var(--pink)" }}>
                  {streak.current} day{streak.current === 1 ? "" : "s"}
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                  {streak.activeToday ? "logged today" : "keep it going today"}
                </span>
              </div>
            )}
          </div>
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
            meet yourself <span className="pk">on the page.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 560 }}>
            This isn&apos;t about tracking astrology, it&apos;s about catching your own patterns before they run the same loop again. The prompts are coaching questions first, astrology second.
          </p>
          {streak.longest > streak.current && streak.longest >= 3 && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
              your longest streak so far: {streak.longest} days
            </p>
          )}
        </div>
      </section>

      {/* Mode tabs + writing area */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-0 mb-0" style={{ border: "var(--border)", borderBottom: "none", width: "fit-content" }}>
            {(["shadow work", "reflection", "free write", "wins"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setPromptIndex(0);
                }}
                style={{
                  background: mode === m ? "var(--pink)" : "#fff",
                  color: mode === m ? "#fff" : "var(--dark)",
                  border: "none",
                  borderRight: "var(--border)",
                  padding: "12px 20px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {m === "wins" ? "wins timeline" : m}
              </button>
            ))}
          </div>

          {mode !== "wins" ? (
            <div style={{ border: "var(--border)" }}>
              {activePrompt && (
                <div className="p-7 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: "var(--lav-light)", borderBottom: "var(--border)" }}>
                  <p style={{ fontFamily: poppins, fontSize: 19, fontWeight: 700, letterSpacing: "-0.4px", lineHeight: 1.4, color: "#3C2A70", maxWidth: 560 }}>
                    {activePrompt}
                  </p>
                  <button
                    onClick={() => setPromptIndex((i) => i + 1)}
                    style={{
                      background: "none",
                      border: "var(--border)",
                      padding: "10px 18px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      color: "var(--dark)",
                    }}
                  >
                    new prompt
                  </button>
                </div>
              )}
              <div className="p-7">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={mode === "free write" ? "no prompt, no rules, just write what's true for you today..." : "let it out. nobody sees this but you..."}
                  aria-label="journal entry"
                  rows={8}
                  className="w-full"
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: 15,
                    lineHeight: 1.8,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                <div className="flex items-center gap-4 mt-4">
                  <button onClick={handleSave} className="btn-pink" style={{ cursor: "pointer" }}>
                    save entry
                  </button>
                  {savedFlash && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)", letterSpacing: "0.05em" }}>
                      saved. that&apos;s the work. ✦
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ border: "var(--border)" }}>
              <div className="p-7" style={{ background: "var(--gold)", borderBottom: "var(--border)" }}>
                <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.5, color: "#3C2A70" }}>
                  Log every win, however small. Landed a client, raised your prices, started therapy, posted consistently, had the hard conversation. This becomes proof of how far you&rsquo;ve actually come.
                </p>
              </div>
              <div className="p-7 flex flex-col md:flex-row gap-3">
                <input
                  value={winText}
                  onChange={(e) => setWinText(e.target.value)}
                  placeholder="what did you win this week?"
                  aria-label="your win"
                  className="flex-1"
                  style={{ border: "var(--border)", outline: "none", padding: "12px 16px", fontSize: 14 }}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveWin()}
                />
                <select
                  value={winCategory}
                  onChange={(e) => setWinCategory(e.target.value as keyof typeof WIN_CATEGORY_STYLES)}
                  aria-label="win category"
                  style={{
                    border: "var(--border)",
                    outline: "none",
                    padding: "12px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {(Object.keys(WIN_CATEGORY_STYLES) as (keyof typeof WIN_CATEGORY_STYLES)[]).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button onClick={handleSaveWin} className="btn-pink" style={{ cursor: "pointer" }}>
                  add win
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {mode === "wins" ? (
        /* Wins timeline */
        <section className="px-5 md:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
              <div className="tag" style={{ marginBottom: 0 }}>your wins timeline · {wins.length}</div>
              <Link
                href="/your-season/wrapped"
                className="no-underline"
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}
              >
                see your szn wrapped →
              </Link>
            </div>
            {wins.length === 0 ? (
              <p style={{ fontSize: 14, color: "var(--grey-light)" }}>
                Nothing logged yet. Your first win, however small, starts the timeline.
              </p>
            ) : (
              <div className="flex flex-col gap-0" style={{ borderLeft: "2px solid var(--pink)" }}>
                {wins.map((win) => {
                  const cat = WIN_CATEGORY_STYLES[win.prompt || "other"] || WIN_CATEGORY_STYLES.other;
                  return (
                    <div key={win.id} className="pl-6 pb-8 relative">
                      <div
                        style={{
                          position: "absolute",
                          left: -7,
                          top: 4,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "var(--pink)",
                          border: "2px solid #fff",
                        }}
                      />
                      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-3">
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
                            {win.prompt}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--grey-light)" }}>
                            {new Date(win.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {win.season.toLowerCase()} szn
                          </span>
                        </div>
                        {editingEntryId !== win.id && (
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => startEditingEntry(win)}
                              style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                            >
                              edit
                            </button>
                            <button
                              onClick={() => removeEntry(win.id)}
                              style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                            >
                              delete
                            </button>
                          </div>
                        )}
                      </div>
                      {editingEntryId === win.id ? (
                        <div className="flex flex-col gap-3" style={{ maxWidth: 480 }}>
                          <textarea
                            value={editingEntryContent}
                            onChange={(e) => setEditingEntryContent(e.target.value)}
                            aria-label="edit entry"
                            rows={3}
                            className="w-full"
                            style={{ border: "var(--border)", outline: "none", padding: "12px 14px", fontSize: 14, lineHeight: 1.7, resize: "vertical", fontFamily: "inherit" }}
                          />
                          <div className="flex items-center gap-4">
                            <button onClick={() => saveEntryEdit(win.id)} className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
                              save
                            </button>
                            <button
                              onClick={() => setEditingEntryId(null)}
                              style={{ background: "none", border: "none", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                            >
                              cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontFamily: poppins, fontSize: 16, fontWeight: 700, color: "var(--dark)" }}>{win.content}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Pattern recognition */}
          {patterns.length > 0 && (
            <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
              <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
                <div className="tag mb-3" style={{ color: "var(--pink)" }}>patterns we&apos;re noticing</div>
                <div className="flex flex-col gap-3">
                  {patterns.map((p) => (
                    <p key={p} style={{ fontSize: 15, lineHeight: 1.8, color: "#fff", fontWeight: 500 }}>
                      {p}
                    </p>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 16 }}>
                  Pulled from your own entries. The platform can only reflect back what you keep writing, so keep writing.
                </p>
              </div>
            </section>
          )}

          {/* Past entries */}
          <section className="px-5 md:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="tag mb-5">your entries · {writtenEntries.length}</div>
              {writtenEntries.length === 0 ? (
                <p style={{ fontSize: 14, color: "var(--grey-light)" }}>
                  Nothing here yet. Your first entry is one honest sentence away.
                </p>
              ) : (
                <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
                  {writtenEntries.map((entry, i) => (
                    <div key={entry.id} className="p-6" style={{ borderBottom: i < writtenEntries.length - 1 ? "var(--border)" : undefined }}>
                      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-3">
                          <span className="tag">{entry.type}</span>
                          <span style={{ fontSize: 11, color: "var(--grey-light)" }}>
                            {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {entry.season.toLowerCase()} szn
                          </span>
                        </div>
                        {editingEntryId !== entry.id && (
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => startEditingEntry(entry)}
                              style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                            >
                              edit
                            </button>
                            <button
                              onClick={() => removeEntry(entry.id)}
                              style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                            >
                              delete
                            </button>
                          </div>
                        )}
                      </div>
                      {entry.prompt && (
                        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#3C2A70" }}>{entry.prompt}</p>
                      )}
                      {editingEntryId === entry.id ? (
                        <div className="flex flex-col gap-3">
                          <textarea
                            value={editingEntryContent}
                            onChange={(e) => setEditingEntryContent(e.target.value)}
                            aria-label="edit entry"
                            rows={4}
                            className="w-full"
                            style={{ border: "var(--border)", outline: "none", padding: "12px 14px", fontSize: 14, lineHeight: 1.7, resize: "vertical", fontFamily: "inherit" }}
                          />
                          <div className="flex items-center gap-4">
                            <button onClick={() => saveEntryEdit(entry.id)} className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
                              save
                            </button>
                            <button
                              onClick={() => setEditingEntryId(null)}
                              style={{ background: "none", border: "none", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                            >
                              cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{entry.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
