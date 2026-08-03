// The "what it all means" layer for Human Design, written in the MY SZN voice:
// warm, practical, coaching-first. Every element leads with what it means for you
// and how to actually use it, the same way BODY_MEANINGS reads the astrology chart.
//
// House rules for this copy: no em dashes anywhere, no rhetorical questions. Second
// person throughout. Explanation is kept light, the weight is on application.

import type {
  HDTypeName,
  HDAuthorityKey,
  HDDefinition,
  HDCrossAngle,
} from "@/types/human-design";
import type { CenterKey } from "@/lib/human-design-constants";

export interface MeaningBlock {
  title: string; // plain-English label
  intro: string; // one punchy line
  meaning: string; // what it's / what it means for you
  apply: string; // how to work with it day to day
}

// ── TYPE ──────────────────────────────────────────────────────────────────────
export const TYPE_CONTENT: Record<HDTypeName, MeaningBlock> = {
  Manifestor: {
    title: "the initiator",
    intro: "You're here to start things, not to wait for permission to begin.",
    meaning:
      "You don't need a cue. You feel the urge and you move, and that isn't impatience, it's the design. Your energy is closed and fast, which is why people find you a lot and follow you anyway. Around 9% of people work like this. The world is built for the other 91%, which is exactly why you keep being the one who starts it.",
    apply:
      "Inform the people your action affects before you act, not to ask permission, but to remove the resistance that used to blindside you. When you tell people what you're about to do, they get on board instead of pushing back. Protect your independence and let yourself rest hard between bursts.",
  },
  Generator: {
    title: "the builder",
    intro: "You're the life force, built to master what genuinely lights you up.",
    meaning:
      "You've got a Sacral, a renewable engine that only fires for work you actually want. On the right thing you're inexhaustible, and people feel it across a room. On the wrong thing you go flat and call it laziness. It isn't laziness, it's your body refusing to fund something that was never yours. About 37% of people are Generators, and you're the reason anything gets built at all.",
    apply:
      "Stop conjuring things out of nowhere. Wait for something to respond to, a request, an opening, a gut yes, then throw the whole engine at it. If the energy isn't there, that's your body answering, not you being lazy. Treat frustration as information that you're on the wrong thing, not as a character flaw to push through.",
  },
  "Manifesting Generator": {
    title: "the multi-passionate powerhouse",
    intro: "You're built to move fast, skip steps, and do more than one thing at once.",
    meaning:
      "You've got the Generator engine plus a motor wired straight to your Throat, so you start faster and carry more at once. You're not scattered. You're efficient in a way linear people can't follow, which is their problem and has somehow been treated as yours. About 33% of people share this design, and most of them spend years apologising for their own speed.",
    apply:
      "Respond first like a Generator, wait for the yes, then inform people before you leap so your speed doesn't leave them behind. Let yourself have several passions at once instead of forcing yourself to pick one. Skipping steps is a feature, not a flaw, as long as you circle back for anything that actually mattered.",
  },
  Projector: {
    title: "the guide",
    intro: "You're here to see people and systems clearly, and to be invited to lead.",
    meaning:
      "You don't have consistent life force. You have penetrating sight. You can see how someone works, where their energy is leaking and how it could go better, before they can see it themselves. Pushed at people, that gift gets resented. Invited, it's the most valuable thing in the room. About 20% of people are Projectors, and most of them exhaust themselves trying to prove their worth by output instead.",
    apply:
      "Wait for the invitation on the big things: work, love, recognition. Invited energy gets received, uninvited energy gets resented, and that's the entire difference. Guard your energy hard, because you were never built for full days and pretending otherwise is what flattens you. Go deep on what you love until your insight is the thing people come asking for.",
  },
  Reflector: {
    title: "the mirror",
    intro: "You're a rare barometer, reflecting the health of everything around you.",
    meaning:
      "You've got no consistently defined centres, so you take in the room and hand it back amplified. You're a mirror, which makes you unusually wise about people and unusually affected by them. Who you spend your time with isn't a preference for you, it's the whole design. Only about 1% of people are Reflectors, so nobody has ever handed you a rulebook that actually fits.",
    apply:
      "Your environment is the decision. Choose your people and your places with real care, because you become them. Give the big calls a full lunar cycle, about 28 days, so you feel the choice from every angle before you commit to it. And stop expecting to feel the same two days running, that changeability is the design working, not you being unreliable.",
  },
};

