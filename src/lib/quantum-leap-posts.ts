// SERVER ONLY. Betty's daily Quantum Leap post in the coven chat, one a day for the thirty days,
// written in her voice and posted from her account. Never import this from a client component (the
// posts give the days away before Sagittarius SZN).
//
// How they go out: no cron to set up. Whenever a member loads the challenge, the Coven home, the
// dashboard or the coven chat after 8am UK, /api/quantum-leap makes sure today's post exists. The
// message id is fixed per day, so however many members arrive at once it is posted exactly once.
// Only today's post is ever written, so a quiet day can never flood the room with a backlog.
import type { createAdminClient } from "@/lib/supabase/admin";
import { findWelcomeSender } from "@/lib/community/welcome-message";
import { QL_DAYS, QL_LIVE_AT, QL_START, todayNumber, dayHref } from "@/lib/quantum-leap";
import { getDay } from "@/lib/quantum-leap-content";

export const LEAP_POST_ROOM = "general";
// 8am UK. The whole experiment runs in GMT, so that is 08:00 UTC every day.
const POST_HOUR_UTC = 8;
const SITE = "https://itsmyszn.com";

export const leapPostId = (n: number) => `quantum-leap-day-${n}`;

export function leapPostDueAt(n: number): number {
  const [y, m, d] = QL_START.split("-").map(Number);
  return Date.UTC(y, m - 1, d + n - 1, POST_HOUR_UTC);
}

const BODIES: Record<number, string> = {
  1: "OMGGGG it's HERE, babe. Sagittarius szn just walked in and the Quantum Leap Experiment starts RIGHT NOW. Today you write down the dream you've been toooo scared to say out loud, the BIG one, and I want you to be outrageous about it. 💖",
  2: "Morning, baddies! Fifty things you'd love to experience, own, create or achieve, zero limits. Mine has a pink convertible on it, obviously. Drop your top five in here when you're done so we can all scream.",
  3: "Full Moon in Gemini today, my loves. Press play on your future-self activation, meet HER and write out her ordinary day. The tiny details are where the magic hides, I promise.",
  4: "Red pen time ✍️ Mars moves into Virgo tonight, so we're putting the three beliefs that make your dream feel impossible on TRIAL. Bring the evidence and show no mercy.",
  5: "You have a date tonight, babe, with YOURSELF. One hour planning your dream lifestyle, price tag and all, because knowing the number is sooo much hotter than guessing.",
  6: "Permission slip day 💌 Pick the thing you've been side-eyeing yourself for wanting and sign it off. Good-girl conditioning can take the day off, forever actually.",
  7: "End of week one and we're MOVING. Do the scary thing you've been putting off before lunch today, then come back in here and tell me so I can hype you properly.",
  8: "Week two is MONEY week, baddies 💸 Today we find your Jupiter, your personal luck cheat code, and it's sitting right there on your page, already read for your chart.",
  9: "Get specific with me today. Write what financial freedom looks like in your actual life, with real numbers, babe. Smug is encouraged.",
  10: "Hot date with your money tonight: candle, playlist, bank app, zero panic. Look at what came in and what went out, then choose your next move.",
  11: "Feminist PSA of the day: ask for MOREEEE. The pitch, the raise, the rate, the request. Three sentences, no apologies, then send it and tell us in here.",
  12: "Slide into one DM today 🧲 Pick the person whose work lights you up and send the message. Silence costs nothing and a yes could change your whole year.",
  13: "Venus moves into Scorpio today, so we're auditing your yeses 🖤 Find the obligation that's draining you dry and give it a gorgeous new boundary. Freedom loooves space.",
  14: "Receipts day 🧾 Scroll back through your week and list every bit of progress, help, money and lucky break. Post your favourite in here, because small stuff absolutely counts.",
  15: "Week three, babe, bold risks ONLY 🔥 Mercury moves into Sagittarius today, so write down five habits your future self lives by and start the easiest one before bed.",
  16: "Let them LOOK 📣 Post the thing, share the work, say the opinion out loud. Then screenshot it for your evidence and stop refreshing, I see you.",
  17: "THE moment of the whole season is tonight: the New Moon in Sagittarius, 7:51pm ET and 12:51am UK. Do your Jupiter Prosperity Ritual, set your intentions and back them with a real money move within 24 hours. Your page shows you which house it lands in for YOU.",
  18: "Adventure day ✈️ Something new, somewhere different or a big trip booked. Post a photo in here so we can alllll live through you.",
  19: "Saturn turns direct tonight 🦁 Do one meaningful thing before you feel ready. Wobbly is fine, and shoulders back with your best lipstick on is mandatory.",
  20: "Let HER decide today. One decision you've been circling, made by your future self with her priorities in charge. You'll feel the click the second you hear it.",
  21: "Jupiter stations retrograde tonight, which makes it perfect timing to check in on your experiment: what's changing, what's working and what needs a tweak. Scientist energy, zero shame. 🔄",
  22: "Final stretch, babes 🎤 Today's the Big Ask: the intro, the collab, the opportunity or the support. Go BIG and make it soooo easy for them to say yes.",
  23: "Money move Monday 💰 One action that earns, saves or organises your coins, finished TODAY. Log the dollar amount, however tiny.",
  24: "Calendar time 📅 Three dream-life things get real dates today: one for pure joy, one for your goals and one that scares you a teeny bit.",
  25: "Courage challenge 🎲 Take the calculated risk you've been avoiding. Write the worst case, see that you'd survive it, then GO.",
  26: "Coven sister day 👯 Find a baddie in here whose dream lights you up, tell her why and offer one way to help. Then let her hype you right back.",
  27: "Put a ring on it 💍 Choose ONE dream and commit real time, money or a next step to it today. Commitment looks sooo good on you.",
  28: "Proof of progress day 📈 List every single thing you've done differently since Day 1, then read it out loud like the hype woman you are.",
  29: "Look how far you've LEAPT 🔭 Put your Day 1 dream next to where you are today. I'm already so proud of you, babe.",
  30: "Solstice night and our Next Chapter Ceremony 🕯️ Write your next 90-day commitment and carry allll of this straight into 2027. Thirty days, baddies. WE DID THAT. 👑",
};

