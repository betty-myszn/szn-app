# MY SZN Ecosystem Restructure: Phase 1 + 2 (for review)

Status key: Not Started / In Progress / Ready for Review / Complete
Nothing has been changed in the codebase yet. This document is the only output so far.

## Progress checklist

| Phase | Deliverable | Status |
|---|---|---|
| 1 | Existing website audit | Ready for Review |
| 1 | Reusable content + component inventory | Ready for Review |
| 1 | Functionality that must be preserved | Ready for Review |
| 1 | Proposed sitemap + navigation | Ready for Review |
| 1 | Technical risks + dependencies | Ready for Review |
| 2 | Homepage to Mastermind migration map | Ready for Review |
| 2 | New homepage section structure | Ready for Review |
| 2 | Page outlines + CTAs (all 7) | Ready for Review |
| 2 | Copy recommendations + b*tch rule | Ready for Review |
| 3 | Waitlist architecture | Ready for Review (built: /api/waitlist, waitlist_signups table SQL, /admin/waitlists + CSV) |
| 4 | All pages, nav, footer, SEO, redirects | Ready for Review (local only, not pushed) |
| 5 | QA | In Progress: typecheck, lint, 433 tests pass, all routes 200/307, mobile no overflow; end-to-end signup blocked on the Supabase table |
| 6 | Handover + deploy | Not Started |

---

## PHASE 1: Audit

### 1.1 What's there now

