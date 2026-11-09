// What the Coven home shows for the current month. Update this file each month: the theme, the next
// circle and the moons. Moon dates are Eastern, matching the rest of the platform (see sky-zone.ts).

export const COVEN_THEME = {
  month: "november",
  title: "take it back.",
  line: "This month we find every place you handed your power to somebody else and bring it ALL home.",
};

export const COVEN_CIRCLE = {
  workshopId: "coven-11-11",
  title: "the 11/11 manifestation workshop",
  when: "Wednesday 11 November, 6pm UK",
  note: "Come dressed as your future self, babe. 🎀",
  startsAt: Date.parse("2026-11-11T18:00:00Z"),
  endsAt: Date.parse("2026-11-11T19:30:00Z"),
};

export const COVEN_MOONS = [
  { name: "full moon in gemini", type: "full_moon", date: "2026-11-24", sign: "Gemini", degree: 2, when: "tuesday 24 november", at: Date.parse("2026-11-24T14:53:00Z") },
  { name: "new moon in sagittarius", type: "new_moon", date: "2026-12-08", sign: "Sagittarius", degree: 16, when: "tuesday 8 december", at: Date.parse("2026-12-09T00:51:00Z") },
  { name: "full moon in cancer", type: "full_moon", date: "2026-12-23", sign: "Cancer", degree: 2, when: "wednesday 23 december", at: Date.parse("2026-12-24T01:28:00Z") },
];

export const COVEN_ROOM_ID = "coven";
