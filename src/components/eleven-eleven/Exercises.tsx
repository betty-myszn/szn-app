"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChart } from "@/lib/use-chart";
import { useHumanDesign } from "@/lib/use-human-design";
import { houseForLongitude } from "@/lib/interpretations";
import { HoloStar, PortalNav } from "@/components/eleven-eleven/Shared";

// The 11/11 portal hub: the workshop deck (11-11_Portal_Workshop_MYSZN v3 + v4) as a guided,
// one-exercise-at-a-time journey. Her portal house, node timelines, key planets and Human Design
// authority come from her own chart. Every answer, star, pick and rating is kept in this browser
// only (localStorage), so nothing she writes here is stored on the server.

const poppins = "var(--font-poppins), Poppins, sans-serif";

// This week's sky as taught in the workshop: Scorpio New Moon at 17° Scorpio, nodes at 26° Leo / Aquarius.
const NEW_MOON_LON = 227;
const SOUTH_NODE_LON = 146;
const NORTH_NODE_LON = 326;

const ORD = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

const PORTAL_HOUSES: Record<number, [string, string]> = {
  1: ["self + identity", "A whole new you."], 2: ["money + worth", "A rich b*tch money story."],
  3: ["voice + ideas", "Saying it out loud."], 4: ["home + roots", "A home that holds you."],
  5: ["pleasure + romance", "More joy. More play."], 6: ["work + routine", "Days that feel like yours."],
  7: ["partnership", "Love that shows up."], 8: ["receiving + intimacy", "Bigger, braver receiving."],
  9: ["beliefs + adventure", "A bigger, freer life."], 10: ["career + legacy", "Your name in lights."],
  11: ["community + future", "Your people. Your future."], 12: ["rest + spirit", "Deep rest. Real healing."],
};

// Keyed by the house the transiting South Node (26° Leo) falls in.
const NODE_SHIFT: Record<number, string> = {
  1: "From going it alone to letting people in.", 2: "From white-knuckle security to receiving.",
  3: "From endless chatter to your big truth.", 4: "From hiding at home to being seen out there.",
  5: "From the solo spotlight to the collective.", 6: "From constant doing to trust and rest.",
  7: "From living for others to choosing you.", 8: "From other people's money to your own.",
  9: "From searching far away to speaking up.", 10: "From the career mask to coming home.",
  11: "From blending in to taking centre stage.", 12: "From escaping life to building one daily.",
};

const AUTHORITY: Record<string, [string, string]> = {
  emotional: ["emotional", "Ride the wave first. Circle your wish tonight, then confirm it once your wave settles."],
  sacral: ["sacral", "Your gut answers first. Listen for the uh-huh or the uhn-uhn."],
  splenic: ["splenic", "A quiet, instant knowing. It speaks once. Trust it."],
  ego: ["ego", "Ask your heart what it wants and what you're willing to commit to."],
  self: ["self-projected", "Say it out loud and listen. Your own voice tells you the truth."],
  mental: ["mental", "Talk it through with people you trust, somewhere that feels right."],
  lunar: ["lunar", "Give it a full lunar cycle, about 28 days, before you confirm."],
};

const CHANNELS: [string, string, string][] = [
  ["🫀", "the gut", "A physical yes or no. Butterflies or that sinking 'oh hell no'."],
  ["✨", "the knowing", "Total certainty with zero explanation. You just know."],
  ["🖼️", "the pictures", "Images and daydreams that live rent-free in your head."],
  ["🎶", "the words", "A phrase that drops in, or a lyric on repeat at the right moment."],
  ["🔢", "the signs", "Repeating numbers, feathers, the same name three times."],
  ["🧲", "the pull", "A magnetic pull toward a person, a place or an idea."],
];

const LOOPS: [string, string][] = [
  ["the income ceiling", "Somehow I always end up back at the same number."], ["the almost", "I was SO close. Again."],
  ["the same story", "Different person. Same ending."], ["the over-giver", "If I don't do it, nobody will."],
  ["the waiting room", "I'll start when things calm down."], ["the shrinking", "Who am I to want that?"],
  ["the burnout", "Push. Crash. Repeat."], ["the safe bet", "At least I know what to expect."],
];

const SHED: [string, string][] = [
  ["the one who waits for the perfect time", "the one who moves now."], ["the one who undercharges", "the one who names her price."],
  ["the one who shrinks to fit", "the one who takes up space."], ["the one who needs permission", "the one who gives it to herself."],
  ["the one who almost does it", "the one who does it."],
];

const WISH_AREAS: [string, string, number[], string][] = [
  ["💸", "money", [2], "Venus"], ["💌", "love", [7], "Venus"], ["💃", "body", [1, 6], ""], ["🏡", "home", [4], "Moon"],
  ["💼", "work", [10, 6], ""], ["👯", "friendship", [11], ""], ["✈️", "adventure", [9], "Jupiter"], ["🎨", "creativity", [5], "Sun"],
  ["🍓", "pleasure", [5], "Venus"], ["🔮", "spirit", [12], "Neptune"], ["✦", "the secret one", [8], "Pluto"],
];
const MAIN = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

