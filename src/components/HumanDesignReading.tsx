"use client";


import Link from "next/link";
import { useHumanDesign } from "@/lib/use-human-design";
import { useMember } from "@/lib/use-member";
import { hasActiveAccess } from "@/lib/membership-access";
import Bodygraph from "@/components/Bodygraph";
import HumanDesignAreas from "@/components/HumanDesignAreas";
import HumanDesignGates from "@/components/HumanDesignGates";
import HumanDesignProfileLines from "@/components/HumanDesignProfileLines";
import HdTerm, { glossify } from "@/components/HdTerm";
import HdShareButton from "@/components/HdShareCard";
import HdToday from "@/components/HdToday";
import { Box, LessonPage, LessonProgress, LessonTiles, SectionHead, TONES, makeLead, useLessons, type Lesson } from "@/components/learn/LearnKit";
import { OFF_TRACK_TYPE, OFF_TRACK_AUTHORITY } from "@/lib/human-design-learn";
import type { HumanDesignData } from "@/types/human-design";
import { CENTER_LABELS, GATE_NAME, channelKey } from "@/lib/human-design-constants";
import {
  TYPE_CONTENT,
  AUTHORITY_CONTENT,
  PROFILE_CONTENT,
  DEFINITION_CONTENT,
  CENTER_CONTENT,
  CROSS_ANGLE_CONTENT,
  CHANNEL_GIFT,
} from "@/lib/human-design-content";
import { typeDeep, type HdDeepDive } from "@/lib/human-design-deep-content";

const poppins = "var(--font-poppins), Poppins, sans-serif";

// The Human Design chart as a guided reading: every element leads with what it means for you and how
// to apply it, mirroring how the astrology chart reads. The raw technical activations sit at the
// bottom for those who want them. Extracted from the /human-design page so the SAME reading can be
// shown both on that standalone page and inside the combined free-chart results (the birth-chart /
// human-design tabs), with no duplicated content.
//
// memberNav renders the member-only "my astrology chart" links; it stays off in the free tabbed
// results, where the tab bar is the navigation and /my-chart isn't a free destination.
export default function HumanDesignReading({ memberNav = false }: { memberNav?: boolean }) {
  const { hd, loading } = useHumanDesign();
  const { member } = useMember();

  if (loading) {
    return (
      <Shell>
        <p style={{}}>reading your design...</p>
      </Shell>
    );
  }

  if (!hd) {
    return (
      <Shell>
        <p style={{ marginBottom: 16 }}>
          We need your birth date, exact time and place to build your Human Design chart.
        </p>
        <Link href="/chart" style={linkBtn}>
          get my free charts
        </Link>
      </Shell>
    );
  }

  // The identity essentials (type, strategy, authority, profile, bodygraph) are free for everyone,
  // the front-door taster. The deeper read (definition, area-by-area, centres, channels, every gate,
  // incarnation cross, technical) is the paid layer, so free members and logged-out visitors see a
  // go-deeper CTA in its place.
  const unlocked = hasActiveAccess(member);

  return (
    <Shell>
      <DesignReading hd={hd} unlocked={unlocked} memberNav={memberNav} />
    </Shell>
  );
}

