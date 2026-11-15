// The personal Black Moon Lilith reading at the heart of the Lilith page.
//
// Sign × house is joined, not listed: the sign says WHAT got shamed (and how that plays out with
// money), the house says WHERE it lives, and the shadow-work prompts are built from both so an
// Aries Lilith in the 1st asks about anger, independence and putting herself first in her body and
// presence, while an Aries Lilith in the 2nd asks the same question about her money.
// Everything here describes tendencies of this one placement; nothing claims to read the whole chart.

import { LILITH_HOUSES, LILITH_HOUSE_PIECES, LILITH_SIGNS, LILITH_SIGN_PIECES } from "@/lib/lilith-placements";

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

// ── Deeper content (15 Nov 2026: Betty asked for four times the information in every tile) ──

interface SignDeep {
  buried: string;
  reclaimed: string;
  moneyBlocks: [string, string, string];
  moneyMoves: [string, string, string];
  step: string;
}

export const LILITH_SIGN_DEEP: Record<string, SignDeep> = {
  Aries: {
    buried: "Buried, she turns into a short fuse you apologise for, a body full of tension, and a habit of letting other people go first and then resenting them for it.",
    reclaimed: "Reclaimed, she's first through the door: direct, physical, competitive and completely at ease being the one who decides.",
    moneyBlocks: ["Waiting to be offered the raise, the lead or the opportunity instead of asking.", "Dropping your price the second someone hesitates.", "Feeling guilty when you win a negotiation."],
    moneyMoves: ["Ask for the money first, before you've talked yourself out of it.", "Pitch yourself for the lead role or the bigger client this month.", "Let yourself feel competitive about income, it's fuel."],
    step: "Do one thing you've been waiting for someone's permission to do, and don't announce it first.",
  },
  Taurus: {
    buried: "Buried, she shows up as deprivation then bingeing: denying yourself pleasure, money and rest, then overspending or overindulging when the hunger gets too loud.",
    reclaimed: "Reclaimed, she's sensual, steady and expensive in the best way, at home in her body and clear about exactly what she wants.",
    moneyBlocks: ["Feeling you have to earn every nice thing first.", "Holding money so tightly it can't grow.", "Undercharging because asking for more feels greedy."],
    moneyMoves: ["Price for the lifestyle you want, then work backwards.", "Put a pleasure line in your budget and spend it without guilt.", "Invest in one beautiful, quality thing for your work or your body."],
    step: "Book one pleasure purely for your body, a massage, a long bath or the good dinner, and don't justify it.",
  },
  Gemini: {
    buried: "Buried, she comes out sideways as sarcasm, gossip, overthinking and endless drafts, all that brilliance stuck in your head or your notes app.",
    reclaimed: "Reclaimed, she's the sharp, funny, fearless voice in the room, a writer, talker and idea machine nobody can talk over.",
    moneyBlocks: ["Giving your best ideas away for free in comments and DMs.", "Rewriting the sales post until it says nothing.", "Feeling like a fraud for charging to talk."],
    moneyMoves: ["Turn one idea you keep explaining for free into a paid offer.", "Post the sales message in your own voice, unedited.", "Charge for your time on calls, consults or voice notes."],
    step: "Post or send the opinion you've been sitting on, in your own words, with the ending unsoftened.",
  },
  Cancer: {
    buried: "Buried, she floods: tears or fury out of nowhere, resentment towards the people you care for, or an independence so fierce it refuses any help.",
    reclaimed: "Reclaimed, she's emotionally sovereign, able to say \"I need you\" and \"no, I won't be doing that\" in the same breath.",
    moneyBlocks: ["Feeling guilty charging people you care about.", "Using money to look after everyone except yourself.", "Needing to feel emotionally safe before you can ask for more."],
    moneyMoves: ["Charge friends and family the full price, lovingly.", "Build a cushion that's only for you, your safety money.", "Let someone treat you and simply say thank you."],
    step: "Say one need out loud to someone close, and hand back one caretaking job that was never yours.",
  },
  Leo: {
    buried: "Buried, she shows up as a bruised ego that needs reassurance, jealousy of women who shine freely, or creative projects you never finish because finishing means being judged.",
    reclaimed: "Reclaimed, she's radiant and proud, takes the stage, loves being looked at and gives every woman watching permission to do the same.",
    moneyBlocks: ["Hiding behind someone else's brand or face.", "Downplaying your talent so nobody calls you arrogant.", "Avoiding visibility, which caps what you can earn."],
    moneyMoves: ["Put your face and your name on your offer.", "Share a win publicly without a qualifier.", "Charge a premium for the experience of working with you."],
    step: "Post the photo you think is a bit much, or wear the outfit, and tell someone you're proud of yourself.",
  },
  Virgo: {
    buried: "Buried, she turns into harsh self-criticism, control around food or the body, anxiety, or martyrdom: doing everything, complaining about it and still doing everything.",
    reclaimed: "Reclaimed, she's gloriously imperfect, enjoys her body as it is and turns her precision into a skill she charges premium rates for.",
    moneyBlocks: ["Over-delivering and under-charging.", "Waiting until it's perfect before you sell it.", "Doing unpaid admin, fixing and favours."],
    moneyMoves: ["Launch the thing at good enough.", "Add a fee for the extras you've been doing for free.", "Charge for your expertise, not your hours."],
    step: "Leave one thing deliberately imperfect, and say no to one unpaid favour.",
  },
  Libra: {
    buried: "Buried, she's people-pleasing on the surface and resentment underneath, attracting partners who dominate, or swinging between total accommodation and sudden explosive exits.",
    reclaimed: "Reclaimed, she's graceful AND disagreeable: she says no beautifully, negotiates hard and lets people be disappointed without falling apart.",
    moneyBlocks: ["Accepting the first offer to avoid conflict.", "Splitting money in other people's favour.", "Avoiding money talks in love and business."],
    moneyMoves: ["Counter the next offer you get, politely and firmly.", "Have the money conversation you've been avoiding.", "Set terms that are fair to you first."],
    step: "Disagree with someone out loud, kindly and clearly, and let them sit with it.",
  },
  Scorpio: {
    buried: "Buried, she shows up as jealousy, control, secrets or total withdrawal, intensity with nowhere to go so it turns inward or onto the people closest to you.",
    reclaimed: "Reclaimed, she's magnificent: owning her sexuality without shame, wielding power cleanly and walking through fire to come out with more of herself.",
    moneyBlocks: ["Fearing that wanting big money makes you dangerous.", "Controlling every penny out of fear instead of strategy.", "Avoiding shared money, investing or debt conversations."],
    moneyMoves: ["Look at your full money picture, all of it, without flinching.", "Ask for the big number, the one that scares you a little.", "Learn one way to make your money work for you, investing or shared income."],
    step: "Tell one truth you've been keeping to yourself, to the person it's actually for.",
  },
  Sagittarius: {
    buried: "Buried, she becomes restlessness that never settles, self-righteousness, or rebellion that rejects everything without building anything of your own.",
    reclaimed: "Reclaimed, she's a free woman with a loud, honest philosophy who travels, studies, teaches and laughs at the rules.",
    moneyBlocks: ["Staying in safe, boring work because freedom feels irresponsible.", "Spending on escape instead of building the life you want.", "Believing you can't teach until you're an official expert."],
    moneyMoves: ["Package what you believe into something you teach or sell.", "Fund one adventure as an investment: a course, a retreat, a trip.", "Build income that isn't tied to one place."],
    step: "Plan one adventure, even a small one, and book the first part of it.",
  },
  Capricorn: {
    buried: "Buried, she comes out as workaholism to prove a point, coldness and control, resentment of authority, or ambition poured into other people's success.",
    reclaimed: "Reclaimed, she's the boss of her own life: she takes the title, negotiates like a shark and lets her ambition be as visible as it is real.",
    moneyBlocks: ["Building someone else's business while staying underpaid.", "Waiting to be promoted instead of claiming the role.", "Fearing that success will cost you love."],
    moneyMoves: ["Ask for the title and the pay that go with your work.", "Set a big, specific money goal with a date on it.", "Build an asset that's yours: a business, a brand or an investment."],
    step: "Claim one piece of authority: a title, a decision or a boundary at work.",
  },
  Aquarius: {
    buried: "Buried, she becomes detachment, cold superiority, or conformity so complete nobody would guess how strange you are inside, which is lonely.",
    reclaimed: "Reclaimed, she's a revolution in a body: she lives unconventionally, thinks ahead of her time and gathers her fellow misfits.",
    moneyBlocks: ["Copying what everyone else charges and offers.", "Hiding your weird idea because it doesn't fit the market.", "Feeling uncomfortable profiting from your community."],
    moneyMoves: ["Sell the unusual idea, it's your edge.", "Build income around a community you lead.", "Charge for being different, because nobody else can offer it."],
    step: "Share one unconventional idea or opinion publicly, and let the right people find you.",
  },
  Pisces: {
    buried: "Buried, she comes out as escapism into fantasy, scrolling or substances, martyrdom, or soaking up everyone's pain because your boundaries never felt allowed.",
    reclaimed: "Reclaimed, she's a witch, a mystic, an artist and a healer who trusts what she knows without needing proof.",
    moneyBlocks: ["Feeling that charging for spiritual or creative gifts is wrong.", "Rescuing people with your money.", "Avoiding looking at your numbers."],
    moneyMoves: ["Put a clear price on your readings, art or healing.", "Check your bank balance once a week with a candle lit.", "Protect your energy with clear paid and unpaid boundaries."],
    step: "Spend twenty minutes on your magic, tarot, ritual, art or meditation, with your phone in another room.",
  },
};

