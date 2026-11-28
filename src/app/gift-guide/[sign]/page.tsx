import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GIFT_GUIDES, GIFT_SIGNS, isGiftSign } from "@/lib/gift-guide";
import { SEASON_PAGES } from "@/lib/season-pages";
import GiftIssue from "../GiftIssue";

// Twelve static pages, one shoppable magazine cover per sign. "Gifts for a Scorpio" style searches
// spike every December, so each sign is its own indexable URL.
export function generateStaticParams() {
  return GIFT_SIGNS.map((sign) => ({ sign }));
}

// No `dynamicParams = false`: it 404s every sign under `next dev`, and notFound() below already
// turns away anything that isn't one of the twelve.

const title = (sign: string) => sign[0].toUpperCase() + sign.slice(1);

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const { sign } = await params;
  if (!isGiftSign(sign)) return {};
  const guide = GIFT_GUIDES[sign];
  const name = title(sign);
  const description = `${guide.gifts.length} Christmas gifts for your ${name} bestie, picked by her chart: ${guide.gifts
    .slice(0, 3)
    .map((g) => `${g.brand} ${g.name}`)
    .join(", ")} and more, from under $30 to spoil-her picks.`;
  const url = `/gift-guide/${sign}`;
  return {
    title: `Christmas Gifts for a ${name}: The ${name} Gift Guide 2026`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `The Gift Issue: ${name}`, description, url, type: "article" },
    twitter: { card: "summary_large_image", title: `The Gift Issue: ${name}`, description },
  };
}

export default async function GiftGuidePage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params;
  if (!isGiftSign(sign)) notFound();
  const dates = SEASON_PAGES[sign].dates.replace(" - ", " to ");
  return <GiftIssue guide={GIFT_GUIDES[sign]} dates={dates} />;
}
