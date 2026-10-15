"use client";

import Link from "next/link";
import { useDoorCta } from "@/lib/use-door-cta";
import WaitlistForm from "@/components/WaitlistForm";
import { OFFERS } from "@/lib/offers";
import Manifesto from "@/components/Manifesto";
import ThreeMonthsFromNow from "@/components/ThreeMonthsFromNow";
import ValueStack from "@/components/ValueStack";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import MeetBetty from "@/components/MeetBetty";
import HomeFaq from "@/components/HomeFaq";
import CoachingBand from "@/components/CoachingBand";
import QuoteStrip from "@/components/QuoteStrip";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// ─────────────────────────────────────────────────────────────────────────────────────────────
// The MY SZN Mastermind: the 90-day transformation experience, $1,500 per cohort ($500 a month).
// This is the old homepage moved here almost word for word (13 Oct 2026), when / became the brand
// homepage for the whole MY SZN universe. Waitlist only for now: every button lands on #waitlist,
// and the door/checkout logic is gone until Betty opens enrolment. Metadata lives in layout.tsx
// because this page is a client component.
// ─────────────────────────────────────────────────────────────────────────────────────────────

function Ticker({ items, variant }: { items: string[]; variant?: "lav" }) {
  const doubled = [...items, ...items];
  return (
    <div className={`ticker${variant === "lav" ? " ticker--lav" : ""}`}>
      <div className="ticker-inner">
        {doubled.map((text, i) => (
          <span key={i}>
            {i > 0 && <span className="dot">&#10022;</span>}
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MastermindPage() {
  const doorCta = useDoorCta();

  return (
    <>
      {/* ─── 1. HERO ─── job: create desire and give her one thing to click. The mission only, no
             mechanisms: the model gets explained in section 2. Deliberately no swearing on the first
             screen; the edge is in the claim, and the language earns its bite further down. */}
      <section
        className="px-5 md:px-8"
        style={{
          background: "var(--pink)",
          borderBottom: "var(--border)",
          paddingTop: 72,
          paddingBottom: 72,
          // She is allowed to break the bottom edge, so nothing here may clip.
          overflow: "visible",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Two columns on desktop: the copy carries the argument, the collage carries the feeling
            and fills what was a large dead pink area to the right. Stacks on mobile with the image
            underneath, so the words always land first. */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[0.82fr_1.18fr] gap-6 md:gap-8 items-end">
          <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", marginBottom: 22 }}>
            🪐 the my szn mastermind · 90 days
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(40px, 6vw, 78px)", color: "var(--dark)", lineHeight: 0.98 }}
          >
            you didn&apos;t come here
            <br />
            <span style={{ color: "#fff" }}>to play small.</span>
          </h1>
          <p
            style={{
              // One line only. The hero sells the want; the mechanism (chart, seasons, the work,
              // the rooms) is explained properly in the very next section, so repeating any of it
              // here just crowds the banner and unbalances it against the image.
              fontSize: "clamp(17px, 2.2vw, 22px)",
              lineHeight: 1.6,
              color: "var(--dark)",
              maxWidth: 460,
              marginTop: 24,
              fontWeight: 600,
            }}
          >
            For women who want to make BIGGER moves, more $$$ and create their absolute BEST life, with private coaching from Betty every month.
          </p>
          <p style={{ fontFamily: poppins, fontSize: "clamp(17px, 2vw, 21px)", fontWeight: 800, color: "#fff", maxWidth: 520, marginTop: 14, lineHeight: 1.35 }}>
            The astrology-backed manifestation mastermind for ambitious women.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={doorCta.href}
              className="no-underline"
              style={{
                background: "var(--dark)",
                color: "#fff",
                fontFamily: poppins,
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "24px 52px",
                display: "inline-block",
              }}
            >
              {doorCta.label}
            </Link>
            <span style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, color: "var(--dark)", maxWidth: 260, lineHeight: 1.4 }}>
              {OFFERS.mastermind.price}, waitlist only for now
            </span>
          </div>
          </div>

          {/* Background removed, and deliberately oversized with a negative bottom margin so she
              crosses the banner's bottom rule and stands out of it. The hero's own bottom padding
              gives her the room; on mobile the overhang is dropped so she cannot collide with the
              section underneath. */}
          <div style={{ position: "relative", alignSelf: "end" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-cutout"
              src="/hero-cutout.png"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <Ticker
        variant="lav"
        items={[
          "it's lock-in season",
          "become her before 2027",
          "a private 1:1 with betty every month",
          "group coaching every season",
          "waitlist open now",
        ]}
      />

      {/* ─── 1b. LOCK-IN SEASON ─── the chapter on sale: why now, the three stages, the doors. */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 76 }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-6">it&apos;s lock-in season</div>
          <h2 className="display" style={{ fontSize: "clamp(34px, 6vw, 72px)", color: "var(--dark)", lineHeight: 1 }}>
            don&apos;t wait until <span className="pk">january.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.75, color: "var(--dark)", marginTop: 26, fontWeight: 600, maxWidth: 760 }}>
            We&apos;re not waking up on the 30th of December wondering why life looks exactly the same, then cramming every change we&apos;ve ever wanted into January. We&apos;re doing it NOW.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--dark)", marginTop: 14, maxWidth: 760 }}>
            The MY SZN Mastermind is a three-month cohort with a private 1:1 with Betty every month and group coaching every season. We lock in together for three zodiac seasons, love ourselves enough to want more, heal the shadow and claim our power, then go after our biggest dreams, so we walk into 2027 already moving.
          </p>
        </div>
      </section>

      <CoachingBand />

      <ThreeMonthsFromNow />

      <QuoteStrip ids={["zara", "georgia", "hannah"]} />

      <ValueStack />

      <WhoThisIsFor />

      <MeetBetty />

      <Manifesto />

      <QuoteStrip ids={["jade", "lauren", "maya"]} label="what bigger moves look like in here" tone="lav" />

      <HomeFaq />

      {/* ─── 10. FINAL CTA ─── job: the waitlist. Nothing new, one form. */}
      <section
        id="waitlist"
        className="px-5 md:px-8 bg-glitter"
        style={{ paddingTop: 88, paddingBottom: 96, position: "relative", overflow: "hidden" }}
      >
        {/* Decorative planet, right-hand side. Sits behind the copy and runs off the edge so the
            close carries the same treatment as the hero. Hidden on small screens, where there is no
            spare width and it would sit under the text. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="close-money" src="/cosmic-money.png" alt="" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="close-planet" src="/cosmic-planet.png" alt="" aria-hidden="true" />
        <div className="max-w-4xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>
          <h2 className="display" style={{ fontSize: "clamp(38px, 7vw, 88px)", color: "#fff", lineHeight: 0.98 }}>
            come inside
            <br />
            <span className="pk">my szn.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.8)", maxWidth: 620, margin: "26px auto 0", fontWeight: 500 }}>
            Ninety days of private coaching with Betty, your chart + Human Design on the table, the
            group masterminds, your cohort holding you to it and the deeper work that actually moves
            things, so you see what happens when you stop waiting and start creating your dream life
            with us.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#fff", margin: "18px auto 0", fontWeight: 700 }}>
            {OFFERS.mastermind.price}. Waitlist only for now, and the next cohort&apos;s dates go to the waitlist first.
          </p>
          <div className="mt-10 flex justify-center text-left">
            <WaitlistForm offer="mastermind" question="What do you want to have created by the end of your 90 days?" tone="dark" />
          </div>
        </div>
      </section>

      {/* Sticky mobile bar: the door is always one tap away. */}
      <div className="md:hidden" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "var(--pink)", padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))", boxShadow: "0 -2px 12px rgba(0,0,0,0.15)" }}>
        <Link href={doorCta.href} className="no-underline" style={{ display: "block", textAlign: "center", fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff" }}>
          join the mastermind waitlist →
        </Link>
      </div>
    </>
  );
}
