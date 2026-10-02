"use client";

import { useState } from "react";
import CheckoutButton from "@/components/CheckoutButton";
import { PLAN_CHECKOUT_URL, UPFRONT_CHECKOUT_URL } from "@/lib/checkout";
import { useDoors } from "@/lib/enrolment";
import { doorDay, doorTime, sznList, type Door } from "@/lib/doors";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The join for a chapter: $250 once for 3 months, or (once the plan exists in Stripe) 3 monthly
// payments of $88. Only while a door is open. With the doors shut it becomes the door alert, which
// files her on the MY SZN waitlist list in Brevo so she hears the moment the next door opens.

type Option = "upfront" | "plan";

const UPFRONT_TERMS = (
  // Strings, not loose JSX text: this Next build drops the space after a closing tag here.
  <>
    {"I understand this is "}
    <strong>one payment of $250</strong>
    {" for 3 months of MY SZN. It's non-refundable and it doesn't renew."}
  </>
);

const PLAN_TERMS = (
  <>
    {"I'm locking in for 3 months: "}
    <strong>3 monthly payments of $88</strong>
    {", non-refundable, and I can't cancel during those 3 months. After my third payment it carries on monthly until I switch it off in my settings."}
  </>
);

export default function ChapterJoin({ dark = false }: { dark?: boolean }) {
  const { ready, open, next } = useDoors();
  const [option, setOption] = useState<Option>("upfront");

  if (!ready) return <div style={{ minHeight: 220 }} aria-hidden />;
  if (!open) return <DoorAlert next={next} dark={dark} />;

  const hasPlan = !!PLAN_CHECKOUT_URL;
  const chosen: Option = hasPlan ? option : "upfront";
  const textColor = dark ? "#fff" : "var(--dark)";

  return (
    <div>
      <p style={{ fontSize: 12.5, color: textColor, lineHeight: 1.6, marginBottom: 14 }}>
        <strong>Doors close at {open.closesAtMoment}</strong>, {doorDay(open.closesAt)} at {doorTime(open.closesAt)}.
        You&apos;re joining {open.name}, locking in for {sznList(open)}.
      </p>

      {hasPlan && (
        <div className="grid grid-cols-2 gap-2 mb-4" role="radiogroup" aria-label="how you'd like to pay">
          {(
            [
              { id: "upfront", top: "$250", sub: "once, for 3 months" },
              { id: "plan", top: "3 × $88", sub: "monthly payments" },
            ] as const
          ).map((o) => {
            const on = chosen === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setOption(o.id)}
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "12px 14px",
                  border: on ? "2px solid var(--pink)" : "var(--border)",
                  background: on ? "#fff" : "transparent",
                  color: textColor,
                }}
              >
                <div style={{ fontFamily: pp, fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1 }}>{o.top}</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>{o.sub}</div>
              </button>
            );
          })}
        </div>
      )}

      {chosen === "plan" && PLAN_CHECKOUT_URL ? (
        <CheckoutButton
          key="plan"
          checkoutUrl={PLAN_CHECKOUT_URL}
          label="lock in · 3 × $88"
          plan="chapter_plan_3x88"
          value={88}
          terms={PLAN_TERMS}
          dark={dark}
        />
      ) : (
        <CheckoutButton
          key="upfront"
          checkoutUrl={UPFRONT_CHECKOUT_URL}
          label="lock in · $250"
          plan="chapter_upfront_250"
          value={250}
          terms={UPFRONT_TERMS}
          dark={dark}
        />
      )}
    </div>
  );
}

export function DoorAlert({ next, dark = false }: { next: Door | null; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const textColor = dark ? "#fff" : "var(--dark)";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined, source: "membership-waitlist" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  const when = next ? (
    <>
      The next doors open <strong>{doorDay(next.opensAt)}</strong> at {doorTime(next.opensAt)}, for {next.name}, and they
      close again at {next.closesAtMoment}.
    </>
  ) : (
    <>The doors open for a few days at the start of each season, and the next dates are going up very soon.</>
  );

  if (state === "done") {
    return (
      <div style={{ color: textColor }}>
        <p style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>You&apos;re on the list, babe 💗</p>
        <p style={{ fontSize: 13, lineHeight: 1.7 }}>
          We&apos;ll email you the second the doors open, so you can lock in with everyone else.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ color: textColor }}>
      <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{when}</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="first name"
        autoComplete="given-name"
        style={{ width: "100%", padding: "12px 14px", border: "var(--border)", marginBottom: 8, fontSize: 14, background: "#fff", color: "var(--dark)" }}
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        autoComplete="email"
        style={{ width: "100%", padding: "12px 14px", border: "var(--border)", marginBottom: 12, fontSize: 14, background: "#fff", color: "var(--dark)" }}
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-pink w-full"
        style={{ cursor: state === "sending" ? "wait" : "pointer", opacity: state === "sending" ? 0.6 : 1 }}
      >
        {state === "sending" ? "saving your spot…" : "tell me when doors open"}
      </button>
      {state === "error" && (
        <p style={{ fontSize: 12, color: "var(--pink)", marginTop: 10 }}>
          That didn&apos;t go through. Try again, or email hello@thecosmicco.com and we&apos;ll add you.
        </p>
      )}
    </form>
  );
}
