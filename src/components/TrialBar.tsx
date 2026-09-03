"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { isTrial } from "@/lib/membership-access";
import { trialCountdown, TRIAL_DAYS } from "@/lib/trial-countdown";

// The one thing a trial member could previously never see: that she's on a trial, when it ends, and
// how to keep it. Before this, nothing in the whole logged-in platform mentioned either the clock or
// the price, so the only conversion ask in the funnel was an email sent after access had already
// gone. This is the in-product half of that ask.
//
// Mounted once in the root layout, so it rides along wherever she goes rather than only on the
// dashboard, and renders nothing at all for everyone who isn't mid-trial.
//
// Not dismissible on purpose: it IS the ask, and it's gone by itself in at most seven days.
export default function TrialBar() {
  const { member, ready } = useMember();

  // Clock read after mount, never during render, so the day she's told she's on can't differ between
  // the server pass and hydration. Same guard the free-trial page uses for its workshop row.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    // Re-read on the hour so a tab left open overnight doesn't keep insisting it's day 3.
    const id = setInterval(() => setNow(Date.now()), 3_600_000);
    return () => clearInterval(id);
  }, []);

  if (!ready || !member || !isTrial(member) || now === null) return null;

  const countdown = trialCountdown(member.trialExpiresAt, now);
  if (!countdown) return null;

  const { daysLeft, dayNumber, endsLabel, urgent, finalDay } = countdown;

  const line = finalDay
    ? `last day of your free week. it ends ${endsLabel}.`
    : urgent
      ? `${daysLeft} days left. your platform, the workshops and the meditations close ${endsLabel}.`
      : `day ${dayNumber} of ${TRIAL_DAYS} · your free week ends ${endsLabel}`;

  return (
    <div
      className="px-5 md:px-8 py-[10px] flex items-center justify-center gap-x-4 gap-y-2 flex-wrap"
      style={{
        background: urgent ? "var(--pink)" : "var(--lav-light)",
        borderBottom: "var(--border)",
      }}
    >
      <p
        style={{
          fontSize: 13,
          lineHeight: 1.5,
          color: urgent ? "#fff" : "var(--dark)",
          fontWeight: urgent ? 600 : 400,
        }}
      >
        {line}
      </p>
      <Link
        href="/membership"
        className="no-underline"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          color: urgent ? "var(--pink)" : "#fff",
          background: urgent ? "#fff" : "var(--pink)",
          padding: "8px 16px",
        }}
      >
        {urgent ? "keep it all · $88/mo" : "become a member"}
      </Link>
    </div>
  );
}
