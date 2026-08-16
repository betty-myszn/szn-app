> **Committed mirror.** The working copy lives at `../MONEY-CAROUSEL-HANDOFF.md`, next to the HTML it
> describes. The carousel HTML sits outside this repo (the project root is not a git repo), so
> this copy exists to travel with the code. If you edit one, update the other.

# 8.8 Money Blueprint carousel — handoff

Everything needed to pick this up cold. Written 3 Aug 2026.

## What it is

An 11-slide Instagram carousel selling the **$45 Money Blueprint report** for the 8/8 portal.
Separate deliverable from the membership carousel, same design system.

**`money-carousel.html`** — open it in a browser. Self-contained, no build step.

Each slide is a true **1080×1350** (Instagram 4:5). The **"view at full size"** button switches
to 1:1; screenshot each slide (Cmd-Shift-4, Space, click) or print to PDF for Canva.

**It shares its entire `<style>` block with `myszn-carousel.html`.** The CSS was copied at build
time by `carousel-assets/build_money.py`, plus a `money-carousel` specific block appended after
it. If you change a shared component, the two files will drift. That is accepted; they are
separate deliverables.

**Read `CAROUSEL-HANDOFF.md` too.** The brand tokens, voice rules, gem pipeline, verification
snippet and the list of already-fixed bugs all apply here identically and are not repeated.

## Slide manifest

| # | Slide | Background | Source |
|---|-------|-----------|--------|
| 01 | your money is written in your chart. | hot pink | Betty's copy. Hook + 8/8 + $150 struck through to $45 |
| 02 | you weren't born to make money the same way as everyone else. | lav-light | Betty's copy. Two columns, astrology vs Human Design |
| 03 | what you'll find in there. | cream | Betty's copy. Six 💸 bullets |
| 04 | written from your chart. line by line. | dark | **Added.** The proof slide |
| 05 | your money shadows. named. | pink-light | **Added.** Four example shadows |
| 06 | the portal is about expansion. | lavender | Betty's copy. Why 8/8 |
| 07 | imagine if you knew. | mint | Betty's copy |
| 08 | this report is about worth. | dark | **Added.** The thesis |
| 09 | three steps. | cream | **Added.** How it works + birth-time warning |
| 10 | one week. that's it. | hot pink | Betty's copy. The offer |
| 11 | let's get the money, honeyyy. | dark | Betty's copy. CTA |

Five slides were added to Betty's original seven; she cut one of them (see below).

## Decisions Betty made, do not undo

1. **No page-count claims.** An earlier slide 4 led with "56 pages / 37 sections / 7 parts" as a
   stats grid. Betty: *"i dont think we need to be as specific as 56 pages."* It was rewritten to
   argue depth qualitatively, via the "every section names the placements it was built from"
   angle. The shadows slide was softened the same way. **Do not reintroduce page counts.**
2. **Never mention templates.** Slide 04 used to read "built from your chart. not a template."
   Betty: *"i dont think we need to mention anything about templates or put that idea in their
   head."* The slide now says "written from your chart. line by line." and the tag above it reads
   "written for one chart only". Sell it on being personal and unique to her; do not name the thing
   it is not, anywhere in the deck.
3. **No "this is what you get" slide.** There was a slide showing three mocked-up report pages
   (section page with its "read from" band, a shadow page with the cost table, an affirmations
   page). Betty removed it. The `.pages` / `.pg` / `.pgi` CSS for it is still in the file but
   unused, so it can be rebuilt if she changes her mind. Removing that CSS is safe otherwise.

## Facts on the slides, and where they came from

Verified against the app on 3 Aug 2026. Re-check before reposting.

| Claim | Source |
|---|---|
| $45, normally $150 | `app/src/app/money-blueprint/page.tsx:10-11` |
| Live sales page at `/money-blueprint` | route exists, in `NavBar.tsx` |
| Stripe link live | `MONEY_BLUEPRINT_CHECKOUT_URL`, same file line 14 |
| "one week only" | the page's own banner copy |
| Birth date, **exact time** and place required | the page's three-steps block |
| PDF **within 24 hours**, not instant | same block, step 3 |
| One payment, not a subscription | same block, step 2 |
| Astrology + Human Design | HD engine is real and working, see `money-blueprint/HANDOFF.md` |
| Shadow names used as examples | `money-blueprint/REPORT-SPEC.md`, Part Two |
| Purpose read from the north node | `REPORT-SPEC.md`, Part Four section 16 |

The four shadows on slide 05 are **Betty's own**, used as examples of the range. The slide says
so explicitly ("Yours will be different"). Keep that line if you edit the slide.

The "about worth, not money" framing on slide 08 comes from Betty's stated thesis for the report.

## Dates

8/8 falls on **Saturday 8 August 2026**. The offer runs one week; slide 11 says **"$45 until
Monday 10 August"**. If this gets reposted in a later year, both need updating, and slide 06's
sticker says "saturday 8 august" too.

