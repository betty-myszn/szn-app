// Claims a fingerprint for every trial already granted, so today's trialists cannot come back for a
// second free week tomorrow. Uses the SAME hash the signup route uses, so the two cannot disagree.
//
// Idempotent: re-running it inserts nothing new. Run with --dry to see what it would do first.
//
//   node scripts/backfill-trial-fingerprints.mjs --dry
//   node scripts/backfill-trial-fingerprints.mjs

import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import fs from "fs";

const DRY = process.argv.includes("--dry");

const env = Object.fromEntries(
  fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; })
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Mirrors src/lib/trial-fingerprint.ts exactly. The self-check below refuses to run if they drift.
const round = (n) => (Math.round(n * 10) / 10).toFixed(1);
const toMinutes = (t) => String(t).trim().slice(0, 5);
const birthFingerprint = ({ dateOfBirth, birthTime, latitude, longitude }) =>
  createHash("sha256")
    .update([String(dateOfBirth).trim().slice(0, 10), toMinutes(birthTime), round(latitude), round(longitude)].join("|"))
    .digest("hex");

const source = fs.readFileSync(new URL("../src/lib/trial-fingerprint.ts", import.meta.url), "utf8");
for (const marker of [".slice(0, 10)", "toMinutes(input.birthTime)", "round(input.latitude)", "round(input.longitude)", 'join("|")', '"sha256"']) {
  if (!source.includes(marker)) {
    console.error(`REFUSING TO RUN: src/lib/trial-fingerprint.ts no longer contains ${marker}.`);
    console.error("The hash here and the hash in the signup route have drifted. Fix both, then re-run.");
    process.exit(1);
  }
}

// Two queries rather than a PostgREST embed: birth_data's foreign key points at auth.users, not at
// profiles, so the embed is not guaranteed to resolve. Two plain reads always work.
const { data: trials, error } = await admin
  .from("profiles").select("id, email, trial_started_at").not("trial_started_at", "is", null);
if (error) { console.error("profiles read failed:", error.message); process.exit(1); }

const { data: births, error: birthError } = await admin
  .from("birth_data").select("user_id, date_of_birth, birth_time, latitude, longitude")
  .in("user_id", (trials ?? []).map((t) => t.id));
if (birthError) { console.error("birth_data read failed:", birthError.message); process.exit(1); }

const byUser = new Map((births ?? []).map((b) => [b.user_id, b]));

// Betty's own accounts are never claimed, so her birth details stay free for testing the flow.
const EXEMPT = new Set(["sarahbettyandrews@gmail.com", "hello@thecosmicco.com", "woo@joinwoowoo.com"]);

let claimed = 0, skipped = 0, exempt = 0;
const seen = new Map();
for (const row of trials ?? []) {
  if (EXEMPT.has((row.email ?? "").toLowerCase())) { exempt += 1; continue; }
  const b = byUser.get(row.id);
  if (!b?.date_of_birth || !b?.birth_time || b.latitude == null || b.longitude == null) { skipped += 1; continue; }
  const fingerprint = birthFingerprint({
    dateOfBirth: b.date_of_birth, birthTime: b.birth_time, latitude: b.latitude, longitude: b.longitude,
  });
  if (seen.has(fingerprint)) console.log(`  SAME CHART: ${row.email} matches ${seen.get(fingerprint)}`);
  else seen.set(fingerprint, row.email);

  if (DRY) { claimed += 1; continue; }
  const { error: insertError } = await admin.from("trial_fingerprints").insert({ fingerprint, user_id: row.id });
  if (insertError && !/duplicate|unique/i.test(insertError.message)) console.error(`  failed for ${row.email}: ${insertError.message}`);
  else claimed += 1;
}

console.log(`\n${DRY ? "WOULD CLAIM" : "CLAIMED"} ${claimed}, skipped ${skipped} with incomplete birth data, ${exempt} exempt (Betty's own).`);
console.log(`${seen.size} distinct charts across ${claimed} trials.`);
