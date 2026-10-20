"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { composePlacement, getBodyMeaning, ordinalHouse, HOUSE_MEANINGS, SIGN_OVERVIEWS, degreeMeaning } from "@/lib/interpretations";
import { PLANET_SYMBOLS } from "@/types/chart";
import { getSymbol } from "@/lib/style-data";
import { glossify } from "@/components/AstroTerm";
import { Box, SectionHead, makeLead } from "@/components/learn/LearnKit";
import { DeepDiveBody, DeepDiveHero, DeepDivePage, PinkLink, Pill, Stack, goDeeper, toneFromBg } from "@/components/learn/DeepDive";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const lead = makeLead(glossify);

const SECTION_META: { key: "gifts" | "shadow" | "confidence" | "career" | "money" | "relationships" | "growth"; title: string; bg?: string; light?: boolean }[] = [
  { key: "gifts", title: "your gifts", bg: "var(--pink)", light: true },
  { key: "shadow", title: "your shadow", bg: "var(--dark)", light: true },
  { key: "confidence", title: "confidence" },
  { key: "career", title: "career" },
  { key: "money", title: "money", bg: "var(--lav-light)" },
  { key: "relationships", title: "relationships", bg: "var(--pink-light)" },
  { key: "growth", title: "personal growth" },
];

