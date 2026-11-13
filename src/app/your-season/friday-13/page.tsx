"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useChart } from "@/lib/use-chart";
import { houseForLongitude } from "@/lib/interpretations";
import { MembersOnly, HoloStar } from "@/components/eleven-eleven/Shared";
import { ORD, PORTAL_HOUSES, card, sectionTitle, label, pinkBtn, blackBtn, pp } from "@/lib/eleven-eleven-hub";

// Friday 13 November 2026: Mercury turns direct at 5°02' Scorpio (15:53 UTC) and Venus at 22°51'
// Libra (00:27 UTC Sat 14th, still Friday in the US). Stations from lib/sky-bank.ts. Copy built from
// Betty's Threads post of 13 Nov.

const MERCURY_LON = 215.03; // 5°02' Scorpio
const VENUS_LON = 202.85; // 22°51' Libra
const STATE_KEY = "myszn-friday13";

const MERCURY_HOUSE: Record<number, string> = {
  1: "Who you are now, said out loud. Stop explaining the old you to anyone.",
  2: "Money talk: the rate, the raise, the invoice you've been sitting on. Send it.",
  3: "Messages, content, siblings, the neighbours. Hit post, hit send, say the thing.",
  4: "Family conversations and home decisions that have been stuck finally land.",
  5: "Dating, flirting and your creative projects get their words back.",
  6: "Your schedule, your health plan and the work chat that's been jammed for weeks.",
  7: "The relationship talk. Say what you need clearly, and let them answer.",
  8: "Shared money, debts, intimacy and the truth underneath the truth.",
  9: "Courses, travel plans, publishing and the big belief you're rewriting.",
  10: "Career moves: the pitch, the application, the conversation with the boss.",
  11: "Friends, group chats and the future you're planning with your people.",
  12: "Your inner voice, your dreams and the secret you've been keeping from yourself.",
};
const VENUS_HOUSE: Record<number, string> = {
  1: "Your look, your body, your whole vibe. Let yourself be the hot one again.",
  2: "Your prices, your income, your worth. Raise them, babe, starting now.",
  3: "Your words get sweeter and people actually listen. Say the kind thing AND the true thing.",
  4: "Home becomes your sanctuary. Buy the flowers, fix the room, make it gorgeous.",
  5: "Romance, pleasure and play. Your fun is officially back on the menu.",
  6: "Gorgeous routines, a softer workday and a body you treat like a goddess.",
  7: "Love that's reciprocal and partnerships that pay you back in full.",
  8: "Receiving: gifts, investments, intimacy and other people's money flowing your way.",
  9: "Travel, learning and a bigger life that feels expensive in the best way.",
  10: "Being paid AND praised for your work. Ask for the title.",
  11: "Friends who clap the loudest and a future that feels luxurious.",
  12: "The self-love you do behind closed doors. Rest like you're rich.",
};

const DRAGGED: [string, string][] = [
  ["🪞", "The relationships where we abandoned ourselves to keep someone else comfortable."],
  ["💸", "The businesses where we've been undercharging because we're terrified of asking for more."],
  ["⏳", "The people enjoying unlimited access to our time, energy and emotional labour."],
  ["🐍", "The old versions of ourselves we've been desperately trying to outgrow."],
];

const HISTORY: [string, string, string, string][] = [
  ["♀", "friday is venus day", "In Latin it's dies Veneris, the day of Venus, which is why it's vendredi in French and viernes in Spanish. In English, Friday is named after Frigg, the Norse goddess of love, marriage and the home, who later stories often blend with Freyja, the goddess of love, gold and magic. Every Friday belongs to a goddess.", "#fff"],
  ["🌙", "13 is the number of the moon", "Thirteen moon cycles of 28 days make 364 days, almost exactly a year, which is why 13 has been tied to the Moon, the menstrual cycle and women's bodies for thousands of years.", "var(--pink-light)"],
  ["🧹", "a coven of thirteen", "Folklore says a witches' coven gathers thirteen: twelve witches and the one who leads them. Thirteen at the table means the circle is complete.", "var(--lav-light)"],
  ["🔥", "how it became 'unlucky'", "The goddess's day plus the moon's number was too much feminine power for a lot of people. Thirteen got painted as the betrayer at the table, Friday got painted as unlucky, and by the late 1800s 'Friday the 13th' was a full-blown superstition. Bad luck for whom, exactly.", "#fff"],
];

