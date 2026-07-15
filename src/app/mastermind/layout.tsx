import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Astrology Mastermind | Coaching, Community & Birth Chart Portal",
  description:
    "Apply to MY SZN, the 3-month astrology mastermind for women ready to stop playing small. Live workshops, subconscious rewiring, personalised birth chart portal, and a community of ambitious women. Limited founding member spots.",
  openGraph: {
    title: "MY SZN Mastermind — Your Era Starts Now",
    description: "The astrology-led mastermind for ambitious women. 3-month commitment. Live coaching, birth chart portal, subconscious rewiring. Limited spots launching July 2026.",
  },
};

export default function MastermindLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
