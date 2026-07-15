import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Birth Chart Results | Full Natal Chart Breakdown",
  description:
    "Your personalised birth chart results. Sun sign, moon sign, rising sign, Venus, Mars, Jupiter, Chiron, and all 12 house placements with detailed interpretations.",
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