// Everything once the chart has loaded. Its own component so the lesson state can use hooks
// (the parent returns early while loading).
function DesignReading({ hd, unlocked, memberNav }: { hd: HumanDesignData; unlocked: boolean; memberNav: boolean }) {
  const type = TYPE_CONTENT[hd.type];
  const authority = AUTHORITY_CONTENT[hd.authority];
  const profile = PROFILE_CONTENT[hd.profile];
  const definition = DEFINITION_CONTENT[hd.definition];
  const cross = CROSS_ANGLE_CONTENT[hd.incarnationCross.angle];
  const authorityShort = authority.title.replace(/ authority.*/i, "");

  // which lesson is open (with #hd-<id> links and the back gesture), and her read progress
  const { openId, anchor, read, readCount, open: openLesson, close: closeLesson } = useLessons({
    prefix: "hd",
    ids: LESSON_IDS,
    accessible: unlocked ? LESSON_IDS : FREE_LESSON_IDS,
    progressKey: "hd_lessons_read",
  });
  const accessible = unlocked ? LESSON_IDS : FREE_LESSON_IDS;

  const focusGate = anchor?.startsWith("hd-gate-") ? Number(anchor.slice(8)) : undefined;

  const lessons: Lesson[] = [
          {
            id: "type",
            eyebrow: "your type",
            title: hd.type,
            hook: type.intro,
            body: <LessonReading block={type} deep={typeDeep(hd.type)} unlocked={unlocked} />,
          },
          {
            id: "authority",
            eyebrow: "how you decide",
            title: authority.title,
            hook: authority.intro,
            body: <LessonReading block={authority} />,
          },
          ...(profile
            ? [
                {
                  id: "profile",
                  eyebrow: "your profile",
                  title: `${hd.profile} ${profile.title}`,
                  hook: profile.intro,
                  body: (
                    <>
                      <LessonReading block={profile} />
                      <HumanDesignProfileLines profile={hd.profile} />
                    </>
                  ),
                },
              ]
            : []),
          {
            id: "offtrack",
            eyebrow: "your off-track signals",
            title: `${hd.notSelfTheme} means stop`,
            hook: "The exact signs you've drifted from your design, and what on track feels like.",
            body: (
              <div style={{ display: "grid", gap: 14 }}>
                <Box tone="dark" label="you're off track when">
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: 10 }}>
                    {[...OFF_TRACK_TYPE[hd.type], ...OFF_TRACK_AUTHORITY[hd.authority]].map((s) => (
                      <li key={s} style={{ paddingLeft: 24, position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: "var(--pink)", fontWeight: 800 }}>✦</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Box>
                <Box tone="pink" label="on track feels like">
                  <strong>{hd.signature}.</strong> That&apos;s your <HdTerm k="signature">signature</HdTerm>, the feeling that tells you you&apos;re
                  living your design. The fastest way back to it is your strategy: <strong>{hd.strategy.toLowerCase()}</strong>.
                </Box>
                <Box tone="lav" label="try this today">
                  Next time you feel {hd.notSelfTheme.toLowerCase()}, write down what happened in the hour before. Within a week
                  you&apos;ll see your pattern, and patterns are way easier to break once you can name them.
                </Box>
              </div>
            ),
          },
          {
            id: "definition",
            eyebrow: "how you're wired",
            title: hd.definition,
            hook: definition.intro,
            locked: true,
            body: <LessonReading block={definition} />,
          },
          {
            id: "areas",
            eyebrow: "area by area",
            title: "Money, love, work + more",
            hook: "How your design actually plays out in each part of your life.",
            locked: true,
            body: <HumanDesignAreas hd={hd} unlocked />,
          },
          {
            id: "centres",
            eyebrow: "your centres",
            title: `${hd.definedCenters.length} defined, ${hd.openCenters.length} open`,
            hook: "Where your energy is consistent, and where you soak up the room.",
            locked: true,
            body: (
              <>
                <Box tone="lav">
                  Defined centres are your consistent, reliable energy, the parts of you that stay the same
                  wherever you go. Open centres are where you take in and amplify the world, your places of
                  sensitivity and, in time, wisdom.
                </Box>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginTop: 16 }}>
                  {hd.definedCenters.map((c) => (
                    <CenterRow key={c} id={`hd-centre-${c}`} label={CENTER_LABELS[c]} theme={CENTER_CONTENT[c].theme} text={CENTER_CONTENT[c].defined} defined />
                  ))}
                  {hd.openCenters.map((c) => (
                    <CenterRow key={c} id={`hd-centre-${c}`} label={CENTER_LABELS[c]} theme={CENTER_CONTENT[c].theme} text={CENTER_CONTENT[c].open} defined={false} />
                  ))}
                </div>
              </>
            ),
          },
          {
            id: "channels",
            eyebrow: "your channels",
            title: hd.definedChannels.length === 1 ? "1 fixed gift" : `${hd.definedChannels.length} fixed gifts`,
            hook: "The talents that are always switched on, no matter what.",
            locked: true,
            body:
              hd.definedChannels.length === 0 ? (
                <Box tone="lav">You have no fully defined channels, which is the open, reflective wiring of your type.</Box>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                  {hd.definedChannels.map((ch, i) => (
                    <Box key={ch.key} id={`hd-channel-${ch.key}`} tone={i % 2 ? "lav" : "pink"}>
                      <div style={{ fontFamily: poppins, fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
                        {ch.gates[0]}–{ch.gates[1]} · {ch.name || "Channel"}
                      </div>
                      {CHANNEL_GIFT[channelKey(ch.gates[0], ch.gates[1])] ?? ""}
                    </Box>
                  ))}
                </div>
              ),
          },
          {
            id: "gates",
            eyebrow: "your gates",
            title: `${hd.activatedGates.length} gates`,
            hook: "Every gate you carry, what it is and how its energy works.",
            locked: true,
            body: <HumanDesignGates hd={hd} focusGate={focusGate} />,
          },
          {
            id: "cross",
            eyebrow: "your life theme",
            title: cross.title,
            hook: cross.intro,
            locked: true,
            body: (
              <LessonReading
                block={{
                  ...cross,
                  meaning: `${cross.meaning} Your cross runs on gates ${hd.incarnationCross.gates.join(", ")}, the two Sun and Earth gates of your Personality and Design.`,
                }}
              />
            ),
          },
          {
            id: "technical",
            eyebrow: "the technical detail",
            title: "The raw activations",
            hook: "Every planet, gate and line behind your chart.",
            locked: true,
            body: (
              <>
                <Box tone="lav">
                  Personality is your conscious side, the person you know yourself to be. Design is your
                  unconscious body, set roughly 88 days before you were born.
                </Box>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginTop: 18 }}>
                  <ActivationTable title="Personality (conscious)" rows={hd.personality} />
                  <ActivationTable title="Design (unconscious)" rows={hd.design} />
                </div>
                <p style={{ fontSize: 13, marginTop: 24, lineHeight: 1.6 }}>
                  Design chart taken {hd.designUtcTime}, when the Sun was 88° of arc before your birth
                  position. Human Design is sensitive to your exact birth time, a few minutes can shift a
                  line or a centre. Computed on the same Swiss Ephemeris as your astrology chart.
                </p>
              </>
            ),
          },
  ];
  const idx = lessons.findIndex((l) => l.id === openId);

  return (
    <>
      {memberNav && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Link href="/my-chart" style={navLink}>
            &larr; my astrology chart
          </Link>
          <span style={{ ...navLink }}>human design</span>
        </div>
      )}

      {/* the foil hero card: her type as a collectable, everything on it solid black or white */}
      <section className="hd-foil" style={{ borderRadius: 26, border: "2px solid var(--dark)", padding: "26px 20px 22px", color: "var(--dark)", marginBottom: 18 }}>
        <p style={{ fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", margin: "0 0 8px" }}>
          {hd.birthData.name ? `${hd.birthData.name}'s energy blueprint` : "your energy blueprint"}
        </p>
        <h1 style={{ fontFamily: poppins, fontSize: 46, lineHeight: 1.02, margin: "0 0 6px", fontWeight: 800 }}>{hd.type}</h1>
        <p style={{ fontFamily: poppins, fontSize: 19, fontWeight: 700, margin: "0 0 18px" }}>{type.title}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 18 }}>
          <HeroStat label={<HdTerm k="strategy">strategy</HdTerm>} value={hd.strategy} />
          <HeroStat label={<HdTerm k="authority">authority</HdTerm>} value={authorityShort} />
          <HeroStat label={<HdTerm k="profile">profile</HdTerm>} value={`${hd.profile} ${profile ? profile.title : ""}`} />
          <HeroStat label={<HdTerm k="definition">definition</HdTerm>} value={hd.definition} />
          <HeroStat label={<HdTerm k="cross">cross</HdTerm>} value={`${hd.incarnationCross.angle} (${hd.incarnationCross.gates.join("/")})`} />
        </div>
        <HdShareButton hd={hd} typeTitle={type.title} authority={authorityShort} />
      </section>

      {/* the 30-second version, for anyone who reads nothing else */}
      <SectionHead title="your design in 30 seconds" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 24 }}>
        <Box tone="pink" label="how you're built">
          <strong>{hd.type}.</strong> {type.intro}
        </Box>
        <Box tone="lav" label="how you decide">
          {authority.intro} Your move: <strong>{hd.strategy.toLowerCase()}</strong>.
        </Box>
        <Box tone="dark" label="your off-track alarm" wide>
          When you feel <strong><HdTerm k="notself">{hd.notSelfTheme.toLowerCase()}</HdTerm></strong>, something&apos;s off. When you feel{" "}
          <strong><HdTerm k="signature">{hd.signature.toLowerCase()}</HdTerm></strong>, you&apos;re bang on.
        </Box>
      </div>

      <HdToday hd={hd} />

      {/* the bodygraph: hover or tap any centre, channel or gate, then open its full lesson */}
      <div style={{ margin: "8px 0 24px" }}>
        <Bodygraph hd={hd} unlocked={unlocked} onOpenLesson={(t) => openLesson(t.lesson, t.anchor)} />
      </div>

      {/* progress through the lessons */}
      <LessonProgress title="learn your design" readCount={readCount} total={accessible.length} />

      <LessonTiles title="start here" lessons={lessons.slice(0, 4)} offset={0} unlocked={unlocked} read={read} onOpen={openLesson} />
      <LessonTiles title="go deeper" lessons={lessons.slice(4)} offset={4} unlocked={unlocked} read={read} onOpen={openLesson} />

      {!unlocked && <GoDeeperCTA name={hd.birthData.name} />}

      {memberNav && (
        <div style={{ marginTop: 32 }}>
          <Link href="/my-chart" style={linkBtnOutline}>
            &larr; back to my astrology chart
          </Link>
        </div>
      )}

      {idx >= 0 && (
        <LessonPage
          lesson={lessons[idx]}
          tone={TONES[idx % TONES.length]}
          locked={!!lessons[idx].locked && !unlocked}
          lockedContent={<GoDeeperCTA name={hd.birthData.name} />}
          anchor={anchor}
          prev={lessons[idx - 1]}
          next={lessons[idx + 1]}
          onGo={(id) => openLesson(id)}
          onClose={closeLesson}
        />
      )}
    </>
  );
}

