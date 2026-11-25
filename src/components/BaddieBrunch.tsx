import Image from "next/image";
import type { ReactNode } from "react";
import { Band } from "@/components/Offer";
import EventBookingForm from "@/components/EventBookingForm";
import { getEvent } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

// The Baddie Brunch, the first LA coven gathering, as a run of sections that sit INSIDE the LA coven
// page (Betty, 17 Nov 2026: "this really needs to sit in the LA Coven page"). /events/baddie-brunch
// redirects to /baddie-coven/la#brunch. Free for LA coven members ($88/month, which includes the online
// coven); $49 for everyone else, $44 online coven members included (they can upgrade). The venue
// photos are Bacari Silver Lake's own (daytime only, Betty's call), downloaded 17 Nov 2026. Copy
// follows Betty's launch caption.

const SLUG = "baddie-brunch";
const pp = "var(--font-poppins), Poppins, sans-serif";
export const UPGRADE_MAIL = "mailto:hello@thecosmicco.com?subject=Upgrade%20me%20to%20the%20LA%20coven%20%F0%9F%8C%B4";

const PHOTOS = [
  { src: "/events/bacari/patio-fire-pit.jpg", w: 1600, h: 1066, alt: "The Bacari Silver Lake patio, with a fire pit, string lights and bistro tables under the trees" },
  { src: "/events/bacari/candlelit-table.jpg", w: 1200, h: 1600, alt: "A long table set with candles, lilac flowers and velvet cushions" },
  { src: "/events/bacari/sunny-patio.jpg", w: 1600, h: 967, alt: "Sunlit tables under the trees on the Bacari patio" },
  { src: "/events/bacari/brunch-french-toast.jpg", w: 1200, h: 1600, alt: "French toast with strawberries and syrup on the Bacari brunch table" },
  { src: "/events/bacari/tree-patio-bar.jpg", w: 1600, h: 1066, alt: "The bar under a huge old tree on the Bacari patio" },
  { src: "/events/bacari/patio-sun.jpg", w: 1600, h: 1200, alt: "Morning sun through the bamboo over the Bacari patio tables" },
];

// The feeling, not the venue (Betty, 25 Nov 2026: "bigger, brighter, women at brunch, the pink brunch
// vibe"). Free Unsplash photos, the same set as the LA Head Baddie carousel. The Bacari shots alone
// showed empty tables, so the venue band keeps just two of them.
const MOOD = [
  { src: "/events/brunch-mood/women-toasting.jpg", w: 1600, h: 1066, alt: "A table of women clinking pink cocktails together at brunch" },
  { src: "/events/brunch-mood/pink-brunch-table.jpg", w: 1067, h: 1600, alt: "A pink brunch table from above, with coffee, eggs, strawberries and orange slices" },
  { src: "/events/brunch-mood/pink-table-pancakes.jpg", w: 1600, h: 1066, alt: "Pancakes and a pink cocktail on a pink table at brunch" },
  { src: "/events/brunch-mood/glasses-clink.jpg", w: 1067, h: 1600, alt: "Two women clinking glasses of bubbles" },
  { src: "/events/brunch-mood/croissant-flowers.jpg", w: 1068, h: 1600, alt: "A croissant and strawberries beside pink flowers" },
  { src: "/events/brunch-mood/pink-round-table.jpg", w: 1600, h: 1066, alt: "A round pink brunch table laid with plates, toast and coffee" },
];

// From Betty's launch caption: the guide is printed and written from each woman's own chart.
const GUIDE = [
  "What this season means for YOU.",
  "What you're being called to manifest.",
  "Where you're being invited to expand.",
  "How to work with the astrology to create your BIGGGG F*CKING LIFE.",
  "Journal prompts, affirmations and manifestation exercises written specifically for YOU.",
];

const GETS = [
  ["🥂", "A two-hour brunch hosted by Sublime", "Our Head Baddie of LA guides the whole morning, from the welcome hug to the introductions that turn a table of strangers into your girls."],
  ["📓", "Journaling + saying your dreams out loud", "Time to journal, share your biggest, most DELULU dreams and have a table of bad b*tches tell you to book the flight, start the business and charge MORE."],
  ["💞", "Your new baddie besties", "Women who understand your ambitions, celebrate your wins and genuinely want to see you become ridiculously successful. Women who GET ITTTT."],
];

/** Brunch questions, merged into the LA page's FAQ list. */
export const BRUNCH_FAQS: [string, string][] = [
  ["Is food included at the brunch?", "Your seat covers the hosted brunch, your personalised astrology guide and all the journaling and manifestation exercises. Food and drinks are ordered and paid for at Bacari, so you can order exactly what you're craving."],
  ["Why do you need my birth details?", "Betty writes your printed astrology guide from YOUR chart, so she needs your birth date, time and place. They're stored privately and only used for your guide."],
];

