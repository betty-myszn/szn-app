import Link from "next/link";
import { signSessionName, type SignSession } from "@/lib/sign-sessions";
import { SESSION_OPTIONS, SESSION_PACKAGE } from "@/lib/baddie-sessions";
import SignPicker from "./SignPicker";

// One page per sign Baddie Session (/baddie-sessions/<sign>), built 22 Nov 2026. Short sections and
// tiles only (no walls of text): the sign's own pitch up top, then what every session includes.

const pp = "var(--font-poppins), Poppins, sans-serif";
const btn = (bg: string, ink = "#fff") => ({ display: "inline-block", background: bg, color: ink, fontFamily: pp, fontSize: 16, fontWeight: 800, padding: "18px 32px", border: "var(--border)", textTransform: "none" as const, letterSpacing: "normal" });
const opt = SESSION_OPTIONS[0];

const INCLUDED = [
  { emoji: "🔮", title: "Your whole chart, not only your Sun", body: "Your sign is where we start. I also read your Moon, your Rising, your Venus, your Mars and the rest, so the session fits all of you." },
  { emoji: "🧬", title: "Your Human Design", body: "How you're built to make decisions, use your energy and work, laid side by side with your astrology." },
  { emoji: "⏳", title: "Two to three hours of prep", body: "I study your charts before we meet, so all ninety minutes go on you and what you want." },
  { emoji: "🧠", title: "Hypnosis, mindset + energy work", body: "Pulled in wherever your goals need them, to shift the patterns that keep repeating." },
];

const TAKE_HOME = ["🎥 Your Zoom recording", "📖 Your own reports", "🗺️ An action plan with dates", "📚 Guides picked for you", "✍️ Journal prompts", "🔥 Exercises to embody her"];

