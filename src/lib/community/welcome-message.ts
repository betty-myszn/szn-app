import type { createAdminClient } from "@/lib/supabase/admin";
import { sendMemberNotifications } from "@/lib/notify/send";

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

/** The space the welcome lands in: general chat, not a topic or sign room. */
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
 * The mention token for a member when other members share her first name.
 *
 * "@Sarah" is the right way to greet a Sarah, right up until there are three of them and the room
 * cannot tell which one was welcomed, and the mention links to somebody else's profile. In that
 * case her whole name is used instead, joined up because a mention cannot contain a space.
 */
export function fullMentionTokenFor(name: string | null | undefined): string | null {
  const cleaned = (name ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .join("");
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Picks each member's mention, using her first name where that is unambiguous and her full name
 * where it is not. `allNames` is every display name in the app, because the clash that matters is
 * with any member at all, not only with the others being welcomed in the same message.
 */
export function resolveMentionTokens(
  members: readonly { id: string; name: string | null }[],
  allNames: readonly (string | null)[]
): Map<string, string> {
  const firstNameCounts = new Map<string, number>();
  for (const name of allNames) {
    const token = mentionTokenFor(name)?.toLowerCase();
    if (token) firstNameCounts.set(token, (firstNameCounts.get(token) ?? 0) + 1);
  }

  const resolved = new Map<string, string>();
  for (const member of members) {
    const first = mentionTokenFor(member.name);
    if (!first) continue;
    const shared = (firstNameCounts.get(first.toLowerCase()) ?? 0) > 1;
    const token = shared ? fullMentionTokenFor(member.name) ?? first : first;
    resolved.set(member.id, token);
  }
  return resolved;
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
  "welcome to my sznnnn babes 💜🪩 {names} we are so happy you're here. Give us your Big 3, and tell us what got you into astrology 👀",
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
 * Posts the day's welcome for one group, notifies exactly the people it named, and marks them
 * welcomed.
 *
 * The notifications are inserted here by user id rather than left to the notify_on_chat_mention
 * trigger, which was the first design and was wrong. A mention has to be written as a first name,
 * "@Sarah", while the trigger can only match text against whatever is in profiles.name. So a member
 * called "Sarah Elizabeth" was never notified about her own welcome, and two unrelated members who
 * happen to be called "Sarah" both were. Here we already know precisely who the message is about,
 * so guessing from a string is not just unnecessary, it is the bug. The trigger stays for
 * member-to-member mentions, where a name really is all anyone has to go on, and it now skips these
 * automated posts so nobody is notified twice.
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

  // Every display name in the app, so a first name that clashes with ANY member (not only with the
  // others in this message) is written out in full instead. Three Sarahs and a "@Sarah" leaves the
  // room unable to tell who was welcomed, and links the mention to the wrong profile.
  const { data: allProfiles } = await admin.from("profiles").select("name");
  const tokenById = resolveMentionTokens(
    members,
    (allProfiles ?? []).map((r) => (r.name as string | null) ?? null)
  );

  const named = members.filter((m) => tokenById.has(m.id));
  const tokens = named.map((m) => tokenById.get(m.id) as string);
  const content = groupWelcomeMessage(tokens, seed);

  if (!content) {
    // Everyone in this group had an unusable name. Nothing worth posting, but they must still be
    // marked or the same dead batch is reconsidered tomorrow and every day after.
    await markWelcomed(admin, members.map((m) => m.id));
    return { status: "skipped", reason: "no_usable_names" };
  }

  // Posted into the general chat room (chat_messages, /community/room/general). That is the room
  // Betty means by "the chat", and it is where a welcome belongs: a conversation someone can reply
  // into, rather than a post on the feed.
  //
  // The id is a text column the client fills with Date.now(), which collides the moment two
  // messages land in the same millisecond. Keyed on the first member instead: unique because a
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

  // One call, one system: the bell and the email both come from the same event, addressed by user
  // id so neither can reach the wrong Sarah or miss the right one.
  await sendMemberNotifications(
    admin,
    named.map((m) => ({
      userId: m.id,
      kind: "welcome" as const,
      title: `${sender.name} welcomed you in the chat`,
      body: content,
      link: `/community/room/${WELCOME_SPACE_ID}`,
      actor: sender.name,
      email: true,
      emailSubject: "you got welcomed into MY SZN 💜",
      emailCta: "GO SAY HI",
    }))
  );
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
