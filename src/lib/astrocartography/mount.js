// Your power places: the astrocartography page. Framework-free on purpose, the map is pointer
// gestures + an SVG viewBox and that is simpler to keep smooth outside React's render cycle.
// mountPowerPlaces(root, chart) draws everything into root and returns a cleanup function.
import { computeLines, distanceKm, PLANETS, ANGLES } from "./engine";
import { GLYPH, GIFT, ANGLE_INFO, PLANET_WORD, READINGS, SCORES, GOALS, CITIES } from "./content";
import { LAND } from "./land";

const TEMPLATE = `<section class="hero">
  <div class="wrap">
    <a class="back" href="/dashboard">← back to my szn</a>
    <div class="tag" style="margin-top:18px">astrocartography · your power places</div>
    <h1><span class="holo-text">where in the world you glow.</span></h1>
    <p>The minute you were born, every planet was rising, setting, overhead or underneath somewhere on earth. Those spots draw lines across the map, and living, travelling or holidaying near a line switches that planet ON in your life. These are YOURS, babe.</p>
    <div class="birth"><span class="dot"></span><span id="birthline"></span></div>

    <div class="angles" id="angles"></div>
  </div>
</section>

<div class="tabsbar" id="tabsbar">
  <div class="wrap">
    <div class="seg" role="tablist">
      <button role="tab" data-tab="live" aria-selected="true">live</button>
      <button role="tab" data-tab="travel" aria-selected="false">travel</button>
      <button role="tab" data-tab="activate" aria-selected="false">activate</button>
    </div>
    <div class="goals" id="goals" hidden></div>
  </div>
</div>

<section>
  <div class="wrap">
    <div class="block" style="padding-top:26px">
      <div class="tag" id="tabTag"></div>
      <h2 class="h2" id="tabHead" style="margin-top:8px"></h2>
      <p class="lede" id="tabLede"></p>
    </div>

    <div class="mapcard">
      <div class="maphead"><b>your lines</b><span style="font-size:12px;font-weight:700">tap a line or a pin</span></div>
      <div class="regions" id="regions"></div>
      <div class="mapbox" id="mapbox">
        <svg id="map" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path id="land" fill="#fff" stroke="#C8B4F8" stroke-width="0.8" vector-effect="non-scaling-stroke"></path>
          <g id="grid"></g>
          <g id="lines"></g>
          <g id="hits"></g>
          <g id="dots"></g>
          <g id="pins"></g>
          <g id="labels"></g>
        </svg>
        <div class="zoom"><button id="zin" aria-label="zoom in">+</button><button id="zout" aria-label="zoom out">−</button></div>
        <div class="maphint" id="hint">swipe sideways · + to zoom</div>
      </div>
      <div class="legend">
        <span><svg width="26" height="8"><line x1="1" y1="4" x2="25" y2="4" stroke="#FF2D87" stroke-width="3" stroke-linecap="round"/></svg>gift lines</span>
        <span><svg width="26" height="8"><line x1="1" y1="4" x2="25" y2="4" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/></svg>growth lines</span>
        <span><svg width="26" height="8"><line x1="1" y1="4" x2="25" y2="4" stroke="#1a1a1a" stroke-width="2.4" stroke-dasharray="2 4" stroke-linecap="round"/></svg>dotted = IC + DSC</span>
      </div>
    </div>

    <div class="cards" id="cards"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="block">
      <div class="tag">check any city</div>
      <h2 class="h2" style="margin-top:8px">what's live where you are.</h2>
      <p class="lede">Type where you live now, where you were born or where you are booking next, and see exactly which planets you are standing on.</p>
    </div>
    <div class="checker">
      <div class="top">
        <div class="search">
          <input id="q" type="text" inputmode="search" autocomplete="off" placeholder="search a city…" aria-label="search a city">
          <div class="suggest" id="suggest" hidden></div>
        </div>
        <div class="quick" id="quick"></div>
      </div>
      <div class="result" id="result"></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="block">
      <div class="tag">your lines, decoded</div>
      <h2 class="h2" style="margin-top:8px">pick a planet.</h2>
      <p class="lede">Every planet draws four lines. Tap one to read it and see which cities sit on it.</p>
    </div>
    <div class="planets" id="planets"></div>
    <div class="decode" id="decode"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="block">
      <div class="tag">go with intention</div>
      <h2 class="h2" style="margin-top:8px">your level-up places.</h2>
      <p class="lede">These spots sit right on your Saturn, Pluto and Mars lines. They grow you FAST, so visit with a plan and a clear intention, and save the long stays for your gift lines.</p>
    </div>
    <div class="care" id="care"></div>
  </div>
</section>

<section class="closing">
  <div class="wrap">
    <div class="closegrid">
      <div class="white">
        <div class="tag">journal on it</div>
        <p>Pick the place on this page that made your body say YES. Write one perfect week there in present tense, from what you wake up to, to who you meet, to what you get paid for.</p>
        <a class="btn" href="/journal">open my journal</a>
      </div>
      <div class="pinkp">
        <div class="tag" style="color:#fff">your affirmation</div>
        <p>“I go where my chart lights up, and the world rises to meet me there.”</p>
      </div>
    </div>
    <div class="note" id="note"></div>
  </div>
</section>

<div class="backdrop" id="backdrop"></div>
<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="details">
  <div class="grab"><i></i><button class="x" id="close" aria-label="close">×</button></div>
  <div id="sheetBody"></div>
</div>`;

