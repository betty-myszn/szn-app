"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The full-screen sheet a report's micro page opens into. A link to #<hash> opens it (so each one is
// shareable as /reports#style-report), and closing it takes the hash back off the address bar.

const pp = "var(--font-poppins), Poppins, sans-serif";

export default function MicroPageShell({ hash, name, price, buyHref, children }: { hash: string; name: string; price: string; buyHref: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const openFromHash = () => {
      const d = dialog.current;
      if (!d || d.open || window.location.hash !== `#${hash}`) return;
      d.showModal();
      d.scrollTop = 0;
      document.documentElement.style.overflow = "hidden";
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [hash]);

  const onClosed = () => {
    document.documentElement.style.overflow = "";
    history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  return (
    <dialog ref={dialog} onClose={onClosed} aria-label={name} style={{ position: "fixed", inset: 0, width: "100%", maxWidth: "100%", height: "100dvh", maxHeight: "100dvh", margin: 0, padding: 0, border: 0, background: "#fff", color: "var(--dark)", overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--dark)", color: "#fff", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
        <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 15, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "lowercase" }}>{name}</div>
        <a href={buyHref} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ background: "var(--pink)", color: "#fff", border: "2px solid #fff", fontFamily: pp, fontSize: 13, fontWeight: 800, padding: "8px 14px", whiteSpace: "nowrap" }}>buy · {price}</a>
        <button type="button" aria-label="Close" onClick={() => dialog.current?.close()} style={{ all: "unset", cursor: "pointer", color: "#fff", fontFamily: pp, fontWeight: 800, fontSize: 26, lineHeight: 1, padding: "2px 6px" }}>×</button>
      </div>
      {children}
    </dialog>
  );
}
