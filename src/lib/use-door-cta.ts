"use client";

// The Mastermind button used across the site (Manifesto, ValueStack, CoachingBand, WhoThisIsFor,
// the seasons page). The Mastermind is waitlist-only for now (Oct 2026), so every variant lands on
// the waitlist form at /mastermind#waitlist. First-person labels still rotate by `variant` so a page
// full of buttons doesn't say the same thing every time. The door-aware version (join while a door
// is open) is in git history; bring it back when the Mastermind opens for enrolment.
const LABELS = ["join the mastermind waitlist", "I'm done waiting until January", "I'm ready to become her", "put me on the list"];

export function useDoorCta(variant = 0): { href: string; label: string; line: string } {
  return {
    href: "/mastermind#waitlist",
    label: LABELS[variant % LABELS.length],
    line: "Waitlist only for now, and the next cohort's dates go to the waitlist first.",
  };
}
