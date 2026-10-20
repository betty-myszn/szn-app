import type { HDAuthorityKey, HDTypeName } from "@/types/human-design";

// Teaching layer for the Human Design page: the tap-to-define glossary and the "you're off track
// when..." signals. Interpretation of the chart itself lives in human-design-content.ts.

export interface GlossaryEntry {
  title: string;
  def: string;
  /** Pattern auto-linked inside lesson text (first match per box). Omitted = only linked by hand. */
  auto?: RegExp;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  type: {
    title: "Type",
    def: "Your energy type, one of five. It's how your energy is built to move through the world and how other people feel you when you walk in.",
  },
  strategy: {
    title: "Strategy",
    def: "How your type is designed to engage with life. Follow it and doors open with waaay less effort.",
    auto: /\bstrategy\b/i,
  },
  authority: {
    title: "Authority",
    def: "Your body's built-in decision maker, where your truest yes and no come from. Spoiler: it's rarely your mind.",
    auto: /\bauthority\b/i,
  },
  profile: {
    title: "Profile",
    def: "Two numbers (like 4/6) describing your personality costume: how you learn, how you show up and how people experience you.",
    auto: /\bprofile\b/i,
  },
  definition: {
    title: "Definition",
    def: "How your defined centres link up with each other, which shapes how you process life and who you need around you.",
  },
  defined: {
    title: "Defined centre",
    def: "A centre coloured in on your chart. Consistent, reliable energy you always have access to, the bits of you that stay the same wherever you go.",
    auto: /\bdefined centres?\b/i,
  },
  open: {
    title: "Open centre",
    def: "A white centre. You take in other people's energy here and amplify it, which is where you get conditioned and, in time, where you get wise.",
    auto: /\bopen centres?\b/i,
  },
  centre: {
    title: "Centre",
    def: "One of nine energy hubs in your bodygraph, each running its own theme, from thinking to willpower to feelings.",
  },
  channel: {
    title: "Channel",
    def: "A line linking two centres. When both of its gates are switched on in your chart, it's a fixed gift that's always on.",
    auto: /\bchannels?\b/i,
  },
  gate: {
    title: "Gate",
    def: "One of 64 switches in the chart, each set by where a planet was when you were born. Every gate carries a shadow and a gift.",
    auto: /\bgates?\b/i,
  },
  line: {
    title: "Line",
    def: "The number after the dot (like 34.2). It's the flavour of how that gate plays out in you, from 1 to 6.",
  },
  hanging: {
    title: "Hanging gate",
    def: "A gate you carry without its partner. Anyone with the partner gate completes the channel, which is why some people feel electric to you.",
  },
  notself: {
    title: "Not-self",
    def: "The feeling that tells you you're off track. Each type has its own: anger, frustration, bitterness or disappointment.",
    auto: /\bnot-self\b/i,
  },
  signature: {
    title: "Signature",
    def: "The feeling that tells you you're on track: peace, satisfaction, success or surprise, depending on your type.",
  },
  personality: {
    title: "Personality",
    def: "Your conscious side, taken from the moment you were born. The parts of you that you know and identify as you. Drawn in black.",
    auto: /\bPersonality\b/,
  },
  design: {
    title: "Design",
    def: "Your unconscious body, taken about 88 days before you were born. People often see these traits in you before you do. Drawn in pink.",
    auto: /\bDesign\b/,
  },
  cross: {
    title: "Incarnation cross",
    def: "Your life theme, built from the Sun and Earth gates of your Personality and Design. The bigger story your life keeps circling back to.",
    auto: /\bincarnation cross\b/i,
  },
  Generator: {
    title: "Generator",
    def: "The life force of the planet, around 37% of people. Built to respond to what lights you up, then master it.",
    auto: /\bGenerators?\b/, // "Manifesting Generator" is matched first, so this never splits it
  },
  "Manifesting Generator": {
    title: "Manifesting Generator",
    def: "A Generator with a motor wired to the Throat, around 33% of people. Fast, multi-passionate and built to skip steps.",
    auto: /\bManifesting Generators?\b/,
  },
  Manifestor: {
    title: "Manifestor",
    def: "The initiators, around 9% of people. Here to start things and inform the people their moves will affect.",
    auto: /\bManifestors?\b/,
  },
  Projector: {
    title: "Projector",
    def: "The guides, around 20% of people. Built to see others deeply and lead when they're recognised and invited.",
    auto: /\bProjectors?\b/,
  },
  Reflector: {
    title: "Reflector",
    def: "The rarest type, around 1% of people. Fully open, a mirror for the health of their community, built to take time over big decisions.",
    auto: /\bReflectors?\b/,
  },
};

// The "you're off track when..." check: the signals of the not-self, per type and per authority.
export const OFF_TRACK_TYPE: Record<HDTypeName, string[]> = {
  Manifestor: [
    "You're angry and can't name why, usually because someone slowed you down or questioned a move you'd already made.",
    "You've stopped telling people what you're about to do, so every launch hits a wall of pushback.",
    "You're asking permission for things you were built to just START.",
    "You're grinding to finish everything yourself when your gift is the beginning.",
  ],
  Generator: [
    "Frustration has become your background noise, a sign you're doing work your gut never said yes to.",
    "You're chasing and initiating instead of waiting for something to respond to.",
    "You say yes with your head while your body is going \"uhhh no\".",
    "You go to bed wired instead of properly tired, because the day spent your energy on the wrong things.",
  ],
  "Manifesting Generator": [
    "You're frustrated, then angry, often within the same hour.",
    "You've skipped the gut check and jumped on something that never lit you up.",
    "You're forcing yourself to do every step in order when you're built to skip the boring ones.",
    "You've stopped informing people, so your speed lands as chaos for everyone around you.",
  ],
  Projector: [
    "Bitterness creeps in after giving brilliant guidance nobody asked for and nobody took.",
    "You're working Generator hours and wondering why you're exhausted.",
    "You're chasing recognition instead of waiting to be invited, so you feel invisible.",
    "You keep pouring into people who never actually see you.",
  ],
  Reflector: [
    "Disappointment hangs over everything, usually because you're in the wrong place with the wrong people.",
    "You're making big decisions in a day instead of letting a full moon cycle pass.",
    "You feel like nobody, because you've lost track of whose energy you're mirroring.",
    "You've stayed in an environment that drains you and called it loyalty.",
  ],
};

export const OFF_TRACK_AUTHORITY: Record<HDAuthorityKey, string[]> = {
  emotional: [
    "You're deciding at the top or bottom of your emotional wave instead of sleeping on it.",
    "You said yes in the moment and regretted it by Thursday.",
  ],
  sacral: [
    "You're overriding your gut \"uh-huh\" or \"unh-unh\" with a pros and cons list.",
    "You're answering big open questions instead of simple yes or no ones.",
  ],
  splenic: [
    "You felt the first instant hit, then talked yourself out of it.",
    "You're waiting for certainty your Spleen only gives once, in the moment.",
  ],
  ego: [
    "You're committing to things you don't actually want, then running on fumes to keep the promise.",
    "You're ignoring what your heart wants because it feels selfish.",
  ],
  self: [
    "You're deciding in silence instead of talking it out and hearing what comes out of your own mouth.",
    "You're following a direction that doesn't feel like you.",
  ],
  mental: [
    "You're deciding alone in your head instead of talking it through with people you trust.",
    "You're stuck somewhere that scrambles your thinking, and blaming your thinking.",
  ],
  lunar: [
    "You're rushing a big decision instead of letting the Moon do a full lap.",
    "You're deciding from one mood on one day.",
  ],
};
