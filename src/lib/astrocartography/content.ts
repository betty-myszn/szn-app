// Copy, cities and scoring for the astrocartography page.
export const GLYPH: Record<string, string> = { Sun: "☉︎", Moon: "☽︎", Mercury: "☿︎", Venus: "♀︎", Mars: "♂︎", Jupiter: "♃︎", Saturn: "♄︎", Uranus: "♅︎", Neptune: "♆︎", Pluto: "♇︎", "North Node": "☊︎", Chiron: "⚷︎", Lilith: "⚸︎", "Part of Fortune": "⊗︎" };
export const GIFT = new Set(["Sun", "Moon", "Mercury", "Venus", "Jupiter", "North Node", "Part of Fortune"]);

export const ANGLE_INFO = {
  MC: { name: "MC", long: "on top of the world", what: "career, reputation, being SEEN" },
  IC: { name: "IC", long: "under your feet", what: "home, roots, family, rest" },
  ASC: { name: "ASC", long: "rising", what: "you, your body, your glow" },
  DSC: { name: "DSC", long: "setting", what: "love, partners, clients" },
};

export const PLANET_WORD = {
  Sun: "your light", Moon: "your heart", Mercury: "your voice", Venus: "love + money", Mars: "your fire",
  Jupiter: "your luck", Saturn: "your legacy", Uranus: "your freedom", Neptune: "your dreams", Pluto: "your power",
  "North Node": "your destiny", Chiron: "your healing", Lilith: "your wild power", "Part of Fortune": "your luck + joy",
};