export default function PlacementPage() {
  const params = useParams<{ body: string }>();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();

  const bodyId = params.body;
  const body = getBodyMeaning(bodyId);

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

  if (!body || !chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            {!chart ? "add your birth details first." : "we couldn't find that placement."}
          </h1>
          <Link href={!chart ? "/onboarding" : "/my-chart"} className="btn-pink">
            {!chart ? "add your chart" : "back to my chart"}
          </Link>
        </div>
      </section>
    );
  }

  // Resolve sign + house for this body (rising/midheaven come from the angles)
  let sign = "";
  let house: number | undefined;
  let retrograde = false;
  let degreeLabel = "";
  let degreeNum = 0;
  if (bodyId === "rising") {
    sign = chart.houses[0]?.sign || "";
    house = 1;
    degreeLabel = chart.houses[0]?.formattedDegree || "";
    degreeNum = chart.houses[0]?.degree ?? 0;
  } else if (bodyId === "midheaven") {
    sign = chart.houses[9]?.sign || "";
    house = 10;
    degreeLabel = chart.houses[9]?.formattedDegree || "";
    degreeNum = chart.houses[9]?.degree ?? 0;
  } else {
    const planet = chart.planets.find((p) => p.id === bodyId);
    if (planet) {
      sign = planet.sign;
      house = planet.house;
      retrograde = planet.retrograde;
      degreeLabel = planet.formattedDegree;
      degreeNum = planet.degree;
    }
  }

  const sections = sign ? composePlacement(bodyId, sign, house) : null;

  if (!sections) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t read that placement.
          </h1>
          <Link href="/my-chart" className="btn-pink">back to my chart</Link>
        </div>
      </section>
    );
  }

  const houseMeaning = house ? HOUSE_MEANINGS[house - 1] : undefined;
  const signOverview = SIGN_OVERVIEWS[sign];

  return (
    <DeepDivePage eyebrow={`${body.name.toLowerCase()} in ${sign.toLowerCase()}`}>
      {/* Hero */}
      <DeepDiveHero
        eyebrow={`${body.name.toLowerCase()} · ${body.title} · ${degreeLabel}${retrograde ? " · retrograde" : ""}`}
        title={
          <>
            <span style={{ display: "block", fontSize: 40, marginBottom: 6, color: "var(--pink)" }}>{PLANET_SYMBOLS[body.name] || getSymbol(sign)}</span>
            {body.name.toLowerCase()} in <span className="pk">{sign.toLowerCase()}</span>
          </>
        }
      >
        {house ? (
          <div style={{ marginBottom: 14 }}>
            <Pill tone="pink">{ordinalHouse(house)} house</Pill>
          </div>
        ) : null}
        {glossify(body.intro)}
      </DeepDiveHero>

      <DeepDiveBody>
        <SectionHead title="the building blocks" />
        <Stack>
          {/* What this planet/point actually is */}
          <Box label={`what ${body.name.toLowerCase()} actually governs`}>{lead(body.deepDive)}</Box>

          {/* What this sign actually is */}
          {signOverview && (
            <Box tone="lav" label={`what ${sign.toLowerCase()} energy actually is`}>
              {lead(signOverview.archetype)}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                {[`${signOverview.element} element`, `${signOverview.modality} modality`, `ruled by ${signOverview.ruler}`].map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
            </Box>
          )}

          {/* What the exact degree means */}
          <Box tone="pink" label={`what ${degreeLabel} actually means`}>
            {glossify(`Your ${body.name.toLowerCase()} sits at ${degreeMeaning(degreeNum)}`)}
          </Box>

          {/* What this house actually governs */}
          {houseMeaning && house && (
            <Box label={`what your ${ordinalHouse(house)} house actually governs`}>
              {lead(houseMeaning.deepDive)}
              <p style={{ fontSize: 13.5, fontWeight: 700, marginTop: 12 }}>
                Naturally associated with {houseMeaning.naturalSign}, though your chart places {body.name.toLowerCase()} in {sign.toLowerCase()} here specifically.
              </p>
            </Box>
          )}
        </Stack>

        <SectionHead title="the real talk" />
        <Stack>
          {/* Betty's Take */}
          <Box tone="dark" label="betty's take">{lead(sections.bettysTake)}</Box>

          {/* Your Blind Spot */}
          <Box tone="pink" label="your blind spot">{lead(sections.blindSpot)}</Box>
        </Stack>

        {/* Why it repeats / this week's move / how you'll know */}
        <SectionHead title="from awareness into action" />
        <Stack cols={200}>
          <Box label="why it keeps happening">{lead(sections.whyItRepeats)}</Box>
          <Box tone="lav" label="this week's move">{lead(sections.thisWeeksMove)}</Box>
          <Box tone="pink" label="how you'll know it's working">{lead(sections.howYoullKnow)}</Box>
        </Stack>

        {/* Sections */}
        <SectionHead title="tap any section for your full deep dive" />
        <Stack cols={260}>
          {SECTION_META.map((meta) => {
            const tone = toneFromBg(meta.bg);
            return (
              <Link key={meta.key} href={`/my-chart/${bodyId}/${meta.key}`} className="no-underline hd-tile" style={{ display: "block", borderRadius: 18 }}>
                <Box tone={tone} label={meta.title}>
                  {lead(sections[meta.key])}
                  <div>
                    <span style={goDeeper(tone === "dark")}>go deeper →</span>
                  </div>
                </Box>
              </Link>
            );
          })}
          {/* House context card fills the 8th slot */}
          <Box tone="lav" label="where it lives">
            {lead(
              houseMeaning
                ? `This placement sits in your ${ordinalHouse(house!)} house of ${houseMeaning.title}, ${houseMeaning.rules}. ${houseMeaning.coach}`
                : "This placement colours your whole chart rather than one single life area."
            )}
            {house && (
              <div>
                <Link href={`/my-chart/house/${house}`} className="no-underline" style={goDeeper(false)}>
                  explore your {ordinalHouse(house)} house →
                </Link>
              </div>
            )}
          </Box>
        </Stack>

        {/* Prompts + affirmations */}
        <SectionHead title="make it yours" />
        <Stack cols={260}>
          <Box label="journal prompts">
            <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
              {sections.prompts.map((prompt, i) => (
                <p key={i} style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>
                  {i + 1}. {prompt}
                </p>
              ))}
            </div>
            <PinkLink href="/journal">journal on this</PinkLink>
          </Box>
          <Box tone="pink" label="your affirmations">
            <div style={{ display: "grid", gap: 14 }}>
              {sections.affirmations.map((aff, i) => (
                <p key={i} style={{ fontFamily: poppins, fontSize: 19, fontWeight: 800, lineHeight: 1.35 }}>
                  &ldquo;{aff}&rdquo;
                </p>
              ))}
            </div>
          </Box>
        </Stack>
      </DeepDiveBody>
    </DeepDivePage>
  );
}
