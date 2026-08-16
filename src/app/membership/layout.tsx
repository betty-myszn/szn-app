import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join the Astrology + Human Design Membership for Women",
  description:
    "Apply to MY SZN, where your birth chart and your Human Design are read together instead of separately. A live masterclass and astro tapping every month, subconscious rewiring, a personalised chart and design portal, and a community of ambitious women. Cancel anytime. Limited founding member spots.",
  alternates: { canonical: "/membership" },
  openGraph: {
    title: "MY SZN Membership, Your Era Starts Now",
    description: "Astrology tells you who you are here to become. Human Design tells you how you are built to get there. MY SZN gives you both, per life area, every szn. Cancel anytime.",
    url: "/membership",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
