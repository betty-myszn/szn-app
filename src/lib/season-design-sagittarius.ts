// Sagittarius Season, read through Human Design. Same shape as the Leo, Virgo, Libra and Scorpio
// files: this is the ONE file that changes per season, everything here is Sagittarius-specific
// framing while the engine and all the natal Human Design logic stay identical. The identity layers
// describe her design rather than the season, so they carry over from the other seasons.
//
// Across Sagittarius the Sun crosses gates 34, 9 and 5 (the Sacral: power, focus and fixed
// rhythms), then 26 (the Heart: the persuader who sells the dream) and 11 (the Ajna: ideas and
// vision), touching 10 (the G: love of self) on the last day. That arc, from raw life force to a
// vision big enough to sell, is why the big life, luck and betting on yourself run through it.
// Checked against swisseph for 22 Nov to 21 Dec 2026.
//
// Betty asked for this one long and in depth (22 Nov 2026): the cycle and guidance layers run to
// two paragraphs, separated by a blank line, which the page renders with white-space: pre-line.
// The big themes she wants through every section: the BIGGGG life (money, freedom, adventure,
// magic, friendship), betting on yourself before the proof, Jupiter luck, saying the dream out
// loud, and harvesting what the last chapter gave you. Voice: warm, conversational, practical.
// No em dashes, no rhetorical questions in the prose.

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
    "Sagittarius season throws every window open. The Sun enters the sign of expansion, adventure, luck, truth and the big picture, ruled by Jupiter, the planet of growth and good fortune, so for everyone this is the part of the year that asks how big you are actually willing to let your life get. After a deep, heavy Scorpio season of looking at what was hidden, Sagittarius lifts your head up and points it at the horizon. It is the season of the big life: more money, more freedom, more adventure, more magic and more of the kind of friendships that make you feel like yourself.\n\nIn Human Design the Sun spends the first half of the season crossing the Sacral, the body's engine, through the gates of power, focus and fixed rhythms. That is why this season switches your life force on and asks you to point it somewhere that matters. In the second half the Sun moves into the Heart's gate of the persuader, the gate that sells the dream and makes the big promise, and then into the Ajna's gate of ideas, where a scatter of inspiration turns into a vision you can see clearly. On its very last day it touches the G's gate of love of self. Read together, the season moves from energy, to commitment, to belief, to vision, which is the exact order a big life gets built in.",
  encouraging:
    "This season is encouraging you to dream bigger than your current evidence, to say the slightly embarrassing version of your goal out loud, and to bet on yourself before you have proof it will work. It is encouraging adventure, generosity, honesty, travel, learning, laughing more and saying yes to the things that genuinely light you up. It wants you to stop being so realistic about your own life.\n\nIt also asks for one more skill alongside all that fire: collecting what the last chapter already gave you before you sprint at the next horizon. Sagittarius rewards you when you put your energy behind one direction long enough to see it move, when you make promises you actually want to keep, and when you let yourself want the big version of your life instead of the safe one.",
  activates: ["the big life", "expansion", "luck", "freedom", "self-belief", "adventure", "truth", "vision"],

  typeLens: {
    Manifestor: block(
      "You are the initiator, and Sagittarius hands you the starting gun for your big life.",
      "You are one of the rare few designed to start things from your own inner spark, without waiting for a cue. Your energy comes in fast, closed bursts that are meant to make an impact and then rest, rather than humming along steadily like everyone else's.",
      "Sagittarius is a fire season that loves a bold launch, which is basically your love language. Your urges to start something new will come thick and fast this month: the business idea, the move, the trip, the creative project, the big money goal. Jupiter's season makes all of them feel possible at once, and the temptation is to fire off five big moves in a week, tell nobody, then wonder why the people around you push back or try to slow you down.\n\nThe Sun also crosses the Heart's gate of the persuader in the second half of the season, so your words carry extra weight. When you speak about what you are starting, people listen and want in. When you move in silence, that same intensity can land as a shock. Sagittarius is offering you a huge amount of freedom this month, and the way you keep it is by letting people know what you are doing with it.",
      "Choose the one big move that feels most like your life getting bigger, the one that makes you feel free and a little bit scared, and start it before the season ends. Do not wait until you feel ready or until someone gives you permission, because your design was never built to wait. Then tell the people it affects before it lands, simply and directly: this is what I am doing, this is when, this is how it touches you.\n\nInforming is what turns your launch into something people want to cheer for, and it removes the resistance that usually costs you so much energy. Build rest into the season too. Sagittarius pace is fast and your energy comes in bursts, so plan your big push and then plan the lie-in, the bath, the day off. That rhythm is how you start something huge and still have the fire to keep it going in the new year."
    ),
    Generator: block(
      "You are the life force, and Sagittarius switches your engine on first.",
      "You carry a deep, renewable engine of energy that is designed to be spent on work that genuinely lights you up. In the right thing your energy is endless and magnetic, and in the wrong thing it drains and goes flat no matter how good the thing looks on paper.",
      "The Sun spends the first half of Sagittarius crossing your own centre, through the gates of power, focus and fixed rhythms, so your energy is louder, warmer and more insistent than usual. You may wake up with more fire than you have felt in months. Big opportunities and invitations show up this season, and with your engine running this hot, every one of them looks exciting.\n\nThe trap is saying yes to all of them with your mind, the party, the extra client, the course, the side hustle, the favour, and then hitting December feeling fried and frustrated. The gate of focus in the middle of the season is the antidote. It asks you to pick the one or two things your body genuinely wants and pour yourself into them, because your big life gets built through steady, satisfied energy in the right direction, never through scattering it everywhere.",
      "Let your gut choose your big thing this season. Write down every opportunity on your plate, have someone read each one to you as a yes or no question, and listen for the sound you make before your brain jumps in. An \"uh-huh\" with a lift in your chest is your yes. A flat \"hmm\" or a sinking feeling is your no, however good it looks on paper.\n\nThen give your yes things steady, daily energy. The gate of fixed rhythms rewards consistency, so even thirty minutes a day on your big dream compounds faster than a weekend binge. Let the shiny extras pass without guilt, because every no to a maybe is a yes to the life you actually want. Track your satisfaction as you go, and when you feel frustrated, take it as useful information that your energy wants a different direction."
    ),
    "Manifesting Generator": block(
      "You are the multi-passionate powerhouse, and Sagittarius is your playground.",
      "You have the Generator's renewable engine plus a fast wiring to action, so you move quickly, juggle several things and skip steps other people need. You are efficient rather than scattered, even when linear people struggle to keep up.",
      "Sagittarius is a season of range, adventure and more, which your wiring absolutely loves. Expect a flood of ideas, plans, side quests and spontaneous yeses. The Sun on your Sacral for the first half of the season turns your energy up, so you may find yourself starting three new things before breakfast and genuinely enjoying every one of them.\n\nThe Sun's pass across the gate of focus in the middle of the season is the counterweight. It asks you to pick a lane long enough for the momentum to compound, because a big life for you comes from range plus depth, never range alone. This season shows you which of your passions are genuinely building something and which ones are just fun ways to avoid the scary big one.",
      "Respond to what genuinely lights you up, then let the gate of focus help you choose the one project that gets your main fire for the rest of the season. Keep a side-quest list on your phone, so every new idea has somewhere to land without derailing you. You are allowed to keep the adventure, you just need one thing that you keep coming back to.\n\nWhen a project goes flat, let it go without calling it a failure, because your design learns by trying. Before you pivot, inform the people affected, so your speed reads as vision instead of chaos. Skip the steps that do not matter, and go back for the ones that do. By the end of the season you want one thing that has clearly grown, plus a list of exciting ideas waiting for the new year."
    ),
    Projector: block(
      "You are the guide, and Sagittarius gives you the bird's-eye view of everyone's big life.",
      "You are here to see people and systems clearly and to guide them, rather than to output energy all day. Your gift is penetrating insight, and it lands best when it is invited and recognised rather than pushed.",
      "Sagittarius is the season of the teacher, the philosopher and the big picture, which is exactly what you do naturally. Your sense of where things are heading, for you and for the people around you, is unusually clear this month. You can see the big life someone else could have long before they can. The Sun ends the season on the Ajna's gate of ideas, which turns the volume up even further on your vision.\n\nThe risk is the energy of the season itself. The Sun spends two weeks on the Sacral, so the Generators around you are running hot, and you may feel pressure to match their pace, say yes to everything and push your ideas onto people who never asked. That road ends in bitterness and burnout. Your big life comes through recognition, and Sagittarius brings plenty of it when you let yourself be seen.",
      "Make your vision visible without forcing it on anyone. Share your perspective in public, post the big idea, write the thing, speak about what you see, so the right people can recognise you and invite you in. Then wait for the invitation before you give someone the full download, and notice how much more powerful your guidance is when it is wanted.\n\nRest more than you think you need this season. Big-picture seeing takes real energy, and you do not have a consistent engine on tap. Say no to the events and commitments that drain you, and say yes to the rooms where people ask what you think. Let your biggest opportunities this month come to you through people who already value you, because that is exactly how your design was built to expand."
    ),
    Reflector: block(
      "You are the mirror, and Sagittarius shows you everyone's dreams at once.",
      "You take in and amplify the energy around you, which makes you a rare barometer of your environment and deeply wise about people. You are designed to change day to day rather than stay fixed.",
      "Sagittarius fills the air with optimism, big plans and restless energy, and you pick all of it up. Some days you will feel unstoppable, like your whole life is about to open up, and other days you will feel flat and unsure. A lot of that is simply the people around you running hot on the season's Sacral energy, and your system reflecting it back.\n\nThis is also a beautiful season for you, because Sagittarius loves new places, new people and new perspectives, and your design is shaped by your environment more than anyone's. The right room, the right trip or the right group of friends this month can show you exactly how big your life is meant to be.",
      "Enjoy the optimism without signing up to everyone's plans. When you feel a big rush of excitement, ask yourself whether it arrived with a person or a place, and give it time. Any big decision, the move, the money, the relationship, the new path, gets the full lunar cycle, around 28 days, and you talk it through with different trusted people along the way.\n\nPut real thought into where you spend this season. Go somewhere that genuinely expands you, even for one day: a new city, a beautiful hotel lobby, a walk somewhere you have never been. Notice how big your dreams feel there compared with home. Your environment is your most powerful tool, and Sagittarius is the perfect season to choose a bigger one."
    ),
  },

  typeStrategy: {
    Manifestor: [
      "Start the big move that is genuinely yours, before you feel ready.",
      "Inform the people it affects before it lands, simply and directly.",
      "Choose one big launch over five small ones, so your energy has an impact instead of a scatter.",
      "Treat any pushback as a sign you skipped the informing step, then go back and do it.",
      "Plan your rest as seriously as your launch, your energy comes in bursts.",
    ],
    Generator: [
      "Let your gut choose the one or two big things worth your energy this season.",
      "Have someone put every opportunity to you as a yes or no question, and listen for the sound.",
      "Give your yes things steady daily energy, the gate of fixed rhythms rewards consistency.",
      "Let the exciting extras pass when your body goes flat on them, without guilt.",
      "Treat frustration as information that your energy wants a different direction.",
    ],
    "Manifesting Generator": [
      "Respond first, then pick the lane with the most heat and stay in it long enough to compound.",
      "Keep a side-quest list so new ideas have somewhere to land without derailing you.",
      "Inform before you pivot, so your speed reads as vision to your people.",
      "Let flat projects go without calling them failures.",
      "Skip the steps that do not matter, and go back for the ones that do.",
    ],
    Projector: [
      "Make your vision visible in public, so the right people can recognise it.",
      "Wait for the invitation before you give someone the full download.",
      "Stop matching the pace of the Sacral types around you, that engine belongs to them.",
      "Say yes to the rooms where people ask what you think.",
      "Rest more than you think you need, big-picture seeing takes real energy.",
    ],
    Reflector: [
      "Enjoy everyone's optimism without signing up to their plans.",
      "Give every big decision a full lunar cycle, however lucky the moment feels.",
      "Choose environments that genuinely expand you, they decide how big you feel.",
      "Talk big choices through with different trusted people across the month.",
      "Spend time alone to clear the restless energy you picked up.",
    ],
  },

  authorityLens: {
    emotional: block(
      "Sagittarius wants a yes right now, and your clarity needs the whole wave.",
      "Your Solar Plexus is defined, so you feel life as an emotional wave that rises and falls. Your clarity lives in the pattern across that wave, never in a single high or low moment.",
      "Sagittarius is the most optimistic season of the year, and the top of your emotional wave can feel like pure certainty. You might feel completely sure about the flight, the course, the business idea, the person or the big purchase, so sure that waiting feels silly. A few days later, at the bottom of the wave, the same thing can feel like the worst idea you have ever had.\n\nYour truth is what stays steady across both of those moments. Let your big dreams survive a few nights, because the ones that survive are the ones you will actually follow through on.",
      "Feel the excitement fully and let it be real, then wait before you commit. Give every big yes at least a few nights. Check in with it when you feel amazing, when you feel low and when you feel neutral, and notice what stays true. When someone pushes you for an answer, \"let me sleep on it\" is a complete sentence.\n\nKeep a little note on your phone for the big ideas that land this season, with the date you had them. Look back at the list a week later and see which ones still give you that warm, steady pull. Those are your real yeses, and you can move on them with total confidence. The right opportunity will still be there after you have ridden the wave."
    ),
    sacral: block(
      "The Sun is on your Sacral, so your gut is the loudest it has been all year.",
      "Your Sacral responds instantly in the body, a lift of energy for yes and a flat drop for no. It speaks before your mind does, in pull and in sound rather than in reasoned argument.",
      "The Sun spends the first half of Sagittarius crossing the Sacral, through the gates of power, focus and fixed rhythms, so your gut response is unusually strong and fast this season. Your body knows exactly which parts of the big life it wants. The pressure this season comes from your mind, which gets excited about every big idea and can talk you into things your body never actually said yes to.\n\nThis is a huge season for you to learn the difference between mental excitement and a true gut yes. Mental excitement feels busy and buzzy in your head. A gut yes feels like a pull in your belly and a lift in your whole body, and it keeps going.",
      "Ask yourself yes or no questions out loud about every opportunity, and trust the sound you make. Better still, have a friend ask you: \"Do you want to go on this trip? Do you want to take this client? Do you want to start this in January?\" Your Sacral answers faster than your brain can argue.\n\nPut your full energy behind the clear yeses and let the mental maybes go, however exciting they look. Then commit to a daily rhythm with your yes things, because the gate of fixed rhythms rewards showing up every day. By the end of the season you want a life that is fuller of what lights you up, and lighter of everything your body was only tolerating."
    ),
    splenic: block(
      "Trust the soft first hit, even when the big idea is louder.",
      "Your Spleen gives you an in-the-moment intuition about what is right for your health, safety and timing. It is soft, it speaks once, and it does not repeat or justify itself.",
      "Sagittarius is a loud, optimistic, everybody-say-yes season, and your instinct is soft by nature, so it can get drowned out by the hype, including your own. Your Spleen is the part of you that knows the difference between bold and reckless, between a lucky leap and a fall. It shows you which doors are the safe ones to run through right now.\n\nYou may notice tiny signals this season: a flinch when someone pitches you something, a sudden urge to take a different route, a strong sense that now is the time to say yes. Those signals arrive once and then they are gone.",
      "Notice the first small signal before the excitement kicks in, and honour it in the moment. If something in you flinched for a second at a big yes, slow down long enough to listen, because that flinch is your instinct doing its job. If something in you lit up instantly, trust that too and move while the timing is right.\n\nDo not ask your Spleen to repeat itself or justify itself, because it will not. Practise acting on the first hit in small ways this season, which café, which call to return, which invitation to accept, so you trust it fully when the big opportunities arrive."
    ),
    ego: block(
      "The Sun crosses your Heart this season, so sell the dream you actually want.",
      "Your decisions run through your Heart, the seat of willpower, worth and genuine desire. The real question under every choice is whether you actually want it and have the heart to see it through.",
      "In the second half of Sagittarius the Sun crosses the Heart's gate of the persuader, the gate of selling, memory and making the big promise. Your willpower and your powers of persuasion are both amplified, so this is a brilliant season for pitching, selling, asking for the raise, launching the offer or making a bold commitment to yourself.\n\nThe risk is promising more than you genuinely want to deliver because the moment feels so big. Sagittarius makes everything feel possible, and your heart can sign you up for things your desire is not actually behind. A big life for you is built on promises you are excited to keep.",
      "Listen to what you say you want when you speak without editing, because your voice gives your heart away. Talk out loud about the big life you want this season and notice which parts make your voice light up. Those are the parts to put your willpower behind.\n\nMake the big promise only when you mean it, sell what you believe in with your whole chest, and price yourself for what you are worth. Then rest between pushes. Your heart is working harder than usual this month, and willpower that gets rest is willpower that keeps showing up for you in the new year."
    ),
    self: block(
      "You find your truth by saying it out loud, so say the big version.",
      "Your authority runs through your G centre, your identity and direction, and it comes out through your voice, so you reach clarity by talking and hearing what you say.",
      "Sagittarius is a season of direction, meaning and the big picture, and the Sun touches the G's gate of love of self on its very last day. Your sense of where you are heading wants to grow this month, and you will only know how big it can get when you hear yourself say it.\n\nYou may notice that when you talk about the future, a bigger version keeps slipping out: the move abroad, the business, the money number, the kind of life you have never said out loud. Pay attention to that. Your voice is showing you your direction.",
      "Talk your biggest dream through with someone you trust who has no stake in your answer, a friend, a coach, even a voice note to yourself. Say the big, slightly embarrassing version. Notice which version makes you feel most like yourself when you hear it, and trust that direction even if it is bigger than you planned.\n\nGo to places that make you feel like yourself this season, because your direction comes through clearer there. Love yourself enough to want the big version of your life, and let your voice lead the way there one sentence at a time."
    ),
    mental: block(
      "Your clarity comes in conversation, so have the big conversations this season.",
      "You have no single inner authority, so you are designed to reach clarity through open conversation in the right environment. You are a sounding board by design, and your wisdom surfaces out loud over time.",
      "Sagittarius ends with the Sun on the Ajna's gate of ideas, so this month is full of visions, philosophies and big plans to talk through. A new environment, a trip or a different room can unlock thinking that has been stuck for months. You may find yourself saying something in conversation that suddenly makes your whole next chapter make sense.\n\nThe risk is talking your dreams through with people who think small, because their doubt can stick to you. Who you talk to this season shapes how big you let yourself think.",
      "Change your scenery and talk the big ideas through with people who expand you, the friend who always says \"why not\", the mentor who has already done it, the coven. Notice which idea you keep coming back to in different rooms and with different people, and give it a few days before you act on it.\n\nGuard your dreams from the people who shrink them. You do not need to defend your big life to anyone, you only need to hear it clearly yourself. When a sentence lands like a breakthrough, write it down, because that is your clarity speaking."
    ),
    lunar: block(
      "Give the big leaps a full month, however lucky they feel.",
      "As a Reflector, your clarity comes over a full lunar cycle. Because you sample the energy around you, a decision needs to be felt across roughly 28 days, through every mood, before it is truly yours.",
      "Sagittarius is a season of big leaps and lucky breaks, and you are amplifying everyone's optimism, so a decision can feel like destiny one week and noise the next. The Sagittarius New Moon on the 8th of December falls right in the middle of the season, which makes it a beautiful marker for checking in on what you started feeling at the beginning.\n\nDream as big as you like this season, then let those dreams prove themselves to you over time, because what stays true across the whole cycle is genuinely yours.",
      "Take the full cycle on anything that matters, especially the exciting ones. Write the big idea down on the day it lands, then check in with it at the New Moon and again a couple of weeks later. Talk it through with different trusted people across the month, notice how it feels in different places, and trust the answer that holds all the way through.\n\nIn the meantime, let yourself enjoy the dreaming. You can plan, research and imagine the big life without committing to it yet. That is your design working perfectly."
    ),
  },

  profileLens: {
    "1/3": block(
      "You study the map, then go and test it in the wild.",
      "Line 1 needs a solid foundation of knowledge to feel secure, and line 3 learns through trial and error, discovering what works by bumping into what does not. You are a researcher who tests everything in practice.",
      "Sagittarius is the season of the student and the explorer, so your line 1 wants to learn something big and your line 3 wants to go out and try it. This is the perfect month to study the life you want, how people actually make the money, travel the world or build the business, and then take a real swing at it.\n\nSome of the experiments will not work, and that is the point. Each one shows you the real shape of the bigger life you want.",
      "Pick the subject that would most expand your life and go deep on it this season: a book, a course, a mentor, a deep dive. Then take one real-world swing before the season ends, send the pitch, book the trip, launch the tiny version.\n\nWrite down what each swing taught you, hit or miss, because that is how your line 3 turns a mess into wisdom. By the end of the season you want a foundation of knowledge and at least one brave experiment behind you."
    ),
    "1/4": block(
      "You need solid ground under a big dream, so build it, then leap.",
      "Line 1 needs to know its subject inside out, and line 4 lives through relationships, so your opportunities arrive through people you already know rather than cold pitches.",
      "Sagittarius pushes everyone to leap, and your line 4 likes to know where it is landing first. That instinct is wise. The expansion you want this season is most likely to arrive through your existing network, often through a friend of a friend or someone you have not spoken to in a while.\n\nYour line 1 also wants to understand the big dream properly before it commits, so research is part of your leap this season.",
      "Do the research on the big idea, then tell the people close to you exactly what you want. Be specific: the job, the city, the money number, the kind of client. Your next opportunity is usually one conversation away, and your network can only help with the dream you actually say out loud.\n\nSet up your next secure place before you let go of the old one, then let yourself leap fully. You do not need to know every detail, you just need enough ground under you to feel safe being bold."
    ),
    "2/4": block(
      "Your gifts are bigger than you admit, and Sagittarius wants them seen.",
      "Line 2 carries talents that feel effortless and needs regular time alone to recharge and develop them, and line 4 thrives through your network. You get called out of your cave by the people who see what you have.",
      "Sagittarius is a social, expansive season, so the people around you are more likely than usual to call you out for something bigger: an introduction, an invitation, a \"you should really do this\". Your line 2 may want to wave it off because the gift feels too easy to count.\n\nThe things that come naturally to you are often the exact things your big life is built on.",
      "Say yes to the call that genuinely lights you up, even when the gift feels too natural to be worth much. Ask the people who know you best what they think you are brilliant at, and listen to the answer without arguing.\n\nKeep your alone time, because it is where your gift recharges. Let your network carry your talent further than you would ever carry it yourself, and let yourself be surprised by how big it gets."
    ),
    "2/5": block(
      "A natural talent people project onto, in a season of big promises.",
      "Line 2 holds effortless gifts and needs solitude, and line 5 gets projected onto as a practical fixer people expect to save the day.",
      "Sagittarius is a season of big visions and big expectations, and your line 5 attracts both. People may see you as the person who can make their dream happen, and that projection can feel flattering, exciting and also much bigger than anyone could deliver.\n\nMeanwhile your line 2 is asking for time alone to develop your own gifts, which can feel at odds with everyone wanting a piece of you.",
      "Guard your alone time first, because it is where your real power comes from. Then only say yes to the big asks you can genuinely deliver, and be clear and specific about what you offer.\n\nWhen the projection is realistic, your reputation grows with the season and the right opportunities find you. Say no to anyone who wants you to be the hero of their fantasy, and save your energy for your own big life."
    ),
    "3/5": block(
      "You learn by doing, and this season the adventure is the lesson.",
      "Line 3 finds truth through trial and error, and line 5 is projected onto as a practical, universal problem-solver. You turn hard-won lessons into solutions others can use.",
      "Sagittarius rewards experimenting, exploring and saying yes to adventure, which is how your line 3 learns anyway. The things you try this month, including the ones that flop, become exactly the practical wisdom people come to you for.\n\nYour line 5 means people are watching how you handle it, so your boldness this season inspires more people than you realise.",
      "Take one bold experiment you have been putting off and run it this season. Try the new offer, take the solo trip, test the big idea in public. Treat every result as data, never as a verdict on you.\n\nShare what you learn along the way, honestly and practically. Your real-world lessons are the solution someone else needs, and sharing them is how your reputation grows."
    ),
    "3/6": block(
      "You learned by trying everything, and now your story has a view.",
      "Line 3 learns through trial and error, and line 6 matures across three life phases into a role model, so your messy early experiments are building the wisdom you later embody.",
      "Sagittarius is the season of perspective and the long view, which suits both of your lines. If you are in your early phase, expect some brilliant mistakes. If you are maturing, notice how clearly you can now see what all the trying was for.\n\nYour life is a story of adventures, and this season it wants to be told.",
      "Be proud of the chapters that taught you the hard way, and keep your standards high for the next ones. Write down the three biggest lessons your adventures have taught you, and notice how much wisdom is in there.\n\nLive the bigger version of your life in a way you would be happy for someone to copy, because people are already watching and learning from you."
    ),
    "4/6": block(
      "Your people are your luck, and this season they open doors.",
      "Line 4 moves through your network, so life unfolds through the people you are bonded to, and line 6 grows into a role model across three phases.",
      "Sagittarius is generous, social and lucky, and for you that means opportunities arriving through the people you already love and trust. The bigger life you want this season is far more likely to come through a friend, a colleague or a community than through a stranger.\n\nThis is also a beautiful season to deepen the friendships that expand you, the ones that make you feel brave.",
      "Tell your people what you are dreaming about, specifically, and let them help. Reconnect with the friends who always bring out your biggest self, and invest real time in them.\n\nModel the kind of generosity you want to receive: make the intro, share the opportunity, cheer loudly for other people's wins. Your network is your luck, and Sagittarius makes it grow."
    ),
    "4/1": block(
      "A fixed, steady way of being, in a season that wants you everywhere.",
      "This is the one Juxtaposition profile, unusually fixed in how it operates. Line 4 lives through relationships and line 1 needs a deep foundation, so you have a stable way of being that influences the people around you.",
      "Sagittarius pushes everyone toward more, new and different, and your fixed nature does not need to follow the crowd. Your expansion this season comes from going further in your own direction rather than changing it.\n\nThe people around you may be restless and reinventing themselves, and your steadiness becomes something they lean on.",
      "Stay true to how you operate, and let Sagittarius make it bigger. Ask what the expanded version of your current path looks like: more reach, more money, more freedom, more of what already works.\n\nYour steadiness is what lets the people around you dream safely, and your influence grows simply by being consistent and backing yourself."
    ),
    "5/1": block(
      "People expect you to deliver the dream, so make sure your foundation can hold it.",
      "Line 5 is projected onto as a practical rescuer people expect to fix things, and line 1 needs a solid foundation of knowledge to feel secure. You are the trusted expert called in a crisis.",
      "Sagittarius is a season of big promises and big visions, and people will look to you to make theirs real. Your line 5 can be incredibly persuasive this month, especially with the Sun crossing the Heart's gate of the persuader. When the projection gets bigger than reality, though, it can turn quickly.\n\nYour line 1 is your protection, because deep knowledge means you deliver what you promise.",
      "Do the deep research so your help holds, and be honest about what you can actually deliver. Say yes to the opportunities that genuinely suit your expertise and charge properly for them.\n\nLet your reputation grow from promises you keep. That is how your big life gets built: through trust that compounds season after season."
    ),
    "5/2": block(
      "The world calls on your talent, and Sagittarius calls loudly.",
      "Line 5 gets projected onto as a universal problem-solver, and line 2 holds effortless gifts and needs solitude. You have real talent people keep pulling you out of your cave to use.",
      "Sagittarius brings invitations, opportunities and people wanting a piece of your gift. Some of them are genuinely aligned with your big life, and some just want what you can do for them. Your line 2 still needs its time alone to keep that gift alive.\n\nThis season sharpens the tension between being called out into the world and needing to retreat.",
      "Protect your solitude, because it is where your talent gets its power. Say yes only to the calls that genuinely feel right, and let the rest go without guilt.\n\nLet people see the real you early, so the projection stays honest. The opportunities that fit your real self are the ones that grow into your big life."
    ),
    "6/2": block(
      "You are becoming the example, and Sagittarius shows you the bigger picture.",
      "Line 6 matures through three life phases into a role model, and line 2 carries natural gifts and needs solitude. You are building toward a way of living others learn from.",
      "Sagittarius is a season of perspective and meaning, and your line 6 sees further than most. This month shows you what your life is really about, and how much bigger it is allowed to be.\n\nYour line 2 needs solitude to see that clearly, away from the noise of the season.",
      "Give yourself the solitude to see the whole picture: a day alone, a long walk, a journal session about the life you want in five years. Then live one part of that bigger vision out loud this season.\n\nYour example lands hardest when you are living what you believe, and people are learning from how boldly you let yourself want more."
    ),
    "6/3": block(
      "You have tried everything, and now you can see what it was for.",
      "Line 6 grows into a role model across three phases, and line 3 learns by trial and error. Your lived experience is exactly what makes you a believable, grounded example.",
      "Sagittarius rewards the explorer and the storyteller, and your experiments have given you a lot of story. The misadventures are some of the most useful parts of what you have to share this season.\n\nYou can see the big picture of your own life now, and it is far more impressive than you give yourself credit for.",
      "Own the wild chapters without shame and share what they taught you, in a post, a conversation or a talk. Your honesty about the messy parts is what makes people trust your vision.\n\nKeep experimenting, too. Your line 3 never stops learning, and the next adventure is part of the example you are becoming."
    ),
  },

  centreLens: {
    head: {
      defined: block(
        "A steady stream of inspiration, and this season it thinks big.",
        "You carry a consistent source of inspiration and mental pressure, and you can inspire others with the questions you ask.",
        "Sagittarius points your questions at meaning, purpose and possibility: what life could be, where you could go, what you actually believe and how much is really available to you. Your inspiration is contagious this month, and the people around you feel braver after talking to you.",
        "Follow the questions that make your life feel bigger, and write them down. Share them with your people, because your inspiration lifts everyone around you this season. Let the questions lead to action, one brave step at a time."
      ),
      open: block(
        "You absorb everyone's big ideas, so choose which ones are yours.",
        "Your Head is open, so you take in and amplify other people's questions and mental pressure, which makes you impressionable to what is not yours.",
        "Sagittarius fills the air with big plans, hot takes and everybody's next adventure, and you may feel pressure to figure out a dream that belongs to someone else. You can end up mentally exhausted from carrying everyone's big ideas.",
        "Notice when an exciting idea arrived with another person, and check whether it actually belongs in your life. You can admire someone's dream without making it your project. Keep your mind for the questions about your own big life."
      ),
    },
    ajna: {
      defined: block(
        "A fixed way of thinking, and this season it turns ideas into vision.",
        "You process information and form views in a fixed, reliable way, which makes you mentally consistent.",
        "The Sun ends Sagittarius on the Ajna's gate of ideas, and your fixed framework can turn a scatter of inspiration into one clear, compelling vision. This is a powerful season for planning the year ahead.",
        "Map out your vision for the next twelve months while your mind is this clear, and share it when it is invited. Stay open to other people's philosophies, too, because Sagittarius loves a mind that keeps learning."
      ),
      open: block(
        "Ideas will pour in, so hold them lightly.",
        "Your Ajna is open, so you think flexibly and can hold many perspectives, and you may feel pressure to appear certain.",
        "Sagittarius is a season of strong opinions and big beliefs, and with the Sun on the gate of ideas at the end of it, you may feel pressure to pick a philosophy and defend it, or to have your whole plan figured out before you start.",
        "Enjoy the ideas without needing to be certain about any of them, and let your authority decide what to act on. You are allowed to change your mind as you learn, and your flexibility is a gift in a season this full of possibility."
      ),
    },
    throat: {
      defined: block(
        "A reliable voice, so use it to say the big thing.",
        "You have a reliable voice and a consistent way of expressing and getting things done.",
        "Sagittarius rewards honesty and big declarations, so the true, bold thing lands with real power when you say it this season. Your words can make things happen this month.",
        "Say the big version of your goal out loud, simply and without hedging. Post it, tell your people, write it on the wall. Let your voice put your dream into the world, because saying it is the first step to living it."
      ),
      open: block(
        "Say the big thing when the moment is right, and let the rest wait.",
        "Your Throat is open, so you can channel many ways of expressing, and you may feel pressure to speak or act to get noticed.",
        "Sagittarius is loud, funny and blunt, and you may feel pressure to keep up, overshare or make a promise you have not thought through just to hold the room.",
        "Let the conversation come to you and speak when it feels right. Save your big announcements for when you are ready, because they land far harder that way. Your voice is powerful when it is not forced."
      ),
    },
    g: {
      defined: block(
        "You know where you are going, and Sagittarius widens the road.",
        "You have a fixed sense of who you are and where you are going, a reliable inner direction.",
        "Sagittarius is a season of direction and meaning, and the Sun touches the G's gate of love of self on its last day, so your direction wants to get bigger rather than different. You may feel very clear this month about where your life is heading.",
        "Trust your direction and let yourself aim further along it. Love yourself enough to want the big version of the life you are already heading toward, and take one step toward it before the season ends."
      ),
      open: block(
        "You become who you are around, so go where you feel big.",
        "Your G is open, so your sense of self and direction is shaped by where and who you are around, which makes you adaptable and a mirror for others.",
        "Sagittarius is a season of travel, new places and new people, and with an open G a change of scenery can change your whole sense of what is possible. One trip or one new friendship can reset your direction this month.",
        "Spend time in the places and with the people who make you feel most expansive, and notice who you become there. The right environment shows you who you are becoming. Choose rooms that match the life you want."
      ),
    },
    heart: {
      defined: block(
        "Real willpower, and this season it can sell anything.",
        "You have reliable willpower and can make and keep promises when you genuinely want to.",
        "In the second half of Sagittarius the Sun crosses the Heart's gate of the persuader, so your willpower and your ability to sell an idea are both amplified. This is a brilliant season to pitch, launch, sell and ask for more.",
        "Put your will behind the dream you actually want and sell it with your whole chest. Raise your prices, make the ask, back yourself. Rest between efforts, and only promise what you genuinely mean."
      ),
      open: block(
        "Your worth is settled, so stop overpromising to prove it.",
        "Your Heart is open, so you do not have consistent willpower on tap, and you can feel a pull to prove your worth.",
        "Sagittarius is a season of big promises, and with the Sun on the Heart's gate of the persuader you may feel pressure to commit to huge things, oversell yourself or overspend to prove you are enough.",
        "Make fewer promises and let your value speak without the hype. Your worth is real whether you are delivering the biggest thing in the room or not. Your big life grows when you let yourself receive."
      ),
    },
    sacral: {
      defined: block(
        "A renewable engine, and the Sun starts the season right on it.",
        "You have a deep, renewable engine of energy for the work and life you love, meant to be spent fully each day.",
        "The Sun spends the first half of Sagittarius crossing the Sacral's gates of power, focus and rhythm, so your energy is amplified and wants a clear direction to pour into. You may feel stronger and more alive than you have in months.",
        "Give your energy to what gets a strong gut yes and keep showing up for it daily. Sagittarius expansion shows up in your body as steady, committed fire. Spend your energy fully each day, then sleep well."
      ),
      open: block(
        "You feel everyone's fire, so know when you have had enough.",
        "Your Sacral is open, so you do not have consistent life-force energy and can amplify other people's, then overwork without noticing.",
        "Sagittarius is a high-energy season with the Sun on the Sacral for two weeks, and you may borrow everyone's fire, overcommit to adventures and parties, and keep going long after your own energy ran out.",
        "Leave before you are depleted, spend time alone to discharge what you picked up, and let yourself rest while everyone else keeps running. Your big life is built on energy you protect."
      ),
    },
    solarplexus: {
      defined: block(
        "Your emotions ride high this season, so let the wave settle before you leap.",
        "You experience life as an emotional wave moving through highs and lows, and it is also your decision-making authority.",
        "Sagittarius is a fire season full of excitement, and the high end of your wave can feel like certainty. The low after the high is just as real and just as temporary.",
        "Let the wave move all the way through before you commit to the big thing. Your excitement is real, and it gets more reliable when you give it time. Enjoy the highs without making them promises."
      ),
      open: block(
        "You feel the room's excitement, so check it is yours.",
        "Your Solar Plexus is open, so you absorb and amplify the emotions around you, and can avoid conflict to keep the peace.",
        "Sagittarius rooms are full of hype, big feelings and party energy, and you may feel swept into excitement or plans that were never your own.",
        "Notice when a big feeling arrived with another person and give yourself a moment alone before you commit. You are allowed to say the honest thing even when the room is buzzing, and Sagittarius loves the truth."
      ),
    },
    spleen: {
      defined: block(
        "Your instincts are steady, so let them keep you bold without being reckless.",
        "You have a consistent intuition and a steady instinct for health and safety.",
        "Sagittarius encourages leaps, and your Spleen is the part of you that knows which leaps are safe to take right now. Your timing instinct is a superpower this month.",
        "Trust the first read on every opportunity and act on it. When your instinct says go, go, and when it says not this one, believe it the first time. Luck loves good timing."
      ),
      open: block(
        "Watch for holding on to what feels safe while the bigger life waits.",
        "Your Spleen is open, so you can become wise about health and survival, and you may hold onto things out of fear of letting go.",
        "Sagittarius asks you to leap, and with an open Spleen the fear of the unknown can keep you gripping a job, a place, a relationship or a plan that you have outgrown.",
        "Notice what you are holding onto only because it feels safe, and take one small step toward the bigger thing anyway. Courage is a practice, and Sagittarius rewards every brave step you take."
      ),
    },
    root: {
      defined: block(
        "Steady under pressure, which keeps the big plans grounded.",
        "You handle pressure and stress in a steady, reliable way, with a consistent drive to get going.",
        "Sagittarius brings a rush of new ideas, plans and end-of-year pressure, and you can hold that without losing your rhythm. You are the calm one while everyone else panics about the year ending.",
        "Let your big plans unfold at a pace you can sustain, and use your steadiness to build something real. Remember the people around you may feel the season's rush far more than you do."
      ),
      open: block(
        "The rush to do it all before January is contagious.",
        "Your Root is open, so you take in and amplify pressure, and can rush to get things done just to feel free of it.",
        "Sagittarius runs straight into the end of the year, and you may feel pressure to hit every goal, book every trip and start every plan before the calendar flips.",
        "Let the big things take the time they need, and choose what actually matters this side of January. The urgency you feel is often the season's, and it passes. Your big life does not have a deadline."
      ),
    },
  },

  crossLens: {
    "Right Angle": block(
      "This season asks you to make your own path bigger.",
      "Your incarnation cross is a personal destiny, so your path is fundamentally about your own growth and experience, with others in supporting roles.",
      "Sagittarius is the season of the personal quest, and it shows you where you have been dreaming too small for the life you are here to live. Your purpose is about your own growth, and this season your growth wants to go a lot further than you have been letting it.\n\nYou may feel a strong pull this month toward something that is entirely yours: a solo trip, a personal goal, a dream nobody else needs to understand.",
      "Aim your path further and back yourself before you have proof. Write down what your life would look like if you stopped dreaming small, then take one concrete step toward it this season.\n\nYour expansion is personal, and it starts with what you are willing to want. The people in your life will benefit from you living big, even though the path is yours alone."
    ),
    "Left Angle": block(
      "Your purpose moves through people, and Sagittarius brings new ones.",
      "Your cross is a transpersonal karma, so your life is intertwined with others and your purpose plays out through relationships and encounters.",
      "Sagittarius is a season of travel, teachers and chance meetings, so the people who cross your path this month can open doors you did not know were there. A conversation at a party, someone you meet on a trip or a friend of a friend could change the direction of your year.\n\nYour big life is a shared one, and this season the right people start to show up.",
      "Say yes to the conversations and meetings that feel fated, and share your vision with the people you meet. Go to the event, accept the invitation, reach out to the person you keep thinking about.\n\nPay attention to the people who make you feel bigger, and invest in them. Your purpose expands through the right relationships."
    ),
    Juxtaposition: block(
      "Sagittarius asks everyone to expand, and your design goes further in its own direction.",
      "Your cross is a fixed fate, a single concentrated theme you are here to embody, with an unusually stable way of being.",
      "Sagittarius pushes everyone toward new horizons, and your fixed nature can feel that pull without needing to follow it. While everyone else reinvents, you get to go deeper and further with what you already are.\n\nYour big life comes through mastering your theme, and this season gives it more reach.",
      "Take your theme further rather than trading it in. Ask what the bigger, bolder version of your current path looks like, and step into it.\n\nYour expansion this season is a sharpening of what you already are, and your consistency is what makes it powerful."
    ),
  },

  challenge: {
    Manifestor: "Start the one big move you have been sitting on, the one that makes your life feel bigger, and tell the people it affects the day before you launch it.",
    Generator: "Write down every opportunity on your plate, have a friend ask you yes or no about each one out loud, and commit only to the clear gut yeses for the rest of the season.",
    "Manifesting Generator": "Pick the one project with the most heat and give it steady daily energy until the end of the season, while every other idea goes on your side-quest list.",
    Projector: "Share your big vision publicly once this season, then give your deeper guidance only to the people who ask for it, and notice who keeps coming back.",
    Reflector: "Spend one full day this season somewhere completely new that makes you feel expansive, and write down how big your dreams feel there compared with home.",
  },

  businessLens: {
    Manifestor: block(
      "Launch the big thing, and tell people it is coming.",
      "In business you are built to initiate, to start the thing and set it in motion rather than wait for demand to appear.",
      "Sagittarius is a season of bold launches, big visions and Jupiter luck, and the idea you have been sitting on is ready to go out into the world. The Heart's gate of the persuader in the second half of the season makes your pitch especially powerful.\n\nThe risk is launching in silence, or launching five things at once, so nothing gets the impact it deserves.",
      "Launch the offer or project that is genuinely yours, the one that makes your business feel bigger. Give clients, partners and your team a heads-up before it lands, and tell them why you are excited.\n\nPick one launch for this season and give it your full burst of energy, then rest. Your launches go further when people are ready to cheer, and your big business is built on impact, one bold move at a time."
    ),
    Generator: block(
      "Pour your energy into the offer that lights you up most.",
      "You build a business by responding to what genuinely lights you up and what the market is actually asking for, and your energy is what sells it.",
      "With the Sun on the Sacral for the first half of Sagittarius, your energy for the work you love is amplified, and so is the temptation to say yes to every new idea, client and collaboration that comes in.\n\nThis season shows you very clearly which part of your business makes you feel alive, and that is the part that wants to grow.",
      "Choose the offer your gut is most excited about and put your full energy behind it this season. Talk about it everywhere, because your genuine enthusiasm is the best marketing you have.\n\nSay no to the work that makes you feel flat, even when the money is good, and redirect that energy into what you love. Build a steady daily rhythm around your best offer and watch it compound."
    ),
    "Manifesting Generator": block(
      "Keep the ideas, back the one with momentum.",
      "You run a business best by experimenting across several things and following the ones with real energy, pivoting quickly.",
      "Sagittarius brings a flood of business ideas, and the gate of focus in the middle of the season asks you to choose which one gets your full fire. You will feel which project is pulling ahead.\n\nYour business grows fastest when your range feeds one main thing.",
      "Back the idea with the most momentum and park the rest on a list for the new year. Test fast, cut what goes flat, double down on what works.\n\nTell your people before you pivot, so your speed reads as strategy. By the end of the season you want one clear winner with real traction."
    ),
    Projector: block(
      "Your vision is worth paying for, so make it visible.",
      "Your business gift is guiding, seeing what others miss and being recognised for that expertise.",
      "Sagittarius is the season of the teacher and the big picture, and the bird's-eye view you bring is exactly what people are looking for as they plan their next year. Your insight is in demand.\n\nThe risk is giving it away for free or chasing clients instead of letting them recognise you.",
      "Share your perspective publicly so the right clients can recognise it: a post, a workshop, a free talk. Then wait for the invitation and price your guidance for the bigger life it helps people build.\n\nCreate one offer that sells the transformation you see so clearly, and let the people who value you find it."
    ),
    Reflector: block(
      "Feel out every big opportunity for a full cycle.",
      "You sense trends and the health of a market unusually well, and you thrive in the right business environment.",
      "Sagittarius brings exciting opportunities and lots of hype, and you need time to separate the real expansion from the room's optimism. You are also brilliant at sensing what is about to take off.\n\nThis season you can see where the market is heading before almost anyone else.",
      "Take a full lunar cycle before any big business decision, and notice how you feel about it in different environments. Write down the trends you sense this season, because your read is valuable.\n\nWork from places that inspire you, and spend time with business people who think big."
    ),
  },

  relationshipsLens: {
    Manifestor: block(
      "Keep your freedom, and keep your people in the loop.",
      "In relationships you need freedom and you move first, which can feel intense to others when you do not explain.",
      "Sagittarius is the season of freedom and adventure, and your need for space is even louder this month. You may want to travel, go solo or chase something new, and the people close to you can feel left behind when they do not know what is happening.\n\nThe beautiful thing is that informing gives you both: the freedom and the closeness.",
      "Tell your partner, friends and family about your plans before you go. Share your big dreams with them, too, because the people who love you want to cheer for you.\n\nInvite your favourite people on one adventure this season, and keep some of it just for you. Freedom and love can live in the same life."
    ),
    Generator: block(
      "Spend your fire on the people who light you up.",
      "You give the best of your energy to the people and connections that genuinely light you up.",
      "Sagittarius is a social, generous season with lots of invitations, and your gut will be very clear about which people and plans you actually want more of. You may notice some friendships feel expansive and others feel like duty.\n\nYour big life includes friendships that feel like fuel.",
      "Say yes to the people and plans your body lights up for, and let the obligated invitations go without guilt. Plan something fun with the friends who make you feel most alive.\n\nIf you are dating, follow your gut response over your checklist this season. Your Sacral knows who you have real chemistry with."
    ),
    "Manifesting Generator": block(
      "Find the people who want to go on the adventure with you.",
      "You bring fast, playful, multi-faceted energy to relationships and get restless with the flat ones.",
      "Sagittarius is a season of adventure, and you will feel very clearly who wants to come along and who would rather you stayed small and predictable. Your energy is magnetic this month.\n\nThe right people love your range and want to keep up.",
      "Invest in the people who match your pace and love your many sides. Plan spontaneous things together, and keep the energy playful.\n\nTell them before you change plans, and take them with you on the adventure. Let the people who drain you fade naturally."
    ),
    Projector: block(
      "Spend the season with the people who see your vision.",
      "You thrive with people who recognise and invite you, and you wilt where you feel unseen or used for output.",
      "Sagittarius brings parties, plans and lots of people, and you will feel clearly who is genuinely interested in what you see and who only wants your energy. Some relationships will feel like they finally see you this season.\n\nYour best connections are the ones that ask what you think.",
      "Choose the people who invite your perspective, and let yourself skip the events that drain you. Plan intimate, meaningful time with the few who really see you.\n\nIf you are dating, notice who is curious about your mind, because that is where your best love lives."
    ),
    Reflector: block(
      "Choose the people who make you feel expansive.",
      "You take on the emotional climate of whoever you are around, so your relationships shape your whole experience.",
      "Sagittarius is full of social energy, and you will feel very clearly which people leave you feeling bigger and which ones shrink you back down. Your relationships are your environment, and they shape how big you dream.\n\nThis season shows you who belongs in your big life.",
      "Spend more of your time with the people who expand you, and give yourself space to recover after big social days. Notice how you feel after seeing each person, and let that guide you.\n\nCreate one special experience with the people you love most this season, somewhere beautiful and new."
    ),
  },

  moneyLens: {
    Manifestor: block(
      "Start the new income stream you keep thinking about.",
      "You make money by starting things and creating new streams, in bursts rather than a steady grind.",
      "Sagittarius is Jupiter's season of luck and expansion, and the money idea you keep coming back to has real momentum behind it now. This is a powerful season for you to make a bold money move.\n\nThe shadow is launching ten money ideas at once and finishing none of them.",
      "Choose one new income stream and start it this season. Set a bold money number for the next year and say it out loud. Inform the people it affects, like partners, clients or family, before you make big financial moves.\n\nYour money grows in bursts, so make the bold move, then let it build while you rest."
    ),
    Generator: block(
      "Put your energy where the money and the joy meet.",
      "You earn most when you are doing work you genuinely love, your lit-up energy is the real asset.",
      "The Sun crosses the Sacral's gates of power, focus and rhythm at the start of Sagittarius, so this season shows you how much your energy can earn when it is pointed at the right thing every day.\n\nThe shadow is chasing every shiny money opportunity until your energy is spread too thin to earn from any of them.",
      "Give steady daily energy to the paid work your gut loves most, and let go of the income that drains you. Ask your gut about your prices: \"Do I want to charge this?\" and listen for the sound.\n\nSet a money goal for the new year that feels exciting, not just realistic. Your joy is where your money lives."
    ),
    "Manifesting Generator": block(
      "Back the income stream with the most heat.",
      "You can earn across several things at once and move fast between them.",
      "Sagittarius brings new money ideas and opportunities, and the gate of focus asks you to choose which stream deserves your full energy. You will feel which one is pulling ahead.\n\nThe shadow is starting something new every week and never letting one grow.",
      "Double down on the stream with real momentum and park the rest on your list. Cut the income that costs you more energy than it brings in.\n\nTrack your numbers this season so you can see clearly which ideas are paying off. Your multi-passionate money is powerful when one stream leads."
    ),
    Projector: block(
      "Charge for the vision you bring.",
      "You earn best being recognised and invited for your expertise, not by grinding output.",
      "Sagittarius puts the teacher and the big-picture thinker in demand, and the Heart's gate of the persuader this season helps you name your value out loud.\n\nThe shadow is undercharging because seeing the big picture feels so easy to you.",
      "Raise your rates to match the size of the change your guidance creates, and work with people who value it. Create one premium offer around your clearest insight.\n\nLet the right clients find you through what you share publicly. Your money grows when you are recognised, and Sagittarius brings that recognition."
    ),
    Reflector: block(
      "Feel out every money opportunity before you commit.",
      "You read financial timing and the right opportunities well when you are not rushed.",
      "Sagittarius brings exciting, lucky-feeling money opportunities, and you need time to feel which ones are real for you. You are also great at sensing which opportunities are about to grow.\n\nThe shadow is investing in someone else's dream because the room was so excited about it.",
      "Give every financial decision a full lunar cycle. Talk your big money moves through with different trusted people across the month.\n\nNotice which money ideas still feel good after a few weeks, and trust those. Your patience is your money superpower."
    ),
  },

  shadowIntro:
    "Sagittarius season shines a light on where you overpromise, overcommit, overspend and run from the thing in front of you toward the next horizon. It is the shadow side of a big life: wanting so much, so fast, that you never actually collect what you already have.\n\nYour open centres are where you take in and amplify the world, so they are where this season's hype, restlessness and pressure to do it all before January show up loudest, usually disguised as optimism, generosity or being up for anything. Naming them is how you keep the expansion and drop the burnout.",

  shadowByOpenCentre: {
    head: "Chasing everyone else's big ideas and trying to figure out dreams that were never yours to work out.",
    ajna: "Picking a belief and defending it to the death, and treating a fun idea as a fixed truth before your body has agreed.",
    throat: "Making the big announcement before you are ready, overpromising to hold the room and saying yes on the spot.",
    g: "Taking on someone else's adventure as your own direction because the scenery made it feel like destiny.",
    heart: "The big one this season, promising more than you want to deliver and overselling or overspending to prove you are enough.",
    sacral: "Running on everyone's fire, saying yes to every plan and party and missing the moment you were done until you crash.",
    solarplexus: "Getting swept up in the room's hype and committing to plans from someone else's excitement.",
    spleen: "Gripping the safe, familiar option out of fear while the bigger life you want waits for you to move.",
    root: "Rushing to do it all before January, and treating the end of the year like a deadline for your whole life.",
  },

  practices: {
    emotional: {
      tapping: "Tap the side of your hand: even though this feels like a definite yes right now, I let the wave settle before I commit, and my big life waits for me.",
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
    Manifestor: "I start the big thing that is mine, I let my people in, and my freedom makes my life bigger.",
    Generator: "I give my energy to the dream that lights me up, and my big life grows every day I show up for it.",
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
