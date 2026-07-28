import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SeasonWaitlistForm from "@/components/SeasonWaitlistForm";
import { SEASON_PAGES, SEASON_SLUGS } from "@/lib/season-pages";
import { OG_IMAGE } from "@/lib/site";

const pp = "var(--font-poppins), Poppins, sans-serif";

// Twelve static pages, built once rather than rendered per request. "Aries season" and friends are
// seasonal search spikes, so these have to be individually indexable and fast off the mark.
export function generateStaticParams() {
  return SEASON_SLUGS.map((sign) => ({ sign }));
}

// Only the twelve real signs exist. Anything else 404s rather than being rendered on demand, which
// stops junk URLs becoming thin indexable pages.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign } = await params;
  const season = SEASON_PAGES[sign.toLowerCase()];
  if (!season) return {};

  const title = `${season.name} Season ${season.dates}: Dates, Themes & Meaning`;
  const description = `${season.name} season runs ${season.dates}. ${season.vibe} ${season.intro.slice(0, 110).trim()}...`;
  const url = `/seasons/${sign.toLowerCase()}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${season.name} Szn, ${season.vibe}`,
      description,
      url,
      type: "article",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${season.name} Szn, ${season.vibe}`,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;
  const slug = sign.toLowerCase();
  const season = SEASON_PAGES[slug];

  if (!season) notFound();

  const allSeasons = Object.entries(SEASON_PAGES);

  // Breadcrumbs give Google the hierarchy for the SERP trail; the Article block tells it this page
  // is writing about a topic rather than another sales page.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://itsmyszn.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Seasons", item: "https://itsmyszn.com/seasons" },
          { "@type": "ListItem", position: 3, name: `${season.name} Season`, item: `https://itsmyszn.com/seasons/${slug}` },
        ],
      },
      {
        "@type": "Article",
        headline: `${season.name} Season: ${season.dates}`,
        description: season.intro,
        about: { "@type": "Thing", name: `${season.name} zodiac season` },
        publisher: { "@type": "Organization", name: "MY SZN", url: "https://itsmyszn.com" },
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
          <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">{season.emoji}</div>
          <div className="tag mb-4">{season.dates} &middot; {season.element}</div>
          <h1 style={{
            fontFamily: pp, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 16,
          }}>
            {season.name} <span style={{ color: season.color }}>szn.</span>
          </h1>
          <p style={{
            fontFamily: pp, fontSize: 20, fontWeight: 800, color: "#fff",
            marginBottom: 12,
          }}>
            {season.vibe}
          </p>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: season.color,
          }}>
            {season.theme}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <p style={{ fontSize: 17, lineHeight: 2.0, color: "var(--dark)" }}>
            {season.intro}
          </p>
        </div>
      </section>

      {/* What we cover */}
      <section className="px-8 py-16 md:py-24" style={{ background: season.bg, borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-6 text-center">inside {season.name.toLowerCase()} szn</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800,
            letterSpacing: "-1px", lineHeight: 1.15, textAlign: "center", marginBottom: 32,
          }}>
            What we cover in the <span style={{ color: season.color }}>{season.name} szn</span> workshop.
          </h2>

          <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)", marginBottom: 28 }}>
            {season.workshop}
          </p>

          <div className="p-6 md:p-8" style={{ background: "#fff", border: "var(--border)" }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {season.bullets.map((b) => (
                <li key={b} style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", marginBottom: 8 }}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Affirmation */}
      <section className="px-8 py-16 md:py-20 text-center" style={{ background: "var(--dark)" }}>
        <div className="max-w-2xl mx-auto">
          <p style={{
            fontFamily: pp, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.3, letterSpacing: "-0.5px",
          }}>
            &ldquo;{season.affirmation}&rdquo;
          </p>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="px-8 py-16 md:py-24 text-center" style={{ background: "var(--pink-light)", borderBottom: "var(--border)" }}>
        <div className="max-w-xl mx-auto">
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--pink)", marginBottom: 20,
          }}>
            founding members
          </div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800,
            letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 16,
          }}>
            Experience {season.name} szn inside <span className="pk">MY SZN.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", maxWidth: 420, margin: "0 auto 28px" }}>
            Join the waitlist for early access. Founding member pricing. Limited spaces.
          </p>
          <div className="flex justify-center">
            <SeasonWaitlistForm />
          </div>
        </div>
      </section>

      {/* Browse other seasons */}
      <section className="px-8 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">explore every season</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800,
            letterSpacing: "-0.8px", lineHeight: 1.15, textAlign: "center", marginBottom: 32,
          }}>
            Every season has something to <span className="pk">teach you.</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {allSeasons.map(([key, s]) => (
              <Link
                key={key}
                href={`/seasons/${key}`}
                className="no-underline"
                title={`${s.name} season, ${s.dates}`}
                style={{
                  display: "block", padding: 12, textAlign: "center",
                  background: slug === key ? "var(--dark)" : s.bg,
                  border: "var(--border)",
                  transition: "opacity 0.15s",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }} aria-hidden="true">{s.emoji}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: slug === key ? "#fff" : "var(--dark)", marginBottom: 2,
                }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11, color: slug === key ? "var(--pink)" : s.color, fontWeight: 600 }}>
                  {s.theme}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