export const READINGS: Record<string, { nick: string; short: string; full: string; use: string }> = {
  "Sun|MC": { nick: "main character, on a billboard", short: "Where you get SEEN for the thing you do, and recognised for it fast.", full: "The Sun at the top of your chart means this is the part of the world where your name travels. Work you put out here gets noticed by the right people, and the confidence you have about your talents gets LOUDER. Launch here, speak here, get photographed here.", use: "launches, speaking gigs, press, a bigger title" },
  "Sun|IC": { nick: "home is where your light is", short: "Somewhere you feel deeply yourself, like your batteries recharge on arrival.", full: "With the Sun at the base of your chart, this place rebuilds you from the inside. It is a gorgeous spot to put down roots, start a family, buy property or simply rest long enough to remember who you are. Your energy here goes inward first, then shines outward.", use: "a home base, family, rest, rebuilding your sense of self" },
  "Sun|ASC": { nick: "glowing on arrival", short: "People clock your energy the second you walk in, and you feel strong in your body.", full: "The Sun rising here turns up your vitality and charisma. You look more like yourself, your health and confidence tend to improve, and strangers respond to you warmly. It is a fabulous place to reinvent your look or start a brand new chapter as the most visible version of you.", use: "a glow up, a new chapter, confidence, health" },
  "Sun|DSC": { nick: "the power couple line", short: "Magnetic for confident, successful partners and big-energy collaborations.", full: "With the Sun setting here, the people you meet carry a lot of light, sometimes so much that you can hand your own over. Partnerships, business deals and love that make you both look good are very likely. Stay in your own spotlight and this is a stunning place to meet your match.", use: "meeting a partner, business partnerships, collabs" },

  "Moon|MC": { nick: "the beloved public figure", short: "The public FEELS you here, so content that comes from the heart lands hard.", full: "The Moon at the top of your chart makes your work personal and your audience emotional about you. Caring, nurturing, women-centred and community work does incredibly well here. Your reputation rises and falls with feelings, so lead with the soft stuff on purpose.", use: "community building, women-led work, being loved by an audience" },
  "Moon|IC": { nick: "your soul's home address", short: "The most like home anywhere on earth can feel: cosy, safe and deeply YOU.", full: "This is the classic place to live. The Moon on your IC brings belonging, comfort and an easy family feeling, sometimes from the very first night. Your nervous system softens here, your intuition gets clear and nesting comes naturally.", use: "living, family, healing your nervous system, a forever home" },
  "Moon|ASC": { nick: "soft girl era", short: "You feel everything here, and people find you instantly warm and approachable.", full: "The Moon rising makes you more emotionally open and more intuitive in this part of the world. People want to look after you and confide in you. Gorgeous for healing, motherhood and feelings work, a little tender if you need thick skin for business.", use: "intuition, emotional healing, being cared for" },
  "Moon|DSC": { nick: "the nurturing love line", short: "Draws in partners who make you feel held, safe and emotionally seen.", full: "With the Moon setting here, relationships turn caring and domestic very quickly. You are likely to meet people who feel like family, and partnerships that start here often want to move in together. Pick lovers with the same care you would pick a home.", use: "committed love, chosen family, feeling held" },

  "Mercury|MC": { nick: "the voice of the room", short: "Your words make money here: writing, speaking, teaching and selling all flow.", full: "Mercury at the top of your chart makes your ideas your reputation. Podcasting, publishing, teaching and sales calls all get easier, and the right people quote you back. A brilliant place for a book deal or a launch that runs on content.", use: "writing, podcasting, teaching, sales" },
  "Mercury|IC": { nick: "the busy brain base", short: "A home full of conversation, study and ideas, where your mind never switches off.", full: "Mercury at the base of your chart turns home into a studio for the mind. Wonderful for studying, writing at the kitchen table and running a business from your laptop. Build in rest, because your thoughts keep the lights on all night.", use: "study, writing at home, remote work" },
  "Mercury|ASC": { nick: "the quick-witted one", short: "You come across sharp, funny and youthful, and ideas spill out of you.", full: "Mercury rising here makes you chatty, curious and very easy to talk to. Networking feels effortless, short trips multiply and your inner student wakes up. It is ideal for a course, a workshop or a city break full of new people.", use: "networking, learning, short trips, workshops" },
  "Mercury|DSC": { nick: "the clever connections line", short: "You attract smart partners, agents and clients, the people who open doors with words.", full: "Mercury setting here brings witty, communicative people into your life, from contracts and clients to a lover you could talk to forever. Negotiations and deals go well. Keep it grounded, as relationships here can live more in the head than in the body.", use: "contracts, clients, negotiations, a word-loving partner" },

  "Venus|MC": { nick: "famous for being gorgeous", short: "Your beauty, taste and charm become your career, and money follows them.", full: "Venus at the top of your chart is one of the dreamiest lines for work. Anything aesthetic, luxurious, romantic or feminine shines, and people LOVE working with you. Brand shoots, beauty launches and raising your prices all land especially well here.", use: "money, branding, beauty, luxury launches" },
  "Venus|IC": { nick: "the pleasure palace", short: "A home that feels like a love letter, soft, beautiful and full of pleasure.", full: "Venus at the base of your chart makes this one of your loveliest places to live. Home becomes gorgeous, family life gets sweeter and buying property tends to feel lucky. Your relationship with yourself softens and deepens here.", use: "living, a beautiful home, self-love, property" },
  "Venus|ASC": { nick: "baddie on arrival", short: "You look and feel your most beautiful here, and everyone notices.", full: "Venus rising is the ultimate glow up line. Your style levels up, your skin and confidence glow, and people treat you like the prize. Book the photoshoot, the girls' trip and the first date here, then enjoy getting spoiled.", use: "glow up, photoshoots, dating, being adored" },
  "Venus|DSC": { nick: "the love line", short: "The famous one for meeting a partner, falling in love and sweet collabs.", full: "Venus setting here is the line astrocartographers send people to for romance. Partners arrive gorgeous, generous and adoring, and business relationships feel just as lovely. Honeymoons, proposals and meeting your person all sit beautifully on this line.", use: "love, honeymoons, finding your person, sweet deals" },

  "Mars|MC": { nick: "the boss who gets it done", short: "Ambition goes into overdrive here, so you hustle, compete and WIN.", full: "Mars at the top of your chart makes you bold at work and very hard to ignore. You can achieve an enormous amount, fast, especially in sport, entrepreneurship or anything competitive. Watch for clashes with bosses and burnout, and pour the heat into your own projects.", use: "sprints, competition, starting a business, physical goals" },
  "Mars|IC": { nick: "the fire in the house", short: "Big energy at home: great for renovations, tricky for peace and calm.", full: "Mars at the base of your chart stirs up home life. You will want to build, renovate and move furniture at midnight. Family tension can flare here, so this is a better place to rebuild your foundations than to retreat to them.", use: "renovating, rebuilding, a hard reset of your roots" },
  "Mars|ASC": { nick: "the warrior baddie", short: "You feel strong, sexy and fearless here, with zero patience for anything weak.", full: "Mars rising pumps up your courage and physical energy. Fitness goals, bold moves and saying the scary thing all get easier. People find you fiery and attractive, sometimes intimidating, so hold your temper and take up your space.", use: "fitness, courage, sex appeal, bold moves" },
  "Mars|DSC": { nick: "the spicy relationship line", short: "Hot chemistry with people who challenge you, sometimes a little too much.", full: "Mars setting here brings intense, competitive and very sexy partners. The attraction is instant, the arguments can be too. It is fantastic for a fiery romance or a fierce rival who makes you better, as long as your boundaries are crystal clear.", use: "passion, chemistry, healthy competition" },

  "Jupiter|MC": { nick: "the lucky break line", short: "Opportunities, promotions and big money moments find you here easily.", full: "Jupiter at the top of your chart is one of the best lines for career and income. Doors open, mentors appear and your reputation grows faster than you planned. Pitch here, expand here, raise your prices here, because this place tends to say YES.", use: "money, career growth, big opportunities" },
  "Jupiter|IC": { nick: "the abundant home", short: "Life feels generous here: a big home, a happy family and a feeling of plenty.", full: "Jupiter at the base of your chart makes this a wonderful place to live. Property and family matters tend to go well, home feels spacious and you feel supported by the place itself. A dreamy spot for a forever base or a long, nourishing stay.", use: "living, property, family, long stays" },
  "Jupiter|ASC": { nick: "the it-girl of good fortune", short: "You feel optimistic, generous and LUCKY, and people love having you around.", full: "Jupiter rising is pure good vibes. You feel expansive, confident and up for anything, and life rewards you for it. Great for travel, study, spiritual growth and saying yes, with one eye on overindulging.", use: "travel, confidence, study, saying yes" },
  "Jupiter|DSC": { nick: "the generous partner line", short: "Brings you kind, successful, well-connected partners, lovers and clients.", full: "Jupiter setting here sends you people who expand your life. Marriage, business partnerships and lucky introductions all thrive. You attract mentors, investors and lovers who make anything feel possible together.", use: "marriage, investors, mentors, dream clients" },

  "Saturn|MC": { nick: "the legacy line", short: "Hard work builds something serious and lasting here, slowly but surely.", full: "Saturn at the top of your chart asks you to earn your place, then lets you keep it. Recognition comes later than you want and lasts longer than you expected. A powerful place to build authority, though it can feel heavy if you came for fun.", use: "authority, long-term career building, mastery" },
  "Saturn|IC": { nick: "the heavy foundations line", short: "Home can feel serious or lonely here, a place for responsibility over rest.", full: "Saturn at the base of your chart brings duties to the doorstep, from family obligations to old roots that need repair. It can be deeply stabilising for a mature project like buying land, and tends to feel cold as a place to unwind. Visit with intention.", use: "repairing family roots, long-term property, maturity" },
  "Saturn|ASC": { nick: "the serious era", short: "You feel older, wiser and more disciplined here, sometimes heavier too.", full: "Saturn rising slows you down and makes you take yourself seriously. Others see you as competent and reserved. Brilliant for a focused sprint, a qualification or a discipline glow up, less brilliant for spontaneity and joy.", use: "discipline, focus, getting qualified" },
  "Saturn|DSC": { nick: "the lessons in love line", short: "Relationships here are committed and real, and can feel like hard work.", full: "Saturn setting brings older, responsible or demanding people into your life. Partnerships can be very stable and very testing at once. Contracts and long-term commitments do well, flirty fun much less so.", use: "contracts, serious commitments, karmic relationships" },

  "Uranus|MC": { nick: "the breakout line", short: "Your career takes sudden, unusual turns here, and your weirdness gets you famous.", full: "Uranus at the top of your chart rewards originality. Tech, astrology, the internet and anything rule-breaking shine, and surprise opportunities arrive out of nowhere. Expect your plans to change, and let them.", use: "reinvention, tech, going viral, career pivots" },
  "Uranus|IC": { nick: "the unsettled nest", short: "Home life is exciting and unpredictable here, with frequent moves and changes.", full: "Uranus at the base of your chart makes roots feel wobbly. You may move often or live unconventionally, which can feel freeing or exhausting. Wonderful for breaking a family pattern, harder for a steady routine.", use: "breaking family patterns, unconventional living" },
  "Uranus|ASC": { nick: "the free spirit line", short: "You feel rebellious, electric and totally free to be different here.", full: "Uranus rising wakes up your inner rebel. You change your hair, your style and maybe your whole plan, often overnight. A thrilling place for a short stay that shakes you loose, and a restless one for staying put.", use: "freedom, reinvention, shaking things up" },
  "Uranus|DSC": { nick: "the unexpected love line", short: "Exciting, unusual people sweep in fast, and sometimes leave just as fast.", full: "Uranus setting brings unconventional partners and lightning-bolt connections. Love here is exciting and independent, rarely predictable. Great for collaborating with innovators and for relationships that give you lots of space.", use: "exciting connections, innovative collaborators" },

  "Neptune|MC": { nick: "the dream career line", short: "Artistic, spiritual and glamorous work flows here, with a dreamy public image.", full: "Neptune at the top of your chart turns your work into art. Music, film, photography, healing and spiritual work all do beautifully here, and people project fantasy onto you. Keep your contracts clear, since a little fog comes with the glamour.", use: "creative work, spiritual business, film, music" },
  "Neptune|IC": { nick: "the dream house", short: "A soft, spiritual, magical home, perfect for meditation and slightly hard to anchor.", full: "Neptune at the base of your chart makes home feel like a sanctuary, especially near water. Creativity and spiritual practice deepen beautifully. Keep life admin grounded here, because bills and boundaries can get blurry.", use: "spiritual retreats, creative sanctuaries, water" },
  "Neptune|ASC": { nick: "the mermaid line", short: "You become dreamy, intuitive and magnetic here, with a hint of mystery.", full: "Neptune rising softens your edges and lifts your intuition. You feel artistic, empathic and very open, which is gorgeous for retreats, yoga and creative work. Protect your energy and go easy on the wine, since you absorb everything.", use: "retreats, intuition, art, healing" },
  "Neptune|DSC": { nick: "the soulmate fantasy line", short: "Deeply romantic, spiritual connections that can feel like destiny or illusion.", full: "Neptune setting pulls in poetic, sensitive and sometimes elusive partners. The romance plays like a movie, so read the script before you sign it. Fabulous for spiritual teachers and creative collaborators, and for loving with your eyes open.", use: "spiritual partnership, creative collaboration" },

  "Pluto|MC": { nick: "the power player line", short: "Huge influence and transformation in your career, intense and unforgettable.", full: "Pluto at the top of your chart gives you real power in the world and asks you to own it. Career rebirths, big money and influence are all possible, alongside power struggles. Ideal for a total brand transformation, never for playing small.", use: "transformation, influence, big-stakes career moves" },
  "Pluto|IC": { nick: "the deep roots line", short: "Home brings up everything buried, perfect for therapy and total renewal.", full: "Pluto at the base of your chart digs into family history and your deepest emotions. It can be profoundly healing work, and intense to live in. Brilliant for shadow work, ancestral healing or a full rebirth move.", use: "shadow work, ancestral healing, total renewal" },
  "Pluto|ASC": { nick: "the phoenix line", short: "You transform completely here, with a magnetic presence nobody can ignore.", full: "Pluto rising makes you powerful, private and seriously magnetic. You shed old versions of yourself fast, which is thrilling and sometimes uncomfortable. A strong place for a total transformation, best visited with a clear intention.", use: "transformation, magnetism, reinvention" },
  "Pluto|DSC": { nick: "the obsession line", short: "Intense, all-consuming relationships that change you forever.", full: "Pluto setting brings deep, passionate and sometimes controlling connections. Nothing is casual here. Amazing for transformational partnerships and soul-level love, provided you keep your power in your own hands.", use: "soul-level love, transformational partnerships" },
  // The four extra points (added 26 Nov 2026): destiny, healing, wild power and luck.
  "North Node|MC": { nick: "the destiny career line", short: "The career your soul came here for gets LOUD here, and the right doors open.", full: "Your North Node at the top of your chart points to the work you are growing into. It can feel a little outside your comfort zone at first, then everything clicks, and you meet the mentors, platforms and opportunities that move your path forward years in one go.", use: "the big career leap, your purpose work, finding your calling" },
  "North Node|IC": { nick: "home of your future self", short: "A place that grows you into who you are becoming, from the roots up.", full: "Your North Node under your feet makes this a place to build a new foundation. Old family patterns lose their grip, and you get to decide what home, safety and belonging mean for the woman you are becoming. Slow to settle, deeply worth it.", use: "a fresh start, a new home base, breaking family patterns" },
  "North Node|ASC": { nick: "becoming her", short: "You step into the woman you are meant to be, fast, and people meet the new you.", full: "Your North Node rising is one of the strongest growth lines on any map. You show up as your future self here, and strangers treat you like her before you fully feel it. Perfect for a reinvention trip, a new look or the year you finally go for it.", use: "reinvention, becoming your future self, a fresh chapter" },
  "North Node|DSC": { nick: "the fated people line", short: "Destined meetings: the partners, mentors and collaborators who change your path.", full: "Your North Node setting here brings the people you were always meant to meet. Relationships and partnerships that start here pull you towards your purpose, and they often feel familiar from the very first conversation.", use: "meeting your person, mentors, game-changing collabs" },
  "Chiron|MC": { nick: "the healer's platform", short: "Your wound becomes your work here: teaching, healing and sharing your story lands.", full: "Chiron at the top of your chart turns what hurt you into what you are known for. Coaching, healing, writing and speaking about your story all land with real impact here. Expect to feel exposed at first, then hugely respected for it.", use: "healing work, teaching, sharing your story" },
  "Chiron|IC": { nick: "the healing home", short: "Old family stuff comes up to be healed, gently, if you let it.", full: "Chiron under your feet brings the roots work to the surface. This is a powerful place for therapy, ancestral healing and making peace with where you come from. Live here when you are ready to do the work, visit when you need a breakthrough.", use: "inner child work, family healing, therapy retreats" },
  "Chiron|ASC": { nick: "the soft reset", short: "You feel tender and seen here, and that softness becomes your superpower.", full: "Chiron rising makes you more sensitive in your body and your confidence, which brings up old insecurities so they can finally go. People feel safe with you here, and you leave with a softer, stronger relationship to yourself.", use: "body healing, self-acceptance, wellness retreats" },
  "Chiron|DSC": { nick: "the healing love line", short: "Relationships here touch old wounds and help heal them, with the right people.", full: "Chiron setting here brings healers, teachers and people who mirror your old patterns in love. With the right person it is the most healing relationship of your life. Keep your eyes open and your standards high.", use: "healing relationships, therapy, working with a mentor" },
  "Lilith|MC": { nick: "the unapologetic icon", short: "You get known for the thing you were told to tone down, and it works.", full: "Lilith at the top of your chart makes your public image bold, magnetic and a little controversial. The parts of you that never fit in become your brand here. Brilliant for content that cuts through, feminist work and refusing to play small.", use: "bold content, going viral, owning your edge" },
  "Lilith|IC": { nick: "the wild woman's den", short: "Home is where you stop performing and let the untamed you out.", full: "Lilith under your feet makes home a place of raw honesty. You stop people-pleasing, rules you inherited fall away and your instincts get very loud. Intense to live in, incredible for a solo retreat where you remember who you are.", use: "solo retreats, shadow work, reclaiming yourself" },
  "Lilith|ASC": { nick: "untamed and magnetic", short: "You are sexy, fearless and impossible to ignore here, and nobody can make you shrink.", full: "Lilith rising turns up your raw magnetism. You say what you mean, wear what you want and take up your space, and people feel it the second you walk in. Some will find it too much, so let them, because this is you unfiltered.", use: "confidence, sex appeal, saying the scary thing" },
  "Lilith|DSC": { nick: "the forbidden chemistry line", short: "Magnetic, taboo-tinged attraction and partners who bring out your wild side.", full: "Lilith setting here pulls in intense, unconventional and very seductive people. The chemistry is electric and the power dynamics are real, so you learn fast what you will and will not accept. Thrilling for a fling, eye-opening for love.", use: "passion, chemistry, learning your boundaries" },
  "Part of Fortune|MC": { nick: "the jackpot career line", short: "Your joy and your success line up: doing what you love pays here.", full: "Your Part of Fortune at the top of your chart is a gorgeous money and success line. The work that lights you up gets rewarded, recognition feels easy and you are lucky in public. Launch here, sell here, get paid here.", use: "money from what you love, launches, lucky breaks" },
  "Part of Fortune|IC": { nick: "the lucky home", short: "Home feels like a lucky charm, and property and family bring joy and fortune.", full: "Your Part of Fortune under your feet makes this a happy, lucky place to live. Property decisions tend to work out, home life feels abundant and you feel at peace in your skin. A dream spot for a forever home or a long stay.", use: "a happy home, property, family, feeling content" },
  "Part of Fortune|ASC": { nick: "lucky girl on arrival", short: "Lucky girl syndrome, located: things just go your way when you are here.", full: "Your Part of Fortune rising means good luck follows YOU around this part of the world. Upgrades, freebies, perfect timing and happy accidents stack up. Book the trip, wear the outfit and say yes to the invite.", use: "a lucky holiday, saying yes, being in the right place" },
  "Part of Fortune|DSC": { nick: "the lucky connections line", short: "Fortune arrives through people: partners, clients and deals that feel meant to be.", full: "Your Part of Fortune setting here brings luck through other people. The client who changes your year, the partner who adores you, the introduction that opens every door. Go with an open diary and let people find you.", use: "dream clients, lucky partnerships, the right introductions" },
};

