// The sales copy behind each report's open-out micro page on /reports (8 Nov 2026). Everything
// claimed here has to be true of the report as it ships: chapters and extras come from each report's
// own sales page, and the style report from its approved copy. No reviews for the style report yet.

type Card = readonly [emoji: string, title: string, body: string];

export interface MicroPageCopy {
  tag: string;
  title: string;
  accent: string;
  intro: string[];
  stats: readonly (readonly [big: string, small: string])[];
  shiftAccent: string;
  shifts: readonly (readonly [before: string, after: string])[];
  whatTitle: string;
  whatAccent: string;
  items: readonly Card[];
  extrasLabel?: string;
  extras?: readonly Card[];
  readTitle: string;
  readAccent: string;
  reads: readonly Card[];
  forYou: string[];
  steps: readonly (readonly [title: string, body: string])[];
  closeTitle: string;
  closeAccent: string;
  closeBody: string;
}

export const MICRO_PAGES: Record<"bad-btch-report" | "rich-btch-rising" | "style-report", MicroPageCopy> = {
  "bad-btch-report": {
    tag: "💜 the bad b*tch report · everything you get",
    title: "meet the baddie",
    accent: "you were born to be.",
    intro: [
      "Somewhere between your first \"be nice\" and your four hundredth \"no worries at all!\" you got talked out of a VERY large personality, annnd this report is where you go and get her backkk, with nine chapters on your money, your visibility, your desire, your power and the big, outrageous life your chart has been pointing at this WHOLE time. 💜",
      "Every page is built from the sign AND the house of all fifteen of your placements, put together by hand for your exact chart, so what lands in your inbox reads like YOU with the volume turned all the way up.",
    ],
    stats: [["9", "chapters on becoming her"], ["15", "placements read twice"], ["60", "days of challenges"], ["90", "days of main character dates"]],
    shiftAccent: "the other side of this. 🪩",
    shifts: [
      ["Saying \"no worries at all!\" with your whole jaw clenched", "Saying the no out loud, in a full sentence, then going back to your lunch"],
      ["Keeping the dream life saved in a notes app", "Diarying your boldest moves on the exact days the sky is SCREAMING your name"],
      ["Undercharging because asking for more gives you hives", "Knowing where your money is built to come from and going back for every last dollarrr 💸"],
      ["Hyping everyone else's launch from the front row", "Getting SEEN for the thing your chart says you're here to get famous for"],
      ["Clocking the shrink three days later in the shower", "Catching it mid-sentence, rolling your eyes at it and goooing anyway"],
      ["Editing what you want into something polite enough for brunch", "Wanting it at full volume, specific, outrageous and entirely yours 💋"],
    ],
    whatTitle: "nine chapters of",
    whatAccent: "becoming HER.",
    items: [
      ["🧬", "01. Your Bad B*tch DNA", "The baddie you are when nobody's shrinking you, read straight from your Sun, your Moon and your Rising, so you finally get the full picture of how much of a LOT you're allowed to be. We love her, she's staying."],
      ["💸", "02. Your Money Era", "Where your money is built to come from, where you've been undercharging, overgiving or waiting politely to be picked, annnd how to march back for every last dollarrr you left on the table."],
      ["📣", "03. Your Visibility Power", "How you're wired to be SEEN and what you get known for once you come out of the group chat, which turns posting, pitching and walking into the room into something your whole chart is backing."],
      ["💋", "04. Your Desire + Magnetism", "Your Venus by sign AND house, so you can see what you want before you sand it down for public consumption, plus what makes you magnetic when you stop apologising for wanting it."],
      ["😈", "05. Your F*ck Around & Find Out Energy", "How you go after what you want and what happens to anyone silly enough to stand in the way, which means you get to stop pretending you don't have a temper and start aiming it somewhere profitable."],
      ["🖤", "06. Your Dark Femme + Power", "The parts of you that got called too much, too loud, too intense and too difficult by people who found them inconvenient. We're taking ALLLL of them back, with interest."],
      ["🪞", "07. The Shadow Keeping You Small", "The exact pattern that kicks in right before you go big, the one that feels like being sensible and keeps you parked in the same spot year after yearrr. Once it has a name, it loses its grip on the steering wheel."],
      ["🦄", "Old SZN to Next SZN", "A bridge between who you've been, what you're keeping and the baddie you're walking towards like it's a runway, so the change has somewhere to land."],
      ["🚀", "08. Your Big Dream Energy", "Where life gets BIGGGG for you and the direction your chart has been pointing this entire time, so the dream you've been waaay too polite to say out loud finally gets some real estate."],
      ["👑", "09. Become That B*tch", "The chapter where you stop reading about her and start BECOMING her, with your moves, your challenges and your dates all ready to go. Pen out, babe."],
    ],
    extrasLabel: "🔥 plus, the part you go and DO",
    extras: [
      ["💋", "6 affirmations written for your chart", "Two each from your Venus, your Saturn and your North Node, each with a line telling you exactly when to say it (usually right before you discount yourself againnn)."],
      ["✍️", "6 journal prompts that go deep", "Pulled from your South Node, your Chiron and your North Node, so you're journaling about YOUR patterns, and yesss, it gets juicy."],
      ["🔥", "5 Bad B*tch Moves", "One for your money, two for your power and two for your big dream, each one a real thing to go and DO this month, ideally in a great outfit."],
      ["🗓️", "Two 30-day challenges", "Sixty days of becoming her, week by week, built from your North Node sign and house. Accountability, but make it astrology. 🪐"],
      ["🎬", "Your main character dates", "The days in the next 90 when the sky is pointing straight at YOU, from your new and full moons to the Sun, Venus, Mars and Jupiter crossing your chart."],
      ["💌", "A letter from her", "The final page is written by your future self, a few years from now, from the life your chart says you're building. Keep tissues nearby, she gets emotional."],
    ],
    readTitle: "how your chart",
    readAccent: "writes this report.",
    reads: [
      ["🔭", "Sign AND house, fifteen times", "Your sign tells us how you do a thing and your house tells us where in your life you do it, so two Leos walk away with two completely different reports. Sorry to your horoscope app. 😘"],
      ["🌞", "Sun, Moon + Rising", "What you're here to become, what you need to feel safe andddd the first impression you've been walking into rooms with since birth, all read together to build your Bad B*tch DNA."],
      ["🧭", "South Node, Chiron + North Node", "Where you've been looping, where it stings and where you're headed. Your journal prompts come from all three, and your North Node builds your sixty days of challenges."],
    ],
    forYou: [
      "You've read every horoscope going and you're DONE with ones written for twelve million other people",
      "You keep shrinking right before the big moment and you want the exact reason, in writing, with your name on it",
      "You want a deep dive to highlight, reread and come back to every single season like a holy text 🪐",
      "You're ready for a plan with real dates on it, so this month is the month things start moving, BIGGG",
    ],
    steps: [
      ["Spill your birth details", "Date, time and place go straight into checkout, and if you don't know your birth time, write \"unknown\" and we work with everything else."],
      ["Check your confirmation", "An email with your birth details hits the second you pay, so you can double-check we've got them righttt."],
      ["She lands in your inbox", "Your report arrives within 48 hours as a gorgeous designed PDF, yours foreverrr, to highlight and scribble ALLLL over."],
    ],
    closeTitle: "she's been waiting",
    closeAccent: "for you to catch up. 💌",
    closeBody: "Nine chapters, sixty days of becoming her, ninety days of dates and a letter from your future self, all from your own chart and in your inbox within 48 hours, so by the end of this week you could be reading exactly who you're here to be with a highlighter in your hand.",
  },

  "rich-btch-rising": {
    tag: "💸 rich b*tch rising · everything you get",
    title: "your bank account",
    accent: "is about to meet HER.",
    intro: [
      "Your second, tenth and eighth houses, your Venus and your Jupiter all get read together in this one, so you can finally see how you're built to get PAID, where the family money stories and good-girl guilt have been running your account for agesss, and what your life looks like once you let yourself be rich, ambitious and VERY pleased with yourself about it. 💸",
      "I write every single one by hand and there are only 15 of them, annnd yours lands in your inbox as a designed PDF within 48 hours.",
    ],
    stats: [["5", "deep sections on your money"], ["5", "chart powerhouses read together"], ["15", "made, each one by hand"], ["48", "hours to your inbox"]],
    shiftAccent: "the other side of this. 💰",
    shifts: [
      ["Typing \"whatever you think is fair!\" about your own invoice", "Naming your number, adding tax and letting the silence do the negotiating"],
      ["Feeling weirdly guilty the second money lands", "Receiving it like you were always meant to have it, then being outrageously pleased with yourself"],
      ["Running your family's money fears on a loop", "Seeing exactly whose story that was, then handing it straight back to them"],
      ["Being talented, overbooked and underpaid", "Doing the kind of work that suits how you're built, at a price that reflects it 👑"],
      ["Staying in situations because leaving feels too expensive", "Building the independence to tell someone to F*CK RIGHT OFF when necessary"],
      ["Reading about wealth like it's a hobby", "Trying new money practices, having the conversations and making different decisions from thisss week"],
    ],
    whatTitle: "five sections of",
    whatAccent: "getting PAID.",
    items: [
      ["💰", "01. How you're built to make money", "Your second house, tenth house, Venus and Jupiter show your natural talents, how you earn best and where you've been undervaluing your gifts, so making money starts feeling like something YOU would do. Being talented is lovely, but we'd quite like to get PAID for it too."],
      ["🌑", "02. Your money shadow", "Ohhhh, we're going THERE. The family money stories, inherited fears, guilt, shame and good-girl conditioning shaping how you earn, spend, save and receive, with personal shadow work prompts for the beliefs that have had more than enough access to your bank account."],
      ["👑", "03. Self-worth, receiving + being THAT baddie", "Your Venus and your house themes show where you've been overgiving, undercharging, people-pleasing or making yourself smaller to keep everybody else comfortable, then hand you the permission slip to be successful, well-paid, ambitious and VERY pleased with yourself."],
      ["🔥", "04. Money, power + financial independence", "Your eighth house covers shared resources, intimacy, trust, dependency and power, so this is where we get into how you share money, negotiate and set boundaries, because every baddie deserves the freedom to make choices about her own damn life."],
      ["🪩", "05. Your rich b*tch era starts here", "Everything we've uncovered comes into your real life, with things to try, habits to side-eye, conversations to have and decisions to start making differently, because reading about how wealthy you could become is great fun and DOING something about it is even better."],
    ],
    extrasLabel: "💸 plus, the magic you get to keep",
    extras: [
      ["🪄", "Money manifestation practices", "Money magic written for YOUR chart, so you manifest the way you're built to receive instead of copying some guy's 5am morning routine."],
      ["🌑", "Shadow work prompts", "For the family money stories and good-girl guilt that have had waaay too much access to your bank account for far too longgg."],
      ["👑", "Affirmations", "For overgiving less, charging MOREEE and being outrageously pleased with yourself about every single invoice."],
      ["📈", "Practical next moves", "Real things to try, habits to side-eye, conversations to have and decisions to start making differently, starting thisss week."],
    ],
    readTitle: "where your money",
    readAccent: "lives in your chart.",
    reads: [
      ["🏦", "Your second house", "Your income, your talents and what you treat as valuable (you included), which is where we find what you're built to earn from."],
      ["🏆", "Your tenth house", "Your career, your reputation and your ambition, or what you want to be known for and paid for in public."],
      ["🔐", "Your eighth house", "Shared money, debt, trust and power, the deeeep end of who holds what and what it costs you to depend on anybody."],
      ["💖", "Your Venus", "What you value, how you receive and where you've been giving it away for free, babe."],
      ["🍀", "Your Jupiter", "Where life gets generous with you and where your opportunities like to grow, so you can stop looking for them in the wrong postcode."],
    ],
    forYou: [
      "You're brilliant at your work and your bank balance has not been informed",
      "You over-give, under-charge and then feel weird about both",
      "You grew up with money stories you can recite in your mother's exact voice",
      "You want to be rich, ambitious and VERY pleased with yourself, starting now 💸",
    ],
    steps: [
      ["Spill your birth details", "Date, time and place go straight into checkout, and \"unknown\" is fine for the birth time if your family has been useless about it."],
      ["I get obsessed with your money", "Your report gets written by hand from your own chart, one of only 15, with a candle lit and absolutely no chill. 🕯️"],
      ["It lands in your inbox", "Your designed PDF arrives within 48 hours, ready to be read, highlighted and acted on before your next invoice goes out."],
    ],
    closeTitle: "rich looks",
    closeAccent: "VERY good on you. 💸",
    closeBody: "Five sections on your money, your shadow and your worth, plus practices, prompts, affirmations and real next moves, all from your own chart and all yours within 48 hours, so the next number you say out loud has your whole birth chart standing behind it.",
  },

  "style-report": {
    tag: "👗 the baddie style report · everything you get",
    title: "get dressed as her",
    accent: "before you've 'earned' it.",
    intro: [
      "Your best self already has a look, babe, and it's written all over your chart, so I read your Venus, your Rising, your Moon and your Human Design to work out exactly how she dresses, then I go shopping for her and put ALLLL of it in your own personal style report. 👗",
      "Your colours, your shapes, real outfits and a shopping link for every single piece, picked to your sizes and your budget, with no Zoom call to get camera-ready for.",
    ],
    stats: [["3", "placements + your Human Design"], ["1", "signature look, entirely yours"], ["100%", "of the pieces linked"], ["0", "Zoom calls to get ready for"]],
    shiftAccent: "the other side of this. 👠",
    shifts: [
      ["Standing in front of a full wardrobe with nothing to wear", "Opening it and seeing outfits that make you want to leave the house immediately"],
      ["Saving the good stuff for when you've got the body, the job or the man", "Getting dressed NOW as the version of you who already has the life she wants"],
      ["Copying a look off someone's feed and feeling like you're in costume", "Wearing a signature look so HER that people start asking where you got everything"],
      ["Forty-seven open tabs and one impulse buy with the tags still on", "A next-buys list in order, with the link for every single piece"],
      ["Dressing to be appropriate, invisible and no trouble to anybody", "Walking in looking exactly like the baddie your Rising said you were 💋"],
    ],
    whatTitle: "your whole wardrobe,",
    whatAccent: "read from your chart.",
    items: [
      ["🎨", "Your best-self colour palette", "The colours your Venus, Rising and Moon are calling for, so you know exactly what to reach for when you want to look expensive, magnetic or like you've slept for nine hours."],
      ["✂️", "Your shapes, fabrics + silhouettes", "What your chart is BEGGING you to wear, from the cuts that make you feel like a threat to the fabrics you can't stop touching, so getting dressed starts feeling good on your actual body."],
      ["👗", "Real outfits, put together for you", "Full looks from everyday to big night out, so the school run, the board meeting and the date you're pretending not to care about all get the same main character treatment."],
      ["🛍️", "Shopping links for every piece", "I go shopping for you, babeeee, so every single piece comes with its link, picked to your sizes and your budget, and all you have to do is press the button."],
      ["📋", "What stays, what goes + your next buys", "A ruthless little edit of what's earning its hanger, plus your next-buys list in order, so the money you spend on clothes starts building a look instead of a pile."],
    ],
    readTitle: "how your chart",
    readAccent: "gets you dressed.",
    reads: [
      ["💖", "Your Venus: your taste", "The planet of beauty and pleasure knows what you find gorgeous before anybody told you what you should like, so this is where your palette and your love of a good fabric come from."],
      ["🪞", "Your Rising: your first impression", "How the world clocks you the second you walk in, which makes it the placement deciding what you want people to read from across the room."],
      ["🌙", "Your Moon: what you feel amazing in", "Your emotional comfort zone, annnd the reason some outfits have you glowing all day while others have you tugging at your waistband by lunch."],
      ["🧬", "Your Human Design", "Layered on top so your look fits how your energy moves through a day, because a baddie needs clothes that can keep up with her."],
    ],
    forYou: [
      "You've got a full wardrobe, a full basket and no idea what your look is",
      "You've been saving your best self's outfits for a later that keeps moving",
      "You'd looooove someone else to do the shopping, with taste, to your budget",
      "You want every morning to feel like stepping into the life you're building 💖",
    ],
    steps: [
      ["Pop your birth details in", "Date, time and place go straight into checkout, and \"unknown\" is fine for the birth time."],
      ["I grab your sizes + goals", "I'll be in your inbox asking for your sizes, your budget and your style goals, so everything I pick works on your body and your bank account."],
      ["I go shopping for you", "Your chart meets your budget, and I build your colours, your shapes and your outfits one piece at a time."],
      ["Your report lands, ready to shop", "It arrives in your inbox with every link inside, so you can start wearing her right away. 🛍️"],
    ],
    closeTitle: "she's already dressed.",
    closeAccent: "your turn, babe. 👗",
    closeBody: "Your colours, your shapes, real outfits, your next-buys list and a shopping link for every piece, all read from your chart and picked to your budget, so every time you get dressed you're stepping into the version of you who already has the life you want.",
  },
};
