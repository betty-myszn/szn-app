"use client";

import { useSeasonDesign } from "@/lib/use-season-design";
import SeasonDesignReadingView, {
  Shell,
  Link,
  seasonLinkBtn,
  seasonLinkBtnOutline,
} from "@/components/SeasonDesignReading";

// Leo Season through Human Design, the member view. Reads the logged-in member's
// saved birth data and renders the shared reading component.
export default function SeasonDesignPage() {
  const { reading, loading, unavailable } = useSeasonDesign();

  if (loading) return <Shell><p style={{ opacity: 0.6 }}>reading your season...</p></Shell>;

  if (unavailable) {
    return (
      <Shell>
        <p style={{ marginBottom: 12 }}>
          The Human Design reading for this season is on its way. Leo Season is the first one live.
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