// Weights per "Planet|Angle". Live includes negatives so heavy lines push a city down.
export const SCORES: Record<string, Record<string, number>> = {
  live: { "Moon|IC": 10, "Venus|IC": 10, "Jupiter|IC": 10, "Sun|IC": 7, "Venus|ASC": 8, "Jupiter|ASC": 8, "Moon|ASC": 6, "Sun|ASC": 6, "Jupiter|MC": 7, "Venus|MC": 6, "Jupiter|DSC": 6, "Venus|DSC": 7, "Sun|MC": 4, "Mercury|IC": 4, "Mercury|ASC": 3, "Moon|DSC": 4,
    "Saturn|IC": -9, "Saturn|ASC": -6, "Pluto|IC": -6, "Pluto|ASC": -5, "Mars|IC": -6, "Mars|DSC": -4, "Neptune|IC": -4, "Neptune|ASC": -3, "Uranus|IC": -4, "Saturn|DSC": -3, "Part of Fortune|IC": 7, "North Node|IC": 4, "Lilith|IC": -3, "Chiron|IC": -2 },
  travel: { "Jupiter|ASC": 10, "Jupiter|DSC": 8, "Jupiter|MC": 8, "Jupiter|IC": 6, "Venus|ASC": 10, "Venus|DSC": 9, "Venus|MC": 7, "Venus|IC": 6, "Sun|ASC": 8, "Sun|MC": 6, "Sun|DSC": 6, "Uranus|ASC": 6, "Uranus|DSC": 4, "Mars|ASC": 5, "Moon|DSC": 4, "Mercury|ASC": 5, "Neptune|ASC": 5, "Moon|ASC": 4,
    "Saturn|ASC": -5, "Saturn|DSC": -3, "Pluto|DSC": -2, "Part of Fortune|ASC": 7, "North Node|ASC": 5, "Part of Fortune|DSC": 4 },
  love: { "Venus|DSC": 10, "Venus|ASC": 8, "Jupiter|DSC": 8, "Moon|DSC": 7, "Sun|DSC": 6, "Venus|IC": 5, "Mars|DSC": 5, "Venus|MC": 4, "Neptune|DSC": 3, "North Node|DSC": 6, "Part of Fortune|DSC": 5, "Lilith|DSC": 3 },
  // Money is its own thing (Betty): money lines are Jupiter (abundance) and Venus (receiving, value) on any angle, never "career".
  money: { "Jupiter|MC": 10, "Venus|MC": 9, "Jupiter|ASC": 8, "Jupiter|IC": 8, "Venus|IC": 7, "Venus|ASC": 7, "Jupiter|DSC": 6, "Venus|DSC": 6, "Part of Fortune|MC": 9, "Part of Fortune|ASC": 7, "Part of Fortune|IC": 6, "Part of Fortune|DSC": 6 },
  career: { "Sun|MC": 10, "Jupiter|MC": 9, "Venus|MC": 7, "Mercury|MC": 7, "Saturn|MC": 6, "Pluto|MC": 6, "Mars|MC": 6, "Uranus|MC": 5, "Moon|MC": 5, "North Node|MC": 7, "Lilith|MC": 6, "Part of Fortune|MC": 6, "Chiron|MC": 4 },
  glow: { "Venus|ASC": 10, "Sun|ASC": 9, "Jupiter|ASC": 8, "Mars|ASC": 7, "Pluto|ASC": 4, "Moon|ASC": 4, "Part of Fortune|ASC": 6, "Lilith|ASC": 5, "North Node|ASC": 5 },
  healing: { "Moon|IC": 8, "Neptune|IC": 7, "Jupiter|IC": 7, "Neptune|ASC": 6, "Moon|ASC": 6, "Venus|IC": 6, "Pluto|IC": 4, "Chiron|IC": 7, "Chiron|ASC": 6, "Part of Fortune|IC": 4 },
  create: { "Neptune|MC": 8, "Venus|MC": 8, "Mercury|MC": 7, "Neptune|ASC": 7, "Uranus|MC": 6, "Mercury|ASC": 6, "Sun|MC": 5, "Venus|ASC": 5, "Moon|MC": 4, "Lilith|MC": 4, "North Node|MC": 4 },
  selflove: { "Venus|ASC": 10, "Sun|ASC": 9, "Moon|ASC": 8, "Venus|IC": 7, "Moon|IC": 6, "Jupiter|ASC": 6, "Sun|IC": 5, "Neptune|ASC": 3, "Chiron|ASC": 5, "Lilith|ASC": 6, "Part of Fortune|ASC": 5 },
  realise: { "Uranus|ASC": 10, "Uranus|MC": 10, "Neptune|ASC": 7, "Mercury|ASC": 6, "Mercury|MC": 4, "Jupiter|MC": 5, "Pluto|ASC": 6, "Neptune|MC": 5, "Uranus|IC": 4, "Mercury|IC": 4, "North Node|ASC": 7, "North Node|MC": 6, "Chiron|ASC": 5 },
  // Fame: going viral, press, a big audience. Top-of-chart lines first, plus Neptune glamour, Uranus virality, Lilith cut-through.
  fame: { "Sun|MC": 10, "Jupiter|MC": 9, "Venus|MC": 9, "Neptune|MC": 8, "Uranus|MC": 8, "Lilith|MC": 7, "Pluto|MC": 7, "North Node|MC": 7, "Part of Fortune|MC": 6, "Sun|ASC": 6, "Venus|ASC": 5, "Mercury|MC": 5, "Moon|MC": 5 },
  // Peace: calm, safe, soft. Home and Moon lines, Neptune calm, and every heavy line counts against a place.
  peace: { "Moon|IC": 10, "Venus|IC": 9, "Jupiter|IC": 8, "Neptune|ASC": 6, "Neptune|IC": 6, "Moon|ASC": 6, "Venus|ASC": 5, "Part of Fortune|IC": 7, "Sun|IC": 5, "Chiron|IC": 3,
    "Mars|ASC": -6, "Mars|IC": -7, "Mars|MC": -3, "Saturn|ASC": -6, "Saturn|IC": -7, "Pluto|ASC": -6, "Pluto|IC": -6, "Uranus|ASC": -5, "Uranus|IC": -5, "Lilith|IC": -4, "Lilith|ASC": -3 },
  // Power: magnetic, ambitious, confident, and the places that push you into a bigger version of you.
  power: { "Pluto|ASC": 10, "Mars|ASC": 9, "Sun|ASC": 8, "Pluto|MC": 8, "Mars|MC": 8, "Sun|MC": 7, "Saturn|MC": 6, "Saturn|ASC": 5, "Uranus|ASC": 5, "Pluto|DSC": 4, "Mars|DSC": 4, "Lilith|ASC": 9, "Lilith|MC": 8, "North Node|MC": 5 },
  // Girls' trip: friendship, pleasure, adventure, connection. Rising + setting lines, the ones you feel on a short stay.
  // Already partnered: romance that lasts. Venus + Moon home and love lines, softness and devotion; the
  // classic break-up lines (Saturn, Uranus, Pluto, Mars on the love line) count against a place.
  honeymoon: { "Venus|DSC": 10, "Venus|IC": 9, "Moon|IC": 8, "Jupiter|DSC": 8, "Venus|ASC": 7, "Moon|DSC": 7, "Jupiter|IC": 7, "Sun|DSC": 5, "Neptune|DSC": 4, "Part of Fortune|DSC": 5, "Mars|DSC": -4, "Saturn|DSC": -7, "Uranus|DSC": -6, "Pluto|DSC": -5, "Saturn|IC": -3 },
  girlstrip: { "Venus|ASC": 10, "Jupiter|ASC": 10, "Jupiter|DSC": 8, "Venus|DSC": 7, "Sun|ASC": 7, "Moon|DSC": 6, "Mercury|ASC": 6, "Uranus|ASC": 6, "Mercury|DSC": 5, "Mars|ASC": 4, "Neptune|ASC": 3, "Saturn|ASC": -4, "Part of Fortune|ASC": 7, "Part of Fortune|DSC": 5 },
  // Business baddie: entrepreneurship, leadership, clients and collaborators, career expansion.
  business: { "Jupiter|MC": 10, "Mercury|MC": 9, "Sun|MC": 9, "Mars|MC": 8, "Uranus|MC": 7, "Mercury|DSC": 7, "Jupiter|DSC": 7, "Pluto|MC": 6, "Saturn|MC": 6, "Venus|MC": 5, "Sun|DSC": 4, "Part of Fortune|MC": 7, "North Node|MC": 6, "Part of Fortune|DSC": 5 },
  // Dream life: belonging, emotional fulfilment, romance, creativity. Home lines first, softened by heavy ones.
  dreamlife: { "Venus|IC": 10, "Moon|IC": 10, "Jupiter|IC": 10, "Sun|IC": 7, "Venus|DSC": 7, "Venus|ASC": 6, "Jupiter|DSC": 6, "Moon|ASC": 5, "Neptune|IC": 4, "Jupiter|ASC": 5,
    "Saturn|IC": -8, "Pluto|IC": -5, "Mars|IC": -5, "Uranus|IC": -3, "Part of Fortune|IC": 8, "North Node|IC": 5 },
  adventure: { "Jupiter|ASC": 9, "Uranus|ASC": 8, "Mars|ASC": 7, "Jupiter|DSC": 6, "Uranus|DSC": 6, "Sun|ASC": 6, "Mercury|ASC": 5, "Part of Fortune|ASC": 5, "North Node|ASC": 5 },
};

