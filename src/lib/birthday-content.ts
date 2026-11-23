// The copy for the birthday reading (/your-season/birthday and the birthday email).
//
// Six layers, each with its own job so no two cards on the page say the same thing:
//   YEAR_HOUSE      the life area her whole year is about (annual profection, house = age mod 12 + 1)
//   YEAR_LORD       the planet running her year (ruler of that profected sign)
//   SR_RISING       how she shows up this year (solar return Ascendant)
//   SR_MOON         what she needs emotionally this year (solar return Moon sign)
//   JUPITER_HOUSE   where life expands for her (transiting Jupiter's house in her natal chart)
//   SATURN_HOUSE    where she builds something that lasts (transiting Saturn's house in her natal chart)
//
// House copy says what the area IS first, in plain words, then what it means for her.

export interface YearHouse {
  title: string;
  area: string;
  body: string;
  moves: string[];
}

export const YEAR_HOUSE: Record<number, YearHouse> = {
  1: {
    title: "your main character year",
    area: "you: your body, your look, your identity",
    body: "This whole year is about YOU, babe. Your 1st house is the house of self, so the spotlight swings round to how you look, how you feel in your body and who you're becoming. A brand new twelve-year cycle starts right here, which means what you start this year sets the tone for the next decade.",
    moves: ["Change the thing about your look you've been 'meaning to' change", "Start the project with YOUR name on it", "Say yes to being seen"],
  },
  2: {
    title: "your money and worth year",
    area: "your money, your income, your self-worth",
    body: "Your 2nd house rules your money and what you believe you're worth, so this year it's all about your bank account and your value. Expect your relationship with money to get very real, very fast. The way you price yourself, spend on yourself and back yourself becomes the whole storyline.",
    moves: ["Raise your prices or ask for the raise", "Build one new income stream", "Stop discounting yourself, in money and in love"],
  },
  3: {
    title: "your voice year",
    area: "your voice, your content, your ideas, your neighbourhood",
    body: "The 3rd house is how you speak, write, post and think, plus your siblings, your local area and the people you see every week. This year your words carry serious power. Ideas come fast and the right message can open doors you didn't even know were there.",
    moves: ["Post the thing, write the thing, record the thing", "Take the short course you keep saving", "Have the conversation you've been rehearsing"],
  },
  4: {
    title: "your home and roots year",
    area: "your home, your family, your inner foundations",
    body: "Your 4th house is your home, your family and the emotional ground you stand on. This year pulls you inward to build a base that actually holds you. Moving, renovating, healing family stuff or simply making your space feel like YOU are all very on brand.",
    moves: ["Make your home feel like a sanctuary", "Heal or set boundaries with family", "Build the private routines that refill you"],
  },
  5: {
    title: "your pleasure and creativity year",
    area: "romance, pleasure, creativity, fun",
    body: "Hellooo 5th house, the house of joy, romance, creativity and play. This is your year to have FUN with it all and stop waiting for permission to enjoy your life. Flirting, making things, dressing up and doing what lights you up are where the magic is.",
    moves: ["Date yourself, or date someone delicious", "Make something just because you want to", "Book the fun thing without guilt"],
  },
  6: {
    title: "your rituals and routines year",
    area: "your daily routine, your health, your work",
    body: "The 6th house runs your days: your habits, your health, your to-do list and how you work. This year is about building systems that make your big life easy to live. Get your body, your schedule and your workload working FOR you and you'll feel like a new woman by your next birthday.",
    moves: ["Lock in a morning ritual you actually love", "Sort the health thing you've been putting off", "Delegate, automate, simplify"],
  },
  7: {
    title: "your partnership year",
    area: "relationships, partners, collaborations",
    body: "Your 7th house is all about your one-to-one relationships: lovers, business partners, best friends and even rivals. This year your life moves through other people. Commitments get made (or remade), and the right partnership can level you up faster than going solo ever could.",
    moves: ["Say what you want in your relationships out loud", "Pitch the collab", "Let people who match your energy in"],
  },
  8: {
    title: "your transformation year",
    area: "intimacy, shared money, deep change",
    body: "The 8th house is where things get deep: intimacy, power, joint money, investments and the parts of you that are ready to die off so a new version can be born. This year is a full phoenix moment. What you let go of makes room for the most powerful version of you yet.",
    moves: ["Get serious about investing and shared money", "Do the shadow work", "Let the old version of you go"],
  },
  9: {
    title: "your expansion year",
    area: "travel, study, beliefs, big adventures",
    body: "Your 9th house is travel, higher learning, publishing, teaching and your whole belief system. This year your world gets BIGGER. New places, new teachers and new ideas stretch you, and you might find yourself becoming the teacher too.",
    moves: ["Book the trip", "Sign up for the course or certification", "Share what you know with a bigger audience"],
  },
  10: {
    title: "your career and visibility year",
    area: "your career, your reputation, your public life",
    body: "The 10th house is the top of your chart: your career, your status and what you're known for. This year you're on display, babe. Big career moves, recognition and stepping into leadership are all written in, so go for the title, the launch and the room you want to be in.",
    moves: ["Go for the promotion, the launch or the big client", "Update how you show up publicly", "Claim the expert title"],
  },
  11: {
    title: "your community and dreams year",
    area: "friends, community, your audience, your wishes",
    body: "Your 11th house is your people: friends, community, networks, followers and the big dreams you're working towards. This year who you surround yourself with changes everything. The right circle opens doors, and your long-term wishes start to feel very real.",
    moves: ["Find (or build) your circle", "Grow your audience", "Write down the big dream and tell someone"],
  },
  12: {
    title: "your rest and reset year",
    area: "rest, healing, spirituality, endings",
    body: "The 12th house is the last house of the chart: rest, dreams, spirituality and everything behind the scenes. This year you're closing out a whole twelve-year chapter before your next main character era begins. Rest, heal, release and let your intuition lead. What you dissolve now clears the stage for what's coming.",
    moves: ["Rest without earning it first", "Deepen your spiritual practice", "Finish and release what's done"],
  },
};

