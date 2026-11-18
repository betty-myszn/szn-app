"use client";

import { MASTERMIND, MASTERMIND_APPLY_BY } from "@/lib/mastermind";

// The Mastermind button used across the site (Manifesto, ValueStack, CoachingBand, WhoThisIsFor,
// the seasons page). Since 18 Nov 2026 the Mastermind is an application for the January 2027 cohort,
// so every variant lands on the application form at /mastermind#waitlist. First-person labels still rotate by `variant` so a page
// full of buttons doesn't say the same thing every time. The door-aware version (join while a door
// is open) is in git history; bring it back when the Mastermind opens for enrolment.
const LABELS = ["apply for a spot", "I want one of the spots", "I'm ready to become her", "save me a spot"];

export function useDoorCta(variant = 0): { href: string; label: string; line: string } {
  return {
    href: "/mastermind#waitlist",
    label: LABELS[variant % LABELS.length],
    line: `Only ${MASTERMIND.spots} spots, and applications close on ${MASTERMIND_APPLY_BY}.`,
  };
}
