import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "You're booked for MOONIFEST", robots: { index: false } };

const pp = "var(--font-poppins), Poppins, sans-serif";

// Where Stripe sends her after paying (set as the Payment Link's after-completion redirect).
export default function MoonifestBooked() {
  return (
    <section className="px-5 md:px-8 bg-glitter text-center" style={{ minHeight: "70vh", paddingTop: 96, paddingBottom: 96 }}>
      <div className="max-w-2xl mx-auto">
        <div style={{ fontSize: 64 }}>🌕💸</div>
        <h1 className="display" style={{ fontSize: "clamp(44px, 8vw, 88px)", color: "#fff", lineHeight: 0.95, marginTop: 12 }}>
          you&apos;re booked, <span className="pk">baddie.</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 18, lineHeight: 1.7, marginTop: 22, fontWeight: 600 }}>
          Your confirmation is on its way to your inbox, your personalised report is going into the works and the exact workshop time plus your joining link will land by email the moment they&apos;re locked in.
        </p>
        <Link href="/events" className="no-underline" style={{ display: "inline-block", marginTop: 30, background: "var(--pink)", color: "#fff", border: "var(--border)", borderRadius: 999, fontFamily: pp, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "18px 32px" }}>
          see all events
        </Link>
      </div>
    </section>
  );
}
