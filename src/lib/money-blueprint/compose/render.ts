/**
 * Money Blueprint — render.
 *
 * Blocks in, print-ready A4 HTML out. The only module that knows about markup. Design is ported
 * verbatim from the approved reference report so generated output is visually identical to it.
 */

import type { Block, WrittenSection } from "./blocks";

export interface RenderInput {
  name: string;
  birthLine: string;
  chartLine: string;
  sections: WrittenSection[];
  parts: Array<{ part: number; title: string; lede: string }>;
  contents: Array<{ number: number | null; title: string; part: number }>;
  glance: { cards: Array<{ h: string; p: string }>; rows: string[][]; footnote: string };
  /** Optional base64 data URIs for the two cutout motifs. */
  motifs?: { cash?: string; saturn?: string };
  /**
   * Exact rendered block heights from a previous measuring pass, keyed by section id.
   * When present these replace the estimator, which is what makes pages land flush: a static
   * model cannot be both overflow-safe and dense across this much variety.
   */
  measured?: Record<string, number[]>;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** {pk}...{/pk} marks the pink accent span inside a headline. */
const accent = (s: string) =>
  esc(s)
    .replace(/\{pk\}(.*?)\{\/pk\}/g, '<span class="pk">$1</span>')
    // <br> is the only markup allowed through a headline, and esc() has just neutralised it.
    .replace(/&lt;br\s*\/?&gt;/g, "<br>");

const ORD = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];

// ------------------------------------------------------------------ blocks

