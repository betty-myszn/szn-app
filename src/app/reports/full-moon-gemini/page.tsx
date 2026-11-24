import type { Metadata } from "next";
import { Band, OfferCards } from "@/components/Offer";
import { BBR_REVIEWS, RBR_REVIEWS } from "@/lib/report-reviews";

// The Gemini Full Moon: Manifest a New Reality. $55, 15 only, made by hand within 48 hours (23 Nov 2026).
// Betty's own copy (23 Nov 2026), used word for word.
// The full moon is exact 24 Nov 2026 at 14:50 UK (2°17' Gemini, checked with swisseph); the report runs to the
// Sagittarius New Moon on 9 Dec 2026, so it still sells after the exact moment.
// Stripe Payment Link plink_1Uf4EhJ6s9fRhiJo914NM8b2 stops itself after 15 sales; birth details are collected on
// /order/details straight after payment, and the webhook sends template 95 (src/lib/email/bad-btch-report.ts).

export const metadata: Metadata = {
  title: "The Gemini Full Moon: Manifest a New Reality, Personalised Astrology Report",
  description:
    "Your personalised astrology & manifestation report for the Gemini Full Moon and Sagittarius season, written from your birth chart. $55, only 15, in your inbox within 48 hours.",
  alternates: { canonical: "/reports/full-moon-gemini" },
  openGraph: {
    title: "The Gemini Full Moon: Manifest a New Reality ♊️🌕💸",
    description: "Your personalised astrology & manifestation report for the baddie who's ready for a BIG F*CKING LIFE.",
    url: "/reports/full-moon-gemini",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";
const BUY_URL = "https://buy.stripe.com/fZu28scUL3bxfGigpn7kc16";

const SECTIONS = [
  { emoji: "♊️", title: "Your Cosmic Wake-Up Call", body: "Discover exactly what the Gemini Full Moon is activating in YOUR birth chart, including potential revelations, breakthroughs and turning points." },
  { emoji: "🖤", title: "F*ck the Old Narrative", body: "Uncover the limiting beliefs, inherited stories and subconscious programming that have been keeping you from your biggest desires." },
  { emoji: "💖", title: "Your Unfiltered Era", body: "Discover where you've been silencing yourself, watering down your personality and making yourself smaller to keep other people comfortable." },
  { emoji: "♐️", title: "Big Sagittarius Energy", body: "Your personalised Sagittarius season forecast, revealing where you're being called to expand, take bigger risks and get wildly ambitious." },
  { emoji: "💸", title: "Your Rich B*tch Blueprint", body: "Discover where to focus your manifestation energy to call in more money, opportunities, abundance and success this season." },
  { emoji: "🔮", title: "Your Full Moon Release Ritual", body: "A personalised ritual based on your birth chart to release outdated beliefs, identities and energetic attachments you're DONE carrying." },
  { emoji: "🪩", title: "Your Quantum Leap Codes", body: "Personalised shadow work, journal prompts, affirmations and manifestation exercises to embody the woman who already has what you want." },
  { emoji: "✨", title: "Your Next Timeline", body: "Your personalised Sagittarius New Moon activation, with intentions and practical actions to start creating your new reality before 2027." },
];

// Reviews of Betty's other hand-written reports (word for word from report-reviews.ts), each labelled with
// the report it was written about, since nobody has had a Gemini Full Moon report yet.
const REVIEWS = [
  { ...BBR_REVIEWS[0], report: "The Bad B*tch Report" },
  { ...RBR_REVIEWS[0], report: "Rich B*tch Rising" },
  { ...BBR_REVIEWS[1], report: "The Bad B*tch Report" },
];

const STEPS = [
  { n: "01", t: "Grab your report", b: "Tap the button and pay $55 on the secure Stripe checkout." },
  { n: "02", t: "Pop in your birth details", b: "Straight after paying, add your date, time and place of birth (there's a box to tick if you don't know your time)." },
  { n: "03", t: "Your report lands in your inbox", b: "Your personalised PDF report arrives within 48 hours, ready for your release window all the way to the Sagittarius New Moon on the 9th of December." },
];

const LOOKS = [
  { bg: "#fff", ink: "var(--dark)" },
  { bg: "var(--dark)", ink: "#fff" },
  { bg: "var(--pink-light)", ink: "var(--dark)" },
  { bg: "var(--lav-light)", ink: "var(--dark)" },
];

const cta = { display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "20px 40px" };

function Facts() {
  const items = ["$55 USD", "only 15", "personalised PDF from your birth chart", "in your inbox within 48 hours"];
  return (
    <div className="flex flex-wrap gap-2" style={{ marginTop: 22 }}>
      {items.map((t, i) => (
        <span key={t} style={{ fontFamily: pp, fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", border: "2px solid #fff", borderRadius: 999, padding: "8px 14px", background: i === 0 ? "var(--pink)" : "transparent", color: "#fff" }}>
          {t}
        </span>
      ))}
    </div>
  );
}

export default function FullMoonGeminiPage() {
  return (
    <>
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 64, paddingBottom: 72 }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-10 items-start">
          <div>
            <span className="holo-sticker" style={{ transform: "rotate(-2deg)" }}>♊️🌕 the gemini full moon</span>
            <h1 className="display" style={{ fontSize: "clamp(42px, 7vw, 88px)", color: "#fff", lineHeight: 0.95, marginTop: 22 }}>
              manifest a <span className="pk">new reality.</span>
            </h1>
            <div style={{ color: "#fff", fontSize: 17, lineHeight: 1.7, marginTop: 22, maxWidth: 580 }}>
              <p style={{ color: "#fff", margin: "0 0 14px", fontFamily: pp, fontWeight: 800 }}>Your personalised astrology &amp; manifestation report for the baddie who&apos;s ready for a BIG F*CKING LIFE. ♊️🌕💸</p>
              <p style={{ color: "#fff", margin: "0 0 14px" }}>We&apos;re rewriting the script, releasing the outdated identity and getting unapologetically honest about what we actually want.</p>
              <p style={{ color: "#fff", margin: 0 }}>This Gemini Full Moon, combined with the expansive energy of Sagittarius season, is your cosmic permission slip to reclaim your power, get wildly ambitious and manifest an entirely new reality before 2027.</p>
            </div>
            <Facts />
            <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="no-underline btn-pink" style={{ ...cta, border: "2px solid #fff", marginTop: 26 }}>
              🌕 get my report
            </a>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coven/baddie-moon-crown.jpg" alt="A baddie wearing a crown of moons" style={{ display: "block", width: "100%", height: "auto", border: "2px solid #fff", borderRadius: 18, transform: "rotate(1.5deg)" }} />
        </div>
      </section>

      <Band wide tone="lav" tag="what's inside, baddie? ✨" title="what's inside," accent="baddie?">
        <div className="grid md:grid-cols-2 gap-4" style={{ marginTop: 30 }}>
          {SECTIONS.map((s, n) => {
            const look = LOOKS[n % LOOKS.length];
            return (
              <div key={s.title} style={{ background: look.bg, color: look.ink, border: "var(--border)", borderRadius: 22, padding: "24px 22px" }}>
                <div className="flex items-baseline gap-3">
                  <span className="display" style={{ fontSize: 44, lineHeight: 0.9, color: "var(--pink)" }}>{String(n + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: pp, fontSize: 21, fontWeight: 800, lineHeight: 1.2, color: look.ink }}><span style={{ marginRight: 8 }}>{s.emoji}</span>{s.title}</span>
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.6, margin: "12px 0 0", color: look.ink }}>{s.body}</p>
              </div>
            );
          })}
        </div>
        <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="no-underline btn-pink" style={{ ...cta, border: "var(--border)", marginTop: 30 }}>
          🌕 I want all eight
        </a>
      </Band>

      <Band wide tag="three easy steps 🌕" title="how it" accent="works.">
        <div className="grid md:grid-cols-3 gap-4" style={{ marginTop: 26 }}>
          {STEPS.map((st) => (
            <div key={st.n} style={{ background: "#fff", border: "var(--border)", borderRadius: 20, padding: "22px 20px" }}>
              <div className="display" style={{ fontSize: 44, lineHeight: 0.9, color: "var(--pink)" }}>{st.n}</div>
              <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.2, marginTop: 10 }}>{st.t}</div>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "8px 0 0" }}>{st.b}</p>
            </div>
          ))}
        </div>
      </Band>

      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 76 }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-5"><span className="holo-sticker" style={{ transform: "rotate(-2deg)" }}>✦ the reviews</span></div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
            what baddies say about <span className="pk">my reports. 💜</span>
          </h2>
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-5 -mx-5 px-5 md:mx-0 md:px-0" style={{ marginTop: 28, paddingBottom: 6, scrollbarWidth: "none" }}>
            {REVIEWS.map((r) => (
              <figure key={r.name} className="snap-start shrink-0 w-[84%] md:w-auto" style={{ margin: 0, background: "#fff", border: "var(--border)", borderRadius: 18, padding: "22px 22px 24px", display: "flex", flexDirection: "column", color: "var(--dark)" }}>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 44, lineHeight: 0.6, color: "var(--pink)" }}>&ldquo;</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, lineHeight: 1.3, marginTop: 12 }}>{r.head}</div>
                <blockquote style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65 }}>{r.body}</blockquote>
                <figcaption style={{ marginTop: "auto", paddingTop: 16, fontFamily: pp, fontWeight: 800, fontSize: 15 }}>
                  {r.name} <span style={{ fontWeight: 600 }}>| on {r.report}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="no-underline btn-pink" style={{ ...cta, border: "var(--border)", marginTop: 30 }}>
            🌕 get my report · $55
          </a>
        </div>
      </section>

      <section id="buy" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, borderBottom: "var(--border)", scrollMarginTop: 80 }}>
        <div className="max-w-3xl mx-auto" style={{ color: "#fff" }}>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 68px)", color: "#fff", lineHeight: 1 }}>
            big money. big dreams. big love. <span className="pk">big f*cking life.</span>
          </h2>
          <div style={{ fontSize: 18, lineHeight: 1.7, marginTop: 22 }}>
            <p style={{ margin: "0 0 12px", color: "#fff" }}>We&apos;re leaving the watered-down version of ourselves in 2026.</p>
            <p style={{ margin: 0, color: "#fff", fontWeight: 800 }}>Your birth chart. Your magic. Your new reality.</p>
          </div>
          <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="no-underline btn-pink" style={{ ...cta, border: "2px solid #fff", marginTop: 28 }}>
            get my report
          </a>
          <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 16, color: "#fff", marginTop: 18 }}>$55 USD | Personalised digital astrology &amp; manifestation report</p>
          <Facts />
        </div>
      </section>

      <OfferCards />
      {/* Phone only: the button stays in reach while she reads the eight cards. */}
      <div className="md:hidden" style={{ height: 76 }} aria-hidden />
      <div className="md:hidden" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "var(--dark)", borderTop: "2px solid #fff", padding: "10px 14px calc(10px + env(safe-area-inset-bottom))", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ color: "#fff", fontFamily: pp, fontWeight: 800, fontSize: 13, lineHeight: 1.25, flex: 1 }}>
          Gemini Full Moon report<br /><span style={{ color: "var(--pink)" }}>$55 · only 15</span>
        </div>
        <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ background: "var(--pink)", color: "#fff", fontFamily: pp, fontWeight: 800, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 18px", border: "2px solid #fff", whiteSpace: "nowrap" }}>
          get my report
        </a>
      </div>
    </>
  );
}
