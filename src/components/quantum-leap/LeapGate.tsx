"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/lib/use-member";
import { pp } from "@/lib/eleven-eleven-hub";
import { qlIsLive, QL_LIVE_AT } from "@/lib/quantum-leap";

// Members only, and nothing until the Sun enters Sagittarius. The proxy already sends logged-out
// visitors to /login; a member who opens a link early is sent back to the coven home without a hint;
// Betty's admin preview shows everything with a strip saying it isn't live yet. The content itself
// only ever comes from /api/quantum-leap, which applies the same rules on the server.
export default function LeapGate({ path, children }: { path: string; children: ReactNode }) {
  const { member, ready } = useMember();
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const early = ready && now !== null && !!member && !qlIsLive(now, member.isAdmin);
  // Before Sagittarius SZN there is nothing here for a member, not even a teaser: straight back home.
  useEffect(() => {
    if (early) router.replace("/coven");
  }, [early, router]);

  if (!ready || now === null || early) return null;

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: pp, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>coven members only, babe. 🔮</h1>
          <Link href={`/login?redirect=${encodeURIComponent(path)}`} className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {now < QL_LIVE_AT && (
        <div style={{ background: "var(--dark)", color: "#fff", fontFamily: pp, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", padding: "10px 16px" }}>
          👀 admin preview · members see this from sunday the 22nd of november, 7:23am uk
        </div>
      )}
      {children}
    </>
  );
}

export function LeapLoadFailed() {
  return (
    <section className="min-h-[50vh] flex items-center justify-center px-5" style={{ color: "var(--dark)" }}>
      <div className="text-center">
        <h1 style={{ fontFamily: pp, fontSize: 24, fontWeight: 800, marginBottom: 16 }}>that didn&apos;t load, babe. refresh and try again 💖</h1>
        <Link href="/coven" className="btn-pink">back to the coven</Link>
      </div>
    </section>
  );
}
