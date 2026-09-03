"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Lets an email link land on a section rather than on the top of the dashboard.
//
// The dashboard is a very long scroll, so "go and read your szn guide" followed by a link to the
// front door makes her hunt for the thing the email just told her to open. `?open=guide` scrolls her
// to it on arrival.
//
// A query parameter rather than a #hash on purpose: a fragment never reaches the server, so the
// login round trip (proxy.ts sends a signed-out visitor to /login?redirect=..., preserving the query
// string) would silently drop it and land her at the top anyway. Query survives that hop, which is
// the hop most email readers take.
const TARGETS: Record<string, string> = {
  guide: "season-guide",
};

/** Give up after this long. The dashboard hydrates its chart before the real sections render, so the
 *  target genuinely may not exist for a second or two, but a link that is still hunting ten seconds
 *  later is a link to a section that isn't coming. */
const MAX_WAIT_MS = 10_000;
const POLL_MS = 250;

export default function DeepLinkScroll() {
  const params = useSearchParams();

  useEffect(() => {
    const key = params.get("open");
    const id = key ? TARGETS[key] : undefined;
    if (!id) return;

    let waited = 0;
    const timer = setInterval(() => {
      waited += POLL_MS;
      const target = document.getElementById(id);
      // The welcome overlay locks body scroll while it's open. Scrolling underneath it would be
      // thrown away when she closes it, so wait her out and land the scroll afterwards.
      const scrollLocked = document.body.style.overflow === "hidden";
      if (target && !scrollLocked) {
        target.scrollIntoView({ behavior: "smooth" });
        clearInterval(timer);
      } else if (waited >= MAX_WAIT_MS) {
        clearInterval(timer);
      }
    }, POLL_MS);

    return () => clearInterval(timer);
  }, [params]);

  return null;
}
