"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { composeLunation, type LunationType } from "@/lib/moon-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";

interface EclipseEvent {
  type: "solar_eclipse" | "lunar_eclipse";
  date: string;
  sign: string;
  degree: number;
  nodeEnd: "north" | "south";
}

// An eclipse family runs on an AXIS, so the timeline shows this sign and the one opposite it.
const OPPOSITE_SIGN: Record<string, string> = {
  Aries: "Libra", Libra: "Aries",
  Taurus: "Scorpio", Scorpio: "Taurus",
  Gemini: "Sagittarius", Sagittarius: "Gemini",
  Cancer: "Capricorn", Capricorn: "Cancer",
  Leo: "Aquarius", Aquarius: "Leo",
  Virgo: "Pisces", Pisces: "Virgo",
};

const VALID_TYPES: LunationType[] = [
  "new_moon",
  "full_moon",
  "solar_eclipse",
  "lunar_eclipse",
  "retrograde_start",
  "retrograde_end",
  "node_ingress",
];

function MoonPageContent() {
  const params = useSearchParams();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const season = useSeason();

  const type = params.get("type") as LunationType | null;
  const date = params.get("date");
  const sign = params.get("sign");
  const degree = params.get("degree");
  const planet = params.get("planet") || undefined;
  const nodeEndParam = params.get("nodeEnd");
  const nodeEnd = nodeEndParam === "north" || nodeEndParam === "south" ? nodeEndParam : undefined;

  // Mount-guarded clock: reading the date during render is impure (react-hooks/purity), and the
  // "what to watch now" section has to be measured against a real today. Null until mounted, which
  // simply means that one section renders a beat later rather than blocking anything.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  // The eclipse series, fetched only for eclipses. Computed from the ephemeris server-side so the
  // timeline can never drift from the dates the rest of the app publishes.
  const isEclipse = type === "solar_eclipse" || type === "lunar_eclipse";
  const [series, setSeries] = useState<EclipseEvent[] | null>(null);
  useEffect(() => {
    if (!isEclipse || !date) return;
    let active = true;
    fetch(`/api/eclipses?around=${encodeURIComponent(date)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d?.eclipses) setSeries(d.eclipses as EclipseEvent[]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isEclipse, date]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            add your birth details to unlock this.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            Cosmic calendar readings are personalised to your exact chart. Add your birth details and every date opens up for you.
          </p>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  if (!type || !VALID_TYPES.includes(type) || !date || !sign || !degree) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t find that date.
          </h1>
          <Link href="/your-season" className="btn-pink">back to this season</Link>
        </div>
      </section>
    );
  }

  const reading = composeLunation({ type, date, sign, degree: Number(degree), planet, nodeEnd }, chart, now ?? undefined);

  // The eclipses on this same axis: this sign and its opposite. That is the eighteen-month family
  // the reading keeps referring to, so the timeline shows exactly those rather than every eclipse.
  const axisSeries = series?.filter((e) => e.sign === sign || e.sign === OPPOSITE_SIGN[sign]) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/your-season"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            back to {season.sign.toLowerCase()} szn
          </Link>
          <div className="tag mb-2" style={{ marginTop: 18 }}>
            {reading.dateLabel} · your cosmic calendar
          </div>
          <div style={{ fontSize: 36, marginBottom: 6 }}>{reading.emoji}</div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(30px, 5.5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            <span className="pk">{reading.title}.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 560 }}>
            {reading.whatThisIs}
          </p>
        </div>
      </section>

      {/* Collective opening: the bigger-picture framing shown to everyone, ahead of the personal read */}
      {reading.collectiveOpening && reading.collectiveOpening.length > 0 && (
        <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="tag mb-5">the bigger picture</div>
            {reading.collectiveOpening.map((para, i) => (
              <p
                key={i}
                style={{ fontSize: 16, lineHeight: 1.9, color: "var(--dark)", marginTop: i === 0 ? 0 : 16 }}
              >
                {para}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Primer: the astrology behind the event, for members meeting it for the first time */}
      {reading.primer && (
        <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="tag mb-5">{reading.primerTitle || "the astrology, explained"}</div>
            <div style={{ border: "var(--border)" }}>
              {reading.primer.map((section, i) => (
                <div
                  key={section.heading}
                  className="p-7 md:p-8"
                  style={{ borderTop: i === 0 ? undefined : "var(--border)" }}
                >
                  <h2
                    style={{
                      fontFamily: poppins,
                      fontSize: 19,
                      fontWeight: 800,
                      letterSpacing: "-0.4px",
                      lineHeight: 1.3,
                      color: "#3C2A70",
                      marginBottom: 10,
                    }}
                  >
                    {section.heading}
                  </h2>
                  <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* In your chart */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
          <div className="tag mb-3">what this means in your chart</div>
          {(reading.chartParagraphs || [reading.inYourChart]).map((para, i) => (
            <p
              key={i}
              style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70", marginTop: i === 0 ? 0 : 14 }}
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Degree note, e.g. the anaretic 29th */}
      {reading.degreeNote && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
            <div className="tag mb-3">{reading.degreeNote.heading}</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>{reading.degreeNote.body}</p>
          </div>
        </section>
      )}

      {/* Natal contact: only when the eclipse degree genuinely touches a placement or angle */}
      {reading.natalContact && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--lav-light)" }}>
            <div className="tag mb-3" style={{ color: "#3C2A70" }}>this one touches your chart</div>
            {reading.natalContact.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70", marginTop: i === 0 ? 0 : 14 }}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* What to watch now: changes with today's date */}
      {reading.watchNow && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
            <div className="flex items-baseline gap-3 flex-wrap mb-3">
              <div className="tag">what to watch now</div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  background: "var(--pink)",
                  color: "#fff",
                }}
              >
                {reading.watchNow.label}
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>{reading.watchNow.body}</p>
          </div>
        </section>
      )}

      {/* The eclipse family on this axis */}
      {axisSeries.length > 1 && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
            <div className="tag mb-3">the eclipse family this belongs to</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)", marginBottom: 22 }}>
              Eclipses land on the same axis for around eighteen months at a time, so this date is one
              scene in a longer story. Here is the whole run on your {sign}/{OPPOSITE_SIGN[sign] ?? ""} axis.
              What began or ended at one of these is very often what comes back at the next.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {axisSeries.map((e) => {
                const isThis = e.date === date;
                const d = new Date(`${e.date}T12:00:00Z`);
                return (
                  <li
                    key={`${e.date}-${e.type}`}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 12,
                      flexWrap: "wrap",
                      padding: "12px 14px",
                      marginBottom: 8,
                      border: isThis ? "2px solid var(--pink)" : "1.5px solid rgba(26,26,26,0.15)",
                      background: isThis ? "var(--pink-bg)" : "transparent",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: poppins,
                        fontSize: 13,
                        fontWeight: 800,
                        color: isThis ? "var(--pink)" : "var(--dark)",
                        minWidth: 130,
                      }}
                    >
                      {d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--grey)" }}>
                      {e.type === "lunar_eclipse" ? "lunar eclipse" : "solar eclipse"} at {e.degree}° {e.sign.toLowerCase()}
                    </span>
                    {isThis && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--pink)",
                        }}
                      >
                        you are here
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* What it brings up */}
      {reading.bringsUp && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
            <div className="tag mb-3">what it brings up</div>
            {reading.bringsUp.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)", marginTop: i === 0 ? 0 : 14 }}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* What to look out for */}
      {reading.lookOutFor && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
            <div className="tag mb-3">what to look out for</div>
            {reading.lookOutFor.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)", marginTop: i === 0 ? 0 : 14 }}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* The shadow */}
      {reading.shadow && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)", background: "var(--pink-light)" }}>
            <div className="tag mb-3" style={{ color: "var(--pink)" }}>the shadow</div>
            {reading.shadow.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.85, color: "#3C2A70", marginTop: i === 0 ? 0 : 14 }}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* Betty's Take */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>betty&apos;s take</div>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{reading.bettysTake}</p>
        </div>
      </section>

      {/* Your exercise: the distinct, do-it-this-week practice for lunations and eclipses */}
      {reading.exercise && (
        <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--gold)" }}>
            <div className="tag mb-3">your exercise</div>
            <p style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", color: "#854F0B", marginBottom: 8 }}>
              {reading.exercise.title}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "#854F0B", fontWeight: 600, marginBottom: 20 }}>
              {reading.exercise.intro}
            </p>
            <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {reading.exercise.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 items-start"
                  style={{
                    paddingTop: i === 0 ? 0 : 14,
                    marginTop: i === 0 ? 0 : 14,
                    borderTop: i === 0 ? undefined : "1px solid rgba(133,79,11,0.22)",
                  }}
                >
                  <span
                    aria-hidden
                    style={{ fontFamily: poppins, fontWeight: 800, fontSize: 15, color: "#854F0B", flexShrink: 0, width: 18 }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: 1.7, color: "#854F0B", fontWeight: 600 }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* The Move (node ingress keeps this; lunations render the exercise above instead) */}
      {reading.theMove && (
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--gold)" }}>
          <div className="tag mb-3">the move</div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: "#854F0B", fontWeight: 600 }}>{reading.theMove}</p>
          {reading.moveOptions && (
            <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0" }}>
              {reading.moveOptions.map((option) => (
                <li
                  key={option}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#854F0B",
                    fontWeight: 600,
                    paddingLeft: 20,
                    marginTop: 10,
                    position: "relative",
                  }}
                >
                  <span aria-hidden style={{ position: "absolute", left: 0, fontWeight: 800 }}>
                    ·
                  </span>
                  {option}
                </li>
              ))}
            </ul>
          )}
          {reading.moveQuestions && (
            <>
              <div
                className="tag"
                style={{ color: "#854F0B", marginTop: 28, marginBottom: 4, paddingTop: 20, borderTop: "1px solid rgba(133,79,11,0.3)" }}
              >
                then sit with these
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {reading.moveQuestions.map((question) => (
                  <li
                    key={question}
                    style={{
                      fontFamily: poppins,
                      fontSize: 15,
                      lineHeight: 1.6,
                      letterSpacing: "-0.2px",
                      color: "#854F0B",
                      fontWeight: 700,
                      paddingTop: 12,
                      marginTop: 12,
                      borderTop: "1px solid rgba(133,79,11,0.18)",
                    }}
                  >
                    {question}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
      )}

      {/* Prompt + affirmation */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-4">journal on it</div>
            <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.5, color: "#3C2A70", marginBottom: 20 }}>
              {reading.journalPrompt}
            </p>
            {reading.journalPrompts && reading.journalPrompts.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px" }}>
                {reading.journalPrompts.map((q, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: "var(--grey)",
                      paddingLeft: 16,
                      borderLeft: `2px solid ${i % 2 === 0 ? "var(--pink)" : "var(--lav)"}`,
                      marginBottom: 12,
                    }}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/journal" className="btn-pink">open my journal</Link>
          </div>
          <div className="p-8" style={{ background: "var(--pink)" }}>
            <div className="tag mb-4" style={{ color: "#fff" }}>
              your affirmation{reading.affirmations && reading.affirmations.length > 1 ? "s" : ""}
            </div>
            <p style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.3, color: "#fff" }}>
              &ldquo;{reading.affirmation}&rdquo;
            </p>
            {reading.affirmations && reading.affirmations.length > 1 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0" }}>
                {reading.affirmations
                  // The headline affirmation is already shown above, so it isn't repeated here.
                  .filter((a) => a !== reading.affirmation)
                  .map((a, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: poppins,
                        fontSize: 15,
                        fontWeight: 700,
                        lineHeight: 1.5,
                        color: "#fff",
                        paddingLeft: 16,
                        borderLeft: "2px solid rgba(255,255,255,0.45)",
                        marginBottom: 12,
                      }}
                    >
                      &ldquo;{a}&rdquo;
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function MoonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
        </div>
      }
    >
      <MoonPageContent />
    </Suspense>
  );
}
