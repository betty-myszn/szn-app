import type { Metadata } from "next";
import Link from "next/link";
import { COVEN_GIFT_CHECKOUT_URL } from "@/lib/coven-offers-shared";

export const metadata: Metadata = {
  title: "Gift a Baddie: 3 Months of The Bad B*tch Coven",
  description: "Give her three months inside The Bad B*tch Coven for $132: her personalised season, live masterclasses, rituals and a girl gang cheering her on. Send it now or on Christmas morning.",
  alternates: { canonical: "/baddie-coven/gift" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";
const cta: React.CSSProperties = { display: "inline-block", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "18px 28px", borderRadius: 999, border: "var(--border)", color: "var(--dark)" };

const GETS: [string, string][] = [
  ["🪐", "Her season, written for her chart, every single month."],
  ["🕯️", "Live masterclasses with me, plus every replay in the vault."],
  ["🌙", "Moon rituals, spells and astrotapping™ for the whole quarter."],
  ["💬", "The baddie chat, full of women who scream YESSSS at her wins."],
];

const STEPS: [string, string][] = [
  ["01", "Tell us her first name and email at checkout."],
  ["02", "Pick when she gets it: right now, or Christmas morning."],
  ["03", "She gets a gorgeous gift email from me and walks straight in. No card needed from her, ever."],
];

export default function CovenGiftPage() {
  return (
    <main style={{ background: "#fff", color: "var(--dark)" }}>
      <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div style={{ color: "#fff" }}>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🎁 gift a baddie</span>
            <h1 className="display" style={{ fontSize: "clamp(44px, 8vw, 92px)", lineHeight: 0.95, marginTop: 18, color: "#fff" }}>
              give her three months of <span className="pk">MAGIC.</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, fontWeight: 600, margin: "18px 0 0", maxWidth: 560 }}>
              Three months inside The Bad B*tch Coven for the woman who deserves a BIG, outrageously fun 2027: her chart, her season, her magic and a whole coven cheering her on.
            </p>
          </div>
          <div style={{ background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 24, boxShadow: "8px 10px 0 var(--pink)", padding: "26px 26px 28px" }}>
            <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>3 months of the coven</div>
            <div className="display" style={{ fontSize: "clamp(56px, 8vw, 80px)", lineHeight: 1, marginTop: 6 }}>$132</div>
            <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, margin: "8px 0 18px" }}>One payment. It never renews, so she gets pure magic and zero bills.</p>
            <a href={COVEN_GIFT_CHECKOUT_URL} className="no-underline btn-pink" style={{ ...cta, display: "block", textAlign: "center" }}>🎁 gift the coven →</a>
            <p style={{ fontSize: 14, lineHeight: 1.5, fontWeight: 700, margin: "14px 0 0" }}>🎄 Choose &ldquo;Christmas morning&rdquo; at checkout and it lands in her inbox on the 25th.</p>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ paddingTop: 56, paddingBottom: 56, borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1 }}>what <span className="pk">she gets.</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 24 }}>
            {GETS.map(([e, t]) => (
              <div key={t} className="holo-edge flex items-start gap-4" style={{ border: "var(--border)", borderRadius: 18, padding: "18px 20px", background: "var(--lav-light)" }}>
                <span style={{ fontSize: 28 }}>{e}</span>
                <span style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ paddingTop: 56, paddingBottom: 64, background: "var(--pink-light)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1 }}>how it <span className="pk">works.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 24 }}>
            {STEPS.map(([n, t]) => (
              <div key={n} style={{ border: "var(--border)", borderRadius: 18, padding: "20px 22px", background: "#fff", boxShadow: "5px 5px 0 var(--dark)" }}>
                <div className="display" style={{ fontSize: 40, lineHeight: 1, color: "var(--pink)" }}>{n}</div>
                <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 700, margin: "10px 0 0" }}>{t}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 30 }}>
            <a href={COVEN_GIFT_CHECKOUT_URL} className="no-underline btn-pink" style={cta}>🎁 gift the coven · $132 →</a>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, margin: "18px 0 0" }}>
            Want the coven for yourself too? <Link href="/baddie-coven" style={{ color: "var(--dark)", textDecoration: "underline" }}>Join for $44 a month</Link> before the founding price ends on Christmas Eve.
          </p>
        </div>
      </section>
    </main>
  );
}
