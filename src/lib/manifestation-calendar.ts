// The Manifestation Calendar. Every date below was calculated from the ephemeris (true positions);
// day labels are US Eastern to match the rest of the platform, with UK time alongside.

export interface CalendarDay {
  id: string;
  date: string;
  time: string;
  /** Hidden the day after this moment. */
  at: number;
  emoji: string;
  title: string;
  meaning: string;
  intention: string;
  ritual: string;
  journal: string;
}

export interface CalendarMonth {
  month: string;
  focus: string;
  days: CalendarDay[];
}

const at = (iso: string) => Date.parse(iso);

export const MANIFESTATION_CALENDAR: CalendarMonth[] = [
  {
    month: "november",
    focus: "Take your power back, get your worth straight and let the stuck things MOVE.",
    days: [
      {
        id: "scorpio-new-moon", date: "mon 9 nov", time: "2:02am ET · 7:02am UK", at: at("2026-11-09T07:02:00Z"), emoji: "🌑",
        title: "new moon in scorpio",
        meaning: "A brand new start for everything you've been too scared to say out loud.",
        intention: "I say what I really want and I go after it.",
        ritual: "Write your realest wish on paper, fold it three times and keep it under your pillow until the Full Moon.",
        journal: "Write down the wish you've never told anybody.",
      },
      {
        id: "portal-1111", date: "wed 11 nov", time: "our circle: 1pm ET · 6pm UK", at: at("2026-11-11T18:00:00Z"), emoji: "🪄",
        title: "the 11/11 portal + our first circle",
        meaning: "The biggest manifesting date of the year, and we're doing it together, LIVE.",
        intention: "I am ready to receive everything on my list.",
        ritual: "At 11:11, stop wherever you are, put a hand on your heart and say your biggest wish out loud.",
        journal: "Write your most delusional wishlist. Aim for 11 things, babe.",
      },
      {
        id: "mercury-direct", date: "fri 13 nov", time: "11am ET · 4pm UK", at: at("2026-11-13T16:00:00Z"), emoji: "💬",
        title: "mercury goes direct in scorpio",
        meaning: "Mercury stops going backwards, so mixed messages, late replies and tech meltdowns start to clear.",
        intention: "I speak up and I get clear answers.",
        ritual: "Delete ten old messages, screenshots or emails that bring you down.",
        journal: "Write out the conversation you've been avoiding, word for word.",
      },
      {
        id: "venus-direct", date: "fri 13 nov", time: "7:30pm ET · 12:30am Sat UK", at: at("2026-11-14T00:30:00Z"), emoji: "💖",
        title: "venus goes direct in libra",
        meaning: "After six weeks going backwards, the planet of love and money turns forward. Whatever's been stuck in your love life or your bank account can start to move.",
        intention: "I know what I'm worth and I charge for it.",
        ritual: "Put on your favourite scent, look in the mirror and tell yourself three things you love.",
        journal: "List everything you stopped accepting over the last six weeks.",
      },
      {
        id: "sun-sagittarius", date: "sun 22 nov", time: "2:30am ET · 7:30am UK", at: at("2026-11-22T07:30:00Z"), emoji: "🏹",
        title: "sagittarius szn begins",
        meaning: "Bad b*tch szn hands over to adventure szn, and you get to start thinking BIGGER.",
        intention: "I say yes to the bigger life.",
        ritual: "Pin up a picture of somewhere you're going next year, right where you'll see it every day.",
        journal: "Describe the trip, course or leap you keep calling \"one day\".",
      },
      {
        id: "gemini-full-moon", date: "tue 24 nov", time: "9:53am ET · 2:53pm UK", at: at("2026-11-24T14:53:00Z"), emoji: "🌕",
        title: "full moon in gemini",
        meaning: "Full moons are for harvest and letting go. This one lights up your words, your ideas and who you're talking to.",
        intention: "I only spend my words on what I want more of.",
        ritual: "Write down the sentence about yourself that has to go, then tear it up under the moon.",
        journal: "Write what people hear from you first, then what you'd love them to hear.",
      },
      {
        id: "mars-virgo", date: "wed 25 nov", time: "7pm ET · midnight UK", at: at("2026-11-26T00:00:00Z"), emoji: "🗂️",
        title: "mars moves into virgo",
        meaning: "Your action planet gets organised, which makes this the moment to build the system behind the dream.",
        intention: "I do the boring bit and I get the big result.",
        ritual: "Clear one drawer, one folder or one inbox before bed.",
        journal: "Write the three smallest steps that would move your biggest goal this week.",
      },
    ],
  },
  {
    month: "december",
    focus: "Dream big, keep what's truly yours and walk into 2027 with a plan.",
    days: [
      {
        id: "venus-scorpio", date: "fri 4 dec", time: "3:30am ET · 8:30am UK", at: at("2026-12-04T08:30:00Z"), emoji: "🖤",
        title: "venus moves into scorpio",
        meaning: "Love and money get deep and a little bit obsessive, which is perfect for real intimacy and serious money talks.",
        intention: "I let myself be wanted, all of me.",
        ritual: "Light a red candle and write a love letter to the part of you you've been hiding.",
        journal: "Write what you really want from love, with zero editing.",
      },
      {
        id: "mercury-sagittarius", date: "sun 6 dec", time: "4am ET · 9am UK", at: at("2026-12-06T09:00:00Z"), emoji: "🗣️",
        title: "mercury moves into sagittarius",
        meaning: "Your mouth gets braver, babe. Big ideas and honest conversations are on the menu.",
        intention: "I tell the truth and I make it fun.",
        ritual: "Send one voice note telling someone exactly why they're brilliant.",
        journal: "Write the opinion you've been keeping to yourself.",
      },
      {
        id: "sagittarius-new-moon", date: "tue 8 dec", time: "7:51pm ET · 12:51am Wed UK", at: at("2026-12-09T00:51:00Z"), emoji: "🌑",
        title: "new moon in sagittarius",
        meaning: "A fresh start for travel, learning and believing in yourself, and the best date of the month to set a 2027 goal.",
        intention: "I believe in the big version of my life.",
        ritual: "Write three things you're calling in for 2027 and seal them in an envelope.",
        journal: "Write a full day of your life, one year from now.",
      },
      {
        id: "saturn-direct", date: "thu 10 dec", time: "7pm ET · midnight UK", at: at("2026-12-11T00:00:00Z"), emoji: "🪨",
        title: "saturn goes direct in aries",
        meaning: "The planet of hard lessons turns forward, so the thing you've been grinding on starts to get traction.",
        intention: "I back myself and I keep going.",
        ritual: "Stand tall, feet apart, and say one promise to yourself out loud.",
        journal: "Write down what this year taught you about your own strength.",
      },
      {
        id: "jupiter-retrograde", date: "sat 12 dec", time: "8pm ET · 1am Sun UK", at: at("2026-12-13T01:00:00Z"), emoji: "🍀",
        title: "jupiter goes retrograde in leo",
        meaning: "The planet of luck and growth starts going backwards, so growth turns inward for a few months. Check your dreams are still YOURS.",
        intention: "I only chase the dreams that belong to me.",
        ritual: "Cross one goal off your list that you only wanted for the likes.",
        journal: "Sort your goals into two lists: mine, and other people's.",
      },
      {
        id: "solstice", date: "mon 21 dec", time: "4pm ET · 9pm UK", at: at("2026-12-21T21:00:00Z"), emoji: "👑",
        title: "capricorn szn + the winter solstice",
        meaning: "The Sun moves into Capricorn on the shortest day of the northern year, and CEO szn begins.",
        intention: "I build what lasts.",
        ritual: "Light a candle at sunset, then name one thing you're finished with and one thing you're starting.",
        journal: "Write the job description for who you're becoming in 2027.",
      },
      {
        id: "cancer-full-moon", date: "wed 23 dec", time: "8:28pm ET · 1:28am Thu UK", at: at("2026-12-24T01:28:00Z"), emoji: "🌕",
        title: "full moon in cancer",
        meaning: "A full moon on home, family and feelings, right before the holidays, so protect your energy.",
        intention: "I belong to myself first.",
        ritual: "Wash your hands in salt water and say \"what isn't mine can leave\".",
        journal: "Write down what you need to feel safe and held over the holidays.",
      },
      {
        id: "mercury-capricorn", date: "fri 25 dec", time: "1:30pm ET · 6:30pm UK", at: at("2026-12-25T18:30:00Z"), emoji: "📈",
        title: "mercury moves into capricorn",
        meaning: "Your brain switches on for next year, so the 2027 ideas start landing.",
        intention: "I plan for the life I'm calling in.",
        ritual: "Open a fresh notes page and title it 2027.",
        journal: "Write three money moves you're making in January.",
      },
    ],
  },
];
