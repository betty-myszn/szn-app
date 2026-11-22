// Sagittarius Season, read through Human Design. Same shape as the Leo, Virgo, Libra and Scorpio
// files: this is the ONE file that changes per season, everything here is Sagittarius-specific
// framing while the engine and all the natal Human Design logic stay identical. The identity layers
// describe her design rather than the season, so they carry over from the other seasons.
//
// Across Sagittarius the Sun crosses gates 34, 9 and 5 (the Sacral: power, focus and fixed
// rhythms), then 26 (the Heart: the persuader who sells the dream) and 11 (the Ajna: ideas and
// vision), touching 10 (the G: love of self) on the last day. That arc, from raw life force to a
// vision big enough to sell, is why expansion, luck and betting on yourself run through it.
// Checked against swisseph for 22 Nov to 21 Dec 2026.
//
// Each element opens into three layers so the reading is a real coaching read, not a
// one-liner: identity (who you are here), cycle (how Sagittarius moves it for you) and
// guidance (what to do). Voice: warm, conversational, practical. No em dashes, no
// rhetorical questions.

import type { SeasonDesign, SeasonBlock } from "@/types/season-design";

const block = (summary: string, identity: string, cycle: string, guidance: string): SeasonBlock => ({
  summary,
  identity,
  cycle,
  guidance,
});

