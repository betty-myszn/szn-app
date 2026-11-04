// Renders an email template copied out of Brevo (brevo-templates.json) so it can be sent through
// Solstral instead. Brevo templates use a small slice of its Jinja-like syntax, and only that slice is
// supported here:
//   {{ params.x }}  {{ params.x | default: 'y' }}  {% if params.x %} … {% else %} … {% endif %}
// Any other {{ … }} tag (contact.*, unsubscribe, mirror links) renders as empty rather than leaking
// raw braces into someone's inbox.

import templates from "./brevo-templates.json";

type Template = { name: string; subject: string; senderName: string; html: string };
const TEMPLATES = templates as Record<string, Template>;

export function hasTemplate(id: number): boolean {
  return String(id) in TEMPLATES;
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function lookup(expr: string, params: Record<string, string>): string {
  const m = expr.trim().match(/^params\.([\w]+)(?:\s*\|\s*default\s*:\s*['"]([^'"]*)['"])?$/);
  if (!m) return "";
  const value = params[m[1]];
  return value ? value : m[2] ?? "";
}

// Resolves {% if %} blocks innermost-first, so nested ifs work without a full parser.
function renderConditionals(src: string, params: Record<string, string>): string {
  const block = /\{%\s*if\s+([^%]+?)\s*%\}((?:(?!\{%\s*if\b)[\s\S])*?)\{%\s*endif\s*%\}/;
  let out = src;
  for (let m = out.match(block); m; m = out.match(block)) {
    const [whole, cond, body] = m;
    const [yes, no = ""] = body.split(/\{%\s*else\s*%\}/);
    out = out.replace(whole, lookup(cond, params) ? yes : no);
  }
  return out;
}

function render(src: string, params: Record<string, string>, escape: boolean): string {
  return renderConditionals(src, params).replace(/\{\{([^}]*)\}\}/g, (_, expr: string) => {
    const v = lookup(expr, params);
    return escape ? escapeHtml(v) : v;
  });
}

export function renderTemplate(
  id: number,
  params: Record<string, string>
): { subject: string; html: string; senderName: string } | null {
  const t = TEMPLATES[String(id)];
  if (!t) return null;
  return {
    subject: render(t.subject, params, false),
    html: render(t.html, params, true),
    senderName: t.senderName,
  };
}
