"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// The shared "learn your chart" kit behind the Human Design page and the astrology chart page: a
// grid of colour-block lesson tiles, each opening a full-screen, closable lesson page laid out in
// boxes, with previous / next, swipe, its own #prefix-id link, and a read-progress record saved to
// her account. Every piece of text is solid black (or white on black), never faded.

const poppins = "var(--font-poppins), Poppins, sans-serif";

export function SectionHead({ title }: { title: string }) {
  return (
    <h2 style={{ fontFamily: poppins, fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, margin: "34px 0 12px" }}>
      {title}
    </h2>
  );
}

// ── which lesson is open, deep links, progress ───────────────────────────────────
// Each lesson has its own link (#hd-authority, #chart-moon) so emails and the dashboard can point
// straight at one. Opening from the page pushes a history entry so the phone's back gesture closes
// it. Progress lives on her auth account (user_metadata[progressKey]) with localStorage as the
// fallback for logged-out visitors.

async function loadRead(key: string): Promise<string[]> {
  let local: string[] = [];
  try {
    const raw = JSON.parse(localStorage.getItem(`myszn_${key}`) ?? "[]");
    if (Array.isArray(raw)) local = raw.filter((x) => typeof x === "string");
  } catch {
    // private window
  }
  try {
    const { data } = await createClient().auth.getSession();
    const remote = data.session?.user?.user_metadata?.[key];
    return Array.from(new Set([...local, ...(Array.isArray(remote) ? remote : [])]));
  } catch {
    return local;
  }
}

async function saveRead(key: string, ids: string[]): Promise<void> {
  try {
    localStorage.setItem(`myszn_${key}`, JSON.stringify(ids));
  } catch {
    // private window: in-memory state still shows progress this visit
  }
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session) await supabase.auth.updateUser({ data: { [key]: ids } });
  } catch {
    // offline or logged out: the local copy is enough
  }
}

