"use client";

import { useState } from "react";
import { HoloStar } from "@/components/eleven-eleven/Shared";
import { pp } from "@/lib/eleven-eleven-hub";

// "A message from the universe": tap to pull one, tap again for another. Written in Betty's voice
// for the 11/11 portal; no message repeats until she has seen them all.
const MESSAGES = [
  "Stop asking if you're allowed. You were born with the permission slip, babe. Sign it.",
  "The thing you keep almost doing? Do it before 11:11 tomorrow. I'll handle the rest.",
  "You're not too much. You're exactly the amount the right people have been waiting for.",
  "That number you're scared to charge is the number I've already got your name on.",
  "Every sign you've been seeing was me. Yes, the 11:11s too. You're on the right path.",
  "Leave her on this side of the door. She kept you safe, and she's off duty now.",
  "Your people are looking for you as hard as you're looking for them. Go where they gather.",
  "Wish bigger than that. Bigger. Biggerrrr. I'm literally taking orders tonight.",
  "The old timeline is loud this week because it knows you're leaving. Let it shout.",
  "Pleasure counts. Rest counts. Joy counts. Put them on the list, babe.",
  "Say it out loud. Words are how I find your order in the queue.",
];

export default function UniverseMessage() {
  const [seen, setSeen] = useState<number[]>([]);
  const current = seen.length ? seen[seen.length - 1] : null;

  const pull = () => {
    const left = MESSAGES.map((_, i) => i).filter((i) => !seen.includes(i));
    const pool = left.length ? left : MESSAGES.map((_, i) => i).filter((i) => i !== current);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setSeen((s) => (left.length ? [...s, next] : [next]));
  };

  return (
    <section className="holo-edge bg-glitter" style={{ position: "relative", borderRadius: 26, overflow: "hidden", color: "#fff", padding: "clamp(26px, 4.4vw, 48px)", textAlign: "center" }}>
      <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>📩 a message from the universe</span>
      {current === null ? (
        <>
          <div className="display" style={{ fontSize: "clamp(34px, 5.4vw, 62px)", lineHeight: 1, marginTop: 18, color: "#fff" }}>you&apos;ve got mail, witch.</div>
          <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "12px auto 0", maxWidth: 480 }}>Take a breath, think of your wish, then tap to open the message that&apos;s meant for you tonight. 🕯️</p>
        </>
      ) : (
        <div key={current} className="szn-holo" style={{ margin: "22px auto 0", maxWidth: 620, border: "2px solid #fff", borderRadius: 22, boxShadow: "8px 8px 0 var(--pink)", padding: "26px 24px", color: "var(--dark)", animation: "szn-bub 0.4s ease, szn-holo 40s ease-in-out infinite alternate" }}>
          <div style={{ fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>✨ from: the universe · to: you</div>
          <div className="display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", lineHeight: 1.12, marginTop: 10 }}>{MESSAGES[current]}</div>
        </div>
      )}
      <button onClick={pull} style={{ marginTop: 24, display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 26px", border: "2px solid #fff", boxShadow: "5px 5px 0 #fff", cursor: "pointer" }}>
        {current === null ? "💌 open my message" : "🔮 pull another"}
      </button>
      <HoloStar size={46} style={{ top: 20, right: 26 }} />
      <HoloStar size={30} style={{ bottom: 26, left: 30 }} />
    </section>
  );
}
