import type { ChartData } from "@/types/chart";
import { SIGN_TRAITS, HOUSE_MEANINGS, findRootBlock, ordinalHouse, composeRulerPlacement, type RulerPlacement } from "@/lib/interpretations";

interface HouseContent {
  bettysTake: string;
  rootFrame: (blockTheme: string) => string;
  shiftBefore: string;
  shiftAfter: string;
  protocolTitle: string;
  protocolDays: string[]; // 5 days, escalating
  stretchMoves: string[]; // pick 1, seeded
  proofMarkers: string[]; // pick 3, seeded
  affirmations: string[];
}

const HOUSE_CONTENT: Record<number, HouseContent> = {
  1: {
    bettysTake: "Your first house isn't vanity, it's the first sentence of every story anyone tells about you before they know a single fact. Women who neglect this house wonder why they keep getting misread, and it's rarely a personality problem, it's an arrival problem, they're not showing up as the woman they actually are.",
    rootFrame: (b) => `The pattern quietly shaping your first impression isn't nerves, it's ${b} Editing your presentation won't fix this, the block underneath has to be worked directly.`,
    shiftBefore: "I need to feel fully ready before I let people see the real me.",
    shiftAfter: "The real me is the strongest possible first impression, readiness is a story I no longer need.",
    protocolTitle: "the 5-day presence reset",
    protocolDays: [
      "walk into one room today exactly as you are, no pre-editing your energy for the audience",
      "catch yourself softening your entrance once today, and don't, just once",
      "wear or say the thing that feels most like you, not most palatable, in one interaction today",
      "notice how you introduce yourself, and drop one unnecessary qualifier or apology from it",
      "ask someone who met you recently what their first impression actually was, and just listen",
    ],
    stretchMoves: [
      "walk into the room you've been dreading exactly as yourself, no armour, no performance",
      "introduce yourself with the title or claim you've been quietly avoiding saying out loud",
      "let someone see you mid-process, not just the polished result",
    ],
    proofMarkers: [
      "you stop rehearsing your entrance before you make it",
      "people start describing you the way you actually see yourself",
      "you catch the urge to shrink your presence and choose not to",
    ],
    affirmations: [
      "I arrive as myself, that's already enough of an entrance.",
      "My presence doesn't need permission to take up the space it takes up.",
      "The first impression I make is the truest one I have to give.",
    ],
  },
  2: {
    bettysTake: "Every money block I've ever coached a woman through turned out to be a worth block wearing a budgeting spreadsheet as a disguise. This house isn't really about the numbers, it's about what you've quietly decided you're allowed to have.",
    rootFrame: (b) => `The real ceiling on what you earn and keep isn't the market, it's ${b} No amount of budgeting fixes this, the belief underneath has to be met directly.`,
    shiftBefore: "My worth depends on proving myself before I can ask for more.",
    shiftAfter: "My worth was never up for negotiation, my price is allowed to reflect that starting now.",
    protocolTitle: "the 5-day worth audit",
    protocolDays: [
      "write down the actual number in every account, today, no rounding, no avoiding it",
      "name one thing you own or earn that you quietly feel guilty about, and sit with why",
      "state a price or a number out loud today without softening it with a nervous laugh",
      "list three things you'd buy, do or charge if worth was never a question",
      "spend on one thing today that feels expensive and good, on purpose, and notice the guilt without obeying it",
    ],
    stretchMoves: [
      "ask for the raise, rate or deal you've been putting off, this week",
      "cancel or renegotiate the one thing that's been quietly draining your resources",
      "buy the thing you've decided you don't deserve yet",
    ],
    proofMarkers: [
      "you check your balance without dread",
      "you state a number without an apologetic tone attached",
      "receiving something good stops triggering the urge to immediately give something back",
    ],
    affirmations: [
      "My worth was decided before the achievement, not earned by it.",
      "I build security through clarity, not through avoidance.",
      "What I have and what I earn are both allowed to grow at the same time.",
    ],
  },
  3: {
    bettysTake: "The women I coach who struggle to be heard usually aren't short on ideas, they're short on saying them before the thought's been polished into silence. Your third house wants the unfinished sentence, not the perfect one.",
    rootFrame: (b) => `What's actually keeping your voice smaller than your ideas isn't a communication skill gap, it's ${b} More practising the delivery won't fix this, the block underneath has to be named.`,
    shiftBefore: "I need to have the perfect words before I say anything.",
    shiftAfter: "My voice gets stronger by using it imperfectly, not by waiting for the polished version.",
    protocolTitle: "the 5-day voice rep",
    protocolDays: [
      "send the message you've been drafting in your head, exactly as it first came out, unedited",
      "say the true, slightly unpolished thing out loud to someone today instead of the safe version",
      "ask the question you've been sitting on instead of quietly researching around it",
      "post or share the half-formed idea instead of waiting until it's complete",
      "notice one moment today you stay quiet to avoid sounding uncertain, and speak anyway",
    ],
    stretchMoves: [
      "have the direct conversation you've been rehearsing instead of avoiding",
      "publish or send the unfinished piece of writing you've been sitting on",
      "call instead of text the one conversation you've been putting off in writing",
    ],
    proofMarkers: [
      "you send the message before you've reread it five times",
      "you finish more sentences instead of trailing off to soften them",
      "someone tells you they appreciate that you just said the thing",
    ],
    affirmations: [
      "My unfinished thought is more useful spoken than perfected in silence.",
      "I say what I mean the first time, refinement can happen after.",
      "My voice doesn't need permission to be heard mid-thought.",
    ],
  },
  4: {
    bettysTake: "I always ask a stuck client to describe her childhood kitchen. It's never really about the room, it's about what she learned there about whether it was safe to need things out loud. Fix that floor, and everything built on top of it gets steadier.",
    rootFrame: (b) => `The pattern actually running your sense of home and safety isn't your current circumstances, it's ${b} Redecorating won't touch this, the foundation itself has to be worked directly.`,
    shiftBefore: "I'll feel safe once my circumstances are finally stable.",
    shiftAfter: "I build safety from the inside first, my circumstances follow, not the other way round.",
    protocolTitle: "the 5-day foundation check",
    protocolDays: [
      "clear one surface in your home completely today, the one that's been bothering you most",
      "name one thing you learned about safety in your family of origin that you're ready to update",
      "spend one evening this week fully present at home, phone in another room",
      "add one thing to your space that makes it feel cared for, on purpose",
      "notice one moment today you brace for instability out of habit, even when nothing's actually wrong",
    ],
    stretchMoves: [
      "have the honest conversation about home or family you've been avoiding",
      "make the bigger change to your living space you've been putting off",
      "name the old family pattern out loud to someone you trust, once, clearly",
    ],
    proofMarkers: [
      "your shoulders actually drop when you walk into your space",
      "you tidy before it becomes a crisis, not after",
      "you notice yourself feeling settled without needing external proof that it's safe to",
    ],
    affirmations: [
      "My home is part of how I regulate myself, not a reflection of my chaos.",
      "I am allowed to build a foundation that looks nothing like the one I came from.",
      "Safety is something I can create, not just something I wait to receive.",
    ],
  },
  5: {
    bettysTake: "Joy gets treated like the reward you earn after the real work, and this house is proof that's backwards. Creativity, romance and play aren't the dessert, they're part of what keeps the rest of the plate from going stale.",
    rootFrame: (b) => `What's actually blocking your self-expression isn't a lack of talent, it's ${b} Waiting to feel more skilled won't fix this, the block has to be met directly, mid-creation.`,
    shiftBefore: "I need to be good at this before I'm allowed to enjoy it.",
    shiftAfter: "Joy is allowed before mastery, the pleasure is the point, not a prize I earn later.",
    protocolTitle: "the 5-day joy rep",
    protocolDays: [
      "make something today purely for the pleasure of it, with zero audience in mind",
      "flirt, play or be a little dramatic on purpose today, just because it's fun",
      "do the creative thing you've been too self-conscious to start, badly, on purpose",
      "spend twenty minutes today doing something with no productive outcome attached",
      "say yes to the invitation that sounds fun but slightly inconvenient",
    ],
    stretchMoves: [
      "share the creative thing you've been sitting on, unfinished, before it feels ready",
      "plan the romantic or playful gesture you've been talking yourself out of",
      "take up the hobby you've decided is a waste of time, once, properly",
    ],
    proofMarkers: [
      "you create something without immediately critiquing it",
      "play stops feeling like something you have to schedule and justify",
      "you notice yourself flirting with life again, not just performing productivity",
    ],
    affirmations: [
      "My joy doesn't need to be useful to be worth having.",
      "I create because it feels good, that's reason enough.",
      "Play is not a reward I earn, it's a need I honour.",
    ],
  },
  6: {
    bettysTake: "The women who finally get consistent aren't the ones with the strictest routine, they're the ones who stopped treating their own body and time like an enemy to manage. This house rewards devotion, not punishment.",
    rootFrame: (b) => `What's really running your relationship with routine and health isn't discipline, it's ${b} A stricter schedule won't fix this, the pattern underneath has to be addressed directly.`,
    shiftBefore: "I need to punish myself into consistency.",
    shiftAfter: "Consistency built on self-trust lasts, consistency built on self-punishment always eventually collapses.",
    protocolTitle: "the 5-day devotion reset",
    protocolDays: [
      "move today in a way that actually feels good, not the way you think you should",
      "eat one meal slowly today, without a screen, and notice how it actually tastes",
      "go to bed 30 minutes earlier tonight, protect it like an appointment",
      "book or complete the health thing you've been avoiding, the appointment, the check-up",
      "do one small, repeated act of care for yourself today with zero guilt attached",
    ],
    stretchMoves: [
      "take a full rest day with zero justification required",
      "try the type of movement you've been curious about but too self-conscious to start",
      "have the honest conversation with a professional about the health thing you've been minimising",
    ],
    proofMarkers: [
      "you move because it feels good, not because you're being punished for something",
      "rest stops feeling like something to earn first",
      "you notice hunger, tiredness or tension earlier, before it becomes a crisis",
    ],
    affirmations: [
      "My body is a partner to listen to, not a project to fix.",
      "Small repeated acts of care are how I actually build a life I trust.",
      "Rest is information, not a reward I have to earn.",
    ],
  },
  7: {
    bettysTake: "The standards you won't say out loud aren't standards, they're private opinions, and this house has a way of mirroring exactly that back to you through the people you attract. Fix the mirror by becoming someone who voices what she actually wants.",
    rootFrame: (b) => `The pattern actually shaping your closest partnerships isn't who you keep choosing, it's ${b} Better taste in people won't fix this on its own, the pattern has to be met directly.`,
    shiftBefore: "I need to earn commitment by being easy, agreeable or endlessly accommodating.",
    shiftAfter: "I am allowed to take up space in my partnerships, the right person stays for the real me.",
    protocolTitle: "the 5-day honesty rep",
    protocolDays: [
      "notice one moment today you agree to something you don't actually want, and name it to yourself",
      "say one true, slightly uncomfortable thing to your partner or a close ally today",
      "ask for something you need directly, no hinting, no over-explaining, just the ask",
      "spend real, undistracted time with the person who matters most, actual presence, not a passing reply",
      "say no to one thing in a relationship that doesn't serve you, and notice it survives",
    ],
    stretchMoves: [
      "have the direct conversation about the relationship terms that have been quietly bothering you",
      "end or seriously renegotiate the arrangement that's been costing you",
      "tell someone exactly what you need from them, without softening it into a suggestion",
    ],
    proofMarkers: [
      "you say no without the three-paragraph justification that used to follow it",
      "a hard conversation happens and the relationship gets stronger, not weaker",
      "you notice yourself asking for what you want before you've talked yourself out of it",
    ],
    affirmations: [
      "My honest preference is not a conflict, it's clarity someone needed.",
      "I attract partnership at the level I actually believe I deserve.",
      "The right person wants the real negotiation, not the performance of ease.",
    ],
  },
  8: {
    bettysTake: "Nothing in this house responds to being managed from a safe distance. It's the one place surface-level effort visibly fails, which is exactly why most people avoid it until they can't anymore.",
    rootFrame: (b) => `What's actually keeping this area shallow isn't circumstance, it's ${b} Managing it from a distance won't work here, this house only responds to going all the way in.`,
    shiftBefore: "Ease here means I haven't earned it through struggle first.",
    shiftAfter: "I don't have to earn depth through hardship, I can choose it directly, on purpose.",
    protocolTitle: "the 5-day depth practice",
    protocolDays: [
      "let someone see the unfinished, unpolished version of you in one interaction today",
      "have the honest conversation about money, intimacy or power you've been circling",
      "name the thing you're avoiding entering fully, in writing, just for yourself",
      "let go of control over one outcome this week, on purpose, and notice what happens",
      "ask for the depth you actually want in a relationship instead of settling for the surface",
    ],
    stretchMoves: [
      "have the full, unguarded version of the conversation you've been keeping at arm's length",
      "merge something, finances, a project, a commitment, that you've been keeping deliberately separate",
      "let a difficult transformation actually complete instead of managing it indefinitely",
    ],
    proofMarkers: [
      "you let something be simple without needing to earn it the hard way first",
      "you notice yourself trusting instead of controlling an outcome",
      "intimacy stops feeling like a risk you have to brace for",
    ],
    affirmations: [
      "Ease is not something I have to earn through struggle first.",
      "My depth is an invitation, not a wall.",
      "I can let this be transformed completely and come back with real power, not the performance of it.",
    ],
  },
  9: {
    bettysTake: "This house doesn't want your comfortable opinions, it wants the belief system you're actually still building. Most people stop expanding the moment their worldview gets convenient, this house is the invitation to keep going.",
    rootFrame: (b) => `What's actually keeping your world small isn't circumstance, it's ${b} More research won't fix this, the block has to be met by actually going, not just planning to.`,
    shiftBefore: "I need to know everything before I commit to a belief, a trip or a bigger vision.",
    shiftAfter: "My worldview expands through action and experience, not through certainty gathered in advance.",
    protocolTitle: "the 5-day horizon check",
    protocolDays: [
      "read, watch or listen to something today that challenges how small you've been thinking",
      "book or plan the trip, course or experience you've been putting off researching to death",
      "have a real conversation with someone whose worldview genuinely differs from yours",
      "write down the belief you've outgrown but are still quietly operating from",
      "say the bigger vision out loud to someone today instead of keeping it private",
    ],
    stretchMoves: [
      "book the trip, the course or the leap you've been endlessly researching instead of taking",
      "publish or teach the thing you know, even before you feel like enough of an expert",
      "commit publicly to the bigger vision you've been quietly downsizing to feel safe",
    ],
    proofMarkers: [
      "you take the trip or the leap instead of researching it one more time",
      "your opinions start coming from lived experience, not just theory",
      "the bigger vision starts feeling like a plan instead of a daydream",
    ],
    affirmations: [
      "My worldview grows through experience, not just through more research.",
      "I am allowed to think bigger than what currently feels safe.",
      "The horizon expands the moment I actually move toward it.",
    ],
  },
  10: {
    bettysTake: "Every ambitious woman I've coached hits the same wall eventually, she's outgrown the strategy that got her here but keeps using it anyway, because it's familiar. This house doesn't reward the safest version of your reputation, it rewards the one you're actually building toward.",
    rootFrame: (b) => `The thing quietly capping your public reputation isn't your ability, it's ${b} Strategy alone won't fix this, the block has to be worked directly.`,
    shiftBefore: "I need permission or perfect conditions before I claim what I'm building toward.",
    shiftAfter: "I create the conditions by moving, the permission I'm waiting for is mine to give myself.",
    protocolTitle: "the 5-day legacy sprint",
    protocolDays: [
      "write down the single move that would shift your reputation most if you actually made it",
      "spend 90 focused minutes on that move only, protected like a client meeting",
      "send the pitch, application or proposal you've been sitting on, imperfect draft included",
      "raise one price, rate or ask by 10% and hold the line without over-explaining it",
      "tell one person in your field what you're actually building toward, out loud",
    ],
    stretchMoves: [
      "publicly claim the expertise or title you've been quietly downplaying",
      "have the direct conversation about recognition, pay or promotion you've been avoiding",
      "apply, pitch or launch the thing you've been 'almost ready' for, on a date you commit to now",
    ],
    proofMarkers: [
      "you finish the project you named instead of starting three new ones",
      "an ask or pitch goes out that used to sit in drafts for weeks",
      "you notice yourself negotiating instead of accepting the first offer",
    ],
    affirmations: [
      "My reputation grows when I stop asking permission and start asking for more.",
      "I am already the authority I keep waiting to feel like.",
      "What I'm becoming known for is mine to decide, starting now.",
    ],
  },
  11: {
    bettysTake: "Your network genuinely is your net worth in this house, but not in the transactional way that phrase usually gets used. It's about which community actually energises you versus which one you've just been maintaining out of habit.",
    rootFrame: (b) => `What's actually limiting your community and future vision isn't a lack of connections, it's ${b} More networking won't fix this, the pattern has to be addressed directly.`,
    shiftBefore: "I need to belong everywhere to be safe.",
    shiftAfter: "I build the specific community that actually energises me, belonging everywhere was never the goal.",
    protocolTitle: "the 5-day community audit",
    protocolDays: [
      "name one community or friendship that's been quietly draining rather than energising you",
      "reach out to someone outside your usual circle today, just to connect",
      "share the vision for your future with someone who'll actually take it seriously",
      "say no to one social obligation that doesn't serve who you're becoming",
      "spend real time today with the people who actually see where you're headed",
    ],
    stretchMoves: [
      "step back from the community or group that no longer matches who you're becoming",
      "join or build the community you've been quietly wishing existed",
      "share the future vision publicly instead of keeping it private out of fear of judgement",
    ],
    proofMarkers: [
      "you notice which rooms actually energise you versus which ones just fill time",
      "your circle starts reflecting who you're becoming, not who you used to be",
      "sharing your future vision feels like less of a risk each time you do it",
    ],
    affirmations: [
      "My network is built on genuine energy, not just history.",
      "I am allowed to outgrow communities that no longer reflect who I'm becoming.",
      "The future I'm building deserves people who actually see it.",
    ],
  },
  12: {
    bettysTake: "This is the one house most chart readings skip past, because it operates below conscious awareness until you deliberately go looking. Healing here changes everything built on top of it, which is exactly why it's worth the trip.",
    rootFrame: (b) => `What's actually running your relationship with rest and release isn't busyness, it's ${b} More output won't fix this, only slowing down enough to actually meet it will.`,
    shiftBefore: "I need more proof or certainty before I trust what's happening beneath the surface.",
    shiftAfter: "My intuition and my subconscious patterns are data I already have, the proof shows up after I trust it.",
    protocolTitle: "the 5-day inner listening practice",
    protocolDays: [
      "sit in silence for five minutes today, no phone, and notice what surfaces once the noise clears",
      "write down one nudge or gut feeling you've been ignoring, and one small step toward honouring it",
      "let yourself rest today without justifying it to anyone, including yourself",
      "notice one moment you override your gut with logic, and name it, even if you don't change the decision yet",
      "do one small ritual on purpose, a candle, journalling, a full moon release, whatever actually works for you",
    ],
    stretchMoves: [
      "take a full day with meaningfully less noise, less scrolling, less input, and notice what surfaces",
      "act on the nudge you've been overriding with logic for weeks",
      "name the pattern that's been running below the surface, out loud, to someone who'll actually hear it",
    ],
    proofMarkers: [
      "you notice the gut feeling before the anxious overthinking arrives to argue with it",
      "rest stops feeling like something you have to earn first",
      "silence starts to feel restful instead of uncomfortable",
    ],
    affirmations: [
      "My intuition is data I already have, the proof arrives after I trust it.",
      "Rest is where my healing actually happens, not a delay of it.",
      "What's beneath the surface is allowed to be seen, in my own time.",
    ],
  },
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function pickMany<T>(arr: T[], seed: number, count: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < count && i < arr.length; i++) out.push(arr[(seed + i) % arr.length]);
  return out;
}

