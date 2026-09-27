"use client";

import { useEffect, useRef, useState } from "react";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export interface ThreadMessage {
  id: string;
  body: string;
  createdAt: string;
  fromMe: boolean;
  read: boolean;
}

function when(iso: string): string {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  return sameDay
    ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// One private conversation: her messages on the right in pink, the other side on the left in white,
// and a composer that sends on the button or on cmd/ctrl + enter. Used by the member's /messages and
// by Betty's inbox, so both sides see the same thread the same way.
export default function DirectThread({
  messages,
  otherName,
  emptyText,
  placeholder,
  onSend,
  error,
}: {
  messages: ThreadMessage[];
  otherName: string;
  emptyText: string;
  placeholder: string;
  onSend: (body: string) => Promise<boolean>;
  error?: string | null;
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  const send = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    const ok = await onSend(body);
    setSending(false);
    if (ok) setDraft("");
  };

  return (
    <div>
      <div style={{ border: "var(--border)", background: "#fafafa", minHeight: 320, maxHeight: 520, overflowY: "auto", padding: 18 }}>
        {messages.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>{emptyText}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <div key={m.id} style={{ alignSelf: m.fromMe ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                {!m.fromMe && (
                  <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 3 }}>
                    {otherName}
                  </span>
                )}
                <div
                  style={{
                    background: m.fromMe ? "var(--pink)" : "#fff",
                    color: m.fromMe ? "#fff" : "var(--dark)",
                    border: m.fromMe ? "none" : "1px solid #eee",
                    padding: "10px 14px",
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {m.body}
                </div>
                <span style={{ display: "block", textAlign: m.fromMe ? "right" : "left", fontSize: 10, color: "var(--grey-light)", marginTop: 3 }}>
                  {when(m.createdAt)}
                  {m.fromMe && m.read ? " · seen" : ""}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="flex" style={{ border: "var(--border)", borderTop: "none", background: "#fff" }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={placeholder}
          maxLength={4000}
          rows={3}
          style={{ flex: 1, border: "none", outline: "none", resize: "vertical", padding: "14px 16px", fontSize: 14, lineHeight: 1.6, fontFamily: "inherit", minHeight: 72 }}
        />
        <button
          onClick={send}
          disabled={sending || !draft.trim()}
          style={{
            fontFamily: poppins,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0 26px",
            background: "var(--pink)",
            color: "#fff",
            border: "none",
            borderLeft: "var(--border)",
            cursor: sending || !draft.trim() ? "default" : "pointer",
            opacity: sending || !draft.trim() ? 0.6 : 1,
          }}
        >
          {sending ? "sending..." : "send"}
        </button>
      </div>
      {error && <p style={{ fontSize: 13, color: "var(--pink)", marginTop: 10, fontWeight: 600 }}>{error}</p>}
    </div>
  );
}
