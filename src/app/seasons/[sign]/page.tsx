"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const pp = "var(--font-poppins), Poppins, sans-serif";
const dm = "var(--font-dm-sans), 'DM Sans', sans-serif";

const SEASONS: Record<string, {
  name: string;
  dates: string;
  element: string;
  theme: string;
  emoji: string;
  color: string;
  bg: string;
  vibe: string;
  intro: string;
  workshop: string;
  bullets: string[];
  affirmation: string;
}> = {
  aries: {
    name: "Aries",
    dates: "March 21 - April 19",
    element: "Fire",
    theme: "Courage",
    emoji: "♈",
    color: "var(--pink)",
    bg: "var(--pink-light)",
    vibe: "Bold. Fearless. First.",
    intro: "Aries szn is where you stop overthinking and start doing. This is the season of new beginnings, bold moves, and backing yourself so hard that everyone else has no choice but to follow. The zodiac year starts here for a reason. This is your fresh start energy on steroids.",
    workshop: "In the Aries szn workshop we focus on courage, initiative, and cutting through the fear that keeps you stuck. We work on taking the leap before you feel ready, trusting your impulses, and stepping into the version of yourself who doesn't wait for permission.",
    bullets: [
      "Stop waiting for the perfect moment and create it",
      "Build unshakeable confidence in your own decisions",
      "Learn to back yourself louder than your doubts",
      "Channel fire energy without burning out",
      "Set boundaries that protect your ambition",
    ],
    affirmation: "I don't wait for my moment. I create it.",
  },
  taurus: {
    name: "Taurus",
    dates: "April 20 - May 20",
    element: "Earth",
    theme: "Receiving",
    emoji: "♉",
    color: "#2d8a6e",
    bg: "var(--mint)",
    vibe: "Luxe. Grounded. Abundant.",
    intro: "Taurus szn is where you finally learn to receive. Not hustle harder, not grind more, not prove your worth through exhaustion. This is the season of abundance, self-worth, pleasure, and building a life so beautiful you don't need a holiday to escape it.",
    workshop: "In the Taurus szn workshop we dive deep into your relationship with money, receiving, and self-worth. We rewire scarcity mindset, explore abundance blocks, and help you build a financial reality that matches the life you actually want.",
    bullets: [
      "Heal your relationship with money once and for all",
      "Stop undercharging and start receiving what you deserve",
      "Rewire scarcity mindset into abundance consciousness",
      "Build a life of luxury that starts with how you treat yourself",
      "Learn to receive without guilt, apology, or over-giving in return",
    ],
    affirmation: "I am worthy of everything I desire. And then some.",
  },
  gemini: {
    name: "Gemini",
    dates: "May 21 - June 20",
    element: "Air",
    theme: "Expression",
    emoji: "♊",
    color: "var(--pink)",
    bg: "var(--pink-light)",
    vibe: "Magnetic. Vocal. Electric.",
    intro: "Gemini szn is where you find your voice and use it. This is the season of communication, connection, social power, and becoming so magnetic that people can't look away. You stop filtering yourself. You say the thing. You become the woman everyone wants at the table.",
    workshop: "In the Gemini szn workshop we focus on communication, personal branding, storytelling, and magnetic presence. We work on expressing yourself authentically, building confidence in your voice, and showing up online and offline in a way that turns heads.",
    bullets: [
      "Find your voice and stop shrinking it for other people",
      "Build a personal brand that is unapologetically you",
      "Master the art of storytelling and connection",
      "Become the most magnetic person in every room",
      "Say what you mean and mean what you say",
    ],
    affirmation: "My voice is powerful. When I speak, people listen.",
  },
  cancer: {
    name: "Cancer",
    dates: "June 21 - July 22",
    element: "Water",
    theme: "Nurturing",
    emoji: "♋",
    color: "#7B68AE",
    bg: "var(--lav-light)",
    vibe: "Soft. Protected. Home.",
    intro: "Cancer szn is where you come home to yourself. This is the season of healing, inner child work, emotional intelligence, and building the kind of safety within yourself that no person or circumstance can ever take away. You learn to mother yourself the way you always needed.",
    workshop: "In the Cancer szn workshop we go deep on inner child healing, emotional boundaries, and self-nurturing. We explore what safety really means, how to create it internally, and how to stop abandoning yourself in relationships, friendships, and work.",
    bullets: [
      "Heal the inner child wounds you've been carrying since forever",
      "Build emotional safety that starts from within",
      "Stop abandoning yourself to make other people comfortable",
      "Create a home, a life, and a body that feel like sanctuary",
      "Learn to nurture yourself first without calling it selfish",
    ],
    affirmation: "I am safe in my own body. I am home.",
  },
  leo: {
    name: "Leo",
    dates: "July 23 - August 22",
    element: "Fire",
    theme: "Visibility",
    emoji: "♌",
    color: "var(--pink)",
    bg: "var(--gold)",
    vibe: "Main character. Centre stage. Iconic.",
    intro: "Leo szn is where you stop hiding and start shining. This is the season of visibility, self-expression, confidence, and stepping into the spotlight like you were born for it. Because you were. It's time to stop dimming your light for people who can't handle the glow.",
    workshop: "In the Leo szn workshop we work on visibility, confidence, showing up unapologetically, and owning every room you walk into. We tackle imposter syndrome, people-pleasing, and the fear of being seen that keeps brilliant women invisible.",
    bullets: [
      "Step into full visibility and stop apologising for taking up space",
      "Own the room, the spotlight, the entire stage",
      "Kill imposter syndrome dead and stop letting it run the show",
      "Show up so powerfully that playing small becomes impossible",
      "Become the version of yourself that younger you dreamed about",
    ],
    affirmation: "I was born to be seen. The spotlight is mine.",
  },
  virgo: {
    name: "Virgo",
    dates: "August 23 - September 22",
    element: "Earth",
    theme: "Standards",
    emoji: "♍",
    color: "#2d8a6e",
    bg: "var(--mint)",
    vibe: "Elevated. Intentional. Unshakeable.",
    intro: "Virgo szn is where you raise the bar on your entire life. This is the season of getting your systems, routines, health, and habits so dialled in that your future self sends you a thank you note. No more settling. No more chaos. You deserve a life that runs as beautifully as you do.",
    workshop: "In the Virgo szn workshop we focus on systems, standards, daily rituals, and creating a life that actually supports the woman you're becoming. We work on health, habits, organisation, and cutting out everything that's been draining your energy.",
    bullets: [
      "Raise your standards in every single area of your life",
      "Build daily rituals and systems that support your next level",
      "Cut out the habits, people, and patterns that drain you",
      "Get your health, body, and energy firing on all cylinders",
      "Create a life so well-designed that success becomes inevitable",
    ],
    affirmation: "I don't settle. I elevate.",
  },
  libra: {
    name: "Libra",
    dates: "September 23 - October 22",
    element: "Air",
    theme: "Balance",
    emoji: "♎",
    color: "var(--pink)",
    bg: "var(--pink-light)",
    vibe: "Beautiful. Boundaried. Chosen.",
    intro: "Libra szn is where you learn to choose yourself in every relationship, partnership, and situation. This is the season of boundaries, beauty, harmony, and understanding that balance doesn't mean giving equal energy to everyone. It means giving the most energy to yourself first.",
    workshop: "In the Libra szn workshop we focus on relationships, boundaries, people-pleasing recovery, and building partnerships that actually match your worth. We work on codependency, communication, and learning to love yourself louder than you love anyone else.",
    bullets: [
      "Set boundaries that protect your peace without guilt",
      "Stop people-pleasing and start self-choosing",
      "Build relationships that match the standard you deserve",
      "Learn to walk away from anything that costs you your peace",
      "Become the woman who chooses herself every single time",
    ],
    affirmation: "I choose myself first. That's not selfish. That's survival.",
  },
  scorpio: {
    name: "Scorpio",
    dates: "October 23 - November 21",
    element: "Water",
    theme: "Transformation",
    emoji: "♏",
    color: "#7B68AE",
    bg: "var(--lav-light)",
    vibe: "Deep. Powerful. Reborn.",
    intro: "Scorpio szn is where you face the shadows and come out stronger. This is the season of transformation, depth, power, and burning down everything that no longer serves you so you can rise from the ashes as the most powerful version of yourself. No more avoiding. Go deep or go home.",
    workshop: "In the Scorpio szn workshop we go deep on shadow work, financial intimacy, sexual energy, power dynamics, and the parts of yourself you've been avoiding. We work on transforming pain into power and releasing what's been holding you hostage.",
    bullets: [
      "Face the shadow work you've been dodging for years",
      "Transform every ounce of pain into unstoppable power",
      "Get radically honest about money, sex, and control",
      "Release the stories, beliefs, and baggage keeping you stuck",
      "Rise from the ashes as someone completely unrecognisable",
    ],
    affirmation: "I am not afraid of the dark. That's where my power lives.",
  },
  sagittarius: {
    name: "Sagittarius",
    dates: "November 22 - December 21",
    element: "Fire",
    theme: "Expansion",
    emoji: "♐",
    color: "var(--pink)",
    bg: "var(--gold)",
    vibe: "Wild. Free. Limitless.",
    intro: "Sag szn is where you expand beyond everything you thought was possible. This is the season of adventure, freedom, big vision, and realising that the life you've been dreaming about is actually way too small. Dream bigger. Go further. Take up more space than you ever thought you were allowed.",
    workshop: "In the Sag szn workshop we work on expansion, vision, adventure, and breaking out of the box you've put yourself in. We tackle limiting beliefs, comfort zones, and the fear of going after what you actually want instead of what feels safe.",
    bullets: [
      "Dream so big it scares you and then go bigger",
      "Break out of the comfort zone that's been keeping you small",
      "Build a vision for your life that makes you cry happy tears",
      "Stop playing it safe and start playing to win",
      "Expand into the version of yourself who has no ceiling",
    ],
    affirmation: "There is no limit. There is no ceiling. There is only more.",
  },
  capricorn: {
    name: "Capricorn",
    dates: "December 22 - January 19",
    element: "Earth",
    theme: "Ambition",
    emoji: "♑",
    color: "#2d8a6e",
    bg: "var(--cream)",
    vibe: "Boss. Strategic. Unstoppable.",
    intro: "Capricorn szn is where you become the CEO of your own life. This is the season of ambition, strategy, discipline, and building something so solid that your future self is set for life. No more winging it. No more hoping. You set the goal, you make the plan, you execute like a boss.",
    workshop: "In the Capricorn szn workshop we focus on goal setting, business strategy, discipline, and building the structures that turn dreams into reality. We work on career, money goals, long-term planning, and becoming the woman who plays the long game.",
    bullets: [
      "Build a business plan that matches your wildest ambition",
      "Set goals that scare you and then crush every single one",
      "Get ruthlessly strategic about your next level",
      "Become the CEO of your life, no permission needed",
      "Create wealth, legacy, and impact that outlasts you",
    ],
    affirmation: "I build empires. That's just what I do.",
  },
  aquarius: {
    name: "Aquarius",
    dates: "January 20 - February 18",
    element: "Air",
    theme: "Revolution",
    emoji: "♒",
    color: "var(--pink)",
    bg: "var(--pink-light)",
    vibe: "Different. Disruptive. Iconic.",
    intro: "Aquarius szn is where you break every rule that was never yours to follow. This is the season of innovation, individuality, rebellion, and becoming so unapologetically yourself that the world has no choice but to make room. You were never meant to fit in. You were meant to stand out.",
    workshop: "In the Aquarius szn workshop we work on authenticity, innovation, breaking patterns, and building a life that looks nothing like everyone else's. We tackle conformity, comparison, and the courage it takes to be genuinely, wildly, unapologetically you.",
    bullets: [
      "Break every rule that was never yours to follow",
      "Stop trying to fit in and start building your own lane",
      "Embrace the parts of yourself that make people uncomfortable",
      "Innovate, disrupt, and do it completely your way",
      "Become the most authentic version of yourself that exists",
    ],
    affirmation: "I was never meant to fit in. I was meant to stand out.",
  },
  pisces: {
    name: "Pisces",
    dates: "February 19 - March 20",
    element: "Water",
    theme: "Surrender",
    emoji: "♓",
    color: "#7B68AE",
    bg: "var(--lav-light)",
    vibe: "Intuitive. Flowing. Divine.",
    intro: "Pisces szn is where you stop forcing and start flowing. This is the season of intuition, spirituality, surrender, and trusting that the universe has a plan that's bigger and better than anything your anxiety could come up with. Let go. Trust. Allow.",
    workshop: "In the Pisces szn workshop we focus on intuition, spirituality, manifestation, and learning to surrender control. We work on trusting the process, connecting to your higher self, and releasing the need to have every single thing figured out before you start living.",
    bullets: [
      "Trust your intuition louder than your overthinking",
      "Surrender the need to control every outcome",
      "Connect to your spiritual practice on a deeper level",
      "Manifest from alignment instead of desperation",
      "Let go of everything that was never meant for you",
    ],
    affirmation: "I trust the process. I surrender the plan. I allow.",
  },
};

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "waitlist" }),
      });
    } catch {}
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>&#10024;</div>
        <div style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
          You&apos;re on the list.
        </div>
        <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.6 }}>
          We&apos;ll be in touch soon with early access details. Your season is coming.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <input
        type="text"
        placeholder="your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          flex: 0.7, padding: "16px 20px", fontSize: 14, fontFamily: dm,
          border: "var(--border)", background: "#fff",
          color: "var(--dark)", outline: "none",
        }}
      />
      <input
        type="email"
        required
        placeholder="your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: 1, padding: "16px 20px", fontSize: 14, fontFamily: dm,
          border: "var(--border)", background: "#fff",
          color: "var(--dark)", outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          background: "var(--pink)", color: "#fff", fontFamily: dm,
          fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "16px 32px", border: "none",
          cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        {submitting ? "joining..." : "join the waitlist"}
      </button>
    </form>
  );
}

