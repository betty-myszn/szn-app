import type { Metadata } from "next";
import Link from "next/link";
import { SEASON_PAGES } from "@/lib/season-pages";
import { OG_IMAGE } from "@/lib/site";
import DoorButton from "@/components/DoorButton";
import { sznTheme } from "@/lib/szn-themes";

// The MY SZN year as four three-month chapters. Q4 2026 is Betty's designed chapter (from
// src/lib/szn-themes.ts); the 2027 chapters carry working titles and the season lessons from the
// membership page until each one is designed.
const q4 = (sign: string, slug: string) => {
  const t = sznTheme(sign);
  return { slug, name: t.name, core: t.coreIdea, about: t.about };
};
const CHAPTER_YEAR = [
  {
    id: "q4-2026",
    quarter: "oct to dec 2026",
    now: true,
    title: "become her before 2027.",
    pitch: "Don't wait until January. We love ourselves enough to want more, heal the shadow and claim our power, then go after our biggest life, so we walk into 2027 already moving.",
    seasons: [q4("Libra", "libra"), q4("Scorpio", "scorpio"), q4("Sagittarius", "sagittarius")],
  },
  {
    id: "q1-2027",
    quarter: "jan to mar 2027",
    now: false,
    title: "build it, free it, enchant it.",
    pitch: "The first chapter of 2027 starts at the solstice, ten days before everyone else's resolutions: we build the life like a CEO, break every rule that was never ours, then let the magic in.",
    seasons: [
      { slug: "capricorn", name: "Capricorn SZN", core: "Ambition.", about: "The season you become the CEO of your own life. Build the plan. Set the scary goals. Execute like a boss." },
      { slug: "aquarius", name: "Aquarius SZN", core: "Revolution.", about: "The season you break every rule that was never yours to follow and build your own lane, so unapologetically yourself that the world makes room." },
      { slug: "pisces", name: "Pisces SZN", core: "Surrender.", about: "The season you stop forcing and start flowing, trusting your intuition louder than your overthinking and letting the universe lead for once." },
    ],
  },
  {
    id: "q2-2027",
    quarter: "apr to jun 2027",
    now: false,
    title: "start it, fund it, say it.",
    pitch: "A brand new zodiac year: we take the bold first move, learn to receive like we mean it, then use our voice to get seen and get paid.",
    seasons: [
      { slug: "aries", name: "Aries SZN", core: "Courage.", about: "The season you stop asking for permission and start taking what's yours. Bold moves only." },
      { slug: "taurus", name: "Taurus SZN", core: "Receiving.", about: "The season you stop hustling for scraps and start letting abundance in: money, pleasure and self-worth." },
      { slug: "gemini", name: "Gemini SZN", core: "Expression.", about: "The season you find your voice and use it: communication, magnetism and becoming the woman everyone wants at the table." },
    ],
  },
  {
    id: "q3-2027",
    quarter: "jul to sep 2027",
    now: false,
    title: "root it, shine it, systemise it.",
    pitch: "We come home to ourselves, step fully into main character energy, then build the systems and standards that make the whole life hold.",
    seasons: [
      { slug: "cancer", name: "Cancer SZN", core: "Nurturing.", about: "The season you heal the inner child and come home to yourself, with fierce boundaries and learning to mother yourself the way you always needed." },
      { slug: "leo", name: "Leo SZN", core: "Visibility.", about: "The season you stop hiding and start shining. Main character energy activated, no more dimming your light for anyone." },
      { slug: "virgo", name: "Virgo SZN", core: "Standards.", about: "The season you raise the bar so high that settling becomes impossible, with systems, rituals, health and habits that make success inevitable." },
    ],
  },
];

const pp = "var(--font-poppins), Poppins, sans-serif";

