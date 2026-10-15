"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import Manifesto from "@/components/Manifesto";
import MeetBetty from "@/components/MeetBetty";
import QuoteStrip from "@/components/QuoteStrip";
import { OFFERS, PODCAST } from "@/lib/offers";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// ─────────────────────────────────────────────────────────────────────────────────────────────
// The MY SZN brand homepage (13 Oct 2026). Introduces the whole universe: two reports, the Baddie
// Coven, the Mastermind, the Retreat, the podcast and the book, each with its own section and link.
// The old homepage (the Mastermind sales page) now lives at /mastermind almost word for word.
//
// Section jobs, so nothing gets sold twice:
//   1 hero           the brand promise, one feeling, two buttons
//   2 ticker         the seven doors, scrolling
//   3 the universe   all seven at a glance, one line each
//   4 mastermind     the premium offer gets the biggest spotlight (ad traffic still lands here)
//   5 reports        money + confidence, side by side
//   6 coven          the clubhouse
//   7 retreat        in real life
//   8 podcast + book listen now, read now
//   9-11             manifesto, Betty, quotes (the brand's beliefs and founder, moved from the old home)
//   12 free chart    the free way in
//   13 close         pick your door
// ─────────────────────────────────────────────────────────────────────────────────────────────

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

const UNIVERSE = [
  OFFERS["rich-btch-rising"],
  OFFERS["bad-btch-report"],
  OFFERS["baddie-coven"],
  OFFERS.mastermind,
  OFFERS.retreat,
  { ...PODCAST, line: "the weekly pep talk your future self would give you", slug: "podcast" },
  OFFERS.book,
];

