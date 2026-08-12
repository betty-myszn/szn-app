"use client";

import Link from "next/link";
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
import { isEightEightLive } from "@/lib/eight-eight-gate";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const cardTitle: React.CSSProperties = {
  fontFamily: poppins,
  fontSize: 19,
  fontWeight: 800,
  letterSpacing: "-0.5px",
  marginBottom: 10,
};

function SectionTag({ children }: { children: React.ReactNode }) {
  return <div className="tag mb-2">{children}</div>;
}

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
    // season.sign is derived from the current date, not user state, safe to read once on mount
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
              : "This is where your membership lives, live workshops, your full chart portal, shadow work, the community. Join to unlock it."}
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

  return (
    <>
      <PasswordPromptBanner />
      <Ticker
        variant="lav"
        items={[
          `it's ${season.sign.toLowerCase()} szn, baby`,
          "live the dreaaam",
          "wear the outfit",
          "say yaaaaas",
          "post the video",
          "take up space",
        ]}
      />
      {/* Header */}
      <section className="px-5 md:px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)", position: "relative", overflow: "hidden" }}>
        <div className="max-w-6xl mx-auto" style={{ position: "relative" }}>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <div className="tag" style={{ marginBottom: 0 }}>{season.sign.toLowerCase()} szn · {formatSeasonDates(season)}</div>
            {streak && streak.current > 0 && (
              <Link
                href="/journal"
                className="no-underline flex items-center gap-2"
                style={{ border: "1.5px solid var(--pink)", padding: "6px 14px", background: "rgba(255,45,135,0.1)" }}
              >
                <span style={{ fontSize: 15 }}>🔥</span>
                <span style={{ fontFamily: poppins, fontSize: 13, fontWeight: 800, color: "var(--pink)" }}>
                  {streak.current} day{streak.current === 1 ? "" : "s"} streak
                </span>
              </Link>
            )}
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 10,
            }}
          >
            morning, {member.name.toLowerCase()}.<br />
            <span className="pk">{season.tagline}</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 560, lineHeight: 1.7 }}>
            {season.focus}
          </p>
        </div>
      </section>

      {/* 8/8 Lion's Gate money portal: a timed drop that self-hides after the 11th (LA time) via
          isEightEightLive(). Sits directly under the header so it's the first thing every member
          sees during the portal window. */}
      {isEightEightLive() && (
        <section className="px-5 md:px-8 py-8" style={{ background: "var(--gold)", borderBottom: "var(--border)" }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lion-gate-888.png" alt="" width={92} height={92} style={{ flex: "none", filter: "drop-shadow(0 6px 16px rgba(0,0,0,.25))" }} />
              <div>
                <div className="tag mb-2">new · 8/8 lion&apos;s gate</div>
                <h2 style={{ fontFamily: poppins, fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.15 }}>
                  your 8/8 money portal is open.
                </h2>
                <p style={{ fontSize: 13.5, color: "#1a1a1a", opacity: 0.8, marginTop: 6, maxWidth: 520, lineHeight: 1.6 }}>
                  your venus, jupiter and money houses, read for the lion&apos;s gate, with two exercises and your money mantras. here until the 11th.
                </p>
              </div>
            </div>
            <Link href="/your-season/8-8-money" className="btn-pink" style={{ whiteSpace: "nowrap" }}>open my 8/8 guide →</Link>
          </div>
        </section>
      )}

      {/* Unmissable: what this season actually is, the sign itself, not just the label */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--pink)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <div style={{ fontSize: 56, marginBottom: 12 }}>{season.symbol}</div>
          <div className="tag mb-3" style={{ color: "#fff" }}>{formatSeasonDates(season)}</div>
          <h2
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5.5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            it&apos;s {season.sign.toLowerCase()} season.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", lineHeight: 1.85, maxWidth: 680, margin: "0 auto 20px" }}>
            {season.description}
          </p>
          {signOverview && (
            <>
              <div className="flex items-center justify-center gap-2 flex-wrap mb-16" style={{ marginBottom: 20 }}>
                {[`${signOverview.element} element`, `${signOverview.modality} modality`, `ruled by ${signOverview.ruler}`].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      background: "rgba(255,255,255,0.18)", color: "#fff", padding: "6px 14px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.85, maxWidth: 680, margin: "0 auto" }}>
                {signOverview.archetype}
              </p>
            </>
          )}
        </div>
      </section>

      {/* This szn's four themes, straight after the season hero. It's the shortest summary of what
          the szn is about for her and every tile is a way into her personalised read, so it sits
          with the orientation blocks. It used to open SeasonExplore at the very bottom of the page,
          below the action rows and the what's-happening hub, where almost nobody reached it. */}
      <SeasonThemes season={season} />

      {/* The newest workshop replay, showcased right up top for its first few days, then softened
          into a standing banner into the vault. Renders nothing until a replay exists. */}
      <ReplayHighlight />

      {/* The actual "how this szn hits every part of your life" guide, pinned right at the top,
          this is the section she came here for, not something to bury under the daily stuff. */}
      {/* Eclipses, nodal axis shifts, Mercury retrograde, fetched fresh every load so this is
          always accurate to today's actual date, not a static seasonal blurb. */}
      <SkyAlert />

      {/* Live workshops with a ticking countdown, an action section so it isn't behind a
          customize toggle, a class she's paid for shouldn't be possible to hide by accident. */}
      <UpcomingEvents />

      <LifeAreasGuide season={season} chart={chart} goal={primaryGoal ?? null} />

      {/* Human Design x season, rendered inline as part of the season scroll: the
          personalised companion to the life-areas guide above. Astrology says what the
          season is doing, this says how her unique energy works with it. */}
      <SeasonDesignInline />

      {/* This season's meditation, for every member. Sits after the season reading so she has the
          context before the practice, and renders nothing at all for a season with no audio yet. */}
      <SeasonMeditation sign={season.sign} />

      {/* Build-your-own-dashboard control, only touches what she reads, never the action sections */}
      <section className="px-5 md:px-8 py-4" style={{ borderBottom: "var(--border)", background: "#fafafa" }}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setCustomizing((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--grey-light)",
            }}
          >
            {customizing ? "done customising ✓" : "customise this dashboard ✎"}
          </button>
          {customizing && (
            <div className="flex flex-wrap gap-3 mt-4">
              {DASHBOARD_SECTIONS.map((s) => {
                const on = prefs ? prefs[s.id] : true;
                return (
                  <label
                    key={s.id}
                    title={s.desc}
                    className="flex items-center gap-2"
                    style={{ border: "1.5px solid " + (on ? "var(--pink)" : "#ddd"), padding: "8px 14px", cursor: "pointer", background: on ? "rgba(255,45,135,0.06)" : "#fff" }}
                  >
                    <input type="checkbox" checked={on} onChange={() => handleToggleSection(s.id)} style={{ accentColor: "var(--pink)" }} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{s.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Poll or question from the team, self-hiding once answered or when nothing's active */}
      {activePoll && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-6xl mx-auto p-8" style={{ border: "1.5px solid var(--pink)", background: "rgba(255,45,135,0.06)" }}>
            <div className="tag mb-3" style={{ color: "var(--pink)" }}>a question from the team</div>
            {pollSubmitted ? (
              <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px", color: "var(--dark)" }}>
                thank you, that&apos;s in. ✦
              </p>
            ) : (
              <>
                <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.4, color: "var(--dark)", marginBottom: 18, maxWidth: 640 }}>
                  {activePoll.question}
                </p>
                {activePoll.type === "choice" ? (
                  <div className="flex flex-col gap-2 mb-4" style={{ maxWidth: 420 }}>
                    {activePoll.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-3"
                        style={{ border: "1.5px solid " + (pollDraft === opt ? "var(--pink)" : "#ddd"), padding: "10px 14px", cursor: "pointer", background: pollDraft === opt ? "rgba(255,45,135,0.08)" : "#fff" }}
                      >
                        <input type="radio" name="poll-choice" checked={pollDraft === opt} onChange={() => setPollDraft(opt)} style={{ accentColor: "var(--pink)" }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={pollDraft}
                    onChange={(e) => setPollDraft(e.target.value)}
                    placeholder="type your answer..."
                    rows={3}
                    className="w-full"
                    style={{ border: "var(--border)", outline: "none", padding: "12px 14px", fontSize: 14, marginBottom: 14, fontFamily: "inherit", resize: "vertical", maxWidth: 560 }}
                  />
                )}
                <button onClick={handlePollSubmit} disabled={!pollDraft.trim()} className="btn-pink" style={{ cursor: pollDraft.trim() ? "pointer" : "default", border: "none", opacity: pollDraft.trim() ? 1 : 0.5 }}>
                  submit answer
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* Tarot card of the day */}
      {(prefs?.tarot ?? true) && (
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-[auto_1fr] gap-0" style={{ border: "var(--border)" }}>
          <div
            className="p-8 flex flex-col items-center justify-center text-center"
            style={{ background: "var(--dark)", borderRight: "var(--border)", minWidth: 200 }}
          >
            <div className="tag mb-4" style={{ color: "var(--lav)" }}>your card today</div>
            <div
              className="flex items-center justify-center"
              style={{ width: 92, height: 132, border: "1.5px solid var(--pink)", marginBottom: 14 }}
            >
              <span style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, color: "var(--pink)" }}>{tarot.glyph}</span>
            </div>
            <div style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
              {tarot.name}
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center" style={{ background: "var(--pink-bg)" }}>
            <div className="tag mb-3">{tarot.keyword}</div>
            <p style={{ fontFamily: poppins, fontSize: "clamp(18px, 2.6vw, 24px)", fontWeight: 700, letterSpacing: "-0.4px", lineHeight: 1.4, color: "var(--dark)" }}>
              {tarot.message}
            </p>
            <p style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 16, letterSpacing: "0.02em" }}>
              A new card is drawn for you every day, pulled just for {member.name.toLowerCase()}.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* Today's snapshot grid */}
      {(prefs?.snapshot ?? true) && (
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
          {/* Daily affirmation */}
          <div className="p-7" style={{ background: "var(--pink)", borderRight: "var(--border)" }}>
            <SectionTag>
              <span style={{ color: "#fff" }}>today&apos;s affirmation</span>
            </SectionTag>
            <p
              style={{
                fontFamily: poppins,
                fontSize: 21,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.3,
                color: "#fff",
                marginBottom: 18,
              }}
            >
              &ldquo;{season.affirmation}&rdquo;
            </p>
            <Link
              href="/affirmations"
              className="no-underline"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#fff",
                borderBottom: "1.5px solid #fff",
                paddingBottom: 2,
              }}
            >
              more affirmations →
            </Link>
          </div>

          {/* Cosmic weather, live transit theme when a real chart is saved */}
          <div className="p-7" style={{ borderRight: "var(--border)" }}>
            <SectionTag>cosmic weather {szn ? `· ${szn.transits.moonPhase.emoji} ${szn.transits.moonPhase.phase.toLowerCase()}` : ""}</SectionTag>
            <h2 style={cardTitle}>
              {szn ? szn.theme.title.toLowerCase() : `the sun is lighting up your ${member.placements.sun === season.sign ? "sun sign" : "chart"}`}
            </h2>
            <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 16 }}>
              {szn
                ? szn.theme.description
                : member.placements.sun === season.sign
                ? `It's your solar return szn, ${member.name.toLowerCase()}. The spotlight is literally yours this month, visibility comes easier, confidence hits harder, and the universe is co-signing your glow-up.`
                : `${season.sign} season is activating the part of your chart that rules ${season.themes[0]}. Work with it, not against it.`}
            </p>
            <a
              href="#season-guide"
              className="no-underline"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--pink)",
                borderBottom: "1.5px solid var(--pink)",
                paddingBottom: 2,
              }}
            >
              see your full season guide ↓
            </a>
          </div>

          {/* Big 3 */}
          <div className="p-7" style={{ background: "var(--lav-light)" }}>
            <SectionTag>your codes</SectionTag>
            <div className="flex flex-col gap-3">
              {[
                { label: "sun", sign: member.placements.sun },
                { label: "moon", sign: member.placements.moon },
                { label: "rising", sign: member.placements.rising },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between" style={{ borderBottom: "1px solid rgba(26,26,26,0.15)", paddingBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3C2A70" }}>
                    {p.label}
                  </span>
                  <span style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700 }}>{p.sign.toLowerCase()}</span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: "#3C2A70", lineHeight: 1.6 }}>
                {member.placements.rising.toLowerCase()} rising: {rising?.desc}.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* The astrology behind her actual goal, additive to cosmic weather above, not a replacement,
          reads differently depending on what she's calling in rather than cycling generically. */}
      {(prefs?.goalAstrology ?? true) && goalReading && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-6xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
            <div className="tag mb-3">the astrology behind &ldquo;{primaryGoal!.title}&rdquo;</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70", marginBottom: goalReading.goalTieIn ? 16 : 0, maxWidth: 680 }}>
              {goalReading.inYourChart}
            </p>
            {goalReading.goalTieIn && (
              <p style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px", lineHeight: 1.6, color: "#3C2A70", marginBottom: 16, maxWidth: 680 }}>
                {goalReading.goalTieIn}
              </p>
            )}
            <Link
              href={`/your-season/life/${goalReading.id}`}
              className="no-underline"
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3C2A70", borderBottom: "1.5px solid #3C2A70", paddingBottom: 2 }}
            >
              go deeper on {goalReading.label} →
            </Link>
          </div>
        </section>
      )}

      {/* The pattern MY SZN is actually noticing, read from what she's done, not just her chart */}
      {pattern && pattern.severity !== "active" && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-6xl mx-auto p-8" style={{ border: "var(--border)", background: pattern.severity === "avoiding" ? "var(--dark)" : "var(--gold)" }}>
            <div className="tag mb-3" style={pattern.severity === "avoiding" ? { color: "var(--pink)" } : { color: "#854F0B" }}>
              the pattern I&apos;m noticing
            </div>
            <p
              style={{
                fontFamily: poppins,
                fontSize: "clamp(18px, 2.4vw, 23px)",
                fontWeight: 700,
                letterSpacing: "-0.4px",
                lineHeight: 1.45,
                color: pattern.severity === "avoiding" ? "#fff" : "#854F0B",
                marginBottom: 16,
                maxWidth: 680,
              }}
            >
              {pattern.severity === "avoiding"
                ? `You said "${pattern.goal.title}" mattered.${pattern.availableThisSeason > 0 ? ` ${pattern.availableThisSeason} ${pattern.goal.category} challenge${pattern.availableThisSeason === 1 ? "" : "s"} ${pattern.availableThisSeason === 1 ? "is" : "are"} sitting there this szn, and` : ""} It's been ${pattern.daysSinceLastSignal} days since anything actually moved on it. That's not a coincidence, that's the pattern showing you exactly where you're avoiding yourself.`
                : `"${pattern.goal.title}" has gone quiet, ${pattern.daysSinceLastSignal} days since you last moved on it. Not a crisis, just a nudge before it becomes one.`}
            </p>
            <Link
              href="/goals"
              className="no-underline"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: pattern.severity === "avoiding" ? "#fff" : "#854F0B",
                borderBottom: `1.5px solid ${pattern.severity === "avoiding" ? "#fff" : "#854F0B"}`,
                paddingBottom: 2,
              }}
            >
              do something about it →
            </Link>
          </div>
        </section>
      )}
      {pattern && pattern.severity === "active" && pattern.completedThisSeason > 0 && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-6xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--mint)" }}>
            <div className="tag mb-3" style={{ color: "#0F6E56" }}>the evidence is stacking up</div>
            <p style={{ fontFamily: poppins, fontSize: "clamp(18px, 2.4vw, 23px)", fontWeight: 700, letterSpacing: "-0.4px", lineHeight: 1.45, color: "#0F6E56", maxWidth: 680 }}>
              {`“${pattern.goal.title}” is actually moving, ${pattern.completedThisSeason} ${pattern.goal.category} challenge${pattern.completedThisSeason === 1 ? "" : "s"} done this szn. That's proof, not luck.`}
            </p>
          </div>
        </section>
      )}

      {/* Continue exploring your chart */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_auto] gap-6 items-center p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <div>
            <div className="tag mb-2">continue exploring your chart</div>
            <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 8 }}>
              your {member.placements.venus.toLowerCase()} venus is waiting to be read.
            </h2>
            <p style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7, maxWidth: 560 }}>
              17 placements, 12 houses and every aspect between them, your full blueprint is inside, translated into real life. Pick up where you left off.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/my-chart/venus" className="btn-pink" style={{ textAlign: "center" }}>read my venus</Link>
            <Link
              href="/my-chart"
              className="no-underline"
              style={{ textAlign: "center", border: "var(--border)", padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)" }}
            >
              open my chart
            </Link>
          </div>
        </div>
      </section>

      {/* This szn's full personalised guide, formerly its own /your-season page, now living
          here so "my szn" and "this szn" are one continuous scroll instead of two destinations. */}
      <div id="season-guide" />
      <SeasonPersonalised />

      {/* Recommended for you */}
      {(prefs?.recommended ?? true) && (
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-4">recommended for you right now</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            <Link href="/my-chart/main-character" className="no-underline p-7 hover:opacity-90 transition-opacity" style={{ background: "var(--dark)", borderRight: "var(--border)", color: "#fff" }}>
              <div className="tag mb-2" style={{ color: "var(--lav)" }}>because it&apos;s {season.sign.toLowerCase()} szn</div>
              <h3 style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 8 }}>
                main character energy
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                Your personal magnetism manual, how your chart says you&apos;re designed to stand out.
              </p>
            </Link>
            <Link href="/your-season/community" className="no-underline p-7 hover:bg-[#fafafa] transition-colors" style={{ borderRight: "var(--border)", color: "var(--dark)" }}>
              <div className="tag mb-2">the community</div>
              <h3 style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 8 }}>
                the {season.sign.toLowerCase()} szn room
              </h3>
              <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7 }}>
                This szn&apos;s chat, polls and how far everyone else is getting.
              </p>
            </Link>
            <Link href="/challenges" className="no-underline p-7 hover:opacity-90 transition-opacity" style={{ background: "var(--pink)", color: "var(--dark)" }}>
              <div className="tag mb-2" style={{ color: "var(--dark)" }}>collect the proof</div>
              <h3 style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 8 }}>
                seasonal challenges
              </h3>
              <p style={{ fontSize: 13, color: "rgba(26,26,26,0.75)", lineHeight: 1.7 }}>
                {challengeStreak.current > 0
                  ? `${challengeStreak.current} day streak. keep the evidence coming.`
                  : "personalised missions, xp, badges and a streak worth protecting."}
              </p>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Action row */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-4">your work this szn</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            <Link href="/journal" className="no-underline p-7 hover:bg-[#fafafa] transition-colors" style={{ borderRight: "var(--border)", color: "var(--dark)" }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>☾</div>
              <h3 style={cardTitle}>shadow work</h3>
              <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7 }}>
                {szn?.journalPrompts?.[0]
                  ? `Today's prompt, from your ${szn.journalPrompts[0].relatedPlacement.toLowerCase()}: “${szn.journalPrompts[0].prompt}”`
                  : `Today's prompt is live. ${season.sign} season wants you to look at what you've been avoiding about being seen.`}
              </p>
            </Link>
            <Link
              href="/goals"
              className="no-underline p-7 hover:opacity-90 transition-opacity"
              style={{ borderRight: "var(--border)", background: primaryGoal ? "var(--pink)" : undefined, color: primaryGoal ? "#fff" : "var(--dark)" }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>✦</div>
              {primaryGoal ? (
                <>
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      background: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      padding: "3px 9px",
                      marginBottom: 8,
                    }}
                  >
                    your {primaryGoal.category} goal
                  </div>
                  <h3 style={{ ...cardTitle, color: "#fff" }}>{primaryGoal.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
                    {szn?.manifestationMission
                      ? `This szn's move: ${szn.manifestationMission.actionStep}`
                      : `${season.sign} season is backing this one, front-load the brave moves.`}
                  </p>
                </>
              ) : (
                <>
                  <h3 style={cardTitle}>your goals</h3>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7 }}>
                    You haven&apos;t set a goal yet. Name what you&apos;re calling in and your whole portal starts personalising around it.
                  </p>
                </>
              )}
            </Link>
            <Link href="/style" className="no-underline p-7 hover:bg-[#fafafa] transition-colors" style={{ color: "var(--dark)" }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>♀</div>
              <h3 style={cardTitle}>dress the part</h3>
              <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7 }}>
                Your venus in {member.placements.venus.toLowerCase()} style codes, how to dress like the woman you&apos;re becoming.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* What's happening hub */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-4">what&apos;s happening right now</div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
            <Link
              href="/community"
              className="no-underline p-6 hover:opacity-90 transition-opacity"
              style={{ borderRight: "var(--border)", background: "var(--pink)", color: "var(--dark)" }}
            >
              <div className="tag mb-2" style={{ color: "rgba(26,26,26,0.7)" }}>community · live</div>
              <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginBottom: 6 }}>
                see what everyone&apos;s posting this szn.
              </p>
              <p style={{ fontSize: 12, color: "rgba(26,26,26,0.7)", lineHeight: 1.6 }}>join the conversation in your spaces.</p>
            </Link>
            <Link
              href="/events"
              className="no-underline p-6 hover:opacity-90 transition-opacity"
              style={{ borderRight: "var(--border)", background: "var(--gold)", color: "#854F0B" }}
            >
              <div className="tag mb-2" style={{ color: "#854F0B" }}>events · this szn</div>
              <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginBottom: 6, color: "#854F0B" }}>
                your first live class lands 3 august.
              </p>
              <p style={{ fontSize: 12, color: "#854F0B", opacity: 0.8, lineHeight: 1.6 }}>Enter Your Main Character Era. Save your seat.</p>
            </Link>
            <Link
              href="/your-season/wrapped"
              className="no-underline p-6 hover:opacity-90 transition-opacity"
              style={{ background: "var(--lav-light)", color: "#3C2A70" }}
            >
              <div className="tag mb-2" style={{ color: "#3C2A70" }}>your receipts · updated</div>
              <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginBottom: 6, color: "#3C2A70" }}>
                see everything you&apos;ve actually done this szn.
              </p>
              <p style={{ fontSize: 12, color: "#3C2A70", opacity: 0.8, lineHeight: 1.6 }}>Wrapped up, no scrolling required.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* The "next live event" card that used to sit beside this is gone: UpcomingEvents at the
          top of the page covers it now, off the shared WORKSHOPS list and with a live countdown,
          rather than a second copy of the same class with its date and title hardcoded here. */}
      <section className="px-5 md:px-8 py-10">
        <div className="max-w-6xl mx-auto" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ background: "var(--lav-light)" }}>
            <div className="tag mb-3">community</div>
            <h3 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>
              the girls are talking.
            </h3>
            <p style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7, marginBottom: 20 }}>
              Share your wins, ask your questions, find your people. Your szn is better together.
            </p>
            <Link
              href="/community"
              className="no-underline"
              style={{
                display: "inline-block",
                border: "var(--border)",
                padding: "12px 24px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--dark)",
              }}
            >
              join the conversation
            </Link>
          </div>
        </div>
      </section>

      {/* Explore further: themes, every life area, community, wrapped, next szn teaser */}
      <SeasonExplore season={season} />
    </>
  );
}