// The six location types from the ASTRO MAPS launch carousel (25 Nov 2026) come first, named exactly
// as the carousel sells them, then the extras. "money" keeps its id (Customise my szn maps to it).
export const GOALS = [
  { id: "money", label: "rich b*tch", emoji: "💸", head: "to make serious MONEY" },
  { id: "career", label: "main character", emoji: "🪩", head: "to be SEEN, recognised and celebrated" },
  { id: "fame", label: "fame", emoji: "🌟", head: "to get FAMOUS" },
  { id: "girlstrip", label: "girls' trip", emoji: "🍸", head: "for the GIRLS' TRIP" },
  { id: "honeymoon", label: "honeymoon + couples", emoji: "💞", head: "for a ROMANTIC trip together" },
  { id: "power", label: "power", emoji: "🔥", head: "to step into your POWER" },
  { id: "business", label: "business baddie", emoji: "💻", head: "to build your BUSINESS" },
  { id: "dreamlife", label: "dream life", emoji: "🏡", head: "to build your DREAM LIFE" },
  { id: "peace", label: "peace", emoji: "🕊️", head: "to feel PEACE" },
  { id: "love", label: "love", emoji: "💘", head: "to fall in LOVE" },
  { id: "selflove", label: "self-love", emoji: "🪞", head: "to fall in love with YOURSELF" },
  { id: "glow", label: "glow up", emoji: "✨", head: "for a full GLOW UP" },
  { id: "healing", label: "healing", emoji: "🌙", head: "to HEAL and feel held" },
  { id: "create", label: "creativity", emoji: "🎨", head: "to make your best WORK" },
  { id: "adventure", label: "adventure", emoji: "🌍", head: "for a wild ADVENTURE" },
  { id: "realise", label: "realisations", emoji: "💡", head: "for the big REALISATIONS" },
];

