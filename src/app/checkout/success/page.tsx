"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMember } from "@/lib/use-member";

const poppins = "var(--font-poppins), Poppins, sans-serif";

type Phase = "working" | "loggedIn" | "sent" | "needEmail";

// Where Stripe redirects after payment. Two very different people land here:
//   1. Someone who was already logged in when she paid, her profile is already being updated by
//      the webhook, so we just welcome her in.
//   2. A payment-first buyer with no account yet, her membership is parked against her email and
//      she needs an activation magic link to claim it. We send that link from here (verified
//      against her real payment server-side), then tell her to check her inbox.
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { member, ready } = useMember();

  const [phase, setPhase] = useState<Phase>("working");
  const [sentTo, setSentTo] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activateBySession = useCallback(async () => {
    setPhase("working");
    try {
      const res = await fetch("/api/checkout/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Couldn't auto-verify from the session (e.g. success URL wasn't set up to pass it), fall
        // back to asking for the email she paid with.
        setPhase("needEmail");
        return;
      }
      setSentTo(data.email || "");
      setPhase("sent");
    } catch {
      setPhase("needEmail");
    }
  }, [sessionId]);

  useEffect(() => {
    if (!ready) return;
    if (member) {
      setPhase("loggedIn");
      return;
    }
    if (sessionId) {
      activateBySession();
    } else {
      setPhase("needEmail");
    }
  }, [ready, member, sessionId, activateBySession]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data.error === "no_purchase_found"
            ? "We couldn't find a purchase for that email. Use the exact email you paid with on Stripe."
            : "Something went wrong sending your link. Try again in a moment."
        );
        setSubmitting(false);
        return;
      }
      setSentTo(data.email || email);
      setPhase("sent");
    } catch {
      setErrorMsg("Something went wrong sending your link. Try again in a moment.");
    }
    setSubmitting(false);
  };

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
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>
              This only takes a second.
            </p>
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

        {phase === "sent" && (
          <>
            <div className="tag mb-3">check your inbox</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 16 }}>
              payment received.<br />
              <span className="pk">now activate your account.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 12 }}>
              We&apos;ve sent an activation link to{" "}
              <strong>{sentTo || "your email"}</strong>. Click it to set up your account and start your onboarding.
            </p>
            <p style={{ fontSize: 11, color: "var(--grey-light)", lineHeight: 1.6 }}>
              Nothing after a minute or two? Check spam, or{" "}
              <button
                onClick={() => setPhase("needEmail")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--pink)", fontWeight: 700, cursor: "pointer" }}
              >
                use a different email
              </button>
              .
            </p>
          </>
        )}

        {phase === "needEmail" && (
          <>
            <div className="tag mb-3">one last step</div>
            <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 12 }}>
              payment received.<br />
              <span className="pk">let&apos;s activate your account.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
              Enter the email you paid with and we&apos;ll send your activation link.
            </p>
            <form onSubmit={handleEmailSubmit} className="text-left">
              <label
                htmlFor="activate-email"
                style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 8 }}
              >
                email address
              </label>
              <input
                id="activate-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="the email you paid with"
                className="w-full mb-4"
                style={{ border: "var(--border)", padding: "13px 16px", fontSize: 14, outline: "none" }}
              />
              {errorMsg && <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>{errorMsg}</p>}
              <button type="submit" disabled={submitting} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                {submitting ? "sending..." : "send my activation link"}
              </button>
            </form>
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
