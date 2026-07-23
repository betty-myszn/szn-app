"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { loadRoomMessages, getRoomMembers, timeLabel, type ChatMessage } from "@/lib/chat-rooms";
import { loadPolls, loadResponses, getPollsForSeason, submitResponse, type Poll, type PollResponse } from "@/lib/polls";
import { loadChallengeProgress, getSeasonStats } from "@/lib/challenge-progress";
import { getCommunityProgress } from "@/lib/season-community";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function SeasonCommunityPage() {
  const { member, ready } = useMember();
  const season = useSeason();
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [roomMembers, setRoomMembers] = useState<string[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [responses, setResponses] = useState<PollResponse[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [yourCompleted, setYourCompleted] = useState(0);

  const roomId = season.sign.toLowerCase();

  useEffect(() => {
    if (!member) return;
    (async () => {
      const messages = await loadRoomMessages(roomId);
      setRoomMessages(messages);
      setRoomMembers(getRoomMembers(messages));
      setPolls(await loadPolls());
      setResponses(await loadResponses());
    })();
    setYourCompleted(getSeasonStats(loadChallengeProgress(), season.sign).completedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.name, roomId]);

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            the szn community lives inside the membership.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  const seasonPolls = getPollsForSeason(polls, season.sign);
  const answeredIds = new Set(responses.filter((r) => r.respondent === member.name).map((r) => r.pollId));
  const community = getCommunityProgress(season.sign, yourCompleted);
  const recentMessages = roomMessages.slice(-3);

  const handleAnswer = async (poll: Poll) => {
    const draft = drafts[poll.id];
    if (!draft || !draft.trim()) return;
    setResponses(await submitResponse(poll.id, member.name, draft));
    setDrafts((prev) => ({ ...prev, [poll.id]: "" }));
  };

  return (
    <>
      {/* Header */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <Link
            href="/your-season"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← your season
          </Link>
          <div className="tag mb-2" style={{ marginTop: 18 }}>{season.symbol} {season.sign.toLowerCase()} szn · community</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            everyone&apos;s living <span className="pk">this szn together.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 580 }}>
            The room, the polls and how far the rest of the community&apos;s actually getting this szn, all in one place. Your individual read stays on your dashboard, this is the shared version.
          </p>
        </div>
      </section>

      {/* The room */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">the {season.sign.toLowerCase()} room</div>
          <Link
            href={`/community/room/${roomId}`}
            className="no-underline block p-8 hover:opacity-90 transition-opacity"
            style={{ border: "var(--border)", background: "var(--lav-light)", color: "var(--dark)" }}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
                {roomMembers.length} talking in here this szn
              </h2>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>
                open the room →
              </span>
            </div>
            {recentMessages.length === 0 ? (
              <p style={{ fontSize: 13, color: "#3C2A70" }}>Nobody&apos;s said anything yet, be the first.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {recentMessages.map((m) => (
                  <p key={m.id} style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 700 }}>{m.author}</span> · {m.content}
                    <span style={{ color: "var(--grey-light)" }}> · {timeLabel(m.createdAt)}</span>
                  </p>
                ))}
              </div>
            )}
          </Link>
        </div>
      </section>

      {/* Polls this season */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">polls & questions this szn</div>
          {seasonPolls.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>Nothing posted yet this szn, check back soon.</p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {seasonPolls.map((poll, i) => {
                const answered = answeredIds.has(poll.id);
                const pollResponses = responses.filter((r) => r.pollId === poll.id);
                return (
                  <div key={poll.id} className="p-6" style={{ borderBottom: i < seasonPolls.length - 1 ? "var(--border)" : undefined }}>
                    <p style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 12 }}>
                      {poll.question}
                    </p>
                    {!poll.active || answered ? (
                      <p style={{ fontSize: 12, color: "var(--grey-light)" }}>
                        {answered ? "you answered this one. " : ""}{pollResponses.length} response{pollResponses.length === 1 ? "" : "s"} so far.
                      </p>
                    ) : poll.type === "choice" ? (
                      <div className="flex flex-wrap gap-2">
                        {poll.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={async () => {
                              setResponses(await submitResponse(poll.id, member.name, opt));
                            }}
                            style={{ border: "1.5px solid #ddd", background: "#fff", padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 flex-wrap">
                        <input
                          value={drafts[poll.id] || ""}
                          onChange={(e) => setDrafts((prev) => ({ ...prev, [poll.id]: e.target.value }))}
                          placeholder="type your answer..."
                          style={{ border: "var(--border)", outline: "none", padding: "10px 14px", fontSize: 13, flex: 1, minWidth: 220 }}
                        />
                        <button onClick={() => handleAnswer(poll)} className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
                          answer
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Your challenge progress */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-2">your progress this szn</div>
          <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
            {`${community.poolSize} challenges available, here's where you're at.`}
          </h2>
          <p style={{ fontSize: 12, color: "var(--grey-light)", marginBottom: 20, maxWidth: 560, lineHeight: 1.7 }}>
            The community leaderboard fills in here as more members join this szn.
          </p>
          <div style={{ maxWidth: 520 }}>
            <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 800, color: "var(--pink)" }}>you</span>
              <span style={{ color: "var(--grey-light)" }}>{community.yourCompleted}/{community.poolSize}</span>
            </div>
            <div style={{ height: 6, background: "#f0f0f0", width: "100%" }}>
              <div
                style={{
                  height: 6,
                  width: `${community.poolSize > 0 ? Math.round((community.yourCompleted / community.poolSize) * 100) : 0}%`,
                  background: "var(--pink)",
                }}
              />
            </div>
          </div>
          <Link href="/challenges" className="btn-pink" style={{ display: "inline-block", marginTop: 24 }}>
            add to your count
          </Link>
        </div>
      </section>
    </>
  );
}
