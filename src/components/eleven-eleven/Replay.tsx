import { pp } from "@/lib/eleven-eleven-hub";

// The 11/11 workshop replay, shown on the 11/11 hub and the coven home.
export const REPLAY_ID = "2H998HUkFSw";

export default function Replay({ compact = false }: { compact?: boolean }) {
  return (
    <section className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] items-center" style={{ borderRadius: 26, overflow: "hidden", color: "#fff", padding: "clamp(22px, 3.4vw, 38px)", gap: 24 }}>
      <div>
        <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🎥 the replay is here</span>
        <h2 className="display" style={{ fontSize: compact ? "clamp(32px, 4.6vw, 54px)" : "clamp(36px, 5.2vw, 62px)", lineHeight: 0.98, marginTop: 14, color: "#fff" }}>the 11/11 workshop replay.</h2>
        <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0", maxWidth: 460 }}>Missed it live, or want to go through the portal again? Light your candle, grab your journal and press play, babe. 🕯️</p>
        <a href={`https://youtu.be/${REPLAY_ID}`} target="_blank" rel="noreferrer" className="no-underline" style={{ display: "inline-block", marginTop: 18, background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 20px", border: "2px solid #fff" }}>watch on youtube →</a>
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", border: "2px solid #fff", borderRadius: 16, overflow: "hidden", background: "#000", boxShadow: "6px 6px 0 var(--pink)" }}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${REPLAY_ID}?rel=0`} title="11/11 workshop replay" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
      </div>
    </section>
  );
}
