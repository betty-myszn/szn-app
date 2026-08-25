"use client";

import { useEffect, useState } from "react";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const DISMISS_KEY = "myszn_pwa_prompt_dismissed";

// Chrome/Android fire beforeinstallprompt, which we capture and turn into a real "install" button.
// iOS Safari has no such event, so there we show the manual Share -> Add to Home Screen hint. The
// banner hides itself when the app is already installed (standalone) or once she dismisses it.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// The iOS share icon (square tray with an up arrow), drawn inline so it always renders and matches
// exactly what she taps in Safari.
function ShareGlyph() {
  return (
    <svg
      width="14"
      height="17"
      viewBox="0 0 24 28"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, opacity: 0.9 }}
    >
      <path d="M12 2 L12 16" />
      <path d="M7 7 L12 2 L17 7" />
      <path d="M5.5 11 H4.5 A2.5 2.5 0 0 0 2 13.5 V23.5 A2.5 2.5 0 0 0 4.5 26 H19.5 A2.5 2.5 0 0 0 22 23.5 V13.5 A2.5 2.5 0 0 0 19.5 11 H18.5" />
    </svg>
  );
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
    if (standalone) return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // storage blocked, still fine to show
    }

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    setIsIOS(ios);
    if (ios) {
      setShow(true);
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => {});
    dismiss();
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Install MY SZN"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 60,
        maxWidth: 440,
        margin: "0 auto",
        background: "var(--dark)",
        border: "1.5px solid var(--pink)",
        padding: "14px 14px 14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon-192.png"
        alt=""
        width={40}
        height={40}
        style={{ flexShrink: 0, borderRadius: 8 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: poppins, fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.2px" }}>
          Add MY SZN to your home screen
        </div>
        {isIOS ? (
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.5,
              marginTop: 3,
              display: "flex",
              alignItems: "center",
              gap: 5,
              flexWrap: "wrap",
            }}
          >
            <span>Tap</span>
            <ShareGlyph />
            <span>then &ldquo;Add to Home Screen&rdquo;.</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginTop: 3 }}>
            Your whole season, one tap away.
          </div>
        )}
      </div>

      {!isIOS && (
        <button
          onClick={install}
          style={{
            flexShrink: 0,
            background: "var(--pink)",
            color: "var(--dark)",
            border: "none",
            fontFamily: poppins,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          install
        </button>
      )}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.6)",
          fontSize: 20,
          lineHeight: 1,
          cursor: "pointer",
          padding: "4px 6px",
        }}
      >
        ×
      </button>
    </div>
  );
}
