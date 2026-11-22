// Where each tapping session sits inside its replay. SERVER ONLY, for the same reason as
// workshop-replays.ts: the replays are unlisted, so an id in a public bundle is free viewing.
//
// Times are seconds into the replay, taken from YouTube's transcript: start on her first line of
// the tapping, end just after "and so it is".
import { replayFor } from "./workshop-replays";

if (typeof window !== "undefined") {
  throw new Error("tapping-clips.ts must never be bundled for the browser");
}

const CLIPS: Record<string, { workshopId: string; start: number; end: number }> = {
  // 31:32 to 39:03 in Visible AF
  "tapping-to-be-seen": { workshopId: "leo-szn-workshop-2", start: 1892, end: 2343 },
  // 39:05 to 42:20, the last round of the same session
  "tapping-to-sell-without-shrinking": { workshopId: "leo-szn-workshop-2", start: 2345, end: 2540 },
  // 57:17 to 61:20 in the Virgo New Moon Circle
  "tapping-to-trust-your-big-dreams": { workshopId: "virgo-szn-workshop-2", start: 3437, end: 3680 },
  // 46:29 to 51:29 in the Libra / Aries full moon workshop
  "tapping-to-want-more": { workshopId: "libra-szn-workshop-1", start: 2789, end: 3089 },
};

export function clipFor(slug: string): { youtubeId: string; start: number; end: number } | null {
  const c = CLIPS[slug];
  if (!c) return null;
  const youtubeId = replayFor(c.workshopId);
  return youtubeId ? { youtubeId, start: c.start, end: c.end } : null;
}
