"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { HOUSE_MEANINGS, SIGN_TRAITS, getBodyMeaning, ordinalHouse, degreeMeaning } from "@/lib/interpretations";
import { composeHouseDeepDive } from "@/lib/house-content";
import { PLANET_SYMBOLS } from "@/types/chart";
import { getSymbol } from "@/lib/style-data";
import { glossify } from "@/components/AstroTerm";
import { Box, SectionHead, TONES, makeLead } from "@/components/learn/LearnKit";
import { DeepDiveBody, DeepDiveHero, DeepDivePage, PinkLink, Pill, Stack } from "@/components/learn/DeepDive";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const lead = makeLead(glossify);

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

  const linkStyle: React.CSSProperties = { color: "var(--dark)", textDecoration: "underline", textUnderlineOffset: 3 };

  return (
    <DeepDivePage eyebrow={`${ordinalHouse(houseNum)} house`}>
      <DeepDiveHero
        eyebrow={`${ordinalHouse(houseNum)} house · ${getSymbol(cusp.sign)} ${cusp.sign.toLowerCase()} on the cusp`}
        title={
          <>
            your house of <span className="pk">{meaning.title}.</span>
          </>
        }
      >
        {glossify(`This house rules ${meaning.rules}. ${meaning.coach}`)}
      </DeepDiveHero>

      <DeepDiveBody>
        <SectionHead title="the basics" />
        <Stack>
          {/* What this house actually governs */}
          <Box label="what this house actually governs">{lead(meaning.deepDive)}</Box>

          {/* Sign on the door + life areas */}
          <Stack cols={260}>
            <Box tone="pink" label="the sign on the door">
              <strong style={{ display: "block", fontFamily: poppins, fontSize: 20, lineHeight: 1.25, marginBottom: 8 }}>{cusp.sign.toLowerCase()} runs this arena.</strong>
              {glossify(`With ${cusp.sign.toLowerCase()} on the cusp, you approach ${meaning.lifeAreas.slice(0, 2).join(" and ")} with ${cuspTraits?.essence}. Your natural edge here: ${cuspTraits?.gift}.`)}
            </Box>
            <Box tone="lav" label="life areas this house runs">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {meaning.lifeAreas.map((area) => (
                  <Pill key={area}>{area}</Pill>
                ))}
              </div>
              {glossify(`Cusp at ${cusp.formattedDegree} ${cusp.sign.toLowerCase()}, ${degreeMeaning(cusp.degree)}`)}
            </Box>
          </Stack>

          {/* Natural ruler vs your actual cusp */}
          {deepDive && <Box tone="lav" label="textbook house vs your house">{lead(deepDive.rulerLine)}</Box>}

          {/* The ruler of this house, and where it actually sits */}
          {deepDive?.rulerPlacement && (
            <Box label="the ruler of this house">
              <strong style={{ display: "block", fontFamily: poppins, fontSize: 19, lineHeight: 1.3, marginBottom: 10 }}>
                {cusp.sign.toLowerCase()} is ruled by{" "}
                <Link href={`/my-chart/${deepDive.rulerPlacement.rulerId}`} style={linkStyle}>
                  {deepDive.rulerPlacement.rulerName.toLowerCase()}
                </Link>
                , in {deepDive.rulerPlacement.rulerSign.toLowerCase()}
                {deepDive.rulerPlacement.rulerRetrograde && <span> (Rx)</span>}, in your {ordinalHouse(deepDive.rulerPlacement.rulerHouse)} house.
              </strong>
              {glossify(deepDive.rulerPlacement.synthesis)}
              {planetsInside.length > 0 && (
                <p style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.6, marginTop: 12 }}>
                  Worth keeping separate: {planetsInside.map((p) => p.name).join(", ")} {planetsInside.length === 1 ? "sits" : "sit"} inside this house too, that&apos;s a different layer to the ruler above, see &ldquo;planets living here&rdquo; below for what {planetsInside.length === 1 ? "it" : "they"} add.
                </p>
              )}
            </Box>
          )}
        </Stack>

        {/* Planets living here */}
        <SectionHead title={`planets living here · ${planetsInside.length}`} />
        {planetsInside.length === 0 ? (
          <Box>
            {lead(`No planets live in this house, and that's not a gap. It means this life area runs on the style of its cusp sign, ${cusp.sign.toLowerCase()}, without extra cosmic noise. Steady, uncomplicated energy.`)}
          </Box>
        ) : (
          <Stack>
            {planetsInside.map((p) => {
              const body = getBodyMeaning(p.id);
              return (
                <Link key={p.id} href={`/my-chart/${p.id}`} className="no-underline hd-tile" style={{ display: "block", borderRadius: 18 }}>
                  <Box tone="pink">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 20 }}>{PLANET_SYMBOLS[p.name]}</span>
                      <span style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800 }}>
                        {p.name.toLowerCase()} in {p.sign.toLowerCase()}
                      </span>
                      {p.retrograde && <Pill tone="dark">Rx</Pill>}
                    </div>
                    {glossify(
                      body
                        ? `Your ${body.domainShort} operates from this arena, ${meaning.lifeAreas[0]} is where your ${p.name.toLowerCase()} energy makes itself felt most. Tap to read the full interpretation.`
                        : "Tap to read the full interpretation."
                    )}
                  </Box>
                </Link>
              );
            })}
          </Stack>
        )}

        {deepDive && (
          <>
            <SectionHead title="the real talk" />
            <Stack>
              {/* Betty's take */}
              <Box tone="dark" label="betty's take">{lead(deepDive.bettysTake)}</Box>

              {/* The real block */}
              <Box tone="pink" label="the real block">{lead(deepDive.rootPattern)}</Box>
            </Stack>

            {/* Before / after shift */}
            <SectionHead title="the shift" />
            <Stack cols={260}>
              <Box label="the belief running the show">
                <p style={{ fontSize: 17, fontStyle: "italic", lineHeight: 1.6 }}>&ldquo;{deepDive.shiftBefore}&rdquo;</p>
              </Box>
              <Box tone="pink" label="the belief you're building instead">
                <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6 }}>&ldquo;{deepDive.shiftAfter}&rdquo;</p>
              </Box>
            </Stack>

            {/* 5-day protocol */}
            <SectionHead title="the protocol" />
            <Box tone="lav">
              <strong style={{ display: "block", fontFamily: poppins, fontSize: 22, lineHeight: 1.25, marginBottom: 8 }}>{deepDive.protocolTitle}.</strong>
              One small, specific action a day, tied directly to this house. Do these in order across five days this week.
            </Box>
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              {deepDive.protocolDays.map((step, i) => (
                <Box key={step}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div
                      style={{ width: 52, height: 52, borderRadius: 14, background: "var(--pink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    >
                      <span style={{ fontFamily: poppins, fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>day</span>
                      <span style={{ fontFamily: poppins, fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{i + 1}</span>
                    </div>
                    <div style={{ paddingTop: 4 }}>{glossify(step)}</div>
                  </div>
                </Box>
              ))}
            </div>

            {/* Stretch move */}
            <SectionHead title="the stretch move" />
            <Box tone="dark">
              {lead(deepDive.stretchMove)}
              <p style={{ fontSize: 13.5, fontWeight: 700, marginTop: 12, color: "var(--pink)" }}>
                This is the one action that creates outsized change. The protocol builds the muscle, this is where you actually use it.
              </p>
            </Box>

            {/* Proof markers */}
            <SectionHead title="how you'll know it's working" />
            <Stack cols={180}>
              {deepDive.proofMarkers.map((marker) => (
                <Box key={marker} tone="lav">
                  {glossify(marker)}
                </Box>
              ))}
            </Stack>

            {/* Affirmations + journal CTA */}
            <SectionHead title="make it yours" />
            <Stack cols={260}>
              <Box label="journal on it">
                <p style={{ marginBottom: 16 }}>Log each day of the protocol and what shifts, this is exactly what journalling is for.</p>
                <PinkLink href="/journal">journal on this house</PinkLink>
              </Box>
              <Box tone="pink" label="your affirmations">
                <div style={{ display: "grid", gap: 10 }}>
                  {deepDive.affirmations.map((a) => (
                    <p key={a} style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.6 }}>
                      &ldquo;{a}&rdquo;
                    </p>
                  ))}
                </div>
              </Box>
            </Stack>
          </>
        )}

        {/* Explore other houses */}
        <SectionHead title="explore another house" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {otherHouses.map((n, i) => {
            const otherMeaning = HOUSE_MEANINGS[n - 1];
            const tone = TONES[i % TONES.length];
            return (
              <Link
                key={n}
                href={`/my-chart/house/${n}`}
                className="no-underline hd-tile"
                style={{ display: "block", textAlign: "center", borderRadius: 16, padding: "14px 10px", background: tone.bg, color: tone.fg, border: tone.border ?? "none" }}
              >
                <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>{ordinalHouse(n)} house</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{otherMeaning.title}</div>
              </Link>
            );
          })}
        </div>
      </DeepDiveBody>
    </DeepDivePage>
  );
}
