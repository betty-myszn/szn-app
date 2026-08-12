// The paid, click-to-expand deep dives for each Human Design element. Every element opens into the
// same four-part read, roughly 600 words in total: what it means For You, In Your Business, its
// Shadow, and How To Heal it. Kept separate from human-design-content.ts (the short free reads) so
// the free/paid split is a data boundary, not just a UI one: if there's no deep entry for an
// element yet, the expander simply doesn't offer it.
//
// Voice: warm, direct, second person, flowing sentences. No em dashes, no rhetorical questions.
// Population is phased. Order: Type -> Strategy -> Authority -> Profile -> Profile lines ->
// Definition, then centres, channels and gates in later passes.

export interface HdDeepDive {
  /** What this placement means for who she is. */
  forYou: string;
  /** How it plays out in her work and business. */
  inBusiness: string;
  /** The not-self pattern, where it goes wrong and why. */
  shadow: string;
  /** The practical way back, how to work with it rather than against it. */
  heal: string;
}

// ── TYPE ────────────────────────────────────────────────────────────────────────
export const TYPE_DEEP: Record<string, HdDeepDive> = {
  Manifestor: {
    forYou:
      "You are here to start things. The Manifestor is the only type built to initiate without waiting for a sign, and that urge you feel to move before anyone has handed you permission is not impatience, it is the whole design working exactly as it should. Your aura is closed and repelling, which is why people feel the impact of you before they understand you, and why you have spent so much of your life being called too much by people who were only ever built to respond to you rather than match you. Around nine percent of people carry this energy, so the world was largely designed by and for the other ninety one, and that is precisely why you keep being the one who breaks the pattern, opens the door, and makes the first move that everyone else quietly walks through afterwards.",
    inBusiness:
      "In business your power is the launch, the idea nobody asked for, the offer that did not exist until you decided it should. You are built to begin things and then let others carry them, so the fastest way to burn yourself out is to run your company like a Generator, grinding through the sustaining and the maintaining that your energy was never meant to hold. Build in bursts and rest hard in between, and bring people in to keep the engine running once you have started it. The single move that changes everything for a Manifestor in business is informing. Tell your audience, your team and your collaborators what you are about to do before you do it, not to ask for approval, but to clear the resistance that used to blindside your launches and turn the people around you into allies instead of obstacles.",
    shadow:
      "The Manifestor shadow is anger, and it builds in the exact places where you stopped informing and started bracing for the pushback you have come to expect. When you move in silence because it feels easier than explaining yourself, people feel controlled and shut out, they resist you, and the resistance hardens into a loop where you isolate, you force, and eventually you blow the whole thing up rather than let anyone slow you down. Underneath the anger is usually an old belief that being fully yourself costs you connection, so you either make yourself smaller to keep the peace or you go cold and do it all alone. Both are the not-self running the show, and both quietly convince you that your natural way of moving through the world is a problem to be managed rather than a power to be trusted.",
    heal:
      "Healing for a Manifestor begins with informing, because the thing you were told was optional is actually the release valve for the anger. When you tell people what you are about to do, you stop absorbing their resistance and they stop feeling steamrolled, and the relationships that used to cost you energy start giving it back. Give yourself real permission to move the way you are built to, in decisive bursts followed by proper rest, and stop apologising for needing space that a responding type would never need. Notice the moment the anger rises and treat it as information rather than proof that you are difficult, because it is almost always pointing at a place you went quiet when you should have spoken. The more you inform, rest and back yourself without shrinking, the more that closed aura becomes the thing people are drawn to rather than the thing they push against.",
  },
};

// ── lookups ─────────────────────────────────────────────────────────────────────
// Each returns the deep dive for a given element, or null when it hasn't been written yet, so the
// UI can offer the expander only where real content exists.
export function typeDeep(type: string): HdDeepDive | null {
  return TYPE_DEEP[type] ?? null;
}
