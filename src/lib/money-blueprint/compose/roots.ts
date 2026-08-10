/**
 * Money Blueprint — content for the roots chapters.
 *
 * Childhood, Chiron, inherited beliefs. These sections were the thinnest in the first generated
 * report, so the material here is deliberately house-by-house and placement-by-placement rather
 * than sign-only, which is what gives each page enough to say.
 */

// ---------------------------------------------------------------------------- Chiron by house

export interface ChironHouse {
  /** Where the wound was received. */
  scene: string;
  /** How it shows up in adult working life. */
  adult: string;
  /** What it makes you unusually good at. */
  medicine: string;
  /** The specific money consequence. */
  moneyCost: string;
  /** What to charge for. */
  chargeFor: string;
}

export const CHIRON_HOUSE: Record<number, ChironHouse> = {
  1: {
    scene: "in how you were received as a person, before you had done anything at all. Something about your basic presence was met with correction, comparison or indifference.",
    adult: "You manage how you come across before you enter a room, and the management is exhausting in a way you rarely name.",
    medicine: "You can see somebody's real self underneath their presentation almost instantly, because you have spent a lifetime watching the gap between the two.",
    moneyCost: "You lead with the work rather than with yourself, so people buy your output and never quite buy you, which caps the rate permanently.",
    chargeFor: "Anything where you are the product: your judgement, your eye, your presence in the room.",
  },
  2: {
    scene: "around having, owning and being worth something. Either resources were scarce, or they were present and you were made to feel you had no claim on them.",
    adult: "You struggle to say a number out loud without a justification attached, and you feel a flicker of shame around wanting more.",
    medicine: "You understand the emotional architecture of worth better than anybody who never had it questioned.",
    moneyCost: "You price from apology rather than from value, and the gap between what you deliver and what you charge is the widest in your chart.",
    chargeFor: "Helping other people find and hold their own worth, which you can do because you built yours from nothing.",
  },
  3: {
    scene: "in how you spoke and thought as a child. Your questions were inconvenient, your ideas were talked over, or being clever was tolerated rather than delighted in.",
    adult: "You over-prepare and over-explain, and being spoken over lands harder than it rationally should.",
    medicine: "Your language became precise because approximation was never enough to be heard, so you can say difficult things exactly.",
    moneyCost: "You undercharge for your voice and charge properly only for deliverables, which is the wrong way round for your chart.",
    chargeFor: "Your thinking and your language: teaching, writing, consulting, saying the thing nobody else can phrase.",
  },
  4: {
    scene: "in the home itself. Safety was inconsistent, or the emotional weather changed without warning, and you learned to read the room before asking for anything.",
    adult: "You build a base and never quite trust it, and you look after everybody else's security before your own.",
    medicine: "You can create genuine safety for other people, which is a rarer commercial skill than it sounds.",
    moneyCost: "You put everybody else first, defer your own plans, and treat your own needs as an imposition on people who are already stretched.",
    chargeFor: "Work involving belonging, family patterns, foundations and helping somebody feel held.",
  },
  5: {
    scene: "around your joy, your creativity or simply being delighted in. Your shine was met with something other than pleasure, so expressing became risky.",
    adult: "You struggle to make things purely because you want to, and you hedge your creative work with usefulness.",
    medicine: "You give other people permission to enjoy themselves, because you know exactly what it costs to have that taken away.",
    moneyCost: "You suppress the creative offer that would actually sell, because putting it out feels like asking to be delighted in.",
    chargeFor: "Creative direction, and anything that helps somebody express what they have been sitting on.",
  },
  6: {
    scene: "in the daily, the practical and the being-of-use. Being helpful, tidy or correct was the price of approval, so good enough never arrived.",
    adult: "You over-deliver on every job and feel guilty invoicing for the version you agreed.",
    medicine: "Your standard of work is genuinely higher than the market average, and clients feel it immediately.",
    moneyCost: "You bill for the labour rather than the expertise, and refine long past the point anybody is paying for.",
    chargeFor: "Systems, process and craft, priced at expert rates rather than at hourly ones.",
  },
  7: {
    scene: "in early one-to-one relationship. Somebody close was unpredictable, absent or required managing, and you learned that connection had conditions.",
    adult: "You over-accommodate in client relationships and struggle to hold a boundary once somebody is close.",
    medicine: "You read what a person actually needs faster than almost anybody, which makes you exceptional in the room.",
    moneyCost: "Your best clients get your weakest terms, because closeness dissolves the contract in your mind.",
    chargeFor: "One-to-one work, partnership consulting and anything requiring genuine attunement.",
  },
  8: {
    scene: "around power, intimacy and other people's resources. Something was hidden, controlled or taken, and money became bound up with trust.",
    adult: "You keep financial matters private, and you would rather hold all of it than share any of it.",
    medicine: "You can sit with material that would destabilise other practitioners, without flinching and without absorbing it.",
    moneyCost: "Secrecy keeps the fear intact and stops the money circulating, and circulation is exactly how the eighth house grows.",
    chargeFor: "Deep transformational work, and anything involving other people's money, power or the things they cannot say.",
  },
  9: {
    scene: "around belief, meaning or being taken seriously as somebody with a view. Your convictions were dismissed or the belief system around you was rigid.",
    adult: "You defend your position before anybody has challenged it, and you collect credentials you do not need.",
    medicine: "You hold ideas with genuine rigour, because you were never allowed to hold them casually.",
    moneyCost: "You wait to be qualified enough to teach, and the waiting costs you a decade of the income teaching would have brought.",
    chargeFor: "Teaching, publishing, programmes and carrying people toward a bigger view.",
  },
  10: {
    scene: "around achievement, authority and being seen to succeed. Either a great deal was expected, or your ambition was treated as inconvenient.",
    adult: "Public visibility carries a charge, and success arrives with an odd flatness rather than relief.",
    medicine: "You understand the cost of ambition and can guide other people through it honestly.",
    moneyCost: "You cap your own reputation just below the level where you would be genuinely exposed.",
    chargeFor: "Leadership work, positioning and helping capable people take the authority they have earned.",
  },
  11: {
    scene: "in the group. You were slightly outside the circle, and belonging had to be earned by being useful, impressive or needed.",
    adult: "You contribute in order to stay, and being in a room without offering something feels genuinely uncomfortable.",
    medicine: "You build communities where other people feel included, because you know precisely how exclusion feels.",
    moneyCost: "You give free labour to the exact rooms your income depends on, and call it strategy.",
    chargeFor: "Community building, membership work and anything that gives people a place to belong.",
  },
  12: {
    scene: "somewhere unspoken and largely invisible, often before memory. Something in the family was carried rather than said, and you absorbed it.",
    adult: "You do enormous unseen work and struggle to point at what you actually did.",
    medicine: "You perceive what is happening underneath a situation long before it becomes visible to anybody else.",
    moneyCost: "You are systematically under-credited, because the work leaves no visible trace and you do not claim it.",
    chargeFor: "The perception itself: strategy, diagnosis, and naming what a person or business cannot see.",
  },
};

