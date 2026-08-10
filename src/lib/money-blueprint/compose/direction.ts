/**
 * Money Blueprint — content for purpose, karma, power and receiving.
 *
 * These carried one paragraph each in the first build and read as afterthoughts next to the
 * shadow chapters. The material here exists so they can stand at the same weight.
 */

// ---------------------------------------------------------------------------- north node: what you are here to build

export interface NodeBuild {
  /** What this node is here to build, as a noun phrase. */
  build: string;
  /** The daily behaviour that constitutes living it. */
  practice: string;
  /** What it feels like from inside, which is usually unremarkable rather than exciting. */
  feels: string;
  /** How money participates in the lesson. */
  money: string;
  /** What mastering it looks like ten years on. */
  matured: string;
}

export const NODE_BUILD: Record<string, NodeBuild> = {
  Aries: { build: "a self that acts before it has permission", practice: "deciding alone and moving first, without a committee",
    feels: "abrupt and slightly rude, because you are used to consulting", money: "your income rises when you back your own judgement rather than syndicating the risk",
    matured: "you become the person others wait to see move, and the waiting itself becomes valuable" },
  Taurus: { build: "something steady, tangible and entirely your own", practice: "repeating the same true thing and letting it accumulate",
    feels: "flat and unstimulating, because your comfort zone was intensity", money: "wealth comes from letting one thing compound rather than from starting a better one",
    matured: "you own assets that pay you while you sleep, built from the boring option you finally stayed with" },
  Gemini: { build: "a body of everyday, accessible communication", practice: "saying it publicly, in short pieces, often",
    feels: "trivial next to the profound thing you know you could say", money: "money arrives through volume and reach rather than through depth and rarity",
    matured: "your ordinary voice becomes the asset, and the archive of it outsells anything you laboured over" },
  Cancer: { build: "a base you actually live in and people you actually let close", practice: "letting yourself be supported before you have earned it",
    feels: "exposed, because competence was your safety", money: "your earning stabilises once you stop treating support as a debt",
    matured: "you build from safety rather than toward it, and the work stops being a defence" },
  Leo: { build: "work with your name unmistakably on it", practice: "putting yourself in the frame rather than behind it",
    feels: "self-indulgent, because you learned to be excellent anonymously", money: "your rate rises the moment the work stops being anonymous",
    matured: "you are known, and the knowing does most of the selling for you" },
  Virgo: { build: "a reliable daily practice and a craft that holds up", practice: "doing the unglamorous version consistently",
    feels: "small next to the vision you can see", money: "income becomes predictable once the process does",
    matured: "you are the person whose work simply does not fail, and that reputation prices itself" },
  Libra: { build: "something made with somebody rather than alone", practice: "sharing the decision and staying in the relationship",
    feels: "like a loss of control", money: "your earnings scale past what one person can produce once you genuinely partner",
    matured: "the relationships are the business, and they compound in a way solo work never does" },
  Scorpio: { build: "a capacity to go all the way in rather than staying at a manageable depth", practice: "sharing resources and letting things be intense",
    feels: "dangerous, because you kept things light for good reasons", money: "money grows through pooled resources and genuine intimacy with the work",
    matured: "you handle what others cannot, and that is the whole premium" },
  Sagittarius: { build: "a body of belief you are willing to teach publicly", practice: "taking the wider view out loud",
    feels: "presumptuous, because you were trained to stay in the detail", money: "teaching pays more than doing, once you allow it",
    matured: "you become the person people cite rather than the one who did the work quietly" },
  Capricorn: { build: "a structure and a reputation that outlast you", practice: "taking authority rather than waiting to be granted it",
    feels: "cold and ambitious in a way you were told not to be", money: "reputation arrives first and income follows, always in that order",
    matured: "your name is the credential, and the climb turns out to have been the point" },
  Aquarius: { build: "something for the group rather than only for yourself", practice: "trusting the strange idea and the long view",
    feels: "impersonal, because you are used to being the centre of your own work", money: "income scales when the thing serves a community rather than a client",
    matured: "you built something that runs beyond your own hands" },
  Pisces: { build: "a capacity to trust what you sense before it is provable", practice: "letting the work be felt rather than only justified",
    feels: "unrigorous, because you were trained to evidence everything", money: "your rarest offer is the one you cannot fully explain",
    matured: "people pay for your perception itself, without needing the working shown" },
};

