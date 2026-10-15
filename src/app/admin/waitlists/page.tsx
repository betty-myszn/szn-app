"use client";

import { useCallback, useEffect, useState } from "react";
import { useMember } from "@/lib/use-member";
import { isAdminMember } from "@/lib/member";
import { OFFERS, OFFER_SLUGS, type OfferSlug } from "@/lib/offers";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// Every MY SZN waitlist in one place: a tab per offer with its count, search, and a CSV export of
// the list you're looking at (or all of them). Data comes from /api/admin/waitlists (admin only).

interface Row { email: string; name: string | null; offer: OfferSlug; answer: string | null; birth_date: string | null; birth_time: string | null; birth_place: string | null; brevo_ok: boolean; created_at: string }

export default function WaitlistsAdminPage() {
  const { member, ready } = useMember();
  const [tab, setTab] = useState<OfferSlug | "all">("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    const res = await fetch(`/api/admin/waitlists${tab === "all" ? "" : `?offer=${tab}`}`);
    if (!res.ok) { setError(`Couldn't load the waitlists (${res.status})`); return; }
    const data = await res.json();
    setRows(data.rows); setCounts(data.counts);
  }, [tab]);

  useEffect(() => { if (ready && isAdminMember(member)) load(); }, [ready, member, load]);

  if (!ready) return null;
  if (!isAdminMember(member)) return <div className="px-8 py-24 text-center">Not found.</div>;

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const q = search.trim().toLowerCase();
  const shown = q ? rows.filter((r) => r.email.includes(q) || (r.name ?? "").toLowerCase().includes(q)) : rows;
  const tabs: { key: OfferSlug | "all"; label: string; n: number }[] = [
    { key: "all", label: "All", n: total },
    ...OFFER_SLUGS.map((s) => ({ key: s, label: `${OFFERS[s].emoji} ${OFFERS[s].name}`, n: counts[s] ?? 0 })),
  ];

  return (
    <div className="px-5 md:px-8 py-10 max-w-6xl mx-auto">
      <h1 style={{ fontFamily: poppins, fontSize: 32, fontWeight: 800 }}>Waitlists</h1>
      <div className="flex flex-wrap gap-2" style={{ marginTop: 20 }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ border: "var(--border)", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", background: tab === t.key ? "var(--dark)" : "#fff", color: tab === t.key ? "#fff" : "var(--dark)" }}>
            {t.label} · {t.n}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 18 }}>
        <input placeholder="search name or email" value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: "var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 16, flex: "1 1 240px" }} />
        <a href={`/api/admin/waitlists?format=csv${tab === "all" ? "" : `&offer=${tab}`}`} className="no-underline" style={{ background: "var(--pink)", color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 20px" }}>
          export csv
        </a>
      </div>
      {error && <p style={{ color: "var(--pink)", fontWeight: 700, marginTop: 16 }}>{error}</p>}
      <div style={{ overflowX: "auto", marginTop: 20, border: "var(--border)", borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--lav-light)", textAlign: "left" }}>
              {["Signed up", "Name", "Email", "Waitlist", "Answer", "Birth", "In Brevo"].map((h) => <th key={h} style={{ padding: "10px 12px" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={`${r.email}-${r.offer}`} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td style={{ padding: "10px 12px" }}>{r.name ?? ""}</td>
                <td style={{ padding: "10px 12px" }}>{r.email}</td>
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{OFFERS[r.offer]?.name ?? r.offer}</td>
                <td style={{ padding: "10px 12px", maxWidth: 320 }}>{r.answer ?? ""}</td>
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{r.birth_date ? [r.birth_date, r.birth_time, r.birth_place].filter(Boolean).join(" · ") : ""}</td>
                <td style={{ padding: "10px 12px" }}>{r.brevo_ok ? "yes" : "no"}</td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: "var(--grey)" }}>Nobody here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
