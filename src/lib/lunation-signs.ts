// The sign a lunation lands in, written out properly.
//
// Every moon reading used to describe the sign by dropping one phrase from SIGN_TRAITS into an
// otherwise identical paragraph, so a full moon in aries and a full moon in pisces read as the same
// piece of writing with two words swapped. This file holds what a lunation in each sign actually
// does: what it brings up, where it misfires, what its shadow is, and how you work through it.
//
// Two halves of the cycle, because the same sign behaves differently at each end:
//   seed  = new moons and solar eclipses, the planting end
//   peak  = full moons and lunar eclipses, the culminating end
//
// Each line takes her house area so the sign's energy can be woven into her own life rather than
// bolted on afterwards.

export type LunationPhase = "seed" | "peak";

/** One line of sign-specific copy, given the house area this lunation lands in. */
export type SignLine = (area: string) => string;

export interface LunationSignPhase {
  /** What a lunation in this sign genuinely surfaces. */
  brings: SignLine;
  /** The particular way this sign misfires under this moon. */
  watch: SignLine;
  /** The shadow as a mechanism, not a label. */
  shadow: SignLine;
  /** How to work through that shadow this week. */
  work: SignLine;
}

export interface LunationSign {
  seed: LunationSignPhase;
  peak: LunationSignPhase;
}

