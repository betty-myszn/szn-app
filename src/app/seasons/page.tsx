import type { Metadata } from "next";
import Link from "next/link";
import { SEASON_PAGES } from "@/lib/season-pages";
import { OG_IMAGE } from "@/lib/site";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The hub the twelve sign pages were missing. Without it they had no parent to be linked from, so
// nothing on the site pointed at them and they collected no internal link equity.
export const metadata: Metadata = {
  title: "Zodiac Season Dates 2026: All 12 Signs, Themes & Meanings",
  description:
    "Every zodiac season, in order, with dates, element, and the theme it asks you to work on. Aries through Pisces, plus what each season means for how you plan your year.",
  alternates: { canonical: "/seasons" },
  openGraph: {
    title: "Every Zodiac Season, Dates & Meanings",
    description:
      "All 12 zodiac seasons with their dates, elements and themes. Work with the calendar instead of against it.",
    url: "/seasons",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export default function SeasonsIndexPage() {
  const seasons = Object.entries(SEASON_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://itsmyszn.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Seasons", item: "https://itsmyszn.com/seasons" },
        ],
      },
      {
        "@type": "ItemList",
        name: "The 12 zodiac seasons",
        itemListElement: seasons.map(([slug, s], i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.name} Season (${s.dates})`,
          url: `https://itsmyszn.com/seasons/${slug}`,
        })),
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="px-8 py-16 md:py-24" style={{ background: "var(--dark)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="tag mb-4">the full calendar</div>
          <h1 style={{
            fontFamily: pp, fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 18,
          }}>
            Every zodiac <span className="pk">season.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: "rgba(255,255,255,0.75)", maxWidth: 560, margin: "0 auto" }}>
            The zodiac year is twelve chapters, not one. Each season carries its own assignment: what
            to start, what to build, what to release. Here is the whole calendar, with dates and the
            theme each one asks you to work on.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-8 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {seasons.map(([slug, s]) => (
              <Link
                key={slug}
                href={`/seasons/${slug}`}
                className="no-underline"
                style={{
                  display: "block", padding: 24, background: s.bg,
                  border: "var(--border)", transition: "opacity 0.15s",
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 10 }} aria-hidden="true">{s.emoji}</div>
                <h2 style={{
                  fontFamily: pp, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px",
                  color: "var(--dark)", marginBottom: 6,
                }}>
                  {s.name} szn
                </h2>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: s.color, marginBottom: 12,
                }}>
                  {s.dates} &middot; {s.element}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--dark)" }}>
                  {s.vibe} {s.theme} is the work.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Context copy, gives the page something to rank on beyond a list of links */}
      <section className="px-8 py-16 md:py-24" style={{ background: "var(--pink-light)", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800,
            letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 24,
          }}>
            How to actually <span className="pk">use</span> the seasons.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)", marginBottom: 20 }}>
            A zodiac season lasts roughly thirty days and begins when the sun enters that sign. It is
            not about whether you were born under it. Every season affects everyone, because the sun
            is moving through it for all of us at once.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)", marginBottom: 20 }}>
            The useful part is the rhythm. Fire seasons (Aries, Leo, Sagittarius) are for starting and
            being seen. Earth seasons (Taurus, Virgo, Capricorn) are for building the unglamorous
            structure that holds it up. Air seasons (Gemini, Libra, Aquarius) are for thinking,
            connecting and reconsidering. Water seasons (Cancer, Scorpio, Pisces) are for feeling,
            processing and letting go.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)" }}>
            Plan your year against that and you stop forcing launches during Pisces season or trying
            to rest through Aries. Pick a season below to see what it asks of you.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 md:py-24 text-center">
        <div className="max-w-xl mx-auto">
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800,
            letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 16,
          }}>
            Want to know which season is <span className="pk">yours?</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", marginBottom: 28 }}>
            Your birth chart shows which of these seasons you were built for, and which ones will
            always ask more of you. Calculate it free, no signup.
          </p>
          <Link
            href="/chart"
            className="no-underline"
            style={{
              display: "inline-block", background: "var(--pink)", color: "var(--dark)",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "16px 34px", border: "var(--border)",
            }}
          >
            get your free birth chart
          </Link>
        </div>
      </section>
    </div>
  );
}
