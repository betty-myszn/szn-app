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
    title: "become the main character",
    accent: "of your own damn life. 💜",
    intro: [
      "Somewhere between your first \"be nice\" and your four hundredth \"no worries at all!\" you got talked out of a VERY large personality, annnd this report is where you get it backkk, with nine chapters on your money, your visibility, your desire, your power and the big, outrageous life your chart has been pointing at this WHOLE time. 💜",
      "Every page is built from the sign AND the house of all fifteen of your placements, put together by hand for your exact chart, so it's about YOU and absolutely nobody elseee.",
    ],
    stats: [["9", "chapters from your chart"], ["15", "placements, by sign AND house"], ["60", "days of challenges"], ["90", "days of main character dates"]],
    shiftAccent: "when you read this. 🪩",
    shifts: [
      ["Saying \"no worries at all!\" with your whole jaw clenched", "Saying the no out loud, in a full sentence, then going back to your lunch"],
      ["Keeping the dream life saved in a notes app", "Diarying your boldest moves on the exact days the sky is SCREAMING your name"],
      ["Undercharging because asking for more gives you hives", "Knowing where your money is built to come from and going back for every last dollarrr 💸"],
      ["Hyping everyone else's launch from the front row", "Getting seen and known for what your chart says you're brilliant at"],
      ["Realising three days later that you made yourself small in that meeting", "Catching yourself in the moment and saying what you really think"],
      ["Editing what you want into something polite enough for brunch", "Saying exactly what you want, out loud, without shrinking it first 💋"],
    ],
    whatTitle: "everything inside",
    whatAccent: "the bad b*tch report.",
    items: [
      ["🧬", "01. Your Bad B*tch DNA", "Who you are at your core, read straight from your Sun, your Moon and your Rising, so you can see your real personality, your strengths and what you're here to do, before everybody else's opinions got involved."],
      ["💸", "02. Your Money Era", "Where your money is built to come from, where you've been undercharging, overgiving or waiting politely to be picked, annnd what to change so more of it lands in your accounttt."],
      ["📣", "03. Your Visibility Power", "How you're built to be SEEN, what you're meant to be known for, and how to post, pitch and walk into a room in a way that feels like you."],
      ["💋", "04. Your Desire + Magnetism", "Your Venus by sign AND house, which shows what you really want in love, money and life, annnd what draws people to you."],
      ["😈", "05. Your F*ck Around & Find Out Energy", "How you go after what you want, how you handle conflict and how to use your anger and your drive to get things DONE, babe."],
      ["🖤", "06. Your Dark Femme + Power", "The parts of you that got called too much, too loud, too intense and too difficult, and how to own ALLLL of them as your power."],
      ["🪞", "07. The Shadow Keeping You Small", "The exact pattern that kicks in right before you go big, why it's there and how to catch it and do something different."],
      ["🦄", "Old SZN to Next SZN", "Who you've been, what to leave behind, what to bring with you and who you're becoming next."],
      ["🚀", "08. Your Big Dream Energy", "Where life gets BIGGGG for you, the direction your chart is pointing you in and the dream you've been waaay too polite to say out loud."],
      ["👑", "09. Become That B*tch", "Where it all turns into action, with your moves, your challenges and your dates all ready to go. Pen out, babe."],
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
    readTitle: "the placements",
    readAccent: "behind your report.",
    reads: [
      ["🔭", "Sign AND house, fifteen times", "Your sign tells us how you do a thing and your house tells us where in your life you do it, so two Leos walk away with two completely different reports. Sorry to your horoscope app. 😘"],
      ["🌞", "Sun, Moon + Rising", "What you're here to become, what you need to feel safe andddd how people see you when you walk into a room, all read together to build your Bad B*tch DNA."],
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
      ["It lands in your inbox", "Your report arrives within 48 hours as a gorgeous designed PDF, yours foreverrr, to highlight and scribble ALLLL over."],
    ],
    closeTitle: "find out who you're",
    closeAccent: "here to be. 💜",
    closeBody: "Nine chapters, two 30-day challenges, ninety days of dates and a letter from your future self, all from your own chart and in your inbox within 48 hours.",
  },

  "rich-btch-rising": {
    tag: "💸 rich b*tch rising · everything you get",
    title: "learn how to make more $$$",
    accent: "through your astrology. 💸",
    intro: [
      "Your second, tenth and eighth houses, your Venus and your Jupiter all get read together in this one, so you can finally see how you're built to get PAID, where the family money stories and good-girl guilt have been running your account for agesss, and what your life looks like once you let yourself be rich, ambitious and VERY pleased with yourself about it. 💸",
      "I write every single one by hand and there are only 15 of them, annnd yours lands in your inbox as a designed PDF within 48 hours.",
    ],
    stats: [["5", "deep sections on your money"], ["5", "parts of your chart read together"], ["15", "made, each one by hand"], ["48", "hours to your inbox"]],
    shiftAccent: "with your money. 💰",
    shifts: [
      ["Typing \"whatever you think is fair!\" about your own invoice", "Saying your price out loud and sticking to it"],
      ["Feeling weirdly guilty the second money lands", "Letting yourself enjoy it, spend it and be VERY pleased with yourself"],
      ["Running your family's money fears on a loop", "Seeing which beliefs came from your family and choosing your ownnn"],
      ["Being talented, overbooked and underpaid", "Doing the kind of work that suits how you're built, at a price that reflects it 👑"],
      ["Staying in situations because leaving feels too expensive", "Building the independence to tell someone to F*CK RIGHT OFF when necessary"],
      ["Thinking about money a lot and doing nothing about it", "Trying new money practices, having the conversations and making different decisions from thisss week"],
    ],
    whatTitle: "everything inside",
    whatAccent: "rich b*tch rising.",
    items: [
      ["💰", "01. How you're built to make money", "Your second house, tenth house, Venus and Jupiter show your natural talents, how you earn best and where you've been undervaluing your gifts, so you can make money in a way that suits who you are. Being talented is lovely, but we'd quite like to get PAID for it too."],
      ["🌑", "02. Your money shadow", "Ohhhh, we're going THERE. The family money stories, inherited fears, guilt, shame and good-girl conditioning shaping how you earn, spend, save and receive, with personal shadow work prompts for the beliefs that have had more than enough access to your bank account."],
      ["👑", "03. Self-worth, receiving + being THAT baddie", "Your Venus and your house themes show where you've been overgiving, undercharging, people-pleasing or making yourself smaller to keep everybody else comfortable, then we work on you being successful, well-paid, ambitious and VERY pleased with yourself."],
      ["🔥", "04. Money, power + financial independence", "Your eighth house covers shared resources, intimacy, trust, dependency and power, so this is where we get into how you share money, negotiate and set boundaries, because every baddie deserves the freedom to make choices about her own damn life."],
      ["🪩", "05. Your rich b*tch era starts here", "Everything we've uncovered comes into your real life, with things to try, habits to side-eye, conversations to have and decisions to start making differently, because reading about how wealthy you could become is great fun and DOING something about it is even better."],
    ],
    extrasLabel: "💸 plus, your money practices",
    extras: [
      ["🪄", "Money manifestation practices", "Money magic written for YOUR chart, so you manifest the way you're built to receive instead of copying some guy's 5am morning routine."],
      ["🌑", "Shadow work prompts", "For the family money stories and good-girl guilt that have had waaay too much access to your bank account for far too longgg."],
      ["👑", "Affirmations", "For overgiving less, charging MOREEE and being outrageously pleased with yourself about every single invoice."],
      ["📈", "Practical next moves", "Real things to try, habits to side-eye, conversations to have and decisions to start making differently, starting thisss week."],
    ],
    readTitle: "the placements",
    readAccent: "behind your money.",
    reads: [
      ["🏦", "Your second house", "Your income, your talents and what you treat as valuable (you included), which is where we find what you're built to earn from."],
      ["🏆", "Your tenth house", "Your career, your reputation and your ambition, so what you want to be known for and paid for."],
      ["🔐", "Your eighth house", "Shared money, debt, trust and power, so how you handle joint finances and depending on other people."],
      ["💖", "Your Venus", "What you value, how you receive and where you've been giving it away for free, babe."],
      ["🍀", "Your Jupiter", "Where you grow and where your opportunities tend to come from, so you know where to put your energy."],
    ],
    forYou: [
      "You're brilliant at your work and your bank balance doesn't reflect it",
      "You over-give, under-charge and then feel weird about both",
      "You grew up with money stories you can recite in your mother's exact voice",
      "You want to be rich, ambitious and VERY pleased with yourself, starting now 💸",
    ],
    steps: [
      ["Spill your birth details", "Date, time and place go straight into checkout, and \"unknown\" is fine for the birth time if your family has been useless about it."],
      ["I write it by hand", "Your report gets written from your own chart, and it's one of only 15. 🕯️"],
      ["It lands in your inbox", "Your designed PDF arrives within 48 hours, ready to be read, highlighted and acted on."],
    ],
    closeTitle: "find out how you're",
    closeAccent: "built to get PAID. 💸",
    closeBody: "Five sections on your money, your shadow and your worth, plus practices, prompts, affirmations and real next moves, all from your own chart and all yours within 48 hours.",
  },

  "style-report": {
    tag: "👗 the baddie style report · everything you get",
    title: "dress to express your soul",
    accent: "and become your best self. 👗",
    intro: [
      "What you wear says who you are before you've even opened your mouth, babe, annnd your birth chart shows exactly who you are at soul level, so I read your Venus, your Rising, your Moon and your Human Design to work out how your best self dresses, then I go shopping for her and put ALLLL of it in your own personal style report. 👗",
      "You get your colours, your shapes, a few key outfits and the key items to build them, picked to your sizes and your budget, so you can start showing up in the world as your best self right awayyy.",
    ],
    stats: [["3", "placements + your Human Design"], ["1", "signature look, entirely yours"], ["5", "parts to your style report"], ["$111", "one payment, yours forever"]],
    shiftAccent: "when you get dressed. 👠",
    shifts: [
      ["Standing in front of a full wardrobe with nothing to wear", "Opening it and seeing clothes that feel like YOU, every single morning"],
      ["Saving your best outfits for some future version of you", "Wearing your best stuff NOW, out in the world, as the person you want to be"],
      ["Copying a look off someone's feed and feeling like you're in costume", "Wearing a signature look so YOU that people start asking where you got everything"],
      ["Forty-seven open tabs and one impulse buy with the tags still on", "A short list of the key pieces to buy next, in order"],
      ["Dressing to blend in and be no trouble to anybody", "Walking into every room looking like who you are on the inside 💋"],
    ],
    whatTitle: "everything inside",
    whatAccent: "your style report. 👗",
    items: [
      ["🎨", "Your best-self colour palette", "The colours your Venus, Rising and Moon are calling for, so you know exactly which ones light you up and which ones have been washing you out for yearsss."],
      ["✂️", "Your shapes, fabrics + silhouettes", "The cuts, fabrics and silhouettes your chart is BEGGING you to wear, so your clothes fit your body and feel like YOU."],
      ["👗", "A few key outfits, put together for you", "A few key looks from everyday to big night out, so you look like yourself everywhere you go, from the school run to the board meeting to the date you've been looking forward to allll week."],
      ["🛍️", "The key items to buy", "I go shopping for you, babeeee, and pick the few key items that will do the most for your look, with the links, picked to your sizes and your budget, so you know exactly where to start."],
      ["📋", "What stays, what goes + your next buys", "An honest edit of what still feels like you and what doesn't, plus your next-buys list in order, so every dollar you spend on clothes goes on things that suit you."],
    ],
    readTitle: "the placements",
    readAccent: "behind your style.",
    reads: [
      ["💖", "Your Venus: your taste", "The planet of beauty and pleasure shows what you're naturally drawn to, so this is where your palette and your taste come from."],
      ["🪞", "Your Rising: your first impression", "How the world clocks you the second you walk in, so this is where we make sure what people see matches who you are."],
      ["🌙", "Your Moon: what you feel amazing in", "What makes you feel safe, soft and completely yourself, annnd the reason some outfits have you glowing all day while others have you tugging at your waistband by lunch."],
      ["🧬", "Your Human Design", "Layered on top so your look matches the way your energy works and how you're designed to show up in the world."],
    ],
    forYou: [
      "You've got a full wardrobe, a full basket and no idea what your look is",
      "You keep saving your best outfits for a special occasion that never comes",
      "You'd looooove someone else to do the shopping, with taste, to your budget",
      "You want what you wear to say who you are before you've opened your mouth 💖",
    ],
    steps: [
      ["Pop your birth details in", "Date, time and place go straight into checkout, and \"unknown\" is fine for the birth time."],
      ["I grab your sizes + goals", "I'll be in your inbox asking for your sizes, your budget and your style goals, so everything I pick works on your body and your bank account."],
      ["I go shopping for you", "I use your chart and your budget to put together your colours, your shapes and your key outfits."],
      ["Your report lands, ready to shop", "It arrives in your inbox with your key outfits and key items inside, so you can start showing up as your best self right awayyy. 🛍️"],
    ],
    closeTitle: "start dressing like",
    closeAccent: "who you really are. 👗",
    closeBody: "Your colours, your shapes, a few key outfits, your next-buys list and the key items to get you started, all read from your chart and picked to your budget, so every time you get dressed you're expressing who you really are and becoming your best self out in the worlddd.",
  },
};
