import type { ChartData, TransitData, ActivatedPlacement, PlanetPosition } from "@/types/chart";
import type { SeasonInfo } from "@/lib/seasons";
import { SIGN_TRAITS, SIGN_OVERVIEWS, HOUSE_MEANINGS, ordinalHouse, findRootBlock, getBodyMeaning, interpretAspect, composeRulerPlacement, rulerRef, composeHouseChain, composePlanetLayer, composePointLayer, type RulerPlacement, type SignTraits, type HouseChain, type PlanetLayer, type PointLayer } from "@/lib/interpretations";
import { LIFE_AREA_TO_GOAL_CATEGORY, type Goal } from "@/lib/goals-store";

// The astrological "recipe" for each life area: which houses, planets and chart points actually
// describe this topic, in priority order (first house = the one the season is read as activating,
// first planet = the coaching body). This is where each page stops being "the same template with
// different house numbers" and gets its own composition, Career reads three houses plus Saturn and
// Mercury, Relationships reads two houses plus Venus and Mars, Home reads a single house plus the
// Moon. Every factor listed here is interpreted completely downstream, never named in passing.
export interface AreaRecipe {
  houses: number[]; // priority order, first is primary
  planets: string[]; // planet ids interpreted as full layers, first is the coaching body
  points?: string[]; // node ids, interpreted via composePointLayer
  useAscendant?: boolean; // whether the rising sign + its ruler are part of this area's story
  axisLabel: string; // e.g. "money axis", "career framework"
  axisFraming: string; // the polarity/relationship the primary houses jointly represent
  axisPrompts: string[]; // reflective observations, stated not asked, in the member's own terms
}

export const AREA_RECIPES: Record<string, AreaRecipe> = {
  mindset: {
    houses: [3, 9],
    planets: ["mercury", "jupiter"],
    axisLabel: "mindset axis",
    axisFraming: "the gap between the mind you run day to day, how you actually think, talk and process, and the larger belief system underneath it, what you hold to be true about the world and your place in it",
    axisPrompts: [
      "notice whether your daily self-talk has actually caught up with what you say you believe, or whether the two are quietly running on different tracks.",
      "watch for a worldview that sounds expansive out loud but keeps getting contradicted by the smaller, faster mental loop underneath it.",
    ],
  },
  confidence: {
    houses: [1, 5],
    planets: ["sun"],
    useAscendant: true,
    axisLabel: "confidence axis",
    axisFraming: "the gap between how you arrive and are perceived, your presence and self-image, and how freely you actually let yourself create, play and be visibly, riskily seen",
    axisPrompts: [
      "notice whether your outward composure is quietly doing the work that real creative or romantic risk-taking is avoiding.",
      "watch for confidence that holds up in how you present yourself but thins out the moment something asks you to actually perform, create or be chosen.",
    ],
  },
  // Absorbs what used to be a separate "business" area. The 11th is folded in so the audience and
  // network side is genuinely covered rather than dropped when the two areas merged.
  career: {
    houses: [10, 6, 2, 11],
    planets: ["saturn", "mercury"],
    axisLabel: "career & business framework",
    axisFraming: "the relationship between your public reputation and vocation, the daily work and service that actually sustains it, what you earn through it, and the audience and network you build it with",
    axisPrompts: [
      "notice whether your ambition for how you're seen professionally is being backed by the unglamorous daily systems that would actually hold it up.",
      "watch for a gap between the reputation you're building and what you're actually paid for it, the 10th and the 2nd not always agreeing.",
      "check whether the audience is growing faster than what you actually convert from it, the 11th outrunning the 2nd.",
    ],
  },
  purpose: {
    houses: [9, 10],
    planets: ["jupiter", "sun"],
    points: ["north_node"],
    axisLabel: "purpose framework",
    axisFraming: "the relationship between the meaning and worldview you're expanding into, the public contribution you're building toward, and the growth direction your North Node is pulling you along",
    axisPrompts: [
      "notice whether the purpose you can articulate matches the direction your North Node is actually pulling you, or whether you keep defaulting to what's already easy.",
      "watch for a calling that lives in your head as philosophy but hasn't yet been built into anything public or real.",
    ],
  },
  money: {
    houses: [2, 8],
    planets: ["jupiter", "venus"],
    axisLabel: "money axis",
    axisFraming: "what you build through your own effort versus what moves through you because of other people, debt, investment or merged resources",
    axisPrompts: [
      "notice whether you try to create security entirely through your own effort while quietly struggling to actually receive support.",
      "watch for how much your self-worth decides your comfort charging, borrowing, investing or letting someone else contribute.",
      "pay attention to how trust, control and power show up the moment money involves another person, not just you.",
    ],
  },
  "style-fashion": {
    houses: [1, 5],
    planets: ["venus"],
    useAscendant: true,
    axisLabel: "style axis",
    axisFraming: "the relationship between the visual identity you arrive in, your rising sign and default presentation, and the more expressive, playful, creative edge you reach for when you let yourself",
    axisPrompts: [
      "notice whether your everyday look is doing safer work than the more expressive version of you actually wants to wear.",
      "watch for a gap between the image you maintain and the bolder self-expression you keep saving for a someday that never quite arrives.",
    ],
  },
  relationships: {
    houses: [7, 5],
    planets: ["venus", "mars"],
    axisLabel: "relationships axis",
    axisFraming: "the relationship between committed one-to-one partnership and the earlier, freer territory of dating, romance, chemistry and play, and between how you attract (Venus) and how you pursue (Mars)",
    axisPrompts: [
      "notice whether commitment is genuinely where you feel safest, or whether romance and play come more naturally and real partnership is something you're still learning to trust.",
      "watch for the split between how you attract people and how you actually pursue what you want, Venus and Mars not always wanting the same thing.",
    ],
  },
  "health-body": {
    houses: [6, 1, 12],
    planets: ["mars", "moon"],
    useAscendant: true,
    axisLabel: "health framework",
    axisFraming: "the relationship between your daily habits and maintenance, the body and vitality you actually live in, and the rest, recovery and hidden depletion that happens out of sight",
    axisPrompts: [
      "notice whether your daily habits genuinely serve the body you live in, or run on autopilot separate from how you actually feel.",
      "watch for hidden depletion, the 12th-house pattern of running on empty in private until the body forces the rest on its own terms.",
    ],
  },
  "home-environment": {
    houses: [4, 10],
    planets: ["moon"],
    axisLabel: "home axis",
    axisFraming: "the relationship between your private roots, home and emotional security and your public life and direction, the 4th and 10th as the two ends of the same vertical axis",
    axisPrompts: [
      "notice whether your home actually restores you for your public life, or whether one is quietly being sacrificed for the other.",
      "watch for how much your sense of private security rises or falls with what's happening in your public world, and vice versa.",
    ],
  },
  "spiritual-growth": {
    houses: [12, 9],
    planets: ["neptune", "jupiter"],
    points: ["north_node"],
    axisLabel: "spiritual growth axis",
    axisFraming: "the relationship between the unseen, intuitive, dissolving 12th-house territory and the meaning-making, faith and higher-wisdom of the 9th, the mystical and the philosophical as two routes to the same source",
    axisPrompts: [
      "notice whether your conscious beliefs have actually caught up with what you already sense intuitively but can't quite explain.",
      "watch for the gap between the philosophy you'd articulate out loud and the quieter, harder-to-name knowing that keeps surfacing underneath it.",
    ],
  },
  healing: {
    houses: [8, 12],
    planets: ["chiron", "pluto"],
    points: ["south_node"],
    axisLabel: "healing axis",
    axisFraming: "the relationship between the deep, intimate, power-and-transformation territory of the 8th and the hidden, inherited, unconscious material of the 12th, where the wound lives and what actually happens to it once real intimacy or real stakes bring it up",
    axisPrompts: [
      "notice whether you keep this wound private and manageable until real intimacy or a power dynamic forces it into the open.",
      "watch for a pattern where you can name the wound calmly on your own but it behaves completely differently once another person, or real stakes, are involved.",
    ],
  },
};

export interface LifeAreaMeta {
  id: string;
  label: string;
  emoji: string;
  bodyId: string; // which placement this area reads through
  houseNumbers: number[]; // which houses are most relevant, used to find the chart tie-in
}

// bodyId and houseNumbers are kept in sync with AREA_RECIPES below: bodyId is the recipe's
// coaching body (the planet the voice-driven coaching sections read through), houseNumbers mirror
// the recipe's houses so consumers like SeasonPersonalised still resolve the right primary house.
// Business was a separate life area until it became clear it was reading as a near-duplicate of
// career: same 10th house, same 2nd house, same advice in slightly different words. They are now
// one area, "career & business", and the 11th house (audience, network, the people your work
// reaches) is folded into the recipe so the business side is still genuinely covered.
//
// The alias keeps every old link, saved goal and bookmark resolving rather than 404ing.
export const AREA_ALIASES: Record<string, string> = { business: "career" };

export function resolveAreaId(areaId: string): string {
  return AREA_ALIASES[areaId] ?? areaId;
}

