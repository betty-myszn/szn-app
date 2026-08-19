"use client";

import { useEffect, useState } from "react";
import { getCurrentMember, type Member } from "@/lib/member";
import { createClient } from "@/lib/supabase/client";
import { hydrateSessionOnce } from "@/lib/hydrate-session";

// Returns the real Supabase-authenticated member once mounted (null while loading or logged
// out). `ready` distinguishes "still checking" from "definitely logged out". `error` is true when
// the member lookup itself failed (a transient Supabase/auth/network problem) rather than the user
// simply being logged out, so a gated page can offer a retry instead of a misleading "log in".
export function useMember(): { member: Member | null; ready: boolean; error: boolean } {
  const [member, setMember] = useState<Member | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const sync = async () => {
      // getCurrentMember hits Supabase (auth.getUser + the profile query) and can REJECT: a
      // transient network/Supabase blip, or the session-cookie race in the first moment after a
      // server-side signup redirects straight to a gated page. If that rejection is left to bubble,
      // `setReady(true)` below never runs, and every gated page (which renders nothing until `ready`
      // flips) is stuck on a permanently blank white screen with no way out, exactly the "dashboard
      // still won't load" report. So the fetch is wrapped: on failure we surface `error`, treat her
      // as unknown for now, and STILL mark ready in the finally so the page can show a recovery
      // state. `ready` must always become true, no matter what getCurrentMember does.
      let m: Member | null = null;
      try {
        m = await getCurrentMember();
        if (active) setError(false);
      } catch (e) {
        console.error("useMember: getCurrentMember failed", e);
        if (active) setError(true);
        m = null;
      } finally {
        if (active) setReady(true);
      }
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
      if (m) {
        hydrateSessionOnce()
          .then(async () => {
            if (!active) return;
            try {
              const refreshed = await getCurrentMember();
              if (active) setMember(refreshed);
            } catch {
              // Keep the member we already have; a failed re-read must not blank the page.
            }
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

  return { member, ready, error };
}