function HeroStat({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid var(--dark)", borderRadius: 14, padding: "10px 12px" }}>
      <div style={{ fontFamily: poppins, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: poppins, fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>{value}</div>
    </div>
  );
}

// ── pieces ──────────────────────────────────────────────────────────────────────

// Shown in place of the deep reading for free members and logged-out visitors. Names what sits behind
// the paid gate and sends her to the plans, mirroring the "go deeper" CTA on the free astrology chart.
function GoDeeperCTA({ name }: { name?: string }) {
  const inside = [
    "How your design plays out in money, love, business and confidence, area by area",
    "Every one of your centres, defined and open, read in full",
    "Your channels and all your gates, the fixed gifts you carry",
    "Your incarnation cross, the life theme running underneath it all",
    "Your Human Design and your astrology, woven together across every part of your life",
  ];
  return (
    <div
      style={{
        margin: "40px 0 8px",
        padding: "28px 24px",
        background: "var(--lav-light)",
        border: "var(--border)",
      }}
    >
      <p style={{ ...eyebrow, marginBottom: 8, color: "var(--pink)", opacity: 1 }}>this is the surface</p>
      <h2 style={{ fontFamily: poppins, fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.2, color: "#2E1C63", margin: "0 0 10px" }}>
        {name ? `${name}, go deeper into your design.` : "Go deeper into your design."}
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--dark)", margin: "0 0 16px" }}>
        Your Type, Strategy and Authority above are the front door. The full read is inside MY SZN:
      </p>
      <ul style={{ margin: "0 0 22px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {inside.map((line) => (
          <li key={line} style={{ fontSize: 14, lineHeight: 1.55, color: "var(--dark)", paddingLeft: 22, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: "var(--pink)", fontWeight: 800 }}>✦</span>
            {line}
          </li>
        ))}
      </ul>
      <Link
        href="/membership"
        className="no-underline"
        style={{
          display: "inline-block",
          background: "var(--pink)",
          color: "var(--dark)",
          fontFamily: poppins,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "14px 28px",
        }}
      >
        see the plans
      </Link>
    </div>
  );
}

