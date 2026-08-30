"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { FREE_TRIAL_CTA } from "@/lib/cta";
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
    label: "your framework",
    title: "your chart, and the season we're in",
    body: "Your birth chart and Human Design show how you are actually wired: where you are strong, where you stall, and what you need that the woman next to you does not. The season decides where we point it.",
  },
  {
    label: "your work",
    title: "we don't stop at knowing yourself",
    body: "Every season comes with shadow work, journalling, goals, manifestation, tapping and live coaching with me, pointed straight at whatever is actually in your way. Understanding your chart is where this starts, not where it stops.",
  },
  {
    label: "your people",
    title: "you are not doing it on your own",
    body: "The rooms run alongside all of it, so whatever you are working on this season gets talked about with women deep in exactly the same thing. The rooms are free for good, and membership adds the seasonal programming that runs inside them.",
  },
];

// Confirmation, not another pitch. Eight lines, because by this point she understands the product.
const INCLUDED = [
  "Your birth chart and Human Design",
  "Personalised seasonal guidance",
  "Shadow work, journalling and goals",
  "A live masterclass every month",
  "A live astro tapping every month",
  "The seasonal programming in the rooms",
  "The full replay vault",
  "Seasonal and eclipse guides",
];

export default function Home() {
  const router = useRouter();
  const { member, ready } = useMember();
  const season = useSeason();

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
            your life · your money · your moves
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
            For women who want more of themselves, more money, and more of the life they actually
            want.
          </p>

          <div className="mt-9 flex flex-col items-start gap-4">
            <Link
              href={FREE_TRIAL_CTA.href}
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
              start your free trial
            </Link>
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
          "personalised to your chart",
          "a live masterclass every month",
          "live astro tapping with betty",
          "the community rooms",
          "no card to start",
        ]}
      />

      {/* ─── 2. WHAT IT IS ─── job: make the model obvious. The season examples do the explaining, so
             the copy around them stays plain. Betty appears here, in the first third, because the
             coaching and the perspective are part of what people are joining. */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--cream)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 76 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-6">what my szn actually is</div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 62px)", color: "var(--dark)", maxWidth: 880 }}>
            every szn, we create your dream life in <span className="pk">a different area.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-11" style={{ border: "var(--border)" }}>
            {[
              { szn: "virgo szn", body: "your habits, your standards, your routines, and the goals that turn the life in your head into the life you're actually living." },
              { szn: "libra szn", body: "your relationships, your boundaries, your confidence, and creating a life filled with the kind of love and connection you actually want." },
              { szn: "scorpio szn", body: "your money, your power, your deepest desires, and the patterns that need to change when you're ready for MORE." },
            ].map((s, i) => (
              <div key={s.szn} className="p-7" style={{ borderRight: i < 2 ? "var(--border)" : undefined, background: i === 1 ? "var(--pink-bg)" : "#fff" }}>
                <div style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 8, textTransform: "lowercase" }}>
                  {s.szn}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--grey)" }}>{s.body}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--grey)", fontWeight: 500, maxWidth: 720, marginTop: 30 }}>
            Your birth chart and Human Design make every szn completely personal to YOU, so
            you&apos;re working on what actually matters for your life. Every four weeks, we focus on a
            different area, make moves, raise your standards, and keep building your dream life one
            szn at a time.
          </p>

          {/* Betty, given real estate rather than a thumbnail. Same treatment as her founder block on
              the membership page: a half-width image panel with the copy beside it, so the human
              behind the framework lands properly and inside the first third of the page. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-14" style={{ border: "var(--border)", background: "#fff" }}>
            <div style={{ position: "relative", overflow: "hidden", minHeight: 460 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/betty-founder.png"
                alt="Betty Andrews, founder of MY SZN"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                Betty Andrews / Founder
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="tag mb-5">who&apos;s running this</div>
              <h3
                className="display"
                style={{ fontSize: "clamp(26px, 3.4vw, 42px)", color: "var(--dark)", marginBottom: 18 }}
              >
                hey, i&apos;m <span className="pk">betty.</span>
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--grey)", marginBottom: 14 }}>
                I teach the masterclass, I run the astro tapping, I write the seasonal work, and
                I&apos;m in the rooms with you most days. When you ask a question in here, you&apos;re
                asking me.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--grey)" }}>
                I built MY SZN because I watched women become completely unstoppable for one season a
                year and then shrink back and wait until they felt ready again. This is my framework
                for making that a way of living instead of an annual event, and it is not an app with
                my name slapped on it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. SHOW THE PRODUCT ─── job: prove a real personalised product exists. Nothing here
             impersonates a member: no invented usernames, quotes or results. The room card shows the
             ROOM LIST, which is real product furniture, rather than fake conversation. Swap the whole
             row for real portal captures when they exist. */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 76 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-6" style={{ color: "var(--pink)" }}>inside your portal</div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 62px)", color: "#fff", maxWidth: 880 }}>
            this is what opens the second you&apos;re in.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
            {/* seasonal guidance: astrology turned into something to DO */}
            <div style={{ background: "#fff", border: "var(--border)", padding: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>
                your {season.sign.toLowerCase()} szn
              </div>
              <div style={{ fontFamily: poppins, fontSize: 21, fontWeight: 800, letterSpacing: "-0.5px", margin: "8px 0 10px", textTransform: "lowercase" }}>
                seasonal guidance
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--grey)" }}>{season.focus}</p>
              <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--pink-bg)", border: "1.5px solid var(--dark)", fontSize: 12.5, lineHeight: 1.65 }}>
                <strong style={{ fontFamily: poppins, textTransform: "lowercase" }}>your money szn ✦</strong>
                <br />
                Jupiter is moving through your 2nd house. This is where you think bigger about
                earning, and get honest about what you are actually willing to ask for.
              </div>
            </div>

            {/* her chart */}
            <div style={{ background: "#fff", border: "var(--border)", padding: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>
                calculated for you
              </div>
              <div style={{ fontFamily: poppins, fontSize: 21, fontWeight: 800, letterSpacing: "-0.5px", margin: "8px 0 10px", textTransform: "lowercase" }}>
                your birth chart
              </div>
              <div style={{ display: "grid", placeItems: "center", padding: "6px 0 10px" }}>
                <svg width="128" height="128" viewBox="0 0 150 150" aria-hidden="true">
                  <circle cx="75" cy="75" r="70" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
                  <circle cx="75" cy="75" r="50" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
                  <circle cx="75" cy="75" r="16" fill="var(--pink-bg)" stroke="#1a1a1a" strokeWidth="1.5" />
                  <g stroke="#1a1a1a" strokeWidth="1">
                    <line x1="5" y1="75" x2="145" y2="75" />
                    <line x1="75" y1="5" x2="75" y2="145" />
                    <line x1="25" y1="25" x2="125" y2="125" />
                    <line x1="125" y1="25" x2="25" y2="125" />
                  </g>
                  <g fill="var(--pink)">
                    <circle cx="118" cy="52" r="4" />
                    <circle cx="58" cy="12" r="4" />
                    <circle cx="30" cy="104" r="4" />
                    <circle cx="112" cy="110" r="4" />
                  </g>
                </svg>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--grey)" }}>
                Every placement, house and aspect, plus your Human Design, in plain English with no
                gatekeeping.
              </p>
            </div>

            {/* the rooms: the real room list, not invented conversation */}
            <div style={{ background: "#fff", border: "var(--border)", padding: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>
                open all day
              </div>
              <div style={{ fontFamily: poppins, fontSize: 21, fontWeight: 800, letterSpacing: "-0.5px", margin: "8px 0 12px", textTransform: "lowercase" }}>
                the community rooms
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {["general", "money + business", "manifestation", "astrology", "ask betty"].map((r) => (
                  <li
                    key={r}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--dark)",
                      border: "1.5px solid var(--dark)",
                      padding: "9px 12px",
                      background: "var(--lav-light)",
                    }}
                  >
                    # {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS ─── job: explain the system once, in three parts. */}
      <section
        className="px-5 md:px-8"
        style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 76 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-6">how it works</div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 62px)", color: "var(--dark)", maxWidth: 880 }}>
            three things, and it doesn&apos;t work without all three.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12" style={{ border: "var(--border)" }}>
            {HOW_IT_WORKS.map((c, i) => (
              <div
                key={c.label}
                className="p-8"
                style={{
                  borderRight: i < HOW_IT_WORKS.length - 1 ? "var(--border)" : undefined,
                  background: i === 2 ? "var(--lav-light)" : "#fff",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
                  {c.label}
                </div>
                <div style={{ fontFamily: poppins, fontSize: 21, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 12, textTransform: "lowercase" }}>
                  {c.title}
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--grey)" }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ASTROLOGY-BASED JOURNALING ─── a banner, not a section: it gives one concrete example of
             what "the work" actually looks like day to day, immediately after the three pillars
             introduce it. Kept to a single claim so it does not become another feature essay. */}
      <section
        className="px-5 md:px-8"
        style={{
          background: "var(--pink-bg)",
          borderBottom: "var(--border)",
          paddingTop: 88,
          paddingBottom: 88,
          // The journal is allowed to fill the band edge to edge; the copy keeps its padding.
          overflow: "hidden",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-14 items-center">
          <div>
            <div className="tag mb-4">the work, daily</div>
            <h2
              className="display"
              style={{ fontSize: "clamp(32px, 5vw, 60px)", color: "var(--dark)", marginBottom: 18 }}
            >
              astrology based <span className="pk">journaling.</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--grey)", maxWidth: 560, marginBottom: 20 }}>
              This is basically your DREAM journal. We use your birth chart and the season
              you&apos;re in to create journal prompts personalised to YOU, helping you deep dive into
              every area of your life, figure out what you actually want, work through what&apos;s
              getting in the way, and create a life you&apos;re obsessed with.
            </p>
            <Link
              href={FREE_TRIAL_CTA.href}
              className="no-underline"
              style={{ fontSize: 13, fontWeight: 700, color: "var(--pink)", textDecoration: "underline" }}
            >
              try it free for 7 days
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="journal-art"
            src="/astrology-journaling.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ─── 5. WHY IT'S PERSONAL ─── job: ONE argument, that nobody here defines her life for her.
             Halved from the previous draft: the generic-advice list and the six hypothetical women
             were making the same point four times over. Two contrasting examples is enough. The
             money argument lives here and nowhere else. */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--cream)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 76 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-6">why it&apos;s personal</div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 62px)", color: "var(--dark)", maxWidth: 940 }}>
            nobody here gets to decide what your life should look like. <span className="pk">that&apos;s yours.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-10">
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--grey)", fontWeight: 500 }}>
              Most personal development hands every woman the same formula and calls it a plan. One
              woman in here is building a company with staff. Another wants a four-day week and her
              afternoons back. Those two need completely different work, and your chart is how we tell
              the difference, so every season lands on your actual life instead of a template.
            </p>
            <div className="p-8" style={{ background: "var(--dark)", alignSelf: "start" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 14 }}>
                and about the money
              </div>
              <p style={{ fontFamily: poppins, fontSize: "clamp(21px, 2.6vw, 30px)", fontWeight: 800, lineHeight: 1.3, color: "#fff", letterSpacing: "-0.5px", marginBottom: 16 }}>
                Money is what gives you options.
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "rgba(255,255,255,0.78)" }}>
                It is what lets you walk away from the job, the contract or the relationship you have
                outgrown, and it is what lets you start: the business, the first hire, the flight, the
                year you work less and see your people more. We talk about women making more money
                here, in actual dollars, because that is the difference between wishing and choosing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. THIS SZN ─── job: why now. Reads the live season and the real workshop schedule, so
             it turns over by itself instead of going stale. */}
      <section
        className="px-5 md:px-8"
        style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 76 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-6" style={{ color: "#3C2A70" }}>what&apos;s happening right now</div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 62px)", color: "#3C2A70", maxWidth: 940 }}>
            it&apos;s {season.sign.toLowerCase()} szn. {season.tagline.toLowerCase()}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: "#3C2A70", maxWidth: 620, marginTop: 22, fontWeight: 500 }}>
            {season.description}
          </p>

          {seasonWorkshops.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
              {seasonWorkshops.map(({ w, replay }) => (
                <div key={w.id} style={{ background: "#fff", border: "var(--border)", overflow: "hidden" }}>
                  {w.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.coverImage} alt="" aria-hidden="true" style={{ width: "100%", height: "auto", display: "block", borderBottom: "var(--border)" }} />
                  )}
                  <div style={{ padding: 22 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 8 }}>
                      {replay ? "replay available now" : w.startIso ? formatWorkshopWhenLA(w.startIso) : w.meta}
                    </div>
                    <div style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.2 }}>
                      {w.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 7. THE ROOMS ─── job: the EMOTIONAL sell for community. This is the one place community
             is argued; section 3 showed it and section 9 gets a single line. No invented members. */}
      <section
        className="px-5 md:px-8"
        style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 76 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-6">the rooms</div>
          <h2 className="display" style={{ fontSize: "clamp(30px, 5vw, 62px)", color: "var(--dark)", maxWidth: 940 }}>
            basically the astro girls support group <span className="pk">for the baddies.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-10">
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--grey)", fontWeight: 500 }}>
              This is where you bring the shit you are actually working through. What to charge. The
              business decision you have been sitting on for a fortnight. Whether to send the message.
              The thing that came up in the shadow work at 2am and would sound completely unhinged to
              anyone who is not in here.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--grey)", fontWeight: 500 }}>
              Everyone is in the same season at the same time, so nobody needs the backstory. These
              are women who know exactly what a Scorpio szn money block feels like, and who will tell
              you straight when you are talking yourself out of something good.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--grey)", fontWeight: 500 }}>
              The rooms are free, permanently, whether you ever pay us a penny or not. Membership adds
              the seasonal programming that runs inside them: the book club, the challenges and the
              workshop chat.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 8. PROOF ─── job: evidence. One real member quote, because one is what exists. Adding
             invented stories here would be worse than the gap. When real ones arrive (money made,
             prices raised, careers changed) this becomes a grid and gets far stronger. */}
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="tag mb-8" style={{ color: "#fff" }}>from a member</div>
          <p className="display" style={{ fontSize: "clamp(26px, 4.4vw, 50px)", color: "#fff", lineHeight: 1.18, textTransform: "none" }}>
            &ldquo;I finally stopped wondering what my birth chart meant and actually started living
            it.&rdquo;
          </p>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginTop: 24 }}>
            a my szn member
          </div>
        </div>
      </section>

      {/* ─── 9. WHAT'S INCLUDED ─── job: confirmation, not a pitch. Eight lines, no descriptions:
             everything here has already been explained or shown above. */}
      <section
        className="px-5 md:px-8"
        style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6">what&apos;s included</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4.4vw, 54px)", color: "var(--dark)", maxWidth: 820 }}>
            everything, from day one.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0 mt-9">
            {INCLUDED.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "15px 0",
                  borderBottom: "1.5px solid rgba(26,26,26,0.12)",
                  fontSize: 15.5,
                  color: "var(--dark)",
                  fontWeight: 500,
                }}
              >
                <span style={{ color: "var(--pink)", fontWeight: 800 }}>✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. FINAL CTA ─── job: the offer. Nothing new, one button. */}
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", paddingTop: 88, paddingBottom: 96 }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="display" style={{ fontSize: "clamp(38px, 7vw, 88px)", color: "#fff", lineHeight: 0.98 }}>
            seven days.
            <br />
            <span className="pk">the whole thing.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.8)", maxWidth: 540, margin: "26px auto 0", fontWeight: 500 }}>
            Open your portal, come to a workshop, get in the rooms, do the work, and see whether you
            actually use it. No card, so nothing can charge you. It is $88 a month after that, and
            only if you want to stay.
          </p>
          <div className="mt-10">
            <Link
              href={FREE_TRIAL_CTA.href}
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
              start your free 7 days
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
