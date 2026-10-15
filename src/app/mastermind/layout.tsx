import type { Metadata } from "next";

// The Mastermind page is a client component, so its SEO lives here. Took over the homepage's
// mastermind positioning when / became the MY SZN brand homepage (13 Oct 2026).
export const metadata: Metadata = {
  title: "The MY SZN Mastermind, 90 Days of Astrology-Backed Manifestation Coaching",
  description:
    "The 90-day astrology-backed manifestation mastermind for ambitious women: a private 1:1 with Betty every month, group coaching every season, Human Design, self-concept, shadow work and accountability. $1,500 for 90 days. Join the waitlist.",
  alternates: { canonical: "/mastermind" },
  openGraph: {
    title: "The MY SZN Mastermind",
    description: "90 days of becoming HER, with private coaching from Betty every month. Waitlist open now.",
    url: "/mastermind",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function MastermindLayout({ children }: { children: React.ReactNode }) {
  return children;
}
