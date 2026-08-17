"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { useYourSzn } from "@/lib/use-your-szn";
import { composeLifeArea, LIFE_AREAS, resolveAreaId } from "@/lib/life-areas";
import { useHumanDesign } from "@/lib/use-human-design";
import { composeAreaDesign } from "@/lib/life-area-design";
import WovenAreaRead from "@/components/WovenAreaRead";
import { getPrimaryGoal, type Goal } from "@/lib/goals-store";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function LifeAreaPage() {
  const params = useParams<{ area: string }>();
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const season = useSeason();
  const { data: szn } = useYourSzn();
  // Human Design is loaded alongside the chart rather than on a page of its own, so the two systems
  // can answer the same question together. It resolves independently, and the section below simply
  // does not render until it arrives, so the astrology reading is never held up waiting for it.
  const { hd } = useHumanDesign();
  const [primaryGoal, setPrimaryGoal] = useState<Goal | null>(null);

  useEffect(() => {
    setPrimaryGoal(getPrimaryGoal());
  }, []);

  // Resolves merged areas (business now lives inside career), so an old link still lands.
  const areaId = resolveAreaId(decodeURIComponent(params.area));

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
            Life area guidance is personalised to your exact chart. Add your birth details and every area opens up for you.
          </p>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  const reading = composeLifeArea(areaId, chart, season, primaryGoal, szn?.transits);
  // Null for any area Human Design has nothing specific to say about, which is deliberate.
  const design = hd ? composeAreaDesign(areaId, hd, season.sign) : null;

  if (!reading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t find that life area.
          </h1>
          <Link href="/your-season" className="btn-pink">back to this season</Link>
        </div>
      </section>
    );
  }

  const otherAreas = LIFE_AREAS.filter((a) => a.id !== areaId);

  // Every area now uses the woven astrology + Human Design read (one voice), prototyped on mindset
  // and rolled out from there. The previous stacked layout, which put ~1,200 words of chart
  // mechanics in front of the part that asks her to do something, is gone rather than left
  // unreachable behind a flag; it's in git history if the format ever needs walking back.
  //
  // Ten of the eleven areas have a Human Design config and gate lens. style & fashion doesn't yet,
  // so composeAreaDesign returns null for it. That's handled rather than special-cased: every
  // design-dependent block in WovenAreaRead is behind a `design &&` guard, so style & fashion
  // renders the full astrology read with the design callouts simply absent, and its hero says
  // "your personalised read" instead of promising Human Design it hasn't got.
  return (
    <>
      <section className="px-5 md:px-8 py-4" style={{ background: "var(--dark)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/your-season"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            back to {season.sign.toLowerCase()} szn
          </Link>
        </div>
      </section>
      <section className="px-5 md:px-8 py-10">
        {/* Collapsible preview on confidence only, so Betty can approve the click-to-open design
            before it rolls out to every area. Remove the condition (or set collapsible always) to
            apply it everywhere. */}
        <WovenAreaRead reading={reading} design={design} seasonSign={season.sign} collapsible={areaId === "confidence"} />
      </section>
      <section className="px-5 md:px-8 pb-12">
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Link href="/journal" className="btn-pink" style={{ display: "inline-block" }}>journal on this area</Link>
        </div>
      </section>
      <section className="px-5 md:px-8 py-12" style={{ borderTop: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-5">explore another area of your szn</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
            {otherAreas.map((area, i) => (
              <Link
                key={area.id}
                href={`/your-season/life/${area.id}`}
                className="no-underline p-5 text-center hover:bg-[#fafafa] transition-colors"
                style={{
                  borderRight: (i + 1) % 4 !== 0 ? "var(--border)" : undefined,
                  borderBottom: Math.floor(i / 4) < Math.floor((otherAreas.length - 1) / 4) ? "var(--border)" : undefined,
                  color: "var(--dark)",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>{area.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{area.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