export const LIFE_AREAS: LifeAreaMeta[] = [
  { id: "mindset", label: "mindset", emoji: "\u{1F9E0}", bodyId: "mercury", houseNumbers: [3, 9] },
  { id: "confidence", label: "confidence", emoji: "✨", bodyId: "sun", houseNumbers: [1, 5] },
  { id: "career", label: "career & business", emoji: "\u{1F4BC}", bodyId: "saturn", houseNumbers: [10, 6, 2, 11] },
  { id: "purpose", label: "purpose", emoji: "\u{1F9ED}", bodyId: "north_node", houseNumbers: [9, 10] },
  { id: "money", label: "money", emoji: "\u{1F4B0}", bodyId: "jupiter", houseNumbers: [2, 8] },
  { id: "style-fashion", label: "style & fashion", emoji: "♀", bodyId: "venus", houseNumbers: [1, 5] },
  { id: "relationships", label: "relationships & love", emoji: "❤", bodyId: "venus", houseNumbers: [7, 5] },
  { id: "health-body", label: "health & body", emoji: "\u{1F343}", bodyId: "mars", houseNumbers: [6, 1, 12] },
  { id: "home-environment", label: "home & environment", emoji: "\u{1F3E1}", bodyId: "moon", houseNumbers: [4, 10] },
  { id: "spiritual-growth", label: "spiritual growth", emoji: "\u{1F31A}", bodyId: "jupiter", houseNumbers: [12, 9] },
  { id: "healing", label: "healing", emoji: "\u{1FA79}", bodyId: "chiron", houseNumbers: [8, 12] },
];

interface AreaContent {
  bettysTake: string;
  rootFrame: (blockTheme: string) => string;
  shiftBefore: string;
  shiftAfter: string;
  protocolTitle: string;
  protocolDays: string[]; // 5 days, escalating
  stretchMoves: string[];
  proofMarkers: string[];
}

