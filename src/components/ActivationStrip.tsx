"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { isTrial } from "@/lib/membership-access";
import { trialCountdown } from "@/lib/trial-countdown";
import { activationState, markActivationStep, reportActivationComplete, type ActivationStep } from "@/lib/activation";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The first run. A trial used to arrive at a dashboard with everything unlocked and nothing telling
// her where to start, and a platform this full is harder to start using than an empty one, not
// easier. Three moves, in the order that makes it click: read the thing that is actually about her,
// say something to the women who are already in there, and name one thing she wants this season.
//
// It disappears the moment all three are done, so nobody who is already using the product is nagged
// by it, and it stands down before the last three days so it never stacks with TrialKeepPanel, which
// owns the closing ask.
const STAND_DOWN_WITH_DAYS_LEFT = 3;

/** How long her season reading has to be on screen before it counts as read rather than scrolled
 *  past. Long enough that a bounce doesn't tick it, short enough that a real reader gets credit. */
const READ_DWELL_MS = 10_000;

/** The anchor the dashboard already puts immediately above SeasonPersonalised. */
const READING_ANCHOR = "season-guide";

interface StepCopy {
  key: ActivationStep;
  label: string;
  sub: string;
  href: string;
}

const STEPS: StepCopy[] = [
  { key: "reading", label: "read your season reading", sub: "the part that's actually about you", href: `#${READING_ANCHOR}` },
  { key: "room", label: "post once in a room", sub: "say hi, the girls answer", href: "/community" },
  { key: "goal", label: "set one goal", sub: "one thing you want this season", href: "/goals" },
];

export default function ActivationStrip({ hasGoal }: { hasGoal: boolean }) {
  const { member, ready } = useMember();

  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  // Whether this strip applies to this reader at all. Worked out before the effects rather than only
  // at the early return below, because hooks run either way: without this, a paying member scrolling
  // her own dashboard would tick the reading step and land in the activation numbers, which are
  // supposed to describe trials.
  const countdown = ready && member && now !== null && isTrial(member) ? trialCountdown(member.trialExpiresAt, now) : null;
  const applies = !!countdown && countdown.daysLeft > STAND_DOWN_WITH_DAYS_LEFT;

  // Re-read on mount and whenever her goal changes, so ticking one step updates the strip without a
  // reload. `tick` is bumped by the reading observer below.
  const [tick, setTick] = useState(0);
  const [state, setState] = useState(() => ({ reading: false, room: false, goal: false, done: 0, all: false }));
  useEffect(() => {
    setState(activationState(hasGoal));
  }, [hasGoal, tick, now]);

  // Marks the reading step once her own season read has genuinely been on screen for a while. The
  // anchor is a zero-height div, so the timer starts when it crosses the viewport and runs to
  // completion: by then she is scrolled down inside the reading itself.
  useEffect(() => {
    if (!applies || state.reading) return;
    const anchor = document.getElementById(READING_ANCHOR);
    if (!anchor) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting) || timer) return;
      timer = setTimeout(() => {
        if (markActivationStep("reading")) setTick((t) => t + 1);
      }, READ_DWELL_MS);
      observer.disconnect();
    });
    observer.observe(anchor);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [applies, state.reading]);

  // Reported once, the first time all three land, and only for the trials this measures.
  useEffect(() => {
    if (applies && state.all) reportActivationComplete();
  }, [applies, state.all]);

  if (!applies || state.all) return null;

  return (
    <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 26, paddingBottom: 26 }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between gap-4 flex-wrap" style={{ marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 8 }}>
              start here
            </div>
            <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.15 }}>
              three things that make this click.
            </h2>
          </div>
          <span style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, color: "var(--grey-light)" }}>
            {state.done} of {STEPS.length} done
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STEPS.map((step) => {
            const done = state[step.key];
            return (
              <Link
                key={step.key}
                href={step.href}
                className="no-underline flex items-start gap-3"
                style={{
                  background: "#fff",
                  border: done ? "2px solid var(--lav)" : "2px solid var(--pink)",
                  padding: "16px 18px",
                  opacity: done ? 0.62 : 1,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    color: done ? "#fff" : "var(--pink)",
                    background: done ? "var(--lav)" : "transparent",
                    border: `2px solid ${done ? "var(--lav)" : "var(--pink)"}`,
                    marginTop: 2,
                  }}
                >
                  {done ? "✓" : ""}
                </span>
                <span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: poppins,
                      fontSize: 14.5,
                      fontWeight: 800,
                      color: "var(--dark)",
                      letterSpacing: "-0.2px",
                      textDecoration: done ? "line-through" : "none",
                    }}
                  >
                    {step.label}
                  </span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--grey-light)", marginTop: 3 }}>{step.sub}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
