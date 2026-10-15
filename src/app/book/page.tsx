import type { Metadata } from "next";
import { OfferHero, Band, Tiles, OfferCards } from "@/components/Offer";
import { BOOK_PAPERBACK_URL, BOOK_EBOOK_URL } from "@/lib/offers";

const pp = "var(--font-poppins), Poppins, sans-serif";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

// The MY SZN Book: out now on Amazon in paperback and as an ebook. Sold directly, no waitlist.

export const metadata: Metadata = {
  title: "The MY SZN Book by Betty Andrews, Paperback + Ebook on Amazon",
  description:
    "The MY SZN book by Betty Andrews: becoming your future self through astrology, manifestation, self-concept, confidence, healing, money and creating your dream life. Out now on Amazon in paperback and Kindle ebook.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "The MY SZN Book by Betty Andrews 📚",
    description: "Becoming your future self, in print. Out now on Amazon in paperback and ebook.",
    url: "/book",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function BookPage() {
  return (
    <>
      <OfferHero
        offer="book"
        art={
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/myszn-book-cover.jpg" alt="MY SZN by Betty Andrews, book cover" style={{ width: "min(340px, 78vw)", height: "auto", border: "var(--border)", borderRadius: 6, transform: "rotate(-3deg)", boxShadow: "10px 12px 0 var(--pink)" }} />
        }
        tone="dark"
        ctaHref={BOOK_PAPERBACK_URL}
        extraCta={
          <a href={BOOK_EBOOK_URL} {...ext} className="no-underline" style={{ border: "2px solid #fff", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px", display: "inline-block" }}>
            get the ebook
          </a>
        }
        kicker="the my szn book · out now on amazon"
        title="the my szn book"
        accent="by betty andrews."
        intro={
          <p>
            OMGGGG, the MY SZN book is OUT, a whole entire book about becoming your future self through astrology, manifestation and a LOT of self-love, written for every woman who knows deep down she&apos;s meant for a bigger, richer, wilder life than the one she was handed.
          </p>
        }
      />

      <Band tag="what it's about" title="your dream life," accent="chapter by chapter.">
        <Tiles
          items={[
            { emoji: "🪐", title: "Astrology", body: "Your chart as the map of who you're here to become." },
            { emoji: "✨", title: "Manifestation + self-concept", body: "Becoming the woman who already has it, from the inside out." },
            { emoji: "💖", title: "Confidence + healing", body: "Letting go of the old stories and backing yourself completely." },
            { emoji: "💸", title: "Money + your dream life", body: "Building a life (and a bank balance) you're OBSESSED with." },
          ]}
        />
      </Band>

      <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92 }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
            get your hands
            <br />
            <span className="pk">on it.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.85)", marginTop: 22, fontWeight: 500 }}>
            The MY SZN book is out now on Amazon, so grab the paperback for your bedside table (and your highlighters) or the ebook for your Kindle, and start becoming HER tonight.
          </p>
          <div className="flex flex-wrap justify-center gap-4" style={{ marginTop: 30 }}>
            <a href={BOOK_PAPERBACK_URL} {...ext} className="no-underline" style={{ background: "var(--pink)", color: "#fff", display: "inline-block", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "22px 40px" }}>get the paperback</a>
            <a href={BOOK_EBOOK_URL} {...ext} className="no-underline" style={{ border: "2px solid #fff", color: "#fff", display: "inline-block", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "22px 40px" }}>get the ebook</a>
          </div>
        </div>
      </section>

      <OfferCards exclude="book" />
    </>
  );
}
