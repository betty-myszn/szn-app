"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GIFT_SIGNS, type Gift, type GiftGuide } from "@/lib/gift-guide";
import s from "./gift-guide.module.css";

// One sign's Gift Issue: the collage cover on the left, the page for whichever gift is open on the
// right (a bottom sheet on phones), budget tabs that dim what's out of range, and a "drop a hint"
// link that opens this page straight onto one gift.

const BUDGETS = [
  { id: "all", label: "All", test: () => true },
  { id: "under30", label: "Under $30", test: (p: number) => p < 30 },
  { id: "mid", label: "$30 to $80", test: (p: number) => p >= 30 && p < 80 },
  { id: "splurge", label: "Spoil her $80+", test: (p: number) => p >= 80 },
] as const;
type BudgetId = (typeof BUDGETS)[number]["id"];

// USPS 2026 recommended send-by dates for Christmas, contiguous US.
const GROUND_CUTOFF = new Date(2026, 11, 17);

const title = (sign: string) => sign[0].toUpperCase() + sign.slice(1);
const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

const SPARKS = [
  [26, 46, 8], [87, 43, 10], [24, 82, 5], [56, 84, 9], [3, 44, 4.5], [53, 25, 2.6], [91, 56, 2.4],
  [29, 39, 2.2], [19, 6, 2.8], [60, 57, 2.2], [47, 91, 2.6], [30, 86, 2], [93, 30, 2.2],
];