const AREA_CONTENT: Record<string, AreaContent> = {
  mindset: {
    bettysTake: "I see this pattern constantly. Women think they need to fix their mindset before they take the action. Backwards. Your mindset shifts because of the evidence the action creates, not before it. Stop waiting to feel differently, act differently and the feeling catches up.",
    rootFrame: (b) => `The mental loop that's actually running the show is ${b} Until that gets named, no amount of positive thinking sticks, because you're trying to out-affirm a pattern instead of dismantling it.`,
    shiftBefore: "I need to feel ready before I move.",
    shiftAfter: "Readiness is a feeling I build by moving, not a condition I wait for.",
    protocolTitle: "the 5-day belief rewire",
    protocolDays: [
      "name the exact sentence your inner critic uses most often, write it word for word, seeing it on paper strips half its power",
      "write the opposite belief and read it out loud five times, notice the resistance, that resistance is the old pattern losing its grip",
      "catch the loop in real time once today, the moment you hear it, say \"noted\" and do the next right thing anyway",
      "do one thing today purely because old-you would have talked new-you out of it",
      "write down three pieces of proof from this week that the new belief is already becoming true, however small",
    ],
    stretchMoves: [
      "say the thing you've been rehearsing in your head to the person it's actually for, this week, unfiltered",
      "make the decision you've been delaying by researching it to death, decide today with the information you already have",
      "tell one person your actual plan out loud, not the safe version, the real one",
    ],
    proofMarkers: [
      "the old thought still shows up, but it takes seconds to clock it instead of hours to spiral in it",
      "you catch yourself making a decision faster than you used to, with less second-guessing",
      "someone comments that you seem different, calmer, more certain, before you've said anything about the internal work",
    ],
  },
  confidence: {
    bettysTake: "I see this pattern all the time. Women think they need more confidence before they become visible, but your chart actually shows the opposite. Confidence comes after evidence, not before it. You don't think your way into it, you act your way into it, badly and unevenly at first, and it compounds faster than people expect.",
    rootFrame: (b) => `The real block isn't a lack of ability, it's ${b} Confidence work aimed at skill won't touch this, it has to be aimed at the fear underneath.`,
    shiftBefore: "I'll be confident once I'm good enough.",
    shiftAfter: "I build confidence by acting despite the doubt, not by waiting for the doubt to leave first.",
    protocolTitle: "the 5-day visibility reps",
    protocolDays: [
      "stand in front of a mirror for two minutes and say one true, good thing about yourself out loud, notice how uncomfortable this is, do it anyway",
      "post, send or say the thing you've been sitting on for a week, unedited, today",
      "accept one compliment today without deflecting it, just say thank you and let it land",
      "take up physical space on purpose once today, uncross your arms, sit forward, hold eye contact a beat longer",
      "do the scary ask, the rate, the favour, the introduction, and notice you survive it either way",
    ],
    stretchMoves: [
      "record yourself talking about your work for 60 seconds and actually watch it back without wincing",
      "walk into the room, the meeting or the event you've been avoiding and stay for the whole thing",
      "wear, say or do the thing you've decided is \"too much\", this week, on purpose",
    ],
    proofMarkers: [
      "you catch yourself before you shrink, and choose not to",
      "a compliment lands without an automatic \"oh it's nothing\"",
      "you do the scary thing and the fear shows up smaller than it used to, or leaves faster afterward",
    ],
  },
  career: {
    bettysTake: "Every ambitious woman I've coached hits the same wall eventually, she's outgrown the strategy that got her here but she's still using it, because it feels safer than the version of success that would actually stretch her identity. If you feel capped right now, it's rarely the market. It's usually you, playing a smaller game than your chart actually supports. And if you're building something of your own, the same thing wears a different costume: it looks like still validating the idea, and the validating never quite finishes. Nothing is de-risked before you start it, it's de-risked by starting and adjusting.",
    rootFrame: (b) => `The thing quietly capping your career growth isn't your skill, it's ${b} Strategy alone won't fix this, the block has to be worked directly.`,
    shiftBefore: "I need permission or perfect conditions before I make the move.",
    shiftAfter: "I create the conditions by moving, the permission I'm waiting for is mine to give myself.",
    protocolTitle: "the 5-day momentum sprint",
    protocolDays: [
      "write down the single project that would move your career most if you finished it, and nothing else this week",
      "spend 90 focused minutes on that project only, phone away, protected like a client meeting",
      "send the pitch, application or proposal you've been sitting on, even an imperfect draft",
      "raise one price, rate or ask by 10% and hold the line without over-explaining it",
      "tell one person in your field what you're building toward, out loud, and ask for one specific piece of help",
    ],
    stretchMoves: [
      "apply, pitch or launch the thing you've been \"almost ready\" for, on a real date you commit to this week",
      "have the direct conversation about pay, promotion or title you've been avoiding",
      "publicly claim the expertise you've been quietly downplaying, one post, one bio line, one introduction",
    ],
    proofMarkers: [
      "you finish the project you named instead of starting three new ones",
      "an ask or pitch goes out that used to sit in drafts for weeks",
      "you notice yourself negotiating instead of accepting the first offer",
    ],
  },
  purpose: {
    bettysTake: "Purpose is not a single lightning-bolt answer you're missing, it's a direction your chart has been pointing you toward the whole time, usually straight through whatever feels most unfamiliar. The women who find it aren't the ones who think the hardest about it, they're the ones who follow the pull even when it's inconvenient and keep adjusting as the picture sharpens.",
    rootFrame: (b) => `What's actually keeping your sense of purpose foggy isn't a lack of clarity, it's ${b} Purpose reveals itself through action in the unfamiliar direction, not through more thinking about it.`,
    shiftBefore: "I need to know my exact purpose before I commit to anything.",
    shiftAfter: "My purpose sharpens through the moving, the clarity is the reward for taking the stretch, not the price of admission to it.",
    protocolTitle: "the 5-day direction check",
    protocolDays: [
      "write down the thing that keeps quietly pulling at you even though it scares you or feels impractical",
      "spend 30 minutes today actually doing that thing, not researching it, doing it",
      "ask yourself what you'd regret not attempting in ten years, and write the honest answer down",
      "say the unfamiliar direction out loud to one person you trust, and notice what it feels like to claim it",
      "take one concrete step this week that a version of you fully living her purpose would already have taken",
    ],
    stretchMoves: [
      "commit to the unfamiliar direction publicly, even in a small way, before you feel fully ready",
      "let go of the \"safe path\" plan you've been quietly running as a backup, at least for one real season",
      "ask the person doing the thing you're circling how they actually started, and take their answer seriously",
    ],
    proofMarkers: [
      "the pull toward the unfamiliar direction gets louder instead of easier to ignore",
      "you take the stretch step even though it's uncomfortable, and don't regret it afterward",
      "purpose starts feeling less like a question you're stuck on and more like a direction you're already walking",
    ],
  },
  money: {
    bettysTake: "In twenty years of coaching, I've never once seen a spreadsheet fix a money block. The women who actually change their financial reality do the uncomfortable internal work first, look at the number, name the fear, and separate what's actually true from what's an old story wearing a practical disguise. Money follows clarity, not effort.",
    rootFrame: (b) => `The real money block isn't income, it's ${b} You can optimise your budget forever, this pattern is the one actually setting your ceiling.`,
    shiftBefore: "Money is complicated and I'll deal with it when things feel more stable.",
    shiftAfter: "Clarity creates stability, I look at the numbers because avoiding them is what keeps me stuck.",
    protocolTitle: "the 5-day money clarity reset",
    protocolDays: [
      "check every account balance today, no avoiding it, write the real total down in one place",
      "list every recurring cost you're paying and circle one to cancel or renegotiate this week",
      "name the actual number you want to earn this year, specific, not vague, and write it somewhere you'll see it daily",
      "name one income stream you could grow or start, and take one concrete step, a pitch, a listing, a rate card",
      "spend on one thing today that feels expensive and good, on purpose, and notice the guilt without obeying it",
    ],
    stretchMoves: [
      "ask for the raise, the higher rate or the better deal you've been putting off, this week",
      "set up the savings or investment account you've been meaning to open, today",
      "have the money conversation you've been avoiding, with a partner, client or family member",
    ],
    proofMarkers: [
      "you check your balance without dread, or check it at all when you used to avoid it",
      "you state a price without an apologetic tone attached to it",
      "money moves that used to feel impossible start feeling merely uncomfortable",
    ],
  },
  "style-fashion": {
    bettysTake: "How you dress is never really about clothes, it's a public rehearsal of how much space you think you're allowed to take up. Every woman I've coached who upgraded her style before she \"felt ready\" ended up growing into the woman the outfit was already describing. Clothes are a costume you can put on before the identity fully arrives.",
    rootFrame: (b) => `What's actually keeping your style stuck isn't taste, it's ${b} Fashion advice won't fix an image block, only actually wearing the thing does.`,
    shiftBefore: "I'll wear the bold pieces once I look or feel a certain way.",
    shiftAfter: "The clothes help me become her, I don't have to already be her first.",
    protocolTitle: "the 5-day image audit",
    protocolDays: [
      "go through your wardrobe and pull out anything that doesn't feel like the woman you're becoming, just pull, don't discard yet",
      "wear one piece you've been \"saving for a occasion\" today, no occasion required",
      "get dressed one morning this week by asking \"what would she wear\" instead of \"what's comfortable and safe\"",
      "buy, borrow or plan one piece that matches your actual taste rather than a trend you feel you should like",
      "take one photo of yourself in an outfit that makes you feel powerful, and actually look at it instead of critiquing it",
    ],
    stretchMoves: [
      "wear the outfit you've decided is \"too much\" somewhere ordinary, the supermarket, the school run, a normal Tuesday",
      "donate or remove the pieces that don't match who you're becoming, even if they're expensive or barely worn",
      "get the haircut, colour or styling change you've been circling for months",
    ],
    proofMarkers: [
      "you reach for the bold piece instead of the safe one without a mental negotiation first",
      "a compliment on how you look lands as simple fact instead of something to deflect",
      "getting dressed starts to feel like self-expression instead of damage control",
    ],
  },
  relationships: {
    bettysTake: "The women I coach with the strongest relationship standards on paper are often the ones who struggle most to actually enforce them in the room. Standards you won't voice aren't standards, they're private opinions. The work isn't finding better people, it's becoming someone who says the true thing out loud in real time.",
    rootFrame: (b) => `The pattern actually shaping your relationships isn't your standards, it's ${b} Boundaries and better taste won't fix this on their own, it has to be met directly.`,
    shiftBefore: "I need to earn love by being easy, agreeable or endlessly available.",
    shiftAfter: "I am allowed to take up space in my relationships, the right people stay for the real me.",
    protocolTitle: "the 5-day honesty practice",
    protocolDays: [
      "notice one moment today where you agree to something you don't actually want, and name it to yourself even if you don't change it yet",
      "say one true, slightly uncomfortable thing to someone close to you today",
      "ask for something you need directly, no hinting, no over-explaining, just the ask",
      "spend real, undistracted time with someone who feels like home, not a group chat reply, actual presence",
      "say no to one thing that doesn't serve you, and notice the relationship survives it anyway",
    ],
    stretchMoves: [
      "send the honest message you've been drafting in your head, to the person it's actually for",
      "end or seriously renegotiate the terms of a relationship that's been quietly costing you",
      "tell someone exactly what you need from them, without softening it into a suggestion",
    ],
    proofMarkers: [
      "you say no without the three-paragraph justification that used to follow it",
      "a hard conversation happens and the relationship gets stronger instead of ending",
      "you notice yourself asking for what you want before you've talked yourself out of it",
    ],
  },
  "health-body": {
    bettysTake: "The women who finally get consistent with their health aren't the ones with the strictest routine, they're the ones who stopped treating their body like an enemy to manage. Discipline built on self-punishment collapses eventually, every time. Discipline built on self-trust is the only kind that lasts.",
    rootFrame: (b) => `What's really running your relationship with your body isn't discipline, it's ${b} No routine sticks long-term until this gets addressed underneath it.`,
    shiftBefore: "My body is a project to fix or control.",
    shiftAfter: "My body is a partner to listen to, movement and rest are both information, not punishment or reward.",
    protocolTitle: "the 5-day body trust reset",
    protocolDays: [
      "move today in a way that feels good, not punishing, walk, dance, stretch, whatever your body actually wants",
      "eat one meal today slowly, without a screen, and notice how it actually tastes",
      "go to bed 30 minutes earlier tonight, protect it like an appointment",
      "book or complete the health thing you've been putting off, the appointment, the bloodwork, the check-up",
      "spend five minutes today just breathing, nothing productive, just presence in your body",
    ],
    stretchMoves: [
      "try the type of movement you've been curious about but too self-conscious to start, this week, once",
      "take a full rest day with zero guilt and zero justification needed",
      "have the honest conversation with a professional about the health thing you've been minimising",
    ],
    proofMarkers: [
      "you move because it feels good, not because you're punishing yourself for something",
      "rest stops feeling like something to earn",
      "you notice hunger, tiredness or tension earlier, before it becomes a crisis",
    ],
  },
  "home-environment": {
    bettysTake: "I always ask a stuck client to describe her bedroom floor. It's never really about the mess, it's the one place nobody's watching, so it tells the truth faster than anything she'd say out loud. Fix the visible chaos and the invisible chaos usually follows, in that order, not the other way round.",
    rootFrame: (b) => `The chaos in your space usually mirrors an internal pattern, and here it's ${b} Tidying alone won't hold, the environment has to reflect an internal shift too.`,
    shiftBefore: "I'll sort my space once life calms down.",
    shiftAfter: "My space is part of how I calm my life down, order here creates order everywhere else.",
    protocolTitle: "the 5-day space reset",
    protocolDays: [
      "clear one surface completely today, the one that's been bothering you the most, finish it fully",
      "remove three things from your space that no longer belong to the life you're building",
      "add one thing that makes your space feel cared for, flowers, better light, a candle, whatever feels like softness",
      "spend one evening this week with your phone in another room, notice how your home feels when you're actually in it",
      "open every window for ten minutes today, let the space physically reset with you",
    ],
    stretchMoves: [
      "do the one bigger clear-out you've been avoiding, the drawer, the wardrobe, the garage, in one sitting",
      "redecorate or rearrange one room to actually match who you're becoming, not who you were",
      "host someone in your space this week, notice what that pressure reveals about how you feel in it",
    ],
    proofMarkers: [
      "you walk into your space and your shoulders actually drop",
      "you tidy before it becomes a crisis, not after",
      "your home starts to feel like it belongs to the woman you're becoming, not the one you're leaving",
    ],
  },
  "spiritual-growth": {
    bettysTake: "The most intuitive women I coach are also usually the ones most disconnected from their own gut, because they've spent years being told to be reasonable instead. Your intuition never left, you just built a very convincing case for ignoring her. She's still right, most of the time, and getting quiet enough to hear her is the actual skill.",
    rootFrame: (b) => `What's actually disconnecting you from your intuition isn't busyness, it's ${b} More information won't fix this, only slowing down enough to hear yourself will.`,
    shiftBefore: "I need more proof or certainty before I trust myself.",
    shiftAfter: "My intuition is data I already have, the proof shows up after I trust it, not before.",
    protocolTitle: "the 5-day inner listening practice",
    protocolDays: [
      "sit in silence for five minutes today, no phone, just notice what surfaces once the noise clears",
      "write down one nudge or gut feeling you've been ignoring, and one small step toward honouring it",
      "spend ten minutes in nature, or as close as you can get, without a destination or agenda",
      "notice one moment today you override your gut with logic, and name it, even if you don't change the decision yet",
      "do one small ritual on purpose, a candle, scripting, a full moon release, whatever actually works for you",
    ],
    stretchMoves: [
      "act on the nudge you've been overriding with logic for weeks, this week, once",
      "take a full day with meaningfully less noise, less scrolling, less input, and notice what surfaces",
      "share the intuitive hit or download you've been sitting on with someone who'll actually hear it",
    ],
    proofMarkers: [
      "you notice the gut feeling before the anxious overthinking arrives to argue with it",
      "decisions start feeling less like a debate and more like a knowing",
      "silence starts to feel restful instead of uncomfortable",
    ],
  },
  healing: {
    bettysTake: "Every woman I've coached through real shadow work hits the same wall eventually, she wants the wound gone, not understood. It doesn't go. It integrates. The version of you on the other side of this work isn't wound-free, she's just no longer surprised by it, and that's the whole difference.",
    rootFrame: (b) => `The pattern actually keeping this wound active isn't the original hurt, it's ${b} Naming it once won't fix it, this has to be worked directly, on repeat, until it loosens its grip.`,
    shiftBefore: "This wound is something wrong with me that I need to fix or hide.",
    shiftAfter: "This wound is where my depth lives, integration, not erasure, is the actual work.",
    protocolTitle: "the 5-day integration practice",
    protocolDays: [
      "name the pattern out loud the next time it fires, in the moment, even just to yourself, no need to stop it yet",
      "write the sentence the wound tells you when it's triggered, then write the true sentence underneath it",
      "do one small, imperfect version of the thing the wound usually stops you from doing, today",
      "tell one trusted person \"this is a pattern I'm working on\" instead of quietly managing it alone",
      "notice one moment today the old trigger shows up, and clock how much faster you move through it than you used to",
    ],
    stretchMoves: [
      "tell someone the full, unfiltered version of the thing you usually soften or leave out",
      "do the thing the wound has been quietly running your decisions around, once, on purpose",
      "forgive yourself out loud for the last time this pattern cost you something",
    ],
    proofMarkers: [
      "the old trigger still shows up, but it costs you minutes instead of days",
      "you can name the pattern out loud without shame creeping in behind it",
      "someone close to you notices you handling it differently than you used to",
    ],
  },
};

