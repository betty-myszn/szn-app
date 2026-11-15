import Link from "next/link";
import { BADDIE_SEASON_2027 as S } from "@/lib/baddie-season-2027";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The spotlight for Your Baddie Season: 2027, shown on the homepage and at the top of /baddie-sessions.
export default function BaddieSeasonPromoBand() {
  return (
    <section className="px-5 md:px-8 overflow-hidden" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 60, paddingBottom: 64 }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
        <div>
          <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🔮 black friday · only {S.spots} sessions at this price</span>
          <h2 className="display" style={{ fontSize: "clamp(42px, 5.6vw, 76px)", color: "#fff", lineHeight: 0.95, marginTop: 22 }}>
            your baddie season:
            <br />
            <span className="pk">2027.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.65, fontWeight: 600, color: "#fff", margin: "18px 0 0", maxWidth: 580 }}>
            Babyyy, what if 2027 is the year you finally get everything you&apos;ve been manifesting? 🔮 I&apos;ve created something very special: your 12-month astrology forecast, your manifestation blueprint and a private hypnosis activation with me, fully custom and designed around you, your dreams and the life you want to create. You walk into January as HER. 💖
          </p>
          <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 26 }}>
            <Link href={S.href} className="no-underline" style={{ display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 36px", border: "2px solid #fff" }}>
              claim my 2027 →
            </Link>
            <span style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, color: "#fff" }}>
              ${S.priceUsd} <span style={{ textDecoration: "line-through", marginLeft: 6 }}>${S.wasUsd}</span>
            </span>
          </div>
        </div>
        <Link href={S.href} aria-label="Your Baddie Season: 2027" className="block" style={{ position: "relative", justifySelf: "center" }}>
          <div className="holo-edge" style={{ width: "min(360px, 80vw)", borderRadius: 22, overflow: "hidden", transform: "rotate(2deg)", boxShadow: "10px 12px 0 var(--pink)", background: "var(--dark)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={S.image} alt="Betty in a pink witch hat and pink feather gloves" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
          <span className="holo-sticker" style={{ position: "absolute", top: -12, right: -8, zIndex: 5, transform: "rotate(7deg)", fontSize: 12 }}>✨ reading + activation</span>
        </Link>
      </div>
    </section>
  );
}