export const CITIES: { name: string; country: string; lat: number; lon: number }[] = ([
  ["London", "UK", 51.51, -0.13], ["Manchester", "UK", 53.48, -2.24], ["Edinburgh", "UK", 55.95, -3.19], ["Dublin", "Ireland", 53.35, -6.26],
  ["Paris", "France", 48.86, 2.35], ["Nice", "France", 43.7, 7.27], ["Amsterdam", "Netherlands", 52.37, 4.9], ["Berlin", "Germany", 52.52, 13.4],
  ["Munich", "Germany", 48.14, 11.58], ["Copenhagen", "Denmark", 55.68, 12.57], ["Stockholm", "Sweden", 59.33, 18.07], ["Oslo", "Norway", 59.91, 10.75],
  ["Reykjavik", "Iceland", 64.15, -21.94], ["Lisbon", "Portugal", 38.72, -9.14], ["Porto", "Portugal", 41.15, -8.61], ["Madrid", "Spain", 40.42, -3.7],
  ["Barcelona", "Spain", 41.39, 2.17], ["Ibiza", "Spain", 38.91, 1.43], ["Marbella", "Spain", 36.51, -4.89], ["Rome", "Italy", 41.9, 12.5],
  ["Milan", "Italy", 45.46, 9.19], ["Florence", "Italy", 43.77, 11.26], ["Amalfi Coast", "Italy", 40.63, 14.6], ["Venice", "Italy", 45.44, 12.32],
  ["Zurich", "Switzerland", 47.37, 8.54], ["Vienna", "Austria", 48.21, 16.37], ["Prague", "Czechia", 50.08, 14.44], ["Budapest", "Hungary", 47.5, 19.04],
  ["Athens", "Greece", 37.98, 23.73], ["Mykonos", "Greece", 37.45, 25.33], ["Santorini", "Greece", 36.39, 25.46], ["Dubrovnik", "Croatia", 42.65, 18.09],
  ["Istanbul", "Türkiye", 41.01, 28.98], ["Bodrum", "Türkiye", 37.04, 27.43], ["Limassol", "Cyprus", 34.71, 33.02], ["Malta", "Malta", 35.9, 14.51],
  ["Tenerife", "Spain", 28.29, -16.63], ["Madeira", "Portugal", 32.65, -16.91], ["Azores", "Portugal", 37.74, -25.67],
  ["Dubai", "UAE", 25.2, 55.27], ["Doha", "Qatar", 25.29, 51.53], ["Tel Aviv", "Israel", 32.09, 34.78], ["Cairo", "Egypt", 30.04, 31.24],
  ["Marrakech", "Morocco", 31.63, -7.99], ["Cape Town", "South Africa", -33.92, 18.42], ["Johannesburg", "South Africa", -26.2, 28.05],
  ["Nairobi", "Kenya", -1.29, 36.82], ["Zanzibar", "Tanzania", -6.17, 39.2], ["Mauritius", "Mauritius", -20.16, 57.5], ["Seychelles", "Seychelles", -4.62, 55.45],
  ["Lagos", "Nigeria", 6.52, 3.38], ["Accra", "Ghana", 5.6, -0.19],
  ["Mumbai", "India", 19.08, 72.88], ["Goa", "India", 15.5, 73.83], ["Delhi", "India", 28.61, 77.21], ["Kathmandu", "Nepal", 27.72, 85.32],
  ["Maldives", "Maldives", 4.18, 73.51], ["Colombo", "Sri Lanka", 6.93, 79.86], ["Bangkok", "Thailand", 13.76, 100.5], ["Phuket", "Thailand", 7.88, 98.39],
  ["Chiang Mai", "Thailand", 18.79, 98.98], ["Bali", "Indonesia", -8.51, 115.26], ["Singapore", "Singapore", 1.35, 103.82], ["Kuala Lumpur", "Malaysia", 3.14, 101.69],
  ["Hanoi", "Vietnam", 21.03, 105.85], ["Hoi An", "Vietnam", 15.88, 108.33], ["Ho Chi Minh City", "Vietnam", 10.82, 106.63], ["Hong Kong", "China", 22.32, 114.17],
  ["Shanghai", "China", 31.23, 121.47], ["Seoul", "South Korea", 37.57, 126.98], ["Tokyo", "Japan", 35.68, 139.69], ["Kyoto", "Japan", 35.01, 135.77],
  ["Taipei", "Taiwan", 25.03, 121.57], ["Manila", "Philippines", 14.6, 120.98],
  ["Sydney", "Australia", -33.87, 151.21], ["Melbourne", "Australia", -37.81, 144.96], ["Byron Bay", "Australia", -28.64, 153.61], ["Perth", "Australia", -31.95, 115.86],
  ["Auckland", "New Zealand", -36.85, 174.76], ["Queenstown", "New Zealand", -45.03, 168.66], ["Fiji", "Fiji", -17.8, 177.42], ["Tahiti", "French Polynesia", -17.54, -149.57],
  ["Honolulu", "Hawaii, USA", 21.31, -157.86],
  ["Los Angeles", "USA", 34.05, -118.24], ["San Diego", "USA", 32.72, -117.16], ["San Francisco", "USA", 37.77, -122.42], ["Seattle", "USA", 47.61, -122.33],
  ["Vancouver", "Canada", 49.28, -123.12], ["Las Vegas", "USA", 36.17, -115.14], ["Sedona", "USA", 34.87, -111.76], ["Denver", "USA", 39.74, -104.99],
  ["Austin", "USA", 30.27, -97.74], ["Dallas", "USA", 32.78, -96.8], ["New Orleans", "USA", 29.95, -90.07], ["Chicago", "USA", 41.88, -87.63],
  ["Nashville", "USA", 36.16, -86.78], ["Atlanta", "USA", 33.75, -84.39], ["Miami", "USA", 25.76, -80.19], ["Tulum", "Mexico", 20.21, -87.47],
  ["Mexico City", "Mexico", 19.43, -99.13], ["Cabo", "Mexico", 22.89, -109.91], ["Toronto", "Canada", 43.65, -79.38], ["Montreal", "Canada", 45.5, -73.57],
  ["New York", "USA", 40.71, -74.01], ["Boston", "USA", 42.36, -71.06], ["Washington DC", "USA", 38.91, -77.04], ["Havana", "Cuba", 23.11, -82.37],
  ["Jamaica", "Jamaica", 18.47, -77.92], ["Barbados", "Barbados", 13.1, -59.61], ["San Juan", "Puerto Rico", 18.47, -66.11], ["Costa Rica", "Costa Rica", 9.93, -84.08],
  ["Medellín", "Colombia", 6.24, -75.58], ["Cartagena", "Colombia", 10.39, -75.48], ["Lima", "Peru", -12.05, -77.04], ["Cusco", "Peru", -13.53, -71.97],
  ["Rio de Janeiro", "Brazil", -22.91, -43.17], ["São Paulo", "Brazil", -23.55, -46.63], ["Salvador", "Brazil", -12.97, -38.5], ["Buenos Aires", "Argentina", -34.6, -58.38],
  ["Santiago", "Chile", -33.45, -70.67],
  // added 25 Nov 2026: more of where members live and travel
  ["Brighton", "UK", 50.82, -0.14], ["Bath", "UK", 51.38, -2.36], ["Glasgow", "UK", 55.86, -4.25], ["Cornwall", "UK", 50.27, -5.05], ["Lake Como", "Italy", 45.99, 9.26], ["Sicily", "Italy", 37.6, 14.02],
  ["Positano", "Italy", 40.63, 14.48], ["Monaco", "Monaco", 43.74, 7.42], ["Saint-Tropez", "France", 43.27, 6.64], ["Provence", "France", 43.95, 4.81], ["Seville", "Spain", 37.39, -5.98], ["Mallorca", "Spain", 39.57, 2.65],
  ["Brussels", "Belgium", 50.85, 4.35], ["Hamburg", "Germany", 53.55, 9.99], ["Helsinki", "Finland", 60.17, 24.94], ["Krakow", "Poland", 50.06, 19.94], ["Split", "Croatia", 43.51, 16.44], ["Crete", "Greece", 35.24, 24.81],
  ["Abu Dhabi", "UAE", 24.45, 54.38], ["Riyadh", "Saudi Arabia", 24.71, 46.68], ["Amman", "Jordan", 31.95, 35.93], ["Tbilisi", "Georgia", 41.72, 44.79], ["Sharm El Sheikh", "Egypt", 27.92, 34.33], ["Durban", "South Africa", -29.86, 31.02],
  ["Ubud", "Indonesia", -8.51, 115.26], ["Koh Samui", "Thailand", 9.51, 100.01], ["Osaka", "Japan", 34.69, 135.5], ["Busan", "South Korea", 35.18, 129.08], ["Siem Reap", "Cambodia", 13.36, 103.86], ["Boracay", "Philippines", 11.97, 121.92],
  ["Gold Coast", "Australia", -28.02, 153.4], ["Brisbane", "Australia", -27.47, 153.03], ["Adelaide", "Australia", -34.93, 138.6], ["Wellington", "New Zealand", -41.29, 174.78], ["Maui", "USA", 20.8, -156.33], ["Bora Bora", "French Polynesia", -16.5, -151.74],
  ["Portland", "USA", 45.52, -122.68], ["Palm Springs", "USA", 33.83, -116.55], ["Scottsdale", "USA", 33.49, -111.93], ["Santa Fe", "USA", 35.69, -105.94], ["Salt Lake City", "USA", 40.76, -111.89], ["Houston", "USA", 29.76, -95.37],
  ["Minneapolis", "USA", 44.98, -93.27], ["Detroit", "USA", 42.33, -83.05], ["Orlando", "USA", 28.54, -81.38], ["Charleston", "USA", 32.78, -79.93], ["Savannah", "USA", 32.08, -81.09], ["Asheville", "USA", 35.6, -82.55],
  ["Philadelphia", "USA", 39.95, -75.17], ["Calgary", "Canada", 51.05, -114.07], ["Oaxaca", "Mexico", 17.07, -96.73], ["Puerto Vallarta", "Mexico", 20.65, -105.23], ["Mérida", "Mexico", 20.97, -89.62], ["Turks and Caicos", "Turks and Caicos", 21.69, -71.8],
  ["Bahamas", "Bahamas", 25.03, -77.4], ["St Lucia", "St Lucia", 13.91, -60.98], ["Aruba", "Aruba", 12.52, -69.97], ["Bogotá", "Colombia", 4.71, -74.07], ["Montevideo", "Uruguay", -34.9, -56.16], ["Florianópolis", "Brazil", -27.6, -48.55],
  // added 25 Nov 2026 (batch 2): islands, resorts, wellness spots and more cities everywhere
  ["Liverpool", "UK", 53.41, -2.98], ["Bristol", "UK", 51.45, -2.59], ["Oxford", "UK", 51.75, -1.26], ["Cambridge", "UK", 52.21, 0.12], ["York", "UK", 53.96, -1.08],
  ["Leeds", "UK", 53.8, -1.55], ["Newcastle", "UK", 54.98, -1.61], ["Cardiff", "UK", 51.48, -3.18], ["Belfast", "UK", 54.6, -5.93], ["Cotswolds", "UK", 51.83, -1.83],
  ["Lake District", "UK", 54.46, -3.09], ["Isle of Skye", "UK", 57.27, -6.21], ["Galway", "Ireland", 53.27, -9.05], ["Cork", "Ireland", 51.9, -8.47],
  ["Lyon", "France", 45.76, 4.84], ["Bordeaux", "France", 44.84, -0.58], ["Cannes", "France", 43.55, 7.01], ["Biarritz", "France", 43.48, -1.56],
  ["Corsica", "France", 42.04, 9.01], ["Chamonix", "France", 45.92, 6.87], ["Valencia", "Spain", 39.47, -0.38], ["Málaga", "Spain", 36.72, -4.42],
  ["San Sebastián", "Spain", 43.32, -1.98], ["Granada", "Spain", 37.18, -3.6], ["Lanzarote", "Spain", 28.96, -13.55], ["Gran Canaria", "Spain", 27.92, -15.55],
  ["Formentera", "Spain", 38.7, 1.45], ["Algarve", "Portugal", 37.02, -7.93], ["Comporta", "Portugal", 38.38, -8.78], ["Sintra", "Portugal", 38.8, -9.39],
  ["Naples", "Italy", 40.85, 14.27], ["Capri", "Italy", 40.55, 14.24], ["Sardinia", "Italy", 40.12, 9.01], ["Puglia", "Italy", 40.99, 17.22],
  ["Tuscany", "Italy", 43.35, 11.0], ["Cinque Terre", "Italy", 44.13, 9.71], ["Bologna", "Italy", 44.49, 11.34], ["Dolomites", "Italy", 46.41, 11.84],
  ["Turin", "Italy", 45.07, 7.69], ["Geneva", "Switzerland", 46.2, 6.14], ["Lake Lucerne", "Switzerland", 47.05, 8.31], ["St Moritz", "Switzerland", 46.5, 9.84],
  ["Salzburg", "Austria", 47.81, 13.04], ["Antwerp", "Belgium", 51.22, 4.4], ["Bruges", "Belgium", 51.21, 3.22], ["Luxembourg", "Luxembourg", 49.61, 6.13],
  ["Rotterdam", "Netherlands", 51.92, 4.48], ["Frankfurt", "Germany", 50.11, 8.68], ["Cologne", "Germany", 50.94, 6.96], ["Bergen", "Norway", 60.39, 5.32],
  ["Tromsø", "Norway", 69.65, 18.96], ["Lofoten", "Norway", 68.21, 13.6], ["Gothenburg", "Sweden", 57.71, 11.97], ["Lapland", "Finland", 66.5, 25.73],
  ["Tallinn", "Estonia", 59.44, 24.75], ["Riga", "Latvia", 56.95, 24.11], ["Vilnius", "Lithuania", 54.69, 25.28], ["Warsaw", "Poland", 52.23, 21.01],
  ["Ljubljana", "Slovenia", 46.06, 14.51], ["Lake Bled", "Slovenia", 46.36, 14.09], ["Hvar", "Croatia", 43.17, 16.44], ["Zagreb", "Croatia", 45.81, 15.98],
  ["Kotor", "Montenegro", 42.42, 18.77], ["Belgrade", "Serbia", 44.79, 20.45], ["Bucharest", "Romania", 44.43, 26.1], ["Sofia", "Bulgaria", 42.7, 23.32],
  ["Rhodes", "Greece", 36.43, 28.22], ["Corfu", "Greece", 39.62, 19.92], ["Paros", "Greece", 37.09, 25.15], ["Naxos", "Greece", 37.1, 25.38],
  ["Milos", "Greece", 36.69, 24.43], ["Thessaloniki", "Greece", 40.64, 22.94], ["Antalya", "Turkey", 36.9, 30.71], ["Cappadocia", "Turkey", 38.64, 34.83],
  ["Fethiye", "Turkey", 36.62, 29.12], ["Paphos", "Cyprus", 34.78, 32.42], ["Muscat", "Oman", 23.59, 58.38], ["Bahrain", "Bahrain", 26.23, 50.59],
  ["Kuwait City", "Kuwait", 29.38, 47.99], ["Beirut", "Lebanon", 33.89, 35.5], ["Petra", "Jordan", 30.33, 35.44], ["Jeddah", "Saudi Arabia", 21.49, 39.19],
  ["AlUla", "Saudi Arabia", 26.62, 37.92], ["Essaouira", "Morocco", 31.51, -9.77], ["Fes", "Morocco", 34.03, -5.0], ["Tangier", "Morocco", 35.76, -5.83],
  ["Tunis", "Tunisia", 36.81, 10.18], ["Luxor", "Egypt", 25.69, 32.64], ["Dahab", "Egypt", 28.5, 34.51], ["Addis Ababa", "Ethiopia", 9.03, 38.74],
  ["Kigali", "Rwanda", -1.95, 30.06], ["Serengeti", "Tanzania", -2.33, 34.83], ["Diani Beach", "Kenya", -4.32, 39.58], ["Victoria Falls", "Zimbabwe", -17.93, 25.83],
  ["Windhoek", "Namibia", -22.56, 17.08], ["Okavango Delta", "Botswana", -19.3, 22.9], ["Madagascar", "Madagascar", -18.88, 47.51], ["Dakar", "Senegal", 14.72, -17.47],
  ["Cape Verde", "Cape Verde", 16.0, -24.0], ["Kampala", "Uganda", 0.35, 32.58], ["Rishikesh", "India", 30.09, 78.27], ["Jaipur", "India", 26.91, 75.79],
  ["Udaipur", "India", 24.59, 73.71], ["Kerala", "India", 9.93, 76.27], ["Bangalore", "India", 12.97, 77.59], ["Varanasi", "India", 25.32, 83.01],
  ["Bhutan", "Bhutan", 27.47, 89.64], ["Galle", "Sri Lanka", 6.03, 80.22], ["Almaty", "Kazakhstan", 43.24, 76.89], ["Baku", "Azerbaijan", 40.41, 49.87],
  ["Krabi", "Thailand", 8.09, 98.91], ["Koh Phangan", "Thailand", 9.73, 100.01], ["Pattaya", "Thailand", 12.93, 100.88], ["Da Nang", "Vietnam", 16.05, 108.2],
  ["Phu Quoc", "Vietnam", 10.29, 103.98], ["Sapa", "Vietnam", 22.34, 103.84], ["Luang Prabang", "Laos", 19.89, 102.13], ["Penang", "Malaysia", 5.41, 100.33],
  ["Langkawi", "Malaysia", 6.35, 99.8], ["Lombok", "Indonesia", -8.65, 116.32], ["Gili Islands", "Indonesia", -8.35, 116.04], ["Jakarta", "Indonesia", -6.21, 106.85],
  ["Palawan", "Philippines", 9.84, 118.74], ["Siargao", "Philippines", 9.85, 126.05], ["Cebu", "Philippines", 10.32, 123.89], ["Okinawa", "Japan", 26.21, 127.68],
  ["Hokkaido", "Japan", 43.06, 141.35], ["Jeju", "South Korea", 33.5, 126.53], ["Macau", "Macau", 22.2, 113.54], ["Beijing", "China", 39.9, 116.4],
  ["Chengdu", "China", 30.57, 104.07], ["Ulaanbaatar", "Mongolia", 47.89, 106.91], ["Hobart", "Australia", -42.88, 147.33], ["Cairns", "Australia", -16.92, 145.77],
  ["Whitsundays", "Australia", -20.28, 148.72], ["Noosa", "Australia", -26.39, 153.09], ["Darwin", "Australia", -12.46, 130.84],
  ["Margaret River", "Australia", -33.95, 115.07], ["Christchurch", "New Zealand", -43.53, 172.64], ["Rarotonga", "Cook Islands", -21.21, -159.78],
  ["Samoa", "Samoa", -13.83, -171.76], ["New Caledonia", "New Caledonia", -22.27, 166.46], ["Vanuatu", "Vanuatu", -17.73, 168.32], ["Kauai", "USA", 22.07, -159.5],
  ["Big Island Hawaii", "USA", 19.64, -155.99], ["Tucson", "USA", 32.22, -110.97], ["Malibu", "USA", 34.03, -118.78], ["Santa Barbara", "USA", 34.42, -119.7],
  ["Napa Valley", "USA", 38.3, -122.29], ["Lake Tahoe", "USA", 39.1, -120.03], ["Big Sur", "USA", 36.27, -121.81], ["Sacramento", "USA", 38.58, -121.49],
  ["Aspen", "USA", 39.19, -106.82], ["Boulder", "USA", 40.01, -105.27], ["Jackson Hole", "USA", 43.48, -110.76], ["Bozeman", "USA", 45.68, -111.04],
  ["Boise", "USA", 43.62, -116.2], ["Anchorage", "USA", 61.22, -149.9], ["San Antonio", "USA", 29.42, -98.49], ["Marfa", "USA", 30.31, -104.02],
  ["Kansas City", "USA", 39.1, -94.58], ["St Louis", "USA", 38.63, -90.2], ["Memphis", "USA", 35.15, -90.05], ["Charlotte", "USA", 35.23, -80.84],
  ["Raleigh", "USA", 35.78, -78.64], ["Tampa", "USA", 27.95, -82.46], ["Key West", "USA", 24.56, -81.78], ["Palm Beach", "USA", 26.71, -80.04],
  ["Fort Lauderdale", "USA", 26.12, -80.14], ["Pittsburgh", "USA", 40.44, -80.0], ["Cleveland", "USA", 41.5, -81.69], ["Columbus", "USA", 39.96, -83.0],
  ["Indianapolis", "USA", 39.77, -86.16], ["Milwaukee", "USA", 43.04, -87.91], ["Hamptons", "USA", 40.96, -72.18], ["Hudson Valley", "USA", 41.75, -73.94],
  ["Cape Cod", "USA", 41.67, -70.3], ["Martha's Vineyard", "USA", 41.39, -70.61], ["Portland Maine", "USA", 43.66, -70.26], ["Vermont", "USA", 44.26, -72.58],
  ["Baltimore", "USA", 39.29, -76.61], ["Richmond", "USA", 37.54, -77.44], ["Victoria BC", "Canada", 48.43, -123.37], ["Banff", "Canada", 51.18, -115.57],
  ["Whistler", "Canada", 50.12, -122.95], ["Quebec City", "Canada", 46.81, -71.21], ["Ottawa", "Canada", 45.42, -75.7], ["Halifax", "Canada", 44.65, -63.58],
  ["Playa del Carmen", "Mexico", 20.63, -87.08], ["Cancún", "Mexico", 21.16, -86.85], ["Holbox", "Mexico", 21.52, -87.38], ["Bacalar", "Mexico", 18.68, -88.39],
  ["San Miguel de Allende", "Mexico", 20.91, -100.74], ["Guadalajara", "Mexico", 20.66, -103.35], ["Sayulita", "Mexico", 20.87, -105.44],
  ["Todos Santos", "Mexico", 23.45, -110.22], ["Belize", "Belize", 17.25, -88.77], ["Antigua Guatemala", "Guatemala", 14.56, -90.73],
  ["Lake Atitlán", "Guatemala", 14.69, -91.2], ["Roatán", "Honduras", 16.32, -86.54], ["San Juan del Sur", "Nicaragua", 11.25, -85.87], ["Panama City", "Panama", 8.98, -79.52],
  ["Bocas del Toro", "Panama", 9.34, -82.24], ["Nosara", "Costa Rica", 9.98, -85.65], ["Santa Teresa", "Costa Rica", 9.64, -85.17],
  ["Antigua", "Antigua and Barbuda", 17.12, -61.85], ["St Barts", "St Barts", 17.9, -62.83], ["Anguilla", "Anguilla", 18.22, -63.07],
  ["Grenada", "Grenada", 12.11, -61.68], ["Trinidad", "Trinidad and Tobago", 10.65, -61.52], ["Curaçao", "Curaçao", 12.17, -68.98],
  ["Dominican Republic", "Dominican Republic", 18.58, -68.4], ["Cayman Islands", "Cayman Islands", 19.31, -81.25], ["Bermuda", "Bermuda", 32.3, -64.78],
  ["US Virgin Islands", "USA", 18.34, -64.93], ["British Virgin Islands", "British Virgin Islands", 18.43, -64.62], ["Martinique", "Martinique", 14.64, -61.02],
  ["Guadeloupe", "Guadeloupe", 16.27, -61.55], ["Quito", "Ecuador", -0.18, -78.47], ["Galápagos", "Ecuador", -0.95, -90.97], ["La Paz", "Bolivia", -16.5, -68.15],
  ["Salar de Uyuni", "Bolivia", -20.13, -67.49], ["Atacama", "Chile", -22.91, -68.2], ["Valparaíso", "Chile", -33.05, -71.62], ["Patagonia", "Chile", -51.73, -72.51],
  ["Mendoza", "Argentina", -32.89, -68.84], ["Bariloche", "Argentina", -41.13, -71.31], ["Punta del Este", "Uruguay", -34.96, -54.95],
  ["Búzios", "Brazil", -22.75, -41.88], ["Trancoso", "Brazil", -16.59, -39.1], ["Fernando de Noronha", "Brazil", -3.85, -32.42], ["Recife", "Brazil", -8.05, -34.88],
  ["Manaus", "Brazil", -3.12, -60.02], ["Santa Marta", "Colombia", 11.24, -74.2], ["Caracas", "Venezuela", 10.48, -66.9], ["Faroe Islands", "Faroe Islands", 62.01, -6.77],
  ["Greenland", "Greenland", 64.18, -51.72], ["Svalbard", "Norway", 78.22, 15.65], ["Isle of Man", "Isle of Man", 54.15, -4.48], ["Jersey", "Jersey", 49.21, -2.13],
  ["Gozo", "Malta", 36.04, 14.24], ["Nuwara Eliya", "Sri Lanka", 6.95, 80.79], ["Réunion", "Réunion", -21.12, 55.54],
  // added 25 Nov 2026 (batch 3): towns, the charming, wellness and travel-favourite ones
  ["Whitstable", "UK", 51.36, 1.03], ["Margate", "UK", 51.39, 1.39], ["Hastings", "UK", 50.85, 0.57], ["Windsor", "UK", 51.48, -0.61], ["Harrogate", "UK", 53.99, -1.54],
  ["Stratford-upon-Avon", "UK", 52.19, -1.71], ["Chester", "UK", 53.19, -2.89], ["Durham", "UK", 54.78, -1.57], ["St Ives", "UK", 50.21, -5.48],
  ["Padstow", "UK", 50.54, -4.94], ["Totnes", "UK", 50.43, -3.69], ["Glastonbury", "UK", 51.15, -2.71], ["Rye", "UK", 50.95, 0.73], ["Hebden Bridge", "UK", 53.74, -2.01],
  ["Whitby", "UK", 54.49, -0.61], ["St Andrews", "UK", 56.34, -2.8], ["Inverness", "UK", 57.48, -4.22], ["Tenby", "UK", 51.67, -4.7], ["Llandudno", "UK", 53.32, -3.83],
  ["Kinsale", "Ireland", 51.71, -8.52], ["Dingle", "Ireland", 52.14, -10.27], ["Hallstatt", "Austria", 47.56, 13.65], ["Annecy", "France", 45.9, 6.13],
  ["Colmar", "France", 48.08, 7.36], ["Gordes", "France", 43.91, 5.2], ["Arles", "France", 43.68, 4.63], ["Étretat", "France", 49.71, 0.21],
  ["Rovinj", "Croatia", 45.08, 13.64], ["Ronda", "Spain", 36.74, -5.17], ["Cadaqués", "Spain", 42.29, 3.28], ["Sóller", "Spain", 39.77, 2.71],
  ["Taormina", "Italy", 37.85, 15.29], ["Portofino", "Italy", 44.3, 9.21], ["Sirmione", "Italy", 45.49, 10.61], ["Matera", "Italy", 40.67, 16.6],
  ["Ostuni", "Italy", 40.73, 17.58], ["Montepulciano", "Italy", 43.09, 11.78], ["Óbidos", "Portugal", 39.36, -9.16], ["Cascais", "Portugal", 38.7, -9.42],
  ["Lagos Portugal", "Portugal", 37.1, -8.67], ["Ericeira", "Portugal", 38.96, -9.42], ["Zermatt", "Switzerland", 46.02, 7.75], ["Interlaken", "Switzerland", 46.69, 7.86],
  ["Grindelwald", "Switzerland", 46.62, 8.04], ["Heidelberg", "Germany", 49.4, 8.67], ["Rothenburg", "Germany", 49.38, 10.19], ["Český Krumlov", "Czechia", 48.81, 14.32],
  ["Giethoorn", "Netherlands", 52.74, 6.08], ["Delft", "Netherlands", 52.01, 4.36], ["Hydra", "Greece", 37.35, 23.47], ["Nafplio", "Greece", 37.57, 22.81],
  ["Kaş", "Turkey", 36.2, 29.64], ["Alaçatı", "Turkey", 38.28, 26.38], ["Sitges", "Spain", 41.24, 1.81], ["Skagen", "Denmark", 57.72, 10.58],
  ["Ojai", "USA", 34.45, -119.24], ["Carmel-by-the-Sea", "USA", 36.56, -121.92], ["Sausalito", "USA", 37.86, -122.49], ["Healdsburg", "USA", 38.61, -122.87],
  ["Mendocino", "USA", 39.31, -123.8], ["Joshua Tree", "USA", 34.13, -116.31], ["Taos", "USA", 36.41, -105.57], ["Park City", "USA", 40.65, -111.5],
  ["Telluride", "USA", 37.94, -107.81], ["Sun Valley", "USA", 43.7, -114.35], ["Woodstock", "USA", 42.04, -74.12], ["Kennebunkport", "USA", 43.36, -70.48],
  ["Nantucket", "USA", 41.28, -70.1], ["Stowe", "USA", 44.47, -72.69], ["Bar Harbor", "USA", 44.39, -68.2], ["Fredericksburg", "USA", 30.27, -98.87],
  ["Hilton Head", "USA", 32.22, -80.75], ["St Augustine", "USA", 29.9, -81.31], ["Sanibel", "USA", 26.44, -82.11], ["Laguna Beach", "USA", 33.54, -117.78],
  ["Bend", "USA", 44.06, -121.32], ["Hood River", "USA", 45.71, -121.52], ["Leavenworth", "USA", 47.6, -120.66], ["Beaufort", "USA", 32.43, -80.67],
  ["Rosemary Beach", "USA", 30.28, -86.01], ["Tofino", "Canada", 49.15, -125.9], ["Niagara-on-the-Lake", "Canada", 43.25, -79.07], ["Lunenburg", "Canada", 44.38, -64.31],
  ["Mont-Tremblant", "Canada", 46.21, -74.58], ["Canggu", "Indonesia", -8.65, 115.13], ["Uluwatu", "Indonesia", -8.83, 115.09], ["Pai", "Thailand", 19.36, 98.44],
  ["Hakone", "Japan", 35.23, 139.11], ["Nara", "Japan", 34.69, 135.8], ["Kamakura", "Japan", 35.32, 139.55], ["Takayama", "Japan", 36.14, 137.25],
  ["Ella", "Sri Lanka", 6.87, 81.05], ["Pushkar", "India", 26.49, 74.55], ["Hampi", "India", 15.34, 76.46], ["Munnar", "India", 10.09, 77.06],
  ["Pokhara", "Nepal", 28.21, 83.99], ["El Nido", "Philippines", 11.18, 119.39], ["Ninh Binh", "Vietnam", 20.25, 105.97], ["Kampot", "Cambodia", 10.61, 104.18],
  ["San Cristóbal de las Casas", "Mexico", 16.74, -92.64], ["Valle de Guadalupe", "Mexico", 32.09, -116.57], ["Puerto Escondido", "Mexico", 15.86, -97.07],
  ["Isla Mujeres", "Mexico", 21.23, -86.73], ["Montañita", "Ecuador", -1.83, -80.75], ["Salento", "Colombia", 4.64, -75.57], ["Villa de Leyva", "Colombia", 5.63, -73.52],
  ["Paraty", "Brazil", -23.22, -44.71], ["Jericoacoara", "Brazil", -2.79, -40.51], ["Ilha Grande", "Brazil", -23.14, -44.17], ["Cafayate", "Argentina", -26.07, -65.98],
  ["El Calafate", "Argentina", -50.34, -72.27], ["Pucón", "Chile", -39.27, -71.98], ["Ollantaytambo", "Peru", -13.26, -72.26], ["Máncora", "Peru", -4.1, -81.05],
  ["Puerto Viejo", "Costa Rica", 9.66, -82.75], ["Caye Caulker", "Belize", 17.74, -88.03], ["Port Douglas", "Australia", -16.48, 145.47],
  ["Daylesford", "Australia", -37.34, 144.14], ["Byron hinterland", "Australia", -28.65, 153.38], ["Wanaka", "New Zealand", -44.7, 169.13],
  ["Raglan", "New Zealand", -37.8, 174.87], ["Akaroa", "New Zealand", -43.8, 172.97], ["Chefchaouen", "Morocco", 35.17, -5.27],
  ["Hermanus", "South Africa", -34.42, 19.24], ["Franschhoek", "South Africa", -33.91, 19.12], ["Lamu", "Kenya", -2.27, 40.9], ["Siwa Oasis", "Egypt", 29.2, 25.52],
] as [string, string, number, number][]).map(([name, country, lat, lon]) => ({ name, country, lat, lon }));