const DOUBTS: [string, string][] = [
  ["the what if", "What if it doesn't work?"], ["the imposter", "Who do you think you are?"], ["the safety net", "Just stay where it's safe."],
  ["the loss", "You'll lose people if you change."], ["the waiting game", "Wait until you're ready."], ["the old story", "People like me never get that."],
];

const MOVES = ["send it.", "book it.", "ask for it.", "apply.", "post it.", "name your price.", "say yes.", "say no.", "begin."];

const JUMP = [
  "Close your eyes. Breathe into your belly three times.",
  "See your old timeline around you. Same room, same loops, same script.",
  "Thank her. Tell the old timeline: you kept me safe, and I'm done now.",
  "Turn around. A door is glowing in front of you. Walk toward it.",
  "Step through. Feel the air change. Your wish is already real here.",
  "Look around. Who are your people? What are you building?",
  "Find her, your North Node self. Ask her: what do I do first?",
  "Bring one thing back: a word, an image, a feeling. Open your eyes.",
];

type State = {
  step: number;
  t: Record<string, string>; // every free-text answer, keyed
  channel: string;
  loops: string[];
  shed: number[];
  wishes: string[];
  stars: number[];
  chosen: number;
  tests: number[];
  doubt: string;
  before: number;
  after: number;
  move: string;
};
const EMPTY: State = { step: 0, t: {}, channel: "", loops: [], shed: [], wishes: Array(11).fill(""), stars: [], chosen: -1, tests: [], doubt: "", before: 7, after: 7, move: "" };
const KEY = "myszn-1111-hub"; // same key as HUB_STATE_KEY in lib/eleven-eleven-hub

const EXERCISES: [string, string, string][] = [
  ["where are your signs?", "about 4 minutes", "Every place 11:11 and your other signs have been finding you, and what you were thinking when they showed up."],
  ["your two timelines", "about 4 minutes", "Where the nodes sit in YOUR chart: the house you're leaving behind and the house you're heading into."],
  ["where your portal opens", "about 3 minutes", "This week's New Moon hit 17° Scorpio. The house it landed in is where your portal is wide open."],
  ["name your loop", "about 3 minutes", "Read the loops slowly and catch the one that sounds like your own voice."],
  ["what came back?", "about 4 minutes", "What Venus and Mercury dragged back since October: the people, the money fears, the convo you never finished."],
  ["price up the old life", "about 4 minutes", "Picture 11/11/2027 with nothing changed, then write what one more year of the same would cost you."],
  ["who stays behind?", "about 4 minutes", "Every version of you that you've outgrown kept you safe. Thank her, then let her go."],
  ["11 wishes, 11 minutes", "about 13 minutes", "One wish for every corner of your life, written FAST with a timer on. Then star your top three."],
  ["circle one", "about 2 minutes", "Out of your three starred wishes, choose the ONE you take through the portal."],
  ["the timeline jump", "about 12 minutes", "Thank your old timeline, then walk through the portal into the one where your wish is already yours."],
  ["write it down fast", "about 4 minutes", "Every colour, word and feeling from the other side, before it fades."],
  ["a letter from next year", "about 10 minutes", "Write to yourself from 11/11/2027, as the version of you who already has the wish."],
  ["name the doubt", "about 2 minutes", "The doubt gets loudest right before you step through. Catch which voice it is."],
  ["tap it out", "about 8 minutes", "Astrotapping™: rate the doubt, tap along with the replay, then rate it again and feel it drop."],
  ["pick your portal move", "about 3 minutes", "One real move toward your wish, done before 11:11 tomorrow."],
  ["the threshold ritual", "about 6 minutes", "Leave the old timeline on the page, stand in your doorway, count down from 11 and step through."],
  ["claim it out loud", "about 3 minutes", "Your I AM lines, at full volume, to the room, your camera or your mirror."],
];