export interface AreaActivation {
  title: string;
  ritual: string;
}

// Affirmations to actually say, and one specific activation ritual, distinct from the 5-day
// protocol, this is a single practice to do once, right now, to switch the area on.
const AREA_EXTRAS: Record<string, { affirmations: string[]; activation: AreaActivation }> = {
  mindset: {
    affirmations: [
      "My mind is not my enemy, it's a pattern I'm actively rewriting.",
      "I don't need certainty to move, I need one true next step.",
      "Every belief I've outgrown gets replaced by evidence, not hope.",
    ],
    activation: {
      title: "the mirror rewrite",
      ritual: "Stand in front of a mirror, say the old belief out loud once, then immediately say the new one three times while looking yourself in the eye. Ninety seconds, done properly, does more than an hour of thinking about it.",
    },
  },
  confidence: {
    affirmations: [
      "I take up exactly the space I was always going to take up, I'm just done waiting.",
      "Confidence is a rep I do, not a feeling I wait for.",
      "The version of me that already did the scary thing is available to me right now.",
    ],
    activation: {
      title: "the two-minute power stand",
      ritual: "Before the moment that scares you, stand with your feet apart, shoulders back, chin level, for two full minutes. Your body convinces your brain first. Do this before you walk into the room, not after.",
    },
  },
  career: {
    affirmations: [
      "My career grows when I stop asking permission and start asking for more.",
      "I am already the authority I keep waiting to feel like.",
      "The next level requires the strategy that scares the current me a little.",
    ],
    activation: {
      title: "the claim it out loud ritual",
      ritual: "Say your actual career ambition out loud, alone, in full sentences, as if it's already decided. Not the safe, hedged version, the real one. Do this once today before you tell anyone else.",
    },
  },
  purpose: {
    affirmations: [
      "My purpose reveals itself through motion, not through more thinking.",
      "The unfamiliar pull I keep feeling is information, not a distraction.",
      "I am allowed to follow the direction before I fully understand where it leads.",
    ],
    activation: {
      title: "the ten-year regret check",
      ritual: "Write one sentence, right now: what would I regret not attempting in ten years? Read it back out loud. Let it sit somewhere you'll see it daily this szn.",
    },
  },
  money: {
    affirmations: [
      "I look directly at my numbers because avoiding them is what keeps me stuck.",
      "My worth was never up for negotiation, my price is allowed to reflect that.",
      "Money moves toward the clarity I create, not the vagueness I hide in.",
    ],
    activation: {
      title: "the balance check ritual",
      ritual: "Open every account right now, today, and write the real total in one place, no flinching. Then write the number you actually want to earn this year next to it. Data before strategy, always.",
    },
  },
  "style-fashion": {
    affirmations: [
      "I dress like the woman I'm becoming, not the one I'm leaving behind.",
      "My style is a rehearsal for the identity that's already arriving.",
      "I wear the bold piece today, the occasion was never coming to rescue me.",
    ],
    activation: {
      title: "the saved-for-someday ritual",
      ritual: "Find the one piece you've been \"saving for an occasion\" and wear it today, for nothing in particular. Notice how it changes how you move through an ordinary day.",
    },
  },
  relationships: {
    affirmations: [
      "I am allowed to take up space in my relationships, the right people stay.",
      "My honest preference is not a conflict, it's clarity someone needed.",
      "I say the true thing in real time instead of managing it in silence.",
    ],
    activation: {
      title: "the one true sentence ritual",
      ritual: "Say one true, slightly uncomfortable thing to someone close to you today, in person or by message. One sentence. Notice the relationship survives it, usually stronger.",
    },
  },
  "health-body": {
    affirmations: [
      "My body is a partner to listen to, not a project to fix.",
      "Rest is information, not something I have to earn first.",
      "I move because it feels good, that's reason enough.",
    ],
    activation: {
      title: "the five-minute presence ritual",
      ritual: "Sit still for five minutes today and simply notice what your body is telling you, hunger, tension, tiredness, before you override it with logic. Just notice, don't fix yet.",
    },
  },
  "home-environment": {
    affirmations: [
      "My space is part of how I calm my life down, not a reflection of my chaos.",
      "Order here creates order everywhere else, starting with one surface.",
      "I let my home catch up to the woman I'm actually becoming.",
    ],
    activation: {
      title: "the one-surface reset",
      ritual: "Pick the one surface that's been quietly bothering you and clear it completely, right now, start to finish. Notice what shifts in your body the moment it's done.",
    },
  },
  "spiritual-growth": {
    affirmations: [
      "My intuition is data I already have, the proof arrives after I trust it.",
      "Silence is where my own voice finally gets to speak.",
      "I act on the nudge before I demand certainty from it first.",
    ],
    activation: {
      title: "the five-minute silence ritual",
      ritual: "Sit in complete silence for five minutes today, no phone, no music, nothing to do. Notice what surfaces once the noise clears, and write down the first true thing that comes.",
    },
  },
  healing: {
    affirmations: [
      "This wound isn't proof something is wrong with me, it's proof I'm human and paying attention.",
      "I don't need the pattern gone, I need to catch it faster than I used to.",
      "Integration, not erasure, that's the actual work, and I'm already doing it.",
    ],
    activation: {
      title: "the name it out loud ritual",
      ritual: "Say the pattern out loud, alone, exactly as it actually runs, not the polished version. \"When X happens, I do Y because I'm protecting myself from Z.\" Naming it precisely, once, out loud, takes real power away from it.",
    },
  },
};

// Finds the most significant live transit currently activating this life area, matched by
// natal house first, then by the ruling planet itself, so "transits" means an actual real-time
// aspect happening in the sky right now, not another static paragraph.
function findRelevantActivation(transits: TransitData | null | undefined, house: number, bodyId: string): ActivatedPlacement | null {
  if (!transits || transits.activatedPlacements.length === 0) return null;
  const bodyLabel = bodyId.replace(/_/g, " ");
  const matches = transits.activatedPlacements.filter(
    (a) => a.natalHouse === house || a.natalPlanet.toLowerCase() === bodyLabel
  );
  if (matches.length === 0) return null;
  return [...matches].sort((a, b) => a.orb - b.orb)[0];
}

// Every live transit currently touching this area, either house (primary or secondary), so the
// page can show the full real-time picture instead of just the single closest hit.
function findAllActivations(
  transits: TransitData | null | undefined,
  houses: number[],
  bodyId: string
): ActivatedPlacement[] {
  if (!transits || transits.activatedPlacements.length === 0) return [];
  const bodyLabel = bodyId.replace(/_/g, " ");
  const matches = transits.activatedPlacements.filter(
    (a) => houses.includes(a.natalHouse) || a.natalPlanet.toLowerCase() === bodyLabel
  );
  return [...matches].sort((a, b) => a.orb - b.orb).slice(0, 3);
}

function describeActivation(a: ActivatedPlacement, primaryHouse: number): string {
  return `Transiting ${a.activatedBy} is making a real ${a.aspectType} to your natal ${a.natalPlanet.toLowerCase()}${
    a.natalHouse === primaryHouse ? `, directly inside this ${ordinalHouse(primaryHouse)} house` : ` in your ${ordinalHouse(a.natalHouse)} house`
  }, activating ${a.theme} in this exact area of your life right now, this isn't a metaphor, it's the sky today.`;
}

// The natal aspects your ruling planet actually carries, in plain English, sorted tightest orb
// first, this is what makes "the real block" and "in your chart" sections feel earned rather
// than generic, they're reading your actual chart geometry, not just your sign placement.
function signForName(chart: ChartData, name: string): string | undefined {
  if (name === "Ascendant") return chart.houses[0]?.sign;
  if (name === "Midheaven") return chart.houses[9]?.sign;
  return chart.planets.find((p) => p.name === name)?.sign;
}

function natalAspectsFor(chart: ChartData, planetName: string | undefined, limit = 2): string[] {
  if (!planetName) return [];
  const relevant = chart.aspects
    .filter((a) => a.planet1 === planetName || a.planet2 === planetName)
    .sort((a, b) => a.orb - b.orb)
    .slice(0, limit);
  return relevant
    .map((a) => {
      const other = a.planet1 === planetName ? a.planet2 : a.planet1;
      return interpretAspect(planetName, other, a.type, {
        sign1: signForName(chart, planetName),
        sign2: signForName(chart, other),
        orb: a.orb,
      });
    })
    .filter((line): line is string => !!line);
}

