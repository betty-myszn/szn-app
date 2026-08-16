"use client";

import Link from "next/link";
import Image from "next/image";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess, hasBillingIssue } from "@/lib/membership-access";
import { useYourSzn } from "@/lib/use-your-szn";
import { useChart } from "@/lib/use-chart";
import { formatSeasonDates } from "@/lib/seasons";
import { useSeason } from "@/lib/use-season";
import { composeLifeArea } from "@/lib/life-areas";
import { SIGN_OVERVIEWS } from "@/lib/interpretations";
import { GOAL_CATEGORY_TO_LIFE_AREA } from "@/lib/goals-store";
import { RISING_VIBES } from "@/lib/style-data";
import { getTarotOfDay } from "@/lib/tarot";
import { useEffect, useState } from "react";
import { loadJournalEntries } from "@/lib/journal-store";
import { computeJournalStreak } from "@/lib/streaks";
import { loadGoals, getPrimaryGoal, type Goal } from "@/lib/goals-store";
import { loadChallengeProgress, computeChallengeStreak } from "@/lib/challenge-progress";
import { loadSignals, detectAvoidance, type AvoidancePattern } from "@/lib/signals";
import { loadDashboardPrefs, toggleDashboardSection, DASHBOARD_SECTIONS, type DashboardPrefs } from "@/lib/dashboard-preferences";
import { loadPolls, loadResponses, getActivePollFor, submitResponse, type Poll } from "@/lib/polls";
import Ticker from "@/components/Ticker";
import SeasonPersonalised from "@/components/SeasonPersonalised";
import SeasonExplore from "@/components/SeasonExplore";
import SeasonThemes from "@/components/SeasonThemes";
import LifeAreasGuide from "@/components/LifeAreasGuide";
import SeasonDesignInline from "@/components/SeasonDesignInline";
import SkyAlert from "@/components/SkyAlert";
import SeasonMeditation from "@/components/SeasonMeditation";
import UpcomingEvents from "@/components/UpcomingEvents";
import ReplayHighlight from "@/components/ReplayHighlight";
import PasswordPromptBanner from "@/components/PasswordPromptBanner";
import { isEclipseSeasonLive } from "@/lib/eclipse-season-gate";

