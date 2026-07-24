"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { captureReferralCodeFromUrl } from "@/lib/referral";
import { validatePassword, PASSWORD_HINT } from "@/lib/password";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--grey-light)",
  marginBottom: 8,
};
const inputStyle: React.CSSProperties = {
  border: "var(--border)",
  padding: "13px 16px",
  fontSize: 14,
  outline: "none",
};

type Phase = "verifying" | "form" | "recover" | "recoverySent" | "exists" | "notReady" | "error";

// The webhook normally parks the membership within a second or two of payment, but the browser
// can beat it there. Rather than show a paying customer an error and make her click, poll quietly
// behind a loading state and continue the instant it lands. Only after this window do we surface a
// manual retry, because by then something has genuinely gone wrong rather than just being slow.
const RETRY_INTERVAL_MS = 1500;
const AUTO_RETRY_WINDOW_MS = 18_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Post-payment account setup. Security lives on the server: this page never calls supabase.auth
// signUp. With a Stripe session_id it exchanges the verified session for a single-use claim token
// (/api/account/begin-claim) and then creates the account through /api/account/create, which is
// the only thing that can mint a user. Without a session it offers recovery, which merely triggers
// a one-time email; nothing here reveals whether a membership exists or lets an email set a
// password on its own.
function CreateAccountContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [phase, setPhase] = useState<Phase>(sessionId ? "verifying" : "recover");
  const [email, setEmail] = useState("");
  const [claimToken, setClaimToken] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    captureReferralCodeFromUrl();
  }, []);

  // Set when the component unmounts, so an in-flight polling loop stops instead of calling
  // setState on a page that's gone.
  const cancelledRef = useRef(false);
  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  // Polls begin-claim until the webhook's pending row shows up, staying in the "verifying"
  // loading state the whole time. Continues automatically the moment it lands; only falls back to
  // a manual retry once the auto window is exhausted. Each server call itself waits up to ~5s, so
  // this window covers several full server-side checks.
  const beginClaim = useCallback(async () => {
    if (!sessionId) return;
    setPhase("verifying");
    const deadline = Date.now() + AUTO_RETRY_WINDOW_MS;

    for (;;) {
      if (cancelledRef.current) return;
      try {
        const res = await fetch("/api/account/begin-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json();
        if (cancelledRef.current) return;

        if (res.status === 202 || data.error === "membership_not_ready") {
          if (Date.now() >= deadline) {
            setPhase("notReady");
            return;
          }
          await sleep(RETRY_INTERVAL_MS);
          continue;
        }
        if (data.already_exists) {
          setEmail(data.email || "");
          setPhase("exists");
          return;
        }
        if (!res.ok || !data.claim_token || !data.email) {
          setPhase("error");
          return;
        }
        setEmail(data.email);
        setClaimToken(data.claim_token);
        setPhase("form");
        return;
      } catch {
        // A dropped request mid-poll is usually a blip, keep trying inside the window rather than
        // dumping someone who has just paid onto an error screen.
        if (cancelledRef.current) return;
        if (Date.now() >= deadline) {
          setPhase("error");
          return;
        }
        await sleep(RETRY_INTERVAL_MS);
      }
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) beginClaim();
  }, [sessionId, beginClaim]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    if (!firstName.trim()) {
      setError("Add your first name so we can personalise everything for you.");
      return;
    }
    const check = validatePassword(password);
    if (!check.ok) {
      setError(check.message);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/account/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_token: claimToken, first_name: firstName.trim(), password }),
      });
      const data = await res.json();
      if (res.status === 409 || data.error === "already_exists") {
        setPhase("exists");
        return;
      }
      if (!res.ok || !data.destination) {
        setError(
          data.error === "invalid_or_expired_token"
            ? "This setup link has expired. Head back to your confirmation and try again."
            : "Something went wrong creating your account. Try again in a moment."
        );
        setSubmitting(false);
        return;
      }
      window.location.assign(data.destination);
    } catch {
      setError("Something went wrong creating your account. Try again in a moment.");
      setSubmitting(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await fetch("/api/account/recover-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
    } catch {
      // Neutral either way, we never surface whether anything was sent.
    }
    setSubmitting(false);
    setPhase("recoverySent");
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        {phase === "verifying" && (
          <>
            <div className="tag mb-3">payment received</div>
            <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 14 }}>
              setting up your<br />
              <span className="pk">personalised portal...</span>
            </h1>
            <div className="flex items-center gap-3">
              <div
                className="h-5 w-5 animate-spin rounded-full"
                style={{ border: "2.5px solid var(--pink)", borderTopColor: "transparent", flexShrink: 0 }}
              />
              <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>This usually takes a few seconds.</p>
            </div>
          </>
        )}

        {phase === "notReady" && (
          <>
            <div className="tag mb-3">almost there</div>
            <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 12 }}>
              just finalising<br />
              <span className="pk">your membership.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
              Your payment went through and your spot is safe. This is taking a little longer than usual to settle, give it another moment.
            </p>
            <button onClick={beginClaim} className="btn-pink w-full" style={{ cursor: "pointer" }}>keep checking</button>
          </>
        )}

        {phase === "form" && (
          <>
            <div className="tag mb-3">payment received</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              you&apos;re officially in <span aria-hidden="true">💖</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              Let&apos;s create your MY SZN account so we can personalise everything for you. Next stop, your birth chart.
            </p>
            <form onSubmit={handleCreate}>
              <label htmlFor="ca-first" style={labelStyle}>first name</label>
              <input
                id="ca-first"
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="your first name"
                className="w-full mb-5"
                style={inputStyle}
              />
              <label htmlFor="ca-email" style={labelStyle}>email address</label>
              <input
                id="ca-email"
                type="email"
                value={email}
                readOnly
                aria-readonly="true"
                className="w-full mb-1"
                style={{ ...inputStyle, background: "var(--lav-light)", color: "var(--grey)", cursor: "not-allowed" }}
              />
              <p style={{ fontSize: 11, color: "var(--grey-light)", marginBottom: 20 }}>
                This is the email you paid with. Your membership is tied to it.
              </p>
              <label htmlFor="ca-password" style={labelStyle}>password</label>
              <input
                id="ca-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="create a password"
                className="w-full mb-2"
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: "var(--grey-light)", marginBottom: 20 }}>{PASSWORD_HINT}</p>
              {error && <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>{error}</p>}
              <button type="submit" disabled={submitting} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                {submitting ? "setting up your portal..." : "continue →"}
              </button>
            </form>
          </>
        )}

        {phase === "recover" && (
          <>
            <div className="tag mb-3">finish setting up</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              already paid?<br />
              <span className="pk">let&apos;s get you in.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              Enter the email you paid with and we&apos;ll send you a secure link to finish setting up your account.
            </p>
            <form onSubmit={handleRecover}>
              <label htmlFor="ca-recovery-email" style={labelStyle}>email address</label>
              <input
                id="ca-recovery-email"
                type="email"
                required
                autoComplete="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="the email you paid with"
                className="w-full mb-5"
                style={inputStyle}
              />
              <button type="submit" disabled={submitting} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                {submitting ? "sending..." : "send my secure link"}
              </button>
            </form>
            <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 20 }}>
              Already set up your account?{" "}
              <Link href="/login" style={{ color: "var(--pink)", fontWeight: 700 }}>log in</Link>
            </p>
          </>
        )}

        {phase === "recoverySent" && (
          <>
            <div className="tag mb-3">check your inbox</div>
            <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 16 }}>
              secure link<br />
              <span className="pk">on its way.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 12 }}>
              If a membership is waiting for that email, we&apos;ve sent a secure link to finish setting up your account. Click it and you&apos;re in.
            </p>
            <p style={{ fontSize: 11, color: "var(--grey-light)", lineHeight: 1.6 }}>Nothing after a minute or two? Check spam.</p>
          </>
        )}

        {phase === "exists" && (
          <>
            <div className="tag mb-3">you already have an account</div>
            <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 12 }}>
              looks like you&apos;re<br />
              <span className="pk">already with us.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
              There&apos;s already an account for <strong>{email || "that email"}</strong>. Log in and your payment will be waiting on it.
            </p>
            <Link href="/login" className="btn-pink w-full" style={{ display: "block", textAlign: "center" }}>
              go to log in
            </Link>
            <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 16 }}>
              Forgot your password?{" "}
              <Link href="/forgot-password" style={{ color: "var(--pink)", fontWeight: 700 }}>reset it</Link>.
            </p>
          </>
        )}

        {phase === "error" && (
          <>
            <div className="tag mb-3">one last step</div>
            <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 12 }}>
              we couldn&apos;t confirm<br />
              <span className="pk">your payment here.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
              Enter the email you paid with and we&apos;ll send a secure link to finish setting up.
            </p>
            <button onClick={() => { setError(""); setPhase("recover"); }} className="btn-pink w-full" style={{ cursor: "pointer" }}>
              continue with my email
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={null}>
      <CreateAccountContent />
    </Suspense>
  );
}