// The specific, easy-to-miss behaviour that gives the pattern away, distinct from the deeper root cause
const BLIND_SPOT_TELLS: Record<string, string> = {
  mindset: "You explain your hesitation as \"being realistic\" or \"weighing it up properly\", when the research phase has quietly become a way to postpone the decision indefinitely. If you've been thinking about it for longer than it would take to just try it, you already have your answer and you're avoiding it.",
  confidence: "You wait for the nerves to go away before you act, and call that \"waiting until I'm ready\". The nerves were never going to leave first, they leave after, as a result of the action, not a precondition for it.",
  career: "You call it \"not the right time yet\", but notice how the right time keeps sliding further away every time you get close to it. That's not timing, that's the fear of being seen succeeding, or of being seen failing, wearing a scheduling costume.",
  purpose: "You call it \"still figuring out what I actually want\", but notice the same unfamiliar direction keeps showing up every time you're honest with yourself. You're not missing information, you're avoiding the inconvenient answer you already have.",
  money: "You avoid checking the numbers and call it \"not obsessing over money\", when really it's easier to stay vague than to face a concrete truth. Vagueness feels safer than clarity, but it's also where every money block hides.",
  "style-fashion": "You save your best pieces for a future occasion that never quite arrives, and call it \"being practical\". The occasion isn't coming to rescue you, wearing the piece is how you signal to yourself that today already counts.",
  relationships: "You call it \"keeping the peace\", but notice how often it means quietly resenting someone for something you never actually told them. Peace you have to perform isn't peace, it's suppressed conflict on a delay.",
  "health-body": "You call it \"pushing through\" or \"not making excuses\", right up until your body forces the rest anyway, on its terms instead of yours. Ignoring the early signal doesn't make you stronger, it just means the eventual crash is bigger.",
  "home-environment": "You call the mess \"not a priority right now\", but notice how much mental noise it actually creates every time you walk past it. Your environment isn't neutral, it's either regulating your nervous system or quietly draining it.",
  "spiritual-growth": "You call the constant busyness \"just how life is right now\", but notice it always seems to fill the exact amount of silence that would otherwise let a difficult feeling or decision surface. Busy is sometimes just avoidance with better PR.",
  healing: "You call it \"already dealt with\" or \"old news\", but notice how quickly it can still knock you sideways when it actually shows up. Something you've truly integrated doesn't need the story repeated to prove it's handled, the fact that it still needs defending is the tell.",
};

export interface LifeAreaReading {
  id: string;
  label: string;
  emoji: string;
  house: number;
  bodyLabel: string; // "sun", "saturn", "north node"... for section headers
  sign: string; // the sign that body sits in, for section headers
  quickSummary: string; // one scannable line for grid/summary cards, distinct from the full whatThisIsAbout paragraph
  whatThisIsAbout: string;
  planetMeaning: string; // sign-agnostic: what this planet/point actually governs
  signMeaning: string; // planet-agnostic: what this sign's own energy actually is
  houseMeaning: { title: string; text: string; naturalSign: string }; // planet-agnostic: what this house actually governs
  cuspSign: string; // the actual sign on this area's primary house cusp, distinct from meta.bodyId's sign
  rulerPlacement: RulerPlacement | null; // the planet that actually rules the primary house's cusp sign, and where it natally sits
  signature: string; // one cohesive paragraph synthesising house + cusp + ruler + ruler placement + tenants into "your X signature"
  deepSynthesis: string[]; // the interpretive payoff for the primary house: why the chain creates a pattern, why ruler-sign matters, why ruler-house matters, how the season shifts it. Paragraphs.
  quickContext: { house: string; cuspSign: string; ruler: string }; // the compact 20%: one short line each for the raw ingredients, so the page can teach fast and interpret slow
  // The recipe framework: every house, planet and point in this area's composition, each fully resolved.
  axisLabel: string; // e.g. "money axis", "career framework", what to title the framework section
  recipeHouses: HouseChain[]; // every house in the recipe, primary first, each with its full rulership chain
  planetLayers: PlanetLayer[]; // each named planet interpreted completely: sign, house, rulerships, dignity
  pointLayers: PointLayer[]; // each chart point (nodes) interpreted by sign + house
  ascendantLayer: { sign: string; ruler: RulerPlacement | null; synthesis: string } | null; // rising sign + its ruler chain, where the recipe uses it
  priorityLead: string; // what matters most in this specific chart: the single most salient factor, named and explained
  frameworkSynthesis: string[]; // the woven interpretation across the whole recipe: secondary/tertiary houses, planet layers, points, their relationships, and how the season activates the whole thing
  inYourChart: string;
  natalAspectLines: string[]; // the actual aspects your ruling planet carries, in plain english
  bettysTake: string;
  blindSpot: string;
  rootPattern: string;
  shiftBefore: string;
  shiftAfter: string;
  protocolTitle: string;
  protocolDays: string[];
  stretchMove: string;
  proofMarkers: string[];
  seasonEdge: string;
  goalTieIn: string | null;
  affirmations: string[];
  activation: AreaActivation;
  transitLine: string | null;
  transitLines: string[]; // every live transit currently touching this area, not just the closest one
}

