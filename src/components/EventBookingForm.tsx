"use client";

import { useState, type FormEvent } from "react";
import BirthDetailsFields, { type BirthDetails } from "@/components/BirthDetailsFields";

const pp = "var(--font-poppins), Poppins, sans-serif";

const label = { fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--dark)", marginBottom: 8, display: "block" };
const input = { width: "100%", padding: "14px 14px", border: "var(--border)", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "var(--dark)", background: "#fff", outline: "none" };

// Booking happens in two steps: her details (and birth chart, for the report) are saved here first,
// then she pays on Stripe. Saving first means a slow webhook can never lose her birth details.
export default function EventBookingForm({ slug, cta, collectsBirth }: { slug: string; cta: string; collectsBirth: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState<BirthDetails>({ dateOfBirth: "", birthTime: "", birthTimeApproximate: false, location: null });
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (collectsBirth) {
      if (!birth.dateOfBirth) return setError("Pop in your birth date, babe");
      if (!timeUnknown && !birth.birthTime) return setError("Add your birth time, or tick the box if you don't know it");
      if (!birth.location) return setError("Pick your birth place from the list so we can find the exact spot");
    }
    setBusy(true);
    try {
      const res = await fetch("/api/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, birth: collectsBirth ? { ...birth, birthTime: timeUnknown ? "" : birth.birthTime } : null, timeUnknown }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Something glitched, try again in a sec");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something glitched, try again in a sec");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ background: "#fff", border: "var(--border)", borderRadius: 24, padding: "clamp(20px, 4vw, 32px)", display: "grid", gap: 18, color: "var(--dark)" }}>
      <div>
        <label style={label} htmlFor="eb-name">Your name</label>
        <input id="eb-name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} style={input} />
      </div>
      <div>
        <label style={label} htmlFor="eb-email">Your email</label>
        <input id="eb-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
      </div>
      {collectsBirth && (
        <>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, fontWeight: 600 }}>Your report is written from YOUR chart, so I need your birth details. They stay private and are only used to create your report. 🔒</p>
          <BirthDetailsFields value={birth} onChange={(p) => setBirth((b) => ({ ...b, ...p }))} labelStyle={label} inputStyle={input} />
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--pink)" }} />
            I don&apos;t know my birth time
          </label>
          {timeUnknown && <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>Totally fine. Your report will lean on the planets and signs, which don&apos;t need a time, and skip the house-by-house detail.</p>}
        </>
      )}
      {error && <p role="alert" style={{ margin: 0, color: "var(--pink)", fontWeight: 700, fontSize: 14 }}>{error}</p>}
      <button type="submit" disabled={busy} className="event-cta" style={{ background: "var(--pink)", color: "#fff", border: "var(--border)", borderRadius: 999, fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "18px 24px", cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
        {busy ? "taking you to checkout ✨" : cta}
      </button>
      <p style={{ margin: 0, fontSize: 12, textAlign: "center", fontWeight: 600 }}>Secure checkout with Stripe · $44 USD one-time payment</p>
    </form>
  );
}
