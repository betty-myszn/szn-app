"use client";

import { useDoors } from "@/lib/enrolment";
import { doorDay, doorDays, doorTime } from "@/lib/doors";

// The front-door button for pages outside /membership: "join my szn" while a door is open (or
// before the clock has been read), "get on the waitlist" while the doors are shut. Both land on
// /membership, at the plans or at the door alert form. `line` is the dated sentence that sits
// next to the button, so every button says when the doors open or close.
export function useDoorCta(): { href: string; label: string; line: string } {
  const { ready, open, next } = useDoors();
  if (!ready) return { href: "/membership#pricing", label: "join my szn", line: "" };
  if (open)
    return {
      href: "/membership#pricing",
      label: "join my szn",
      line: `Doors are open now and close at ${open.closesAtMoment}, ${doorDay(open.closesAt)}.`,
    };
  return {
    href: "/membership#doors",
    label: "get on the waitlist",
    line: next
      ? `Doors open ${doorDay(next.opensAt)} at ${doorTime(next.opensAt)}, for ${doorDays(next)} days only.`
      : "Doors open for a few days at the start of every season.",
  };
}
