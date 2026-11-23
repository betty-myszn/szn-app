"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { HELP_TOPICS, searchHelp, type HelpAnswer } from "@/lib/help-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const HELP_MAIL = "mailto:hello@thecosmicco.com?subject=Help%20with%20MY%20SZN";

// /help: the Ask Us box on top, every answer grouped by topic underneath.
//
// The Ask Us box searches the answers as she types (plain word matching, see searchHelp). If none
// of them help, "send it to betty" posts her question into her private thread with Betty through
// /api/messages, so it lands in Betty's member inbox with a notification and Betty's reply pings
// her back in the app. Signed out, it falls back to email.

function AnswerCard({ answer, open, onToggle }: { answer: HelpAnswer; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ border: "var(--border)", background: "#fff" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4"
        style={{ padding: "16px 18px", background: "none", border: "none", textAlign: "left", cursor: "pointer", color: "var(--dark)" }}
      >
        <span style={{ fontFamily: poppins, fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>{answer.q}</span>
        <span aria-hidden style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, color: "var(--pink)", flexShrink: 0 }}>{open ? "–" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 18px" }}>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)" }}>{answer.a}</p>
          {answer.link && (
            <Link
              href={answer.link.href}
              className="no-underline"
              style={{ display: "inline-block", marginTop: 12, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}
            >
              {answer.link.label} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function HelpClient() {
  const { member, ready } = useMember();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = useMemo(() => (query.trim().length >= 3 ? searchHelp(query) : []), [query]);
  const typed = query.trim().length >= 3;
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const sendToBetty = async () => {
    const q = query.trim();
    if (!q) return;
    setSending(true);
    setError(null);
    try {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: `🆘 Help question: ${q}` }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(
          d.error === "slow_down"
            ? "You've sent loads in the last hour, my love. Give it a little bit and try again."
            : d.error === "too_long"
              ? "That one's a little long, trim it down for me and send again."
              : "That didn't send, give it another go in a sec."
        );
        return;
      }
      setSent(true);
    } catch {
      setError("That didn't send, give it another go in a sec.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 14 }}>
            help 💗
          </div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.04, color: "#fff", textTransform: "lowercase" }}>
            ask <span className="pk">us.</span>
          </h1>
          <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.8, maxWidth: 560, marginTop: 14 }}>
            Type your question and the answer pops up right here. If it doesn&apos;t, send it straight to me and I&apos;ll
            reply personally, you&apos;ll get a little ping when I do.
          </p>

          {/* The Ask Us box */}
          <div style={{ marginTop: 26, background: "#fff", border: "var(--border)", padding: 16 }}>
            {sent ? (
              <div style={{ color: "var(--dark)" }}>
                <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, marginBottom: 6 }}>sent, my love 💌</p>
                <p style={{ fontSize: 14, lineHeight: 1.75 }}>
                  It&apos;s in my inbox. I&apos;ll reply in your messages and you&apos;ll get a ping in the app and by email.
                </p>
                <div className="flex gap-3 flex-wrap" style={{ marginTop: 14 }}>
                  <Link href="/messages" className="btn-pink no-underline">see my messages</Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setQuery("");
                    }}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark)", textDecoration: "underline" }}
                  >
                    ask something else
                  </button>
                </div>
              </div>
            ) : (
              <>
                <label htmlFor="ask-us" style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)", marginBottom: 8 }}>
                  what do you need help with?
                </label>
                <textarea
                  id="ask-us"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={2}
                  maxLength={4000}
                  placeholder="e.g. where's the replay from the last workshop"
                  style={{ width: "100%", border: "var(--border)", padding: "12px 14px", fontSize: 15, lineHeight: 1.5, color: "var(--dark)", resize: "vertical", fontFamily: "inherit" }}
                />

                {typed && matches.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)", marginBottom: 8 }}>
                      this might be it 👇
                    </p>
                    <div className="flex flex-col gap-2">
                      {matches.map((a) => (
                        <AnswerCard key={a.id} answer={a} open={openId === `m-${a.id}`} onToggle={() => toggle(`m-${a.id}`)} />
                      ))}
                    </div>
                  </div>
                )}

                {typed && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--lav)" }}>
                    <p style={{ fontSize: 14, color: "var(--dark)", marginBottom: 10, fontWeight: 600 }}>
                      {matches.length > 0 ? "Not quite it? Send it to me and I'll answer you myself." : "Send it to me and I'll answer you myself."}
                    </p>
                    {!ready ? null : member ? (
                      <button type="button" onClick={sendToBetty} disabled={sending} className="btn-pink" style={{ opacity: sending ? 0.6 : 1 }}>
                        {sending ? "sending..." : "send it to betty 💌"}
                      </button>
                    ) : (
                      <a href={HELP_MAIL} className="btn-pink no-underline">email us 💌</a>
                    )}
                    {error && <p style={{ fontSize: 13, color: "var(--dark)", fontWeight: 700, marginTop: 10 }}>{error}</p>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Every answer, by topic */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--lav-light)" }}>
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          {HELP_TOPICS.map((topic) => (
            <div key={topic.id}>
              <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", color: "var(--dark)", marginBottom: 14, textTransform: "lowercase" }}>
                <span aria-hidden>{topic.emoji}</span> {topic.title}
              </h2>
              <div className="flex flex-col gap-2">
                {topic.answers.map((a) => (
                  <AnswerCard key={a.id} answer={a} open={openId === a.id} onToggle={() => toggle(a.id)} />
                ))}
              </div>
            </div>
          ))}

          <div style={{ border: "var(--border)", background: "var(--dark)", padding: 22 }}>
            <p style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>still stuck, babe?</p>
            <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.75, marginBottom: 14 }}>
              Message me and I&apos;ll sort it with you personally.
            </p>
            {member ? (
              <Link href="/messages" className="btn-pink no-underline">message betty</Link>
            ) : (
              <a href={HELP_MAIL} className="btn-pink no-underline">email hello@thecosmicco.com</a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
