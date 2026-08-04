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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    captureReferralCodeFromUrl();
  }, []);

  // The only login path: email + password. On success, claim any membership parked against this
  // email (an emailed-link login would do this in /auth/callback, but a password login never passes
  // through that server callback) then land on the server-decided destination via a full
  // navigation, so proxy.ts re-evaluates gating with the fresh session cookies.
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

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        <>
          <div className="tag mb-3">members only</div>
            <h1 style={{ fontFamily: poppins, fontSize: 32, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              welcome back,<br />
              <span className="pk">it&apos;s your szn.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              Log in with your email and password to get back into your portal.
            </p>

            {linkError && !error && (
              <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>
                That link didn&apos;t work or expired. Log in below to continue.
              </p>
            )}

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

            <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 20, lineHeight: 1.6 }}>
              Not a member yet?{" "}
              <Link href="/signup" style={{ color: "var(--pink)", fontWeight: 700 }}>
                join the free chat rooms
              </Link>
              {" "}or{" "}
              <Link href="/membership" style={{ color: "var(--pink)", fontWeight: 700 }}>
                see membership
              </Link>
              .
            </p>
        </>
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
