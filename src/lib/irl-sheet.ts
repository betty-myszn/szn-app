import { SITE_URL } from "@/lib/site";
import { practicalLabel, type ChartSummary } from "@/lib/irl";

// Every host application also lands as a row in Betty's Google Sheet, through the small Apps Script
// web app bound to that sheet (scripts/irl-host-sheet.gs, which has the steps to connect it at the
// top). Fire-and-forget like the team email: the application is already saved in Supabase by the
// time this runs, so a Google problem costs a row in the sheet and never reaches the applicant.
// With IRL_SHEET_WEBHOOK_URL unset it does nothing.

export interface IrlSheetArgs {
  id: string; submitted_at: string; reference: string; city: string;
  full_name: string; email: string; phone: string | null;
  instagram: string | null; tiktok: string | null; linkedin: string | null;
  occupation: string;
  birth_date: string; birth_time: string; birth_time_approximate: boolean; birth_place: string;
  chart_summary: ChartSummary | null;
  why_host: string; astrology_relationship: string;
  scenario_answer: string; second_scenario: string;
  /** The one practical question: 1-2 evening or weekend events a month, hourly plus commission. */
  frequency_ok: string;
  /** The "one unforgettable night" answer, kept in the column the girls' night question used. */
  girls_night: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const handle = (v: string | null) => (v ? v.trim().replace(/^@/, "") : "");

/** Sheets reads a cell starting with = + - or @ as a formula, and an applicant's answer must never
 *  run as one, so those get the leading apostrophe that makes Sheets show them exactly as typed. */
export function safeCell(v: string): string {
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

/** "4 Aug 1961, 19:24 (approximate), Honolulu". Day first, like the dashboard, so sorting the column
 *  cannot line applicants up by age. */
function bornCell(a: IrlSheetArgs): string {
  const [y, m, d] = a.birth_date.split("-");
  const approx = a.birth_time_approximate ? " (approximate)" : "";
  return `${Number(d)} ${MONTHS[Number(m) - 1] ?? m} ${y}, ${a.birth_time.slice(0, 5)}${approx}, ${a.birth_place}`;
}

/** The row as header to value, in the order the sheet's columns are first created. */
export function sheetRow(a: IrlSheetArgs): Record<string, string | number> {
  const c = a.chart_summary;
  const approx = a.birth_time_approximate ? " (approx.)" : "";
  const row: Record<string, string | number> = {
    "Submitted": a.submitted_at,
    "Reference": a.reference,
    "Name": a.full_name,
    "City": a.city,
    "Email": a.email,
    "Phone": a.phone ?? "",
    "Instagram": a.instagram ? `https://instagram.com/${handle(a.instagram)}` : "",
    "TikTok": a.tiktok ? `https://tiktok.com/@${handle(a.tiktok)}` : "",
    "LinkedIn": a.linkedin ? (/^https?:\/\//.test(a.linkedin) ? a.linkedin : `https://${a.linkedin}`) : "",
    "Work, experience and skills": a.occupation,
    "Born": bornCell(a),
    "Sun": c?.sun ?? "",
    "Moon": c?.moon ?? "",
    "Rising": c?.rising ? `${c.rising}${approx}` : "",
    "Mercury": c?.mercury ?? "",
    "Venus": c?.venus ?? "",
    "Mars": c?.mars ?? "",
    "Human design": c?.hd_type ?? "",
    "Strategy": c?.hd_strategy ?? "",
    "Authority": c?.hd_authority ?? "",
    "Profile": c?.hd_profile ?? "",
    "Definition": c?.hd_definition ?? "",
    "Why they want to host": a.why_host,
    "Astrology, manifestation and personal development": a.astrology_relationship,
    "The woman standing alone": a.scenario_answer,
    "The two women who only talk to each other": a.second_scenario,
    "1-2 events a month, hourly plus commission": practicalLabel(a.frequency_ok),
    "One unforgettable night": a.girls_night,
    "Dashboard": `${SITE_URL}/admin/irl-hosts?id=${a.id}`,
  };
  for (const [k, v] of Object.entries(row)) if (typeof v === "string") row[k] = safeCell(v);
  return row;
}

export async function sendApplicationToSheet(a: IrlSheetArgs): Promise<void> {
  const url = process.env.IRL_SHEET_WEBHOOK_URL;
  if (!url) return;
  try {
    const row = sheetRow(a);
    // Apps Script answers a POST with a redirect to its result, which fetch follows.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.IRL_SHEET_SECRET ?? "", headers: Object.keys(row), row }),
      signal: AbortSignal.timeout(20_000),
    });
    const text = await res.text();
    if (!res.ok || !text.includes('"ok":true')) {
      console.error("irl-sheet: row not written", { reference: a.reference, status: res.status, body: text.slice(0, 200) });
    }
  } catch (err) {
    console.error("irl-sheet: request failed", { reference: a.reference, error: err instanceof Error ? err.message : err });
  }
}
