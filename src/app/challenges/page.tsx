"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Ticker from "@/components/Ticker";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { getPrimaryGoal, type Goal } from "@/lib/goals-store";
import {
  getPersonalisedChallenges,
  getLevelInfo,
  CATEGORY_CHIP_LABEL,
  HIDDEN_UNLOCK_THRESHOLD,
  pickSurpriseAffirmation,
  type ChallengeTemplate,
} from "@/lib/challenges";
import {
  loadChallengeProgress,
  completeChallenge,
  isChallengeCompleted,
  computeChallengeStreak,
  getSeasonStats,
  getEarnedBadges,
  getAllBadges,
  type ChallengeProgress,
  type Badge,
} from "@/lib/challenge-progress";
import { addPost } from "@/lib/community-store";
import ShareButtons from "@/components/ShareButtons";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const BURST_EMOJI = ["✨", "\u{1F525}", "\u{1F451}", "\u{1F48E}", "✨"];

export default function ChallengesPage() {
  const { member, ready } = useMember();
  const season = useSeason();
  const [primaryGoal, setPrimaryGoal] = useState<Goal | null>(null);
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [burstId, setBurstId] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [shareDraft, setShareDraft] = useState("");
  const [shareFlash, setShareFlash] = useState(false);
  const [badgeToShare, setBadgeToShare] = useState<Badge | null>(null);
  const [badgeShareDraft, setBadgeShareDraft] = useState("");

  useEffect(() => {
    setPrimaryGoal(getPrimaryGoal());
    setProgress(loadChallengeProgress());
  }, []);

  if (!ready || !progress) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            the challenge board is members only.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  const allChallenges = getPersonalisedChallenges(season, primaryGoal);
  const challenges = allChallenges.filter((c) => !c.hidden);
  const hiddenChallenge = allChallenges.find((c) => c.hidden) || null;
  const streak = computeChallengeStreak(progress);
  const level = getLevelInfo(progress.totalXp);
  const seasonStats = getSeasonStats(progress, season.sign);
  const earnedBadges = getEarnedBadges(progress, primaryGoal?.category);
  const allBadges = getAllBadges();
  const earnedIds = new Set(earnedBadges.map((b) => b.id));
  const hiddenUnlocked = seasonStats.completedCount >= HIDDEN_UNLOCK_THRESHOLD;

  const handleComplete = (challenge: ChallengeTemplate) => {
    const previousBadgeIds = new Set(earnedBadges.map((b) => b.id));
    const updated = completeChallenge(season.sign, challenge);
    setProgress(updated);
    setBurstId(challenge.id);
    setAffirmation(pickSurpriseAffirmation());
    setTimeout(() => setBurstId(null), 900);
    setTimeout(() => setAffirmation(null), 2400);

    // A badge is a bigger deal than a single challenge, worth its own moment in the wins room
    // rather than folding it into the ordinary per-challenge share prompt.
    const newlyEarned = getEarnedBadges(updated, primaryGoal?.category).find((b) => !previousBadgeIds.has(b.id));
    if (newlyEarned) {
      setBadgeToShare(newlyEarned);
      setBadgeShareDraft(`just earned "${newlyEarned.label}" ${newlyEarned.emoji}, ${newlyEarned.description}. ✨`);
    }
  };

  const submitBadgeShare = () => {
    if (!badgeShareDraft.trim() || !member) return;
    addPost(member.name.toLowerCase(), member.placements?.sun ? `${member.placements.sun.toLowerCase()} sun` : "my szn member", "wins", badgeShareDraft.trim());
    setBadgeToShare(null);
    setBadgeShareDraft("");
    setShareFlash(true);
    setTimeout(() => setShareFlash(false), 2200);
  };

  const openShare = (challenge: ChallengeTemplate) => {
    setSharingId(challenge.id);
    setShareDraft(`just did it: ${challenge.text} ✨`);
  };

  const submitShare = () => {
    if (!shareDraft.trim() || !member) return;
    addPost(member.name.toLowerCase(), member.placements?.sun ? `${member.placements.sun.toLowerCase()} sun` : "my szn member", "challenges", shareDraft.trim());
    setSharingId(null);
    setShareDraft("");
    setShareFlash(true);
    setTimeout(() => setShareFlash(false), 2200);
  };

  return (
    <>
      <Ticker
        items={["one small move today", "momentum is magnetic", "streaks over perfection", "show up for her"]}
      />
      {/* Hero */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-3">{season.sign.toLowerCase()} szn · seasonal challenges</div>
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
            {season.tagline} <span className="pk">collect the proof.</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, maxWidth: 560, fontWeight: 600 }}>
            {season.focus}
          </p>
        </div>
      </section>

      {/* XP / level / streak */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-7" style={{ borderRight: "var(--border)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 8 }}>
              level {level.level} · {level.title}
            </div>
            <div style={{ height: 8, background: "#f0f0f0", width: "100%", marginBottom: 6 }}>
              <div
                style={{
                  height: 8,
                  width: level.xpForNextLevel ? `${Math.min(100, (level.xpIntoLevel / level.xpForNextLevel) * 100)}%` : "100%",
                  background: "var(--pink)",
                  transition: "width 0.3s",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--grey-light)" }}>
              {progress.totalXp} xp total{level.xpForNextLevel ? ` · ${level.xpForNextLevel - level.xpIntoLevel} to next level` : ""}
            </div>
          </div>
          <div className="p-7" style={{ borderRight: "var(--border)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 8 }}>
              streak
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 18 }}>{"\u{1F525}"}</span>
              <span style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800 }}>{streak.current} day{streak.current === 1 ? "" : "s"}</span>
            </div>
            {streak.longest > streak.current && streak.longest >= 3 && (
              <div style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 6 }}>longest streak: {streak.longest} days</div>
            )}
          </div>
          <div className="p-7">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 8 }}>
              this szn
            </div>
            <div style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800 }}>
              {seasonStats.completedCount} / {challenges.length} completed
            </div>
            <div style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 6 }}>{seasonStats.xpEarned} xp earned this szn</div>
          </div>
        </div>
      </section>

      {/* A badge just fired, this is bigger than one challenge, give it its own moment */}
      {badgeToShare && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "1.5px solid var(--pink)", background: "rgba(255,45,135,0.06)" }}>
            <div className="tag mb-3" style={{ color: "var(--pink)" }}>badge earned · {badgeToShare.emoji} {badgeToShare.label}</div>
            <p style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 6 }}>
              {badgeToShare.description}.
            </p>
            <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 16 }}>
              This is bigger than one challenge, want the wins room to actually see it?
            </p>
            <textarea
              value={badgeShareDraft}
              onChange={(e) => setBadgeShareDraft(e.target.value)}
              rows={2}
              className="w-full"
              style={{ border: "var(--border)", outline: "none", padding: "10px 14px", fontSize: 13, marginBottom: 12, fontFamily: "inherit", resize: "vertical" }}
            />
            <div className="flex items-center gap-3">
              <button onClick={submitBadgeShare} className="btn-pink" style={{ cursor: "pointer", padding: "10px 20px", fontSize: 10 }}>
                post to wins & celebrations
              </button>
              <button
                onClick={() => { setBadgeToShare(null); setBadgeShareDraft(""); }}
                style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
              >
                not this time
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Badges */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-4">badges · {earnedBadges.length} / {allBadges.length}</div>
          <div className="flex flex-wrap gap-3">
            {allBadges.map((badge) => {
              const earned = earnedIds.has(badge.id);
              return (
                <div
                  key={badge.id}
                  title={badge.description}
                  className="flex items-center gap-2"
                  style={{
                    border: earned ? "1.5px solid var(--pink)" : "1.5px solid #eee",
                    padding: "8px 14px",
                    opacity: earned ? 1 : 0.4,
                    background: earned ? "rgba(255,45,135,0.06)" : "#fff",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{badge.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Challenge list */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <div className="tag" style={{ marginBottom: 0 }}>
              {primaryGoal ? `personalised for your ${primaryGoal.category} goal` : "this szn's challenges"}
            </div>
            {affirmation && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)", letterSpacing: "0.05em" }}>
                {affirmation} ✦
              </span>
            )}
            {shareFlash && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)", letterSpacing: "0.05em" }}>
                posted. that&apos;s the energy. ✦
              </span>
            )}
          </div>

          <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
            {challenges.map((challenge, i) => {
              const done = isChallengeCompleted(progress, season.sign, challenge.id);
              return (
                <div
                  key={challenge.id}
                  className="p-6 relative"
                  style={{ borderBottom: i < challenges.length - 1 ? "var(--border)" : undefined, opacity: done ? 0.7 : 1 }}
                >
                  {burstId === challenge.id && (
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
                      {BURST_EMOJI.map((emoji, idx) => {
                        const angle = (idx / BURST_EMOJI.length) * Math.PI * 2;
                        const dist = 60 + idx * 8;
                        const x = Math.round(Math.cos(angle) * dist);
                        const y = Math.round(Math.sin(angle) * dist);
                        return (
                          <span
                            key={idx}
                            className="challenge-burst-particle"
                            style={{ ["--burst-x" as string]: `${x}px`, ["--burst-y" as string]: `${y}px`, ["--burst-r" as string]: `${idx * 40}deg` }}
                          >
                            {emoji}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            background: "var(--lav-light)",
                            color: "#3C2A70",
                            padding: "3px 9px",
                          }}
                        >
                          {CATEGORY_CHIP_LABEL[challenge.category]}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--pink)" }}>+{challenge.xp} xp</span>
                      </div>
                      <p
                        style={{
                          fontFamily: poppins,
                          fontSize: 17,
                          fontWeight: 700,
                          letterSpacing: "-0.3px",
                          textDecoration: done ? "line-through" : "none",
                        }}
                      >
                        {challenge.text}
                      </p>
                    </div>
                    <button
                      onClick={() => handleComplete(challenge)}
                      disabled={done}
                      style={{
                        background: done ? "#fff" : "var(--dark)",
                        color: done ? "var(--dark)" : "#fff",
                        border: "var(--border)",
                        padding: "10px 16px",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: done ? "default" : "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {done ? "done ✓" : "mark done"}
                    </button>
                  </div>

                  {done && sharingId !== challenge.id && (
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => openShare(challenge)}
                        style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)", cursor: "pointer", padding: 0 }}
                      >
                        share your win
                      </button>
                      <ShareButtons text={`✓ ${challenge.text} #MYSZN #${season.sign}Szn`} />
                    </div>
                  )}

                  {sharingId === challenge.id && (
                    <div className="mt-4 p-4" style={{ background: "#fafafa", border: "var(--border)" }}>
                      <textarea
                        value={shareDraft}
                        onChange={(e) => setShareDraft(e.target.value)}
                        rows={3}
                        className="w-full"
                        style={{ border: "var(--border)", outline: "none", padding: "10px 14px", fontSize: 13, marginBottom: 10, fontFamily: "inherit", resize: "vertical" }}
                      />
                      <div className="flex items-center gap-3">
                        <button onClick={submitShare} className="btn-pink" style={{ cursor: "pointer", padding: "8px 18px", fontSize: 10 }}>
                          post to seasonal challenges
                        </button>
                        <button
                          onClick={() => setSharingId(null)}
                          style={{ background: "none", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer" }}
                        >
                          cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hidden bonus challenge */}
      {hiddenChallenge && (
        <section className="px-5 md:px-8 py-4" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto">
            {hiddenUnlocked ? (
              <div className="p-6" style={{ border: "1.5px solid var(--gold)", background: "rgba(133,79,11,0.06)" }}>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "var(--gold)", color: "#3C2A70", padding: "3px 9px" }}>
                    bonus unlocked
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--pink)" }}>+{hiddenChallenge.xp} xp</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p style={{ fontFamily: poppins, fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px", textDecoration: isChallengeCompleted(progress, season.sign, hiddenChallenge.id) ? "line-through" : "none" }}>
                    {hiddenChallenge.text}
                  </p>
                  <button
                    onClick={() => handleComplete(hiddenChallenge)}
                    disabled={isChallengeCompleted(progress, season.sign, hiddenChallenge.id)}
                    style={{
                      background: isChallengeCompleted(progress, season.sign, hiddenChallenge.id) ? "#fff" : "var(--dark)",
                      color: isChallengeCompleted(progress, season.sign, hiddenChallenge.id) ? "var(--dark)" : "#fff",
                      border: "var(--border)",
                      padding: "10px 16px",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: isChallengeCompleted(progress, season.sign, hiddenChallenge.id) ? "default" : "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isChallengeCompleted(progress, season.sign, hiddenChallenge.id) ? "done ✓" : "mark done"}
                  </button>
                </div>
                {isChallengeCompleted(progress, season.sign, hiddenChallenge.id) && (
                  <div className="mt-3">
                    <ShareButtons text={`✓ ${hiddenChallenge.text} #MYSZN #${season.sign}Szn`} />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center" style={{ border: "1.5px dashed #ddd" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{"\u{1F512}"}</div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: "var(--grey-light)" }}>
                  a hidden bonus challenge unlocks after {HIDDEN_UNLOCK_THRESHOLD} challenges this szn ({seasonStats.completedCount}/{HIDDEN_UNLOCK_THRESHOLD})
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recap link */}
      <section className="px-5 md:px-8 py-12" style={{ borderTop: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ background: "var(--lav-light)" }}>
          <div>
            <div className="tag mb-2">end of szn</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3C2A70" }}>
              Every challenge you complete becomes part of your season wrapped, proof of exactly who you became this szn.
            </p>
          </div>
          <Link href="/your-season/wrapped" className="btn-pink" style={{ whiteSpace: "nowrap" }}>
            see your szn wrapped
          </Link>
        </div>
      </section>
    </>
  );
}
