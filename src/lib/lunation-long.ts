// The long-form lunation sections, written per sign at the standard Betty set.
//
// These replace the composed section wholesale when the sign and phase have been written: the
// opener, the sign, what it exposes, what it asks. They are about the moon in that sign rather than
// about her houses, because the personal layer is already carried by the chart breakdown further up
// the page. Where a sign has not been written yet, moon-content falls back to the shorter composed
// version in lunation-signs.ts, so every moon still reads as a complete reading.
//
// Paragraph 0 of each section is the phase opener, what a full moon or a new moon does at all. An
// eclipse reading already opens with its own framing, so it skips that first paragraph and takes
// the rest.
//
// **double asterisks** mark a bold run. The moon page renders them; nothing else reads this copy.

export type LunationPhase = "seed" | "peak";

export interface LongSection {
  bringsUp: string[];
  lookOutFor: string[];
  shadow?: string[];
}

export const LUNATION_LONG: Record<string, Partial<Record<LunationPhase, LongSection>>> = {
  Aries: {
    peak: {
      bringsUp: [
        `A Full Moon brings things into full view, making it harder to ignore what you want, what you've outgrown and what you're finally ready to do something about. It's a culmination point, so emotions can feel louder, truths can become clearer and situations that have been sitting in the background can suddenly demand your attention.`,

        `A **Full Moon in Aries** turns that energy toward **YOU**. Aries rules identity, independence, desire, courage, confidence, anger, boundaries, instinct and the willingness to go first, which makes this Moon a major check-in with who you're becoming and whether your life actually reflects her.`,

        `This Moon can expose where you've been shrinking yourself, waiting for permission, swallowing what you really want, saying yes when your whole body means no, or making yourself easier to deal with so everybody else stays comfortable. Aries doesn't want you endlessly analysing whether you're allowed to want more, because sometimes the answer really is: **I want it because I f*cking want it.**`,

        `You may feel a stronger desire to choose yourself, reclaim your independence, take up more space, set a boundary or finally admit that something doesn't fit anymore. Anger and frustration can surface too, especially around places where you've ignored your own needs, and those feelings can give you valuable information about what needs to change.`,

        `There's also something deeply celebratory about this Moon. Look at where you've become braver, backed yourself, taken risks, survived things you once thought would break you or become a version of yourself your past self would've been obsessed with.`,

        `The energy asks: **Where am I ready to choose myself more boldly?**`,
      ],
      lookOutFor: [
        `Aries energy moves faaaast, and under a Full Moon you can feel like every realisation needs an immediate response. You might suddenly want to quit, confront someone, send the text, cut somebody off, launch the thing, book the flight or completely reinvent your life before you've had time to work out whether you actually want the outcome.`,

        `Watch the difference between **courage and reactivity**. Aries gives you the guts to stop tolerating situations that aren't working, but its shadow can make action itself feel like the solution. Sometimes the most powerful move is knowing exactly what you want and refusing to rush just because your emotions are running hot.`,

        `Anger deserves your attention under this Moon, especially if you've spent weeks or months swallowing it. Resentment can reveal where you've repeatedly crossed your own boundaries, frustration can show you what you've outgrown, and irritation can point toward desires you've been pretending don't matter. Listen to the message without automatically handing the emotion the steering wheel.`,

        `You may also notice a stronger **f*ck everyone, I'll do it myself** streak coming through. Independence is one of Aries' superpowers, but hyper-independence can become its own trap when asking for help, receiving support or allowing somebody else into the process feels like weakness. You don't need to prove how powerful you are by carrying everything alone.`,

        `Comparison and competition can get louder too. Aries loves to win, move first and make sh*t happen, so seeing somebody else doing what you want can trigger impatience about your own timeline. Instead of turning their success into evidence that you're behind, notice what your reaction reveals about what you secretly want more of.`,

        `Be mindful of starting fights simply because you're craving movement. When you've felt stuck for too long, conflict can create an instant feeling of power, but blowing something up isn't always the same as changing it. Ask yourself whether you're addressing the actual issue or reaching for intensity because you're desperate to feel something shift.`,

        `There's also a temptation to confuse **choosing yourself with refusing to compromise**. Boundaries don't require becoming impossible to reach, confidence doesn't require proving you're right, and independence doesn't mean nobody else's feelings matter. Aries at its best knows who she is without needing everybody else to lose for her to win.`,

        `Most importantly, watch where you're trying to become a whole new person overnight. This Full Moon can bring a huge moment of clarity around who you're becoming, but you don't need to perform the transformation immediately. Let the truth land, decide what deserves your energy, then make the move from self-trust rather than adrenaline.`,

        `Your fire is valuable. **Don't waste it proving a point when you could use it to change your f*cking life.**`,
      ],
      shadow: [
        `The shadow of a Full Moon in Aries can come in **HOT**, because suddenly you've got approximately zero patience for anything that feels slow, restrictive, unresolved or beneath the version of you you're becoming. Everything can feel urgent, and you might convince yourself that because you feel something intensely, you need to do something about it right this f*cking second.`,

        `This is **impatience wearing the mask of honesty**. You'd rather send the text, have the confrontation, quit the thing, cut somebody off, make the decision or burn the whole situation down than spend another week wondering where you stand. Sometimes that instinct is showing you a truth you've avoided, but sometimes you're simply desperate for movement because uncertainty feels unbearable.`,

        `Watch where you confuse **urgency with intuition**. Aries moves on instinct, but instinct doesn't always mean immediately, and the loudest feeling in the room doesn't automatically deserve control of your next move. Give yourself enough space to discover whether you're genuinely choosing something or reacting because your ego, independence or identity feels threatened.`,

        `Anger can become LOUD under this Moon too, especially when you've been swallowing what you actually think to keep everything moving. Maybe you're f*cking furious because you've been saying yes when you mean no, doing more than your share, tolerating behaviour you've already outgrown or pretending something doesn't bother you when it absolutely does.`,

        `Your anger isn't automatically the villain here. **It might be the b*tch holding the receipts.**`,

        `Let it show you where your boundaries need work, where resentment has been building, what you're no longer willing to tolerate and which desires you've repeatedly pushed aside because they felt inconvenient, selfish or too much.`,

        `Aries shadow can also become obsessed with **the high of the beginning**. New identity, new plan, new person, new business idea, new routine, new era, LET'S F*CKING GOOOOO, until the initial spark disappears and suddenly you're questioning the entire thing. Pay attention to where you abandon something the second it requires consistency rather than adrenaline, then call it intuition because that sounds better than admitting you've lost interest.`,

        `Hyper-independence can get spicy too. You may find yourself slipping into **f*ck everyone, I'll do it myself**, refusing help, pulling away when you feel vulnerable or treating needing another human being like some embarrassing character defect. Being powerful doesn't require becoming an island, and choosing yourself doesn't require rejecting every person who wants to stand beside you.`,

        `Competition and comparison can hit differently under this Moon because Aries wants to GO. Watching somebody else take the risk, get the opportunity, make the money, launch the thing, speak louder or confidently occupy the space you secretly want can press every button you've got. Before deciding they're irritating as f*ck, ask yourself whether they're showing you something **you want permission to claim too**.`,

        `The biggest Aries shadow is burning valuable energy just to prove you still have fire.`,

        `So before you send it, quit it, delete it, block them, announce your new era or dramatically change your entire life before breakfast, **give the fire somewhere useful to go**. Run, walk fast, dance around your bedroom, lift something heavy, shake your body or blast music and move until the intensity comes down enough for you to hear yourself properly.`,

        `Then write the completely unfiltered version of what you want. Write the message you desperately want to send without sending it, admit the truth you've been avoiding, write down what you're angry about and ask yourself what you'd choose if nobody else's opinion entered the equation.`,

        `Once the adrenaline has left the building, notice what remains.`,

        `**That's the truth worth doing something with.**`,
      ],
    },
  },
  Libra: {
    seed: {
      bringsUp: [
        `A New Moon resets the whole cycle. The sky goes dark, nothing is visible yet and the next twenty nine days effectively start from zero, which makes this the seeding end of the cycle rather than the harvest. What you decide here has the entire month ahead of it to grow, and what you leave undecided has a habit of staying undecided for exactly as long.`,

        `A **New Moon in Libra** turns that energy toward **you and everybody else**. Libra rules partnership, fairness, attraction, diplomacy, beauty, negotiation and the whole space between what you want and what keeps the peace, which makes this Moon a reset on how much of yourself you've been quietly trading to keep things pleasant.`,

        `This Moon can expose where you've been agreeing before you've decided, softening what you actually think so it lands more nicely, waiting to hear what everybody else wants before you dare name your own, or staying in an arrangement that only works because you never mention that it doesn't. Libra doesn't want you endlessly negotiating your way down to something everyone can tolerate, because **fair includes you.**`,

        `You may feel a fresh appetite for something more mutual, more beautiful, more honest or simply more equal. Some of that arrives as clarity about who gets your energy, and some of it arrives as the uncomfortable realisation that you've been the one doing most of the adjusting. Both are useful, and neither of them requires you to stay quiet about it.`,

        `There's a lovely, creative side to this Moon too. Libra is ruled by Venus, so this is also a reset on pleasure, style, taste and what you let yourself find beautiful. Look at where you've already built something genuinely reciprocal, where you've left a dynamic that ran on your silence, or where you've started asking for things that used to feel too much to ask for.`,

        `The energy asks: **What would I choose if being easy to be around wasn't the priority?**`,
      ],
      lookOutFor: [
        `Libra loves options, and a New Moon full of them can keep you weighing forever. You might spend the entire cycle researching, comparing, consulting, drafting the message and rewriting it, then arrive at the next Moon having made no actual decision, which is still a decision and simply lets you avoid owning it.`,

        `Watch the difference between **collaboration and outsourcing**. Asking somebody's opinion is smart, arranging your whole life around whichever answer causes the least friction is not. If you can't name what you want before the conversation starts, you'll end up agreeing to their version and calling it compromise.`,

        `Notice the reflex to make the beginning pretty rather than real. Libra can build a plan that looks beautiful, sounds reasonable and asks nothing difficult of anybody, which is the most elegant way there is to not start. Aesthetics are not a strategy, and a lovely intention that requires nothing from you delivers exactly nothing back.`,

        `Keep an eye on peacekeeping dressed as maturity. Letting something slide once is generosity, letting it slide for two years while the resentment quietly compounds is not, and by the time it comes out it will arrive at three times the size and land on somebody who genuinely didn't know there was a problem.`,

        `There can be a swing in the other direction too, where you've absorbed so much that you skip the conversation altogether and go straight to **cold, fair and finished**. Cutting someone off can feel like a boundary when it's really the version of the conversation that doesn't require you to be disagreed with.`,

        `Comparison gets loud under a Libra Moon, especially around other people's relationships. Somebody else's partnership, ease, taste or apparent effortlessness can make your own feel lacking, but you're comparing your whole messy inside to the outside of theirs, which is never a fair trade and never once made anybody feel better.`,

        `Be careful of confusing being wanted with being chosen. Attention is easy to collect, and Libra can enjoy the collecting, but a cycle spent being admired by people you don't actually want is a cycle you didn't spend on the thing you do want.`,

        `Most importantly, notice where you're waiting for someone to give you permission. Nobody is going to arrive and formally declare that your preference is reasonable. You get to state it, hold it, and let the people around you adjust to a version of you that has one.`,

        `Harmony you build by disappearing isn't harmony. **Peace that requires your silence is just a quieter version of the problem.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Libra is **self-erasure with excellent manners**. It rarely looks like a problem from the outside, because it comes across as easy-going, accommodating, generous and lovely to deal with, and that is exactly why it can run for years without anybody, including you, calling it what it is.`,

        `It starts small. You don't mention the preference because it's not a big deal. You pick the place they'd prefer. You laugh it off. You let the comment go. Each individual instance is genuinely fine, and the accumulation of them is a life arranged around somebody else's comfort.`,

        `Watch where you confuse **being agreeable with being safe**. Somewhere along the line you learned that having a strong preference risks the relationship, so you developed a talent for not having one, and now the fear shows up as indecision that you experience as open-mindedness.`,

        `Indecision is the other face of it. Holding a choice long enough for circumstances to decide it for you feels neutral, and it isn't, it's a way of never being the one responsible for the outcome. If it goes badly you didn't choose it, which is comfortable and also means you're not driving.`,

        `Then there's the ledger. Libra keeps one, quietly and very accurately, of every accommodation made and never mentioned, and because none of it was said out loud the other person has no idea they're in debt. When the bill finally arrives it lands as coldness they can't account for or as a list delivered all at once, and neither is really fair on them.`,

        `Resentment is the tell. If you can feel it, you have been saying yes past your own limit for a while, and the resentment is not a character flaw, **it's the receipt for everything you agreed to and didn't want**.`,

        `Libra shadow can also turn conflict into catastrophe. One difficult conversation gets rehearsed until it feels like a relationship-ending event, which guarantees it keeps getting postponed, and the postponement is what actually erodes the thing you're protecting.`,

        `There's a vanity thread in here too, and it's worth being honest about. Part of the accommodating is wanting to be seen as the reasonable one, the easy one, the one nobody could possibly complain about, and that reputation can cost you more than it ever returns.`,

        `Notice where you're performing balance instead of having it. Looking calm while quietly furious is not equanimity, it's a very well-lit version of avoidance.`,

        `The work starts before any conversation does. Write what you actually want, unconsulted and unsoftened, and keep the page. Libra thinks best in dialogue, which is precisely why the version that exists before the dialogue has to be written down, or it gets negotiated away before you've noticed it's gone.`,

        `Then say one preference out loud this cycle. Not a case, not a justification, not a three-part explanation of why it's reasonable. One sentence, no apology attached, to the person it concerns.`,

        `Watch what happens next, because this is the whole experiment: the relationship survives it. The friendship survives it. The dinner survives it. The fear that stating a preference costs you people is the engine of the entire pattern, and the only thing that dismantles it is evidence.`,

        `And if something genuinely can't survive you having a preference, you've learned something this cycle that was going to cost you a lot more to find out later.`,

        `**Being chosen for the version of you that never wanted anything isn't being chosen.**`,
      ],
    },
  },
  Taurus: {
    peak: {
      bringsUp: [
        `A Full Moon brings things into full view, making it harder to ignore what you want, what you've outgrown and what you're finally ready to do something about. It's a culmination point, so emotions can feel louder, truths can become clearer and situations that have been sitting in the background can suddenly demand your attention.`,

        `A **Full Moon in Taurus** brings it all the way down into **your body, your money and your actual life**. Taurus rules worth, security, comfort, pleasure, stability, self-value, the physical world and what you're willing to build slowly, which makes this Moon a reckoning with what your life feels like rather than how it looks on paper.`,

        `This Moon can expose where you've been calling something stable that's really just familiar, tolerating a situation because leaving it feels expensive, undercharging, over-giving, or staying in an arrangement that drains you because the devil you know is at least the devil you've furnished. Taurus is not interested in your explanation, it wants to know whether this actually feels good in your body, **and your body has been answering that question for months.**`,

        `You may notice money, worth and value arriving as the theme: what you're paid, what you charge, what you spend to feel better, what you've been putting off, what you own and what owns you. Feelings about security can run higher than usual, and so can the very Taurus urge to make everything comfortable immediately rather than let the discomfort finish telling you something.`,

        `There's real pleasure available here too, and that's half the point. Look at what you've built that's genuinely solid, what you've stuck with long after the excitement wore off, where your standards have risen, and where you now refuse to accept things you used to put up with because you thought that was the going rate.`,

        `The energy asks: **What is this actually costing me, and is it still worth the price?**`,
      ],
      lookOutFor: [
        `Taurus doesn't react fast, it accumulates, so the trap under this Moon is sitting on the truth until it hardens. You can feel something for weeks, say nothing, and then discover you've quietly reached a verdict nobody else knew was being reached, which is not the same as a conversation.`,

        `Watch the soothing. Taurus is a genius at making discomfort comfortable, so the feeling arrives and immediately gets fed, spent, poured, scrolled or slept off. None of that is a crime, and all of it will stop the Moon finishing its sentence if you reach for it before you've heard the message.`,

        `Then there's the immovable position. Once Taurus decides how things are, it can defend that position for a year, and under a Full Moon you can make that decision at peak intensity and then treat changing your mind as losing. **Being sure and being right are not the same thing.**`,

        `Keep an eye on money making decisions for you. Staying because leaving is expensive, accepting because asking for more feels risky, tolerating because the security is real, these are all legitimate considerations and they become a cage the moment you stop admitting they're the reason.`,

        `Notice where comfort has quietly become the whole plan. Taurus can build a life so cushioned that growth starts to register as a threat, and this Moon has a way of showing you exactly which comforts you're protecting and what they've been protecting you from doing.`,

        `Be careful with stubbornness disguised as loyalty. Staying is not automatically integrity, and commitment to something that stopped working is not the same as being a person who honours their word. You're allowed to have been right to start it and right to end it.`,

        `Worth is the soft centre of this one, so watch where you've decided your rate, your standards or your needs are what they are because that's what you've been getting. A price you accepted once is not evidence of what you're worth, it's evidence of what you agreed to on a day you had less information.`,

        `Also watch the flip, where the realisation arrives and you overcorrect with a sudden expensive gesture. Buying your way out of a feeling is still the feeling, just with a receipt.`,

        `Slow is Taurus' superpower, so use it. **Let the truth land in your body before you let it write the email.**`,
      ],
      shadow: [
        `The shadow of a Full Moon in Taurus is **comfort defending itself**, and it is unbelievably good at its job, because it never shows up as fear. It shows up as sensible. Not the right time, not the right month, not the right money, not quite yet, and every single one of those sentences is plausible enough to survive inspection.`,

        `Underneath it sits something simple: if you let anything change, you might lose what you built. So the reflex is to hold everything in place, including the parts that are quietly costing you, because dismantling one piece feels like risking the lot.`,

        `That's how a life gets slightly too small. Nothing dramatic happens, you just stop moving, and then you call the not-moving stability and the years do what years do.`,

        `Taurus shadow also numbs. The feeling comes up, and something reaches for the food, the wine, the trolley, the four hours of nothing, the second glass, the thing that makes the edge go away. There is nothing wrong with any of that, and it becomes shadow when it consistently arrives **before** the feeling has had a chance to tell you what it came to say.`,

        `Watch for possessiveness too, because Taurus holds, and holding can turn into gripping. It can be a person, a role, a title, a client, a version of your life you've outgrown. The tighter the grip, the more you find yourself managing the thing instead of enjoying it.`,

        `There's a worth wound in here, and this Moon tends to find it. Somewhere you learned that what you have is what you're worth, or that security is earned by making yourself useful, and that belief has been quietly negotiating on your behalf ever since.`,

        `It shows up as undercharging. As not asking. As accepting the first number. As doing the extra thing for free because charging for it felt greedy. **You are allowed to cost money.**`,

        `It also shows up as the resentment that builds when you've been the reliable one for so long that nobody thinks to ask whether it suits you anymore.`,

        `And watch the stubbornness, because it is the part that will fight this whole section. Taurus can dig in precisely when something true is being said, not because the thing is wrong, but because moving feels worse than being wrong.`,

        `The way through starts in the body, not the analysis. Something physical and slow: a bath, a long walk, hands in soil or dough or water, a proper stretch, an hour with your phone in another room. Taurus shadow dissolves through the senses far faster than through thinking, and the point is to let the sensation move rather than flatten it.`,

        `Then get concrete, because Taurus only believes evidence. Look at the actual numbers, the actual hours, the actual energy going out and coming back. Write down what this situation costs you weekly, in money and in life, and let the arithmetic be as unromantic as it wants to be.`,

        `Then write this sentence and finish it honestly: what I'd change about this if I knew I wouldn't lose my security. Whatever comes out is usually the entire message of the Moon, and the reason it's taken months to surface is that the first half of the sentence is the bit you've been negotiating with.`,

        `Change one thing this week rather than everything. Move the money, send the rate, book the appointment, clear the cupboard, cancel the thing. Taurus builds by increment and keeps what it builds, so one real act now outperforms an enormous plan you'll be too tired to start.`,

        `**Comfortable and alive are not the same thing, and you can tell the difference in your body.**`,
      ],
    },
  },
  Scorpio: {
    seed: {
      bringsUp: [
        `A New Moon resets the whole cycle. The sky goes dark, nothing is visible yet and the next twenty nine days effectively start from zero, which makes this the seeding end of the cycle rather than the harvest. What you decide here has the entire month ahead of it to grow, and what you leave undecided has a habit of staying undecided for exactly as long.`,

        `A **New Moon in Scorpio** turns that energy toward **whatever is underneath**. Scorpio rules intimacy, power, sex, grief, secrets, money that's tangled up with somebody else's, obsession, privacy and transformation, which makes this Moon a reset on the parts of your life you've been managing rather than facing.`,

        `This Moon can expose where you've been holding back the real version of yourself so it can't be used against you, staying in something because the intensity felt like closeness, testing people instead of telling them, keeping a situation slightly unresolved so you never have to find out, or calling it privacy when it's closer to hiding. Scorpio doesn't want the edited version, **it wants the truth you only say at 2am.**`,

        `You may feel a pull to end something properly, go all in on something you've been circling, say the thing you've been sitting on for months, or find out what's actually going on rather than live one more week in the not-knowing. Feelings can arrive at full strength rather than in manageable doses, and something you thought you'd dealt with can resurface asking to be finished for real.`,

        `There's a genuinely powerful side to this Moon. Look at what you've already survived and metabolised, where you've rebuilt yourself after something ended, where you've stopped performing for people who only liked the palatable version, and where you now let somebody close enough to actually see you.`,

        `The energy asks: **What would I begin if I wasn't protecting myself from being seen doing it?**`,
      ],
      lookOutFor: [
        `Scorpio keeps things to itself, so the trap at this New Moon is starting something so privately that it never gets any support. Saying nothing until it's done feels safe and looks strong, and it also leaves you alone with the exact thing that needed one other person in it.`,

        `Watch strategy replacing action. You can spend a whole cycle reading the situation, gathering information, working out everybody's motives and positioning yourself perfectly, and never once do the plain obvious thing that would have moved it forward in a week.`,

        `Notice the testing. Scorpio would often rather set a quiet test and watch how somebody handles it than ask a direct question, and the problem with tests is that people fail them without ever knowing they were sitting one.`,

        `Keep an eye on suspicion doing the driving. Under this Moon it's easy to read motive into ordinary behaviour, build a case out of three small things, and reach a conclusion about somebody that they've had no opportunity to answer.`,

        `There's a checking impulse here too, the looking, the scrolling, the finding out. It always promises relief and it never delivers it, because the thing you actually want is certainty and no amount of information will hand you that.`,

        `Be careful with all-or-nothing. Scorpio does depth brilliantly and moderation badly, so a new beginning can arrive as total commitment before you've established whether the thing deserves it, and the same energy can end something entirely at the first sign it might disappoint you.`,

        `Watch where intensity is standing in for intimacy. Drama, secrecy, jealousy and the constant hum of a situation that never quite resolves can feel like closeness, and closeness is actually much quieter than that.`,

        `Power struggles are the other tell. If you find yourself needing to win a conversation, hold something back to stay in control, or make somebody feel the loss of you, you've stopped wanting the outcome and started wanting the upper hand.`,

        `**Control is what you reach for when you don't believe you'd survive being let down. You would. You have.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Scorpio is **control dressed up as caution**, and it is very persuasive, because most of it is genuinely smart. Keeping your cards close. Not announcing it yet. Seeing how they behave first. Every one of those is reasonable, and together they build a beginning so guarded that nothing can reach it, including luck.`,

        `Underneath sits a fear with receipts: at some point being open cost you something, and you decided, quite sensibly at the time, never to be caught that unprotected again.`,

        `So the reflex became managing information. What you tell, who you tell, how much, in what order, and what you keep back so you're never the one holding less power in the room.`,

        `It shows up as the private plan nobody knows about, so nobody can ask how it's going. As the feeling you've had for six weeks and never mentioned. As the decision you've already made while the other person still thinks it's a conversation.`,

        `Scorpio shadow also keeps a ledger, and unlike Libra's it isn't polite about it. Every slight, every disappointment, every time somebody showed you who they were gets filed with the date, and the file is admissible years later.`,

        `Withdrawal becomes the weapon. Not a fight, not an explanation, just the temperature dropping and the access quietly closing, which is an extremely effective way to make somebody feel the loss of you and an extremely ineffective way to be known.`,

        `And there's the sting. Scorpio usually knows the one accurate sentence that would genuinely wound somebody, and under pressure the temptation to use it is real. Accuracy is not the same as fairness, and you can't take it back once it's out.`,

        `Watch obsession too, because it's the same instinct pointed at a loop. The replaying, the analysing, the reconstructing of what they meant, the imagined conversation you keep having in the shower. It feels like processing and it's usually just pain going round.`,

        `The deepest layer is the vow. Somewhere you promised yourself you'd never need anyone that much again, and the promise has been quietly declining things on your behalf ever since.`,

        `The way through is being witnessed on purpose, before it feels safe. Tell one trusted person the real thing you're starting, at the stage where it could still fail. Scorpio's shadow loses most of its power the moment something hidden is seen and nothing bad happens.`,

        `Then write the unedited version. Everything you actually feel, no management, no strategy, nobody's eyes on it. Get it out of the loop and onto a page, because what stays inside your head gets rehearsed and what gets written down gets finished.`,

        `Name the fear directly: what you think would happen if you lost control of this. Written down it tends to look smaller and older than it feels, and it stops running the operation from underneath.`,

        `Then pick one thing to do openly this cycle. Say the want out loud. Ask the actual question. Let somebody help with the part you'd normally handle alone. One act of not hiding is worth a month of strategy.`,

        `**You do not have to keep proving you can survive alone. You already did that. This cycle is for something else.**`,
      ],
    },
  },
  Gemini: {
    peak: {
      bringsUp: [
        `A Full Moon brings things into full view, making it harder to ignore what you want, what you've outgrown and what you're finally ready to do something about. It's a culmination point, so emotions can feel louder, truths can become clearer and situations that have been sitting in the background can suddenly demand your attention.`,

        `A **Full Moon in Gemini** brings it to a head **through words**. Gemini rules communication, curiosity, information, the daily back and forth, siblings and neighbours, what gets said, what gets left out and the story you've been telling yourself, which makes this Moon a reckoning with what's actually true versus what you've been explaining.`,

        `This Moon can expose the thing that's been managed by not being said. A conversation you've avoided, a message you've reread and never sent, a version of events you've been repeating until it started to sound true, or a situation you've been handling by staying vague about it. Gemini brings the information out, and it often arrives through somebody else's mouth rather than your own.`,

        `You may notice everything speeding up: more messages, more input, more opinions, more noise in your own head at midnight. Something you find out this week can genuinely rearrange the picture, and something you finally say out loud can do the same thing in the other direction.`,

        `There's real brightness to this Moon too. Look at how much better you've got at saying the hard thing, at asking instead of assuming, at changing your mind in public when new information arrives, and at being curious about people rather than certain about them.`,

        `The energy asks: **What have I been avoiding saying plainly?**`,
      ],
      lookOutFor: [
        `Gemini moves fast and talks faster, so the trap under this Moon is saying all of it at once, at speed, to whoever happens to be nearest. You can talk yourself into three separate certainties before lunch and send messages from at least two of them.`,

        `Watch the urge to explain until you're agreed with. Repeating your position more thoroughly is not the same as being heard, and a conversation where you're building a case has usually stopped being a conversation.`,

        `Notice where the mind is being used as an escape hatch. When the feeling gets big, Gemini goes up into analysis, jokes, research and other people's takes, and you can end up knowing absolutely everything about a situation while feeling almost none of it.`,

        `Be careful with the half-truth. Gemini is brilliant at the version that keeps things comfortable, slightly edited, technically accurate, missing the one sentence that actually matters. **The edit is the thing to watch, not the lie.**`,

        `Keep an eye on overthinking dressed as due diligence. Another opinion, another article, another friend consulted, and by the end you've collected so many perspectives that your own is nowhere to be found.`,

        `Gossip gets tempting under this Moon, and so does telling the story to everybody except the person it concerns. It's a very effective way of discharging the feeling without ever risking the conversation.`,

        `Watch the restlessness too. When things feel stuck, Gemini reaches for novelty, and a new idea can arrive at exactly the moment the current one asks for follow-through, which conveniently relieves you of having to finish anything.`,

        `Also notice how quickly you move on. Something lands, you process it out loud for an hour, you crack a joke about it, and it's filed. Processed is not the same as felt, and this Moon will bring it back if you file it too early.`,

        `**Say one true sentence to the right person and you'll do more with this Moon than a week of talking to everybody else.**`,
      ],
      shadow: [
        `The shadow of a Full Moon in Gemini is **thinking used as a way not to feel**. It's fast, it's articulate, it can explain the entire situation including its own defence mechanisms, and it will keep you two safe inches above the actual emotion for as long as you let it.`,

        `You'll recognise it by how well you're narrating. When you can describe exactly what's happening, in a slightly amused register, while noticing nothing in your body, that's not insight, that's altitude.`,

        `Distraction is the second layer. The mind offers something more interesting the moment the current thing requires depth, and Gemini reads that as curiosity rather than as avoidance with excellent PR.`,

        `It shows up as five tabs, four conversations, three plans and nothing finished. Enough going on that nothing can be measured, which means nothing can be failed either.`,

        `Watch the story you've built. Gemini's real power is narrative, and under a Full Moon you can construct a version of events so coherent and well-argued that you never notice it's a draft rather than the truth.`,

        `Especially watch the version where you're the reasonable one. It's the most comfortable story available and it's rarely the complete one.`,

        `There's anxiety in here too, and it's the same engine pointed the wrong way. The looping, the rehearsing, the imagined conversations at 3am, the twelve possible outcomes considered in detail. Your mind is trying to think its way to safety, and it cannot get there, because the thing you want is certainty and thinking doesn't produce it.`,

        `Notice where you talk to everyone but the person concerned. It gives you the relief of having said it without any of the risk of having said it to them, and it quietly ensures nothing changes.`,

        `And notice the joke. Gemini can deflect anything with timing, and the funnier you are about something, the more likely it is you haven't touched it yet.`,

        `The way through is to put the words somewhere that can't answer back. Write the whole thing out, unedited, ugly, longer than it needs to be, before any of it reaches a person. Gemini thinks by expressing, and the first version is almost never the true one, so let the page take the first three.`,

        `Then read it back and find the one sentence you've been circling. It'll be the one you wrote quickly and want to soften. That's the message.`,

        `Then stop researching. No more opinions, no more tabs, no more asking one more friend. You already have the information. What you don't have is the willingness to act on it while it's still uncomfortable.`,

        `Then say the sentence, once, plainly, to the one person it actually concerns, and let the silence afterwards be silence rather than filling it with six clarifying paragraphs.`,

        `**You are not confused. You are informed and avoiding it, and those two things feel almost identical from the inside.**`,
      ],
    },
  },
  Sagittarius: {
    seed: {
      bringsUp: [
        `A New Moon resets the whole cycle. The sky goes dark, nothing is visible yet and the next twenty nine days effectively start from zero, which makes this the seeding end of the cycle rather than the harvest. What you decide here has the entire month ahead of it to grow, and what you leave undecided has a habit of staying undecided for exactly as long.`,

        `A **New Moon in Sagittarius** turns that energy toward **the horizon**. Sagittarius rules belief, meaning, travel, study, risk, faith, publishing, adventure and the size of the life you think you're allowed, which makes this Moon a reset on how big you're willing to let things get.`,

        `This Moon can expose where your life has quietly shrunk to fit your schedule, where you've been calling something realistic when it's really just small, where you stopped believing in the bigger version because disappointment was expensive last time, or where you've been waiting until you're more qualified, more ready, more sure. Sagittarius is not interested in your credentials, **it wants to know what you'd go after if you believed it could work.**`,

        `You may feel restless, itchy, ready to book something, start something, learn something or leave something. Meaning becomes the question: not just whether this works, but whether it's worth your one life, which is a much more inconvenient question and a far better one.`,

        `There's a genuinely expansive side to this Moon. Look at how far your world has already stretched, the risks that paid off, the things you believed in before there was evidence, and the places where you've replaced somebody else's rulebook with your own.`,

        `The energy asks: **What would I go for if I stopped waiting to be qualified?**`,
      ],
      lookOutFor: [
        `Sagittarius overshoots. The plan arrives at maximum scale, immediately, and completely without the boring middle section that would make it possible, so the trap this cycle is mistaking the size of the vision for progress on it.`,

        `Watch the escape route. A fresh start somewhere else is sometimes real expansion and sometimes just leaving, and the two feel identical in week one. The difference shows up in what you're running toward versus what you'd rather not finish.`,

        `Notice the certainty. Under this Moon a belief can feel so obviously true that you stop checking it against what's in front of you, and Sagittarius holds convictions much more confidently than the evidence usually supports.`,

        `Keep an eye on the tact. The truth feels so clear that it seems unkind not to say it, at volume, immediately, and you can be completely right in a way that costs you the person you were being right at.`,

        `Be careful with the next thing as an anaesthetic. There's always a bigger idea available, and its arrival conveniently relieves you of finishing the current one, which is how ten exciting beginnings turn into nothing you can point at.`,

        `Watch overcommitting. Sagittarius says yes generously, to the trip, the project, the favour, the plan, and then spends the next month resenting a calendar it built itself.`,

        `There's a restlessness that reads as intuition too. Feeling trapped is information, and it's not automatically instruction, because sometimes the thing asking for endurance is the thing that was going to work.`,

        `And watch the preaching. When conviction gets loud it usually means it's being used to avoid a feeling, and the volume is doing a job the belief can't do on its own.`,

        `**Book the thing, then build the middle. Vision without logistics is just a nice evening.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Sagittarius is **restlessness that calls itself freedom**, and it's the most charming shadow in the zodiac, because it always arrives dressed as growth.`,

        `It works like this: something gets difficult, or ordinary, or requires you to stay when staying isn't fun, and a bigger, brighter, more meaningful option appears right on cue. You follow it, honestly believing you're expanding, and you leave the unfinished thing behind you without ever calling it that.`,

        `Over time you end up with a very interesting life and a trail of things that almost happened.`,

        `Watch where you use philosophy to get out of specifics. Sagittarius can reframe anything into a lesson, a season, a chapter, a sign, and a beautiful reframe can quietly excuse you from a conversation you owed somebody.`,

        `There's avoidance in the optimism too. Deciding it'll all work out is sometimes faith and sometimes a way of not looking at the numbers, the timeline or the thing you already know isn't working.`,

        `Notice the promises. Sagittarius means every word when it says yes, and means it slightly less by Thursday, and the gap between those two moments is where other people learn what your word is worth.`,

        `Watch the certainty again, because it's the sharpest edge here. Believing something strongly can feel indistinguishable from knowing it, and this sign will build a whole life on a conviction it never stress-tested.`,

        `And watch the boredom, which is the engine underneath all of it. Boredom gets treated as evidence that something is wrong, when very often it's just the part where the novelty ended and the actual work began.`,

        `There's a loneliness under the freedom too, and it doesn't get talked about much. Keeping every option open means never being fully in anything, and eventually that costs more than it protects.`,

        `The way through starts by making it real this week. A date, a deposit, a booking, a person told. Sagittarius commits out loud, so put something in the world that would be embarrassing to quietly abandon.`,

        `Then write down what you're leaving unfinished, honestly, and decide whether this beginning is expansion or exit. Both are allowed. They need completely different plans, and only one of them requires you to go back and close something first.`,

        `Then test the belief you're building on. Write the sentence you're treating as fact, write what would have to be true for it to be wrong, and go and find out which one the evidence supports before you bet the year on it.`,

        `Then give the restlessness somewhere physical to go, because it will not be reasoned with. Distance, movement, a day somewhere else, a proper change of scene. Let the body have the freedom so the urge to leave doesn't get to make the decision for you.`,

        `**Wanting more is not the problem. Leaving every time it gets ordinary is what keeps the more out of reach.**`,
      ],
    },
  },
};

/** The whole section, opener included, for the moon page. Null when this sign is not written yet. */
export function longSection(
  sign: string,
  phase: LunationPhase | null,
  section: keyof LongSection,
): string | null {
  if (!phase) return null;
  const paragraphs = LUNATION_LONG[sign]?.[phase]?.[section];
  return paragraphs && paragraphs.length ? paragraphs.join("\n\n") : null;
}

/** The same section without its phase opener, for readings that open with their own framing. */
export function longSectionBody(
  sign: string,
  phase: LunationPhase | null,
  section: keyof LongSection,
): string | null {
  if (!phase) return null;
  const paragraphs = LUNATION_LONG[sign]?.[phase]?.[section];
  return paragraphs && paragraphs.length > 1 ? paragraphs.slice(1).join("\n\n") : null;
}
