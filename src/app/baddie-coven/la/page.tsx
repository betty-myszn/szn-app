import type { Metadata } from "next";
import Image from "next/image";
import { Band, WaitlistBand } from "@/components/Offer";
import BaddieBrunch, { BRUNCH_FAQS } from "@/components/BaddieBrunch";
import BrunchMagicBand from "@/components/BrunchMagicBand";

// The LA Bad B*tch Coven, the coven in real life in Los Angeles, with the Baddie Brunch sitting right
// on this page (Betty, 17 Nov 2026). The in-person coven is $88/month (founding price, going up):
// EVERYTHING in the online coven plus a free place at one Baddie Brunch every month. Extra dinners,
// workshops and special events are booked separately. The $44 online coven does NOT include the
// brunch: those members pay the $49 ticket or upgrade. Voice follows Betty's launch caption.

export const metadata: Metadata = {
  title: "The Baddie Brunch LA, Saturday 5th of December at Bacari Silver Lake | The LA Bad B*tch Coven",
  description:
    "The Baddie Brunch, Sagittarius season edition: Saturday 5th of December at Bacari Silver Lake, hosted by Sublime Luv. Brunch, manifesting, new friends and your own printed astrology guide. $49, no membership needed.",
  alternates: { canonical: "/baddie-coven/la" },
  openGraph: {
    title: "The LA Bad B*tch Coven + The Baddie Brunch 🪩",
    description: "Saturday 5th of December at Bacari Silver Lake. $49, anyone can come, no membership needed.",
    url: "/baddie-coven/la",
    type: "website",
    images: [{ url: "/events/bacari/patio-fire-pit.jpg", width: 1600, height: 1066, alt: "The patio at Bacari Silver Lake, home of the first LA Baddie Brunch" }],
  },
  twitter: { card: "summary_large_image", images: ["/events/bacari/patio-fire-pit.jpg"] },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

// What a gathering feels like, start to finish.
const NIGHT = [
  ["🕯️", "You walk in", "Candles lit, music on, and somebody tells you your outfit is EVERYTHING before you've even put your bag down."],
  ["🪐", "The sky, decoded", "We get into what this month's astrology means for each of us, charts out, so you finally understand why your life has felt so Scorpio lately."],
  ["🔮", "The magic", "Manifestation, journaling and intention setting, calling in the next version of your life together."],
  ["💬", "The circle", "You say the scary dream out loud to a table of women who believe you, and they hold you to it. Lovingly. Relentlessly."],
  ["🥂", "The celebrating", "Wins get screamed about, money moves get toasted and every glow up at the table gets the reaction it deserves."],
  ["💞", "You leave with your people", "New best friends, a group chat that never sleeps and plans that ACTUALLY happen."],
];

// Who it's for: she should recognise herself in at least three of these.
const FIT = [
  "🌴 You live in LA (or close enough) and you're craving friendships that go deeper than \"we should totally hang out sometime\".",
  "🪐 You've got your Big Three memorised and you're DYING to talk about your chart with women who actually care.",
  "💸 You're ambitious, you want serious money and you're done apologising for either.",
  "✈️ You want to travel the world, build the business, write the book and charge MORE.",
  "🪩 You want your social life to make you feel MORE like yourself, not less.",
  "💅 You're ready for a table full of baddies who'll hype your wins as loudly as their own.",
];

const FAQS: [string, string][] = [
  ["Do I have to join anything to come to the brunch?", "Not at all, babe. Anyone can grab a $49 ticket for the Baddie Brunch, no membership and nothing to cancel."],
  ["When is the first Baddie Brunch?", "Saturday 5th of December, 11:30am to 1:30pm, hosted by Sublime Luv, our LA Head Baddie. Tickets are $49 and booking closes Sunday 29th of November."],
  ["Where in LA is it?", "The first Baddie Brunch is at Bacari Silver Lake, 3626 Sunset Blvd, on their gorgeous tree-shaded patio."],
  ["Will there be more?", "YESSS. This is the first LA Baddie Brunch, and there'll be one every season, plus dinners, workshops and magical gatherings. Join the LA list at the bottom of this page to hear first."],
  ...BRUNCH_FAQS,
  ["Can I come on my own?", "YESSS, and most women will. You'll walk in solo and leave with a whole crew, that's kind of the point."],
  ["Do I need to know astrology or witchcraft?", "Not even a little. Total beginners are welcome, and the women who've been doing this for years love helping you figure out your chart."],
];

const card = { border: "2px solid var(--dark)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" } as const;

export default function LaCovenPage() {
  return (
    <>
      {/* The brunch opens the page (Betty, 23 Nov 2026): the event and the $49 ticket anyone can buy come
          first. Ticket only from 25 Nov 2026 (Betty): no membership pitch on this page until after the brunch. */}
      <BaddieBrunch
        hero
        afterHero={
          /* Sublime, the LA Head Baddie, straight after the hero (Betty, 25 Nov 2026): she answers "who
             will I talk to if I come alone?". Bio from her own DM to Betty, 18 Nov 2026. */
          <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 80 }}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-14 items-center">
              <div className="grid grid-cols-2 gap-4 items-start">
                <div style={{ border: "2px solid var(--dark)", borderRadius: 22, overflow: "hidden", transform: "rotate(-2deg)", boxShadow: "8px 8px 0 var(--pink)" }}>
                  <Image src="/coven/la/sublime-2.jpg" alt="Sublime Luv in a white ruffled dress and a crystal crown, surrounded by greenery" width={1080} height={1350} sizes="(max-width: 768px) 50vw, 340px" style={{ display: "block", width: "100%", height: "auto" }} />
                </div>
                <div style={{ border: "2px solid var(--dark)", borderRadius: 22, overflow: "hidden", transform: "rotate(2deg)", marginTop: 40, boxShadow: "8px 8px 0 var(--dark)" }}>
                  <Image src="/coven/la/sublime-1.jpg" alt="Sublime Luv, LA Head Baddie, in a neon top against a painted rainbow wall" width={1080} height={1405} sizes="(max-width: 768px) 50vw, 340px" style={{ display: "block", width: "100%", height: "auto" }} />
                </div>
              </div>
              <div>
                <div className="tag mb-5">your host · our LA head baddie</div>
                <h2 className="display" style={{ fontSize: "clamp(36px, 5.4vw, 64px)", lineHeight: 0.98, color: "var(--dark)" }}>
                  say hiii to <span className="pk">sublime luv.</span>
                </h2>
                <div className="offer-copy" style={{ marginTop: 22, color: "var(--dark)" }}>
                  <p><strong>Sublime is an LA spoken-word and teaching artist, host and community builder who&apos;s spent over a decade bringing people together.</strong></p>
                  <p>She&apos;s famous for turning a room of strangers into a room of friends, so if you&apos;re coming on your own, she&apos;s the first hug at the door and the one who makes sure you never wonder who to talk to. She loves astrology, personal growth and a good conversation, and she&apos;s here to help LA baddies connect, explore and live a little louder. 🔊</p>
                  <p><a href="https://www.instagram.com/queensublimeluv/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>Go give @queensublimeluv some LOVE 💖</a></p>
                </div>
              </div>
            </div>
          </section>
        }
        middle={
          <>
            <BrunchMagicBand city="LA" />

          </>
        }
      />

      <Band tag="sound familiar" title="you're growing. your social life" accent="hasn't caught up.">
        <p>You&apos;re the one in the group chat who wants to talk about Saturn returns, money spells and the life you&apos;re building, while everyone else wants to talk about what they watched last night.</p>
        <p>You want ambitious, witchy, creative, slightly DELULU friends who want BIGGGG F*CKING LIVES too, women who encourage you to book the flight, start the business, write the book, charge MORE and stop being so f*cking sensible.</p>
        <p><strong>BECAUSE BEING SENSIBLE IS BORRRRRING. REAL friendships, REAL conversations and REAL women supporting each other as they build their dream lives, IRL in LA.</strong></p>
      </Band>

      <Band tone="lav" wide tag="what actually happens" title="a gathering with" accent="your LA coven.">
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

      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(38px, 6.5vw, 80px)", color: "var(--dark)", lineHeight: 0.95 }}>
            this is just the
            <br />
            <span style={{ color: "#fff" }}>BEGINNINGGGG.</span>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.65, fontWeight: 600, color: "var(--dark)", marginTop: 22 }}>We&apos;re building real-life Bad B*tch Coven communities around the world, with local Head Baddies bringing women together to make friends, manifest their dreams and create lives that make them ridiculously happy.</p>
          <p style={{ fontFamily: pp, fontSize: "clamp(18px, 2.4vw, 24px)", lineHeight: 1.35, fontWeight: 800, color: "var(--dark)", marginTop: 14 }}>More money. More magic. More female friendships. More BIGGGG F*CKING LIVES.</p>
        </div>
      </section>

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
            <p style={{ margin: "0 0 14px" }}>Not ready to join yet? Put your name down and you&apos;ll hear about every Baddie Brunch and LA gathering before anybody else.</p>
            <p style={{ margin: 0, fontFamily: pp, fontWeight: 800, color: "#fff" }}>See you in real life, witch. 💜</p>
          </>
        }
        question="What would you love to do together IRL?"
      />
    </>
  );
}
