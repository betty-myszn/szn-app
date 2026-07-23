"use client";

import { useEffect, useState } from "react";
import { getSavedBirthData, savePlacements, placementsFromChart } from "@/lib/url-params";
import { hydrateMemberDataFromSupabase, fetchMatchingChartFromSupabase, syncChartToSupabase } from "@/lib/chart-sync";
import type { ChartData } from "@/types/chart";

const CACHE_KEY = "myszn_chart_cache";

// Fetches the full calculated chart for the saved birth data, cached per session.
export function useChart(): { chart: ChartData | null; loading: boolean } {
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      let birthData = getSavedBirthData();
      // No chart in this browser yet, could just be a new device for an existing member,
      // pull her real birth data + cached chart down from Supabase before giving up.
      if (!birthData) {
        const hydrated = await hydrateMemberDataFromSupabase();
        if (cancelled) return;
        if (hydrated) birthData = getSavedBirthData();
      }
      if (!birthData) {
        setLoading(false);
        return;
      }

      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as ChartData;
          const sameLocation =
            parsed.birthData?.location?.latitude === birthData.location?.latitude &&
            parsed.birthData?.location?.longitude === birthData.location?.longitude &&
            parsed.birthData?.location?.timezone === birthData.location?.timezone;
          if (
            parsed.birthData?.dateOfBirth === birthData.dateOfBirth &&
            parsed.birthData?.birthTime === birthData.birthTime &&
            sameLocation
          ) {
            setChart(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fall through to fetch
      }

      const fromSupabase = await fetchMatchingChartFromSupabase(birthData);
      if (cancelled) return;
      if (fromSupabase) {
        setChart(fromSupabase);
        setLoading(false);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(fromSupabase));
        } catch {
          // cache full, not critical
        }
        return;
      }

      fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthData),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((d: ChartData | null) => {
          if (cancelled || !d) return;
          setChart(d);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(d));
          } catch {
            // cache full, not critical
          }
          const placements = placementsFromChart(d);
          savePlacements(placements);
          syncChartToSupabase(d, placements);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { chart, loading };
}
