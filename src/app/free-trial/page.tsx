"use client";

import { useState } from "react";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import type { BirthData, BirthLocation } from "@/types/chart";
import { saveBirthData, savePlacements, placementsFromChart } from "@/lib/url-params";
import { syncBirthDataToSupabase, syncChartToSupabase } from "@/lib/chart-sync";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Scoped under `.ft` so nothing here leaks onto the rest of the site. Palette + type come from the
// app's own tokens (globals.css): pink / lavender / black / white, Poppins display + DM Sans body.
const css = `
.ft{font-family:var(--font-dm-sans),'DM Sans',sans-serif;color:var(--dark);background:#fff;}
.ft .wrap{max-width:1060px;margin:0 auto;padding:0 22px;}
.ft .sec{padding:74px 0;}
@media(max-width:640px){.ft .sec{padding:50px 0;}}
.ft .disp{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;letter-spacing:-0.035em;line-height:0.98;margin:0;text-wrap:balance;}
.ft .ey{font-family:var(--font-poppins),Poppins,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--pink);}
.ft .rl{display:flex;align-items:center;gap:16px;font-family:var(--font-poppins),Poppins,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--dark);}
.ft .rl::before,.ft .rl::after{content:"";flex:1;height:1.5px;background:currentColor;opacity:.3;}
.ft .pk{color:var(--pink);}
.ft .cta{display:inline-block;font-family:var(--font-poppins),Poppins,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:18px 36px;border:1.5px solid var(--dark);background:var(--pink);color:#fff;box-shadow:6px 6px 0 var(--dark);cursor:pointer;text-decoration:none;text-align:center;transition:transform .12s ease,box-shadow .12s ease;}
.ft .cta:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--dark);}
.ft .cta.busy{opacity:.6;pointer-events:none;}
.ft .cta-block{display:block;width:100%;}
.ft .micro{font-size:12.5px;color:var(--grey-light);}
.ft .frame{border:1.5px solid var(--dark);box-shadow:14px 14px 0 var(--dark);background:#fff;}

.ft .hero{background:var(--dark);border-bottom:1.5px solid var(--dark);color:#fff;overflow:hidden;}
.ft .hero-grid{display:grid;grid-template-columns:1fr;gap:40px;align-items:center;padding:60px 0 66px;}
@media(min-width:860px){.ft .hero-grid{grid-template-columns:1.35fr .65fr;}}
.ft .hero h1{font-size:clamp(44px,8.4vw,84px);color:#fff;line-height:1.02;}
.ft .hero .lead{max-width:520px;font-size:clamp(16px,2.1vw,19px);color:rgba(255,255,255,.85);margin-top:24px;}
.ft .hero .ey{margin-bottom:20px;display:inline-block;}
.ft .hero-cta{margin-top:32px;display:flex;flex-direction:column;gap:12px;align-items:flex-start;}
.ft .hero-stamp{display:flex;flex-direction:column;align-items:center;gap:14px;}
.ft .stamp{width:180px;height:180px;border-radius:50%;background:var(--pink);color:#fff;border:2.5px solid #fff;box-shadow:9px 9px 0 rgba(0,0,0,.45);transform:rotate(-8deg);display:grid;place-content:center;justify-items:center;text-align:center;}
.ft .stamp .l{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:700;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;}
.ft .stamp .big{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:76px;line-height:.85;letter-spacing:-0.04em;}
.ft .stamp-note{font-family:var(--font-poppins),Poppins,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,.6);}

.ft .strip{background:var(--pink);border-bottom:1.5px solid var(--dark);text-align:center;padding:22px;}
.ft .strip p{font-family:var(--font-poppins),Poppins,sans-serif;font-size:clamp(14px,2.4vw,19px);font-weight:800;text-transform:lowercase;letter-spacing:-0.01em;color:#fff;}

.ft .plain{background:var(--lav-light);border-bottom:1.5px solid var(--dark);text-align:center;}
.ft .plain h2{font-size:clamp(28px,5vw,56px);color:#3C2A70;line-height:1.06;text-transform:lowercase;}
.ft .plain p{font-size:17px;line-height:1.8;color:#3C2A70;max-width:680px;margin:22px auto 0;font-weight:500;}
.ft .plain .ey{color:#3C2A70;display:block;margin-bottom:18px;}

.ft .getlist{background:var(--dark);color:#fff;border-bottom:1.5px solid var(--dark);}
.ft .getlist .rl{color:rgba(255,255,255,.5);justify-content:center;}
.ft .get-head{text-align:center;}
.ft .get-head h2{font-size:clamp(30px,5vw,56px);margin-top:16px;color:#fff;}
.ft .checks{display:grid;grid-template-columns:1fr;margin-top:34px;border:1.5px solid rgba(255,255,255,.25);}
@media(min-width:720px){.ft .checks{grid-template-columns:1fr 1fr;}}
.ft .check{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;border-bottom:1.5px solid rgba(255,255,255,.16);}
@media(min-width:720px){.ft .check:nth-child(odd){border-right:1.5px solid rgba(255,255,255,.16);}.ft .check:nth-last-child(-n+2){border-bottom:none;}}
@media(max-width:719px){.ft .check:last-child{border-bottom:none;}}
.ft .check .mk{flex-shrink:0;width:24px;height:24px;border:1.5px solid var(--pink);color:var(--pink);display:grid;place-items:center;font-weight:800;font-size:13px;}
.ft .check b{font-family:var(--font-poppins),Poppins,sans-serif;text-transform:lowercase;font-weight:700;font-size:15px;display:block;}
.ft .check span{font-size:12.5px;color:rgba(255,255,255,.6);}

.ft .spotlight{margin-top:30px;border:1.5px solid var(--dark);box-shadow:14px 14px 0 var(--dark);background:var(--dark);color:#fff;display:grid;grid-template-columns:1fr;overflow:hidden;}
@media(min-width:820px){.ft .spotlight{grid-template-columns:.82fr 1fr;}}
.ft .spot-cover{width:100%;height:auto;object-fit:contain;background:var(--dark);border-bottom:1.5px solid var(--dark);display:block;}
@media(min-width:820px){.ft .spot-cover{height:100%;border-bottom:none;border-right:1.5px solid var(--dark);}}
.ft .spot-text{padding:clamp(26px,4vw,42px);}
.ft .spot-text .wt{font-family:var(--font-poppins),Poppins,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--lav);}
.ft .when2{font-family:var(--font-poppins),Poppins,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--pink);margin-top:6px;}
.ft .spot-title{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:clamp(28px,5vw,46px);line-height:1.04;letter-spacing:-0.03em;color:#fff;margin:16px 0;}
.ft .spot-text p{font-size:15px;line-height:1.85;color:rgba(255,255,255,.78);max-width:640px;}
.ft .incl{display:inline-block;margin-top:24px;font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:13px;letter-spacing:0.02em;text-transform:lowercase;color:var(--dark);background:var(--pink);padding:12px 20px;}

.ft .ev-grid{display:grid;grid-template-columns:1fr;gap:20px;margin-top:20px;}
@media(min-width:640px){.ft .ev-grid{grid-template-columns:1fr 1fr;}}
@media(min-width:980px){.ft .ev-grid.ev-4{grid-template-columns:repeat(4,1fr);}}
.ft .ev{border:1.5px solid var(--dark);box-shadow:8px 8px 0 var(--dark);background:#fff;overflow:hidden;display:flex;flex-direction:column;}
.ft .ev-cover{width:100%;height:auto;display:block;border-bottom:1.5px solid var(--dark);background:var(--lav-light);}
.ft .ev-body{padding:16px 16px 20px;flex:1;display:flex;flex-direction:column;gap:5px;}
.ft .ev .m{font-family:var(--font-poppins),Poppins,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--pink);}
.ft .ev h4{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:16px;line-height:1.15;letter-spacing:-0.02em;}
.ft .ev p{font-size:12.5px;line-height:1.6;color:var(--grey-light);}
.ft .ev-intro{max-width:640px;margin-top:16px;font-size:16px;line-height:1.85;color:var(--dark);}

.ft .two-col{display:grid;grid-template-columns:1fr;margin-top:34px;border:1.5px solid var(--dark);}
@media(min-width:820px){.ft .two-col{grid-template-columns:1fr 1fr;}}
.ft .two-col>div{padding:34px;}
.ft .two-col .a{border-bottom:1.5px solid var(--dark);}
@media(min-width:820px){.ft .two-col .a{border-bottom:none;border-right:1.5px solid var(--dark);}}
.ft .two-col .b{background:var(--pink-light);}
.ft .kicker{font-family:var(--font-poppins),Poppins,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--dark);margin-bottom:14px;}
.ft .two-col .b .kicker{color:var(--pink);}
.ft .two-col p{font-size:15.5px;line-height:1.85;color:var(--dark);}
.ft .lead-emph{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:19px;line-height:1.4;color:var(--dark);}

.ft .founder{background:var(--cream);border-bottom:1.5px solid var(--dark);}
.ft .founder-grid{display:grid;grid-template-columns:1fr;gap:30px;align-items:center;}
@media(min-width:760px){.ft .founder-grid{grid-template-columns:.7fr 1fr;}}
.ft .founder img{width:100%;border:1.5px solid var(--dark);box-shadow:12px 12px 0 var(--pink);display:block;}
.ft .founder .name{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--pink);}
.ft .founder h2{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:clamp(26px,4.4vw,42px);letter-spacing:-0.02em;line-height:1.08;text-transform:lowercase;margin:8px 0 16px;}
.ft .founder p{font-size:15px;line-height:1.85;color:var(--dark);margin-bottom:14px;}

.ft .seasonal{background:var(--dark);color:#fff;border-bottom:1.5px solid var(--dark);}
.ft .seasonal .rl{color:rgba(255,255,255,.45);justify-content:center;}
.ft .seasonal h2{color:#fff;font-size:clamp(28px,5vw,48px);text-transform:lowercase;margin-top:18px;text-align:center;}
.ft .seasonal .sub{text-align:center;max-width:520px;margin:18px auto 0;color:rgba(255,255,255,.8);font-size:15px;}
.ft .szn-grid{display:grid;grid-template-columns:1fr;gap:1.5px;margin-top:34px;background:rgba(255,255,255,.18);border:1.5px solid rgba(255,255,255,.18);}
@media(min-width:620px){.ft .szn-grid{grid-template-columns:1fr 1fr;}}
@media(min-width:920px){.ft .szn-grid{grid-template-columns:repeat(3,1fr);}}
.ft .szn{background:var(--dark);padding:20px;}
.ft .szn .s{font-family:var(--font-poppins),Poppins,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--lav);margin-bottom:5px;}
.ft .szn .lesson{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:20px;letter-spacing:-0.02em;text-transform:lowercase;margin-bottom:7px;}
.ft .szn .d{font-size:12.5px;line-height:1.6;color:rgba(255,255,255,.66);}

.ft .timeline{display:grid;grid-template-columns:1fr;gap:16px;margin-top:34px;}
@media(min-width:760px){.ft .timeline{grid-template-columns:repeat(4,1fr);}}
.ft .tl{border:1.5px solid var(--dark);padding:22px;background:#fff;box-shadow:6px 6px 0 var(--dark);}
.ft .tl .d{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--pink);margin-bottom:10px;}
.ft .tl b{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:17px;text-transform:lowercase;letter-spacing:-0.01em;display:block;margin-bottom:6px;}
.ft .tl p{font-size:13px;color:var(--grey-light);line-height:1.6;}

.ft .urgent{background:var(--gold);border-bottom:1.5px solid var(--dark);text-align:center;padding:22px;}
.ft .urgent .u{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--pink);margin-bottom:7px;}
.ft .urgent p{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:clamp(16px,2.6vw,24px);text-transform:lowercase;letter-spacing:-0.01em;color:var(--dark);}

.ft .faq{margin-top:34px;border-top:1.5px solid var(--dark);}
.ft .faq details{border-bottom:1.5px solid var(--dark);}
.ft .faq summary{list-style:none;cursor:pointer;padding:20px 4px;font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;font-size:16px;letter-spacing:-0.01em;display:flex;justify-content:space-between;gap:16px;align-items:center;}
.ft .faq summary::-webkit-details-marker{display:none;}
.ft .faq summary::after{content:"+";color:var(--pink);font-size:24px;font-weight:700;line-height:1;flex-shrink:0;}
.ft .faq details[open] summary::after{content:"\\2013";}
.ft .faq .a{padding:0 4px 22px;font-size:14px;line-height:1.75;color:var(--grey-light);max-width:740px;}

.ft .signup{background:var(--pink-bg);border-bottom:1.5px solid var(--dark);}
.ft .form-card{max-width:560px;margin:34px auto 0;}
.ft .form-inner{padding:30px;}
.ft .field{margin-bottom:18px;}
.ft .field label{display:block;font-family:var(--font-poppins),Poppins,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--grey-light);margin-bottom:8px;}
.ft .field input{width:100%;border:1.5px solid var(--dark);padding:14px 15px;font-size:15px;font-family:var(--font-dm-sans),'DM Sans',sans-serif;outline:none;background:#fff;}
.ft .field input:focus{box-shadow:0 0 0 3px var(--pink-light);}
.ft .row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:520px){.ft .row2{grid-template-columns:1fr;}}
.ft .form-foot{text-align:center;margin-top:18px;}
.ft .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;}
.ft .err{color:#A32D2D;font-size:13px;margin-top:12px;text-align:center;font-weight:600;}

.ft .foot{padding:40px 0 60px;text-align:center;}
.ft .foot .mk{font-family:var(--font-poppins),Poppins,sans-serif;font-weight:800;text-transform:lowercase;letter-spacing:-0.02em;font-size:20px;}
.ft .foot .ey{color:var(--grey-light);display:block;margin-top:10px;}

.ft .sticky-cta{display:none;}
.ft .sticky-cta a{display:block;text-align:center;background:var(--pink);color:#fff;font-family:var(--font-poppins),Poppins,sans-serif;font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;padding:15px;text-decoration:none;}
.ft .sticky-cta .sn{text-align:center;color:rgba(255,255,255,.6);font-size:10px;margin-top:7px;}
@media(max-width:760px){.ft .sticky-cta{display:block;position:fixed;left:0;right:0;bottom:0;z-index:70;background:var(--dark);border-top:2px solid var(--pink);padding:12px 16px;}.ft{padding-bottom:82px;}}
`;

