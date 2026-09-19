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
  bettysTake: string[];
  move: {
    intro: string;
    steps: string[];
    /** One extra action that only makes sense for this member's house. */
    byHouse: Record<number, string>;
  };
  journalPrompt: string;
  affirmation: string;
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

/** The written guide for a transit, or null where there isn't one and the composer takes over. */
export function guideFor(
  type: string,
  planet: string,
  sign: string | undefined,
): TransitGuide | null {
  if (type === "retrograde_start" && planet === "Venus" && sign === "Scorpio") return VENUS_RX_SCORPIO;
  return null;
}
