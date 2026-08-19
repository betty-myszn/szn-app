"use client";

import { useEffect } from "react";
import Link from "next/link";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// App-wide error boundary. Before this existed, one unguarded property read inside any page (for
// example .toLowerCase() on a placement that hadn't hydrated yet) unmounted the whole tree and the
// member was left staring at a blank white page with no way forward. Now a crash is contained: she
// gets a branded message, a retry, and a route out, and the real error still reaches the console and
// the server logs so it can be traced.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("page error boundary caught:", error);
  }, [error]);

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-5 py-16">
      <div className="text-center" style={{ maxWidth: 460 }}>
        <div
          style={{
            fontFamily: poppins,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--pink)",
            marginBottom: 14,
          }}
        >
          well, that&apos;s annoying
        </div>
        <h1 style={{ fontFamily: poppins, fontSize: 30, fontWeight: 800, letterSpacing: "-1px", marginBottom: 14 }}>
          this page didn&apos;t load properly.
        </h1>
        <p style={{ fontSize: 14, color: "var(--grey)", lineHeight: 1.7, marginBottom: 24 }}>
          Nothing is lost and it isn&apos;t you. Give it another go, and if it keeps happening, email
          us and we&apos;ll sort it.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={reset} className="btn-pink" style={{ cursor: "pointer", border: "none" }}>
            try again
          </button>
          <Link href="/dashboard" className="btn-outline no-underline">
            back to my szn
          </Link>
        </div>
      </div>
    </section>
  );
}
