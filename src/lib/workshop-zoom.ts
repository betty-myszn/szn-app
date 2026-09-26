// Zoom join details for live workshops. SERVER ONLY.
//
// These used to sit on each entry in workshops.ts, but that file is bundled into public pages (the
// homepage, /free-trial, /membership, /seasons/[sign]), so the link and its passcode were readable
// in the page source by anyone, member or not. The member check on the join button only ever hid
// the button, it never protected the link.
//
// This module is read by /api/workshops/join and nothing else, which checks membership on the
// server before handing anything out. The guard below makes it fail loudly rather than leak quietly
// if it is ever imported into something that runs in the browser.
if (typeof window !== "undefined") {
  throw new Error("workshop-zoom.ts must never be bundled for the browser");
}

export interface ZoomDetails {
  url: string;
  meetingId: string;
  passcode: string;
}

const ZOOM: Record<string, ZoomDetails> = {
  // Virgo New Moon Circle, Thu 10 Sep 7pm LA = Fri 11 Sep 9am Vietnam.
  "virgo-szn-workshop-2": {
    url: "https://us06web.zoom.us/j/87894127791?pwd=E9EboabBG56tTIgPjESafHragbEHgA.1",
    meetingId: "878 9412 7791",
    passcode: "028236",
  },
  // Aries Full Moon: Call In Your Venus Era, Sat 26 Sep 11:30am LA = 7:30pm UK.
  "libra-szn-workshop-1": {
    url: "https://us06web.zoom.us/j/84119294738?pwd=Gd5kHd3QoHyIMNu0AcFMgbajFUSZIw.1",
    meetingId: "841 1929 4738",
    passcode: "976617",
  },
};

export function zoomFor(workshopId: string): ZoomDetails | null {
  return ZOOM[workshopId] ?? null;
}
