import Link from "next/link";
import { workshopCardRow, shortWorkshopMeta } from "@/lib/workshops";

// The designed "your free week is over" state. An expired trial is redirected here from every gated
// route (see proxy.ts) and lands here on login (postAuthDestination), so it must stand alone and
// never look like a broken page. Her account, chart and everything she started stay saved; the only
// door left open is the paid join, which reuses the normal /membership checkout so converting
// updates her existing account (client_reference_id) rather than making her start over.

// Re-rendered hourly rather than frozen at build, because the workshop row below is read from the
// live schedule and a page baked at deploy time would go stale the moment a class passed.
export const revalidate = 3600;

export const metadata = {
  title: "Your free week is over · MY SZN",
  description: "Your 7-day MY SZN trial has ended. Become a member to pick up where you left off.",
};

const css = `
.fte{font-family:var(--font-dm-sans),'DM Sans',sans-serif;color:var(--dark);background:#fff;}
.fte .wrap{max-width:1000px;margin:0 auto;padding:0 22px;}
.fte .sec{padding:64px 0;}
.fte .disp{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;letter-spacing:-0.035em;line-height:1.0;margin:0;text-wrap:balance;}
.fte .ey{font-family:var(--font-poppins),Poppins,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--pink);}
.fte .rl{display:flex;align-items:center;justify-content:center;gap:16px;font-family:var(--font-poppins),Poppins,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--dark);}
.fte .rl::before,.fte .rl::after{content:"";flex:1;height:1.5px;background:currentColor;opacity:.3;}
.fte .pk{color:var(--pink);}
.fte .micro{font-size:12.5px;color:var(--grey-light);}
.fte .cta{display:block;width:100%;font-family:var(--font-poppins),Poppins,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:18px 36px;border:1.5px solid var(--dark);background:var(--pink);color:#fff;box-shadow:6px 6px 0 var(--dark);text-decoration:none;text-align:center;transition:transform .12s ease,box-shadow .12s ease;}
.fte .cta:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--dark);}

.fte .hero{background:var(--dark);color:#fff;border-bottom:1.5px solid var(--dark);text-align:center;}
.fte .hero-inner{padding:72px 0 64px;}
.fte .hero .ey{color:var(--lav);display:inline-block;margin-bottom:22px;}
.fte .hero h1{font-size:clamp(44px,8.5vw,88px);color:#fff;}
.fte .hero .lead{max-width:540px;font-size:clamp(16px,2.2vw,20px);color:rgba(255,255,255,.82);margin:24px auto 0;}

.fte .recap{background:var(--cream);border-bottom:1.5px solid var(--dark);}
.fte .recap-grid{display:grid;grid-template-columns:1fr;margin-top:32px;border:1.5px solid var(--dark);background:#fff;}
@media(min-width:720px){.fte .recap-grid{grid-template-columns:1fr 1fr;}}
.fte .ri{display:flex;gap:13px;align-items:center;padding:17px 20px;border-bottom:1.5px solid var(--dark);opacity:.6;}
@media(min-width:720px){.fte .ri:nth-child(odd){border-right:1.5px solid var(--dark);}.fte .ri:nth-last-child(-n+2){border-bottom:none;}}
@media(max-width:719px){.fte .ri:last-child{border-bottom:none;}}
.fte .ri .x{flex-shrink:0;width:22px;height:22px;display:grid;place-items:center;color:var(--grey-light);font-size:13px;border:1.5px solid rgba(26,26,26,.3);}
.fte .ri b{font-family:var(--font-poppins),Poppins,sans-serif;text-transform:lowercase;font-weight:700;font-size:15px;}
.fte .ri.keep{opacity:1;}
.fte .ri.keep .x{color:var(--pink);border-color:var(--pink);}
.fte .backlink{display:inline-block;margin-top:22px;font-family:var(--font-poppins),Poppins,sans-serif;font-weight:700;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--lav);text-decoration:none;}
.fte .backlink:hover{color:#fff;}

.fte .coming h2{font-size:clamp(28px,5vw,48px);text-transform:lowercase;margin-top:18px;}
.fte .ev-grid{display:grid;grid-template-columns:1fr;gap:20px;margin-top:32px;}
@media(min-width:640px){.fte .ev-grid{grid-template-columns:1fr 1fr;}}
@media(min-width:820px){.fte .ev-grid{grid-template-columns:repeat(3,1fr);}}
.fte .ev{border:1.5px solid var(--dark);box-shadow:8px 8px 0 var(--dark);background:#fff;overflow:hidden;display:flex;flex-direction:column;}
.fte .ev-cover{width:100%;height:auto;display:block;border-bottom:1.5px solid var(--dark);background:var(--lav-light);}
.fte .ev-body{padding:16px 16px 20px;flex:1;display:flex;flex-direction:column;gap:5px;}
.fte .ev .m{font-family:var(--font-poppins),Poppins,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--pink);}
.fte .ev h4{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:16px;line-height:1.15;letter-spacing:-0.02em;}
.fte .ev p{font-size:12.5px;line-height:1.6;color:var(--grey-light);}

.fte .benefits-sec{background:var(--lav-light);border-bottom:1.5px solid var(--dark);}
.fte .benefits{display:grid;grid-template-columns:1fr;gap:14px;margin-top:30px;}
@media(min-width:720px){.fte .benefits{grid-template-columns:1fr 1fr;}}
.fte .ben{display:flex;gap:13px;align-items:flex-start;background:#fff;border:1.5px solid var(--dark);padding:18px 20px;}
.fte .ben .bm{flex-shrink:0;color:var(--pink);font-size:16px;line-height:1.5;}
.fte .ben b{font-family:var(--font-poppins),Poppins,sans-serif;text-transform:lowercase;font-weight:700;font-size:15px;display:block;margin-bottom:3px;}
.fte .ben p{font-size:13px;color:var(--grey-light);line-height:1.6;}

.fte .ask{background:var(--pink);color:#fff;border-bottom:1.5px solid var(--dark);text-align:center;}
.fte .ask .ey{color:#fff;display:inline-block;margin-bottom:14px;}
.fte .ask h2{color:#fff;font-size:clamp(30px,5.4vw,58px);text-transform:lowercase;}
.fte .ask-card{max-width:600px;margin:30px auto 0;background:#fff;color:var(--dark);border:1.5px solid var(--dark);box-shadow:14px 14px 0 var(--dark);padding:34px;}
.fte .ask-card .lbl{font-family:var(--font-poppins),Poppins,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--pink);}
.fte .price{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;text-transform:lowercase;letter-spacing:-0.03em;font-size:clamp(40px,8vw,62px);line-height:1;margin:6px 0 2px;}
.fte .price small{font-size:16px;font-weight:700;color:var(--grey-light);letter-spacing:0;}
.fte .ask-card p{font-size:15px;color:var(--grey-light);max-width:430px;margin:12px auto 24px;}

.fte .foot{padding:40px 0 60px;text-align:center;}
.fte .foot .mk{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;text-transform:lowercase;letter-spacing:-0.02em;font-size:20px;}
.fte .foot .ey{color:var(--grey-light);display:block;margin-top:10px;}
`;

