import type { createAdminClient } from "@/lib/supabase/admin";
import { sendMemberNotifications } from "@/lib/notify/send";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Betty asked to hear about EVERY chat message and comment, bell + email, so nothing a member says
// goes unanswered. Admins who wrote it themselves, or who were already @-tagged in it (and so got the
// mention email), are skipped so nobody gets the same thing twice.
export async function alertAdmins(
  admin: SupabaseAdmin,
  a: { authorId: string; author: string; content: string; link: string; where: string; skip?: string[] }
): Promise<void> {
  const { data: admins, error } = await admin.from("profiles").select("id").eq("is_admin", true);
  if (error) {
    console.error("admin-alert: could not read admins", error.message);
    return;
  }
  const skip = new Set([a.authorId, ...(a.skip ?? [])]);
  const ids = (admins ?? []).map((r) => r.id as string).filter((id) => !skip.has(id));
  if (ids.length === 0) return;
  await sendMemberNotifications(
    admin,
    ids.map((userId) => ({
      userId,
      kind: "message" as const,
      title: `${a.author} posted ${a.where}`,
      body: a.content,
      link: a.link,
      actor: a.author,
      email: true,
      emailSubject: `${a.author} posted ${a.where} 💬`,
      emailCta: "GO AND REPLY",
    }))
  );
}
