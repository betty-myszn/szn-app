"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess } from "@/lib/membership-access";
import { latestReplay, formatWorkshopWhenLA } from "@/lib/workshops";
import { FREE_TRIAL_CTA } from "@/lib/cta";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The newest class replay, shown to people who aren't inside yet: the real video thumbnail, locked,
// with the class named and dated so the vault is something you can see rather than a promise. It
// hides itself for anyone who already has access, because she has the vault itself and the season
// home's own spotlight instead.
export default function ReplayTeaser({ background = "var(--cream)" }: { background?: string }) {
  const { member, ready } = useMember();
  // Mount guard: rendering this on the server and then hiding it for a member on hydration would
  // flash the join pitch at someone who is already paying.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const replay = latestReplay();
  if (!mounted || !ready || hasActiveAccess(member)) return null;
  if (!replay?.replayYoutubeId) return null;

  // The workshop's own cover when it has one, so the class looks the same here as it does inside;
  // otherwise youtube's own frame, which every uploaded video has.
  const thumb = replay.coverImage ?? `https://img.youtube.com/vi/${replay.replayYoutubeId}/maxresdefault.jpg`;

  return (
    <section className="px-5 md:px-8" style={{ background, borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 72 }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
        <Link
          href={FREE_TRIAL_CTA.href}
          aria-label={`${replay.title}: start your free 7 days to watch the replay`}
          style={{
            display: "block",
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            border: "var(--border)",
            background: `#000 url("${thumb}") center / cover no-repeat`,
            overflow: "hidden",
          }}
        >
          {/* darkening layer so the play button and the badge stay legible over any frame */}
          <span style={{ position: "absolute", inset: 0, background: "rgba(20,10,40,0.35)" }} aria-hidden="true" />
          {/* Bottom right, not dead centre: the cover carries its own title artwork across the
              middle and a centred button lands right on top of it. */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              right: 18,
              bottom: 18,
              width: 74,
              height: 74,
              borderRadius: "50%",
              background: "var(--pink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
            }}
          >
            <span style={{ borderStyle: "solid", borderWidth: "13px 0 13px 22px", borderColor: "transparent transparent transparent #fff", marginLeft: 5 }} />
          </span>
          <span
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2E1C63",
              background: "#fff",
              padding: "5px 11px",
            }}
          >
            ✦ members only
          </span>
        </Link>

        <div>
          <div style={{ fontFamily: poppins, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 16 }}>
            newest in the replay vault
          </div>
          <h2 style={{ fontFamily: poppins, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "var(--dark)", marginBottom: 14 }}>
            {replay.title}
          </h2>
          {replay.startIso && (
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grey-light)", marginBottom: 16 }}>
              {formatWorkshopWhenLA(replay.startIso)} &middot; {replay.durationMinutes} minutes
            </div>
          )}
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--grey)", maxWidth: 520, marginBottom: 26 }}>
            {replay.blurb} The full recording is saved in the vault along with every other class, and your free week opens all of them.
          </p>
          <Link href={FREE_TRIAL_CTA.href} className="btn-pink">
            {FREE_TRIAL_CTA.label}
          </Link>
          <p style={{ fontSize: 12.5, color: "var(--grey-light)", marginTop: 14 }}>
            No card needed. Watch it back as many times as you like.
          </p>
        </div>
      </div>
    </section>
  );
}
