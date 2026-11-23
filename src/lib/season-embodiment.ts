// Embodiment exercises for the season itself, as opposed to the single exercise each lunation
// carries in lunation-long.ts. These are done in the body and on the page rather than read, and
// /your-season/embody renders each one as an interactive version of the workshop slide it came
// from, in the same design.
//
// Libra's set comes from the Aries Full Moon workshop (Call In Your Venus Era, 26 Sep 2026).
// The Full Moon in Libra szn always falls in Aries, the opposite end of the axis, so this set works
// all season. Anything that only made sense on the night (the release ritual, "before this Moon
// wanes") has been left out. A sign without a set returns null, and the page and its dashboard link
// stay hidden for that szn.

import type { JournalEntryType } from "@/lib/journal-store";

interface ExerciseBase {
  id: string;
  /** Short label for the index at the top of the page. */
  label: string;
  minutes: number;
  /** The pink strip across the top of the slide, as separate items. */
  ticker: string[];
  eyebrow: string;
  /** Headline in two parts: the black line, then the pink line. */
  title: [string, string];
  intro: string;
  /** The pink band across the foot of the slide. */
  band: string;
  journal?: { prompt: string; type: JournalEntryType };
}

export interface DialExercise extends ExerciseBase {
  kind: "dial";
  me: { label: string; sub: string };
  we: { label: string; sub: string };
  areas: string[];
  note: string;
  /** Result lines for areas leaning to each end. Default to the Libra wording. */
  weNote?: string;
  meNote?: string;
}

export interface AuditExercise extends ExerciseBase {
  kind: "audit";
  steps: string[];
  example: { bent: string; cost: number; reclaim: string };
  threshold: number;
  /** First column header and placeholder. Default to the Libra wording. */
  head?: string;
  placeholder?: string;
}

export interface VenusExercise extends ExerciseBase {
  kind: "venus";
  statementLead: string;
}

export interface ReceivingExercise extends ExerciseBase {
  kind: "receiving";
  why: string;
  steps: { head: string; sub: string }[];
}

export interface RetireExercise extends ExerciseBase {
  kind: "retire";
  shifts: { was: string; becoming: string }[];
}

export interface TappingExercise extends ExerciseBase {
  kind: "tapping";
  howItWorks: string;
  points: { name: string; where: string }[];
  /** The second slide, where the script lives. */
  script: { ticker: string[]; title: string };
  setup: string;
  rounds: { name: string; lines: string[] }[];
}

export type EmbodimentExercise =
  | DialExercise
  | AuditExercise
  | VenusExercise
  | ReceivingExercise
  | RetireExercise
  | TappingExercise;

export interface Spell {
  id: string;
  emoji: string;
  name: string;
  date: string;
  why: string;
  need: string;
  steps: string[];
  say: string;
  /** The exercise on this page that prepares her for this spell. */
  prep: string;
  /** Her one personal line, from the house the season is moving through. */
  personal: (house: string, title: string) => string;
}

export interface SeasonEmbodiment {
  sign: string;
  /** Where the set comes from, with the replay to point at. A set written for the szn rather
   *  than taken from a workshop has none. */
  source?: { title: string; replayHref: string };
  ticker: string[];
  title: [string, string];
  lede: string;
  asks: string;
  chips: { label: string; value: string }[];
  arrive: {
    title: [string, string];
    steps: string[];
    rules: { head: string; sub: string }[];
    band: string;
  };
  exercises: EmbodimentExercise[];
  /** Dated spells for the season, shown straight after the hero. */
  spells?: Spell[];
}

