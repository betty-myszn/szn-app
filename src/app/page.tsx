"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { useEnrolmentOpen } from "@/lib/enrolment";

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

/* ── Shape kit ──
   The page gets its interest from colour fields and geometry rather than
   photography, so these are the recurring marks: orbit rings, a starburst
   badge and a solid disc. All flat, all brand palette. */

function Orbit({
  size = 520,
  stroke = "var(--dark)",
  rings = 4,
  opacity = 1,
  className,
  style,
}: {
  size?: number;
  stroke?: string;
  rings?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      aria-hidden
      className={className}
      style={style}
      opacity={opacity}
    >
      {Array.from({ length: rings }).map((_, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={98 - i * (90 / rings)}
          fill="none"
          stroke={stroke}
          strokeWidth={i === 0 ? 1.6 : 1}
        />
      ))}
    </svg>
  );
}

function Starburst({
  label,
  fill = "var(--pink)",
  color = "#fff",
  size = 132,
  style,
}: {
  label: string;
  fill?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const points = Array.from({ length: 32 }).map((_, i) => {
    const r = i % 2 === 0 ? 50 : 39;
    const a = (i / 32) * Math.PI * 2 - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={style}>
      <polygon points={points.join(" ")} fill={fill} stroke="var(--dark)" strokeWidth="1.2" />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="11"
        fontFamily={poppins}
        fontWeight="800"
        letterSpacing="0.5"
      >
        {label}
      </text>
    </svg>
  );
}

/* A flat colour panel with a glyph and rings, used where a screenshot would go. */
function Tile({
  bg,
  glyph,
  glyphColor,
  ringColor,
  caption,
  captionColor,
}: {
  bg: string;
  glyph: string;
  glyphColor: string;
  ringColor: string;
  caption: string;
  captionColor: string;
}) {
  return (
    <div className="tile" style={{ background: bg }}>
      <Orbit
        size={620}
        stroke={ringColor}
        rings={6}
        style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", maxWidth: "130%" }}
      />
      <div className="tile-glyph" style={{ color: glyphColor }}>
        {glyph}
      </div>
      <div
        style={{
          position: "absolute",
          left: 22,
          bottom: 20,
          fontFamily: poppins,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: captionColor,
        }}
      >
        {caption}
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
          "✦ live workshop tuesday",
          "✦ your personal birth chart",
          "✦ the astrology community",
        ]}
      />

      {/* ── 1. HERO: pink field, one statement, orbit bleeding off the edge ── */}
      <section
        className="bleed px-5 md:px-8"
        style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}
      >
        <Orbit
          className="bleed-shape"
          size={720}
          stroke="rgba(255,255,255,0.45)"
          rings={7}
          style={{ position: "absolute", right: "-190px", top: "50%", transform: "translateY(-50%)" }}
        />
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
            {enrolmentOpen && (
              <Starburst label="72 HRS" fill="var(--dark)" color="var(--pink)" size={116} style={{ marginLeft: 6 }} />
            )}
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

      {/* ── 3. SPLIT: tile left, copy right ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", paddingTop: 72, paddingBottom: 72, borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="rule mb-12" style={{ color: "var(--dark)" }}>
            <span>&#10022;&nbsp; inside my szn &nbsp;&#10022;</span>
          </div>
          <div className="split split--wide-right gap-12 md:gap-16 items-center">
            <div style={{ maxWidth: 460 }}>
              <Tile
                bg="var(--lav-light)"
                glyph="☉"
                glyphColor="var(--dark)"
                ringColor="rgba(60,42,112,0.28)"
                caption="your cosmic home"
                captionColor="#3C2A70"
              />
            </div>
            <div>
              <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 78px)", color: "var(--dark)" }}>
                your cosmic
                <br />
                <span className="pk">home.</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--grey)", maxWidth: 460, margin: "24px 0 28px" }}>
                One portal that already knows your sun, moon, rising and every placement underneath. Your readings, your
                prompts, your workshops and your guidance, all rebuilt around the exact sky you were born under.
              </p>
              <Link href="/membership" className="btn-pink no-underline">
                see what&apos;s inside
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. GIANT LILAC BLOCK: type only, shape bleeding off ── */}
      <section
        className="bleed px-5 md:px-8"
        style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 96, paddingBottom: 96 }}
      >
        <Orbit
          className="bleed-shape"
          size={640}
          stroke="rgba(60,42,112,0.22)"
          rings={8}
          style={{ position: "absolute", left: "-170px", bottom: "-200px" }}
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
            <span className="sticker" style={{ background: "var(--pink)", color: "#fff" }}>
              updated every szn
            </span>
          </div>
        </div>
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

      {/* ── 8. SPLIT FLIPPED: copy left, tile right ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--cream)", paddingTop: 72, paddingBottom: 72, borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="split split--wide-left split--flip gap-12 md:gap-16 items-center">
            <div style={{ maxWidth: 460, justifySelf: "end", width: "100%" }}>
              <Tile
                bg="var(--dark)"
                glyph="★"
                glyphColor="var(--pink)"
                ringColor="rgba(200,180,248,0.3)"
                caption="live every szn"
                captionColor="var(--lav)"
              />
            </div>
            <div>
              <div className="tag mb-4">your first workshops inside</div>
              <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 78px)", color: "var(--dark)" }}>
                your
                <br />
                confidence
                <br />
                <span className="pk">era.</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--grey)", maxWidth: 440, margin: "24px 0 28px" }}>
                {szn} szn isn&apos;t something you read about. Two live workshops on visibility, confidence and getting
                paid to be fully yourself, then the tools to actually live it.
              </p>
              <Link href="/events" className="btn-pink no-underline">
                see the workshops
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. CLOSING CTA: black, biggest type on the page ── */}
      <section
        id="waitlist"
        className="bleed px-5 md:px-8 text-center"
        style={{ background: "var(--dark)", paddingTop: 100, paddingBottom: 100 }}
      >
        <Orbit
          className="bleed-shape"
          size={760}
          stroke="rgba(200,180,248,0.16)"
          rings={9}
          style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        />
        <div className="bleed-content max-w-4xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(40px, 8vw, 104px)", color: "#fff" }}>
            ready to make
            <br />
            your birth chart
            <br />
            <span className="pk">your personality?</span>
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
              ? "The doors are open right now. Pick your membership and your personalised portal is built the moment you're in."
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
