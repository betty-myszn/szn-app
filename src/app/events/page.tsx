import type { Metadata } from "next";
import Link from "next/link";
import EventArt from "@/components/EventArt";
import WorkshopsClient from "./WorkshopsClient";
import { upcomingEvents, pastEvents, priceLabel, type CosmicEvent } from "@/lib/events";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events: Moon Workshops, Manifestation Classes and IRL Magic",
  description:
    "MY SZN events: Full Moon workshops, manifestation magic, astrology classes and IRL experiences for women who want more from life. Book BAD B*TCHES MOONIFEST now.",
  alternates: { canonical: "/events" },
  openGraph: { title: "YOUR NEXT COSMIC OBSESSION 🪩", description: "Workshops, moon rituals, manifestation magic and IRL experiences from MY SZN.", url: "/events", type: "website", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

function EventCard({ event }: { event: CosmicEvent }) {
  const href = `/events/${event.slug}`;
  return (
    <article className="event-card" style={{ background: "#fff", border: "var(--border)", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Link href={href} className="no-underline"><EventArt event={event} /></Link>
      <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>{event.dateLabel}</div>
        <h3 style={{ fontFamily: pp, fontWeight: 900, fontSize: 22, lineHeight: 1.05, margin: 0 }}>{event.title}</h3>
        <div style={{ fontWeight: 700 }}>{event.subtitle}{event.edition ? ` · ${event.edition}` : ""}</div>
        <p style={{ margin: 0, lineHeight: 1.6, fontSize: 15 }}>{event.shortDescription}</p>
        <div className="flex items-center justify-between gap-3" style={{ marginTop: "auto", paddingTop: 8 }}>
          <span style={{ fontFamily: pp, fontWeight: 900, fontSize: 18 }}>{priceLabel(event)}</span>
          <Link href={event.status === "past" && event.replayUrl ? event.replayUrl : href} className="event-cta no-underline" style={{ background: "var(--pink)", color: "#fff", border: "var(--border)", borderRadius: 999, fontFamily: pp, fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", padding: "12px 18px" }}>
            {event.status === "past" ? (event.replayUrl ? "watch the replay" : "see the event") : "book now"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const upcoming = upcomingEvents();
  const [featured, ...rest] = upcoming;
  const past = pastEvents();

  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 76, position: "relative", overflow: "hidden" }}>
        {["6%,18%,✦", "90%,14%,🌕", "12%,74%,🪩", "86%,70%,✦", "48%,8%,✨"].map((p) => {
          const [l, t, c] = p.split(",");
          return <span key={p} aria-hidden style={{ position: "absolute", left: l, top: t, fontSize: 30, color: "#fff" }}>{c}</span>;
        })}
        <div className="max-w-4xl mx-auto" style={{ position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", marginBottom: 20 }}>my szn events</div>
          <h1 className="display" style={{ fontSize: "clamp(44px, 8.5vw, 112px)", lineHeight: 0.92 }}>
            YOUR NEXT <span style={{ color: "#fff" }}>COSMIC OBSESSION.</span> 🪩
          </h1>
          <p style={{ fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.6, fontWeight: 700, marginTop: 24 }}>
            Workshops, moon rituals, manifestation magic and IRL experiences for bad b*tches who want more from life.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, fontWeight: 500, marginTop: 12, maxWidth: 640, marginInline: "auto" }}>
            Come for the astrology. Stay for the magic, the money, the friendships and becoming the woman you&apos;ve always wanted to be.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 72, paddingBottom: 80, borderBottom: "var(--border)" }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <Link href={`/events/${featured.slug}`} className="event-tilt no-underline"><EventArt event={featured} priority /></Link>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)" }}>✦ featured · {featured.dateLabel}</div>
              <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.95, marginTop: 14 }}>{featured.title} 🌕💸</h2>
              <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 20, color: "var(--lav)", marginTop: 12 }}>{featured.subtitle}{featured.edition ? ` · ${featured.edition}` : ""}</p>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 17, lineHeight: 1.7, marginTop: 14, fontWeight: 500 }}>{featured.shortDescription}</p>
              <p style={{ color: "#fff", fontFamily: pp, fontWeight: 800, marginTop: 12 }}>{featured.format} · {priceLabel(featured)}</p>
              <Link href={`/events/${featured.slug}`} className="event-cta no-underline" style={{ display: "inline-block", marginTop: 24, background: "var(--pink)", color: "#fff", border: "var(--border)", borderRadius: 999, fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "20px 34px" }}>
                {featured.cta}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* More upcoming */}
      {rest.length > 0 && (
        <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 64, paddingBottom: 72 }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>upcoming <span className="pk">events</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: 28 }}>
              {rest.map((e) => <EventCard key={e.slug} event={e} />)}
            </div>
          </div>
        </section>
      )}

      {/* Members' seasonal workshops, RSVPs and replays (unchanged) */}
      <WorkshopsClient />

      {past.length > 0 && (
        <section className="px-5 md:px-8" style={{ background: "#fff", borderTop: "var(--border)", paddingTop: 64, paddingBottom: 72 }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>past <span className="pk">events</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: 28 }}>
              {past.map((e) => <EventCard key={e.slug} event={e} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
