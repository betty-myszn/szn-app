import { ImageResponse } from "next/og";

// Generated rather than a checked-in PNG so it can never drift from the brand colours, and so there
// is no multi-megabyte image in the repo. Applies to every route that does not define its own.
export const alt = "MY SZN, the astrology-led membership for ambitious women";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Drawn rather than typed. A decorative glyph like ✦ is not in the default font ImageResponse uses,
// so it triggers a dynamic font fetch that fails offline and renders a tofu box on the card.
function Dot() {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: 8,
        background: "#FF2D87",
        alignSelf: "center",
      }}
    />
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#FF2D87",
            marginBottom: 34,
          }}
        >
          astrology membership for women
        </div>

        <div style={{ display: "flex", fontSize: 128, fontWeight: 800, letterSpacing: -4 }}>
          <span style={{ color: "#ffffff" }}>my</span>
          <span style={{ color: "#FF2D87" }}>szn</span>
        </div>

        <div
          style={{
            fontSize: 34,
            color: "rgba(255,255,255,0.72)",
            marginTop: 30,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Stop guessing. Start becoming her.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            gap: 18,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>free birth chart</span>
          <Dot />
          <span>live coaching</span>
          <Dot />
          <span>community</span>
        </div>
      </div>
    ),
    size
  );
}
