import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMemberNotification } from "@/lib/notify/send";
import {
  chunkForMessages,
  findWelcomeSender,
  groupWelcomeMessage,
  resolveMentionTokens,
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
  let maxAgeHours = WELCOME_MAX_AGE_HOURS;
  let seedOverride: string | null = null;
  let testUserId: string | null = null;
  try {
    const body = await request.json();
    dryRun = body?.dry_run === true;
    // A one-off catch-up can reach further back than the daily run does, for the members who joined
    // before any of this existed. Clamped so a typo cannot reach the entire history of the app.
    if (typeof body?.max_age_hours === "number" && Number.isFinite(body.max_age_hours)) {
      maxAgeHours = Math.min(Math.max(body.max_age_hours, 1), 24 * 90);
    }
    // The daily run seeds its wording with the date. A catch-up over people who joined weeks ago
    // must not be allowed to land on "look who joined today", so the seed can be chosen instead.
    if (typeof body?.seed === "string" && body.seed.trim()) seedOverride = body.seed.trim();
    if (typeof body?.test_user_id === "string" && body.test_user_id.trim()) testUserId = body.test_user_id.trim();
  } catch {
    // pg_cron posts "{}", and an empty or malformed body just means a normal run.
  }

  // Smoke test: send one real welcome email to a named address and report which provider actually
  // delivered it. Nothing is queried, posted or written. This exists because a Resend that is not
  // configured falls back to Brevo silently, which looks exactly like a working Resend setup.
  const admin = createAdminClient();

  // Smoke test: puts one real notification and email through the exact production path, addressed
  // by user id, and reports what happened. Exists because a mail failure is otherwise invisible
  // until a member does not receive something nobody knew was owed to her.
  if (testUserId) {
    const result = await sendMemberNotification(admin, {
      userId: testUserId,
      kind: "welcome",
      title: "betty welcomed you in the chat",
      body: "welcome to my sznnnn babes 💜🪩 we are so happy you're here. Give us your Big 3, and tell us what got you into astrology 👀",
      link: "/community/room/general",
      actor: "betty",
      email: true,
      emailSubject: "you got welcomed into MY SZN 💜",
      emailCta: "GO SAY HI",
    });
    return NextResponse.json({ test: true, ...result });
  }

  const sender = await findWelcomeSender(admin);
  if (!sender) {
    console.error("cron/community-welcome: no sender profile, nothing posted");
    return NextResponse.json({ ok: false, error: "no_sender" }, { status: 503 });
  }

  const now = Date.now();
  const dueBefore = new Date(now - WELCOME_DELAY_MINUTES * 60_000).toISOString();
  const floor = new Date(now - maxAgeHours * 3_600_000).toISOString();
  // The day itself seeds the variant, so consecutive days read differently and a re-run on the same
  // day produces the same wording rather than a random second voice.
  const seed = seedOverride ?? new Date(now).toISOString().slice(0, 10);

  // Anyone who has actually joined something: a card trial (which arrives as monthly/vip with a
  // trialing status), a paid member, or the legacy no-card trial level. Free-tier accounts are not
  // welcomed into the paid community, and blocked members never are.
  //
  // The trial_expires_at guard matters: a legacy trial keeps membership_level 'trial' after it runs
  // out, because expiry is computed at request time rather than written back. Without this, a
  // catch-up run would greet a room full of people who lost their access days ago. Paid members
  // have no expiry at all, so the null branch is what lets them through.
  //
  // Betty's own admin account is excluded, since welcoming herself into her own community is a
  // strange thing for the room to watch happen.
  const nowIso = new Date(now).toISOString();
  const { data: due, error } = await admin
    .from("profiles")
    .select("id, name, created_at")
    .is("community_welcomed_at", null)
    .in("membership_level", ["trial", "monthly", "vip"])
    .or(`trial_expires_at.is.null,trial_expires_at.gt.${nowIso}`)
    .lt("created_at", dueBefore)
    .gt("created_at", floor)
    .eq("blocked", false)
    .eq("is_admin", false)
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
    // Resolved the same way the real post resolves them, so a preview can never show "@Sarah" for
    // a message that will actually say "@SarahElizabeth".
    const { data: allProfiles } = await admin.from("profiles").select("name");
    const allNames = (allProfiles ?? []).map((r) => (r.name as string | null) ?? null);
    const preview = groups.map((group) => {
      const tokenById = resolveMentionTokens(group, allNames);
      return {
        names: group.length,
        message: groupWelcomeMessage(
          group.filter((m) => tokenById.has(m.id)).map((m) => tokenById.get(m.id) as string),
          seed
        ),
      };
    });
    return NextResponse.json({
      ok: true,
      dry_run: true,
      sender: sender.name,
      candidates: candidates.length,
      max_age_hours: maxAgeHours,
      seed,
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
