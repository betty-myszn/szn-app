import type { Metadata } from "next";
import Link from "next/link";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferCards, Cover, Band, ForYouIf } from "@/components/Offer";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The reports hub: The Bad B*tch Report (on sale) and Rich B*tch Rising (waitlist), each shown with its
// cover, what's inside and how it reaches her, then linking through to its own sales page.

export const metadata: Metadata = {
  title: "Personalised Astrology Reports for Money + Confidence",
  description:
    "MY SZN's personalised astrology reports, written by Betty from your exact birth chart: The Bad B*tch Report for confidence, power and visibility ($88 intro price, in your inbox within 48 hours) and Rich B*tch Rising for money, wealth and self-worth (waitlist open).",
  alternates: { canonical: "/reports" },
  openGraph: {
    title: "MY SZN Reports 💸💜",
    description: "Your money and your confidence, read from your own birth chart.",
    url: "/reports",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Same Stripe Payment Link as /reports/bad-btch-report (birth details are collected at checkout).
const BBR_BUY_URL = "https://buy.stripe.com/5kQcN6f2TcM7gKm4GF7kc0A";

const REPORTS = [
  {
    kind: "bad-btch-report" as const,
    status: "on sale now",
    name: "the bad b*tch report",
    promise: "become the main character of your own damn life.",
    body: "Nine chapters on the woman you are when nobody's shrinking you, everything that's been keeping you small, and the big, outrageous, slightly unhinged life your chart has been pointing at this WHOLE time, written for the sign AND the house of all fifteen of your placements, so it reads like YOU and absolutely nobody elseee. 💜",
    inside: ["Your Bad B*tch DNA", "Your Money Era", "Your Visibility Power", "Your Desire + Magnetism", "Your F*ck Around & Find Out Energy", "Your Dark Femme + Power", "The Shadow Keeping You Small", "Your Big Dream Energy", "Become That B*tch"],
    extras: ["6 affirmations", "6 journal prompts", "5 bad b*tch moves", "two 30-day challenges", "your main character dates", "a letter from her"],
    price: "$88 intro price",
    delivery: "in your inbox within 48 hours",
    cta: { label: "get my report", href: BBR_BUY_URL, external: true },
    more: "/reports/bad-btch-report",
    bg: "var(--dark)",
    ink: "#fff",
    hot: "var(--pink)",
  },
  {
    kind: "rich-btch-rising" as const,
    status: "waitlist open",
    name: "rich b*tch rising",
    promise: "what your chart says about getting PAID.",
    body: "Your second, tenth and eighth houses, your Venus and your Jupiter, all read together so you can finally see how you're built to get PAID, where the family money stories and good-girl guilt have been running your bank account for agesss, and what happens when you let yourself be rich, ambitious and VERY pleased with yourself about it. 💸",
    inside: ["How you're built to make money", "Your money shadow", "Self-worth, receiving + being THAT woman", "Money, power + financial independence", "Your rich b*tch era starts here"],
    extras: ["money manifestation practices", "shadow work prompts", "affirmations", "practical next moves"],
    price: "$88",
    delivery: "waitlist gets first access",
    cta: { label: "join the waitlist", href: "/reports/rich-btch-rising#waitlist", external: false },
    more: "/reports/rich-btch-rising",
    bg: "var(--pink)",
    ink: "var(--dark)",
    hot: "#fff",
  },
];

const STEPS = [
  ["01", "you spill your birth details", "Date, time and place go straight into checkout, andddd if you don't know your birth time, write \"unknown\" and we work with everything else, which is still a LOTTT of you."],
  ["02", "betty gets OBSESSED with your chart", "Every placement gets read by its sign AND its house from writing I've done for every single combination, then I put yours together by hand, so two Leos get two completely different reports and neither of them gets a horoscope-app shrug. 🪐"],
  ["03", "she lands in your inbox", "A gorgeous designed PDF, yours foreverrr, to read in bed, print, highlight and scribble ALLLL over, then actually go and DO, ideally in a great outfit. 💖"],
] as const;

// What changes in her once she's read it; each card written on its own terms (no shared openings).
const CHANGES = [
  ["🪞", "You see ALL of you, finally", "The intensity, the big wants, the way you go silent in meetings and absolutely FERAL in the group chat, all of it gets named, found in your chart and handed back to you as the power it always was, babe."],
  ["💸", "You stop leaving money on the table", "Your Money Era chapter shows where your money is built to come from and where you've been undercharging, overgiving or waiting politely to be picked, so the next price you set has your whole chart (and a little audacity) behind it."],
  ["🔥", "You catch the shrink in real time", "Your shadow chapter names the exact pattern that kicks in right before you go big, so the next time it shows up you clock it mid-sentence, roll your eyes at it and goooo anyway."],
  ["💋", "You want what YOU want", "Desire + Magnetism reads your Venus by sign AND house, so the life you describe afterwards sounds like YOU, outrageous and specific, instead of the polite brunch-friendly version you've been editing it down to."],
  ["🗓️", "Your big moves get dates", "Ninety days of main character dates tell you exactly when to launch, ask, post, pitch, flirt and book the flight, so your boldest moves land on the days the sky is SCREAMING your name."],
  ["👑", "You meet HER", "The last page is a letter from the baddie you're becoming, written from a few years ahead, and it's the page you'll reread every single time the world tries to make you forget who you are. 🦄"],
] as const;

// Everything inside The Bad B*tch Report, from its own sales page.
const TAKE_HOME = [
  ["📕", "A gorgeous PDF, yours foreverrr", "Nine chapters laid out to read in bed, print, highlight and scribble ALLLL over, saved on your phone for the days you need reminding exactly how much of a baddie you are."],
  ["🔭", "Fifteen placements, each read twice", "Every placement is read by its sign AND its house, so your pages are built from your exact combination, and two women with the same Sun get two completely different reports. Sorry to your horoscope app. 😘"],
  ["✨", "Six affirmations with instructions", "Two each from your Venus, your Saturn and your North Node, each with a line telling you exactly when to say it (usually right before you discount yourself againnn)."],
  ["✍️", "Six journal prompts that go deep", "Pulled from your South Node, your Chiron and your North Node, so you're journaling about YOUR patterns, and yesss, it gets juicy."],
  ["👠", "Five Bad B*tch Moves", "One for your money, two for your power and two for your big dream, each one a real thing to go and DO this month, preferably while everyone else is still talking about it. 🔥"],
  ["🏃‍♀️", "Two 30-day challenges", "Sixty days of becoming her, week by week, built from your North Node sign and house. Accountability, but make it astrology. 🪐"],
  ["🎬", "Your main character dates", "The days in the next 90 when the sky is pointing straight at YOU, from your new and full moons to the Sun, Venus, Mars and Jupiter crossing your chart. Diary them, then plan your big moves like the CEO you are."],
  ["💌", "A letter from her", "Your future self writes the final page from the life your chart says you're building. Keep tissues nearby, she gets emotional."],
] as const;

// Rich B*tch Rising's practical layer, from its own sales page (15 Oct 2026 copy).
const RBR_TAKE_HOME = [
  ["🪄", "Money manifestation practices", "Money magic written for YOUR chart, so you manifest the way you're actually built to receive instead of copying some guy's 5am morning routine."],
  ["🌑", "Shadow work prompts", "For the family money stories and good-girl guilt that have had waaay too much access to your bank account for far too longgg."],
  ["👑", "Affirmations", "For overgiving less, charging MOREEE and being outrageously pleased with yourself about every single invoice. 💸"],
  ["📈", "Practical next moves", "Real things to try, habits to side-eye, conversations to have and decisions to start making differently, starting thisss week."],
] as const;

const FOR_YOU_IF = [
  "Has read every horoscope going and is DONE with ones written for twelve million other people",
  "Keeps undercharging, overgiving or shrinking right before the big moment, and wants to know exactly WHY (then stop, immediately)",
  "Loves a deep dive she can highlight, reread and come back to every single season like a holy text 🪐",
  "Wants a plan with real dates on it, so this month is the month things start moving, BIGGG",
  "Wants her chart in her hands before she books a Baddie Session or joins the coven 🦄",
];

const FAQ = [
  ["If you're new to astrology", "Babe, you don't need to know your rising from your elbow. Every placement is explained in plain bestie language as you read, so you'll finish knowing your chart better than half the astrology accounts on your feed. 😘"],
  ["If you don't know your birth time", "Write \"unknown\" in the birth time box at checkout and we work with what we've got. Your signs stay accurate, and the house sections are where a birth time makes the biggest difference, so if you can sweet-talk it out of a birth certificate or a family member, it's sooo worth the text."],
  ["How you get it", "The Bad B*tch Report lands in your inbox as a gorgeous PDF within 48 hours of buying, and a confirmation email with your birth details hits the second you pay, so you can double-check we've got them righttt."],
  ["Which one to start with", "If money is the LOUDEST thing in your life right now, hop on the Rich B*tch Rising waitlist. For everything else (confidence, visibility, desire, power and your big, outrageous dream) start with The Bad B*tch Report, which has a whole money chapter of its own anyway. 💸"],
  ["Who writes it", "Me, Betty, hiii. Every word comes from writing I've done for every sign and every house, matched to your exact chart and put together by hand for every single order, with a LOT of love and a candle lit. 🕯️"],
] as const;

function Card({ emoji, title, body, bg = "var(--pink-light)" }: { emoji: string; title: string; body: string; bg?: string }) {
  return (
    <div className="holo-edge" style={{ background: bg, border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px", color: "var(--dark)" }}>
      <div style={{ fontSize: 30, lineHeight: 1 }}>{emoji}</div>
      <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, marginTop: 10 }}>{title}</div>
      <p style={{ fontSize: 15, lineHeight: 1.65, margin: "6px 0 0" }}>{body}</p>
    </div>
  );
}

function Btn({ href, external, children, tone = "pink" }: { href: string; external?: boolean; children: React.ReactNode; tone?: "pink" | "dark" | "white" }) {
  const s = {
    pink: { background: "var(--pink)", color: "#fff", border: "2px solid var(--dark)" },
    dark: { background: "var(--dark)", color: "#fff", border: "2px solid var(--dark)" },
    white: { background: "#fff", color: "var(--dark)", border: "2px solid var(--dark)" },
  }[tone];
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="no-underline" style={{ ...s, fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 30px", display: "inline-block" }}>
      {children}
    </a>
  );
}

export default function ReportsPage() {
  return (
    <>
      <section className="px-5 md:px-8 overflow-hidden" style={{ background: "var(--lav)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="tag mb-6">✨ my szn reports</div>
            <h1 className="display" style={{ fontSize: "clamp(42px, 7.5vw, 96px)", color: "var(--dark)", lineHeight: 0.95 }}>
              your chart,
              <br />
              <span className="pk">in writing.</span>
            </h1>
            <p style={{ fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.65, color: "var(--dark)", maxWidth: 620, marginTop: 26, fontWeight: 600 }}>
              Two personalised reports written from your exact birth chart, one for your money and one for your confidence, because a woman who knows how she&apos;s wired is OBSESSED with herself in the most dangerous possible way.
            </p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 32 }}>
              <Btn href={BBR_BUY_URL} external>get the bad b*tch report</Btn>
              <Btn href="#reports" tone="white">see what&apos;s inside ↓</Btn>
            </div>
          </div>
          <div className="relative flex justify-center" style={{ minHeight: 440 }}>
            <div style={{ position: "absolute", left: "4%", top: 0 }}><Cover kind="rich-btch-rising" /></div>
            <div style={{ position: "absolute", right: "2%", top: 60 }}><Cover kind="bad-btch-report" /></div>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-4xl mx-auto" style={{ color: "#fff" }}>
          <div className="tag mb-5" style={{ color: "var(--pink)" }}>why your chart is sooo powerful</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 68px)", color: "#fff", lineHeight: 0.98 }}>
            a woman who knows herself <span className="pk">is the patriarchy&apos;s WORST nightmare.</span>
          </h2>
          <div style={{ fontSize: 18, lineHeight: 1.75, marginTop: 26, maxWidth: 740, fontWeight: 500, display: "grid", gap: 18 }}>
            <p>
              For centuries women have been told who to be by literally everyone except themselves: the church, the magazines, the bosses, the diet ads, the dads and the man at the barbecue with VERY strong opinions about your career. A woman who doesn&apos;t trust herself is sooo much easier to sell to, manage, underpay and keep busy, which is exactly why nobody ever handed you the manual to YOU. 🙄
            </p>
            <p>
              Your birth chart IS that manual, babe. It shows how you&apos;re built to make money, what you actually desire, how you lead, where your power lives and the exact spot where you learned to shrink, all written in the sky the second you took your first breath, long before anybody got the chance to tell you to calm down. Once you can see it, you stop outsourcing your decisions, stop apologising for taking up space and start trusting the one voice that&apos;s been right this whole entire time: yoursss. 💜
            </p>
            <p>
              Women who knew the moon, the plants and their own bodies used to get called witches, so reading your chart today is a gorgeous little revenge era, and knowing yourself this deeply is the most rebellious thing a woman can own. Get yours in writing. 🪐
            </p>
          </div>
        </div>
      </section>

      <section id="reports"className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto" style={{ display: "grid", gap: 28 }}>
          {REPORTS.map((r) => (
            <article key={r.kind} style={{ background: r.bg, color: r.ink, border: "var(--border)", borderRadius: 24, overflow: "hidden" }}>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
                <div style={{ padding: "36px 30px 34px" }}>
                  <span style={{ display: "inline-block", background: r.hot, color: r.bg === "var(--dark)" ? "#fff" : "var(--dark)", border: `1.5px solid ${r.ink}`, fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 99 }}>
                    {r.status}
                  </span>
                  <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 60px)", lineHeight: 0.98, marginTop: 18, color: r.ink }}>{r.name}</h2>
                  <div style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(18px, 2.2vw, 22px)", lineHeight: 1.25, marginTop: 10, color: r.hot }}>{r.promise}</div>
                  <p style={{ fontSize: 16.5, lineHeight: 1.7, marginTop: 18, fontWeight: 500 }}>{r.body}</p>
                  <div className="flex flex-wrap gap-2" style={{ marginTop: 22 }}>
                    {r.extras.map((x) => (
                      <span key={x} style={{ border: `1.5px solid ${r.ink}`, borderRadius: 99, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>{x}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, marginTop: 26 }}>
                    {r.price} · {r.delivery}
                  </div>
                  <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 16 }}>
                    {r.cta.external ? (
                      <Btn href={r.cta.href} external tone={r.bg === "var(--pink)" ? "dark" : "pink"}>{r.cta.label}</Btn>
                    ) : (
                      <Link href={r.cta.href} className="no-underline" style={{ background: "var(--dark)", color: "#fff", border: "2px solid var(--dark)", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 30px", display: "inline-block" }}>
                        {r.cta.label}
                      </Link>
                    )}
                    <Link href={r.more} style={{ color: r.ink, fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      read everything inside →
                    </Link>
                  </div>
                </div>
                <div style={{ borderTop: "var(--border)", padding: "32px 30px 30px", background: r.bg === "var(--dark)" ? "var(--pink-light)" : "#fff", color: "var(--dark)" }} className="lg:!border-t-0 lg:border-l-2">
                  <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>what&apos;s inside</div>
                  <ol style={{ listStyle: "none", padding: 0, margin: "14px 0 0" }}>
                    {r.inside.map((t, i) => (
                      <li key={t} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 10, alignItems: "baseline", padding: "11px 0", borderTop: "1.5px solid var(--dark)" }}>
                        <span style={{ fontFamily: pp, fontWeight: 900, fontSize: 20, color: "var(--pink)" }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ fontFamily: pp, fontWeight: 800, fontSize: 16, lineHeight: 1.25, textTransform: "uppercase" }}>{t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Band wide tone="pinkLight" tag="what changes" title="the woman who reads hers" accent="moves differently.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 30 }}>
          {CHANGES.map(([e, t, b]) => <Card key={t} emoji={e} title={t} body={b} bg="#fff" />)}
        </div>
      </Band>

      <Band wide tone="white" tag="what lands in your inbox" title="everything inside" accent="the bad b*tch report.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 30 }}>
          {TAKE_HOME.map(([e, t, b]) => <Card key={t} emoji={e} title={t} body={b} />)}
        </div>
        <div style={{ marginTop: 44 }}>
          <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 22 }}>💸 plus, inside rich b*tch rising</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 14 }}>
            {RBR_TAKE_HOME.map(([e, t, b]) => <Card key={t} emoji={e} title={t} body={b} bg="var(--lav-light)" />)}
          </div>
        </div>
      </Band>

      <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-5" style={{ color: "var(--pink)" }}>how it works</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "#fff", lineHeight: 1 }}>
            from your birth time <span className="pk">to your inbox.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 36 }}>
            {STEPS.map(([n, t, b]) => (
              <div key={n} style={{ background: "#fff", color: "var(--dark)", border: "2px solid #fff", borderRadius: 18, padding: "24px 22px 26px" }}>
                <div style={{ fontFamily: pp, fontWeight: 900, fontSize: 44, lineHeight: 1, color: "var(--pink)" }}>{n}</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, lineHeight: 1.2, textTransform: "uppercase", marginTop: 12 }}>{t}</div>
                <p style={{ fontSize: 15.5, lineHeight: 1.65, marginTop: 8 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betty-founder.png" alt="Betty Andrews" style={{ width: "100%", maxWidth: 280, aspectRatio: "4 / 5", objectFit: "cover", objectPosition: "center 20%", border: "var(--border)", borderRadius: 18 }} />
          <div style={{ color: "var(--dark)" }}>
            <div className="tag mb-5">who&apos;s writing it</div>
            <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 54px)", lineHeight: 1 }}>
              hiii my love, <span className="pk">i&apos;m betty.</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, marginTop: 20, fontWeight: 500 }}>
              I wrote these reports as the conversation I&apos;d have with you if we sat down with your chart between us, a very large coffee and absolutely zero filterrr, so every word is mine, every sign and every house got its own writing, and the version you get is matched to YOUR exact placements. Some of it will feel like a compliment, some of it will feel like being caught red-handed, and both are EXACTLY the point. 💖
            </p>
          </div>
        </div>
      </section>

      <Band tone="white" tag="this is for the woman who" title="this is SO" accent="for you if...">
        <ForYouIf items={FOR_YOU_IF} />
      </Band>

      <QuoteStrip ids={["chloe", "georgia", "lauren"]} label="what becoming her looks like" tone="lav" />

      <Band tone="white" tag="faq" title="all your" accent="questions.">
        {FAQ.map(([q, a]) => (
          <div key={q} style={{ borderTop: "var(--border)", padding: "18px 0" }}>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.02em" }}>{q}</div>
            <p style={{ marginTop: 8 }}>{a}</p>
          </div>
        ))}
      </Band>

      <section className="px-5 md:px-8 bg-glitter" style={{ borderBottom: "var(--border)", paddingTop: 84, paddingBottom: 92 }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
            your chart has been talking
            <br />
            <span className="pk">about you for yearsss.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#fff", marginTop: 22, fontWeight: 500, maxWidth: 620 }}>
            Grab The Bad B*tch Report and she&apos;s in your inbox within 48 hours, ready to be highlighted to within an inch of her life, then hop on the Rich B*tch Rising waitlist so you&apos;re first in line the SECOND the money report opens, because a baddie with her chart in her hands is a baddie nobody can talk out of her own life. ✨
          </p>
          <div className="flex flex-wrap gap-3" style={{ marginTop: 30 }}>
            <a href={BBR_BUY_URL} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ background: "var(--pink)", color: "#fff", border: "2px solid #fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 30px", display: "inline-block" }}>
              get my report · $88
            </a>
            <Link href="/reports/rich-btch-rising#waitlist" className="no-underline" style={{ background: "#fff", color: "var(--dark)", border: "2px solid #fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 30px", display: "inline-block" }}>
              join the money waitlist
            </Link>
          </div>
        </div>
      </section>

      <OfferCards exclude={["bad-btch-report", "rich-btch-rising"]} title="more ways into my szn" />
    </>
  );
}
