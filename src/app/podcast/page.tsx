import Image from "next/image";
import { OG_IMAGE } from "@/lib/site";
import { FREE_TRIAL_CTA } from "@/lib/cta";

const pp = "var(--font-poppins), Poppins, sans-serif";

export const metadata = {
  title: "Astrology, Confidence & Manifestation Podcast for Women",
  description:
    "The MY SZN podcast. Astrology, confidence, money, manifestation, and becoming the version of yourself your chart has been pointing toward. New episodes weekly on Spotify and Apple Podcasts.",
  alternates: { canonical: "/podcast" },
  openGraph: {
    title: "MY SZN Podcast, Astrology, Confidence & Manifestation",
    description: "The weekly pep talk your future self would give you. Astrology, money, manifestation and main character energy.",
    url: "/podcast",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export default function PodcastPage() {
  return (
    <>
      {/* Hero with podcast artwork */}
      <div
        className="px-8 py-16 md:py-24"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:justify-end">
            <Image
              src="/myszn-podcast.png"
              alt="MY SZN Podcast cover art"
              width={752}
              height={754}
              priority
              sizes="(max-width: 768px) 100vw, 340px"
              style={{
                width: "100%",
                maxWidth: 340,
                height: "auto",
                aspectRatio: "1",
                objectFit: "cover",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>

          <div className="text-center md:text-left">
            <div className="tag mb-4">the podcast</div>
            <h1
              style={{
                fontFamily: pp,
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                color: "#fff",
                lineHeight: 1.05,
                marginBottom: 16,
              }}
            >
              my<span style={{ color: "var(--pink)" }}>szn</span> podcast.
            </h1>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.5)",
                maxWidth: 480,
                marginBottom: 28,
              }}
            >
              Astrology, personal development, confidence, money, business, relationships
              and becoming the woman you came here to be. New episodes weekly.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="https://open.spotify.com/show/7Hi3IXajGlE1LuZD5sf08a?si=445720c35a884330"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  background: "#1DB954",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "opacity 0.15s",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify
              </a>

              <a
                href="https://podcasts.apple.com/gb/podcast/my-szn/id1870482009"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  background: "linear-gradient(180deg, #F452FF 0%, #832BC1 100%)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "opacity 0.15s",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c4.988 0 8.94 3.16 9.69 7.62.06.36-.18.72-.54.78-.36.06-.72-.18-.78-.54C19.56 6.36 16.11 3.6 11.88 3.6c-4.32 0-7.86 2.88-8.46 6.96-.06.36-.42.6-.78.54-.36-.06-.6-.42-.54-.78.72-4.56 4.8-7.752 9.765-7.752zM12 7.2c3.36 0 6.12 2.16 6.6 5.22.06.36-.18.72-.54.78-.36.06-.72-.18-.78-.54C16.92 10.08 14.7 8.28 12 8.28c-2.76 0-5.04 1.92-5.34 4.5-.06.36-.42.6-.78.54-.36-.06-.6-.42-.54-.78C5.76 9.48 8.58 7.2 12 7.2zm-.06 4.44c1.98 0 3.54 1.32 3.84 3.24.12.6.12 1.44-.12 2.52l-.6 2.28c-.18.66-.78 1.08-1.44 1.08h-3.36c-.66 0-1.26-.42-1.44-1.08l-.6-2.28c-.18-.84-.24-1.68-.06-2.52.36-1.92 1.86-3.24 3.78-3.24z"/>
                </svg>
                Apple Podcasts
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* What to expect */}
      <div style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="tag mb-6 text-center">what to expect</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {[
              { title: "Astrology Deep Dives", desc: "Beyond your sun sign. Transits, houses, aspects, and how to actually USE your chart.", bg: "var(--lav-light)" },
              { title: "Money & Business", desc: "Abundance blocks, wealth consciousness, and building a business aligned with your chart.", bg: "var(--gold)" },
              { title: "Confidence", desc: "Self-worth, visibility, putting yourself out there, and why you keep playing small.", bg: "var(--pink-light)" },
              { title: "Relationships", desc: "Synastry, attachment styles, boundaries, and what your Venus is actually trying to tell you.", bg: "var(--cream)" },
              { title: "Guest Experts", desc: "Astrologers, coaches, therapists, and women who are living proof that transformation works.", bg: "var(--mint)" },
              { title: "Healing", desc: "Shadow work, inner child, subconscious rewiring, and making peace with the parts of yourself you hid.", bg: "var(--lav-light)" },
            ].map((card) => (
              <div
                key={card.title}
                className="p-8"
                style={{ background: card.bg, border: "var(--border)", marginRight: -1.5, marginBottom: -1.5 }}
              >
                <div style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.3px" }}>
                  {card.title}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--grey)", margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Membership CTA */}
      <div className="px-8 py-14 text-center" style={{ background: "var(--dark)", borderTop: "var(--border)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
          love the podcast? go deeper.
        </div>
        <h2 style={{ fontFamily: pp, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
          Join the MY SZN membership.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 auto 8px" }}>
          Everything from the podcast, taken to the next level. A live masterclass and astrotapping every month, subconscious rewiring and community. Go VIP and you get a 1:1 coaching call with Betty on top.
        </p>
        <p style={{ fontSize: 12, color: "var(--pink)", fontWeight: 700, marginBottom: 20 }}>
          From $88/mo · Cancel anytime · 1:1 coaching on VIP, $555/mo
        </p>
        <a href={FREE_TRIAL_CTA.href} style={{
          display: "inline-block", background: "var(--pink)", color: "var(--dark)",
          fontFamily: pp, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "14px 32px", textDecoration: "none",
        }}>
          {FREE_TRIAL_CTA.label}
        </a>
      </div>
    </>
  );
}
