import type { Metadata } from "next";
import { OfferHero, Band, Tiles, ForYouIf, OfferCards, Cover } from "@/components/Offer";
import { RBR_REVIEWS } from "@/lib/report-reviews";

// Rich B*tch Rising: the personalised money report (the Money Blueprint, renamed and repriced to
// $88, Oct 2026). On sale from 29 Oct 2026, made by hand within 48 hours; /money-blueprint redirects here.

export const metadata: Metadata = {
  title: "Rich B*tch Rising, Your Personalised Astrology Money Report",
  description:
    "Rich B*tch Rising is your personalised astrology money report: wealth, earning potential, money blocks, financial independence and self-worth, read from your own birth chart. $88, in your inbox within 48 hours.",
  alternates: { canonical: "/reports/rich-btch-rising" },
  openGraph: {
    title: "Rich B*tch Rising 💸",
    description: "What your birth chart says about getting PAID. Your personalised money report, in your inbox within 48 hours.",
    url: "/reports/rich-btch-rising",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

// Stripe Payment Link (plink_1UVxdoJ6s9fRhiJo4QetRK8i). Birth details are collected on the checkout page;
// the webhook files the buyer on the Brevo "💸 Rich B*tch Rising PAID" list and sends the 48-hour email
// (src/lib/email/bad-btch-report.ts handles both reports).
const BUY_URL = "https://buy.stripe.com/bJe3cwf2TaDZalY5KJ7kc0J";

// Betty's own Rich B*tch Rising copy (15 Oct 2026), used word for word.

const SECTIONS = [
  {
    emoji: "💰",
    title: "01. How you're built to make money",
    body: [
      "Your second house, tenth house, Venus, Jupiter and other relevant placements offer fascinating insights into your natural talents, earning preferences, ambitions and relationship with success.",
      "We're exploring the kind of work that suits you, how you approach opportunities, where you might be undervaluing your gifts and how to make earning money feel more aligned with who you actually are.",
      "Because being talented is lovely, but we'd quite like to get PAID for it too.",
    ],
  },
  {
    emoji: "🌑",
    title: "02. Your money shadow",
    body: [
      "Ohhhh, we're going THERE.",
      "The family money stories, inherited fears, good-girl conditioning, guilt, shame and unconscious patterns that influence how you earn, spend, save and receive.",
      "We'll look at how your chart reflects your relationship with control, security, vulnerability and power, particularly where money brings out some of your most complicated emotions.",
      "Expect personal shadow work prompts that help you examine the beliefs you've been carrying around for years.",
      "Some of those beliefs have had more than enough access to your bank account.",
    ],
  },
  {
    emoji: "👑",
    title: "03. Self-worth, receiving + being THAT woman",
    body: [
      "Your relationship with money often reveals a great deal about how comfortable you feel asking for what you want, taking up space and being seen.",
      "We're exploring your Venus placement, relevant house themes and other aspects of your chart to understand where you might be overgiving, undercharging, people-pleasing or making yourself smaller to keep everybody else comfortable.",
      "This is your invitation to become a woman who's comfortable being successful, well-paid, ambitious and VERY pleased with herself.",
    ],
  },
  {
    emoji: "🔥",
    title: "04. Money, power + financial independence",
    body: [
      "Your eighth house explores themes of shared resources, intimacy, trust, dependency and power, which can bring up some incredibly revealing questions about your relationship with financial independence.",
      "We're looking at the dynamics that influence how you share money, negotiate, establish boundaries and navigate financial relationships.",
      "Because every woman deserves the freedom to make choices about her own life.",
      "Especially the choice to tell someone to F*CK RIGHT OFF when necessary.",
    ],
  },
  {
    emoji: "🪩",
    title: "05. Your rich b*tch era starts here",
    body: [
      "We're taking everything we've uncovered and bringing it into your actual life.",
      "You'll receive personalised money manifestation practices, shadow work prompts, affirmations and practical suggestions based on your chart.",
      "Things you can try, habits you can examine, conversations you can have and decisions you can start making differently.",
      "Because reading about how wealthy you could become is great fun, but doing something with that information is even better.",
    ],
  },
];

export default function RichBtchRisingPage() {
  return (
    <>
      <OfferHero
        offer="rich-btch-rising"
        ctaHref={BUY_URL}
        art={<Cover kind="rich-btch-rising" />}
        kicker="rich b*tch rising"
        title="you were born to be"
        accent="a rich b*tch."
        intro={
          <>
            <p style={{ fontFamily: pp, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Now let&apos;s read the F*CKING instructions.</p>
            <p>Your birth chart has A LOT to say about your money, your ambition, your self-worth, your relationship with success and the reasons you might be making life considerably harder for yourself than it needs to be.</p>
          </>
        }
      />

      <Band tag="welcome to rich b*tch rising" title="the most delicious" accent="kind of freedom.">
        <p>We&apos;re talking about the talents you could be making money from, the beliefs you&apos;ve inherited about wealth, your relationship with receiving, the ways you sabotage your own success and the kind of financial freedom that makes you want to throw your hands in the air and scream THANK F*CK FOR THAT.</p>
        <p>Because having your OWN money is one of the most delicious forms of freedom a woman can experience.</p>
        <p>Money to leave situations that make you miserable, book flights whenever you fancy, build a business, take care of people you love, buy yourself ridiculous things and make decisions without needing anybody&apos;s permission.</p>
        <p><strong>Welcome to Rich B*tch Rising, your personalised astrology, shadow work and money manifestation report.</strong></p>
        <p>Written specifically for YOU, using your actual birth chart, with insights, exercises and practical guidance to help you understand your relationship with money and start changing it.</p>
        <p><strong>$88 USD | Personalised to your birth chart | In your inbox within 48 hours</strong></p>
        <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="no-underline btn-pink" style={{ display: "inline-block", marginTop: 12, background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px" }}>
          💸 get my report
        </a>
      </Band>

      <Band tone="lav" tag="your money backstory" title="your money has a whole" accent="backstory, babe.">
        <p>You&apos;ve inherited ideas about money from your family, absorbed expectations about what women should earn and learned all sorts of interesting things about whether it&apos;s acceptable to want more.</p>
        <p>Maybe you were taught that wanting money makes you greedy, that good women put everybody else first or that you should be grateful for whatever somebody decides to pay you.</p>
        <p>Perhaps you&apos;re absolutely brilliant at what you do but still feel physically uncomfortable naming your prices.</p>
        <p>Or you make money easily and somehow find equally creative ways to get rid of it.</p>
        <p>Your birth chart gives us a way to explore those patterns, understand your natural strengths and look at the relationship between your money, your self-worth and your personal power.</p>
        <p><strong>We&apos;re getting into ALL OF IT.</strong></p>
      </Band>

      <Band tag="here's what we're getting into 💸" title="here's what we're" accent="getting into.">
        <Tiles
          items={SECTIONS.map((x) => ({
            emoji: x.emoji,
            title: x.title,
            body: (
              <>
                {x.body.map((t, i) => (
                  <p key={i} style={{ margin: i === x.body.length - 1 ? 0 : "0 0 10px" }}>{t}</p>
                ))}
              </>
            ),
          }))}
        />
      </Band>

      <Band tone="pinkLight" tag="this is for you" title="for the woman who's done being" accent="broke + polite.">
        <p>You&apos;re talented, ambitious and fully aware that you&apos;re capable of making more money, but you keep finding yourself caught in the same frustrating patterns.</p>
        <p>You&apos;ve spent years being encouraged to be grateful, reasonable, accommodating and easy to deal with, and you&apos;re starting to suspect that some of those lovely qualities are costing you a F*CKING FORTUNE.</p>
        <p>You want to understand your relationship with wealth, feel more confident about earning and receiving, and stop treating financial independence like some outrageous dream reserved for other people.</p>
        <p>You love astrology, you&apos;re interested in shadow work and manifestation, and you want to use those tools to make meaningful changes in your everyday life.</p>
        <p>Plus, you have excellent taste and would quite like the bank balance to support it.</p>
        <p><strong>Welcome. You&apos;re among friends. 💜</strong></p>
      </Band>

      <Band tone="lav" tag="imagine" title="imagine what changes when you start" accent="understanding yourself.">
        <ForYouIf
          items={[
            "You recognise the beliefs that have been influencing your financial decisions for years.",
            "You understand your natural strengths and feel more confident exploring ways to earn from them.",
            "You become more comfortable discussing money, setting boundaries, negotiating and asking to be paid what your work is worth.",
            "You start making choices based on the life you want to create instead of the expectations you've inherited.",
            "You have practical exercises you can return to whenever old fears, money patterns or self-doubt show up.",
          ]}
        />
        <p style={{ marginTop: 22 }}><strong>Most importantly, you give yourself permission to want a life filled with freedom, security, pleasure, adventure and a frankly UNREASONABLE amount of happiness.</strong></p>
        <p>Because you deserve to enjoy the money you make as much as you enjoy making it.</p>
      </Band>

      <section className="px-5 md:px-8" style={{ background: "var(--lav-light)", borderBottom: "var(--border)", paddingTop: 76, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-5"><span className="holo-sticker" style={{ transform: "rotate(-2deg)" }}>✦ the reviews</span></div>
          <h2 className="display" style={{ fontSize: "clamp(32px, 5.5vw, 62px)", color: "var(--dark)", lineHeight: 1 }}>
            the rich b*tches <span className="pk">have spoken. 💸</span>
          </h2>
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-5 -mx-5 px-5 md:mx-0 md:px-0" style={{ marginTop: 30, paddingBottom: 6, scrollbarWidth: "none" }}>
            {RBR_REVIEWS.map((r) => (
              <figure key={r.name} className="holo-edge snap-start shrink-0 w-[84%] md:w-auto" style={{ margin: 0, background: "#fff", border: "var(--border)", borderRadius: 18, padding: "22px 22px 24px", display: "flex", flexDirection: "column", color: "var(--dark)" }}>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 44, lineHeight: 0.6, color: "var(--pink)" }}>&ldquo;</div>
                <div style={{ fontFamily: pp, fontWeight: 800, fontSize: 19, lineHeight: 1.3, marginTop: 12 }}>{r.head}</div>
                <blockquote style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65 }}>{r.body}</blockquote>
                <figcaption style={{ marginTop: "auto", paddingTop: 16, fontFamily: pp, fontWeight: 800, fontSize: 15 }}>
                  {r.name} <span style={{ fontWeight: 600 }}>| {r.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="buy" className="px-5 md:px-8 bg-glitter" style={{ paddingTop: 84, paddingBottom: 92, borderBottom: "var(--border)", scrollMarginTop: 80 }}>
        <span id="waitlist" style={{ position: "relative", top: -80 }} />
        <div className="max-w-3xl mx-auto" style={{ color: "#fff" }}>
          <h2 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", lineHeight: 0.98 }}>
            your rich b*tch era <span className="pk">starts NOW. 💸</span>
          </h2>
          <div style={{ fontSize: 17, lineHeight: 1.75, marginTop: 22, fontWeight: 500 }}>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Your rich b*tch era has entered the chat.</p>
            <p style={{ margin: "0 0 14px" }}>Rich B*tch Rising is a personalised money astrology report created around your individual birth chart, with astrology insights, money shadow work, manifestation exercises and practical guidance.</p>
            <p style={{ margin: "0 0 14px" }}>No generic zodiac predictions. No copy-and-paste advice telling every Libra to buy something pink or every Capricorn to work harder.</p>
            <p style={{ margin: "0 0 14px" }}>We&apos;re looking at YOUR placements, YOUR patterns, YOUR relationship with money and the life YOU want to create.</p>
            <p style={{ margin: 0, color: "#fff", fontWeight: 800 }}>May your bank account be abundant, your boundaries be impeccable and your ambitions be absolutely F*CKING OUTRAGEOUS. 💸💜🪩✨</p>
          </div>
          <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 30 }}>
            <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="no-underline btn-pink" style={{ background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "22px 46px", display: "inline-block", border: "2px solid #fff" }}>
              get my report
            </a>
            <span style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, color: "#fff" }}>$88 · in your inbox within 48 hours</span>
          </div>
        </div>
      </section>

      <OfferCards exclude="rich-btch-rising" />
    </>
  );
}