const NOT_AVAILABLE = [
  "undercharging", "one-sided friendships", "being the backup plan", "explaining myself over and over",
  "people who drain me", "playing small", "unpaid emotional labour", "answering at midnight",
  "shrinking in rooms", "chasing anyone", "apologising for wanting more", "my own self-doubt", "waiting to be chosen",
];

const RITUAL: [string, string][] = [
  ["🕯️", "Light your candles and celebrate how far you've come since October."],
  ["📝", "Write down your intentions for love, money and the next chapter."],
  ["✂️", "Decide what you're no longer available for (tap them above, babe)."],
  ["💌", "Make room for relationships that feel reciprocal and opportunities that reflect your worth."],
  ["♀", "Call in the goddess: hand on your heart, say \"Venus, I receive what I'm worth.\""],
  ["🪩", "Say it out loud: MY $$$ MULTIPLIES, MY RELATIONSHIPS FLOURISH, MY NEXT CHAPTER IS MAGICAL."],
];

const VENUS_DIRECT_AT = Date.parse("2026-11-14T00:27:00Z");

const GODDESSES: [string, string, string, string, string][] = [
  ["♀", "venus", "Roman goddess of love, beauty and money", "Today is literally your day, babe. Stop discounting yourself in love AND in business.", "Raise one price, rate or standard tonight, even by a little."],
  ["🐚", "aphrodite", "Greek goddess of love and pleasure", "Pleasure is your birthright and your magnet. The more you enjoy your life, the more it brings you.", "Do one thing purely because it feels delicious."],
  ["🐈‍⬛", "freyja", "Norse goddess of love, gold and magic", "She cried tears of gold and rode a chariot pulled by cats. You're allowed to be soft AND rich AND witchy.", "Wear gold tonight and say your money number out loud."],
  ["🧶", "frigg", "Norse queen Friday is named after", "She knew everyone's fate and told no one. Trust your knowing, even before you can explain it.", "Write down the decision your gut already made."],
  ["🪷", "lakshmi", "Hindu goddess of wealth, beauty and abundance", "Abundance loves a clean, beautiful space. Make room for what you're calling in.", "Clear one surface and put something gorgeous on it."],
  ["🍯", "oshun", "Yoruba orisha of love, sweetness and rivers", "Sweetness is power. Be sweet to yourself first, and watch how the world matches you.", "Add honey to your tea and toast yourself in the mirror."],
  ["🪘", "hathor", "Egyptian goddess of joy, music and dance", "Your joy is a frequency. Turn the music up and move the stuck energy out of your body.", "Dance to three songs, no matter who's watching."],
  ["🌟", "inanna", "Sumerian goddess of love and power, the original Venus", "She went down into the underworld, lost everything and came back crowned. That's your retrograde, babe, and today you rise.", "Write what the last six weeks taught you, then crown yourself."],
  ["🪽", "isis", "Egyptian goddess of magic and healing", "You know how to put yourself back together. Your magic is in your hands and your words.", "Place your hands on your heart and name what's healing."],
  ["🗝️", "hecate", "Greek goddess of witchcraft and the crossroads", "You're standing at a crossroads and you already know which road is yours. Take it.", "Light a candle at your front door and choose your path out loud."],
  ["🌙", "selene", "Greek goddess of the moon", "Thirteen moons, thirteen chances to begin again. You never miss your moment.", "Step outside tonight and say one wish to the moon."],
  ["🔥", "brigid", "Celtic goddess of fire, poetry and creativity", "Your creativity is the fire that funds your life. Feed it.", "Make something tonight, a post, a page, a playlist."],
  ["🐍", "lilith", "the first woman who refused to shrink", "She walked out of the garden rather than lie beneath anyone. Your no is holy.", "Say no to one thing you've been tolerating."],
];

