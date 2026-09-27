// How a member's name becomes an @mention, and back again. Pure string work with no server imports,
// so the chat room and the profile page can share the exact rule the notifications use.

/** First name only, accents stripped: "Renée Smith" mentions as "@Renee". */
export function mentionTokenFor(name: string | null | undefined): string | null {
  const firstWord = (name ?? "").trim().split(/\s+/)[0] ?? "";
  // Strip accents to their base letters first, so "Renée" mentions as "@Renee" rather than "@Ren".
  const cleaned = firstWord
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9_\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .join("");
  return cleaned.length > 0 ? cleaned : null;
}

/** True when a mention or profile handle ("sarah", "sarahjones", "sarah jones") means this name. */
export function handleMatchesName(handle: string, name: string | null | undefined): boolean {
  const h = handle.trim().toLowerCase();
  if (!h || !name) return false;
  return (
    name.trim().toLowerCase() === h ||
    mentionTokenFor(name)?.toLowerCase() === h ||
    fullMentionTokenFor(name)?.toLowerCase() === h
  );
}

/** "@all" pings every member. Only an admin's message actually sends it; for anyone else it is text. */
export const ALL_MENTION = "all";
export function mentionsAll(content: string): boolean {
  return /(^|[^A-Za-z0-9_])@all\b/i.test(content);
}
