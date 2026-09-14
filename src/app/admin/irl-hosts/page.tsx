"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { isAdminMember } from "@/lib/member";
import {
  FREQUENCY, HD_TYPES, RATING_FIELDS, SIDE_ROLE, STATUSES, STATUS_LABELS, TRAVEL, bigThree,
  frequencyLabel, humanDesign, type ApplicationStatus, type ChartSummary,
} from "@/lib/irl";
import { ZODIAC_SIGNS } from "@/types/chart";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The MY SZN IRL recruitment dashboard. Scanned and operated rather than read, so the summary comes
// before the detail, state is a chip you can see at a glance, and the comparison view exists to
// answer the only question that actually matters at the end: which of these three.

interface Application {
  id: string; reference: string | null; submitted_at: string;
  full_name: string; email: string; phone: string | null;
  instagram: string | null; tiktok: string | null; linkedin: string | null;
  city_slug: string; other_city: string | null; occupation: string;
  why_host: string; astrology_relationship: string; relevant_experience: string | null;
  speaking_comfort: number; scenario_answer: string; second_scenario: string | null; local_ideas: string;
  frequency_ok: string; travel_ok: string; side_role_ok: string;
  /** The "one unforgettable night" answer, kept in the column the girls' night question used. */
  girls_night: string;
  birth_date: string | null; birth_time: string | null; birth_time_approximate: boolean | null;
  birth_place: string | null; chart_summary: ChartSummary | null;
  status: ApplicationStatus; shortlisted: boolean;
  admin_notes: string | null; red_flags: string | null; things_we_loved: string | null;
  overall_score: number | null;
  [k: string]: unknown;
}

interface Summary {
  total: number; london: number; new_york: number; los_angeles: number;
  other: number; shortlisted: number; interviews: number; accepted: number;
}

const CITY_TABS = [
  { slug: "all", name: "All" },
  { slug: "london", name: "London" },
  { slug: "new-york", name: "New York" },
  { slug: "los-angeles", name: "Los Angeles" },
  { slug: "other", name: "Other cities" },
];

const optionText = (list: readonly { value: string; label: string }[], v: string) =>
  list.find((o) => o.value === v)?.label ?? v;

const cityName = (slug: string, other?: string | null) =>
  slug === "london" ? "London" : slug === "new-york" ? "New York"
  : slug === "los-angeles" ? "Los Angeles" : other || "Other";

// ── her chart, as the dashboard reads it ─────────────────────────────────────
// Deliberately no age anywhere. The birth date is here for the chart, and age is a protected
// characteristic in every city we recruit in, so it is not a column to compare applicants on.

