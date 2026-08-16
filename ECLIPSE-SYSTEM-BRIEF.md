# Eclipse SZN: baddie-coded + actually personalised

Betty's brief, 16 Aug 2026, plus a technical audit of what already exists. Not built yet.

## The ask, in her words

> I want this to feel like: your astrologer bestie just looked at your chart and has NEWS. Smart
> astrology underneath it, but conversational, juicy, emotionally intelligent and very easy to
> understand. Less astrology report. More: **BABE. THIS ONE IS HITTING YOUR RELATIONSHIP HOUSE.**
> Then explain why that matters.
>
> The member should feel like we're talking directly to HER chart, rather than reading a generic
> eclipse article where `{house}` has been inserted into a template.
>
> I want two members opening the SAME eclipse and immediately seeing different interpretations
> because their charts tell completely different stories.

**The formula:** SKY + SIGN + NODES + HER CHART + REAL LIFE = MY SZN.

**Build it as a reusable system, not a Leo eclipse page.** Every future eclipse pulls the same
pipeline. Nothing hardcoded to this eclipse or to a 7th-house example.

## The two layers, every eclipse

**01 · THE COLLECTIVE TEA** (same for everyone): eclipse type, sign, what that sign represents,
overall energy, which node is involved, the larger nodal story, what the collective is moving
through, and what makes THIS eclipse different from another one.

**02 · YOUR PERSONAL TEA** (generated from her chart): which natal house the eclipse lands in,
the opposite house completing the axis, whether it closely conjuncts a natal planet or angle,
which natal planets it aspects, the condition of the eclipse sign's ruler in her chart, any other
relevant placements, what that could look like in real life, and what she is being asked to
notice, release, choose or embody.

> Do not simply inject the house number into generic copy. **The interpretation itself needs to
> CHANGE.**

## Page shape

1. `SOLAR ECLIPSE IN LEO` + exact date
2. **Baddie energy headline**, e.g. "THE UNIVERSE JUST TURNED THE LIGHTS OFF ON THE OLD VERSION."
3. **MEET [SIGN]** — a proper primer, because members should learn astrology while using it.
   Ruler, element, modality, what it wants at its best, where the shadow gets interesting.
4. **THE ECLIPSE TEA / why this one hits different** — eclipse mechanics without sounding like
   Wikipedia, plus which node end it falls on and what that means.
5. **THE COLLECTIVE TEA** — everyone's assignment.
6. Transition: **"OKAY BABE. NOW LET'S LOOK AT YOUR CHART."** Everything below is personalised.
7. **Personal headline, varies by house.** Betty supplied all twelve, with room for multiple
   variants per house so it doesn't repeat across eclipses:
   1st "BABE. YOU'RE THE PLOT TWIST." · 2nd "YOUR MONEY + SELF-WORTH ERA IS SHIFTING." ·
   3rd "YOUR VOICE IS ABOUT TO MATTER MORE." · 4th "HOME IS GETTING REWRITTEN." ·
   5th "YOUR MAIN CHARACTER ENERGY IS BACK." · 6th "YOUR DAILY LIFE CAN'T KEEP RUNNING LIKE THIS." ·
   7th "YOUR RELATIONSHIPS ARE ENTERING A NEW ERA." · 8th "WE'RE GOING DEEP, BABE." ·
   9th "YOUR WORLD IS GETTING BIGGER." · 10th "YOUR PUBLIC ERA IS CHANGING." ·
   11th "YOUR PEOPLE + YOUR BIG DREAMS ARE SHIFTING." · 12th "SOMETHING IS ENDING BEHIND THE SCENES."
8. **HER ECLIPSE EQUATION**, visual: `SOLAR ECLIPSE (new chapter + acceleration)` + `LEO SOUTH NODE
   (visibility + desire + releasing old validation)` + `YOUR 7TH HOUSE (love + partnership)` =
   a synthesis line generated per member.
