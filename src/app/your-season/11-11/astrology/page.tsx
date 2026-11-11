"use client";

import { useState } from "react";
import Link from "next/link";
import { useChart } from "@/lib/use-chart";
import { useHumanDesign } from "@/lib/use-human-design";
import { MembersOnly, HoloStar, PortalNav } from "@/components/eleven-eleven/Shared";
import { ORD, PORTAL_HOUSES, NODE_SHIFT, AUTHORITY, WISH_AREAS, portalChart, card, sectionTitle, label, pinkBtn, pp } from "@/lib/eleven-eleven-hub";

// Deep dive 02: manifest with your astrology. Everything here is read off her own chart: the
// house this week's Scorpio New Moon opens, her two node timelines, her three manifesting planets,
// her shadow pair and a wish map she can tap through.

export default function AstrologyPage() {
  const { chart, loading } = useChart();
  const { hd } = useHumanDesign();
  const [area, setArea] = useState(0);
  const pc = portalChart(chart);
  const authority = hd ? AUTHORITY[hd.authority] : null;
  const venus = pc.planet("Venus"), jupiter = pc.planet("Jupiter"), mercury = pc.planet("Mercury"), chiron = pc.planet("Chiron"), sn = pc.planet("South Node");

  const planets: { g: string; k: string; title: string; how: string; use: string; bg: string }[] = [
    { g: "♀", k: "venus · what you attract", title: venus ? `venus in ${venus.sign.toLowerCase()}, your ${ORD[venus.house]} house` : "venus: what you attract", how: "Venus is love, money, pleasure and your sense of worth. Her sign is HOW you attract, her house is WHERE love and money flow to you.", use: "Wish in her style. Venus in Aries wants it NOW, Venus in Cancer wants it safe and soft. Give her what she likes and watch her deliver.", bg: "var(--lav-light)" },
    { g: "♃", k: "jupiter · where luck flows", title: jupiter ? `jupiter in ${jupiter.sign.toLowerCase()}, your ${ORD[jupiter.house]} house` : "jupiter: where luck flows", how: "Jupiter is growth, luck, generosity and big yeses. His house is WHERE your luck lands, his sign is HOW you grow.", use: "Put your boldest wish in your Jupiter house. This is where you're allowed to ask for MORE.", bg: "#fff" },
    { g: "☿", k: "mercury · speak it into existence", title: mercury ? `mercury in ${mercury.sign.toLowerCase()}, your ${ORD[mercury.house]} house` : "mercury: speak it into existence", how: "Mercury rules your words, your thoughts and the story you tell about yourself. Whatever you say on repeat becomes real.", use: "Write your wish the way your Mercury talks, then say it out loud. He turns direct on 13 November, so your words go live this week.", bg: "var(--pink-light)" },
  ];

  const [e, areaName, houses, planet] = WISH_AREAS[area];
  const inside = pc.inHouses(houses);

  return (
    <MembersOnly>
      <main style={{ background: "#fff", color: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 72, display: "grid", gap: 48 }}>
          <PortalNav here="/your-season/11-11/astrology" />

          {/* Hero: her portal house */}
          <section className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" style={{ position: "relative", borderRadius: 26, overflow: "hidden", border: "var(--border)", boxShadow: "8px 8px 0 var(--dark)" }}>
            <div className="hd-foil" style={{ padding: "clamp(26px, 4vw, 44px)" }}>
              <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "7px 14px", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", transform: "rotate(-2deg)" }}>🪐 deep dive 02</span>
              <h1 className="display" style={{ fontSize: "clamp(42px, 6.6vw, 82px)", lineHeight: 0.95, marginTop: 18 }}>manifest with your astrology.</h1>
              {loading ? <p style={{ marginTop: 14, fontWeight: 600 }}>reading your chart…</p> : pc.portalHouse ? (
                <>
                  <div style={{ ...label, marginTop: 22 }}>🦂 where your portal opens</div>
                  <div className="display" style={{ fontSize: "clamp(30px, 4.2vw, 48px)", lineHeight: 1, marginTop: 6 }}>your {ORD[pc.portalHouse]} house: {PORTAL_HOUSES[pc.portalHouse][0]}.</div>
                  <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0", maxWidth: 520 }}>This week&apos;s New Moon landed at 17° Scorpio, right in your {ORD[pc.portalHouse]} house, so this is where your portal is wide open: {PORTAL_HOUSES[pc.portalHouse][1]} Wish here first.</p>
                </>
              ) : (
                <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "14px 0 0" }}>Add your birth details and this page fills with YOUR portal house, timelines and manifesting planets. <Link href="/onboarding" style={{ fontWeight: 800 }}>add my chart →</Link></p>
              )}
            </div>
            <div className="bg-glitter" style={{ position: "relative", minHeight: 260, display: "grid", placeItems: "center", padding: "24px 18px 56px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cosmic-planet.png" alt="" style={{ display: "block", width: "min(340px, 86%)", height: "auto" }} />
              {pc.portalHouse && <span className="holo-sticker" style={{ position: "absolute", left: 16, bottom: 18, transform: "rotate(-4deg)" }}>✨ {ORD[pc.portalHouse]} house portal</span>}
            </div>
            <HoloStar size={52} style={{ top: 18, right: "40%" }} />
          </section>

          {/* Two timelines */}
          <section>
            <h2 className="display" style={sectionTitle}>your two <span className="pk">timelines.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch" style={{ marginTop: 22 }}>
              <div className="holo-edge" style={{ ...card, background: "var(--dark)", color: "#fff", padding: "24px" }}>
                <div style={{ ...label, color: "var(--lav)" }}>☋ south node in leo · the old timeline</div>
                <div className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", lineHeight: 1, marginTop: 8, color: "#fff" }}>{pc.southHouse ? `your ${ORD[pc.southHouse]} house.` : "runs on applause."}</div>
                <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, marginTop: 10 }}>Performing, proving, chasing the applause, carrying everything on your own. Jupiter sits right on it this week, so the old patterns are BIG and LOUD.</p>
              </div>
              <div className="display hidden md:grid" style={{ placeItems: "center", fontSize: 54, color: "var(--pink)" }}>→</div>
              <div className="holo-edge szn-holo" style={{ ...card, background: undefined, padding: "24px" }}>
                <div style={label}>☊ north node in aquarius · the next timeline</div>
                <div className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", lineHeight: 1, marginTop: 8 }}>{pc.northHouse ? `your ${ORD[pc.northHouse]} house.` : "built for the future."}</div>
                <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, marginTop: 10 }}>Your people, your weird, your vision. Aquarius is the 11th sign of the zodiac. On 11/11. Obviously.</p>
              </div>
            </div>
            {pc.southHouse && (
              <div className="hd-foil" style={{ marginTop: 18, borderRadius: 20, border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)", padding: "18px 22px" }}>
                <span className="display" style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.1 }}>{NODE_SHIFT[pc.southHouse].toLowerCase()}</span>
              </div>
            )}
          </section>

          {/* Key planets */}
          <section>
            <h2 className="display" style={sectionTitle}>your key planets <span className="pk">for manifesting.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10 }}>Three planets help you call it in. Two show you what&apos;s been in the way.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginTop: 22 }}>
              {planets.map((p) => (
                <div key={p.k} className="holo-edge" style={{ ...card, background: p.bg, padding: "24px 22px" }}>
                  <span style={{ background: "#fff", width: 60, height: 60, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 30, boxShadow: "3px 3px 0 var(--dark)", color: "var(--pink)" }}>{p.g}</span>
                  <div style={{ ...label, marginTop: 14 }}>{p.k}</div>
                  <div className="display" style={{ fontSize: 26, lineHeight: 1.05, marginTop: 6 }}>{p.title}.</div>
                  <p style={{ fontSize: 15, lineHeight: 1.5, fontWeight: 600, marginTop: 10 }}>{p.how}</p>
                  <div style={{ marginTop: 12, background: "var(--dark)", color: "#fff", borderRadius: 14, padding: "12px 14px", fontSize: 14, lineHeight: 1.5, fontWeight: 600 }}><span style={{ color: "var(--pink)", fontWeight: 800 }}>USE IT TONIGHT · </span>{p.use}</div>
                </div>
              ))}
            </div>
            <div className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 20, borderRadius: 26, padding: "clamp(22px, 3.4vw, 34px)", color: "#fff" }}>
              <div>
                <span className="holo-sticker">⚷ the shadow side</span>
                <div className="display" style={{ fontSize: "clamp(26px, 3.4vw, 38px)", lineHeight: 1, marginTop: 14, color: "#fff" }}>{chiron ? `chiron in your ${ORD[chiron.house]} house.` : "chiron: the wound + the gift."}</div>
                <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, marginTop: 10 }}>The house Chiron sits in is where you&apos;ve felt &ldquo;not enough&rdquo;. It&apos;s also where you end up healing other women. Spot it, and stop letting it set your ceiling.</p>
              </div>
              <div>
                <span className="holo-sticker">☋ your comfort zone</span>
                <div className="display" style={{ fontSize: "clamp(26px, 3.4vw, 38px)", lineHeight: 1, marginTop: 14, color: "#fff" }}>{sn ? `your south node in ${sn.sign.toLowerCase()}, ${ORD[sn.house]} house.` : "your south node."}</div>
                <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, marginTop: 10 }}>The one in YOUR birth chart: the habits and skills you were born leaning on. Feels safe, keeps you small. Notice it, then wish past it.</p>
              </div>
            </div>
          </section>

          {/* Wish map */}
          <section className="holo-edge" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", background: "var(--lav-light)" }}>
            <h2 className="display" style={sectionTitle}>wish where your <span className="pk">chart says yes.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10 }}>Every wish area lives in a house. Tap one to see what&apos;s in that house in YOUR chart. A planet there? Extra power.</p>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 18 }}>
              {WISH_AREAS.map(([em, name], i) => (
                <button key={name} onClick={() => setArea(i)} style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", padding: "10px 15px", borderRadius: 999, border: "var(--border)", background: area === i ? "var(--dark)" : "#fff", color: area === i ? "#fff" : "var(--dark)", boxShadow: "3px 3px 0 var(--dark)", cursor: "pointer" }}>{em} {name}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 items-center" style={{ ...card, border: "var(--border)", marginTop: 20, padding: "24px" }}>
              <span className="szn-holo" style={{ width: 96, height: 96, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 44 }}>{e}</span>
              <div>
                <div style={label}>{areaName}</div>
                <div className="display" style={{ fontSize: "clamp(26px, 3.4vw, 38px)", lineHeight: 1, marginTop: 6 }}>{houses.map((h) => ORD[h]).join(" + ")} house{planet ? ` + ${planet === "Moon" || planet === "Sun" ? "the " + planet : planet}` : ""}.</div>
                <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 600, marginTop: 8 }}>
                  {chart ? (inside.length ? `In your chart, ${inside.join(" and ")} ${inside.length > 1 ? "live" : "lives"} here. Extra power, babe: wish BIG in this area. ✨` : `No planets in ${houses.length > 1 ? "these houses" : "this house"} in your chart, so wish with ${planet ? (planet === "Moon" || planet === "Sun" ? "the " + planet : planet) : "the sign on the cusp"} instead.`) : "Add your chart to see what lives here for you."}
                </p>
              </div>
            </div>
            <p className="display" style={{ fontSize: "clamp(20px, 2.6vw, 28px)", lineHeight: 1.15, marginTop: 20 }}>
              ✦ your jupiter house{jupiter ? ` (${ORD[jupiter.house]})` : ""} and your scorpio portal house{pc.portalHouse ? ` (${ORD[pc.portalHouse]})` : ""} get your biggest wishes.
            </p>
          </section>

          {/* Authority */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="hd-foil" style={{ borderRadius: 20, border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)", padding: "26px 24px" }}>
              <div style={label}>🧬 your human design authority</div>
              <div className="display" style={{ fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1, marginTop: 8 }}>{authority ? `${authority[0]}.` : "how your body knows a yes."}</div>
              <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 600, marginTop: 10 }}>{authority ? authority[1] : "Your authority is how YOUR body knows a yes. It's on your Human Design chart."}</p>
            </div>
            <div className="bg-glitter holo-edge" style={{ ...card, background: undefined, color: "#fff", padding: "26px 24px", display: "grid", alignContent: "space-between", gap: 18 }}>
              <div className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", lineHeight: 1, color: "#fff" }}>now take it into the exercises.</div>
              <Link href="/your-season/11-11/exercises" className="no-underline" style={{ ...pinkBtn, border: "2px solid #fff", justifySelf: "start" }}>start the 17 exercises →</Link>
            </div>
          </section>
        </div>
      </main>
    </MembersOnly>
  );
}
