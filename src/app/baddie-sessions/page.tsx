import type { Metadata } from "next";
import { Band } from "@/components/Offer";
import HoloShape from "@/components/HoloShape";
import { BADDIE_SESSIONS, SESSION_OPTIONS, SESSION_PACKAGE, bookingHref } from "@/lib/baddie-sessions";
import { OG_IMAGE } from "@/lib/site";

const pp = "var(--font-poppins), Poppins, sans-serif";

export const metadata: Metadata = {
  title: { absolute: "The Baddie Sessions | 1:1 Astrology & Coaching | MY SZN" },
  description:
    "Book a private Baddie Session with Betty. Explore astrology, manifestation, shadow work, money, confidence and personal transformation through personalised 1:1 coaching.",
  alternates: { canonical: "/baddie-sessions" },
  openGraph: {
    title: "The Baddie Sessions 💅",
    description: "Five private 1:1 coaching sessions with Betty: astrology, manifestation, shadow work, business strategy and practical tools to become the woman you actually want to be.",
    url: "/baddie-sessions",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
};

// Sentence case on every button here (Betty's brief), so no uppercase transform.
// textTransform/letterSpacing also undo .btn-pink's caps, which the pink CTAs carry for the foil sheen.
const btn = (bg: string, ink = "#fff") => ({ display: "inline-block", background: bg, color: ink, fontFamily: pp, fontSize: 16, fontWeight: 800, padding: "18px 32px", border: "var(--border)", textTransform: "none" as const, letterSpacing: "normal" });

// In a two-column grid, an odd last card centres at half width instead of sitting alone on the left.
// Written out per breakpoint so Tailwind sees the full class names.
const lastOdd = (i: number, n: number, bp: "sm" | "md" = "md") =>
  n % 2 === 1 && i === n - 1 ? (bp === "md" ? "md:col-span-2 md:mx-auto md:w-[calc(50%-12px)]" : "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-8px)]") : "";

// Why book with Betty: sits after the session cards, once she knows what's on offer (Betty moved it down, 27 Oct 2026).
const WHY = [
  { emoji: "🔮", title: "I do my homework on YOU", body: "Before we ever meet I spend two to three hours obsessing over your astrology and your Human Design like it's my favourite group chat, then I build all ninety minutes around how YOU are wired, so every single minute is made for you and you alone." },
  { emoji: "💸", title: "Twenty years of business brain, babe", body: "I've been a coach, business consultant and strategist for twenty years and I run my own global dream business, so when you want more money, a launch or a big fat career glow-up, you get a proper strategy with the magic poured all over the top." },
  { emoji: "🧠", title: "We go straight for the subconscious", body: "Hypnosis, mindset work and energy work come out whenever your goals call for them, so we get our hands on the gremlins that have been running your life from the basement and evict every last one of them." },
  { emoji: "💖", title: "Thousands of baddies went first", body: "I've been coaching women for over a decade, thousands of them, so whatever you're bringing in, the drama, the fear, the 3am spiral, I've seen it, I LOVE it and I know exactly how to help you move it." },
];

// Betty's credentials as she gave them (27 Oct 2026): no member or client headcounts beyond "thousands".
const STATS = [
  { big: "20 years", small: "as a coach, business consultant + strategist" },
  { big: "a global", small: "dream business I built and run" },
  { big: "2 books", small: "published, babe" },
  { big: "thousands", small: "of clients coached around the world" },
];

const FOR_YOU_IF = [
  "You've got a dream you're OBSESSED with and you're done keeping it in your drafts folder",
  "You keep self-sabotaging right before the big thing happens and you want to know exactly WHY",
  "You want more money and you're ready to stop being weird about wanting it",
  "You love your astrology and Human Design and want someone to tell you what to actually DO with them",
  "You're mid-transition (a breakup, a career change, a move, a whole new era) and you want a plan",
  "You want one woman fully, completely, unhingedly in your corner for ninety minutes",
];

const STEPS = [
  { n: "01", title: "Pick your session", body: "Reset, money, shadow, main character or business, pick whichever one made your stomach flip when you read it, because that's your one." },
  { n: "02", title: "Spill the tea", body: "Send me your birth time, date and place, plus what you want, what's blocking you and every juicy detail you want us to crack wide open together." },
  { n: "03", title: "I go DEEP on your chart", body: "I spend two to three hours with your Human Design and your astrology side by side before we meet, building your session around what they're screaming about you and the goals you came in with." },
  { n: "04", title: "Ninety minutes, all about YOU", body: "We meet online and, depending on what you're being guided towards, your session can include hypnosis, mindset work, energy work and coaching, every bit of it led by your goals, your astrology and your Human Design." },
  { n: "05", title: "Walk out activated AF", body: "You leave with clear next steps, your chart decoded, the tools to keep the shift going long after we hang up and the deeply unhinged feeling that you can do literally anything. 🔥" },
];

const FAQ: { q: string; a: React.ReactNode }[] = [
  { q: "Do I need to know anything about astrology?", a: "Babe, no. You don't need to know your rising sign from your elbow, that's literally my job. We go through all of it together." },
  { q: "Are these astrology readings or coaching sessions?", a: "Both, and then some. We use your astrology and Human Design to understand exactly how you're wired, then go to work with coaching, hypnosis, shadow work, mindset and energy work and real next steps." },
  { q: "Which session should I book?", a: "Whichever one made you go \"oh, that's SO me\". Every session gets built around you anyway, so we go wherever you actually need to go." },
  { q: "How do I book my time?", a: "Pop your birth details in at checkout and pay, then I'll be in your inbox to find a time that works in your time zone and mine, wherever in the world you are. Your chart lands with me the second you book, so my two to three hours of prep can start straight away." },
  { q: "Can I reschedule or get a refund?", a: "Life happens, babe. Give me at least 48 hours' notice and we'll move your session once, no drama. Because my two to three hours of prep start the moment you book, sessions are non-refundable, but if something big comes up, email me and we'll work it out together." },
  { q: "Is this therapy?", a: "No, babe. The Baddie Sessions are coaching, so they aren't therapy, counselling or medical, psychological or financial advice, and they're never a replacement for any of those. If you're working with a therapist or doctor, keep going, and if you're in crisis or struggling with your mental health, please reach out to a medical professional or your local support line first." },
  { q: "Are the sessions online?", a: "Yes, all on Zoom, so you can join from anywhere in the world, in your pyjamas, with a matcha. Love that for you." },
  {
    q: "Can I work with Betty for longer?",
    a: <>Obsessed with that energy. Grab <a href="#package" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "underline" }}>three sessions for ${SESSION_PACKAGE.priceUsd}</a> and save ${SESSION_PACKAGE.wasUsd - SESSION_PACKAGE.priceUsd}, book another Baddie Session whenever you&apos;re ready for round two, or go full throttle for ninety days in <a href="/mastermind" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "underline" }}>the MY SZN Mastermind</a>.</>,
  },
];

