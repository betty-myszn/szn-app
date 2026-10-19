import fs from "fs";
import path from "path";
import Image from "next/image";
import type { CosmicEvent } from "@/lib/events";

const pp = "var(--font-poppins), Poppins, sans-serif";

const hasImage = (e: CosmicEvent) => !!e.image && fs.existsSync(path.join(process.cwd(), "public", e.image));

/** Lilac stand-in for an event whose artwork hasn't been uploaded yet, so nothing ships broken. */
function Placeholder() {
  return <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #fff 0 16%, var(--lav-light) 17% 34%, var(--lav) 75%)" }} />;
}

// The event's artwork as a landscape card, for listings.
export default function EventArt({ event, priority = false }: { event: CosmicEvent; priority?: boolean }) {
  return (
    <div style={{ position: "relative", aspectRatio: "1086 / 496", overflow: "hidden", background: "var(--lav-light)", borderBottom: "var(--border)" }}>
      {hasImage(event) ? (
        <Image src={event.image!} alt={event.imageAlt ?? event.title} fill sizes="(max-width: 768px) 100vw, 420px" priority={priority} style={{ objectFit: "cover" }} />
      ) : (
        <Placeholder />
      )}
    </div>
  );
}

// The event's poster for heroes: the artwork cropped square on top, the title block underneath, in
// the same tilted, hard-shadowed cover language as the report covers on the offer pages.
export function EventPoster({ event, priority = false, tilt = -3 }: { event: CosmicEvent; priority?: boolean; tilt?: number }) {
  const [first, ...restWords] = event.title.toLowerCase().split(" ");
  const lastWord = restWords.pop() ?? "";
  const lead = [first, ...restWords].join(" ");
  return (
    <div style={{ width: "min(340px, 78vw)", background: "var(--dark)", color: "#fff", border: "var(--border)", borderRadius: 6, overflow: "hidden", transform: `rotate(${tilt}deg)`, boxShadow: "10px 12px 0 var(--dark)" }}>
      <div style={{ position: "relative", aspectRatio: "1 / 1", background: "var(--lav-light)", borderBottom: "var(--border)" }}>
        {hasImage(event) ? (
          <Image src={event.image!} alt={event.imageAlt ?? event.title} fill sizes="340px" priority={priority} style={{ objectFit: "cover", objectPosition: "48% 50%" }} />
        ) : (
          <Placeholder />
        )}
      </div>
      <div style={{ padding: "18px 20px 14px" }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8 }}>my szn presents</div>
        <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 34, lineHeight: 0.92, letterSpacing: "-0.03em", marginTop: 10 }}>
          {lead}
          <br />
          <span style={{ color: "var(--pink)" }}>{lastWord}.</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 10, textTransform: "lowercase" }}>{event.subtitle}</div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 14, borderTop: "1.5px solid #fff", paddingTop: 10, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          <span>{event.edition ?? event.dateLabel}</span>
          <span>{event.price === 0 ? "free" : `$${event.price} usd`}</span>
        </div>
      </div>
    </div>
  );
}
