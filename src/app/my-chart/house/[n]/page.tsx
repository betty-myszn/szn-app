"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { HOUSE_MEANINGS, SIGN_TRAITS, getBodyMeaning, ordinalHouse, degreeMeaning } from "@/lib/interpretations";
import { composeHouseDeepDive } from "@/lib/house-content";
import { PLANET_SYMBOLS } from "@/types/chart";
import { getSymbol } from "@/lib/style-data";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function HousePage() {
  const params = useParams<{ n: string }>();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();

  const houseNum = parseInt(params.n, 10);
  const meaning = houseNum >= 1 && houseNum <= 12 ? HOUSE_MEANINGS[houseNum - 1] : undefined;

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

  if (!meaning || !chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            {!chart ? "add your birth details first." : "that house doesn't exist, there are only 12."}
          </h1>
          <Link href={!chart ? "/onboarding" : "/my-chart"} className="btn-pink">
            {!chart ? "add your chart" : "back to my chart"}
          </Link>
        </div>
      </section>
    );
  }

  const cusp = chart.houses[houseNum - 1];
  const cuspTraits = SIGN_TRAITS[cusp.sign];
  const planetsInside = chart.planets.filter((p) => p.house === houseNum);
  const deepDive = composeHouseDeepDive(houseNum, chart);
  const otherHouses = Array.from({ length: 12 }, (_, i) => i + 1).filter((n) => n !== houseNum);

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/my-chart"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← my chart
          </Link>
          <div className="tag mb-2" style={{ marginTop: 18 }}>
            {ordinalHouse(houseNum)} house · {getSymbol(cusp.sign)} {cusp.sign.toLowerCase()} on the cusp
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            your house of <span className="pk">{meaning.title}.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 580 }}>
            This house rules {meaning.rules}. {meaning.coach}
          </p>
        </div>
      </section>

      {/* What this house actually governs */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-3">what this house actually governs</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>{meaning.deepDive}</p>
        </div>
      </section>

      {/* Sign on the door + life areas */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
          <div className="p-8" style={{ borderRight: "var(--border)" }}>
            <div className="tag mb-3">the sign on the door</div>
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 10 }}>
              {cusp.sign.toLowerCase()} runs this arena.
            </h2>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8 }}>
              With {cusp.sign.toLowerCase()} on the cusp, you approach {meaning.lifeAreas.slice(0, 2).join(" and ")} with {cuspTraits?.essence}. Your natural edge here: {cuspTraits?.gift}.
            </p>
          </div>
          <div className="p-8" style={{ background: "var(--lav-light)" }}>
            <div className="tag mb-3">life areas this house runs</div>
            <div className="flex gap-2 flex-wrap" style={{ marginBottom: 14 }}>
              {meaning.lifeAreas.map((area) => (
                <span
                  key={area}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: "#fff",
                    border: "var(--border)",
                    padding: "6px 12px",
                  }}
                >
                  {area}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#3C2A70", lineHeight: 1.7 }}>
              Cusp at {cusp.formattedDegree} {cusp.sign.toLowerCase()}, {degreeMeaning(cusp.degree)}
            </p>
          </div>
        </div>
      </section>

      {/* Natural ruler vs your actual cusp */}
      {deepDive && (
        <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--gold)" }}>
            <div className="tag mb-3">textbook house vs your house</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#854F0B" }}>{deepDive.rulerLine}</p>
          </div>
        </section>
      )}

      {/* The ruler of this house, and where it actually sits */}
      {deepDive?.rulerPlacement && (
        <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto p-8" style={{ border: "var(--border)" }}>
            <div className="tag mb-3">the ruler of this house</div>
            <h2 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 12 }}>
              {cusp.sign.toLowerCase()} is ruled by{" "}
              <Link href={`/my-chart/${deepDive.rulerPlacement.rulerId}`} className="pk" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                {deepDive.rulerPlacement.rulerName.toLowerCase()}
              </Link>
              , in {deepDive.rulerPlacement.rulerSign.toLowerCase()}
              {deepDive.rulerPlacement.rulerRetrograde && <span style={{ color: "var(--pink)" }}> (Rx)</span>}, in your {ordinalHouse(deepDive.rulerPlacement.rulerHouse)} house.
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--grey)" }}>{deepDive.rulerPlacement.synthesis}</p>
            {planetsInside.length > 0 && (
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "var(--grey-light)", marginTop: 14, fontStyle: "italic" }}>
                Worth keeping separate: {planetsInside.map((p) => p.name).join(", ")} {planetsInside.length === 1 ? "sits" : "sit"} inside this house too, that&apos;s a different layer to the ruler above, see &ldquo;planets living here&rdquo; below for what {planetsInside.length === 1 ? "it" : "they"} add.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Planets living here */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">planets living here · {planetsInside.length}</div>
          {planetsInside.length === 0 ? (
            <div className="p-8" style={{ border: "var(--border)" }}>
              <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8 }}>
                No planets live in this house, and that&apos;s not a gap. It means this life area runs on the style of its cusp sign, {cusp.sign.toLowerCase()}, without extra cosmic noise. Steady, uncomplicated energy.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
              {planetsInside.map((p, i) => {
                const body = getBodyMeaning(p.id);
                return (
                  <Link
                    key={p.id}
                    href={`/my-chart/${p.id}`}
                    className="no-underline p-6 hover:bg-[#fafafa] transition-colors"
                    style={{ color: "var(--dark)", borderBottom: i < planetsInside.length - 1 ? "1px solid #eee" : undefined }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ fontSize: 20, color: "var(--pink)" }}>{PLANET_SYMBOLS[p.name]}</span>
                      <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800 }}>
                        {p.name.toLowerCase()} in {p.sign.toLowerCase()}
                        {p.retrograde && <span style={{ color: "var(--pink)", fontSize: 11, marginLeft: 5 }}>Rx</span>}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7 }}>
                      {body
                        ? `Your ${body.domainShort} operates from this arena, ${meaning.lifeAreas[0]} is where your ${p.name.toLowerCase()} energy makes itself felt most. Tap to read the full interpretation.`
                        : "Tap to read the full interpretation."}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {deepDive && (
        <>
          {/* Betty's take */}
          <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--dark)" }}>
              <div className="tag mb-3" style={{ color: "var(--pink)" }}>betty&apos;s take</div>
              <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{deepDive.bettysTake}</p>
            </div>
          </section>

          {/* The real block */}
          <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--pink)" }}>
              <div className="tag mb-3" style={{ color: "#fff" }}>the real block</div>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: "#fff", fontWeight: 500 }}>{deepDive.rootPattern}</p>
            </div>
          </section>

          {/* Before / after shift */}
          <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto">
              <div className="tag mb-5">the shift</div>
              <div className="grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
                <div className="p-8" style={{ borderRight: "var(--border)", background: "#fafafa" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 10 }}>
                    the belief running the show
                  </div>
                  <p style={{ fontSize: 17, fontStyle: "italic", lineHeight: 1.6, color: "var(--dark)" }}>
                    &ldquo;{deepDive.shiftBefore}&rdquo;
                  </p>
                </div>
                <div className="p-8" style={{ background: "var(--pink)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: 10 }}>
                    the belief you&apos;re building instead
                  </div>
                  <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6, color: "#fff" }}>
                    &ldquo;{deepDive.shiftAfter}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5-day protocol */}
          <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto">
              <div className="tag mb-2">the protocol</div>
              <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 10 }}>
                {deepDive.protocolTitle}.
              </h2>
              <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>
                One small, specific action a day, tied directly to this house. Do these in order across five days this week.
              </p>
              <div className="flex flex-col gap-0" style={{ border: "var(--border)" }}>
                {deepDive.protocolDays.map((step, i) => (
                  <div
                    key={step}
                    className="p-6 flex gap-5 items-start"
                    style={{ borderBottom: i < deepDive.protocolDays.length - 1 ? "var(--border)" : undefined }}
                  >
                    <div
                      className="flex flex-col items-center justify-center shrink-0"
                      style={{ width: 56, height: 56, border: "1.5px solid var(--pink)" }}
                    >
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>day</span>
                      <span style={{ fontFamily: poppins, fontWeight: 800, fontSize: 18, color: "var(--pink)" }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey)", paddingTop: 8 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stretch move */}
          <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto p-8" style={{ background: "var(--gold)" }}>
              <div className="tag mb-3">the stretch move</div>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "#854F0B", fontWeight: 600 }}>{deepDive.stretchMove}</p>
              <p style={{ fontSize: 12, color: "#854F0B", marginTop: 14, opacity: 0.8 }}>
                This is the one action that creates outsized change. The protocol builds the muscle, this is where you actually use it.
              </p>
            </div>
          </section>

          {/* Proof markers */}
          <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto">
              <div className="tag mb-5">how you&apos;ll know it&apos;s working</div>
              <div className="grid md:grid-cols-3 gap-0" style={{ border: "var(--border)" }}>
                {deepDive.proofMarkers.map((marker, i) => (
                  <div
                    key={marker}
                    className="p-6"
                    style={{ borderRight: i < deepDive.proofMarkers.length - 1 ? "var(--border)" : undefined, background: "var(--mint)" }}
                  >
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "#0F6E56" }}>{marker}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Affirmations + journal CTA */}
          <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0" style={{ border: "var(--border)" }}>
              <div className="p-8 flex flex-col justify-center">
                <div className="tag mb-3">journal on it</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--grey)", marginBottom: 18 }}>
                  Log each day of the protocol and what shifts, this is exactly what journalling is for.
                </p>
                <Link href="/journal" className="btn-pink" style={{ alignSelf: "flex-start" }}>journal on this house</Link>
              </div>
              <div className="p-8" style={{ background: "var(--pink)" }}>
                <div className="tag mb-3" style={{ color: "#fff" }}>your affirmations</div>
                <div className="flex flex-col gap-3">
                  {deepDive.affirmations.map((a) => (
                    <p key={a} style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6, color: "#fff" }}>
                      &ldquo;{a}&rdquo;
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Explore other houses */}
      <section className="px-5 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">explore another house</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
            {otherHouses.map((n, i) => {
              const otherMeaning = HOUSE_MEANINGS[n - 1];
              return (
                <Link
                  key={n}
                  href={`/my-chart/house/${n}`}
                  className="no-underline p-5 text-center hover:bg-[#fafafa] transition-colors"
                  style={{
                    borderRight: (i + 1) % 4 !== 0 && i < otherHouses.length - 1 ? "var(--border)" : undefined,
                    borderBottom: Math.floor(i / 4) < Math.floor((otherHouses.length - 1) / 4) ? "var(--border)" : undefined,
                    color: "var(--dark)",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--pink)", marginBottom: 4 }}>{ordinalHouse(n)} house</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{otherMeaning.title}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
