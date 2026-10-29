import Link from "next/link";
import CovenCountdown from "@/components/CovenCountdown";
import { OFFERS } from "@/lib/offers";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The homepage spotlight for the Baddie Coven launch, in the slot under the hero that EventPromoBand
// fills while an event is on sale. Launch facts (5 Nov, 3 days, $44 founding, 11/11) match the
// coven page; the countdown hides itself once the doors close.
export default function CovenPromoBand() {
  const coven = OFFERS["baddie-coven"];
  return (
    <section className="px-5 md:px-8 overflow-hidden" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 60 }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
        <div>
          <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🦄 opens 5 nov · 3 days only</span>
          <h2 className="display" style={{ fontSize: "clamp(42px, 5.2vw, 72px)", color: "var(--dark)", lineHeight: 0.95, marginTop: 22 }}>
            the baddie
            <br />
            <span className="pk">coven.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.65, fontWeight: 600, color: "var(--dark)", margin: "18px 0 0", maxWidth: 560 }}>
            For women who want to live BIG lives, manifest outrageous things, make seriouuuus money and become completely obsessed with their own lives, with a monthly coven circle, personal guidance every season and a whole coven of baddies doing it with you.
          </p>
          <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, color: "var(--dark)", margin: "14px 0 0" }}>
            🪄 our FIRST EVER event: the 11/11 manifestation workshop
          </p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--dark)", margin: "6px 0 0" }}>
            🎀 Dress code: come as your future self, the woman you&apos;re manifesting.
          </p>
          <div style={{ marginTop: 18 }}>
            <CovenCountdown />
          </div>
          <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 24 }}>
            <Link href={coven.href} className="no-underline" style={{ display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 36px" }}>
              {coven.cta} →
            </Link>
            <span style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, color: "var(--dark)" }}>$44/month founding price</span>
          </div>
        </div>
        <Link href={coven.href} aria-label={coven.name} className="block" style={{ position: "relative", justifySelf: "center" }}>
          <div className="holo-edge" style={{ width: "min(360px, 80vw)", borderRadius: 22, overflow: "hidden", transform: "rotate(2deg)", boxShadow: "10px 12px 0 var(--dark)", background: "var(--lav-light)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coven/baddie-pink-email.jpg" alt="A baddie in a pink puff-sleeve top, hand on hip" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
          <span className="holo-sticker" style={{ position: "absolute", top: -12, right: -8, zIndex: 5, transform: "rotate(7deg)", fontSize: 12 }}>✨ baddies only</span>
        </Link>
      </div>
    </section>
  );
}
