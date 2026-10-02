"use client";

import { useEffect, useState } from "react";
import { useDoors } from "@/lib/enrolment";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Counts down to the next door moment: while a door is open, to the moment it closes; while the
// doors are shut, to the moment the next one opens. Reads the same switch as the CTAs (see
// src/lib/enrolment.ts) so the countdown and the buttons can never disagree. Renders nothing before
// mount and nothing when there's no scheduled moment left to count to.

function split(diff: number) {
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function LaunchCountdown({ variant = "dark" }: { variant?: "dark" | "pink" | "inline" }) {
  const { ready, open, next } = useDoors();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!ready || now === null) return null;
  const target = open ? Date.parse(open.closesAt) : next ? Date.parse(next.opensAt) : null;
  if (target === null || target <= now) return null;
  const time = split(target - now);

  const isDark = variant === "dark";
  const isPink = variant === "pink";
  const isInline = variant === "inline";

  const boxBg = isDark ? "rgba(255,255,255,0.06)" : isPink ? "rgba(255,255,255,0.2)" : "rgba(255,45,135,0.08)";
  const boxBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : isPink ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,45,135,0.15)";
  const numColor = isDark || isPink ? "#fff" : "var(--dark)";
  const labelColor = isDark ? "rgba(255,255,255,0.4)" : isPink ? "rgba(255,255,255,0.7)" : "var(--pink)";

  const units = [
    { value: time.days, label: "days" },
    { value: time.hours, label: "hrs" },
    { value: time.minutes, label: "min" },
    { value: time.seconds, label: "sec" },
  ];

  return (
    <div className={`flex ${isInline ? "gap-2" : "gap-3"} justify-center`}>
      {units.map((u) => (
        <div
          key={u.label}
          className="flex flex-col items-center"
          style={{
            background: boxBg,
            border: boxBorder,
            padding: isInline ? "8px 12px" : "12px 16px",
            minWidth: isInline ? 52 : 64,
          }}
        >
          <div style={{ fontFamily: poppins, fontSize: isInline ? 20 : 28, fontWeight: 800, color: numColor, lineHeight: 1, letterSpacing: "-1px" }}>
            {String(u.value).padStart(2, "0")}
          </div>
          <div style={{ fontSize: isInline ? 8 : 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: labelColor, marginTop: 4 }}>
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
