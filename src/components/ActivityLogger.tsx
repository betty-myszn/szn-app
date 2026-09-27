"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Records which pages a signed-in member opens, into member_activity, so we can see what the members
// who stay actually use. Before this the database only noticed things she wrote (a chat, a goal, an
// RSVP); reading her season, watching a replay or reopening the app left no trace at all.
//
// Path only, never the query string, so a login token or a search can't land in the table. Signed-out
// visitors send nothing: getSession reads the local cookie without a network call, and without a
// session there's no insert. Writes go straight to Supabase under an insert-only RLS policy, the same
// way room_seen is written from chat-rooms.ts.
//
// The same page counts once per 30 minutes per tab. Coming back to the tab or the installed app after
// longer than that counts as a fresh visit, which is the only way a return with no route change (the
// PWA reopened on the page she left it on) shows up at all.
const REPEAT_WINDOW_MS = 30 * 60 * 1000;
const STORAGE_KEY = "myszn-activity-last";

function readLast(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeLast(last: Record<string, number>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(last));
  } catch {
    // Private mode or blocked storage: worst case a repeat visit gets logged twice.
  }
}

async function logVisit(path: string) {
  const now = Date.now();
  const last = readLast();
  if (last[path] && now - last[path] < REPEAT_WINDOW_MS) return;

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;

  last[path] = now;
  writeLast(last);
  // Fire and forget: a missed row must never surface to her or slow the page.
  await supabase.from("member_activity").insert({ user_id: session.user.id, path: path.slice(0, 300) });
}

export default function ActivityLogger() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) logVisit(pathname).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") logVisit(window.location.pathname).catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return null;
}
