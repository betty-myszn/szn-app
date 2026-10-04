import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apply for MY SZN, the Three-Month Astrology Mastermind for Women",
  description:
    "Apply to MY SZN, where your birth chart and your Human Design are read together instead of separately. A private 1:1 with Betty every month, group coaching every season, a hypnosis per season, your personalised chart and design guide, and a small cohort of ambitious women. Founding price, applications open now.",
  alternates: { canonical: "/membership" },
  openGraph: {
    title: "MY SZN, Your Era Starts Now",
    description: "Astrology tells you who you are here to become. Human Design tells you how you are built to get there. MY SZN gives you both, with private coaching, across three seasons.",
    url: "/membership",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