// What each house runs, for "your chart if you lived here" (relocated houses, Placidus like her natal chart).
export const HOUSE_MEANING = [
  "",
  "you, your body, your look and how fast you move",
  "your money, your worth and what you own",
  "your voice, your ideas and your everyday circle",
  "home, family, roots and how safe you feel",
  "fun, romance, creativity and being adored",
  "your daily routine, your health and how you work",
  "partners, marriage, clients and who you attract",
  "intimacy, shared money, investments and deep change",
  "travel, study, teaching, publishing and big beliefs",
  "career, reputation, being SEEN and your legacy",
  "friends, community, followers and your future dreams",
  "rest, spirituality, healing and your inner world",
];

export const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

// The timing layer: a slow planet touching one of her natal planets switches on every line that
// natal planet draws, everywhere on her map, for as long as the contact lasts.
export const ASPECT_WORD: Record<number, string> = { 0: "on", 60: "flowing with", 90: "pushing", 120: "flowing with", 180: "facing" };
export const TRANSIT_COPY: Record<string, (natal: string, word: string) => string> = {
  Jupiter: (n, w) => `Jupiter is pouring luck on your ${n} lines, so anything to do with ${w} gets bigger and easier in these places. This is THE window to book the trip.`,
  Saturn: (n, w) => `Saturn is making your ${n} lines serious. Go to these places to commit, build and finish things around ${w}, and expect results that last.`,
  Uranus: (n, w) => `Uranus is electrifying your ${n} lines. Expect the sudden yes, the surprise offer and the plot twist around ${w}, so go when you are ready for life to move fast.`,
  Neptune: (n, w) => `Neptune is making your ${n} lines dreamy and magnetic. Gorgeous for healing, creating and falling in love with ${w}, with both feet on the ground for anything money.`,
  Pluto: (n, w) => `Pluto is supercharging your ${n} lines. Go to these places to take your power back around ${w} and leave an old version of you behind.`,
};

