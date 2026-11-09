"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const pp = "var(--font-poppins), Poppins, sans-serif";

// Top of my szn until the 11/11 workshop has finished (18:00 UK start, gone by 20:00 UK).
const HIDE_AFTER = Date.parse("2026-11-11T20:00:00Z");

export default function Coven1111Band() {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(Date.now() < HIDE_AFTER), []);
  if (!show) return null;

  return (
    <section className="px-5 md:px-8" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 34, paddingBottom: 36 }}>
      <Link href="/events" className="no-underline max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-7 items-start" style={{ color: "var(--dark)" }}>
        <div>
          <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 13px", transform: "rotate(-2deg)" }}>
            🪄 live this wednesday, 6pm uk
          </span>
          <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 0.98, marginTop: 16 }}>
            the 11/11 manifestation workshop.
          </h2>
          <p style={{ fontSize: "clamp(17px, 1.8vw, 20px)", lineHeight: 1.5, fontWeight: 700, marginTop: 14 }}>
            Our FIRST EVER coven event, babe. Come dressed as your future self, bring your most delusional wishlist and we call it ALL in together. 🎀
          </p>
          <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "17px 28px", marginTop: 20 }}>
            get all the details →
          </span>
        </div>
        <div style={{ border: "var(--border)", overflow: "hidden", aspectRatio: "4 / 3" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coven/betty-witch-email.jpg" alt="Betty in a pink witch hat and black corset dress" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 28%" }} />
        </div>
      </Link>
    </section>
  );
}