function Button({ href, children, tone = "dark" }: { href: string; children: React.ReactNode; tone?: "dark" | "pink" | "white" }) {
  const bg = tone === "pink" ? "var(--pink)" : tone === "white" ? "#fff" : "var(--dark)";
  return (
    <Link
      href={href}
      className="no-underline"
      style={{ background: bg, color: tone === "white" ? "var(--dark)" : "#fff", fontFamily: poppins, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px", display: "inline-block", border: tone === "white" ? "var(--border)" : undefined }}
    >
      {children}
    </Link>
  );
}

export default function Home() {
  const router = useRouter();
  const { member, ready } = useMember();

  useEffect(() => {
    if (ready && member) router.replace("/dashboard");
  }, [ready, member, router]);

  if (ready && member) return null;

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72, overflow: "visible", position: "relative", zIndex: 1 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[0.82fr_1.18fr] gap-6 md:gap-8 items-end">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", marginBottom: 22 }}>
              💜 welcome to my szn 🪩
            </div>
            <h1 className="display" style={{ fontSize: "clamp(40px, 6vw, 78px)", color: "var(--dark)", lineHeight: 0.98 }}>
              you didn&apos;t come here
              <br />
              <span style={{ color: "#fff" }}>to play small.</span>
            </h1>
            <p style={{ fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.6, color: "var(--dark)", maxWidth: 480, marginTop: 24, fontWeight: 600 }}>
              MY SZN is a whole universe of astrology, manifestation, creativity and sisterhood for women who want to be rich, confident, creative, independent and completely OBSESSED with the lives they&apos;re creating.
            </p>
            <p style={{ fontFamily: poppins, fontSize: "clamp(17px, 2vw, 21px)", fontWeight: 800, color: "#fff", maxWidth: 520, marginTop: 14, lineHeight: 1.35 }}>
              Pick your door, babe. There are seven.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#universe" className="no-underline" style={{ background: "var(--dark)", color: "#fff", fontFamily: poppins, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "22px 44px", display: "inline-block" }}>
                explore my szn
              </a>
              <Link href="/chart" className="no-underline" style={{ color: "var(--dark)", fontFamily: poppins, fontSize: 15, fontWeight: 800, textDecoration: "underline", textUnderlineOffset: 4 }}>
                or get your free birth chart →
              </Link>
            </div>
          </div>
          <div style={{ position: "relative", alignSelf: "end" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-cutout" src="/hero-cutout.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ─── 2. TICKER ─── */}
      <Ticker variant="lav" items={UNIVERSE.map((o) => `${o.emoji} ${o.name.toLowerCase()}`)} />

      {/* ─── 3. THE UNIVERSE ─── */}
      <section id="universe" className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80, scrollMarginTop: 70 }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-5">the my szn universe</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 72px)", color: "var(--dark)", lineHeight: 1 }}>
            seven ways to <span className="pk">become HER.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.75, color: "var(--dark)", marginTop: 22, fontWeight: 600, maxWidth: 760 }}>
            Some of us want our chart in writing, some of us want a coven to cast spells with on a Tuesday night, and some of us want ninety days of coaching that drags our future self into the present, so we built a door for every version of you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginTop: 32 }}>
            {UNIVERSE.map((o) => (
              <Link key={o.href} href={o.href} className="no-underline offer-card" style={{ border: "var(--border)", borderRadius: 18, background: "var(--pink-light)", padding: "22px 20px", color: "var(--dark)", display: "block" }}>
                <div style={{ fontSize: 30 }}>{o.emoji}</div>
                <div style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, lineHeight: 1.2, marginTop: 8 }}>{o.name}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.6, marginTop: 6 }}>{o.line}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. MASTERMIND ─── */}
      <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 88, borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">🪐 the my szn mastermind</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 6.5vw, 80px)", color: "#fff", lineHeight: 0.98 }}>
            90 days to <span className="pk">become her.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.75, color: "rgba(255,255,255,0.88)", marginTop: 24, maxWidth: 740, fontWeight: 500 }}>
            Our premium 90-day transformation experience, where your birth chart and Human Design meet self-concept work, manifestation, shadow work, group coaching and accountability, with a private 1:1 with Betty every single month, for ambitious women who want to make BIGGER moves, more $$$ and their absolute best life.
          </p>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginTop: 16 }}>{OFFERS.mastermind.price}. Waitlist open now.</p>
          <div style={{ marginTop: 30 }}>
            <Button href="/mastermind" tone="pink">tell me everything</Button>
          </div>
        </div>
      </section>

      {/* ─── 5. REPORTS ─── */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-5">💸💜 the reports</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 72px)", color: "var(--dark)", lineHeight: 1 }}>
            your chart, <span className="pk">in writing.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 30 }}>
            {[
              { o: OFFERS["rich-btch-rising"], bg: "var(--pink)", ink: "var(--dark)", body: "Your personalised money report: wealth, earning potential, money blocks, financial independence and the self-worth that decides what you charge." },
              { o: OFFERS["bad-btch-report"], bg: "var(--dark)", ink: "#fff", body: "Your personalised confidence report: personal power, visibility, self-expression, boundaries and becoming your most unapologetic self." },
            ].map(({ o, bg, ink, body }) => (
              <Link key={o.slug} href={o.href} className="no-underline offer-card" style={{ background: bg, color: ink, border: "var(--border)", borderRadius: 22, padding: "30px 26px", display: "block" }}>
                <div style={{ fontSize: 38 }}>{o.emoji}</div>
                <h3 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1, marginTop: 10, color: ink }}>{o.name}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 14, fontWeight: 500 }}>{body}</p>
                <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 18, color: o.slug === "bad-btch-report" ? "var(--pink)" : "#fff" }}>join the waitlist →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. COVEN ─── */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5" style={{ color: "var(--dark)" }}>🦄 the baddie coven</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 6.5vw, 80px)", color: "var(--dark)", lineHeight: 0.98 }}>
            a clubhouse <span style={{ color: "#fff" }}>for witches.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.75, color: "var(--dark)", marginTop: 24, maxWidth: 740, fontWeight: 600 }}>
            Our ongoing creative, cosmic membership, with monthly creative classes, astrology, manifestation, rituals, witchcraft and a community of women who connect, create and bring a ridiculous amount of magic into their everyday lives together.
          </p>
          <div style={{ marginTop: 30 }}>
            <Button href="/baddie-coven">join the coven waitlist</Button>
          </div>
        </div>
      </section>

      {/* ─── 7. RETREAT ─── */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-4xl mx-auto md:text-right md:ml-auto">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", marginBottom: 20 }}>🌴 the bad b*tch retreat</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 6.5vw, 80px)", color: "var(--dark)", lineHeight: 0.98 }}>
            all of you, <span style={{ color: "#fff" }}>in real life.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.75, color: "var(--dark)", marginTop: 24, maxWidth: 740, fontWeight: 600, marginLeft: "auto" }}>
            An immersive in-person experience exploring your body, sensuality, creativity, confidence, sexuality, shadow, personal power and self-love, through astrology, embodiment, movement, ritual and the kind of sisterhood that changes you.
          </p>
          <div style={{ marginTop: 30 }}>
            <Button href="/retreat">save me a spot</Button>
          </div>
        </div>
      </section>

      {/* ─── 8. PODCAST + BOOK ─── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href="/podcast" className="no-underline offer-card" style={{ background: "var(--dark)", color: "#fff", border: "var(--border)", borderRadius: 22, padding: "30px 26px", display: "block" }}>
            <div className="tag">🎙️ listen now</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 4.4vw, 50px)", lineHeight: 1, marginTop: 12, color: "#fff" }}>the my szn <span className="pk">podcast.</span></h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 14 }}>Astrology, money, manifestation, guest conversations and main character energy, every week, straight into your ears.</p>
            <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 18, color: "var(--pink)" }}>listen →</div>
          </Link>
          <Link href="/book" className="no-underline offer-card" style={{ background: "var(--pink-light)", color: "var(--dark)", border: "var(--border)", borderRadius: 22, padding: "30px 26px", display: "block" }}>
            <div className="tag">📚 out now</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 4.4vw, 50px)", lineHeight: 1, marginTop: 12 }}>the my szn <span className="pk">book.</span></h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 14 }}>Becoming your future self through astrology, manifestation, self-concept, confidence, healing, money and creating your dream life, in paperback and ebook.</p>
            <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 18, color: "var(--pink)" }}>get your copy →</div>
          </Link>
        </div>
      </section>

      {/* ─── 9-11. THE BRAND ─── */}
      <Manifesto />
      <MeetBetty />
      <QuoteStrip ids={["jade", "lauren", "maya"]} label="what bigger moves look like in here" tone="lav" />

      {/* ─── 12. FREE CHART ─── */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 64, paddingBottom: 68 }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-6 md:justify-between">
          <div>
            <div className="tag mb-3">✨ start for free</div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 4.5vw, 48px)", color: "var(--dark)", lineHeight: 1 }}>get your free <span className="pk">birth chart.</span></h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 12, maxWidth: 520 }}>Your full chart in under a minute, so you can see exactly what you&apos;re working with before you pick a door.</p>
          </div>
          <Button href="/chart" tone="pink">get my chart</Button>
        </div>
      </section>

      {/* ─── 13. CLOSE ─── */}
      <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 88, paddingBottom: 96, position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="close-money" src="/cosmic-money.png" alt="" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="close-planet" src="/cosmic-planet.png" alt="" aria-hidden="true" />
        <div className="max-w-4xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>
          <h2 className="display" style={{ fontSize: "clamp(38px, 7vw, 88px)", color: "#fff", lineHeight: 0.98 }}>
            it&apos;s your
            <br />
            <span className="pk">szn, baby.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.85)", maxWidth: 620, margin: "26px auto 0", fontWeight: 500 }}>
            Rich, rested, resourced, wildly in love with yourself and extremely difficult to control, that&apos;s the plan, so pick the door that&apos;s calling you loudest and walk straight through it.
          </p>
          <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 34 }}>
            {UNIVERSE.map((o) => (
              <Link key={o.href} href={o.href} className="no-underline" style={{ border: "2px solid #fff", color: "#fff", borderRadius: 999, padding: "10px 18px", fontFamily: poppins, fontSize: 13, fontWeight: 800 }}>
                {o.emoji} {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
