"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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

// Where the reset-password email link lands. The link carries a recovery code that establishes a
// short-lived session; with that session the member sets a brand new password, then we mark her
// account as password-enabled and send her into the portal.
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const init = async () => {
      const code = searchParams.get("code");
      // The browser client may already have auto-exchanged the code on load; if so this throws and
      // we just fall through to reading the session it created.
      if (code) {
        await supabase.auth.exchangeCodeForSession(code).catch(() => {});
      }
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
      setReady(true);
    };
    init();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    const check = validatePassword(password);
    if (!check.ok) {
      setError(check.message);
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setSubmitting(false);
      setError("Something went wrong setting your password. Try again in a moment.");
      return;
    }
    if (userData.user) {
      // Non-sensitive UX flag (not in the membership REVOKE), so her own session may set it.
      await supabase.from("profiles").update({ password_set: true }).eq("id", userData.user.id);
    }
    window.location.assign("/dashboard");
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        {!ready ? (
          <p style={{ fontSize: 14, color: "var(--grey)" }}>One moment...</p>
        ) : !hasSession ? (
          <>
            <div className="tag mb-3">link expired</div>
            <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 12 }}>
              this reset link<br />
              <span className="pk">didn&apos;t work.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
              It may have expired or already been used. Request a fresh one and try again.
            </p>
            <Link href="/forgot-password" className="btn-pink w-full" style={{ display: "block", textAlign: "center" }}>
              send a new reset link
            </Link>
          </>
        ) : (
          <>
            <div className="tag mb-3">set a new password</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              choose a<br />
              <span className="pk">new password.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              Pick something you&apos;ll remember, you&apos;ll use it to log in from now on.
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="rp-password" style={labelStyle}>new password</label>
              <input
                id="rp-password"
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
              <label htmlFor="rp-confirm" style={labelStyle}>confirm password</label>
              <input
                id="rp-confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="type it again"
                className="w-full mb-5"
                style={inputStyle}
              />
              {error && <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>{error}</p>}
              <button type="submit" disabled={submitting} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                {submitting ? "saving..." : "save new password"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
