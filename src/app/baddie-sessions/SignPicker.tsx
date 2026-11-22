import { SIGN_SESSIONS } from "@/lib/sign-sessions";

// The twelve sign sessions as tappable chips: on the /baddie-sessions card and at the foot of each sign page.

const pp = "var(--font-poppins), Poppins, sans-serif";
const glyphFont = "'Apple Symbols', 'Segoe UI Symbol', 'Noto Sans Symbols 2', serif";

export default function SignPicker({ current }: { current?: string }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {SIGN_SESSIONS.map((s) => {
        const on = s.slug === current;
        return (
          <a
            key={s.slug}
            href={`/baddie-sessions/${s.slug}`}
            aria-current={on ? "page" : undefined}
            className="no-underline"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "10px 4px", border: "var(--border)", borderRadius: 14, background: on ? "var(--dark)" : "#fff", color: on ? "#fff" : "var(--dark)" }}
          >
            <span aria-hidden style={{ fontSize: 26, lineHeight: 1, fontFamily: glyphFont }}>{s.glyph}</span>
            <span style={{ fontFamily: pp, fontWeight: 800, fontSize: 13 }}>{s.sign}</span>
          </a>
        );
      })}
    </div>
  );
}
