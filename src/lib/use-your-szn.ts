"use client";

import { useEffect, useState } from "react";
import { getSavedBirthData } from "@/lib/url-params";
import type { YourSznData } from "@/types/chart";

// Fetches the live personalised transit data for the saved chart.
// Returns null data when no real birth data is saved (mock/demo member).
export function useYourSzn(): { data: YourSznData | null; loading: boolean } {
  const [data, setData] = useState<YourSznData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const birthData = getSavedBirthData();
    if (!birthData) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch("/api/your-szn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(birthData),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!cancelled && d) setData(d);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
