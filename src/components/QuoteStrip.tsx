import { MEMBER_QUOTES } from "@/lib/member-quotes";

// A row of real member quotes, dropped between sections. Pass the keys of the quotes that fit the
// section above it (see src/lib/member-quotes.ts).
const pp = "var(--font-poppins), Poppins, sans-serif";

export default function QuoteStrip({ ids, label = "from inside my szn", tone = "white" }: { ids: string[]; label?: string; tone?: "white" | "lav" | "pink" }) {
  const quotes = ids.map((id) => MEMBER_QUOTES[id]).filter(Boolean);
  const bg = tone === "lav" ? "var(--lav-light)" : tone === "pink" ? "var(--pink-light)" : "#fff";
  return (
    <section className="px-5 md:px-8" style={{ background: bg, borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 60 }}>
      <div className="max-w-6xl mx-auto">
        <div className="tag mb-6">{label}</div>
        <div className={`grid grid-cols-1 ${quotes.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4`}>
          {quotes.map((q) => (
            <figure key={q.name} style={{ margin: 0, background: "#fff", border: "var(--border)", borderRadius: 18, padding: "22px 22px 20px", display: "flex", flexDirection: "column" }}>
              <div aria-hidden="true" style={{ fontFamily: pp, fontSize: 46, fontWeight: 800, color: "var(--pink)", lineHeight: 0.8, marginBottom: 8 }}>&ldquo;</div>
              <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--dark)", flex: 1 }}>{q.quote}</blockquote>
              <figcaption style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--pink)", marginTop: 16 }}>
                {q.name} · my szn member
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
