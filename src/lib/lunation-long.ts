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
