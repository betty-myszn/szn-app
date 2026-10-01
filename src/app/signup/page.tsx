"use client";

import { useState } from "react";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { MONTHLY_CHECKOUT_URL, VIP_CHECKOUT_URL } from "@/lib/checkout";
import { useEnrolmentOpen } from "@/lib/enrolment";

const poppins = "var(--font-poppins), Poppins, sans-serif";

type PlanId = "monthly" | "vip";

// The signup hub. Both plans hand off to Stripe checkout (same links as the membership page); the
// webhook parks the membership by email, claimed when she sets her password after checkout. The
// 7-day free trial that used to sit first here was retired on 1 Oct 2026, so joining is paid from
// day one. The old create-free route still exists (expired trials converge onto the free tier) but
// is no longer a front door.
const PLAN_OPTIONS: { id: PlanId; name: string; tagline: string; price: string }[] = [
  { id: "monthly", name: "MY SZN", tagline: "the full personalised platform, plus a live masterclass and astrotapping every month", price: "$88/mo" },
  { id: "vip", name: "MY SZN VIP", tagline: "everything in MY SZN, plus private 1:1 coaching with Betty", price: "$555/mo" },
];

export default function SignupPage() {
  const [plan, setPlan] = useState<PlanId>("monthly");
  const enrolmentOpen = useEnrolmentOpen();

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        <div className="tag mb-3">choose your szn</div>
        <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
          join <span className="pk">MY SZN.</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
          Go all in on the full personalised platform, or go VIP and have Betty working on your chart with you directly. You can always upgrade later.
        </p>

        {/* All three sign-ups together, so nobody has to leave to find the paid tiers */}
        <div className="flex flex-col gap-2 mb-7">
          {PLAN_OPTIONS.map((opt) => {
            const selected = plan === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPlan(opt.id)}
                aria-pressed={selected}
                className="w-full"
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  background: selected ? "var(--pink-light)" : "#fff",
                  border: selected ? "1.5px solid var(--pink)" : "var(--border)",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, letterSpacing: "-0.4px", color: "var(--dark)" }}>{opt.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--pink)" }}>{opt.price}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--grey)", lineHeight: 1.5, marginTop: 4 }}>{opt.tagline}</div>
              </button>
            );
          })}
        </div>

        <div>
          <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 16 }}>
            {plan === "vip"
              ? "VIP is the full platform plus private one to one astrology coaching with Betty, for when you want her working on your chart directly."
              : "MY SZN is the full personalised platform built around your own chart, with a live masterclass and a live astrotapping with Betty every month."}
          </p>
          <CheckoutButton
            checkoutUrl={enrolmentOpen ? (plan === "vip" ? VIP_CHECKOUT_URL : MONTHLY_CHECKOUT_URL) : undefined}
            label={plan === "vip" ? "join vip · $555/mo" : "join my szn · $88/mo"}
            fallbackHref="/membership#pricing"
            plan={plan}
            value={plan === "vip" ? 555 : 88}
          />
          <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 12, lineHeight: 1.6 }}>
            You&apos;ll set your password and add your birth details right after checkout.
          </p>
        </div>

        <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 20, lineHeight: 1.6 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--pink)", fontWeight: 700 }}>
            log in
          </Link>
        </p>
      </div>
    </section>
  );
}