// ---------------------------------------------------------------------------- the childhood home, by 4th house sign

export const FOURTH_HOUSE_HOME: Record<string, string> = {
  Aries: "a home with heat in it. Things were direct, sometimes combative, and conflict arrived fast and cleared fast. You learned to hold your own early, and stillness may still feel slightly unsafe.",
  Taurus: "a home that valued stability and the material. Comfort mattered, change was resisted, and security was measured in things you could touch. You learned that steadiness is love, and that change is a threat to it.",
  Gemini: "a busy, verbal, information-heavy home. There was a lot of talk, possibly a lot of movement, and feelings were discussed rather than felt. You learned to explain yourself rather than be understood.",
  Cancer: "a home where feeling ran everything. Emotional weather changed without warning and you became its barometer. You learned to manage the room, and you are still doing it in client relationships.",
  Leo: "a home where somebody needed to be the centre, and it may not have been you. Warmth was available on the right terms. You learned that being seen has conditions attached.",
  Virgo: "a home that ran on correctness, tidiness and being useful. Standards were high and love came attached to meeting them. You learned that being good enough is a moving target.",
  Libra: "a home that kept the peace on the surface, whatever was happening underneath. Appearances mattered and conflict was avoided. You learned to smooth things over at your own expense.",
  Scorpio: "a home with something unspoken in it. Power, money or a secret sat underneath the ordinary, and you sensed it long before you understood it. You learned to watch, and to keep your own counsel.",
  Sagittarius: "a home with big ideas and possibly big absences. There was belief, travel or philosophy, and less of the ordinary steady presence. You learned to make meaning out of gaps.",
  Capricorn: "a home that ran on responsibility. You grew up early, possibly parenting somebody, and competence was the currency. You learned that rest has to be earned.",
  Aquarius: "a home that was unusual in some way, or where you felt like the odd one. Independence was available and closeness was not. You learned to be self-sufficient and slightly outside.",
  Pisces: "a home with blurred edges. Boundaries were unclear, somebody may have been unwell or absent in spirit, and you absorbed what was in the air. You learned to feel everybody's weather as your own.",
};

// ---------------------------------------------------------------------------- Saturn: where "earn it" landed

