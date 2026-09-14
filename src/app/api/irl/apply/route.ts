import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { IANAZone } from "luxon";
import { buildReference } from "@/lib/irl";
import { summariseApplicantChart } from "@/lib/irl-chart";
import { sendIrlApplicationAlert } from "@/lib/email/admin-notify";
import { sendApplicationToSheet } from "@/lib/irl-sheet";

export const runtime = "nodejs";

// MY SZN IRL host applications. Public, unauthenticated, and writing to a table the browser cannot
// touch, so everything here runs service-role behind validation rather than trusting the form.
//
// Nothing internal is ever returned: status, ratings and notes are decided in the dashboard and the
// response to an applicant carries her reference and nothing else.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Every free-text answer, with the minimum length that means "answered" rather than "dismissed", in
// the order she meets them so the first blank one is the one named.
const TEXT_FIELDS: { key: string; min: number; label: string }[] = [
  { key: "occupation", min: 20, label: "Your work, experience and skills" },
  { key: "why_host", min: 20, label: "Why you want to host" },
  { key: "astrology_relationship", min: 20, label: "Your relationship with astrology" },
  { key: "scenario_answer", min: 20, label: "The woman standing alone" },
  { key: "second_scenario", min: 20, label: "The two women at the table" },
  { key: "girls_night", min: 10, label: "Your unforgettable night" },
];

