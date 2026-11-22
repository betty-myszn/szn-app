import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TAPPING } from "@/lib/tapping";

const poppins = "var(--font-poppins), Poppins, sans-serif";

export const metadata: Metadata = {
  title: "Tapping",
  robots: { index: false },
};

// The members' tapping library. Access is enforced by the proxy (FULL_PLATFORM), and the video
// itself only comes from /api/tapping/clip after a server-side membership check.
export default function TappingPage() {
  return (
    <>
      <section className="px-5 md:px-8" style={{ background: "var(--dark)", borderBottom: "var(--border)", paddingTop: 56, paddingBottom: 48 }}>
        <div className="max-w-6xl mx-auto">
          <div className="tag mb-3" style={{ color: "var(--pink)" }}>
            your library
          </div>
          <h1 style={{ fontFamily: poppins, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.1, color: "#fff", marginBottom: 14 }}>
            tapping<span className="pk">.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#fff", maxWidth: 640, margin: 0 }}>
            Short tapping sessions pulled straight out of Betty&apos;s workshops, so you can press play on the exact feeling you need to move, follow along word for word, and come back to it every day until your body finally believes it.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 48, paddingBottom: 56 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TAPPING.map((t) => (
            <Link
              key={t.slug}
              href={`/tapping/${t.slug}`}
              className="no-underline flex flex-col"
              style={{ borderRadius: 14, background: "#fff", border: "2px solid #000", overflow: "hidden", color: "#000" }}
            >
              <div style={{ position: "relative", aspectRatio: "2 / 1", background: "var(--dark)" }}>
                <Image src={t.cover} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" style={{ objectFit: "cover" }} />
                <span style={{ position: "absolute", top: 12, right: 12, padding: "5px 10px", borderRadius: 999, background: "#000", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {t.minutes} min
                </span>
              </div>
              <div className="flex flex-col" style={{ padding: 24, flex: 1 }}>
                <div className="tag mb-3" style={{ color: "var(--pink)" }}>
                  {t.theme}
                </div>
                <h2 style={{ fontFamily: poppins, fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#000" }}>{t.title.toLowerCase()}</h2>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#000", flex: 1 }}>{t.purpose}</p>
                <span style={{ marginTop: 16, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}>
                  tap along →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