// Plain-language names for newbies. A line is named by the part of life it runs, never by MC/IC jargon.
export const ANGLE_LINE: Record<string, string> = { MC: "career line", IC: "home line", ASC: "glow line", DSC: "love line" };
export const ANGLE_WHERE: Record<string, string> = {
  MC: "sits at the very top of your sky here, the part of your chart that runs career, reputation and being SEEN",
  IC: "sits right under your feet here, the part of your chart that runs home, family and feeling safe",
  ASC: "is rising here, the part of your chart that runs you, your body and your glow",
  DSC: "is setting here, the part of your chart that runs love, partners and who you attract",
};
export const PLANET_PLAIN: Record<string, string> = {
  Sun: "The Sun, your confidence and shine", Moon: "The Moon, your heart and comfort", Mercury: "Mercury, your voice and ideas planet",
  Venus: "Venus, your love, beauty and money planet", Mars: "Mars, your drive and fire planet", Jupiter: "Jupiter, your luck and abundance planet",
  Saturn: "Saturn, your discipline and long-game planet", Uranus: "Uranus, your freedom and breakthrough planet",
  Neptune: "Neptune, your dreams and intuition planet", Pluto: "Pluto, your power and transformation planet",
  "North Node": "Your North Node, your destiny point", Chiron: "Chiron, your wound-into-medicine point", Lilith: "Lilith, your wild, unapologetic power point", "Part of Fortune": "Your Part of Fortune, your luck and joy point",
};