export default function GiftIssue({ guide, dates }: { guide: GiftGuide; dates: string }) {
  const { sign, gifts } = guide;
  const [current, setCurrent] = useState(0);
  const [budget, setBudget] = useState<BudgetId>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const visible = useMemo(() => {
    const test = BUDGETS.find((b) => b.id === budget)!.test;
    return gifts.map((_, i) => i).filter((i) => test(gifts[i].price));
  }, [budget, gifts]);

  // Countdown and deep link both read the visitor's clock/URL, so they run after hydration.
  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    setDaysLeft(Math.ceil((GROUND_CUTOFF.getTime() - today.getTime()) / 86400000));
    const m = /^#gift-(\d+)$/.exec(window.location.hash);
    if (m && gifts[Number(m[1]) - 1]) {
      setCurrent(Number(m[1]) - 1);
      if (window.matchMedia("(max-width: 900px)").matches) setSheetOpen(true);
    }
  }, [gifts]);

  const open = useCallback((i: number) => {
    setCurrent(i);
    setHintText(null);
    if (window.matchMedia("(max-width: 900px)").matches) setSheetOpen(true);
  }, []);

  const step = (d: number) => {
    const k = visible.indexOf(current);
    setCurrent(visible[(k + d + visible.length) % visible.length]);
    setHintText(null);
  };

  const chooseBudget = (id: BudgetId) => {
    setBudget(id);
    const test = BUDGETS.find((b) => b.id === id)!.test;
    if (!test(gifts[current].price)) setCurrent(gifts.findIndex((g) => test(g.price)));
  };

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const gift = gifts[current];
  const pos = visible.indexOf(current);

  const dropHint = () => {
    const text = `Just leaving this here for absolutely no reason: ${gift.brand}, ${gift.name}, ${money(gift.price)} ${window.location.origin}/gift-guide/${sign}#gift-${current + 1}`;
    if (!navigator.clipboard) {
      setHintText(text);
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => setToast("Hint copied. Now send it to whoever needs to see it"))
      .catch(() => setHintText(text));
  };

  const letters = title(sign).split("");
  const letterSize = Math.min(8.2, 60 / letters.length);

  const countdown =
    daysLeft === null ? "Ship by Dec 17" : daysLeft > 1 ? `${daysLeft} days left to ship` : daysLeft === 1 ? "1 day left to ship" : daysLeft === 0 ? "Last day to ship Ground" : "Shipping cutoffs have passed";

  return (
    <div className={s.page}>
      <nav className={s.rail} aria-label="Pick a sign">
        {GIFT_SIGNS.map((g) => (
          <Link key={g} href={`/gift-guide/${g}`} aria-current={g === sign ? "page" : undefined}>
            {title(g)}
          </Link>
        ))}
      </nav>

      <aside className={s.ship} aria-label="Christmas delivery dates">
        <b className={s.holo}>{countdown}</b>
        <span>
          <strong>Order by for Christmas (USPS, contiguous US):</strong> Ground Thu Dec 17 · Priority Fri Dec 18 · Express Sat Dec 19
        </span>
        <span className={s.late}>
          Left it too late? The Bad B*tch Report lands in 48 hours, order by <strong>Tue Dec 22</strong>
        </span>
      </aside>

      <main className={s.spread}>
        <div>
          <section className={s.cover} aria-label={`${title(sign)} gift collage`}>
            <div className={`${s.paper} ${s.p1}`} />
            <div className={`${s.paper} ${s.p2}`} />
            <div className={`${s.paper} ${s.p3}`} />
            {SPARKS.map(([l, t, w], i) => (
              <div key={i} className={`${s.spark} ${s.holo}`} style={{ left: `${l}%`, top: `${t}%`, width: `${w}%` }} />
            ))}
            <div className={`${s.burst} ${s.holo}`}>
              <span>
                XMAS<b>2026</b>
              </span>
            </div>

            <header className={s.mast}>
              <h2>
                MY
                <br />
                <em>SZN</em>
              </h2>
              <div className={s.issue}>
                <b>THE GIFT ISSUE</b>
                Vol. 01 · {title(sign)}
                <br />
                Christmas 2026
              </div>
            </header>
            <p className={s.cl1}>{guide.coverline}</p>
            <p className={s.cl2}>
              {gifts.length} gifts for your
              <br />
              <b>{guide.ruler}-ruled</b> bestie
            </p>

            {gifts.map((g, i) => (
              <button
                key={g.slug}
                type="button"
                className={`${s.item} ${i === current ? s.itemOn : ""} ${visible.includes(i) ? "" : s.itemOut}`}
                style={{ left: `${g.pos.l}%`, top: `${g.pos.t}%`, width: `${g.pos.w}%`, transform: `rotate(${g.pos.r}deg)` }}
                aria-label={`${i + 1}. ${g.brand} ${g.name}`}
                onClick={() => open(i)}
              >
                <span className={s.num}>{i + 1}</span>
                <GiftArt gift={g} />
              </button>
            ))}

            <div className={s.ransom} aria-label={title(sign)}>
              {letters.map((ch, i) => (
                <span
                  key={i}
                  className={`${s[`r${i % 7}`]} ${i % 7 === 3 ? s.holo : ""}`}
                  style={{ fontSize: `${letterSize}cqi` }}
                >
                  {i % 3 === 1 ? ch.toLowerCase() : ch.toUpperCase()}
                </span>
              ))}
            </div>
          </section>
          <p className={s.hint}>☞ Tap any piece on the cover to open its page</p>
        </div>

        <div className={s.side}>
          <section className={s.letter}>
            <div className={s.kicker}>
              Gifts for your {title(sign)} · {dates}
            </div>
            <h1>
              {guide.headline[0]} <em>{guide.headline[1]}</em>
            </h1>
            <p>{guide.intro}</p>
          </section>

          <div className={s.budget} role="group" aria-label="Filter by budget">
            <span>Budget</span>
            {BUDGETS.map((b) => (
              <button key={b.id} type="button" aria-pressed={budget === b.id} onClick={() => chooseBudget(b.id)}>
                {b.label}
              </button>
            ))}
          </div>

          <article className={`${s.detail} ${gift.ours ? s.detailOurs : ""} ${sheetOpen ? s.detailOpen : ""}`} aria-live="polite">
            <div className={s.top}>
              <b>{gift.ours ? "The MY SZN pick" : `Gift ${pos + 1} of ${visible.length}`}</b>
              <div className={s.pager}>
                <button type="button" aria-label="Previous gift" onClick={() => step(-1)}>
                  ←
                </button>
                <button type="button" aria-label="Next gift" onClick={() => step(1)}>
                  →
                </button>
                <button type="button" className={s.close} aria-label="Close" onClick={() => setSheetOpen(false)}>
                  ×
                </button>
              </div>
            </div>
            <div className={s.body}>
              <div className={s.thumb}>
                <GiftArt gift={gift} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div className={s.dnum}>no.{current + 1}</div>
                <h3>{gift.name}</h3>
                <div className={s.brand}>{gift.brand}</div>
                <p className={s.why}>{gift.why}</p>
              </div>
            </div>
            <div className={s.buy}>
              <div className={s.price}>
                {money(gift.price)}
                <small>at {gift.store}</small>
              </div>
              <div className={s.ctas}>
                <button type="button" className={s.hintBtn} onClick={dropHint}>
                  Drop a hint
                </button>
                <a className={s.shop} href={gift.url} target={gift.ours ? undefined : "_blank"} rel={gift.ours ? undefined : "noopener"}>
                  {gift.ours ? "Gift her the report" : "Shop it"} →
                </a>
              </div>
            </div>
            {hintText && (
              <div className={s.hintBox}>
                <label htmlFor="gg-hint">Copy this and send it to whoever needs to see it</label>
                <textarea id="gg-hint" rows={3} readOnly value={hintText} onFocus={(e) => e.currentTarget.select()} autoFocus />
              </div>
            )}
          </article>

          <section className={s.credits}>
            <h2>Shop the cover</h2>
            <ol>
              {gifts.map((g, i) =>
                visible.includes(i) ? (
                  <li key={g.slug}>
                    <button type="button" aria-current={i === current} onClick={() => open(i)}>
                      <i>{i + 1}</i>
                      <span>
                        {g.brand}, {g.name}
                      </span>
                      <b>{money(g.price)}</b>
                    </button>
                  </li>
                ) : null,
              )}
            </ol>
            <p className={s.disclose}>Prices are in US dollars from each brand&apos;s own site, checked October 2026, and can change.</p>
          </section>
        </div>
      </main>

      {sheetOpen && <div className={s.scrim} onClick={() => setSheetOpen(false)} />}
      {toast && (
        <div className={s.toast} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

function GiftArt({ gift }: { gift: Gift }) {
  if (gift.img) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={gift.img} alt="" loading="lazy" decoding="async" />;
  }
  return <ReportArt />;
}

// Our own product, drawn as a sticker so it reads as the MY SZN pick on every cover.
function ReportArt() {
  return (
    <svg viewBox="0 0 220 240" aria-hidden="true">
      <rect x="26" y="18" width="180" height="214" fill="#111" transform="rotate(6 116 125)" />
      <rect x="14" y="8" width="180" height="214" fill="#fff" stroke="#111" strokeWidth="5" />
      <rect x="14" y="8" width="180" height="58" fill="#FF2D87" />
      <text x="104" y="36" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="20" fill="#fff">BAD B*TCH</text>
      <text x="104" y="56" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="13" fill="#fff" letterSpacing="4">REPORT</text>
      <circle cx="104" cy="128" r="40" fill="none" stroke="#111" strokeWidth="3" />
      <circle cx="104" cy="128" r="26" fill="none" stroke="#C8B4F8" strokeWidth="3" />
      <path d="M104 88 L104 168 M64 128 L144 128 M76 100 L132 156 M132 100 L76 156" stroke="#111" strokeWidth="1.5" />
      <circle cx="104" cy="128" r="7" fill="#FF2D87" />
      <text x="104" y="196" textAnchor="middle" fontFamily="'Courier Prime', monospace" fontWeight="700" fontSize="10" fill="#111">MADE FROM HER CHART</text>
      <text x="104" y="210" textAnchor="middle" fontFamily="'Courier Prime', monospace" fontWeight="700" fontSize="10" fill="#111">BY HAND IN 48H</text>
    </svg>
  );
}
