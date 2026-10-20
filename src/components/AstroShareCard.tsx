"use client";

import { useState } from "react";
import { PLANET_SYMBOLS, ZODIAC_SYMBOLS } from "@/types/chart";
import type { ChartData } from "@/types/chart";

// "my big three": a story-sized card of her sun, moon and rising with a mini birth chart, saved
// straight to her camera roll (or the share sheet on a phone). Same save flow as the Human Design
// and season cards. The ground is the real Cosmic Co foil, so everything on it is solid black or white.

const W = 1080;
const H = 1920;
const DARK = "#1a1a1a";
const PINK = "#FF2D87";
const LAV = "#C8B4F8";

function poppinsFamily(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-poppins").trim();
  return v || "Poppins, sans-serif";
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

const glyph = (s: string) => s + "︎";

// A mini natal wheel: rising on the left like every chart, sign ring, house lines, planet glyphs.
function drawWheel(ctx: CanvasRenderingContext2D, chart: ChartData, cx: number, cy: number, r: number, fam: string) {
  const asc = chart.ascendant;
  const at = (lon: number, rad: number) => {
    const a = ((180 + (lon - asc)) * Math.PI) / 180; // ascendant at 9 o'clock, zodiac anticlockwise
    return { x: cx + rad * Math.cos(a), y: cy - rad * Math.sin(a) };
  };

  ctx.lineWidth = 4;
  ctx.strokeStyle = DARK;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
  ctx.stroke();

  // sign boundaries + glyphs
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 12; i++) {
    const a = at(i * 30, r);
    const b = at(i * 30, r * 0.8);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    const g = at(i * 30 + 15, r * 0.9);
    ctx.fillStyle = DARK;
    ctx.font = `400 ${Math.round(r * 0.1)}px ${fam}`;
    ctx.fillText(glyph(ZODIAC_SYMBOLS[i] ?? ""), g.x, g.y);
  }

  // house lines (rising + midheaven axes bold)
  chart.houses.forEach((h, i) => {
    const a = at(h.longitude, r * 0.8);
    const b = at(h.longitude, r * 0.28);
    ctx.strokeStyle = i % 3 === 0 ? DARK : LAV;
    ctx.lineWidth = i % 3 === 0 ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = PINK;
  ctx.fill();
  ctx.stroke();

  // planets, nudged apart so glyphs never stack
  const main = chart.planets.filter((p) => PLANET_SYMBOLS[p.name]).sort((a, b) => a.longitude - b.longitude);
  const placed: number[] = [];
  for (const p of main) {
    let lon = p.longitude;
    for (const q of placed) if (Math.abs(lon - q) < 8) lon = q + 8;
    placed.push(lon);
    const pos = at(lon, r * 0.64);
    ctx.fillStyle = ["Sun", "Moon"].includes(p.name) ? PINK : DARK;
    ctx.font = `700 ${Math.round(r * 0.11)}px ${fam}`;
    ctx.fillText(glyph(PLANET_SYMBOLS[p.name]), pos.x, pos.y);
  }
}

async function drawCard(chart: ChartData, big3: { sun: string; moon: string; rising: string }, pills: string[]): Promise<Blob | null> {
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

  const foil = await loadImage("/brand/holographic.jpg");
  if (foil) {
    const s = Math.max(W / foil.width, H / foil.height);
    ctx.drawImage(foil, (W - foil.width * s) / 2, (H - foil.height * s) / 2, foil.width * s, foil.height * s);
  } else {
    ctx.fillStyle = "#FFE0F0";
    ctx.fillRect(0, 0, W, H);
  }
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 8;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = DARK;
  ctx.font = `800 60px ${fam}`;
  ctx.fillText("my szn", 96, 170);
  ctx.font = `700 34px ${fam}`;
  ctx.fillText("MY BIG THREE", 96, 268);

  const lines = [
    { g: "☉", t: `${big3.sun.toLowerCase()} sun` },
    { g: "☽", t: `${big3.moon.toLowerCase()} moon` },
    { g: "↑", t: `${big3.rising.toLowerCase()} rising` },
  ];
  // step the type down until the longest line ("sagittarius rising") fits inside the frame
  let size = 104;
  for (; size > 60; size -= 4) {
    ctx.font = `800 ${size}px ${fam}`;
    if (Math.max(...lines.map((l) => ctx.measureText(l.t).width)) <= W - 96 - 120 - 80) break;
  }
  let y = 400;
  for (const l of lines) {
    ctx.font = `800 ${size}px ${fam}`;
    ctx.fillStyle = PINK;
    ctx.fillText(glyph(l.g), 96, y);
    ctx.fillStyle = DARK;
    ctx.fillText(l.t, 96 + 120, y);
    y += 124;
  }

  drawWheel(ctx, chart, W / 2, 1150, 340, fam);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 34px ${fam}`;
  let py = 1540;
  for (const p of pills) {
    const tw = ctx.measureText(p).width;
    ctx.fillStyle = DARK;
    ctx.beginPath();
    ctx.roundRect(96, py, tw + 64, 66, 33);
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

export default function AstroShareButton({
  chart,
  big3,
  pills,
}: {
  chart: ChartData;
  big3: { sun: string; moon: string; rising: string };
  pills: string[];
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const save = async () => {
    if (busy) return;
    setBusy(true);
    setNote("");
    try {
      const blob = await drawCard(chart, big3, pills);
      if (!blob) throw new Error("no canvas");
      const file = new File([blob], `my-big-three-${big3.sun}-${big3.moon}-${big3.rising}.png`.toLowerCase(), { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "my big three" });
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
        {busy ? "making your card..." : "save my big three card ✦"}
      </button>
      {note && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>{note}</span>}
    </div>
  );
}
