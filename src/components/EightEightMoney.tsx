"use client";

import Link from "next/link";
import { useMember } from "@/lib/use-member";
import { useChart } from "@/lib/use-chart";
import { buildEightEightMoney } from "@/lib/eight-eight-money";
import { isEightEightLive } from "@/lib/eight-eight-gate";

const poppins = "var(--font-poppins), Poppins, sans-serif";

const CSS = `
.ee-wrap{max-width:62rem;margin:0 auto;}
.ee-tag{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--pink);}
.ee-disp{font-family:${poppins};font-weight:800;letter-spacing:-1px;line-height:1.08;text-transform:lowercase;}

.ee-hero{background:var(--dark);border-bottom:var(--border);padding:52px 22px;}
.ee-hero .ee-in{max-width:62rem;margin:0 auto;display:grid;grid-template-columns:1.15fr .85fr;gap:32px;align-items:center;}
.ee-back{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lav);text-decoration:none;}
.ee-hero .ee-tag{color:#fff;margin-top:20px;margin-bottom:10px;}
.ee-hero h1{color:#fff;font-size:clamp(32px,5vw,50px);margin-bottom:16px;}
.ee-hero p{font-size:14px;color:rgba(255,255,255,.65);line-height:1.85;max-width:34rem;}
.ee-pill{display:inline-flex;align-items:center;gap:8px;margin-top:22px;background:rgba(200,180,248,.14);border:1.5px solid var(--lav);color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:8px 14px;border-radius:30px;}
.ee-lion{width:100%;max-width:400px;justify-self:center;display:block;filter:drop-shadow(0 14px 34px rgba(0,0,0,.45));}
@media(max-width:700px){.ee-hero .ee-in{grid-template-columns:1fr;} .ee-lion{max-width:260px;margin:0 auto 6px;}}

.ee-sec{padding:52px 22px;border-bottom:var(--border);}
.ee-head{margin-bottom:30px;}
.ee-head h2{font-family:${poppins};font-weight:800;font-size:clamp(24px,4vw,34px);letter-spacing:-.6px;text-transform:lowercase;margin-top:8px;}
.ee-head p.ee-lead{font-size:13.5px;color:var(--grey-light);line-height:1.7;margin-top:10px;max-width:40rem;}

.ee-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;}
@media(max-width:760px){.ee-grid{grid-template-columns:1fr;}}

.ee-card{border:var(--border);box-shadow:7px 7px 0 var(--dark);background:#fff;display:block;transition:transform .12s ease, box-shadow .12s ease;}
.ee-card:hover{transform:translate(-2px,-2px);box-shadow:9px 9px 0 var(--dark);}
.ee-card.lav{background:var(--lav-light);}
.ee-card.pink{background:var(--pink-bg);}
.ee-card.gold{background:var(--gold);}
.ee-card.dark{background:var(--dark);color:#fff;}
.ee-card>summary{list-style:none;cursor:pointer;outline:none;}
.ee-card>summary::-webkit-details-marker{display:none;}
.ee-ch{display:flex;align-items:center;gap:13px;padding:18px 20px;border-bottom:var(--border);}
.ee-card.dark .ee-ch{border-bottom-color:rgba(255,255,255,.22);}
.ee-glyph{width:44px;height:44px;flex:none;border:1.5px solid var(--dark);border-radius:50%;display:grid;place-items:center;font-size:21px;line-height:1;background:#fff;color:var(--dark);}
.ee-card.dark .ee-glyph{background:var(--lav);border-color:var(--lav);color:var(--dark);}
.ee-k{font-size:10px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--pink);}
.ee-card.dark .ee-k{color:var(--lav);}
.ee-place{font-family:${poppins};font-weight:800;font-size:15.5px;letter-spacing:-.3px;text-transform:lowercase;line-height:1.15;margin-top:4px;}
.ee-pad{padding:18px 20px 20px;}
.ee-sum{font-size:14.5px;line-height:1.7;font-weight:500;}
.ee-toggle{margin-top:16px;display:inline-flex;align-items:center;gap:9px;font-family:${poppins};font-weight:700;font-size:11px;letter-spacing:.05em;text-transform:uppercase;background:var(--pink);color:#fff;border:1.5px solid var(--dark);box-shadow:3px 3px 0 var(--dark);padding:10px 15px;}
.ee-card>summary:hover .ee-toggle{transform:translate(-1px,-1px);box-shadow:4px 4px 0 var(--dark);}
.ee-card.dark .ee-toggle{background:var(--lav);color:var(--dark);border-color:#fff;box-shadow:3px 3px 0 rgba(255,255,255,.3);}
.ee-ic{width:16px;height:16px;border:1.5px solid currentColor;border-radius:50%;display:grid;place-items:center;font-size:12px;line-height:1;}
.ee-ic::after{content:"+";}
.ee-card[open] .ee-ic::after{content:"\\2212";}
.ee-close{display:none;}
.ee-card[open] .ee-open{display:none;}
.ee-card[open] .ee-close{display:inline;}
.ee-exp{padding:0 20px 22px;}
.ee-deep{font-size:13.5px;line-height:1.8;padding-top:18px;border-top:1.5px dashed rgba(26,26,26,.22);}
.ee-card.dark .ee-deep{border-top-color:rgba(255,255,255,.25);}
.ee-facet{margin-top:16px;padding-left:15px;border-left:3px solid var(--pink);}
.ee-facet.shadow{border-left-color:var(--dark);}
.ee-card.dark .ee-facet.gift{border-left-color:var(--lav);}
.ee-card.dark .ee-facet.shadow{border-left-color:#fff;}
.ee-flbl{display:inline-block;font-family:${poppins};font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--pink);margin-bottom:6px;}
.ee-facet.shadow .ee-flbl{color:var(--dark);}
.ee-card.dark .ee-facet.gift .ee-flbl{color:var(--lav);}
.ee-card.dark .ee-facet.shadow .ee-flbl{color:#fff;}
.ee-facet p{font-size:13px;line-height:1.72;}

.ee-overlay{background:var(--gold);border:var(--border);box-shadow:12px 12px 0 var(--dark);padding:34px;}
.ee-glyph-lg{width:52px;height:52px;border:1.5px solid var(--dark);border-radius:50%;display:grid;place-items:center;font-size:24px;background:#fff;margin-bottom:16px;}
.ee-overlay .ee-place{font-size:20px;margin:6px 0 12px;}
.ee-overlay p{font-size:14px;line-height:1.85;}
.ee-hit{margin-top:18px;font-size:12px;font-weight:800;background:var(--dark);color:#fff;padding:11px 15px;display:inline-block;text-transform:uppercase;}

.ee-mantras{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
@media(max-width:760px){.ee-mantras{grid-template-columns:1fr;}}
.ee-mantra{border:var(--border);box-shadow:6px 6px 0 var(--dark);padding:26px;background:var(--lav-light);}
.ee-mantra:nth-child(2){background:#fff;}
.ee-mantra:nth-child(3){background:var(--pink-bg);}
.ee-mantra .ee-mlbl{font-family:${poppins};font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--pink);}
.ee-mantra p{font-family:${poppins};font-weight:800;font-size:16px;line-height:1.4;letter-spacing:-.3px;text-transform:lowercase;margin-top:12px;}

.ee-ex{border:var(--border);box-shadow:12px 12px 0 var(--dark);padding:34px;margin-bottom:30px;}
.ee-ex.open{background:var(--pink-bg);}
.ee-ex.dark{background:var(--dark);color:#fff;}
.ee-ex .ee-kick{font-family:${poppins};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--pink);}
.ee-ex.dark .ee-kick{color:var(--lav);}
.ee-ex h3{font-family:${poppins};font-weight:800;font-size:24px;letter-spacing:-.5px;text-transform:lowercase;margin:8px 0 6px;}
.ee-why{font-size:13px;line-height:1.8;color:var(--grey-light);margin-bottom:22px;}
.ee-ex.dark .ee-why{color:rgba(255,255,255,.62);}
.ee-steps{list-style:none;counter-reset:s;}
.ee-steps li{counter-increment:s;position:relative;padding:0 0 16px 42px;font-size:14px;line-height:1.7;}
.ee-steps li:last-child{padding-bottom:0;}
.ee-steps li::before{content:counter(s);position:absolute;left:0;top:-2px;width:28px;height:28px;border-radius:50%;border:1.5px solid currentColor;display:grid;place-items:center;font-family:${poppins};font-weight:800;font-size:12px;}
.ee-ex.open .ee-steps li::before{background:var(--pink);color:#fff;border-color:var(--dark);}
.ee-ex.dark .ee-steps li::before{background:var(--lav);color:var(--dark);border-color:var(--lav);}

.ee-action{background:var(--lav-light);border-bottom:var(--border);padding:44px 22px;}
.ee-action h2{font-family:${poppins};font-weight:800;font-size:24px;letter-spacing:-.5px;text-transform:lowercase;margin-top:8px;color:#3C2A70;}
.ee-action p{font-size:14px;line-height:1.8;color:#3C2A70;margin-top:12px;max-width:42rem;}
.ee-cta{padding:44px 22px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;}
.ee-cta h2{font-family:${poppins};font-weight:800;font-size:22px;letter-spacing:-.5px;text-transform:lowercase;}
.ee-btn{display:inline-flex;align-items:center;gap:8px;background:var(--pink);color:#fff;font-family:${poppins};font-weight:700;font-size:12px;letter-spacing:.04em;text-transform:uppercase;padding:13px 22px;border:1.5px solid var(--dark);box-shadow:4px 4px 0 var(--dark);text-decoration:none;}
.ee-btn:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 var(--dark);}
@media(max-width:640px){.ee-ch{padding:16px;} .ee-pad{padding:16px;} .ee-exp{padding:0 16px 18px;}}
`;

