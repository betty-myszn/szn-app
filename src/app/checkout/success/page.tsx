"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMember } from "@/lib/use-member";

const poppins = "var(--font-poppins), Poppins, sans-serif";

type Phase = "working" | "loggedIn";

// Where Stripe redirects after payment. Two people land here:
//   1. Someone already logged in when she paid, the webhook is updating her existing profile, so we
//      just welcome her in.
//   2. A payment-first buyer with no account yet, we hand her to /create-account, which verifies the
//      Stripe session server-side and creates her account through the protected flow. If no session
//      id reached this page she still goes to /create-account, which offers secure email recovery.
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { member, ready } = useMember();

  const [phase, setPhase] = useState<Phase>("working");

  useEffect(() => {
    if (!ready) return;
    if (member) {
      setPhase("loggedIn");
      return;
    }
    if (sessionId) {
      window.location.assign(`/create-account?session_id=${encodeURIComponent(sessionId)}`);
      return;
    }
    window.location.assign("/create-account");
  }, [ready, member, sessionId]);

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-lg bg-white p-8 md:p-12 text-center" style={{ border: "var(--border)" }}>
        {phase === "working" && (
          <>
            <div className="tag mb-3">confirming your payment</div>
            <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 16 }}>
              hang tight, we&apos;re<br />
              <span className="pk">confirming your payment.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>This only takes a second.</p>
          </>
        )}

        {phase === "loggedIn" && (
          <>
            <div className="tag mb-3">payment confirmed</div>
            <h1 style={{ fontFamily: poppins, fontSize: 32, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16 }}>
              <span className="pk">you&apos;re in.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 32 }}>
              Your payment went through and your membership is being set up. Head in to finish your chart and unlock your portal.
            </p>
            <Link href="/dashboard" className="btn-pink" style={{ display: "inline-block" }}>
              enter my szn
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
