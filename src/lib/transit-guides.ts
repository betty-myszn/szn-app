// Written transit guides.
//
// Most transits on the calendar are composed from the interpretation primitives, which is fine for
// a Chiron ingress nobody is going to read twice. The handful that members actually turn up for,
// starting with Venus retrograde, get written properly: a full general section that teaches the
// astrology, a per-house layer where the chart genuinely changes the story, Betty's own take, and
// a move that follows from all of it.
//
// **double asterisks** mark a bold run, rendered by the transit page.

export interface GuideSection {
  heading: string;
  body: string[];
}

export interface TransitGuide {
  /** The page title, replacing the composed one. */
  title: string;
  /** The hero paragraph under the title. */
  hero: string;
  /** The general astrology, in headed sections. The largest part of the page. */
  sections: GuideSection[];
  /** The personalised layer, keyed by the house the transiting sign falls in for this member. */
  house: Record<number, string[]>;
  /** How this energy distorts. Rendered after the personal layer, before Betty. */
  shadow?: string[];
  bettysTake: string[];
  move: {
    intro: string;
    steps: string[];
    /** One extra action that only makes sense for this member's house. */
    byHouse: Record<number, string>;
  };
  journalPrompt: string;
  /** One prompt per house, where the question genuinely changes with the placement. */
  journalByHouse?: Record<number, string>;
  affirmation: string;
  /** One affirmation per house, so it carries that house's actual lesson. */
  affirmationByHouse?: Record<number, string>;
}

