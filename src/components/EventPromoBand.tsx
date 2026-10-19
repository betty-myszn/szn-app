import Link from "next/link";
import Image from "next/image";
import { upcomingEvents } from "@/lib/events";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The homepage spotlight for the next published event: the event hero in miniature, on the art's own
// colour so the picture blends in. Disappears by itself once no event is published.
export default function EventPromoBand() {
  const event = upcomingEvents()[0];
  if (!event) return null;
  const href = `/events/${event.slug}`;
  const words = event.title.toLowerCase().split(" ");
  return (
    <section className="px-5 md:px-8 overflow-hidden" style={{ background: event.heroBg ?? "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 48 }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-4 lg:gap-6 items-end">
        <div className="lg:pb-14">
          <span className="holo-sticker">✦ new · {event.badge ?? event.edition ?? "live event"}</span>
          <h2 className="display" style={{ fontSize: "clamp(42px, 4.6vw, 68px)", color: "var(--dark)", lineHeight: 0.95, marginTop: 22 }}>
            {words.slice(0, -1).join(" ")}
            <br />
            <span className="pk">{words[words.length - 1]}.</span>
          </h2>
          <p style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(17px, 1.5vw, 20px)", color: "var(--dark)", margin: "16px 0 0" }}>{event.subtitle}.</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--dark)", margin: "6px 0 0", maxWidth: 520 }}>{event.format}.</p>
          <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, color: "var(--dark)", margin: "12px 0 0" }}>🗓 {event.dateLabel}</p>
          <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 24 }}>
            <Link href={href} className="no-underline" style={{ display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 36px" }}>
              {event.cta}
            </Link>
            <span style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, color: "var(--dark)" }}>{event.price === 0 ? "FREE" : `$${event.price} USD`}</span>
          </div>
        </div>
        {event.image && (
          <Link href={href} className="event-hero-art -mx-5 md:-mx-8 lg:ml-0 block" aria-label={event.title}>
            <Image src={event.image} alt={event.imageAlt ?? event.title} width={854} height={494} unoptimized style={{ display: "block", width: "100%", height: "auto" }} />
          </Link>
        )}
      </div>
    </section>
  );
}