const LIBRA: SeasonEmbodiment = {
  sign: "Libra",
  source: { title: "Call In Your Venus Era", replayHref: "/events/replays#libra-szn-workshop-1" },
  ticker: ["libra szn", "me and we", "your venus", "receiving", "astrotapping™"],
  title: ["me and we.", "you're allowed both."],
  lede:
    "Every Libra szn the Full Moon lands in Aries, right at the other end of the axis, so this whole season runs as a conversation between what YOU want and what the we needs. These exercises come straight from the Call In Your Venus Era workshop, rebuilt so you can do them any day of the szn: tap them, fill them in and save the good stuff to your journal.",
  asks: "what do i want, and what do we need?",
  chips: [
    { label: "sun in", value: "libra" },
    { label: "ruled by", value: "venus" },
    { label: "full moon in", value: "aries" },
  ],
  arrive: {
    title: ["this is a space", "for wanting out loud."],
    steps: ["Hand on your heart.", "Feet flat on the floor.", "Three slow, deep breaths.", "Ask: what am I here to claim today?"],
    rules: [
      { head: "notifications off.", sub: "Give yourself these few minutes. You deserve your own full attention." },
      { head: "every want is welcome.", sub: "Big, small, selfish, secret. It all gets to exist in here." },
      { head: "write the real thing.", sub: "Your journal is for your eyes only. Say what you actually mean." },
      { head: "feel it in your body.", sub: "Notice where the want lives. Your body knows first." },
    ],
    band: "three breaths. then we begin.",
  },
  exercises: [
    {
      kind: "dial",
      id: "me-or-we",
      label: "me or we",
      minutes: 4,
      ticker: ["me or we", "aries", "libra", "who comes first", "find your balance"],
      eyebrow: "me vs we",
      title: ["me", "or we?"],
      intro: "Where are you putting others first, and where are you putting yourself first? Tap where you honestly sit right now in each part of your life, the answer you'd give if nobody was reading over your shoulder.",
      me: { label: "aries · me first", sub: "My needs. My way. My timing." },
      we: { label: "libra · others first", sub: "Their comfort. Keep the peace." },
      areas: ["love", "family", "friends", "work", "money", "my time"],
      note: "Neither end is wrong. Healthy is being able to choose.",
      band: "the dot furthest from the middle is where the work is.",
    },
    {
      kind: "audit",
      id: "compromise-audit",
      label: "the compromise audit",
      minutes: 8,
      ticker: ["me vs we", "the audit", "where i bent", "what it cost", "reclaim"],
      eyebrow: "the me vs we szn",
      title: ["the compromise", "audit."],
      intro: "You're allowed the me AND the we. This one shows you exactly where the we has been quietly taking more than its share, and what you want back.",
      steps: [
        "List three places you said yes to keep the peace.",
        "Score what each one cost YOU, 0 to 10.",
        "Anything 7 or above: write what you're taking back.",
      ],
      example: { bent: "Agreed to his family's plans for the holiday. Again.", cost: 7, reclaim: "Booking the trip I actually want." },
      threshold: 7,
      band: "me and we. you're allowed both.",
      journal: { prompt: "The compromise audit: where I said yes to keep the peace, what it cost me and what I'm taking back.", type: "shadow work" },
    },
    {
      kind: "venus",
      id: "your-venus",
      label: "say your venus out loud",
      minutes: 5,
      ticker: ["your venus", "sign", "house", "element", "your magnetism"],
      eyebrow: "your venus placement",
      title: ["build your", "venus profile."],
      intro: "Venus rules Libra, so this szn runs on YOUR Venus. Your sign is your flavour of desire and your house is where your magnetism lives. We've filled your card in from your chart, so finish the last line, then say all three out loud.",
      statementLead: "I attract money, love and pleasure through",
      band: "say your statement out loud. then go and use it this week.",
      journal: { prompt: "My Venus magnetism statement, and how I'm using it this week.", type: "reflection" },
    },
    {
      kind: "receiving",
      id: "receiving-drill",
      label: "the receiving drill",
      minutes: 3,
      ticker: ["receiving", "reps", "the flinch", "let it land", "thank you"],
      eyebrow: "your receiving capacity",
      title: ["the receiving", "drill."],
      intro: "You receive what your body feels safe holding, and receiving is a skill you build in the body. Tick each step off as you do it.",
      why: "You can't receive a Venus era if you can't receive a compliment. This is reps for your nervous system, and it gets easier every single time.",
      steps: [
        { head: "Say it out loud: “I am so good at what I do.”", sub: "Palms up. Feet on the floor. To the room or the mirror." },
        { head: "Notice the flinch.", sub: "The cringe, the laugh, the urge to add “kind of”." },
        { head: "Rate it 0 to 10.", sub: "How hard was that to say and actually mean?" },
        { head: "Breathe into it. Say it again.", sub: "Slower. Softer. Let it land this time, then rate it again." },
        { head: "Close with: “Thank you. I receive that.”", sub: "No deflecting. No “oh, this old thing”." },
      ],
      band: "every rep raises the ceiling.",
    },
    {
      kind: "retire",
      id: "retire-her",
      label: "retire her",
      minutes: 5,
      ticker: ["the identity shift", "thank her", "release her", "who i am now", "effective today"],
      eyebrow: "the identity shift",
      title: ["retire", "her."],
      intro: "Every identity you've outgrown had a job. It kept you safe. Pick the one Libra szn is done with and write her a proper retirement letter. She's earned it.",
      shifts: [
        { was: "The one who waits.", becoming: "the one who asks." },
        { was: "The easy one.", becoming: "the honest one." },
        { was: "The over-giver.", becoming: "the receiver." },
        { was: "The one proving herself.", becoming: "the one choosing herself." },
        { was: "The quiet wanter.", becoming: "the one who wants out loud." },
      ],
      band: "thank her. then let her go.",
      journal: { prompt: "My notice of retirement: the version of me I'm letting go of this Libra szn.", type: "shadow work" },
    },
    {
      kind: "tapping",
      id: "tap-out-too-much",
      label: "tap out the “too much”",
      minutes: 6,
      ticker: ["astrotapping™", "clear it", "tap it out", "the too much feeling", "embody her"],
      eyebrow: "astrotapping™",
      title: ["tap out the", "“too much.”"],
      intro: "It shows up the second you ask for more. Rate the feeling first, then tap through the points with the script below.",
      howItWorks: "Two fingers. Gentle, steady taps, about seven on each point. Say each line out loud and let yourself feel it.",
      points: [
        { name: "karate chop", where: "Outer edge of your hand" },
        { name: "eyebrow", where: "Where your brow begins" },
        { name: "side of eye", where: "On the bone, outer corner" },
        { name: "under eye", where: "On the cheekbone" },
        { name: "under nose", where: "Above your top lip" },
        { name: "chin", where: "The crease below your lip" },
        { name: "collarbone", where: "Just below the collarbone" },
        { name: "under arm", where: "A hand below the armpit" },
        { name: "top of head", where: "The crown of your head" },
      ],
      script: { ticker: ["astrotapping™", "the script", "name it", "soften it", "claim it"], title: "say it. tap it. let it move." },
      setup: "“Even though I feel like too much the second I ask for more, I love and accept myself and I'm allowed to want this.”",
      rounds: [
        { name: "name it", lines: ["This too much feeling.", "Who am I to want all this?", "Scared they'll call me greedy.", "What if I get it and lose it?", "Too much. Too loud. Too big."] },
        { name: "soften it", lines: ["What if I'm exactly enough?", "What if wanting this is safe?", "What if my desire is sacred?", "This feeling can soften now.", "I'm safe to take up space."] },
        { name: "claim it", lines: ["I'm allowed to want more.", "I'm available to receive it.", "My desire is safe with me.", "I'm calling in my Venus era.", "And so it is."] },
      ],
      band: "rate it again. 0 to 10. notice what moved.",
      journal: { prompt: "Astrotapping™ the “too much” feeling: where it started and where it landed.", type: "win" },
    },
  ],
};

