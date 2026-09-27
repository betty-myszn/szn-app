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
}

export interface AuditExercise extends ExerciseBase {
  kind: "audit";
  steps: string[];
  example: { bent: string; cost: number; reclaim: string };
  threshold: number;
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

export interface SeasonEmbodiment {
  sign: string;
  /** Where the set comes from, with the replay to point at. */
  source: { title: string; replayHref: string };
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

const EMBODIMENT: Record<string, SeasonEmbodiment> = { Libra: LIBRA };

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
