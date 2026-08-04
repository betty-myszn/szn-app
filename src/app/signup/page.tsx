"use client";

import { useState } from "react";
import Link from "next/link";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { PASSWORD_HINT, MIN_PASSWORD_LENGTH } from "@/lib/password";
import type { BirthLocation } from "@/types/chart";

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

// The free front-door signup. Step one creates a 'free' account (chat rooms only) with no payment,
// step two takes her birth details so the free birth chart and free human design chart are waiting
// for her the moment she verifies. The account isn't usable until she clicks the one-time link we
// email, so on success this switches to a "check your inbox" state rather than logging her in.
export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthTimeApproximate, setBirthTimeApproximate] = useState(false);
  const [location, setLocation] = useState<BirthLocation | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const goToBirthStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(PASSWORD_HINT);
      return;
    }
    setStep(2);
  };

  // Birth details are optional, so `skipBirth` submits the same payload without them.
  const createAccount = async (withBirth: boolean) => {
    if (submitting) return;
    setError("");

    const birthData =
      withBirth && dateOfBirth && birthTime && location
        ? {
            name: firstName,
            dateOfBirth,
            birthTime,
            birthTimeApproximate,
            location,
          }
        : null;

    if (withBirth && !birthData) {
      setError("Add your birth date, time and place, or skip this for now.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/account/create-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, email, password, birth_data: birthData }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSent(true);
        return;
      }
      if (res.status === 409 || data.error === "already_exists") {
        setError("You already have an account with that email. Log in instead.");
        setStep(1);
      } else if (data.error === "weak_password") {
        setError(PASSWORD_HINT);
        setStep(1);
      } else if (res.status === 429 || data.error === "rate_limited") {
        setError("Too many attempts just now. Give it a few minutes and try again.");
      } else if (data.error === "email_required") {
        setError("That email doesn't look right. Check it and try again.");
        setStep(1);
      } else {
        setError("Something went wrong creating your account. Try again in a moment.");
      }
    } catch {
      setError("Something went wrong creating your account. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5 py-16" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md bg-white p-8 md:p-12" style={{ border: "var(--border)" }}>
        {sent ? (
          <>
            <div className="tag mb-3">one more step</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              check your inbox,<br />
              <span className="pk">{firstName.toLowerCase() || "babe"}.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
              We sent a verification link to <strong style={{ color: "var(--dark)" }}>{email}</strong>. Click it once to confirm your email and you&apos;re in the rooms. After that you log in with the password you just chose.
            </p>
            <Link href="/login" className="btn-pink w-full" style={{ textAlign: "center", display: "block" }}>
              go to log in
            </Link>
          </>
        ) : step === 1 ? (
          <>
            <div className="tag mb-3">free chat rooms</div>
            <h1 style={{ fontFamily: poppins, fontSize: 32, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              join the astro group chat,<br />
              <span className="pk">come make new besties.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 16 }}>
              The rooms are where the girls actually hang out, talking through transits and placements and whatever is going on that week, and a free account gets you in without putting a card in. We&apos;ll also run your birth chart and your human design chart on the way through, both free, so you&apos;ve got something to talk about.
            </p>
            <p style={{ fontSize: 13, color: "var(--grey-light)", lineHeight: 1.7, marginBottom: 28 }}>
              When you want the rest of it, the paid tiers open up the book club, the new moon and full moon audios, live group astrology coaching every season, and the full personalised platform built around your own chart.
            </p>

            <form onSubmit={goToBirthStep}>
              <label htmlFor="signup-name" style={labelStyle}>first name</label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="what do we call you?"
                className="w-full mb-5"
                style={inputStyle}
              />
              <label htmlFor="signup-email" style={labelStyle}>email address</label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mb-5"
                style={inputStyle}
              />
              <label htmlFor="signup-password" style={labelStyle}>password</label>
              <input
                id="signup-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="pick a password"
                className="w-full mb-2"
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: "var(--grey-light)", marginBottom: 20 }}>{PASSWORD_HINT}</p>
              {error && <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>{error}</p>}
              <button type="submit" className="btn-pink w-full" style={{ cursor: "pointer" }}>
                next, your birth details
              </button>
            </form>

            <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 20, lineHeight: 1.6 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--pink)", fontWeight: 700 }}>
                log in
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="tag mb-3">step 2 of 2</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              now the good bit,<br />
              <span className="pk">your charts.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 28 }}>
              Tell us when and where you were born and we&apos;ll have your full birth chart and your human design chart ready for you, both free, the moment you verify your email.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createAccount(true);
              }}
            >
              <label htmlFor="signup-dob" style={labelStyle}>date of birth</label>
              <input
                id="signup-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full mb-5"
                style={inputStyle}
              />

              <label htmlFor="signup-time" style={labelStyle}>time of birth</label>
              <input
                id="signup-time"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full mb-2"
                style={inputStyle}
              />
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--grey)", marginBottom: 20, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={birthTimeApproximate}
                  onChange={(e) => setBirthTimeApproximate(e.target.checked)}
                />
                I&apos;m not certain of the exact time
              </label>

              <label htmlFor="signup-place" style={labelStyle}>place of birth</label>
              <div className="mb-2">
                <PlacesAutocomplete id="signup-place" onSelect={setLocation} value={location?.placeName} />
              </div>
              <p style={{ fontSize: 11, color: "var(--grey-light)", marginBottom: 20 }}>
                Your rising sign shifts every couple of hours, so the closer the time and place, the more accurate both charts are.
              </p>

              {error && <p style={{ fontSize: 12, color: "var(--pink)", marginBottom: 16 }}>{error}</p>}
              <button type="submit" disabled={submitting} className="btn-pink w-full" style={{ cursor: "pointer" }}>
                {submitting ? "creating your account..." : "get me in, free"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => createAccount(false)}
              disabled={submitting}
              style={{ background: "none", border: "none", padding: 0, marginTop: 16, fontSize: 12, color: "var(--grey-light)", textDecoration: "underline", cursor: "pointer" }}
            >
              skip for now, just take me to the rooms
            </button>
          </>
        )}
      </div>
    </section>
  );
}
