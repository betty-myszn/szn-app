// The SZN theme framework in code: what changes each season while the MY SZN structure stays the
// same. Each season works across the member's whole life; the theme changes the LENS. The full
// framework, in Betty's words, is app/SZN-THEMES-Q4-2026.md; these are its short lines, so the
// sales page, the dashboard and any personalisation read one source.
//
// Seasons without a designed chapter yet fall back to a plain name (see sznTheme).

export type LensArea =
  | "money"
  | "love"
  | "career"
  | "visibility"
  | "confidence"
  | "lifestyle"
  | "boundaries"
  | "identity"
  | "goals";

export interface SznTheme {
  sign: string;
  /** The season's name inside MY SZN. */
  name: string;
  emoji: string;
  /** The core transformation, one line. */
  coreIdea: string;
  /** One or two sentences on what this stage does, for cards. */
  about: string;
  /** The question of the season. */
  question: string;
  /** The question this stage answers in the chapter's arc. */
  arcQuestion: string;
  /** How the season's lens lands on each life area. */
  lenses: Partial<Record<LensArea, string>>;
}

export const SZN_THEMES: Record<string, SznTheme> = {
  Libra: {
    sign: "Libra",
    name: "Self-Love SZN",
    emoji: "💗",
    coreIdea: "Love yourself enough to want more.",
    about:
      "We change the relationship you have with yourself before trying to change everything around you: your worth, your standards, receiving, pleasure, money, confidence, boundaries and desire.",
    question:
      "If I genuinely loved and valued myself, what would I stop accepting and what would I finally allow myself to have?",
    arcQuestion: "What do I deserve and desire?",
    lenses: {
      money: "Worth, receiving, pricing, asking for more and believing you're allowed to have LOTS of money.",
      love: "Standards, reciprocity, attachment, needs, communication and choosing relationships that actually feel good.",
      career: "Valuing your work, asking for what you deserve and choosing opportunities aligned with the life you want.",
      visibility: "Feeling worthy of being seen, heard, celebrated and recognised.",
      confidence: "Building self-trust rather than constantly looking outside yourself for validation.",
      lifestyle: "Pleasure, beauty, rest, joy and creating an environment you genuinely enjoy living in.",
      boundaries: "Recognising where saying yes to somebody else means saying no to yourself.",
    },
  },
  Scorpio: {
    sign: "Scorpio",
    name: "Bad B*tch SZN",
    emoji: "🦂",
    coreIdea: "Heal the shadow. Reclaim your power.",
    about:
      "The deepest stage, with shadow work, hypnosis, coaching, witchcraft and ritual going after the fear, conditioning and people-pleasing that would sabotage the bigger life you want. F*CK being easy to deal with.",
    question: "What needs to change, heal or die so I can actually become the woman capable of holding the life I want?",
    arcQuestion: "What's stopping me from having it, and what am I ready to change?",
    lenses: {
      money: "Money shadows, scarcity, financial independence, receiving more, power around money and becoming harder to financially control.",
      love: "Boundaries, intimacy, attachment, desire, power dynamics and refusing to abandon yourself to keep someone else comfortable.",
      career: "Ambition, authority, asking for more and stopping yourself from shrinking professionally.",
      visibility: "Fear of judgement, criticism, rejection and being perceived.",
      confidence: "Owning the parts of yourself you've previously hidden or apologised for.",
      boundaries: "Saying no without writing a 700-word apology afterwards.",
      identity: "Letting versions of yourself die when they've become too small for where you're going.",
    },
  },
  Sagittarius: {
    sign: "Sagittarius",
    name: "Big Dream SZN",
    emoji: "🏹",
    coreIdea: "Go after your biggest life.",
    about:
      "We stop editing our dreams to whatever feels realistic and go BIG, with manifestation, money, career, freedom and the vision for 2027, all the way to the 2027 Manifestation Party.",
    question: "If I stopped worrying about whether my dream was realistic, what would I actually choose?",
    arcQuestion: "How big am I willing to make my life now?",
    lenses: {
      money: "Bigger financial goals, wealth, expansion, earning capacity and what money could make possible.",
      love: "The relationship you genuinely want rather than the relationship you believe you should settle for.",
      career: "Bigger ambitions, opportunities, purpose, leadership and taking the scary opportunity.",
      visibility: "Reaching more people, sharing bigger ideas and allowing yourself to be known.",
      lifestyle: "Travel, freedom, experiences, adventure and designing a life that actually excites you.",
      confidence: "Developing the courage to pursue something before you have proof it'll work.",
      goals: "Turning enormous desires into actual decisions and actions.",
    },
  },
};

export function sznTheme(sign: string): SznTheme {
  return (
    SZN_THEMES[sign] ?? {
      sign,
      name: `${sign} SZN`,
      emoji: "✨",
      coreIdea: "",
      about: "",
      question: "",
      arcQuestion: "",
      lenses: {},
    }
  );
}
