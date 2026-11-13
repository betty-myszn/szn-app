"use client";

import { Suspense, useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import BirthDetailsFields, { type BirthDetails } from "@/components/BirthDetailsFields";
import { britishDate } from "@/lib/format-date";

const pp = "var(--font-poppins), Poppins, sans-serif";

// Where Stripe sends her the second she has paid for a report or a Baddie Session, and where the
// link in her confirmation email (and the reminders) points. Payment is already done; this collects
// the birth details the order is built from. Data: /api/order-details.

const field: CSSProperties = { width: "100%", border: "var(--border)", borderRadius: 12, padding: "15px 16px", fontSize: 16, background: "#fff", color: "var(--dark)" };
const label: CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--dark)", display: "block", marginBottom: 6 };

interface Order { offer: string; firstName: string; promises48h: boolean; submitted: boolean; birth: { date: string | null; time: string | null; place: string | null } | null }

function OrderDetailsContent() {
  const sessionId = useSearchParams().get("session_id") ?? "";
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);
  const [birth, setBirth] = useState<BirthDetails>({ dateOfBirth: "", birthTime: "", birthTimeApproximate: false, location: null });
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`/api/order-details?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (r) => { if (!live) return; if (r.ok) setOrder(await r.json()); else setMissing(true); })
      .catch(() => { if (live) setMissing(true); });
    return () => { live = false; };
  }, [sessionId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!birth.dateOfBirth) return setError("Pop in your birth date, babe");
    if (!timeUnknown && !birth.birthTime) return setError("Add your birth time, or tick the box if you don't know it");
    if (!birth.location) return setError("Pick your birth place from the list so we can find the exact spot");
    setBusy(true);
    try {
      const res = await fetch("/api/order-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, birth: { ...birth, birthTime: timeUnknown ? "" : birth.birthTime }, timeUnknown }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something glitched, try again in a sec");
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something glitched, try again in a sec");
    } finally {
      setBusy(false);
    }
  };

  const card = (children: React.ReactNode) => (
    <section className="px-5 py-12 md:py-20" style={{ background: "var(--lav-light)", minHeight: "80vh", color: "var(--dark)" }}>
      <div className="mx-auto bg-white" style={{ maxWidth: 560, border: "var(--border)", borderRadius: 18, padding: "32px 24px" }}>{children}</div>
    </section>
  );
  const eyebrow = (text: string) => <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>{text}</div>;
  const h1 = (text: string) => <h1 style={{ fontFamily: pp, fontSize: 34, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", margin: "12px 0 0" }}>{text}</h1>;
  const p = (children: React.ReactNode) => <p style={{ fontSize: 16, lineHeight: 1.6, margin: "14px 0 0" }}>{children}</p>;

  if (missing) {
    return card(<>
      {eyebrow("hmm")}
      {h1("I can't find that order.")}
      {p(<>Open the link in your confirmation email, or email <a href="mailto:hello@thecosmicco.com" style={{ color: "var(--dark)", fontWeight: 700 }}>hello@thecosmicco.com</a> with your birth details and I&apos;ll pop them in for you.</>)}
    </>);
  }
  if (!order) return card(<>{eyebrow("one sec")}{h1("Finding your order")}</>);

  if (order.submitted) {
    return card(<>
      {eyebrow(`${order.offer} 💜`)}
      {h1(`Got them${order.firstName ? `, ${order.firstName}` : ""}. You're all set.`)}
      {p(order.promises48h
        ? <>Your report lands in your inbox <strong>within 48 hours</strong>, starting from right now.</>
        : <>Everything else I need from you is in your confirmation email, so hit reply on that one and we&apos;re away.</>)}
      {order.birth && (
        <div style={{ marginTop: 20, border: "var(--border)", borderRadius: 12, padding: "16px 18px", background: "var(--pink-light)", fontSize: 15, lineHeight: 1.8 }}>
          <strong>Born:</strong> {britishDate(order.birth.date)}<br />
          <strong>Time:</strong> {order.birth.time ?? "not known"}<br />
          <strong>Place:</strong> {order.birth.place}
        </div>
      )}
      {p(<>Spotted a mistake? Reply to your confirmation email and tell me, because one wrong minute can move a whole house.</>)}
    </>);
  }

  return card(<>
    {eyebrow(`payment's through 💸 ${order.offer}`)}
    {h1(`Now tell me when you were born${order.firstName ? `, ${order.firstName}` : ""}.`)}
    {p(<>Your {order.offer} is built from YOUR chart, so this is the one thing I need before I can start.{order.promises48h ? <> Your <strong>48 hours</strong> begin the moment these land.</> : null} They stay private and are only used for your order. 🔒</>)}
    <form onSubmit={submit} className="flex flex-col gap-4" style={{ marginTop: 22 }}>
      <BirthDetailsFields value={birth} onChange={(patch) => setBirth((b) => ({ ...b, ...patch }))} labelStyle={label} inputStyle={field} noteColor="var(--dark)" />
      <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
        <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--pink)" }} />
        I don&apos;t know my birth time
      </label>
      {timeUnknown && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>Totally fine. I&apos;ll work from your planets and signs, which don&apos;t need a time.</p>}
      {error && <p role="alert" style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{error}</p>}
      <button type="submit" disabled={busy} style={{ background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "19px 28px", border: "none", cursor: busy ? "wait" : "pointer" }}>
        {busy ? "sending ✨" : "send my birth details"}
      </button>
    </form>
  </>);
}

export default function OrderDetailsPage() {
  return <Suspense fallback={null}><OrderDetailsContent /></Suspense>;
}
