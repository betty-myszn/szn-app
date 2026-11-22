"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { pinkBtn, pp } from "@/lib/eleven-eleven-hub";
import { useQuantumLeap } from "@/lib/use-quantum-leap";
import { qlPromoShowing, todayNumber, dayHref, QL_DAYS, QL_PATH, type LeapDayPayload } from "@/lib/quantum-leap";

// Today's Quantum Leap move, for the Coven home and the dashboard. Shows from the moment the Sun
// enters Sagittarius until the new year (admins see it early to preview). The day itself comes from
// /api/quantum-leap, so nothing of the challenge sits in the page's code before then.
export default function QuantumLeapBand({ style }: { style?: CSSProperties }) {
  const { member } = useMember();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  const showing = now !== null && !!member && qlPromoShowing(now, member.isAdmin);
  const t = now === null ? 0 : todayNumber(now);
  const over = t > QL_DAYS;
  const { data } = useQuantumLeap<LeapDayPayload>(showing && !over ? `day=${Math.min(Math.max(t, 1), QL_DAYS)}` : null);
  const day = data?.day;
  if (!showing || (!over && !day)) return null;

  return (
    <section className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-5" style={{ borderRadius: 26, padding: "clamp(24px, 3.8vw, 40px)", color: "#fff", ...style }}>
      <div>
        <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🏹 the 30-day quantum leap challenge</span>
        <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 14 }}>
          {over || !day ? "all thirty days, done" : `day ${day.n} of ${QL_DAYS}`}
        </div>
        <h2 className="display" style={{ fontSize: "clamp(32px, 4.8vw, 56px)", lineHeight: 0.98, marginTop: 6, color: "#fff" }}>
          {over || !day ? "you leapt, babe. 👑" : `${day.emoji} ${day.title.toLowerCase()}.`}
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.45, fontWeight: 700, margin: "10px 0 0", maxWidth: 620 }}>
          {over || !day ? "Every day of your experiment is still waiting for you, so go back and read how far you've come." : day.move}
        </p>
      </div>
      <div className="flex flex-col gap-3" style={{ justifySelf: "start" }}>
        <Link href={over || !day ? QL_PATH : dayHref(day.n)} className="no-underline" style={pinkBtn}>{over || !day ? "see all 30 days →" : "open today's move →"}</Link>
        {!over && <Link href={QL_PATH} className="no-underline" style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, color: "#fff", textDecoration: "underline" }}>all 30 days</Link>}
      </div>
    </section>
  );
}
