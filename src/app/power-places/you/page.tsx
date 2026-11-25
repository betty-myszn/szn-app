"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSavedBirthData } from "@/lib/url-params";
import { useMember } from "@/lib/use-member";
import { mountPowerPlaces } from "@/lib/astrocartography/mount";
import { JOIN_CTA } from "@/lib/cta";
import type { ChartData } from "@/types/chart";
import "../../your-season/places/places.css";

// The free power places map: her top three for live, travel, love, money and glow up, the map and the
// share card, worked out from the birth details she just typed on /power-places. Members get sent to
// their full page instead.

export default function FreePowerPlaces() {
  const router = useRouter();
  const { member, ready } = useMember();
  const rootRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [state, setState] = useState<"loading" | "missing" | "error" | "ok">("loading");

  useEffect(() => {
    if (!ready) return;
    // ?preview lets the owner see the free view while signed in, on a dev server only.
    const preview = process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).has("preview");
    if (member && !preview) { router.replace("/your-season/places"); return; }
    const birth = getSavedBirthData();
    if (!birth || !birth.location) { setState("missing"); return; }
    fetch("/api/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(birth) })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((c: ChartData) => { setChart(c); setState("ok"); })
      .catch(() => setState("error"));
  }, [ready, member, router]);

  useEffect(() => {
    if (state !== "ok" || !chart || !rootRef.current) return;
    return mountPowerPlaces(rootRef.current, chart, { free: true, joinHref: JOIN_CTA.href });
  }, [state, chart]);

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
      </div>
    );
  }
  if (state !== "ok") {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
            {state === "missing" ? "pop in your birth details first, babe." : "your map didn't draw this time."}
          </h1>
          <Link href="/power-places" className="btn-pink">{state === "missing" ? "add my birth details" : "try again"}</Link>
        </div>
      </section>
    );
  }
  return <div className="acg" ref={rootRef} />;
}
