import type { Metadata } from "next";
import { OfferHero, Band, WaitlistBand, HeroArt } from "@/components/Offer";

// The Free Money Workshop: a free live online workshop on Sunday 15 November 2026 (Scorpio SZN).
// Registration runs through the waitlist (offer "money-workshop", Brevo list 32). The start time isn't
// set yet, so the page promises it by email rather than printing one.

export const metadata: Metadata = {
  title: "The Free Money Workshop with Betty, Sunday 15 November",
  description:
    "A free live money workshop with Betty Andrews on Sunday 15 November: what your birth chart says about money, the rules that keep you undercharging and the self-worth shift that changes your bank balance. Save your free spot.",
  alternates: { canonical: "/money-workshop" },
  openGraph: {
    title: "The Free Money Workshop 💸 Sunday 15 November",
    description: "A free live money workshop with Betty. Save your spot.",
    url: "/money-workshop",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

// What we cover live. Each card does its own job, so no two read alike.
const COVER = [
  ["🪐", "Your money in your chart", "Where money is written into YOUR birth chart, the houses and planets that run your income, and the kind of work that pays you best."],
  ["🫦", "The good-girl money rules", "The inherited rules about being humble, being grateful and never asking for too much, and how they show up every time you send an invoice."],
  ["💎", "Worth before wealth", "The self-worth shift that decides what you charge, what you accept and what you let yourself receive, worked through live, together."],
  ["🔮", "Scorpio SZN money magic", "Scorpio season rules power, investments and other people's money, so we use it for a money ritual you can keep doing long after Sunday."],
];

// She should see herself in at least three of these.
const FIT = [
  "You know you're meant for more money, and your bank balance hasn't got the memo yet.",
  "You undercharge, over-deliver and then feel weird asking for what you're worth.",
  "Money talk makes you a little bit tense, and you'd love it to feel FUN instead.",
  "You love astrology and you want to know what your chart says about getting PAID.",
  "You're ready to stop playing small with money before 2027 gets here.",
];

const FAQS = [
  ["Is it really free?", "Totally free, babe. Save your spot with your details and your joining link comes to your inbox."],
  ["What time is it?", "The exact time, shown in your own time zone, comes by email with your joining link before we go live on Sunday 15 November."],
  ["Where does it happen?", "Live online, from wherever you're cosiest. Bring a notebook, a drink you love and your biggest money dreams."],
  ["Why do you ask for my birth details?", "So I can show you where money lives in YOUR chart. They're stored privately and never shown anywhere public."],
  ["I don't know my birth time. Can I still come?", "YES. Tick the box when you sign up and you'll still get everything that comes from your planets and signs."],
  ["Do I need to know astrology?", "Not even a little. Everything is explained in plain English, step by step."],
];

const card = { border: "2px solid var(--dark)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" } as const;

export default function MoneyWorkshopPage() {
  return (
    <>
      <OfferHero
        offer="money-workshop"
        art={<HeroArt src="/cosmic-money.png" />}
        tone="pink"
        kicker="free live workshop · sunday 15 november"
        title="your money era"
        accent="starts sunday."
        intro={
          <>
            <p style={{ margin: "0 0 12px" }}>Come and meet the version of you who charges her worth, receives without flinching and watches her bank balance catch up with her dreams.</p>
            <p style={{ margin: 0, fontWeight: 500 }}>This is my free live money workshop, where we get into what your birth chart says about money, the old rules that keep you undercharging and the self-worth shift that changes what lands in your account.</p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 20 }}>
              {["💸 100% free", "🪐 your chart + money", "💻 live online", "♏ scorpio szn"].map((t) => (
                <span key={t} className="holo-sticker">{t}</span>
              ))}
            </div>
          </>
        }
      />

      <Band tag="sound familiar" title="you're ready for more money," accent="your bank balance isn't (yet).">
        <p>You&apos;re talented, you work SO hard and you know you&apos;re meant for a much bigger life, and somehow the money keeps landing at the same old number.</p>
        <p>You drop your prices before anyone even asks, you feel a little bit sick sending an invoice and you&apos;d rather over-deliver than risk looking greedy.</p>
        <p><strong>On Sunday we change that, starting with your chart, your worth and the money rules you were handed before you could say no to them.</strong></p>
      </Band>

      <Band tone="lav" wide tag="what we get into" title="sunday is all" accent="money magic.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 26 }}>
          {COVER.map(([e, t, b]) => (
            <div key={t} className="holo-edge" style={card}>
              <span style={{ fontSize: 28 }}>{e}</span>
              <div style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, lineHeight: 1.2, margin: "10px 0 6px" }}>{t}</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{b}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band wide tag="you'll love it if" title="this workshop has your name" accent="ALL over it.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 26 }}>
          {FIT.map((f) => (
            <div key={f} className="flex items-start gap-3" style={{ ...card, padding: "16px 18px", background: "var(--pink-light)" }}>
              <span aria-hidden="true" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 7, border: "2px solid var(--dark)", background: "var(--pink)", color: "#fff", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 800 }}>✓</span>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, fontWeight: 600 }}>{f}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band wide tag="faqs" title="the little" accent="details.">
        <div className="grid gap-3" style={{ marginTop: 26, maxWidth: 820 }}>
          {FAQS.map(([q, a]) => (
            <details key={q} style={{ ...card, padding: "16px 20px" }}>
              <summary style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>{q}</summary>
              <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.65 }}>{a}</p>
            </details>
          ))}
        </div>
      </Band>

      <WaitlistBand
        offer="money-workshop"
        title="save your"
        accent="free spot. 💸"
        body={
          <>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Sunday 15 November, live online, totally free.</p>
            <p style={{ margin: "0 0 14px" }}>Pop your details in and your joining link, plus the exact time in your time zone, comes straight to your inbox.</p>
            <p style={{ margin: 0, fontFamily: pp, fontWeight: 800, color: "#fff" }}>See you Sunday, rich b*tch. 💜</p>
          </>
        }
        question="What would you love more money to change for you?"
      />
    </>
  );
}
