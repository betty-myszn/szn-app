"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useChart } from "@/lib/use-chart";
import { MembersOnly, HoloStar, PortalNav } from "@/components/eleven-eleven/Shared";
import UniverseMessage from "@/components/eleven-eleven/UniverseMessage";
import Replay from "@/components/eleven-eleven/Replay";
import { ORD, PORTAL_HOUSES, NODE_SHIFT, portalChart, savedStep, card, sectionTitle, label, pinkBtn, blackBtn, TILE_COLOURS, pp } from "@/lib/eleven-eleven-hub";

// The 11/11 portal hub home: what the portal is, her portal at a glance, and doorways into the
// three deep-dive pages. Built from the same modules as the coven home.

const TILES: [string, string, string][] = [
  ["✨", "what you need to know", "/your-season/11-11/know"],
  ["🪐", "manifest with your astrology", "/your-season/11-11/astrology"],
  ["🕯️", "the 17 exercises", "/your-season/11-11/exercises"],
  ["💬", "tell the coven", "/community"],
];

export default function ElevenElevenHome() {
  const { chart } = useChart();
  const [step, setStep] = useState(0);
  useEffect(() => { setStep(savedStep()); }, []);
  const pc = portalChart(chart);

  return (
    <MembersOnly>
      <main style={{ background: "#fff", color: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 72, display: "grid", gap: 48 }}>
          <PortalNav here="/your-season/11-11" />

          {/* Hero */}
          <section className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" style={{ position: "relative", borderRadius: 26, overflow: "hidden", border: "var(--border)", boxShadow: "8px 8px 0 var(--dark)" }}>
            <div className="hd-foil" style={{ padding: "clamp(26px, 4vw, 44px)", position: "relative" }}>
              <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "7px 14px", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", transform: "rotate(-2deg)" }}>🔮 the 11/11 portal</span>
              <h1 className="display" style={{ fontSize: "clamp(46px, 7vw, 88px)", lineHeight: 0.95, marginTop: 18 }}>step through the portal.</h1>
              <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "14px 0 0", maxWidth: 540 }}>
                The 11th day of the 11th month is a double master number, basically the universe&apos;s Black Friday for manifesting. This is your home for it: what it all means, how to manifest with YOUR chart, and every exercise from the workshop, so you can walk through at your own pace. 🪄
              </p>
              <div className="flex flex-wrap gap-3" style={{ marginTop: 20 }}>
                {[["date", "11/11"], ["master number", "11"], ["sun in", "scorpio"]].map(([k, v]) => (
                  <div key={k} className="szn-holo" style={{ border: "2px solid var(--dark)", borderRadius: 14, boxShadow: "3px 3px 0 var(--dark)", padding: "10px 16px", minWidth: 96 }}>
                    <div style={{ fontFamily: pp, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>{k}</div>
                    <div className="display" style={{ fontSize: 26, lineHeight: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
              <Link href="/your-season/11-11/exercises" className="no-underline" style={{ ...blackBtn, marginTop: 24 }}>
                {step > 0 ? `✨ carry on: exercise ${String(Math.min(step + 1, 17)).padStart(2, "0")} →` : "🪄 start the exercises →"}
              </Link>
            </div>
            <div style={{ position: "relative", minHeight: 320 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/coven/betty-witch-email.jpg" alt="Betty in a pink witch hat" style={{ display: "block", width: "100%", height: "100%", minHeight: 320, objectFit: "cover", objectPosition: "50% 12%" }} />
              <span className="holo-sticker" style={{ position: "absolute", left: 16, bottom: 18, transform: "rotate(-5deg)" }}>👑 head bad b*tch</span>
            </div>
            <HoloStar size={58} style={{ top: 18, right: "38%" }} />
          </section>

          <Replay />

          <UniverseMessage />

          {/* What it is */}
          <section>
            <h2 className="display" style={sectionTitle}>what is the <span className="pk">11/11 portal?</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ marginTop: 22 }}>
              {[
                ["🚪", "a doorway", "A portal is a doorway, and doorways are for walking through. 11/11 is four ones standing side by side like a door you can step through."],
                ["📲", "the universe in your DMs", "Seeing 11:11 on the clock is the universe sliding into your DMs: you're on the right path, babe. Keep going."],
                ["🔥", "what it activates", "Intuition. Alignment. Synchronicity. The part of you that already knows exactly which timeline is yours."],
              ].map(([e, t, b], i) => (
                <div key={t} className="holo-edge" style={{ ...card, padding: "22px 22px 24px", background: i === 1 ? "var(--pink-light)" : i === 2 ? "var(--lav-light)" : "#fff" }}>
                  <span style={{ background: "#fff", width: 56, height: 56, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 26, boxShadow: "3px 3px 0 var(--dark)" }}>{e}</span>
                  <div className="display" style={{ fontSize: 28, lineHeight: 1, marginTop: 14 }}>{t}.</div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0" }}>{b}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Her portal at a glance */}
          <section className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-2" style={{ position: "relative", borderRadius: 26, overflow: "hidden", color: "#fff" }}>
            <div style={{ padding: "clamp(26px, 4vw, 44px)" }}>
              <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>✨ your portal, in your chart</span>
              {pc.portalHouse ? (
                <>
                  <h2 className="display" style={{ fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 0.98, marginTop: 16, color: "#fff" }}>your portal opens in your {ORD[pc.portalHouse]} house.</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "12px 0 0" }}>
                    That&apos;s {PORTAL_HOUSES[pc.portalHouse][0]}: {PORTAL_HOUSES[pc.portalHouse][1]} {pc.southHouse ? NODE_SHIFT[pc.southHouse] : ""}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="display" style={{ fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 0.98, marginTop: 16, color: "#fff" }}>find where your portal opens.</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "12px 0 0" }}>Add your birth details and this shows the house where the portal opens in YOUR chart.</p>
                </>
              )}
              <Link href="/your-season/11-11/astrology" className="no-underline" style={{ ...pinkBtn, marginTop: 22 }}>manifest with your astrology →</Link>
            </div>
            <div style={{ position: "relative", minHeight: 260 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/disco-planet-logo.png" alt="" style={{ position: "absolute", right: -30, top: "50%", transform: "translateY(-50%) rotate(-8deg)", width: "min(520px, 110%)" }} />
            </div>
          </section>

          {/* Everything in the portal */}
          <section>
            <h2 className="display" style={sectionTitle}>everything in <span className="pk">your portal.</span></h2>
            <nav aria-label="Everything in your 11/11 portal" className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginTop: 22 }}>
              {TILES.map(([emoji, name, href], i) => (
                <Link key={href} href={href} className="no-underline" style={{ ...card, ...TILE_COLOURS[i % TILE_COLOURS.length], border: "var(--border)", padding: "20px 16px", textAlign: "center" }}>
                  <span style={{ background: "#fff", width: 62, height: 62, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 30, margin: "0 auto", boxShadow: "3px 3px 0 var(--dark)" }}>{emoji}</span>
                  <span style={{ display: "block", fontFamily: pp, fontSize: 18, fontWeight: 800, lineHeight: 1.1, marginTop: 12 }}>{name}</span>
                </Link>
              ))}
            </nav>
          </section>

          {/* The three deep dives */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { href: "/your-season/11-11/know", img: "/coven/baddie-moon-crown.jpg", kicker: "deep dive 01", title: "what you need to know.", line: "The numbers, the signs, how your intuition talks, and the sky that's holding the portal open this week." },
              { href: "/your-season/11-11/astrology", img: "/cosmic-planet.png", kicker: "deep dive 02", title: "manifest with your astrology.", line: "Your portal house, your two timelines, your Venus, Jupiter and Mercury, and where your chart says YES." },
              { href: "/your-season/11-11/exercises", img: "/coven/betty-coven-card.jpg", kicker: "the exercises", title: "walk through the portal.", line: "All 17 workshop exercises, one at a time, from naming your loop to the threshold ritual." },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="no-underline holo-edge" style={card}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt="" style={{ display: "block", width: "100%", aspectRatio: "4 / 3", objectFit: t.img.endsWith(".png") ? "contain" : "cover", objectPosition: "50% 30%", background: t.img.endsWith(".png") ? "var(--dark)" : "var(--lav-light)" }} />
                <div className="hd-foil" aria-hidden="true" style={{ height: 12, borderTop: "var(--border)", borderBottom: "var(--border)" }} />
                <div style={{ padding: "18px 20px 22px" }}>
                  <div style={label}>{t.kicker}</div>
                  <div className="display" style={{ fontSize: "clamp(26px, 3vw, 34px)", lineHeight: 1, marginTop: 6 }}>{t.title}</div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.45, fontWeight: 600, margin: "10px 0 0" }}>{t.line}</p>
                </div>
              </Link>
            ))}
          </section>

          {/* Next 24 hours */}
          <section className="hd-foil flex flex-wrap items-center gap-4" style={{ borderRadius: 20, padding: "20px 24px", border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)" }}>
            <span style={{ background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 11px", transform: "rotate(-2deg)" }}>your next 24 hours</span>
            <span className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.1 }}>say your claim at 11:11 tonight, make your portal move before 11:11 tomorrow, and tell one person what you chose.</span>
          </section>
        </div>
      </main>
    </MembersOnly>
  );
}
