"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { decodeBirthData } from "@/lib/url-params";
import YourSznDashboard from "@/components/YourSznDashboard";
import type { YourSznData } from "@/types/chart";

function YourSznContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<YourSznData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const birthData = decodeBirthData(searchParams);
    if (!birthData) {
      setError("We need your birth data to create your personalised guide. Generate your chart first.");
      setLoading(false);
      return;
    }

    fetch("/api/your-szn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(birthData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to generate your personalised guide");
        return res.json();
      })
      .then((d) => setData(d))
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
            reading the sky for you...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 py-32">
        <div className="text-center" style={{ maxWidth: 440 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <div
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--pink)", marginBottom: 12,
            }}
          >
            one more step
          </div>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>{error}</p>
          <a
            href="/chart"
            className="inline-block mt-6"
            style={{
              background: "var(--pink)", color: "#fff", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 28px",
              border: "none", textDecoration: "none",
            }}
          >
            generate my chart
          </a>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return <YourSznDashboard data={data} />;
}

export default function YourSznPage() {
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
      <YourSznContent />
    </Suspense>
  );
}
