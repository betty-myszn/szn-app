"use client";

import { GATE_CENTER, CHANNEL_PAIRS, channelKey, CENTER_LABELS, type CenterKey } from "@/lib/human-design-constants";
import type { HumanDesignData } from "@/types/human-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The bodygraph: the visual half of a Human Design chart, the equivalent of the astrology chart
// wheel. Nine centres in their canonical positions, wired by the 36 channels, with this member's
// defined centres filled and her defined channels lit. Stylised to the brand palette (pink /
// black / lavender / white) rather than the traditional per-function centre colours, so it sits
// inside MY SZN instead of looking like a generic HD app screenshot.
//
// Geometry is fixed reference data, the same layout every bodygraph uses, so it is hardcoded here.
// What's personal comes from `hd`: definedCenters, openCenters and definedChannels.

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

export default function Bodygraph({ hd }: { hd: HumanDesignData }) {
  const defined = new Set(hd.definedCenters);
  const definedChannelKeys = new Set(hd.definedChannels.map((c) => c.key));

  // Every channel's two centres, derived from the gate-to-centre map so it can't drift from the
  // engine. Drawn faint as the fixed wiring; the member's defined channels are drawn bold on top.
  const wiring = CHANNEL_PAIRS.map(([a, b]) => {
    const ca = GATE_CENTER[a];
    const cb = GATE_CENTER[b];
    return { key: channelKey(a, b), a: POS[ca], b: POS[cb] };
  });

  return (
    <svg viewBox="0 0 320 560" width="100%" role="img" aria-label="Your Human Design bodygraph" style={{ maxWidth: 340, display: "block", margin: "0 auto" }}>
      {/* faint fixed wiring */}
      {wiring.map((w, i) => (
        <line
          key={`w${i}`}
          x1={w.a.x}
          y1={w.a.y}
          x2={w.b.x}
          y2={w.b.y}
          stroke="var(--lav)"
          strokeWidth={3}
          strokeOpacity={0.4}
        />
      ))}

      {/* this member's defined channels, lit pink */}
      {wiring
        .filter((w) => definedChannelKeys.has(w.key))
        .map((w, i) => (
          <line
            key={`d${i}`}
            x1={w.a.x}
            y1={w.a.y}
            x2={w.b.x}
            y2={w.b.y}
            stroke="var(--pink)"
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}

      {/* the nine centres, defined = pink, open = white */}
      {(Object.keys(POS) as CenterKey[]).map((key) => {
        const isDefined = defined.has(key);
        const fill = isDefined ? "var(--pink)" : "#fff";
        const { x, y } = POS[key];
        if (SQUARE_CENTRES.includes(key)) {
          return (
            <rect
              key={key}
              x={x - 30}
              y={y - 30}
              width={60}
              height={60}
              fill={fill}
              stroke="var(--dark)"
              strokeWidth={2}
            />
          );
        }
        return <polygon key={key} points={centrePath(key)} fill={fill} stroke="var(--dark)" strokeWidth={2} />;
      })}

      {/* short centre labels */}
      {(Object.keys(POS) as CenterKey[]).map((key) => {
        const { x, y } = POS[key];
        const isDefined = defined.has(key);
        return (
          <text
            key={`t${key}`}
            x={x}
            y={y + 3}
            textAnchor="middle"
            fontFamily={poppins}
            fontSize={8}
            fontWeight={700}
            fill={isDefined ? "#fff" : "var(--dark)"}
          >
            {CENTER_LABELS[key].replace(/ \(.*\)/, "").toLowerCase()}
          </text>
        );
      })}
    </svg>
  );
}
