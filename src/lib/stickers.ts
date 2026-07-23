import type { RewardStickerId } from "@/components/Stickers";
import { loadJournalEntries } from "@/lib/journal-store";
import { loadPosts } from "@/lib/community-store";
import { loadChallengeProgress } from "@/lib/challenge-progress";
import { loadGoals } from "@/lib/goals-store";
import { getRsvp } from "@/lib/rsvp";

// Reads every existing store to answer "which reward stickers has she actually earned", no new
// tracking needed, these milestones are already real signals living in the app.
export async function getEarnedRewardStickers(memberName: string): Promise<Set<RewardStickerId>> {
  const earned = new Set<RewardStickerId>();

  const journalEntries = loadJournalEntries();
  if (journalEntries.some((e) => e.type === "shadow work")) earned.add("completed-shadow-work");

  const posts = await loadPosts();
  if (posts.some((p) => p.author.toLowerCase() === memberName.toLowerCase())) earned.add("posted-in-community");

  const progress = loadChallengeProgress();
  if (progress.completions.length >= 1) earned.add("finished-challenge");

  const goals = loadGoals();
  if (goals.some((g) => g.status === "completed")) earned.add("hit-a-goal");

  // Event-based stickers: "attended" reads any going RSVP, "finished a workshop" additionally
  // requires the event to have actually happened, not just be on the calendar.
  const WORKSHOP_EVENTS: { id: string; startIso: string; durationMinutes: number }[] = [
    { id: "leo-szn-workshop-1", startIso: "2026-07-23T19:00:00-07:00", durationMinutes: 75 },
  ];
  const now = Date.now();
  for (const event of WORKSHOP_EVENTS) {
    const rsvp = await getRsvp(event.id);
    if (rsvp?.status === "going") {
      earned.add("attended-live-session");
      const end = new Date(event.startIso).getTime() + event.durationMinutes * 60000;
      if (now >= end) earned.add("finished-workshop");
    }
  }

  return earned;
}
