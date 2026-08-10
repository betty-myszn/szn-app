// The six profile lines, each explained on its own. A profile like 4/6 is two of
// these: the first number is the conscious (Personality) line, the second is the
// unconscious (Design) line. Kept in its own file so the profile-lines section can
// live beside the existing whole-profile read without touching shared files.
//
// Voice rules: no em dashes, no "it's not X, it's Y", second person.

export interface LineContent {
  name: string;
  body: string;
}

export const LINE_CONTENT: Record<number, LineContent> = {
  1: {
    name: "the investigator",
    body: "You need solid ground under you before you move, so you dig until you genuinely understand a thing. That is how you build security, and it is a strength. When you feel shaky, treat it as the cue to go deeper into the detail and become the one who actually knows.",
  },
  2: {
    name: "the hermit",
    body: "You carry natural gifts that feel effortless to you, the kind other people grind for years to build. You need real time alone to recharge and let them ripen, and you get called out of your cave by people who can see what you have. Trust the ones who name your talent.",
  },
  3: {
    name: "the martyr",
    body: "You learn by living it, trying, adjusting, finding what works by bumping into what does not. Your so-called mistakes are your genius, they are exactly how you earn wisdom nobody could hand you. Give yourself full permission to experiment, because none of it is wasted.",
  },
  4: {
    name: "the opportunist",
    body: "You move through relationships. Your work, your luck and your love arrive through the people you already know, so your network is your foundation. Nurture your bonds and let the people who rate you carry what you are building out into the world.",
  },
  5: {
    name: "the heretic",
    body: "People project onto you, expecting you to be the one with the answer, the practical saviour who fixes it. Your gift genuinely helps, so be intentional about what you take on, deliver what you promise, and guard your name from other people's expectations.",
  },
  6: {
    name: "the role model",
    body: "You live in three acts: a messy, experimental first phase, a stretch up on the roof watching and gathering perspective, and a mature phase where you become the example. You are here to embody your truth and let people learn by watching how you actually live it.",
  },
};
