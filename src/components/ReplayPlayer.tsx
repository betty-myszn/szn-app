"use client";

import { useEffect, useState } from "react";

/** A workshop replay. It never knows the video until it asks the server, and the vault only
 *  renders it for a member, so a non-member's browser never even makes the request. */
export default function ReplayPlayer({ workshopId, title }: { workshopId: string; title: string }) {
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

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
      {youtubeId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
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
