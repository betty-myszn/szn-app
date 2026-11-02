import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PODCAST_EPISODES, getEpisode } from "@/lib/podcast-episodes";
import { EpisodeCards } from "../EpisodeCards";

const pp = "var(--font-poppins), Poppins, sans-serif";

// One page per episode so every email, post and guest share has its own link.
export function generateStaticParams() {
  return PODCAST_EPISODES.map((ep) => ({ slug: ep.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) return {};
  const url = `/podcast/${ep.slug}`;
  const title = `${ep.title}: ${ep.subtitle}`;
  return {
    title,
    description: ep.intro[0],
    alternates: { canonical: url },
    openGraph: { title, description: ep.subtitle, url, type: "article", images: [{ url: ep.image.src, width: ep.image.width, height: ep.image.height }] },
    twitter: { card: "summary_large_image", title, images: [ep.image.src] },
  };
}

const btn = {
  display: "inline-flex",
  alignItems: "center",
  padding: "12px 24px",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textDecoration: "none",
  textTransform: "uppercase",
} as const;

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) notFound();
  const more = PODCAST_EPISODES.filter((e) => e.slug !== ep.slug).slice(0, 4);

  return (
    <>
      <div style={{ background: "var(--lav-light)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <Link href="/podcast" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark)" }}>
            ← all episodes
          </Link>
          <div className="tag mt-6 mb-4">the my szn podcast, {ep.season}</div>
          <h1 style={{ fontFamily: pp, fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.05, color: "var(--dark)", marginBottom: 12 }}>
            {ep.title}
          </h1>
          <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.5, color: "var(--dark)", marginBottom: 28 }}>{ep.subtitle}</p>

          {ep.youtubeId ? (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", border: "var(--border)", background: "var(--dark)" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ep.youtubeId}`}
                title={`${ep.title} with ${ep.guest}, MY SZN podcast`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          ) : (
            <Image
              src={ep.image.src}
              alt={ep.image.alt}
              width={ep.image.width}
              height={ep.image.height}
              priority
              sizes="(max-width: 768px) 100vw, 720px"
              style={{ width: "100%", height: "auto", display: "block", border: "var(--border)" }}
            />
          )}

          {ep.spotifyEpisodeId && (
            <iframe
              src={`https://open.spotify.com/embed/episode/${ep.spotifyEpisodeId}`}
              title={`${ep.title} on Spotify`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ width: "100%", height: 152, border: 0, marginTop: 20, borderRadius: 12 }}
            />
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            {ep.youtubeId && (
              <a href={`https://youtu.be/${ep.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "#FF0000" }}>
                Watch on YouTube
              </a>
            )}
            {ep.spotifyEpisodeId && (
              <a href={`https://open.spotify.com/episode/${ep.spotifyEpisodeId}`} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "#1DB954" }}>
                Spotify
              </a>
            )}
            {ep.appleUrl && (
              <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "linear-gradient(180deg, #F452FF 0%, #832BC1 100%)" }}>
                Apple Podcasts
              </a>
            )}
          </div>
        </div>
      </div>

      <div style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto px-6 py-14">
          {ep.intro.map((p) => (
            <p key={p.slice(0, 24)} style={{ fontSize: 16, lineHeight: 1.75, color: "var(--dark)", marginBottom: 18 }}>
              {p}
            </p>
          ))}

          <div className="tag mt-10 mb-5">what we get into</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {ep.topics.map((t, i) => (
              <div
                key={t.title}
                className="p-6"
                style={{ background: i % 3 === 0 ? "var(--pink-light)" : i % 3 === 1 ? "var(--lav-light)" : "#fff", border: "var(--border)", marginRight: -1.5, marginBottom: -1.5 }}
              >
                <div style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, marginBottom: 6, color: "var(--dark)" }}>{t.title}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--dark)", margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>

          {ep.guestInstagram && (
            <p style={{ fontSize: 14, color: "var(--dark)", marginTop: 28 }}>
              Follow {ep.guest} at{" "}
              <a href={`https://www.instagram.com/${ep.guestInstagram}/`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--dark)", fontWeight: 700, textDecoration: "underline" }}>
                @{ep.guestInstagram}
              </a>
            </p>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <div style={{ background: "var(--lav-light)", borderBottom: "var(--border)" }}>
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="tag mb-6 text-center">more episodes</div>
            <EpisodeCards episodes={more} />
          </div>
        </div>
      )}
    </>
  );
}