// ── the lessons: tile grid + full-screen page ─────────────────────────────────────

// Every lesson id, for the #hd-<id> deep links (a missing one, like profile, just opens nothing).
const LESSON_IDS = ["type", "authority", "profile", "offtrack", "definition", "areas", "centres", "channels", "gates", "cross", "technical"];
const FREE_LESSON_IDS = ["type", "authority", "profile", "offtrack"];

const lead = makeLead(glossify);

// One lesson's reading laid out as boxes: what it means, how to work with it, then the paid deep
// dive as four boxes (or the unlock prompt for free members).
function LessonReading({
  block,
  deep,
  unlocked = true,
}: {
  block: { title: string; intro: string; meaning: string; apply: string };
  deep?: HdDeepDive | null;
  unlocked?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 14, marginBottom: 8 }}>
      <Box label="what it means">{lead(block.meaning)}</Box>
      <Box tone="lav" label="how to work with it">{lead(block.apply)}</Box>
      {deep &&
        (unlocked ? (
          <>
            <SectionHead title="the deep dive" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              <Box tone="pink" label="for you">{lead(deep.forYou)}</Box>
              <Box tone="lav" label="in your business">{lead(deep.inBusiness)}</Box>
              <Box tone="dark" label="the shadow">{lead(deep.shadow)}</Box>
              <Box label="how to heal">{lead(deep.heal)}</Box>
            </div>
          </>
        ) : (
          <Link
            href="/membership"
            className="no-underline"
            style={{ display: "inline-block", justifySelf: "start", border: "1.5px solid var(--pink)", color: "var(--dark)", fontFamily: poppins, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "10px 18px" }}
          >
            ✦ unlock the full breakdown
          </Link>
        ))}
    </div>
  );
}

