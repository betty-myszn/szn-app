import type { Metadata } from "next";

// The Mastermind page is a client component, so its SEO lives here. Took over the homepage's
// mastermind positioning when / became the MY SZN brand homepage (13 Oct 2026).
export const metadata: Metadata = {
  title: "The Bad B*tch Mastermind, 90 Days of Astrology-Backed Manifestation Coaching",
  description:
    "The 90-day astrology-backed manifestation mastermind for ambitious women: a 1:1 audit and two private sessions with Betty, Telegram access between calls, group coaching every two weeks and the Bad B*tch Coven included. Starts 11th of January 2027, only 8 spots, $3,333. Apply now.",
  alternates: { canonical: "/mastermind" },
  openGraph: {
    title: "The Bad B*tch Mastermind",
    description: "90 days of becoming HER, coached one to one by Betty. Starts the 11th of January 2027, only 8 spots.",
    url: "/mastermind",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function MastermindLayout({ children }: { children: React.ReactNode }) {
  return children;
}