interface HouseDeep {
  buried: string;
  reclaimed: string;
  money: string;
}

export const LILITH_HOUSE_DEEP: Record<number, HouseDeep> = {
  1: { buried: "Buried here, you dim your look, shrink in photos and soften how you come across so nobody finds you too much.", reclaimed: "Reclaimed here, your presence does the talking: people feel your power before you say a word.", money: "In the 1st house, your money grows when you're the face of what you sell." },
  2: { buried: "Buried here, you undercharge, hoard or feel guilty spending on yourself.", reclaimed: "Reclaimed here, you price with confidence, spend with pleasure and treat your worth as non-negotiable.", money: "In the 2nd house this IS a money placement, so your self-worth and your income rise together." },
  3: { buried: "Buried here, you edit yourself in every message, post less than you want and let other people speak first.", reclaimed: "Reclaimed here, your words are your power, and writing, speaking and posting become your edge.", money: "In the 3rd house, your voice, content and conversations are your money channel." },
  4: { buried: "Buried here, you keep the family peace, play your old role at home and never quite feel safe in your own space.", reclaimed: "Reclaimed here, you build a home on your own terms and break the family script for everyone who comes after you.", money: "In the 4th house, money healing starts with the beliefs you inherited at home." },
  5: { buried: "Buried here, you block your own fun, creativity and desire, or only let them out in secret.", reclaimed: "Reclaimed here, you date, create and play like nobody's watching, and your joy becomes magnetic.", money: "In the 5th house, your creativity, joy and self-expression are what people pay for." },
  6: { buried: "Buried here, you overwork, people-please at work and ignore your body until it forces you to stop.", reclaimed: "Reclaimed here, your work serves you too, with routines that protect your energy and boundaries clients respect.", money: "In the 6th house, your money grows the moment you stop the unpaid labour and charge for your skill." },
  7: { buried: "Buried here, you lose yourself in partners, attract controlling people or keep love at arm's length.", reclaimed: "Reclaimed here, you partner as an equal and stay fully yourself in love and in business.", money: "In the 7th house, your money moves through partnerships, so negotiate every deal as an equal." },
  8: { buried: "Buried here, you keep secrets, avoid real intimacy and stay tangled in shared money or power struggles.", reclaimed: "Reclaimed here, you own your desire, set your terms in intimacy and handle big shared money with confidence.", money: "In the 8th house, investments, shared income and other people's money are where your power plays out." },
  9: { buried: "Buried here, you keep your real beliefs to yourself and stay inside the rules you were raised with.", reclaimed: "Reclaimed here, you build your own philosophy, travel, teach and say what you actually believe.", money: "In the 9th house, teaching, publishing and travel are your money channels." },
  10: { buried: "Buried here, you hold back from visibility, fear being called difficult and let other people take the credit.", reclaimed: "Reclaimed here, you build a public name and let your ambition be seen.", money: "In the 10th house, your career and reputation are your biggest money lever." },
  11: { buried: "Buried here, you hide your big dreams to stay liked and play small in groups.", reclaimed: "Reclaimed here, you lead your own community and gather the women who get you.", money: "In the 11th house, your network, community and audience are where your money comes from." },
  12: { buried: "Buried here, you keep your magic secret, sabotage yourself and carry feelings you can't name.", reclaimed: "Reclaimed here, you bring your spirituality into the open and trust your intuition out loud.", money: "In the 12th house, spiritual work, healing and behind-the-scenes income are where your money flows." },
};

