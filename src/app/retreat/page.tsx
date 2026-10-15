import type { Metadata } from "next";
import { OfferHero, Band, Tiles, ForYouIf, WaitlistBand, OfferCards, HeroArt } from "@/components/Offer";

// The Bad B*tch Retreat: the in-person experience. Waitlist only. No location, dates or price are
// confirmed, so the page never names any of them; they go to the waitlist first.

export const metadata: Metadata = {
  title: "The Bad B*tch Retreat, an In-Person Astrology + Embodiment Retreat for Women",
  description:
    "The Bad B*tch Retreat is MY SZN's immersive in-person experience: body, sensuality, creativity, confidence, sexuality, shadow, personal power and self-love, through astrology, embodiment, movement, ritual and sisterhood. Join the waitlist.",
  alternates: { canonical: "/retreat" },
  openGraph: {
    title: "The Bad B*tch Retreat 🌴",
    description: "In real life, all of you. Astrology, embodiment, ritual and sisterhood. Waitlist open now.",
    url: "/retreat",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RetreatPage() {
  return (
    <>
      <OfferHero
        offer="retreat"
        art={<HeroArt src="/cosmic-planet.png" />}
        kicker="the bad b*tch retreat · in real life"
        title="all of you,"
        accent="in real life."
        intro={
          <p>
            The Bad B*tch Retreat is an immersive, in-person experience where we explore every single part of ourselves, the soft parts, the wild parts, the parts we were taught to hide, and come home to our bodies, our power and a love for ourselves that nobody can talk us out of.
          </p>
        }
      />

      <Band tag="what we explore" title="every part" accent="of HER.">
        <p>
          Women have spent centuries being told which parts of themselves are acceptable, so for these days together we&apos;re throwing that whole rulebook in the fire and getting reacquainted with all of it, through astrology, embodiment, movement, creativity, ritual and sisterhood.
        </p>
        <Tiles
          tone="white"
          items={[
            { emoji: "💃", title: "Your body + sensuality", body: "Movement and embodiment that bring you back into your body and out of your overthinking head." },
            { emoji: "🔥", title: "Confidence + sexuality", body: "Your desire, your pleasure and your confidence, explored with zero shame and a LOT of permission." },
            { emoji: "🌑", title: "Shadow + personal power", body: "Ritual and shadow work to meet the parts you've hidden and claim the power they've been holding." },
            { emoji: "🎨", title: "Creativity + self-love", body: "Making, playing and falling wildly in love with yourself, surrounded by women doing exactly the same." },
          ]}
        />
      </Band>

      <Band tone="lav" tag="this is for you if" title="you're craving" accent="something real.">
        <ForYouIf
          items={[
            "You want to feel at home in your body, really feel it, for once",
            "You're ready to drop the good-girl act and meet the woman underneath",
            "You want sisterhood that holds you through the deep stuff and the ridiculous stuff",
            "You love astrology and ritual and want to experience them with your whole body",
          ]}
        />
      </Band>

      <WaitlistBand
        offer="retreat"
        title="save me"
        accent="a spot."
        body={
          <p>
            Where we&apos;re going, when we&apos;re going and every juicy detail goes to the waitlist first, so put your name down and you&apos;ll hear it before anyone else does.
          </p>
        }
      />

      <OfferCards exclude="retreat" />
    </>
  );
}