// ── STRATEGY (paired to type, kept short, the type block carries the depth) ─────
export const STRATEGY_APPLY: Record<HDTypeName, string> = {
  Manifestor: "Feel the urge, inform the people it touches, then act.",
  Generator: "Wait for something to respond to, then follow your gut yes.",
  "Manifesting Generator": "Respond, get the gut yes, inform, then move fast.",
  Projector: "Wait to be seen and invited, then share what you see.",
  Reflector: "Wait a lunar cycle before any major decision.",
};

// ── AUTHORITY (how you make decisions, the most practical piece) ────────────────
export const AUTHORITY_CONTENT: Record<HDAuthorityKey, MeaningBlock> = {
  emotional: {
    title: "emotional authority",
    intro: "There's no truth in the now, sleep on everything that matters.",
    meaning:
      "Your Solar Plexus is defined, so you experience emotions as a wave that rises and falls over time. Your clarity isn't in the moment, it's in the pattern across the wave. A yes at the peak and a no in the trough are both distortions.",
    apply:
      "Never decide anything that matters on the spot. Give it a night, then notice how it feels high, low and flat. If it's still a yes across all three, it's real. Buy yourself the room with one line: I will let you know tomorrow. Anyone who can't wait a day for your answer was never going to respect it anyway.",
  },
  sacral: {
    title: "sacral authority",
    intro: "Your gut answers in the moment, in sounds before words.",
    meaning:
      "Your Sacral responds instantly to what's in front of you, a rise of energy for yes and a contraction for no. It speaks in gut sounds and body pull, not in reasoned arguments. The mind will try to talk you out of it, the body already knew.",
    apply:
      "Ask people to put it to you as a yes or no, then listen for the response your body makes before your head arrives. A real yes has lift behind it. A real no goes flat. Trust the sound your body made over the paragraph your mind is about to write to justify the opposite.",
  },
  splenic: {
    title: "splenic authority",
    intro: "Your knowing is instant, quiet, and only speaks once.",
    meaning:
      "Your Spleen gives you in-the-moment intuition, a subtle, immediate sense of what's right for your health, safety and timing. It's quiet and it doesn't repeat itself, so it's easy to override with logic and then regret it.",
    apply:
      "Act on the first quiet hit. It won't argue its case and it won't say it twice, so waiting for proof means losing it. Practise catching it on small things so you already trust it when the stakes are high. When something feels off, honour it, and stop making yourself produce a reason first.",
  },
  ego: {
    title: "ego authority",
    intro: "Follow what you genuinely have the willpower and want for.",
    meaning:
      "Your decisions run through your Heart, the centre of willpower, worth and desire. The real question underneath every choice is whether you actually want it and have the heart to see it through, not whether you should.",
    apply:
      "Listen to what you blurt out before you tidy it up, because your voice gives away what your heart wants faster than your reasoning does. Commit only to what you actually want and have the will to finish. Walk away from the rest without building a case for it first.",
  },
  self: {
    title: "self-projected authority",
    intro: "You hear your truth when you talk it out loud.",
    meaning:
      "Your authority runs through the G centre, your identity and direction, and it comes out through your voice. You don't think your way to clarity, you speak your way there. What you say reveals whether a choice fits who you actually are.",
    apply:
      "Talk it through with people who let you speak without steering you. You're not after their advice, you're listening to your own voice for the thing that rings true. Notice which direction your words keep pulling toward, and go that way.",
  },
  mental: {
    title: "mental / environmental authority",
    intro: "You find clarity by talking it out in the right rooms.",
    meaning:
      "You've got no single inner authority, so you're designed to reach clarity through open conversation in the right environment. You're a sounding board by design, your wisdom emerges out loud, over time, with people you trust.",
    apply:
      "Talk it through with a few people you trust, and notice how you sound in different rooms, because the room is doing more work than you think. Don't rush it. Let the answer surface across several conversations instead of forcing one to produce it.",
  },
  lunar: {
    title: "lunar authority",
    intro: "Give the big things a full month before you decide.",
    meaning:
      "As a Reflector, your clarity comes over a full lunar cycle. Because you sample the energy around you, a decision needs to be felt across roughly 28 days, through every mood and every environment, before it's truly yours.",
    apply:
      "Never let anyone rush you into a major yes. Talk the decision through with different people over about a month and watch how it feels as the cycle turns. The clarity that lasts the whole month is the one to trust.",
  },
};

