/**
 * Money Blueprint — the block vocabulary a written section is made of.
 *
 * Writers return blocks, never HTML. `render.ts` is the only place that knows about markup, which
 * keeps the writers testable and lets the same report render to HTML, PDF or plain text.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "sub"; text: string }
  | { kind: "howlist"; items: string[] }
  | { kind: "steps"; items: Array<[string, string]> }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "cards"; items: Array<{ h: string; p: string }> }
  | { kind: "pull"; text: string; accent?: string }
  | { kind: "tool"; label: string; paras: string[] }
  | { kind: "action"; label: string; text: string }
  | { kind: "shadowlist"; items: Array<{ n: string; t: string; s: string }> }
  | { kind: "letter"; paras: string[]; signoff: string };

export interface WrittenSection {
  id: string;
  number: number | null;
  title: string;
  part: number;
  /** Display headline, lowercase, with an optional {pk}...{/pk} accent span. */
  headline: string;
  /** The "Read from" band. */
  readFrom: string[];
  blocks: Block[];
  /** Page background class for the rendered page. */
  bg?: "cream" | "pinkbg" | "mint" | "lav" | "gold" | "dark";
  /** True for full-page part dividers and chapter openers. */
  opener?: boolean;
  /** Lede shown on opener pages. */
  lede?: string;
}

// ------------------------------------------------------------------ small constructors

export const p = (text: string): Block => ({ kind: "p", text });
export const sub = (text: string): Block => ({ kind: "sub", text });
export const howlist = (items: string[]): Block => ({ kind: "howlist", items });
export const steps = (items: Array<[string, string]>): Block => ({ kind: "steps", items });
export const table = (head: string[], rows: string[][]): Block => ({ kind: "table", head, rows });
export const cards = (items: Array<{ h: string; p: string }>): Block => ({ kind: "cards", items });
export const pull = (text: string, accent?: string): Block => ({ kind: "pull", text, accent });
export const tool = (label: string, ...paras: string[]): Block => ({ kind: "tool", label, paras });
export const action = (text: string, label = "Your move this week"): Block => ({ kind: "action", label, text });
export const shadowlist = (items: Array<{ n: string; t: string; s: string }>): Block => ({ kind: "shadowlist", items });
export const letter = (paras: string[], signoff: string): Block => ({ kind: "letter", paras, signoff });

/** Drops empty blocks so a thin chart produces a shorter report rather than empty headings. */
export function compact(blocks: Array<Block | null | undefined | false>): Block[] {
  return blocks.filter((b): b is Block => {
    if (!b) return false;
    if (b.kind === "p") return b.text.trim().length > 0;
    if (b.kind === "howlist") return b.items.length > 0;
    if (b.kind === "steps") return b.items.length > 0;
    if (b.kind === "table") return b.rows.length > 0;
    if (b.kind === "cards") return b.items.length > 0;
    if (b.kind === "shadowlist") return b.items.length > 0;
    return true;
  });
}