function CenterRow({
  id,
  label,
  theme,
  text,
  defined,
}: {
  id?: string;
  label: string;
  theme: string;
  text: string;
  defined: boolean;
}) {
  return (
    <div id={id} style={{ ...card, border: "1.5px solid var(--dark)", borderLeft: `6px solid ${defined ? "var(--pink)" : "var(--lav)"}` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
        <span style={{ fontFamily: poppins, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12 }}>{theme}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            padding: "2px 8px",
            borderRadius: 999,
            background: defined ? "var(--pink-light)" : "var(--lav-light)",
          }}
        >
          {defined ? "defined" : "open"}
        </span>
      </div>
      <div style={{ fontSize: 14.5, lineHeight: 1.6 }}>{lead(text)}</div>
    </div>
  );
}

function ActivationTable({
  title,
  rows,
}: {
  title: string;
  rows: { body: string; gate: number; line: number }[];
}) {
  return (
    <div>
      <h3 style={{ fontFamily: poppins, fontSize: 14, margin: "0 0 8px" }}>{title}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.body} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <td style={{ padding: "5px 0" }}>{r.body}</td>
              <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                <strong>
                  {r.gate}.{r.line}
                </strong>{" "}
                <span style={{}}>{GATE_NAME[r.gate]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// A plain div, not a <main>: this reading now renders both as a standalone page and inside the
// combined results page, and a nested <main> would be invalid there.
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "var(--font-body, system-ui), sans-serif",
        color: "var(--dark)",
      }}
    >
      {children}
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────

const eyebrow: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: 1.8,
  fontSize: 10.5,
};

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 14,
  padding: "14px 16px",
};

const navLink: React.CSSProperties = {
  fontSize: 13,
  textDecoration: "none",
  color: "var(--dark)",
};

const linkBtn: React.CSSProperties = {
  display: "inline-block",
  background: "var(--pink)",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
};

const linkBtnOutline: React.CSSProperties = {
  display: "inline-block",
  border: "1px solid rgba(0,0,0,0.2)",
  color: "var(--dark)",
  padding: "10px 18px",
  borderRadius: 999,
  textDecoration: "none",
  fontSize: 14,
};