// ── PROFILE (your role, personality line / design line) ─────────────────────────
export const PROFILE_CONTENT: Record<string, MeaningBlock> = {
  "1/3": {
    title: "the investigator / martyr",
    intro: "You need solid foundations, and you learn everything by trying it.",
    meaning:
      "Line 1 needs to feel secure through knowing, you dig until you've got a foundation under your feet. Line 3 learns through trial and error, bumping into what doesn't work until you find what does. Together you're a researcher who tests everything in real life.",
    apply:
      "Give yourself full permission to study deeply before you feel ready, that isn't procrastination, it's your foundation. Treat every misstep as data, not failure, because your wisdom is built from what didn't work.",
  },
  "1/4": {
    title: "the investigator / opportunist",
    intro: "You build deep foundations, then share them through your network.",
    meaning:
      "Line 1 needs to know its subject inside out to feel secure. Line 4 lives through relationships, your opportunities come through the people you already know. You're the expert whose next door opens through a warm connection, not a cold pitch.",
    apply:
      "Do the deep study first so you've got real authority, then nurture your friendships and network, because that's how your work travels. Your next opportunity is almost always one relationship away, so tend those bonds.",
  },
  "2/4": {
    title: "the hermit / opportunist",
    intro: "You've got natural gifts, and you need both alone time and your people.",
    meaning:
      "Line 2 carries talents you didn't have to work for, and it needs regular time alone to recharge and to let those gifts develop. Line 4 thrives through your network. You get called out of your cave by the people who see what you've got.",
    apply:
      "Protect your alone time without guilt, it's where your gift lives. Trust the people who name your talents and pull you into opportunities, your best chances come through being recognised, not through chasing.",
  },
  "2/5": {
    title: "the hermit / heretic",
    intro: "You're a natural talent that people project their hopes onto.",
    meaning:
      "Line 2 needs solitude and holds gifts that feel effortless to you. Line 5 gets projected onto, people expect you to have practical solutions and to save the day. You're the reluctant, gifted problem-solver others keep reaching for.",
    apply:
      "Guard your alone time, and be intentional about what you say yes to, because people will pile expectations on you. Deliver when you genuinely can, and be honest when you can't, so the projection doesn't run your life.",
  },
  "3/5": {
    title: "the martyr / heretic",
    intro: "You learn by doing, then teach the world what actually works.",
    meaning:
      "Line 3 experiments relentlessly, finding truth by discovering what fails. Line 5 is projected onto as a practical saviour and a universal fixer. You turn hard-won, real-life lessons into solutions other people can use.",
    apply:
      "Reframe trial and error as your method, not your shortcoming, your credibility comes from having actually lived it. Manage what people expect of you, promise only what you can deliver, and let your practical wisdom do the talking.",
  },
  "3/6": {
    title: "the martyr / role model",
    intro: "You experiment hard early, then become the example.",
    meaning:
      "Line 3 learns through trial and error. Line 6 lives in three phases, a trial-heavy first act, a period on the roof observing, and a mature act as a role model. Early life is messy on purpose, it's building the wisdom you'll later embody.",
    apply:
      "Be gentle with yourself through the trial-and-error years, you're gathering the material for who you become. As you mature, notice that people learn from watching you, so living your truth openly is the work.",
  },
  "4/6": {
    title: "the opportunist / role model",
    intro: "You lead through relationships, and you become the example over time.",
    meaning:
      "Line 4 moves through networks, your life unfolds through the people you're bonded to. Line 6 grows into a role model across three life phases. You're here to build genuine relationships and, in time, to embody what you've learned for others.",
    apply:
      "Invest in real, loyal relationships, they're your platform and your path. Live in a way you would be proud for others to copy, because with a 6 line, people are watching and learning from how you do it.",
  },
  "4/1": {
    title: "the opportunist / investigator",
    intro: "You're a fixed point, deeply grounded and here to influence your network.",
    meaning:
      "This is the one Juxtaposition profile, unusually fixed in how it operates. Line 4 lives through relationships, line 1 needs a deep foundation of knowledge. You've got a stable, almost non-negotiable way of being that influences the people around you.",
    apply:
      "Build your expertise deeply, then let it move through your close network. You're not built to be endlessly flexible, so honour your fixed nature and surround yourself with people who value exactly how you're built.",
  },
  "5/1": {
    title: "the heretic / investigator",
    intro: "People look to you for solutions, and you make sure you've got them.",
    meaning:
      "Line 5 is projected onto as a practical rescuer, people expect you to fix things. Line 1 needs a solid foundation of knowledge to feel secure. You're the trusted expert people call in a crisis, precisely because you've done the work underneath.",
    apply:
      "Do the deep study so your solutions are real, then be deliberate about which problems you take on. Watch the projections, people will make you their hero or their scapegoat, so protect your reputation by delivering only what you truly can.",
  },
  "5/2": {
    title: "the heretic / hermit",
    intro: "A natural talent the world keeps calling on to save the day.",
    meaning:
      "Line 5 gets projected onto as a universal problem-solver. Line 2 holds effortless gifts and needs solitude. You've got real talent that people keep pulling you out of your cave to use, whether or not you asked to be the one.",
    apply:
      "Protect your alone time, it's non-negotiable for you, and choose your rescues carefully. Let the right people call you out for the right things, and give yourself full permission to say no to the rest.",
  },
  "6/2": {
    title: "the role model / hermit",
    intro: "You're here to become the example, in your own time.",
    meaning:
      "Line 6 matures through three life phases into a role model. Line 2 carries natural gifts and needs solitude. You're building, quietly, toward embodying a way of living that others will learn from simply by watching you.",
    apply:
      "Honour your need for alone time as you grow into yourself. Trust that you don't have to force your impact, in time people will look to how you live, so keep living toward your own truth.",
  },
  "6/3": {
    title: "the role model / martyr",
    intro: "You live it all the way through, then become the proof it can be done.",
    meaning:
      "Line 6 grows into a role model across three phases. Line 3 learns by trial and error. You go through more than most, and that lived experience is exactly what makes you a believable, grounded example later on.",
    apply:
      "Let the early experimentation happen without shame, it's building your authority. As you mature, share what you've learned openly, because your real-life story is what makes you someone others trust and follow.",
  },
};

