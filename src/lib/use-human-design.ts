"use client";

import { useEffect, useState } from "react";
import { getSavedBirthData } from "@/lib/url-params";
import { hydrateMemberDataFromSupabase } from "@/lib/chart-sync";
import type { HumanDesignData } from "@/types/human-design";

const CACHE_KEY = "myszn_hd_cache";

// Fetches the Human Design chart for the saved birth data, cached per session.
// Same shape as useChart, but hits /api/human-design. Swiss Ephemeris is a native
// Node module, so the calc has to happen server-side, never in the browser.
export function useHumanDesign(): { hd: HumanDesignData | null; loading: boolean } {
  const [hd, setHd] = useState<HumanDesignData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      let birthData = getSavedBirthData();
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
          const parsed = JSON.parse(cached) as HumanDesignData;
          const sameLocation =
            parsed.birthData?.location?.latitude === birthData.location?.latitude &&
            parsed.birthData?.location?.longitude === birthData.location?.longitude &&
            parsed.birthData?.location?.timezone === birthData.location?.timezone;
          if (
            parsed.birthData?.dateOfBirth === birthData.dateOfBirth &&
            parsed.birthData?.birthTime === birthData.birthTime &&
            sameLocation
          ) {
            setHd(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fall through to fetch
      }

      fetch("/api/human-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthData),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((d: HumanDesignData | null) => {
          if (cancelled || !d) return;
          setHd(d);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(d));
          } catch {
            // cache full, not critical
          }
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

  return { hd, loading };
}
