"use client";

import { useEffect, useState } from "react";

// Single source of truth for whether the doors are open. Both the homepage CTAs and the launch
// countdown read from here, so enrolment state can never disagree between them.
//
// How to switch enrolment on and off WITHOUT a code change: set NEXT_PUBLIC_ENROLMENT_OPEN in
// Railway (Variables tab) to "true" to open the doors, or remove it / set anything else to close
// them. Changing it triggers a redeploy, which is all it takes.
//
// ENROLMENT_CLOSES is a safety net, not the primary switch: it can only ever CLOSE enrolment, it
// can't open it. So if the flag is left on past the launch window, the site still reverts to
// waitlist mode on its own rather than selling a closed intake.

export const ENROLMENT_OPENS = new Date("2026-07-23T19:00:00-07:00"); // 7pm LA time
export const ENROLMENT_CLOSES = new Date("2026-07-26T19:00:00-07:00"); // 72 hours later

// Build-time constant: identical on the server render and the first client render, so using it
// as the initial state can't cause a hydration mismatch.
const FLAG_ON = process.env.NEXT_PUBLIC_ENROLMENT_OPEN === "true";

export function isEnrolmentOpen(now: Date = new Date()): boolean {
  return FLAG_ON && now < ENROLMENT_CLOSES;
}

// Use this in components rather than calling isEnrolmentOpen() directly during render. It starts
// from the build-time flag (matching the server-rendered HTML), then applies the close-date check
// after mount, so the page auto-reverts to waitlist mode the moment the window ends, without
// anyone having to redeploy or refresh at exactly the right second.
export function useEnrolmentOpen(): boolean {
  const [open, setOpen] = useState(FLAG_ON);

  useEffect(() => {
    const sync = () => setOpen(isEnrolmentOpen());
    sync();
    const id = setInterval(sync, 30_000);
    return () => clearInterval(id);
  }, []);

  return open;
}