const SZNS: Array<[string, string, string]> = [
  ["Aries szn", "courage", "Stop asking for permission and take what is yours. Bold moves only."],
  ["Taurus szn", "receiving", "Stop hustling for scraps and let abundance in. Money, pleasure, self-worth."],
  ["Gemini szn", "expression", "Find your voice and weaponise it. Become the woman everyone wants at the table."],
  ["Cancer szn", "nurturing", "Heal the inner child and come home to yourself. Fierce boundaries."],
  ["Leo szn", "visibility", "Stop hiding and shine so bright people need sunglasses. Main character energy."],
  ["Virgo szn", "standards", "Raise the bar so high settling becomes impossible. Systems, rituals, habits."],
  ["Libra szn", "balance", "Stop people-pleasing and start self-choosing. Choose yourself every time."],
  ["Scorpio szn", "transformation", "Face every shadow and rise unrecognisable. Shadow work. Go deep or go home."],
  ["Sag szn", "expansion", "Dream so big it scares you, then go bigger. Adventure, freedom, no ceiling."],
  ["Cap szn", "ambition", "Become the CEO of your own life. Build the plan. Set the scary goals."],
  ["Aquarius szn", "revolution", "Break every rule that was never yours. Build your own lane."],
  ["Pisces szn", "surrender", "Stop forcing and start flowing. Trust your intuition over your overthinking."],
];

