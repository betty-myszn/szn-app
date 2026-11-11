"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { useHumanDesign } from "@/lib/use-human-design";
import { houseForLongitude } from "@/lib/interpretations";

// The 11/11 portal hub: the workshop deck (11-11_Portal_Workshop_MYSZN_v3) turned into a members'
// page she can work through at her own pace. The portal house and the two node houses are read
// off her own chart; her Human Design authority picks which "yes" test to trust. Journal answers
// stay in this browser only (localStorage), so nothing here is stored on the server.

const poppins = "var(--font-poppins), Poppins, sans-serif";

// This week's sky, as taught in the workshop: the Scorpio New Moon at 17° Scorpio and the nodes
// at 26° Leo (south) / 26° Aquarius (north).
const NEW_MOON_LON = 210 + 17;
const SOUTH_NODE_LON = 120 + 26;
const NORTH_NODE_LON = 300 + 26;

const PORTAL_HOUSES: Record<number, [string, string]> = {
  1: ["self + identity", "A whole new you."],
  2: ["money + worth", "A rich b*tch money story."],
  3: ["voice + ideas", "Saying it out loud."],
  4: ["home + roots", "A home that holds you."],
  5: ["pleasure + romance", "More joy. More play."],
  6: ["work + routine", "Days that feel like yours."],
  7: ["partnership", "Love that shows up."],
  8: ["receiving + intimacy", "Bigger, braver receiving."],
  9: ["beliefs + adventure", "A bigger, freer life."],
  10: ["career + legacy", "Your name in lights."],
  11: ["community + future", "Your people. Your future."],
  12: ["rest + spirit", "Deep rest. Real healing."],
};

// Keyed by the house the South Node (Leo) sits in.
const NODE_SHIFT: Record<number, string> = {
  1: "From going it alone to letting people in.",
  2: "From white-knuckle security to receiving.",
  3: "From endless chatter to your big truth.",
  4: "From hiding at home to being seen out there.",
  5: "From the solo spotlight to the collective.",
  6: "From constant doing to trust and rest.",
  7: "From living for others to choosing you.",
  8: "From other people's money to your own.",
  9: "From searching far away to speaking up.",
  10: "From the career mask to coming home.",
  11: "From blending in to taking centre stage.",
  12: "From escaping life to building one daily.",
};

const AUTHORITY: Record<string, [string, string]> = {
  emotional: ["emotional", "Ride the wave first. Clarity arrives over time, so sleep on it. Circle your wish tonight, then confirm it once your wave settles."],
  sacral: ["sacral", "Your gut answers first. Listen for the uh-huh or the uhn-uhn."],
  splenic: ["splenic", "A quiet, instant knowing in the moment. It speaks once. Trust it."],
  ego: ["ego", "Ask your heart what it wants and what you're willing to commit to."],
  self: ["self-projected", "Say it out loud and listen. Your own voice tells you the truth."],
  mental: ["mental", "Talk it through with people you trust, somewhere that feels right."],
  lunar: ["lunar", "Give big decisions a full lunar cycle, about 28 days. Circle your wish tonight, then confirm it once your cycle settles."],
};

const WISH_MAP: [string, number[], string][] = [
  ["💸 money", [2], "Venus"], ["💌 love", [7], "Venus"], ["💃 body", [1, 6], ""], ["🏡 home", [4], "the Moon"],
  ["💼 work", [10, 6], ""], ["👯 friendship", [11], ""], ["✈️ adventure", [9], "Jupiter"], ["🎨 creativity", [5], "the Sun"],
  ["🍓 pleasure", [5], "Venus"], ["🔮 spirit", [12], "Neptune"], ["✦ the secret one", [8], "Pluto"],
];
const MAIN_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

const ORD = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

