import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  findWelcomeSender,
  postWelcomeMessage,
  WELCOME_DELAY_MINUTES,
  WELCOME_MAX_AGE_HOURS,
  welcomeMessageFor,
} from "@/lib/community/welcome-message";

export const runtime = "nodejs";
// Always run fresh: a cached response would report a stale batch and mean the posts never happen.
export const dynamic = "force-dynamic";

// Posts the automatic community welcome for everyone who joined a few minutes ago and has not been
// welcomed yet. Called on a schedule from Supabase pg_cron every five minutes (see
// supabase/migrations/2026-09-03-community-welcome.sql).
//
// Why a cron rather than posting straight from signup: the message is deliberately held back a few
// minutes, and the honest way to wait is a clock, not a timer inside a request that dies with the
// process. It also means a signup that happened while the app was restarting still gets its
// welcome on the next pass.
//
// Safe to call as often as you like. Idempotency is profiles.community_welcomed_at, written the
// moment a member is handled, so each person is welcomed exactly once, ever.
//
// AUTH: shared secret in a header, compared in constant time. Without it this URL is a button
// anyone on the internet can press to post into the main chat.

/** Cap per run. A signup rush posts a few at a time across successive runs instead of dumping
 *  thirty near-identical messages into the room at once, which is what a bot looks like. */
const BATCH_LIMIT = 8;

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
    .order("created_at", { ascending: true })
    .limit(BATCH_LIMIT);

  if (error) {
    console.error("cron/community-welcome: query failed", error.message);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  if (dryRun) {
    const preview = (due ?? []).map((row) => ({
      userId: row.id as string,
      createdAt: row.created_at as string,
      message: welcomeMessageFor((row.name as string | null) ?? null, row.id as string),
    }));
    return NextResponse.json({ ok: true, dry_run: true, sender: sender.name, candidates: preview.length, preview });
  }

  let posted = 0;
  let skipped = 0;
  let failed = 0;
  for (const row of due ?? []) {
    // Sequential on purpose: these land in one room, in order, and a burst of parallel inserts
    // would arrive interleaved for no benefit at this volume.
    const outcome = await postWelcomeMessage(admin, sender, {
      id: row.id as string,
      name: (row.name as string | null) ?? null,
    });
    if (outcome.status === "posted") posted += 1;
    else if (outcome.status === "skipped") skipped += 1;
    else {
      failed += 1;
      console.error("cron/community-welcome: post failed", { userId: row.id, error: outcome.error });
    }
  }

  console.log("cron/community-welcome", { candidates: due?.length ?? 0, posted, skipped, failed });
  return NextResponse.json({ ok: true, candidates: due?.length ?? 0, posted, skipped, failed });
}