function seedFrom(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}

export interface HouseDeepDive {
  house: number;
  title: string;
  cuspSign: string;
  naturalSign: string;
  rulerLine: string; // compares the house's natural sign to the actual cusp sign
  rulerPlacement: RulerPlacement | null; // the planet that actually rules the cusp sign, and where it natally sits
  bettysTake: string;
  rootPattern: string;
  shiftBefore: string;
  shiftAfter: string;
  protocolTitle: string;
  protocolDays: string[];
  stretchMove: string;
  proofMarkers: string[];
  affirmations: string[];
}

export function composeHouseDeepDive(houseNum: number, chart: ChartData): HouseDeepDive | null {
  const meaning = houseNum >= 1 && houseNum <= 12 ? HOUSE_MEANINGS[houseNum - 1] : undefined;
  const content = HOUSE_CONTENT[houseNum];
  if (!meaning || !content) return null;

  const cusp = chart.houses[houseNum - 1];
  const cuspSign = cusp.sign;
  const cuspTraits = SIGN_TRAITS[cuspSign] || SIGN_TRAITS.Leo;
  const naturalTraits = SIGN_TRAITS[meaning.naturalSign] || SIGN_TRAITS.Leo;
  const planetsInside = chart.planets.filter((p) => p.house === houseNum);

  const rulerLine =
    cuspSign === meaning.naturalSign
      ? `Your ${ordinalHouse(houseNum)} house has ${cuspSign.toLowerCase()} right where it naturally belongs, no translation layer here, this house runs exactly the way the textbook says it should, undiluted.`
      : `Naturally this house runs on ${meaning.naturalSign.toLowerCase()} energy, ${naturalTraits.essence}. Yours has ${cuspSign.toLowerCase()} on the door instead, ${cuspTraits.essence}, which means you experience ${meaning.lifeAreas[0]} through a noticeably different lens than the classic textbook version of this house.`;

  const rulerPlacement = composeRulerPlacement(cuspSign, houseNum, chart);

  const seed = seedFrom(`house${houseNum}-${cuspSign}-${chart.birthData.name}`);
  const stretchMove = pick(content.stretchMoves, seed);
  const proofMarkers = pickMany(content.proofMarkers, seed + 1, 3);

  const blockText =
    planetsInside.length > 0
      ? findRootBlock(chart, planetsInside[0].id, cuspSign)
      : `the shadow side of your own ${cuspSign.toLowerCase()} energy running this house unchecked: ${cuspTraits.shadow}`;

  return {
    house: houseNum,
    title: meaning.title,
    cuspSign,
    naturalSign: meaning.naturalSign,
    rulerLine,
    rulerPlacement,
    bettysTake: content.bettysTake,
    rootPattern: content.rootFrame(blockText),
    shiftBefore: content.shiftBefore,
    shiftAfter: content.shiftAfter,
    protocolTitle: content.protocolTitle,
    protocolDays: content.protocolDays,
    stretchMove,
    proofMarkers,
    affirmations: content.affirmations,
  };
}
