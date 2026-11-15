// What each Lilith means by sign and by house, for the Lilith page cards.
//
// Every sign and house has one line per Lilith, because each Lilith answers a different question:
//   exiled   → Black Moon Lilith, the long-running story of what got pushed down and how it's reclaimed
//   erupts   → True Lilith, how it bursts out in the moment
//   inOthers → Asteroid Lilith, where she shows up in other people
//   hidden   → Dark Moon Lilith, the layer hidden even from yourself
// So two Liliths in the same sign or house never repeat each other's words on one screen.
// Sign themes follow the reviewed Bad B*tch Report Lilith chapter; houses use the standard house
// rulerships (1 self, 2 money, 3 voice, 4 home, 5 pleasure, 6 work, 7 partners, 8 intimacy and
// shared power, 9 beliefs, 10 career, 11 groups, 12 the hidden world).

import type { LilithId } from "@/types/chart";

type Lines = { exiled: string; erupts: string; inOthers: string; hidden: string };

export const LILITH_SIGNS: Record<string, Lines> = {
  Aries: {
    exiled: "Your anger, your competitiveness and your need to go first got labelled aggressive, so you learned to wait your turn. Reclaimed, she acts fast, says what she wants and fights for herself without apologising.",
    erupts: "She bursts out as sudden temper, slammed doors and impulsive exits when you've been made to wait too long, so let her move your body and make the first move on purpose.",
    inOthers: "You meet her in bold, pushy women and in partners who pick fights, and they irritate you because they grab what you were taught not to reach for.",
    hidden: "Underneath sits a fear that fully backing yourself would leave you alone, which can show up as starting things with fire and quitting right before you win.",
  },
  Taurus: {
    exiled: "Your appetite for pleasure, comfort, money and your own body got called greedy or lazy. Reclaimed, she wants nice things out loud, rests without earning it and lets money be a pleasure.",
    erupts: "She comes out as stubborn digging in, binge spending or eating, or a total shutdown when someone rushes you or takes what's yours.",
    inOthers: "You meet her in sensual women who spend on themselves without guilt, and the judgement you feel points at the pleasure you've been denying yourself.",
    hidden: "Deep down sits a belief that wanting more is dangerous, which can show up as clinging to what feels safe or starving yourself of what you desire.",
  },
  Gemini: {
    exiled: "Your mouth and your mind got managed: the questions, the opinions, the sharp take nobody else would say. Reclaimed, she talks, writes and posts at full volume.",
    erupts: "She bursts out as sarcasm, gossip or a rapid-fire comeback when you've been talked over, the truth arriving sideways because saying it straight felt risky.",
    inOthers: "You meet her in clever, chatty, slightly chaotic women who say exactly what they think, and in people who seem to take the words right out of your mouth.",
    hidden: "Underneath sits a fear that your real thoughts are too much, which can show up as endless drafts, overthinking and stopping yourself mid-sentence.",
  },
  Cancer: {
    exiled: "Your needs, your moods and your right to choose your own version of home and motherhood got pushed down so you could care for everyone else. Reclaimed, she needs people without shame and mothers on her own terms.",
    erupts: "She floods out as tears or fury that seem to come from nowhere, usually after you've looked after everyone and nobody looked after you.",
    inOthers: "You meet her in mothers, family and needy partners, and in women who ask for care so easily it makes you uncomfortable.",
    hidden: "Deep down sits an old hunger to be held, which can show up as refusing all help or clinging to people who can't give you what you need.",
  },
  Leo: {
    exiled: "Your right to shine, be seen and be adored got called showing off. Reclaimed, she takes the stage, shares her work and loves being looked at.",
    erupts: "She comes out as wounded pride, drama or a sudden need for attention when you've been overlooked for too long.",
    inOthers: "You meet her in confident women who love the spotlight, and the jealousy that comes up shows you the glow you've been hiding.",
    hidden: "Underneath sits a fear of being judged the moment you're truly seen, which can show up as creative projects you never finish or launch.",
  },
  Virgo: {
    exiled: "Everything messy got pushed down: the imperfect body, the untidy desire, the days you don't feel like being useful. Reclaimed, she's gloriously imperfect and charges premium for her skill.",
    erupts: "She bursts out as sharp criticism, control or a martyred \"I'll just do it myself\" when the standards you hold yourself to spill onto everyone else.",
    inOthers: "You meet her in carefree women who don't fix, help or apologise, and in critics whose nitpicking sounds exactly like your inner voice.",
    hidden: "Deep down sits a belief that you have to be perfect to be loved, which can show up as anxiety, body control and doing everything for everyone.",
  },
  Libra: {
    exiled: "Your right to disagree, be difficult and want things in love that aren't convenient for others got smoothed over to keep the peace. Reclaimed, she says no beautifully and negotiates hard.",
    erupts: "She comes out as a sudden explosive exit after months of being agreeable, or charm with a cold edge when the imbalance finally gets too much.",
    inOthers: "You meet her in partners who dominate and in beautiful women who don't care if they're disliked.",
    hidden: "Underneath sits a hot fury about unfairness, which can show up as people-pleasing on the surface and resentment you never say out loud.",
  },
  Scorpio: {
    exiled: "The full force of your intensity got buried: desire, rage, sexuality, power and the truth nobody wants said. Reclaimed, she owns her sexuality and wields power cleanly.",
    erupts: "She bursts out as jealousy, control, cutting words or total withdrawal when you feel betrayed or exposed.",
    inOthers: "You meet her in magnetic, powerful women and intense lovers who see straight through you, and they pull at you because they live the power you keep under wraps.",
    hidden: "Deep down sits a fear of your own power and of betrayal if you let anyone in, which can show up as secrets, control and testing the people who love you.",
  },
  Sagittarius: {
    exiled: "Your wildness and your right to your own truth got pushed down so you'd stay small, local and sensible. Reclaimed, she travels, teaches and lives by what she actually believes.",
    erupts: "She comes out as restlessness, bluntness or a sudden need to leave when life starts to feel like a cage.",
    inOthers: "You meet her in free, adventurous women and in preachy people, and the judgement that comes up shows you the freedom you're not letting yourself take.",
    hidden: "Underneath sits a fear that your truth will get you cast out, which can show up as rebelling against everything without building anything of your own.",
  },
  Capricorn: {
    exiled: "Your hunger to be in charge got pushed down, along with the idea that women support the boss instead of being the boss. Reclaimed, she takes the title, charges her worth and builds something that's hers.",
    erupts: "She comes out as coldness, control or overwork used to prove a point when someone doubts what you're capable of.",
    inOthers: "You meet her in bosses, authority figures and ambitious women who chase status without apologising, and the resentment you feel shows you the ambition you're holding back.",
    hidden: "Deep down sits a fear of success, a sense that a powerful woman ends up alone, which can show up as stalling right before the big win.",
  },
  Aquarius: {
    exiled: "Your weirdness, radical ideas and refusal to conform got pushed down so you'd fit in. Reclaimed, she lives unconventionally and gathers her fellow misfits.",
    erupts: "She bursts out as cold detachment, sudden rebellion or cutting people off the moment closeness starts to feel like a cage.",
    inOthers: "You meet her in eccentric, unbothered women and in groups that reject you, and both show you how much of your own strangeness you're still hiding.",
    hidden: "Underneath sits loneliness from never quite belonging, which can show up as conforming so completely that nobody knows the real you.",
  },
  Pisces: {
    exiled: "Your sensitivity, intuition and spiritual side got called too much or too dreamy. Reclaimed, she's a witch, a mystic and an artist who trusts what she knows.",
    erupts: "She comes out as escaping into fantasy, scrolling or substances, or soaking up everyone's pain when your boundaries feel impossible to hold.",
    inOthers: "You meet her in psychic, artistic or chaotic women, and in people you try to rescue, because they mirror the gifts and wounds you carry.",
    hidden: "Deep down sits a secret spiritual life you're half embarrassed by, which can show up as martyrdom and giving yourself away.",
  },
};

