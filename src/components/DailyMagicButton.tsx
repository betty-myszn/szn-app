"use client";

import { useEffect, useState } from "react";
import { MAGIC_LABELS, magicForDate } from "@/lib/daily-magic";

const pp = "var(--font-poppins), Poppins, sans-serif";
const KEY = "myszn-daily-magic-opened";

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export default function DailyMagicButton() {
  const [open, setOpen] = useState(false);

  // Once she's opened today's magic it stays open for the rest of the day.
  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === todayKey()) setOpen(true);
    } catch {}
  }, []);

  const reveal = () => {
    setOpen(true);
    try {
      localStorage.setItem(KEY, todayKey());
    } catch {}
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={reveal}
        style={{ display: "block", width: "100%", marginTop: 16, background: "var(--dark)", color: "#fff", border: "none", cursor: "pointer", fontFamily: pp, fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "22px 18px", boxShadow: "6px 6px 0 var(--pink)" }}
      >
        🔮 give me my magic for today
      </button>
    );
  }

  const magic = magicForDate(new Date());
  return (
    <div style={{ marginTop: 16, background: "var(--dark)", color: "#fff", padding: "22px 22px 24px", boxShadow: "6px 6px 0 var(--pink)" }}>
      <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>{MAGIC_LABELS[magic.kind]}</div>
      <p style={{ fontFamily: pp, fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 800, lineHeight: 1.25, margin: "10px 0 0" }}>{magic.text}</p>
      <p style={{ fontSize: 14, fontWeight: 700, margin: "12px 0 0" }}>New magic lands tomorrow, babe. 💜</p>
    </div>
  );
}
