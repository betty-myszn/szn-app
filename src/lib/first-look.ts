// The first thing a brand new member reads about herself, and the first thing she says in the chat.
//
// Onboarding used to reveal her Big 3 and Venus with a generic label under each ("your core
// identity"), which tells her what a sun sign IS rather than what she is like. These lines are the
// "oh my god that's so me" moment, one per placement, short enough to read on a phone in one go.
//
// The four lines render together on one screen, so they are written as a set: every sun line opens
// on "You", every moon line on something inward, every rising line on how other people see her,
// every venus line on love. That keeps the four cards from ever sharing an opening, whichever
// combination of signs she has. Keep that split when editing.

export const SUN_FIRST_LOOK: Record<string, string> = {
  Aries: "You were built to go first, so you start the thing, say the thing and send the text before anyone else has finished drafting theirs, and that impatience is a huge part of your magic.",
  Taurus: "You play the long game with verrry expensive taste, building slowly and beautifully until something is properly yours, and once you've decided, there is almost nothing anyone can do to move you.",
  Gemini: "You collect ideas, people and open tabs like it's a sport, with a brain that runs about six conversations at once and gets bored the second something stops teaching you anything new.",
  Cancer: "You feel everything first and explain it later, you remember what everyone told you three years ago, and the people you love get a level of care that borders on witchcraft.",
  Leo: "You were made to be seen and to make other people feel seen too, so when you walk in fully lit the whole room gets warmer, and when you dim yourself everyone can tell.",
  Virgo: "You notice the tiny detail everyone else missed and quietly fix it, because your standards come from being able to see exactly how good things could be if people just tried a little harder.",
  Libra: "You make everything prettier, fairer and more fun just by being involved, and you can see every side of an argument at once, which is exactly why choosing a restaurant takes you forty minutes.",
  Scorpio: "You clock what's really going on within about four seconds, you only let a tiny handful of people all the way in, and when you want something you go after it with a focus that scares people a little.",
  Sagittarius: "You say the true thing out loud before anyone else dares to, and your optimism is soooo contagious that people end up following you on adventures they swore they'd never go on.",
  Capricorn: "You think in decades when most of the group chat is thinking about the weekend, quietly building the empire while they're still talking about theirs, and you're funnier than anyone expects once they've earned it.",
  Aquarius: "You were born slightly ahead of everyone, you poke at every rule to see if it holds up, and your weird little ideas have a habit of becoming everybody else's normal a few years later.",
  Pisces: "You pick up on moods, dreams and vibes that other people can't even name, and you drift between this world and a much prettier one, with an imagination big enough to live inside.",
};

export const MOON_FIRST_LOOK: Record<string, string> = {
  Aries: "Deep down you process feelings by DOING something with them, so a bad mood gets burned off at the gym or in one very direct conversation, and being told to calm down makes it ten times worse.",
  Taurus: "Underneath it all you need comfort you can actually touch, like soft sheets, good food and people who stay the same, and once you feel safe you're the steadiest person anyone knows.",
  Gemini: "Emotionally you have to talk it out, text it out or write it out before it makes any sense, so the right conversation with the right person can fix a whole week.",
  Cancer: "Inside there's a whole ocean, and you need a home base and a few people who feel like family before you can properly relax, because you look after everyone and deserve that softness back.",
  Leo: "Deep down your heart runs on warmth and being appreciated out loud, so one bit of genuine praise at the right moment can carry you for dayyys.",
  Virgo: "Emotionally you calm yourself down by sorting something out, whether that's a drawer, a spreadsheet or somebody else's problem, because feeling useful is how you feel safe.",
  Libra: "Inside you need peace, beauty and people you feel in sync with, so conflict throws your whole system off and you're at your happiest when love flows both ways.",
  Scorpio: "Underneath the calm face there's a verrry deep emotional world, so you need total honesty before you'll trust anyone, and you'd much rather hear a hard truth than a sweet lie.",
  Sagittarius: "Emotionally you need space and something to look forward to, so when you feel stuck you book the trip, start the course or find a bigger way of seeing the whole thing.",
  Capricorn: "Deep down you learned early to handle everything yourself, so you feel safest when life has structure and you can see progress, and letting people help you is your big growth edge.",
  Aquarius: "Inside you process feelings by stepping back and thinking them through, which means you need plenty of freedom and a community you belong to, while one-on-one closeness takes you a little longer.",
  Pisces: "Emotionally you soak up everyone's mood like a sponge, so you need alone time, music and something creative to come back to yourself, and your intuition is scarily accurate.",
};

