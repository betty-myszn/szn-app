import { ImageResponse } from "next/og";
import { OFFERS, type OfferSlug } from "@/lib/offers";

// The share card for each offer page, so a link to the Retreat or Rich B*tch Rising doesn't look
// identical to every other MY SZN link on Instagram and WhatsApp. Each route's opengraph-image.tsx
// calls this. No emoji or decorative glyphs: they aren't in ImageResponse's default font and fall
// back to a network font fetch that renders a tofu box when it fails.

export const OG_SIZE = { width: 1200, height: 630 };

const PALETTE: Record<OfferSlug | "reports", { bg: string; ink: string; accent: string; kicker: string; tagline: string }> = {
  "rich-btch-rising": { bg: "#1a1a1a", ink: "#ffffff", accent: "#FF2D87", kicker: "personalised money report", tagline: "your chart wants you RICH, babe" },
  "bad-btch-report": { bg: "#FF2D87", ink: "#1a1a1a", accent: "#ffffff", kicker: "personalised confidence report", tagline: "find out what kind of baddie you are" },
  "baddie-coven": { bg: "#C8B4F8", ink: "#1a1a1a", accent: "#FF2D87", kicker: "creative cosmic membership", tagline: "welcome to the clubhouse, witch" },
  mastermind: { bg: "#1a1a1a", ink: "#ffffff", accent: "#FF2D87", kicker: "90-day mastermind", tagline: "you didn't come here to play small" },
  retreat: { bg: "#FF2D87", ink: "#1a1a1a", accent: "#ffffff", kicker: "in real life", tagline: "all of you, in real life" },
  book: { bg: "#E8DFFE", ink: "#1a1a1a", accent: "#FF2D87", kicker: "out now on amazon", tagline: "becoming her, in print" },
  reports: { bg: "#C8B4F8", ink: "#1a1a1a", accent: "#FF2D87", kicker: "personalised astrology reports", tagline: "your chart, in writing" },
};

export function offerOgImage(key: OfferSlug | "reports") {
  const p = PALETTE[key];
  const name = key === "reports" ? "MY SZN Reports" : OFFERS[key].name;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: p.bg, padding: "70px 80px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: p.accent }} />
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 6, textTransform: "uppercase", color: p.accent }}>{p.kicker}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95, color: p.ink }}>{name}</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: p.accent, marginTop: 26 }}>{p.tagline}</div>
        </div>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
          <span style={{ color: p.ink }}>my</span>
          <span style={{ color: p.accent === "#ffffff" ? "#ffffff" : "#FF2D87" }}>szn</span>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
