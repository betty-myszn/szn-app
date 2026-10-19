import type { Metadata } from "next";
import Link from "next/link";
import EventArt, { EventPoster } from "@/components/EventArt";
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

const button = { display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const };

function EventCard({ event }: { event: CosmicEvent }) {
  const href = `/events/${event.slug}`;
  return (
    <article className="offer-card" style={{ background: "#fff", border: "var(--border)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Link href={href} className="no-underline"><EventArt event={event} /></Link>
      <div style={{ padding: "20px 20px 22px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div className="tag">{event.dateLabel}</div>
        <h3 style={{ fontFamily: pp, fontWeight: 800, fontSize: 21, lineHeight: 1.15, margin: 0 }}>{event.title}</h3>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{event.subtitle}{event.edition ? ` · ${event.edition}` : ""}</div>
        <p style={{ margin: 0, lineHeight: 1.6, fontSize: 15 }}>{event.shortDescription}</p>
        <div className="flex items-center justify-between gap-3" style={{ marginTop: "auto", paddingTop: 10 }}>
          <span style={{ fontFamily: pp, fontWeight: 800, fontSize: 16 }}>{priceLabel(event)}</span>
          <Link href={event.status === "past" && event.replayUrl ? event.replayUrl : href} className="no-underline" style={{ ...button, fontSize: 12, padding: "13px 20px" }}>
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
      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 80 }}>
        <div className="max-w-4xl mx-auto">
          <span className="holo-sticker">✦ my szn events</span>
          <h1 className="display" style={{ fontSize: "clamp(46px, 8vw, 104px)", color: "var(--dark)", lineHeight: 0.95, marginTop: 26 }}>
            your next
            <br />
            <span style={{ color: "#fff" }}>cosmic obsession.</span>
          </h1>
          <p style={{ fontFamily: pp, fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.5, fontWeight: 800, color: "#fff", margin: "26px auto 0", maxWidth: 680 }}>
            Workshops, moon rituals, manifestation magic and IRL experiences for bad b*tches who want more from life. 🪩
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 600, color: "var(--dark)", margin: "14px auto 0", maxWidth: 620 }}>
            Come for the astrology. Stay for the magic, the money, the friendships and becoming the woman you&apos;ve always wanted to be.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 84 }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
            <Link href={`/events/${featured.slug}`} className="no-underline flex justify-center" style={{ paddingBottom: 12 }}>
              <EventPoster event={featured} priority tilt={3} />
            </Link>
            <div>
              <div className="tag mb-5">✦ next up · {featured.dateLabel}</div>
              <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 0.95 }}>
                {featured.title.toLowerCase().split(" ").slice(0, -1).join(" ")} <span className="pk">{featured.title.toLowerCase().split(" ").slice(-1)[0]}.</span>
              </h2>
              <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, margin: "16px 0 0" }}>{featured.subtitle}{featured.edition ? ` · ${featured.edition}` : ""}</p>
              <p style={{ fontSize: 17, lineHeight: 1.75, margin: "12px 0 0", maxWidth: 560 }}>{featured.shortDescription}</p>
              <p style={{ fontWeight: 700, fontSize: 15, margin: "12px 0 0" }}>{featured.format}</p>
              <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 26 }}>
                <Link href={`/events/${featured.slug}`} className="no-underline" style={{ ...button, fontSize: 15, padding: "20px 36px" }}>{featured.cta}</Link>
                <span style={{ fontFamily: pp, fontSize: 16, fontWeight: 800 }}>{priceLabel(featured)}</span>
              </div>
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
