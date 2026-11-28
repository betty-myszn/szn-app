import type { Metadata } from "next";
import Link from "next/link";
import { GIFT_GUIDES, GIFT_SIGNS } from "@/lib/gift-guide";
import { SEASON_PAGES } from "@/lib/season-pages";
import s from "./gift-guide.module.css";

// The newsstand: twelve mini covers, one per sign, each opening that sign's Gift Issue.

export const metadata: Metadata = {
  title: "The Gift Issue: Christmas Gifts for Every Zodiac Sign 2026",
  description:
    "A shoppable gift guide for every zodiac sign, picked by her chart: real gifts with real prices from under $30 to spoil-her splurges, plus Christmas shipping dates.",
  alternates: { canonical: "/gift-guide" },
  openGraph: {
    title: "The Gift Issue: Christmas 2026",
    description: "Gifts for every sign, picked by her chart.",
    url: "/gift-guide",
    type: "website",
  },
};

// Rebuilt daily so the "it's her szn" sticker moves with the season.
export const revalidate = 86400;

const title = (sign: string) => sign[0].toUpperCase() + sign.slice(1);

// Which three gifts peek out of each mini cover, and where.
const PEEK = [
  { l: 8, t: 30, w: 30, r: -8 },
  { l: 58, t: 34, w: 32, r: 7 },
  { l: 30, t: 52, w: 34, r: -4 },
];

export default function GiftGuideIndex() {
  const now = new Date();
  return (
    <div className={s.page}>
      <header className={s.rackHead}>
        <div className={s.kicker}>MY SZN · The Gift Issue · Christmas 2026</div>
        <h1>
          Gifts for every sign, picked by <em>her chart</em>
        </h1>
        <p>
          Pick the sign of the person you&apos;re shopping for and open her cover. Every page is a collage of real gifts with real prices,
          from stocking fillers under $30 to the ones that make her cry, each one chosen for how her sign actually lives, loves and spends.
        </p>
      </header>
      <div className={s.rack}>
        {GIFT_SIGNS.map((sign) => {
          const guide = GIFT_GUIDES[sign];
          const peek = guide.gifts.filter((g) => g.img).slice(0, 3);
          const isNow = SEASON_PAGES[sign].name && isSeasonNow(SEASON_PAGES[sign].dates, now);
          return (
            <Link key={sign} href={`/gift-guide/${sign}`} className={s.mini} aria-label={`The ${title(sign)} gift guide`}>
              <span className={s.miniMast}>
                MY
                <br />
                <em>SZN</em>
              </span>
              <span className={s.miniDates}>
                Gift Issue
                <br />
                {guide.ruler}-ruled
              </span>
              {peek.map((g, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={g.slug}
                  src={g.img}
                  alt=""
                  loading="lazy"
                  style={{ left: `${PEEK[i].l}%`, top: `${PEEK[i].t}%`, width: `${PEEK[i].w}%`, transform: `rotate(${PEEK[i].r}deg)` }}
                />
              ))}
              {isNow && <span className={`${s.miniNow} ${s.holo}`}>It&apos;s her szn</span>}
              <span className={s.miniSign}>{title(sign)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// "October 23 - November 21" against today, so the sign whose season it is gets a sticker.
function isSeasonNow(range: string, now: Date) {
  const [a, b] = range.split(" - ").map((d) => new Date(`${d} ${now.getFullYear()}`));
  if (b < a) return now >= a || now <= new Date(b.getTime() + 86400000);
  return now >= a && now < new Date(b.getTime() + 86400000);
}