- **Stack:** Next.js app in `app/`, Supabase (auth + database), Stripe (payments), Brevo (marketing lists + welcome emails), Resend (Supabase auth emails only), n8n webhook on the waitlist, hosted on Railway auto-deploying from `main`.
- **Homepage `/`** (`src/app/page.tsx`): entirely a sales page for the current MY SZN 90-day chapter. Sections in order:
  1. Hero (headline, door CTA, collage)
  2. Ticker
  3. Lock-In Season block (the chapter on sale, three stages, the doors with dates and prices)
  4. `CoachingBand`
  5. `ThreeMonthsFromNow`
  6. `QuoteStrip` (zara, georgia, hannah)
  7. `ValueStack` (what's included)
  8. `WhoThisIsFor`
  9. `MeetBetty`
  10. `Manifesto`
  11. `QuoteStrip` (jade, lauren, maya, lav)
  12. `HomeFaq`
  13. Final CTA band with the planet
  14. Sticky mobile door bar
- **Other public routes in play:** `/membership` (current apply/join page, live Stripe doors), `/podcast` (full podcast page with Spotify/Apple links), `/money-blueprint` ($45 report, sales page + Stripe LIVE), `/chart` + `/human-design-chart` (free generators), `/seasons`, `/events`, `/blog`, `/irl-host`, `/shop-your-sign`, `/waitlist` (currently redirects to `/membership`).
- **Logged-in routes:** `/home` is the FREE MEMBER's home (not a marketing page), `/dashboard`, `/your-season/*`, `/my-chart/*`, `/community`, `/messages`, etc. All gated in `src/proxy.ts`.
- **Navigation** (`src/components/NavBar.tsx`): separate link sets for logged-out visitors, free members and paid members. Logged-out set today: home, apply for my szn, free birth chart, seasons, workshops, podcast, blog, become a host.
- **Waitlist plumbing that already exists:** `POST /api/subscribe` upserts the contact into Brevo with a `SIGNUP_SOURCE` attribute, and `src/lib/subscribe-lists.ts` maps each source to a Brevo list ID (allowlist, unknown sources are never filed on the waitlist). There's also a Supabase-backed applications table + admin page for IRL hosts (`/admin/irl-hosts`) which is the pattern to copy for admin visibility.
- **The b*tch audit:** I searched all of `src/` for the uncensored word. **Zero instances in the website code today.** It does appear uncensored in internal file names only (`bad-b-report/` folder, not customer-facing). I'll re-run this check across emails and metadata in Phase 5.

### 1.2 Reusable inventory

Components that carry straight over: `Ticker`, `QuoteStrip`, `MeetBetty`, `Manifesto`, `WhoThisIsFor`, `ThreeMonthsFromNow`, `ValueStack`, `CoachingBand`, `HomeFaq`, `DoorButton`, `Stickers`, `DiscoPlanet`, `UpcomingEvents`, the display type + `--border`, pink/black/lav/white tokens, and the existing hero collage + planet imagery.

New reusable components I'd build once and use on every offer page:
- `OfferHero` (emoji + name + one-line promise + CTA, takes a tone: pink / black / lav)
- `WaitlistForm` (name, email, one optional question, posts to `/api/subscribe` with the offer's source, inline confirmation)
- `OfferCard` (for the homepage ecosystem grid + Reports page)
- `WhatItIs` / `WhoItsFor` blocks (simple, copy-driven)

### 1.3 Must be preserved (and will be)

- Stripe door checkout for the current chapter, `ChapterJoin`, `DoorButton`, `/membership` and every price shown there
- Login, signup, account creation, password flows, all gating in `src/proxy.ts`
- `/home` as the free member's home (it does NOT become a marketing page)
- `/money-blueprint` live product + its Brevo list 14
- Podcast page content and links
- Analytics (`Analytics.tsx`), cookie consent, service worker / PWA, sitemap, every existing Brevo list
- Owner account (hello@thecosmicco.com) access untouched

### 1.4 Proposed sitemap + nav

```
/                       NEW brand homepage (the MY SZN universe)
/reports                NEW overview of both reports
  /reports/rich-btch-rising   NEW  (URL can't hold an asterisk, see risk 4)
  /reports/bad-btch-report    NEW
/baddie-coven           NEW
/mastermind             NEW (today's homepage content moves here)
/retreat                NEW
/podcast                EXISTING, light touch
/book                   NEW coming-soon page
/membership             EXISTING, kept working (see decision A)
/money-blueprint        EXISTING, untouched (see decision B)
```

Logged-out nav: **Home | Reports | Baddie Coven | Mastermind | Retreat | Podcast | Book**, with login on the right as now. Free birth chart, seasons, workshops, blog and become a host move into the footer + mobile menu so nothing is orphaned. Member navs stay as they are, plus one "explore my szn" link back to the public pages.

### 1.5 Risks + dependencies

1. **Ad, email and Instagram links all point at `/`** to sell the chapter. Once `/` becomes the brand homepage, those visitors land one click further from the door. Fix: a clear Mastermind section high on the new homepage, and I'll check live campaign links in Brevo before deploy.
2. **SEO:** `/` currently ranks for the membership. Metadata moves with the content to `/mastermind`; the homepage gets new brand-level metadata.
3. **`/waitlist`** already redirects to `/membership`; I'll leave it.
4. **Asterisks in URLs** are technically allowed but break when shared on Instagram, WhatsApp and email clients. Recommend slugs `rich-btch-rising` and `bad-btch-report` (the URL never displays the word in full, and visible copy always shows the asterisk).
5. **Brevo lists:** each new waitlist needs its own list created in Brevo (5 lists). Until you create them, signups are still saved and tagged, see Phase 3.
6. **No git branch preview on Railway** is set up; I'll build and test locally (`npm run dev`) and only push to `main` after your sign-off.

---

## PHASE 2: Content mapping + page plans

### 2.1 Migration map: today's homepage to `/mastermind`

| Today's homepage section | Goes to |
|---|---|
| Hero (copy + door CTA + collage) | **Mastermind**, hero copy kept; collage image reused on new homepage too |
| Ticker | Both (different items on each) |
| Lock-In Season block + doors | **Mastermind** only |
| CoachingBand | **Mastermind** |
| ThreeMonthsFromNow | **Mastermind** |
| QuoteStrip (zara, georgia, hannah) | **Mastermind** |
| ValueStack | **Mastermind** |
| WhoThisIsFor | **Mastermind** |
| MeetBetty | **Homepage** (it's the brand's founder) + short version on Mastermind |
| Manifesto | **Homepage** (it's the brand's beliefs) |
| QuoteStrip (jade, lauren, maya) | **Homepage** |
| HomeFaq | **Mastermind** (its questions are about the chapter) |
| Final CTA band + planet | **Mastermind**; homepage gets its own closing band in the same style |
| Sticky mobile door bar | **Mastermind** only |

Practically: I move `page.tsx` to `mastermind/page.tsx` almost verbatim, so the copy you approved stays word for word, then build the new homepage around it.

### 2.2 New homepage sections

1. **Hero:** MY SZN as a whole universe for women creating extraordinary lives (confident, wealthy, creative, empowered, unapologetic), collage kept, two CTAs: "explore my szn" (scrolls) + "join the mastermind".
2. **Ticker:** the seven offers scrolling.
3. **The universe grid:** seven `OfferCard`s, one per offer, each with emoji, name, one line, link.
4. **Mastermind feature band** (the premium offer gets the biggest spotlight so the ad traffic still finds the door).
5. **Reports band:** Rich B*tch Rising + The Bad B*tch Report side by side.
6. **Baddie Coven band** (clubhouse feel, lav).
7. **Retreat band** (black, editorial).
8. **Podcast + Book** paired band.
9. **Manifesto.**
10. **MeetBetty.**
11. **QuoteStrip.**
12. **Free birth chart** strip (keeps the free lead magnet on the homepage).
13. **Closing band:** "pick your door" with the seven links.

### 2.3 Page outlines + CTAs

Every upcoming offer uses the same skeleton: `OfferHero` > what it is > what we explore > who it's for > what we know so far (only confirmed facts, no invented dates, prices or locations; where unknown it says "dates + details go to the waitlist first") > `WaitlistForm` > link to two sibling offers.

| Page | Angle | CTA |
|---|---|---|
| 💸 **Rich B*tch Rising** | your chart's money story: wealth, earning potential, money blocks, financial independence, self-worth | join the waitlist |
| 💜 **The Bad B*tch Report** | confidence, personal power, visibility, self-expression, boundaries, the most unapologetic you | join the waitlist |
| 🦄 **The Baddie Coven** | monthly creative classes, astrology, manifestation, rituals, witchcraft, community; the magical creative clubhouse | join the waitlist |
| 🪐 **Mastermind** | today's homepage, intact, framed as the premium 90-day experience (astrology, Human Design, self-concept, manifestation, shadow work, group coaching, accountability) | see decision A |
| 🌴 **The Bad B*tch Retreat** | in person: body, sensuality, creativity, confidence, sexuality, shadow, power, self-love via astrology, embodiment, movement, ritual, sisterhood | join the waitlist |
| 🎙️ **MY SZN Podcast** | existing page kept; add the ecosystem nav + a "where to next" strip | listen (existing) |
| 📚 **MY SZN Book** | coming soon: becoming your future self through astrology, manifestation, self-concept, confidence, healing, money, your dream life | register your interest |
| **Reports overview** | both reports as two big cards | each card to its page |

### 2.4 Copy approach

**Voice guidelines (13 Oct 2026):** your most outrageous, hilarious, empowering girlfriend who knows everything about astrology, manifestation, money and becoming HER. Unhinged + sassy, feminist AF throughout (taking up space, making her own money, decentering men, rejecting good-girl conditioning), baddie-coded, witchy, meaningful underneath the humour. Elongated words (OMGGGG, SOOOO, YESSSS, OBSESSED) used naturally, not in every line. Longer flowing sentences with varied openings, no paragraphs starting the same way. Emojis used intentionally: 💜🪩🦄💸💖🪐🛸✨. Applies to every page, waitlist form, confirmation and email.

- Existing homepage copy moves word for word. New copy is written in the baddie-coded bestie voice (elongated words, caps), "baddies" in body copy, greetings "Hiii my love" in emails.
- House rules I'll hold on every new line: no em dashes, no "and honestly?", no rhetorical questions, no "it's not X, it's Y", no "No fluff. Just X.", no "quietly", no sentences starting with "And", no member counts, all money in $, no invented facts.
- **b*tch rule:** product names live in ONE constants file (`src/lib/offers.ts`) so "Rich B*tch Rising", "The Bad B*tch Report" and "The Bad B*tch Retreat" are typed once and reused everywhere (nav, titles, SEO, buttons, emails). I'll also add a Jest test that fails the build if the uncensored word appears anywhere in `src/` or the email templates.

---

## PHASE 3 preview: waitlist architecture

- One form component, one endpoint (the existing `/api/subscribe`), one new `source` per offer: `waitlist-rich-btch-rising`, `waitlist-bad-btch-report`, `waitlist-baddie-coven`, `waitlist-retreat`, `waitlist-book`.
- **Brevo:** each source maps to its own list (env override + canonical ID, same pattern as Money Blueprint). `SIGNUP_SOURCE` is set on every contact, plus a new `WAITLIST_INTERESTS` attribute that accumulates (someone who joins three waitlists carries all three).
- **Supabase:** new `waitlist_signups` table (email, name, offer, created_at, unique on email + offer) as our own record, independent of Brevo.
- **Duplicates:** same email on the same waitlist returns the same happy confirmation and doesn't create a second row.
- **Admin:** `/admin/waitlists` (is_admin only, same pattern as `/admin/irl-hosts`) with a tab per offer, counts, search and **Export CSV** per offer or all.
- **Confirmation:** inline success message on the page, plus a Brevo confirmation email per list (I'll write the copy; you'd attach it to the list automation in Brevo).
- **n8n:** these new sources do NOT trigger the old membership n8n workflow.

---

## Decisions (answered 13 Oct 2026)

- **A. Mastermind:** waitlist only for now, no checkout. Price is **$1,500 per 90-day cohort ($500 a month x 3)** (the $250 / 3x$88 door pricing belongs to the membership, not the Mastermind).
- **B. Rich B*tch Rising = Money Blueprint**, rebranded. Price moving to around $88 (not final).
- **C. Mastermind is a separate offer from the membership. The membership becomes The Baddie Coven.**
- **D. Betty creates the Brevo lists** and sends back the IDs:
  - MY SZN Mastermind waitlist
  - Rich B*tch Rising waitlist
  - The Bad B*tch Report waitlist
  - The Baddie Coven waitlist
  - The Bad B*tch Retreat waitlist
  - MY SZN Book interest

### Knock-on change to the migration map
Today's homepage sells the MEMBERSHIP chapter (doors, $250 / 3x$88, monthly 1:1, live workshops, community). Since the membership becomes the Baddie Coven, the chapter-specific parts (Lock-In Season block, doors, ValueStack, HomeFaq, sticky door bar) belong with the **Coven**, and `/membership` redirects to `/baddie-coven`. The Mastermind page reuses the transformation messaging (hero copy, ThreeMonthsFromNow, WhoThisIsFor, CoachingBand, quotes) with the $1,500 per 90-day cohort price and a waitlist form.

### Still open
- ~~Coven: live or waitlist?~~ **Answered: waitlist only.** No paying members (all cancelled + refunded). The door checkout is removed from the public pages; the Stripe products, code and member accounts are left in place, not deleted.
- ~~Money Blueprint?~~ **Answered: Rich B*tch Rising is $88 and WAITLIST ONLY for now, same as The Bad B*tch Report.** No checkout on either report page. The $45 Payment Link is left untouched in Stripe, just no longer linked. `/money-blueprint` redirects to `/reports/rich-btch-rising`.

**All decisions answered. Every offer is waitlist only. Ready to start Phase 4 on Betty's go.**
