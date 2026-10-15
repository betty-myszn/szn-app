import type { Metadata } from "next";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferHero, Band, Tiles, ForYouIf, WaitlistBand, OfferCards, Cover } from "@/components/Offer";

// Rich B*tch Rising: the personalised money report (the Money Blueprint, renamed and repriced to
// $88, Oct 2026). Waitlist only until Betty reopens it; /money-blueprint redirects here.

export const metadata: Metadata = {
  title: "Rich B*tch Rising, Your Personalised Astrology Money Report",
  description:
    "Rich B*tch Rising is your personalised astrology money report: wealth, earning potential, money blocks, financial independence and self-worth, read from your own birth chart. $88. Join the waitlist.",
  alternates: { canonical: "/reports/rich-btch-rising" },
  openGraph: {
    title: "Rich B*tch Rising 💸",
    description: "What your birth chart says about getting PAID. Your personalised money report, waitlist open now.",
    url: "/reports/rich-btch-rising",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RichBtchRisingPage() {
  return (
    <>
      <OfferHero
        offer="rich-btch-rising"
        art={<Cover kind="rich-btch-rising" />}
        kicker="rich b*tch rising · personalised money report"
        title="your chart wants"
        accent="you RICH, babe."
        intro={
          <p>
            Rich B*tch Rising is your personalised money report, read from your exact birth chart, so you finally understand how YOU are built to make money, keep it, grow it and spend it on a life that makes you giddy, without anyone else&apos;s permission and definitely without asking a man for his card.
          </p>
        }
      />

      <Band tag="what's inside" title="your money," accent="decoded.">
        <p>
          Every page is written for your placements specifically, so instead of a vague horoscope about abundance you get the actual wiring behind your earning power, the patterns that keep your bank balance on a rollercoaster and the exact places your chart is practically BEGGING you to charge more.
        </p>
        <Tiles
          items={[
            { emoji: "💸", title: "Wealth + earning potential", body: "Where the money is written in your chart, the work that pays you best and the style of earning that actually feels like you." },
            { emoji: "🔓", title: "Money blocks", body: "The inherited stories, good-girl rules and old fears that make you undercharge, overgive or panic-spend, named so you can stop obeying them." },
            { emoji: "👑", title: "Self-worth", body: "What your chart says about how you value yourself, because what you believe you're worth has a funny habit of showing up on your invoices." },
            { emoji: "🗝️", title: "Financial independence", body: "Your path to your OWN money, your own choices and a life nobody gets to hold over you, ever." },
          ]}
        />
      </Band>

      <Band tone="lav" tag="this is for you if" title="you're done being" accent="broke + polite.">
        <ForYouIf
          items={[
            "You're SOOOO talented and somehow still not paid like it",
            "You were raised to be grateful for whatever you're offered, and you're over it",
            "Money talk makes you squirm, and you want to love it instead",
            "You want your own money, your own rules and your own very nice handbag",
            "You love astrology and want it to be useful for your bank account too",
          ]}
        />
      </Band>

      <QuoteStrip ids={["jade", "maya", "zara"]} label="what happens when baddies get paid" />

      <WaitlistBand
        offer="rich-btch-rising"
        title="get on the"
        accent="rich list."
        body={
          <p>
            Rich B*tch Rising is $88 and it&apos;s waitlist only right now, so pop your details in (your birth details too, so your report is ready the second it opens) and you&apos;ll be the very first to hear when it does.
          </p>
        }
      />

      <OfferCards exclude="rich-btch-rising" />
    </>
  );
}
