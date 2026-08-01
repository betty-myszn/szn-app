"use client";

import { useSeasonDesign } from "@/lib/use-season-design";
import SeasonDesignReadingView, {
  Shell,
  Link,
  seasonLinkBtn,
} from "@/components/SeasonDesignReading";

// TEMPORARY local preview of the Leo season reading, with NO login required, so the
// reading can be viewed while the members-only /your-season/human-design route is
// gated. It reads the birth data this browser already cached from using the site,
// and forces the Leo season via ?sign=leo. Delete this route before shipping; the
// real page lives at /your-season/human-design.
export default function LeoPreviewPage() {
  const { reading, loading, unavailable } = useSeasonDesign("leo");

  if (loading) return <Shell><p style={{ opacity: 0.6 }}>reading your season...</p></Shell>;

  if (unavailable) {
    return <Shell><p>Leo reading not available.</p></Shell>;
  }

  if (!reading) {
    return (
      <Shell>
        <PreviewBanner />
        <p style={{ margin: "0 0 16px" }}>
          This preview reads the birth details your browser saved from the site. Open your chart
          once so it gets cached, then come back here.
        </p>
        <Link href="/human-design" style={seasonLinkBtn}>open my human design chart</Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <PreviewBanner />
      <SeasonDesignReadingView r={reading} />
    </Shell>
  );
}

function PreviewBanner() {
  return (
    <div
      style={{
        background: "var(--gold)",
        borderRadius: 12,
        padding: "10px 14px",
        marginBottom: 22,
        fontSize: 12.5,
        lineHeight: 1.5,
      }}
    >
      Temporary preview, no login needed. The real page for members is at
      {" "}
      <strong>/your-season/human-design</strong>.
    </div>
  );
}