// ── DEFINITION (how your energy is wired together) ──────────────────────────────
export const DEFINITION_CONTENT: Record<HDDefinition, MeaningBlock> = {
  "Single Definition": {
    title: "single definition",
    intro: "Your energy is self-contained, you don't need anyone to feel whole.",
    meaning:
      "All of your defined centres are wired together in one connected piece. Your inner processing is consistent and independent, you come to your own conclusions without needing another person to complete the circuit.",
    apply:
      "Trust your own counsel, you're built to process alone and land steadily. Just make sure you stay open to others, self-sufficiency can tip into isolation if you let it.",
  },
  "Split Definition": {
    title: "split definition",
    intro: "You've got two energy islands, and you seek the people who bridge them.",
    meaning:
      "Your defined centres form two separate groups. You can feel a slight internal gap, and you're naturally drawn to people whose energy connects your two sides, which is part of why relationships feel so significant to you.",
    apply:
      "Notice who makes you feel more whole and integrated, those people bridge your split. Give yourself time to connect your own two sides before deciding, and don't mistake the pull toward bridgers for needing anyone to be complete.",
  },
  "Triple Split Definition": {
    title: "triple split definition",
    intro: "You think in three streams, and you process best while busy.",
    meaning:
      "Your defined centres form three separate groups, so your inner world has more moving parts. You need variety and activity to feel settled, and clarity comes through a range of people and inputs, never just one.",
    apply:
      "Let yourself stay busy and take your time with decisions, your clarity arrives through movement and many angles. A wide circle of people serves you more than leaning on any single person.",
  },
  "Quadruple Split Definition": {
    title: "quadruple split definition",
    intro: "You're a mosaic, wired for lots of people and lots of stimulation.",
    meaning:
      "Your defined centres form four separate groups, the most independent wiring there is. You process life through a great deal of input and are highly self-reliant, though it can take longer for everything to line up inside.",
    apply:
      "Surround yourself with variety and plenty of people, that's genuinely how you integrate. Be patient with your own process, and resist the urge to force a decision before all your parts agree.",
  },
  "No Definition": {
    title: "no definition",
    intro: "You're open all the way through, sampling the energy around you.",
    meaning:
      "With no consistently defined centres, you take in and reflect the energy of your environment. This is the Reflector's wiring, wise, sensitive and highly responsive to where and who you're around.",
    apply:
      "Choose your environments and people deliberately, they shape your entire experience. Give decisions time and space, and let your changeability be information rather than something to fix.",
  },
};

// ── CENTRES (the nine, defined vs open) ─────────────────────────────────────────
export interface CenterContent {
  name: string;
  theme: string;
  defined: string; // what a defined centre gives you + how to use it
  open: string; // what an open centre means + how to work with it
}

