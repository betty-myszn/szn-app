"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";

const DISMISS_KEY = "myszn-password-banner-dismissed";

// Non-intrusive nudge for legacy magic-link-only members to add a password, so next time they can
// log in without waiting for an email. Shown inside the portal (never as an interruptment on
// login), only when the member genuinely has no password yet, and dismissible for good.
export default function PasswordPromptBanner() {
  const { member, ready } = useMember();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (!ready || !member || member.passwordSet || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      className="px-5 md:px-8 py-3 flex items-center justify-center gap-4 flex-wrap"
      style={{ background: "var(--lav-light)", borderBottom: "var(--border)" }}
    >
      <p style={{ fontSize: 13, color: "var(--dark)", lineHeight: 1.5 }}>
        <span aria-hidden="true">🔐</span> Add a password so next time you can log in without waiting for an email.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/set-password"
          className="no-underline"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff", background: "var(--pink)", padding: "8px 16px" }}
        >
          set password
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{ background: "none", border: "none", fontSize: 12, color: "var(--grey)", cursor: "pointer", fontWeight: 700 }}
        >
          not now
        </button>
      </div>
    </div>
  );
}