export function mountPowerPlaces(root, chartData) {
  const controller = new AbortController();
  const { signal } = controller;
  root.innerHTML = TEMPLATE;
  const CHART = chartData;

const $ = (id) => root.querySelector("#" + id);
const NS = "http://www.w3.org/2000/svg";
const K = 4; // map units per degree
const X = (lon) => (lon + 180) * K, Y = (lat) => (90 - lat) * K;
const TOP = Y(80), BOT = Y(-60), WW = 360 * K;
const OFFS = [-WW, 0, WW]; // the world is drawn three times side by side so it wraps like a real map
const keyOf = (l) => `${l.planet}|${l.angle}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ── data ──
const lines = computeLines(CHART.julianDay, CHART.planets);
const lineByKey = Object.fromEntries(lines.map((l) => [keyOf(l), l]));
const birth = CHART.birthData;
const cities = CITIES.slice();
if (!cities.some((c) => c.name.toLowerCase() === birth.location.city.toLowerCase())) {
  cities.push({ name: birth.location.city, country: birth.location.country === "United Kingdom" ? "UK" : birth.location.country, lat: birth.location.latitude, lon: birth.location.longitude, birth: true });
}
for (const c of cities) {
  c.hits = lines.map((l) => ({ key: keyOf(l), line: l, d: distanceKm(l, c.lat, c.lon) })).filter((h) => h.d < 1000).sort((a, b) => a.d - b.d);
}
const prox = (d) => (d < 1000 ? Math.pow(1 - d / 1000, 2) : 0);
const gcKm = (a, b) => { const R = Math.PI / 180, dla = (b.lat - a.lat) * R, dlo = (b.lon - a.lon) * R; const h = Math.sin(dla / 2) ** 2 + Math.cos(a.lat * R) * Math.cos(b.lat * R) * Math.sin(dlo / 2) ** 2; return 2 * 6371 * Math.asin(Math.sqrt(h)); };
const strength = (d) => (d < 150 ? ["right on it", "s3"] : d < 400 ? ["strong", "s2"] : ["you feel it", "s1"]);
const km = (d) => (d < 10 ? "on the line" : `${Math.round(d / 10) * 10}km`);
const lineName = (key) => { const [p, a] = key.split("|"); return `${GLYPH[p]} ${p} ${a}`; };

// ── state ──
const S = { tab: "live", goal: "love", planet: "Venus", focus: null, city: null };
try { const saved = localStorage.getItem("szn_place_city"); if (saved) S.city = saved; } catch (e) {}
if (!S.city || !cities.some((c) => c.name === S.city)) S.city = "London";

const weights = () => SCORES[S.tab === "activate" ? S.goal : S.tab];
function ranked() {
  const W = weights();
  const scored = cities.map((c) => ({ c, score: c.hits.reduce((s, h) => s + (W[h.key] || 0) * prox(h.d), 0) })).filter((r) => r.score > 0.4).sort((a, b) => b.score - a.score);
  const out = [];
  for (const r of scored) { if (out.some((o) => gcKm(o.c, r.c) < 700)) continue; out.push(r); if (out.length === 5) break; }
  return out;
}

const TAB_COPY = {
  live: { tag: "where to live", head: "where life gets EASY for you.", lede: "Your home lines, love lines and luck lines, the places where everyday life feels softer, richer and more like you. Heavy lines count against a city, so the top of this list is pure good stuff." },
  travel: { tag: "where to travel", head: "trips that change your life.", lede: "Holiday here and you come home luckier, hotter and more yourself. These are your best lines for a week, a month or a girls' trip." },
};
const GOAL_LEDE = {
  love: "Your Venus, Jupiter, Moon and Sun setting lines, the ones that pull your person towards you.",
  money: "Your Jupiter, Venus and Sun lines at the top of the chart, where your work turns into serious dollars.",
  career: "Top-of-the-chart lines where your name travels and the right people notice you.",
  glow: "Rising lines where you look and feel your absolute best from day one.",
  healing: "Soft home lines and dreamy Neptune spots where your nervous system finally exhales.",
  create: "Mercury, Venus and Neptune lines that open the creative floodgates.",
  adventure: "Jupiter and Uranus rising lines for the trip you tell stories about for years.",
  selflove: "Your Venus, Sun and Moon rising lines, plus your softest home lines, where you catch your reflection and actually like her.",
  realise: "Uranus, Neptune and Mercury lines where the penny drops, the old story cracks open and you see your life from a whole new angle.",
  challenge: "Saturn, Pluto and Mars lines. These places push you hard, so go with intention, for a set amount of time, and come home a whole new level of you.",
};

// ── hero ──
const ord = (n) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");
(() => {
  const [y, m, d] = birth.dateOfBirth.split("-").map(Number);
  const [hh, mm] = birth.birthTime.split(":").map(Number);
  const month = new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
  const t = `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")}${hh < 12 ? "am" : "pm"}`;
  $("birthline").textContent = `drawn from ${t} on the ${ord(d)} of ${month} ${y}, ${birth.location.city}`;
  $("note").innerHTML = birth.birthTimeApproximate
    ? `<b>Your birth time is marked as approximate.</b> Four minutes of birth time shifts every line by about 1°, roughly 70 to 110km, so these lines could sit a few hundred km away from where they really are for you. Find your exact time on your birth certificate, update it in your chart and this page redraws itself.`
    : `<b>Your birth time matters here.</b> Four minutes of birth time shifts every line by about 1°, roughly 70 to 110km. Yours is drawn from ${t}, so read the distances as a guide and treat anything within about 300km as properly switched on.`;
})();
$("angles").innerHTML = [
  ["MC", "on top of the world", "career, money, reputation, being SEEN", false],
  ["IC", "under your feet", "home, roots, family, deep rest", true],
  ["ASC", "rising", "you, your body, your glow, your confidence", false],
  ["DSC", "setting", "love, partners, clients, who you attract", true],
].map(([a, l, w, dash]) => `<div class="angle"><svg width="34" height="10"><line x1="2" y1="5" x2="32" y2="5" stroke="#FF2D87" stroke-width="3" ${dash ? 'stroke-dasharray="2 5"' : ""} stroke-linecap="round"/></svg><b>${a} · ${l}</b><span>${w}</span></div>`).join("");

