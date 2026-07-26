"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  GA_MEASUREMENT_ID,
  getStoredConsent,
  setConsent,
  OPEN_CONSENT_EVENT,
  type ConsentChoice,
} from "@/lib/analytics";

const pp = "var(--font-poppins), Poppins, sans-serif";

/* ── Visibility as an external store ──
   Whether the banner is open isn't really React state, it's a reading of localStorage plus a
   transient "she just clicked the footer link" flag. Modelling it with useSyncExternalStore
   instead of useState + useEffect avoids the setState-in-effect cascade this React version lints
   against, and gives correct hydration for free: the server snapshot is always "closed", because
   the server can't know what's in her browser storage. */

let forcedOpen = false;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  const onOpenRequest = () => {
    forcedOpen = true;
    emitChange();
  };
  window.addEventListener(OPEN_CONSENT_EVENT, onOpenRequest);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener(OPEN_CONSENT_EVENT, onOpenRequest);
  };
}

function getSnapshot(): boolean {
  if (!GA_MEASUREMENT_ID) return false;
  return forcedOpen || getStoredConsent() === null;
}

// Never open during SSR: no storage to read, and a banner in the initial HTML would flash for the
// majority of visitors who already answered.
function getServerSnapshot(): boolean {
  return false;
}

/**
 * The cookie banner. Deliberately a bottom bar rather than a full-screen blocker: consent mode
 * already guarantees nothing is stored before she answers, so there's no legal need to hold the
 * page hostage, and a modal over the landing page would cost more conversions than the analytics
 * are worth.
 *
 * Accept and decline are the same size, weight and prominence. That's not a style choice, a
 * banner where "reject" is visually demoted is the single most commonly enforced dark pattern
 * under UK/EU guidance, and the fix is free.
 */
export default function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const acceptRef = useRef<HTMLButtonElement>(null);

  // Move focus to the banner when it appears so keyboard and screen reader users meet it at the
  // point it becomes relevant, instead of having to tab back through the whole page to find it.
  useEffect(() => {
    if (visible) acceptRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    forcedOpen = false;
    emitChange();
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-body"
      className="fixed bottom-0 left-0 right-0 z-50 px-5 py-5 md:px-8"
      style={{
        background: "var(--dark)",
        borderTop: "1.5px solid var(--pink)",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div>
          <h2
            id="cookie-consent-title"
            style={{
              fontFamily: pp,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 6,
            }}
          >
            cookies, the boring bit
          </h2>
          <p
            id="cookie-consent-body"
            style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", maxWidth: "60ch" }}
          >
            We use analytics cookies to see which parts of MY SZN actually help people, and which
            ones we should fix. Nothing is stored until you say yes, and we never sell your data.{" "}
            <Link
              href="/privacy"
              style={{ color: "var(--pink)", textDecoration: "underline", fontWeight: 600 }}
            >
              Read the privacy policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            ref={acceptRef}
            type="button"
            onClick={() => choose("granted")}
            className="btn-pink"
            style={{ fontFamily: pp, whiteSpace: "nowrap" }}
          >
            accept
          </button>
          <button
            type="button"
            onClick={() => choose("denied")}
            className="btn-outline btn-outline--white"
            style={{ fontFamily: pp, whiteSpace: "nowrap" }}
          >
            decline
          </button>
        </div>
      </div>
    </div>
  );
}