export const NODE_HOUSE_BUILD: Record<number, string> = {
  1: "in your own name and your own presence, rather than through anybody else's platform",
  2: "in your own resources: what you personally own, earn and can point at",
  3: "in the everyday: writing, conversation, teaching the near-at-hand",
  4: "at the foundations: home, base, the private life that holds the public one up",
  5: "in creative output and the things you would make anyway",
  6: "in the daily craft and the working practice, where reliability is the product",
  7: "in partnership, with named people, in real agreements",
  8: "in shared resources and transformational work, where the stakes are genuinely high",
  9: "in teaching, publishing and carrying people toward a wider view",
  10: "in public: career, reputation and being known for a position",
  11: "in community, audience and the group you gather",
  12: "in the unseen: the work behind the work, and the perception nobody else has",
};

// ---------------------------------------------------------------------------- south node: what you already hold

export const NODE_MASTERY: Record<string, { holds: string; retreat: string; cost: string }> = {
  Aries: { holds: "immediate, independent action", retreat: "going it alone the moment collaboration gets complicated", cost: "you keep restarting rather than deepening" },
  Taurus: { holds: "steadiness and holding on", retreat: "gripping what is comfortable when growth asks for movement", cost: "the safe option quietly becomes the ceiling" },
  Gemini: { holds: "quickness, range and articulacy", retreat: "explaining rather than committing", cost: "breadth substitutes for the one deep thing" },
  Cancer: { holds: "care, attunement and emotional management", retreat: "looking after everybody when you are asked to be seen", cost: "your own plans stay permanently deferred" },
  Leo: { holds: "presence and the ability to hold a room", retreat: "performing when you are asked to collaborate", cost: "the applause replaces the actual result" },
  Virgo: { holds: "precision, craft and usefulness", retreat: "refining when you are asked to publish", cost: "perfect stays unshipped" },
  Libra: { holds: "diplomacy and reading what others need", retreat: "accommodating when you are asked to decide", cost: "your own position never gets stated" },
  Scorpio: { holds: "depth, intensity and comfort with what others avoid", retreat: "plunging into another transformation when you are asked to stay steady", cost: "nothing is left alone long enough to compound" },
  Sagittarius: { holds: "conviction and the wide view", retreat: "reaching for the next horizon when you are asked to finish this one", cost: "the current thing never gets harvested" },
  Capricorn: { holds: "structure, discipline and endurance", retreat: "building more when you are asked to feel", cost: "the achievement arrives and lands on nobody" },
  Aquarius: { holds: "objectivity and systems thinking", retreat: "detaching when you are asked to be personally present", cost: "the work stays impressive and slightly cold" },
  Pisces: { holds: "perception and the ability to merge with a situation", retreat: "dissolving when you are asked to hold a line", cost: "the boundary never gets drawn" },
};

// ---------------------------------------------------------------------------- power, by Pluto house