const CSS = `
.el{background:#fff;min-height:100vh;}
.el-hero{position:relative;overflow:hidden;color:#fff;padding:46px 20px 52px;border-bottom:var(--border);}
.el-hero-in{max-width:64rem;margin:0 auto;display:grid;grid-template-columns:1.15fr .85fr;gap:28px;align-items:center;position:relative;z-index:2;}
@media(max-width:760px){.el-hero-in{grid-template-columns:1fr;}}
.el-back{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lav);text-decoration:none;}
.el-h1{font-family:${poppins};font-weight:800;font-size:clamp(40px,7vw,78px);line-height:.92;letter-spacing:-.04em;text-transform:lowercase;margin:18px 0 14px;}
.el-hero p{font-size:16px;line-height:1.65;max-width:32rem;color:#fff;}
.el-photo{position:relative;justify-self:center;width:min(340px,80vw);}
.el-photo img{display:block;width:100%;border:3px solid #fff;border-radius:24px;transform:rotate(3deg);box-shadow:12px 14px 0 var(--pink);}
.el-photo .holo-sticker{position:absolute;left:-14px;bottom:18px;transform:rotate(-6deg);}
.el-planet{position:absolute;right:-60px;top:-30px;width:240px;opacity:.95;z-index:1;pointer-events:none;}
@media(max-width:760px){.el-planet{width:150px;right:-40px;top:-10px;}}
.el-cta{display:inline-flex;align-items:center;gap:10px;margin-top:22px;position:relative;z-index:3;background:var(--pink);color:#fff;font-family:${poppins};font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;padding:16px 24px;border:2px solid #fff;border-radius:999px;box-shadow:6px 6px 0 #fff;cursor:pointer;}
.el-cta:hover{transform:translate(-1px,-1px);}

.el-sky{padding:40px 20px;border-bottom:var(--border);background:var(--lav-light);}
.el-in{max-width:64rem;margin:0 auto;}
.el-tag{font-family:${poppins};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--pink);}
.el-h2{font-family:${poppins};font-weight:800;font-size:clamp(26px,4.4vw,40px);line-height:1;letter-spacing:-.03em;text-transform:lowercase;margin:8px 0 6px;color:var(--dark);}
.el-rail{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:18px 4px 18px;margin-top:6px;}
.el-rail::-webkit-scrollbar{height:6px;} .el-rail::-webkit-scrollbar-thumb{background:var(--pink);border-radius:9px;}
.el-tile{flex:0 0 250px;scroll-snap-align:start;background:#fff;border:2px solid var(--dark);border-radius:20px;box-shadow:6px 6px 0 var(--dark);padding:18px;color:var(--dark);}
.el-tile.hot{background:var(--dark);color:#fff;box-shadow:6px 6px 0 var(--pink);}
.el-tile .el-glyph{font-size:30px;line-height:1;}
.el-tile b{display:block;font-family:${poppins};font-weight:800;font-size:18px;letter-spacing:-.02em;text-transform:lowercase;line-height:1.1;margin:10px 0 6px;}
.el-tile p{font-size:13.5px;line-height:1.55;}
.el-tile .el-k{font-family:${poppins};font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--pink);}
.el-tile.hot .el-k{color:var(--lav);}

.el-bar{position:sticky;top:0;z-index:20;background:#fff;border-bottom:var(--border);padding:10px 20px;}
.el-bar-in{max-width:64rem;margin:0 auto;display:flex;align-items:center;gap:14px;}
.el-bar small{font-family:${poppins};font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;}
.el-dots{display:flex;gap:5px;flex:1;}
.el-dot{flex:1;height:8px;border-radius:9px;background:var(--lav-light);border:1px solid var(--dark);cursor:pointer;padding:0;}
.el-dot.done{background:var(--pink);} .el-dot.now{background:var(--dark);}

.el-stage{padding:34px 20px 60px;}
.el-card{max-width:46rem;margin:0 auto;}
.el-ex{background:var(--pink);border:2px solid var(--dark);border-radius:26px;box-shadow:10px 10px 0 var(--dark);padding:34px 28px;text-align:center;color:var(--dark);}
.el-ex .el-num{font-family:${poppins};font-size:12px;font-weight:800;letter-spacing:.3em;text-transform:uppercase;}
.el-ex h2{font-family:${poppins};font-weight:800;font-size:clamp(34px,6.5vw,58px);line-height:.95;letter-spacing:-.04em;text-transform:uppercase;margin:10px 0 12px;}
.el-ex p{font-size:15px;line-height:1.6;max-width:32rem;margin:0 auto;}
.el-ex .el-time{display:inline-block;margin-top:14px;font-family:${poppins};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;background:#fff;border:1.5px solid var(--dark);border-radius:999px;padding:6px 12px;}
.el-body{margin-top:26px;display:grid;gap:16px;}
.el-box{background:#fff;border:2px solid var(--dark);border-radius:20px;box-shadow:6px 6px 0 var(--pink);padding:20px;color:var(--dark);}
.el-box.dark{background:var(--dark);color:#fff;box-shadow:6px 6px 0 var(--lav);}
.el-box.lav{background:var(--lav-light);}
.el-box h3{font-family:${poppins};font-weight:800;font-size:19px;letter-spacing:-.02em;text-transform:lowercase;line-height:1.15;margin-bottom:6px;}
.el-box p{font-size:14.5px;line-height:1.65;}
.el-box.dark .el-tag{color:var(--lav);}
.el-q{display:block;font-family:${poppins};font-weight:800;font-size:14px;text-transform:lowercase;margin:14px 0 8px;}
.el-q:first-child{margin-top:0;}
.el-ta{width:100%;min-height:76px;border:1.5px solid var(--dark);border-radius:14px;padding:12px 14px;font-size:15px;line-height:1.55;font-family:inherit;color:var(--dark);background:var(--pink-bg);resize:vertical;}
.el-ta:focus{outline:2px solid var(--pink);background:#fff;}
.el-picks{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
@media(max-width:560px){.el-picks{grid-template-columns:1fr;}}
.el-pick{text-align:left;background:#fff;border:2px solid var(--dark);border-radius:18px;box-shadow:4px 4px 0 var(--dark);padding:14px 16px;cursor:pointer;color:var(--dark);font-family:inherit;transition:transform .12s;}
.el-pick:hover{transform:translate(-1px,-1px);}
.el-pick b{display:block;font-family:${poppins};font-weight:800;font-size:15px;text-transform:lowercase;margin-bottom:3px;}
.el-pick span{font-size:13.5px;line-height:1.5;}
.el-pick.on{background:var(--dark);color:#fff;box-shadow:4px 4px 0 var(--pink);}
.el-pick.on b::after{content:" ✓";color:var(--pink);}
.el-chips{display:flex;flex-wrap:wrap;gap:10px;}
.el-chip{font-family:${poppins};font-weight:800;font-size:13px;letter-spacing:.04em;text-transform:uppercase;background:#fff;color:var(--dark);border:2px solid var(--dark);border-radius:999px;padding:10px 16px;cursor:pointer;box-shadow:3px 3px 0 var(--dark);}
.el-chip.on{background:var(--pink);color:#fff;}
.el-shed{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;cursor:pointer;background:#fff;border:2px solid var(--dark);border-radius:16px;padding:12px 14px;font-size:14px;color:var(--dark);text-align:left;font-family:inherit;width:100%;}
.el-shed .old{transition:all .3s;}
.el-shed.on .old{text-decoration:line-through;opacity:.45;}
.el-shed .new{font-family:${poppins};font-weight:800;text-transform:lowercase;opacity:.3;transition:all .3s;}
.el-shed.on .new{opacity:1;color:var(--pink);}
.el-wish{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;}
.el-wish label{font-family:${poppins};font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;min-width:118px;}
.el-wish input{border:1.5px solid var(--dark);border-radius:12px;padding:10px 12px;font-size:15px;font-family:inherit;background:var(--pink-bg);color:var(--dark);width:100%;}
.el-star{width:42px;height:42px;border-radius:50%;border:2px solid var(--dark);background:#fff;font-size:20px;cursor:pointer;}
.el-star.on{background:var(--pink);}
.el-wishhint{font-size:12px;line-height:1.4;grid-column:2/4;margin-top:-4px;}
.el-clock{font-family:${poppins};font-weight:800;font-size:56px;letter-spacing:-2px;font-variant-numeric:tabular-nums;line-height:1;}
.el-btn{display:inline-flex;align-items:center;gap:8px;background:var(--pink);color:#fff;font-family:${poppins};font-weight:800;font-size:12px;letter-spacing:.06em;text-transform:uppercase;padding:13px 20px;border:2px solid var(--dark);border-radius:999px;box-shadow:4px 4px 0 var(--dark);cursor:pointer;text-decoration:none;}
.el-btn.ghost{background:#fff;color:var(--dark);}
.el-btn:disabled{opacity:.4;cursor:default;}
.el-nav{max-width:46rem;margin:30px auto 0;display:flex;justify-content:space-between;gap:12px;}
.el-jump{min-height:150px;display:grid;place-items:center;text-align:center;}
.el-jump p{font-family:${poppins};font-weight:800;font-size:clamp(20px,3.6vw,28px);line-height:1.25;letter-spacing:-.02em;text-transform:lowercase;color:#fff;max-width:34rem;}
.el-range{width:100%;accent-color:var(--pink);}
.el-big{font-family:${poppins};font-weight:800;font-size:64px;line-height:1;letter-spacing:-2px;}
.el-count{font-family:${poppins};font-weight:800;font-size:clamp(90px,22vw,180px);line-height:1;letter-spacing:-6px;color:var(--pink);text-align:center;}
.el-claim{background:var(--dark);color:#fff;border-radius:26px;border:3px solid var(--dark);box-shadow:10px 10px 0 var(--pink);padding:30px;}
.el-claim .el-line{font-family:${poppins};font-weight:800;font-size:clamp(20px,3.6vw,28px);line-height:1.2;letter-spacing:-.02em;text-transform:lowercase;margin-top:14px;}
.el-claim .el-line span{color:var(--pink);}
.el-you{font-size:13px;line-height:1.5;font-weight:700;}
`;

