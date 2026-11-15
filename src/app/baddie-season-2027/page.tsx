import type { Metadata } from "next";
import { Band, ForYouIf } from "@/components/Offer";
import QuoteStrip from "@/components/QuoteStrip";
import { BADDIE_SEASON_2027 as S } from "@/lib/baddie-season-2027";

// Your Baddie Season: 2027. Betty's 2027 reading + activation: a personal 2027 report and a
// 90-minute 1:1 Zoom session with hypnosis. Black Friday $333 (normally $555), 20 sessions at this price.
// The page runs as one arc: what 2026 cost her, who she gets to be in 2027, what's inside, then claim it.

export const metadata: Metadata = {
  title: { absolute: "Your Baddie Season: 2027 | Reading + Activation with Betty | MY SZN" },
  description:
    "Your personal 2027 astrology report plus a 90-minute 1:1 Zoom activation with Betty, using hypnosis and energy work to step into the version of you who runs 2027. Black Friday $333, normally $555, only 20 sessions at this price.",
  alternates: { canonical: S.href },
  openGraph: {
    title: "Your Baddie Season: 2027 🔮",
    description: "Your 2027 reading and activation with Betty. Black Friday $333, only 20 sessions at this price.",
    url: S.href,
    type: "website",
    images: [S.image],
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

const cta = (bg: string) => ({ display: "inline-block", background: bg, color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "22px 44px", border: "2px solid #fff" });

const INSIDE = [
  {
    emoji: "🪐",
    label: "part one",
    title: "your 12-month astrology forecast",
    bg: "var(--pink)",
    body: "Your whole 2027, month by month, read from YOUR chart: the big transits landing on you, the eclipses shaking things up, your strongest months for money, love and being seen, and the exact dates to circle in red. You'll know where the year is taking you before it even starts.",
  },
  {
    emoji: "✨",
    label: "part two",
    title: "your manifestation blueprint",
    bg: "var(--lav)",
    body: "How YOU manifest, straight from your astrology and Human Design: what you're here to call in, the way your energy actually attracts it, the beliefs that have been blocking it, and the moves to make in 2027 so the money, the love and the dream life land in real life.",
  },
  {
    emoji: "🌀",
    label: "part three",
    title: "your private hypnosis activation",
    bg: "var(--pink-light)",
    body: "Ninety minutes on Zoom, just you and me. We go through your year together, then I take you into hypnosis to meet the version of you who's already living your 2027, so your body gets to feel her life before your bank account does. Energy work and mindset work come in wherever you need them.",
  },
];

const TAKE_HOME = [
  { emoji: "🎥", title: "Your Zoom recording", body: "The whole session, hypnosis included, to replay any morning you want to drop straight back into her." },
  { emoji: "🗓️", title: "Your 2027 power dates", body: "The days your chart lights up, so the launch, the big ask and the first date all land when the sky is backing you." },
  { emoji: "🔥", title: "Your becoming-her practice", body: "A short daily ritual from our session, so the activation keeps working long after we hang up." },
  { emoji: "💌", title: "Me, in your corner", body: "Prep before we meet, a plan after, and a woman who has studied your chart properly cheering you into the new year." },
];

const STEPS = [
  { n: "01", title: "Claim your spot", body: `One of ${S.spots} at the Black Friday price. Pay, then pop your birth details in on the very next page.` },
  { n: "02", title: "I read your 2027", body: "I sit with your astrology and your Human Design and write your 12-month forecast and your manifestation blueprint around the life you told me you want." },
  { n: "03", title: "We meet on Zoom", body: "I'll be in your inbox to find a time that works for your time zone, then we go through your year and do the activation together." },
  { n: "04", title: "You walk into 2027 as HER", body: "Forecast, blueprint, recording and power dates in hand, and the version of you who runs 2027 already moving in. ✨" },
];

const AFTER = ["she knows her year", "she charges more", "she says the big thing out loud", "she stops waiting", "she lets it be easy"];

const FAQ = [
  ["Do I need to know astrology?", "Not even a little bit, babe. I read the whole chart for you and explain everything in plain words. You just bring the dreams."],
  ["What does the hypnosis feel like?", "Like the deepest, most delicious daydream. You stay awake, aware and completely in control the whole time, lying down with your eyes closed while I guide you into her life. Most baddies come out floating."],
  ["When do we meet?", "Straight after you pay I'll be in your inbox to book a time that suits you, wherever you are in the world, and your forecast and blueprint are ready for our session."],
  ["Why is it $333?", `It's my Black Friday price, and it's only open for ${S.spots} sessions, so it's exclusive on purpose. After that, Your Baddie Season: 2027 goes back to $${S.wasUsd}.`],
  ["Can I reschedule or get a refund?", "Give me at least 48 hours' notice and we'll move your session once, no drama. My prep starts the moment you book, so sessions are non-refundable, but if something big comes up, email me and we'll work it out."],
  ["Is this therapy?", "No, babe. This is coaching, so it isn't therapy, counselling or medical, psychological or financial advice, and it never replaces any of those. If you're in crisis or struggling with your mental health, please reach out to a medical professional or your local support line first."],
] as const;

function Price({ ink = "#fff" }: { ink?: string }) {
  return (
    <span style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, color: ink }}>
      ${S.priceUsd} <span style={{ textDecoration: "line-through", margin: "0 6px" }}>${S.wasUsd}</span> · only {S.spots} sessions at this price
    </span>
  );
}