export default function SeasonPage() {
  const params = useParams();
  const slug = (params.sign as string).toLowerCase();
  const season = SEASONS[slug];

  if (!season) {
    return (
      <div className="px-8 py-32 text-center">
        <h1 style={{ fontFamily: pp, fontSize: 32, fontWeight: 800 }}>Season not found.</h1>
        <Link href="/waitlist" style={{ color: "var(--pink)", textDecoration: "underline", marginTop: 16, display: "inline-block" }}>
          Back to waitlist
        </Link>
      </div>
    );
  }

  const allSeasons = Object.entries(SEASONS);

  return (
    <div>
      {/* Hero */}
      <section className="px-8 py-16 md:py-24" style={{ background: "var(--dark)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div style={{ fontSize: 48, marginBottom: 16 }}>{season.emoji}</div>
          <div className="tag mb-4">{season.dates} &middot; {season.element}</div>
          <h1 style={{
            fontFamily: pp, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 16,
          }}>
            {season.name} <span style={{ color: season.color }}>szn.</span>
          </h1>
          <p style={{
            fontFamily: pp, fontSize: 20, fontWeight: 800, color: "#fff",
            marginBottom: 12,
          }}>
            {season.vibe}
          </p>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: season.color,
          }}>
            {season.theme}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <p style={{ fontSize: 17, lineHeight: 2.0, color: "var(--dark)" }}>
            {season.intro}
          </p>
        </div>
      </section>

      {/* What we cover */}
      <section className="px-8 py-16 md:py-24" style={{ background: season.bg, borderTop: "var(--border)", borderBottom: "var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="tag mb-6 text-center">inside {season.name.toLowerCase()} szn</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800,
            letterSpacing: "-1px", lineHeight: 1.15, textAlign: "center", marginBottom: 32,
          }}>
            What we cover in the <span style={{ color: season.color }}>{season.name} szn</span> workshop.
          </h2>

          <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--dark)", marginBottom: 28 }}>
            {season.workshop}
          </p>

          <div className="p-6 md:p-8" style={{ background: "#fff", border: "var(--border)" }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {season.bullets.map((b) => (
                <li key={b} style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", marginBottom: 8 }}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Affirmation */}
      <section className="px-8 py-16 md:py-20 text-center" style={{ background: "var(--dark)" }}>
        <div className="max-w-2xl mx-auto">
          <p style={{
            fontFamily: pp, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.3, letterSpacing: "-0.5px",
          }}>
            &ldquo;{season.affirmation}&rdquo;
          </p>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="px-8 py-16 md:py-24 text-center" style={{ background: "var(--pink-light)", borderBottom: "var(--border)" }}>
        <div className="max-w-xl mx-auto">
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--pink)", marginBottom: 20,
          }}>
            founding members
          </div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800,
            letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 16,
          }}>
            Experience {season.name} szn inside <span className="pk">MY SZN.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--dark)", maxWidth: 420, margin: "0 auto 28px" }}>
            Join the waitlist for early access. Founding member pricing. Limited spaces.
          </p>
          <div className="flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Browse other seasons */}
      <section className="px-8 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="tag mb-6 text-center">explore every season</div>
          <h2 style={{
            fontFamily: pp, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800,
            letterSpacing: "-0.8px", lineHeight: 1.15, textAlign: "center", marginBottom: 32,
          }}>
            Every season has something to <span className="pk">teach you.</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {allSeasons.map(([key, s]) => (
              <Link
                key={key}
                href={`/seasons/${key}`}
                className="no-underline"
                style={{
                  display: "block", padding: 12, textAlign: "center",
                  background: slug === key ? "var(--dark)" : s.bg,
                  border: "var(--border)",
                  transition: "opacity 0.15s",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: slug === key ? "#fff" : "var(--dark)", marginBottom: 2,
                }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11, color: slug === key ? "var(--pink)" : s.color, fontWeight: 600 }}>
                  {s.theme}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