## The scatter: gone, deliberately

There is none. The slides carry no decorative objects at all: type, stickers and the striped
edges only.

The deck used to carry 76 gemstone cut-outs borrowed from the membership carousel. Betty cut them
("I'd rather have money related things in it"). Two replacements were tried and both rejected:
photographed banknotes from her Cosmic Cash report deck, which looked cheap at this size, and gold
glitter dollar signs, which she called gross. **Do not put a scatter back on this deck without
asking her.** The membership carousel keeps its stones; this one is bare on purpose.

The gem version is kept at `carousel-assets/money-carousel.gems-backup.html` if it is ever wanted
back, and `money_objects.py` + `make_dollars.py` still build the dollar-sign version from it.
Stripping the scatter took the file from 4 MB to **0.03 MB**.

## Fill

Bare slides read empty, so each slide's copy block is scaled up to take the space back, via an
`f115`/`f12`/`f128`/`f13`/`f135` class on the `.s` div that zooms `> .d` and `> .grow > *`.

The step is per slide, because a six-bullet slide has less room to give than a one-line one, but
it is held between **1.15 and 1.35** so body copy stays recognisably the same size across a swipe.
Several slides could take 1.5 or more before they hit the footer; they are deliberately not
pushed that far. If you edit copy, re-measure: the ceiling is the sticker top, or the footer, or
1342px, whichever comes first.

`zoom` takes a **literal** number in those rules on purpose. `zoom:var(--fill)` parses without
error and is then dropped, so the rule silently does nothing and every slide renders unscaled.

## Verification

Same as the membership deck, with the money-specific solid selectors:

```js
document.body.classList.remove('fit');
document.documentElement.style.setProperty('--s',1);
document.querySelectorAll('.slot').forEach(el=>{el.style.height='1350px';el.style.width='1080px';});
function lineRects(el){const r=document.createRange();r.selectNodeContents(el);return [...r.getClientRects()];}
const SOLID='.col,.stat,.sc,.st,.sticker,.btn,.chip,.ticks li';
const out=[];
document.querySelectorAll('.s').forEach((s,i)=>{
  if(s.scrollHeight>1342) out.push('slide'+(i+1)+' OVERFLOWS '+Math.round(s.scrollHeight));
  [...s.querySelectorAll('.gem')].forEach(g=>{const a=g.getBoundingClientRect();
    [...s.querySelectorAll('p,h2,h4,li,.tag,.foot span,.was,.now,'+SOLID)].forEach(o=>{
      const boxes=o.matches(SOLID)?[o.getBoundingClientRect()]:lineRects(o);
      boxes.forEach(b=>{const ox=Math.min(a.right,b.right)-Math.max(a.left,b.left),
                        oy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
        if(ox>4&&oy>4) out.push('slide'+(i+1)+' gem over '+(o.className||o.tagName));});});});
});
console.log(out.length?out.join('\n'):'CLEAN');
```

Current state: **CLEAN**, 11 slides all at 1342px, **zero decorative objects** (verified: no
`<img>` tags and no `.gem` elements anywhere in the file).

The gem half of the snippet therefore matches nothing today and is a no-op. It is kept so the
check still works if a scatter is ever restored from the backup. The part that matters right now
is the `scrollHeight > 1342` overflow test, which is the one that catches copy edits.

## Build scripts

In `carousel-assets/`, applied in this order. One-shot transforms, each assuming the state the
previous one left. Do not re-run against the current file.

| script | what it did |
|---|---|
| `build_money.py` | built the 12-slide deck, copying the shared `<style>` from the membership carousel |
| `money_gems.py` | placed 72 gems from measured gaps |
| `money_fix.py`, `money_fix2.py` | cleared gems off headlines (rotation expands the bounding box, so `left:-54` still reached x=85) |
| `money_trim.py` | removed the peek slide, de-specified the proof slide, renumbered to 11 |
| `money_fix3.py` | cleared two gems from under the slide 04 sticker, softened the shadows copy |
| `make_dollars.py` | generated the three gold glitter dollar signs. Re-runnable, seeded |
| `money_objects.py` | swapped all 76 gems for dollar signs, at new random sizes and tilts |

`money_objects.py` runs against the **gem** version of the file, not the current one. To redo the
scatter with a different throw, restore `money-carousel.gems-backup.html` over
`money-carousel.html` first, change the seed, run it, then re-run the verification snippet and
nudge anything that lands on text (four signs needed it last time).

## Open

1. **The report itself is not fully built.** The sales page and Stripe are live and the engine
   exists, but check `money-blueprint/PROGRESS.md` for whether delivery is automated before
   driving traffic. The carousel promises a PDF within 24 hours.
2. Slide 11's date needs changing if the offer is extended.
3. Betty has not seen this rendered at full size yet as of writing.
