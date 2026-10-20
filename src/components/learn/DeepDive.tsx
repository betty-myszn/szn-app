"use client";

import Link from "next/link";

// The shell behind the astrology deep-dive pages (/my-chart/[body], /my-chart/house/[n] and the
// full-chart readings), so they read like the lesson pages they're linked from: a sticky bar with
// the black "back to my chart" pill, a colour-block hero, then boxed sections. Text stays solid
// black, or white on black.

const poppins = "var(--font-poppins), Poppins, sans-serif";

export function DeepDivePage({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", color: "var(--dark)" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: "1.5px solid var(--dark)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginRight: "auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {eyebrow}
          </span>
          <Link
            href="/my-chart"
            className="no-underline"
            style={{ background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "9px 16px", fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}
          >
            ← back to my chart
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}

export function DeepDiveHero({ tone = "dark", eyebrow, title, children }: { tone?: "dark" | "pink" | "lav"; eyebrow: React.ReactNode; title: React.ReactNode; children?: React.ReactNode }) {
  const t = { dark: { bg: "var(--dark)", fg: "#fff" }, pink: { bg: "var(--pink)", fg: "var(--dark)" }, lav: { bg: "var(--lav-light)", fg: "var(--dark)" } }[tone];
  return (
    <div style={{ background: t.bg, color: t.fg }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px 32px" }}>
        <p style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", margin: "0 0 10px", color: tone === "dark" ? "var(--pink)" : t.fg }}>{eyebrow}</p>
        <h1 style={{ fontFamily: poppins, fontSize: 34, lineHeight: 1.08, fontWeight: 700, margin: "0 0 12px", color: t.fg }}>{title}</h1>
        {children && <div style={{ fontSize: 18, lineHeight: 1.5 }}>{children}</div>}
      </div>
    </div>
  );
}

export function DeepDiveBody({ children }: { children: React.ReactNode }) {
  return <div style={{ maxWidth: 720, margin: "0 auto", padding: "8px 20px 48px" }}>{children}</div>;
}

export function Stack({ children, cols }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: "grid", gap: 14, gridTemplateColumns: cols ? `repeat(auto-fit, minmax(${cols}px, 1fr))` : undefined }}>
      {children}
    </div>
  );
}

export function Pill({ children, tone = "white" }: { children: React.ReactNode; tone?: "white" | "pink" | "lav" | "dark" }) {
  const t = {
    white: { background: "#fff", color: "var(--dark)", border: "1.5px solid var(--dark)" },
    pink: { background: "var(--pink)", color: "var(--dark)", border: "1.5px solid var(--pink)" },
    lav: { background: "var(--lav)", color: "var(--dark)", border: "1.5px solid var(--lav)" },
    dark: { background: "var(--dark)", color: "#fff", border: "1.5px solid var(--dark)" },
  }[tone];
  return (
    <span style={{ ...t, display: "inline-block", borderRadius: 999, padding: "5px 12px", fontFamily: poppins, fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}

// A big pink button-link, the same as the lessons' "read the full deep dive" link.
export function PinkLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="no-underline"
      style={{ display: "block", textAlign: "center", background: "var(--pink)", color: "var(--dark)", borderRadius: 16, padding: "15px 18px", fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}
    >
      {children}
    </Link>
  );
}

// A small caps link inside a box ("go deeper →"), black or white to match the box.
export const goDeeper = (onDark: boolean): React.CSSProperties => ({
  display: "inline-block",
  marginTop: 12,
  fontFamily: poppins,
  fontSize: 11.5,
  fontWeight: 700,
  letterSpacing: 1.2,
  textTransform: "uppercase",
  color: onDark ? "var(--pink)" : "var(--dark)",
  borderBottom: `1.5px solid ${onDark ? "var(--pink)" : "var(--dark)"}`,
  paddingBottom: 2,
});

// Older content carries raw background colours; fold them onto the four box tones.
export function toneFromBg(bg?: string): "white" | "pink" | "lav" | "dark" {
  if (!bg) return "white";
  if (bg.includes("dark")) return "dark";
  if (bg.includes("pink") || bg.includes("mint")) return "pink";
  if (bg.includes("lav") || bg.includes("gold")) return "lav";
  return "white";
}
