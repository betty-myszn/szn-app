"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// The last line of defence: an error in the root layout itself, above the ordinary error screen.
// It replaces the whole document, so it carries its own <html> and <body> and inline styles.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { boundary: "root" } });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Poppins, system-ui, sans-serif", background: "#fff", color: "#1a1a1a" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FF2D87", margin: "0 0 14px" }}>
              well, that&apos;s annoying
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 14px" }}>MY SZN didn&apos;t load properly.</h1>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#555", margin: "0 0 24px" }}>
              Nothing is lost and it isn&apos;t you. Give it another go, and if it keeps happening, email us and we&apos;ll sort it.
            </p>
            <button
              onClick={() => reset()}
              style={{ background: "#FF2D87", color: "#fff", border: "none", padding: "14px 28px", fontWeight: 800, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
            >
              try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
