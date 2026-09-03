import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  chunkForMessages,
  findWelcomeSender,
  groupWelcomeMessage,
  mentionTokenFor,
  postWelcomeBatch,
  WELCOME_DELAY_MINUTES,
  WELCOME_MAX_AGE_HOURS,
  type WelcomeCandidate,
} from "@/lib/community/welcome-message";

export const runtime = "nodejs";
// Always run fresh: a cached response would report a stale batch and mean the post never happens.
export const dynamic = "force-dynamic";

// Posts the day's community welcome: one message naming everyone who joined since the last run.
// Called once a day from Supabase pg_cron (see
// supabase/migrations/2026-09-03-community-welcome.sql).
//
// Why once a day rather than per signup: a run of near-identical greetings stacked up the room
// reads as a bot working through a list, and it makes each new member reply into silence on her
// own. One post naming everybody gives them each other to answer alongside, and gives the room a
// single moment that looks busy.
//
// Safe to call as often as you like. Idempotency is profiles.community_welcomed_at, written the
// moment a member is handled, so each person is named exactly once, ever. Calling it twice in a day
// posts a second message only if somebody new arrived in between.
//
// AUTH: shared secret in a header, compared in constant time. Without it this URL is a button
// anyone on the internet can press to post into the main chat.

function authorised(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  // No secret configured means the endpoint is closed, not open.
  if (!expected) return false;
  const provided = request.headers.get("x-cron-secret") ?? "";
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) return new NextResponse(null, { status: 404 });

  // Dry run reports who WOULD be welcomed and what the message would say, and writes nothing. This
  // is how you check the thing before letting it talk to the whole community in Betty's name.
  let dryRun = false;
  try {
    const body = await request.json();
    dryRun = body?.dry_run === true;
  } catch {
    // pg_cron posts "{}", and an empty or malformed body just means a normal run.
  }

  const admin = createAdminClient();

  const sender = await findWelcomeSender(admin);
  if (!sender) {
    console.error("cron/community-welcome: no sender profile, nothing posted");
    return NextResponse.json({ ok: false, error: "no_sender" }, { status: 503 });
  }

  const now = Date.now();
  const dueBefore = new Date(now - WELCOME_DELAY_MINUTES * 60_000).toISOString();
  const floor = new Date(now - WELCOME_MAX_AGE_HOURS * 3_600_000).toISOString();
  // The day itself seeds the variant, so consecutive days read differently and a re-run on the same
  // day produces the same wording rather than a random second voice.
  const seed = new Date(now).toISOString().slice(0, 10);

  // Anyone who has actually joined something: a card trial (which arrives as monthly/vip with a
  // trialing status), a paid member, or the legacy no-card trial level. Free-tier and lapsed
  // accounts are not welcomed into the paid community. Blocked members never are.
  const { data: due, error } = await admin
    .from("profiles")
    .select("id, name, created_at")
    .is("community_welcomed_at", null)
    .in("membership_level", ["trial", "monthly", "vip"])
    .lt("created_at", dueBefore)
    .gt("created_at", floor)
    .eq("blocked", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("cron/community-welcome: query failed", error.message);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  const candidates: WelcomeCandidate[] = (due ?? []).map((row) => ({
    id: row.id as string,
    name: (row.name as string | null) ?? null,
  }));
  const groups = chunkForMessages(candidates);

  if (dryRun) {
    const preview = groups.map((group) => ({
      names: group.length,
      message: groupWelcomeMessage(
        group.map((m) => mentionTokenFor(m.name)).filter((t): t is string => t !== null),
        seed
      ),
    }));
    return NextResponse.json({
      ok: true,
      dry_run: true,
      sender: sender.name,
      candidates: candidates.length,
      messages: preview,
    });
  }

  let posted = 0;
  let named = 0;
  let skipped = 0;
  let failed = 0;
  for (const group of groups) {
    const outcome = await postWelcomeBatch(admin, sender, group, seed);
    if (outcome.status === "posted") {
      posted += 1;
      named += outcome.named;
    } else if (outcome.status === "skipped") {
      skipped += 1;
    } else {
      failed += 1;
      console.error("cron/community-welcome: post failed", { first: group[0]?.id, error: outcome.error });
    }
  }

  console.log("cron/community-welcome", { candidates: candidates.length, posted, named, skipped, failed });
  return NextResponse.json({ ok: true, candidates: candidates.length, posted, named, skipped, failed });
}
