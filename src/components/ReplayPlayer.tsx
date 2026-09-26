"use client";

import { useEffect, useState } from "react";

/** A workshop replay. It never knows the video until it asks the server, and the vault only
 *  renders it for a member, so a non-member's browser never even makes the request. */
export default function ReplayPlayer({ workshopId, title, poster }: { workshopId: string; title: string; poster?: string }) {
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  // With a poster, the workshop's own cover sits over the player until she taps play, rather
  // than YouTube's auto-picked frame. The tap loads the embed with autoplay so it's one click.
  const [playing, setPlaying] = useState(!poster);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/workshops/replay?id=${encodeURIComponent(workshopId)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled) { if (d?.youtubeId) setYoutubeId(d.youtubeId); else setFailed(true); } })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [workshopId]);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", marginTop: 18, background: "#000" }}>
      {!playing && poster ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play the ${title} replay`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", padding: 0, border: 0, cursor: "pointer", background: "#000" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <span
            aria-hidden="true"
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 72, height: 72, borderRadius: "50%", background: "var(--pink)", border: "2px solid #fff", display: "grid", placeItems: "center" }}
          >
            <span style={{ width: 0, height: 0, marginLeft: 6, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", borderLeft: "20px solid #fff" }} />
          </span>
        </button>
      ) : youtubeId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0${poster ? "&autoplay=1" : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : failed ? (
        <p style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", margin: 0, color: "#fff", fontSize: 13 }}>
          The replay didn&apos;t load. Refresh the page to try again.
        </p>
      ) : null}
    </div>
  );
}
