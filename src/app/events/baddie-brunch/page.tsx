import { permanentRedirect } from "next/navigation";

// The Baddie Brunch lives on the LA coven page now (Betty, 17 Nov 2026), so the event's own URL, which
// the booking emails and the /events listing use, sends people straight to that section.
export default function BaddieBrunchRedirect() {
  permanentRedirect("/baddie-coven/la#brunch");
}
