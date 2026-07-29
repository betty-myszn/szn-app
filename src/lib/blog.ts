// The blog content store. Posts live here as typed data rather than as MDX files for the same
// reason the season pages do: everything stays type-checked, the build stays static, and a missing
// description or a broken category is a compile error rather than a page that quietly ships without
// a meta tag. Voice rules as everywhere else: cosmic coach, British spellings, no em dashes, and no
// rhetorical questions in the prose (real questions belong in the FAQ blocks, where they get a "?").
//
// SEO shape of each post: one primary query in the title, the same intent answered in the first
// paragraph (so the answer is above the fold for a featured snippet), then sections that cover the
// related long-tail, then FAQs that feed FAQPage structured data.

export interface BlogSection {
  heading: string;
  body: string[];
}

export interface BlogFaq {
  question: string;
  answer: string;
}

// A contextual call to action, rendered inside the article rather than only at the bottom. Matched
// to what the post is actually about: a birth chart explainer sends you to calculate one, a piece
// about working with a season sends you into the membership. A generic footer CTA converts far
// worse than one that answers the question the reader is holding at that exact moment.
export interface BlogCta {
  heading: string;
  body: string;
  label: string;
  href: string;
}

export interface BlogPost {
  slug: string;
  /** H1 on the page. Written for a human. */
  title: string;
  /** <title> tag. Written for the search result, so it can differ from the H1. */
  metaTitle: string;
  description: string;
  category: CategorySlug;
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  readingMinutes: number;
  /** One-line hook used on the hub and category pages. */
  excerpt: string;
  /** Answers the title's question immediately, for snippet eligibility. */
  intro: string[];
  sections: BlogSection[];
  /** Contextual CTA, rendered part-way through the article. */
  cta: BlogCta;
  faqs: BlogFaq[];
  /** Slugs of related posts, rendered as internal links. Internal linking is the whole game. */
  related: string[];
}

export type CategorySlug =
  | "birth-chart"
  | "zodiac-signs"
  | "love"
  | "career-money"
  | "moon-transits";

