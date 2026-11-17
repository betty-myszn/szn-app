"use client";

import { useState, type FormEvent, type CSSProperties } from "react";
import BirthDetailsFields, { type BirthDetails } from "@/components/BirthDetailsFields";

const pp = "var(--font-poppins), Poppins, sans-serif";

// Sits on the dark glitter band, styled like the offer pages' waitlist form.
const field: CSSProperties = { width: "100%", border: "var(--border)", borderRadius: 12, padding: "15px 16px", fontSize: 16, background: "#fff", color: "var(--dark)" };
const label: CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", display: "block", marginBottom: 6 };

// Booking happens in two steps: her details (and birth chart, for the report) are saved here first,
// then she pays on Stripe. Saving first means a slow webhook can never lose her birth details.
// mode "member" is the free seat for members whose membership includes the event: no Stripe, the
// server checks her membership and the confirmation shows here in place.
export default function EventBookingForm({
  slug, cta, collectsBirth, priceNote, birthNote, mode = "pay", notMemberHint,
}: {
  slug: string;
  cta: string;
  collectsBirth: boolean;
  priceNote: string;
  /** Why we ask for her chart. Defaults to the personalised report wording. */
  birthNote?: string;
  mode?: "pay" | "member";
  /** Shown under the error when the email has no qualifying membership. */
  notMemberHint?: React.ReactNode;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState<BirthDetails>({ dateOfBirth: "", birthTime: "", birthTimeApproximate: false, location: null });
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notMember, setNotMember] = useState(false);
  const [done, setDone] = useState(false);
  const id = (k: string) => `eb-${mode}-${k}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotMember(false);
    if (collectsBirth) {
      if (!birth.dateOfBirth) return setError("Pop in your birth date, babe");
      if (!timeUnknown && !birth.birthTime) return setError("Add your birth time, or tick the box if you don't know it");
      if (!birth.location) return setError("Pick your birth place from the list so we can find the exact spot");
    }
    setBusy(true);
    try {
      const res = await fetch(mode === "member" ? "/api/events/member-rsvp" : "/api/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, birth: collectsBirth ? { ...birth, birthTime: timeUnknown ? "" : birth.birthTime } : null, timeUnknown }),
      });
      const data = await res.json().catch(() => ({}));
      if (mode === "member") {
        if (!res.ok || !data.ok) {
          setNotMember(!!data.notMember);
          throw new Error(data.error || "Something glitched, try again in a sec");
        }
        setDone(true);
        return;
      }
      if (!res.ok || !data.url) throw new Error(data.error || "Something glitched, try again in a sec");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something glitched, try again in a sec");
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div role="status" style={{ border: "var(--border)", borderColor: "#fff", borderRadius: 20, background: "rgba(255,255,255,0.08)", padding: "28px 24px", color: "#fff", maxWidth: 520 }}>
        <div style={{ fontFamily: pp, fontSize: 26, fontWeight: 800, lineHeight: 1.15 }}>Your seat is saved 🌴</div>
        <p style={{ fontSize: 16, lineHeight: 1.7, margin: "12px 0 0" }}>Your confirmation is on its way to your inbox with the address and a calendar link. See you there, baddie.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" style={{ maxWidth: 520, color: "#fff" }}>
      <div>
        <label style={label} htmlFor={id("name")}>your name</label>
        <input id={id("name")} required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} style={field} />
      </div>
      <div>
        <label style={label} htmlFor={id("email")}>{mode === "member" ? "the email you joined with" : "email"}</label>
        <input id={id("email")} type="email" required autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} style={field} />
      </div>
      {collectsBirth && (
        <>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, fontWeight: 600, color: "#fff" }}>{birthNote ?? "Your report is written from YOUR chart, so I need your birth details. They stay private and are only used to create your report. 🔒"}</p>
          <BirthDetailsFields value={birth} onChange={(p) => setBirth((b) => ({ ...b, ...p }))} labelStyle={label} inputStyle={field} noteColor="#fff" />
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--pink)" }} />
            I don&apos;t know my birth time
          </label>
          {timeUnknown && <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#fff" }}>Totally fine. Your reading will lean on your planets and signs, which don&apos;t need a time, and skip the house-by-house detail.</p>}
        </>
      )}
      {error && <p role="alert" style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 14 }}>{error}</p>}
      {notMember && notMemberHint}
      <button type="submit" disabled={busy} style={{ background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 28px", border: "none", cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
        {busy ? (mode === "member" ? "checking your membership ✨" : "taking you to checkout ✨") : cta}
      </button>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fff" }}>{priceNote}</p>
    </form>
  );
}
