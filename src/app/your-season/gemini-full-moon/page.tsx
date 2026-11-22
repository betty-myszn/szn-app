"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useChart } from "@/lib/use-chart";
import { houseForLongitude } from "@/lib/interpretations";
import { MembersOnly, HoloStar } from "@/components/eleven-eleven/Shared";
import { ORD, PORTAL_HOUSES, card, sectionTitle, label, pinkBtn, blackBtn, pp } from "@/lib/eleven-eleven-hub";

// Full Moon in Gemini, Tuesday 24 November 2026: Moon 2°20' Gemini opposite the Sun 2°20' Sagittarius
// at 14:53 UTC (2:53pm UK, 9:53am ET). Date and degree from lib/sky-bank.ts. Mercury, the ruler of the
// moon, went direct on 13 Nov and leaves its post-retrograde shadow on 29 Nov.

const MOON_LON = 62.33; // 2°20' Gemini
const SUN_LON = 242.33; // 2°20' Sagittarius
const FULL_AT = Date.parse("2026-11-24T14:53:00Z");
const STATE_KEY = "myszn-gemini-full-moon";
const READING_HREF = "/your-season/moon?type=full_moon&date=2026-11-24&sign=Gemini&degree=2";

const MOON_HOUSE: Record<number, string> = {
  1: "The full moon lands on YOU. The way you talk about yourself is changing in real time, so listen to the new words coming out of your mouth this week.",
  2: "Your money story gets read back to you line by line. Notice what you say about money out loud, then change the line that keeps you broke.",
  3: "Your phone is about to light up. The message you've been waiting for, the idea that won't leave you alone and the post you keep drafting all hit peak volume now.",
  4: "Family stories come up for review. Someone says the thing at the dinner table, and you finally get to decide which version of your history you keep.",
  5: "Flirting, dating and your creative ideas peak. Say yes to the conversation that makes you giggle and the project that makes you feel seventeen again.",
  6: "Your to-do list hits overload. Something on it has to go, and your body already knows which thing.",
  7: "A partnership conversation reaches its climax. What's been said between the lines gets said to your face, and you're ready for it.",
  8: "Secrets, shared money and intimacy come into the light. You learn something you needed to know, and it hands you your power back.",
  9: "A belief you've been living by stops making sense. Courses, travel and the big why of your life get rewritten this week.",
  10: "Your work gets SEEN. A public moment or a career conversation peaks, so talk about what you do like you're proud of it.",
  11: "Your friendships hit a turning point. You can see clearly who's cheering for you and who's just watching.",
  12: "The things you've been telling yourself in private come up for air. Dreams get vivid, your intuition gets loud, and an old inner voice gets released.",
};

const SUN_HOUSE: Record<number, string> = {
  1: "Sagittarius season is lighting YOU up, so the whole world is your stage right now. Take up more room.",
  2: "You're being asked to think BIGGER about money. Raise your number and let your income catch up with how much you've grown.",
  3: "Your words carry extra weight. Teach what you know, share it publicly and let it travel further than your usual circle.",
  4: "Home is where your growth is happening. Make your space feel like freedom, somewhere that holds the bigger you.",
  5: "Joy is the assignment. Plan the date, book the trip, make the art and let yourself be wildly lucky in love.",
  6: "Your days want more freedom in them. Build a routine with room for adventure, then actually use the room.",
  7: "Your relationships are the classroom. The right people expand you, and you can feel the difference in your body.",
  8: "Big transformation energy. Investments, shared resources and deep trust are where your next growth spurt lives.",
  9: "This is home turf for the Sun. Study, travel, publish, preach: the bigger life is calling you by name.",
  10: "Your career is in a growth spurt. Aim higher than feels comfortable and let people see the vision.",
  11: "Your future is being shaped by your people. Say your dream out loud to the friends who'll help you build it.",
  12: "Your growth starts on the inside. Rest, retreat and trust that the expansion is real before anyone else can see it.",
};

