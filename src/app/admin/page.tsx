"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { isAdminMember, getMemberBreakdown, getTrialStats, listMembers, type MemberRow, type MembershipLevel } from "@/lib/member";
import { ALL_ROOMS, loadPosts, deletePost, deleteComment, type Post } from "@/lib/community-store";
import { loadRoomMessages, deleteRoomMessage, type ChatMessage } from "@/lib/chat-rooms";
import { loadGoals } from "@/lib/goals-store";
import { loadJournalEntries } from "@/lib/journal-store";
import { computeJournalStreak } from "@/lib/streaks";
import { loadBroadcasts, sendBroadcast, deleteBroadcast, type Broadcast } from "@/lib/broadcasts";
import {
  loadPolls,
  createPoll,
  togglePollActive,
  deletePoll,
  loadResponses,
  getPollResults,
  type Poll,
  type PollType,
  type PollResponse,
} from "@/lib/polls";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Tier chips for the member directory. Paid tiers carry the pink, everything else stays quiet, so
// the paying members are the ones that catch the eye when scanning the list.
const TIER_STYLE: Record<MembershipLevel, { label: string; bg: string; fg: string }> = {
  vip: { label: "vip", bg: "var(--dark)", fg: "#fff" },
  monthly: { label: "my szn", bg: "var(--pink)", fg: "#fff" },
  trial: { label: "trial", bg: "var(--lav)", fg: "var(--dark)" },
  social: { label: "social", bg: "var(--lav-light)", fg: "#3C2A70" },
  free: { label: "free", bg: "#f2f2f2", fg: "var(--grey)" },
  none: { label: "no tier", bg: "#f2f2f2", fg: "var(--grey-light)" },
};

const dayMonthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// A trial member's most useful date is when her week runs out, everyone else's is when she joined.
function memberLine(m: MemberRow): string {
  if (m.membershipLevel === "trial" && m.trialExpiresAt) {
    const endsMs = new Date(m.trialExpiresAt).getTime();
    const days = Math.ceil((endsMs - Date.now()) / 86400000);
    return days > 0 ? `${days} day${days === 1 ? "" : "s"} of trial left` : `trial ended ${dayMonthYear(m.trialExpiresAt)}`;
  }
  return m.joinedAt ? `joined ${dayMonthYear(m.joinedAt)}` : "";
}

