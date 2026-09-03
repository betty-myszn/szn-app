import type { createAdminClient } from "@/lib/supabase/admin";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// The automatic "welcome to MY SZN" message posted into the main chat a few minutes after someone
// joins, from Betty's own profile, tagging the new member so she gets a notification and so the
// room has a live conversation in it rather than a wall of nothing.
//
// It asks the one question anybody in an astrology community can answer without thinking, which is
// the whole trick: a new member gets an easy first thing to say, and everyone else gets a placement
// to react to.

/** The room the welcome lands in: the general group chat, not a topic or sign room. */
export const WELCOME_SPACE_ID = "general";

/** How long after signup the welcome is held back. Long enough that it does not read as an
 *  automation firing in front of her, short enough that she is plausibly still looking. */
export const WELCOME_DELAY_MINUTES = 7;

/** Do not welcome accounts older than this. Without it, the first run after deploy would post a
 *  welcome for every member who ever joined, all at once, into the main chat. */
export const WELCOME_MAX_AGE_HOURS = 24;

/**
 * The mention token for a member. Chat mentions are matched as @[A-Za-z0-9_]+ by both the room's
 * renderer and the notification trigger, so anything else in a name (spaces, apostrophes, accents)
 * has to come off or the mention silently stops being a mention. First name only: "@Sarah" is how
 * a person greets someone, "@sarah.jones-smith" is how a database does.
 *
 * Returns null when nothing usable is left, e.g. a name that is entirely emoji, which is the cue
 * to skip the welcome rather than post "Hey @ 💜".
 */
export function mentionTokenFor(name: string | null | undefined): string | null {
  const firstWord = (name ?? "").trim().split(/\s+/)[0] ?? "";
  // Strip accents to their base letters first, so "Renée" mentions as "@Renee" rather than "@Ren".
  const cleaned = firstWord
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_]/g, "");
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * The welcomes. More than one because the same sentence appearing above every new member, forever,
 * is how a room announces that nobody is actually there. {name} is replaced with her own first
 * name as a live @mention.
 *
 * Every one of them ends on a question anyone can answer without thinking, which is the part that
 * does the work: she gets an easy first thing to say, and everyone else gets a placement to react
 * to. Keep that shape when adding more.
 */
export const WELCOME_VARIANTS: readonly string[] = [
  "Hey @{name} 💜 welcome to MY SZN, soooo happy you're here. What are your Big 3, and what made you fall in love with astrology? 👀🪩",
  "@{name} just walked in 💜 welcome babe. Drop your Big 3 for us, and tell us what got you into astrology in the first place 👀",
  "Everyone say hiiii to @{name} 🪩 so glad you're here. What's your Big 3, and what was the placement that made you go okay, this is REAL? 💜",
  "@{name} welcome to MY SZN 💜 we are so happy you found us. Give us your Big 3, and tell us what you're hoping this szn brings you 🪩",
  "New girl in the chat 🪩 @{name} welcome babeee. What are your Big 3, and what sent you down the astrology rabbit hole? 👀",
  "@{name} is in 💜 welcome, welcome. Tell us your Big 3, and the one thing about your chart you will never shut up about 👀🪩",
];

/**
 * Which welcome a given member gets. Derived from her user id rather than picked at random, so a
 * retry after a failure posts the same message it was always going to, and so the choice can
 * actually be tested. Sequential signups get different ids and land on different variants.
 */
export function welcomeVariantIndex(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return hash % WELCOME_VARIANTS.length;
}

/**
 * The message itself, with the member's first name as a live mention. userId picks which of the
 * welcomes she gets; without one it falls back to the first, which is what the copy previews use.
 */
export function welcomeMessageFor(name: string | null | undefined, userId?: string): string | null {
  const token = mentionTokenFor(name);
  if (!token) return null;
  const template = WELCOME_VARIANTS[userId ? welcomeVariantIndex(userId) : 0];
  return template.replace("{name}", token);
}

export interface WelcomeSender {
  id: string;
  name: string;
}

/**
 * Whose profile the welcome is posted from. Betty's, by email when COMMUNITY_WELCOME_SENDER_EMAIL
 * names her, otherwise the admin account. Returns null when there is nobody to post as, which stops
 * the run instead of posting from some arbitrary member's account.
 */
export async function findWelcomeSender(admin: SupabaseAdmin): Promise<WelcomeSender | null> {
  const configured = process.env.COMMUNITY_WELCOME_SENDER_EMAIL?.trim().toLowerCase();
  if (configured) {
    const { data } = await admin.from("profiles").select("id, name").eq("email", configured).maybeSingle();
    if (data?.id) return { id: data.id as string, name: ((data.name as string | null) || "Betty").trim() };
    console.error("community welcome: COMMUNITY_WELCOME_SENDER_EMAIL matches no profile", configured);
    return null;
  }

  const { data } = await admin
    .from("profiles")
    .select("id, name")
    .eq("is_admin", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!data?.id) return null;
  return { id: data.id as string, name: ((data.name as string | null) || "Betty").trim() };
}

export type WelcomeOutcome =
  | { status: "posted" }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

/**
 * Posts one welcome and marks the member welcomed. The mention notification is NOT sent from here:
 * inserting the message fires the notify_on_chat_mention trigger, which is the same path a member
 * gets when a human tags them, so there is one mechanism rather than a special case that can drift
 * away from the real one.
 *
 * community_welcomed_at is written even when the post itself was skipped for an unusable name, so a
 * member who can never be welcomed is not re-examined every five minutes forever.
 */
export async function postWelcomeMessage(
  admin: SupabaseAdmin,
  sender: WelcomeSender,
  member: { id: string; name: string | null }
): Promise<WelcomeOutcome> {
  const content = welcomeMessageFor(member.name, member.id);
  if (!content) {
    await markWelcomed(admin, member.id);
    return { status: "skipped", reason: "no_usable_name" };
  }

  // chat_messages.id is a text column the client fills with Date.now(), which collides the moment
  // two messages land in the same millisecond. A prefix keeps automated posts out of that race.
  const id = `welcome-${member.id}`;
  const { error } = await admin.from("chat_messages").insert({
    id,
    space_id: WELCOME_SPACE_ID,
    user_id: sender.id,
    author: sender.name,
    content,
  });

  if (error) {
    // A duplicate id means this member was already welcomed and the marking failed last time.
    // Nothing to re-post, so mark them and move on.
    if (error.code === "23505") {
      await markWelcomed(admin, member.id);
      return { status: "skipped", reason: "already_posted" };
    }
    return { status: "failed", error: error.message };
  }

  await markWelcomed(admin, member.id);
  return { status: "posted" };
}

async function markWelcomed(admin: SupabaseAdmin, userId: string): Promise<void> {
  const { error } = await admin
    .from("profiles")
    .update({ community_welcomed_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) console.error("community welcome: could not mark welcomed", userId, error.message);
}
