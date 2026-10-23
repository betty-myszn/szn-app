import type { Metadata } from "next";
import Link from "next/link";
import { OFFERS } from "@/lib/offers";
import { OfferCards } from "@/components/Offer";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The reports overview: Rich B*tch Rising + The Bad B*tch Report, each linking to its own page.

export const metadata: Metadata = {
  title: "Personalised Astrology Reports for Money + Confidence",
  description:
    "MY SZN's personalised astrology reports: Rich B*tch Rising for money, wealth and self-worth, and The Bad B*tch Report for confidence, power and visibility. Both written from your own birth chart. Join the waitlists.",
  alternates: { canonical: "/reports" },
  openGraph: {
    title: "MY SZN Reports 💸💜",
    description: "Your money and your confidence, read from your own birth chart.",
    url: "/reports",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const REPORTS = [
  { o: OFFERS["rich-btch-rising"], bg: "var(--pink)", ink: "var(--dark)", accent: "#fff", blurb: "Wealth, earning potential, money blocks, financial independence and self-worth, so you know exactly how your chart is built to get PAID." },
  { o: OFFERS["bad-btch-report"], bg: "var(--dark)", ink: "#fff", accent: "var(--pink)", blurb: "Confidence, personal power, visibility, self-expression and boundaries, so you stop shrinking and start taking up ALL the space." },
];

export default function ReportsPage() {
  return (
    <>
      <section className="px-5 md:px-8" style={{ background: "var(--lav)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-6">✨ my szn reports</div>
          <h1 className="display" style={{ fontSize: "clamp(42px, 7.5vw, 96px)", color: "var(--dark)", lineHeight: 0.95 }}>
            your chart,
            <br />
            <span className="pk">in writing.</span>
          </h1>
          <p style={{ fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.65, color: "var(--dark)", maxWidth: 680, marginTop: 26, fontWeight: 600 }}>
            Two personalised reports written from your exact birth chart, one for your money and one for your confidence, because a woman who knows how she&apos;s wired is OBSESSED with herself in the most dangerous possible way.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 64, paddingBottom: 72 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {REPORTS.map(({ o, bg, ink, accent, blurb }) => (
            <Link key={o.slug} href={o.href} className="no-underline offer-card" style={{ background: bg, color: ink, border: "var(--border)", borderRadius: 24, padding: "34px 28px 32px", display: "block" }}>
              <div style={{ fontSize: 44 }}>{o.emoji}</div>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4.6vw, 52px)", lineHeight: 1, marginTop: 12, color: ink }}>
                {o.name}
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, marginTop: 16, fontWeight: 500 }}>{blurb}</p>
              <div style={{ fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accent, marginTop: 22 }}>
                {o.price ? `${o.price} · ` : ""}{o.cta === "join the waitlist" ? "waitlist open" : o.cta} →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <OfferCards title="more ways into my szn" />
    </>
  );
}
