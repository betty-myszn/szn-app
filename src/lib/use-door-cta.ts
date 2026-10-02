"use client";

import { useDoors } from "@/lib/enrolment";

// The front-door button for pages outside /membership: "join my szn" while a door is open (or
// before the clock has been read), "get on the waitlist" while the doors are shut. Both land on
// /membership, at the plans or at the door alert form.
export function useDoorCta(): { href: string; label: string } {
  const { ready, open } = useDoors();
  if (!ready || open) return { href: "/membership#pricing", label: "join my szn" };
  return { href: "/membership#doors", label: "get on the waitlist" };
}