export const LILITH_HOUSES: Record<number, Lines> = {
  1: {
    exiled: "Here she lives in your body, your look and how you walk into a room, so the exiled part of you shows up in your presence. Reclaiming her means taking up space exactly as you are.",
    erupts: "In this house she erupts in first impressions: people feel your edge before you speak, and you snap when anyone tells you who to be.",
    inOthers: "In this house you meet her in how strangers react to you, from women who copy your look to people who find you intimidating on sight.",
    hidden: "In this house the hidden layer is shame about your own body or face, which can show up as dimming your appearance or performing a softer you.",
  },
  2: {
    exiled: "Here she lives in your money and self-worth, so wanting more cash, nice things and higher prices is exactly what got exiled. Reclaiming her means earning and spending on your terms.",
    erupts: "In this house she erupts around money: impulse spending, sudden price rises, or snapping when someone undervalues you or your work.",
    inOthers: "In this house you meet her in women who charge a lot and spend on themselves, and in people who try to control your money.",
    hidden: "In this house the hidden layer is a feeling that you aren't worth much, which can show up as undercharging, hoarding or blocking your own income.",
  },
  3: {
    exiled: "Here she lives in your voice and your everyday words, so saying the forbidden thing is where your power sits. Reclaiming her means writing, speaking and posting without softening it.",
    erupts: "In this house she erupts in conversations, texts and comments: the sharp reply, the message sent before you've cooled down.",
    inOthers: "In this house you meet her in siblings, neighbours, classmates and the chatty people in your daily life who say what you won't.",
    hidden: "In this house the hidden layer is a fear of being misunderstood or mocked, which can show up as self-censorship and saying nothing at all.",
  },
  4: {
    exiled: "Here she lives in your home, family and roots, so the family script is what she's here to break. Reclaiming her means building a home and family life on your own terms.",
    erupts: "In this house she erupts at home: the holiday blow-ups, the rage at a parent, the urge to move out or move far away.",
    inOthers: "In this house you meet her in your mother or family, often a parent who carried her own exiled power or one who shut yours down.",
    hidden: "In this house the hidden layer is old family shame or secrets, which can show up as never feeling fully safe in your own home.",
  },
  5: {
    exiled: "Here she lives in sex, pleasure, romance and creativity, so being playful, sexy and creative for its own sake got exiled. Reclaiming her means having fun, making art and dating like nobody's good girl.",
    erupts: "In this house she erupts in romance and creative work: dramatic flings, wild nights out, or art that comes out raw and unfiltered.",
    inOthers: "In this house you meet her in lovers, flirtations and children, and in creative women who show off their talent without asking permission.",
    hidden: "In this house the hidden layer is guilt around pleasure, which can show up as blocking your own creativity, joy or desire.",
  },
  6: {
    exiled: "Here she lives in your daily work, routines and health, so refusing to be everyone's unpaid help is where your power sits. Reclaiming her means work that serves you too.",
    erupts: "In this house she erupts at work and through your body: the resignation letter, the burnout, the symptoms that show up after you've overworked.",
    inOthers: "In this house you meet her in coworkers, bosses and clients who take advantage, and in colleagues who simply refuse to overwork.",
    hidden: "In this house the hidden layer is a belief that you have to earn rest, which can show up as perfectionism, overwork and ignoring your body.",
  },
  7: {
    exiled: "Here she lives in your partnerships, so being partnered without being possessed is what she's fighting for. Reclaiming her means relationships where you stay fully yourself.",
    erupts: "In this house she erupts in relationships: power struggles, sudden breakups, or refusing to compromise once you feel controlled.",
    inOthers: "In this house you meet her directly in partners and close one-to-one relationships, often people with intense, rebellious or controlling energy.",
    hidden: "In this house the hidden layer is a fear of losing yourself in love, which can show up as choosing unavailable partners or pushing good ones away.",
  },
  8: {
    exiled: "Here she lives in sex, intimacy, shared money and power, the taboo stuff, so being sovereign over your body and your money is where she sits. Reclaiming her means owning your desire and your power.",
    erupts: "In this house she erupts in intimacy and shared money: jealousy, power plays, intense affairs, or fights over debt, inheritance and control.",
    inOthers: "In this house you meet her in lovers, investors and anyone whose money or power gets tangled up with yours.",
    hidden: "In this house the hidden layer is old fear around sex, death or being controlled, which can show up as secrets and never fully letting anyone in.",
  },
  9: {
    exiled: "Here she lives in your beliefs, travel and learning, so questioning religion and the rules you were raised with is where she sits. Reclaiming her means building your own philosophy.",
    erupts: "In this house she erupts around belief: walking away from a religion, arguing with teachers, or packing a bag and leaving the country.",
    inOthers: "In this house you meet her in teachers, gurus, foreigners and preachers, people whose beliefs either set you free or try to box you in.",
    hidden: "In this house the hidden layer is a fear of being judged for what you believe, which can show up as keeping your real views to yourself.",
  },
  10: {
    exiled: "Here she lives in your career and public reputation, so being too ambitious for other people's comfort is where she sits. Reclaiming her means being seen for your power and building a public name.",
    erupts: "In this house she erupts in public and at work: clashes with bosses, walking out of a career, or a reputation for being difficult.",
    inOthers: "In this house you meet her in bosses, authority figures and famous women, and in the parent who shaped how you see success.",
    hidden: "In this house the hidden layer is a fear of being publicly shamed, which can show up as holding back from the visibility you want.",
  },
  11: {
    exiled: "Here she lives in your friendships, groups and big dreams, so being the rebel with a following is where she sits. Reclaiming her means finding your people and leading them.",
    erupts: "In this house she erupts in groups and friendships: falling out with a whole circle, leaving the group chat, or starting a movement.",
    inOthers: "In this house you meet her in friends, online communities and followers, the women you gather and the groups that never quite accepted you.",
    hidden: "In this house the hidden layer is a fear of rejection by the group, which can show up as hiding your dreams to stay liked.",
  },
  12: {
    exiled: "Here she lives in your private world, dreams and spirituality, so the hidden witch is the part of you that got exiled. Reclaiming her means bringing your magic out into the open.",
    erupts: "In this house she erupts in private: vivid dreams, secret moods, escapism, or a breakdown after you've held it in too long.",
    inOthers: "In this house you meet her in secret relationships, hidden enemies, healers and the people you only show your real self to behind closed doors.",
    hidden: "In this house she's hidden twice over, which can show up as self-sabotage you can't explain and a feeling of being watched or judged.",
  },
};

