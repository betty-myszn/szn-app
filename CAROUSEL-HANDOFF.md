> **Committed mirror.** The working copy lives at `../CAROUSEL-HANDOFF.md`, next to the HTML it
> describes. The carousel HTML sits outside this repo (the project root is not a git repo), so
> this copy exists to travel with the code. If you edit one, update the other.

# MY SZN promo carousel — handoff

Everything needed to pick this up cold. Written 1 Aug 2026.

## What it is

A 12-slide Instagram carousel selling the MY SZN membership, built to match the live site's
branding. One self-contained file, no build step, no dependencies:

**`myszn-carousel.html`** — open it in a browser.

Each slide is a true **1080×1350** (Instagram 4:5 portrait). The page renders them scaled to fit;
the **"view at full size"** button in the top bar switches to 1:1. Export by screenshotting each
slide at full size (Cmd-Shift-4, Space, click the slide) or by printing to PDF and dropping the
pages into Canva.

It started square and was converted to 4:5 by `carousel-assets/portrait.py`, which also bumped the
display sizes a notch to suit the taller canvas. Content currently measures 1342px on every slide,
so there is ~8px of slack. Anything added needs re-checking against 1350.

## Slide manifest

| # | Slide | Background | Job |
|---|-------|-----------|-----|
| 01 | you're invited to your best life. | hot pink | Hook. Party-invite framing + the "astrology tells you who you are / MY SZN is where you become her" line |
| 02 | you've been waiting for permission. | lav-light | The problem. Names a reader who already knows her chart and is still waiting |
| 03 | a whole platform. built around your chart. | lavender | The mechanic: house → sign → ruler → where the ruler sits, plus Human Design |
| 04 | your chart, fully decoded. | mint | Features pt 1: birth chart across 11 life areas, Human Design, life-area readings |
| 05 | new season. new era. new you. | pink-light | Features pt 2: your szn, goals, shadow journal, style codes, moon audios/challenges/affirmations |
| 06 | this is what it looks like. | cream | Three phone mockups of real product screens |
| 07 | two live workshops. every szn. | dark | Live coaching, The Vault, the 24/7 community |
| 08 | this szn's workshops. | gold | The two real Leo szn workshops with the real date |
| 09 | everyone else stops at the reading. | pink-bg | Differentiation table, the rest of the internet vs MY SZN |
| 10 | three ways in. | lav-light | The three membership tiers |
| 11 | three seasons from now. | mint | The transformation, five concrete beats + Sarah's testimonial |
| 12 | this is your szn. | hot pink | CTA, prices, itsmyszn.com |

Features split across two slides deliberately: one slide of eleven bullets reads as a spec
sheet, two slides read as depth.

## Voice rules (non-negotiable)

- **No em dashes anywhere.** Commas, colons, full stops or brackets.
- **No rhetorical questions**, and never "and honestly?".
- **No "No fluff. Just X."**-style punchy negation-then-payoff clichés. Note the live membership
  page still contains "No fluff. Just transformation." — do not copy that pattern into new work.
- Lowercase display headings, sentence-case body, uppercase letterspaced small labels.

## Brand tokens

Lifted verbatim from `app/src/app/globals.css`. **Do not invent brighter variants.** An earlier
draft used a saturated `#FFD84D` yellow, a popped mint and a popped lavender; all three were
off-brand and got pulled.

```
--pink        #FF2D87   the only saturated brand colour
--lav         #C8B4F8   the mid
--pink-light  #FFE0F0   --pink-bg #FFF0F7   --lav-light #E8DFFE
--mint        #E1F5EE   --gold    #FFF4D6   --cream     #FFF8F0
--dark        #1a1a1a
```

`--gold` is a pale wash only. Yellow is in the palette, but never saturated.

Type: Poppins 800/900 for display (lowercase, tight tracking), DM Sans for body. Loaded from
Google Fonts, so the file needs a connection to render exactly right.

The "party" energy comes from full-bleed pink, 4px black borders, hard offset shadows
(`box-shadow: 9px 9px 0 var(--dark)`), tilted stickers, the candy stripe, and the gems. It does
**not** come from new colours.

## The phone mockups (slide 06)

Each mirrors a real screen. Betty supplied screenshots; the mockups are hand-built CSS
reproductions, not image captures.

**Critical technique:** each screen (`.vp`) is authored at a true **390 × 786** device size and
then scaled down with `transform: scale(.63589)` to fit the 262px handset frame. Type, padding
and row heights are therefore the real site's values, not miniatures. An earlier version authored
everything at 7-12px directly inside the small frame and the proportions were visibly wrong: the
headings read tiny and one screen filled only 67% of its height. If you edit a screen, keep
working in real device pixels and let the transform do the shrinking. Content should end within
a few px of 786 so the screen fills top to bottom.

Rebuild script: `carousel-assets/phones.py`.