export const LUNATION_SIGNS: Record<string, LunationSign> = {
  Aries: {
    seed: {
      brings: (a) => `A new moon in aries arrives as impulse rather than plan: a want that shows up already in motion, an itch to begin something today, a sudden impatience with how slowly your own life has been moving. Around your ${a} it tends to surface as the thing you would do immediately if nobody asked you to justify it first, and that impulse is the actual material this cycle is handing you.`,
      watch: (a) => `Aries starts beautifully and gets bored somewhere around day nine. The trap at this new moon is reading the size of the spark as proof the thing is right, then starting four things at once so none of them gets the follow through it needed. Pick one for your ${a}, and decide now what you will do on the day it stops feeling exciting, because that day is coming.`,
      shadow: (a) => `The shadow of a new moon in aries is impatience eating its own beginning: the part of you that wants the result to arrive at the same speed as the decision and quietly withdraws when it does not. It runs in reverse too, as the spark you never let out of the house, because starting badly in front of someone feels worse than not starting at all, and around your ${a} that reflex is expensive.`,
      work: (a) => `Work it by making the first step smaller than your ambition and doing it the same day, since aries trusts motion and loses interest in a decision it has not acted on within a day. Then name the boredom date in advance, the point where novelty wears off around your ${a}, and decide today what you will do when you get there.`,
    },
    peak: {
      brings: (a) => `A full moon in aries brings it up fast, hot and physical, so the first sign is usually in your body rather than your calendar: a short fuse, a restlessness you cannot sit still through, a certainty at eleven at night that something has to change immediately. Aries will not let a feeling stay quiet or polite, so whatever you have been tolerating around your ${a} tends to arrive this week as anger, which is really just clarity moving at speed.`,
      watch: (a) => `The aries misfire is acting on the certainty in the same hour it arrives. Under this moon the urge to confront, quit, send or burn feels exactly like courage, and courage aimed before the picture is complete usually costs you the thing you actually wanted around your ${a}. Give it seventy two hours and the decision either survives or it turns out to have been adrenaline wearing a very convincing outfit.`,
      shadow: (a) => `The shadow of a full moon in aries is impatience wearing the mask of honesty: the part of you that would rather have a fight than a wait, and would rather torch something than sit inside an unresolved situation around your ${a}. It also shows up as the drop that follows the spark, the way you abandon a thing the moment it stops feeling alive and call that instinct rather than avoidance.`,
      work: (a) => `Work it by giving the fire a target that cannot be damaged. Move it physically first, a run, a hard walk, ten minutes of anything that makes you breathe properly, because aries shadow burns off through the body far faster than through analysis. Then write the message you want to send without sending it, say the true sentence about your ${a} out loud to yourself, and notice how much of the urgency drops once the feeling has been expressed anywhere at all.`,
    },
  },
  Taurus: {
    seed: {
      brings: (a) => `A new moon in taurus moves at the speed of a body rather than a mind, so what surfaces is a want with weight to it, something you can touch, keep, taste or count. Around your ${a} it tends to show up as a quiet clarity about what you genuinely value against what you have been putting up with, and a fresh appetite for comfort, steadiness and things built to outlast the month.`,
      watch: (a) => `Taurus takes a long time to start and then never stops, so the risk is spending the whole cycle getting comfortable with the idea instead of planting it. Notice the version of readiness that is really just delay, and notice the pull to make the beginning lovely rather than real, because a beautiful plan for your ${a} still is not the first step of it.`,
      shadow: (a) => `The shadow of a new moon in taurus is comfort defending itself. When a beginning threatens the arrangement you already have, taurus finds perfectly reasonable grounds to postpone it: wrong month, wrong money, not quite ready. Around your ${a} that reads as stubbornness dressed as patience, staying inside the known thing precisely because the known thing never asks you to risk anything.`,
      work: (a) => `Work it by making the new thing physical and small enough to touch, since taurus believes evidence and one concrete act will do more than a month of deciding: money moved, a date booked, an object bought or cleared out. Then ask what comfort this beginning costs you around your ${a}, name it honestly, and choose it knowingly rather than letting it quietly veto you from the background.`,
    },
    peak: {
      brings: (a) => `A full moon in taurus lands in the body and in the bank account, so what comes to a head is usually about worth, security or the physical facts of your life, and it builds slowly enough that you can feel it coming all week. Around your ${a} it tends to surface as a solid, unglamorous truth about what a situation is actually costing you and whether it is still paying you back.`,
      watch: (a) => `Taurus does not react quickly, it accumulates, so the trap is sitting on the truth until it hardens into a resentment you never said out loud. Watch for soothing the feeling instead of feeling it, the food, the spending, the scroll, and watch the flip side too, the immovable position you take at the peak and then defend for a year around your ${a} because changing your mind feels like losing.`,
      shadow: (a) => `The shadow of a full moon in taurus is the refusal to move once you have decided how things are. It looks like loyalty and feels like stability, and underneath it sits the fear that if you let anything change you will lose everything you built. Around your ${a} it also shows up as numbing, the reflex to make discomfort comfortable rather than let it tell you what needs to change.`,
      work: (a) => `Work it by letting the body have the feeling before you let it have a verdict, because taurus will soothe a sensation flat long before it lets that sensation tell you anything: something physical and slow, a bath, a long walk, hands in something real. Then write the one thing you would change about your ${a} if you knew you would not lose the security you have, because that sentence is almost always the whole message.`,
    },
  },
  Gemini: {
    seed: {
      brings: (a) => `A new moon in gemini arrives as information: an idea landing mid conversation, a name you keep hearing, three possibilities where yesterday you had none. Around your ${a} it surfaces as curiosity rather than conviction, the want to ask, message, read and try, and the cycle ahead goes much further spent gathering real answers than spent deciding anything permanent.`,
      watch: (a) => `Gemini's misfire is mistaking talking about the thing for doing it, because a good conversation can discharge the want entirely and the plan for your ${a} never leaves the group chat. Watch too for opening every door at once, since a cycle spent sampling six options tends to finish with six half known things and nothing actually begun.`,
      shadow: (a) => `The shadow of a new moon in gemini is the distraction that arrives exactly when depth is required. The mind offers a more interesting subject the second the current one asks for commitment, and around your ${a} that reads as being open minded when it is closer to being unwilling to be held by anything. It also runs as scattering, keeping enough in the air that nothing can be measured.`,
      work: (a) => `Work it by writing the intention down and telling one person who will ask you about it later, because gemini closes a loop through words and can use them on purpose: one page, one sentence at the top, one question you will genuinely go and find the answer to this week. Then take one option off the table around your ${a}, deliberately, so the rest has somewhere to go.`,
    },
    peak: {
      brings: (a) => `A full moon in gemini brings the truth out through talking: a conversation you did not plan, a message that changes the picture, a piece of information that turns up and rearranges what you thought you were dealing with. Around your ${a} what comes to a head is usually something that was being managed by not being said, and this week it gets said, by you or by somebody else.`,
      watch: (a) => `The gemini trap is saying all of it at once, at speed, to the wrong person. Under this moon the nervous system runs fast and the mind narrates faster, so you can talk yourself into three different certainties before lunch. Notice the urge to explain your position on your ${a} until it is agreed with, because repeating it louder is not the same as being heard.`,
      shadow: (a) => `The shadow of a full moon in gemini is the mind used as an escape hatch. When the feeling gets big, gemini goes up into analysis, jokes, research and other people's opinions, and around your ${a} you can end up knowing everything about the situation while feeling almost none of it. It shows up as the half truth as well, the version edited to keep the conversation comfortable.`,
      work: (a) => `Work it by putting the words somewhere that cannot answer back: write the whole thing out, unedited, before any of it reaches a person, because gemini thinks by expressing and the first version is rarely the true one. Then pick the single sentence about your ${a} you have been avoiding saying plainly, and say only that, to the one person it actually concerns.`,
    },
  },
  Cancer: {
    seed: {
      brings: (a) => `A new moon in cancer starts in the feelings rather than the plans, so what surfaces is a want for safety, closeness, home, or the kind of life that would let you stop bracing. Around your ${a} it tends to arrive as a memory, a longing, or an unexpected softness about something you thought you had filed away, and that tenderness is the seed this cycle is asking you to take seriously.`,
      watch: (a) => `Cancer beginnings can be so careful they never happen, and the trap is waiting to feel safe before you start when safety is mostly built by starting. Watch for the shell going on at the first sign of exposure, and for tending everyone else's beginning instead of your own, because caring for other people around your ${a} is the most socially acceptable way to avoid asking for something yourself.`,
      shadow: (a) => `The shadow of a new moon in cancer is protection that has quietly become a cage. The instinct to keep yourself safe stops distinguishing between a real threat and an ordinary risk, and around your ${a} it shows up as retreat: the withdrawal, the unasked question, the hint dropped instead of the request made. It runs as guilt too, the sense that wanting more betrays what you already have.`,
      work: (a) => `Work it by asking for one thing directly, out loud, this week, because cancer will hint for a year rather than risk a no: a plain sentence, no cushioning, said to the person who can actually answer it. Then make one physical corner of your life feel like yours again around your ${a}, since cancer plants best from somewhere that already feels safe to stand in.`,
    },
    peak: {
      brings: (a) => `A full moon in cancer brings the feeling all the way to the surface, usually more of it than the situation appears to warrant. What comes to a head is rarely only this week, it is this week plus everything it reminds you of, so around your ${a} the old version of the hurt tends to arrive alongside the current one, which is exactly why it can feel so disproportionate from the inside.`,
      watch: (a) => `The cancer trap is going quiet and calling it fine. Under this moon hurt turns inward, the shell closes, and you can make decisions about people around your ${a} without ever telling them there was something to discuss. Watch for the sideways version as well, the sulk, the withheld warmth, the quiet test of whether someone will notice, because indirect is how cancer asks when asking feels too exposed.`,
      shadow: (a) => `The shadow of a full moon in cancer is the old wound doing the talking. A feeling from years ago attaches itself to a current situation, and around your ${a} you end up responding to something that happened long ago with a person who was not there for it. It also shows up as care used as leverage, giving until you are owed and then feeling the debt as a resentment nobody agreed to.`,
      work: (a) => `Work it by separating the old from the new on paper, since cancer feels this week and every earlier version of it at the same volume: write what happened, write what it reminds you of, and notice how much of the intensity belongs to the second list. Then do one comforting, physical thing with nothing to prove, and once the feeling has come down say the one true sentence about your ${a} to the person concerned instead of deciding it privately.`,
    },
  },
  Leo: {
    seed: {
      brings: (a) => `A new moon in leo brings the want back into the room, and not the modest sensible version: the thing you would actually be thrilled by, the recognition, the creative work, the life with your own name on it. Around your ${a} it tends to show up as a flash of wanting to be seen doing this properly, followed half a second later by the urge to make the want smaller.`,
      watch: (a) => `Leo's misfire is needing the applause built into the plan, and if the intention for your ${a} only works when somebody claps, this cycle will hand you a reason to drop it in about three weeks. Watch too for the performance of beginning, the announcement, the aesthetic, the telling everyone, when the real work is unglamorous and happens where nobody can see it.`,
      shadow: (a) => `The shadow of a new moon in leo is pride standing in front of desire. Wanting something openly means risking being seen not getting it, and around your ${a} that can be unbearable enough that you pre shrink the ask into something you are guaranteed to look good doing. It runs the other way too, as needing to be the biggest thing in the room, which is the same fear with better lighting.`,
      work: (a) => `Work it by writing the want at full size with nothing trimmed for modesty, then naming the smallest piece of it you can start doing privately this week, because leo needs both the unembarrassed ambition and the unwitnessed practice. Then tell one person the real version of what you want around your ${a}, out loud, and let it be awkward, since said out loud it stops being something you can quietly downgrade.`,
    },
    peak: {
      brings: (a) => `A full moon in leo brings it to a head in public, or at least in front of somebody. What culminates is usually about recognition, creative work, or where you stand with the people whose opinion you pretend not to need, and around your ${a} the feeling arrives big, warm and theatrical, with a strong sense that this matters and everyone ought to be able to see that it does.`,
      watch: (a) => `The leo trap is making it a scene when it needed a conversation. Under this moon wounded pride arrives dressed as principle, and the grand gesture, the ultimatum, the very public exit all feel enormously justified at the time. Watch the other version too, going cold and regal around your ${a} and waiting to be chased, which costs you the same thing and simply takes longer.`,
      shadow: (a) => `The shadow of a full moon in leo is ego guarding a soft spot. Under a bright sky the fear that you are not actually special enough gets loud, and around your ${a} it comes out as performance, competitiveness, or a flat inability to be the one who apologises first. It also shows up as making a shared situation about your part in it, because being central still feels better than being overlooked.`,
      work: (a) => `Work it by finding the hurt underneath the outrage and naming it to yourself in one plain sentence, the wound rather than the argument, because leo will defend a position for weeks rather than admit to feeling small. Then do the creative thing for nobody, badly, without posting it, since the fastest way out of the performance around your ${a} is proving to yourself that you still enjoy this with no audience in the room.`,
    },
  },
  Virgo: {
    seed: {
      brings: (a) => `A new moon in virgo brings the practical want: a system you would actually keep, a body you want to feel better in, work you want to do properly rather than merely finish. Around your ${a} it surfaces as noticing precisely what is not working, in detail, and feeling the pull to fix it, and that noticing is the useful part even when the list it generates is longer than one cycle.`,
      watch: (a) => `Virgo's misfire is perfecting the preparation: the plan gets rewritten, the tracker gets colour coded, the start moves to Monday, and around your ${a} nothing has actually begun by the time the next moon arrives. Watch also for a beginning built entirely out of discipline, because a regime you designed to punish yourself will not survive the first week you are tired.`,
      shadow: (a) => `The shadow of a new moon in virgo is the critic who turns up before the work does. It sets the standard so high that starting badly, which is the only way anything starts, stops feeling worth doing, and around your ${a} it shows up as endless improvement of things that were already fine while the thing that matters stays untouched. Underneath it usually sits the belief that you are acceptable when useful.`,
      work: (a) => `Work it by defining done before you begin: one intention, one deliberately modest standard, and a written permission that the first attempt is allowed to be rough, because virgo needs the goalposts fixed or they move on their own. Then find the thing around your ${a} you keep tidying instead of changing, and leave it untidy on purpose this week.`,
    },
    peak: {
      brings: (a) => `A full moon in virgo brings the details to a head: what has been quietly wrong in a system, a routine, a job or a body stops being ignorable, and it usually arrives as an accumulation of small things rather than one dramatic event. Around your ${a} it can feel like seeing everything that needs fixing at once, with unusual clarity about exactly whose responsibility each part of it is.`,
      watch: (a) => `The virgo trap is turning clarity into criticism, aimed at yourself first and then at whoever is nearest. Under this moon the flaw becomes the entire picture, and around your ${a} you can talk yourself into believing a fixable situation is fundamentally broken. Watch the anxiety spiral too, the two in the morning list, because a virgo full moon is extremely good at presenting worry as diligence.`,
      shadow: (a) => `The shadow of a full moon in virgo is contempt with a clipboard. The eye that finds what is wrong is a real gift, and under pressure it stops serving anything and becomes a running commentary on your own inadequacy and everybody else's. Around your ${a} it also shows up as control, managing the details so tightly that nobody, yourself included, is allowed to be human inside it.`,
      work: (a) => `Work it by separating what is yours to fix from what you are simply carrying, two honest columns, and hand the second list back in your own head before you try to act on it. Then pick one small concrete repair around your ${a} and do it today, because virgo shadow dissolves in useful action and thrives on lists that never get finished.`,
    },
  },
  Libra: {
    seed: {
      brings: (a) => `A new moon in libra brings relationship into focus, so what surfaces is a want for something fairer, more mutual, or simply more beautiful than what you have been settling for. Around your ${a} it tends to arrive as an awareness of imbalance, the sense that you have been doing most of the accommodating, and a fresh appetite for the version where both people are actually getting something out of it.`,
      watch: (a) => `Libra's misfire is waiting to see what everyone else wants first, and an intention built around being agreeable has no spine in it. Around your ${a} you can spend the whole cycle weighing options purely to avoid the discomfort of choosing one, and watch for the pretty version of the plan as well, the one that looks lovely and asks nothing difficult of anybody.`,
      shadow: (a) => `The shadow of a new moon in libra is self erasure with good manners. The preference goes unsaid because saying it might cause friction, and around your ${a} you end up inside an arrangement you agreed to without ever being asked. It also runs as indecision held long enough that the choice gets made by default, which is still a decision and simply lets you avoid being responsible for it.`,
      work: (a) => `Work it by writing what you want before you consult anybody and keeping that page, because libra thinks best in dialogue and that is exactly why the unconsulted version has to exist first. Then say one preference out loud this week about your ${a}, unsoftened and with no reason attached, and notice that the relationship survives it, since the fear that it will not is the entire mechanism.`,
    },
    peak: {
      brings: (a) => `A full moon in libra brings a relationship to a head: what has been out of balance becomes visible, and it usually arrives through another person rather than as a private realisation. Around your ${a} the thing you have been quietly absorbing turns undeniable, either because somebody names it or because you finally cannot keep holding up your end of an arrangement that only works while you say nothing.`,
      watch: (a) => `The libra trap is smoothing it over before it has been said. Under this moon the urge to restore the peace can arrive faster than the truth does, and around your ${a} you can end up apologising for the existence of the problem. Watch the opposite swing too, the sudden cool fairness, cutting someone off entirely because the direct conversation felt more frightening than the ending.`,
      shadow: (a) => `The shadow of a full moon in libra is resentment that has been accruing politely. Every accommodation you made without mentioning it comes due at once, and around your ${a} it lands either as a coldness you cannot quite explain or as a list delivered in one go. Underneath it sits the belief that being easy to be around is the thing that makes you worth keeping.`,
      work: (a) => `Work it by putting your own side of the ledger on paper before you speak to anyone: what you have been carrying, what you actually want, what you would genuinely accept, in that order. Then have one direct conversation about your ${a} where the unpopular sentence comes early rather than at the end, because libra can run an entire discussion without ever arriving at the point.`,
    },
  },
  Scorpio: {
    seed: {
      brings: (a) => `A new moon in scorpio starts underneath the surface, so what rises is a want you may not say to anyone: about power, intimacy, money that is tangled up with someone else, or a change you already know you are going to make. Around your ${a} it arrives as quiet certainty rather than enthusiasm, and the thing being seeded is usually a transformation rather than a project.`,
      watch: (a) => `Scorpio's misfire is keeping it so private that it never gets any support. The instinct to say nothing until it is done protects you, and around your ${a} it can also leave you alone with something that needed one other person in it. Watch for strategy replacing action as well, the endless reading of the situation from the shadows while nothing actually begins.`,
      shadow: (a) => `The shadow of a new moon in scorpio is control disguised as caution. Fear of being caught unprepared turns into managing everyone's information, testing loyalty and holding back whatever could be used against you, and around your ${a} a beginning guarded that tightly from the start rarely gets enough air to grow. It also shows up as suspicion, reading motive into perfectly ordinary behaviour.`,
      work: (a) => `Work it by telling one trusted person the real thing you are starting before it feels safe to, because scorpio's shadow loses most of its power the moment something hidden is witnessed and nothing bad happens. Then write down what you are afraid would happen if you lost control of this around your ${a}, since the named fear stops running the operation from underneath.`,
    },
    peak: {
      brings: (a) => `A full moon in scorpio brings the buried thing up whole, and rarely politely: a truth about power, money, sex, loyalty, or something that was being kept out of sight. Around your ${a} it tends to arrive with a sense of inevitability, as though the situation has simply run out of room to stay hidden in, and the feelings come in at full strength rather than in a manageable dose.`,
      watch: (a) => `The scorpio trap is the private verdict. Under this moon you can gather evidence, reach a conclusion about someone around your ${a} and cut them off entirely without ever having the conversation that might have changed it. Watch the pull to find out, the checking, the reading into, and watch the sting, the one accurate sentence you know would wound, delivered because you are hurt.`,
      shadow: (a) => `The shadow of a full moon in scorpio is the instinct to take control by knowing more than everyone else. Betrayal, real or anticipated, makes the response absolute, and around your ${a} it comes out as withdrawal, surveillance, or a resentment built carefully and never mentioned. Underneath it is a refusal to be vulnerable in front of anyone who could use it later.`,
      work: (a) => `Work it by letting the intensity out somewhere it can do no damage first, written down in full, ugly and unsent, because scorpio needs the whole feeling expressed rather than managed. Then choose the one thing you would say to the person about your ${a} if you were not protecting yourself, and decide deliberately whether to say it, which is a very different act from deciding in secret not to.`,
    },
  },
  Sagittarius: {
    seed: {
      brings: (a) => `A new moon in sagittarius brings the horizon back, so what surfaces is a want for more room and more meaning: a trip, a course, a belief worth organising your life around. Around your ${a} it tends to arrive as restlessness with how small the current version has become, alongside a very persuasive sense that the answer is somewhere other than here.`,
      watch: (a) => `Sagittarius overshoots. The plan for your ${a} shows up at maximum scale, immediately, and without the boring middle section that would make it possible, so the trap this cycle is confusing the size of the vision with progress on it. Watch the escape route too, because a fresh start somewhere else is sometimes genuine expansion and sometimes simply leaving.`,
      shadow: (a) => `The shadow of a new moon in sagittarius is the next thing used as an anaesthetic. There is always a bigger idea available, and around your ${a} its arrival conveniently relieves you of finishing the current one. It also runs as certainty, a belief held so firmly that you stop checking it against what is actually in front of you.`,
      work: (a) => `Work it by attaching a date and a first cost to the vision, since sagittarius makes things real by committing out loud: book it, pay the deposit, tell the person. Then write down what you are leaving unfinished around your ${a}, honestly, and decide whether this beginning is expansion or exit, because both are allowed and they need completely different plans.`,
    },
    peak: {
      brings: (a) => `A full moon in sagittarius brings a belief to a head. Something you have been assuming about your ${a} meets reality this week, either because the facts turn up or because you finally say what you actually think out loud, and it can feel like a sudden widening of the picture, the moment you see the shape of the whole situation instead of the corner you were standing in.`,
      watch: (a) => `The sagittarius trap is the grand declaration. Under this moon the truth feels so obvious that tact goes out of the window, and around your ${a} you can say the honest thing in a way that costs you the relationship you were being honest with. Watch the sudden exit too, deciding to go, expand or blow the arrangement open because staying has started to feel like being trapped.`,
      shadow: (a) => `The shadow of a full moon in sagittarius is restlessness that calls itself freedom. When a situation asks for endurance the instinct is to reframe leaving as growth, and around your ${a} you can talk yourself out of almost anything using a genuinely convincing philosophy. It also shows up as preaching, certainty delivered at people, which is what conviction does when it is being used to avoid a feeling.`,
      work: (a) => `Work it by testing the belief before you act on it, because sagittarius can hold a conviction far more confidently than the evidence supports: write the sentence you are treating as fact about your ${a}, write what would have to be true for it to be wrong, then go and find out which holds up. Then give the restlessness somewhere physical to go, distance, movement, a change of scene for a day, so the urge to leave does not get to make the decision for you.`,
    },
  },
  Capricorn: {
    seed: {
      brings: (a) => `A new moon in capricorn brings the long game into focus, so what surfaces is a want with a timeline attached: the position, the qualification, the structure that would make your life work differently in three years. Around your ${a} it tends to arrive as sober clarity about what you are genuinely building and whether your current effort is pointed anywhere near it.`,
      watch: (a) => `Capricorn's misfire is starting with the entire staircase. The intention for your ${a} gets built as a system so demanding it depends on you never having a bad week, and the first missed day reads as failure. Watch for the goal borrowed from somebody else's idea of respectable too, because capricorn will work extremely hard for a prize it does not actually want.`,
      shadow: (a) => `The shadow of a new moon in capricorn is worth made conditional on output. The beginning gets loaded with proof, and around your ${a} you commit to something that leaves no room to be a person and then call the exhaustion discipline. It also runs as pessimism, deciding in advance how hard this will be so that not starting can look like realism.`,
      work: (a) => `Work it by building the rest in before you build the plan, because capricorn keeps a promise it has made structurally: put the recovery in the schedule where it cannot be negotiated away. Then write why you want this around your ${a} in one sentence with no mention of anyone else's approval, and if the sentence does not survive that edit, change the goal rather than the effort.`,
    },
    peak: {
      brings: (a) => `A full moon in capricorn brings the structure to a head: a job, a responsibility, an authority figure or the architecture of your own ambition stops being sustainable in its current shape. Around your ${a} what culminates is usually something you have been holding up alone, and it arrives as pressure and tiredness a good while before it arrives as clarity about what has to change.`,
      watch: (a) => `The capricorn trap is handling it. Under this moon the instinct is to absorb more, say nothing and carry the thing around your ${a} considerably further than anyone asked you to, which postpones the conversation that would actually resolve it. Watch for coldness too, the efficient cutting of losses, because capricorn under pressure can end something cleanly and feel the cost of it months later.`,
      shadow: (a) => `The shadow of a full moon in capricorn is the belief that you are the only one who can be relied on. It builds a life where nobody helps you because nobody is ever let in, and around your ${a} the resentment underneath gets aimed at people who were never given the chance to show up. It shows up as harshness with yourself as well, treating ordinary human limits as personal failure.`,
      work: (a) => `Work it by naming one thing you are carrying that was never yours and putting it down or handing it over this week, as a specific dated act rather than an intention, because capricorn responds to decisions. Then write what you would say to someone else in your exact position around your ${a}, since the standard you hold yourself to is almost never the one you would call fair for anybody else.`,
    },
  },
  Aquarius: {
    seed: {
      brings: (a) => `A new moon in aquarius brings the future into the room, so what surfaces is a want to do this differently: to stop following the version everyone agreed on, to build something on your own terms or with people who actually think like you. Around your ${a} it tends to arrive as a clear eyed sense of how strange the normal arrangement looks once you stare straight at it.`,
      watch: (a) => `Aquarius can design an entire system and never live in it. The trap this cycle is keeping the beginning theoretical, elegant on paper and abstracted from your actual week, and around your ${a} the plan can be so committed to being unconventional that it stops being useful to you. Watch for detaching from the feeling too, because why you want this matters as much as the design does.`,
      shadow: (a) => `The shadow of a new moon in aquarius is distance used as safety. Being the observer means never being the one who needs anything, and around your ${a} it shows up as an independence so complete that nobody gets close enough to be disappointing. It also runs as contrarianism, rejecting the ordinary option because it is ordinary rather than because it is wrong for you.`,
      work: (a) => `Work it by putting one actual person inside the plan, because aquarius builds best in company and a beginning that exists only in your own head has nobody to keep it honest. Then name the feeling underneath the idea for your ${a} plainly, since aquarius will present a want as a principle, and a principle is a great deal harder to actually get.`,
    },
    peak: {
      brings: (a) => `A full moon in aquarius brings the group question to a head: where you stand with a community, a friendship, a shared project, or the version of yourself you perform in order to belong somewhere. Around your ${a} what culminates is often the recognition that you have been fitting into something that does not fit you, and it arrives as a sudden cool clarity rather than as heat.`,
      watch: (a) => `The aquarius trap is going remote. Under this moon the instinct is to rise above the feeling, observe everyone from a great height and make a permanent decision about your ${a} without being in the room for the messy part of it. Watch the sudden severance too, the clean cut delivered calmly, which can look like a boundary and be much closer to escape.`,
      shadow: (a) => `The shadow of a full moon in aquarius is detachment arriving exactly when presence was needed. The feeling gets converted into analysis and the personal into a principle, and around your ${a} the people involved end up dealing with your conclusion rather than with you. Underneath it often sits an old certainty that you do not really belong anywhere, formed early and never updated since.`,
      work: (a) => `Work it by staying in the room for one uncomfortable conversation you would normally intellectualise your way out of, because aquarius can name a dynamic brilliantly and still never say the ordinary sentence. Then check whether the group around your ${a} is one you chose or one you inherited, and let the honest answer stand without needing to act on it tonight.`,
    },
  },
  Pisces: {
    seed: {
      brings: (a) => `A new moon in pisces starts without edges, so what surfaces is more feeling than plan: a pull toward something creative, spiritual, restful or kind, and often a dream or an image that stays with you for days. Around your ${a} it arrives as longing rather than ambition, and the thing being seeded usually has to be felt for a while before it can be named.`,
      watch: (a) => `Pisces beginnings dissolve if nothing holds them, so the trap is a cycle spent floating in the beautiful version of the idea while the practical first step never gets a date. Around your ${a} the want can be so unformed that anything counts as progress, which means nothing does, and watch for saying yes to everyone else's beginning, the quickest way to lose your own.`,
      shadow: (a) => `The shadow of a new moon in pisces is escape that looks like softness. When the beginning asks for something concrete, pisces goes back into the dream, the distraction, the substance, the rescue mission, and around your ${a} the fantasy of the thing quietly replaces the pursuit of it. It also runs as martyrdom, giving away so much of yourself that nothing is left to start with.`,
      work: (a) => `Work it by giving the dream one hard edge: a date, an hour in the diary, one person expecting it, because pisces needs a container or the water goes everywhere. Then name what you are avoiding by keeping this vague around your ${a}, and protect one piece of this week for yourself before you give the rest of it away.`,
    },
    peak: {
      brings: (a) => `A full moon in pisces brings the feeling in like weather, subtle rather than sharp: a grief that arrives out of nowhere, an exhaustion you cannot account for, a sudden compassion for someone you were furious with, a dream that says the thing you had not let yourself think. Around your ${a} the line between what is yours and what you are picking up from other people gets very thin this week.`,
      watch: (a) => `The pisces trap is drifting past the moment of clarity without doing anything with it, because under this moon it is easy to feel everything and act on none of it, and the truth that arrives at midnight about your ${a} can be gone by Thursday. Watch the numbing too, the wine, the sleep, the scroll, and the habit of taking responsibility for feelings that were never yours to carry.`,
      shadow: (a) => `The shadow of a full moon in pisces is the blur. Boundaries go, and around your ${a} you can absorb someone else's mood, rescue a person who has not asked to be rescued, or make yourself so available that you disappear out of your own life. It also shows up as the story, a version of events in which you had no power at all, which is comforting and not true.`,
      work: (a) => `Work it by writing down what you felt before you decide what it meant, and splitting the list into what is yours and what you absorbed, because pisces will not find that line unless it is drawn deliberately. Then take the one true thing that surfaced about your ${a} and give it a physical form this week, a message sent, a page written, a thing made, so the insight survives contact with the morning.`,
    },
  },
};

/** The half of the cycle a lunation belongs to: planting, or culminating. */
export function phaseForLunation(type: string): LunationPhase | null {
  if (type === "new_moon" || type === "solar_eclipse") return "seed";
  if (type === "full_moon" || type === "lunar_eclipse") return "peak";
  return null;
}

/** The sign-specific line for a section, or null for anything that is not a lunation. */
export function signLine(
  sign: string,
  type: string,
  field: keyof LunationSignPhase,
  area: string,
): string | null {
  const phase = phaseForLunation(type);
  const entry = LUNATION_SIGNS[sign];
  if (!phase || !entry) return null;
  return entry[phase][field](area);
}
