"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pp = "var(--font-poppins), Poppins, sans-serif";

// The villa photo strip near the top of /retreat: swipe or arrow through it, tap a photo to open it
// full screen, then arrow keys or the buttons move through the rest. Escape or the backdrop closes.

export default function RetreatGallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const strip = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const scroll = (dir: 1 | -1) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.8, behavior: "smooth" });
  const step = useCallback((dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  const arrow: React.CSSProperties = { width: 48, height: 48, borderRadius: 999, border: "var(--border)", background: "#fff", color: "var(--dark)", fontFamily: pp, fontSize: 20, fontWeight: 800, cursor: "pointer", display: "grid", placeItems: "center" };

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          ref={strip}
          className="flex gap-3 px-5 md:px-8"
          style={{ overflowX: "auto", scrollSnapType: "x mandatory", scrollPaddingLeft: 20, paddingBottom: 12, scrollbarWidth: "thin" }}
        >
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`}
              style={{ flex: "0 0 auto", height: "clamp(220px, 34vw, 380px)", aspectRatio: "3 / 2", padding: 0, border: "var(--border)", borderRadius: 18, overflow: "hidden", scrollSnapAlign: "start", cursor: "zoom-in", background: "var(--lav)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading={i < 4 ? "eager" : "lazy"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 px-5 md:px-8" style={{ marginTop: 14 }}>
          <span style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>swipe or tap to look around · {photos.length} photos</span>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous photos" onClick={() => scroll(-1)} style={arrow}>←</button>
            <button type="button" aria-label="Next photos" onClick={() => scroll(1)} style={{ ...arrow, background: "var(--pink)", color: "#fff" }}>→</button>
          </div>
        </div>
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Villa photos"
          onClick={() => setOpen(null)}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(26,26,26,0.94)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 16px 24px" }}
        >
          <button type="button" aria-label="Close" onClick={() => setOpen(null)} style={{ ...arrow, position: "absolute", top: 14, right: 14 }}>✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[open].src}
            alt={photos[open].alt}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "min(1200px, 100%)", maxHeight: "calc(100vh - 160px)", objectFit: "contain", borderRadius: 14, border: "1.5px solid #fff" }}
          />
          <div className="flex items-center gap-4" style={{ marginTop: 18 }} onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Previous photo" onClick={() => step(-1)} style={arrow}>←</button>
            <span style={{ color: "#fff", fontFamily: pp, fontWeight: 800, fontSize: 14, letterSpacing: "0.1em", minWidth: 70, textAlign: "center" }}>{open + 1} / {photos.length}</span>
            <button type="button" aria-label="Next photo" onClick={() => step(1)} style={{ ...arrow, background: "var(--pink)", color: "#fff" }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
