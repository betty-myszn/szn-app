"use client";

import Link from "next/link";
import Image from "next/image";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess, hasBillingIssue } from "@/lib/membership-access";
import { useYourSzn } from "@/lib/use-your-szn";
import { useChart } from "@/lib/use-chart";
import { formatSeasonDates } from "@/lib/seasons";
import { useSeason } from "@/lib/use-season";
import { SIGN_OVERVIEWS } from "@/lib/interpretations";
import { RISING_VIBES } from "@/lib/style-data";
import { getTarotOfDay } from "@/lib/tarot";
import { upcomingWorkshops, pastWorkshops, type Workshop } from "@/lib/workshops";
import { useEffect, useRef, useState } from "react";
import { loadJournalEntries } from "@/lib/journal-store";
import { computeJournalStreak } from "@/lib/streaks";
import { getPrimaryGoal, type Goal } from "@/lib/goals-store";
import { loadChallengeProgress, computeChallengeStreak } from "@/lib/challenge-progress";
import { loadDashboardPrefs, toggleDashboardSection, DASHBOARD_SECTIONS, type DashboardPrefs } from "@/lib/dashboard-preferences";
import { loadPolls, loadResponses, getActivePollFor, submitResponse, type Poll } from "@/lib/polls";
import Ticker from "@/components/Ticker";
import SeasonPersonalised from "@/components/SeasonPersonalised";
import LifeAreasGuide from "@/components/LifeAreasGuide";
import SeasonDesignInline from "@/components/SeasonDesignInline";
import SkyAlert from "@/components/SkyAlert";
import SeasonMeditation from "@/components/SeasonMeditation";
import ReplayHighlight from "@/components/ReplayHighlight";
import TransitsToYourChart from "@/components/TransitsToYourChart";
import PasswordPromptBanner from "@/components/PasswordPromptBanner";
import TrialKeepPanel from "@/components/TrialKeepPanel";
import ActivationStrip from "@/components/ActivationStrip";
import { isEclipseSeasonLive } from "@/lib/eclipse-season-gate";

// The member dashboard: the season HQ. A light pastel hero with the per-season cut-out, a scannable
// top band (today + cosmic weather + a "what do you need right now" router + a personalised "for
// you" block), then the rich reading components wired to real data, then the toolkit, community and
// the vault. The heavy reading sections in the middle are reused as-is for now and get restyled to
// match the new look next.

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Per-season hero cut-out. A season with no art falls back to no image and the pastel card stands
// on its own, so adding a new season's hero is one line here plus the file in /public.
const HERO_ART: Record<string, string> = {
  Leo: "/leo-lion.png",
};

function heroImageForSign(sign: string): string | null {
  return HERO_ART[sign] ?? null;
}

const eyebrow: React.CSSProperties = {
  fontFamily: poppins,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--pink)",
  marginBottom: 14,
};

const sectionHead: React.CSSProperties = {
  fontFamily: poppins,
  fontSize: "clamp(28px, 4.6vw, 50px)",
  fontWeight: 800,
  letterSpacing: "-1.2px",
  lineHeight: 1.04,
  color: "var(--dark)",
  textTransform: "lowercase",
};

