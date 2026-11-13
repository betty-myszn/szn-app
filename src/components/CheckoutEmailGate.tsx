"use client";

import { useEffect, useRef, useState } from "react";
import { useMember } from "@/lib/use-member";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const STRIPE_LINK_HOST = "buy.stripe.com";
const REMEMBERED_EMAIL_KEY = "szn_checkout_email";

// Mounted once in the root layout. Every "buy" button on the site is a plain link to a Stripe
// payment link, and Stripe only tells us who someone is once they have paid, so anyone who leaves
// at the card form is invisible. This catches a click on ANY buy.stripe.com link, asks for her
// email first, saves it against that offer (/api/checkout-lead), then sends her on to Stripe with
// the email already filled in. If she doesn't finish, she is in /admin/checkout-dropoffs.
//
// A logged-in member is never asked: we already know her email, so it is saved in the background
// and her click carries on untouched (her link also carries her member id, which must not change).
// Saving is best-effort everywhere: if it fails or is slow, she still goes to Stripe.

function stripeLinkFrom(target: EventTarget | null): HTMLAnchorElement | null {
  const a = target instanceof Element ? target.closest("a[href]") : null;
  if (!(a instanceof HTMLAnchorElement)) return null;
  try {
    return new URL(a.href).hostname === STRIPE_LINK_HOST ? a : null;
  } catch {
    return null;
  }
}

function saveLead(email: string, checkoutUrl: string): Promise<unknown> {
  return fetch("/api/checkout-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, checkoutUrl, page: window.location.pathname }),
    keepalive: true,
  }).catch(() => null);
}

export default function CheckoutEmailGate() {
  const { member } = useMember();
  const memberEmail = member?.email ?? null;
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Bubble phase on the document, so a button's own click handler has already run. If it
    // cancelled the click (the membership button does until its terms box is ticked), leave it.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const link = stripeLinkFrom(e.target);
      if (!link) return;
      const url = new URL(link.href);
      if (url.searchParams.has("prefilled_email")) return;
      if (memberEmail) {
        void saveLead(memberEmail, link.href);
        return;
      }
      e.preventDefault();
      let remembered = "";
      try { remembered = window.localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? ""; } catch { /* private mode */ }
      setEmail(remembered);
      setError("");
      setSending(false);
      setPendingUrl(link.href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [memberEmail]);

  useEffect(() => {
    if (!pendingUrl) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPendingUrl(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingUrl]);

  if (!pendingUrl) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError("That email doesn't look quite right, babe");
      return;
    }
    setSending(true);
    try { window.localStorage.setItem(REMEMBERED_EMAIL_KEY, clean); } catch { /* private mode */ }
    // Give the save a moment, but never keep her waiting on it.
    await Promise.race([saveLead(clean, pendingUrl), new Promise((r) => setTimeout(r, 2500))]);
    const url = new URL(pendingUrl);
    url.searchParams.set("prefilled_email", clean);
    window.location.assign(url.toString());
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-email-title"
      onClick={(e) => { if (e.target === e.currentTarget) setPendingUrl(null); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(26,26,26,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <form
        onSubmit={submit}
        noValidate
        style={{ position: "relative", width: "100%", maxWidth: 420, background: "#fff", color: "var(--dark)", border: "var(--border)", borderRadius: 18, padding: "32px 24px 24px", fontFamily: poppins }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setPendingUrl(null)}
          style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", fontSize: 26, lineHeight: 1, cursor: "pointer", color: "var(--dark)", padding: 6 }}
        >
          ×
        </button>
        <h2 id="checkout-email-title" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
          Pop your email in first, my loveee 💜
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.55, margin: "12px 0 18px" }}>
          It&apos;s where your order lands, and where we&apos;ll find you if checkout cuts out halfway.
        </p>
        <label htmlFor="checkout-email" style={{ display: "block", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
          Your email
        </label>
        <input
          id="checkout-email"
          ref={inputRef}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          style={{ width: "100%", boxSizing: "border-box", border: "var(--border)", borderRadius: 10, padding: "13px 14px", fontSize: 16, color: "var(--dark)", background: "#fff" }}
        />
        {error && <p role="alert" style={{ fontSize: 14, fontWeight: 700, margin: "8px 0 0" }}>{error}</p>}
        <button
          type="submit"
          disabled={sending}
          style={{ width: "100%", marginTop: 16, background: "var(--dark)", color: "#fff", border: "none", fontFamily: poppins, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "17px 24px", cursor: sending ? "default" : "pointer" }}
        >
          {sending ? "Taking you to checkout" : "Continue to checkout"}
        </button>
        <p style={{ fontSize: 13, lineHeight: 1.5, margin: "14px 0 0" }}>
          🔒 Secure checkout with Stripe. MY SZN is part of The Cosmic Co, so that&apos;s the name you&apos;ll see on the payment page and on your statement.
        </p>
      </form>
    </div>
  );
}
