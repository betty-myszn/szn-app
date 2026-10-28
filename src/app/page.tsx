"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import Manifesto from "@/components/Manifesto";
import MeetBetty from "@/components/MeetBetty";
import QuoteStrip from "@/components/QuoteStrip";
import CovenPromoBand from "@/components/CovenPromoBand";
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
//   3 baddie szn     every way in, Betty's copy, as a colour-block grid
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

// The "your baddie szn" grid: Betty's copy word for word, each way in on its own brand colour so the
// grid reads as a colour block instead of seven matching boxes. Wide cards break the rhythm.
const SZN_WAYS: { emoji: string; title: string; body: string; href: string; ctaLabel: string; bg: string; ink: string; head?: string; cta: string; wide?: boolean }[] = [
  { emoji: "🪐", title: "Get your Astro & HD reports", body: "Your birth chart has RECEIPTS, babe. Find out how you're wired, where your money magic lives, what makes you magnetic and how to use your astrology to your advantage.", href: "/reports", ctaLabel: "get your report", bg: "var(--pink)", ink: "var(--dark)", head: "#fff", cta: "var(--dark)", wide: true },
  { emoji: "🦄", title: "Join the Baddie Coven", body: "Witches, weirdos and wonderful women, ASSEMBLE. Make new friends, cast spells, get creative and find the kind of girl gang you've always wanted.", href: "/baddie-coven", ctaLabel: "join the coven", bg: "var(--lav)", ink: "var(--dark)", cta: "var(--dark)" },
  { emoji: "💜", title: "Book a 1:1 session", body: "Got big dreams and some sh*t to work through? Let's get into it. Astrology, manifestation, shadow work, money and becoming the most powerful version of YOU.", href: "/baddie-sessions", ctaLabel: "book a session", bg: "var(--dark)", ink: "#fff", head: "var(--pink)", cta: "var(--pink)" },
  { emoji: "🔥", title: "Join the mastermind", body: "Big dreams. Bigger moves. Women who actually want to see you WIN. Get coaching, accountability and a whole room of baddies who refuse to play small.", href: "/mastermind", ctaLabel: "join the mastermind", bg: "var(--pink-light)", ink: "var(--dark)", cta: "var(--pink)", wide: true },
  { emoji: "🌴", title: "Come to our retreat", body: "Pack your bags, b*tch. We're going to MEXICO. Think astrology, witchcraft, shadow work, sisterhood and the kind of experiences you'll be talking about for YEARS.", href: "/retreat", ctaLabel: "come with us", bg: "var(--lav-light)", ink: "var(--dark)", cta: "var(--pink)" },
  { emoji: "🎤", title: "Listen to the podcast", body: "Big conversations, wild stories, astrology, money, manifestation and women who are doing whatever the f*ck they want. Pop your headphones in, babe.", href: "/podcast", ctaLabel: "listen", bg: "var(--dark)", ink: "#fff", head: "#fff", cta: "var(--pink)" },
  { emoji: "📖", title: "Read our book", body: "Consider this your permission slip to stop following everyone else's rules. Get into the astrology, self-discovery and practical magic that'll help you write your own damn story.", href: "/book", ctaLabel: "get the book", bg: "var(--pink)", ink: "var(--dark)", head: "#fff", cta: "var(--dark)" },
];

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
            <div style={{ marginBottom: 26 }}>
              <span className="holo-sticker" style={{ transform: "rotate(-4deg)" }}>💜 welcome to my szn 🪩</span>
            </div>
            <h1 className="display" style={{ fontSize: "clamp(40px, 6vw, 78px)", color: "var(--dark)", lineHeight: 0.98 }}>
              you didn&apos;t come here
              <br />
              <span style={{ color: "#fff" }}>to play small.</span>
            </h1>
            <p style={{ fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.6, color: "var(--dark)", maxWidth: 480, marginTop: 24, fontWeight: 600 }}>
              MY SZN is a whole universe of astrology, manifestation, creativity and sisterhood for women who want to be rich, confident, creative, independent and completely OBSESSED with the lives they&apos;re creating.
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
          <div style={{ position: "relative", alignSelf: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-cutout" src="/hero-cutout.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ─── 1b. THE BADDIE COVEN launch, in the slot the event band (EventPromoBand) used for the full moon ─── */}
      <CovenPromoBand />

      {/* ─── 2. TICKER ─── */}
      <Ticker variant="lav" items={UNIVERSE.map((o) => `${o.emoji} ${o.name.toLowerCase()}`)} />

      {/* ─── 3. YOUR BADDIE SZN (Betty's copy, 19 Oct 2026) ─── */}
      <section id="universe" className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 84, scrollMarginTop: 70 }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 76px)", color: "var(--dark)", lineHeight: 0.98 }}>
            welcome to your <span className="pk">baddie szn.</span> <span style={{ fontSize: "0.55em" }}>💖🪩</span>
          </h2>
          <div style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.75, color: "var(--dark)", marginTop: 22, fontWeight: 600, maxWidth: 760 }}>
            <p style={{ margin: "0 0 12px" }}>There&apos;s more than one way to be a bad b*tch, babe.</p>
            <p style={{ margin: "0 0 12px" }}>Wanna make more money, understand your astrology, find your fellow witches or completely reinvent your f*cking life? You&apos;re in the right place.</p>
            <p style={{ margin: 0, fontFamily: poppins, fontWeight: 800 }}>Pick your pleasure. Your SZN starts here.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 34 }}>
            {SZN_WAYS.map((w) => (
              <Link
                key={w.title}
                href={w.href}
                className={`no-underline offer-card szn-way ${w.wide ? "lg:col-span-2" : ""}`}
                style={{ background: w.bg, color: w.ink, border: "var(--border)", borderRadius: 22, padding: "26px 24px 24px", display: "flex", flexDirection: "column", gap: 10, minHeight: 230 }}
              >
                <span className="szn-way-emoji" style={{ fontSize: 40, lineHeight: 1 }}>{w.emoji}</span>
                <span style={{ fontFamily: poppins, fontSize: w.wide ? "clamp(24px, 2.6vw, 32px)" : 23, fontWeight: 800, lineHeight: 1.1, color: w.head ?? w.ink }}>{w.title}</span>
                <span style={{ fontSize: 15.5, lineHeight: 1.65, maxWidth: w.wide ? 560 : undefined }}>{w.body}</span>
                <span style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "auto", paddingTop: 8, color: w.cta }}>{w.ctaLabel} →</span>
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
            Our ongoing magical membership, with a live coven circle every month, a platform personalised to your birth chart and Human Design, moon rituals, shadow work, chat rooms and a community of women who bring a ridiculous amount of magic into their everyday lives together.
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
          <Link href="/podcast" className="no-underline offer-card grid grid-cols-[1fr_auto] gap-5 items-center" style={{ background: "var(--dark)", color: "#fff", border: "var(--border)", borderRadius: 22, padding: "26px 24px" }}>
            <div>
              <div className="tag">🎙️ listen now</div>
              <h2 className="display" style={{ fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1, marginTop: 12, color: "#fff" }}>the my szn <span className="pk">podcast.</span></h2>
              <p style={{ fontSize: 15, lineHeight: 1.65, marginTop: 12 }}>Astrology, money, manifestation, guest conversations and main character energy, every week, straight into your ears.</p>
              <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 16, color: "var(--pink)" }}>listen →</div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/myszn-podcast.png" alt="The MY SZN podcast cover" style={{ width: "clamp(110px, 16vw, 190px)", aspectRatio: "1", objectFit: "cover", borderRadius: 14, border: "1.5px solid #fff", transform: "rotate(3deg)" }} />
          </Link>
          <Link href="/book" className="no-underline offer-card grid grid-cols-[1fr_auto] gap-5 items-center" style={{ background: "var(--pink-light)", color: "var(--dark)", border: "var(--border)", borderRadius: 22, padding: "26px 24px" }}>
            <div>
              <div className="tag">📚 out now</div>
              <h2 className="display" style={{ fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1, marginTop: 12 }}>the my szn <span className="pk">book.</span></h2>
              <p style={{ fontSize: 15, lineHeight: 1.65, marginTop: 12 }}>Becoming your future self through astrology, manifestation, self-concept, confidence, healing, money and creating your dream life, in paperback and ebook.</p>
              <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 16, color: "var(--pink)" }}>get your copy →</div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/myszn-book-cover.jpg" alt="The MY SZN book cover" style={{ width: "clamp(96px, 13vw, 150px)", aspectRatio: "534 / 810", objectFit: "cover", borderRadius: 6, border: "var(--border)", transform: "rotate(-3deg)", boxShadow: "6px 7px 0 var(--dark)" }} />
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