export const CENTER_CONTENT: Record<CenterKey, CenterContent> = {
  head: {
    name: "Head",
    theme: "inspiration and mental pressure",
    defined:
      "You've got a consistent source of inspiration and ideas, and a steady mental pressure to make sense of things. You can inspire others with the questions you ask. Follow the ideas that genuinely excite you and let the rest go.",
    open:
      "You take in and amplify other people's questions and mental pressure, which can lead to overthinking things that aren't even yours to solve. Learn to tell your questions from everyone else's, and only chase the ones that actually matter to you.",
  },
  ajna: {
    name: "Ajna",
    theme: "how you think and conceptualise",
    defined:
      "You've got a fixed, reliable way of processing information and forming views, which makes you mentally consistent and dependable. Trust your framework, and stay willing to update it so certainty doesn't harden into rigidity.",
    open:
      "You think flexibly and can hold many perspectives, but the pressure to seem certain is constant. You don't have to have fixed opinions, your gift is open-mindedness. Get comfortable saying I am still thinking about it.",
  },
  throat: {
    name: "Throat",
    theme: "communication and manifestation",
    defined:
      "You've got a reliable voice and a consistent way of expressing and getting things done. Use it with your strategy and authority so you speak and act at the right time, rather than just because you can.",
    open:
      "You can channel many ways of expressing yourself, but the pull to speak just to get noticed is strong. Let yourself be invited or wait for the right moment, the words land far better when you're not forcing them.",
  },
  g: {
    name: "G (Identity)",
    theme: "identity, direction and love",
    defined:
      "You've got a fixed sense of who you're and where you're going, a steady inner compass. Trust your own direction, it doesn't tend to waver, and let others feel stabilised by it.",
    open:
      "Your sense of identity and direction is fluid and shaped by where and who you're around, which makes you adaptable and a beautiful mirror for others. Choose your environments with care, and stop pressuring yourself to have it all figured out.",
  },
  heart: {
    name: "Heart (Ego / Will)",
    theme: "willpower, worth and desire",
    defined:
      "You've got reliable willpower and can make and keep promises when you genuinely want to. Use it on what you truly desire, and let yourself rest, even a strong heart isn't meant to prove itself endlessly.",
    open:
      "You don't have consistent willpower on tap, so stop trying to prove your worth through what you can push through. Your value isn't something you have to earn. Make fewer hard promises, and drop the need to prove anything.",
  },
  sacral: {
    name: "Sacral",
    theme: "life force, work and energy",
    defined:
      "You've got a deep, renewable engine of energy for the work and life you love, and it's meant to be used until it's genuinely spent each day. Spend it on what lights you up, and honour the gut yes and no it gives you.",
    open:
      "You don't have consistent life-force energy, so you're not built to grind full days like a Generator. You can amplify others' energy and overwork without noticing. Learn when enough is enough, and rest before you're empty.",
  },
  solarplexus: {
    name: "Solar Plexus",
    theme: "emotions and feeling",
    defined:
      "You experience life as an emotional wave that moves through highs and lows over time, and this is your decision-making authority. There's no truth in the now, wait for the wave to settle before you commit to anything big.",
    open:
      "You absorb and amplify the emotions in the room, which can make you avoid conflict to keep the peace. Remember that much of what you feel isn't yours. Don't make decisions to escape emotional tension, and give the feeling time to pass through.",
  },
  spleen: {
    name: "Spleen",
    theme: "intuition, health and survival",
    defined:
      "You've got a consistent, quiet intuition and a steady instinct for health and safety. Trust the first soft signal, it's right, and it won't repeat itself, so act on it.",
    open:
      "You can become wise about health and survival, but you'll hold on to people, habits or situations that aren't good for you out of fear of letting go. Notice what you're gripping from fear, and practise releasing what's no longer healthy.",
  },
  root: {
    name: "Root",
    theme: "pressure, drive and adrenaline",
    defined:
      "You handle pressure and stress in a steady, reliable way, with a consistent drive that helps you get going. Use it to fuel what matters, and remember that not everyone can move at your pace.",
    open:
      "You take in and amplify pressure, which can make you rush to get things done just to feel free of it. That hurry isn't really yours. Slow down on purpose, and remember there's never as much rush as your body is telling you.",
  },
};

