import type { Metadata } from "next";
import { Band } from "@/components/Offer";
import { BADDIE_SESSIONS, SESSION_OPTIONS, bookingHref } from "@/lib/baddie-sessions";
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
const btn = (bg: string, ink = "#fff") => ({ display: "inline-block", background: bg, color: ink, fontFamily: pp, fontSize: 16, fontWeight: 800, padding: "18px 32px", border: "var(--border)" });

// Why book with Betty: sits straight under the hero so the benefits come first (Betty's brief, 27 Oct 2026).
const WHY = [
  { emoji: "🔮", title: "A session built around YOUR chart", body: "Before we ever meet, I spend two to three hours going through your astrology and your Human Design and strategising the whole ninety minutes around how you're actually wired, so nothing in that room is a template someone else got too." },
  { emoji: "💸", title: "Twenty years of business brain on your side", body: "I've been a business consultant and strategist for twenty years and I run my own global dream business, so when your goal is more money, a launch or a big career move, you get a real strategy alongside the magic." },
  { emoji: "🧠", title: "We go deeper than talking", body: "Hypnosis, mindset work and energy work all come out when your goals call for them, which means we shift the subconscious stuff that's been running the show instead of just understanding it." },
  { emoji: "💖", title: "Thousands of women have gone first", body: "I've been coaching women for over a decade, thousands of them, so whatever you're carrying in, I've seen it, I'm not scared of it, and I know exactly how to help you move it." },
];

const STEPS = [
  { n: "01", title: "Pick your session", body: "Choose the area of your life you're ready to level up, whether that's a reset, your money, your shadow or your main character era." },
  { n: "02", title: "Send me your birth details and your goals", body: "A short intake with your birth time, date and place, plus what you want, what's in the way and what you'd love us to crack open together." },
  { n: "03", title: "I strategise your session", body: "I spend two to three hours with your Human Design and your astrology side by side before we meet, building the session around what they're showing me about you and the goals you came in with." },
  { n: "04", title: "Ninety minutes, all about YOU", body: "We meet online, and depending on what you're being guided towards your session can include hypnosis, mindset work, energy work and coaching, every bit of it led by your goals, your astrology and your Human Design." },
  { n: "05", title: "Walk out activated", body: "You leave with clear next steps, the insights from your chart and the tools to keep the shift going long after we hang up." },
];

const FAQ: { q: string; a: React.ReactNode }[] = [
  { q: "Do I need to know anything about astrology?", a: "Nope. You don't need to know your rising sign from your elbow. We'll work through everything together." },
  { q: "Are these astrology readings or coaching sessions?", a: "Both. We use your astrology and Human Design as tools for self-understanding, combined with personalised coaching, shadow work and practical next steps." },
  { q: "Which session should I book?", a: "Choose whichever speaks to what you're experiencing right now. Every session is personalised, so we'll focus on what you actually need." },
  { q: "Are the sessions online?", a: "Yes. Sessions take place online, so you can join from anywhere in the world." },
  {
    q: "Can I work with Betty for longer?",
    a: <>Yes, babe. Book another Baddie Session whenever you&apos;re ready for your next one, or go deeper for ninety days in <a href="/mastermind" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "underline" }}>the MY SZN Mastermind</a>.</>,
  },
];

