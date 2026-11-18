import Link from "next/link";
import DoorButton from "@/components/DoorButton";
import { MASTERMIND, MASTERMIND_PLAN, MASTERMIND_PRICE, MASTERMIND_SKY, MASTERMIND_STARTS } from "@/lib/mastermind";

// The rebuilt Mastermind sections (18 Nov 2026). The old shared versions (CoachingBand, ValueStack,
// ThreeMonthsFromNow) still describe the retired membership chapter and stay untouched for
// /membership; these say what the January 2027 cohort actually includes. All text is solid black
// on light grounds and solid white on dark ones.
const pp = "var(--font-poppins), Poppins, sans-serif";

type Chip = { emoji: string; text: string; date: string };

// The three stages keep Betty's approved month copy; only the dates, the sky and month 3's last
// line changed (it used to end on walking into 2027).
const STAGES: { when: string; name: string; body: string; sky: readonly Chip[]; skyLine: string }[] = [
  {
    when: "month 1 · 11th jan to 9th feb",
    name: "💗 Self-Love SZN",
    body: "You understand yourself, your desires and your standards so much more deeply. You know what you actually want once the conditioning is out of the way, you've stopped accepting some of what you used to tolerate, and you're letting yourself receive money, love, praise and support without immediately questioning whether you deserve it.",
    sky: MASTERMIND_SKY.month1,
    skyLine: "Capricorn sets the standards, Aquarius shows you your future self and the solar eclipse opens the new chapter.",
  },
  {
    when: "month 2 · 10th feb to 11th mar",
    name: "🖤 Bad B*tch SZN",
    body: "You've confronted what could sabotage your next chapter. You're clearer on your boundaries, you've reclaimed the parts of yourself you used to hide or apologise for, you're saying no without the 700-word apology, and you're becoming more powerful, more visible and a whole lot harder to control.",
    sky: MASTERMIND_SKY.month2,
    skyLine: "Mercury retrograde and the Virgo eclipse drag the old stories up, so we clear them togetherrr.",
  },
  {
    when: "month 3 · 12th mar to 11th apr",
    name: "🛸 Big Dream SZN",
    body: "You've stopped editing your dreams down to whatever feels realistic. You know how big you actually want your life to be, you've turned enormous desires into real decisions, and by the time Mars goes direct on the 1st of April you're ALREADY MOVING.",
    sky: MASTERMIND_SKY.month3,
    skyLine: "Aries season and Mars going direct hand you the green light, right on time for your big moves.",
  },
];

