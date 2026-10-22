import type { Metadata } from "next";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferHero, Band, Tiles, WaitlistBand, OfferCards, HeroArt } from "@/components/Offer";

// The Baddie Coven: the ongoing creative, cosmic membership (what the MY SZN membership becomes,
// Oct 2026). Waitlist only, no price or start date confirmed; /membership redirects here.

export const metadata: Metadata = {
  title: "The Baddie Coven, a Creative Cosmic Membership for Women",
  description:
    "The Baddie Coven is MY SZN's creative, cosmic membership: monthly creative classes, astrology, manifestation, rituals, witchcraft and a community of women bringing more magic into everyday life. Join the waitlist.",
  alternates: { canonical: "/baddie-coven" },
  openGraph: {
    title: "The Baddie Coven 🦄",
    description: "A magical creative clubhouse for women: classes, astrology, rituals, witchcraft and your girls. Waitlist open now.",
    url: "/baddie-coven",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

// Betty's own Baddie Coven copy (15 Oct 2026), used word for word.

const SECTIONS = [
  {
    "emoji": "🎨",
    "title": "01. Getting our hands dirty with creative magic",
    "body": [
      "Monthly creative classes designed to bring back that delicious feeling of making something simply because YOU WANT TO.",
      "Think vision boards, spell jars, magical art, journaling, beautiful handmade objects, creative rituals and experimenting with new ways to express yourself.",
      "You don't need to be an artist, have expensive supplies or produce anything remotely Instagram-worthy.",
      "We're here to play, make beautiful messes, try new things and remember that creativity belongs to EVERYBODY.",
      "Perfectionism can stay outside with the patriarchy."
    ]
  },
  {
    "emoji": "🪐",
    "title": "02. Becoming the women who actually understand their astrology",
    "body": [
      "We're exploring your birth chart, planetary transits, houses, retrogrades, lunar cycles and all the wonderfully complicated astrological influences that make you YOU.",
      "You'll learn how to work with the astrology of each month, explore your personal placements and understand how different planetary themes show up in your life.",
      "Expect birth chart discussions, astrological experiments, personalised reflection prompts and some very enthusiastic conversations about why Venus in Scorpio has everybody examining their entire romantic history.",
      "Your group chat is about to become considerably more interesting."
    ]
  },
  {
    "emoji": "💸",
    "title": "03. Making money magic",
    "body": [
      "Money bowls. Prosperity rituals. Manifestation experiments. Wealth affirmations. Exploring abundance through astrology.",
      "We're getting into all the magical ways women have worked with intention, ritual and symbolism, while also looking at the very real beliefs and habits influencing our financial lives.",
      "Because we want our own money, our own choices, fabulous experiences and the freedom to build lives that feel completely ours.",
      "You can love a good money spell AND send the invoice, negotiate your salary, start investing or finally put your prices up.",
      "We LOVE a witch with financial independence."
    ]
  },
  {
    "emoji": "🕯️",
    "title": "04. Getting witchy AF",
    "body": [
      "Moon rituals, tarot, candle magic, spellwork, crystals, seasonal celebrations, intention setting and a healthy appreciation for the wonderfully strange.",
      "We'll explore different magical practices, their histories, their symbolism and how to create rituals that feel meaningful to you.",
      "Some months might involve a beautiful New Moon ritual, while others might involve a full-on witchcraft workshop or an evening dedicated to exploring an entirely new practice.",
      "Bring your curiosity, your favourite notebook and that candle you've been saving for a special occasion.",
      "This IS the special occasion."
    ]
  },
  {
    "emoji": "🌑",
    "title": "05. Meeting your shadow and loving the woman underneath",
    "body": [
      "We're also exploring the deeper parts of ourselves through shadow work, astrology, journaling, self-reflection and conversations about confidence, self-worth, boundaries, relationships and personal power.",
      "The parts you've been encouraged to hide. The desires you've talked yourself out of. The beliefs you inherited without ever getting a vote.",
      "We'll look at the good-girl conditioning that has influenced generations of women and create space to examine the versions of ourselves we've been performing for other people.",
      "Expect a little emotional excavation, plenty of self-compassion and the occasional extremely satisfying revelation."
    ]
  },
  {
    "emoji": "🪩",
    "title": "06. Finding your F*CKING PEOPLE",
    "body": [
      "Imagine being able to tell a group of women that you've just manifested a new client, pulled the Tower card three times in a week, booked a solo adventure or decided to completely reinvent your life.",
      "They celebrate with you, share their own experiences and encourage you to keep going.",
      "The Baddie Coven is a place for conversations, creativity, laughter, connection and women who genuinely want to see each other happy.",
      "You can share your latest project, ask about your astrology, celebrate a breakthrough, recommend a book or simply enjoy having women around who understand your particular brand of weird.",
      "More friendship. More magic. More women cheering for women."
    ]
  }
];

const FIT = [
  "💜 Your idea of a fabulous evening involves tarot cards, a creative project, delicious snacks and women who make you laugh until your face hurts.",
  "🦄 You believe women deserve their own money, independence, pleasure, ambitions and whatever wonderfully unconventional lives they want to create.",
  "🪐 You're obsessed with astrology, fascinated by witchcraft or simply curious about exploring something new.",
  "🎨 You've been craving more creativity, colour, imagination and things that make you feel like a kid again.",
  "🌑 You're interested in shadow work, self-discovery and understanding the parts of yourself you've spent years trying to keep hidden.",
  "💸 You want to explore money manifestation, work on your relationship with receiving and celebrate women who are building financial independence.",
  "🪩 You've been looking for a group of women who are ambitious, compassionate, creative, interesting and just the right amount of F*CKING UNHINGED."
];

export default function BaddieCovenPage() {
  return (
    <>
      <OfferHero
        offer="baddie-coven"
        art={<HeroArt src="/disco-planet.png" />}
        tone="lav"
        kicker="the baddie coven"
        title="your childhood dream of joining a secret witch club just got"
        accent="VERY F*CKING REAL."
        intro={
          <p>Except now we&apos;re grown women with our own money, complicated birth charts, excellent taste, ambitious dreams and absolutely no intention of behaving ourselves.</p>
        }
      />

      <Band tag="welcome to the baddie coven" title="your very own" accent="magical clubhouse.">
        <p><strong>Welcome to The Baddie Coven, your very own magical clubhouse for women who want more astrology, witchcraft, manifestation, creativity, friendship and ridiculous amounts of FUN in their everyday lives.</strong></p>
        <p>Imagine having a group of women to cast money spells with, celebrate your wins, dissect your birth chart, make beautiful things, share your latest manifestations and discuss everything from your Saturn return to the audacity of the patriarchy.</p>
        <p>We&apos;re bringing back the pure joy of making things, believing in magic, having hobbies, learning something simply because it interests you and staying up far too late talking to your friends.</p>
        <p>Only this time, we&apos;re also manifesting financial independence, healing our money wounds, examining our shadows and becoming the most gloriously self-possessed versions of ourselves.</p>
        <p><strong>Your inner child, teenage witch and future rich b*tch are ALL invited.</strong></p>
        <a href="#waitlist" className="no-underline" style={{ display: "inline-block", marginTop: 12, background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px" }}>
          💜 join the coven waitlist
        </a>
      </Band>

      <Band tone="pinkLight" tag="a little witchcraft. a lot of audacity." title="absolutely fabulous" accent="women.">
        <p>Somewhere between growing up, working, paying bills, managing relationships and trying to become functioning adults, far too many women stopped making time for the things that made them feel alive.</p>
        <p>The art projects. The secret clubs. The notebooks filled with impossible dreams. The fascination with crystals, mythology, the moon, tarot cards and all the wonderfully strange things that made the world feel magical.</p>
        <p><strong>Well, we&apos;re bringing ALL OF IT BACK.</strong></p>
        <p>We&apos;re creating a space where you can explore whatever interests you, make friends who share your passions and spend time doing things purely because they make you happy.</p>
        <p>You can be a serious businesswoman who casts spells, an astrologer who loves fashion, a creative who wants to make more money, or a complete beginner who bought her first tarot deck last Tuesday.</p>
        <p>There&apos;s room for your ambition, your imagination, your weirdness, your vulnerability and all the different versions of yourself you&apos;re still getting to know.</p>
        <p><strong>Basically, this is the club we all deserved when we were little, with considerably better conversations about sex, money and power.</strong></p>
      </Band>

      <Band wide tag="inside the coven 🪄" title="soooo, what are we" accent="doing in here.">
        <Tiles
          items={SECTIONS.map((x) => ({
            emoji: x.emoji,
            title: x.title,
            body: (
              <>
                {x.body.map((t, i) => (
                  <p key={i} style={{ margin: i === x.body.length - 1 ? 0 : "0 0 10px", fontWeight: i === x.body.length - 1 ? 700 : undefined }}>{t}</p>
                ))}
              </>
            ),
          }))}
        />
      </Band>

      <Band tone="lav" tag="so much more life to live" title="being a grown woman should be a" accent="LOT more fun than this.">
        <p>We spend so much of our lives trying to improve ourselves, fix our perceived flaws, achieve the next milestone and become the kind of women the world tells us we should be.</p>
        <p>Meanwhile, our actual lives are happening.</p>
        <p>We could be learning tarot, creating art, celebrating the moon, making new friends, discovering ridiculous new hobbies, dressing up for absolutely no reason and having experiences that make ordinary Tuesdays feel extraordinary.</p>
        <p>You deserve a life with room for pleasure, play, creativity, friendship and all the beautifully unnecessary things that make being alive such a F*CKING TREAT.</p>
        <p>You deserve to have interests that don&apos;t need to become businesses.</p>
        <p>To make something without worrying whether it&apos;s good enough.</p>
        <p>To spend an evening talking about witchcraft with women who don&apos;t look at you like you&apos;ve grown a second head.</p>
        <p>To take your dreams seriously while refusing to take yourself seriously ALL THE TIME.</p>
        <p><strong>We have SO MUCH MORE LIFE TO LIVE, witches.</strong></p>
      </Band>

      <Band tone="pinkLight" tag="you'll fit right in if" title="you'll fit right" accent="in if...">
        <ul style={{ listStyle: "none", padding: 0, margin: "26px 0 0", display: "grid", gap: 14 }}>
          {FIT.map((f) => <li key={f} style={{ fontSize: 16.5, lineHeight: 1.6, fontWeight: 600 }}>{f}</li>)}
        </ul>
        <p style={{ marginTop: 24 }}><strong>If you&apos;ve ever wished you had your own little coven of magical women, you&apos;ve found your invitation.</strong></p>
      </Band>

      <QuoteStrip ids={["aisha", "priya", "lauren"]} label="a few words from the my szn universe 💖" />
      <p className="text-center" style={{ fontSize: 13, fontStyle: "italic", color: "var(--grey)", background: "#fff", padding: "0 20px 28px", margin: 0 }}>
        These are experiences shared by MY SZN members, giving you a taste of the community we&apos;re building.
      </p>

      <Band tag="the magical girls' club" title="your membership to the magical girls' club" accent="starts here.">
        <p>Imagine opening your calendar each month and finding creative workshops, witchy gatherings, astrology explorations, rituals and opportunities to spend time with women who share your interests.</p>
        <p>A little pocket of magic in the middle of your everyday life.</p>
        <p>A reason to try something new, make something wonderful, celebrate yourself and connect with women around the world.</p>
        <p>A place where the ambitious woman, the artist, the witch, the dreamer, the feminist, the occasional emotional wreck and the absolute menace to societal expectations can all exist in the same person.</p>
        <p><strong>Because you get to be ALL OF HER.</strong></p>
        <p>The Baddie Coven is currently waitlist-only, and the women on our list get first access to opening dates, membership details and everything we&apos;re putting together.</p>
      </Band>

      <WaitlistBand
        offer="baddie-coven"
        title="the coven"
        accent="is calling. 🦄"
        body={
          <>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Put your name in the book, witch.</p>
            <p style={{ margin: "0 0 14px", fontStyle: "italic" }}>No pointy hat required, although fabulous accessories are very much encouraged.</p>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>More magic. More money. More creativity. More friendship. More F*CKING FUN.</p>
            <p style={{ margin: 0 }}>Welcome to your coven. 💜🪩🦄✨</p>
          </>
        }
        question="What kind of magic would you love to explore with us?"
      />

      <OfferCards exclude="baddie-coven" />
    </>
  );
}
