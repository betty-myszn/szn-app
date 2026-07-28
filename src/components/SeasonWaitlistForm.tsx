"use client";

import { useState } from "react";

// Split out of the season page so that page can render on the server. This is the only part of a
// season page that needs state, so it is the only part that ships as client JavaScript.

const pp = "var(--font-poppins), Poppins, sans-serif";
const dm = "var(--font-dm-sans), 'DM Sans', sans-serif";

export default function SeasonWaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "waitlist" }),
      });
    } catch {}
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>&#10024;</div>
        <div style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
          You&apos;re on the list.
        </div>
        <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.6 }}>
          We&apos;ll be in touch soon with early access details. Your season is coming.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <label htmlFor="season-waitlist-name" className="sr-only">
        Your name
      </label>
      <input
        id="season-waitlist-name"
        name="name"
        type="text"
        autoComplete="given-name"
        placeholder="your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          flex: 0.7, padding: "16px 20px", fontSize: 14, fontFamily: dm,
          border: "var(--border)", background: "#fff",
          color: "var(--dark)", outline: "none",
        }}
      />
      <label htmlFor="season-waitlist-email" className="sr-only">
        Your email address
      </label>
      <input
        id="season-waitlist-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: 1, padding: "16px 20px", fontSize: 14, fontFamily: dm,
          border: "var(--border)", background: "#fff",
          color: "var(--dark)", outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          background: "var(--pink)", color: "var(--dark)", fontFamily: dm,
          fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "16px 32px", border: "none",
          cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        {submitting ? "joining..." : "join the waitlist"}
      </button>
    </form>
  );
}
