import type { Metadata } from "next";
import { OfferHero, Band, Tiles, ForYouIf, OfferCards } from "@/components/Offer";
import WaitlistForm from "@/components/WaitlistForm";
import { RBR_REVIEWS } from "@/lib/report-reviews";

// Rich B*tch Rising, the programme: eight weeks of money manifestation with astrology, Human Design,
// shadow work and witchcraft, drafted 19 Nov 2026. The $111 Rich B*tch Rising report (/reports/rich-btch-rising)
// is its first step and is included in every place.
//
// DRAFT, waitlist only. Built on the Cosmic Cash structure (8 weeks, 4 live classes, $888) with the
// witchcraft layer added. Betty confirmed the $888 price and the $111 credit for report buyers on
// 19 Nov 2026. Still open: the moon rituals and the start date (none printed, waitlist only).

export const metadata: Metadata = {
  title: "Rich B*tch Rising, the Money Manifestation Programme",
  description:
    "Rich B*tch Rising is Betty's eight-week money manifestation programme: your birth chart, your Human Design, money shadow work and real witchcraft, turned into moves that get you PAID. Waitlist open.",
  alternates: { canonical: "/rich-btch-rising" },
  openGraph: {
    title: "Rich B*tch Rising 💸",
    description: "Eight weeks of money manifestation with your chart, your Human Design, your shadows and your spells. Waitlist open.",
    url: "/rich-btch-rising",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

const PRICE = "$888";
const REPORT_PRICE = "$111";

const TICKER = ["💸 rich b*tch rising", "eight weeks with betty", "astrology", "human design", "shadow work", "witchcraft", "your money report included", "waitlist open"];

function Ticker() {
  const row = TICKER.map((t, i) => (
    <span key={i} style={{ fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: i % 2 ? "var(--pink)" : "#fff", padding: "0 22px" }}>
      {t} <span style={{ color: "#fff", paddingLeft: 22 }}>✦</span>
    </span>
  ));
  return (
    <div style={{ background: "var(--dark)", overflow: "hidden", padding: "14px 0", borderBottom: "var(--border)" }} aria-hidden>
      <div className="ticker-inner">{row}{row}{row}{row}</div>
    </div>
  );
}

const PATTERNS = [
  { e: "🧱", t: "The ceiling", b: "You hit the same number every year, however hard you work." },
  { e: "💸", t: "The leak", b: "It comes in easily and leaves even faster." },
  { e: "😬", t: "The flinch", b: "You feel a bit sick every time you name your price." },
];

const TOOLS = [
  { emoji: "🪐", title: "Astrology", body: "Your 2nd, 8th and 10th houses, Venus, Jupiter and Saturn show how you're built to earn, where money expands easily for you and where it asks for patience." },
  { emoji: "🧬", title: "Human Design", body: "Your type, strategy and authority show how you're designed to make money decisions, so you can stop copying hustle advice built for somebody else's energy." },
  { emoji: "🖤", title: "Shadow work", body: "The family money stories, the good-girl conditioning and the old money wound your Chiron points at, brought up gently and finally put down." },
  { emoji: "🕯️", title: "Witchcraft", body: "A money spell to close every class, plus a ritual for each new and full moon inside our eight weeks, written for the sign it falls in." },
  { emoji: "💖", title: "Manifestation + hypnosis", body: "Future-self work, receiving practice and a money hypnosis that rewires what you believe you're allowed to have, right where those beliefs live." },
  { emoji: "💸", title: "Real-life money moves", body: "Your prices, your asks, your offers and a 90-day plan, because the spell works SO much better when you also send the invoice." },
];

const CLASSES = [
  {
    title: "Your money blueprint",
    dek: "How YOU are built to make, receive + hold money.",
    body: "We start with your personal money map, reading your 2nd house (the money you earn and what you believe you're worth), your 8th house (the money that comes through other people), your 10th house, Venus, Jupiter and your Human Design type, strategy and authority, so you can see exactly how money wants to come to you and the kind of work you're built to get paid for.",
    spell: "build your money altar.",
    leave: "your money map, and the work you're designed to be paid for.",
    look: { bg: "#fff", ink: "var(--dark)" },
  },
  {
    title: "Your money shadow",
    dek: "Let's find out what's actually running the show.",
    body: "This is the juicy one, babe: the money stories from your family, the good-girl rules about being grateful, easy and cheap to deal with, the scarcity, the undercharging, the overgiving and the upper limit that kicks in right as things get good, with your Saturn and Chiron showing us where it all started and shadow work prompts and somatics to start letting it go.",
    spell: "burn the money rules you're done with.",
    leave: "the exact patterns you've been repeating, and the tools to change them.",
    look: { bg: "var(--dark)", ink: "#fff" },
  },
  {
    title: "Your rich b*tch identity",
    dek: "Your next money level needs a new version of you.",
    body: "We meet the version of you who already lives at the money level you're asking for, how she prices, what she expects, what she no longer tolerates and how she receives without flinching, using your north node and midheaven to connect your money to your purpose and your money hypnosis to start rewiring the beliefs underneath your current money identity.",
    spell: "a mirror spell for receiving.",
    leave: "your next money identity, new standards and a daily practice for becoming HER.",
    look: { bg: "var(--pink-light)", ink: "var(--dark)" },
  },
  {
    title: "Make the f*cking money",
    dek: "Now we give the magic somewhere to land.",
    body: "We turn everything into moves: your next income goal, where that money could realistically come from, what to raise, ask for, sell or create, the opportunities you've been ignoring and the transits that show when your chart is ready to push, whether you're running a business, growing a career or building more than one stream of income.",
    spell: "seal your 90-day plan in a money jar.",
    leave: "your personal 90-day Rich B*tch Rising plan.",
    look: { bg: "var(--dark)", ink: "#fff" },
  },
];

const INCLUDED = [
  { e: "💸", t: "Your Rich B*tch Rising report", b: `Your personalised money report, written by hand from your birth chart and in your inbox before class one. It's ${REPORT_PRICE} on its own.` },
  { e: "🪩", t: "Four live classes with me", b: "With coaching in the room, so you work through your money stuff with me and a room full of baddies instead of on your own, and the replays are yours forever." },
  { e: "🕯️", t: "A spell for every class", b: "Plus a moon ritual for each new and full moon that falls inside our eight weeks." },
  { e: "🎧", t: "Your money hypnosis", b: "To rewire what you believe you're allowed to receive, on repeat, for as long as you want it." },
  { e: "📓", t: "A workbook for every class", b: "So you actually do the work between classes instead of collecting notes you never open again." },
];

const FOR_YOU = [
  "You make good money and somehow can't seem to KEEP it.",
  "Your income keeps hitting the same ceiling, however hard you work.",
  "You know you should charge more and still can't bring yourself to do it.",
  "You've done the manifesting and keep repeating the same money patterns anyway.",
  "You love astrology, you're curious about Human Design and witchcraft, and you want all of it working on your real bank account instead of sitting in a pretty chart.",
];

const NOT_FOR_YOU = [
  "You want investment or financial advice, which this isn't.",
  "You want a guaranteed income figure without doing any of the work.",
];

const FAQ: [string, string][] = [
  ["When does it start?", "The dates go to the waitlist first, along with first pick of the places, so get your name down and you'll hear before anybody else."],
  ["How much is it?", `${PRICE} for the full eight weeks, and that includes your Rich B*tch Rising report, which is ${REPORT_PRICE} on its own.`],
  ["I already have my Rich B*tch Rising report. Do I pay for it twice?", `Never, babe. Your ${REPORT_PRICE} comes off your place, and we build on the report you already have.`],
  ["Do I need to know astrology or Human Design?", "Not even a little. I read your chart and your Human Design with you and explain everything in plain English, step by step."],
  ["Is the witchcraft spooky?", "Only in the fun way. Our witchcraft is intention, candles, the moon, your altar and a little ritual to seal what you've decided, so there's nothing dark and no experience needed, whatever you do or don't believe."],
  ["I don't know my birth time. Can I still join?", "YES. Tick the box when you sign up and you still get everything that comes from your planets and signs."],
  ["What if I can't make it live?", "Every class is recorded, and the replays, workbooks, spells and your hypnosis are yours to keep."],
  ["Is this financial advice?", "No, babe. I'm an astrologer and coach, so this is the inner work and the practical moves around earning, receiving and keeping money, and any investing decisions belong with a qualified financial adviser."],
];

const ctaStyle = { display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "20px 40px", border: "var(--border)" };
const smallCaps = { fontFamily: pp, fontWeight: 800, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase" as const };

export default function RichBtchRisingProgrammePage() {
  return (
    <>
      <style>{`
        .rbr-class > summary { list-style: none; cursor: pointer; }
        .rbr-class > summary::-webkit-details-marker { display: none; }
        .rbr-class .rbr-open-hint::after { content: "tap to open ↓"; }
        .rbr-class[open] .rbr-open-hint::after { content: "close ↑"; }
      `}</style>

      <OfferHero
        offer="rich-btch-rising-programme"
        bigArt
        art={
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/coven/betty-witch-email.jpg" alt="Betty in a pink witch hat and pink feather gloves" width={1112} height={1278} style={{ display: "block", width: "100%", maxWidth: 520, height: "auto", border: "var(--border)", borderRadius: 18, transform: "rotate(1.5deg)", boxShadow: "10px 12px 0 var(--dark)" }} />
        }
        kicker="rich b*tch rising · the money programme"
        title="time to get"
        accent="rich, witch."
        intro={
          <>
            <p style={{ fontFamily: pp, fontWeight: 800, marginBottom: 16 }}>Your birth chart, your Human Design, your money shadows and real witchcraft, all pointed at ONE thing: more money in your actual bank account.</p>
            <p>Rich B*tch Rising is eight weeks with me, live, where we find out how you&apos;re built to make money, dig up the money rules you inherited and are SO done with, close every class with a spell and then turn the whole lot into moves that get you PAID.</p>
          </>
        }
      />

      <Ticker />

      <Band wide tag="the money ceiling" title="you've done the manifesting." accent="now let's make it LAND.">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
        <p>You&apos;ve written the affirmations in a pretty notebook, you&apos;ve made the vision board, you&apos;ve scripted the $10k months like the main character you are, and somehow the money keeps arriving at the same old number, or it arrives and then heads straight for the nearest exit.</p>
        <p>That&apos;s because manifesting works on the part of you that WANTS the money, while the part of you that decides what&apos;s safe to have is still running on rules you were handed long before you could say no to them, by your family, your teachers, your culture and every person who ever made you feel greedy for wanting more.</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coven/baddie-money-pink.jpg" alt="A baddie in a pink blazer surrounded by gold glitter dollar signs" width={744} height={726} style={{ display: "block", width: "100%", height: "auto", border: "var(--border)", borderRadius: 18, transform: "rotate(-1.5deg)" }} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4" style={{ marginTop: 28 }}>
          {PATTERNS.map((p) => (
            <div key={p.t} style={{ background: "var(--dark)", color: "#fff", border: "var(--border)", borderRadius: 18, padding: "22px 20px" }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{p.e}</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, color: "var(--pink)", marginTop: 12 }}>{p.t}</div>
              <p style={{ color: "#fff", margin: "6px 0 0", fontWeight: 600, fontSize: 16, lineHeight: 1.55 }}>{p.b}</p>
            </div>
          ))}
        </div>
        <p style={{ maxWidth: 760, marginTop: 28 }}><strong>Rich B*tch Rising goes after the rules underneath all three, with your chart showing us where they live and your Human Design showing us how you&apos;re actually built to earn, so the manifesting finally works WITH you.</strong></p>
      </Band>

      <Band wide tone="lav" tag="everything, all at once" title="every tool I've got," accent="pointed at your money. 🪐">
        <p style={{ maxWidth: 760 }}>This is where all of my favourite magic meets your money, woven together, because each tool shows you a different piece of your money story and together they show you the whole thing.</p>
        <Tiles tone="lav" items={TOOLS} />
      </Band>

      <Band wide tag="the eight weeks" title="here's how we" accent="get you PAID.">
        <p style={{ maxWidth: 760 }}>Four live classes, one every two weeks so you have time to actually DO the work in between, and every single one closes with a spell. Tap a class to see what&apos;s inside.</p>
        <div style={{ display: "grid", gap: 16, marginTop: 28 }}>
          {CLASSES.map((c, n) => (
            <details key={c.title} className="rbr-class" style={{ background: c.look.bg, color: c.look.ink, border: "var(--border)", borderRadius: 22, padding: "24px 22px" }}>
              <summary>
                <div className="grid grid-cols-[64px_1fr] md:grid-cols-[120px_1fr] gap-4 items-start">
                  <div className="display" style={{ fontSize: "clamp(48px, 8vw, 88px)", lineHeight: 0.85, color: "var(--pink)" }}>{String(n + 1).padStart(2, "0")}</div>
                  <div>
                    <div style={{ fontFamily: pp, fontSize: "clamp(21px, 3vw, 28px)", fontWeight: 800, lineHeight: 1.15, color: c.look.ink }}>{c.title}</div>
                    <p style={{ fontFamily: pp, fontWeight: 700, fontSize: 17, lineHeight: 1.4, margin: "8px 0 0", color: c.look.ink }}>{c.dek}</p>
                    <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 14 }}>
                      <span style={{ background: "var(--pink)", color: "#fff", border: "var(--border)", borderRadius: 999, padding: "6px 14px", fontFamily: pp, fontWeight: 800, fontSize: 13 }}>🕯️ the spell: {c.spell}</span>
                      <span className="rbr-open-hint" style={{ ...smallCaps, fontSize: 11, color: c.look.ink }} />
                    </div>
                  </div>
                </div>
              </summary>
              <div className="md:pl-[136px]" style={{ marginTop: 18 }}>
                <p style={{ margin: "0 0 14px", color: c.look.ink, fontSize: 16, lineHeight: 1.7 }}>{c.body}</p>
                <p style={{ margin: 0, fontFamily: pp, fontWeight: 800, fontSize: 17, lineHeight: 1.4, color: "var(--pink)" }}>You leave with {c.leave}</p>
              </div>
            </details>
          ))}
        </div>
        <div style={{ background: "var(--lav)", color: "var(--dark)", border: "var(--border)", borderRadius: 18, padding: "22px 22px", marginTop: 22 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>🌙 <strong>Plus the moon.</strong> A ritual for every new moon and full moon that falls inside our eight weeks, written for the sign it&apos;s in, so your money magic runs on the real sky.</p>
        </div>
      </Band>

      <Band wide tone="pinkLight" tag="what you get" title="everything that comes" accent="with your place. 💖">
        <div className="grid sm:grid-cols-2 gap-4" style={{ marginTop: 6 }}>
          {INCLUDED.map((x, i) => (
            <div key={x.t} className={i === 0 ? "sm:col-span-2" : undefined} style={{ background: i === 0 ? "var(--dark)" : "#fff", color: i === 0 ? "#fff" : "var(--dark)", border: "var(--border)", borderRadius: 18, padding: "22px 20px", display: "flex", gap: 14 }}>
              <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{x.e}</div>
              <div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, lineHeight: 1.2, color: i === 0 ? "var(--pink)" : "var(--dark)" }}>{x.t}</div>
                <p style={{ margin: "6px 0 0", fontSize: 15.5, lineHeight: 1.6, fontWeight: 600, color: i === 0 ? "#fff" : "var(--dark)" }}>{x.b}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5" style={{ marginTop: 30 }}>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#waitlist" className="no-underline btn-pink" style={ctaStyle}>💸 join the waitlist</a>
            <span style={{ fontFamily: pp, fontSize: 18, fontWeight: 800 }}>{PRICE} for the full eight weeks</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cosmic-money.png" alt="" aria-hidden="true" width={700} height={513} style={{ display: "block", width: "min(240px, 60vw)", height: "auto", transform: "rotate(-8deg)" }} />
        </div>
      </Band>

      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-5"><span className="holo-sticker" style={{ transform: "rotate(-2deg)" }}>✦ the report you start with</span></div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
            the report already <span className="pk">has fans. 💸</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, maxWidth: 760, marginTop: 18, fontWeight: 500 }}>Every place starts with your own Rich B*tch Rising report, and here&apos;s what the first rich b*tches said about theirs.</p>
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-5 -mx-5 px-5 md:mx-0 md:px-0" style={{ marginTop: 26, paddingBottom: 6, scrollbarWidth: "none" }}>
            {RBR_REVIEWS.map((r) => (
              <figure key={r.name} className="holo-edge snap-start shrink-0 w-[84%] md:w-auto" style={{ margin: 0, background: "var(--lav-light)", border: "var(--border)", borderRadius: 18, padding: "22px 22px 24px", display: "flex", flexDirection: "column", color: "var(--dark)" }}>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 44, lineHeight: 0.6, color: "var(--pink)" }}>&ldquo;</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, lineHeight: 1.3, marginTop: 12 }}>{r.head}</div>
                <blockquote style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65 }}>{r.body}</blockquote>
                <figcaption style={{ marginTop: "auto", paddingTop: 16, fontFamily: pp, fontWeight: 800, fontSize: 15 }}>
                  {r.name} <span style={{ fontWeight: 600 }}>| {r.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Band wide tone="lav" tag="this is for you" title="made for baddies who are" accent="done being underpaid.">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <ForYouIf items={FOR_YOU} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coven/baddie-money-saturn.jpg" alt="A baddie in black leather with Saturn and gold dollar signs" width={682} height={608} style={{ display: "block", width: "100%", height: "auto", border: "var(--border)", borderRadius: 18, transform: "rotate(1.5deg)", marginTop: 26 }} />
        </div>
        <div style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 20px", marginTop: 26 }}>
          <div style={{ ...smallCaps, marginBottom: 10 }}>It&apos;s not for you if</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
            {NOT_FOR_YOU.map((t) => (
              <li key={t} style={{ fontSize: 16, lineHeight: 1.6, fontWeight: 600 }}>✕ {t}</li>
            ))}
          </ul>
        </div>
      </Band>

      <Band tag="questions" title="everything you" accent="wanted to ask.">
        <div style={{ display: "grid", gap: 12 }}>
          {FAQ.map(([q, a]) => (
            <details key={q} style={{ background: "#fff", border: "var(--border)", borderRadius: 16, padding: "16px 20px" }}>
              <summary style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>{q}</summary>
              <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.65 }}>{a}</p>
            </details>
          ))}
        </div>
      </Band>

      <section id="waitlist" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, borderBottom: "var(--border)", scrollMarginTop: 80 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
              get on the list,
              <br />
              <span className="pk">rich witch. 💸</span>
            </h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: "#fff", marginTop: 22, fontWeight: 500 }}>
              <p style={{ margin: "0 0 14px", color: "#fff" }}>The waitlist hears the dates first and gets first pick of the places, and the moment you put your name down you&apos;ve told the universe you&apos;re done being underpaid, which, as spells go, is a VERY good start.</p>
              <p style={{ margin: 0, color: "#fff", fontFamily: pp, fontWeight: 800 }}>{PRICE} · eight weeks with Betty · your {REPORT_PRICE} report included</p>
            </div>
          </div>
          <WaitlistForm offer="rich-btch-rising-programme" question="What's your money goal for 2027?" tone="dark" />
        </div>
      </section>

      <OfferCards exclude="rich-btch-rising" />
    </>
  );
}
