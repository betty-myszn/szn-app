import { createClient } from "@/lib/supabase/client";

// The activity feed behind the nav bell, distinct from admin broadcasts (the "messages" envelope).
// Rows are created server-side by database triggers (see supabase/schema.sql) when someone replies
// to or reacts to your post, or a new poll opens. RLS scopes every read/update to the current
// member, so a plain select returns only this member's notifications.

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

function mapRow(r: {
  id: string; type: string; title: string; body: string | null; link: string | null; read: boolean; created_at: string;
}): AppNotification {
  return { id: r.id, type: r.type, title: r.title, body: r.body, link: r.link, read: r.read, createdAt: r.created_at };
}

// Resilient by design: returns [] on any error (e.g. before the migration has been applied) so the
// nav bell can never throw or block the rest of the header from rendering.
export async function loadNotifications(limit = 30): Promise<AppNotification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, link, read, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []).map(mapRow);
}

export function unreadCount(list: AppNotification[]): number {
  return list.filter((n) => !n.read).length;
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
}

export function notificationTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
