"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { EmojiStyle, type EmojiClickData } from "emoji-picker-react";
import { ALL_MENTION } from "@/lib/community/mention-tokens";
import { leapPostWindow } from "@/lib/quantum-leap";
import { useMember } from "@/lib/use-member";
import { hasRoomAccess, hasPaidCommunityAccess } from "@/lib/membership-access";
import { listedRooms, findRoom, isRitualSpace } from "@/lib/community-store";
import { useSeason } from "@/lib/use-season";
import {
  loadRoomMessages,
  addRoomMessage,
  toggleReaction,
  timeLabel,
  getRoomMembers,
  markRoomSeen,
  hasUnread,
  type ChatMessage,
} from "@/lib/chat-rooms";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🔥", "✨", "👑"];
// The full emoji set (search, categories, skin tones), loaded only when someone opens it so the room
// itself stays light. Native emoji, so nothing is fetched from an image CDN.
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <div style={{ padding: 16, fontSize: 12, color: "var(--dark)" }}>loading emojis...</div>,
});

function FullEmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <EmojiPicker
      onEmojiClick={(e: EmojiClickData) => onPick(e.emoji)}
      emojiStyle={EmojiStyle.NATIVE}
      width="100%"
      height={380}
      lazyLoadEmojis
      searchPlaceHolder="search every emoji..."
      previewConfig={{ showPreview: false }}
    />
  );
}

