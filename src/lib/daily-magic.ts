// The 30 activities behind the Daily Magic Button on the Coven home. Everyone gets the same one each
// day and the list loops every 30 days, so nothing here needs a personalised reading.

export type MagicKind = "affirmation" | "journal" | "action" | "challenge";

export const MAGIC_LABELS: Record<MagicKind, string> = {
  affirmation: "✨ your affirmation",
  journal: "📓 your journal prompt",
  action: "🪄 your tiny magic move",
  challenge: "🪐 your astro challenge",
};

export const DAILY_MAGIC: { kind: MagicKind; text: string }[] = [
  { kind: "affirmation", text: "I am allowed to want ALL of it, out loud, with my whole chest." },
  { kind: "journal", text: "Finish this sentence five times: If I stopped shrinking, I would..." },
  { kind: "action", text: "Write tomorrow's best news as if it already happened. Dramatic details ONLY, babe." },
  { kind: "challenge", text: "Mars challenge: do the one thing you've been avoiding for a week. Set a timer for ten minutes and GOOOO." },
  { kind: "affirmation", text: "Money adores me and it knows my address." },
  { kind: "journal", text: "Write down the last three times you said yes when your whole body said noooo. Circle the one that cost you most." },
  { kind: "action", text: "Put a coin somewhere new in your home and say \"more of this, please\" every time you walk past it today." },
  { kind: "challenge", text: "Venus challenge: wear the thing you've been saving for a special occasion. TODAY is the occasion." },
  { kind: "affirmation", text: "I am too much for small rooms and exactly right for the big ones." },
  { kind: "journal", text: "Describe your future self's morning, from the second she wakes up. What's on the bedside table, who's texting her and what's in her bank account." },
  { kind: "action", text: "Change your phone wallpaper to a picture of the thing you're calling in." },
  { kind: "challenge", text: "Mercury challenge: send the message you've been drafting in your head for weeks. Five sentences maximum, zero apologising." },
  { kind: "affirmation", text: "I receive easily. Compliments, cash, upgrades, all of it, thank you very much." },
  { kind: "journal", text: "List everything you're secretly jealous of, then underline the top three. Those are the things you actually want." },
  { kind: "action", text: "Light a candle, say your biggest wish out loud three times, then blow it out like it's your birthday." },
  { kind: "challenge", text: "Saturn challenge: say one boundary out loud to someone today. Short, kind and non-negotiable." },
  { kind: "affirmation", text: "I am the main character and the plot is getting SO good." },
  { kind: "journal", text: "Write yourself a thank you letter from your future self, for the brave thing you did this year." },
  { kind: "action", text: "Get rid of ONE thing in your home that belongs to the old you. Bin, charity bag, gone." },
  { kind: "challenge", text: "Moon challenge: write one word for how you feel this morning, at midday and at bedtime. Notice what moved." },
  { kind: "affirmation", text: "My magic is real and my results are on their way." },
  { kind: "journal", text: "Finish this sentence: If nobody could ever have an opinion about it, tomorrow I would..." },
  { kind: "action", text: "Book, buy or bookmark one tiny thing your future self would do. A class, a table for one, a fancy candle." },
  { kind: "challenge", text: "Jupiter challenge: ask for MORE today. A better table, a bigger discount, a higher rate. Say the number and stop talking." },
  { kind: "affirmation", text: "I ask for what I want and I get paid for what I know." },
  { kind: "journal", text: "Write down three things you've done this month that past you would be SCREAMING about." },
  { kind: "action", text: "Write your dream income on a sticky note, put it on your bathroom mirror and read it out loud before you brush your teeth." },
  { kind: "challenge", text: "Sun challenge: post, share or say the thing you've been hiding. Get seen for one full minute, babe." },
  { kind: "affirmation", text: "Everything I'm calling in is already on its way to me." },
  { kind: "journal", text: "Write the text you'd send your best friend on the day it all comes true." },
];

/** Today's activity, changing at the member's own midnight. */
export function magicForDate(date: Date): { kind: MagicKind; text: string } {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return DAILY_MAGIC[day % DAILY_MAGIC.length];
}
