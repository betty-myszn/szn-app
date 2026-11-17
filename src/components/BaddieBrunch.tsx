import Image from "next/image";
import { Band } from "@/components/Offer";
import EventBookingForm from "@/components/EventBookingForm";
import CovenPriceTable from "@/components/CovenPriceTable";
import { getEvent, LA_COVEN_CHECKOUT_URL } from "@/lib/events";
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

export default function BaddieBrunch() {
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
            <h2 className="display" style={{ fontSize: "clamp(46px, 6.4vw, 88px)", color: "var(--dark)", lineHeight: 0.92, marginTop: 22 }}>
              the baddie brunch.
            </h2>
            <div className="display" style={{ fontSize: "clamp(26px, 3.4vw, 44px)", color: "#fff", lineHeight: 1, marginTop: 10 }}>your future besties are waiting.</div>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 15, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark)", marginTop: 22 }}>LA · 5th of December · 11:30am</div>
            <p style={{ fontFamily: pp, fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.35, fontWeight: 800, color: "var(--dark)", margin: "10px 0 0", maxWidth: 560 }}>
              Sagittarius season edition: creating a BIGGGG F*CKING LIFE.
            </p>
            <p style={{ fontSize: "clamp(16px, 1.9vw, 18px)", lineHeight: 1.6, fontWeight: 600, color: "var(--dark)", margin: "12px 0 0", maxWidth: 560 }}>
              Two hours of astrology, manifestation, journaling, delicious food and meeting your new baddie besties at Bacari Silver Lake, 11:30am to 1:30pm, with a printed astrology guide written from YOUR birth chart.
            </p>
            <div className="grid grid-cols-2 gap-3" style={{ marginTop: 24, maxWidth: 480 }}>
              <div style={{ ...frame, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>LA coven members</div>
                <div className="display" style={{ fontSize: 40, lineHeight: 1, marginTop: 6, color: "var(--pink)" }}>FREE</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>included in your $88/month</div>
              </div>
              <div style={{ ...frame, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>everyone else</div>
                <div className="display" style={{ fontSize: 40, lineHeight: 1, marginTop: 6 }}>$49</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>one-off ticket</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 22 }}>
              <a href="#book" className="no-underline" style={button("var(--dark)")}>{event.cta}</a>
              <a href="#member" className="no-underline" style={button("#fff", "var(--dark)")}>claim my free seat 🌴</a>
            </div>
          </div>
          <div className="relative" style={{ paddingBottom: 110 }}>
            <div style={{ ...frame, transform: "rotate(1.5deg)", marginLeft: "8%" }}>
              <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} width={PHOTOS[0].w} height={PHOTOS[0].h} sizes="(max-width: 1024px) 100vw, 560px" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <div className="absolute" style={{ ...frame, width: "30%", left: 0, bottom: 0, transform: "rotate(-5deg)", boxShadow: "6px 6px 0 var(--dark)" }}>
              <Image src={PHOTOS[1].src} alt={PHOTOS[1].alt} width={PHOTOS[1].w} height={PHOTOS[1].h} sizes="220px" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <span className="holo-sticker absolute" style={{ right: 6, bottom: 0, transform: "rotate(3deg)" }}>☀️ brunch on the patio</span>
          </div>
        </div>
      </section>

      <Band tag="the first LA coven brunch" title="brunch with your future" accent="best friends.">
        <p>The Bad B*tch Coven is bringing the Baddie Brunch to LA, because more women should be making $$$, chasing outrageous dreams and doing it with a table of bad b*tches cheering them on.</p>
        <p>We&apos;re talking ambitious, witchy, creative, slightly DELULU women who want to travel the world, build businesses, manifest ridiculous amounts of money and make incredible friends along the way, because being sensible is BORRRRING.</p>
        <p><strong>You&apos;ll walk in solo and leave with new baddie besties in your phone and a printed guide to the BIGGEST Sagittarius season of your life.</strong></p>
      </Band>

      <Band tone="lav" wide tag="where we're brunching" title="bacari" accent="silver lake.">
        <p>A tree-shaded patio with a fire pit, string lights, candles on every table and a brunch menu that&apos;s going to make choosing VERY hard.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginTop: 26 }}>
          {PHOTOS.map((p) => (
            <div key={p.src} style={{ ...frame, aspectRatio: "4 / 5", position: "relative" }}>
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: "cover" }} />
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

      <Band tone="pinkLight" wide tag="how to come" title="two ways" accent="in.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 26 }}>
          <div className="holo-edge" style={{ ...frame, padding: "24px 22px 26px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>🌴 LA coven members</div>
            <div className="display" style={{ fontSize: 56, lineHeight: 1, marginTop: 8, color: "var(--pink)" }}>FREE</div>
            <p style={{ margin: "10px 0 0", fontWeight: 700 }}>Included in your LA coven membership, $88 a month.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 6, fontSize: 15, lineHeight: 1.55 }}>
              <li><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>A free place at one Baddie Brunch every month, starting with this one.</li>
              <li><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>EVERYTHING inside the online Bad B*tch Coven: the online workshops and activations, the community and friendship matching.</li>
              <li><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>$88 is the founding price, and it&apos;s going up.</li>
            </ul>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 20 }}>
              <a href={LA_COVEN_CHECKOUT_URL} className="no-underline" style={button("var(--pink)")}>join the LA coven · $88/mo</a>
              <a href="#member" className="no-underline" style={button("#fff", "var(--dark)")}>already in? claim my seat</a>
            </div>
          </div>
          <div style={{ ...frame, padding: "24px 22px 26px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>🪩 everyone else</div>
            <div className="display" style={{ fontSize: 56, lineHeight: 1, marginTop: 8 }}>$49</div>
            <p style={{ margin: "10px 0 0", fontWeight: 700 }}>A one-off ticket for the Baddie Brunch.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 6, fontSize: 15, lineHeight: 1.55 }}>
              <li><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>Everything every baddie gets: the hosted brunch, your personalised printed astrology guide and the journaling and manifestation exercises.</li>
              <li><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>Coming to more than one LA gathering? Two tickets cost more than a month in the LA coven.</li>
            </ul>
            <div style={{ marginTop: 20 }}>
              <a href="#book" className="no-underline" style={button("var(--dark)")}>grab a ticket · $49</a>
            </div>
          </div>
        </div>


        {/* Betty, 17 Nov: make it obvious the $44 online coven does NOT include LA events. */}
        <div style={{ ...frame, marginTop: 16, padding: "20px 22px", background: "var(--dark)", color: "#fff" }}>
          <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.25 }}>💻 In the online coven for $44?</div>
          <p style={{ margin: "8px 0 0", fontSize: 15.5, lineHeight: 1.65 }}>
            Your $44 membership covers everything online, and the monthly Baddie Brunch comes with the in-person LA coven, which is $88 a month and includes EVERYTHING online too. <strong>Upgrade and your brunch seat is free.</strong> Email{" "}
            <a href={UPGRADE_MAIL} style={{ color: "#fff", fontWeight: 800, textDecoration: "underline" }}>hello@thecosmicco.com</a> with &quot;upgrade me to LA&quot; and we&apos;ll switch your plan, so you&apos;re only ever paying for one membership.
          </p>
        </div>
      </Band>

      <section id="member" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, scrollMarginTop: 80 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 68px)", color: "#fff", lineHeight: 0.98 }}>
              LA coven member?
              <br />
              <span className="pk">claim your free seat.</span>
            </h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: "#fff", marginTop: 22, fontWeight: 500 }}>
              <p style={{ margin: "0 0 14px", fontWeight: 800 }}>Use the email you joined the LA coven with and your seat is saved on the spot.</p>
              <p style={{ margin: 0 }}>Places are limited, so claim yours now and your confirmation lands in your inbox with the address and a calendar link. 🌴</p>
            </div>
            <div style={{ marginTop: 26 }}><CovenPriceTable tone="dark" /></div>
          </div>
          <EventBookingForm
            slug={event.slug}
            mode="member"
            cta="SAVE MY FREE SEAT 🌴"
            collectsBirth={event.collectsBirth}
            birthNote={birthNote}
            priceNote="Free with your $88/month LA coven membership"
            notMemberHint={
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#fff" }}>
                In the $44 online coven?{" "}
                <a href={UPGRADE_MAIL} style={{ color: "#fff", fontWeight: 800, textDecoration: "underline" }}>Email us to upgrade to LA</a>, or{" "}
                <a href="#book" style={{ color: "#fff", fontWeight: 800, textDecoration: "underline" }}>grab a $49 ticket</a>.
              </p>
            }
          />
        </div>
      </section>

      <section id="book" className="px-5 md:px-8" style={{ background: "var(--dark)", borderTop: "2px solid var(--pink)", paddingTop: 84, paddingBottom: 92, scrollMarginTop: 80 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 68px)", color: "#fff", lineHeight: 0.98 }}>
              not a member?
              <br />
              <span className="pk">grab a $49 ticket.</span>
            </h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: "#fff", marginTop: 22, fontWeight: 500 }}>
              <p style={{ margin: "0 0 14px", fontWeight: 800 }}>Hosted brunch + your personalised printed astrology guide + journaling + new baddie besties.</p>
              <p style={{ margin: 0 }}>Pop your details in, pay securely with Stripe and Betty starts writing your guide from your chart. 💜</p>
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