export function SkyStages() {
  return (
    <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-6xl mx-auto">
        <div className="tag mb-6">the january cohort</div>
        <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 72px)", color: "var(--dark)", lineHeight: 1 }}>
          start 2027 <span className="pk">already moving.</span>
        </h2>
        <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.75, color: "var(--dark)", marginTop: 26, fontWeight: 600, maxWidth: 780 }}>
          We kick off on {MASTERMIND_STARTS} while the Sun is in Capricorn, the sign of ambition, standards and building something that LASTS, then move through Aquarius, Pisces and allll the way into Aries season together, eclipses included. 🪐
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 34 }}>
          {STAGES.map((s) => (
            <div key={s.when} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "22px 22px 18px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>{s.when}</div>
                <div style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 12, color: "var(--dark)" }}>{s.name}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--dark)", margin: 0 }}>{s.body}</p>
              </div>
              <div style={{ marginTop: "auto", background: "var(--lav-light)", borderTop: "var(--border)", padding: "16px 22px 18px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark)", marginBottom: 10 }}>the sky this month</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
                  {s.sky.map((c) => (
                    <li key={c.text} style={{ fontSize: 14, lineHeight: 1.45, color: "var(--dark)", display: "flex", gap: 8 }}>
                      <span aria-hidden="true">{c.emoji}</span>
                      <span>
                        <strong>{c.date}</strong> · {c.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--dark)", fontWeight: 700, margin: "12px 0 0" }}>{s.skyLine}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const COACHING = [
  {
    tag: "week one · your 1:1 audit",
    h: "Your whole life, read against your chart",
    items: [
      "Money, love, body, career and visibility, friendships, home and creativity, allll of it on the table",
      "Your chart and Human Design showing where each part of your life is ready to grow",
      "You leave with your Dream Life Blueprint for the 90 days",
    ],
    bg: "var(--pink)",
  },
  {
    tag: "months two + three · private",
    h: "Two private sessions with Betty",
    items: [
      "Built around whatever is ACTUALLY coming up: money, visibility, business, love, shadow",
      "Your chart and Human Design on the table every single time",
      "You leave every session with your next moves",
    ],
    bg: "var(--pink)",
  },
  {
    tag: "telegram · between calls",
    h: "Betty in your pocket",
    items: [
      `Message me on Telegram ${MASTERMIND.telegramDays} for coaching between calls`,
      "Voice notes, wins, wobbles and screenshots of the email you're scared to send",
      "So the breakthrough happens on the Tuesday you need it, instead of three weeks later",
    ],
    bg: "var(--lav)",
  },
  {
    tag: "group coaching · every two weeks",
    h: "Six live calls with your cohort",
    items: [
      "Hot seats, so you get coached in front of women who get it",
      "astrotapping™ through the fear and resistance that comes up",
      "Real-world action, and a little magic to close",
    ],
    bg: "var(--lav)",
  },
];

export function MastermindCoaching() {
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--dark)", color: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 20 }}>
          the big deal
        </div>
        <h2 className="display" style={{ fontSize: "clamp(36px, 6.5vw, 80px)", color: "#fff", lineHeight: 0.98 }}>
          coached by betty,
          <br />
          <span style={{ color: "var(--pink)" }}>privately, every month.</span>
        </h2>
        <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7, fontWeight: 500, maxWidth: 760, marginTop: 24, color: "#fff" }}>
          You get me in your corner one to one for the whole 90 days, plus a small room of {MASTERMIND.spots} women going for it with you every two weeks. 💜
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 36 }}>
          {COACHING.map((c) => (
            <div key={c.tag} style={{ background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 22, overflow: "hidden" }}>
              <div style={{ background: c.bg, color: c.bg === "var(--pink)" ? "#fff" : "var(--dark)", fontFamily: pp, fontWeight: 800, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 20px" }}>
                {c.tag}
              </div>
              <div style={{ padding: "22px 22px 24px" }}>
                <div style={{ fontFamily: pp, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 14 }}>{c.h}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                  {c.items.map((i) => (
                    <li key={i} style={{ fontSize: 15, lineHeight: 1.55 }}>
                      <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, marginTop: 26, color: "#fff", maxWidth: 820, lineHeight: 1.6 }}>
          Plus your pod of four, the audio library, a money + business call every month, your feature on the MY SZN Podcast or Instagram and the whole Bad B*tch Coven, included.
        </p>
        <DoorButton variant={2} />
      </div>
    </section>
  );
}

const COVEN_ITEMS = [
  "One live coven circle a month with the whole coven",
  "Your personalised astrology platform",
  "Moon rituals, astrotapping™ and shadow work prompts",
  "Chat rooms with baddies all over the world",
];

const MASTERMIND_ITEMS = [
  "EVERYTHING in the coven, included",
  "Your 1:1 audit + Dream Life Blueprint",
  "Two private sessions with Betty",
  "Telegram access to Betty between calls",
  "Hot seat coaching every two weeks",
  `Only ${MASTERMIND.spots} women in the room`,
];

export function CovenOrMastermind() {
  const card = (opts: { name: string; price: string; forLine: string; items: string[]; head: string; headInk: string; href: string; cta: string }) => (
    <div style={{ background: "#fff", border: "var(--border)", borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ background: opts.head, color: opts.headInk, padding: "18px 22px" }}>
        <div style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.15 }}>{opts.name}</div>
        <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, marginTop: 6 }}>{opts.price}</div>
      </div>
      <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 700, color: "var(--dark)", margin: "0 0 14px" }}>{opts.forLine}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          {opts.items.map((i) => (
            <li key={i} style={{ fontSize: 15, lineHeight: 1.55, color: "var(--dark)" }}>
              <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>
              {i}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "auto", paddingTop: 22 }}>
          <Link href={opts.href} className="no-underline" style={{ display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "15px 26px" }}>
            {opts.cta}
          </Link>
        </div>
      </div>
    </div>
  );
  return (
    <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-5xl mx-auto">
        <div className="tag mb-5">the coven or the mastermind</div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
          pick how close <span className="pk">you want me.</span>
        </h2>
        <p style={{ fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.7, color: "var(--dark)", fontWeight: 600, maxWidth: 760, marginTop: 22 }}>
          The coven is where you learn the magic and find your people at your own pace, and the mastermind is where I coach YOU, personally, through the biggest 90 days of your year.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 32 }}>
          {card({ name: "The Bad B*tch Coven", price: "$44 a month", forLine: "For magic, learning and finding your people, all year round.", items: COVEN_ITEMS, head: "var(--lav)", headInk: "var(--dark)", href: "/baddie-coven", cta: "see the coven" })}
          {card({ name: MASTERMIND.name, price: `${MASTERMIND_PRICE} for 90 days`, forLine: "For BIG moves in 90 days, with me coaching you one to one.", items: MASTERMIND_ITEMS, head: "var(--pink)", headInk: "#fff", href: "#waitlist", cta: "apply for a spot" })}
        </div>
      </div>
    </section>
  );
}

