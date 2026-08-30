"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { loadJournalEntries, type JournalEntry } from "@/lib/journal-store";
import { analyzeJournalPatterns } from "@/lib/journal-patterns";
import { computeJournalStreak } from "@/lib/streaks";
import { getPersonalisedChallenges } from "@/lib/challenges";
import { loadChallengeProgress, getSeasonStats } from "@/lib/challenge-progress";
import { getPrimaryGoal, loadGoals } from "@/lib/goals-store";
import { loadSignals, detectAvoidance } from "@/lib/signals";
import ShareButtons from "@/components/ShareButtons";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function SeasonWrappedPage() {
  const { member, ready } = useMember();
  const season = useSeason();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(loadJournalEntries());
  }, []);

  if (!ready) return null;

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

  const seasonEntries = entries.filter((e) => e.season === season.sign);
  const seasonWins = seasonEntries.filter((e) => e.type === "win");
  const seasonWritten = seasonEntries.filter((e) => e.type !== "win");
  const shadowWorkCount = seasonEntries.filter((e) => e.type === "shadow work").length;
  const experimentCount = seasonEntries.filter((e) => e.type === "experiment").length;

  const challenges = getPersonalisedChallenges(season, getPrimaryGoal()).filter((c) => !c.hidden);
  const challengeProgress = loadChallengeProgress();
  const seasonChallengeStats = getSeasonStats(challengeProgress, season.sign);
  const missionsDone = seasonChallengeStats.completedCount;
  const missions = challenges;

  const patterns = analyzeJournalPatterns(entries, season.sign);
  const topPattern = patterns.find((p) => p.includes("this szn")) || patterns[0] || null;

  const streak = computeJournalStreak(entries);

  const goalPatterns = detectAvoidance(loadGoals(), loadSignals(), season.sign);
  const goalVerdict = goalPatterns[0] || null;
  // "active" from detectAvoidance just means "not stale yet", a goal set five minutes ago with
  // zero completions is technically "active" but has no evidence to actually celebrate, so it
  // needs its own honest framing rather than inheriting the completed-goal copy.
  const goalHasEvidence = goalVerdict ? goalVerdict.completedThisSeason > 0 || goalVerdict.goal.progressLog.length > 0 : false;

  // A goal she set and then genuinely did nothing about is exactly the case this recap exists
  // to surface, so it counts as "data to wrap up" even when the journal and challenges are empty.
  const hasAnyData = seasonEntries.length > 0 || missionsDone > 0 || goalVerdict !== null;

  const shareText = `my ${season.sign.toLowerCase()} szn, wrapped: ${seasonWritten.length} journal entries, ${seasonWins.length} wins logged, ${missionsDone}/${missions.length} challenges done. receipts, not a horoscope. ✨`;

  const stats = [
    { value: seasonWritten.length, label: "journal entries", bg: "var(--pink)", light: true },
    { value: seasonWins.length, label: "wins logged", bg: "var(--gold)", light: false },
    { value: `${missionsDone}/${missions.length}`, label: "challenges completed", bg: "var(--mint)", light: false },
    { value: seasonChallengeStats.xpEarned, label: "xp earned", bg: "var(--pink-light)", light: false },
    { value: shadowWorkCount, label: "shadow work sessions", bg: "var(--dark)", light: true },
    { value: experimentCount, label: "experiments run", bg: "var(--lav-light)", light: false },
    { value: streak.longest, label: "longest streak (days)", bg: "#fff", light: false },
  ];

  return (
    <>
      <section className="px-5 md:px-8 py-16 text-center" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-4">{season.sign.toLowerCase()} szn · wrapped</div>
          <div style={{ fontSize: 44, marginBottom: 10 }}>{season.symbol}</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(34px, 5.5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            {member.name.toLowerCase()}&apos;s <span className="pk">{season.sign.toLowerCase()} szn</span>, in review.
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
            Not a horoscope, receipts. This is everything you actually did this szn, pulled straight from your own journal, wins and challenges.
          </p>
        </div>
      </section>

      {!hasAnyData ? (
        <section className="px-5 md:px-8 py-16 text-center">
          <div className="max-w-md mx-auto">
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
              nothing to wrap up yet.
            </h2>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, marginBottom: 24 }}>
              Set a goal, log a journal entry, a win or complete a challenge this szn, and your wrapped fills in automatically.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/goals" className="btn-pink">set a goal</Link>
              <Link
                href="/your-season"
                className="no-underline"
                style={{ border: "var(--border)", padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)" }}
              >
                back to this season
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Stat grid */}
          <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="p-8 text-center"
                  style={{
                    background: stat.bg,
                    borderRight: (i + 1) % 3 !== 0 ? "var(--border)" : undefined,
                    borderBottom: i < stats.length - 3 ? "var(--border)" : undefined,
                  }}
                >
                  <div style={{ fontFamily: poppins, fontSize: 40, fontWeight: 800, color: stat.light ? "#fff" : "var(--dark)", marginBottom: 6 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: stat.light ? "rgba(255,255,255,0.7)" : "var(--grey-light)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* The goal, closed out honestly, this is the receipt that actually matters */}
          {goalVerdict && (
            <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
              <div
                className="max-w-4xl mx-auto p-8"
                style={{
                  border: "var(--border)",
                  background: goalVerdict.severity === "avoiding" ? "var(--dark)" : goalVerdict.severity === "quiet" ? "var(--gold)" : "var(--mint)",
                }}
              >
                <div
                  className="tag mb-3"
                  style={{ color: goalVerdict.severity === "avoiding" ? "var(--pink)" : goalVerdict.severity === "quiet" ? "#3C2A70" : "#0F6E56" }}
                >
                  the goal you set this szn
                </div>
                <h2
                  style={{
                    fontFamily: poppins,
                    fontSize: "clamp(22px, 3.5vw, 30px)",
                    fontWeight: 800,
                    letterSpacing: "-0.6px",
                    color: goalVerdict.severity === "avoiding" ? "#fff" : goalVerdict.severity === "quiet" ? "#3C2A70" : "#0F6E56",
                    marginBottom: 14,
                  }}
                >
                  {goalVerdict.goal.title}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.85,
                    color: goalVerdict.severity === "avoiding" ? "rgba(255,255,255,0.9)" : goalVerdict.severity === "quiet" ? "#3C2A70" : "#0F6E56",
                    fontWeight: 500,
                    maxWidth: 640,
                  }}
                >
                  {goalVerdict.severity === "avoiding"
                    ? `Here's the honest receipt: ${goalVerdict.completedThisSeason} ${goalVerdict.goal.category} challenges completed this szn, ${goalVerdict.goal.progressLog.length} check-ins logged, nothing moved in the last ${goalVerdict.daysSinceLastSignal} days. That's not a failure, that's data. You now know exactly where next szn needs to start instead of a vague intention.`
                    : goalVerdict.severity === "quiet"
                    ? `The receipt: ${goalVerdict.completedThisSeason} ${goalVerdict.goal.category} challenges completed, ${goalVerdict.goal.progressLog.length} check-ins logged, but it's gone quiet for the last ${goalVerdict.daysSinceLastSignal} days. Real progress, then a stall. Worth naming honestly before next szn starts.`
                    : goalHasEvidence
                    ? `The receipt: ${goalVerdict.completedThisSeason} ${goalVerdict.goal.category} challenge${goalVerdict.completedThisSeason === 1 ? "" : "s"} completed, ${goalVerdict.goal.progressLog.length} check-in${goalVerdict.goal.progressLog.length === 1 ? "" : "s"} logged, sitting at ${goalVerdict.goal.progress}% progress. That's not luck, that's a decision you kept making all szn.`
                    : `You called this in, that's the first move and it counts. No receipts yet, which is honest, not a problem, this szn's just getting started. The next challenge you complete in ${goalVerdict.goal.category} is what turns this from an intention into evidence.`}
                </p>
              </div>
            </section>
          )}

          {/* Top pattern */}
          {topPattern && (
            <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
              <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
                <div className="tag mb-3" style={{ color: "var(--pink)" }}>what your entries actually revealed</div>
                <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{topPattern}</p>
              </div>
            </section>
          )}

          {/* Wins list */}
          {seasonWins.length > 0 && (
            <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
              <div className="max-w-4xl mx-auto">
                <div className="tag mb-5">your wins this szn</div>
                <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
                  {seasonWins.map((win, i) => (
                    <div key={win.id} className="p-5 flex items-center gap-4" style={{ borderBottom: i < seasonWins.length - 1 ? "var(--border)" : undefined }}>
                      <span style={{ color: "var(--pink)", fontSize: 16, fontWeight: 800 }}>✓</span>
                      <p style={{ fontFamily: poppins, fontSize: 14, fontWeight: 700, color: "var(--dark)" }}>{win.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Closing note */}
          <section className="px-5 md:px-8 py-14 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="tag mb-4">betty&apos;s take</div>
              <p style={{ fontFamily: poppins, fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, letterSpacing: "-0.4px", lineHeight: 1.5, color: "var(--dark)", marginBottom: 28 }}>
                {missionsDone === missions.length && missions.length > 0
                  ? `You completed every challenge this szn, ${member.name.toLowerCase()}. That's not luck, that's follow-through. Do not let anyone, including yourself, downplay that.`
                  : seasonWritten.length >= 5
                  ? `Five or more entries this szn is real, consistent work, ${member.name.toLowerCase()}. Most people think about change. You're writing it down and doing something with it.`
                  : `Every entry, every win, every challenge you tick off is a small vote for the woman you're becoming. This szn's tally is just the beginning of the count.`}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
                <Link href="/your-season" className="btn-pink">back to this season</Link>
                <Link
                  href="/journal"
                  className="no-underline"
                  style={{ border: "var(--border)", padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)" }}
                >
                  add to the tally
                </Link>
              </div>
              <div className="tag mb-3">share your receipts</div>
              <div className="flex items-center justify-center">
                <ShareButtons text={shareText} />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