const FIELD: Record<LilithId, keyof Lines> = {
  lilith: "exiled",
  true_lilith: "erupts",
  asteroid_lilith: "inOthers",
  dark_moon_lilith: "hidden",
};

export function lilithSignLine(id: LilithId, sign: string): string | null {
  return LILITH_SIGNS[sign]?.[FIELD[id]] ?? null;
}

export function lilithHouseLine(id: LilithId, house: number): string | null {
  return LILITH_HOUSES[house]?.[FIELD[id]] ?? null;
}

// ── Connected reading ────────────────────────────────────────────────────────────────────────
// The pieces below join her sign with her house in one sentence, so a Scorpio Lilith in the 2nd
// house reads as one placement (Scorpio's intensity showing up around money and self-worth),
// not as two unrelated paragraphs.

interface SignPieces {
  /** Noun phrase: what this sign's Lilith holds. */
  core: string;
  /** Gerund phrase: how she tends to give her power away. */
  giveaway: string;
  /** Imperative phrase: how she takes it back. */
  reclaim: string;
}

export const LILITH_SIGN_PIECES: Record<string, SignPieces> = {
  Aries: { core: "your anger, drive and need to go first", giveaway: "waiting for permission and swallowing your anger", reclaim: "go first, say what you want and let yourself be angry" },
  Taurus: { core: "your appetite for pleasure, comfort and money", giveaway: "denying yourself what you want so you don't look greedy", reclaim: "want it out loud, rest without earning it and let yourself have nice things" },
  Gemini: { core: "your voice, opinions and sharp mind", giveaway: "softening your words and editing yourself into silence", reclaim: "say it straight, post the take and let your mind be seen" },
  Cancer: { core: "your needs, moods and longing to be cared for", giveaway: "looking after everyone and asking for nothing back", reclaim: "say what you need and let people look after you" },
  Leo: { core: "your need to shine and be adored", giveaway: "dimming yourself so nobody thinks you're showing off", reclaim: "take the spotlight, share your work and enjoy being seen" },
  Virgo: { core: "your messy, imperfect, human side", giveaway: "over-functioning and doing it all perfectly for free", reclaim: "let it be imperfect, stop the unpaid help and charge for your skill" },
  Libra: { core: "your right to disagree and want things your way", giveaway: "keeping the peace at your own expense", reclaim: "say no beautifully and negotiate for what's fair to you" },
  Scorpio: { core: "your intensity, desire and power", giveaway: "hiding how much you want and controlling things from the shadows", reclaim: "own your desire, use your power openly and tell the truth" },
  Sagittarius: { core: "your wildness, freedom and own truth", giveaway: "staying small and sensible to keep everyone comfortable", reclaim: "follow your own beliefs, take up adventure and speak your truth" },
  Capricorn: { core: "your ambition and hunger to lead", giveaway: "supporting other people's success instead of building your own", reclaim: "take the title, charge your worth and build something that's yours" },
  Aquarius: { core: "your weirdness and refusal to conform", giveaway: "fitting in so nobody sees how different you are", reclaim: "be openly unconventional and find your fellow misfits" },
  Pisces: { core: "your sensitivity, intuition and magic", giveaway: "absorbing everyone's pain and calling your gifts silly", reclaim: "trust your intuition, protect your energy and let your magic be seen" },
};

