"use client";

import { useState } from "react";

const pp = "var(--font-poppins), Poppins, sans-serif";

export type CovenTheme = { emoji: string; title: string; body: string[]; img: string };

// The six things we do in the coven, as one tabbed panel instead of six long cards:
// tabs on the left with the open theme beside them on desktop, an accordion on phones.
export default function CovenExplorer({ items }: { items: CovenTheme[] }) {
  const [open, setOpen] = useState(0);
  const active = items[open];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,0.8fr)_1.2fr] gap-5 items-start" style={{ marginTop: 34 }}>
      <div className="grid gap-3">
        {items.map((t, i) => {
          const on = i === open;
          return (
            <div key={t.title}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-expanded={on}
                className={`w-full text-left flex items-center gap-3 ${on ? "hd-foil" : "hd-tile"}`}
                style={{ border: "var(--border)", borderRadius: 14, background: on ? undefined : "#fff", color: "var(--dark)", padding: "14px 16px", fontFamily: pp, fontSize: 16, fontWeight: 800, lineHeight: 1.25, cursor: "pointer", boxShadow: on ? "4px 4px 0 var(--dark)" : "none" }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{t.emoji}</span>
                <span>{t.title}</span>
              </button>
              {on && (
                <div className="md:hidden" style={{ marginTop: 10 }}>
                  <Panel t={t} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="hidden md:block" style={{ position: "sticky", top: 96 }}>
        <Panel t={active} />
      </div>
    </div>
  );
}

function Panel({ t }: { t: CovenTheme }) {
  return (
    <div className="szn-holo holo-edge" style={{ border: "var(--border)", borderRadius: 18, padding: "24px 24px 26px", color: "var(--dark)", overflow: "hidden" }}>
      <div className="flex items-start justify-between gap-4">
        <div style={{ fontFamily: pp, fontSize: "clamp(20px, 2.4vw, 26px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{t.title}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.img} alt="" aria-hidden="true" style={{ width: 110, height: 110, objectFit: "contain", flexShrink: 0, marginTop: -6 }} />
      </div>
      <div style={{ marginTop: 14 }}>
        {t.body.map((p, i) => {
          const last = i === t.body.length - 1;
          return (
            <p key={i} style={{ margin: last ? "16px 0 0" : "0 0 12px", fontSize: last ? 17 : 15.5, lineHeight: 1.65, fontWeight: last ? 800 : 500, fontFamily: last ? pp : undefined }}>
              {p}
            </p>
          );
        })}
      </div>
    </div>
  );
}