1. **Community chat room** — `/community`. Header, pink ticker, dark "you found your people."
   hero, spaces tabs, then a mock conversation (Jess, Priya, Betty as host, Lauren, plus a
   typing indicator). Deliberately busy: the community angle needed to look alive.
2. **Area by area** — `/your-season`. "how leo szn is hitting every part of your life." with
   mindset / confidence / career rows, each with its house chip and a pink link.
3. **My chart** — `/my-chart`. Lavender ticker, "start here. this is you.", the big-three cards
   (libra sun / aquarius moon / aquarius rising), then the natal wheel running off the bottom
   edge the way it does mid-scroll on the real page. The wheel is drawn to real geometry by
   `carousel-assets/wheel.py`: house cusp *k* sits at `180 - k*30` degrees in screen space, which
   puts AC left, IC bottom, DC right and MC top, matching the app's orientation. This screen
   replaced an events mockup; the Leo workshops still have their own dedicated slide 08.

The MY SZN disco-planet logo is inlined as a base64 PNG, downscaled from
`app/public/disco-planet-logo.png`.

## The gems

48 scattered gems, 4 per slide, cut out with alpha and inlined as base64.

**Source:** `~/Desktop/gems 2.jpg`, `gems 3.jpg`, `gems 4.jpg`.

**Licence caveat, unresolved:** gems 2 and 3 carry a visible "maría josé diseños" watermark.
The extraction script skips any gem whose bounding box touches the watermark, but avoiding the
mark is not the same as holding a licence. Betty was told and chose to proceed. If this pack
wasn't purchased, it is worth licensing properly before the carousel runs as paid promo.

**Pipeline** (all in `carousel-assets/`, run in this order):

1. `cut.py` — floods the background inward from the border, fills holes, labels components,
   filters by size/solidity/aspect, skips the watermark box, writes cutouts to
   `carousel-assets/gems-cutouts/` plus a numbered contact sheet for picking.
2. `swap.py` — takes the curated `PICKS` list of contact-sheet indices, downscales to 200px,
   base64-inlines them, and replaces the gem placeholders in the HTML.

Everything in `carousel-assets/`, in the order it was applied. These are one-shot transforms:
each assumes the file is in the state the previous one left it, so **do not re-run them against
the current HTML**. They are a record of how it was built and a source of reusable technique.

| script | what it did |
|--------|-------------|
| `cut.py` | segments the gem sheets, writes cutouts + contact sheet |
| `inject.py` | first gem scatter, rebuilt phone 3 |
| `nudge.py` | pushed edge gems further off-canvas |
| `swap.py` | replaced placeholder SVG gems with the real cutouts |
| `chat.py` | first pass at the community phone |
| `phones.py` | rebuilt all three phones at true device scale |
| `wheel.py` | built the natal wheel, made phone 3 the my-chart screen |
| `portrait.py` | square to 4:5 |
| `fillgaps.py`, `gapfill2.py` | interior gems into measured whitespace |
| `pullback.py` | pulled invisible edge gems back on-canvas |
| `stretch.py` / `unstretch.py` | the rejected stretch experiment and its revert |

Hand edits to the `<img class="gem">` tags are usually easier now than re-running any of this.

To change which stones appear: edit `PICKS` and the `order` list in `swap.py`, then re-run it
against a copy of the HTML that still holds SVG gem placeholders (or hand-edit the `<img
class="gem">` tags directly, which is usually easier now).

**Placement, 118 gems, 8 to 11 per slide.** Positions live inline on each `<img class="gem">`.
Two kinds:

- *Edge gems* bleed off-canvas so only part of the stone shows. Keep the visible sliver above
  ~45% of the width or the gem reads as a smudge; `pullback.py` fixes ones pushed too far out.
- *Interior gems* sit in genuine whitespace. **Do not eyeball these.** Betty's note was that
  edge-only placement "looks weird", so they were positioned by measuring the rendered slides:
  build an occupancy grid from every text *line box* plus every solid card, find the largest
  empty squares, and drop a gem at ~50% of that square's size so it keeps air around it. The
  console routine that does it is in the Verification section below, with the size threshold
  lowered and the pick count raised.

Wide-but-short dead bands (the strip under a headline, the strip above a footer) are the ones a
square-based detector misses. Measure those directly as the gap between two elements' bounding
boxes, e.g. `h2.bottom` to `.cards.top`. Those bands are exactly what Betty pointed at.

Placement scripts: `fillgaps.py` then `gapfill2.py` (the coordinates are hardcoded from
measurements, so they are a record of what was done rather than something to re-run blindly).

**A rejected approach, do not redo it without asking.** The 4:5 conversion left large dead bands
because the card blocks stayed vertically centred. Stretching them to fill (`stretch.py`) looked
reasonable but was not what was asked for and knocked nine gems onto cards; it was reverted with
`unstretch.py`. If a future session wants that, raise it explicitly first and re-place the gems
against the new positions afterwards.