export const VENUS_RX_SCORPIO: TransitGuide = {
  title: "venus stations retrograde in scorpio",
  hero: "Venus turns retrograde in Scorpio, which hands you roughly six weeks of reassessing what you want, who you want it from and what you have been calling love, chemistry or a fair deal. This is the full story rather than the four line version.",
  sections: [
    {
      heading: "what venus retrograde actually does",
      body: [
        "Venus runs attraction, affection, pleasure, beauty, taste, money, values and the whole question of what you consider worth having. She goes retrograde roughly every eighteen months for about six weeks, and from Earth she appears to slow down and move backwards through the sky. That's the optical bit, and it's the least interesting part.",

        "What matters is what it does to her territory. Everything Venus governs goes into review rather than forward motion. Instead of acquiring, attracting and deciding, you reconsider: what you're drawn to, what you've settled for, what you've been calling a fair exchange, and what you actually value once the wanting quiets down enough for you to hear yourself.",

        "This is why the standard advice is to avoid launching a brand, getting married or making a dramatic permanent change to your face during Venus retrograde. The reasoning holds, roughly, because your sense of what looks good and feels right is genuinely in flux. Nothing catastrophic happens if you ignore it. You may simply find that the thing you chose in week three is not the thing you'd have chosen in week eight.",

        "The gift of it is accuracy. Venus forward is very good at wanting. Venus retrograde is very good at telling you which of those wants were actually yours, and that information arrives nowhere else in the year.",
      ],
    },
    {
      heading: "and then scorpio gets involved",
      body: [
        "A Venus retrograde in Libra would be a polite six weeks of reconsidering your relationships over a nice lunch. Scorpio is a completely different assignment. Fixed water, ruled by Mars and Pluto, and interested exclusively in what's happening underneath the thing everybody agreed to say out loud.",

        "So this retrograde takes all of Venus's questions and drags them somewhere deeeeper: intimacy rather than romance, trust rather than compatibility, what you'd have to admit rather than what you'd post. It touches sex, vulnerability, jealousy, secrecy, emotional power, taboo desire, money that's tangled up with another person's, and the specific fear of being properly known by somebody who could use it.",

        "Scorpio also refuses the surface read. Under this retrograde, a situation you've been describing one way for two years may quietly reveal what it's actually been. Not through drama, necessarily. Usually through a sentence somebody says in passing that you can't stop thinking about.",

        "Worth knowing: Scorpio energy is slow and it does not forget. What surfaces over these six weeks has usually been forming since long before the retrograde started, which is why it can feel less like news and more like a confirmation you'd been quietly avoiding.",
      ],
    },
    {
      heading: "relationships, and what's actually holding them up",
      body: [
        "The most common thing this transit does is separate chemistry from safety. Plenty of relationships run brilliantly on chemistry: the pull, the electricity, the way you can't quite relax around them in a manner that reads as exciting. Under Venus retrograde in Scorpio, you get an unusually clear look at whether there's anything underneath it.",

        "Some people find there is, and the relationship deepens considerably over the six weeks. Others notice that the intensity has been doing a lot of structural work, and that they've never once been able to be boring, tired or unimpressive in front of this person.",

        "Scorpio holds a genuine contradiction that this retrograde tends to expose: it wants total intimacy and it's frightened of the exposure that total intimacy requires. So you can want somebody very much, want to be known by them completely, and simultaneously keep a small part of yourself back as insurance. That reflex is worth watching rather than judging, because it usually formed for an excellent reason.",

        "Trust comes up too, specifically the mechanics of it. Who you trust, what they did to earn it, what makes you withdraw, and how quickly you reclassify somebody after one disappointing conversation. Scorpio tends toward absolutes here, and six weeks of review is a good opportunity to notice whether your all-or-nothing setting is protecting you or simply keeping the circle small.",

        "Unspoken resentment often surfaces as well, since this is a sign that stores things rather than airs them. Something you decided not to mention eight months ago has been quietly accruing interest, and this transit is when you notice the balance.",
      ],
    },
    {
      heading: "old lovers, and the far more interesting version",
      body: [
        "Yes, people from the past turn up during Venus retrograde. It's the most famous thing about the transit and it does genuinely happen, partly because Venus is reviewing and partly because everybody else is having the same reflective six weeks you are.",

        "**Please don't assume every ex appearing during Venus retrograde is your twin flame returning from battle.** Sometimes the message means something. Frequently it means they're bored, nostalgic, recently single, or scrolling at midnight like the rest of us.",

        "The genuinely useful version of this is what seeing them shows you. People report a very particular experience under this transit: an old flame reappears and instead of the pull, there's almost nothing there, and what's left is the slightly startling realisation of how much has changed in you. Something you once found irresistibly mysterious now reads as emotionally unavailable. A thing you called passionate now looks like instability with good lighting.",

        "More interesting still is when the pattern returns without the person. You may notice that three completely different people have occupied the same emotional position in your life, that you keep choosing the one who needs convincing, or that you have a type that has nothing to do with looks and everything to do with a specific dynamic you learned young. Scorpio is the sign that can see that, and six weeks is enough time to actually trace it.",
      ],
    },
    {
      heading: "what you want, and whether you still want it",
      body: [
        "Desire genuinely shifts during this transit, and it's worth treating as data rather than as a crisis. Somebody who would've had you absolutely feral six months ago can suddenly give you nothing at all. Something you filed under too much, too intense or too complicated can start looking exactly right.",

        "Scorpio's particular contribution is the stuff you've edited. Desires you've judged, minimised or decided were unbecoming tend to get harder to ignore under this sky, and the retrograde is an unusually safe window to look at them honestly, given that reviewing is the entire assignment.",

        "There's a distinction this transit is very good at surfacing: whether you wanted the person or wanted to be wanted by them. Those feel identical from inside and produce completely different lives. Some people discover under a Venus retrograde that what they were enjoying was the pursuit, the being chosen, the evidence of their own desirability, and that the actual human involved was almost incidental.",

        "The same applies to intensity. Scorpio can mistake the strength of a feeling for the value of the thing that caused it, so a situation that was mostly anxiety can register as the great love of your life. Six weeks of Venus in review is where that distinction becomes visible, usually with excellent timing and terrible manners.",
      ],
    },
    {
      heading: "power, and who's holding it",
      body: [
        "This is the section Scorpio actually cares about. Every relationship has a power distribution, and most of it is never discussed: who reaches out first, who takes longer to reply, who decides what happens at the weekend, who has to be in a good mood for the household to function, who pays, who apologises, who is allowed to be difficult.",

        "Venus retrograde in Scorpio tends to make that arrangement visible. Not always dramatically. Often it's a small moment where you notice you've been managing somebody's reaction to a piece of news for three days before delivering it.",

        "The defences people use when closeness feels risky are the real material here, and they're rarely conscious. Withholding affection when you feel wobbly. Testing somebody to see whether they'll notice. Becoming so independent that nobody has any leverage. Making yourself so useful that leaving you would be inconvenient. Keeping a part of yourself back so there's always something they don't have. Staying interesting rather than getting known.",

        "None of that makes somebody a villain. They're strategies, generally learned somewhere it was genuinely unsafe to be transparent, and they're extremely effective at preventing the exact closeness the person actually wants. Scorpio's gift is being able to look straight at them without flinching, which most signs can't.",

        "Money often carries this too, and that's covered further down, but it's worth naming here that who controls the resources in a relationship is a power question wearing a practical outfit.",
      ],
    },
    {
      heading: "jealousy, obsession and the things you're not supposed to feel",
      body: [
        "Modern spirituality has decided that jealousy is a low vibration and obsession is a red flag, which leaves most people with nowhere useful to put either. Scorpio disagrees, and so do I. These are information-dense emotions and this transit is an excellent time to read them.",

        "Jealousy usually points at one of three things: a fear you've been carrying quietly, a comparison you've been running without consent, or a want you haven't admitted to. The interesting move is to ask which one, rather than to perform serenity about it.",

        "Obsession tells you where an enormous amount of your emotional energy has been invested, and that energy is real regardless of whether the object deserved it. A thing you cannot stop thinking about is telling you something about your own unfinished business more often than it's telling you about them.",

        "Attachment is the deeper one. Scorpio merges, and under this retrograde you may notice where your sense of safety has become tangled with another person's presence, mood or approval. Noticing that is not a scandal. It's the beginning of being able to choose it deliberately rather than need it invisibly.",
      ],
    },
    {
      heading: "money, debt and who owes who",
      body: [
        "Venus retrograde is not only relationship astrology, and Scorpio is the sign of shared resources, so this is a genuinely significant money transit. Anything financial that connects you to another person comes up for review: joint accounts, debt, investments, inheritance, the loan nobody mentions, the arrangement that made sense three years ago.",

        "Unequal contribution becomes noticeable under this sky. Who earns, who pays, who covers the gap, who has been quietly subsidising whom, and whether the arrangement everybody agreed to still reflects what's actually happening. Six weeks is enough to renegotiate something properly rather than resentfully.",

        "Receiving is the subtler theme, and it's very Scorpio. Plenty of women are entirely comfortable earning and deeply uncomfortable being given to, because receiving creates obligation and obligation creates exposure. If somebody offers to pay, help, support or take something off your plate and your whole body says no, that's worth examining this month. There's usually a story underneath it about what accepting makes you.",

        "The harder one to look at is financial dependence keeping you somewhere. Money is a legitimate reason to stay in an arrangement and it's also the most common invisible tether there is. Venus retrograde in Scorpio tends to surface whether the security is genuinely serving you or whether it's been quietly buying your compliance.",

        "There's an inheritance and legacy flavour to this sign as well, so old family money dynamics, a will, a debt you took on for somebody else or a financial pattern you learned at home can all resurface with unusual clarity.",
      ],
    },
    {
      heading: "what you're measuring your worth against",
      body: [
        "Venus rules value, so a retrograde through Scorpio inevitably reaches the question of what makes you valuable, and specifically what you've been using as the measure.",

        "A lot of people discover, mid-transit, that they've been quietly scoring themselves on who wants them, how attractive they look, what they own or how much somebody is willing to give them. Those metrics work beautifully right up until they don't, and Scorpio has a habit of removing one of them temporarily so you can find out what's underneath.",

        "What tends to change is not your worth but the scoreboard. Status stops being interesting. Being desired stops being the main event. Something quieter and considerably harder to perform starts mattering more, and it's usually connected to being known rather than being admired.",
      ],
    },
    {
      heading: "your hair, your wardrobe and your entire aesthetic",
      body: [
        "Venus rules beauty and taste, and retrograde periods are famous for the sudden conviction that everything you own is hideous. **Your hair may start personally offending you.** The wardrobe feels like a costume from a previous era. Your branding, your logo, your whole colour palette, all of it can turn on you within about a week.",

        "This is Venus reassessing what you find beautiful, and it's usually a genuine change rather than a mood. The version of your taste you're currently living inside was chosen by a slightly different woman, and this transit is when you notice the gap.",

        "Scorpio's influence here tends toward the darker, sexier and more private end of things. People often find themselves drawn to a deeper palette, better underwear nobody else will see, something more powerful and less approachable, and away from whatever they were doing to look palatable.",

        "The standard warning is to avoid dramatic permanent changes, and I'd soften it to this: experiment enthusiastically, and postpone the irreversible. Try the wig, buy the one piece, book the colour you can grow out. Keep the tattoo, the chop and the rebrand on the list for late November, when Venus is direct and your taste has stopped moving.",
      ],
    },
  ],
  house: {
    1: [
      `Scorpio falls across your first house, which puts this entire retrograde on **you**: your face, your body, your style, the way you arrive in a room and the version of yourself other people meet first. Venus reviewing here is a six week reassessment of your own packaging, and Scorpio makes it a private, slightly ruthless one.`,

      `What tends to happen is a growing impatience with the version of yourself you've been presenting. The way you introduce yourself, the photos, the hair, the energy you bring into rooms, all of it can start feeling like a costume belonging to somebody you used to be. That restlessness is the transit working rather than a crisis of confidence.`,

      `With the first house involved, other people's attraction to you becomes unusually legible. You may notice exactly what people respond to in you, and whether it's something you actually enjoy being or something you learned to perform because it worked. Scorpio will show you the difference and will not be gentle about it.`,

      `There's a magnetism question too. This house governs how you take up space, and Venus retrograde here often coincides with pulling that back deliberately: less available, less immediately readable, more interested in being known by a few people than being liked by everybody.`,
    ],
    2: [
      `Scorpio falls across your second house, so this retrograde lands directly on **your own money, your possessions and what you believe you're worth**. Not shared resources, yours: what you earn, what you charge, what you spend on and what you've decided you're allowed to have.`,

      `Six weeks of Venus in review here usually starts with the numbers. Rates that haven't moved, subscriptions you've forgotten, the gap between what you're paid and what the work actually is. Scorpio adds a psychological layer to it, so expect the money conversation to turn fairly quickly into a conversation about what you think you deserve.`,

      `Buying habits come up too, and with Scorpio involved it tends to be the secret ones. What you spend on when you're anxious, the purchases you'd rather not discuss, the way money gets used to manage a feeling. There's no judgement in the observation and quite a lot of information.`,

      `The deeper question of this house is what you're using to measure your value, and this transit tends to remove one of the usual measures temporarily so you can see what's underneath it.`,
    ],
    3: [
      `Scorpio falls across your third house, which puts this retrograde into **your words, your daily conversations and the people immediately around you**. Siblings, neighbours, the group chat, the person you speak to most days without thinking about it.`,

      `Venus retrograde here reviews how you communicate affection and desire. What you say, what you leave out, the way you flirt, the things you've never quite managed to put into words. Scorpio's contribution is everything that gets communicated by not being said, which is a specialty of this sign and a large part of what surfaces now.`,

      `Old messages, old conversations and unfinished exchanges tend to resurface. Sometimes literally, in the form of a text thread you scroll too far back in. More usefully, it's the conversation you never had, with somebody still in your life, that becomes harder to keep postponing.`,

      `Sibling dynamics and long-running local relationships can come up for review too, particularly where an old pattern from childhood has been running quietly inside an adult friendship.`,

      `Scorpio in this house also means your words carry more weight than you think this month. A single honest sentence can reset a dynamic that six months of careful management never touched, and the retrograde is a good window to use that rather than keep translating yourself into something easier to hear.`,
    ],
    4: [
      `Scorpio falls across your fourth house, so this retrograde goes **home**: your family, your living situation, your private life and the emotional foundation everything else is built on.`,

      `Venus reviewing here often shows up as a changed relationship with where you live. The flat that felt right now feels wrong, the arrangement with whoever you share it with needs renegotiating, or you become aware of how much of your home life is organised around somebody else's comfort.`,

      `Family patterns are the deeper layer, and Scorpio digs. Money and family are frequently entangled in this house, so old financial arrangements, inherited attitudes about love and worth, and things that were never discussed at home can all become more visible over these six weeks.`,

      `There's also the question of who gets access to your private self. The fourth house is the version of you that exists behind the front door, and this transit tends to clarify exactly who you let in there and whether they've earned it.`,

      `There's a privacy question in here too. Venus retrograde through the fourth can make you want everybody out of your space for a while, which reads as antisocial and is usually your system asking for somewhere it doesn't have to perform. Take the six weeks. The invitations will still exist in December.`,
    ],
    5: [
      `Scorpio falls across your fifth house, which makes this a retrograde through **romance, dating, sex, creativity and pleasure**. The fun house, reviewed by the least frivolous sign in the zodiac.`,

      `Dating tends to get a full audit. What you're drawn to, what you've been settling for, the type you keep returning to, and the gap between the chase and what actually happens once you've caught it. Scorpio's involvement means the pattern underneath the type becomes visible, which is more useful than any individual person's return.`,

      `Creative work goes through the same review. A project you've been pouring yourself into can suddenly feel wrong, or something you abandoned can start pulling at you again. Venus retrograde in the fifth is unusually good at reconnecting people with a creative thing they gave up to be sensible.`,

      `Pleasure itself is the quiet theme. What you actually enjoy, as opposed to what you perform enjoyment about, and whether your life currently contains any of it. Scorpio will point out that a lot of what you've been calling fun has been fairly hard work.`,

      `Old flames belong to this house as much as the seventh, and with the fifth it's usually the ones that were never quite official: the situationship, the summer, the person you never defined. What surfaces here is less about reconciliation and more about what that particular version of wanting was actually giving you at the time.`,
    ],
    6: [
      `Scorpio falls across your sixth house, putting this retrograde into **your daily work, your routines, your health and the people you deal with every single day**.`,

      `Venus reviewing here examines the exchange in your working life. What you give, what you get back, who takes and who reciprocates, and whether the arrangement that looked reasonable on paper is reasonable in practice at four o'clock on a Thursday. Scorpio makes the power dynamics at work particularly legible over these six weeks.`,

      `Colleagues and everyday relationships come up specifically. The one who drains you, the one you've been carrying, the dynamic you've decided to tolerate because addressing it would be awkward. Venus retrograde is a good window to change the terms rather than continue quietly resenting them.`,

      `Your body and daily habits are the other half of this house. Routines can stop working, the thing you've been ignoring physically can get louder, and what you find pleasurable about daily life can shift considerably.`,

      `The health thread deserves attention too. This house rules the body's daily maintenance, and Venus retrograde in Scorpio through it often surfaces something you've been managing rather than treating. Book the appointment you've been rescheduling, and be honest with whoever you book it with.`,
    ],
    7: [
      `Scorpio falls across your seventh house, which is the most direct placement this retrograde can take: **partnership, one to one relationships, agreements and reciprocity**, all under review at once.`,

      `Whatever's been unequal in your closest relationship tends to become visible here, and Scorpio ensures it's the underneath version rather than the surface complaint. Not who does the washing up, but who holds the emotional power, who adjusts, who has been managing whom, and what's actually being exchanged.`,

      `This house also governs contracts and formal agreements, so business partnerships, working arrangements and anything you've signed with another person can come up for renegotiation alongside the romantic material.`,

      `Old partners are more likely to feature with this placement than most, and the useful question is the same one: what does seeing them, or thinking about them, show you about how much your standards have moved. Reconciliation is one possible outcome and rarely the interesting one.`,

      `There's a projection layer too, because the seventh house holds what we hand to other people to carry. Six weeks of Venus in review here often reveals which of your own qualities you've been outsourcing to a partner.`,
    ],
    8: [
      `Scorpio falls across your eighth house, which is the most concentrated version of this transit available. The eighth house is Scorpio's own territory, so everything the sign brings, Venus is now reviewing in the house that already governs it: **intimacy, sex, trust, merging, shared money, debt, dependency and the part of you nobody gets to see**.`,

      `Expect this one to run deeeep rather than wide. The theme is access: who has it, what it cost them, what you require before you'll grant it, and what happens in you at the exact moment closeness starts to require surrendering control. That moment is where most of the six weeks lives.`,

      `Emotional and financial entanglement are the same subject in this house, which is why they tend to surface together. The joint account and the question of how much of yourself you've handed over are running the same programme, and reviewing one usually turns into reviewing the other within about a week.`,

      `Receiving is the eighth house's hardest lesson and this retrograde goes straight at it. Money, support, affection, help, all of it creates obligation, and obligation creates exposure. If you can earn comfortably and cannot be given to, this is the transit that will keep putting the offer in front of you until you notice what your body does about it.`,

      `Old fears around betrayal, abandonment and dependence get unusually visible. Not necessarily triggered by anything happening now, which is the point. The eighth house holds what was installed long ago, and Venus retrograde here brings it up for inspection rather than for crisis.`,

      `Sexual desire frequently shifts under this placement too, sometimes deepening considerably, sometimes going quiet while something reorganises underneath. Both are the transit working, and neither needs a decision made about it in October.`,
    ],
    9: [
      `Scorpio falls across your ninth house, so this retrograde reviews **what you believe, what you're studying, where you travel and the people who come from somewhere other than where you do**.`,

      `Venus here examines the values underneath your relationships rather than their day to day mechanics. Whether you actually share a worldview with the people closest to you, or whether you've been quietly translating yourself for years to keep things comfortable.`,

      `Long distance and cross cultural relationships are specifically ninth house territory, and this transit tends to bring the question of whether the arrangement still works into unavoidable focus. Something about the distance, the commitment or the eventual plan usually needs saying out loud.`,

      `There's also a belief audit hiding in here. What you were taught about love, money and what you're allowed to want, and how much of that you've simply never examined because it came from a source you trusted.`,

      `Travel and study plans can wobble under this placement, which is worth knowing before you book anything non-refundable. A course, a trip or a plan to move can suddenly feel wrong, and the useful move is to postpone the deposit rather than to abandon the idea, because your read on it in late November will be considerably steadier.`,
    ],
    10: [
      `Scorpio falls across your tenth house, which puts this retrograde into **your career, your reputation, your public image and what you've decided success is supposed to look like**.`,

      `Professional relationships get the review here: mentors, bosses, clients, the people whose approval you've been working for. Scorpio makes the power distribution in those relationships obvious, including where you've been making yourself indispensable rather than valuable, which are different strategies with very different long term returns.`,

      `Your public image can start feeling wrong in the same way a wardrobe does. The brand, the title, the way you describe what you do, the version of yourself that exists professionally. Venus retrograde is not the moment to relaunch it and it's an excellent moment to work out what you'd want it to be.`,

      `The deeper question this house asks is whose definition of success you've been working to. Six weeks of Venus in review tends to reveal whether the thing you're climbing toward is genuinely yours or borrowed from somebody whose opinion mattered a long time ago.`,

      `Scorpio in this house also brings the private cost of your public life into focus. What the role is actually taking from you, what you've stopped doing to keep it, and who in your life has quietly been absorbing the overflow. That accounting rarely happens outside a transit like this one.`,
    ],
    11: [
      `Scorpio falls across your eleventh house, so this retrograde goes into **friendship, community, networks and the future you're building with other people**.`,

      `Friendships get the full audit here, and Scorpio makes it about depth rather than headcount. Which of these people actually know you, which ones you perform a version of yourself for, and which friendships have been running on a decade of momentum rather than anything current.`,

      `Group dynamics and the politics of belonging tend to surface too. Where you sit in the hierarchy of a community, who has influence, and what you've been willing to keep quiet about in order to stay inside it.`,

      `There's also the question of what you're building toward collectively. Venus retrograde here often clarifies whether the shared vision, the collaboration or the scene is still one you actually want to be part of, or whether you've outgrown it and haven't said so.`,

      `Money and friendship can tangle here too, which is very Scorpio in the eleventh. A loan, a shared project, an unpaid favour, an arrangement inside a group that everybody is too polite to raise. Six weeks of Venus in review is a good window to sort that out before it curdles into something nobody can mention.`,
    ],
    12: [
      `Scorpio falls across your twelfth house, which is the most private placement this retrograde can take. The twelfth governs **the hidden, the unconscious, solitude, what you keep secret and what you keep secret from yourself**.`,

      `Much of this transit happens internally with this placement, which can make it feel like nothing is going on while a considerable amount reorganises underneath. Dreams get vivid, feelings surface without obvious triggers, and something you've been carefully not thinking about becomes harder to avoid.`,

      `Secret attachments belong to this house: the feeling you've never admitted to, the person nobody knows about, the situation that exists entirely in your own head. Venus retrograde here tends to bring those into the light, at least for you, which is usually where they needed to be.`,

      `There's also the self-undoing theme, which sounds ominous and simply means the patterns you run against your own interests. With Scorpio involved, that's typically some form of hiding: staying unavailable, keeping the real feeling back, choosing the situation that can't fully happen so nothing can be lost.`,

      `This is also the placement where a rest is genuinely part of the work. The twelfth house needs solitude to process, so the urge to cancel things and be unreachable for a while is the transit functioning correctly rather than you withdrawing from your life.`,
    ],
  },
  bettysTake: [
    "Here's what I find genuinely fascinating about this transit, and it's the thing nobody warns you about: Venus retrograde in Scorpio is where you find out that something you successfully manifested no longer does anything for you.",

    "You wanted it. You worked for it, visualised it, probably cried about it. The relationship, the income, the apartment, the version of your life that would prove you'd made it. And now it's here and you're standing in it feeling almost nothing, and the guilt about feeling nothing is considerably worse than the nothing.",

    "That's not ingratitude. Desire has a shelf life, and the woman who wanted that thing was solving a different problem than the one you have now. A want built at twenty five to prove you were desirable does not automatically survive contact with a thirty five year old who has already proved it.",

    "So my actual advice for these six weeks is a desire audit, and I'd do it in two columns. What do I want because it genuinely lights me up, and what do I want because having it would prove something about my worth, my desirability or my success. Scorpio is the only sign honest enough to fill in the second column properly, and it's the more useful one.",

    "The other thing I'd watch is your standards, which this transit will raise without consulting you. Something you tolerated for two years may become completely unbearable by the middle of November, and that's not you becoming difficult. That's Venus recalculating what a fair exchange looks like now you know your own rate.",

    "And for the witchier among you: this is the best shadow work window of the year for anything to do with love, money or being wanted. Scorpio rules what's buried, Venus rules what's valued, and the six weeks where they meet will show you exactly which of your wants were inherited, performed or borrowed from somebody else's idea of a good life.",
  ],
  move: {
    intro: "Six weeks of review, used properly. Nothing here requires you to blow anything up, and most of it is about looking at something you've been managing rather than examining.",
    steps: [
      "Run the desire audit before you do anything else. Two columns, honest ones: what genuinely lights you up, and what you want because having it would prove something. Keep the page, because the second column explains most of your calendar.",

      "Have the money conversation you've been postponing. The unequal contribution, the loan, the joint account, the thing you agreed to when your circumstances were completely different. Renegotiating during a Venus retrograde is exactly what it's for.",

      "Notice what's changed about your attraction without immediately deciding what it means. If somebody who used to do it for you now does nothing, that's information, and six weeks is a good length of time to sit with information before acting on it.",

      "When an old pattern resurfaces, trace it rather than judging it. Same dynamic, different face, and the question worth asking is what that position in your life keeps getting filled with.",

      "Look at one place where receiving makes you uncomfortable. Let somebody pay, help or support you this month and watch what your body does about it, because that reaction is the whole story.",

      "Experiment with your aesthetic enthusiastically and postpone anything irreversible until late November. Try everything, cut nothing.",

      "If resentment surfaces, deal with it while it's still a sentence. Scorpio stores things, and a resentment left to compound over six weeks arrives in December as something considerably harder to have a conversation about.",
    ],
    byHouse: {
      1: `Change something about how you present yourself that's reversible, and notice who reacts. The reaction is the information.`,
      2: `Audit your own numbers before you touch anybody else's: your rate, your spending, and one price you've been too polite to raise.`,
      3: `Have the specific conversation you've been drafting for months, and say the part you usually leave out.`,
      4: `Look at one family or household arrangement that's quietly unequal, and start the renegotiation at home first.`,
      5: `Revisit the creative thing you abandoned, and notice which of your pleasures you're genuinely enjoying rather than performing.`,
      6: `Change the terms of one daily arrangement that's been running on your goodwill rather than on anything mutual.`,
      7: `Put the actual terms of your closest partnership into words, including the ones you've both been operating on without ever agreeing to.`,
      8: `Look at one place where money and intimacy are tangled together, and one place where being given to makes you uncomfortable. They're usually the same story.`,
      9: `Name one belief about love or money you inherited rather than chose, and check whether you still agree with it.`,
      10: `Work out whose approval your career is currently organised around, and leave the rebrand until Venus is direct.`,
      11: `Work out which friendships you'd choose again from scratch, and have one honest conversation inside a group you've been performing for.`,
      12: `Give the private thing a witness. One person, the real version, said out loud rather than carried alone.`,
    },
  },
  journalPrompt:
    "What have I been calling love, chemistry or a fair deal that this retrograde is quietly asking me to look at properly?",
  affirmation:
    "I let my wanting change, and I trust what's left once the wanting has quieted down.",
};

