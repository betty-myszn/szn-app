import type { Metadata } from "next";
import Link from "next/link";
import { OfferHero, Band, Tiles, WaitlistBand, HeroArt } from "@/components/Offer";

// The LA Baddie Coven: the coven in real life, in Los Angeles. Waitlist only. Separate price from the
// online coven and women can join both; no price, date or venue is confirmed, so none is printed.

export const metadata: Metadata = {
  title: "The LA Baddie Coven, an In-Person Coven for Women in Los Angeles",
  description:
    "The Baddie Coven in real life: in-person rituals, creative magic, astrology and your girls in Los Angeles. Join the LA waitlist for dates, location and price first.",
  alternates: { canonical: "/baddie-coven/la" },
  openGraph: {
    title: "The LA Baddie Coven 🌴",
    description: "Your coven, in real life, in Los Angeles. Join the LA waitlist.",
    url: "/baddie-coven/la",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

export default function LaCovenPage() {
  return (
    <>
      <OfferHero
        offer="baddie-coven-la"
        art={<HeroArt src="/disco-planet.png" />}
        tone="pink"
        kicker="the coven, IRL in LA"
        title="the LA"
        accent="baddie coven."
        intro={
          <>
            <p>Everything you love about the Baddie Coven, in the same room: candles lit, charts out, rituals done together and a whole crew of LA witches who will hype you up IN PERSON.</p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 20 }}>
              {["🌴 los angeles", "🕯️ in-person rituals", "🪐 astrology", "🎨 creative magic", "🪩 your girls IRL"].map((t) => (
                <span key={t} className="holo-sticker">{t}</span>
              ))}
            </div>
          </>
        }
      />

      <Band tag="online + IRL" title="one coven," accent="two ways in.">
        <p>The Baddie Coven lives online, so witchy women everywhere can join from their sofa, and in Los Angeles we&apos;re bringing it into real life too.</p>
        <Tiles
          items={[
            {
              emoji: "💻",
              title: "The online coven",
              body: (
                <>
                  <p style={{ margin: "0 0 10px" }}>Monthly creative classes, the astrology of the month, astrotapping™, moon rituals, witchy workshops, shadow work prompts and the coven chat rooms, from anywhere in the world.</p>
                  <Link href="/baddie-coven" style={{ color: "var(--pink)", fontWeight: 800, textDecoration: "underline" }}>see the online coven →</Link>
                </>
              ),
            },
            {
              emoji: "🌴",
              title: "The LA coven (IRL)",
              body: <p style={{ margin: 0 }}>In-person gatherings in Los Angeles: rituals done together, creative magic you can actually touch, astrology talk over snacks and real-life friendships with women who get your particular brand of weird.</p>,
            },
          ]}
        />
        <p style={{ marginTop: 24 }}><strong>They&apos;re priced separately, and you can join one or BOTH.</strong> Plenty of LA baddies will want the online magic all month and the IRL gatherings on top, and that&apos;s exactly how we&apos;ve built it.</p>
      </Band>

      <Band tone="lav" tag="why IRL" title="some magic just hits different" accent="in the same room.">
        <p>There&apos;s something about a circle of women, a table full of candles and somebody gasping at your Venus placement in real time that a screen can&apos;t give you.</p>
        <p>The LA coven is for the women who want their coven to be a place they actually GO, with faces they know, hugs at the door and friendships that spill out into brunch, birthdays and the group chat.</p>
        <p><strong>The dates, the location and the price go to the LA waitlist first.</strong></p>
      </Band>

      <WaitlistBand
        offer="baddie-coven-la"
        title="the LA coven"
        accent="is calling. 🌴"
        body={
          <>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Put your name down for the LA Baddie Coven.</p>
            <p style={{ margin: "0 0 14px" }}>You&apos;ll hear the dates, the location and the price before anybody else, and you can join the online coven too whenever it opens.</p>
            <p style={{ margin: 0, fontFamily: pp, fontWeight: 800, color: "#fff" }}>See you in real life, witch. 💜</p>
          </>
        }
        question="What would you love to do together IRL?"
      />
    </>
  );
}
