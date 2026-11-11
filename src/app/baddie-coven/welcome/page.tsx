import type { Metadata } from "next";
import Link from "next/link";
import CovenOpenSwitch from "@/components/CovenOpenSwitch";

// Where the $44 Coven Stripe checkout sends a buyer the moment they've paid. Its one job is to
// celebrate them and send them to their inbox, where the welcome email creates their account.
export const metadata: Metadata = {
  title: "YOU'RE IN | The Bad B*tch Coven",
  robots: { index: false, follow: false },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

const CONFETTI = ["💜", "🦄", "✨", "🔮", "💖", "🪄", "⭐", "💜", "✨", "🦄", "💖", "🔮", "✨", "🪄", "💜", "⭐"];

const STEPS = [
  ["1", "open the email", "It's called YOU'RE IN THE COVEN, WITCH 🦄"],
  ["2", "create your account", "Tap the button, pop in your name and choose a password."],
  ["3", "add your birth details", "Your whole platform builds itself around YOUR chart."],
];

export default function CovenWelcomePage() {
  return (
    <main className="px-5 md:px-8" style={{ position: "relative", overflow: "hidden", background: "var(--lav-light)", paddingTop: 54, paddingBottom: 80, color: "var(--dark)" }}>
      <style>{`
        @keyframes coven-fall {
          0% { transform: translateY(-60px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(105vh) rotate(320deg); opacity: 0; }
        }
        .coven-confetti { position: absolute; top: 0; font-size: 24px; pointer-events: none; opacity: 0; animation: coven-fall 5s ease-in 2 both; }
        @media (prefers-reduced-motion: reduce) { .coven-confetti { display: none; } }
      `}</style>
      {CONFETTI.map((c, i) => (
        <span key={i} aria-hidden="true" className="coven-confetti" style={{ left: `${(i * 37 + 4) % 96}%`, animationDelay: `${(i * 0.31) % 2.4}s` }}>
          {c}
        </span>
      ))}

      <div className="max-w-5xl mx-auto" style={{ position: "relative" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🦄 founding witch: CONFIRMED</span>
            <h1 className="display" style={{ fontSize: "clamp(48px, 7.5vw, 92px)", lineHeight: 0.95, marginTop: 22 }}>
              oh my godddd, b*tch. yes.{" "}
              <span className="pk">you&apos;re in.</span>
            </h1>
            <p style={{ fontSize: "clamp(18px, 2vw, 21px)", lineHeight: 1.55, fontWeight: 600, marginTop: 22 }}>
              I am actually SCREAMING, this is SO exciting. 😱 You just picked yourself, your magic and your big outrageous life, and I cannot WAIT to see what you do with it. 💜
            </p>
            <section style={{ background: "var(--dark)", color: "#fff", marginTop: 30, padding: "34px 28px 36px", boxShadow: "8px 8px 0 var(--pink)" }}>
              <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>📬 go go go</div>
              <h2 className="display" style={{ fontSize: "clamp(34px, 5.5vw, 62px)", lineHeight: 1, marginTop: 10, color: "#fff" }}>
                your email is landing right now.
              </h2>
              <p style={{ fontSize: "clamp(18px, 2vw, 21px)", lineHeight: 1.5, fontWeight: 700, marginTop: 14 }}>
                RUN to your inbox, babe, that&apos;s where your way in is waiting. 🏃‍♀️💨
              </p>
            </section>
          </div>
          <div className="holo-edge" style={{ borderRadius: 22, overflow: "hidden", transform: "rotate(2deg)", boxShadow: "10px 12px 0 var(--dark)", background: "var(--lav-light)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coven/baddie-money-saturn.jpg" alt="A baddie in a black jacket with Saturn and gold dollar signs" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginTop: 34 }}>
          {STEPS.map(([n, title, body]) => (
            <div key={n} style={{ background: "#fff", border: "var(--border)", padding: "18px 18px 20px" }}>
              <div style={{ fontFamily: pp, fontSize: 28, fontWeight: 800, color: "var(--pink)", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 8, lineHeight: 1.25 }}>{title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.55, marginTop: 6 }}>{body}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.65, fontWeight: 600, marginTop: 22 }}>
          Nothing after five minutes? Have a look in spam and promotions, then{" "}
          <Link href="/create-account" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>get your link sent again here</Link>.
          {" "}Password already set?{" "}
          <Link href="/login" style={{ color: "var(--dark)", fontWeight: 800, textDecoration: "underline" }}>log in here</Link>. 🔑
        </p>

        <CovenOpenSwitch
          closed={null}
          open={
            <section style={{ background: "var(--pink)", border: "var(--border)", marginTop: 34, padding: "26px 26px 28px", color: "var(--dark)" }}>
              <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>🎥 waiting for you inside</div>
              <h2 className="display" style={{ fontSize: "clamp(30px, 4.6vw, 50px)", lineHeight: 1.02, marginTop: 10 }}>
                your 11/11 workshop replay is ready.
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.55, fontWeight: 700, marginTop: 12 }}>
                It&apos;s in your 11/11 portal on the platform, so light a candle, grab your journal and press play, babe. 🎀
              </p>
            </section>
          }
        />

        <p style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, marginTop: 34 }}>Betty 💜</p>
      </div>
    </main>
  );
}
