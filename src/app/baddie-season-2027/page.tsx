import type { Metadata } from "next";
import type { ReactNode } from "react";
import QuoteStrip from "@/components/QuoteStrip";
import { BADDIE_SEASON_2027 as S } from "@/lib/baddie-season-2027";

// Your Baddie Season: 2027. Two ways in: the 2027 report on its own at $111, or the report plus a 90-minute
// 1:1 Zoom activation with hypnosis, Baddie Friday $333 (normally $555), 20 activations at that price.
// Rebuilt 25 Nov 2026 on Betty's desire-led copy: knowing WHEN to make your biggest moves, the six
// manifesting energies, then the two experiences. (Astro Maps section cut 25 Nov: the map is Coven-only.)

export const metadata: Metadata = {
  title: { absolute: "Your Baddie Season: 2027 | Your Personalised 2027 Astrology Report | MY SZN" },
  description:
    "Your personalised 12-month astrology forecast, Human Design manifestation blueprint and the dates to make your biggest moves in 2027. Report $111, or add a private hypnosis activation with Betty: Baddie Friday $333, normally $555, only 20 private activations.",
  alternates: { canonical: S.href },
  openGraph: {
    title: "Your Baddie Season: 2027 🔮",
    description: "Big money. Big dreams. Big f*cking life. Your personalised 2027, $111, or with a private activation, $333 this Baddie Friday (normally $555).",
    url: S.href,
    type: "website",
    images: [S.image],
  },
};

const pp = "var(--font-poppins), Poppins, sans-serif";
const DEADLINE = "the Baddie Friday price ends at 11:59pm UK time on Monday the 30th of November";

const cta = (bg: string, ink = "#fff") => ({ display: "inline-block", background: bg, color: ink, fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "20px 34px", border: "2px solid #fff", textAlign: "center" as const });
const outline = { ...cta("transparent"), border: "2px solid #fff" };


const PARTS = [
  {
    emoji: "🪐",
    label: "part one",
    title: "your 12-month astrology forecast",
    bg: "var(--pink)",
    intro: "January through December, we explore what's happening in YOUR chart.",
    points: ["Your major planetary transits", "The eclipses and areas of life they activate", "Your strongest months for money, love and business", "Opportunities for visibility and personal growth", "Periods for reflection, recalibration and expansion", "Your personal power dates", "The themes shaping your next chapter"],
    outro: "Get your calendar out, babe. We've got dates to circle. 🗓️",
  },
  {
    emoji: "✨",
    label: "part two",
    title: "your manifestation blueprint",
    bg: "var(--lav)",
    intro: "Manifestation gets a whole lot more interesting when you understand your own energetic blueprint. Using your astrology and Human Design, we'll explore:",
    points: ["How you're personally designed to manifest", "Your relationship with money and receiving", "Your natural strengths and gifts", "The beliefs and patterns that may be keeping you small", "How to work with your energy", "Where you're ready to expand in 2027", "Practical moves to support your biggest desires"],
    outro: "We're creating a manifestation practice that actually feels like YOU. 💖",
  },
];

const HER = ["The woman who charges what she wants.", "The woman who speaks up.", "The woman who books the flight, launches the business, goes on the date and allows herself to be seen.", "The woman who stopped negotiating with her own dreams."];

const FOR_YOU = [
  "You know you're meant for a bigger life and you're ready to start making moves.",
  "You want to make considerably more $$$ in 2027.",
  "You have a business idea, a dream career or a creative project you're ready to take seriously.",
  "You want to understand your astrology around love, dating, marriage and relationships.",
  "You're dreaming about moving abroad, travelling more or reinventing yourself.",
  "You love astrology and Human Design but want to know how to apply them to your actual life.",
  "You're tired of getting close to what you want and then talking yourself out of it.",
  "You want to walk into January with excitement, direction and a plan.",
];

const STEPS = [
  { n: "01", title: "Choose your experience.", body: "Book your personalised report or the full experience with your private activation." },
  { n: "02", title: "Tell me about YOU.", body: "Share your birth details, what you're manifesting and the areas of your life you want to focus on in 2027." },
  { n: "03", title: "I get into your chart.", body: "I create your 12-month forecast and manifestation blueprint using your astrology, Human Design and personal goals. Report-only bookings are delivered within 48 hours." },
  { n: "04", title: "We activate your next era.", body: "If you've booked the full experience, we'll arrange your private Zoom session, explore your year together and do your personalised hypnosis activation." },
  { n: "05", title: "Start making your moves.", body: "Use your report throughout 2027 to reflect, plan, set intentions and make decisions with a deeper understanding of your astrology." },
];