export function leapPostContent(n: number): string | null {
  const day = getDay(n);
  const body = BODIES[n];
  if (!day || !body) return null;
  return `${day.emoji} DAY ${n} OF ${QL_DAYS} · ${day.title.toUpperCase()}\n\n${body}\n\n👉 ${SITE}${dayHref(n)}`;
}

// Posts today's message if it's due and not already there. Never throws: a failed post must not
// break the page that happened to trigger it.
export async function ensureTodaysLeapPost(admin: ReturnType<typeof createAdminClient>, now = Date.now()): Promise<"posted" | "not_due" | "failed"> {
  try {
    if (now < QL_LIVE_AT) return "not_due";
    const n = todayNumber(now);
    if (n < 1 || n > QL_DAYS || now < leapPostDueAt(n)) return "not_due";
    const content = leapPostContent(n);
    if (!content) return "not_due";

    const id = leapPostId(n);
    const { data: existing } = await admin.from("chat_messages").select("id").eq("id", id).maybeSingle();
    if (existing) return "not_due";

    const sender = await findWelcomeSender(admin);
    if (!sender) return "failed";
    const { error } = await admin
      .from("chat_messages")
      .upsert({ id, space_id: LEAP_POST_ROOM, user_id: sender.id, author: sender.name, content }, { onConflict: "id", ignoreDuplicates: true });
    if (error) {
      console.error("quantum leap post: insert failed", error.message);
      return "failed";
    }
    return "posted";
  } catch (e) {
    console.error("quantum leap post: failed", e);
    return "failed";
  }
}