function useHubState(): [State, (fn: (s: State) => State) => void] {
  const [s, set] = useState<State>(EMPTY);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) set({ ...EMPTY, ...JSON.parse(raw) });
    } catch { /* storage blocked: the page still works, it just won't remember */ }
    loaded.current = true;
  }, []);
  const update = (fn: (s: State) => State) => set((prev) => {
    const next = fn(prev);
    if (loaded.current) { try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } }
    return next;
  });
  return [s, update];
}

export default function ElevenElevenExercises() {
  const { chart } = useChart();
  const { hd } = useHumanDesign();
  const [s, up] = useHubState();
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(11 * 60);
  const [timing, setTiming] = useState(false);
  const [jumpAt, setJumpAt] = useState(0);
  const [count, setCount] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timing) return;
    const t = setInterval(() => setTimer((x) => { if (x <= 1) { setTiming(false); return 0; } return x - 1; }), 1000);
    return () => clearInterval(t);
  }, [timing]);

  useEffect(() => {
    if (count === null || count <= 0) return;
    const t = setTimeout(() => setCount((c) => (c === null ? null : c - 1)), 1000);
    return () => clearTimeout(t);
  }, [count]);

  const cusps = chart?.houses?.length === 12 ? chart.houses.map((h) => h.longitude) : null;
  const portalHouse = cusps ? houseForLongitude(NEW_MOON_LON, cusps) : null;
  const southHouse = cusps ? houseForLongitude(SOUTH_NODE_LON, cusps) : null;
  const northHouse = cusps ? houseForLongitude(NORTH_NODE_LON, cusps) : null;
  const pl = (name: string) => chart?.planets.find((x) => x.name === name) ?? null;
  const j = pl("Jupiter");
  const authority = hd ? AUTHORITY[hd.authority] : null;

  const step = Math.min(Math.max(s.step, 0), EXERCISES.length);
  const go = (n: number) => {
    up((p) => ({ ...p, step: n }));
    setStarted(true);
    setTimeout(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };
  const txt = (k: string) => s.t[k] ?? "";
  const setTxt = (k: string, v: string) => up((p) => ({ ...p, t: { ...p.t, [k]: v } }));
  const toggle = (arr: number[], i: number, max = 99) => (arr.includes(i) ? arr.filter((x) => x !== i) : arr.length >= max ? arr : [...arr, i]);
  const chosenWish = s.chosen >= 0 ? s.wishes[s.chosen] : "";

  const Q = ({ k, q }: { k: string; q: string }) => (
    <Fragment key={k}>
      <label className="el-q" htmlFor={k}>{q}</label>
      <textarea id={k} className="el-ta" value={txt(k)} onChange={(e) => setTxt(k, e.target.value)} />
    </Fragment>
  );

  return (
    <div className="el">
      <style>{CSS}</style>

      <div className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 26 }}><PortalNav here="/your-season/11-11/exercises" /></div>
      <section className="max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: 26, paddingBottom: 30 }}>
        <div className="holo-edge bg-glitter" style={{ position: "relative", borderRadius: 26, overflow: "hidden", color: "#fff", padding: "clamp(26px, 4.4vw, 48px)" }}>
          <span className="holo-sticker" style={{ display: "inline-block", transform: "rotate(-2deg)" }}>🕯️ the 17 exercises</span>
          <h1 className="display" style={{ fontSize: "clamp(42px, 6.6vw, 80px)", lineHeight: 0.95, marginTop: 16, color: "#fff", maxWidth: 720 }}>walk through the portal.</h1>
          <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 600, margin: "12px 0 0", maxWidth: 560 }}>Every exercise from the 11/11 workshop, one at a time. Grab your journal, a candle and a doorway. Your answers save on this device as you go, so you can come back any time. 💾</p>
          <button className="el-cta" onClick={() => go(step >= EXERCISES.length ? 0 : step)}>
            {step === 0 && !s.t["s0"] ? "🪄 start exercise 01" : step >= EXERCISES.length ? "↺ walk through again" : `✨ carry on: exercise ${String(step + 1).padStart(2, "0")}`}
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/disco-planet-logo.png" alt="" className="hidden md:block" style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-50%) rotate(-8deg)", width: 380 }} />
          <HoloStar size={46} style={{ bottom: 20, right: "36%" }} />
        </div>
      </section>

      {/* PROGRESS */}
      <div className="el-bar">
        <div className="el-bar-in">
          <small>{step >= EXERCISES.length ? "done ✨" : `${String(step + 1).padStart(2, "0")} / 17`}</small>
          <div className="el-dots">
            {EXERCISES.map((e, i) => (
              <button key={i} aria-label={`exercise ${i + 1}: ${e[0]}`} className={`el-dot ${i < step ? "done" : i === step ? "now" : ""}`} onClick={() => go(i)} />
            ))}
          </div>
        </div>
      </div>

      {/* STAGE */}
      <section className="el-stage" ref={stageRef} style={{ scrollMarginTop: 60 }}>
        {step < EXERCISES.length ? (
          <div className="el-card">
            <div className="el-ex">
              <div className="el-num">exercise {String(step + 1).padStart(2, "0")}</div>
              <h2>{EXERCISES[step][0]}</h2>
              <p>{EXERCISES[step][2]}</p>
              <span className="el-time">⏱ {EXERCISES[step][1]}</span>
            </div>

            <div className="el-body">
              {step === 0 && (<>
                <div className="el-box">
                  <h3>how does your intuition talk to you?</h3>
                  <p style={{ marginBottom: 14 }}>11 is the number of intuition. Tap the channel that&apos;s loudest for you.</p>
                  <div className="el-picks">
                    {CHANNELS.map(([e, t, b]) => (
                      <button key={t} className={`el-pick ${s.channel === t ? "on" : ""}`} onClick={() => up((p) => ({ ...p, channel: t }))}><b>{e} {t}</b><span>{b}</span></button>
                    ))}
                  </div>
                </div>
                <div className="el-box">
                  {Q({ k: "s0", q: "When have you been seeing 11:11, 111 or 1111?" })}
                  {Q({ k: "s1", q: "What were you thinking about when it showed up?" })}
                  {Q({ k: "s2", q: "Which other signs keep showing up like they pay rent?" })}
                  {Q({ k: "s3", q: "What has your intuition been begging you to do?" })}
                </div>
              </>)}

              {step === 1 && (<>
                <div className="el-box dark">
                  <div className="el-tag">☋ south node in leo · the old timeline</div>
                  <h3 style={{ marginTop: 6 }}>{southHouse ? `your old timeline lives in your ${ORD[southHouse]} house.` : "your old timeline runs on applause."}</h3>
                  <p>Performing, proving, chasing the applause, carrying everything on your own. Jupiter sits right on it this week, so the old patterns are BIG and LOUD.</p>
                </div>
                <div className="el-box">
                  <div className="el-tag">☊ north node in aquarius · the next timeline</div>
                  <h3 style={{ marginTop: 6 }}>{northHouse ? `your next timeline opens in your ${ORD[northHouse]} house.` : "your next timeline is built for the future."}</h3>
                  <p>{southHouse ? <strong>{NODE_SHIFT[southHouse]} </strong> : null}Your people, your weird, your vision. Aquarius is the 11th sign. On 11/11. Obviously.</p>
                </div>
                <div className="el-box">{Q({ k: "n0", q: "What does my next timeline ask me to stop doing?" })}</div>
              </>)}

              {step === 2 && (<>
                <div className="el-box dark">
                  <div className="el-tag">🦂 your portal house</div>
                  {portalHouse ? (<><h3 style={{ marginTop: 6, fontSize: 26 }}>your {ORD[portalHouse]} house: {PORTAL_HOUSES[portalHouse][0]}.</h3><p>{PORTAL_HOUSES[portalHouse][1]} This is where your portal is wide open, so wish here first.</p></>)
                    : <p style={{ marginTop: 6 }}>Find 17° Scorpio on your chart: the house it falls in is your portal house. <Link href="/onboarding" className="pk">Add your chart</Link> and it shows here.</p>}
                </div>
                <div className="el-box">{Q({ k: "p0", q: "What is ready to be reborn in this part of my life?" })}</div>
              </>)}

              {step === 3 && (<>
                <div className="el-box">
                  <h3>which loop sounds like your own voice?</h3>
                  <p style={{ marginBottom: 14 }}>Tap every one that hits. A loop is an old timeline on repeat, and tonight it ends.</p>
                  <div className="el-picks">
                    {LOOPS.map(([t, q]) => (
                      <button key={t} className={`el-pick ${s.loops.includes(t) ? "on" : ""}`} onClick={() => up((p) => ({ ...p, loops: p.loops.includes(t) ? p.loops.filter((x) => x !== t) : [...p.loops, t] }))}><b>{t}</b><span>&ldquo;{q}&rdquo;</span></button>
                    ))}
                  </div>
                </div>
                <div className="el-box">{Q({ k: "l0", q: "Write your loop down, word for word, the way you say it to yourself:" })}</div>
              </>)}

              {step === 4 && (<div className="el-box">
                {Q({ k: "r0", q: "Who (or what) slid back in since October?" })}
                {Q({ k: "r1", q: "What truth came out since 24 October?" })}
                {Q({ k: "r2", q: "What did you realise about your worth?" })}
                {Q({ k: "r3", q: "What are you done revisiting?" })}
              </div>)}

              {step === 5 && (<>
                <div className="el-box dark" style={{ textAlign: "center" }}>
                  <div className="el-big szn-holo-text">365</div>
                  <h3 style={{ marginTop: 8 }}>more days of the same. it&apos;s 11/11/2027 and nothing changed.</h3>
                </div>
                <div className="el-box">
                  {Q({ k: "c0", q: "💸 Money: what did it cost you in income and opportunities?" })}
                  {Q({ k: "c1", q: "💌 Love: which mid connections did you settle for?" })}
                  {Q({ k: "c2", q: "🔋 Energy: how much went into pretending you're fine?" })}
                  {Q({ k: "c3", q: "🪞 Self-trust: what happened to it every time you waited?" })}
                </div>
              </>)}

              {step === 6 && (<>
                <div className="el-box lav">
                  <h3>tap each one to leave her on this side.</h3>
                  <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                    {SHED.map(([a, b], i) => (
                      <button key={a} className={`el-shed ${s.shed.includes(i) ? "on" : ""}`} onClick={() => up((p) => ({ ...p, shed: toggle(p.shed, i) }))}>
                        <span className="old">{a}</span><span>→</span><span className="new">{b}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="el-box">{Q({ k: "w0", q: "Who is staying on this side of the portal? Write her a thank-you note. Then let her go." })}</div>
              </>)}

              {step === 7 && (<>
                <div className="el-box dark" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                  <div><div className="el-tag">⏱ pen moving the whole time</div><div className="el-clock">{String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}</div></div>
                  <button className="el-btn" onClick={() => { if (timer === 0) setTimer(11 * 60); setTiming((t) => !t); }}>{timing ? "⏸ pause" : timer === 0 ? "↺ again" : "▶ start 11 minutes"}</button>
                </div>
                <div className="el-box">
                  <p style={{ marginBottom: 14 }}><strong>One wish per area, written FAST. Then tap ☆ on the three that made your heart (or wallet) beat faster.</strong> Nobody else gets a vote. The hint under each one is what YOUR chart has in that house.</p>
                  <div style={{ display: "grid", gap: 12 }}>
                    {WISH_AREAS.map(([e, area, houses, planet], i) => {
                      const inside = chart ? chart.planets.filter((x) => houses.includes(x.house) && MAIN.includes(x.name)).map((x) => x.name) : [];
                      return (
                        <div className="el-wish" key={area}>
                          <label htmlFor={`wish-${i}`}>{e} {area}</label>
                          <input id={`wish-${i}`} value={s.wishes[i] ?? ""} onChange={(ev) => up((p) => { const w = [...p.wishes]; w[i] = ev.target.value; return { ...p, wishes: w }; })} />
                          <button className={`el-star ${s.stars.includes(i) ? "on" : ""}`} aria-label="star this wish" onClick={() => up((p) => ({ ...p, stars: toggle(p.stars, i, 3) }))}>{s.stars.includes(i) ? "★" : "☆"}</button>
                          <div className="el-wishhint">{houses.map((h) => ORD[h]).join(" + ")} house{planet ? ` + ${planet}` : ""}{inside.length ? ` · in your chart: ${inside.join(", ")} ✨` : ""}</div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="el-you" style={{ marginTop: 14 }}>⭐ {s.stars.length}/3 starred{j ? ` · your Jupiter house (${ORD[j.house]}) and your portal house${portalHouse ? ` (${ORD[portalHouse]})` : ""} get your biggest wishes` : ""}</p>
                </div>
              </>)}

              {step === 8 && (<>
                <div className="el-box">
                  <h3>circle the ONE.</h3>
                  {s.stars.length ? (
                    <div className="el-picks" style={{ marginTop: 12 }}>
                      {s.stars.map((i) => (
                        <button key={i} className={`el-pick ${s.chosen === i ? "on" : ""}`} onClick={() => up((p) => ({ ...p, chosen: i }))}><b>{WISH_AREAS[i][0]} {WISH_AREAS[i][1]}</b><span>{s.wishes[i] || "(empty)"}</span></button>
                      ))}
                    </div>
                  ) : <p>Star three wishes in exercise 08 first, then come back. <button className="el-btn ghost" style={{ marginTop: 10 }} onClick={() => go(7)}>← back to my wishes</button></p>}
                </div>
                <div className="el-box lav">
                  <h3>the alignment check</h3>
                  <p style={{ marginBottom: 12 }}>Run your chosen wish through all four. An aligned wish feels like a hell yes in your whole body.</p>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[["the body test", "Say it out loud. Does your body open up or brace?"], ["the nobody test", "Would you still want it if nobody ever saw it? Not one post?"], ["the fear test", "Scary-exciting means go. Scary-wrong means look again."], ["the authority test", authority ? `Your authority is ${authority[0]}. ${authority[1]}` : "Check it with your Human Design authority."]].map(([t, b], i) => (
                      <button key={t} className={`el-pick ${s.tests.includes(i) ? "on" : ""}`} onClick={() => up((p) => ({ ...p, tests: toggle(p.tests, i) }))}><b>{t}</b><span>{b}</span></button>
                    ))}
                  </div>
                </div>
                <div className="el-box">{Q({ k: "wish", q: "Now write it as if it's DONE, present tense: “I am...” or “I have...”" })}</div>
              </>)}

              {step === 9 && (<>
                <div className="el-box">
                  <h3>get ready</h3>
                  <p>Lights low. Candle lit. Feet flat on the floor. Your circled wish in your hand{chosenWish ? `: “${chosenWish}”` : ""}. Soft music on. Then tap through slowly, one breath per step.</p>
                </div>
                <div className="el-box dark el-jump bg-glitter">
                  <div>
                    <div className="el-tag" style={{ marginBottom: 12 }}>{jumpAt < 4 ? "this side · south node" : "the other side · north node"} · {jumpAt + 1} / 8</div>
                    <p>{JUMP[jumpAt]}</p>
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
                      <button className="el-btn ghost" disabled={jumpAt === 0} onClick={() => setJumpAt((x) => Math.max(0, x - 1))}>←</button>
                      {jumpAt < JUMP.length - 1 ? <button className="el-btn" onClick={() => setJumpAt((x) => x + 1)}>breathe, then next →</button> : <button className="el-btn" onClick={() => go(10)}>🎁 write it down fast →</button>}
                    </div>
                  </div>
                </div>
              </>)}

              {step === 10 && (<div className="el-box">
                {Q({ k: "j0", q: "What did my next timeline look and feel like?" })}
                {Q({ k: "j1", q: "Who was there with me?" })}
                {Q({ k: "j2", q: "What did she tell me to do first?" })}
                {Q({ k: "j3", q: "What will I stop doing to stay on this timeline?" })}
              </div>)}

              {step === 11 && (<div className="el-box">
                <p style={{ marginBottom: 6 }}><strong>Dear me, it&apos;s 11/11/2027, and I have so much to tell you...</strong></p>
                {Q({ k: "e0", q: "01 · What my life looks like now (where I live, what I earn, who I love, how I feel waking up)" })}
                {Q({ k: "e1", q: "02 · What I let go of" })}
                {Q({ k: "e2", q: "03 · The move that started it all" })}
                {Q({ k: "e3", q: "04 · What I need you to know" })}
                <p className="el-you" style={{ marginTop: 12 }}>📅 Set a reminder for 11/11/2027, and read it then.</p>
              </div>)}

              {step === 12 && (<>
                <div className="el-box">
                  <h3>which voice is running her mouth?</h3>
                  <div className="el-picks" style={{ marginTop: 12 }}>
                    {DOUBTS.map(([t, q]) => (
                      <button key={t} className={`el-pick ${s.doubt === t ? "on" : ""}`} onClick={() => up((p) => ({ ...p, doubt: t }))}><b>{t}</b><span>&ldquo;{q}&rdquo;</span></button>
                    ))}
                  </div>
                </div>
                <div className="el-box">{Q({ k: "d0", q: "Write down exactly what she says:" })}</div>
              </>)}

              {step === 13 && (
                <div className="el-box">
                  <h3>rate it. tap it. rate it again.</h3>
                  <label className="el-q">before tapping: how loud is the doubt? <span className="pk">{s.before}/10</span></label>
                  <input className="el-range" type="range" min={0} max={10} value={s.before} onChange={(e) => up((p) => ({ ...p, before: Number(e.target.value) }))} />
                  <p style={{ margin: "14px 0" }}>Now tap along with the astrotapping™ in the workshop replay: tap where I tap, say what I say, breathe when I breathe.</p>
                  <label className="el-q">after tapping: <span className="pk">{s.after}/10</span></label>
                  <input className="el-range" type="range" min={0} max={10} value={s.after} onChange={(e) => up((p) => ({ ...p, after: Number(e.target.value) }))} />
                  {s.after < s.before && <p className="el-you" style={{ marginTop: 12 }}>💖 it dropped {s.before - s.after} point{s.before - s.after === 1 ? "" : "s"}. watch it go, babe.</p>}
                </div>
              )}

              {step === 14 && (<>
                <div className="el-box">
                  <h3>pick your move</h3>
                  <div className="el-chips" style={{ marginTop: 12 }}>
                    {MOVES.map((mv) => <button key={mv} className={`el-chip ${s.move === mv ? "on" : ""}`} onClick={() => up((p) => ({ ...p, move: mv }))}>{mv}</button>)}
                  </div>
                </div>
                <div className="el-box">{Q({ k: "move", q: "Before 11:11 tomorrow, I will:" })}<p className="el-you" style={{ marginTop: 10 }}>⏰ Set the alarm now. Move before it rings. Then post it and tag @universeofbetty.</p></div>
              </>)}

              {step === 15 && (<>
                <div className="el-box">
                  <h3>you&apos;ll need your candle, your journal, a doorway and your wish.</h3>
                  <p><strong>01</strong> Write down what you&apos;re leaving behind. Tear out the page and leave it at the door. <strong>02</strong> Stand in the doorway and read your wish out loud, present tense{txt("wish") ? `: “${txt("wish")}”` : ""}. <strong>03</strong> Count down from 11, and on 1, step through. <strong>04</strong> Blow out your candle and say: it&apos;s done.</p>
                </div>
                <div className="el-box" style={{ textAlign: "center" }}>
                  {count === null ? <button className="el-btn" onClick={() => setCount(11)}>🚪 start the countdown</button>
                    : count > 0 ? <div className="el-count">{count}</div>
                    : <><div className="el-count" style={{ fontSize: "clamp(48px,10vw,90px)", letterSpacing: "-2px" }}>step. ✨</div><p style={{ marginTop: 8 }}>Feel your feet land in your next timeline. It&apos;s done. The portal carries it from here.</p></>}
                </div>
              </>)}

              {step === 16 && (<div className="el-box">
                {Q({ k: "k0", q: "I am leaving..." })}
                {Q({ k: "k1", q: "I am choosing..." })}
                {Q({ k: "k2", q: "I am becoming..." })}
                <p className="el-you" style={{ marginTop: 12 }}>Say them out loud, full volume, then again at 11:11 tonight. Your finished card is on the next screen.</p>
              </div>)}
            </div>

            <div className="el-nav">
              <button className="el-btn ghost" disabled={step === 0} onClick={() => go(step - 1)}>← back</button>
              <button className="el-btn" onClick={() => go(step + 1)}>{step === EXERCISES.length - 1 ? "✨ see my portal card" : "next exercise →"}</button>
            </div>
          </div>
        ) : (
          <div className="el-card">
            <div className="el-claim bg-glitter">
              <span className="holo-sticker">🔮 my 11/11 portal · 2026</span>
              <div className="el-line" style={{ marginTop: 18 }}>i am leaving <span>{txt("k0") || "…"}</span></div>
              <div className="el-line">i am choosing <span>{txt("k1") || "…"}</span></div>
              <div className="el-line">i am becoming <span>{txt("k2") || "…"}</span></div>
              {(txt("wish") || chosenWish) && <div className="el-line" style={{ fontSize: 18 }}>my wish: <span>{txt("wish") || chosenWish}</span></div>}
              {(txt("move") || s.move) && <div className="el-line" style={{ fontSize: 18 }}>before 11:11 tomorrow i will <span>{txt("move") || s.move}</span></div>}
            </div>
            <div className="el-box" style={{ marginTop: 22 }}>
              <h3>you stepped through. now go be her. 💖</h3>
              <p>Screenshot your card and tag @universeofbetty. Say your claim at 11:11 tonight, make your portal move before 11:11 tomorrow, tell one person what you chose, and set a reminder to read your letter on 11/11/2027.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                <Link href="/community" className="el-btn">💬 tell the coven what you chose</Link>
                <button className="el-btn ghost" onClick={() => go(0)}>↺ walk through again</button>
              </div>
            </div>
          </div>
        )}
        {!started && step === 0 && <p style={{ textAlign: "center", marginTop: 18, fontSize: 13 }}>Your answers save on this device as you go, so you can come back any time. 💾</p>}
      </section>
    </div>
  );
}
