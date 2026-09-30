"use client";

import { useState } from "react";
import SznWheel from "@/components/SznWheel";
import { AREA_FLAVOUR, eraName, pickList, wheelHouse } from "@/lib/szn-picks";

// "i'm in my rich girl + main character era": a story-sized card of her season, saved straight to
// her camera roll (or the share sheet on a phone). Every member who posts one is a stranger seeing
// MY SZN from someone they already follow.

const W = 1080;
const H = 1920;

function poppinsFamily(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-poppins").trim();
  return v || "Poppins, sans-serif";
}

function holo(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, stops: string[]) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
  return g;
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

async function drawCard(picks: string[], sign: string): Promise<Blob | null> {
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

  // Foil ground
  ctx.fillStyle = holo(ctx, 0, 0, W, H, ["#FFD1E8", "#E8DFFE", "#FFFFFF", "#FFB3D9", "#C8B4F8", "#FFF0F7", "#FF8CC6", "#E8DFFE"]);
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 8;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // Brand
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `800 64px ${fam}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("my", 96, 170);
  const myW = ctx.measureText("my ").width;
  ctx.fillStyle = "#FF2D87";
  ctx.fillText("szn", 96 + myW, 170);

  // Season sticker
  ctx.save();
  ctx.translate(W - 250, 140);
  ctx.rotate((6 * Math.PI) / 180);
  ctx.fillStyle = "#FF2D87";
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(-150, -46, 300, 92, 46);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = `800 38px ${fam}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${sign.toUpperCase()} SZN`, 0, 2);
  ctx.restore();

  // Wheel
  const cx = W / 2;
  const cy = 700;
  const R = 330;
  const r = 138;
  const lit = new Map<number, string>();
  for (const id of picks) if (!lit.has(wheelHouse(id))) lit.set(wheelHouse(id), id);
  const hot = holo(ctx, cx - R, cy - R, cx + R, cy + R, ["#FF2D87", "#FF8CC6", "#C8B4F8", "#FF2D87", "#FFB3D9"]);
  ctx.setLineDash([6, 18]);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#FF2D87";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, R + 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  for (let i = 0; i < 12; i++) {
    const h = i + 1;
    // Chart angles run counterclockwise from the ascendant at 180°. Canvas angles run clockwise
    // (y points down), so each chart angle is drawn at its negative.
    const a0 = Math.PI + (i * Math.PI) / 6;
    const a1 = a0 + Math.PI / 6;
    ctx.beginPath();
    ctx.arc(cx, cy, R, -a0, -a1, true);
    ctx.arc(cx, cy, r, -a1, -a0, false);
    ctx.closePath();
    const on = lit.get(h);
    ctx.fillStyle = on ? hot : h % 2 ? "#FFF0F7" : "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    ctx.stroke();
    const mid = a0 + Math.PI / 12;
    const tx = cx + ((R + r) / 2) * Math.cos(mid);
    const ty = cy - ((R + r) / 2) * Math.sin(mid);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (on) {
      ctx.font = `800 56px ${fam}`;
      ctx.lineWidth = 9;
      ctx.strokeStyle = "#FF2D87";
      ctx.strokeText(AREA_FLAVOUR[on]?.glyph ?? "✦", tx, ty);
      ctx.fillStyle = "#fff";
      ctx.fillText(AREA_FLAVOUR[on]?.glyph ?? "✦", tx, ty);
    } else {
      ctx.font = `700 30px ${fam}`;
      ctx.fillStyle = "#555";
      ctx.fillText(String(h), tx, ty);
    }
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = holo(ctx, cx - r, cy - r, cx + r, cy + r, ["#FFD1E8", "#E8DFFE", "#FFFFFF", "#FFB3D9", "#C8B4F8"]);
  ctx.fill();
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Era
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `700 40px ${fam}`;
  ctx.fillText("I'M IN MY", 96, 1200);
  // The era name always shows in full: the type steps down until it fits in three lines, and the
  // closing "era" is set in pink on the last line.
  const era = eraName(picks);
  let size = 118;
  let lines: string[] = [];
  for (; size >= 64; size -= 6) {
    ctx.font = `800 ${size}px ${fam}`;
    lines = wrap(ctx, era, W - 192);
    if (lines.length <= 3) break;
  }
  let y = 1240 + size;
  lines.forEach((l, i) => {
    const last = i === lines.length - 1;
    const head = last ? l.replace(/ ?era$/, "") : l;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillText(head, 96, y);
    if (last) {
      ctx.fillStyle = "#FF2D87";
      ctx.fillText(head ? " era" : "era", 96 + ctx.measureText(head).width, y);
    }
    y += size;
  });

  // Foot
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `700 34px ${fam}`;
  const foot = wrap(ctx, `built around ${pickList(picks)}`, W - 192);
  let fy = H - 170 - (foot.length - 1) * 44;
  for (const l of foot) {
    ctx.fillText(l, 96, fy);
    fy += 44;
  }
  ctx.font = `800 36px ${fam}`;
  ctx.fillStyle = "#FF2D87";
  ctx.fillText("ITSMYSZN.COM", 96, H - 100);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export default function SznShareCard({ picks, sign, onClose }: { picks: string[]; sign: string; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const era = eraName(picks).replace(/ era$/, "");

  const save = async () => {
    if (busy) return;
    setBusy(true);
    setNote("");
    try {
      const blob = await drawCard(picks, sign);
      if (!blob) throw new Error("no canvas");
      const file = new File([blob], `my-${sign.toLowerCase()}-szn.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `my ${sign.toLowerCase()} szn` });
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
    <div className="szn-sheet" role="dialog" aria-modal="true" aria-label="Share your season" onClick={onClose}>
      <div className="flex flex-col items-center gap-3" style={{ width: "100%", maxWidth: 340 }} onClick={(e) => e.stopPropagation()}>
        <div className="szn-card szn-holo">
          <span className="szn-sticker" style={{ left: "auto", right: -8, top: 16, transform: "rotate(6deg)" }}>
            {sign} szn
          </span>
          <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 800, fontSize: 16 }}>
            my <span className="pk">szn</span>
          </div>
          <div style={{ width: "62%", alignSelf: "center" }}>
            <SznWheel picks={picks} showCount={false} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>i&apos;m in my</div>
            <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 800, fontSize: 26, lineHeight: 0.95, letterSpacing: "-0.03em", textTransform: "lowercase" }}>
              {era} <span className="pk">era</span>
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            built around {pickList(picks)} · itsmyszn.com
          </div>
        </div>
        <button type="button" className="szn-cta szn-holo-hot" style={{ fontSize: 15, padding: 13 }} onClick={save} disabled={busy}>
          {busy ? "making your card…" : "save to my phone ✦"}
        </button>
        {note && <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0 }}>{note}</p>}
        <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
          close
        </button>
      </div>
    </div>
  );
}