const FAQ = [
  ["Do I need to understand astrology or Human Design?", "Absolutely not. I interpret everything for you and explain it in everyday language, with guidance that relates to your actual life."],
  ["Is this personalised to my goals?", "YESSSSS. Tell me what you're manifesting, whether that's money, marriage, a business, moving abroad, fame or something entirely different. Your goals help shape the focus of your reading."],
  ["Can I get the report without booking a private session?", `Absolutely. Your personalised 2027 report and manifestation blueprint are $${S.report.priceUsd}, delivered within 48 hours.`],
  ["What's included in the private activation?", "Your full report, plus 90 minutes with me on Zoom, including a personalised hypnosis activation, energy and mindset work where appropriate, your recording and a daily practice."],
  ["What does hypnosis feel like?", "For many people, it feels like a deeply relaxed, immersive daydream. You remain in control and can stop at any time. I'll guide you through connecting with the version of yourself who's living the life you're creating."],
  ["Can I book from anywhere in the world?", "YES. Everything is online, and we'll arrange your private session around our availability and time zones."],
  ["Will everything in my report definitely happen?", "Astrology helps us explore themes, timing and potential opportunities. You still get to decide how you respond, what you pursue and what you create."],
  ["Can I reschedule my activation?", "Give me at least 48 hours' notice and we can rearrange your session once. As preparation begins after booking, sessions are non-refundable, subject to your applicable consumer rights."],
  ["Is this therapy?", "This is an astrology and coaching experience. It isn't therapy, medical treatment or financial advice, and it doesn't replace professional support."],
] as const;


const EXPERIENCES = [
  {
    key: "bundle",
    tag: "💸 the full baddie experience",
    price: <>${S.priceUsd} <span style={{ fontSize: "0.42em", letterSpacing: "0.08em" }}>USD</span></>,
    sub: `Usually $${S.wasUsd} · Save $222. Only ${S.spots} private activations available at this Baddie Friday price.`,
    points: ["Everything in your personalised 2027 report", "90 minutes privately with me on Zoom", "A walkthrough of your astrology and manifestation blueprint", "Your personalised hypnosis activation", "Energy and mindset work tailored to you", "Your session recording to keep", "Your daily becoming-her practice"],
    fit: "For the woman who's ready to go ALLLLLL IN on herself.",
    href: S.buyUrl,
    button: `claim my private activation · $${S.priceUsd}`,
    bg: "var(--pink-light)",
    btn: "var(--pink)",
  },
  {
    key: "report",
    tag: "🪐 your baddie season report",
    price: <>${S.report.priceUsd} <span style={{ fontSize: "0.42em", letterSpacing: "0.08em" }}>USD</span></>,
    sub: "Your personalised astrological guide to the entire year.",
    points: ["Your 12-month astrology forecast", "Your personalised manifestation blueprint", "Astrology and Human Design insights", "Your 2027 personal power dates", "Guidance tailored to your goals", "Delivered to your inbox within 48 hours"],
    fit: "Perfect for the woman who wants to plan her year, understand her energy and start making intentional moves.",
    href: S.report.buyUrl,
    button: `get my 2027 report · $${S.report.priceUsd}`,
    bg: "#fff",
    btn: "var(--dark)",
  },
];

function Tag({ children, ink }: { children: ReactNode; ink?: string }) {
  return <div className="tag mb-5" style={ink ? { color: ink } : undefined}>{children}</div>;
}

function H2({ children, ink = "var(--dark)" }: { children: ReactNode; ink?: string }) {
  return <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: ink, lineHeight: 1 }}>{children}</h2>;
}

const copy = (ink = "var(--dark)") => ({ fontSize: 17, lineHeight: 1.75, color: ink, fontWeight: 500, margin: "0 0 14px" });

