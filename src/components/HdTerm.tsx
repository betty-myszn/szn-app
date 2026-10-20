"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { GLOSSARY } from "@/lib/human-design-learn";

// A Human Design word with a dotted underline: tap it for a two-line definition, so a beginner never
// has to leave the page to look something up. The bubble is plain white with black text so it is
// safe to sit on top of foil (no holo on holo).
export default function HdTerm({ k, children }: { k: string; children: React.ReactNode }) {
  const entry = GLOSSARY[k];
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    // keep the bubble on screen at phone widths
    const r = ref.current?.getBoundingClientRect();
    if (r) setShift(Math.min(0, window.innerWidth - 16 - (r.left + 250)));
    const away = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!entry) return <>{children}</>;

  return (
    <span ref={ref} style={{ position: "relative", display: "inline" }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          font: "inherit",
          color: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit",
          textDecoration: "underline dotted",
          textDecorationThickness: "1.5px",
          textUnderlineOffset: "3px",
          cursor: "help",
        }}
      >
        {children}
      </button>
      {open && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            left: shift,
            top: "calc(100% + 8px)",
            zIndex: 60,
            width: 250,
            display: "block",
            background: "#fff",
            color: "var(--dark)",
            border: "1.5px solid var(--dark)",
            borderRadius: 14,
            padding: "10px 12px",
            fontSize: 13.5,
            lineHeight: 1.45,
            fontWeight: 400,
            fontStyle: "normal",
            letterSpacing: 0,
            textTransform: "none",
            textAlign: "left",
            boxShadow: "3px 3px 0 var(--pink)",
          }}
        >
          <strong style={{ display: "block", marginBottom: 2 }}>{entry.title}</strong>
          {entry.def}
        </span>
      )}
    </span>
  );
}

// Auto-link glossary words inside a paragraph: the first match of each term only, so a box never
// turns into a sea of underlines. Longest patterns go first ("Manifesting Generator" before
// "Generator") so a phrase is never split.
const AUTO = Object.entries(GLOSSARY)
  .filter(([, e]) => e.auto)
  .sort((a, b) => b[1].auto!.source.length - a[1].auto!.source.length);
const COMBINED = new RegExp(AUTO.map(([, e]) => `(${e.auto!.source})`).join("|"), "gi");

export function glossify(text: string): React.ReactNode {
  const used = new Set<string>();
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(COMBINED)) {
    const idx = m.slice(1).findIndex((g) => g !== undefined);
    // each pattern may carry its own flags (case-insensitive or not); re-test against the original
    const [key, entry] = AUTO[idx];
    if (!entry.auto!.test(m[0]) || used.has(key)) continue;
    used.add(key);
    out.push(<Fragment key={`t${m.index}`}>{text.slice(last, m.index)}</Fragment>);
    out.push(
      <HdTerm key={`g${m.index}`} k={key}>
        {m[0]}
      </HdTerm>
    );
    last = m.index! + m[0].length;
  }
  if (out.length === 0) return text;
  out.push(<Fragment key="end">{text.slice(last)}</Fragment>);
  return out;
}
