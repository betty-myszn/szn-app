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
        `A New Moon is the reset. The Sun and Moon meet in the same degree, the sky goes properly dark, and the next twenty nine days start from scratch, which makes this the planting end of the cycle. Nothing is visible yet, and whatever you decide now gets the whole month to grow into something, while whatever you leave hovering tends to still be hovering when the next one comes round.`,

        `A **New Moon in Libra** aims all of that at **other people, and specifically at your side of the arrangement**. Libra is cardinal air ruled by Venus, the sign of partnership, fairness, attraction, taste and negotiation, and it governs the invisible space between what you actually want and what keeps everybody else comfortable.`,

        `You know the energy. Agreeing to the restaurant you didn't want, saying you don't mind twice in one conversation while minding enormously, rewriting a text four times so it lands nicely, keeping a friendship on life support out of sheer politeness months after it stopped being funnnn. A Libra New Moon has a habit of showing you the running total.`,

        `Because Venus is running this one, it also resets taste, pleasure and standards, which is far more useful than it sounds. What you'll accept, what you want your life to look and feel like, who gets your Sunday. Libra initiates, and what it likes starting is a more mutual version of whatever you've been half-carrying.`,

        `Somewhere in the past year you've already done a small version of this: left a dynamic that ran on your silence, asked for something you'd normally hint at, let somebody be mildly disappointed in you and lived. That's the direction this Moon wants more of, with less negotiating on the way.`,

        `The energy asks: **What would I pick if being easy to be around wasn't the whole personality?**`,
      ],
      lookOutFor: [
        `Libra's favourite way to avoid a decision is to keep researching it. You'll compare, consult, sleep on it, ask three friends, draft the message, rewrite the message, and arrive at the next New Moon having chosen nothing, which is still a choice and simply means the circumstances made it for you.`,

        `Collaborating and outsourcing look alarmingly similar from the inside. Asking somebody's opinion is smart; arranging your whole cycle around whichever answer causes the least friction means you've handed the pen over and called it teamwork.`,

        `The prettier the plan, the more suspicious I'd be of it. Libra can build something that looks gorgeous, sounds reasonable and asks nothing difficult of anybody, which is the most elegant procrastination on the market.`,

        `Peacekeeping gets expensive. Letting something slide once is generous. Letting it slide for two years while the tally quietly compounds means it eventually arrives at somebody who had no idea there was a problem, at roughly triple the volume, on a random Tuesday.`,

        `The opposite swing is just as Libra: skipping the conversation entirely and going straight to cold, fair and finished. Cutting somebody off can feel deliciously boundaried while functioning as the version of the discussion where nobody gets to disagree with you.`,

        `Comparison hits differently under this Moon, particularly around other people's relationships. Their ease, their partner, their apparent effortlessness, all measured against your own inside knowledge of your own. That maths has never once made anybody feel better.`,

        `Being wanted is easy to collect, and Libra does enjoy collecting it. A cycle spent being admired by people you don't actually want is a cycle you didn't spend on the person or project you do.`,

        `Nobody is turning up to officially confirm that your preference is allowed, by the way. There's no committee. You state it, you hold it, everybody adjusts.`,

        `**Peace that runs on your silence is a quieter version of the same problem.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Libra is **self-erasure with immaculate manners**, and it's sneaky as hell, because from the outside it reads as easy-going, generous and lovely to deal with.`,

        `It builds in tiny increments. You don't mention the preference because it genuinely isn't a big deal. You pick the option they'd prefer. You laugh off the comment. Each one is fine on its own, and two hundred of them is a life arranged entirely around somebody else's comfort.`,

        `Somewhere early on you worked out that having a strong preference put the relationship at risk, so you got verrrry good at not having one, and these days that skill introduces itself as being open-minded.`,

        `Indecision is the same fear in a different outfit. Hold a choice long enough and circumstances decide it for you, which feels neutral and conveniently means the outcome was never yours to own.`,

        `Libra also keeps a ledger, and it is scarily accurate. Every accommodation made and never mentioned goes in with a date, and because none of it was said out loud, the other person has been running up a debt they don't know exists.`,

        `When the bill finally lands, it arrives as a coldness they can't account for or as an entire list delivered in one breath. Neither is especially fair on somebody who was never told there was an account open.`,

        `Resentment is the tell here, and it's worth reading as data. Feel it, and you've been saying yes past your own limit for a good while.`,

        `One difficult conversation gets rehearsed in the shower until it has grown into a relationship-ending event, which guarantees it stays postponed, and the postponing is what actually erodes the thing you were trying to protect.`,

        `There's some vanity threaded through it too, and honesty helps. Part of the accommodating is wanting to be known as the reasonable one, the easy one, the one nobody could possibly complain about. That reputation costs considerably more than it pays.`,

        `Looking calm while quietly furious is avoidance with excellent lighting.`,

        `The way through starts before anybody else is in the room. Write what you want, unconsulted and unsoftened, and keep the page. Libra thinks best in dialogue, which is exactly why the pre-dialogue version has to exist somewhere in writing, or it gets negotiated away before you notice it's gone.`,

        `Then say one preference out loud this cycle. No case, no three-part justification, no charming preamble. One sentence, no apology stapled to the end of it, to the person it actually concerns.`,

        `Then watch what happens, because that's the whole experiment: the dinner survives, the friendship survives, the relationship survives. The belief that wanting something costs you people is the engine of all of this, and evidence is the only thing that dismantles an old belief.`,

        `And if something genuinely can't survive you having a preference, this Moon has handed you information that was going to get a lot more expensive to find out in two years' time.`,

        `**You can be adored and inconvenient at the same time. People do it constantly.**`,
      ],
    },
  },
  Taurus: {
    peak: {
      bringsUp: [
        `A Full Moon brings things into full view, making it harder to ignore what you want, what you've outgrown and what you're finally ready to do something about. It's a culmination point, so emotions can feel louder, truths can become clearer and situations that have been sitting in the background can suddenly demand your attention.`,

        `A **Full Moon in Taurus** brings all of that down into **your body, your bank account and the actual texture of your days**. Fixed earth, ruled by Venus, Taurus governs worth, security, pleasure, ownership and whatever you're willing to build slowly, so this Moon wants to know what your life genuinely feels like rather than how it photographs.`,

        `This is where you discover that the thing you've been calling stable is mostly just familiar. The rate you haven't raised in three years. The subscription you're weirdly loyal to. The arrangement you stay inside because leaving would be expensive, and expensive has been doing a LOT of heavy lifting in that sentence.`,

        `Taurus runs on the senses, so the information usually arrives physically before it arrives in words: the jaw, the shoulders, the specific sigh that happens when a certain name comes up. Your body has been filing reports for months, and a Full Moon here is roughly when one lands on your desk with the volume turned up.`,

        `Pleasure is half the point of this sign, which is why it's such a good Moon to work with. Taurus wants you fed, rested, warm, touched and paid properly, and it has excellent taste in all five. Anywhere you've raised your standards this year, it wants to know why you haven't done it everywhere else.`,

        `The energy asks: **What is this costing me, and am I still getting my money's worth?**`,
      ],
      lookOutFor: [
        `Taurus doesn't react, it accumulates. You can feel something for six weeks, say nothing at all, and quietly arrive at a verdict nobody else knew was being reached, which is a very tidy way to end something without ever holding the conversation.`,

        `Soothing is the big one. The feeling comes up and gets fed, poured, scrolled or slept off within about nine minutes. None of that is a crime, and all of it will stop this Moon finishing its sentence if you reach for it before you've heard the message.`,

        `Once Taurus has decided how things are, moving becomes personally offensive. Making that decision at peak intensity and then defending it for a year, because changing your mind feels like losing, is verrrry on brand for this Moon.`,

        `Money makes a lot of decisions quietly. Staying because leaving costs, accepting because asking feels risky, tolerating because the security is genuinely real. All legitimate, all a cage the moment you stop admitting they're the reason.`,

        `Comfort can become the entire strategy. Build a life cushioned enough and growth starts registering as a threat, which is why this Moon is so good at showing you exactly which comforts you've been guarding and what they've been guarding you from doing.`,

        `Loyalty and stubbornness look identical from where you're sitting. You're allowed to have been right to start something and right to finish it, and the second one doesn't cancel the first.`,

        `Worth is the soft centre of this one. A price you accepted once is evidence of what you agreed to on a day when you had less information and fewer options, which this Moon will demonstrate at some length.`,

        `The overcorrection is its own trap: the realisation lands, and forty minutes later there's a full basket at checkout. Buying your way out of a feeling is still the feeling, now with delivery tracking.`,

        `**Let it land in your body before you let it write the email.**`,
      ],
      shadow: [
        `The shadow of a Full Moon in Taurus is **comfort defending itself**, and it's world-class at the job, because it never once shows up as fear. It shows up as sensible. Not the right month, not the right money, not quite yet, and every single one of those sentences survives inspection.`,

        `Underneath sits something simple: if anything moves, you might lose what you built. So the whole arrangement gets held in place, including the parts that are quietly costing you, because dismantling one bit feels like gambling the lot.`,

        `That's how a life gets slightly too small with nothing dramatic ever happening. Movement stops, the stillness gets called stability, and the years do what years do.`,

        `The numbing deserves a proper look, since Taurus rules the senses and knows exactly which one to reach for. Nothing wrong with the wine, the delivery, the four hours of nothing. It turns shadow when it consistently arrives **before** the feeling has had a chance to say what it came to say.`,

        `Holding can also slide into gripping: the role, the client, the person, the version of your life you technically outgrew in March. The tighter the grip, the more you find yourself managing something rather than enjoying it.`,

        `There's a worth wound in here, and this Moon locates it every time. At some point you learned that what you have is what you're worth, or that security gets earned by being useful, and that belief has been negotiating on your behalf ever since without checking in.`,

        `It shows up as undercharging, as the extra thing thrown in free because invoicing for it felt greedy, as accepting the first number offered, as a favour that quietly became a job. **You are allowed to cost money.**`,

        `Then comes the resentment of having been the reliable one for so long that nobody thinks to ask whether it still suits you.`,

        `Stubbornness is the part that will argue with this entire section, and not because any of it is wrong. Moving simply feels worse than being wrong.`,

        `The way out runs through the body rather than the analysis. A bath, a long walk, hands in dough or soil or hot water, an hour with your phone in a different room. Taurus shadow dissolves through the senses and shrugs off a spreadsheet entirely.`,

        `Then get concrete, because this sign only believes evidence. Real numbers, real hours, real energy going out against what comes back. Write down what this situation costs you weekly, in money and in life, and let the maths be as unromantic as it likes.`,

        `Then finish this sentence honestly: what I'd change about this if I knew I wouldn't lose my security. Whatever falls out is the message, and the reason it's taken months to surface is that the second half is the part you've been quietly negotiating with.`,

        `Change one thing this week rather than all of it. Move the money, send the new rate, cancel the thing, clear the cupboard, book the appointment you've rescheduled twice. Taurus builds by increment and keeps what it builds, so one real act beats a magnificent plan you'll be too tired to start.`,

        `**Your body has been saying this for months. The Moon just turned the volume up.**`,
      ],
    },
  },
  Scorpio: {
    seed: {
      bringsUp: [
        `A New Moon is the reset. The Sun and Moon meet in the same degree, the sky goes properly dark, and the next twenty nine days start from scratch, which makes this the planting end of the cycle. Nothing is visible yet, and whatever you decide now gets the whole month to grow into something, while whatever you leave hovering tends to still be hovering when the next one comes round.`,

        `A **New Moon in Scorpio** points the reset at **everything happening underneath**. Fixed water, traditionally ruled by Mars and modernly by Pluto, Scorpio governs intimacy, power, sex, grief, secrets, other people's money and the whole machinery of transformation, which makes this the least small-talk Moon of the entire year.`,

        `The energy runs deeeep and is unsubtle about it. Whatever you've been managing rather than facing starts pressing on the glass: the conversation you've been rehearsing for eight months, the account you haven't looked at properly, the dynamic where you hold all the information so nobody can surprise you, the situation you've kept slightly unresolved so you never have to find out where you stand.`,

        `Scorpio doesn't begin things the way Aries does, all sparks and sprinting. It starts by ending something, so the seed planted here is usually a decision to stop pretending about one specific situation, and the month that follows is what grows in the space that clears.`,

        `The genuine gift of this sign is that very little shocks it. You've already metabolised things that would have flattened somebody with a gentler chart, rebuilt yourself after endings you didn't choose, and worked out that being liked by everybody was never on the cards anyway.`,

        `The energy asks: **What would I start if I wasn't protecting myself from being seen doing it?**`,
      ],
      lookOutFor: [
        `Scorpio keeps its cards face down, so the classic misfire at this Moon is starting something so privately that it never gets any help. Saying nothing until it's finished feels powerful and looks impressive, and it leaves you alone with the exact thing that needed one other person in the room.`,

        `Strategy can quietly replace action. A whole cycle disappears into reading the situation, working out everybody's motives and positioning yourself immaculately, while the plain obvious move that would have shifted it in a week sits there untouched.`,

        `Testing is the other one. Scorpio would often rather set a quiet exam and observe how somebody handles it than ask a direct question, which means people fail tests they never knew they were sitting.`,

        `Suspicion gets very convincing under this Moon. Three small things become a case, a slow reply becomes a verdict, and somebody ends up convicted in a trial they weren't invited to.`,

        `The checking impulse promises relief and never delivers it. What you actually want is certainty, and no amount of scrolling, searching or rereading has ever produced that for anyone.`,

        `Moderation is not this sign's strength. A beginning can arrive as total commitment before you've established whether the thing deserves it, and the same energy will end it entirely at the first hint of disappointment.`,

        `Intensity does a very good impression of intimacy. Drama, secrecy, jealousy and a situation that never quite resolves can feel like closeness, when real closeness is embarrassingly quiet by comparison.`,

        `Power struggles are the clearest tell. Needing to win the conversation, holding something back to stay in control, wanting them to feel the loss of you, all of it means you've swapped the outcome you wanted for the upper hand.`,

        `**Control is what you reach for when you don't believe you'd survive being let down. You have, repeatedly, and you're still here.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Scorpio is **control dressed up as caution**, and it's persuasive because most of it is genuinely clever. Keep your cards close. Don't announce it yet. See how they behave first. Individually reasonable, collectively a beginning so guarded that nothing can reach it, including luck.`,

        `Underneath sits a fear with receipts. At some point being open cost you something, and you decided, very sensibly at the time, never to be caught that unprotected again.`,

        `So the reflex became information management. What you tell, who you tell, how much, in what order, and what you keep back so you're never the one holding less power in the room.`,

        `It looks like the plan nobody knows about, so nobody can ask how it's going. The feeling you've had for six weeks and never mentioned. The decision you made privately while the other person still thought a conversation was happening.`,

        `Scorpio's ledger is nothing like Libra's polite one. Every slight, every disappointment, every moment somebody showed you who they were gets filed with the date, and the file remains admissible four years later.`,

        `Withdrawal becomes the weapon of choice. No fight, no explanation, just the temperature dropping and the access quietly closing, which is an extremely effective way to make somebody feel your absence and an extremely poor way to be known.`,

        `Then there's the sting. You usually know the one sentence that would genuinely wound a person, and under pressure the temptation to use it is real. Accuracy and fairness are different sports, and that one can't be taken back.`,

        `Obsession is the same instinct pointed at a loop: the replaying, the reconstructing of what they meant, the imagined confrontation you keep staging in the shower. It feels like processing while functioning as pain on a spin cycle.`,

        `The deepest layer is the vow. Somewhere you promised yourself you'd never need anybody that much again, and it has been quietly declining things on your behalf ever since.`,

        `Getting through it means being witnessed on purpose, before it feels safe. Tell one trusted person the real thing you're starting while it could still fail. Scorpio's shadow loses most of its power the moment something hidden gets seen and nothing terrible happens.`,

        `Write the unedited version somewhere nobody will read it. Everything you actually feel, no management, no strategy, no audience. What stays in your head gets rehearsed; what gets written down gets finished.`,

        `Name the fear directly, in one sentence: what you think would happen if you lost control of this. On paper it usually looks smaller and considerably older than it feels in your chest, and naming it stops it running the operation from underneath.`,

        `Then do one thing openly this cycle. Ask the actual question, say the want out loud, let somebody help with the part you'd normally handle alone. A single act of not hiding outperforms a month of brilliant strategy.`,

        `**You've already proved you can survive on your own. This cycle is for finding out what happens when you don't have to.**`,
      ],
    },
  },
  Gemini: {
    peak: {
      bringsUp: [
        `A Full Moon brings things into full view, making it harder to ignore what you want, what you've outgrown and what you're finally ready to do something about. It's a culmination point, so emotions can feel louder, truths can become clearer and situations that have been sitting in the background can suddenly demand your attention.`,

        `A **Full Moon in Gemini** brings it to a head **through words**. Mutable air ruled by Mercury, Gemini governs communication, curiosity, information, siblings, neighbours, the daily back and forth and the story you've been telling yourself, so this Moon is where the talking finally catches up with the truth.`,

        `What surfaces is usually the thing that was being managed by not being said. The message you've drafted and never sent, the conversation everybody's avoiding, the vague answer you've been giving for months, the version of events you've repeated so often it started to sound like fact. Information has a way of arriving this week, frequently through somebody else's mouth.`,

        `Everything speeds up too: more notifications, more opinions, more input, more thoughts at 1am, and a brain that will not shut up about a thirty second exchange from Tuesday. Something you find out can genuinely rearrange the picture, and something you finally say can do exactly the same in the other direction.`,

        `Gemini's brilliance is real, though, and it's worth clocking. You've got much better at asking instead of assuming, changing your mind in public when new information turns up, and saying the awkward sentence at the moment it needed saying rather than three weeks later.`,

        `The energy asks: **What have I been avoiding saying plainly?**`,
      ],
      lookOutFor: [
        `Gemini talks fast and this Moon talks faster, so the trap is saying all of it at once to whoever happens to be nearest. You can arrive at three separate certainties before lunch and send messages from at least two of them.`,

        `Explaining until you're agreed with is the other one. Restating your position more thoroughly never turns into being understood, and once you're building a case, the conversation stopped being a conversation a while ago.`,

        `The mind makes an excellent escape hatch. When the feeling gets big, Gemini goes up into analysis, jokes, research and other people's takes, which means you can know absolutely everything about a situation while feeling none of it.`,

        `Half-truths are the real hazard here, and they're rarely lies. Technically accurate, slightly edited, missing the one sentence that matters. The edit is the thing worth catching.`,

        `Research can pass as due diligence for weeks. Another article, another opinion, another friend consulted, and by the end there are so many perspectives in the room that yours has quietly left.`,

        `Telling everybody except the person concerned is very Gemini and very tempting under this Moon. It discharges the feeling without any of the risk, and guarantees nothing changes.`,

        `Novelty turns up at suspiciously convenient moments too. A new idea arrives exactly when the current one starts asking for follow-through, and it feels like inspiration rather than an exit.`,

        `Speed of processing is its own problem. Something lands, you talk it through for an hour, you make it funny, it's filed. Filed and felt are two different things, and this Moon will bring it back if you file too fast.`,

        `**One true sentence to the right person will do more this week than nine hours of talking to everybody else.**`,
      ],
      shadow: [
        `The shadow of a Full Moon in Gemini is **thinking used as a way not to feel**. It's fast, it's articulate, it can explain the entire situation including its own defence mechanisms, and it will keep you two safe inches above the actual emotion for as long as you allow it.`,

        `You'll recognise it by how well you're narrating. Describing exactly what's happening, in a slightly amused tone, while noticing nothing whatsoever in your body, is altitude rather than insight.`,

        `Distraction arrives next, right on cue. The mind offers something more interesting the second the current thing requires depth, and Gemini files that as curiosity instead of avoidance with excellent PR.`,

        `The result is five tabs, four conversations, three plans and nothing finished. Enough in the air that nothing can be measured, which conveniently means nothing can be failed either.`,

        `Story is this sign's real superpower, and under a Full Moon it can build a version of events so coherent and well-argued that you never think to check whether it's true. The most comfortable draft is usually the one where you're the reasonable party.`,

        `Anxiety is the same engine pointed backwards: the looping, the rehearsing, the imagined conversations at 3am, twelve possible outcomes considered in forensic detail. Your mind is trying to think its way to safety, and safety was never available that way.`,

        `Deflection through humour deserves a mention, because you're good at it. The funnier you are about something, the higher the chance you haven't touched it yet.`,

        `Then there's the exhaustion nobody warns you about, where the brain has been at full volume for days and you mistake mental noise for actually dealing with something.`,

        `Getting through it starts by putting the words somewhere that can't answer back. Write the whole thing out, unedited and far too long, before any of it reaches a human. Gemini thinks by expressing, so let the page take the first three versions.`,

        `Read it back and find the sentence you wrote quickly and immediately wanted to soften. That's the message. It always is.`,

        `Stop researching after that. No more opinions, no more tabs, no more asking one last friend. The information isn't what's missing, the willingness to act while it's still uncomfortable is.`,

        `Say it once, plainly, to the one person it concerns, and then leave the silence alone instead of filling it with six clarifying paragraphs and a voice note.`,

        `Give the nervous system somewhere to go as well, because Gemini rules the hands, lungs and everything jittery. Walk, swim, sing badly in the car, breathe on purpose for four minutes. The body settles the mind far quicker than the mind settles the mind.`,

        `**You're not confused, you're informed and avoiding it, and those two states feel identical from the inside.**`,
      ],
    },
  },
  Sagittarius: {
    seed: {
      bringsUp: [
        `A New Moon is the reset. The Sun and Moon meet in the same degree, the sky goes properly dark, and the next twenty nine days start from scratch, which makes this the planting end of the cycle. Nothing is visible yet, and whatever you decide now gets the whole month to grow into something, while whatever you leave hovering tends to still be hovering when the next one comes round.`,

        `A **New Moon in Sagittarius** aims the reset at **the horizon**. Mutable fire ruled by Jupiter, Sagittarius governs belief, meaning, study, travel, risk, publishing and faith, and it quietly decides how big a life you think you're allowed to have.`,

        `What tends to surface is the size of things. Where your world has shrunk to fit your calendar, where realistic became the polite word for small, where you've been waiting to feel qualified before you start, and where you stopped believing in the bigger version because the last disappointment was pricey.`,

        `Jupiter makes this one of the more optimistic Moons of the year, and that optimism is functional rather than decorative. Sagittarius seeds things that require faith before evidence: the course, the move, the business, the book, the flight you've had in a browser tab since June.`,

        `Meaning is the real question underneath, which is far more inconvenient than whether something works. Sagittarius wants to know whether it's worth one of your actual years, and it will not accept busy as an answer.`,

        `The energy asks: **What would I go after if I stopped waiting to be qualified?**`,
      ],
      lookOutFor: [
        `Sagittarius overshoots by design. The plan arrives at maximum scale, immediately, with the boring middle section missing entirely, so the trap is treating the size of the vision as evidence of progress on it.`,

        `Leaving and expanding look identical in week one. Both feel like freedom, both involve packing, and the difference only shows up in whether you're moving toward something or away from something you'd rather not finish.`,

        `Certainty gets dangerous under this Moon. A belief can feel so obviously true that you stop checking it against reality, and this sign holds convictions waaaay more confidently than the available evidence supports.`,

        `Tact is the first casualty. The truth feels so clear that saying it immediately, at volume, seems like honesty, and you can be entirely right in a way that costs you the person you were right at.`,

        `Next big idea syndrome is real. There's always a shinier one available, and its arrival conveniently relieves you of finishing the current one, which is how ten exciting beginnings become nothing you can point at.`,

        `Overcommitting is the very Jupiter version of generosity. Yes to the trip, the project, the favour, the plan, followed by a month of quietly resenting a calendar you built with your own hands.`,

        `Restlessness can do a convincing impression of intuition. Feeling trapped is information worth having, and it isn't automatically instruction, because sometimes the thing asking for endurance was the thing about to work.`,

        `Preaching is the tell that conviction has started doing a job it can't do. When the volume goes up, there's usually a feeling underneath that isn't being felt.`,

        `**Book the thing, then build the middle. A vision with no logistics is just a nice evening.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Sagittarius is **restlessness that calls itself freedom**, and it's the most charming shadow going, because it always turns up dressed as growth.`,

        `The mechanism is elegant. Something gets difficult, or ordinary, or requires you to stay when staying isn't fun, and a bigger, brighter, more meaningful option appears bang on cue. You follow it believing you're expanding, and the unfinished thing gets left behind without ever being called that.`,

        `Give it a decade and you end up with a genuinely interesting life and a trail of things that almost happened.`,

        `Philosophy makes a great escape hatch too. This sign can reframe anything into a lesson, a season, a chapter or a sign from the universe, and a beautiful reframe will quietly excuse you from a conversation you owed somebody.`,

        `Optimism has an avoidance setting as well. Deciding it'll all work out is sometimes faith and sometimes a way of not looking at the numbers, the timeline or the thing you already know isn't working.`,

        `Promises are where other people feel it. Sagittarius means every word on Monday and means it slightly less by Thursday, and the gap between those two moments teaches everybody what your word is worth.`,

        `Boredom is the engine underneath the whole pattern. It gets treated as proof that something is wrong, when most of the time it's simply the part where the novelty ended and the work began.`,

        `There's a loneliness inside the freedom that rarely gets discussed. Keeping every option open means never being fully in anything, and eventually that costs more than it protects.`,

        `Getting through it starts by making something real this week: a date, a deposit, a booking, a person told. This sign commits out loud, so put something into the world that would be embarrassing to quietly abandon.`,

        `Write down what you're leaving unfinished and be honest about whether this beginning is expansion or exit. Both are allowed. They need completely different plans, and one of them requires going back to close something first.`,

        `Stress-test the belief before you bet a year on it. Write the sentence you're treating as fact, write what would have to be true for it to be wrong, then go and find out which one the evidence actually supports.`,

        `Give the restlessness somewhere physical to go, because it will not be reasoned with. Distance, movement, a day somewhere else, a proper change of scenery. Let the body have some freedom so the urge to leave doesn't get to make your decisions.`,

        `And build the middle bit. Jupiter expands whatever it touches, including chaos, so a plan with three real steps in it will take you further this cycle than a vision with none.`,

        `**Wanting more was never the problem. Leaving every time it gets ordinary is what keeps the more out of reach.**`,
      ],
    },
  },
  Cancer: {
    peak: {
      bringsUp: [
        `A Full Moon brings things into full view, making it harder to ignore what you want, what you've outgrown and what you're finally ready to do something about. It's a culmination point, so emotions can feel louder, truths can become clearer and situations that have been sitting in the background can suddenly demand your attention.`,

        `A **Full Moon in Cancer** brings it to a head **in your feelings, usually all of them at once**. Cardinal water ruled by the Moon herself, Cancer governs home, family, memory, safety, mothering and being mothered, so this is the lunation with the least interest in your composure.`,

        `Expect the volume up on everything domestic and emotional: the family group chat, the state of your flat, who remembered your birthday and who didn't, the conversation with your mother you've been having in your head since 2019. Crying at an advert is a legitimate Full Moon in Cancer activity and I won't hear otherwise.`,

        `Because the Moon rules this sign, she's at full strength here, which means feelings arrive at their actual size rather than the manageable version you usually run. Something from years ago often attaches itself to something small from this week, and that's precisely why the intensity can seem waaaay out of proportion to what's actually going on.`,

        `Cancer's genius is that it remembers. You know who has shown up for you, who went quiet when things got hard, and exactly what safety feels like in your body, which makes you very difficult to fool about people.`,

        `The energy asks: **Who is holding me while I hold everybody else?**`,
      ],
      lookOutFor: [
        `The shell is the signature move. You go quiet, you say you're fine, and a decision gets made about somebody who never knew a conversation was on the table.`,

        `Hinting is the Cancer love language and it does not work. Going slightly cold, doing the thing pointedly so they notice, mentioning it sideways to a third party, all of it is a request written in a code nobody else has been given.`,

        `Old feelings love this Moon. When the reaction is at nine and the situation is at four, the missing five usually belongs to something much older, and the person in front of you is being charged for it.`,

        `Over-functioning creeps in fast. Caring turns into managing everybody's moods, pre-empting needs nobody voiced and taking responsibility for a room full of feelings that were never yours to fix.`,

        `Resentment follows, as it always does when you've given past your own limit for months. It arrives sideways, because saying it directly would mean admitting you needed something, which this sign finds genuinely harder than carrying it.`,

        `Nostalgia gets seductive here too. Cancer remembers everything, including a gently edited version of the past, and going back over it can feel like processing while it's really just aching in higher definition.`,

        `Guilt turns up at the door the moment you rest, say no or put yourself first. It shows up automatically, and its appearance is not evidence that you've done something wrong.`,

        `Snapping at somebody who came close to a soft spot is the other tell. Defensiveness is quicker than saying that one hurt, and considerably less effective.`,

        `**You're allowed to be the one who gets looked after this week.**`,
      ],
      shadow: [
        `The shadow of a Full Moon in Cancer is **the wound doing the talking**, and it's convincing because it isn't lying. The feeling is real. The hurt is real. What's skewed is the scale, because most of it belongs to something that happened long before this week.`,

        `Here's the mechanism. Something lands at a five, it hits a nerve that's been tender since you were small, and suddenly you're at a nine, making decisions at nine, about a five, involving somebody with no idea what they just stepped on.`,

        `Retreat is where it goes next. The shell closes, messages get shorter, the warmth drains out, and it feels like self-protection while functioning as punishment.`,

        `Withdrawal is also a test, if you're honest. Part of you is waiting to see whether they come and find you, and either outcome gets filed as evidence about whether you're actually loved, which is an enormous amount of weight to put on somebody who wasn't told an exam was in progress.`,

        `Care can become leverage without anybody deciding to make it so. Giving and giving builds a balance, and a balance nobody knows about eventually gets collected in a tone rather than a sentence.`,

        `The martyr line lives here too: I'll just do it myself, it's fine, don't worry about me. Said often enough, that stops being generous and becomes a very effective way of never having to ask for anything.`,

        `Smothering deserves a gentle mention. When you're frightened of losing somebody, love tips into monitoring, over-involvement and doing things for people who never asked, which pushes away the exact closeness you were reaching for.`,

        `Underneath all of it sits one fear worth naming: that if you stopped holding everything together, you'd discover how little would be held for you.`,

        `That fear has never actually been tested, because you've never stopped long enough to run the experiment.`,

        `Start by separating the eras. Write what happened this week, then write the earliest version of the same feeling you can find, and look at how much of the intensity belongs to page two. That part isn't for the person in front of you.`,

        `Do one thing that comforts you without proving anything to anybody. A bath, clean sheets, food you actually like, your own bed at nine, the phone in another room. Cancer regulates through care, and some of the care has to point at you or the whole system runs dry.`,

        `Then ask for one thing directly. Out loud, no cushioning, no lengthy justification of why it's a reasonable request, to the person who can actually answer it.`,

        `That's the entire practice, because this sign will hint for a year rather than risk a no, and the hinting is precisely what keeps you unmet.`,

        `Water helps, predictably. Sea, bath, shower, rain, a long swim. Cancer is ruled by the tides and the body settles faster in water than it does in analysis.`,

        `**Being needed feels like love and doesn't nourish like it. Let somebody feed you this week.**`,
      ],
    },
  },

  Capricorn: {
    seed: {
      bringsUp: [
        `A New Moon is the reset. The Sun and Moon meet in the same degree, the sky goes properly dark, and the next twenty nine days start from scratch, which makes this the planting end of the cycle. Nothing is visible yet, and whatever you decide now gets the whole month to grow into something, while whatever you leave hovering tends to still be hovering when the next one comes round.`,

        `A **New Moon in Capricorn** aims the reset at **the long game**. Cardinal earth ruled by Saturn, Capricorn governs ambition, structure, authority, reputation, mastery and the architecture of an actual life, which makes this the most strategic Moon of the year and the least interested in vibes.`,

        `What surfaces tends to be sobering in a useful way. Where you've been working extremely hard on something that isn't going where you want. Where you've been waiting to be chosen instead of building the thing. Where next year has been the answer for three consecutive years, and where busy has been standing in for progress.`,

        `Saturn is the planet of time, structure and consequences, which sounds grim and is actually the whole gift. This Moon will show you what compounds. Small, boring, repeatable things done for twelve months build something nobody can take off you, and Capricorn is the only sign that finds that genuinely exciting.`,

        `There's a lot to respect in what you've already built brick by brick with nobody clapping: the standards you hold when it would be easier not to, the promises you keep, the fact that people can rely on your word.`,

        `The energy asks: **What am I building, and is my effort actually pointed at it?**`,
      ],
      lookOutFor: [
        `Capricorn starts with the entire staircase. A plan gets designed so demanding that it assumes you'll never have a bad week, and then the first missed Tuesday reads as total failure.`,

        `Borrowed goals are the expensive one. This sign will work extremely hard for a prize it doesn't want purely because the prize is respectable, and you can lose years being excellent at something that was never yours.`,

        `Worth quietly becomes conditional on output. If the plan leaves no room in it for being a person, you've designed a machine for proving something rather than a route to anywhere.`,

        `Pessimism does a convincing impression of realism. Deciding upfront how hard it'll be, how unlikely it is and how long it'll take sounds grounded while functioning perfectly as a reason to not begin.`,

        `The long view can become a way of endlessly deferring the life you're saving up for. Playing the long game is Capricorn's genius, and someone has to actually live in the meantime.`,

        `Doing it alone is the default setting, and it'll make this cycle twice as heavy as it needs to be. Handle it yourself, ask nobody, mention nothing, collapse privately in March.`,

        `Measuring yourself against people at a completely different stage is the fastest way to discount everything you've already done, and this sign measures constantly.`,

        `Rest keeps getting scheduled for after, and after keeps moving. A structure with no recovery built into it does not survive contact with a real year.`,

        `**Build the thing you'd still want if nobody was watching. That one survives the years.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Capricorn is **worth earned through output**, and it's the hardest one to spot, because the world applauds it. You get promoted for it. It looks like discipline from every angle apart from the inside.`,

        `The equation underneath was usually learned young: I'm acceptable when I'm useful. Produce, achieve, hold it all together, be the reliable one, and you get to feel alright about yourself for approximately one afternoon.`,

        `Then the bar moves, which is the part that gives the whole thing away. No achievement settles it, because the achievement was never what you were chasing. Reassurance was, and reassurance has a shelf life measured in hours.`,

        `Rest has to be earned before it's allowed, so it never quite is, and the resulting exhaustion gets filed under discipline rather than under warning sign.`,

        `Self-criticism turns up in the costume of high standards. That voice would be considered cruel if you aimed it at a friend, and you'd never let anybody speak to somebody you love that way.`,

        `Control has a hand in it too. Handling everything yourself feels safest, and it constructs a life where nobody helps because nobody was ever let in, and then the loneliness gets read as further proof that it all has to be done alone.`,

        `Resentment pools underneath, aimed at people who were genuinely never given the chance to show up, which isn't really their crime.`,

        `Coldness is the pressure release. Capricorn under strain cuts efficiently, ends things cleanly and goes businesslike with people who needed a human, then feels the cost months later when it's awkward to walk it back.`,

        `Somewhere under all of it is a quiet fear of being found out, and working harder is the most socially rewarded way to keep that fear quiet.`,

        `The way through is structural, because this sign keeps promises that have been built rather than intended. Put the rest into the plan first, in the diary, protected, where a busy fortnight can't negotiate it away.`,

        `Write why you want this in one sentence with no mention of anybody else's approval. If it doesn't survive that edit, change the goal rather than the effort, because effort was never what was missing.`,

        `Hand one thing over this cycle. One task, one responsibility, one piece somebody else could genuinely carry, chosen specifically because doing everything is the pattern rather than the strength.`,

        `Then write what you'd say to somebody else in exactly your position. That's the fair standard, and it's the one you apply to everybody except yourself.`,

        `Saturn rewards the unglamorous and repeatable, so pick something small enough to do on your worst week and do it for the whole cycle. That's the actual magic of this sign.`,

        `**You were worth this before you built anything, and the building goes considerably better once it stops being evidence.**`,
      ],
    },
  },

  Leo: {
    peak: {
      bringsUp: [
        `A Full Moon brings things into full view, making it harder to ignore what you want, what you've outgrown and what you're finally ready to do something about. It's a culmination point, so emotions can feel louder, truths can become clearer and situations that have been sitting in the background can suddenly demand your attention.`,

        `A **Full Moon in Leo** brings it to a head **out loud, and usually in front of somebody**. Fixed fire ruled by the Sun, Leo governs self-expression, creativity, recognition, romance, play and pride, so this Moon wants to know how much of you has been kept offstage.`,

        `What surfaces is anything you've been dimming. The work you stopped making because nobody responded last time, the thing you post and delete, the friendship where you're the entertainment and nobody asks how you are, the relationship where you've been performing low maintenance for somebody who'd have coped fine with the real thing.`,

        `The Sun rules this sign, and the Sun doesn't share. Wanting to be seen, chosen and acknowledged gets loud this week, including the parts you'd never say out loud, and pride flares anywhere you've given generously and felt invisible for it.`,

        `Leo is also the sign of play, which gets lost in all the talk about ego. Somewhere in there is a version of you that made things purely because it was funnnn, and this Moon tends to remind you she existed.`,

        `The energy asks: **Where am I ready to stop auditioning for my own life?**`,
      ],
      lookOutFor: [
        `Leo makes a scene where a conversation would do. Wounded pride arrives beautifully dressed as principle, and the grand gesture, the ultimatum, the very public exit all feel enormously justified at the time.`,

        `The cold regal version costs exactly the same and takes longer. Going silent and waiting to be chased is still a performance, just one with worse odds.`,

        `Applause becomes the measuring stick. When something only feels worth doing if somebody responds to it, you've handed the steering wheel to an audience that's mostly looking at its own phone.`,

        `Looking unbothered is exhausting to maintain and stops anybody reaching you. This sign would frequently rather seem fine than admit to feeling small.`,

        `Taking things personally is the occupational hazard. Somebody's bad week, slow reply or distraction lands as a verdict on your worth, when most of the time it's a verdict on their week.`,

        `Other people's wins can sting under this Moon, and that sting is information. It's usually pointing directly at something you want and haven't let yourself say out loud.`,

        `Generosity with strings attached is very Leo and rarely intentional. You give enormously, quietly expect to be adored for it, and the disappointment when that doesn't arrive turns into a resentment nobody saw coming.`,

        `The apology you're refusing to make is probably one sentence long. Pride can hold a position for three weeks over something that would take thirty seconds to resolve.`,

        `**Be seen doing the actual thing, not the version you think will be applauded.**`,
      ],
      shadow: [
        `The shadow of a Full Moon in Leo is **pride guarding a very soft centre**, and the softness is the part nobody gets to see, which is exactly why the guarding gets so elaborate.`,

        `Underneath the confidence sits an old question: am I genuinely special, or have I just been performing well? A bright sky makes that question loud, and everything you do next becomes an attempt to answer it.`,

        `Performance is the obvious symptom. Bigger, funnier, more impressive, more generous, more ON, all of it running on the hope that enough response will settle something that response has never once settled.`,

        `Making a shared situation about your part in it happens fast and usually without noticing. Being central feels considerably better than being overlooked, and that trade gets made in about four seconds.`,

        `Needing to be right is the same fear wearing a suit. Backing down feels like being diminished in front of somebody, so the position gets defended long past the point of caring about it.`,

        `Going first with an apology becomes almost impossible, because admitting fault feels like confirming the thing you're most afraid is true.`,

        `There's shadow in the generosity too. Giving can turn into a way of purchasing love, and when the return doesn't come you're left with an invoice nobody agreed to and a feeling you can't name.`,

        `Jealousy in Leo is really grief. Somebody got the thing, it stings, and underneath the sting is a want you haven't let yourself admit to, because admitting it means risking being seen not getting it.`,

        `Dimming is the least obvious version and by far the most common. Shrinking preemptively so nobody can accuse you of thinking too much of yourself, then quietly resenting the room for not noticing you.`,

        `Start by finding the hurt underneath the outrage and naming it privately in one sentence. Not the argument, not the principle, the wound, which is almost always some version of I felt unimportant.`,

        `Then go and make something for nobody. Badly, unposted, unshared, no outcome attached. Leo shadow dissolves the moment you rediscover that you enjoy this without an audience, and that's the only reliable route back to actual confidence.`,

        `Say the want out loud at full size to one person who loves you, skipping the modest version. A desire said out loud stops being something you can quietly downgrade at the first sign of difficulty.`,

        `If there's an apology sitting there, go first. It costs nothing real and usually returns the exact closeness you were trying to force with a performance.`,

        `Then do something purely for the pleasure of it, since the Sun rules vitality and this sign runs on joy rather than approval. Dance, dress up for the corner shop, sing in the car, flirt with your own life a bit.`,

        `**You don't have to be the most impressive person in the room to deserve the room.**`,
      ],
    },
  },

  Aquarius: {
    seed: {
      bringsUp: [
        `A New Moon is the reset. The Sun and Moon meet in the same degree, the sky goes properly dark, and the next twenty nine days start from scratch, which makes this the planting end of the cycle. Nothing is visible yet, and whatever you decide now gets the whole month to grow into something, while whatever you leave hovering tends to still be hovering when the next one comes round.`,

        `A **New Moon in Aquarius** aims the reset at **the future, and at who you are when nobody's supervising**. Fixed air ruled by Saturn traditionally and Uranus in the modern reading, Aquarius governs community, friendship, innovation, rebellion and the long view of where the whole thing is heading.`,

        `Uranus is the planet of sudden change and unapologetic individuality, so this Moon tends to arrive with the urge to do it completely differently. Leave the group that stopped fitting, build the weird version of the business, stop attending the thing you've been attending out of habit since 2022, opt out of a norm you never actually agreed to.`,

        `Friendship and belonging come into focus too, which surprises people who expect Aquarius to be all robots and revolution. Who your people are, which rooms you perform in, where you've been the slightly edited version of yourself to stay included.`,

        `Aquarius sees the system rather than the individual scene, which is genuinely a superpower. You can usually spot the dynamic everybody else is inside of, and this Moon is a good moment to apply that clarity to your own life rather than everybody else's.`,

        `The energy asks: **What would I build if I stopped waiting for it to be normal?**`,
      ],
      lookOutFor: [
        `Aquarius can design an entire system and never once live inside it. The plan ends up elegant on paper, philosophically sound and completely abstracted from your actual Tuesday.`,

        `Being different for its own sake is the other trap. Rejecting the ordinary option because it's ordinary rather than because it's wrong for you is still letting other people's choices set yours, just in reverse.`,

        `Detachment arrives dressed as perspective. Rising above a feeling, analysing it beautifully and never actually having it is a very sophisticated way of not being in your own life.`,

        `The group can quietly become the identity. Check whether the community you're in was chosen or simply inherited, and whether you'd pick these rooms again from scratch today.`,

        `Independence is a superpower until it turns into never needing anybody, at which point it starts functioning as insurance against being disappointed.`,

        `Ideas outnumbering execution is verrrry on brand. Fifteen brilliant concepts and no first step is a cycle spent thinking rather than building.`,

        `Going remote is this sign's exit. When things get emotionally complicated, Aquarius can leave the room while still physically sitting in it.`,

        `The future can swallow the present whole. Planning a life five years out is useful, and it makes a fantastic hiding place from a conversation that needs having on Thursday.`,

        `**Build it with one actual human in it. Aquarius is a social sign, whatever the aloofness suggests.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Aquarius is **distance used as safety**, and it disguises itself brilliantly, because from the outside it reads as calm, rational and remarkably self-sufficient.`,

        `Being the observer means never being the one who needs anything, and somewhere early on that probably kept you safe. Watching from slightly outside the group is a skill built by somebody who once didn't feel welcome inside it.`,

        `It runs now as an independence so complete that nobody gets close enough to disappoint you, which also means nobody gets close enough to be much good to you either.`,

        `Feelings get converted into analysis at speed. You can explain your own attachment style, name the dynamic, diagnose the pattern, and feel absolutely none of it, which the mind experiences as being on top of things.`,

        `The personal keeps getting converted into a principle too, so the people involved end up dealing with your conclusion rather than with you.`,

        `Contrarianism is the noisier version of the same defence. Arguing the other side is much safer than admitting you wanted to be included.`,

        `Underneath sits an old certainty that you don't really belong anywhere, usually formed young, filed permanently, and never once updated with current evidence.`,

        `That belief makes leaving feel clean and staying feel risky, which is why the clean cut can arrive looking like a boundary while behaving like an escape.`,

        `There's also the quiet superiority that creeps in when you've spent years seeing what other people can't. Being right about the system is cold comfort if it keeps you outside every room in it.`,

        `Put one actual person inside the plan this cycle. Aquarius builds best in company, and a beginning that exists only in your head has nobody to keep it honest or interesting.`,

        `Name the feeling underneath the idea, plainly and in ordinary words. This sign will present a want as a principle, and a principle is waaaay harder to actually get.`,

        `Stay in the room for one uncomfortable conversation you'd normally intellectualise your way out of. You can describe a dynamic brilliantly and still never say the sentence that matters, which is usually something as simple as that hurt my feelings.`,

        `Then do something gloriously unstrategic with people. Aquarius rules the eleventh house of friendship for a reason, and community is the medicine as well as the theme.`,

        `**Being understood requires being in the room, which is the one part this sign keeps trying to skip.**`,
      ],
    },
  },

  Virgo: {
    peak: {
      bringsUp: [
        `A Full Moon brings things into full view, making it harder to ignore what you want, what you've outgrown and what you're finally ready to do something about. It's a culmination point, so emotions can feel louder, truths can become clearer and situations that have been sitting in the background can suddenly demand your attention.`,

        `A **Full Moon in Virgo** brings it to a head **in the details, the routine and the body**. Mutable earth ruled by Mercury, Virgo governs work, health, systems, service, craft and the daily mechanics of a life, so this Moon tends to arrive as an accumulation rather than a bombshell.`,

        `What surfaces is everything that's been quietly not working. The schedule that only functions if you never get ill, the job where you're doing two roles for one salary, the ache you've been ignoring since spring, the admin pile with genuine consequences in it, the habit you know is costing you and keep booking in for anyway.`,

        `Mercury runs this sign, so the mind gets precise and slightly relentless. Clarity arrives about exactly what needs fixing and exactly whose job each piece is, which is enormously useful right up until the same sharpness turns inward at 2am.`,

        `Virgo is the sign of genuine craft, and that's the part the memes miss. You care about doing things properly, and there's real satisfaction available this week in fixing one small thing with your own hands.`,

        `The energy asks: **What have I been putting up with because sorting it felt like admitting it was a problem?**`,
      ],
      lookOutFor: [
        `Clarity curdles into criticism fast under this Moon, aimed at yourself first and then at whoever is nearest and least deserving.`,

        `One flaw can become the whole picture. Virgo will take a fixable situation, zoom in at maximum magnification and conclude the entire thing is fundamentally broken.`,

        `Anxiety does an excellent impression of diligence. The 2am list, the rehearsed worst case, the ninth reread of a message, all of it presenting as responsibility while achieving nothing.`,

        `Control turns up as helpfulness. Managing the details so tightly that nobody, including you, gets to be a human being in the process is exhausting for everybody involved.`,

        `The perfectionism will stall the actual repair. Researching the ideal system for four days means four more days of the current one, which is not what the research was for.`,

        `Martyrdom is the Virgo flavour of service. Doing everybody's unglamorous jobs without mentioning it, then feeling quietly furious that nobody noticed the invisible labour you deliberately kept invisible.`,

        `Body stuff can get obsessive rather than caring under this Moon. There's a difference between listening to your body and putting it on trial.`,

        `Comparison gets forensic. Virgo doesn't just notice somebody's doing better, it audits precisely how and by what margin, which is a brutal way to spend a Thursday.`,

        `**Pick one small thing and actually fix it. This sign gets peace from doing, never from analysing.**`,
      ],
      shadow: [
        `The shadow of a Full Moon in Virgo is **contempt with a clipboard**. The eye that finds what's wrong is a genuine gift, and under pressure it stops being in service of anything and becomes a running commentary on your own inadequacy with everybody else's as a supporting feature.`,

        `It always sounds reasonable, which is the problem. Every individual criticism is technically accurate, and accuracy is how this shadow gets past security.`,

        `The standard rises to meet whatever you achieve, so arrival never happens. Get the thing done, and the bar is already somewhere else, looking disappointed.`,

        `Underneath is usually the belief that you're acceptable when useful, so rest requires justification and needing help feels like a design fault rather than a Tuesday.`,

        `Control is the other face of it. If everything is managed tightly enough, nothing can go wrong, and the exhaustion of running that system gets filed as conscientiousness.`,

        `Perfectionism protects you from being seen trying. A thing that isn't finished can't be judged, so the endless improving is a genuinely clever way of never submitting anything.`,

        `Then there's the tidying that isn't change. Reorganising the drawer, colour-coding the tracker, rewriting the plan, all while the actual difficult thing sits exactly where it was.`,

        `The criticism leaks outward eventually, usually at the people closest to you, and usually in the form of a small correction that wasn't necessary.`,

        `Somewhere in it is a fear of being the one who got it wrong, which is why the double-checking never quite finishes.`,

        `Separate what's yours to fix from what you're simply carrying. Two honest columns, and hand the second list back in your own head before you try to act on any of it.`,

        `Then repair one thing today, small and concrete. Virgo shadow dissolves in useful action and absolutely thrives on lists that never get touched.`,

        `Set a done line before you start the next thing, deliberately modest, decided in advance, so the goalposts can't quietly relocate while you're working.`,

        `Give the body something kind rather than corrective: a walk without tracking it, an early night, actual food, hands in something physical. This sign holds stress in the gut, and the nervous system needs the message that it isn't being assessed.`,

        `Then leave one thing imperfect on purpose and let it be fine. That's the whole practice, and it will feel deranged for about three days.`,

        `**Your standards are a gift when they're pointed at the work. Pointed at you, they just slow the work down.**`,
      ],
    },
  },

  Pisces: {
    seed: {
      bringsUp: [
        `A New Moon is the reset. The Sun and Moon meet in the same degree, the sky goes properly dark, and the next twenty nine days start from scratch, which makes this the planting end of the cycle. Nothing is visible yet, and whatever you decide now gets the whole month to grow into something, while whatever you leave hovering tends to still be hovering when the next one comes round.`,

        `A **New Moon in Pisces** starts things **without edges**. Mutable water ruled by Jupiter traditionally and Neptune in the modern reading, Pisces governs dreams, imagination, spirituality, compassion, art, escape and everything that refuses to be measured.`,

        `This reset rarely arrives as a plan. It turns up as a pull: toward making something, resting properly, praying or meditating or whatever your version of that is, forgiving somebody, or finally admitting you're exhausted in a way sleep hasn't touched.`,

        `Neptune dissolves boundaries, which is the gift and the whole warning. Intuition runs unusually high, dreams get vivid and strange, and other people's moods come in through the walls, so it's often hard to work out which feelings in the room are actually yours.`,

        `Pisces holds the end of the zodiac, so there's a completion flavour to it too. Something usually wants finishing or forgiving before the next cycle can properly begin, and this Moon is unusually good at that kind of soft ending.`,

        `The energy asks: **What am I being called toward that doesn't make practical sense yet?**`,
      ],
      lookOutFor: [
        `Pisces beginnings dissolve if nothing holds them. A whole cycle can disappear into the beautiful version of the idea while the first practical step never gets a date in the diary.`,

        `Vagueness is the disguise. When the intention is unformed enough, anything counts as progress, which means nothing does and nobody can measure the disappointment.`,

        `Saying yes to everybody else's beginning is the quickest way to lose your own. This sign will pour a whole month into somebody else's crisis and call it kindness.`,

        `Escape gets creative under this Moon: the wine, the scroll, the nap, the situationship, the fantasy of a completely different life in a completely different country. All soothing, all extremely effective at postponing the concrete thing.`,

        `Rescuing somebody who hasn't asked to be rescued is very Pisces and rarely ends in gratitude. It also conveniently keeps you busy with a problem that isn't yours.`,

        `Boundaries go soft precisely when you need them, so this is the fortnight where you agree to things at nine in the evening that horrify you at nine in the morning.`,

        `Idealising people is the other hazard. Neptune makes it easy to fall for potential, then spend months negotiating with somebody who was never actually offering it.`,

        `Exhaustion arrives sideways too. A sensitive system picking up a whole room's worth of emotional weather gets tired in a way that looks like laziness from the outside and isn't.`,

        `**Give the dream one hard edge this week, or the water goes everywhere.**`,
      ],
      shadow: [
        `The shadow of a New Moon in Pisces is **escape that looks like softness**, and it's the gentlest, most forgivable shadow in the zodiac, which is exactly why it runs for years without being challenged.`,

        `When the beginning asks for something concrete, Pisces drifts: back to the dream, the distraction, the substance, the rescue mission, the long bath of imagining it rather than doing it.`,

        `The fantasy quietly replaces the pursuit. Imagining the finished thing delivers a version of the same feeling, at zero risk, which makes it very hard to give up.`,

        `Martyrdom is the other route out. Giving away so much of yourself that there's nothing left to begin with is a socially applauded way of never having to try for your own thing.`,

        `Then comes the story where you had no power at all. Sometimes that's true, and Pisces will reach for it even when it isn't, because being swept along hurts less than having chosen.`,

        `Boundaries are the practical shadow. Without them you absorb moods that aren't yours, take responsibility for feelings you didn't cause and end up resentful about things you volunteered for.`,

        `Vagueness protects you from failure. A goal nobody can measure is a goal nobody can watch you miss, including you.`,

        `There's often real grief underneath, unprocessed and old, and the numbing exists to keep it at a workable distance. Naming that is kinder and more accurate than calling yourself lazy.`,

        `Start by giving the dream one hard edge: a date, an hour in the diary, one person who expects it. This sign needs a container or the whole thing pools on the floor.`,

        `Write down what you feel before deciding what it means, then split the page into what's yours and what you absorbed. Pisces will not find that line on its own and it changes everything once drawn.`,

        `Name what you're avoiding by keeping this vague. One sentence, no poetry, and it'll usually be embarrassingly obvious once it's written.`,

        `Protect one piece of this week for yourself before giving the rest away, because the giving is automatic and the keeping has to be deliberate.`,

        `Make something physical with the feeling: paint, write, sing, swim, dance, cook, get it out of the mist and into an object. Neptune energy needs a form or it becomes fog and then it becomes a nap.`,

        `**You're allowed to want something specific. Wanting it precisely doesn't make you less soft.**`,
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
