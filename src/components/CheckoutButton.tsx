"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMember } from "@/lib/use-member";

const pp = "var(--font-poppins), Poppins, sans-serif";

interface CheckoutButtonProps {
  /** Stripe Payment Link. When absent, renders a "coming soon" waitlist fallback instead. */
  checkoutUrl?: string;
  label: string;
  dark?: boolean;
  waitlistHref?: string;
}

// Appends client_reference_id so the webhook can link the completed checkout straight back to
// this Supabase user, without it the webhook would have to guess by matching emails, and anyone
// who checks out with a different email than she signed up with would silently fail to link.
function withClientReferenceId(checkoutUrl: string, userId: string): string {
  const url = new URL(checkoutUrl);
  url.searchParams.set("client_reference_id", userId);
  return url.toString();
}

// Real money changes hands through this button, so the 3-month-minimum / no-refund agreement
// isn't a footnote, it's a required checkbox standing between her and the Stripe link. Renders
// a waitlist fallback when checkoutUrl isn't set yet (VIP / 3-month-upfront until those links
// exist), so swapping a plan from "coming soon" to "live" is a one-line prop change later.
// Requires an authenticated member before showing the real checkout link at all, checkout
// started while logged out has no Supabase user id to attach, so there'd be nothing for the
// webhook to grant access to even if the payment succeeded.
export default function CheckoutButton({ checkoutUrl, label, dark = false, waitlistHref = "#waitlist-form" }: CheckoutButtonProps) {
  const [agreed, setAgreed] = useState(false);
  const { member, ready } = useMember();
  const pathname = usePathname();

  const textColor = dark ? "#fff" : "var(--dark)";
  const mutedColor = dark ? "rgba(255,255,255,0.65)" : "var(--grey)";

  if (!checkoutUrl) {
    return (
      <a
        href={waitlistHref}
        className="block text-center no-underline"
        style={{
          background: "var(--pink)",
          color: dark ? "var(--dark)" : "#fff",
          fontFamily: pp,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "16px 32px",
          border: "none",
        }}
      >
        join the waitlist
      </a>
    );
  }

  // Not logged in yet: send her to log in first, then straight back here so she can pick up
  // exactly where she left off, checkout only makes sense once there's a real member id to
  // attach the subscription to.
  if (ready && !member) {
    return (
      <a
        href={`/login?redirect=${encodeURIComponent(pathname || "/membership")}`}
        className="block text-center no-underline"
        style={{
          background: "var(--pink)",
          color: dark ? "var(--dark)" : "#fff",
          fontFamily: pp,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "16px 32px",
          border: "none",
        }}
      >
        log in to join
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!agreed || !member) e.preventDefault();
  };

  return (
    <div>
      <label
        className="flex items-start gap-3 mb-4"
        style={{
          cursor: "pointer",
          padding: "12px 16px",
          background: dark ? "rgba(255,45,135,0.1)" : "var(--pink-light)",
          border: dark ? "1px solid rgba(255,45,135,0.3)" : "1px solid rgba(255,45,135,0.15)",
        }}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: 3, accentColor: "var(--pink)", width: 18, height: 18, flexShrink: 0 }}
        />
        <span style={{ fontSize: 12, lineHeight: 1.6, color: textColor }}>
          I understand MY SZN is a <strong>minimum 3-month commitment</strong> and payments are{" "}
          <strong>non-refundable</strong>. Monthly billing makes membership more accessible, it doesn&apos;t change the commitment.
        </span>
      </label>
      <a
        href={member ? withClientReferenceId(checkoutUrl, member.id) : undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-disabled={!agreed}
        className="block text-center no-underline"
        style={{
          background: "var(--pink)",
          color: dark ? "var(--dark)" : "#fff",
          fontFamily: pp,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "16px 32px",
          border: "none",
          opacity: agreed ? 1 : 0.5,
          cursor: agreed ? "pointer" : "not-allowed",
        }}
      >
        {label}
      </a>
      <p style={{ fontSize: 10, color: mutedColor, marginTop: 8, textAlign: "center" }}>
        opens secure checkout on Stripe
      </p>
    </div>
  );
}
