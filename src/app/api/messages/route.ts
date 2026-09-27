import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMemberNotification, sendMemberNotifications } from "@/lib/notify/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Direct messages between a member and Betty. One thread per member (direct_messages.member_id).
//
// Everything goes through here rather than straight from the browser, because the rules are about
// who someone is: a member only ever reads and writes her own thread, and only an admin can read
// every thread or write into one. The table has no write policies at all (see
// supabase/migrations/2026-09-27-direct-messages.sql), so this route is the only way in.

const MAX_LENGTH = 4000;
// Generous for a real conversation, and a ceiling on anyone trying to flood Betty's inbox.
const MEMBER_MESSAGES_PER_HOUR = 30;

interface Row {
  id: string;
  member_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

async function whoIsAsking() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: me } = await admin.from("profiles").select("name, is_admin, blocked").eq("id", user.id).maybeSingle();
  if (me?.blocked) return null;
  return { id: user.id, name: ((me?.name as string | null) ?? "").trim() || "a member", isAdmin: !!me?.is_admin, admin };
}

const shape = (r: Row, viewerId: string) => ({
  id: r.id,
  body: r.body,
  createdAt: r.created_at,
  fromMe: r.sender_id === viewerId,
  fromMember: r.sender_id === r.member_id,
  read: !!r.read_at,
});

export async function GET(request: NextRequest) {
  const me = await whoIsAsking();
  if (!me) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const { admin } = me;
  const memberParam = request.nextUrl.searchParams.get("member");

  // A member, or Betty opening one member's thread.
  if (!me.isAdmin || memberParam) {
    const memberId = me.isAdmin ? memberParam! : me.id;
    const { data, error } = await admin
      .from("direct_messages")
      .select("*")
      .eq("member_id", memberId)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) {
      console.error("messages: thread read failed", error.message);
      return NextResponse.json({ error: "could_not_load" }, { status: 500 });
    }
    // Opening the thread reads whatever the other side sent.
    const unreadFromOtherSide = (data as Row[]).filter((r) => !r.read_at && (me.isAdmin ? r.sender_id === r.member_id : r.sender_id !== me.id));
    if (unreadFromOtherSide.length > 0) {
      await admin.from("direct_messages").update({ read_at: new Date().toISOString() }).in("id", unreadFromOtherSide.map((r) => r.id));
    }
    let memberName: string | null = null;
    if (me.isAdmin) {
      const { data: p } = await admin.from("profiles").select("name").eq("id", memberId).maybeSingle();
      memberName = (p?.name as string | null) ?? null;
    }
    return NextResponse.json({ messages: (data as Row[]).map((r) => shape(r, me.id)), memberName });
  }

  // Betty's inbox: every thread, newest first, with what is still unread.
  const { data, error } = await admin.from("direct_messages").select("*").order("created_at", { ascending: false }).limit(3000);
  if (error) {
    console.error("messages: inbox read failed", error.message);
    return NextResponse.json({ error: "could_not_load" }, { status: 500 });
  }
  const threads = new Map<string, { memberId: string; last: Row; unread: number }>();
  for (const r of data as Row[]) {
    const t = threads.get(r.member_id) ?? { memberId: r.member_id, last: r, unread: 0 };
    if (r.sender_id === r.member_id && !r.read_at) t.unread++;
    threads.set(r.member_id, t);
  }
  const ids = [...threads.keys()];
  const { data: people } = ids.length ? await admin.from("profiles").select("id, name").in("id", ids) : { data: [] };
  const names = new Map((people ?? []).map((p) => [p.id as string, (p.name as string | null) ?? "a member"]));
  return NextResponse.json({
    threads: [...threads.values()].map((t) => ({
      memberId: t.memberId,
      name: names.get(t.memberId) ?? "a member",
      lastBody: t.last.body.slice(0, 140),
      lastAt: t.last.created_at,
      lastFromMember: t.last.sender_id === t.memberId,
      unread: t.unread,
    })),
  });
}

export async function POST(request: NextRequest) {
  const me = await whoIsAsking();
  if (!me) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const { admin } = me;

  let payload: { body?: string; member?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const body = (payload.body ?? "").trim();
  if (!body) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (body.length > MAX_LENGTH) return NextResponse.json({ error: "too_long" }, { status: 400 });

  // Betty replying into a member's thread.
  if (me.isAdmin && payload.member) {
    const memberId = payload.member;
    const { data: target } = await admin.from("profiles").select("id, name, blocked").eq("id", memberId).maybeSingle();
    if (!target || target.blocked) return NextResponse.json({ error: "unknown_member" }, { status: 400 });
    const { data: row, error } = await admin.from("direct_messages").insert({ member_id: memberId, sender_id: me.id, body }).select("*").single();
    if (error) {
      console.error("messages: reply insert failed", error.message);
      return NextResponse.json({ error: "could_not_send" }, { status: 500 });
    }
    await sendMemberNotification(admin, {
      userId: memberId,
      kind: "message",
      title: `${me.name} replied to your message`,
      body,
      link: "/messages",
      actor: me.name,
      email: true,
      emailSubject: `${me.name} replied to your message 💌`,
      emailCta: "READ IT",
    });
    return NextResponse.json({ ok: true, message: shape(row as Row, me.id) });
  }

  // A member writing to Betty.
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("direct_messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", me.id)
    .gte("created_at", hourAgo);
  if ((count ?? 0) >= MEMBER_MESSAGES_PER_HOUR) return NextResponse.json({ error: "slow_down" }, { status: 429 });

  const { data: row, error } = await admin.from("direct_messages").insert({ member_id: me.id, sender_id: me.id, body }).select("*").single();
  if (error) {
    console.error("messages: member insert failed", error.message);
    return NextResponse.json({ error: "could_not_send" }, { status: 500 });
  }

  const { data: admins } = await admin.from("profiles").select("id").eq("is_admin", true);
  await sendMemberNotifications(
    admin,
    (admins ?? []).map((a) => ({
      userId: a.id as string,
      kind: "message" as const,
      title: `${me.name} sent you a message`,
      body,
      link: `/admin/messages?member=${me.id}`,
      actor: me.name,
      email: true,
      emailSubject: `New message from ${me.name} 💌`,
      emailCta: "REPLY",
    }))
  );
  return NextResponse.json({ ok: true, message: shape(row as Row, me.id) });
}
