import fs from "fs";
import path from "path";
import Image from "next/image";
import type { CosmicEvent } from "@/lib/events";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The event's artwork. Uses the uploaded image when the file exists in /public, otherwise draws the
// title card (lilac sky, full moon, stars) so a new event never ships with a broken image.
export default function EventArt({ event, priority = false }: { event: CosmicEvent; priority?: boolean }) {
  const hasImage = !!event.image && fs.existsSync(path.join(process.cwd(), "public", event.image));
  return (
    <div className="event-art" style={{ position: "relative", aspectRatio: "1080 / 614", border: "var(--border)", overflow: "hidden", background: "var(--lav-light)" }}>
      {hasImage ? (
        <Image src={event.image!} alt={event.imageAlt ?? event.title} fill sizes="(max-width: 768px) 100vw, 640px" priority={priority} style={{ objectFit: "cover" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20, background: "radial-gradient(circle at 50% 42%, #fff 0 14%, var(--lav-light) 15% 30%, var(--lav) 70%)" }}>
          {["8%,14%", "86%,10%", "14%,78%", "90%,70%", "70%,26%", "24%,36%"].map((p, i) => {
            const [l, t] = p.split(",");
            return <span key={i} aria-hidden style={{ position: "absolute", left: l, top: t, fontSize: 22, color: i % 2 ? "var(--pink)" : "#fff" }}>{i % 2 ? "$" : "✦"}</span>;
          })}
          <div style={{ fontFamily: pp, fontWeight: 900, fontSize: "clamp(20px, 4vw, 38px)", lineHeight: 0.95, color: "var(--dark)", letterSpacing: "-1px" }}>{event.title}</div>
          <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginTop: 10 }}>{event.subtitle}</div>
          {event.edition && <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{event.edition}</div>}
        </div>
      )}
      <span style={{ position: "absolute", right: 12, bottom: 12, background: "var(--dark)", color: "#fff", fontFamily: pp, fontWeight: 800, fontSize: 13, padding: "6px 12px", borderRadius: 999 }}>
        {event.price === 0 ? "FREE" : `$${event.price} USD`}
      </span>
    </div>
  );
}
