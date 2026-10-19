import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";
import { getEvent } from "@/lib/events";

export const runtime = "nodejs";

// Saves the booking (with birth details for report events) BEFORE payment, then hands back the
// event's Stripe Payment Link tagged with this booking's id. The webhook matches the paid session
// back to the row through client_reference_id ("evt_<booking id>").

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const event = getEvent(String(body?.slug ?? ""));
  if (!event || event.status !== "published" || !event.checkoutUrl) return NextResponse.json({ error: "This event isn't open for booking" }, { status: 400 });

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
    return NextResponse.json({ error: "Your birth date, time and place are needed for your report" }, { status: 400 });

  const admin = createAdminClient();
  const { allowed } = await checkAndRecordRate(admin, { bucket: "event-book", email, ip: clientIp(request), emailLimit: 10, ipLimit: 30, windowMinutes: 60 });
  if (!allowed) return NextResponse.json({ error: "Too many tries, give it a minute" }, { status: 429 });

  const { data, error } = await admin
    .from("event_bookings")
    .insert({
      event_slug: event.slug, email, name,
      birth_date: birthDate || null, birth_time: birthTime || null, birth_time_unknown: timeUnknown,
      birth_place: place || null, birth_location: location,
    })
    .select("id")
    .single();
  if (error || !data) {
    console.error("event booking insert failed", error);
    return NextResponse.json({ error: "Something glitched saving your details, try again in a sec" }, { status: 500 });
  }

  const url = new URL(event.checkoutUrl);
  url.searchParams.set("client_reference_id", `evt_${data.id}`);
  url.searchParams.set("prefilled_email", email);
  return NextResponse.json({ url: url.toString() });
}
