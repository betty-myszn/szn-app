"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav
      className="flex items-center justify-between px-8 py-[18px] sticky top-0 bg-white z-[100]"
      style={{ borderBottom: "var(--border)" }}
    >
      <Link
        href="/"
        className="no-underline"
        style={{
          fontFamily: "var(--font-poppins), Poppins, sans-serif",
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "-0.5px",
          color: "var(--dark)",
        }}
      >
        my<span style={{ color: "var(--pink)" }}>szn</span>
      </Link>
      <div
        className="flex gap-7"
        style={{
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <Link href="/mastermind" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
          mastermind
        </Link>
        <Link href="/podcast" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
          podcast
        </Link>
        <Link href="/waitlist" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
          waitlist
        </Link>
      </div>
      <Link href="/chart" className="nav-cta no-underline" style={{
        background: "var(--pink)",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "10px 20px",
        border: "none",
        transition: "opacity 0.15s",
      }}>
        free birth chart
      </Link>
    </nav>
  );
}
