"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { captureReferralCodeFromUrl } from "@/lib/referral";

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

// Only ever redirect back into our own app, an open redirect here would let a crafted
// /login?redirect=https://evil.example link send someone off-site right after they authenticate.
function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirect = safeRedirectPath(searchParams.get("redirect"));
  const linkError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicMode, setMagicMode] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    captureReferralCodeFromUrl();
  }, []);

  // Primary path: email + password. On success, claim any membership parked against this email
  // (a magic-link login would do this in /auth/callback, but a password login never passes through
  // that server callback) then land on the server-decided destination via a full navigation, so
  // proxy.ts re-evaluates gating with the fresh session cookies.
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setSubmitting(false);
      setError("That email and password don't match. Try again, or reset your password below.");
      return;
    }
    let dest = redirect;
    try {
      const res = await fetch("/api/auth/claim-pending", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.destination) {
        // A full member (destination /dashboard) keeps any specific place she was heading to;
        // otherwise the membership/onboarding gate decides where she must go first.
        dest = data.destination === "/dashboard" ? redirect : data.destination;
      }
    } catch {
      // Fall back to the requested redirect, proxy.ts still enforces access on arrival.
    }
    window.location.assign(dest);
  };

  // Secondary path, kept for people who'd rather not use a password (and for legacy accounts).
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", redirect);
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      // Never mint an account from a login attempt: public sign-up is disabled, and accounts are
      // only ever created through the protected post-payment flow.
      options: { emailRedirectTo: callbackUrl.toString(), shouldCreateUser: false },
    });
    setSubmitting(false);
    if (sendError) {
      setError("Something went wrong sending your link. Try again in a moment.");
      return;
    }
    setMagicSent(true);
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        {magicSent ? (
          <>
            <div className="tag mb-3">check your inbox</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 12 }}>
              your magic link is<br />
              <span className="pk">on its way.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              We&apos;ve sent a link to <strong>{email}</strong>. Click it and you&apos;re in.
            </p>
            <button
              onClick={() => { setMagicSent(false); setMagicMode(false); }}
              style={{ background: "none", border: "var(--border)", padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
            >
              back to log in
            </button>
          </>
        ) : (
          <>
            <div className="tag mb-3">members only</div>
            <h1 style={{ fontFamily: poppins, fontSize: 32, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              welcome back,<br />
              <span className="pk">it&apos;s your szn.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              {magicMode
                ? "Enter your email and we'll send you a one-time sign-in link."
                : "Log in with your email and password to get back into your portal."}
            </p>

            {linkError && !error && (
              <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>
                That link didn&apos;t work or expired. Log in below to continue.
              </p>
            )}

            {!magicMode ? (
              <form onSubmit={handlePasswordLogin}>
                <label htmlFor="login-email" style={labelStyle}>email address</label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full mb-5"
                  style={inputStyle}
                />
                <label htmlFor="login-password" style={labelStyle}>password</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="your password"
                  className="w-full mb-2"
                  style={inputStyle}
                />
                <div className="mb-5">
                  <Link href="/forgot-password" style={{ fontSize: 12, color: "var(--pink)", fontWeight: 700 }}>
                    forgot your password?
                  </Link>
                </div>
                {error && <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>{error}</p>}
                <button type="submit" disabled={submitting} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                  {submitting ? "logging in..." : "log in"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMagicLink}>
                <label htmlFor="login-email-magic" style={labelStyle}>email address</label>
                <input
                  id="login-email-magic"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full mb-5"
                  style={inputStyle}
                />
                {error && <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>{error}</p>}
                <button type="submit" disabled={submitting} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                  {submitting ? "sending..." : "send my magic link"}
                </button>
              </form>
            )}

            <div className="mt-6 pt-5" style={{ borderTop: "var(--border)" }}>
              <button
                onClick={() => { setMagicMode(!magicMode); setError(""); }}
                style={{ background: "none", border: "none", padding: 0, fontSize: 12, color: "var(--grey)", cursor: "pointer", lineHeight: 1.6 }}
              >
                {magicMode ? (
                  <>Rather use your password? <span style={{ color: "var(--pink)", fontWeight: 700 }}>Log in with a password</span></>
                ) : (
                  <>Prefer not to use your password? <span style={{ color: "var(--pink)", fontWeight: 700 }}>Sign in with a magic link</span></>
                )}
              </button>
            </div>

            <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 20, lineHeight: 1.6 }}>
              Not a member yet?{" "}
              <Link href="/events" style={{ color: "var(--pink)", fontWeight: 700 }}>
                see what&apos;s waiting for you
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