// Trait fields are authored inconsistently, some end with a full stop, some don't. When one is
// spliced mid-sentence (e.g. "it tips into <shadow>."), strip any trailing punctuation/space so
// the composed sentence doesn't run on or double up its period.
function cleanClause(s: string): string {
  return s.trim().replace(/[.\s]+$/, "");
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

// describeOccupants reads lowercase so it can sit mid-sentence (e.g. "...where no other planet
// sits there..."), but two callers open a fresh sentence with it, this capitalises just those.
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function seedFrom(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}

function signForBody(chart: ChartData, bodyId: string): string {
  if (bodyId === "rising") return chart.houses[0]?.sign || "Aries";
  if (bodyId === "midheaven") return chart.houses[9]?.sign || "Capricorn";
  return chart.planets.find((p) => p.id === bodyId)?.sign || "Leo";
}

// Where this life area's archetypal planet (e.g. Jupiter for money) actually sits natally, so
// the copy can state its real house instead of assuming it shares the life area's own house.
function bodyHouseFor(chart: ChartData, bodyId: string): number {
  if (bodyId === "rising") return 1;
  if (bodyId === "midheaven") return 10;
  return chart.planets.find((p) => p.id === bodyId)?.house ?? 1;
}

function houseTenantsOf(chart: ChartData, houseNumber: number): PlanetPosition[] {
  return chart.planets.filter((p) => p.house === houseNumber);
}

// Turns raw house occupants into synthesised prose instead of a flat list of names. One
// occupant gets named directly, two get named together, three or more is a genuine stellium
// and gets called out as a concentration in its own right, with the loudest voice (the Sun,
// when present) actually interpreted. That's what "prioritised, not dumped" looks like in code.
// rulerId lets the "extra voices alongside the ruler" framing exclude the ruling planet itself
// when it happens to sit in its own house, otherwise the copy contradicts the signature by calling
// the steering planet a mere occupant. A stellium (3+) is still described in full, ruler included,
// since there the concentration itself is the point.
const EMPTY_HOUSE_CLAUSES = [
  `no other planet sits there natally, so that house runs almost entirely on its ruler's terms, undiluted by a competing voice`,
  `nothing else is parked there natally, so the ruler sets the tone of that house on its own`,
  `that house sits empty natally, which isn't a gap, it just means the ruler carries it with nothing arguing back`,
];

function describeOccupants(tenants: { id?: string; name: string; sign: string }[], areaLabel: string, traitKey: keyof SignTraits, rulerId?: string, variant = 0): string {
  if (tenants.length >= 3) {
    const names = tenants.map((p) => p.name.toLowerCase());
    const loud = tenants.find((p) => p.name === "Sun") || tenants[0];
    const loudTraits = SIGN_TRAITS[loud.sign];
    const loudClause = loudTraits ? cleanClause((loudTraits[traitKey] as string) || loudTraits.essence) : "";
    return `that's a genuine stellium, ${tenants.length} placements stacked in one house: ${names.join(", ")}. The concentration is the headline on its own, this isn't a quiet corner of your chart, it's one of the most loaded rooms in it${
      loudClause ? `, and with your ${loud.sign.toLowerCase()} ${loud.name.toLowerCase()} the loudest voice among them, that means ${loudClause}` : ""
    }`;
  }
  const others = rulerId ? tenants.filter((p) => p.id !== rulerId) : tenants;
  if (others.length === 0) {
    // Rotated by caller index. A recipe can read two or three empty houses, and emitting the same
    // sentence verbatim two or three times in one page is the fastest way to make a personalised
    // read feel machine-generated. Each variant has to survive capitalize() at the call sites.
    return EMPTY_HOUSE_CLAUSES[variant % EMPTY_HOUSE_CLAUSES.length];
  }
  const names = others.map((p) => p.name.toLowerCase());
  if (others.length === 1) {
    return `your ${names[0]} also sits there, adding its own voice to ${areaLabel}, though it's an occupant, not the one steering`;
  }
  return `your ${names[0]} and ${names[1]} both sit there too, two extra voices shaping ${areaLabel} alongside the ruler`;
}

// season.focus is authored as a capitalised sentence ending in a full stop. This strips it back to
// a bare clause so it can be embedded mid-sentence without butting two sentences together.
// The full focus, lowercased, for use where a sentence STARTS with it ("the push is simple: ...").
// Every season.focus is two sentences ("Be seen. Stop watering yourself down and let them look."),
// which is fine here because the whole thing lands as its own statement.
function focusPhrase(season: SeasonInfo): string {
  const f = season.focus.trim().replace(/[.\s]+$/, "");
  return f.charAt(0).toLowerCase() + f.slice(1);
}

// Just the opening imperative ("be seen", "face the shadow"), for use MID-sentence.
// Using focusPhrase inline was splitting sentences in half on every life area for every sign:
// "the season's push to be seen. Stop watering yourself down and let them look doesn't land as
// gentle encouragement". All 12 focus strings lead with a short imperative, so taking the first
// sentence gives a clause that reads correctly inside a larger one.
function focusLead(season: SeasonInfo): string {
  const first = season.focus.trim().split(/(?<=\.)\s+/)[0] ?? season.focus;
  const f = first.trim().replace(/[.\s]+$/, "");
  return f.charAt(0).toLowerCase() + f.slice(1);
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

// One paragraph giving a secondary or tertiary recipe house the same full chain the primary house
// gets: cusp sign, ruler, ruler's sign and house, and occupants (synthesised, not listed).
function renderHouseChainPara(chain: HouseChain, areaLabel: string, traitKey: keyof SignTraits, variant = 0): string {
  const rName = chain.ruler ? rulerRef(chain.ruler.rulerName) : "";
  const rulerClause = chain.ruler
    ? ` It begins in ${chain.cuspSign}, ruled by ${rName}, and ${rName} sits in ${chain.ruler.rulerSign.toLowerCase()} in your ${ordinalHouse(chain.ruler.rulerHouse)} house${
        chain.ruler.rulerHouse === chain.house
          ? ", right there governing its own house directly, a house running its own engine"
          : ` of ${HOUSE_MEANINGS[chain.ruler.rulerHouse - 1].title}`
      }.`
    : ` It begins in ${chain.cuspSign}.`;
  return `Your ${ordinalHouse(chain.house)} house of ${chain.title}, ${chain.rules}, is another live part of your ${areaLabel}.${rulerClause} ${capitalize(describeOccupants(chain.occupants, areaLabel, traitKey, chain.ruler?.rulerId, variant))}.`;
}

// One paragraph naming how the recipe's houses relate as a single framework, in the member's own
// rulers, plus the reflective prompts, so the houses read as one story rather than a list.
function renderRelationshipPara(recipe: AreaRecipe, houseChains: HouseChain[]): string {
  const parts = houseChains.map((c) =>
    c.ruler
      ? `your ${ordinalHouse(c.house)} through ${rulerRef(c.ruler.rulerName)} in ${c.ruler.rulerSign.toLowerCase()}`
      : `your ${ordinalHouse(c.house)} house`
  );
  return `Read together, these houses make up your whole ${recipe.axisLabel}: ${recipe.axisFraming}. ${capitalize(joinList(parts))} each run part of it, and no single one tells the story alone. ${recipe.axisPrompts.join(" ")}`;
}

// One paragraph for a named planet layer: its full synthesis (already complete) plus its actual
// role in this area, whether it also rules or occupies one of the recipe's houses, so the planet
// is connected to the framework rather than described in isolation.
const OUTSIDE_HOUSE_CLAUSES = [
  ` It shapes this area as a distinct current running alongside the houses, not from inside them.`,
  ` It works on this area from outside the houses involved, feeding in rather than forming part of the structure.`,
  ` It neither sits in nor rules the houses this area is built on, so read it as colour on the picture rather than one of its load-bearing parts.`,
];

function renderPlanetPara(layer: PlanetLayer, areaLabel: string, recipeHouses: number[], variant = 0): string {
  const rulesRecipeHouse = layer.rulesHouses.some((h) => recipeHouses.includes(h));
  const occupiesRecipeHouse = recipeHouses.includes(layer.house);
  const roleClause =
    occupiesRecipeHouse && rulesRecipeHouse
      ? ` This one is doing double duty in your ${areaLabel}: it both rules and physically sits inside houses this area is built on, which makes it one of the loudest voices in the whole picture, weight it heavily.`
      : occupiesRecipeHouse
        ? ` Because it sits inside one of the houses this area is built on, it isn't a background influence here, it's directly in the room.`
        : rulesRecipeHouse
          ? ` Because it rules one of the houses this area is built on, it has a real say in how this plays out, even from where it sits.`
          : OUTSIDE_HOUSE_CLAUSES[variant % OUTSIDE_HOUSE_CLAUSES.length];
  return `${layer.synthesis}${roleClause}`;
}

// One paragraph for the rising sign and its ruler, where a recipe uses the Ascendant.
function renderAscendantSynthesis(sign: string, ruler: RulerPlacement | null, areaLabel: string): string {
  const t = SIGN_TRAITS[sign];
  const rName = ruler ? rulerRef(ruler.rulerName) : "";
  const rulerClause = ruler
    ? ` Your rising sign is ruled by ${rName}, in ${ruler.rulerSign.toLowerCase()} in your ${ordinalHouse(ruler.rulerHouse)} house, so the way you physically arrive is wired straight to that placement.`
    : "";
  return `Your ${sign.toLowerCase()} rising is the body and presence you actually show up in: ${t?.essence || "your own distinct arrival"}. For your ${areaLabel} that matters because this is the first thing the world reads off you, before a single word.${rulerClause}`;
}

// One paragraph tying the season to the whole framework at once, not just the primary house.
function renderSeasonFrameworkPara(season: SeasonInfo, houseChains: HouseChain[], areaLabel: string): string {
  const houseList = joinList(houseChains.map((c) => `your ${ordinalHouse(c.house)} house of ${c.title}`));
  return `${season.sign} season doesn't land on just one corner of this. The season's push this szn is simple: ${focusPhrase(season)}. That presses on the whole framework at once, ${houseList}, asking them to move together rather than letting you fix one and quietly ignore the rest. Expect your ${areaLabel} to keep surfacing this season wherever these houses overlap in real life, as one connected pattern rather than separate items on a list.`;
}

// The prioritisation lead: the engine's judgement of the single most salient factor in THIS chart,
// so the reading opens by telling the member what to weight most instead of giving every placement
// equal airtime. Priority order reflects astrological loudness: a stellium, then a planet doing
// double duty as ruler-and-occupant, then a house running its own engine, then strong or
// challenged dignity, then the primary ruler as the default thread.
function computePriorityLead(recipe: AreaRecipe, houseChains: HouseChain[], planetLayers: PlanetLayer[], areaLabel: string): string {
  const stelliumChain = houseChains.find((c) => c.occupancy === "stellium");
  if (stelliumChain) {
    const names = stelliumChain.occupants.map((o) => o.name.toLowerCase());
    return `The single loudest thing in your ${areaLabel} is the stellium in your ${ordinalHouse(stelliumChain.house)} house of ${stelliumChain.title}: ${joinList(names)} all stacked in one place. Weight this most as you read the rest, that concentration is where both the real pressure and the real gift of this area sit.`;
  }
  for (const c of houseChains) {
    if (c.ruler && recipe.houses.includes(c.ruler.rulerHouse) && c.ruler.rulerHouse !== c.house) {
      return `The thread to follow first in your ${areaLabel} is ${rulerRef(c.ruler.rulerName)}: it rules your ${ordinalHouse(c.house)} house and also sits inside your ${ordinalHouse(c.ruler.rulerHouse)} house, another house this area is built on, tying two parts of the story together in a single placement. That double role makes it the most load-bearing factor here.`;
    }
  }
  const ownHouse = houseChains.find((c) => c.ruler && c.ruler.rulerHouse === c.house);
  if (ownHouse?.ruler) {
    return `The strongest note in your ${areaLabel} is that your ${ordinalHouse(ownHouse.house)} house runs its own engine: ${rulerRef(ownHouse.ruler.rulerName)} both rules it and sits right inside it, so this part of the area is unusually self-contained and powerful. Start reading from here.`;
  }
  const strong = planetLayers.find((p) => p.dignity === "domicile" || p.dignity === "exaltation");
  if (strong) {
    return `The standout strength in your ${areaLabel} is your ${strong.sign.toLowerCase()} ${strong.name.toLowerCase()}, ${strong.dignity === "domicile" ? "in the sign it rules" : "in the sign of its exaltation"} and so one of the real power sources feeding this area. Lean on it deliberately.`;
  }
  const challenged = planetLayers.find((p) => p.dignity === "detriment" || p.dignity === "fall");
  if (challenged) {
    return `The factor asking for the most conscious support in your ${areaLabel} is your ${challenged.sign.toLowerCase()} ${challenged.name.toLowerCase()}, working slightly uphill in ${challenged.dignity === "fall" ? "the sign of its fall" : "detriment"}. Real ability lives here, it just won't run on autopilot, so this is where deliberate effort pays off most.`;
  }
  const p = houseChains[0]?.ruler;
  return p
    ? `The thread to follow first in your ${areaLabel} is ${rulerRef(p.rulerName)} in ${p.rulerSign.toLowerCase()}, the ruler of your ${ordinalHouse(houseChains[0].house)} house and the engine everything else in this area runs through.`
    : `Your ${areaLabel} reads most clearly starting from your ${ordinalHouse(houseChains[0]?.house ?? 1)} house and working outward.`;
}

export function composeLifeArea(
  rawAreaId: string,
  chart: ChartData,
  season: SeasonInfo,
  goal?: Goal | null,
  transits?: TransitData | null
): LifeAreaReading | null {
  const areaId = resolveAreaId(rawAreaId);
  const meta = LIFE_AREAS.find((a) => a.id === areaId);
  const content = AREA_CONTENT[areaId];
  const extras = AREA_EXTRAS[areaId];
  if (!meta || !content || !extras) return null;

  // The recipe is the source of truth for which houses, planets and points this area interprets.
  // Falls back to a minimal single-house recipe so an unrecognised area never crashes.
  const recipe: AreaRecipe = AREA_RECIPES[areaId] ?? {
    houses: meta.houseNumbers,
    planets: [meta.bodyId],
    axisLabel: `${meta.label} framework`,
    axisFraming: "",
    axisPrompts: [],
  };

  const sign = signForBody(chart, meta.bodyId);
  const traits = SIGN_TRAITS[sign] || SIGN_TRAITS.Leo;
  const primaryHouse = recipe.houses[0];
  const houseMeaning = HOUSE_MEANINGS[primaryHouse - 1];
  const houseTenants = houseTenantsOf(chart, primaryHouse);
  const cuspSign = chart.houses[primaryHouse - 1]?.sign || houseMeaning.naturalSign;
  const rulerPlacement = composeRulerPlacement(cuspSign, primaryHouse, chart);

  // Every house, planet and point in the recipe, each resolved to its full chain/layer. This is
  // the whole framework for the area, primary house first.
  const recipeHouses = recipe.houses.map((h) => composeHouseChain(h, chart));
  const allPlanetLayers = recipe.planets
    .map((pid) => composePlanetLayer(pid, chart))
    .filter((l): l is PlanetLayer => !!l);
  // A named planet that already rules one of the recipe houses is covered by that house's chain,
  // so drop it from the planet layers to avoid restating the same sign+house placement twice.
  const recipeHouseRulerIds = new Set(recipeHouses.map((c) => c.ruler?.rulerId).filter(Boolean));
  const planetLayers = allPlanetLayers.filter((l) => !recipeHouseRulerIds.has(l.id));
  const pointLayers = (recipe.points ?? [])
    .map((pid) => composePointLayer(pid, chart))
    .filter((p): p is PointLayer => !!p);
  const ascSign = recipe.useAscendant ? chart.houses[0]?.sign : undefined;
  const ascendantLayer = ascSign
    ? { sign: ascSign, ruler: composeRulerPlacement(ascSign, 1, chart), synthesis: "" }
    : null;

  // Backward-compatible secondary references, still used by a few coaching/transit lines below.
  const secondaryChain = recipeHouses[1] ?? null;
  const secondaryHouseNumber = secondaryChain?.house ?? null;
  const secondaryHouseMeaningRaw = secondaryHouseNumber ? HOUSE_MEANINGS[secondaryHouseNumber - 1] : null;
  const secondaryTenants = secondaryHouseNumber ? houseTenantsOf(chart, secondaryHouseNumber) : [];

  const seed = seedFrom(`${areaId}-${season.sign}-${sign}-${chart.birthData.name}`);
  const stretchMove = pick(content.stretchMoves, seed);

  const bodyLabel =
    meta.bodyId === "rising" ? "rising" : meta.bodyId === "midheaven" ? "midheaven" : meta.bodyId === "north_node" ? "north node" : meta.bodyId;

  const areaFieldMap: Record<string, keyof typeof traits> = {
    mindset: "growth",
    confidence: "confidence",
    career: "career",
    business: "career",
    purpose: "growth",
    money: "money",
    "style-fashion": "flavour",
    relationships: "love",
    "health-body": "essence",
    "home-environment": "essence",
    "spiritual-growth": "growth",
    healing: "shadow",
  };
  const traitKey = areaFieldMap[areaId] || "essence";
  const traitLine = Array.isArray(traits[traitKey]) ? (traits[traitKey] as string[]).join(", ") : (traits[traitKey] as string);

  const planetName = chart.planets.find((p) => p.id === meta.bodyId)?.name;
  const natalAspectLines = natalAspectsFor(chart, planetName, 2);
  const aspectSummaryLine =
    natalAspectLines.length > 0
      ? ` Zooming out to the full chart geometry: ${natalAspectLines.join(" ")}`
      : ` Your ${sign.toLowerCase()} ${bodyLabel} isn't in a major aspect to anything else in your chart, which means it runs cleanly, on its own terms, without another planet's agenda pulling on it.`;

  const blockText = findRootBlock(chart, meta.bodyId, sign);

  const goalTieIn =
    goal && LIFE_AREA_TO_GOAL_CATEGORY[areaId] === goal.category
      ? `You told us your goal here is "${goal.title}." Your ${sign.toLowerCase()} ${bodyLabel} is exactly what this goal needs to lean on, and ${season.sign.toLowerCase()} szn is timing that's working in your favour right now. Run the protocol below with that goal in mind, not as an abstract exercise.`
      : null;

  const activePlacement = findRelevantActivation(transits, primaryHouse, meta.bodyId);
  const transitLine = activePlacement ? describeActivation(activePlacement, primaryHouse) : null;

  const allActivations = findAllActivations(transits, recipe.houses, meta.bodyId);
  const transitLines = allActivations.map((a) => describeActivation(a, primaryHouse));

  const bodyMeaning = getBodyMeaning(meta.bodyId);
  const signOverview = SIGN_OVERVIEWS[sign];
  const cuspTraits = SIGN_TRAITS[cuspSign] || SIGN_TRAITS.Leo;

  // The signature: one cohesive read that actually connects the layers, house, cusp sign,
  // ruler, where the ruler sits, who else lives in the house, instead of leaving her to piece
  // together separate sections herself. This is meant to be the single line she'd screenshot.
  // The full chain, in order: season activates the house, the house has a cusp sign, that sign
  // has a ruler, the ruler sits somewhere specific, and whatever else lives in the house is a
  // separate layer on top, not the same thing as the ruler. This is the one paragraph meant to
  // read as "an astrologer connected the pieces" rather than several facts stacked together.
  const rName = rulerPlacement ? rulerRef(rulerPlacement.rulerName) : "";
  const rulerSignTraits = rulerPlacement ? SIGN_TRAITS[rulerPlacement.rulerSign] : undefined;
  const rulerHouseMeaning = rulerPlacement ? HOUSE_MEANINGS[rulerPlacement.rulerHouse - 1] : undefined;
  const seasonTraits = SIGN_TRAITS[season.sign] || SIGN_TRAITS.Leo;
  const seasonOverview = SIGN_OVERVIEWS[season.sign];
  const rulerOverview = rulerPlacement ? SIGN_OVERVIEWS[rulerPlacement.rulerSign] : undefined;

  // Every life area has a natural significator planet (Mercury for mindset, Venus for love, etc.)
  // AND a chart-specific house-cusp ruler, often two different planets. Both genuinely drive the
  // area: the ruler runs the house, and the significator is the planet the area is fundamentally
  // about. So the reading names both as real drivers, giving the significator its own placement,
  // rather than crowning the ruler and calling the significator background texture.
  const bodyHouse = bodyHouseFor(chart, meta.bodyId);
  const bodyIsRuler = !!rulerPlacement && rulerPlacement.rulerId === meta.bodyId;
  // The significator aside only fires for an actual planet that is not already the house ruler.
  // It is skipped for a node/point, which gets its own full point layer instead.
  const bodyIsPoint = meta.bodyId === "north_node" || meta.bodyId === "south_node";
  const archetypalAside = rulerPlacement && !bodyIsRuler && !bodyIsPoint
    ? ` And your ${bodyLabel} drives this every bit as much as ${rName}: ${bodyLabel} is ${bodyMeaning?.domainShort || "the placement this area is fundamentally about"}, so your ${sign.toLowerCase()} ${bodyLabel} in your ${ordinalHouse(bodyHouse)} house is the other engine here, ${cleanClause(traits.gift)} at its best and ${cleanClause(traits.shadow)} under pressure. Two real drivers, read them together.`
    : "";

  const signature = rulerPlacement
    ? `${season.sign} season activates your ${ordinalHouse(primaryHouse)} house of ${houseMeaning.title}, that's where this szn's pressure on ${meta.label} is actually landing. Your ${ordinalHouse(primaryHouse)} house begins in ${cuspSign}, so ${rName} rules that story. ${capitalize(rName)} sits in ${rulerPlacement.rulerSign.toLowerCase()} in your ${ordinalHouse(rulerPlacement.rulerHouse)} house${rulerPlacement.rulerHouse === primaryHouse ? ", right where it governs, no detour needed" : `, of ${HOUSE_MEANINGS[rulerPlacement.rulerHouse - 1]?.title}`}, which means ${houseMeaning.rules} runs through ${rulerSignTraits?.essence || cuspTraits.essence}. ${capitalize(describeOccupants(houseTenants, meta.label, traitKey, rulerPlacement.rulerId))}.${archetypalAside} That's your signature here this szn, the specific mechanics of your own ${houseMeaning.title}.`
    : `${season.sign} season activates your ${ordinalHouse(primaryHouse)} house of ${houseMeaning.title}. ${cuspSign} on that house cusp means ${houseMeaning.rules} runs through ${cuspTraits.essence}.`;

  // The interpretive payoff, the 80%. Each paragraph answers one of the "why does this matter"
  // questions using the real chain, ruler-in-sign, ruler-in-house, season, tension, real life,
  // action, rather than defining planets and signs in isolation. Falls back gracefully when the
  // ruler somehow can't be resolved (it always can for a real chart), so the page never empties.
  const sameElement = !!(seasonOverview && rulerOverview && seasonOverview.element === rulerOverview.element);
  // Each paragraph below is only allowed to say a raw fact (ruler, sign, house) once, in the
  // signature above. From here every paragraph has to add something the signature didn't
  // already say, interpretation, not restatement, that's the difference between three shorter
  // versions of the same information and one synthesis that keeps building.
  const deepSynthesis: string[] = rulerPlacement && rulerSignTraits && rulerHouseMeaning
    ? [
        `That ${rulerPlacement.rulerSign.toLowerCase()} placement is the detail that changes everything about your ${meta.label}: it means your instinct here is ${cleanClause(rulerSignTraits.gift)}, and when you're stretched or scared, it tips into ${cleanClause(rulerSignTraits.shadow)}. The sign your ruler sits in is doing more to shape it than the cusp sign itself.`,
        `And that placement doesn't operate in a vacuum, it's physically wired into your ${ordinalHouse(rulerPlacement.rulerHouse)} house of ${rulerHouseMeaning.title}. That's why your ${meta.label} is never really separate from ${rulerHouseMeaning.lifeAreas.slice(0, 2).join(" and ")} for you: progress here tends to come through ${rulerHouseMeaning.lifeAreas[0]}, and stalls there too.`,
        `Here's what ${season.sign} season specifically does to a ${rulerPlacement.rulerSign.toLowerCase()} ${rName.replace(/^the /, "")} living in your ${ordinalHouse(rulerPlacement.rulerHouse)} house: ${
          sameElement
            ? `it shares the same ${rulerOverview?.element.toLowerCase() || "elemental"} current your ruler already runs on, so the season doesn't introduce anything new, it turns the volume up on what you're already built for. The season's push to ${focusLead(season)} lands directly inside ${rulerHouseMeaning.lifeAreas[0]}, amplifying the ${cleanClause(rulerSignTraits.gift)} that already defines how you handle ${meta.label}. The risk isn't struggle, it's coasting on what's already easy instead of actually using the momentum.`
            : `it pulls against your ruler's more ${rulerSignTraits.essence.split(",")[0]} default, so the season's push to ${focusLead(season)} doesn't land as gentle encouragement, it lands as real friction between what the season wants and what your ${rulerPlacement.rulerSign.toLowerCase()} ${rName.replace(/^the /, "")} was built for. That friction shows up specifically where ${rulerHouseMeaning.lifeAreas[0]} meets ${meta.label}: this season is asking your ${cuspSign.toLowerCase()}-cusp instinct here to move through a lens it doesn't naturally default to. That tension is the opportunity, as long as you don't just retreat to the comfortable pattern.`
        }`,
        `In real life over the next few weeks, expect ${meta.label} to keep surfacing through ${rulerHouseMeaning.lifeAreas[0]}, that's where the season will keep knocking. The move that works with your wiring instead of against it: lead with ${rulerSignTraits.gift.split(",")[0] || traitLine}, watch for the ${rulerSignTraits.shadow.split(".")[0].toLowerCase()} default, and let ${season.sign.toLowerCase()} szn's ${seasonTraits.gift.split(",")[0]} carry the part of this you've been avoiding. Small, specific, this week, not a someday overhaul.`,
      ]
    : [
        `${season.sign} season activates your ${ordinalHouse(primaryHouse)} house of ${houseMeaning.title}, the part of your chart that runs ${meta.label}. ${houseMeaning.coach}`,
        `This szn's job for you: ${season.focus} Point that at ${houseMeaning.lifeAreas[0]} specifically, and use the protocol below rather than just reading about it.`,
      ];

  // Fill the ascendant layer's synthesis now that the helpers and area label are in scope.
  if (ascendantLayer) {
    ascendantLayer.synthesis = renderAscendantSynthesis(ascendantLayer.sign, ascendantLayer.ruler, meta.label);
  }

  // The prioritisation lead: what to weight most in THIS chart, so the framework opens with
  // judgement rather than a flat list. Computed from stelliums, double-duty rulers, dignity, etc.
  const priorityLead = computePriorityLead(recipe, recipeHouses, planetLayers, meta.label);

  // The full framework, woven: every secondary/tertiary house gets its own complete chain, the
  // houses are then related as one story, each named planet layer is interpreted and connected to
  // its actual role, points and the ascendant are folded in, and the season is tied to the whole
  // thing at once. This is the generalised replacement for the old two-house axis, it scales from
  // one house (Home) to four (Business) without changing shape.
  const frameworkSynthesis: string[] = [
    // Index passed through so repeated boilerplate (empty-house, out-of-house planet) varies its
    // wording between houses and planets instead of repeating verbatim down the page.
    ...recipeHouses.slice(1).map((c, i) => renderHouseChainPara(c, meta.label, traitKey, i + 1)),
    ...(recipeHouses.length > 1 && recipe.axisFraming ? [renderRelationshipPara(recipe, recipeHouses)] : []),
    ...planetLayers.map((l, i) => renderPlanetPara(l, meta.label, recipe.houses, i)),
    ...(ascendantLayer ? [ascendantLayer.synthesis] : []),
    ...pointLayers.map((p) => p.synthesis),
    renderSeasonFrameworkPara(season, recipeHouses, meta.label),
  ];

  const quickContext = {
    house: `your ${ordinalHouse(primaryHouse)} house of ${houseMeaning.title}, ${houseMeaning.rules}`,
    cuspSign: `${cuspSign.toLowerCase()} on the cusp: ${cuspTraits.essence}`,
    ruler: rulerPlacement
      ? `ruled by ${rulerPlacement.rulerName.toLowerCase()}, in ${rulerPlacement.rulerSign.toLowerCase()}, in your ${ordinalHouse(rulerPlacement.rulerHouse)} house`
      : `${cuspSign.toLowerCase()} carries this house's whole story`,
  };

  return {
    id: areaId,
    label: meta.label,
    emoji: meta.emoji,
    house: primaryHouse,
    bodyLabel,
    sign,
    quickSummary: `${season.sign} activates your ${ordinalHouse(primaryHouse)} house of ${houseMeaning.title}, ${sign.toLowerCase()} ${bodyLabel} energy pointed straight at ${houseMeaning.lifeAreas[0]}.`,
    whatThisIsAbout: `${season.sign} szn puts real weight on ${meta.label}. This szn's core focus is simple: ${season.focus.toLowerCase()} Here's exactly how that plays out in this area of your life, and what it actually takes to change it, not just think about it. It shows up primarily through your ${ordinalHouse(primaryHouse)} house of ${houseMeaning.title}, which governs ${houseMeaning.lifeAreas.join(", ")}${
      secondaryHouseNumber && secondaryHouseMeaningRaw ? `, with your ${ordinalHouse(secondaryHouseNumber)} house of ${secondaryHouseMeaningRaw.title} adding a second layer on top of that` : ""
    }. Between the planet running this area, the sign it's expressed through, and the house it lives in, there are three separate layers of your own chart pointing at ${meta.label} this szn.`,
    planetMeaning: bodyMeaning?.deepDive || "",
    signMeaning: signOverview
      ? `${signOverview.archetype} That's ${sign.toLowerCase()} on its own, an element (${signOverview.element}), a modality (${signOverview.modality}) and a ruling planet, ${signOverview.ruler}, that together give it this specific texture.`
      : "",
    houseMeaning: { title: houseMeaning.title, text: houseMeaning.deepDive, naturalSign: houseMeaning.naturalSign },
    cuspSign,
    rulerPlacement,
    signature,
    deepSynthesis,
    quickContext,
    axisLabel: recipe.axisLabel,
    recipeHouses,
    planetLayers,
    pointLayers,
    ascendantLayer,
    priorityLead,
    frameworkSynthesis,
    // A short, accurate capsule, used standalone (e.g. the dashboard goal card) where this is
    // the only fragment of the reading shown, so it states the ruler correctly rather than
    // repeating the fuller signature/axis synthesis shown above it on this page.
    inYourChart: rulerPlacement
      ? `${rName} rules your ${meta.label} story from ${rulerPlacement.rulerSign.toLowerCase()} in your ${ordinalHouse(rulerPlacement.rulerHouse)} house${bodyIsRuler || bodyIsPoint ? "" : `, and your ${sign.toLowerCase()} ${bodyLabel} drives it right alongside`}. It lives through your ${ordinalHouse(primaryHouse)} house of ${houseMeaning.title}, ${houseMeaning.rules}, where ${describeOccupants(houseTenants, meta.label, traitKey, rulerPlacement.rulerId)}.${
          secondaryHouseNumber && secondaryHouseMeaningRaw ? ` Your ${ordinalHouse(secondaryHouseNumber)} house of ${secondaryHouseMeaningRaw.title} is the other half of this story, not a footnote.` : ""
        }${aspectSummaryLine}`
      : `Your ${sign.toLowerCase()} ${bodyLabel} lives in your ${ordinalHouse(primaryHouse)} house of ${houseMeaning.title}, ${houseMeaning.rules}.${aspectSummaryLine}`,
    natalAspectLines,
    bettysTake: content.bettysTake,
    blindSpot: BLIND_SPOT_TELLS[areaId] || "You're closer to seeing this pattern than you think, the fact that this section made you pause is the first clue.",
    rootPattern: `${content.rootFrame(blockText)}${
      secondaryHouseNumber && secondaryTenants.length > 0
        ? ` It compounds through your ${ordinalHouse(secondaryHouseNumber)} house too, where ${secondaryTenants.map((p) => p.name.toLowerCase()).join(" and ")} ${secondaryTenants.length > 1 ? "keep" : "keeps"} giving the same pattern a second stage to play out on, so this isn't a one-off trigger, it's a loop with two separate rooms in your chart to run through.`
        : ""
    }`,
    shiftBefore: content.shiftBefore,
    shiftAfter: content.shiftAfter,
    protocolTitle: content.protocolTitle,
    protocolDays: content.protocolDays,
    stretchMove,
    proofMarkers: content.proofMarkers,
    seasonEdge: `${houseMeaning.coach} With ${season.sign.toLowerCase()} energy activating this szn, this is the window to actually run the protocol instead of just reading about it.${
      secondaryHouseNumber && secondaryHouseMeaningRaw ? ` ${secondaryHouseMeaningRaw.coach}` : ""
    } Between both houses, the sign, and the ruling planet, this szn is giving you an unusually direct line into ${meta.label}, it's worth using it deliberately rather than letting it pass as background weather.`,
    goalTieIn,
    affirmations: extras.affirmations,
    activation: extras.activation,
    transitLine,
    transitLines,
  };
}
