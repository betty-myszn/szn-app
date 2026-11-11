"use client";

import { useState } from "react";
import Link from "next/link";
import { MembersOnly, HoloStar, PortalNav } from "@/components/eleven-eleven/Shared";
import { card, sectionTitle, label, blackBtn, pp } from "@/lib/eleven-eleven-hub";

// Deep dive 01: what she needs to know about 11/11. The numbers flip over, the intuition channels
// are tappable, and the sky is laid out as the same cards the coven home uses.

const NUMBERS: [string, string, string][] = [
  ["1", "beginnings", "Number one. Going first, going solo, starting the thing you keep saying you'll start."],
  ["11", "the master number", "Intuition, illumination and your inner voice turned all the way up. Loud."],
  ["11/11", "the mirror", "Four ones standing side by side like a doorway. What you feel inside finally shows up outside."],
  ["2026", "a universal 1 year", "2 + 0 + 2 + 6 = 10, and 1 + 0 = 1. This whole year has been one big fresh start."],
];

const CHANNELS: [string, string, string][] = [
  ["🫀", "the gut", "A physical yes or no. Warmth, tightness, butterflies or that sinking 'oh hell no'."],
  ["✨", "the knowing", "Total certainty with zero explanation. You just know. And you're right."],
  ["🖼️", "the pictures", "Images, daydreams and dreams that live rent-free in your head all day."],
  ["🎶", "the words", "A phrase that drops in, or a lyric on repeat at exactly the right moment."],
  ["🔢", "the signs", "Repeating numbers, feathers, the same name three times in one week."],
  ["🧲", "the pull", "A magnetic pull toward a person, a place or an idea. No explanation needed."],
];

const SKY: [string, string, string, string][] = [
  ["🦂", "sun in scorpio", "Scorpio is death, rebirth and transformation. She strips back whatever's finished so something hotter can grow.", "#fff"],
  ["🌑", "new moon in scorpio", "Earlier this week the Moon went dark and started over. We're in the fresh, growing phase. Prime planting season.", "var(--pink-light)"],
  ["🏹", "moon in sagittarius", "All day on 11/11. Faith, optimism and the big picture. The Moon is literally your hype girl.", "var(--lav-light)"],
  ["☿♀", "the double station", "Mercury and Venus both turn direct on 13 and 14 November, less than nine hours apart. The review is ending, so choose what comes with you.", "#fff"],
  ["♇", "pluto in aquarius", "Pluto moved into Aquarius for good in November 2024 and stays until early 2044: power to the people, community and the future. We're living in a brand new timeline.", "var(--pink-light)"],
  ["☊", "the nodes", "South Node in Leo is the old timeline (performing, proving, carrying it all alone). North Node in Aquarius is the next one (your people, your weird, your vision). The portal sits between them.", "var(--lav-light)"],
];

