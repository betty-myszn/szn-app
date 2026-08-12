"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { decodeBirthData, saveBirthData, savePlacements, placementsFromChart } from "@/lib/url-params";
import { syncBirthDataToSupabase, syncChartToSupabase } from "@/lib/chart-sync";
import ChartResults from "@/components/ChartResults";
import FreeHumanDesign from "@/components/FreeHumanDesign";
import type { ChartData } from "@/types/chart";

function ResultsContent() {
  const searchParams = useSearchParams();
  const [chart, setChart] = useState<ChartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const birthData = decodeBirthData(searchParams);
    if (!birthData) {
      setError("Missing or invalid birth data in URL. Please generate a new chart.");
      setLoading(false);
      return;
    }
    saveBirthData(birthData);
    syncBirthDataToSupabase(birthData);

    fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(birthData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Calculation failed");
        return res.json();
      })
      .then((data) => {
        setChart(data);
        // Save key placements for personalisation across the site
        const placements = placementsFromChart(data);
        savePlacements(placements);
        syncChartToSupabase(data, placements);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full"
            style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }}
          />
          <p style={{ marginTop: 16, fontSize: 13, color: "var(--grey)", letterSpacing: "0.04em" }}>
            calculating your birth chart...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 py-32">
        <div className="text-center" style={{ maxWidth: 440 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--pink)",
              marginBottom: 12,
            }}
          >
            something went wrong
          </div>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>{error}</p>
          <a
            href="/chart"
            className="inline-block mt-6"
            style={{
              background: "var(--pink)",
              color: "var(--dark)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "12px 28px",
              border: "none",
              textDecoration: "none",
            }}
          >
            try again
          </a>
        </div>
      </div>
    );
  }

  if (!chart) return null;

  // Both charts from one form. The birth details already collected are exactly what Human Design
  // needs, so making someone retype them into a second calculator to get it would be daft.
  return (
    <>
      <ChartResults chart={chart} />
      <FreeHumanDesign />
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-32">
          <div
            className="h-10 w-10 animate-spin rounded-full"
            style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }}
          />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
