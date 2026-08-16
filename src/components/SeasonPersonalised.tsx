"use client";

import { useState } from "react";
import Link from "next/link";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { HOUSE_MEANINGS, SIGN_TRAITS, ordinalHouse, houseForSign, composeRulerPlacement } from "@/lib/interpretations";
import { LIFE_AREAS } from "@/lib/life-areas";
import {
  getPatternBreaking,
  whyPatternFormed,
  getFutureSelfPortrait,
  getFutureSelfLetter,
  SIGNS_ON_THE_RIGHT_PATH,
  EXPERIMENTS,
  pickRecommendedExperiment,
} from "@/lib/season-coaching";
import { addJournalEntry } from "@/lib/journal-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// One personalised mission per activated house
const HOUSE_MISSIONS: Record<number, string> = {
  1: "Debut the new you, change the profile photo, wear the look, introduce yourself the way the next version of you would.",
  2: "Raise one price, or finally charge for the thing you've been giving away. Your worth sets the number.",
  3: "Post the idea you've been sitting on. One honest piece of content, this week, unedited by fear.",
  4: "Redesign one corner of your home until it feels like your future self lives there, then let yourself rest in it.",
  5: "Make the thing. Post the reel, share the art, flirt with life, one visible act of play per week, minimum.",
  6: "Build the routine you keep postponing. Thirty days of one keystone habit, this szn is your accountability partner.",
  7: "Have the conversation you've been avoiding, the ask, the boundary, the declaration. Relationships level up when you do.",
  8: "Ask for the investment, merge the resources, or finally let someone see the unpolished you. Depth is the move.",
  9: "Book the trip, enrol in the course, or pitch the bigger stage. Your world is meant to expand this szn.",
  10: "Apply for the thing that feels one size too big, the feature, the promotion, the stage. Visibility is your assignment.",
  11: "Show up in community like you belong there, post in the group, host the thing, connect two people who need each other.",
  12: "Protect one sacred hour a day for rest and intuition. Your breakthrough this szn comes from stillness, not hustle.",
};

// Finds the life-area page that best matches an activated house, primary house match first,
// then any match, so "your theme this szn" always lands somewhere genuinely relevant.
function findLifeAreaForHouse(house: number): string | null {
  const primary = LIFE_AREAS.find((a) => a.houseNumbers[0] === house);
  if (primary) return primary.id;
  const any = LIFE_AREAS.find((a) => a.houseNumbers.includes(house));
  return any ? any.id : null;
}

