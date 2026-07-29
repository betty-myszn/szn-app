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
  /** Optional sub-entries rendered as h3s, e.g. one per zodiac sign inside a single section. Keeps
   *  a long reference list semantically nested under its h2 rather than flattening 12 more h2s
   *  into the page. */
  items?: { name: string; body: string }[];
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
    slug: "full-moon-in-aquarius-2026",
    title: "Full Moon in Aquarius 2026: What It Means for Every Sign",
    metaTitle: "Full Moon in Aquarius 2026: What It Means for Your Sign",
    description:
      "The Aquarius full moon on 29 July 2026 lights up what you have been carrying alone. Here is what it means, what to do with it, and how it lands for all 12 signs.",
    category: "moon-transits",
    publishedAt: "2026-07-29",
    updatedAt: "2026-07-29",
    readingMinutes: 8,
    excerpt:
      "The Aquarius full moon arrives with the nodes freshly on the Leo and Aquarius axis. What it means, and how it lands for every sign.",
    intro: [
      "The full moon in Aquarius falls on 29 July 2026, at 6 degrees of Aquarius, opposite the Sun in Leo. A full moon is the peak of the lunar cycle, the point where the Moon is fully lit and things become visible whether or not you went looking for them. This one is asking about the space between who you are and who you are to everybody else.",
      "It carries extra weight this year because the lunar nodes have just moved onto the Leo and Aquarius axis, the same line this full moon is sitting on. That makes it less of a routine monthly marker and more of an early, loud signal of the eighteen month story now beginning.",
    ],
    sections: [
      {
        heading: "What a full moon in Aquarius actually does",
        body: [
          "Every full moon puts the Sun and Moon in opposite signs, so it always reads as a tension between two things that both want something. Here it is Leo and Aquarius: the individual and the collective, being adored and being useful, your own name and everybody else's.",
          "Aquarius is the sign of the group, the network, the system and the future. When the Moon is full here, what tends to surface is everything you have been feeling about where you belong. Friendships get clarified. Group dynamics that have quietly stopped working become impossible to keep ignoring. The distance between the version of you a community expects and the version you actually are becomes visible.",
          "The Leo side matters just as much, because that is where the Sun is. Something in you wants to be seen as yourself, not as a function of the group. This full moon is where those two needs stop coexisting politely and ask to be reconciled.",
        ],
      },
      {
        heading: "Why this one is bigger than usual",
        body: [
          "The lunar nodes shifted onto the Leo and Aquarius axis just days ago, which means the collective growth direction for the next eighteen months runs along exactly the line this full moon is illuminating. A full moon on a fresh nodal axis works like an opening statement.",
          "It sits at 6 degrees, early in the sign, which tends to feel raw and unfiltered rather than refined. Expect the themes to arrive as feeling first and understanding later.",
          "Practically, this is a good moment to notice what comes up rather than to act on all of it immediately. Full moons show you the situation. They are rarely the best moment to make the irreversible decision about it.",
        ],
      },
      {
        heading: "What to do with it",
        body: [
          "Look at what became visible in the two or three days around it, because that is the actual message. A friendship that suddenly feels one-sided, a group you have outgrown, a piece of work you have been hiding, a want you have been embarrassed by.",
          "Full moons are for completing and releasing rather than starting. If something has been overdue to end, this is the window where ending it feels less like a decision and more like an acknowledgement. If something has been building, this is where it becomes undeniable.",
          "The Aquarius instruction underneath all of it is fairly plain: stop editing yourself down to stay acceptable to a room you have already outgrown.",
        ],
      },
      {
        heading: "What the Aquarius full moon means for every sign",
        body: [
          "Read for your rising sign first, because that is what determines which house this full moon actually lands in. If you do not know it, read for your sun sign.",
        ],
        items: [
          { name: "Aries", body: "This lands in your house of friendship, community and the future. Expect clarity about which people are genuinely walking towards the same thing as you. A group, a network or a long-held ambition reaches a point of honesty. Something about who you spend your energy on is asking to change." },
          { name: "Taurus", body: "This lands at the very top of your chart, in your house of career and public life. What you are known for, and whether it still matches who you are, becomes visible. A professional situation reaches a conclusion, or your ambition finally says what it actually wants out loud." },
          { name: "Gemini", body: "This lands in your house of belief, study and the wider world. Something you have believed for a long time is asking to be updated. Travel, a course, a publishing or teaching opportunity, or a genuine change of mind. Your perspective widens, sometimes uncomfortably." },
          { name: "Cancer", body: "This lands in your house of intimacy, shared resources and what is under the surface. Money you share with someone, a debt, an investment, or an emotional truth you have been managing rather than saying. Depth is the whole assignment here, and avoiding it costs more than facing it." },
          { name: "Leo", body: "This lands squarely in your house of partnership, with the Sun in your own sign opposite it. The tension between what you need and what someone close to you needs is fully lit. A relationship, business partnership or one-to-one dynamic reaches a point of clarity that has been coming for a while." },
          { name: "Virgo", body: "This lands in your house of daily routine, work and health. The way you have been living day to day gets audited. A job, a habit, a workload or a health pattern reaches the point where it either changes or breaks. Small, practical adjustments matter more than dramatic ones." },
          { name: "Libra", body: "This lands in your house of creativity, romance and joy. What genuinely delights you becomes visible, along with how long you have been postponing it. A creative project, a romance, or the simple question of whether your life currently contains any pleasure that is not productive." },
          { name: "Scorpio", body: "This lands at the base of your chart, in your house of home, family and roots. Something about where you live, or the family patterns you carry, comes to light. This one is felt privately before it is understood. Foundations are the theme, both literal and emotional." },
          { name: "Sagittarius", body: "This lands in your house of voice, ideas and everyday communication. Something you have been sitting on wants to be said or published. Conversations land differently now, and the thing you have been drafting privately is ready to be heard by somebody else." },
          { name: "Capricorn", body: "This lands in your house of money, values and self-worth. Your income, your rates or your sense of what you deserve reaches a point of clarity. This is often where undercharging becomes impossible to keep justifying, and where you see what you actually value." },
          { name: "Aquarius", body: "This is your full moon, landing in your own sign and your house of identity. You see yourself clearly, which is both the gift and the difficulty. Something about how you present, what you are called, or who you have been performing as reaches its natural conclusion. A genuine reset of self." },
          { name: "Pisces", body: "This lands in your most private house, the one of rest, endings and the inner world. This is a quiet full moon for you rather than a loud one. Something is finishing beneath the surface, and the useful response is rest and reflection rather than action. Pay attention to your dreams this week." },
        ],
      },
    ],
    cta: {
      heading: "See exactly where this full moon lands in your chart",
      body: "Reading for your sign is the general version. Your birth chart shows the exact house this full moon is lighting up, which is what turns a horoscope into something you can actually act on.",
      label: "get your free birth chart",
      href: "/chart",
    },
    faqs: [
      {
        question: "When is the full moon in Aquarius 2026?",
        answer:
          "It is exact on 29 July 2026, at 6 degrees of Aquarius, with the Sun opposite in Leo. Its effects are generally felt across the two or three days either side.",
      },
      {
        question: "What does a full moon in Aquarius mean?",
        answer:
          "It highlights the tension between the individual and the collective: being seen as yourself versus belonging to a group. Friendships, communities and your sense of where you fit tend to become clear.",
      },
      {
        question: "Why is this full moon more significant than usual?",
        answer:
          "Because the lunar nodes have just moved onto the Leo and Aquarius axis, so this full moon sits on the same line as the collective growth direction for the next eighteen months.",
      },
      {
        question: "Should I read for my sun sign or rising sign?",
        answer:
          "Rising sign first, because it determines which house of your chart the full moon actually falls in. Your sun sign works as a second read if you do not know your birth time.",
      },
      {
        question: "What should I do on a full moon?",
        answer:
          "Full moons are for completing, deciding and releasing rather than starting. Notice what becomes visible in the days around it, since that is usually the real message, and leave the biggest irreversible decisions until just after.",
      },
    ],
    related: ["new-moon-vs-full-moon", "north-node-and-life-purpose", "leo-season-2026"],
  },
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
    title: "Your Big Three: Sun, Moon and Rising Signs Explained",
    metaTitle: "Sun, Moon and Rising Signs Explained: Understanding Your Big Three Birth Chart Placements",
    description:
      "Discover what your sun, moon and rising signs really mean, why they are the foundation of your birth chart, and how understanding your big three can completely transform the way you understand yourself.",
    category: "birth-chart",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-29",
    readingMinutes: 9,
    excerpt:
      "Identity, emotional world and first impressions. What your sun, moon and rising each govern, why they can feel like three different people, and how they work together as one.",
    intro: [
      "If you have ever downloaded your birth chart, looked at the colourful wheel full of symbols and immediately felt overwhelmed, you are in very good company, because almost everyone starts in exactly the same place. One minute you think astrology is simply about knowing you are a Libra or a Capricorn, and the next you are looking at planets, houses, degrees, aspects and symbols in what feels like an entirely different language.",
      "The good news is you do not need to understand your whole [birth chart](/blog/what-is-a-birth-chart) overnight. Every experienced astrologer starts in the same place, with your big three: your sun sign, your moon sign and your rising sign. Together they describe who you are beneath the expectations you have picked up throughout life, what you need emotionally in order to thrive, and the energy other people instinctively feel when they meet you.",
      "The mistake many people make is believing their sun sign is their entire personality, which is exactly why so many eventually decide astrology does not fit them. Reducing yourself to one zodiac sign is a little like describing an entire city by looking at a single street. It gives you a glimpse, but it misses almost everything that makes the place unique.",
    ],
    sections: [
      {
        heading: "Why they are called your big three",
        body: [
          "Your birth chart contains far more than three placements. Every planet sits in a zodiac sign, every planet falls into one of the twelve houses, and every planet forms mathematical relationships with the others through aspects, creating a detailed blueprint of your strengths, your challenges, your purpose and the themes you meet throughout your lifetime.",
          "You also have your midheaven, which speaks to your public life and career, your north node, which points towards where your soul is growing, your south node, which reveals old patterns you are here to outgrow, and Chiron, which highlights your deepest wound and greatest gift, alongside asteroids, progressions and current transits that keep shaping your experience.",
          "There is a reason almost every astrologer begins with the big three: these three placements influence nearly every experience you have. Your sun describes your identity. Your moon describes your emotional landscape. Your rising describes how you move through the world.",
          "Once you understand those three pieces, the rest of your chart begins fitting together like a puzzle that finally makes sense. Instead of a collection of disconnected placements, you start recognising how each one supports, challenges or strengthens another part of your personality.",
        ],
      },
      {
        heading: "Your sun sign: the woman you are continually becoming",
        body: [
          "Your sun sign is the placement most people already know, because it is set by your date of birth and forms the basis of newspaper horoscopes. The sun represents your identity, your life force, your purpose, your confidence, your vitality and the qualities your soul keeps encouraging you to develop.",
          "One of the biggest misconceptions is that your sun sign perfectly describes who you already are. In reality, your sun often represents who you are growing into. Think back to who you were at eighteen compared with today, more confident expressing yourself, clearer on what genuinely matters, less interested in becoming the version other people expected. That is your sun beginning to shine more brightly.",
          "The sun is not interested in helping you fit in, it is interested in helping you become authentic. A Leo sun is not simply here to enjoy attention, they are learning to express their creativity without apologising for taking up space. A Virgo sun is not here to be endlessly productive, they are learning to refine their gifts so they genuinely improve the lives of others. A Pisces sun is not simply emotional, they are here to develop compassion and intuition while learning where healthy boundaries matter as much as kindness.",
          "This is also why people often feel more connected to their sun sign as they move into their thirties and forties. With every year that passes, we strip away more conditioning, release identities that no longer fit, and grow more comfortable expressing the qualities our sun has quietly been encouraging all along.",
        ],
      },
      {
        heading: "Your moon sign: the emotional blueprint nobody else can see",
        body: [
          "While your sun represents the conscious part of your personality, your moon governs the deeply personal emotional world that usually stays hidden beneath the surface. It describes your instincts, your subconscious habits, your emotional needs, your inner child and the things that help you feel safe when life becomes uncertain.",
          "If your sun is the version of yourself you confidently introduce to the world, your moon is the person sitting quietly at home after everyone else has gone. It becomes most visible under stress: the part of you that decides whether you reach out for support or pull away, whether you need conversation or solitude, whether you process emotions immediately or carry them quietly for weeks before talking about them.",
          "A Cancer moon may naturally seek comfort through family, familiar spaces and emotional connection. A Gemini moon often processes emotions by talking them through. An Aquarius moon might need space before opening up, processing feelings through observation and perspective. A Scorpio moon often feels everything with extraordinary intensity while revealing very little on the surface. None of these is healthier than another, they are simply different emotional languages.",
          "Once you understand your moon sign, you stop trying to regulate your nervous system in ways designed for somebody else, and start building a life that genuinely supports how you are wired. That usually leads to healthier relationships, stronger boundaries and a much deeper sense of emotional self trust.",
        ],
      },
      {
        heading: "Your rising sign: the lens your whole life unfolds through",
        body: [
          "Your rising sign, also known as your ascendant, is one of the most fascinating and important placements in your chart, and unlike your sun sign it needs your exact birth time to calculate accurately. It was the sign rising over the eastern horizon at the exact moment you took your first breath, long viewed as the beginning of your unique relationship with the world around you.",
          "People often hear the rising sign is about first impressions, and that is true, it shapes your natural body language, your personal style, the energy you radiate and how you approach unfamiliar environments. A Leo rising may appear confident and charismatic before they have even introduced themselves. A Capricorn rising often gives an impression of maturity and competence, even young. A Libra rising frequently comes across as approachable, charming and socially aware.",
          "But your rising sign goes much deeper than appearances, because it sets the framework for your entire chart. The ascendant determines where every single house begins, which means it decides which area of life every planet operates through. Your career, relationships, finances, friendships, family and creativity are all interpreted through the structure your rising sign creates.",
          "This is why two people can both be Libra suns yet live completely different lives. One person's Libra sun may fall in the tenth house of career and public recognition, while another's activates the fourth house of home and emotional foundations. The sun is the same, the expression is completely different. That is the power of the rising sign.",
        ],
      },
      {
        heading: "When your big three seem to contradict each other",
        body: [
          "One of the most reassuring things to discover is that you were never supposed to feel like just one zodiac sign. Human beings are wonderfully complex, and your big three often explain why you have felt pulled in different directions throughout your life.",
          "You might have an Aries sun constantly dreaming up new ideas, a Pisces moon that feels deeply sensitive beneath the surface, and a Virgo rising that carefully analyses every decision before acting. Or a Capricorn sun that is incredibly ambitious, a Sagittarius moon that needs freedom and adventure, and a Cancer rising that quietly nurtures everyone around them first. These placements are not competing, they are collaborating.",
          "Different parts of your personality naturally step forward in different situations. Your rising sign often takes the lead when you meet new people or step into unfamiliar environments. Your moon becomes more visible in intimate relationships and emotionally vulnerable moments. Your sun gradually grows stronger as you build confidence and move towards the person you are here to become.",
          "Learning to recognise which part of yourself is leading at any given moment creates an extraordinary level of self awareness, because you stop expecting every part of your personality to behave the same way all the time.",
        ],
      },
      {
        heading: "Your big three are only the beginning of your story",
        body: [
          "Understanding your sun, moon and rising signs will completely change the way you see yourself, and they are still only the opening chapter of a rich and beautifully detailed chart. Your Mercury explains how you communicate, think and learn. Your Venus reveals how you experience love, beauty, relationships and even money. Your Mars shows how you pursue your goals. Your Jupiter highlights where opportunity and abundance naturally flow. Your Saturn reveals the lessons that ultimately become your greatest strengths.",
          "Your north node points towards the future your soul is growing into, while your south node reveals the patterns you are gently being encouraged to release. Then come the houses, aspects, progressions and transits, which explain why different seasons of your life activate different parts of you, and why certain years feel completely transformative while others are quieter periods of integration.",
          "This is why astrology is so much more than personality typing. Done properly, it is a roadmap for understanding yourself with greater compassion, making decisions that genuinely align with who you are, and recognising the timing of your life instead of constantly fighting against it.",
        ],
      },
    ],
    cta: {
      heading: "Discover your own big three inside MY SZN",
      body: "Reading about your sun, moon and rising signs is a brilliant place to begin, but seeing how those placements interact inside your own birth chart is where astrology truly comes alive. MY SZN is built around your exact birth details, with personalised insight into your big three, your houses, your money, your relationships, your purpose, your confidence and the transits shaping your life right now, plus live seasonal coaching workshops and a community of women stepping into their next chapter together.",
      label: "explore MY SZN",
      href: "/membership",
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
    metaTitle: "How to Read Your Birth Chart Step by Step: A Beginner's Guide",
    description:
      "Learn how to read your birth chart in five clear steps, from your sun, moon and rising signs to houses, aspects, repeating patterns and current transits.",
    category: "birth-chart",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-29",
    readingMinutes: 8,
    excerpt:
      "The order to read a chart in, in five layers, so you build a real picture instead of drowning in symbols on the very first look.",
    intro: [
      "Most people open their birth chart, stare at it for a few minutes and quietly close the tab, because they are trying to understand every symbol, planet, house, aspect, degree and sign at exactly the same time. A chart holds dozens of pieces of information, and given equal attention from the start they seem to contradict one another until the whole thing feels more confusing than useful.",
      "You might read that your sun makes you confident, your moon makes you private, your rising makes you appear calm and your Mars suggests you act impulsively, then wonder which one is the real you. They are all describing different functions within the same person, and the way to see how they fit is to read the chart in the right order.",
      "The easiest way to read a chart is in layers. Start with your big three, move into the houses, explore the aspects between your planets, find the themes that repeat, and only then look at timing through transits. Each layer refines the one before it rather than replacing it.",
    ],
    sections: [
      {
        heading: "Before you begin: what your birth chart actually shows",
        body: [
          "Your birth chart is a map of the sky at the exact moment and place of your birth, showing where the sun, moon and planets sat across the twelve zodiac signs and twelve houses. It also shows the angles those planets made to one another, known as aspects, which tell you whether different parts of your personality work together naturally or create a tension that asks for growth.",
          "There is a simple formula underneath all of it. The planets describe what part of you is operating. The signs describe how that energy behaves. The houses describe where in your life it shows up. The aspects describe how those parts interact with one another.",
          "Venus, for example, represents love, attraction, values, beauty and receiving, but Venus in Aries expresses those themes very differently from Venus in Pisces. In the tenth house, Venus may tie relationships and values closely to career and public identity, while in the fourth house it may pour that same energy into beauty, comfort and emotional security at home.",
          "Once you understand this formula, a chart stops being intimidating, because you are no longer memorising hundreds of disconnected meanings. You are learning to combine four simple layers into one clear interpretation.",
        ],
      },
      {
        heading: "Step one: begin with your big three",
        body: [
          "Start by finding your sun sign, moon sign and rising sign, often called [your big three](/blog/big-three-sun-moon-rising) because they describe the broadest and most recognisable layers of your personality. Your sun is your core identity, confidence and purpose. Your moon is your emotional needs, instincts and what helps you feel safe. Your rising, or ascendant, is the energy you bring into new situations and the lens the rest of your chart operates through.",
          "Rather than reading these as three separate horoscopes, combine them into one sentence. You might be a Libra sun who wants harmony and meaningful connection, with an Aquarius moon that needs independence and breathing room, while a Leo rising makes you appear expressive and comfortable with attention you may privately not feel.",
          "That single sentence already tells you more than any one sign could on its own, because it shows the difference between your conscious identity, your private emotional world and the energy people meet first. It also explains why you might identify strongly with some parts of your sun sign and feel disconnected from others: a sensitive water moon can soften a bold fire sun, and an earth rising can make an imaginative air sun look far more practical and reserved. You do not need to force your big three into one perfectly consistent personality, because people are not perfectly consistent. The goal is to see which part of you tends to lead in different situations.",
        ],
      },
      {
        heading: "Step two: find which houses your planets sit in",
        body: [
          "Once you have the broad shape, look at which house each planet sits in. The houses divide the chart into twelve areas of life, from identity, money and communication to home, relationships, career and spirituality. The planet tells you which energy is involved, the house tells you where it becomes most active.",
          "Mars in the second house may drive you to earn, build independence and defend your values, while Mars in the seventh brings that same intensity into relationships and conflict. Jupiter in the tenth may expand career and visibility, while Jupiter in the fourth may bring growth through family, property and building a home that genuinely supports you.",
          "This is often where people have their first real moment of recognition, because house placements explain why some areas of life carry far more energy and drama than others. Several planets clustered in one house, sometimes called a stellium, tell you that area carries disproportionate importance and will keep returning as a theme, whether you choose it or life keeps placing it in front of you.",
          "Do not panic about empty houses. An empty house does not mean that area will never matter. It simply has no natal planets permanently emphasising it, so you read the sign on the house cusp and then find that sign's ruling planet elsewhere in the chart for the rest of the story.",
        ],
      },
      {
        heading: "Step three: understand the aspects between your planets",
        body: [
          "Once you know your planets, their signs and their houses, look at the aspects between them, the angles they form. Aspects describe how the different parts of your personality communicate, cooperate, compete or create pressure.",
          "A conjunction sits two planets close together, blending their functions so tightly they can be hard to separate. A trine shows energy flowing easily, creating natural talents you may barely notice. A sextile also supports cooperation, though it usually asks for more conscious effort before its opportunities pay off. Squares and oppositions create more friction: a square puts two functions at an uncomfortable angle, while an opposition pulls between two sides of the chart, often surfacing through relationships.",
          "Hard aspects are not punishments and they do not mean you are doomed to struggle. They show the parts of you that need more awareness and active development, which is exactly why they so often become sources of strength. A Mercury square can bring early challenges with communication and then produce someone unusually precise and powerful with language. A Mars square can bring frustration and then generate enormous determination, because some part of you refuses to leave the tension unresolved.",
          "Easy aspects describe abilities you take for granted. Harder aspects describe where you have built skill, resilience and self awareness. Both matter, and neither should be read in isolation from the rest of the chart.",
        ],
      },
      {
        heading: "Step four: look for the patterns that repeat",
        body: [
          "This is the step that separates reading a chart from listing one, because an accurate interpretation depends on noticing which themes appear again and again, and giving those more weight than isolated details.",
          "Start with the balance of elements. Fire brings action, confidence and instinct. Earth brings practicality, patience and a focus on tangible results. Air brings thought, communication and perspective. Water brings emotion, intuition and depth. A chart heavy in one element leans naturally on that mode, while a missing element often describes something you develop more consciously or seek through relationships.",
          "Then look at the modalities. Cardinal signs initiate, fixed signs sustain, mutable signs adapt. A heavily cardinal chart may start endless projects but struggle to maintain them, strong fixed energy may have staying power but resist necessary change, and a mutable chart may adapt beautifully while finding it hard to commit to one direction.",
          "Then look for repetition across everything: repeated signs, several planets in one house, multiple planets ruled by the same planet, recurring themes across your big three, houses and aspects. If communication shows up through a Gemini moon, Mercury on the ascendant, several third house planets and a strong Mercury aspect, communication is no longer a small detail, it is one of the chart's headlines. Anything the chart says three different ways deserves serious attention, while something that appears once is supporting detail. The chart has a hierarchy, and repetition shows you what sits near the top.",
        ],
      },
      {
        heading: "Step five: check the timing through transits",
        body: [
          "Your natal chart never changes, because it records the exact sky you were born under, but the planets keep moving and forming new relationships with your placements. Those ongoing movements are transits, and they are what turn astrology from personality description into timing.",
          "A transit activates part of your natal chart for a period, bringing certain themes closer to the surface. The [moon](/blog/new-moon-vs-full-moon) may activate a placement for a few hours, while Saturn, Uranus, Neptune or Pluto can influence one area for months or years. That difference in speed matters: a short lunar transit may colour a single day, while Saturn crossing your sun, moon, ascendant or midheaven can mark a much larger period of restructuring and maturity.",
          "When reading a transit, start with which natal planet or house is being activated, then consider the transiting planet and the aspect it is making. Jupiter crossing your tenth house may bring expansion and opportunity around career, while Saturn through the same area may ask for commitment, patience and stronger foundations. Neither is automatically good or bad, the value is in understanding the energy present and responding to it consciously.",
          "This is where astrology becomes genuinely practical, because you stop expecting every week to produce the same results. Some periods support launching and visibility, others are better for reviewing, repairing, resting or finishing what is already in motion. Your chart is the blueprint, transits show which room currently has all the lights switched on.",
        ],
      },
      {
        heading: "How to bring everything together",
        body: [
          "Once you have moved through all five steps, resist the urge to write a paragraph about every placement. Summarise instead, using a few central themes that reflect the patterns you found. Begin with the big three and the relationship between identity, emotions and presentation. Add the most occupied houses to show where your energy concentrates. Include the strongest aspects for the major internal dynamics, then name any repeated signs, elements, planets or topics.",
          "A useful interpretation might sound like this: this is someone who appears confident and expressive but privately needs independence and emotional space, whose career, visibility and communication are major life themes, with a strong Saturn pattern showing that confidence is built through discipline, patience and learning to trust their own authority.",
          "That summary might come from ten or fifteen placements, but it brings them into something you can actually use. A good chart reading helps you see the pattern beneath the detail, it should not leave you with forty disconnected labels and a bigger identity crisis than the one you started with.",
        ],
      },
      {
        heading: "Read your chart inside MY SZN",
        body: [
          "Learning to read your own chart can change how you understand your personality, relationships, money, career and emotional patterns, but most people still reach a point where they know the individual meanings and cannot see how it all fits together. That is where personalised astrology becomes far more useful than another generic list of placements.",
          "Inside [MY SZN](/membership), the platform is built around your own birth chart, helping you understand your big three, house placements, money patterns, relationships, confidence, purpose and current transits without decoding the whole thing alone. You also get seasonal guidance, live coaching workshops and practical support for using your chart when you make decisions and build your future. Your chart is not a collection of random labels, it is a complete system, and once you can read the pattern you start seeing yourself with a clarity that changes everything.",
        ],
      },
    ],
    cta: {
      heading: "Read along with your own chart",
      body: "This process is dramatically easier with your chart open in front of you than in the abstract. Calculate yours free, then work through the five steps above using your own placements, writing down your big three first and marking any house with several planets in it.",
      label: "calculate my chart",
      href: "/chart",
    },
    faqs: [
      {
        question: "What order should I read a birth chart in?",
        answer:
          "Begin with your sun, moon and rising signs, then look at the house placement of each planet before moving into aspects, repeated themes and current transits. Reading in layers gives each new piece of information a clear context and stops smaller details overwhelming the main story.",
      },
      {
        question: "Are hard aspects like squares and oppositions bad?",
        answer:
          "Squares and oppositions create friction, but friction often produces growth, determination and highly developed skills. These aspects usually describe the areas you have had to work on most consciously, which is why they frequently become some of your greatest strengths later in life.",
      },
      {
        question: "What does it mean if I have several planets in one house?",
        answer:
          "A cluster of planets in one house means that area of life carries a great deal of your attention, energy and personal development. The themes of that house are likely to appear repeatedly and may become central to your purpose, challenges or major life decisions.",
      },
      {
        question: "Is an empty house a bad sign?",
        answer:
          "No. An empty house does not mean nothing will happen in that area of life. You interpret it through the zodiac sign on the house cusp, the location of that sign's ruling planet, and any transits moving through the house over time.",
      },
      {
        question: "Do I need an exact birth time?",
        answer:
          "An accurate birth time matters most for your rising sign and house placements, because both can change considerably through the day. You can still learn from your planetary signs without a birth time, but you lose much of the chart's structure and personal detail.",
      },
      {
        question: "How long does it take to learn to read a birth chart?",
        answer:
          "You can start reading your own chart usefully within a few focused hours, especially when you follow a clear order instead of memorising everything at once. Reading other people's charts fluently takes longer, because interpretation needs practice, pattern recognition and the ability to read someone without leaning on what you already know about yourself.",
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
        heading: "Venus in every sign, explained",
        body: [
          "Your Venus sign is the how of loving: the way affection comes out of you, and the way you most easily recognise it coming back. Find yours below.",
        ],
        items: [
          { name: "Venus in Aries", body: "You love directly and fast. Attraction hits immediately, you would rather say it than wonder, and the chase genuinely excites you. You need a partner who keeps some spark and independence alive, because the thing that dulls this Venus quickest is a relationship with nothing left to pursue." },
          { name: "Venus in Taurus", body: "You love slowly, physically and loyally. Touch, food, comfort and consistency are how affection registers for you, and you show it by showing up the same way every day. You need steadiness and sensuality, and you struggle badly with hot-and-cold behaviour." },
          { name: "Venus in Gemini", body: "You fall for a mind. Conversation is foreplay, curiosity is affection, and you need to stay interested to stay in love. Variety and mental stimulation keep you engaged, and the fastest way to lose you is to become predictable and stop talking." },
          { name: "Venus in Cancer", body: "You love protectively and emotionally. You nurture the people you care about, you remember everything, and you need to feel safe before you can properly open. You want to be someone's home, and you need reassurance more than you tend to admit." },
          { name: "Venus in Leo", body: "You love wholeheartedly and generously, and you want to be adored back. Romance, effort and being visibly chosen matter to you, and none of that is vanity, it is how you know it is real. You wilt in relationships where affection is quiet, ironic or withheld." },
          { name: "Venus in Virgo", body: "You love through usefulness. You show it in the practical, unglamorous things: the noticed detail, the sorted problem, the way you make someone's life work better. You need appreciation for that effort, and you can be quietly hard on yourself and on the people you love." },
          { name: "Venus in Libra", body: "You love beautifully and fairly. Harmony, courtesy and genuine partnership matter to you, and you are unusually good at making someone feel considered. Your risk is conceding too much to keep the peace, so the growth is saying the true thing before the resentment builds." },
          { name: "Venus in Scorpio", body: "You love intensely and all the way in. Surface-level connection reads as rejection to you, and you want the real, private version of a person. You need loyalty and depth, and you feel betrayal for a long time, so trust is slow and worth everything once given." },
          { name: "Venus in Sagittarius", body: "You love freely and adventurously. You want a partner who is also a co-conspirator, someone to learn with and go places with, literally or otherwise. Space is not rejection for you, it is oxygen, and you disappear from anything that starts feeling like an obligation." },
          { name: "Venus in Capricorn", body: "You love seriously and for the long term. You show affection through commitment, reliability and building something real, and you are not especially interested in anything with no future in it. You can be slow to open, and you value being someone's safe, permanent thing." },
          { name: "Venus in Aquarius", body: "You love as a best friend first. You need mental connection, freedom and a partner who genuinely celebrates the strange parts of you rather than tolerating them. Conventional romance can feel performative to you, and you attach to people who let you stay fully yourself." },
          { name: "Venus in Pisces", body: "You love romantically and boundlessly. You are deeply compassionate, you feel what your partner feels, and you tend to see the best version of someone before they have earned it. Your growth is staying attached to reality while keeping the tenderness, which is the whole gift of this placement." },
        ],
      },
      {
        heading: "Venus in every house, explained",
        body: [
          "If your Venus sign is how you love, the house is where it plays out. This is the piece most Venus descriptions leave out, and it is usually why a sign description alone has never quite landed for you.",
        ],
        items: [
          { name: "Venus in the 1st house", body: "Your charm is part of how you arrive. People read you as warm, attractive or stylish before they know you, and relating is woven into your identity rather than being a separate part of life." },
          { name: "Venus in the 2nd house", body: "Love, money and self-worth are tangled together for you. You value comfort and beauty, you can earn through them, and your sense of being valued is closely tied to what you feel you deserve." },
          { name: "Venus in the 3rd house", body: "You love through words and everyday contact. Flirting, texting, conversation and the small daily exchange are where affection lives, and you tend to fall for how someone communicates." },
          { name: "Venus in the 4th house", body: "You love through home and belonging. A beautiful, peaceful space matters to you, family shapes your idea of love, and what you are ultimately building is somewhere that feels safe." },
          { name: "Venus in the 5th house", body: "You love through romance, play and creativity. Dating, flirtation, art and joy are where this Venus comes alive, and you want being with you to feel genuinely delightful." },
          { name: "Venus in the 6th house", body: "You love through service and routine. Affection shows up in daily acts of care, and you often meet people through work or shared everyday life rather than grand occasions." },
          { name: "Venus in the 7th house", body: "Partnership is the main stage. One-to-one commitment matters enormously to you, you are good at it, and the growth is making sure you exist fully outside the relationship too." },
          { name: "Venus in the 8th house", body: "You love deeply and privately. You want total intimacy and merged lives, including the practical merging of money and resources, and you are not interested in anything shallow." },
          { name: "Venus in the 9th house", body: "You love expansively. You are drawn to people who widen your world, through culture, distance, study or belief, and shared meaning matters more to you than shared logistics." },
          { name: "Venus in the 10th house", body: "Your relationships are somewhat public, and your charm is a genuine professional asset. You may meet partners through work, and you care how a relationship reflects on the life you are building." },
          { name: "Venus in the 11th house", body: "You love through friendship and community. Your closest relationships often start as friendships, you value chosen family, and you want a partner who fits into the future you are heading towards." },
          { name: "Venus in the 12th house", body: "You love quietly and inwardly. This Venus is private, compassionate and sometimes secretive, and the work is letting yourself be seen and loved in the ordinary daylight rather than only imagined." },
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