interface HousePieces {
  /** Noun phrase: the area of life. */
  arena: string;
  /** One practical thing to try this week. */
  step: string;
}

export const LILITH_HOUSE_PIECES: Record<number, HousePieces> = {
  1: { arena: "your body, look and presence", step: "Wear the thing you've been saving for a better version of you, and walk into one room this week without shrinking." },
  2: { arena: "your money and self-worth", step: "Raise one price, chase one payment you're owed, or buy yourself one thing you've been denying yourself." },
  3: { arena: "your voice and everyday conversations", step: "Send the message, post the opinion or say the sentence you've been rewriting in your head." },
  4: { arena: "your home and family", step: "Change one family rule you've been following without question, even if it's as small as how you spend Sunday." },
  5: { arena: "your love life, pleasure and creativity", step: "Book one date, make one piece of art or do one fun thing purely for yourself this week." },
  6: { arena: "your work, routines and health", step: "Drop one unpaid task that was never yours, and give your body one hour of real rest." },
  7: { arena: "your relationships and partnerships", step: "Say one honest need to your partner or closest person, and let them handle their reaction." },
  8: { arena: "your intimacy, shared money and power", step: "Look at one shared money arrangement or one intimacy pattern, and decide what you actually want from it." },
  9: { arena: "your beliefs, learning and travel", step: "Write down one belief you were raised with that you no longer agree with, and act on what you believe now." },
  10: { arena: "your career and public reputation", step: "Put your name on one piece of work, pitch one big thing or ask for the title you've earned." },
  11: { arena: "your friendships, groups and big dreams", step: "Share one big dream with your people, or join a group where the real you would be celebrated." },
  12: { arena: "your private world, dreams and spirituality", step: "Spend ten minutes alone with your journal or a candle, and write down what came up in your dreams." },
};