// The one practical question: 1-2 evening or weekend events a month around her city, paid hourly
// plus commission. Kept in frequency_ok.
const ENUMS: Record<string, string[]> = {
  frequency_ok: ["yes", "discuss"],
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // Honeypot: hidden from humans. A bot fills it, and gets a success it can do nothing with.
  if (str(body.company)) return NextResponse.json({ ok: true, reference: null });

  const fullName = str(body.full_name);
  const email = str(body.email).toLowerCase();
  const citySlug = str(body.city_slug);
  const occupation = str(body.occupation);

  if (!fullName) return NextResponse.json({ error: "name_required" }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "email_required" }, { status: 400 });
  if (!occupation) return NextResponse.json({ error: "occupation_required" }, { status: 400 });
  const instagram = str(body.instagram);
  if (!instagram) return NextResponse.json({ error: "instagram_required" }, { status: 400 });

  const admin = createAdminClient();

  // The city has to be one we actually run, read from the table rather than a list in code, so
  // opening a fourth city needs no deploy.
  const { data: city } = await admin.from("irl_cities").select("slug, recruiting").eq("slug", citySlug).maybeSingle();
  if (!city) return NextResponse.json({ error: "city_required" }, { status: 400 });
  const otherCity = str(body.other_city);
  if (citySlug === "other" && !otherCity) {
    return NextResponse.json({ error: "other_city_required" }, { status: 400 });
  }

  for (const f of TEXT_FIELDS) {
    if (str(body[f.key]).length < f.min) {
      return NextResponse.json({ error: "too_short", field: f.key, label: f.label }, { status: 400 });
    }
  }
  for (const [key, allowed] of Object.entries(ENUMS)) {
    if (!allowed.includes(str(body[key]))) {
      return NextResponse.json({ error: "missing_choice", field: key }, { status: 400 });
    }
  }

  // Birth details, asked the same way the free chart asks: a date, a time with an "approximate" tick
  // for anyone who is guessing, and a place picked from the list, which is what carries the
  // coordinates and timezone the chart is calculated from.
  const birthDate = str(body.birth_date);
  const born = /^\d{4}-\d{2}-\d{2}$/.test(birthDate) ? new Date(`${birthDate}T00:00:00Z`) : null;
  if (!born || isNaN(born.getTime()) || born.getUTCFullYear() < 1920 || born > new Date()) {
    return NextResponse.json({ error: "birth_date_required" }, { status: 400 });
  }
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(str(body.birth_time));
  if (!timeMatch || Number(timeMatch[1]) > 23 || Number(timeMatch[2]) > 59) {
    return NextResponse.json({ error: "birth_time_required" }, { status: 400 });
  }
  const birthTime = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
  const birthTimeApproximate = body.birth_time_approximate === true;
  const birthPlace = str(body.birth_place);
  const lat = Number(body.birth_lat), lng = Number(body.birth_lng), tz = str(body.birth_tz);
  const located = typeof body.birth_lat === "number" && typeof body.birth_lng === "number" &&
    Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lng) && Math.abs(lng) <= 180 &&
    IANAZone.isValidZone(tz);
  if (!birthPlace || !located) return NextResponse.json({ error: "birth_place_required" }, { status: 400 });
  const chartSummary = summariseApplicantChart({
    name: fullName, birthDate, birthTime, approximate: birthTimeApproximate, place: birthPlace, lat, lng, tz,
  });

  // A public form with no payment behind it is a spam target, so throttle by email and IP the same
  // way the signup routes do.
  const { allowed } = await checkAndRecordRate(admin, {
    bucket: "irl_apply", email, ip: clientIp(request), emailLimit: 3, ipLimit: 12, windowMinutes: 60,
  });
  if (!allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  // An application from a city we are not recruiting in is an expression of interest, parked on its
  // own status rather than dropped into the live London/NY/LA pipeline.
  const status = city.recruiting ? "new" : "other_city_waitlist";

  const { count } = await admin
    .from("irl_host_applications")
    .select("id", { count: "exact", head: true })
    .eq("city_slug", citySlug);
  const reference = buildReference(citySlug, (count ?? 0) + 1);

  const row = {
    reference,
    full_name: fullName,
    email,
    phone: str(body.phone) || null,
    instagram,
    tiktok: str(body.tiktok) || null,
    linkedin: str(body.linkedin) || null,
    city_slug: citySlug,
    other_city: citySlug === "other" ? otherCity : null,
    occupation,
    why_host: str(body.why_host),
    astrology_relationship: str(body.astrology_relationship),
    birth_date: birthDate,
    birth_time: birthTime,
    birth_time_approximate: birthTimeApproximate,
    birth_place: birthPlace,
    birth_lat: lat,
    birth_lng: lng,
    birth_tz: tz,
    chart_summary: chartSummary,
    scenario_answer: str(body.scenario_answer),
    second_scenario: str(body.second_scenario),
    frequency_ok: str(body.frequency_ok),
    girls_night: str(body.girls_night),
    status,
    updated_at: new Date().toISOString(),
  };

  // One live application per email per city, enforced by a unique index. A second submission
  // updates rather than duplicating, which is the real backstop behind the form's double-click
  // guard: a doubled request cannot create a second row even if it beats the button being disabled.
  const { data: saved, error } = await admin
    .from("irl_host_applications")
    .upsert(row, { onConflict: "email,city_slug", ignoreDuplicates: false })
    .select("id, submitted_at")
    .single();
  if (error) {
    console.error("irl/apply: insert failed", error.message);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  // Confirmation, fire-and-forget: a Brevo hiccup must not tell her the application failed when it
  // is already saved.
  void sendApplicantConfirmation({ email, name: fullName, citySlug, otherCity, reference });
  // And the whole application, chart included, to the team inbox. Same rule: never fails her.
  void sendIrlApplicationAlert({ ...row, id: saved.id, city: cityLabel(citySlug, otherCity) });
  // And a row in Betty's Google Sheet, when one is connected. Same rule again.
  void sendApplicationToSheet({ ...row, id: saved.id, submitted_at: saved.submitted_at, city: cityLabel(citySlug, otherCity) });

  return NextResponse.json({ ok: true, reference });
}

async function sendApplicantConfirmation(a: {
  email: string; name: string; citySlug: string; otherCity: string; reference: string;
}) {
  const cityName = cityLabel(a.citySlug, a.otherCity) || "your city";
  const first = a.name.split(/\s+/)[0] || "babe";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:560px;">
      <h2 style="font-size:22px;margin:0 0 14px;">We've got it &#127769;</h2>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${escapeHtml(first)},</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
        Thank you so much for getting in touch about becoming a MY SZN IRL Host in
        <strong>${escapeHtml(cityName)}</strong>. We&rsquo;ll be conducting interviews on Zoom over the
        next few weeks, and we&rsquo;ll come back to you either way.
      </p>
      <p style="font-size:14px;line-height:1.7;color:#6b6b6b;margin:0 0 16px;">
        Your reference is <strong>${escapeHtml(a.reference)}</strong>, worth keeping if you need to
        get in touch about it.
      </p>
      <p style="font-size:16px;line-height:1.7;margin:0;">Betty xx</p>
    </div>`;

  const result = await sendBrevoEmail({
    to: { email: a.email, name: a.name },
    subject: "We've got your MY SZN Host application \u{1F319}",
    htmlContent: html,
  });
  if (!result.ok) console.error("irl/apply: confirmation email failed", result.error);
}

function cityLabel(slug: string, other: string): string {
  return slug === "london" ? "London" : slug === "new-york" ? "New York"
    : slug === "los-angeles" ? "Los Angeles" : other;
}

function escapeHtml(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
