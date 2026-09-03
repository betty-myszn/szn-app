"use client";

import { useCallback, useEffect, useState } from "react";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { track, EVENTS } from "@/lib/analytics";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The first thing a new member sees on her dashboard, once.
//
// Deliberately three panels rather than a step-by-step tour of the page. The dashboard is about
// nineteen sections long and several of them are queued for a rebuild (see DASHBOARD-HQ-HANDOFF.md),
// so anything that spotlights elements by position would be pointing at furniture that is about to
// move. This explains what the platform IS and hands off to the activation strip, which carries the
// what-to-do-next job for the rest of the week, and it anchors to nothing.
//
// Shown to genuinely new accounts only. Rolling it out must not ambush a member who has been here
// for months with a "welcome" she does not need.
const NEW_ACCOUNT_DAYS = 14;
const SEEN_KEY = "myszn-welcome-seen";

/**
 * Whether this member should be welcomed. Exported and tested because the cost of getting it wrong
 * is not subtle: a loose check greets every member who has been here for months with a popup she
 * has no use for, on a rollout she never asked for.
 *
 * `seen` is passed in rather than read here so the storage failure can be decided by the caller: a
 * browser that cannot tell us whether she has seen it is treated as "not seen", since a second
 * welcome is a smaller problem than throwing on her dashboard.
 */
export function shouldWelcome(memberSince: string | null | undefined, nowMs: number, seen: boolean): boolean {
  if (seen || !memberSince) return false;
  const joined = new Date(memberSince).getTime();
  if (!Number.isFinite(joined)) return false;
  const age = nowMs - joined;
  // A negative age means a clock skew between her device and the server, not a member from the
  // future. Treated as brand new, which is what she almost certainly is.
  return age <= NEW_ACCOUNT_DAYS * 86_400_000;
}

/** The dashboard already puts this anchor immediately above her szn guide. */
const READING_ANCHOR = "season-guide";

interface Panel {
  eyebrow: string;
  heading: (firstName: string, season: string) => string;
  body: (season: string, sun: string | null) => string;
  cta: string;
}

const PANELS: Panel[] = [
  {
    eyebrow: "welcome in",
    heading: (firstName) => `hey ${firstName}, your chart is the guide to you.`,
    body: (season, sun) =>
      sun
        ? `Your birth chart is the map of how you're built: what you came here for, where you shine, and where you keep getting in your own way. Everything on this page is built from yours, so what you're looking at is ${season} szn through your ${sun} placements rather than a horoscope written for everybody.`
        : `Your birth chart is the map of how you're built: what you came here for, where you shine, and where you keep getting in your own way. Everything on this page is built from yours, so what you're looking at is ${season} szn through your own placements rather than a horoscope written for everybody.`,
    cta: "next",
  },
  {
    eyebrow: "your szn guide",
    heading: () => "the szn guide is how you live it.",
    body: (season) =>
      `Knowing your chart and actually living it are two different things, and the szn guide is the second one: how to create your best life this season, area by area, using what your chart and your human design already say about you. It's further down this page, and it's rewritten every time the season turns, so ${season} szn asks something different of you than the last one did.`,
    cta: "next",
  },
  {
    eyebrow: "the rooms",
    heading: () => "you're not doing this on your own.",
    body: (season) =>
      `The rooms are where the rest of it happens: the group chat, a room for wins where nobody makes you play it down, one for astrology, and the ${season} szn room where everyone in this season ends up. On top of that there's a live masterclass and a live astrotapping with me every month, and every replay stays in the vault for you.`,
    cta: "next",
  },
  {
    eyebrow: "start here",
    heading: () => "you don't have to read all of it today.",
    body: () =>
      "Start with your szn guide, post one thing in a room so the girls know you're here, and write down one goal for this season. There's a strip at the top of this page keeping track of those three, and it disappears once they're done.",
    cta: "take me to my guide",
  },
];

export default function WelcomeOverlay() {
  const { member, ready } = useMember();
  const season = useSeason();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  // Decided after mount so the seen flag and the account age are read in the browser, never during a
  // render that the server also performs.
  useEffect(() => {
    if (!ready || !member) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage blocked. Treated as not seen: it can still be dismissed, and showing it twice beats
      // throwing on her dashboard.
    }
    if (!shouldWelcome(member.memberSince, Date.now(), seen)) return;
    setOpen(true);
    track(EVENTS.WELCOME_STEP, { step: 1 });
  }, [ready, member]);

  const close = useCallback(
    (completed: boolean) => {
      setOpen(false);
      try {
        window.localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Nothing to do: she'll see it once more next time, which is a far smaller problem than
        // throwing on her dashboard.
      }
      track(EVENTS.WELCOME_CLOSED, { step: step + 1, completed });
    },
    [step]
  );

  const finish = useCallback(() => {
    close(true);
    // Hand her straight to the thing the whole platform is for, rather than leaving her at the top
    // of a very long page wondering where it was.
    document.getElementById(READING_ANCHOR)?.scrollIntoView({ behavior: "smooth" });
  }, [close]);

  const next = useCallback(() => {
    if (step === PANELS.length - 1) {
      finish();
      return;
    }
    const to = step + 1;
    setStep(to);
    track(EVENTS.WELCOME_STEP, { step: to + 1 });
  }, [step, finish]);

  // Escape closes, and the page behind stops scrolling while it's up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open || !member) return null;

  const panel = PANELS[step];
  const firstName = (member.name || "").trim().split(/\s+/)[0]?.toLowerCase() || "you";
  const sun = member.placements?.sun ? member.placements.sun.toLowerCase() : null;
  const seasonName = season.sign.toLowerCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to MY SZN"
      onClick={(e) => {
        if (e.target === e.currentTarget) close(false);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(26,26,26,0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          border: "2px solid var(--dark)",
          borderRadius: 20,
          boxShadow: "10px 10px 0 var(--pink)",
          padding: "34px 28px 26px",
        }}
      >
        <button
          onClick={() => close(false)}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            color: "var(--grey-light)",
            padding: 4,
          }}
        >
          ×
        </button>

        <div style={{ fontFamily: poppins, fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
          {panel.eyebrow}
        </div>

        <h2 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-0.9px", lineHeight: 1.12, marginBottom: 14, textWrap: "balance" }}>
          {panel.heading(firstName, seasonName)}
        </h2>

        <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--grey-light)", marginBottom: 26 }}>
          {panel.body(seasonName, sun)}
        </p>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2" aria-hidden="true">
            {PANELS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === step ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === step ? "var(--pink)" : "var(--lav-light)",
                  transition: "width .18s ease",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: poppins, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)" }}
              >
                back
              </button>
            )}
            <button
              onClick={next}
              style={{
                fontFamily: poppins,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#fff",
                background: "var(--pink)",
                border: "2px solid var(--dark)",
                borderRadius: 999,
                padding: "11px 22px",
                cursor: "pointer",
              }}
            >
              {panel.cta}
            </button>
          </div>
        </div>

        <button
          onClick={() => close(false)}
          style={{ display: "block", margin: "18px auto 0", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--grey-light)", textDecoration: "underline" }}
        >
          skip for now
        </button>
      </div>
    </div>
  );
}