function Experiences() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 34 }}>
      {EXPERIENCES.map((o) => (
        <div key={o.key} style={{ background: o.bg, color: "var(--dark)", border: "2px solid var(--dark)", borderRadius: 22, padding: "26px 24px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>{o.tag}</div>
          <div style={{ fontFamily: pp, fontSize: 52, fontWeight: 900, lineHeight: 1, marginTop: 12 }}>{o.price}</div>
          <p style={{ fontSize: 15, lineHeight: 1.55, fontWeight: 700, marginTop: 10 }}>{o.sub}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 16px", flex: 1 }}>
            {o.points.map((pt) => (
              <li key={pt} style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 600, padding: "7px 0", borderTop: "1.5px solid var(--dark)" }}>✦ {pt}</li>
            ))}
          </ul>
          <p style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 600, margin: "0 0 18px" }}>{o.fit}</p>
          <a href={o.href} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ ...cta(o.btn), padding: "18px 20px", border: "2px solid var(--dark)" }}>{o.button}</a>
        </div>
      ))}
    </div>
  );
}

export default function BaddieSeason2027Page() {
  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 overflow-hidden" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>💸 baddie friday · $222 off · only {S.spots} private activations</span>
            <h1 className="display" style={{ fontSize: "clamp(48px, 7.5vw, 100px)", color: "#fff", lineHeight: 0.95, marginTop: 24 }}>
              your baddie season:
              <br />
              <span className="pk">2027.</span>
            </h1>
            <p style={{ fontFamily: pp, fontWeight: 900, fontSize: "clamp(24px, 3vw, 34px)", color: "var(--pink)", margin: "22px 0 0", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-0.01em" }}>Big money. Big dreams. Big f*cking life.</p>
            <div style={{ fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.65, color: "#fff", fontWeight: 600, maxWidth: 620, marginTop: 16 }}>
              <p style={{ margin: "0 0 12px" }}>Your personalised 12-month astrology forecast, Human Design manifestation blueprint and the dates to make your biggest moves in 2027.</p>
              <p style={{ margin: 0 }}>Because we&apos;re going into this year knowing what the actual f*ck we&apos;re doing. 💅</p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4" style={{ marginTop: 30 }}>
              <a href={S.buyUrl} target="_blank" rel="noopener noreferrer" className="no-underline" style={cta("var(--pink)")}>report + private activation · ${S.priceUsd}</a>
              <a href={S.report.buyUrl} target="_blank" rel="noopener noreferrer" className="no-underline" style={outline}>just the report · ${S.report.priceUsd}</a>
            </div>
            <p style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, color: "#fff", marginTop: 16, letterSpacing: "0.03em", lineHeight: 1.5 }}>
              Normally ${S.wasUsd}. Save $222 this Baddie Friday. Only {S.spots} private activations at this price, and {DEADLINE}.
            </p>
          </div>
          <div className="flex justify-center" style={{ position: "relative" }}>
            <div className="holo-edge" style={{ width: "min(440px, 86vw)", borderRadius: 24, overflow: "hidden", transform: "rotate(2deg)", boxShadow: "12px 14px 0 var(--pink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/coven/baddie-2027-email-hero.jpg" alt="Your 2027 starts now: Betty in pink sequins beside May and August 2027 calendars with the big dates circled" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <span className="holo-sticker" style={{ position: "absolute", top: -10, right: 4, zIndex: 5, transform: "rotate(7deg)", fontSize: 12 }}>✨ your next era, planned</span>
          </div>
        </div>
      </section>

      {/* Plan your next era */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
          <Tag>your 2027, mapped out</Tag>
          <H2>babyyyyy, <span className="pk">let&apos;s plan your next era.</span></H2>
          <div style={{ marginTop: 26, maxWidth: 760 }}>
            <p style={copy()}>Imagine knowing which months of 2027 are astrologically supportive for making more money, launching your business, falling in love, moving abroad or finally putting yourself out there.</p>
            <p style={copy()}>Imagine having your entire year mapped out according to YOUR astrology, YOUR Human Design and the big, beautiful, slightly ridiculous life you want to create.</p>
            <p style={copy()}>I&apos;ve created something very special for the ambitious women who are DONE putting their dreams on next year&apos;s to-do list. Your very own personalised guide to 2027.</p>
            <p style={{ ...copy(), fontWeight: 800 }}>The dates. The opportunities. The big changes. The money months. The relationship energy. The places in the world to explore. The patterns you&apos;re ready to leave behind.</p>
            <p style={{ fontFamily: pp, fontWeight: 900, fontSize: 26, textTransform: "uppercase", margin: "8px 0 0" }}>We&apos;re getting INTO IT. 🪐</p>
          </div>
          </div>
          <div className="flex justify-center">
            <div className="holo-edge" style={{ width: "min(420px, 86vw)", borderRadius: 24, overflow: "hidden", transform: "rotate(-2deg)", boxShadow: "12px 14px 0 var(--dark)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={S.image} alt="Betty in a pink witch hat, black satin dress and pink feather gloves" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Personalised down to the details */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <Tag>what you get</Tag>
          <H2>your 2027, <span className="pk">personalised down to the details.</span></H2>
          <p style={{ ...copy(), marginTop: 22, maxWidth: 760 }}>Every report is created around your birth chart, Human Design and your individual goals. Two women with the same Sun sign can have completely different experiences of 2027, which is why we&apos;re going much deeper than your usual horoscope.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 30 }}>
            {PARTS.map((c) => (
              <div key={c.title} style={{ background: c.bg, color: "var(--dark)", border: "var(--border)", borderRadius: 22, padding: "28px 26px 30px" }}>
                <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>{c.emoji} {c.label}</div>
                <div className="display" style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: 1, marginTop: 8 }}>{c.title}</div>
                <p style={{ fontSize: 16, lineHeight: 1.65, marginTop: 14, fontWeight: 600 }}>{c.intro}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 14px" }}>
                  {c.points.map((pt) => (
                    <li key={pt} style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, padding: "6px 0", borderTop: "1.5px solid var(--dark)" }}>✦ {pt}</li>
                  ))}
                </ul>
                <p style={{ fontFamily: pp, fontSize: 17, lineHeight: 1.35, fontWeight: 800 }}>{c.outro}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, background: "var(--dark)", color: "#fff", border: "var(--border)", borderRadius: 22, padding: "30px 28px 32px" }}>
            <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)" }}>🌀 part three · available with the full experience</div>
            <div className="display" style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: 1, marginTop: 8 }}>your private hypnosis activation</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginTop: 16 }}>
              <div>
                <p style={copy("#fff")}>Ninety minutes on Zoom, just you and me, dedicated to your 2027 and the woman you&apos;re becoming.</p>
                <p style={copy("#fff")}>We&apos;ll go through your astrology together, talk about what you&apos;re manifesting and explore what&apos;s been getting in the way of you having it.</p>
                <p style={copy("#fff")}>Then I&apos;ll guide you through a personalised hypnosis activation designed to help you connect with the version of yourself who&apos;s already living that life.</p>
              </div>
              <div>
                {HER.map((h) => (
                  <p key={h} style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, lineHeight: 1.3, margin: "0 0 10px", color: "#fff" }}><span className="pk">✦</span> {h}</p>
                ))}
                <p style={{ fontFamily: pp, fontSize: 20, fontWeight: 900, color: "var(--pink)", textTransform: "uppercase", margin: "14px 0 12px" }}>We&apos;re getting familiar with HER.</p>
                <p style={{ ...copy("#fff"), fontSize: 15.5 }}>Your private experience also includes your session recording and a personalised daily practice to keep reconnecting with that version of yourself.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* December 2027 */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-4xl mx-auto">
          <Tag>close your eyes for a sec</Tag>
          <H2>imagine it&apos;s <span className="pk">december 2027.</span></H2>
          <div style={{ marginTop: 26, maxWidth: 760 }}>
            <p style={copy()}>You&apos;re sitting somewhere beautiful, looking back at the last twelve months.</p>
            <p style={copy()}>You&apos;ve made more money than you thought possible. You&apos;ve travelled somewhere you&apos;ve dreamed about for years, made incredible new friendships, taken chances on yourself and created opportunities you once would&apos;ve talked yourself out of.</p>
            <p style={copy()}>You&apos;ve stopped making your ambitions smaller to make other people comfortable. You&apos;ve built a life that feels exciting to wake up to.</p>
            <p style={{ ...copy(), fontWeight: 800 }}>Your younger self would be so f*cking proud of you. 🥹</p>
            <p style={{ fontFamily: pp, fontWeight: 900, fontSize: 24, textTransform: "uppercase", margin: "8px 0 0" }}>Start making decisions for that woman <span className="pk">NOW.</span></p>
          </div>
        </div>
      </section>

      {/* For you if */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-4xl mx-auto">
          <Tag>this is for you if</Tag>
          <H2>you&apos;re ready to <span className="pk">dream a little BIGGER.</span></H2>
          <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gap: 12 }}>
            {FOR_YOU.map((i) => (
              <li key={i} style={{ fontSize: 17, lineHeight: 1.6, fontWeight: 600, color: "var(--dark)" }}>
                <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>
                {i}
              </li>
            ))}
          </ul>
          <p style={{ ...copy(), marginTop: 26, fontWeight: 700 }}>You don&apos;t need to have it all figured out. You just need to be willing to dream a little BIGGER. 💖</p>
        </div>
      </section>

      <QuoteStrip ids={["jessica2027", "lauren2027", "ashleigh2027"]} label="from the 2027 beta readers ★★★★★" tone="lav" />

      {/* Choose your experience */}
      <section id="choose" className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto">
          <Tag>two ways in</Tag>
          <H2>choose your <span className="pk">2027 experience.</span></H2>
          <p style={{ ...copy(), marginTop: 18, fontWeight: 700 }}>Save $222 on the full experience this Baddie Friday: {DEADLINE}, or sooner if the {S.spots} private activations go first.</p>
          <Experiences />
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <Tag>how it works</Tag>
          <H2>from booking <span className="pk">to your next era.</span></H2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" style={{ marginTop: 32 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ border: "var(--border)", borderRadius: 18, background: "#fff", padding: "22px 20px 24px", color: "var(--dark)" }}>
                <div style={{ fontFamily: pp, fontWeight: 900, fontSize: 34, lineHeight: 1, color: "var(--pink)" }}>{s.n}</div>
                <div style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, lineHeight: 1.2, marginTop: 10 }}>{s.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.6, marginTop: 6 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Betty */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coven/betty-sparkle.jpg" alt="Betty Andrews, astrologer and founder of MY SZN, in a pink sequin two-piece" style={{ width: "min(340px, 80vw)", borderRadius: 24, border: "var(--border)", objectFit: "cover", aspectRatio: "4 / 5", boxShadow: "10px 12px 0 var(--pink)" }} />
          </div>
          <div>
            <Tag>meet your astrologer</Tag>
            <H2>hi, <span className="pk">I&apos;m Betty.</span> 💖</H2>
            <div style={{ marginTop: 22 }}>
              <p style={copy()}>I&apos;m an astrologer, manifestation coach, shadow work practitioner and author who&apos;s deeply obsessed with helping women create bigger, freer, richer and more exciting lives.</p>
              <p style={copy()}>I&apos;ve spent years exploring the relationship between astrology, manifestation, money, identity and personal power.</p>
              <p style={copy()}>My work brings together astrology, Human Design, hypnosis and mindset work because understanding your chart is one thing, but actually using that knowledge to change how you live is where it gets really exciting.</p>
              <p style={copy()}>I&apos;m here for women with enormous ambitions, unconventional dreams and absolutely no interest in living the life somebody else decided they should have.</p>
              <p style={{ fontFamily: pp, fontWeight: 900, fontSize: 22, textTransform: "uppercase", margin: "6px 0 0" }}>Let&apos;s get into YOUR 2027.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-4xl mx-auto">
          <Tag>good to know</Tag>
          <H2>the things <span className="pk">you want to know.</span></H2>
          <div style={{ marginTop: 22 }}>
            {FAQ.map(([q, a]) => (
              <details key={q} style={{ borderTop: "var(--border)", padding: "18px 0", color: "var(--dark)" }}>
                <summary style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, textTransform: "uppercase", letterSpacing: "0.02em", cursor: "pointer", listStyle: "none" }}>✦ {q}</summary>
                <p style={{ ...copy(), marginTop: 10, marginBottom: 0 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="buy" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92 }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 58px)", color: "#fff", lineHeight: 1 }}>
            2027 is your baddie season.
            <br />
            <span className="pk">let&apos;s make it a BIGGGGG f*cking life.</span> 💸🪩
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4" style={{ marginTop: 34 }}>
            <a href={S.buyUrl} target="_blank" rel="noopener noreferrer" className="no-underline" style={cta("var(--pink)")}>book my report + private activation · ${S.priceUsd}</a>
            <a href={S.report.buyUrl} target="_blank" rel="noopener noreferrer" className="no-underline" style={outline}>just the report · ${S.report.priceUsd}</a>
          </div>
          <p style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, color: "#fff", marginTop: 18, lineHeight: 1.55 }}>
            Normally ${S.wasUsd}. Save $222 this Baddie Friday. Only {S.spots} private activations available at this price, and {DEADLINE}.
          </p>
        </div>
      </section>
    </>
  );
}
