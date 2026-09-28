import type { Metadata } from "next";
import Link from "next/link";
import { allMeditations } from "@/lib/meditations";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export const metadata: Metadata = {
  title: "Meditations",
  robots: { index: false },
};

// The members' meditation library. Access is enforced by the proxy (FULL_PLATFORM), so this page
// only has to list what's in lib/meditations.ts, newest first.
export default function MeditationsPage() {
  const meditations = allMeditations();

  return (
    <>
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 48 }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>
            your library
          </div>
          <h1
            style={{
              fontFamily: poppins,
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            meditations<span className="pk">.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.75)", maxWidth: 620 }}>
            Every meditation Betty records for MY SZN lands here and stays here, so you can come back to the one you need whenever the moment calls for it.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 48, paddingBottom: 56 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {meditations.map((m) => (
            <Link
              key={m.slug}
              href={`/meditations/${m.slug}`}
              className="no-underline flex flex-col"
              style={{ borderRadius: 14, background: "#fff", border: "2px solid var(--purple)", padding: 24, minHeight: 170, color: "#3C2A70" }}
            >
              <div className="tag mb-3" style={{ color: "var(--pink)" }}>
                {m.theme}
              </div>
              <h2 style={{ fontFamily: poppins, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{m.title.toLowerCase()}</h2>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, opacity: 0.75, flex: 1 }}>{m.purpose}</p>
              <span style={{ marginTop: 16, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>
                listen →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
