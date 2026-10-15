"use client";

import { useState } from "react";
import { OFFERS, type OfferSlug } from "@/lib/offers";
import { track, EVENTS } from "@/lib/analytics";
import BirthDetailsFields, { type BirthDetails } from "@/components/BirthDetailsFields";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The one waitlist form every offer page uses. Posts to /api/waitlist with the offer's slug, so the
// signup is saved in Supabase and tagged in Brevo for that offer only. The confirmation replaces the
// form in place; a repeat signup gets the same warm confirmation, never an error.

const CONFIRM: Record<OfferSlug, { title: string; body: string }> = {
  "rich-btch-rising": {
    title: "YESSSS, you're on the list 💸",
    body: "Your rich b*tch era has officially been put on notice. You'll be the first to know the second your money report opens, so keep an eye on your inbox (and your bank balance, obviously).",
  },
  "bad-btch-report": {
    title: "OMGGGG you're in 💜",
    body: "Consider this your first act of taking up MORE space. The moment The Bad B*tch Report opens, you'll hear it from us before anyone else does.",
  },
  "baddie-coven": {
    title: "Welcome to the coven, witch 🦄",
    body: "Your name is written in the book (glitter pen, obviously). We'll send the doors, the dates and the first spell straight to your inbox before anyone else hears a thing.",
  },
  mastermind: {
    title: "SHE'S ON THE LIST 🪐",
    body: "Future you just did a little happy dance. The next cohort's dates come to the waitlist first, so you'll have first pick of a seat before it goes anywhere else.",
  },
  retreat: {
    title: "YESSSS, see you in real life 🌴",
    body: "You're on the list for The Bad B*tch Retreat, which means the where, the when and every juicy detail lands in your inbox first, the second we can tell you.",
  },
  book: {
    title: "SOOOO happy you're here 📚",
    body: "You're on the list for the MY SZN book. We'll tell you the moment there's a cover to swoon over, a date to circle and a way to get your hands on it.",
  },
};

export default function WaitlistForm({
  offer,
  question,
  tone = "light",
}: {
  offer: OfferSlug;
  /** Optional extra question, saved alongside the signup. */
  question?: string;
  tone?: "light" | "dark";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [birth, setBirth] = useState<BirthDetails>({ dateOfBirth: "", birthTime: "", birthTimeApproximate: false, location: null });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const dark = tone === "dark";
  const ink = dark ? "#fff" : "var(--dark)";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Birth details are required on every waitlist (Betty, 13 Oct 2026).
    if (!birth.location) {
      setError("Pick your birth place from the list so we can find the exact spot, babe");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer, name, email, answer, birth }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something glitched, try again in a sec");
      track(EVENTS.LEAD, { source: `waitlist-${offer}`, offer });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something glitched, try again in a sec");
      setState("error");
    }
  }

  if (state === "done") {
    const c = CONFIRM[offer];
    return (
      <div role="status" style={{ border: "var(--border)", borderRadius: 20, background: dark ? "rgba(255,255,255,0.06)" : "#fff", padding: "28px 24px", color: ink }}>
        <div style={{ fontFamily: pp, fontSize: 26, fontWeight: 800, lineHeight: 1.15 }}>{c.title}</div>
        <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 12 }}>{c.body}</p>
      </div>
    );
  }

  const field: React.CSSProperties = {
    width: "100%",
    border: "var(--border)",
    borderRadius: 12,
    padding: "15px 16px",
    fontSize: 16, // 16px stops iOS zooming into the field
    background: "#fff",
    color: "var(--dark)",
  };
  const label: React.CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: ink, display: "block", marginBottom: 6 };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" style={{ maxWidth: 520 }}>
      <div>
        <label htmlFor={`wl-name-${offer}`} style={label}>first name</label>
        <input id={`wl-name-${offer}`} style={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
      </div>
      <div>
        <label htmlFor={`wl-email-${offer}`} style={label}>email</label>
        <input id={`wl-email-${offer}`} style={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" />
      </div>
      <BirthDetailsFields
        value={birth}
        onChange={(patch) => setBirth((b) => ({ ...b, ...patch }))}
        labelStyle={label}
        inputStyle={field}
        noteColor={dark ? "rgba(255,255,255,0.85)" : "var(--grey)"}
      />
      {question && (
        <div>
          <label htmlFor={`wl-q-${offer}`} style={label}>{question} (optional)</label>
          <textarea id={`wl-q-${offer}`} style={{ ...field, minHeight: 90, resize: "vertical" }} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </div>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        style={{ background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 28px", border: "none", cursor: "pointer", opacity: state === "sending" ? 0.7 : 1 }}
      >
        {state === "sending" ? "adding you..." : OFFERS[offer].cta}
      </button>
      {state === "error" && <p role="alert" style={{ fontSize: 14, fontWeight: 700, color: dark ? "#fff" : "var(--pink)" }}>{error}</p>}
    </form>
  );
}
