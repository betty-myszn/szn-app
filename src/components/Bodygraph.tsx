"use client";

import { useEffect, useId, useState } from "react";
import HdTerm from "@/components/HdTerm";
import {
  GATE_CENTER,
  GATE_NAME,
  CHANNEL_PAIRS,
  CHANNEL_NAME,
  channelKey,
  CENTER_LABELS,
  type CenterKey,
} from "@/lib/human-design-constants";
import { CENTER_CONTENT, CHANNEL_GIFT } from "@/lib/human-design-content";
import { GATE_CONTENT } from "@/lib/human-design-gate-content";
import { GATE_DESCRIPTION } from "@/lib/human-design-gate-descriptions";
import type { HumanDesignData, HDActivation } from "@/types/human-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The bodygraph: the visual half of a Human Design chart, the equivalent of the astrology chart
// wheel. Nine centres in their canonical positions, wired by the 36 channels, flanked by the two
// activation columns (Design on the left, Personality on the right) the way every classic
// bodygraph lays it out. Stylised to the brand palette: Design = pink (the traditional red),
// Personality = black, a gate carried by both = black with a pink stripe. Defined centres carry a
// drifting pink / lilac / white holo fill (static for reduced motion); open centres stay white.
//
// It's interactive: hover (or tap, on a phone) any centre, channel or gate and everything
// unrelated dims while the panel underneath explains that piece for this member's own chart.
//
// Geometry is fixed reference data, the same layout every bodygraph uses, so it is hardcoded here.
// What's personal comes from `hd`.

// Centre anchor points on a 320 x 560 canvas, top (Head) to bottom (Root).
const POS: Record<CenterKey, { x: number; y: number }> = {
  head: { x: 160, y: 46 },
  ajna: { x: 160, y: 120 },
  throat: { x: 160, y: 198 },
  g: { x: 160, y: 300 },
  heart: { x: 240, y: 300 },
  spleen: { x: 50, y: 396 },
  solarplexus: { x: 270, y: 396 },
  sacral: { x: 160, y: 434 },
  root: { x: 160, y: 512 },
};

// The shape of each centre, centred on its anchor. Head/Ajna are triangles, Throat/Sacral/Root
// squares, G a diamond, Heart a small triangle, Spleen/Solar Plexus side-pointing triangles.
function centrePath(key: CenterKey): string {
  const { x, y } = POS[key];
  switch (key) {
    case "head":
      return `${x},${y - 28} ${x - 32},${y + 20} ${x + 32},${y + 20}`;
    case "ajna":
      return `${x - 32},${y - 20} ${x + 32},${y - 20} ${x},${y + 28}`;
    case "g":
      return `${x},${y - 32} ${x + 32},${y} ${x},${y + 32} ${x - 32},${y}`;
    case "heart":
      return `${x + 24},${y - 20} ${x + 24},${y + 20} ${x - 20},${y}`;
    case "spleen":
      return `${x - 26},${y - 32} ${x - 26},${y + 32} ${x + 32},${y}`;
    case "solarplexus":
      return `${x + 26},${y - 32} ${x + 26},${y + 32} ${x - 32},${y}`;
    default:
      return ""; // squares are drawn as <rect>, handled below
  }
}

const SQUARE_CENTRES: CenterKey[] = ["throat", "sacral", "root"];
const CENTRE_KEYS = Object.keys(POS) as CenterKey[];

// Several channels run between the same two centres (four between G and Sacral, for one), so
// each is nudged sideways off the centre-to-centre line to keep every one visible and hoverable.
const LANE = 7;

type Pt = { x: number; y: number };
interface Wire {
  key: string;
  gates: [number, number]; // gates[0] sits at centre a, gates[1] at centre b
  centres: [CenterKey, CenterKey];
  a: Pt;
  b: Pt;
  mid: Pt;
}

const WIRES: Wire[] = (() => {
  const groups = new Map<string, number>();
  const total = new Map<string, number>();
  const pairKey = (x: CenterKey, y: CenterKey) => [x, y].sort().join("|");
  for (const [g1, g2] of CHANNEL_PAIRS) {
    const k = pairKey(GATE_CENTER[g1], GATE_CENTER[g2]);
    total.set(k, (total.get(k) ?? 0) + 1);
  }
  return CHANNEL_PAIRS.map(([g1, g2]) => {
    const ca = GATE_CENTER[g1];
    const cb = GATE_CENTER[g2];
    const k = pairKey(ca, cb);
    const i = groups.get(k) ?? 0;
    groups.set(k, i + 1);
    const n = total.get(k)!;
    // perpendicular offset, using a canonical direction so lanes don't flip per channel
    const [p, q] = [ca, cb].sort() as [CenterKey, CenterKey];
    const dx = POS[q].x - POS[p].x;
    const dy = POS[q].y - POS[p].y;
    const len = Math.hypot(dx, dy) || 1;
    const off = (i - (n - 1) / 2) * LANE;
    const ox = (-dy / len) * off;
    const oy = (dx / len) * off;
    const a = { x: POS[ca].x + ox, y: POS[ca].y + oy };
    const b = { x: POS[cb].x + ox, y: POS[cb].y + oy };
    return {
      key: channelKey(g1, g2),
      gates: [g1, g2],
      centres: [ca, cb],
      a,
      b,
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    };
  });
})();

