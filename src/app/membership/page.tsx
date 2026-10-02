"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import LaunchCountdown from "@/components/LaunchCountdown";
import CheckoutButton from "@/components/CheckoutButton";
import { PLAN_CHECKOUT_URL, VIP_CHECKOUT_URL } from "@/lib/checkout";
import { upcomingWorkshops, seasonOfNextWorkshop, shortWorkshopMeta } from "@/lib/workshops";
import { joinCta } from "@/lib/cta";
import { useMember } from "@/lib/use-member";
import { isTrial } from "@/lib/membership-access";
import { trialCountdown } from "@/lib/trial-countdown";
import { entryBandFor } from "@/lib/membership-entry-band";
import { useSeason } from "@/lib/use-season";
import HumanDesignExplainer from "@/components/HumanDesignExplainer";
import SoulBlueprint from "@/components/SoulBlueprint";
import WhatIsMySzn from "@/components/WhatIsMySzn";
import { useDoors } from "@/lib/enrolment";
import { CHAPTERS, currentChapter, doorDay, doorDays, doorTime, sznList, sznTheme } from "@/lib/doors";
import ChapterJoin, { DoorAlert } from "@/components/ChapterJoin";
import Manifesto from "@/components/Manifesto";

const pp = "var(--font-poppins), Poppins, sans-serif";

// Stripe payment links now live in @/lib/checkout (imported above) so the signup page and this page
// can never drift onto different URLs.

// The $33 "MY SZN Social" tier is RETIRED FROM SALE, which is why there's no social checkout URL
// and no social card below. Free now owns the chat rooms, so social had nothing uniquely its own,
// and its rituals (book club, moon audios, seasonal updates) moved up into MY SZN. It is retired,
// not deleted: 'social' still exists in stripe-tiers.ts and still passes hasAccessFromRow, so the
// members already paying $33 keep the rituals they're being charged for until they cancel or
// upgrade. Do not re-add a CTA here without first deciding what happens to those members.

// Shown when the route gate sent her here, so the pricing page explains why she landed on it
// instead of just silently appearing. Reads ?reason= set by the proxy / auth callback.
const REASON_COPY: Record<string, string> = {
  none: "You'll need an active membership to enter your portal. Choose your plan below to unlock it.",
  upgrade: "That's part of the full MY SZN platform. Your Social membership covers the community, upgrade to MY SZN below to unlock your personalised portal.",
  expired: "Your membership has ended. Renew below and you're straight back into your portal.",
  canceled: "Your membership was cancelled. Rejoin whenever you're ready, your chart and history are still here.",
  billing: "There's a problem with your last payment. Rejoin or update your card below to keep your access.",
};

function MembershipReasonBanner() {
  const reason = useSearchParams().get("reason");
  if (!reason) return null;
  const message = REASON_COPY[reason] ?? REASON_COPY.none;
  return (
    <div
      className="px-6 py-3 text-center"
      style={{ background: "var(--pink-light)", borderBottom: "1.5px solid var(--pink)", color: "#993556", fontSize: 13, fontWeight: 600 }}
    >
      {message}
    </div>
  );
}

