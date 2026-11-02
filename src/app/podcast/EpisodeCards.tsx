import Image from "next/image";
import Link from "next/link";
import type { PodcastEpisode } from "@/lib/podcast-episodes";

const pp = "var(--font-poppins), Poppins, sans-serif";

export function EpisodeCards({ episodes }: { episodes: PodcastEpisode[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {episodes.map((ep) => (
        <Link
          key={ep.slug}
          href={`/podcast/${ep.slug}`}
          style={{ display: "block", background: "#fff", border: "var(--border)", color: "var(--dark)", textDecoration: "none" }}
        >
          <Image
            src={ep.image.src}
            alt={ep.image.alt}
            width={ep.image.width}
            height={ep.image.height}
            sizes="(max-width: 640px) 100vw, 440px"
            style={{ width: "100%", height: "auto", display: "block", borderBottom: "var(--border)" }}
          />
          <div className="p-5">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
              {ep.season} · with {ep.guest}
            </div>
            <div style={{ fontFamily: pp, fontSize: 19, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.3px", marginBottom: 6 }}>
              {ep.title}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{ep.subtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
