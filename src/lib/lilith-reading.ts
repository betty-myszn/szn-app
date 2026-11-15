// The personal Black Moon Lilith reading at the heart of the Lilith page.
//
// Sign × house is joined, not listed: the sign says WHAT got shamed (and how that plays out with
// money), the house says WHERE it lives, and the shadow-work prompts are built from both so an
// Aries Lilith in the 1st asks about anger, independence and putting herself first in her body and
// presence, while an Aries Lilith in the 2nd asks the same question about her money.
// Everything here describes tendencies of this one placement; nothing claims to read the whole chart.

import { LILITH_HOUSES, LILITH_HOUSE_PIECES, LILITH_SIGNS } from "@/lib/lilith-placements";

interface SignReading {
  /** First person, what she learned not to do: "expressing anger, asserting my independence…" */
  shamed: string;
  /** What she got called for it. */
  called: string;
  /** The safer version she plays instead. */
  softened: string;
  /** How a buried vs reclaimed Lilith in this sign tends to handle money, pricing, negotiating, leading. */
  money: string;
  affirmations: [string, string];
}

export const LILITH_SIGN_READING: Record<string, SignReading> = {
  Aries: {
    shamed: "expressing anger, asserting my independence or putting myself first",
    called: "difficult to love",
    softened: "agreeable and patient",
    money: "A buried Aries Lilith tends to soften the ask: discounting before anyone pushes back, waiting to be offered the lead and swallowing the anger that tells you you're underpaid. Reclaimed, she names her price first, negotiates without apologising and goes after leadership without waiting for permission.",
    affirmations: ["My anger is information, and I'm allowed to act on it.", "I go first, and I don't need permission to lead."],
  },
  Taurus: {
    shamed: "wanting pleasure, comfort and money for myself",
    called: "greedy or lazy",
    softened: "low-maintenance and grateful for less",
    money: "A buried Taurus Lilith can keep you underearning and over-saving, treating every nice thing as a reward you haven't earned yet. Reclaimed, she prices for the life she actually wants, spends on pleasure without guilt and lets money feel good in her hands.",
    affirmations: ["I'm allowed to want more, and to enjoy it.", "Money is safe with me, and so is pleasure."],
  },
  Gemini: {
    shamed: "saying what I really think and asking every question",
    called: "too mouthy",
    softened: "quiet and easy to agree with",
    money: "A buried Gemini Lilith can hide your best ideas in drafts and DMs, so other people get paid for the thoughts you were scared to say first. Reclaimed, she sells with her voice, charges for her ideas and lets her words become an income.",
    affirmations: ["My voice is worth paying for.", "I say it first and I say it straight."],
  },
  Cancer: {
    shamed: "having needs and asking to be looked after",
    called: "needy or dramatic",
    softened: "the low-maintenance one who looks after everyone",
    money: "A buried Cancer Lilith can give care away for free and feel guilty charging the people she wants to look after. Reclaimed, she charges properly for the nurturing she offers and builds money that makes her feel held.",
    affirmations: ["My needs matter as much as anyone's.", "I'm allowed to be looked after, including by money."],
  },
  Leo: {
    shamed: "wanting attention, praise and the spotlight",
    called: "a show-off",
    softened: "humble and behind the scenes",
    money: "A buried Leo Lilith can stay behind the curtain, letting less talented people take the credit and the bigger fee. Reclaimed, she puts her face on the offer, charges for her star power and lets visibility pay her.",
    affirmations: ["I'm allowed to be seen, praised and paid for it.", "My glow is a business asset."],
  },
  Virgo: {
    shamed: "being messy, imperfect or unhelpful",
    called: "lazy or selfish",
    softened: "perfect, useful and always available",
    money: "A buried Virgo Lilith can over-deliver for under-pay, doing ten extra unpaid tasks to prove she deserves the fee. Reclaimed, she charges for her precision, stops the free fixing and lets good enough be good enough.",
    affirmations: ["I'm worth paying even when I'm not perfect.", "My skill has a price, and I charge it."],
  },
  Libra: {
    shamed: "disagreeing and wanting things on my terms",
    called: "difficult or unfair",
    softened: "the agreeable peacekeeper",
    money: "A buried Libra Lilith can avoid money conversations to keep things nice, accepting the first offer and splitting things in other people's favour. Reclaimed, she negotiates beautifully, asks for what's fair to her and lets people be disappointed.",
    affirmations: ["I can be lovely and still say no.", "Fair includes me."],
  },
  Scorpio: {
    shamed: "wanting power, sex and control over my own life",
    called: "too intense or dangerous",
    softened: "light, easy and unthreatening",
    money: "A buried Scorpio Lilith can fear what money would make of her, hiding her ambition, avoiding shared finances or gripping every penny. Reclaimed, she wields money openly, negotiates for real power and lets wealth transform her life.",
    affirmations: ["My power is safe in my hands.", "I'm allowed to want big money and real control."],
  },
  Sagittarius: {
    shamed: "wanting freedom and living by my own truth",
    called: "reckless or preachy",
    softened: "sensible and settled",
    money: "A buried Sagittarius Lilith can stay in safe, small work that pays the bills and bores her senseless. Reclaimed, she builds income around her freedom, teaches what she believes and lets her big bets pay off.",
    affirmations: ["My freedom is worth funding.", "I trust my own truth with my money."],
  },
  Capricorn: {
    shamed: "wanting to be in charge and to win",
    called: "cold, bossy or too ambitious",
    softened: "the supportive one who helps others succeed",
    money: "A buried Capricorn Lilith can build other people's success while staying underpaid in the number two seat. Reclaimed, she takes the title, sets the terms and builds wealth that belongs to her.",
    affirmations: ["My ambition is sacred.", "I'm the authority in my own life and my own money."],
  },
  Aquarius: {
    shamed: "being different and refusing to fit in",
    called: "weird or too much",
    softened: "normal and easy to place",
    money: "A buried Aquarius Lilith can copy what everyone else charges and offers, hiding the strange idea that would actually make her money. Reclaimed, she builds her income around her difference and finds the people who pay for exactly that.",
    affirmations: ["My difference is my value.", "I make money my own way."],
  },
  Pisces: {
    shamed: "being sensitive, intuitive and spiritual",
    called: "too dreamy",
    softened: "practical and grounded on everyone else's terms",
    money: "A buried Pisces Lilith can give her gifts away for free, rescue people with her money and feel that charging for magic is wrong. Reclaimed, she charges for her intuition, protects her energy and lets her magic pay her.",
    affirmations: ["My intuition is a gift worth paying for.", "I protect my energy and my money."],
  },
};

export interface LilithPersonalReading {
  shamed: string;
  where: string;
  money: string;
  prompts: string[];
  affirmations: string[];
  step: string;
}

export function lilithPersonalReading(sign: string, house: number): LilithPersonalReading | null {
  const s = LILITH_SIGN_READING[sign];
  const lines = LILITH_SIGNS[sign];
  const h = LILITH_HOUSE_PIECES[house];
  const hl = LILITH_HOUSES[house];
  if (!s || !lines || !h || !hl) return null;
  // The prompts are in her own voice, so the house area switches from "your" to "my".
  const myArena = h.arena.replace(/\byour\b/g, "my");
  return {
    shamed: lines.exiled,
    where: hl.exiled,
    money: s.money,
    prompts: [
      `When did I first learn that ${s.shamed} made me ${s.called}, and how has that belief shaped the woman I've become?`,
      `Where around ${myArena} do I still play ${s.softened} to stay safe?`,
      `If my ${sign} Lilith ran ${myArena} for one week, what would she do first?`,
    ],
    affirmations: [...s.affirmations],
    step: h.step,
  };
}
