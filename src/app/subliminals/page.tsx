import type { Metadata } from "next";
import { allSubliminals } from "@/lib/subliminals";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export const metadata: Metadata = {
  title: "Subliminals",
  robots: { index: false },
};

// The members' subliminal library. Access is enforced by the proxy (FULL_PLATFORM), so this page
// only lists lib/subliminals.ts, and each one plays right on its card since there's nothing more
// to read before pressing play.
export default function SubliminalsPage() {
  const subliminals = allSubliminals();

  return (
    <>
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 48 }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>
            your library
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            subliminals<span className="pk">.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.75)", maxWidth: 620 }}>
            Your subliminals live here, bb: affirmations tucked under the sound so they slip past the part of you that argues back and land straight in your subconscious. Pop one on while you work, cook or wind down, and play it over and overrr, because the more you listen the deeper it goes.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 48, paddingBottom: 56 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {subliminals.map((s) => (
            <div
              key={s.slug}
              id={s.slug}
              className="flex flex-col"
              style={{ borderRadius: 14, background: "#fff", border: "2px solid var(--purple)", overflow: "hidden", color: "#3C2A70" }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "var(--dark)" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${s.youtubeId}?rel=0&modestbranding=1`}
                  title={s.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
              <div className="flex flex-col" style={{ padding: 24, flex: 1 }}>
                <div className="tag mb-3" style={{ color: "var(--pink)" }}>
                  {s.theme}
                </div>
                <h2 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{s.title.toLowerCase()}</h2>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, opacity: 0.75 }}>{s.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