const WHY: [string, string, string, string][] = [
  ["♊\uFE0E", "gemini is the storyteller", "Gemini is the sign of the twins, of words, messages and the voice in your head. Under a Gemini full moon, whatever you've been thinking on repeat gets loud enough to hear clearly, which makes it the perfect moment to change the script.", "#fff"],
  ["☿\uFE0E", "mercury runs this moon", "Mercury rules Gemini and went direct on Friday the 13th. It stays in its post-retrograde shadow until the 29th of November, so the conversations that stalled through October are finally ready to finish.", "var(--lav-light)"],
  ["♐\uFE0E", "the brand new sagittarius sun", "Two days into Sagittarius season, the Sun sits directly opposite the Moon. Gemini holds the details while Sagittarius holds the big picture, and this full moon asks you to make your daily words match your biggest dream.", "var(--pink-light)"],
];

const STORIES: [string, string][] = [
  ["I'm bad with money.", "I'm getting VERY good with money, and I learn fast."],
  ["I'm too much.", "I'm exactly enough, and my people want all of it."],
  ["Nobody would pay for that.", "My people are already looking for me."],
  ["I'll start when I'm ready.", "I start now and get ready on the way."],
  ["I always pick the wrong ones.", "I pick myself first, so I choose well."],
  ["It's too late for me.", "My timing is mine, and it's perfect."],
  ["I can't say that.", "I say it kindly, and I say it anyway."],
  ["Good things never last for me.", "Good things stay, because I make room for them."],
];

const RITUAL: [string, string][] = [
  ["🕰️", "Do it on Tuesday the 24th, at 2:53pm UK (9:53am ET) or that evening once the moon is up. The full moon glow lasts about three days, so tonight still counts."],
  ["🕯️", "Light a white or silver candle and put your phone on do not disturb, because Gemini WILL try to distract you."],
  ["✍️", "Write letter one, to the old story. Thank her, tell her what she taught you and tell her she's done."],
  ["💌", "Write letter two, from the you who's living the Sagittarius version of your life. Present tense, like it already happened."],
  ["🔥", "Read letter one out loud, then tear it up or burn it safely. Watch it go."],
  ["🌙", "Keep letter two under your pillow until the new moon in Sagittarius on the 8th of December."],
];

const AFFIRMATIONS = [
  "My words create my world, so I choose them like a queen.",
  "I tell the truth, and the truth makes me magnetic.",
  "I'm done repeating stories that keep me small.",
  "My voice is worth listening to, and people listen.",
  "I'm allowed to change my mind and change my whole life.",
  "My ideas make me money.",
  "I say yes to the bigger life that's asking for me.",
  "Everything I release tonight makes room for something better.",
];

// The journal prompt for the house the full moon lands in, so her first prompt is about her chart.
const HOUSE_PROMPT: Record<number, string> = {
  1: "What new words keep coming out of my mouth about who I am, and which old description of myself am I ready to drop for good?",
  2: "What do I say about money when nobody's listening, and what's the richer sentence I'm choosing from tonight?",
  3: "Which message have I been drafting in my head for weeks, and what happens in my life once I finally send it?",
  4: "Which family story have I been living inside, and which version of my history do I choose to keep from now on?",
  5: "What would I create, wear or flirt with if I stopped worrying about looking silly?",
  6: "Which thing on my to-do list is my body begging me to drop, and what does my day look like without it?",
  7: "What's been said between the lines in my closest partnership, and what do I want to say out loud?",
  8: "What truth about money, intimacy or power have I been avoiding, and how does knowing it give me my power back?",
  9: "Which belief about what's possible for me has stopped making sense, and what do I believe now?",
  10: "How would I talk about my work if I was completely proud of it, and who needs to hear me say it?",
  11: "Who's genuinely cheering for me, and which friendships do I want more of in my bigger life?",
  12: "What have I been telling myself in private that I'm ready to release tonight?",
};

const PROMPTS = [
  "What's the old story I keep telling about myself, and where did I first learn it?",
  "What did I want to say during the Mercury retrograde that I swallowed instead?",
  "If I wrote the next chapter of my life like a bestselling novel, what happens in it?",
  "What conversation would change everything if I had it this week?",
  "Which two versions of me are pulling in different directions right now, and which one am I choosing?",
  "What am I ready to stop explaining, justifying or apologising for?",
  "What's the biggest, slightly embarrassing dream I'm ready to say out loud this Sagittarius season?",
];

