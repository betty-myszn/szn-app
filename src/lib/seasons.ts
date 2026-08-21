export interface SeasonInfo {
  sign: string;
  symbol: string;
  element: "fire" | "earth" | "air" | "water";
  startMonth: number; // 1-indexed
  startDay: number;
  endMonth: number;
  endDay: number;
  tagline: string;
  description: string;
  themes: string[];
  focus: string;
  affirmation: string;
  affirmations: string[]; // fuller deck, affirmation is always affirmations[0]
  ritual: string; // one concrete practice to run through the season
  watchFor: string; // the shadow pattern this season tends to surface
  weeklyArc: string[]; // four beats, how the season's energy builds across its run
  tickerLines: string[]; // five short slogans for the dashboard ticker, this season's energy in shorthand
}

// Approximate tropical zodiac season boundaries (exact ingress shifts by a day either side,
// precise dates come from Swiss Ephemeris in Phase B)
export const SEASONS: SeasonInfo[] = [
  {
    sign: "Aries", symbol: "♈", element: "fire",
    startMonth: 3, startDay: 20, endMonth: 4, endDay: 19,
    tagline: "the season of starting anyway.",
    description: "Aries season is the cosmic new year. This is the energy of the woman who stops waiting for the perfect moment and starts before she feels ready.",
    themes: ["courage", "initiation", "self-trust", "action"],
    focus: "Start the thing. Momentum beats perfection every single time.",
    affirmation: "I move first. My courage creates my reality.",
    affirmations: [
      "I move first. My courage creates my reality.",
      "I don't need permission to begin.",
      "My instincts are trustworthy. I act on them.",
      "Starting badly beats not starting.",
      "I back myself faster than I doubt myself.",
    ],
    ritual: "Pick the one thing you've been overthinking and do the first ugly version of it before the week is out, no plan, no polish, just motion.",
    watchFor: "the urge to launch ten things and finish none, this season rewards one bold move followed through, not five half-started ones",
    weeklyArc: [
      "the spark, a decision or idea arrives fast and demands to be acted on",
      "the friction, early resistance tests whether you actually meant it",
      "the push, momentum builds if you keep choosing action over analysis",
      "the proof, you can look back and see exactly what starting anyway got you",
    ],
    tickerLines: [
      "start before you're ready",
      "make the first move",
      "back yourself louder",
      "do it scared",
      "no more waiting",
    ],
  },
  {
    sign: "Taurus", symbol: "♉", element: "earth",
    startMonth: 4, startDay: 20, endMonth: 5, endDay: 20,
    tagline: "the season of soft power.",
    description: "Taurus season slows everything down on purpose. This is the energy of building wealth, savouring pleasure, and refusing to rush your own becoming.",
    themes: ["worth", "pleasure", "money", "consistency"],
    focus: "Build slow, build real. Your self-worth sets your net worth.",
    affirmation: "I am worthy of wealth, pleasure and ease.",
    affirmations: [
      "I am worthy of wealth, pleasure and ease.",
      "Slow progress is still progress. I don't rush my becoming.",
      "I choose quality, in what I buy, keep and tolerate.",
      "Rest is productive. My nervous system is an asset.",
      "I build things that are still standing in ten years.",
    ],
    ritual: "Audit one recurring expense or commitment this season and ask honestly whether it reflects the value you actually place on yourself, then change it.",
    watchFor: "comfort curdling into avoidance, this season can quietly talk you out of any change that disturbs the status quo, even a good one",
    weeklyArc: [
      "the settle, you slow down and notice what actually feels good versus what you've just tolerated",
      "the build, small, unglamorous, repeated actions start compounding",
      "the test, comfort tempts you to stop one step before the real result",
      "the harvest, the thing you built slowly turns out to be the thing that lasts",
    ],
    tickerLines: [
      "receive it all",
      "charge your worth",
      "slow is luxury",
      "buy the good one",
      "rest is productive",
    ],
  },
  {
    sign: "Gemini", symbol: "♊", element: "air",
    startMonth: 5, startDay: 21, endMonth: 6, endDay: 20,
    tagline: "the season of saying it out loud.",
    description: "Gemini season hands you the mic. This is the energy of sharing your ideas, starting the conversations, and letting yourself be heard.",
    themes: ["voice", "curiosity", "connection", "ideas"],
    focus: "Speak up. Your ideas are only valuable once they leave your head.",
    affirmation: "My voice opens doors. I say what I mean.",
    affirmations: [
      "My voice opens doors. I say what I mean.",
      "I don't need the perfect words, I need the honest ones.",
      "Curiosity is a strategy, not a distraction.",
      "I say the unpolished version out loud, then refine it.",
      "The conversation I'm avoiding is the one that moves things forward.",
    ],
    ritual: "Send the message, make the call or post the thing you've been drafting in your head, this season punishes overthinking and rewards the unfinished sentence said out loud.",
    watchFor: "scattering across ten half-finished ideas instead of following one conversation all the way through to something real",
    weeklyArc: [
      "the download, new ideas and information arrive faster than usual",
      "the chatter, conversations multiply, some of them matter more than they first seem to",
      "the sort, you start noticing which threads are worth pulling and which were just noise",
      "the send, you finally say, write or pitch the thing that's been sitting in drafts",
    ],
    tickerLines: [
      "say the thing",
      "send the message",
      "ask the question",
      "post it anyway",
      "talk that talk",
    ],
  },
  {
    sign: "Cancer", symbol: "♋", element: "water",
    startMonth: 6, startDay: 21, endMonth: 7, endDay: 21,
    tagline: "the season of coming home to yourself.",
    description: "Cancer season pulls you inward. This is the energy of tending your inner world, protecting your peace, and mothering the woman you're becoming.",
    themes: ["intuition", "home", "emotional depth", "self-care"],
    focus: "Protect your energy. Your softness is a strategy, not a weakness.",
    affirmation: "I am safe within myself. My intuition leads me true.",
    affirmations: [
      "I am safe within myself. My intuition leads me true.",
      "I protect my peace without needing to explain it.",
      "My sensitivity is information, not a flaw.",
      "I nurture myself as fiercely as I nurture everyone else.",
      "Home is a feeling I can create anywhere.",
    ],
    ritual: "Say no to one commitment this season purely because it doesn't feel like emotional safety, no further justification required.",
    watchFor: "retreating so far inward that asking for help starts to feel unsafe, this season's softness is meant to restore you, not isolate you",
    weeklyArc: [
      "the pull inward, your energy naturally starts prioritising home and inner life over outward performance",
      "the sort, old feelings or memories surface, asking to finally be processed rather than managed",
      "the tend, you start actively caring for your emotional world instead of just surviving it",
      "the return, you re-emerge steadier, with a clearer read on what actually feels safe",
    ],
    tickerLines: [
      "protect your peace",
      "feel it fully",
      "go home early",
      "soft is strong",
      "let them care",
    ],
  },
  {
    sign: "Leo", symbol: "♌", element: "fire",
    startMonth: 7, startDay: 22, endMonth: 8, endDay: 22,
    tagline: "your main character era starts now.",
    description: "Leo season is your cosmic reminder that you didn't come here to watch everyone else live the life you want. This is the energy of visibility, confidence, and taking up every inch of your space.",
    themes: ["visibility", "confidence", "self-expression", "magnetism"],
    focus: "Be seen. Stop watering yourself down and let them look.",
    affirmation: "I was born to be seen. My presence is the point.",
    affirmations: [
      "I was born to be seen. My presence is the point.",
      "I don't shrink to make other people comfortable.",
      "My confidence doesn't need an audience to be real, but I let one see it anyway.",
      "I celebrate myself loudly and often.",
      "Being looked at is not the same as being vulnerable.",
    ],
    ritual: "Do one visible, celebratory thing this season that you'd normally downplay, post it, wear it, say it out loud, let yourself be seen doing well.",
    watchFor: "needing applause to feel like the effort counted, this season's confidence is meant to come from you first, admiration is the bonus, not the fuel",
    weeklyArc: [
      "the spotlight finds you, opportunities to be seen show up faster than usual",
      "the test, self-doubt shows up right as the visibility does, asking if you're allowed to take up this much space",
      "the shine, you choose to show up fully anyway, and it starts to feel more natural",
      "the standing ovation, this season's confidence becomes evidence you can carry into the next one",
    ],
    tickerLines: [
      "live the dreaaam",
      "wear the outfit",
      "say yaaaaas",
      "post the video",
      "take up space",
    ],
  },
  {
    sign: "Virgo", symbol: "♍", element: "earth",
    startMonth: 8, startDay: 23, endMonth: 9, endDay: 22,
    tagline: "the season of getting your life together.",
    description: "Virgo season is the glow-up in the details. This is the energy of refining your routines, upgrading your standards, and treating your daily habits as sacred.",
    themes: ["routines", "wellness", "refinement", "devotion"],
    focus: "Perfect the system. Your habits are votes for your future self.",
    affirmation: "My daily choices build my dream life.",
    affirmations: [
      "My daily choices build my dream life.",
      "Done and imperfect beats perfect and hidden.",
      "I refine what already works instead of starting over.",
      "My standards are high because I respect myself, not to punish myself.",
      "Small, repeated actions are how I actually change.",
    ],
    ritual: "Pick one daily habit that's been sloppy and run it perfectly for seven straight days, notice what shifts in how you feel about yourself, not just the outcome.",
    watchFor: "turning self-improvement into self-punishment, this season's standards are meant to build you up, not give you a new reason to feel behind",
    weeklyArc: [
      "the audit, you start noticing exactly where the small cracks are, in routines, systems, habits",
      "the fix, you tighten one system at a time instead of overhauling everything at once",
      "the discipline, consistency starts to feel less like effort and more like identity",
      "the polish, the improved version of your daily life becomes the new normal, not the exception",
    ],
    tickerLines: [
      "ship it imperfect",
      "fix the system",
      "drink the water",
      "finish the thing",
      "raise the standard",
    ],
  },
  {
    sign: "Libra", symbol: "♎", element: "air",
    startMonth: 9, startDay: 23, endMonth: 10, endDay: 22,
    tagline: "the season of beautiful balance.",
    description: "Libra season is the art of the both/and. This is the energy of magnetic relationships, aesthetic upgrades, and asking for exactly what you want.",
    themes: ["relationships", "beauty", "balance", "harmony"],
    focus: "Raise the standard. You attract at the level you believe you deserve.",
    affirmation: "I attract relationships that match my worth.",
    affirmations: [
      "I attract relationships that match my worth.",
      "My honest preference is not a conflict, it's clarity.",
      "I choose beauty and ease on purpose, not by accident.",
      "The right people want my real answer, not my agreeable one.",
      "Balance is a practice, not a personality trait I either have or don't.",
    ],
    ritual: "Say your actual preference out loud once this season instead of defaulting to whatever keeps the peace, notice that the room doesn't fall apart.",
    watchFor: "keeping harmony at your own expense, agreeing your way out of your own needs so nobody has to feel friction but you",
    weeklyArc: [
      "the mirror, relationships and comparisons highlight where your standards have quietly slipped",
      "the ask, you start voicing preferences you'd usually have swallowed to keep things smooth",
      "the recalibration, one relationship or agreement shifts to actually reflect what you want",
      "the balance, ease returns, but this time it's built on honesty instead of avoidance",
    ],
    tickerLines: [
      "know your worth",
      "say what you want",
      "make it beautiful",
      "even it out",
      "choose you too",
    ],
  },
  {
    sign: "Scorpio", symbol: "♏", element: "water",
    startMonth: 10, startDay: 23, endMonth: 11, endDay: 21,
    tagline: "the season of going deeper.",
    description: "Scorpio season strips away everything fake. This is the energy of shadow work, transformation, and reclaiming the power you gave away.",
    themes: ["transformation", "shadow work", "power", "intimacy"],
    focus: "Face the shadow. What you avoid controls you, what you face frees you.",
    affirmation: "I transform everything I touch. My depth is my power.",
    affirmations: [
      "I transform everything I touch. My depth is my power.",
      "I can look directly at what scares me without it destroying me.",
      "Letting go of control is how I get my power back.",
      "My intensity is not too much, it's exactly the amount I need.",
      "What I face loses its grip on me.",
    ],
    ritual: "Name, in writing, the one thing you've been avoiding looking at directly this season, then take a single concrete action toward facing it, not fixing it fully, just facing it.",
    watchFor: "gripping control so tightly that nothing gets to be easy, this season asks you to release, not white-knuckle, your way through transformation",
    weeklyArc: [
      "the surfacing, something you've been avoiding starts insisting on being looked at",
      "the descent, facing it feels harder before it feels better, this is normal, not a sign you're doing it wrong",
      "the shed, an old identity, relationship or story starts to loosen its grip",
      "the rebirth, you emerge with real, earned power instead of the performance of it",
    ],
    tickerLines: [
      "face it head on",
      "no more pretending",
      "want it out loud",
      "let it burn",
      "go all the way",
    ],
  },
  {
    sign: "Sagittarius", symbol: "♐", element: "fire",
    startMonth: 11, startDay: 22, endMonth: 12, endDay: 20,
    tagline: "the season of thinking bigger.",
    description: "Sagittarius season blows the roof off your plans. This is the energy of expansion, bold visions, and betting on yourself in public.",
    themes: ["expansion", "vision", "freedom", "optimism"],
    focus: "Think bigger. The size of your dream should scare the old you.",
    affirmation: "I expand into every room I enter. More is available to me.",
    affirmations: [
      "I expand into every room I enter. More is available to me.",
      "I bet on myself before I have proof it'll work.",
      "My vision is allowed to be bigger than my current evidence.",
      "Freedom is not the absence of commitment, it's choosing on purpose.",
      "I harvest what I've already planted before chasing the next horizon.",
    ],
    ritual: "Say the bigger, slightly embarrassing version of your goal out loud to one person this season, notice how much smaller it feels once it's not just in your head.",
    watchFor: "sprinting toward the next horizon so fast you never actually collect what the last one gave you, expansion needs a harvest, not just more planting",
    weeklyArc: [
      "the widening, your sense of what's possible grows faster than your plan does",
      "the leap, an opportunity or decision asks you to bet on yourself before you feel ready",
      "the overreach, you learn the difference between bold and unrooted the hard way, or you catch it in time",
      "the view, you can see further than you could at the start of the season, and that view is the point",
    ],
    tickerLines: [
      "dream it bigger",
      "book the flight",
      "say yes to more",
      "go find out",
      "aim higher",
    ],
  },
  {
    sign: "Capricorn", symbol: "♑", element: "earth",
    startMonth: 12, startDay: 21, endMonth: 1, endDay: 19,
    tagline: "the season of empire building.",
    description: "Capricorn season is CEO energy activated. This is the energy of long-game ambition, structures that hold your success, and becoming the authority.",
    themes: ["ambition", "discipline", "legacy", "mastery"],
    focus: "Build the empire. Discipline is self-love with a plan.",
    affirmation: "I am the authority in my own life. I build what lasts.",
    affirmations: [
      "I am the authority in my own life. I build what lasts.",
      "Discipline is self-love with a plan.",
      "I'm allowed to rest, I'm a person, not a performance metric.",
      "Every unglamorous rep is building something unshakeable.",
      "I don't need the finish line to feel proud of the climb.",
    ],
    ritual: "Set one long-term structure this season, a savings rule, a work boundary, a standing habit, that your future self will still be benefiting from in five years.",
    watchFor: "measuring your entire worth in output and postponing joy until some finish line that keeps quietly moving further away",
    weeklyArc: [
      "the survey, you get honest about where the gap is between where you are and where you're building toward",
      "the grind, unglamorous, repeated effort becomes the whole strategy, not a means to skip past",
      "the test, exhaustion or self-doubt asks whether the climb is even worth it, it is",
      "the summit, something you built patiently starts visibly holding weight",
    ],
    tickerLines: [
      "build the empire",
      "do it daily",
      "own the plan",
      "play the long game",
      "boss it up",
    ],
  },
  {
    sign: "Aquarius", symbol: "♒", element: "air",
    startMonth: 1, startDay: 20, endMonth: 2, endDay: 18,
    tagline: "the season of being unapologetically you.",
    description: "Aquarius season breaks every mould. This is the energy of radical authenticity, future-self thinking, and standing out on purpose.",
    themes: ["authenticity", "innovation", "community", "vision"],
    focus: "Be the original. Fitting in was never your assignment.",
    affirmation: "My difference is my genius. I belong to the future.",
    affirmations: [
      "My difference is my genius. I belong to the future.",
      "I stop editing my weirdness the moment it becomes magnetic.",
      "My community is built on shared values, not shared comfort zones.",
      "I trust the idea that seems too strange to be right.",
      "Belonging to myself matters more than belonging to the room.",
    ],
    ritual: "Make one unconventional choice on purpose this season, the option that keeps you from blending in, and notice what it opens up.",
    watchFor: "detaching from your own feelings and hiding behind ideas or independence whenever real intimacy or vulnerability gets close",
    weeklyArc: [
      "the signal, an idea, cause or community that feels ahead of its time starts pulling your attention",
      "the friction, standing out costs something, socially or internally, before it pays off",
      "the commitment, you choose authenticity over blending in, even when it's easier not to",
      "the frequency, your original angle starts attracting exactly the people and outcomes built for it",
    ],
    tickerLines: [
      "be the weird one",
      "break the mould",
      "fit in never",
      "do it your way",
      "change the rules",
    ],
  },
  {
    sign: "Pisces", symbol: "♓", element: "water",
    startMonth: 2, startDay: 19, endMonth: 3, endDay: 19,
    tagline: "the season of dreaming it real.",
    description: "Pisces season dissolves the limits. This is the energy of imagination, spiritual connection, and trusting the vision before there's proof.",
    themes: ["dreams", "intuition", "surrender", "creativity"],
    focus: "Trust the vision. Your imagination is showing you a preview.",
    affirmation: "I trust what I cannot yet see. My dreams are instructions.",
    affirmations: [
      "I trust what I cannot yet see. My dreams are instructions.",
      "My intuition is more accurate than my doubt.",
      "I let my imagination lead before logic catches up.",
      "Compassion needs a container, mine included.",
      "I create and connect from a place others can't access.",
    ],
    ritual: "Write down one recurring dream, daydream or intuitive hit from this season and take a single concrete step toward it, treat it as data, not fantasy.",
    watchFor: "dissolving into other people's needs and emotions until your own edges disappear, this season's compassion needs boundaries or it becomes self-abandonment",
    weeklyArc: [
      "the dream, imagination, intuition and inspiration run louder than usual, pay attention to the repeats",
      "the blur, boundaries between you and others, or between plan and fantasy, get harder to feel",
      "the anchor, you choose one intuitive hit to actually act on instead of just floating in all of them",
      "the manifestation, something that started as a feeling becomes something you can point to",
    ],
    tickerLines: [
      "trust the vision",
      "follow the feeling",
      "dream it real",
      "rest and receive",
      "let it come",
    ],
  },
];

export function getCurrentSeason(date: Date = new Date()): SeasonInfo {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  for (const season of SEASONS) {
    if (season.startMonth === season.endMonth) continue;
    if (season.startMonth > season.endMonth) {
      // wraps the year boundary (Capricorn)
      if (
        (month === season.startMonth && day >= season.startDay) ||
        (month === season.endMonth && day <= season.endDay)
      ) {
        return season;
      }
    } else if (
      (month === season.startMonth && day >= season.startDay) ||
      (month === season.endMonth && day <= season.endDay) ||
      (month > season.startMonth && month < season.endMonth)
    ) {
      return season;
    }
  }
  return SEASONS[4]; // unreachable fallback
}

export function getNextSeason(date: Date = new Date()): SeasonInfo {
  const current = getCurrentSeason(date);
  const idx = SEASONS.findIndex((s) => s.sign === current.sign);
  return SEASONS[(idx + 1) % 12];
}

export function formatSeasonDates(season: SeasonInfo): string {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return `${months[season.startMonth - 1]} ${season.startDay} – ${months[season.endMonth - 1]} ${season.endDay}`;
}
