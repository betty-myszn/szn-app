import type { Metadata } from "next";
import Link from "next/link";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferCards, Cover } from "@/components/Offer";

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
    body: "Nine chapters on who you are when nobody's shrinking you, what's been keeping you small, and the big outrageous life your chart has been pointing at this whole time, written for the sign AND the house of all fifteen of your placements, so it reads like YOU and absolutely nobody else. 💜",
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
    body: "Your second house, tenth house, eighth house, Venus and Jupiter, read together so you can see how you're built to earn, where the family money stories and good-girl guilt have been running your bank account, and what changes when you let yourself be well-paid, ambitious and VERY pleased with yourself. 💸",
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
  ["01", "you pop in your birth details", "Date, time and place of birth go straight into checkout. No birth time? Write \"unknown\" and we work with everything else, which is still a LOT."],
  ["02", "betty builds your report", "Every placement gets read by sign AND by house from writing I've done for every single combination, then put together by hand for your chart, so two Leos get two completely different reports."],
  ["03", "she lands in your inbox", "A beautifully designed PDF, yours forever, to read in bed, print, highlight and scribble ALLLL over, then actually go and DO."],
] as const;

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

      <section id="reports" className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 80 }}>
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
              I wrote these reports as the conversation I&apos;d have with you if we sat down with your chart between us, a very large coffee and absolutely zero filter, so every word is mine, every sign and every house got its own writing, and the version you get is matched to YOUR exact placements. Some of it will feel like a compliment, some of it will feel like being caught red-handed, and both are exactly the point. 💖
            </p>
          </div>
        </div>
      </section>

      <QuoteStrip ids={["chloe", "georgia", "lauren"]} label="what becoming her looks like" tone="white" />

      <section className="px-5 md:px-8 bg-glitter" style={{ borderBottom: "var(--border)", paddingTop: 84, paddingBottom: 92 }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
            your chart has been talking
            <br />
            <span className="pk">about you for yearsss.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#fff", marginTop: 22, fontWeight: 500, maxWidth: 620 }}>
            Start with The Bad B*tch Report and she&apos;s in your inbox within 48 hours, then hop on the Rich B*tch Rising waitlist so you&apos;re first in line the second the money report opens. ✨
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