/** Betty's Lilith affirmations from the Money & Power Activation, mixed into every reading. */
const CORE_AFFIRMATIONS = [
  "I am allowed to be wealthy, powerful and free.",
  "I refuse to shrink to make others comfortable.",
  "My voice, my desires and my boundaries matter.",
  "I am worthy of receiving extraordinary opportunities.",
];

export interface LilithDeepReading {
  shamed: { exiled: string; called: string; buried: string; reclaimed: string };
  where: { lives: string; together: string; buried: string; reclaimed: string };
  money: { pattern: string; blocks: string[]; moves: string[]; house: string };
  prompts: string[];
  affirmations: string[];
  moves: string[];
}

const toYou = (s: string) => s.replace(/\bmyself\b/g, "yourself").replace(/\bmy\b/g, "your").replace(/\bI\b/g, "you");

export function lilithDeepReading(sign: string, house: number, ordinal: string): LilithDeepReading | null {
  const base = lilithPersonalReading(sign, house);
  const s = LILITH_SIGN_READING[sign];
  const sd = LILITH_SIGN_DEEP[sign];
  const hd = LILITH_HOUSE_DEEP[house];
  const h = LILITH_HOUSE_PIECES[house];
  const core = LILITH_SIGN_PIECES[sign]?.core;
  if (!base || !s || !sd || !hd || !h || !core) return null;
  const myArena = h.arena.replace(/\byour\b/g, "my");
  return {
    shamed: {
      exiled: base.shamed,
      called: `You may have been called ${s.called} for ${toYou(s.shamed)}, so you learned to play ${s.softened} instead.`,
      buried: sd.buried,
      reclaimed: sd.reclaimed,
    },
    where: {
      lives: base.where,
      together: `${sign} in your ${ordinal} house means ${core} got pushed down around ${h.arena}, and that's exactly where taking it back pays off most.`,
      buried: hd.buried,
      reclaimed: hd.reclaimed,
    },
    money: { pattern: s.money, blocks: [...sd.moneyBlocks], moves: [...sd.moneyMoves], house: hd.money },
    prompts: [
      ...base.prompts,
      `What did I see happen to women who were called ${s.called}, and what did I decide about myself because of it?`,
      `Who benefits when I play ${s.softened}, and what does it cost me?`,
      `Where do I feel my ${sign} Lilith in my body when I hold her back?`,
      `What am I still waiting for permission to do around ${myArena}?`,
    ],
    affirmations: [...s.affirmations, `I take up space around ${myArena} exactly as I am.`, `My ${sign} Lilith is safe to show up around ${myArena}.`, ...CORE_AFFIRMATIONS],
    moves: [
      sd.step,
      base.step,
      sd.moneyMoves[0],
      "Light a candle, read your shadow-work prompts out loud and journal on the one that makes you squirm.",
    ],
  };
}

