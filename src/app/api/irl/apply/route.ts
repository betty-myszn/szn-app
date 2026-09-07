import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { buildReference } from "@/lib/irl";

export const runtime = "nodejs";

// MY SZN IRL host applications. Public, unauthenticated, and writing to a table the browser cannot
// touch, so everything here runs service-role behind validation rather than trusting the form.
//
// Nothing internal is ever returned: status, ratings and notes are decided in the dashboard and the
// response to an applicant carries her reference and nothing else.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Every free-text answer, with the minimum length that means "answered" rather than "dismissed".
const TEXT_FIELDS: { key: string; min: number; label: string }[] = [
  { key: "about_you", min: 20, label: "Tell us a little about yourself" },
  { key: "why_host", min: 20, label: "Why you'd love to host" },
  { key: "astrology_relationship", min: 20, label: "Your relationship with astrology" },
  { key: "community_means", min: 20, label: "What community means to you" },
  { key: "scenario_answer", min: 20, label: "The dinner scenario" },
  { key: "local_ideas", min: 20, label: "Three places in your city" },
  { key: "girls_night", min: 10, label: "The ultimate girls' night" },
];

const ENUMS: Record<string, string[]> = {
  astrology_level: ["very_confident", "know_my_chart", "basics", "learning", "new_but_curious"],
  hosting_experience: ["professionally", "casually", "a_little", "never_but_keen"],
  frequency_ok: ["yes", "usually", "discuss"],
  evenings_ok: ["yes", "mostly", "occasionally"],
  travel_ok: ["yes", "depends"],
  side_role_ok: ["yes", "no"],
  partnerships_interest: ["yes", "potentially", "hosting_only"],
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
  const speaking = Number(body.speaking_comfort);
  if (!Number.isInteger(speaking) || speaking < 1 || speaking > 5) {
    return NextResponse.json({ error: "missing_choice", field: "speaking_comfort" }, { status: 400 });
  }

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
    instagram: str(body.instagram) || null,
    tiktok: str(body.tiktok) || null,
    linkedin: str(body.linkedin) || null,
    city_slug: citySlug,
    other_city: citySlug === "other" ? otherCity : null,
    occupation,
    about_you: str(body.about_you),
    why_host: str(body.why_host),
    astrology_relationship: str(body.astrology_relationship),
    astrology_level: str(body.astrology_level),
    community_means: str(body.community_means),
    speaking_comfort: speaking,
    hosting_experience: str(body.hosting_experience),
    relevant_experience: str(body.relevant_experience) || null,
    scenario_answer: str(body.scenario_answer),
    local_ideas: str(body.local_ideas),
    frequency_ok: str(body.frequency_ok),
    evenings_ok: str(body.evenings_ok),
    travel_ok: str(body.travel_ok),
    side_role_ok: str(body.side_role_ok),
    partnerships_interest: str(body.partnerships_interest),
    girls_night: str(body.girls_night),
    status,
    updated_at: new Date().toISOString(),
  };

  // One live application per email per city, enforced by a unique index. A second submission
  // updates rather than duplicating, which is the real backstop behind the form's double-click
  // guard: a doubled request cannot create a second row even if it beats the button being disabled.
  const { error } = await admin
    .from("irl_host_applications")
    .upsert(row, { onConflict: "email,city_slug", ignoreDuplicates: false });
  if (error) {
    console.error("irl/apply: insert failed", error.message);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  // Confirmation, fire-and-forget: a Brevo hiccup must not tell her the application failed when it
  // is already saved.
  void sendApplicantConfirmation({ email, name: fullName, citySlug, otherCity, reference });

  return NextResponse.json({ ok: true, reference });
}

async function sendApplicantConfirmation(a: {
  email: string; name: string; citySlug: string; otherCity: string; reference: string;
}) {
  const cityName =
    a.citySlug === "london" ? "London" :
    a.citySlug === "new-york" ? "New York" :
    a.citySlug === "los-angeles" ? "Los Angeles" : a.otherCity || "your city";
  const first = a.name.split(/\s+/)[0] || "babe";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:560px;">
      <h2 style="font-size:22px;margin:0 0 14px;">We've got it &#127769;</h2>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${escapeHtml(first)},</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
        Thanks for applying to become a MY SZN IRL Host in <strong>${escapeHtml(cityName)}</strong>.
        Your application is in and shortlisted applicants will be contacted about the next stage.
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

function escapeHtml(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
