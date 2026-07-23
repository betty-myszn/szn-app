"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getCurrentMember, type Member } from "@/lib/member";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const TIER_COPY: Record<"monthly" | "vip", { title: string; body: string }> = {
  monthly: {
    title: "you're in.",
    body: "Your membership is live. Live workshops, your personalised chart portal, the community, shadow work, all of it, unlocked.",
  },
  vip: {
    title: "welcome to VIP.",
    body: "You've got priority access to every guest expert, direct access to Betty between sessions, and first access to everything new, on top of the full membership.",
  },
};

// Reaching this URL means Stripe redirected her here, it does not mean the webhook has finished
// writing membership_level onto her profile yet, that can lag by a second or two. So this polls
// the real member record rather than trusting the URL alone, "she's on this page" is never
// treated as proof of anything, only her actual profile row is.
export default function CheckoutSuccessPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [checking, setChecking] = useState(true);
  const attemptsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const MAX_ATTEMPTS = 6;

    const poll = async () => {
      const m = await getCurrentMember();
      if (cancelled) return;

      if (m && m.membershipLevel !== "none") {
        setMember(m);
        setChecking(false);
        return;
      }

      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setMember(m);
        setChecking(false);
        return;
      }
      setTimeout(poll, 1800);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, []);

  const tier = member?.membershipLevel === "vip" ? "vip" : member?.membershipLevel === "monthly" ? "monthly" : null;

  return (
    <section
      className="min-h-[80vh] flex items-center justify-center px-5 py-16"
      style={{ background: "var(--dark)" }}
    >
      <div className="w-full max-w-lg bg-white p-8 md:p-12 text-center" style={{ border: "var(--border)" }}>
        {checking && !tier ? (
          <>
            <div className="tag mb-3">confirming your payment</div>
            <h1
              style={{
                fontFamily: poppins,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              hang tight, we&apos;re<br />
              <span className="pk">setting up your portal.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>
              Your payment went through. We&apos;re just syncing your membership, this usually takes a few seconds.
            </p>
          </>
        ) : tier ? (
          <>
            <div className="tag mb-3">payment confirmed</div>
            <h1
              style={{
                fontFamily: poppins,
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              <span className="pk">{TIER_COPY[tier].title}</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 32 }}>
              {TIER_COPY[tier].body}
            </p>
            <Link href="/dashboard" className="btn-pink" style={{ display: "inline-block" }}>
              enter my szn
            </Link>
          </>
        ) : (
          <>
            <div className="tag mb-3">almost there</div>
            <h1
              style={{
                fontFamily: poppins,
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              your payment succeeded,<br />
              <span className="pk">syncing is taking a moment.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
              This can occasionally lag behind the payment itself. Refreshing usually catches it, if it&apos;s still not showing after a minute or two, reach out and we&apos;ll sort it directly, your payment is safe either way.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-pink"
              style={{ cursor: "pointer", border: "none", marginRight: 12 }}
            >
              check again
            </button>
            <Link
              href="/dashboard"
              className="no-underline"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey-light)" }}
            >
              go to my portal
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
