import type { Metadata } from "next";
import Link from "next/link";
import { OfferHero, Band, WaitlistBand } from "@/components/Offer";
import BrunchMagicBand from "@/components/BrunchMagicBand";

// The NYC Bad B*tch Coven: the in-person coven coming to New York (Betty, 18 Nov 2026). Waitlist only:
// no date, venue, price or Head Baddie is set, so none is printed. Modelled on LA's monthly Baddie
// Brunches; the waitlist answers help shape it. Wants an NYC Head Baddie, so it links the IRL host
// application (/irl-host).

export const metadata: Metadata = {
  title: "The NYC Bad B*tch Coven, an In-Person Coven for Women in New York",
  description:
    "The Bad B*tch Coven is coming to New York: monthly Baddie Brunches with astrology, manifestation, journaling and a table full of ambitious women creating BIG lives. Join the NYC waitlist to hear the first date before anyone else.",
  alternates: { canonical: "/baddie-coven/nyc" },
  openGraph: {
    title: "The NYC Bad B*tch Coven 🗽",
    description: "Your coven, IRL in New York. Join the NYC waitlist for the first Baddie Brunch.",
    url: "/baddie-coven/nyc",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";
const tick = <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>;

// What a Baddie Brunch feels like, start to finish (same shape as LA's, so the two cities match).
const BRUNCH = [
  ["🕯️", "You walk in", "Candles lit, music on, and somebody tells you your outfit is EVERYTHING before you've even put your bag down."],
  ["🪐", "The sky, decoded", "Your own printed astrology guide is waiting at your seat, written from YOUR birth chart, so you know exactly what this season means for you."],
  ["🔮", "The magic", "Manifestation, journaling and intention setting, calling in the next version of your life together."],
  ["💬", "The circle", "You say the scary dream out loud to a table of women who believe you, and they hold you to it. Lovingly. Relentlessly."],
  ["🥂", "The celebrating", "Wins get screamed about, money moves get toasted and every glow up at the table gets the reaction it deserves."],
  ["💞", "You leave with your people", "New best friends, a group chat that never sleeps and plans that ACTUALLY happen."],
];

const FIT = [
  "🗽 You live in NYC (or close enough) and you're craving friendships that go deeper than \"we should totally get drinks sometime\".",
  "🪐 You've got your Big Three memorised and you're DYING to talk about your chart with women who actually care.",
  "💸 You're ambitious, you want serious money and you're done apologising for either.",
  "✈️ You want to travel the world, build the business, write the book and charge MORE.",
  "🪩 You want your social life to make you feel MORE like yourself, not less.",
  "💅 You're ready for a table full of baddies who'll hype your wins as loudly as their own.",
];

const FAQS: [string, string][] = [
  ["When is the first NYC Baddie Brunch?", "We're picking the date and the spot with the women on this waitlist, so put your name down and you'll hear it before anybody else."],
  ["Where in New York will it be?", "Somewhere gorgeous, and the venue goes to the waitlist first. Tell us which part of the city you're in when you sign up, because it genuinely helps us choose."],
  ["How much will it cost?", "NYC pricing isn't set yet, and the waitlist hears it first."],
  ["Can I come on my own?", "YESSS, and most women will. You'll walk in solo and leave with a whole crew, that's kind of the point."],
  ["Do I need to know astrology or witchcraft?", "Not even a little. Total beginners are welcome, and your personalised guide explains everything in plain English."],
  ["I can't wait. Is there anything I can join now?", "The online Bad B*tch Coven is for witchy women everywhere, with a live coven circle every month, your personalised astrology platform and the coven chat rooms."],
];

const AREAS = ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island", "Long Island", "New Jersey", "Westchester / upstate", "Visiting NYC"];

const btn = { display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px" } as const;

const skyline = { height: "auto", objectFit: "cover", border: "var(--border)", borderRadius: 18, boxShadow: "10px 12px 0 var(--dark)", transform: "rotate(2deg)" } as const;

const card = { border: "2px solid var(--dark)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" } as const;

export default function NycCovenPage() {
  return (
    <>
      <OfferHero
        offer="baddie-coven-nyc"
        bigArt
        art={
          // The skyline tells her at a glance this is HER city (Betty, 27 Nov 2026). Unsplash photo
          // fT6-YkB0nfg (free licence), tinted to the brand pink/black. Desktop only: phones get a
          // shorter crop inside the intro (below) so the form stays close to the top.
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/coven/nyc-pink-skyline.jpg" alt="The New York skyline and the Empire State Building at dusk, tinted pink" className="hidden md:block" style={{ ...skyline, width: "100%", aspectRatio: "1000 / 1170" }} />
        }
        tone="pink"
        kicker="the coven, IRL in NYC"
        title="your coven,"
        accent="IRL in NYC."
        intro={
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coven/nyc-pink-skyline.jpg" alt="" aria-hidden="true" className="block md:hidden" style={{ ...skyline, width: "100%", aspectRatio: "4 / 3", objectPosition: "center 42%", marginBottom: 26 }} />
            <p style={{ margin: "0 0 12px", fontFamily: pp, fontWeight: 800 }}>NEW YORK BADDIESSSSS 💖🪩🗽</p>
            <p style={{ margin: 0, fontWeight: 500 }}>The Bad B*tch Coven is coming to New York, because we want more women making $$$, chasing outrageous dreams and having a group of bad b*tches cheering them on while they do it.</p>
            <div style={{ marginTop: 20, background: "#fff", border: "2px solid var(--dark)", borderRadius: 16, padding: "16px 20px", maxWidth: 620, color: "var(--dark)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>🗽 What we&apos;re bringing to NYC:</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", display: "grid", gap: 4, fontSize: 15, lineHeight: 1.5, fontWeight: 600 }}>
                <li>{tick}A Baddie Brunch every month: new friends, delicious food and manifesting together around each astrology season&apos;s theme.</li>
                <li>{tick}Your own personalised printed astrology guide at every brunch, written from your chart.</li>
                <li>{tick}A local Head Baddie welcoming you in and hosting.</li>
                <li>{tick}Real friendships with ambitious, witchy New York women, IRL.</li>
              </ul>
            </div>
          </>
        }
      />

      {/* The form sits straight under the hero (Betty, 27 Nov 2026): most visitors arrive warm from
          Threads and came to sign up, so they shouldn't scroll 7,000px to do it. The rest of the page
          is there for anyone who wants convincing, with buttons back up to #waitlist. */}
      <WaitlistBand
        offer="baddie-coven-nyc"
        title="the NYC coven"
        accent="is calling. 🗽"
        body={
          <>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Your future best friends are already in New York, babe.</p>
            <p style={{ margin: "0 0 14px", color: "#fff" }}>Put your name down and you&apos;ll hear the first Baddie Brunch date, the spot and the price before anybody else.</p>
            <p style={{ margin: 0, fontFamily: pp, fontWeight: 800, color: "#fff" }}>See you in real life, witch. 💜</p>
          </>
        }
        questions={[
          // A dropdown, so the venue can be picked from a clean count by area.
          { label: "Which part of New York are you in?", type: "select", required: true, options: AREAS },
          { label: "What would you love to do together IRL?", type: "textarea" },
        ]}
      />

      <Band tag="sound familiar" title="you're growing. your social life" accent="hasn't caught up.">
        <p>New York is FULL of ambitious women, and somehow it&apos;s still hard to find the ones who want to talk about your Saturn return, your money spells and the life you&apos;re building over brunch.</p>
        <p>You want ambitious, witchy, creative, slightly DELULU friends who want BIG lives too, women who encourage you to book the flight, start the business, write the book, charge MORE and stop being so sensible.</p>
        <p><strong>BECAUSE BEING SENSIBLE IS BORRRRRING. REAL friendships, REAL conversations and REAL women supporting each other as they build their dream lives, IRL in NYC.</strong></p>
      </Band>

      <Band tone="lav" wide tag="what actually happens" title="a baddie brunch" accent="in new york.">
        <p>Here&apos;s the feeling we&apos;re bringing to the city, from the moment you walk in to the moment you leave with a whole new crew.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 26 }}>
          {BRUNCH.map(([e, t, b], i) => (
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
        <p style={{ marginTop: 22 }}><strong>The exact format gets shaped with the women on the NYC waitlist, so your sign-up genuinely helps decide what we do together.</strong></p>
        <a href="#waitlist" className="no-underline" style={{ ...btn, marginTop: 10 }}>save me a seat 🗽</a>
      </Band>

      <BrunchMagicBand city="New York" />

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

      <Band tone="pinkLight" tag="wanted: one fabulous host" title="be our NYC" accent="head baddie. 👑">
        <p>Every city&apos;s coven has a Head Baddie: the woman who welcomes everyone in, makes the introductions and hosts the monthly brunch. In LA, it&apos;s Sublime Luv.</p>
        <p>If you&apos;re a New Yorker who LOVES bringing women together, we&apos;d love to hear from you.</p>
        <p><Link href="/irl-host" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>apply to host in NYC →</Link></p>
      </Band>

      <Band wide tag="faqs" title="a few witchy" accent="details.">
        <div className="grid gap-3" style={{ marginTop: 26, maxWidth: 820 }}>
          {FAQS.map(([q, a]) => (
            <details key={q} style={{ ...card, padding: "16px 20px" }}>
              <summary style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>{q}</summary>
              <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.65 }}>{a}</p>
              {q.startsWith("I can't wait") && <p style={{ margin: "8px 0 0" }}><Link href="/baddie-coven" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>see the online coven →</Link></p>}
            </details>
          ))}
        </div>
      </Band>

      <Band tone="lav" tag="the first brunch is coming" title="your seat at the" accent="NYC table. 🗽">
        <p>Put your name down and you&apos;ll hear the first Baddie Brunch date, the spot and the price before anybody else.</p>
        <a href="#waitlist" className="no-underline" style={{ ...btn, marginTop: 10 }}>join the NYC waitlist</a>
      </Band>
    </>
  );
}
