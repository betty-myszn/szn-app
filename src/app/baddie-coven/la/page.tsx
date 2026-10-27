import type { Metadata } from "next";
import Link from "next/link";
import { OfferHero, Band, Tiles, WaitlistBand, HeroArt } from "@/components/Offer";

// The LA Baddie Coven: the coven in real life, in Los Angeles. Waitlist only. Separate price from the
// online coven and women can join both; no price, date, venue or frequency is confirmed, so none is
// printed. The "night in the coven" section describes the feel of a gathering, not a fixed agenda.

export const metadata: Metadata = {
  title: "The LA Baddie Coven, an In-Person Coven for Women in Los Angeles",
  description:
    "The Baddie Coven in real life: candlelit rituals, astrology, manifestation and a crew of ambitious, witchy women in Los Angeles. Join the LA waitlist for dates, location and price first.",
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

// What a gathering feels like, start to finish. The format gets shaped with the waitlist.
const NIGHT = [
  ["🕯️", "You walk in", "Candles lit, music on, and somebody tells you your outfit is EVERYTHING before you've even put your bag down."],
  ["🪐", "The sky, decoded", "We get into what this month's astrology means for each of us, charts out, so you finally understand why your life has felt so Scorpio lately."],
  ["🔮", "The ritual", "Whatever the moon is doing, we work with it together, setting intentions, releasing what's done and calling in the next version of your life."],
  ["💬", "The circle", "You say the scary dream out loud to a room full of women who believe you, and they hold you to it. Lovingly. Relentlessly."],
  ["🥂", "The celebrating", "Wins get screamed about, money moves get toasted and every glow up in the room gets the reaction it deserves."],
  ["💞", "You leave with your people", "New best friends, a group chat that never sleeps and plans for brunch that ACTUALLY happen."],
];

// Who it's for: she should recognise herself in at least three of these.
const FIT = [
  "🌴 You live in LA (or close enough) and you're craving friendships that go deeper than \"we should totally hang out sometime\".",
  "🪐 You've got your Big Three memorised and you're DYING to talk about your chart with women who actually care.",
  "💸 You're ambitious, you want serious money and you're done apologising for either.",
  "🔮 You're witchy, or witch-curious, and you'd love to do rituals with other women instead of alone in your bathroom.",
  "🪩 You want your social life to make you feel MORE like yourself, not less.",
  "💅 You're ready for a room full of baddies who'll hype your wins as loudly as their own.",
];

// The practical bits. Nothing here promises a date, venue, price or frequency that isn't set.
const FAQS = [
  ["When is the first gathering?", "Our first LA astrology dinner is happening in Sagittarius season. The date and the details go to the LA waitlist first, so put your name down to grab a seat before anyone else."],
  ["Where in LA will it be?", "The venue goes to the LA waitlist first, so put your name down and you'll be the first to know where we're gathering."],
  ["How often will we meet?", "We're shaping the LA coven with the women on the waitlist, so tell us what you'd love when you sign up, because it genuinely decides how this works."],
  ["Can I come on my own?", "YESSS, and most women will. You'll walk in solo and leave with a whole crew, that's kind of the point."],
  ["Do I need to know astrology or witchcraft?", "Not even a little. Total beginners are welcome, and the women who've been doing this for years love helping you figure out your chart."],
  ["How much will it cost?", "Pricing isn't confirmed yet, and the LA waitlist hears it before anybody else does."],
  ["Can I join the online coven too?", "You can join one or BOTH. They're priced separately, and plenty of LA baddies will want the online magic all month with the IRL gatherings on top."],
];

const card = { border: "2px solid var(--dark)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" } as const;

export default function LaCovenPage() {
  return (
    <>
      <OfferHero
        offer="baddie-coven-la"
        art={<HeroArt src="/disco-planet.png" />}
        tone="pink"
        kicker="the coven, IRL in LA"
        title="your coven,"
        accent="IRL in LA."
        intro={
          <>
            <p style={{ margin: "0 0 12px" }}>Bring your chart, your best outfit and your biggest dreams.</p>
            <p style={{ margin: 0, fontWeight: 500 }}>The LA Baddie Coven is where ambitious, witchy, slightly unhinged women in Los Angeles get together in real life to do rituals, decode their astrology, manifest outrageous things and become each other&apos;s favourite people.</p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 20 }}>
              {["🌴 los angeles", "🕯️ candlelit rituals", "🪐 astrology IRL", "💸 money magic", "🪩 your girls"].map((t) => (
                <span key={t} className="holo-sticker">{t}</span>
              ))}
            </div>
            {/* The first IRL event. No date or venue yet, so the waitlist is the way in. */}
            <div className="holo-edge" style={{ marginTop: 22, background: "#fff", border: "2px solid var(--dark)", borderRadius: 16, padding: "16px 20px", maxWidth: 620, color: "var(--dark)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>🍽️ Our first LA astrology dinner is happening in Sagittarius season.</div>
              <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>Charts out, candles lit and a table full of baddies you&apos;re about to be obsessed with. Details are coming soon, so get on the waitlist to be the first to hear and grab your seat.</p>
            </div>
          </>
        }
      />

      <Band tag="sound familiar" title="you're growing. your social life" accent="hasn't caught up.">
        <p>You&apos;re the one in the group chat who wants to talk about Saturn returns, money spells and the life you&apos;re building, while everyone else wants to talk about what they watched last night.</p>
        <p>You love your friends, but sooo many of your biggest dreams have nowhere to go, and you&apos;re craving women who want the same BIG, wild, abundant life you do.</p>
        <p><strong>The LA coven is the room you&apos;ve been looking for: women who get your ambition, your weirdness and your magic, and who show up for all of it in person.</strong></p>
      </Band>

      <Band tone="lav" wide tag="what actually happens" title="a night in" accent="the LA coven.">
        <p>Every gathering is its own kind of magic, and here&apos;s the feeling we&apos;re building, from the moment you walk in to the moment you leave with a whole new crew.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 26 }}>
          {NIGHT.map(([e, t, b], i) => (
            <div key={t} className="holo-edge" style={card}>
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, border: "2px solid var(--dark)", borderRadius: 999, width: 30, height: 30, display: "grid", placeItems: "center", background: "var(--pink)", color: "#fff", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 26 }}>{e}</span>
              </div>
              <div style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, lineHeight: 1.2, margin: "12px 0 6px" }}>{t}</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{b}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 22 }}><strong>The exact format gets shaped with the women on the LA waitlist, so your sign-up genuinely helps decide what we do together.</strong></p>
      </Band>

      <Band wide tag="you'll fit right in if" title="this coven has your name" accent="ALL over it.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 26 }}>
          {FIT.map((f) => {
            const [emoji, ...rest] = f.split(" ");
            return (
              <div key={f} className="flex items-start gap-3" style={{ ...card, padding: "16px 18px", background: "var(--pink-light)" }}>
                <span aria-hidden="true" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 7, border: "2px solid var(--dark)", background: "var(--pink)", color: "#fff", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 800 }}>✓</span>
                <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, fontWeight: 600 }}>{rest.join(" ")} {emoji}</p>
              </div>
            );
          })}
        </div>
      </Band>

      <Band tone="pinkLight" wide tag="online + IRL" title="one coven," accent="two ways in.">
        <p>The Baddie Coven lives online, so witchy women everywhere can join from their sofa, and in Los Angeles we&apos;re bringing it into real life too.</p>
        <Tiles
          tone="pinkLight"
          items={[
            {
              emoji: "💻",
              title: "The online coven",
              body: (
                <>
                  <p style={{ margin: "0 0 10px" }}>One live coven circle a month, your personalised platform with the astrology of the month, astrotapping™, moon rituals and shadow work prompts, and the coven chat rooms, from anywhere in the world.</p>
                  <Link href="/baddie-coven" style={{ color: "var(--pink)", fontWeight: 800, textDecoration: "underline" }}>see the online coven →</Link>
                </>
              ),
            },
            {
              emoji: "🌴",
              title: "The LA coven (IRL)",
              body: <p style={{ margin: 0 }}>In-person gatherings in Los Angeles: rituals done together, astrology talk over snacks and real-life friendships with women who get your particular brand of weird.</p>,
            },
          ]}
        />
        <p style={{ marginTop: 24 }}><strong>They&apos;re priced separately, and you can join one or BOTH.</strong></p>
      </Band>

      <Band wide tag="faqs" title="a few witchy" accent="details.">
        <div className="grid gap-3" style={{ marginTop: 26, maxWidth: 820 }}>
          {FAQS.map(([q, a]) => (
            <details key={q} style={{ ...card, padding: "16px 20px" }}>
              <summary style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>{q}</summary>
              <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.65 }}>{a}</p>
            </details>
          ))}
        </div>
      </Band>

      <WaitlistBand
        offer="baddie-coven-la"
        title="the LA coven"
        accent="is calling. 🌴"
        body={
          <>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Your future best friends are already in LA, babe.</p>
            <p style={{ margin: "0 0 14px" }}>Put your name down and you&apos;ll hear the dates, the location and the price before anybody else, and you can join the online coven too whenever it opens.</p>
            <p style={{ margin: 0, fontFamily: pp, fontWeight: 800, color: "#fff" }}>See you in real life, witch. 💜</p>
          </>
        }
        question="What would you love to do together IRL?"
      />
    </>
  );
}
