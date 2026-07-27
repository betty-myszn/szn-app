// The live workshop schedule, shared by the full /events page and the countdown block on the
// dashboard so there's one source of truth for dates, Zoom links and copy. Adding a workshop
// here puts it in both places at once.

export interface Workshop {
  id: string;
  label: string;
  meta: string;
  title: string;
  dark: boolean;
  /** ISO datetime with an explicit offset, or null while the date is still tbc. */
  startIso: string | null;
  durationMinutes: number;
  location: string;
  zoomUrl: string | null;
  zoomMeetingId: string | null;
  zoomPasscode: string | null;
  paragraphs: string[];
  callout: { plain: string; pink: string } | null;
}

export const WORKSHOPS: Workshop[] = [
  {
    id: "leo-szn-workshop-1",
    label: "leo szn workshop 1",
    meta: "28 july · 7pm la time · first live class",
    title: "Leo Season: Enter Your Main Character Era",
    dark: true,
    startIso: "2026-07-28T19:00:00-07:00",
    durationMinutes: 75,
    location: "live on zoom, join link below once you're rsvp'd",
    zoomUrl: "https://us06web.zoom.us/j/87348495713?pwd=eVykh1qIwFdS5xYVsT6dbUmklWRbCa.1",
    zoomMeetingId: "873 4849 5713",
    zoomPasscode: "391862",
    paragraphs: [
      "Leo season is your cosmic reminder that you didn't come here to watch everyone else live the life you want.",
      "If you've been overthinking every move, watering yourself down, waiting until you feel “ready”, or hiding the parts of you that were always meant to be seen… this is your invitation to leave that version of yourself behind.",
      "We'll dive into the astrology of confidence, visibility and self-expression, exploring the placements that reveal where you're designed to shine, what's been keeping you playing smaller than your potential, and how to work with this Leo season to become the woman who walks into every room knowing she belongs there.",
      "Powerful prompts, astrology, tapping and embodiment exercises to help you release the fear of being seen, reconnect with your natural magnetism and start showing up like the main character of your own damn life.",
    ],
    callout: {
      plain: "Because your next era isn't waiting for permission. It's waiting for ",
      pink: "you.",
    },
  },
  {
    id: "leo-szn-workshop-2",
    label: "leo szn workshop 2",
    meta: "date tbc · inside the membership",
    title: "Visible AF: How to Show Up & Get Paid",
    dark: false,
    startIso: null,
    durationMinutes: 75,
    location: "live on zoom, link emailed before class",
    zoomUrl: null,
    zoomMeetingId: null,
    zoomPasscode: null,
    paragraphs: [
      "You weren't born to be the internet's best kept secret.",
      "If you've been sitting on ideas, rewriting captions seventeen times, waiting until you feel more confident, or watching everyone else take up space while you quietly cheer them on from the sidelines… we're changing that.",
      "We're diving into the astrology behind visibility, personal branding and becoming known for what you do. The placements that reveal how you're designed to communicate, market yourself, attract opportunities and build a brand that people actually remember. Plus the fears that keep you hiding, people-pleasing, overthinking and making yourself smaller than your vision.",
      "Create content that feels magnetic, talk about your offers without feeling awkward, own your expertise, and build the kind of visibility that creates real momentum in your business. Wrapping up with powerful tapping and embodiment work to help you release the fear of being seen, back yourself unapologetically, and start showing up like the woman who's already decided she's getting paid.",
    ],
    callout: null,
  },
];

export type WorkshopStatus = "tbc" | "upcoming" | "live" | "past";

/** Where a workshop sits relative to `now`, driving what the countdown block renders. */
export function workshopStatus(workshop: Workshop, nowMs: number): WorkshopStatus {
  if (!workshop.startIso) return "tbc";
  const start = new Date(workshop.startIso).getTime();
  if (nowMs < start) return "upcoming";
  if (nowMs < start + workshop.durationMinutes * 60000) return "live";
  return "past";
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Time left until `startIso`, floored at zero so a countdown never runs negative. */
export function countdownTo(startIso: string, nowMs: number): Countdown {
  const remaining = Math.max(0, new Date(startIso).getTime() - nowMs);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/**
 * Workshops worth putting in front of a member, soonest first: anything still to come, plus
 * tbc ones so "there's more coming" stays visible between confirmed dates. Finished workshops
 * drop out, their replays live in the vault instead.
 */
export function upcomingWorkshops(nowMs: number): Workshop[] {
  return WORKSHOPS.filter((w) => workshopStatus(w, nowMs) !== "past").sort((a, b) => {
    if (!a.startIso) return 1;
    if (!b.startIso) return -1;
    return new Date(a.startIso).getTime() - new Date(b.startIso).getTime();
  });
}

/** Local-time date/time label for a workshop, e.g. "Tue 28 July · 19:00". */
export function formatWorkshopWhen(startIso: string): string {
  const d = new Date(startIso);
  const date = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}
