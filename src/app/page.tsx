"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { useEnrolmentOpen } from "@/lib/enrolment";
import { WORKSHOPS, formatWorkshopWhenLA } from "@/lib/workshops";

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
  { n: "2", label: "live coaching workshops every single szn" },
  { n: "24/7", label: "a community of women becoming her" },
];

const HEADLINES = [
  {
    kicker: "☉ the sky right now",
    title: "leo szn has begun.",
    body: "Confidence is officially in session. Your portal has already shifted to match it, new themes, new prompts, new work.",
    href: "/your-season",
    cta: "read your szn",
  },
  {
    kicker: "✦ this week inside",
    title: "two live workshops.",
    body: "Visibility and getting paid to be fully yourself, live with Betty, replays saved forever.",
    href: "/events",
    cta: "see the workshops",
  },
  {
    kicker: "☾ from the community",
    title: "the becoming-her thread.",
    body: "Wins, questions and the kind of support that only lands when the other women actually know your chart.",
    href: "/community",
    cta: "meet the club",
  },
];

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
    title: "live coaching workshops",
    body: "Astrology, tapping, embodiment and coaching, live every szn. Replays saved forever.",
    href: "/events",
    wide: true,
  },
];

export default function Home() {
  const router = useRouter();
  const { member, ready } = useMember();
  const season = useSeason();
  const enrolmentOpen = useEnrolmentOpen();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  // Read the next dated class straight off the workshop data rather than retyping it here. The
  // ticker previously hardcoded the weekday, and when the class moved from 28 July to 3 August it
  // carried on telling every homepage visitor the wrong day. Derived, it can't drift again.
  const nextWorkshop = WORKSHOPS.find((w) => w.startIso);

  useEffect(() => {
    if (ready && member) router.replace("/dashboard");
  }, [ready, member, router]);

  if (!ready || member) return null;

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "membership-waitlist" }),
      });
    } catch {
      // mock mode, the confirmation still shows
    }
  };

  const szn = season.sign.toLowerCase();

  return (
    <>
      <Ticker
        items={[
          `✦ ${szn} szn`,
          enrolmentOpen ? "✦ doors close in 72 hours" : "✦ doors open soon",
          nextWorkshop?.startIso
            ? `✦ live workshop ${formatWorkshopWhenLA(nextWorkshop.startIso)}`
            : "✦ live workshops every szn",
          "✦ your personal birth chart",
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
            {/* While the doors are open the primary CTA goes straight into the payment-first
                flow (pricing, then Stripe Checkout). Once the window closes it reverts to
                collecting leads, no redesign needed. See src/lib/enrolment.ts. */}
            {enrolmentOpen ? (
              <Link
                href="/membership"
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
                join my szn
              </Link>
            ) : (
              <a
                href="#waitlist"
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
                join the waitlist
              </a>
            )}
            <Link href="/login" className="btn-outline no-underline">
              member login
            </Link>
          </div>
        </div>
      </section>

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

      {/* ── 5. NEWSPAPER: three stories, hairline rules ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", paddingTop: 72, paddingBottom: 72, borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="rule mb-10" style={{ color: "var(--dark)" }}>
            <span>today&apos;s headlines</span>
          </div>
          <div className="news" style={{ borderTop: "var(--border)", borderBottom: "var(--border)" }}>
            {HEADLINES.map((h) => (
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
              {szn} szn isn&apos;t something you read about. Two live workshops on visibility, confidence and getting
              paid to be fully yourself, starting 3 august, then the tools to actually live it.
            </p>
            <Link href="/events" className="btn-pink no-underline">
              see the workshops
            </Link>
          </div>
        </div>
      </section>

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
              ? "Join MY SZN and unlock a personalised astrology portal built around your unique birth chart, helping you become the woman you're here to be."
              : "Join the waitlist and you'll be first through the doors when they open. You sign up with your birth date, time and place, and that builds the whole portal around you."}
          </p>
          {enrolmentOpen ? (
            <Link
              href="/membership"
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
              join my szn
            </Link>
          ) : !joined ? (
            <form
              onSubmit={handleWaitlist}
              className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
              style={{ border: "1.5px solid #fff" }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email address"
                className="flex-1"
                style={{ border: "none", outline: "none", padding: "18px 20px", fontSize: 14, background: "#fff" }}
              />
              <button type="submit" className="btn-pink" style={{ cursor: "pointer", border: "none", padding: "18px 30px" }}>
                join the waitlist
              </button>
            </form>
          ) : (
            <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, color: "var(--pink)" }}>
              you&apos;re on the list. watch your inbox, your era is loading. &#10022;
            </p>
          )}
        </div>
      </section>
    </>
  );
}
