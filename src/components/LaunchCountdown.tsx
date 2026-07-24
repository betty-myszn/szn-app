"use client";

import { useEffect, useState } from "react";
import { ENROLMENT_OPENS, useEnrolmentOpen } from "@/lib/enrolment";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Shared with the CTAs so the countdown and the buttons can never disagree about whether the
// doors are open, see src/lib/enrolment.ts.
const LAUNCH = ENROLMENT_OPENS;

function getTimeLeft() {
  const now = new Date();
  const diff = LAUNCH.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, launched: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    launched: false,
  };
}

export default function LaunchCountdown({ variant = "dark" }: { variant?: "dark" | "pink" | "inline" }) {
  const [time, setTime] = useState(getTimeLeft);
  const enrolmentOpen = useEnrolmentOpen();

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // "WE'RE LIVE." must mean the doors are actually open, not merely that the launch date has
  // passed. Deciding that from the date alone was a second source of truth: once the date slipped
  // by, this claimed live while the CTAs (which read the enrolment flag) still showed a waitlist.
  // Both now hang off the same switch. When the date has passed but enrolment isn't open, there's
  // nothing truthful left to count down to, so render nothing rather than a stale countdown.
  if (enrolmentOpen) {
    return (
      <div className="text-center py-4">
        <div style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, color: variant === "dark" ? "#fff" : "var(--dark)" }}>
          WE&apos;RE LIVE.
        </div>
      </div>
    );
  }

  // Doors shut and the launch moment already gone: a countdown to a past date would read as
  // "00 00 00 00", so show nothing at all and let the surrounding waitlist copy speak.
  if (time.launched) return null;

  const isDark = variant === "dark";
  const isPink = variant === "pink";
  const isInline = variant === "inline";

  const boxBg = isDark
    ? "rgba(255,255,255,0.06)"
    : isPink
    ? "rgba(255,255,255,0.2)"
    : "rgba(255,45,135,0.08)";
  const boxBorder = isDark
    ? "1px solid rgba(255,255,255,0.1)"
    : isPink
    ? "1px solid rgba(255,255,255,0.3)"
    : "1px solid rgba(255,45,135,0.15)";
  const numColor = isDark || isPink ? "#fff" : "var(--dark)";
  const labelColor = isDark
    ? "rgba(255,255,255,0.4)"
    : isPink
    ? "rgba(255,255,255,0.7)"
    : "var(--pink)";

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
          <div style={{
            fontFamily: poppins,
            fontSize: isInline ? 20 : 28,
            fontWeight: 800,
            color: numColor,
            lineHeight: 1,
            letterSpacing: "-1px",
          }}>
            {String(u.value).padStart(2, "0")}
          </div>
          <div style={{
            fontSize: isInline ? 8 : 9,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: labelColor,
            marginTop: 4,
          }}>
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
