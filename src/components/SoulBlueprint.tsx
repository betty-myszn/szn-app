"use client";

import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The core narrative of the whole product, shared by the homepage and the membership page so the
// one story everything rests on is told the same way in both places. It moves in four beats:
//
//   1. the problem   more personal development than ever, and the woman doesn't change with it,
//                    because most of it hands her someone else's life and calls it a plan.
//   2. the blueprint God gave her a soul blueprint. Her astrology and Human Design are the map of
//                    who she came here to be. Her desires show her HER. This is identity work.
//   3. the arc       who you are today, who you want to become, become her, live her life.
//   4. the close     MY SZN closes the gap: her chart reveals her, her seasons build her.
//
// It's one component rather than four loose sections because the beats only work in order, and one
// source of truth is how the homepage and the sales page stay saying the same thing.

const YOU = [
  "your identity, and the conditioning sitting on top of it",
  "your gifts, and how you're actually wired to move",
  "how you love, decide, communicate and make money",
  "the shadow, the fear, and where you keep getting stuck",
];

const HER = [
  "her natural strengths, fully switched on",
  "how she actually decides, without second-guessing",
  "her money and her voice, no shrinking",
  "what confidence looks like once it's lived in",
];

const ARC = [
  { n: "1", t: "who you are today", pink: false },
  { n: "2", t: "who you want to become", pink: false },
  { n: "3", t: "become her", pink: true },
  { n: "4", t: "live her life", pink: false },
];

export default function SoulBlueprint({
  showCta = true,
  ctaHref = "/membership",
}: {
  /** The join CTA under the closing beat. Off where the page has its own CTA right below. */
  showCta?: boolean;
  /** Where the CTA points. On the membership page itself, send her to the pricing, not back here. */
  ctaHref?: string;
}) {
  return (
    <>
      {/* ── 1. THE PROBLEM ── */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--cream)", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-6">advice is everywhere</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 76px)", color: "var(--dark)", maxWidth: 940 }}>
            there&apos;s more advice than everrr.
            <br />
            <span className="pk">but is any of it personalised to you?</span>
          </h2>
          {/* The copy sat alone with a lot of dead space to its right on desktop. The planet fills it
              and carries the brand, sitting beside the text on wide screens and dropping under it on
              mobile so the writing always leads. */}
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14" style={{ marginTop: 26 }}>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--grey)", maxWidth: 620, fontWeight: 500, flex: "1 1 auto" }}>
              Women can reach more personal development than any generation before them: podcasts, books,
              courses, methods, morning routines, an endless scroll of ways to fix yourself. The
              information keeps growing, and the woman doesn&apos;t change with it. Most of it assumes
              everyone should run the same way, wake at 5am, follow this routine, be more disciplined, be
              more visible. It hands her someone else&apos;s life and calls it a plan.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cosmic-planet.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              style={{ width: "min(340px, 72vw)", height: "auto", flexShrink: 0, alignSelf: "center", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ── 2. THE BLUEPRINT (the emotional turn) ── */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 88, paddingBottom: 88 }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            style={{
              fontFamily: poppins,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--pink)",
              marginBottom: 24,
            }}
          >
            this is identity work
          </div>

          <h2 className="display" style={{ fontSize: "clamp(40px, 8vw, 104px)", color: "#fff" }}>
            you came here with a soul <span style={{ color: "var(--pink)" }}>blueprint.</span>
          </h2>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 660,
              margin: "30px 0 14px",
              fontWeight: 500,
            }}
          >
            God gave you a soul blueprint, and your astrology and Human Design are the map of it: who
            you came here to be, how you&apos;re wired to move through the world, where your gifts live,
            how you love, decide and make money, and where you keep getting stuck. Your desires are the
            other half of it. They show you what you&apos;re here to experience, and the woman already
            living it. That&apos;s HER.
          </p>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-12"
            style={{ border: "1.5px solid rgba(255,255,255,0.18)" }}
          >
            <div className="p-8 md:p-10">
              <div
                style={{
                  fontFamily: poppins,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 20,
                }}
              >
                your blueprint · who you are
              </div>
              <ul style={{ display: "grid", gap: 14, margin: 0, padding: 0, listStyle: "none" }}>
                {YOU.map((line) => (
                  <li key={line} style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.78)", paddingLeft: 18, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 md:p-10 blueprint-her-col">
              <div
                style={{
                  fontFamily: poppins,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--pink)",
                  marginBottom: 20,
                }}
              >
                her · who you&apos;re becoming
              </div>
              <ul style={{ display: "grid", gap: 14, margin: 0, padding: 0, listStyle: "none" }}>
                {HER.map((line) => (
                  <li key={line} style={{ fontSize: 15, lineHeight: 1.6, color: "#fff", fontWeight: 600, paddingLeft: 18, borderLeft: "2px solid var(--pink)" }}>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "#fff",
              maxWidth: 660,
              marginTop: 32,
              fontWeight: 600,
            }}
          >
            This is conscious identity work, not another horoscope. You can have a big life and anything
            you truly want, and it looks different for every woman who walks in: for one it&apos;s a
            global company, for another it&apos;s the ocean, three days a week and time with her kids.
            The size was never the point. Choosing it is.
          </p>
        </div>
      </section>

      {/* ── 3. THE ARC ── */}
      <section
        className="px-5 md:px-8"
        style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-6">the work</div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 72px)", color: "var(--dark)", maxWidth: 900 }}>
            from who you are today, to her, to <span className="pk">her whole life.</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-12" style={{ border: "1.5px solid var(--dark)" }}>
            {ARC.map((step, i) => (
              <div
                key={step.n}
                className="p-7"
                style={{
                  background: step.pink ? "var(--pink)" : "var(--dark)",
                  borderRight: i < ARC.length - 1 ? "1.5px solid rgba(255,255,255,0.16)" : undefined,
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, color: step.pink ? "#fff" : "var(--pink)", marginBottom: "auto" }}>
                  {step.n}
                </div>
                <h3 style={{ fontFamily: poppins, fontSize: "clamp(17px, 2vw, 21px)", fontWeight: 800, letterSpacing: "-0.4px", color: "#fff", lineHeight: 1.15 }}>
                  {step.t}
                </h3>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--grey)", maxWidth: 720, marginTop: 28, fontWeight: 500 }}>
            Underneath every stage sit the same questions: what you want, what you believe, how you
            decide, what you no longer tolerate, and what has to change inside you before anything
            changes outside you.
          </p>
        </div>
      </section>

      {/* ── 4. THE CLOSE (positioning) ── */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 88, paddingBottom: 88 }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            style={{
              fontFamily: poppins,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 24,
            }}
          >
            what my szn does
          </div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 6.5vw, 88px)", color: "var(--dark)", maxWidth: 980 }}>
            your chart reveals her.
            <br />
            <span style={{ color: "#fff" }}>your seasons build her.</span>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--dark)", maxWidth: 660, marginTop: 28, fontWeight: 500 }}>
            MY SZN closes the gap between who you are now and the woman already living the life you want.
            We use your chart to show you who you are, and your seasons to help you become who you came
            here to be, one season at a time. There is nothing else built to do this.
          </p>
          {showCta && (
            <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: 32 }}>
              <Link
                href={ctaHref}
                className="no-underline"
                style={{
                  background: "var(--dark)",
                  color: "#fff",
                  fontFamily: poppins,
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "18px 42px",
                  display: "inline-block",
                }}
              >
                start becoming her
              </Link>
              <Link href="/human-design" className="btn-outline no-underline">
                see your blueprint
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