## Verification (do this after any edit)

Two failure modes have bitten repeatedly. Check both by pasting this into the browser console:

```js
// 1. does every slide still fit inside 1350, and 2. does anything overlap rendered text?
document.body.classList.remove('fit');
document.documentElement.style.setProperty('--s',1);
document.querySelectorAll('.slot').forEach(el=>{el.style.height='1350px';el.style.width='1080px';});
function lineRects(el){const r=document.createRange();r.selectNodeContents(el);return [...r.getClientRects()];}
const SOLID='.card,.w,.t,.ph,.cmp>div,.beats li,.sticker,.quote,.btn,.chip';
const out=[];
document.querySelectorAll('.s').forEach((s,i)=>{
  if(s.scrollHeight>1342) out.push('slide'+(i+1)+' OVERFLOWS: '+Math.round(s.scrollHeight));
  [...s.querySelectorAll('.gem,.sticker')].forEach(g=>{const a=g.getBoundingClientRect();
    [...s.querySelectorAll('p,h2,h3,h4,li,.tag,.foot span,'+SOLID)].forEach(o=>{
      const boxes=o.matches(SOLID)?[o.getBoundingClientRect()]:lineRects(o);
      boxes.forEach(b=>{const ox=Math.min(a.right,b.right)-Math.max(a.left,b.left),
                        oy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
        if(ox>4&&oy>4) out.push('slide'+(i+1)+' overlap on '+(o.className||o.tagName));});});});
});
console.log(out.length?out.join('\n'):'CLEAN');
```

Current state: **CLEAN**, all twelve slides at 1342px, 118 gems, zero collisions.

To find fresh gaps for gem placement, reuse that occupancy-grid idea: mark every `lineRects()`
box and every `SOLID` box with ~26px padding, then for each free cell grow the largest empty
square around it and keep the biggest few that do not overlap each other.

Measure against **rendered text line boxes**, not element bounding boxes. Paragraphs have wide
boxes with short final lines, so bounding-box overlap constantly reports false positives.

Bugs already fixed here, do not reintroduce:

- `.frame` must use `transform-origin: top left`. With `top center` the 1080px frame scales about
  its own centre and every slide shifts right and clips on any screen narrower than 1080.
- Display line-height must clear the `.hl` highlight box (currently `1.02`), or the box's padded
  bottom edge slices the descenders on the line below.
- CSS `content:"\10038"` parses as six hex digits (a Linear B ideogram) and renders tofu. The
  sparkle is `\2738`.
- The fit-scale calculation needs a lower clamp; a reported `innerWidth` of 0 produced a negative
  scale and flipped every slide inside out.
- `.phones` must keep `display:flex`. Without it the three handsets stack vertically and slide 06
  blows out to ~2000px tall. Easy to drop when rewriting the phone CSS block wholesale.

**Working in the Claude Code browser pane:** Betty can see it. It does *not* reload on
`navigate --force` unless the URL changes, so append a cache-busting query (`?r=2`, `?r=3`) to
get the real file. It also keeps any DOM you mutate from the console, and she reads those
leftovers as bugs in her file. Undo every console change (zooms, `display:none`, forced `--s`)
before ending a turn; `window.dispatchEvent(new Event('resize'))` hands layout back to the page.
When the pane and the file disagree, `grep` the file, it is the truth.

## Caption

> You know your Big 3. You know when your Saturn return hit. You're still waiting for January.
>
> MY SZN is the astrology-led membership where the reading stops being something you scroll and
> starts being something you live. Your whole chart read to the degree, your Human Design layered
> on top, and a portal that rewrites itself every time the season turns.
>
> Two live coaching workshops every szn. A community that actually knows your chart. Three ways
> in, from $33.
>
> Founding member pricing is open now. Link in bio.

## Open items

1. **The $33 Social tier cannot be bought.** `SOCIAL_CHECKOUT_URL` is still `undefined` in
   `app/src/app/membership/page.tsx`, and the Stripe product does not exist. Slide 10 sells it.
   Create the product and paste the payment link, or pull Social off the slide before posting.
2. **Gem licence** — see the caveat above.
3. **Numerology** — a stored memory says the numerology feature shipped in full, but there is no
   trace of it anywhere in `app/src`. The memory looks stale. Left out of the carousel.

## Source of truth for facts on the slides

- Tiers and inclusions: `app/src/app/membership/page.tsx` (pricing section + FAQ)
- Tier/price ID mapping: `app/src/lib/stripe-tiers.ts`
- Workshop titles, dates, times: `app/src/lib/workshops.ts`
- The 11 life areas: `app/src/lib/life-areas.ts`
- Feature names and blurbs: `app/src/app/page.tsx` (the `BENTO` array)
- Enrolment open/closed: `app/src/lib/enrolment.ts` (open by default)
