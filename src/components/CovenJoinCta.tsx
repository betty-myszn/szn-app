"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { COVEN_CHECKOUT_URL, covenIsOpen } from "@/lib/coven-launch";

// The coven's main button. Outside the founding window it goes to the waitlist form; inside it,
// straight to the $44/month Stripe checkout. Renders the waitlist version on the server and flips
// after mount, because the server can't know the visitor's "now".
export default function CovenJoinCta({ style, className = "no-underline" }: { style?: CSSProperties; className?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const tick = () => setOpen(covenIsOpen(Date.now()));
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  if (!open) return <a href="#waitlist" className={className} style={style}>💜 join the waitlist</a>;
  return (
    <a href={COVEN_CHECKOUT_URL} className={className} style={style}>
      🔮 join the coven · $44/month
    </a>
  );
}
