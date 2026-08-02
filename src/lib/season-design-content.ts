// Leo Season, read through Human Design. This is the ONE file that changes per
// season. Everything here is Leo-specific framing; the engine and all the natal
// Human Design logic stay the same for every future season.
//
// Each element opens into three layers so the reading is a real coaching read, not
// a one-liner: identity (who you are here), cycle (how Leo moves it for you) and
// guidance (what to do). Voice: warm, conversational, practical. No em dashes, no
// rhetorical questions.

import type { SeasonDesign, SeasonBlock } from "@/types/season-design";

const block = (summary: string, identity: string, cycle: string, guidance: string): SeasonBlock => ({
  summary,
  identity,
  cycle,
  guidance,
});

export const LEO_SEASON: SeasonDesign = {
  sign: "Leo",
  title: "Leo Season",
  element: "fire",
  intro:
    "Leo season turns the collective volume up on confidence, creativity and being seen. The Sun is home in Leo, so for everyone this is the part of the year that asks you to stop shrinking, take up your space, and let your presence be the point. It is warm, expressive, playful, courageous energy, the season of your main character era.",
  encouraging:
    "This season is encouraging visibility, self-expression, leadership, creativity and courage. It rewards the woman who lets herself be looked at doing well, rather than downplaying it.",
  activates: ["confidence", "creativity", "visibility", "leadership", "self-expression", "courage"],

  typeLens: {
    Manifestor: block(
      "You are the initiator, and Leo hands you the green light to begin.",
      "You are one of the rare few designed to start things from your own inner spark, without waiting for a cue. Your energy comes in fast, closed bursts that are meant to make an impact and then rest, not to hum along steadily like everyone else's.",
      "Leo pours fuel on your urge to begin. The impulse to launch, speak, lead or make a bold move runs hotter than usual now, and the collective is primed to follow visible, courageous action. Expect surges of energy followed by real dips, that rhythm is normal for you and sharper this season.",
      "When the urge comes, inform the people it affects and then move, do not wait for permission. Use the visibility on offer to be seen initiating, and protect hard rest between your bursts so you do not burn the season out early."
    ),
    Generator: block(
      "You are the life force, and Leo asks you to be seen doing what you love.",
      "You carry a deep, renewable engine of energy that is designed to be spent on work that genuinely lights you up. In the right thing your energy is endless and magnetic, in the wrong thing it drains and goes flat.",
      "Leo turns up the invitations and the spotlight. More exciting things arrive to respond to now, and your lit-up energy pulls people toward you. The trap this season is forcing visibility or saying yes to the wrong shiny thing just because it is on offer.",
      "Wait for something to respond to, then follow the gut yes and pour your whole engine in. Let the flat, forced options go, and let people catch you glowing in what you actually love rather than performing for attention."
    ),
    "Manifesting Generator": block(
      "You are the multi-passionate powerhouse, and Leo is built for your speed.",
      "You have the Generator's renewable engine plus a fast wiring to action, so you move quickly, juggle several things and skip steps other people need. You are efficient, not scattered, even when linear people struggle to keep up.",
      "Leo loves your speed and your many passions at once. Energy and opportunities come fast now, and being visibly multi-passionate is rewarded rather than judged. The risk is starting ten exciting things and finishing none as the season revs you up.",
      "Respond first, get the gut yes, then move fast and inform people before you leap. Let yourself pivot the instant the energy drops, and circle back to finish the one or two things that genuinely matter."
    ),
    Projector: block(
      "You are the guide, and Leo turns the spotlight toward you to be recognised.",
      "You are here to see people and systems clearly and to guide them, not to output energy all day. Your gift is penetrating insight, and it lands best when it is invited and recognised rather than pushed.",
      "Leo increases your visibility and the chances to be seen, which is exactly the soil your invitations grow in. This is not a do-more season for you, it is a be-recognised season. Watch the temptation to grind for attention and burn through energy you do not have.",
      "Position yourself where the right people can see you, then wait for the invitation for the big things. Share your insight when it is asked for, and guard your energy fiercely, presence matters more than hours this season."
    ),
    Reflector: block(
      "You are the mirror, and Leo will feel as bright as the room you stand in.",
      "You take in and amplify the energy around you, which makes you a rare barometer of your environment and deeply wise about people. You are designed to change day to day rather than stay fixed.",
      "Leo energy is loud and warm, and you feel it most through the people and places you are around this season. The same day can feel completely different depending on where you are, and that is the design working, not you being inconsistent.",
      "Choose your environments and company with real care this season, because you become them. Give any big decision the full lunar cycle before you commit, and let yourself experience Leo differently from everyone around you."
    ),
  },

  typeStrategy: {
    Manifestor: [
      "Initiate the thing you have been circling, this season rewards the first move.",
      "Stop over-explaining yourself, inform people what you are doing and let them catch up.",
      "Create momentum early, one bold start sets the tone for the whole season.",
      "Use the visibility on offer, being seen initiating is exactly on-brand for you now.",
    ],
    Generator: [
      "Say yes to what genuinely lights you up, and let the flat, forced options go.",
      "Respond to the opportunities showing up, do not manufacture them from thin air.",
      "Let excitement lead, your gut yes is the compass this season.",
      "Be visible while doing what you love, that is when your energy pulls people in.",
    ],
    "Manifesting Generator": [
      "Experiment freely, try the several things calling you without forcing one lane.",
      "Pivot the moment the energy drops, that is information, not failure.",
      "Move quickly and skip the steps that do not matter, then inform people before you leap.",
      "Let yourself be publicly multi-passionate, it is a feature this season, not a flaw.",
    ],
    Projector: [
      "Position yourself where the right people can see you, then wait to be invited.",
      "Share your insight when it is asked for, invited wisdom lands, uninvited wisdom gets resented.",
      "Be visible without overworking, presence matters more than output this season.",
      "Guard your energy, you do not have to earn recognition by grinding.",
    ],
    Reflector: [
      "Choose your environments deliberately, they decide how this whole season feels.",
      "Watch the timing, notice how the same choice feels across the lunar cycle.",
      "Give big decisions the full month before you commit.",
      "Let yourself reflect the season back rather than perform it.",
    ],
  },

  authorityLens: {
    emotional: block(
      "Your truth arrives over time, so Leo's excitement is not your signal.",
      "Your Solar Plexus is defined, so you feel life as an emotional wave that rises and falls. Your clarity lives in the pattern across that wave, never in a single high or low moment.",
      "Leo makes everything feel thrilling in the moment, which is exactly why the season tempts you into fast yeses you later regret. The highs run higher and the invitations more exciting now.",
      "Never decide anything major on the spot. Sleep on it, feel it high, low and neutral, and only move when it is still a yes after the wave has settled. A simple I need to sit with this buys you the time."
    ),
    sacral: block(
      "Your gut answers in the moment, and Leo gives it plenty to answer.",
      "Your Sacral responds instantly in the body, a lift of energy for yes and a flat drop for no. It speaks before your mind does, in pull and in sound, not in reasoned argument.",
      "Leo turns up the number of things to respond to, so your gut gets a lot of practice this season. The noise and hype can drown out the quiet body signal if you let your head take over.",
      "Let people ask you yes or no questions and catch the immediate gut response before your mind jumps in. Follow the lift, not the hype, and trust the flatness as a real no even when the thing looks good on paper."
    ),
    splenic: block(
      "Your knowing is instant and quiet, and Leo is loud enough to drown it.",
      "Your Spleen gives you an in-the-moment intuition about what is right for your health, safety and timing. It is soft, it speaks once, and it does not repeat or justify itself.",
      "Leo season is fast and noisy, which makes that quiet first hit easy to miss or override with logic, and then regret. The pace can push you to act against a subtle no.",
      "Act on the first quiet signal without waiting for it to argue its case. Practise catching it in small moments so you trust it under pressure, and honour a felt no even when you cannot explain it."
    ),
    ego: block(
      "Leo backs heart-led desire, so choose only what you truly want.",
      "Your decisions run through your Heart, the seat of willpower, worth and genuine desire. The real question under every choice is whether you actually want it and have the heart to see it through.",
      "Leo amplifies desire and the urge to prove yourself, so this season can pull you into over-committing to look impressive. What you want and what would look good can blur.",
      "Listen to what you spontaneously say out loud, your voice reveals your true wants before your mind edits them. Commit only to what you have real desire and energy for, and let yourself walk away from the rest."
    ),
    self: block(
      "You hear your truth out loud, and Leo wants you expressed.",
      "Your authority runs through your G centre, your identity and direction, and it comes out through your voice. You do not think your way to clarity, you talk your way there.",
      "Leo pushes you toward self-expression and being heard, which actually serves how you decide. The season's momentum can tempt you to commit before you have spoken it through.",
      "Talk decisions out loud with people who let you hear yourself rather than steer you. Notice the direction your own words keep pulling toward, and trust what rings true when you say it."
    ),
    mental: block(
      "Clarity comes from the right rooms, not the loudest one.",
      "You have no single inner authority, so you are designed to reach clarity through open conversation in the right environment. You are a sounding board by design, your wisdom surfaces out loud over time.",
      "Leo is a loud season, and not every bright room is the right one for you. Big energy can rush you toward a decision before you have talked it through.",
      "Talk decisions through with a few trusted people, and notice how you feel in different places, because environment shapes your clarity. Let the answer surface across several conversations rather than one."
    ),
    lunar: block(
      "Give the big things a full month before Leo rushes you.",
      "As a Reflector, your clarity comes over a full lunar cycle. Because you sample the energy around you, a decision needs to be felt across roughly 28 days, through every mood, before it is truly yours.",
      "Leo intensity will push you to decide fast and match everyone's pace, and that urgency is not your rhythm.",
      "Never let anyone rush you into a major yes this season. Talk it through with different people over about a month and watch how it feels as the cycle turns, the clarity that lasts the whole month is the real one."
    ),
  },

  profileLens: {
    "1/3": block(
      "You go deep, then learn by trying it in real life.",
      "Line 1 needs a solid foundation of knowledge to feel secure, and line 3 learns through trial and error, discovering what works by bumping into what does not. You are a researcher who tests everything in practice.",
      "Leo pushes you to be visible before you feel ready and to experiment out loud. Expect some public trial and error this season, that is your method, not a failure.",
      "Give yourself full permission to study deeply first, then let yourself be seen testing things. Treat every misstep as data, it is exactly how your authority gets built."
    ),
    "1/4": block(
      "You build deep expertise, then share it through your people.",
      "Line 1 needs to know its subject inside out, and line 4 lives through relationships, so your opportunities arrive through people you already know rather than cold pitches.",
      "Leo raises your visibility, and this season your network is the channel it travels through. Warm connections open the doors now.",
      "Do the deep work so you have real authority, then nurture your friendships and network. Your next opportunity is usually one relationship away, so tend those bonds."
    ),
    "2/4": block(
      "You have natural gifts, and you need both solitude and your people.",
      "Line 2 carries talents that feel effortless and needs regular time alone to recharge and develop them, and line 4 thrives through your network. You get called out of your cave by the people who see what you have.",
      "Leo pulls you toward visibility and out into the world, which can drain your line-2 need for solitude if you are not careful.",
      "Protect your alone time without guilt, it is where your gift lives, and trust the people who name your talents and pull you into the right opportunities."
    ),
    "2/5": block(
      "A natural talent the world keeps projecting expectations onto.",
      "Line 2 holds effortless gifts and needs solitude, and line 5 gets projected onto as a practical fixer people expect to save the day.",
      "Leo turns up both the visibility and the projections, so more people will expect you to deliver and rescue this season.",
      "Guard your alone time fiercely and be intentional about what you say yes to. Deliver when you genuinely can, and be honest when you cannot, so the projections do not run your life."
    ),
    "3/5": block(
      "You learn by doing, then teach the world what actually works.",
      "Line 3 finds truth through trial and error, and line 5 is projected onto as a practical, universal problem-solver. You turn hard-won lessons into solutions others can use.",
      "Leo asks you to experiment publicly this season, and people will look to you for practical answers. Expect visible trial, error and adjustment.",
      "Reframe trial and error as your credibility, not your shortcoming. Manage what people expect, promise only what you can deliver, and let your lived, practical wisdom do the talking."
    ),
    "3/6": block(
      "You experiment hard early, then become the example.",
      "Line 3 learns through trial and error, and line 6 matures across three life phases into a role model, so your messy early experiments are building the wisdom you later embody.",
      "Leo turns attention toward you. If you are in your early phase, expect experimentation, if you are maturing, notice people learning from how you show up.",
      "Be gentle with yourself through the trial-and-error years, they are gathering your material. As you mature, live your truth openly, because people learn by watching you."
    ),
    "4/6": block(
      "You lead through relationships and become the example over time.",
      "Line 4 moves through your network, so life unfolds through the people you are bonded to, and line 6 grows into a role model across three phases.",
      "Leo makes your network incredibly important this season, and turns up how much people watch and model your behaviour.",
      "Invest in real, loyal relationships, they are your platform and your path. Live in a way you would be proud for others to copy, because with a 6 line they are watching."
    ),
    "4/1": block(
      "A grounded, fixed influence on your close circle.",
      "This is the one Juxtaposition profile, unusually fixed in how it operates. Line 4 lives through relationships and line 1 needs a deep foundation, so you have a stable way of being that influences the people around you.",
      "Leo invites you to influence from a grounded place rather than bending to the crowd, and your fixed nature is an asset in a loud season.",
      "Build your expertise deeply, then let it move through your close network. Honour your fixed nature and surround yourself with people who value exactly how you are."
    ),
    "5/1": block(
      "People look to you for solutions, so make sure you have them.",
      "Line 5 is projected onto as a practical rescuer people expect to fix things, and line 1 needs a solid foundation of knowledge to feel secure. You are the trusted expert called in a crisis.",
      "Leo turns up the projections and the spotlight, so more people will make you their hero, or their scapegoat, this season.",
      "Do the deep work so your solutions are real, then be deliberate about which problems you take on. Protect your reputation by delivering only what you truly can."
    ),
    "5/2": block(
      "A natural talent the world keeps calling on to save the day.",
      "Line 5 gets projected onto as a universal problem-solver, and line 2 holds effortless gifts and needs solitude. You have real talent people keep pulling you out of your cave to use.",
      "Leo increases both the calls on your talent and your need to retreat, so the pull in two directions sharpens this season.",
      "Protect your alone time, it is non-negotiable, and choose your rescues carefully. Let the right people call you out for the right things, and say no to the rest."
    ),
    "6/2": block(
      "You are becoming the example, in your own time.",
      "Line 6 matures through three life phases into a role model, and line 2 carries natural gifts and needs solitude. You are building, often quietly, toward a way of living others learn from.",
      "Leo will pull you toward the stage, but your power comes from choosing when to shine, not performing on demand.",
      "Honour retreat before you step forward, and honour your need for alone time as you grow. Trust that in time people will look to how you live, so keep living toward your own truth."
    ),
    "6/3": block(
      "You live it all the way through, then become the proof.",
      "Line 6 grows into a role model across three phases, and line 3 learns by trial and error. Your lived experience is exactly what makes you a believable, grounded example.",
      "Leo turns attention toward you and rewards honesty about what you have actually been through.",
      "Let the early experimentation happen without shame, it is building your authority. Share your real story openly, it is what makes people trust and follow you."
    ),
  },

  centreLens: {
    head: {
      defined: block(
        "A steady source of inspiration, amplified now.",
        "You carry a consistent source of inspiration and mental pressure, and you can inspire others with the questions you ask.",
        "Leo amplifies the ideas that want to be expressed and shared out loud this season.",
        "Follow the ideas that genuinely excite you and let the rest go, you do not have to chase every spark."
      ),
      open: block(
        "You take in the world's questions, so filter them this season.",
        "Your Head is open, so you take in and amplify other people's questions and mental pressure, which makes you impressionable to what is not yours.",
        "Leo's noise can fill your head with exciting questions and pressure that were never yours to solve.",
        "Learn to tell your questions from everyone else's, and only chase the ones that genuinely light you up."
      ),
    },
    ajna: {
      defined: block(
        "A steady way of thinking that anchors you.",
        "You process information and form views in a fixed, reliable way, which makes you mentally consistent.",
        "Leo gets louder around you, and your steady framework can be the thing that keeps you grounded.",
        "Trust your framework, and stay willing to update it so certainty does not harden into rigidity."
      ),
      open: block(
        "A flexible mind, so drop the pressure to seem certain.",
        "Your Ajna is open, so you think flexibly and can hold many perspectives, and you may feel pressure to appear certain.",
        "Leo can push you to perform confidence and fixed opinions you do not actually hold.",
        "Your open mind is the gift, get comfortable saying you are still deciding rather than faking certainty."
      ),
    },
    throat: {
      defined: block(
        "An influential voice, even more so now.",
        "You have a reliable voice and a consistent way of expressing and getting things done.",
        "Leo makes your voice even more influential and magnetic this season.",
        "Use it intentionally and with your strategy and authority, speak and act at the right time rather than just because you can."
      ),
      open: block(
        "Wait for the right moment to speak, do not force it.",
        "Your Throat is open, so you can channel many ways of expressing, and you may feel pressure to speak or act to get noticed.",
        "Leo will tempt you to post or speak up just to be seen this season.",
        "Wait to be invited or for the right moment, the words land far harder when you are not forcing them."
      ),
    },
    g: {
      defined: block(
        "A steady compass others lean on.",
        "You have a fixed sense of who you are and where you are going, a reliable inner direction.",
        "Leo turns up questions of identity and self-expression, and your steady compass holds while others waver.",
        "Trust your own direction and let others feel steadied by it, you do not need to keep re-proving who you are."
      ),
      open: block(
        "A fluid identity, so choose your rooms with care.",
        "Your G is open, so your sense of self and direction is shaped by where and who you are around, which makes you adaptable and a mirror for others.",
        "Leo's energy will strongly colour how you see yourself this season, for better or worse depending on your company.",
        "Choose your environments and people deliberately, and stop pressuring yourself to have your identity all figured out."
      ),
    },
    heart: {
      defined: block(
        "Real willpower to back what you want.",
        "You have reliable willpower and can make and keep promises when you genuinely want to.",
        "Leo backs your desires with drive this season, and can tempt you to push past your limits.",
        "Spend your willpower on what you truly want, and let yourself rest, even a strong heart is not meant to prove itself endlessly."
      ),
      open: block(
        "Your worth is not something Leo makes you earn.",
        "Your Heart is open, so you do not have consistent willpower on tap, and you can feel a pull to prove your worth.",
        "Leo season, with all its visibility, may tempt you to prove yourself through what you can push through.",
        "Remember your worth has never depended on achievement. Make fewer hard promises and drop the need to prove anything."
      ),
    },
    sacral: {
      defined: block(
        "A renewable engine, lit up by what you love.",
        "You have a deep, renewable engine of energy for the work and life you love, meant to be spent fully each day.",
        "Leo runs your engine hot for the exciting things this season.",
        "Pour it into the yeses that light you up and let the wrong things go flat, and honour the gut yes and no it gives you."
      ),
      open: block(
        "Not built to grind, so watch for borrowed energy.",
        "Your Sacral is open, so you do not have consistent life-force energy and can amplify other people's, then overwork without noticing.",
        "Leo's visibility can pull you into overworking to keep up this season.",
        "Notice when you are running on borrowed energy, learn when enough is enough, and rest before you are empty."
      ),
    },
    solarplexus: {
      defined: block(
        "A vivid emotional wave, felt fully now.",
        "You experience life as an emotional wave moving through highs and lows, and it is also your decision-making authority.",
        "Leo makes the wave more vivid, the highs higher and the lows deeper this season.",
        "Feel it fully, and let big decisions wait until the wave settles, there is no truth in the peak or the trough."
      ),
      open: block(
        "You carry the room's feelings, so set them down.",
        "Your Solar Plexus is open, so you absorb and amplify the emotions around you, and can avoid conflict to keep the peace.",
        "Leo turns up the emotional intensity in every room, and much of what you feel this season is not yours.",
        "Notice when you are carrying other people's feelings, and do not make decisions just to escape emotional tension."
      ),
    },
    spleen: {
      defined: block(
        "A quiet, reliable instinct, trust it.",
        "You have a consistent, quiet intuition and a steady instinct for health and safety.",
        "Leo gets loud, but your instinct stays reliable underneath the noise this season.",
        "Trust the first signal even when everything is loud, it is usually right."
      ),
      open: block(
        "Notice what you are gripping out of fear.",
        "Your Spleen is open, so you can become wise about health and survival, and you may hold onto things out of fear of letting go.",
        "Leo may surface a fear of letting go of how things look this season.",
        "Practise releasing what is no longer healthy, even if it once looked good, your holding-on is often fear, not truth."
      ),
    },
    root: {
      defined: block(
        "Steady under pressure, use it to fuel you.",
        "You handle pressure and stress in a steady, reliable way, with a consistent drive to get going.",
        "Leo's pace can be intense, and your steady root lets you use the pressure rather than be run by it.",
        "Use the pressure to fuel what matters, and remember not everyone can move at your pace."
      ),
      open: block(
        "The rush is contagious, so slow down on purpose.",
        "Your Root is open, so you take in and amplify pressure, and can rush to get things done just to feel free of it.",
        "Leo's urgency is contagious, and this season can have you hurrying for no real reason.",
        "Remember there is never as much rush as your body says, slow down on purpose and let the pressure pass through."
      ),
    },
  },

  crossLens: {
    "Right Angle": block(
      "This season serves your own becoming.",
      "Your incarnation cross is a personal destiny, so your path is fundamentally about your own growth and experience, with others in supporting roles.",
      "Leo hands you a chapter to focus unapologetically on your development, expression and visibility.",
      "Give yourself permission to focus on your own path without guilt, following what genuinely calls you is the contribution."
    ),
    "Left Angle": block(
      "This season moves your purpose through people.",
      "Your cross is a transpersonal karma, so your life is intertwined with others and your purpose plays out through relationships and encounters.",
      "Leo brings people across your path, and the invitations and collaborations now are how your mission actually unfolds.",
      "Watch who shows up this season and stay open to where relationships lead, even when the plan looks different from what you expected."
    ),
    Juxtaposition: block(
      "This season sharpens your one fixed purpose.",
      "Your cross is a fixed fate, a single concentrated theme you are here to embody, with an unusually stable way of being.",
      "Leo's spotlight falls on the one lane that is truly yours rather than pulling you wide.",
      "Lean into your fixed nature rather than fighting it, and go deeper into your one lane rather than spreading thin."
    ),
  },

  challenge: {
    Manifestor: "Start the thing you have been waiting to begin, and tell your people you are doing it.",
    Generator: "Respond to five things that genuinely excite you this season, and let the flat ones pass.",
    "Manifesting Generator": "Finish one project you care about before you let yourself begin the next.",
    Projector: "Ask to be seen once this season, put yourself forward for the recognition you want.",
    Reflector: "Spend time in three new environments and notice how differently each one makes you feel.",
  },

  businessLens: {
    Manifestor: block(
      "Leo is your launch window.",
      "In business you are built to initiate, to start the thing and set it in motion rather than wait for demand to appear.",
      "Leo backs bold launches and visible moves, so this is a strong window to put something new into the world.",
      "Launch the offer, campaign or idea you have been sitting on, inform your audience clearly, then let momentum build. Do not water it down to make it palatable."
    ),
    Generator: block(
      "Respond to demand, do not chase it.",
      "You build a business by responding to what genuinely lights you up and what the market is actually asking for, and your energy is what sells it.",
      "Leo brings more to respond to and makes your enthusiasm magnetic, so demand and visibility rise now.",
      "Say yes to the exciting requests and opportunities, double down on the offers that light you up, and let people watch you loving your work."
    ),
    "Manifesting Generator": block(
      "Test fast, keep what has energy.",
      "You run a business best by experimenting across several things and following the ones with real energy, pivoting quickly.",
      "Leo rewards your speed and multi-passionate range this season.",
      "Trial a few offers or formats, drop what goes flat without guilt, and scale the one or two that light you up. Finish those before you pile on more."
    ),
    Projector: block(
      "Teach, and wait to be invited.",
      "Your business gift is guiding, seeing what others miss and being recognised for that expertise.",
      "Leo turns up your visibility, which grows the invitations your business runs on.",
      "Position your expertise where the right clients can see it, teach and share your insight, and wait for the invitation rather than chasing. Sell recognition, not hours."
    ),
    Reflector: block(
      "Read the market before you commit.",
      "You sense trends and the health of a market unusually well, and you thrive in the right business environment.",
      "Leo is loud, so let it show you what is real rather than rushing to match the noise.",
      "Observe trends across the season, choose your business environment and collaborators carefully, and give any big commitment a full cycle before you sign."
    ),
  },

  relationshipsLens: {
    Manifestor: block(
      "Keep people informed, and keep your independence.",
      "In relationships you need freedom and you move first, which can feel intense to others when you do not explain.",
      "Leo turns up warmth and drama both, so this season rewards being expressive and openly affectionate.",
      "Inform the people close to you before you act, it dissolves the friction, and let yourself be seen and warm without giving up your independence."
    ),
    Generator: block(
      "Follow your gut on who to give energy to.",
      "You give the best of your energy to the people and connections that genuinely light you up.",
      "Leo brings more social invitations and visibility, so your circle gets busier now.",
      "Say yes to the people who light you up and let the draining ones go quiet, your gut already knows who is a real yes."
    ),
    "Manifesting Generator": block(
      "Let yourself be many things to your people.",
      "You bring fast, playful, multi-faceted energy to relationships and get restless with the flat ones.",
      "Leo amplifies the fun and the visibility in your connections this season.",
      "Give your people your enthusiasm, tell them when you are pivoting so they are not left behind, and choose connections with real energy."
    ),
    Projector: block(
      "Be with people who truly see you.",
      "You thrive with people who recognise and invite you, and you wilt where you feel unseen or used for output.",
      "Leo increases how much you are seen, so the right people will recognise you this season.",
      "Invest in relationships where you feel genuinely seen, wait for the invitation rather than pushing, and protect your energy in company that drains it."
    ),
    Reflector: block(
      "Your people set your weather.",
      "You take on the emotional climate of whoever you are around, so your relationships shape your whole experience.",
      "Leo's intensity will be strongest through your closest company this season.",
      "Spend time with people who feel good to be around and notice who leaves you depleted, your environment is your relationship compass."
    ),
  },

  moneyLens: {
    Manifestor: block(
      "Initiate the income, then rest.",
      "You make money by starting things and creating new streams, in bursts rather than a steady grind.",
      "Leo supports bold money moves and visible offers now.",
      "Start the income-generating thing and inform people, then rest between pushes. The shadow is impatience and burning out early, so pace the launches."
    ),
    Generator: block(
      "Money follows your yes.",
      "You earn most when you are doing work you genuinely love, your lit-up energy is the real asset.",
      "Leo turns up opportunities to respond to and makes your work magnetic.",
      "Respond to the paid opportunities that excite you and let the flat ones go. The shadow is saying yes to money that drains you, which quietly kills the golden goose."
    ),
    "Manifesting Generator": block(
      "Multiple streams, kept if they have energy.",
      "You can earn across several things at once and move fast between them.",
      "Leo rewards experimenting with how you make money this season.",
      "Test income streams and keep the ones with real energy. The shadow is starting many and finishing none, so bank the wins before chasing the next."
    ),
    Projector: block(
      "Get paid for your insight, not your hours.",
      "You earn best being recognised and invited for your expertise, not by grinding output.",
      "Leo raises your visibility, which grows the invitations that pay.",
      "Price your recognition and expertise, wait for the invitation, and stop trading time for money. The shadow is over-working to prove worth and undercharging."
    ),
    Reflector: block(
      "Let timing and environment guide the money.",
      "You read financial timing and the right opportunities well when you are not rushed.",
      "Leo is loud, so let it reveal what is real rather than pressuring a fast money decision.",
      "Give money decisions a full cycle and choose your financial environment carefully. The shadow is being rushed into a commitment that is not truly yours."
    ),
  },

  shadowIntro:
    "Leo season shines a light on where you seek approval and try to prove yourself. Your open centres are where you take in and amplify the world, so they are where this season's pressure, comparison and old patterns show up loudest. Naming them is how you stop unconsciously running on them.",

  shadowByOpenCentre: {
    head: "A flood of other people's questions and mental pressure, pulling you into overthinking things that are not yours to solve.",
    ajna: "Pressure to appear certain and have all the answers, so you fake confidence or cling to opinions just to feel safe.",
    throat: "The urge to speak, post or perform just to be noticed, and the sting when the attention does not come.",
    g: "Losing your sense of who you are in the season's noise, shape-shifting to be liked and chasing love and direction from outside yourself.",
    heart: "The big one this season, trying to prove your worth through achievement and over-committing to look impressive. Your worth is not up for proof.",
    sacral: "Overworking and saying yes past your limit to match everyone's visible output, then burning out.",
    solarplexus: "Absorbing the room's emotions and avoiding conflict to keep the peace, mistaking other people's feelings for your own.",
    spleen: "Holding onto people, habits or situations out of fear of letting go, even when you know they are not healthy.",
    root: "A contagious rush to get things done just to relieve pressure, hurrying decisions that never needed to be hurried.",
  },

  practices: {
    emotional: {
      tapping: "Tap the side of your hand: even though I feel the urge to decide right now, I choose to let my wave settle first.",
      breathwork: "Box breathing, four counts in, hold four, out four, hold four, for two minutes before any big yes.",
      journal: "What am I feeling about this at the top of the wave, and what might I feel at the bottom of it?",
      reset: "When excitement spikes, put a hand on your chest and say out loud that there is no rush, the clarity comes tomorrow.",
    },
    sacral: {
      tapping: "Tap your collarbone: my body knows the answer before my mind does, and I trust the gut yes.",
      breathwork: "Two quick belly breaths, then ask yourself a yes or no question and feel the lift or the drop.",
      journal: "Where did my energy rise this week, and where did it go flat? Follow the rise.",
      reset: "Shake out your whole body for thirty seconds to discharge stuck energy, then feel what your gut actually wants.",
    },
    splenic: {
      tapping: "Tap the side of your hand: I trust the first quiet signal, it does not need to explain itself.",
      breathwork: "One long slow exhale, twice as long as the inhale, to drop below the noise and hear your instinct.",
      journal: "When did I get a quiet knowing this week, and did I act on it or talk myself out of it?",
      reset: "Pause, soften your belly, and notice the very first yes or no before your mind starts arguing.",
    },
    ego: {
      tapping: "Tap your heart centre: I only commit to what I truly want, and my worth is not up for proof.",
      breathwork: "Hand on heart, three slow breaths, and ask do I actually want this or am I trying to prove something.",
      journal: "What did I hear myself say out loud this week that revealed what my heart actually wants?",
      reset: "When you feel the pull to over-promise, pause with a hand on your chest until the urge to prove passes.",
    },
    self: {
      tapping: "Tap your throat: my truth comes out when I speak it, and I trust the direction my own words take.",
      breathwork: "Three grounding breaths, then say the decision out loud and listen to how it lands in your body.",
      journal: "If I talk this out on paper, which direction do my own words keep pulling toward?",
      reset: "Voice-note a trusted person and simply talk it through, listening to yourself more than to them.",
    },
    mental: {
      tapping: "Tap the side of your hand: clarity comes from the right conversations, I do not have to know alone.",
      breathwork: "Slow breathing while you change rooms, and notice how the decision feels in a different environment.",
      journal: "Who and where helped me think most clearly this week, and what did I hear myself realise?",
      reset: "Step into a different space, physically, and talk the decision through out loud with someone you trust.",
    },
    lunar: {
      tapping: "Tap your collarbone: I give the big things a full cycle, and I do not let anyone rush me.",
      breathwork: "Long, slow breaths in a place that feels good, and let yourself feel the decision rather than solve it.",
      journal: "How does this choice feel today, and how did it feel last week? Track it across the month.",
      reset: "Change your environment and notice how the decision feels there, your clarity moves with the moon and the room.",
    },
  },

  affirmationByType: {
    Manifestor: "I begin things. I inform, I move, and I let myself be seen doing it.",
    Generator: "I follow what lights me up, and my energy is magnetic when I do.",
    "Manifesting Generator": "I move at my own speed, I follow my yes, and I am allowed to want many things.",
    Projector: "I am here to be seen and invited, and my insight is worth waiting to be asked for.",
    Reflector: "I experience this season in my own rhythm, and I choose the rooms that let me shine.",
  },

  weeklyQuestions: [
    "What felt expansive this week, and what quietly drained you?",
    "Where did you follow your strategy to {strategy}, and where did you force things instead?",
    "Did you honour your {authority} way of deciding, or did you rush a yes?",
    "Where did you let yourself be seen this week?",
    "What are you being tempted to do just for approval or applause?",
    "What wants to change next week?",
  ],
};

// Registry, keyed by lowercase sign. Future seasons drop in here.
export const SEASON_DESIGNS: Record<string, SeasonDesign> = {
  leo: LEO_SEASON,
};

export function getSeasonDesign(sign: string): SeasonDesign | null {
  return SEASON_DESIGNS[sign.toLowerCase()] ?? null;
}
