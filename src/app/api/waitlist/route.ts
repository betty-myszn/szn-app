import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";
import { OFFERS, isOfferSlug, waitlistListId } from "@/lib/offers";
import { sendWaitlistConfirmation } from "@/lib/email/waitlist-confirm";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";

export const runtime = "nodejs";

const BREVO_API = "https://api.brevo.com/v3";

// One endpoint for every offer waitlist. Two writes, in this order:
//   1. Supabase waitlist_signups, our own record (unique on email + offer, so a repeat is a no-op)
//   2. Brevo: the contact is upserted, tagged SIGNUP_SOURCE "waitlist-<offer>", and WAITLIST_INTERESTS
//      accumulates every offer she's joined, so one contact can be segmented by any of them. Filed on
//      the offer's own list once Betty sets its id (BREVO_LIST_<OFFER>); until then she's saved + tagged.
// Deliberately separate from /api/subscribe: that route's "waitlist" sources fire the old membership
// n8n workflow, which must never see these.

async function brevo(path: string, opts: RequestInit = {}) {
  return fetch(`${BREVO_API}${path}`, {
    ...opts,
    headers: { "api-key": process.env.BREVO_API_KEY!, "Content-Type": "application/json", ...opts.headers },
  });
}

interface Birth { dateOfBirth: string; birthTime: string; birthTimeApproximate: boolean; place: string; location: Record<string, unknown> | null }

/** The report waitlists send birth details; anything malformed is dropped rather than failing the signup. */
function parseBirth(b: unknown): Birth | null {
  if (!b || typeof b !== "object") return null;
  const o = b as Record<string, unknown>;
  const dateOfBirth = typeof o.dateOfBirth === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.dateOfBirth) ? o.dateOfBirth : "";
  if (!dateOfBirth) return null;
  const birthTime = typeof o.birthTime === "string" && /^\d{2}:\d{2}$/.test(o.birthTime) ? o.birthTime : "";
  const loc = o.location && typeof o.location === "object" ? (o.location as Record<string, unknown>) : null;
  const place = loc && typeof loc.placeName === "string" ? loc.placeName.slice(0, 200) : "";
  return { dateOfBirth, birthTime, birthTimeApproximate: o.birthTimeApproximate === true, place, location: loc };
}

async function syncToBrevo(email: string, name: string, offer: string, listId: number | null, birth: Birth | null): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) {
    console.error("waitlist: BREVO_API_KEY not set", { offer });
    return false;
  }
  try {
    for (const a of ["SIGNUP_SOURCE", "WAITLIST_INTERESTS", "DATE_OF_BIRTH", "BIRTH_TIME", "PLACE_OF_BIRTH"]) {
      await brevo(`/contacts/attributes/normal/${a}`, { method: "POST", body: JSON.stringify({ type: "text" }) }).catch(() => null);
    }
    let interests: string[] = [];
    const existing = await brevo(`/contacts/${encodeURIComponent(email)}`);
    if (existing.ok) {
      const c = await existing.json().catch(() => ({}));
      const prev = c?.attributes?.WAITLIST_INTERESTS;
      if (typeof prev === "string" && prev) interests = prev.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (!interests.includes(offer)) interests.push(offer);

    const attributes: Record<string, string> = { SIGNUP_SOURCE: `waitlist-${offer}`, WAITLIST_INTERESTS: interests.join(",") };
    if (birth) {
      attributes.DATE_OF_BIRTH = birth.dateOfBirth;
      if (birth.birthTime) attributes.BIRTH_TIME = birth.birthTimeApproximate ? `${birth.birthTime} (approx)` : birth.birthTime;
      if (birth.place) attributes.PLACE_OF_BIRTH = birth.place;
    }
    if (name) {
      attributes.FIRSTNAME = name.split(" ")[0];
      if (name.includes(" ")) attributes.LASTNAME = name.split(" ").slice(1).join(" ");
    }
    const res = await brevo("/contacts", {
      method: "POST",
      body: JSON.stringify({ email, attributes, ...(listId ? { listIds: [listId] } : {}), updateEnabled: true }),
    });
    if (res.ok) return true;
    const err = await res.json().catch(() => ({}));
    if (err.code === "duplicate_parameter") return true;
    console.error("waitlist: Brevo error", res.status, JSON.stringify(err).slice(0, 300), { offer, listId });
    return false;
  } catch (e) {
    console.error("waitlist: Brevo threw", e instanceof Error ? e.message : e);
    return false;
  }
}