export const RISING_FIRST_LOOK: Record<string, string> = {
  Aries: "People clock you as bold, quick and a tiny bit intimidating before you've said a word, like you've got somewhere much more exciting to be.",
  Taurus: "People read you as calm, grounded and quietly expensive, the friend with the best skin, the best playlist and the most reassuring energy in the room.",
  Gemini: "Strangers find you instantly chatty, funny and easy to talk to, and you probably look a few years younger than you are, which you will absolutely take.",
  Cancer: "People feel safe with you within minutes, which is why they tell you their whole life story at parties, and your face gives away every single thing you're feeling.",
  Leo: "The room notices you the second you walk in, with main character hair, a big warm laugh and a presence that makes people want to be in your orbit.",
  Virgo: "First impressions of you are polished, clever and put together, the one everybody assumes has a colour-coded calendar (and they're usually right).",
  Libra: "People find you charming, stylish and soooo easy to be around, which is why you're the one everyone wants to sit next to at dinner.",
  Scorpio: "Strangers pick up on your intensity before you've even spoken, and that magnetic, slightly mysterious energy leaves people a little obsessed with working you out.",
  Sagittarius: "People see you as the fun one with the best stories and the loudest laugh, giving the energy of someone who just got back from somewhere amazing.",
  Capricorn: "First impressions of you are capable and very much in charge, so people take you seriously on sight, and the dry humour underneath comes as a lovely surprise.",
  Aquarius: "The room reads you as original, cool and a bit unexpected, the person nobody can quite put in a box, which is exactly how you like it.",
  Pisces: "People describe you as dreamy, soft and a little otherworldly, with a 'there's just something about you' quality nobody can quite explain.",
};

export const VENUS_FIRST_LOOK: Record<string, string> = {
  Aries: "Love hits you fast and hot, and you fall for confidence and a bold move, much preferring fireworks to months of mixed signals.",
  Taurus: "In love you're loyal, sensual and seriously spoil-worthy, and you want someone steady who turns up with the good wine and keeps turning up.",
  Gemini: "Romance starts in your brain, so the funniest, quickest mind in the room gets your attention, and anyone who can keep the banter going has you for life.",
  Cancer: "In love you want to feel held and chosen, so you fall for people who feel like home and then love them with your whole heart.",
  Leo: "Love for you should feel like a movie, with big gestures and being openly adored, and you give that same generous devotion right back.",
  Virgo: "In love you show up through thoughtful little acts of care, falling for competence and kindness and remembering every detail about the people you adore.",
  Libra: "Romance is basically your art form, so charm, great manners and anyone who makes life feel lovelier will get you every time.",
  Scorpio: "In love it's all or nothing for you, with deep trust and chemistry that feels almost psychic, and casual has never really been your thing.",
  Sagittarius: "Love has to feel like an adventure for you, so you fall for people who make you laugh, widen your world and give you plenty of room to roam.",
  Capricorn: "In love you're loyal and serious about it, falling for ambition and people who keep their promises, and you show it by building a real future together.",
  Aquarius: "Love starts with friendship for you, so you fall for originality and people who respect your independence and love talking big ideas at 2am.",
  Pisces: "Romance for you is soulful and dreamy, and you fall for creativity and kindness, loving with a tenderness that feels almost spiritual.",
};

function seedIndex(seed: string, size: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % size;
}

// Her first message in the general chat, pre-written from her own chart and goal so saying hello
// costs her one tap. Written in her voice, not Betty's. Several variants because a run of identical
// intros stacked in one room reads as a form everyone filled in, and the seed keeps each member on
// the same one if the step re-renders. Every variant carries her Big 3, since that is the bit the
// room replies to, and ends by handing the room something to answer.
const INTRO_VARIANTS: readonly string[] = [
  "hiiii I'm {name} 💜 {big3}. What I'm calling in this szn: {goal}, so somebody please hold me to it 👀 What are your Big 3?",
  "Just walked in and I'm already obsessed 🪩 I'm {name}, {big3}. The big goal for this szn: {goal}. Who else is working on something like that? 💜",
  "Hey besties, {name} here 💜 {big3}, which explains soooo much about me. What I'm going after this szn: {goal}. Drop your Big 3 so I can meet you properly 👀",
  "{name} has entered the chat 🪩 {big3}. My one big thing this szn: {goal}, and I want the whole room cheering me on. Tell me your Big 3 💜",
];

export interface IntroInput {
  name: string;
  sun?: string;
  moon?: string;
  rising?: string;
  goal?: string;
  seed: string;
}

export function composeIntroPost({ name, sun, moon, rising, goal, seed }: IntroInput): string {
  const first = name.trim().split(/\s+/)[0] || "new here";
  const big3 = [
    sun && `${sun} sun`,
    moon && `${moon} moon`,
    rising && `${rising} rising`,
  ]
    .filter(Boolean)
    .join(", ");
  // Goals are typed as anything from "launch my business" to two full sentences. Trailing full
  // stops come off so the template's own punctuation reads cleanly, and a capital is dropped only
  // when the next letter is lowercase, so "Launch my business" softens but "UGC deals" survives.
  // The goal step is required, so an empty goal only happens if she lands here some other way; the
  // fallback is still something she'd plausibly say, and the whole post is editable before it goes.
  let g = (goal ?? "").trim().replace(/[.!\s]+$/, "");
  if (g.length > 1 && /[A-Z]/.test(g[0]) && /[a-z]/.test(g[1])) g = g[0].toLowerCase() + g.slice(1);
  if (!g) g = "being the most me I've ever been";

  return INTRO_VARIANTS[seedIndex(seed, INTRO_VARIANTS.length)]
    .replace("{name}", first)
    .replace("{big3}", big3 || "chart fresh out the oven")
    .replace("{goal}", g);
}
