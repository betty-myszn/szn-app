"use client";

import { useState } from "react";
import { BODYGRAPH_GEOMETRY } from "@/components/Bodygraph";
import type { HumanDesignData } from "@/types/human-design";

// "my human design": a story-sized card of her type and bodygraph, saved straight to her camera roll
// (or the share sheet on a phone). Same save flow as the season share card. The ground is the real
// Cosmic Co foil, so everything sitting on it is solid black or white (never holo on holo).

const W = 1080;
const H = 1920;
const DARK = "#1a1a1a";
const PINK = "#FF2D87";
const LAV = "#C8B4F8";

function poppinsFamily(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-poppins").trim();
  return v || "Poppins, sans-serif";
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// The bodygraph, drawn from the same geometry as the on-page one, scaled into a box.
function drawBodygraph(ctx: CanvasRenderingContext2D, hd: HumanDesignData, x: number, y: number, scale: number) {
  const { POS, SQUARE_CENTRES, WIRES, centrePath } = BODYGRAPH_GEOMETRY;
  const pGates = new Set(hd.personality.map((a) => a.gate));
  const dGates = new Set(hd.design.map((a) => a.gate));
  const defined = new Set(hd.definedCenters);
  const P = (p: { x: number; y: number }) => ({ x: x + p.x * scale, y: y + p.y * scale });

  ctx.lineCap = "round";
  for (const w of WIRES) {
    const a = P(w.a);
    const b = P(w.b);
    const m = P(w.mid);
    ctx.strokeStyle = LAV;
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ([[w.gates[0], a, m], [w.gates[1], m, b]] as const).forEach(([g, from, to]) => {
      const inP = pGates.has(g);
      const inD = dGates.has(g);
      if (!inP && !inD) return;
      ctx.lineWidth = 5 * scale;
      ctx.strokeStyle = inP ? DARK : PINK;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      if (inP && inD) {
        ctx.strokeStyle = PINK;
        ctx.setLineDash([4 * scale, 4 * scale]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }

  for (const key of Object.keys(POS) as (keyof typeof POS)[]) {
    ctx.fillStyle = defined.has(key) ? PINK : "#fff";
    ctx.strokeStyle = DARK;
    ctx.lineWidth = 2.5 * scale;
    if (SQUARE_CENTRES.includes(key)) {
      const c = P(POS[key]);
      ctx.beginPath();
      ctx.rect(c.x - 30 * scale, c.y - 30 * scale, 60 * scale, 60 * scale);
    } else {
      const pts = centrePath(key)
        .split(" ")
        .map((pair) => pair.split(",").map(Number))
        .map(([px, py]) => P({ x: px, y: py }));
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
  }
}

async function drawCard(hd: HumanDesignData, typeTitle: string, authority: string): Promise<Blob | null> {
  const fam = poppinsFamily();
  try {
    await Promise.all([document.fonts.load(`800 100px ${fam}`), document.fonts.load(`700 40px ${fam}`)]);
  } catch {
    // Falls back to the system sans, still a good card.
  }
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Foil ground, cover-fitted
  const foil = await loadImage("/brand/holographic.jpg");
  if (foil) {
    const s = Math.max(W / foil.width, H / foil.height);
    const fw = foil.width * s;
    const fh = foil.height * s;
    ctx.drawImage(foil, (W - fw) / 2, (H - fh) / 2, fw, fh);
  } else {
    ctx.fillStyle = "#FFE0F0";
    ctx.fillRect(0, 0, W, H);
  }
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 8;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // Brand + eyebrow
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = DARK;
  ctx.font = `800 60px ${fam}`;
  ctx.fillText("my szn", 96, 170);
  ctx.font = `700 34px ${fam}`;
  ctx.fillText("MY HUMAN DESIGN", 96, 268);

  // Type, stepping down until it fits on two lines
  let size = 150;
  let lines: string[] = [];
  for (; size >= 80; size -= 8) {
    ctx.font = `800 ${size}px ${fam}`;
    lines = wrap(ctx, hd.type, W - 192);
    if (lines.length <= 2) break;
  }
  let y = 290 + size;
  for (const l of lines) {
    ctx.fillText(l, 96, y);
    y += size * 0.98;
  }
  ctx.font = `700 52px ${fam}`;
  ctx.fillText(typeTitle.toLowerCase(), 96, y + 10);

  // White panel with the bodygraph
  const panelY = y + 60;
  const panelH = 780;
  ctx.fillStyle = "#fff";
  roundRect(ctx, 96, panelY, W - 192, panelH, 40);
  ctx.fill();
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 5;
  ctx.stroke();
  const gScale = (panelH - 80) / 560;
  drawBodygraph(ctx, hd, W / 2 - 160 * gScale, panelY + 40, gScale);

  // Three black pills, white text
  const pills = [
    `STRATEGY · ${hd.strategy}`,
    `AUTHORITY · ${authority}`,
    `PROFILE · ${hd.profile}`,
  ];
  ctx.font = `700 34px ${fam}`;
  let py = panelY + panelH + 50;
  for (const p of pills) {
    const tw = ctx.measureText(p).width;
    ctx.fillStyle = DARK;
    roundRect(ctx, 96, py, tw + 64, 66, 33);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(p, 128, py + 45);
    py += 82;
  }

  ctx.fillStyle = DARK;
  ctx.font = `800 36px ${fam}`;
  ctx.fillText("ITSMYSZN.COM", 96, H - 90);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export default function HdShareButton({ hd, typeTitle, authority }: { hd: HumanDesignData; typeTitle: string; authority: string }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const save = async () => {
    if (busy) return;
    setBusy(true);
    setNote("");
    try {
      const blob = await drawCard(hd, typeTitle, authority);
      if (!blob) throw new Error("no canvas");
      const file = new File([blob], `my-human-design-${hd.type.toLowerCase().replace(/ /g, "-")}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "my human design" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        setNote("saved ✦ post it and tag @itsmyszn");
      }
    } catch (e) {
      // Closing the share sheet without picking anything lands here too, which is not a failure.
      if (!(e instanceof DOMException && e.name === "AbortError")) setNote("that didn't save, give it another tap");
    }
    setBusy(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={save}
        disabled={busy}
        style={{
          background: "var(--dark)",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "12px 20px",
          fontFamily: "var(--font-poppins), Poppins, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          cursor: busy ? "wait" : "pointer",
        }}
      >
        {busy ? "making your card..." : "save my design card ✦"}
      </button>
      {note && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>{note}</span>}
    </div>
  );
}