// Planet glyphs for the activation columns. ︎ keeps them as text, not emoji, on iOS.
const GLYPH: Record<string, string> = {
  Sun: "☉", Earth: "⊕", Moon: "☽", "North Node": "☊", "South Node": "☋", Mercury: "☿",
  Venus: "♀", Mars: "♂", Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
};
const glyph = (body: string) => (GLYPH[body] ?? body.slice(0, 2)) + "︎";

type Focus =
  | { kind: "centre"; key: CenterKey }
  | { kind: "channel"; key: string }
  | { kind: "gate"; gate: number };

const DESIGN = "var(--pink)";
const PERSONALITY = "var(--dark)";

// Where "open the full lesson" goes for each kind of thing: the lesson id and the element to scroll to.
export type LessonTarget = { lesson: string; anchor?: string };

export default function Bodygraph({
  hd,
  unlocked = true,
  onOpenLesson,
}: {
  hd: HumanDesignData;
  unlocked?: boolean;
  onOpenLesson?: (t: LessonTarget) => void;
}) {
  // One selection. A mouse selects on hover and it stays put (so the panel's buttons stay reachable),
  // a tap selects on a phone, and the panel's clear button resets it.
  const [focus, setFocus] = useState<Focus | null>(null);
  const holoId = useId().replace(/:/g, "");
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const defined = new Set(hd.definedCenters);
  const definedChannelKeys = new Set(hd.definedChannels.map((c) => c.key));
  const pGates = new Set(hd.personality.map((a) => a.gate));
  const dGates = new Set(hd.design.map((a) => a.gate));

  // what the current focus lights up; everything else dims
  const lit = (() => {
    if (!focus) return null;
    const centres = new Set<CenterKey>();
    const wires = new Set<string>();
    const gates = new Set<number>();
    if (focus.kind === "centre") {
      centres.add(focus.key);
      for (const w of WIRES) if (w.centres.includes(focus.key)) wires.add(w.key);
      for (const g of [...pGates, ...dGates]) if (GATE_CENTER[g] === focus.key) gates.add(g);
    } else if (focus.kind === "channel") {
      const w = WIRES.find((x) => x.key === focus.key)!;
      wires.add(w.key);
      w.centres.forEach((c) => centres.add(c));
      w.gates.forEach((g) => gates.add(g));
    } else {
      gates.add(focus.gate);
      centres.add(GATE_CENTER[focus.gate]);
      for (const w of WIRES) if (w.gates.includes(focus.gate)) wires.add(w.key);
    }
    return { centres, wires, gates };
  })();

  const dim = (on: boolean) => ({ opacity: lit && !on ? 0.2 : 1, transition: "opacity .2s" });
  const bind = (f: Focus) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setFocus(f);
    },
    onFocus: () => setFocus(f),
    onClick: () => setFocus(f),
    style: { cursor: "pointer" },
  });

  // one half of a channel, coloured by who activates that gate
  const half = (g: number, from: Pt, to: Pt, on: boolean, k: string) => {
    const inP = pGates.has(g);
    const inD = dGates.has(g);
    const w = on ? 6 : 4;
    if (!inP && !inD) return null;
    return (
      <g key={k}>
        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={inP ? PERSONALITY : DESIGN} strokeWidth={w} />
        {inP && inD && (
          <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={DESIGN} strokeWidth={w} strokeDasharray="4 4" />
        )}
      </g>
    );
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(46px, 64px) minmax(0, 340px) minmax(46px, 64px)", justifyContent: "center", gap: 6, alignItems: "stretch" }}>
        <Column title="design" colour={DESIGN} acts={hd.design} lit={lit} bind={bind} focus={focus} />

        <svg viewBox="0 0 320 560" width="100%" role="img" aria-label="Your Human Design bodygraph" style={{ display: "block", overflow: "visible" }}>
          {/* the holo shimmer on her defined centres: pink, lilac and white foil, drifting */}
          <defs>
            <linearGradient id={holoId} x1="0" y1="0" x2="1" y2="1" spreadMethod="reflect">
              <stop offset="0" stopColor="#FF2D87" />
              <stop offset="0.3" stopColor="#FF8CC6" />
              <stop offset="0.5" stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#C8B4F8" />
              <stop offset="1" stopColor="#FF2D87" />
              {!still && (
                <>
                  <animate attributeName="x1" values="0;0.8;0" dur="7s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="1;1.8;1" dur="7s" repeatCount="indefinite" />
                </>
              )}
            </linearGradient>
          </defs>
          {/* the fixed wiring, faint, with each activated gate's half drawn in its colour */}
          {WIRES.map((w) => {
            const on = !!lit?.wires.has(w.key);
            return (
              <g key={w.key} style={dim(on)}>
                <line x1={w.a.x} y1={w.a.y} x2={w.b.x} y2={w.b.y} stroke="var(--lav)" strokeWidth={on ? 5 : 3} strokeOpacity={on ? 0.8 : 0.35} />
                {half(w.gates[0], w.a, w.mid, on, "h0")}
                {half(w.gates[1], w.mid, w.b, on, "h1")}
              </g>
            );
          })}

          {/* invisible fat hit areas so a 4px line is easy to hover or tap */}
          {WIRES.map((w) => (
            <line
              key={`hit${w.key}`}
              x1={w.a.x}
              y1={w.a.y}
              x2={w.b.x}
              y2={w.b.y}
              stroke="transparent"
              strokeWidth={LANE}
              tabIndex={0}
              aria-label={`Channel ${w.key}, ${CHANNEL_NAME[w.key]}`}
              {...bind({ kind: "channel", key: w.key })}
            />
          ))}

          {/* the nine centres, defined = pink, open = white */}
          {CENTRE_KEYS.map((key) => {
            const isDefined = defined.has(key);
            const on = !!lit?.centres.has(key);
            const isFocus = focus?.kind === "centre" && focus.key === key;
            const props = {
              fill: isFocus ? "var(--dark)" : isDefined ? `url(#${holoId})` : "#fff",
              stroke: "var(--dark)",
              strokeWidth: on ? 3 : 2,
              tabIndex: 0,
              "aria-label": `${CENTER_LABELS[key]}, ${isDefined ? "defined" : "open"}`,
              ...bind({ kind: "centre", key }),
            };
            const { x, y } = POS[key];
            const shape = SQUARE_CENTRES.includes(key) ? (
              <rect x={x - 30} y={y - 30} width={60} height={60} {...props} style={{ ...props.style, ...dim(on) }} />
            ) : (
              <polygon points={centrePath(key)} {...props} style={{ ...props.style, ...dim(on) }} />
            );
            return (
              <g key={key} style={{ filter: on ? "drop-shadow(0 0 6px var(--pink))" : "none", transition: "filter .2s" }}>
                {shape}
              </g>
            );
          })}

          {/* short centre labels */}
          {CENTRE_KEYS.map((key) => {
            const { x, y } = POS[key];
            const isFocus = focus?.kind === "centre" && focus.key === key;
            return (
              <text
                key={`t${key}`}
                x={x}
                y={y + 3}
                textAnchor="middle"
                fontFamily={poppins}
                fontSize={8}
                fontWeight={700}
                fill={isFocus ? "#fff" : "var(--dark)"}
                style={{ pointerEvents: "none", ...dim(!!lit?.centres.has(key)) }}
              >
                {CENTER_LABELS[key].replace(/ \(.*\)/, "").toLowerCase()}
              </text>
            );
          })}
        </svg>

        <Column title="personality" colour={PERSONALITY} acts={hd.personality} lit={lit} bind={bind} focus={focus} />
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 14, fontSize: 11 }}>
        <Key swatch={{ background: "linear-gradient(115deg, #FF2D87, #FFFFFF, #C8B4F8)", border: "1.5px solid var(--dark)" }} label={<HdTerm k="defined">defined</HdTerm>} />
        <Key swatch={{ background: "#fff", border: "1.5px solid var(--dark)" }} label={<HdTerm k="open">open</HdTerm>} />
        <Key swatch={{ background: DESIGN, height: 4 }} label={<><HdTerm k="design">design</HdTerm> (unconscious)</>} />
        <Key swatch={{ background: PERSONALITY, height: 4 }} label={<><HdTerm k="personality">personality</HdTerm> (conscious)</>} />
        <Key swatch={{ background: `repeating-linear-gradient(90deg, ${PERSONALITY} 0 4px, ${DESIGN} 4px 8px)`, height: 4 }} label="both" />
      </div>

      <div style={{ position: "relative" }}>
        <Panel focus={focus} hd={hd} unlocked={unlocked} defined={defined} definedChannelKeys={definedChannelKeys} pGates={pGates} dGates={dGates} />
        {focus && (
          <button
            type="button"
            onClick={() => setFocus(null)}
            aria-label="Clear selection"
            style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: 999, border: "1.5px solid var(--dark)", background: "#fff", color: "var(--dark)", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
          >
            ✕
          </button>
        )}
      </div>
      {focus && onOpenLesson && (
        <button
          type="button"
          onClick={() =>
            onOpenLesson(
              focus.kind === "centre"
                ? { lesson: "centres", anchor: `hd-centre-${focus.key}` }
                : focus.kind === "channel"
                  ? { lesson: "channels", anchor: definedChannelKeys.has(focus.key) ? `hd-channel-${focus.key}` : undefined }
                  : { lesson: "gates", anchor: `hd-gate-${focus.gate}` }
            )
          }
          style={{ marginTop: 10, width: "100%", background: "var(--dark)", color: "#fff", border: "none", borderRadius: 14, padding: "13px 16px", fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer" }}
        >
          open the full lesson on this →
        </button>
      )}
    </div>
  );
}

