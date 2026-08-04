"use client";

import { useEffect, useRef, useState } from "react";
import { meditationForSign } from "@/lib/meditations";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The season's meditation, on the dashboard for every member. Renders nothing at all for a season
// that has no meditation yet, so a quiet season never shows an empty player.
//
// Duration and progress come from the audio element itself rather than from stored metadata, so
// they can never disagree with the actual file.
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SeasonMeditation({ sign }: { sign: string }) {
  const meditation = meditationForSign(sign);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(NaN);

  // Reset if the season changes underneath the component, so a stale player can't keep playing
  // last season's audio behind a new heading.
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(NaN);
  }, [meditation?.slug]);

  if (!meditation) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const scrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(duration)) return;
    const next = (Number(e.target.value) / 100) * duration;
    el.currentTime = next;
    setCurrent(next);
  };

  const progress = Number.isFinite(duration) && duration > 0 ? (current / duration) * 100 : 0;

  return (
    <section className="px-5 md:px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="tag mb-3" style={{ color: "var(--pink)" }}>
          this szn&apos;s meditation
        </div>

        <h2
          style={{
            fontFamily: poppins,
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.1,
            color: "#fff",
            marginBottom: 12,
          }}
        >
          {meditation.title.toLowerCase()}
          <span className="pk">.</span>
        </h2>

        <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.75)", maxWidth: 620, marginBottom: 18 }}>
          {meditation.purpose}
        </p>

        <div className="flex flex-col gap-3" style={{ maxWidth: 620, marginBottom: 26 }}>
          {meditation.intro.map((para, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.6)" }}>
              {para}
            </p>
          ))}
        </div>

        {/* Player */}
        <div className="p-6" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <audio
            ref={audioRef}
            src={meditation.src}
            preload="metadata"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            onEnded={() => setPlaying(false)}
          />

          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              aria-label={playing ? "pause meditation" : "play meditation"}
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "var(--pink)",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              {playing ? "❚❚" : "▶"}
            </button>

            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={scrub}
                aria-label="scrub through the meditation"
                style={{ width: "100%", accentColor: "var(--pink)", cursor: "pointer" }}
              />
              <div
                className="flex justify-between"
                style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4, fontVariantNumeric: "tabular-nums" }}
              >
                <span>{formatTime(current)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* How to use it, short on purpose */}
        <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", maxWidth: 620 }}>
          {meditation.howTo.map((line) => (
            <li
              key={line}
              style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", paddingLeft: 16, position: "relative", marginBottom: 6 }}
            >
              <span style={{ position: "absolute", left: 0, color: "var(--pink)" }}>·</span>
              {line}
            </li>
          ))}
        </ul>

        <a
          href={meditation.src}
          download
          className="no-underline"
          style={{
            display: "inline-block",
            marginTop: 18,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--pink)",
          }}
        >
          download for offline →
        </a>
      </div>
    </section>
  );
}
