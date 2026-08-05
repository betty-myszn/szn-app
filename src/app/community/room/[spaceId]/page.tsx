"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { hasRoomAccess, hasPaidCommunityAccess } from "@/lib/membership-access";
import { SPACES, SIGN_ROOMS, findRoom, isRitualSpace } from "@/lib/community-store";
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
const COMPOSE_EMOJIS = [
  "😊", "😂", "🥹", "😍", "🔥", "✨", "👑", "💅", "🙌", "👏",
  "💖", "💯", "🥳", "😭", "🙏", "😮", "🌙", "☀️", "⭐", "🦁",
  "🐍", "🐐", "🦂", "🌸",
];

// Render @mentions in brand pink
function renderContent(text: string) {
  const parts = text.split(/(@[a-z0-9_]+)/gi);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} style={{ color: "var(--pink)", fontWeight: 700 }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const space = findRoom(params.spaceId);

  useEffect(() => {
    if (!space) return;
    loadRoomMessages(space.id).then(setMessages);
    markRoomSeen(space.id);
  }, [space?.id]);

  useEffect(() => {
    if (!space) return;
    const others = [...SPACES, ...SIGN_ROOMS].filter((s) => s.id !== space.id);
    Promise.all(others.map(async (s) => [s.id, await hasUnread(s.id)] as const)).then((entries) => {
      setUnreadMap(Object.fromEntries(entries));
    });
  }, [space?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // @mention autocomplete: matches a trailing "@partial" at the end of the draft
  const mentionMatch = draft.match(/@(\w*)$/);
  const roomMembers = useMemo(() => getRoomMembers(messages), [messages]);
  const mentionCandidates = mentionMatch
    ? roomMembers.filter((m) => m.toLowerCase().startsWith(mentionMatch[1].toLowerCase())).slice(0, 5)
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
            The open chat rooms are yours to keep. Book club, seasonal challenges and events come with MY SZN, $111 a month.
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const updated = await addRoomMessage(space.id, member.name.toLowerCase(), draft.trim());
    setMessages(updated);
    setDraft("");
    setShowComposeEmoji(false);
  };

  const insertEmoji = (emoji: string) => {
    setDraft((prev) => `${prev}${emoji}`);
    inputRef.current?.focus();
  };

  const pickMention = (name: string) => {
    setDraft((prev) => prev.replace(/@(\w*)$/, `@${name} `));
    inputRef.current?.focus();
  };

  const handleReact = async (messageId: string, emoji: string) => {
    const updated = await toggleReaction(space.id, messageId, emoji, member.name.toLowerCase());
    setMessages(updated);
    setReactionPickerFor(null);
  };

  // Free members don't see the ritual rooms in the "other rooms" grid, matching what they can enter.
  const otherSpaces = SPACES.filter((s) => s.id !== space.id && (paidCommunity || !isRitualSpace(s.id)));
  const otherSignRooms = SIGN_ROOMS.filter((s) => s.id !== space.id);

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
        </div>
      </section>

      {/* Message list */}
      <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="flex flex-col gap-5 p-6 mb-4"
            style={{ border: "var(--border)", background: "#fafafa", minHeight: 360, maxHeight: 520, overflowY: "auto" }}
          >
            {messages.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--grey-light)" }}>No messages yet, be the first to say something.</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.author.toLowerCase() === member.name.toLowerCase();
                const reactionEntries = Object.entries(msg.reactions || {});
                return (
                  <div key={msg.id} className="flex" style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}>
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
                        }}
                      >
                        {renderContent(msg.content)}
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
                              style={{ position: "absolute", bottom: "120%", left: 0, background: "#fff", border: "var(--border)", zIndex: 10, whiteSpace: "nowrap" }}
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
                            </div>
                          )}
                        </div>
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
          {showComposeEmoji && (
            <div className="grid grid-cols-8 gap-1 p-3" style={{ border: "var(--border)", borderBottom: "none", background: "#fff" }}>
              {COMPOSE_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer", padding: 4 }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-0" style={{ border: "var(--border)" }}>
            <button
              type="button"
              onClick={() => setShowComposeEmoji((v) => !v)}
              style={{ padding: "0 14px", border: "none", borderRight: "var(--border)", background: showComposeEmoji ? "var(--lav-light)" : "#fff", cursor: "pointer", fontSize: 16 }}
              title="add an emoji"
            >
              😊
            </button>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`say something in ${space.label}... (type @ to mention)`}
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

      {/* Sign rooms */}
      <section className="px-5 md:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-4">sign rooms</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-0" style={{ border: "var(--border)" }}>
            {otherSignRooms.map((s, i) => (
              <button
                key={s.id}
                onClick={() => router.push(`/community/room/${s.id}`)}
                className="p-3 text-center hover:bg-[#fafafa] transition-colors relative"
                style={{
                  border: "none",
                  borderRight: (i + 1) % 6 !== 0 ? "1px solid #eee" : undefined,
                  borderBottom: i < otherSignRooms.length - 6 ? "1px solid #eee" : undefined,
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                {unreadMap[s.id] && (
                  <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: "var(--pink)" }} />
                )}
                <div style={{ fontSize: 16, marginBottom: 2 }}>{s.emoji}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--dark)", textTransform: "capitalize" }}>{s.id}</div>
              </button>
            ))}
          </div>

          {/* Free members: the rooms are open, everything else is an upgrade away. */}
          {!paidCommunity && (
            <div
              className="mt-8 p-5 flex items-center justify-between gap-4 flex-wrap"
              style={{ background: "var(--dark)", border: "var(--border)" }}
            >
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, maxWidth: 460 }}>
                The book club, the seasonal challenges, events and the new and full moon audios all open up in MY SZN ($111/mo), alongside your full personalised platform.
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
