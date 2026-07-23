import { ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "@/types/chart";
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
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
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
