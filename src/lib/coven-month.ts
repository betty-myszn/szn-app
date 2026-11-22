// What the Coven home shows for the current month. Update this file each month: the theme, the next
// circle and the moons. Moon dates are Eastern, matching the rest of the platform (see sky-zone.ts).

export const COVEN_THEME = {
  month: "november",
  title: "take it back.",
  line: "This month we find every place you handed your power to somebody else and bring it ALL home.",
};

export const COVEN_CIRCLE = {
  workshopId: "coven-sag-masterclass",
  title: "sag szn: big dreams, biiiiigggg $$$ and big life masterclass",
  when: "Sunday 29th of November, 7pm UK",
  sticker: "🪄 live sunday 29th of november, 7pm uk",
  note: "Your BIGGGG life vision, your Jupiter expansion blueprint and live shadow work with astrotapping™ to clear everything that's been holding you back. Bring your most outrageous dreams, babe. 💸✨",
  joinSoon: "💜 Your Zoom link lands right here before we go live at 7pm UK on Sunday.",
  image: "/sagittarius-unicorn.webp",
  startsAt: Date.parse("2026-11-29T19:00:00Z"),
  endsAt: Date.parse("2026-11-29T20:30:00Z"),
};

// The next circle once COVEN_CIRCLE has passed and before its date is set. When the date is
// confirmed, move it into COVEN_CIRCLE with real startsAt/endsAt and set this back to null.
export const COVEN_NEXT: { title: string; line: string } | null = null;

export const COVEN_MOONS = [
  { name: "full moon in gemini", type: "full_moon", date: "2026-11-24", sign: "Gemini", degree: 2, when: "tuesday 24 november", at: Date.parse("2026-11-24T14:53:00Z") },
  { name: "new moon in sagittarius", type: "new_moon", date: "2026-12-08", sign: "Sagittarius", degree: 16, when: "tuesday 8 december", at: Date.parse("2026-12-09T00:51:00Z") },
  { name: "full moon in cancer", type: "full_moon", date: "2026-12-23", sign: "Cancer", degree: 2, when: "wednesday 23 december", at: Date.parse("2026-12-24T01:28:00Z") },
];

export const COVEN_ROOM_ID = "general";

// A moon appears on the homepages from midnight UK the day before it, and stays for the three days
// its glow lasts. UK is on GMT from late October to late March, which covers every moon above.
const DAY = 86_400_000;
export function moonShowsFrom(at: number): number {
  return Math.floor((at - DAY) / DAY) * DAY;
}
export function moonVisible(at: number, now: number): boolean {
  return now >= moonShowsFrom(at) && now < at + 3 * DAY;
}