// City pop-up practicals: how long to go for (by line) and what to watch for (by planet).
export const HOW_LONG: Record<string, string> = {
  MC: "a work trip, a launch, a speaking gig or a move for your career",
  IC: "living there, long stays and putting down roots, it builds the longer you stay",
  ASC: "even a week works, perfect for a glow-up trip or a fresh-start holiday",
  DSC: "go with an open diary, dates, clients and collabs find you while you're there",
};
export const WATCH_FOR: Record<string, string> = {
  Sun: "ego clashes and burning out from being ON all the time",
  Moon: "big feelings and moodiness, so build in rest and soft days",
  Mercury: "overthinking and saying yes to too many plans",
  Venus: "overspending on beautiful things and people-pleasing",
  Jupiter: "overdoing everything: food, money, promises",
  Mars: "arguments, rushing and running yourself into the ground",
  Saturn: "heaviness and loneliness, so go with a clear plan and an end date",
  Uranus: "sudden changes and plans falling through, stay flexible",
  Neptune: "blurry boundaries and money confusion, read the small print",
  Pluto: "power struggles and intensity, choose your people carefully",
  "North Node": "feeling out of your comfort zone at first, that is the point",
  Chiron: "old insecurities coming up, so go gently and take support",
  Lilith: "power games and burning bridges, keep your fire aimed well",
  "Part of Fortune": "getting so comfy you coast, keep saying yes",
};
export const TRANSIT_VERB: Record<string, string> = { Jupiter: "lighting up", Saturn: "strengthening", Uranus: "electrifying", Neptune: "softening", Pluto: "supercharging" };

// ── her chart, not anyone's: the personal layer on every line (added 26 Nov 2026) ──
// How a planet behaves in each sign, short enough to sit in one sentence.
export const SIGN_STYLE: Record<string, string> = {
  Aries: "fast, bold and first in line", Taurus: "slow, sensual and built to last", Gemini: "chatty, curious and full of ideas",
  Cancer: "soft, protective and deeply emotional", Leo: "loud, generous and made for the spotlight", Virgo: "precise, helpful and a bit of a perfectionist",
  Libra: "charming, pretty and all about the people", Scorpio: "intense, private and all-or-nothing", Sagittarius: "free, lucky and always up for more",
  Capricorn: "ambitious, strategic and serious about results", Aquarius: "original, independent and ahead of its time", Pisces: "dreamy, intuitive and magical",
};
// Modern rulers, so a line can say which parts of her life that planet runs.
export const RULER: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon", Leo: "Sun", Virgo: "Mercury",
  Libra: "Venus", Scorpio: "Pluto", Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Uranus", Pisces: "Neptune",
};
// Short life-area names per house, for "it also runs your money and your love life".
export const HOUSE_SHORT = ["", "you and your glow", "your money", "your voice and ideas", "home and family", "romance and fun", "your health and daily work", "love and partners", "shared money and intimacy", "travel and big beliefs", "your career and reputation", "your friends and following", "your inner world"];
// How her strongest natal aspect colours a line.
export const ASPECT_TONE: Record<string, (other: string, word: string) => string> = {
  conjunction: (o, w) => `It sits right on top of your ${o}, so ${w} switches on here too`,
  trine: (o, w) => `It flows with your ${o}, so ${w} comes along easily here too`,
  sextile: (o, w) => `It is backed by your ${o}, so ${w} opens doors here too`,
  square: (o, w) => `It is pushed by your ${o}, so expect some friction around ${w}, the kind that makes you grow`,
  opposition: (o, w) => `It faces your ${o}, so this place asks you to balance it with ${w}`,
};
// One line per location type for the big "what do you want more of" picker.
export const GOAL_BLURB: Record<string, string> = {
  money: "money, abundance and receiving more $$$",
  career: "being seen, celebrated and recognised",
  fame: "going viral, press and a big audience",
  girlstrip: "friendship, pleasure and adventure",
  honeymoon: "romance, anniversaries and falling deeper",
  power: "magnetic, confident and unstoppable",
  business: "clients, leadership and your next HQ",
  dreamlife: "belonging, romance and a life you love",
  peace: "calm, safe and soft",
  love: "meeting your person", selflove: "falling for yourself", glow: "your full glow up", healing: "rest and healing",
  create: "your best creative work", adventure: "the trip of a lifetime", realise: "the big penny-drop moments",
};
