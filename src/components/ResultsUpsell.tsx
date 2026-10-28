"use client";

import Link from "next/link";
import { OFFERS, type OfferSlug } from "@/lib/offers";
import { SESSION_OPTIONS } from "@/lib/baddie-sessions";
import { track, EVENTS } from "@/lib/analytics";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The end of the free chart: every way to keep going with Betty, sitting under whichever reading is
// open. Names, prices and links come from OFFERS so they can never drift from the sales pages. The
// coven leads because it's the launch; the rest sit as an even grid underneath.

const session = SESSION_OPTIONS[0];

type Card = { key: string; emoji: string; name: string; href: string; price: string | null; body: string; cta: string };

function offerCard(slug: OfferSlug, body: string): Card {
  const o = OFFERS[slug];
  return { key: slug, emoji: o.emoji, name: o.name, href: o.href, price: o.price, body, cta: o.cta };
}

const CARDS: Card[] = [
  offerCard("bad-btch-report", "Your personalised blueprint for becoming the main character of your own life, hand-made from the exact chart you just read and landing in your inbox within 48 hours. 💜"),
  offerCard("rich-btch-rising", "Everything your chart says about wealth, worth and getting PAID, so you know exactly how YOU are built to make seriouuuus money. 💸"),
  {
    key: "sessions",
    emoji: "💅",
    name: "The Baddie Sessions",
    href: "/baddie-sessions",
    price: `${session.minutes} minutes 1:1 | $${session.priceUsd}`,
    body: "Ninety minutes with me, after I've spent two to three hours obsessing over your astrology and your Human Design, with hypnosis, mindset and energy work wherever your goals need them.",
    cta: "pick your session",
  },
  offerCard("mastermind", "Ninety days of becoming HER, with a private 1:1 with me every single month and a small group of women levelling up right alongside you. 🪐"),
];

const click = (label: string) => track(EVENTS.CTA_CLICK, { label, location: "results_upsell" });

export default function ResultsUpsell({ name }: { name?: string }) {
  const coven = OFFERS["baddie-coven"];
  const first = name?.trim().split(" ")[0];

  return (
    <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderTop: "var(--border)", paddingTop: 64, paddingBottom: 72 }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center" style={{ maxWidth: 640, margin: "0 auto" }}>
          <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>✨ your chart is just the start</span>
          <h2 style={{ fontFamily: pp, fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1.4px", lineHeight: 1.04, color: "var(--dark)", margin: "22px 0 14px" }}>
            {first ? `${first.toLowerCase()}, now go become ` : "now go become "}
            <span style={{ color: "var(--pink)" }}>all of her.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>
            Your chart just showed you who you&apos;re here to become, babe, so here&apos;s every way I can help you get there, from a report you can read in bed tonight to ninety minutes with me going DEEP on your chart.
          </p>
        </div>

        {/* The coven, featured: foil card, so everything on it stays solid black (no holo on holo). */}
        <div className="hd-foil" style={{ position: "relative", marginTop: 40, border: "var(--border)", borderRadius: 24, padding: "30px 28px", boxShadow: "10px 12px 0 var(--dark)", color: "var(--dark)" }}>
          <span style={{ position: "absolute", top: -14, right: 18, transform: "rotate(4deg)", background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "7px 14px", fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            opens 5 nov · 3 days only
          </span>
          <div className="md:flex md:items-center md:justify-between gap-8">
            <div style={{ maxWidth: 600 }}>
              <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>{coven.emoji} founding witches · {coven.price}</div>
              <h3 style={{ fontFamily: pp, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.05, margin: "10px 0 10px" }}>{coven.name.toLowerCase()}.</h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0, fontWeight: 600 }}>
                Your monthly coven circle, personal guidance for every single season on the platform I built, rituals, money magic and a whole coven of baddies doing it with you. Founding witches lock in $44 a month for as long as they stay, and our FIRST EVER event is the 11/11 manifestation workshop. 🪄
              </p>
            </div>
            <Link href={coven.href} onClick={() => click("baddie_coven")} className="no-underline inline-block" style={{ marginTop: 20, flexShrink: 0, background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 26px", borderRadius: 999, whiteSpace: "nowrap" }}>
              {coven.cta} →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 32 }}>
          {CARDS.map((c) => (
            <div key={c.key} style={{ display: "flex", flexDirection: "column", background: "#fff", border: "var(--border)", borderRadius: 22, padding: "26px 24px", boxShadow: "7px 9px 0 var(--pink)", color: "var(--dark)" }}>
              <div style={{ fontSize: 30, lineHeight: 1 }}>{c.emoji}</div>
              <h3 style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.15, margin: "12px 0 6px" }}>{c.name}</h3>
              {c.price && <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, color: "var(--pink)", letterSpacing: "0.02em" }}>{c.price}</div>}
              <p style={{ fontSize: 15, lineHeight: 1.65, margin: "12px 0 20px", flex: 1 }}>{c.body}</p>
              <Link href={c.href} onClick={() => click(c.key)} className="btn-pink no-underline" style={{ alignSelf: "flex-start" }}>
                {c.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