export const PLUTO_DIRECT_AQUARIUS: TransitGuide = {
  title: "pluto stations direct in aquarius",
  hero: "Pluto turns direct in Aquarius, which is less a green light than a very large, very slow process changing direction. What you have been working out privately for months starts becoming something you act on, and the chapter it belongs to runs for years rather than weeks.",
  sections: [
    {
      heading: "what a pluto station actually is",
      body: [
        `Pluto spends about five months of every year retrograde, which is a lot when you consider it only moves two or three degrees across an entire year. So a Pluto station is not a switch being flipped. It's a very large, very slow process changing direction, the way a tanker changes direction, and the date itself is simply the moment the turn becomes measurable.`,

        `During the retrograde months, Pluto's material tends to run inward. Power dynamics you're inside of, fears you'd rather not name, compulsions, attachments, the things you do automatically when you feel unsafe, all of that gets pulled into review rather than played out in front of anybody. Plenty of it happens without a single external event to point at, which is why Pluto retrograde often feels like nothing and costs so much energy.`,

        `Stationing direct is when that internal material starts becoming actionable. Something you've understood privately over the last few months begins affecting what you'll agree to, what you'll tolerate, who gets access to you and what you're willing to keep participating in. The understanding arrived months ago. This is when it starts having consequences.`,

        `Think in chapters rather than days. You don't need to wake up on the station date and dramatically restructure your life, and if you do, that's usually adrenaline rather than Pluto. The shift tends to show up over the following weeks and months, in decisions that would have been unthinkable a year ago and now feel almost obvious.`,
      ],
    },
    {
      heading: "what pluto actually governs, without the wellness translation",
      body: [
        `Pluto runs power, shadow, transformation, endings, regeneration, obsession, control, survival instinct, buried material and everything that happens to a person after something they cannot undo. It's the planet of what you do when you're genuinely threatened, and what you become on the other side of it.`,

        `The spiritual internet has softened all of this into becoming your highest self, which is a shame, because Pluto is considerably more interesting than that. This planet deals in material you'd rather manage, hide or outrun. The compulsions. The thing you do when somebody pulls away. The specific way you get control back when you feel it slipping.`,

        `Transformation in Pluto's sense is rarely chosen and almost never comfortable. Something ends, sometimes something you built, and the version of you that existed inside it doesn't survive intact. What regenerates afterwards is usually less decorative and considerably harder to knock over.`,

        `Pluto's other specialty is showing you where you gave your power away, often years ago, usually without noticing, generally in exchange for safety, belonging or being loved. That's the bill this planet eventually presents, and it presents it slowly enough that you can't pretend it arrived out of nowhere.`,

        `Scale matters enormously with this planet. Pluto can spend a decade or more crossing a single house of your chart, which makes a Pluto transit a chapter you live inside rather than an event you get through. The version of you at the start and the version at the end are meaningfully different people, and almost all of that change happens too slowly to notice while it is happening, which is why the recognition usually arrives years later while you are looking at an old photograph.`,
      ],
    },
    {
      heading: "pluto in aquarius, and why this one is different",
      body: [
        `Pluto entered Aquarius properly in 2024 and stays until the mid 2040s, so whatever it's doing, it isn't in a rush and neither are you. Aquarius is fixed air, traditionally ruled by Saturn and modernly by Uranus, and it governs community, friendship, networks, systems, technology, innovation, collective identity and the whole question of belonging.`,

        `Put Pluto's obsession with power into that territory and you get a two decade excavation of how power actually moves through groups. Who's included, who's excluded, who decides, who gets platformed, who quietly sets the terms everybody else operates inside, and what belonging costs the people who want it badly enough.`,

        `The previous stretch, Pluto in Capricorn, spent fifteen years taking apart institutions, hierarchies, governments and anything built on the assumption that authority deserves automatic trust. Aquarius takes the same forensic attention and points it at the horizontal version: networks, communities, platforms, movements, group consensus and the strange new power structures that don't have a building or a CEO.`,

        `On a personal level this tends to show up as a slow, thorough reassessment of the groups you belong to. Which communities have genuinely been good for you, which ones you've been editing yourself to stay inside, and which ones defined you at twenty five and have nothing to do with who you are now.`,

        `There is a generational layer and a personal one, and it helps to keep them apart. Everybody alive is having Pluto in Aquarius, which is the collective story of the next two decades. What makes it yours is the house it crosses in your own chart, which decides where in your life all of that pressure actually lands.`,
      ],
    },
    {
      heading: "power, and what belonging has cost you",
      body: [
        `Aquarius holds a real tension that Pluto is very good at exposing: the sign is obsessed with individuality and completely organised around groups. Being yourself and belonging somewhere are both non-negotiable, and they are frequently in direct conflict.`,

        `The most common version is the slow edit. Nobody asks you to change, and over a few years you stop mentioning certain opinions, stop bringing up the thing you're actually into, adjust your politics a quarter turn, and become a slightly flatter version of yourself that the group finds easy. Pluto in Aquarius tends to make that edit visible, usually by making it unbearable.`,

        `The opposite version is just as common and gets discussed much less: staying outside every group on principle, because belonging anywhere would mean caring what they think, and caring what they think is a vulnerability. Permanent outsiderhood can be a genuine identity and it can also be very sophisticated self-protection.`,

        `Power inside communities becomes easier to see under this transit. Who has influence and who merely has visibility, who controls access, who decides which conversations are acceptable, and what happens to somebody who breaks the unspoken rules. Once that architecture becomes obvious to you, participating in it the old way gets difficult.`,

        `Then there's the reckoning nobody enjoys, which is noticing that you've been performing not caring about status inside a group whose approval you very much want. Aquarius is excellent at that particular contradiction, and Pluto has no patience for it whatsoever.`,
      ],
    },
    {
      heading: "technology, the internet, and who owns the room",
      body: [
        `You cannot write about Pluto in Aquarius honestly and skip technology. Aquarius governs networks and systems, Pluto governs concentrated power, and the last few years of AI, platform consolidation, algorithmic gatekeeping and data ownership are a fairly on-the-nose expression of both. This transit runs for two decades and that story is only in its opening chapter.`,

        `For you personally, the interesting part is smaller and much more immediate: your relationship with being online. Pluto tends to intensify things until they become undeniable, so this is the transit where a mild habit becomes a proper compulsion, or where you suddenly cannot stand the version of yourself that exists on a particular app.`,

        `Digital identity gets a thorough interrogation. The persona, the curation, the gap between the account and the actual life, the part of you that checks who viewed something. None of that is shameful and all of it is worth looking at, because Aquarius is where your identity and the collective's opinion of you are most tangled together.`,

        `Privacy becomes a live question too. Who has access to what, what you share automatically, what you've made public about your life without ever deciding to. Pluto rules what stays hidden, and there tends to be a real appetite under this transit for taking some things back offline entirely.`,
      ],
    },
    {
      heading: "friendships, and the ones you've outgrown",
      body: [
        `Friendship is properly Aquarian territory and it gets much less astrological attention than romance, which is ridiculous given how much of your life it accounts for. Pluto here turns the volume up on it for years at a time.`,

        `A friendship can reveal a power dynamic that's been running quietly since the beginning. One of you always initiates. One of you is the entertainment and one is the audience. One has been the reliable one for so long that nobody remembers she's allowed to have a crisis. Pluto tends to surface that rather than let it stay comfortable.`,

        `Outgrowing a community that once defined you is one of the loneliest experiences available, and it's extremely common under this transit. The group was right for the woman you were when you found it, and staying inside it now requires you to keep being her. That's usually what makes it unbearable before it makes it obvious.`,

        `The other direction happens too, and it's the part worth waiting for. Pluto in Aquarius has a habit of delivering a community where you finally don't have to translate yourself. Often it's smaller than the one you left, frequently it's online, and it tends to arrive after you've stopped auditioning for the old one.`,

        `Your relationship with popularity itself can change across this transit. Being liked by many people stops being the metric, and being properly known by a few starts being the thing you'd actually trade for it.`,

        `Worth naming: the endings here are rarely dramatic. Most friendships that finish under this transit simply stop being maintained, by both people, and the realisation arrives months later. That quietness is Pluto in a fixed air sign rather than a lack of significance.`,
      ],
    },
    {
      heading: "who you are when nobody's watching the group chat",
      body: [
        `Aquarius connects your identity to the collective, so Pluto here runs a long excavation of how much of you was shaped by the rooms you've been in. Internet culture, a friendship group, a professional network, a scene, a movement, a fandom, a workplace with strong opinions about what people like you are supposed to think.`,

        `None of that influence is bad, and the point isn't to arrive at some pure uninfluenced self, which doesn't exist. The work is noticing which of your positions you actually arrived at and which you absorbed because everybody around you held them and disagreeing would have been socially expensive.`,

        `This process takes years rather than weeks, and it tends to move in waves that line up with Pluto's stations. Something becomes clear during the retrograde months, and then the direct station is when you start acting differently because of it.`,

        `What usually emerges is a much smaller and much more deliberate set of belongings. Fewer rooms, chosen properly, with a version of yourself in them that doesn't require maintenance.`,
      ],
    },
    {
      heading: "what stationing direct actually changes",
      body: [
        `Here's what I'd have you resist: reading this as a green light. Pluto direct is not Mercury direct, and treating a generational planet like a traffic light will have you forcing a decision that was going to arrive on its own in about four months.`,

        `What genuinely shifts is the direction of travel. The material that's been circulating internally since spring starts finding external expression: in what you say yes to, what you decline, who you stop explaining yourself to, and which arrangement you can no longer participate in with a straight face.`,

        `A power dynamic you finally understood during the retrograde is the clearest example. Understanding it didn't change anything by itself. What changes now is that you can't un-know it, and continuing to play your usual role in it starts costing more than changing it would.`,

        `The pace stays slow and that's a feature. Pluto rewards decisions that hold, and anything you can only do in a burst of intensity tends to get undone by the next station. Something you decide deliberately in the next few months, and then maintain, is how this planet actually works.`,

        `One practical note: the station itself often coincides with a fairly intense fortnight either side, where the themes get loud before they get clear. That intensity is the turn happening, and it settles.`,

        `This rhythm repeats every year, which is the most useful thing to understand about it. Pluto goes retrograde in the spring, spends about five months turning things over internally, and stations direct in the autumn, and each cycle takes the same material one layer deeper. What you are working on now is very likely a further chapter of what surfaced at this point last year.`,

        `Worth saying plainly, because the astrology internet has made Pluto sound like a catastrophe: this planet does not arrive to punish anybody. It removes what was structurally unsound, and a great deal of what it removes was something you had already outgrown and were holding in place out of loyalty, fear or habit. The discomfort usually lives in the holding rather than in the loss.`,
      ],
    },
  ],
  house: {
    1: [
      `Aquarius sits across your first house, so Pluto is working on **you**: your identity, your self-concept, your presence and the way you occupy a room. This is one of the most demanding placements Pluto offers, because there is nowhere external to put it.`,

      `Across this transit people tend to become genuinely unrecognisable to those who knew them a decade ago. Not through a makeover, through a change in what they will and will not carry. The Aquarian flavour makes it specifically about the self you present to groups: the persona, the online version, the character you play in every room.`,

      `The direct station is when what you have worked out about yourself privately starts showing up in how you behave. Less explaining, less adjusting, considerably less interest in being universally palatable.`,

      `Your body and appearance often feature here, since the first house rules both. The urge to change something visible is real, and Pluto rewards the version that reflects who you have become rather than the version designed to signal it.`,

      `The risk with this placement is control over perception: managing how you are read, monitoring the reception, never letting anybody see the draft. That management is exhausting, and it is the exact thing this transit is slowly dismantling.`,

      `One more layer worth knowing: Pluto in the first tends to attract intensity from other people. You become somebody who gets strong reactions, and learning to stop managing those reactions is a large part of what this transit is teaching.`,
    ],
    2: [
      `Aquarius sits across your second house, which puts Pluto into **your money, your possessions and your sense of your own value**. Your resources rather than anybody else's, and this transit runs long enough to genuinely restructure how you earn.`,

      `What Pluto does here is expose the arrangement underneath the income. What you will tolerate for money, what you have priced at nothing, who benefits from your labour, and whether your security depends on somebody else's decisions. Aquarius adds a collective angle: income through networks, community, technology and platforms rather than a single employer.`,

      `Somewhere in this transit the definition of security usually changes. Earning more stops being the whole answer, and control over how you earn starts mattering considerably more than the number attached to it.`,

      `The direct station is where an understanding about your worth starts affecting your actual pricing. A rate, a boundary, an invoice, a no.`,

      `Watch the compulsive edge, because Pluto in the second can turn money into a control mechanism: hoarding it, refusing to look at it, or using it to feel safe in a way no amount will ever satisfy.`,

      `Aquarius in this house also points toward income that comes from many places rather than one. Across this transit, plenty of people move from a single dependable source to a web of them, which feels less secure for about a year and considerably more secure after that.`,
    ],
    3: [
      `Aquarius sits across your third house, so Pluto is transforming **how you think, speak, learn and handle information**, along with siblings, neighbours and the everyday people you deal with without thinking.`,

      `This is a long excavation of your own mind. What you believe and why, where your opinions came from, which thoughts run automatically. Aquarius makes the information layer loud: what you consume, who you follow, and which discourse has quietly been shaping your conclusions.`,

      `Your voice tends to change across this transit. People with this placement often end up writing, speaking or teaching something they would never have touched before, usually the thing they understand from the inside.`,

      `The direct station is when something worked out internally starts getting said out loud. A conversation rehearsed for months, a position held privately, a truth a sibling relationship has needed for years.`,

      `The distortion to watch is obsessive thinking: the loop, the research spiral, the need to make an argument so airtight nobody could possibly disagree. Pluto in the third can turn the mind into a very sophisticated defence system.`,

      `There is a strong research quality to this placement as well. Pluto in the third produces people who go absurdly deep on one subject, and following that instinct properly, rather than treating it as a distraction, is usually where the next chapter comes from.`,
    ],
    4: [
      `Aquarius sits across your fourth house, which puts Pluto at **the foundations: home, family, roots, private life and everything installed in you before you had a vote**.`,

      `This is ancestral territory. Pluto here surfaces the family patterns nobody named, the arrangements everybody worked around, the emotional debts that got passed down. Aquarius brings a detachment that genuinely helps, since you can look at where you come from as a system rather than only as a wound.`,

      `Where you live and who you live with often changes considerably across this transit, sometimes more than once. The private life gets rebuilt to suit who you have become rather than who you were when you signed the lease.`,

      `The direct station is when something you have understood about your family starts changing how you behave with them. Boundaries that were theoretical in June become operational, and they hold better than the ones made in anger.`,

      `Watch for control at home: managing everybody's moods, keeping the peace at your own expense, or cutting family off entirely as the only available way to stop participating. There is usually a version between those two, and Pluto takes years to find it.`,

      `Pluto in the fourth also changes what home means to you. The definition tends to move from a place you were given to a place you built, and the version you build carries noticeably fewer rules that somebody else wrote.`,
    ],
    5: [
      `Aquarius sits across your fifth house, so Pluto is at work in **creativity, romance, pleasure, self-expression and whatever comes out of you**. This is the house of what you make, and Pluto refuses to let it stay decorative.`,

      `Creative work tends to get darker, stranger and more honest across this transit. The safe version stops being satisfying, and what you actually want to make starts being something you would previously have called too much. Aquarius pushes it toward the experimental, the collective and the internet-native.`,

      `Romance under this placement runs intense. Attractions arrive with a magnetic, slightly compulsive quality, and the ones that matter change you rather than simply accompany you.`,

      `The direct station is where a creative truth starts affecting what you make or show. The project you have been privately working out begins to exist somewhere other people can see it.`,

      `The shadow here is making your work a bid for approval, or treating a romance as a transformation programme. Pluto in the fifth can turn play into a proving ground, which takes the pleasure out of the one house that was supposed to have some.`,

      `This placement often changes your relationship with being watched while you create. Sharing the work stops being about approval at some point in this transit, which is the moment the work usually gets good.`,
    ],
    6: [
      `Aquarius sits across your sixth house, putting Pluto into **your daily work, your routines, your health and the people you deal with every day**. Unglamorous, and it accounts for most of your actual life.`,

      `Pluto here rebuilds how you work from the ground up, usually by making the old way untenable. Burnout, a role that outgrew its description, a workplace dynamic you finally see clearly. Aquarius adds the modern version: automation, remote work and technology reshaping what your job even is.`,

      `Health becomes a long-term theme rather than a passing one. Something the body has been signalling asks for a proper answer, and the answer generally involves the daily rather than the dramatic.`,

      `The direct station is when an understanding about your capacity starts changing your actual schedule: what you agree to, what you delegate, what time you stop.`,

      `Watch the control that hides inside routine. Optimising everything, measuring everything, treating your body as a system to be managed rather than lived in. Pluto in the sixth can turn discipline into a cage.`,

      `Colleagues and the everyday people you rely on feature strongly too. A working relationship can reveal a power dynamic that has been running for years, and Pluto in the sixth rarely lets that stay comfortable once it is visible.`,
    ],
    7: [
      `Aquarius sits across your seventh house, so Pluto is working directly on **partnership, agreements and the power between two people**. The most relationally intense placement available, and it runs for years.`,

      `What Pluto exposes here is the actual distribution of power in your closest relationships: who adjusts, who decides, who has to be managed, who carries the emotional weather. Aquarius pushes toward partnerships built on friendship, freedom and equality rather than tradition or need.`,

      `Relationships tend to either transform substantially or end across this transit. That is the nature of Pluto in this house rather than a prediction about yours: the arrangement gets renegotiated at a level most couples never reach.`,

      `The direct station is when something you have understood about a dynamic starts changing how you participate in it. The behaviour shifts first and the conversation usually follows.`,

      `The distortion to watch is the pull to control the other person's freedom, or to hand your own decisions over entirely and call that partnership. Both are Pluto in the seventh, and they can happen inside the same relationship.`,

      `There is also the projection layer, which this house specialises in. Pluto in the seventh slowly hands back the qualities you have been outsourcing to a partner, usually by putting you in a position where you have to use them yourself.`,
    ],
    8: [
      `Aquarius sits across your eighth house, which is Pluto's own house. The planet of power, depth and transformation is transiting the part of your chart that already governs **intimacy, sex, trust, shared money, debt, dependency, receiving and what happens when somebody else holds something you need**.`,

      `This is the most concentrated version of the transit available, and it is slow. The theme is access and control: what you require before you let somebody in, what happens in you when closeness starts to mean surrendering the upper hand, and how you behave when an outcome depends on another person.`,

      `Money and intimacy are the same subject in this house, which is why they surface together. The joint account, the loan, the business you are tied into, the inheritance, the arrangement where one of you has more leverage. Pluto does not let a financial entanglement sit unexamined for twenty years.`,

      `Receiving is the eighth house's hardest lesson and this transit is relentless about it. Being given to creates obligation, and obligation creates exposure, so plenty of people can earn beautifully and cannot accept help at all. Aquarius gives that a specific flavour: support from community and networks rather than from institutions.`,

      `The direct station is where something you have finally understood about trust, dependency or power starts changing what you do. A dynamic you can no longer participate in the same way. A financial arrangement that has to evolve. A fear around betrayal that has become nameable enough to stop running you invisibly.`,

      `Old fears about loss and abandonment get very visible under this placement, often with no current event to attach them to. That is the eighth house doing its job, bringing up what was installed long ago for inspection rather than for crisis.`,
    ],
    9: [
      `Aquarius sits across your ninth house, so Pluto is transforming **what you believe, what you study, where you travel and the framework you use to make sense of things**.`,

      `Belief systems get taken apart under this placement, thoroughly and usually more than once. Religion, politics, the philosophy you built your twenties on, the framework handed to you at home. Aquarius pushes toward the collective and the future-facing: what you think should happen rather than only what you think is true.`,

      `This transit frequently coincides with a long stretch of study, teaching or publishing, particularly about something you understand from the inside rather than from a syllabus.`,

      `The direct station is when a changed belief starts affecting your actual choices: where you go, what you will fund, what you will publicly stand behind.`,

      `The shadow here is conviction hardening into dogma, especially the online kind. Pluto in the ninth can make a person certain in a way that stops her learning anything new, which wastes a genuinely brilliant placement.`,

      `Travel can carry real weight under this placement. A journey somewhere that genuinely changes your framework, rather than a nice holiday, is very characteristic of Pluto in the ninth, and it often arrives at the point where the old worldview has stopped working.`,
    ],
    10: [
      `Aquarius sits across your tenth house, so Pluto is at work on **your career, your reputation, your authority and your relationship with public power**.`,

      `This placement tends to end one professional identity and build another across years. The first half often feels like loss: a role, an industry or a reputation you spent a decade building stops fitting. Aquarius points the rebuild toward the collective, the unconventional and the networked.`,

      `Power dynamics with bosses, clients and institutions become impossible to ignore. Who has authority over your time, what you have agreed to in exchange for status, and whether the ladder leads anywhere you want to arrive.`,

      `The direct station is where an understanding about your ambition starts changing your professional behaviour: what you say yes to, what you stop performing, whose approval you are no longer working for.`,

      `Watch the compulsive version, which is common here. Power pursued as protection, visibility chased as proof, and a career used to settle a question that was never professional in the first place.`,

      `The public element deserves a mention too, since Aquarius rules audiences. Pluto in the tenth can bring visibility you did not fully plan for, along with the accompanying discovery that being known by many people is a considerably stranger experience than wanting to be.`,
    ],
    11: [
      `Aquarius sits across your eleventh house, which is Aquarius in its own house. Everything this transit means collectively lands here personally: **friendship, networks, community, audiences, causes and the future you are building with other people**.`,

      `This is the most intensified version of Pluto in Aquarius available. Friendship groups transform or end. Communities that defined you stop fitting. New networks appear and become central faster than you expect. Your relationship with belonging gets rebuilt from the foundations.`,

      `Power inside groups becomes extremely visible with this placement. Who is included, who quietly sets the terms, who gets frozen out, and what it costs to be the one who names any of it. You will see the architecture, which is a gift and occasionally an inconvenience.`,

      `Online life features heavily: audiences, platforms, digital community, the version of you that exists in other people's feeds, and the particular power dynamics of being perceived by people you have never met.`,

      `The direct station is where something you have understood about a group starts changing your participation in it. Less performance, fewer rooms, and a much clearer sense of who you would choose again from scratch.`,

      `Being the outsider is the other half of this placement. Some people spend this transit finding their community, and others spend it finally making peace with standing slightly outside every one of them, which is its own form of belonging.`,
    ],
    12: [
      `Aquarius sits across your twelfth house, the most private placement Pluto can take. This is **the unconscious, the hidden, solitude, what you keep secret and what you keep secret from yourself**.`,

      `Much of this transit happens where nobody can see it, including you for long stretches. Dreams get vivid and instructive, old material surfaces with no obvious trigger, and a great deal reorganises underneath while the external life looks fairly unchanged.`,

      `Aquarius here can mean a slow withdrawal from the collective: less interest in being perceived, a real need for solitude, and a growing sense that the online version of your life costs more than it returns.`,

      `The direct station is when something worked out in private starts becoming visible in your choices. People often describe this as finally understanding a pattern they have lived inside for years, and the understanding itself changes the behaviour.`,

      `The shadow to watch is hiding: staying unavailable, choosing situations that cannot fully happen, and self-sabotage quiet enough to look like circumstance. Pluto in the twelfth asks you to bring one hidden thing into the light, generally one at a time.`,

      `There is frequently a spiritual or therapeutic thread here as well. Pluto in the twelfth tends to send people toward whatever practice actually reaches the unconscious, and the work done quietly during this transit shows up in the external life years later.`,
    ],
  },
  shadow: [
    `Pluto's shadow is **control**, and it arrives wearing whatever costume that particular sign supplies. In Aquarius, it tends to look principled, detached and entirely reasonable, which makes it harder to catch than the Scorpio version that at least has the decency to look intense.`,

    `The first form is managing how you're perceived. Curating the version of yourself the group sees, monitoring the reception, adjusting in real time, and calling all of that being self-aware. There's a lot of work involved in never being seen inaccurately, and the exhaustion is the tell.`,

    `Cutting people off pre-emptively is the second. Leaving a group, a friendship or a scene at the first ambiguous signal, before they can exclude you, then experiencing the loneliness as evidence that people are unreliable. The exit protects you from the rejection and also from finding out it wasn't coming.`,

    `Rebellion for its own sake belongs here too. Aquarius can reject the mainstream option purely because it's mainstream, which is still letting the group decide, just backwards. Real independence occasionally chooses the popular thing because it happens to be right.`,

    `Then there's the consumption: getting swallowed by a cause, a community, a discourse or an online world, to the point that your own life quietly stops being the main event. Pluto intensifies whatever it touches, and a movement or a platform can absorb a person entirely while feeling like purpose.`,

    `Groupthink is the flipside, and it's rarely obvious from inside. Holding a position because your people hold it, softening a disagreement into silence, and mistaking consensus for conviction. Aquarius is supposed to be the sign that notices this, which is exactly why it gets caught by it.`,

    `Wanting power while performing indifference to power is the most Aquarian shadow of all. The influence, the platform, the standing in the room, all genuinely wanted, all publicly dismissed as unimportant. Owning the want is usually what stops it running you.`,

    `The useful question, when any of this gets loud: is this change I actually want, or is sitting with the uncertainty simply harder than blowing something up. Pluto's distortion is almost always impatience with not knowing, dressed as decisiveness.`,

    `And a note on proportion, because Pluto gets talked about like a catastrophe. Most of this transit is not drama. It's a slow change in what you'll put up with, and the loudest version usually belongs to whoever is resisting it hardest.`,

    `There is also the version that looks like insight. Pluto gives real psychological sight, and it is entirely possible to use that sight to analyse everybody around you with devastating accuracy while never once turning it on yourself. Being right about other people is the most sophisticated avoidance available under this transit.`,

    `And a word on intensity as a habit. Pluto energy can become something you seek out, because the drama of a crisis is at least legible, while the slow ordinary work of changing a pattern is not. Noticing when you are manufacturing intensity to avoid boredom is genuinely part of this.`,
  ],
  bettysTake: [
    `Everybody wants Pluto to mean their glow-up. I'd like to gently redirect that, because Pluto's version of power has nothing to do with becoming louder, richer or more untouchable, and quite a lot to do with how much you've stopped pretending not to know.`,

    `Here's the pattern I see constantly in shadow work: somebody has known something for eighteen months. About a friendship, a group, a dynamic, an arrangement. They've known it and they've been negotiating with it, finding reasons, waiting for better evidence, hoping the situation resolves itself so they never have to be the one who says it. That negotiation costs more energy than the decision ever would.`,

    `Pluto direct is where the bargaining gets expensive. Once you've genuinely seen the pattern, you can't fully unsee it, and every extra month of participating in it anyway is a slow withdrawal from your own account. The power comes back the moment you stop arguing with something you already know.`,

    `On the Aquarius side, my actual take is about belonging, and it's the theme I'd sit with for the next few years rather than the next few weeks: you can belong somewhere without editing yourself down to fit it. Most women I work with have never tested that, because the edit happened so gradually that there was never a moment to object to.`,

    `Try it in one room this year. Say the unpopular thing in the group chat, admit you've changed your mind in public, mention the interest you've been keeping quiet because it doesn't fit the brand. Then notice who's still there. That's your actual community, and it's usually smaller and significantly better than the one you've been maintaining.`,

    `Witchy note, because Pluto genuinely deserves one: this is deeeep shadow work territory, and it works best done in the dark, slowly, without an audience. No announcement post about your transformation. Pluto does its best work unwitnessed and shows the results later, which is very annoying for those of us who like credit.`,
  ],
  move: {
    intro: `Pluto is slow, so this one is deliberate rather than urgent. The work is turning what became clear during the retrograde into something that actually changes your behaviour, and you have months rather than days.`,
    steps: [
      `Name the thing you've known since spring and have been negotiating with. One sentence, written down, no softening clause on the end. That sentence is the whole transit.`,

      `Work out what participating as usual now costs you, in energy rather than morality. Pluto responds to honest accounting and completely ignores good intentions.`,

      `Change one behaviour rather than one circumstance. What you agree to, what you answer, what you explain, what you no longer justify. Circumstances follow behaviour with this planet, rarely the other way round.`,

      `Audit the rooms. Which communities, chats and platforms you're in out of genuine choice, and which out of a decade of momentum. Leave nothing this week, just be honest about the list.`,

      `Say one true thing in a room where you've been softening yourself, and watch what survives it. Best experiment available under this transit.`,

      `Take something back offline or back into private. Pluto rules what stays hidden, and reclaiming a piece of your life from public consumption tends to return more power than any amount of posting.`,

      `Hold the irreversible decisions loosely for a few months. What's genuinely true now will still be true in February, and you'll be acting on it with considerably better information.`,
    ],
    byHouse: {
      1: `Change one visible thing about how you show up, chosen because it is true rather than because it signals something.`,
      2: `Reprice one thing: the rate, the retainer, or the arrangement you agreed to when your circumstances were completely different.`,
      3: `Say the thing you have been rehearsing, to the person it concerns, in the plainest available words.`,
      4: `Make one change to a family or household arrangement that has been running on inherited terms.`,
      5: `Put the version of your creative work you have been protecting somewhere at least one person can see it.`,
      6: `Change one daily arrangement that has been running on your goodwill rather than on anything mutual.`,
      7: `Put the real terms of your closest partnership into words, including the ones you have both been operating on silently.`,
      8: `Address one arrangement where money and closeness are tangled together, and one place where being given to makes you flinch.`,
      9: `Act on one belief that has genuinely changed: where your money goes, where you go, or what you will publicly back.`,
      10: `Decline one thing you would previously have accepted for the status attached to it.`,
      11: `Say one true thing in a group you have been performing for, and notice who is still there afterwards.`,
      12: `Give one hidden thing a witness: a person, a page, a professional, something outside your own head.`,
    },
  },
  journalPrompt:
    `What have I understood over the last few months that I can no longer pretend I do not know?`,
  journalByHouse: {
    1: `What have I outgrown about the version of myself that other people still expect?`,
    2: `What have I been accepting for money that I already know is below my rate?`,
    3: `Which of my strongest opinions did I actually arrive at, and which did I absorb?`,
    4: `Which pattern from home have I been carrying as though it were my personality?`,
    5: `What do I actually want to make, before I consider who it is for?`,
    6: `What is my daily life currently costing me, and what has it been buying?`,
    7: `What am I still doing in this relationship that I already know I cannot keep doing?`,
    8: `What have I learned about trust, intimacy, money or power that I can no longer pretend I do not know?`,
    9: `Which belief have I outgrown while continuing to live as though I still hold it?`,
    10: `Whose approval is my career currently organised around, and is that still somebody I respect?`,
    11: `Which of my communities would I choose again from scratch, and which am I in out of momentum?`,
    12: `What have I been keeping hidden, including from myself, that is ready to be looked at directly?`,
  },
  affirmation: `What I have seen clearly, I get to act on in my own time.`,
  affirmationByHouse: {
    1: `I get to be recognisably different from who I was, and nobody is owed the old version.`,
    2: `My security comes from what I can build and hold, and I decide what my work is worth.`,
    3: `My mind is mine to change, and saying what I think out loud is how I find out what I mean.`,
    4: `I choose what I keep from where I come from, and the rest can stay behind me.`,
    5: `What I create is mine first, and it is allowed to be strange.`,
    6: `My energy is a resource I allocate, and I stop spending it where it does not come back.`,
    7: `I can be close to someone without either of us holding the other in place.`,
    8: `I can let someone close without handing over the parts of me that keep me standing.`,
    9: `My worldview is allowed to change as I do, and certainty is not the same as understanding.`,
    10: `I build authority on what I actually know, and I stop auditioning for rooms I have outgrown.`,
    11: `I belong somewhere without editing myself down to fit it.`,
    12: `What I have carried privately does not have to stay private to stay mine.`,
  },
};

/** The written guide for a transit, or null where there isn't one and the composer takes over. */
export function guideFor(
  type: string,
  planet: string,
  sign: string | undefined,
): TransitGuide | null {
  if (type === "retrograde_start" && planet === "Venus" && sign === "Scorpio") return VENUS_RX_SCORPIO;
  if (type === "retrograde_end" && planet === "Pluto" && sign === "Aquarius") return PLUTO_DIRECT_AQUARIUS;
  return null;
}