// ── the activation columns either side of the graph ───────────────────────────────
function Column({
  title,
  colour,
  acts,
  lit,
  bind,
  focus,
}: {
  title: string;
  colour: string;
  acts: HDActivation[];
  lit: { gates: Set<number> } | null;
  bind: (f: Focus) => Record<string, unknown>;
  focus: Focus | null;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, color: colour, textAlign: "center", marginBottom: 4, fontFamily: poppins }}>
        {title}
      </div>
      {acts.map((a) => {
        const on = !!lit?.gates.has(a.gate);
        const isFocus = focus?.kind === "gate" && focus.gate === a.gate;
        const b = bind({ kind: "gate", gate: a.gate });
        return (
          <button
            key={a.body}
            type="button"
            title={`${a.body} in gate ${a.gate}, line ${a.line}: ${GATE_NAME[a.gate]}`}
            {...b}
            style={{
              ...(b.style as object),
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
              padding: "2px 6px",
              border: `1.5px solid ${colour}`,
              borderRadius: 6,
              background: isFocus ? colour : "#fff",
              color: isFocus ? "#fff" : colour,
              fontFamily: poppins,
              fontSize: 12,
              fontWeight: 600,
              opacity: lit && !on ? 0.3 : 1,
              transition: "opacity .2s, background .2s",
              minHeight: 24,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 400 }}>{glyph(a.body)}</span>
            <span>
              {a.gate}.{a.line}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Key({ swatch, label }: { swatch: React.CSSProperties; label: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ display: "inline-block", width: 14, height: 11, ...swatch }} />
      {label}
    </span>
  );
}

// ── the explanation panel under the graph ─────────────────────────────────────────
function Panel({
  focus,
  hd,
  unlocked,
  defined,
  definedChannelKeys,
  pGates,
  dGates,
}: {
  focus: Focus | null;
  hd: HumanDesignData;
  unlocked: boolean;
  defined: Set<CenterKey>;
  definedChannelKeys: Set<string>;
  pGates: Set<number>;
  dGates: Set<number>;
}) {
  const box: React.CSSProperties = {
    marginTop: 18,
    padding: "18px 20px",
    borderRadius: 14,
    background: "#fff",
    border: "1.5px solid var(--lav)",
    minHeight: 120,
    lineHeight: 1.55,
    fontSize: 14,
  };
  const head: React.CSSProperties = { fontFamily: poppins, fontWeight: 700, fontSize: 18, margin: "0 0 2px", paddingRight: 34 };
  const sub: React.CSSProperties = { fontSize: 12, margin: "0 0 10px" };

  // who carries a gate, e.g. "design Mars 34.3 · personality Sun 34.1"
  const carriers = (g: number) =>
    [
      ...hd.design.filter((a) => a.gate === g).map((a) => ({ side: "design", a })),
      ...hd.personality.filter((a) => a.gate === g).map((a) => ({ side: "personality", a })),
    ];
  const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];

  if (!focus) {
    return (
      <div style={{ ...box, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }} aria-live="polite">
        Hover or tap any centre, line or gate number and it&apos;ll light up and tell you exactly what that piece of your design is doing.
      </div>
    );
  }

  if (focus.kind === "centre") {
    const c = CENTER_CONTENT[focus.key];
    const isDef = defined.has(focus.key);
    const gatesHere = [...new Set([...dGates, ...pGates])].filter((g) => GATE_CENTER[g] === focus.key).sort((a, b) => a - b);
    const text = isDef ? c.defined : c.open;
    return (
      <div style={box} aria-live="polite">
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <p style={head}>{CENTER_LABELS[focus.key]}</p>
          <Pill text={isDef ? "defined" : "open"} bg={isDef ? "var(--pink-light)" : "var(--lav-light)"} />
        </div>
        <p style={sub}>the centre of {c.theme}</p>
        <p style={{ margin: "0 0 10px" }}>{unlocked ? text : firstSentence(text)}</p>
        {gatesHere.length > 0 ? (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {gatesHere.map((g) => (
              <GateChip key={g} gate={g} p={pGates.has(g)} d={dGates.has(g)} />
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: 13 }}>You don&apos;t carry any gates in this centre, so it&apos;s fully open.</p>
        )}
      </div>
    );
  }

  if (focus.kind === "channel") {
    const w = WIRES.find((x) => x.key === focus.key)!;
    const [g1, g2] = w.gates;
    const has1 = pGates.has(g1) || dGates.has(g1);
    const has2 = pGates.has(g2) || dGates.has(g2);
    const status = definedChannelKeys.has(w.key)
      ? "Fully defined in your chart, so this one is always switched on, a gift you can lean on every single day."
      : has1 || has2
        ? `You carry gate ${has1 ? g1 : g2}, so half of this channel is lit. When someone with gate ${has1 ? g2 : g1} walks in, the whole thing switches on, which is why certain people feel electric to you.`
        : "Not activated in your chart, so you feel this energy through other people rather than running it yourself.";
    return (
      <div style={box} aria-live="polite">
        <p style={head}>
          {g1}–{g2} · {CHANNEL_NAME[w.key]}
        </p>
        <p style={sub}>
          the channel linking your {CENTER_LABELS[w.centres[0]].replace(/ \(.*\)/, "")} and{" "}
          {CENTER_LABELS[w.centres[1]].replace(/ \(.*\)/, "")}
        </p>
        <p style={{ margin: "0 0 8px" }}>{CHANNEL_GIFT[w.key]}</p>
        <p style={{ margin: "0 0 10px", fontWeight: 600 }}>{status}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[g1, g2].map((g) => (
            <GateChip key={g} gate={g} p={pGates.has(g)} d={dGates.has(g)} />
          ))}
        </div>
      </div>
    );
  }

  const g = focus.gate;
  const gc = GATE_CONTENT[g];
  return (
    <div style={box} aria-live="polite">
      <p style={head}>
        Gate {g} · {GATE_NAME[g]}
      </p>
      <p style={sub}>
        in your {CENTER_LABELS[GATE_CENTER[g]].replace(/ \(.*\)/, "")} centre ·{" "}
        {carriers(g)
          .map(({ side, a }) => `${side} ${a.body} ${a.gate}.${a.line}`)
          .join(", ")}
      </p>
      <p style={{ margin: "0 0 10px" }}>{unlocked ? GATE_DESCRIPTION[g] : gc.keynote + "."}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Pill text={`shadow: ${gc.shadow}`} bg="var(--lav-light)" />
        <Pill text={`gift: ${gc.gift}`} bg="var(--pink-light)" />
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 12 }}>
        {dGates.has(g) && pGates.has(g)
          ? "You carry this one on both sides, so it runs through your body and you know it as yourself."
          : dGates.has(g)
            ? "Design side: your body runs this one automatically, and other people often see it in you before you do."
            : "Personality side: this is the bit you consciously know and identify as you."}
      </p>
    </div>
  );
}

function Pill({ text, bg }: { text: string; bg: string }) {
  return (
    <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, padding: "3px 9px", borderRadius: 999, background: bg }}>
      {text}
    </span>
  );
}

function GateChip({ gate, p, d }: { gate: number; p: boolean; d: boolean }) {
  const colour = p ? PERSONALITY : d ? DESIGN : "var(--lav)";
  return (
    <span
      style={{
        fontSize: 12,
        padding: "3px 9px",
        borderRadius: 999,
        border: `1.5px solid ${colour}`,
        borderStyle: p || d ? "solid" : "dashed",
        color: p || d ? colour : "var(--dark)",
        background: p && d ? "var(--pink-light)" : "#fff",
              }}
    >
      {gate} · {GATE_NAME[gate]}
    </span>
  );
}

// The fixed layout, shared with the story-sized share card so its mini bodygraph matches this one.
export const BODYGRAPH_GEOMETRY = { POS, SQUARE_CENTRES, WIRES, centrePath };
