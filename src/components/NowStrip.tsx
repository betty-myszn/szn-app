"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadRoomMessages, type ChatMessage } from "@/lib/chat-rooms";
import { upcomingWorkshops, formatWorkshopWhen, type Workshop } from "@/lib/workshops";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The two reasons members come back, at the top of the dashboard (24 Nov 2026 activity: the chat is
// the most revisited page, and the next live class sat 12 sections down). Next live class on the
// left, the latest two chat messages on the right, each one tap from the real thing.
export default function NowStrip() {
  const [next, setNext] = useState<Workshop | null>(null);
  const [msgs, setMsgs] = useState<ChatMessage[] | null>(null);

  useEffect(() => {
    setNext(upcomingWorkshops(Date.now()).find((w) => w.startIso) ?? null);
    loadRoomMessages("general")
      // Members' own voices first: a preview of only Betty reads like nobody else is in there.
      .then((m) => {
        const members = m.filter((x) => x.author.trim().toLowerCase() !== "betty");
        setMsgs((members.length > 0 ? members : m).slice(-2).reverse());
      })
      .catch(() => setMsgs([]));
  }, []);

  const card: React.CSSProperties = { border: "2px solid var(--dark)", borderRadius: 18, padding: "18px 20px", color: "var(--dark)", display: "flex", flexDirection: "column", gap: 8 };
  const eyebrow: React.CSSProperties = { fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" };
  const go: React.CSSProperties = { fontFamily: poppins, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)", marginTop: "auto" };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 12, marginBottom: 20 }}>
      <Link href="/events" className="no-underline holo-edge" style={{ ...card, background: "var(--pink-bg)" }}>
        <span style={eyebrow}>🕯️ next live with betty</span>
        {next ? (
          <>
            <span style={{ fontFamily: poppins, fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{next.title}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{formatWorkshopWhen(next.startIso!)} your time</span>
          </>
        ) : (
          <span style={{ fontFamily: poppins, fontSize: 17, fontWeight: 800 }}>the next date is landing soon, babe.</span>
        )}
        <span style={go}>save my seat →</span>
      </Link>
      <Link href="/community/room/general" className="no-underline holo-edge" style={{ ...card, background: "var(--lav-light)" }}>
        <span style={eyebrow}>💬 in the baddie chat</span>
        {msgs && msgs.length > 0 ? (
          msgs.map((m) => (
            <span key={m.id} style={{ fontSize: 14, lineHeight: 1.4 }}>
              <b style={{ fontFamily: poppins }}>{m.author.split(/\s+/)[0]}:</b> {m.content.length > 90 ? `${m.content.slice(0, 90)}...` : m.content}
            </span>
          ))
        ) : (
          <span style={{ fontSize: 15, fontWeight: 700 }}>The room is open. Go say hiii and tell us what you&apos;re calling in. 💜</span>
        )}
        <span style={go}>join the chat →</span>
      </Link>
    </div>
  );
}
