"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import WorkshopJoin from "@/components/WorkshopJoin";
import DailyMagicButton from "@/components/DailyMagicButton";
import { useMember } from "@/lib/use-member";
import { useSeason } from "@/lib/use-season";
import { hasActiveAccess } from "@/lib/membership-access";
import { getSeasonEmbodiment } from "@/lib/season-embodiment";
import { loadRoomMessages, type ChatMessage } from "@/lib/chat-rooms";
import { WORKSHOPS } from "@/lib/workshops";
import { COVEN_CIRCLE, COVEN_MOONS, COVEN_ROOM_ID, COVEN_THEME } from "@/lib/coven-month";

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
  ["🪐", "my szn", "/dashboard"],
  ["💬", "baddie chat", "/community"],
  ["✨", "my chart", "/my-chart"],
  ["🧬", "human design", "/human-design"],
  ["🕯️", "workshops", "/events"],
  ["🎬", "replays", "/events/replays"],
  ["📓", "journal", "/journal"],
  ["🎯", "goals", "/goals"],
  ["🧘‍♀️", "meditations", "/meditations"],
  ["🎧", "subliminals", "/subliminals"],
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
  const nextMoon = now === null ? null : COVEN_MOONS.find((m) => m.at > now) ?? null;
  const circleUpcoming = now !== null && now < COVEN_CIRCLE.endsAt;
  const circleStarted = now !== null && now >= COVEN_CIRCLE.startsAt;
  const replays = WORKSHOPS.filter((w) => w.hasReplay).slice(-3).reverse();

  const firstName = member?.name?.trim().split(/\s+/)[0] ?? "";
  const heroArt = (season && HERO_ART[season.sign]) || "/coven/betty-coven-email-hero-3.jpg";

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
            <div style={{ ...label, marginTop: 26 }}>✨ the {COVEN_THEME.month} theme{season ? ` · ${season.sign.toLowerCase()} szn` : ""}</div>
            <div className="display" style={{ fontSize: "clamp(32px, 4.4vw, 50px)", lineHeight: 1, marginTop: 8 }}>{COVEN_THEME.title}</div>
            <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0", maxWidth: 520 }}>{COVEN_THEME.line}</p>
            <DailyMagicButton />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroArt} alt="" style={{ display: "block", width: "100%", height: "100%", minHeight: 320, objectFit: "cover", objectPosition: "50% 12%" }} />
        </section>

        {/* Next circle */}
        {circleUpcoming && now !== null ? (
          <section className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-2 items-center" style={{ borderRadius: 26, overflow: "hidden", color: "#fff" }}>
            <div style={{ padding: "clamp(26px, 4vw, 44px)" }}>
              <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🪄 live this wednesday, 6pm uk</span>
              <h2 className="display" style={{ fontSize: "clamp(38px, 5.4vw, 66px)", lineHeight: 0.98, marginTop: 16, color: "#fff" }}>{COVEN_CIRCLE.title}.</h2>
              <p style={{ fontSize: "clamp(17px, 1.7vw, 19px)", lineHeight: 1.5, fontWeight: 700, margin: "14px 0 0", color: "#fff" }}>
                Our FIRST EVER coven event, babe. Come dressed as your future self, bring your most delusional wishlist and we call it ALL in together. 🎀
              </p>
              {!circleStarted && <Countdown to={COVEN_CIRCLE.startsAt} now={now} />}
              <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 22 }}>
                <WorkshopJoin
                  workshopId={COVEN_CIRCLE.workshopId}
                  enabled={hasActiveAccess(member)}
                  label="join the circle on zoom"
                  fallback={<p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#fff" }}>💜 Your Zoom button lands right here before we go live.</p>}
                />
                <Link href="/events" className="no-underline btn-pink" style={pinkBtn}>get all the details →</Link>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coven/betty-coven-email-hero-3.jpg" alt="Betty, head bad b*tch, in a pink witch hat with disco planets and stickers" style={{ display: "block", width: "100%", height: "auto" }} />
          </section>
        ) : (
          <section className="holo-edge" style={{ borderRadius: 26, padding: "clamp(26px, 4vw, 44px)", background: "var(--pink-light)" }}>
            <div style={label}>🕯️ your next circle</div>
            <h2 className="display" style={{ fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1, marginTop: 10 }}>your next date is landing here soon, babe.</h2>
          </section>
        )}

        {/* Everything in the membership, one tap away */}
        <section>
          <h2 className="display" style={sectionTitle}>everything in <span className="pk">your coven.</span></h2>
          <nav aria-label="Everything in your coven" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" style={{ marginTop: 22 }}>
            {HUB_LINKS.map(([emoji, name, href]) => (
              <Link key={href} href={href} className="no-underline hd-foil" style={{ ...card, background: undefined, border: "var(--border)", padding: "20px 16px", textAlign: "center" }}>
                <span style={{ background: "#fff", width: 62, height: 62, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 30, margin: "0 auto", boxShadow: "3px 3px 0 var(--dark)" }}>{emoji}</span>
                <span style={{ display: "block", fontFamily: pp, fontSize: 18, fontWeight: 800, lineHeight: 1.1, marginTop: 12 }}>{name}</span>
              </Link>
            ))}
          </nav>
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

        {/* Coven chat */}
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