const SCORPIO_SPELLS: Spell[] = [
  {
    id: "money",
    prep: "grip-or-give",
    emoji: "🤑",
    name: "the money spell",
    date: "friday 13 november",
    why: "Friday is Venus's day, the moon is growing and she's in Capricorn, the sign of serious money.",
    need: "a green or gold candle, a bay leaf, a pen and a coin",
    steps: [
      "Write the exact amount you're calling in on the bay leaf. A REAL number, babyyyy, with all the zeros.",
      "Light the candle, hold the leaf and coin to your chest and say the words three times.",
      "Burn the leaf in a heatproof dish, or tuck it in your purse. The coin lives in your purse until the Full Moon on 24 November.",
      "Within 24 hours, make one real money move: send the invoice, raise the price or ask for the raise.",
    ],
    say: "Money loves me, money finds me, money stays. I am ready for $[your number]. So it is.",
    personal: (house, title) => `Scorpio szn is moving through your ${house} house of ${title}, so look there first for the money you've been leaving on the table.`,
  },
  {
    id: "power",
    prep: "power-audit",
    emoji: "🔥",
    name: "the power spell",
    date: "tuesday 17 november",
    why: "Tuesday is Mars's day, Mars is Scorpio's original ruler, and today's half moon is all about taking action.",
    need: "a red or black candle, paper, a pen and a mirror",
    steps: [
      "Write down everyone and everything you've handed your power to this year. The ex, the boss, the group chat, the number on the scale, ALL of it.",
      "Light the candle, stand at the mirror and read each one out loud, saying \"I'm taking it back\" after every name. Look yourself in the eye, babe, even when it's awkward.",
      "Flip the paper and write three things you'll do now your power is home.",
      "Put your hand on your belly and say the words. Do one of the three within 24 hours.",
    ],
    say: "What I gave away comes home to me. My voice, my body, my money, my magic. All of it is MINE.",
    personal: (house, title) => `Your ${house} house of ${title} is where this szn wants your power back first, babe.`,
  },
  {
    id: "cord",
    prep: "retire-the-nice-girl",
    emoji: "✂️",
    name: "the cut the cord spell",
    date: "saturday 21 november",
    why: "Saturday is Saturn's day, the planet of boundaries. It's the last night of Scorpio szn, and the Aries moon gives you the guts.",
    need: "a white candle, paper, a pen, black thread and scissors",
    steps: [
      "Write the name of the person, habit or old version of you that's DONE.",
      "Light the candle. Tie one end of the thread around the paper and hold the other end.",
      "Say everything you've never said, out loud. Swear, cry, go offfff.",
      "Cut the thread and say the words.",
      "Put the paper and thread in an outside bin. Before bed, block, delete or cancel whatever needs it.",
    ],
    say: "I thank you, I release you, I'm done. What's mine stays with me. What's yours goes with you.",
    personal: (house, title) => `Anything draining your ${house} house of ${title} goes on that paper first.`,
  },
];

