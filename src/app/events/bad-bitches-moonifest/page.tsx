import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventArt from "@/components/EventArt";
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
  { q: "Where does it happen?", a: "Online, live, from wherever you're cosiest. Your joining link comes by email with the confirmed time." },
  { q: "Do I need to know astrology?", a: "Not even a little. Your report explains everything in plain English, and the workshop walks you through it step by step." },
];

function Pill({ children }: { children: React.ReactNode }) {
  return <span style={{ display: "inline-block", background: "#fff", border: "var(--border)", borderRadius: 999, padding: "8px 16px", fontFamily: pp, fontWeight: 800, fontSize: 13 }}>{children}</span>;
}

function CtaLink({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <a href="#book" className="event-cta no-underline" style={{ display: "inline-block", background: dark ? "var(--dark)" : "var(--pink)", color: "#fff", border: "var(--border)", borderRadius: 999, fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "20px 36px" }}>
      {children}
    </a>
  );
}

export default function MoonifestPage() {
  const event = getEvent(SLUG);
  if (!event) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.title}: ${event.subtitle}, ${event.edition}`,
    description: event.shortDescription,
    startDate: "2026-10-26T18:30:00Z",
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

      {/* Hero */}
      <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 64, paddingBottom: 72, borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <Link href="/events" className="no-underline" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--lav)" }}>← all events</Link>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", margin: "22px 0 14px" }}>🌕 {event.edition}</div>
            <h1 className="display" style={{ fontSize: "clamp(44px, 8vw, 104px)", color: "#fff", lineHeight: 0.92 }}>
              BAD B*TCHES <span className="pk">MOONIFEST</span> 🌕💸
            </h1>
            <p style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(20px, 2.6vw, 28px)", color: "var(--lav)", margin: "18px 0 0" }}>{event.subtitle}</p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 22 }}>
              <Pill>🗓 Mon 26 Oct · 6:30pm UK</Pill>
              <Pill>💻 Live online + replay</Pill>
              <Pill>💜 $44 USD</Pill>
            </div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 12 }}>11:30am LA · 2:30pm New York · 5:30am Tue Sydney</p>
            <div style={{ marginTop: 28 }}><CtaLink>{event.cta}</CtaLink></div>
          </div>
          <div className="event-tilt"><EventArt event={event} priority /></div>
        </div>
      </section>

      {/* Description */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">money, magic &amp; manifestation</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", lineHeight: 1 }}>
            bad b*tches have dreams to fund, money to manifest and <span className="pk">magic to make.</span>
          </h2>
          <div className="offer-copy" style={{ marginTop: 24, maxWidth: 760 }}>
            <p>Welcome to BAD B*TCHES MOONIFEST, our brand new cosmic workshop series combining astrology, money manifestation, shadow work, witchcraft and a little Full Moon magic.</p>
            <p>For our first edition, we&apos;re working with Taurus energy to explore money, self-worth, pleasure, abundance and everything we&apos;re ready to call into our lives.</p>
            <p><strong>This experience is PERSONAL.</strong></p>
            <p>Every attendee receives their own astrology report created specifically for their birth chart before the workshop.</p>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-5">what&apos;s included</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", lineHeight: 1 }}>three pieces of <span className="pk">pure magic.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginTop: 36 }}>
            {/* The report: the hero card */}
            <div className="event-card md:col-span-3 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6" style={{ background: "var(--pink)", border: "var(--border)", borderRadius: 28, padding: "clamp(22px, 4vw, 40px)", color: "#fff" }}>
              <div>
                <div style={{ fontSize: 44 }}>💜</div>
                <h3 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1, marginTop: 10, color: "#fff" }}>your own 7-10 page personalised astrology report</h3>
                <div style={{ display: "inline-flex", gap: 12, alignItems: "baseline", background: "var(--dark)", borderRadius: 999, padding: "10px 20px", marginTop: 20, fontFamily: pp, fontWeight: 800 }}>
                  <span style={{ textDecoration: "line-through", opacity: 0.7 }}>$222</span>
                  <span>normally, on its own</span>
                </div>
                <p style={{ fontWeight: 600, lineHeight: 1.6, marginTop: 18 }}>Delivered before the workshop so you can explore your astrology beforehand.</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, alignContent: "center" }}>
                {REPORT.map((r) => (
                  <li key={r} style={{ background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 16, padding: "12px 16px", fontWeight: 700, fontSize: 15 }}>✦ {r}</li>
                ))}
              </ul>
            </div>
            <div className="event-card md:col-span-2" style={{ background: "#fff", border: "var(--border)", borderRadius: 28, padding: "clamp(22px, 4vw, 36px)" }}>
              <div style={{ fontSize: 40 }}>🌕</div>
              <h3 className="display" style={{ fontSize: "clamp(26px, 3.4vw, 38px)", lineHeight: 1, marginTop: 10 }}>live money, magic &amp; manifestation workshop</h3>
              <p style={{ fontWeight: 600, marginTop: 12 }}>A live group experience covering:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2" style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
                {WORKSHOP.map((w) => <li key={w} style={{ fontWeight: 600, fontSize: 15 }}><span className="pk">✦</span> {w}</li>)}
              </ul>
            </div>
            <div className="event-card" style={{ background: "var(--dark)", color: "#fff", border: "var(--border)", borderRadius: 28, padding: "clamp(22px, 4vw, 36px)" }}>
              <div style={{ fontSize: 40 }}>🪩</div>
              <h3 className="display" style={{ fontSize: "clamp(26px, 3.4vw, 38px)", lineHeight: 1, marginTop: 10, color: "#fff" }}>the full workshop <span className="pk">replay</span></h3>
              <p style={{ fontWeight: 600, lineHeight: 1.6, marginTop: 12 }}>Everyone receives access to the recording, whether you attend live or complete the experience later.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop details */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 70, paddingBottom: 70 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">the details</div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["🗓 When", "Monday 26 October 2026, 6:30pm UK time. Can't make it live? The replay is yours."],
              ["🌕 The moon", "The Full Moon peaks at 2° Taurus late on Sunday 25 October in the US (Monday 26 October in the UK)."],
              ["💻 Where", "Live online, joining link by email."],
              ["💸 Price", "$44 USD, one-time payment."],
            ].map(([t, d]) => (
              <div key={t} style={{ border: "var(--border)", borderRadius: 20, padding: 20, background: "var(--pink-bg)" }}>
                <dt style={{ fontFamily: pp, fontWeight: 800 }}>{t}</dt>
                <dd style={{ margin: "6px 0 0", fontWeight: 500, lineHeight: 1.6 }}>{d}</dd>
              </div>
            ))}
          </dl>
          <div style={{ border: "var(--border)", borderRadius: 20, padding: 20, marginTop: 16, background: "var(--lav-light)" }}>
            <div style={{ fontFamily: pp, fontWeight: 800 }}>⏰ Your time</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1" style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }}>
              {event.localTimes?.map((t) => <li key={t} style={{ fontWeight: 600 }}>{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing + booking */}
      <section id="book" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, scrollMarginTop: 80 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(40px, 6.5vw, 80px)", color: "#fff", lineHeight: 0.95 }}>
              ALL OF THIS FOR <span className="pk">$44 USD.</span>
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", marginTop: 22, fontWeight: 600 }}>Personal astrology report + live workshop + Full Moon rituals + replay.</p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.75)", marginTop: 14 }}>Your report alone is normally $222. Fill in your details, pay securely on Stripe and your report goes into the works straight away.</p>
          </div>
          <EventBookingForm slug={event.slug} cta="COUNT ME IN, B*TCH 💜" collectsBirth={event.collectsBirth} />
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-5">faq</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 56px)", lineHeight: 1 }}>all your <span className="pk">questions.</span></h2>
          <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
            {FAQ.map((f) => (
              <details key={f.q} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "16px 20px" }}>
                <summary style={{ fontFamily: pp, fontWeight: 800, cursor: "pointer" }}>{f.q}</summary>
                <p style={{ margin: "10px 0 0", lineHeight: 1.7 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", paddingTop: 72, paddingBottom: 80 }}>
        <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 0.98 }}>the moon is full. <span style={{ color: "#fff" }}>so is your bank account era.</span></h2>
        <div style={{ marginTop: 28 }}><CtaLink dark>{event.cta}</CtaLink></div>
      </section>
    </>
  );
}
