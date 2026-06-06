"use client";

import { useState } from "react";
import type {
  YourSznData,
  FocusArea,
  TransitAspect,
  ActivatedPlacement,
  Recommendation,
} from "@/types/chart";
import {
  PLANET_SYMBOLS,
  ASPECT_CONFIG,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
  ZODIAC_SIGNS,
  ZODIAC_SYMBOLS,
} from "@/types/chart";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const sectionLabel = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: "var(--grey-light)",
  marginBottom: 8,
};

const sectionHeading = {
  fontFamily: poppins,
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: "-0.3px",
  color: "var(--dark)",
  lineHeight: 1.15,
};

function SignBadge({ sign }: { sign: string }) {
  const element = SIGN_ELEMENTS[sign] || "air";
  const color = ELEMENT_COLORS[element];
  const idx = ZODIAC_SIGNS.indexOf(sign as (typeof ZODIAC_SIGNS)[number]);
  const symbol = idx >= 0 ? ZODIAC_SYMBOLS[idx] : "";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {symbol} {sign}
    </span>
  );
}

function AspectBadge({ type }: { type: string }) {
  const config = ASPECT_CONFIG[type as keyof typeof ASPECT_CONFIG];
  if (!config) return null;
  return (
    <span className="text-xs font-semibold" style={{ color: config.color }}>
      {config.symbol} {type}
    </span>
  );
}

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className="px-8 py-12 mx-auto max-w-4xl"
      style={{ borderBottom: "var(--border)" }}
    >
      {children}
    </section>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const typeLabels: Record<string, string> = {
    article: "READ",
    hypnosis: "LISTEN",
    tapping: "TRY",
    workshop: "WATCH",
    reading: "BOOK",
    placement: "EXPLORE",
    podcast: "LISTEN",
  };

  return (
    <div
      className="p-5 flex gap-4 items-start hover:bg-[#fafafa] transition-colors cursor-pointer"
      style={{ border: "var(--border)" }}
    >
      <div style={{ fontSize: 28 }}>{rec.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--pink)",
            }}
          >
            {typeLabels[rec.type] || rec.type}
          </span>
        </div>
        <div
          style={{
            fontFamily: poppins,
            fontSize: 15,
            fontWeight: 700,
            color: "var(--dark)",
            marginBottom: 4,
          }}
        >
          {rec.title}
        </div>
        <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6, margin: 0 }}>
          {rec.description}
        </p>
        <div style={{ fontSize: 10, color: "var(--grey-light)", marginTop: 6 }}>
          Based on: {rec.basedOn}
        </div>
      </div>
    </div>
  );
}

