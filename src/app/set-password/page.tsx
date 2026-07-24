"use client";

import { Suspense, useEffect, useState } from "react";
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

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

// Optional password setup for legacy magic-link-only members. Reached from /auth/callback right
// after a magic-link login when the account has no password yet. She can add one (so she can log
// in with a password next time) or skip entirely, either way she continues to `next`. Requires an
// existing session; without one there's nothing to attach a password to, so bounce to login.
function SetPasswordContent() {
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.assign(`/login?redirect=${encodeURIComponent(next)}`);
        return;
      }
      setReady(true);
    });
  }, [next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    const check = validatePassword(password);
    if (!check.ok) {
      setError(check.message);
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setSubmitting(false);
      setError("Something went wrong saving your password. Try again in a moment.");
      return;
    }
    if (userData.user) {
      await supabase.from("profiles").update({ password_set: true }).eq("id", userData.user.id);
    }
    window.location.assign(next);
  };

  if (!ready) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
        <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
          <p style={{ fontSize: 14, color: "var(--grey)" }}>One moment...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        <div className="tag mb-3">optional</div>
        <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
          add a<br />
          <span className="pk">password.</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
          Set a password and you can log in with it next time, no waiting on an email link. You can always skip this.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="sp-password" style={labelStyle}>password</label>
          <input
            id="sp-password"
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
            {submitting ? "saving..." : "save password"}
          </button>
        </form>
        <button
          onClick={() => window.location.assign(next)}
          className="mt-4 w-full"
          style={{ background: "none", border: "var(--border)", padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
        >
          skip for now
        </button>
      </div>
    </section>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordContent />
    </Suspense>
  );
}
