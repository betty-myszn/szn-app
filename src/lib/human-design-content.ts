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
      "You can't move on something you haven't got solid under your feet, so you read everything, and then you learn it properly by getting it wrong anyway. Line 1 wants the foundation. Line 3 finds the truth by bumping into what doesn't work. You're a researcher who tests it in real life instead of taking anyone's word for it.",
    apply:
      "Study as deeply as you want before you move. That isn't procrastination, it's how your confidence gets built, and skipping it is what makes you wobble. And stop counting the things that didn't work as failures. They're the research, and they're the reason your eventual answer holds.",
  },
  "1/4": {
    title: "the investigator / opportunist",
    intro: "You build deep foundations, then share them through your network.",
    meaning:
      "You need to know your subject inside out before you feel safe speaking on it, and then it travels through the people who already know you. Line 1 builds the foundation, line 4 opens the doors. Your next thing arrives through a warm connection, not a cold pitch.",
    apply:
      "Do the deep study first so the authority is real rather than performed. Then tend your people like it's the work, because it is. The opportunity you want is almost always one relationship away, and it won't come from a stranger.",
  },
  "2/4": {
    title: "the hermit / opportunist",
    intro: "You've got natural gifts, and you need both alone time and your people.",
    meaning:
      "You've got talent you never had to work for, and a need for solitude that other people read as antisocial. Line 2 needs the cave, that's where the gift actually develops. Line 4 means you get called out of it by the people who can already see what you've got.",
    apply:
      "Protect the alone time without apologising for it, because that's where the gift lives. Then trust the people who name your talent out loud and pull you into things. You get found. You don't get there by chasing.",
  },
  "2/5": {
    title: "the hermit / heretic",
    intro: "You're a natural talent that people project their hopes onto.",
    meaning:
      "You've got gifts that feel effortless to you and a solitude you genuinely need, and the world keeps knocking anyway. Line 5 gets projected onto: people decide you have the answer before you've said a word. Deliver and you're a saviour, don't and you're a disappointment, and neither one is really about you.",
    apply:
      "Guard the alone time and get deliberate about what you agree to, because the expectations keep coming. Deliver when you actually can, say so plainly when you can't, and let the projection be their business instead of the thing running your calendar.",
  },
  "3/5": {
    title: "the martyr / heretic",
    intro: "You learn by doing, then teach the world what actually works.",
    meaning:
      "You find out what's true by getting it wrong first, and then people decide you're the one with the answer. Line 3 experiments relentlessly, line 5 gets projected onto as the practical fixer. You turn hard-won lessons into something other people can actually use.",
    apply:
      "Let the failed attempts count as method rather than proof you're bad at this. Then be careful what you promise, because line 5 makes people expect a rescue. Offer what you know works and drop the expectation you never signed up for.",
  },
  "3/6": {
    title: "the martyr / role model",
    intro: "You experiment hard early, then become the example.",
    meaning:
      "Your first three decades are a contact sport. Line 3 learns by trying it and getting burned, and you've had more of that than most. Line 6 climbs onto the roof around thirty, watches for a while, then comes back down to live as the proof. The mess wasn't wasted time, it was the curriculum.",
    apply:
      "Stop apologising for the trial and error, it's how you know anything worth knowing. If you're in the watching phase, let yourself watch instead of forcing action you're not built for right now. What you lived through becomes the exact thing people trust you for later.",
  },
  "4/6": {
    title: "the opportunist / role model",
    intro: "You lead through relationships, and you become the example over time.",
    meaning:
      "Your life moves through your people. Line 4 means the network isn't a nice-to-have, it's the whole route, so a burned bridge costs you more than it costs most. Line 6 means you're becoming the example on a slow timeline, so the authority arrives later and lasts longer.",
    apply:
      "Tend your relationships deliberately, and leave well when you leave, because your next chapter comes through someone you already know. And stop rushing the authority. You're on a longer clock, and that's the design rather than a delay.",
  },
  "4/1": {
    title: "the opportunist / investigator",
    intro: "You're a fixed point, deeply grounded and here to influence your network.",
    meaning:
      "You're fixed. Lines 4 and 1 don't bend to circumstances the way other profiles do, so you get one way of being and it works beautifully once you stop fighting it. Your influence runs through the people close to you, built on a foundation you actually did the work for.",
    apply:
      "Build the expertise deep, then let it move through your close network rather than broadcasting at strangers. You're not built to be endlessly flexible, so surround yourself with people who value exactly how you're built instead of the ones asking you to adapt.",
  },
  "5/1": {
    title: "the heretic / investigator",
    intro: "People look to you for solutions, and you make sure you've got them.",
    meaning:
      "People project solutions onto you before they properly know you, and line 1 means you make sure you've actually got them. That combination makes you genuinely useful and permanently slightly misread: they see the fixer, not the person who did the reading first.",
    apply:
      "Do the work so the reputation is earned, then be exact about what you're promising, because the projection inflates on its own. When it stops fitting, move on without taking it personally. It was never a description of you in the first place.",
  },
  "5/2": {
    title: "the heretic / hermit",
    intro: "A natural talent the world keeps calling on to save the day.",
    meaning:
      "You'd rather be left alone, and the world keeps calling. Line 2's gift is effortless to you, line 5 makes people certain you can save the day. You get pulled out again and again for something you never advertised.",
    apply:
      "Say yes to the calls that genuinely suit you and let the rest go without the guilt. Be clear about what you're actually offering so the expectation stays the right size, then go back to your own space instead of staying available by default.",
  },
  "6/2": {
    title: "the role model / hermit",
    intro: "You're here to become the example, in your own time.",
    meaning:
      "You're on the long timeline. Line 6 lives in three phases: a messy first act, a long stretch on the roof watching, then coming down as the example. Line 2 needs solitude the whole way through. If you feel behind, you're not behind, you're mid-build.",
    apply:
      "Let the watching phase be a phase instead of evidence you've stalled. Protect the alone time, it's where the gift matures. What you're becoming can't be forced onto an earlier deadline, and everyone rushing you is running a different clock.",
  },
  "6/3": {
    title: "the role model / martyr",
    intro: "You live it all the way through, then become the proof it can be done.",
    meaning:
      "You live everything all the way through. Line 3 collides with what doesn't work, line 6 turns it into the example. That means a loud first act, a lot of people telling you to be more careful, and then a second half where the thing you lived through is the whole reason anyone listens.",
    apply:
      "Stop treating the wreckage as a track record against you. It's the proof. Live it fully, then say it out loud, because the version of you people trust later is built from exactly what you're going through now.",
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
      "You've got a renewable engine that fires for the right work and flatly refuses the wrong work. That refusal is information, not laziness. Spend the energy on what pulls you and go to bed properly tired, that's the design running correctly.",
    open:
      "You don't have consistent life force, so you take in other people's and mistake it for your own, then wonder why you crash. You're not built for the grind everyone else runs. Learn what enough looks like for you and stop measuring it against people wired differently.",
  },
  ajna: {
    name: "Ajna",
    theme: "how you think and conceptualise",
    defined:
      "You've got a fixed way of processing and forming views, which makes you consistent and makes people trust your read. Trust the framework, and keep it open enough to update, because the failure mode here isn't doubt, it's certainty hardening into something you can't move.",
    open:
      "You think flexibly and can hold several truths at once, and the pressure to sound certain is relentless. You don't owe anyone a fixed opinion. Get comfortable saying I'm still thinking about it, because that's the honest answer and it's also your actual gift.",
  },
  throat: {
    name: "Throat",
    theme: "communication and manifestation",
    defined:
      "You've got a reliable voice and a consistent way of getting things out into the world. Use it on your own timing rather than just because you can. Speaking because the words are available isn't the same as speaking because it's the moment.",
    open:
      "You can express yourself a dozen ways, and the pull to talk just to be noticed is strong. Let yourself be invited, or wait for the moment that's actually yours. The same words land completely differently when you're not pushing them.",
  },
  g: {
    name: "G (Identity)",
    theme: "identity, direction and love",
    defined:
      "You've got a fixed sense of who you are and where you're going, a compass that holds even when everything around it moves. Trust your own direction, it doesn't waver the way other people's does, and let the people around you steady themselves on it.",
    open:
      "Your identity and direction shift with where you are and who you're with, which makes you adaptable and an extraordinary mirror for other people. Choose your rooms carefully, they shape you more than they shape most. And stop demanding that you have it all figured out, that was never how you were built to work.",
  },
  heart: {
    name: "Heart (Ego / Will)",
    theme: "willpower, worth and desire",
    defined:
      "You've got consistent willpower and a real sense of your own worth, and you can make promises you'll actually keep. Use it on things you genuinely want. Proving your value on demand is the fastest way to spend this on someone else's agenda.",
    open:
      "Your willpower comes and goes, so pushing through on command doesn't work, and you've probably been told that's a discipline problem. It isn't. Stop making promises to prove something, and stop measuring your worth by what you can force yourself to finish.",
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
      "You run on an emotional wave, and there's no truth at either end of it. The high isn't clarity and the low isn't the real answer. Give anything that matters a night, and read the pattern across the whole wave instead of the feeling in front of you.",
    open:
      "You take in everyone else's emotional weather and amplify it, so you avoid conflict to keep the room calm, then call it being easy-going. Learn which feelings are actually yours. Most of what you're managing walked in with someone else.",
  },
  spleen: {
    name: "Spleen",
    theme: "intuition, health and survival",
    defined:
      "You've got a quiet, immediate instinct for what's safe and what's off, and it speaks once. It won't repeat itself and it won't argue, which is exactly why you talk yourself out of it and regret it later. Move on the first hit.",
    open:
      "You feel other people's fear as though it's yours, and you hold on to people and habits past the point they're good for you because letting go feels like the bigger risk. Notice whose fear you're actually carrying before you let it make the decision.",
  },
  root: {
    name: "Root",
    theme: "pressure, drive and adrenaline",
    defined:
      "You've got your own supply of pressure and drive, a steady adrenaline that lets you set your own pace. Use it to finish things rather than to keep starting them, and don't let anyone else's urgency reset a rhythm that's working.",
    open:
      "You amplify pressure from everywhere and turn it into a permanent rush to be free of it, which is how you end up saying yes to things purely to get them off your list. The hurry isn't yours. Almost nothing needs answering as fast as it feels.",
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