/** How each Lilith colours the connected reading. */
const LENS: Record<LilithId, string> = {
  lilith: "got pushed down",
  true_lilith: "can flare up fastest",
  asteroid_lilith: "can show up most through other people",
  dark_moon_lilith: "can hide deepest",
};

export function lilithConnectedReading(id: LilithId, sign: string, house: number, ordinal: string): string | null {
  const s = LILITH_SIGN_PIECES[sign];
  const h = LILITH_HOUSE_PIECES[house];
  if (!s || !h) return null;
  const core = s.core.charAt(0).toUpperCase() + s.core.slice(1);
  return `${sign} in your ${ordinal} house: ${core} ${LENS[id]} around ${h.arena}.`;
}

// Each Lilith frames giving away and reclaiming power differently, and only Black Moon uses the
// house's practical step, so two Liliths in the same sign and house never share a reclaim tab.
export function lilithReclaim(id: LilithId, sign: string, house: number): { giveaway: string; reclaim: string; step: string } | null {
  const s = LILITH_SIGN_PIECES[sign];
  const h = LILITH_HOUSE_PIECES[house];
  if (!s || !h) return null;
  switch (id) {
    case "true_lilith":
      return {
        giveaway: `In the heat of the moment you might give your power away by ${s.giveaway}, especially around ${h.arena}.`,
        reclaim: `Next time she flares, pause, breathe, then ${s.reclaim}.`,
        step: `When you feel the flare around ${h.arena} this week, wait ten minutes, then act on purpose instead of on reflex.`,
      };
    case "asteroid_lilith":
      return {
        giveaway: `In your relationships you might give your power away by ${s.giveaway}, especially around ${h.arena}.`,
        reclaim: `When someone triggers you, ask what they're showing you about yourself, then ${s.reclaim}.`,
        step: `Notice who triggers you around ${h.arena} this week, and write down the one thing they have that you want for yourself.`,
      };
    case "dark_moon_lilith":
      return {
        giveaway: `Without even noticing, you might give your power away by ${s.giveaway}, especially around ${h.arena}.`,
        reclaim: `Go gently with this one: ${s.reclaim}, one small step at a time.`,
        step: `Before bed this week, write down one moment you held back around ${h.arena} and what you were scared would happen.`,
      };
    default:
      return {
        giveaway: `You might be giving your power away by ${s.giveaway}, especially around ${h.arena}.`,
        reclaim: `To take it back, ${s.reclaim}, starting with ${h.arena}.`,
        step: h.step,
      };
  }
}

