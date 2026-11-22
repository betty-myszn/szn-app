"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { isAdminMember } from "@/lib/member";
import { britishDate } from "@/lib/format-date";

const poppins = "var(--font-poppins), Poppins, sans-serif";

interface Row {
  id: string;
  name: string;
  email: string;
  level: string | null;
  status: string | null;
  trialEnds: string | null;
  joined: string;
  blocked: boolean;
  isAdmin: boolean;
}

// Betty's members list: everyone with an account, searchable, each with a button to start (or open)
// her direct message thread and a link to her community profile.
export default function AdminMembersPage() {
  const { member, ready } = useMember();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const admin = isAdminMember(member);

  useEffect(() => {
    if (!admin) return;
    fetch("/api/admin/members", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { members: Row[] }) => setRows(d.members))
      .catch(() => setError("Couldn't load members, refresh to try again."));
  }, [admin]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!rows) return [];
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }, [rows, search]);

  if (!ready) return null;
  if (!admin) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800 }}>this page is just for betty.</h1>
      </section>
    );
  }

  const statusLabel = (r: Row) => {
    if (r.isAdmin) return "admin";
    if (r.blocked) return "blocked";
    if (r.status === "active") return r.level ? `${r.level} · active` : "active";
    if (r.status === "trialing") return "trial";
    if (r.status) return r.status.replace(/_/g, " ");
    return "free account";
  };

  return (
    <>
      <section className="px-5 md:px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/admin" className="no-underline" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}>
            ← control room
          </Link>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 800, letterSpacing: "-1px", color: "#fff", marginTop: 14 }}>
            all <span className="pk">members.</span>
          </h1>
          <p style={{ fontSize: 14, color: "#fff", marginTop: 8 }}>
            {rows ? `${rows.length} accounts` : "loading..."} · tap message her to start a private chat
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search by name or email"
            className="w-full"
            style={{ border: "var(--border)", padding: "12px 14px", fontSize: 14, marginBottom: 20, color: "#000" }}
          />
          {error && <p style={{ fontSize: 14, color: "#000", fontWeight: 700 }}>{error}</p>}
          <div style={{ border: "var(--border)" }}>
            {shown.map((r, i) => (
              <div
                key={r.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                style={{ borderBottom: i < shown.length - 1 ? "var(--border)" : undefined }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: poppins, fontSize: 16, fontWeight: 800, color: "#000" }}>{r.name || "no name yet"}</div>
                  <div style={{ fontSize: 13, color: "#000", wordBreak: "break-all" }}>{r.email}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#000", marginTop: 4 }}>
                    {statusLabel(r)} · joined {britishDate(r.joined)}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!r.isAdmin && !r.blocked && (
                    <Link href={`/admin/messages?member=${r.id}`} className="btn-pink" style={{ fontSize: 11, padding: "10px 14px" }}>
                      💌 message her
                    </Link>
                  )}
                  {r.name && (
                    <Link
                      href={`/community/profile/${encodeURIComponent(r.name.toLowerCase().replace(/\s+/g, ""))}`}
                      className="no-underline"
                      style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "10px 14px", border: "var(--border)", color: "#000" }}
                    >
                      profile
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {rows && shown.length === 0 && <p className="p-5" style={{ fontSize: 14, color: "#000" }}>No one matches that.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
