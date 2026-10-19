import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Band, Tiles, ForYouIf } from "@/components/Offer";
import { EventPoster } from "@/components/EventArt";
import EventBookingForm from "@/components/EventBookingForm";
import { getEvent } from "@/lib/events";
import { OG_IMAGE, SITE_URL } from "@/lib/site";

const SLUG = "bad-bitches-moonifest";
const pp = "var(--font-poppins), Poppins, sans-serif";

export const metadata: Metadata = {
  title: "BAD B*TCHES MOONIFEST: Taurus Full Moon Money Workshop",
  description:
    "A live online money, magic and manifestation workshop for the Taurus Full Moon, with your own 7-10 page personalised astrology report and the full replay. $44 USD.",
  alternates: { canonical: `/events/${SLUG}` },
  openGraph: {
    title: "BAD B*TCHES MOONIFEST 🌕💸",
    description: "Money, Magic & Manifestation, Taurus Full Moon Edition. Live workshop + personalised astrology report + replay for $44.",
    url: `/events/${SLUG}`,
    type: "website",
    images: [{ url: "/events/taurus-full-moon.jpg", width: 1086, height: 496 }, OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
};

const REPORT = [
  "How the Taurus Full Moon activates your personal birth chart.",
  "The astrological houses and life themes involved.",
  "Money, abundance and self-worth insights.",
  "Personalised shadow work exercises.",
  "Journal prompts for deeper reflection.",
  "Affirmations based on your astrology.",
  "Manifestation practices and Full Moon rituals.",
];

const WORKSHOP = [
  "Taurus Full Moon astrology.",
  "Money manifestation and abundance.",
  "Releasing limiting beliefs around money.",
  "Shadow work and self-worth.",
  "Full Moon rituals and money magic.",
  "EFT tapping or guided hypnosis.",
  "Journaling and intention setting.",
];

const FAQ = [
  { q: "When is the workshop?", a: "Monday 26 October 2026 at 6:30pm UK time, which is 11:30am in Los Angeles, 2:30pm in New York and early Tuesday morning in Australia (5:30am Sydney), all while the Taurus Full Moon is still beautifully full. Your joining link comes by email." },
  { q: "I can't make it live. Is it still worth it?", a: "Totally. Everyone gets the full replay, and your personalised report is yours to keep, so you can do the whole experience in your own time and still get every drop of the magic." },
  { q: "Why do you need my birth details?", a: "Your 7-10 page report is written from YOUR chart, so I need your birth date, time and place to see exactly where this Full Moon lands for you. They're stored privately, used only to create your report and never shown anywhere public." },
  { q: "I don't know my birth time. Can I still come?", a: "Yes, babe. Tick the box when you book and your report will work from your planets and signs, which don't need a time, and skip the house-by-house detail." },
  { q: "When does my report arrive?", a: "Before the workshop, by email, so you can read it, highlight the bits that make you gasp and come in already knowing what this Full Moon is lighting up for you." },
  { q: "Where does it happen?", a: "Online, live, from wherever you're cosiest. Your joining link comes by email before we go live." },
  { q: "Do I need to know astrology?", a: "Not even a little. Your report explains everything in plain English, and the workshop walks you through it step by step." },
];

const button = (bg: string) => ({ display: "inline-block", background: bg, color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "22px 40px" });

export default function MoonifestPage() {
  const event = getEvent(SLUG);
  if (!event) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.title}: ${event.subtitle}, ${event.edition}`,
    description: event.shortDescription,
    startDate: event.startsAt,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "VirtualLocation", url: `${SITE_URL}/events/${SLUG}` },
    image: `${SITE_URL}${event.image}`,
    organizer: { "@type": "Organization", name: "MY SZN", url: SITE_URL },
    offers: { "@type": "Offer", price: event.price, priceCurrency: "USD", url: `${SITE_URL}/events/${SLUG}`, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero, in the same shape as the offer pages: pink, black headline, white accent, tilted cover */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 64, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <Link href="/events" className="no-underline" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--dark)" }}>← all events</Link>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", margin: "26px 0 22px" }}>🌕 taurus full moon edition</div>
            <h1 className="display" style={{ fontSize: "clamp(46px, 7.5vw, 100px)", color: "var(--dark)", lineHeight: 0.95 }}>
              bad b*tches
              <br />
              <span style={{ color: "#fff" }}>moonifest.</span>
            </h1>
            <div style={{ fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.65, color: "var(--dark)", maxWidth: 620, marginTop: 26, fontWeight: 600 }}>
              <p style={{ fontFamily: pp, fontWeight: 800, color: "#fff", margin: "0 0 14px" }}>Money, Magic &amp; Manifestation.</p>
              <p style={{ margin: 0 }}>A live Full Moon workshop, your own astrology report written from YOUR birth chart and the full replay, for the baddies who are SOOO ready to call in more money, more pleasure and more of what they&apos;re worth.</p>
            </div>
            <div style={{ marginTop: 26, color: "var(--dark)" }}>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18 }}>Monday 26 October · 6:30pm UK</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                11:30am LA · 2:30pm New York · 5:30am Tue Sydney · <a href="#times" style={{ color: "var(--dark)", textDecoration: "underline" }}>all times</a>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 32 }}>
              <a href="#book" className="no-underline" style={button("var(--dark)")}>{event.cta}</a>
              <span style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, color: "var(--dark)" }}>$44 USD</span>
            </div>
          </div>
          <div className="flex justify-center" style={{ paddingBottom: 12 }}>
            <EventPoster event={event} priority />
          </div>
        </div>
      </section>

      <Band tag="money, magic & manifestation" title="bad b*tches have dreams to fund, money to manifest and" accent="magic to make.">
        <p>Welcome to BAD B*TCHES MOONIFEST, our brand new cosmic workshop series combining astrology, money manifestation, shadow work, witchcraft and a little Full Moon magic.</p>
        <p>For our first edition, we&apos;re working with Taurus energy to explore money, self-worth, pleasure, abundance and everything we&apos;re ready to call into our lives.</p>
        <p><strong>This experience is PERSONAL.</strong></p>
        <p>Every attendee receives their own astrology report created specifically for their birth chart before the workshop.</p>
      </Band>

      <Band tone="lav" tag="what's included" title="three pieces of" accent="pure magic.">
        <div className="holo-edge" style={{ background: "#fff", borderRadius: 18, padding: "26px 24px 28px", marginTop: 30, color: "var(--dark)" }}>
          <div style={{ fontFamily: pp, fontSize: 24, fontWeight: 800, lineHeight: 1.2 }}>💜 Your own 7-10 page personalised astrology report</div>
          <p style={{ margin: "10px 0 0", fontWeight: 700 }}>
            Normally priced at <span style={{ textDecoration: "line-through" }}>$222</span> on its own. Yours inside MOONIFEST.
          </p>
          <ForYouIf items={REPORT} />
          <p style={{ margin: "18px 0 0", fontWeight: 600 }}>Delivered before the workshop so you can explore your astrology beforehand.</p>
        </div>
        <Tiles
          tone="lav"
          items={[
            {
              emoji: "🌕",
              title: "Live Money, Magic & Manifestation Workshop",
              body: (
                <>
                  <p style={{ margin: "0 0 8px" }}>A live group experience covering:</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 4 }}>
                    {WORKSHOP.map((w) => <li key={w}><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>{w}</li>)}
                  </ul>
                </>
              ),
            },
            {
              emoji: "🪩",
              title: "Full Workshop Replay",
              body: <p style={{ margin: 0 }}>Everyone receives access to the recording, whether you attend live or complete the experience later.</p>,
            },
          ]}
        />
      </Band>

      <Band tone="pinkLight" tag="the details" title="when and where" accent="we're meeting.">
        <Tiles
          tone="pinkLight"
          items={[
            { emoji: "🗓", title: "When", body: <p style={{ margin: 0 }}>Monday 26 October 2026, 6:30pm UK time. Can&apos;t make it live? The replay is yours.</p> },
            { emoji: "🌕", title: "The moon", body: <p style={{ margin: 0 }}>The Full Moon peaks at 2° Taurus late on Sunday 25 October in the US, early Monday 26 October in the UK.</p> },
            { emoji: "💻", title: "Where", body: <p style={{ margin: 0 }}>Live online, with your joining link sent by email.</p> },
            { emoji: "💸", title: "Price", body: <p style={{ margin: 0 }}>$44 USD, one-time payment.</p> },
          ]}
        />
        <div id="times" style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px", marginTop: 16, scrollMarginTop: 90 }}>
          <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800 }}>⏰ Your time</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1" style={{ listStyle: "none", padding: 0, margin: "10px 0 0", fontSize: 15 }}>
            {event.localTimes?.map((t) => <li key={t} style={{ fontWeight: 600 }}>{t}</li>)}
          </ul>
        </div>
      </Band>

      {/* Booking, on the dark glitter like the offer pages' waitlist band */}
      <section id="book" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, scrollMarginTop: 80 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
              all of this for
              <br />
              <span className="pk">$44 usd.</span>
            </h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.85)", marginTop: 22, fontWeight: 500 }}>
              <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Personal astrology report + live workshop + Full Moon rituals + replay.</p>
              <p style={{ margin: 0 }}>Your report alone is normally $222. Pop your details in, pay securely with Stripe and your report goes into the works straight away. 💜</p>
            </div>
          </div>
          <EventBookingForm slug={event.slug} cta="COUNT ME IN, B*TCH 💜" collectsBirth={event.collectsBirth} priceNote="Secure checkout with Stripe · $44 USD one-time payment" />
        </div>
      </section>

      <Band tone="white" tag="faq" title="all your" accent="questions.">
        <div style={{ marginTop: 26, display: "grid", gap: 12 }}>
          {FAQ.map((f) => (
            <details key={f.q} style={{ background: "var(--pink-light)", border: "var(--border)", borderRadius: 18, padding: "16px 20px" }}>
              <summary style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, cursor: "pointer" }}>{f.q}</summary>
              <p style={{ margin: "10px 0 0" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </Band>

      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", paddingTop: 76, paddingBottom: 84 }}>
        <h2 className="display" style={{ fontSize: "clamp(38px, 6.5vw, 80px)", color: "var(--dark)", lineHeight: 0.95 }}>
          see you under the
          <br />
          <span style={{ color: "#fff" }}>taurus full moon.</span>
        </h2>
        <a href="#book" className="no-underline" style={{ ...button("var(--dark)"), marginTop: 30 }}>{event.cta}</a>
      </section>
    </>
  );
}
