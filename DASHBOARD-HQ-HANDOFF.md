# Dashboard "Season HQ" redesign — handoff

Status as of 2026-08-16. The logged-in member dashboard (`/dashboard`) is being rebuilt from an
endless scroll into a scannable, editorial **"season HQ"**. This doc is the pickup point for the
next session.

## Design source of truth (the prototype)
A fully-designed static prototype was built and iterated with Betty as an Artifact:
- **URL:** https://claude.ai/code/artifact/04639026-be13-45c4-862c-e87de3354dbd
- **File:** `<scratchpad>/leo-szn-hq.html` (self-contained HTML; images inlined as data URIs). The
  scratchpad path is session-specific, so treat the Artifact URL as canonical. Match the live
  dashboard to this prototype.

## The design language (match this)
- **Light and bright.** Betty explicitly dislikes dark/black backgrounds and muddy gradients on the
  hero. Grounds alternate cream / white / pink / lav-light. Dark is used sparingly (community section
  only) as an accent, not a default.
- **Rounded** panels/cards (border-radius ~14–22px), **2px solid borders**, rotated **sticker
  badges**, script-style "the *leo szn* edit" lockups, horizontal **carousels with arrow buttons**,
  **accordions**. Inspired by a "HEY GIRL designs" reference Betty shared.
- **Brand palette only:** pink `#FF2D87`, black/ink `#1a1a1a`, lav `#C8B4F8` / lav-light `#E8DFFE` /
  deep purple `#3C2A70`, cream `#FFF8F0`, white. No off-palette green/red.
- **Type:** Poppins, heavy 800 weights, **lowercase** display headings (the app's `.display` is
  `text-transform: lowercase`), uppercase letter-spaced eyebrows.
- Voice: censored swears are on-brand ("this sh*t", "a f*cking reset"). No em dashes. No "it's not X
  it's Y" reframes. No rhetorical questions in marketing copy.

## Section order (live now on /dashboard)
ticker → **hero** → **today** → **cosmic weather** → **what do you need right now** (router) →
**for you right now** (goal + pattern + goal astrology) → **happening** (workshop carousel) →
**coaching** (+ live countdown) → season themes → replay highlight → life-areas guide →
HD × season → full season guide → meditation → **toolkit** → poll → **community** →
**season progress** → **vault** → customise.

## DONE (new design, wired to real data, shipped to main)
- **Hero** — `src/app/dashboard/page.tsx`. Light pastel card, per-season cut-out on the right via
  `heroImageForSign()` (Leo → `/leo-lion.png`; other signs fall back to the season symbol). Real
  season name/tagline/dates, theme pills, Big 3 (sun/moon/rising), eclipse ribbon.
- **Today** strip — real affirmation, tarot, and "one move" (from `szn.manifestationMission` /
  journal prompts).
- **Cosmic weather** — `src/components/SkyAlert.tsx` was rewritten from a long dark list into a
  compact **light horizontal rail** (SAME live `/api/calendar` data). Betty specifically rejected the
  old "too long, black and boring" version.
- **What do you need right now** router, **For you** block (real `primaryGoal`, `pattern` from
  `detectAvoidance`, `goalReading` from `composeLifeArea`).
- **Workshop carousel** — real `WORKSHOPS` data via `upcomingWorkshops()`/`pastWorkshops()`, with
  **cover images** on the two Leo workshops (see below). Arrow buttons scroll `trackRef`.
- **Coaching band** — live countdown to the next dated workshop (`countdownTo`, ticked by a 1s
  interval → `nowMs`).
- **Toolkit**, **Community** room pills, **poll** ("a question from Betty"), **season progress**
  (week X of N derived from `season.startMonth/startDay/endMonth/endDay`), **vault** cards.

## Images (in `app/public/`)
- `leo-lion.png` — pink crowned lion, transparent PNG, hero cut-out for Leo.
- `leo-workshop-cover.png` — "Enter Your Main Character Era" workshop cover.
- `visible-af-cover.png` — "Visible AF" workshop cover.
- Workshops carry an optional `coverImage` field (`src/lib/workshops.ts`); set on the two Leo
  workshops. Each future season needs its own hero + workshop art (Betty supplies art).

## STILL TO DO (reused components, old styling — restyle to match the prototype)
These are still the original components dropped in as-is; they work with real data but look like the
old dashboard and need rebuilding in the new pastel/rounded language:
- `SeasonThemes` (the four themes)
- `LifeAreasGuide` → the prototype turns this into a **life-areas accordion** ("love + relationships",
  "money + career", "confidence + visibility", "creativity + pleasure"), each row expands to a short
  line + "read the full area →". Data via `composeLifeArea` per area.
- `SeasonDesignInline` (Human Design × season)
- `SeasonPersonalised` (full season guide; anchor `#season-guide` links here from the router)
- `SeasonMeditation`
Also pending: per-season hero art for non-Leo signs; "season progress" copy for now/next/revisit.

## Data available in `src/app/dashboard/page.tsx`
`member` (placements.sun/moon/rising, name, email), `szn` (`useYourSzn`: theme, transits.moonPhase,
journalPrompts, manifestationMission), `chart` (`useChart`), `season` (`useSeason`: sign, symbol,
tagline, focus, themes[], affirmation, description, start/end month+day), `streak`, `primaryGoal`,
`pattern`, `goalReading`, `tarot`, `challengeStreak`, `signOverview`, `rising`, `activePoll`.

## Working agreement with Betty (IMPORTANT)
- She reviews the member dashboard **logged in on the live site** (it's gated; Claude can't render it).
  There is NO `-preview` URL — she rejected that; the redesign lives directly on `/dashboard`.
- Do **not** make big structural/product decisions or push risky changes to the live member page
  without checking with her first. Building the agreed design and shipping each finished section is
  fine; inventing new structure or rolling things back is not.
- Deploy = push to `main` (`github.com/betty-myszn/szn-app`) → Railway builds itsmyszn.com. Run
  `npm run build` before pushing member-facing changes.

## Verify before pushing
`npx tsc --noEmit` and `npm run build` (both currently clean). One pre-existing eslint note
(`react-hooks/set-state-in-effect` on the mount effect) is non-blocking and predates this work.
