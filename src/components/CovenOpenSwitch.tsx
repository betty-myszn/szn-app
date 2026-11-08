"use client";

import { useEffect, useState, type ReactNode } from "react";
import { covenIsOpen } from "@/lib/coven-launch";

// Shows `open` during the founding window and `closed` the rest of the time. Renders `closed` on the
// server and flips after mount, because the server can't know the visitor's "now".
export default function CovenOpenSwitch({ open, closed }: { open: ReactNode; closed: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const tick = () => setIsOpen(covenIsOpen(Date.now()));
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);
  return <>{isOpen ? open : closed}</>;
}
