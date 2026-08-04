"use client";

import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The "what is Human Design and how does it work" block, shared by the homepage, the membership
// page and the waitlist page. One component rather than three copies, because this is the copy
// most likely to keep changing while the feature is new, and three drifting versions of the
// explanation is how a reader ends up with three different ideas of what she is buying.
//
// The three numbered steps exist instead of a paragraph because the audience for this has mostly
// never heard of Human Design and will skim. Step 1 removes the "do I have to do more work"
// objection before it forms, which is the main thing standing between her and caring about it.

const STEPS = [
  {
    n: "01",
    t: "same birth details",
    b: "Your date, time and place of birth. Nothing new to fill in, nothing extra to buy. If you've already got your chart with us, your design is already there.",
  },
  {
    n: "02",
    t: "two charts, not one",
    b: "We calculate the moment you were born, and the moment about three months before it that Human Design calls your design. The second one is the part you don't consciously run.",
  },
  {
    n: "03",
    t: "your type, strategy, authority",
    b: "How your energy actually works, how things are meant to start for you, and how you're built to make a decision you won't second-guess at 2am.",
  },
];

export default function HumanDesignExplainer({
  showNewBadge = true,
  showCtas = true,
  headingSize = "clamp(40px, 8vw, 104px)",
}: {
  /** The "new" sticker. On by default while the feature is a launch, drop it once it isn't. */
  showNewBadge?: boolean;
  /** Off where the page already has its own call to action right below this. */
  showCtas?: boolean;
  headingSize?: string;
}) {
  return (
    <section
      className="px-5 md:px-8"
      style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 88, paddingBottom: 88 }}
    >
      <div className="max-w-6xl mx-auto">
        {showNewBadge && (
          <span className="sticker" style={{ background: "var(--pink)", color: "#fff", marginBottom: 26 }}>
            new
          </span>
        )}
        <h2 className="display" style={{ fontSize: headingSize, color: "#fff", marginTop: showNewBadge ? 18 : 0 }}>
          now with your
          <br />
          <span style={{ color: "var(--pink)" }}>human design.</span>
        </h2>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 620,
            margin: "28px 0 12px",
            fontWeight: 500,
          }}
        >
          Astrology tells you who you&apos;re here to become. Human Design tells you how you&apos;re
          built to get there. You now get both, woven into one read instead of two systems you have
          to reconcile yourself.
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12"
          style={{ border: "1.5px solid rgba(255,255,255,0.18)" }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="p-8"
              style={{ borderRight: i < STEPS.length - 1 ? "1.5px solid rgba(255,255,255,0.18)" : undefined }}
            >
              <div
                style={{
                  fontFamily: poppins,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  color: "var(--pink)",
                  marginBottom: 14,
                }}
              >
                {step.n}
              </div>
              <h3
                style={{
                  fontFamily: poppins,
                  fontSize: 19,
                  fontWeight: 800,
                  letterSpacing: "-0.4px",
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                {step.t}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.6)" }}>{step.b}</p>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.6)",
            maxWidth: 620,
            marginTop: 32,
          }}
        >
          Then it runs through everything. Your money, your career, your relationships and the rest
          all read both systems at once, so you get one answer instead of two half-answers that
          don&apos;t quite agree.
        </p>
        {/* The differentiator, stated as what we do rather than as a claim about the market.
            "Nothing else exists like this" is not something we can stand behind if a competitor
            turns up, and it isn't needed: the specific thing (both systems answered together,
            per life area, on her own chart) is unusual enough on its own. */}
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: "#fff",
            maxWidth: 620,
            marginTop: 18,
            fontWeight: 600,
          }}
        >
          Most places hand you astrology or Human Design and leave you to work out where they meet.
          This one answers that for you, on your chart, every szn.
        </p>

        {showCtas && (
          <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: 32 }}>
            <Link href="/human-design" className="btn-pink no-underline">
              see your human design
            </Link>
            <Link href="/membership" className="btn-outline btn-outline--white no-underline">
              what&apos;s inside
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
