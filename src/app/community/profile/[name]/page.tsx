"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { loadPosts, type Post } from "@/lib/community-store";
import { getSymbol } from "@/lib/style-data";
import { handleMatchesName } from "@/lib/community/mention-tokens";

const poppins = "var(--font-poppins), Poppins, sans-serif";

interface FoundMember {
  name: string;
  since: string;
}

// A member's page, reached from an @mention or a name in the feed. The handle is whatever the link
// carried: "sarah" from "@Sarah", "sarahjones" from a full-name mention, or a feed author's name.
//
// Only real information about another member is shown: her name, when she joined, her posts, and
// any sign she chose to put on those posts herself. This page used to invent a Leo sun, Cancer moon
// and Aquarius rising for anyone it knew nothing about and show them as her chart.
export default function ProfilePage() {
  const params = useParams<{ name: string }>();
  const { member, ready } = useMember();
  const [posts, setPosts] = useState<Post[]>([]);
  const [found, setFound] = useState<FoundMember[] | null>(null);

  const handle = decodeURIComponent(params.name).toLowerCase();

  useEffect(() => {
    loadPosts().then(setPosts);
  }, []);

  useEffect(() => {
    if (!member) return;
    let active = true;
    fetch(`/api/community/member?handle=${encodeURIComponent(handle)}`)
      .then((r) => (r.ok ? r.json() : { members: [] }))
      .then((d: { members?: FoundMember[] }) => active && setFound(d.members ?? []))
      .catch(() => active && setFound([]));
    return () => {
      active = false;
    };
  }, [handle, member]);

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

  const isMe = handleMatchesName(handle, member.name);
  const theirPosts = posts.filter((p) => handleMatchesName(handle, p.author));

  // Still asking the server who this is: hold the page rather than flash "couldn't find".
  if (!isMe && found === null && theirPosts.length === 0) {
    return <section className="min-h-[60vh]" aria-busy="true" />;
  }

  const displayName = isMe ? member.name : found?.[0]?.name ?? theirPosts[0]?.author ?? null;

  if (!displayName) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t find that member.
          </h1>
          <Link href="/community" className="btn-pink">back to community</Link>
        </div>
      </section>
    );
  }

  const since = isMe ? member.memberSince : found?.[0]?.since ?? null;
  const sinceLabel = since ? new Date(since).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : null;
  const namesakes = !isMe && found && found.length > 1 ? found.map((m) => m.name) : [];
  // Signs she put on her own posts, e.g. "Leo sun". Real, and hers to share.
  const sharedSigns = isMe ? [] : [...new Set(theirPosts.map((p) => p.sign).filter((s): s is string => !!s && s.trim().length > 0))];

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/community"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← community
          </Link>
          <div className="flex items-center gap-5 mt-6">
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 72, height: 72, background: "var(--pink)", border: "2px solid #fff" }}
            >
              <span style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, color: "#fff" }}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 style={{ fontFamily: poppins, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.6px", color: "#fff", textTransform: "lowercase" }}>
                {displayName}{isMe ? " (you)" : ""}
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 480, marginTop: 6 }}>
                {isMe
                  ? "this is you. edit your bio and details any time from settings."
                  : sinceLabel
                    ? `part of MY SZN since ${sinceLabel}.`
                    : "part of the MY SZN community."}
              </p>
            </div>
          </div>
          {namesakes.length > 0 && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 16, lineHeight: 1.6 }}>
              More than one member goes by that name: {namesakes.join(", ")}.
            </p>
          )}
        </div>
      </section>

      {isMe ? (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
              {(["sun", "moon", "rising"] as const).map((key, i) => (
                <div key={key} className="p-6 text-center" style={{ borderRight: i < 2 ? "var(--border)" : undefined, background: "#fff" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 6 }}>
                    {key}
                  </div>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{getSymbol(member.placements[key])}</div>
                  <div style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, color: "var(--dark)" }}>
                    {member.placements[key].toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : sharedSigns.length > 0 ? (
        <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            {sharedSigns.map((s) => (
              <span key={s} style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3C2A70", background: "var(--lav-light)", borderRadius: 40, padding: "7px 14px" }}>
                {getSymbol(s.split(" ")[0])} {s.toLowerCase()}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Their posts */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-5">{isMe ? "your posts" : `${displayName.toLowerCase()}'s posts`} · {theirPosts.length}</div>
          {theirPosts.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>Nothing posted yet.</p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {theirPosts.map((post, i) => (
                <div key={post.id} className="p-6" style={{ borderBottom: i < theirPosts.length - 1 ? "var(--border)" : undefined }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontSize: 11, color: "var(--grey-light)" }}>{post.timeAgo}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>
                      {post.space}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>{post.content}</p>
                  <p style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 8 }}>♥ {post.likes}</p>
                </div>
              ))}
            </div>
          )}
          {!isMe && (
            <div className="mt-8">
              <Link href="/community/room/general" className="btn-pink">say hi in general chat</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
