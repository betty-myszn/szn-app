import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join the Astrology Membership | Coaching, Community & Birth Chart Portal",
  description:
    "Apply to MY SZN, the 3-month astrology membership for women ready to stop playing small. Live workshops, subconscious rewiring, personalised birth chart portal, and a community of ambitious women. Limited founding member spots.",
  alternates: { canonical: "/membership" },
  openGraph: {
    title: "MY SZN Membership, Your Era Starts Now",
    description: "The astrology-led membership for ambitious women. 3-month commitment. Live coaching, birth chart portal, subconscious rewiring. Limited spots launching July 2026.",
    url: "/membership",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