// The hub the twelve sign pages were missing. Without it they had no parent to be linked from, so
// nothing on the site pointed at them and they collected no internal link equity.
export const metadata: Metadata = {
  title: "The MY SZN Year: Zodiac Seasons in Three-Month Chapters",
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

      {/* Hero: the MY SZN year, sold. */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", marginBottom: 22 }}>
            the my szn year · four chapters · twelve seasons
          </div>
          <h1 className="display" style={{ fontSize: "clamp(40px, 7vw, 86px)", color: "var(--dark)", lineHeight: 0.98 }}>
            every three months,
            <br />
            <span style={{ color: "#fff" }}>a new version of you.</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.7, color: "var(--dark)", fontWeight: 600, maxWidth: 760, marginTop: 28 }}>
            MY SZN runs in three-month chapters that follow the zodiac. Every chapter has one destination and three seasons that build on each other, so instead of starting over every January you become her in quarters, with your own chart, your Human Design and a room full of women locking in at the same time as you.
          </p>
          <DoorButton />
        </div>
      </section>

      {/* How a chapter works: cardinal, fixed, mutable. */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">how every chapter works</div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 58px)", color: "var(--dark)", lineHeight: 1 }}>
            three seasons, <span className="pk">one destination.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 34 }}>
            {[
              { n: "month 1", h: "decide who you're becoming", b: "Every chapter opens on a cardinal season, the zodiac's starting gun. You choose your destination, finish the sentence \"I'm becoming a woman who…\", and start moving." },
              { n: "month 2", h: "go deep and hold the line", b: "The middle season is a fixed sign, so this is where the real work happens: the shadow work, the patterns, the boundaries and the beliefs that would otherwise drag you straight back to who you were." },
              { n: "month 3", h: "expand, then keep going", b: "The chapter closes on a mutable season, built for expansion. You go bigger, look back at what actually changed, and carry all of it into the next chapter." },
            ].map((x) => (
              <div key={x.n} style={{ border: "var(--border)", borderRadius: 18, padding: "22px 22px 24px", background: "var(--lav-light)" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>{x.n}</div>
                <div style={{ fontFamily: pp, fontSize: 21, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.15, marginBottom: 10 }}>{x.h}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>{x.b}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", marginTop: 26, maxWidth: 760 }}>
            Every season has one live Transformation Workshop, one live Community Circle and a SZN hypnosis, and the doors open for just three days at the start of each season so every intake starts together.
          </p>
        </div>
      </section>

      {/* The four chapters. */}
      {CHAPTER_YEAR.map((c, ci) => (
        <section key={c.id} className="px-5 md:px-8" style={{ background: ci % 2 === 0 ? "var(--pink-light)" : "#fff", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="tag">{c.quarter}</span>
              {c.now && (
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "var(--pink)", padding: "5px 10px", borderRadius: 999 }}>
                  happening now
                </span>
              )}
            </div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 60px)", color: "var(--dark)", lineHeight: 1 }}>
              {c.title}
            </h2>
            <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7, color: "var(--dark)", fontWeight: 600, marginTop: 16, maxWidth: 760 }}>
              {c.pitch}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 30 }}>
              {c.seasons.map((z, zi) => {
                const sp = SEASON_PAGES[z.slug];
                return (
                  <Link key={z.slug} href={`/seasons/${z.slug}`} className="no-underline" style={{ display: "block", border: "var(--border)", borderRadius: 18, padding: "22px 22px 24px", background: "#fff", color: "var(--dark)" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>
                      {`month ${zi + 1} · ${sp?.name ?? z.slug} szn · ${sp?.dates ?? ""}`}
                    </div>
                    <div style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 8 }}>
                      {sp?.emoji} {z.name}
                    </div>
                    <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{z.core}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>{z.about}</p>
                  </Link>
                );
              })}
            </div>
            {c.now && <DoorButton />}
          </div>
        </section>
      ))}

      {/* How the seasons work, the SEO context. */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{ fontFamily: pp, fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 24 }}>
            How the zodiac <span className="pk">seasons</span> work.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)", marginBottom: 20 }}>
            A zodiac season lasts roughly thirty days and begins when the sun enters that sign, and it affects everyone, whatever your sun sign, because the sun is moving through it for all of us at once.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)", margin: 0 }}>
            Every quarter of the year opens on a cardinal sign (Aries, Cancer, Libra, Capricorn) that starts things, moves through a fixed sign (Taurus, Leo, Scorpio, Aquarius) that builds and deepens them, and closes on a mutable sign (Gemini, Virgo, Sagittarius, Pisces) that expands and transforms them. That rhythm is exactly why MY SZN works in three-month chapters.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 72px)", color: "var(--dark)", lineHeight: 1 }}>
            lock in for the <span style={{ color: "#fff" }}>next chapter.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--dark)", fontWeight: 600, marginTop: 20 }}>
            The founding price goes to the waitlist first, and it's going up after the founding cohort.
          </p>
          <DoorButton center />
        </div>
      </section>
    </div>
  );
}
