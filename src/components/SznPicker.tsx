"use client";

import { useEffect, useRef, useState } from "react";
import SznWheel from "@/components/SznWheel";
import type { SeasonInfo } from "@/lib/seasons";
import { ordinalHouse } from "@/lib/interpretations";
import { AREA_FLAVOUR, PICKABLE_AREAS, eraName, shortLabel, wheelHouse } from "@/lib/szn-picks";
import { saveSznPicks } from "@/lib/szn-picks-store";
import { track, EVENTS } from "@/lib/analytics";

// "What do you want MORE of this season?" One screen, used twice: as the last step before a new
// member's first dashboard (mode "welcome", ends in a short reveal) and from the menu any time
// after (mode "edit"). Every tap lights that area's house on her wheel and gets a reply, the order
// she taps becomes the order her dashboard leads with, and her season gets named as she goes.

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function SznPicker({
  mode,
  season,
  initial,
  onDone,
  onSkip,
}: {
  mode: "welcome" | "edit";
  season: SeasonInfo;
  initial: string[];
  onDone: (picks: string[]) => void;
  onSkip?: () => void;
}) {
  const welcome = mode === "welcome";
  const sign = season.sign.toLowerCase();
  const [draft, setDraft] = useState<string[]>(initial);
  const [bubble, setBubble] = useState("");
  const [popId, setPopId] = useState<string | null>(null);
  const [spark, setSpark] = useState<{ id: string; n: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reveal, setReveal] = useState<{ lines: string[]; shown: number } | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Sparkle burst on the card she just switched on. Appended straight to the DOM and cleaned up by
  // itself, so a fast run of taps never re-renders the grid eight times per tap.
  useEffect(() => {
    if (!spark || reducedMotion()) return;
    const el = cardRefs.current[spark.id];
    if (!el) return;
    const made: HTMLSpanElement[] = [];
    for (let i = 0; i < 8; i++) {
      const s = document.createElement("span");
      s.className = `szn-spark s${i % 4}`;
      s.textContent = i % 2 ? "✦" : "✧";
      const a = (i / 8) * Math.PI * 2;
      const d = 40 + Math.random() * 18;
      s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
      s.style.setProperty("--dy", `${Math.sin(a) * d}px`);
      el.appendChild(s);
      made.push(s);
    }
    const t = setTimeout(() => made.forEach((s) => s.remove()), 800);
    return () => {
      clearTimeout(t);
      made.forEach((s) => s.remove());
    };
  }, [spark]);

  // The reveal: one line at a time, then hand over to the dashboard.
  useEffect(() => {
    if (!reveal) return;
    const done = reveal.shown >= reveal.lines.length;
    const t = setTimeout(
      () => (done ? onDone(draft) : setReveal({ ...reveal, shown: reveal.shown + 1 })),
      done ? 1100 : 650,
    );
    return () => clearTimeout(t);
  }, [reveal, draft, onDone]);

  const toggle = (id: string) => {
    const f = AREA_FLAVOUR[id];
    if (draft.includes(id)) {
      setDraft(draft.filter((x) => x !== id));
      setBubble(f.no);
      setPopId(null);
    } else {
      setDraft([...draft, id]);
      setBubble(f.yes);
      setPopId(id);
      setSpark((prev) => ({ id, n: (prev?.n ?? 0) + 1 }));
    }
    setFailed(false);
  };

  const save = async () => {
    if (saving || draft.length === 0) return;
    setSaving(true);
    setFailed(false);
    const saved = await saveSznPicks(draft, season.sign);
    if (!saved) {
      setSaving(false);
      setFailed(true);
      return;
    }
    track(EVENTS.SZN_PICKS_SAVED, { from: mode, picks: draft.join(","), count: draft.length });
    if (!welcome || reducedMotion()) {
      onDone(draft);
      return;
    }
    setReveal({
      lines: [
        "pulling your chart…",
        ...draft.slice(0, 3).map((id) => `lighting up your ${ordinalHouse(wheelHouse(id))} house · ${shortLabel(id)}`),
        `your ${eraName(draft)} ✦`,
      ],
      shown: 1,
    });
  };

  const n = draft.length;
  const talk =
    bubble ||
    (welcome
      ? "tap everything you want MORE of, babe. i'll light up your chart as you go ✦"
      : "tap to add or take away. your dashboard reshuffles the second you save.");

  return (
    <div className="szn-page">
      <div className="szn-picker">
        <div className="szn-step">{welcome ? "last step, babe" : "customise my szn"}</div>
        <h1 className="szn-title">
          {welcome ? (
            <>
              what do you want <span className="szn-holo-text">more</span> of this {sign} szn?
            </>
          ) : (
            <>
              switch up your <span className="szn-holo-text">{sign} szn</span>
            </>
          )}
        </h1>
        <p className="szn-sub">Your picks get the deep reads on your dashboard, and every new season you get to choose again.</p>

        <div className="szn-live">
          <SznWheel picks={draft} popId={popId} />
          <div className="szn-bubble szn-holo" key={talk} aria-live="polite">
            {talk}
            {n > 0 && (
              <span className="szn-era">
                your {sign} szn so far
                <b>{eraName(draft)}</b>
              </span>
            )}
          </div>
        </div>

        <div className="szn-grid">
          {PICKABLE_AREAS.map((area) => {
            const f = AREA_FLAVOUR[area.id];
            const rank = draft.indexOf(area.id);
            return (
              <button
                key={area.id}
                type="button"
                ref={(el) => {
                  cardRefs.current[area.id] = el;
                }}
                className="szn-area"
                aria-pressed={rank > -1}
                onClick={() => toggle(area.id)}
              >
                {rank > -1 && <span className="szn-rank">{rank + 1}</span>}
                <span className="szn-glyph" aria-hidden>
                  {f.glyph}
                </span>
                <span className="szn-name">{shortLabel(area.id)}</span>
                <span className="szn-hint">{f.hint}</span>
              </button>
            );
          })}
        </div>

        <p className="szn-count">
          {n === 0 ? (
            "pick at least one"
          ) : (
            <>
              <span>{n}</span> picked · the order you tap is the order they lead your dashboard
            </>
          )}
        </p>
        <button type="button" className="szn-cta szn-holo-hot" disabled={n === 0 || saving} onClick={save}>
          {saving ? "saving…" : welcome ? "build my season ✦" : "save my picks"}
        </button>
        {failed && (
          <p className="szn-fine" role="alert" style={{ color: "var(--pink)", fontWeight: 700 }}>
            That didn&apos;t save, the connection dropped. Tap the button again and it&apos;ll go through.
          </p>
        )}
        <p className="szn-fine">
          {welcome ? (
            <>
              You can change this anytime from your menu under <b>customise my szn</b>.
            </>
          ) : (
            <>Anything big in the areas you didn&apos;t pick still gets flagged, so you&apos;ll never miss it.</>
          )}
        </p>
        {welcome && onSkip && (
          <button type="button" className="szn-skip" onClick={onSkip}>
            skip for now, show me everything
          </button>
        )}
      </div>

      {reveal && (
        <div className="szn-reveal szn-holo" role="status">
          <div style={{ width: 180 }}>
            <SznWheel picks={draft} showCount={false} className="szn-spin" />
          </div>
          <ol>
            {reveal.lines.slice(0, reveal.shown).map((line, i, shown) => {
              const isLast = i === reveal.lines.length - 1;
              return (
                <li key={line} className={isLast ? "last" : i < shown.length - 1 ? "done" : ""}>
                  {line}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
