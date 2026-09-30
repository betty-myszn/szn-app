"use client";

import { useState } from "react";
import Link from "next/link";
import { getNextSeason, type SeasonInfo } from "@/lib/seasons";
import { LIFE_AREAS, composeLifeArea, type LifeAreaMeta } from "@/lib/life-areas";
import { ordinalHouse } from "@/lib/interpretations";
import { eraName, findBreakthrough, pickCardLine, shortLabel, AREA_FLAVOUR } from "@/lib/szn-picks";
import SznWheel from "@/components/SznWheel";
import SznShareCard from "@/components/SznShareCard";
import type { ChartData, TransitData } from "@/types/chart";
import type { Goal } from "@/lib/goals-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Her szn, area by area. With "customise my szn" picks, the areas she wants MORE of lead as full
// cards in the order she chose them, and everything else sits underneath as the compact tiles, so
// her whole chart stays in view. Without picks it is the plain tile grid plus an invitation.
//
// The tiles stay compact by design: the real depth (planet/sign/house explainers, live transits,
// protocol, affirmations, activation ritual) lives on each area's page at /your-season/life/[area].
export default function LifeAreasGuide({
  season,
  chart,
  goal,
  transits,
  picks,
  pickSeason,
  dismissed,
  onPicksChange,
  onDismiss,
}: {
  season: SeasonInfo;
  chart: ChartData | null;
  goal: Goal | null;
  transits?: TransitData;
  /** null = never chosen, [] = skipped */
  picks: string[] | null;
  pickSeason: string | null;
  dismissed: boolean;
  onPicksChange: (next: string[]) => void;
  onDismiss: () => void;
}) {
  const [sharing, setSharing] = useState(false);
  const sign = season.sign.toLowerCase();
  const hasPicks = !!picks && picks.length > 0;
  const next = getNextSeason();

  if (!chart) {
    return (
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-2">your szn, area by area</div>
          <p style={{ fontSize: 13, color: "var(--grey-light)", marginBottom: 16 }}>Add your birth details to unlock this for every area of your life.</p>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  const pickedMeta = hasPicks ? (picks!.map((id) => LIFE_AREAS.find((a) => a.id === id)).filter(Boolean) as LifeAreaMeta[]) : [];
  const rest = LIFE_AREAS.filter((a) => !picks?.includes(a.id));
  const breakthrough = hasPicks
    ? findBreakthrough(rest.map((a) => a.id).filter((id) => AREA_FLAVOUR[id]), transits?.activatedPlacements, picks!)
    : null;
  const newSeason = hasPicks && !!pickSeason && pickSeason !== season.sign;

  const tile = (area: LifeAreaMeta, canAdd: boolean) => {
    const reading = composeLifeArea(area.id, chart, season, goal);
    const tied = Boolean(goal && reading?.goalTieIn);
    return (
      <div
        key={area.id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 12px 12px 16px",
          borderRadius: 14,
          border: `2px solid ${tied ? "var(--pink)" : "var(--dark)"}`,
          background: tied ? "var(--pink-bg)" : "#fff",
        }}
      >
        <Link href={`/your-season/life/${area.id}`} className="no-underline hover:opacity-90 transition-opacity" style={{ display: "flex", alignItems: "center", gap: 11, flex: 1, minWidth: 0, color: "var(--dark)" }}>
          <span style={{ fontSize: 21, lineHeight: 1, flexShrink: 0 }}>{area.emoji}</span>
          <span style={{ minWidth: 0, flex: 1 }}>
            <span style={{ display: "block", fontFamily: poppins, fontSize: 15, fontWeight: 800, letterSpacing: "-0.3px", lineHeight: 1.2 }}>{area.label}</span>
            <span style={{ display: "block", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: tied ? "var(--pink)" : "#3C2A70", marginTop: 3 }}>
              {tied ? "tied to your goal" : `${ordinalHouse(area.houseNumbers[0])} house`}
            </span>
          </span>
          {!canAdd && (
            <span aria-hidden style={{ fontSize: 15, color: "var(--pink)", flexShrink: 0 }}>
              &rarr;
            </span>
          )}
        </Link>
        {canAdd && AREA_FLAVOUR[area.id] && (
          <button type="button" className="szn-more" onClick={() => onPicksChange([...(picks ?? []), area.id])} aria-label={`Add ${shortLabel(area.id)} to your picks`}>
            ＋ more
          </button>
        )}
      </div>
    );
  };

  const tileGrid = (areas: LifeAreaMeta[], canAdd: boolean) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>{areas.map((a) => tile(a, canAdd))}</div>
  );

  // ── No picks yet (or she skipped): the plain grid, with an invitation until she answers it ──
  if (!hasPicks) {
    return (
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          {picks === null && !dismissed && (
            <div className="szn-holo" style={{ position: "relative", border: "2px solid var(--dark)", borderRadius: 20, padding: "24px 22px 20px", marginBottom: 30, boxShadow: "5px 5px 0 var(--pink)" }}>
              <span className="szn-sticker">new</span>
              <div className="flex items-center gap-5 flex-wrap">
                <div style={{ width: 96, flexShrink: 0 }}>
                  <SznWheel picks={["money", "relationships", "career"]} showCount={false} />
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h3 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.05, textTransform: "lowercase", margin: "0 0 8px" }}>
                    make your season <span className="szn-holo-text">yours</span> ✦
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 14px", maxWidth: 520 }}>
                    {`Tap what you want MORE of this ${sign} szn, money, love, career, whatever's calling you, and your dashboard reshuffles around it. Switch it up anytime from your menu.`}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link href="/your-season/customise" className="szn-pill hot szn-holo-hot no-underline">
                      customise my szn ✦
                    </Link>
                    <button type="button" onClick={onDismiss} style={{ background: "none", border: "none", fontSize: 12, color: "var(--grey)", textDecoration: "underline", cursor: "pointer" }}>
                      not now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="tag mb-2">your szn, area by area</div>
          <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-0.7px", marginBottom: 10 }}>how {sign} szn is hitting every part of your life.</h2>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.8, marginBottom: 20, maxWidth: 640 }}>
            Tap any area for what&apos;s being activated in your chart, the live transit hitting it right now, your protocol, affirmations and activation ritual.
            {(picks !== null || dismissed) && (
              <>
                {" "}
                <Link href="/your-season/customise" style={{ color: "var(--pink)", fontWeight: 700 }}>
                  Build this around what you want more of →
                </Link>
              </>
            )}
          </p>
          {tileGrid(LIFE_AREAS, false)}
        </div>
      </section>
    );
  }

  // ── Her picks lead ──
  return (
    <section id="your-picks" className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)", background: "linear-gradient(180deg, var(--pink-bg) 0%, #fff 70%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="szn-holo" style={{ position: "relative", border: "2px solid var(--dark)", borderRadius: 22, padding: "24px 22px", boxShadow: "5px 5px 0 var(--pink)", marginBottom: 18 }}>
          <span className="szn-sticker" style={{ left: "auto", right: 18, transform: "rotate(4deg)" }}>
            made for you ✦
          </span>
          <div className="grid gap-5 items-center" style={{ gridTemplateColumns: "minmax(0, 1fr) auto" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 8 }}>your {sign} szn, built around you</div>
              <h2 style={{ fontFamily: poppins, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.98, textTransform: "lowercase", margin: "0 0 14px", textWrap: "balance" }}>
                your {eraName(picks!).replace(/ era$/, "")} <span className="szn-holo-text">era.</span>
              </h2>
              <div className="flex flex-wrap gap-2" style={{ marginBottom: 16 }}>
                {picks!.map((id, i) => (
                  <span key={id} className="szn-chip">
                    <i>{i + 1}</i>
                    {shortLabel(id)}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button type="button" className="szn-pill hot szn-holo-hot" onClick={() => setSharing(true)}>
                  share my szn ✦
                </button>
                <Link href="/your-season/customise" className="szn-pill no-underline">
                  customise
                </Link>
              </div>
            </div>
            <div className="hidden sm:block" style={{ width: 150 }}>
              <SznWheel picks={picks!} showCount={false} />
            </div>
          </div>
        </div>

        {newSeason ? (
          <div className="flex items-center justify-between gap-3 flex-wrap" style={{ border: "1.5px dashed var(--pink)", background: "var(--pink-light)", borderRadius: 14, padding: "12px 16px", marginBottom: 28 }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>
              <b style={{ color: "var(--pink)" }}>new season, new picks ✦</b>
              {` It's ${sign} szn now. Keep your picks for this one or switch them up.`}
            </p>
            <div className="flex gap-2">
              <button type="button" className="szn-pill" onClick={() => onPicksChange(picks!)}>
                keep them
              </button>
              <Link href="/your-season/customise" className="szn-pill hot szn-holo-hot no-underline">
                switch it up
              </Link>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: "0 0 28px", padding: "10px 14px", background: "var(--pink-light)", border: "1.5px dashed var(--pink)", borderRadius: 12 }}>
            Your picks roll into <b style={{ color: "var(--pink)" }}>{next.sign.toLowerCase()} szn on {next.startDay} {MONTHS[next.startMonth - 1]}</b>, when you get to choose again. Switch them up anytime before then.
          </p>
        )}

        <div className="tag mb-3">your picks</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 36 }}>
          {pickedMeta.map((area, i) => {
            const r = composeLifeArea(area.id, chart, season, goal, transits);
            if (!r) return null;
            const live = r.transitLines.length > 0;
            return (
              <article key={area.id} className="szn-pickcard">
                <span className="szn-num">{i + 1}</span>
                <div className="flex items-baseline justify-between gap-2" style={{ marginBottom: 8 }}>
                  <h3 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", textTransform: "lowercase", margin: 0 }}>{shortLabel(area.id)}</h3>
                  {live && (
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: "var(--pink)", borderRadius: 40, padding: "4px 9px", whiteSpace: "nowrap" }}>
                      live transit
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 10 }}>
                  {ordinalHouse(r.house)} house · {r.bodyLabel} in {r.sign.toLowerCase()}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>
                  {pickCardLine(
                    { label: shortLabel(area.id), house: r.house, bodyLabel: r.bodyLabel, sign: r.sign, cuspSign: r.cuspSign, ruler: r.rulerPlacement },
                    i,
                  )}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/your-season/life/${area.id}`} className="no-underline" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>
                    read your full {shortLabel(area.id)} read →
                  </Link>
                  {picks!.length > 1 && (
                    <button type="button" className="szn-tune" onClick={() => onPicksChange(picks!.filter((x) => x !== area.id))} aria-label={`Less ${shortLabel(area.id)}`}>
                      less
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {rest.length > 0 && (
          <>
            <div className="tag mb-3">the rest of your chart</div>
            {breakthrough && (
              <div style={{ position: "relative", border: "2px solid var(--pink)", borderRadius: 16, padding: "18px 18px 14px", background: "#fff", marginBottom: 14 }}>
                <span className="szn-sticker">heads up</span>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                  <b>{`You didn't pick ${shortLabel(breakthrough.areaId)}, but this one's big.`}</b>
                  {` Transiting ${breakthrough.hit.activatedBy.toLowerCase()} is making ${/^[aeiou]/.test(breakthrough.hit.aspectType) ? "an" : "a"} ${breakthrough.hit.aspectType} to your natal ${breakthrough.hit.natalPlanet.toLowerCase()} in your ${ordinalHouse(breakthrough.hit.natalHouse)} house right now, so we're flagging it anyway. `}
                  <Link href={`/your-season/life/${breakthrough.areaId}`} style={{ color: "var(--pink)", fontWeight: 700 }}>
                    read it →
                  </Link>
                </p>
              </div>
            )}
            {tileGrid(rest, true)}
          </>
        )}
      </div>
      {sharing && <SznShareCard picks={picks!} sign={season.sign} onClose={() => setSharing(false)} />}
    </section>
  );
}