// ── tabs + goals ──
$("goals").innerHTML = GOALS.map((g) => `<button class="chip" data-goal="${g.id}" aria-pressed="${g.id === S.goal}">${g.emoji} ${g.label}</button>`).join("");
root.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => { S.tab = b.dataset.tab; S.focus = null; renderTab(true); }));
$("goals").addEventListener("click", (e) => { const b = e.target.closest("[data-goal]"); if (!b) return; S.goal = b.dataset.goal; S.focus = null; renderTab(true); b.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" }); });

let current = [];
function renderTab(fly) {
  root.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === S.tab)));
  $("goals").hidden = S.tab !== "activate";
  $("goals").querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.goal === S.goal)));
  const goal = GOALS.find((g) => g.id === S.goal);
  const copy = S.tab === "activate" ? { tag: `go here to activate · ${goal.label}`, head: `where to go ${goal.head}.`, lede: GOAL_LEDE[S.goal] } : TAB_COPY[S.tab];
  $("tabTag").textContent = copy.tag;
  $("tabHead").innerHTML = copy.head.replace(/([A-Z]{2,})/g, '<span class="holo-text">$1</span>');
  $("tabLede").textContent = copy.lede;
  current = ranked();
  renderCards();
  styleLines();
  drawPins();
  setRegion("top", fly);
  if (typeof renderResult === "function" && fly !== false) renderResult();
}

function renderCards() {
  const W = weights();
  const usedShort = new Set();
  $("cards").innerHTML = current.map((r, i) => {
    const good = r.c.hits.filter((h) => (W[h.key] || 0) > 0).sort((a, b) => (W[b.key] * prox(b.d)) - (W[a.key] * prox(a.d)));
    const lead = good[0];
    let text = READINGS[lead.key].short;
    if (usedShort.has(text)) text = good[1] && !usedShort.has(READINGS[good[1].key].short) ? READINGS[good[1].key].short : `Go here for ${READINGS[lead.key].use}.`;
    usedShort.add(text);
    const pills = good.slice(0, 3).map((h) => `<span class="pill ${GIFT.has(h.line.planet) ? "gift" : "grow"}">${GLYPH[h.line.planet]} ${h.line.planet} ${h.line.angle} · ${km(h.d)}</span>`).join("");
    return `<button class="card ${i === 0 ? "top" : ""}" data-city="${esc(r.c.name)}">
      ${i === 0 ? '<span class="acg-sticker">your no.1</span>' : ""}
      <span class="rank ${i === 0 ? "holo" : ""}">${i + 1}</span>
      <span style="display:block;min-width:0">
        <h3>${esc(r.c.name)}</h3><div class="country">${esc(r.c.country)} · ${esc(READINGS[lead.key].nick)}</div>
        <p>${esc(text)}</p><span class="pills">${pills}</span><span class="more">read it →</span>
      </span></button>`;
  }).join("") || `<p class="lede">No strong lines for this one yet, try another.</p>`;
}
$("cards").addEventListener("click", (e) => { const b = e.target.closest("[data-city]"); if (b) openCity(b.dataset.city); });