const button = (bg: string, ink = "#fff") => ({ display: "inline-block", background: bg, color: ink, fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "20px 32px", border: "2px solid var(--dark)" });
const frame = { border: "2px solid var(--dark)", borderRadius: 18, overflow: "hidden", background: "#fff" } as const;
const birthNote = "Your printed astrology guide is written from YOUR chart, so I need your birth details. They stay private and are only used for your guide. 🔒";

// hero: the brunch opens the page (h1), so the first thing a visitor sees is the event and the $49
// ticket anyone can buy, not the membership (Betty, 23 Nov 2026). middle: extra sections shown after
// "what's waiting" and before the prices (the LA page puts friends/manifesting + Sublime there).
export default function BaddieBrunch({ hero = false, afterHero, middle }: { hero?: boolean; afterHero?: ReactNode; middle?: ReactNode }) {
  const Title = hero ? "h1" : "h2";
  const event = getEvent(SLUG);
  if (!event) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.title}: ${event.subtitle}`,
    description: event.shortDescription,
    startDate: event.startsAt,
    endDate: "2026-12-05T13:30:00-08:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: "Bacari Silver Lake", address: { "@type": "PostalAddress", streetAddress: "3626 Sunset Blvd", addressLocality: "Los Angeles", addressRegion: "CA", postalCode: "90026", addressCountry: "US" } },
    image: `${SITE_URL}${event.image}`,
    organizer: { "@type": "Organization", name: "MY SZN", url: SITE_URL },
    offers: { "@type": "Offer", price: event.price, priceCurrency: "USD", url: `${SITE_URL}/baddie-coven/la#brunch`, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* The brunch's own header: Betty's headline, the patio photo framed on the right. */}
      <section id="brunch" className="px-5 md:px-8 overflow-hidden" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72, scrollMarginTop: 70 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start">
          <div>
            <span className="holo-sticker">🪩 {event.badge}</span>
            <Title className="display" style={{ fontSize: "clamp(46px, 6.4vw, 88px)", color: "var(--dark)", lineHeight: 0.92, marginTop: 22 }}>
              the baddie brunch.
            </Title>
            <div className="display" style={{ fontSize: "clamp(26px, 3.4vw, 44px)", color: "#fff", lineHeight: 1, marginTop: 10 }}>your future besties are waiting.</div>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 15, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark)", marginTop: 22 }}>LA · 5th of December · 11:30am</div>
            <p style={{ fontFamily: pp, fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.35, fontWeight: 800, color: "var(--dark)", margin: "10px 0 0", maxWidth: 560 }}>
              Sagittarius season edition: creating a BIGGGG F*CKING LIFE.
            </p>
            <p style={{ fontSize: "clamp(16px, 1.9vw, 18px)", lineHeight: 1.6, fontWeight: 600, color: "var(--dark)", margin: "12px 0 0", maxWidth: 560 }}>
              Two hours of astrology, manifestation, journaling, delicious food and meeting your new baddie besties at Bacari Silver Lake, 11:30am to 1:30pm, with a printed astrology guide written from YOUR birth chart.
            </p>
            {/* Ticket only (Betty, 25 Nov 2026): one price, one button, and the real deadline + seat cap
                from the posts (the Payment Link closes itself at 12 sales). */}
            <div className="flex flex-wrap items-stretch gap-3" style={{ marginTop: 24, maxWidth: 560 }}>
              <div style={{ ...frame, padding: "14px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>your seat</div>
                <div className="display" style={{ fontSize: 44, lineHeight: 1, marginTop: 6 }}>$49</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>no membership needed</div>
              </div>
              <div style={{ ...frame, padding: "14px 18px", background: "var(--dark)", color: "#fff", flex: "1 1 220px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>⏳ booking closes</div>
                <div className="display" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 8 }}>Sunday 29th of November</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>only 12 seats at the table 🪩</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 22 }}>
              <a href="#book" className="no-underline" style={button("var(--dark)")}>grab my seat · $49 🪩</a>
            </div>
          </div>
          <div className="relative" style={{ paddingBottom: 120 }}>
            <div style={{ ...frame, transform: "rotate(1.5deg)", marginLeft: "6%", boxShadow: "8px 8px 0 var(--dark)" }}>
              <Image src={MOOD[0].src} alt={MOOD[0].alt} width={MOOD[0].w} height={MOOD[0].h} priority sizes="(max-width: 1024px) 100vw, 580px" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <div className="absolute" style={{ ...frame, width: "36%", left: 0, bottom: 0, transform: "rotate(-5deg)", boxShadow: "6px 6px 0 var(--dark)" }}>
              <Image src={MOOD[1].src} alt={MOOD[1].alt} width={MOOD[1].w} height={MOOD[1].h} sizes="240px" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <span className="holo-sticker absolute" style={{ right: 6, bottom: 10, transform: "rotate(3deg)" }}>🥂 come solo, leave with a crew</span>
          </div>
        </div>
      </section>

      {afterHero}

      <Band wide tag="the first LA coven brunch" title="brunch with your future" accent="best friends.">
        <p>The Bad B*tch Coven is bringing the Baddie Brunch to LA, because more women should be making $$$, chasing outrageous dreams and doing it with a table of bad b*tches cheering them on.</p>
        <p>We&apos;re talking ambitious, witchy, creative, slightly DELULU women who want to travel the world, build businesses, manifest ridiculous amounts of money and make incredible friends along the way, because being sensible is BORRRRING.</p>
        <p><strong>You&apos;ll walk in solo and leave with new baddie besties in your phone and a printed guide to the BIGGEST Sagittarius season of your life.</strong></p>
        {/* Big, bright mood photos: two large, then two tall, so the table looks full and alive. */}
        <div className="grid grid-cols-2 gap-3 md:gap-4" style={{ marginTop: 28 }}>
          {[MOOD[2], MOOD[5]].map((p) => (
            <div key={p.src} style={{ ...frame, aspectRatio: "3 / 2", position: "relative", boxShadow: "6px 6px 0 var(--dark)" }}>
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 560px" style={{ objectFit: "cover" }} />
            </div>
          ))}
          {[MOOD[3], MOOD[4]].map((p) => (
            <div key={p.src} style={{ ...frame, aspectRatio: "4 / 5", position: "relative", boxShadow: "6px 6px 0 var(--dark)" }}>
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 560px" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </Band>

      <Band tone="lav" wide tag="where we're brunching" title="bacari" accent="silver lake.">
        <p>A tree-shaded patio with a fire pit, string lights, candles on every table and a brunch menu that&apos;s going to make choosing VERY hard.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: 26 }}>
          {[PHOTOS[0], PHOTOS[1]].map((p) => (
            <div key={p.src} style={{ ...frame, aspectRatio: "3 / 2", position: "relative" }}>
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <p style={{ marginTop: 20 }}>
          <strong>📍 3626 Sunset Blvd, Los Angeles, CA 90026.</strong>{" "}
          <a href={event.venue?.mapUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>open the map</a>
        </p>
      </Band>

      <Band wide tag="every baddie gets" title="what's waiting" accent="for you.">
        <div className="holo-edge" style={{ ...frame, padding: "26px 24px 28px", marginTop: 26 }}>
          <div style={{ fontFamily: pp, fontSize: "clamp(21px, 2.6vw, 26px)", fontWeight: 800, lineHeight: 1.2 }}>🪐 Your own personalised astrology guide, printed and waiting for you</div>
          <p style={{ margin: "10px 0 0", fontSize: 16, lineHeight: 1.65, fontWeight: 600 }}>Betty is personally writing a printed Sagittarius season guide for EVERY baddie at the table, from your own birth chart:</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 6, fontSize: 15.5, lineHeight: 1.55 }}>
            {GUIDE.map((g) => <li key={g}><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>{g}</li>)}
          </ul>
          <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.6 }}>Betty&apos;s there in spirit, because apparently teleportation hasn&apos;t been invented yet. F*CKING RUDE.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 16 }}>
          {GETS.map(([e, t, b]) => (
            <div key={t} className="holo-edge" style={{ ...frame, padding: "20px 20px 22px" }}>
              <div style={{ fontSize: 28 }}>{e}</div>
              <div style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, lineHeight: 1.2, margin: "10px 0 6px" }}>{t}</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{b}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 22 }}><strong>Food and drinks are ordered and paid for at Bacari, so you can order exactly what you&apos;re craving.</strong></p>
      </Band>

      {middle}

      <section id="book" className="px-5 md:px-8" style={{ background: "var(--dark)", borderTop: "2px solid var(--pink)", paddingTop: 84, paddingBottom: 92, scrollMarginTop: 80 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 68px)", color: "#fff", lineHeight: 0.98 }}>
              grab your seat.
              <br />
              <span className="pk">$49, no membership.</span>
            </h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: "#fff", marginTop: 22, fontWeight: 500 }}>
              <p style={{ margin: "0 0 14px", fontWeight: 800 }}>Hosted brunch + your personalised printed astrology guide + journaling + new baddie besties.</p>
              <p style={{ margin: "0 0 14px" }}>Pop your details in, pay securely with Stripe and Betty starts writing your guide from your chart. 💜</p>
              <p style={{ margin: 0, fontWeight: 800 }}>⏳ Booking closes Sunday 29th of November, and there are only 12 seats at the table.</p>
              <p id="member" style={{ margin: "14px 0 0", fontSize: 15 }}>Already in the LA coven? Your seat is free, so{" "}
                <a href={UPGRADE_MAIL.replace("Upgrade%20me%20to%20the%20LA%20coven", "Save%20my%20brunch%20seat")} style={{ color: "#fff", fontWeight: 800, textDecoration: "underline" }}>email us</a> and we&apos;ll save it for you. 🌴</p>
            </div>
          </div>
          <EventBookingForm
            slug={event.slug}
            cta="GRAB MY SEAT · $49 🪩"
            collectsBirth={event.collectsBirth}
            birthNote={birthNote}
            priceNote="Secure checkout with Stripe · $49 USD one-off ticket · food and drinks paid at Bacari"
          />
        </div>
      </section>
    </>
  );
}
