"use client";

import { useState } from "react";
import Link from "next/link";
import BirthDetailsFields, { type BirthDetails } from "@/components/BirthDetailsFields";
import { FREQUENCY, LAUNCH_CITIES, SIDE_ROLE, TRAVEL } from "@/lib/irl";

const poppins = "var(--font-poppins), Poppins, sans-serif";
const INSTAGRAM = "https://instagram.com/itsmyszn";
const PODCAST = "https://open.spotify.com/show/7Hi3IXajGlE1LuZD5sf08a";

// MY SZN IRL host recruitment. Deliberately built from the site's own visual language rather than a
// new one: the same black borders, pink CTA, lowercase Poppins headings and lilac panels used
// everywhere else, so this reads as part of MY SZN rather than a careers microsite bolted on.

export default function IrlHostPage() {
  return (
    <main>
      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-glitter" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto px-5 py-16 md:py-24 text-center">
          <h1 style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(34px, 6.4vw, 66px)", lineHeight: 1.03, letterSpacing: "-0.03em", color: "#fff", textTransform: "lowercase", margin: "0 0 16px" }}>
            become the face of my szn in your city
          </h1>
          <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(14px, 2.2vw, 19px)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", margin: "0 0 22px" }}>
            London &middot; New York &middot; Los Angeles
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.86)", maxWidth: 640, margin: "0 auto 14px" }}>
            We&rsquo;re looking for brilliant women to host MY SZN IRL, bringing our community together
            through dinners, workshops, wellness experiences, brand events and slightly unhinged
            astrology conversations in real life.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.86)", maxWidth: 640, margin: "0 auto 30px" }}>
            You&rsquo;ll host around 1-2 events a month, get paid for your time, earn commission as your
            local community grows, and we&rsquo;ll give you the concepts, astrology, materials and support
            to make it happen.
          </p>
          <a href="#apply" className="no-underline inline-block" style={{ background: "var(--pink)", color: "#fff", fontFamily: poppins, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase", padding: "17px 34px", border: "2px solid #fff" }}>
            apply to become a host
          </a>
        </div>
      </section>

      {/* ── what is MY SZN IRL ────────────────────────────────────────────── */}
      <Section title="what is my szn irl?">
        <p style={body}>
          MY SZN IRL is the real-life extension of MY SZN, bringing women together in cities around
          the world to actually meet, make friends and experience each astrological season together.
          Think of it as the group chat finally meeting IRL.
        </p>
        <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(18px, 2.6vw, 22px)", lineHeight: 1.35, margin: "22px 0 0" }}>
          Every szn has its own energy, so every szn gets its own kind of night.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ marginTop: 22 }}>
          {SZN_NIGHTS.map((n) => (
            <div key={n.szn} style={{ border: "var(--border)", background: n.bg, color: n.fg, padding: "18px 18px 20px", minHeight: 176, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18 }}>
              <span aria-hidden="true" style={{ fontSize: 38, lineHeight: 1, color: n.accent }}>{n.glyph}</span>
              <div>
                <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: n.accent, margin: "0 0 6px" }}>{n.szn}</p>
                <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(16px, 2.2vw, 20px)", lineHeight: 1.2, textTransform: "lowercase", margin: 0 }}>{n.what}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...body, marginTop: 22 }}>
          Some events are free, some are ticketed and some are sponsored. Guests do not have to be MY
          SZN members to come along, which is part of the point: this is how the community grows.
        </p>
      </Section>

      {/* ── the role ──────────────────────────────────────────────────────── */}
      <Section title="the role" tint>
        <p style={body}>
          You are the local community leader, not the resident astrologer. You bring the warmth, the
          organisation and the room. We bring the astrology.
        </p>
        <p style={{ ...body, marginTop: 16 }}>
          You&rsquo;re there to host the room and build the community. MY SZN chooses and books the
          venues and handles the wider concept, seasonal direction and astrology, while you&rsquo;ll
          help us make each event work brilliantly in your city.
        </p>
        <div style={{ border: "var(--border)", background: "var(--pink-bg)", padding: "20px 22px", margin: "22px 0" }}>
          <p style={{ margin: 0, fontFamily: poppins, fontWeight: 800, fontSize: 17, lineHeight: 1.45 }}>
            You won&rsquo;t be expected to create astrology workshops or event concepts from scratch.
          </p>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
          {[
            "Hosting around one to two local events a month",
            "Welcoming attendees and making sure nobody stands on her own",
            "Facilitating introductions and keeping conversation moving",
            "Delivering simple seasonal astrology content from MY SZN materials",
            "Following the monthly host toolkit and event run sheets we give you",
            "Capturing basic content on the night, and passing on what guests said",
            "Referring guests to MY SZN, and earning commission on every person you bring to the platform",
          ].map((r) => (
            <li key={r} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 16, lineHeight: 1.6 }}>
              <span style={{ color: "var(--pink)", fontWeight: 800 }}>&#10022;</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── what we provide ───────────────────────────────────────────────── */}
      <Section title="what my szn gives you">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2" style={{ border: "var(--border)", background: "var(--pink)", color: "#fff", padding: "22px 22px 24px" }}>
            <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 18, textTransform: "lowercase", margin: "0 0 7px" }}>a free year of my szn</p>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>A full year of MY SZN membership on us, with all our online events included.</p>
          </div>
          {[
            ["a new toolkit every month", "The theme for each event, what to say and what not to say, what to do on the night and how to refer guests to MY SZN, plus astrology talking points and conversation prompts."],
            ["training + run sheets", "You’ll know exactly how the event works, what happens when and what you need before you walk into the room."],
            ["the my szn brand", "Brand guidelines, guest communications and everything you need to make your events feel unmistakably MY SZN."],
            ["actual human support", "You’ll have someone to speak to while planning your event, plus support before and after you host."],
          ].map(([t, d]) => (
            <div key={t} style={{ border: "var(--border)", background: "#fff", padding: "20px 20px 22px" }}>
              <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 15, textTransform: "lowercase", margin: "0 0 7px" }}>{t}</p>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--grey)" }}>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── who we're looking for ─────────────────────────────────────────── */}
      <Section title="who we&rsquo;re looking for" tint>
        <p style={body}>
          Someone warm and socially confident, who is organised and reliable, patient and
          trustworthy, and genuinely good at making people feel included. You are comfortable
          speaking to a group, you know your city properly, and you are actually interested in
          astrology, manifestation and personal growth rather than just willing to talk about them.
        </p>
        <p style={{ ...body, marginTop: 16 }}>
          Professional astrology knowledge is <strong>not</strong> required. Experience in events,
          hospitality, wellness, beauty, coaching, content or community management is useful and
          entirely optional.
        </p>
      </Section>

      {/* ── the paid side role box ────────────────────────────────────────── */}
      <section className="px-5 md:px-8 py-12" style={{ borderBottom: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ border: "var(--border)", background: "var(--lav-light)", padding: "28px 26px" }}>
            <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(19px, 3vw, 26px)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 14px" }}>
              a flexible, paid freelance role
            </p>
            <p style={{ ...body, margin: "0 0 14px" }}>
              You&rsquo;ll be paid an hourly base fee for the events you host, plus commission on every
              person you refer to MY SZN. This is freelance contract work designed to fit around your
              existing work, business, studies or other projects.
            </p>
            <p style={{ ...body, margin: 0 }}>
              As an independent contractor, you&rsquo;ll be responsible for your own taxes and any other
              obligations that apply where you live.
            </p>
          </div>
        </div>
      </section>

      {/* ── the form ──────────────────────────────────────────────────────── */}
      <HostApplicationForm />

      <section className="px-5 md:px-8 py-12" style={{ background: "var(--dark)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
            Not in one of these cities yet? Apply anyway and pick &ldquo;other&rdquo;, and we&rsquo;ll
            know where to go next.{" "}
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ color: "var(--lav)" }}>follow @itsmyszn</a>
            {" "}&middot;{" "}
            <a href={PODCAST} target="_blank" rel="noopener noreferrer" style={{ color: "var(--lav)" }}>the my szn podcast</a>
            {" "}&middot;{" "}
            <Link href="/" style={{ color: "var(--lav)" }}>back to my szn</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

