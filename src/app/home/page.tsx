"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { isFreeMember, memberHomeHref } from "@/lib/membership-access";
import { allPosts } from "@/lib/blog";
import { upcomingWorkshops, formatWorkshopWhen } from "@/lib/workshops";
import { getCurrentSeason, formatSeasonDates } from "@/lib/seasons";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The free tier's home. Deliberately NOT a dimmed /dashboard: a free member is being sold to, not
// served, so this page is a shop window rather than a tool. Three things she actually owns (the
// rooms, the blog, her charts) sit above two things she doesn't (the workshops and My Season),
// which are shown as real content with a wall on the door rather than hidden or greyed out.
//
// Route protection lives in proxy.ts: /home requires room access (free+). Paid members who land
// here are bounced to their own home by the effect below, so there's exactly one home per tier.
export default function FreeHomePage() {
  const router = useRouter();
  const { member, ready } = useMember();
  const [now, setNow] = useState<number | null>(null);

  // Which workshops are still "upcoming" depends on the clock, so it can't be read during render
  // (impure) or straight from an effect body (cascading render). Setting it from a timeout callback
  // satisfies both rules, and `now === null` until it lands simply means the workshops block waits
  // one tick rather than rendering a server-clock version that would mismatch on hydration.
  useEffect(() => {
    const id = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!member) {
      router.replace("/login");
      return;
    }
    if (!isFreeMember(member)) router.replace(memberHomeHref(member));
  }, [ready, member, router]);

  const season = useMemo(() => getCurrentSeason(), []);
  const posts = useMemo(() => allPosts().slice(0, 3), []);
  const workshops = useMemo(() => (now === null ? [] : upcomingWorkshops(now).slice(0, 2)), [now]);

  if (!ready || !member || !isFreeMember(member)) return null;

  const firstName = member.name?.split(" ")[0]?.toLowerCase() || "babe";

  return (
    <div style={{ background: "var(--cream, #FBF9F6)" }}>
      {/* ── Welcome + the two things she can do right now ── */}
      <section className="px-5 md:px-8 pt-12 pb-8" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="tag mb-3">your free account</div>
        <h1 style={{ fontFamily: poppins, fontSize: 38, fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.05, marginBottom: 12 }}>
          hey {firstName},<br />
          <span className="pk">the girls are in the rooms.</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--grey)", lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
          This is yours for free, for as long as you want it. The chat rooms are open all day, the blog keeps you across what the sky is doing, and your charts are sitting below whenever you want to read yourself.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            href="/community"
            className="no-underline p-7 block"
            style={{ border: "var(--border)", background: "var(--pink)", color: "#fff" }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, opacity: 0.85 }}>
              open now
            </div>
            <div style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 8 }}>
              the chat rooms
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.92 }}>
              General, wins, astrology, business and MCE. Go and say hi, someone is always in there.
            </p>
          </Link>

          {/* Two destinations, so this card is a plain div with two links rather than a link
              wrapping a link, which is invalid HTML. */}
          <div className="p-7" style={{ border: "var(--border)", background: "#fff", color: "var(--dark)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, color: "var(--grey-light)" }}>
              yours, free
            </div>
            <div style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 8 }}>
              your charts
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--grey)" }}>
              Your full birth chart and your Human Design chart, both free, built from the details you gave us when you joined.
            </p>
            <div className="flex gap-4 mt-4" style={{ fontSize: 12, fontWeight: 700 }}>
              <Link href="/chart" style={{ color: "var(--pink)" }}>birth chart →</Link>
              <Link href="/human-design" style={{ color: "var(--pink)" }}>human design →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── My Season tease: the current season is named and described, but the personalised read
             (what this season does to HER chart) is the thing behind the wall. ── */}
      <section className="px-5 md:px-8 py-8" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="p-7 md:p-9" style={{ border: "var(--border)", background: "var(--dark)", color: "#fff" }}>
          <div className="flex items-baseline gap-3 flex-wrap mb-3">
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>
              my season · members only
            </span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>{formatSeasonDates(season)}</span>
          </div>
          <h2 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
            It&apos;s {season.sign} season {season.symbol}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.85, maxWidth: 620, marginBottom: 20 }}>
            {season.tagline} {season.description}
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7, maxWidth: 620, marginBottom: 24 }}>
            That&apos;s the season everyone is in. What members get is the version written for their own chart: which of your houses this season lights up, what it&apos;s asking of you specifically, and the work to do while it&apos;s here.
          </p>
          <Link href="/membership" className="btn-pink no-underline" style={{ display: "inline-block" }}>
            see what members get
          </Link>
        </div>
      </section>

      {/* ── Workshops: real dates, real titles, upgrade wall on the door. ── */}
      {workshops.length > 0 && (
        <section className="px-5 md:px-8 py-8" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
            <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-1px" }}>
              coming up
            </h2>
            <span style={{ fontSize: 12, color: "var(--grey)" }}>live workshops are part of MY SZN</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {workshops.map((w) => (
              <div key={w.id} className="p-7" style={{ border: "var(--border)", background: "#fff" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 10 }}>
                  {w.label}
                </div>
                <div style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.2, marginBottom: 8 }}>
                  {w.title}
                </div>
                <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6, marginBottom: 16 }}>
                  {w.startIso ? formatWorkshopWhen(w.startIso) : w.meta}
                </p>
                <div
                  className="flex items-center gap-2"
                  style={{ fontSize: 12, fontWeight: 700, color: "var(--grey-light)", paddingTop: 14, borderTop: "1px solid #eee" }}
                >
                  <span aria-hidden>&#128274;</span>
                  <span>upgrade to join this one</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/membership"
            className="no-underline"
            style={{ display: "inline-block", marginTop: 20, fontSize: 13, fontWeight: 700, color: "var(--pink)" }}
          >
            unlock the workshops →
          </Link>
        </section>
      )}

      {/* ── Blog: free, and the "what's going on" feed. ── */}
      <section className="px-5 md:px-8 py-8 pb-16" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-1px" }}>
            latest on the blog
          </h2>
          <Link href="/blog" style={{ fontSize: 13, fontWeight: 700, color: "var(--pink)" }}>
            read everything →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="no-underline p-6 block"
              style={{ border: "var(--border)", background: "#fff", color: "var(--dark)" }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 10 }}>
                {p.readingMinutes} min read
              </div>
              <div style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.25, marginBottom: 8 }}>
                {p.title}
              </div>
              <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6 }}>{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