export default function SignSessionPage({ s }: { s: SignSession }) {
  const dark = s.accent === "var(--dark)";
  const ink = dark ? "#fff" : "var(--dark)";
  const pop = s.accent === "var(--pink)" ? "#fff" : "var(--pink)";
  const name = signSessionName(s);

  return (
    <>
      {/* Hero: the sign's own pitch, with its glyph card beside it */}
      <section className="px-5 md:px-8" style={{ background: s.accent, color: ink, borderBottom: "var(--border)", paddingTop: 64, paddingBottom: 76 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          <div>
            <span className="holo-sticker">✦ 1:1 with Betty · for {s.nick} baddies</span>
            <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 92px)", lineHeight: 0.95, marginTop: 22, color: ink }}>
              the {s.sign.toLowerCase()}
              <br />
              <span style={{ color: pop }}>baddie session.</span> <span style={{ fontSize: "0.5em" }}>{s.emoji}</span>
            </h1>
            <p style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(19px, 2.2vw, 24px)", lineHeight: 1.3, margin: "22px 0 0" }}>{s.tagline}</p>
            {s.body.map((b) => (
              <p key={b} style={{ fontSize: "clamp(16px, 1.7vw, 18px)", lineHeight: 1.65, fontWeight: 600, maxWidth: 620, margin: "14px 0 0" }}>{b}</p>
            ))}
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, marginTop: 22 }}>{opt.minutes} minutes on Zoom | ${opt.priceUsd} USD</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
              <a href={s.bookingUrl} className="no-underline" style={btn(dark ? "var(--pink)" : "var(--dark)")}>Book your {s.nick} session</a>
              <a href="#inside" className="no-underline" style={btn("#fff", "var(--dark)")}>See what&apos;s inside</a>
            </div>
          </div>
          <div style={{ background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 24, boxShadow: `10px 12px 0 ${dark ? "var(--pink)" : "var(--dark)"}`, padding: "28px 26px", textAlign: "center" }}>
            <div aria-hidden style={{ fontSize: "clamp(120px, 18vw, 200px)", lineHeight: 1, fontFamily: "'Apple Symbols', 'Segoe UI Symbol', 'Noto Sans Symbols 2', serif" }}>{s.glyph}</div>
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 30, marginTop: 6 }}>{s.sign}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{s.dates}</div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 16 }}>
              {[`${s.element} sign`, `ruled by ${s.ruler}`].map((t) => (
                <span key={t} style={{ background: "var(--pink-light)", border: "var(--border)", borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 800 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we work on */}
      <section id="inside" className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 76, scrollMarginTop: 70 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">what we&apos;ll work on</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 60px)", lineHeight: 1 }}>made for <span className="pk">{s.nick} baddies.</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 28 }}>
            {s.focus.map((f) => (
              <div key={f} className="holo-edge" style={{ background: "var(--lav-light)", border: "var(--border)", borderRadius: 18, padding: "18px 20px", fontFamily: pp, fontWeight: 700, fontSize: 17, lineHeight: 1.4 }}>
                <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>{f}
              </div>
            ))}
          </div>
          <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, lineHeight: 1.45, margin: "24px 0 0", padding: "16px 18px", background: "var(--pink-light)", border: "var(--border)", borderRadius: 16 }}>✨ {s.after}</p>
        </div>
      </section>

      {/* What every sign session includes */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-light)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 76 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">how it works</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 60px)", lineHeight: 1 }}>your sign first, <span className="pk">then ALL of you.</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 28 }}>
            {INCLUDED.map((t) => (
              <div key={t.title} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px" }}>
                <div style={{ fontSize: 28, lineHeight: 1 }}>{t.emoji}</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, marginTop: 10 }}>{t.title}</div>
                <p style={{ fontSize: 15, lineHeight: 1.6, margin: "6px 0 0" }}>{t.body}</p>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, marginTop: 30 }}>What lands in your inbox after 💌</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            {TAKE_HOME.map((t) => (
              <span key={t} style={{ background: "#fff", border: "var(--border)", borderRadius: 999, padding: "9px 16px", fontSize: 15, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "24px 0 0" }}>Pop your birth details in straight after you pay, then I&apos;ll be in your inbox to lock in a time that works in your time zone AND mine. Want more than one? <Link href="/baddie-sessions#package" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>Any three sessions are ${SESSION_PACKAGE.priceUsd}</Link>.</p>
        </div>
      </section>

      {/* Meet Betty */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 64, paddingBottom: 68 }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-8 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betty-founder.png" alt="Betty Andrews" style={{ width: "100%", maxWidth: 220, borderRadius: 20, border: "var(--border)", objectFit: "cover", aspectRatio: "4 / 5", transform: "rotate(-2deg)", boxShadow: "8px 10px 0 var(--pink)" }} />
          <div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 4.5vw, 46px)", lineHeight: 1 }}>hi, i&apos;m betty. <span className="pk">your baddie coach.</span></h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, margin: "14px 0 0" }}>Astrologer, manifestation coach and shadow work witch, with twenty years as a coach, business consultant and strategist and thousands of women coached around the world. I take your chart and point all of it at the life you want.</p>
            <Link href="/baddie-sessions" style={{ display: "inline-block", marginTop: 12, color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>See all the Baddie Sessions</Link>
          </div>
        </div>
      </section>

      {/* Other signs */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 60, paddingBottom: 64 }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 22 }}>Not your Sun sign? 💫</div>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "6px 0 18px" }}>Tap yours to see the session made for you.</p>
          <SignPicker current={s.slug} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 md:px-8 text-center" style={{ background: "var(--pink)", paddingTop: 72, paddingBottom: 80 }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "var(--dark)", lineHeight: 0.95 }}>
            it&apos;s your turn, <span style={{ color: "#fff" }}>{s.nick} baddie.</span> <span style={{ fontSize: "0.5em" }}>{s.emoji}</span>
          </h2>
          <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, margin: "18px 0 0" }}>{name} | {opt.minutes} minutes | ${opt.priceUsd} USD</p>
          <a href={s.bookingUrl} className="no-underline" style={{ ...btn("var(--dark)"), marginTop: 24 }}>Book your {s.nick} session</a>
        </div>
      </section>
    </>
  );
}
