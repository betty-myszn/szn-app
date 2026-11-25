"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { mountPowerPlaces } from "@/lib/astrocartography/mount";
import BestieForm from "./BestieForm";
import "./places.css";

type Mounted = (() => void) & { setBestie?: (chart: unknown, name: string) => void; bestieSlot?: HTMLElement | null };

// Your power places: astrocartography for the member's own chart. Where to live, where to travel and
// where to go to switch on love, money, career and the rest. Lines are computed in the browser from
// the chart she already has (Julian day + planet positions), so there is no API call and no new data.

const poppins = "var(--font-poppins), Poppins, sans-serif";

export default function PowerPlacesPage() {
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const rootRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<Mounted | null>(null);

  // The chart can arrive while the spinner is still showing, so wait until the container is on the
  // page too (loading/ready/member flip after chart does on some paths).
  const showing = ready && !!member && !loading && !!chart;
  useEffect(() => {
    if (!showing || !chart || !rootRef.current) return;
    const m = mountPowerPlaces(rootRef.current, chart) as Mounted;
    setApi(() => m);
    return () => { setApi(null); m(); };
  }, [showing, chart]);

  if (!ready) return null;
  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>members only, babe.</h1>
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
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>add your birth details to unlock your astro map.</h1>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }
  return (
    <>
      <div className="acg" ref={rootRef} />
      {api?.bestieSlot && createPortal(<BestieForm onChart={(c, n) => api.setBestie?.(c, n)} />, api.bestieSlot)}
    </>
  );
}
