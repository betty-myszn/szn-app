"use client";

import { useState } from "react";
import Link from "next/link";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import CheckoutButton from "@/components/CheckoutButton";
import { MONTHLY_CHECKOUT_URL, VIP_CHECKOUT_URL } from "@/lib/checkout";
import { useEnrolmentOpen } from "@/lib/enrolment";
import { PASSWORD_HINT, MIN_PASSWORD_LENGTH } from "@/lib/password";
import type { BirthLocation } from "@/types/chart";

const poppins = "var(--font-poppins), Poppins, sans-serif";

type PlanId = "free" | "monthly" | "vip";

// All three sign-ups, shown together so nobody has to leave the page to find the paid tiers. Free
// runs the two-step account flow on this page; the paid tiers hand off to Stripe checkout (the same
// links the membership page uses) and the webhook parks the membership by email, claimed when she
// sets her password afterwards.
const PLAN_OPTIONS: { id: PlanId; name: string; tagline: string; price: string }[] = [
  { id: "free", name: "Free", tagline: "the chat rooms, plus your birth and human design charts", price: "$0" },
  { id: "monthly", name: "MY SZN", tagline: "the full personalised platform, plus a live masterclass and astro tapping every month", price: "$88/mo" },
  { id: "vip", name: "MY SZN VIP", tagline: "everything in MY SZN, plus private 1:1 coaching with Betty", price: "$555/mo" },
];

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
  const [plan, setPlan] = useState<PlanId>("free");
  const enrolmentOpen = useEnrolmentOpen();
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Honeypot. Hidden from real users; only a bot that fills every field will set it, and the API
  // rejects any request where it's non-empty. No friction for humans, no captcha service needed.
  const [company, setCompany] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthTimeApproximate, setBirthTimeApproximate] = useState(false);
  const [location, setLocation] = useState<BirthLocation | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const goToBirthStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(PASSWORD_HINT);
      return;
    }
    setStep(2);
  };

  // Birth details are required: there's no skip, so every free account arrives with a chart. The
  // API still treats birth_data as optional (a bad row must never cost her the account), this is
  // just the front door insisting.
  const createAccount = async () => {
    if (submitting) return;
    setError("");

    if (!dateOfBirth || !birthTime || !location) {
      setError("Add your birth date, time and place so we can build your charts.");
      return;
    }

    const birthData = {
      name: firstName,
      dateOfBirth,
      birthTime,
      birthTimeApproximate,
      location,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/account/create-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, email, password, company, birth_data: birthData }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        // The route confirms the account and logs her in server-side, so on success we go straight
        // to her home. Full-page navigation (not router.push) so the fresh session cookies the
        // route set are picked up. If the auto sign-in didn't take, fall back to the login page.
        window.location.href = data.signedIn ? "/home" : "/login?new=1";
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
      } else if (data.error === "tier_write_failed") {
        // Almost always the 'free' migration not having run against the database yet. Say so
        // plainly rather than hiding a one-line schema fix behind "something went wrong".
        setError(
          `Your account couldn't be set to the free tier, so nothing was created and you can retry. ${data.detail ?? ""}`.trim()
        );
      } else {
        setError(
          `Something went wrong creating your account. Try again in a moment.${data.detail ? ` (${data.detail})` : ""}`
        );
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
        {step === 1 ? (
          <>
            <div className="tag mb-3">choose your szn</div>
            <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12 }}>
              join <span className="pk">MY SZN.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
              Start free in the rooms, or go all in on the full platform. Pick what fits you now, you can always upgrade later.
            </p>

            {/* All three sign-ups together, so nobody has to leave to find the paid tiers */}
            <div className="flex flex-col gap-2 mb-7">
              {PLAN_OPTIONS.map((opt) => {
                const selected = plan === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPlan(opt.id);
                      setError("");
                    }}
                    aria-pressed={selected}
                    className="w-full"
                    style={{
                      textAlign: "left",
                      padding: "14px 16px",
                      background: selected ? "var(--pink-light)" : "#fff",
                      border: selected ? "1.5px solid var(--pink)" : "var(--border)",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, letterSpacing: "-0.4px", color: "var(--dark)" }}>{opt.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--pink)" }}>{opt.price}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--grey)", lineHeight: 1.5, marginTop: 4 }}>{opt.tagline}</div>
                  </button>
                );
              })}
            </div>

            {plan === "free" ? (
              <>
                <p style={{ fontSize: 13, color: "var(--grey-light)", lineHeight: 1.7, marginBottom: 20 }}>
                  A free account gets you into the rooms with the girls, no card needed, and we&apos;ll run your birth chart and your human design chart on the way through so you&apos;ve got something to talk about.
                </p>

                <form onSubmit={goToBirthStep}>
                  {/* Honeypot: off-screen, not tabbable, hidden from assistive tech. Real users never
                      see or fill it; bots do, and the API rejects the request when it's set. */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  />
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
              </>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7, marginBottom: 16 }}>
                  {plan === "vip"
                    ? "VIP is the full platform plus private one to one astrology coaching with Betty, for when you want her working on your chart directly."
                    : "MY SZN is the full personalised platform built around your own chart, with a live masterclass and a live astro tapping with Betty every month."}
                </p>
                <CheckoutButton
                  checkoutUrl={enrolmentOpen ? (plan === "vip" ? VIP_CHECKOUT_URL : MONTHLY_CHECKOUT_URL) : undefined}
                  label={plan === "vip" ? "join vip · $555/mo" : "join my szn · $88/mo"}
                  waitlistHref="/membership#pricing"
                  plan={plan}
                  value={plan === "vip" ? 555 : 88}
                />
                <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 12, lineHeight: 1.6 }}>
                  You&apos;ll set your password and add your birth details right after checkout.
                </p>
              </div>
            )}

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
                createAccount();
              }}
            >
              <label htmlFor="signup-dob" style={labelStyle}>date of birth</label>
              <input
                id="signup-dob"
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full mb-5"
                style={inputStyle}
              />

              <label htmlFor="signup-time" style={labelStyle}>time of birth</label>
              <input
                id="signup-time"
                type="time"
                required
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
          </>
        )}
      </div>
    </section>
  );
}