// Render @mentions as a link to that member's profile. Being tagged also raises a notification, so a
// mention is a real thing that happens to someone rather than text they had to be in the room to see.
//
// Colour follows the bubble. Her own messages sit on the brand pink, and a pink mention there was
// pink on pink: the welcome posts, which go out in Betty's name, showed her an empty gap where every
// new member's name should have been. On pink the mention is white and underlined instead.
// "@all" is not a person, so it is highlighted but not linked.
//
// Web addresses are clickable too (Betty's daily Quantum Leap posts link to the day's page). A link
// to this site opens in place; anything else opens in a new tab.
const URL_SPLIT = /(https?:\/\/[^\s]+)/g;
function renderContent(text: string, onPink: boolean) {
  const linkStyle = { color: onPink ? "#fff" : "var(--dark)", fontWeight: 800, textDecoration: "underline", textUnderlineOffset: 3, wordBreak: "break-all" as const };
  return text.split(URL_SPLIT).flatMap((chunk, c) => {
    if (!/^https?:\/\//.test(chunk)) return renderMentions(chunk, onPink, `t${c}`);
    const path = chunk.replace(/^https?:\/\/(www\.)?itsmyszn\.com/i, "");
    return path !== chunk && path.startsWith("/")
      ? [<Link key={`u${c}`} href={path} className="no-underline" style={linkStyle}>{chunk}</Link>]
      : [<a key={`u${c}`} href={chunk} target="_blank" rel="noopener noreferrer" style={linkStyle}>{chunk}</a>];
  });
}

function renderMentions(text: string, onPink: boolean, prefix: string) {
  const parts = text.split(/(@[a-z0-9_]+)/gi);
  const mentionStyle = onPink
    ? { color: "#fff", fontWeight: 800, textDecoration: "underline", textUnderlineOffset: 3 }
    : { color: "var(--pink)", fontWeight: 700 };
  return parts.map((part, i) => {
    const key = `${prefix}-${i}`;
    if (!part.startsWith("@")) return <span key={key}>{part}</span>;
    if (part.slice(1).toLowerCase() === ALL_MENTION) {
      return (
        <span key={key} style={{ ...mentionStyle, textDecoration: "none", background: onPink ? "rgba(255,255,255,0.22)" : "var(--pink-bg)", borderRadius: 6, padding: "0 5px" }}>
          {part}
        </span>
      );
    }
    return (
      <Link key={key} href={`/community/profile/${part.slice(1).toLowerCase()}`} className="no-underline" style={mentionStyle}>
        {part}
      </Link>
    );
  });
}

export default function ChatRoomPage() {
  const params = useParams<{ spaceId: string }>();
  const router = useRouter();
  const { member, ready } = useMember();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null);
  const [showComposeEmoji, setShowComposeEmoji] = useState(false);
  const [unreadMap, setUnreadMap] = useState<Record<string, boolean>>({});
  const [fullReactFor, setFullReactFor] = useState<ChatMessage | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendingRef = useRef(false);

  const season = useSeason();
  const space = findRoom(params.spaceId);

  useEffect(() => {
    if (!space) return;
    loadRoomMessages(space.id).then(setMessages);
    markRoomSeen(space.id);
    // Sag szn 2026: Betty's daily Quantum Leap post is written on the first visit after 8am UK, so
    // the main room asks for it and reloads once the server has had the chance to post it.
    if (space.id === "general" && leapPostWindow(Date.now())) {
      fetch("/api/quantum-leap?ping=1", { cache: "no-store" })
        .then((r) => (r.status === 204 ? loadRoomMessages(space.id).then(setMessages) : undefined))
        .catch(() => undefined);
    }
  }, [space?.id]);

  useEffect(() => {
    if (!space) return;
    const others = listedRooms(season.sign).filter((s) => s.id !== space.id);
    Promise.all(others.map(async (s) => [s.id, await hasUnread(s.id)] as const)).then((entries) => {
      setUnreadMap(Object.fromEntries(entries));
    });
    // season.sign is a dependency because the listed set includes this season's room, which changes
    // on the flip.
  }, [space?.id, season.sign]);

  // Scrolls the list (not the whole page) so the newest message sits in view.
  useEffect(() => {
    const el = bottomRef.current;
    const list = el?.parentElement;
    if (el && list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const byId = useMemo(() => new Map(messages.map((m) => [m.id, m])), [messages]);

  // @mention autocomplete: matches a trailing "@partial" at the end of the draft
  const mentionMatch = draft.match(/@(\w*)$/);
  const roomMembers = useMemo(() => getRoomMembers(messages), [messages]);
  // Admins also get "all", which tells every member (see /api/chat/send). Nobody else is offered it.
  const mentionPool = member?.isAdmin ? [ALL_MENTION, ...roomMembers] : roomMembers;
  const mentionCandidates = mentionMatch
    ? mentionPool.filter((m) => m.toLowerCase().startsWith(mentionMatch[1].toLowerCase())).slice(0, 5)
    : [];

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            members only, babe.
          </h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (!hasRoomAccess(member)) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            this room is members only.
          </h1>
          <Link href="/membership" className="btn-pink">see membership options</Link>
        </div>
      </section>
    );
  }

  const paidCommunity = hasPaidCommunityAccess(member);

  // A free member reaches the open rooms but not the ritual rooms (book club, seasonal challenges,
  // events). Those are the $33 programming, so she's shown an upgrade prompt instead of the chat.
  if (space && isRitualSpace(space.id) && !paidCommunity) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 440 }}>
          <div style={{ fontSize: 30, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            {space.label} is a members&apos; ritual.
          </h1>
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 20 }}>
            The open chat rooms are yours to keep. A private 1:1 with Betty every month, group coaching every season, plus your full personalised platform, come with MY SZN, $88 a month.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/membership" className="btn-pink">unlock the rituals</Link>
            <Link href="/community" className="no-underline" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>
              back to the rooms →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!space) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            we couldn&apos;t find that room.
          </h1>
          <Link href="/community" className="btn-pink">back to community</Link>
        </div>
      </section>
    );
  }

  // One send at a time, and the box empties the moment she taps, so a slow connection can't turn
  // extra taps into copies of the same message. The words come back if the post fails.
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sendingRef.current) return;
    sendingRef.current = true;
    const replyId = replyingTo?.id;
    setDraft("");
    setReplyingTo(null);
    setShowComposeEmoji(false);
    try {
      const before = messages.length;
      const updated = await addRoomMessage(space.id, member.name.toLowerCase(), text, replyId);
      setMessages(updated);
      if (!updated.some((m) => m.content === text) && updated.length <= before) setDraft(text);
    } catch {
      setDraft(text);
    } finally {
      sendingRef.current = false;
    }
  };

  const insertEmoji = (emoji: string) => {
    setDraft((prev) => `${prev}${emoji}`);
    inputRef.current?.focus();
  };

  const pickMention = (name: string) => {
    setDraft((prev) => prev.replace(/@(\w*)$/, `@${name} `));
    inputRef.current?.focus();
  };

  const startReply = (msg: ChatMessage) => {
    setReplyingTo(msg);
    setReactionPickerFor(null);
    inputRef.current?.focus();
  };

  // Tapping the quote in a reply jumps back up to the original and flashes it so she can see which one.
  const jumpTo = (id: string) => {
    const target = document.getElementById(`msg-${id}`);
    const list = target?.closest("[data-chat-list]") as HTMLElement | null;
    if (!target || !list) return;
    list.scrollTo({ top: target.offsetTop - list.offsetTop - 16, behavior: "smooth" });
    setFlashId(id);
    window.setTimeout(() => setFlashId((cur) => (cur === id ? null : cur)), 1600);
  };

  const snippet = (text: string) => (text.length > 120 ? `${text.slice(0, 120).trimEnd()}…` : text);

  const handleReact = async (messageId: string, emoji: string) => {
    const updated = await toggleReaction(space.id, messageId, emoji, member.name.toLowerCase());
    setMessages(updated);
    setReactionPickerFor(null);
    setFullReactFor(null);
  };

  // Free members don't see the ritual rooms in the "other rooms" grid, matching what they can enter.
  // Only the listed rooms appear: a retired room still opens by URL and keeps its history, it just
  // isn't somewhere we send anyone new.
  const otherSpaces = listedRooms(season.sign).filter((s) => s.id !== space.id && (paidCommunity || !isRitualSpace(s.id)));

  return (
    <>
      <section className="px-5 md:px-8 py-8" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/community"
            className="no-underline"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}
          >
            ← community
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <span style={{ fontSize: 26 }}>{space.emoji}</span>
            <div>
              <h1 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
                {space.label}
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{space.desc} · live room</p>
            </div>
          </div>
          {/* The rooms are public to members, so the private line is signposted from every one of them. */}
          <Link
            href={member?.isAdmin ? "/admin/messages" : "/messages"}
            className="no-underline"
            style={{ display: "inline-block", marginTop: 14, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}
          >
            {member?.isAdmin ? "💌 member messages →" : "💌 for anything private, message betty directly →"}
          </Link>
        </div>
      </section>

      {/* Message list */}
      <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div
            data-chat-list
            className="flex flex-col gap-5 p-6 mb-4"
            style={{ border: "var(--border)", background: "#fafafa", minHeight: 360, maxHeight: 520, overflowY: "auto", position: "relative" }}
          >
            {messages.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--grey-light)" }}>No messages yet, be the first to say something.</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.author.toLowerCase() === member.name.toLowerCase();
                const reactionEntries = Object.entries(msg.reactions || {});
                const original = msg.replyTo ? byId.get(msg.replyTo) : undefined;
                return (
                  <div key={msg.id} id={`msg-${msg.id}`} className="flex" style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "78%" }}>
                      {!isMe && (
                        <Link
                          href={`/community/profile/${msg.author}`}
                          className="no-underline"
                          style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 3, display: "block" }}
                        >
                          {msg.author}
                        </Link>
                      )}
                      <div
                        className="px-4 py-3"
                        style={{
                          background: isMe ? "var(--pink)" : "#fff",
                          color: isMe ? "#fff" : "var(--dark)",
                          border: isMe ? "none" : "1px solid #eee",
                          fontSize: 13,
                          lineHeight: 1.6,
                          outline: flashId === msg.id ? "3px solid var(--lav)" : "none",
                          outlineOffset: 2,
                          transition: "outline-color 0.3s",
                        }}
                      >
                        {msg.replyTo && (
                          <button
                            type="button"
                            onClick={() => original && jumpTo(original.id)}
                            className="block w-full text-left"
                            style={{
                              marginBottom: 8,
                              padding: "6px 10px",
                              background: isMe ? "rgba(0,0,0,0.12)" : "var(--lav-light)",
                              color: isMe ? "#fff" : "var(--dark)",
                              border: "none",
                              borderLeftWidth: 3,
                              borderLeftStyle: "solid",
                              borderLeftColor: isMe ? "#fff" : "var(--pink)",
                              cursor: original ? "pointer" : "default",
                              fontSize: 12,
                              lineHeight: 1.45,
                            }}
                          >
                            {original ? (
                              <>
                                <span style={{ display: "block", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                  ↩ {original.author.toLowerCase() === member.name.toLowerCase() ? "you" : original.author}
                                </span>
                                <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                  {snippet(original.content)}
                                </span>
                              </>
                            ) : (
                              <span style={{ fontStyle: "italic" }}>↩ replying to a message that was deleted</span>
                            )}
                          </button>
                        )}
                        {renderContent(msg.content, isMe)}
                      </div>

                      {/* Reactions */}
                      <div className="flex items-center gap-1 flex-wrap mt-1.5" style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}>
                        {reactionEntries.map(([emoji, authors]) => {
                          const iReacted = authors.includes(member.name.toLowerCase());
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReact(msg.id, emoji)}
                              style={{
                                fontSize: 11,
                                padding: "2px 7px",
                                border: iReacted ? "1.5px solid var(--pink)" : "1px solid #eee",
                                background: iReacted ? "rgba(255,45,135,0.08)" : "#fff",
                                cursor: "pointer",
                              }}
                            >
                              {emoji} {authors.length}
                            </button>
                          );
                        })}
                        <div style={{ position: "relative" }}>
                          <button
                            onClick={() => setReactionPickerFor(reactionPickerFor === msg.id ? null : msg.id)}
                            style={{ fontSize: 11, padding: "2px 6px", border: "1px solid #eee", background: "#fff", cursor: "pointer", color: "var(--grey-light)" }}
                          >
                            +
                          </button>
                          {reactionPickerFor === msg.id && (
                            <div
                              className="flex gap-1 p-2"
                              style={{ position: "absolute", bottom: "120%", ...(isMe ? { right: 0 } : { left: 0 }), background: "#fff", border: "var(--border)", zIndex: 10, whiteSpace: "nowrap" }}
                            >
                              {QUICK_REACTIONS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReact(msg.id, emoji)}
                                  style={{ fontSize: 16, background: "none", border: "none", cursor: "pointer", padding: 2 }}
                                >
                                  {emoji}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  setReactionPickerFor(null);
                                  setShowComposeEmoji(false);
                                  setFullReactFor(msg);
                                }}
                                title="every emoji"
                                style={{ fontSize: 11, fontWeight: 800, background: "var(--lav-light)", color: "var(--dark)", border: "none", cursor: "pointer", padding: "2px 8px", marginLeft: 2 }}
                              >
                                more
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => startReply(msg)}
                          title="reply to this message"
                          style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", border: "1px solid #eee", background: "#fff", cursor: "pointer", color: "var(--dark)" }}
                        >
                          ↩ reply
                        </button>
                      </div>

                      <div style={{ fontSize: 9, color: "var(--grey-light)", marginTop: 3, textAlign: isMe ? "right" : "left" }}>
                        {timeLabel(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Mention autocomplete dropdown */}
          {mentionCandidates.length > 0 && (
            <div className="flex gap-0 mb-0" style={{ border: "var(--border)", borderBottom: "none" }}>
              {mentionCandidates.map((name) => (
                <button
                  key={name}
                  onClick={() => pickMention(name)}
                  style={{ padding: "8px 14px", fontSize: 12, fontWeight: 700, background: "var(--lav-light)", border: "none", borderRight: "1px solid #fff", cursor: "pointer", color: "#3C2A70" }}
                >
                  @{name}
                </button>
              ))}
            </div>
          )}

          {/* Compose emoji picker */}
          {showComposeEmoji && !fullReactFor && (
            <div style={{ border: "var(--border)", borderBottom: "none", background: "#fff" }}>
              <FullEmojiPicker onPick={insertEmoji} />
            </div>
          )}

          {/* Reacting with any emoji: opens here under the chat rather than over a bubble, so it never
              hangs off the side of a phone screen. */}
          {fullReactFor && (
            <div style={{ border: "var(--border)", borderBottom: "none", background: "#fff" }}>
              <div className="flex items-center gap-3 px-4 py-2" style={{ background: "var(--lav-light)", color: "var(--dark)" }}>
                <div className="flex-1" style={{ minWidth: 0, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <strong style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>react to {fullReactFor.author.toLowerCase() === member.name.toLowerCase() ? "your message" : fullReactFor.author}:</strong>{" "}
                  {fullReactFor.content}
                </div>
                <button type="button" onClick={() => setFullReactFor(null)} aria-label="close" style={{ fontSize: 16, fontWeight: 700, background: "none", border: "none", cursor: "pointer", color: "var(--dark)", padding: 4 }}>
                  ✕
                </button>
              </div>
              <FullEmojiPicker onPick={(emoji) => handleReact(fullReactFor.id, emoji)} />
            </div>
          )}

          {/* Who she's replying to, sitting on top of the compose box until she sends or cancels. */}
          {replyingTo && (
            <div
              className="flex items-center gap-3 px-4 py-2"
              style={{ border: "var(--border)", borderBottom: "none", background: "var(--lav-light)", color: "var(--dark)" }}
            >
              <div className="flex-1" style={{ minWidth: 0, borderLeft: "3px solid var(--pink)", paddingLeft: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ↩ replying to {replyingTo.author.toLowerCase() === member.name.toLowerCase() ? "yourself" : replyingTo.author}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.45, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {replyingTo.content}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                aria-label="cancel reply"
                style={{ fontSize: 16, fontWeight: 700, background: "none", border: "none", cursor: "pointer", color: "var(--dark)", padding: 4 }}
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-0" style={{ border: "var(--border)" }}>
            <button
              type="button"
              onClick={() => {
                setFullReactFor(null);
                setShowComposeEmoji((v) => !v);
              }}
              style={{ padding: "0 14px", border: "none", borderRight: "var(--border)", background: showComposeEmoji ? "var(--lav-light)" : "#fff", cursor: "pointer", fontSize: 16 }}
              title="add an emoji"
            >
              😊
            </button>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && replyingTo) setReplyingTo(null);
              }}
              placeholder={replyingTo ? `reply to ${replyingTo.author.toLowerCase() === member.name.toLowerCase() ? "yourself" : replyingTo.author}...`: `say something in ${space.label}... (type @ to mention)`}
              className="flex-1"
              style={{ border: "none", outline: "none", padding: "14px 16px", fontSize: 14 }}
            />
            <button type="submit" className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
              send
            </button>
          </form>
        </div>
      </section>

      {/* Other rooms */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-4">other rooms</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "var(--border)" }}>
            {otherSpaces.map((s, i) => (
              <button
                key={s.id}
                onClick={() => router.push(`/community/room/${s.id}`)}
                className="p-4 text-center hover:bg-[#fafafa] transition-colors relative"
                style={{
                  border: "none",
                  borderRight: (i + 1) % 4 !== 0 ? "1px solid #eee" : undefined,
                  borderBottom: i < otherSpaces.length - 4 ? "1px solid #eee" : undefined,
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                {unreadMap[s.id] && (
                  <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "var(--pink)" }} />
                )}
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--dark)" }}>{s.label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Free members: the rooms are open, everything else is an upgrade away. */}
          {!paidCommunity && (
            <div
              className="mt-8 p-5 flex items-center justify-between gap-4 flex-wrap"
              style={{ background: "var(--dark)", border: "var(--border)" }}
            >
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, maxWidth: 460 }}>
                A private 1:1 with Betty every month and group coaching every season open up in MY SZN, alongside your full personalised platform.
              </p>
              <Link href="/membership" className="btn-pink" style={{ whiteSpace: "nowrap" }}>
                unlock the rituals
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
