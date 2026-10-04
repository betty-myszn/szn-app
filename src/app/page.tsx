"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { useDoorCta } from "@/lib/use-door-cta";
import Manifesto from "@/components/Manifesto";
import DoorButton from "@/components/DoorButton";
import ThreeMonthsFromNow from "@/components/ThreeMonthsFromNow";
import ValueStack from "@/components/ValueStack";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import MeetBetty from "@/components/MeetBetty";
import HomeFaq from "@/components/HomeFaq";
import CoachingBand from "@/components/CoachingBand";
import QuoteStrip from "@/components/QuoteStrip";
import { CHAPTERS, sznTheme } from "@/lib/doors";
import { upcomingWorkshops, pastWorkshops, formatWorkshopWhenLA } from "@/lib/workshops";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// ─────────────────────────────────────────────────────────────────────────────────────────────
// The homepage. MY SZN is personal development for women: the astrological seasons give it
// structure, her own chart makes it personal, the deeper work is the mechanism and the community is
// why she comes back. Astrology is the framework, not the product.
//
// Ten sections, each with ONE job. Every idea gets ONE proper sell; later references stay short and
// exist only for comprehension. Before adding anything, check it is not already said above:
//
//   personalisation  sold in 5, shown in 3, never re-argued
//   community        SHOWN in 3, SOLD in 7, one line in 9
//   the seasons      explained in 2, used live in 6
//   the deeper work  explained in 4, never re-listed
//   money            argued once, in 5
//   the trial        hero and 10 only
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

// The three parts of the product, stated once. "Your people" describes the ROOMS' function only;
// the emotional sell for community lives in section 7 and must not be duplicated here.
const HOW_IT_WORKS = [
  {
    label: "your blueprint",
    title: "your chart + the szn we're in",
    body: "Your birth chart + Human Design show us how YOU are wired, what you want, where you thrive, what keeps tripping you up, and what you need to create your version of an incredible life. Every szn, we take that blueprint into a different area of your life.",
  },
  {
    label: "your moves",
    title: "because knowing yourself is only the beginning",
    body: "Every szn gives you the shadow work, journalling, goals, manifestation, tapping + live coaching to actually DO something with what you know. We work through what's holding you back, decide what you want next, and start making the moves that get you there.",
  },
  {
    label: "your people",
    title: "because everything's better with your girls",
    body: "You've got a community of ambitious women creating bigger lives alongside you, talking through what's coming up, sharing the wins, asking for help and actually getting it. The community rooms are free for good, with MY SZN membership giving you all the personalised seasonal work we do together.",
  },
];

// Confirmation, not another pitch. Eight lines, because by this point she understands the product.
const INCLUDED = [
  "Your birth chart and Human Design",
  "Personalised seasonal guidance",
  "A private 1:1 with Betty every month",
  "A live group mastermind every SZN",
  "A SZN hypnosis + audio guides",
  "Shadow work, Astro Tapping and journalling",
  "The community, starting with your intake",
  "The full replay vault",
];

export default function Home() {
  const router = useRouter();
  const { member, ready } = useMember();
  const season = useSeason();
  // The front-door button follows the doors: join while one is open, the waitlist while shut.
  const doorCta = useDoorCta();
  const janCta = useDoorCta(1);

  useEffect(() => {
    if (ready && member) router.replace("/dashboard");
  }, [ready, member, router]);

  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);
  // The season's workshops: what is still to come, plus the most recent one that has already run,
  // because its replay is inside the membership the moment she joins. Without the replay the section
  // emptied out as soon as a class passed, which made a live season look like nothing was happening.
  const seasonWorkshops =
    now === null
      ? []
      : [
          ...upcomingWorkshops(now).slice(0, 2).map((w) => ({ w, replay: false })),
          ...pastWorkshops(now).slice(0, 1).map((w) => ({ w, replay: true })),
        ].slice(0, 3);

  if (ready && member) return null;

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
            lock-in season · become her before 2027
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
            {doorCta.line && (
              <span style={{ fontFamily: poppins, fontSize: 15, fontWeight: 800, color: "var(--dark)", maxWidth: 260, lineHeight: 1.4 }}>
                {doorCta.line}
              </span>
            )}
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
          "applications open now",
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
            MY SZN is a three-month cohort with a private 1:1 with Betty every month and group coaching every season, and this one is {CHAPTERS[0].title}. We lock in together for three zodiac seasons, love ourselves enough to want more, heal the shadow and claim our power, then go after our biggest dreams, so we walk into 2027 already moving.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 30 }}>
            {CHAPTERS[0].szns.map((sign, i) => {
              const t = sznTheme(sign);
              return (
                <div key={sign} style={{ border: "var(--border)", borderRadius: 18, background: "var(--pink-light)", padding: "20px 20px 22px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>
                    {`month ${i + 1} · ${sign} szn · ${t.dates ?? ""}`}
                  </div>
                  <div style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.15, color: "var(--dark)", marginBottom: 8 }}>
                    {t.emoji} {t.name}
                  </div>
                  <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: "var(--dark)", marginBottom: 8 }}>{t.coreIdea}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--dark)" }}>{t.arcQuestion}</div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 32 }}>
            <Link
              href={janCta.href}
              className="no-underline"
              style={{ background: "var(--pink)", color: "#fff", fontFamily: poppins, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 44px", display: "inline-block" }}
            >
              {janCta.label}
            </Link>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)" }}>{janCta.line}</span>
          </div>
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

      {/* ─── 10. FINAL CTA ─── job: the offer. Nothing new, one button. */}
      <section
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
            The moment you join, the WHOLE MY SZN experience is yours. Explore your personalised
            portal, use your journal, watch the workshops, join the rooms, dive into your chart +
            Human Design, and see what happens when you actually start creating your dream life with
            us.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#fff", margin: "18px auto 0", fontWeight: 700 }}>
            Founding price: $555 a month for three months, worth $1,111 a month, and it&apos;s going up after the founding cohort.
          </p>
          <div className="mt-10">
            <Link
              href={doorCta.href}
              className="no-underline"
              style={{
                background: "var(--pink)",
                color: "#fff",
                fontFamily: poppins,
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "24px 56px",
                display: "inline-block",
              }}
            >
              {doorCta.label}
            </Link>
            {doorCta.line && (
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 18 }}>{doorCta.line}</p>
            )}
          </div>
        </div>
      </section>

      {/* Sticky mobile bar: the door is always one tap away. */}
      <div className="md:hidden" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "var(--pink)", padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))", boxShadow: "0 -2px 12px rgba(0,0,0,0.15)" }}>
        <Link href={doorCta.href} className="no-underline" style={{ display: "block", textAlign: "center", fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff" }}>
          {doorCta.label} →
        </Link>
      </div>
    </>
  );
}