/** The sticker on an exercise that says which spell it belongs to. */
export function exerciseSpellTag(exerciseId: string): string | null {
  if (exerciseId === "tap-out-too-intense" || exerciseId === "tap-out-unrealistic") return "🪄 tap this in after any spell";
  const spell = [...SCORPIO_SPELLS, ...SAGITTARIUS_SPELLS].find((s) => s.prep === exerciseId);
  return spell ? `${spell.emoji} prep for ${spell.name} · ${spell.date}` : null;
}

// Scorpio's set was written for the szn itself rather than taken from a workshop deck, so it has no
// source. It reuses the dial, audit, retire and tapping kinds around Bad B*tch SZN: where you hand
// your power away, where you white-knuckle it, the versions of you that kept you small, and the
// "too intense" feeling that shows up the second you stop hiding.
const SCORPIO: SeasonEmbodiment = {
  sign: "Scorpio",
  spells: SCORPIO_SPELLS,
  ticker: ["scorpio szn", "bad b*tch szn", "your power", "no more hiding", "astrotapping™"],
  title: ["take it back.", "all of it."],
  lede:
    "Scorpio szn is Bad B*tch SZN, the month you find every place you handed your power to somebody else and bring it home. The Full Moon lands in Taurus this szn, right across the axis, so the whole season runs between what you're gripping and what you're finally ready to let go of. Do these any day of the szn: tap them, fill them in and save the good stuff to your journal.",
  asks: "where did i give it away, and what am i taking back?",
  chips: [
    { label: "sun in", value: "scorpio" },
    { label: "ruled by", value: "pluto + mars" },
    { label: "full moon in", value: "taurus" },
  ],
  arrive: {
    title: ["this is a space", "for the real you."],
    steps: ["Hand on your belly.", "Feet flat on the floor.", "Three slow, deep breaths.", "Ask: what am I ready to stop hiding today?"],
    rules: [
      { head: "notifications off.", sub: "These few minutes are yours. Nobody else gets a say in them." },
      { head: "the dark stuff is welcome.", sub: "Jealous, petty, furious, obsessed. It all gets to exist in here." },
      { head: "write the real thing.", sub: "Your journal is for your eyes only. Say what you actually mean." },
      { head: "feel it in your body.", sub: "Notice where you're gripping. Your body knows first." },
    ],
    band: "three breaths. then we go deep.",
  },
  exercises: [
    {
      kind: "dial",
      id: "grip-or-give",
      label: "grip or give it away",
      minutes: 4,
      ticker: ["your power", "grip it", "give it away", "where it leaks", "take it back"],
      eyebrow: "where your power lives",
      title: ["grip it", "or give it away?"],
      intro: "Power leaks two ways: you hand it to someone else, or you hold it so tight nothing gets to move. Tap where you honestly sit right now in each part of your life, the answer you'd give if nobody was reading over your shoulder.",
      me: { label: "grip · control it all", sub: "My plan. No surprises. Trust nobody." },
      we: { label: "give it away · their call", sub: "Whatever they want. Shrink to fit." },
      areas: ["love", "money", "family", "friends", "work", "my body"],
      note: "Your power lives in the middle: held, never white-knuckled.",
      weNote: "you've been handing your power over here. Start your power audit right here.",
      meNote: "you've been white-knuckling this one. Scorpio szn wants you to loosen your grip and let it change.",
      band: "the dot furthest from the middle is where the work is.",
    },
    {
      kind: "audit",
      id: "power-audit",
      label: "the power audit",
      minutes: 8,
      ticker: ["bad b*tch szn", "the audit", "where i gave it", "what it cost", "take it back"],
      eyebrow: "the bad b*tch szn",
      title: ["the power", "audit."],
      intro: "Every time you shrank to keep someone comfortable, you handed them a little piece of your power. This one shows you exactly who's been holding it, and what you're taking back.",
      steps: [
        "List three places you gave your power away: a person, a habit or a story.",
        "Score what each one cost YOU, 0 to 10.",
        "Anything 7 or above: write how you're taking it back.",
      ],
      example: { bent: "Let his mood decide how my whole weekend went.", cost: 8, reclaim: "Making my plans first and inviting him into them." },
      threshold: 7,
      head: "where i gave it away",
      placeholder: "where I handed my power over",
      band: "your power. your call. effective now.",
      journal: { prompt: "The power audit: where I gave my power away, what it cost me and how I'm taking it back.", type: "shadow work" },
    },
    {
      kind: "retire",
      id: "retire-the-nice-girl",
      label: "retire the nice girl",
      minutes: 5,
      ticker: ["the identity shift", "thank her", "release her", "who i am now", "effective today"],
      eyebrow: "the identity shift",
      title: ["retire the", "nice girl."],
      intro: "The version of you who hid it, softened it and kept everyone comfortable had a job. She kept you safe. Pick the one Scorpio szn is done with and write her a proper retirement letter. She's earned it.",
      shifts: [
        { was: "The one who hides it.", becoming: "the one who shows it." },
        { was: "The over-explainer.", becoming: "the one whose no is a full sentence." },
        { was: "The nice girl.", becoming: "the powerful one." },
        { was: "The one who keeps the peace.", becoming: "the one who keeps her power." },
        { was: "The one who saw it coming and said nothing.", becoming: "the one who trusts what she knows." },
      ],
      band: "thank her. then let her go.",
      journal: { prompt: "My notice of retirement: the version of me I'm letting go of this Scorpio szn.", type: "shadow work" },
    },
    {
      kind: "tapping",
      id: "tap-out-too-intense",
      label: "tap out the “too intense”",
      minutes: 6,
      ticker: ["astrotapping™", "clear it", "tap it out", "the too intense feeling", "embody her"],
      eyebrow: "astrotapping™",
      title: ["tap out the", "“too intense.”"],
      intro: "It shows up the second you stop hiding how deep you feel and how much you want. Rate the feeling first, then tap through the points with the script below.",
      howItWorks: "Two fingers. Gentle, steady taps, about seven on each point. Say each line out loud and let yourself feel it.",
      points: [
        { name: "karate chop", where: "Outer edge of your hand" },
        { name: "eyebrow", where: "Where your brow begins" },
        { name: "side of eye", where: "On the bone, outer corner" },
        { name: "under eye", where: "On the cheekbone" },
        { name: "under nose", where: "Above your top lip" },
        { name: "chin", where: "The crease below your lip" },
        { name: "collarbone", where: "Just below the collarbone" },
        { name: "under arm", where: "A hand below the armpit" },
        { name: "top of head", where: "The crown of your head" },
      ],
      script: { ticker: ["astrotapping™", "the script", "name it", "soften it", "claim it"], title: "say it. tap it. let it move." },
      setup: "“Even though I've been told I'm too intense, too much and too deep, I love and accept myself and my depth is safe with me.”",
      rounds: [
        { name: "name it", lines: ["This too intense feeling.", "Tone it down, they said.", "Scared I'll scare them off.", "Safer to keep it hidden.", "Too deep. Too dark. Too much."] },
        { name: "soften it", lines: ["What if my depth is the gift?", "What if the right people can handle me?", "What if showing it is safe now?", "This feeling can soften now.", "I'm safe to be all of me."] },
        { name: "claim it", lines: ["My intensity is my power.", "I take my power back now.", "The real me is safe to be seen.", "I'm stepping into my Bad B*tch era.", "So it is."] },
      ],
      band: "rate it again. 0 to 10. notice what moved.",
      journal: { prompt: "Astrotapping™ the “too intense” feeling: where it started and where it landed.", type: "win" },
    },
  ],
};

