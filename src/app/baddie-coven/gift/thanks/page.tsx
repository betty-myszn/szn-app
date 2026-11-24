import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your Gift Is Wrapped",
  robots: { index: false },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

export default function CovenGiftThanksPage() {
  return (
    <main className="px-5 md:px-8 bg-glitter" style={{ minHeight: "70vh", paddingTop: 72, paddingBottom: 80 }}>
      <div className="max-w-2xl mx-auto" style={{ background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 26, boxShadow: "8px 10px 0 var(--pink)", padding: "clamp(26px, 5vw, 44px)" }}>
        <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🎁 gift wrapped</span>
        <h1 className="display" style={{ fontSize: "clamp(40px, 7vw, 68px)", lineHeight: 0.98, marginTop: 16 }}>
          you just gifted <span className="pk">a baddie.</span> 💜
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, fontWeight: 600, margin: "16px 0 0" }}>
          Your confirmation is on its way to your inbox. She&apos;ll get her gift email from me either right now or on Christmas morning, whichever you picked, with everything she needs to walk straight in.
        </p>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, fontWeight: 700, margin: "14px 0 0" }}>
          Typed her email wrong? Just reply to your confirmation and I&apos;ll sort it.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link href="/baddie-coven" className="no-underline btn-pink" style={{ display: "inline-block", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "16px 24px", borderRadius: 999, border: "var(--border)" }}>
            see the coven →
          </Link>
        </div>
      </div>
    </main>
  );
}
