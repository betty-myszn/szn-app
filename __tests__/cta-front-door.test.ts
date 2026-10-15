import fs from "fs";
import path from "path";

// Joining is the single front door for anyone who isn't a member. Two older front doors were retired
// and both kept resurfacing in places nobody remembered to check: the waitlist (pages hard-coded a
// "join the waitlist" fallback without reading the enrolment flag), and then the 7-day free trial,
// retired on 1 Oct 2026, which had been hard-coded into dozens of pages and blog guides. This test
// is the thing that stops either coming back: it fails if a waitlist or free-trial link or button
// label reappears anywhere in the app.
//
// If either is ever genuinely wanted again, change this test deliberately rather than working
// around it.

const SRC = path.join(__dirname, "..", "src");

// The redirect stub at /waitlist, the subscribe API and its list routing are allowed to say the
// word: they're what still catches anyone arriving from an old link.
const ALLOWED = [
  path.join("src", "app", "waitlist", "page.tsx"),
  path.join("src", "app", "api", "subscribe", "route.ts"),
  path.join("src", "lib", "subscribe-lists.ts"),
  // Shop Your Sign is a separate product with its own launch waitlist, not a MY SZN front door.
  path.join("src", "app", "shop-your-sign", "page.tsx"),
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

describe("joining is the only front door", () => {
  // The old "no waitlist anywhere" rule was retired deliberately on 13 Oct 2026: Betty relaunched
  // every MY SZN offer (reports, Coven, Mastermind, Retreat, Book) as waitlist-only, built on
  // /api/waitlist + lib/offers. The free trial rule below still stands.

  it("has no free trial call to action anywhere", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const body = code(fs.readFileSync(file, "utf8"));
      // /free-trial/ended is allowed: it is where a trial that already ran out is sent.
      if (/["'`]\/free-trial(?!\/ended)["'`#?]/.test(body)) {
        offenders.push(`${path.relative(SRC, file)}: links to /free-trial`);
      }
      if (/start (?:my|your) free (?:7 days|trial|week)|try it free|free for 7 days|start free trial/i.test(body)) {
        offenders.push(`${path.relative(SRC, file)}: offers the free trial`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("routes non-members to the join", async () => {
    const { JOIN_CTA, joinCta } = await import("@/lib/cta");
    expect(JOIN_CTA.href).toBe("/mastermind#waitlist");
    expect(joinCta(false).href).toBe("/mastermind#waitlist");
    expect(joinCta(true, "#pricing").href).toBe("#pricing");
  });
});
