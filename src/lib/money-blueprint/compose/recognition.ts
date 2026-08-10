/**
 * Money Blueprint — recognition content.
 *
 * The difference between "that is an accurate reading of my chart" and "that is me" is specificity
 * about ordinary moments. This file holds the concrete scenes: the four seconds before a discount,
 * the tab left open, the message drafted and not sent.
 *
 * Rules for anything added here:
 *  - a scene, not a trait. "You reread the invoice before sending" beats "you lack confidence".
 *  - present tense, second person, no hedging.
 *  - it must be falsifiable. If a reader could say "no, I do not do that", it is doing its job.
 */

export interface Recognition {
  /** Ordinary moments the reader will recognise immediately. */
  scenes: string[];
  /** How the pattern shapes the way they think about money. */
  thinking: string;
  /** How it shapes the way money is received. */
  receiving: string;
  /** How it shapes financial decisions specifically. */
  deciding: string;
  /** What is measurably different once this is worked with. */
  healed: string[];
  /** Extra coaching moves beyond the single exercise. */
  practices: Array<[string, string]>;
}

export const RECOGNITION: Record<string, Recognition> = {
  worth: {
    scenes: [
      "You reread an invoice before sending it, and the rereading is not for typos",
      "Somebody says the work was excellent and you hear yourself explaining what you would have done differently",
      "You have a folder of things you made that nobody has seen, held back for a version that would be ready",
      "You take on the small extra task at the end of a project without mentioning it, and you would be embarrassed to itemise it",
      "You know exactly what you earned last year and cannot say out loud what you are worth",
      "A quiet Tuesday with no deliverable produces a specific low dread that has nothing to do with money in the bank",
    ],
    thinking: "You think about money as a scoreboard rather than as a resource, so every figure gets read as a verdict on whether you have done enough rather than as information about a business.",
    receiving: "Money arriving produces a brief relief and then an itch to justify it, which is why the days after a payment lands are often your most over-delivering days.",
    deciding: "You decide by asking whether you have earned the right to the thing rather than whether it is the correct move, which means you routinely delay decisions you can plainly afford.",
    healed: [
      "You send the invoice without rereading it",
      "A win stays a win for longer than a day",
      "You can name your rate in a sentence with no second clause",
      "A slow week reads as a slow week rather than as evidence",
      "You stop adding the unbilled extra, and nobody notices except your margin",
    ],
    practices: [
      ["The unsent list", "Write down everything you have made that nobody has seen. Pick the oldest one and release it this week, unimproved."],
      ["The one-sentence rate", "Practise saying your price as a complete sentence with nothing after it. Say it aloud twenty times until the silence stops feeling like a gap you must fill."],
      ["The evidence file", "Keep a running note of specific things clients said your work changed. Read it before you quote, not after."],
      ["The bar audit", "For a month, log each win and the date the bar moved. Seeing the average interval in writing does more than any amount of reassurance."],
    ],
  },

  receiving: {
    scenes: [
      "Somebody buys you lunch and you are already working out how to get the next one",
      "A compliment lands and you have replied with a qualifier before you have finished hearing it",
      "You have said the words it was nothing about work that took you four hours",
      "Being given something unexpectedly makes you slightly uncomfortable in a way you would struggle to explain",
      "You would rather send the payment than receive it, because sending is clean and receiving is not",
      "You are the person everybody asks for help and you cannot name the last time you asked for any",
    ],
    thinking: "You think about money as a ledger to be kept level, so an unearned gain does not read as good fortune, it reads as an open entry waiting to be settled.",
    receiving: "It creates a small debt in your body. The discomfort is not about the money, it is about being in a position where somebody has given and you have not yet given back.",
    deciding: "You decide against anything that would leave you owing, which quietly rules out investment, partnership, and most of the arrangements that would have scaled the work.",
    healed: [
      "You accept a compliment with a full stop after thank you",
      "Money lands and stays without triggering a delivery of anything extra",
      "You ask for something directly and do not offer anything in exchange",
      "You let somebody help without immediately finding a way to repay it",
      "Your income stops being capped by what you can bear to be given",
    ],
    practices: [
      ["The twenty-four hour rule", "When something is given, give nothing back for a full day. Note what the discomfort actually feels like and where it sits in your body."],
      ["The full stop", "Practise receiving praise with two words. Thank you. Then stop. The urge to add is the pattern, and it goes quiet with repetition."],
      ["The ask", "Ask one person for one specific thing this month with no exchange attached, and notice that the relationship survives it."],
      ["The unreciprocated gift", "Let one generous thing stand unmatched for a full month. Write down what you were afraid would happen and what actually did."],
    ],
  },

  visibility: {
    scenes: [
      "You have drafted the post, softened it, and posted the softened one",
      "Something of yours does well and within a fortnight you are strangely quiet",
      "You have said I do not want to be one of those people who and then not done the thing",
      "You are more interesting in a private message than you are in public",
      "Somebody describes your work back to you and you hear how much you have been underselling it",
      "You have a version of your offer that you believe in and a version you actually sell",
    ],
    thinking: "You think about visibility as exposure rather than as distribution, so the calculation you run is about risk rather than about reach.",
    receiving: "Public praise is harder for you than private payment, and a large audience response can produce something closer to dread than to pleasure.",
    deciding: "You decide on the safer, more explicable option, and then feel flat about the result in a way that is easy to mistake for the wrong strategy rather than the wrong size.",
    healed: [
      "You publish the version you actually meant",
      "Growth arrives without a retreat behind it",
      "You stop pre-apologising in your own marketing",
      "Your public voice and your private voice are the same voice",
      "The people who find you already agree with you, because you said the real thing",
    ],
    practices: [
      ["Two drafts", "Write the diplomatic version and the true version. Publish the true one. Keep both, and compare how each performed after a month."],
      ["The fortnight watch", "After anything grows, mark two weeks in the diary. When the urge to withdraw arrives, you will have predicted it, which takes most of its authority away."],
      ["The ceiling test", "Name the level of visibility you have never passed. Do one thing above it deliberately, expecting the discomfort rather than treating it as a signal."],
      ["Unsoften one sentence", "Take your current offer and remove every hedge. Read what is left. That is the actual product."],
    ],
  },

  scarcity: {
    scenes: [
      "You check the balance more often than the balance changes",
      "A good month produces bracing rather than pleasure",
      "You have kept a client you did not want because turning work away felt reckless",
      "You know the cheapest version of everything you buy for the business",
      "You have a cushion and you still would not describe yourself as financially safe",
      "You have said I will do that when things are more stable about something you could afford two years ago",
    ],
    thinking: "You think about money as a level that could drop rather than a flow that could grow, so protection outranks growth in almost every calculation you run.",
    receiving: "Money arriving is a relief rather than a pleasure, and the relief is short, because the threat was never really about this month.",
    deciding: "You decide by asking what could go wrong, which is excellent for avoiding disasters and terrible for catching opportunities, and over a decade the second cost is larger.",
    healed: [
      "A good month feels good while it is happening",
      "You invest in the business without a fortnight of deliberation",
      "You turn down work that is wrong without a story about why it was fine to",
      "You can say what enough costs, in figures",
      "You spend on something that grows you rather than only on things that protect you",
    ],
    practices: [
      ["Date the fear", "Write down when money was genuinely frightening and how old you were. Then write today's date. The gap is the point."],
      ["The enough number", "Work out what your actual life costs per month. Undefined enough can never be reached, and most of the anxiety lives in the vagueness."],
      ["One deliberate spend", "Spend on something that grows you rather than protects you, and record what actually happened afterwards rather than what you feared."],
      ["The no", "Turn down one piece of wrong work and watch the pipeline not collapse."],
    ],
  },

  overgiving: {
    scenes: [
      "You have offered a discount before anybody asked for one",
      "You leave client calls tired in a way the work does not explain",
      "You know which of your clients are struggling and it affects what you charge them",
      "You have given a friend or a member of your community the thing you sell",
      "You can feel a room change and you adjust before you have decided to",
      "The people closest to you have your worst terms and your best work",
    ],
    thinking: "You think about a price as something that happens between two people rather than as a fact about the work, so the number moves with the relationship instead of with the value.",
    receiving: "You receive attentively and then hand something back, because an uneven exchange registers in your body as a problem you are responsible for solving.",
    deciding: "You decide in the room, under the influence of whatever the room is feeling, which is why so many of your decisions look different by morning.",
    healed: [
      "You quote and then stop talking",
      "A client's pause stays theirs",
      "Your community gets your warmth and your standard terms",
      "You finish client work without needing a day to recover from it",
      "Decisions made at night still look right in the morning",
    ],
    practices: [
      ["Never in the room", "Every money decision gets a night. Say you will confirm tomorrow, and notice how many change."],
      ["Name it as theirs", "When the discomfort lands, say silently that it arrived with them. Ten seconds, and it works immediately."],
      ["Terms first", "Write your terms for the people you like most, before you like them more. Warmth is when terms get renegotiated."],
      ["The recovery ledger", "Track how long you need after client work. Price the recovery in, because it is part of the delivery cost."],
    ],
  },

  depth: {
    scenes: [
      "You have solved somebody's actual problem in a free consultation and then quoted for the small version",
      "People tell you the session changed things and you feel slightly embarrassed",
      "You charge more for the thing that took you longer, not the thing only you can do",
      "You have built a course to avoid selling yourself",
      "Somebody describes what you did for them and you barely recognise it as work",
      "You are the person friends call about the thing nobody else will discuss",
    ],
    thinking: "You think effort equals value, so your internal pricing model rewards struggle and penalises mastery, which is exactly backwards.",
    receiving: "Being paid well for something easy produces guilt rather than satisfaction, so you add something to make the exchange feel proportionate.",
    deciding: "You decide to build the more explicable offer instead of the one you are uniquely able to deliver, because the explicable one feels more defensible to charge for.",
    healed: [
      "Your rarest skill is your most expensive offer",
      "You name the problem in the consultation and the price straight after",
      "You stop building lighter products to avoid pricing your presence",
      "Ease stops reading as evidence of low value",
      "Fewer clients, higher rate, and more energy at the end of the week",
    ],
    practices: [
      ["The effortless list", "Write what is easy for you and hard for everybody else. That list is your premium tier, and it is probably currently free."],
      ["The five-year test", "For each skill, ask how long a competent person would need to learn it. Anything above five years goes to the top of your pricing."],
      ["Stop at the diagnosis", "In your next consultation, name the real problem and then name the price. Do not solve it in the room."],
      ["Retire one", "Kill the lightest offer in your suite. It exists to help you avoid the deep one."],
    ],
  },

  legitimacy: {
    scenes: [
      "You have researched something you already knew before saying it publicly",
      "Your prices come with a paragraph of explanation nobody asked for",
      "You have bought a course in a subject you could teach",
      "Being talked over in a meeting stays with you for the rest of the day",
      "You say things like this might be obvious but before saying something that is not",
      "You give away the thinking free and charge for the document",
    ],
    thinking: "You think authority is granted rather than assumed, so you keep looking for the qualification that will finally settle it, and no qualification does.",
    receiving: "Praise for your thinking is harder to take than praise for your output, because the thinking is the part you are not sure you are allowed to claim.",
    deciding: "You decide to prepare more instead of deciding, and the preparation feels productive while functioning as a delay.",
    healed: [
      "You say it without the preamble",
      "The price arrives in one sentence",
      "You stop collecting credentials you do not need",
      "Your voice becomes something you charge for rather than something you give away",
      "You publish the idea without the evidence appendix",
    ],
    practices: [
      ["No preamble", "Say one thing publicly with the throat-clearing removed. Notice that it lands better, not worse."],
      ["One sentence of context", "Cap the explanation after your price at a single sentence. Silence carries more authority than reasoning."],
      ["The permission audit", "Write down who you are waiting for permission from. Most people find the name belongs to somebody who stopped paying attention years ago."],
      ["Charge for thinking", "Sell one thing that is purely your judgement, with no deliverable attached."],
    ],
  },

  control: {
    scenes: [
      "Nobody, including anybody close to you, knows your actual numbers",
      "You have done a task badly yourself rather than hand it over well",
      "Someone offering financial advice produces a reaction out of proportion to the advice",
      "You keep more cash than is sensible because deployed money is less controllable",
      "You have rebuilt something alone rather than ask for help, and counted that as character",
      "You would take less money for more control, and have",
    ],
    thinking: "You think about money as territory rather than as a flow, so the instinct is to defend the perimeter rather than to increase throughput.",
    receiving: "Accepting anything with strings attached is genuinely difficult, so you turn down support that would have cost you very little autonomy.",
    deciding: "You decide alone, which is fast and keeps everything at the size one guarded person can hold.",
    healed: [
      "One other person sees the real numbers",
      "You delegate something that matters and it survives",
      "Your reaction to being advised becomes information rather than a wall",
      "Money moves rather than sits",
      "You hold authority in the open, which is the version that is purchasable",
    ],
    practices: [
      ["Say the numbers", "Monthly, out loud, to one trusted person. Secrecy is the part costing you, not the holding."],
      ["Delegate something real", "Not an unimportant task. Something with consequences. Watch it hold."],
      ["The grip check", "Notice where money tightens you physically, usually jaw or hands. Release it before you speak."],
      ["Deploy some", "Move some of what is sitting still. Circulation is how this placement grows."],
    ],
  },

  safety: {
    scenes: [
      "You have a number in mind for when you will relax and it has moved at least twice",
      "You are more comfortable earning than spending, by a wide margin",
      "You have deferred something you want for a year that could have been afforded that year",
      "You would describe yourself as sensible and you sometimes mean it as an accusation",
      "The savings are healthy and the feeling of safety has not arrived",
      "You choose the reliable option and feel a small private disappointment about it",
    ],
    thinking: "You think about money as a wall to be built higher rather than a base to live on, so no amount ever completes the project.",
    receiving: "Money arriving raises the target rather than settling it, which is why good months make you more cautious instead of less.",
    deciding: "You decide for the option that cannot go badly, and over a decade that is how a small life gets built by somebody entirely capable of a large one.",
    healed: [
      "You spend on pleasure without a justification attached",
      "The threshold stops moving because you decided it",
      "You take one calculated risk that would be survivable if it failed",
      "You notice the base you built rather than the gap above it",
      "Enjoyment starts happening while you are still building",
    ],
    practices: [
      ["Declare enough", "Write the monthly figure that constitutes enough and treat it as fixed for a year."],
      ["The unjustified spend", "One purchase purely for pleasure, at a level that feels slightly extravagant. No reason given, including to yourself."],
      ["The base inventory", "List what is genuinely secure now that was not five years ago. Read it when the bracing arrives."],
      ["One survivable risk", "Sized so failure would be uncomfortable rather than catastrophic. Take it."],
    ],
  },

  autonomy: {
    scenes: [
      "You have left something good because it started to feel managed",
      "Advice, even correct advice, produces a flare before it produces consideration",
      "You would rather earn less and answer to nobody, and you have proved it",
      "You resist systems that would obviously help, because somebody else designed them",
      "You have been described as difficult to manage and privately enjoyed it",
      "You are best at work nobody is watching",
    ],
    thinking: "You think about arrangements in terms of how easily you could leave them, which is a survival calculation running underneath a business one.",
    receiving: "Support with conditions is refused on reflex, including support that had almost no conditions.",
    deciding: "You decide fast against anything that looks like constraint, and some of those decisions cost you partnerships that would have been genuinely good.",
    healed: [
      "You pause before refusing",
      "You collaborate without losing yourself",
      "Structure you designed carries load that used to be carried by willpower",
      "You can take advice from one chosen person",
      "Independence stops meaning isolation",
    ],
    practices: [
      ["The overnight refusal", "When the no fires, wait a day before acting on it. The reflex is faster than the assessment."],
      ["One bounded collaboration", "Small, defined, on terms you wrote. Prove to yourself that working with somebody does not cost you yourself."],
      ["Your own systems", "Build the structure yourself. It only feels like a cage when somebody else designed it."],
      ["One adviser", "Chosen by you, which keeps the autonomy intact while letting the help in."],
    ],
  },

  sustainability: {
    scenes: [
      "You work past the point your body asked you to stop, routinely",
      "Your best weeks are followed by weeks you would rather not discuss",
      "Rest happens after collapse rather than before it",
      "You have described a normal month as a busy month for three years",
      "A free afternoon produces guilt rather than relief",
      "You price by volume because that is the only lever you have been using",
    ],
    thinking: "You think of capacity as a discipline problem rather than a design fact, so every crash gets filed as a personal failing and the model never changes.",
    receiving: "Money arriving raises output rather than lowering it, because the payment reads as a signal to justify rather than a signal to rest.",
    deciding: "You decide to take on more when you are already at capacity, because saying no requires a reason and being tired has never felt like a good enough one.",
    healed: [
      "Rest is in the diary before the work is",
      "Income arrives while you are not working",
      "You raise rate instead of volume",
      "You act on the stop signal within the hour rather than at the end of the task",
      "A quiet week stops needing an explanation",
    ],
    practices: [
      ["Rest first", "Put three genuine rest periods in the diary before you schedule work. Protect all three."],
      ["The signal log", "Note when your body says stop and when you actually stop. The gap is where the damage lives."],
      ["Income that pays while you sleep", "Build one stream that does not require you present. This is structural rather than aspirational."],
      ["Rate not volume", "Raise one price rather than adding one client. Repeat until the maths works at your actual capacity."],
    ],
  },

  belonging: {
    scenes: [
      "You cannot be in a professional room without offering something useful",
      "You have done free work for people whose regard you wanted and called it strategy",
      "You give your best thinking away in group settings and keep the ordinary version for clients",
      "You feel least able to charge in rooms full of peers, which is where your work actually comes from",
      "You over-function in every collaboration you join",
      "You have paid, in labour, to be somewhere you were already welcome",
    ],
    thinking: "You think of a room as something to earn a place in, so every professional setting has an entry fee you are paying without anybody charging it.",
    receiving: "Being included without contributing feels unstable, so you keep producing until the instability goes away, which it never quite does.",
    deciding: "You decide to give rather than to charge whenever the relationship matters, which means your best contacts are systematically your worst-paying.",
    healed: [
      "You attend and contribute nothing, and remain welcome",
      "Peers pay your standard rate",
      "Your network becomes your strongest channel rather than your most expensive one",
      "You ask for things in groups rather than only giving",
      "The entry fee stops being paid",
    ],
    practices: [
      ["Contribute nothing", "Once a week, be in a group and offer nothing useful. Notice nobody removes you."],
      ["Charge your peers", "The people closest to your level should not have your cheapest work. Fix one of those relationships this month."],
      ["The ask in the room", "Ask a group for something rather than giving them something."],
      ["Name the fee", "When the urge to contribute arrives, name what it is buying. Usually it is buying something you already have."],
    ],
  },

  power: {
    scenes: [
      "You would rather hold the money than be given it",
      "You have walked away from something rather than be in a weaker position in it",
      "Your finances are private to a degree that has occasionally caused problems",
      "You are calm in situations that frighten other people and you barely notice this about yourself",
      "You have rebuilt from very little at least once",
      "Being financially dependent, even briefly, is genuinely intolerable to you",
    ],
    thinking: "You think about money as leverage rather than as comfort, which makes you unusually clear-eyed and unusually secretive.",
    receiving: "Receiving shifts the balance of power, so you accept less than you could in order to keep the position you are in.",
    deciding: "You decide for control over upside, which protects you and caps you in the same move.",
    healed: [
      "Authority held in the open rather than in private",
      "You take investment or partnership with terms written down",
      "The reaction to being directed becomes a boundary rather than a wall",
      "Your resilience gets used deliberately rather than held in reserve",
      "Money moves, and moving is how this placement compounds",
    ],
    practices: [
      ["Visible authority", "Take a position publicly rather than steering privately. It is the version people can buy."],
      ["Terms in writing", "Accept one arrangement with shared upside and clearly documented authority."],
      ["Use the resilience", "You can rebuild. Price one risk accordingly rather than as though your floor were as low as everybody else's."],
      ["One witness", "Let one person see the whole picture. Secrecy is the only part of this actually costing you."],
    ],
  },

  expansion: {
    scenes: [
      "You have replaced something that was working because it had stopped being interesting",
      "There are at least two abandoned projects you still think were good ideas",
      "You are better at launches than at maintenance and you know it",
      "The offer that earns most is the one you are most bored of",
      "You have rebuilt a website, a brand or an offer that did not need rebuilding",
      "Boredom arrives and you read it as a signal that something is wrong",
    ],
    thinking: "You think about growth as newness rather than as accumulation, so a thing that is simply working does not register as progress.",
    receiving: "Money arriving funds the next project rather than consolidating the current one, so income keeps buying more work instead of more freedom.",
    deciding: "You decide toward the interesting option, which is how somebody with real ability ends up starting over more often than compounding.",
    healed: [
      "One offer runs unchanged for a year and outperforms everything you built to replace it",
      "Boredom becomes information rather than instruction",
      "You harvest as deliberately as you build",
      "Revenue accumulates instead of resetting",
      "The next idea gets written down and left for a quarter",
    ],
    practices: [
      ["Twelve months unchanged", "Pick the offer that works and commit to not touching it for a year."],
      ["The idea drawer", "When the pull arrives, write it down and put it away for a quarter. Most do not survive the wait."],
      ["Count the cost", "List what you replaced and what it was earning. The total is usually the argument."],
      ["Schedule the harvest", "Put maintenance periods in the calendar with the same seriousness as launches."],
    ],
  },
};

export function recognitionFor(theme: string): Recognition | null {
  return RECOGNITION[theme] ?? null;
}
