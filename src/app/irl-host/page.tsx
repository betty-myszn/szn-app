"use client";

import { useState } from "react";
import Link from "next/link";
import BirthDetailsFields, { type BirthDetails } from "@/components/BirthDetailsFields";
import {
  ASTROLOGY_LEVELS, EVENINGS, FREQUENCY, HOSTING_EXPERIENCE, LAUNCH_CITIES,
  PARTNERSHIPS, SIDE_ROLE, TRAVEL,
} from "@/lib/irl";

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
            become a my szn irl host
          </h1>
          <p style={{ fontFamily: poppins, fontWeight: 800, fontSize: "clamp(14px, 2.2vw, 19px)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", margin: "0 0 22px" }}>
            London &middot; New York &middot; Los Angeles
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.86)", maxWidth: 600, margin: "0 auto 30px" }}>
            Help bring MY SZN to life in your city through astrology-inspired dinners, workshops,
            experiences and community events.
          </p>
          <a href="#apply" className="no-underline inline-block" style={{ background: "var(--pink)", color: "#fff", fontFamily: poppins, fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase", padding: "17px 34px", border: "2px solid #fff" }}>
            apply to become a host
          </a>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: "22px 0 0" }}>
            Get a feel for us first:{" "}
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontWeight: 700 }}>@itsmyszn on instagram</a>
            {" "}&middot;{" "}
            <a href={PODCAST} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontWeight: 700 }}>the my szn podcast</a>
          </p>
        </div>
      </section>

      {/* ── what is MY SZN IRL ────────────────────────────────────────────── */}
      <Section title="what is my szn irl?">
        <p style={body}>
          MY SZN IRL takes the community out of the group chat and into real rooms, where women can
          actually meet each other, make friends and move through each astrological season together.
          Every szn has its own energy, so every szn gets its own kind of night.
        </p>
        <div className="grid gap-3 md:grid-cols-2" style={{ marginTop: 22 }}>
          {[
            ["libra szn", "beauty evenings"],
            ["scorpio szn", "candle-making and shadow-work nights"],
            ["sagittarius szn", "supper clubs"],
            ["capricorn szn", "planning parties"],
            ["any szn", "manifestation events and wellness experiences"],
            ["with brands", "collaborations and sponsored activations"],
          ].map(([szn, what]) => (
            <div key={szn} style={{ border: "var(--border)", padding: "16px 18px", background: "#fff" }}>
              <span style={{ fontFamily: poppins, fontWeight: 800, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)" }}>{szn}</span>
              <p style={{ margin: "6px 0 0", fontSize: 15.5, lineHeight: 1.55 }}>{what}</p>
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
            "Following the event run sheets and host toolkits we give you",
            "Helping spot interesting local venues and experiences",
            "Capturing basic content on the night, and passing on what guests said",
            "Growing the MY SZN community where you live",
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
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["host training", "So you know exactly how a MY SZN night runs before your first one."],
            ["seasonal event toolkits", "A ready-made kit for each szn, so you are never starting from a blank page."],
            ["astrology talking points", "Written for you, in our voice, no chart-reading required."],
            ["event run sheets", "Minute by minute, so you can be present instead of clock-watching."],
            ["conversation prompts", "The thing that turns a room of strangers into a table of friends."],
            ["activity ideas", "Tested, seasonal, and adaptable to whatever venue you find."],
            ["brand guidelines", "How MY SZN looks and sounds, so everything feels like us."],
            ["guest communication templates", "Invites, reminders and follow-ups, already written."],
            ["ongoing support", "A real person to ask, before and after every event."],
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
              a flexible freelance role
            </p>
            <p style={{ ...body, margin: "0 0 14px" }}>
              This is a freelance role, made for you if you want extra income alongside your existing
              work, study, freelancing, business or other projects, and it fits around the life you
              already have.
            </p>
            <p style={{ ...body, margin: 0 }}>
              You&rsquo;re paid by the hour for the events you host, and on top of that you earn
              commission on every single person you sign up to MY SZN, so the more your community
              grows, the more you earn.
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
            <Link href="/" style={{ color: "var(--lav)" }}>back to my szn</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

const body: React.CSSProperties = { fontSize: 16.5, lineHeight: 1.8, margin: 0 };

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
  occupation_required: "Tell us your current occupation.",
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
            Thanks for applying to become a MY SZN IRL Host. Your application has been received and
            shortlisted applicants will be contacted about the next stage.
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
            <Field label="Phone / WhatsApp"><input style={input} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" /></Field>
            <Field label="Instagram" required><input style={input} placeholder="@" value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} /></Field>
            <Field label="TikTok"><input style={input} placeholder="@" value={form.tiktok ?? ""} onChange={(e) => set("tiktok", e.target.value)} /></Field>
            <Field label="LinkedIn"><input style={input} value={form.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} /></Field>
          </FormBlock>

          <FormBlock n={2} title="your city">
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
            <Field label="Current occupation" required><input style={input} value={form.occupation ?? ""} onChange={(e) => set("occupation", e.target.value)} /></Field>
          </FormBlock>

          {/* The same birth details fields as the free chart. Deliberately no word on what they are
              for: applicants are never shown their own chart or told it is part of the decision. */}
          <FormBlock n={3} title="your birth details">
            <BirthDetailsFields value={birth} onChange={(p) => setBirth((b) => ({ ...b, ...p }))} labelStyle={label} inputStyle={input} />
          </FormBlock>

          <FormBlock n={4} title="about you">
            <Field label="Tell us a little about yourself" required><textarea rows={5} style={input} value={form.about_you ?? ""} onChange={(e) => set("about_you", e.target.value)} /></Field>
            <Field label="Why would you love to become a MY SZN IRL Host?" required><textarea rows={5} style={input} value={form.why_host ?? ""} onChange={(e) => set("why_host", e.target.value)} /></Field>
            <Field label="What&rsquo;s your relationship with astrology, manifestation and personal development?" required><textarea rows={5} style={input} value={form.astrology_relationship ?? ""} onChange={(e) => set("astrology_relationship", e.target.value)} /></Field>
            <Radios name="astrology_level" label="How would you describe your astrology knowledge?" options={ASTROLOGY_LEVELS} value={form.astrology_level} onChange={set} />
          </FormBlock>

          <FormBlock n={5} title="community + hosting">
            <Field label="What does creating a great community mean to you?" required><textarea rows={5} style={input} value={form.community_means ?? ""} onChange={(e) => set("community_means", e.target.value)} /></Field>
            <Field label="What are your people skills like? How would your friends describe you in a room full of strangers?" required><textarea rows={5} style={input} value={form.people_skills ?? ""} onChange={(e) => set("people_skills", e.target.value)} /></Field>
            <Field label="What&rsquo;s your customer service experience?" required>
              <p style={hint}>Hospitality, retail, salons, events, or anywhere looking after people was part of the job.</p>
              <textarea rows={4} style={input} value={form.customer_service ?? ""} onChange={(e) => set("customer_service", e.target.value)} />
            </Field>
            <Field label="How comfortable are you speaking to and leading a group?" required>
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
            <Radios name="hosting_experience" label="Have you hosted events, groups or communities before?" options={HOSTING_EXPERIENCE} value={form.hosting_experience} onChange={set} />
            {form.hosting_experience && form.hosting_experience !== "never_but_keen" && (
              <Field label="Give us some examples of events you&rsquo;ve hosted" required>
                <p style={hint}>What it was, roughly how many people came, and what you did on the night.</p>
                <textarea rows={4} style={input} value={form.hosting_examples ?? ""} onChange={(e) => set("hosting_examples", e.target.value)} />
              </Field>
            )}
            <Field label="Any relevant experience you&rsquo;d like to tell us about?"><textarea rows={4} style={input} value={form.relevant_experience ?? ""} onChange={(e) => set("relevant_experience", e.target.value)} /></Field>
          </FormBlock>

          <FormBlock n={6} title="the real questions">
            <Field label="Imagine you arrive at a MY SZN dinner and one woman is standing alone and looks uncomfortable. What do you do?" required>
              <textarea rows={5} style={input} value={form.scenario_answer ?? ""} onChange={(e) => set("scenario_answer", e.target.value)} />
            </Field>
            <Field label="What are three places, brands or experiences in your city that you think would make an amazing MY SZN event?" required>
              <textarea rows={5} style={input} value={form.local_ideas ?? ""} onChange={(e) => set("local_ideas", e.target.value)} />
            </Field>
          </FormBlock>

          <FormBlock n={7} title="the practical bit">
            <Field label="What does your availability look like?" required>
              <p style={hint}>The days and times that usually work for you, and anything coming up we should plan around.</p>
              <textarea rows={3} style={input} value={form.availability ?? ""} onChange={(e) => set("availability", e.target.value)} />
            </Field>
            <Radios name="frequency_ok" label="Are you comfortable hosting around 1-2 events per month?" options={FREQUENCY} value={form.frequency_ok} onChange={set} />
            <Radios name="evenings_ok" label="Are evenings and weekends generally possible?" options={EVENINGS} value={form.evenings_ok} onChange={set} />
            <Radios name="travel_ok" label="Are you comfortable travelling around your city for events?" options={TRAVEL} value={form.travel_ok} onChange={set} />
            <Radios name="side_role_ok" label="Are you happy with this being a freelance role, paid by the hour plus commission?" options={SIDE_ROLE} value={form.side_role_ok} onChange={set} />
            <Radios name="partnerships_interest" label="Would you be interested in helping find local venues, experiences and potential brand partners?" options={PARTNERSHIPS} value={form.partnerships_interest} onChange={set} />
          </FormBlock>

          <FormBlock n={8} title="last one, promise">
            <Field label="You&rsquo;re planning the ultimate girls&rsquo; night in your city and money isn&rsquo;t an issue. Where are we going and what are we doing?" required>
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