const CSS = `
.el-wrap{max-width:60rem;margin:0 auto;}
.el-tag{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--pink);}
.el-hero{background:var(--dark);border-bottom:var(--border);padding:52px 22px;}
.el-hero .el-in{max-width:60rem;margin:0 auto;display:grid;grid-template-columns:1.2fr .8fr;gap:30px;align-items:center;}
.el-back{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lav);text-decoration:none;}
.el-hero .el-tag{color:var(--lav);margin-top:20px;margin-bottom:10px;}
.el-hero h1{font-family:${poppins};font-weight:800;color:#fff;font-size:clamp(32px,5.4vw,54px);letter-spacing:-1px;line-height:1.02;text-transform:lowercase;}
.el-hero p{font-size:15px;color:#fff;line-height:1.8;margin-top:16px;max-width:34rem;}
.el-hero img{width:100%;max-width:360px;justify-self:center;display:block;border:3px solid #fff;border-radius:22px;}
@media(max-width:720px){.el-hero .el-in{grid-template-columns:1fr;} .el-hero img{max-width:280px;}}
.el-steps{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px;}
.el-steps a{font-family:${poppins};font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--dark);background:var(--lav);border:1.5px solid #fff;padding:8px 13px;border-radius:30px;text-decoration:none;}
.el-sec{padding:52px 22px;border-bottom:var(--border);scroll-margin-top:70px;}
.el-sec.lav{background:var(--lav-light);} .el-sec.pink{background:var(--pink-bg);} .el-sec.dark{background:var(--dark);color:#fff;}
.el-head h2{font-family:${poppins};font-weight:800;font-size:clamp(26px,4.4vw,38px);letter-spacing:-.8px;line-height:1.05;text-transform:lowercase;margin-top:8px;}
.el-sec.dark .el-tag{color:var(--lav);}
.el-lead{font-size:15px;line-height:1.75;margin-top:12px;max-width:42rem;font-weight:500;}
.el-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:28px;}
.el-grid.three{grid-template-columns:repeat(3,1fr);}
@media(max-width:760px){.el-grid,.el-grid.three{grid-template-columns:1fr;}}
.el-card{background:#fff;color:var(--dark);border:var(--border);box-shadow:6px 6px 0 var(--dark);padding:22px;}
.el-card.pink{background:var(--pink-bg);} .el-card.lav{background:var(--lav-light);}
.el-card h3{font-family:${poppins};font-weight:800;font-size:17px;letter-spacing:-.3px;text-transform:lowercase;margin-bottom:6px;}
.el-card p{font-size:14px;line-height:1.7;}
.el-k{font-family:${poppins};font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--pink);margin-bottom:6px;}
.el-you{margin-top:28px;background:var(--dark);color:#fff;border:var(--border);box-shadow:10px 10px 0 var(--pink);padding:28px;}
.el-you .el-k{color:var(--lav);}
.el-you h3{font-family:${poppins};font-weight:800;font-size:clamp(20px,3.4vw,28px);letter-spacing:-.5px;text-transform:lowercase;line-height:1.15;}
.el-you p{font-size:15px;line-height:1.75;margin-top:10px;}
.el-quote{font-family:${poppins};font-weight:800;font-size:15px;text-transform:lowercase;}
.el-list{list-style:none;counter-reset:s;margin-top:22px;}
.el-list li{counter-increment:s;position:relative;padding:0 0 14px 42px;font-size:15px;line-height:1.7;}
.el-list li::before{content:counter(s);position:absolute;left:0;top:-1px;width:28px;height:28px;border-radius:50%;background:var(--pink);color:#fff;border:1.5px solid var(--dark);display:grid;place-items:center;font-family:${poppins};font-weight:800;font-size:12px;}
.el-sec.dark .el-list li::before{background:var(--lav);color:var(--dark);border-color:var(--lav);}
.el-j{margin-top:22px;background:#fff;color:var(--dark);border:var(--border);box-shadow:6px 6px 0 var(--dark);padding:20px;}
.el-j label{display:block;font-family:${poppins};font-weight:800;font-size:13.5px;text-transform:lowercase;margin:14px 0 8px;}
.el-j label:first-child{margin-top:0;}
.el-j textarea{width:100%;min-height:84px;border:1.5px solid var(--dark);padding:12px;font-size:14.5px;line-height:1.6;font-family:inherit;color:var(--dark);background:#fff;resize:vertical;}
.el-saved{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:10px;}
.el-pills{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;}
.el-pill{font-family:${poppins};font-weight:800;font-size:12px;letter-spacing:.05em;text-transform:uppercase;background:#fff;color:var(--dark);border:1.5px solid var(--dark);box-shadow:3px 3px 0 var(--dark);padding:9px 14px;}
.el-timer{margin-top:22px;display:flex;flex-wrap:wrap;align-items:center;gap:16px;}
.el-clock{font-family:${poppins};font-weight:800;font-size:44px;letter-spacing:-1px;font-variant-numeric:tabular-nums;}
.el-btn{display:inline-flex;align-items:center;gap:8px;background:var(--pink);color:#fff;font-family:${poppins};font-weight:800;font-size:12px;letter-spacing:.05em;text-transform:uppercase;padding:13px 20px;border:1.5px solid var(--dark);box-shadow:4px 4px 0 var(--dark);text-decoration:none;cursor:pointer;}
.el-claim{display:grid;gap:12px;margin-top:22px;}
.el-claim div{background:#fff;color:var(--dark);border:var(--border);padding:16px 18px;font-family:${poppins};font-weight:800;font-size:17px;text-transform:lowercase;}
`;