export default function BaddieSessionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 overflow-hidden relative" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 84 }}>
        {/* The card fan (and its stickers) is hidden on phones, so they get a star of their own */}
        <span className="sm:hidden" style={{ position: "absolute", top: 24, right: 18 }}>
          <HoloShape shape="star" size={58} style={{ transform: "rotate(12deg)" }} />
        </span>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="holo-sticker">✦ private coaching with Betty</span>
            <h1 className="display" style={{ fontSize: "clamp(48px, 7.5vw, 100px)", color: "var(--dark)", lineHeight: 0.95, marginTop: 24 }}>
              the baddie
              <br />
              <span style={{ color: "#fff" }}>sessions.</span> <span style={{ fontSize: "0.5em" }}>💅</span>
            </h1>
            <p style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(19px, 2.2vw, 24px)", color: "#fff", margin: "22px 0 0", lineHeight: 1.3 }}>Big dreams. Deep sh*t. Unhinged main character energy.</p>
            <div style={{ fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.65, color: "var(--dark)", fontWeight: 600, maxWidth: 600, marginTop: 16 }}>
              <p style={{ margin: "0 0 10px" }}>You&apos;ve got patterns to break, money to make, exes to stop texting and an entire life to reinvent, and you are DONE waiting for the universe to send you a sign.</p>
              <p style={{ margin: "0 0 10px", fontWeight: 800 }}>Welcome to your personal baddie intervention, babeeee. 🚨</p>
              <p style={{ margin: 0 }}>Private sessions where I take your astrology, your Human Design, hypnosis, shadow work and twenty years of strategy and point ALL of it at the life you actually want.</p>
            </div>
            <a href="#sessions" className="no-underline" style={{ ...btn("var(--dark)"), marginTop: 30 }}>Find your Baddie Session</a>
          </div>
          {/* The sessions fanned like a hand of cards */}
          <div aria-hidden className="hidden sm:flex justify-center" style={{ position: "relative", height: 400 }}>
            <HoloShape shape="star" size={72} style={{ position: "absolute", top: -6, right: "6%", zIndex: 10, transform: "rotate(12deg)" }} />
            <HoloShape shape="moon" size={58} style={{ position: "absolute", bottom: 4, left: "4%", zIndex: 10, transform: "rotate(-18deg)" }} />
            {BADDIE_SESSIONS.map((s, i) => (
              <div
                key={s.slug}
                style={{
                  position: "absolute", top: 20 + i * 18, left: `calc(50% - 130px + ${(i - (BADDIE_SESSIONS.length - 1) / 2) * 42}px)`, width: 230, height: 300,
                  transform: `rotate(${(i - (BADDIE_SESSIONS.length - 1) / 2) * 7}deg)`, background: s.accent, color: s.accentInk === "var(--pink)" ? "#fff" : s.accentInk,
                  border: "var(--border)", borderRadius: 14, boxShadow: "8px 10px 0 var(--dark)", padding: "20px 18px", display: "flex", flexDirection: "column",
                }}
              >
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 44, lineHeight: 1, color: s.accentInk }}>{s.number}</div>
                <div style={{ fontSize: 40, marginTop: 10 }}>{s.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "auto", opacity: 0.85 }}>baddie session</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials strip */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 28, paddingBottom: 28 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((st) => (
            <div key={st.big} className="holo-edge" style={{ background: "var(--pink-light)", border: "var(--border)", borderRadius: 16, padding: "16px 16px 18px", textAlign: "center" }}>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1, color: "var(--dark)" }}>{st.big}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.35, marginTop: 6 }}>{st.small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* This is for you if */}
      <Band tone="pinkLight" tag="this is for you if" title="this is SO" accent="for you if...">
        <ul className="holo-edge" style={{ listStyle: "none", margin: "30px 0 0", padding: "22px 24px", display: "grid", gap: 12, background: "#fff", border: "var(--border)", borderRadius: 18 }}>
          {FOR_YOU_IF.map((t) => (
            <li key={t} style={{ fontFamily: pp, fontWeight: 700, fontSize: 17, lineHeight: 1.45 }}><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>{t}</li>
          ))}
        </ul>
      </Band>

      {/* Pricing (from lib/baddie-sessions.ts) */}
      <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
            book your <span className="pk">baddie session.</span>
          </h2>
          <div className={`grid grid-cols-1 gap-6 ${SESSION_OPTIONS.length > 1 ? "md:grid-cols-2" : "max-w-xl"}`} style={{ marginTop: 36 }}>
            {SESSION_OPTIONS.map((o, i) => (
              <div key={o.name} className="holo-edge" style={{ background: i === 0 ? "#fff" : "var(--pink)", color: "var(--dark)", border: "var(--border)", borderRadius: 24, padding: "28px 26px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 26 }}>{o.name}</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, marginTop: 6 }}>{o.minutes} minutes | ${o.priceUsd} USD</div>
                <p style={{ fontSize: 16, lineHeight: 1.65, margin: "14px 0 0" }}>Every session below is the same price. 💌 Pop your birth details in at checkout, then I&apos;ll be straight in your inbox to lock in a time that works in your time zone AND mine.</p>
                <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "grid", gap: 8 }}>
                  {BADDIE_SESSIONS.map((s) => (
                    <li key={s.slug}>
                      <a href={`#${s.slug}`} className="no-underline" style={{ fontFamily: pp, fontWeight: 700, fontSize: 16, color: "var(--dark)" }}>{s.emoji} {s.name}</a>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "auto", paddingTop: 22 }}>
                  <a href={bookingHref(o.bookingUrl, `${o.name} (${o.minutes} min)`)} className="no-underline" style={btn("var(--dark)")}>Pick your session</a>
                </div>
              </div>
            ))}
          </div>
          {/* Sessions for two: full foil panel, so everything on it stays solid black (no holo on holo) */}
          {SESSION_OPTIONS.map((o) => (
            <div key={`${o.name}-for-two`} className="max-w-xl" style={{ marginTop: 24, background: "var(--foil) center / 250% 250%", animation: "foil-drift 56s ease-in-out infinite", color: "var(--dark)", border: "var(--border)", borderRadius: 24, padding: "28px 26px", boxShadow: "8px 10px 0 var(--pink)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>💞 booking for two · special price</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 26, marginTop: 8, lineHeight: 1.1 }}>Bring your ride or die. 💞</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, marginTop: 6 }}>{o.minutes} minutes | {o.priceForTwoWasUsd && <s style={{ fontWeight: 600 }}>${o.priceForTwoWasUsd}</s>} ${o.priceForTwoUsd} USD for two</div>
              <p style={{ fontSize: 16, lineHeight: 1.65, fontWeight: 600, margin: "14px 0 0" }}>Any of the five sessions can be booked for two, so grab your partner, your bestie, your sister or your business wifey. I go through both of your charts and both of your Human Designs before we meet, so you each walk out with your own breakthroughs plus all the magic that happens when you two go after it together. Pick your session at checkout and I&apos;ll grab both of your birth details by email.</p>
              <div style={{ paddingTop: 22 }}>
                <a href={bookingHref(o.forTwoBookingUrl, `${o.name} for two (${o.minutes} min)`)} className="no-underline" style={btn("var(--dark)")}>Book a session for two</a>
              </div>
            </div>
          ))}
          {/* Gift a session: a plain white card, so the holo ring is allowed (the for-two panel above is the foil one) */}
          {SESSION_OPTIONS.filter((o) => o.giftBookingUrl).map((o) => (
            <div key={`${o.name}-gift`} className="max-w-xl holo-edge" style={{ marginTop: 24, background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 24, padding: "28px 26px", boxShadow: "8px 10px 0 var(--pink)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>🎁 gift a baddie session</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 26, marginTop: 8, lineHeight: 1.1 }}>Give her the push she&apos;d never give herself.</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, marginTop: 6 }}>{o.minutes} minutes | ${o.priceUsd} USD</div>
              <p style={{ fontSize: 16, lineHeight: 1.65, fontWeight: 600, margin: "14px 0 0" }}>Your bestie, your sister, your mum, the friend who&apos;s been about to start her new era for three years now: gift her a Baddie Session and I&apos;ll take it from there. Pop her name and email in at checkout, add a note if you want me to wait for her birthday or Christmas, and I&apos;ll tell her she&apos;s been gifted, then book her in at a time that works for her.</p>
              <div style={{ paddingTop: 22 }}>
                <a href={bookingHref(o.giftBookingUrl, `${o.name} gift`)} className="no-underline" style={btn("var(--dark)")}>Gift a session</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The sessions */}
      <section id="sessions" className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 88, scrollMarginTop: 70 }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-5"><span className="holo-sticker">✦ meet your baddie sessions</span></div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 5.5vw, 66px)", lineHeight: 1 }}>pick what you <span className="pk">need, baddie.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 40 }}>
            {BADDIE_SESSIONS.map((s, i) => (
              <article key={s.slug} id={s.slug} className={`offer-card ${lastOdd(i, BADDIE_SESSIONS.length)}`} style={{ border: "var(--border)", borderRadius: 24, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", scrollMarginTop: 80 }}>
                <div style={{ background: s.accent, color: s.accentInk, padding: "22px 24px", borderBottom: "var(--border)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>{s.emoji} {s.number}</div>
                  <h3 style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(26px, 3vw, 34px)", lineHeight: 1.05, margin: "8px 0 0", letterSpacing: "-0.02em" }}>{s.name}</h3>
                </div>
                <div style={{ padding: "22px 24px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, lineHeight: 1.3, margin: 0 }}>{s.tagline}</p>
                  {s.body.map((b) => <p key={b} style={{ fontSize: 15.5, lineHeight: 1.7, margin: "12px 0 0" }}>{b}</p>)}
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginTop: 20 }}>What we&apos;ll work on</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "grid", gap: 6 }}>
                    {s.focus.map((f) => <li key={f} style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>{f}</li>)}
                  </ul>
                  <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 16, lineHeight: 1.45, margin: "20px 0 0", padding: "14px 16px", background: "var(--pink-light)", border: "var(--border)", borderRadius: 14 }}>✨ {s.after}</p>
                  <div style={{ marginTop: "auto", paddingTop: 24 }}>
                    <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "0 0 14px" }}>💌 Want more than one? <a href="#package" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>Get any three sessions for ${SESSION_PACKAGE.priceUsd}</a> and save ${SESSION_PACKAGE.wasUsd - SESSION_PACKAGE.priceUsd}.</p>
                    <a href={bookingHref(s.bookingUrl, `Baddie Session: ${s.name}`)} className="no-underline btn-pink" style={btn("var(--pink)")}>{s.cta}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why book with Betty */}
      <Band tone="pinkLight" tag="why book with me" title="why baddies book" accent="with betty.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 30 }}>
          {WHY.map((w) => (
            <div key={w.title} className="holo-edge" style={{ background: "var(--lav-light)", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px" }}>
              <div style={{ fontSize: 30, lineHeight: 1 }}>{w.emoji}</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, marginTop: 10 }}>{w.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.65, margin: "6px 0 0" }}>{w.body}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* How it works */}
      <Band tone="lav" tag="how it works" title="one session." accent="all about YOU.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 30 }}>
          {STEPS.map((st, i) => (
            <div key={st.n} className={`holo-edge ${lastOdd(i, STEPS.length, "sm")}`} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px" }}>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 32, color: "var(--pink)", lineHeight: 1 }}>{st.n}</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, marginTop: 8 }}>{st.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.65, margin: "6px 0 0" }}>{st.body}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Meet your coach */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betty-founder.png" alt="Betty Andrews, founder of MY SZN" style={{ width: "100%", maxWidth: 380, borderRadius: 24, border: "var(--border)", objectFit: "cover", aspectRatio: "4 / 5", transform: "rotate(-2deg)", boxShadow: "10px 12px 0 var(--dark)" }} />
          <div>
            <div className="mb-4"><span className="holo-sticker">✦ meet your coach</span></div>
            <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 58px)", lineHeight: 1 }}>hi, i&apos;m betty. <span className="pk">your personal baddie coach.</span> <span style={{ fontSize: "0.55em" }}>💜</span></h2>
            <div className="offer-copy" style={{ marginTop: 20 }}>
              <p>I&apos;m an astrologer, a manifestation coach, a shadow work witch and your new loudest cheerleader, and I help women make more money, take their power back and become MORE of who they actually are.</p>
              <p>I mix astrology, Human Design, hypnosis, subconscious work, manifestation and real coaching, then we take every bit of it straight into how you live, love, earn and show up.</p>
              <p>I&apos;ve been coaching women for over a decade, thousands of them, through the fear, the old beliefs and the &quot;who do I think I am&quot; spiral, all the way out the other side into lives that feel like THEIRS.</p>
              <p>I&apos;ve also been a coach, business consultant and strategist for twenty years while building and running my own global dream business and publishing two books, so I know exactly what it takes to want something outrageous and then go and get it anyway.</p>
              <p><strong>You get my full attention, my whole brain and a woman who is rooting for you so hard it&apos;s a little bit unhinged. 💜</strong></p>
            </div>
            <a href="#sessions" className="no-underline btn-pink" style={{ ...btn("var(--pink)"), marginTop: 22 }}>Find your session</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Band tone="white" tag="faq" title="all your" accent="questions.">
        <div style={{ marginTop: 26, display: "grid", gap: 12 }}>
          {FAQ.map((f) => (
            <details key={f.q} className="holo-edge" style={{ background: "var(--lav-light)", border: "var(--border)", borderRadius: 18, padding: "16px 20px" }}>
              <summary style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, cursor: "pointer" }}>{f.q}</summary>
              <p style={{ margin: "10px 0 0" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </Band>

      {/* The 3-session package: white card on the glitter, so the holo ring is allowed */}
      <section id="package" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, borderBottom: "var(--border)", scrollMarginTop: 70 }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-5"><span className="holo-sticker">✦ the baddie session package</span></div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
            three sessions. <span className="pk">a whole new era.</span>
          </h2>
          <div className="holo-edge" style={{ marginTop: 36, background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 24, padding: "28px 26px", boxShadow: "8px 10px 0 var(--pink)" }}>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 26 }}>{SESSION_PACKAGE.sessions} Baddie Sessions</div>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, marginTop: 6 }}>{SESSION_PACKAGE.sessions} x {SESSION_OPTIONS[0].minutes} minutes | <s style={{ fontWeight: 600 }}>${SESSION_PACKAGE.wasUsd}</s> ${SESSION_PACKAGE.priceUsd} USD</div>
            <div style={{ display: "inline-block", marginTop: 12, background: "var(--pink)", color: "#fff", fontFamily: pp, fontWeight: 800, fontSize: 14, padding: "6px 14px", borderRadius: 999, border: "var(--border)" }}>You save ${SESSION_PACKAGE.wasUsd - SESSION_PACKAGE.priceUsd}</div>
            <p style={{ fontSize: 16, lineHeight: 1.65, margin: "16px 0 0" }}>For the baddie who wants the full transformation, this is three sessions mixed and matched however you like from all five, so you can rebuild your money, your confidence and your big dream one after the other, or go three rounds deep on the one thing that&apos;s been running your life. I prep two to three hours from your astrology and Human Design before every single session, so each one picks up exactly where the last one left you.</p>
            <p style={{ fontSize: 16, lineHeight: 1.65, margin: "12px 0 0" }}>Pop your birth details in at checkout, then I&apos;ll be in your inbox to pick your first session and lock in a time that works in your time zone AND mine. 💖</p>
            <div style={{ paddingTop: 22 }}>
              <a href={bookingHref(SESSION_PACKAGE.bookingUrl, "Baddie Session package")} className="no-underline" style={btn("var(--dark)")}>Book your three sessions</a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", paddingTop: 80, paddingBottom: 88 }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(38px, 6.5vw, 80px)", color: "var(--dark)", lineHeight: 0.95 }}>
            your next era is <span style={{ color: "#fff" }}>calling, baddie.</span> <span style={{ fontSize: "0.5em" }}>💖</span>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, fontWeight: 600, margin: "22px auto 0", maxWidth: 620 }}>
            You already know there&apos;s more waiting for you: the confidence, the money, the freedom and the version of you who never asks anyone for permission again.
          </p>
          <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 20, color: "#fff", margin: "14px 0 0" }}>Let&apos;s get unhinged about it. 🔥</p>
          <a href="#sessions" className="no-underline" style={{ ...btn("var(--dark)"), marginTop: 28 }}>Book your Baddie Session</a>
        </div>
      </section>
    </>
  );
}