export interface BlogCategory {
  slug: CategorySlug;
  name: string;
  /** H1 and nav label. */
  title: string;
  metaTitle: string;
  description: string;
  /** Intro paragraph on the category page, so it is not a bare list of links. */
  intro: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "birth-chart",
    name: "Birth Chart Basics",
    title: "Birth Chart Basics",
    metaTitle: "Birth Chart Basics: How to Read Your Natal Chart",
    description:
      "Plain-English guides to reading your natal chart. What the planets, houses and angles actually mean, and how to make sense of your own.",
    intro:
      "Your birth chart is a map of the sky at the exact moment you were born, and it is the foundation everything else here is built on. These guides start from zero, no jargon assumed, and take you through what each part of the chart actually describes about your life.",
  },
  {
    slug: "zodiac-signs",
    name: "Zodiac Signs",
    title: "Zodiac Signs",
    metaTitle: "Zodiac Signs & Seasons Explained: Traits, Dates & Meanings",
    description:
      "What each zodiac sign actually means, beyond the horoscope stereotypes, plus season-by-season guides to what the sky is asking of you while the Sun moves through each one.",
    intro:
      "A sign is a flavour, not a personality test. These guides cover what each one is genuinely trying to do, why the same sign looks different in two people, and what each zodiac season is asking of all of us while the Sun moves through it.",
  },
  {
    slug: "love",
    name: "Love & Relationships",
    title: "Love & Relationships",
    metaTitle: "Astrology and Love: Venus, Compatibility & Relationships",
    description:
      "Venus signs, attraction patterns, compatibility done properly, and what your chart says about how you love and what you actually need.",
    intro:
      "Compatibility is more interesting than sun sign matching, and considerably more useful. These guides look at the placements that genuinely describe how you love, what you need to feel secure, and the patterns you keep repeating.",
  },
  {
    slug: "career-money",
    name: "Career & Money",
    title: "Career & Money",
    metaTitle: "Astrology for Career and Money: Midheaven, 2nd House & Purpose",
    description:
      "The placements that describe your work, your earning patterns and what you are here to be known for. Midheaven, second house, tenth house and north node.",
    intro:
      "Your chart will not tell you which job to take, and anyone claiming otherwise is guessing. What it does describe well is the conditions you work best under, the way money tends to move for you, and what you want to be known for.",
  },
  {
    slug: "moon-transits",
    name: "Moon & Transits",
    title: "Moon & Transits",
    metaTitle: "Moon Phases and Transits: What They Mean and How to Work With Them",
    description:
      "New moons, full moons, eclipses, retrogrades and nodal shifts. What is actually happening in the sky and what it means for how you plan.",
    intro:
      "Transits are the sky moving over your birth chart, and they are the reason astrology feels like timing rather than personality. These guides explain what each event is and, more importantly, what it is genuinely useful for.",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "leo-season-2026",
    title: "Leo Season 2026: It's Time to Become the Main Character",
    metaTitle: "Leo Season 2026: Astrology Guide to Confidence, Visibility & Success",
    description:
      "Discover what Leo Season 2026 means for your zodiac sign, how to work with the astrology, and how to become your most confident, visible, magnetic self.",
    category: "zodiac-signs",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readingMinutes: 9,
    excerpt:
      "Leo Season arrives alongside a Saturn retrograde and a nodal shift into Leo and Aquarius. Here is what that means, and how to work with it.",
    intro: [
      "Leo Season 2026 is here, and if you've felt that little voice inside you getting louder over the past few weeks, asking for more visibility, more confidence and a life that actually reflects who you're becoming, you're probably already feeling this shift. Every single year, the Sun moves into Leo, bringing a completely different flavour of energy, one that encourages us to stop hiding in the background, take ourselves more seriously and finally allow ourselves to enjoy the life we're building instead of constantly waiting until we've achieved the next goal before we're allowed to celebrate.",
      "This year's Leo Season feels even more significant because it arrives alongside some of the biggest astrological shifts we've experienced in years. Saturn has just stationed retrograde in Aries, asking us to revisit our foundations before rushing into the future, while the Lunar Nodes have shifted into the Leo and Aquarius axis, beginning an entirely new eighteen month chapter around authenticity, leadership, visibility, creativity and the courage to become the person you've always known you could be.",
    ],
    sections: [
      {
        heading: "What does Leo Season actually mean?",
        body: [
          "Leo is ruled by the Sun, and in astrology the Sun represents your identity, your confidence, your life force and the unique qualities that you're here to express throughout your lifetime. During Leo Season, every single one of us receives an invitation to reconnect with those parts of ourselves that may have become buried underneath responsibilities, self doubt, people pleasing or the endless pressure to fit into somebody else's expectations.",
          "Many people assume Leo energy is simply about being loud or wanting attention, but that's a huge misunderstanding of what this sign is actually here to teach us. Healthy Leo energy has very little to do with performing for other people and everything to do with expressing yourself so honestly that you naturally inspire others to do the same. Sometimes that looks like launching a business, putting yourself on camera, asking for the promotion, raising your prices or finally sharing the creative project you've been sitting on for years. Other times it simply looks like walking into a room without immediately making yourself smaller.",
          "The question Leo Season asks all of us is beautifully simple. If fear wasn't making your decisions, what would your life actually look like?",
        ],
      },
      {
        heading: "Why this Leo Season feels different",
        body: [
          "This isn't just another Leo Season where we all feel a little more confident for a few weeks before moving on. The astrology surrounding this particular season suggests that many of us are standing at the beginning of a completely different chapter, one that's likely to unfold over the next eighteen months as the Lunar Nodes travel through Leo and Aquarius.",
          "The South Node moving through Aquarius asks us to release the versions of ourselves that have hidden inside groups, sought validation from communities that no longer fit, worried about what everybody else thinks or quietly dimmed our light because shining too brightly felt uncomfortable. At the very same time, [the North Node](/blog/north-node-and-life-purpose) in Leo begins pulling us towards a future where we're encouraged to create, lead, express ourselves more fully and stop waiting for permission from other people before deciding we're ready.",
          "For many people, this will feel uncomfortable before it feels exciting because stepping into visibility almost always requires leaving behind an older identity that once kept you safe. That's exactly why so many friendships, careers, communities and long held beliefs can begin shifting around this time. You're changing, and naturally your life begins changing alongside you.",
        ],
      },
      {
        heading: "Saturn retrograde is slowing things down for a reason",
        body: [
          "As if the nodal shift wasn't enough, Saturn has also stationed retrograde in Aries, creating an energy that can initially feel frustrating if you're eager to move quickly. Projects may slow down, plans might need another round of edits, unexpected responsibilities can suddenly appear and opportunities you thought would happen immediately may ask for a little more patience than you'd originally hoped.",
          "Although this can feel incredibly annoying in the moment, Saturn has never been interested in quick wins. Saturn wants sustainability. It wants strong foundations. It wants you to build something that still exists years from now instead of something that collapses because you skipped the important work at the beginning.",
          "If you've experienced delays recently, try viewing them through a different lens. Perhaps life isn't saying no. Perhaps life is simply asking you to become the version of yourself who's fully capable of holding everything you're asking for before it arrives.",
        ],
      },
      {
        heading: "The shadow side of Leo Season",
        body: [
          "Every zodiac sign carries both incredible gifts and lessons, and Leo is no exception. When we're embodying the highest expression of Leo, we become generous, creative, playful, inspiring and deeply connected to our authentic selves. When we're operating from the shadow side, however, it's very easy to become attached to external validation instead of genuine self worth.",
          "This is often when comparison creeps in. We start obsessing over follower counts, wondering why someone else's business appears to be growing faster than ours, questioning whether we're good enough to post the video, launch the offer or share our opinions because somebody somewhere might disagree.",
          "Ironically, the more energy we spend trying to be liked by everyone, the less magnetic we become. Real confidence has never come from universal approval. It comes from repeatedly choosing to show up as yourself, even when that feels vulnerable, trusting that the people who are meant for your work will naturally find you.",
        ],
      },
      {
        heading: "How to work with Leo Season",
        body: [
          "Leo Season rewards courageous action, which makes this one of the most supportive times of year to become more visible in whatever way feels aligned for you. Start the podcast you've been talking about for months. Launch the business idea that's been sitting in your notes app. Finally book the photoshoot. Put your face on your website. Wear the outfit you've been saving for a special occasion. Raise your prices if you already know you're undercharging. Apply for the opportunity that feels slightly out of reach.",
          "None of these actions require you to suddenly become fearless. Confidence has never been something you're born with. Confidence is built every single time you do the thing your nervous system tells you to avoid. Eventually your brain collects enough evidence that being seen isn't actually dangerous, and what once felt terrifying slowly starts becoming normal.",
          "Leo Season is also an incredible time to remember that your joy isn't a distraction from your success, it's often the very thing that creates it. The more connected you are to what lights you up, the easier it becomes to attract the right opportunities, people and ideas into your life. Your creativity is trying to tell you something this season, so stop dismissing it as unrealistic and start treating it like the guidance it actually is.",
        ],
      },
      {
        heading: "Your birth chart changes everything",
        body: [
          "This is where personalised astrology becomes so powerful because no two people will experience Leo Season in exactly the same way. For one person, Leo may activate their career and public visibility. For somebody else, it may highlight relationships, creativity, children, home life, finances or spirituality. The collective astrology gives us the weather forecast, but [your personal birth chart](/chart) tells you exactly where that weather is landing in your own life.",
          "Understanding your chart allows you to work with these transits instead of feeling like life is simply happening to you. Rather than wondering why somebody else seems to be having a completely different experience of Leo Season, you begin understanding that your chart has its own unique story, timeline and invitations for growth.",
          "When you understand your chart, you stop following advice that was designed for everyone else. You stop forcing yourself into business strategies, career paths and life decisions that were never aligned for you in the first place. Instead, you begin working with your own natural strengths, your own timing and your own energetic blueprint, which is where astrology becomes far more than something interesting to read. It becomes a practical tool that helps you make better decisions in every area of your life.",
        ],
      },
      {
        heading: "Questions to reflect on this Leo Season",
        body: [
          "As you move through the next few weeks, spend some time reflecting on where life is gently encouraging you to become bigger instead of smaller. Ask yourself where you've been waiting for permission, which parts of your personality you've hidden because they once felt unsafe and what version of yourself you're quietly becoming behind the scenes. Think about what Future You would choose if she wasn't worried about disappointing anyone else, and allow those answers to guide your decisions throughout the season.",
          "You might also ask yourself which dreams you've been putting on hold because they feel too big, too unrealistic or too visible. Leo reminds us that every successful business, every incredible piece of art and every person who inspires millions all began with someone choosing to believe in an idea before anybody else did.",
        ],
      },
      {
        heading: "Ready to stop reading about your astrology and actually start living it?",
        body: [
          "Knowing that Leo Season is all about confidence, visibility and becoming the main character is one thing. Knowing exactly how that shows up in your birth chart, where you're being asked to take bigger risks, where your next opportunities are hiding and what this season is actually trying to teach you is something completely different. That's exactly why I created MY SZN.",
          "Inside MY SZN, you'll receive a personalised astrology platform built around your unique birth chart, so every season, every major transit and every piece of guidance is tailored specifically to you. Instead of trying to squeeze yourself into generic astrology that speaks to millions of people at once, you'll understand how the current astrology is influencing your career, confidence, relationships, money, purpose and personal growth.",
          "Alongside your personalised portal, you'll also become part of a private community of women who are committed to becoming the highest version of themselves, with live coaching, astrology workshops, community chat rooms, personalised seasonal guidance and practical tools that help you actually apply your chart to your everyday life instead of simply reading about it.",
        ],
      },
      {
        heading: "Join us for our upcoming live workshops",
        body: [
          "Your membership also includes access to our live seasonal coaching workshops, where we'll dive much deeper into the astrology and, more importantly, how to use it to create real change in your life.",
          "Become the Main Character. Leo Season is asking every single one of us to stop hiding, become more visible and finally own our gifts. In this live coaching workshop we'll explore exactly how Leo Season is activating your birth chart, where you're being called to step up, what's keeping you playing small and the practical mindset and astrology shifts that help you become the woman you're here to be.",
          "Aquarius Full Moon: Your Next Chapter Begins. Just a few weeks later we'll come together again for our Aquarius Full Moon workshop, where we'll explore one of the biggest collective shifts of 2026. With the Lunar Nodes now moving through Leo and Aquarius, this Full Moon marks the beginning of an entirely new chapter around your purpose, your friendships, your future, your visibility and the legacy you're here to create. You'll leave understanding exactly what this new eighteen month cycle means for you personally and how to work with it instead of feeling left behind by it.",
          "If you're ready to stop consuming astrology and start living it, I'd absolutely love to welcome you inside MY SZN. Your future self is already waiting.",
        ],
      },
    ],
    cta: {
      heading: "See exactly where Leo Season lands in your chart",
      body: "The collective astrology is the weather forecast. Your birth chart tells you which part of your life the weather is actually landing in, and that is the difference between reading this and using it.",
      label: "get your free birth chart",
      href: "/chart",
    },
    faqs: [
      {
        question: "What does Leo Season mean in astrology?",
        answer:
          "Leo is ruled by the Sun, which represents your identity, confidence and life force. Leo Season is an annual invitation to reconnect with the parts of yourself buried under responsibilities, self doubt or people pleasing, and to express yourself more honestly.",
      },
      {
        question: "Why does Leo Season 2026 feel more significant?",
        answer:
          "Because it arrives alongside two major shifts: Saturn stationing retrograde in Aries, which asks you to revisit your foundations, and the Lunar Nodes moving into the Leo and Aquarius axis, which begins an entirely new eighteen month chapter around visibility, creativity and authenticity.",
      },
      {
        question: "What does the North Node in Leo mean?",
        answer:
          "It pulls us towards creating, leading and expressing ourselves more fully without waiting for permission. The South Node in Aquarius asks us to release hiding inside groups, seeking validation from communities that no longer fit, and dimming our light to stay comfortable.",
      },
      {
        question: "Why does Leo Season feel uncomfortable at first?",
        answer:
          "Stepping into visibility usually means leaving behind an older identity that once kept you safe. That is why friendships, careers and long held beliefs often shift during this period. You are changing, so your life changes alongside you.",
      },
      {
        question: "How will Leo Season affect me personally?",
        answer:
          "It depends entirely on your birth chart. For one person Leo activates career and public visibility, for another it highlights relationships, creativity, home life or money. The collective astrology is the weather forecast, and your chart tells you where that weather is landing.",
      },
    ],
    related: ["north-node-and-life-purpose", "big-three-sun-moon-rising", "new-moon-vs-full-moon"],
  },
  {
    slug: "what-is-a-birth-chart",
    title: "What Is a Birth Chart? A Beginner's Guide",
    metaTitle: "What Is a Birth Chart? Beginner's Guide to Your Natal Chart",
    description:
      "A birth chart is a map of the sky at the moment you were born. Here is what it shows, what you need to calculate one, and how to start reading yours.",
    category: "birth-chart",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readingMinutes: 7,
    excerpt:
      "The map of the sky at the exact moment you were born, and what each part of it is actually describing.",
    intro: [
      "A birth chart, also called a natal chart, is a map of where every planet sat in the sky at the exact moment and place you were born. It is calculated from three pieces of information: your date of birth, your time of birth, and the place you were born.",
      "What makes it personal is the time. Two people born on the same day in the same city have almost identical planet positions, but if they were born six hours apart, their houses and their rising sign are completely different, and that changes how the whole chart is read.",
    ],
    sections: [
      {
        heading: "The three parts of every chart",
        body: [
          "Every birth chart is built from the same three ingredients, and once you can name them the chart stops looking like a wheel of symbols.",
          "The planets are the what. Each one governs a different function: the sun is your core identity, the moon is your emotional world, Venus is how you love and what you value, Mars is how you pursue things. The signs are the how. A planet in Aries behaves differently to the same planet in Pisces, because the sign colours the way that function expresses itself. The houses are the where. There are twelve of them, and they divide your chart into areas of life: money, home, relationships, career, and so on.",
          "Put together, you read them as one sentence. Venus in Scorpio in the seventh house means the way you love (Venus) is intense and all-or-nothing (Scorpio) and it plays out primarily through committed one-to-one relationships (seventh house).",
        ],
      },
      {
        heading: "Why your birth time matters so much",
        body: [
          "The rising sign, also called the ascendant, is the sign that was coming up over the eastern horizon at your moment of birth. It changes roughly every two hours, which is why an accurate birth time matters more than any other detail.",
          "Your rising sign sets where every house starts, so getting the time wrong does not shift one small thing, it rotates the entire chart. A placement that should sit in your career house can end up in your home house, and the reading changes completely.",
          "If you genuinely do not know your birth time, you can still read the planets and the signs usefully. You just cannot rely on the houses or the rising sign, and any honest astrologer will tell you the same. Birth certificates, hospital records and, in some countries, public records offices are the usual places to find it.",
        ],
      },
      {
        heading: "The big three, and why everyone starts there",
        body: [
          "Your sun, moon and rising are called [the big three](/blog/big-three-sun-moon-rising) because between them they cover identity, inner life and first impressions, which is most of what people want to know at the start.",
          "The sun is who you are becoming and what lights you up. The moon is what you need to feel safe, and how you process feeling. The rising is the version of you that arrives in a room first, the way strangers read you before you have said anything.",
          "It is genuinely common for people to feel that their sun sign description does not fit. Usually that is because they are reading the sun on its own, when their moon and rising are doing a lot of the visible work.",
        ],
      },
      {
        heading: "What a birth chart cannot do",
        body: [
          "A chart does not predict events with certainty, it does not tell you who to marry, and it does not override your choices. Anyone selling that is selling something else.",
          "What it does well is describe patterns: the conditions you thrive in, the places you reliably get stuck, the kind of work that suits you, and the timing of periods when a particular theme is genuinely louder than usual. Used properly it is a self-knowledge tool with excellent timing built in.",
        ],
      },
    ],
    cta: {
      heading: "Calculate your birth chart free",
      body: "Reading about charts only gets you so far. Put in your date, time and place of birth and see your own planets, houses and angles worked out properly, no sign-up needed.",
      label: "get your free birth chart",
      href: "/chart",
    },
    faqs: [
      {
        question: "What do I need to calculate my birth chart?",
        answer:
          "Your date of birth, your time of birth as precisely as you can get it, and your place of birth. The time determines your rising sign and your house placements, so it matters more than people expect.",
      },
      {
        question: "What if I do not know my birth time?",
        answer:
          "You can still read your planets and signs accurately. Your houses and rising sign will be unreliable, so treat anything that depends on them as provisional. Birth certificates and hospital records are the usual way to find the time.",
      },
      {
        question: "Is a birth chart the same as a natal chart?",
        answer:
          "Yes. Birth chart, natal chart and astrology chart all describe the same thing, a map of the sky at the moment you were born.",
      },
      {
        question: "Why does my sun sign not feel like me?",
        answer:
          "Usually because your moon and rising signs are doing more of the visible work. Your sun is your core direction rather than your whole personality, and reading all three together tends to feel far more accurate.",
      },
    ],
    related: ["big-three-sun-moon-rising", "how-to-read-your-birth-chart", "midheaven-and-career"],
  },
  {
    slug: "big-three-sun-moon-rising",
    title: "Your Big Three: Sun, Moon and Rising Explained",
    metaTitle: "Sun, Moon and Rising Signs Explained (Your Big Three)",
    description:
      "Your sun, moon and rising signs cover identity, emotional needs and first impressions. Here is what each one actually governs and how they work together.",
    category: "birth-chart",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readingMinutes: 6,
    excerpt:
      "Identity, inner world and first impressions. What each of the big three governs, and why they can feel like three different people.",
    intro: [
      "Your big three are your sun sign, your moon sign and your rising sign. Together they describe who you are at your core, what you need emotionally, and how you come across before you have said a word.",
      "They are the starting point because they cover the most ground. Everything else in [your birth chart](/blog/what-is-a-birth-chart) adds detail to a picture these three have already sketched.",
    ],
    sections: [
      {
        heading: "Your sun: the identity you are growing into",
        body: [
          "The sun is the sign most people know, because it is the one determined by your date of birth alone. It describes your core identity, your sense of purpose, and what genuinely energises you.",
          "It is worth thinking of the sun as a direction rather than a finished description. It is the version of yourself you are steadily becoming, which is partly why it can feel more true in your thirties than it did at nineteen.",
        ],
      },
      {
        heading: "Your moon: what you need to feel safe",
        body: [
          "The moon governs your emotional world, your instincts, and what you need in order to feel secure. It is the most private of the three, and it is usually the one closest friends and partners see rather than colleagues.",
          "Because the moon moves quickly, changing sign roughly every two and a half days, you need a reasonably accurate birth date and often a time to pin it down. It describes how you self-soothe, what makes you feel held, and what you reach for when things get hard.",
        ],
      },
      {
        heading: "Your rising: the door people come through",
        body: [
          "Your rising sign, or ascendant, is the sign that was on the eastern horizon when you were born. It is the energy you radiate on arrival, the way strangers read you, and the style you instinctively approach new situations with.",
          "It also sets your whole house structure, which makes it the most structurally important of the three. Your rising sign decides which area of life every planet in your chart is working in.",
        ],
      },
      {
        heading: "When your big three contradict each other",
        body: [
          "Plenty of people have a big three that appears to be in conflict: a bold fire sun, a private water moon, and a cool air rising, for example. That is not a mistake in the chart, it is an accurate description of being a person.",
          "It usually means you present one way, feel another way privately, and are working towards something different again. Understanding which part of you is running at any given moment tends to be more useful than trying to resolve them into one tidy label.",
        ],
      },
    ],
    cta: {
      heading: "Find your big three in under a minute",
      body: "Your sun is easy. Your moon and rising need your birth time and place. Calculate your chart free and get all three at once, with what each one means for you.",
      label: "find my big three",
      href: "/chart",
    },
    faqs: [
      {
        question: "What are the big three in astrology?",
        answer:
          "Your sun sign, moon sign and rising sign. They cover core identity, emotional needs and first impressions, which is why they are the standard starting point for reading a chart.",
      },
      {
        question: "Which of the big three is most important?",
        answer:
          "They do different jobs, so none outranks the others. The rising sign is structurally the most significant, because it determines the house placement of everything else in your chart.",
      },
      {
        question: "Do I need my birth time for my big three?",
        answer:
          "You need it for your rising sign, and often for your moon if you were born on a day the moon changed sign. Your sun sign only needs your date of birth.",
      },
    ],
    related: ["what-is-a-birth-chart", "how-to-read-your-birth-chart", "venus-sign-and-how-you-love"],
  },
  {
    slug: "how-to-read-your-birth-chart",
    title: "How to Read Your Birth Chart, Step by Step",
    metaTitle: "How to Read Your Birth Chart: A Step-by-Step Guide",
    description:
      "A practical order for reading a natal chart without getting overwhelmed. Start with the big three, then houses, then aspects, then patterns.",
    category: "birth-chart",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readingMinutes: 8,
    excerpt:
      "The order to read a chart in, so you build a picture instead of drowning in symbols.",
    intro: [
      "The reason most people bounce off their birth chart is that they try to read everything at once. A chart has roughly forty moving pieces, and looked at simultaneously they cancel each other out.",
      "Read it in layers instead. Start with the big three, add the houses, then the aspects, then look for repeating patterns. Each layer refines the one before it rather than replacing it.",
    ],
    sections: [
      {
        heading: "Step one: your big three",
        body: [
          "Find [your sun, moon and rising](/blog/big-three-sun-moon-rising), and read them as one sentence rather than three separate horoscopes. Sun for identity and direction, moon for emotional needs, rising for how you arrive.",
          "This gives you a working shape before any detail is added, and it is enough on its own to explain a lot about how you operate.",
        ],
      },
      {
        heading: "Step two: which houses everything sits in",
        body: [
          "Now find which house each planet is in. The house tells you which area of life that planet is most active in, and it is often the fastest route to a moment of recognition.",
          "A cluster of planets in one house is worth noticing immediately. It means a disproportionate amount of your energy goes into that area of life, and that area will keep coming up as a theme whether or not you planned it that way.",
        ],
      },
      {
        heading: "Step three: the aspects between planets",
        body: [
          "Aspects are the angles planets make to each other, and they describe how the different parts of you get along. A conjunction fuses two functions together. A trine or sextile means they cooperate easily. A square or opposition means they pull against each other and generate friction.",
          "Hard aspects are not bad news. Squares in particular tend to produce the most drive, because something in you refuses to leave that tension alone. The easy aspects describe talents you may not even notice you have, precisely because they never cost you anything.",
        ],
      },
      {
        heading: "Step four: look for what repeats",
        body: [
          "This is the step that separates reading a chart from listing a chart. Look for the same theme arriving from several directions: a lot of one element, several planets in one house, a sign repeated across your big three.",
          "Anything the chart says three different ways is a genuine headline. Anything it says once is a detail. Weighting them equally is the single most common beginner mistake, and it is what produces those readings that feel simultaneously true and useless.",
        ],
      },
      {
        heading: "Step five: check the timing",
        body: [
          "Your natal chart never changes, but the sky keeps moving over it, and that movement is called transits. This is where astrology becomes practical rather than descriptive.",
          "Once you know your chart, you can look at what is currently being activated, from [moon phases](/blog/new-moon-vs-full-moon) to longer transits, and get a genuine sense of which themes are loud right now. That is what makes the difference between a personality read and something you can actually plan around.",
        ],
      },
    ],
    cta: {
      heading: "Read along with your own chart",
      body: "This is far easier with your chart in front of you than in the abstract. Calculate yours free, then work through the five steps above using your own placements.",
      label: "calculate my chart",
      href: "/chart",
    },
    faqs: [
      {
        question: "What order should I read a birth chart in?",
        answer:
          "Big three first, then house placements, then aspects, then repeating patterns. Reading in layers stops the detail cancelling itself out.",
      },
      {
        question: "Are hard aspects like squares bad?",
        answer:
          "No. Squares and oppositions create friction, and friction creates drive. They usually describe the areas you have worked hardest on, which is why they often end up being strengths.",
      },
      {
        question: "How long does it take to learn to read a chart?",
        answer:
          "You can read your own chart usefully within a few hours of focused effort. Reading other people's fluently takes considerably longer, mostly because you lose the shortcut of already knowing the person.",
      },
    ],
    related: ["what-is-a-birth-chart", "big-three-sun-moon-rising", "new-moon-vs-full-moon"],
  },
  {
    slug: "venus-sign-and-how-you-love",
    title: "What Your Venus Sign Says About How You Love",
    metaTitle: "Venus Sign Meaning: What It Says About How You Love",
    description:
      "Your Venus sign describes how you give and receive affection, what you find attractive and what you value. Here is how to read it properly.",
    category: "love",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readingMinutes: 6,
    excerpt:
      "Venus governs how you love, what you are drawn to, and what makes you feel valued. It is far more useful than sun sign compatibility.",
    intro: [
      "Your Venus sign describes how you love: the way you show affection, what you find attractive, what makes you feel appreciated, and what you consider valuable. It is the placement to read first for anything relationship related.",
      "It is a far better guide than sun sign compatibility, because Venus is specifically about relating, whereas [your sun sign](/blog/big-three-sun-moon-rising) is about identity. Two people whose sun signs supposedly clash can be extremely compatible if their Venus placements understand each other.",
    ],
    sections: [
      {
        heading: "What Venus actually governs",
        body: [
          "Venus rules attraction, affection, pleasure, taste and worth. In a chart it answers two questions at once: how you love, and what you believe you deserve.",
          "That second half is why Venus keeps turning up in conversations about self-worth and money as well as romance. What you value and what you accept are closely linked, and Venus sits at the join.",
        ],
      },
      {
        heading: "Venus by element, the quickest useful read",
        body: [
          "Fire Venus signs (Aries, Leo, Sagittarius) love openly and enthusiastically. They want passion, pursuit and to be visibly chosen, and they lose interest when things get lukewarm.",
          "Earth Venus signs (Taurus, Virgo, Capricorn) love through consistency and action. They show it by turning up, doing the practical thing, and building something that lasts. Grand declarations impress them less than reliability.",
          "Air Venus signs (Gemini, Libra, Aquarius) need mental connection and conversation. They fall for a mind, want to be genuinely interested, and struggle with intensity that leaves no room to breathe.",
          "Water Venus signs (Cancer, Scorpio, Pisces) love deeply and merge quickly. They want emotional safety, depth and to be let all the way in, and they feel surface-level connection as a kind of rejection.",
        ],
      },
      {
        heading: "Why the house matters as much as the sign",
        body: [
          "Venus in the fifth house wants romance, play and being delighted. The same Venus sign in the tenth house channels the same energy into status, public life and being admired for what you do.",
          "If your Venus sign description has never quite landed, the house is usually the missing piece. It tells you where this way of loving actually plays out.",
        ],
      },
      {
        heading: "Using Venus for compatibility properly",
        body: [
          "Compare Venus to Venus first, because that shows whether two people love in ways the other recognises. Then look at Venus to Mars, which is the classic attraction pairing, and Venus to moon, which tends to describe whether affection lands as comfort.",
          "What you are looking for is not identical placements. It is whether each person's way of showing love is legible to the other. Plenty of relationships fail because both people are genuinely trying and neither can read what the other is doing.",
        ],
      },
    ],
    cta: {
      heading: "Find your Venus sign and house",
      body: "Your Venus sign tells you how you love. The house it sits in tells you where that plays out. Calculate your free chart to get both, plus what they mean together.",
      label: "find my venus",
      href: "/chart",
    },
    faqs: [
      {
        question: "What does my Venus sign mean?",
        answer:
          "It describes how you give and receive affection, what you find attractive, and what makes you feel valued. It is the main placement for understanding your relationship patterns.",
      },
      {
        question: "Is Venus more important than my sun sign for compatibility?",
        answer:
          "For relationships, generally yes. Venus is specifically about how you relate, whereas your sun sign describes your core identity rather than how you love.",
      },
      {
        question: "How do I find my Venus sign?",
        answer:
          "Calculate your birth chart and look for Venus. It is usually within two signs of your sun, because Venus never travels far from the sun as seen from Earth.",
      },
    ],
    related: ["big-three-sun-moon-rising", "what-is-a-birth-chart", "north-node-and-life-purpose"],
  },
  {
    slug: "midheaven-and-career",
    title: "Your Midheaven and What You Are Here to Be Known For",
    metaTitle: "Midheaven in Astrology: Your Career and Public Reputation",
    description:
      "Your midheaven, or MC, describes your public role and what you want to be known for. Here is how to read it alongside the tenth house and your north node.",
    category: "career-money",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readingMinutes: 6,
    excerpt:
      "The point at the top of your chart that describes your public role, your reputation and the work you want your name on.",
    intro: [
      "Your midheaven, often shortened to MC, is the point at the very top of your birth chart. It describes your public role, your reputation, and the kind of work you want to be known for rather than simply the job that pays you.",
      "It is calculated from your birth time, so it is one of the placements that becomes unreliable without an accurate one.",
    ],
    sections: [
      {
        heading: "Midheaven versus the tenth house",
        body: [
          "The midheaven is the cusp of the tenth house, so the two are closely related but not identical. The midheaven is a single point and describes the image, the reputation, the thing people associate with your name.",
          "The tenth house is the whole area of life around it: your career path, your standing, your relationship with authority and ambition. Any planets sitting in your tenth house describe how you actually operate professionally.",
        ],
      },
      {
        heading: "How to read your midheaven sign",
        body: [
          "Read the sign on your midheaven as the style of your public presence. A Capricorn midheaven wants to be respected and taken seriously. A Leo midheaven wants to be visible and personally associated with the work. A Pisces midheaven wants the work to mean something, and tends to resist being defined by a job title at all.",
          "Then look at the ruling planet of that sign and find it in your chart. Where it sits tells you where your career story actually gets built, and it is frequently somewhere less obvious than the tenth house.",
        ],
      },
      {
        heading: "Money is a separate question",
        body: [
          "People often collapse career and money into one topic, but the chart separates them. The second house governs your own earned income, your resources and your sense of self-worth. The eighth house covers shared and other people's money: investments, debt, inheritance, joint finances.",
          "It is entirely possible to have a strong career signature and a complicated money signature, which is a fairly precise description of a lot of talented people who undercharge.",
        ],
      },
      {
        heading: "Where the north node fits in",
        body: [
          "Your midheaven describes what you are known for. [Your north node](/blog/north-node-and-life-purpose) describes the direction you are growing in, which is not always the same thing.",
          "When they point the same way, career tends to feel like a natural expression of purpose. When they diverge, it usually shows up as a successful person who is quietly restless, because the thing they are recognised for is not the thing they are actually here to develop.",
        ],
      },
    ],
    cta: {
      heading: "Find your midheaven",
      body: "Your midheaven needs an accurate birth time, which is why most free horoscopes skip it. Calculate your full chart to see yours, along with your tenth and second houses.",
      label: "find my midheaven",
      href: "/chart",
    },
    faqs: [
      {
        question: "What does the midheaven mean in astrology?",
        answer:
          "It is the point at the top of your birth chart, describing your public role, reputation and what you want to be known for professionally.",
      },
      {
        question: "Do I need my birth time to find my midheaven?",
        answer:
          "Yes. The midheaven is calculated from your exact birth time and location, and it changes throughout the day, so an estimated time will usually give the wrong answer.",
      },
      {
        question: "Which house rules money?",
        answer:
          "The second house governs your own earned income and self-worth. The eighth house covers shared resources such as investments, debt and inheritance.",
      },
    ],
    related: ["north-node-and-life-purpose", "what-is-a-birth-chart", "how-to-read-your-birth-chart"],
  },
  {
    slug: "north-node-and-life-purpose",
    title: "Your North Node and the Direction You Are Growing In",
    metaTitle: "North Node Meaning: Your Growth Direction and Life Purpose",
    description:
      "The north node describes the direction you are evolving in, and the south node describes what you already mastered. Here is how to read the axis properly.",
    category: "birth-chart",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readingMinutes: 7,
    excerpt:
      "The growth end of your chart, and the comfort zone it is asking you to build beyond. Always read as one axis, never alone.",
    intro: [
      "Your north node describes the direction you are growing in: the qualities you have not practised yet and the experiences you have not collected yet. Your south node, sitting exactly opposite, describes what already comes naturally.",
      "They are two ends of one axis and cannot be read separately. Any reading that discusses your north node without mentioning your south node is only telling you half of it.",
    ],
    sections: [
      {
        heading: "The nodes are not planets",
        body: [
          "The lunar nodes are mathematical points, the two places where the moon's orbit crosses the path the sun appears to travel. Because they are opposite ends of the same line, they always sit exactly across the chart from each other and always move together.",
          "They also travel backwards through the zodiac, and they change sign roughly every eighteen months. That is why a nodal shift is treated as a significant collective event rather than routine weather.",
        ],
      },
      {
        heading: "Why the north node feels uncomfortable",
        body: [
          "A north node direction rarely feels natural, and it is not supposed to. It describes territory you have not covered yet, so it feels unfamiliar in exactly the way a new language feels unfamiliar, unpractised rather than wrong.",
          "That discomfort is the most misread signal in the whole chart. People take it as evidence they have chosen incorrectly, when it is simply the sensation of doing something for the first time.",
        ],
      },
      {
        heading: "The south node is not the villain",
        body: [
          "The south node holds genuine wisdom and real, hard-won strengths, and none of it is being taken away from you. The only difficulty with it is that it is comfortable, so it is very easy to stay there long after it has stopped growing you.",
          "The work is never to abandon your south node. It is to carry its skills forward deliberately while choosing the north node direction when the two of them pull in opposite ways. Keep the strength, drop the reflex.",
        ],
      },
      {
        heading: "Reading your own nodal axis",
        body: [
          "Find the sign and house of your north node in [your birth chart](/chart), then read the exact opposite sign and house as your south node. The sign describes the quality you are developing, and the house describes the area of life you will be developing it in.",
          "The most useful question is not what your north node means in the abstract. It is which of the two ends you reach for automatically when something is genuinely at stake, because that is where the pattern actually lives.",
        ],
      },
    ],
    cta: {
      heading: "Go deeper than the theory",
      body: "Knowing what the nodes are is one thing. Seeing your own axis read in full, by sign and house, and updated every time the sky shifts, is what MY SZN is built for.",
      label: "see the membership",
      href: "/membership",
    },
    faqs: [
      {
        question: "What does the north node mean in astrology?",
        answer:
          "It describes your growth direction, the qualities and experiences you are evolving towards. It sits exactly opposite your south node, which describes what already comes naturally to you.",
      },
      {
        question: "Should I ignore my south node?",
        answer:
          "No. The south node holds real strengths you keep. What you are outgrowing is the reflex of reaching for it automatically, not the ability itself.",
      },
      {
        question: "How often do the nodes change signs?",
        answer:
          "Roughly every eighteen months, and they move backwards through the zodiac, so a nodal shift always enters a new sign at its final degree.",
      },
    ],
    related: ["what-is-a-birth-chart", "midheaven-and-career", "how-to-read-your-birth-chart"],
  },
  {
    slug: "new-moon-vs-full-moon",
    title: "New Moon vs Full Moon: What Each One Is Actually For",
    metaTitle: "New Moon vs Full Moon: Meaning and How to Work With Each",
    description:
      "New moons are for starting and full moons are for seeing clearly and completing. Here is what each phase means and how to use them without the pressure.",
    category: "moon-transits",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-28",
    readingMinutes: 5,
    excerpt:
      "One is for planting, the other is for harvesting and seeing what is really there. How to work with both without turning it into homework.",
    intro: [
      "A new moon is the start of the lunar cycle, and it is traditionally used for beginnings: setting intentions, starting things, planting something you intend to grow. A full moon sits at the midpoint, and it is used for seeing clearly, completing things, and releasing what is not working.",
      "The cycle runs roughly twenty nine and a half days, which gives you about two useful timing markers a month.",
    ],
    sections: [
      {
        heading: "What a new moon is for",
        body: [
          "At a new moon the sun and moon are in the same sign, and the sky is at its darkest. Nothing is visible yet, which is precisely the point: it is the part of the cycle where things begin before there is anything to show.",
          "Practically, it is a good moment to name what you are actually calling in, and to start rather than to plan. The sign the new moon falls in tells you the flavour, and [the house it falls in your chart](/blog/how-to-read-your-birth-chart) tells you the area of life it is most relevant to.",
        ],
      },
      {
        heading: "What a full moon is for",
        body: [
          "At a full moon the sun and moon sit opposite each other, and the moon is fully lit. Things become visible, including things you have been managing not to look at directly.",
          "This is why full moons have a reputation for emotional intensity. They are less about drama and more about clarity arriving whether or not you asked for it. Useful for finishing, deciding, and letting go of what the light has just made obvious.",
        ],
      },
      {
        heading: "Eclipses are a different category",
        body: [
          "An eclipse is a new or full moon that lands close to the lunar nodes, and it behaves differently. Eclipses tend to move things without much consultation: doors open or close on their own timing rather than yours.",
          "The standard advice is not to force decisions directly on an eclipse, and to give it a few weeks for the actual shape of the change to become clear.",
        ],
      },
      {
        heading: "Working with the cycle without the pressure",
        body: [
          "Lunar cycles are a rhythm, not a productivity system. Nobody needs a ritual every fortnight, and treating each phase as an obligation is a fast route to resenting the whole thing.",
          "The genuinely useful version is lighter: use new moons to start and full moons to review. Twice a month, a marker to check whether you are still pointed at what you said you wanted.",
        ],
      },
    ],
    cta: {
      heading: "Every moon, read for your chart",
      body: "A new moon in Leo lands somewhere specific in your chart, and that is what decides what it is actually asking of you. Inside MY SZN, every lunation is read against your own placements.",
      label: "see the membership",
      href: "/membership",
    },
    faqs: [
      {
        question: "What is the difference between a new moon and a full moon?",
        answer:
          "A new moon begins the lunar cycle and is used for starting things and setting intentions. A full moon sits at the midpoint, brings things to light, and is used for completing and releasing.",
      },
      {
        question: "How often do new and full moons happen?",
        answer:
          "The full cycle takes about twenty nine and a half days, so there is roughly one new moon and one full moon each month.",
      },
      {
        question: "Why do eclipses feel more intense?",
        answer:
          "Eclipses are new or full moons landing near the lunar nodes, which are tied to growth and change. They tend to move things on their own timing rather than waiting for you to decide.",
      },
    ],
    related: ["how-to-read-your-birth-chart", "north-node-and-life-purpose", "what-is-a-birth-chart"],
  },
];

