"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BADDIE_SESSIONS, SESSION_OPTIONS, SESSION_PACKAGE, bookingHref, type BaddieSession } from "@/lib/baddie-sessions";

// The session cards stay short (name, tagline, who she becomes) and the full write-up opens in a
// pop-up on top of the page. A #slug in the URL (the price card's session list links to them)
// opens that session's pop-up too, so old links keep working. Each session also has its own shareable
// URL, /baddie-sessions/<slug> (with its own Threads/OG preview), which lands with the pop-up open;
// opening a pop-up swaps the address bar to that URL and closing it goes back to /baddie-sessions.

const pp = "var(--font-poppins), Poppins, sans-serif";
const btn = (bg: string, ink = "#fff") => ({ display: "inline-block", background: bg, color: ink, fontFamily: pp, fontSize: 16, fontWeight: 800, padding: "18px 32px", border: "var(--border)", textTransform: "none" as const, letterSpacing: "normal", cursor: "pointer" });
const opt = SESSION_OPTIONS[0];
const linkStyle = { color: "var(--dark)", fontWeight: 800, textDecoration: "underline" } as const;

// The price, the $888 package and (on the Business card) the for-two nudge; shared by card and pop-up.
function Extras({ s, onLink }: { s: BaddieSession; onLink?: () => void }) {
  return (
    <>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "0 0 8px" }}>💌 Want more than one? <a href="#package" onClick={onLink} style={linkStyle}>Get any three sessions for ${SESSION_PACKAGE.priceUsd}</a> and save ${SESSION_PACKAGE.wasUsd - SESSION_PACKAGE.priceUsd}.</p>
      {s.forTwoNote && (
        <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "0 0 8px" }}>💞 {s.forTwoNote} <a href="#for-two" onClick={onLink} style={linkStyle}>for ${opt.priceForTwoUsd} instead of ${opt.priceForTwoWasUsd ?? opt.priceForTwoUsd * 2}</a>.</p>
      )}
    </>
  );
}

const lastOdd = (i: number, n: number) => (n % 2 === 1 && i === n - 1 ? "md:col-span-2 md:mx-auto md:w-[calc(50%-12px)]" : "");

export default function SessionCards() {
  const [open, setOpen] = useState<BaddieSession | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const show = useCallback((s: BaddieSession) => {
    setOpen(s);
    history.replaceState(null, "", `/baddie-sessions/${s.slug}`);
  }, []);

  const close = useCallback(() => {
    dialog.current?.close();
  }, []);

  // Open from the URL hash on load and whenever a #slug link is clicked.
  useEffect(() => {
    const fromHash = () => {
      const { hash, pathname } = window.location;
      const s = BADDIE_SESSIONS.find((b) => `#${b.slug}` === hash || pathname === `/baddie-sessions/${b.slug}`);
      if (s) {
        setOpen(s);
        document.getElementById("sessions")?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.scrollTop = 0;
      document.documentElement.style.overflow = "hidden";
    }
  }, [open]);

  const onClosed = () => {
    setOpen(null);
    document.documentElement.style.overflow = "";
    history.replaceState(null, "", "/baddie-sessions" + window.location.search);
  };

  return (
    <>
      <style>{`.baddie-dialog::backdrop{background:rgba(26,26,26,0.65)}`}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 40 }}>
        {BADDIE_SESSIONS.map((s, i) => (
          <article key={s.slug} id={s.slug} className={`offer-card ${lastOdd(i, BADDIE_SESSIONS.length)}`} style={{ border: "var(--border)", borderRadius: 24, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", scrollMarginTop: 80 }}>
            <button type="button" onClick={() => show(s)} style={{ all: "unset", cursor: "pointer", display: "block", background: s.accent, color: s.accentInk, padding: "22px 24px", borderBottom: "var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>{s.emoji} {s.number}</div>
              <h3 style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(26px, 3vw, 34px)", lineHeight: 1.05, margin: "8px 0 0", letterSpacing: "-0.02em" }}>{s.name}</h3>
            </button>
            <div style={{ padding: "22px 24px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
              <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, lineHeight: 1.3, margin: 0 }}>{s.tagline}</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, margin: "12px 0 0" }}>✨ {s.after}</p>
              <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, margin: "16px 0 12px" }}>{opt.minutes} minutes | ${opt.priceUsd} USD</div>
              <Extras s={s} />
              <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href={bookingHref(s.bookingUrl, `Baddie Session: ${s.name}`)} className="no-underline btn-pink" style={btn("var(--pink)")}>{s.cta}</a>
                <button type="button" onClick={() => show(s)} style={btn("#fff", "var(--dark)")}>See what&apos;s inside</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="baddie-dialog"
        onClose={onClosed}
        onClick={(e) => { if (e.target === dialog.current) close(); }}
        aria-labelledby="baddie-dialog-title"
        style={{ margin: "auto", padding: 0, border: "var(--border)", borderRadius: 24, width: "min(640px, calc(100vw - 24px))", maxHeight: "calc(100dvh - 32px)", overflowY: "auto", background: "#fff", color: "var(--dark)" }}
      >
        {open && (
          <div>
            <div style={{ position: "sticky", top: 0, zIndex: 1, background: open.accent, color: open.accentInk, padding: "22px 60px 22px 24px", borderBottom: "var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>{open.emoji} {open.number}</div>
              <h3 id="baddie-dialog-title" style={{ fontFamily: pp, fontWeight: 800, fontSize: "clamp(26px, 5vw, 34px)", lineHeight: 1.05, margin: "8px 0 0", letterSpacing: "-0.02em" }}>{open.name}</h3>
              <button type="button" onClick={close} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, width: 38, height: 38, borderRadius: 999, border: "var(--border)", background: "#fff", color: "var(--dark)", fontFamily: pp, fontWeight: 800, fontSize: 18, lineHeight: 1, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "22px 24px 28px" }}>
              <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, lineHeight: 1.3, margin: 0 }}>{open.tagline}</p>
              {open.body.map((b) => <p key={b} style={{ fontSize: 16, lineHeight: 1.7, margin: "12px 0 0" }}>{b}</p>)}
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", marginTop: 22 }}>What we&apos;ll work on</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "grid", gap: 6 }}>
                {open.focus.map((f) => <li key={f} style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.5 }}><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>{f}</li>)}
              </ul>
              <p style={{ fontFamily: pp, fontWeight: 800, fontSize: 16, lineHeight: 1.45, margin: "22px 0 0", padding: "14px 16px", background: "var(--pink-light)", border: "var(--border)", borderRadius: 14 }}>✨ {open.after}</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "20px 0 12px" }}><strong>{opt.minutes} minutes on Zoom | ${opt.priceUsd} USD</strong>, with your recording, reports, action plan, guides, journal prompts and exercises landing after. Pop your birth details in at checkout, then I&apos;ll be in your inbox to lock in a time that works in your time zone AND mine.</p>
              <Extras s={open} onLink={close} />
              <div style={{ paddingTop: 12 }}>
                <a href={bookingHref(open.bookingUrl, `Baddie Session: ${open.name}`)} className="no-underline btn-pink" style={btn("var(--pink)")}>{open.cta}</a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
