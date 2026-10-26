import Link from "next/link";
import type { ReactNode } from "react";
import WaitlistForm, { type ApplicationQuestion } from "@/components/WaitlistForm";
import { OFFERS, PODCAST, type OfferSlug } from "@/lib/offers";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The building blocks every MY SZN offer page is made from, so the reports, the coven, the retreat
// and the book read as one brand: same hero, same bands, same waitlist, same "where next".
// Backgrounds alternate pink / white / lav / black like the homepage, never yellow or cream.

type Tone = "pink" | "white" | "lav" | "dark" | "pinkLight";
const BG: Record<Tone, string> = { pink: "var(--pink)", white: "#fff", lav: "var(--lav-light)", dark: "var(--dark)", pinkLight: "var(--pink-light)" };

export function OfferHero({
  offer, kicker, title, accent, intro, tone = "pink", art, ctaHref = "#waitlist", extraCta, titleSize = "clamp(42px, 7.5vw, 96px)",
}: { titleSize?: string; offer: OfferSlug; kicker: string; title: string; accent: string; intro: ReactNode; tone?: "pink" | "dark" | "lav"; art?: ReactNode; ctaHref?: string; extraCta?: ReactNode }) {
  const o = OFFERS[offer];
  const ink = tone === "dark" ? "#fff" : "var(--dark)";
  const accentInk = tone === "pink" ? "#fff" : "var(--pink)";
  return (
    <section className="px-5 md:px-8" style={{ background: tone === "dark" ? "var(--dark)" : tone === "lav" ? "var(--lav)" : "var(--pink)", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 76 }}>
      <div className={art ? "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 items-center" : "max-w-4xl mx-auto"}>
        <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: tone === "pink" ? "#fff" : "var(--pink)", marginBottom: 22 }}>
          {o.emoji} {kicker}
        </div>
        <h1 className="display" style={{ fontSize: titleSize, color: ink, lineHeight: 0.95 }}>
          {title}
          <br />
          <span style={{ color: accentInk }}>{accent}</span>
        </h1>
        <div style={{ fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.65, color: ink, maxWidth: 680, marginTop: 26, fontWeight: 600 }}>{intro}</div>
        <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 34 }}>
          <a href={ctaHref} {...(ctaHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="no-underline" style={{ background: tone === "pink" ? "var(--dark)" : "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "22px 46px", display: "inline-block" }}>
            {o.cta}
          </a>
          {extraCta}
          {o.price && <span style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, color: ink }}>{o.price}</span>}
        </div>
        </div>
        {art && <div className="flex justify-center">{art}</div>}
      </div>
    </section>
  );
}

/** A copy band: tag, display heading, paragraphs. */
export function Band({ tone = "white", tag, title, accent, wide, children }: { tone?: Tone; tag: string; title: string; accent?: string; wide?: boolean; children: ReactNode }) {
  const ink = tone === "dark" ? "#fff" : "var(--dark)";
  return (
    <section className="px-5 md:px-8" style={{ background: BG[tone], borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
      <div className="max-w-4xl mx-auto">
        <div className="tag mb-5">{tag}</div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: ink, lineHeight: 1 }}>
          {title} {accent && <span className="pk">{accent}</span>}
        </h2>
        <div className="offer-copy" style={{ color: ink, marginTop: 24, maxWidth: wide ? undefined : 760 }}>{children}</div>
      </div>
    </section>
  );
}

/** A grid of themed tiles: what we explore / what's inside. */
export function Tiles({ items, tone = "white" }: { items: { emoji: string; title: string; body: ReactNode }[]; tone?: Tone }) {
  return (
    <div className="offer-tiles grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 30 }}>
      {items.map((t) => (
        <div key={t.title} style={{ border: "var(--border)", borderRadius: 18, background: tone === "white" ? "var(--pink-light)" : "#fff", padding: "20px 20px 22px", color: "var(--dark)" }}>
          <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>{t.emoji} {t.title}</div>
          <div style={{ fontSize: 15, lineHeight: 1.65 }}>{t.body}</div>
        </div>
      ))}
    </div>
  );
}

/** "This is for you if" list. */
export function ForYouIf({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "26px 0 0", display: "grid", gap: 12 }}>
      {items.map((i) => (
        <li key={i} style={{ fontSize: 16.5, lineHeight: 1.6, fontWeight: 600 }}>
          <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>
          {i}
        </li>
      ))}
    </ul>
  );
}