const body: React.CSSProperties = { fontSize: 16.5, lineHeight: 1.8, margin: 0 };

// A card per kind of night, in the brand's pink, black, lilac and white, ordered so no two
// neighbours share a colour in either the two or the three column grid. The text presentation
// selector keeps the zodiac glyphs as type rather than emoji on phones.
const SZN_NIGHTS: { glyph: string; szn: string; what: string; bg: string; fg: string; accent: string }[] = [
  { glyph: "♎︎", szn: "libra szn", what: "beauty evenings", bg: "var(--pink)", fg: "#fff", accent: "#fff" },
  { glyph: "♏︎", szn: "scorpio szn", what: "candle-making and shadow-work nights", bg: "var(--dark)", fg: "#fff", accent: "var(--pink)" },
  { glyph: "♐︎", szn: "sagittarius szn", what: "supper clubs", bg: "var(--lav)", fg: "var(--dark)", accent: "var(--dark)" },
  { glyph: "♑︎", szn: "capricorn szn", what: "planning parties", bg: "#fff", fg: "var(--dark)", accent: "var(--pink)" },
  { glyph: "✦", szn: "any szn", what: "manifestation events and wellness experiences", bg: "var(--pink)", fg: "#fff", accent: "#fff" },
  { glyph: "✧", szn: "with brands", what: "collaborations and sponsored activations", bg: "var(--dark)", fg: "#fff", accent: "var(--pink)" },
];

