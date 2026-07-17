"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 bg-white z-[100]"
      style={{ borderBottom: "var(--border)" }}
    >
      <div className="flex items-center justify-between px-5 md:px-8 py-[14px] md:py-[18px]">
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

        {/* Desktop nav */}
        <div
          className="hidden md:flex gap-7 items-center"
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <Link href="/" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
            home
          </Link>
          <Link href="/membership" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
            membership
          </Link>
          <Link href="/podcast" className="no-underline text-[var(--dark)] hover:text-[var(--pink)] transition-colors">
            podcast
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/chart" className="no-underline" style={{
            background: "var(--pink)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "8px 14px",
            border: "none",
            whiteSpace: "nowrap",
          }}>
            free chart
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, lineHeight: 0 }}
            aria-label="Menu"
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              {open ? (
                <>
                  <line x1="2" y1="2" x2="20" y2="14" stroke="var(--dark)" strokeWidth="2" />
                  <line x1="2" y1="14" x2="20" y2="2" stroke="var(--dark)" strokeWidth="2" />
                </>
              ) : (
                <>
                  <rect y="0" width="22" height="2" fill="var(--dark)" />
                  <rect y="7" width="22" height="2" fill="var(--dark)" />
                  <rect y="14" width="22" height="2" fill="var(--dark)" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden flex flex-col gap-4 px-5 pb-5"
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            borderTop: "1px solid #eee",
            paddingTop: 16,
          }}
        >
          <Link href="/" onClick={() => setOpen(false)} className="no-underline text-[var(--dark)] hover:text-[var(--pink)]">
            home
          </Link>
          <Link href="/membership" onClick={() => setOpen(false)} className="no-underline text-[var(--dark)] hover:text-[var(--pink)]">
            membership
          </Link>
          <Link href="/podcast" onClick={() => setOpen(false)} className="no-underline text-[var(--dark)] hover:text-[var(--pink)]">
            podcast
          </Link>
        </div>
      )}
    </nav>
  );
}
