"use client";

import Link from "next/link";
import ChartResults from "@/components/ChartResults";
import { useChart } from "@/lib/use-chart";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The astrology half of the free reading, on its own page so the results page can be the choice
// between the two charts rather than a very long scroll with one of them buried at the bottom.
//
// Public on purpose: this reads the birth data /results already saved to this browser, so it works
// for someone who has never signed up, which is the entire point of the free chart.
export default function FreeChartReadingPage() {
  const { chart, loading } = useChart();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div
          className="h-10 w-10 animate-spin rounded-full"
          style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we need your birth details first.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            Pop them in and your chart calculates instantly, no signup and no card.
          </p>
          <Link href="/chart" className="btn-pink">get my free chart</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-5 md:px-8 pt-8" style={{ background: "var(--dark)" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/results"
            className="no-underline"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--lav)",
            }}
          >
            ← both charts
          </Link>
        </div>
      </section>
      <ChartResults chart={chart} />
    </>
  );
}