// ---------------------------------------------------------------------------
// Lookups. Kept here so pages never reach into the arrays directly and every
// caller gets the same sorting, which is what stops the hub and the category
// pages disagreeing about which post is newest.
// ---------------------------------------------------------------------------

export function allPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function postBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function postsInCategory(category: CategorySlug): BlogPost[] {
  return allPosts().filter((p) => p.category === category);
}

export function categoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

/** Categories that actually have posts, so the hub never renders an empty section. */
export function populatedCategories(): BlogCategory[] {
  return BLOG_CATEGORIES.filter((c) => postsInCategory(c.slug).length > 0);
}

export function relatedPosts(post: BlogPost): BlogPost[] {
  return post.related
    .map((slug) => postBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p) && p!.slug !== post.slug);
}

// Body paragraphs may contain markdown-style links, e.g. "[your free birth chart](/chart)". Kept
// deliberately tiny rather than pulling in a markdown renderer: the only thing the body needs
// beyond plain text is a link, and inline links to related posts and to /chart are what turn a
// stack of articles into a section that actually passes authority around.
export type ProseNode = { text: string } | { text: string; href: string };

export function parseProse(paragraph: string): ProseNode[] {
  const nodes: ProseNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(paragraph)) !== null) {
    if (m.index > last) nodes.push({ text: paragraph.slice(last, m.index) });
    nodes.push({ text: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < paragraph.length) nodes.push({ text: paragraph.slice(last) });
  return nodes;
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
