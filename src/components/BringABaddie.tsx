"use client";

import { useState } from "react";
import Link from "next/link";
import { referralLink } from "@/lib/coven-offers-shared";

const pp = "var(--font-poppins), Poppins, sans-serif";

// Her own referral link on the Coven home (24 Nov 2026). A friend who joins through it gives her a
// free month ($44 off her next bill, applied by the Stripe webhook). Gift link alongside, for the
// friend she'd rather just treat.
export default function BringABaddie({ memberId }: { memberId: string }) {
  const link = referralLink(memberId);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy your link:", link);
    }
  };

  return (
    <section className="hd-foil" style={{ borderRadius: 26, border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)", padding: "clamp(24px, 3.6vw, 38px)" }}>
      <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>👯‍♀️ bring a baddie</div>
      <h2 className="display" style={{ fontSize: "clamp(30px, 4.4vw, 50px)", lineHeight: 1, marginTop: 8 }}>
        every friend you bring = <span className="pk">a free month.</span>
      </h2>
      <p style={{ fontSize: 16.5, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0", maxWidth: 620 }}>
        Send her your link. When she joins, $44 comes off your next bill automatically, and there&apos;s no limit, so five friends means five free months. 💸
      </p>
      <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 18 }}>
        {/* Solid black on the foil: never holo (or pink) on holo. */}
        <button type="button" onClick={copy} style={{ cursor: "pointer", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "15px 24px", borderRadius: 999, border: "var(--border)", background: "var(--dark)", color: "#fff" }}>
          {copied ? "copied, babe ✓" : "copy my link"}
        </button>
        <Link href="/baddie-coven/gift" className="no-underline" style={{ fontFamily: pp, fontSize: 14, fontWeight: 800, color: "var(--dark)", textDecoration: "underline" }}>
          🎁 or gift her 3 months →
        </Link>
      </div>
    </section>
  );
}
