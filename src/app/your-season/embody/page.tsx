"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useSeason } from "@/lib/use-season";
import { HOUSE_MEANINGS, ordinalHouse, houseForSign } from "@/lib/interpretations";
import { addJournalEntry } from "@/lib/journal-store";
import {
  getSeasonEmbodiment,
  venusElement,
  VENUS_SIGN,
  VENUS_HOUSE,
  VENUS_RECEIVING,
  type SeasonEmbodiment,
  type EmbodimentExercise,
  type DialExercise,
  type AuditExercise,
  type VenusExercise,
  type ReceivingExercise,
  type RetireExercise,
  type TappingExercise,
} from "@/lib/season-embodiment";
import type { ChartData } from "@/types/chart";

// Each exercise is the workshop slide it came from, rebuilt to be done rather than read: the same
// pink ticker, uppercase headline, black-ruled boxes and pink foot band, with the blanks made
// fillable and the ratings tappable. Content lives in season-embodiment.ts.

const poppins = "var(--font-poppins), Poppins, sans-serif";
// The lilac the workshop slides sit on, a shade lighter than --lav-light.
const LILAC = "#F0ECFF";
const RULE = "2px solid var(--dark)";
const DARK_RULE = "1.5px solid #3A3A3A";

const eyebrow: React.CSSProperties = {
  fontFamily: poppins,
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--pink)",
};

const smallCaps: React.CSSProperties = {
  fontFamily: poppins,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const headline = (dark = false): React.CSSProperties => ({
  fontFamily: poppins,
  fontSize: "clamp(30px, 5.2vw, 52px)",
  fontWeight: 800,
  letterSpacing: "-1px",
  lineHeight: 1.02,
  textTransform: "uppercase",
  color: dark ? "#fff" : "var(--dark)",
  margin: "0 0 18px",
});

const body = (dark = false): React.CSSProperties => ({
  fontSize: 14,
  lineHeight: 1.75,
  color: dark ? "rgba(255,255,255,0.75)" : "var(--grey-light)",
});

const field: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "1.5px solid #BBBBBB",
  outline: "none",
  background: "transparent",
  fontFamily: "inherit",
  fontSize: 14,
  lineHeight: 1.6,
  color: "var(--dark)",
  padding: "4px 0",
  resize: "none",
};

const listJoin = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

// ── Slide furniture ──────────────────────────────────────────────────────────────────────────

function Strip({ items, wrap = false }: { items: string[]; wrap?: boolean }) {
  return (
    <div
      style={{
        background: "var(--pink)",
        color: "#fff",
        fontFamily: poppins,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        textAlign: "center",
        padding: "9px 16px",
        whiteSpace: wrap ? "normal" : "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {items.join("  ·  ")}
    </div>
  );
}

function Slide({
  id,
  ticker,
  band,
  bg,
  children,
}: {
  id?: string;
  ticker: string[];
  band?: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ background: bg, scrollMarginTop: 64 }}>
      <Strip items={ticker} />
      <div className="px-5 md:px-8" style={{ paddingTop: 34, paddingBottom: 44 }}>
        <div className="max-w-6xl mx-auto">{children}</div>
      </div>
      {band && <Strip items={[band]} wrap />}
    </section>
  );
}

function ExerciseHead({ ex, index, dark = false }: { ex: EmbodimentExercise; index: number; dark?: boolean }) {
  return (
    <>
      <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 14 }}>
        <span style={eyebrow}>
          {String(index + 1).padStart(2, "0")} · {ex.eyebrow}
        </span>
        <span
          style={{
            ...eyebrow,
            color: dark ? "#fff" : "var(--dark)",
            border: dark ? "1.5px solid #fff" : "1.5px solid var(--dark)",
            padding: "4px 9px",
          }}
        >
          exercise · {ex.minutes} min
        </span>
      </div>
      <h2 style={headline(dark)}>
        {ex.title[0]}
        <br />
        <span style={{ color: "var(--pink)" }}>{ex.title[1]}</span>
      </h2>
    </>
  );
}

