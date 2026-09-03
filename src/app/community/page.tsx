"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Ticker from "@/components/Ticker";
import { useMember } from "@/lib/use-member";
import { hasRoomAccess, hasPaidCommunityAccess, hasBillingIssue } from "@/lib/membership-access";
import { useSeason } from "@/lib/use-season";
import { useYourSzn } from "@/lib/use-your-szn";
import { loadPosts, addPost, toggleLike as toggleLikeStore, addComment, listedRooms, findRoom, isRitualSpace, type Post } from "@/lib/community-store";
import { hasUnread } from "@/lib/chat-rooms";
import { getPersonalisedChallenges } from "@/lib/challenges";
import { loadChallengeProgress, isChallengeCompleted } from "@/lib/challenge-progress";
import { getPrimaryGoal } from "@/lib/goals-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Chart-twin matching needs other real members' placements to compare against, which doesn't
// exist until the membership backend is connected, empty for now, the "chart twins" section
// below only renders once this has entries, so it just stays hidden rather than showing fakes.
const MEMBER_DIRECTORY: { author: string; sign: string; body: string }[] = [];

const PLACEMENT_LABELS: Record<string, string> = {
  sun: "sun",
  moon: "moon",
  rising: "rising",
};

function findChartTwins(placements: Record<string, string>, ownName: string): { author: string; label: string }[] {
  const twins: { author: string; label: string }[] = [];
  for (const entry of MEMBER_DIRECTORY) {
    if (entry.author.toLowerCase() === ownName.toLowerCase()) continue;
    const label = PLACEMENT_LABELS[entry.body];
    if (!label) continue;
    const memberSign = placements[entry.body];
    if (memberSign && memberSign.toLowerCase() === entry.sign.toLowerCase()) {
      twins.push({ author: entry.author, label: `${entry.sign.toLowerCase()} ${label}` });
    }
  }
  return twins;
}

