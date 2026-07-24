"use client";

import { useState } from "react";
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
// this Supabase user by id (the reliable path). Only used when she's already logged in. A
// logged-out, payment-first buyer has no user id yet, so she checks out on the plain link and the
// webhook parks her membership by the email she pays with, to be claimed when she activates.
function withClientReferenceId(checkoutUrl: string, userId: string): string {
  const url = new URL(checkoutUrl);
  url.searchParams.set("client_reference_id", userId);
  return url.toString();
}

// Real money changes hands through this button, so the 3-month-minimum / no-refund agreement
// isn't a footnote, it's a required checkbox standing between her and the Stripe link. Renders
// a waitlist fallback when checkoutUrl isn't set yet (VIP / 3-month-upfront until those links
// exist), so swapping a plan from "coming soon" to "live" is a one-line prop change later.
// Payment-first: she does NOT need to log in before paying. If she happens to already be logged
// in, we attach her user id via client_reference_id for a clean id-based link; if she's logged
// out, she checks out on the plain link and the webhook parks her membership by email, which she
// claims when she sets up her account (password) on /create-account afterwards.
export default function CheckoutButton({ checkoutUrl, label, dark = false, waitlistHref = "#waitlist-form" }: CheckoutButtonProps) {
  const [agreed, setAgreed] = useState(false);
  const { member } = useMember();

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!agreed) e.preventDefault();
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
        href={member ? withClientReferenceId(checkoutUrl, member.id) : checkoutUrl}
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