function useJournal(key: string): [string, (v: string) => void] {
  const storageKey = `myszn-1111-${key}`;
  const [value, setValue] = useState("");
  useEffect(() => {
    try { setValue(localStorage.getItem(storageKey) ?? ""); } catch { /* storage blocked: still usable, just not remembered */ }
  }, [storageKey]);
  const save = (v: string) => {
    setValue(v);
    try { localStorage.setItem(storageKey, v); } catch { /* ignore */ }
  };
  return [value, save];
}

function Journal({ id, prompts }: { id: string; prompts: string[] }) {
  return (
    <div className="el-j">
      {prompts.map((p, i) => <JournalField key={i} id={`${id}-${i}`} prompt={p} />)}
      <div className="el-saved">💾 saved on this device as you type</div>
    </div>
  );
}

function JournalField({ id, prompt }: { id: string; prompt: string }) {
  const [v, setV] = useJournal(id);
  return (
    <>
      <label htmlFor={id}>{prompt}</label>
      <textarea id={id} value={v} onChange={(e) => setV(e.target.value)} />
    </>
  );
}

function ElevenMinuteTimer() {
  const [left, setLeft] = useState(11 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => (s <= 1 ? (setRunning(false), 0) : s - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="el-timer">
      <span className="el-clock">{mm}:{ss}</span>
      <button className="el-btn" onClick={() => { if (left === 0) setLeft(11 * 60); setRunning((r) => !r); }}>
        {running ? "⏸ pause" : left === 0 ? "↺ again" : "⏱ start 11 minutes"}
      </button>
      {left === 0 && <span className="el-quote">time, babe. now star your three.</span>}
    </div>
  );
}

export default function ElevenElevenHub() {
  const { member, ready } = useMember();
  const { chart } = useChart();
  const { hd } = useHumanDesign();

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>members only, babe.</h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  const cusps = chart?.houses?.length === 12 ? chart.houses.map((h) => h.longitude) : null;
  const portalHouse = cusps ? houseForLongitude(NEW_MOON_LON, cusps) : null;
  const southHouse = cusps ? houseForLongitude(SOUTH_NODE_LON, cusps) : null;
  const northHouse = cusps ? houseForLongitude(NORTH_NODE_LON, cusps) : null;
  const authority = hd ? AUTHORITY[hd.authority] : null;
  const pl = (name: string) => chart?.planets.find((x) => x.name === name) ?? null;

  return (
    <>
      <style>{CSS}</style>

      <section className="el-hero">
        <div className="el-in">
          <div>
            <Link href="/your-season" className="el-back">← your season</Link>
            <div className="el-tag">🔮 the 11/11 portal · your hub</div>
            <h1>step through <span className="pk">the portal.</span></h1>
            <p>Intuition on max, signs everywhere and a whole new timeline with your name on it. Everything from the 11/11 workshop lives here, so you can go back through every exercise, every prompt and every ritual at your own pace. 💜</p>
            <div className="el-steps">
              <a href="#portal">01 the portal</a>
              <a href="#sky">02 the sky</a>
              <a href="#old">03 the old timeline</a>
              <a href="#next">04 the next timeline</a>
              <a href="#through">05 step through</a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coven/betty-witch-email.jpg" alt="Betty in a pink witch hat" />
        </div>
      </section>

      <section className="el-sec" style={{ background: "var(--lav-light)" }}>
        <div className="el-wrap">
          <div className="el-tag">🛍️ your portal kit</div>
          <div className="el-pills" style={{ marginTop: 14 }}>
            <span className="el-pill">📓 your journal + a pen that sparks joy</span>
            <span className="el-pill">🕯️ a candle</span>
            <span className="el-pill">🚪 any doorway in your home</span>
            <span className="el-pill">🔮 your birth chart</span>
          </div>
          <p className="el-lead">Light your candle, put a hand on your heart, take three slow breaths and ask: <strong>what timeline am I ready to claim?</strong></p>
        </div>
      </section>

      {/* 01 THE PORTAL */}
      <section className="el-sec" id="portal">
        <div className="el-wrap">
          <div className="el-head"><div className="el-tag">🪐 01 · the portal</div><h2>a portal is a doorway. <span className="pk">doorways are for walking through.</span></h2></div>
          <div className="el-grid">
            <div className="el-card"><h3>what it is</h3><p>The 11th day of the 11th month. A double master number, and basically the universe&apos;s Black Friday for manifesting.</p></div>
            <div className="el-card pink"><h3>why 11:11 follows you</h3><p>Seeing 11:11 on the clock is the universe sliding into your DMs: you&apos;re on the right path, babe. Keep going.</p></div>
            <div className="el-card lav"><h3>the numbers</h3><p><strong>1</strong> is beginnings. <strong>11</strong> is the master number of intuition, turned all the way up. <strong>11/11</strong> is four ones standing side by side like a doorway. 2026 is a universal 1 year (2+0+2+6 = 10, 1+0 = 1), so the whole year has been one big fresh start.</p></div>
            <div className="el-card"><h3>what it activates</h3><p>Intuition. Alignment. Synchronicity. The part of you that already knows exactly which timeline is yours.</p></div>
          </div>
          <div className="el-grid three">
            {[["the gut", "A physical yes or no. Warmth, tightness, butterflies or that sinking 'oh hell no'."], ["the knowing", "Total certainty with zero explanation. You just know. And you're right."], ["the pictures", "Images, daydreams and dreams that live rent-free in your head all day."], ["the words", "A phrase that drops in, or a lyric on repeat at exactly the right moment."], ["the signs", "Repeating numbers, feathers, the same name three times in one week."], ["the pull", "A magnetic pull toward a person, a place or an idea. No explanation needed."]].map(([t, b], i) => (
              <div className={`el-card ${i % 2 ? "pink" : ""}`} key={t}><div className="el-k">how your intuition talks</div><h3>{t}</h3><p>{b}</p></div>
            ))}
          </div>
          <Journal id="portal" prompts={["When have you been seeing 11:11, 111 or 1111?", "What were you thinking about when it showed up?", "Which other signs keep showing up like they pay rent?", "What has your intuition been begging you to do?", "Which channel does my intuition use most?"]} />
        </div>
      </section>

      {/* 02 THE SKY */}
      <section className="el-sec lav" id="sky">
        <div className="el-wrap">
          <div className="el-head"><div className="el-tag">🦂 02 · the sky</div><h2>scorpio szn has the keys <span className="pk">to the portal.</span></h2>
            <p className="el-lead">Scorpio is death, rebirth and transformation: she strips back whatever&apos;s finished so something hotter can grow. The New Moon in Scorpio started a fresh cycle this week, the Moon is in Sagittarius all day on 11/11 (literally your hype girl), and Mercury and Venus both turn direct on 13 and 14 November, less than nine hours apart. The review is ending, so choose what comes with you.</p></div>
          <div className="el-grid">
            <div className="el-card"><div className="el-k">south node in leo</div><h3>the old timeline</h3><p>Where you&apos;ve been. Performing, proving, chasing the applause, carrying everything on your own. Jupiter sits right on it this week, so the old patterns are BIG and LOUD.</p></div>
            <div className="el-card pink"><div className="el-k">north node in aquarius</div><h3>the next timeline</h3><p>Where you&apos;re headed. Your people, your originality, your vision for the future. Aquarius is the 11th sign of the zodiac. On 11/11. Obviously.</p></div>
          </div>

          {portalHouse && southHouse && northHouse ? (
            <div className="el-you">
              <div className="el-k">✨ in your chart</div>
              <h3>your portal opens in your {ORD[portalHouse]} house of {PORTAL_HOUSES[portalHouse][0]}.</h3>
              <p>This week&apos;s New Moon landed at 17° Scorpio, right in your {ORD[portalHouse]} house, so this is where your portal is wide open: <strong>{PORTAL_HOUSES[portalHouse][1]}</strong> Wish here first.</p>
              <h3 style={{ marginTop: 22 }}>your timelines run from your {ORD[southHouse]} house to your {ORD[northHouse]}.</h3>
              <p>The South Node at 26° Leo sits in your {ORD[southHouse]} house (your old timeline) and the North Node at 26° Aquarius sits in your {ORD[northHouse]} house (where you&apos;re headed). <strong>{NODE_SHIFT[southHouse]}</strong></p>
            </div>
          ) : (
            <div className="el-you">
              <div className="el-k">✨ in your chart</div>
              <h3>add your birth details and this turns personal.</h3>
              <p>Once your chart is in, this shows the house where your portal opens and where your two timelines run in YOUR chart.</p>
              <Link href="/onboarding" className="el-btn" style={{ marginTop: 16 }}>add my chart →</Link>
            </div>
          )}

          <div className="el-head" style={{ marginTop: 44 }}><div className="el-tag">🪐 your key planets for manifesting</div><h2>three planets help you call it in. <span className="pk">two show you what&apos;s in the way.</span></h2></div>
          <div className="el-grid">
            <div className="el-card lav"><div className="el-k">♀ venus · what you attract</div><h3>{pl("Venus") ? `your venus is in ${pl("Venus")!.sign}, in your ${ORD[pl("Venus")!.house]} house.` : "venus: what you attract."}</h3><p>Venus is love, money, pleasure and your sense of worth: her sign is HOW you attract, her house is WHERE love and money flow to you. Wish in her style. Venus in Aries wants it NOW, Venus in Cancer wants it safe and soft. Give her what she likes and watch her deliver.</p></div>
            <div className="el-card"><div className="el-k">♃ jupiter · where luck flows</div><h3>{pl("Jupiter") ? `your jupiter is in ${pl("Jupiter")!.sign}, in your ${ORD[pl("Jupiter")!.house]} house.` : "jupiter: where luck flows."}</h3><p>Jupiter is growth, luck, generosity and big yeses: his house is WHERE your luck lands, his sign is HOW you grow. Put your boldest wish in your Jupiter house, because this is where you&apos;re allowed to ask for MORE.</p></div>
            <div className="el-card pink"><div className="el-k">☿ mercury · speak it into existence</div><h3>{pl("Mercury") ? `your mercury is in ${pl("Mercury")!.sign}, in your ${ORD[pl("Mercury")!.house]} house.` : "mercury: speak it into existence."}</h3><p>Mercury rules your words, your thoughts and the story you tell about yourself, so whatever you say on repeat becomes real. Write your wish the way your Mercury talks, then say it out loud. He turns direct on 13 November, so your words go live this week.</p></div>
            <div className="el-card" style={{ background: "var(--dark)", color: "#fff" }}><div className="el-k" style={{ color: "var(--lav)" }}>⚷ the shadow side</div><h3>{pl("Chiron") ? `your chiron is in your ${ORD[pl("Chiron")!.house]} house.` : "chiron: the wound + the gift."}</h3><p>The house Chiron sits in is where you&apos;ve felt &ldquo;not enough&rdquo;, and it&apos;s also where you end up healing other women. Spot it, and stop letting it set your ceiling.{pl("South Node") ? ` Your own South Node is in ${pl("South Node")!.sign} in your ${ORD[pl("South Node")!.house]} house: your comfort zone, the habits you were born leaning on. Notice it, then wish past it.` : ""}</p></div>
          </div>
          <Journal id="sky" prompts={["What is ready to be reborn in this part of my life?", "What does my next timeline ask me to stop doing?"]} />
        </div>
      </section>

      {/* 03 THE OLD TIMELINE */}
      <section className="el-sec" id="old">
        <div className="el-wrap">
          <div className="el-head"><div className="el-tag">🔥 03 · the old timeline</div><h2>what are you <span className="pk">done repeating?</span></h2><p className="el-lead">Read slowly. Which loop sounds like your own voice? A loop is an old timeline on repeat, and tonight it ends.</p></div>
          <div className="el-grid">
            {[["the income ceiling", "Somehow I always end up back at the same number."], ["the almost", "I was SO close. Again."], ["the same story", "Different person. Same ending."], ["the over-giver", "If I don't do it, nobody will."], ["the waiting room", "I'll start when things calm down."], ["the shrinking", "Who am I to want that?"], ["the burnout", "Push. Crash. Repeat."], ["the safe bet", "At least I know what to expect."]].map(([t, q], i) => (
              <div className={`el-card ${i % 3 === 1 ? "pink" : i % 3 === 2 ? "lav" : ""}`} key={t}><h3>{t}</h3><p>&ldquo;{q}&rdquo;</p></div>
            ))}
          </div>
          <Journal id="retro" prompts={["Who (or what) slid back in since October?", "Which conversation keeps replaying in your head?", "What did you realise about your worth?", "What are you done revisiting?"]} />
          <div className="el-you">
            <div className="el-k">💸 the cost of staying</div>
            <h3>it&apos;s 11/11/2027. nothing changed.</h3>
            <p>Price up the other option: 365 more days of exactly this. Write the real price, every line of it.</p>
          </div>
          <Journal id="cost" prompts={["Money: what did it cost you in income and opportunities?", "Love: which mid connections did you settle for?", "Energy: how much went into pretending you're fine?", "Self-trust: what happened to it every time you waited?"]} />
          <div className="el-grid" style={{ marginTop: 28 }}>
            {[["the one who waits for the perfect time", "the one who moves now."], ["the one who undercharges", "the one who names her price."], ["the one who shrinks to fit", "the one who takes up space."], ["the one who needs permission", "the one who gives it to herself."], ["the one who almost does it", "the one who does it."]].map(([a, b]) => (
              <div className="el-card lav" key={a}><div className="el-k">who you&apos;ve been → who you&apos;re becoming</div><p>{a} → <strong className="el-quote">{b}</strong></p></div>
            ))}
          </div>
          <Journal id="thanks" prompts={["Who is staying on this side of the portal? Write her a thank-you note. Then let her go."]} />
        </div>
      </section>

      {/* 04 THE NEXT TIMELINE */}
      <section className="el-sec pink" id="next">
        <div className="el-wrap">
          <div className="el-head"><div className="el-tag">🌠 04 · the next timeline</div><h2>11 wishes. <span className="pk">11 minutes.</span></h2><p className="el-lead">The 11:11 wish, upgraded. One wish for every corner of your life, written FAST, pen moving the whole time. Then star the three that made your heart (or wallet) beat faster. Tonight&apos;s only rule: nobody else gets a vote.</p></div>
          <div className="el-head" style={{ marginTop: 10 }}><div className="el-tag">🗺️ wish where your chart says yes</div><p className="el-lead">Every wish area lives in a house. A planet in that house? Extra power. Your Jupiter house and your Scorpio house get your biggest wishes.</p></div>
          <div className="el-grid three" style={{ marginBottom: 26 }}>
            {WISH_MAP.map(([area, houses, planet]) => {
              const inside = chart ? chart.planets.filter((x) => houses.includes(x.house) && MAIN_PLANETS.includes(x.name)).map((x) => x.name) : [];
              return (
                <div className="el-card" key={area}><div className="el-k">{area}</div><h3>{houses.map((h) => ORD[h]).join(" + ")} house{planet ? ` + ${planet}` : ""}</h3>
                  <p>{chart ? (inside.length ? `In your chart: ${inside.join(", ")} ${inside.length > 1 ? "live" : "lives"} here. Extra power, babe. ✨` : "No planets here in your chart, so lean on the planet named above.") : ""}</p></div>
              );
            })}
          </div>
          <div className="el-pills">
            {["money", "love", "body", "home", "work", "friendship", "adventure", "creativity", "pleasure", "spirit", "✦ the secret one ✦"].map((a) => <span className="el-pill" key={a}>{a}</span>)}
          </div>
          <ElevenMinuteTimer />
          <Journal id="wishes" prompts={["My 11 wishes (star your three)"]} />

          <div className="el-head" style={{ marginTop: 44 }}><div className="el-tag">✅ the alignment check</div><h2>is this wish actually yours?</h2></div>
          <div className="el-grid">
            <div className="el-card"><h3>the body test</h3><p>Say it out loud. Does your body open up or brace?</p></div>
            <div className="el-card"><h3>the nobody test</h3><p>Would you still want it if nobody ever saw it? Not one post?</p></div>
            <div className="el-card"><h3>the fear test</h3><p>Scary-exciting means go. Scary-wrong means look again.</p></div>
            <div className="el-card lav"><h3>the authority test</h3>
              {authority ? <p>Your Human Design authority is <strong>{authority[0]}</strong>. {authority[1]}</p> : <p>Check it with your Human Design authority, which is on your Human Design chart.</p>}
            </div>
          </div>

          <div className="el-you">
            <div className="el-k">⭕ the decision</div>
            <h3>circle one. the wish you&apos;re taking through the portal.</h3>
            <p>Circle the ONE that passed every test and still gives you butterflies, then write it as if it&apos;s done, in the present tense: &ldquo;I am...&rdquo; or &ldquo;I have...&rdquo;</p>
          </div>
          <Journal id="wish" prompts={["My wish, written as if it's done:"]} />

          <div className="el-head" style={{ marginTop: 44 }}><div className="el-tag">🌀 the main event · about 12 minutes</div><h2>the timeline jump.</h2><p className="el-lead">Lights low, candle lit, feet flat on the floor, your circled wish in your hand and your journal open for after.</p></div>
          <ol className="el-list">
            <li>Close your eyes. Breathe into your belly three times.</li>
            <li>See your old timeline around you. Same room, same loops, same script.</li>
            <li>Thank her. Tell the old timeline: you kept me safe, and I&apos;m done now.</li>
            <li>Turn around. A door is glowing in front of you. Walk toward it.</li>
            <li>Step through. Feel the air change. Your wish is already real here.</li>
            <li>Look around. Who are your people? What are you building?</li>
            <li>Find her, your North Node self. Ask her: what do I do first?</li>
            <li>Bring one thing back: a word, an image, a feeling. Open your eyes.</li>
          </ol>
          <Journal id="jump" prompts={["What did my next timeline look and feel like?", "Who was there with me?", "What did she tell me to do first?", "What will I stop doing to stay on this timeline?"]} />

          <div className="el-you">
            <div className="el-k">💌 the 11/11/2027 letter</div>
            <h3>dear me, it&apos;s 11/11/2027, and i have so much to tell you...</h3>
            <p>What my life looks like now. What I let go of. The move that started it all. What I need you to know. Set a reminder for 11/11/2027, and read it then.</p>
          </div>
          <Journal id="letter" prompts={["Dear me,"]} />
        </div>
      </section>

      {/* 05 STEP THROUGH */}
      <section className="el-sec dark" id="through">
        <div className="el-wrap">
          <div className="el-head"><div className="el-tag">🦋 05 · step through</div><h2>the doubt shows up <span className="pk">at the door.</span></h2><p className="el-lead">The closer you get, the louder it gets. Name the voice, then tap it out.</p></div>
          <div className="el-grid three">
            {[["the what if", "What if it doesn't work?"], ["the imposter", "Who do you think you are?"], ["the safety net", "Just stay where it's safe."], ["the loss", "You'll lose people if you change."], ["the waiting game", "Wait until you're ready."], ["the old story", "People like me never get that."]].map(([t, q]) => (
              <div className="el-card" key={t}><h3>{t}</h3><p>&ldquo;{q}&rdquo;</p></div>
            ))}
          </div>
          <div className="el-you" style={{ background: "var(--pink)", color: "var(--dark)", boxShadow: "10px 10px 0 #fff" }}>
            <div className="el-k" style={{ color: "var(--dark)" }}>🫶 astrotapping™</div>
            <h3>rate the doubt from 0 to 10. tap. rate it again.</h3>
            <p>Write your number down, tap along with the workshop replay, then rate it again and notice what moved. Watch it drop.</p>
          </div>

          <div className="el-head" style={{ marginTop: 44 }}><div className="el-tag">⚡ your portal move</div><h2>one aligned move before 11:11 tomorrow.</h2></div>
          <div className="el-pills">
            {["send it.", "book it.", "ask for it.", "apply.", "post it.", "name your price.", "say yes.", "say no.", "begin."].map((m) => <span className="el-pill" key={m}>{m}</span>)}
          </div>
          <Journal id="move" prompts={["Before 11:11 tomorrow, I will:"]} />

          <div className="el-head" style={{ marginTop: 44 }}><div className="el-tag">🕯️ the threshold ritual</div><h2>11, 10, 9 ... 1. step.</h2></div>
          <ol className="el-list">
            <li><strong>Leave it on this side.</strong> Write down what you&apos;re leaving behind. Tear out the page and leave it at the door (or safely burn it).</li>
            <li><strong>Read your wish.</strong> Stand in the doorway and read your circled wish out loud, in the present tense.</li>
            <li><strong>Count down from 11.</strong> On 1, step through the door. Feel your feet land in your next timeline.</li>
            <li><strong>Seal it.</strong> Blow out your candle and say: it&apos;s done. The portal carries it from here.</li>
          </ol>

          <div className="el-head" style={{ marginTop: 44 }}><div className="el-tag">📣 claim it out loud</div><h2>say it to the mirror. full volume.</h2></div>
          <Journal id="claim" prompts={["I am leaving...", "I am choosing...", "I am becoming...", "Before 11:11 tomorrow, I will..."]} />

          <div className="el-you" style={{ boxShadow: "10px 10px 0 var(--lav)" }}>
            <div className="el-k">💖 you stepped through. now go be her.</div>
            <ol className="el-list" style={{ marginTop: 14 }}>
              <li>Say your claim at 11:11 tonight.</li>
              <li>Make your portal move before 11:11 tomorrow.</li>
              <li>Tell one person what you chose (the coven chat counts).</li>
              <li>Set a reminder to read your letter on 11/11/2027.</li>
            </ol>
            <Link href="/community" className="el-btn" style={{ marginTop: 14 }}>tell the coven what you chose →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
