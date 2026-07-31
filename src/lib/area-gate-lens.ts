// What each of the 64 gates actually means inside a specific area of life.
//
// The gate data itself (keynote, shadow, gift) is universal: gate 26 is gate 26 wherever it turns
// up. But a season pressing on gate 26 lands completely differently in love than it does in money,
// and reading the same universal keynote on every area page is what makes a feature feel generic.
// So each area gets its own lens over all 64 gates, and a season shows every gate it activates
// rather than only the handful that happen to sit in that area's centres.
//
// An area with no lens yet falls back to the universal keynote, so this can be rolled out one area
// at a time without any page breaking.

export const AREA_GATE_LENS: Record<string, Record<number, string>> = {
  relationships: {
    1: "Your own creative self-expression becomes the thing that attracts, or the thing you keep editing down to be easier to love.",
    2: "You get a clearer sense of the direction you want a relationship to go, rather than drifting wherever the other person steers.",
    3: "New beginnings in love feel messy before they feel exciting. The awkward early stage is not a bad sign here, it is the actual shape of starting.",
    4: "You want an answer about where this is going, and the mind will happily invent one. The pressure is mental, the answer is not.",
    5: "Rhythm matters more than intensity. Whether someone fits your natural pace is the real compatibility question this season.",
    6: "The intimacy gate. Your capacity to let someone close opens and shuts in waves, and conflict here is not failure, it is the doorway being tested.",
    7: "Who leads, and whether you are willing to be led. Direction inside a partnership becomes the live question.",
    8: "Being valued for what makes you different, rather than for how well you fit in. Bringing your actual self is the assignment.",
    9: "Attention to the small details of a relationship. What you focus on here compounds, in both directions.",
    10: "Self-love as the precondition. How you treat yourself sets the ceiling on what you will accept from someone else.",
    11: "Ideas about love, the ones you have absorbed and the ones you actually believe. Worth checking which is which.",
    12: "Whether you say the emotionally true thing or the socially smooth thing. Caution here can be wisdom or avoidance.",
    13: "You become the one people tell things to. Holding someone's story is intimacy, and it can also become a role you disappear into.",
    14: "What you bring materially and practically to a partnership, and whether that has quietly become how you earn your place.",
    15: "Your tolerance for other people's rhythms. Love asks you to stretch around difference without dissolving into it.",
    16: "Enthusiasm for someone, and whether you can stay past the exciting first phase into actual skill at loving them.",
    17: "Your opinions about how a relationship should go. Strong views here can be clarity or they can be a fence.",
    18: "You notice what is wrong. Used well that protects the relationship, used badly it becomes a running critique nobody asked for.",
    19: "Sensitivity to what your person needs, sometimes before they say it. The line between attunement and losing yourself is thin this season.",
    20: "Being present with someone rather than managing the impression. What you actually feel, in the moment, said out loud.",
    21: "Control. Who decides, who holds the resources, and whether you can share authority without feeling erased.",
    22: "Emotional grace under social pressure. How openly you let yourself be moved in front of someone else.",
    23: "Saying the complicated inner thing simply enough to be understood. Being misheard here is usually about timing rather than content.",
    24: "The returning mind. You keep going back over the same relationship question, and the answer arrives by living rather than by thinking.",
    25: "Loving without conditions attached, including loving yourself through the part where it is not being returned.",
    26: "Persuasion. How much you shape yourself to convince someone, and where that tips from charm into performance.",
    27: "Caring for someone. This season asks whether the care is mutual, or whether you have quietly become the one who does the nourishing.",
    28: "Whether this relationship means something. The struggle for depth over comfort shows up hard here.",
    29: "Commitment. Saying yes properly, and noticing where you have been half-in and calling it keeping your options open.",
    30: "Desire and longing. Wanting someone intensely is information, but it is not the same thing as clarity about them.",
    31: "Your voice inside the relationship. Whether you influence by being heard or by being loud.",
    32: "Instinct about what will last. You can usually tell early, and this season asks you to trust that read rather than argue with it.",
    33: "Retreat. Needing space to process is legitimate, and using it to avoid the conversation is not the same thing.",
    34: "Raw energy and independence. Your power is attractive, and it can also be the reason you do not let anyone actually in.",
    35: "Hunger for something new. Restlessness in love is real information, though not always about the other person.",
    36: "Emotional crisis as a growth route. Turbulence now is often the relationship maturing rather than ending.",
    37: "The bond itself. Friendship, family, the agreements you have made. Loyalty gets examined, and so does whether it is equal.",
    38: "Fighting for it. Worth checking whether you are fighting for the relationship or just fighting because that is familiar.",
    39: "Provocation. You poke at the thing to get a real reaction, which either produces honesty or a fight, depending on the timing.",
    40: "Needing to be alone, inside a relationship. Denying that need is what produces the exhaustion, not the relationship itself.",
    41: "The fantasy of a relationship, versus the one in front of you. Imagination is the start of desire, and it is not evidence.",
    42: "Endings and completions. Finishing something properly rather than letting it trail off is the work here.",
    43: "You know something about this relationship that you cannot yet explain. Being ahead of your own words is uncomfortable and usually correct.",
    44: "Instinct about people, often about patterns you have met before. Your past is pattern-matching, and it is sometimes right.",
    45: "Sharing resources, and who holds them. This season makes the practical side of togetherness explicit rather than assumed.",
    46: "Being in your body with someone. Physical presence, touch and the delight of the ordinary.",
    47: "Making sense of what happened. You are processing a relationship experience into meaning, and it will feel confused before it lands.",
    48: "Fear of not being enough for someone, and the depth you actually have underneath that fear.",
    49: "Your principles about how you will be treated. Where the line is, and whether you are willing to end something over it.",
    50: "Responsibility to the people who are yours. What you owe, what you have inherited, and which of it is genuinely yours to carry.",
    51: "Shock. Something disrupts the relationship and forces initiative, and courage matters more than composure here.",
    52: "Stillness under pressure. Not acting on the relationship feeling immediately is what gives it room to become clear.",
    53: "Beginning something. New energy arrives, and the pressure to start can outrun whether you actually want this one.",
    54: "Ambition inside a relationship, including the uncomfortable question of whether being with someone raises or lowers you.",
    55: "The emotional weather. Your mood swings between abundance and emptiness, and neither one is the truth about the relationship.",
    56: "Stories. The story you tell about your love life shapes what you notice next, and it is worth checking who wrote it.",
    57: "Intuitive clarity in the present moment. The quiet first hit about someone, which is usually accurate and easy to argue away.",
    58: "Vitality and the urge to improve things. Wanting better for a relationship is love, and constant correction is not.",
    59: "Intimacy and sexuality directly. Breaking through the barrier to actual closeness, and the honesty that requires.",
    60: "Limitation. Accepting the real constraints of a relationship rather than the version you wish it were.",
    61: "The pressure to understand why someone is the way they are. Some of it is not knowable, and sitting with that is the practice.",
    62: "The details. Naming things precisely, which either creates real understanding or turns into pedantry mid-argument.",
    63: "Doubt. Questioning the relationship is healthy inquiry until it becomes a loop, and the difference is whether it produces action.",
    64: "Mental replay of past relationships. Confusion now is the mind digesting something, and clarity arrives on its own schedule.",
  },
};

/** The area-specific reading for a gate, falling back to the universal keynote. */
export function gateLensFor(areaId: string, gate: number, fallback: string): string {
  return AREA_GATE_LENS[areaId]?.[gate] ?? fallback;
}
