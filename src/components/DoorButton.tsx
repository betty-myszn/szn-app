"use client";

import Link from "next/link";
import { useDoorCta } from "@/lib/use-door-cta";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The door-aware button dropped through the home page: "get on the waitlist" while the doors are
// shut, "join my szn" while one is open, with the dated door line beside it. The line inherits the
// section's text colour so it works on light and dark grounds.
export default function DoorButton({ center = false }: { center?: boolean }) {
  const cta = useDoorCta();
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${center ? "justify-center text-center" : ""}`} style={{ marginTop: 40 }}>
      <Link
        href={cta.href}
        className="no-underline"
        style={{ background: "var(--pink)", color: "#fff", fontFamily: poppins, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "18px 40px", display: "inline-block" }}
      >
        {cta.label}
      </Link>
      {cta.line && <span style={{ fontSize: 14.5, fontWeight: 700, color: "inherit", maxWidth: 340, lineHeight: 1.4 }}>{cta.line}</span>}
    </div>
  );
}
