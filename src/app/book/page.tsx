import type { Metadata } from "next";
import { OfferHero, Band, Tiles, WaitlistBand, OfferCards, Cover } from "@/components/Offer";

// The MY SZN Book: coming soon. Register-your-interest only. No title, date or publisher is
// confirmed, so the page names none of them.

export const metadata: Metadata = {
  title: "The MY SZN Book, Coming Soon",
  description:
    "The MY SZN book is coming: becoming your future self through astrology, manifestation, self-concept, confidence, healing, money and creating your dream life. Register your interest.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "The MY SZN Book 📚",
    description: "Becoming your future self, in print. Coming soon, register your interest.",
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
        art={<Cover kind="book" />}
        tone="dark"
        kicker="the my szn book · coming soon"
        title="becoming her,"
        accent="in print."
        intro={
          <p>
            OMGGGG, there&apos;s a book coming, a whole entire book about becoming your future self through astrology, manifestation and a LOT of self-love, written for every woman who knows deep down she&apos;s meant for a bigger, richer, wilder life than the one she was handed.
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

      <WaitlistBand
        offer="book"
        title="be first"
        accent="in line."
        body={
          <p>
            Register your interest and you&apos;ll be the first to know the moment there&apos;s a cover to swoon over, a date to circle and a way to get your hands on a copy.
          </p>
        }
      />

      <OfferCards exclude="book" />
    </>
  );
}
