"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { COVEN_CHECKOUT_URL, covenIsOpen } from "@/lib/coven-launch";
import { COVEN_YEARLY_CHECKOUT_URL, referralClientRef } from "@/lib/coven-offers-shared";

const REF_KEY = "coven_ref";

/** The referral reference from ?ref= (remembered for the visit, so it survives scrolling and tabs). */
function useReferralRef(): string | null {
  const [ref, setRef] = useState<string | null>(null);
  useEffect(() => {
    let fromUrl: string | null = null;
    try {
      fromUrl = referralClientRef(new URLSearchParams(window.location.search).get("ref"));
      if (fromUrl) sessionStorage.setItem(REF_KEY, fromUrl);
      setRef(fromUrl ?? sessionStorage.getItem(REF_KEY));
    } catch {
      setRef(fromUrl);
    }
  }, []);
  return ref;
}

/** Payment Links take client_reference_id from the URL; the webhook reads "ref_<member>" as a referral. */
export function withReferral(url: string, ref: string | null): string {
  return ref ? `${url}?client_reference_id=${encodeURIComponent(ref)}` : url;
}

// The coven's main button. Outside the founding window it goes to the waitlist form; inside it,
// straight to the $44/month Stripe checkout. Renders the waitlist version on the server and flips
// after mount, because the server can't know the visitor's "now". `plan="yearly"` is the $444/year link.
export default function CovenJoinCta({ style, className = "no-underline", plan = "monthly" }: { style?: CSSProperties; className?: string; plan?: "monthly" | "yearly" }) {
  const [open, setOpen] = useState(false);
  const ref = useReferralRef();
  useEffect(() => {
    const tick = () => setOpen(covenIsOpen(Date.now()));
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  if (!open) return <a href="#waitlist" className={className} style={style}>💜 join the waitlist</a>;
  if (plan === "yearly") {
    return (
      <a href={withReferral(COVEN_YEARLY_CHECKOUT_URL, ref)} className={className} style={style}>
        💸 or pay yearly · $444 (2 months free)
      </a>
    );
  }
  return (
    <a href={withReferral(COVEN_CHECKOUT_URL, ref)} className={className} style={style}>
      🔮 join the coven · $44/month
    </a>
  );
}
