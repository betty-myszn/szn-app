// Weekly chat rituals (24 Nov 2026). Since the Coven opened, more than half of all chat messages came
// from Betty and the comped members, and the September data showed the members who stay are the ones
// who talk. Three fixed beats a week give members something easy to answer without Betty starting
// every conversation by hand:
//
//   Monday    → wins room       (brag thread)
//   Wednesday → astrology room  (one placement to share)
//   Friday    → general room    (what she's calling in for the weekend)
//
// Posted by the nightly community-welcome job (01:00 UTC), as Betty. Each week rotates to the next
// text, so the room never sees the same post twice in a row. Idempotent: the message id is the date.
//
// HELD until Betty approves the wording: flip RITUALS_APPROVED to true.

import type { SupabaseClient } from "@supabase/supabase-js";

export const RITUALS_APPROVED = true; // Betty approved 24 Nov 2026

type Ritual = { space: string; texts: readonly string[] };

const RITUALS: Partial<Record<number, Ritual>> = {
  // getUTCDay(): 0 Sunday ... 6 Saturday
  1: {
    space: "wins",
    texts: [
      "MONDAY BRAG THREAD 🏆💸 Tell us one thing that went RIGHT last week, big or tiny. A client, a sign, a boundary you held, a dress you finally wore. Brag loudly, babe, and hype the girl above you while you're here. 👑",
      "it's wins day, witches 🏆✨ Drop the thing you manifested, finished or survived last week. Screenshots VERY welcome. Every win you post here is proof for the next baddie scrolling past it. 💜",
      "brag thread is OPEN 🪩 What came true, what came easy and what made you go \"wait, it actually worked\" this week. Then go scream YESSSS under somebody else's. 🏆",
      "Monday, babe, so we start with receipts 🧾💸 One win from last week, any size. I'll go first in the replies. 👇",
    ],
  },
  3: {
    space: "astrology",
    texts: [
      "PLACEMENT OF THE WEEK 🪐 Drop your Venus sign and the one thing it explains about how you love or spend money. I'll reply with what I see. 💸💜",
      "midweek chart chat 🔮 Share your Lilith sign and the part of you it says you were told to tone down. Let's read them together in the replies. 🖤",
      "astro check-in 🪐 What's your Midheaven, and are you living it yet? Drop it below and I'll tell you what it's asking for this season. 👑",
      "Moon sign roll call 🌙 Post your Moon and the thing you need when you're stressed. Then find your Moon twin in the replies. 💜",
    ],
  },
  5: {
    space: "general",
    texts: [
      "FRIDAY CALLING IN 🕯️✨ Write the one thing you're calling in this weekend like it's already done. Present tense, no apologising. We'll witness it. 💜",
      "weekend intentions, witches 🔮 What's the plan: rest, magic, money or pure fun? Tell us one thing you'll do for future you before Monday. 🦄",
      "it's Friday and the coven wants to know 🪩 What are you wearing, making or manifesting this weekend? Main character answers only. 👑",
      "Friday spell check ✨ Drop one word for the energy you're bringing into the weekend, then tag the baddie you want to borrow some from. 💜",
    ],
  },
};

/** Which ritual (if any) is due on this UTC date, and its text for that week. Pure, for tests. */
export function ritualFor(date: Date): { space: string; content: string; id: string } | null {
  const ritual = RITUALS[date.getUTCDay()];
  if (!ritual) return null;
  const week = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
  const ymd = date.toISOString().slice(0, 10);
  return { space: ritual.space, content: ritual.texts[week % ritual.texts.length], id: `ritual-${ymd}` };
}

export type RitualOutcome =
  | { status: "posted"; space: string }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

export async function postWeeklyRitual(
  admin: SupabaseClient,
  sender: { id: string; name: string },
  now: Date,
  dryRun: boolean,
): Promise<RitualOutcome> {
  const due = ritualFor(now);
  if (!due) return { status: "skipped", reason: "no_ritual_today" };
  if (!RITUALS_APPROVED) return { status: "skipped", reason: "not_approved" };
  if (dryRun) return { status: "skipped", reason: "dry_run" };
  const { error } = await admin.from("chat_messages").insert({
    id: due.id,
    space_id: due.space,
    user_id: sender.id,
    author: sender.name,
    content: due.content,
  });
  if (error) {
    if (error.code === "23505") return { status: "skipped", reason: "already_posted" };
    return { status: "failed", error: error.message };
  }
  return { status: "posted", space: due.space };
}
