"use client";

import { track, EVENTS } from "@/lib/analytics";

// The three things a new member does that make MY SZN click, and whether she's done them.
//
// A trial used to land on the full dashboard with everything unlocked and no direction, which is the
// worst possible first run: the more there is, the less obvious the first move. Browsing is not the
// thing that converts, doing is, and specifically doing the one thing nothing else on the internet
// gives her, which is reading her own chart read for the season she's actually in.
//
// This is also the activation number the funnel was missing. Every step reports itself, so "what
// share of trials do 2 of 3, and do those convert" becomes answerable rather than a hunch.
//
// Storage is localStorage, matching the journal, goals and dashboard preferences, so it's per device
// and per browser. That is the right trade here: a wrong tick shows a woman a strip she has already
// finished, which costs nothing, whereas a server round trip on every dashboard load costs everyone.
// The goal step is the exception and is read from real goal data instead, since goals already sync.

export type ActivationStep = "reading" | "room" | "goal";

/** localStorage-backed steps. 'goal' is deliberately absent: it's derived from her actual goals. */
type StoredStep = Exclude<ActivationStep, "goal">;

const KEY = "myszn-activation";
const COMPLETE_KEY = "myszn-activation-complete";

export interface ActivationState {
  reading: boolean;
  room: boolean;
  goal: boolean;
  done: number;
  all: boolean;
}

function readStored(): Record<StoredStep, boolean> {
  if (typeof window === "undefined") return { reading: false, room: false };
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Record<StoredStep, boolean>>) : {};
    return { reading: parsed.reading === true, room: parsed.room === true };
  } catch {
    // A browser with storage blocked, or a corrupted value. Treat as nothing done rather than
    // throwing on a dashboard render.
    return { reading: false, room: false };
  }
}

/**
 * Records a step the first time it happens, and reports it. Returns true only on the transition, so
 * callers can fire once without tracking their own "have I already done this" flag.
 *
 * Safe to call from anywhere on any surface: posting in a room marks the room step wherever she
 * posted from, which is why this lives in a lib rather than inside the dashboard component.
 */
export function markActivationStep(step: StoredStep): boolean {
  if (typeof window === "undefined") return false;
  const current = readStored();
  if (current[step]) return false;
  const next = { ...current, [step]: true };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return false;
  }
  track(EVENTS.ACTIVATION_STEP, { step });
  return true;
}

/** Where she is across all three, with the goal step read from her real goals. */
export function activationState(hasGoal: boolean): ActivationState {
  const stored = readStored();
  const done = [stored.reading, stored.room, hasGoal].filter(Boolean).length;
  return { reading: stored.reading, room: stored.room, goal: hasGoal, done, all: done === 3 };
}

/** Fires the completion event exactly once per browser, the moment all three are done. */
export function reportActivationComplete(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(COMPLETE_KEY) === "1") return;
    window.localStorage.setItem(COMPLETE_KEY, "1");
  } catch {
    return;
  }
  track(EVENTS.ACTIVATED);
}
