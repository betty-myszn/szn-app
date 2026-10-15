import fs from "fs";
import path from "path";

// Brand rule (13 Oct 2026): every customer-facing use of the word is censored as "b*tch", in page
// copy, product names, nav, buttons, SEO, forms, confirmations and emails. This fails the build if
// the uncensored spelling appears anywhere in src/ or in the email templates at the project root.

const ROOTS = [path.join(__dirname, "..", "src"), path.join(__dirname, "..", "..")];
const UNCENSORED = new RegExp(["b", "i", "t", "c", "h"].join(""), "i");

function files(dir: string, deep: boolean): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (deep) out.push(...files(full, deep)); }
    else if (/\.(tsx?|html|md|json)$/.test(e.name)) out.push(full);
  }
  return out;
}

describe("b*tch is always censored", () => {
  it("never appears uncensored in the app or email templates", () => {
    const all = [...files(ROOTS[0], true), ...files(ROOTS[1], false).filter((f) => f.endsWith(".html"))];
    const offenders = all.filter((f) => UNCENSORED.test(fs.readFileSync(f, "utf8"))).map((f) => path.basename(f));
    expect(offenders).toEqual([]);
  });
});
