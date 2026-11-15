// The meditation library. The membership page has always promised "every meditation... inside your
// own library that grows every month", and this is that library.
//
// Audio lives in /public/meditations and is served straight from the app. That is fine at this
// size, and worth revisiting once there are a dozen of these: a season's meditation is roughly
// 11MB, so twelve a year is around 140MB of repo, at which point they belong in object storage
// with a signed URL rather than in git.
//
// A meditation is either self-hosted audio (src) or a YouTube video (youtubeId). The YouTube ones
// play in an embed inside the member area, so the library can take a recording the moment it is
// uploaded without the file ever landing in git.
//
// Duration is deliberately not stored here. It is read from the audio element's own metadata in
// the browser, so it can never drift out of sync with the file the way a hardcoded number would.

export interface Meditation {
  slug: string;
  title: string;
  /** One line on what this is actually for, shown under the title. */
  purpose: string;
  /** The zodiac season it belongs to, used to surface the right one in your season. Evergreen
   * meditations have none and only live in the library. */
  sign?: string;
  /** Short label for the library card, e.g. "leo szn" or "money". */
  theme: string;
  /** Path under /public, for self-hosted audio. */
  src?: string;
  /** Cover picture for the library card, path under /public. */
  image?: string;
  /** YouTube video id, for meditations hosted there. */
  youtubeId?: string;
  /** A Canva design's public view link (Share → "View only" link), played as an embed. */
  canvaUrl?: string;
  /** Longer framing, shown on the player. */
  intro: string[];
  /** Optional "inside this meditation" list. */
  workingWith?: string[];
  /** What to do with it, kept short because nobody reads instructions before a meditation. */
  howTo: string[];
  publishedAt: string;
}

export const MEDITATIONS: Meditation[] = [
  {
    slug: "leo-season-main-character",
    title: "Main Character",
    purpose: "A Leo season meditation for stepping out of the background of your own life.",
    sign: "Leo",
    theme: "leo szn",
    image: "/leo-lion.png",
    src: "/meditations/leo-season-main-character.mp3",
    intro: [
      "Leo season asks one thing of you: stop shrinking. This meditation is for the part of you that already knows what she wants and has been waiting for permission that was never going to arrive from anyone else.",
      "It is not about performing confidence. It is about coming back to the version of you that existed before you learned to make yourself easier to be around.",
    ],
    howTo: [
      "Headphones if you have them, somewhere you will not be interrupted.",
      "Lying down is fine. Falling asleep partway through is also fine.",
      "Repeat it across the season rather than once. This one works by accumulation.",
    ],
    publishedAt: "2026-08-04",
  },
  {
    slug: "venus-money",
    title: "Venus Money",
    purpose: "Work with Venus around money, receiving, self-worth, pleasure, desire, standards and the way you relate to wealth.",
    theme: "money",
    image: "/meditations/venus-money.jpg",
    youtubeId: "4qC3CrVwaEU",
    intro: [
      "Venus rules value, beauty, attraction, pleasure, relationships and receiving, so we're bringing all of that into your money work and looking at what happens when you feel safer having more, holding more and asking for more.",
      "We'll also explore the connection between money and overworking, proving yourself, undercharging, guilt around receiving and the belief that success has to come through struggle.",
      "Money can support your freedom, your choices, your creativity, your pleasure and the kind of life you actually want to create.",
    ],
    workingWith: [
      "💗 Venus energy for self-worth, pleasure and receiving",
      "💸 Money mindset and subconscious reprogramming",
      "✨ Expanding your capacity to receive and hold more",
      "🌹 Releasing guilt around wanting more",
      "💰 Becoming more comfortable with bigger financial numbers",
      "🪞 Future-self visualisation",
      "🔥 Raising your standards around money, work and value",
      "🧠 Creating a calmer relationship with wealth, visibility and success",
      "🌙 A physical anchor you can use before selling, pricing, posting or receiving money",
    ],
    howTo: [
      "Get comfortable, close your eyes and give yourself the space to fully drop in.",
      "Come back to it whenever you feel yourself slipping into scarcity, overworking, shrinking your desires or questioning how much you're comfortable receiving.",
      "Please don't listen while driving or doing anything that requires your full attention.",
    ],
    publishedAt: "2026-09-28",
  },
  {
    slug: "quantum-manifesting",
    title: "Quantum Manifesting",
    purpose: "Connect with your highest timeline and fifth-dimensional energy, shift your vibration and work with your future self to call in what you want.",
    theme: "manifesting",
    youtubeId: "PMCMeKEKV14",
    intro: [
      "In the quantum field there's no single future set in stone, there are endless versions of your life existing at the same time, and this meditation takes you to the one where everything you want is already yours.",
      "We'll connect with fifth-dimensional energy, where manifesting feels easy and abundance flows freely, and shift your vibration so it matches the reality you're calling in rather than the one you're leaving behind.",
      "You'll leave with the tools to keep the manifesting magic going long after you open your eyes.",
    ],
    workingWith: [
      "🌌 Quantum timelines and how they shape what you manifest",
      "🪞 Working with your future self and your past self",
      "✨ Connecting with your highest timeline",
      "💫 Fifth-dimensional energy",
      "🔮 Shifting your vibration to match your desires",
    ],
    howTo: [
      "Get comfortable somewhere you won't be interrupted, headphones in if you have them, and give yourself the full half hour.",
      "Come back to it whenever you're calling in something new, so you keep choosing the timeline where it's already yours.",
      "Please don't listen while driving or doing anything that requires your full attention.",
    ],
    publishedAt: "2026-10-01",
  },
];

