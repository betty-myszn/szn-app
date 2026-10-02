import { createClient } from "@/lib/supabase/client";
import { getCurrentSeason } from "@/lib/seasons";

export type PollType = "choice" | "open";

export interface Poll {
  id: string;
  question: string;
  type: PollType;
  options: string[]; // empty for "open" type
  active: boolean;
  createdAt: string;
  authorEmail: string;
  season: string; // the szn sign it was posted in, ties it to that season's community page
}

export interface PollResponse {
  id: string;
  pollId: string;
  respondent: string; // member display name
  answer: string;
  createdAt: string;
}

function mapPollRow(row: {
  id: string;
  question: string;
  type: string;
  options: string[];
  active: boolean;
  created_at: string;
  author_email: string;
  season: string;
}): Poll {
  return {
    id: row.id,
    question: row.question,
    type: row.type as PollType,
    options: row.options || [],
    active: row.active,
    createdAt: row.created_at,
    authorEmail: row.author_email,
    season: row.season,
  };
}

function mapResponseRow(row: { id: string; poll_id: string; respondent: string; answer: string; created_at: string }): PollResponse {
  return { id: row.id, pollId: row.poll_id, respondent: row.respondent, answer: row.answer, createdAt: row.created_at };
}

export async function loadPolls(): Promise<Poll[]> {
  const supabase = createClient();
  const { data } = await supabase.from("polls").select("*").order("created_at", { ascending: false });
  return (data || []).map(mapPollRow);
}

export async function createPoll(question: string, type: PollType, options: string[], authorEmail: string): Promise<Poll[]> {
  const supabase = createClient();
  await supabase.from("polls").insert({
    id: `${Date.now()}`,
    question: question.trim(),
    type,
    options: type === "choice" ? options.map((o) => o.trim()).filter(Boolean) : [],
    active: true,
    author_email: authorEmail,
    season: getCurrentSeason().sign,
  });
  return loadPolls();
}

export async function togglePollActive(id: string, currentlyActive: boolean): Promise<Poll[]> {
  const supabase = createClient();
  await supabase.from("polls").update({ active: !currentlyActive }).eq("id", id);
  return loadPolls();
}

export async function deletePoll(id: string): Promise<Poll[]> {
  const supabase = createClient();
  await supabase.from("polls").delete().eq("id", id);
  return loadPolls();
}

// created_at doubles as a poll's go-live time: a row dated in the future is scheduled and stays
// hidden until then, which is how a run of questions gets written ahead to land on the transits.
export function isPollReleased(poll: Poll, now: number = Date.now()): boolean {
  return new Date(poll.createdAt).getTime() <= now;
}

// How long a question stays on the dashboard after it goes live. They're written to the sky, so
// past this they read stale (an eclipse question sat there a month), and a newer one has normally
// taken over long before.
const POLL_DASHBOARD_DAYS = 10;

// The one poll a member should actually see right now: the newest released, still-fresh active poll
// they haven't already answered, so the dashboard never nags about something already responded to.
export function getActivePollFor(polls: Poll[], responses: PollResponse[], respondent: string): Poll | null {
  const now = Date.now();
  const answeredIds = new Set(responses.filter((r) => r.respondent === respondent).map((r) => r.pollId));
  return (
    polls.find(
      (p) =>
        p.active &&
        isPollReleased(p, now) &&
        now - new Date(p.createdAt).getTime() < POLL_DASHBOARD_DAYS * 86_400_000 &&
        !answeredIds.has(p.id)
    ) || null
  );
}

export function getPollsForSeason(polls: Poll[], seasonSign: string): Poll[] {
  return polls.filter((p) => p.season === seasonSign && isPollReleased(p));
}

export async function loadResponses(): Promise<PollResponse[]> {
  const supabase = createClient();
  const { data } = await supabase.from("poll_responses").select("*").order("created_at", { ascending: false });
  return (data || []).map(mapResponseRow);
}

export async function submitResponse(pollId: string, respondent: string, answer: string): Promise<PollResponse[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return loadResponses();
  await supabase.from("poll_responses").upsert(
    {
      id: `${Date.now()}`,
      poll_id: pollId,
      user_id: user.id,
      respondent,
      answer: answer.trim(),
    },
    { onConflict: "poll_id,user_id" }
  );
  return loadResponses();
}

export interface PollResults {
  total: number;
  counts: Record<string, number>; // option -> count, only meaningful for "choice" polls
}

export function getPollResults(poll: Poll, responses: PollResponse[]): PollResults {
  const forPoll = responses.filter((r) => r.pollId === poll.id);
  const counts: Record<string, number> = {};
  poll.options.forEach((o) => (counts[o] = 0));
  forPoll.forEach((r) => {
    if (counts[r.answer] !== undefined) counts[r.answer] += 1;
  });
  return { total: forPoll.length, counts };
}