export const YEAR_LORD: Record<string, { title: string; body: string }> = {
  Sun: {
    title: "the Sun is running your year",
    body: "The Sun is in charge of your year, so it's about shining, confidence and being SEEN. Whatever the Sun touches in your chart this year lights up. Lead from the front, take up space and let yourself be the star.",
  },
  Moon: {
    title: "the Moon is running your year",
    body: "With the Moon as your year's boss, your feelings are the compass. Moods, cycles, home and nurturing take centre stage. Work WITH your emotional rhythm (the new and full moons will hit you extra hard) and you'll move mountains.",
  },
  Mercury: {
    title: "Mercury is running your year",
    body: "Mercury runs this year, so your mind, your messages and your deals are everything. Watch Mercury's retrogrades closely because they'll be turning points for you. Talking, writing, selling and learning are how your life moves forward.",
  },
  Venus: {
    title: "Venus is running your year",
    body: "Venus is the boss of your year, babe, so love, money, beauty and pleasure lead the way. Your magnetism is turned right up. Lean into what feels good, invest in your look and let yourself receive.",
  },
  Mars: {
    title: "Mars is running your year",
    body: "Mars runs your year, which means action, drive, desire and a little bit of fire. You're built to go after what you want this year. Channel the heat into bold moves (and watch the temper when Mars gets spicy).",
  },
  Jupiter: {
    title: "Jupiter is running your year",
    body: "Jupiter, the planet of luck and growth, is in charge of your year, which is a BIG blessing. Say yes to more, think bigger and expect expansion. Just watch the overdoing it (Jupiter never knows when to stop).",
  },
  Saturn: {
    title: "Saturn is running your year",
    body: "Saturn runs your year, so it's a building year. Commitment, structure and long-term goals are where your power is. It can feel serious, but what you build now with discipline becomes the foundation you stand on for YEARS.",
  },
};

export const SR_RISING: Record<string, string> = {
  Aries: "Aries rising this year: you walk in first and fast. Bold, direct and ready to start things, people feel your fire before you say a word.",
  Taurus: "Taurus rising this year: you're slow, steady and seriously magnetic. Comfort, beauty and doing it your way are your whole vibe.",
  Gemini: "Gemini rising this year: curious, chatty and everywhere at once. You meet loads of new people and your social energy is FULL.",
  Cancer: "Cancer rising this year: soft on the outside, powerful underneath. You lead with care and people come to you for comfort.",
  Leo: "Leo rising this year: hello, main character. Your presence is BIG, warm and impossible to ignore, so dress for the spotlight.",
  Virgo: "Virgo rising this year: polished, capable and on it. You become the woman who has everything handled (and looks good doing it).",
  Libra: "Libra rising this year: charming, graceful and SO easy to be around. Beauty, balance and partnership shape how the world sees you.",
  Scorpio: "Scorpio rising this year: mysterious, intense and powerful. You give less away and people are more drawn to you because of it.",
  Sagittarius: "Sagittarius rising this year: lucky, adventurous and full of big ideas. You show up optimistic and open to anything.",
  Capricorn: "Capricorn rising this year: boss energy. Serious, ambitious and respected, you look like the woman in charge because you are.",
  Aquarius: "Aquarius rising this year: original, unexpected and a little rebellious. You break your own rules and people love you for it.",
  Pisces: "Pisces rising this year: dreamy, intuitive and soft-focus. You lead with magic and empathy, and people feel safe around you.",
};

