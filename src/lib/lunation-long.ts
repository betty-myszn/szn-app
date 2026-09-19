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
