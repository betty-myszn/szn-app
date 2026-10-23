import type { Metadata } from "next";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferHero, Band, ForYouIf, WaitlistBand, OfferCards, Cover } from "@/components/Offer";

// The Bad B*tch Report: becoming the main character of your own life, read from your birth chart.
// Waitlist only, no price confirmed yet. The page runs as one arc: she sees herself, feels the ache,
// sees who she becomes, sees what's inside, then joins.

export const metadata: Metadata = {
  title: "The Bad B*tch Report, Your Personalised Astrology Blueprint for Becoming Her",
  description:
    "The Bad B*tch Report reads your birth chart across nine chapters on money, visibility, desire, power, shadow and your big dream, with affirmations, journal prompts, two 30-day challenges and your main character dates. Join the waitlist.",
  alternates: { canonical: "/reports/bad-btch-report" },
  openGraph: {
    title: "The Bad B*tch Report 💜",
    description: "Become the main character of your own life. Your personalised astrology blueprint, waitlist open now.",
    url: "/reports/bad-btch-report",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

// The nine chapters, grouped into the three acts of becoming her. Hooks are the report's own chapter openers.
const ACTS = [
  {
    act: "act one",
    name: "who you are",
    bg: "var(--pink)",
    chapters: [
      ["01", "Your Bad B*tch DNA", "The woman you are when nobody's shrinking you, read straight from your Sun, Moon and Rising. She's a LOT. We love her."],
      ["02", "Your Money Era", "Where your money comes from, where you've been leaving it on the table, and how to go back for every last dollarrr. 💸"],
      ["03", "Your Visibility Power", "How you're built to be SEEN, and what you get famous for once you stop hiding in the group chat."],
      ["04", "Your Desire + Magnetism", "What you actually want, before you edit it down into something polite enough to say at brunch."],
      ["05", "Your F*ck Around & Find Out Energy", "How you go after what you want, and what happens to anyone silly enough to stand in the way. 😈"],
    ],
  },
  {
    act: "act two",
    name: "what's been keeping you small",
    bg: "var(--lav)",
    chapters: [
      ["06", "Your Dark Femme + Power", "The parts of you that got called too much, too loud, too intense. We're taking ALLLL of them back."],
      ["07", "The Shadow Keeping You Small", "The old patterns that feel like safety and keep you parked in exactly the same spot, year after yearrr."],
      ["→", "Old SZN to Next SZN", "Who you've been, what you're bringing with you, and the woman you're walking towards like it's a runway. 🦄"],
    ],
  },
  {
    act: "act three",
    name: "who you're becoming",
    bg: "var(--dark)",
    chapters: [
      ["08", "Your Big Dream Energy", "Where life gets BIGGGG, and the direction your chart has been pointing you in this whole time."],
      ["09", "Become That B*tch", "The part where you stop reading about her and start BECOMING her. Pen out, babe."],
    ],
  },
] as const;

const WORKBOOK = [
  ["💋", "6 affirmations written for your chart", "Two each from your Venus, your Saturn and your North Node, each with a line telling you exactly when to say it (usually right before you discount yourself againnn)."],
  ["✍️", "6 journal prompts that go deep", "Pulled from your South Node, your Chiron and your North Node, so you're journaling about YOUR patterns, and yesss, it gets juicy."],
  ["🔥", "5 Bad B*tch Moves", "One for your money, two for your power and two for your big dream, each one a real thing to go and DO this month, ideally in a great outfit."],
  ["🗓️", "Two 30-day challenges", "Sixty days of becoming her, week by week, built from your North Node sign and house. Accountability, but make it astrology. 🪐"],
  ["🎬", "Your main character dates", "The days in the next 90 when the sky is pointing straight at YOU, from your new and full moons to the Sun, Venus, Mars and Jupiter crossing your chart. Diary them, then plan your big moves like the CEO you are."],
  ["💌", "A letter from her", "The final page is written by your future self, a few years from now, from the life your chart says you're building. Keep tissues nearby, she gets emotional. 💌"],
] as const;

const NUMBERS = [
  ["9", "chapters"],
  ["15", "placements read"],
  ["60", "days of challenges"],
  ["90", "days of power dates"],
] as const;

const FAQ = [
  ["How it's made", "Your report reads the sign AND the house for all fifteen placements, from my own writing for every one of them, so two women with the same Sun sign get completely different reports. Sorry to your horoscope app. 😘"],
  ["If you don't know your birth time", "Tick the box on the form and we'll work with what we've got. Your signs stay accurate, and the house sections are where a birth time makes the biggest difference, so if you can sweet-talk it out of a birth certificate or a family member, it's sooo worth the text."],
  ["How you get it", "Your report arrives as a private web page you can read on your phone in bed, plus a beautifully designed PDF to save, print, highlight and scribble ALLLL over."],
  ["What it costs", "The price goes to the waitlist first, and the waitlist gets first access before anybody else gets a look in. Being early has its perks, babe. 💖"],
] as const;

export default function BadBtchReportPage() {
  return (
    <>
      <OfferHero
        offer="bad-btch-report"
        art={<Cover kind="bad-btch-report" />}
        tone="dark"
        kicker="the bad b*tch report · your personalised astrology blueprint"
        title="become the main character"
        accent="of your own damn life."
        intro={
          <p>
            Babe. Your birth chart is the blueprint of the woman you were born to be, back before the world handed you a rulebook about being nice, small and low-maintenance 🙄 The Bad B*tch Report reads ALLLL of it across nine chapters and shows you who she is, what&apos;s been keeping you from her, and exactly how to step into her life: the money, the pleasure, the power and the big, outrageous dream you&apos;ve been waaaay too polite to say out loud. 💜
          </p>
        }
      />

      <Band tag="the supporting role era is overrr" title="you've been an extra in your own movie" accent="for long enough.">
        <p>
          You&apos;re the one who hypes everyone else&apos;s launch, remembers every single birthday, keeps the group chat alive, says &quot;yesss of course!&quot; when you mean absolutely f*cking not, and keeps your dream life saved in a notes app for some magical future moment when everybody else is sorted (spoiler: they will never be sorted) 😭 Meanwhile your own storyline has been sitting in the wings for yearsss, waiting for its cue.
        </p>
        <p>
          Consider this your cue, my love. We&apos;re DONE putting everyone else first, done being grateful for scraps, done being easy to deal with, and we&apos;re starting with the most precise map you&apos;ll ever get of who you&apos;re actually here to be. Then we&apos;re making her impossible to ignore. 🪩
        </p>
      </Band>

      <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5" style={{ color: "var(--pink)" }}>the bad b*tch manifesto</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 68px)", color: "#fff", lineHeight: 0.98 }}>
            the patriarchy wants us small. <span className="pk">so we&apos;re getting HUGEEE.</span>
          </h2>
          <p style={{ color: "#fff", fontSize: 18, lineHeight: 1.7, marginTop: 26, maxWidth: 720, fontWeight: 500 }}>
            A baddie knows exactly who she is and has stopped asking permission to be her. She says what she wants out loud, she charges what she&apos;s worth (then adds tax), she takes up ALL the space she needs, and she lets everybody else have whatever opinion they like about it, because their opinion was never her business anyway. 💖
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "34px 0 0", borderTop: "1.5px solid #fff" }}>
            {["want the thing", "make the money", "take up the space", "say the no", "go first"].map((l, i) => (
              <li key={l} style={{ fontFamily: pp, fontWeight: 900, fontSize: "clamp(26px, 5vw, 46px)", textTransform: "uppercase", lineHeight: 1, padding: "12px 0", borderBottom: "1.5px solid #fff", color: i % 2 ? "#fff" : "var(--pink)", letterSpacing: "-0.02em" }}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">what&apos;s inside</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
            nine chapters. <span className="pk">zero chill.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, marginTop: 22, maxWidth: 720, fontWeight: 500, color: "var(--dark)" }}>
            Every chapter reads a specific part of your chart, sign AND house, so the woman on these pages is YOU, written in the language of how you&apos;re actually wired, and some of it is going to read you for absolute filthhh. 🔥
          </p>
          <div style={{ display: "grid", gap: 22, marginTop: 40 }}>
            {ACTS.map((a) => {
              const ink = a.bg === "var(--dark)" ? "#fff" : "var(--dark)";
              return (
                <div key={a.act} style={{ background: a.bg, color: ink, border: "var(--border)", borderRadius: 18, padding: "26px 24px 18px" }}>
                  <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>{a.act}</div>
                  <div className="display" style={{ fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1, marginTop: 6, color: a.bg === "var(--dark)" ? "var(--pink)" : ink }}>{a.name}</div>
                  <ol style={{ listStyle: "none", padding: 0, margin: "18px 0 0" }}>
                    {a.chapters.map(([n, t, hook]) => (
                      <li key={t} style={{ display: "grid", gridTemplateColumns: "54px 1fr", gap: 12, padding: "14px 0", borderTop: `1.5px solid ${ink}` }}>
                        <span style={{ fontFamily: pp, fontWeight: 900, fontSize: 26, lineHeight: 1 }}>{n}</span>
                        <span>
                          <span style={{ display: "block", fontFamily: pp, fontWeight: 800, fontSize: 19, lineHeight: 1.2, textTransform: "uppercase" }}>{t}</span>
                          <span style={{ display: "block", fontSize: 15.5, lineHeight: 1.6, marginTop: 4, fontWeight: 500 }}>{hook}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">then you do the work</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
            your workbook, <span className="pk">written for your chart.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, marginTop: 22, maxWidth: 720, fontWeight: 500, color: "var(--dark)" }}>
            Reading about her is fun, and becoming her is the whole entire point, so the report ends in a workbook where every affirmation, prompt, move and challenge comes from YOUR placements. Homework has never been this hot. 😏
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 32 }}>
            {WORKBOOK.map(([e, t, b]) => (
              <div key={t} style={{ border: "var(--border)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" }}>
                <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>{e} {t}</div>
                <div style={{ fontSize: 15, lineHeight: 1.65 }}>{b}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ marginTop: 32, border: "var(--border)", borderRadius: 18, overflow: "hidden", background: "#fff", gap: 1.5 }}>
            {NUMBERS.map(([n, l]) => (
              <div key={l} style={{ padding: "22px 18px", color: "#fff", background: "var(--dark)" }}>
                <div style={{ fontFamily: pp, fontWeight: 900, fontSize: 46, lineHeight: 1, color: "var(--pink)" }}>{n}</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 12.5, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betty-founder.png" alt="Betty Andrews" style={{ width: "100%", maxWidth: 300, aspectRatio: "4 / 5", objectFit: "cover", objectPosition: "center 20%", border: "var(--border)", borderRadius: 18 }} />
          <div style={{ color: "var(--dark)" }}>
            <div className="tag mb-5">why i made this</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 54px)", lineHeight: 1 }}>
              hiii my love, <span className="pk">i&apos;m betty.</span>
            </h2>
            <div className="offer-copy" style={{ marginTop: 22 }}>
              <p>
                I&apos;ve spent years watching brilliant, hilarious, wildly capable women play supporting roles in their own lives (hi, I did it too, for waaaay too long), so I wrote this report as the conversation I&apos;d have with you if we sat down with your chart between us, a very large coffee and absolutely zero filter. ✨
              </p>
              <p>
                Every word in it is mine, written for every sign and every house, then matched to your exact chart, so some of it will feel like a compliment and some of it will feel like being caught red-handed, and both are the point. 💖 Read it slowly, underline everything that makes your stomach flip, and then go and DO the final chapter, because that&apos;s where your actual life starts changing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Band tone="white" tag="this is for the woman who" title="is ready to" accent="become her.">
        <ForYouIf
          items={[
            "Knows she's meant for a MUCH bigger life and is sooo done waiting for anybody's permission to live it",
            "Wants more money, more visibility and more space, in a way that feels completely, unapologetically HER 💸",
            "Has been called too much, too loud or too ambitious, and is ready to be MOREEE of all three",
            "Wants a plan with actual dates on it, so becoming her starts this month instead of \"one day\"",
          ]}
        />
      </Band>

      <QuoteStrip ids={["chloe", "georgia", "lauren"]} label="what becoming her looks like" tone="lav" />

      <Band tone="white" tag="good to know" title="the" accent="details.">
        <div style={{ display: "grid", gap: 0, marginTop: 4 }}>
          {FAQ.map(([q, a]) => (
            <div key={q} style={{ borderTop: "var(--border)", padding: "18px 0" }}>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.02em" }}>{q}</div>
              <p style={{ marginTop: 8 }}>{a}</p>
            </div>
          ))}
        </div>
      </Band>

      <WaitlistBand
        offer="bad-btch-report"
        title="she's already in your chart."
        accent="go meet her."
        body={
          <p>
            The Bad B*tch Report is waitlist only right now, so pop in your name and birth details and you&apos;ll be the very first to know the second it opens, with first access before anybody else gets a look in. Your main character era starts HERE, my love. ✨
          </p>
        }
      />

      <OfferCards exclude="bad-btch-report" />
    </>
  );
}