export const PLUTO_HOUSE_POWER: Record<number, { arena: string; immature: string; mature: string }> = {
  1: { arena: "your own presence and how much of yourself you show", immature: "controlling how you are perceived, permanently on guard", mature: "you occupy a room without managing it, and the effect is unmistakable" },
  2: { arena: "your own resources and what you are worth", immature: "gripping money, or repeatedly rebuilding after loss", mature: "you hold real assets calmly, and money stops being a referendum on you" },
  3: { arena: "your voice and what you are willing to say", immature: "withholding the true sentence, or weaponising it", mature: "you say the accurate thing plainly, and it moves rooms" },
  4: { arena: "home, family and the private base", immature: "control at home, or an old family power struggle still running", mature: "you build a base nobody can destabilise, and it funds everything else" },
  5: { arena: "creativity, risk and what you make", immature: "all-or-nothing bets, or creative work held hostage to approval", mature: "you take calculated risks with real upside and can survive the ones that fail" },
  6: { arena: "your daily work and your body", immature: "overwork as control, or health used as the brake", mature: "your working practice is deliberate and your capacity is genuinely defended" },
  7: { arena: "partnership and one-to-one dynamics", immature: "power struggles with clients and partners, or picking people you must manage", mature: "you partner as an equal and negotiate without needing to win" },
  8: { arena: "other people's money, intimacy and what stays hidden", immature: "secrecy, control, and handling everything alone", mature: "you steward significant shared resources openly, which is rare and highly paid" },
  9: { arena: "belief, teaching and the wider view", immature: "dogma, or needing to convert people", mature: "you teach something that genuinely changes how people see, without needing agreement" },
  10: { arena: "career, authority and public standing", immature: "ambition that consumes the life, or fear of being seen wanting it", mature: "you hold visible authority without apology and use it to open doors for others" },
  11: { arena: "community, network and collective influence", immature: "controlling the group, or staying outside it to stay safe", mature: "you shape a community that outlasts your direct involvement" },
  12: { arena: "the unseen, the unconscious and what runs underneath", immature: "hidden self-sabotage, or power you refuse to admit you want", mature: "you work with what others cannot see, and the perception itself is the product" },
};

// ---------------------------------------------------------------------------- receiving, by Venus sign

export const VENUS_RECEIVING: Record<string, { body: string; whenGiven: string; healthy: string }> = {
  Aries: { body: "a quick surge and then an urge to get moving again, because stillness feels like exposure", whenGiven: "you accept fast and move on before it lands", healthy: "letting the good thing take up an actual minute before you do anything with it" },
  Taurus: { body: "genuine physical pleasure, once you trust it", whenGiven: "you hesitate, check it is real, and then receive fully", healthy: "receiving slowly and letting the enjoyment be as long as it wants to be" },
  Gemini: { body: "a light, slightly nervous energy that wants to talk", whenGiven: "you deflect with a joke or a fact before the moment settles", healthy: "saying only thank you and letting the silence hold it" },
  Cancer: { body: "warmth followed immediately by a pull to give something back", whenGiven: "you feel cared for and then feel you owe", healthy: "letting yourself be looked after without producing a reason you deserved it" },
  Leo: { body: "expansion, real pleasure, and then a flicker of doubt about whether it was too much", whenGiven: "you receive generously in public and awkwardly in private", healthy: "accepting the private, unwitnessed gift with the same ease as the public one" },
  Virgo: { body: "a tightening, and an immediate list of ways it could have been better", whenGiven: "you find the flaw, in yourself or in the gift", healthy: "receiving without auditing it, and without improving on it afterwards" },
  Libra: { body: "pleasure followed by an urgent need to restore the balance", whenGiven: "you reciprocate almost instantly, so nothing is ever simply kept", healthy: "allowing the exchange to sit uneven for a while and noticing nothing breaks" },
  Scorpio: { body: "something closer to exposure than to pleasure, because being given to creates intimacy", whenGiven: "you scan for the motive before you feel the warmth", healthy: "receiving from one trusted person without investigating why they offered" },
  Sagittarius: { body: "expansive and easy, then a rush to pass it on", whenGiven: "you receive generously and give most of it away again", healthy: "keeping some of it, deliberately, for yourself" },
  Capricorn: { body: "discomfort, because unearned things register as debts", whenGiven: "you calculate what it obliges you to", healthy: "accepting something you did not work for and letting it stay unearned" },
  Aquarius: { body: "a slight distance, as though observing it happening to somebody else", whenGiven: "you analyse the gesture before you feel it", healthy: "letting it land in the body before the mind has finished processing it" },
  Pisces: { body: "an easy openness, and then a blur about what is yours", whenGiven: "you receive beautifully and give it back in another form", healthy: "keeping a clear edge around what was given to you specifically" },
};