const AFFIRMATIONS = [
  "I am the goddess and today is my day.",
  "I know what I'm worth and I charge for it.",
  "Money loves me and it multiplies in my hands.",
  "I only accept love that is reciprocal.",
  "My boundaries are sacred and I keep them.",
  "I am magnetic, gorgeous and wildly lucky.",
  "Thirteen is my lucky number and the moon is on my side.",
  "I receive with open hands and zero guilt.",
  "My voice is clear and my words make magic.",
  "I am done playing small for anyone's comfort.",
  "Every Friday belongs to me, and so does every win.",
  "My pleasure is a priority, never an afterthought.",
  "My next chapter is f*cking magical, and I'm already living it.",
];

const SPELL_NEEDS: [string, string][] = [
  ["🕯️", "a pink or red candle"], ["📝", "a pen and a bay leaf (or a slip of paper)"], ["🍯", "a little honey or sugar"],
  ["✨", "a pinch of cinnamon"], ["🪙", "a coin (or rose quartz)"], ["🌹", "rose petals, if you have them"],
];

const SPELL_STEPS = [
  "Do it tonight, as close to Venus going direct as you can (12:27am UK, 7:27pm ET). Put on something that makes you feel like a goddess.",
  "Light your candle, put both feet on the floor and take three slow breaths into your belly.",
  "On the bay leaf, write the number you're calling in (your price, your salary, your monthly income) and one word for the love you want.",
  "Drizzle honey over it so it sticks to you, then sprinkle the cinnamon to speed it up.",
  "Lay the coin on top and scatter your rose petals around it.",
  "Hold your hands over the flame and say the spell three times, out loud, like you MEAN it.",
  "Let the candle burn as long as it's safe, then snuff it out (don't blow). Keep the leaf and coin in your purse until the next new moon.",
];

const COVEN: [string, string, string, string][] = [
  ["🔮", "we read the sky for you", "Every station, eclipse and moon lands in YOUR chart on your platform, so you know exactly which part of your life it's lighting up.", "/dashboard"],
  ["🕯️", "we gather and do the magic", "Every month the coven meets live for rituals, spells and manifesting together, with the replays waiting for you after.", "/events"],
  ["👯", "we witness each other", "Post what you're no longer available for in the baddie chat. Saying it in front of the coven makes it real.", "/community"],
];

