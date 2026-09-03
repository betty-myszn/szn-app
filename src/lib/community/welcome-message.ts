import type { createAdminClient } from "@/lib/supabase/admin";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// The automatic "welcome to MY SZN" post in the main chat, from Betty's own profile, tagging every
// member who joined that day so each of them gets a notification and the room has a live
// conversation in it rather than a wall of nothing.
//
// ONE post a day, naming everyone, rather than one post per arrival. A run of near-identical
// greetings stacked up the room reads as a bot working through a list, where a single "look who
// joined us today" reads as a room with people in it. It also gives the new members someone to
// answer alongside instead of each of them replying into silence on their own.
//
// It asks the one question anybody in an astrology community can answer without thinking, which is
// the whole trick: a new member gets an easy first thing to say, and everyone else gets a placement
// to react to.

/** The room the welcome lands in: the general group chat, not a topic or sign room. */
export const WELCOME_SPACE_ID = "general";

/** Minimum age before someone is named. Only there so an account still mid-signup when the daily
 *  run fires is picked up by tomorrow's instead of being announced half-made. */
export const WELCOME_DELAY_MINUTES = 5;

/** Do not welcome accounts older than this. Comfortably more than a day, so a run missed to an
 *  outage still catches yesterday's joiners, while the first run after deploy cannot post a welcome
 *  for every member who ever joined. */
export const WELCOME_MAX_AGE_HOURS = 48;

/** Most mentions in one message. Beyond this the run posts a second message rather than dropping
 *  anyone, because a member who was silently skipped is never coming back round. */
export const WELCOME_NAMES_PER_MESSAGE = 15;

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
 * The group welcomes, used whenever more than one person joined that day. {names} becomes the whole
 * list as live mentions. Same rule as the single ones: every variant keeps the Big 3 prompt, since
 * that is the part the room actually replies to.
 */
export const WELCOME_GROUP_VARIANTS: readonly string[] = [
  "Look who joined MY SZN today 💜 {names} we are soooo happy you're here. Give us your Big 3, and tell us what got you into astrology 👀🪩",
  "New besties in the chat 🪩 {names} welcome, welcome. Drop your Big 3 for us, and what made you fall in love with astrology? 💜",
  "Everyone say hiiii to {names} 💜 so glad you found us. What are your Big 3, and what's the placement you will never shut up about? 👀",
  "{names} just walked in 🪩 welcome babes. Tell us your Big 3, and what you're hoping this szn brings you 💜",
  "Fresh faces in here today 👀 {names} welcome to MY SZN. What are your Big 3, and what sent you down the astrology rabbit hole? 🪩",
];

/**
 * Which variant a given post gets. Derived from a seed rather than picked at random, so a retry
 * posts the message it was always going to post and the choice can actually be tested. The seed is
 * the day for a group post and the member's id for a solo one, so consecutive days and consecutive
 * members land on different wording.
 */
export function welcomeVariantIndex(seed: string, poolSize: number = WELCOME_VARIANTS.length): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % poolSize;
}

/**
 * The list of mentions as it reads in a sentence: "@Sarah", "@Sarah and @Priya", "@Sarah, @Priya
 * and @Jo". No serial comma, matching the app's en-GB copy everywhere else.
 */
export function formatMentionList(tokens: readonly string[]): string {
  const mentions = tokens.map((t) => `@${t}`);
  if (mentions.length <= 1) return mentions[0] ?? "";
  return `${mentions.slice(0, -1).join(", ")} and ${mentions[mentions.length - 1]}`;
}

/**
 * The message itself, with the member's first name as a live mention. seed picks which of the
 * welcomes she gets; without one it falls back to the first, which is what the copy previews use.
 */
export function welcomeMessageFor(name: string | null | undefined, seed?: string): string | null {
  const token = mentionTokenFor(name);
  if (!token) return null;
  const template = WELCOME_VARIANTS[seed ? welcomeVariantIndex(seed) : 0];
  return template.replace("{name}", token);
}

/**
 * The day's post. One name gets a solo welcome, because "look who joined today" reading out a list
 * of one is worse than just greeting her. Two or more get a group one.
 *
 * Tokens are de-duplicated: two members both called Sarah would otherwise render "@Sarah and
 * @Sarah", and the notification trigger reaches both of them from the single mention anyway.
 */
export function groupWelcomeMessage(tokens: readonly string[], seed: string): string | null {
  const unique = [...new Set(tokens)];
  if (unique.length === 0) return null;
  if (unique.length === 1) {
    const template = WELCOME_VARIANTS[welcomeVariantIndex(seed)];
    return template.replace("{name}", unique[0]);
  }
  const template = WELCOME_GROUP_VARIANTS[welcomeVariantIndex(seed, WELCOME_GROUP_VARIANTS.length)];
  return template.replace("{names}", formatMentionList(unique));
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
  | { status: "posted"; named: number }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

export interface WelcomeCandidate {
  id: string;
  name: string | null;
}

/** Splits the day's joiners into message-sized groups, so a big day posts two short messages
 *  rather than one unreadable wall of mentions, and nobody is dropped to make it fit. */
export function chunkForMessages<T>(items: readonly T[], size = WELCOME_NAMES_PER_MESSAGE): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Posts the day's welcome for one group and marks every member in it welcomed. The mention
 * notifications are NOT sent from here: inserting the message fires the notify_on_chat_mention
 * trigger, which is the same path a member gets when a human tags her, so there is one mechanism
 * rather than a special case that can drift away from the real one.
 *
 * Members whose name yields no usable mention are still marked welcomed, so someone who can never
 * be named is not re-examined every single day forever.
 */
export async function postWelcomeBatch(
  admin: SupabaseAdmin,
  sender: WelcomeSender,
  members: readonly WelcomeCandidate[],
  seed: string
): Promise<WelcomeOutcome> {
  if (members.length === 0) return { status: "skipped", reason: "nobody_due" };

  const named = members.filter((m) => mentionTokenFor(m.name) !== null);
  const tokens = named.map((m) => mentionTokenFor(m.name) as string);
  const content = groupWelcomeMessage(tokens, seed);

  if (!content) {
    // Everyone in this group had an unusable name. Nothing worth posting, but they must still be
    // marked or the same dead batch is reconsidered tomorrow and every day after.
    await markWelcomed(admin, members.map((m) => m.id));
    return { status: "skipped", reason: "no_usable_names" };
  }

  // chat_messages.id is a text column the client fills with Date.now(), which collides the moment
  // two messages land in the same millisecond. Keyed on the first member instead: unique because a
  // member is only ever in one batch, and it makes a re-run of the same day idempotent.
  const id = `welcome-${members[0].id}`;
  const { error } = await admin.from("chat_messages").insert({
    id,
    space_id: WELCOME_SPACE_ID,
    user_id: sender.id,
    author: sender.name,
    content,
  });

  if (error) {
    // A duplicate id means this group was already posted and the marking failed last time. Nothing
    // to re-post, so mark them and move on.
    if (error.code === "23505") {
      await markWelcomed(admin, members.map((m) => m.id));
      return { status: "skipped", reason: "already_posted" };
    }
    return { status: "failed", error: error.message };
  }

  await markWelcomed(admin, members.map((m) => m.id));
  return { status: "posted", named: named.length };
}

async function markWelcomed(admin: SupabaseAdmin, userIds: readonly string[]): Promise<void> {
  if (userIds.length === 0) return;
  const { error } = await admin
    .from("profiles")
    .update({ community_welcomed_at: new Date().toISOString() })
    .in("id", userIds as string[]);
  if (error) console.error("community welcome: could not mark welcomed", userIds.length, error.message);
}
