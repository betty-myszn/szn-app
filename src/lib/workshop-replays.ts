// YouTube ids for workshop replays. SERVER ONLY.
//
// The replays are unlisted, so anyone holding an id can watch. They used to sit on each entry in
// workshops.ts, which is bundled into public pages, so every paid replay was in the page source
// for anyone to lift; the vault's membership check only ever hid the player. Same leak as the
// Zoom links, same fix: read by /api/workshops/replay and nothing else, which checks membership on
// the server first. The guard fails loudly if this is ever pulled into a browser bundle.
if (typeof window !== "undefined") {
  throw new Error("workshop-replays.ts must never be bundled for the browser");
}

const REPLAYS: Record<string, string> = {
  "leo-szn-workshop-1": "0M03CqjaUnY",
  "leo-szn-workshop-2": "FfdDrqfZ4ic",
  "virgo-szn-workshop-1": "NgKBnHmj7K8",
  "virgo-szn-workshop-2": "xNKJsqbjgI4",
};

export function replayFor(workshopId: string): string | null {
  return REPLAYS[workshopId] ?? null;
}
