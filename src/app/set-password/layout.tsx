import type { Metadata } from "next";

// Auth screens must never be indexed or followed by search engines, they're member-only entry
// points, not content. This server-component layout attaches the robots directive to the client
// page it wraps (a "use client" page can't export metadata itself).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