export const SR_MOON: Record<string, string> = {
  Aries: "You need freedom, action and to move first. Sitting still with a feeling won't help you this year, so DO something with it.",
  Taurus: "You need comfort, stability and pleasure. Good food, soft fabrics and security in your bank account calm your whole system.",
  Gemini: "You need conversation and variety. Talking it out, journaling and keeping things fresh is how you process.",
  Cancer: "You need home, safety and your people close. Nesting is self-care this year, and so is letting yourself be looked after.",
  Leo: "You need to feel celebrated. Being seen and appreciated fills your cup, so ask for it and give it to yourself too.",
  Virgo: "You need order and usefulness. A tidy space and a clear plan settle your heart, but watch the overthinking.",
  Libra: "You need harmony and partnership. Beauty, balance and a lovely person by your side make everything feel right.",
  Scorpio: "You need depth and truth. Surface-level won't cut it this year, so go deep in your feelings, your bonds and your healing.",
  Sagittarius: "You need adventure and meaning. Travel, learning and laughing a LOT keep your spirit high.",
  Capricorn: "You need progress you can see. Hitting goals and feeling in control makes you feel safe this year.",
  Aquarius: "You need space and your own kind of people. Freedom to be different (and friends who get it) is what feeds you.",
  Pisces: "You need rest, dreams and magic. Creativity, spiritual practice and plenty of alone time keep you feeling held.",
};

export const JUPITER_HOUSE: Record<number, string> = {
  1: "Jupiter is moving through your 1st house, the house of YOU. Confidence, glow-ups and big personal beginnings come easily, and luck finds you just by showing up.",
  2: "Jupiter is moving through your 2nd house, your money house. Income can grow, opportunities to earn show up, and backing yourself pays off (literally).",
  3: "Jupiter is moving through your 3rd house, the house of your voice. Writing, content, learning and local connections open lucky doors.",
  4: "Jupiter is moving through your 4th house, your home and family. A bigger home, a happier home or healing with family is very possible.",
  5: "Jupiter is moving through your 5th house of romance and creativity. Love, fun and creative projects get a big lucky boost.",
  6: "Jupiter is moving through your 6th house of work and wellbeing. Better jobs, better clients and better health habits flow in.",
  7: "Jupiter is moving through your 7th house of partnership. Lucky relationships, generous partners and great collaborations come your way.",
  8: "Jupiter is moving through your 8th house of shared money and depth. Investments, joint income and deep emotional breakthroughs expand.",
  9: "Jupiter is moving through your 9th house, its favourite place. Travel, study, teaching and publishing are SERIOUSLY blessed.",
  10: "Jupiter is moving through your 10th house of career. Promotions, recognition and public wins are written in for you.",
  11: "Jupiter is moving through your 11th house of friends and dreams. Your network grows and your big wishes get a real push.",
  12: "Jupiter is moving through your 12th house of spirit and rest. Protection, healing and intuition get stronger, and behind-the-scenes work pays off later.",
};

export const SATURN_HOUSE: Record<number, string> = {
  1: "Saturn is in your 1st house, so it's asking you to take yourself seriously. Build the body, the boundaries and the self-respect that make you unshakeable.",
  2: "Saturn is in your 2nd house, your money house. Budgets, savings and pricing for your real worth build a solid financial base.",
  3: "Saturn is in your 3rd house of communication. Commit to your voice: a consistent posting rhythm, a skill or the course you finish.",
  4: "Saturn is in your 4th house of home. Real foundations matter now, whether that's property, family boundaries or your inner security.",
  5: "Saturn is in your 5th house of creativity and romance. Commit to your creative work and choose love that's actually serious about you.",
  6: "Saturn is in your 6th house of routines. Discipline with health and work habits is the secret, and small daily wins add up big.",
  7: "Saturn is in your 7th house of partnership. Relationships get real: commit, renegotiate or walk away from what isn't built to last.",
  8: "Saturn is in your 8th house of shared resources. Debt, investments and intimacy all ask for maturity, and you get stronger for it.",
  9: "Saturn is in your 9th house of learning. Formal study, a qualification or building real expertise turns your knowledge into authority.",
  10: "Saturn is in your 10th house of career. Hard work becomes reputation, and this is your time to build a career that lasts.",
  11: "Saturn is in your 11th house of community. Fewer, better friendships and long-term goals with a real plan behind them.",
  12: "Saturn is in your 12th house of endings. Close out old patterns properly, rest seriously and get ready for a whole new chapter.",
};

/** Traditional rulers, which is what annual profections use (no outer planets). */
export const TRADITIONAL_RULER: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};