const STACK = [
  { what: "Your 1:1 audit with Betty", detail: "week one: your whole life read against your chart, and your Dream Life Blueprint" },
  { what: "Two private sessions with Betty", detail: "in months two and three, built around what's coming up for you" },
  { what: "Telegram access to Betty", detail: `${MASTERMIND.telegramDays}, for coaching between calls` },
  { what: "Six live group coaching calls", detail: "every two weeks, with hot seats and astrotapping™" },
  { what: "Your pod of four", detail: "your own little accountability crew, meeting between calls" },
  { what: "The audio library", detail: "a hypnosis for every stage, astrotapping™ and every call on replay" },
  { what: "A money + business call every month", detail: "pricing, raises, offers and investing, read against your chart" },
  { what: "Your feature", detail: "on the MY SZN Podcast or Instagram, because you're about to be VISIBLE" },
  { what: "The Bad B*tch Coven", detail: "the whole coven, included for your 90 days" },
];

export function MastermindStack() {
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-4xl mx-auto">
        <div className="tag mb-5">what you get</div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
          everything, <span className="pk">for 90 days.</span>
        </h2>
        <div style={{ marginTop: 30, border: "var(--border)", borderRadius: 20, overflow: "hidden", background: "#fff" }}>
          {STACK.map((s, i) => (
            <div key={s.what} style={{ padding: "15px 20px", borderTop: i ? "var(--border)" : "none" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, color: "var(--dark)" }}>
                <span style={{ color: "var(--pink)" }}>✦ </span>
                {s.what}
              </div>
              <div style={{ fontSize: 14, color: "var(--dark)", marginTop: 2 }}>{s.detail}</div>
            </div>
          ))}
          <div className="flex items-center gap-x-5 gap-y-1 flex-wrap" style={{ padding: "18px 20px", borderTop: "var(--border)", background: "var(--dark)", color: "#fff" }}>
            <div style={{ flex: "1 1 220px", fontFamily: pp, fontWeight: 800, fontSize: 17 }}>All of it, for 90 days</div>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 26, color: "var(--pink)" }}>{MASTERMIND_PRICE}</div>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 15 }}>or {MASTERMIND_PLAN}</div>
          </div>
        </div>
        <DoorButton variant={0} />
      </div>
    </section>
  );
}