// ── map ──
const svg = $("map"), box = $("mapbox");
$("land").setAttribute("d", LAND);
for (const o of [-WW, WW]) { const u = document.createElementNS(NS, "use"); u.setAttribute("href", "#land"); u.setAttribute("x", o); $("land").after(u); }
(() => { // light graticule: equator + tropics
  let g = "";
  for (const lat of [0, 23.44, -23.44]) g += `<line x1="${-WW}" x2="${2 * WW}" y1="${Y(lat)}" y2="${Y(lat)}" stroke="#C8B4F8" stroke-width="0.8" stroke-dasharray="${lat ? "3 5" : "0"}" vector-effect="non-scaling-stroke"/>`;
  $("grid").innerHTML = g;
})();
function pathOf(l) {
  if (l.kind === "meridian") return `M${X(l.lon).toFixed(1)},${TOP}V${BOT}`;
  return l.segs.map((s) => "M" + s.map(([lo, la]) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join("L")).join("");
}
const lineEls = {}, hitEls = {};
for (const l of lines) {
  const k = keyOf(l), d = pathOf(l);
  lineEls[k] = []; hitEls[k] = [];
  for (const o of OFFS) {
  const p = document.createElementNS(NS, "path");
  if (o) p.setAttribute("transform", `translate(${o} 0)`);
  p.setAttribute("d", d); p.setAttribute("fill", "none"); p.setAttribute("vector-effect", "non-scaling-stroke"); p.setAttribute("stroke-linecap", "round");
  p.setAttribute("stroke", GIFT.has(l.planet) ? "#FF2D87" : "#1a1a1a");
  if (l.angle === "IC" || l.angle === "DSC") p.setAttribute("stroke-dasharray", "2 5");
  $("lines").appendChild(p); lineEls[k].push(p);
  const h = document.createElementNS(NS, "path");
  if (o) h.setAttribute("transform", `translate(${o} 0)`);
  h.setAttribute("d", d); h.setAttribute("fill", "none"); h.setAttribute("stroke", "transparent"); h.setAttribute("stroke-width", "16"); h.setAttribute("vector-effect", "non-scaling-stroke");
  h.style.cursor = "pointer"; h.dataset.line = k;
  $("hits").appendChild(h); hitEls[k].push(h);
  }
}
// Light up only the lines that put a city in the current top five, so the map tells the same story as the cards.
const relevant = () => { const W = weights(); const set = new Set(); for (const r of current) for (const h of r.c.hits) if ((W[h.key] || 0) > 0 && h.d < 900) set.add(h.key); return set; };
function styleLines() {
  const rel = relevant();
  for (const k in lineEls) {
    const on = S.focus ? k === S.focus : rel.has(k);
    for (const el of lineEls[k]) {
      el.setAttribute("stroke-width", S.focus === k ? "4" : on ? "2.6" : "1.2");
      el.setAttribute("opacity", on ? "1" : S.focus ? "0.12" : "0.22");
      if (on) $("lines").appendChild(el);
    }
    for (const h of hitEls[k]) h.style.pointerEvents = on || !S.focus ? "stroke" : "none";
  }
}
$("hits").addEventListener("click", (e) => { const k = e.target.dataset && e.target.dataset.line; if (k) openLine(k); });

// city dots (all) + pins (ranked)
function drawDots() {
  $("dots").innerHTML = OFFS.map((o) => cities.map((c) => `<circle data-city="${esc(c.name)}" cx="${X(c.lon) + o}" cy="${Y(c.lat)}" r="1" fill="#1a1a1a" stroke="#fff" style="cursor:pointer"/>`).join("")).join("");
}
function drawPins() {
  $("pins").innerHTML = current.map((r, i) => `<g data-city="${esc(r.c.name)}" data-x="${X(r.c.lon)}" data-y="${Y(r.c.lat)}" style="cursor:pointer"><line stroke="#1a1a1a"/><circle fill="${i === 0 ? "#FF2D87" : "#fff"}" stroke="#1a1a1a"/><text text-anchor="middle" dominant-baseline="central" style="font-family:var(--font-poppins),Poppins,sans-serif" font-weight="800" fill="#1a1a1a">${i + 1}</text></g>`).join("");
  layout();
}
drawDots();
svg.addEventListener("click", (e) => { const g = e.target.closest("[data-city]"); if (g) openCity(g.dataset.city); });

// view
const V = { cx: 180 * K, cy: (TOP + BOT) / 2, s: 1 };
const size = () => ({ w: box.clientWidth, h: box.clientHeight });
const worldS = () => { const { w, h } = size(); return Math.min(w / (360 * K), h / (BOT - TOP)) ; };
const clampV = (v) => {
  const { w, h } = size(); const minS = worldS() * 0.95, maxS = worldS() * 16;
  v.s = Math.max(minS, Math.min(maxS, v.s));
  const hw = w / 2 / v.s, hh = h / 2 / v.s;
  v.cx = hw * 2 >= WW ? 180 * K : v.cx;
  v.cy = hh * 2 >= BOT - TOP ? (TOP + BOT) / 2 : Math.max(TOP + hh, Math.min(BOT - hh, v.cy));
  return v;
};
let raf = 0;
function apply() {
  clampV(V);
  if (V.cx < 0) V.cx += WW; if (V.cx >= WW) V.cx -= WW;
  const { w, h } = size();
  svg.setAttribute("viewBox", `${V.cx - w / 2 / V.s} ${V.cy - h / 2 / V.s} ${w / V.s} ${h / V.s}`);
  box.style.touchAction = V.s > worldS() * 1.25 ? "none" : "pan-y";
  cancelAnimationFrame(raf); raf = requestAnimationFrame(layout);
}
function fit(lon0, lon1, lat0, lat1, pad = 36) {
  const { w, h } = size();
  const x0 = X(lon0), x1 = X(lon1), y0 = Y(lat1), y1 = Y(lat0);
  const s = Math.min((w - pad * 2) / (x1 - x0), (h - pad * 2) / (y1 - y0));
  return clampV({ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, s });
}
let anim = 0;
function flyTo(t, ms = 650) {
  cancelAnimationFrame(anim);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) ms = 0;
  const a = { ...V }, t0 = performance.now();
  t = { ...t }; while (t.cx - a.cx > WW / 2) t.cx -= WW; while (a.cx - t.cx > WW / 2) t.cx += WW;
  const step = (now) => {
    const k = ms ? Math.min(1, (now - t0) / ms) : 1, e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    V.cx = a.cx + (t.cx - a.cx) * e; V.cy = a.cy + (t.cy - a.cy) * e; V.s = Math.exp(Math.log(a.s) + (Math.log(t.s) - Math.log(a.s)) * e);
    apply(); if (k < 1) anim = requestAnimationFrame(step);
  };
  anim = requestAnimationFrame(step);
}
const REGIONS = [
  ["top", "📍 my picks"], ["world", "world"], ["europe", "europe"], ["americas", "americas"], ["africa", "africa + middle east"], ["asia", "asia"], ["oceania", "oceania"],
];
const REGION_BOX = { world: [-180, 180, -58, 78], europe: [-25, 42, 34, 66], americas: [-128, -34, -45, 55], africa: [-20, 60, -36, 40], asia: [62, 146, -10, 48], oceania: [110, 180, -47, 2] };
let region = "top";
$("regions").innerHTML = REGIONS.map(([id, label]) => `<button class="region" data-region="${id}" aria-pressed="${id === region}">${label}</button>`).join("");
$("regions").addEventListener("click", (e) => { const b = e.target.closest("[data-region]"); if (b) { S.focus = null; styleLines(); setRegion(b.dataset.region, true); } });
function setRegion(id, fly) {
  region = id;
  $("regions").querySelectorAll(".region").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.region === id)));
  let t;
  if (id === "top") {
    if (!current.length) t = fit(...REGION_BOX.world);
    else {
      // smallest stretch of longitude that holds every pick, allowing it to cross the date line
      const lons = current.map((r) => r.c.lon).sort((x, y) => x - y);
      let gap = -1, start = lons[0];
      lons.forEach((lo, i) => { const nx = i === lons.length - 1 ? lons[0] + 360 : lons[i + 1]; if (nx - lo > gap) { gap = nx - lo; start = nx > 180 ? nx - 360 : nx; } });
      let lo0 = start, lo1 = start + (360 - gap);
      let la0 = Math.min(...current.map((r) => r.c.lat)), la1 = Math.max(...current.map((r) => r.c.lat));
      const minSpan = 30;
      if (lo1 - lo0 < minSpan) { const m = (lo0 + lo1) / 2; lo0 = m - minSpan / 2; lo1 = m + minSpan / 2; }
      if (la1 - la0 < minSpan / 2) { const m = (la0 + la1) / 2; la0 = m - minSpan / 4; la1 = m + minSpan / 4; }
      t = fit(lo0 - 8, lo1 + 8, la0 - 8, la1 + 8, 30);
      if (t.cx < 0) t.cx += WW; if (t.cx >= WW) t.cx -= WW;
    }
  } else t = fit(...REGION_BOX[id]);
  if (fly) flyTo(t); else { Object.assign(V, t); apply(); }
}

