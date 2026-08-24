import fs from "fs";
import path from "path";

// The 7-day free trial is the single front door for anyone who isn't a member. The site used to
// fall back to "join the waitlist" whenever enrolment was closed, and several pages hard-coded that
// fallback without reading the enrolment flag at all, so the waitlist kept resurfacing in places
// nobody remembered to check. This test is the thing that stops it coming back: it fails if a
// waitlist link or button label reappears anywhere in the app.
//
// If a waitlist is ever genuinely wanted again, delete this test deliberately rather than
// working around it.

const SRC = path.join(__dirname, "..", "src");

// The redirect stub at /waitlist, the subscribe API and its list routing are allowed to say the
// word: they're what still catches anyone arriving from an old link.
const ALLOWED = [
  path.join("src", "app", "waitlist", "page.tsx"),
  path.join("src", "app", "api", "subscribe", "route.ts"),
  path.join("src", "lib", "subscribe-lists.ts"),
];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Strips // and block comments, so a comment explaining the history never trips the test. */
function code(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const files = sourceFiles(SRC).filter((f) => !ALLOWED.some((a) => f.endsWith(a)));

describe("the free trial is the only front door", () => {
  it("has no waitlist call to action anywhere", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const body = code(fs.readFileSync(file, "utf8"));
      if (/join the waitlist/i.test(body)) {
        offenders.push(`${path.relative(SRC, file)}: says "join the waitlist"`);
      }
      if (/href=["'{][^"'}\n]*(?:\/waitlist|#waitlist)/.test(body)) {
        offenders.push(`${path.relative(SRC, file)}: links to a waitlist`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("routes non-members to the free trial", async () => {
    const { FREE_TRIAL_CTA, joinCta } = await import("@/lib/cta");
    expect(FREE_TRIAL_CTA.href).toBe("/free-trial");
    // Doors closed is exactly the case that used to fall through to the waitlist.
    expect(joinCta(false)).toEqual(FREE_TRIAL_CTA);
    expect(joinCta(true, "#pricing").href).toBe("#pricing");
  });
});
