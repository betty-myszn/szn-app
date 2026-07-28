import type { Metadata } from "next";

// Results are personal output keyed off birth details in the URL, so every visitor produces a
// different variant of the same page. Indexing that would fill Search Console with near-duplicate
// thin pages and expose strangers' birth data in search results. /chart is the page meant to rank.
export const metadata: Metadata = {
  title: "Your Birth Chart Results | Full Natal Chart Breakdown",
  description:
    "Your personalised birth chart results. Sun sign, moon sign, rising sign, Venus, Mars, Jupiter, Chiron, and all 12 house placements with detailed interpretations.",
  robots: { index: false, follow: true },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