export default function BaddieSeason2027Page() {
  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 overflow-hidden" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🔮 black friday · only {S.spots} sessions at this price</span>
            <h1 className="display" style={{ fontSize: "clamp(48px, 7.5vw, 100px)", color: "#fff", lineHeight: 0.95, marginTop: 24 }}>
              your baddie season:
              <br />
              <span className="pk">2027.</span>
            </h1>
            <p style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(19px, 2.2vw, 24px)", color: "var(--pink)", margin: "22px 0 0", lineHeight: 1.3 }}>A 12-month forecast, manifestation blueprint and private hypnosis activation, made for YOU.</p>
            <div style={{ fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.65, color: "#fff", fontWeight: 600, maxWidth: 620, marginTop: 16 }}>
              <p style={{ margin: "0 0 12px" }}>Babyyy, what if 2027 is the year you finally get everything you&apos;ve been manifesting? 🔮</p>
              <p style={{ margin: 0 }}>I&apos;ve created something very special for you: your 12-month astrology forecast, your manifestation blueprint and a private hypnosis activation with me, all fully custom and designed around you, your dreams and the life you want to create. You show up as you, and you leave as HER. 💖</p>
            </div>
            <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 32 }}>
              <a href={S.buyUrl} target="_blank" rel="noopener noreferrer" className="no-underline" style={cta("var(--pink)")}>claim my 2027</a>
              <Price />
            </div>
          </div>
          <div className="flex justify-center" style={{ position: "relative" }}>
            <div className="holo-edge" style={{ width: "min(440px, 86vw)", borderRadius: 24, overflow: "hidden", transform: "rotate(2deg)", boxShadow: "12px 14px 0 var(--pink)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={S.image} alt="Betty in a pink witch hat, black satin dress and pink feather gloves" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <span className="holo-sticker" style={{ position: "absolute", top: -10, right: 4, zIndex: 5, transform: "rotate(7deg)", fontSize: 12 }}>✨ reading + activation</span>
          </div>
        </div>
      </section>

      {/* The feeling */}
      <Band tone="pinkLight" tag="close your eyes for a sec" title="imagine it's" accent="december 2027.">
        <p>
          Imagine looking back at December 2027 and realising you&apos;ve made more dollars than ever before, started that business, travelled to the places you always dreamed of, found incredible friendships, fallen completely in love with your life, and become the woman your younger self would be so f*cking proud of. 🥹
        </p>
        <p>
          That woman is already in your chart, my love. 2026 asked SO much of you, you held it together for everyone and kept your own big life at the bottom of the to-do list, and I refuse to let you drag that version of you into a brand new year. Your chart already knows what 2027 is bringing you, and you deserve to know it too, so you can stop guessing and start choosing.
        </p>
        <p style={{ fontWeight: 800 }}>This is your permission slip to go into 2027 as the main character. 🔥</p>
      </Band>

      {/* What's inside */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">what you get</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
            made for you, <span className="pk">your dreams and your life.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, marginTop: 22, maxWidth: 720, fontWeight: 500, color: "var(--dark)" }}>
            A 12-month astrology forecast, a manifestation blueprint and a private hypnosis activation, all fully custom, all designed around you, your dreams and the life you want to create. Nobody else on earth gets this exact reading, because nobody else has your chart. 💖
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginTop: 36 }}>
            {INSIDE.map((c) => (
              <div key={c.title} style={{ background: c.bg, color: "var(--dark)", border: "var(--border)", borderRadius: 22, padding: "28px 26px 30px" }}>
                <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>{c.emoji} {c.label}</div>
                <div className="display" style={{ fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1, marginTop: 8 }}>{c.title}</div>
                <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 14, fontWeight: 500 }}>{c.body}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 28 }}>
            {TAKE_HOME.map((t) => (
              <div key={t.title} style={{ border: "var(--border)", borderRadius: 18, background: "var(--pink-light)", padding: "20px 20px 22px", color: "var(--dark)" }}>
                <div style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>{t.emoji} {t.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.65 }}>{t.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who she becomes */}
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5" style={{ color: "var(--pink)" }}>this time next year</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 68px)", color: "#fff", lineHeight: 0.98 }}>
            picture her. <span className="pk">now go be her.</span>
          </h2>
          <p style={{ color: "#fff", fontSize: 18, lineHeight: 1.7, marginTop: 26, maxWidth: 720, fontWeight: 500 }}>
            Hypnosis lets you live inside her life before it arrives: how she wakes up, what she charges, who she lets in, how it feels to finally have it. Once your body has felt that, going back to the old you feels like wearing someone else&apos;s clothes, so you just keep walking forward. 💅
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "34px 0 0", borderTop: "1.5px solid #fff" }}>
            {AFTER.map((l, i) => (
              <li key={l} style={{ fontFamily: pp, fontWeight: 900, fontSize: "clamp(24px, 4.6vw, 44px)", textTransform: "uppercase", lineHeight: 1, padding: "12px 0", borderBottom: "1.5px solid #fff", color: i % 2 ? "#fff" : "var(--pink)", letterSpacing: "-0.02em" }}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">how it works</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
            from booking <span className="pk">to becoming her.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 32 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ border: "var(--border)", borderRadius: 18, background: "#fff", padding: "22px 22px 24px", color: "var(--dark)" }}>
                <div style={{ fontFamily: pp, fontWeight: 900, fontSize: 34, lineHeight: 1, color: "var(--pink)" }}>{s.n}</div>
                <div style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, lineHeight: 1.2, marginTop: 10 }}>{s.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.65, marginTop: 6 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Band tone="white" tag="this is for you if" title="you're ready to make 2027" accent="the year it happens.">
        <ForYouIf
          items={[
            "You've been saying \"next year\" for a few years now and you're SO done saying it",
            "You want more money, more love and more visibility in 2027, and you want to know exactly when to go for each one 💸",
            "You love your astrology and Human Design and want someone to turn them into a real plan for your year",
            "You keep getting close to the big thing and then talking yourself out of it, and you want that pattern gone",
            "You want to start January feeling like her already, with the hard part done before the year even begins",
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

      <section id="buy" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92 }}>
        <div className="max-w-3xl mx-auto">
          <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🔮 only {S.spots} sessions at this price</span>
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98, marginTop: 22 }}>
            2027 is already yours.
            <br />
            <span className="pk">come and claim it.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#fff", marginTop: 22, fontWeight: 500, maxWidth: 640 }}>
            Your 12-month astrology forecast, your manifestation blueprint and a 90-minute private hypnosis activation with me on Zoom, for ${S.priceUsd} instead of ${S.wasUsd}. I&apos;m only doing {S.spots} sessions at this Black Friday price, and once they&apos;re gone, they&apos;re gone. Your baddie season starts the second you book, my love. ✨
          </p>
          <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 32 }}>
            <a href={S.buyUrl} target="_blank" rel="noopener noreferrer" className="no-underline" style={cta("var(--pink)")}>claim my 2027</a>
            <Price />
          </div>
        </div>
      </section>
    </>
  );
}
