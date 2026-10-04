"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LaunchCountdown from "@/components/LaunchCountdown";
import { upcomingWorkshops, seasonOfNextWorkshop, shortWorkshopMeta } from "@/lib/workshops";
import { joinCta } from "@/lib/cta";
import { useMember } from "@/lib/use-member";
import { isTrial } from "@/lib/membership-access";
import { trialCountdown } from "@/lib/trial-countdown";
import { entryBandFor } from "@/lib/membership-entry-band";
import { useSeason } from "@/lib/use-season";
import WhatIsMySzn from "@/components/WhatIsMySzn";
import { useDoors } from "@/lib/enrolment";
import { CHAPTERS, currentChapter, doorDay, doorDays, doorTime, sznList, sznTheme } from "@/lib/doors";
import ChapterJoin, { DoorAlert } from "@/components/ChapterJoin";
import Manifesto from "@/components/Manifesto";
import ThreeMonthsFromNow from "@/components/ThreeMonthsFromNow";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import WhenYouJoin from "@/components/WhenYouJoin";
import QuoteStrip from "@/components/QuoteStrip";
import CoachingBand from "@/components/CoachingBand";
import ValueStack from "@/components/ValueStack";
import MeetBetty from "@/components/MeetBetty";

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
  const joinLabel = enrolmentOpen ? "lock me in" : "apply for the founding cohort";

  // The upcoming-workshops block reads the same schedule as /events, so this sales page never
  // advertises a class that has already happened. Clock read on the client so the upcoming split
  // is stable across a render rather than running Date.now() during one.
  const season = useSeason();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const nextTwo = now === null ? [] : upcomingWorkshops(now).slice(0, 2);
  // The chapter on sale. Before the clock is read this is the first chapter, so the static render
  // and the first client render agree.
  const chapter = currentChapter(now ?? 0) ?? CHAPTERS[0];
  const planLine = "Founding price: $555 a month for 3 months (worth $1,111 a month), going up after the founding cohort";

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
            ? "Applications are open for the founding cohort."
            : doors.open
              ? `${door.name.charAt(0).toUpperCase()}${door.name.slice(1)} is open.`
              : `Doors open ${doorDay(door.opensAt)}.`}
        </h2>
        <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 6px" }}>
          {door
            ? `The doors are only open for ${doorDays(door)} days. New members join together in a short intake at the start of a season, and ${door.name} locks in for ${sznList(door)}, three seasons that build on each other. The doors close at ${door.closesAtMoment}, ${doorDay(door.closesAt)} at ${doorTime(door.closesAt)}.`
            : "The founding cohort moves through three zodiac seasons together, with a private 1:1 with Betty every month and a group mastermind every season."}
          {nextTwo[0] ? ` We start together with ${nextTwo[0].title}, ${shortWorkshopMeta(nextTwo[0], now ?? 0)}.` : ""}
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
          A private 1:1 with Betty every month of your three months.
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

      <WhatIsMySzn />

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
                h: "Betty, privately, every month",
                b: "A private 1:1 with Betty every month, built around what you're creating in your 90 days, plus a live group mastermind every season with coaching, shadow work, Astro Tapping and real-world action, and a hypnosis to come back to all season long.",
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

      <CoachingBand />

      <QuoteStrip ids={["priya", "hannah", "georgia"]} />

      <ThreeMonthsFromNow />

      <QuoteStrip ids={["zara", "amelia", "danielle"]} tone="pink" />

      <WhoThisIsFor />

      <ValueStack />

      <MeetBetty />

      <Manifesto />

      <QuoteStrip ids={["maya", "jade", "lauren"]} label="what bigger moves look like in here" tone="lav" />

      {/* ═══════════════ PRICING ═══════════════ */}
      <WhenYouJoin />

      <QuoteStrip ids={["sophie", "aisha", "chloe"]} label="the women inside" />

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
            Part mastermind, part private coaching, and built to change your whole f*cking life: three zodiac seasons, a monthly 1:1 with Betty, your own chart and Human Design, and an intimate room of women locking in with you.
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

          {/* One offer: the three-month cohort. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-6" style={{ border: "2px solid var(--pink)", background: "var(--pink-light)", boxShadow: "0 12px 44px rgba(255,45,135,0.20)" }}>
            <div className="p-8 md:p-10">
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 14 }}>
                my szn · the three-month cohort
              </div>
              <div style={{ fontSize: 15, color: "var(--dark)", textDecoration: "line-through", textDecorationColor: "var(--pink)" }}>worth $1,111 a month</div>
              <div style={{ fontFamily: pp, fontSize: 54, fontWeight: 800, color: "var(--dark)", letterSpacing: "-2.5px", lineHeight: 1 }}>
                $555<span style={{ fontSize: 22, fontWeight: 600, letterSpacing: 0 }}> a month × 3</span>
              </div>
              <div style={{ display: "inline-block", marginTop: 10, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--pink)", padding: "5px 12px", borderRadius: 999 }}>
                founding price · going up after the founding cohort
              </div>
              <p style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, color: "var(--dark)", letterSpacing: "-0.4px", lineHeight: 1.3, margin: "18px 0 14px" }}>
                Private coaching with Betty, a small room of women and your own chart, for three months.
              </p>
              <div className="space-y-3">
                {[
                  "A private 1:1 session with Betty every month (three in total)",
                  "A live group mastermind every season, with Astro Tapping, hot seats and real-world action",
                  "A hypnosis for every season to rewire the old identity",
                  "Your personalised astrology + Human Design guide for every season",
                  "A small private cohort for accountability, wins and questions",
                  "Proof you're changing: your 90-day goal, actions and wins in one place",
                ].map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <span style={{ color: "var(--pink)", fontSize: 14, marginTop: 2, flexShrink: 0 }}>&#10038;</span>
                    <span style={{ fontSize: 14.5, color: "var(--dark)", lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 md:p-10" style={{ background: "#fff", borderLeft: "2px solid var(--pink)" }}>
              <div className="tag mb-3">{enrolmentOpen ? "lock in" : "apply"}</div>
              <ChapterJoin />
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
                a: "You're locking in for one cohort: three zodiac seasons that you move through together, from the first day to the end-of-cohort look back. The founding price and payment options go to the waitlist first.",
              },
              {
                q: "I always buy things and don't use them. How is this different?",
                a: "Because nothing in here waits for you to find the motivation on your own. You join with an intake on a set date, so you start alongside women beginning at exactly the same time as you, you lock in for three months instead of browsing for a week, and you have a private 1:1 with Betty every month and a group mastermind every season where we check in, share the wins and hold each other to it. The hypnosis fits into a walk or a quiet ten minutes, so it works in real life too.",
              },
              {
                q: "What time zone are the lives in?",
                a: "We schedule the lives to work across the US and the UK, every date and time is on your dashboard well in advance, and every live is recorded, so wherever you are in the world you can catch the replay in your own time.",
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
                a: "Yes, privately. You get a 1:1 session with Betty every month of your three months, built around what you're creating: coaching, your astrology and Human Design, money, visibility, relationships, shadow work, whatever is actually coming up for you. Then there's a live group mastermind every season with the rest of your cohort.",
              },
              {
                q: "What if I'm new to astrology or Human Design?",
                a: "Perfect. You don't need to know your Big 3, your houses, your transits or your Human Design type. We generate your full chart and Human Design for you and teach you how to actually use them. Most astrology content stops at awareness. We start there.",
              },
              {
                q: "How much time do I need each week?",
                a: "Each month: one private 1:1 with Betty and one group mastermind. Between them you have the SZN hypnosis, your cohort and your personalised astrology, and you take what you need, when you need it. No homework, no guilt.",
              },
              {
                q: "How much does it cost?",
                a: `${planLine}. Everything is in the pricing section above.`,
              },
              {
                q: "Can I cancel or get a refund?",
                a: "Payments aren't refundable, because real transformation requires showing up, even on the days you don't feel like it. That's the whole point.",
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
                {enrolmentOpen ? "the doors are open" : "applications are open"}
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
                  : "Applications are open for the founding cohort. Tell me a little about you and what you want to create, and we'll be in touch before the doors open."}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  "3 private 1:1s with Betty",
                  "Group mastermind every SZN",
                  // Read off the schedule rather than typed in, so it can't sit here advertising a
                  // class that already happened.
                  "A hypnosis every SZN",
                  "Your chart + Human Design",
                  "$555 a month × 3 · founding price",
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
              <div className="tag mb-3">{enrolmentOpen ? "lock in" : "apply"}</div>
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