// Render @mentions in brand pink
function renderContent(text: string) {
  const parts = text.split(/(@[a-z0-9_]+)/gi);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} style={{ color: "var(--pink)", fontWeight: 700 }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function CommunityPage() {
  const { member, ready } = useMember();
  const season = useSeason();
  const { data: szn } = useYourSzn();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeSpace, setActiveSpace] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [draftSpace, setDraftSpace] = useState("general");
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPosts().then(setPosts);
  }, []);

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            the community is members only.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  // Room access is the front-door gate: the free tier and every paying tier get past here. Only a
  // member with no access at all (a lapsed or never-paid 'none' row) is stopped.
  if (!hasRoomAccess(member)) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            the community is members only.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            {hasBillingIssue(member)
              ? "We couldn't process your last payment. Update your payment method to get back in."
              : "Join MY SZN to see and post in the community."}
          </p>
          <Link href={hasBillingIssue(member) ? "/api/stripe/portal" : "/membership"} className="btn-pink">
            {hasBillingIssue(member) ? "update payment method" : "see membership options"}
          </Link>
        </div>
      </section>
    );
  }

  // A free member is past the gate but only for the open rooms. The rituals (book club, seasonal
  // challenges, events) are the $33 programming, so they're hidden from her spaces and feed and
  // replaced with an upgrade nudge below. Every paying tier keeps the full set.
  const paidCommunity = hasPaidCommunityAccess(member);
  // The short listed set rather than all 20 rooms, with this season's sign room standing in for the
  // twelve that used to be here. See listedRooms in community-store for why.
  const rooms = listedRooms(season.sign);
  const availableSpaces = paidCommunity ? rooms : rooms.filter((s) => !isRitualSpace(s.id));

  const toggleLike = async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)));
    const updated = await toggleLikeStore(id, post.liked);
    setPosts(updated);
  };

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const content = draft.trim();
    setDraft("");
    const updated = await addPost(member.name.toLowerCase(), member.placements?.sun ? `${member.placements.sun.toLowerCase()} sun` : "my szn member", draftSpace, content);
    setPosts(updated);
  };

  const submitComment = async (postId: string) => {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    const updated = await addComment(postId, member.name.toLowerCase(), text);
    setPosts(updated);
  };

  const visible = posts.filter((p) => {
    // Free members never see posts from the locked ritual spaces, even under "all spaces".
    if (!paidCommunity && isRitualSpace(p.space)) return false;
    const inSpace = activeSpace === "all" || p.space === activeSpace;
    const matches =
      !search ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.author.includes(search.toLowerCase());
    return inSpace && matches;
  });

  const activeSpaceMeta = findRoom(activeSpace);

  const chartTwins = findChartTwins(member.placements as unknown as Record<string, string>, member.name);
  const challenges = getPersonalisedChallenges(season, getPrimaryGoal()).filter((c) => !c.hidden).slice(0, 4);
  const challengeProgress = loadChallengeProgress();
  const leaderboard = challenges
    .map((c) => ({ challenge: c, youDone: isChallengeCompleted(challengeProgress, season.sign, c.id) }))
    .sort((a, b) => Number(b.youDone) - Number(a.youDone));

  const roomsWithUnread = new Set(availableSpaces.filter((r) => hasUnread(r.id)).map((r) => r.id));

  return (
    <>
      <Ticker
        items={["your people are here", "celebrate her, become her", "post the win", "no dimming allowed", "cheer her on"]}
      />
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-3">the community · your members&apos; club</div>
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
            you found <span className="pk">your people.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 540 }}>
            Ambitious women becoming the main characters of their own lives, together. Pick a space, join the conversation, brag freely.
          </p>
        </div>
      </section>

      {/* Cosmic weather banner */}
      <section className="px-5 md:px-8 py-4" style={{ background: "var(--pink)", borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
          <span style={{ fontSize: 16 }}>{szn?.transits.moonPhase.emoji || "🌙"}</span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: "#fff" }}>
            {szn ? `today's sky: ${szn.transits.moonPhase.phase.toLowerCase()}` : "reading the sky..."}
          </span>
          {paidCommunity ? (
            <Link href="/your-season/community" className="no-underline" style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              &bull; the whole community is moving through {season.sign.toLowerCase()} szn together, see the szn hub →
            </Link>
          ) : (
            <Link href="/membership" className="no-underline" style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>
              &bull; unlock the {season.sign.toLowerCase()} szn hub and seasonal readings with MY SZN →
            </Link>
          )}
        </div>
      </section>

      <section className="px-5 md:px-8 py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Spaces sidebar */}
          <aside>
            <Link
              href={`/community/profile/${member.name}`}
              className="no-underline flex items-center gap-3 p-3 mb-6"
              style={{ border: "var(--border)", background: "var(--lav-light)" }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: 34, height: 34, background: "var(--pink)", fontFamily: poppins, fontWeight: 800, fontSize: 14, color: "var(--dark)" }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3C2A70" }}>view profile</div>
                <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 700, color: "var(--dark)" }}>{member.name.toLowerCase()}</div>
              </div>
            </Link>
            <div className="tag mb-3">spaces</div>
            <div className="flex lg:flex-col gap-0 flex-wrap" style={{ border: "var(--border)" }}>
              <button
                onClick={() => setActiveSpace("all")}
                className="text-left p-4"
                style={{
                  background: activeSpace === "all" ? "var(--pink)" : "#fff",
                  color: activeSpace === "all" ? "#fff" : "var(--dark)",
                  border: "none",
                  borderBottom: "1px solid #eee",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  flex: "1 1 auto",
                }}
              >
                ✧ all spaces
              </button>
              {availableSpaces.map((space, i) => (
                <div
                  key={space.id}
                  className="flex items-stretch"
                  style={{
                    borderBottom: i < availableSpaces.length - 1 ? "1px solid #eee" : undefined,
                    flex: "1 1 auto",
                    background: activeSpace === space.id ? "var(--pink)" : "#fff",
                  }}
                >
                  <button
                    onClick={() => setActiveSpace(space.id)}
                    className="text-left p-4 flex-1"
                    style={{
                      background: "transparent",
                      color: activeSpace === space.id ? "#fff" : "var(--dark)",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    {space.emoji} {space.label}
                  </button>
                  <Link
                    href={`/community/room/${space.id}`}
                    className="no-underline flex items-center justify-center px-3 relative"
                    title={`enter the ${space.label} live chat`}
                    style={{
                      borderLeft: activeSpace === space.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid #eee",
                      color: activeSpace === space.id ? "#fff" : "var(--pink)",
                      fontSize: 14,
                    }}
                  >
                    💬
                    {roomsWithUnread.has(space.id) && (
                      <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: activeSpace === space.id ? "#fff" : "var(--pink)" }} />
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Free-tier upgrade nudge: the rituals MY SZN ($88/mo) unlocks, shown locked. */}
            {!paidCommunity && (
              <div className="mt-6 p-4" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 6 }}>
                  🔒 members&apos; rituals
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--grey)", marginBottom: 10 }}>
                  A live masterclass and astro tapping every month, plus your full personalised season hub, come with MY SZN, $88 a month.
                </p>
                <Link
                  href="/membership"
                  className="no-underline"
                  style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}
                >
                  unlock the rituals →
                </Link>
              </div>
            )}

            {/* Chart twins */}
            {chartTwins.length > 0 && (
              <div className="mt-8">
                <div className="tag mb-3">chart twins</div>
                <div style={{ border: "var(--border)" }}>
                  {chartTwins.slice(0, 4).map((twin, i) => (
                    <div
                      key={twin.author}
                      className="p-4"
                      style={{ borderBottom: i < Math.min(chartTwins.length, 4) - 1 ? "1px solid #eee" : undefined }}
                    >
                      <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--grey)" }}>
                        you share your <strong style={{ color: "var(--dark)" }}>{twin.label}</strong> with <strong style={{ color: "var(--pink)" }}>{twin.author}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenge leaderboard: seasonal-challenge programming, part of the paid rituals, so
                it's hidden from the free tier (the /challenges page it links to is full-platform). */}
            {paidCommunity && (
            <div className="mt-8">
              <div className="tag mb-3">this szn&apos;s challenges</div>
              <div style={{ border: "var(--border)" }}>
                {leaderboard.map((row, i) => (
                  <div
                    key={row.challenge.id}
                    className="p-4"
                    style={{ borderBottom: i < leaderboard.length - 1 ? "1px solid #eee" : undefined, background: row.youDone ? "var(--mint)" : undefined }}
                  >
                    <p style={{ fontSize: 11, lineHeight: 1.5, color: row.youDone ? "#0F6E56" : "var(--grey)", marginBottom: 4 }}>
                      {row.challenge.text.length > 60 ? `${row.challenge.text.slice(0, 60)}...` : row.challenge.text}
                    </p>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: row.youDone ? "#0F6E56" : "var(--pink)" }}>
                      {row.youDone ? "completed ✓" : "not started yet"}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/challenges"
                className="no-underline"
                style={{ display: "block", marginTop: 10, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}
              >
                do this szn&apos;s challenges →
              </Link>
            </div>
            )}
          </aside>

          {/* Feed */}
          <div>
            {/* Free-tier upgrade banner: the rooms are open, everything else is an invitation. */}
            {!paidCommunity && (
              <div
                className="p-5 mb-6 flex items-center justify-between gap-4 flex-wrap"
                style={{ background: "var(--dark)", border: "var(--border)" }}
              >
                <div>
                  <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                    you&apos;re in the rooms. the rest is one tier up.
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 460 }}>
                    MY SZN ($88/mo) opens a live masterclass and astro tapping every month, plus your full personalised platform built around your own chart. VIP ($555/mo) adds private monthly coaching with Betty.
                  </p>
                </div>
                <Link href="/membership" className="btn-pink" style={{ whiteSpace: "nowrap" }}>
                  see the tiers
                </Link>
              </div>
            )}

            {/* Space header */}
            {activeSpaceMeta && (
              <div className="p-5 mb-6" style={{ background: activeSpaceMeta.id === "bookclub" ? "var(--lav-light)" : "var(--pink-light)", border: "var(--border)" }}>
                <h2 style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 4 }}>
                  {activeSpaceMeta.emoji} {activeSpaceMeta.label}
                </h2>
                <p style={{ fontSize: 13, color: activeSpaceMeta.id === "bookclub" ? "#3C2A70" : "#993556" }}>
                  {activeSpaceMeta.id === "bookclub"
                    ? `${activeSpaceMeta.desc}, the ${season.sign.toLowerCase()} szn pick is live now. one book, one szn, one glow-up.`
                    : activeSpaceMeta.desc}
                </p>
              </div>
            )}

            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search discussions…"
              className="w-full mb-6"
              style={{ border: "var(--border)", padding: "13px 16px", fontSize: 14, outline: "none" }}
            />

            {/* Composer */}
            <form onSubmit={submitPost} className="mb-8" style={{ border: "var(--border)" }}>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`share it with the girls, ${member.name.toLowerCase()}, use @name to mention someone`}
                rows={3}
                className="w-full"
                style={{ border: "none", outline: "none", padding: "16px 18px", fontSize: 14, lineHeight: 1.7, resize: "vertical", fontFamily: "inherit" }}
              />
              <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3" style={{ borderTop: "var(--border)" }}>
                <select
                  value={draftSpace}
                  onChange={(e) => setDraftSpace(e.target.value)}
                  style={{
                    border: "var(--border)",
                    padding: "8px 12px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: "#fff",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {availableSpaces.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <button type="submit" className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
                  post it
                </button>
              </div>
            </form>

            {/* Posts */}
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {visible.length === 0 && (
                <p className="p-6" style={{ fontSize: 14, color: "var(--grey-light)" }}>
                  Nothing here yet, be the first to start this conversation.
                </p>
              )}
              {visible.map((post, i) => {
                const space = findRoom(post.space);
                return (
                  <article key={post.id} className="p-6" style={{ borderBottom: i < visible.length - 1 ? "var(--border)" : undefined }}>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Link href={`/community/profile/${post.author}`} className="no-underline flex items-center justify-center" style={{ color: "inherit" }}>
                        <div
                          className="flex items-center justify-center"
                          style={{ width: 32, height: 32, background: "var(--lav-light)", border: "var(--border)", fontFamily: poppins, fontWeight: 800, fontSize: 13 }}
                        >
                          {post.author.charAt(0)}
                        </div>
                      </Link>
                      <div>
                        <Link href={`/community/profile/${post.author}`} className="no-underline" style={{ fontFamily: poppins, fontSize: 14, fontWeight: 700, color: "var(--dark)" }}>
                          {post.author}
                        </Link>
                        <span style={{ fontSize: 11, color: "var(--grey-light)", marginLeft: 8 }}>
                          {post.sign} · {post.timeAgo}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveSpace(post.space)}
                        style={{
                          marginLeft: "auto",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          background: "var(--lav-light)",
                          color: "#3C2A70",
                          padding: "4px 10px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {space?.emoji} {space?.label}
                      </button>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.75, marginBottom: 12 }}>
                      {renderContent(post.content)}
                    </p>
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => toggleLike(post.id)}
                        style={{ background: "none", border: "none", fontSize: 12, fontWeight: 700, color: post.liked ? "var(--pink)" : "var(--grey-light)", cursor: "pointer", padding: 0 }}
                      >
                        {post.liked ? "♥" : "♡"} {post.likes}
                      </button>
                      <button
                        onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                        style={{ background: "none", border: "none", fontSize: 12, fontWeight: 700, color: "var(--grey-light)", cursor: "pointer", padding: 0 }}
                      >
                        💬 {post.comments.length}
                      </button>
                    </div>

                    {/* Comments */}
                    {openComments[post.id] && (
                      <div className="mt-4 pl-4" style={{ borderLeft: "2px solid var(--lav)" }}>
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="mb-3">
                            <Link href={`/community/profile/${comment.author}`} className="no-underline" style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, color: "var(--dark)" }}>
                              {comment.author}
                            </Link>
                            <span style={{ fontSize: 10, color: "var(--grey-light)", marginLeft: 6 }}>{comment.timeAgo}</span>
                            <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.65, marginTop: 2 }}>
                              {renderContent(comment.content)}
                            </p>
                          </div>
                        ))}
                        <div className="flex gap-0 mt-3" style={{ border: "var(--border)" }}>
                          <input
                            value={commentDrafts[post.id] || ""}
                            onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                            placeholder="reply…"
                            className="flex-1"
                            style={{ border: "none", outline: "none", padding: "10px 14px", fontSize: 13 }}
                          />
                          <button
                            onClick={() => submitComment(post.id)}
                            style={{ background: "var(--dark)", color: "#fff", border: "none", padding: "10px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
                          >
                            reply
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