function renderBlock(b: Block): string {
  switch (b.kind) {
    case "p":
      return `<p>${esc(b.text)}</p>`;
    case "sub":
      return `<span class="sub">${esc(b.text)}</span>`;
    case "howlist":
      return `<ul class="howlist">${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    case "steps":
      return `<ol class="steps">${b.items
        .map(([h, t]) => `<li><strong>${esc(h)}.</strong> ${esc(t)}</li>`)
        .join("")}</ol>`;
    case "table":
      return `<table><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>${b.rows
        .map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="f"' : ""}>${esc(c)}</td>`).join("")}</tr>`)
        .join("")}</table>`;
    case "cards":
      return `<div class="grid2">${b.items
        .map((c) => `<div class="card"><div class="h">${esc(c.h)}</div><p>${esc(c.p)}</p></div>`)
        .join("")}</div>`;
    case "pull": {
      const t = b.accent && b.text.includes(b.accent)
        ? esc(b.text).replace(esc(b.accent), `<span class="pk">${esc(b.accent)}</span>`)
        : esc(b.text);
      return `<div class="pull">${t}</div>`;
    }
    case "tool":
      return `<div class="tool"><span class="k">${esc(b.label)}</span>${b.paras
        .map((x) => `<p>${esc(x)}</p>`)
        .join("")}</div>`;
    case "action":
      return `<div class="action"><span class="k">${esc(b.label)}</span><p>${esc(b.text)}</p></div>`;
    case "shadowlist":
      return `<ul class="shadowlist">${b.items
        .map((i) => `<li><span class="n">${esc(i.n)}</span><span class="t">${esc(i.t)}</span><span class="s">${esc(i.s)}</span></li>`)
        .join("")}</ul>`;
    case "letter":
      return `${b.paras.map((x) => `<p>${esc(x)}</p>`).join("")}<p class="signoff">${esc(b.signoff)}</p>`;
  }
}

function readFromBand(items: string[]): string {
  if (!items.length) return "";
  return `<div class="readfrom"><span class="k">Read from</span><ul>${items
    .map((i) => `<li>${esc(i)}</li>`)
    .join("")}</ul></div>`;
}

/**
 * Paginates a section's blocks across its page budget. Blocks are kept whole, and an `action`
 * block is always pushed to the bottom of the page it lands on, which is how the reference
 * report reads.
 */
/**
 * Rendered height of a block, in CSS pixels at the report's own type scale.
 *
 * These are measured values, taken from the rendered report in a browser rather than estimated,
 * which is what lets the paginator fill a page to the edge without overflowing it.
 */
function blockWeight(b: Block): number {
  switch (b.kind) {
    case "p": return Math.max(28, b.text.length * 0.236);
    case "sub": return 15;
    case "howlist": return 17 + b.items.reduce((s, i) => s + Math.max(20, i.length * 0.166), 0);
    case "steps": return 18 + b.items.reduce((s, [h, x]) => s + Math.max(27, (h.length + x.length) * 0.187), 0);
    case "table": return 37 + b.rows.reduce((s, row) => {
      const longest = Math.max(...row.map((c) => c.length), 1);
      return s + Math.max(31, longest * (row.length >= 3 ? 0.476 : 0.344));
    }, 0);
    case "cards": return Math.ceil(b.items.length / 2) * (96 + Math.max(...b.items.map((i) => i.p.length), 1) * 0.191);
    case "tool": return 31 + b.paras.reduce((s, x) => s + Math.max(31, x.length * 0.316), 0);
    case "pull": return 64;
    case "action": return 97;
    case "shadowlist": return 20 + b.items.length * 34;
    case "letter": return b.paras.reduce((s, x) => s + Math.max(28, x.length * 0.236), 0) + 40;
  }
}

/** A4 page height minus running head, folio and a safety margin. */
const PAGE_PX = 1005;
/** The first page of a section also carries the rule, headline and Read from band. */
const FIRST_PAGE_CHROME = 240;

/** How many pages this section needs, used only for the contents estimate. */
export function pagesNeeded(blocks: Block[]): number {
  return Math.max(1, paginate(blocks).length);
}

/**
 * Balanced pagination.
 *
 * Works out how many pages the content genuinely needs, then spreads it evenly across them rather
 * than packing the first pages full and leaving a thin tail. Never exceeds a page's real capacity,
 * because `.page` clips overflow, so an over-full page silently loses copy.
 */
function paginate(blocks: Block[], measured?: number[]): Block[][] {
  const h = blocks.map((b, i) => (measured && measured[i] != null ? measured[i] : blockWeight(b)));
  const firstCap = PAGE_PX - FIRST_PAGE_CHROME;

  /** Greedy pack at a given per-page ceiling. Returns null if any single block cannot fit. */
  const pack = (ceil: number): Block[][] | null => {
    const out: Block[][] = [];
    let cur: Block[] = [];
    let acc = 0;
    let cap = Math.min(firstCap, ceil);
    for (let i = 0; i < blocks.length; i++) {
      if (h[i] > cap && cur.length === 0) return null;
      if (acc > 0 && acc + h[i] > cap) {
        out.push(cur);
        cur = [];
        acc = 0;
        cap = Math.min(PAGE_PX, ceil);
      }
      cur.push(blocks[i]);
      acc += h[i];
    }
    if (cur.length) out.push(cur);
    return out;
  };

  // Fewest pages the content can occupy without clipping.
  const minimal = pack(PAGE_PX);
  if (!minimal) return [blocks];
  const n = minimal.length;
  if (n === 1) return minimal;

  // Then squeeze: the smallest ceiling that still fits in n pages spreads content evenly instead
  // of packing the front pages full and leaving a stub at the end.
  let lo = Math.max(...h);
  let hi = PAGE_PX;
  let best = minimal;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const attempt = pack(mid);
    if (attempt && attempt.length <= n) {
      best = attempt;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return best;
}

// ------------------------------------------------------------------ pages

function pageShell(bg: string, inner: string, folio: string, crumb: string, dark = false): string {
  return `<section class="page ${bg}">
<div class="runhead"><span class="crumb">${crumb}</span><span class="wordmark"${dark ? ' style="color:var(--cream)"' : ""}>MY SZN</span></div>
${inner}
<div class="folio abs"><span>MY SZN &middot; The Money Blueprint</span><span>${folio}</span></div>
</section>`;
}

/**
 * Measuring pass. Emits every section's blocks in a single unconstrained column with each block
 * tagged, so a browser can report exact rendered heights. Never shipped to a buyer.
 */
export function renderForMeasure(input: RenderInput): string {
  const body = input.sections.map((s) => `<section class="measure" data-section="${esc(s.id)}">
${s.blocks.map((b, i) => `<div data-block="${i}">${renderBlock(b)}</div>`).join("\n")}
</section>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
.measure{width:210mm;padding:0 15mm;box-sizing:border-box;background:var(--cream);}
.measure [data-block]{display:block;}
.action{margin-top:0 !important;}
</style></head><body><div class="book">${body}</div></body></html>`;
}

export function renderReport(input: RenderInput): string {
  const { name, birthLine, chartLine, sections, parts, contents, glance, motifs, measured } = input;
  const pagesHtml: string[] = [];
  let folio = 1;

  // cover
  pagesHtml.push(`<section class="page bg-dark cover">
<div class="frame"></div>
<div class="runhead"><span class="crumb">The Money Blueprint &middot; ${esc(name)} &middot; MY&nbsp;SZN</span></div>
<div class="keywords">Worth &nbsp;&middot;&nbsp; Wealth &nbsp;&middot;&nbsp; Receiving &nbsp;&middot;&nbsp; Purpose</div>
<div style="margin-top:12mm;"><h1 class="display">${esc(name.toLowerCase())}'s<br><span class="pk">money</span><br>blueprint.</h1></div>
${motifs?.cash ? `<img class="motif" src="${motifs.cash}" style="width:86mm;right:-8mm;top:112mm;transform:rotate(-8deg);filter:drop-shadow(0 18px 30px rgba(0,0,0,.5));">` : ""}
<div class="meta" style="margin-top:auto;">
  <div><div class="lbl">Prepared for</div><div class="val">${esc(name)}</div></div>
  <div><div class="lbl">Chart</div><div class="val">${esc(chartLine)}</div></div>
</div>
<div class="folio" style="margin-top:8mm;color:var(--pink-light);"><span class="wordmark" style="color:var(--cream);">MY SZN</span><span>${esc(birthLine)}</span></div>
</section>`);
  folio++;

  // chart at a glance
  pagesHtml.push(pageShell("bg-pinkbg",
    `<div class="rule">The data this report is built on</div>
<h2 class="display" style="margin-top:3mm;">your chart,<br>on <span class="pk">one page.</span></h2>
<div class="grid2" style="margin-top:5mm;">${glance.cards.map((c) => `<div class="card"><div class="h">${esc(c.h)}</div><p>${esc(c.p)}</p></div>`).join("")}</div>
<table style="margin-top:5mm;"><tr><th>Placement</th><th>Sign</th><th>House</th></tr>
${glance.rows.map((r) => `<tr><td class="f">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</table>
<p style="margin-top:4mm;font-size:9pt;color:#555;">${esc(glance.footnote)}</p>`,
    String(folio).padStart(2, "0"), "Your chart at a glance"));
  folio++;

  // contents
  pagesHtml.push(pageShell("bg-cream",
    `<div class="rule">What's inside</div>
<h2 class="display" style="margin-top:3mm;">your<br>blueprint.</h2>
<ul class="toc">${contents.map((c) => {
      const isPartHead = c.number === null && c.title.startsWith("__part__");
      if (isPartHead) return `<li class="part">${esc(c.title.replace("__part__", ""))}</li>`;
      return `<li><span class="n">${c.number ? String(c.number).padStart(2, "0") : "&middot;"}</span><span class="t">${esc(c.title)}</span></li>`;
    }).join("")}</ul>`,
    String(folio).padStart(2, "0"), "Contents"));
  folio++;

  // body
  let currentPart = 0;
  for (const s of sections) {
    if (s.part !== currentPart) {
      currentPart = s.part;
      const meta = parts.find((x) => x.part === currentPart);
      if (meta) {
        const bgs = ["bg-lav", "bg-mint", "bg-lav", "bg-gold", "bg-mint", "bg-lav", "bg-pinkbg"];
        pagesHtml.push(`<section class="page ${bgs[(currentPart - 1) % bgs.length]}">
<div class="runhead"><span class="crumb">Part ${ORD[currentPart] ?? currentPart}</span><span class="wordmark">MY SZN</span></div>
${currentPart === 1 && motifs?.saturn ? `<img class="motif" src="${motifs.saturn}" style="width:108mm;right:-22mm;top:-12mm;transform:rotate(6deg);opacity:.9;filter:drop-shadow(0 14px 24px rgba(80,60,120,.30));">` : ""}
<div style="margin-top:auto;">
  <div class="star">&#10022;</div>
  <h2 class="display" style="margin-top:4mm;">${accent(meta.title)}</h2>
  <p class="lede" style="margin-top:7mm;max-width:114mm;">${esc(meta.lede)}</p>
</div>
<div class="folio" style="margin-top:auto;"><span>MY SZN &middot; The Money Blueprint</span><span>${String(folio).padStart(2, "0")}</span></div>
</section>`);
        folio++;
      }
    }

    const chunks = paginate(s.blocks, measured?.[s.id]);
    chunks.forEach((chunk, idx) => {
      const first = idx === 0;
      const crumb = `${s.number ? String(s.number).padStart(2, "0") + " &middot; " : ""}${esc(s.title)}${chunks.length > 1 ? ` &middot; ${idx + 1} of ${chunks.length}` : ""}`;
      const head = first
        ? `<div class="rule">${esc(s.title)}</div>
<h3 class="display" style="margin:2.5mm 0 0;">${accent(s.headline)}</h3>
${readFromBand(s.readFrom)}`
        : "";
      pagesHtml.push(pageShell(`bg-${s.bg ?? "cream"}`, head + chunk.map(renderBlock).join("\n"),
        String(folio).padStart(2, "0"), crumb, s.bg === "dark"));
      folio++;
    });
  }

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(name)}'s Money Blueprint</title>
<style>${CSS}</style></head><body><div class="book">
${pagesHtml.join("\n")}
</div></body></html>`;
}

// ------------------------------------------------------------------ css (ported from the reference report)

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;700&display=swap');
:root{--ink:#1a1a1a;--pink:#FF2D87;--pink-bg:#FFF0F7;--pink-light:#FFE0F0;--lav:#C8B4F8;--lav-light:#E8DFFE;
--mint:#E1F5EE;--cream:#FFF8F0;--gold:#FFF4D6;--display:'Poppins','Trebuchet MS',sans-serif;
--body:'DM Sans',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;}
body{margin:0;background:linear-gradient(#D7D0C6,#C7BFB4);padding:32px 0;font-family:var(--body);color:var(--ink);}
.book{width:210mm;margin:0 auto;}
.page{position:relative;width:210mm;height:297mm;background:var(--cream);overflow:hidden;margin:0 auto 26px;
box-shadow:0 12px 38px rgba(40,30,20,.30);padding:15mm 15mm 13mm;display:flex;flex-direction:column;}
.bg-dark{background:var(--ink);color:var(--cream);} .bg-mint{background:var(--mint);}
.bg-lav{background:var(--lav-light);} .bg-pinkbg{background:var(--pink-bg);} .bg-gold{background:var(--gold);}
.bg-cream{background:var(--cream);}
.crumb{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.2em;font-size:7pt;color:var(--pink);}
.bg-dark .crumb{color:var(--pink-light);}
.runhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6mm;}
.wordmark{font-family:var(--display);font-weight:800;letter-spacing:.3em;font-size:8pt;}
.rule{display:flex;align-items:center;gap:11px;font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.18em;font-size:8pt;}
.rule::after{content:"";flex:1;height:1.5px;background:currentColor;opacity:.25;}
.display{font-family:var(--display);font-weight:800;text-transform:lowercase;letter-spacing:-.035em;line-height:.93;margin:0;}
.display .pk{color:var(--pink);} .bg-dark .display{color:var(--cream);}
h1.display{font-size:48pt;} h2.display{font-size:34pt;} h3.display{font-size:22pt;}
.keywords{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.26em;font-size:8pt;color:var(--lav);}
.readfrom{border:1.5px solid var(--ink);background:#fff;padding:4mm 5mm;margin:2.5mm 0 4.5mm;}
.readfrom .k{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.2em;font-size:7pt;color:var(--pink);display:block;margin-bottom:1.8mm;}
.readfrom ul{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:1.4mm 4mm;}
.readfrom li{font-family:var(--display);font-weight:600;font-size:8.2pt;line-height:1.3;}
.readfrom li::before{content:"\\2726 ";color:var(--pink);}
p{font-size:10.1pt;line-height:1.58;margin:0 0 7pt;}
.lede{font-family:var(--display);font-weight:500;font-size:11.5pt;line-height:1.5;}
.sub{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.16em;font-size:7.5pt;color:var(--pink);display:block;margin:4mm 0 1.8mm;}
.howlist{list-style:none;margin:0 0 2mm;padding:0;}
.howlist li{position:relative;padding-left:12pt;margin-bottom:2.6pt;font-size:9.8pt;line-height:1.4;}
.howlist li::before{content:"\\2726";color:var(--pink);position:absolute;left:0;top:1pt;font-size:7.5pt;}
.steps{counter-reset:s;list-style:none;margin:0;padding:0;}
.steps li{counter-increment:s;position:relative;padding-left:16pt;margin-bottom:3pt;font-size:9.8pt;line-height:1.4;}
.steps li::before{content:counter(s);position:absolute;left:0;top:0;width:11pt;height:11pt;background:var(--pink);color:#fff;border-radius:50%;
font-family:var(--display);font-weight:700;font-size:6.5pt;display:flex;align-items:center;justify-content:center;}
.tool{border-left:3px solid var(--pink);background:#fff;padding:3.4mm 4.5mm;margin:2.2mm 0;}
.tool .k{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.16em;font-size:6.8pt;color:var(--pink);display:block;margin-bottom:1.2mm;}
.tool p{margin:0 0 3pt;font-size:9.4pt;line-height:1.45;font-style:italic;}
.tool p:last-child{margin-bottom:0;}
.pull{font-family:var(--display);font-weight:700;font-size:12.5pt;line-height:1.3;padding:4.5mm 0;border-top:1.5px solid var(--ink);border-bottom:1.5px solid var(--ink);margin:3.5mm 0;}
.pull .pk{color:var(--pink);}
.action{border:1.5px solid var(--ink);border-radius:3px;padding:4.5mm 5.5mm;background:var(--gold);margin-top:auto;}
.bg-gold .action,.bg-pinkbg .action{background:#fff;}
.action .k{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.18em;font-size:7.5pt;color:var(--pink);display:block;margin-bottom:1.8mm;}
.action p{margin:0;font-family:var(--display);font-weight:500;font-size:10.1pt;line-height:1.42;}
.folio{font-family:var(--display);font-weight:700;letter-spacing:.18em;font-size:7pt;color:var(--pink);display:flex;justify-content:space-between;}
.folio.abs{position:absolute;left:15mm;right:15mm;bottom:9mm;}
.star{color:var(--pink);font-size:13pt;letter-spacing:.5em;}
.frame{position:absolute;inset:7mm;border:1.5px solid rgba(255,248,240,.32);pointer-events:none;}
.motif{position:absolute;pointer-events:none;}
.meta{display:flex;gap:11mm;flex-wrap:wrap;}
.meta .lbl{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.18em;font-size:6.5pt;color:var(--lav);margin-bottom:1.5mm;}
.meta .val{font-family:var(--display);font-weight:600;font-size:11pt;}
table{width:100%;border-collapse:collapse;font-size:9.1pt;margin-top:1mm;}
th{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:6.6pt;color:var(--pink);text-align:left;padding:2mm 2mm;border-bottom:1.5px solid var(--ink);}
td{padding:2mm 2mm;border-bottom:1px solid rgba(26,26,26,.10);line-height:1.35;}
td.f{font-family:var(--display);font-weight:600;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:4mm;}
.card{border:1.5px solid var(--ink);background:#fff;padding:4mm 4.5mm;}
.card .h{font-family:var(--display);font-weight:800;font-size:10.5pt;margin-bottom:1.5mm;}
.card p{font-size:9.2pt;line-height:1.42;margin:0;}
.shadowlist{list-style:none;margin:5mm 0 0;padding:0;}
.shadowlist li{display:flex;gap:5mm;align-items:baseline;padding:3.2mm 0;border-bottom:1.5px solid rgba(26,26,26,.12);}
.shadowlist .n{font-family:var(--display);font-weight:800;font-size:14pt;color:var(--pink);width:11mm;}
.shadowlist .t{font-family:var(--display);font-weight:700;font-size:11.5pt;flex:1;}
.shadowlist .s{font-size:9pt;color:#555;flex:2;line-height:1.38;}
.toc{list-style:none;margin:4mm 0 0;padding:0;column-count:2;column-gap:9mm;}
.toc li{display:flex;align-items:baseline;gap:5pt;padding:2.4pt 0;border-bottom:1px solid rgba(26,26,26,.10);break-inside:avoid;}
.toc .n{font-family:var(--display);font-weight:800;font-size:7.5pt;color:var(--pink);width:14pt;}
.toc .t{flex:1;font-family:var(--display);font-weight:600;font-size:8.6pt;}
.toc li.part{font-family:var(--display);font-weight:800;font-size:8pt;text-transform:uppercase;letter-spacing:.18em;color:var(--pink);border-bottom:0;padding-top:4mm;display:block;}
.signoff{font-family:var(--display);font-weight:600;font-size:12pt;margin-top:5mm;}
.cover .keywords{margin-top:0;}
@media print{body{background:none;padding:0;}.page{margin:0;box-shadow:none;page-break-after:always;}
.page:last-child{page-break-after:auto;}@page{size:A4;margin:0;}}
`;
