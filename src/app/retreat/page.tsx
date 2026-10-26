import type { Metadata } from "next";
import type { ReactNode } from "react";
import { WaitlistBand, OfferCards } from "@/components/Offer";

// The Bad B*tch Manifestation Retreat: the in-person experience. Application only (26 Oct 2026). Venue booked 26 Oct
// 2026: an oceanfront estate on Soliman Bay, Tulum, 4 to 9 January 2027, for 10 to 15 women with a
// deposit. Room prices set 26 Oct 2026 from Betty's £3,600 private room, converted to dollars;
// $1,000 deposit, then the rest in full or in 3 or 4 payments (her choice), all paid by 31 Dec 2026.
//
// Redesigned 26 Oct 2026 because the long copy bands read as a document: the page is now photo-led,
// with Betty's copy cut down to its strongest lines and the facts shown as chips, grids and timelines.

export const metadata: Metadata = {
  title: "The Bad B*tch Manifestation Retreat, Tulum, 4 to 9 January 2027",
  description:
    "The Bad B*tch Manifestation Retreat is an oceanfront estate retreat in Tulum, Mexico, for 10 to 15 women from 4 to 9 January 2027: astrology, Human Design, somatics, shadow work, manifestation, hypnosis and embodiment. Applications open now.",
  alternates: { canonical: "/retreat" },
  openGraph: {
    title: "The Bad B*tch Manifestation Retreat, Tulum 🌴",
    description: "Five nights in an oceanfront villa in Tulum, 4 to 9 January 2027. Astrology, Human Design, shadow work, ritual and sisterhood.",
    url: "/retreat",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

const label = { fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" as const };

// Swipe row for the magic cards on phones (a grid on desktop) and the villa bento grid. Kept in the
// page so they ship with it.
const PAGE_CSS = `
.retreat-swipe {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(260px, 78%);
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 14px;
}
.retreat-swipe > * { scroll-snap-align: start; }
@media (min-width: 1024px) {
  .retreat-swipe { grid-auto-flow: row; grid-template-columns: repeat(5, 1fr); grid-auto-columns: auto; overflow: visible; }
}
.retreat-bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 150px;
  gap: 12px;
}
.retreat-bento > :first-child { grid-column: 1 / -1; grid-row: span 2; }
@media (min-width: 768px) {
  .retreat-bento { grid-template-columns: 2fr 1fr 1fr; grid-auto-rows: 210px; }
  .retreat-bento > :first-child { grid-column: 1; grid-row: span 2; }
}
`;

// Hero facts, shown as chips so the essentials land before any scrolling.
const FACTS = ["📍 tulum, mexico", "🗓️ 4 to 9 january 2027", "👯 10 to 15 hand-picked women", "💸 from $2,950"];

const MORE = ["more money", "more freedom", "more pleasure", "more confidence", "more MAGIC"];

// Grouped by when it happens. Pre-retreat coaching, the two follow-ups, inner child work, sisterhood
// circles, journaling and group discussions added 26 Oct 2026.
const INCLUDED = [
  {
    phase: "before you fly ✈️",
    items: [
      { icon: "📲", title: "A coaching session with me", body: "Just you and me, working out exactly what you need from Tulum so every single second of it works for YOU." },
      { icon: "📞", title: "Group calls with the girls", body: "Meet the other women first, so you land already giggling with your new besties." },
      { icon: "📖", title: "Your personal 2027 guide", body: "Made by me from your birth chart: your big moves, month by month, as a workbook and journal ($400 value)." },
    ],
  },
  {
    phase: "in tulum 🌴",
    items: [
      { icon: "🌊", title: "5 nights on the ocean", body: "A private oceanfront estate on Soliman Bay with a pool, hot tub and the beach on your doorstep." },
      { icon: "💜", title: "90 minutes one-on-one with me", body: "Going deep on your chart, your Human Design and your 2027." },
      { icon: "✨", title: "Your own energy healing", body: "A separate one-on-one session to clear what your body has been holding onto." },
      { icon: "🧸", title: "Inner child work", body: "Giving little you the love, safety and permission she never got, so grown-up you can finally go for it." },
      { icon: "🌑", title: "Shadow work + hypnosis", body: "Black Moon Lilith, hypnosis and the parts of you you've learned to suppress." },
      { icon: "🪐", title: "Astrology + Human Design", body: "Workshops on how YOU are built to decide, create and make money." },
      { icon: "🧘‍♀️", title: "Yoga + sound baths", body: "So your body gets as much love as your mindset." },
      { icon: "🕯️", title: "Witchy rituals", body: "Candle magic, spell jars, moon work and burning what you're done carrying." },
      { icon: "🫂", title: "Sisterhood circles", body: "Sitting in circle with women who see you, hold you and cheer louder than anyone." },
      { icon: "📓", title: "Journaling + group discussions", body: "Insightful journaling exercises and juicy conversations that crack everything wide open." },
    ],
  },
  {
    phase: "after you're home 🏡",
    items: [
      { icon: "🫶", title: "A follow-up support session", body: "So everything you unlocked in Tulum lands in your real life and doesn't get lost in your inbox." },
      { icon: "🚀", title: "A follow-up coaching session with me", body: "To keep you moving, because the real glow-up is what you do once you're home." },
    ],
  },
];

const NOT_INCLUDED = ["Flights", "Travel insurance (highly recommended)", "Tips for the villa staff", "Spa treatments and massages", "Meals out on your own time", "Personal spending and shopping"];

// The four-part method behind everything Betty teaches, in its real order.
const METHOD = [
  { step: "blueprint", body: "We read your chart and Human Design before you land, so you know exactly what you're here to build in 2027." },
  { step: "identity", body: "We meet the woman who already has it all and catch every place you've been shrinking to stay liked." },
  { step: "embodiment", body: "Inner child work, energy healing, hypnosis, movement and ritual until your body believes the new you is SO deserved." },
  { step: "reality", body: "You fly home with a 2027 plan written for your chart and a group of women checking you actually live it." },
];

// Betty's "a little taste of the magic" copy (15 Oct 2026), cut to one line each.
const MAGIC = [
  { emoji: "🌑", title: "Meet your shadow. Reclaim your power.", body: "Your anger, your ambition, your desires and your beautifully inconvenient refusal to settle.", bg: "var(--dark)", ink: "#fff" },
  { emoji: "🔥", title: "Fall in love with your body.", body: "Sensual movement, pleasure and dancing, celebrating the body you're living in RIGHT NOW.", bg: "var(--pink)", ink: "var(--dark)" },
  { emoji: "💸", title: "Become a woman who wants MORE.", body: "Money, freedom, visibility and the audacity to create a life that makes you want to pinch yourself.", bg: "var(--lav)", ink: "var(--dark)" },
  { emoji: "🪩", title: "Play, create, laugh and be ridiculous.", body: "Dressing up, dancing, making art and laughing until your stomach hurts.", bg: "#fff", ink: "var(--dark)" },
  { emoji: "🦄", title: "Find your people.", body: "Women who celebrate your wins, respect your vulnerability and push you to go after EVERYTHING.", bg: "var(--pink-light)", ink: "var(--dark)" },
];

// A sample day: Betty confirmed meditations, shadow work, Human Design + astrology, witchy things,
// lots of downtime, yoga and sound baths (26 Oct 2026). The real schedule goes to accepted women.
const DAY = [
  { icon: "🌅", when: "sunrise", what: "Yoga, meditation and slow, sensual movement." },
  { icon: "☀️", when: "late morning", what: "The big session: shadow work, inner child work, your chart or Human Design." },
  { icon: "🌴", when: "afternoon", what: "Downtime, and LOTS of it. Pool, book, nap, hammock." },
  { icon: "🌇", when: "sunset", what: "Witchy hour: sound baths, candle magic and moon work." },
  { icon: "🌙", when: "evening", what: "Sisterhood circles and long, beautiful dinners nobody wants to leave." },
];

const ROOMS = [
  { name: "your own room", price: "$4,750", img: "/retreat/room-private.jpg", alt: "A private bedroom with an extra-large double bed and doors out to the sea", beds: "An extra-large double bed all to yourself", note: "5 of these" },
  { name: "shared twin", price: "$3,500", img: "/retreat/room-twin.jpg", alt: "A twin bedroom with two double beds", beds: "Your own bed in a room for two", note: "perfect with a friend" },
  { name: "shared four-bed", price: "$2,950", img: "/retreat/room-quad.jpg", alt: "A four-bed room with bunk beds", beds: "Your own single bed in a room for four", note: "full sleepover energy" },
];

const FOR_YOU_IF = [
  "You've spent years being the good girl and you're ready to find out who you are without everybody else's expectations.",
  "You love astrology, witchcraft and the occasional existential revelation over cocktails.",
  "You want to feel more connected to your body, your desires and your creativity.",
  "You're building a bigger, richer life and want women around you who understand that ambition.",
  "You want to explore your shadow without being ashamed of the messy parts.",
  "You're ready to make yourself the main character in your own F*CKING LIFE.",
];

// What changes for her: outcomes, kept separate from the inclusions list above.
const BENEFITS = [
  { icon: "🔮", title: "Total clarity on 2027", body: "You'll know exactly who you're becoming this year and have a plan written for your chart to get there." },
  { icon: "👑", title: "Confidence that sticks", body: "You'll stop shrinking to stay liked and start taking up the space you were always meant to." },
  { icon: "💸", title: "A new money story", body: "You'll rewrite the beliefs you inherited about what women are allowed to want, earn and receive." },
  { icon: "🔥", title: "Home in your body", body: "You'll feel sexy, safe and powerful in the body you're living in RIGHT NOW." },
  { icon: "🌊", title: "A nervous system that's exhaled", body: "Five days of rest, pleasure and downtime, so you fly home calm instead of running on fumes." },
  { icon: "👯", title: "Women who've got you", body: "A circle of baddies who celebrate your wins and keep checking in long after Tulum." },
];

// Answers only state what Betty has confirmed; anything unknown (refunds, the meal plan) stays vague.
const FAQ = [
  { q: "Do I need to know anything about astrology or Human Design?", a: "Not even a little bit, babe. I'll have read your chart and your Human Design before you land, and I'll explain everything in plain English, so all you need to bring is your birth time and an open heart." },
  { q: "Can I come on my own?", a: "YESSS, and you absolutely should. We do group calls before the retreat so you get to know the other women first, which means you'll be walking into that villa already knowing who you can't wait to hug." },
  { q: "I've never done shadow work, yoga or a sound bath. Is that okay?", a: "Totally okay. Whether you're a total beginner or you've been doing this for years, you'll be held, guided and never pushed further than feels right for you." },
  { q: "I'm an introvert. Will it be too much?", a: "There's LOTS of downtime built into every single day, so you can join in when you feel social and disappear to a hammock with a book when you need to recharge." },
  { q: "Where do I fly into?", a: "The nearest airport is Tulum International, about 55km from the villa, and Cancún is the other option if you want more flight choices. Full travel details go to every woman who gets a spot." },
  { q: "Will I share a room?", a: "Only if you want to. There are five private rooms, plus shared twin and four-bed rooms for a lower price, and nobody ever shares a bed." },
  { q: "What about food and dietary needs?", a: "Tell us about any dietary needs or allergies when you apply and we'll make sure you're looked after. The full meal plan goes to every woman who gets a spot." },
  { q: "How do I get a spot?", a: "Apply below and I'll read your application myself, then we'll chat to make sure the retreat is right for you. Once you're accepted, pick your room and a $1,000 deposit secures it. Pay the rest in full, or split it into 3 or 4 payments (you choose), all wrapped up by 31 December 2026." },
];

// The retreat is curated, so the waitlist form is an application (Betty, 26 Oct 2026). Answers land
// in /admin/waitlists and in an email to Betty.
const APPLICATION = [
  { label: "What's going on in your life right now, and why does this retreat feel like a YES?", type: "textarea" as const, required: true },
  { label: "What do you want to call in for 2027?", type: "textarea" as const, required: true },
  { label: "Which room are you leaning towards?", type: "select" as const, options: ["Your own room ($4,750)", "Shared twin ($3,500)", "Shared four-bed ($2,950)", "Not sure yet"], required: true },
  { label: "How familiar are you with astrology, Human Design and shadow work?", type: "select" as const, options: ["Total beginner, teach me everything", "I know a little", "I'm deep in it"], required: true },
  { label: "Your Instagram handle", type: "text" as const },
  { label: "Anything we should know? Dietary needs, health, accessibility, coming with a friend", type: "textarea" as const },
];

function Btn({ href, children, tone = "pink" }: { href: string; children: ReactNode; tone?: "pink" | "dark" | "white" }) {
  const bg = tone === "pink" ? "var(--pink)" : tone === "dark" ? "var(--dark)" : "#fff";
  const ink = tone === "white" ? "var(--dark)" : "#fff";
  return (
    <a href={href} className="no-underline" style={{ display: "inline-block", background: bg, color: ink, border: "1.5px solid var(--dark)", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 30px" }}>
      {children}
    </a>
  );
}

function Heading({ tag, title, accent, ink = "var(--dark)" }: { tag: string; title: string; accent?: string; ink?: string }) {
  return (
    <>
      <div className="tag mb-4">{tag}</div>
      <h2 className="display" style={{ fontSize: "clamp(34px, 5.5vw, 64px)", color: ink, lineHeight: 0.98, textWrap: "balance" }}>
        {title} {accent && <span className="pk">{accent}</span>}
      </h2>
    </>
  );
}

function Img({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />;
}

export default function RetreatPage() {
  return (
    <>
      <style>{PAGE_CSS}</style>
      {/* ── Hero: the villa at dusk, with every key fact up front ── */}
      <section
        className="px-5 md:px-8"
        style={{
          backgroundColor: "var(--dark)",
          backgroundImage: "linear-gradient(180deg, rgba(26,26,26,0.55) 0%, rgba(26,26,26,0.72) 55%, rgba(26,26,26,0.9) 100%), url(/retreat/villa-dusk.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "var(--border)",
          paddingTop: "clamp(90px, 14vw, 170px)",
          paddingBottom: "clamp(56px, 8vw, 96px)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div style={{ ...label, display: "inline-block", background: "var(--pink)", color: "#fff", padding: "8px 14px", border: "1.5px solid #fff" }}>
            🌴 the bad b*tch retreat 2027
          </div>
          <h1 className="display" style={{ fontSize: "clamp(46px, 9vw, 120px)", color: "#fff", lineHeight: 0.9, marginTop: 22, textWrap: "balance" }}>
            the bad b*tch <span className="pk">manifestation</span> retreat.
          </h1>
          <p style={{ color: "#fff", fontSize: "clamp(18px, 2.3vw, 24px)", lineHeight: 1.5, fontWeight: 600, maxWidth: 640, marginTop: 22 }}>
            Your best life is calling, and she&apos;s ready for you to become the woman who actually LIVES it.
          </p>
          <ul className="flex flex-wrap gap-2" style={{ listStyle: "none", padding: 0, margin: "26px 0 0" }}>
            {FACTS.map((f) => (
              <li key={f} style={{ ...label, fontSize: 11, background: "#fff", color: "var(--dark)", border: "1.5px solid var(--dark)", borderRadius: 999, padding: "9px 14px" }}>{f}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3" style={{ marginTop: 30 }}>
            <Btn href="#rooms">choose your room</Btn>
            <Btn href="#waitlist" tone="white">apply now</Btn>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div aria-hidden="true" className="overflow-hidden" style={{ background: "var(--pink)", borderBottom: "var(--border)", padding: "12px 0" }}>
        <div className="ticker-inner">
          {[...MORE, ...MORE, ...MORE, ...MORE].map((m, i) => (
            <span key={i} style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)", padding: "0 18px", whiteSpace: "nowrap" }}>
              {m} <span style={{ color: "#fff", paddingLeft: 18 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── The invitation: photo + Betty's strongest lines ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-14 items-center">
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "4 / 5", border: "var(--border)", borderRadius: 24, overflow: "hidden", boxShadow: "12px 12px 0 var(--pink)" }}>
              <Img src="/retreat/villa-pool-walkway.jpg" alt="A wooden walkway between two pools leading to the ocean" />
            </div>
            <div style={{ position: "absolute", left: -8, bottom: 26, background: "var(--dark)", color: "#fff", ...label, fontSize: 11, padding: "10px 14px", transform: "rotate(-4deg)", border: "1.5px solid #fff" }}>
              your view for 5 nights 🌊
            </div>
          </div>
          <div>
            <Heading tag="your invitation 💜" title="starting 2027" accent="in the right waaaayyyyyyyyyy." />
            <div className="offer-copy" style={{ marginTop: 22 }}>
              <p>Imagine escaping to a dreamy luxury villa in Tulum, surrounded by ambitious, magical, unapologetic women who are ready to make their biggest dreams a reality.</p>
              <p>Five days of astrology, Human Design, somatics, shadow work, inner child work, energy healing, manifestation, hypnosis and embodiment, designed to help you become the woman you&apos;ve always wanted to be.</p>
            </div>
            <blockquote className="display" style={{ fontSize: "clamp(26px, 3.4vw, 40px)", lineHeight: 1.05, margin: "26px 0 0", padding: "20px 0 0", borderTop: "var(--border)" }}>
              stop putting your dream life on a vision board and start f*cking <span className="pk">LIVING IT.</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── What's included, before / in / after ── */}
      <section className="px-5 md:px-8 bg-glitter" style={{ borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <Heading tag="what's included ✨" title="everything that's" accent="included." ink="#fff" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4 items-start" style={{ marginTop: 32 }}>
            {INCLUDED.map((ph) => (
              <div key={ph.phase} style={{ background: ph.phase.startsWith("in") ? "var(--pink)" : "var(--lav)", border: "1.5px solid #fff", borderRadius: 22, padding: 14 }}>
                <div style={{ ...label, fontSize: 12, color: "var(--dark)", padding: "4px 6px 12px" }}>{ph.phase}</div>
                <div className={ph.phase.startsWith("in") ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "grid grid-cols-1 gap-3"}>
                  {ph.items.map((it) => (
                    <div key={it.title} className="flex gap-3 items-start" style={{ background: "#fff", border: "var(--border)", borderRadius: 16, padding: "14px 14px 16px", color: "var(--dark)" }}>
                      <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{it.icon}</div>
                      <div>
                        <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, lineHeight: 1.2 }}>{it.title}</div>
                        <p style={{ fontSize: 13.5, lineHeight: 1.45, margin: "5px 0 0" }}>{it.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, background: "#fff", border: "var(--border)", borderRadius: 18, padding: "18px 20px" }}>
            <div style={{ ...label, fontSize: 12 }}>not included</div>
            <ul className="flex flex-wrap gap-2" style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
              {NOT_INCLUDED.map((n) => (
                <li key={n} style={{ fontSize: 14, fontWeight: 600, border: "var(--border)", borderRadius: 999, padding: "6px 12px", background: "var(--lav-light)" }}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── The 2027 guide: Betty's own chart-based workbook, valued at $400 (26 Oct 2026) ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <div style={{ ...label, fontSize: 11, display: "inline-block", background: "var(--dark)", color: "#fff", padding: "8px 12px" }}>🎁 yours to keep · $400 value</div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 70px)", lineHeight: 0.96, marginTop: 18, textWrap: "balance" }}>
              your personal <span style={{ color: "#fff" }}>2027 guide.</span>
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, fontWeight: 600, marginTop: 20, maxWidth: 560 }}>Before you land, I&apos;ll create your very own 2027 guide from YOUR birth chart, so you know exactly when to make your big moves and what every single month is asking of you.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "grid", gap: 10 }}>
              {[
                "Your power months and the exact windows for your big moves",
                "What each month of 2027 is asking of you, written for your chart",
                "Workbook pages to plan your money, love, career and glow-up",
                "Journal prompts for every month, so the magic keeps going long after Tulum",
              ].map((i) => (
                <li key={i} className="flex gap-3 items-start" style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 700 }}>
                  <span style={{ color: "#fff", fontWeight: 800 }}>✦</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 20, maxWidth: 560 }}>We&apos;ll work through it together in Tulum, then you take it home and live it all year.</p>
          </div>
          <div className="flex justify-center">
            <div aria-hidden="true" style={{ width: "min(320px, 78vw)", aspectRatio: "0.707", background: "var(--dark)", color: "#fff", border: "var(--border)", borderRadius: 6, padding: "26px 24px", transform: "rotate(3deg)", boxShadow: "12px 14px 0 var(--lav)", display: "flex", flexDirection: "column" }}>
              <div style={{ ...label, fontSize: 9, letterSpacing: "0.2em" }}>my szn · tulum 2027</div>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 46, lineHeight: 0.92, letterSpacing: "-0.03em", marginTop: 22, textTransform: "lowercase" }}>
                <div>your</div>
                <div style={{ color: "var(--pink)" }}>2027</div>
                <div>guide.</div>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, marginTop: 16, fontWeight: 600, maxWidth: 200 }}>your big moves, month by month, written for your birth chart</div>
              <div style={{ fontSize: 34, marginTop: 18 }}>🪐 ✨ 💸</div>
              <div style={{ marginTop: "auto", borderTop: "1.5px solid #fff", paddingTop: 10, ...label, fontSize: 9 }}>prepared for you by betty</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The method, as a four-step path ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <Heading tag="how the manifesting works" title="how we manifest" accent="the 2027 you." />
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ listStyle: "none", padding: 0, margin: "34px 0 0" }}>
            {METHOD.map((m, i) => (
              <li key={m.step} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 18px 22px", boxShadow: "6px 6px 0 var(--dark)" }}>
                <div className="flex items-center gap-3">
                  <span style={{ width: 40, height: 40, borderRadius: 999, background: "var(--pink)", color: "#fff", border: "var(--border)", display: "grid", placeItems: "center", fontFamily: pp, fontWeight: 800, fontSize: 18 }}>{i + 1}</span>
                  <span style={{ ...label, fontSize: 14 }}>{m.step}</span>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, margin: "14px 0 0" }}>{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── A taste of the magic: one swipeable row ── */}
      <section style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <Heading tag="a little taste of the magic 🪄" title="a little taste" accent="of the magic." />
        </div>
        <div className="retreat-swipe max-w-6xl mx-auto px-5 md:px-8" style={{ marginTop: 32 }}>
          {MAGIC.map((m) => (
            <div key={m.title} style={{ background: m.bg, color: m.ink, border: "var(--border)", borderRadius: 22, padding: "24px 22px 26px", boxShadow: "6px 6px 0 var(--dark)" }}>
              <div style={{ fontSize: 40, lineHeight: 1 }}>{m.emoji}</div>
              <div style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, lineHeight: 1.15, marginTop: 16 }}>{m.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: "10px 0 0" }}>{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── A day, sunrise to moonrise ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <Heading tag="a day at the retreat 🌴" title="what a day" accent="actually looks like." />
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-3" style={{ listStyle: "none", padding: 0, margin: "34px 0 0" }}>
            {DAY.map((d) => (
              <li key={d.when} className="flex md:block items-start gap-4" style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "16px 18px" }}>
                <div style={{ fontSize: 30, lineHeight: 1 }}>{d.icon}</div>
                <div>
                  <div style={{ ...label, fontSize: 11, color: "var(--pink)", marginTop: 4 }}>{d.when}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.45, fontWeight: 600, margin: "6px 0 0" }}>{d.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Tulum: what it's like and where it is ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <Heading tag="where in the world 📍" title="welcome to" accent="tulum." />
            <p style={{ fontSize: 17, lineHeight: 1.65, marginTop: 20 }}>Tulum sits on Mexico&apos;s Caribbean coast in the Yucatán Peninsula, where the jungle runs right down to white sand beaches and impossibly turquoise water.</p>
            <p style={{ fontSize: 17, lineHeight: 1.65, marginTop: 14 }}>It&apos;s ancient Mayan ruins on a clifftop above the sea, crystal-clear cenotes to swim in, barefoot beach clubs, gorgeous little boutiques and a whole town built around wellness, magic and slowing down.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginTop: 24 }}>
              {[
                { k: "the villa", v: "On Soliman Bay, a calm, sheltered bay just north of Tulum town" },
                { k: "flying in", v: "Tulum International is about 55km away, Cancún is the other option" },
                { k: "in january", v: "Dry season, warm sunny days and the sea perfect for swimming" },
              ].map((f) => (
                <div key={f.k} style={{ background: "#fff", border: "var(--border)", borderRadius: 16, padding: "14px 14px 16px" }}>
                  <div style={{ ...label, fontSize: 11, color: "var(--pink)" }}>{f.k}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.45, fontWeight: 600, margin: "6px 0 0" }}>{f.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div style={{ gridRow: "span 2", border: "var(--border)", borderRadius: 20, overflow: "hidden", aspectRatio: "3 / 5" }}>
              <Img src="/retreat/tulum-1.jpg" alt="The Mayan ruins of Tulum on a clifftop above a white sand beach" />
            </div>
            <div style={{ border: "var(--border)", borderRadius: 20, overflow: "hidden", aspectRatio: "3 / 4" }}>
              <Img src="/retreat/tulum-3.jpg" alt="A white bike under a Follow That Dream street sign in Tulum" />
            </div>
            <div style={{ border: "var(--border)", borderRadius: 20, overflow: "hidden", aspectRatio: "3 / 4" }}>
              <Img src="/retreat/tulum-2.jpg" alt="Clay pots and a floor cushion by a plunge pool in Tulum" />
            </div>
          </div>
        </div>
        {/* A drawn map (not an embed) so it loads on every phone; positions are real lat/long, simplified. */}
        <div className="max-w-6xl mx-auto" style={{ marginTop: 34 }}>
          <div style={{ border: "var(--border)", borderRadius: 22, overflow: "hidden", maxWidth: 560, margin: "0 auto" }}>
            <svg viewBox="0 0 400 520" role="img" aria-label="Map of Mexico's Caribbean coast from Cancún down to Tulum, with the villa at Soliman Bay just north of Tulum" style={{ width: "100%", height: "auto", display: "block", fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
              <rect width="400" height="520" fill="var(--lav)" />
              <path d="M0,0 L351.3,0.0 L333.9,56.0 L316.5,100.0 L302.6,176.0 L267.8,224.0 L236.5,268.0 L191.3,320.0 L153.0,360.0 L135.7,400.0 L125.2,416.0 L100.9,440.0 L76.5,488.0 L62.6,520.0 L0,520 Z" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
              <ellipse cx="285.2" cy="352.0" rx="22" ry="42" transform="rotate(-25 285.2 352.0)" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
              <text x="315.2" y="357.0" fontSize="12" fontWeight="700" fill="#1a1a1a">Cozumel</text>
              <text x="262" y="250" fontSize="14" fontWeight="800" fill="#1a1a1a" letterSpacing="2">CARIBBEAN</text>
              <text x="262" y="268" fontSize="14" fontWeight="800" fill="#1a1a1a" letterSpacing="2">SEA</text>
              <text x="24" y="40" fontSize="14" fontWeight="800" fill="#1a1a1a" letterSpacing="2">MEXICO</text>
              <circle cx="307.0" cy="80.0" r="6" fill="#1a1a1a" /><text x="295.0" y="85.0" textAnchor="end" fontSize="13" fontWeight="700" fill="#1a1a1a">Cancún ✈️</text><circle cx="227.0" cy="268.0" r="6" fill="#1a1a1a" /><text x="215.0" y="273.0" textAnchor="end" fontSize="13" fontWeight="700" fill="#1a1a1a">Playa del Carmen</text><circle cx="143.6" cy="360.0" r="6" fill="#1a1a1a" /><text x="131.6" y="365.0" textAnchor="end" fontSize="13" fontWeight="700" fill="#1a1a1a">Akumal</text><circle cx="119.2" cy="416.0" r="11" fill="var(--pink)" stroke="#1a1a1a" strokeWidth="2" /><text x="119.2" y="420.5" textAnchor="middle" fontSize="12" fill="#fff">★</text><text x="137.2" y="421.0" textAnchor="start" fontSize="15" fontWeight="800" fill="#1a1a1a">the villa · Soliman Bay</text><circle cx="91.4" cy="436.0" r="6" fill="#1a1a1a" /><text x="79.4" y="441.0" textAnchor="end" fontSize="13" fontWeight="700" fill="#1a1a1a">Tulum</text>
            </svg>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3" style={{ marginTop: 12, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>📍 The villa is on Soliman Bay, about 1.5 to 2 hours&apos; drive south of Cancún airport and a short hop from Tulum town.</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Soliman+Bay+Tulum+Mexico" target="_blank" rel="noopener noreferrer" style={{ ...label, fontSize: 11, color: "var(--pink)" }}>open in google maps →</a>
          </div>
        </div>
      </section>

      {/* ── The villa: bento photo grid ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <Heading tag="where you'll be staying 🌊" title="an oceanfront estate" accent="on soliman bay." />
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 640, marginTop: 18 }}>Ten bedrooms, a private pool, a rooftop hot tub, hammocks under the palms and the turquoise sea a few steps from your door.</p>
          <div className="retreat-bento" style={{ marginTop: 30 }}>
            {[
              { src: "/retreat/villa-pool-beach.jpg", alt: "The villa's pool running down to the beach and the sea" },
              { src: "/retreat/villa-rooftop-hot-tub.jpg", alt: "The rooftop hot tub looking out to sea" },
              { src: "/retreat/villa-dining.jpg", alt: "A long dining table in the open-plan living room" },
              { src: "/retreat/villa-hammocks.jpg", alt: "Hammocks strung between palm trees on the sand" },
              { src: "/retreat/villa-balcony.jpg", alt: "Two chairs on a balcony overlooking the pool and the sea" },
            ].map((p) => (
              <div key={p.src} style={{ border: "var(--border)", borderRadius: 18, overflow: "hidden" }}>
                <Img src={p.src} alt={p.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rooms + prices ── */}
      <section id="rooms" className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84, scrollMarginTop: 80 }}>
        <div className="max-w-6xl mx-auto">
          <Heading tag="pick your room 🛏️" title="choose your" accent="room." />
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 680, marginTop: 18 }}>Every room comes with the full retreat, including your personal 2027 guide. The only difference is where you sleep.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 30 }}>
            {ROOMS.map((r) => (
              <div key={r.name} style={{ border: "var(--border)", borderRadius: 20, background: "#fff", overflow: "hidden", boxShadow: "6px 6px 0 var(--dark)" }}>
                <div style={{ aspectRatio: "3 / 2", borderBottom: "var(--border)", position: "relative" }}>
                  <Img src={r.img} alt={r.alt} />
                  <span style={{ position: "absolute", top: 12, left: 12, background: "var(--dark)", color: "#fff", ...label, fontSize: 10, padding: "6px 10px" }}>{r.note}</span>
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <div style={{ ...label, fontSize: 12, color: "var(--pink)" }}>{r.name}</div>
                  <div className="flex items-baseline gap-2" style={{ marginTop: 6 }}>
                    <span style={{ fontFamily: pp, fontSize: 38, fontWeight: 800, lineHeight: 1 }}>{r.price}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>per person</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12 }}>{r.beds}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ marginTop: 26, background: "var(--dark)", color: "#fff", border: "var(--border)", borderRadius: 20, padding: "22px 24px" }}>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, fontWeight: 600 }}>
              <strong style={{ color: "var(--pink)" }}>$1,000 deposit</strong>{" "}secures your room once you&apos;re accepted. Pay the rest in full, or split it into 3 or 4 payments, all wrapped up by 31 December 2026.
            </p>
            <Btn href="#waitlist">apply now</Btn>
          </div>
        </div>
      </section>

      {/* ── Betty ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betty-founder.png" alt="Betty Andrews, founder of MY SZN" loading="lazy" style={{ width: "100%", maxWidth: 360, borderRadius: 24, border: "var(--border)", objectFit: "cover", aspectRatio: "4 / 5", transform: "rotate(-2deg)", boxShadow: "10px 12px 0 var(--pink)" }} />
          <div>
            <Heading tag="who's holding the space" title="hi, i'm betty." accent="i'll be with you the whole way." />
            <div className="offer-copy" style={{ marginTop: 20 }}>
              <p>I&apos;m an astrologer, manifestation coach and shadow work practitioner, and I help women make more money, reclaim their power and become more of who they actually are.</p>
              <p>I&apos;ll have read your chart and your Human Design before you land, I&apos;ll lead every session and ritual, and I&apos;ll be right there at the dinner table when the conversation gets wonderfully unhinged.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ ...label, fontSize: 11, color: "var(--dark)" }}>the benefits 💜</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 5.5vw, 64px)", color: "var(--dark)", lineHeight: 0.98, marginTop: 16, textWrap: "balance" }}>
            you&apos;ll fly home <span style={{ color: "#fff" }}>with...</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 32 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4 items-start" style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 18px", boxShadow: "6px 6px 0 var(--dark)" }}>
                <div style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{b.icon}</div>
                <div>
                  <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>{b.title}</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.5, margin: "6px 0 0" }}>{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── This is for you if: photo + list ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-14 items-center">
          <div>
            <Heading tag="this is for you if" title="this is for you" accent="if..." />
            <ul style={{ listStyle: "none", padding: 0, margin: "26px 0 0", display: "grid", gap: 10 }}>
              {FOR_YOU_IF.map((i) => (
                <li key={i} className="flex gap-3 items-start" style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 600, background: "var(--pink-light)", border: "var(--border)", borderRadius: 14, padding: "12px 16px" }}>
                  <span style={{ color: "var(--pink)", fontWeight: 800, fontSize: 18, lineHeight: 1.3 }}>✓</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, marginTop: 22 }}>If you nodded along to even one of these, your seat in Tulum has your name on it. 💜</p>
          </div>
          <div style={{ aspectRatio: "4 / 5", border: "var(--border)", borderRadius: 24, overflow: "hidden", boxShadow: "-12px 12px 0 var(--lav)" }}>
            <Img src="https://images.unsplash.com/photo-1495837174058-628aafc7d610?auto=format&fit=crop&w=900&h=1100&q=75" alt="Women dancing with their hands in the air at sunset" />
          </div>
        </div>
      </section>

      {/* ── FAQ, two columns on desktop ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-6xl mx-auto">
          <Heading tag="faq" title="all your" accent="questions." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start" style={{ marginTop: 30 }}>
            {FAQ.map((f) => (
              <details key={f.q} style={{ background: "var(--lav-light)", border: "var(--border)", borderRadius: 18, padding: "16px 20px" }}>
                <summary style={{ fontFamily: pp, fontWeight: 800, fontSize: 16, cursor: "pointer" }}>{f.q}</summary>
                <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <WaitlistBand
        offer="retreat"
        title="your future self has"
        accent="already packed her bags."
        questions={APPLICATION}
        submitLabel="send my application"
        body={
          <>
            <p style={{ margin: "0 0 14px" }}>This is a hand-picked group, so it starts with a little application. I read every single one myself, then we&apos;ll chat to make sure Tulum is right for you.</p>
            <p style={{ margin: "0 0 14px" }}>Once you&apos;re accepted, a $1,000 deposit secures your room, and you can pay the rest in full or in 3 or 4 payments, all done by 31 December 2026.</p>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Come be a little bit F*CKING MUCH with us. 💜 🪩 🦄 ✨</p>
          </>
        }
      />

      <OfferCards exclude="retreat" />
    </>
  );
}