/** The waitlist band, anchored at #waitlist so every hero button lands here. */
export function WaitlistBand({ offer, title, accent, body, question, questions, submitLabel }: { offer: OfferSlug; title: string; accent: string; body: ReactNode; question?: string; questions?: ApplicationQuestion[]; submitLabel?: string }) {
  return (
    <section id="waitlist" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, scrollMarginTop: 80 }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
            {title}
            <br />
            <span className="pk">{accent}</span>
          </h2>
          <div style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.85)", marginTop: 22, fontWeight: 500 }}>{body}</div>
        </div>
        <WaitlistForm offer={offer} question={question} questions={questions} submitLabel={submitLabel} tone="dark" />
      </div>
    </section>
  );
}

/** Small cards linking to the rest of the universe. */
export function OfferCards({ exclude, title = "the rest of the universe", tone = "lav" }: { exclude?: OfferSlug; title?: string; tone?: Tone }) {
  const cards = [
    ...(["rich-btch-rising", "bad-btch-report", "baddie-coven", "mastermind", "retreat"] as OfferSlug[]).map((s) => OFFERS[s]),
    { ...PODCAST, line: "the weekly pep talk your future self would give you", slug: "podcast" },
    OFFERS.book,
  ].filter((c) => c.slug !== exclude);
  return (
    <section className="px-5 md:px-8" style={{ background: BG[tone], borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 80 }}>
      <div className="max-w-6xl mx-auto">
        <div className="tag mb-5">more my szn</div>
        <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 56px)", color: "var(--dark)", lineHeight: 1 }}>{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 28 }}>
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="no-underline offer-card" style={{ border: "var(--border)", borderRadius: 18, background: "#fff", padding: "22px 20px", color: "var(--dark)", display: "block" }}>
              <div style={{ fontSize: 30 }}>{c.emoji}</div>
              <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, lineHeight: 1.2, marginTop: 8 }}>{c.name}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, marginTop: 6 }}>{c.line}</div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", marginTop: 14 }}>take me there →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A report or book cover drawn in CSS, styled after the real report PDFs, so it shows the product
 *  without printing anyone's actual birth details. */
export function Cover({ kind }: { kind: "rich-btch-rising" | "bad-btch-report" | "book" }) {
  const c = {
    "rich-btch-rising": { bg: "var(--dark)", ink: "#fff", top: "my szn presents", lines: ["rich", "b*tch", "rising."], hot: 1, sub: "worth · wealth · receiving · purpose", img: "/cosmic-money.png", tilt: -4 },
    "bad-btch-report": { bg: "var(--pink)", ink: "var(--dark)", top: "my szn presents", lines: ["the bad", "b*tch", "report"], hot: 1, sub: "your personalised astrology blueprint for taking up more space", img: null, tilt: 4 },
    book: { bg: "var(--lav)", ink: "var(--dark)", top: "betty · my szn", lines: ["becoming", "her."], hot: 1, sub: "out now in paperback + ebook", img: null, tilt: -3 },
  }[kind];
  return (
    <div aria-hidden="true" style={{ width: "min(320px, 78vw)", aspectRatio: "0.707", background: c.bg, color: c.ink, border: "var(--border)", borderRadius: 6, padding: "26px 24px", position: "relative", overflow: "hidden", transform: `rotate(${c.tilt}deg)`, boxShadow: "10px 12px 0 var(--dark)", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8 }}>{c.top}</div>
      <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 44, lineHeight: 0.92, letterSpacing: "-0.03em", marginTop: 22, textTransform: kind === "bad-btch-report" ? "uppercase" : "lowercase" }}>
        {c.lines.map((l, i) => (
          <div key={l} style={{ color: i === c.hot ? (kind === "bad-btch-report" ? "#fff" : "var(--pink)") : undefined, fontStyle: i === c.hot && kind === "bad-btch-report" ? "italic" : undefined }}>{l}</div>
        ))}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.5, marginTop: 16, maxWidth: kind === "bad-btch-report" ? 165 : 200, fontWeight: 600, position: "relative", zIndex: 1 }}>{c.sub}</div>
      {kind === "bad-btch-report" && (
        <div style={{ position: "absolute", right: -18, top: "42%", width: 120, height: 120, background: "var(--lav)", clipPath: "polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)" }} />
      )}
      {c.img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.img} alt="" style={{ position: "absolute", right: -20, bottom: 40, width: "62%" }} />
      )}
      <div style={{ marginTop: "auto", borderTop: `1.5px solid ${c.ink}`, paddingTop: 10, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {kind === "book" ? "the my szn book" : "prepared for you"}
      </div>
    </div>
  );
}

/** A floating decorative image for the Coven and Retreat heroes. */
export function HeroArt({ src }: { src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden="true" style={{ width: "min(380px, 80vw)", height: "auto" }} />;
}
