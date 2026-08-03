"use client";

import { useState, type FormEvent } from "react";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import type { BirthLocation } from "@/types/chart";

const pp = "var(--font-poppins), Poppins, sans-serif";
const dm = "var(--font-dm-sans), 'DM Sans', sans-serif";

const PRICE = "$45";
const ORIGINAL_PRICE = "$150";

// Money Blueprint one-off Stripe Payment Link (8.8 Lion's Gate drop, $45).
const MONEY_BLUEPRINT_CHECKOUT_URL: string | undefined = "https://buy.stripe.com/fZu5kE1c36nJdyaflj7kc0k";

// Betty's own "inside your report" list, in her voice.
const INSIDE: string[] = [
  "Your biggest money-making gifts in your astrology chart.",
  "Which planets, houses and placements influence your income, career and business.",
  "Your Human Design type, profile, channels and gates that shape how you work, sell, receive and create opportunities.",
  "Your biggest money shadows and subconscious blocks.",
  "Where you are likely to undercharge, overgive or play small.",
  "Your visibility patterns and confidence lessons.",
  "Career and business themes that naturally align with your chart.",
  "Your highest financial timeline and what helps you move towards it.",
  "Personalised affirmations, journal prompts and practical actions built around your blueprint.",
];

function SignupForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthTimeApproximate, setBirthTimeApproximate] = useState(false);
  const [location, setLocation] = useState<BirthLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // The whole report hangs off house cusps, so an exact birth time genuinely matters here.
    if (!name || !email || !dateOfBirth || !birthTime || !location) {
      setError("Please fill in every field, including your exact birth time.");
      return;
    }

    setSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "money-blueprint",
          dateOfBirth,
          birthTime,
          birthTimeApproximate,
          placeOfBirth: location.placeName,
        }),
      }).catch(() => {});
    } finally {
      setSubmitting(false);
    }

    if (MONEY_BLUEPRINT_CHECKOUT_URL) {
      const url = new URL(MONEY_BLUEPRINT_CHECKOUT_URL);
      url.searchParams.set("prefilled_email", email);
      window.location.href = url.toString();
      return;
    }
    setSubmitted(true);
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--grey-light)",
    marginBottom: 8,
    display: "block",
  };
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "var(--border)",
    fontFamily: dm,
    fontSize: 14,
    color: "var(--dark)",
    background: "#fff",
    outline: "none",
  };

  if (submitted) {
    return (
      <div style={{ padding: "8px 0", textAlign: "center" }}>
        <div style={{ fontSize: 30, marginBottom: 12 }}>&#10024;</div>
        <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, marginBottom: 10 }}>
          Your details are saved, gorgeous.
        </div>
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
          We have your birth details, and your blueprint will be in your inbox at {email} within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div style={{ background: "var(--pink-light)", color: "#993556", padding: "12px 16px", fontSize: 13, border: "1.5px solid var(--pink)" }}>
          {error}
        </div>
      )}
      <div>
        <label htmlFor="mb-name" style={labelStyle}>your name</label>
        <input id="mb-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Enter your name" />
      </div>
      <div>
        <label htmlFor="mb-email" style={labelStyle}>email address</label>
        <input id="mb-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@email.com" />
        <p style={{ fontSize: 11, color: "var(--grey-light)", marginTop: 6 }}>Your blueprint is delivered here as a downloadable PDF.</p>
      </div>
      <div>
        <label htmlFor="mb-dob" style={labelStyle}>date of birth</label>
        <input id="mb-dob" type="date" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} style={inputStyle} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="mb-time" style={labelStyle}>exact time of birth</label>
          <input id="mb-time" type="time" required value={birthTime} onChange={(e) => setBirthTime(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="mb-place" style={labelStyle}>place of birth</label>
          <PlacesAutocomplete id="mb-place" onSelect={setLocation} value={location?.placeName} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input id="mb-approx" type="checkbox" checked={birthTimeApproximate} onChange={(e) => setBirthTimeApproximate(e.target.checked)} className="h-4 w-4" style={{ accentColor: "var(--pink)" }} />
        <label htmlFor="mb-approx" style={{ fontSize: 12, color: "var(--grey)" }}>My birth time is approximate</label>
      </div>
      {location && (
        <div style={{ fontSize: 11, color: "var(--grey-light)", padding: "4px 0" }}>
          📍 {location.placeName} · {location.timezone}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full cursor-pointer disabled:opacity-50"
        style={{ background: "var(--pink)", color: "var(--dark)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 32px", border: "none", marginTop: 4 }}
      >
        {submitting ? "one moment..." : `get my blueprint · ${PRICE}`}
      </button>
      <p style={{ fontSize: 11, color: "var(--grey-light)", textAlign: "center" }}>
        One-off payment. Delivered by email within 24 hours.
      </p>
    </form>
  );
}

export default function MoneyBlueprintPage() {
  const eyebrow = {
    fontFamily: pp, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em",
    textTransform: "uppercase" as const, color: "var(--pink)",
  };
  const h2 = {
    fontFamily: pp, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 0.95,
    textTransform: "lowercase" as const, margin: 0,
  };

  return (
    <main style={{ fontFamily: dm, color: "var(--dark)" }}>

      {/* 8.8 LION'S GATE ANNOUNCEMENT */}
      <div style={{ background: "var(--pink)", color: "var(--dark)", textAlign: "center", padding: "10px 16px", fontFamily: pp, fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        💸 The 8.8 Money Reports are back &middot; One week only &middot; {ORIGINAL_PRICE} {PRICE} ✨
      </div>

      {/* HERO */}
      <section style={{ background: "var(--dark)", color: "#fff", padding: "80px 24px 92px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <div style={eyebrow}>The 8.8 Money Blueprint</div>
          <h1 style={{ ...h2, fontSize: "clamp(40px, 8vw, 76px)", color: "#fff", margin: "20px 0 0" }}>
            your chart knows exactly how you&apos;re meant to <span style={{ color: "var(--pink)" }}>make money.</span>
          </h1>
          <p style={{ fontFamily: pp, fontWeight: 500, fontSize: "clamp(16px, 2.4vw, 20px)", lineHeight: 1.45, color: "rgba(255,255,255,0.82)", maxWidth: 640, margin: "24px auto 0" }}>
            A personalised Astrology and Human Design money report, created from your unique birth chart and Human Design, to show you exactly how you are designed to create, receive and grow your income. Basically, your personalised money manual.
          </p>

          {/* price flash */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "baseline", marginTop: 34 }}>
            <span style={{ fontFamily: pp, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,0.45)", textDecoration: "line-through" }}>{ORIGINAL_PRICE}</span>
            <span style={{ fontFamily: pp, fontWeight: 800, fontSize: 46, color: "var(--pink)" }}>{PRICE}</span>
            <span style={{ fontFamily: pp, fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>one week only</span>
          </div>

          <div style={{ marginTop: 28 }}>
            <a href="#get-yours" className="btn-pink" style={{ display: "inline-block", padding: "16px 44px", fontFamily: pp, fontWeight: 800, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Get your blueprint
            </a>
          </div>
        </div>
      </section>

      {/* LION'S GATE */}
      <section style={{ background: "var(--lav-light)", padding: "76px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={eyebrow}>The 8.8 Lion&apos;s Gate Portal ✨</div>
          <h2 style={{ ...h2, fontSize: "clamp(28px, 4.6vw, 44px)", margin: "16px 0 0" }}>
            the most <span style={{ color: "var(--pink)" }}>abundant</span> gateway of the year.
          </h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.75, color: "var(--dark)", marginTop: 22 }}>
            Every year around 8.8 you will hear people talk about the Lion&apos;s Gate Portal.
            Astrologically it is associated with the Sun moving through Leo while Sirius rises in the
            sky, and spiritually it is seen as a powerful time to focus on confidence, abundance,
            purpose, and stepping into a bigger version of yourself.
          </p>
          <p style={{ fontFamily: pp, fontWeight: 700, fontSize: "clamp(18px, 3vw, 24px)", lineHeight: 1.35, color: "var(--dark)", marginTop: 28, borderTop: "var(--border)", borderBottom: "var(--border)", padding: "24px 0" }}>
            &ldquo;How can I create more money by working <span style={{ color: "var(--pink)" }}>with</span> my own blueprint instead of against it?&rdquo;
          </p>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section style={{ background: "var(--cream)", padding: "78px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={eyebrow}>Inside your report</div>
            <h2 style={{ ...h2, fontSize: "clamp(30px, 5vw, 48px)", margin: "16px 0 0" }}>what we&apos;ll <span style={{ color: "var(--pink)" }}>explore.</span></h2>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {INSIDE.map((s) => (
              <li key={s} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 0", borderBottom: "1.5px solid rgba(26,26,26,0.10)" }}>
                <span style={{ color: "var(--pink)", fontSize: 16, lineHeight: 1.5, flexShrink: 0 }}>✨</span>
                <span style={{ fontSize: 16, lineHeight: 1.55, color: "var(--dark)" }}>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* MODALITIES */}
      <section style={{ background: "var(--mint)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={eyebrow}>Built around all of you</div>
          <h2 style={{ ...h2, fontSize: "clamp(24px, 4vw, 38px)", margin: "14px 0 22px" }}>
            everything we teach, in one reading.
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {["Astrology", "Human Design", "Shadow Work", "Manifestation", "Your Highest Timeline"].map((p) => (
              <span key={p} style={{ fontFamily: pp, fontWeight: 700, fontSize: 13, padding: "8px 18px", border: "var(--border)", background: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "var(--pink-bg)", padding: "78px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 42 }}>
            <div style={eyebrow}>How it works</div>
            <h2 style={{ ...h2, fontSize: "clamp(28px, 4.5vw, 44px)", margin: "16px 0 0" }}>three steps.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { n: "1", t: "Enter your birth details", d: "Your date, exact time and place of birth. The whole reading hangs off your birth time, so it is required." },
              { n: "2", t: `Pay ${PRICE}, once`, d: `Normally ${ORIGINAL_PRICE}, just ${PRICE} for the 8.8 portal. One payment, no subscription.` },
              { n: "3", t: "In your inbox in 24 hours", d: "Your personal blueprint arrives as a downloadable PDF within 24 hours, ready to read and come back to for years." },
            ].map((s) => (
              <div key={s.n} style={{ background: "#fff", border: "var(--border)", padding: "28px 24px" }}>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 20, color: "#fff", background: "var(--pink)", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{s.t}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--grey)" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET YOURS / FORM */}
      <section id="get-yours" style={{ background: "var(--dark)", color: "#fff", padding: "84px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={eyebrow}>Claim yours ✨</div>
            <h2 style={{ ...h2, fontSize: "clamp(30px, 5vw, 46px)", color: "#fff", margin: "16px 0 14px" }}>
              your <span style={{ color: "var(--pink)" }}>money blueprint.</span>
            </h2>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "baseline" }}>
              <span style={{ fontFamily: pp, fontWeight: 700, fontSize: 18, color: "rgba(255,255,255,0.45)", textDecoration: "line-through" }}>{ORIGINAL_PRICE}</span>
              <span style={{ fontFamily: pp, fontWeight: 800, fontSize: 30, color: "var(--pink)" }}>{PRICE}</span>
              <span style={{ fontSize: 12, fontFamily: pp, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>one week only</span>
            </div>
          </div>
          <div style={{ background: "#fff", color: "var(--dark)", padding: "32px 28px", border: "1.5px solid var(--pink)" }}>
            <SignupForm />
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
            Your blueprint is generated from your exact chart after purchase. Because every report is
            made to order and personal to you, this purchase is non-refundable.
          </p>
        </div>
      </section>

    </main>
  );
}