const COVEN: [string, string, string, string][] = [
  ["🔮", "read the full moon in your chart", "Your full lunation reading goes deep on exactly what this moon is lighting up for you, house by house.", READING_HREF],
  ["💬", "say it in the baddie chat", "Post your new story in the chat. Saying it in front of the coven makes it real.", "/community"],
  ["🕯️", "come to the circle", "Rituals, spells and manifesting together every month, with the replays waiting after.", "/events"],
];

type Saved = { flipped: number[]; oldLetter: string; newLetter: string; released: boolean };
const EMPTY: Saved = { flipped: [], oldLetter: "", newLetter: "", released: false };

export default function GeminiFullMoon() {
  const { chart } = useChart();
  const [s, setS] = useState<Saved>(EMPTY);
  const [aff, setAff] = useState(0);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) setS({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const save = (next: Saved) => {
    setS(next);
    try { localStorage.setItem(STATE_KEY, JSON.stringify(next)); } catch {}
  };
  const flip = (i: number) => save({ ...s, flipped: s.flipped.includes(i) ? s.flipped.filter((x) => x !== i) : [...s.flipped, i] });

  const left = now === null ? null : Math.max(0, FULL_AT - now);
  const cusps = chart?.houses?.length === 12 ? chart.houses.map((h) => h.longitude) : null;
  const moonHouse = cusps ? houseForLongitude(MOON_LON, cusps) : null;
  const sunHouse = cusps ? houseForLongitude(SUN_LON, cusps) : null;

  const AXIS: { glyph: string; name: string; where: string; job: string; house: number | null; lines: Record<number, string>; bg: string }[] = [
    { glyph: "🌕", name: "the moon", where: "2° gemini", job: "what's coming to light", house: moonHouse, lines: MOON_HOUSE, bg: "var(--lav-light)" },
    { glyph: "☀️", name: "the sun", where: "2° sagittarius", job: "where you're growing", house: sunHouse, lines: SUN_HOUSE, bg: "var(--pink-light)" },
  ];

  return (
    <MembersOnly>
      <main style={{ background: "#fff", color: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 72, display: "grid", gap: 48 }}>
          <Link href="/coven" className="no-underline" style={{ ...label, fontSize: 12 }}>← coven home</Link>

          {/* Hero */}
          <section className="holo-edge bg-glitter grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] items-center" style={{ position: "relative", borderRadius: 26, overflow: "hidden", color: "#fff", padding: "clamp(26px, 4.6vw, 54px)", gap: 20 }}>
            <div>
              <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🌕 tuesday 24th of november</span>
              <h1 className="display" style={{ fontSize: "clamp(38px, 6.4vw, 80px)", lineHeight: 0.98, marginTop: 16, color: "#fff" }}>FULL MOON IN GEMINI, BABYYYY! 🌕💬</h1>
              <p style={{ fontSize: 17, lineHeight: 1.55, fontWeight: 600, margin: "14px 0 0", maxWidth: 560 }}>
                The moon goes full at 2° Gemini, right across from the brand new Sagittarius Sun. Gemini rules your words, your thoughts and the stories you tell about yourself, and Mercury, the planet in charge of this moon, only just turned direct on Friday the 13th. Everything that got stuck in your throat during the retrograde is ready to come OUT, so this is the moon for saying it, sending it and rewriting the story you&apos;ve been living in. ✨
              </p>
              <a href="#ritual" className="no-underline" style={{ ...pinkBtn, marginTop: 22, border: "2px solid #fff" }}>🕯️ do the ritual →</a>
            </div>
            <div className="hd-foil" style={{ justifySelf: "center", border: "var(--border)", borderRadius: 22, padding: "22px 30px", textAlign: "center", color: "var(--dark)", transform: "rotate(3deg)", boxShadow: "6px 6px 0 #fff" }}>
              <div className="display" style={{ fontSize: "clamp(80px, 12vw, 130px)", lineHeight: 0.9 }}>{"\u264A\uFE0E"}</div>
              <div style={{ ...label, marginTop: 8 }}>2°20&apos; gemini · 2:53pm UK</div>
            </div>
            <HoloStar size={46} style={{ bottom: 18, left: 18 }} />
          </section>

          {/* Countdown */}
          {left !== null && (
            <section className="szn-holo" style={{ border: "var(--border)", borderRadius: 22, boxShadow: "6px 6px 0 var(--dark)", padding: "22px 22px", textAlign: "center" }}>
              {left > 0 ? (
                <>
                  <div style={label}>🌕 the moon is full in</div>
                  <div className="flex justify-center gap-3 flex-wrap" style={{ marginTop: 12 }}>
                    {[["days", Math.floor(left / 86400000)], ["hours", Math.floor(left / 3600000) % 24], ["mins", Math.floor(left / 60000) % 60], ["secs", Math.floor(left / 1000) % 60]].map(([k, v]) => (
                      <div key={k as string} style={{ background: "#fff", border: "var(--border)", borderRadius: 14, boxShadow: "3px 3px 0 var(--dark)", padding: "10px 14px", minWidth: 72 }}>
                        <div className="display" style={{ fontSize: 40, lineHeight: 1 }}>{String(v).padStart(2, "0")}</div>
                        <div style={{ ...label, fontSize: 10, marginTop: 4 }}>{k}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: "12px 0 0" }}>2:53pm UK · 9:53am ET · tuesday 24th of november 🕯️</p>
                </>
              ) : (
                <>
                  <div className="display" style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1 }}>she&apos;s FULL, babe. 🌕</div>
                  <p style={{ fontSize: 15.5, fontWeight: 700, margin: "10px 0 0" }}>The glow lasts about three days, so the ritual still works tonight.</p>
                </>
              )}
            </section>
          )}

          {/* Why this moon */}
          <section>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>♊ the sky, explained</span>
            <h2 className="display" style={{ ...sectionTitle, marginTop: 14 }}>why this moon <span className="pk">wants your voice.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginTop: 22 }}>
              {WHY.map(([g, t, b, bg]) => (
                <div key={t} className="holo-edge" style={{ ...card, padding: "22px 22px 24px", background: bg }}>
                  <span style={{ background: "#fff", width: 56, height: 56, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 26, boxShadow: "3px 3px 0 var(--dark)" }}>{g}</span>
                  <div className="display" style={{ fontSize: 28, lineHeight: 1, marginTop: 14 }}>{t}.</div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.55, fontWeight: 600, margin: "10px 0 0" }}>{b}</p>
                </div>
              ))}
            </div>
          </section>

          {/* In your chart */}
          <section>
            <h2 className="display" style={sectionTitle}>the full moon, <span className="pk">in YOUR chart.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10, maxWidth: 680 }}>A full moon is the Sun and Moon pulling from opposite sides of your chart. Here&apos;s what each end is doing for you.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 22 }}>
              {AXIS.map((p) => (
                <div key={p.name} className="holo-edge" style={{ ...card, padding: "24px 22px 26px", background: p.bg }}>
                  <div className="flex items-center gap-3">
                    <span style={{ background: "#fff", width: 60, height: 60, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontSize: 30, boxShadow: "3px 3px 0 var(--dark)" }}>{p.glyph}</span>
                    <div>
                      <div className="display" style={{ fontSize: 30, lineHeight: 1 }}>{p.name}.</div>
                      <div style={{ ...label, fontSize: 11, marginTop: 4 }}>{p.where} · {p.job}</div>
                    </div>
                  </div>
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
            <Link href={READING_HREF} className="no-underline" style={{ ...blackBtn, marginTop: 20, fontSize: 12 }}>🔮 read my full gemini moon reading →</Link>
          </section>

          {/* Rewrite the story */}
          <section className="holo-edge" style={{ borderRadius: 26, padding: "clamp(24px, 3.6vw, 38px)", background: "var(--lav-light)" }}>
            <h2 className="display" style={sectionTitle}>rewrite <span className="pk">the story.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10, maxWidth: 700 }}>Gemini is the storyteller, so tonight we edit. Tap every old line you&apos;ve caught yourself saying and watch it turn into the new one.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginTop: 22 }}>
              {STORIES.map(([oldLine, newLine], i) => {
                const on = s.flipped.includes(i);
                return (
                  <button key={oldLine} onClick={() => flip(i)} className={on ? "hd-foil" : undefined} style={{ ...card, border: "var(--border)", padding: "18px 16px", textAlign: "left", cursor: "pointer", background: on ? undefined : "#fff", color: "var(--dark)", fontFamily: "inherit", minHeight: 132 }}>
                    <div style={{ ...label, fontSize: 10 }}>{on ? "✨ the new story" : "💬 the old story"}</div>
                    <p className="display" style={{ fontSize: 22, lineHeight: 1.12, margin: "8px 0 0" }}>&ldquo;{on ? newLine : oldLine}&rdquo;</p>
                  </button>
                );
              })}
            </div>
            {s.flipped.length > 0 && (
              <p className="display" style={{ fontSize: "clamp(20px, 2.6vw, 28px)", lineHeight: 1.15, marginTop: 18 }}>
                {s.flipped.length} stor{s.flipped.length === 1 ? "y" : "ies"} rewritten. say the new one{s.flipped.length === 1 ? "" : "s"} out loud until your mouth gets used to it. 💋
              </p>
            )}
          </section>

          {/* Journal prompts */}
          <section>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>✍️ grab your journal</span>
            <h2 className="display" style={{ ...sectionTitle, marginTop: 14 }}>full moon <span className="pk">journal prompts.</span></h2>
            <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10, maxWidth: 700 }}>Gemini thinks out loud, so write fast and don&apos;t edit. Pick the ones that make your stomach flip, those are the ones you need.</p>
            {moonHouse && (
              <div className="hd-foil" style={{ marginTop: 22, border: "var(--border)", borderRadius: 20, boxShadow: "6px 6px 0 var(--dark)", padding: "22px 22px", color: "var(--dark)" }}>
                <div style={{ ...label, fontSize: 11 }}>✨ your prompt · the moon is in your {ORD[moonHouse]} house</div>
                <p className="display" style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.12, margin: "10px 0 0" }}>{HOUSE_PROMPT[moonHouse]}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 18 }}>
              {PROMPTS.map((p, i) => (
                <div key={p} style={{ ...card, border: "var(--border)", padding: "18px 18px", background: i % 3 === 0 ? "var(--lav-light)" : i % 3 === 1 ? "var(--pink-light)" : "#fff" }}>
                  <div style={{ ...label, fontSize: 10 }}>prompt {i + 1}</div>
                  <p style={{ fontSize: 17, lineHeight: 1.45, fontWeight: 700, margin: "8px 0 0" }}>{p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ritual: the two letters */}
          <section id="ritual" style={{ scrollMarginTop: 90, display: "grid", gap: 20 }}>
            <div>
              <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>👯 the twins ritual</span>
              <h2 className="display" style={{ ...sectionTitle, marginTop: 14 }}>two letters, <span className="pk">two versions of you.</span></h2>
              <p style={{ fontSize: 16, fontWeight: 600, marginTop: 10, maxWidth: 720 }}>Gemini is the twins, so this ritual has two halves: one letter to the old story you&apos;re releasing, and one from the you who&apos;s already living the next chapter. Write them here (they only save on your phone) or on paper.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="holo-edge" style={{ ...card, padding: "22px 22px", background: "var(--pink-light)" }}>
                <div style={label}>✍️ letter one · to the old story</div>
                {s.released ? (
                  <div style={{ marginTop: 12, background: "var(--dark)", color: "#fff", borderRadius: 14, padding: "26px 18px", textAlign: "center" }}>
                    <div className="display" style={{ fontSize: 34, lineHeight: 1, color: "#fff" }}>released. 🔥</div>
                    <p style={{ fontSize: 15, fontWeight: 700, margin: "8px 0 0" }}>She&apos;s gone, babe. You don&apos;t have to carry her into Sagittarius season.</p>
                    <button onClick={() => save({ ...s, released: false, oldLetter: "" })} style={{ ...pinkBtn, marginTop: 14, fontSize: 12, border: "2px solid #fff" }}>write another</button>
                  </div>
                ) : (
                  <>
                    <textarea value={s.oldLetter} onChange={(e) => save({ ...s, oldLetter: e.target.value })} placeholder="Dear old story, thank you for..." rows={7} style={{ width: "100%", marginTop: 12, border: "var(--border)", borderRadius: 14, padding: "12px 14px", fontSize: 15.5, fontWeight: 600, fontFamily: "inherit", color: "var(--dark)", background: "#fff", resize: "vertical" }} />
                    <button onClick={() => save({ ...s, released: true, oldLetter: "" })} disabled={!s.oldLetter.trim()} style={{ ...blackBtn, marginTop: 12, fontSize: 12, cursor: s.oldLetter.trim() ? "pointer" : "default" }}>🔥 release it</button>
                  </>
                )}
              </div>
              <div className="holo-edge" style={{ ...card, padding: "22px 22px", background: "var(--lav-light)" }}>
                <div style={label}>💌 letter two · from the next-chapter you</div>
                <textarea value={s.newLetter} onChange={(e) => save({ ...s, newLetter: e.target.value })} placeholder="It's December and I can't believe how much has changed. I..." rows={7} style={{ width: "100%", marginTop: 12, border: "var(--border)", borderRadius: 14, padding: "12px 14px", fontSize: 15.5, fontWeight: 600, fontFamily: "inherit", color: "var(--dark)", background: "#fff", resize: "vertical" }} />
                <p style={{ fontSize: 14.5, fontWeight: 700, margin: "10px 0 0" }}>Keep this one. Read it again at the new moon on the 8th of December. 🌙</p>
              </div>
            </div>
            <div style={{ ...card, border: "var(--border)", padding: "22px 22px" }}>
              <div style={label}>🕯️ your full moon ritual</div>
              <ol style={{ marginTop: 12, paddingLeft: 0, listStyle: "none", display: "grid", gap: 12 }}>
                {RITUAL.map(([e, t], i) => (
                  <li key={t} className="flex gap-3 items-start" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.45 }}>
                    <span style={{ background: "var(--pink)", color: "#fff", minWidth: 30, height: 30, borderRadius: "50%", border: "var(--border)", display: "grid", placeItems: "center", fontFamily: pp, fontSize: 13, fontWeight: 800 }}>{i + 1}</span>
                    <span>{e} {t}</span>
                  </li>
                ))}
              </ol>
              <div style={{ marginTop: 18, background: "var(--pink)", border: "var(--border)", borderRadius: 16, padding: "18px 18px", color: "var(--dark)" }}>
                <div style={{ ...label, fontSize: 11 }}>✨ say it three times</div>
                <p style={{ fontFamily: pp, fontSize: 17, fontWeight: 800, lineHeight: 1.45, margin: "8px 0 0" }}>
                  Moon in the sign of the twins, I hand you the old story and keep the new one. My words are true, my voice is clear and my life grows as big as I let it. What I say, I become. So it is, so it is, so it is. 🌕
                </p>
              </div>
            </div>
          </section>

          {/* Affirmations */}
          <section className="holo-edge bg-glitter" style={{ position: "relative", borderRadius: 26, padding: "clamp(24px, 3.6vw, 40px)", color: "#fff" }}>
            <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>💬 say it out loud</span>
            <h2 className="display" style={{ ...sectionTitle, color: "#fff", marginTop: 14 }}>full moon affirmations.</h2>
            <div className="hd-foil" style={{ marginTop: 20, border: "var(--border)", borderRadius: 20, boxShadow: "6px 6px 0 #fff", padding: "28px 24px", color: "var(--dark)", textAlign: "center" }}>
              <div style={{ ...label, fontSize: 11 }}>affirmation {aff + 1} of {AFFIRMATIONS.length}</div>
              <p className="display" style={{ fontSize: "clamp(26px, 4vw, 44px)", lineHeight: 1.08, margin: "10px 0 0" }}>&ldquo;{AFFIRMATIONS[aff]}&rdquo;</p>
              <button onClick={() => setAff((a) => (a + 1) % AFFIRMATIONS.length)} style={{ ...blackBtn, marginTop: 20, fontSize: 12 }}>✨ next affirmation →</button>
            </div>
            <p style={{ fontSize: 15.5, fontWeight: 700, marginTop: 16 }}>Gemini loves a voice note, so record your favourite one and send it to yourself. 🎙️</p>
          </section>

          {/* Coven */}
          <section>
            <h2 className="display" style={sectionTitle}>full moon <span className="pk">in the coven.</span></h2>
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
            <div className="display" style={{ fontSize: "clamp(26px, 3.4vw, 40px)", lineHeight: 1.05, color: "#fff", maxWidth: 620 }}>happy full moon, baddie. say the true thing, rewrite the old story and let the whole sky hear you. 🌕</div>
            <Link href="/community" className="no-underline" style={{ ...pinkBtn, border: "2px solid #fff" }}>tell the coven →</Link>
          </section>
        </div>
      </main>
    </MembersOnly>
  );
}
