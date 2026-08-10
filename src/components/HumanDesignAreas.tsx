"use client";

import Link from "next/link";
import { composeAreaDesignNatal } from "@/lib/life-area-design";
import type { HumanDesignData } from "@/types/human-design";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The per-area "how you operate" layer of the Human Design chart: the same depth the astrology
// life-area guide gives, read from her design instead of her placements. Each area is a native
// <details> accordion so the page literally opens up rather than becoming an endless scroll.
//
// Paid, to match the astrology per-area guide: a full-access member (monthly/vip) sees the readings;
// everyone else sees the locked list and an upgrade prompt. The free chart above (bodygraph, type,
// authority, profile, centres) stays the hook.
const AREAS: { id: string; label: string; hook: string }[] = [
  { id: "career", label: "business & career", hook: "how you're built to work, decide and be seen" },
  { id: "money", label: "money", hook: "how income is actually meant to arrive for you" },
  { id: "relationships", label: "love & relationships", hook: "how you connect, decide and let people in" },
  { id: "health-body", label: "health & body", hook: "how your energy is built to run and recover" },
  { id: "purpose", label: "purpose", hook: "how the right direction is meant to find you" },
  { id: "confidence", label: "confidence", hook: "why self-trust holds or collapses for you" },
  { id: "mindset", label: "mindset", hook: "what your mind is for, and what it isn't" },
];

export default function HumanDesignAreas({ hd, unlocked }: { hd: HumanDesignData; unlocked: boolean }) {
  if (!unlocked) {
    return (
      <div
        style={{
          background: "var(--dark)",
          borderRadius: 14,
          padding: "28px 24px",
          color: "#fff",
        }}
      >
        <div style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
          your Human Design, area by area.
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255,255,255,0.75)", maxWidth: 520, marginBottom: 8 }}>
          Your chart above is who you are. Inside MY SZN it opens all the way up: how you&apos;re
          built to operate in business, money, love, health, purpose, confidence and mindset, each
          read through your type, your authority and the exact gates you were born with.
        </p>
        <ul style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, margin: "0 0 18px", paddingLeft: 18 }}>
          {AREAS.map((a) => (
            <li key={a.id}>
              <strong style={{ color: "#fff", fontWeight: 600 }}>{a.label}</strong> · {a.hook}
            </li>
          ))}
        </ul>
        <Link
          href="/membership"
          style={{
            display: "inline-block",
            background: "var(--pink)",
            color: "#fff",
            padding: "12px 22px",
            borderRadius: 999,
            textDecoration: "none",
            fontWeight: 600,
            fontFamily: poppins,
          }}
        >
          unlock it with MY SZN
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {AREAS.map((a) => {
        const reading = composeAreaDesignNatal(a.id, hd);
        if (!reading) return null;
        const topGates = reading.gates.slice(0, 5);
        return (
          <details
            key={a.id}
            style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, padding: "16px 18px" }}
          >
            <summary style={{ cursor: "pointer", listStyle: "none" }}>
              <span style={{ fontFamily: poppins, fontSize: 17, fontWeight: 700 }}>{a.label}</span>
              <span style={{ display: "block", fontSize: 13, opacity: 0.6, marginTop: 2 }}>{a.hook}</span>
            </summary>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={eyebrow}>how you operate · {reading.strategy.label}</div>
                <p style={body}>{reading.strategy.body}</p>
              </div>
              <div>
                <div style={eyebrow}>how you decide here · {reading.authority.label}</div>
                <p style={body}>{reading.authority.body}</p>
              </div>

              {topGates.length > 0 && (
                <div>
                  <div style={eyebrow}>your gates here</div>
                  <p style={{ ...body, opacity: 0.6, marginBottom: 8 }}>{reading.gatesIntro}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {topGates.map((g) => (
                      <div key={g.gate} style={{ borderLeft: "2px solid var(--pink)", paddingLeft: 12 }}>
                        <div style={{ fontFamily: poppins, fontSize: 13.5, fontWeight: 700 }}>
                          gate {g.gate} · {g.name}
                        </div>
                        <div style={{ fontSize: 13.5, lineHeight: 1.55, opacity: 0.85 }}>{g.lens}</div>
                        {g.shadow && g.gift && (
                          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>
                            the trap: {g.shadow.toLowerCase()} → the move: {g.gift.toLowerCase()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}

const eyebrow: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: 1.6,
  fontSize: 10,
  opacity: 0.5,
  marginBottom: 4,
  fontFamily: poppins,
  fontWeight: 700,
};

const body: React.CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.65,
  margin: 0,
};
