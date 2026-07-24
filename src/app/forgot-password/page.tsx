"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

// Standard password reset request. Sends a recovery link to the given email that lands on
// /reset-password, where a new password is set. Always shows the same "check your inbox" state
// whether or not the email exists, so this can't be used to probe who has an account.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (resetError) {
      setError("Something went wrong sending your reset link. Try again in a moment.");
      return;
    }
    setSent(true);
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        {sent ? (
          <>
            <div className="tag mb-3">check your inbox</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 12 }}>
              reset link<br />
              <span className="pk">on its way.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 12 }}>
              If there&apos;s an account for <strong>{email}</strong>, we&apos;ve sent it a link to set a new password.
            </p>
            <p style={{ fontSize: 11, color: "var(--grey-light)", lineHeight: 1.6 }}>Nothing after a minute or two? Check spam.</p>
            <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 20 }}>
              <Link href="/login" style={{ color: "var(--pink)", fontWeight: 700 }}>back to log in</Link>
            </p>
          </>
        ) : (
          <>
            <div className="tag mb-3">reset your password</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              forgot your<br />
              <span className="pk">password?</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              Enter your email and we&apos;ll send you a link to set a new one.
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="fp-email" style={labelStyle}>email address</label>
              <input
                id="fp-email"
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
                {submitting ? "sending..." : "send reset link"}
              </button>
            </form>
            <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 20 }}>
              Remembered it?{" "}
              <Link href="/login" style={{ color: "var(--pink)", fontWeight: 700 }}>back to log in</Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