const SAGITTARIUS_SPELLS: Spell[] = [
  {
    id: "big-dream",
    prep: "dream-audit",
    emoji: "🏹",
    name: "the big dream spell",
    date: "tuesday 8 december",
    why: "It's the New Moon in Sagittarius, the one night of the year the sky is literally made for planting your biggest dream.",
    need: "a purple or gold candle, paper, a pen and a glass of water",
    steps: [
      "Write your dream at FULL size, no editing, as if it's already happened. Date it 2027 and write it in the present tense: \"I live in…\", \"I earn…\", \"I am…\".",
      "Light the candle and read it out loud three times, slower every time. Let yourself feel how good it is to be her.",
      "Hold the glass of water over the page, say the words, then drink the whole thing. You're taking the dream INTO your body, babyyyy.",
      "Fold the paper towards you and sleep with it under your pillow tonight.",
      "Within 24 hours, do one thing she would do. Send the email, book the call, look at the flights.",
    ],
    say: "I stop shrinking my dreams to fit. This is mine, I'm ready for it, and it's already on its way. So it is.",
    personal: (house, title) => `Sagittarius szn is moving through your ${house} house of ${title}, so write the dream for that part of your life first, babe.`,
  },
  {
    id: "luck",
    prep: "realistic-or-ridiculous",
    emoji: "🍀",
    name: "the luck spell",
    date: "thursday 10 december",
    why: "Thursday is Jupiter's day, Jupiter rules Sagittarius and is the planet of luck, and two days after the New Moon the Moon is in Capricorn, so this luck comes with a plan attached.",
    need: "an orange or gold candle, a pinch of ground cinnamon, a coin and a pen",
    steps: [
      "Write three lucky breaks you're calling in. Make them specific: the client, the yes, the offer, the open door.",
      "Light the candle and hold the coin in your palm while you read them out loud.",
      "Stand at your front door, put the cinnamon in your palm and blow it INTO your home while you say the words.",
      "The coin goes in your purse until your next birthday. Every time you see it, say \"lucky me\".",
      "Say yes to the next invitation that scares you a little. That's the luck arriving.",
    ],
    say: "Luck loves me. Doors open for me. I say yes to the life that's bigger than the one I planned. Lucky me.",
    personal: (house, title) => `Ask for at least one of your lucky breaks in your ${house} house of ${title}, that's where the szn is pointing.`,
  },
  {
    id: "vision",
    prep: "retire-the-realist",
    emoji: "✨",
    name: "the 2027 vision spell",
    date: "monday 21 december",
    why: "It's the last day of Sagittarius szn and the winter solstice, when the Sun moves into Capricorn and the light starts coming back. The dreaming turns into building tonight.",
    need: "a white candle, paper, an envelope and a pen",
    steps: [
      "At sunset, light the candle and write a letter FROM the you of December 2027, to the you sitting here now.",
      "Have her tell you everything: what happened, what it felt like and the brave move that changed it all.",
      "Read it out loud, then write one thing you'll do in January to start it.",
      "Seal it, write \"open 21 December 2027\" on the front and say the words.",
      "Put the envelope somewhere you'll see it every day, like your mirror or your altar.",
    ],
    say: "I've already met her. I know the way. 2027, I'm coming for all of it.",
    personal: (house, title) => `Let her tell you what changed in your ${house} house of ${title}, the szn has been working on it all month.`,
  },
];

