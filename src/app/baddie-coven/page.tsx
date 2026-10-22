import type { Metadata } from "next";
import QuoteStrip from "@/components/QuoteStrip";
import { OfferHero, WaitlistBand, OfferCards, HeroArt } from "@/components/Offer";
import CovenExplorer from "@/components/CovenExplorer";

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

// Every picture on the page lives here, so swapping in new photos is a one-line change per slot.
// Drop new files in /public/coven/ and point the slot at them.
const PICS = {
  welcome: "/hero-collage.png",
  creative: "/astrology-journaling.png",
  astrology: "/cosmic-planet.png",
  money: "/cosmic-money.png",
  witchy: "/eclipse-moon.png",
  shadow: "/libra-moon.png",
  people: "/hero-cutout.png",
  club: "/disco-planet.png",
};

// Betty's own Baddie Coven copy (15 Oct 2026), used word for word.

const SECTIONS = [
  {
    "emoji": "🎨",
    "img": PICS.creative,
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
    "img": PICS.astrology,
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
    "img": PICS.money,
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
    "img": PICS.witchy,
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
    "img": PICS.shadow,
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
    "img": PICS.people,
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

const wrap = "max-w-6xl mx-auto";
const h2 = { fontSize: "clamp(32px, 5vw, 58px)", color: "var(--dark)", lineHeight: 1 } as const;
const copy = { fontSize: 16.5, lineHeight: 1.7, margin: "0 0 14px", color: "var(--dark)" } as const;
const card = { border: "var(--border)", borderRadius: 18, background: "#fff", padding: "20px 20px 22px", color: "var(--dark)" } as const;
const cta = { display: "inline-block", background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px" } as const;

function Section({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <section className="px-5 md:px-8" style={{ background: bg, borderBottom: "var(--border)", paddingTop: 72, paddingBottom: 76 }}>
      <div className={wrap}>{children}</div>
    </section>
  );
}

function Statement({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "pink" }) {
  return (
    <div style={{ marginTop: 28, border: "var(--border)", borderRadius: 18, background: tone === "dark" ? "var(--dark)" : "var(--pink)", color: "#fff", padding: "22px 24px", fontFamily: pp, fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 800, lineHeight: 1.3 }}>
      {children}
    </div>
  );
}

export default function BaddieCovenPage() {
  return (
    <>
      <OfferHero
        offer="baddie-coven"
        art={<HeroArt src="/disco-planet.png" />}
        tone="lav"
        kicker="the baddie coven"
        titleSize="clamp(38px, 5.6vw, 72px)"
        title="stop hiding from the f*cking world."
        accent="IT'S TIME TO BECOME ALL OF YOU."
        intro={
          <p>More magic. More money. More confidence. More creativity. More freedom. More of your most unapologetic self.</p>
        }
      />

      {/* Welcome: the pitch beside a picture, the turn as a banner, then what we do as a card grid. */}
      <Section bg="#fff">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <div className="tag mb-5">welcome to the baddie coven</div>
            <h2 className="display" style={h2}>your very own <span className="pk">magical clubhouse.</span></h2>
            <p style={{ ...copy, marginTop: 22, fontWeight: 700, fontSize: 18 }}>Welcome to Baddie Coven, your very own magical clubhouse for women who are ready to reclaim their power, embrace their magic and create the most extraordinary lives imaginable.</p>
            <p style={copy}>You&apos;ve spent enough of your life making yourself smaller, questioning your intuition, hiding your gifts, worrying what people think and putting your biggest dreams on hold while you try to become the woman everyone else expects you to be.</p>
            <a href="#waitlist" className="no-underline" style={{ ...cta, marginTop: 8 }}>💜 join the coven waitlist</a>
          </div>
          <div style={{ border: "var(--border)", borderRadius: 22, overflow: "hidden", background: "var(--lav)", boxShadow: "8px 8px 0 var(--dark)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PICS.welcome} alt="" aria-hidden="true" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>
        <Statement tone="pink">F*CK THAT. WE&apos;VE GOT BIGGER PLANS FOR YOU. 🔥</Statement>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4" style={{ marginTop: 20 }}>
          {[
            ["🔮", "We're bringing together astrology, Human Design, manifestation, shadow work, creativity, witchcraft and a fabulous community of women to help you discover your unique soul blueprint and become MORE of who you truly are."],
            ["🪐", "We're talking about understanding your cosmic gifts, healing the patterns that keep you playing small, expressing yourself without apology, making your own money, trusting your intuition and creating a life that makes you ridiculously excited to wake up every morning."],
            ["🎀", "The kind of life where you're following your wildest ideas, doing things that scare you in the best possible way, exploring your creativity, making incredible friends and finally giving yourself permission to want absolutely EVERYTHING."],
            ["🕯️", "Inside the coven, we'll be working with astrology, manifestation, money magic, rituals, creative workshops and shadow work to help you bring more of yourself into every area of your life."],
            ["🦄", "You'll get to explore the witchy things you've always been curious about, reconnect with the parts of yourself you've kept hidden and surround yourself with women who celebrate your ambition, your weirdness, your magic and your biggest dreams."],
          ].map(([e, t], i) => (
            <div key={e} className={i < 3 ? "md:col-span-2" : "md:col-span-3"} style={{ ...card, background: "var(--pink-light)" }}>
              <div style={{ fontSize: 28 }}>{e}</div>
              <p style={{ ...copy, fontSize: 15.5, margin: "10px 0 0" }}>{t}</p>
            </div>
          ))}
        </div>
        <Statement>Your inner child, teenage witch and future rich b*tch are ALL invited. ✨</Statement>
      </Section>

      {/* Why: the story on the left, the turn ("we're bringing it all back") on the right. */}
      <Section bg="var(--pink-light)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="tag mb-5">a little witchcraft. a lot of audacity.</div>
            <h2 className="display" style={h2}>absolutely fabulous <span className="pk">women.</span></h2>
            <p style={{ ...copy, marginTop: 22 }}>Somewhere between growing up, working, paying bills, managing relationships and trying to become functioning adults, far too many women stopped making time for the things that made them feel alive.</p>
            <p style={copy}>The art projects. The secret clubs. The notebooks filled with impossible dreams. The fascination with crystals, mythology, the moon, tarot cards and all the wonderfully strange things that made the world feel magical.</p>
          </div>
          <div style={{ ...card, padding: "26px 26px 24px", boxShadow: "8px 8px 0 var(--dark)" }}>
            <div className="display" style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: 1 }}>Well, we&apos;re bringing <span className="pk">ALL OF IT BACK.</span></div>
            <p style={{ ...copy, marginTop: 18 }}>We&apos;re creating a space where you can explore whatever interests you, make friends who share your passions and spend time doing things purely because they make you happy.</p>
            <p style={copy}>You can be a serious businesswoman who casts spells, an astrologer who loves fashion, a creative who wants to make more money, or a complete beginner who bought her first tarot deck last Tuesday.</p>
            <p style={{ ...copy, margin: 0 }}>There&apos;s room for your ambition, your imagination, your weirdness, your vulnerability and all the different versions of yourself you&apos;re still getting to know.</p>
          </div>
        </div>
        <Statement tone="pink">Basically, this is the club we all deserved when we were little, with considerably better conversations about sex, money and power.</Statement>
      </Section>

      {/* What we do: six themes as one tabbed panel. */}
      <Section bg="#fff">
        <div className="tag mb-5">inside the coven 🪄</div>
        <h2 className="display" style={h2}>soooo, what are we <span className="pk">doing in here.</span></h2>
        <CovenExplorer items={SECTIONS} />
      </Section>

      {/* More life: the case on the left, the "you deserve" lines stacked as cards on the right. */}
      <Section bg="var(--lav-light)">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <div className="tag mb-5">so much more life to live</div>
            <h2 className="display" style={h2}>being a grown woman should be a <span className="pk">LOT more fun than this.</span></h2>
            <p style={{ ...copy, marginTop: 22 }}>We spend so much of our lives trying to improve ourselves, fix our perceived flaws, achieve the next milestone and become the kind of women the world tells us we should be.</p>
            <p className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.1, margin: "6px 0 18px", color: "var(--pink)" }}>Meanwhile, our actual lives are happening.</p>
            <p style={copy}>We could be learning tarot, creating art, celebrating the moon, making new friends, discovering ridiculous new hobbies, dressing up for absolutely no reason and having experiences that make ordinary Tuesdays feel extraordinary.</p>
          </div>
          <div className="grid gap-3">
            {[
              "You deserve a life with room for pleasure, play, creativity, friendship and all the beautifully unnecessary things that make being alive such a F*CKING TREAT.",
              "You deserve to have interests that don't need to become businesses.",
              "To make something without worrying whether it's good enough.",
              "To spend an evening talking about witchcraft with women who don't look at you like you've grown a second head.",
              "To take your dreams seriously while refusing to take yourself seriously ALL THE TIME.",
            ].map((t) => (
              <div key={t} style={{ ...card, padding: "16px 18px", fontWeight: 700, fontSize: 15.5, lineHeight: 1.55 }}>
                <span className="pk">✦ </span>{t}
              </div>
            ))}
          </div>
        </div>
        <Statement>We have SO MUCH MORE LIFE TO LIVE, witches. 🪩</Statement>
      </Section>

      {/* Fit: seven cards, the eighth cell is the invitation. */}
      <Section bg="var(--pink-light)">
        <div className="tag mb-5">you&apos;ll fit right in if</div>
        <h2 className="display" style={h2}>you&apos;ll fit right <span className="pk">in if...</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginTop: 32 }}>
          {FIT.map((f) => {
            const [emoji, ...rest] = f.split(" ");
            return (
              <div key={f} style={card}>
                <div style={{ fontSize: 30 }}>{emoji}</div>
                <p style={{ ...copy, fontSize: 15, fontWeight: 600, margin: "10px 0 0" }}>{rest.join(" ")}</p>
              </div>
            );
          })}
          <a href="#waitlist" className="no-underline flex flex-col justify-between" style={{ ...card, background: "var(--dark)", color: "#fff", gap: 18 }}>
            <span style={{ fontFamily: pp, fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>If you&apos;ve ever wished you had your own little coven of magical women, you&apos;ve found your invitation.</span>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pink)" }}>join the waitlist →</span>
          </a>
        </div>
      </Section>

      <QuoteStrip ids={["aisha", "priya", "lauren"]} label="a few words from the my szn universe 💖" />
      <p className="text-center" style={{ fontSize: 13, fontStyle: "italic", color: "var(--grey)", background: "#fff", padding: "0 20px 28px", margin: 0 }}>
        These are experiences shared by MY SZN members, giving you a taste of the community we&apos;re building.
      </p>

      {/* The club: heading and picture on the left, the monthly picture on the right. */}
      <Section bg="#fff">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="tag mb-5">the magical girls&apos; club</div>
            <h2 className="display" style={h2}>your membership to the magical girls&apos; club <span className="pk">starts here.</span></h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PICS.club} alt="" aria-hidden="true" className="hidden md:block" style={{ width: 240, height: "auto", marginTop: 24 }} />
          </div>
          <div>
            <p style={copy}>Imagine opening your calendar each month and finding creative workshops, witchy gatherings, astrology explorations, rituals and opportunities to spend time with women who share your interests.</p>
            <p style={copy}>A little pocket of magic in the middle of your everyday life.</p>
            <p style={copy}>A reason to try something new, make something wonderful, celebrate yourself and connect with women around the world.</p>
            <p style={copy}>A place where the ambitious woman, the artist, the witch, the dreamer, the feminist, the occasional emotional wreck and the absolute menace to societal expectations can all exist in the same person.</p>
            <p className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.1, margin: "4px 0 18px" }}>Because you get to be <span className="pk">ALL OF HER.</span></p>
            <p style={{ ...copy, margin: 0 }}>The Baddie Coven is currently waitlist-only, and the women on our list get first access to opening dates, membership details and everything we&apos;re putting together.</p>
          </div>
        </div>
      </Section>

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