export default function FridayThirteenth() {
  const { chart } = useChart();
  const [picked, setPicked] = useState<string[]>([]);
  const [aff, setAff] = useState(0);
  const [now, setNow] = useState<number | null>(null);
  const [goddess, setGoddess] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = now === null ? null : Math.max(0, VENUS_DIRECT_AT - now);
  const pull = () => setGoddess((g) => {
    let n = Math.floor(Math.random() * GODDESSES.length);
    if (n === g) n = (n + 1) % GODDESSES.length;
    return n;
  });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) setPicked(JSON.parse(raw));
    } catch {}
  }, []);
  const toggle = (x: string) => {
    const next = picked.includes(x) ? picked.filter((p) => p !== x) : [...picked, x];
    setPicked(next);
    try { localStorage.setItem(STATE_KEY, JSON.stringify(next)); } catch {}
  };

  const cusps = chart?.houses?.length === 12 ? chart.houses.map((h) => h.longitude) : null;
  const mHouse = cusps ? houseForLongitude(MERCURY_LON, cusps) : null;
  const vHouse = cusps ? houseForLongitude(VENUS_LON, cusps) : null;

  const PLANETS: { glyph: string; name: string; when: string; where: string; body: string; house: number | null; lines: Record<number, string>; bg: string }[] = [
    { glyph: "☿", name: "mercury direct", when: "fri 13 nov · 3:53pm UK · 10:53am ET", where: "5° scorpio", body: "Mercury stations direct in Scorpio, shifting how we communicate, make decisions, investigate the truth and process everything that's been coming to the surface.", house: mHouse, lines: MERCURY_HOUSE, bg: "var(--lav-light)" },
    { glyph: "♀", name: "venus direct", when: "sat 14 nov · 12:27am UK · fri 7:27pm ET", where: "22° libra", body: "Venus stations direct in Libra, turning our attention to relationships, self-worth, pleasure, beauty, $$$ and what we actually deserve.", house: vHouse, lines: VENUS_HOUSE, bg: "var(--pink-light)" },
  ];

  return (
    <MembersOnly>
      <main style={{ background: "#fff", color: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 72, display: "grid", gap: 48 }}>
          <Link href="/coven" className="no-underline" style={{ ...label, fontSize: 12 }}>← coven home</Link>

          {/* Hero */}
          <section className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] items-center" style={{ position: "relative", borderRadius: 26, overflow: "hidden", color: "#fff", padding: "clamp(26px, 4.6vw, 54px)", gap: 20 }}>
            <div>
              <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>♀ the day of the goddess</span>
              <h1 className="display" style={{ fontSize: "clamp(38px, 6.4vw, 80px)", lineHeight: 0.98, marginTop: 16, color: "#fff" }}>HAPPY FRIDAY THE F*CKING 13TH, WITCHES! 🖤🔮</h1>
              <p style={{ fontSize: 17, lineHeight: 1.55, fontWeight: 600, margin: "14px 0 0", maxWidth: 560 }}>
                Friday belongs to Venus, 13 belongs to the moon, and today Venus herself goes direct on her own day, just after midnight in Europe, with Mercury turning direct a few hours before her. After weeks of relationship revelations, money reassessments, uncomfortable conversations and questioning absolutely EVERYTHING, we&apos;re finally at the turning point. HOLY F*CKING SH*T, BADDIES. 🔮
              </p>
              <a href="#ritual" className="no-underline" style={{ ...pinkBtn, marginTop: 22, border: "2px solid #fff" }}>🕯️ do the ritual →</a>
            </div>
            <div className="hd-foil" style={{ justifySelf: "center", border: "var(--border)", borderRadius: 22, padding: "22px 30px", textAlign: "center", color: "var(--dark)", transform: "rotate(3deg)", boxShadow: "6px 6px 0 #fff" }}>
              <div className="display" style={{ fontSize: "clamp(80px, 12vw, 130px)", lineHeight: 0.9 }}>13</div>
              <div style={{ ...label, marginTop: 8 }}>♀ the goddess&apos;s day</div>
            </div>
            <HoloStar size={46} style={{ bottom: 18, left: 18 }} />
          </section>

          {/* Countdown to Venus direct */}
          {left !== null && (
            <section className="szn-holo" style={{ border: "var(--border)", borderRadius: 22, boxShadow: "6px 6px 0 var(--dark)", padding: "22px 22px", textAlign: "center" }}>
              {left > 0 ? (
                <>
                  <div style={label}>♀ venus goes direct in</div>
                  <div className="flex justify-center gap-3" style={{ marginTop: 12 }}>
                    {[["hours", Math.floor(left / 3600000)], ["mins", Math.floor(left / 60000) % 60], ["secs", Math.floor(left / 1000) % 60]].map(([k, v]) => (
                      <div key={k as string} style={{ background: "#fff", border: "var(--border)", borderRadius: 14, boxShadow: "3px 3px 0 var(--dark)", padding: "10px 14px", minWidth: 78 }}>
                        <div className="display" style={{ fontSize: 40, lineHeight: 1 }}>{String(v).padStart(2, "0")}</div>
                        <div style={{ ...label, fontSize: 10, marginTop: 4 }}>{k}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: "12px 0 0" }}>12:27am UK · 7:27pm ET · cast the spell as close to it as you can 🕯️</p>
                </>
              ) : (
                <>
                  <div className="display" style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1 }}>she&apos;s DIRECT, babe. 💖</div>
                  <p style={{ fontSize: 15.5, fontWeight: 700, margin: "10px 0 0" }}>Mercury and Venus are both moving forward again. So are you.</p>
                </>
              )}
            </section>
          )}

          {/* Goddess card pull */}
          <section className="holo-edge" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", background: "var(--lav-light)" }}>
            <h2 className="display" style={sectionTitle}>pull your <span className="pk">goddess card.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10 }}>Thirteen goddesses for the thirteenth. Take a breath, ask what you need to hear tonight, and tap the deck.</p>
            {goddess === null ? (
              <button onClick={pull} aria-label="Pull a goddess card" className="flex justify-center" style={{ margin: "24px auto 0", background: "none", border: 0, cursor: "pointer", position: "relative", height: 230, width: "100%" }}>
                {[-8, 0, 8].map((r, i) => (
                  <span key={r} className="bg-glitter" style={{ position: "absolute", left: "50%", top: 0, width: 150, height: 220, marginLeft: -75 + r * 2, transform: `rotate(${r}deg)`, borderRadius: 16, border: "3px solid var(--dark)", boxShadow: "5px 5px 0 var(--dark)", display: "grid", placeItems: "center", zIndex: i }}>
                    {i === 2 && <span className="holo-sticker" style={{ fontSize: 12 }}>✨ tap to pull</span>}
                  </span>
                ))}
              </button>
            ) : (
              <div className="hd-foil" style={{ maxWidth: 520, margin: "24px auto 0", border: "var(--border)", borderRadius: 22, boxShadow: "8px 8px 0 var(--dark)", padding: "28px 24px", textAlign: "center" }}>
                <span style={{ background: "#fff", width: 72, height: 72, borderRadius: "50%", border: "var(--border)", display: "inline-grid", placeItems: "center", fontSize: 36, boxShadow: "3px 3px 0 var(--dark)" }}>{GODDESSES[goddess][0]}</span>
                <div className="display" style={{ fontSize: "clamp(40px, 6vw, 60px)", lineHeight: 1, marginTop: 14 }}>{GODDESSES[goddess][1]}.</div>
                <div style={{ ...label, fontSize: 11, marginTop: 6 }}>{GODDESSES[goddess][2]}</div>
                <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 700, margin: "14px 0 0" }}>{GODDESSES[goddess][3]}</p>
                <div style={{ marginTop: 16, background: "var(--dark)", color: "#fff", borderRadius: 14, padding: "12px 16px" }}>
                  <div style={{ ...label, fontSize: 10, color: "var(--pink)" }}>🕯️ tonight</div>
                  <p style={{ fontSize: 15.5, fontWeight: 700, margin: "4px 0 0" }}>{GODDESSES[goddess][4]}</p>
                </div>
                <button onClick={pull} style={{ ...blackBtn, marginTop: 18, fontSize: 12 }}>🔮 pull another</button>
              </div>
            )}
          </section>

          {/* The goddess: why today is hers */}
          <section>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>♀ a little goddess history</span>
            <h2 className="display" style={{ ...sectionTitle, marginTop: 14 }}>why today is <span className="pk">the goddess&apos;s day.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginTop: 22 }}>
              {HISTORY.map(([g, t, b, bg]) => (
                <div key={t} className="holo-edge" style={{ ...card, padding: "22px 22px 24px", background: bg }}>
                  <span style={{ background: "#fff", minWidth: 56, height: 56, padding: "0 10px", borderRadius: 999, border: "var(--border)", display: "inline-grid", placeItems: "center", fontSize: 24, boxShadow: "3px 3px 0 var(--dark)" }}>{g}</span>
                  <div className="display" style={{ fontSize: 28, lineHeight: 1, marginTop: 14 }}>{t}.</div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.55, fontWeight: 600, margin: "10px 0 0" }}>{b}</p>
                </div>
              ))}
            </div>
            <div className="bg-glitter holo-edge" style={{ marginTop: 22, borderRadius: 20, padding: "22px 24px", color: "#fff" }}>
              <p className="display" style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.15, color: "#fff", margin: 0 }}>This year Venus goes direct on her own day, Friday the 13th. The goddess is literally taking her power back, and so are we. 💜</p>
            </div>
          </section>

          {/* The double direct */}
          <section>
            <h2 className="display" style={sectionTitle}>the double direct, <span className="pk">in YOUR chart.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10, maxWidth: 680 }}>Two planets stop going backwards within nine hours of each other. Here&apos;s where each one turns forward for you.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 22 }}>
              {PLANETS.map((p) => (
                <div key={p.name} className="holo-edge" style={{ ...card, padding: "24px 22px 26px", background: p.bg }}>
                  <div className="flex items-center gap-3">
                    <span style={{ background: "#fff", width: 60, height: 60, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 30, boxShadow: "3px 3px 0 var(--dark)" }}>{p.glyph}</span>
                    <div>
                      <div className="display" style={{ fontSize: 30, lineHeight: 1 }}>{p.name}.</div>
                      <div style={{ ...label, fontSize: 11, marginTop: 4 }}>{p.where}</div>
                    </div>
                  </div>
                  <div style={{ display: "inline-block", marginTop: 14, background: "var(--dark)", color: "#fff", borderRadius: 999, padding: "6px 12px", fontFamily: pp, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>{p.when}</div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.55, fontWeight: 600, margin: "12px 0 0" }}>{p.body}</p>
                  {p.house ? (
                    <div style={{ marginTop: 16, background: "#fff", border: "var(--border)", borderRadius: 14, padding: "14px 16px" }}>
                      <div style={label}>✨ your {ORD[p.house]} house · {PORTAL_HOUSES[p.house][0]}</div>
                      <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 700, margin: "6px 0 0" }}>{p.lines[p.house]}</p>
                    </div>
                  ) : (
                    <Link href="/my-chart" className="no-underline" style={{ ...blackBtn, marginTop: 16, fontSize: 12 }}>add my birth details →</Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="holo-edge" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", background: "var(--lav-light)" }}>
            <h2 className="display" style={sectionTitle}>the retrograde <span className="pk">timeline.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginTop: 22 }}>
              {[
                ["3 oct", "♀ venus retrograde", "Venus turns back at 8° Scorpio and the love and money audit begins."],
                ["24 oct", "☿ mercury retrograde", "Mercury joins her at 20° Scorpio. Cue the mixed messages and the 2am overthinking."],
                ["13 nov", "☿ mercury direct", "The cycle that began on 24 October concludes. Clarity returns, slowly."],
                ["13–14 nov", "♀ venus direct", "Six weeks later, Venus moves forward. Worth, love and money start to move."],
              ].map(([d, t, b], i) => (
                <div key={t} style={{ ...card, border: "var(--border)", padding: "18px 16px", background: i >= 2 ? "var(--dark)" : "#fff", color: i >= 2 ? "#fff" : "var(--dark)" }}>
                  <div className="display" style={{ fontSize: 34, lineHeight: 1, color: i >= 2 ? "var(--pink)" : "var(--dark)" }}>{d}</div>
                  <div style={{ fontFamily: pp, fontSize: 14, fontWeight: 800, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t}</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.5, fontWeight: 600, margin: "6px 0 0" }}>{b}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.55, fontWeight: 700, marginTop: 18, maxWidth: 760 }}>Mercury stays in its post-retrograde shadow until 29 November, picking up speed as it re-crosses the degrees it went back over, and Venus is moving slowly through hers too, so this is the time to integrate the lessons rather than rush every decision at once.</p>
          </section>

          {/* What came up */}
          <section className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-5">
            <div className="hd-foil" style={{ borderRadius: 20, border: "var(--border)", boxShadow: "6px 6px 0 var(--dark)", padding: "26px 24px" }}>
              <div style={label}>👀 the retrograde audit</div>
              <div className="display" style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1, marginTop: 8 }}>what these retrogrades dragged into the light.</div>
              <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 700, marginTop: 12 }}>BABE. THE AUDIT IS COMING TO AN END. Everything you learned about yourself can now turn into decisions, stronger boundaries and real change.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DRAGGED.map(([e, t]) => (
                <div key={t} style={{ ...card, border: "var(--border)", padding: "18px 16px" }}>
                  <span style={{ fontSize: 28 }}>{e}</span>
                  <p style={{ fontSize: 15.5, lineHeight: 1.45, fontWeight: 700, margin: "8px 0 0" }}>{t}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ritual */}
          <section id="ritual" className="holo-edge" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", background: "var(--pink-light)", scrollMarginTop: 90 }}>
            <h2 className="display" style={sectionTitle}>what are you <span className="pk">no longer available for?</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10 }}>Thirteen things, for the thirteenth. Tap every one you&apos;re done with.</p>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 18 }}>
              {NOT_AVAILABLE.map((x) => {
                const on = picked.includes(x);
                return (
                  <button key={x} onClick={() => toggle(x)} style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, padding: "10px 14px", borderRadius: 999, border: "var(--border)", background: on ? "var(--dark)" : "#fff", color: on ? "#fff" : "var(--dark)", boxShadow: "3px 3px 0 var(--dark)", cursor: "pointer", textDecoration: on ? "line-through" : "none" }}>
                    {on ? "✂️ " : ""}{x}
                  </button>
                );
              })}
            </div>
            {picked.length > 0 && (
              <p className="display" style={{ fontSize: "clamp(20px, 2.6vw, 28px)", lineHeight: 1.15, marginTop: 18 }}>
                {picked.length} thing{picked.length === 1 ? "" : "s"} cut loose. no more negotiating with people who benefit from you playing small. 🖤
              </p>
            )}
            <div style={{ ...card, border: "var(--border)", padding: "22px 22px", marginTop: 24 }}>
              <div style={label}>🕯️ your friday 13th ritual</div>
              <ol style={{ marginTop: 12, paddingLeft: 0, listStyle: "none", display: "grid", gap: 12 }}>
                {RITUAL.map(([e, t], i) => (
                  <li key={t} className="flex gap-3 items-start" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.45 }}>
                    <span style={{ background: "var(--pink)", color: "#fff", minWidth: 30, height: 30, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontFamily: pp, fontSize: 13, fontWeight: 800 }}>{i + 1}</span>
                    <span>{e} {t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Goddess affirmations */}
          <section className="holo-edge bg-glitter" style={{ position: "relative", borderRadius: 26, padding: "clamp(24px, 3.6vw, 40px)", color: "#fff" }}>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>♀ goddess affirmations</span>
            <h2 className="display" style={{ ...sectionTitle, color: "#fff", marginTop: 14 }}>13 affirmations for the goddess&apos;s day.</h2>
            <div className="hd-foil" style={{ marginTop: 20, border: "var(--border)", borderRadius: 20, boxShadow: "6px 6px 0 #fff", padding: "28px 24px", color: "var(--dark)", textAlign: "center" }}>
              <div style={{ ...label, fontSize: 11 }}>affirmation {aff + 1} of 13</div>
              <p className="display" style={{ fontSize: "clamp(26px, 4vw, 44px)", lineHeight: 1.08, margin: "10px 0 0" }}>&ldquo;{AFFIRMATIONS[aff]}&rdquo;</p>
              <button onClick={() => setAff((a) => (a + 1) % AFFIRMATIONS.length)} style={{ ...blackBtn, marginTop: 20, fontSize: 12 }}>✨ next affirmation →</button>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2" style={{ marginTop: 22, paddingLeft: 0, listStyle: "none" }}>
              {AFFIRMATIONS.map((a, i) => (
                <li key={a}>
                  <button onClick={() => setAff(i)} style={{ background: "none", border: 0, padding: 0, color: "#fff", textAlign: "left", cursor: "pointer", fontSize: 15.5, lineHeight: 1.5, fontWeight: i === aff ? 800 : 600, fontFamily: "inherit" }}>
                    <span style={{ color: "var(--pink)", fontFamily: pp, fontWeight: 800 }}>{String(i + 1).padStart(2, "0")}</span> {a}
                  </button>
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 15.5, fontWeight: 700, marginTop: 16 }}>Say them out loud in the mirror tonight, then screenshot your favourite and make it your lock screen. 💅</p>
          </section>

          {/* The spell */}
          <section className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-5">
            <div className="holo-edge" style={{ ...card, padding: "26px 24px", background: "var(--lav-light)" }}>
              <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🔮 tonight&apos;s spell</span>
              <div className="display" style={{ fontSize: "clamp(32px, 4.4vw, 50px)", lineHeight: 1, marginTop: 14 }}>the venus worth spell.</div>
              <p style={{ fontSize: 15.5, lineHeight: 1.55, fontWeight: 600, margin: "10px 0 0" }}>A love + money spell for the night Venus takes her power back. You&apos;ll need:</p>
              <ul style={{ marginTop: 14, paddingLeft: 0, listStyle: "none", display: "grid", gap: 8 }}>
                {SPELL_NEEDS.map(([e, t]) => (
                  <li key={t} style={{ background: "#fff", border: "var(--border)", borderRadius: 999, padding: "8px 14px", fontSize: 14.5, fontWeight: 700, boxShadow: "3px 3px 0 var(--dark)" }}>{e} {t}</li>
                ))}
              </ul>
            </div>
            <div style={{ ...card, border: "var(--border)", padding: "24px 22px" }}>
              <div style={label}>🕯️ how to cast it</div>
              <ol style={{ marginTop: 12, paddingLeft: 0, listStyle: "none", display: "grid", gap: 12 }}>
                {SPELL_STEPS.map((t, i) => (
                  <li key={t} className="flex gap-3 items-start" style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.45 }}>
                    <span style={{ background: "var(--dark)", color: "#fff", minWidth: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: pp, fontSize: 13, fontWeight: 800 }}>{i + 1}</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
              <div style={{ marginTop: 18, background: "var(--pink)", border: "var(--border)", borderRadius: 16, padding: "18px 18px", color: "var(--dark)" }}>
                <div style={{ ...label, fontSize: 11 }}>✨ say it three times</div>
                <p style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.45, margin: "8px 0 0" }}>
                  Venus, goddess of love and gold, on your own day you take your power back, and so do I. I know my worth, I name my price and I receive it in full. What I&apos;m owed comes to me, what drains me leaves me, and love comes back to me multiplied. So it is, so it is, so it is. 🖤
                </p>
              </div>
            </div>
          </section>

          {/* In the coven */}
          <section>
            <h2 className="display" style={sectionTitle}>being a witch <span className="pk">in the coven.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10, maxWidth: 720 }}>A coven is a circle of women who do magic together and want each other to WIN. Days like today are exactly what we&apos;re here for.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginTop: 22 }}>
              {COVEN.map(([e, t, b, href], i) => (
                <Link key={t} href={href} className="no-underline holo-edge" style={{ ...card, padding: "22px 22px 24px", background: i === 1 ? "var(--lav-light)" : i === 2 ? "var(--pink-light)" : "#fff" }}>
                  <span style={{ background: "#fff", width: 56, height: 56, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 26, boxShadow: "3px 3px 0 var(--dark)" }}>{e}</span>
                  <div className="display" style={{ fontSize: 26, lineHeight: 1, marginTop: 14 }}>{t}.</div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 600, margin: "10px 0 0" }}>{b}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="holo-edge bg-glitter flex flex-wrap items-center justify-between gap-5" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", color: "#fff" }}>
            <div className="display" style={{ fontSize: "clamp(26px, 3.4vw, 40px)", lineHeight: 1.05, color: "#fff", maxWidth: 620 }}>happy goddess day. may your $$$ multiply, your relationships flourish and your next chapter be f*cking magical. 🪩</div>
            <Link href="/community" className="no-underline" style={{ ...pinkBtn, border: "2px solid #fff" }}>tell the coven →</Link>
          </section>
        </div>
      </main>
    </MembersOnly>
  );
}
