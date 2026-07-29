import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryBySlug,
  postsInCategory,
  populatedCategories,
  formatPostDate,
  type CategorySlug,
} from "@/lib/blog";
import { OG_IMAGE, SITE_URL } from "@/lib/site";

const pp = "var(--font-poppins), Poppins, sans-serif";

// Category pages are the "sections" of the blog and they carry real SEO weight of their own: they
// target the broader head term ("birth chart basics") while individual posts target the long tail.
// Deliberately only the categories that actually have posts. A category defined in blog.ts but not
// yet written for would otherwise build a real, indexable page with an empty list on it, which is a
// thin-content page pointing at nothing. Empty categories 404 until they have something to show.
export function generateStaticParams() {
  return populatedCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) return { title: "Not found" };

  return {
    title: category.metaTitle,
    description: category.description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: {
      title: category.metaTitle,
      description: category.description,
      url: `/blog/category/${category.slug}`,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const posts = postsInCategory(category.slug as CategorySlug);
  if (posts.length === 0) notFound();
  const others = populatedCategories().filter((c) => c.slug !== category.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog/category/${category.slug}`,
        name: category.metaTitle,
        description: category.description,
        url: `${SITE_URL}/blog/category/${category.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/blog/category/${category.slug}` },
        ],
      },
      {
        "@type": "ItemList",
        name: category.name,
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

      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}>
            <Link href="/blog" className="no-underline" style={{ color: "var(--lav)" }}>blog</Link>
          </nav>
          <h1
            style={{
              fontFamily: pp,
              fontSize: "clamp(30px, 5vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1.3px",
              lineHeight: 1.1,
              color: "#fff",
              margin: "18px 0 14px",
            }}
          >
            {category.title}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 560 }}>
            {category.intro}
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-5">{posts.length} {posts.length === 1 ? "guide" : "guides"}</div>
          <div style={{ border: "var(--border)" }}>
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block no-underline p-6"
                style={{ borderTop: i === 0 ? undefined : "var(--border)" }}
              >
                <h2 style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px", lineHeight: 1.3, color: "var(--dark)", marginBottom: 6 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--grey)", marginBottom: 8 }}>{post.excerpt}</p>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grey-light)" }}>
                  {formatPostDate(post.publishedAt)} · {post.readingMinutes} min read
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sibling sections, so no category page is a dead end for a crawler or a reader */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)", background: "var(--lav-light)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-4">other sections</div>
          <div className="flex gap-2 flex-wrap">
            {others.map((c) => (
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
                  background: "#fff",
                  color: "var(--dark)",
                }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ fontFamily: pp, fontSize: "clamp(24px, 3.6vw, 34px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, color: "#fff", marginBottom: 12 }}>
            read your own <span className="pk">chart.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 460, margin: "0 auto 24px" }}>
            Free birth chart, calculated properly, with every placement interpreted.
          </p>
          <Link href="/chart" className="btn-pink">get your free chart</Link>
        </div>
      </section>
    </>
  );
}