function Rating({ value, onChange, dark = false }: { value: number | null; onChange: (n: number) => void; dark?: boolean }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(11, minmax(0, 1fr))", gap: 4 }}>
      {Array.from({ length: 11 }, (_, n) => {
        const on = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={on}
            aria-label={`${n} out of 10`}
            style={{
              height: 34,
              padding: 0,
              cursor: "pointer",
              fontFamily: poppins,
              fontWeight: 800,
              fontSize: 12,
              border: on ? "2px solid var(--pink)" : dark ? DARK_RULE : "1.5px solid var(--dark)",
              background: on ? "var(--pink)" : dark ? "#242424" : "#fff",
              color: on || dark ? "#fff" : "var(--dark)",
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

function SaveToJournal({ disabled, onSave, dark = false }: { disabled: boolean; onSave: () => void; dark?: boolean }) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        type="button"
        className="btn-pink"
        disabled={disabled}
        onClick={() => {
          onSave();
          setSaved(true);
          if (timer.current) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setSaved(false), 2500);
        }}
        style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1 }}
      >
        save to journal
      </button>
      {saved && (
        <span style={{ fontSize: 12, fontWeight: 700, color: dark ? "#fff" : "var(--pink)" }}>saved. that&apos;s the work. ✦</span>
      )}
    </div>
  );
}

// ── Hero + arrive ────────────────────────────────────────────────────────────────────────────

function Hero({ set, houseLine }: { set: SeasonEmbodiment; houseLine: string }) {
  return (
    <section style={{ background: "var(--dark)" }}>
      <Strip items={set.ticker} />
      <div className="px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 44 }}>
        <div className="max-w-6xl mx-auto">
          <Link
            href="/dashboard"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← my szn
          </Link>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-10" style={{ marginTop: 22 }}>
            <div>
              <div style={{ ...eyebrow, marginBottom: 14 }}>{set.sign} szn · embody it</div>
              <h1 style={{ ...headline(true), fontSize: "clamp(36px, 6.4vw, 66px)" }}>
                {set.title[0]}
                <br />
                <span style={{ color: "var(--pink)" }}>{set.title[1]}</span>
              </h1>
              <p style={{ ...body(true), maxWidth: 560, marginBottom: 12 }}>{set.lede}</p>
              <p style={{ ...body(true), color: "#fff", maxWidth: 560, marginBottom: 22 }}>{houseLine}</p>
              <div className="grid grid-cols-3 gap-2" style={{ maxWidth: 460 }}>
                {set.chips.map((c) => (
                  <div key={c.label} style={{ border: DARK_RULE, background: "#242424", padding: "10px 12px" }}>
                    <div style={{ ...eyebrow, fontSize: 8, marginBottom: 4 }}>{c.label}</div>
                    <div style={{ ...smallCaps, color: "#fff" }}>{c.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: DARK_RULE, background: "#242424" }}>
              <div style={{ padding: "20px 22px", borderBottom: DARK_RULE }}>
                <div style={{ ...eyebrow, marginBottom: 6 }}>{set.sign} asks:</div>
                <div style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, textTransform: "uppercase", color: "#fff", lineHeight: 1.25 }}>
                  {set.asks}
                </div>
              </div>
              {set.exercises.map((ex, i) => (
                <a
                  key={ex.id}
                  href={`#${ex.id}`}
                  className="no-underline flex items-center gap-4 hover:bg-[#2c2c2c] transition-colors"
                  style={{ padding: "12px 22px", borderBottom: i < set.exercises.length - 1 ? DARK_RULE : undefined, color: "#fff" }}
                >
                  <span style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, color: "var(--pink)", width: 26 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ ...smallCaps, flex: 1 }}>{ex.label}</span>
                  <span style={{ ...eyebrow, fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{ex.minutes} min</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Strip items={[set.source.title, "a my szn workshop", "made interactive"]} />
    </section>
  );
}

function BreatheWithMe() {
  const [phase, setPhase] = useState<"idle" | "in" | "out" | "done">("idle");
  const [breath, setBreath] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const start = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    let at = 0;
    for (let i = 0; i < 3; i++) {
      timers.current.push(window.setTimeout(() => { setBreath(i + 1); setPhase("in"); }, at));
      at += 4000;
      timers.current.push(window.setTimeout(() => setPhase("out"), at));
      at += 6000;
    }
    timers.current.push(window.setTimeout(() => setPhase("done"), at));
  };

  const label =
    phase === "in" ? `breathe in · ${breath} of 3` : phase === "out" ? "and out, slowly" : phase === "done" ? "now we begin." : "";

  return (
    <div className="flex items-center gap-5" style={{ marginTop: 18, minHeight: 92 }}>
      <div style={{ width: 84, height: 84, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "var(--pink)",
            transform: `scale(${phase === "in" ? 1 : 0.42})`,
            transition: `transform ${phase === "in" ? 4 : 6}s ease-in-out`,
          }}
        />
      </div>
      <div>
        {phase === "idle" || phase === "done" ? (
          <>
            {phase === "done" && <div style={{ ...smallCaps, color: "var(--pink)", marginBottom: 8 }}>{label}</div>}
            <button type="button" onClick={start} className="btn-pink" style={{ cursor: "pointer" }}>
              {phase === "done" ? "again" : "three breaths with me"}
            </button>
          </>
        ) : (
          <div style={{ ...smallCaps, fontSize: 14 }}>{label}</div>
        )}
      </div>
    </div>
  );
}

function Arrive({ set }: { set: SeasonEmbodiment }) {
  const a = set.arrive;
  return (
    <Slide ticker={["before we begin", "arrive", "breathe", "the container"]} band={a.band} bg="var(--pink-bg)">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <div style={{ ...eyebrow, marginBottom: 14 }}>before we begin</div>
          <h2 style={headline()}>
            {a.title[0]}
            <br />
            <span style={{ color: "var(--pink)" }}>{a.title[1]}</span>
          </h2>
          <div style={{ border: RULE, background: "#fff", padding: "20px 22px" }}>
            <div style={{ ...eyebrow, marginBottom: 12 }}>arrive</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {a.steps.map((s) => (
                <li key={s} className="flex items-center gap-3" style={{ fontSize: 14 }}>
                  <span style={{ width: 9, height: 9, background: "var(--pink)", flexShrink: 0 }} />
                  {s}
                </li>
              ))}
            </ul>
            <BreatheWithMe />
          </div>
        </div>
        <div>
          <div style={{ ...eyebrow, marginBottom: 10 }}>how we do this</div>
          {a.rules.map((r, i) => (
            <div key={r.head} className="flex gap-5" style={{ borderTop: RULE, padding: "14px 0" }}>
              <span style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, color: "var(--pink)", width: 18 }}>{i + 1}</span>
              <div>
                <div style={{ ...smallCaps, marginBottom: 3 }}>{r.head}</div>
                <p style={{ ...body(), margin: 0, fontSize: 13 }}>{r.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ── 01 · me or we ────────────────────────────────────────────────────────────────────────────

// Five stops per line: 0 is all ME, 2 is balance, 4 is all WE.
function Dial({ ex, index, value, onChange }: { ex: DialExercise; index: number; value: Record<string, number>; onChange: React.Dispatch<React.SetStateAction<Record<string, number>>> }) {
  const placed = ex.areas.filter((a) => value[a] !== undefined);
  const dist = (a: string) => Math.abs(value[a] - 2);
  const furthest = placed.length ? Math.max(...placed.map(dist)) : 0;
  const flagged = placed.filter((a) => furthest > 0 && dist(a) === furthest);
  const weSide = flagged.filter((a) => value[a] > 2);
  const meSide = flagged.filter((a) => value[a] < 2);

  return (
    <Slide id={ex.id} ticker={ex.ticker} band={ex.band} bg={LILAC}>
      <div className="grid md:grid-cols-[1fr_1.35fr] gap-8 md:gap-12">
        <div>
          <ExerciseHead ex={ex} index={index} />
          <p style={{ ...body(), marginBottom: 20 }}>{ex.intro}</p>
          <div className="grid grid-cols-2" style={{ border: RULE }}>
            <div style={{ background: "var(--dark)", padding: "16px 16px" }}>
              <div style={{ ...eyebrow, marginBottom: 6 }}>{ex.me.label}</div>
              <p style={{ margin: 0, fontSize: 13, color: "#fff", lineHeight: 1.5 }}>{ex.me.sub}</p>
            </div>
            <div style={{ background: "#fff", padding: "16px 16px", borderLeft: RULE }}>
              <div style={{ ...eyebrow, marginBottom: 6 }}>{ex.we.label}</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{ex.we.sub}</p>
            </div>
          </div>
          <p style={{ fontSize: 13, fontStyle: "italic", color: "#6B5AA8", marginTop: 14 }}>{ex.note}</p>
        </div>

        <div>
          <div style={{ border: RULE, background: "#fff", padding: "14px 18px 6px" }}>
            <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[96px_1fr] items-center" style={{ paddingBottom: 6 }}>
              <span />
              <div className="flex justify-between" style={{ ...eyebrow, fontSize: 9 }}>
                <span>me</span>
                <span style={{ color: "var(--dark)" }}>balance</span>
                <span>we</span>
              </div>
            </div>
            {ex.areas.map((area) => {
              const on = flagged.includes(area);
              return (
                <div
                  key={area}
                  className="grid grid-cols-[76px_1fr] sm:grid-cols-[96px_1fr] items-center"
                  style={{ borderTop: "1.5px solid #EEEEEE", padding: "6px 0" }}
                >
                  <span style={{ ...smallCaps, fontSize: 11, color: on ? "var(--pink)" : "var(--dark)" }}>{area}</span>
                  <div className="relative flex justify-between items-center" style={{ height: 36 }}>
                    <div style={{ position: "absolute", left: 14, right: 14, top: "50%", height: 2, background: "var(--dark)" }} />
                    {[0, 1, 2, 3, 4].map((stop) => {
                      const picked = value[area] === stop;
                      return (
                        <button
                          key={stop}
                          type="button"
                          onClick={() => onChange((v) => ({ ...v, [area]: stop }))}
                          aria-label={`${area}: ${["all me", "leaning me", "balance", "leaning we", "all we"][stop]}`}
                          aria-pressed={picked}
                          style={{ position: "relative", width: 28, height: 36, border: "none", background: "transparent", cursor: "pointer", display: "grid", placeItems: "center", padding: 0 }}
                        >
                          <span
                            style={{
                              width: picked ? 20 : stop === 2 ? 12 : 9,
                              height: picked ? 20 : stop === 2 ? 12 : 9,
                              borderRadius: "50%",
                              background: picked ? "var(--pink)" : stop === 2 ? "var(--dark)" : "#fff",
                              border: "2px solid var(--dark)",
                              transition: "all 0.15s",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "var(--dark)", color: "#fff", padding: "18px 20px", marginTop: 12 }}>
            {placed.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Tap a dot on each line and your result shows up right here.</p>
            ) : furthest === 0 ? (
              <>
                <div style={{ ...smallCaps, color: "var(--pink)", marginBottom: 6 }}>balanced, babe.</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
                  Everything you&apos;ve placed sits in the middle. Keep an eye on whichever line took you longest to call.
                </p>
              </>
            ) : (
              <>
                <div style={{ ...smallCaps, color: "var(--pink)", marginBottom: 8 }}>your work is in {listJoin(flagged)}.</div>
                {weSide.length > 0 && (
                  <p style={{ margin: "0 0 6px", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
                    <strong style={{ color: "#fff" }}>{listJoin(weSide)}:</strong>{" "}the we has been winning. Start your compromise audit right here.
                  </p>
                )}
                {meSide.length > 0 && (
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
                    <strong style={{ color: "#fff" }}>{listJoin(meSide)}:</strong>{" "}you&apos;ve been running this one solo. Libra szn wants you to let somebody meet you there.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ── 02 · the compromise audit ────────────────────────────────────────────────────────────────

interface AuditRow { bent: string; cost: number | null; reclaim: string }

function Audit({ ex, index, sign, startWith }: { ex: AuditExercise; index: number; sign: string; startWith: string[] }) {
  const [rows, setRows] = useState<AuditRow[]>([
    { bent: "", cost: null, reclaim: "" },
    { bent: "", cost: null, reclaim: "" },
    { bent: "", cost: null, reclaim: "" },
  ]);
  const update = (i: number, patch: Partial<AuditRow>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  const save = () => {
    const content = rows
      .filter((r) => r.bent.trim())
      .map((r, i) => {
        const cost = r.cost === null ? "not scored" : `${r.cost}/10`;
        const back = r.reclaim.trim() ? ` · taking back: ${r.reclaim.trim()}` : "";
        return `${i + 1}. ${r.bent.trim()} · cost ${cost}${back}`;
      })
      .join("\n");
    if (ex.journal) addJournalEntry({ type: ex.journal.type, prompt: ex.journal.prompt, content, season: sign });
  };

  const headCell: React.CSSProperties = { ...eyebrow, fontSize: 9, color: "#9A9A9A" };

  return (
    <Slide id={ex.id} ticker={ex.ticker} band={ex.band} bg="#fff">
      <div className="grid md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12">
        <div>
          <ExerciseHead ex={ex} index={index} />
          <p style={{ ...body(), marginBottom: 18 }}>{ex.intro}</p>
          {ex.steps.map((s, i) => (
            <div key={s} className="flex gap-4 items-start" style={{ borderTop: RULE, padding: "12px 0" }}>
              <span style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, color: "var(--pink)", width: 16 }}>{i + 1}</span>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
          {startWith.length > 0 && (
            <div style={{ background: "var(--pink-bg)", border: "1.5px solid var(--pink)", padding: "10px 14px", marginTop: 6, fontSize: 13 }}>
              <strong style={{ color: "var(--pink)" }}>Your dial says:</strong> start with {listJoin(startWith)}.
            </div>
          )}
        </div>

        <div>
          <div style={{ border: RULE }}>
            <div className="hidden md:grid grid-cols-[1.3fr_0.9fr_1.3fr] gap-4" style={{ padding: "12px 16px", borderBottom: RULE }}>
              <span style={headCell}>where i bent</span>
              <span style={headCell}>cost</span>
              <span style={headCell}>what i&apos;m reclaiming</span>
            </div>
            <div className="grid md:grid-cols-[1.3fr_0.9fr_1.3fr] gap-2 md:gap-4" style={{ padding: "12px 16px", borderBottom: RULE, background: "#FAFAFA" }}>
              <div>
                <span style={{ ...eyebrow, fontSize: 9, marginRight: 8 }}>example</span>
                <span style={{ fontSize: 13, color: "var(--grey-light)" }}>{ex.example.bent}</span>
              </div>
              <span style={{ ...smallCaps, color: "var(--pink)" }}>{ex.example.cost} / 10</span>
              <span style={{ fontSize: 13, color: "var(--grey-light)" }}>{ex.example.reclaim}</span>
            </div>
            {rows.map((row, i) => {
              const hot = row.cost !== null && row.cost >= ex.threshold;
              const cool = row.cost !== null && row.cost < ex.threshold;
              return (
                <div
                  key={i}
                  className="grid md:grid-cols-[1.3fr_0.9fr_1.3fr] gap-3 md:gap-4 items-start"
                  style={{ padding: "14px 16px", borderBottom: i < rows.length - 1 ? "1.5px solid #DDDDDD" : undefined }}
                >
                  <div className="flex gap-3 items-start">
                    <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, color: "var(--pink)", paddingTop: 3 }}>{i + 1}</span>
                    <textarea
                      rows={2}
                      value={row.bent}
                      onChange={(e) => update(i, { bent: e.target.value })}
                      placeholder="where I said yes to keep the peace"
                      aria-label={`Compromise ${i + 1}: where I bent`}
                      style={field}
                    />
                  </div>
                  <div>
                    <div className="md:hidden" style={{ ...headCell, marginBottom: 4 }}>cost to me</div>
                    <div style={{ ...smallCaps, fontSize: 14, color: hot ? "var(--pink)" : "var(--dark)", marginBottom: 4 }}>
                      {row.cost === null ? "___" : row.cost} / 10
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={row.cost ?? 0}
                      onChange={(e) => update(i, { cost: Number(e.target.value) })}
                      aria-label={`Compromise ${i + 1}: cost out of 10`}
                      style={{ width: "100%", accentColor: "var(--pink)" }}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={row.reclaim}
                    onChange={(e) => update(i, { reclaim: e.target.value })}
                    placeholder={hot ? "7 or above: what I'm taking back" : cool ? "under 7, you can let this one be" : "what I'm reclaiming"}
                    aria-label={`Compromise ${i + 1}: what I'm reclaiming`}
                    style={{ ...field, borderBottom: hot ? "2px solid var(--pink)" : field.borderBottom, opacity: cool && !row.reclaim ? 0.6 : 1 }}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16 }}>
            <SaveToJournal disabled={!rows.some((r) => r.bent.trim())} onSave={save} />
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ── 03 · your venus ──────────────────────────────────────────────────────────────────────────

function Venus({ ex, index, sign, chart }: { ex: VenusExercise; index: number; sign: string; chart: ChartData }) {
  const [use, setUse] = useState("");
  const [said, setSaid] = useState(false);
  const venus = chart.planets.find((p) => p.name === "Venus");
  if (!venus) return null;

  const vSign = VENUS_SIGN[venus.sign];
  const vHouse = VENUS_HOUSE[venus.house];
  const element = venusElement(venus.sign);
  const lineOne = `${ex.statementLead} ${vSign?.attracts ?? "my own flavour of desire"}.`;
  const lineTwo = vHouse ? `My magnetism lives in my ${vHouse.area.replace(" + ", " and ")}.` : null;

  const save = () => {
    const content = [
      `Venus in ${venus.sign}${vHouse ? `, ${ordinalHouse(venus.house)} house` : ""}.`,
      lineOne,
      lineTwo,
      `This week I'll use it to ${use.trim()}.`,
    ]
      .filter(Boolean)
      .join("\n");
    if (ex.journal) addJournalEntry({ type: ex.journal.type, prompt: ex.journal.prompt, content, season: sign });
  };

  const card: React.CSSProperties = { padding: "14px 16px" };
  const cardLabel: React.CSSProperties = { ...eyebrow, fontSize: 9, marginBottom: 6 };

  return (
    <Slide id={ex.id} ticker={ex.ticker} band={ex.band} bg="var(--pink-bg)">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12">
        <div>
          <ExerciseHead ex={ex} index={index} />
          <p style={{ ...body(), marginBottom: 0 }}>{ex.intro}</p>
        </div>
        <div>
          <div className="grid grid-cols-2" style={{ border: RULE, background: "#fff" }}>
            <div style={{ ...card, borderRight: RULE, borderBottom: RULE }}>
              <div style={cardLabel}>my venus sign</div>
              <div style={smallCaps}>venus in {venus.sign}</div>
            </div>
            <div style={{ ...card, borderBottom: RULE }}>
              <div style={cardLabel}>my venus house</div>
              <div style={smallCaps}>{vHouse ? `${ordinalHouse(venus.house)} · ${vHouse.area}` : "add your birth time"}</div>
            </div>
            <div style={{ ...card, borderRight: RULE }}>
              <div style={cardLabel}>my element</div>
              <div style={smallCaps}>{element}</div>
            </div>
            <div style={card}>
              <div style={cardLabel}>my flavour of desire</div>
              <div style={smallCaps}>{vSign?.flavour ?? venus.sign}</div>
            </div>
          </div>
          {vHouse && <p style={{ fontSize: 13, fontStyle: "italic", color: "var(--grey-light)", margin: "10px 0 0" }}>{vHouse.line}</p>}

          <div style={{ border: "2px solid var(--pink)", background: "#fff", padding: "18px 20px", marginTop: 16 }}>
            <div style={{ ...eyebrow, marginBottom: 10 }}>my magnetism statement</div>
            <p style={{ fontFamily: poppins, fontSize: 16, fontWeight: 700, lineHeight: 1.45, margin: "0 0 6px" }}>{lineOne}</p>
            {lineTwo && <p style={{ fontFamily: poppins, fontSize: 16, fontWeight: 700, lineHeight: 1.45, margin: "0 0 6px" }}>{lineTwo}</p>}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 700, whiteSpace: "nowrap" }}>This week I&apos;ll use it to</span>
              <input
                value={use}
                onChange={(e) => setUse(e.target.value)}
                placeholder="finish the sentence"
                aria-label="This week I'll use it to"
                style={{ ...field, flex: 1, minWidth: 180, fontFamily: poppins, fontSize: 16, fontWeight: 700, color: "var(--pink)" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => setSaid((s) => !s)}
              aria-pressed={said}
              style={{
                ...smallCaps,
                fontSize: 12,
                cursor: "pointer",
                padding: "11px 18px",
                border: RULE,
                background: said ? "var(--dark)" : "#fff",
                color: said ? "#fff" : "var(--dark)",
              }}
            >
              {said ? "said it out loud ✦" : "i said it out loud"}
            </button>
            <SaveToJournal disabled={!use.trim()} onSave={save} />
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ── 04 · the receiving drill ─────────────────────────────────────────────────────────────────

function Receiving({ ex, index, chart }: { ex: ReceivingExercise; index: number; chart: ChartData }) {
  const [done, setDone] = useState<boolean[]>(() => ex.steps.map(() => false));
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const tick = (i: number, on?: boolean) => setDone((d) => d.map((v, j) => (j === i ? (on ?? !v) : v)));

  const venus = chart.planets.find((p) => p.name === "Venus");
  const element = venus ? venusElement(venus.sign) : null;
  const style = element ? VENUS_RECEIVING[element] : null;

  const verdict =
    first === null || second === null
      ? null
      : second < first
        ? `${first - second} ${first - second === 1 ? "point" : "points"} easier in a single rep. Imagine a whole szn of them.`
        : second === first
          ? "Same number both times, which is useful data. One rep a day this szn and watch it move."
          : "Harder the second time usually means it landed deeper. Keep going, one rep a day.";

  return (
    <Slide id={ex.id} ticker={ex.ticker} band={ex.band} bg={LILAC}>
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12">
        <div>
          <ExerciseHead ex={ex} index={index} />
          <p style={{ ...body(), marginBottom: 18 }}>{ex.intro}</p>
          <div style={{ border: RULE, background: "#fff", padding: "16px 18px" }}>
            <div style={{ ...eyebrow, marginBottom: 8 }}>why we do this out loud</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>{ex.why}</p>
          </div>
        </div>
        <div>
          {ex.steps.map((s, i) => (
            <div key={s.head} className="flex gap-4 items-start" style={{ borderTop: RULE, padding: "14px 0" }}>
              <button
                type="button"
                onClick={() => tick(i)}
                aria-pressed={done[i]}
                aria-label={`Step ${i + 1} done`}
                style={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  cursor: "pointer",
                  border: RULE,
                  background: done[i] ? "var(--pink)" : "#fff",
                  color: done[i] ? "#fff" : "var(--pink)",
                  fontFamily: poppins,
                  fontWeight: 800,
                  fontSize: 14,
                  padding: 0,
                }}
              >
                {done[i] ? "✓" : i + 1}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ ...smallCaps, fontSize: 13, lineHeight: 1.4, textDecorationLine: done[i] ? "line-through" : "none", textDecorationColor: "var(--pink)" }}>
                  {s.head}
                </div>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--grey-light)" }}>{s.sub}</p>
                {i === 2 && (
                  <div style={{ marginTop: 10 }}>
                    <Rating value={first} onChange={(n) => { setFirst(n); tick(2, true); }} />
                  </div>
                )}
                {i === 3 && (
                  <div style={{ marginTop: 10 }}>
                    <Rating value={second} onChange={(n) => { setSecond(n); tick(3, true); }} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {verdict && (
            <div className="flex items-center gap-5 flex-wrap" style={{ background: "var(--dark)", color: "#fff", padding: "16px 20px" }}>
              <span style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800 }}>
                {first} <span style={{ color: "var(--pink)" }}>→</span> {second}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.55, flex: 1, minWidth: 200, color: "rgba(255,255,255,0.8)" }}>{verdict}</span>
            </div>
          )}
        </div>
      </div>

      {style && venus && (
        <div style={{ marginTop: 34 }}>
          <div style={{ ...eyebrow, marginBottom: 10 }}>
            your receiving style · venus in {element} ({venus.sign.toLowerCase()})
          </div>
          <div className="grid md:grid-cols-3" style={{ border: RULE, background: "#fff" }}>
            <div className="border-b-2 md:border-b-0 md:border-r-2" style={{ padding: "16px 18px", borderColor: "var(--dark)" }}>
              <div style={{ ...eyebrow, fontSize: 9, marginBottom: 6 }}>you receive through</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{style.through}</p>
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2" style={{ padding: "16px 18px", borderColor: "var(--dark)" }}>
              <div style={{ ...eyebrow, fontSize: 9, marginBottom: 6 }}>your block</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{style.block}</p>
            </div>
            <div style={{ padding: "16px 18px", background: "var(--pink)" }}>
              <div style={{ ...eyebrow, fontSize: 9, marginBottom: 6, color: "#fff" }}>your practice this szn</div>
              <p style={{ margin: 0, fontFamily: poppins, fontSize: 15, fontWeight: 800, lineHeight: 1.4, color: "#fff" }}>{style.practice}</p>
            </div>
          </div>
        </div>
      )}
    </Slide>
  );
}

// ── 05 · retire her ──────────────────────────────────────────────────────────────────────────

function Retire({ ex, index, sign, name }: { ex: RetireExercise; index: number; sign: string; name: string }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [dear, setDear] = useState("");
  const [thanks, setThanks] = useState("");
  const [safeFrom, setSafeFrom] = useState("");
  const [because, setBecause] = useState("");
  const [iAm, setIAm] = useState("");
  const [signed, setSigned] = useState(name === "babe" ? "" : name);
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const pick = (i: number) => {
    setPicked(i);
    setDear(ex.shifts[i].was.replace(/^The /, "").replace(/\.$/, ""));
    setIAm(ex.shifts[i].becoming.replace(/\.$/, ""));
  };

  const save = () => {
    const content = [
      `Dear ${dear.trim()},`,
      `Thank you for ${thanks.trim()}.`,
      `You kept me safe from ${safeFrom.trim()}.`,
      `I don't need you anymore, because ${because.trim()}.`,
      `Effective today, I am ${iAm.trim()}.`,
      `Signed, ${signed.trim()} · ${today}`,
    ].join("\n");
    if (ex.journal) addJournalEntry({ type: ex.journal.type, prompt: ex.journal.prompt, content, season: sign });
  };

  const letterLine = (label: string, value: string, set: (v: string) => void, placeholder: string) => (
    <label className="block" style={{ marginBottom: 12 }}>
      <span style={{ fontFamily: poppins, fontSize: 14, fontWeight: 700 }}>{label}</span>
      <input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} style={{ ...field, marginTop: 2 }} />
    </label>
  );

  return (
    <Slide id={ex.id} ticker={ex.ticker} band={ex.band} bg="#fff">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <ExerciseHead ex={ex} index={index} />
          <p style={{ ...body(), marginBottom: 18 }}>{ex.intro}</p>
          <div className="grid grid-cols-[1fr_20px_1fr] gap-2" style={{ ...eyebrow, fontSize: 9, borderBottom: "3px double var(--dark)", paddingBottom: 8 }}>
            <span style={{ color: "var(--dark)" }}>who you&apos;ve been</span>
            <span />
            <span>who you&apos;re becoming</span>
          </div>
          {ex.shifts.map((s, i) => {
            const on = picked === i;
            return (
              <button
                key={s.was}
                type="button"
                onClick={() => pick(i)}
                aria-pressed={on}
                className="grid grid-cols-[1fr_20px_1fr] gap-2 items-center w-full text-left"
                style={{ border: "none", borderBottom: RULE, padding: "12px 8px", cursor: "pointer", background: on ? "var(--pink-bg)" : "transparent" }}
              >
                <span style={{ fontSize: 13, color: on ? "var(--dark)" : "#9A9A9A", textDecoration: "line-through" }}>{s.was}</span>
                <span style={{ color: "var(--pink)", fontWeight: 800 }}>→</span>
                <span style={{ ...smallCaps, fontSize: 12, color: "var(--pink)" }}>{s.becoming}</span>
              </button>
            );
          })}
          <p style={{ fontSize: 12, color: "var(--grey-light)", marginTop: 10 }}>Tap the one you&apos;re retiring and her letter fills in.</p>
        </div>

        <div>
          <div style={{ border: RULE, background: "var(--pink-bg)", padding: "22px 22px 18px" }}>
            <div style={{ ...eyebrow, marginBottom: 16 }}>notice of retirement</div>
            {letterLine("Dear", dear, setDear, "the version of you she's been")}
            {letterLine("Thank you for", thanks, setThanks, "what she did for you")}
            {letterLine("You kept me safe from", safeFrom, setSafeFrom, "what she was protecting you from")}
            {letterLine("I don't need you anymore, because", because, setBecause, "what's true now")}
            {letterLine("Effective today, I am", iAm, setIAm, "who you're becoming")}
            <div className="grid grid-cols-[1.4fr_1fr] gap-4">
              {letterLine("Signed", signed, setSigned, "your name")}
              <div>
                <span style={{ fontFamily: poppins, fontSize: 14, fontWeight: 700 }}>Date</span>
                <div style={{ ...field, marginTop: 2 }}>{today}</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <SaveToJournal disabled={!dear.trim() || !because.trim()} onSave={save} />
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ── 06 · tap out the "too much" ──────────────────────────────────────────────────────────────

function Tapping({ ex, index, sign }: { ex: TappingExercise; index: number; sign: string }) {
  const [before, setBefore] = useState<number | null>(null);
  const [after, setAfter] = useState<number | null>(null);
  const [tapped, setTapped] = useState<boolean[]>(() => ex.points.map(() => false));
  const [rounds, setRounds] = useState<boolean[]>(() => ex.rounds.map(() => false));
  const tappedCount = tapped.filter(Boolean).length;

  const verdict =
    before === null || after === null
      ? null
      : after < before
        ? `${before - after} ${before - after === 1 ? "point" : "points"} lighter. Your nervous system just made room for more.`
        : after === before
          ? "No shift yet, so run the three rounds once more, slower, and rate it again."
          : "Louder usually means you've found the real one. Go again on round one until it softens.";

  const save = () => {
    if (ex.journal) {
      addJournalEntry({
        type: ex.journal.type,
        prompt: ex.journal.prompt,
        content: `Before: ${before ?? "not rated"}/10. After: ${after}/10.`,
        season: sign,
      });
    }
  };

  return (
    <>
      <Slide id={ex.id} ticker={ex.ticker} bg="var(--dark)">
        <div className="grid md:grid-cols-[1fr_1.25fr] gap-8 md:gap-12">
          <div>
            <ExerciseHead ex={ex} index={index} dark />
            <p style={{ ...body(true), marginBottom: 8 }}>{ex.intro}</p>
            <div style={{ ...eyebrow, margin: "22px 0 8px" }}>how it works</div>
            <p style={{ ...body(true), marginBottom: 22 }}>{ex.howItWorks}</p>
            <div style={{ ...eyebrow, marginBottom: 10 }}>before · rate the feeling 0 to 10</div>
            <Rating value={before} onChange={setBefore} dark />
          </div>
          <div>
            <div className="grid grid-cols-3" style={{ border: DARK_RULE }}>
              {ex.points.map((p, i) => {
                const on = tapped[i];
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setTapped((t) => t.map((v, j) => (j === i ? !v : v)))}
                    aria-pressed={on}
                    className="text-left"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      padding: "14px 12px 16px",
                      cursor: "pointer",
                      background: on ? "var(--pink)" : "#242424",
                      border: DARK_RULE,
                      color: "#fff",
                      minHeight: 112,
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, color: on ? "#fff" : "var(--pink)", marginBottom: 8 }}>
                      {on ? "✓" : i + 1}
                    </div>
                    <div style={{ ...smallCaps, fontSize: 11, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.4, color: on ? "#fff" : "rgba(255,255,255,0.65)" }}>{p.where}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
              <span style={{ ...eyebrow, color: "rgba(255,255,255,0.6)" }}>{tappedCount} of {ex.points.length} tapped</span>
              {tappedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setTapped(ex.points.map(() => false))}
                  style={{ ...eyebrow, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  next round ↺
                </button>
              )}
            </div>
          </div>
        </div>
      </Slide>

      <Slide ticker={ex.script.ticker} band={ex.band} bg={LILAC}>
        <div style={{ ...eyebrow, marginBottom: 12 }}>{ex.eyebrow} · the script</div>
        <h2 style={{ ...headline(), fontSize: "clamp(26px, 4.2vw, 42px)" }}>{ex.script.title}</h2>
        <div style={{ border: RULE, background: "#fff", padding: "16px 20px", marginBottom: 14 }}>
          <div style={{ ...eyebrow, fontSize: 9, marginBottom: 8 }}>the setup · on the karate chop, three times</div>
          <p style={{ margin: 0, fontFamily: poppins, fontSize: 16, fontWeight: 700, color: "var(--pink)", lineHeight: 1.45 }}>{ex.setup}</p>
        </div>
        <div className="grid md:grid-cols-3" style={{ border: RULE, background: "#fff" }}>
          {ex.rounds.map((r, i) => (
            <div
              key={r.name}
              className={i < ex.rounds.length - 1 ? "border-b-2 md:border-b-0 md:border-r-2" : ""}
              style={{ padding: "18px 20px", borderColor: "var(--dark)", background: rounds[i] ? "var(--pink-bg)" : "#fff" }}
            >
              <div style={{ ...eyebrow, fontSize: 9, marginBottom: 4 }}>round {i + 1}</div>
              <div style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>{r.name}</div>
              {r.lines.map((l) => (
                <p key={l} style={{ margin: "0 0 9px", fontSize: 14 }}>{l}</p>
              ))}
              <button
                type="button"
                onClick={() => setRounds((d) => d.map((v, j) => (j === i ? !v : v)))}
                aria-pressed={rounds[i]}
                style={{
                  ...smallCaps,
                  fontSize: 11,
                  marginTop: 8,
                  cursor: "pointer",
                  padding: "8px 14px",
                  border: RULE,
                  background: rounds[i] ? "var(--dark)" : "#fff",
                  color: rounds[i] ? "#fff" : "var(--dark)",
                }}
              >
                {rounds[i] ? "round done ✓" : "done this round"}
              </button>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-[1fr_1fr] gap-6 items-end" style={{ marginTop: 26 }}>
          <div>
            <div style={{ ...eyebrow, marginBottom: 10 }}>after · rate it again, 0 to 10</div>
            <Rating value={after} onChange={setAfter} />
          </div>
          <div>
            {verdict && (
              <div className="flex items-center gap-5 flex-wrap" style={{ background: "var(--dark)", color: "#fff", padding: "14px 18px", marginBottom: 12 }}>
                <span style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800 }}>
                  {before} <span style={{ color: "var(--pink)" }}>→</span> {after}
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.55, flex: 1, minWidth: 180, color: "rgba(255,255,255,0.8)" }}>{verdict}</span>
              </div>
            )}
            <SaveToJournal disabled={after === null} onSave={save} />
          </div>
        </div>
      </Slide>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────────────────────

export default function EmbodyPage() {
  const { member, ready } = useMember();
  const { chart, loading } = useChart();
  const season = useSeason();
  const [dial, setDial] = useState<Record<string, number>>({});

  if (!ready || loading) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>members only, babe.</h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (!chart) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>add your birth details first.</h1>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  const set = getSeasonEmbodiment(season.sign);
  if (!set) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 440 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            {season.sign.toLowerCase()} szn&apos;s exercises are on their way.
          </h1>
          <Link href="/dashboard" className="btn-pink">back to my szn</Link>
        </div>
      </section>
    );
  }

  const name = chart.birthData.name || "babe";
  const cusps = chart.houses.map((h) => h.longitude);
  const activatedHouse = houseForSign(season.sign, cusps);
  const houseMeaning = HOUSE_MEANINGS[activatedHouse - 1];
  const houseLine = `${name === "babe" ? "Babe" : name}, ${season.sign} szn is moving through your ${ordinalHouse(activatedHouse)} house of ${houseMeaning.title}, so ${houseMeaning.lifeAreas[0]} and ${houseMeaning.lifeAreas[1]} are where you'll feel these first.`;

  const dialPlaced = Object.keys(dial);
  const dialWe = dialPlaced.filter((a) => dial[a] > 2);
  const dialMax = dialWe.length ? Math.max(...dialWe.map((a) => dial[a])) : 0;
  const startWith = dialWe.filter((a) => dial[a] === dialMax);

  return (
    <>
      <Hero set={set} houseLine={houseLine} />
      <Arrive set={set} />
      {set.exercises.map((ex, i) => {
        switch (ex.kind) {
          case "dial":
            return <Dial key={ex.id} ex={ex} index={i} value={dial} onChange={setDial} />;
          case "audit":
            return <Audit key={ex.id} ex={ex} index={i} sign={set.sign} startWith={startWith} />;
          case "venus":
            return <Venus key={ex.id} ex={ex} index={i} sign={set.sign} chart={chart} />;
          case "receiving":
            return <Receiving key={ex.id} ex={ex} index={i} chart={chart} />;
          case "retire":
            return <Retire key={ex.id} ex={ex} index={i} sign={set.sign} name={name} />;
          case "tapping":
            return <Tapping key={ex.id} ex={ex} index={i} sign={set.sign} />;
        }
      })}
      <section className="px-5 md:px-8 py-10" style={{ background: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-5 flex-wrap">
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)", maxWidth: 520 }}>
            These come from the <strong style={{ color: "#fff" }}>{set.source.title}</strong> workshop. The replay walks you through every one of them live.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href={set.source.replayHref} className="btn-pink">watch the replay</Link>
            <Link
              href="/dashboard"
              className="no-underline"
              style={{ ...smallCaps, fontSize: 12, color: "#fff", border: "1.5px solid #fff", padding: "12px 18px" }}
            >
              back to my szn
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
