"use client";

// The join button used across the site (Manifesto, DoorButton on the seasons pages, the events and
// replay teasers). It sold the Mastermind until 19 Nov 2026, when Betty took the Mastermind off the
// site to launch a money course instead, so every variant now lands on The Bad B*tch Coven. Labels
// rotate by `variant` so a page full of buttons doesn't say the same thing every time. No dated
// line: the coven page carries its own open/closed state.
const LABELS = ["join the coven", "I'm ready to become her", "find my coven", "come join us"];

export function useDoorCta(variant = 0): { href: string; label: string; line: string } {
  return {
    href: "/baddie-coven",
    label: LABELS[variant % LABELS.length],
    line: "",
  };
}
