"use client";

import { useState } from "react";
import CheckoutButton from "@/components/CheckoutButton";
import { PLAN_CHECKOUT_URL } from "@/lib/checkout";
import { useDoors } from "@/lib/enrolment";
import { doorDay, doorDays, doorTime, sznList, type Door } from "@/lib/doors";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The join for a chapter: $250 once for 3 months, or (once the plan exists in Stripe) 3 monthly
// payments of $88. Only while a door is open. With the doors shut it becomes the door alert, which
// files her on the MY SZN waitlist list in Brevo so she hears the moment the next door opens.


const PLAN_TERMS = (
  <>
    {"I'm locking in for the three-month cohort: "}
    <strong>3 monthly payments of $555</strong>
    {", non-refundable, and I can't cancel during those 3 months. Nothing is charged after the third."}
  </>
);

export default function ChapterJoin({ dark = false }: { dark?: boolean }) {
  const { ready, open, next } = useDoors();
  if (!ready) return <div style={{ minHeight: 220 }} aria-hidden />;
  if (!open || !PLAN_CHECKOUT_URL) return <DoorAlert next={next} dark={dark} />;
  const textColor = dark ? "#fff" : "var(--dark)";
  return (
    <div>
      <p style={{ fontSize: 12.5, color: textColor, lineHeight: 1.6, marginBottom: 14 }}>
        <strong>Doors close at {open.closesAtMoment}</strong>, {doorDay(open.closesAt)} at {doorTime(open.closesAt)}.
        You&apos;re joining {open.name}, locking in for {sznList(open)}.
      </p>
      <CheckoutButton
        checkoutUrl={PLAN_CHECKOUT_URL}
        label="lock me in · $555 a month × 3"
        plan="cohort_555x3"
        value={555}
        terms={PLAN_TERMS}
        dark={dark}
      />
    </div>
  );
}

export function DoorAlert({ next, dark = false }: { next: Door | null; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [goal, setGoal] = useState("");
  const [block, setBlock] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const textColor = dark ? "#fff" : "var(--dark)";
  const field = { width: "100%", padding: "12px 14px", border: "var(--border)", marginBottom: 8, fontSize: 14, background: "#fff", color: "var(--dark)", fontFamily: "inherit" } as const;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          instagram: instagram.trim() || undefined,
          why: goal.trim() || undefined,
          block: block.trim() || undefined,
          source: "membership-waitlist",
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  const when = next ? (
    <>
      {"Applications are open for "}
      <strong>{next.name}</strong>
      {`, and the doors open ${doorDay(next.opensAt)} at ${doorTime(next.opensAt)} for ${doorDays(next)} days only.`}
    </>
  ) : (
    <>Applications are open for the founding cohort. Tell me a little about you and we&apos;ll be in touch before the doors open.</>
  );

  if (state === "done") {
    return (
      <div style={{ color: textColor }}>
        <p style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Your application is in, babe 💗</p>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}>We&apos;ll be in touch before the founding cohort opens.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ color: textColor }}>
      <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{when}</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="first name" autoComplete="given-name" aria-label="First name" style={field} />
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" autoComplete="email" aria-label="Email" style={field} />
      <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="instagram (optional)" aria-label="Instagram handle" style={field} />
      <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={2} placeholder="What do you want to create in the next 90 days?" aria-label="What do you want to create in the next 90 days?" style={field} />
      <textarea value={block} onChange={(e) => setBlock(e.target.value)} rows={2} placeholder="What's been getting in the way?" aria-label="What's been getting in the way?" style={{ ...field, marginBottom: 12 }} />
      <button type="submit" disabled={state === "sending"} className="btn-pink w-full" style={{ cursor: state === "sending" ? "wait" : "pointer", opacity: state === "sending" ? 0.6 : 1 }}>
        {state === "sending" ? "sending your application…" : "apply for the founding cohort"}
      </button>
      {state === "error" && (
        <p style={{ fontSize: 12, color: "var(--pink)", marginTop: 10 }}>
          That didn&apos;t go through. Try again, or email hello@thecosmicco.com and we&apos;ll add you.
        </p>
      )}
    </form>
  );
}
