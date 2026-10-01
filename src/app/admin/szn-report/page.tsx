"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { isAdminMember } from "@/lib/member";
import type { SznReport } from "@/lib/szn-report";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// What members want: the "customise my szn" report. Scanned, not read, so the headline numbers and
// the plain-English findings come first and the detail sits underneath. Two signals per area, side by
// side on one 0-100% scale: what members SAY they want (their picks) and what they actually open (the
// area reads in the last 30 days).

const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey)" };
const h2: React.CSSProperties = { fontFamily: poppins, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", textTransform: "lowercase", margin: "0 0 4px" };
const SEGMENT_LABEL = { trial: "trial", paying: "paying", lapsed: "lapsed" } as const;

function when(iso: string): string {
  // Betty reads this in Vietnam: show her own clock and say so.
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
}

function Bar({ value, color, title }: { value: number; color: string; title: string }) {
  return (
    <div title={title} style={{ height: 10, background: "#f1edf7", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(value, value > 0 ? 2 : 0)}%`, height: "100%", background: color, borderRadius: 4 }} />
    </div>
  );
}

export default function SznReportPage() {
  const { member, ready } = useMember();
  const [report, setReport] = useState<SznReport | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch("/api/admin/szn-report", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      setReport(await res.json());
    } catch {
      setFailed(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (ready && isAdminMember(member)) load();
  }, [ready, member, load]);

  if (!ready) return null;
  if (!isAdminMember(member)) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>admins only.</h1>
          <Link href="/" className="btn-pink">back to my szn</Link>
        </div>
      </section>
    );
  }

  const r = report;
  const tiles: [string, string, string?][] = r
    ? [
        [`${r.adoption.rate}%`, "have picked", `${r.adoption.picked} of ${r.adoption.eligible} members who can`],
        [String(r.adoption.notYet), "haven't picked yet"],
        [String(r.adoption.skipped), "skipped it"],
        [String(r.adoption.sawLaunch), "saw the launch popup"],
        [String(r.avgPicks || "–"), "areas picked, on average"],
        [String(r.readsTotal), "area reads, last 30 days"],
      ]
    : [];

  return (
    <main>
      <section className="px-5 md:px-8 py-12" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 10 }}>
            <Link href="/admin" className="no-underline" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              ← control room
            </Link>
            <span className="tag">admin · customise my szn</span>
          </div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(30px, 4.5vw, 44px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.05, color: "#fff", margin: "0 0 12px" }}>
            what members <span className="szn-holo-text">want more of.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 640, margin: "0 0 16px" }}>
            Their customise my szn picks next to what they actually open. Live every time you load it, with your own account and test accounts left out.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={load} disabled={loading} className="szn-pill hot szn-holo-hot" style={{ cursor: loading ? "default" : "pointer" }}>
              {loading ? "refreshing…" : "refresh ✦"}
            </button>
            {r && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>updated {when(r.generatedAt)} (Vietnam time)</span>}
          </div>
        </div>
      </section>

      {failed && (
        <section className="px-5 md:px-8 py-8">
          <div className="max-w-6xl mx-auto" style={{ border: "2px solid var(--pink)", borderRadius: 14, padding: 18 }}>
            <b>The report didn&apos;t load.</b> Usually a dropped connection. Hit refresh above and it&apos;ll try again.
          </div>
        </section>
      )}

      {!r && !failed && (
        <section className="px-5 md:px-8 py-16">
          <p className="max-w-6xl mx-auto" style={{ color: "var(--grey)" }}>Pulling the numbers…</p>
        </section>
      )}

      {r && (
        <>
          {/* headline numbers */}
          <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)", background: "var(--pink-bg)" }}>
            <div className="max-w-6xl mx-auto grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
              {tiles.map(([v, k, sub]) => (
                <div key={k} style={{ border: "var(--border)", borderRadius: 14, padding: "16px 18px", background: "#fff" }}>
                  <div style={{ fontFamily: poppins, fontWeight: 800, fontSize: 30, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                  <div style={{ ...label, marginTop: 8 }}>{k}</div>
                  {sub && <div style={{ fontSize: 12, color: "var(--grey)", marginTop: 4 }}>{sub}</div>}
                </div>
              ))}
            </div>
          </section>

          {/* findings + next moves */}
          <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 style={h2}>what this tells you</h2>
                <ul style={{ margin: "14px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {r.findings.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.6 }}>
                      <span aria-hidden style={{ color: "var(--pink)", fontWeight: 800 }}>✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="szn-holo" style={{ border: "2px solid var(--dark)", borderRadius: 18, padding: "18px 18px 16px", boxShadow: "4px 4px 0 var(--pink)", alignSelf: "start" }}>
                <h2 style={h2}>do this next</h2>
                <ol style={{ margin: "12px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 10, fontSize: 14, lineHeight: 1.55 }}>
                  {r.nextMoves.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* area ranking: said vs did */}
          <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-6xl mx-auto">
              <h2 style={h2}>what they want more of, area by area</h2>
              <p style={{ fontSize: 13, color: "var(--grey)", margin: "0 0 14px" }}>Ranked by how many members picked it. Hover a bar for the exact numbers.</p>
              <div className="flex gap-5 flex-wrap" style={{ fontSize: 12, marginBottom: 16 }}>
                <span className="flex items-center gap-2">
                  <span style={{ width: 14, height: 10, borderRadius: 3, background: "var(--pink)", display: "inline-block" }} /> picked it (% of members who picked anything)
                </span>
                <span className="flex items-center gap-2">
                  <span style={{ width: 14, height: 10, borderRadius: 3, background: "var(--dark)", display: "inline-block" }} /> opened its read (% of all area reads, 30 days)
                </span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: "left" }}>
                      {["area", "said vs did", "picked", "put first", "avg spot", "trial / paying", "reads (members)"].map((h) => (
                        <th key={h} style={{ ...label, padding: "8px 10px", borderBottom: "1.5px solid var(--dark)", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r.areas.map((a) => (
                      <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "10px", fontFamily: poppins, fontWeight: 800, textTransform: "lowercase", whiteSpace: "nowrap" }}>{a.label}</td>
                        <td style={{ padding: "10px", width: "34%" }}>
                          <div style={{ display: "grid", gap: 4 }}>
                            <Bar value={a.pickShare} color="var(--pink)" title={`${a.label}: picked by ${a.pickers} (${a.pickShare}%)`} />
                            <Bar value={a.readShare} color="var(--dark)" title={`${a.label}: ${a.reads} reads (${a.readShare}% of all area reads)`} />
                          </div>
                        </td>
                        <td style={{ padding: "10px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                          <b>{a.pickers}</b> <span style={{ color: "var(--grey)" }}>({a.pickShare}%)</span>
                        </td>
                        <td style={{ padding: "10px", fontVariantNumeric: "tabular-nums" }}>{a.firstChoice}</td>
                        <td style={{ padding: "10px", fontVariantNumeric: "tabular-nums" }}>{a.avgRank ?? "–"}</td>
                        <td style={{ padding: "10px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                          {a.trialPickers} / {a.payingPickers}
                        </td>
                        <td style={{ padding: "10px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                          {a.reads} <span style={{ color: "var(--grey)" }}>({a.readers})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* mixes, eras, seasons, latest */}
          <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)", background: "var(--pink-bg)" }}>
            <div className="max-w-6xl mx-auto grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
              {[
                { t: "most common mixes", rows: r.combos.map((c) => [c.label, String(c.count)]) , empty: "Shows up once members pick two or more." },
                { t: "most common eras", rows: r.eras.map((c) => [c.label, String(c.count)]), empty: "Shows up once members start picking." },
                { t: "picking, by season", rows: r.bySeason.map((s) => [`${s.season.toLowerCase()} szn`, String(s.pickers)]), empty: "Fills in season by season." },
              ].map((box) => (
                <div key={box.t} style={{ background: "#fff", border: "var(--border)", borderRadius: 16, padding: "16px 18px" }}>
                  <h3 style={{ ...h2, fontSize: 17 }}>{box.t}</h3>
                  {box.rows.length === 0 ? (
                    <p style={{ fontSize: 13, color: "var(--grey)", margin: "8px 0 0" }}>{box.empty}</p>
                  ) : (
                    <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }}>
                      {box.rows.map(([k, v]) => (
                        <li key={k} className="flex justify-between gap-3" style={{ padding: "7px 0", borderBottom: "1px solid #f0e6ee", fontSize: 13.5 }}>
                          <span style={{ textTransform: "lowercase" }}>{k}</span>
                          <b style={{ fontVariantNumeric: "tabular-nums" }}>{v}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div style={{ background: "#fff", border: "var(--border)", borderRadius: 16, padding: "16px 18px" }}>
                <h3 style={{ ...h2, fontSize: 17 }}>latest picks</h3>
                {r.recent.length === 0 ? (
                  <p style={{ fontSize: 13, color: "var(--grey)", margin: "8px 0 0" }}>The newest saves land here.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }}>
                    {r.recent.map((x) => (
                      <li key={x.at} style={{ padding: "7px 0", borderBottom: "1px solid #f0e6ee", fontSize: 13 }}>
                        <div style={{ textTransform: "lowercase", fontWeight: 700 }}>{x.era}</div>
                        <div style={{ color: "var(--grey)", fontSize: 11.5 }}>
                          {when(x.at)} · {SEGMENT_LABEL[x.segment]}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