// ── Aspects ──────────────────────────────────────────────────────────────────────────────────
const ASPECT_THEMES: Record<string, string> = {
  Sun: "your identity and confidence",
  Moon: "your emotions and need for safety",
  Mercury: "your voice and the way you think",
  Venus: "your love life, beauty and money",
  Mars: "your drive, anger and desire",
  Jupiter: "your luck, growth and big beliefs",
  Saturn: "your fears, rules and authority",
  Uranus: "your need for freedom and rebellion",
  Neptune: "your dreams, spirituality and boundaries",
  Pluto: "your power, control and transformation",
  Chiron: "your deepest wound and healing gift",
  "North Node": "your purpose and future direction",
  Ascendant: "how you come across and your body",
  Midheaven: "your career and public image",
};

const ASPECT_MEANING: Record<string, (theme: string) => string> = {
  conjunction: (t) => `she's fused with ${t}, so you can't feel one without the other`,
  opposition: (t) => `she pulls against ${t}, so it often plays out through other people`,
  square: (t) => `she clashes with ${t}, and the friction is what pushes you to grow`,
  trine: (t) => `she flows easily with ${t}, a natural gift you can lean on`,
  sextile: (t) => `she opens a door to ${t} the moment you take the first step`,
};

export function lilithAspectMeaning(body: string, type: string): string | null {
  const theme = ASPECT_THEMES[body];
  const fn = ASPECT_MEANING[type];
  return theme && fn ? fn(theme) : null;
}
