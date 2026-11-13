"use client";

import { useCallback, useEffect, useState } from "react";
import { useMember } from "@/lib/use-member";
import { isAdminMember } from "@/lib/member";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Who gave their email on the way to checkout and never paid. Rows are written by
// CheckoutEmailGate just before Stripe opens and marked paid by the Stripe webhook, so "left"
// means: reached Stripe with this email for this offer, no completed payment since.

interface Row { email: string; offer: string | null; page: string | null; checkout_url: string; attempts: number; created_at: string; last_started_at: string; paid_at: string | null }

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

export default function CheckoutDropoffsAdminPage() {
  const { member, ready } = useMember();
  const [rows, setRows] = useState<Row[]>([]);
  const [view, setView] = useState<"left" | "paid" | "all">("left");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/checkout-dropoffs");
    if (!res.ok) { setError(`Couldn't load the checkout list (${res.status})`); return; }
    setRows((await res.json()).rows);
  }, []);

  useEffect(() => { if (ready && isAdminMember(member)) load(); }, [ready, member, load]);

  if (!ready) return null;
  if (!isAdminMember(member)) return <div className="px-8 py-24 text-center">Not found.</div>;

  const left = rows.filter((r) => !r.paid_at);
  const paid = rows.filter((r) => r.paid_at);
  const q = search.trim().toLowerCase();
  const inView = view === "left" ? left : view === "paid" ? paid : rows;
  const shown = q ? inView.filter((r) => r.email.includes(q) || (r.offer ?? "").toLowerCase().includes(q)) : inView;
  const tabs: { key: typeof view; label: string; n: number }[] = [
    { key: "left", label: "Left without paying", n: left.length },
    { key: "paid", label: "Paid", n: paid.length },
    { key: "all", label: "Everyone", n: rows.length },
  ];

  return (
    <div className="px-5 md:px-8 py-10 max-w-6xl mx-auto" style={{ color: "var(--dark)" }}>
      <h1 style={{ fontFamily: poppins, fontSize: 32, fontWeight: 800 }}>Checkout drop-offs</h1>
      <p style={{ fontSize: 15, lineHeight: 1.55, marginTop: 8, maxWidth: 640 }}>
        Everyone who put their email in on the way to Stripe. Someone who started in the last hour may still be paying. Times are UK time.
      </p>
      <div className="flex flex-wrap gap-2" style={{ marginTop: 20 }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setView(t.key)} style={{ border: "var(--border)", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", background: view === t.key ? "var(--dark)" : "#fff", color: view === t.key ? "#fff" : "var(--dark)" }}>
            {t.label} · {t.n}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 18 }}>
        <input placeholder="search email or offer" value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: "var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 16, flex: "1 1 240px" }} />
        <a href="/api/admin/checkout-dropoffs?format=csv" className="no-underline" style={{ background: "var(--pink)", color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 20px" }}>
          export drop-offs csv
        </a>
      </div>
      {error && <p style={{ fontWeight: 700, marginTop: 16 }}>{error}</p>}
      <div style={{ overflowX: "auto", marginTop: 20, border: "var(--border)", borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--lav-light)", textAlign: "left" }}>
              {["Last started", "Email", "Offer", "From page", "Tries", "Status"].map((h) => <th key={h} style={{ padding: "10px 12px" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={`${r.email}-${r.checkout_url}`} style={{ borderTop: "1px solid #1a1a1a" }}>
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{when(r.last_started_at)}</td>
                <td style={{ padding: "10px 12px" }}><a href={`mailto:${r.email}`} style={{ color: "var(--dark)", fontWeight: 700 }}>{r.email}</a></td>
                <td style={{ padding: "10px 12px" }}>{r.offer ?? ""}</td>
                <td style={{ padding: "10px 12px" }}>{r.page ?? ""}</td>
                <td style={{ padding: "10px 12px" }}>{r.attempts}</td>
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap", fontWeight: 800 }}>{r.paid_at ? `Paid ${when(r.paid_at)}` : "Left"}</td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={6} style={{ padding: 20, textAlign: "center" }}>Nobody here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
