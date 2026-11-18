"use client";

import Link from "next/link";
import { useDoorCta } from "@/lib/use-door-cta";
import WaitlistForm from "@/components/WaitlistForm";
import Manifesto from "@/components/Manifesto";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import MeetBetty from "@/components/MeetBetty";
import HomeFaq from "@/components/HomeFaq";
import QuoteStrip from "@/components/QuoteStrip";
import type { ApplicationQuestion } from "@/components/WaitlistForm";
import { MASTERMIND, MASTERMIND_APPLY_BY, MASTERMIND_ENDS, MASTERMIND_PLAN, MASTERMIND_PRICE } from "@/lib/mastermind";
import { britishDate } from "@/lib/format-date";
import { CovenOrMastermind, MastermindCoaching, MastermindStack, SkyStages } from "./sections";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// ─────────────────────────────────────────────────────────────────────────────────────────────
// The Bad B*tch Mastermind (renamed from The MY SZN Mastermind, 18 Nov 2026): the 90-day transformation experience. Rebuilt 18 Nov 2026 so it stands
// apart from the $44 Coven: $3,333 (or 3 x $1,111), only 8 spots, the January cohort starts Monday
// 11 January 2027, and it's the one place Betty coaches you one to one (a 1:1 audit, two private
// sessions, Telegram access, hot seats every two weeks). The facts live in lib/mastermind.ts.
// It's an application: every button lands on #waitlist, where the form asks Betty's questions.
// Metadata lives in layout.tsx because this page is a client component.
// ─────────────────────────────────────────────────────────────────────────────────────────────

// The application, saved as Q + A text with the signup (same as the retreat).
const APPLICATION: ApplicationQuestion[] = [
  { label: "What's going on in your life right now, and why does the Mastermind feel like a YES?", type: "textarea", required: true },
  { label: `What do you want to have created across your life by ${MASTERMIND_ENDS}? Money, love, body, career, allll of it`, type: "textarea", required: true },
  { label: "Who are you choosing to be in 2027?", type: "textarea", required: true },
  { label: "How would you like to pay?", type: "select", options: [`In full (${MASTERMIND_PRICE})`, MASTERMIND_PLAN, "Not sure yet"], required: true },
  { label: "How familiar are you with astrology, Human Design and shadow work?", type: "select", options: ["Total beginner, teach me everything", "I know a little", "I'm deep in it"], required: true },
  { label: "Your Instagram handle", type: "text" },
];

// Betty's approved traits, with the old "tired of waiting until January" line rewritten now that the
// cohort starts in January.
const TRAITS = [
  "You know you want MORE (more money, more love, more freedom, more visibility) and you're done pretending you don't.",
  "You want 2027 to be the year you finally DO it, starting on the 11th of January with a small group of women who'll hold you to it.",
  "You've read the books, saved the posts and listened to the podcasts, and you're ready to actually DO the thing.",
  "You love astrology and you want it to change your real life, way beyond knowing your Big 3.",
  "You're ready to go into the shadow: the people-pleasing, the money wounds and the fear of being too much.",
  "You want a room of women who celebrate your wins and cheer you on louder than anyone.",
  "You want Betty in your corner privately, plus the magic and the fun: rituals, manifestation and a whole lot of pink.",
];

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
            🪐 the bad b*tch mastermind · 90 days
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
              {MASTERMIND_PRICE} · only {MASTERMIND.spots} spots · starts the {britishDate(MASTERMIND.startsIso)}
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
          `starts the ${britishDate(MASTERMIND.startsIso).toLowerCase()}`,
          `only ${MASTERMIND.spots} spots`,
          "your 1:1 audit with betty",
          "two private sessions",
          "telegram access to betty",
          "group coaching every two weeks",
          "the coven is included",
          "applications open now",
        ]}
      />

      <SkyStages />

      <MastermindCoaching />

      <QuoteStrip ids={["zara", "georgia", "hannah"]} />

      <CovenOrMastermind />

      <MastermindStack />

      <WhoThisIsFor traits={TRAITS} />

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
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#fff", maxWidth: 620, margin: "26px auto 0", fontWeight: 500 }}>
            Ninety days of private coaching with Betty, your chart + Human Design on the table, the
            group masterminds, your cohort holding you to it and the deeper work that actually moves
            things, so you see what happens when you stop waiting and start creating your dream life
            with us.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#fff", margin: "18px auto 0", fontWeight: 700 }}>
            {MASTERMIND_PRICE}, or {MASTERMIND_PLAN}. Only {MASTERMIND.spots} spots, and applications close on {MASTERMIND_APPLY_BY}.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#fff", margin: "12px auto 0", fontWeight: 500, maxWidth: 620 }}>
            I read every single application myself, then we have a little chat to make sure it&apos;s a big fat YES for both of us. 💜
          </p>
          <div className="mt-10 flex justify-center text-left">
            <WaitlistForm offer="mastermind" questions={APPLICATION} submitLabel="send my application" tone="dark" />
          </div>
        </div>
      </section>

      {/* Sticky mobile bar: the door is always one tap away. */}
      <div className="md:hidden" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "var(--pink)", padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))", boxShadow: "0 -2px 12px rgba(0,0,0,0.15)" }}>
        <Link href={doorCta.href} className="no-underline" style={{ display: "block", textAlign: "center", fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff" }}>
          apply for a spot →
        </Link>
      </div>
    </>
  );
}
