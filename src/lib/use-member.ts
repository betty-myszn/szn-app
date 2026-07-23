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
      let m = await getCurrentMember();
      if (!active) return;
      // Logged in: pull her chart, goals, journal and challenge progress down from Supabase
      // (once per tab session, hydrateSessionOnce no-ops on repeat calls) in case this browser
      // has never seen them before, then re-read the member so placements reflect what landed.
      if (m) {
        await hydrateSessionOnce();
        if (!active) return;
        m = await getCurrentMember();
        if (!active) return;
      }
      setMember(m);
      setReady(true);
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
