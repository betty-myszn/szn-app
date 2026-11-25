"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import BringABaddie from "@/components/BringABaddie";
import WorkshopJoin from "@/components/WorkshopJoin";
import DailyMagicButton from "@/components/DailyMagicButton";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { hasActiveAccess } from "@/lib/membership-access";
import { getSeasonEmbodiment } from "@/lib/season-embodiment";
import { loadRoomMessages, type ChatMessage } from "@/lib/chat-rooms";
import { WORKSHOPS } from "@/lib/workshops";
import { COVEN_CIRCLE, COVEN_MOONS, COVEN_NEXT, COVEN_ROOM_ID, COVEN_THEME, moonVisible } from "@/lib/coven-month";
import QuantumLeapBand from "@/components/quantum-leap/QuantumLeapBand";
import { qlPromoShowing, QL_PATH } from "@/lib/quantum-leap";

const pp = "var(--font-poppins), Poppins, sans-serif";

const label: CSSProperties = { fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dark)" };
const pinkBtn: CSSProperties = { display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 24px" };
const blackBtn: CSSProperties = { ...pinkBtn, background: "var(--dark)" };
const openLink: CSSProperties = { fontFamily: pp, fontSize: 13, fontWeight: 800, textDecoration: "underline" };
const sectionTitle: CSSProperties = { fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1 };
const card: CSSProperties = { display: "block", background: "#fff", color: "var(--dark)", borderRadius: 20, overflow: "hidden", boxShadow: "6px 6px 0 var(--dark)" };

// The same season art as the dashboard hero. A season with no art falls back to Betty in the hat.
const HERO_ART: Record<string, string> = {
  Leo: "/leo-lion.png",
  Libra: "/libra-moon-full.png",
  Scorpio: "/scorpio-hero.jpg",
};

const HUB_LINKS = [
  ["🌕", "gemini full moon", "/your-season/gemini-full-moon"],
  ["♀", "the goddess day", "/your-season/friday-13"],
  ["🔮", "11/11 portal + replay", "/your-season/11-11"],
  ["🪐", "my szn", "/dashboard"],
  ["💬", "baddie chat", "/community"],
  ["✨", "my chart", "/my-chart"],
  ["🌍", "power places", "/your-season/places"],
  ["🧬", "human design", "/human-design"],
  ["🕯️", "workshops", "/events"],
  ["🎬", "replays", "/events/replays"],
  ["📓", "journal", "/journal"],
  ["🎯", "goals", "/goals"],
  ["🧘‍♀️", "meditations", "/meditations"],
  ["🫶", "tapping", "/tapping"],
  ["🎧", "subliminals", "/subliminals"],
];

// Portals for "what you might've missed". Add each new portal here with the moment it happened; the
// coven home shows the two most recent from the last three weeks.
const CATCH_UP: { at: number; href: string; title: string; line: string; cta: string }[] = [
  { at: Date.parse("2026-11-11T11:11:00Z"), href: "/your-season/11-11", title: "🔮 the 11/11 portal + workshop replay", line: "Your North and South Node reading, the 17 exercises and the full manifestation workshop replay.", cta: "watch + open →" },
  { at: Date.parse("2026-11-13T00:00:00Z"), href: "/your-season/friday-13", title: "♀ friday the 13th: the goddess day portal", line: "Venus and Mercury went direct together. The ritual and spell are still waiting for you.", cta: "open the portal →" },
  { at: Date.parse("2026-11-24T14:53:00Z"), href: "/your-season/gemini-full-moon", title: "🌕 the gemini full moon portal", line: "Where it landed in your chart, the old story to rewrite and the twins ritual, still glowing.", cta: "open the portal →" },
];

// Solid brand colours for the hub tiles, so the foil stays special on the cards around them.
const TILE_COLOURS: CSSProperties[] = [
  { background: "var(--pink)", color: "var(--dark)" },
  { background: "var(--lav)", color: "var(--dark)" },
  { background: "var(--dark)", color: "#fff" },
  { background: "var(--pink-light)", color: "var(--dark)" },
  { background: "var(--lav-light)", color: "var(--dark)" },
  { background: "var(--dark)", color: "#fff" },
  { background: "var(--pink-light)", color: "var(--dark)" },
  { background: "var(--pink)", color: "var(--dark)" },
  { background: "var(--lav)", color: "var(--dark)" },
  { background: "var(--dark)", color: "#fff" },
];

function spellArt(name: string): string {
  if (/money/i.test(name)) return "/cosmic-money.png";
  if (/cord/i.test(name)) return "/eclipse-moon.png";
  if (/power/i.test(name)) return "/cosmic-planet.png";
  return "/disco-planet.png";
}

function Countdown({ to, now }: { to: number; now: number }) {
  const left = Math.max(0, to - now);
  const days = Math.floor(left / 86400000);
  const hours = Math.floor((left % 86400000) / 3600000);
  const mins = Math.floor((left % 3600000) / 60000);
  return (
    <div className="flex gap-3" style={{ marginTop: 20 }}>
      {[[days, "days"], [hours, "hours"], [mins, "mins"]].map(([n, unit]) => (
        <div key={unit} className="szn-holo" style={{ border: "2px solid var(--dark)", borderRadius: 14, boxShadow: "3px 3px 0 #fff", padding: "10px 16px", textAlign: "center", minWidth: 76, color: "var(--dark)" }}>
          <div style={{ fontFamily: pp, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{n}</div>
          <div style={{ fontFamily: pp, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{unit}</div>
        </div>
      ))}
    </div>
  );
}

export default function CovenHomePage() {
  const { member } = useMember();
  const season = useSeason();
  const [now, setNow] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadRoomMessages(COVEN_ROOM_ID)
      .then((m) => setMessages(m.filter((x, i) => i === 0 || x.author !== m[i - 1].author || x.content !== m[i - 1].content).slice(-3).reverse()))
      .catch(() => setMessages([]));
  }, []);

  const spells = season ? getSeasonEmbodiment(season.sign)?.spells ?? [] : [];
  // Moons stay off the coven home until the day before (UK), then show for three days after.
  const nextMoon = now === null ? null : COVEN_MOONS.find((m) => moonVisible(m.at, now)) ?? null;
  const geminiLive = nextMoon?.sign === "Gemini" && nextMoon.date === "2026-11-24";
  const circleUpcoming = now !== null && now < COVEN_CIRCLE.endsAt;
  const circleStarted = now !== null && now >= COVEN_CIRCLE.startsAt;
  const replays = WORKSHOPS.filter((w) => w.hasReplay).slice(-3).reverse();

  // From the moment the Sun enters Sagittarius the coven home switches to the Quantum Leap Experiment.
  const leapOn = now !== null && qlPromoShowing(now, !!member?.isAdmin);
  const theme = leapOn
    ? { label: "✨ the sagittarius szn theme", title: "how to create a biggggg f*cking life.", line: "Thirty days of bold moves, Jupiter magic and baddies cheering you on, so you walk into 2027 already living like HER. 🏹" }
    : { label: `✨ the ${COVEN_THEME.month} theme${season ? ` · ${season.sign.toLowerCase()} szn` : ""}`, title: COVEN_THEME.title, line: COVEN_THEME.line };
  const hubLinks = leapOn ? [["🏹", "quantum leap", QL_PATH], ...HUB_LINKS] : HUB_LINKS;
  const MAIN_HREFS = ["/dashboard", "/community", "/my-chart", "/events/replays", "/meditations"];
  const mainTiles = MAIN_HREFS.map((h) => hubLinks.find(([, , href]) => href === h)).filter((t): t is string[] => !!t);
  const moreTiles = hubLinks.filter(([, , href]) => !MAIN_HREFS.includes(href) && !CATCH_UP.some((c) => c.href === href));
  const missed = now === null ? [] : CATCH_UP
    .filter((c) => c.at <= now && now - c.at <= 21 * 86400000 && !(geminiLive && c.href === "/your-season/gemini-full-moon"))
    .sort((a, b) => b.at - a.at)
    .slice(0, 2);

  const firstName = member?.name?.trim().split(/\s+/)[0] ?? "";
  const heroArt = (season && HERO_ART[season.sign]) || "/coven/betty-witch-email.jpg";

  return (
    <main style={{ background: "#fff", color: "var(--dark)" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 30, paddingBottom: 72, display: "grid", gap: 52 }}>
        {/* Welcome + this month's theme */}
        <section className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" style={{ borderRadius: 26, overflow: "hidden", border: "var(--border)", boxShadow: "8px 8px 0 var(--dark)" }}>
          <div className="hd-foil" style={{ padding: "clamp(26px, 4vw, 44px)" }}>
            <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "7px 14px", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", transform: "rotate(-2deg)" }}>🦄 founding witch</span>
            <h1 className="display" style={{ fontSize: "clamp(46px, 7vw, 88px)", lineHeight: 0.95, marginTop: 18 }}>
              welcome back, {firstName || "witch"}.
            </h1>
            <div style={{ ...label, marginTop: 26 }}>{theme.label}</div>
            <div className="display" style={{ fontSize: "clamp(32px, 4.4vw, 50px)", lineHeight: 1, marginTop: 8 }}>{theme.title}</div>
            <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0", maxWidth: 520 }}>{theme.line}</p>
            <DailyMagicButton />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroArt} alt="" className="block w-full aspect-[4/5] md:aspect-auto md:h-full" style={{ objectFit: "cover", objectPosition: "50% 12%", minHeight: 320 }} />
        </section>

        {/* Sagittarius szn: the main feature from the Sun's ingress (22 Nov 2026), above everything else */}
        {leapOn && (
          <section className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] items-stretch" style={{ borderRadius: 26, overflow: "hidden", border: "var(--border)", boxShadow: "8px 8px 0 var(--pink)", background: "linear-gradient(160deg, var(--lav-light) 0%, #fff 55%, var(--pink-light) 100%)" }}>
            <div style={{ padding: "clamp(26px, 4vw, 44px)" }}>
              <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>♐️ sagittarius szn is HERE</span>
              <h2 className="display" style={{ fontSize: "clamp(38px, 5.6vw, 66px)", lineHeight: 0.96, marginTop: 16 }}>
                big dreams, biiiiigggg $$$, <span style={{ color: "var(--pink)" }}>big life.</span>
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "12px 0 0", maxWidth: 560 }}>Jupiter is running the show, babe, so this is the season we go after the outrageous dreams for real and clear everything that&apos;s been keeping us small. Here&apos;s everything waiting for you. 🏹</p>
              <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
                <Link href={QL_PATH} className="no-underline" style={{ display: "block", background: "var(--dark)", color: "#fff", borderRadius: 18, padding: "16px 20px", boxShadow: "5px 5px 0 var(--pink)" }}>
                  <div style={{ fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>♐️ starts now</div>
                  <div className="display" style={{ fontSize: "clamp(22px, 2.6vw, 28px)", lineHeight: 1.05, marginTop: 4, color: "#fff" }}>the 30-day quantum leap challenge →</div>
                  <div style={{ fontSize: 15, lineHeight: 1.45, fontWeight: 600, marginTop: 6 }}>30 days of breaking through limiting beliefs, receiving MORE and taking BOLD action. Your small-life era is officially over, baddieeee.</div>
                </Link>
                <div style={{ background: "#fff", borderRadius: 18, padding: "16px 20px", border: "var(--border)", boxShadow: "5px 5px 0 var(--dark)" }}>
                  <div style={{ fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>💖 live on zoom · sunday 29th of november, 7pm uk</div>
                  <div className="display" style={{ fontSize: "clamp(22px, 2.6vw, 28px)", lineHeight: 1.05, marginTop: 4 }}>the sag szn masterclass: big dreams, biiiiigggg $$$ and big life</div>
                  <div style={{ fontSize: 15, lineHeight: 1.45, fontWeight: 600, marginTop: 6 }}>Your BIGGGG life vision, your Jupiter blueprint and live shadow work to clear what&apos;s been holding you back.</div>
                </div>
                <Link href="/dashboard" className="no-underline" style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, textDecoration: "underline", color: "var(--dark)", marginTop: 4 }}>🪐 open your sagittarius szn, written for your chart →</Link>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sagittarius-unicorn.webp" alt="A pink-maned unicorn with the Sagittarius glyph on her hip" className="block order-first md:order-none w-[68%] md:w-full" style={{ maxWidth: 440, height: "auto", alignSelf: "end", justifySelf: "center", padding: "18px 18px 0" }} />
          </section>
        )}

        {/* Today's move in the 30-Day Quantum Leap Challenge */}
        <QuantumLeapBand />

        {/* Power places (astrocartography), new 25 Nov 2026 for sag szn: Sagittarius is the travel sign */}
        <Link href="/your-season/places" className="no-underline grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] items-center" style={{ borderRadius: 26, overflow: "hidden", color: "var(--dark)", padding: "clamp(24px, 3.6vw, 40px)", gap: 22, border: "var(--border)", boxShadow: "8px 8px 0 var(--pink)", background: "linear-gradient(150deg, var(--pink-light) 0%, #fff 50%, var(--lav-light) 100%)" }}>
          <div>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🌍 new in your coven · made for sag szn</span>
            <h2 className="display" style={{ fontSize: "clamp(36px, 5.2vw, 62px)", lineHeight: 0.98, marginTop: 14 }}>where in the world <span style={{ color: "var(--pink)" }}>you glow.</span></h2>
            <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0", maxWidth: 540 }}>Your birth chart drawn across the whole world map, babe. Find your love city, your money city and your glow-up city, see your chart redrawn for wherever you are right now, find out when your lines light up this year and plan the girls&apos; trip that&apos;s magic for BOTH of you. Sag szn is travel szn. 🏹</p>
            <span style={{ ...pinkBtn, marginTop: 18, border: "var(--border)" }}>find your power places →</span>
          </div>
          <div style={{ justifySelf: "center", position: "relative", width: "100%", maxWidth: 270, transform: "rotate(2.5deg)" }}>
            {/* Betty's own power places card, from her chart, as the preview of what every member gets */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coven/power-places-preview.jpg" alt="Betty's power places card: Dubai for love, Istanbul for money, Barbados for a glow up, Tahiti for home" width={720} height={1280} className="block w-full h-auto" style={{ borderRadius: 22, border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)" }} />
            <span style={{ position: "absolute", left: -10, top: 18, transform: "rotate(-7deg)", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 999 }}>betty&apos;s map 💅</span>
          </div>
        </Link>

        {geminiLive && (
          <>
            {/* Full Moon in Gemini (24 Nov 2026) */}
            <Link href="/your-season/gemini-full-moon" className="no-underline holo-edge bg-glitter grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] items-center" style={{ borderRadius: 26, overflow: "hidden", color: "#fff", padding: "clamp(24px, 3.6vw, 40px)", gap: 18 }}>
              <div>
                <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🌕 tuesday 24th of november</span>
                <h2 className="display" style={{ fontSize: "clamp(36px, 5.2vw, 62px)", lineHeight: 0.98, marginTop: 14, color: "#fff" }}>FULL MOON IN GEMINI, BABYYYY! 🌕💬</h2>
                <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0", maxWidth: 520 }}>Gemini rules your words and the stories you tell about yourself, and with Mercury freshly direct, everything that got stuck in your throat is ready to come OUT. See where it lands in your chart, rewrite the old story and do the twins ritual. ✨</p>
                <span style={{ ...pinkBtn, marginTop: 18, border: "2px solid #fff" }}>enter the full moon portal →</span>
              </div>
              <div className="hd-foil" style={{ justifySelf: "center", border: "var(--border)", borderRadius: 22, padding: "18px 28px", textAlign: "center", color: "var(--dark)", transform: "rotate(3deg)", boxShadow: "6px 6px 0 #fff" }}>
                <div className="display" style={{ fontSize: "clamp(72px, 10vw, 112px)", lineHeight: 0.9 }}>{"\u264A\uFE0E"}</div>
                <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 8 }}>2° gemini · 2:53pm UK</div>
              </div>
            </Link>
          </>
        )}

        {/* Lilith: Money & Power Activation + the members' Lilith page (15 Nov 2026) */}
        <Link href="/my-chart/lilith" className="no-underline grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] items-stretch" style={{ borderRadius: 26, overflow: "hidden", color: "#fff", background: "#08070a", border: "var(--border)", boxShadow: "6px 6px 0 var(--pink)" }}>
          <div style={{ padding: "clamp(24px, 3.6vw, 40px)", alignSelf: "center" }}>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🖤 new in your coven</span>
            <h2 className="display" style={{ fontSize: "clamp(36px, 5.2vw, 62px)", lineHeight: 0.98, marginTop: 14, color: "#fff" }}>LILITH: MONEY &amp; POWER ACTIVATION 💸</h2>
            <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0", maxWidth: 520 }}>Your guided hypnosis and goddess activation is HERE, babe, plus your own Lilith page: all four of your Liliths, your shadow work, your Lilith money era and a money exercise written for your placement. 🔮</p>
            <span style={{ ...pinkBtn, marginTop: 18, border: "2px solid #fff" }}>meet your lilith →</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lilith/lilith-hero.jpg" alt="Lilith under a glitter crescent moon" className="block w-full aspect-[4/3] md:aspect-auto md:h-full" style={{ objectFit: "cover", objectPosition: "50% 15%", minHeight: 260 }} />
        </Link>

        {/* What you might've missed: picked from CATCH_UP by date, the two most recent portals from the last
            three weeks, so it never goes stale on its own (24 Nov 2026). A portal still live up top is skipped. */}
        {missed.length > 0 && (
          <section>
            <div style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>✨ what you might&apos;ve missed, babe</div>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 14 }}>
              {missed.map((c, i) => (
                <Link key={c.href} href={c.href} className="no-underline flex flex-col justify-between" style={{ border: "var(--border)", borderRadius: 18, boxShadow: "4px 4px 0 var(--dark)", background: i % 2 ? "var(--lav-light)" : "var(--pink-light)", color: "var(--dark)", padding: "18px 20px", gap: 10 }}>
                  <span style={{ fontFamily: pp, fontSize: 17, fontWeight: 800 }}>{c.title}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.45 }}>{c.line}</span>
                  <span style={{ fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{c.cta}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Next circle */}
        {circleUpcoming && now !== null ? (
          <section className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-2" style={{ borderRadius: 26, overflow: "hidden", color: "#fff" }}>
            <div style={{ padding: "clamp(26px, 4vw, 44px)", alignSelf: "center" }}>
              <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>{COVEN_CIRCLE.sticker}</span>
              <h2 className="display" style={{ fontSize: "clamp(38px, 5.4vw, 66px)", lineHeight: 0.98, marginTop: 16, color: "#fff" }}>{COVEN_CIRCLE.title}.</h2>
              <p style={{ fontSize: "clamp(17px, 1.7vw, 19px)", lineHeight: 1.5, fontWeight: 700, margin: "14px 0 0", color: "#fff" }}>
                {COVEN_CIRCLE.note}
              </p>
              {!circleStarted && <Countdown to={COVEN_CIRCLE.startsAt} now={now} />}
              <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 22 }}>
                <WorkshopJoin
                  workshopId={COVEN_CIRCLE.workshopId}
                  enabled={hasActiveAccess(member)}
                  label="join the circle on zoom"
                  fallback={<p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#fff" }}>{COVEN_CIRCLE.joinSoon}</p>}
                />
                <Link href="/events" className="no-underline btn-pink" style={pinkBtn}>get all the details →</Link>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={COVEN_CIRCLE.image} alt="" className="w-[62%] md:w-full" style={{ display: "block", maxWidth: 440, height: "auto", alignSelf: "end", justifySelf: "center", padding: "0 18px" }} />
          </section>
        ) : (
          <section className="holo-edge" style={{ borderRadius: 26, padding: "clamp(26px, 4vw, 44px)", background: "var(--pink-light)" }}>
            <div style={label}>🕯️ your next circle{COVEN_NEXT ? " · date coming soon" : ""}</div>
            <h2 className="display" style={{ fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1, marginTop: 10 }}>{COVEN_NEXT ? `${COVEN_NEXT.title}.` : "your next date is landing here soon, babe."}</h2>
            {COVEN_NEXT && <p style={{ fontSize: "clamp(17px, 1.7vw, 19px)", lineHeight: 1.5, fontWeight: 700, margin: "14px 0 0", maxWidth: 640 }}>{COVEN_NEXT.line}</p>}
          </section>
        )}

        {/* Coven chat: moved up under the next circle (24 Nov 2026). The chat is the page members come
            back for most (10 of 17, and 6 of them on 2+ days), so it sits above the tiles and spells. */}
        <section className="holo-edge" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", background: "var(--lav-light)" }}>
          <h2 className="display" style={sectionTitle}>the baddie <span className="pk">chat.</span></h2>
          {messages.length > 0 ? (
            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              {messages.map((m) => (
                <div key={m.id} className="flex items-start gap-3">
                  <span className="hd-foil" aria-hidden="true" style={{ flexShrink: 0, width: 42, height: 42, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontFamily: pp, fontSize: 17, fontWeight: 800, color: "var(--dark)" }}>{m.author.trim().charAt(0).toUpperCase()}</span>
                  <div style={{ background: "#fff", border: "var(--border)", borderRadius: "18px 18px 18px 4px", padding: "11px 15px", fontSize: 16, lineHeight: 1.45, maxWidth: 680 }}>
                    <div style={{ fontFamily: pp, fontSize: 14, fontWeight: 800 }}>{m.author}</div>
                    {m.content.length > 140 ? `${m.content.slice(0, 140)}...` : m.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, margin: "14px 0 0" }}>The room is open, babe. Go say hiii and tell us what you&apos;re calling in. 💜</p>
          )}
          <Link href={`/community/room/${COVEN_ROOM_ID}`} className="no-underline" style={{ ...blackBtn, marginTop: 22 }}>go to the baddie chat →</Link>
        </section>

        {/* Referral link + gift, straight under the chat (24 Nov 2026). */}
        {member?.id && <BringABaddie memberId={member.id} />}

        {/* Everything in the membership, one tap away */}
        <section>
          <h2 className="display" style={sectionTitle}>everything in <span className="pk">your coven.</span></h2>
          {/* Five tiles members actually use (24 Nov 2026 activity), the rest one tap down under "more". */}
          <nav aria-label="Everything in your coven" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" style={{ marginTop: 22 }}>
            {mainTiles.map(([emoji, name, href], i) => (
              <Link key={href} href={href} className="no-underline" style={{ ...card, ...TILE_COLOURS[i % TILE_COLOURS.length], border: "var(--border)", padding: "20px 16px", textAlign: "center" }}>
                <span style={{ background: "#fff", width: 62, height: 62, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 30, margin: "0 auto", boxShadow: "3px 3px 0 var(--dark)" }}>{emoji}</span>
                <span style={{ display: "block", fontFamily: pp, fontSize: 18, fontWeight: 800, lineHeight: 1.1, marginTop: 12 }}>{name}</span>
              </Link>
            ))}
          </nav>
          <details style={{ marginTop: 14 }}>
            <summary style={{ cursor: "pointer", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", listStyle: "none" }}>＋ more in your coven</summary>
            <div className="flex flex-wrap gap-2.5" style={{ marginTop: 14 }}>
              {moreTiles.map(([emoji, name, href]) => (
                <Link key={href} href={href} className="no-underline" style={{ border: "var(--border)", borderRadius: 999, padding: "10px 16px", fontFamily: pp, fontSize: 15, fontWeight: 800, color: "var(--dark)", background: "#fff" }}>{emoji} {name}</Link>
              ))}
            </div>
          </details>
        </section>

        {/* Spells */}
        {spells.length > 0 && season && (
          <section>
            <h2 className="display" style={sectionTitle}>this month&apos;s <span className="pk">spells.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ marginTop: 22 }}>
              {spells.map((s) => (
                <Link key={s.id} href="/your-season/embody#spells" className="no-underline holo-edge" style={card}>
                  <div className="bg-glitter" style={{ aspectRatio: "4 / 3", display: "grid", placeItems: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={spellArt(s.name)} alt="" style={{ display: "block", width: "78%", height: "86%", objectFit: "contain" }} />
                  </div>
                  <div className="hd-foil" aria-hidden="true" style={{ height: 12, borderTop: "var(--border)", borderBottom: "var(--border)" }} />
                  <div style={{ padding: "16px 18px 18px" }}>
                    <div style={{ fontFamily: pp, fontSize: 22, fontWeight: 800, lineHeight: 1.12 }}>{s.emoji} {s.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 6 }}>{s.date}</div>
                    <div style={{ ...openLink, marginTop: 12 }}>open the spell →</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tools */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { href: "/coven/calendar", img: "/libra-moon-full.png", title: "the manifestation calendar.", line: "Every big astrology date, with your intention, mini ritual and journal prompt." },
            { href: "/coven/diary", img: "/astrology-journaling.png", title: "your manifestation diary.", line: "Track your goals, log your weekly moves and keep every sign and win in one place." },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="no-underline holo-edge" style={card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.img} alt="" style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover", objectPosition: "50% 40%", background: "var(--lav-light)" }} />
              <div className="hd-foil" aria-hidden="true" style={{ height: 12, borderTop: "var(--border)", borderBottom: "var(--border)" }} />
              <div style={{ padding: "20px 22px 24px" }}>
                <div className="display" style={{ fontSize: "clamp(30px, 3.6vw, 42px)", lineHeight: 1 }}>{t.title}</div>
                <p style={{ fontSize: 16, lineHeight: 1.45, fontWeight: 600, margin: "10px 0 0" }}>{t.line}</p>
              </div>
            </Link>
          ))}
          <div className="hd-foil sm:col-span-2 flex flex-wrap items-center gap-4" style={{ borderRadius: 20, padding: "18px 22px", border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)" }}>
            <span style={{ background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 11px", transform: "rotate(-2deg)" }}>coming soon</span>
            <span className="display" style={{ fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1 }}>witchy bestie matching.</span>
          </div>
        </section>

        {/* Next moon + personal season */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {nextMoon && (
            <Link href={`/your-season/moon?type=${nextMoon.type}&date=${nextMoon.date}&sign=${nextMoon.sign}&degree=${nextMoon.degree}`} className="no-underline holo-edge bg-glitter" style={{ ...card, background: undefined, color: "#fff", padding: "26px 24px" }}>
              <div style={{ ...label, color: "#fff" }}>🌙 the next moon</div>
              <div className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 1, marginTop: 10, color: "#fff" }}>{nextMoon.name}.</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 10 }}>{nextMoon.when}</div>
              <div style={{ ...openLink, marginTop: 14 }}>read yours + get the ritual →</div>
            </Link>
          )}
          <Link href="/dashboard" className="no-underline hd-foil" style={{ ...card, background: undefined, border: "var(--border)", padding: "26px 24px" }}>
            <div style={label}>🪐 your personal season</div>
            <div className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 1, marginTop: 10 }}>{season ? `${season.sign.toLowerCase()} szn, ` : ""}written for your chart.</div>
            <div style={{ ...openLink, marginTop: 14 }}>open my szn →</div>
          </Link>
        </section>

        {/* Replays */}
        {replays.length > 0 && (
          <section>
            <h2 className="display" style={sectionTitle}>the <span className="pk">replays.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ marginTop: 22 }}>
              {replays.map((w) => (
                <Link key={w.id} href="/events/replays" className="no-underline holo-edge" style={card}>
                  {w.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.coverImage} alt="" style={{ display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }} />
                  )}
                  <div className="hd-foil" aria-hidden="true" style={{ height: 12, borderTop: "var(--border)", borderBottom: "var(--border)" }} />
                  <div style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, lineHeight: 1.2, padding: "14px 16px 18px" }}>{w.title}</div>
                </Link>
              ))}
            </div>
            <Link href="/events/replays" className="no-underline" style={{ ...blackBtn, marginTop: 22 }}>see every replay →</Link>
          </section>
        )}
      </div>
    </main>
  );
}
