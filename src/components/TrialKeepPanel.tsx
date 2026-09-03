"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { isTrial } from "@/lib/membership-access";
import { trialCountdown } from "@/lib/trial-countdown";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The ask, made at the moment it lands hardest: on the dashboard, in the last few days of her free
// week, while she still has everything and can see exactly what she'd be putting down.
//
// The slim TrialBar carries the clock for the whole seven days; this is the one place that does the
// loss framing, and it does it with her own things (her journal streak, the goal she set) rather
// than a feature list, because a stranger's feature list is not what she'd miss.
//
// Deliberately silent until the last three days: a woman on day one should be enjoying the platform,
// not being sold to.
const SHOW_WITHIN_DAYS = 3;

export default function TrialKeepPanel({
  streakDays = 0,
  goalTitle = null,
}: {
  /** Her current journal streak, so the panel can name something she'd actually recognise. */
  streakDays?: number;
  /** The goal she set during her week, if she set one. */
  goalTitle?: string | null;
}) {
  const { member, ready } = useMember();

  // Clock read after mount, never during render, so the day count can't differ between the server
  // pass and hydration.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  if (!ready || !member || !isTrial(member) || now === null) return null;

  const countdown = trialCountdown(member.trialExpiresAt, now);
  if (!countdown || countdown.daysLeft > SHOW_WITHIN_DAYS) return null;

  const { daysLeft, endsLabel, finalDay } = countdown;

  return (
    <section className="px-5 md:px-8" style={{ background: "var(--pink-bg)", borderBottom: "var(--border)", paddingTop: 26, paddingBottom: 26 }}>
      <div className="max-w-6xl mx-auto">
        <div style={{ border: "2px solid var(--pink)", background: "#fff", padding: "26px 24px" }}>
          <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>
            your free week
          </div>

          <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: 12 }}>
            {finalDay ? "this is your last day inside." : `${daysLeft} days left inside.`}
          </h2>

          <p style={{ fontSize: 14.5, color: "var(--grey)", lineHeight: 1.75, maxWidth: 620, marginBottom: 20 }}>
            {`Everything on this page, your personalised season reading, the workshops and the meditations, closes ${endsLabel}. `}
            {streakDays > 0
              ? `Your ${streakDays} day journal streak stays saved on your account, along with everything you've written in it. `
              : "Everything you've written and started stays saved on your account. "}
            {goalTitle ? `So does the goal you set, ${goalTitle.toLowerCase()}. ` : ""}
            {"Becoming a member keeps all of it open at $88 a month, and you carry on from exactly where you are right now rather than starting anything again."}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/membership"
              className="no-underline"
              style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff", background: "var(--pink)", padding: "13px 24px" }}
            >
              keep my platform · $88/mo
            </Link>
            <span style={{ fontSize: 12.5, color: "var(--grey-light)" }}>cancel anytime from your settings.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