// labels + pin sizing, recomputed for the current view so text stays a constant size on screen
function layout() {
  const { w, h } = size(); const u = 1 / V.s;
  const vx0 = V.cx - w / 2 * u, vy0 = V.cy - h / 2 * u, vx1 = vx0 + w * u, vy1 = vy0 + h * u;
  const near = (x) => x + WW * Math.round((V.cx - x) / WW);
  const inView = (x, y, m = 0) => x > vx0 + m * u && x < vx1 - m * u && y > vy0 + m * u && y < vy1 - m * u;
  const boxes = [];
  const hitBox = (b) => boxes.some((o) => !(b.x1 < o.x0 || b.x0 > o.x1 || b.y1 < o.y0 || b.y0 > o.y1));
  // zoom buttons occupy the top right corner
  boxes.push({ x0: vx1 - 56 * u, x1: vx1, y0: vy0, y1: vy0 + 96 * u });
  // pins
  const pr = 11 * u;
  $("pins").querySelectorAll("g").forEach((g) => {
    const x0 = near(+g.dataset.x), y0 = +g.dataset.y;
    // pins that would sit on top of each other get nudged apart, with a short stem back to the real spot
    let x = x0, y = y0;
    for (let k = 1; k < 8 && boxes.some((o) => !(x + pr < o.x0 || x - pr > o.x1 || y + pr < o.y0 || y - pr > o.y1)); k++) { x = x0 + Math.cos(-0.6 + k * 1.1) * pr * 2.3 * Math.ceil(k / 5); y = y0 + Math.sin(-0.6 + k * 1.1) * pr * 2.3 * Math.ceil(k / 5); }
    g.dataset.px = x; g.dataset.py = y;
    const ln = g.querySelector("line"); ln.setAttribute("x1", x0); ln.setAttribute("y1", y0); ln.setAttribute("x2", x); ln.setAttribute("y2", y); ln.setAttribute("stroke-width", 1.5 * u);
    const c = g.querySelector("circle"), t = g.querySelector("text");
    c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", pr); c.setAttribute("stroke-width", 2 * u);
    t.setAttribute("x", x); t.setAttribute("y", y + 0.5 * u); t.setAttribute("font-size", 12 * u);
    boxes.push({ x0: x - pr, x1: x + pr, y0: y - pr, y1: y + pr });
  });
  const zoomed = V.s > worldS() * 1.8;
  $("dots").querySelectorAll("circle").forEach((c) => { c.setAttribute("r", (zoomed ? 3.2 : 2) * u); c.setAttribute("stroke-width", 1 * u); });
  let out = "";
  const label = (x, y, text, fill, fg, fs, bold) => {
    const wpx = text.length * fs * 0.56 + 14, hpx = fs + 9;
    const b = { x0: x - wpx / 2 * u, x1: x + wpx / 2 * u, y0: y - hpx / 2 * u, y1: y + hpx / 2 * u };
    if (hitBox(b) || !inView(b.x0, b.y0, 2) || !inView(b.x1, b.y1, 2)) return false;
    boxes.push(b);
    out += `<g pointer-events="none"><rect x="${b.x0}" y="${b.y0}" width="${wpx * u}" height="${hpx * u}" rx="${hpx / 2 * u}" fill="${fill}" stroke="#1a1a1a" stroke-width="${1.2 * u}"/><text x="${x}" y="${y + 0.5 * u}" text-anchor="middle" dominant-baseline="central" font-size="${fs * u}"  font-weight="${bold ? 800 : 700}" fill="${fg}">${esc(text)}</text></g>`;
    return true;
  };
  // pin names first, they matter most
  const pinEls = [...$("pins").querySelectorAll("g")];
  current.forEach((r, i) => {
    const x = +pinEls[i].dataset.px, y = +pinEls[i].dataset.py;
    for (const [dx, dy] of [[0, -24], [0, 24], [44, 0], [-44, 0]]) {
      const nm = r.c.name;
      const wpx = nm.length * 11 * 0.56 + 14;
      const ox = dx ? Math.sign(dx) * (wpx / 2 + 14) : 0;
      if (label(x + ox * u, y + dy * u, nm, "#fff", "#1a1a1a", 11, true)) break;
    }
  });
  // city names when zoomed in
  if (V.s > worldS() * 3) cities.forEach((c) => { if (current.some((r) => r.c === c)) return; const x = near(X(c.lon)), y = Y(c.lat); if (inView(x, y)) label(x, y - 14 * u, c.name, "#fff", "#1a1a1a", 10, false); });
  // line labels for the highlighted lines
  const rel = relevant();
  const keys = Object.keys(lineEls).filter((k) => (S.focus ? k === S.focus : rel.has(k)));
  for (const k of keys) {
    const l = lineByKey[k];
    const txt = `${GLYPH[l.planet]} ${l.angle}`;
    const gift = GIFT.has(l.planet);
    let cands = [];
    if (l.kind === "meridian") { const x = near(X(l.lon)); for (let y = Math.max(vy0 + 30 * u, Y(70)); y < Math.min(vy1 - 20 * u, Y(-45)); y += 34 * u) cands.push([x, y]); }
    else for (const seg of l.segs) for (let i = 0; i < seg.length; i += 6) cands.push([near(X(seg[i][0])), Y(seg[i][1])]);
    cands = cands.filter(([x, y]) => inView(x, y, 22) && y > Y(72) && y < Y(-48));
    if (l.kind !== "meridian") cands.sort((a, b) => Math.abs(a[1] - V.cy) - Math.abs(b[1] - V.cy));
    for (const [x, y] of cands) if (label(x, y, txt, gift ? "#FF2D87" : "#1a1a1a", gift ? "#1a1a1a" : "#fff", 11, false)) break;
  }
  $("labels").innerHTML = out;
}

