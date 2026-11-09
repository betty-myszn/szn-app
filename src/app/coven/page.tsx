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
const RULE = "2px solid var(--dark)";

const label: CSSProperties = { fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--dark)" };
const blackBtn: CSSProperties = { display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 24px" };

const HUB_LINKS = [
  ["my szn", "/dashboard"],
  ["baddie chat", "/community"],
  ["my chart", "/my-chart"],
  ["human design", "/human-design"],
  ["workshops", "/events"],
  ["replays", "/events/replays"],
  ["journal", "/journal"],
  ["goals", "/goals"],
  ["meditations", "/meditations"],
  ["subliminals", "/subliminals"],
];

function Countdown({ to, now }: { to: number; now: number }) {
  const left = Math.max(0, to - now);
  const days = Math.floor(left / 86400000);
  const hours = Math.floor((left % 86400000) / 3600000);
  const mins = Math.floor((left % 3600000) / 60000);
  return (
    <div className="flex gap-3" style={{ marginTop: 18 }}>
      {[[days, "days"], [hours, "hours"], [mins, "mins"]].map(([n, unit]) => (
        <div key={unit} style={{ background: "#fff", border: RULE, padding: "10px 16px", textAlign: "center", minWidth: 72, color: "var(--dark)" }}>
          <div style={{ fontFamily: pp, fontSize: 27, fontWeight: 800, lineHeight: 1 }}>{n}</div>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>{unit}</div>
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
    loadRoomMessages(COVEN_ROOM_ID).then((m) => setMessages(m.slice(-3).reverse())).catch(() => setMessages([]));
  }, []);

  const spells = season ? getSeasonEmbodiment(season.sign)?.spells ?? [] : [];
  const nextMoon = now === null ? null : COVEN_MOONS.find((m) => m.at > now) ?? null;
  const circleUpcoming = now !== null && now < COVEN_CIRCLE.endsAt;
  const circleStarted = now !== null && now >= COVEN_CIRCLE.startsAt;
  const replays = WORKSHOPS.filter((w) => w.hasReplay).slice(-3).reverse();

  return (
    <main style={{ background: "var(--lav-light)", color: "var(--dark)" }}>
      {/* Welcome + this month's theme */}
      <section className="px-5 md:px-8" style={{ paddingTop: 44, paddingBottom: 46, borderBottom: RULE }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-9 items-start">
          <div>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🦄 founding witch</span>
            <h1 className="display" style={{ fontSize: "clamp(50px, 8vw, 100px)", lineHeight: 0.95, marginTop: 20 }}>
              welcome back, <span className="pk">witch.</span>
            </h1>
            <div style={{ background: "#fff", border: RULE, padding: "20px 22px", marginTop: 26 }}>
              <div style={label}>✨ the {COVEN_THEME.month} theme</div>
              <div className="display" style={{ fontSize: "clamp(32px, 4.6vw, 52px)", lineHeight: 1, marginTop: 8 }}>{COVEN_THEME.title}</div>
              <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0" }}>{COVEN_THEME.line}</p>
            </div>
            <DailyMagicButton />
          </div>
          <div className="holo-edge" style={{ borderRadius: 22, overflow: "hidden", transform: "rotate(2deg)", boxShadow: "10px 12px 0 var(--dark)", background: "var(--lav-light)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coven/baddie-pink-email.jpg" alt="A baddie in a pink puff-sleeve top, hand on hip" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      {/* Next circle */}
      <section className="px-5 md:px-8" style={{ background: "var(--pink)", paddingTop: 36, paddingBottom: 40, borderBottom: RULE }}>
        {circleUpcoming && now !== null ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-7 items-start">
            <div>
              <span style={{ display: "inline-block", background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 13px", transform: "rotate(-2deg)" }}>
                🪄 live this wednesday, 6pm uk
              </span>
              <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 0.98, marginTop: 16 }}>{COVEN_CIRCLE.title}.</h2>
              <p style={{ fontSize: "clamp(17px, 1.8vw, 20px)", lineHeight: 1.5, fontWeight: 700, margin: "14px 0 0" }}>
                Our FIRST EVER coven event, babe. Come dressed as your future self, bring your most delusional wishlist and we call it ALL in together. 🎀
              </p>
              {!circleStarted && <Countdown to={COVEN_CIRCLE.startsAt} now={now} />}
              <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 20 }}>
                <WorkshopJoin
                  workshopId={COVEN_CIRCLE.workshopId}
                  enabled={hasActiveAccess(member)}
                  label="join the circle on zoom"
                  fallback={<p style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>💜 Your join button lands right here before we go live.</p>}
                />
                <Link href="/events" className="no-underline" style={blackBtn}>get all the details →</Link>
              </div>
            </div>
            <div style={{ border: RULE, overflow: "hidden", aspectRatio: "4 / 3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/coven/betty-witch-email.jpg" alt="Betty in a pink witch hat and black corset dress" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 28%" }} />
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div style={label}>🕯️ your next circle</div>
            <h2 className="display" style={{ fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1, marginTop: 10 }}>your next date is landing here soon, babe.</h2>
          </div>
        )}
      </section>

      {/* Everything in the membership, one tap away */}
      <section className="px-5 md:px-8" style={{ paddingTop: 52, paddingBottom: 58, borderBottom: RULE, background: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ ...label, color: "var(--pink)" }}>✨ everything in your coven</div>
          <nav aria-label="Everything in your coven" className="display flex flex-wrap" style={{ fontSize: "clamp(36px, 6.4vw, 78px)", lineHeight: 1.12, marginTop: 16 }}>
            {HUB_LINKS.map(([name, href], i) => (
              <span key={href} style={{ whiteSpace: "nowrap" }}>
                <Link href={href} className="no-underline hover:text-[var(--pink)] transition-colors" style={{ color: "#fff" }}>{name}</Link>
                {i < HUB_LINKS.length - 1 && <span aria-hidden="true" style={{ color: "var(--pink)", margin: "0 0.22em" }}>✦</span>}
              </span>
            ))}
          </nav>
        </div>
      </section>

      {/* Spells */}
      {spells.length > 0 && season && (
        <section className="px-5 md:px-8" style={{ paddingTop: 44, paddingBottom: 46, borderBottom: RULE }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="display" style={{ fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1 }}>this month&apos;s <span className="pk">spells.</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 22 }}>
              {spells.map((s) => (
                <Link key={s.id} href="/your-season/embody#spells" className="no-underline" style={{ background: "#fff", border: RULE, padding: "20px 18px", color: "var(--dark)", display: "block" }}>
                  <div style={{ fontSize: 30, lineHeight: 1 }}>{s.emoji}</div>
                  <div style={{ fontFamily: pp, fontSize: 21, fontWeight: 800, lineHeight: 1.15, marginTop: 10 }}>{s.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 6 }}>{s.date}</div>
                  <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, textDecoration: "underline", marginTop: 12 }}>open the spell →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools */}
      <section className="px-5 md:px-8" style={{ paddingTop: 44, paddingBottom: 46, borderBottom: RULE, background: "var(--pink)" }}>
        <div className="max-w-6xl mx-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <Link href="/coven/calendar" className="no-underline" style={{ background: "#fff", border: RULE, color: "var(--dark)", padding: "26px 24px", display: "block" }}>
            <div style={{ fontSize: 34, lineHeight: 1 }}>🗓️</div>
            <div className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 1, marginTop: 10 }}>the manifestation calendar.</div>
            <p style={{ fontSize: 16, lineHeight: 1.45, fontWeight: 600, margin: "10px 0 0" }}>Every big astrology date, with your intention, mini ritual and journal prompt.</p>
          </Link>
          <Link href="/coven/diary" className="no-underline" style={{ background: "#fff", border: RULE, color: "var(--dark)", padding: "26px 24px", display: "block" }}>
            <div style={{ fontSize: 34, lineHeight: 1 }}>📔</div>
            <div className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 1, marginTop: 10 }}>your manifestation diary.</div>
            <p style={{ fontSize: 16, lineHeight: 1.45, fontWeight: 600, margin: "10px 0 0" }}>Track your goals, log your weekly moves and keep every sign and win in one place.</p>
          </Link>
          <div style={{ background: "var(--dark)", color: "#fff", padding: "26px 24px" }}>
            <span style={{ display: "inline-block", background: "var(--pink)", color: "var(--dark)", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 11px", transform: "rotate(-2deg)" }}>coming soon</span>
            <div className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 1, marginTop: 14, color: "#fff" }}>witchy bestie matching.</div>
          </div>
        </div>
      </section>

      {/* Next moon + personal season */}
      <section className="px-5 md:px-8" style={{ paddingTop: 44, paddingBottom: 46, borderBottom: RULE, background: "#fff" }}>
        <div className="max-w-6xl mx-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {nextMoon && (
            <Link href={`/your-season/moon?type=${nextMoon.type}&date=${nextMoon.date}&sign=${nextMoon.sign}&degree=${nextMoon.degree}`} className="no-underline" style={{ background: "var(--dark)", color: "#fff", padding: "26px 24px", display: "block" }}>
              <div style={{ ...label, color: "var(--pink)" }}>🌙 the next moon</div>
              <div className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 1, marginTop: 10, color: "#fff" }}>{nextMoon.name}.</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 10 }}>{nextMoon.when}</div>
              <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, textDecoration: "underline", marginTop: 14 }}>read yours + get the ritual →</div>
            </Link>
          )}
          <Link href="/dashboard" className="no-underline" style={{ background: "var(--lav-light)", border: RULE, color: "var(--dark)", padding: "26px 24px", display: "block" }}>
            <div style={label}>🪐 your personal season</div>
            <div className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 1, marginTop: 10 }}>{season ? `${season.sign.toLowerCase()} szn, ` : ""}written for your chart.</div>
            <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, textDecoration: "underline", marginTop: 14 }}>open my szn →</div>
          </Link>
        </div>
      </section>

      {/* Coven chat */}
      <section className="px-5 md:px-8" style={{ paddingTop: 44, paddingBottom: 46, borderBottom: RULE }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="display" style={{ fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1 }}>the baddie <span className="pk">chat.</span></h2>
          {messages.length > 0 ? (
            <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
              {messages.map((m) => (
                <div key={m.id} style={{ background: "#fff", border: RULE, padding: "13px 16px", fontSize: 16, lineHeight: 1.45 }}>
                  <strong>{m.author}:</strong> {m.content.length > 140 ? `${m.content.slice(0, 140)}...` : m.content}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, margin: "14px 0 0" }}>The room is open, babe. Go say hiii and tell us what you&apos;re calling in. 💜</p>
          )}
          <Link href={`/community/room/${COVEN_ROOM_ID}`} className="no-underline" style={{ ...blackBtn, marginTop: 20 }}>go to the baddie chat →</Link>
        </div>
      </section>

      {/* Replays */}
      {replays.length > 0 && (
        <section className="px-5 md:px-8" style={{ paddingTop: 44, paddingBottom: 60 }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="display" style={{ fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1 }}>the <span className="pk">replays.</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 22 }}>
              {replays.map((w) => (
                <Link key={w.id} href="/events/replays" className="no-underline" style={{ background: "#fff", border: RULE, color: "var(--dark)", display: "block" }}>
                  {w.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.coverImage} alt="" style={{ display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderBottom: RULE }} />
                  )}
                  <div style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.2, padding: "14px 16px 16px" }}>{w.title}</div>
                </Link>
              ))}
            </div>
            <Link href="/events/replays" className="no-underline" style={{ ...blackBtn, marginTop: 20 }}>see every replay →</Link>
          </div>
        </section>
      )}
    </main>
  );
}
