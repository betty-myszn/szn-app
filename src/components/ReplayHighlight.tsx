"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { latestReplay, isReplayFresh } from "@/lib/workshops";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The replay spotlight on the season home. For the first few days after a class is uploaded it
// runs as a bold "new replay" feature; once that window passes it settles into a slim standing
// banner into the vault, so the home page always points at the replays without shouting forever.
export default function ReplayHighlight() {
  // Mount guard: the fresh-vs-settled decision reads the clock, which would differ between the
  // server render and the client render, so we only decide once we're on the client.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  if (now === null) return null;

  const replay = latestReplay();
  if (!replay || !replay.replayYoutubeId) return null;

  const fresh = isReplayFresh(replay, now);

  if (fresh) {
    return (
      <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <Link
            href="/events/replays"
            className="block p-7 md:p-9"
            style={{ border: "var(--border)", background: "var(--lav-light)", textDecoration: "none" }}
          >
            <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 12 }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#fff",
                  background: "var(--pink)",
                  padding: "5px 11px",
                }}
              >
                ✦ new replay
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3C2A70" }}>
                {replay.label}
              </span>
            </div>
            <h2
              style={{
                fontFamily: poppins,
                fontSize: "clamp(22px, 3.5vw, 30px)",
                fontWeight: 800,
                letterSpacing: "-0.8px",
                lineHeight: 1.12,
                color: "#2E1C63",
                marginBottom: 10,
              }}
            >
              {replay.title}
            </h2>
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.75, maxWidth: 560, marginBottom: 18 }}>
              The replay just landed in the vault. Missed it live or want to go again? Watch the whole thing back in your own time.
            </p>
            <span className="btn-pink" style={{ pointerEvents: "none" }}>
              ▶ watch the replay
            </span>
          </Link>
        </div>
      </section>
    );
  }

  // Settled state: the standing banner into the vault.
  return (
    <section className="px-5 md:px-8 py-6" style={{ borderBottom: "var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <Link
          href="/events/replays"
          className="flex items-center justify-between gap-4 flex-wrap p-5 md:px-7"
          style={{ border: "var(--border)", background: "var(--lav-light)", textDecoration: "none" }}
        >
          <span style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, letterSpacing: "-0.4px", color: "#2E1C63" }}>
            ✦ catch up on past workshops in the replay vault
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>
            watch replays →
          </span>
        </Link>
      </div>
    </section>
  );
}