export default function YourSznDashboard({ data }: { data: YourSznData }) {
  const [expandedFocus, setExpandedFocus] = useState<string | null>(null);
  const { transits, theme, focusAreas, manifestationMission, journalPrompts, forecast, nextBestStep, recommendations } = data;

  const sunTransit = transits.currentPositions.find((p) => p.name === "Sun");
  const currentSzn = sunTransit?.sign?.toLowerCase() || "cosmic";
  const sznIdx = ZODIAC_SIGNS.indexOf(sunTransit?.sign as (typeof ZODIAC_SIGNS)[number]);
  const sznSymbol = sznIdx >= 0 ? ZODIAC_SYMBOLS[sznIdx] : "✨";

  return (
    <div>
      {/* Hero Header */}
      <div
        className="px-8 py-14"
        style={{ background: "var(--dark)" }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: 28 }}>{transits.moonPhase.emoji}</span>
            <div className="tag">your szn</div>
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: 14,
            }}
          >
            hey, {data.birthData.name.split(" ")[0]}.<br />
            here&apos;s your <span className="pk">{currentSzn} szn. {sznSymbol}</span>
          </h1>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 520,
            }}
          >
            Your personalised guide to the month ahead based on your birth chart, current transits, and where you&apos;re being called to grow.
          </p>
          <div
            className="flex items-center gap-4 mt-6"
            style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}
          >
            <span>{transits.moonPhase.emoji} {transits.moonPhase.phase} &middot; {transits.moonPhase.illumination}% illuminated</span>
          </div>
        </div>
      </div>

      {/* Theme of the Month */}
      <Section>
        <div style={sectionLabel}>your theme of the month</div>
        <h2 style={{ ...sectionHeading, fontSize: 28, marginBottom: 12 }}>
          {theme.title}
        </h2>
        <p style={{ fontSize: 15, color: "var(--grey)", lineHeight: 1.8, maxWidth: 600, margin: 0 }}>
          {theme.description}
        </p>
        {theme.keyTransits.length > 0 && (
          <div className="mt-6 space-y-2">
            <div style={{ ...sectionLabel, marginBottom: 10 }}>key transits driving this</div>
            {theme.keyTransits.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-2"
                style={{ fontSize: 13, color: "var(--dark)" }}
              >
                <span style={{ color: "var(--pink)", fontSize: 8 }}>●</span>
                {t}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* What's Happening in the Sky */}
      <Section id="sky">
        <div style={sectionLabel}>what&apos;s happening in the sky</div>
        <h2 style={{ ...sectionHeading, marginBottom: 20 }}>
          current transits to your chart
        </h2>
        <div className="space-y-0">
          {transits.transitAspects
            .filter((a) => a.significance !== "minor")
            .slice(0, 10)
            .map((aspect, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-3 py-3"
                style={{ borderBottom: "1px solid #eee" }}
              >
                <div style={{ fontSize: 13, color: "var(--dark)" }}>
                  <span style={{ opacity: 0.5, marginRight: 4 }}>{PLANET_SYMBOLS[aspect.transitPlanet]}</span>
                  {aspect.transitPlanet} in <SignBadge sign={aspect.transitSign} />
                </div>
                <div>
                  <AspectBadge type={aspect.aspectType} />
                </div>
                <div style={{ fontSize: 13, color: "var(--dark)" }}>
                  <span style={{ opacity: 0.5, marginRight: 4 }}>{PLANET_SYMBOLS[aspect.natalPlanet]}</span>
                  natal {aspect.natalPlanet} in <SignBadge sign={aspect.natalSign} />
                </div>
                <div className="font-mono text-xs" style={{ color: "var(--grey-light)" }}>
                  {aspect.orb.toFixed(1)}°
                </div>
                <div>
                  <span
                    className="text-xs px-2 py-0.5"
                    style={{
                      background: aspect.significance === "major" ? "var(--pink-light)" : "#f5f5f5",
                      color: aspect.significance === "major" ? "var(--pink)" : "var(--grey-light)",
                      fontWeight: 700,
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {aspect.significance}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </Section>

      {/* Focus Areas */}
      <Section id="focus">
        <div style={sectionLabel}>focus areas</div>
        <h2 style={{ ...sectionHeading, marginBottom: 20 }}>
          where energy is moving
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {focusAreas.map((area) => (
            <button
              key={area.area}
              type="button"
              onClick={() => setExpandedFocus(expandedFocus === area.area ? null : area.area)}
              className="text-left p-5 transition-all hover:bg-[#fafafa]"
              style={{
                border: expandedFocus === area.area ? "1.5px solid var(--pink)" : "var(--border)",
                cursor: "pointer",
                background: expandedFocus === area.area ? "var(--pink-light)" : "#fff",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{area.emoji}</div>
              <div
                style={{
                  fontFamily: poppins,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--dark)",
                  marginBottom: 6,
                }}
              >
                {area.area}
              </div>
              <div style={{ fontSize: 12, color: "var(--grey-light)" }}>
                {area.activePlanets.length} active transit{area.activePlanets.length !== 1 ? "s" : ""}
              </div>
            </button>
          ))}
        </div>
        {expandedFocus && (
          <div className="mt-4 p-6" style={{ border: "var(--border)", background: "#fafafa" }}>
            {(() => {
              const area = focusAreas.find((a) => a.area === expandedFocus);
              if (!area) return null;
              return (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 20 }}>{area.emoji}</span>
                    <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 700, color: "var(--dark)" }}>
                      {area.area}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, margin: "0 0 12px" }}>
                    {area.summary}
                  </p>
                  {area.activePlanets.length > 0 && (
                    <div style={{ fontSize: 12, color: "var(--grey-light)" }}>
                      <span style={{ ...sectionLabel, display: "inline" }}>Active:</span>{" "}
                      {area.activePlanets.join(" · ")}
                    </div>
                  )}
                  <button
                    type="button"
                    className="mt-4"
                    style={{
                      background: "transparent",
                      color: "var(--pink)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "8px 0",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    go deeper →
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </Section>

      {/* Manifestation Mission */}
      <div className="px-8 py-14" style={{ background: "var(--dark)" }}>
        <div className="mx-auto max-w-4xl">
          <div style={{ ...sectionLabel, color: "rgba(255,255,255,0.4)" }}>your manifestation mission</div>
          <h2
            style={{
              fontFamily: poppins,
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: 12,
              letterSpacing: "-0.3px",
            }}
          >
            {manifestationMission.mission}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 20 }}>
            Based on: {manifestationMission.basedOn}
          </p>
          <div
            className="p-5"
            style={{ border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
          >
            <div style={{ ...sectionLabel, color: "var(--pink)", marginBottom: 8 }}>your action step</div>
            <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {manifestationMission.actionStep}
            </p>
          </div>
        </div>
      </div>

      {/* Journal Prompts */}
      <Section id="journal">
        <div style={sectionLabel}>your journal prompts</div>
        <h2 style={{ ...sectionHeading, marginBottom: 20 }}>
          questions for this month
        </h2>
        <div className="space-y-0">
          {journalPrompts.map((jp, i) => (
            <div
              key={i}
              className="py-5 flex gap-4"
              style={{ borderBottom: "1px solid #eee" }}
            >
              <div
                style={{
                  fontFamily: poppins,
                  fontSize: 24,
                  fontWeight: 800,
                  color: "var(--pink)",
                  opacity: 0.3,
                  minWidth: 32,
                }}
              >
                {i + 1}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 16,
                    color: "var(--dark)",
                    lineHeight: 1.5,
                    margin: "0 0 6px",
                    fontWeight: 500,
                  }}
                >
                  {jp.prompt}
                </p>
                <div style={{ fontSize: 11, color: "var(--grey-light)" }}>
                  {jp.relatedPlacement}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Power Placements */}
      <Section id="power">
        <div style={sectionLabel}>your power placements</div>
        <h2 style={{ ...sectionHeading, marginBottom: 8 }}>
          placements being activated right now
        </h2>
        <p style={{ fontSize: 13, color: "var(--grey-light)", marginBottom: 20 }}>
          These natal placements are receiving direct energy from current transits.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {transits.activatedPlacements.map((ap, i) => (
            <div
              key={i}
              className="p-4 text-center hover:bg-[#fafafa] transition-colors cursor-pointer"
              style={{ border: "var(--border)" }}
            >
              <div style={{ fontSize: 20, marginBottom: 6, opacity: 0.7 }}>
                {PLANET_SYMBOLS[ap.natalPlanet] || ""}
              </div>
              <div
                style={{
                  fontFamily: poppins,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--dark)",
                  marginBottom: 4,
                }}
              >
                {ap.natalPlanet} in {ap.natalSign}
              </div>
              <div style={{ fontSize: 11, color: "var(--grey-light)", marginBottom: 6 }}>
                House {ap.natalHouse}
              </div>
              <div
                className="inline-block px-2 py-0.5"
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "var(--pink-light)",
                  color: "var(--pink)",
                }}
              >
                {ap.theme}
              </div>
              <div style={{ fontSize: 10, color: "var(--grey-light)", marginTop: 6 }}>
                via {ap.activatedBy} {ap.aspectType}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Recommended For You */}
      <Section id="recommended">
        <div style={sectionLabel}>recommended for you</div>
        <h2 style={{ ...sectionHeading, marginBottom: 8 }}>
          curated for your chart & transits
        </h2>
        <p style={{ fontSize: 13, color: "var(--grey-light)", marginBottom: 20 }}>
          Content and tools chosen based on what&apos;s active in your chart right now.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} />
          ))}
        </div>
      </Section>

      {/* Cosmic Forecast */}
      <Section id="forecast">
        <div style={sectionLabel}>this month&apos;s cosmic forecast</div>
        <h2 style={{ ...sectionHeading, marginBottom: 20 }}>
          your personalised outlook
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-5" style={{ border: "var(--border)" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>✨</div>
            <div style={{ ...sectionLabel, color: "var(--pink)" }}>biggest opportunity</div>
            <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.6, margin: 0 }}>
              {forecast.biggestOpportunity}
            </p>
          </div>
          <div className="p-5" style={{ border: "var(--border)" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>⚡</div>
            <div style={{ ...sectionLabel, color: "#E25822" }}>biggest challenge</div>
            <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.6, margin: 0 }}>
              {forecast.biggestChallenge}
            </p>
          </div>
          <div className="p-5" style={{ border: "var(--border)" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>💚</div>
            <div style={{ ...sectionLabel, color: "#6B8E23" }}>say yes to</div>
            <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.6, margin: 0 }}>
              {forecast.sayYesTo}
            </p>
          </div>
          <div className="p-5" style={{ border: "var(--border)" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>🚫</div>
            <div style={{ ...sectionLabel }}>what to avoid</div>
            <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.6, margin: 0 }}>
              {forecast.avoid}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="p-5" style={{ border: "var(--border)" }}>
            <div style={{ ...sectionLabel, color: "var(--lav)" }}>lucky days</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {forecast.luckyDays.map((d, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs font-semibold"
                  style={{ background: "#f8f4ff", color: "var(--lav)", border: "1px solid var(--lav)" }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5" style={{ border: "var(--border)" }}>
            <div style={{ ...sectionLabel, color: "var(--pink)" }}>manifestation dates</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {forecast.manifestationDates.map((d, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs font-semibold"
                  style={{ background: "var(--pink-light)", color: "var(--pink)", border: "1px solid var(--pink)" }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Next Best Step — CTA */}
      <div className="px-8 py-16" style={{ background: "var(--dark)" }}>
        <div className="mx-auto max-w-4xl text-center">
          <div style={{ fontSize: 32, marginBottom: 16 }}>🌙</div>
          <div style={{ ...sectionLabel, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
            your next best step
          </div>
          <p
            style={{
              fontFamily: poppins,
              fontSize: 20,
              fontWeight: 600,
              color: "#fff",
              lineHeight: 1.5,
              maxWidth: 480,
              margin: "0 auto 24px",
            }}
          >
            {nextBestStep.message}
          </p>
          <a
            href={nextBestStep.link}
            style={{
              display: "inline-block",
              background: "var(--pink)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "14px 32px",
              border: "none",
              textDecoration: "none",
            }}
          >
            {nextBestStep.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
