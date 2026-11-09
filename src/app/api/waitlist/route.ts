import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";
import { OFFERS, isOfferSlug } from "@/lib/offers";
import { sendWaitlistConfirmation } from "@/lib/email/waitlist-confirm";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";
import { SOLSTRAL_WAITLIST_LISTS, syncContactToSolstral } from "@/lib/solstral";

export const runtime = "nodejs";

// One endpoint for every offer waitlist. Two writes:
//   1. Supabase waitlist_signups, our own record (unique on email + offer, so a repeat is a no-op)
//   2. Solstral: the contact is upserted and filed on the offer's list.
// Deliberately separate from /api/subscribe: that route's "waitlist" sources fire the old membership
// n8n workflow, which must never see these.

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

// Waitlists Betty gets an email about the moment someone new joins.
const ALERT_OFFERS: string[] = ["baddie-coven", "baddie-coven-la", "retreat", "mastermind"];

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendSignupAlert(offer: string, email: string, name: string, answer: string, place: string) {
  const offerName = (OFFERS[offer as keyof typeof OFFERS]?.name ?? offer).replace(/^The /, "");
  const isApp = offer === "retreat";
  const htmlContent = `<p>Someone new just ${isApp ? "applied for" : "joined the"} <strong>${esc(offerName)}</strong>${isApp ? "" : " waitlist"} 💜</p>
<p><strong>Name:</strong> ${esc(name || "(not given)")}<br><strong>Email:</strong> ${esc(email)}${place ? `<br><strong>Born in:</strong> ${esc(place)}` : ""}</p>
${answer ? `<p><strong>Their answers:</strong><br>${esc(answer).replace(/\n/g, "<br>")}</p>` : ""}
<p>Every signup is in /admin/waitlists.</p>`;
  for (const to of adminRecipients()) {
    const r = await sendBrevoEmail({ to: { email: to }, subject: isApp ? `🌴 New retreat application: ${name || email}` : `🦄 New ${offerName} waitlist signup: ${name || email}`, htmlContent, replyTo: { email, name: name || undefined } });
    if (!r.ok) console.error("waitlist: admin alert failed", { offer, to, error: r.error });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const answer = typeof body?.answer === "string" ? body.answer.trim().slice(0, 6000) : "";
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
  // Same person onto the offer's Solstral list. Fire-and-forget, never throws.
  void syncContactToSolstral({ email, name, list: SOLSTRAL_WAITLIST_LISTS[offer] ?? `${OFFERS[offer].name} waitlist` }).then((r) => {
    if (!r.ok) console.error("waitlist: solstral sync failed", r.error, { offer });
  });

  if (existing) {
    return NextResponse.json({ ok: true, already: true });
  }

  const { error } = await admin.from("waitlist_signups").insert({
    email, name: name || null, offer, answer: answer || null,
    ...(birth ? {
      birth_date: birth.dateOfBirth, birth_time: birth.birthTime || null,
      birth_time_approximate: birth.birthTimeApproximate, birth_place: birth.place || null, birth_location: birth.location,
    } : {}),
  });
  if (error && error.code !== "23505") {
    console.error("waitlist: insert failed", error.message, { offer });
    return NextResponse.json({ error: "Something glitched, try again in a sec" }, { status: 500 });
  }
  // First signup only (a duplicate returned above, and a 23505 race means another request already
  // sent it). Never blocks the confirmation on screen: a failed send is logged, not surfaced.
  if (error?.code !== "23505") {
    const sent = await sendWaitlistConfirmation(offer, email, name.split(" ")[0] ?? "");
    if (!sent.ok) console.error("waitlist: confirmation email failed", sent.error, { offer });
    if (ALERT_OFFERS.includes(offer)) await sendSignupAlert(offer, email, name, answer, birth?.place ?? "");
  }
  console.log("waitlist: signup", { offer: OFFERS[offer].slug });
  return NextResponse.json({ ok: true, already: error?.code === "23505" });
}
