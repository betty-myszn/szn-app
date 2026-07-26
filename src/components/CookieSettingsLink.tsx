"use client";

import { GA_MEASUREMENT_ID, openConsentSettings } from "@/lib/analytics";

/**
 * Footer link that re-opens the cookie banner. Styled to sit in the footer's existing link row.
 * Renders nothing when analytics isn't configured, so local builds don't show a control that
 * opens a banner that never appears.
 */
export default function CookieSettingsLink() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <button
      type="button"
      onClick={openConsentSettings}
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.55)",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
      className="hover:!text-white transition-colors"
    >
      cookies
    </button>
  );
}
