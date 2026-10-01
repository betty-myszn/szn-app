"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SznWheel from "@/components/SznWheel";
import { SEEN_KEY as WELCOME_SEEN_KEY, shouldWelcome } from "@/components/WelcomeOverlay";
import { createClient } from "@/lib/supabase/client";
import { getCurrentMember } from "@/lib/member";
import { hasActiveAccess } from "@/lib/membership-access";
import { eraName, isFirstRunAccount } from "@/lib/szn-picks";
import { markLaunchSeen } from "@/lib/szn-picks-store";
import { track, EVENTS } from "@/lib/analytics";

// The launch of "customise my szn", once, for every member who can use it and hasn't picked yet,
// on whichever member page she lands. Lives in the root layout so it reaches the members who open
// the app straight into the chat rooms as well as the ones who start on the dashboard.
//
// Never shown: to new accounts (they get the full picker before their first dashboard), to anyone
// who has already picked or skipped, on the picker page itself, or on the same visit as the
// first-week welcome overlay, so two popups never stack.

const MEMBER_PATHS = ["/dashboard", "/my-chart", "/your-season", "/community", "/journal", "/goals", "/meditations", "/challenges", "/affirmations", "/style", "/events", "/messages"];

// The wheel on the popup plays through a few real-looking mixes so the idea lands before she reads.
const DEMO = [["money"], ["money", "relationships"], ["money", "relationships", "career"], ["healing"], ["healing", "purpose"], ["healing", "purpose", "confidence"]];

export default function SznLaunchModal() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) return;
    if (!MEMBER_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;
    if (pathname.startsWith("/your-season/customise")) return;
    let cancelled = false;
    (async () => {
      // Cheap local checks first, so the many members who have already answered cost no network.
      const { data } = await createClient().auth.getSession();
      const meta = data.session?.user?.user_metadata;
      if (!data.session || !meta || Array.isArray(meta.szn_picks) || meta.szn_launch_seen === true) return;
      const member = await getCurrentMember().catch(() => null);
      if (cancelled || !member) return;
      if (!member.hasFullAccess || !hasActiveAccess(member) || !member.onboarded) return;
      if (isFirstRunAccount(member.memberSince)) return;
      let welcomeSeen = true;
      try {
        welcomeSeen = window.localStorage.getItem(WELCOME_SEEN_KEY) === "1";
      } catch {
        // Can't tell, so assume the welcome is not about to show.
      }
      if (pathname === "/dashboard" && shouldWelcome(member.memberSince, Date.now(), welcomeSeen)) return;
      setOpen(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, open]);

  useEffect(() => {
    if (!open) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setStep(2);
      return;
    }
    const t = setInterval(() => setStep((s) => (s + 1) % DEMO.length), 1300);
    return () => clearInterval(t);
  }, [open]);

  const close = useCallback((choice: "customise" | "later") => {
    setOpen(false);
    markLaunchSeen();
    track(EVENTS.CTA_CLICK, { label: `szn_launch_${choice}` });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("later");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;
  const demo = DEMO[step];

  return (
    <div className="szn-sheet" role="dialog" aria-modal="true" aria-labelledby="szn-launch-title" onClick={() => close("later")}>
      <div
        className="szn-holo"
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 440, border: "2px solid var(--dark)", borderRadius: 26, padding: "30px 24px 22px", boxShadow: "7px 7px 0 var(--pink)", maxHeight: "92vh", overflowY: "auto" }}
      >
        <span className="szn-sticker" style={{ left: 18, top: -12 }}>
          new feature ✦
        </span>
        <button
          type="button"
          onClick={() => close("later")}
          aria-label="Close"
          style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", fontSize: 22, lineHeight: 1, cursor: "pointer", color: "var(--dark)" }}
        >
          ×
        </button>

        <div style={{ width: 150, margin: "4px auto 6px" }}>
          <SznWheel picks={demo} showCount={false} />
        </div>
        <p style={{ textAlign: "center", fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 800, fontSize: 13, color: "var(--pink)", textTransform: "lowercase", margin: "0 0 16px", minHeight: 18 }} aria-hidden>
          your {eraName(demo)}
        </p>

        <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 6 }}>
          now live on my szn
        </div>
        <h2 id="szn-launch-title" className="szn-title" style={{ fontSize: "clamp(30px, 8vw, 40px)", marginBottom: 12 }}>
          customise <span className="szn-holo-text">my szn</span>
        </h2>
        <p style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 800, fontSize: 18, lineHeight: 1.25, margin: "0 0 10px", color: "var(--dark)" }}>
          What do you want to hear MORE of every month? What do you want to go deeper on?
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 20px", color: "var(--dark)" }}>
          {"Money, love, career, healing, your purpose, whatever's calling you. Tap the parts of your life you want more of and your whole dashboard rebuilds around them, with the deep reads for your picks up top and the rest of your chart still right there. Every new season you get to choose again."}
        </p>

        <Link href="/your-season/customise" onClick={() => close("customise")} className="szn-cta szn-holo-hot no-underline" style={{ textAlign: "center" }}>
          customise my szn ✦
        </Link>
        <button type="button" className="szn-skip" onClick={() => close("later")}>
          maybe later, it lives in my menu
        </button>
      </div>
    </div>
  );
}
