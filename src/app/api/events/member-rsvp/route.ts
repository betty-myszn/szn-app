import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";
import { getEvent } from "@/lib/events";
import { ACCESS_GRANTING_STATUSES } from "@/lib/stripe-tiers";
import { sendEventBookingConfirmation, sendEventBookingAdminAlert } from "@/lib/email/event-booking";

export const runtime = "nodejs";

// A free seat for members whose membership includes the event (the LA coven, $88/month, for LA
// events). Stripe is the source of truth: her email must belong to a customer with a live
// subscription on one of the event's freeForPriceIds, which also covers members who paid but never
// made an app account. The $44 online coven does not count. The seat is saved in event_bookings as
// status "paid" with amount 0, so paid tickets and member seats sit in one list for the headcount.

async function hasIncludedMembership(email: string, priceIds: string[]): Promise<boolean> {
  if (!process.env.STRIPE_SECRET_KEY) return false;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const customers = await stripe.customers.list({ email, limit: 10 });
  for (const c of customers.data) {
    const subs = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 20 });
    for (const s of subs.data) {
      if (!ACCESS_GRANTING_STATUSES.has(s.status)) continue;
      if (s.items.data.some((i) => priceIds.includes(i.price.id))) return true;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const event = getEvent(String(body?.slug ?? ""));
  if (!event || event.status !== "published" || !event.freeForPriceIds?.length) return NextResponse.json({ error: "This event isn't open for member seats" }, { status: 400 });

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: "That email doesn't look quite right, babe" }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Pop your name in, babe" }, { status: 400 });

  const b = body?.birth && typeof body.birth === "object" ? body.birth : null;
  const timeUnknown = body?.timeUnknown === true;
  const birthDate = typeof b?.dateOfBirth === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.dateOfBirth) ? b.dateOfBirth : "";
  const birthTime = !timeUnknown && typeof b?.birthTime === "string" && /^\d{2}:\d{2}$/.test(b.birthTime) ? b.birthTime : "";
  const location = b?.location && typeof b.location === "object" ? b.location : null;
  const place = location && typeof location.placeName === "string" ? location.placeName.slice(0, 200) : "";
  if (event.collectsBirth && (!birthDate || !place || (!timeUnknown && !birthTime)))
    return NextResponse.json({ error: "Your birth date, time and place are needed for your mini reading" }, { status: 400 });

  const admin = createAdminClient();
  const { allowed } = await checkAndRecordRate(admin, { bucket: "event-member-rsvp", email, ip: clientIp(request), emailLimit: 10, ipLimit: 30, windowMinutes: 60 });
  if (!allowed) return NextResponse.json({ error: "Too many tries, give it a minute" }, { status: 429 });

  let member = false;
  try {
    member = await hasIncludedMembership(email, event.freeForPriceIds);
  } catch (err) {
    console.error("member-rsvp: Stripe lookup failed", err);
    return NextResponse.json({ error: "Something glitched checking your membership, try again in a sec" }, { status: 502 });
  }
  if (!member)
    return NextResponse.json({ notMember: true, error: "We couldn't find an LA coven membership on that email. Use the email you joined with, or grab a ticket below." }, { status: 403 });

  // One seat per member: a repeat claim gets the same happy answer without a second email.
  const { data: existing } = await admin.from("event_bookings").select("id").eq("event_slug", event.slug).eq("email", email).eq("status", "paid").maybeSingle();
  if (existing) return NextResponse.json({ ok: true, already: true });

  const { data, error } = await admin
    .from("event_bookings")
    .insert({
      event_slug: event.slug, email, name,
      birth_date: birthDate || null, birth_time: birthTime || null, birth_time_unknown: timeUnknown,
      birth_place: place || null, birth_location: location,
      status: "paid", amount_total: 0, currency: "usd", paid_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error || !data) {
    console.error("member-rsvp insert failed", error);
    return NextResponse.json({ error: "Something glitched saving your seat, try again in a sec" }, { status: 500 });
  }

  const sent = await sendEventBookingConfirmation(event, email, name, true);
  if (sent.ok) await admin.from("event_bookings").update({ confirmation_sent_at: new Date().toISOString() }).eq("id", data.id);
  else console.error("member-rsvp confirmation failed", sent.error);
  await sendEventBookingAdminAlert(event, { email, name, birthPlace: place || null, hasBirth: !!birthDate, member: true });

  return NextResponse.json({ ok: true });
}