export default function KnowPage() {
  const [flipped, setFlipped] = useState<number[]>([]);
  const [channel, setChannel] = useState<number | null>(null);

  return (
    <MembersOnly>
      <main style={{ background: "#fff", color: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 72, display: "grid", gap: 48 }}>
          <PortalNav here="/your-season/11-11/know" />

          <section className="holo-edge bg-glitter" style={{ position: "relative", borderRadius: 26, overflow: "hidden", color: "#fff", padding: "clamp(28px, 5vw, 56px)" }}>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>✨ deep dive 01</span>
            <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 86px)", lineHeight: 0.95, marginTop: 16, color: "#fff", maxWidth: 760 }}>what you need to know about 11/11.</h1>
            <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "14px 0 0", maxWidth: 560 }}>The universe has her order pad out and she&apos;s taking requests at FULL volume. Here&apos;s why, and how to place your order. 🪄</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/disco-planet.png" alt="" className="hidden md:block" style={{ position: "absolute", right: 30, top: "50%", transform: "translateY(-50%)", width: 260 }} />
            <HoloStar size={48} style={{ bottom: 22, right: "34%" }} />
          </section>

          {/* The numbers: tap to flip */}
          <section>
            <h2 className="display" style={sectionTitle}>ones. <span className="pk">everywhere.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10 }}>In numerology every number has a frequency, and today is STACKED with the one for fresh starts. Tap each one to flip it.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginTop: 22 }}>
              {NUMBERS.map(([n, t, b], i) => {
                const on = flipped.includes(i);
                return (
                  <button key={n} onClick={() => setFlipped((f) => (on ? f.filter((x) => x !== i) : [...f, i]))} className={on ? "" : "szn-holo"} style={{ ...card, border: "var(--border)", padding: "22px 18px", minHeight: 190, textAlign: "left", cursor: "pointer", background: on ? "var(--dark)" : undefined, color: on ? "#fff" : "var(--dark)", fontFamily: "inherit" }}>
                    {on ? (
                      <>
                        <div style={{ ...label, color: "var(--pink)" }}>{t}</div>
                        <p style={{ fontSize: 15, lineHeight: 1.5, fontWeight: 600, marginTop: 8 }}>{b}</p>
                      </>
                    ) : (
                      <>
                        <div className="display" style={{ fontSize: "clamp(48px, 7vw, 72px)", lineHeight: 0.9 }}>{n}</div>
                        <div style={{ ...label, marginTop: 14 }}>{t} · tap ↻</div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Intuition */}
          <section className="holo-edge" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", background: "var(--lav-light)" }}>
            <h2 className="display" style={sectionTitle}>how your intuition <span className="pk">talks to you.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10 }}>11 is the number of intuition, and yours is talking. Tap the channel that&apos;s loudest for you.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginTop: 20 }}>
              {CHANNELS.map(([e, t, b], i) => (
                <button key={t} onClick={() => setChannel(i)} style={{ ...card, border: "var(--border)", padding: "18px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", background: channel === i ? "var(--pink)" : "#fff" }}>
                  <span style={{ fontSize: 28 }}>{e}</span>
                  <div className="display" style={{ fontSize: 22, lineHeight: 1, marginTop: 8 }}>{t}{channel === i ? " ✓" : ""}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.45, fontWeight: 600, marginTop: 6 }}>{b}</p>
                </button>
              ))}
            </div>
            {channel !== null && (
              <p className="display" style={{ fontSize: "clamp(20px, 2.6vw, 28px)", lineHeight: 1.15, marginTop: 20 }}>
                yours talks through {CHANNELS[channel][1]}. turn her UP this week, babe. 💖
              </p>
            )}
          </section>

          {/* Signs */}
          <section className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-5">
            <div className="hd-foil" style={{ borderRadius: 20, border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)", padding: "26px 24px" }}>
              <div style={label}>👀 signs + synchronicity</div>
              <div className="display" style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1, marginTop: 8 }}>where has 11:11 been following you?</div>
              <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 600, marginTop: 10 }}>Repeating numbers, the song that keeps finding you, names that keep popping up. Your intuition has been dropping hints. The signs are receipts, so read them.</p>
            </div>
            <div style={{ ...card, border: "var(--border)", padding: "24px" }}>
              <div style={label}>📓 journal prompts</div>
              <ol style={{ marginTop: 12, paddingLeft: 20, display: "grid", gap: 10, fontSize: 16, fontWeight: 600, lineHeight: 1.45 }}>
                <li>When have you been seeing 11:11, 111 or 1111?</li>
                <li>What were you thinking about when it showed up?</li>
                <li>Which other signs keep showing up like they pay rent?</li>
                <li>What has your intuition been begging you to do?</li>
              </ol>
              <Link href="/your-season/11-11/exercises" className="no-underline" style={{ ...blackBtn, marginTop: 18, fontSize: 12 }}>write them in exercise 01 →</Link>
            </div>
          </section>

          {/* The sky */}
          <section>
            <h2 className="display" style={sectionTitle}>scorpio szn has the keys <span className="pk">to the portal.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginTop: 22 }}>
              {SKY.map(([g, t, b, bg]) => (
                <div key={t} className="holo-edge" style={{ ...card, padding: "22px 22px 24px", background: bg }}>
                  <span style={{ background: "#fff", minWidth: 56, height: 56, padding: "0 10px", borderRadius: 999, border: "var(--border)", display: "inline-grid", placeItems: "center", fontSize: 24, boxShadow: "3px 3px 0 var(--dark)" }}>{g}</span>
                  <div className="display" style={{ fontSize: 28, lineHeight: 1, marginTop: 14 }}>{t}.</div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0" }}>{b}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="holo-edge bg-glitter flex flex-wrap items-center justify-between gap-5" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", color: "#fff" }}>
            <div className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", lineHeight: 1, color: "#fff", maxWidth: 560 }}>now find out what it means in YOUR chart.</div>
            <Link href="/your-season/11-11/astrology" className="no-underline" style={{ display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 24px", border: "2px solid #fff" }}>manifest with your astrology →</Link>
          </section>
        </div>
      </main>
    </MembersOnly>
  );
}