// Sagittarius's set was written for Big Dream SZN (SZN-THEMES-Q4-2026.md), not taken from a
// workshop. Same four kinds as Scorpio: how much she's editing each dream down, the dreams she shrank
// and what that costs her, the realist who kept her safe, and the "unrealistic" feeling that shows
// up the second she says the real dream out loud. Spell dates are 2026, from the ephemeris in ET.
const SAGITTARIUS: SeasonEmbodiment = {
  sign: "Sagittarius",
  spells: SAGITTARIUS_SPELLS,
  ticker: ["sagittarius szn", "big dream szn", "full size", "no more editing", "astrotapping™"],
  title: ["dream it full size.", "then go get it."],
  lede:
    "Sagittarius szn is Big Dream SZN, the month you stop editing your dreams down to what feels realistic, sensible or comfortable for everybody else. Jupiter, the planet of luck and expansion, rules this whole season, so the sky is backing the BIG version. Do these any day of the szn: tap them, fill them in and save the good stuff to your journal.",
  asks: "what would i choose if it didn't have to be realistic?",
  chips: [
    { label: "sun in", value: "sagittarius" },
    { label: "ruled by", value: "jupiter" },
    { label: "new moon in", value: "sagittarius" },
  ],
  arrive: {
    title: ["this is a space", "for the big dream."],
    steps: ["Hand on your heart.", "Feet flat on the floor.", "Three slow, deep breaths.", "Ask: what do I actually want, if nobody gets a vote?"],
    rules: [
      { head: "notifications off.", sub: "These few minutes are yours. The group chat can wait." },
      { head: "no editing allowed.", sub: "Write the dream the size it really is, not the size that feels allowed." },
      { head: "nobody else gets a vote.", sub: "Not your mum, not your ex, not your followers. Just you." },
      { head: "feel it in your body.", sub: "Notice where you light up. That's your yes." },
    ],
    band: "three breaths. then we dream big.",
  },
  exercises: [
    {
      kind: "dial",
      id: "realistic-or-ridiculous",
      label: "full size or edited down",
      minutes: 4,
      ticker: ["big dream szn", "full size", "edited down", "where you shrink it", "dream bigger"],
      eyebrow: "how big are you dreaming",
      title: ["full size", "or edited down?"],
      intro: "Every dream comes in two sizes: the one you really want, and the version you've trimmed down so it feels sensible. Tap where you honestly sit right now in each part of your life.",
      me: { label: "full size · the real dream", sub: "What I'd choose if nobody was watching." },
      we: { label: "edited down · the safe version", sub: "What feels realistic and allowed." },
      areas: ["money", "love", "career", "visibility", "lifestyle", "confidence"],
      note: "Big Dream SZN wants every dot dragged to the full-size end.",
      weNote: "you've been editing this dream down to fit. Start your dream audit right here.",
      meNote: "you're already dreaming full size here, babe. Your work is putting a date on it.",
      band: "the dots nearest the safe end are where the work is.",
    },
    {
      kind: "audit",
      id: "dream-audit",
      label: "the dream audit",
      minutes: 8,
      ticker: ["big dream szn", "the audit", "the dream i shrank", "what it costs", "the first move"],
      eyebrow: "big dream szn",
      title: ["the dream", "audit."],
      intro: "Every time you said \"I'd be happy with…\" about something you wanted SO much more of, you shrank a dream. This one shows you which ones, what playing small is costing you, and the first move back to full size.",
      steps: [
        "List three dreams you've edited down: the business, the money, the love, the move.",
        "Score what keeping it small costs YOU, 0 to 10.",
        "Anything 7 or above: write the first move towards the full-size version.",
      ],
      example: { bent: "Said a side hustle would be enough when I want my own business.", cost: 9, reclaim: "Booking a call this week with someone who's already done it." },
      threshold: 7,
      head: "the dream i edited down",
      placeholder: "the dream I made smaller",
      band: "full size. starting now.",
      journal: { prompt: "The dream audit: the dreams I edited down, what playing small costs me and my first move back to full size.", type: "win" },
    },
    {
      kind: "retire",
      id: "retire-the-realist",
      label: "retire the realist",
      minutes: 5,
      ticker: ["the identity shift", "thank her", "release her", "who i am now", "effective today"],
      eyebrow: "the identity shift",
      title: ["retire the", "realist."],
      intro: "The version of you who kept it sensible, planned for the worst and talked you out of the big stuff had a job. She kept you from getting hurt. Pick the one Sagittarius szn is done with and write her a proper retirement letter. She's earned it.",
      shifts: [
        { was: "The realist.", becoming: "the one who believes first." },
        { was: "The one waiting for proof.", becoming: "the one who goes before she's ready." },
        { was: "The one who plays it safe.", becoming: "the one who says yes to the adventure." },
        { was: "The one who settles.", becoming: "the one who chooses what she actually wants." },
        { was: "The one who keeps it small so nobody's uncomfortable.", becoming: "the one who takes up the whole sky." },
      ],
      band: "thank her. then let her go.",
      journal: { prompt: "My notice of retirement: the version of me I'm letting go of this Sagittarius szn.", type: "shadow work" },
    },
    {
      kind: "tapping",
      id: "tap-out-unrealistic",
      label: "tap out the “unrealistic”",
      minutes: 6,
      ticker: ["astrotapping™", "clear it", "tap it out", "the unrealistic feeling", "embody her"],
      eyebrow: "astrotapping™",
      title: ["tap out the", "“unrealistic.”"],
      intro: "It shows up the second you say the real dream out loud: the voice that says who do you think you are. Rate the feeling first, then tap through the points with the script below.",
      howItWorks: "Two fingers. Gentle, steady taps, about seven on each point. Say each line out loud and let yourself feel it.",
      points: [
        { name: "karate chop", where: "Outer edge of your hand" },
        { name: "eyebrow", where: "Where your brow begins" },
        { name: "side of eye", where: "On the bone, outer corner" },
        { name: "under eye", where: "On the cheekbone" },
        { name: "under nose", where: "Above your top lip" },
        { name: "chin", where: "The crease below your lip" },
        { name: "collarbone", where: "Just below the collarbone" },
        { name: "under arm", where: "A hand below the armpit" },
        { name: "top of head", where: "The crown of your head" },
      ],
      script: { ticker: ["astrotapping™", "the script", "name it", "soften it", "claim it"], title: "say it. tap it. let it move." },
      setup: "“Even though part of me thinks this dream is unrealistic and too big for someone like me, I love and accept myself and I'm allowed to want it anyway.”",
      rounds: [
        { name: "name it", lines: ["This unrealistic feeling.", "Who do I think I am?", "Scared they'll laugh at me.", "Safer to want less.", "Too big. Too much. Not for me."] },
        { name: "soften it", lines: ["What if it's realistic for me?", "What if someone like me does this?", "What if wanting it is the first step?", "This feeling can soften now.", "I'm safe to dream this big."] },
        { name: "claim it", lines: ["My dream is meant for me.", "I'm going after it anyway.", "Luck is on my side.", "I'm stepping into my Big Dream era.", "So it is."] },
      ],
      band: "rate it again. 0 to 10. notice what moved.",
      journal: { prompt: "Astrotapping™ the “unrealistic” feeling: where it started and where it landed.", type: "win" },
    },
  ],
};