const CHECKS: Array<[string, string]> = [
  ["your personalised astrology platform", "the whole portal, powered by your chart"],
  ["your chart + personalised content", "every placement, read for you"],
  ["this season's content", "the current szn, as it unfolds"],
  ["live workshops + masterclasses", "the monthly live sessions"],
  ["every workshop replay", "the full back catalogue"],
  ["astro tapping sessions + replays", "guided, any time"],
  ["the vault + resources", "workbooks, guides, everything"],
  ["the community + member rooms", "where your people already are"],
];

export default function FreeTrialPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState<BirthLocation | null>(null);
  const [company, setCompany] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    if (!firstName.trim()) return setError("Add your first name.");
    if (!EMAIL_RE.test(email)) return setError("Add a valid email address.");
    if (password.length < 10) return setError("Use at least 10 characters for your password.");
    if (!dob) return setError("Add your date of birth.");
    if (!time) return setError("Add your exact birth time.");
    if (!location) return setError("Pick your birth place from the suggestions.");

    const birthData: BirthData = {
      name: firstName.trim(),
      dateOfBirth: dob,
      birthTime: time,
      birthTimeApproximate: false,
      location,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/account/create-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim(),
          password,
          company,
          birth_data: birthData,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.error === "already_exists") {
          setError("You already have a MY SZN account. Log in instead.");
        } else if (data.error === "rate_limited") {
          setError("Too many attempts just now. Try again in a little while.");
        } else if (data.error === "weak_password") {
          setError("Use at least 10 characters for your password.");
        } else if (data.error === "birth_required") {
          setError("Add your birth date, time and place so we can build your chart.");
        } else {
          setError("Something went wrong creating your trial. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Account created and signed in. Calculate and cache her chart exactly like onboarding does,
      // so she lands with her real chart rather than the demo. Non-fatal: if the calc fails she
      // still gets inside, the chart just fills in later.
      try {
        const calc = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(birthData),
        });
        if (calc.ok) {
          const chartData = await calc.json();
          const placements = placementsFromChart(chartData);
          saveBirthData(birthData);
          savePlacements(placements);
          await syncBirthDataToSupabase(birthData);
          await syncChartToSupabase(chartData, placements);
        }
      } catch (err) {
        console.error("trial chart calc failed (non-fatal)", err);
      }

      window.location.href = data.signedIn === false ? "/login" : "/dashboard";
    } catch {
      setError("Something went wrong creating your trial. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="ft">
      <style>{css}</style>

      {/* HERO */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="ey">free 7-day trial</span>
            <h1 className="disp">
              ready to create<br />your <span className="pk">dream life?</span>
            </h1>
            <p className="lead">
              {"MY SZN is the astrology-led membership that helps you become your future self, the woman your chart always knew you could be. For the next 7 days, the whole thing is yours, completely free."}
            </p>
            <div className="hero-cta">
              <a href="#ft-signup" className="cta">start my free 7 days</a>
              <p className="micro" style={{ color: "rgba(255,255,255,.6)" }}>
                {"no card required. your full access ends automatically after 7 days."}
              </p>
              <p className="micro" style={{ color: "rgba(255,255,255,.6)" }}>
                {"and after your week, the chat rooms and your charts stay yours, free."}
              </p>
            </div>
          </div>
          <div className="hero-stamp">
            <div className="stamp">
              <span className="l">free for</span>
              <span className="big">7</span>
              <span className="l">days</span>
            </div>
            <p className="stamp-note">no card · no charge</p>
          </div>
        </div>
      </header>

      {/* STRIP */}
      <section className="strip">
        <div className="wrap">
          <p>{"7 days. the full membership. no card, no auto-charge, nothing to cancel."}</p>
        </div>
      </section>

      {/* IN PLAIN ENGLISH */}
      <section className="sec plain">
        <div className="wrap">
          <span className="ey">in plain english</span>
          <h2 className="disp">
            MY SZN is basically the <span className="pk">astro girls support group</span> for the baddies.
          </h2>
          <p>
            {"Your personalised astrology and Human Design, live coaching, workshops, meditations, manifestation, shadow work, and a community of women who actually wanna talk about this stuff with you. For a week, it is all yours."}
          </p>
        </div>
      </section>

      {/* WHAT YOU GET FREE */}
      <section className="sec getlist">
        <div className="wrap">
          <div className="get-head">
            <div className="rl">what your free week unlocks</div>
            <h2 className="disp">
              everything a full member gets.<br />for 7 days. free.
            </h2>
          </div>
          <div className="checks">
            {CHECKS.map(([title, sub]) => (
              <div className="check" key={title}>
                <span className="mk">✓</span>
                <span>
                  <b>{title}</b>
                  <span>{sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSHOP SPOTLIGHT (the visibility one) */}
      <section className="sec" style={{ background: "var(--cream)", borderBottom: "1.5px solid var(--dark)" }}>
        <div className="wrap">
          <div className="rl">the workshop waiting inside this week</div>
          <div className="spotlight">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="spot-cover" src="/visible-af-cover.jpg" alt="Visible AF workshop cover" />
            <div className="spot-text">
              <div className="wt">this month&apos;s live workshop</div>
              <div className="when2">live 19 august · 7pm la time · replay saved inside</div>
              <h3 className="spot-title">
                Visible AF:<br />How to Show Up &amp; Get Paid.
              </h3>
              <p>
                {"You weren't born to be the internet's best kept secret. This is a live astro tapping workshop that works underneath the mindset advice, down at the wiring, on the shrinking, the over-editing and the waiting until you feel ready. We tap through the fear of being seen, judged, too much or wrong, until showing up, talking about your offers and charging what you're worth feels natural instead of terrifying."}
              </p>
              <div className="incl">✦ yours free during your 7-day trial</div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS ROW */}
      <section className="sec">
        <div className="wrap">
          <div className="rl">workshops + member experiences</div>
          <p className="ev-intro">
            {"Every month I lead a live masterclass and a live astro tapping based on the current season, blending astrology, coaching, Human Design and subconscious rewiring. Here's what's on the calendar right now, and your free week drops you right in the middle of them."}
          </p>
          <div className="ev-grid ev-4" style={{ marginTop: 34 }}>
            <EventCard cover="/leo-workshop-cover.jpg" meta="3 aug · masterclass" title="Leo Season: Enter Your Main Character Era" desc="The astrology of confidence, visibility and self-expression." />
            <EventCard cover="/visible-af-cover.jpg" meta="19 aug · astro tapping" title="Visible AF: How to Show Up & Get Paid" desc="Tap through the fear of being seen and charge what you're worth." />
            <EventCard cover="/virgo-goalsetting-cover.jpg" meta="26 aug · working session" title="Virgo Goal-Setting: Map the Rest of Your Year" desc="Turn the vague wishes in your head into a plan you'll follow." />
            <EventCard cover="/virgo-workshop-cover.jpg" meta="10 sep · masterclass" title="Virgo Season: Get Your Sh*t Together & Become Her" desc="Close the gap between meaning to, and getting it done." />
          </div>
        </div>
      </section>

      {/* WHY MY SZN */}
      <section className="sec">
        <div className="wrap">
          <div className="rl">why my szn</div>
          <h2 className="disp" style={{ fontSize: "clamp(30px,5.4vw,56px)", textTransform: "lowercase", marginTop: 20, textAlign: "center" }}>
            every season can be <span className="pk">your season.</span>
          </h2>
          <div className="two-col">
            <div className="a">
              <div className="kicker">the pattern i couldn&apos;t unsee</div>
              <p>
                {"Every year a new zodiac season rolls around and a whole group of women become completely, unapologetically unstoppable. Booking the flights. Launching the business. Taking up space like they own the building. Then the season turns, and they wait until Monday, until January, until they feel ready, which never comes."}
              </p>
            </div>
            <div className="b">
              <div className="kicker">the my szn approach</div>
              <p className="lead-emph">{"MY SZN is the container that lets you feel that powerful all year, not once."}</p>
              <p style={{ marginTop: 14 }}>
                {"Not another astrology app. A membership that helps you actually live your astrology and become the woman your chart always knew you could be."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEASONAL GRID */}
      <section className="sec seasonal">
        <div className="wrap">
          <div className="rl">the seasonal membership</div>
          <h2 className="disp">a membership that grows with <span className="pk">you.</span></h2>
          <p className="sub">
            {"Every month follows the zodiac, because every season has something to teach you. As the seasons change, your membership changes too."}
          </p>
          <div className="szn-grid">
            {SZNS.map(([szn, lesson, desc]) => (
              <div className="szn" key={szn}>
                <div className="s">{szn}</div>
                <div className="lesson">{lesson}</div>
                <div className="d">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section className="sec founder">
        <div className="wrap founder-grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betty-founder.png" alt="Betty Andrews, founder of MY SZN" />
          <div>
            <div className="name">a note from betty</div>
            <h2>i built the thing i always wished existed.</h2>
            <p>
              {"I watched women become completely unstoppable for one season a year, then shrink back and wait until they felt ready. MY SZN is the container I built so you never have to wait for permission again."}
            </p>
            <p>
              {"Take the week. Come inside, live in your chart, come to a workshop, meet the women in the rooms. If it's for you, you'll know. And if it isn't, you walk away having lost nothing but seven days of curiosity."}
            </p>
            <div className="name" style={{ color: "var(--dark)" }}>Betty Andrews / Founder</div>
          </div>
        </div>
      </section>

      {/* HOW YOUR 7 DAYS WORK */}
      <section className="sec" style={{ background: "var(--lav-light)", borderBottom: "1.5px solid var(--dark)" }}>
        <div className="wrap">
          <div className="rl">how your 7 days work</div>
          <h2 className="disp" style={{ fontSize: "clamp(26px,4.6vw,44px)", textTransform: "lowercase", marginTop: 18 }}>
            no card, no catch, no surprises.
          </h2>
          <div className="timeline">
            <div className="tl"><div className="d">day 1</div><b>you&apos;re in</b><p>{"sign up in under a minute with no card. you're logged straight in as a full member, chart already built."}</p></div>
            <div className="tl"><div className="d">days 1 to 7</div><b>live in it</b><p>{"your platform, the live workshops and replays, the astro tapping, the vault and the member rooms. all of it."}</p></div>
            <div className="tl"><div className="d">day 6</div><b>a gentle heads up</b><p>{"we'll remind you your free week is nearly up, so the end never catches you by surprise."}</p></div>
            <div className="tl"><div className="d">day 7</div><b>it winds down on its own</b><p>{"your personalised platform, workshops and meditations close. you keep the chat rooms and your chart. no charge, nothing to cancel."}</p></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="wrap">
          <div className="rl">before you start</div>
          <div className="faq">
            <details open>
              <summary>Do I need to enter card details?</summary>
              <div className="a">{"No. There's no card, no checkout and no payment screen anywhere in the signup. You give your name, email, a password and your birth details, and you're in."}</div>
            </details>
            <details>
              <summary>Will I be charged when the 7 days end?</summary>
              <div className="a">{"No. Because we never take a card, there's nothing to charge. Your access simply ends on its own after 7 days. If you want to stay, you choose to become a member. Nothing happens automatically."}</div>
            </details>
            <details>
              <summary>What happens on day 7?</summary>
              <div className="a">{"Your personalised platform, the workshops and the meditations close, but you keep the chat rooms and your chart. Everything you started stays saved, so if you become a member you pick up exactly where you left off."}</div>
            </details>
            <details>
              <summary>Do I really get everything a paying member gets?</summary>
              <div className="a">{"Yes. For the whole week you're a full member: your personalised platform, the live workshops and replays, the astro tapping, the vault and the community. Not a stripped-back preview."}</div>
            </details>
          </div>
        </div>
      </section>

      {/* URGENCY */}
      <section className="urgent">
        <div className="wrap">
          <div className="u">next live workshop · 19 august · 7pm la time</div>
          <p>start your free week now so you&apos;re inside for it.</p>
        </div>
      </section>

      {/* SIGNUP */}
      <section className="sec signup" id="ft-signup">
        <div className="wrap">
          <div className="rl">start your free 7 days</div>
          <form className="form-card frame" onSubmit={handleSubmit} noValidate>
            <div className="form-inner">
              <div className="field">
                <label htmlFor="ft-fn">first name</label>
                <input id="ft-fn" type="text" placeholder="your first name" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="ft-em">email address</label>
                <input id="ft-em" type="email" placeholder="you@email.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="ft-pw">create a password</label>
                <input id="ft-pw" type="password" placeholder="at least 10 characters" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="ft-dob">date of birth</label>
                <input id="ft-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              <div className="row2">
                <div className="field">
                  <label htmlFor="ft-bt">exact birth time</label>
                  <input id="ft-bt" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="ft-loc">birth location</label>
                  <PlacesAutocomplete id="ft-loc" onSelect={setLocation} value={location?.placeName} />
                </div>
              </div>

              {/* Honeypot: hidden from humans, bots fill it and get silently rejected server-side. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="ft-company">company</label>
                <input id="ft-company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>

              <button type="submit" className={`cta cta-block ${loading ? "busy" : ""}`} disabled={loading}>
                {loading ? "creating your trial…" : "start my free 7 days"}
              </button>
              {error && <p className="err">{error}</p>}
              <div className="form-foot">
                <p className="micro">{"no card required. you're logged straight in, and your access ends automatically after 7 days."}</p>
              </div>
            </div>
          </form>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="mk">my szn ✦</div>
          <span className="ey">seven days inside. see why you&apos;d stay.</span>
        </div>
      </footer>

      <div className="sticky-cta">
        <a href="#ft-signup">start my free 7 days</a>
        <div className="sn">no card required · access ends automatically after 7 days</div>
      </div>
    </div>
  );
}

function EventCard({ cover, meta, title, desc }: { cover: string; meta: string; title: string; desc: string }) {
  return (
    <div className="ev">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ev-cover" src={cover} alt={title} />
      <div className="ev-body">
        <div className="m">{meta}</div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}
