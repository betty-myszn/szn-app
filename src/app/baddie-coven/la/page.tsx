import type { Metadata } from "next";
import Image from "next/image";
import { OfferHero, Band, WaitlistBand } from "@/components/Offer";
import { LA_COVEN_CHECKOUT_URL } from "@/lib/events";
import CovenPriceTable from "@/components/CovenPriceTable";
import BaddieBrunch, { BRUNCH_FAQS, UPGRADE_MAIL } from "@/components/BaddieBrunch";

// The LA Bad B*tch Coven, the coven in real life in Los Angeles, with the Baddie Brunch sitting right
// on this page (Betty, 17 Nov 2026). The in-person coven is $88/month (founding price, going up):
// EVERYTHING in the online coven plus a free place at one Baddie Brunch every month. Extra dinners,
// workshops and special events are booked separately. The $44 online coven does NOT include the
// brunch: those members pay the $49 ticket or upgrade. Voice follows Betty's launch caption.

export const metadata: Metadata = {
  title: "The LA Bad B*tch Coven + The Baddie Brunch, an In-Person Coven for Women in Los Angeles",
  description:
    "The Bad B*tch Coven IRL in Los Angeles: EVERYTHING in the online coven plus a free place at one Baddie Brunch every month, for $88 a month. The first Baddie Brunch is Saturday 5th of December, hosted by Sublime Luv, our LA Head Baddie.",
  alternates: { canonical: "/baddie-coven/la" },
  openGraph: {
    title: "The LA Bad B*tch Coven + The Baddie Brunch 🪩",
    description: "Your coven, IRL in LA. The first Baddie Brunch is Saturday 5th of December. Free for in-person coven members, $49 for everyone else.",
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
  ["When is the first Baddie Brunch?", "Saturday 5th of December, 11:30am to 1:30pm, hosted by Sublime Luv, our LA Head Baddie. It's free for in-person coven members and $49 for everyone else."],
  ["Where in LA is it?", "The first Baddie Brunch is at Bacari Silver Lake, 3626 Sunset Blvd, on their gorgeous tree-shaded patio."],
  ["How much is the in-person coven?", "$88 a month, and that's the founding price, so it's going up. You get EVERYTHING inside the online Bad B*tch Coven plus a free place at one Baddie Brunch every month. Extra dinners, workshops and special events are booked separately."],
  ["I'm in the online coven for $44. Is the brunch included?", "Not yet, babe. The $44 online coven covers everything online, and the monthly Baddie Brunch comes with the $88 in-person coven, which includes EVERYTHING online too. Email hello@thecosmicco.com with \"upgrade me to LA\" and we'll switch your plan, so you only ever pay for one membership. Or grab a $49 ticket."],
  ["How often will we meet?", "Every month at the Baddie Brunch, plus extra dinners, workshops, magical gatherings and special events throughout the year, which you can book separately."],
  ...BRUNCH_FAQS,
  ["Can I come on my own?", "YESSS, and most women will. You'll walk in solo and leave with a whole crew, that's kind of the point."],
  ["Do I need to know astrology or witchcraft?", "Not even a little. Total beginners are welcome, and the women who've been doing this for years love helping you figure out your chart."],
];

const card = { border: "2px solid var(--dark)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" } as const;
const tick = <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>;

export default function LaCovenPage() {
  return (
    <>
      <OfferHero
        offer="baddie-coven-la"
        bigArt
        art={
          <div style={{ position: "relative", width: "100%" }}>
            <div className="holo-edge" style={{ width: "100%", borderRadius: 22, overflow: "hidden", boxShadow: "10px 12px 0 var(--dark)", background: "var(--lav-light)" }}>
              <Image src="/coven/la-pink-palms.jpg" alt="Palm trees lining a Los Angeles street under a pink sky" width={1600} height={2400} priority sizes="(max-width: 768px) 100vw, 560px" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <span className="holo-sticker" style={{ position: "absolute", left: -10, bottom: 28, transform: "rotate(-4deg)" }}>🌴 los angeles</span>
          </div>
        }
        tone="pink"
        ctaButton={(s) => <a href={LA_COVEN_CHECKOUT_URL} className="no-underline" style={s}>🌴 join the LA coven · $88/month</a>}
        extraCta={<a href="#brunch" style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, color: "var(--dark)", textDecoration: "underline" }}>see the baddie brunch →</a>}
        kicker="the coven, IRL in LA"
        title="your coven,"
        accent="IRL in LA."
        intro={
          <>
            <p style={{ margin: "0 0 12px", fontFamily: pp, fontWeight: 800 }}>LOS ANGELES BADDIESSSSS 💖🪩💸</p>
            <p style={{ margin: 0, fontWeight: 500 }}>The Bad B*tch Coven is coming to LA, because we want more women making $$$, chasing outrageous dreams and having a group of bad b*tches cheering them on while they do it.</p>
            {/* First screen: what the $88 membership actually is, an ongoing community, not one brunch. */}
            <div style={{ marginTop: 20, background: "#fff", border: "2px solid var(--dark)", borderRadius: 16, padding: "16px 20px", maxWidth: 620, color: "var(--dark)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>🌴 The in-person coven, $88/month:</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", display: "grid", gap: 4, fontSize: 15, lineHeight: 1.5, fontWeight: 600 }}>
                <li>{tick}EVERYTHING inside the online Bad B*tch Coven.</li>
                <li>{tick}A free place at one Baddie Brunch every month.</li>
                <li>{tick}Sublime Luv, our LA Head Baddie, welcoming you in and hosting.</li>
                <li>{tick}Extra dinners, workshops and special events throughout the year, booked separately.</li>
              </ul>
            </div>
            {/* The first brunch, further down this page. */}
            <a href="#brunch" className="holo-edge no-underline" style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 16, background: "#fff", border: "2px solid var(--dark)", borderRadius: 16, padding: 12, maxWidth: 620, color: "var(--dark)" }}>
              <Image src="/events/bacari/patio-fire-pit.jpg" alt="The Bacari Silver Lake patio" width={240} height={160} style={{ width: 110, height: 92, objectFit: "cover", borderRadius: 10, border: "2px solid var(--dark)", flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.25 }}>🪩 The first Baddie Brunch</div>
                <p style={{ margin: "4px 0 0", fontSize: 14.5, lineHeight: 1.5, fontWeight: 600 }}>Saturday 5th of December · 11:30am · Bacari Silver Lake. FREE for in-person coven members, $49 for everyone else. <span style={{ textDecoration: "underline", fontWeight: 800 }}>see the brunch →</span></p>
              </div>
            </a>
          </>
        }
      />

      <Band tag="sound familiar" title="you're growing. your social life" accent="hasn't caught up.">
        <p>You&apos;re the one in the group chat who wants to talk about Saturn returns, money spells and the life you&apos;re building, while everyone else wants to talk about what they watched last night.</p>
        <p>You want ambitious, witchy, creative, slightly DELULU friends who want BIGGGG F*CKING LIVES too, women who encourage you to book the flight, start the business, write the book, charge MORE and stop being so f*cking sensible.</p>
        <p><strong>BECAUSE BEING SENSIBLE IS BORRRRRING. REAL friendships, REAL conversations and REAL women supporting each other as they build their dream lives, IRL in LA.</strong></p>
      </Band>

      <Band tone="pinkLight" wide tag="the in-person coven" title="your coven," accent="irl. 💖">
        <p><strong>For $88/month, you get EVERYTHING inside the online Bad B*tch Coven, PLUS a complimentary place at one Baddie Brunch every month in your city.</strong></p>
        <p>Think astrology, manifestation, personalised seasonal guides, journaling, delicious food and a table full of ambitious women who want to create BIGGGG F*CKING LIVES together.</p>
        <p>Your brunch ticket is included in your membership, with food and drinks purchased separately. We&apos;ll also be hosting extra dinners, workshops, magical gatherings and special events throughout the year, which you can book separately.</p>
        <p><strong>Because your social calendar deserves to be just as f*cking fabulous as the life you&apos;re building. 🪩💸💖</strong></p>
        <div style={{ marginTop: 26 }}><CovenPriceTable /></div>
        <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 22 }}>
          <a href={LA_COVEN_CHECKOUT_URL} className="no-underline" style={{ display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 32px", border: "2px solid var(--dark)" }}>join the LA coven · $88/month</a>
          <span style={{ fontFamily: pp, fontWeight: 800, fontSize: 15 }}>$88 is the founding price, and it&apos;s going up.</span>
        </div>
        <p style={{ marginTop: 22 }}><strong>Already in the online coven for $44? Your membership doesn&apos;t include the Baddie Brunch, so upgrade to the in-person coven and your monthly brunch is free. Email <a href={UPGRADE_MAIL} style={{ color: "var(--dark)", textDecoration: "underline" }}>hello@thecosmicco.com</a> with &quot;upgrade me to LA&quot; and we&apos;ll switch your plan, so you only ever pay for one membership.</strong></p>
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

      {/* Sublime, the LA Head Baddie: a real person welcoming women in (bio from Betty's launch caption). */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div className="grid grid-cols-2 gap-3 items-start">
            <div style={{ border: "2px solid var(--dark)", borderRadius: 18, overflow: "hidden", transform: "rotate(-2deg)" }}>
              <Image src="/coven/la/sublime-1.jpg" alt="Sublime Luv, LA Head Baddie, in a neon top against a painted rainbow wall" width={1080} height={1405} sizes="(max-width: 768px) 50vw, 240px" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <div style={{ border: "2px solid var(--dark)", borderRadius: 18, overflow: "hidden", transform: "rotate(2deg)", marginTop: 34 }}>
              <Image src="/coven/la/sublime-2.jpg" alt="Sublime Luv in a white ruffled dress and a crystal crown, surrounded by greenery" width={1080} height={1350} sizes="(max-width: 768px) 50vw, 240px" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
          </div>
          <div>
            <div className="tag mb-5">meet our LA head baddie</div>
            <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 58px)", lineHeight: 1, color: "var(--dark)" }}>
              say hiii to <span className="pk">sublime luv.</span>
            </h2>
            <div className="offer-copy" style={{ marginTop: 22, color: "var(--dark)" }}>
              <p>Sublime is a spoken-word artist, poet, creative entrepreneur and an absolute powerhouse who&apos;s passionate about helping creatives build their brands and get PAIDDDDD.</p>
              <p>She&apos;s hosting our LA Baddie Brunches, bringing her creative magic to the manifestation exercises, journaling sessions and conversations about creating BIGGGG F*CKING LIVES, so you never walk in wondering who to talk to.</p>
              <p><a href="https://www.instagram.com/queensublimeluv/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>Go give @queensublimeluv some LOVE 💖</a></p>
            </div>
          </div>
        </div>
      </section>

      <BaddieBrunch />

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