// gestures: drag to pan, pinch / ctrl+wheel / buttons to zoom
const ptrs = new Map(); let gesture = null, dragged = false;
const local = (e) => { const r = box.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
box.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".zoom")) return;
  ptrs.set(e.pointerId, local(e)); dragged = false; cancelAnimationFrame(anim);
  gesture = { v: { ...V }, pts: new Map(ptrs) };
});
box.addEventListener("pointermove", (e) => {
  if (!ptrs.has(e.pointerId) || !gesture) return;
  ptrs.set(e.pointerId, local(e));
  const ids = [...ptrs.keys()];
  if (ids.length === 1) {
    const p0 = gesture.pts.get(ids[0]), p = ptrs.get(ids[0]); if (!p0) return;
    const dx = p.x - p0.x, dy = p.y - p0.y;
    if (Math.hypot(dx, dy) > 6) dragged = true;
    if (dragged) { V.cx = gesture.v.cx - dx / gesture.v.s; V.cy = gesture.v.cy - dy / gesture.v.s; apply(); }
  } else if (ids.length >= 2) {
    const [a, b] = ids, a0 = gesture.pts.get(a), b0 = gesture.pts.get(b), a1 = ptrs.get(a), b1 = ptrs.get(b);
    if (!a0 || !b0) { gesture = { v: { ...V }, pts: new Map(ptrs) }; return; }
    dragged = true;
    const d0 = Math.hypot(a0.x - b0.x, a0.y - b0.y), d1 = Math.hypot(a1.x - b1.x, a1.y - b1.y);
    const m0 = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 }, m1 = { x: (a1.x + b1.x) / 2, y: (a1.y + b1.y) / 2 };
    const { w, h } = size(); const g = gesture.v;
    const wx = g.cx + (m0.x - w / 2) / g.s, wy = g.cy + (m0.y - h / 2) / g.s;
    V.s = g.s * (d1 / Math.max(d0, 1)); V.cx = wx - (m1.x - w / 2) / V.s; V.cy = wy - (m1.y - h / 2) / V.s; apply();
  }
  if (dragged) hideHint();
});
const up = (e) => { ptrs.delete(e.pointerId); gesture = ptrs.size ? { v: { ...V }, pts: new Map(ptrs) } : null; };
box.addEventListener("pointerup", up); box.addEventListener("pointercancel", up);
box.addEventListener("click", (e) => { if (dragged) { e.stopPropagation(); e.preventDefault(); dragged = false; } }, true);
box.addEventListener("wheel", (e) => {
  if (!e.ctrlKey && !e.metaKey) return; e.preventDefault();
  const p = local(e), { w, h } = size(); const wx = V.cx + (p.x - w / 2) / V.s, wy = V.cy + (p.y - h / 2) / V.s;
  V.s *= Math.exp(-e.deltaY * 0.01); clampV(V); V.cx = wx - (p.x - w / 2) / V.s; V.cy = wy - (p.y - h / 2) / V.s; apply(); hideHint();
}, { passive: false });
const zoomBy = (f) => { flyTo(clampV({ cx: V.cx, cy: V.cy, s: V.s * f }), 300); hideHint(); };
$("zin").addEventListener("click", () => zoomBy(1.7)); $("zout").addEventListener("click", () => zoomBy(1 / 1.7));
function hideHint() { $("hint").style.opacity = "0"; }
window.addEventListener("resize", () => setRegion(region, false), { signal });

