"use client";

import { useEffect, useState } from "react";
import { getSavedBirthData } from "@/lib/url-params";
import { hydrateMemberDataFromSupabase } from "@/lib/chart-sync";
import type { SeasonDesignReading } from "@/types/season-design";

// Fetches the combined season + Human Design reading for the saved birth data.
// Cached per session per season. Mirrors useHumanDesign; the calc is server-side
// because Swiss Ephemeris is native.
export function useSeasonDesign(sign?: string): {
  reading: SeasonDesignReading | null;
  loading: boolean;
  unavailable: boolean;
} {
  const [reading, setReading] = useState<SeasonDesignReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `myszn_season_design_${sign ?? "current"}`;

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
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as SeasonDesignReading;
          setReading(parsed);
          setLoading(false);
          return;
        }
      } catch {
        // fall through to fetch
      }

      const url = sign ? `/api/season-design?sign=${encodeURIComponent(sign)}` : "/api/season-design";
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthData),
      })
        .then((res) => {
          if (res.status === 404) {
            if (!cancelled) setUnavailable(true);
            return null;
          }
          return res.ok ? res.json() : null;
        })
        .then((d: SeasonDesignReading | null) => {
          if (cancelled || !d) return;
          setReading(d);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(d));
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
  }, [sign]);

  return { reading, loading, unavailable };
}
