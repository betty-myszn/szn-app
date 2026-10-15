import type { Metadata } from "next";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferHero, Band, Tiles, ForYouIf, WaitlistBand, OfferCards, Cover } from "@/components/Offer";

// The Bad B*tch Report: the personalised confidence report. Waitlist only, no price confirmed yet.

export const metadata: Metadata = {
  title: "The Bad B*tch Report, Your Personalised Astrology Confidence Report",
  description:
    "The Bad B*tch Report is your personalised astrology report on confidence, personal power, visibility, self-expression and boundaries, read from your own birth chart. Join the waitlist.",
  alternates: { canonical: "/reports/bad-btch-report" },
  openGraph: {
    title: "The Bad B*tch Report 💜",
    description: "Your chart decides what KIND of baddie you are. Your personalised confidence report, waitlist open now.",
    url: "/reports/bad-btch-report",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function BadBtchReportPage() {
  return (
    <>
      <OfferHero
        offer="bad-btch-report"
        art={<Cover kind="bad-btch-report" />}
        tone="dark"
        kicker="the bad b*tch report · personalised confidence report"
        title="find out what kind"
        accent="of baddie you are."
        intro={
          <p>
            Every woman has her own flavour of baddie written into her birth chart, so The Bad B*tch Report reads yours, catches the exact moments you shrink yourself to keep everyone comfortable and shows you how to switch your power back ON in a way that feels completely, unapologetically YOU.
          </p>
        }
      />

      <Band tag="what's inside" title="your power," accent="in writing.">
        <p>
          We go through your placements one by one, so the confidence you build is rooted in how you&apos;re actually wired rather than in somebody else&apos;s idea of how a confident woman is supposed to look, sound or behave.
        </p>
        <Tiles
          items={[
            { emoji: "🔥", title: "Confidence + personal power", body: "Where your power lives in your chart, what drains it and the specific moves that turn the volume back up." },
            { emoji: "🪩", title: "Visibility", body: "How you're built to be SEEN, and the old good-girl fears that keep you hiding in the group chat instead of the spotlight." },
            { emoji: "💋", title: "Self-expression", body: "Your voice, your style, your opinions and your way of taking up space, written for your placements." },
            { emoji: "🛡️", title: "Boundaries", body: "Where you overgive, people-please and say yes when you mean absolutely not, plus how your chart likes to hold the line." },
          ]}
        />
      </Band>

      <Band tone="pinkLight" tag="this is for you if" title="you're ready to stop" accent="shrinking.">
        <ForYouIf
          items={[
            "You know you're meant for more and you're TIRED of playing it small",
            "You can hype every friend you have and still struggle to back yourself",
            "You've been called too much, too loud or too ambitious, and you want to be MORE of all three",
            "You're ready to be seen, be paid and be completely unbothered about it",
          ]}
        />
      </Band>

      <QuoteStrip ids={["chloe", "georgia", "lauren"]} label="what taking up space looks like" />

      <WaitlistBand
        offer="bad-btch-report"
        title="claim your"
        accent="baddie era."
        body={
          <p>
            The Bad B*tch Report is waitlist only right now, so add your name and your birth details, and the moment it opens you&apos;ll hear it from us first, before anybody else gets a look in.
          </p>
        }
      />

      <OfferCards exclude="bad-btch-report" />
    </>
  );
}