function Section({ title, children, tint }: { title: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <section className="px-5 md:px-8 py-14" style={{ borderBottom: "var(--border)", background: tint ? "var(--lav-light)" : undefined }}>
      <div className="max-w-4xl mx-auto">
        <h2
          style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(24px, 3.6vw, 36px)", textTransform: "lowercase", letterSpacing: "-0.02em", margin: "0 0 18px" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {children}
      </div>
    </section>
  );
}

// ── the application ──────────────────────────────────────────────────────────

const label: React.CSSProperties = {
  display: "block", fontFamily: poppins, fontSize: 14, fontWeight: 800,
  lineHeight: 1.45, marginBottom: 8,
};
const input: React.CSSProperties = {
  width: "100%", padding: "15px 14px", border: "var(--border)", background: "#fff",
  fontSize: 16, fontFamily: "inherit",
};
const hint: React.CSSProperties = { fontSize: 13.5, color: "var(--grey)", margin: "0 0 8px", fontWeight: 400, lineHeight: 1.55 };

// The route names the blank field, so say which one rather than "something went wrong".
const FIELD_ERRORS: Record<string, string> = {
  name_required: "We need your full name.",
  email_required: "That email doesn't look quite right.",
  city_required: "Pick your city.",
  other_city_required: "Tell us which city you're based in.",
  occupation_required: "Tell us what you do for work.",
  instagram_required: "We need your Instagram handle.",
  birth_date_required: "We need your date of birth.",
  birth_time_required: "We need your time of birth. If you don't know it exactly, put your best guess and tick approximate.",
  birth_place_required: "Pick your place of birth from the list as you type.",
};