// The Lilith activation meditation lives on the member's own Lilith page (/my-chart/lilith), not in
// the library, so it sits outside MEDITATIONS on purpose. The section stays hidden from members
// until Betty's recording is in: set `src` (an mp3 in /public/meditations) or `youtubeId`.
export const LILITH_MEDITATION: Meditation = {
  slug: "lilith-activation",
  title: "Lilith: Money & Power Activation",
  purpose: "Reclaim your power. Embody your dark feminine. Manifest more $$$.",
  theme: "lilith",
  image: "/meditations/lilith-activation.png",
  // Betty's Canva video (share link canva.link/lilith-meditation-and-activation).
  canvaUrl: "https://www.canva.com/design/DAHbBWhpDg4/RspiYPOxK52FpBtH0rJMNg/watch",
  intro: [
    "A guided hypnosis, goddess invocation and energetic activation for the woman who's ready to stop playing small and start owning her power. Welcome to your Lilith era, baddie. 🌑💸",
    "We're working with the energy of Lilith, the powerful feminine archetype associated with sovereignty, independence, desire and rebellion, to explore your relationship with money, success, visibility and personal freedom.",
  ],
  workingWith: [
    "✨ Connect with the goddess Lilith: work with her symbolic energy of feminine sovereignty, courage, protection and independence.",
    "🖤 Explore your money shadows: identify inherited beliefs around wealth, ambition, receiving and financial independence.",
    "🔥 Reclaim your personal power: explore where you've silenced your voice, abandoned your desires or compromised your boundaries.",
    "💸 Activate your wealthy future self: visualise the woman who feels confident receiving money, expressing her ambition and making powerful financial decisions.",
    "👑 Embody your highest self: use hypnotic suggestions, affirmations and future-self visualisation to practise new beliefs about success, visibility and self-worth.",
    "💜 Reconnect with your voice: a heart-centred humming ritual designed to help you feel grounded and connected to your body.",
  ],
  howTo: [
    "Find somewhere comfortable where you won't be disturbed, put your phone on silent and allow yourself this time.",
    "You don't need candles, crystals or anything fancy. Just yourself, your intention and a willingness to explore what you're ready to change.",
    "Listen while seated or lying somewhere safe, never while driving.",
  ],
  publishedAt: "2026-11-15",
};

/** Betty's extra sections for the Lilith activation, shown as tap-to-open panels on the Lilith page. */
export const LILITH_ACTIVATION_EXTRAS = {
  forYouIf: [
    "You feel guilty about wanting more $$$.",
    "You're afraid of becoming too successful or visible.",
    "You've been taught that powerful women are selfish, intimidating or dangerous.",
    "You've made yourself smaller to receive love or approval.",
    "You feel uncomfortable receiving, charging or asking for money.",
    "You've given away your power in relationships, business or friendships.",
    "You associate independence with rejection or abandonment.",
  ],
  shadowWork: [
    { label: "the belief", q: "What have I been taught about wealthy, ambitious or powerful women, and how have those beliefs influenced my choices?" },
    { label: "the power", q: "Where have I been making myself smaller, silencing my desires or giving away my authority to keep other people comfortable?" },
    { label: "the money", q: "What would change in my life if I felt completely comfortable receiving, earning, managing and asking for more money?" },
    { label: "the future self", q: "How does the wealthiest, most confident and most independent version of me behave, and what can I start doing differently today?" },
    { label: "the activation", q: "What's one concrete action I can take in the next 24 hours to strengthen my financial independence or reclaim my power?" },
  ],
  affirmations: [
    "I am allowed to be wealthy, powerful and free.",
    "My ambition is sacred.",
    "I refuse to shrink to make others comfortable.",
    "My voice, my desires and my boundaries matter.",
    "I am worthy of receiving extraordinary opportunities.",
    "I trust myself to create financial independence.",
    "My success doesn't require anybody else's permission.",
    "I am the authority in my own life.",
  ],
  communityHref: "/community/room/general",
};

/** True once the Lilith meditation has a recording to play. */
export function lilithMeditationReady(): boolean {
  return Boolean(LILITH_MEDITATION.src || LILITH_MEDITATION.youtubeId || LILITH_MEDITATION.canvaUrl);
}

/** Canva's embed address for a design's public link: keeps /watch (video) or /view, adds ?embed and
 * drops the share-tracking query. */
export function canvaEmbedSrc(url: string): string {
  const base = url.split("?")[0].replace(/\/edit$/, "/view").replace(/\/$/, "");
  return `${/\/(watch|view)$/.test(base) ? base : `${base}/view`}?embed`;
}

export function meditationBySlug(slug: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.slug === slug);
}

/** The meditation for a given zodiac season, if one exists yet. */
export function meditationForSign(sign: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.sign?.toLowerCase() === sign.toLowerCase());
}

export function allMeditations(): Meditation[] {
  return [...MEDITATIONS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