export const SATURN_HOUSE_MONEY: Record<number, string> = {
  1: "your right to take up space at all. You have had to earn permission to simply be yourself, which is why presence took decades to feel like something you were allowed.",
  2: "your worth and your income directly. This is the placement of somebody who genuinely believes value must be proven, and who comes into real earning power in the second half of life rather than the first.",
  3: "your voice and your right to be heard. Speaking with authority took years, and you probably still over-prepare before saying something you already know.",
  4: "your sense of home and safety. The base had to be built rather than inherited, and no amount of security ever quite closes the question.",
  5: "your creativity, pleasure and right to enjoy. Play had to be justified, so making something for its own sake still feels faintly irresponsible.",
  6: "your daily work and your body. You have carried more of the workload than was fair, for longer, and stopping still reads as a failure of character.",
  7: "your close relationships and contracts. Partnership arrived with weight and lessons, and you learned to be careful about who you bind yourself to.",
  8: "shared money, intimacy and power. Other people's resources came with conditions or complications, so you learned to keep your own affairs private and controlled.",
  9: "your beliefs and your right to teach. You needed to be more qualified than anybody else in the room before you would speak, which delayed the income teaching brings.",
  10: "your career and public standing. Recognition came late or had to be built brick by brick, and it becomes unshakeable precisely because nothing was handed to you.",
  11: "your place in the group. Belonging had to be earned by being useful, impressive or needed, which is why peer rooms still cost you something to walk into.",
  12: "the unseen. You carry something from before your own memory, often a family burden, and it operates below the level where reasoning can reach it.",
};

// ---------------------------------------------------------------------------- inherited rules, by placement

export interface InheritedRule {
  rule: string;
  from: string;
  truth: string;
}

export const INHERITED_BY_PLACEMENT: Record<string, InheritedRule> = {
  "saturn-2": {
    rule: "That money is finite and must be defended rather than enjoyed.",
    from: "a household where money was genuinely tight, or where one parent treated it as a constant anxiety.",
    truth: "Your chart builds wealth through steady accumulation, so the caution is half right. The half that is wrong is the belief that enjoying any of it puts the rest at risk.",
  },
  "saturn-8": {
    rule: "That money involving other people is dangerous and best kept private.",
    from: "an inheritance, a debt, a divorce or a family secret involving resources that nobody discussed openly.",
    truth: "The eighth house grows through circulation and shared resources. The privacy that feels protective is the exact thing capping it.",
  },
  "pluto-2": {
    rule: "That having money means somebody could take it from you.",
    from: "a genuine loss or an early power imbalance around resources.",
    truth: "You have unusual capacity to rebuild, which means your floor is much higher than your fear estimates.",
  },
  "pluto-8": {
    rule: "That money is power, and power is never given, only held.",
    from: "watching somebody control a household through money, and deciding it would never happen to you.",
    truth: "You are built to hold real authority over resources. Only the secrecy around it is costing you.",
  },
  "moon-2": {
    rule: "That money and emotional safety are the same thing.",
    from: "a childhood where financial changes and emotional upheaval arrived together.",
    truth: "Your nervous system reads a bank balance as a mood. Separating the two is most of the work.",
  },
  "neptune-2": {
    rule: "That being specific about money is somehow crude.",
    from: "a home where money was vague, avoided, or morally suspect.",
    truth: "Vagueness is where your income leaks. Precision is not greed.",
  },
  "chiron-4": {
    rule: "That your needs are an imposition on people who are already stretched.",
    from: "a home that was warm on the surface and unpredictable underneath, which is what makes this so hard to see.",
    truth: "It was not a bad childhood. It was one where love was real and security was conditional, and those two together produce an adult who feels guilty for noticing the second part.",
  },
  "venus-saturn": {
    rule: "That affection and approval have to be qualified for.",
    from: "a parent who was withholding, unwell, or simply stretched so thin that warmth had to be earned by being good and undemanding.",
    truth: "The conclusion that love is a limited resource was drawn by a child with incomplete information. It is still setting your prices.",
  },
  "empty-2": {
    rule: "That worth is something you work out later, once there is evidence.",
    from: "the absence of any modelling for how to value yourself, rather than from an explicit lesson.",
    truth: "Your worth was never given a fixed home in your chart, which means it needs external structure. That is an instruction rather than a deficiency.",
  },
};

// ---------------------------------------------------------------------------- generational layer

export const GENERATIONAL: Record<string, string> = {
  Scorpio: "Your generation carries Pluto in Scorpio, which means the collective story you were born into is about power, secrecy and what happens to money behind closed doors. Financial control, hidden debt and the taboo around discussing income are the water your whole cohort swam in.",
  Libra: "Your generation carries Pluto in Libra, so the collective story is about fairness, partnership and the renegotiation of who owes what to whom. Divorce, shared assets and the economics of relationship shaped the households you grew up in.",
  Sagittarius: "Your generation carries Pluto in Sagittarius, so the collective story is about belief, expansion and global reach. Money arrived tangled up with optimism, credit and the sense that growth was limitless.",
  Virgo: "Your generation carries Pluto in Virgo, so the collective story is about work, service and health as economic facts. The households you grew up in measured worth in usefulness.",
  Capricorn: "Your generation carries Pluto in Capricorn, so the collective story is about institutions, authority and the structures that hold or fail to hold wealth. You grew up watching systems be questioned.",
  Leo: "Your generation carries Pluto in Leo, so the collective story is about self-expression, individual will and the right to want more than your parents had.",
};
