"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { captureReferralCodeFromUrl } from "@/lib/referral";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Only ever redirect back into our own app, an open redirect here would let a crafted
// /login?redirect=https://evil.example link send someone off-site right after they authenticate.
function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirect = safeRedirectPath(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    captureReferralCodeFromUrl();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || sending) return;
    setSending(true);
    setError("");
    const supabase = createClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", redirect);
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl.toString() },
    });
    setSending(false);
    if (sendError) {
      setError("Something went wrong sending your link. Try again in a moment.");
      return;
    }
    setSent(true);
  };

  return (
    <section
      className="min-h-[80vh] flex items-center justify-center px-5 py-16"
      style={{ background: "var(--dark)" }}
    >
      <div
        className="w-full max-w-md bg-white p-8 md:p-12"
        style={{ border: "var(--border)" }}
      >
        {!sent ? (
          <>
            <div className="tag mb-3">members only</div>
            <h1
              style={{
                fontFamily: poppins,
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              welcome back,<br />
              <span className="pk">it&apos;s your szn.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              Enter your email and we&apos;ll send you a magic link. No passwords, your portal is one click away.
            </p>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--grey-light)",
                  marginBottom: 8,
                }}
              >
                email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mb-5"
                style={{
                  border: "var(--border)",
                  padding: "13px 16px",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              {error && (
                <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>{error}</p>
              )}
              <button type="submit" disabled={sending} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                {sending ? "sending..." : "send my magic link"}
              </button>
            </form>
            <div className="mt-6 p-4" style={{ background: "var(--lav-light)", border: "var(--border)" }}>
              <div className="tag mb-1">how sign-up works</div>
              <p style={{ fontSize: 12, color: "var(--dark)", lineHeight: 1.6 }}>
                You sign up with your <strong>birth date, time and place</strong>. That builds your natal chart, and your whole portal, your readings, season guide, style codes and prompts, gets personalised to it.
              </p>
            </div>
            <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 20, lineHeight: 1.6 }}>
              Not a member yet?{" "}
              <Link href="/events" style={{ color: "var(--pink)", fontWeight: 700 }}>
                see what&apos;s waiting for you
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="tag mb-3">check your inbox</div>
            <h1
              style={{
                fontFamily: poppins,
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.15,
                marginBottom: 12,
              }}
            >
              your magic link is<br />
              <span className="pk">on its way.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              We&apos;ve sent a link to <strong>{email}</strong>. Click it and you&apos;re in.
            </p>
            <p style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 4 }}>
              Nothing in your inbox after a minute or two? Check spam, or head back and try again.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-5"
              style={{ background: "none", border: "var(--border)", padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
            >
              use a different email
            </button>
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