export const SAGITTARIUS_SEASON: SeasonDesign = {
  sign: "Sagittarius",
  title: "Sagittarius Season",
  element: "fire",
  intro:
    "Sagittarius season throws the windows open. The Sun enters the sign of expansion, adventure, luck, truth and the big picture, ruled by Jupiter, so for everyone this is the part of the year that asks how big you are actually willing to dream and whether you will bet on yourself before you have proof. In Human Design the Sun spends the first half of the season crossing the Sacral, through the gates of power, focus and rhythm, then moves into the Heart's gate of the persuader and the Ajna's gate of ideas, which is why this season starts by switching your life force on and ends by handing you a vision big enough to sell.",
  encouraging:
    "This season is encouraging bigger dreams, honest self-belief, adventure, generosity, saying the true thing and backing yourself out loud. It rewards the woman who says the slightly embarrassing version of her goal, who puts her energy behind one direction long enough to see it move, and who collects what the last chapter gave her before she sprints at the next horizon.",
  activates: ["expansion", "vision", "luck", "freedom", "self-belief", "truth"],

  typeLens: {
    Manifestor: block(
      "You are the initiator, and Sagittarius hands you the starting gun.",
      "You are one of the rare few designed to start things from your own inner spark, without waiting for a cue. Your energy comes in fast, closed bursts that are meant to make an impact and then rest, rather than humming along steadily like everyone else's.",
      "Sagittarius is a fire season that loves a bold launch, so your urges to start something new come thick and fast this month. The pull is to fire off five big moves at once and tell nobody, then wonder why people push back. Sagittarius also crosses the Heart's gate of the persuader, so your words carry more weight than usual, for better or worse.",
      "Pick the big move that is genuinely yours and start it, then tell the people it affects before it lands. Informing turns your launch into something people want to get behind, and it keeps the freedom Sagittarius promises you from turning into a fight."
    ),
    Generator: block(
      "You are the life force, and Sagittarius lights your engine up first.",
      "You carry a deep, renewable engine of energy that is designed to be spent on work that genuinely lights you up. In the right thing your energy is endless and magnetic, and in the wrong thing it drains and goes flat no matter how good the thing looks on paper.",
      "The Sun spends the first half of Sagittarius crossing your own centre, through the gates of power, focus and rhythm, so your energy is louder and more insistent than usual. Big opportunities show up this season and every one of them looks exciting. The trap is saying yes to all of them with your mind and then running out of fuel by Christmas.",
      "Let your gut choose the one or two big things you want to pour yourself into, and give them steady daily energy. Sagittarius rewards the Generator who commits fully to what lights her up and lets the shiny extras pass without guilt."
    ),
    "Manifesting Generator": block(
      "You are the multi-passionate powerhouse, and Sagittarius is your playground.",
      "You have the Generator's renewable engine plus a fast wiring to action, so you move quickly, juggle several things and skip steps other people need. You are efficient rather than scattered, even when linear people struggle to keep up.",
      "Sagittarius is a season of range, adventure and more, which your wiring loves, so expect a flood of ideas, plans and side quests. The Sun's pass across the gate of focus in the middle of the season is the counterweight, asking you to pick a lane long enough for the momentum to compound.",
      "Respond to what genuinely lights you up, then let the gate of focus help you choose. Keep the adventure, drop the projects your gut has already gone flat on, and inform the people affected before you pivot so your speed reads as vision."
    ),
    Projector: block(
      "You are the guide, and Sagittarius gives you the bird's-eye view.",
      "You are here to see people and systems clearly and to guide them, rather than to output energy all day. Your gift is penetrating insight, and it lands best when it is invited and recognised rather than pushed.",
      "Sagittarius is the season of the big picture and the teacher, which is exactly what you do, so your sense of where things are heading is unusually clear this month. The Sun ends the season on the Ajna's gate of ideas, which turns the volume up further. The risk is trying to keep up with the Sacral energy everyone else is running on, and burning out chasing their pace.",
      "Share your vision with the people who invite it, and let the season's expansion come to you through recognition rather than effort. Rest properly, because you are seeing far this month, and that takes energy you do not have on tap."
    ),
    Reflector: block(
      "You are the mirror, and Sagittarius shows you everyone's dreams at once.",
      "You take in and amplify the energy around you, which makes you a rare barometer of your environment and deeply wise about people. You are designed to change day to day rather than stay fixed.",
      "Sagittarius fills the air with optimism, big plans and restless energy, and you pick all of it up. Some days you will feel unstoppable and some days flat, and a lot of that is simply the people around you running hot on the season's Sacral energy.",
      "Enjoy the optimism without signing up to everyone's plans. Give any big decision the full lunar cycle, and spend the season somewhere that genuinely expands you, because your environment shapes how big you feel."
    ),
  },

  typeStrategy: {
    Manifestor: [
      "Start the big move that is yours, and inform the people it affects before it lands.",
      "Choose one launch over five, so your energy has an impact instead of a scatter.",
      "Treat any pushback as a sign you skipped the informing step.",
      "Rest hard between bursts, Sagittarius pace is fast and your energy is not built to sustain it.",
    ],
    Generator: [
      "Let your gut choose the one or two big things worth your energy this season.",
      "Ask a friend to put the big opportunities to you as yes or no questions, and listen for the sound.",
      "Give your yes things steady daily energy, the gate of fixed rhythms rewards consistency.",
      "Let the exciting extras pass when your body goes flat on them.",
    ],
    "Manifesting Generator": [
      "Respond first, then pick the lane with the most heat and stay in it long enough to compound.",
      "Keep a side-quest list so new ideas have somewhere to land without derailing you.",
      "Inform before you pivot, so your speed reads as vision to your people.",
      "Skip the steps that do not matter, and go back for the ones that do.",
    ],
    Projector: [
      "Wait for the invitation before you share the big vision you can see.",
      "Let the people who recognise your insight bring the opportunities to you.",
      "Stop matching the pace of the Sacral types around you, it is their season engine, not yours.",
      "Rest more than you think you need, big-picture seeing takes real energy.",
    ],
    Reflector: [
      "Enjoy everyone's optimism without signing up to their plans.",
      "Give every big decision a full lunar cycle, however lucky the moment feels.",
      "Choose environments that genuinely expand you, they decide how big you feel.",
      "Spend time alone to clear the restless energy you picked up.",
    ],
  },

  authorityLens: {
    emotional: block(
      "Sagittarius wants a yes right now, and your clarity needs the whole wave.",
      "Your Solar Plexus is defined, so you feel life as an emotional wave that rises and falls. Your clarity lives in the pattern across that wave, never in a single high or low moment.",
      "Sagittarius is the most optimistic season of the year, and the top of your wave can feel like pure certainty. The trap this month is booking the flight, signing up or promising the big thing from the high, then waking up a few days later feeling completely different about it.",
      "Let the excitement be real and still wait. Give every big yes a few nights, notice what stays true when you feel high, low and neutral, and move on the answer that survives the whole wave. The right opportunity will still be there."
    ),
    sacral: block(
      "The Sun is on your Sacral, so your gut is louder than it has been all year.",
      "Your Sacral responds instantly in the body, a lift of energy for yes and a flat drop for no. It speaks before your mind does, in pull and in sound rather than in reasoned argument.",
      "The Sun spends the first half of Sagittarius crossing the Sacral, through the gates of power, focus and rhythm, so your gut response is unusually strong and fast. The pressure this season is your mind getting excited about every big idea and talking you into things your body never actually said yes to.",
      "Ask yourself yes or no questions out loud about every opportunity that comes in, and trust the sound you make. Put your full energy behind the clear yeses and let the mental maybes go, however exciting they look."
    ),
    splenic: block(
      "Trust the soft first hit, even when the big idea is louder.",
      "Your Spleen gives you an in-the-moment intuition about what is right for your health, safety and timing. It is soft, it speaks once, and it does not repeat or justify itself.",
      "Sagittarius is a loud, optimistic season, and your instinct is quiet by nature, so it can get drowned out by everyone's enthusiasm, including your own. Your Spleen is the part of you that knows the difference between bold and reckless.",
      "Notice the first small signal before the excitement kicks in, and honour it. If something in you flinched for a second at a big yes, slow down long enough to listen, because that flinch is your instinct doing its job."
    ),
    ego: block(
      "The Sun crosses your Heart this season, so sell the dream you actually want.",
      "Your decisions run through your Heart, the seat of willpower, worth and genuine desire. The real question under every choice is whether you actually want it and have the heart to see it through.",
      "In the second half of Sagittarius the Sun crosses the Heart's gate of the persuader, the gate of selling, memory and making the big promise. Your willpower and your powers of persuasion are both amplified, and the risk is promising more than you genuinely want to deliver because the moment feels so big.",
      "Listen to what you say you want when you speak without editing, your voice gives your heart away. Make the big promise only when you mean it, sell what you believe in, and rest between pushes, because your heart is working harder this month."
    ),
    self: block(
      "You find your truth by saying it out loud, so say the big version.",
      "Your authority runs through your G centre, your identity and direction, and it comes out through your voice, so you reach clarity by talking and hearing what you say.",
      "Sagittarius is a season of direction and meaning, and the Sun touches the G's gate of love of self on its very last day. Your sense of where you are heading wants to grow, and you will only know how big when you hear yourself say it.",
      "Talk your biggest dream through with someone you trust who has no stake in your answer. Notice the version that makes you feel most like yourself when you say it, and trust that direction even if it is bigger than you planned."
    ),
    mental: block(
      "Your clarity comes in conversation, so have the big conversations this season.",
      "You have no single inner authority, so you are designed to reach clarity through open conversation in the right environment. You are a sounding board by design, and your wisdom surfaces out loud over time.",
      "Sagittarius ends with the Sun on the Ajna's gate of ideas, so this month is full of visions, philosophies and big plans to talk through. A new environment, a trip or a different room can unlock thinking that has been stuck for months.",
      "Change your scenery and talk the big ideas through with people who expand you. Notice which idea you keep coming back to in different rooms, and give it a few days before you act on it."
    ),
    lunar: block(
      "Give the big leaps a full month, however lucky they feel.",
      "As a Reflector, your clarity comes over a full lunar cycle. Because you sample the energy around you, a decision needs to be felt across roughly 28 days, through every mood, before it is truly yours.",
      "Sagittarius is a season of big leaps and lucky breaks, and you are amplifying everyone's optimism, so a decision can feel like destiny one week and noise the next.",
      "Take the full cycle on anything that matters, especially the exciting ones. Talk it through with different trusted people across the month, notice how it feels in different places, and trust the answer that holds all the way through."
    ),
  },

  profileLens: {
    "1/3": block(
      "You study the map, then go and test it in the wild.",
      "Line 1 needs a solid foundation of knowledge to feel secure, and line 3 learns through trial and error, discovering what works by bumping into what does not. You are a researcher who tests everything in practice.",
      "Sagittarius is the season of the student and the explorer, so your line 1 wants to learn something big and your line 3 wants to go and try it. Some of the experiments will not work, and each one is teaching you the real shape of the bigger life you want.",
      "Pick the subject that would most expand your life and go deep on it. Then take one real-world swing at it before the season ends, and write down what the swing taught you, hit or miss."
    ),
    "1/4": block(
      "You need solid ground under a big dream, so build it before you leap.",
      "Line 1 needs to know its subject inside out, and line 4 lives through relationships, so your opportunities arrive through people you already know rather than cold pitches.",
      "Sagittarius pushes everyone to leap, and line 4 likes to know where it is landing first. The expansion you want this season is most likely to arrive through your existing network, often through a friend of a friend.",
      "Do the research on the big idea, then tell the people close to you exactly what you want. Your next opportunity is one conversation away, and your network can only help with the dream you actually say out loud."
    ),
    "2/4": block(
      "Your gifts are bigger than you admit, and Sagittarius wants them seen.",
      "Line 2 carries talents that feel effortless and needs regular time alone to recharge and develop them, and line 4 thrives through your network. You get called out of your cave by the people who see what you have.",
      "Sagittarius is a social, expansive season, so the people around you are more likely than usual to call you out for something bigger. Your line 2 may want to wave it off because it feels too easy to count.",
      "Say yes to the call that genuinely lights you up, even when the gift feels too natural to be worth much. Keep your alone time, and let your network carry your talent further than you would carry it yourself."
    ),
    "2/5": block(
      "A natural talent people project onto, in a season of big promises.",
      "Line 2 holds effortless gifts and needs solitude, and line 5 gets projected onto as a practical fixer people expect to save the day.",
      "Sagittarius is a season of big visions and big expectations, and your line 5 attracts both. People may see you as the person who can make their dream happen, and the projection can be flattering and also bigger than anyone could deliver.",
      "Guard your alone time, and only say yes to the big asks you can genuinely deliver. Be clear about what you offer, so your reputation grows with the season rather than getting caught in someone else's fantasy."
    ),
    "3/5": block(
      "You learn by doing, and this season the adventure is the lesson.",
      "Line 3 finds truth through trial and error, and line 5 is projected onto as a practical, universal problem-solver. You turn hard-won lessons into solutions others can use.",
      "Sagittarius rewards experimenting and exploring, which is how your line 3 learns anyway. The things you try this month, including the ones that flop, become exactly the practical wisdom people come to you for.",
      "Take one bold experiment you have been putting off and run it this season. Share what you learn along the way, because your real-world lessons are the solution someone else needs."
    ),
    "3/6": block(
      "You learned by trying everything, and now your story has a view.",
      "Line 3 learns through trial and error, and line 6 matures across three life phases into a role model, so your messy early experiments are building the wisdom you later embody.",
      "Sagittarius is the season of perspective, which suits both of your lines. If you are in your early phase, expect some brilliant mistakes, and if you are maturing, notice how clearly you can see what all the trying was for.",
      "Be proud of the chapters that taught you the hard way, and keep your standards high. Live the bigger version of your life in a way you would be happy for someone to copy."
    ),
    "4/6": block(
      "Your people are your luck, and this season they open doors.",
      "Line 4 moves through your network, so life unfolds through the people you are bonded to, and line 6 grows into a role model across three phases.",
      "Sagittarius is generous and social, and for you that means opportunities arriving through the people you already love and trust. The bigger life you want this season is far more likely to come through a friend than a stranger.",
      "Tell your people what you are dreaming about, specifically, and let them help. Invest in the friendships that expand you, and model the kind of generosity you want to receive."
    ),
    "4/1": block(
      "A fixed, steady way of being, in a season that wants you everywhere.",
      "This is the one Juxtaposition profile, unusually fixed in how it operates. Line 4 lives through relationships and line 1 needs a deep foundation, so you have a stable way of being that influences the people around you.",
      "Sagittarius pushes everyone toward more, new and different, and your fixed nature does not need to follow. Your expansion this season comes from going further in your own direction rather than changing it.",
      "Stay true to how you operate and let Sagittarius make it bigger. Your steadiness is what lets the people around you dream safely, and your influence grows simply by being consistent."
    ),
    "5/1": block(
      "People expect you to deliver the dream, so make sure your foundation can hold it.",
      "Line 5 is projected onto as a practical rescuer people expect to fix things, and line 1 needs a solid foundation of knowledge to feel secure. You are the trusted expert called in a crisis.",
      "Sagittarius is a season of big promises and big visions, and people will look to you to make theirs real. When the projection gets bigger than reality, it can turn quickly.",
      "Do the deep research so your help holds, and be honest about what you can actually deliver. Say yes to the opportunities that genuinely suit you, and let your reputation grow from promises you keep."
    ),
    "5/2": block(
      "The world calls on your talent, and Sagittarius calls loudly.",
      "Line 5 gets projected onto as a universal problem-solver, and line 2 holds effortless gifts and needs solitude. You have real talent people keep pulling you out of your cave to use.",
      "Sagittarius brings invitations, opportunities and people wanting a piece of your gift, while your line 2 still needs its time alone to keep that gift alive.",
      "Protect your solitude, it is where your talent gets its power. Say yes only to the calls that genuinely feel right, and let people see the real you early so the projection stays honest."
    ),
    "6/2": block(
      "You are becoming the example, and Sagittarius shows you the bigger picture.",
      "Line 6 matures through three life phases into a role model, and line 2 carries natural gifts and needs solitude. You are building toward a way of living others learn from.",
      "Sagittarius is a season of perspective and meaning, and your line 6 sees further than most. This month shows you what your life is really about, and how much bigger it is allowed to be.",
      "Give yourself the solitude to see the whole picture, then live one part of the bigger vision out loud. Your example lands hardest when you are living what you believe."
    ),
    "6/3": block(
      "You have tried everything, and now you can see what it was for.",
      "Line 6 grows into a role model across three phases, and line 3 learns by trial and error. Your lived experience is exactly what makes you a believable, grounded example.",
      "Sagittarius rewards the explorer and the storyteller, and your experiments have given you a lot of story. The misadventures are some of the most useful parts of what you have to share this season.",
      "Own the wild chapters without shame and share what they taught you. Your honesty about the messy parts is what makes people trust your vision."
    ),
  },

  centreLens: {
    head: {
      defined: block(
        "A steady stream of inspiration, and this season it thinks big.",
        "You carry a consistent source of inspiration and mental pressure, and you can inspire others with the questions you ask.",
        "Sagittarius points your questions at meaning, purpose and possibility, what life could be, where you could go and what you actually believe.",
        "Follow the questions that make your life feel bigger, and share them, because your inspiration lifts the people around you this season."
      ),
      open: block(
        "You absorb everyone's big ideas, so choose which ones are yours.",
        "Your Head is open, so you take in and amplify other people's questions and mental pressure, which makes you impressionable to what is not yours.",
        "Sagittarius fills the air with big plans, hot takes and everybody's next adventure, and you may feel pressure to figure out a dream that belongs to someone else.",
        "Notice when an exciting idea arrived with another person, and check whether it actually belongs in your life. Keep your mind for the questions about your own dream."
      ),
    },
    ajna: {
      defined: block(
        "A fixed way of thinking, and this season it turns ideas into vision.",
        "You process information and form views in a fixed, reliable way, which makes you mentally consistent.",
        "The Sun ends Sagittarius on the Ajna's gate of ideas, and your fixed framework can turn a scatter of inspiration into one clear, compelling vision.",
        "Share your vision when it is invited, and stay open to the idea that someone else's philosophy has something to teach you."
      ),
      open: block(
        "Ideas will pour in, so hold them lightly.",
        "Your Ajna is open, so you think flexibly and can hold many perspectives, and you may feel pressure to appear certain.",
        "Sagittarius is a season of strong opinions and big beliefs, and with the Sun on the gate of ideas at the end of it, you may feel pressure to pick a philosophy and defend it.",
        "Enjoy the ideas without needing to be certain about any of them, and let your authority decide what to act on. You are allowed to change your mind as you learn."
      ),
    },
    throat: {
      defined: block(
        "A reliable voice, so use it to say the big thing.",
        "You have a reliable voice and a consistent way of expressing and getting things done.",
        "Sagittarius rewards honesty and big declarations, so the true, bold thing lands with real power when you say it this season.",
        "Say the big version of your goal out loud, simply and without hedging, and let your voice put your dream into the world."
      ),
      open: block(
        "Say the big thing when the moment is right, and let the rest wait.",
        "Your Throat is open, so you can channel many ways of expressing, and you may feel pressure to speak or act to get noticed.",
        "Sagittarius is loud, funny and blunt, and you may feel pressure to keep up, overshare or make a promise you have not thought through just to hold the room.",
        "Let the conversation come to you and speak when it feels right. Save your big announcements for when you are ready, because they land far harder that way."
      ),
    },
    g: {
      defined: block(
        "You know where you are going, and Sagittarius widens the road.",
        "You have a fixed sense of who you are and where you are going, a reliable inner direction.",
        "Sagittarius is a season of direction and meaning, and the Sun touches the G's gate of love of self on its last day, so your direction wants to get bigger, not different.",
        "Trust your direction and let yourself aim further along it. Love yourself enough to want the big version of the life you are already heading toward."
      ),
      open: block(
        "You become who you are around, so go where you feel big.",
        "Your G is open, so your sense of self and direction is shaped by where and who you are around, which makes you adaptable and a mirror for others.",
        "Sagittarius is a season of travel, new places and new people, and with an open G a change of scenery can change your whole sense of what is possible.",
        "Spend time in the places and with the people who make you feel most expansive. The right environment shows you who you are becoming."
      ),
    },
    heart: {
      defined: block(
        "Real willpower, and this season it can sell anything.",
        "You have reliable willpower and can make and keep promises when you genuinely want to.",
        "In the second half of Sagittarius the Sun crosses the Heart's gate of the persuader, so your willpower and your ability to sell an idea are both amplified.",
        "Put your will behind the dream you actually want and sell it with your whole chest. Rest between efforts, and only promise what you mean."
      ),
      open: block(
        "Your worth is settled, so stop overpromising to prove it.",
        "Your Heart is open, so you do not have consistent willpower on tap, and you can feel a pull to prove your worth.",
        "Sagittarius is a season of big promises, and with the Sun on the Heart's gate of the persuader you may feel pressure to commit to huge things or oversell yourself to prove you are enough.",
        "Make fewer promises and let your value speak without the hype. Your worth is real whether you are delivering the biggest thing in the room or not."
      ),
    },
    sacral: {
      defined: block(
        "A renewable engine, and the Sun starts the season right on it.",
        "You have a deep, renewable engine of energy for the work and life you love, meant to be spent fully each day.",
        "The Sun spends the first half of Sagittarius crossing the Sacral's gates of power, focus and rhythm, so your energy is amplified and wants a clear direction to pour into.",
        "Give your energy to what gets a strong gut yes and keep showing up for it daily. Sagittarius expansion shows up in your body as steady, committed fire."
      ),
      open: block(
        "You feel everyone's fire, so know when you have had enough.",
        "Your Sacral is open, so you do not have consistent life-force energy and can amplify other people's, then overwork without noticing.",
        "Sagittarius is a high-energy season with the Sun on the Sacral for two weeks, and you may borrow everyone's fire, overcommit to adventures and keep going long after your own energy ran out.",
        "Leave before you are depleted, spend time alone to discharge what you picked up, and let yourself rest while everyone else keeps running."
      ),
    },
    solarplexus: {
      defined: block(
        "Your emotions ride high this season, so let the wave settle before you leap.",
        "You experience life as an emotional wave moving through highs and lows, and it is also your decision-making authority.",
        "Sagittarius is a fire season full of excitement, and the high end of your wave can feel like certainty. The low after the high is just as real and just as temporary.",
        "Let the wave move all the way through before you commit to the big thing. Your excitement is real, and it gets more reliable when you give it time."
      ),
      open: block(
        "You feel the room's excitement, so check it is yours.",
        "Your Solar Plexus is open, so you absorb and amplify the emotions around you, and can avoid conflict to keep the peace.",
        "Sagittarius rooms are full of hype, big feelings and party energy, and you may feel swept into excitement or plans that were never your own.",
        "Notice when a big feeling arrived with another person and give yourself a moment alone before you commit. You are allowed to say the honest thing even when the room is buzzing."
      ),
    },
    spleen: {
      defined: block(
        "Your instincts are steady, so let them keep you bold without being reckless.",
        "You have a consistent intuition and a steady instinct for health and safety.",
        "Sagittarius encourages leaps, and your Spleen is the part of you that knows which leaps are safe to take right now.",
        "Trust the first read on every opportunity and act on it. When your instinct says go, go, and when it says not this one, believe it the first time."
      ),
      open: block(
        "Watch for holding on to what feels safe while the bigger life waits.",
        "Your Spleen is open, so you can become wise about health and survival, and you may hold onto things out of fear of letting go.",
        "Sagittarius asks you to leap, and with an open Spleen the fear of the unknown can keep you gripping a job, a place or a plan that you have outgrown.",
        "Notice what you are holding onto because it feels safe, and take one small step toward the bigger thing anyway. Courage is a practice, and Sagittarius rewards it."
      ),
    },
    root: {
      defined: block(
        "Steady under pressure, which keeps the big plans grounded.",
        "You handle pressure and stress in a steady, reliable way, with a consistent drive to get going.",
        "Sagittarius brings a rush of new ideas, plans and year-end pressure, and you can hold that without losing your rhythm.",
        "Let your big plans unfold at a pace you can sustain, and remember the people around you may feel the season's rush far more than you do."
      ),
      open: block(
        "The rush to do it all before January is contagious.",
        "Your Root is open, so you take in and amplify pressure, and can rush to get things done just to feel free of it.",
        "Sagittarius runs straight into the end of the year, and you may feel pressure to hit every goal, book every trip and start every plan before the calendar flips.",
        "Let the big things take the time they need, and choose what actually matters this side of January. The urgency you feel is often the season's, and it passes."
      ),
    },
  },

  crossLens: {
    "Right Angle": block(
      "This season asks you to make your own path bigger.",
      "Your incarnation cross is a personal destiny, so your path is fundamentally about your own growth and experience, with others in supporting roles.",
      "Sagittarius is the season of the personal quest, and it shows you where you have been dreaming too small for the life you are here to live.",
      "Aim your path further and back yourself before you have proof. Your expansion is personal, and it starts with what you are willing to want."
    ),
    "Left Angle": block(
      "Your purpose moves through people, and Sagittarius brings new ones.",
      "Your cross is a transpersonal karma, so your life is intertwined with others and your purpose plays out through relationships and encounters.",
      "Sagittarius is a season of travel, teachers and chance meetings, so the people who cross your path this month can open doors you did not know were there.",
      "Say yes to the conversations and meetings that feel fated, and share your vision with them. Your purpose expands through the right people."
    ),
    Juxtaposition: block(
      "Sagittarius asks everyone to expand, and your design goes further in its own direction.",
      "Your cross is a fixed fate, a single concentrated theme you are here to embody, with an unusually stable way of being.",
      "Sagittarius pushes everyone toward new horizons, and your fixed nature can feel that pull without needing to follow it.",
      "Take your theme further rather than trading it in. Your expansion this season is a bigger, bolder version of what you already are."
    ),
  },

  challenge: {
    Manifestor: "Start the one big move you have been sitting on, and tell the people it affects the day before you launch.",
    Generator: "Ask your gut yes or no about every new opportunity this season, out loud, and only commit to the clear yeses.",
    "Manifesting Generator": "Pick the one project with the most heat and give it steady daily energy until the end of the season.",
    Projector: "Share your big vision only with people who ask for it this season, and notice who keeps coming back for more.",
    Reflector: "Spend one day this season somewhere completely new and notice how big your dreams feel there compared with home.",
  },

  businessLens: {
    Manifestor: block(
      "Launch the big thing, and tell people it is coming.",
      "In business you are built to initiate, to start the thing and set it in motion rather than wait for demand to appear.",
      "Sagittarius is a season of bold launches and big visions, and the idea you have been sitting on is ready to go out into the world.",
      "Launch the offer or project that is genuinely yours, and let clients, partners and your team know before it lands. Your launches go further when people are ready to cheer."
    ),
    Generator: block(
      "Pour your energy into the offer that lights you up most.",
      "You build a business by responding to what genuinely lights you up and what the market is actually asking for, and your energy is what sells it.",
      "With the Sun on the Sacral for the first half of Sagittarius, your energy for the work you love is amplified, and so is the temptation to say yes to every new idea.",
      "Choose the offer your gut is most excited about and put your full energy behind it this season. Your enthusiasm is the best marketing you have."
    ),
    "Manifesting Generator": block(
      "Keep the ideas, back the one with momentum.",
      "You run a business best by experimenting across several things and following the ones with real energy, pivoting quickly.",
      "Sagittarius brings a flood of business ideas, and the gate of focus in the middle of the season asks you to choose which one gets your full fire.",
      "Back the idea with the most momentum and park the rest on a list. Tell your people before you pivot, so your speed reads as strategy."
    ),
    Projector: block(
      "Your vision is worth paying for, so make it visible.",
      "Your business gift is guiding, seeing what others miss and being recognised for that expertise.",
      "Sagittarius is the season of the teacher and the big picture, and the bird's-eye view you bring is exactly what people are looking for now.",
      "Share your perspective publicly so the right clients can recognise it, then wait for the invitation. Price your guidance for the bigger life it helps people build."
    ),
    Reflector: block(
      "Feel out every big opportunity for a full cycle.",
      "You sense trends and the health of a market unusually well, and you thrive in the right business environment.",
      "Sagittarius brings exciting opportunities and lots of hype, and you need time to separate the real expansion from the room's optimism.",
      "Take a full lunar cycle before any big business decision, and notice how you feel about it in different environments."
    ),
  },

  relationshipsLens: {
    Manifestor: block(
      "Keep your freedom, and keep your people in the loop.",
      "In relationships you need freedom and you move first, which can feel intense to others when you do not explain.",
      "Sagittarius is the season of freedom and adventure, and your need for space is even louder this month. The people close to you can handle it much better when they know what is happening.",
      "Tell your partner, friends and family about your plans before you go. Informing is what lets you have your freedom and your closeness at the same time."
    ),
    Generator: block(
      "Spend your fire on the people who light you up.",
      "You give the best of your energy to the people and connections that genuinely light you up.",
      "Sagittarius is a social, generous season, and your gut will be very clear about which invitations and people you actually want more of.",
      "Say yes to the people and plans your body lights up for, and let the obligated invitations go without guilt."
    ),
    "Manifesting Generator": block(
      "Find the people who want to go on the adventure with you.",
      "You bring fast, playful, multi-faceted energy to relationships and get restless with the flat ones.",
      "Sagittarius is a season of adventure, and you will feel very clearly who wants to come along and who would rather you stayed small and predictable.",
      "Invest in the people who match your pace and love your range. Tell them before you change plans, and take them with you."
    ),
    Projector: block(
      "Spend the season with the people who see your vision.",
      "You thrive with people who recognise and invite you, and you wilt where you feel unseen or used for output.",
      "Sagittarius brings parties, plans and lots of people, and you will feel clearly who is genuinely interested in what you see and who only wants your energy.",
      "Choose the people who invite your perspective, and let yourself skip the events that drain you. Your best connections this season are with the people who ask what you think."
    ),
    Reflector: block(
      "Choose the people who make you feel expansive.",
      "You take on the emotional climate of whoever you are around, so your relationships shape your whole experience.",
      "Sagittarius is full of social energy, and you will feel which people leave you feeling bigger and which ones shrink you back down.",
      "Spend more of your time with the people who expand you, and give yourself space to recover after big social days."
    ),
  },

  moneyLens: {
    Manifestor: block(
      "Start the new income stream you keep thinking about.",
      "You make money by starting things and creating new streams, in bursts rather than a steady grind.",
      "Sagittarius is Jupiter's season of luck and expansion, and the money idea you keep coming back to has real momentum behind it now.",
      "Start the new stream, and tell the people it affects before you do. The shadow is launching ten money ideas at once and finishing none of them."
    ),
    Generator: block(
      "Put your energy where the money and the joy meet.",
      "You earn most when you are doing work you genuinely love, your lit-up energy is the real asset.",
      "The Sun crosses the Sacral's gates of power, focus and rhythm at the start of Sagittarius, so this season shows you how much your energy can earn when it is pointed at the right thing every day.",
      "Give steady daily energy to the paid work your gut loves most. The shadow is chasing every shiny money opportunity until your energy is spread too thin to earn from any of them."
    ),
    "Manifesting Generator": block(
      "Back the income stream with the most heat.",
      "You can earn across several things at once and move fast between them.",
      "Sagittarius brings new money ideas and opportunities, and the gate of focus asks you to choose which stream deserves your full energy.",
      "Double down on the stream with real momentum and park the rest. The shadow is starting something new every week and never letting one grow."
    ),
    Projector: block(
      "Charge for the vision you bring.",
      "You earn best being recognised and invited for your expertise, not by grinding output.",
      "Sagittarius puts the teacher and the big-picture thinker in demand, and the Heart's gate of the persuader this season helps you name your value out loud.",
      "Raise your rates to match the size of the change your guidance creates, and work with people who value it. The shadow is undercharging because seeing the big picture feels easy to you."
    ),
    Reflector: block(
      "Feel out every money opportunity before you commit.",
      "You read financial timing and the right opportunities well when you are not rushed.",
      "Sagittarius brings exciting, lucky-feeling money opportunities, and you need time to feel which ones are real for you.",
      "Give every financial decision a full lunar cycle. The shadow is investing in someone else's dream because the room was so excited about it."
    ),
  },

  shadowIntro:
    "Sagittarius season shines a light on where you overpromise, overcommit and run from the thing in front of you toward the next horizon. Your open centres are where you take in and amplify the world, so they are where this season's hype, restlessness and pressure to do it all before January show up loudest, usually disguised as optimism, generosity or being up for anything. Naming them is how you keep the expansion and drop the burnout.",

  shadowByOpenCentre: {
    head: "Chasing everyone else's big ideas and trying to figure out dreams that were never yours to work out.",
    ajna: "Picking a belief and defending it to the death, and treating a fun idea as a fixed truth before your body has agreed.",
    throat: "Making the big announcement before you are ready, overpromising to hold the room and saying yes on the spot.",
    g: "Taking on someone else's adventure as your own direction because the scenery made it feel like destiny.",
    heart: "The big one this season, promising more than you want to deliver and overselling yourself to prove you are enough.",
    sacral: "Running on everyone's fire, saying yes to every plan and party and missing the moment you were done until you crash.",
    solarplexus: "Getting swept up in the room's hype and committing to plans from someone else's excitement.",
    spleen: "Gripping the safe, familiar option out of fear while the bigger life you want waits for you to move.",
    root: "Rushing to do it all before January, and treating the end of the year like a deadline for your whole life.",
  },

  practices: {
    emotional: {
      tapping: "Tap the side of your hand: even though this feels like a definite yes right now, I let the wave settle before I commit.",
      breathwork: "Breathe in for four and out for eight, for three minutes, whenever excitement makes you want to say yes right now.",
      journal: "What felt like a huge yes this week, and does it still feel that way now the wave has moved?",
      reset: "When the urge to book, buy or promise hits, put a hand on your belly, breathe, and give it one more night.",
    },
    sacral: {
      tapping: "Tap your collarbone: my gut knows which big thing is mine, and I give it my whole energy.",
      breathwork: "Two deep belly breaths, then ask yourself out loud whether you want this, and listen for the sound.",
      journal: "Which opportunity made my body light up this week, and which one did my mind talk me into?",
      reset: "Shake out your whole body for thirty seconds, then ask your gut one yes or no question about an opportunity in front of you.",
    },
    splenic: {
      tapping: "Tap the side of your hand: I hear the soft signal under the excitement, and I trust it.",
      breathwork: "One long, slow exhale, twice as long as the inhale, to drop below the hype and hear the instinct underneath it.",
      journal: "Where did my body give me a small signal this week before the excitement took over?",
      reset: "Pause, soften your belly, and notice the first signal before you say yes to anything big.",
    },
    ego: {
      tapping: "Tap your heart centre: I only promise what I want to deliver, and my worth stays the same either way.",
      breathwork: "Hand on heart, three slow breaths, and ask whether you actually want this or want to look impressive.",
      journal: "What did I promise or sell this week, and did I actually want it?",
      reset: "When you feel the pull to overpromise, pause with a hand on your chest and name what you genuinely want instead.",
    },
    self: {
      tapping: "Tap your throat: I say the big version of my dream out loud, and I hear my direction in it.",
      breathwork: "Three grounding breaths, then say your biggest dream out loud to yourself and notice how it feels to hear it.",
      journal: "When I talk about the future, what do I keep saying, and what does it tell me about where I am heading?",
      reset: "Voice-note someone you trust who has no stake in your answer and tell them the big version of your plan.",
    },
    mental: {
      tapping: "Tap the side of your hand: my clarity comes from the right room, and I go where my thinking expands.",
      breathwork: "Slow, easy breathing on a walk somewhere new, and notice which ideas come with you.",
      journal: "Which idea kept coming up in different conversations this week, and who helped me see it clearly?",
      reset: "Change your environment and talk the big idea through with someone who expands you.",
    },
    lunar: {
      tapping: "Tap your collarbone: I take the full cycle, and today's excitement does not decide for me.",
      breathwork: "Long, slow breaths somewhere that expands you, and let yourself feel the decision instead of rushing it.",
      journal: "How does this choice feel this week compared with last week, and what does the whole month say?",
      reset: "Spend time alone somewhere you love and notice how big your plans feel when nobody else's hype is in the room.",
    },
  },

  affirmationByType: {
    Manifestor: "I start the big thing that is mine, I let my people in, and my freedom makes my impact bigger.",
    Generator: "I give my energy to the dream that lights me up, and it grows every day I show up for it.",
    "Manifesting Generator": "I follow the heat, I back what has momentum, and my range makes my life bigger.",
    Projector: "My vision is valuable, I share it with the people who invite it, and the right opportunities find me.",
    Reflector: "I go where I feel expansive, I take all the time I need, and my dreams are allowed to be huge.",
  },

  weeklyQuestions: [
    "What did I dream about this week, and how much bigger could it be?",
    "Where did I follow my strategy to {strategy}, and where did I chase every shiny thing instead?",
    "Did I honour my {authority} way of deciding, or did the excitement of the moment decide for me?",
    "Where did I bet on myself this week before I had proof?",
    "What did the last chapter give me that I still need to collect?",
    "What is the big, slightly embarrassing version of my goal I can say out loud next week?",
  ],
};