export default function MembershipPage() {
  // Every launch-related CTA on this page, from one rule in @/lib/cta: the primary CTA scrolls to
  // the pricing cards, which hold the real Stripe checkout buttons. There is no free trial (retired
  // 1 Oct 2026) and no waitlist to fall back to when the doors are closed.
  // The doors (src/lib/doors.ts): open for a few days at the start of each season, closing at a
  // real sky moment. `door` is the one the page talks about: the open one, else the next one.
  const doors = useDoors();
  const enrolmentOpen = !!doors.open;
  const door = doors.open ?? doors.next;
  const { href: joinHref } = joinCta(enrolmentOpen, "#pricing");
  const joinLabel = enrolmentOpen ? "lock in now" : "tell me when doors open";

  // The upcoming-workshops block reads the same schedule as /events, so this sales page never
  // advertises a class that has already happened. Clock read on the client so the upcoming split
  // is stable across a render rather than running Date.now() during one.
  const season = useSeason();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const nextTwo = now === null ? [] : upcomingWorkshops(now).slice(0, 2);
  // Named after the season the classes belong to, which in the run-up to a new season is the one
  // ahead rather than the one the calendar is still in.
  const workshopSeason = now === null ? season.sign : seasonOfNextWorkshop(now, season.sign);
  // The chapter on sale. Before the clock is read this is the first chapter, so the static render
  // and the first client render agree.
  const chapter = currentChapter(now ?? 0) ?? CHAPTERS[0];
  const planLine = PLAN_CHECKOUT_URL ? "Founding member pricing: $250 for 3 months, or 3 monthly payments of $88" : "Founding member pricing: $250 for 3 months";

  // Who is reading this page: the entry band below the hero speaks to a woman still finishing a
  // trial she started before trials were retired, or to a free or lapsed account, and shows nothing
  // to a stranger or a paying member. The branching lives in @/lib/membership-entry-band, where
  // it's tested.
  const { member, ready } = useMember();
  const trial = now !== null && member && isTrial(member) ? trialCountdown(member.trialExpiresAt, now) : null;
  const entryBand = entryBandFor(member, now, ready);

  // A woman still on a trial goes straight to the plans. Everything else keeps the standing rule.
  const ctaHref = trial ? "#pricing" : joinHref;
  const ctaLabel = trial ? "become a member" : joinLabel;

  return (
    <div>
      <Suspense fallback={null}>
        <MembershipReasonBanner />
      </Suspense>
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="px-8 py-20 md:py-28 text-center"
        style={{ background: "var(--dark)", borderBottom: "var(--border)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-4">
            {!doors.ready
              ? "my szn"
              : doors.open
                ? `doors open now · close ${doorDay(doors.open.closesAt)}`
                : doors.next
                  ? `doors open ${doorDay(doors.next.opensAt)}`
                  : "doors open at the start of each season"}
          </div>

          <h1 style={{
            fontFamily: pp, fontSize: "clamp(42px, 7vw, 72px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 24,
          }}>
            Become her<br />before <span style={{ color: "var(--pink)" }}>2027.</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.8, color: "#fff",
            maxWidth: 520, margin: "0 auto 12px",
          }}>
            {chapter.campaign}<br />
            <span style={{ fontWeight: 500 }}>We&apos;re locking in for three months.</span>
          </p>
          <p style={{
            fontSize: 14, lineHeight: 1.8, color: "#fff",
            maxWidth: 560, margin: "0 auto 36px",
          }}>
            October, November and December are three zodiac seasons we are NOT writing off. Self-Love SZN, Bad B*tch SZN and Big Dream SZN take you from loving yourself enough to want more, through the shadow work that&apos;s been talking you out of it, all the way to going after your biggest life, with your own chart, your Human Design, live workshops, magic and a room full of women doing it with you, so you walk into 2027 already moving.
          </p>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10, textAlign: "center" }}>
              {enrolmentOpen ? "doors close in" : "doors open in"}
            </div>
            <LaunchCountdown variant="dark" />
          </div>

          {/* The primary CTA drops her into the pricing cards (real Stripe checkout). See @/lib/cta. */}
          <div className="flex flex-col items-center gap-4">
            <Link href={ctaHref} className="btn-pink no-underline" style={{ display: "inline-block", padding: "16px 44px" }}>
              {ctaLabel}
            </Link>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>
              {!doors.ready
                ? planLine
                : doors.open
                  ? `Doors close at ${doors.open.closesAtMoment}, ${doorTime(doors.open.closesAt)}. ${planLine}.`
                  : doors.next
                    ? `Doors open ${doorDay(doors.next.opensAt)}, ${doorTime(doors.next.opensAt)}, for ${doorDays(doors.next)} days only. ${planLine}.`
                    : `${planLine}.`}
            </p>
          </div>
        </div>
      </section>

      {/* Launch banner */}
      <section className="px-8 py-10 text-center" style={{ background: "var(--pink)", borderBottom: "var(--border)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
          {enrolmentOpen ? "the doors are open" : "save the date"}
        </div>
        <h2 style={{ fontFamily: pp, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 10 }}>
          {!doors.ready || !door
            ? "Doors open at the start of every season."
            : doors.open
              ? `${door.name.charAt(0).toUpperCase()}${door.name.slice(1)} is open.`
              : `Doors open ${doorDay(door.opensAt)}.`}
        </h2>
        <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 6px" }}>
          {door
            ? `The doors are only open for ${doorDays(door)} days. New members join together in a short intake at the start of a season, and ${door.name} locks in for ${sznList(door)}, three seasons that build on each other. The doors close at ${door.closesAtMoment}, ${doorDay(door.closesAt)} at ${doorTime(door.closesAt)}.`
            : "New members join together in a short intake at the start of a season and lock in for three seasons that build on each other."}
          {nextTwo[0] ? ` We start together with ${nextTwo[0].title}, ${shortWorkshopMeta(nextTwo[0], now ?? 0)}.` : ""}
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
          1:1 coaching with Betty is on VIP.
        </p>
        <div style={{ marginBottom: 20 }}>
          <LaunchCountdown variant="pink" />
        </div>
        <Link href={ctaHref} className="no-underline" style={{
          display: "inline-block", background: "#fff", color: "var(--pink)",
          fontFamily: pp, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "14px 32px",
        }}>
          {ctaLabel}
        </Link>
      </section>

      {/* ═══════════════ THE CHAPTER ═══════════════ */}
      {/* The chapter on sale: its three seasons as stages, then how the three months work. Copy for
          the stages comes from src/lib/szn-themes.ts (Betty's framework, SZN-THEMES-Q4-2026.md). */}
      <section className="px-6 md:px-8 py-20 md:py-28" style={{ background: "var(--lav-light)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5 text-center">the chapter</div>
          <h2 style={{ fontFamily: pp, fontSize: "clamp(30px, 5.5vw, 50px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.08, textAlign: "center", marginBottom: 14 }}>
            {chapter.title}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--dark)", textAlign: "center", maxWidth: 560, margin: "0 auto 44px", fontWeight: 600 }}>
            {chapter.arc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
            {chapter.szns.map((sign, i) => {
              const t = sznTheme(sign);
              const live = season.sign === sign;
              return (
                <div key={sign} className="p-6 md:p-7" style={{ background: "#fff", border: live ? "2px solid var(--pink)" : "var(--border)", borderRadius: 18 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>
                      stage {i + 1} · {sign}
                    </span>
                    {live && (
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", background: "var(--pink)", padding: "4px 8px", borderRadius: 999 }}>
                        we&apos;re here
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: pp, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.1, marginBottom: 8 }}>
                    {t.emoji} {t.name}
                  </div>
                  <p style={{ fontFamily: pp, fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>{t.coreIdea}</p>
                  <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--dark)", marginBottom: 14 }}>{t.about}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "#3C2A70", fontStyle: "italic", marginBottom: t.workshop ? 16 : 0 }}>{t.question}</p>
                  {t.workshop && (
                    <div style={{ borderTop: "var(--border)", paddingTop: 12 }}>
                      <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 4 }}>
                        the workshop
                      </div>
                      <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{t.workshop.title}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 max-w-4xl mx-auto">
            {[
              {
                h: "Your destination",
                b: "You start by finishing one sentence, \"By 2027, I'm becoming a woman who…\", and everything we do for the next three months points straight at her.",
              },
              {
                h: "Two live experiences every SZN",
                b: "The Transformation Workshop is where the deep work starts, with astrology, coaching, shadow work, Astro Tapping and real-world action, and the Community Circle is where we share wins, do the ritual and spellwork and actually feel the transformation together. Plus a SZN hypnosis to come back to all season long.",
              },
              {
                h: "Your chart is the lens",
                b: "We all live the same season together, and your astrology and Human Design show you exactly what it means for YOUR money, love, career, confidence and visibility.",
              },
              {
                h: "One room, all of us",
                b: "Your intake starts together and introduces themselves, then we celebrate each other's wins, money moves, boundaries, wobbles and Bad B*tch moments all the way through.",
              },
              {
                h: "Proof that you changed",
                b: "As we go you collect the evidence: what you stopped tolerating, the boundary you held, the money you made. At the end we look back at who you were when you started and who you are now.",
              },
              {
                h: "Then you keep going",
                b: "Every chapter flows into the next, so you can carry everything you've built into the next three seasons with the same women beside you.",
              },
            ].map((x) => (
              <div key={x.h}>
                <div style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 6 }}>
                  <span style={{ color: "var(--pink)" }}>&#10038;</span> {x.h}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--dark)", margin: 0 }}>{x.b}</p>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: pp, fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 800, textAlign: "center", letterSpacing: "-0.6px", marginTop: 52, marginBottom: 0 }}>
            2027: <span className="pk">we&apos;re not starting. We&apos;re continuing.</span>
          </p>
        </div>
      </section>

      <Manifesto />

      {/* The plain-english one-liner, then the blueprint story: high on the sales page so the whole
          thesis frames the pitch before the features. Both shared with the homepage via one component
          each. The blueprint CTA points down to pricing rather than back to this same page. */}
      <WhatIsMySzn />
      <SoulBlueprint ctaHref="#pricing" />

      {/* ═══════════════ WHY MY SZN ═══════════════ */}
      <section className="px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">the story</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800,
            letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            Why <span className="pk">MY SZN?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            <div className="p-8 md:p-12" style={{ borderRight: "var(--border)" }}>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: "var(--dark)", marginBottom: 24 }}>
                Every year Gemini szn rolls around and something wild happens. Gemini women become completely, unapologetically unstoppable.
              </p>
              <div className="space-y-2 mb-8">
                {[
                  "They're booking the flights.",
                  "Launching the business.",
                  "Wearing the outfit.",
                  "Taking up space like they own the building.",
                ].map((line) => (
                  <p key={line} style={{ fontSize: 15, color: "var(--dark)", paddingLeft: 16, borderLeft: "2px solid var(--lav)" }}>
                    {line}
                  </p>
                ))}
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--dark)", paddingLeft: 16, borderLeft: "2px solid var(--pink)" }}>
                  Living like the main character because they ARE the main character.
                </p>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)" }}>
                I watched this happen year after year. And it made me realise something I couldn&apos;t unsee.
              </p>
            </div>

            <div className="p-8 md:p-12" style={{ background: "var(--pink-light)" }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", marginBottom: 20 }}>
                We only give ourselves permission to feel that powerful once a year.
              </p>
              <div className="space-y-1 mb-8">
                {[
                  "We wait until Monday.",
                  "Until January.",
                  "Until our birthday.",
                  "Until we finally lose the weight.",
                  "Until we feel ready. Which never comes.",
                ].map((line) => (
                  <p key={line} style={{ fontSize: 14, color: "var(--dark)" }}>
                    {line}
                  </p>
                ))}
              </div>
              <p style={{
                fontFamily: pp, fontSize: 18, fontWeight: 800, color: "var(--dark)",
                lineHeight: 1.4,
              }}>
                Every season can be your season. That&apos;s the entire philosophy behind MY SZN.
              </p>
              <p style={{ fontSize: 14, color: "var(--dark)", marginTop: 12 }}>
                Not another astrology app. A membership that helps you actually <em>live</em> your astrology and become the woman your chart always knew you could be.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <div className="px-8 py-16 md:py-20 text-center" style={{ background: "var(--lav-light)", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <h2 style={{
          fontFamily: pp, fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800,
          lineHeight: 1.2, letterSpacing: "-1px", color: "#3C2A70",
          maxWidth: 600, margin: "0 auto",
        }}>
          &ldquo;This is my time. My era. My <span style={{ color: "var(--pink)" }}>season.</span>&rdquo;
        </h2>
      </div>

      {/* ═══════════════ BETTY'S STORY ═══════════════ */}
      <section className="px-8 py-20 md:py-28">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div style={{ position: "relative", overflow: "hidden", minHeight: 400 }}>
            <Image
              src="/betty-founder.png"
              alt="Betty Andrews, founder of MY SZN"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
            <div style={{
              position: "absolute", bottom: 20, left: 20,
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}>
              Betty Andrews / Founder
            </div>
          </div>
          <div className="p-8 md:p-12">
            <div className="tag mb-6">my story</div>
            <h2 style={{
              fontFamily: pp, fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800,
              letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 24,
            }}>
              The biggest project I&apos;ve ever worked on wasn&apos;t my business. It was <span className="pk">me.</span>
            </h2>
            <div style={{ fontSize: 14, lineHeight: 1.9, color: "var(--dark)" }}>
              <p style={{ marginBottom: 16 }}>
                I spent years rebuilding my self-worth from the ground up. Learning to love myself.
                Building confidence. Creating a business. Healing things I didn&apos;t even know were broken.
              </p>
              <div className="p-5 mb-5" style={{ background: "var(--pink-light)", borderLeft: "3px solid var(--pink)" }}>
                <p style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, color: "var(--dark)", lineHeight: 1.4, margin: 0 }}>
                  You can&apos;t hate yourself into a version of yourself that you love.
                </p>
              </div>
              <p style={{ marginBottom: 16 }}>
                The world profits from women believing they&apos;re never enough. Not pretty enough.
                Not thin enough. Not successful enough. Not healed enough. That narrative ends here.
              </p>
              <p style={{ marginBottom: 16 }}>
                MY SZN was born from wanting to create the membership I wished existed while rebuilding my own life. Becoming isn&apos;t about fixing yourself. It&apos;s about <strong>remembering</strong> yourself. The version of you that was always there before the world told you to be smaller.
              </p>
              <p style={{ fontStyle: "italic", color: "var(--dark)", fontWeight: 500 }}>
                This is the membership I wish I&apos;d had. So I built it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ASTROLOGY STOPS AT AWARENESS ═══════════════ */}
      <section className="px-8 py-20 md:py-28" style={{ background: "#fafafa", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">the gap</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            Astrology stops at <span className="pk">awareness.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { placement: "Your Venus", truth: "Doesn't suddenly make you confident in love.", bg: "var(--pink-light)" },
              { placement: "Your Jupiter", truth: "Doesn't magically change your bank account.", bg: "var(--lav-light)" },
              { placement: "Your Chiron", truth: "Doesn't heal your childhood.", bg: "var(--mint)" },
              { placement: "Your North Node", truth: "Doesn't hand you your purpose on a plate.", bg: "var(--cream)" },
            ].map((item) => (
              <div key={item.placement} className="p-6" style={{ background: item.bg, border: "var(--border)" }}>
                <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.3px" }}>
                  Knowing {item.placement}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>
                  {item.truth}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p style={{ fontSize: 16, color: "var(--dark)", marginBottom: 8 }}>
              Everyone knows their Sun sign. Millions of women can tell you their Big 3 faster than their blood type. They screenshot their Co-Star every morning. But then nothing changes.
            </p>
            <p style={{
              fontFamily: pp, fontSize: 22, fontWeight: 800, color: "var(--dark)",
              lineHeight: 1.3, marginTop: 24,
            }}>
              Awareness is cute.<br />
              <span className="pk">Embodiment</span> changes your life.
            </p>
            <p style={{ fontSize: 14, color: "var(--dark)", marginTop: 12 }}>
              MY SZN bridges that gap. This is where awareness finally becomes change.
            </p>
          </div>
        </div>
      </section>

      {/* Mid-page waitlist CTA */}
      <section className="px-8 py-12 text-center" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <p style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          {enrolmentOpen
            ? <>The doors are open. <span style={{ color: "var(--pink)" }}>We&apos;re locking in.</span></>
            : <>{door ? `Doors open ${doorDay(door.opensAt)}.` : "Doors open every season."} <span style={{ color: "var(--pink)" }}>We&apos;re locking in.</span></>}
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
          {planLine}. 1:1 coaching with Betty is on VIP, $555/mo.
        </p>
        <Link href={ctaHref} className="btn-pink no-underline" style={{ padding: "14px 32px" }}>
          {ctaLabel}
        </Link>
      </section>

      {/* Human Design, explained, immediately after the gap section. She has just been told why
          generic advice keeps failing her, and this is the answer to it, so it earns the place.
          CTAs off: she is already on the page they would send her to. Shared component so this
          and the homepage can't drift into two different explanations. */}
      <HumanDesignExplainer showCtas={false} headingSize="clamp(34px, 6vw, 72px)" />

      {/* ═══════════════ A PLATFORM THAT GROWS WITH YOU ═══════════════ */}
      <section className="px-8 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">the membership</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 5.5vw, 48px)", fontWeight: 800,
            letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            A membership that grows with <span className="pk">you.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-12" style={{ border: "var(--border)" }}>
            <div className="p-8 md:p-10" style={{ borderRight: "var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark)", marginBottom: 16 }}>
                the problem with personal development
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", marginBottom: 16 }}>
                One person tells you to wake up at 5am. Another says sleep in. One coach says hustle. Another says surrender. One says launch now. Another says wait.
              </p>
              <p style={{ fontSize: 14, color: "var(--dark)" }}>
                They&apos;re probably all right. For somebody. But that somebody might not be you. And definitely not right now.
              </p>
            </div>
            <div className="p-8 md:p-10" style={{ background: "var(--pink-light)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 16 }}>
                the my szn approach
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--dark)", marginBottom: 16 }}>
                Your growth shouldn&apos;t look like mine, your best friend&apos;s, or the woman you&apos;re following on Instagram. It should look like <strong>yours</strong>. Personalised to your chart. Aligned to your energy. Built for YOUR glow-up.
              </p>
              <p style={{ fontSize: 14, color: "var(--dark)" }}>
                That&apos;s exactly why I&apos;ve spent years building MY SZN.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center mb-12" style={{ background: "var(--dark)" }}>
            <p style={{
              fontFamily: pp, fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#fff",
              lineHeight: 1.3, margin: 0,
            }}>
              MY SZN doesn&apos;t just tell you who you are.<br />
              It evolves with who you&apos;re <span style={{ color: "var(--pink)" }}>becoming.</span>
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <p style={{ fontSize: 16, lineHeight: 1.9, color: "var(--dark)", marginBottom: 20 }}>
              When you join MY SZN, your entire experience is built around your birth chart, your Human Design, and the season you&apos;re moving through right now. As the seasons change, your membership changes too. New lessons. New guidance. New invitations. All aligned with the cosmic weather and the version of yourself that&apos;s ready to emerge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              { szn: "Taurus szn", examples: ["Heal your relationship with money and start receiving", "Stop undercharging and start knowing your worth", "Learn to receive instead of overworking yourself into the ground", "Finally believe you are worthy of the abundance that keeps trying to reach you"], bg: "var(--mint)" },
              { szn: "Leo szn", examples: ["Step into full visibility and stop hiding your magic", "Show up unapologetically in every room you walk into", "Own the stage, the spotlight, the entire building", "Stop dimming your light for people who can't handle the glow"], bg: "var(--gold)" },
              { szn: "Scorpio szn", examples: ["Go deep on shadow work and financial intimacy", "Face the things you've been avoiding since forever", "Transform every ounce of pain into unstoppable power", "Go deep or go home. There is no in-between this season."], bg: "var(--lav-light)" },
              { szn: "Capricorn szn", examples: ["Build the business plan that actually matches your ambition", "Set goals that scare you and then crush every single one", "Get ruthlessly strategic about your next level", "Become the CEO of your own life. No permission needed."], bg: "var(--cream)" },
            ].map((card) => (
              <div key={card.szn} className="p-6 md:p-8" style={{ background: card.bg, border: "var(--border)" }}>
                <div style={{ fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 12, color: "var(--dark)" }}>
                  {card.szn}
                </div>
                <div className="space-y-1">
                  {card.examples.map((ex) => (
                    <p key={ex} style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>{ex}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)", marginBottom: 20 }}>
              Someone else opens the membership the same day and receives something completely different. Because she&apos;s here to learn different lessons. Her chart has a different story. Her season is asking her to grow in a different direction. That&apos;s the whole point.
            </p>
          </div>

          <div className="p-6 md:p-8 text-center" style={{ background: "var(--pink-light)", border: "var(--border)" }}>
            <p style={{
              fontFamily: pp, fontSize: 18, fontWeight: 800, color: "var(--dark)",
              lineHeight: 1.4, margin: 0,
            }}>
              This isn&apos;t content you binge and forget. It&apos;s a living, breathing, evolving membership built entirely around <span className="pk">you.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ UPCOMING WORKSHOPS ═══════════════ */}
      <section className="px-8 py-20 md:py-28" style={{ background: "#fafafa", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">your first month inside the membership</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            {workshopSeason.toLowerCase()} szn is about to <span className="pk">hit different.</span>
          </h2>

          {nextTwo.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            {nextTwo.map((workshop, i) => (
              <div
                key={workshop.id}
                className="p-8 md:p-12"
                style={{
                  background: workshop.dark ? "var(--dark)" : "var(--lav-light)",
                  borderRight: i === 0 ? "var(--border)" : undefined,
                }}
              >
                {workshop.coverImage && (
                  <div style={{
                    position: "relative", borderRadius: 14, overflow: "hidden",
                    border: workshop.dark ? "1px solid rgba(255,255,255,0.15)" : "var(--border)",
                    marginBottom: 22, aspectRatio: "16 / 9", background: "#000",
                  }}>
                    <Image
                      src={workshop.coverImage}
                      alt={workshop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: workshop.dark ? "var(--lav)" : "#7B68AE", marginBottom: 8 }}>
                  {workshop.label}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 20 }}>
                  {workshop.meta}
                </div>
                <h3 style={{ fontFamily: pp, fontSize: 24, fontWeight: 800, color: workshop.dark ? "#fff" : "var(--dark)", lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: 16 }}>
                  {workshop.title}
                </h3>
                {workshop.paragraphs.map((para, n) => (
                  <p
                    key={n}
                    style={{
                      fontSize: 13,
                      lineHeight: 1.8,
                      color: workshop.dark ? (n === 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.65)") : "var(--dark)",
                      marginBottom: n === workshop.paragraphs.length - 1 ? 24 : 16,
                    }}
                  >
                    {para}
                  </p>
                ))}
                {workshop.callout && (
                  <div className="p-4 mb-6" style={{
                    background: workshop.dark ? "rgba(255,45,135,0.1)" : "rgba(255,45,135,0.08)",
                    border: "1px solid rgba(255,45,135,0.25)",
                  }}>
                    <p style={{ fontFamily: pp, fontSize: 14, fontWeight: 800, color: workshop.dark ? "#fff" : "var(--dark)", lineHeight: 1.4, margin: 0 }}>
                      {workshop.callout.plain}<span style={{ color: "var(--pink)" }}>{workshop.callout.pink}</span>
                    </p>
                  </div>
                )}
                <Link href={ctaHref} className="btn-pink block text-center no-underline" style={{ padding: "16px 32px" }}>
                  {ctaLabel}
                </Link>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ═══════════════ THE SEASONAL MEMBERSHIP ═══════════════ */}
      <section className="px-8 py-20 md:py-28" style={{ background: "var(--dark)", borderTop: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--lav)", marginBottom: 24, opacity: 0.7, textAlign: "center",
          }}>
            inside the membership
          </div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.15, color: "#fff", marginBottom: 16,
            textAlign: "center",
          }}>
            The Seasonal <span style={{ color: "var(--pink)" }}>Membership.</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#fff", textAlign: "center", maxWidth: 520, margin: "0 auto 40px" }}>
            Every month follows the zodiac, and every three seasons make a chapter with one destination, so each season has a job in who you&apos;re becoming. Lock in for one chapter, then carry on into the next.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { slug: "aries", szn: "Aries szn", lesson: "Courage", desc: "The season you stop asking for permission and start taking what's yours. Bold moves only. No more playing it safe while your dreams collect dust.", bg: "var(--pink-light)", accent: "var(--pink)" },
              { slug: "taurus", szn: "Taurus szn", lesson: "Receiving", desc: "The season you stop hustling for scraps and start letting abundance in. Money, pleasure, self-worth. You learn to receive like the queen you are.", bg: "var(--mint)", accent: "#2d8a6e" },
              { slug: "gemini", szn: "Gemini szn", lesson: "Expression", desc: "The season you find your voice and weaponise it. Communication, magnetism, social power. You become the woman everyone wants at the table.", bg: "var(--gold)", accent: "var(--pink)" },
              { slug: "cancer", szn: "Cancer szn", lesson: "Nurturing", desc: "The season you heal the inner child and come home to yourself. Deep emotional work, fierce boundaries, and learning to mother yourself the way you always needed.", bg: "var(--lav-light)", accent: "#7B68AE" },
              { slug: "leo", szn: "Leo szn", lesson: "Visibility", desc: "The season you stop hiding and start shining so bright people need sunglasses. Main character energy activated. No more dimming your light for anyone.", bg: "var(--gold)", accent: "var(--pink)" },
              { slug: "virgo", szn: "Virgo szn", lesson: "Standards", desc: "The season you raise the bar so high that settling becomes physically impossible. Systems, rituals, health, habits. You build a life so well-designed that success becomes inevitable.", bg: "var(--mint)", accent: "#2d8a6e" },
              { slug: "libra", szn: "Libra szn", lesson: "Balance", desc: "The season you stop people-pleasing and start self-choosing. Boundaries that protect your peace. Relationships that match your worth. You choose yourself every single time.", bg: "var(--pink-light)", accent: "var(--pink)" },
              { slug: "scorpio", szn: "Scorpio szn", lesson: "Transformation", desc: "The season you face every shadow, burn down what's not working, and rise from the ashes completely unrecognisable. Shadow work. Financial intimacy. Go deep or go home.", bg: "var(--lav-light)", accent: "#7B68AE" },
              { slug: "sagittarius", szn: "Sag szn", lesson: "Expansion", desc: "The season you dream so big it scares you and then go bigger. Adventure, freedom, breaking out of the comfort zone that's been keeping you small. No ceiling.", bg: "var(--cream)", accent: "var(--pink)" },
              { slug: "capricorn", szn: "Cap szn", lesson: "Ambition", desc: "The season you become the CEO of your own life. Build the plan. Set the scary goals. Execute like a boss. No permission needed, no apologies given.", bg: "var(--mint)", accent: "#2d8a6e" },
              { slug: "aquarius", szn: "Aquarius szn", lesson: "Revolution", desc: "The season you break every rule that was never yours to follow. Stop fitting in, start building your own lane. Be so unapologetically yourself that the world makes room.", bg: "var(--lav-light)", accent: "#7B68AE" },
              { slug: "pisces", szn: "Pisces szn", lesson: "Surrender", desc: "The season you stop forcing and start flowing. Trust the process. Tap into your intuition louder than your overthinking. Let the universe lead for once.", bg: "var(--cream)", accent: "#7B68AE" },
            ].map((s) => (
              <Link key={s.szn} href={`/seasons/${s.slug}`} className="no-underline p-6 block" style={{ background: s.bg, border: "1px solid rgba(255,255,255,0.1)", transition: "opacity 0.15s" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: s.accent, marginBottom: 6 }}>
                  {s.szn}
                </div>
                <div style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, color: "var(--dark)", marginBottom: 8, letterSpacing: "-0.3px" }}>
                  {s.lesson}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--dark)" }}>
                  {s.desc}
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 md:p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>
                Transformational Workshops
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#fff", margin: 0 }}>
                Every month I lead a live masterclass and a live Astrotapping™ based on the current season, blending astrology, coaching, Human Design and subconscious rewiring so members don&apos;t just understand the energy. They become it.
              </p>
            </div>
            <div className="p-6 md:p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>
                Not Astrology Lectures
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#fff", margin: 0 }}>
                In Scorpio szn we go deep on shadow work and financial intimacy. In Leo szn we work on visibility and showing up like the main character. In Capricorn szn we build the business plan, set the goals, and get ruthlessly strategic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHAT YOU GET ═══════════════ */}
      <section className="px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">inside the membership</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            Everything you need to become <span className="pk">her.</span>
          </h2>

          {/* 1:1 Coaching Callout */}
          <div className="p-8 md:p-12 mb-8" style={{ background: "var(--dark)", border: "2px solid var(--pink)" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
                  vip membership only · $555/mo
                </div>
                <h3 style={{ fontFamily: pp, fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: 12 }}>
                  1:1 coaching with <span style={{ color: "var(--pink)" }}>Betty.</span>
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                  Not a group Q&A. Not a pre-recorded video. A private, personalised coaching session where we go deep on your chart, your blocks, your business, your relationships, your next move.
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#fff", fontWeight: 700, marginTop: 14, marginBottom: 0 }}>
                  This is the one thing the $88 plan doesn&apos;t include. Working with me privately only happens on VIP.
                </p>
              </div>
              <div className="p-6" style={{ background: "rgba(255,45,135,0.08)", border: "1px solid rgba(255,45,135,0.2)" }}>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#fff", fontStyle: "italic", marginBottom: 12 }}>
                  &ldquo;The 1:1 calls changed everything for me. Betty saw things in my chart I&apos;d completely overlooked and connected dots I never would have found on my own. Worth every penny.&rdquo;
                </p>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>
                  Amy, 34 · Entrepreneur
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            <div className="p-8 md:p-10" style={{ background: "var(--lav-light)", borderRight: "var(--border)", borderBottom: "var(--border)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.3px" }}>
                Guest Experts
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>
                Astrologers. Psychologists. Business founders. Therapists. Manifestation teachers. Entrepreneurs. Women who&apos;ve built the life and have the receipts to prove it. Guests chosen to match the energy of each season.
              </p>
            </div>
            <div className="p-8 md:p-10" style={{ background: "var(--cream)", borderRight: "var(--border)", borderBottom: "var(--border)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.3px" }}>
                The Vault
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", marginBottom: 12 }}>
                Every masterclass, every astrotapping and every meditation, saved and searchable inside your own library that grows every month.
              </p>
              <p style={{ fontSize: 12, color: "var(--dark)", margin: 0, fontStyle: "italic" }}>
                Not content you binge and forget. A resource you return to whenever you&apos;re ready to level up again.
              </p>
            </div>
            <div className="p-8 md:p-10" style={{ background: "var(--pink-light)", borderBottom: "var(--border)" }}>
              <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.3px" }}>
                Community
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", marginBottom: 12 }}>
                Not another group you mute after a week. A room full of women choosing themselves. Celebrating each other&apos;s wins. Mentioning each other&apos;s names in rooms full of opportunities.
              </p>
              <p style={{ fontSize: 12, color: "var(--dark)", margin: 0, fontStyle: "italic" }}>
                Your people are in here.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0" style={{ border: "var(--border)", borderTop: "none" }}>
            {[
              { title: "Monthly Masterclass", desc: "One live deep-dive a month on money, confidence, business, relationships, astrology or healing, taught live and recorded forever, so you can work each season as it's actually happening.", bg: "var(--mint)" },
              { title: "Monthly Astrotapping™", desc: "One live astrotapping a month: the astrology of the moment turned into an EFT tapping and embodiment session, so the shift lands in your body and not just your notes app.", bg: "var(--gold)" },
              { title: "The Replay Vault", desc: "Every masterclass and every astrotapping saved and searchable, all yours to return to whenever you're ready to go again. Build your own curriculum, at your own pace.", bg: "#fff" },
            ].map((item) => (
              <div key={item.title} className="p-8 md:p-10" style={{ background: item.bg, borderRight: "var(--border)" }}>
                <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.3px" }}>
                  {item.title}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dark)", margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 text-center" style={{ background: "var(--dark)" }}>
            <p style={{
              fontFamily: pp, fontSize: 16, fontWeight: 800, color: "#fff",
              lineHeight: 1.4, margin: 0,
            }}>
              Your life changes when the women around you <span style={{ color: "var(--pink)" }}>level up too.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF ═══════════════ */}
      <section className="px-8 py-16" style={{ background: "var(--lav-light)", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-8 text-center">what clients are saying</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { quote: "I just signed a $10k client after our business astro coaching session. The shift came from finally understanding my visibility blocks and the way I was undervaluing myself. Literally one of the best investments I've made in myself.", name: "Sarah, 32 · Business Coach" },
              { quote: "After our session I changed my messaging, raised my standards, showed up completely differently and suddenly people started responding differently too. I finally understand how to work WITH my energy instead of against it.", name: "Jess, 28 · Content Creator" },
              { quote: "I went from hiding behind my laptop to launching my first offer in 3 weeks. Betty helped me see that my Midheaven placement was literally designed for visibility and I'd been fighting it my whole life. Not anymore.", name: "Priya, 30 · Brand Strategist" },
              { quote: "I came in thinking I just wanted to learn about my chart. I left with a completely new relationship with myself. The subconscious rewiring sessions unlocked things I'd been carrying for years. I feel like a different woman.", name: "Lauren, 26 · Psychology Student" },
            ].map((t) => (
              <div key={t.name} className="p-8" style={{ background: "#fff", border: "var(--border)" }}>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", fontStyle: "italic", marginBottom: 16 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>
                  {t.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="pricing" className="px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">lock in</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(30px, 5.5vw, 48px)", fontWeight: 800,
            letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center", marginBottom: 16,
          }}>
            This is the party you&apos;ve been <span className="pk">waiting for.</span>
          </h2>
          <p style={{
            fontSize: 16, lineHeight: 1.8, color: "var(--dark)", textAlign: "center",
            maxWidth: 560, margin: "0 auto 12px",
          }}>
            Part mastermind, part membership, and built to change your whole f*cking life: three zodiac seasons, one destination, your own chart and Human Design, and an intimate room of women locking in with you.
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--pink)", textAlign: "center", marginBottom: 48 }}>
            {!doors.ready
              ? "\u00a0"
              : doors.open
                ? `The doors are open until ${doors.open.closesAtMoment}, ${doorDay(doors.open.closesAt)}.`
                : doors.next
                  ? `The doors are closed right now. They open ${doorDay(doors.next.opensAt)}.`
                  : "The doors are closed right now. They open at the start of the next season."}
          </p>

          {/* The entry band, deliberately full width ABOVE the paid cards rather than a fourth
              column, so it doesn't compete with the engineered $88-centred hierarchy below. What it
              offers depends on who's reading (see entryBand): a woman finishing a trial, or a free or
              lapsed account, gets the join; a stranger and a paying member get no band at all. */}
          {entryBand && (
            <div
              className="p-6 md:p-7 mb-5 flex items-center justify-between gap-6 flex-wrap"
              style={
                entryBand.mine
                  ? { border: "2px solid var(--pink)", background: "var(--pink-bg)" }
                  : { border: "var(--border)", background: "var(--lav-light)" }
              }
            >
              <div style={{ flex: "1 1 320px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: entryBand.mine ? "var(--pink)" : "#3C2A70", marginBottom: 10 }}>
                  {entryBand.eyebrow}
                </div>
                <div className="flex items-baseline gap-3 flex-wrap" style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: pp, fontSize: 34, fontWeight: 800, color: "var(--dark)", letterSpacing: "-1.5px", lineHeight: 1 }}>
                    {entryBand.heading}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--grey)" }}>{entryBand.sub}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.65, maxWidth: 520 }}>
                  {entryBand.body}
                </p>
              </div>
              <Link
                href={entryBand.href}
                className="btn-pink"
                style={{ whiteSpace: "nowrap", textAlign: "center" }}
              >
                {entryBand.cta}
              </Link>
            </div>
          )}

          {/* Two paid tiers since the $33 social tier was retired: free now owns the chat rooms, so
              social had nothing left that was uniquely its own, and its rituals (book club, moon
              audios, seasonal updates) moved up into MY SZN. Retired from SALE only, the tier still
              exists in stripe-tiers.ts and still passes the gates so existing $33 members keep what
              they're paying for. MY SZN ($88) stays the focal point: lifted, the only Most Popular
              badge, the boldest price and the strongest CTA, with VIP ($555, proximity) beside it. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start mb-6">

            {/* ── MY SZN · $88 · THE membership (hero, lifted) ── */}
            <div className="md:-mt-6" style={{ border: "2px solid var(--pink)", background: "var(--pink-light)", boxShadow: "0 12px 44px rgba(255,45,135,0.20)" }}>
              <div style={{ background: "var(--pink)", padding: "9px 0", textAlign: "center", fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>
                ★ the chapter
              </div>
              <div className="p-8 md:p-9">
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 14 }}>
                  my szn · 3 months · founding member pricing
                </div>
                <div style={{ fontFamily: pp, fontSize: 54, fontWeight: 800, color: "var(--dark)", letterSpacing: "-2.5px", lineHeight: 1 }}>
                  $250<span style={{ fontSize: 22, fontWeight: 600, letterSpacing: 0 }}> / 3 months</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--dark)", marginTop: 4 }}>
                  {PLAN_CHECKOUT_URL ? "paid once, or 3 monthly payments of $88" : "paid once · doesn't renew"}
                </div>
                <div style={{ display: "inline-block", marginTop: 10, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--pink)", padding: "5px 12px", borderRadius: 999 }}>
                  that&apos;s $2.78 a day, less than your oat latte ☕
                </div>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--dark)", lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>
                  Three months of live group coaching, an intimate mastermind-style room and your personalised platform, for less than most coaches charge for a single session. This is founding member pricing, and it&apos;s going up as MY SZN grows.
                </p>
                <p style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, color: "var(--dark)", letterSpacing: "-0.4px", lineHeight: 1.3, margin: "16px 0 10px" }}>
                  We&apos;re locking in for three months.
                </p>
                <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.7, marginBottom: 22 }}>
                  Three zodiac seasons that build on each other, read against your own chart, with the Transformation Workshop doing the deep work and the Community Circle making it fun, witchy and completely fabulous.
                </p>
                <div className="space-y-3 mb-7">
                  {[
                    "Three zodiac SZNs with one destination",
                    "A live Transformation Workshop every SZN",
                    "A live Community Circle every SZN: wins, ritual, spellwork, magic",
                    "A SZN hypnosis to come back to all season",
                    "Astro Tapping, shadow work, manifestation and audio guides when you need them",
                    "Your full MY SZN platform, personalised to your chart and Human Design",
                    "The MY SZN community, starting together with your intake",
                    "Replays of every live",
                    "Discounts on reports and Cosmic Coaching",
                  ].map((item) => (
                    <div key={item} className="flex gap-3 items-start">
                      <span style={{ color: "var(--pink)", fontSize: 14, marginTop: 2, flexShrink: 0 }}>&#10038;</span>
                      <span style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <ChapterJoin />
              </div>
            </div>

            {/* ── MY SZN VIP · $555 · everything, plus direct 1:1 coaching ── */}
            <div className="p-8" style={{ border: "var(--border)", background: "var(--dark)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 16 }}>
                my szn vip
              </div>
              <div style={{ fontFamily: pp, fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1 }}>
                $555<span style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0 }}>/mo</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4, marginBottom: 10 }}>
                billed monthly · cancel anytime
              </div>
              <div style={{ display: "inline-block", marginBottom: 18, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--pink)", padding: "5px 12px", borderRadius: 999 }}>
                that&apos;s $18.25 a day, less than your Friday night cocktail 🍸
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: 18 }}>
                Everything inside MY SZN, plus direct access to me. For the members who want proximity and personal coaching.
              </p>
              <div className="p-4 mb-5" style={{ background: "var(--pink)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
                  only on vip
                </div>
                <div style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", lineHeight: 1.3 }}>
                  Monthly 1:1 Cosmic Coaching with Betty
                </div>
              </div>
              <div className="space-y-2.5 mb-6">
                {[
                  "Everything in MY SZN",
                  "One monthly 1:1 Cosmic Coaching session",
                  "Priority booking",
                  "VIP-only bonuses and experiences",
                  "Early access to new features and events",
                ].map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <span style={{ color: "var(--pink)", fontSize: 13, marginTop: 2, flexShrink: 0 }}>&#10038;</span>
                    <span style={{ fontSize: 13, color: "#fff", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              {enrolmentOpen ? (
                <CheckoutButton checkoutUrl={VIP_CHECKOUT_URL} label="join vip · $555/mo" dark plan="vip" value={555} />
              ) : doors.ready ? (
                <DoorAlert next={doors.next} dark />
              ) : null}
            </div>

          </div>

          <div className="p-6 text-center" style={{ background: "var(--pink)" }}>
            <p style={{
              fontFamily: pp, fontSize: 16, fontWeight: 800, color: "#fff",
              lineHeight: 1.4, margin: 0,
            }}>
              This is how you stop reading about astrology and start <span style={{ textDecoration: "underline", textUnderlineOffset: 4 }}>living</span> it.{doors.open ? ` Doors close at ${doors.open.closesAtMoment}.` : door ? ` Doors open ${doorDay(door.opensAt)}.` : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="px-8 py-20 md:py-28" style={{ background: "#fafafa", borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-6 text-center">got questions</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-1.2px", lineHeight: 1.1, textAlign: "center", marginBottom: 48,
          }}>
            Everything you need to <span className="pk">know.</span>
          </h2>

          <div style={{ border: "var(--border)" }}>
            {[
              {
                q: "How does the 3-month commitment work?",
                a: PLAN_CHECKOUT_URL
                  ? "You're locking in for one chapter: three zodiac seasons, starting with the one you join in. Pay $250 once, which covers the full three months and never renews, or take the 3 x $88 plan, where those three monthly payments are committed and after the third it carries on monthly until you switch it off in your settings. The women who stay for the whole chapter are the ones who change, so that's what we build for."
                  : "You're locking in for one chapter: three zodiac seasons, starting with the one you join in. It's $250, paid once, which covers the full three months and never renews. The women who stay for the whole chapter are the ones who change, so that's what we build for.",
              },
              {
                q: "When can I join?",
                a: "The doors open for a few days at the start of each season and close at a real moment in the sky, a new moon or the Sun changing sign. New members join together as an intake, so you start alongside a group of women beginning at exactly the same time as you. When the doors are closed, leave your email in the pricing section and we'll tell you the second they open.",
              },
              {
                q: "What if I join partway through a chapter?",
                a: "Everyone inside lives the same season together, so you walk into the room exactly where it is. Your three seasons start with the one you join in, the replays from earlier in the chapter are waiting for you, and you get the end-of-chapter look back with everyone else.",
              },
              {
                q: "Is it really personalised, or just my sun sign?",
                a: "Your whole chart, read to the degree, not your sun sign. We read which house governs each area of your life, the sign sitting on it, the planet that rules that sign and where that ruler actually sits, then layer your Human Design on top. It reads like an astrologer sat down with your chart, because the platform genuinely works with all of it, every season.",
              },
              {
                q: "Do I get coaching with Betty?",
                a: "Yes. Every SZN has a live Transformation Workshop with Betty and a live Community Circle, in a room with the other members, with replays of both. MY SZN VIP ($555/mo) adds a private monthly 1:1 Cosmic Coaching session, just you and me.",
              },
              {
                q: "What if I'm new to astrology or Human Design?",
                a: "Perfect. You don't need to know your Big 3, your houses, your transits or your Human Design type. We generate your full chart and Human Design for you and teach you how to actually use them. Most astrology content stops at awareness. We start there.",
              },
              {
                q: "Can I move up to VIP later?",
                a: "Anytime. Lock in on MY SZN and move up to VIP whenever you want Betty working on your chart with you directly.",
              },
              {
                q: "How much time do I need each week?",
                a: "Two lives a season: the Transformation Workshop and the Community Circle. Between them you have the SZN hypnosis, the community, your personalised portal and the replays, and you take what you need, when you need it. No homework, no guilt.",
              },
              {
                q: "How much does it cost?",
                a: `${planLine}. VIP, with a private monthly 1:1 coaching session with Betty, is $555/mo. Everything is in the pricing section above.`,
              },
              {
                q: "Can I cancel or get a refund?",
                a: PLAN_CHECKOUT_URL
                  ? "The $250 is one payment for three months and simply ends, nothing renews. On the 3 x $88 plan the three payments are committed, so cancelling opens up after your third payment, and from then on you can switch it off any time in your settings. We don't offer refunds on payments already taken, because real transformation requires showing up, even on the days you don't feel like it. That's the whole point."
                  : "The $250 is one payment for three months and simply ends, nothing renews and there's nothing to cancel. We don't offer refunds on payments already taken, because real transformation requires showing up, even on the days you don't feel like it. That's the whole point.",
              },
              {
                q: "I'm not a business owner. Is this still for me?",
                a: "Absolutely. MY SZN is for any woman who wants more from life. More confidence, more clarity, more self-trust, more alignment. Whether you're building a business, healing, finding your purpose, or just ready to stop playing small.",
              },
            ].map((faq, i, faqs) => (
              <details key={i} className="group" style={{ borderBottom: i < faqs.length - 1 ? "var(--border)" : "none" }}>
                <summary style={{
                  padding: "20px 24px", cursor: "pointer", listStyle: "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontFamily: pp, fontSize: 15, fontWeight: 700, color: "var(--dark)",
                  letterSpacing: "-0.3px",
                }}>
                  {faq.q}
                  <span style={{ fontSize: 20, color: "var(--pink)", flexShrink: 0, marginLeft: 16, transition: "transform 0.2s" }} className="group-open:rotate-45">+</span>
                </summary>
                <div style={{ padding: "0 24px 20px", fontSize: 14, lineHeight: 1.8, color: "var(--dark)" }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      {/* Door-aware: while a door is open this is the join; while they're shut it's the door alert,
          which files her on the MY SZN waitlist list so she hears the second the next one opens. */}
      <section id="doors" className="px-8 py-20 md:py-28" style={{ background: "var(--pink-light)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--pink)", marginBottom: 24,
              }}>
                {enrolmentOpen ? "the doors are open" : "the doors are closed right now"}
              </div>
              <h2 style={{
                fontFamily: pp, fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800,
                letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 16,
              }}>
                Become her <span className="pk">before 2027.</span>
              </h2>
              <p style={{
                fontSize: 15, lineHeight: 1.8, color: "var(--dark)", maxWidth: 440,
                marginBottom: 28,
              }}>
                {enrolmentOpen
                  ? "We're locking in for three months, and you're invited. Choose how you'd like to pay and your personalised portal is built the moment you're in."
                  : "We open the doors for a few days at the start of each season, so everyone who joins starts together. Leave your email and you'll be the first to know when they open."}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  "3 zodiac SZNs",
                  "Workshop + Circle every SZN",
                  // Read off the schedule rather than typed in, so it can't sit here advertising a
                  // class that already happened.
                  nextTwo[0] ? `Next live ${shortWorkshopMeta(nextTwo[0], now ?? 0).split(" · ")[0]}` : "A live workshop every SZN",
                  "Your chart + Human Design",
                  planLine,
                ].map((b) => (
                  <span key={b} style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
                    color: "var(--dark)", padding: "8px 16px",
                    background: "#fff", border: "var(--border)",
                  }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10" style={{ border: "var(--border)", background: "#fff" }}>
              <div className="tag mb-3">{enrolmentOpen ? "lock in" : "doors alert"}</div>
              {enrolmentOpen ? <ChapterJoin /> : doors.ready ? <DoorAlert next={doors.next} /> : <div style={{ minHeight: 220 }} aria-hidden />}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50" style={{
        background: "var(--pink)", padding: "12px 20px",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.15)",
      }}>
        <Link href={ctaHref} className="no-underline flex items-center justify-center gap-2" style={{
          fontFamily: pp, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#fff",
        }}>
          {ctaLabel}
          <span style={{ fontSize: 16 }}>&#8594;</span>
        </Link>
      </div>
    </div>
  );
}