// Waitlists Betty gets an email about the moment someone new joins (sent through Brevo).
const ALERT_OFFERS: string[] = ["baddie-coven", "baddie-coven-la"];

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendSignupAlert(offer: string, email: string, name: string, answer: string, place: string) {
  const offerName = (OFFERS[offer as keyof typeof OFFERS]?.name ?? offer).replace(/^The /, "");
  const htmlContent = `<p>Someone new just joined the <strong>${esc(offerName)}</strong> waitlist 💜</p>
<p><strong>Name:</strong> ${esc(name || "(not given)")}<br><strong>Email:</strong> ${esc(email)}${place ? `<br><strong>Born in:</strong> ${esc(place)}` : ""}</p>
${answer ? `<p><strong>Their answer:</strong><br>${esc(answer)}</p>` : ""}
<p>Every signup is in /admin/waitlists.</p>`;
  for (const to of adminRecipients()) {
    const r = await sendBrevoEmail({ to: { email: to }, subject: `🦄 New ${offerName} waitlist signup: ${name || email}`, htmlContent, replyTo: { email, name: name || undefined } });
    if (!r.ok) console.error("waitlist: admin alert failed", { offer, to, error: r.error });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const answer = typeof body?.answer === "string" ? body.answer.trim().slice(0, 2000) : "";
  const offer = body?.offer;
  const birth = parseBirth(body?.birth);

  if (!isOfferSlug(offer)) return NextResponse.json({ error: "Unknown waitlist" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return NextResponse.json({ error: "That email doesn't look quite right, babe" }, { status: 400 });

  // Birth details are required on every waitlist: date and place at minimum (time can be unknown).
  if (!birth || !birth.place) return NextResponse.json({ error: "Pop in your birth date and place, babe" }, { status: 400 });

  const admin = createAdminClient();
  const { allowed } = await checkAndRecordRate(admin, {
    bucket: "waitlist", email, ip: clientIp(request), emailLimit: 12, ipLimit: 30, windowMinutes: 60,
  });
  if (!allowed) return NextResponse.json({ error: "Too many tries, give it a minute" }, { status: 429 });

  // Duplicate = already on this list. Same happy confirmation, no second row.
  const { data: existing } = await admin.from("waitlist_signups").select("id").eq("email", email).eq("offer", offer).maybeSingle();
  const brevoOk = await syncToBrevo(email, name, offer, waitlistListId(offer), birth);

  if (existing) {
    if (brevoOk) await admin.from("waitlist_signups").update({ brevo_ok: true }).eq("id", existing.id);
    return NextResponse.json({ ok: true, already: true });
  }

  const { error } = await admin.from("waitlist_signups").insert({
    email, name: name || null, offer, answer: answer || null, brevo_ok: brevoOk,
    ...(birth ? {
      birth_date: birth.dateOfBirth, birth_time: birth.birthTime || null,
      birth_time_approximate: birth.birthTimeApproximate, birth_place: birth.place || null, birth_location: birth.location,
    } : {}),
  });
  if (error && error.code !== "23505") {
    console.error("waitlist: insert failed", error.message, { offer });
    // Brevo still has her, so she isn't lost; only fail the request if neither write landed.
    if (!brevoOk) return NextResponse.json({ error: "Something glitched, try again in a sec" }, { status: 500 });
  }
  // First signup only (a duplicate returned above, and a 23505 race means another request already
  // sent it). Never blocks the confirmation on screen: a failed send is logged, not surfaced.
  if (error?.code !== "23505") {
    const sent = await sendWaitlistConfirmation(offer, email, name.split(" ")[0] ?? "");
    if (!sent.ok) console.error("waitlist: confirmation email failed", sent.error, { offer });
    if (ALERT_OFFERS.includes(offer)) await sendSignupAlert(offer, email, name, answer, birth?.place ?? "");
  }
  console.log("waitlist: signup", { offer: OFFERS[offer].slug, brevoOk });
  return NextResponse.json({ ok: true, already: error?.code === "23505" });
}
