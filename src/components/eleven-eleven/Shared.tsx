"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { pp } from "@/lib/eleven-eleven-hub";

// A four-point foil sparkle, the same one the coven sales page uses.
const SPARKLE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z'/%3E%3C/svg%3E")`;
export function HoloStar({ size = 44, style }: { size?: number; style?: CSSProperties }) {
  return (
    <span className="holo-shape-wrap" aria-hidden="true" style={{ position: "absolute", zIndex: 4, pointerEvents: "none", ...style }}>
      <span className="holo-shape" style={{ width: size, height: size, ["--shape" as string]: SPARKLE } as CSSProperties} />
    </span>
  );
}

// Members only. The proxy already sends logged-out visitors to /login; this covers the moment
// before her session loads.
export function MembersOnly({ children }: { children: ReactNode }) {
  const { member, ready } = useMember();
  if (!ready) return null;
  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: pp, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>members only, babe.</h1>
          <Link href="/login?redirect=/your-season/11-11" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }
  return <>{children}</>;
}

// The little nav strip across the top of every 11/11 page.
const PAGES: [string, string][] = [
  ["🔮 the portal", "/your-season/11-11"],
  ["✨ what you need to know", "/your-season/11-11/know"],
  ["🪐 your astrology", "/your-season/11-11/astrology"],
  ["🕯️ the exercises", "/your-season/11-11/exercises"],
];
export function PortalNav({ here }: { here: string }) {
  return (
    <nav aria-label="11/11 portal pages" className="flex flex-wrap gap-2">
      {PAGES.map(([name, href]) => (
        <Link key={href} href={href} className="no-underline" style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "9px 14px", borderRadius: 999, border: "var(--border)", background: href === here ? "var(--dark)" : "#fff", color: href === here ? "#fff" : "var(--dark)", boxShadow: "3px 3px 0 var(--dark)" }}>
          {name}
        </Link>
      ))}
    </nav>
  );
}
