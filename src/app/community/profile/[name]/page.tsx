"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { loadPosts, type Post } from "@/lib/community-store";
import { getFallbackProfile, type MockProfile } from "@/lib/mock-profiles";
import { getSymbol } from "@/lib/style-data";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function ProfilePage() {
  const params = useParams<{ name: string }>();
  const { member, ready } = useMember();
  const [posts, setPosts] = useState<Post[]>([]);

  const profileName = decodeURIComponent(params.name).toLowerCase();

  useEffect(() => {
    loadPosts().then(setPosts);
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

  const isMe = profileName === member.name.toLowerCase();

  let profile: MockProfile;
  if (isMe) {
    profile = {
      name: member.name.toLowerCase(),
      bio: "this is you. edit your bio and details any time from settings.",
      sun: member.placements.sun,
      moon: member.placements.moon,
      rising: member.placements.rising,
    };
  } else {
    const theirPost = posts.find((p) => p.author.toLowerCase() === profileName);
    if (!theirPost) {
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
    profile = getFallbackProfile(profileName, theirPost.sign);
  }

  const theirPosts = posts.filter((p) => p.author.toLowerCase() === profileName);

  const sharedPlacements = (["sun", "moon", "rising"] as const).filter(
    (key) => !isMe && member.placements[key].toLowerCase() === profile[key].toLowerCase()
  );

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
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 style={{ fontFamily: poppins, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.6px", color: "#fff" }}>
                {profile.name}{isMe ? " (you)" : ""}
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 480, marginTop: 6 }}>
                {profile.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sign lineup */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          {sharedPlacements.length > 0 && (
            <div className="p-4 mb-6" style={{ background: "var(--mint)", border: "1px solid #0F6E56" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0F6E56" }}>
                ✦ chart twins: you share {sharedPlacements.map((k) => `${profile[k].toLowerCase()} ${k}`).join(" and ")} with {profile.name}
              </p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            {(["sun", "moon", "rising"] as const).map((key, i) => (
              <div
                key={key}
                className="p-6 text-center"
                style={{
                  borderRight: i < 2 ? "var(--border)" : undefined,
                  background: sharedPlacements.includes(key) ? "var(--mint)" : "#fff",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: sharedPlacements.includes(key) ? "#0F6E56" : "var(--grey-light)", marginBottom: 6 }}>
                  {key}
                </div>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{getSymbol(profile[key])}</div>
                <div style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, color: "var(--dark)" }}>
                  {profile[key].toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Their posts */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-5">{isMe ? "your posts" : `${profile.name}'s posts`} · {theirPosts.length}</div>
          {theirPosts.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--grey-light)" }}>Nothing posted yet.</p>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {theirPosts.map((post, i) => (
                <div key={post.id} className="p-6" style={{ borderBottom: i < theirPosts.length - 1 ? "var(--border)" : undefined }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontSize: 11, color: "var(--grey-light)" }}>{post.timeAgo}</span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--pink)",
                      }}
                    >
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