function bornLine(a: Application): string {
  if (!a.birth_date) return "—";
  const date = new Date(`${a.birth_date}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = a.birth_time
    ? new Date(`2000-01-01T${a.birth_time.slice(0, 5)}`).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })
    : "";
  const approx = a.birth_time_approximate ? " (approximate)" : "";
  return `${date}, ${time}${approx} · ${a.birth_place ?? ""}`;
}

export default function IrlHostsAdminPage() {
  const { member, ready } = useMember();
  const [apps, setApps] = useState<Application[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [hd, setHd] = useState("all");
  const [sun, setSun] = useState("all");
  const [shortlistedOnly, setShortlistedOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [openId, setOpenId] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ city, status, availability, hd, sun, sort });
    if (shortlistedOnly) p.set("shortlisted", "1");
    const res = await fetch(`/api/irl/admin?${p}`);
    if (res.ok) {
      const d = await res.json();
      setApps(d.applications);
      setSummary(d.summary);
    }
    setLoading(false);
  }, [city, status, availability, hd, sun, shortlistedOnly, sort]);

  useEffect(() => { if (ready && isAdminMember(member)) load(); }, [ready, member, load]);

  // ?id= opens that applicant straight away, which is where the Google Sheet's Dashboard column and
  // the team email point.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) setOpenId(id);
  }, []);

  const patch = useCallback(async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/irl/admin/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (res.ok) {
      const { application } = await res.json();
      setApps((list) => list.map((a) => (a.id === id ? { ...a, ...application } : a)));
      load();
    }
  }, [load]);

  const openApp = useMemo(() => apps.find((a) => a.id === openId) ?? null, [apps, openId]);
  const comparing = useMemo(() => apps.filter((a) => compare.includes(a.id)), [apps, compare]);

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

  return (
    <main>
      <section className="px-5 md:px-8 py-10" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--pink)", margin: "0 0 10px" }}>admin</p>
          <h1 style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)", textTransform: "lowercase", color: "#fff", margin: 0 }}>
            irl host applications
          </h1>
        </div>
      </section>

      {/* summary cards */}
      <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-7xl mx-auto grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {summary && ([
            ["total", summary.total], ["london", summary.london], ["new york", summary.new_york],
            ["los angeles", summary.los_angeles], ["other cities", summary.other],
            ["shortlisted", summary.shortlisted], ["interviews", summary.interviews], ["accepted", summary.accepted],
          ] as [string, number][]).map(([k, v]) => (
            <div key={k} style={{ border: "var(--border)", padding: "16px 18px", background: "#fff" }}>
              <div style={{ fontFamily: poppins, fontWeight: 800, fontSize: 30, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{v}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey)", marginTop: 6 }}>{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* city tabs */}
      <section className="px-5 md:px-8 pt-6" >
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          {CITY_TABS.map((t) => (
            <button key={t.slug} onClick={() => setCity(t.slug)}
              style={{ border: "var(--border)", background: city === t.slug ? "var(--dark)" : "#fff", color: city === t.slug ? "#fff" : "var(--dark)", fontFamily: poppins, fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", padding: "11px 18px", cursor: "pointer" }}>
              {t.name}
            </button>
          ))}
        </div>
      </section>

      {/* filters */}
      <section className="px-5 md:px-8 py-6" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-7xl mx-auto grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
          <Filter label="status" value={status} onChange={setStatus} options={STATUSES.map((s) => [s, STATUS_LABELS[s]])} />
          <Filter label="availability" value={availability} onChange={setAvailability} options={FREQUENCY.map((o) => [o.value, o.label])} />
          <Filter label="human design" value={hd} onChange={setHd} options={HD_TYPES.map((t) => [t, t])} />
          <Filter label="sun sign" value={sun} onChange={setSun} options={ZODIAC_SIGNS.map((s) => [s, s])} />
          <Filter label="sort" value={sort} onChange={setSort} noAll options={[["newest","Newest"],["oldest","Oldest"],["city","City"],["status","Status"],["score","Score"]]} />
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            <input type="checkbox" checked={shortlistedOnly} onChange={(e) => setShortlistedOnly(e.target.checked)} style={{ width: 18, height: 18 }} />
            shortlisted only
          </label>
        </div>
      </section>

      {comparing.length > 0 && <Comparison apps={comparing} onClear={() => setCompare([])} />}

      {/* the table */}
      <section className="px-5 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? <p style={{ color: "var(--grey)" }}>loading…</p>
            : apps.length === 0 ? <p style={{ color: "var(--grey)" }}>No applications match that.</p>
            : (
            <div style={{ overflowX: "auto", border: "var(--border)", background: "#fff" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1020 }}>
                <thead>
                  <tr>
                    {["", "name", "city", "what she does", "applied", "chart", "leading a room", "availability", "score", "status", ""].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey)", padding: "12px 10px", borderBottom: "var(--border)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={td}>
                        <input type="checkbox" checked={compare.includes(a.id)} style={{ width: 17, height: 17 }}
                          onChange={(e) => setCompare((c) => e.target.checked ? (c.length >= 3 ? c : [...c, a.id]) : c.filter((x) => x !== a.id))} />
                      </td>
                      <td style={{ ...td, fontWeight: 700 }}>
                        {a.full_name}
                        <div style={{ fontSize: 11, color: "var(--grey)", fontWeight: 400 }}>{a.reference}</div>
                      </td>
                      <td style={td}>{cityName(a.city_slug, a.other_city)}</td>
                      <td style={td}>{a.occupation}</td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>{new Date(a.submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                      <td style={{ ...td, minWidth: 170 }}>
                        {a.chart_summary ? (
                          <>
                            <div>☉ {a.chart_summary.sun} · ☽ {a.chart_summary.moon}{a.chart_summary.rising && <> · ↑ {a.chart_summary.rising}</>}</div>
                            {a.chart_summary.hd_type && (
                              <div style={{ fontSize: 11.5, color: "var(--grey)" }}>{a.chart_summary.hd_type} {a.chart_summary.hd_profile}</div>
                            )}
                          </>
                        ) : <span style={{ color: "var(--grey)" }}>—</span>}
                      </td>
                      <td style={{ ...td, fontVariantNumeric: "tabular-nums" }}>{a.speaking_comfort}/5</td>
                      <td style={td}>{frequencyLabel(a.frequency_ok)}</td>
                      <td style={{ ...td, fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{a.overall_score ?? "—"}</td>
                      <td style={td}><StatusChip status={a.status} /></td>
                      <td style={{ ...td, whiteSpace: "nowrap" }}>
                        <button onClick={() => patch(a.id, { shortlisted: !a.shortlisted })} title="shortlist"
                          style={{ border: "none", background: "none", fontSize: 19, cursor: "pointer", marginRight: 8 }}>
                          {a.shortlisted ? "★" : "☆"}
                        </button>
                        <button onClick={() => setOpenId(a.id)}
                          style={{ border: "var(--border)", background: "#fff", fontFamily: poppins, fontWeight: 800, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", padding: "8px 13px", cursor: "pointer" }}>
                          open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {openApp && <Profile app={openApp} onClose={() => setOpenId(null)} onPatch={patch} />}
    </main>
  );
}

const td: React.CSSProperties = { padding: "13px 10px", fontSize: 13.5, verticalAlign: "top" };

function Filter({ label, value, onChange, options, noAll }: {
  label: string; value: string; onChange: (v: string) => void;
  options: [string, string][]; noAll?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey)", marginBottom: 5 }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 11px", border: "var(--border)", background: "#fff", fontSize: 13.5, fontFamily: "inherit" }}>
        {!noAll && <option value="all">All</option>}
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function StatusChip({ status }: { status: ApplicationStatus }) {
  const tone: Record<string, [string, string]> = {
    new: ["#E8DFFE", "#3C2A70"], reviewing: ["#E8DFFE", "#3C2A70"],
    shortlisted: ["#FFE0F0", "#A30F51"], interview: ["#FFE0F0", "#A30F51"],
    second_interview: ["#FFE0F0", "#A30F51"], accepted: ["#1a1a1a", "#fff"],
    rejected: ["#eee", "#666"], hold: ["#eee", "#666"], other_city_waitlist: ["#eee", "#666"],
  };
  const [bg, fg] = tone[status] ?? ["#eee", "#666"];
  return (
    <span style={{ background: bg, color: fg, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 9px", whiteSpace: "nowrap" }}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function Comparison({ apps, onClear }: { apps: Application[]; onClear: () => void }) {
  const rows: [string, (a: Application) => string][] = [
    ["City", (a) => cityName(a.city_slug, a.other_city)],
    ["Big three", (a) => bigThree(a.chart_summary)],
    ["Human design", (a) => humanDesign(a.chart_summary)],
    ["What she does", (a) => a.occupation],
    ["Experience", (a) => a.relevant_experience || "—"],
    ["Leading a room (1-5)", (a) => String(a.speaking_comfort)],
    ["Availability", (a) => frequencyLabel(a.frequency_ok)],
    ["Overall score", (a) => (a.overall_score != null ? String(a.overall_score) : "—")],
    ["The woman standing alone", (a) => a.scenario_answer],
    ["The two who only talk to each other", (a) => a.second_scenario || "—"],
    ["Three places that scream MY SZN", (a) => a.local_ideas],
    ["One unforgettable night", (a) => a.girls_night],
  ];
  return (
    <section className="px-5 md:px-8 py-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 14 }}>
          <h2 style={{ fontFamily: poppins, fontWeight: 800, fontSize: 20, margin: 0 }}>comparing {apps.length}</h2>
          <button onClick={onClear} style={{ border: "var(--border)", background: "#fff", padding: "9px 15px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>clear</button>
        </div>
        <div style={{ overflowX: "auto", border: "var(--border)", background: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead><tr>
              <th style={{ ...td, width: 160 }} />
              {apps.map((a) => <th key={a.id} style={{ ...td, textAlign: "left", fontFamily: poppins, fontWeight: 800, fontSize: 15 }}>{a.full_name}</th>)}
            </tr></thead>
            <tbody>
              {rows.map(([label, get]) => (
                <tr key={label} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ ...td, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--grey)" }}>{label}</td>
                  {apps.map((a) => <td key={a.id} style={{ ...td, lineHeight: 1.55 }}>{get(a)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Profile({ app, onClose, onPatch }: {
  app: Application; onClose: () => void; onPatch: (id: string, body: Record<string, unknown>) => void;
}) {
  const [notes, setNotes] = useState(app.admin_notes ?? "");
  const [flags, setFlags] = useState(app.red_flags ?? "");
  const [loved, setLoved] = useState(app.things_we_loved ?? "");
  const [iv, setIv] = useState<Record<string, string>>({});

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300, overflowY: "auto" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 940, margin: "40px auto", background: "#fff", border: "var(--border)" }}>
        <div style={{ position: "sticky", top: 0, background: "var(--dark)", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 20, color: "#fff", margin: 0 }}>{app.full_name}</p>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", margin: "3px 0 0" }}>
              {cityName(app.city_slug, app.other_city)} · {app.occupation} · {app.reference}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", padding: "8px 14px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>close</button>
        </div>

        <div style={{ padding: "22px" }}>
          {/* quick actions */}
          <div className="flex gap-2 flex-wrap" style={{ marginBottom: 20 }}>
            {([["shortlisted","Shortlist"],["interview","Move to interview"],["accepted","Accept"],["rejected","Reject"],["hold","Hold"]] as [string,string][]).map(([s, l]) => (
              <button key={s} onClick={() => onPatch(app.id, s === "shortlisted" ? { shortlisted: true, status: "shortlisted" } : { status: s })}
                style={{ border: "var(--border)", background: app.status === s ? "var(--pink)" : "#fff", color: app.status === s ? "#fff" : "var(--dark)", fontFamily: poppins, fontWeight: 800, fontSize: 11.5, letterSpacing: "0.05em", textTransform: "uppercase", padding: "10px 15px", cursor: "pointer" }}>{l}</button>
            ))}
            <button onClick={() => navigator.clipboard?.writeText(app.email)} style={{ border: "var(--border)", background: "#fff", fontSize: 11.5, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", padding: "10px 15px", cursor: "pointer" }}>copy email</button>
            {app.instagram && <Ext href={`https://instagram.com/${app.instagram.replace(/^@/, "")}`} label="instagram" />}
            {app.tiktok && <Ext href={`https://tiktok.com/@${app.tiktok.replace(/^@/, "")}`} label="tiktok" />}
            {app.linkedin && <Ext href={app.linkedin.startsWith("http") ? app.linkedin : `https://${app.linkedin}`} label="linkedin" />}
          </div>

          <ChartPanel app={app} />

          <Block title="why she wants it" body={app.why_host} />
          <Block title="astrology and manifestation" body={app.astrology_relationship} />
          <Block title="her experience" body={app.relevant_experience || "(none given)"} extra={`leading a room ${app.speaking_comfort}/5`} />
          <Block title="the woman standing alone" body={app.scenario_answer} />
          {app.second_scenario && <Block title="the two who only talk to each other" body={app.second_scenario} />}
          <Block title="three places that scream my szn" body={app.local_ideas} />
          <Block title="availability" body={frequencyLabel(app.frequency_ok)} extra={`travel: ${optionText(TRAVEL, app.travel_ok)} · freelance, hourly plus commission: ${optionText(SIDE_ROLE, app.side_role_ok)}`} />
          <Block title="one unforgettable night" body={app.girls_night} />

          {/* ratings, internal only */}
          <div style={{ border: "var(--border)", background: "var(--lav-light)", padding: "20px 20px 22px", marginTop: 22 }}>
            <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>internal rating</p>
            <p style={{ fontSize: 12.5, color: "var(--grey)", margin: "0 0 16px" }}>Never shown to the applicant.</p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
              {RATING_FIELDS.map((r) => (
                <div key={r.key}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{r.label}</span>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[1,2,3,4,5].map((n) => {
                      const on = app[r.key] === n;
                      return (
                        <button key={n} onClick={() => onPatch(app.id, { [r.key]: on ? null : n })}
                          style={{ flex: 1, minHeight: 36, border: "var(--border)", background: on ? "var(--pink)" : "#fff", color: on ? "#fff" : "var(--dark)", fontFamily: poppins, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{n}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 14, marginTop: 16, marginBottom: 0 }}>
              overall score: {app.overall_score ?? "—"}
            </p>
          </div>

          <Notes label="things we loved" value={loved} onChange={setLoved} onSave={() => onPatch(app.id, { things_we_loved: loved })} />
          <Notes label="red flags" value={flags} onChange={setFlags} onSave={() => onPatch(app.id, { red_flags: flags })} />
          <Notes label="internal notes" value={notes} onChange={setNotes} onSave={() => onPatch(app.id, { admin_notes: notes })} />

          {/* interview notes */}
          <div style={{ border: "var(--border)", padding: "20px", marginTop: 18 }}>
            <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 15, margin: "0 0 14px" }}>add interview notes</p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
              {([["interview_date","Date","date"],["interviewed_by","Interviewed by","text"],["strengths","Strengths","text"],["concerns","Concerns","text"],["suggested_city","Suggested city fit","text"],["recommendation","Final recommendation","text"]] as [string,string,string][]).map(([k, l, t]) => (
                <label key={k} style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, marginBottom: 5 }}>{l}</span>
                  <input type={t} value={iv[k] ?? ""} onChange={(e) => setIv({ ...iv, [k]: e.target.value })}
                    style={{ width: "100%", padding: "10px 11px", border: "var(--border)", fontSize: 13.5, fontFamily: "inherit" }} />
                </label>
              ))}
            </div>
            <textarea rows={4} placeholder="general notes" value={iv.notes ?? ""} onChange={(e) => setIv({ ...iv, notes: e.target.value })}
              style={{ width: "100%", marginTop: 12, padding: "11px", border: "var(--border)", fontSize: 14, fontFamily: "inherit" }} />
            <button onClick={() => { onPatch(app.id, { interview_note: iv }); setIv({}); }}
              style={{ marginTop: 12, background: "var(--dark)", color: "#fff", border: "none", fontFamily: poppins, fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", padding: "12px 20px", cursor: "pointer" }}>
              save interview notes
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey)", marginRight: 10 }}>status</span>
            <select value={app.status} onChange={(e) => onPatch(app.id, { status: e.target.value })}
              style={{ padding: "10px 12px", border: "var(--border)", fontSize: 13.5, fontFamily: "inherit" }}>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Her chart and human design, read off the summary stored when she applied. */
function ChartPanel({ app }: { app: Application }) {
  const c = app.chart_summary;
  if (!app.birth_date) return null;
  const rows: [string, string | null][] = c ? [
    ["Sun", c.sun], ["Moon", c.moon],
    ["Rising", c.rising ? `${c.rising}${c.time_approximate ? " (approx.)" : ""}` : null],
    ["Mercury", c.mercury], ["Venus", c.venus], ["Mars", c.mars],
    ["HD type", c.hd_type], ["Strategy", c.hd_strategy],
    ["Authority", c.hd_authority], ["Profile", c.hd_profile], ["Definition", c.hd_definition],
  ] : [];
  return (
    <div style={{ border: "var(--border)", background: "var(--lav-light)", padding: "18px 20px 20px", marginBottom: 18 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", margin: "0 0 6px" }}>birth chart + human design</p>
      <p style={{ fontSize: 13.5, margin: "0 0 14px" }}>{bornLine(app)}</p>
      {c ? (
        <div className="grid gap-x-5 gap-y-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey)" }}>{k}</span>
              <span style={{ fontSize: 14.5, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--grey)", margin: 0 }}>
          The chart calculation failed for these details. They are enough to run it by hand.
        </p>
      )}
    </div>
  );
}

function Ext({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline"
      style={{ border: "var(--border)", background: "#fff", color: "var(--dark)", fontSize: 11.5, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", padding: "10px 15px" }}>
      {label} ↗
    </a>
  );
}

function Block({ title, body, extra }: { title: string; body: string; extra?: string }) {
  return (
    <div style={{ borderTop: "1px solid #eee", padding: "16px 0" }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", margin: "0 0 7px" }}>{title}</p>
      {extra && <p style={{ fontSize: 12.5, color: "var(--grey)", margin: "0 0 7px" }}>{extra}</p>}
      <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>{body}</p>
    </div>
  );
}

function Notes({ label, value, onChange, onSave }: {
  label: string; value: string; onChange: (v: string) => void; onSave: () => void;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{label}</span>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onSave}
        style={{ width: "100%", padding: "11px", border: "var(--border)", fontSize: 14, fontFamily: "inherit" }} />
    </div>
  );
}
