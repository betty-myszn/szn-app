import Link from "next/link";
import type { ReactNode } from "react";
import type { MicroPageCopy } from "@/lib/report-micro-pages";
import type { ReportReview } from "@/lib/report-reviews";
import MicroPageShell from "./MicroPageShell";

// One report's micro page: who she becomes, exactly what she gets, how her chart builds it, then buy.
// The copy lives in lib/report-micro-pages.ts; this is rendered on the server inside the sheet.

const pp = "var(--font-poppins), Poppins, sans-serif";
const INNER = "max-w-5xl mx-auto";
const section = (background: string, color = "var(--dark)") => ({ background, color, borderBottom: "var(--border)", paddingTop: 60, paddingBottom: 64 });
const h2 = { fontSize: "clamp(30px, 5vw, 56px)", lineHeight: 1 };

function Heading({ title, accent, ink = "var(--dark)" }: { title: string; accent: string; ink?: string }) {
  return <h3 className="display" style={{ ...h2, color: ink }}>{title} <span className="pk">{accent}</span></h3>;
}

function Buy({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline btn-pink" style={{ background: "var(--pink)", color: "#fff", border: "2px solid var(--dark)", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "18px 30px", display: "inline-block" }}>
      {label}
    </a>
  );
}

function CardGrid({ cards, bg = "#fff" }: { cards: readonly (readonly [string, string, string])[]; bg?: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 28 }}>
      {cards.map(([e, t, b]) => (
        <div key={t} className="holo-edge" style={{ background: bg, color: "var(--dark)", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px" }}>
          <div style={{ fontSize: 30, lineHeight: 1 }}>{e}</div>
          <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, lineHeight: 1.2, marginTop: 10 }}>{t}</div>
          <p style={{ fontSize: 15, lineHeight: 1.65, margin: "6px 0 0" }}>{b}</p>
        </div>
      ))}
    </div>
  );
}

export default function ReportMicroPage({ hash, name, price, delivery, buyHref, more, art, reviews, copy: c }: {
  hash: string; name: string; price: string; delivery: string; buyHref: string; more: string | null; art: ReactNode; reviews: ReportReview[]; copy: MicroPageCopy;
}) {
  const buyLabel = `get my report · ${price}`;
  return (
    <MicroPageShell hash={hash} name={name} price={price} buyHref={buyHref}>
      <section className="px-5 md:px-8" style={section("var(--lav)")}>
        <div className={`${INNER} grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-10 items-start`}>
          <div>
            <span className="holo-sticker" style={{ fontSize: 12, transform: "rotate(-2deg)" }}>{c.tag}</span>
            <h2 className="display" style={{ fontSize: "clamp(40px, 7vw, 78px)", lineHeight: 0.95, marginTop: 20, color: "var(--dark)" }}>{c.title} <span className="pk">{c.accent}</span></h2>
            {c.intro.map((p) => <p key={p} style={{ fontSize: 17, lineHeight: 1.65, fontWeight: 600, margin: "18px 0 0" }}>{p}</p>)}
            <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 17, margin: "24px 0 16px" }}>{price} · {delivery}</div>
            <Buy href={buyHref} label={buyLabel} />
          </div>
          <div className="flex justify-center">{art}</div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ ...section("var(--dark)", "#fff"), paddingTop: 30, paddingBottom: 32 }}>
        <div className={`${INNER} grid grid-cols-2 md:grid-cols-4 gap-5`}>
          {c.stats.map(([big, small]) => (
            <div key={small}>
              <div style={{ fontFamily: pp, fontWeight: 900, fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1, color: "var(--pink)" }}>{big}</div>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginTop: 6 }}>{small}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-8" style={section("#fff")}>
        <div className={INNER}>
          <Heading title="who you are on" accent={c.shiftAccent} />
          <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
            {c.shifts.map(([before, after]) => (
              <div key={after} className="grid grid-cols-1 sm:grid-cols-[0.8fr_1.2fr]" style={{ border: "var(--border)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ background: "var(--lav-light)", padding: "14px 18px", fontSize: 15, lineHeight: 1.45, fontWeight: 600 }}>{before}</div>
                <div style={{ background: "var(--pink)", color: "var(--dark)", padding: "14px 18px", fontFamily: pp, fontWeight: 800, fontSize: 16, lineHeight: 1.35 }}>→ {after}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={section("var(--pink-light)")}>
        <div className={INNER}>
          <Heading title={c.whatTitle} accent={c.whatAccent} />
          <CardGrid cards={c.items} />
          {c.extras && (
            <div style={{ marginTop: 40 }}>
              <span className="holo-sticker" style={{ fontSize: 13, transform: "rotate(-2deg)" }}>{c.extrasLabel}</span>
              <CardGrid cards={c.extras} bg="var(--lav-light)" />
            </div>
          )}
          <div style={{ marginTop: 32 }}><Buy href={buyHref} label={buyLabel} /></div>
        </div>
      </section>

      <section className="px-5 md:px-8" style={section("var(--dark)", "#fff")}>
        <div className={INNER}>
          <Heading title={c.readTitle} accent={c.readAccent} ink="#fff" />
          <CardGrid cards={c.reads} />
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="px-5 md:px-8" style={section("var(--lav-light)")}>
          <div className={INNER}>
            <Heading title="the baddies" accent="have read theirs." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 28 }}>
              {reviews.slice(0, 3).map((r) => (
                <figure key={r.name} className="holo-edge" style={{ margin: 0, background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 18, lineHeight: 1.3 }}>{r.head}</div>
                  <blockquote style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6 }}>{r.body}</blockquote>
                  <figcaption style={{ marginTop: "auto", paddingTop: 14, fontFamily: pp, fontWeight: 800, fontSize: 15 }}>{r.name} <span style={{ fontWeight: 600 }}>| {r.role}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 md:px-8" style={section("#fff")}>
        <div className={`${INNER} grid grid-cols-1 md:grid-cols-2 gap-10`}>
          <div>
            <Heading title="this is SO" accent="for you if..." />
            <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "grid", gap: 12 }}>
              {c.forYou.map((f) => <li key={f} style={{ fontFamily: pp, fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}><span style={{ color: "var(--pink)", fontWeight: 800 }}>✦ </span>{f}</li>)}
            </ul>
          </div>
          <div>
            <Heading title="how it" accent="reaches you." />
            <ol style={{ listStyle: "none", padding: 0, margin: "22px 0 0" }}>
              {c.steps.map(([t, b], i) => (
                <li key={t} style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 8, padding: "12px 0", borderTop: "1.5px solid var(--dark)" }}>
                  <span style={{ fontFamily: pp, fontWeight: 900, fontSize: 22, color: "var(--pink)", lineHeight: 1.1 }}>{i + 1}</span>
                  <div><div style={{ fontFamily: pp, fontWeight: 800, fontSize: 16 }}>{t}</div><p style={{ fontSize: 15, lineHeight: 1.55, margin: "3px 0 0" }}>{b}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 68, paddingBottom: 76 }}>
        <div className="max-w-3xl mx-auto">
          <h3 className="display" style={{ fontSize: "clamp(36px, 6vw, 68px)", color: "#fff", lineHeight: 0.98 }}>{c.closeTitle} <span className="pk">{c.closeAccent}</span></h3>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#fff", fontWeight: 500, margin: "20px 0 26px" }}>{c.closeBody}</p>
          <div className="flex flex-wrap items-center gap-5">
            <Buy href={buyHref} label={buyLabel} />
            {more && <Link href={more} style={{ color: "#fff", fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>see the full sales page →</Link>}
          </div>
        </div>
      </section>
    </MicroPageShell>
  );
}