// ── city checker ──
const q = $("q"), sug = $("suggest");
function renderResult() {
  const c = cities.find((x) => x.name === S.city); if (!c) return;
  const hits = c.hits.filter((h) => h.d < 900);
  $("quick").innerHTML = [...new Set(["London", birth.location.city, current[0] && current[0].c.name].filter(Boolean))].map((n) => `<button class="chip" data-pick="${esc(n)}" aria-pressed="${n === S.city}">${esc(n)}</button>`).join("");
  $("result").innerHTML = `<div class="tag">${esc(c.country)}${c.birth ? " · where you were born" : ""}</div><h3>${esc(c.name)}</h3>` + (hits.length
    ? hits.map((h) => { const [lab, cls] = strength(h.d); const r = READINGS[h.key]; return `<div class="hitrow"><div class="hithead"><b>${lineName(h.key)} · ${esc(r.nick)}</b><span class="strength ${cls}">${lab} · ${km(h.d)}</span></div><p>${esc(r.full)}</p></div>`; }).join("")
    : `<p class="lede">No lines run within 900km of ${esc(c.name)}, which makes it a calm, neutral place for you: lovely for a steady everyday life where your natal chart does the talking.</p>`);
}
function pickCity(name) { S.city = name; try { localStorage.setItem("szn_place_city", name); } catch (e) {} q.value = ""; sug.hidden = true; renderResult(); }
q.addEventListener("input", () => {
  const v = q.value.trim().toLowerCase();
  if (!v) { sug.hidden = true; return; }
  const m = cities.filter((c) => c.name.toLowerCase().includes(v) || c.country.toLowerCase().includes(v)).sort((a, b) => a.name.toLowerCase().indexOf(v) - b.name.toLowerCase().indexOf(v)).slice(0, 8);
  sug.innerHTML = m.length ? m.map((c) => `<button data-pick="${esc(c.name)}">${esc(c.name)}<span>${esc(c.country)}</span></button>`).join("") : `<button disabled>we don't have that one yet, try the nearest big city</button>`;
  sug.hidden = false;
});
q.addEventListener("keydown", (e) => { if (e.key === "Enter") { const b = sug.querySelector("[data-pick]"); if (b) pickCity(b.dataset.pick); } if (e.key === "Escape") sug.hidden = true; });
document.addEventListener("click", (e) => { const b = e.target.closest("#suggest [data-pick], #quick [data-pick]"); if (b) pickCity(b.dataset.pick); else if (!e.target.closest(".search")) sug.hidden = true; }, { signal });