export default function BaddieSessionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 overflow-hidden" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="holo-sticker">✦ private coaching with Betty</span>
            <h1 className="display" style={{ fontSize: "clamp(48px, 7.5vw, 100px)", color: "var(--dark)", lineHeight: 0.95, marginTop: 24 }}>
              the baddie
              <br />
              <span style={{ color: "#fff" }}>sessions.</span> <span style={{ fontSize: "0.5em" }}>💅</span>
            </h1>
            <p style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(19px, 2.2vw, 24px)", color: "#fff", margin: "22px 0 0", lineHeight: 1.3 }}>Big dreams. Deep sh*t. Serious main character energy.</p>
            <div style={{ fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.65, color: "var(--dark)", fontWeight: 600, maxWidth: 600, marginTop: 16 }}>
              <p style={{ margin: "0 0 10px" }}>Got some patterns to break, money to make, confidence to build or an entire life to reinvent?</p>
              <p style={{ margin: "0 0 10px", fontWeight: 800 }}>Welcome to your personal bad b*tch intervention.</p>
              <p style={{ margin: 0 }}>Five private coaching experiences combining astrology, manifestation, shadow work, business strategy and practical tools to help you become the woman you actually want to be.</p>
            </div>
            <a href="#sessions" className="no-underline" style={{ ...btn("var(--dark)"), marginTop: 30 }}>Find your Baddie Session</a>
          </div>
          {/* The sessions fanned like a hand of cards */}
          <div aria-hidden className="hidden sm:flex justify-center" style={{ position: "relative", height: 400 }}>
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

      {/* Why book with Betty */}
      <Band tone="white" tag="why book with me" title="why baddies book" accent="with betty.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 30 }}>
          {WHY.map((w) => (
            <div key={w.title} style={{ background: "var(--lav-light)", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px" }}>
              <div style={{ fontSize: 30, lineHeight: 1 }}>{w.emoji}</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, marginTop: 10 }}>{w.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.65, margin: "6px 0 0" }}>{w.body}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* The sessions */}
      <section id="sessions" className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 88, scrollMarginTop: 70 }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-5">meet your baddie sessions</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 5.5vw, 66px)", lineHeight: 1 }}>five ways to <span className="pk">take your power back.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 40 }}>
            {BADDIE_SESSIONS.map((s) => (
              <article key={s.slug} id={s.slug} className="offer-card" style={{ border: "var(--border)", borderRadius: 24, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", scrollMarginTop: 80 }}>
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
                  <div style={{ marginTop: "auto", paddingTop: 24 }}>
                    <a href={bookingHref(s.bookingUrl, `Baddie Session: ${s.name}`)} className="no-underline" style={btn("var(--pink)")}>{s.cta}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <Band tone="lav" tag="how it works" title="one session." accent="all about YOU.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 30 }}>
          {STEPS.map((st) => (
            <div key={st.n} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px" }}>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 32, color: "var(--pink)", lineHeight: 1 }}>{st.n}</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, marginTop: 8 }}>{st.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.65, margin: "6px 0 0" }}>{st.body}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Pricing (from lib/baddie-sessions.ts) */}
      <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
            book your <span className="pk">baddie session.</span>
          </h2>
          <div className={`grid grid-cols-1 gap-6 ${SESSION_OPTIONS.length > 1 ? "md:grid-cols-2" : "max-w-xl"}`} style={{ marginTop: 36 }}>
            {SESSION_OPTIONS.map((o, i) => (
              <div key={o.name} style={{ background: i === 0 ? "#fff" : "var(--pink)", color: "var(--dark)", border: "var(--border)", borderRadius: 24, padding: "28px 26px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 26 }}>{o.name}</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, marginTop: 6 }}>{o.minutes} minutes | ${o.priceUsd} USD</div>
                <p style={{ fontSize: 16, lineHeight: 1.65, margin: "14px 0 0" }}>{o.blurb}</p>
                {SESSION_OPTIONS.length === 1 && <p style={{ fontSize: 15, fontWeight: 700, margin: "10px 0 0" }}>The same session and price for all five: the Reset, Rich B*tch Energy, the Shadow Baddie Session, Main Character Activation or the Business Baddie Session.</p>}
                <div style={{ marginTop: "auto", paddingTop: 22 }}>
                  <a href={bookingHref(o.bookingUrl, `${o.name} (${o.minutes} min)`)} className="no-underline" style={btn("var(--dark)")}>Book {o.name.replace(/^The /, "the ")}</a>
                </div>
              </div>
            ))}
          </div>
          {/* Sessions for two: full foil panel, so everything on it stays solid black (no holo on holo) */}
          {SESSION_OPTIONS.map((o) => (
            <div key={`${o.name}-for-two`} className="max-w-xl" style={{ marginTop: 24, background: "var(--foil) center / 250% 250%", animation: "foil-drift 56s ease-in-out infinite", color: "var(--dark)", border: "var(--border)", borderRadius: 24, padding: "28px 26px", boxShadow: "8px 10px 0 var(--pink)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>💞 booking for two</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 26, marginTop: 8, lineHeight: 1.1 }}>Bring your person.</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, marginTop: 6 }}>{o.minutes} minutes | ${o.priceForTwoUsd} USD for two</div>
              <p style={{ fontSize: 16, lineHeight: 1.65, fontWeight: 600, margin: "14px 0 0" }}>Any of the five sessions can be booked for two, so bring your partner, your bestie, your sister or your business bestie. I strategise the session around both of your charts and both of your Human Designs, which means you each walk out with your own breakthroughs plus everything that lights up when you two go after it together.</p>
              <div style={{ paddingTop: 22 }}>
                <a href={bookingHref(null, `${o.name} for two (${o.minutes} min)`)} className="no-underline" style={btn("var(--dark)")}>Book a session for two</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meet your coach */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betty-founder.png" alt="Betty Andrews, founder of MY SZN" style={{ width: "100%", maxWidth: 380, borderRadius: 24, border: "var(--border)", objectFit: "cover", aspectRatio: "4 / 5", transform: "rotate(-2deg)", boxShadow: "10px 12px 0 var(--dark)" }} />
          <div>
            <div className="tag mb-4">meet your coach</div>
            <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 58px)", lineHeight: 1 }}>hi, i&apos;m betty. <span className="pk">your personal bad b*tch coach.</span> <span style={{ fontSize: "0.55em" }}>💜</span></h2>
            <div className="offer-copy" style={{ marginTop: 20 }}>
              <p>I&apos;m an astrologer, manifestation coach and shadow work practitioner, and I help women make more money, reclaim their power and become more of who they actually are.</p>
              <p>My work combines astrology, Human Design, subconscious work, manifestation and coaching, because understanding yourself is one thing, but actually changing how you live is where the magic happens.</p>
              <p>I&apos;ve been coaching women for over a decade, thousands of them, through the fear, the old beliefs and the &quot;who do I think I am&quot; spiral, all the way into lives that feel like their own.</p>
              <p>I&apos;ve also been a business consultant and strategist for twenty years, all while building and running my own global dream business, so I know what it takes to want BIG things and then actually go and get them.</p>
              <p><strong>You get my full attention, personalised insight and a woman who&apos;s absolutely rooting for you.</strong></p>
            </div>
            <a href="#sessions" className="no-underline" style={{ ...btn("var(--pink)"), marginTop: 22 }}>Find your session</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Band tone="white" tag="faq" title="all your" accent="questions.">
        <div style={{ marginTop: 26, display: "grid", gap: 12 }}>
          {FAQ.map((f) => (
            <details key={f.q} style={{ background: "var(--lav-light)", border: "var(--border)", borderRadius: 18, padding: "16px 20px" }}>
              <summary style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, cursor: "pointer" }}>{f.q}</summary>
              <p style={{ margin: "10px 0 0" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </Band>

      {/* Final CTA */}
      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", paddingTop: 80, paddingBottom: 88 }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(38px, 6.5vw, 80px)", color: "var(--dark)", lineHeight: 0.95 }}>
            your next era is <span style={{ color: "#fff" }}>calling, b*tch.</span> <span style={{ fontSize: "0.5em" }}>💖</span>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, fontWeight: 600, margin: "22px auto 0", maxWidth: 620 }}>
            You already know there&apos;s more waiting for you. The confidence. The money. The freedom. The version of yourself who finally stops asking for permission.
          </p>
          <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 20, color: "#fff", margin: "14px 0 0" }}>Let&apos;s get to work.</p>
          <a href="#sessions" className="no-underline" style={{ ...btn("var(--dark)"), marginTop: 28 }}>Book your Baddie Session</a>
        </div>
      </section>
    </>
  );
}