// What an expired trial keeps for free, versus what becoming a member unlocks again.
const STILL_YOURS = [
  "the chat rooms",
  "your birth chart",
  "your human design chart",
];

const MEMBERS_ONLY = [
  "your personalised platform",
  "this season's readings",
  "the workshops + replays",
  "the astro tapping",
  "the meditations",
  "the vault + resources",
];


const BENEFITS: Array<[string, string]> = [
  ["pick up where you left off", "your chart, journal, goals and progress are all still saved on this account."],
  ["a new workshop every month", "a live masterclass and a live astro tapping, every single season."],
  ["coaching + community", "the member rooms and the women who actually talk about this stuff with you."],
  ["a platform that evolves with you", "your portal changes with the season and the version of you that's ready to emerge."],
  ["the full vault, always", "every replay, workbook and resource, yours for as long as you stay."],
  ["cancel anytime", "stay for as many seasons as it's working for you. no lock-in, no minimum."],
];

// Read from the real schedule rather than a hardcoded list, so a woman who just lost access is never
// shown a class from a fortnight ago as the reason to come back. workshopCardRow leads with whatever
// is genuinely still to come and tops the row up with the newest replays (which are in the vault
// she'd be rejoining), so the row never runs half empty between seasons.
//
// The clock is read here rather than inside the component because reading it during a render is
// impure; this page is regenerated hourly (see revalidate above), which is what keeps it current.
async function comingUp() {
  const now = Date.now();
  return { now, coming: workshopCardRow(now, 3) };
}

export default async function TrialEndedPage() {
  const { now, coming } = await comingUp();

  return (
    <div className="fte">
      <style>{css}</style>

      <header className="hero">
        <div className="wrap hero-inner">
          <span className="ey">your free week</span>
          <h1 className="disp">your free week<br />is over.</h1>
          <p className="lead">
            {"The chat rooms and your chart are still yours to keep. Your personalised platform, the workshops and the meditations are the part that's for members."}
          </p>
          <Link href="/community" className="backlink">back to the chat rooms →</Link>
        </div>
      </header>

      <section className="sec recap">
        <div className="wrap">
          <div className="rl">still yours, free</div>
          <div className="recap-grid">
            {STILL_YOURS.map((item) => (
              <div className="ri keep" key={item}>
                <span className="x">✦</span>
                <b>{item}</b>
              </div>
            ))}
          </div>
          <div className="rl" style={{ marginTop: 44 }}>members only now</div>
          <div className="recap-grid">
            {MEMBERS_ONLY.map((item) => (
              <div className="ri" key={item}>
                <span className="x">✕</span>
                <b>{item}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec coming">
        <div className="wrap">
          <div className="rl">what&apos;s coming next inside</div>
          <h2 className="disp" style={{ textAlign: "center" }}>the workshops you&apos;d be walking into.</h2>
          <div className="ev-grid">
            {coming.map((ev) => (
              <div className="ev" key={ev.id}>
                {ev.coverImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img className="ev-cover" src={ev.coverImage} alt={ev.title} />
                )}
                <div className="ev-body">
                  <div className="m">{shortWorkshopMeta(ev, now)}</div>
                  <h4>{ev.title}</h4>
                  <p>{ev.blurb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec benefits-sec">
        <div className="wrap">
          <div className="rl">why members stay</div>
          <div className="benefits">
            {BENEFITS.map(([title, sub]) => (
              <div className="ben" key={title}>
                <span className="bm">✦</span>
                <div>
                  <b>{title}</b>
                  <p>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ask">
        <div className="wrap">
          <span className="ey">keep going</span>
          <h2 className="disp">you don&apos;t have to leave.</h2>
          <div className="ask-card">
            <span className="lbl">become a member</span>
            <div className="price">$88<small> / month</small></div>
            <p>
              {"Your chart, your journal, your goals and everything you started this week are still saved. Join and you pick up in the exact same account, right where you left off."}
            </p>
            <Link href="/membership" className="cta">become a member · $88/month</Link>
            <p className="micro" style={{ marginTop: 14 }}>
              the free week has closed, so this is the only door still open.
            </p>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="mk">my szn ✦</div>
          <span className="ey">your account is safe. come back any time.</span>
        </div>
      </footer>
    </div>
  );
}
