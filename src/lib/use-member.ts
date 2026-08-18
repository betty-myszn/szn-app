"use client";

import { useEffect, useState } from "react";
import { getCurrentMember, type Member } from "@/lib/member";
import { createClient } from "@/lib/supabase/client";
import { hydrateSessionOnce } from "@/lib/hydrate-session";

// Returns the real Supabase-authenticated member once mounted (null while loading or logged
// out). `ready` distinguishes "still checking" from "definitely logged out".
export function useMember(): { member: Member | null; ready: boolean } {
  const [member, setMember] = useState<Member | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const sync = async () => {
      const m = await getCurrentMember();
      if (!active) return;
      // Render as soon as we know who she is. Do NOT block the first paint on hydrateSessionOnce:
      // it pulls her chart, goals, journal, challenge progress, signals and preferences down from
      // Supabase (eight round-trips), and awaiting it here left every personalised page on a blank
      // white screen for several seconds, because those pages render nothing until `ready` flips.
      // Mark ready with the member now; hydrate in the background and re-read the member once it
      // lands so placements/streaks fill in without ever blocking the paint. On a returning browser
      // the local data is already there, so nothing visibly changes; only a brand-new device sees a
      // brief empty state fill in, which is far better than a five-second white screen.
      setMember(m);
      setReady(true);
      if (m) {
        hydrateSessionOnce()
          .then(async () => {
            if (!active) return;
            const refreshed = await getCurrentMember();
            if (active) setMember(refreshed);
          })
          .catch(() => {});
      }
    };
    sync();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => sync());
    window.addEventListener("myszn-auth-change", sync);

    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener("myszn-auth-change", sync);
    };
  }, []);

  return { member, ready };
}