export default function DashboardPage() {
  const { member, ready, error } = useMember();
  const { data: szn } = useYourSzn();
  const { chart } = useChart();
  const season = useSeason();
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);
  const [primaryGoal, setPrimaryGoal] = useState<Goal | null | undefined>(undefined);
  const [challengeStreak, setChallengeStreak] = useState({ current: 0, longest: 0, activeToday: false });
  const [prefs, setPrefs] = useState<DashboardPrefs | null>(null);
  const [customizing, setCustomizing] = useState(false);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [pollDraft, setPollDraft] = useState("");
  const [pollSubmitted, setPollSubmitted] = useState(false);
  // Captured once at mount. Only the workshop lists read this, and they just need roughly-now to
  // sort upcoming from past. The per-second interval that used to live here existed solely to tick
  // the live coaching countdown, which has been removed.
  const [nowMs] = useState(() => Date.now());
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  useEffect(() => {
    setStreak(computeJournalStreak(loadJournalEntries()));
    setPrimaryGoal(getPrimaryGoal());
    setChallengeStreak(computeChallengeStreak(loadChallengeProgress()));
    setPrefs(loadDashboardPrefs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!member) return;
    const respondent = member.name;
    (async () => {
      const [polls, responses] = await Promise.all([loadPolls(), loadResponses()]);
      setActivePoll(getActivePollFor(polls, responses, respondent));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.name]);

  const handlePollSubmit = () => {
    if (!activePoll || !pollDraft.trim() || !member) return;
    submitResponse(activePoll.id, member.name, pollDraft);
    setPollSubmitted(true);
    setTimeout(() => {
      setActivePoll(null);
      setPollDraft("");
      setPollSubmitted(false);
    }, 1600);
  };

  const handleToggleSection = (id: (typeof DASHBOARD_SECTIONS)[number]["id"]) => {
    setPrefs(toggleDashboardSection(id));
  };

  // Never return null here: a bare null is a blank white screen, and `ready` used to be able to
  // hang false forever if the member lookup threw. `ready` is now guaranteed to flip (see
  // useMember), so this is a genuine, brief "still loading" and gets a branded state instead.
  if (!ready) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" aria-live="polite">
          <div
            className="animate-spin"
            style={{ width: 30, height: 30, margin: "0 auto 18px", borderRadius: "50%", border: "3px solid var(--pink-light, #f6d9e7)", borderTopColor: "var(--pink)" }}
          />
          <p style={{ fontFamily: poppins, fontSize: 14, color: "var(--grey)" }}>loading your season...</p>
        </div>
      </section>
    );
  }

  // The lookup itself failed (transient Supabase/auth/network), not a logged-out member. Offer a
  // real way back in instead of a blank page or a misleading "members only".
  if (error && !member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            we couldn&apos;t load your season.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 22 }}>
            Nothing is lost and it isn&apos;t you, this is on our side. Give it another go.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => window.location.reload()} className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
              try again
            </button>
            <Link href="/login" className="btn-outline no-underline">log in</Link>
          </div>
        </div>
      </section>
    );
  }

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            members only, babe.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (!hasActiveAccess(member)) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            your portal&apos;s waiting.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            {hasBillingIssue(member)
              ? "We couldn't process your last payment. Update your payment method to get back in."
              : "This is where your membership lives, the monthly masterclass and astro tapping, your full chart portal, shadow work, the community. Join to unlock it."}
          </p>
          <Link href={hasBillingIssue(member) ? "/api/stripe/portal" : "/membership"} className="btn-pink">
            {hasBillingIssue(member) ? "update payment method" : "see membership options"}
          </Link>
        </div>
      </section>
    );
  }

  // No REAL chart on this device yet. Two ways to get here: her chart is still hydrating from
  // Supabase on a fresh browser (a second, then hasRealChart flips true and this whole block
  // re-renders into the real dashboard on its own), or she genuinely has no chart (a signup where
  // the client-side calc didn't land). Either way we must NOT render the dashboard proper, because
  // member.placements is padded with DEMO_PLACEMENTS as an anti-crash net and rendering it would
  // show a real member a stranger's Leo/Pisces/Aquarius chart. Show a loading state that offers a
  // route to onboarding as a fallback, never fake astrology.
  if (!member.hasRealChart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 440 }} aria-live="polite">
          <div
            className="animate-spin"
            style={{ width: 30, height: 30, margin: "0 auto 18px", borderRadius: "50%", border: "3px solid var(--pink-light, #f6d9e7)", borderTopColor: "var(--pink)" }}
          />
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            setting up your season...
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            We&apos;re pulling your chart together. If this doesn&apos;t clear in a moment, add your
            birth details and we&apos;ll build your personalised season from scratch.
          </p>
          <Link href="/onboarding" className="btn-pink">add your birth details</Link>
        </div>
      </section>
    );
  }

  // Placements are real and present from here (hasRealChart gate above). Reads stay defensively
  // optional-chained anyway, since an individual outer body can still be "" if the ephemeris didn't
  // return it, and an unguarded .toLowerCase() on that would blank the page.
  const placements = member.placements ?? null;
  const bigThree = [
    { l: "sun", s: placements?.sun },
    { l: "moon", s: placements?.moon },
    { l: "rising", s: placements?.rising },
  ].filter((p): p is { l: string; s: string } => typeof p.s === "string" && p.s.length > 0);
  const rising = placements?.rising ? RISING_VIBES[placements.rising] : undefined;
  const signOverview = SIGN_OVERVIEWS[season.sign];
  const tarot = getTarotOfDay(member.email || member.name);
  const sign = season.sign.toLowerCase();
  const heroImg = heroImageForSign(season.sign);
  const oneMove =
    szn?.manifestationMission?.actionStep ||
    szn?.journalPrompts?.[0]?.prompt ||
    "Do the one brave thing you keep talking yourself out of.";

  // Workshops for the carousel: what's still to come first, then finished ones as replays.
  const upcoming = upcomingWorkshops(nowMs);
  const past = pastWorkshops(nowMs);
  const workshopSlides: { w: Workshop; kind: "upcoming" | "replay" }[] = [
    ...upcoming.map((w) => ({ w, kind: "upcoming" as const })),
    ...past.map((w) => ({ w, kind: "replay" as const })),
  ];
  const nextDated = upcoming.find((w) => w.startIso) ?? null;

  // Season progress: week X of N, derived from the season's own start/end dates so it never needs
  // hand-updating. Handles the one season (Capricorn) that wraps across new year.
  const seasonProgress = (() => {
    const now = new Date();
    const y = now.getFullYear();
    let start = new Date(y, season.startMonth - 1, season.startDay);
    let end = new Date(y, season.endMonth - 1, season.endDay);
    if (end < start) {
      if (now < start) start = new Date(y - 1, season.startMonth - 1, season.startDay);
      else end = new Date(y + 1, season.endMonth - 1, season.endDay);
    }
    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
    const elapsed = Math.min(totalDays, Math.max(0, Math.round((now.getTime() - start.getTime()) / 86400000)));
    const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
    return { totalWeeks, currentWeek: Math.min(totalWeeks, Math.floor(elapsed / 7) + 1) };
  })();
  const pad2 = (n: number) => String(n).padStart(2, "0");

  // "what do you need right now" routes to real destinations.
  const NEEDS = [
    { lab: "i want more confidence", sub: "your main character energy", href: "/my-chart/main-character" },
    { lab: "i want more money", sub: "your money goal + astrology", href: "/goals" },
    { lab: "i want to be more visible", sub: "the visible af workshop", href: "/events" },
    { lab: "i need direction", sub: "your full season guide", href: "#season-guide" },
    { lab: "work with my astrology", sub: "your birth chart", href: "/my-chart" },
    { lab: "i need a f*cking reset", sub: "shadow work + journal", href: "/journal" },
  ];

  const ROOMS = [
    { lab: "general chat", href: "/community" },
    { lab: `${sign} chat`, href: "/community" },
    { lab: "business + money", href: "/community" },
    { lab: "manifestation", href: "/community" },
    { lab: "ask betty", href: "/community" },
  ];

  const TOOLS = [
    { glyph: "☾", t: "shadow journal", b: "Prompts that move with the sky.", href: "/journal" },
    { glyph: "♀", t: "style codes", b: "Dress like the woman you're becoming.", href: "/style" },
    { glyph: "✦", t: "affirmations", b: "Said in your voice, for your szn.", href: "/affirmations" },
    { glyph: "★", t: "challenges", b: challengeStreak.current > 0 ? `${challengeStreak.current} day streak, keep it.` : "Missions, xp and a streak.", href: "/challenges" },
    { glyph: "▷", t: "replays", b: "Every class, saved forever.", href: "/events" },
  ];

  return (
    <>
      <PasswordPromptBanner />
      {/* The first run: three moves that make the platform click, gone once she's done them. Stands
          down for the last three days so it never stacks with the closing ask below. */}
      <ActivationStrip hasGoal={!!primaryGoal} />
      {/* Only appears in the last three days of a free week, and only for a trial member. Fed her own
          streak and goal so what she'd be putting down is named rather than listed. */}
      <TrialKeepPanel streakDays={streak?.current ?? 0} goalTitle={primaryGoal?.title ?? null} />
      <Ticker
        variant="lav"
        items={[`it's ${sign} szn, baby`, ...season.tickerLines]}
      />

      {/* ── HERO: light pastel card, per-season cut-out on the right ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--cream)", borderBottom: "var(--border)", paddingTop: 40, paddingBottom: 40 }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginBottom: 20 }}>
            <span style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey)" }}>
              welcome back, {member.name.toLowerCase()} ✦ {sign} szn hq
            </span>
            {streak && streak.current > 0 && (
              <Link href="/journal" className="no-underline flex items-center gap-2" style={{ borderRadius: 40, border: "2px solid var(--pink)", background: "var(--pink-bg)", padding: "6px 14px" }}>
                <span style={{ fontSize: 14 }}>🔥</span>
                <span style={{ fontFamily: poppins, fontSize: 12, fontWeight: 800, color: "var(--pink)" }}>{streak.current} day{streak.current === 1 ? "" : "s"} streak</span>
              </Link>
            )}
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-[1.35fr_0.95fr]"
            style={{ borderRadius: 22, overflow: "hidden", border: "2px solid var(--dark)", background: "linear-gradient(130deg, #FFEAF3 0%, #F7ECFF 55%, #EEE6FE 100%)" }}
          >
            <div style={{ padding: "clamp(28px, 4vw, 44px)" }}>
              <div style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, marginBottom: 14, color: "var(--dark)" }}>
                the <span style={{ fontFamily: "var(--script, cursive)", fontSize: 24, fontWeight: 400, border: "2px solid var(--dark)", borderRadius: 40, padding: "1px 14px" }}>{sign} szn</span> edit
              </div>
              <h1 className="display" style={{ fontSize: "clamp(52px, 10vw, 116px)", lineHeight: 0.88, color: "var(--dark)" }}>
                {sign} <span className="pk">szn.</span>
              </h1>
              <p style={{ fontFamily: poppins, fontSize: "clamp(17px, 2.2vw, 24px)", fontWeight: 800, color: "var(--dark)", margin: "16px 0 10px" }}>
                {season.tagline}
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--grey)", maxWidth: 430, marginBottom: 18 }}>
                {season.focus}
              </p>
              <span style={{ display: "inline-block", fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark)", background: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(26,26,26,0.12)", borderRadius: 40, padding: "8px 15px" }}>
                {season.symbol} {formatSeasonDates(season)}
              </span>
              <div className="flex flex-wrap gap-2" style={{ margin: "18px 0 16px" }}>
                {season.themes.slice(0, 4).map((t) => (
                  <span key={t} style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3C2A70", background: "var(--lav)", borderRadius: 40, padding: "7px 15px" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {bigThree.map((p) => (
                  <span key={p.l} style={{ fontSize: 11, color: "var(--dark)", background: "#fff", border: "1.5px solid rgba(26,26,26,0.12)", borderRadius: 40, padding: "7px 14px" }}>
                    <b style={{ color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10, marginRight: 5 }}>{p.l}</b>
                    {p.s.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ position: "relative", minHeight: 300, display: "grid", placeItems: "end center" }}>
              {heroImg ? (
                <Image src={heroImg} alt="" aria-hidden width={560} height={700} priority style={{ width: "auto", height: "100%", maxHeight: 380, objectFit: "contain", objectPosition: "bottom" }} />
              ) : (
                <div style={{ fontSize: 150, alignSelf: "center", opacity: 0.9 }}>{season.symbol}</div>
              )}
            </div>
          </div>

          {isEclipseSeasonLive() && (
            <div className="flex items-center gap-4 flex-wrap justify-between" style={{ marginTop: 16, background: "#fff", border: "2px solid var(--dark)", borderRadius: 14, padding: "16px 22px" }}>
              <p style={{ margin: 0, fontSize: 13, color: "var(--dark)" }}>
                🌒 <strong>eclipse season is live.</strong> A Leo solar eclipse on the 12th, a Pisces lunar eclipse on the 28th.
              </p>
              <Link href="/your-season/moon?type=solar_eclipse&date=2026-08-12&sign=Leo&degree=20&nodeEnd=south" className="no-underline" style={{ background: "var(--pink)", color: "#fff", fontFamily: poppins, fontSize: 12, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", padding: "12px 22px", borderRadius: 40, whiteSpace: "nowrap" }}>
                read your eclipse guide
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── newest replay spotlight: straight under the hero and the eclipse banner, because a
           class that just landed is the most time-sensitive thing on the page. Self-hides once the
           replay is a few days old, and falls back to the slim vault banner. ── */}
      <ReplayHighlight />

      {/* ── TODAY: the daily hook ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 40, paddingBottom: 40 }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ ...eyebrow, color: "#fff", marginBottom: 18 }}>today, {member.name.toLowerCase()}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.28)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 10 }}>today&apos;s affirmation</div>
              <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, lineHeight: 1.35, color: "#fff", margin: 0 }}>&ldquo;{season.affirmation}&rdquo;</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.28)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 10 }}>your card today</div>
              <div style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, color: "#fff" }}>{tarot.glyph} {tarot.name.toLowerCase()}</div>
              <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.5, marginTop: 8, marginBottom: 0 }}>{tarot.message}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.28)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 10 }}>your one move today</div>
              <p style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, lineHeight: 1.35, color: "#fff", margin: 0 }}>{oneMove}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COSMIC WEATHER: high up, live transits ── */}
      <SkyAlert chart={chart} />

      {/* ── THE SKY ON HER CHART: live transit-to-natal contacts. Sits directly under the collective
             weather so the page goes "here is the sky" then "here is what it is doing to YOU". The
             data was already being computed by /api/your-szn and thrown away; this renders it. ── */}
      <TransitsToYourChart transits={szn?.transits} />

      {/* ── WHAT DO YOU NEED RIGHT NOW: the router ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="max-w-6xl mx-auto">
          <div style={eyebrow}>start here</div>
          <h2 style={{ ...sectionHead, marginBottom: 26 }}>what do you need <span className="pk">right now?</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {NEEDS.map((n, i) => (
              <Link key={n.lab} href={n.href} className="no-underline flex flex-col" style={{ borderRadius: 14, background: i % 3 === 1 ? "var(--lav-light)" : "var(--pink-bg)", border: `2px solid ${i % 3 === 1 ? "var(--lav)" : "#FFC2DE"}`, padding: 26, minHeight: 148 }}>
                <span style={{ fontFamily: poppins, fontSize: "clamp(19px, 2.3vw, 25px)", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--dark)", lineHeight: 1.1, textTransform: "lowercase" }}>{n.lab}</span>
                <span style={{ fontSize: 12, color: "var(--grey)", marginTop: 8 }}>{n.sub}</span>
                <span style={{ marginTop: "auto", paddingTop: 16, fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>take me there →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── your leo szn, area by area (reused) ── */}
      <LifeAreasGuide season={season} chart={chart} goal={primaryGoal ?? null} />

      {/* ── UPCOMING MASTERCLASSES: workshops carousel with cover images. Titled by what it is, not
          by season, because the list runs across seasons (Leo into Virgo), not just this szn. ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap" style={{ marginBottom: 26 }}>
            <div>
              <div style={eyebrow}>live with betty</div>
              <h2 style={sectionHead}>upcoming <span className="pk">masterclasses.</span></h2>
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => scrollTrack(-1)} aria-label="previous workshop" style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--dark)", background: "transparent", color: "var(--dark)", fontSize: 18, cursor: "pointer", display: "grid", placeItems: "center" }}>‹</button>
              <button onClick={() => scrollTrack(1)} aria-label="next workshop" style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--dark)", background: "transparent", color: "var(--dark)", fontSize: 18, cursor: "pointer", display: "grid", placeItems: "center" }}>›</button>
            </div>
          </div>
          <div ref={trackRef} style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory" }}>
            {workshopSlides.map(({ w, kind }) => (
              <article key={w.id} style={{ flex: "0 0 320px", scrollSnapAlign: "start", borderRadius: 22, overflow: "hidden", border: "2px solid var(--dark)", background: "#fff", display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    height: 160,
                    display: "grid",
                    placeItems: "center",
                    background: w.coverImage ? "#211d2c" : "linear-gradient(135deg, var(--pink), var(--lav))",
                    backgroundImage: w.coverImage ? `url(${w.coverImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {kind === "replay" && (
                    <span style={{ width: 54, height: 54, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.92)", display: "grid", placeItems: "center", color: "#fff", fontSize: 16, paddingLeft: 3 }}>▶</span>
                  )}
                </div>
                <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 10 }}>{w.meta}</div>
                  <h3 style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.15, color: "var(--dark)" }}>{w.title}</h3>
                  <div style={{ marginTop: "auto", paddingTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 11px", borderRadius: 40, background: kind === "upcoming" ? "var(--pink)" : "transparent", color: kind === "upcoming" ? "#fff" : "var(--grey)", border: kind === "upcoming" ? "none" : "1.5px solid #ddd" }}>
                      {kind === "upcoming" ? "upcoming" : "replay"}
                    </span>
                    {/* A replay card goes straight to its own card in the vault, an upcoming one to the events page. */}
                    <Link href={kind === "upcoming" ? "/events" : `/events/replays#${w.id}`} className="no-underline" style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>
                      {kind === "upcoming" ? "save my seat →" : "watch →"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── your full personalised season guide (reused) ── */}
      <div id="season-guide" />
      <SeasonPersonalised />

      {/* ── human design × season (reused) ── */}
      <SeasonDesignInline />

      {/* ── this szn's meditation (reused) ── */}
      <SeasonMeditation sign={season.sign} />

      {/* ── TOOLKIT ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ ...eyebrow, color: "var(--pink)" }}>this szn&apos;s toolkit</div>
          <h2 style={{ ...sectionHead, color: "#3C2A70", marginBottom: 26 }}>everything to <span className="pk">use.</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {TOOLS.map((t) => (
              <Link key={t.t} href={t.href} className="no-underline flex flex-col" style={{ borderRadius: 14, background: "#fff", border: "2px solid var(--purple)", padding: 24, minHeight: 140, color: "#3C2A70" }}>
                <div style={{ fontSize: 22, marginBottom: 12 }}>{t.glyph}</div>
                <h3 style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{t.t}</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#3C2A70", opacity: 0.72 }}>{t.b}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── A QUESTION FROM BETTY (poll, reused logic) ── */}
      {activePoll && (
        <section className="px-5 md:px-8" style={{ background: "var(--pink)", color: "#fff", borderBottom: "var(--border)", paddingTop: 40, paddingBottom: 40 }}>
          <div className="max-w-6xl mx-auto">
            <div style={{ ...eyebrow, color: "#fff" }}>a question from betty</div>
            {pollSubmitted ? (
              <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800 }}>thank you, that&apos;s in. ✦</p>
            ) : (
              <>
                <h3 style={{ fontFamily: poppins, fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: 18, maxWidth: 640 }}>{activePoll.question}</h3>
                {activePoll.type === "choice" ? (
                  <div className="flex flex-wrap gap-2.5 mb-4">
                    {activePoll.options.map((opt) => (
                      <button key={opt} onClick={() => setPollDraft(opt)} style={{ fontFamily: poppins, cursor: "pointer", fontSize: 13, fontWeight: 800, textTransform: "lowercase", color: pollDraft === opt ? "var(--pink)" : "#fff", background: pollDraft === opt ? "#fff" : "transparent", border: "2px solid rgba(255,255,255,0.55)", borderRadius: 40, padding: "11px 20px" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea value={pollDraft} onChange={(e) => setPollDraft(e.target.value)} placeholder="type your answer..." rows={3} className="w-full" style={{ border: "none", outline: "none", padding: "12px 14px", fontSize: 14, marginBottom: 14, fontFamily: "inherit", resize: "vertical", maxWidth: 560, borderRadius: 10 }} />
                )}
                <div>
                  <button onClick={handlePollSubmit} disabled={!pollDraft.trim()} style={{ cursor: pollDraft.trim() ? "pointer" : "default", border: "none", background: "#fff", color: "var(--pink)", fontFamily: poppins, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 40, opacity: pollDraft.trim() ? 1 : 0.6 }}>
                    submit answer
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── THE COMMUNITY ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", color: "#fff", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ ...eyebrow, color: "var(--pink)" }}>the community</div>
          <h2 style={{ ...sectionHead, color: "#fff", marginBottom: 8 }}>the astro girls <span className="pk">support group.</span></h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 460, marginBottom: 22 }}>The women who actually wanna talk about this sh*t with you. Jump into a room.</p>
          <div className="flex flex-wrap gap-3">
            {ROOMS.map((r) => (
              <Link key={r.lab} href={r.href} className="no-underline inline-flex items-center gap-2.5" style={{ borderRadius: 40, border: "2px solid rgba(255,255,255,0.3)", padding: "13px 20px", color: "#fff", fontFamily: poppins, fontWeight: 800, fontSize: 14, textTransform: "lowercase" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pink)" }} />
                {r.lab}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEASON PROGRESS ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 44, paddingBottom: 44 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div style={{ ...eyebrow, color: "var(--pink)" }}>season progress</div>
            <h2 style={{ ...sectionHead, color: "#3C2A70", fontSize: "clamp(24px, 3.6vw, 38px)" }}>
              {sign} szn · week {seasonProgress.currentWeek} of {seasonProgress.totalWeeks}
            </h2>
            <div className="flex gap-1.5" style={{ marginTop: 16 }}>
              {Array.from({ length: seasonProgress.totalWeeks }).map((_, i) => (
                <span key={i} style={{ height: 12, flex: 1, borderRadius: 40, border: "2px solid var(--purple)", background: i < seasonProgress.currentWeek ? "var(--pink)" : "transparent", borderColor: i < seasonProgress.currentWeek ? "var(--pink)" : "var(--purple)" }} />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-8" style={{ color: "#3C2A70" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>now</div>
              <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700 }}>{season.themes[0]}</div>
            </div>
            {nextDated && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>next up</div>
                <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700 }}>{nextDated.title}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>revisit</div>
              <div style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700 }}>your replays</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE VAULT: missed something ── */}
      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 44, paddingBottom: 44 }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap" style={{ marginBottom: 22 }}>
            <div>
              <div style={{ ...eyebrow, color: "var(--grey)" }}>missed something?</div>
              <h2 style={{ ...sectionHead, fontSize: "clamp(22px, 3.4vw, 34px)" }}>the <span className="pk">vault.</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              { sym: "✦", t: "every season", b: "Past szns, all in one place.", href: "/seasons" },
              { sym: "▷", t: "workshop replays", b: "Every class, saved forever.", href: "/events" },
              { sym: "☾", t: "your wrapped", b: "Everything you've done this szn.", href: "/your-season/wrapped" },
            ].map((v) => (
              <Link key={v.t} href={v.href} className="no-underline" style={{ borderRadius: 14, border: "2px solid var(--dark)", overflow: "hidden", color: "var(--dark)" }}>
                <div style={{ height: 66, display: "grid", placeItems: "center", fontSize: 26, background: "linear-gradient(135deg, var(--lav-light), var(--pink-bg))" }}>{v.sym}</div>
                <div style={{ padding: "16px 18px" }}>
                  <h4 style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, textTransform: "lowercase", marginBottom: 3 }}>{v.t}</h4>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--grey)" }}>{v.b}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── customise: what she reads, moved to the foot ── */}
      <section className="px-5 md:px-8 py-4" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
        <div className="max-w-6xl mx-auto">
          <button onClick={() => setCustomizing((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)" }}>
            {customizing ? "done customising ✓" : "customise this dashboard ✎"}
          </button>
          {customizing && (
            <div className="flex flex-wrap gap-3 mt-4">
              {DASHBOARD_SECTIONS.map((s) => {
                const on = prefs ? prefs[s.id] : true;
                return (
                  <label key={s.id} title={s.desc} className="flex items-center gap-2" style={{ border: "1.5px solid " + (on ? "var(--pink)" : "#ddd"), padding: "8px 14px", cursor: "pointer", background: on ? "rgba(255,45,135,0.06)" : "#fff" }}>
                    <input type="checkbox" checked={on} onChange={() => handleToggleSection(s.id)} style={{ accentColor: "var(--pink)" }} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{s.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* signOverview is intentionally read to keep the season meta available for the next pass
          (element / modality / ruler chips + the archetype line go into the hero once finalised). */}
      <span hidden aria-hidden>{signOverview ? `${signOverview.element} ${rising?.desc ?? ""}` : ""}</span>
    </>
  );
}