export default function SeasonPersonalised() {
  const { chart, loading } = useChart();
  const season = useSeason();
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [experimentReflection, setExperimentReflection] = useState("");
  const [experimentSaved, setExperimentSaved] = useState(false);

  if (loading) return null;

  if (!chart) {
    return (
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto p-8 text-center" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 10 }}>
            unlock your personalised {season.sign.toLowerCase()} szn guide.
          </h2>
          <p style={{ fontSize: 14, color: "#3C2A70", lineHeight: 1.8, maxWidth: 480, margin: "0 auto 20px" }}>
            Add your birth details and this page transforms, where the szn lands in your chart, your opportunities, your challenges and your main character mission.
          </p>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  const cusps = chart.houses.map((h) => h.longitude);
  const activatedHouse = houseForSign(season.sign, cusps);
  const houseMeaning = HOUSE_MEANINGS[activatedHouse - 1];
  const seasonTraits = SIGN_TRAITS[season.sign];
  const houseHref = `/my-chart/house/${activatedHouse}`;
  const themeLifeAreaId = findLifeAreaForHouse(activatedHouse);
  const themeHref = themeLifeAreaId ? `/your-season/life/${themeLifeAreaId}` : houseHref;
  const activatedCuspSign = chart.houses[activatedHouse - 1]?.sign || houseMeaning.naturalSign;
  const activatedRuler = composeRulerPlacement(activatedCuspSign, activatedHouse, chart);
  const activatedTenants = chart.planets.filter((p) => p.house === activatedHouse);
  const name = chart.birthData.name || "babe";
  const risingSign = chart.houses[0]?.sign || "";
  const sunSign = chart.planets.find((p) => p.id === "sun")?.sign || "";

  const pattern = getPatternBreaking(season.sign);
  const patternWhy = whyPatternFormed(season.sign, name);
  const futureSelf = getFutureSelfPortrait(season.sign);
  const futureSelfLetter = getFutureSelfLetter(season.sign, name);
  const recommendedExperiment = pickRecommendedExperiment(season);

  const currentExperiment = EXPERIMENTS.find((e) => e.id === activeExperiment) || null;

  const saveExperimentReflection = () => {
    if (!currentExperiment || !experimentReflection.trim()) return;
    addJournalEntry({
      type: "experiment",
      prompt: `${currentExperiment.label}: ${currentExperiment.action}`,
      content: experimentReflection.trim(),
      season: season.sign,
    });
    setExperimentReflection("");
    setExperimentSaved(true);
    setTimeout(() => setExperimentSaved(false), 2000);
  };

  return (
    <>
      {/* Where the season falls */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">welcome to your personalised {season.sign.toLowerCase()} szn guide, {name.toLowerCase()}</div>
          <div className="grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            <Link
              href={houseHref}
              className="no-underline block p-8 hover:opacity-90 transition-opacity"
              style={{ background: "var(--pink)", borderRight: "var(--border)" }}
            >
              <div className="tag mb-3" style={{ color: "#fff" }}>where {season.sign.toLowerCase()} falls in your chart</div>
              <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-0.7px", lineHeight: 1.2, color: "#fff", marginBottom: 12 }}>
                {season.sign.toLowerCase()} activates your {ordinalHouse(activatedHouse)} house of {houseMeaning.title}.
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: 16 }}>
                While everyone else gets generic {season.sign.toLowerCase()} szn advice, yours is specific: this energy is lighting up {houseMeaning.rules}. That makes this an incredible szn for {houseMeaning.lifeAreas.slice(0, 3).join(", ")}.
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", borderBottom: "1.5px solid #fff", paddingBottom: 2 }}>
                see your full {ordinalHouse(activatedHouse)} house breakdown →
              </span>
            </Link>
            <Link href={themeHref} className="no-underline block p-8 hover:bg-[#fafafa] transition-colors">
              <div className="tag mb-3">your theme this szn</div>
              <h3 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 10, color: "var(--dark)" }}>
                {seasonTraits.flavour[0]} energy, aimed at your {houseMeaning.lifeAreas[0]}.
              </h3>
              <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, marginBottom: 16 }}>
                {houseMeaning.coach} This szn hands you {seasonTraits.gift}, pointed directly at that arena.
                {sunSign === season.sign ? " And it's your solar return szn, your personal new year. The glow-up is scheduled." : ""}
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", borderBottom: "1.5px solid var(--pink)", paddingBottom: 2 }}>
                get your full {houseMeaning.lifeAreas[0]} protocol →
              </span>
            </Link>
          </div>
          {activatedRuler && (
            <div style={{ border: "var(--border)", borderTop: "none" }}>
              <div className="p-8">
                <div className="tag mb-3">how this szn reaches you</div>
                <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)" }}>
                  <strong>{season.sign} season</strong> activates your <strong>{ordinalHouse(activatedHouse)} house</strong> of {houseMeaning.title}. That house begins in <strong>{activatedCuspSign.toLowerCase()}</strong>, so <strong>{activatedRuler.rulerName}</strong> rules it. {activatedRuler.rulerName} sits in <strong>{activatedRuler.rulerSign.toLowerCase()}</strong> in your <strong>{ordinalHouse(activatedRuler.rulerHouse)} house</strong>{activatedRuler.rulerHouse === activatedHouse ? ", right where it governs" : ""}, which is exactly what this szn is asking you to work with.
                  {activatedTenants.length > 0
                    ? ` ${activatedTenants.map((p) => p.name).join(" and ")} also ${activatedTenants.length === 1 ? "lives" : "live"} inside this house, adding to the picture, but ${activatedTenants.length === 1 ? "it isn't" : "they aren't"} the ruler.`
                    : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Betty's Take */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto p-8" style={{ background: "var(--dark)" }}>
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>betty&apos;s take</div>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>
            {`${name}, I've coached a lot of women through a ${season.sign.toLowerCase()} szn, and the ones who get the most out of it aren't the ones who read the most about it, they're the ones who actually do something uncomfortable with it. Your ${ordinalHouse(activatedHouse)} house is lit up right now, which means ${houseMeaning.lifeAreas[0]} is the arena the universe picked for you this time, not somewhere safer. Don't redirect the energy somewhere more comfortable. Point it exactly where it's already pointing.`}
          </p>
        </div>
      </section>

      {/* The Pattern You're Breaking */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-5">the pattern you&apos;re breaking this szn</div>
          <Link href="/your-season/pattern" className="no-underline grid md:grid-cols-2 gap-0 block" style={{ border: "var(--border)" }}>
            <div className="p-8 hover:opacity-90 transition-opacity" style={{ background: "var(--pink)", borderRight: "var(--border)" }}>
              <div className="tag mb-3" style={{ color: "#fff" }}>the old identity</div>
              <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.35, color: "#fff", marginBottom: 14 }}>
                {pattern.pattern}.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.85)" }}>{patternWhy}</p>
            </div>
            <div className="p-8 hover:bg-[#fafafa] transition-colors">
              <div className="tag mb-3">who you&apos;re replacing her with</div>
              <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.35, color: "var(--dark)", marginBottom: 14 }}>
                {pattern.replacingWith}.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--grey)", marginBottom: 14 }}>
                This isn&apos;t a mindset shift you think your way into, it&apos;s built by the small, repeated choices below. Every mission you complete this szn is a vote for her instead of the old pattern.
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", borderBottom: "1.5px solid var(--pink)", paddingBottom: 2 }}>
                break it this week →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* The Woman You're Becoming */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto p-8 md:p-10" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <div className="tag mb-4">the woman you&apos;re becoming</div>
          <h2 style={{ fontFamily: poppins, fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800, letterSpacing: "-0.7px", lineHeight: 1.25, color: "#3C2A70", marginBottom: 20 }}>
            she doesn&apos;t think, behave or decide like the version of you reading this right now.
          </h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
            {[
              { label: "how she thinks", text: futureSelf.thinks },
              { label: "how she behaves", text: futureSelf.behaves },
              { label: "how she decides", text: futureSelf.decides },
              { label: "how she treats herself", text: futureSelf.treats },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 4 }}>
                  {item.label}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3C2A70" }}>{item.text.charAt(0).toUpperCase() + item.text.slice(1)}.</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6" style={{ borderTop: "1.5px solid rgba(60,42,112,0.15)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 4 }}>
              how people experience her differently
            </div>
            <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.5, color: "#3C2A70" }}>
              {futureSelf.experienced.charAt(0).toUpperCase() + futureSelf.experienced.slice(1)}.
            </p>
          </div>
        </div>
      </section>

      {/* Future Self Letter */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8 md:p-10" style={{ background: "var(--dark)" }}>
          <div className="tag mb-4" style={{ color: "var(--lav)" }}>a letter from your future self</div>
          <p
            style={{
              fontFamily: poppins,
              fontSize: "clamp(18px, 2.6vw, 22px)",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.7,
              color: "#fff",
            }}
          >
            &ldquo;{futureSelfLetter}&rdquo;
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 20, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            six months from now, written to you today
          </p>
        </div>
      </section>

      {/* Seasonal Challenges teaser */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5" style={{ background: "var(--dark)" }}>
          <div>
            <div className="tag mb-2" style={{ color: "var(--pink)" }}>this szn&apos;s challenges</div>
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff", marginBottom: 8 }}>
              collect the proof you&apos;re becoming her.
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480 }}>
              Personalised missions tied to your chart and your goals, XP, badges, streaks, the whole game.
            </p>
          </div>
          <Link href="/challenges" className="btn-pink" style={{ whiteSpace: "nowrap" }}>
            open seasonal challenges
          </Link>
        </div>
      </section>

      {/* Signs You're On The Right Path */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-2">signs you&apos;re on the right path</div>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 20 }}>
            you&apos;ll know this work is landing when&hellip;
          </h2>
          <div className="grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
            {SIGNS_ON_THE_RIGHT_PATH.map((sign, i) => (
              <div
                key={sign}
                className="p-6 flex items-start gap-3"
                style={{
                  borderRight: i % 2 === 0 ? "var(--border)" : undefined,
                  borderBottom: i + 2 < SIGNS_ON_THE_RIGHT_PATH.length ? "var(--border)" : undefined,
                  background: i % 2 === 0 ? "#fff" : "var(--cream)",
                }}
              >
                <span style={{ color: "var(--pink)", fontSize: 16, fontWeight: 800 }}>✓</span>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--grey)" }}>{sign}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiments */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-2">run an experiment</div>
          <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 10 }}>
            don&apos;t just read it, test it.
          </h2>
          <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>
            Pick one. Take the small action. Reflect on what actually happened versus what you feared would happen. This is how belief changes, evidence, not more reading.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0 mb-0" style={{ border: "var(--border)", borderBottom: currentExperiment ? "none" : "var(--border)" }}>
            {EXPERIMENTS.map((exp, i) => {
              const isRecommended = exp.id === recommendedExperiment.id;
              const isActive = exp.id === activeExperiment;
              return (
                <button
                  key={exp.id}
                  onClick={() => {
                    setActiveExperiment(isActive ? null : exp.id);
                    setExperimentReflection("");
                  }}
                  className="p-5 text-center relative"
                  style={{
                    borderRight: (i + 1) % 5 !== 0 ? "var(--border)" : undefined,
                    background: isActive ? "var(--pink)" : "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {isRecommended && (
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isActive ? "#fff" : "var(--pink)", marginBottom: 4 }}>
                      recommended
                    </div>
                  )}
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{exp.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#fff" : "var(--dark)", lineHeight: 1.3 }}>
                    {exp.label.replace("the ", "").replace(" experiment", "")}
                  </div>
                </button>
              );
            })}
          </div>
          {currentExperiment && (
            <div className="p-8" style={{ border: "var(--border)", borderTop: "none", background: "var(--lav-light)" }}>
              <h3 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", color: "#3C2A70", marginBottom: 10 }}>
                {currentExperiment.label}.
              </h3>
              <p style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7, marginBottom: 16 }}>{currentExperiment.intro}</p>
              <div className="p-5 mb-5" style={{ background: "#fff", border: "var(--border)" }}>
                <div className="tag mb-2">the action</div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dark)", lineHeight: 1.7 }}>{currentExperiment.action}</p>
              </div>
              <div className="tag mb-3">reflect afterward</div>
              <div className="flex flex-col gap-2 mb-4">
                {currentExperiment.reflectionPrompts.map((p) => (
                  <p key={p} style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.6 }}>&bull; {p}</p>
                ))}
              </div>
              <textarea
                value={experimentReflection}
                onChange={(e) => setExperimentReflection(e.target.value)}
                placeholder="what actually happened when you tried it..."
                rows={4}
                className="w-full mb-4"
                style={{ border: "var(--border)", outline: "none", padding: "14px 16px", fontSize: 14, lineHeight: 1.7, resize: "vertical", fontFamily: "inherit", background: "#fff" }}
              />
              <div className="flex items-center gap-4">
                <button onClick={saveExperimentReflection} className="btn-pink" style={{ cursor: "pointer" }}>
                  save reflection to journal
                </button>
                {experimentSaved && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pink)" }}>saved. that&apos;s the data. ✦</span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Opportunities + challenges */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-4">your opportunities</div>
            <div className="flex flex-col gap-4">
              {[
                { label: "confidence", text: seasonTraits.confidence },
                { label: "career & money", text: `with your ${ordinalHouse(activatedHouse)} house activated, moves around your ${houseMeaning.lifeAreas[0]} pay double this szn` },
                { label: "relationships", text: seasonTraits.love },
                { label: "growth", text: seasonTraits.growth },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 3 }}>
                    {item.label}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7 }}>
                    {item.text.charAt(0).toUpperCase() + item.text.slice(1)}.
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8" style={{ background: "var(--dark)" }}>
            <div className="tag mb-4" style={{ color: "var(--lav)" }}>your challenges</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.85, marginBottom: 16 }}>
              The shadow to watch: {seasonTraits.shadow}. With this szn hitting your {ordinalHouse(activatedHouse)} house, it&apos;ll show up around {houseMeaning.lifeAreas[0]} first.
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.85 }}>
              <span style={{ color: "var(--pink)", fontWeight: 700 }}>coach&apos;s note: </span>
              When it appears, don&apos;t fight it, name it. Write it down, say it out loud, then take the smallest possible action in the opposite direction. Patterns lose power when they lose secrecy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission + ritual */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ background: "var(--gold)", borderRight: "var(--border)" }}>
            <div className="tag mb-3">your main character mission</div>
            <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.35, color: "#854F0B" }}>
              {HOUSE_MISSIONS[activatedHouse]}
            </p>
          </div>
          <div className="p-8" style={{ background: "var(--lav-light)" }}>
            <div className="tag mb-3">your szn ritual</div>
            <p style={{ fontSize: 14, color: "#3C2A70", lineHeight: 1.85 }}>
              Each morning this szn: hand on heart, three breaths, then say your affirmation, &ldquo;{season.affirmation}&rdquo;, and visualise one scene from your {houseMeaning.lifeAreas[0]} glow-up as if it already happened. Ninety seconds. If tension comes up, tap gently on the collarbone while you repeat it. Consistency beats intensity.
            </p>
          </div>
        </div>
      </section>

      {/* The "your cosmic calendar" section was removed on 16 Aug 2026. It listed the same
          lunations and eclipses the cosmic weather rail already shows at the top of the dashboard,
          purely to add the "lands in your Nth house" line. That line now rides along on the
          weather card itself (SkyAlert's `mine` field), so the sky is described once instead of
          twice. The full per-event reads still live at /your-season/moon, linked from the cards. */}

      {/* Seasonal prompts + affirmations, personalised */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-4">seasonal journal prompts · yours</div>
            <div className="flex flex-col gap-4">
              {[
                `${season.sign} szn is lighting up my ${houseMeaning.lifeAreas[0]}. What would change if I gave that area my full attention for one month?`,
                `Where am I still ${seasonTraits.shadow.split(",")[0]}? What's one visible move in the opposite direction?`,
                `My ${risingSign.toLowerCase()} rising walks in first. How does she handle this szn's assignment?`,
              ].map((prompt, i) => (
                <p key={i} style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px", lineHeight: 1.5, color: "#3C2A70" }}>
                  {i + 1}. {prompt}
                </p>
              ))}
            </div>
            <Link href="/journal" className="btn-pink" style={{ display: "inline-block", marginTop: 20 }}>
              journal on these
            </Link>
          </div>
          <div className="p-8" style={{ background: "var(--pink)" }}>
            <div className="tag mb-4" style={{ color: "#fff" }}>seasonal affirmations · yours</div>
            <div className="flex flex-col gap-5">
              {[
                season.affirmation,
                `My ${houseMeaning.lifeAreas[0]} is transforming this szn. I let it.`,
                `I am the woman my ${ordinalHouse(activatedHouse)} house has been waiting for.`,
              ].map((aff, i) => (
                <p key={i} style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.35, color: "#fff" }}>
                  &ldquo;{aff}&rdquo;
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
