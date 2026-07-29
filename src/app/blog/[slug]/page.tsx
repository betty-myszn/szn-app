import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BLOG_POSTS,
  postBySlug,
  categoryBySlug,
  relatedPosts,
  formatPostDate,
} from "@/lib/blog";
import { OG_IMAGE, SITE_URL, SITE_NAME } from "@/lib/site";

const pp = "var(--font-poppins), Poppins, sans-serif";

// Every post is a real URL rendered at build time. Without this the pages would still work, but
// they would be generated on demand, which is slower for the crawler and gives up the static HTML
// that makes a content page cheap to serve.
export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const category = categoryBySlug(post.category);
  const related = relatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${post.slug}`,
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
        articleSection: category?.name,
        image: `${SITE_URL}${OG_IMAGE.url}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          ...(category
            ? [{ "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/blog/category/${category.slug}` }]
            : []),
          { "@type": "ListItem", position: category ? 4 : 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
        ],
      },
      // The FAQ block is the highest-leverage schema on a page like this: it is what makes a post
      // eligible for the expandable answers in search results.
      {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lav)" }}>
            <Link href="/blog" className="no-underline" style={{ color: "var(--lav)" }}>blog</Link>
            {category && (
              <>
                <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
                <Link href={`/blog/category/${category.slug}`} className="no-underline" style={{ color: "var(--lav)" }}>
                  {category.name}
                </Link>
              </>
            )}
          </nav>

          <h1
            style={{
              fontFamily: pp,
              fontSize: "clamp(30px, 4.8vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-1.3px",
              lineHeight: 1.1,
              color: "#fff",
              margin: "18px 0 14px",
            }}
          >
            {post.title}
          </h1>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
            {formatPostDate(post.publishedAt)} · {post.readingMinutes} min read
          </div>
        </div>
      </section>

      {/* Intro, the snippet-eligible answer */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          {post.intro.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: "var(--dark)",
                fontWeight: i === 0 ? 500 : 400,
                marginTop: i === 0 ? 0 : 16,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="px-5 md:px-8 py-10" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          {post.sections.map((section) => (
            <div key={section.heading} style={{ marginBottom: 36 }}>
              <h2
                style={{
                  fontFamily: pp,
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.25,
                  color: "var(--dark)",
                  marginBottom: 12,
                }}
              >
                {section.heading}
              </h2>
              {section.body.map((para, i) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: "var(--grey)", marginTop: i === 0 ? 0 : 14 }}>
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQs, mirrored in the FAQPage schema above */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)", background: "var(--lav-light)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-5">common questions</div>
          <div style={{ border: "var(--border)", background: "#fff" }}>
            {post.faqs.map((faq, i) => (
              <div key={faq.question} className="p-6" style={{ borderTop: i === 0 ? undefined : "var(--border)" }}>
                <h3 style={{ fontFamily: pp, fontSize: 16, fontWeight: 800, letterSpacing: "-0.2px", color: "var(--dark)", marginBottom: 8 }}>
                  {faq.question}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--grey)" }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related, the internal linking that keeps a crawler moving through the section */}
      {related.length > 0 && (
        <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="tag mb-5">keep reading</div>
            <div style={{ border: "var(--border)" }}>
              {related.map((r, i) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block no-underline p-5"
                  style={{ borderTop: i === 0 ? undefined : "var(--border)" }}
                >
                  <h3 style={{ fontFamily: pp, fontSize: 15, fontWeight: 800, color: "var(--dark)", marginBottom: 4 }}>
                    {r.title}
                  </h3>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--grey)" }}>{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Conversion */}
      <section className="px-5 md:px-8 py-14" style={{ background: "var(--dark)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            style={{
              fontFamily: pp,
              fontSize: "clamp(24px, 3.6vw, 34px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.15,
              color: "#fff",
              marginBottom: 12,
            }}
          >
            want this read for <span className="pk">your chart?</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 460, margin: "0 auto 24px" }}>
            Calculate your free birth chart and see your own placements interpreted in full.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/chart" className="btn-pink">get your free chart</Link>
            <Link href="/blog" className="btn-outline btn-outline--white">more guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}
