// Libra Season, read through Human Design. Same shape as the Leo and Virgo files: this is
// the ONE file that changes per season, everything here is Libra-specific framing while
// the engine and all the natal Human Design logic stay identical. The identity layers
// describe her design rather than the season, so they carry over from the other seasons.
//
// Across Libra the Sun crosses gates 46, 18, 48, 57, 32 and 50, and five of those six sit
// on the Spleen, which is why instinct runs through this reading.
//
// Each element opens into three layers so the reading is a real coaching read, not a
// one-liner: identity (who you are here), cycle (how Libra moves it for you) and
// guidance (what to do). Voice: warm, conversational, practical. No em dashes, no
// rhetorical questions.

import type { SeasonDesign, SeasonBlock } from "@/types/season-design";

const block = (summary: string, identity: string, cycle: string, guidance: string): SeasonBlock => ({
  summary,
  identity,
  cycle,
  guidance,
});

export const LIBRA_SEASON: SeasonDesign = {
  sign: "Libra",
  title: "Libra Season",
  element: "air",
  intro:
    "Libra season moves the collective focus onto the space between you and other people. The Sun enters the sign of relationships, beauty and balance, so for everyone this is the part of the year that asks what your connections are actually built on, and whether the agreements you live inside still feel fair to you. In Human Design the Sun spends almost the whole month crossing the Spleen, the centre of instinct, timing and wellbeing, which is why this season has a way of showing you very quickly, and very quietly, who is good for you and who has been costing you.",
  encouraging:
    "This season is encouraging honest preferences, fair agreements, beautiful surroundings, clean boundaries and relationships that match your worth. It rewards the woman who says what she wants early and kindly, who trusts the first read she gets on a person, and who lets a little friction exist in the room so that she stops carrying all of it inside herself.",
  activates: ["relationships", "boundaries", "balance", "beauty", "instinct", "self-worth"],

  typeLens: {
    Manifestor: block(
      "You are the initiator, and Libra asks you to bring your people with you.",
      "You are one of the rare few designed to start things from your own inner spark, without waiting for a cue. Your energy comes in fast, closed bursts that are meant to make an impact and then rest, rather than humming along steadily like everyone else's.",
      "Libra is the season everyone is thinking about their relationships, so the way you move lands harder on the people close to you now. Your signature is peace, and this month shows you the gap between the peace you feel when you act on your own urge and the peace you buy by holding that urge back so nobody gets upset. Swallowed urges turn into anger, and a season this focused on harmony can quietly stack a lot of them.",
      "Act on the urge that is genuinely yours, and tell the people it affects before you move, simply and without asking for their approval. Informing is how you keep your relationships smooth while your freedom stays completely intact, and it usually takes about thirty seconds."
    ),
    Generator: block(
      "You are the life force, and Libra keeps asking your gut about people.",
      "You carry a deep, renewable engine of energy that is designed to be spent on work that genuinely lights you up. In the right thing your energy is endless and magnetic, and in the wrong thing it drains and goes flat no matter how good the thing looks on paper.",
      "Libra fills your life with requests, invitations and lovely people who would like a little more of you, and the pull this season is to say yes to be kind. A polite yes spends exactly the same energy as a real one, and your body feels the difference immediately, even when your manners have already answered for you.",
      "Let people ask, then give your gut a second to answer before your mouth does. Keep your yes for the connections and plans that lift you, and let an honest no be one of the kindest things you give anyone this season, because frustration builds fastest when your life force goes on keeping everyone comfortable."
    ),
    "Manifesting Generator": block(
      "You are the multi-passionate powerhouse, and Libra asks you to bring people along at your speed.",
      "You have the Generator's renewable engine plus a fast wiring to action, so you move quickly, juggle several things and skip steps other people need. You are efficient rather than scattered, even when linear people struggle to keep up.",
      "Libra puts relationships in the middle of everything, and the people in your life feel your speed most when you change direction without telling them. The season also hands you a lot of both/and, which suits a multi-passionate design beautifully, as long as every one of the many things you say yes to is a gut yes rather than a favour.",
      "Respond first, then tell the people a pivot affects before you make it, which is the single habit that keeps your relationships steady while you keep moving. Check each new commitment against your gut, and hand back the ones you took on to be agreeable."
    ),
    Projector: block(
      "You are the guide, and Libra is the season built around the other person.",
      "You are here to see people and systems clearly and to guide them, rather than to output energy all day. Your gift is penetrating insight, and it lands best when it is invited and recognised rather than pushed.",
      "Libra is the sign of the other, so this is a season that runs on one-to-one connection, which is exactly where you work best. Invitations tend to arrive through partnerships and close relationships now, and the risk grows right alongside them, because a month this focused on other people makes it very easy to pour your attention into someone who has never actually asked for it, and that is where bitterness starts.",
      "Let the recognition come to you, and give your guidance to the people who have genuinely invited it. Notice who sees you clearly this month, spend your limited energy on those relationships, and rest far more than the social calendar suggests, because Libra's invitations can fill every evening you have."
    ),
    Reflector: block(
      "You are the mirror, and Libra shows you who you become around each person.",
      "You take in and amplify the energy around you, which makes you a rare barometer of your environment and deeply wise about people. You are designed to change day to day rather than stay fixed.",
      "Libra is the season of mirrors, and for you that is literal, because the people you spend time with now shape how you feel, what you want and even who you think you are. This month makes it very clear which relationships reflect back a version of you that you love, and which ones leave you disappointed and slightly lost.",
      "Notice how you feel after time with each person and let that pattern decide who you see more of. Give any relationship decision the full lunar cycle, and choose the rooms you spend Libra season in as carefully as you would choose a partner, because the room shapes so much of who you become."
    ),
  },

  typeStrategy: {
    Manifestor: [
      "Tell the people your decision affects before you act, informing keeps the peace far better than asking permission.",
      "Act on the urge that is yours, and notice when you are holding one back to keep someone comfortable.",
      "Treat anger as information, it usually means an urge got swallowed somewhere.",
      "Keep your freedom inside your relationships by saying what you are doing, early and simply.",
    ],
    Generator: [
      "Let people ask, then let your gut answer before your manners do.",
      "Say yes only to the plans and people that lift your energy, a polite yes costs the same as a real one.",
      "Treat frustration as a sign you have been spending energy to keep things smooth.",
      "Ask a friend to put your decisions to you as yes or no questions, and listen for the sound you make.",
    ],
    "Manifesting Generator": [
      "Respond first, then inform before you pivot, so your people are never left behind.",
      "Check every new commitment for a gut yes, and hand back the favours you agreed to out of politeness.",
      "Enjoy the both/and, keep the many things as long as every one of them lights you up.",
      "Tell people early when you are changing course, your speed lands better with a heads up.",
    ],
    Projector: [
      "Wait for the invitation, and notice who actually recognises you this season.",
      "Keep your guidance for the people who asked, uninvited advice is where bitterness starts.",
      "Choose your one-to-one relationships carefully, they are where your invitations come from.",
      "Rest more than the social calendar asks of you, Libra's invitations can fill every evening.",
    ],
    Reflector: [
      "Track how you feel after time with each person across the whole month.",
      "Spend more time in the rooms and relationships that leave you feeling like yourself.",
      "Give every relationship decision a full lunar cycle, whoever is waiting for the answer.",
      "Rebalance your environment first, it shapes everything else you feel this season.",
    ],
  },

  authorityLens: {
    emotional: block(
      "Your truth takes time, and Libra is happy to let you weigh it.",
      "Your Solar Plexus is defined, so you feel life as an emotional wave that rises and falls. Your clarity lives in the pattern across that wave, never in a single high or low moment.",
      "Libra is the season of weighing both sides, which suits you perfectly, and it is also the season of lovely moments, flattering attention and people who would like an answer tonight. The trap this month is saying yes on the high of a beautiful evening, or agreeing to something at the low end of the wave just to end the tension of not knowing.",
      "Tell people you will get back to them, and give every relationship decision at least a few nights. Feel it high, low and neutral, and when you catch yourself agreeing just to make an awkward feeling stop, name the feeling first and decide once the wave has moved."
    ),
    sacral: block(
      "Your gut answers about people, and Libra keeps asking it.",
      "Your Sacral responds instantly in the body, a lift of energy for yes and a flat drop for no. It speaks before your mind does, in pull and in sound rather than in reasoned argument.",
      "Libra floods your diary with invitations, favours and people who would love your time, and your manners are very quick to answer on your behalf. The questions this season are about people and commitments, so your gut is being asked something constantly, and the social pressure to be nice can drown out a very clear no.",
      "Pause long enough to feel the lift or the drop before you answer anyone. When a request comes in, let your first sound decide, and trust the heavy, obligated feeling in your body as your answer, however lovely the person asking."
    ),
    splenic: block(
      "The Sun is crossing the Spleen this season, so trust your first read.",
      "Your Spleen gives you an in-the-moment intuition about what is right for your health, safety and timing. It is soft, it speaks once, and it does not repeat or justify itself.",
      "This is genuinely your season, because across most of Libra the Sun moves through the gates of the Spleen, so the whole collective is tuned to instinct and your own knowing is unusually sharp. The risk is Libra's instinct to be fair, to give everyone the benefit of the doubt and to see both sides, which is exactly how a clear first hit about a person gets reasoned away.",
      "Act on the first quiet read you get on a person, a plan or a place, especially in the first few seconds of meeting. When you notice yourself building a balanced case against something your body already told you, stop building it and go with what you knew first."
    ),
    ego: block(
      "Libra is the season of the deal, so ask what is in it for you.",
      "Your decisions run through your Heart, the seat of willpower, worth and genuine desire. The real question under every choice is whether you actually want it and have the heart to see it through.",
      "Libra is the sign of agreements, negotiations and fair exchange, which puts your authority right at the centre of the month. The pressure is to be gracious and accommodating, and in a season that prizes fairness, asking what you get in return can feel selfish, even though it is the exact question your design runs on.",
      "Listen to what you say you want when you speak without editing, your voice gives your heart away before your manners step in. Negotiate openly, ask for what you want in return, and make only the agreements you actually desire, because a promise made to be agreeable drains your willpower faster than anything else this season."
    ),
    self: block(
      "You hear your truth out loud, so say it to someone neutral.",
      "Your authority runs through your G centre, your identity and direction, and it comes out through your voice, so you reach clarity by talking and hearing what you say.",
      "Libra pulls you to talk your decisions through with the person the decision affects, and in that conversation it is very easy to end up saying whatever keeps them comfortable. Your voice tells you the truth when nobody in the room needs a particular answer from you.",
      "Talk your decisions through with people who have no stake in the outcome and who let you hear yourself rather than steer you. Notice where your own words keep going, and trust the direction that makes you feel most like yourself, especially in your relationships."
    ),
    mental: block(
      "Clarity comes through conversation, and Libra is the conversation season.",
      "You have no single inner authority, so you are designed to reach clarity through open conversation in the right environment. You are a sounding board by design, and your wisdom surfaces out loud over time.",
      "Libra is full of conversation and connection, which gives you more chances to hear yourself than almost any other season. It also fills your life with agreeable voices, and the people who tell you what you want to hear are the least useful sounding boards you have.",
      "Choose the few people who reflect you back honestly and talk your decisions through with them, somewhere you feel good. Notice which rooms make your thinking clear and which ones make you mirror whoever you are with, and keep your big decisions for the first kind."
    ),
    lunar: block(
      "Give relationships a full month, whoever is waiting for your answer.",
      "As a Reflector, your clarity comes over a full lunar cycle. Because you sample the energy around you, a decision needs to be felt across roughly 28 days, through every mood, before it is truly yours.",
      "Libra brings relationship decisions and people who would like to know where they stand, and a partner or friend waiting on an answer is the strongest pressure you feel. The season also makes you a mirror for whoever you are closest to, so a decision made in one person's company can feel completely different a week later.",
      "Take the full cycle on anything that matters and tell people plainly that this is how you decide. Talk it over with different trusted people across the month, notice how the same choice feels in different company, and trust the answer that holds all the way through."
    ),
  },

  profileLens: {
    "1/3": block(
      "You study people before you trust them, then learn from what breaks.",
      "Line 1 needs a solid foundation of knowledge to feel secure, and line 3 learns through trial and error, discovering what works by bumping into what does not. You are a researcher who tests everything in practice.",
      "Libra turns your research onto relationships, so this season you want to understand how the people close to you actually work, and your line 3 means some of those bonds get tested along the way. A connection that bends or breaks now is giving you real information about fit, and each one teaches you what you need next time.",
      "Work out what you need to feel secure with someone and let yourself ask the questions that get you there. When a connection falls apart, write down what it showed you about what you need, because that is how your line 3 builds relationships that last."
    ),
    "1/4": block(
      "You need solid ground, and your relationships are where you find it.",
      "Line 1 needs to know its subject inside out, and line 4 lives through relationships, so your opportunities arrive through people you already know rather than cold pitches.",
      "Libra puts your network at the centre of the month, and this season the people closest to you are both your security and your opportunity. Line 4 hates the ground moving under it, so any relationship that feels unstable gets very loud now.",
      "Tend the friendships you already trust and let the next thing come through them. If a relationship needs to change, set up your foundation first, because your 4 moves best from one secure place to the next."
    ),
    "2/4": block(
      "People see your gift before you do, and Libra brings them to your door.",
      "Line 2 carries talents that feel effortless and needs regular time alone to recharge and develop them, and line 4 thrives through your network. You get called out of your cave by the people who see what you have.",
      "Libra increases the calls, invitations and social pull on you, which can feel like a lot when your line 2 needs the cave. The right people will call you out for the right things this season, and plenty of others will simply want your company.",
      "Protect your alone time without apology, then answer the calls that genuinely feel like you. Let your close relationships be where your gift gets seen, and let the rest of the social calendar go."
    ),
    "2/5": block(
      "A natural talent everyone wants a piece of, in a very social season.",
      "Line 2 holds effortless gifts and needs solitude, and line 5 gets projected onto as a practical fixer people expect to save the day.",
      "Libra puts relationships in the spotlight, and projection is how your line 5 experiences them, so people may idealise you quickly this season and expect you to be the partner, friend or saviour they have imagined. That can feel magnetic, and it can also set you up to disappoint someone who fell for a projection.",
      "Be clear and early about who you are and what you can offer, so the relationship is with you rather than the projection. Guard your alone time, and choose carefully which people you let close."
    ),
    "3/5": block(
      "You learned relationships the hard way, and people want what you know.",
      "Line 3 finds truth through trial and error, and line 5 is projected onto as a practical, universal problem-solver. You turn hard-won lessons into solutions others can use.",
      "Libra asks everyone to look at their relationships, and you have been through enough of them to know what actually works. Line 3 is the line of bonds made and broken, so the connections that shift this season are part of your process, and the lessons they leave are exactly what people will come to you for.",
      "Let the relationships that are ending end with honesty and without shame, they are how you learn. Share the practical lessons you took from them, and be clear about what you can really offer the people who come to you for answers."
    ),
    "3/6": block(
      "You experiment early, then become the example of a good relationship.",
      "Line 3 learns through trial and error, and line 6 matures across three life phases into a role model, so your messy early experiments are building the wisdom you later embody.",
      "Libra puts relationships under the light, which suits both of your lines. If you are in your early phase, expect some bonds to be made and broken, and if you are maturing, notice how many people are quietly learning from the way you do relationships.",
      "Be gentle with the relationships that taught you through trial and error, and keep your standards high, because your line 6 is looking for the real thing. Live your relationships in a way you would be happy for someone to copy."
    ),
    "4/6": block(
      "Your people are everything, and this season you choose them well.",
      "Line 4 moves through your network, so life unfolds through the people you are bonded to, and line 6 grows into a role model across three phases.",
      "Libra is your season in many ways, because relationships are your infrastructure and this whole month is about relationships. It also asks you to look honestly at which bonds are still mutual, and your line 6 holds a high standard for who gets a place in your life.",
      "Invest in the few relationships that genuinely hold you up and let the one-sided ones loosen. Line up your next secure connection before you let an old one go, and model the kind of friendship and partnership you want to see."
    ),
    "4/1": block(
      "A fixed way of relating that quietly steadies everyone around you.",
      "This is the one Juxtaposition profile, unusually fixed in how it operates. Line 4 lives through relationships and line 1 needs a deep foundation, so you have a stable way of being that influences the people around you.",
      "Libra prizes compromise and meeting people halfway, and your design is built to stay steady in its own way. The pressure this season is to bend yourself to keep a relationship balanced, and your fixed nature feels that pressure as deeply uncomfortable, for good reason.",
      "Stay true to how you operate and surround yourself with people who value it. Your steadiness is what you bring to your relationships, so let the right ones meet you where you already stand."
    ),
    "5/1": block(
      "People project what they need onto you, so show them the real you.",
      "Line 5 is projected onto as a practical rescuer people expect to fix things, and line 1 needs a solid foundation of knowledge to feel secure. You are the trusted expert called in a crisis.",
      "Libra turns everyone's attention to relationships, so the projections onto you get more personal this season. People may see you as the ideal partner, the perfect friend or the one who will fix their relationship, and those projections can turn quickly the moment you are simply human.",
      "Be honest about who you are early, so people fall for the real you. Do the deep work so your guidance holds, and choose carefully which relationship problems you let land on your shoulders."
    ),
    "5/2": block(
      "The world keeps calling on your talent, and Libra calls louder.",
      "Line 5 gets projected onto as a universal problem-solver, and line 2 holds effortless gifts and needs solitude. You have real talent people keep pulling you out of your cave to use.",
      "Libra brings more social pull and more projection at once, so people want both your company and your help this season while your line 2 wants to be left alone to recharge. The tension between the two gets sharper now.",
      "Protect your solitude, it keeps your gift alive, and say yes only to the calls that genuinely feel right. Let people see the real you early, so the projections have less room to grow."
    ),
    "6/2": block(
      "You are becoming the example, and your standards for love are part of it.",
      "Line 6 matures through three life phases into a role model, and line 2 carries natural gifts and needs solitude. You are building, often quietly, toward a way of living others learn from.",
      "Libra puts partnership and fairness in front of everyone, and your line 6 holds relationships to an unusually high standard. This season shows you how much of your life you have been living by that standard, and where you have been settling to keep the peace.",
      "Keep your standards, they are part of what makes you a role model, and give yourself the solitude you need to know what you actually want. Let people see how you do relationships, because that is quietly teaching them."
    ),
    "6/3": block(
      "You have lived relationships all the way through, and now you model them.",
      "Line 6 grows into a role model across three phases, and line 3 learns by trial and error. Your lived experience is exactly what makes you a believable, grounded example.",
      "Libra rewards honesty about relationships, and yours has been earned the hard way. The bonds that broke along the way are some of the most useful parts of your story this season.",
      "Own the relationships that taught you through trial and error, without shame. Share what you learned from them, because your honesty about the messy parts is what makes people trust your example."
    ),
  },

  centreLens: {
    head: {
      defined: block(
        "A steady stream of questions, and this season they are about people.",
        "You carry a consistent source of inspiration and mental pressure, and you can inspire others with the questions you ask.",
        "Libra points your questions at relationships, so you may find yourself wondering what people think, what they want and whether things are fair.",
        "Follow the questions that lead to an honest conversation, and let the ones about what everyone else is thinking go unanswered."
      ),
      open: block(
        "You absorb everyone's relationship dilemmas, so sort them from yours.",
        "Your Head is open, so you take in and amplify other people's questions and mental pressure, which makes you impressionable to what is not yours.",
        "Libra fills the air with other people's relationship questions, and you will pick up every one of them and start trying to solve it.",
        "Notice when a question in your head really belongs to someone else, and hand it back. Keep your thinking for the questions about your own life."
      ),
    },
    ajna: {
      defined: block(
        "A fixed way of thinking, in a season full of other views.",
        "You process information and form views in a fixed, reliable way, which makes you mentally consistent.",
        "Libra puts everyone's perspective on the table, and your fixed framework can either help you see clearly or keep you from hearing another side.",
        "Share your view with confidence, and stay curious enough to hear what someone else sees, especially in the relationships that matter to you."
      ),
      open: block(
        "You can see every side, so give yourself permission to pick one.",
        "Your Ajna is open, so you think flexibly and can hold many perspectives, and you may feel pressure to appear certain.",
        "Libra's weighing energy plus an open Ajna can leave you seeing every side of a relationship so clearly that you lose track of your own opinion.",
        "Let your mind stay open and let your authority make the call. Seeing both sides is your gift, and choosing your side belongs to your body."
      ),
    },
    throat: {
      defined: block(
        "A reliable voice, so use it to say what you want.",
        "You have a reliable voice and a consistent way of expressing and getting things done.",
        "Libra rewards clear, kind communication, so what you say lands especially well now when it is honest.",
        "Say your actual preference early and simply, and let your voice carry the boundary for you."
      ),
      open: block(
        "Say the true thing, even when the agreeable thing is easier.",
        "Your Throat is open, so you can channel many ways of expressing, and you may feel pressure to speak or act to get noticed.",
        "Libra turns that pressure toward saying whatever keeps the conversation pleasant, so you can find yourself agreeing out loud with things you privately disagree with.",
        "Let a silence sit for a moment before you fill it, and save your words for what you actually think. The right moment to speak usually comes when someone asks you directly."
      ),
    },
    g: {
      defined: block(
        "You know who you are, and Libra checks your relationships against it.",
        "You have a fixed sense of who you are and where you are going, a reliable inner direction.",
        "Libra asks whether the people closest to you are moving in the same direction you are, and your stable compass makes the answer easy to feel.",
        "Notice which relationships support where you are going and which ones ask you to become someone else, and invest in the first kind."
      ),
      open: block(
        "You become who you are around, so choose them carefully.",
        "Your G is open, so your sense of self and direction is shaped by where and who you are around, which makes you adaptable and a mirror for others.",
        "Libra is all about relationships, and with an open G you can take on a partner's or a friend's identity and direction without noticing, until one day you feel lost.",
        "Notice who you feel most like yourself around and give those people more of your time. The right people and places guide you in the right direction."
      ),
    },
    heart: {
      defined: block(
        "Real willpower, so make the agreements you actually want.",
        "You have reliable willpower and can make and keep promises when you genuinely want to.",
        "Libra is the season of agreements and exchange, and your ability to commit will be asked for in your relationships all month.",
        "Make agreements that give you something back, and keep them fully. Rest between efforts, because your heart needs it to keep its word."
      ),
      open: block(
        "Your worth is already settled, whoever you are trying to please.",
        "Your Heart is open, so you do not have consistent willpower on tap, and you can feel a pull to prove your worth.",
        "Libra is the season most likely to have you proving your worth through how much you give, agree and accommodate, so the people pleasing gets loud now.",
        "Make fewer promises, and notice when you are saying yes to prove you are a good partner, friend or colleague. You deserve good relationships exactly as you are, without earning them."
      ),
    },
    sacral: {
      defined: block(
        "A renewable engine, so spend it on the people who light you up.",
        "You have a deep, renewable engine of energy for the work and life you love, meant to be spent fully each day.",
        "Libra asks for a lot of your energy on behalf of other people, and your gut knows exactly who and what it wants to give it to.",
        "Give your energy to the people and plans that get a gut yes, and let the obligated ones go without guilt."
      ),
      open: block(
        "You feel everyone's energy, so know when you have had enough.",
        "Your Sacral is open, so you do not have consistent life-force energy and can amplify other people's, then overwork without noticing.",
        "Libra is social and full of shared plans, and you will borrow the group's energy and keep going long after your own ran out.",
        "Leave before you are tired, spend time alone to discharge the energy you picked up, and give yourself permission to rest while everyone else is still out."
      ),
    },
    solarplexus: {
      defined: block(
        "Your emotions set the tone of the room, so let your wave move.",
        "You experience life as an emotional wave moving through highs and lows, and it is also your decision-making authority.",
        "Libra wants harmony, and your wave will not always cooperate, so you may feel pressure to hide your lows to keep the peace.",
        "Let your wave move without hiding it, and tell the people you love that you need time before you decide. Your emotional honesty is what makes your relationships deep."
      ),
      open: block(
        "You carry everyone's feelings, and Libra makes you want to smooth them over.",
        "Your Solar Plexus is open, so you absorb and amplify the emotions around you, and can avoid conflict to keep the peace.",
        "This is the centre Libra presses hardest, because a season built around harmony makes every bit of tension in the room feel like something you personally have to fix.",
        "Notice when a feeling arrived with another person, and let them keep it. Say the honest thing kindly and let the room feel what it feels, because keeping everyone calm has been costing you your truth."
      ),
    },
    spleen: {
      defined: block(
        "Your instincts are sharp, and the Sun is lighting up the Spleen.",
        "You have a consistent, quiet intuition and a steady instinct for health and safety.",
        "The Sun spends most of Libra crossing the Spleen's gates, which sharpens an instinct you already rely on, especially about people and the moment to act.",
        "Trust the first read you get on someone and act on it in the moment. Your body is telling you who is good for you very clearly this month."
      ),
      open: block(
        "Watch for holding on to people out of fear of letting go.",
        "Your Spleen is open, so you can become wise about health and survival, and you may hold onto things out of fear of letting go.",
        "Libra plus the Sun's pass across the Spleen can stir up old fears about being alone, being without someone and ending a relationship that has run its course.",
        "Notice when you are staying somewhere because it feels familiar, and check whether it actually feels good. Letting go of what has run its course makes room for relationships that fit who you are now."
      ),
    },
    root: {
      defined: block(
        "Steady under pressure, so you can hold the tension in a relationship.",
        "You handle pressure and stress in a steady, reliable way, with a consistent drive to get going.",
        "Libra brings the pressure to resolve things, and you can sit with tension long enough to find a genuinely fair solution.",
        "Let hard conversations take the time they need, and remember the people around you may feel that pressure far more than you do."
      ),
      open: block(
        "The urge to resolve tension fast is contagious.",
        "Your Root is open, so you take in and amplify pressure, and can rush to get things done just to feel free of it.",
        "Libra brings plenty of relationship tension, and you may rush to settle an argument, make a decision or smooth something over just to make the pressure stop.",
        "Let unresolved things stay unresolved for a while and make decisions in your own time. The pressure you feel is often someone else's, and it passes when you let it."
      ),
    },
  },

  crossLens: {
    "Right Angle": block(
      "This season asks you to choose yourself inside your relationships.",
      "Your incarnation cross is a personal destiny, so your path is fundamentally about your own growth and experience, with others in supporting roles.",
      "Libra turns everyone toward other people, which can pull you into living around someone else's path. This season shows you which relationships support your own journey and which ones ask you to set it aside.",
      "Keep your own path at the centre and let the people who genuinely support it closer. Choosing yourself inside a relationship is how your purpose moves forward."
    ),
    "Left Angle": block(
      "This is your season, because your purpose moves through relationships.",
      "Your cross is a transpersonal karma, so your life is intertwined with others and your purpose plays out through relationships and encounters.",
      "Libra is the season of relationships, so the people you meet and the connections that shift this month carry real weight for your path. Someone who arrives now may be part of what you are here to do.",
      "Stay open to the encounters that feel significant and treat your relationships as part of your purpose. Pay attention to who keeps crossing your path, and follow where those connections lead."
    ),
    Juxtaposition: block(
      "Libra asks everyone to bend, and your design asks you to stay steady.",
      "Your cross is a fixed fate, a single concentrated theme you are here to embody, with an unusually stable way of being.",
      "Libra is all about compromise and meeting in the middle, and your fixed nature can feel pressure to adapt far more than it is built to.",
      "Stay steady in your own lane and look for the relationships that value you exactly as you are. The people who fit your life will meet you there."
    ),
  },

  challenge: {
    Manifestor: "Tell the people closest to you before your next big move, and notice how much smoother it lands.",
    Generator: "Say no to one request your gut does not want, even when the person asking is lovely.",
    "Manifesting Generator": "Before your next pivot, tell the people it affects, then check your gut is still a yes.",
    Projector: "Wait for one real invitation this season, and give your full guidance only to the person who asked.",
    Reflector: "Track how you feel after time with each person for a full lunar cycle, then see more of the ones who leave you feeling like yourself.",
  },

  businessLens: {
    Manifestor: block(
      "Start the partnership, then keep everyone informed.",
      "In business you are built to initiate, to start the thing and set it in motion rather than wait for demand to appear.",
      "Libra is the season of partnerships, collaborations and deals, and the business openings this month tend to arrive through other people.",
      "Start the conversation about the collaboration you want, and inform your partners and clients clearly before you make changes that affect them. Let your independence and your partnerships work together."
    ),
    Generator: block(
      "Respond to the collaborations that light you up.",
      "You build a business by responding to what genuinely lights you up and what the market is actually asking for, and your energy is what sells it.",
      "Libra brings requests to collaborate, partner and help, and only some of them deserve your energy.",
      "Say yes to the partnerships your gut responds to and let the rest go, however good they look on paper. Your satisfaction is the measure of a good deal."
    ),
    "Manifesting Generator": block(
      "Partner with people who can keep up with you.",
      "You run a business best by experimenting across several things and following the ones with real energy, pivoting quickly.",
      "Libra brings collaboration offers, and the right partners for you are the ones who can handle your speed and your pivots.",
      "Choose collaborators who respond well to change, and inform them before you pivot. Let your multi-passionate nature shine in partnerships that give you room to move."
    ),
    Projector: block(
      "Your best clients and partners come through recognition.",
      "Your business gift is guiding, seeing what others miss and being recognised for that expertise.",
      "Libra is the season of one-to-one work, which is where your guidance lands best, and the invitations this month tend to come through partnerships and referrals.",
      "Make it easy for the right people to recognise your expertise, then wait for the invitation. Choose clients and partners who genuinely value your insight, and price your work to match."
    ),
    Reflector: block(
      "Give any partnership a full cycle before you sign.",
      "You sense trends and the health of a market unusually well, and you thrive in the right business environment.",
      "Libra brings partnership and collaboration offers, and you need time to feel how each one sits with you.",
      "Take a full lunar cycle before committing to any partnership or deal, and notice how you feel around each potential collaborator across the month."
    ),
  },

  relationshipsLens: {
    Manifestor: block(
      "Inform, and let your people keep up with you.",
      "In relationships you need freedom and you move first, which can feel intense to others when you do not explain.",
      "Libra puts relationships at the centre, and the people close to you feel your independence more this season, especially if you have been making moves without telling them.",
      "Tell your partner, friends and family what you are doing before you do it, simply and without asking permission. Informing is what lets your freedom and your relationships live together."
    ),
    Generator: block(
      "Give your love to the connections that light you up.",
      "You give the best of your energy to the people and connections that genuinely light you up.",
      "Libra brings plenty of social invitations and relationship energy, and your gut knows which connections are a real yes.",
      "Spend your time with the people your body responds to, and let the obligations you have been keeping out of politeness go."
    ),
    "Manifesting Generator": block(
      "Tell people before you change course.",
      "You bring fast, playful, multi-faceted energy to relationships and get restless with the flat ones.",
      "Libra wants harmony, and your speed can create friction when the people you love feel left behind.",
      "Tell the people you love when you are changing plans, and choose relationships that enjoy your pace and your many passions."
    ),
    Projector: block(
      "Spend your energy with the people who see you.",
      "You thrive with people who recognise and invite you, and you wilt where you feel unseen or used for output.",
      "Libra is focused on one-to-one relationships, which is where you shine, and also where you feel it most when someone overlooks you.",
      "Invest in the relationships where you feel recognised, and hold your guidance until it is invited. The people who genuinely value you will ask."
    ),
    Reflector: block(
      "Choose the people who bring out the best in you.",
      "You take on the emotional climate of whoever you are around, so your relationships shape your whole experience.",
      "Libra puts relationships at the centre of the month, and you will feel very clearly which people bring out the best in you.",
      "Notice how you feel after time with each person, and spend more of your time with the ones who leave you feeling like yourself."
    ),
  },

  moneyLens: {
    Manifestor: block(
      "Start the money conversation you have been avoiding.",
      "You make money by starting things and creating new streams, in bursts rather than a steady grind.",
      "Libra is the season of fair exchange, and you may notice where you have been undercharging or giving more than you receive.",
      "Open the conversation about your pricing, your pay or your partnership terms, and inform the people involved clearly. The shadow is avoiding the money conversation to keep things pleasant."
    ),
    Generator: block(
      "Charge for the energy you give.",
      "You earn most when you are doing work you genuinely love, your lit-up energy is the real asset.",
      "Libra shows you where you have been giving your energy away for free to keep people happy.",
      "Say yes to the paid work that lights you up and no to the favours that drain you. The shadow is taking underpaid work because saying no feels rude."
    ),
    "Manifesting Generator": block(
      "Let every income stream be a gut yes.",
      "You can earn across several things at once and move fast between them.",
      "Libra brings plenty of offers and collaborations, and you may take on paid work out of politeness rather than energy.",
      "Check every money opportunity against your gut and let go of the ones that feel like obligations. The shadow is saying yes to everything because saying no feels unfair."
    ),
    Projector: block(
      "Price your insight at its worth.",
      "You earn best being recognised and invited for your expertise, not by grinding output.",
      "Libra highlights worth and fair exchange, so this season shows you whether you are being paid for the value of what you see.",
      "Raise your prices to match your value, and work with clients who genuinely recognise your insight. The shadow is discounting to be liked."
    ),
    Reflector: block(
      "Feel the deal out for a full cycle.",
      "You read financial timing and the right opportunities well when you are not rushed.",
      "Libra brings partnership and money offers that ask for an answer, and you need time to feel whether each one is fair.",
      "Give every financial decision a full lunar cycle, and notice how you feel about the offer in different rooms. The shadow is agreeing to terms quickly to avoid disappointing someone."
    ),
  },

  shadowIntro:
    "Libra season shines a light on where you abandon yourself to keep the peace. Your open centres are where you take in and amplify the world, so they are where this season's pressure to please, to agree and to keep everyone comfortable shows up loudest, usually disguised as being nice, easygoing or fair. Naming them is how you stop unconsciously running on them and start choosing yourself.",

  shadowByOpenCentre: {
    head: "Other people's relationship dilemmas running on a loop in your head, and trying to solve problems that were always theirs to solve.",
    ajna: "Seeing every side of every situation so clearly that you lose your own opinion, and waiting to be certain before you let yourself want something.",
    throat: "Agreeing out loud to keep the conversation pleasant, and filling silences with whatever will keep everyone comfortable.",
    g: "Taking on a partner's or friend's identity and direction as your own, and losing track of who you are inside a relationship.",
    heart: "Proving your worth through how much you give and accommodate, and making promises so you will be seen as a good partner or friend.",
    sacral: "Saying yes to every plan and favour, running on everyone else's energy, and missing the moment enough was enough until you crash.",
    solarplexus: "The big one this season, avoiding conflict and hard truths to keep the peace, and treating everyone else's feelings as your job to fix.",
    spleen: "Holding on to a relationship, friendship or situation long after it stopped being good for you, because letting go feels unsafe.",
    root: "Rushing to resolve tension, settle an argument or make a relationship decision just to make the pressure stop.",
  },

  practices: {
    emotional: {
      tapping: "Tap the side of your hand: even though someone wants an answer now, I give myself the time to feel my way to the truth.",
      breathwork: "Breathe in for four and out for six, for two minutes, whenever you feel pressured to decide something about a relationship.",
      journal: "What did I agree to this week on a high or a low, and how do I feel about it now the wave has moved?",
      reset: "When you feel the pull to say yes just to end the tension, put a hand on your belly, breathe, and tell the person you will get back to them.",
    },
    sacral: {
      tapping: "Tap your collarbone: my gut knows who I want to give my energy to, and a polite yes still costs me.",
      breathwork: "Two deep belly breaths before you answer any request, then notice whether your body lifts toward it or drops away.",
      journal: "Who did I give my energy to this week because I wanted to, and who did I give it to because I felt I should?",
      reset: "Shake out your whole body for thirty seconds after a social day to release the energy you picked up, then check what your gut wants now.",
    },
    splenic: {
      tapping: "Tap the side of your hand: I trust my first read on people, and my instinct is allowed to be right without a reason.",
      breathwork: "One long, slow exhale, twice as long as the inhale, to drop below the second-guessing and hear the instinct underneath it.",
      journal: "What did my body tell me about someone this week before my mind started being fair about it?",
      reset: "Pause, soften your belly, and act on the first quiet signal instead of weighing up both sides for the tenth time.",
    },
    ego: {
      tapping: "Tap your heart centre: I am allowed to ask what is in it for me, and my worth stays the same whatever I give.",
      breathwork: "Hand on heart, three slow breaths, and ask whether you actually want this agreement or want to be seen as generous.",
      journal: "What did I agree to this week because I wanted it, and what did I agree to because I wanted to be liked?",
      reset: "When you feel the pull to overgive, pause with a hand on your chest and name what you want in return before you offer anything.",
    },
    self: {
      tapping: "Tap your throat: I hear my truth when I speak it, and I get to speak it to someone with no stake in the answer.",
      breathwork: "Three grounding breaths, then say your decision out loud to yourself and notice whether it sounds like you.",
      journal: "What do I keep saying about this relationship when nobody needs me to say anything in particular?",
      reset: "Voice-note a trusted friend with no stake in the outcome and talk it through, listening to yourself more than to them.",
    },
    mental: {
      tapping: "Tap the side of your hand: my clarity comes from the right rooms and the right people, and I get to choose both.",
      breathwork: "Slow, easy breathing while you walk somewhere that feels good, and notice how the decision feels there.",
      journal: "Who helped me hear myself clearly this week, and who did I simply end up agreeing with?",
      reset: "Change your environment and talk it through with someone who reflects you back honestly rather than telling you what to do.",
    },
    lunar: {
      tapping: "Tap your collarbone: I take the full cycle, and the people who love me can wait for my answer.",
      breathwork: "Long, slow breaths in a place that feels genuinely good, and let yourself feel the relationship instead of solving it.",
      journal: "How does this person or this choice feel this week compared with last week, and what does the whole month say?",
      reset: "Spend time alone somewhere you love and notice who you are when nobody else's energy is in the room.",
    },
  },

  affirmationByType: {
    Manifestor: "I act on what is mine to do, I inform the people I love, and my peace is real.",
    Generator: "I give my energy to the people and plans that light me up, and my no is an act of love.",
    "Manifesting Generator": "I move at my own speed, I bring my people with me, and every yes I give is real.",
    Projector: "I am seen and invited by the people who value me, and my guidance is a gift I give when asked.",
    Reflector: "I choose the people and places that reflect the best of me, and I take all the time I need.",
  },

  weeklyQuestions: [
    "Where did I say yes this week when my body was a no?",
    "Where did I follow my strategy to {strategy}, and where did I agree to something just to keep the peace?",
    "Did I honour my {authority} way of deciding, or did I let someone else's need for an answer decide for me?",
    "Which relationship gave me energy this week, and which one quietly took it?",
    "Where did I choose myself this week, even when it caused a little friction?",
    "What is one preference I can say out loud next week?",
  ],
};
