"use client";

import { useDoors } from "@/lib/enrolment";
import { doorDay, doorDays, doorTime } from "@/lib/doors";

// The front-door button for pages outside /membership. First-person labels, rotated by `variant`
// so a page full of buttons doesn't say the same thing every time: waitlist wording while the doors
// are shut, join wording while one is open. Both land on /membership, at the door alert form or the
// plans. `line` is the dated sentence that sits next to the button.
const CLOSED = ["put me on the waitlist", "I'm done waiting until January", "save my spot", "I'm ready to become her"];
const OPEN = ["lock me in", "I'm done waiting until January", "I'm ready to become her", "lock me in for 3 months"];

export function useDoorCta(variant = 0): { href: string; label: string; line: string } {
  const { ready, open, next } = useDoors();
  const pick = (list: string[]) => list[variant % list.length];
  if (!ready) return { href: "/membership#pricing", label: pick(OPEN), line: "" };
  if (open)
    return {
      href: "/membership#pricing",
      label: pick(OPEN),
      line: `Doors are open now and close at ${open.closesAtMoment}, ${doorDay(open.closesAt)}.`,
    };
  return {
    href: "/membership#doors",
    label: pick(CLOSED),
    line: next
      ? `Doors open ${doorDay(next.opensAt)} at ${doorTime(next.opensAt)}, for ${doorDays(next)} days only.`
      : "Doors open for a few days at the start of every season.",
  };
}