const EMBODIMENT: Record<string, SeasonEmbodiment> = { Libra: LIBRA, Scorpio: SCORPIO, Sagittarius: SAGITTARIUS };

export function getSeasonEmbodiment(sign: string): SeasonEmbodiment | null {
  return EMBODIMENT[sign] ?? null;
}

// ── Venus, for the Venus profile and the receiving style. Straight from the workshop slides. ──

type Element = "fire" | "earth" | "air" | "water";

const ELEMENT_OF: Record<string, Element> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Cancer: "water", Scorpio: "water", Pisces: "water",
};

export const VENUS_SIGN: Record<string, { flavour: string; attracts: string }> = {
  Aries: { flavour: "The chase. The win.", attracts: "boldness and going first" },
  Taurus: { flavour: "Luxury you can touch.", attracts: "calm, sensuality and standards" },
  Gemini: { flavour: "Novelty and banter.", attracts: "wit, curiosity and chat" },
  Cancer: { flavour: "Safety and devotion.", attracts: "care, loyalty and depth" },
  Leo: { flavour: "Adoration. Spotlight.", attracts: "confidence and being SEEN" },
  Virgo: { flavour: "Devotion to detail.", attracts: "skill, service and quality" },
  Libra: { flavour: "Beauty and romance.", attracts: "charm, style and partnership" },
  Scorpio: { flavour: "Depth. Intensity.", attracts: "magnetism and mystery" },
  Sagittarius: { flavour: "Freedom. Adventure.", attracts: "optimism and big vision" },
  Capricorn: { flavour: "Legacy. The long game.", attracts: "ambition and results" },
  Aquarius: { flavour: "Freedom to be you.", attracts: "originality and ideas" },
  Pisces: { flavour: "Romance and magic.", attracts: "empathy and imagination" },
};

