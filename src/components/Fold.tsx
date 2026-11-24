"use client";

import { useEffect, useState, type ReactNode } from "react";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// One dashboard module, closed by default: emoji, title and a one-line promise, tap to open the full
// section. Betty, 24 Nov 2026: "sectioned up rather than really scary amounts of words". The content
// is mounted only once opened, so a closed module costs nothing. Opens itself when the URL hash
// names it, so deep links (e.g. /dashboard#season-guide) still land inside the section.
export default function Fold({
  id,
  emoji,
  title,
  line,
  tone = "white",
  children,
}: {
  id: string;
  emoji: string;
  title: string;
  line: string;
  tone?: "white" | "lav" | "pink";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [id]);

  const bg = tone === "lav" ? "var(--lav-light)" : tone === "pink" ? "var(--pink-bg)" : "#fff";

  return (
    <div id={id} style={{ scrollMarginTop: 80 }}>
      <div className="px-5 md:px-8" style={{ paddingTop: 10, paddingBottom: open ? 0 : 10 }}>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="max-w-6xl mx-auto w-full flex items-center gap-4 text-left holo-edge"
          style={{ display: "flex", background: bg, border: "2px solid var(--dark)", borderRadius: 18, padding: "18px 20px", cursor: "pointer", color: "var(--dark)" }}
        >
          <span aria-hidden style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", border: "2px solid var(--dark)", background: "#fff", display: "grid", placeItems: "center", fontSize: 22 }}>{emoji}</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontFamily: poppins, fontSize: 18, fontWeight: 800, lineHeight: 1.15 }}>{title}</span>
            <span style={{ display: "block", fontSize: 14, lineHeight: 1.4, marginTop: 4, color: "var(--dark)" }}>{line}</span>
          </span>
          <span aria-hidden style={{ flexShrink: 0, fontFamily: poppins, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>{open ? "close −" : "open +"}</span>
        </button>
      </div>
      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}