export default function EightEightMoney() {
  const { member, ready } = useMember();
  const { chart, loading } = useChart();

  if (!ready) return null;

  // The drop has closed: send members back to their season rather than a stale portal.
  if (!isEightEightLive()) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 460 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            the 8/8 portal has closed for this year, babe.
          </h1>
          <p style={{ color: "var(--grey-light)", marginBottom: 18, lineHeight: 1.7 }}>
            the lion&apos;s gate money guide is a timed drop. your full money reading is always here though.
          </p>
          <Link href="/my-chart/money" className="btn-pink">my money chart</Link>
        </div>
      </section>
    );
  }

  if (!member) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 style={{ fontFamily: poppins, fontSize: 28, fontWeight: 800, marginBottom: 16 }}>members only, babe.</h1>
          <Link href="/login" className="btn-pink">log in</Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid var(--pink)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const r = chart ? buildEightEightMoney(chart) : null;

  if (!r) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: poppins, fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            add your birth details to unlock your 8/8 reading.
          </h1>
          <Link href="/onboarding" className="btn-pink">add your chart</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{CSS}</style>

      <section className="ee-hero">
        <div className="ee-in">
          <div>
            <Link href="/your-season" className="ee-back">← your season</Link>
            <div className="ee-tag">8/8 · the lion&apos;s gate money portal</div>
            <h1 className="ee-disp">the gate is open, <span className="pk">and it knows your name.</span></h1>
            <p>{r.intro}</p>
            <div className="ee-pill">{r.portalPill}</div>
          </div>
          <img className="ee-lion" src="/lion-gate-888.png" alt="crowned roaring lion raining dollar signs" />
        </div>
      </section>

      <section className="ee-sec">
        <div className="ee-wrap">
          <div className="ee-head">
            <div className="ee-tag">your money chart</div>
            <h2>where the money actually lives</h2>
            <p className="ee-lead">each placement opens into the full read, the gift to lean on, and the shadow to watch. tap any card to fold it away.</p>
          </div>
          <div className="ee-grid">
            {r.cards.map((c, i) => (
              <details open className={`ee-card ${c.variant}`} key={i}>
                <summary>
                  <div className="ee-ch">
                    <span className="ee-glyph">{c.glyph}</span>
                    <div><div className="ee-k">{c.kicker}</div><div className="ee-place">{c.place}</div></div>
                  </div>
                  <div className="ee-pad">
                    <p className="ee-sum">{c.summary}</p>
                    <span className="ee-toggle"><span className="ee-ic" /><span className="ee-open">read the full placement</span><span className="ee-close">hide the detail</span></span>
                  </div>
                </summary>
                <div className="ee-exp">
                  <p className="ee-deep">{c.deep}</p>
                  <div className="ee-facet gift"><span className="ee-flbl">the gift</span><p>{c.gift}</p></div>
                  <div className="ee-facet shadow"><span className="ee-flbl">the shadow</span><p>{c.shadow}</p></div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-sec" style={{ background: "var(--cream)" }}>
        <div className="ee-wrap">
          <div className="ee-head">
            <div className="ee-tag">the 8/8 overlay</div>
            <h2>what the portal is doing to your chart</h2>
          </div>
          <div className="ee-overlay">
            <div className="ee-glyph-lg">☀</div>
            <div className="ee-tag">{r.overlay.kicker}</div>
            <div className="ee-place">{r.overlay.place}</div>
            <p>{r.overlay.body}</p>
            <div className="ee-hit">{r.overlay.hit}</div>
          </div>
        </div>
      </section>

      <section className="ee-sec">
        <div className="ee-wrap">
          <div className="ee-head">
            <div className="ee-tag">say it until you believe it</div>
            <h2>your money mantras</h2>
            <p className="ee-lead">three lines pulled from your chart: where you are growing, the block flipped into permission, and your worth. read them out loud on 8/8.</p>
          </div>
          <div className="ee-mantras">
            {r.affirmations.map((a, i) => (
              <div className="ee-mantra" key={i}>
                <div className="ee-mlbl">{a.label}</div>
                <p>&ldquo;{a.line}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-sec">
        <div className="ee-wrap">
          <div className="ee-head">
            <div className="ee-tag">the work</div>
            <h2>two exercises, drawn from your chart</h2>
          </div>

          <div className="ee-ex open">
            <div className="ee-kick">{r.manifestation.kicker}</div>
            <h3>{r.manifestation.title}</h3>
            <p className="ee-why">{r.manifestation.why}</p>
            <ol className="ee-steps">{r.manifestation.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          </div>

          <div className="ee-ex dark">
            <div className="ee-kick">{r.shadowWork.kicker}</div>
            <h3>{r.shadowWork.title}</h3>
            <p className="ee-why">{r.shadowWork.why}</p>
            <ol className="ee-steps">{r.shadowWork.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          </div>
        </div>
      </section>

      <section className="ee-action">
        <div className="ee-wrap">
          <div className="ee-tag" style={{ color: "#3C2A70" }}>your one 8/8 move</div>
          <h2>{r.action.title}</h2>
          <p>{r.action.body}</p>
        </div>
      </section>

      <section className="ee-cta ee-wrap">
        <div>
          <div className="ee-tag">make it real</div>
          <h2>journal on what landed hardest.</h2>
        </div>
        <Link className="ee-btn" href="/journal">open my journal →</Link>
      </section>
    </>
  );
}