export const VENUS_HOUSE: Record<number, { area: string; line: string }> = {
  1: { area: "self + image", line: "Your presence is the magnet. People are drawn to YOU." },
  2: { area: "money + values", line: "Money loves you. Beauty and quality pay you back." },
  3: { area: "words + ideas", line: "Your voice, writing and conversations attract." },
  4: { area: "home + family", line: "Pleasure starts at home. Build a space that holds you." },
  5: { area: "romance + creativity", line: "Play, flirting and creating are your magic." },
  6: { area: "work + rituals", line: "Your daily rituals and your craft attract abundance." },
  7: { area: "partnership", line: "Love, clients and collaborators come one-to-one." },
  8: { area: "intimacy + shared money", line: "Deep bonds, investments and other people's money." },
  9: { area: "travel + beliefs", line: "Adventure, teaching and big ideas open doors." },
  10: { area: "career + reputation", line: "Your public image attracts. Be seen doing your thing." },
  11: { area: "community + audience", line: "Your people, your network, your followers." },
  12: { area: "private pleasures", line: "Solitude, spirituality and secret joys restore you." },
};

export const VENUS_RECEIVING: Record<Element, { signs: string; through: string; block: string; practice: string }> = {
  fire: {
    signs: "aries · leo · sagittarius",
    through: "Excitement and adventure. Love and money find you when you're lit up.",
    block: "Chasing so hard it never gets to land.",
    practice: "Pause. Breathe. Let the thank-you sink in.",
  },
  earth: {
    signs: "taurus · virgo · capricorn",
    through: "Your senses, quality, consistency. You open up when you feel safe.",
    block: "Believing you have to earn it first.",
    practice: "Accept one gift this week with zero payback.",
  },
  air: {
    signs: "gemini · libra · aquarius",
    through: "Ideas and connection. Opportunities arrive through people and words.",
    block: "Analysing the gift to death.",
    practice: "Say yes before you overthink it.",
  },
  water: {
    signs: "cancer · scorpio · pisces",
    through: "Depth, intimacy, trust. You receive when you feel truly held.",
    block: "Giving first, giving most, then feeling guilty.",
    practice: "Ask for one thing you need. Out loud.",
  },
};

export function venusElement(sign: string): Element {
  return ELEMENT_OF[sign] ?? "air";
}
