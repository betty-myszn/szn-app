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
  /** YouTube video id for the replay, set once the class is over and uploaded, null until then.
   *  Just the id (e.g. "dQw4w9WgXcQ"), not the full watch url. */
  replayYoutubeId: string | null;
  /** The day the replay went up (ISO date, e.g. "2026-08-06"), not the class date, since a
   *  recording is edited and uploaded after the fact. Drives the "new replay" feature window on
   *  the season home. null until a replay exists. */
  replayPublishedAt: string | null;
  paragraphs: string[];
  callout: { plain: string; pink: string } | null;
  /** Cover image for the workshop card/carousel (path under /public). Optional; cards fall back to
   *  a gradient when there's no cover yet. */
  coverImage?: string;
}

export const WORKSHOPS: Workshop[] = [
  {
    id: "leo-szn-workshop-1",
    label: "leo szn workshop 1",
    meta: "3 august · 7pm la time · first live class",
    title: "Leo Season: Enter Your Main Character Era",
    coverImage: "/leo-workshop-cover.png",
    dark: true,
    startIso: "2026-08-03T19:00:00-07:00",
    durationMinutes: 75,
    location: "live on zoom, join link below once you're rsvp'd",
    zoomUrl: "https://us06web.zoom.us/j/87348495713?pwd=eVykh1qIwFdS5xYVsT6dbUmklWRbCa.1",
    zoomMeetingId: "873 4849 5713",
    zoomPasscode: "391862",
    replayYoutubeId: "0M03CqjaUnY",
    replayPublishedAt: "2026-08-06",
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
    meta: "17 august · 7pm la time · next live class",
    title: "Visible AF: How to Show Up & Get Paid",
    coverImage: "/visible-af-cover.png",
    dark: false,
    startIso: "2026-08-17T19:00:00-07:00",
    durationMinutes: 75,
    location: "live on zoom, link emailed before class",
    zoomUrl: null,
    zoomMeetingId: null,
    zoomPasscode: null,
    replayYoutubeId: null,
    replayPublishedAt: null,
    paragraphs: [
      "You weren't born to be the internet's best kept secret.",
      "If you've been sitting on ideas, rewriting captions seventeen times, waiting until you feel more confident, or watching everyone else take up space while you quietly cheer them on from the sidelines… we're changing that.",
      "This is a tapping workshop, so we work underneath the mindset advice, down at the wiring. The shrinking, the over-editing, the waiting until you feel ready, all of it is your nervous system reading visibility as danger and money as unsafe, and we tap through those exact charges, the fear of being seen, judged, too much or wrong, until your body stops bracing every time you go to put yourself out there.",
      "By the end you'll have started reprogramming the beliefs that kept you hidden and small, so showing up, talking about your offers and charging what you're worth begins to feel natural instead of terrifying. You leave with the tapping rounds to keep going at home, and the settled, backed-yourself energy of a woman who has already decided she's getting paid.",
    ],
    callout: null,
  },
  {
    id: "virgo-szn-workshop-1",
    label: "virgo szn workshop 1",
    meta: "26 august · 6:30pm la time · kick off virgo szn",
    title: "Virgo Season Goal-Setting: Map the Rest of Your Year",
    dark: true,
    startIso: "2026-08-26T18:30:00-07:00",
    durationMinutes: 75,
    location: "live on zoom, link emailed before class",
    zoomUrl: null,
    zoomMeetingId: null,
    zoomPasscode: null,
    replayYoutubeId: null,
    replayPublishedAt: null,
    paragraphs: [
      "We're opening Virgo season the way it's meant to be opened, by sitting down together and deciding exactly where the rest of your year is going before the season carries you into it.",
      "Virgo carries the most practical, get-it-done energy of the whole zodiac, which makes this the perfect moment to turn the vague wishes in your head into a plan you'll actually follow.",
      "This one is a proper working session. We'll map what you want between now and the end of the year, look at what the current sky is asking of you and the areas of your chart lit up right now, and break it all into moves you can genuinely make in a normal, busy week.",
      "Bring a notebook and something to write with. You'll leave with your goals for the rest of the year written down, ordered, and turned into the first few steps you'll actually take this week.",
    ],
    callout: null,
  },
  {
    id: "virgo-szn-workshop-2",
    label: "virgo szn workshop 2",
    meta: "2 september · 6:30pm la time · virgo szn preview",
    title: "Virgo Season: Get Your Sh*t Together & Become Her",
    dark: false,
    coverImage: "/virgo-workshop-cover.jpg",
    startIso: "2026-09-02T18:30:00-07:00",
    durationMinutes: 75,
    location: "live on zoom, link emailed before class",
    zoomUrl: null,
    zoomMeetingId: null,
    zoomPasscode: null,
    replayYoutubeId: null,
    replayPublishedAt: null,
    paragraphs: [
      "With your goals set, this is the session where we do the deeper work of actually becoming the woman who follows through on them.",
      "If your life has been running on half-finished to-do lists, good intentions you keep pushing to next week, and a version of you that only shows up once everything finally feels organised enough, this is where that pattern ends.",
      "We'll work with the astrology of discipline, devotion and self-mastery, looking at the placements that show where you're built to turn chaos into order, the habits that have been quietly draining you, and how to use this Virgo season to build a life that runs on systems instead of stress.",
      "Expect grounding prompts, real astrology, tapping and embodiment work to help you close the gap between the woman you keep meaning to become and the one who simply gets it done.",
    ],
    callout: {
      plain: "This is the season you stop waiting to feel ready and start becoming ",
      pink: "her.",
    },
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

/**
 * Finished workshops, most recent first, for the replay vault. The mirror image of
 * upcomingWorkshops: only classes whose start time (plus their run length) is already behind us,
 * which are exactly the ones with a real startIso, so the sort never sees a null.
 */
export function pastWorkshops(nowMs: number): Workshop[] {
  return WORKSHOPS.filter((w) => workshopStatus(w, nowMs) === "past").sort(
    (a, b) => new Date(b.startIso!).getTime() - new Date(a.startIso!).getTime()
  );
}

// How long a freshly uploaded replay is showcased as "new" on the season home before it settles
// into the standing "catch up on replays" banner.
export const REPLAY_FRESH_DAYS = 3;

/** The most recently uploaded replay across all workshops, or null if none has one yet. Drives
 *  the single "new replay" spotlight on the home page (we only ever headline one at a time). */
export function latestReplay(): Workshop | null {
  const withReplay = WORKSHOPS.filter((w) => w.replayYoutubeId && w.replayPublishedAt);
  if (withReplay.length === 0) return null;
  return withReplay.sort((a, b) => (b.replayPublishedAt! < a.replayPublishedAt! ? -1 : 1))[0];
}

/** The newest uploaded replay for a given zodiac sign, or null if that season has none yet. Used
 *  to surface a season's own workshop on its public /seasons/[sign] page. Workshop ids are named
 *  "<sign>-szn-workshop-N", so the sign slug is just the id prefix. */
export function replayForSign(sign: string): Workshop | null {
  const prefix = `${sign.toLowerCase()}-`;
  const matches = WORKSHOPS.filter(
    (w) => w.replayYoutubeId && w.replayPublishedAt && w.id.toLowerCase().startsWith(prefix)
  );
  if (matches.length === 0) return null;
  return matches.sort((a, b) => (b.replayPublishedAt! < a.replayPublishedAt! ? -1 : 1))[0];
}

/** Whether a replay is still inside its "new" window, i.e. uploaded within the last few days.
 *  After that the home page swaps the spotlight for the standing replay-vault banner. */
export function isReplayFresh(workshop: Workshop, nowMs: number): boolean {
  if (!workshop.replayPublishedAt) return false;
  const publishedMs = new Date(`${workshop.replayPublishedAt}T00:00:00Z`).getTime();
  return nowMs - publishedMs < REPLAY_FRESH_DAYS * 86400000;
}

/** Local-time date/time label for a workshop, e.g. "Mon 3 August · 19:00". Renders in the viewer's
 *  own zone, which is what a member wants on her event card ("when is this for me?"). */
export function formatWorkshopWhen(startIso: string): string {
  const d = new Date(startIso);
  const date = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

// Classes are scheduled and advertised in LA time, so marketing copy is pinned to that zone
// rather than the reader's.
const CLASS_ZONE = "America/Los_Angeles";

/** Marketing label for a workshop, anchored to LA, e.g. "mon 3 august · 7pm la time".
 *
 *  Deliberately NOT viewer-local, unlike formatWorkshopWhen above. Two reasons: every other piece
 *  of copy on the site quotes this class as "7pm la time", so a viewer-local render would
 *  contradict it; and 7pm LA is already the next day in Asia, so Betty in Vietnam (UTC+7) would be
 *  shown "tue 4 august" while an LA reader saw "mon 3 august". It would also differ between the
 *  server render and the client render, which is a hydration mismatch. */
export function formatWorkshopWhenLA(startIso: string): string {
  const d = new Date(startIso);
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: CLASS_ZONE,
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(d);
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: CLASS_ZONE,
    hour: "numeric",
    hour12: true,
  }).format(d);
  return `${date.toLowerCase()} · ${hour.toLowerCase().replace(/\s+/g, "")} la time`;
}
