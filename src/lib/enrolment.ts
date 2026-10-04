"use client";

// Single source of truth for whether the doors are open. The membership page, the signup page and
// the countdown all read from here, so they can never disagree.
//
// The doors follow the schedule in src/lib/doors.ts: a few days at the start of each season, closing
// at a real sky moment. NEXT_PUBLIC_ENROLMENT_OPEN can still override it by hand ("true" holds them
// open, "false" holds them shut); with no value the schedule is in charge.
//
// The clock is read on the client after mount, never during the server render, so a statically
// rendered page can't bake in a door state from build time. Until then `ready` is false and callers
// render a neutral state. It re-checks every 30 seconds so a page left open flips at the exact
// moment a door opens or closes.

import { useEffect, useState } from "react";
import { WAITLIST_ONLY, applyOverride, doorState, type DoorState } from "@/lib/doors";

const FLAG = process.env.NEXT_PUBLIC_ENROLMENT_OPEN;

export function doorsAt(nowMs: number): DoorState {
  if (WAITLIST_ONLY) return { open: null, next: null };
  return applyOverride(doorState(nowMs), FLAG);
}

export interface Doors extends DoorState {
  ready: boolean;
  now: number | null;
}

export function useDoors(): Doors {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return { ready: false, now: null, open: null, next: null };
  return { ready: true, now, ...doorsAt(now) };
}

/** True once mounted and a door is open right now. */
export function useEnrolmentOpen(): boolean {
  const { open } = useDoors();
  return !!open;
}
