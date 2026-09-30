"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SznPicker from "@/components/SznPicker";
import { useSeason } from "@/lib/use-season";
import { loadSznPicks } from "@/lib/szn-picks-store";
import { SAVED_FLAG } from "@/lib/szn-picks";

// "customise my szn" from the account menu: the same picker she saw on day one, holding her
// current picks. Member-only through the /your-season gate in proxy.ts.

export default function CustomiseMySznPage() {
  const season = useSeason();
  const router = useRouter();
  const [initial, setInitial] = useState<string[] | null>(null);

  useEffect(() => {
    loadSznPicks().then((s) => setInitial(s.picks ?? []));
  }, []);

  const done = useCallback(() => {
    try {
      sessionStorage.setItem(SAVED_FLAG, "1");
    } catch {
      // No toast on the dashboard, the reshuffle still shows it worked.
    }
    router.push("/dashboard");
  }, [router]);

  if (!initial) return <div className="szn-page" aria-busy="true" />;
  return <SznPicker mode="edit" season={season} initial={initial} onDone={done} />;
}
