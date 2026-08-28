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
      <section className="px-5 md:px-8" style={{ borderBottom: "var(--border)", paddingTop: 32, paddingBottom: 32 }}>
        <div className="max-w-6xl mx-auto">
          <Link
            href={href}
            className="block"
            style={{ border: "var(--border)", background: "var(--lav-light)", textDecoration: "none" }}
          >
            {/* The cover runs the full width of the card: a class that has just landed is the thing
                she should see the moment the page loads, so it is sized like a feature rather than
                a thumbnail. Capped in height so a wide screen doesn't turn it into a billboard. */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                maxHeight: 460,
                background: replay.coverImage ? "#211d2c" : "linear-gradient(135deg, var(--pink), var(--lav))",
                borderBottom: "var(--border)",
              }}
            >
              {replay.coverImage && (
                <Image
                  src={replay.coverImage}
                  alt={replay.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1150px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              )}
              <span
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#fff",
                  background: "var(--pink)",
                  padding: "7px 14px",
                }}
              >
                ✦ new replay
              </span>
              {/* Bottom right rather than dead centre: every cover carries its own title artwork
                  across the middle, and a centred badge lands right on top of it. */}
              <span
                style={{
                  position: "absolute",
                  right: 20,
                  bottom: 20,
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  border: "3px solid rgba(255,255,255,0.92)",
                  background: "rgba(26,26,26,0.55)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontSize: 24,
                  paddingLeft: 5,
                }}
              >
                ▶
              </span>
            </div>

            <div className="p-7 md:p-10">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3C2A70", marginBottom: 12 }}>
                {replay.label}
              </div>
              <h2
                style={{
                  fontFamily: poppins,
                  fontSize: "clamp(28px, 4.6vw, 46px)",
                  fontWeight: 800,
                  letterSpacing: "-1.2px",
                  lineHeight: 1.06,
                  color: "#2E1C63",
                  marginBottom: 14,
                }}
              >
                {replay.title}
              </h2>
              <p style={{ fontSize: 16, color: "var(--grey)", lineHeight: 1.75, maxWidth: 640, marginBottom: 22 }}>
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
