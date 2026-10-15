import type { Metadata } from "next";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferHero, Band, Tiles, ForYouIf, WaitlistBand, OfferCards, Cover } from "@/components/Offer";

// Rich B*tch Rising: the personalised money report (the Money Blueprint, renamed and repriced to
// $88, Oct 2026). Waitlist only until Betty reopens it; /money-blueprint redirects here.

export const metadata: Metadata = {
  title: "Rich B*tch Rising, Your Personalised Astrology Money Report",
  description:
    "Rich B*tch Rising is your personalised astrology money report: wealth, earning potential, money blocks, financial independence and self-worth, read from your own birth chart. $88. Join the waitlist.",
  alternates: { canonical: "/reports/rich-btch-rising" },
  openGraph: {
    title: "Rich B*tch Rising 💸",
    description: "What your birth chart says about getting PAID. Your personalised money report, waitlist open now.",
    url: "/reports/rich-btch-rising",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

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
        <p><strong>$88 USD | Personalised to your birth chart</strong></p>
        <a href="#waitlist" className="no-underline" style={{ display: "inline-block", marginTop: 12, background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px" }}>
          💸 get on the rich list
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

      <QuoteStrip ids={["jade", "maya"]} label="a little rich b*tch energy from our community" />
      <p className="px-5 md:px-8 text-center" style={{ fontSize: 13, fontStyle: "italic", color: "var(--grey)", background: "#fff", padding: "0 20px 28px", margin: 0 }}>
        These are experiences from MY SZN members, rather than reviews of the Rich B*tch Rising report.
      </p>

      <WaitlistBand
        offer="rich-btch-rising"
        title="get on the"
        accent="rich list. 💸"
        body={
          <>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Your rich b*tch era has entered the chat.</p>
            <p style={{ margin: "0 0 14px" }}>Rich B*tch Rising is a personalised money astrology report created around your individual birth chart, with astrology insights, money shadow work, manifestation exercises and practical guidance.</p>
            <p style={{ margin: "0 0 14px" }}>No generic zodiac predictions. No copy-and-paste advice telling every Libra to buy something pink or every Capricorn to work harder.</p>
            <p style={{ margin: "0 0 14px" }}>We&apos;re looking at YOUR placements, YOUR patterns, YOUR relationship with money and the life YOU want to create.</p>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800, fontSize: 20 }}>$88 USD</p>
            <p style={{ margin: "0 0 14px" }}>The report is currently waitlist-only, and everyone on the list gets first access when it launches.</p>
            <p style={{ margin: 0, color: "#fff", fontWeight: 800 }}>May your bank account be abundant, your boundaries be impeccable and your ambitions be absolutely F*CKING OUTRAGEOUS. 💸💜🪩✨</p>
          </>
        }
      />

      <OfferCards exclude="rich-btch-rising" />
    </>
  );
}
