import { ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "@/types/chart";
import { markActivationStep } from "@/lib/activation";
import { createClient } from "@/lib/supabase/client";

export interface SpaceMeta {
  id: string;
  label: string;
  emoji: string;
  desc: string;
}

export const SPACES: SpaceMeta[] = [
  { id: "general", label: "general chat", emoji: "✦", desc: "the group chat, everything and anything" },
  { id: "wins", label: "wins & celebrations", emoji: "🏆", desc: "brag loudly, we insist" },
  { id: "astrology", label: "astrology", emoji: "☾", desc: "charts, transits and cosmic questions" },
  { id: "business", label: "business", emoji: "💼", desc: "launches, offers, visibility and getting paid" },
  { id: "mce", label: "main character energy", emoji: "👑", desc: "confidence, glow-ups and being seen" },
  { id: "bookclub", label: "book club", emoji: "📖", desc: "this szn's featured read, discussed together" },
  { id: "challenges", label: "seasonal challenges", emoji: "🔥", desc: "this szn's missions, done together" },
  { id: "events", label: "events & workshops", emoji: "🎟️", desc: "live class chat, questions and replays" },
];

// The paid "rituals": the seasonal programming a paid membership buys, as opposed to the open chat
// rooms. These three spaces (plus the moon audios, which live elsewhere) are locked for the free
// front-door tier, who gets the open topic rooms and sign rooms but not the programming. They
// belong to MY SZN ($88) now that the $33 social tier is retired from sale, though grandfathered
// social members still reach them via hasAccessFromRow.
// A single source of truth so the community hub and the individual room page gate identically.
export const RITUAL_SPACE_IDS = new Set(["bookclub", "challenges", "events"]);

export function isRitualSpace(id: string): boolean {
  return RITUAL_SPACE_IDS.has(id);
}

// One room per sign, ids are lowercase sign names ("aries", "taurus"...) so they never collide
// with the topic space ids above.
export const SIGN_ROOMS: SpaceMeta[] = ZODIAC_SIGNS.map((sign, i) => ({
  id: sign.toLowerCase(),
  label: `${sign.toLowerCase()} room`,
  emoji: ZODIAC_SYMBOLS[i],
  desc: `for the ${sign.toLowerCase()}s, and anyone with ${sign.toLowerCase()} placements, to talk shop`,
}));

export const ALL_ROOMS: SpaceMeta[] = [...SPACES, ...SIGN_ROOMS];

export function findRoom(id: string): SpaceMeta | undefined {
  return ALL_ROOMS.find((r) => r.id === id);
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timeAgo: string;
}

export interface Post {
  id: string;
  author: string;
  sign: string;
  space: string;
  content: string;
  likes: number;
  liked: boolean;
  timeAgo: string;
  comments: Comment[];
}

function timeAgoFromIso(iso: string): string {
  return timeAgoFromMinutes(Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
}

function timeAgoFromMinutes(mins: number): string {
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

// Starter conversation so the community feels alive before enough real members are posting.
// These render alongside any real posts (real posts always sort above seeds of a similar age).
// Remove this block, and the `withSeeds` call in loadPosts, once the community is self-sustaining.
interface SeedPost {
  id: string;
  author: string;
  sign: string;
  space: string;
  content: string;
  likes: number;
  minutesAgo: number;
  comments: { author: string; content: string; minutesAgo: number }[];
}

const SEED_POSTS: SeedPost[] = [
  {
    id: "seed-1", author: "maya", sign: "aries sun", space: "wins", likes: 34, minutesAgo: 12,
    content: "signed my first 10k client this morning. i almost talked myself out of sending the proposal. send the proposal.",
    comments: [
      { author: "priya", content: "SCREAMING for you. this is the sign i needed to send mine.", minutesAgo: 9 },
      { author: "elle", content: "@maya main character behaviour, obsessed", minutesAgo: 4 },
    ],
  },
  {
    id: "seed-2", author: "nadia", sign: "scorpio sun", space: "astrology", likes: 19, minutesAgo: 41,
    content: "leo szn has me wanting to be seen so badly it's almost embarrassing. anyone else feeling the pull to post more, launch more, take up space?",
    comments: [
      { author: "gigi", content: "yes. my rising is leo and this week has been unhinged in the best way", minutesAgo: 30 },
    ],
  },
  {
    id: "seed-3", author: "priya", sign: "capricorn sun", space: "business", likes: 27, minutesAgo: 68,
    content: "reminder that raising your prices is not a personality flaw. dropped my rate card, added 40 percent, nobody blinked.",
    comments: [
      { author: "tasha", content: "the nobody blinked part is everything", minutesAgo: 55 },
      { author: "dani", content: "saving this. renewals are next month and i've been scared to move", minutesAgo: 22 },
    ],
  },
  {
    id: "seed-4", author: "elle", sign: "libra sun", space: "mce", likes: 22, minutesAgo: 95,
    content: "wore the outfit i was saving for a special occasion to a tuesday coffee. i am the special occasion.",
    comments: [
      { author: "maya", content: "framing this", minutesAgo: 80 },
    ],
  },
  {
    id: "seed-5", author: "chloe", sign: "gemini sun", space: "general", likes: 15, minutesAgo: 130,
    content: "monday check in: what is the one brave thing you're doing this week? mine is finally emailing the podcast i want to be on.",
    comments: [
      { author: "farah", content: "pitching a talk at a conference i've only ever attended. terrified.", minutesAgo: 110 },
      { author: "remi", content: "hard launching my new offer. no soft anything.", minutesAgo: 61 },
    ],
  },
  {
    id: "seed-6", author: "tasha", sign: "leo sun", space: "wins", likes: 41, minutesAgo: 190,
    content: "three months ago i couldn't say my rate out loud without my voice shaking. today i said it, held the silence, and got a yes.",
    comments: [
      { author: "nadia", content: "the holding the silence part is where the money is", minutesAgo: 150 },
      { author: "bianca", content: "@tasha proud of you, genuinely", minutesAgo: 88 },
    ],
  },
  {
    id: "seed-7", author: "farah", sign: "pisces sun", space: "bookclub", likes: 11, minutesAgo: 240,
    content: "halfway through this szn's pick and the chapter on visibility wrecked me in the best way. who else is reading along?",
    comments: [
      { author: "chloe", content: "just started it last night, already dog-earing everything", minutesAgo: 200 },
    ],
  },
  {
    id: "seed-8", author: "remi", sign: "sagittarius sun", space: "business", likes: 18, minutesAgo: 310,
    content: "launched today. 6 sales in the first hour. for anyone waiting to feel ready: you launch to become ready, not the other way round.",
    comments: [
      { author: "priya", content: "6 in an hour is not small, congratulations", minutesAgo: 260 },
    ],
  },
  {
    id: "seed-9", author: "bianca", sign: "taurus sun", space: "mce", likes: 25, minutesAgo: 420,
    content: "stopped shrinking in meetings this week. took up the whole thought, finished the whole sentence, no apology tacked on the end.",
    comments: [
      { author: "elle", content: "the no apology on the end. we are healing.", minutesAgo: 360 },
    ],
  },
  {
    id: "seed-10", author: "gigi", sign: "aquarius sun", space: "challenges", likes: 13, minutesAgo: 540,
    content: "day 4 of this szn's challenge done. posting the win here so i can't quietly quit. accountability, i choose you.",
    comments: [
      { author: "maya", content: "in it with you, day 4 too", minutesAgo: 480 },
    ],
  },
  {
    id: "seed-11", author: "dani", sign: "virgo sun", space: "astrology", likes: 16, minutesAgo: 700,
    content: "the leo new moon last week actually shifted something. set one loud, specific intention instead of my usual tidy little list. recommend.",
    comments: [],
  },
  {
    id: "seed-12", author: "kayla", sign: "cancer sun", space: "general", likes: 20, minutesAgo: 900,
    content: "new here and slightly nervous to post but this space already feels different. hi, i'm building a studio and refusing to dim for it.",
    comments: [
      { author: "tasha", content: "welcome, you're already doing it by posting. we cheer loudly here.", minutesAgo: 840 },
      { author: "remi", content: "@kayla hi! studio owner too, this room gets it", minutesAgo: 700 },
    ],
  },
];

function buildSeedPosts(): Post[] {
  return SEED_POSTS.map((s) => ({
    id: s.id,
    author: s.author,
    sign: s.sign,
    space: s.space,
    content: s.content,
    likes: s.likes,
    liked: false,
    timeAgo: timeAgoFromMinutes(s.minutesAgo),
    comments: s.comments.map((c, i) => ({
      id: `${s.id}-c${i}`,
      author: c.author,
      content: c.content,
      timeAgo: timeAgoFromMinutes(c.minutesAgo),
    })),
  }));
}

// Merges the starter posts in, keeping real posts and seeds interleaved by recency so the feed
// reads as one continuous conversation. Real posts win ties. Seeds never overwrite a real post id.
function withSeeds(real: Post[]): Post[] {
  const realIds = new Set(real.map((p) => p.id));
  const seeds = buildSeedPosts().filter((s) => !realIds.has(s.id));
  const minutesOf = (p: Post): number => {
    const m = /^(\d+)([mhd])$/.exec(p.timeAgo);
    if (!m) return 0; // "now"
    const n = Number(m[1]);
    return m[2] === "m" ? n : m[2] === "h" ? n * 60 : n * 1440;
  };
  return [...real, ...seeds].sort((a, b) => minutesOf(a) - minutesOf(b));
}

export async function loadPosts(): Promise<Post[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: postRows }, { data: likeRows }, { data: commentRows }] = await Promise.all([
    supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
    supabase.from("community_likes").select("*"),
    supabase.from("community_comments").select("*").order("created_at", { ascending: true }),
  ]);

  return (postRows || []).map((row) => {
    const likesForPost = (likeRows || []).filter((l) => l.post_id === row.id);
    return {
      id: row.id,
      author: row.author,
      sign: row.sign,
      space: row.space,
      content: row.content,
      likes: likesForPost.length,
      liked: !!user && likesForPost.some((l) => l.user_id === user.id),
      timeAgo: timeAgoFromIso(row.created_at),
      comments: (commentRows || [])
        .filter((c) => c.post_id === row.id)
        .map((c) => ({ id: c.id, author: c.author, content: c.content, timeAgo: timeAgoFromIso(c.created_at) })),
    };
  });
}

export async function addPost(author: string, sign: string, space: string, content: string): Promise<Post[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return loadPosts();
  await supabase.from("community_posts").insert({
    id: `${Date.now()}`,
    user_id: user.id,
    author,
    sign,
    space,
    content,
  });
  // Counts as her first-run "post in a room" step, same as a chat message does.
  markActivationStep("room");
  return loadPosts();
}

export async function toggleLike(postId: string, currentlyLiked: boolean): Promise<Post[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return loadPosts();
  if (currentlyLiked) {
    await supabase.from("community_likes").delete().eq("post_id", postId).eq("user_id", user.id);
  } else {
    await supabase.from("community_likes").upsert({ post_id: postId, user_id: user.id });
  }
  return loadPosts();
}

export async function addComment(postId: string, author: string, content: string): Promise<Post[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return loadPosts();
  await supabase.from("community_comments").insert({
    id: `${Date.now()}`,
    post_id: postId,
    user_id: user.id,
    author,
    content,
  });
  return loadPosts();
}

// Moderation: removes a post entirely, for admin use.
export async function deletePost(postId: string): Promise<Post[]> {
  const supabase = createClient();
  await supabase.from("community_posts").delete().eq("id", postId);
  return loadPosts();
}

// Moderation: removes a single comment from a post without touching the rest of it.
export async function deleteComment(postId: string, commentId: string): Promise<Post[]> {
  void postId;
  const supabase = createClient();
  await supabase.from("community_comments").delete().eq("id", commentId);
  return loadPosts();
}