export function useLessons({ prefix, ids, accessible, progressKey }: { prefix: string; ids: string[]; accessible: string[]; progressKey: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<string | undefined>();
  const [read, setRead] = useState<string[]>([]);
  const pushed = useRef(false);
  const tag = `#${prefix}-`;
  const idsKey = ids.join("|");

  useEffect(() => {
    const valid = idsKey.split("|");
    const fromHash = () => {
      const id = window.location.hash.slice(tag.length);
      if (window.location.hash.startsWith(tag) && valid.includes(id)) {
        setOpenId(id);
      } else {
        setOpenId(null);
        setAnchor(undefined);
        pushed.current = false;
      }
    };
    fromHash();
    window.addEventListener("popstate", fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("popstate", fromHash);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [tag, idsKey]);

  useEffect(() => {
    loadRead(progressKey).then(setRead);
  }, [progressKey]);

  const markRead = (id: string) => {
    setRead((cur) => {
      if (cur.includes(id)) return cur;
      const next = [...cur, id];
      saveRead(progressKey, next);
      return next;
    });
  };

  // opening a lesson she has access to counts it as read
  const accessKey = accessible.join("|");
  useEffect(() => {
    if (openId && accessKey.split("|").includes(openId)) markRead(openId);
  }, [openId, accessKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (id: string, at?: string) => {
    const url = `${window.location.pathname}${window.location.search}${tag}${id}`;
    if (!openId) {
      window.history.pushState(null, "", url);
      pushed.current = true;
    } else {
      window.history.replaceState(null, "", url);
    }
    setAnchor(at);
    setOpenId(id);
  };
  const close = () => {
    if (pushed.current) {
      window.history.back(); // popstate clears it
    } else {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      setOpenId(null);
      setAnchor(undefined);
    }
  };

  const readCount = accessible.filter((id) => read.includes(id)).length;
  return { openId, anchor, read, readCount, open, close, markRead };
}

export function LessonProgress({ title, readCount, total }: { title: string; readCount: number; total: number }) {
  return (
    <div style={{ margin: "36px 0 6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h2>
        <span style={{ fontFamily: poppins, fontSize: 13, fontWeight: 700 }}>{readCount >= total ? "all read ✦" : `${readCount} of ${total} read`}</span>
      </div>
      <div style={{ height: 12, borderRadius: 999, background: "var(--lav-light)", border: "1.5px solid var(--dark)", overflow: "hidden" }}>
        <div className="hd-foil" style={{ height: "100%", width: `${(readCount / Math.max(1, total)) * 100}%`, transition: "width .5s ease" }} />
      </div>
    </div>
  );
}

// ── tiles, lesson page, boxes ─────────────────────────────────────────────────────

export interface Lesson {
  id: string;
  eyebrow: string;
  title: string;
  hook: string;
  locked?: boolean; // paid layer: free members get the go-deeper prompt instead of the body
  href?: string; // a tile that opens its own page instead of a lesson (the full-chart readings)
  body: React.ReactNode;
}

// Colour blocks cycle through the brand palette. Black tiles carry white text; every other tile
// carries solid black text (never faded).
export const TONES: { bg: string; fg: string; border?: string }[] = [
  { bg: "var(--pink)", fg: "var(--dark)" },
  { bg: "var(--lav-light)", fg: "var(--dark)" },
  { bg: "var(--dark)", fg: "#fff" },
  { bg: "var(--pink-light)", fg: "var(--dark)" },
  { bg: "#fff", fg: "var(--dark)", border: "1.5px solid var(--dark)" },
  { bg: "var(--lav)", fg: "var(--dark)" },
];

export function LessonTiles({
  title,
  lessons,
  offset,
  unlocked,
  read,
  onOpen,
  compact = false,
}: {
  compact?: boolean; // smaller tiles for long sets, like the 12 houses
  title: string;
  lessons: Lesson[];
  offset: number;
  unlocked: boolean;
  read: string[];
  onOpen: (id: string) => void;
}) {
  if (lessons.length === 0) return null;
  return (
    <>
      <SectionHead title={title} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${compact ? 130 : 155}px, 1fr))`, gap: 12 }}>
        {lessons.map((l, i) => {
          const n = offset + i;
          const tone = TONES[n % TONES.length];
          const locked = !!l.locked && !unlocked;
          const done = read.includes(l.id) && !locked;
          return (
            <button
              key={l.id}
              type="button"
              className="hd-tile"
              onClick={() => onOpen(l.id)}
              style={{
                textAlign: "left",
                background: tone.bg,
                color: tone.fg,
                border: tone.border ?? "none",
                borderRadius: 18,
                padding: "16px 16px 14px",
                minHeight: compact ? 130 : 170,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {done && (
                <span className="holo-sticker" style={{ position: "absolute", top: -10, right: 10, transform: "rotate(6deg)", padding: "4px 10px", fontSize: 10 }}>
                  read ✦
                </span>
              )}
              <span style={{ fontFamily: poppins, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" }}>
                {String(n + 1).padStart(2, "0")} · {l.eyebrow}
              </span>
              <span style={{ fontFamily: poppins, fontSize: compact ? 16 : 19, fontWeight: 700, lineHeight: 1.15 }}>{l.title}</span>
              <span style={{ fontSize: 13.5, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {l.hook}
              </span>
              <span style={{ marginTop: "auto", paddingTop: 8, fontFamily: poppins, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
                {locked ? "🔒 members" : done ? "read again ✦" : "open it ✦"}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function LessonPage({
  lesson,
  tone,
  locked,
  lockedContent,
  anchor,
  prev,
  next,
  onGo,
  onClose,
}: {
  lesson: Lesson;
  tone: { bg: string; fg: string; border?: string };
  locked: boolean;
  /** what a locked lesson shows instead of its body (the upgrade prompt) */
  lockedContent?: React.ReactNode;
  anchor?: string;
  prev?: Lesson;
  next?: Lesson;
  onGo: (id: string) => void;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && next) onGo(next.id);
      if (e.key === "ArrowLeft" && prev) onGo(prev.id);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onGo, next, prev]);

  // each lesson starts at the top, or at the exact centre / channel / gate she tapped on the chart
  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
    if (!anchor || locked) return;
    const t = setTimeout(() => {
      const el = document.getElementById(anchor);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("hd-flash");
    }, 250);
    return () => clearTimeout(t);
  }, [lesson.id, anchor, locked]);

  // swipe left / right between lessons on a phone
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 60) return;
    if (dx < 0 && next) onGo(next.id);
    if (dx > 0 && prev) onGo(prev.id);
  };

  const arrow: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "1.5px solid var(--dark)",
    background: "#fff",
    color: "var(--dark)",
    fontSize: 16,
    lineHeight: 1,
    cursor: "pointer",
    flexShrink: 0,
  };

  return (
    <div
      ref={scroller}
      role="dialog"
      aria-modal="true"
      aria-label={lesson.eyebrow}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#fff", overflowY: "auto", color: "var(--dark)" }}
    >
      {/* sticky bar: where you are, previous / next, close */}
      <div style={{ position: "sticky", top: 0, zIndex: 2, background: "#fff", borderBottom: "1.5px solid var(--dark)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginRight: "auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {lesson.eyebrow}
          </span>
          <button type="button" style={{ ...arrow, visibility: prev ? "visible" : "hidden" }} onClick={() => prev && onGo(prev.id)} aria-label="Previous lesson">
            ‹
          </button>
          <button type="button" style={{ ...arrow, visibility: next ? "visible" : "hidden" }} onClick={() => next && onGo(next.id)} aria-label="Next lesson">
            ›
          </button>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            style={{ background: "var(--dark)", color: "#fff", border: "none", borderRadius: 999, padding: "9px 16px", fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", flexShrink: 0 }}
          >
            close ✕
          </button>
        </div>
      </div>

      {/* hero in the tile's colour */}
      <div style={{ background: tone.bg, color: tone.fg, borderBottom: tone.border }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px 32px" }}>
          <p style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", margin: "0 0 10px" }}>{lesson.eyebrow}</p>
          <h2 style={{ fontFamily: poppins, fontSize: 34, lineHeight: 1.08, fontWeight: 700, margin: "0 0 12px" }}>{lesson.title}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.5, margin: 0 }}>{lesson.hook}</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 48px" }}>
        {locked ? lockedContent : lesson.body}

        {/* step through the lessons in order */}
        {next ? (
          <button
            type="button"
            onClick={() => onGo(next.id)}
            style={{ marginTop: 36, width: "100%", textAlign: "left", background: "var(--dark)", color: "#fff", border: "none", borderRadius: 18, padding: "18px 20px", cursor: "pointer", fontFamily: "inherit" }}
          >
            <span style={{ display: "block", fontFamily: poppins, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 4, color: "var(--pink)" }}>
              next up → (or swipe)
            </span>
            <span style={{ fontFamily: poppins, fontSize: 19, fontWeight: 700 }}>
              {next.eyebrow}: {next.title}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            style={{ marginTop: 36, width: "100%", background: "var(--pink)", color: "var(--dark)", border: "none", borderRadius: 18, padding: "18px 20px", cursor: "pointer", fontFamily: poppins, fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}
          >
            back to my chart ✦
          </button>
        )}
      </div>
    </div>
  );
}

// A coloured content box, the building block of every lesson page.
export function Box({
  tone = "white",
  label,
  id,
  wide,
  children,
}: {
  tone?: "white" | "pink" | "lav" | "dark";
  label?: React.ReactNode;
  id?: string;
  wide?: boolean; // span every column of a grid
  children: React.ReactNode;
}) {
  const t = {
    white: { background: "#fff", color: "var(--dark)", border: "1.5px solid var(--dark)" },
    pink: { background: "var(--pink-light)", color: "var(--dark)", border: "none" },
    lav: { background: "var(--lav-light)", color: "var(--dark)", border: "none" },
    dark: { background: "var(--dark)", color: "#fff", border: "none" },
  }[tone];
  return (
    <div id={id} style={{ ...t, borderRadius: 18, padding: "18px 20px", fontSize: 15.5, lineHeight: 1.65, gridColumn: wide ? "1 / -1" : undefined }}>
      {label && (
        <div style={{ fontFamily: poppins, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8, color: tone === "dark" ? "var(--pink)" : "var(--dark)" }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

// The first sentence in bold as the one-liner, the rest after it with glossary words tappable.
// Skimmers get the point, readers get the depth.
export function makeLead(glossify: (s: string) => React.ReactNode) {
  return function lead(text: string): React.ReactNode {
  const m = text.match(/^(.+?[.!])\s+([\s\S]+)$/);
  if (!m) return <strong>{text}</strong>;
  return (
    <>
      <strong style={{ display: "block", fontSize: 17, lineHeight: 1.4, marginBottom: 6 }}>{m[1]}</strong>
      {glossify(m[2])}
    </>
  );
}
}
