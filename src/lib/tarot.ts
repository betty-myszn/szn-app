export interface TarotCard {
  name: string;
  glyph: string;
  keyword: string;
  message: string; // coaching-voice, second person
}

// Major arcana, read in MY SZN's coaching voice (upright energy only, kept empowering)
export const TAROT_DECK: TarotCard[] = [
  { name: "The Fool", glyph: "0", keyword: "new beginnings", message: "Today wants a leap, not a plan. The thing you keep overthinking only needs you to start it. Trust that the net appears once you jump." },
  { name: "The Magician", glyph: "I", keyword: "you have what you need", message: "Everything required to make your move is already in your hands. Stop waiting for one more qualification. Today, you are the resource." },
  { name: "The High Priestess", glyph: "II", keyword: "trust your knowing", message: "Your intuition is louder than usual today. The answer you keep circling back to is the right one. Stop asking everyone else and listen to yourself." },
  { name: "The Empress", glyph: "III", keyword: "abundance & softness", message: "Let today be sensual and generous. Beauty, pleasure and rest are not indulgent, they refill the well you create from. Receive on purpose." },
  { name: "The Emperor", glyph: "IV", keyword: "own your authority", message: "You are allowed to lead your own life like you mean it. Set the boundary, make the executive decision, build the structure. Today rewards backbone." },
  { name: "The Hierophant", glyph: "V", keyword: "learn from the path", message: "There's wisdom available to you today through a mentor, a book or a tradition. You don't have to reinvent everything. Borrow the map, then make it yours." },
  { name: "The Lovers", glyph: "VI", keyword: "choose from alignment", message: "A choice is asking to be made from your values, not your fear. Whatever you'd pick if you fully trusted yourself, that's your answer today." },
  { name: "The Chariot", glyph: "VII", keyword: "momentum is yours", message: "Focus your energy in one direction today and you're unstoppable. Stop splitting yourself across ten things. Pick the lane and drive." },
  { name: "Strength", glyph: "VIII", keyword: "soft power wins", message: "You don't need to force today, you need to hold steady. Your calm is your power. Meet the hard thing with patience and it softens." },
  { name: "The Hermit", glyph: "IX", keyword: "go inward", message: "Today asks for a little solitude. The clarity you want is under the noise. Give yourself a quiet hour and the answer surfaces on its own." },
  { name: "Wheel of Fortune", glyph: "X", keyword: "the tide is turning", message: "Something is shifting in your favour today, even if you can't see the whole picture yet. Stay open. The lucky break loves a woman in motion." },
  { name: "Justice", glyph: "XI", keyword: "truth & fairness", message: "Today rewards honesty, with others and with yourself. Name the real thing. What you put out comes back, so put out exactly what you want more of." },
  { name: "The Hanged One", glyph: "XII", keyword: "new perspective", message: "The block clears when you look at it differently. Today, stop pushing and try the opposite angle. Surrender is not defeat, it's a smarter route." },
  { name: "Death", glyph: "XIII", keyword: "let the old you go", message: "Something is ending so something truer can begin. Don't cling to the version of you that's ready to be retired. Let it go and make room." },
  { name: "Temperance", glyph: "XIV", keyword: "find your balance", message: "Today is about the middle path, not all-or-nothing. Blend your ambition with rest, your speed with patience. The magic is in the mix." },
  { name: "The Devil", glyph: "XV", keyword: "name what binds you", message: "A pattern, a fear or a habit has more grip on you than it should. Today, name it out loud. You're not trapped, you just forgot you held the key." },
  { name: "The Tower", glyph: "XVI", keyword: "the breakthrough", message: "If something's cracking, let it. What falls today was never built on truth. This is a clearing, not a punishment. Freedom is on the other side." },
  { name: "The Star", glyph: "XVII", keyword: "hope & healing", message: "Today, soften. The hard chapter is behind you and you're being restored. Keep the faith you almost lost, the vision is still valid and still yours." },
  { name: "The Moon", glyph: "XVIII", keyword: "feel your way through", message: "Not everything is clear today, and that's allowed. Trust your gut over the fog. Feel your way forward and don't believe every anxious thought." },
  { name: "The Sun", glyph: "XIX", keyword: "shine, unfiltered", message: "Today is your green light to be fully, visibly yourself. Say yes to the joy. Let people see you happy and radiant, that's the whole point of you." },
  { name: "Judgement", glyph: "XX", keyword: "answer the call", message: "You already know what you're being called toward. Today, stop debating and answer it. This is your rise. Step into the bigger version of you." },
  { name: "The World", glyph: "XXI", keyword: "completion & arrival", message: "A cycle is completing and you're more ready than you feel. Celebrate how far you've come today. You've earned this arrival, now claim it out loud." },
];

// Deterministic card of the day: stable per person per date.
export function getTarotOfDay(seed: string, date: Date = new Date()): TarotCard {
  const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${seed}`;
  let hash = 0;
  for (let i = 0; i < dayKey.length; i++) {
    hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
  }
  return TAROT_DECK[hash % TAROT_DECK.length];
}
