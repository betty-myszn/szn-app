// Virgo Season, read through Human Design. Same shape as the Leo file: this is the ONE
// file that changes per season, everything here is Virgo-specific framing while the
// engine and all the natal Human Design logic stay identical.
//
// Each element opens into three layers so the reading is a real coaching read, not a
// one-liner: identity (who you are here), cycle (how Virgo moves it for you) and
// guidance (what to do). Voice: warm, conversational, practical. No em dashes, no
// rhetorical questions.

import type { SeasonDesign, SeasonBlock } from "@/types/season-design";

const block = (summary: string, identity: string, cycle: string, guidance: string): SeasonBlock => ({
  summary,
  identity,
  cycle,
  guidance,
});

export const VIRGO_SEASON: SeasonDesign = {
  sign: "Virgo",
  title: "Virgo Season",
  element: "earth",
  intro:
    "Virgo season turns the collective volume down on performance and up on practice. The Sun moves into the sign of refinement, health and devotion, so for everyone this is the part of the year that stops asking how it looks and starts asking whether it actually works. It is precise, grounded, useful energy, the season where your daily life gets rebuilt on purpose instead of by accident, and where the small things you keep doing quietly become the whole of who you are.",
  encouraging:
    "This season is encouraging refinement, healthy routines, honest editing, devotion to the work and getting your systems to hold you. It rewards the woman who improves the thing she already has rather than abandoning it for a shinier start, and who lets good enough go out into the world instead of keeping it safe and unfinished.",
  activates: ["routines", "health", "refinement", "devotion", "discernment", "follow-through"],

  typeLens: {
    Manifestor: block(
      "You are the initiator, and Virgo asks you to finish what you started.",
      "You are one of the rare few designed to start things from your own inner spark, without waiting for a cue. Your energy comes in fast, closed bursts that are meant to make an impact and then rest, rather than humming along steadily like everyone else's.",
      "Virgo does not take your initiating away, it aims it at the unfinished. The urge that arrives now tends to be about tightening, systemising or completing something you already began, and the collective is far more interested in what works than in what is loud. Your bursts still come, and the dips between them matter more this season because your body is asking to be listened to.",
      "Pick the one thing you started and abandoned, inform the people it affects, and finish it properly. Build the simple system that means your next launch does not depend on a burst of adrenaline, and treat rest as part of the work rather than the reward at the end of it."
    ),
    Generator: block(
      "You are the life force, and Virgo turns your yes into a practice.",
      "You carry a deep, renewable engine of energy that is designed to be spent on work that genuinely lights you up. In the right thing your energy is endless and magnetic, and in the wrong thing it drains and goes flat no matter how good the thing looks on paper.",
      "Virgo asks a harder question than the last season did, which is whether the thing that lights you up survives the boring middle. Your gut still answers, and this season it answers about routines, repetitions and the daily shape of your work rather than about big shiny openings.",
      "Keep responding, and then commit to the repetition. Notice which parts of the work you would still do on a flat Tuesday, build your week around those, and let the parts that only ever ran on excitement quietly fall away."
    ),
    "Manifesting Generator": block(
      "You are the multi-passionate powerhouse, and Virgo is the season you finish.",
      "You have the Generator's renewable engine plus a fast wiring to action, so you move quickly, juggle several things and skip steps other people need. You are efficient rather than scattered, even when linear people struggle to keep up.",
      "Virgo is the one season that genuinely asks you to slow down enough to complete. Skipping steps still works for you, and this season will show you exactly which skipped steps were shortcuts and which ones were the reason something keeps falling apart.",
      "Choose the one or two things with real energy left in them and take them all the way to done. Keep skipping the steps that never mattered, go back for the ones that do, and let the half-started rest go without calling yourself a failure for it."
    ),
    Projector: block(
      "You are the guide, and Virgo makes your seeing genuinely useful.",
      "You are here to see people and systems clearly and to guide them, rather than to output energy all day. Your gift is penetrating insight, and it lands best when it is invited and recognised rather than pushed.",
      "Virgo is your natural home in a way the loud seasons are not, because this is the season the world actually wants the thing you do, which is to look at something and see exactly where it is broken. Invitations now tend to be about fixing, refining and advising rather than performing.",
      "Study the system you are closest to and get precise about what you can see in it, then wait to be asked. Say yes to the invitations that want your discernment, and protect your energy hard, because a season about work will happily take more hours than you actually have."
    ),
    Reflector: block(
      "You are the mirror, and Virgo shows you what your environment is doing to your health.",
      "You take in and amplify the energy around you, which makes you a rare barometer of your environment and deeply wise about people. You are designed to change day to day rather than stay fixed.",
      "Virgo brings your attention to the body and the daily rhythm, and because you sample everything around you, this season makes it very clear which rooms, people and routines leave you well and which ones quietly make you unwell. What you notice now is real information rather than fussiness.",
      "Track how you feel across the whole month rather than judging any single day, and change the environments that keep showing up on the wrong side of that list. Give any big decision the full lunar cycle, and let your routine be gentler and more flexible than everyone else's."
    ),
  },

  typeStrategy: {
    Manifestor: [
      "Finish the thing you started and left, this season rewards completion over launch.",
      "Inform people once and clearly, then get on with the work without the running commentary.",
      "Build one simple system so your next move does not run on adrenaline alone.",
      "Take the rest between bursts seriously, your body is the thing keeping score this season.",
    ],
    Generator: [
      "Respond, then repeat, the yes only counts if it survives the boring middle.",
      "Build your week around the work you would still do on a flat day.",
      "Let the things that only ever ran on hype go quiet without guilt.",
      "Improve one thing you already have instead of starting something new to feel fresh.",
    ],
    "Manifesting Generator": [
      "Pick one or two things and take them all the way to done before you add anything.",
      "Keep skipping the steps that never mattered, go back for the ones that keep breaking.",
      "Notice the difference between a real pivot and running from the unglamorous part.",
      "Bank a finished thing early, it changes how the rest of the season feels.",
    ],
    Projector: [
      "Get precise about what you can see, specific insight gets invited, vague insight gets ignored.",
      "Say yes to the invitations that want your discernment and no to the ones that want your hours.",
      "Study one system deeply this season, it becomes the thing you are known for.",
      "Guard your energy, a productive season is the easiest one to overwork inside.",
    ],
    Reflector: [
      "Track how you feel across the month, the pattern is the data, not any single day.",
      "Change the one environment that keeps leaving you depleted.",
      "Keep your routine flexible, a rigid system will not fit how you are designed to move.",
      "Give the big decisions the full cycle, this season is patient enough to let you.",
    ],
  },

  authorityLens: {
    emotional: block(
      "Your truth arrives over time, and Virgo is happy to wait with you.",
      "Your Solar Plexus is defined, so you feel life as an emotional wave that rises and falls. Your clarity lives in the pattern across that wave, never in a single high or low moment.",
      "Virgo suits you better than the fast seasons do, because the whole month rewards taking your time. The trap here is different, the low end of your wave sounds exactly like honest self-assessment now, and you can mistake a dip for a clear-eyed verdict on your life.",
      "Sleep on every real decision and feel it high, low and neutral before you move. When you catch yourself auditing your whole life at the bottom of the wave, write it down and revisit it three days later, because almost none of it will still be true."
    ),
    sacral: block(
      "Your gut answers in the moment, and Virgo asks it about the daily things.",
      "Your Sacral responds instantly in the body, a lift of energy for yes and a flat drop for no. It speaks before your mind does, in pull and in sound rather than in reasoned argument.",
      "Virgo hands your mind a very convincing script about what you should be doing, and that script is loud enough to talk over your body. The questions this season are smaller and more constant, about routines, foods, hours and habits, so your gut is being asked something almost every hour.",
      "Ask yourself yes or no questions about the actual day, does this routine still have a yes in it, does this commitment lift you. Follow the lift and treat the flat, dutiful should as the no that it is, even when the should is very well argued."
    ),
    splenic: block(
      "Your knowing is instant and quiet, and Virgo will try to talk it out of you.",
      "Your Spleen gives you an in-the-moment intuition about what is right for your health, safety and timing. It is soft, it speaks once, and it does not repeat or justify itself.",
      "This is your season on paper, because the Spleen is the health and wellbeing centre and Virgo turns everything toward the body. The risk is that Virgo also hands you analysis, and analysis is exactly the thing that overrides a signal that refuses to explain itself.",
      "Act on the first quiet hit before your mind builds its case, especially about food, rest, people and timing. When you notice yourself researching something your body already answered, stop researching and go with the first answer."
    ),
    ego: block(
      "Virgo backs devotion, so promise only what you will actually keep.",
      "Your decisions run through your Heart, the seat of willpower, worth and genuine desire. The real question under every choice is whether you actually want it and have the heart to see it through.",
      "Virgo is a season of commitments, systems and follow-through, which is exactly where an over-promise costs you most. The pressure now is to prove your discipline, and a promise made to look disciplined will drain you by week three.",
      "Listen to what you spontaneously say out loud, your voice reveals your true wants before your mind edits them. Make fewer, smaller commitments that you genuinely want, keep them completely, and let that be the evidence rather than a heroic list you abandon."
    ),
    self: block(
      "You hear your truth out loud, and Virgo wants it specific.",
      "Your authority runs through your G centre, your identity and direction, and it comes out through your voice. You do not think your way to clarity, you talk your way there.",
      "Virgo pulls you toward planning and organising on paper, which is not how you actually reach clarity. A tidy written plan can look like a decision while you have not yet heard yourself say the true thing out loud.",
      "Talk the decision through with people who let you hear yourself rather than steer you, and notice which direction your own words keep returning to. Write the plan after you have spoken it, not instead."
    ),
    mental: block(
      "Clarity comes from the right rooms, and Virgo is asking about your rooms.",
      "You have no single inner authority, so you are designed to reach clarity through open conversation in the right environment. You are a sounding board by design, and your wisdom surfaces out loud over time.",
      "Virgo turns the focus to environment, routine and what your daily life is actually made of, which is unusually useful for you because environment is the whole mechanism of your clarity. What you have been calling indecision is often just the wrong room.",
      "Talk decisions through with a few trusted people, and pay real attention to where you are when the clearest thought lands. Change the environments that consistently muddy you, that single change does more for your decision-making than any amount of thinking harder."
    ),
    lunar: block(
      "Give the big things a full month, and let Virgo make it a gentle one.",
      "As a Reflector, your clarity comes over a full lunar cycle. Because you sample the energy around you, a decision needs to be felt across roughly 28 days, through every mood, before it is truly yours.",
      "Virgo will hand you a plan and a deadline for your own becoming, and a rigid schedule is the fastest way to make you feel broken for changing day to day. Your consistency looks different from everyone else's and it always will.",
      "Take the full cycle on anything that matters, and build a routine with room in it rather than a regime. Notice how the same choice feels in different weeks and different rooms, the answer that survives the whole month is the real one."
    ),
  },

  profileLens: {
    "1/3": block(
      "You research it properly, then find out what actually breaks.",
      "Line 1 needs a solid foundation of knowledge to feel secure, and line 3 learns through trial and error, discovering what works by bumping into what does not. You are a researcher who tests everything in practice.",
      "Virgo is built for exactly how you learn, because this is the season of refining through repetition. The study you do now becomes real expertise, and the things that fall apart are showing you where the system was weak rather than where you were.",
      "Go deep on the one subject that keeps calling you, then test it in real conditions and keep notes on what failed. Treat every broken attempt as the specification for the next version, that is how your authority gets built."
    ),
    "1/4": block(
      "You build the expertise, and your people put it to work.",
      "Line 1 needs to know its subject inside out, and line 4 lives through relationships, so your opportunities arrive through people you already know rather than cold pitches.",
      "Virgo rewards being genuinely good at the thing, and this season the useful, practical version of your knowledge is what travels through your network. Quiet competence gets talked about now.",
      "Do the deep work until you actually know it, then tell a few of the right people what you can do. Tend the relationships you already have rather than chasing new rooms, your next opportunity is usually one conversation away."
    ),
    "2/4": block(
      "A natural gift, and a season that asks you to practise it.",
      "Line 2 carries talents that feel effortless and needs regular time alone to recharge and develop them, and line 4 thrives through your network. You get called out of your cave by the people who see what you have.",
      "Virgo turns your natural talent into a craft, which only happens in the hours nobody watches. This season protects your cave rather than dragging you out of it, as long as you are actually using the time.",
      "Take the alone time without guilt and put it into the gift rather than into avoidance, and let the few people who genuinely see you call you out for the right things."
    ),
    "2/5": block(
      "A natural talent everyone wants to put to work.",
      "Line 2 holds effortless gifts and needs solitude, and line 5 gets projected onto as a practical fixer people expect to save the day.",
      "Virgo is the season of practical solutions, so the projections onto you get more specific and more constant now. People will bring you problems they have decided you can fix, and some of them are not yours.",
      "Guard your alone time fiercely and be deliberate about what you take on. Deliver properly when you say yes, be honest and early when the answer is no, and let the reputation you build be accurate rather than heroic."
    ),
    "3/5": block(
      "You learned it the hard way, and this season people want the method.",
      "Line 3 finds truth through trial and error, and line 5 is projected onto as a practical, universal problem-solver. You turn hard-won lessons into solutions others can use.",
      "Virgo wants what works, which is exactly the currency you deal in. The mess you went through has become a method, and this is the season it is genuinely valuable to other people.",
      "Write down what you actually learned from the things that went wrong and offer that as the practical thing it is. Manage expectations honestly, promise only what you can deliver, and let the lived version of your knowledge do the talking."
    ),
    "3/6": block(
      "You experiment hard early, then become the working example.",
      "Line 3 learns through trial and error, and line 6 matures across three life phases into a role model, so your messy early experiments are building the wisdom you later embody.",
      "Virgo is a season for repair and for practice, both of which suit you. If you are in your early phase, expect useful failures, and if you are maturing, notice how much people are learning from the way you run your ordinary days.",
      "Be gentle with yourself through the trial-and-error years, they are gathering your material. As you mature, let your daily life be the demonstration, because people are watching how you live far more than what you say."
    ),
    "4/6": block(
      "You move through relationships, and this season you tend them properly.",
      "Line 4 moves through your network, so life unfolds through the people you are bonded to, and line 6 grows into a role model across three phases.",
      "Virgo brings maintenance energy to everything, including your relationships, and the ones you have let drift are exactly what this season wants you to repair. Your network is your infrastructure, and infrastructure needs upkeep.",
      "Reach out to the handful of people who matter and actually follow through on what you promised them. Live in a way you would be happy for someone to copy, because with a 6 line they are copying it."
    ),
    "4/1": block(
      "A fixed way of working that quietly steadies everyone around you.",
      "This is the one Juxtaposition profile, unusually fixed in how it operates. Line 4 lives through relationships and line 1 needs a deep foundation, so you have a stable way of being that influences the people around you.",
      "Virgo suits your fixedness completely, because a season about systems and consistency is a season built for someone who already works the same way every day. Your routine is the thing others borrow from now.",
      "Deepen your expertise and let it move through your close network. Stop trying to be more flexible than you are, your steadiness is the contribution, and surround yourself with people who value exactly how you work."
    ),
    "5/1": block(
      "People bring you problems, so make sure your solutions are real.",
      "Line 5 is projected onto as a practical rescuer people expect to fix things, and line 1 needs a solid foundation of knowledge to feel secure. You are the trusted expert called in a crisis.",
      "Virgo increases the number of practical problems in front of everybody, and you are the person they will bring them to. The projection gets heavier in a season that values fixing things.",
      "Do the deep work so your solutions genuinely hold, then choose carefully which problems you take on. Protect your reputation by delivering only what you truly can, and let the rest go to someone else."
    ),
    "5/2": block(
      "A natural talent the world keeps calling on to fix things.",
      "Line 5 gets projected onto as a universal problem-solver, and line 2 holds effortless gifts and needs solitude. You have real talent people keep pulling you out of your cave to use.",
      "Virgo increases both the calls on your talent and your need for the quiet hours that keep it sharp, so the pull in two directions gets sharper this season.",
      "Protect the alone time, it is not optional, and choose your rescues carefully. Let the right people call you out for the right things, and say no clearly to everything else."
    ),
    "6/2": block(
      "You are becoming the example, in your own time and your own way.",
      "Line 6 matures through three life phases into a role model, and line 2 carries natural gifts and needs solitude. You are building, often quietly, toward a way of living others learn from.",
      "Virgo is a quiet, practical season, which is where your kind of authority actually gets built. Nothing about this month asks you to perform, it asks you to live well enough that living well becomes the point.",
      "Honour retreat before you step forward, and let your standards be about self-respect rather than proving anything. In time people look to how you live, so keep building a life you would stand behind."
    ),
    "6/3": block(
      "You lived it all the way through, and now you show the working.",
      "Line 6 grows into a role model across three phases, and line 3 learns by trial and error. Your lived experience is exactly what makes you a believable, grounded example.",
      "Virgo rewards honesty about what actually worked, and yours is hard-earned. The unglamorous parts of your story are the most useful parts of it this season.",
      "Let the early experimentation stand without shame, it is your credibility. Share the practical version of what you went through, because that is what makes people trust you."
    ),
  },

  centreLens: {
    head: {
      defined: block(
        "A steady source of questions, aimed at something useful now.",
        "You carry a consistent source of inspiration and mental pressure, and you can inspire others with the questions you ask.",
        "Virgo points your questions at the practical, so the things you wonder about now tend to be about how something actually works.",
        "Follow the questions that lead somewhere you can act, and let the interesting ones that go nowhere stay unanswered without it bothering you."
      ),
      open: block(
        "You absorb everyone's worries, so sort them from yours.",
        "Your Head is open, so you take in and amplify other people's questions and mental pressure, which makes you impressionable to what is not yours.",
        "Virgo hands the whole collective a list of things to fix, and you will pick up every item on everyone else's list along with your own.",
        "Write down what you are worrying about and mark what is genuinely yours to solve, then put the rest down deliberately rather than carrying it by default."
      ),
    },
    ajna: {
      defined: block(
        "A steady mind, and a season that wants it applied.",
        "You process information and form views in a fixed, reliable way, which makes you mentally consistent.",
        "Virgo is analytical, and your fixed framework can either organise the season beautifully or lock you into one way of doing things.",
        "Use your framework to build the system, and stay willing to update it when the evidence says the system is not working."
      ),
      open: block(
        "A flexible mind, so drop the pressure to have it all worked out.",
        "Your Ajna is open, so you think flexibly and can hold many perspectives, and you may feel pressure to appear certain.",
        "Virgo makes not having a plan feel like a personal failing, and you will be tempted to lock down a rigid system just to feel sure.",
        "Let the plan stay loose and get comfortable saying you are still working it out, your flexibility is what lets you find what actually fits."
      ),
    },
    throat: {
      defined: block(
        "A reliable voice, best used on the specific thing.",
        "You have a reliable voice and a consistent way of expressing and getting things done.",
        "Virgo rewards precision, so what you say lands harder now when it is concrete rather than sweeping.",
        "Speak and act with your strategy and authority, and choose the exact word rather than the impressive one."
      ),
      open: block(
        "Speak when there is something worth saying, not to prove you are on it.",
        "Your Throat is open, so you can channel many ways of expressing, and you may feel pressure to speak or act to get noticed.",
        "Virgo turns that pressure into announcing your plans and progress, which quietly spends the energy you needed for doing the thing.",
        "Wait for the right moment or the invitation, and let the finished work be the announcement."
      ),
    },
    g: {
      defined: block(
        "A steady compass, and a season for aligning the daily life to it.",
        "You have a fixed sense of who you are and where you are going, a reliable inner direction.",
        "Virgo asks whether your ordinary week actually matches that direction, which is a question you can answer honestly because the direction itself is stable.",
        "Look at how you spend a normal Tuesday and change one thing that does not match where you are going."
      ),
      open: block(
        "A fluid identity, so build the routine around the right rooms.",
        "Your G is open, so your sense of self and direction is shaped by where and who you are around, which makes you adaptable and a mirror for others.",
        "Virgo will hand you a self-improvement plan for a fixed identity you do not have, and you can end up optimising toward someone else's life.",
        "Choose your environments and people deliberately, and let your routine follow the rooms that make you feel like yourself."
      ),
    },
    heart: {
      defined: block(
        "Real willpower, so spend it on a few promises you keep.",
        "You have reliable willpower and can make and keep promises when you genuinely want to.",
        "Virgo is full of commitments, and your capacity to follow through will be asked for constantly this season.",
        "Promise less than you could and keep every bit of it, and rest on purpose before your body makes you."
      ),
      open: block(
        "Your worth is not the thing being tested this season.",
        "Your Heart is open, so you do not have consistent willpower on tap, and you can feel a pull to prove your worth.",
        "Virgo is the season most likely to convince you that discipline equals worth, and a missed day feels like evidence about who you are.",
        "Make fewer hard promises and let a broken streak be a broken streak. Your worth was never on the line, and it is not measured in consistency."
      ),
    },
    sacral: {
      defined: block(
        "A renewable engine, best spent on the repetition that matters.",
        "You have a deep, renewable engine of energy for the work and life you love, meant to be spent fully each day.",
        "Virgo asks your engine to go into the unglamorous middle of things rather than into new beginnings.",
        "Spend it fully on the work that still has a gut yes in it, and let the things that only ever had a mental yes stop."
      ),
      open: block(
        "Not built to grind, and this is the grinding season.",
        "Your Sacral is open, so you do not have consistent life-force energy and can amplify other people's, then overwork without noticing.",
        "Virgo's productivity energy is contagious, and you will borrow it and keep going long past the point your own body wanted to stop.",
        "Notice when the energy you are running on is not yours, decide in advance when you will stop, and rest before you are empty rather than after."
      ),
    },
    solarplexus: {
      defined: block(
        "A vivid wave, and a season that mistakes your low for the truth.",
        "You experience life as an emotional wave moving through highs and lows, and it is also your decision-making authority.",
        "Virgo gives your low end a very articulate voice, so the dip arrives sounding like an honest audit of your whole life.",
        "Feel the wave fully and refuse to make decisions or judgements at the bottom of it, wait until it settles and see what is still true."
      ),
      open: block(
        "You are carrying the room's tension about not being on top of things.",
        "Your Solar Plexus is open, so you absorb and amplify the emotions around you, and can avoid conflict to keep the peace.",
        "Virgo has everyone quietly anxious about their own standards, and you will pick that up and experience it as your own inadequacy.",
        "Notice when the anxiety arrived the moment you walked into a room, and put it down. Do not reorganise your life to soothe a feeling that was never yours."
      ),
    },
    spleen: {
      defined: block(
        "A quiet instinct about your body, and this season it is loud enough to hear.",
        "You have a consistent, quiet intuition and a steady instinct for health and safety.",
        "Virgo turns everything toward the body, which is your home ground, so your instincts about food, rest and pace are unusually clear now.",
        "Trust the first signal, especially about health, and act on it before your mind starts negotiating."
      ),
      open: block(
        "Watch for health anxiety dressed up as being responsible.",
        "Your Spleen is open, so you can become wise about health and survival, and you may hold onto things out of fear of letting go.",
        "Virgo plus an open Spleen can turn wellness into worry, with endless research, tracking and fear about what might be wrong.",
        "Take the simple, boring health actions and stop there. Let go of the habit or the routine you know is not serving you, and let the fear of releasing it be fear rather than truth."
      ),
    },
    root: {
      defined: block(
        "Steady under pressure, so use it to build the system.",
        "You handle pressure and stress in a steady, reliable way, with a consistent drive to get going.",
        "Virgo hands everyone a to-do list, and you can carry that pressure without it running you.",
        "Use the pressure to build something that lasts past the season, and remember most people cannot work at your pace."
      ),
      open: block(
        "The rush to get on top of everything is contagious.",
        "Your Root is open, so you take in and amplify pressure, and can rush to get things done just to feel free of it.",
        "Virgo's to-do list energy is exactly the kind of pressure you amplify, and you will hurry through a whole month of tasks trying to reach a finish line that keeps moving.",
        "Pick three things that matter and let the rest wait, and notice that the pressure never actually ends when the list does, so you may as well slow down now."
      ),
    },
  },

  crossLens: {
    "Right Angle": block(
      "This season serves your own becoming, one ordinary day at a time.",
      "Your incarnation cross is a personal destiny, so your path is fundamentally about your own growth and experience, with others in supporting roles.",
      "Virgo hands you a chapter to work on your own life, your health and the daily conditions you live in, which is exactly the private work your path is made of.",
      "Give yourself permission to focus on your own life without calling it selfish, the improvement you make here is the contribution."
    ),
    "Left Angle": block(
      "This season moves your purpose through the people you help.",
      "Your cross is a transpersonal karma, so your life is intertwined with others and your purpose plays out through relationships and encounters.",
      "Virgo is the season of being useful, and the practical help you give and receive now is how your mission actually moves.",
      "Watch who arrives needing exactly what you can do, and stay open to where that leads, even when it looks smaller than the plan you had."
    ),
    Juxtaposition: block(
      "This season sharpens your one fixed lane into a practice.",
      "Your cross is a fixed fate, a single concentrated theme you are here to embody, with an unusually stable way of being.",
      "Virgo rewards depth over range, so the one lane that is truly yours gets better rather than wider this season.",
      "Lean into your fixed nature and refine the one thing rather than adding to it, mastery is the point now."
    ),
  },

  challenge: {
    Manifestor: "Finish one thing you started and abandoned, and tell the people it affects that it is done.",
    Generator: "Keep one daily practice you genuinely want for the whole season, and notice what it changes.",
    "Manifesting Generator": "Complete one project all the way to done before you allow yourself to start anything new.",
    Projector: "Pick one system you can see clearly and write down exactly what is wrong with it, then wait to be asked.",
    Reflector: "Track your energy every day for a lunar cycle and change the one environment that keeps draining you.",
  },

  businessLens: {
    Manifestor: block(
      "Systemise what you already built.",
      "In business you are built to initiate, to start the thing and set it in motion rather than wait for demand to appear.",
      "Virgo is not a launch window, it is the window where the thing you launched gets an actual backend so the next launch does not cost you your health.",
      "Document the process, fix the part that always breaks, and finish the offer you left at eighty percent. Inform your people once it is ready rather than narrating the build."
    ),
    Generator: block(
      "Improve the offer that already works.",
      "You build a business by responding to what genuinely lights you up and what the market is actually asking for, and your energy is what sells it.",
      "Virgo turns attention to delivery and quality, so the money this season sits in making your existing offer better rather than inventing a new one.",
      "Ask your customers what could be better and respond to what they tell you, and put your energy into the repeat parts of the work rather than the launch parts."
    ),
    "Manifesting Generator": block(
      "Finish the half-built thing, it is worth more than a new idea.",
      "You run a business best by experimenting across several things and following the ones with real energy, pivoting quickly.",
      "Virgo makes the cost of unfinished work visible, and you probably have two or three things that are one week of effort away from earning.",
      "Choose the closest-to-done project and complete it properly, then tidy the systems underneath the things you are keeping and let the rest go."
    ),
    Projector: block(
      "Sell the fix, and wait to be invited to give it.",
      "Your business gift is guiding, seeing what others miss and being recognised for that expertise.",
      "Virgo is the season people actually pay for diagnosis and improvement, which is your natural work.",
      "Make what you can see specific and visible where the right clients are looking, then wait for the invitation. Price the insight, not the hours."
    ),
    Reflector: block(
      "Audit the business before you commit to anything.",
      "You sense trends and the health of a market unusually well, and you thrive in the right business environment.",
      "Virgo gives you a season to review rather than decide, and what you notice across the month is more accurate than any single week.",
      "Review your numbers, your clients and your environment across the full cycle, and let the pattern make the decision for you."
    ),
  },

  relationshipsLens: {
    Manifestor: block(
      "Do the thing you said you would do.",
      "In relationships you need freedom and you move first, which can feel intense to others when you do not explain.",
      "Virgo measures relationships in follow-through rather than in grand gestures, and the people close to you will feel the difference immediately.",
      "Inform people before you act, then actually do what you said. Small kept promises repair more than a big apology does."
    ),
    Generator: block(
      "Give your energy to the people who are still a yes on an ordinary day.",
      "You give the best of your energy to the people and connections that genuinely light you up.",
      "Virgo strips out the performance, so the connections that only worked when something exciting was happening will feel noticeably flat now.",
      "Respond to the people who lift you in ordinary conversation and let the ones that only ever ran on novelty go quiet."
    ),
    "Manifesting Generator": block(
      "Show up when you said you would.",
      "You bring fast, playful, multi-faceted energy to relationships and get restless with the flat ones.",
      "Virgo asks for reliability, which is the part your speed usually skips, and the people close to you have noticed.",
      "Keep the plans you make, tell people early when you are changing course, and let consistency be the new thing you bring them."
    ),
    Projector: block(
      "Be useful where you are wanted, not everywhere you can see.",
      "You thrive with people who recognise and invite you, and you wilt where you feel unseen or used for output.",
      "Virgo will show you exactly what is wrong in everyone's life, and offering that uninvited is the fastest way to be resented this season.",
      "Hold what you can see until you are asked, and spend your time with people who genuinely want your insight rather than tolerate it."
    ),
    Reflector: block(
      "Notice who leaves you well.",
      "You take on the emotional climate of whoever you are around, so your relationships shape your whole experience.",
      "Virgo turns your attention to health, and the clearest health data you have is how your body feels after time with each person.",
      "Keep track of who you feel good around across the month and adjust your time accordingly, that record is more reliable than your opinion of anyone."
    ),
  },

  moneyLens: {
    Manifestor: block(
      "Fix the leaks, then start the next thing.",
      "You make money by starting things and creating new streams, in bursts rather than a steady grind.",
      "Virgo is a maintenance season for money, where the boring admin you have avoided is worth more than a new idea.",
      "Go through the numbers, cancel what you are not using, chase what you are owed and price properly. The shadow is boredom with the admin, which is exactly where the money is hiding."
    ),
    Generator: block(
      "The money is in the repeat, not the launch.",
      "You earn most when you are doing work you genuinely love, your lit-up energy is the real asset.",
      "Virgo rewards refining what already earns, so a better version of your current work pays more than a new direction now.",
      "Improve the thing people already buy and keep responding to what they ask for. The shadow is quietly resenting the work because it is no longer new."
    ),
    "Manifesting Generator": block(
      "Bank the unfinished thing.",
      "You can earn across several things at once and move fast between them.",
      "Virgo makes the gap between what you started and what you actually finished very obvious, and that gap is usually where your money went.",
      "Complete the closest thing to done and get paid for it before you start anything else. The shadow is a new idea arriving right as the finishing gets dull."
    ),
    Projector: block(
      "Get paid for seeing what is broken.",
      "You earn best being recognised and invited for your expertise, not by grinding output.",
      "Virgo is when people pay for diagnosis, systems and improvement, which is the work you are actually built for.",
      "Price your discernment, take the invitations that want it, and stop trading hours. The shadow is over-delivering to justify the fee."
    ),
    Reflector: block(
      "Review the money across the whole month.",
      "You read financial timing and the right opportunities well when you are not rushed.",
      "Virgo gives you a patient season to look at where the money actually goes rather than decide anything dramatic.",
      "Track your income and spending for a full cycle and let the pattern speak. The shadow is being rushed into a financial commitment before the cycle is done."
    ),
  },

  shadowIntro:
    "Virgo season shines a light on where you turn self-improvement into self-punishment. Your open centres are where you take in and amplify the world, so they are where this season's pressure, comparison and old patterns show up loudest, usually disguised as being responsible or having high standards. Naming them is how you stop unconsciously running on them.",

  shadowByOpenCentre: {
    head: "A head full of other people's problems to solve, and a to-do list of worries that were never yours to carry.",
    ajna: "Pressure to have a system and a plan for everything, so you build rigid rules just to feel certain and then feel like a failure for breaking them.",
    throat: "Announcing what you are about to do and how organised you are becoming, spending the energy that the actual work needed.",
    g: "Optimising yourself toward a life that belongs to someone else, and losing your own direction inside a self-improvement plan.",
    heart: "Measuring your worth in discipline and consistency, so one missed day becomes evidence about who you are.",
    sacral: "The big one this season, working past your limit because everyone around you seems to be producing, and calling the exhaustion productivity.",
    solarplexus: "Absorbing the room's low-level anxiety about not being on top of things and experiencing it as your own inadequacy.",
    spleen: "Health worry dressed up as being responsible, endless researching and tracking, and clinging to a routine you already know is not working.",
    root: "A contagious rush to get on top of everything, hurrying through a list that quietly refills the moment you finish it.",
  },

  practices: {
    emotional: {
      tapping: "Tap the side of your hand: even though I am judging my whole life right now, I know this is the low end of my wave and not the truth.",
      breathwork: "Box breathing, four counts in, hold four, out four, hold four, for two minutes before you decide anything you would call an overhaul.",
      journal: "What am I certain about at the bottom of the wave, and does any of it still hold three days later?",
      reset: "When the audit starts, write the list, close the notebook and put a hand on your chest until the wave moves. The list will still be there when it does.",
    },
    sacral: {
      tapping: "Tap your collarbone: my body knows which routines are a yes, and a should is not a yes.",
      breathwork: "Two quick belly breaths, then ask out loud whether a habit is still a yes and feel the lift or the drop.",
      journal: "Which parts of my week did my body actually want, and which ones did I do out of duty?",
      reset: "Shake out your whole body for thirty seconds to discharge the day's tension, then feel what your gut wants next rather than what the list says.",
    },
    splenic: {
      tapping: "Tap the side of your hand: I trust the first quiet signal about my body, it does not need to justify itself.",
      breathwork: "One long slow exhale, twice as long as the inhale, to drop below the analysis and hear the instinct underneath it.",
      journal: "What did my body tell me this week before my mind started researching, and did I listen?",
      reset: "Pause, soften your belly, and take the first simple action your instinct offers instead of opening another tab about it.",
    },
    ego: {
      tapping: "Tap your heart centre: I keep the promises I actually want to keep, and my worth is not measured in discipline.",
      breathwork: "Hand on heart, three slow breaths, and ask whether you want this commitment or want to look like the kind of woman who makes it.",
      journal: "What did I promise this week, and which of those promises did my heart actually want?",
      reset: "When you feel the pull to commit to one more thing, pause with a hand on your chest until the urge to prove your discipline passes.",
    },
    self: {
      tapping: "Tap your throat: my clarity comes when I speak it, a tidy plan on paper is not the same as knowing.",
      breathwork: "Three grounding breaths, then say the plan out loud and listen to how much of it your body agrees with.",
      journal: "If I talk this week out loud, what do I keep returning to, and what have I written down but never mentioned?",
      reset: "Voice-note a trusted person and talk the plan through, listening to yourself more than to them.",
    },
    mental: {
      tapping: "Tap the side of your hand: my clarity comes from the right rooms, and I am allowed to change the room.",
      breathwork: "Slow breathing while you move to a different space, and notice how the same decision feels there.",
      journal: "Where was I when my thinking felt clearest this week, and where does it always get muddy?",
      reset: "Physically change environment and talk it through with someone you trust rather than sitting with it alone for one more hour.",
    },
    lunar: {
      tapping: "Tap your collarbone: I take the full cycle, and my consistency is allowed to look different from everyone else's.",
      breathwork: "Long, slow breaths in a place that feels genuinely good, and let yourself feel the decision instead of solving it.",
      journal: "How does this feel this week compared with last week, and what does the whole month say?",
      reset: "Change your environment and notice what your body does there, your clarity moves with the moon and the room.",
    },
  },

  affirmationByType: {
    Manifestor: "I finish what I start, I inform my people, and I rest without earning it.",
    Generator: "I give my energy to what still feels good on an ordinary day, and I let the rest go.",
    "Manifesting Generator": "I complete the thing I care about, and my speed is allowed to include finishing.",
    Projector: "My discernment is valuable, and I share it when it is asked for.",
    Reflector: "I move at my own pace, and my environment is the first thing I take care of.",
  },

  weeklyQuestions: [
    "What did I actually finish this week, and what am I still carrying unfinished?",
    "Where did I follow my strategy to {strategy}, and where did I push because I felt behind?",
    "Did I honour my {authority} way of deciding, or did I let a plan on paper decide for me?",
    "Which part of my routine gave me energy this week, and which part quietly took it?",
    "Where did I turn improving myself into criticising myself?",
    "What is one small thing I can make easier for next week?",
  ],
};