// The member dashboard: the season HQ. A light pastel hero with the per-season cut-out, a scannable
// top band (today + cosmic weather + a "what do you need right now" router + a personalised "for
// you" block), then the rich reading components wired to real data, then the toolkit, community and
// the vault. The heavy reading sections in the middle are reused as-is for now and get restyled to
// match the new look next.

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Per-season hero cut-out. Only Leo has art so far; other seasons fall back to no image (the pastel
// card stands on its own) until their art exists.
function heroImageForSign(sign: string): string | null {
  return sign === "Leo" ? "/leo-lion.png" : null;
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
  const { member, ready } = useMember();
  const { data: szn } = useYourSzn();
  const { chart } = useChart();
  const season = useSeason();
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);
  const [primaryGoal, setPrimaryGoal] = useState<Goal | null | undefined>(undefined);
  const [challengeStreak, setChallengeStreak] = useState({ current: 0, longest: 0, activeToday: false });
  const [pattern, setPattern] = useState<AvoidancePattern | null>(null);
  const [prefs, setPrefs] = useState<DashboardPrefs | null>(null);
  const [customizing, setCustomizing] = useState(false);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [pollDraft, setPollDraft] = useState("");
  const [pollSubmitted, setPollSubmitted] = useState(false);

  useEffect(() => {
    setStreak(computeJournalStreak(loadJournalEntries()));
    setPrimaryGoal(getPrimaryGoal());
    setChallengeStreak(computeChallengeStreak(loadChallengeProgress()));
    const patterns = detectAvoidance(loadGoals(), loadSignals(), season.sign);
    setPattern(patterns[0] || null);
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

  if (!ready) return null;

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

  const rising = RISING_VIBES[member.placements.rising];
  const signOverview = SIGN_OVERVIEWS[season.sign];
  const tarot = getTarotOfDay(member.email || member.name);
  const goalReading =
    primaryGoal && chart ? composeLifeArea(GOAL_CATEGORY_TO_LIFE_AREA[primaryGoal.category], chart, season, primaryGoal) : null;
  const sign = season.sign.toLowerCase();
  const heroImg = heroImageForSign(season.sign);
  const oneMove =
    szn?.manifestationMission?.actionStep ||
    szn?.journalPrompts?.[0]?.prompt ||
    "Do the one brave thing you keep talking yourself out of.";

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
      <Ticker
        variant="lav"
        items={[
          `it's ${sign} szn, baby`,
          "live the dreaaam",
          "wear the outfit",
          "say yaaaaas",
          "post the video",
          "take up space",
        ]}
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
                {[
                  { l: "sun", s: member.placements.sun },
                  { l: "moon", s: member.placements.moon },
                  { l: "rising", s: member.placements.rising },
                ].map((p) => (
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
      <SkyAlert />

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

      {/* ── FOR YOU, RIGHT NOW: goal + pattern + goal astrology ── */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink-bg)", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="max-w-6xl mx-auto">
          <div style={eyebrow}>for you, right now</div>
          <h2 style={{ ...sectionHead, marginBottom: 26 }}>what your szn is <span className="pk">asking of you.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ borderRadius: 22, background: "#fff", border: "2px solid var(--pink)", padding: 30 }}>
              <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--grey)", marginBottom: 12 }}>your goal this szn</div>
              {primaryGoal ? (
                <>
                  <h3 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 16 }}>{primaryGoal.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6, marginBottom: 18 }}>
                    {szn?.manifestationMission ? `This szn's move: ${szn.manifestationMission.actionStep}` : `${season.sign} season is backing this one. Front-load the brave moves.`}
                  </p>
                  <Link href="/goals" className="no-underline" style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>open my goals →</Link>
                </>
              ) : (
                <>
                  <h3 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>name what you&apos;re calling in.</h3>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6, marginBottom: 18 }}>Set a goal and your whole portal starts personalising around it.</p>
                  <Link href="/goals" className="no-underline" style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>set my goal →</Link>
                </>
              )}
            </div>
            <div style={{ borderRadius: 22, background: "var(--dark)", color: "#fff", padding: 30 }}>
              <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>the pattern i&apos;m noticing</div>
              {pattern && pattern.severity !== "active" ? (
                <>
                  <p style={{ fontFamily: poppins, fontSize: 16, fontWeight: 700, lineHeight: 1.5, letterSpacing: "-0.2px", margin: "0 0 18px" }}>
                    {pattern.severity === "avoiding"
                      ? `You said "${pattern.goal.title}" mattered. It's been ${pattern.daysSinceLastSignal} days since anything moved on it. That's the pattern showing you exactly where you're avoiding yourself.`
                      : `"${pattern.goal.title}" has gone quiet, ${pattern.daysSinceLastSignal} days since you last moved on it. Just a nudge before it becomes a crisis.`}
                  </p>
                  <Link href="/goals" className="no-underline" style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff" }}>do something about it →</Link>
                </>
              ) : (
                <p style={{ fontFamily: poppins, fontSize: 16, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
                  Nothing&apos;s slipping right now. Keep the evidence stacking up, {member.name.toLowerCase()}.
                </p>
              )}
            </div>
          </div>
          {goalReading && primaryGoal && (
            <div style={{ marginTop: 16, borderRadius: 22, background: "var(--lav-light)", border: "2px solid var(--purple)", padding: "26px 30px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 8 }}>the astrology behind &ldquo;{primaryGoal.title}&rdquo;</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#3C2A70", maxWidth: 640 }}>{goalReading.inYourChart}</p>
              </div>
              <Link href={`/your-season/life/${goalReading.id}`} className="no-underline" style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3C2A70", whiteSpace: "nowrap" }}>go deeper on {goalReading.label} →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── HAPPENING: live workshops (reused, real data + countdown) ── */}
      <UpcomingEvents />

      {/* ── the season's four themes ── */}
      <SeasonThemes season={season} />

      {/* ── newest replay spotlight (self-hides until one exists) ── */}
      <ReplayHighlight />

      {/* ── your leo szn, area by area (reused) ── */}
      <LifeAreasGuide season={season} chart={chart} goal={primaryGoal ?? null} />

      {/* ── human design × season (reused) ── */}
      <SeasonDesignInline />

      {/* ── your full personalised season guide (reused) ── */}
      <div id="season-guide" />
      <SeasonPersonalised />

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

      {/* ── explore further / the vault (reused) ── */}
      <SeasonExplore season={season} />

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
