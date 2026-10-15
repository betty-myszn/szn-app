import type { Metadata } from "next";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferHero, Band, Tiles, ForYouIf, WaitlistBand, OfferCards, HeroArt } from "@/components/Offer";

// The Baddie Coven: the ongoing creative, cosmic membership (what the MY SZN membership becomes,
// Oct 2026). Waitlist only, no price or start date confirmed; /membership redirects here.

export const metadata: Metadata = {
  title: "The Baddie Coven, a Creative Cosmic Membership for Women",
  description:
    "The Baddie Coven is MY SZN's creative, cosmic membership: monthly creative classes, astrology, manifestation, rituals, witchcraft and a community of women bringing more magic into everyday life. Join the waitlist.",
  alternates: { canonical: "/baddie-coven" },
  openGraph: {
    title: "The Baddie Coven 🦄",
    description: "A magical creative clubhouse for women: classes, astrology, rituals, witchcraft and your girls. Waitlist open now.",
    url: "/baddie-coven",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function BaddieCovenPage() {
  return (
    <>
      <OfferHero
        offer="baddie-coven"
        art={<HeroArt src="/disco-planet.png" />}
        tone="lav"
        kicker="the baddie coven · creative cosmic membership"
        title="welcome to the"
        accent="clubhouse, witch."
        intro={
          <p>
            The Baddie Coven is our creative, cosmic membership for women who want more magic in their everyday lives, a place to make things, cast things, learn things and laugh until it hurts with women who get it, every single month, all year round.
          </p>
        }
      />

      <Band tag="what happens in the coven" title="glitter, spells +" accent="your girls.">
        <p>
          Think of it as the magical clubhouse you always wanted as a little girl, upgraded for a grown woman who runs her own life, makes her own money and has absolutely zero interest in being anybody&apos;s good girl ever again.
        </p>
        <Tiles
          items={[
            { emoji: "🎨", title: "Monthly creative classes", body: "Something new to make, play with and get messy with every month, because creativity is where your magic lives." },
            { emoji: "🪐", title: "Astrology", body: "What the sky is doing and what it means for YOU, so every month has a little cosmic direction." },
            { emoji: "✨", title: "Manifestation", body: "Calling in the money, the love, the adventures and the version of you that makes your younger self SCREAM." },
            { emoji: "🕯️", title: "Rituals + witchcraft", body: "Moon rituals, spells and a little magical mischief, woven into your actual everyday life." },
            { emoji: "💖", title: "Community", body: "Your coven: women who connect, create, cheer each other on and never make you feel too much." },
            { emoji: "🔮", title: "Exploring yourself", body: "Self-discovery that feels like play, so you understand yourself more deeply with every month inside." },
          ]}
        />
      </Band>

      <Band tone="pinkLight" tag="this is for you if" title="you've been looking" accent="for your people.">
        <ForYouIf
          items={[
            "You want more MAGIC in your everyday life, more often",
            "You've got a creative side that's been begging to come out and play",
            "You love astrology, rituals and a little witchy mischief",
            "You want friends who are as obsessed with growing as you are",
            "You're done shrinking to fit into rooms that were never built for you",
          ]}
        />
      </Band>

      <QuoteStrip ids={["aisha", "priya", "lauren"]} label="from inside my szn" />

      <WaitlistBand
        offer="baddie-coven"
        title="the coven"
        accent="is calling."
        body={
          <p>
            The Baddie Coven is waitlist only right now, so pop your name in the book and the doors, the dates and every magical detail land in your inbox before anybody else hears a whisper.
          </p>
        }
        question="What kind of magic do you want more of?"
      />

      <OfferCards exclude="baddie-coven" />
    </>
  );
}
