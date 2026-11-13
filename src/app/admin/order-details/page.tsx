"use client";

import { useCallback, useEffect, useState } from "react";
import { useMember } from "@/lib/use-member";
import { isAdminMember } from "@/lib/member";
import { britishDate } from "@/lib/format-date";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Paid reports and Baddie Sessions, and whether her birth details are in yet. "Waiting" means she
// has paid and not filled in /order/details; she is nudged automatically at 24 and 72 hours, and
// her personal link is here to copy into a message if you want to chase her yourself.

interface Row { stripe_session_id: string; email: string; name: string | null; offer: string; promises_48h: boolean; birth_date: string | null; birth_time: string | null; birth_time_unknown: boolean; birth_place: string | null; paid_at: string; submitted_at: string | null; reminders_sent: number; details_url: string }

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

export default function OrderDetailsAdminPage() {
  const { member, ready } = useMember();
  const [rows, setRows] = useState<Row[]>([]);
  const [view, setView] = useState<"waiting" | "in">("waiting");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/order-details");
    if (!res.ok) { setError(`Couldn't load the orders (${res.status})`); return; }
    setRows((await res.json()).rows);
  }, []);

  useEffect(() => { if (ready && isAdminMember(member)) load(); }, [ready, member, load]);

  if (!ready) return null;
  if (!isAdminMember(member)) return <div className="px-8 py-24 text-center">Not found.</div>;

  const waiting = rows.filter((r) => !r.submitted_at);
  const done = rows.filter((r) => r.submitted_at);
  const shown = view === "waiting" ? waiting : done;
  const cell = { padding: "10px 12px" } as const;

  return (
    <div className="px-5 md:px-8 py-10 max-w-6xl mx-auto" style={{ color: "var(--dark)" }}>
      <h1 style={{ fontFamily: poppins, fontSize: 32, fontWeight: 800 }}>Birth details for paid orders</h1>
      <p style={{ fontSize: 15, lineHeight: 1.55, marginTop: 8, maxWidth: 640 }}>
        Everyone who has paid for a report or a Baddie Session. Anyone waiting is nudged automatically 24 and 72 hours after paying. Times are UK time.
      </p>
      <div className="flex flex-wrap gap-2" style={{ marginTop: 20 }}>
        {([["waiting", "Paid, waiting on details", waiting.length], ["in", "Details in", done.length]] as const).map(([key, text, n]) => (
          <button key={key} onClick={() => setView(key)} style={{ border: "var(--border)", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", background: view === key ? "var(--dark)" : "#fff", color: view === key ? "#fff" : "var(--dark)" }}>
            {text} · {n}
          </button>
        ))}
      </div>
      {error && <p style={{ fontWeight: 700, marginTop: 16 }}>{error}</p>}
      <div style={{ overflowX: "auto", marginTop: 20, border: "var(--border)", borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--lav-light)", textAlign: "left" }}>
              {(view === "waiting" ? ["Paid", "Name", "Email", "Order", "Nudges sent", "Her link"] : ["Details in", "Name", "Email", "Order", "Born", "Time", "Place"]).map((h) => <th key={h} style={cell}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.stripe_session_id} style={{ borderTop: "1px solid #1a1a1a" }}>
                <td style={{ ...cell, whiteSpace: "nowrap" }}>{when(r.submitted_at ?? r.paid_at)}</td>
                <td style={cell}>{r.name ?? ""}</td>
                <td style={cell}><a href={`mailto:${r.email}`} style={{ color: "var(--dark)", fontWeight: 700 }}>{r.email}</a></td>
                <td style={cell}>{r.offer}</td>
                {view === "waiting" ? (
                  <>
                    <td style={cell}>{r.reminders_sent} of 2</td>
                    <td style={cell}>
                      <button onClick={() => { void navigator.clipboard.writeText(r.details_url); setCopied(r.stripe_session_id); }} style={{ border: "var(--border)", borderRadius: 999, background: "#fff", color: "var(--dark)", padding: "6px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                        {copied === r.stripe_session_id ? "copied" : "copy link"}
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ ...cell, whiteSpace: "nowrap" }}>{britishDate(r.birth_date)}</td>
                    <td style={cell}>{r.birth_time_unknown ? "not known" : r.birth_time}</td>
                    <td style={cell}>{r.birth_place}</td>
                  </>
                )}
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center" }}>Nobody here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