9. **Planet contacts get their own moment.** If the eclipse closely contacts a natal planet or
   angle: "OKAYYYYY, THIS JUST GOT PERSONAL. The eclipse is sitting right on your natal Venus."
   Then interpret the *combination*, never "Venus represents love and money".
10. **WHAT COULD ACTUALLY HAPPEN** — possibilities from house + planet contacts. Phrased as
    possibilities, **never guaranteed predictions**.
11. **WHAT TO WATCH NOW** — must switch on today's date: before ("watch what's beginning to
    move"), during ("you're inside the eclipse window"), after ("look at what has already
    changed. Check the receipts."). No static future-facing copy left on the page.
12. **BETTY'S TAKE** in her voice, personalised to the activated house.
13. **YOUR ECLIPSE RECEIPTS** — journal prompts generated from her house and aspects, not the same
    four for everyone. Ends with `SAVE MY ECLIPSE RECEIPTS →`.

## What already exists

`src/lib/eclipse-content.ts` → `composeEclipse(event, chart)` returns a `LunationReading`. It
already derives:

- eclipse house, the north and south node signs, their houses, and the far end of the axis
- sign traits, house meanings and life areas for each end
- a nodal framing paragraph and a date label

`LunationReading` (in `moon-content.ts`) already has slots this brief needs: `primerTitle` +
`primer` (for MEET [SIGN]), `chartParagraphs`, `bringsUp`, `lookOutFor`, `shadow`, `bettysTake`,
`exercise`. So the page contract mostly exists; the composer is what needs deepening.

## What is missing

1. **Natal contacts.** No conjunction or aspect detection between the eclipse degree and natal
   planets, and no ASC/DSC/MC/IC contact check. This is the "sitting right on your natal Venus"
   moment and it is the single biggest lift in perceived personalisation.
2. **Eclipse ruler condition.** The ruler of the eclipse sign, by sign, house and aspect, is not
   read at all.
3. **Date-phase awareness.** Nothing switches the copy on before / during / after.
4. **Per-house headline bank** and multiple variants.
5. **The equation block** as a visual component.
6. **Personalised journal prompts.** Currently generic per event type.
7. **Voice.** The existing copy is the "polished astrologer" register Betty is rejecting.

## ~~Bug to fix first~~ FIXED 16 Aug 2026 (commit a708d18)

`houseForLongitude(longitude, cusps)` and `longitudeForSignDegree(sign, degree)` now exist in
`interpretations.ts`. The eclipse, both ends of its nodal axis, every lunation, and the "for you"
line on the cosmic weather rail all place by real degree. Season placement still uses the
midpoint, which is correct there. Regression covered in `__tests__/house-for-longitude.test.ts`.

**Use `houseForLongitude` for anything dated in the new eclipse work.** The original problem is
described below, kept because it explains why the two functions exist.

## The bug, for context

`houseForSign(sign, cusps)` in `src/lib/interpretations.ts:10` places an event by the **midpoint
of its sign**, hardcoded as `idx * 30 + 15`. It ignores the actual degree.

`composeEclipse` calls it as `houseForSign(eclipseSign, cusps)`, so an eclipse at 2° Leo and one
at 27° Leo are both placed as though they were at 15° Leo. For any member whose house cusp falls
mid-sign, which is most charts on Placidus, **the eclipse can be reported in the wrong house**.
The same applies to every lunation placed this way.

The calendar payload already carries `degree` (it is in the `/your-season/moon` query string and
rendered as "in pisces (4°)"), so the fix is a degree-aware sibling:

```ts
export function houseForLongitude(longitude: number, cusps: number[]): number
```

and passing `idx * 30 + event.degree` instead of the midpoint. Small change, and it has to land
before any of the personalisation work, because every layer above is derived from the house.

## Guardrails

- Voice rules apply: no em dashes, no rhetorical questions in marketing copy, no "it's not X it's
  Y", no "nothing generic". Censored swears are on-brand.
- Possibilities, never predictions.
- Do not dump the technical data on screen. It runs under the hood to make the reading better.
- Two members on the same eclipse must get visibly different readings. That is the acceptance test.