export default function AdminPage() {
  const { member, ready } = useMember();
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({});
  const [goalCount, setGoalCount] = useState({ active: 0, completed: 0 });
  const [journalCount, setJournalCount] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollResponses, setPollResponses] = useState<PollResponse[]>([]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollType, setPollType] = useState<PollType>("choice");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollSent, setPollSent] = useState(false);
  const [breakdown, setBreakdown] = useState({ total: 0, paying: 0, trialing: 0, free: 0 });
  const [trialStats, setTrialStats] = useState({ active: 0, expired: 0, converted: 0 });
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [memberSearch, setMemberSearch] = useState("");

  useEffect(() => {
    (async () => {
      setBreakdown(await getMemberBreakdown());
      setTrialStats(await getTrialStats());
      setBroadcasts(await loadBroadcasts());
      const [polls, responses, allPosts] = await Promise.all([loadPolls(), loadResponses(), loadPosts()]);
      setPolls(polls);
      setPollResponses(responses);
      setPosts(allPosts);
      const counts: Record<string, number> = {};
      await Promise.all(
        ALL_ROOMS.map(async (room) => {
          counts[room.id] = (await loadRoomMessages(room.id)).length;
        })
      );
      setRoomCounts(counts);
    })();
    const goals = loadGoals();
    setGoalCount({
      active: goals.filter((g) => g.status === "active").length,
      completed: goals.filter((g) => g.status === "completed").length,
    });
    const entries = loadJournalEntries();
    setJournalCount(entries.length);
    const s = computeJournalStreak(entries);
    setStreak({ current: s.current, longest: s.longest });
  }, []);

  useEffect(() => {
    loadRoomMessages(selectedRoom).then(setRoomMessages);
  }, [selectedRoom]);

  // The member directory is admin-only twice over: the page never renders it to anyone else, and
  // the profiles_admin_read policy means a non-admin session would only ever get her own row back.
  // Waiting for the admin check here means the query is never even issued for anyone else.
  useEffect(() => {
    if (!ready || !isAdminMember(member)) return;
    listMembers().then(setMembers);
  }, [ready, member]);

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            log in to continue.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (!isAdminMember(member)) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            this area is restricted.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            Admin tools are only visible to the account that owns the platform.
          </p>
          <Link href="/dashboard" className="btn-pink">back to my portal</Link>
        </div>
      </section>
    );
  }

  // The member directory, filtered on name and email together so one box answers both "who is
  // Sarah?" and "which account is this address?".
  const memberQuery = memberSearch.trim().toLowerCase();
  const visibleMembers = memberQuery
    ? members.filter(
        (m) => m.name.toLowerCase().includes(memberQuery) || m.email.toLowerCase().includes(memberQuery)
      )
    : members;

  const totalComments = posts.reduce((sum, p) => sum + p.comments.length, 0);
  const totalChatMessages = Object.values(roomCounts).reduce((sum, n) => sum + n, 0);
  const mostActiveRoomId = Object.entries(roomCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostActiveRoom = ALL_ROOMS.find((r) => r.id === mostActiveRoomId);

  const handleDeletePost = async (postId: string) => {
    setPosts(await deletePost(postId));
    if (expandedPost === postId) setExpandedPost(null);
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    setPosts(await deleteComment(postId, commentId));
  };

  const handleDeleteMessage = async (messageId: string) => {
    const updated = await deleteRoomMessage(selectedRoom, messageId);
    setRoomMessages(updated);
    setRoomCounts((prev) => ({ ...prev, [selectedRoom]: updated.length }));
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim() || !member) return;
    setBroadcasts(await sendBroadcast(broadcastTitle, broadcastBody, member.email));
    setBroadcastTitle("");
    setBroadcastBody("");
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 2400);
  };

  const handleDeleteBroadcast = async (id: string) => {
    setBroadcasts(await deleteBroadcast(id));
  };

  const handleSendPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !member) return;
    const cleanOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
    if (pollType === "choice" && cleanOptions.length < 2) return;
    setPolls(await createPoll(pollQuestion, pollType, cleanOptions, member.email));
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollType("choice");
    setPollSent(true);
    setTimeout(() => setPollSent(false), 2400);
  };

  const handleTogglePoll = async (id: string, currentlyActive: boolean) => {
    setPolls(await togglePollActive(id, currentlyActive));
  };

  const handleDeletePoll = async (id: string) => {
    setPolls(await deletePoll(id));
    setPollResponses(await loadResponses());
  };

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-3">admin · {member.email}</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 4.5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            platform <span className="pk">control room.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 620 }}>
            Stats and moderation tools for the platform, visible only to your account.
          </p>
        </div>
      </section>

      {/* Data scope note */}
      <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto p-6" style={{ background: "var(--lav-light)", border: "var(--border)" }}>
          <div className="tag mb-2">where this data lives right now</div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "#3C2A70" }}>
            Broadcasts, polls, community posts, chat and RSVPs now live in the real shared database, every member sees the same data from her own device. Goals, journal entries and season progress stay private to each member, exactly as they should.
          </p>
        </div>
      </section>

      {/* Broadcast composer */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-2">send a message to everyone</div>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
            broadcast to the membership.
          </h2>
          <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20, maxWidth: 620 }}>
            This shows up in every member&apos;s messages inbox and the notification bell in the nav, immediately. It does not currently send an email, that needs the real Brevo send wired up once you&apos;re ready to go live to your actual subscriber list.
          </p>
          <form onSubmit={handleSendBroadcast} className="flex flex-col gap-3" style={{ maxWidth: 620, marginBottom: 24 }}>
            <input
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="title, e.g. new szn just dropped"
              style={{ border: "var(--border)", outline: "none", padding: "13px 16px", fontSize: 14 }}
            />
            <textarea
              value={broadcastBody}
              onChange={(e) => setBroadcastBody(e.target.value)}
              placeholder="what do you want everyone to know?"
              rows={4}
              style={{ border: "var(--border)", outline: "none", padding: "13px 16px", fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
            />
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-pink" style={{ cursor: "pointer", border: "none", alignSelf: "flex-start" }}>
                send to everyone
              </button>
              {broadcastSent && (
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)", letterSpacing: "0.05em" }}>sent. ✦</span>
              )}
            </div>
          </form>

          <div className="tag mb-4">sent broadcasts · {broadcasts.length}</div>
          {broadcasts.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>Nothing sent yet.</p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {broadcasts.map((b, i) => (
                <div key={b.id} className="p-5 flex items-start justify-between gap-4" style={{ borderBottom: i < broadcasts.length - 1 ? "var(--border)" : undefined }}>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800 }}>{b.title}</span>
                      <span style={{ fontSize: 11, color: "var(--grey-light)" }}>{new Date(b.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6 }}>{b.body}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBroadcast(b.id)}
                    style={{ background: "none", border: "1.5px solid var(--pink)", color: "var(--pink)", padding: "8px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Polls & questions */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-2">polls & questions</div>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
            ask the membership something.
          </h2>
          <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20, maxWidth: 620 }}>
            Shows up on her dashboard until she answers. Multiple choice gives you counted results, open questions collect real feedback in her own words.
          </p>
          <form onSubmit={handleSendPoll} className="flex flex-col gap-3" style={{ maxWidth: 620, marginBottom: 24 }}>
            <input
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="e.g. what should next szn's live workshop cover?"
              style={{ border: "var(--border)", outline: "none", padding: "13px 16px", fontSize: 14 }}
            />
            <div className="flex items-center gap-4" style={{ fontSize: 12, fontWeight: 700 }}>
              <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                <input type="radio" checked={pollType === "choice"} onChange={() => setPollType("choice")} style={{ accentColor: "var(--pink)" }} />
                multiple choice
              </label>
              <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                <input type="radio" checked={pollType === "open"} onChange={() => setPollType("open")} style={{ accentColor: "var(--pink)" }} />
                open question
              </label>
            </div>
            {pollType === "choice" && (
              <div className="flex flex-col gap-2">
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={opt}
                      onChange={(e) => setPollOptions((prev) => prev.map((o, idx) => (idx === i ? e.target.value : o)))}
                      placeholder={`option ${i + 1}`}
                      style={{ border: "var(--border)", outline: "none", padding: "10px 14px", fontSize: 13, flex: 1 }}
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setPollOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        style={{ background: "none", border: "none", color: "var(--grey-light)", cursor: "pointer", fontSize: 16, padding: 4 }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions((prev) => [...prev, ""])}
                    style={{ background: "none", border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)", cursor: "pointer", padding: 0, alignSelf: "flex-start" }}
                  >
                    + add option
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-pink" style={{ cursor: "pointer", border: "none", alignSelf: "flex-start" }}>
                post poll
              </button>
              {pollSent && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)", letterSpacing: "0.05em" }}>posted. ✦</span>}
            </div>
          </form>

          <div className="tag mb-4">polls sent · {polls.length}</div>
          {polls.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>Nothing posted yet.</p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {polls.map((poll, i) => {
                const results = getPollResults(poll, pollResponses);
                const openAnswers = poll.type === "open" ? pollResponses.filter((r) => r.pollId === poll.id) : [];
                return (
                  <div key={poll.id} className="p-6" style={{ borderBottom: i < polls.length - 1 ? "var(--border)" : undefined }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800 }}>{poll.question}</span>
                          <span
                            style={{
                              fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                              background: poll.active ? "rgba(15,110,86,0.12)" : "#eee",
                              color: poll.active ? "#0F6E56" : "var(--grey-light)",
                              padding: "3px 9px",
                            }}
                          >
                            {poll.active ? "live" : "closed"}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--grey-light)" }}>
                          {poll.type === "choice" ? "multiple choice" : "open question"} · {results.total} response{results.total === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleTogglePoll(poll.id, poll.active)}
                          style={{ background: "none", border: "1.5px solid #ddd", color: "var(--dark)", padding: "8px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
                        >
                          {poll.active ? "close" : "reopen"}
                        </button>
                        <button
                          onClick={() => handleDeletePoll(poll.id)}
                          style={{ background: "none", border: "1.5px solid var(--pink)", color: "var(--pink)", padding: "8px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
                        >
                          delete
                        </button>
                      </div>
                    </div>

                    {poll.type === "choice" && (
                      <div className="flex flex-col gap-2" style={{ maxWidth: 480 }}>
                        {poll.options.map((opt) => {
                          const count = results.counts[opt] || 0;
                          const pct = results.total > 0 ? Math.round((count / results.total) * 100) : 0;
                          return (
                            <div key={opt}>
                              <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 3 }}>
                                <span>{opt}</span>
                                <span style={{ color: "var(--grey-light)" }}>{count} · {pct}%</span>
                              </div>
                              <div style={{ height: 6, background: "#f0f0f0", width: "100%" }}>
                                <div style={{ height: 6, width: `${pct}%`, background: "var(--pink)" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {poll.type === "open" && openAnswers.length > 0 && (
                      <div className="flex flex-col gap-2 mt-1" style={{ maxWidth: 480 }}>
                        {openAnswers.map((a) => (
                          <p key={a.id} style={{ fontSize: 12, color: "var(--grey)", lineHeight: 1.6, borderLeft: "2px solid #eee", paddingLeft: 10 }}>
                            &ldquo;{a.answer}&rdquo; <span style={{ color: "var(--grey-light)" }}>— {a.respondent}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Stats grid */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">platform snapshot</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
            {(() => {
              const stats = [
                { label: "paying members", value: breakdown.paying },
                { label: "all accounts", value: breakdown.total },
                { label: "trialing now", value: trialStats.active },
                { label: "trials expired", value: trialStats.expired },
                { label: "trial → paid", value: trialStats.converted },
                { label: "community posts", value: posts.length },
                { label: "comments", value: totalComments },
                { label: "chat messages", value: totalChatMessages },
                { label: "most active room", value: mostActiveRoom ? mostActiveRoom.label : "-" },
                { label: "your active goals", value: goalCount.active },
                { label: "your completed goals", value: goalCount.completed },
                { label: "your journal entries", value: journalCount },
                { label: "your current streak", value: `${streak.current} day${streak.current === 1 ? "" : "s"}` },
              ];
              return stats.map((stat, i) => (
              <div
                key={stat.label}
                className="p-6"
                style={{
                  borderRight: (i + 1) % 4 !== 0 ? "var(--border)" : undefined,
                  borderBottom: Math.floor(i / 4) < Math.floor((stats.length - 1) / 4) ? "var(--border)" : undefined,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 8 }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, color: "var(--dark)" }}>{stat.value}</div>
              </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Member directory: the names behind the "total members" number */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <div>
              <div className="tag" style={{ marginBottom: 0 }}>
                members · {memberQuery ? `${visibleMembers.length} of ${members.length}` : members.length}
              </div>
              <div style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 6 }}>
                {breakdown.paying} paying · {breakdown.trialing} on trial · {breakdown.free} free
              </div>
            </div>
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="search a name or email"
              style={{ border: "var(--border)", outline: "none", padding: "11px 14px", fontSize: 13, minWidth: 240 }}
            />
          </div>

          {members.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>No members loaded.</p>
          ) : visibleMembers.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>Nobody matches &ldquo;{memberSearch}&rdquo;.</p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {visibleMembers.map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-4 flex-wrap p-5"
                  style={{ borderBottom: i < visibleMembers.length - 1 ? "var(--border)" : undefined }}
                >
                  <div style={{ flex: "1 1 240px", minWidth: 200 }}>
                    <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, color: "var(--dark)" }}>
                      {m.name || "no name yet"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--grey)", marginTop: 3, wordBreak: "break-all" }}>{m.email}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap" style={{ marginLeft: "auto" }}>
                    {!m.onboarded && (
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)", border: "1.5px solid #ddd", padding: "4px 9px" }}>
                        not onboarded
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "5px 10px",
                        background: TIER_STYLE[m.membershipLevel].bg,
                        color: TIER_STYLE[m.membershipLevel].fg,
                      }}
                    >
                      {TIER_STYLE[m.membershipLevel].label}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--grey-light)", minWidth: 132, textAlign: "right" }}>
                      {memberLine(m)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Post moderation */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">moderate community posts · {posts.length}</div>
          {posts.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>No posts right now.</p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {posts.map((post, i) => (
                <div key={post.id} className="p-6" style={{ borderBottom: i < posts.length - 1 ? "var(--border)" : undefined }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800 }}>{post.author}</span>
                        <span style={{ fontSize: 11, color: "var(--grey-light)" }}>{post.sign} · {post.timeAgo}</span>
                        <span className="tag" style={{ marginBottom: 0 }}>{post.space}</span>
                      </div>
                      <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 8 }}>{post.content}</p>
                      <button
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        style={{ background: "none", border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)", cursor: "pointer", padding: 0 }}
                      >
                        {post.likes} likes · {post.comments.length} comments {expandedPost === post.id ? "▲" : "▼"}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      style={{
                        background: "none",
                        border: "1.5px solid var(--pink)",
                        color: "var(--pink)",
                        padding: "8px 14px",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      delete post
                    </button>
                  </div>

                  {expandedPost === post.id && post.comments.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3 pl-4" style={{ borderLeft: "2px solid #eee" }}>
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start justify-between gap-3">
                          <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6 }}>
                            <span style={{ fontWeight: 700, color: "var(--dark)" }}>{comment.author}</span> · {comment.content}
                          </p>
                          <button
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            style={{ background: "none", border: "none", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer", whiteSpace: "nowrap" }}
                          >
                            delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Chat moderation */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <div className="tag" style={{ marginBottom: 0 }}>moderate chat rooms</div>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              style={{
                border: "var(--border)",
                outline: "none",
                padding: "10px 14px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {ALL_ROOMS.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.label} · {roomCounts[room.id] ?? 0}
                </option>
              ))}
            </select>
          </div>
          {roomMessages.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>No messages in this room yet.</p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {roomMessages.map((msg, i) => (
                <div
                  key={msg.id}
                  className="p-5 flex items-start justify-between gap-4"
                  style={{ borderBottom: i < roomMessages.length - 1 ? "var(--border)" : undefined }}
                >
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, color: "var(--dark)" }}>{msg.author}</span> · {msg.content}
                  </p>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    style={{ background: "none", border: "none", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
