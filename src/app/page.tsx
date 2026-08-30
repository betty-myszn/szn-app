"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import ReplayTeaser from "@/components/ReplayTeaser";
import { useSeason } from "@/lib/use-season";
import type { SeasonInfo } from "@/lib/seasons";
import { FREE_TRIAL_CTA } from "@/lib/cta";
import { useEnrolmentOpen } from "@/lib/enrolment";
import { upcomingWorkshops, formatWorkshopWhenLA } from "@/lib/workshops";
import { isEclipseSeasonLive } from "@/lib/eclipse-season-gate";
import HumanDesignExplainer from "@/components/HumanDesignExplainer";
import SoulBlueprint from "@/components/SoulBlueprint";
import WhatIsMySzn from "@/components/WhatIsMySzn";

const poppins = "var(--font-poppins), Poppins, sans-serif";

function Ticker({ items, variant }: { items: string[]; variant?: "lav" }) {
  const doubled = [...items, ...items];
  return (
    <div className={`ticker${variant === "lav" ? " ticker--lav" : ""}`}>
      <div className="ticker-inner">
        {doubled.map((text, i) => (
          <span key={i}>
            {i > 0 && <span className="dot">&#10022;</span>}
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

const STATS = [
  { n: "365", label: "days of guidance personalised to your chart" },
  { n: "2", label: "live sessions with Betty every month, a masterclass and an astro tapping" },
  { n: "24/7", label: "a community of women becoming her" },
];

// The lead story follows the sky, so the day the Sun changes sign this headline changes with it
// rather than sitting here going stale. Everything else on the page is evergreen.
function headlines(season: SeasonInfo) {
  return [
  {
    kicker: "☉ the sky right now",
    title: `${season.sign.toLowerCase()} szn has begun.`,
    body: `${season.focus} Your portal has already shifted to match it, new themes, new prompts, new work.`,
    href: "/your-season",
    cta: "read your szn",
  },
  {
    kicker: "✦ this month inside",
    title: "masterclass + astro tapping.",
    body: "One live masterclass and one live astro tapping a month, live with Betty, replays saved forever.",
    href: "/events",
    cta: "see what's on",
  },
  {
    kicker: "☾ from the community",
    title: "the becoming-her thread.",
    body: "Wins, questions and the kind of support that only lands when the other women actually know your chart.",
    href: "/community",
    cta: "meet the club",
  },
  ];
}

const BENTO = [
  {
    cls: "bento-a",
    bg: "var(--pink)",
    fg: "#fff",
    sub: "rgba(255,255,255,0.85)",
    glyph: "☉",
    title: "your birth chart",
    body: "Every placement, every house, every aspect, written in plain English and rebuilt around you. Not a chart you decode. A chart you live.",
    href: "/my-chart",
    big: true,
  },
  {
    cls: "bento-b",
    bg: "var(--lav-light)",
    fg: "var(--dark)",
    sub: "#3C2A70",
    glyph: "✦",
    title: "goals with backup",
    body: "Call it in, then get astro-aligned guidance on making it real.",
    href: "/goals",
  },
  {
    cls: "bento-c",
    bg: "#fff",
    fg: "var(--dark)",
    sub: "var(--grey-light)",
    glyph: "☾",
    title: "shadow journal",
    body: "Prompts that move with the sky.",
    href: "/journal",
  },
  {
    cls: "bento-d",
    bg: "var(--gold)",
    fg: "var(--dark)",
    sub: "#854F0B",
    glyph: "♀",
    title: "style codes",
    body: "Dress like the woman you're becoming.",
    href: "/style",
  },
  {
    cls: "bento-e",
    bg: "var(--dark)",
    fg: "#fff",
    sub: "rgba(255,255,255,0.6)",
    glyph: "★",
    title: "a monthly masterclass + astro tapping",
    body: "One live masterclass and one live astro tapping with Betty every month. Astrology, tapping and embodiment. Replays saved forever.",
    href: "/events",
    wide: true,
  },
];

export default function Home() {
  const router = useRouter();
  const { member, ready } = useMember();
  const season = useSeason();
  const enrolmentOpen = useEnrolmentOpen();
  // Read the next class straight off the workshop data rather than retyping it here. The ticker
  // previously hardcoded the weekday, and when the class moved it carried on telling every homepage
  // visitor the wrong day. It also used to grab the first dated class in the list, which kept
  // pointing at a workshop that had already happened; upcomingWorkshops drops past classes and
  // sorts soonest-first, so [0] is always genuinely the next one.
  // Captured once at mount rather than read during render: Date.now() in the render body is an
  // impure read, and the next workshop does not change within a session anyway.
  const [nowMs] = useState(() => Date.now());
  const nextWorkshop = upcomingWorkshops(nowMs)[0];

  useEffect(() => {
    if (ready && member) router.replace("/dashboard");
  }, [ready, member, router]);

  if (!ready || member) return null;

  const szn = season.sign.toLowerCase();

  return (
    <>
      <Ticker
        items={[
          `✦ ${szn} szn`,
          enrolmentOpen ? "✦ enrolment open now" : "✦ doors open soon",
          nextWorkshop?.startIso
            ? `✦ live class ${formatWorkshopWhenLA(nextWorkshop.startIso)}`
            : "✦ a masterclass + astro tapping every month",
          "✦ your personal birth chart",
          "✦ new: your human design",
          "✦ the astrology community",
        ]}
      />

      {/* ── 1. HERO: pink field, one statement ── */}
      <section
        className="bleed px-5 md:px-8"
        style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}
      >
        <div className="bleed-content max-w-6xl mx-auto">
          <div
            style={{
              fontFamily: poppins,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 26,
            }}
          >
            {enrolmentOpen ? "enrolment open now" : `${szn} szn edition`}
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(52px, 12vw, 148px)", color: "var(--dark)", maxWidth: 1000 }}
          >
            it&apos;s your szn,
            <br />
            <span style={{ color: "#fff" }}>bbbyyy.</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 19px)",
              lineHeight: 1.65,
              color: "var(--dark)",
              maxWidth: 540,
              margin: "30px 0 34px",
              fontWeight: 500,
            }}
          >
            Your personalised astrology platform, coaching membership and community. Built entirely around your birth
            chart, and it moves every time the sky does.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            {/* TWO free front doors, side by side and deliberately equal in weight.
                - The free birth chart (pink) is the lowest-friction way in and historically the
                  biggest single source of signups. It was dropped from this hero at some point,
                  which quietly removed the top of the funnel; it is back as the pink CTA.
                - The free 7-day trial (black) is the full-access front door and the path to a paying
                  member, so it stays just as prominent right beside it.
                The paid join and member login follow as outline buttons, one click away without
                being the cold ask a stranger sees first. */}
            <Link
              href="/chart"
              className="no-underline"
              style={{
                background: "var(--pink)",
                color: "#fff",
                fontFamily: poppins,
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "22px 46px",
                display: "inline-block",
              }}
            >
              get your free birth chart
            </Link>
            <Link
              href="/free-trial"
              className="no-underline"
              style={{
                background: "var(--dark)",
                color: "#fff",
                fontFamily: poppins,
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "22px 46px",
                display: "inline-block",
              }}
            >
              start your free 7 days
            </Link>
            {enrolmentOpen ? (
              <Link href="/membership" className="btn-outline no-underline">
                or join · $88/mo
              </Link>
            ) : (
              <Link href="/membership" className="btn-outline no-underline">
                see what&apos;s inside
              </Link>
            )}
            <Link href="/login" className="btn-outline no-underline">
              member login
            </Link>
          </div>
          <p style={{ fontSize: 13, color: "var(--dark)", marginTop: 16, fontWeight: 600 }}>
            Your birth chart is free, always. The 7-day trial is free too, no card needed, then $88/mo
            only if you want to keep the full membership.
          </p>
        </div>
      </section>

      {/* ── ECLIPSE SEASON: timed acquisition banner, high up for logged-out visitors (members are
           redirected to /dashboard). Self-hides after the season via isEclipseSeasonLive(). Black so
           it stands out from the pink hero directly above it instead of blending into it. The
           personalised eclipse guide lives inside the paid platform, so the CTA drives the join, not
           a free signup. The glittery eclipse moon sits where the 8/8 lion did (transparent PNG,
           reads cleanly on black). ── */}
      {isEclipseSeasonLive() && (
        <section
          className="px-5 md:px-8"
          style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72, overflow: "hidden" }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* writing + CTA on the left */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="sticker" style={{ background: "var(--pink)", color: "#fff" }}>
                eclipse season · now
              </span>
              <h2
                style={{
                  fontFamily: poppins,
                  fontSize: "clamp(30px, 5vw, 60px)",
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  color: "#fff",
                  margin: "16px 0 10px",
                }}
              >
                eclipse season is here, <span className="pk">baby.</span>
              </h2>
              <p style={{ fontFamily: poppins, fontSize: "clamp(17px, 2.4vw, 22px)", fontWeight: 700, letterSpacing: "-0.3px", color: "#fff", marginBottom: 14 }}>
                Here&apos;s everything you need to know.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", maxWidth: 560, marginBottom: 22, fontWeight: 500 }}>
                Two eclipses are shaking things loose this month, a Leo solar eclipse on the 12th and a
                Pisces lunar eclipse on the 28th. Eclipses are the year&apos;s big turning points, the
                moments things start and end on their own timeline. Inside MY SZN your personalised
                eclipse guide reads exactly what each one is touching in your own chart: what it lights
                up, what to look out for, the shadow, and the work to actually do with it.
              </p>
              <Link
                href="/free-trial"
                className="no-underline"
                style={{
                  display: "inline-block",
                  background: "var(--pink)",
                  color: "#fff",
                  fontFamily: poppins,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "15px 30px",
                }}
              >
                get your eclipse guide free →
              </Link>
            </div>
            {/* the glittery eclipse moon: on the right on desktop, centred under the copy on mobile
                (shown on both, not desktop-only). */}
            <Image
              src="/eclipse-moon.png"
              alt=""
              aria-hidden
              width={1080}
              height={1080}
              style={{ width: "clamp(240px, 40vw, 460px)", height: "auto", flexShrink: 0, alignSelf: "center" }}
            />
          </div>
        </section>
      )}

      {/* ── WHAT EVEN IS THIS: the plain-english, in-voice one-liner, straight after the hero. ── */}
      <WhatIsMySzn />

      {/* ── THE BLUEPRINT STORY: the whole thesis, high up so it frames everything below. Problem →
           soul blueprint → the arc → what my szn does. Shared with /membership via one component so
           the two pages can't drift into different versions of the core idea. ── */}
      <SoulBlueprint />

      {/* ── 2. STATS: black, huge numerals, tiny copy ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", paddingTop: 64, paddingBottom: 64 }}>
        <div className="max-w-6xl mx-auto stats">
          {STATS.map((s, i) => (
            <div
              key={s.n}
              className="text-center px-6 py-6"
              style={{
                borderLeft: i > 0 ? "1.5px solid rgba(255,255,255,0.18)" : undefined,
              }}
            >
              <div className="stat-n" style={{ color: "var(--pink)" }}>
                {s.n}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.65)",
                  maxWidth: 230,
                  margin: "14px auto 0",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. COSMIC HOME: copy only. This was a two-column split with a flat colour placeholder
           panel standing in for a product screenshot. The placeholder was cut, and rather than
           leave a dead column the section is now a single centred block. When real portal
           screenshots exist, this is the place to put one back. ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", paddingTop: 72, paddingBottom: 72, borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="rule mb-12" style={{ color: "var(--dark)" }}>
            <span>&#10022;&nbsp; inside my szn &nbsp;&#10022;</span>
          </div>
          <div style={{ maxWidth: 720 }}>
            <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 78px)", color: "var(--dark)" }}>
              your cosmic
              <br />
              <span className="pk">home.</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--grey)", maxWidth: 560, margin: "24px 0 28px" }}>
              One portal that already knows your sun, moon, rising and every placement underneath. Your readings, your
              prompts, your workshops and your guidance, all rebuilt around the exact sky you were born under.
            </p>
            <Link href="/membership" className="btn-pink no-underline">
              see what&apos;s inside
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. GIANT LILAC BLOCK: type over the disco planet ── */}
      <section
        className="bleed birth-chart-block px-5 md:px-8"
        style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 96, paddingBottom: 96 }}
      >
        {/* Sits behind everything via .bleed-shape (z-index 0) while .bleed-content below is
            z-index 1, so the headline and the paragraph read over the top of it. aria-hidden and
            empty alt: it's decoration, not content. */}
        <Image
          src="/disco-planet.png"
          alt=""
          aria-hidden
          width={1080}
          height={1080}
          priority={false}
          className="bleed-shape disco-planet-mark"
        />
        <div className="bleed-content max-w-6xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(46px, 10vw, 132px)", color: "#3C2A70" }}>
            your
            <br />
            personalised
            <br />
            <span style={{ color: "var(--pink)" }}>birth chart.</span>
          </h2>
          <div className="flex items-end justify-between gap-8 flex-wrap" style={{ marginTop: 40 }}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3C2A70", maxWidth: 420, fontWeight: 500 }}>
              Calculated to the degree, then rewritten every szn as the sky moves over it.
            </p>
          </div>
        </div>
        {/* Pinned to the ring rather than left in the paragraph row, so it tracks the planet at
            every width instead of drifting away from it. Lives outside .bleed-content because the
            planet is positioned against the section box, and both need the same coordinate space.
            Last child so that on mobile, where it drops back into normal flow, it still lands
            under the paragraph exactly as the old flex-wrap put it. */}
        <span className="ring-sticker sticker" style={{ background: "var(--pink)", color: "#fff" }}>
          updated every szn
        </span>
      </section>

      {/* The Human Design explainer, shared with /membership and /waitlist so the three pages
          can't drift into three different descriptions of the same feature. Sits directly after
          the birth chart block on purpose: the pitch is that it's the second half of the same
          reading, off birth details she has already given us. */}
      <HumanDesignExplainer />

      {/* ── 5. NEWSPAPER: three stories, hairline rules ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", paddingTop: 72, paddingBottom: 72, borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="rule mb-10" style={{ color: "var(--dark)" }}>
            <span>today&apos;s headlines</span>
          </div>
          <div className="news" style={{ borderTop: "var(--border)", borderBottom: "var(--border)" }}>
            {headlines(season).map((h) => (
              <article key={h.title} className="p-8">
                <div className="tag mb-4">{h.kicker}</div>
                <h3
                  className="display"
                  style={{ fontSize: "clamp(26px, 3vw, 34px)", color: "var(--dark)", marginBottom: 14 }}
                >
                  {h.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey)", marginBottom: 18 }}>{h.body}</p>
                <Link
                  href={h.href}
                  className="no-underline"
                  style={{
                    fontFamily: poppins,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--dark)",
                    borderBottom: "2px solid var(--pink)",
                    paddingBottom: 3,
                  }}
                >
                  {h.cta} &#8594;
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Ticker
        variant="lav"
        items={["✦ read it", "✦ live it", "✦ become her", "✦ repeat every szn"]}
      />

      {/* ── 6. QUOTE: pink, one massive sentence ── */}
      <section
        className="px-5 md:px-8 text-center"
        style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 100, paddingBottom: 100 }}
      >
        <div className="max-w-4xl mx-auto">
          <div style={{ fontSize: 30, color: "#fff", marginBottom: 22 }}>&#10022;</div>
          <blockquote
            className="display"
            style={{ fontSize: "clamp(30px, 5.2vw, 66px)", color: "var(--dark)", textTransform: "none" }}
          >
            &ldquo;I finally stopped wondering what my birth chart meant and actually started living it.&rdquo;
          </blockquote>
          <div
            style={{
              fontFamily: poppins,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#fff",
              marginTop: 34,
            }}
          >
            a my szn member
          </div>
        </div>
      </section>

      {/* ── 7. BENTO: deliberately unequal tiles ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", paddingTop: 72, paddingBottom: 72 }}>
        <div className="max-w-6xl mx-auto">
          <div className="rule mb-10" style={{ color: "#fff" }}>
            <span>&#10022;&nbsp; your cosmic toolkit &nbsp;&#10022;</span>
          </div>
          <div className="bento" style={{ border: "1.5px solid var(--dark)" }}>
            {BENTO.map((b) => (
              <Link
                key={b.title}
                href={b.href}
                className={`${b.cls} no-underline p-7 flex flex-col transition-opacity hover:opacity-90`}
                style={{ background: b.bg, color: b.fg }}
              >
                <div style={{ fontSize: b.big ? 46 : 26, marginBottom: b.big ? 18 : 10, lineHeight: 1 }}>{b.glyph}</div>
                <h3
                  className="display"
                  style={{ fontSize: b.big ? "clamp(30px, 4vw, 46px)" : b.wide ? 26 : 20, marginBottom: 10 }}
                >
                  {b.title}
                </h3>
                <p style={{ fontSize: b.big ? 15 : 13, lineHeight: 1.7, color: b.sub, maxWidth: 380 }}>{b.body}</p>
                <span
                  style={{
                    marginTop: "auto",
                    paddingTop: 20,
                    fontFamily: poppins,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  open &#8594;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CONFIDENCE ERA: copy only, same reason as section 3. The placeholder panel that
           used to sit beside this copy was cut; a real workshop photo would go here. ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--cream)", paddingTop: 72, paddingBottom: 72, borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ maxWidth: 720 }}>
            <div className="tag mb-4">your first workshops inside</div>
            <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 78px)", color: "var(--dark)" }}>
              your
              <br />
              confidence
              <br />
              <span className="pk">era.</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--grey)", maxWidth: 560, margin: "24px 0 28px" }}>
              {szn} szn isn&apos;t something you read about. A live masterclass and a live astro tapping every month,
              the next one wednesday 19 august, then the tools to actually live it.
            </p>
            <Link href="/events" className="btn-pink no-underline">
              see what&apos;s on
            </Link>
          </div>
        </div>
      </section>

      {/* ── PODCAST: the free way in. A subscribe block for logged-out visitors, mirroring the
           /podcast hero but condensed. Real Spotify + Apple show links. Buttons are brand-styled
           (pink/black) rather than platform green, to keep the homepage on the brand palette. ── */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              style={{
                fontFamily: poppins,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--pink)",
                marginBottom: 20,
              }}
            >
              the myszn podcast · new episodes weekly
            </div>
            <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 76px)", color: "#3C2A70" }}>
              subscribe & never
              <br />
              miss an <span className="pk">episode.</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#3C2A70", maxWidth: 460, margin: "22px 0 28px", fontWeight: 500 }}>
              The weekly pep talk your future self would give you. Astrology, money, manifestation and
              main character energy. Free, no membership needed.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://open.spotify.com/show/7Hi3IXajGlE1LuZD5sf08a?si=445720c35a884330"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 28px",
                  background: "var(--dark)", color: "#fff", fontFamily: poppins, fontSize: 13,
                  fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Spotify
              </a>
              <a
                href="https://podcasts.apple.com/gb/podcast/my-szn/id1870482009"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 28px",
                  background: "var(--pink)", color: "#fff", fontFamily: poppins, fontSize: 13,
                  fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                  <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c4.988 0 8.94 3.16 9.69 7.62.06.36-.18.72-.54.78-.36.06-.72-.18-.78-.54C19.56 6.36 16.11 3.6 11.88 3.6c-4.32 0-7.86 2.88-8.46 6.96-.06.36-.42.6-.78.54-.36-.06-.6-.42-.54-.78.72-4.56 4.8-7.752 9.765-7.752zM12 7.2c3.36 0 6.12 2.16 6.6 5.22.06.36-.18.72-.54.78-.36.06-.72-.18-.78-.54C16.92 10.08 14.7 8.28 12 8.28c-2.76 0-5.04 1.92-5.34 4.5-.06.36-.42.6-.78.54-.36-.06-.6-.42-.54-.78C5.76 9.48 8.58 7.2 12 7.2zm-.06 4.44c1.98 0 3.54 1.32 3.84 3.24.12.6.12 1.44-.12 2.52l-.6 2.28c-.18.66-.78 1.08-1.44 1.08h-3.36c-.66 0-1.26-.42-1.44-1.08l-.6-2.28c-.18-.84-.24-1.68-.06-2.52.36-1.92 1.86-3.24 3.78-3.24z" />
                </svg>
                Apple Podcasts
              </a>
            </div>
          </div>

          {/* Podcast artwork as the visual, framed with a "now playing" bar to echo the player in the
              reference without needing a device-frame asset. */}
          <div className="justify-self-center md:justify-self-end" style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ border: "var(--border)", background: "#fff" }}>
              <Image
                src="/myszn-podcast.png"
                alt="MY SZN podcast cover art"
                width={752}
                height={754}
                sizes="(max-width: 768px) 100vw, 380px"
                style={{ width: "100%", height: "auto", aspectRatio: "1", objectFit: "cover", display: "block" }}
              />
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: "var(--border)" }}>
                <span
                  aria-hidden
                  style={{
                    width: 34, height: 34, flex: "none", borderRadius: "50%", background: "var(--pink)",
                    color: "#fff", display: "grid", placeItems: "center", fontSize: 13,
                  }}
                >
                  ▶
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: poppins, fontSize: 12, fontWeight: 800, color: "var(--dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    latest episode
                  </div>
                  <div style={{ fontSize: 11, color: "var(--grey)" }}>the myszn podcast</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>
                  new
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE VAULT: the newest class replay, locked. Sits after the podcast (the free way in)
           so a visitor meets the free thing first and the members-only thing second. Hides itself
           for anyone who already has access. ── */}
      <ReplayTeaser />

      {/* ── 9. CLOSING CTA: black, biggest type on the page ── */}
      <section
        id="waitlist"
        className="bleed px-5 md:px-8 text-center"
        style={{ background: "var(--dark)", paddingTop: 100, paddingBottom: 100 }}
      >
        <div className="bleed-content max-w-4xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(40px, 8vw, 104px)", color: "#fff" }}>
            ready to
            <br />
            become your
            <br />
            <span className="pk">Future You? ✨</span>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.8,
              maxWidth: 520,
              margin: "34px auto 34px",
            }}
          >
            {enrolmentOpen
              ? "Start your free 7 days and step into the whole personalised astrology portal built around your birth chart. No card needed, and it's $88/mo to keep it all after your week."
              : "Start your free 7 days and step into the whole personalised astrology portal built around your birth chart. No card needed, and the paid doors reopen while you're still inside your week."}
          </p>
          <Link
            href={FREE_TRIAL_CTA.href}
            className="no-underline"
            style={{
              background: "var(--pink)",
              color: "var(--dark)",
              fontFamily: poppins,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "22px 52px",
              display: "inline-block",
            }}
          >
            {FREE_TRIAL_CTA.label}
          </Link>
        </div>
      </section>
    </>
  );
}