// ── Money exercise (one per sign, pointed at her house) ─────────────────────────────────────
interface MoneyExercise {
  title: string;
  steps: [string, string, string];
}

export const LILITH_MONEY_EXERCISE: Record<string, MoneyExercise> = {
  Aries: { title: "The first-ask drill", steps: ["Write down the number you actually want for your next sale, raise or invoice, then add 20%.", "Say it out loud three times, standing up, until your voice stops wobbling.", "Send that number to a real person within 24 hours, before you can talk yourself down."] },
  Taurus: { title: "The pleasure price list", steps: ["List ten things that would make your life feel rich, with what each one costs.", "Add them up and work out the monthly income that pays for them comfortably.", "Raise one price or start one income stream towards that number this week."] },
  Gemini: { title: "The free-ideas audit", steps: ["Scroll your last 20 comments, DMs and voice notes and highlight every idea you gave away for free.", "Pick the one people responded to most and write it up as a paid offer with a price.", "Post it in your own words within 48 hours, no rewriting past the first draft."] },
  Cancer: { title: "The care invoice", steps: ["Write down every bit of unpaid care, favours and emotional labour you gave this month.", "Next to each one, write what it would cost if you charged for it.", "Choose one to start charging for, or one to stop doing, and tell the person this week."] },
  Leo: { title: "The spotlight pitch", steps: ["Record a 60-second video saying what you do, who it's for and what it costs, with your face on camera.", "Watch it back once and write down the moment you shrank.", "Re-record it without the shrink and post it or send it to three potential clients."] },
  Virgo: { title: "The unpaid-extras edit", steps: ["List everything you do for clients, your boss or your family that isn't in the price.", "Cross off one thing to stop doing and put a fee on one thing to keep doing.", "Update your offer, invoice or boundaries with the new terms this week."] },
  Libra: { title: "The counter-offer rehearsal", steps: ["Think of the last offer, pay rise or split you accepted without pushing back.", "Write the counter-offer you wish you'd made, with the number and one sentence of reasoning.", "Use that script, word for word, on the next money conversation you have."] },
  Scorpio: { title: "The full-truth money look", steps: ["Light a candle and write down every number: income, debt, savings, what you're owed and what you owe.", "Circle the number that makes you flinch and journal on what you're scared it says about you.", "Choose one power move for that number this week: pay it, chase it, invest it or negotiate it."] },
  Sagittarius: { title: "The freedom fund", steps: ["Write down the freedom you want, the trip, the course or the time off, and what it costs.", "List three things you already know that someone would pay you to teach them.", "Pick one and sell it, as a class, a call or a guide, to fund the freedom."] },
  Capricorn: { title: "The CEO number", steps: ["Write the income you'd have if you were running things, as a monthly figure.", "List what you'd need to charge, or what title you'd need, to reach it.", "Take one concrete step toward the title or the price this week, and put it in your calendar as a meeting with yourself."] },
  Aquarius: { title: "The weird-idea pitch", steps: ["Write down the most unusual idea you have for making money, the one you keep dismissing.", "Describe it in three sentences to the exact person who'd love it.", "Share it with five people from your community and ask who'd buy it."] },
  Pisces: { title: "The magic price ritual", steps: ["Light a candle and write down every gift you share for free: readings, healing, art, intuition.", "Give each one a price you'd be happy to receive, without justifying it.", "Offer one of them at that price this week and let the first yes land."] },
};

export function lilithMoneyExercise(sign: string, house: number): { title: string; steps: string[]; focus: string } | null {
  const ex = LILITH_MONEY_EXERCISE[sign];
  const h = LILITH_HOUSE_PIECES[house];
  if (!ex || !h) return null;
  return { title: ex.title, steps: [...ex.steps], focus: `Point it at ${h.arena}, because that's where your Lilith is placed.` };
}
