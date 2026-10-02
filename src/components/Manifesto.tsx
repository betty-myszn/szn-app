"use client";

import Link from "next/link";
import { useDoorCta } from "@/lib/use-door-cta";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The MY SZN manifesto: the feminist, anti-conditioning, big-dreams heart of the brand, in Betty's
// voice, then the ask. Shared by the home page and the membership page.
export default function Manifesto() {
  const cta = useDoorCta(3);
  return (
    <section className="px-5 md:px-8" style={{ background: "var(--pink)", borderBottom: "var(--border)", paddingTop: 84, paddingBottom: 88 }}>
      <div className="max-w-4xl mx-auto">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", marginBottom: 22 }}>
          why we&apos;re here
        </div>
        <h2 className="display" style={{ fontSize: "clamp(38px, 7vw, 84px)", color: "var(--dark)", lineHeight: 0.98 }}>
          f*ck playing small
          <br />
          <span style={{ color: "#fff" }}>anymore.</span>
        </h2>

        <div style={{ marginTop: 34, maxWidth: 760 }}>
          {[
            "Women have been taught to wait until we're confident enough, healed enough, qualified enough, pretty enough, rich enough or universally approved before we let ourselves have the life we actually want, and that rulebook was never written with our dreams in mind.",
            "We were raised to be agreeable, accommodating, quiet, grateful for scraps and easy to deal with, because a woman who wants LOTS of money, enormous dreams and a life on her own terms is a whole lot harder to control.",
            "So inside MY SZN we're getting more difficult to underpay, silence and talk out of what we want. Make the money. Wear the outfit. Pitch the brand. Book the flight. Raise your prices. Say no without the three-paragraph apology. Take up space without shrinking yourself to be easier for everybody else to digest.",
            "Half of what we call a confidence problem is really the fear that somebody somewhere might have an opinion about us. They probably will. Survive it, because the women around you in here will be cheering the loudest when you do.",
          ].map((p) => (
            <p key={p} style={{ fontSize: "clamp(16px, 1.9vw, 19px)", lineHeight: 1.75, color: "var(--dark)", marginBottom: 18, fontWeight: 500 }}>
              {p}
            </p>
          ))}
          <p style={{ fontFamily: poppins, fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.5px", color: "#fff", marginTop: 30, marginBottom: 0 }}>
            Women wanting LOTS of money will never offend me. I want you rich, rested, resourced, independent and extremely difficult to control.
          </p>
        </div>

        <div style={{ background: "#fff", border: "var(--border)", borderRadius: 22, padding: "clamp(24px, 4vw, 40px)", marginTop: 44 }}>
          <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(20px, 3vw, 30px)", lineHeight: 1.25, letterSpacing: "-0.5px", color: "var(--dark)", margin: 0 }}>
            If you want MORE money, bigger dreams, ridiculous confidence &amp; a life that makes your younger self go{" "}
            <span style={{ color: "var(--pink)" }}>HOLY F*CKKKKK</span>, come join us inside MY SZN.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3" style={{ marginTop: 24 }}>
            <Link
              href={cta.href}
              className="no-underline"
              style={{ background: "var(--dark)", color: "#fff", fontFamily: poppins, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 44px", display: "inline-block" }}
            >
              {cta.label}
            </Link>
            {cta.line && <span style={{ fontSize: 15, fontWeight: 700, color: "var(--dark)" }}>{cta.line}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
