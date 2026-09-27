"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import DirectThread, { type ThreadMessage } from "@/components/DirectThread";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const SEND_ERRORS: Record<string, string> = {
  slow_down: "You've sent loads in the last hour, my love. Give it a little bit and send the rest after.",
  too_long: "That one's a little long for a single message, split it in two for me.",
};

// A member's private line to Betty. Everything goes through /api/messages, which only ever returns
// her own thread.
export default function MessagesPage() {
  const { member, ready } = useMember();
  const [messages, setMessages] = useState<ThreadMessage[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/messages", { cache: "no-store" });
      if (!r.ok) {
        setUnavailable(true);
        return;
      }
      const d = await r.json();
      setUnavailable(false);
      setMessages(d.messages ?? []);
    } catch {
      setUnavailable(true);
    }
  }, []);

  useEffect(() => {
    if (!member) return;
    load();
    // Betty's reply turns up without a refresh while the page is open.
    const t = setInterval(() => document.visibilityState === "visible" && load(), 20000);
    return () => clearInterval(t);
  }, [member, load]);

  const send = async (body: string): Promise<boolean> => {
    setError(null);
    try {
      const r = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(SEND_ERRORS[d.error] ?? "That didn't send, give it another go in a sec.");
        return false;
      }
      setMessages((prev) => [...(prev ?? []), d.message]);
      return true;
    } catch {
      setError("That didn't send, give it another go in a sec.");
      return false;
    }
  };

  if (!ready) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>members only, babe.</h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 14 }}>
            just you and me 💌
          </div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.04, color: "#fff", textTransform: "lowercase" }}>
            message <span className="pk">betty.</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, maxWidth: 560, marginTop: 14 }}>
            This comes straight to me, privately, and I read every single one. Ask me anything about
            your chart, tell me what this szn is bringing up for you, or just say hiiii. I&apos;ll reply
            right here and you&apos;ll get a little ping when I do.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          {unavailable ? (
            <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7 }}>
              Messages are just being switched on, check back in a little bit. In the meantime you can always find me in the{" "}
              <Link href="/community/room/general" style={{ color: "var(--pink)", fontWeight: 700 }}>general chat</Link>.
            </p>
          ) : messages === null ? (
            <p style={{ fontSize: 14, color: "var(--grey)" }}>loading your messages...</p>
          ) : (
            <DirectThread
              messages={messages}
              otherName="betty"
              emptyText="No messages yet. Say hiiii, tell me your Big 3, or ask me the thing you've been wondering about. 💗"
              placeholder="write to betty..."
              onSend={send}
              error={error}
            />
          )}
        </div>
      </section>
    </>
  );
}