// ── planet decoder ──
$("planets").innerHTML = PLANETS.map((p) => `<button class="pbtn" data-planet="${p}" aria-pressed="${p === S.planet}"><span class="g">${GLYPH[p]}</span><small>${p}</small></button>`).join("");
$("planets").addEventListener("click", (e) => { const b = e.target.closest("[data-planet]"); if (!b) return; S.planet = b.dataset.planet; renderDecode(); });
function citiesOn(key, max = 350) { return cities.map((c) => ({ c, d: (c.hits.find((h) => h.key === key) || {}).d ?? Infinity })).filter((x) => x.d < max).sort((a, b) => a.d - b.d); }
function renderDecode() {
  $("planets").querySelectorAll(".pbtn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.planet === S.planet)));
  $("decode").innerHTML = ANGLES.map((a) => {
    const key = `${S.planet}|${a}`, r = READINGS[key], on = citiesOn(key);
    const runs = on.length ? `runs near: ${on.slice(0, 4).map((x) => esc(x.c.name)).join(", ")}` : "mostly over ocean and open land for you";
    return `<button class="dcard" data-line="${key}"><div class="k">${GLYPH[S.planet]} ${S.planet} ${a} · ${ANGLE_INFO[a].long}</div><h4>${esc(r.nick)}</h4><p>${esc(r.short)}</p><div class="runs">📍 ${runs}</div></button>`;
  }).join("");
}
$("decode").addEventListener("click", (e) => { const b = e.target.closest("[data-line]"); if (b) openLine(b.dataset.line); });

// ── level-up places ──
(() => {
  const picks = [];
  for (const p of ["Saturn", "Pluto", "Mars"]) {
    const best = cities.flatMap((c) => c.hits.filter((h) => h.line.planet === p).map((h) => ({ c, h }))).sort((a, b) => a.h.d - b.h.d).find((x) => !picks.some((o) => o.c === x.c));
    if (best) picks.push(best);
  }
  $("care").innerHTML = picks.map(({ c, h }) => `<button class="ccard" data-city="${esc(c.name)}"><div class="k">${lineName(h.key)} · ${km(h.d)}</div><h4>${esc(c.name)}</h4><p>${esc(READINGS[h.key].short)} Best for ${esc(READINGS[h.key].use)}.</p></button>`).join("");
  $("care").addEventListener("click", (e) => { const b = e.target.closest("[data-city]"); if (b) openCity(b.dataset.city); });
})();

// ── sheet ──
let lastFocus = null;
function openSheet(html) {
  lastFocus = document.activeElement;
  $("sheetBody").innerHTML = html; $("sheet").scrollTop = 0;
  $("sheet").classList.add("on"); $("backdrop").classList.add("on"); document.body.style.overflow = "hidden";
  setTimeout(() => $("close").focus({ preventScroll: true }), 50);
}
function closeSheet() { $("sheet").classList.remove("on"); $("backdrop").classList.remove("on"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); }
$("close").addEventListener("click", closeSheet); $("backdrop").addEventListener("click", closeSheet);
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); }, { signal });
function openCity(name) {
  const c = cities.find((x) => x.name === name); if (!c) return;
  const W = weights();
  const hits = c.hits.filter((h) => h.d < 900);
  const lead = hits.slice().sort((a, b) => ((W[b.key] || 0) * prox(b.d)) - ((W[a.key] || 0) * prox(a.d)))[0];
  openSheet(`<div class="tag">${esc(c.country)}</div><h2><span class="holo-text">${esc(c.name)}.</span></h2>
    ${lead ? `<div class="hook holo">${esc(READINGS[lead.key].short)}</div>` : ""}
    ${hits.map((h) => { const [lab, cls] = strength(h.d); const r = READINGS[h.key]; return `<div class="hitrow"><div class="hithead"><b>${lineName(h.key)}</b><span class="strength ${cls}">${lab} · ${km(h.d)}</span></div><p style="font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:15px">${esc(r.nick)}</p><p>${esc(r.full)}</p><p class="use"><b>go here for:</b> ${esc(r.use)}</p></div>`; }).join("") || `<p class="lede">No lines run close to ${esc(c.name)} for you.</p>`}
    <div style="margin-top:18px"><button class="btn" data-fly-city="${esc(c.name)}">show it on my map</button></div>`);
}
function openLine(key) {
  const [p, a] = key.split("|"), r = READINGS[key], on = citiesOn(key, 400);
  openSheet(`<div class="tag">${GLYPH[p]} ${p} ${a} · ${ANGLE_INFO[a].long} · ${PLANET_WORD[p]}</div><h2><span class="holo-text">${esc(r.nick)}.</span></h2>
    <div class="hook holo">${esc(r.short)}</div><p class="lede">${esc(r.full)}</p><p class="use"><b>go here for:</b> ${esc(r.use)}</p>
    <div class="tag" style="margin-top:20px">cities on this line</div>
    <div class="pills" style="margin-top:10px">${on.length ? on.slice(0, 10).map((x) => `<button class="pill" data-open-city="${esc(x.c.name)}" style="cursor:pointer">${esc(x.c.name)} · ${km(x.d)}</button>`).join("") : '<span class="lede" style="margin:0">This one mostly runs over ocean and wide open land for you.</span>'}</div>
    <div style="margin-top:20px"><button class="btn" data-fly-line="${key}">show it on my map</button></div>`);
}
$("sheetBody").addEventListener("click", (e) => {
  const fc = e.target.closest("[data-fly-city]"), fl = e.target.closest("[data-fly-line]"), oc = e.target.closest("[data-open-city]");
  if (oc) { openCity(oc.dataset.openCity); return; }
  if (fc || fl) {
    closeSheet();
    $("mapbox").scrollIntoView({ behavior: "smooth", block: "center" });
    if (fc) { const c = cities.find((x) => x.name === fc.dataset.flyCity); S.focus = null; styleLines(); flyTo(fit(c.lon - 14, c.lon + 14, c.lat - 9, c.lat + 9), 800); }
    else { S.focus = fl.dataset.flyLine; styleLines(); const on = citiesOn(S.focus, 400)[0]; const l = lineByKey[S.focus]; if (on) flyTo(fit(on.c.lon - 22, on.c.lon + 22, on.c.lat - 14, on.c.lat + 14), 800); else if (l.kind === "meridian") flyTo(fit(l.lon - 30, l.lon + 30, -40, 65), 800); else flyTo(fit(...REGION_BOX.world), 800); }
    regionOff();
  }
});
function regionOff() { region = "none"; $("regions").querySelectorAll(".region").forEach((b) => b.setAttribute("aria-pressed", "false")); }

// go
renderTab(false);
renderResult();
renderDecode();

  return () => {
    controller.abort();
    document.body.style.overflow = "";
    root.innerHTML = "";
  };
}
