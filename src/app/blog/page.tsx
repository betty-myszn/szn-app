import type { Metadata } from "next";
import Link from "next/link";
import { allPosts, populatedCategories, postsInCategory, formatPostDate } from "@/lib/blog";
import { OG_IMAGE, SITE_URL } from "@/lib/site";

const pp = "var(--font-poppins), Poppins, sans-serif";

// A server component on purpose. Most of this app is "use client" because it reads a member's
// chart, but the blog exists to be crawled, so every page here renders to static HTML at build
// time with its own metadata and structured data. A client component cannot export metadata at all.
export const metadata: Metadata = {
  title: "Astrology Blog: Birth Charts, Zodiac Signs, Love & Timing",
  description:
    "Plain-English astrology guides. How to read your birth chart, what each placement means, Venus and compatibility, career placements, and how to work with moon phases and transits.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The MY SZN Astrology Blog",
    description:
      "Plain-English guides to birth charts, zodiac signs, love, career and cosmic timing. No jargon assumed.",
    url: "/blog",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export default function BlogHubPage() {
  const categories = populatedCategories();
  const posts = allPosts();
  const [featured, ...rest] = posts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog`,
        name: "The MY SZN Astrology Blog",
        description:
          "Plain-English astrology guides on birth charts, zodiac signs, love, career and cosmic timing.",
        url: `${SITE_URL}/blog`,
        publisher: { "@type": "Organization", name: "MY SZN", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Latest astrology guides",
        itemListElement: posts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          url: `${SITE_URL}/blog/${p.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="px-5 md:px-8 py-16" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="tag mb-3">the blog</div>
          <h1
            style={{
              fontFamily: pp,
              fontSize: "clamp(34px, 5.5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            astrology, explained<br />
            <span className="pk">without the jargon.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 560 }}>
            Real guides to reading your birth chart, understanding your placements, and working with
            the sky instead of against it. Written for people who want to actually understand it,
            not just be told their sun sign.
          </p>
        </div>
      </section>

      {/* Section nav, also the internal linking spine for the category pages */}
      <section className="px-5 md:px-8 py-8" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto flex gap-2 flex-wrap">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              className="no-underline"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "9px 16px",
                border: "var(--border)",
                color: "var(--dark)",
              }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured, newest post */}
      {featured && (
        <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)", background: "var(--lav-light)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="tag mb-3">latest</div>
            <Link href={`/blog/${featured.slug}`} className="no-underline">
              <h2
                style={{
                  fontFamily: pp,
                  fontSize: "clamp(24px, 3.5vw, 34px)",
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  lineHeight: 1.15,
                  color: "var(--dark)",
                  marginBottom: 12,
                }}
              >
                {featured.title}
              </h2>
            </Link>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#3C2A70", maxWidth: 620, marginBottom: 14 }}>
              {featured.excerpt}
            </p>
            <Link href={`/blog/${featured.slug}`} className="btn-pink" style={{ display: "inline-block" }}>
              read it
            </Link>
          </div>
        </section>
      )}

      {/* One block per category, which is the "sections" structure and also gives every category
          page a crawlable entry point from the hub. */}
      {categories.map((category) => {
        const inCategory = postsInCategory(category.slug);
        return (
          <section key={category.slug} className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
                <h2 style={{ fontFamily: pp, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px" }}>
                  {category.name}
                </h2>
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="no-underline"
                  style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pink)" }}
                >
                  all {inCategory.length} →
                </Link>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey)", maxWidth: 620, marginBottom: 20 }}>
                {category.description}
              </p>

              <div style={{ border: "var(--border)" }}>
                {inCategory.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block no-underline p-6"
                    style={{ borderTop: i === 0 ? undefined : "var(--border)" }}
                  >
                    <h3
                      style={{
                        fontFamily: pp,
                        fontSize: 17,
                        fontWeight: 800,
                        letterSpacing: "-0.3px",
                        lineHeight: 1.3,
                        color: "var(--dark)",
                        marginBottom: 6,
                      }}
                    >
                      {post.title}
                    </h3>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--grey)", marginBottom: 8 }}>
                      {post.excerpt}
                    </p>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)" }}>
                      {formatPostDate(post.publishedAt)} · {post.readingMinutes} min read
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Conversion block. The blog exists to be found, this is the part that makes being found
          worth something. */}
      <section className="px-5 md:px-8 py-16" style={{ background: "var(--dark)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="tag mb-3">go deeper</div>
          <h2
            style={{
              fontFamily: pp,
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.15,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            your actual chart, <span className="pk">read properly.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 26px" }}>
            Reading about placements is one thing. Seeing every one of yours interpreted in full,
            updating with the sky each season, is the whole point of MY SZN.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/chart" className="btn-pink">get your free birth chart</Link>
            <Link href="/membership" className="btn-outline btn-outline--white">see the membership</Link>
          </div>
          {rest.length > 0 && (
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 22 }}>
              {posts.length} guides and counting.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