// ── INCARNATION CROSS (life theme, by angle) ────────────────────────────────────
export const CROSS_ANGLE_CONTENT: Record<HDCrossAngle, MeaningBlock> = {
  "Right Angle": {
    title: "right angle, personal destiny",
    intro: "Your life is largely about your own journey and development.",
    meaning:
      "A Right Angle cross is a personal destiny. Your path is focused on your own growth and experience, and you're self-absorbed by design, in the healthy sense. Other people play supporting roles in a story that's fundamentally yours to live.",
    apply:
      "Give yourself permission to focus on your own path without guilt, that self-focus is the point. Follow what genuinely calls you, your development is the contribution.",
  },
  "Left Angle": {
    title: "left angle, transpersonal karma",
    intro: "Your purpose is woven through other people and shared destiny.",
    meaning:
      "A Left Angle cross is a transpersonal karma. Your life is intertwined with others, and your purpose plays out through relationships, encounters and the people you're here to affect. Chance meetings carry far more weight than they look like they do.",
    apply:
      "Pay attention to the people who cross your path, your purpose moves through them. Stay open to where relationships lead you, even when the plan looks different from what you expected.",
  },
  Juxtaposition: {
    title: "juxtaposition, fixed fate",
    intro: "You carry one focused, fixed purpose that's uniquely yours.",
    meaning:
      "A Juxtaposition cross is a fixed fate, a single, concentrated theme you're here to embody. You've got an unusually stable way of being and a specific role that doesn't bend much to circumstance.",
    apply:
      "Lean into your fixed nature rather than fighting it, consistency is your gift. Find the one lane that's truly yours and let yourself go deep rather than wide.",
  },
};

// ── CHANNELS (concise gift line per channel, keyed low-high) ─────────────────────
export const CHANNEL_GIFT: Record<string, string> = {
  "1-8": "A creative role model, here to contribute your unique self and inspire others to do the same.",
  "2-14": "The keeper of direction and resources, driven toward a purpose bigger than you can yet see.",
  "3-60": "An engine for mutation and change, turning limitation into new beginnings.",
  "4-63": "A logical mind that doubts, tests and formulates answers that hold up.",
  "5-15": "A natural rhythm that, when honoured, sets a flow others fall into step with.",
  "6-59": "Deep intimacy and the power to break through people's barriers, in work and in love.",
  "7-31": "A natural leader for the future, here to guide through influence, not force.",
  "9-52": "Focused concentration, the ability to give sustained attention to detail others miss.",
  "10-20": "Self-awareness in the now, being fully yourself in the present moment.",
  "10-34": "Following your own convictions, empowered by acting on what you believe.",
  "10-57": "An instinct for survival and perfected form, intuition guiding how you move through life.",
  "11-56": "A seeker and storyteller, turning ideas and experiences into stimulating ideas for others.",
  "12-22": "Emotional expression with real social grace, a voice that moves people when the mood is right.",
  "13-33": "A witness and confidant, holding people's stories and reflecting the lessons back.",
  "16-48": "Depth turned into talent, mastering a skill through enthusiasm and practice.",
  "17-62": "Organised opinions backed by detail, expressing ideas people can actually follow.",
  "18-58": "A drive to correct and improve, challenging what isn't working to make it better.",
  "19-49": "Sensitivity to needs and principles, attuned to what people and communities require.",
  "20-34": "Busy, visible doing, being fully engaged in the present through action.",
  "20-57": "Intuitive knowing in the now, acting on instinct in the moment.",
  "21-45": "Control of resources and territory, a natural steward of money and material life.",
  "23-43": "Individual insight expressed as fresh, sometimes unconventional, knowing.",
  "24-61": "A thinking mind drawn to the mystery, turning inner knowing into realisation.",
  "25-51": "The drive of the spirit, initiation through courage and the will to go first.",
  "26-44": "A gift for influence and instinct, the salesperson who reads people and timing.",
  "27-50": "A caretaker of values and community, nurturing and preserving what matters.",
  "28-38": "A fighter for meaning, willing to struggle for a life that feels worth it.",
  "29-46": "Commitment and devotion, saying a wholehearted yes and following it all the way.",
  "30-41": "Feeling and fantasy that fuel new experiences, the spark that starts the human story.",
  "32-54": "Ambition and instinct for what will last, transformation through steady drive.",
  "34-57": "Instinctive power in the present, archetypal strength guided by intuition.",
  "35-36": "A hunger for experience and progress, growth through variety and change.",
  "37-40": "Community and the deal, loyalty and belonging balanced with knowing your limits.",
  "39-55": "Emotional provocation and spirit, moving people's moods to find what's real.",
  "42-53": "Seeing things through, the energy to begin cycles and bring them to completion.",
  "47-64": "Making sense of the past, turning mental pressure and confusion into realisation.",
};
