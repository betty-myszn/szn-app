"use client";

// Single source of truth for whether the doors are open. The homepage CTAs, the membership page
// checkout buttons and the launch countdown all read from here, so enrolment state can never
// disagree between them.
//
// Doors are OPEN by default. To close them, set NEXT_PUBLIC_ENROLMENT_OPEN="false" in Railway
// (Variables tab). Any other value, or no value at all, means open.
//
// This used to work the other way round: closed unless the flag was exactly "true", AND gated
// behind a hard-coded 72-hour window (ENROLMENT_CLOSES) that could only ever close enrolment,
// never open it. That combination shut the doors on its own. The window expired at 7pm LA on
// 26 July 2026 and every CTA on the site silently reverted to "join the waitlist", with no way
// to reopen it, not even by setting the flag, without editing this file. MY SZN is an ongoing
// cancel-anytime membership rather than a timed launch, so open is the right default and closing
// is the deliberate act.

// Kept for the launch countdown, which counts down to this moment and then reads
// useEnrolmentOpen() to decide whether to say "WE'RE LIVE."
export const ENROLMENT_OPENS = new Date("2026-07-23T19:00:00-07:00"); // 7pm LA time

// Build-time constant, so it's identical on the server render and the first client render and
// can't cause a hydration mismatch. Only the exact string "false" closes the doors; a typo
// therefore fails open, which is the safe direction for a page that sells memberships.
const FLAG_OFF = process.env.NEXT_PUBLIC_ENROLMENT_OPEN === "false";

export function isEnrolmentOpen(): boolean {
  return !FLAG_OFF;
}

// Kept as a hook so the three call sites don't have to change, and so a future time-based or
// capacity-based rule has somewhere to live. There's no time component any more, so this is a
// plain read of the build-time flag with no state and no effect.
export function useEnrolmentOpen(): boolean {
  return isEnrolmentOpen();
}
