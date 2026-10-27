import type { Metadata } from "next";
import Link from "next/link";
import { OfferHero, WaitlistBand } from "@/components/Offer";
import CovenExplorer from "@/components/CovenExplorer";
import CovenCountdown from "@/components/CovenCountdown";
import { MEMBER_QUOTES } from "@/lib/member-quotes";
import { OFFERS, PODCAST, type OfferSlug } from "@/lib/offers";

// The Baddie Coven: the ongoing creative, magical membership (what the MY SZN membership becomes,
// Oct 2026). Waitlist only, no price or start date confirmed; /membership redirects here.
// Built as a sales page in twelve sections (Betty's structure, 22 Oct 2026): desire, then
// transformation, then membership. Each section has one job, so no idea is sold twice.

export const metadata: Metadata = {
  title: "The Baddie Coven, a Magical Membership for Women",
  description:
    "A coven for women who are done hiding their magic and ready to discover their soul blueprint, reclaim their power, make their own money, express themselves wildly and create their most extraordinary lives. Join the waitlist.",
  alternates: { canonical: "/baddie-coven" },
  openGraph: {
    title: "The Baddie Coven 🦄",
    description: "Become more of who you are. Create the life you came here to live. Waitlist open now.",
    url: "/baddie-coven",
    type: "website",
    // A designed share card (her photo + foil "the baddie coven" sticker), so links on Threads,
    // Instagram and WhatsApp look like the page instead of plain text.
    images: [{ url: "/coven/og-baddie-coven.jpg", width: 1200, height: 630, alt: "The Baddie Coven: your coven is calling. Opens 5 November." }],
  },
  twitter: { card: "summary_large_image", images: ["/coven/og-baddie-coven.jpg"] },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

// Every picture on the page lives here, so swapping in new photos is a one-line change per slot.
// Drop new files in /public/coven/ and point the slot at them.
const PICS = {
  becoming: "/coven/baddie-money-pink.jpg",
  creative: "/astrology-journaling.png",
  astrology: "/cosmic-planet.png",
  money: "/cosmic-money.png",
  witchy: "/eclipse-moon.png",
  shadow: "/libra-moon.png",
  people: "/waitlist-email-hero.jpg",
  betty: "/betty-founder.png",
};

// 02: the shrinking habits she'll recognise herself in.
const SMALL = [
  ["🙊", "You've got the idea, the instinct and the vision, buttt you keep waiting for somebody to hand you a permission slip before you let yourself go for it."],
  ["🫠", "You're the one everybody calls when they need something, which is lovely, except your own dreams have been sitting in the waiting room for YEARS."],
  ["🔮", "You get a gut hit, ignore it, ask four friends what they think, then watch everything play out exactly how your intuition told you it would. Every. Single. Time."],
  ["🤐", "You tone yourself down in rooms that should be thrilled to have you, because somewhere along the way you learned that being too much was dangerous."],
];

// 03: her future self, one trait per card.
const HER = [
  ["✨", "She trusts her gut the first time, makes the decision and gets on with her day while everyone else is still drafting pros and cons lists."],
  ["💸", "She has her OWN money, prices that make her slightly giddy and absolutely zero guilt about receiving every last dollar of it."],
  ["🎨", "She makes things for the pure joy of it, wears the outrageous outfit and lets her weirdness become the most magnetic thing about her."],
  ["🪐", "She knows her chart and her design inside out, so she builds success the way SHE is wired to, instead of squeezing into someone else's blueprint."],
  ["🪩", "She's surrounded by women who send voice notes screaming YESSSSS when she wins, and she does the same for them, loudly and often."],
  ["👑", "She walks into rooms like she belongs there, because she finally decided she does."],
];

// 04: what the blueprint shows, and which part of the chart or design shows it.
const BLUEPRINT = [
  ["your gifts", "Your Sun, Moon, rising and the planets clustered in your chart show the talents you were literally born holding, the stuff that comes sooo easily you've assumed everybody can do it (they can't, babe)."],
  ["your desires", "Venus shows what you're magnetised to and what you find beautiful, so you stop chasing what you were told to want and start going after what actually lights you up."],
  ["your patterns", "Saturn, Chiron, Pluto and your open centres in Human Design point straight at where you shrink, overgive or overthink, which turns shadow work into a verrrry precise treasure map."],
  ["your purpose", "Your North Node and Midheaven show the direction your soul is growing in and the legacy you're here to build, which feels waaaay better than chasing goals off somebody else's vision board."],
  ["your way of winning", "Your Human Design type and strategy show how you're built to decide and create momentum, so a Generator follows what she responds to, a Projector stops hustling for scraps of recognition and a Manifestor finally just MOVES."],
];

// 05: the six pillars, sharpened to what changes in her.
const PILLARS = [
  {
    emoji: "🪐",
    title: "01. Astrology + self-discovery",
    img: PICS.astrology,
    body: [
      "Birth chart deep dives, Human Design experiments and the astrology of each month, turned into real decisions about your money, your love life, your career and your creativity.",
      "You'll go from googling your placements at 1am to understanding exactly how your chart works and using it to make braver, smarter, waaaay more aligned choices.",
      "A baddie can understand planetary rulerships, babe.",
    ],
  },
  {
    emoji: "🌑",
    title: "02. Shadow work",
    img: PICS.shadow,
    body: [
      "We go gently but deeeeply into the beliefs you inherited, the good-girl conditioning and the versions of yourself you've been performing for other people.",
      "Month by month you stop abandoning yourself to keep the peace, set the boundary, say the true thing and feel MORE like yourself than you have in years.",
      "Expect the occasional extremely satisfying revelation.",
    ],
  },
  {
    emoji: "💸",
    title: "03. Manifestation + money magic",
    img: PICS.money,
    body: [
      "Money bowls, prosperity rituals and manifestation experiments sit right alongside the very real work of raising your prices, negotiating your salary, investing and receiving without flinching.",
      "You'll rewrite the stories that kept you playing broke and build a relationship with money that feels powerful, playful and verrrry profitable.",
      "We LOVE a witch with financial independence.",
    ],
  },
  {
    emoji: "🕯️",
    title: "04. Witchcraft + rituals",
    img: PICS.witchy,
    body: [
      "Moon rituals, candle magic, tarot, spellwork and seasonal celebrations, with the history and symbolism behind each practice so you can make your own magic with total confidence.",
      "Your rituals become anchors that help you set intentions, follow through and feel deliciously connected to something bigger than your to-do list.",
      "Light the candle you've been saving. This IS the special occasion.",
    ],
  },
  {
    emoji: "🪩",
    title: "05. Sisterhood",
    img: PICS.people,
    body: [
      "A coven of women who celebrate your wins, get your particular brand of weird and cheer you on through every single reinvention.",
      "This one matters sooo much it gets a whole section of its own further down.",
      "More women cheering for women. 💜",
    ],
  },
];

// 06: what a month inside actually holds. Only what Betty has described; dates go to the waitlist.
const MONTH = [
  ["🕯️", "one coven circle a month", "Once a month the whole coven gathers live for our circle, where we work with that month's magic together, share what's moving and leave with our power turned UP."],
  ["📱", "your personalised platform", "A platform built around YOUR birth chart and Human Design, so the astrology of the month, your season and everything you open is written for you, every single day."],
  ["🫶", "astrotapping™", "We take the theme of each month's astrology and tap it into your body with astrotapping™, so you EMBODY the sky instead of just reading about it."],
  ["🌙", "moon rituals", "Lunar rituals waiting in your platform for every new and full moon, to set intentions, release what you're done carrying and manifest in rhythm with the moon."],
  ["🌑", "shadow work prompts", "Personalised reflection prompts for the parts of yourself you've kept hidden, with plenty of self-compassion."],
  ["💬", "coven chat rooms", "Private chat rooms for the coven, open all month long, where you share your wins, ask about your astrology, celebrate breakthroughs and recommend the book that changed your life."],
];

// 08: the checklist she recognises herself in.
const FIT = [
  "💜 Your idea of a fabulous evening involves tarot cards, a creative project, delicious snacks and women who make you laugh until your face hurts.",
  "🦄 You believe women deserve their own money, independence, pleasure, ambitions and whatever wonderfully unconventional lives they want to create.",
  "🔮 You know your Big Three by heart and you're DYING to know what the rest of your chart says about you.",
  "🎨 You've been craving more creativity, colour, imagination and things that make you feel like a kid again.",
  "🌑 You're interested in shadow work, self-discovery and understanding the parts of yourself you've spent years trying to keep hidden.",
  "💸 You want to explore money manifestation, work on your relationship with receiving and celebrate women who are building financial independence.",
  "🌕 You've cried at a full moon, journalled about it and then sent screenshots of the journal to the group chat.",
  "🪩 You've been looking for a group of women who are ambitious, compassionate, creative, interesting and just the right amount of F*CKING UNHINGED.",
];

// 10: real quotes from MY SZN, labelled as such. The coven hasn't opened, so none are coven reviews.
const QUOTES = ["maya", "georgia", "aisha", "lauren", "priya", "zara"];

// 11: the practical bits. Nothing here promises a price or a date that isn't confirmed.
const FAQS = [
  ["How does the Baddie Coven work?", "Every month brings one live coven circle, plus your personalised platform with the astrology of the month, astrotapping™, moon rituals and shadow work prompts, and private chat rooms to talk it all through with the rest of the coven. The full membership details go to the waitlist first."],
  ["I'm a total beginner. Can I join?", "YESSS. You can be a serious businesswoman who casts spells, an astrologer who loves fashion or somebody who bought her very first tarot deck this week. Curiosity is the only requirement."],
  ["Is it online?", "It is, so you can join from anywhere in the world and connect with witchy women everywhere, wearing whatever you like."],
  ["Do I need art supplies or witchy tools?", "You don't need to be an artist, own expensive supplies or make anything remotely Instagram-worthy. Bring a notebook, your curiosity and that candle you've been saving."],
  ["How much will it cost?", "Founding witches pay $44 a month, locked in for as long as you stay. That's your monthly coven circle, your personalised platform with the astrology of every season, the rituals, the prompts and the coven chat rooms. Founding spots are limited, and once they're gone the price goes up, so the waitlist gets first dibs. 💸"],
  ["When can I join?", "The coven opens on 5 November for three days only, and the waitlist hears first. Our FIRST EVER coven event is the 11/11 manifestation workshop, and you'll want to be there. 🪄"],
];

const wrap = "max-w-6xl mx-auto";
const h2 = { fontSize: "clamp(32px, 5vw, 58px)", lineHeight: 1 } as const;
const copy = { fontSize: 16.5, lineHeight: 1.7, margin: "0 0 14px" } as const;
const card = { border: "var(--border)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" } as const;
const cta = { display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px" } as const;

function Section({ bg, ink = "var(--dark)", children }: { bg: string; ink?: string; children: React.ReactNode }) {
  return (
    <>
      <section className="px-5 md:px-8" style={{ background: bg, color: ink, borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 76 }}>
        <div className={wrap}>{children}</div>
      </section>
      {/* a thin foil seam between sections */}
      <div className="hd-foil" aria-hidden="true" style={{ height: 8, borderBottom: "var(--border)" }} />
    </>
  );
}

function Head({ n, tag, title, accent }: { n: string; tag: string; title: string; accent: string }) {
  return (
    <>
      <div className="mb-5">
        <span className="holo-sticker" style={{ transform: `rotate(${Number(n) % 2 ? -3 : 2}deg)` }}>{n} · {tag}</span>
      </div>
      <h2 className="display" style={h2}>{title} <span className="pk">{accent}</span></h2>
    </>
  );
}

// A four-point foil sparkle, cut from the site's holographic foil.
const SPARKLE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z'/%3E%3C/svg%3E")`;
function HoloStar({ size = 44, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <span className="holo-shape-wrap" aria-hidden="true" style={{ position: "absolute", zIndex: 4, pointerEvents: "none", ...style }}>
      <span className="holo-shape" style={{ width: size, height: size, ["--shape" as string]: SPARKLE } as React.CSSProperties} />
    </span>
  );
}

/** An emoji in a foil circle, for the top of a card. */
function FoilEmoji({ e }: { e: string }) {
  return (
    <span className="hd-foil" style={{ width: 50, height: 50, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 24, boxShadow: "3px 3px 0 var(--dark)" }}>{e}</span>
  );
}

function Statement({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "pink" }) {
  return (
    <div className="holo-edge" style={{ marginTop: 28, border: "var(--border)", borderRadius: 18, background: tone === "dark" ? "var(--dark)" : "var(--pink)", color: "#fff", padding: "22px 24px", fontFamily: pp, fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 800, lineHeight: 1.3 }}>
      {children}
      <HoloStar size={46} style={{ top: -22, right: 26, transform: "rotate(12deg)" }} />
      <HoloStar size={24} style={{ bottom: -12, left: 34 }} />
    </div>
  );
}

function Pic({ src, ratio = "4 / 5", label }: { src: string; ratio?: string; label?: string }) {
  return (
    <div style={{ position: "relative" }}>
      <div className="holo-edge" style={{ border: "var(--border)", borderRadius: 22, overflow: "hidden", background: "var(--lav)", boxShadow: "8px 8px 0 var(--dark)", aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" aria-hidden="true" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      {label && <span className="holo-sticker" style={{ position: "absolute", top: -14, left: 18, zIndex: 5, transform: "rotate(-5deg)", fontSize: 12 }}>{label}</span>}
      <HoloStar size={38} style={{ bottom: -16, right: -10, transform: "rotate(-8deg)" }} />
    </div>
  );
}

/** The rest of MY SZN, kept small so it never competes with the waitlist. */
function MoreMySzn() {
  const links = [
    ...(["rich-btch-rising", "bad-btch-report", "mastermind", "retreat", "book"] as OfferSlug[]).map((s) => OFFERS[s]),
    PODCAST,
  ];
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 34, paddingBottom: 38 }}>
      <div className={`${wrap} flex flex-wrap items-center gap-3`}>
        <span className="tag" style={{ marginRight: 6 }}>more my szn</span>
        {links.map((o) => (
          <Link key={o.href} href={o.href} className="no-underline" style={{ border: "var(--border)", borderRadius: 999, background: "#fff", color: "var(--dark)", padding: "8px 14px", fontFamily: pp, fontSize: 13, fontWeight: 800 }}>
            {o.emoji} {o.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function BaddieCovenPage() {
  return (
    <>
      {/* 01 · The hero */}
      <OfferHero
        offer="baddie-coven"
        art={
          <div style={{ position: "relative" }}>
            <div className="holo-edge" style={{ width: "min(380px, 82vw)", borderRadius: 22, overflow: "hidden", transform: "rotate(2deg)", boxShadow: "10px 12px 0 var(--dark)", background: "var(--lav-light)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/coven/baddie-pink-email.jpg" alt="A baddie in a pink puff-sleeve top, hand on hip" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <span className="holo-sticker" style={{ position: "absolute", top: -12, right: -6, zIndex: 5, transform: "rotate(7deg)", fontSize: 12 }}>🦄 baddies only</span>
            <HoloStar size={58} style={{ bottom: -24, left: -26, transform: "rotate(-10deg)" }} />
            <HoloStar size={28} style={{ top: 70, left: -18 }} />
          </div>
        }
        tone="lav"
        kicker="waitlist open now"
        title="the baddie"
        accent="coven."
        intro={
          <>
            <p>Baddie Coven is for women who want to live BIG lives, manifest outrageous things, heal their sh*t, make seriouuuus money, explore their magic and become completely obsessed with their own lives.</p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 20 }}>
              {["🔮 witchcraft", "🪐 astrology", "💸 money magic", "🕯️ monthly coven circle", "🌕 moon rituals"].map((t) => (
                <span key={t} className="holo-sticker">{t}</span>
              ))}
            </div>
            {/* The launch: a three-day window, then the first big event. */}
            <div className="holo-edge" style={{ marginTop: 22, background: "#fff", border: "2px solid var(--dark)", borderRadius: 16, padding: "16px 20px", maxWidth: 620 }}>
              <span className="holo-sticker" style={{ fontSize: 12, marginBottom: 10, transform: "rotate(-2deg)" }}>🪄 11/11 · our first ever event</span>
              <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>✨ The coven opens 5 November, for 3 days only.</div>
              <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.6, fontWeight: 700 }}>Founding witches get in at <span style={{ color: "var(--pink)" }}>$44 a month, locked in for as long as you stay</span>. Founding spots are limited, and the price goes up after that. 💸</p>
              <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>Our FIRST EVER event is the <strong>11/11 manifestation workshop</strong>, because of course we&apos;re spending the most magical date of the year manifesting baddies. Get on the waitlist so you&apos;re first in.</p>
              <CovenCountdown />
            </div>
          </>
        }
      />

      {/* 02 · Make her feel understood. */}
      <Section bg="#fff">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div>
            <Head n="02" tag="sound familiar" title="you've been playing small for" accent="far too f*cking long." />
            <p style={{ ...copy, marginTop: 22, fontWeight: 700, fontSize: 18 }}>You&apos;ve spent enough of your life making yourself smaller, questioning your intuition, hiding your gifts, worrying what people think and putting your biggest dreams on hold while you try to become the woman everyone else expects you to be.</p>
            <p style={copy}>That shrinking is conditioning you picked up from a world that rewards good girls for staying small, and conditioning can be unlearned, one witchy, chart-informed, deeply satisfying step at a time.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SMALL.map(([e, t]) => (
              <div key={e} className="holo-edge" style={{ ...card, background: "var(--pink-light)" }}>
                <FoilEmoji e={e} />
                <p style={{ ...copy, fontSize: 15.5, margin: "10px 0 0" }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
        <Statement tone="pink">F*CK THAT. WE&apos;VE GOT BIGGER PLANS FOR YOU. 🔥</Statement>
      </Section>

      {/* 03 · Paint her future self. */}
      <Section bg="var(--pink-light)">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <Head n="03" tag="your future self" title="meet the woman you're" accent="here to become." />
            <p style={{ ...copy, marginTop: 22, fontWeight: 700, fontSize: 18 }}>The kind of life where you&apos;re following your wildest ideas, doing things that scare you in the best possible way, exploring your creativity, making incredible friends and finally giving yourself permission to want absolutely EVERYTHING.</p>
            <p style={copy}>She already lives in you, my love, and she&apos;s been waiting sooooo patiently for you to let her out.</p>
          </div>
          <Pic src={PICS.becoming} ratio="1 / 1" label="✨ future you" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 36 }}>
          {HER.map(([e, t]) => (
            <div key={e} className="holo-edge" style={card}>
              <FoilEmoji e={e} />
              <p style={{ ...copy, fontSize: 15.5, fontWeight: 600, margin: "10px 0 0" }}>{t}</p>
            </div>
          ))}
        </div>
        <Statement>Your inner child, teenage witch and future rich b*tch are ALL invited. ✨</Statement>
      </Section>

      {/* 04 · The philosophy: the soul blueprint. */}
      <Section bg="var(--dark)" ink="#fff">
        <Head n="04" tag="the baddie coven philosophy" title="your soul blueprint is the" accent="assignment." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginTop: 24 }}>
          <p style={{ ...copy, fontSize: 18, fontWeight: 700 }}>We&apos;re bringing together astrology, Human Design, manifestation, shadow work, creativity, witchcraft and a fabulous community of women to help you discover your unique soul blueprint and become MORE of who you truly are.</p>
          <p style={copy}>We&apos;re talking about understanding your gifts, healing the patterns that keep you playing small, expressing yourself without apology, making your own money, trusting your intuition and creating a life that makes you ridiculously excited to wake up every morning.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" style={{ marginTop: 26 }}>
          {BLUEPRINT.map(([t, b]) => (
            <div key={t} className="holo-edge" style={{ ...card, overflow: "hidden" }}>
              <div className="hd-foil" aria-hidden="true" style={{ height: 12, margin: "-20px -20px 16px", borderBottom: "var(--border)" }} />
              <div className="display" style={{ fontSize: 24, lineHeight: 1, color: "var(--pink)" }}>{t}</div>
              <p style={{ ...copy, fontSize: 14.5, lineHeight: 1.6, margin: "12px 0 0" }}>{b}</p>
            </div>
          ))}
        </div>
        <Statement tone="pink">Every woman in the coven grows from her OWN blueprint, so your chart, your design and your magic decide how you rise, instead of a one-size-fits-all programme telling you who to be.</Statement>
      </Section>

      {/* 05 · The six pillars, one tabbed panel. */}
      <Section bg="#fff">
        <Head n="05" tag="inside the coven 🪄" title="choose what you" accent="need, baddie." />
        <CovenExplorer items={PILLARS} />
      </Section>

      {/* 06 · What a month inside holds. */}
      <Section bg="var(--lav-light)">
        <Head n="06" tag="every month inside" title="your monthly" accent="dose of magic." />
        {/* The first big event, so nobody misses it. No time is set yet, so only the date. */}
        <div className="holo-edge grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center" style={{ ...card, marginTop: 30, padding: "26px 28px", background: "var(--dark)", color: "#fff", boxShadow: "8px 8px 0 var(--pink)", position: "relative" }}>
          <div className="hd-foil" style={{ position: "relative", border: "var(--border)", borderRadius: 18, padding: "16px 22px", textAlign: "center", color: "var(--dark)", transform: "rotate(-3deg)", boxShadow: "4px 4px 0 #fff", justifySelf: "start" }}>
            <div style={{ fontFamily: pp, fontSize: 52, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em" }}>11/11</div>
            <div style={{ fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 6 }}>save the date</div>
            <span style={{ position: "absolute", top: -16, right: -18, transform: "rotate(10deg)", background: "#fff", border: "var(--border)", borderRadius: 999, padding: "5px 12px", fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)", whiteSpace: "nowrap" }}>✦ first ever ✦</span>
          </div>
          <div>
            <div style={{ fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--pink)" }}>✨ save the f*cking date</div>
            <div style={{ fontFamily: pp, fontSize: "clamp(24px, 3.4vw, 34px)", fontWeight: 800, lineHeight: 1.1, margin: "8px 0 10px" }}>our FIRST EVER coven event: <span style={{ color: "var(--pink)" }}>the 11/11 manifestation workshop.</span></div>
            <p style={{ ...copy, margin: 0 }}>The most manifest-y moment of the ENTIRE year, and you KNOW we&apos;ll be there with candles lit, intentions SET and the most outrageous version of our lives on ordeeeer. Because of course we are. 🪄</p>
            <p style={{ ...copy, margin: "12px 0 0", fontFamily: pp, fontWeight: 800 }}>The night the Baddie Coven begins, and you&apos;ll want to say you were there. 💜</p>
          </div>
          <HoloStar size={44} style={{ top: -20, right: 30, transform: "rotate(12deg)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 32 }}>
          {MONTH.map(([e, t, b]) => (
            <div key={t} className="holo-edge" style={card}>
              <div className="flex items-center gap-3">
                <FoilEmoji e={e} />
                <span style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, lineHeight: 1.15 }}>{t}</span>
              </div>
              <p style={{ ...copy, fontSize: 15.5, margin: "12px 0 0" }}>{b}</p>
            </div>
          ))}
        </div>
        <p style={{ ...copy, fontWeight: 700, margin: "24px 0 0" }}>A little pocket of magic in the middle of your everyday life, with the full calendar going to the waitlist first. 🗓️</p>
      </Section>

      {/* 07 · Sisterhood gets its own big section. */}
      <Section bg="var(--pink-light)">
        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
          <Pic src={PICS.people} label="🪩 your people" />
          <div>
            <Head n="07" tag="sisterhood" title="find your" accent="people." />
            <p style={{ ...copy, marginTop: 22, fontWeight: 700, fontSize: 18 }}>Imagine being able to tell a group of women that you&apos;ve just manifested a new client, pulled the Tower card three times in a week, booked a solo adventure or decided to completely reinvent your life.</p>
            <p style={copy}>They celebrate with you, share their own experiences and encourage you to keep going.</p>
            <p style={copy}>The Baddie Coven is a place for conversations, creativity, laughter, connection and women who genuinely want to see each other happy.</p>
            <p style={copy}>You can share your latest project, ask about your astrology, celebrate a breakthrough, recommend a book or simply enjoy having women around who understand your particular brand of weird.</p>
          </div>
        </div>
        <Statement>More friendship. More magic. More women cheering for women. 🪩</Statement>
      </Section>

      {/* 08 · The checklist. */}
      <Section bg="#fff">
        <Head n="08" tag="you'll fit right in if" title="this coven has your name written" accent="ALL over it." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 32 }}>
          {FIT.map((f) => {
            const [emoji, ...rest] = f.split(" ");
            return (
              <div key={f} className="holo-edge flex items-start gap-3" style={{ ...card, padding: "16px 18px", background: "var(--pink-light)" }}>
                <span aria-hidden="true" className="hd-foil" style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, border: "var(--border)", color: "var(--dark)", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 800 }}>✓</span>
                <p style={{ ...copy, fontSize: 15.5, fontWeight: 600, margin: 0 }}>{rest.join(" ")} {emoji}</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 28 }}>
          <p style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.3, margin: 0, maxWidth: 640 }}>If you&apos;ve ever wished you had your own little coven of magical women, you&apos;ve found your invitation.</p>
          <a href="#waitlist" className="no-underline btn-pink" style={cta}>💜 join the waitlist</a>
        </div>
      </Section>

      {/* 09 · Meet the head witch. */}
      <Section bg="var(--lav-light)">
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
          <Pic src={PICS.betty} label="🔮 your head witch" />
          <div>
            <Head n="09" tag="meet your head witch" title="hi, i'm" accent="betty. 🔮" />
            <p style={{ ...copy, marginTop: 22, fontWeight: 700, fontSize: 18 }}>I&apos;ve spent nearly two decades obsessed with astrology, manifestation, shadow work and the deliciously witchy art of becoming yourself, and I&apos;ve written two published books about it along the way.</p>
            <p style={copy}>The biggest project I&apos;ve ever worked on wasn&apos;t my business. It was me. I spent years rebuilding my self-worth from the ground up, learning to love myself, building confidence, creating a business and healing things I didn&apos;t even know were broken.</p>
            <p style={copy}>Now my whole mission is helping women become more powerful, more prosperous and more FREE, using their astrology, their Human Design and a whole lot of magic, and the Baddie Coven is where I get to do that with alllll of you at once.</p>
            <p style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.3, margin: "18px 0 0" }}>You can&apos;t hate yourself into a version of yourself that you love.</p>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 20 }}>
              {["libra sun", "aquarius moon", "aquarius rising", "manifestor 4/6"].map((c) => (
                <span key={c} className="holo-sticker" style={{ fontSize: 12 }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 10 · Proof, clearly labelled as coming from MY SZN, not the coven. */}
      <Section bg="#fff">
        <Head n="10" tag="real women, real results" title="the magic is" accent="already happening." />
        <p style={{ ...copy, marginTop: 20, maxWidth: 760 }}>These are from women inside MY SZN, my membership and coaching programmes. The Baddie Coven hasn&apos;t opened yet, so think of these as a little taste of what happens when women start working with their blueprint.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 24 }}>
          {QUOTES.map((id) => MEMBER_QUOTES[id]).filter(Boolean).map((q) => (
            <figure key={q.name} className="holo-edge" style={{ ...card, margin: 0, display: "flex", flexDirection: "column", background: "var(--pink-light)" }}>
              <div aria-hidden="true" className="szn-holo-text" style={{ fontFamily: pp, fontSize: 56, fontWeight: 800, lineHeight: 0.8, marginBottom: 8 }}>&ldquo;</div>
              <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.7, flex: 1 }}>{q.quote}</blockquote>
              <figcaption style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--pink)", marginTop: 16 }}>
                {q.name} · my szn member
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* 11 · The practical questions. */}
      <Section bg="var(--pink-light)">
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <div>
            <Head n="11" tag="faqs" title="a few witchy" accent="details." />
          </div>
          <div className="grid gap-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="holo-edge" style={{ ...card, padding: "16px 20px" }}>
                <summary style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>{q}</summary>
                <p style={{ ...copy, fontSize: 15.5, margin: "10px 0 0" }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* 12 · The invitation. */}
      <WaitlistBand
        offer="baddie-coven"
        title="the coven"
        accent="is calling. 🦄"
        body={
          <>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>You&apos;ve hidden your magic for long enough, my love.</p>
            <p style={{ margin: "0 0 14px" }}>Your soul blueprint is waiting, your coven is waiting and the woman you&apos;re becoming is SOOOO ready to meet you. Put your name in the book, witch.</p>
            <p style={{ margin: "0 0 14px", fontStyle: "italic" }}>No pointy hat required, although fabulous accessories are very much encouraged.</p>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>More magic. More money. More creativity. More friendship. More F*CKING FUN.</p>
            <p style={{ margin: 0 }}>Welcome to your coven. 💜🪩🦄✨</p>
          </>
        }
        question="What kind of magic would you love to explore with us?"
      />

      <MoreMySzn />
    </>
  );
}
