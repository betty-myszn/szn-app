// Every MY SZN podcast episode with its own page at /podcast/[slug]. Newest first: the first
// entry is the one /podcast features as "new episode". Add a new episode to the top of the list.

export type PodcastEpisode = {
  slug: string;
  season: string;
  title: string;
  subtitle: string;
  guest: string;
  guestInstagram?: string;
  image: { src: string; width: number; height: number; alt: string };
  intro: string[];
  topics: { title: string; desc: string }[];
  youtubeId?: string;
  spotifyEpisodeId?: string;
  appleUrl?: string;
};

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    slug: "becoming-that-bitch-gala-darling",
    season: "scorpio szn",
    title: "Becoming THAT B*TCH",
    subtitle: "Be MORE you, manifest $$$ & give ZERO f*cks, with Gala Darling",
    guest: "Gala Darling",
    guestInstagram: "galadarling",
    image: {
      src: "/podcast/gala-darling.jpg",
      width: 1200,
      height: 675,
      alt: "MY SZN the podcast, Scorpio szn: Becoming THAT b*tch with Gala Darling and your host Betty Andrews",
    },
    intro: [
      "WE HAVE A MOTHERF*CKING ICON IN THE BUILDINGGGG! Gala Darling is a bestselling author, radical self-love queen, founder of High Vibe Honey and the OG internet icon who has spent nearly TWO DECADES showing women how to live on their own f*cking terms.",
      "This one is a full-circle manifestation moment for Betty, who has followed Gala since her fashion blogging days and tapped with her for years. We get into Gala's astrology, her Human Design and reinventing yourself as many times as your soul desires.",
    ],
    topics: [
      { title: "Reinvention", desc: "Breaking out of the boxes you built and starting a whole new era of creativity, comedy and self-expression." },
      { title: "Radical self-love", desc: "Gala's own transformation, the power of tapping and loving every fabulous part of you." },
      { title: "Her chart + design", desc: "A Sagittarius stellium, Aquarius rising, rebellious Lilith and what being a Manifestor taught her about RESTTT." },
      { title: "Money + freedom", desc: "Why more money means very little if you're miserable inside the life you've built, plus what she learned at Paris Hilton's house." },
    ],
    youtubeId: "jVE_kIFVn68",
  },
  {
    slug: "magnetic-af-ayana-forbes",
    season: "scorpio szn",
    title: "How to be MAGNETIC AF",
    subtitle: "Less shame, more pleasure & more money, with Ayana Forbes",
    guest: "Ayana Forbes",
    guestInstagram: "therisengoddess",
    image: {
      src: "/podcast/ayana-forbes.jpg",
      width: 1200,
      height: 670,
      alt: "MY SZN the podcast, Scorpio szn: Magnetic AF with Ayana Forbes and your host Betty Andrews",
    },
    intro: [
      "Ayana Forbes is a spiritual guide and founder of The Risen Goddess Collective, bringing ancient goddess wisdom into real modern life so women can take back their power, their pleasure and their money.",
      "She has lived multiple lives (exotic dancer, getting sober, building businesses, divorce, then finding the goddess archetypes that healed her) and shares how she moved out of shame and into the version of herself who owns her desires.",
    ],
    topics: [
      { title: "Magnetism + money", desc: "Why pleasure, self-worth and enjoying your life are part of how abundance actually finds you." },
      { title: "The dark feminine", desc: "Working with Lilith, Hecate, Hathor and Aphrodite, and loving the parts of you you were taught to hide." },
      { title: "Glamour magic", desc: "Beauty rituals, mirror work, sexual power and becoming your own muse." },
      { title: "F*ck people-pleasing", desc: "Dropping the male gaze, releasing shame and setting boundaries without apologising." },
    ],
    spotifyEpisodeId: "3gZZk6QmcsZ3SfvhFYoIrV",
    appleUrl: "https://podcasts.apple.com/gb/podcast/how-to-be-magnetic-af-less-shame-more-pleasure-more/id1870482009?i=1000798174311",
  },
];

export const getEpisode = (slug: string) => PODCAST_EPISODES.find((e) => e.slug === slug);
