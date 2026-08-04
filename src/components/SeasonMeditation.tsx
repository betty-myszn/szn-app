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
  // Betty's read is slightly quick for a meditation, so this opens a touch slower than recorded.
  // preservesPitch keeps her voice at its natural pitch rather than dropping it, which is what
  // makes slowed speech sound wrong. Adjustable, because the right pace is personal.
  const [rate, setRate] = useState(0.9);
  // Surfaced in the UI. A meditation that silently refuses to play is the worst possible failure,
  // so anything that goes wrong says so rather than leaving a dead button.
  const [error, setError] = useState<string | null>(null);

  // Reset if the season changes underneath the component, so a stale player can't keep playing
  // last season's audio behind a new heading.
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(NaN);
  }, [meditation?.slug]);

  // Applied on every change and after the source loads, since setting playbackRate before the
  // element has metadata is silently ignored in some browsers.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = rate;
    // Non-standard on older Safari, hence the cast rather than a hard dependency on it.
    (el as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
  }, [rate, meditation?.slug]);

  if (!meditation) return null;

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      return;
    }
    setError(null);
    try {
      // Must stay inside the user gesture, so nothing is awaited before this call.
      await el.play();
      // Reapplied here because several browsers reset playbackRate when playback starts.
      el.playbackRate = rate;
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      setError(
        name === "NotAllowedError"
          ? "Your browser blocked playback. Tap play once more, or check that this site is allowed to play sound."
          : "That did not start. Try reloading the page, and if it keeps happening tell Betty which browser you are on."
      );
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
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
              e.currentTarget.playbackRate = rate;
              (e.currentTarget as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
            }}
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={(e) => {
              const code = e.currentTarget.error?.code;
              setError(
                code === 4
                  ? "This browser could not play that audio file."
                  : "The meditation could not load. Check your connection and reload."
              );
            }}
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

          {error && (
            <p role="alert" style={{ fontSize: 13, lineHeight: 1.7, color: "#FFD5E4", marginTop: 14 }}>
              {error}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
              pace
            </span>
            {[0.8, 0.9, 1].map((r) => (
              <button
                key={r}
                onClick={() => setRate(r)}
                aria-pressed={rate === r}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "5px 12px",
                  cursor: "pointer",
                  background: rate === r ? "var(--pink)" : "transparent",
                  color: rate === r ? "#fff" : "rgba(255,255,255,0.7)",
                  border: rate === r ? "1px solid var(--pink)" : "1px solid rgba(255,255,255,0.25)",
                }}
              >
                {r === 1 ? "normal" : `${r}×`}
              </button>
            ))}
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
