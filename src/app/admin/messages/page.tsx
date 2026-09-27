"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { isAdminMember } from "@/lib/member";
import DirectThread, { type ThreadMessage } from "@/components/DirectThread";

const poppins = "var(--font-poppins), Poppins, sans-serif";

interface Thread {
  memberId: string;
  name: string;
  lastBody: string;
  lastAt: string;
  lastFromMember: boolean;
  unread: number;
}

// Betty's inbox: every member who has written, newest first, and the thread she picks. A member's
// message notification links straight here with ?member=<id>.
export default function AdminMessagesPage() {
  return (
    <Suspense fallback={null}>
      <Inbox />
    </Suspense>
  );
}

function Inbox() {
  const { member, ready } = useMember();
  const router = useRouter();
  const selected = useSearchParams().get("member");
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [thread, setThread] = useState<{ messages: ThreadMessage[]; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const loadThreads = useCallback(async () => {
    const r = await fetch("/api/messages", { cache: "no-store" }).catch(() => null);
    if (!r || !r.ok) {
      setUnavailable(true);
      return;
    }
    setUnavailable(false);
    setThreads((await r.json()).threads ?? []);
  }, []);

  const loadThread = useCallback(async (memberId: string) => {
    const r = await fetch(`/api/messages?member=${encodeURIComponent(memberId)}`, { cache: "no-store" }).catch(() => null);
    if (!r || !r.ok) return;
    const d = await r.json();
    setThread({ messages: d.messages ?? [], name: d.memberName ?? "member" });
    // Opening it marked it read, so the list's unread count drops too.
    loadThreads();
  }, [loadThreads]);

  const admin = isAdminMember(member);

  useEffect(() => {
    if (!admin) return;
    loadThreads();
    const t = setInterval(() => document.visibilityState === "visible" && loadThreads(), 20000);
    return () => clearInterval(t);
  }, [admin, loadThreads]);

  useEffect(() => {
    if (!admin || !selected) {
      setThread(null);
      return;
    }
    loadThread(selected);
    const t = setInterval(() => document.visibilityState === "visible" && loadThread(selected), 20000);
    return () => clearInterval(t);
  }, [admin, selected, loadThread]);

  const reply = async (body: string): Promise<boolean> => {
    if (!selected) return false;
    setError(null);
    const r = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body, member: selected }) }).catch(() => null);
    if (!r || !r.ok) {
      setError("That reply didn't send, try again.");
      return false;
    }
    const d = await r.json();
    setThread((prev) => (prev ? { ...prev, messages: [...prev.messages, d.message] } : prev));
    loadThreads();
    return true;
  };

  if (!ready) return null;
  if (!admin) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>this page is just for betty.</h1>
          <Link href="/messages" className="btn-pink">message betty</Link>
        </div>
      </section>
    );
  }

  const totalUnread = (threads ?? []).reduce((n, t) => n + t.unread, 0);

  return (
    <>
      <section className="px-5 md:px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/admin" className="no-underline" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}>
            ← control room
          </Link>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 800, letterSpacing: "-1px", color: "#fff", marginTop: 14 }}>
            member <span className="pk">messages.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
            {totalUnread > 0 ? `${totalUnread} unread` : "all caught up"}
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          {unavailable ? (
            <div style={{ border: "var(--border)", background: "var(--pink-bg)", padding: 22 }}>
              <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 15, marginBottom: 8 }}>Messages need switching on in Supabase first.</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--grey)" }}>
                Open Supabase, go to SQL Editor, paste in the file <code>supabase/RUN-direct-messages.sql</code> and press Run. It&apos;s safe to run more than once.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
              <div style={{ border: "var(--border)", alignSelf: "start" }}>
                {threads === null ? (
                  <p style={{ padding: 16, fontSize: 13, color: "var(--grey)" }}>loading...</p>
                ) : threads.length === 0 ? (
                  <p style={{ padding: 16, fontSize: 13, color: "var(--grey)", lineHeight: 1.6 }}>No messages yet.</p>
                ) : (
                  threads.map((t, i) => (
                    <button
                      key={t.memberId}
                      onClick={() => router.push(`/admin/messages?member=${t.memberId}`)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "14px 16px",
                        background: t.memberId === selected ? "var(--lav-light)" : "#fff",
                        border: "none",
                        borderBottom: i < threads.length - 1 ? "1px solid #eee" : "none",
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span style={{ fontFamily: poppins, fontWeight: 800, fontSize: 14, color: "var(--dark)" }}>{t.name}</span>
                        {t.unread > 0 && (
                          <span style={{ background: "var(--pink)", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "2px 7px" }}>{t.unread}</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: "var(--grey)", marginTop: 4, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.lastFromMember ? "" : "you: "}
                        {t.lastBody}
                      </p>
                    </button>
                  ))
                )}
              </div>

              <div>
                {thread ? (
                  <>
                    <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>{thread.name}</p>
                    <DirectThread
                      messages={thread.messages}
                      otherName={thread.name.split(/\s+/)[0]?.toLowerCase() ?? "member"}
                      emptyText="No messages in this thread yet."
                      placeholder={`reply to ${thread.name.split(/\s+/)[0] ?? "her"}...`}
                      onSend={reply}
                      error={error}
                    />
                  </>
                ) : (
                  <p style={{ fontSize: 14, color: "var(--grey)", padding: "8px 0" }}>Pick a conversation to read and reply.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
