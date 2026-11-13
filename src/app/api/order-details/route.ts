import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAndRecordRate, clientIp } from "@/lib/rate-limit";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { adminRecipients } from "@/lib/email/admin-notify";
import { ensurePendingOrder, offerNeedingDetails } from "@/lib/order-details";
import { britishDate } from "@/lib/format-date";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Behind /order/details, the page she lands on straight after paying for a report or Baddie Session.
//   GET  ?session_id=  -> which order this is and whether her birth details are already in
//   POST               -> saves her birth details and tells the team they have landed
// The Stripe checkout session id is the key: long, random, and only she has it (Stripe's redirect
// and her confirmation email).

const COLUMNS = "id, stripe_session_id, email, name, offer, promises_48h, birth_date, birth_time, birth_time_unknown, birth_place, submitted_at";
type Row = { id: string; stripe_session_id: string; email: string; name: string | null; offer: string; promises_48h: boolean; birth_date: string | null; birth_time: string | null; birth_time_unknown: boolean; birth_place: string | null; submitted_at: string | null };

const validSessionId = (v: unknown): v is string => typeof v === "string" && /^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(v);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Finds her order. Stripe's redirect can beat the webhook by a second or two, so when there is no
// row yet this checks the session with Stripe directly and creates it, rather than telling someone
// who has just paid that her order can't be found.
async function findOrder(admin: ReturnType<typeof createAdminClient>, sessionId: string): Promise<Row | null> {
  const read = async () => (await admin.from("order_birth_details").select(COLUMNS).eq("stripe_session_id", sessionId).maybeSingle()).data as Row | null;
  const existing = await read();
  if (existing) return existing;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
    if (session.payment_status !== "paid") return null;
    const offer = offerNeedingDetails(session.line_items?.data[0]?.price?.id);
    if (!offer) return null;
    await ensurePendingOrder(admin, session, offer);
    return await read();
  } catch {
    return null;
  }
}

const view = (row: Row) => ({
  offer: row.offer,
  firstName: (row.name ?? "").trim().split(/\s+/)[0] ?? "",
  promises48h: row.promises_48h,
  submitted: !!row.submitted_at,
  birth: row.submitted_at ? { date: row.birth_date, time: row.birth_time_unknown ? null : row.birth_time, place: row.birth_place } : null,
});

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!validSessionId(sessionId)) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const row = await findOrder(createAdminClient(), sessionId);
  if (!row) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(view(row));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const sessionId = body?.sessionId;
  if (!validSessionId(sessionId)) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const b = body?.birth && typeof body.birth === "object" ? (body.birth as Record<string, unknown>) : {};
  const date = typeof b.dateOfBirth === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.dateOfBirth) ? b.dateOfBirth : "";
  const timeUnknown = body?.timeUnknown === true;
  const time = !timeUnknown && typeof b.birthTime === "string" && /^\d{2}:\d{2}$/.test(b.birthTime) ? b.birthTime : "";
  const location = b.location && typeof b.location === "object" ? (b.location as Record<string, unknown>) : null;
  const place = location && typeof location.placeName === "string" ? location.placeName.slice(0, 200) : "";

  if (!date) return NextResponse.json({ error: "Pop in your birth date, babe" }, { status: 400 });
  if (!timeUnknown && !time) return NextResponse.json({ error: "Add your birth time, or tick the box if you don't know it" }, { status: 400 });
  if (!place) return NextResponse.json({ error: "Pick your birth place from the list so we can find the exact spot" }, { status: 400 });

  const admin = createAdminClient();
  const { allowed } = await checkAndRecordRate(admin, { bucket: "order-details", ip: clientIp(request), emailLimit: 20, ipLimit: 30, windowMinutes: 60 });
  if (!allowed) return NextResponse.json({ error: "Too many tries, give it a minute" }, { status: 429 });

  const row = await findOrder(admin, sessionId);
  if (!row) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (row.submitted_at) return NextResponse.json(view(row));

  // Only the first submit wins, so two tabs or a double tap can't alert the team twice.
  const { data: saved, error } = await admin.from("order_birth_details")
    .update({ birth_date: date, birth_time: time || null, birth_time_unknown: timeUnknown, birth_place: place, birth_location: location, submitted_at: new Date().toISOString() })
    .eq("id", row.id).is("submitted_at", null).select(COLUMNS).maybeSingle();
  if (error) {
    console.error("order details: save failed", error.message);
    return NextResponse.json({ error: "Something glitched, try again in a sec" }, { status: 500 });
  }
  if (!saved) return NextResponse.json(view({ ...row, submitted_at: new Date().toISOString(), birth_date: date, birth_time: time || null, birth_time_unknown: timeUnknown, birth_place: place }));

  const rows = [["Order", row.offer], ["Name", row.name ?? ""], ["Email", row.email], ["Date of birth", britishDate(date)], ["Time of birth", timeUnknown ? "She doesn't know it" : time], ["Place of birth", place], ["Stripe session", row.stripe_session_id]];
  const htmlContent = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;"><p><strong>Birth details are in for ${esc(row.offer)} 💜</strong> ${row.promises_48h ? "Her 48 hours start now." : "You have everything you need to start her prep."}</p><table cellpadding="6" style="border-collapse:collapse;">${rows.map(([k, v]) => `<tr><td style="border:1px solid #1a1a1a;font-weight:700;">${k}</td><td style="border:1px solid #1a1a1a;">${esc(v || "(not given)")}</td></tr>`).join("")}</table></div>`;
  for (const to of adminRecipients()) {
    const r = await sendBrevoEmail({ to: { email: to }, subject: `Birth details in: ${row.offer} for ${row.name || row.email}`, htmlContent, replyTo: { email: row.email, name: row.name ?? undefined } });
    if (!r.ok) console.error("order details: admin alert failed", { to, error: r.error });
  }

  return NextResponse.json(view(saved as Row));
}
