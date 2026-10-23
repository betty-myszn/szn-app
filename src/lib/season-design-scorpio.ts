// Scorpio Season, read through Human Design. Same shape as the Leo, Virgo and Libra files: this
// is the ONE file that changes per season, everything here is Scorpio-specific framing while the
// engine and all the natal Human Design logic stay identical. The identity layers describe her
// design rather than the season, so they carry over from the other seasons.
//
// Across Scorpio the Sun crosses gates 50, 28, 44, 1, 43 and 14: the end of the Spleen's run
// (values, purpose worth the struggle, patterns carried from the past), then the G (self-expression),
// the Ajna (insight that breaks through) and the Sacral (power skills and resources). That arc,
// from what you are carrying to what you are powered by, is why depth and power run through it.
//
// Each element opens into three layers so the reading is a real coaching read, not a
// one-liner: identity (who you are here), cycle (how Scorpio moves it for you) and
// guidance (what to do). Voice: warm, conversational, practical. No em dashes, no
// rhetorical questions.

import type { SeasonDesign, SeasonBlock } from "@/types/season-design";

const block = (summary: string, identity: string, cycle: string, guidance: string): SeasonBlock => ({
  summary,
  identity,
  cycle,
  guidance,
});

export const SCORPIO_SEASON: SeasonDesign = {
  sign: "Scorpio",
  title: "Scorpio Season",
  element: "water",
  intro:
    "Scorpio season takes the collective focus below the surface. The Sun enters the sign of depth, power, intimacy and transformation, so for everyone this is the part of the year that asks what you have been carrying, what you have been hiding and where you handed your power to someone else. In Human Design the Sun finishes its run across the Spleen, through the gates of purpose and old patterns, then moves into the G, the Ajna and finally the Sacral, which is why this season starts by showing you what you are holding on to and ends by putting you back in touch with what actually powers you.",
  encouraging:
    "This season is encouraging honesty with yourself, real intimacy, clean endings, reclaimed power and a purpose you would happily struggle for. It rewards the woman who looks straight at the thing she has been avoiding, who lets go of what has already finished, and who stops apologising for how deeply she feels and how much she wants.",
  activates: ["power", "depth", "intimacy", "transformation", "purpose", "self-trust"],

  typeLens: {
    Manifestor: block(
      "You are the initiator, and Scorpio asks you to stop hiding your moves.",
      "You are one of the rare few designed to start things from your own inner spark, without waiting for a cue. Your energy comes in fast, closed bursts that are meant to make an impact and then rest, rather than humming along steadily like everyone else's.",
      "Scorpio is the season of power and secrets, and your closed aura already reads as mysterious to the people around you. The pull this month is to move in private, keep your plans to yourself and deal with the fallout later, which is exactly how resistance builds. Scorpio also stirs up old anger, and a lot of it comes from the times you held back an urge because someone else would not like it.",
      "Act on the urge that is genuinely yours, and tell the people it affects before you move. Informing is what turns your intensity from threatening into magnetic, and it keeps your power clean. Let the anger that comes up this season tell you exactly where you have been shrinking your impact."
    ),
    Generator: block(
      "You are the life force, and Scorpio asks what your energy is really for.",
      "You carry a deep, renewable engine of energy that is designed to be spent on work that genuinely lights you up. In the right thing your energy is endless and magnetic, and in the wrong thing it drains and goes flat no matter how good the thing looks on paper.",
      "Scorpio ends with the Sun crossing your own centre, through the gates of power skills and resources, so this season is asking where your life force is actually going. The things you have kept doing out of habit, loyalty or fear of change feel heavier than usual now, and the frustration that comes with them is very clear information.",
      "Let your gut answer before your loyalty does. Keep your energy for the commitments that still light you up, and let one thing you have been dragging along out of obligation come to an end, because Scorpio rewards the ending that frees your energy for what you actually want."
    ),
    "Manifesting Generator": block(
      "You are the multi-passionate powerhouse, and Scorpio asks you to go deep on the right things.",
      "You have the Generator's renewable engine plus a fast wiring to action, so you move quickly, juggle several things and skip steps other people need. You are efficient rather than scattered, even when linear people struggle to keep up.",
      "Scorpio is a season of depth, and your speed can make you skim the surface of a lot of things at once. This month asks which of your many passions you are willing to go all the way in with, and which ones you keep around because ending them feels like failing.",
      "Respond first, then go deep on the few things that keep getting a strong gut yes. Let the projects that have gone flat finish without guilt, and inform the people affected before you pivot, so your transformations do not leave a trail of confusion behind you."
    ),
    Projector: block(
      "You are the guide, and Scorpio gives you X-ray vision.",
      "You are here to see people and systems clearly and to guide them, rather than to output energy all day. Your gift is penetrating insight, and it lands best when it is invited and recognised rather than pushed.",
      "Scorpio is the season of seeing beneath the surface, which is what you do naturally, so your insight is unusually sharp this month. The Sun also crosses the Ajna's gate of breakthrough insight, which turns the volume up further. The risk is telling people the deep truth you can see about them before they have asked, which feels like an attack to them and leaves you bitter.",
      "Hold your deepest insights for the people who invite them, and notice how powerful they are when they are wanted. Spend the season with the few people who can handle your depth, and rest properly, because seeing this much takes energy."
    ),
    Reflector: block(
      "You are the mirror, and Scorpio shows you the undercurrents in every room.",
      "You take in and amplify the energy around you, which makes you a rare barometer of your environment and deeply wise about people. You are designed to change day to day rather than stay fixed.",
      "Scorpio fills the air with intensity, secrets and unspoken feelings, and you pick all of it up. This month you may feel things in a room long before anyone says them, and some of what feels heavy in you is simply the season moving through the people around you.",
      "Notice which intensity is yours and which belongs to the room, and give yourself time alone to clear it. Give any big decision the full lunar cycle, and spend the season in environments that feel safe enough for you to let your guard down."
    ),
  },

  typeStrategy: {
    Manifestor: [
      "Tell the people your move affects before you make it, secrecy is where your resistance comes from.",
      "Act on the urge that is yours, and notice where you have been holding your impact back.",
      "Treat the anger this season brings up as a map of where you have been shrinking.",
      "Keep your power clean by being direct about what you are doing.",
    ],
    Generator: [
      "Let your gut answer before your loyalty does.",
      "End one thing you are only doing out of habit or obligation.",
      "Treat frustration as a sign your life force is going somewhere it no longer wants to go.",
      "Ask a friend to put the big questions to you as yes or no, and listen for the sound you make.",
    ],
    "Manifesting Generator": [
      "Respond first, then go all the way in with the few things that keep getting a gut yes.",
      "Let the projects that have gone flat finish without calling it failure.",
      "Inform before you pivot, so your transformations land smoothly with your people.",
      "Choose depth over range for this one season and notice what it gives you.",
    ],
    Projector: [
      "Wait for the invitation before you share the deep truth you can see.",
      "Keep your sharpest insights for the people who asked, uninvited truth is where bitterness starts.",
      "Spend the season with the few people who can handle your depth.",
      "Rest more than usual, seeing beneath the surface takes real energy.",
    ],
    Reflector: [
      "Sort the intensity that is yours from the intensity in the room.",
      "Spend time alone every day to clear what you picked up.",
      "Give every big decision a full lunar cycle, however intense the moment feels.",
      "Choose environments that feel safe enough to let your guard down.",
    ],
  },

  authorityLens: {
    emotional: block(
      "Your feelings run deep this season, so let the wave finish before you act.",
      "Your Solar Plexus is defined, so you feel life as an emotional wave that rises and falls. Your clarity lives in the pattern across that wave, never in a single high or low moment.",
      "Scorpio is the most emotionally intense season of the year, and your wave is already the deepest instrument you have. Expect bigger highs and lower lows than usual, plus old feelings coming back up to be finished. The trap this month is making a dramatic decision from the bottom of the wave, cutting someone off, quitting something or burning a bridge before the feeling has moved.",
      "Feel everything, fully, and act on none of it in the moment. Give every big decision at least a few nights, notice what stays true high, low and neutral, and let the answer that survives the whole wave be the one you move on."
    ),
    sacral: block(
      "Your gut knows what has died, even when your loyalty does not.",
      "Your Sacral responds instantly in the body, a lift of energy for yes and a flat drop for no. It speaks before your mind does, in pull and in sound rather than in reasoned argument.",
      "The Sun ends Scorpio crossing the Sacral, through the gates of power skills and resources, so your gut is louder than usual about where your energy should and should not go. The pressure this season is loyalty, staying with a person, job or habit because you have always been there, even when your body has been giving you a flat no for months.",
      "Ask yourself yes or no questions about the things you are carrying, out loud, and listen for the sound. Trust the drop in your body as a real answer, and let one thing your gut has already finished with come to an end this season."
    ),
    splenic: block(
      "The Sun is finishing its run across the Spleen, so trust what you know about people.",
      "Your Spleen gives you an in-the-moment intuition about what is right for your health, safety and timing. It is soft, it speaks once, and it does not repeat or justify itself.",
      "Scorpio opens with the Sun crossing the Spleen's gates of values, purpose and old patterns, including the gate of meeting people and recognising them instantly. Your instinct about who is safe and who is repeating an old story with you is very sharp now. The risk is Scorpio's suspicion, which can make you doubt a clean first hit, or its loyalty, which can make you ignore one.",
      "Act on the first read you get on a person or a situation, especially when it tells you a pattern from the past is repeating. When fear starts writing a long story, go back to the soft thing your body said in the first moment, because that was the instinct and the story is the fear."
    ),
    ego: block(
      "Scorpio is the season of power, so ask what you actually want.",
      "Your decisions run through your Heart, the seat of willpower, worth and genuine desire. The real question under every choice is whether you actually want it and have the heart to see it through.",
      "Scorpio is all about power, resources and what is shared between people, which puts your authority at the centre of the month. The pressure is to prove something, to win, to hold on or to keep a promise you made a long time ago to a version of you who wanted different things.",
      "Listen to what you say you want when you speak without editing, your voice gives your heart away. Let go of promises that no longer reflect your desire, renegotiate the deals that drain you, and only commit to what you genuinely want to see through."
    ),
    self: block(
      "You find your truth by saying it out loud, so say the deep thing.",
      "Your authority runs through your G centre, your identity and direction, and it comes out through your voice, so you reach clarity by talking and hearing what you say.",
      "The Sun crosses the G's gate of self-expression this season, so your identity is being refreshed and your voice wants to say things you have kept to yourself. Scorpio makes those things feel risky to say, which is exactly why you need to hear them.",
      "Talk the deep, private stuff through with someone you trust and who has no stake in your answer. Notice what you keep coming back to, and trust the direction that makes you feel most like yourself, even when it surprises you."
    ),
    mental: block(
      "Your clarity comes in conversation, so choose who gets to hear the real thing.",
      "You have no single inner authority, so you are designed to reach clarity through open conversation in the right environment. You are a sounding board by design, and your wisdom surfaces out loud over time.",
      "Scorpio brings deep, private decisions, the kind you cannot talk through with just anyone. The Sun's pass across the Ajna's gate of breakthrough insight also means a sudden knowing can land mid-sentence this month.",
      "Choose two or three people who can hold depth without judging you, and talk the big things through with them somewhere you feel safe. Notice the sentence that lands like a breakthrough, and give it a few days before you act on it."
    ),
    lunar: block(
      "Give the deep decisions a full month, however intense they feel.",
      "As a Reflector, your clarity comes over a full lunar cycle. Because you sample the energy around you, a decision needs to be felt across roughly 28 days, through every mood, before it is truly yours.",
      "Scorpio is intense, and you are amplifying the intensity of everyone around you, so a decision made this month can feel life or death in the moment and completely different a week later.",
      "Take the full cycle on anything that matters, especially endings. Talk it through with different trusted people across the month, notice how it feels in different rooms, and trust the answer that holds all the way through."
    ),
  },

  profileLens: {
    "1/3": block(
      "You dig until you hit the truth, then learn from what breaks.",
      "Line 1 needs a solid foundation of knowledge to feel secure, and line 3 learns through trial and error, discovering what works by bumping into what does not. You are a researcher who tests everything in practice.",
      "Scorpio is the season of investigation, which is your line 1's favourite thing, and your line 3 means some things are going to break as you dig. What falls apart this season is showing you something real about what was never built to last.",
      "Research the thing you have been avoiding looking at, properly, until you understand it. When something breaks, write down what it taught you, because that is how your line 3 turns a mess into wisdom."
    ),
    "1/4": block(
      "You need solid ground before you transform, so build it first.",
      "Line 1 needs to know its subject inside out, and line 4 lives through relationships, so your opportunities arrive through people you already know rather than cold pitches.",
      "Scorpio asks for transformation, and line 4 hates the ground moving under it. This season may bring a change you know you need while every part of you wants to stay where it is safe.",
      "Do your research, set up your next secure place, then let the change happen. Lean on the few people you trust most, because your network is how you get through any transformation."
    ),
    "2/4": block(
      "Your depth is a gift, and Scorpio gives you permission for the cave.",
      "Line 2 carries talents that feel effortless and needs regular time alone to recharge and develop them, and line 4 thrives through your network. You get called out of your cave by the people who see what you have.",
      "Scorpio is a season that rewards retreat, which your line 2 loves. Your deepest talents develop in private this month, and the right people will still find you when it is time.",
      "Take the time alone you need without apology. Let the people who know you call you out for the right things, and keep the rest of the world at a distance until you are ready."
    ),
    "2/5": block(
      "A natural talent people project onto, in a season full of intensity.",
      "Line 2 holds effortless gifts and needs solitude, and line 5 gets projected onto as a practical fixer people expect to save the day.",
      "Scorpio brings crisis, intensity and other people's deep stuff, and your line 5 is who they call. The projection can feel flattering, and in a season this intense it can also leave you holding problems that were never yours to solve.",
      "Guard your alone time, and choose carefully which crises you step into. Be clear about what you can actually offer, so the projection stays realistic and your reputation stays intact."
    ),
    "3/5": block(
      "You have been through the fire, and people want to know how you survived it.",
      "Line 3 finds truth through trial and error, and line 5 is projected onto as a practical, universal problem-solver. You turn hard-won lessons into solutions others can use.",
      "Scorpio is the season of transformation, and you have lived through more of them than most. The things that end this month are part of your process, and the lessons they leave are exactly what people will come to you for.",
      "Let what is ending end without shame. Share the practical lessons from your hardest chapters, because your survival is the solution someone else is looking for."
    ),
    "3/6": block(
      "You learned by breaking things, and now you model the rebuild.",
      "Line 3 learns through trial and error, and line 6 matures across three life phases into a role model, so your messy early experiments are building the wisdom you later embody.",
      "Scorpio is a season of death and rebirth, which suits both of your lines. If you are in your early phase, expect some things to break, and if you are maturing, notice how many people are watching how you handle your own transformation.",
      "Be gentle with the chapters that taught you the hard way, and keep your standards high. Live your transformation in a way you would be proud for someone to copy."
    ),
    "4/6": block(
      "Your people are everything, and this season you see who is really with you.",
      "Line 4 moves through your network, so life unfolds through the people you are bonded to, and line 6 grows into a role model across three phases.",
      "Scorpio tests loyalty and intimacy, and for you that means seeing very clearly which bonds are deep and real and which ones only look that way from the outside.",
      "Invest in the relationships that can hold your depth, and let the surface-level ones loosen. Line up your next secure connection before you let an old one go, and model the kind of loyalty you want back."
    ),
    "4/1": block(
      "A fixed, steady way of being, in a season that asks for transformation.",
      "This is the one Juxtaposition profile, unusually fixed in how it operates. Line 4 lives through relationships and line 1 needs a deep foundation, so you have a stable way of being that influences the people around you.",
      "Scorpio pushes everyone toward change, and your fixed nature is built to stay steady. The transformation this season asks of you is internal, a deepening of who you already are rather than a reinvention.",
      "Stay true to how you operate and let Scorpio deepen it rather than change it. Your steadiness is the anchor for the people around you through an intense season."
    ),
    "5/1": block(
      "People call you in a crisis, so make sure your foundation can hold it.",
      "Line 5 is projected onto as a practical rescuer people expect to fix things, and line 1 needs a solid foundation of knowledge to feel secure. You are the trusted expert called in a crisis.",
      "Scorpio brings crises, secrets and deep problems to the surface, so people will look to you to fix them this season. When the projection does not match reality, it can turn quickly.",
      "Do the deep research so your help holds, and be honest about what you can actually solve. Choose which crises you step into, and protect your reputation by stepping out of the ones that were never yours."
    ),
    "5/2": block(
      "The world calls on your talent, and Scorpio's intensity calls louder.",
      "Line 5 gets projected onto as a universal problem-solver, and line 2 holds effortless gifts and needs solitude. You have real talent people keep pulling you out of your cave to use.",
      "Scorpio brings intense demand for your help while your line 2 wants to retreat into the depth of the season, so the tension between the two gets sharper now.",
      "Protect your solitude, it is where your gift gets its power. Say yes only to the calls that genuinely feel right, and let people see the real you early so the projection stays honest."
    ),
    "6/2": block(
      "You are becoming the example, and Scorpio deepens what you model.",
      "Line 6 matures through three life phases into a role model, and line 2 carries natural gifts and needs solitude. You are building toward a way of living others learn from.",
      "Scorpio is a season of transformation and truth, and your line 6 is always moving toward authenticity. This month shows you where you have been performing a version of yourself rather than living it.",
      "Let the performance go and live the real thing, privately first if you need to. Give yourself the solitude to know what you want, because your authenticity is what people learn from."
    ),
    "6/3": block(
      "You have lived through real transformation, and now you model it.",
      "Line 6 grows into a role model across three phases, and line 3 learns by trial and error. Your lived experience is exactly what makes you a believable, grounded example.",
      "Scorpio rewards honesty about the dark chapters, and yours have been earned the hard way. The things that broke along the way are some of the most powerful parts of your story this season.",
      "Own the hard chapters without shame and share what they taught you. Your honesty about the messy parts is what makes people trust your example."
    ),
  },

  centreLens: {
    head: {
      defined: block(
        "A steady stream of questions, and this season they go deep.",
        "You carry a consistent source of inspiration and mental pressure, and you can inspire others with the questions you ask.",
        "Scorpio points your questions at the hidden layer of things, why people do what they do, what is really going on underneath and what is driving you.",
        "Follow the questions that lead you to a real answer about your own life, and let the ones that only feed suspicion go unanswered."
      ),
      open: block(
        "You absorb everyone's dark thoughts, so sort them from yours.",
        "Your Head is open, so you take in and amplify other people's questions and mental pressure, which makes you impressionable to what is not yours.",
        "Scorpio fills the air with intense, obsessive questions, and you may find yourself spiralling on mysteries and worries that belong to someone else.",
        "Notice when a heavy thought arrived with another person, and hand it back. Keep your mind for the questions about your own life."
      ),
    },
    ajna: {
      defined: block(
        "A fixed way of thinking, and this season it can see through things.",
        "You process information and form views in a fixed, reliable way, which makes you mentally consistent.",
        "The Sun crosses the Ajna's gate of breakthrough insight this season, and your fixed framework can turn that into a clear, cutting understanding of a situation.",
        "Share your insight when it is invited, and stay open to the possibility that there is more going on than your framework can see."
      ),
      open: block(
        "A sudden knowing may land, so let it land without certainty.",
        "Your Ajna is open, so you think flexibly and can hold many perspectives, and you may feel pressure to appear certain.",
        "The Sun's pass across the gate of breakthrough insight can bring moments of sudden clarity this month, and also pressure to prove you know exactly what is going on.",
        "Let insight arrive without needing to defend it, and let your authority decide what to do with it. You are allowed to know something without being certain about all of it."
      ),
    },
    throat: {
      defined: block(
        "A reliable voice, so use it to say the true thing.",
        "You have a reliable voice and a consistent way of expressing and getting things done.",
        "Scorpio rewards depth and directness, so the honest, unfiltered thing lands with real power when you say it this season.",
        "Say the deep truth simply, without softening it to the point it disappears, and let your voice hold your boundary."
      ),
      open: block(
        "Say the real thing at the right time, and let the rest wait.",
        "Your Throat is open, so you can channel many ways of expressing, and you may feel pressure to speak or act to get noticed.",
        "Scorpio brings intense moments and heavy silences, and you may feel pressure to fill them, confess everything or say something dramatic to break the tension.",
        "Let a heavy silence sit before you fill it. Save the deep things for the people who asked and the moments that feel right, because they land far harder that way."
      ),
    },
    g: {
      defined: block(
        "You know who you are, and Scorpio shows you the deeper layer of it.",
        "You have a fixed sense of who you are and where you are going, a reliable inner direction.",
        "The Sun crosses the G's gate of self-expression this season, which refreshes your sense of self and asks you to show more of it.",
        "Let the parts of you that you have kept private out into your life a little more, and trust your direction even through the intensity."
      ),
      open: block(
        "You become who you are around, so choose who sees the deep you.",
        "Your G is open, so your sense of self and direction is shaped by where and who you are around, which makes you adaptable and a mirror for others.",
        "Scorpio is intimate and intense, and with an open G you can merge with someone so fully this season that you lose track of where they end and you begin.",
        "Notice who you feel most like yourself around and give those people your depth. The right people and places guide you toward who you are becoming."
      ),
    },
    heart: {
      defined: block(
        "Real willpower, so put it behind what you actually want now.",
        "You have reliable willpower and can make and keep promises when you genuinely want to.",
        "Scorpio is about power and resources, and your willpower is one of the strongest you have, so it matters a lot this season where you point it.",
        "Renegotiate any promise you no longer want to keep, then put your full will behind what you actually desire. Rest between efforts, because your heart needs it."
      ),
      open: block(
        "Your worth is settled, so stop proving it through how much you can handle.",
        "Your Heart is open, so you do not have consistent willpower on tap, and you can feel a pull to prove your worth.",
        "Scorpio can turn that pull into proving how strong you are, how much you can carry and how much you can survive without asking for help.",
        "Make fewer promises and put down the things you are carrying to prove you can. Your worth is real whether you are handling everything or not."
      ),
    },
    sacral: {
      defined: block(
        "A renewable engine, and Scorpio ends by switching it back on.",
        "You have a deep, renewable engine of energy for the work and life you love, meant to be spent fully each day.",
        "The Sun crosses the Sacral's gate of power skills at the end of Scorpio, so this season is showing you where your energy is truly powered and where it is only going through the motions.",
        "Give your energy to what gets a strong gut yes and end what has gone flat. That is how Scorpio's transformation shows up in your body."
      ),
      open: block(
        "You feel everyone's intensity, so know when you have had enough.",
        "Your Sacral is open, so you do not have consistent life-force energy and can amplify other people's, then overwork without noticing.",
        "Scorpio is intense, and you may borrow the energy of everyone's drama, crisis or passion and keep going long after your own energy ran out.",
        "Leave before you are depleted, spend time alone to discharge what you picked up, and let yourself rest while the intensity carries on without you."
      ),
    },
    solarplexus: {
      defined: block(
        "Your emotions run deep, and Scorpio makes them deeper.",
        "You experience life as an emotional wave moving through highs and lows, and it is also your decision-making authority.",
        "Scorpio is a water sign at full intensity, so your wave may hit new depths this season, and old feelings may come back up to be finished.",
        "Let the wave move all the way through, and give yourself time before acting on any of it. Your emotional depth is your power, and it gets stronger when you stop rushing it."
      ),
      open: block(
        "You feel the room's intensity, so let it pass through you.",
        "Your Solar Plexus is open, so you absorb and amplify the emotions around you, and can avoid conflict to keep the peace.",
        "Scorpio is the most emotionally charged season of the year, and you will feel every undercurrent, secret and unspoken tension in the room as if it were yours.",
        "Notice when a feeling arrived with another person and let them keep it. You are allowed to say the hard thing, and you do not have to absorb everyone's storm."
      ),
    },
    spleen: {
      defined: block(
        "Your instincts are sharp, and the Sun starts the season on your Spleen.",
        "You have a consistent intuition and a steady instinct for health and safety.",
        "The Sun crosses the Spleen's gates of purpose and old patterns at the start of Scorpio, sharpening an instinct you already rely on, especially about people repeating old stories.",
        "Trust the first read and act on it. When your instinct tells you a pattern is repeating, believe it the first time."
      ),
      open: block(
        "Watch for holding on to what has already ended.",
        "Your Spleen is open, so you can become wise about health and survival, and you may hold onto things out of fear of letting go.",
        "Scorpio is the season of endings, and with an open Spleen you may grip people, habits or situations long after they died, because letting go feels unsafe.",
        "Notice what you are holding onto out of fear, and let one of those things go this season. Letting go is how Scorpio makes room for your next version."
      ),
    },
    root: {
      defined: block(
        "Steady under pressure, which is useful in an intense season.",
        "You handle pressure and stress in a steady, reliable way, with a consistent drive to get going.",
        "Scorpio brings pressure to transform, confront and end things, and you can hold that pressure without panicking.",
        "Let deep changes take the time they need, and remember the people around you may feel this season's pressure far more than you do."
      ),
      open: block(
        "The pressure to transform overnight is contagious.",
        "Your Root is open, so you take in and amplify pressure, and can rush to get things done just to feel free of it.",
        "Scorpio's intensity can make you want to burn everything down and start again just to escape the pressure of not knowing.",
        "Let things transform at their own speed, and make the big decisions in your own time. The urgency you feel is often the season's, and it passes."
      ),
    },
  },

  crossLens: {
    "Right Angle": block(
      "This season asks you to reclaim your own path.",
      "Your incarnation cross is a personal destiny, so your path is fundamentally about your own growth and experience, with others in supporting roles.",
      "Scorpio shows you where your power has been going into someone else's story, and asks you to bring it home to your own.",
      "Take your power back from the places you gave it away and put it into your own path. Transformation for you is personal, and it starts with you."
    ),
    "Left Angle": block(
      "Your purpose moves through deep bonds, and Scorpio deepens them.",
      "Your cross is a transpersonal karma, so your life is intertwined with others and your purpose plays out through relationships and encounters.",
      "Scorpio is the season of intimacy and shared resources, so the deep connections that form or end this month carry real weight for your path.",
      "Pay attention to the bonds that feel fated, and let the ones that have run their course end cleanly. Your purpose moves through the right people."
    ),
    Juxtaposition: block(
      "Scorpio asks everyone to transform, and your design deepens instead.",
      "Your cross is a fixed fate, a single concentrated theme you are here to embody, with an unusually stable way of being.",
      "Scorpio pushes everyone to reinvent themselves, and your fixed nature can feel that pressure strongly without needing to follow it.",
      "Go deeper into your theme rather than abandoning it. Your transformation this season is a sharpening of what you already are."
    ),
  },

  challenge: {
    Manifestor: "Tell the people closest to you about one move you have been planning in private, before you make it.",
    Generator: "Let one thing your gut has been a flat no on for months come to an end this season.",
    "Manifesting Generator": "Pick the one passion that keeps getting a gut yes and go all the way in with it for the rest of the season.",
    Projector: "Hold back one deep truth you can see about someone until they invite it, and notice how differently it lands.",
    Reflector: "Spend time alone every day for a full lunar cycle and track which intensity was yours and which was the room's.",
  },

  businessLens: {
    Manifestor: block(
      "Make the bold move, and tell people before you make it.",
      "In business you are built to initiate, to start the thing and set it in motion rather than wait for demand to appear.",
      "Scorpio is the season of transformation and power moves, and the business changes you have been planning in private are ready to be made.",
      "Make the bold move you have been sitting on, and inform clients, partners and your team before it lands. Your power in business grows when people are not caught off guard by it."
    ),
    Generator: block(
      "End the offer you are tired of.",
      "You build a business by responding to what genuinely lights you up and what the market is actually asking for, and your energy is what sells it.",
      "Scorpio shows you which parts of your business still light you up and which ones you keep doing out of habit, fear or loyalty.",
      "Retire the offer, client or task your gut has gone flat on, and put that energy into what you love. Your satisfaction is the clearest business signal you have."
    ),
    "Manifesting Generator": block(
      "Cut the projects that have gone flat.",
      "You run a business best by experimenting across several things and following the ones with real energy, pivoting quickly.",
      "Scorpio is a season of endings, and you likely have a few projects running that your energy has already left.",
      "Close the projects that have gone flat and go deeper with the ones that still have heat. Tell your people before you pivot, so the change reads as strategy."
    ),
    Projector: block(
      "Your insight is worth more than you charge for it.",
      "Your business gift is guiding, seeing what others miss and being recognised for that expertise.",
      "Scorpio sharpens your insight, and the deep, transformative work you do is exactly what people are looking for now.",
      "Make your depth visible so the right clients can recognise it, then wait for the invitation. Price your insight for the transformation it creates."
    ),
    Reflector: block(
      "Feel out every power move for a full cycle.",
      "You sense trends and the health of a market unusually well, and you thrive in the right business environment.",
      "Scorpio brings intense, high-stakes business decisions, and you need time to separate the real opportunity from the room's urgency.",
      "Take a full lunar cycle before any big business decision, and notice how you feel about it in different environments."
    ),
  },

  relationshipsLens: {
    Manifestor: block(
      "Let your people in on what you are doing.",
      "In relationships you need freedom and you move first, which can feel intense to others when you do not explain.",
      "Scorpio is a season of intimacy and trust, and the people close to you feel it more than usual when you move without telling them.",
      "Inform your partner, friends and family before you make big moves. Letting people in is how your intensity becomes intimacy."
    ),
    Generator: block(
      "Give your depth to the connections that light you up.",
      "You give the best of your energy to the people and connections that genuinely light you up.",
      "Scorpio asks for real intimacy, and your gut knows which connections can hold it and which ones are only habit.",
      "Go deeper with the people your body responds to, and let the obligated connections fade."
    ),
    "Manifesting Generator": block(
      "Go deep with the ones who can keep up.",
      "You bring fast, playful, multi-faceted energy to relationships and get restless with the flat ones.",
      "Scorpio asks for depth, and your restlessness can make it hard to stay with one feeling or one person long enough to go all the way in.",
      "Choose the people worth slowing down for, and let yourself go deeper with them this season. Tell them before you change plans."
    ),
    Projector: block(
      "Spend your depth with the people who see you.",
      "You thrive with people who recognise and invite you, and you wilt where you feel unseen or used for output.",
      "Scorpio is intimate and intense, and you will feel very clearly this month who sees the real you and who only sees what you can do for them.",
      "Invest in the relationships where you feel truly seen, and save your deepest insight for the people who invite it."
    ),
    Reflector: block(
      "Choose the people who feel safe.",
      "You take on the emotional climate of whoever you are around, so your relationships shape your whole experience.",
      "Scorpio brings intensity into every relationship, and you will feel which people feel safe to be deep with and which ones leave you on guard.",
      "Spend more of your time with the people who feel safe, and let the draining intensity of the others stay with them."
    ),
  },

  moneyLens: {
    Manifestor: block(
      "Make the money move you have been sitting on.",
      "You make money by starting things and creating new streams, in bursts rather than a steady grind.",
      "Scorpio is the season of shared resources, debts and power around money, and you may notice where you have been waiting for permission to make a financial move.",
      "Start the money move you have been planning, and inform the people it affects. The shadow is keeping your money plans secret until they become a problem."
    ),
    Generator: block(
      "Put your energy where the money and the joy meet.",
      "You earn most when you are doing work you genuinely love, your lit-up energy is the real asset.",
      "Scorpio ends with the Sun crossing the Sacral's gate of resources and power skills, which shines a light on where your energy earns and where it leaks.",
      "End the paid work your gut has gone flat on and put that energy into what you love and what pays. The shadow is staying in a draining job or deal out of fear of change."
    ),
    "Manifesting Generator": block(
      "Close the money leaks and back the streams with heat.",
      "You can earn across several things at once and move fast between them.",
      "Scorpio shows you which income streams still have energy and which ones are costing you more than they bring in.",
      "Close the streams that drain you and double down on the ones with real momentum. The shadow is holding onto everything in case one of them pays off."
    ),
    Projector: block(
      "Charge for the depth of what you see.",
      "You earn best being recognised and invited for your expertise, not by grinding output.",
      "Scorpio puts power and worth on the table, so this season shows you whether you are being paid for the transformation your insight creates.",
      "Raise your rates to match the depth of your work, and work with clients who value it. The shadow is undercharging for the deepest thing you do."
    ),
    Reflector: block(
      "Feel out every financial decision before you commit.",
      "You read financial timing and the right opportunities well when you are not rushed.",
      "Scorpio brings high-stakes money decisions, shared finances and power dynamics around money, and you need time to feel each one clearly.",
      "Give every financial decision a full lunar cycle. The shadow is making a big money move in the intensity of the moment."
    ),
  },

  shadowIntro:
    "Scorpio season shines a light on where you hide, where you grip and where you have handed your power away. Your open centres are where you take in and amplify the world, so they are where this season's intensity, fear of letting go and urge to control show up loudest, usually disguised as loyalty, strength or keeping things private. Naming them is how you stop unconsciously running on them and take your power back.",

  shadowByOpenCentre: {
    head: "Spiralling on mysteries, suspicions and worries that belong to other people, and losing nights to questions that were never yours to answer.",
    ajna: "Needing to prove you know exactly what is going on, and treating a flash of insight as certainty before your body has agreed.",
    throat: "Breaking a heavy silence with a confession or a dramatic statement, and saying the intense thing to get a reaction rather than to be understood.",
    g: "Merging so fully with someone that you lose track of who you are, and taking on their story and direction as your own.",
    heart: "Proving how strong you are by carrying everything alone, and keeping promises you no longer want just to prove you can.",
    sacral: "Running on everyone else's intensity and drama, and missing the moment you were done until you crash.",
    solarplexus: "Absorbing every undercurrent in the room, swallowing the hard truth to avoid the storm, and treating everyone else's feelings as yours to carry.",
    spleen: "The big one this season, gripping people, habits and situations long after they ended, because letting go feels unsafe.",
    root: "Burning everything down to escape the pressure of a slow change, and rushing transformations that need time.",
  },

  practices: {
    emotional: {
      tapping: "Tap the side of your hand: even though this feeling is huge right now, I let it move all the way through before I decide anything.",
      breathwork: "Breathe in for four and out for eight, for three minutes, whenever a feeling makes you want to act right now.",
      journal: "What did I feel most intensely this week, and what is still true about it now the wave has moved?",
      reset: "When the urge to cut, quit or confront hits, put a hand on your belly, breathe, and give it one more night.",
    },
    sacral: {
      tapping: "Tap your collarbone: my gut knows what has ended, and I am allowed to let it go.",
      breathwork: "Two deep belly breaths, then ask yourself out loud whether you still want this, and listen for the sound.",
      journal: "What am I still giving energy to only out of habit or loyalty, and what does my gut say about it?",
      reset: "Shake out your whole body for thirty seconds, then ask your gut one yes or no question about something you are carrying.",
    },
    splenic: {
      tapping: "Tap the side of your hand: I trust what I knew in the first moment, and I am allowed to believe a pattern the first time.",
      breathwork: "One long, slow exhale, twice as long as the inhale, to drop below the fear and hear the instinct underneath it.",
      journal: "Where did my body recognise an old pattern this week before my mind caught up?",
      reset: "Pause, soften your belly, and act on the first signal instead of the long story fear is writing.",
    },
    ego: {
      tapping: "Tap your heart centre: I only keep the promises I still want, and my worth stays the same when I let one go.",
      breathwork: "Hand on heart, three slow breaths, and ask whether you actually want this or want to prove you can do it.",
      journal: "Which promise am I keeping to an older version of me, and what do I actually want now?",
      reset: "When you feel the pull to prove your strength, pause with a hand on your chest and name what you want instead.",
    },
    self: {
      tapping: "Tap your throat: I say the deep thing out loud, and I hear my truth in it.",
      breathwork: "Three grounding breaths, then say the private thing out loud to yourself and notice how it feels to hear it.",
      journal: "What do I keep saying when I talk about this, and what does it tell me about who I am becoming?",
      reset: "Voice-note someone you trust who has no stake in your answer and say the real thing.",
    },
    mental: {
      tapping: "Tap the side of your hand: I choose who gets to hear the real me, and my clarity comes from the right room.",
      breathwork: "Slow, easy breathing on a walk somewhere you feel safe, and notice what surfaces.",
      journal: "Who helped me reach a breakthrough this week, and what did I say that surprised me?",
      reset: "Change your environment and talk it through with someone who can hold depth without judging you.",
    },
    lunar: {
      tapping: "Tap your collarbone: I take the full cycle, and the intensity of today does not decide for me.",
      breathwork: "Long, slow breaths somewhere that feels safe, and let yourself feel the decision instead of solving it.",
      journal: "How does this choice feel this week compared with last week, and what does the whole month say?",
      reset: "Spend time alone somewhere you love and notice what you feel when nobody else's intensity is in the room.",
    },
  },

  affirmationByType: {
    Manifestor: "I make my moves in the open, my power is clean, and my impact is meant to be felt.",
    Generator: "I give my energy to what lights me up, and I let what has ended go with love.",
    "Manifesting Generator": "I go deep on what is mine, I let the rest finish, and my power moves fast.",
    Projector: "My insight is powerful when it is invited, and I am seen by the people who can hold my depth.",
    Reflector: "I let the room's intensity pass through me, I choose where I feel safe, and I take all the time I need.",
  },

  weeklyQuestions: [
    "What did I avoid looking at this week, and what happens when I look at it now?",
    "Where did I follow my strategy to {strategy}, and where did I hold on or hide instead?",
    "Did I honour my {authority} way of deciding, or did the intensity of the moment decide for me?",
    "Where did I take my power back this week, and where did I give it away?",
    "What is ready to end, and what is it making room for?",
    "What is one deep truth I can say out loud next week?",
  ],
};
