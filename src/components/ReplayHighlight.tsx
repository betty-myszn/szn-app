"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  // The vault renders one card per finished class with the workshop id as its anchor, so this
  // lands on THIS replay rather than the top of the page and she can press play without hunting.
  const href = `/events/replays#${replay.id}`;

  if (fresh) {
    return (
      <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <Link
            href={href}
            className="flex flex-col md:flex-row"
            style={{ border: "var(--border)", background: "var(--lav-light)", textDecoration: "none" }}
          >
            {/* The cover, so the new replay reads as something to press play on rather than
                another block of text. Whole card is the link, the play badge just says so. */}
            <div
              className="w-full md:w-1/2"
              style={{
                position: "relative",
                aspectRatio: "16 / 9",
                background: replay.coverImage ? "#211d2c" : "linear-gradient(135deg, var(--pink), var(--lav))",
                borderBottom: "var(--border)",
                flexShrink: 0,
              }}
            >
              {replay.coverImage && (
                <Image
                  src={replay.coverImage}
                  alt={replay.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              )}
              {/* Bottom right rather than dead centre: every cover carries its own title artwork
                  across the middle, and a centred badge lands right on top of it. */}
              <span
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 16,
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.92)",
                  background: "rgba(26,26,26,0.55)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontSize: 18,
                  paddingLeft: 4,
                }}
              >
                ▶
              </span>
            </div>

            <div className="p-7 md:p-9">
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
                The replay just landed in the vault, so you can watch the whole thing back in your own time, as many times as you like.
              </p>
              <span className="btn-pink" style={{ pointerEvents: "none" }}>
                ▶ watch the replay
              </span>
            </div>
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
          href={href}
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
