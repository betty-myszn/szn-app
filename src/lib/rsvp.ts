import { createClient } from "@/lib/supabase/client";

export type RsvpStatus = "going" | "not-going";

export interface RsvpRecord {
  eventId: string;
  status: RsvpStatus;
  respondedAt: string;
  reminderEmail: boolean;
  reminderPush: boolean;
}

export async function getRsvp(eventId: string): Promise<RsvpRecord | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase
    .from("rsvps")
    .select("*")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle();
  if (!row) return null;

  return {
    eventId: row.event_id,
    status: row.status as RsvpStatus,
    respondedAt: row.responded_at,
    reminderEmail: row.reminder_email,
    reminderPush: row.reminder_push,
  };
}

// Reminders default on the moment she RSVPs going, she can turn either off from there, mirrors
// the "on by default, opt out" pattern most event platforms use.
export async function setRsvpStatus(eventId: string, status: RsvpStatus): Promise<RsvpRecord | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const existing = await getRsvp(eventId);
  const record = {
    user_id: user.id,
    event_id: eventId,
    status,
    responded_at: new Date().toISOString(),
    reminder_email: existing?.reminderEmail ?? true,
    reminder_push: existing?.reminderPush ?? true,
  };
  await supabase.from("rsvps").upsert(record);

  return {
    eventId,
    status,
    respondedAt: record.responded_at,
    reminderEmail: record.reminder_email,
    reminderPush: record.reminder_push,
  };
}

export async function setReminderPrefs(
  eventId: string,
  prefs: { reminderEmail?: boolean; reminderPush?: boolean }
): Promise<RsvpRecord | null> {
  const existing = await getRsvp(eventId);
  if (!existing) return null;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const updated: RsvpRecord = { ...existing, ...prefs };
  await supabase
    .from("rsvps")
    .update({
      reminder_email: updated.reminderEmail,
      reminder_push: updated.reminderPush,
    })
    .eq("user_id", user.id)
    .eq("event_id", eventId);
  return updated;
}

// For workshops that don't have a confirmed date yet, "get notified" just records interest so
// the button has a real effect, mirrors the RSVP pattern rather than doing nothing.
export async function isNotifyMe(eventId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: row } = await supabase
    .from("notify_me")
    .select("event_id")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle();
  return !!row;
}

export async function setNotifyMe(eventId: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("notify_me").upsert({ user_id: user.id, event_id: eventId });
}

// Real attendees only, this fills in as other real members RSVP once the RSVP table exposes
// shared read access, for now every member can only see her own RSVP row (row-level security),
// so this stays limited to "am I going" rather than a full attendee list.
export function getAttendees(eventId: string, memberName?: string, isGoing?: boolean): string[] {
  void eventId;
  if (isGoing && memberName) return [memberName];
  return [];
}

export interface IcsEvent {
  id: string;
  title: string;
  description: string;
  startIso: string; // ISO datetime, must include an explicit UTC offset or "Z"
  durationMinutes: number;
  location: string;
}

function toIcsDate(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(event: IcsEvent): string {
  const start = new Date(event.startIso);
  const end = new Date(start.getTime() + event.durationMinutes * 60000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MY SZN//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@myszn.app`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(start.toISOString())}`,
    `DTEND:${toIcsDate(end.toISOString())}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
