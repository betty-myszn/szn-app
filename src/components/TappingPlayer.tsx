"use client";

import { useEffect, useState } from "react";

/** One tapping session: a slice of a workshop replay, played with YouTube's own start and end so
 *  she lands on the first tapping line and it stops at "and so it is". Like ReplayPlayer, it never
 *  knows the video until the server has checked she's a member. */
export default function TappingPlayer({ slug, title, poster }: { slug: string; title: string; poster: string }) {
  const [clip, setClip] = useState<{ youtubeId: string; start: number; end: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/tapping/clip?id=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled) { if (d?.youtubeId) setClip(d); else setFailed(true); } })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#000", borderRadius: 14, overflow: "hidden", border: "2px solid #000" }}>
      {playing && clip ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${clip.youtubeId}?start=${clip.start}&end=${clip.end}&autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => clip && setPlaying(true)}
          disabled={!clip}
          aria-label={`Play ${title}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", padding: 0, border: 0, cursor: clip ? "pointer" : "default", background: "#000" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          {failed ? (
            <span style={{ position: "absolute", left: 16, right: 16, bottom: 16, padding: "10px 14px", background: "#fff", color: "#000", fontSize: 13, fontWeight: 600, borderRadius: 10 }}>
              This session didn&apos;t load. Refresh the page to try again.
            </span>
          ) : (
            <span
              aria-hidden="true"
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 76, height: 76, borderRadius: "50%", background: "var(--pink)", border: "3px solid #fff", display: "grid", placeItems: "center", opacity: clip ? 1 : 0.6 }}
            >
              <span style={{ width: 0, height: 0, marginLeft: 6, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "22px solid #fff" }} />
            </span>
          )}
        </button>
      )}
    </div>
  );
}
