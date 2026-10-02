"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDoorCta } from "@/lib/use-door-cta";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The "big dreams, bigger $$$" band: the repeating line from Betty's Instagram post as a hot pink
// wall of text, her five-slide text post as cards on top of it, then the ask. The month in the line
// is read on the client after mount, so it's always the month she's reading it in.

const POSTS: string[][] = [
  [
    "F*CK PLAAAYING SMALLLLLL ANYMORE.",
    "I'm genuinely soooo BORED of women waiting until they're confident enough, healed enough, qualified enough, pretty enough, rich enough or universally approved before they let themselves have the life they actually want.",
    "You want MORE. Admit it.",
    "Make the money. Wear the outfit. Pitch the brand. Book the flight. Say the thing. Raise your prices. Change your mind. Take up space without immediately trying to make yourself easier for everybody else to digest.",
  ],
  [
    "Half the sh*t we call a confidence problem is really us being terrified that somebody somewhere might have an opinion about us.",
    "They probably will.",
    "Survive it.",
    "Because imagine getting to 80 and realising you edited your entire f*cking life around people who weren't even thinking about you that much.",
    "Absolutely NOTTTTT.",
  ],
  [
    "Self-confidence grows when you start treating your own desires like they matter, trusting your decisions without conducting a public referendum and keeping promises to yourself even when nobody else can see what you're doing.",
    "You don't need to become completely fearless before you make a bigger move either. Sometimes your heart is hammering, your brain is screaming WHAT THE F*CK ARE WE DOINGGGGG and you press publish anyway.",
  ],
  [
    "Then you realise you survived, you can handle yourself, and suddenly the next move doesn't feel quite so impossible.",
    "That's the version of you I want running your life.",
    "The woman making more money because she actually asks for what she wants, creating better relationships because her standards have changed, becoming more visible because she's stopped obsessing over being palatable, and building a life that actually resembles the one she keeps thinking about when nobody else is around.",
  ],
  [
    "If you're working on your self-confidence and self-love right now, come do it with us inside MY SZN 💖",
    "Every SZN we work on a different area of your life using your astrology + Human Design alongside manifestation, shadow work and live group coaching, so you can actually MAKE THE MOVES towards your absolute best life.",
    "Come join the girls inside MY SZN ✨",
  ],
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BigDreamsBand() {
  const [month, setMonth] = useState<string | null>(null);
  useEffect(() => setMonth(MONTHS[new Date().getMonth()]), []);
  const line = `${month ?? "This month"} is going to be a “big dreams, bigger $$$” month.`;
  const cta = useDoorCta();

  return (
    <section
      className="bigdreams px-5 md:px-8"
      style={{ background: "var(--pink)", borderBottom: "var(--border)", position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 80 }}
    >
      {/* The wall of text. Decorative, so it's hidden from screen readers and the one real copy of
          the line is the heading below. */}
      <div aria-hidden="true" className="bigdreams-wall">
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="sr-only">{line}</h2>

        <div className="bigdreams-row" role="list">
          {POSTS.map((paras, i) => (
            <article key={i} role="listitem" className="bigdreams-card">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/betty-founder.png" alt="" aria-hidden="true" className="bigdreams-avatar" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--dark)", marginBottom: 4 }}>universeofbetty</div>
                  {paras.map((p) => (
                    <p key={p} style={{ fontSize: 15.5, lineHeight: 1.5, color: "var(--dark)", margin: "0 0 12px" }}>
                      {p}
                    </p>
                  ))}
                  <span className="bigdreams-count">
                    {i + 1}/{POSTS.length}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="bigdreams-ask">
          <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(22px, 3.4vw, 34px)", lineHeight: 1.2, letterSpacing: "-0.6px", color: "var(--dark)", margin: 0 }}>
            If you want MORE money, bigger dreams, ridiculous confidence &amp; a life that makes your younger self go{" "}
            <span style={{ color: "#fff" }}>HOLY F*CKKKKK</span>, come join us inside MY SZN.
          </p>
          <Link
            href={cta.href}
            className="no-underline"
            style={{
              background: "var(--dark)",
              color: "#fff",
              fontFamily: poppins,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "20px 44px",
              display: "inline-block",
              marginTop: 28,
            }}
          >
            {cta.label}
          </Link>
          {cta.line && <p style={{ fontSize: 15, fontWeight: 700, color: "var(--dark)", marginTop: 14, marginBottom: 0 }}>{cta.line}</p>}
        </div>
      </div>
    </section>
  );
}
