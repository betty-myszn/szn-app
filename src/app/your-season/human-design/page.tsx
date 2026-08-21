"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSeasonDesign } from "@/lib/use-season-design";
import SeasonDesignReadingView, {
  Shell,
  Link,
  seasonLinkBtn,
  seasonLinkBtnOutline,
} from "@/components/SeasonDesignReading";

// The current season through Human Design, the member view. Reads the logged-in member's
// saved birth data and renders the shared reading component. Which season it is comes from
// the date, so this page follows the sky on its own.
//
// ?sign=virgo previews a season before the Sun gets there, which is how a new season's reading
// gets checked over while the current one is still live.
export default function SeasonDesignPage() {
  return (
    <Suspense fallback={<Shell><p style={{ opacity: 0.6 }}>reading your season...</p></Shell>}>
      <SeasonDesign />
    </Suspense>
  );
}

function SeasonDesign() {
  const previewSign = useSearchParams().get("sign") ?? undefined;
  const { reading, loading, unavailable } = useSeasonDesign(previewSign);

  if (loading) return <Shell><p style={{ opacity: 0.6 }}>reading your season...</p></Shell>;

  if (unavailable) {
    return (
      <Shell>
        <p style={{ marginBottom: 12 }}>
          The Human Design reading for this season is on its way. Check back in a few days.
        </p>
        <Link href="/human-design" style={seasonLinkBtnOutline}>see my human design chart</Link>
      </Shell>
    );
  }

  if (!reading) {
    return (
      <Shell>
        <p style={{ marginBottom: 16 }}>
          We need your birth date, exact time and place to build your season reading.
        </p>
        <Link href="/settings" style={seasonLinkBtn}>add your birth details</Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Link href="/human-design" style={{ fontSize: 13, textDecoration: "none", color: "var(--dark)", opacity: 0.65 }}>
          &larr; my human design chart
        </Link>
        <span style={{ fontSize: 13, color: "var(--dark)", opacity: 0.4 }}>{reading.season.title.toLowerCase()}</span>
      </div>
      <SeasonDesignReadingView r={reading} />
    </Shell>
  );
}