function HostApplicationForm() {
  const [form, setForm] = useState<Record<string, string>>({ city_slug: "", speaking_comfort: "" });
  const [birth, setBirth] = useState<BirthDetails>({ dateOfBirth: "", birthTime: "", birthTimeApproximate: false, location: null });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Guard against a double click before the request even leaves. The unique index on
    // (email, city) is the real backstop, this just stops the obvious case.
    if (sending || done) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/irl/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          speaking_comfort: Number(form.speaking_comfort),
          birth_date: birth.dateOfBirth,
          birth_time: birth.birthTime,
          birth_time_approximate: birth.birthTimeApproximate,
          birth_place: birth.location?.placeName ?? "",
          birth_lat: birth.location?.latitude ?? null,
          birth_lng: birth.location?.longitude ?? null,
          birth_tz: birth.location?.timezone ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === "rate_limited" ? "That's a few applications in a short window. Try again shortly."
          : data.error === "too_short" ? `Could you add a bit more to: ${data.label}?`
          : data.error === "missing_choice" ? "Looks like one of the choices further up is still blank."
          : FIELD_ERRORS[data.error] ?? "Something went wrong sending that. Please try again."
        );
        setSending(false);
        return;
      }
      setDone(data.reference ?? "");
    } catch {
      setError("Something went wrong sending that. Please try again.");
      setSending(false);
    }
  }

  if (done !== null) {
    return (
      <section id="apply" className="px-5 md:px-8 py-20" style={{ borderBottom: "var(--border)", background: "var(--pink-bg)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(28px, 4.6vw, 44px)", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            YAYYYYY, WE&rsquo;VE GOT IT &#127769;
          </h2>
          <p style={{ ...body, margin: "0 auto", maxWidth: 460 }}>
            Thank you so much for getting in touch. We&rsquo;ll be conducting interviews on Zoom over the
            next few weeks, and we&rsquo;ll come back to you either way.
          </p>
          {done && (
            <p style={{ fontSize: 13.5, color: "var(--grey)", marginTop: 18 }}>
              Your reference is <strong>{done}</strong>. We&rsquo;ve emailed you a copy.
            </p>
          )}
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="no-underline inline-block"
            style={{ marginTop: 26, border: "var(--border)", background: "#fff", color: "var(--dark)", fontFamily: poppins, fontWeight: 800, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", padding: "15px 26px" }}>
            while you wait, follow @itsmyszn
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="px-5 md:px-8 py-14" style={{ borderBottom: "var(--border)" }}>
      <div className="max-w-2xl mx-auto">
        <h2 style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(24px, 3.6vw, 36px)", textTransform: "lowercase", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          apply to become a host
        </h2>
        <p style={{ ...hint, marginBottom: 28 }}>
          It&rsquo;s a proper application rather than a quick form, because we want to actually get to
          know you. Give yourself ten minutes.
        </p>

        <form onSubmit={submit} noValidate style={{ display: "grid", gap: 34 }}>
          <FormBlock n={1} title="you">
            <Field label="Full name" required><input style={input} value={form.full_name ?? ""} onChange={(e) => set("full_name", e.target.value)} autoComplete="name" /></Field>
            <Field label="Email" required><input type="email" style={input} value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></Field>
            <Field label="Instagram" required><input style={input} placeholder="@" value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} /></Field>
            <Field label="City" required>
              <select style={input} value={form.city_slug} onChange={(e) => set("city_slug", e.target.value)}>
                <option value="">choose your city</option>
                {LAUNCH_CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                <option value="other">Other</option>
              </select>
            </Field>
            {form.city_slug === "other" && (
              <Field label="Which city are you based in?" required>
                <input style={input} value={form.other_city ?? ""} onChange={(e) => set("other_city", e.target.value)} />
              </Field>
            )}
          </FormBlock>

          {/* The same birth details fields as the free chart. One line says why we ask, since it is
              personal data; the chart itself is never shown to her. */}
          <FormBlock n={2} title="your birth details">
            <p style={{ ...hint, margin: 0 }}>
              We get to know every applicant through her chart and human design, and only the MY SZN
              team ever sees it.
            </p>
            <BirthDetailsFields value={birth} onChange={(p) => setBirth((b) => ({ ...b, ...p }))} labelStyle={label} inputStyle={input} />
          </FormBlock>

          <FormBlock n={3} title="about you">
            <Field label="What do you do for work, and what skills has it given you that you&rsquo;d bring to hosting?" required><textarea rows={4} style={input} value={form.occupation ?? ""} onChange={(e) => set("occupation", e.target.value)} /></Field>
            <Field label="Why do you want to become a MY SZN IRL Host?" required><textarea rows={5} style={input} value={form.why_host ?? ""} onChange={(e) => set("why_host", e.target.value)} /></Field>
            <Field label="What&rsquo;s your relationship with astrology, manifestation and personal development?" required><textarea rows={5} style={input} value={form.astrology_relationship ?? ""} onChange={(e) => set("astrology_relationship", e.target.value)} /></Field>
          </FormBlock>

          <FormBlock n={4} title="your experience">
            <Field label="Tell us about any hosting, events, hospitality, customer service or community experience you&rsquo;ve had" required>
              <textarea rows={5} style={input} value={form.relevant_experience ?? ""} onChange={(e) => set("relevant_experience", e.target.value)} />
            </Field>
            <Field label="How comfortable are you leading a room?" required>
              <p style={hint}>1 is not at all, 5 is completely in your element.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((n) => {
                  const on = form.speaking_comfort === String(n);
                  return (
                    <button type="button" key={n} onClick={() => set("speaking_comfort", String(n))}
                      style={{ flex: "1 1 56px", minWidth: 56, minHeight: 54, border: "var(--border)", background: on ? "var(--pink)" : "#fff", color: on ? "#fff" : "var(--dark)", fontFamily: poppins, fontWeight: 800, fontSize: 17, cursor: "pointer" }}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </Field>
          </FormBlock>

          <FormBlock n={5} title="the real questions">
            <Field label="You walk into a MY SZN event and one woman is standing alone looking uncomfortable. What do you do?" required>
              <textarea rows={5} style={input} value={form.scenario_answer ?? ""} onChange={(e) => set("scenario_answer", e.target.value)} />
            </Field>
            <Field label="Two women arrive together, only speak to each other all night and aren&rsquo;t engaging with the rest of the table. How would you handle it?" required>
              <textarea rows={5} style={input} value={form.second_scenario ?? ""} onChange={(e) => set("second_scenario", e.target.value)} />
            </Field>
            <Field label="Name three places, brands or experiences in your city that scream MY SZN" required>
              <textarea rows={5} style={input} value={form.local_ideas ?? ""} onChange={(e) => set("local_ideas", e.target.value)} />
            </Field>
          </FormBlock>

          <FormBlock n={6} title="the practical bit">
            <Radios name="frequency_ok" label="Can you generally host 1-2 evening or weekend events a month?" options={FREQUENCY} value={form.frequency_ok} onChange={set} />
            <Radios name="travel_ok" label="Are you comfortable travelling around your city for events?" options={TRAVEL} value={form.travel_ok} onChange={set} />
            <Radios name="side_role_ok" label="Are you happy with this being a freelance role, paid by the hour plus commission?" options={SIDE_ROLE} value={form.side_role_ok} onChange={set} />
          </FormBlock>

          {/* Stored in girls_night, the column the question it replaced used. */}
          <FormBlock n={7} title="one for fun...">
            <Field label="MY SZN gives you the budget to create one unforgettable night in your city. Where are we going, what are we doing and what&rsquo;s the vibe?" required>
              <textarea rows={5} style={input} value={form.girls_night ?? ""} onChange={(e) => set("girls_night", e.target.value)} />
            </Field>
          </FormBlock>

          {/* Honeypot, hidden from humans */}
          <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="company">company</label>
            <input id="company" tabIndex={-1} autoComplete="off" value={form.company ?? ""} onChange={(e) => set("company", e.target.value)} />
          </div>

          {error && (
            <p style={{ border: "var(--border)", background: "var(--pink-bg)", padding: "14px 16px", margin: 0, fontSize: 15 }}>{error}</p>
          )}

          <button type="submit" disabled={sending}
            style={{ background: "var(--pink)", color: "#fff", fontFamily: poppins, fontWeight: 800, fontSize: 15, letterSpacing: "0.05em", textTransform: "uppercase", padding: "19px 30px", border: "none", cursor: sending ? "wait" : "pointer", opacity: sending ? 0.7 : 1, minHeight: 58 }}>
            {sending ? "sending your application..." : "send my application"}
          </button>
        </form>

        <div style={{ marginTop: 30, borderTop: "var(--border)", paddingTop: 22 }}>
          <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: 18, textTransform: "lowercase", margin: "0 0 8px" }}>
            what happens next?
          </p>
          <p style={{ ...body, fontSize: 15.5, lineHeight: 1.7 }}>
            We&rsquo;re reviewing applications for our first hosts in London, New York and Los Angeles
            now, and we&rsquo;ll be holding relaxed Zoom interviews over the next few weeks so we can
            get to know each other properly. We&rsquo;ll come back to you either way.
          </p>
        </div>
      </div>
    </section>
  );
}

/** A numbered chunk of the form. Short sections rather than one intimidating scroll, which is the
 *  difference between a form people finish and a form people abandon on a phone. */
function FormBlock({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: "var(--border)", padding: "22px 20px 24px", margin: 0, background: "#fff" }}>
      <legend style={{ fontFamily: poppins, fontWeight: 800, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)", padding: "0 8px" }}>
        {n} &middot; {title}
      </legend>
      <div style={{ display: "grid", gap: 22 }}>{children}</div>
    </fieldset>
  );
}

function Field({ label: text, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <span style={label} dangerouslySetInnerHTML={{ __html: text + (required ? '' : ' <span style="font-weight:400;color:#6b6b6b">(optional)</span>') }} />
      {children}
    </div>
  );
}

function Radios({ name, label: text, options, value, onChange }: {
  name: string; label: string;
  options: readonly { value: string; label: string }[];
  value?: string; onChange: (k: string, v: string) => void;
}) {
  return (
    <div>
      <span style={label}>{text}</span>
      <div style={{ display: "grid", gap: 9 }}>
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button type="button" key={o.value} onClick={() => onChange(name, o.value)}
              style={{ textAlign: "left", border: "var(--border)", background: on ? "var(--lav-light)" : "#fff", padding: "15px 16px", fontSize: 15.5, fontFamily: "inherit", cursor: "pointer", minHeight: 52, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 18, height: 18, flexShrink: 0, border: "2px solid var(--dark)", borderRadius: "50%", background: on ? "var(--pink)" : "transparent" }} />
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
