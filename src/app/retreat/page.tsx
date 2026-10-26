import type { Metadata } from "next";
import { OfferHero, Band, Tiles, ForYouIf, WaitlistBand, OfferCards, HeroArt } from "@/components/Offer";

// The Bad B*tch Manifestation Retreat: the in-person experience. Waitlist only. Tulum, January 2027,
// 10 to 15 women and a deposit are confirmed (26 Oct 2026); price and exact dates go to the waitlist first.

export const metadata: Metadata = {
  title: "The Bad B*tch Manifestation Retreat, Tulum, January 2027",
  description:
    "The Bad B*tch Manifestation Retreat is a luxury villa retreat in Tulum, Mexico, for 10 to 15 women in January 2027: astrology, Human Design, somatics, shadow work, manifestation, hypnosis and embodiment. Join the waitlist.",
  alternates: { canonical: "/retreat" },
  openGraph: {
    title: "The Bad B*tch Manifestation Retreat, Tulum 🌴",
    description: "In real life, all of you. Astrology, embodiment, ritual and sisterhood. Waitlist open now.",
    url: "/retreat",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const pp = "var(--font-poppins), Poppins, sans-serif";

// Betty's own retreat copy (15 Oct 2026), used word for word. No location, dates or price: those
// go to the waitlist first.

const MAGIC = [
  {
    emoji: "🌑",
    title: "Meet your shadow. Reclaim your power.",
    body: (
      <>
        <p style={{ margin: "0 0 10px" }}>We&apos;re going DEEP with astrology, shadow work, Black Moon Lilith, hypnosis and powerful rituals that help you understand the parts of yourself you&apos;ve learned to suppress.</p>
        <p style={{ margin: 0 }}>Your anger, your ambition, your desires, your boundaries and your beautifully inconvenient refusal to settle.</p>
      </>
    ),
  },
  {
    emoji: "🔥",
    title: "Fall in love with your body.",
    body: (
      <>
        <p style={{ margin: "0 0 10px" }}>Sensual movement, embodiment, pleasure, dancing and experiences that invite you to explore the extraordinary relationship you have with your own body.</p>
        <p style={{ margin: 0 }}>We&apos;re celebrating the body you&apos;re living in RIGHT NOW, with all its beauty, history, wisdom and delicious individuality.</p>
      </>
    ),
  },
  {
    emoji: "💸",
    title: "Become a woman who wants MORE.",
    body: (
      <>
        <p style={{ margin: "0 0 10px" }}>We&apos;re talking money, freedom, success, visibility, self-worth and the audacity to create a life that makes you want to pinch yourself.</p>
        <p style={{ margin: 0 }}>We&apos;ll explore the beliefs you&apos;ve inherited about what women are allowed to want, earn, experience and become.</p>
      </>
    ),
  },
  {
    emoji: "🪩",
    title: "Play, create, laugh and be ridiculous.",
    body: (
      <>
        <p style={{ margin: "0 0 10px" }}>Because personal transformation can include dressing up, dancing, making art, laughing until your stomach hurts and remembering how much FUN it is to be a woman.</p>
        <p style={{ margin: 0 }}>We&apos;re bringing pleasure, creativity and a healthy amount of chaos into the room.</p>
      </>
    ),
  },
  {
    emoji: "🦄",
    title: "Find your people.",
    body: (
      <>
        <p style={{ margin: "0 0 10px" }}>Beautiful dinners. Conversations that go from astrology to sex to money to childhood wounds to your latest completely unhinged life ambition.</p>
        <p style={{ margin: "0 0 10px" }}>Women who celebrate your wins, respect your vulnerability and encourage you to go after EVERYTHING you want.</p>
        <p style={{ margin: 0 }}>The kind of sisterhood that reminds you just how powerful women become when they genuinely support each other.</p>
      </>
    ),
  },
];

// Placeholder photos until the real retreat shoot exists: Betty's Tulum shots in /public/retreat,
// plus free Unsplash images (hotlinked) for the sisterhood strip.
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=1100&q=75`;

const PLACE_PHOTOS = [
  { src: "/retreat/tulum-1.jpg", alt: "The Tulum ruins above a white sand beach and turquoise sea" },
  { src: "/retreat/tulum-2.jpg", alt: "Clay pots and a floor cushion by a plunge pool in Tulum" },
  { src: "/retreat/tulum-3.jpg", alt: "A white bike under a Follow That Dream street sign in Tulum" },
];

const SISTER_PHOTOS = [
  { src: u("1522543558187-768b6df7c25c"), alt: "Women with their arms around each other" },
  { src: u("1495837174058-628aafc7d610"), alt: "Women dancing with their hands in the air at sunset" },
  { src: u("1504194921103-f8b80cadd5e4"), alt: "A group of women standing together" },
];

function PhotoStrip({ photos }: { photos: { src: string; alt: string }[] }) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "var(--border)" }}>
      {photos.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={p.src} src={p.src} alt={p.alt} loading="lazy" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block" }} />
      ))}
    </section>
  );
}

// The manifesting runs on The Cosmic Co method, in its real order.
const METHOD = [
  { step: "blueprint", body: "Before you even pack, we read your astrology and your Human Design together, so you land knowing exactly what you're here to build in 2027 and how your energy actually likes to get there." },
  { step: "identity", body: "We meet the woman who already has it all, give her a name and a voice, and catch every sneaky little place where you've been shrinking to stay comfortable or liked." },
  { step: "embodiment", body: "Meditation, hypnosis, sensual movement, shadow work and gorgeously witchy rituals, until your nervous system believes the new version of you is safe, normal and SO deserved." },
  { step: "reality", body: "You fly home with a 2027 plan written for your chart, the daily habits to live it and a group of women who will be checking in to make sure you actually do." },
];

// A sample day: Betty confirmed meditations, shadow work, Human Design + astrology, witchy things
// and lots of downtime (26 Oct 2026). The real schedule goes to accepted women.
const DAY = [
  { when: "sunrise", what: "Meditation and slow, sensual movement to wake your body up before your phone gets a look in." },
  { when: "late morning", what: "The big session of the day, whether that's shadow work, a deep dive into your chart or a Human Design workshop on how YOU are built to make decisions and money." },
  { when: "afternoon", what: "Downtime, and LOTS of it. The pool, a book, a nap, a journal or a long lunch with your new favourite women, because integration needs space." },
  { when: "sunset", what: "Witchy hour: candle magic, spell jars, moon work and burning whatever you're done carrying into 2027." },
  { when: "evening", what: "Long, beautiful dinners where the conversation goes everywhere and nobody wants to go to bed." },
];

const DETAILS = [
  { label: "where + when", body: "A luxury villa in Tulum, Mexico, in January 2027, so you walk into the new year already being her. Exact dates go to the waitlist first." },
  { label: "who", body: "10 to 15 women, hand-selected, so the group stays small enough for every single one of you to be seen, heard and properly looked after." },
  { label: "before we fly", body: "Group calls in the run-up to the retreat, so you get to know the other women and arrive already giggling with your new besties." },
  { label: "your spot", body: "A deposit secures your place once you're accepted. Pricing goes to the waitlist first." },
];

function JoinButton({ children }: { children: React.ReactNode }) {
  return (
    <a href="#waitlist" className="no-underline" style={{ display: "inline-block", marginTop: 28, background: "var(--pink)", color: "#fff", fontFamily: pp, fontSize: 15, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "20px 40px" }}>
      {children}
    </a>
  );
}

export default function RetreatPage() {
  return (
    <>
      <OfferHero
        offer="retreat"
        art={<HeroArt src="/cosmic-planet.png" />}
        kicker="tulum, mexico · january 2027 💸🪩"
        title="the bad b*tch"
        accent="manifestation retreat."
        intro={
          <>
          <p>
            Your best life is calling, and she&apos;s ready for you to become the woman who actually LIVES it.
          </p>
          </>
        }
      />

      <PhotoStrip photos={PLACE_PHOTOS} />

      <Band tag="your invitation 💜" title="tulum" accent="is calling.">
        <p>Imagine escaping to a dreamy luxury villa in Tulum, Mexico, surrounded by ambitious, magical, unapologetic women who are ready to make their biggest dreams a reality.</p>
        <p>This is your invitation to stop putting your dream life on a vision board and start f*cking LIVING IT.</p>
        <p>The <strong>Bad B*tch Manifestation Retreat</strong> is a fully curated, transformational experience designed to help you become the woman you&apos;ve always wanted to be, using astrology, Human Design, somatics, shadow work, manifestation, hypnosis and powerful embodiment practices.</p>
        <p>We&apos;re talking deep breakthroughs, delicious food, beautiful surroundings, meaningful connections, a little witchcraft and a whole lot of stepping into your power.</p>
        <p>You&apos;ll explore who you really are, release the beliefs and patterns holding you back, reconnect with your desires and build the confidence to create a life that feels wildly, ridiculously YOURS.</p>
        <p><strong>More money. More freedom. More pleasure. More confidence. More MAGIC.</strong></p>
        <p>All while making memories and building friendships with women who dream just as BIG as you do.</p>
        <p>Because your dream life deserves more than another Pinterest board.</p>
        <p><strong>Tulum is calling. Your future self has already packed her bags.</strong> 💜✨</p>
        <JoinButton>💜 get on the waitlist</JoinButton>
      </Band>

      <Band tone="pinkLight" tag="how the manifesting works ✨" title="how we manifest" accent="the 2027 version of you.">
        <p>Every session, ritual and late-night conversation at the retreat follows the four-part method behind everything I teach, so the whole experience builds towards one thing: you, living as her.</p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ listStyle: "none", padding: 0, margin: "28px 0 0" }}>
          {METHOD.map((m, i) => (
            <li key={m.step} style={{ background: "#fff", border: "var(--border)", borderRadius: 18, padding: "20px 20px 22px" }}>
              <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>{i + 1}. {m.step}</div>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, margin: "10px 0 0" }}>{m.body}</p>
            </li>
          ))}
        </ol>
      </Band>

      <Band tone="lav" tag="imagine" title="starting 2027" accent="in the right waaaayyyyyyyyyy.">
        <p>Imagine a few days dedicated to your pleasure, your power, your body, your dreams, your magic and every deliciously complicated part of being a woman.</p>
        <p>Days filled with astrology, witchcraft, movement, sensuality, shadow work, creativity, extraordinary conversations, outrageous laughter and the kind of female friendships that change your entire life.</p>
        <p>A place where you can be loud, emotional, ambitious, sensual, spiritual, ridiculous, vulnerable, wildly confident and completely yourself.</p>
        <p>Where you can cry during a breakthrough, dance until your feet hurt, have the most incredible conversation over dinner and realise you&apos;ve spent far too much of your life worrying about being acceptable.</p>
        <p><strong>We&apos;re bringing the entire woman to the party.</strong></p>
        <p><strong>Welcome to The Bad B*tch Retreat.</strong></p>
        <JoinButton>💜 get on the waitlist</JoinButton>
      </Band>

      <Band tag="your permission slip" title="consider this your permission slip" accent="to be a LOT.">
        <p>We&apos;re creating an experience for women who are absolutely DONE shrinking themselves into socially acceptable little packages.</p>
        <p>Women who want more from life. More pleasure, more freedom, more money, more confidence, more adventure, more creativity, more extraordinary friendships and more opportunities to feel absolutely F*CKING ALIVE.</p>
        <p>We&apos;re exploring the parts of ourselves we&apos;ve celebrated, the parts we&apos;ve rejected, the desires we&apos;ve buried, the dreams we&apos;ve postponed and the woman who&apos;s been waiting patiently for us to give her the microphone.</p>
        <p><strong>Expect magic. Expect mischief. Expect revelations.</strong></p>
        <p>Expect to meet women who make you wonder where the hell they&apos;ve been your entire life.</p>
      </Band>

      <PhotoStrip photos={SISTER_PHOTOS} />

      <Band tag="a little taste of the magic 🪄" title="a little taste" accent="of the magic.">
        <Tiles items={MAGIC} />
      </Band>

      <Band tone="lav" tag="a day at the retreat 🌴" title="what a day" accent="actually looks like.">
        <p>Deep work in the mornings, delicious nothing in the afternoons and magic once the sun goes down. Here&apos;s a sample day, with the full schedule going to the women who get a spot.</p>
        <div style={{ marginTop: 26, display: "grid", gap: 0, borderTop: "var(--border)" }}>
          {DAY.map((d) => (
            <div key={d.when} className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1 sm:gap-6" style={{ borderBottom: "var(--border)", padding: "16px 0" }}>
              <div style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)", paddingTop: 3 }}>{d.when}</div>
              <div style={{ fontSize: 16, lineHeight: 1.6, fontWeight: 600 }}>{d.what}</div>
            </div>
          ))}
        </div>
      </Band>

      <section className="px-5 md:px-8" style={{ background: "#fff", borderBottom: "var(--border)", paddingTop: 80, paddingBottom: 84 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betty-founder.png" alt="Betty Andrews, founder of MY SZN" style={{ width: "100%", maxWidth: 380, borderRadius: 24, border: "var(--border)", objectFit: "cover", aspectRatio: "4 / 5", transform: "rotate(-2deg)", boxShadow: "10px 12px 0 var(--dark)" }} />
          <div>
            <div className="tag mb-4">who&apos;s holding the space</div>
            <h2 className="display" style={{ fontSize: "clamp(32px, 5vw, 58px)", lineHeight: 1 }}>hi, i&apos;m betty. <span className="pk">i&apos;ll be with you the whole way.</span> <span style={{ fontSize: "0.55em" }}>💜</span></h2>
            <div className="offer-copy" style={{ marginTop: 20 }}>
              <p>I&apos;m an astrologer, manifestation coach and shadow work practitioner, and I help women make more money, reclaim their power and become more of who they actually are.</p>
              <p>I&apos;ll have read your chart and your Human Design before you land, I&apos;ll be leading every session, ritual and meditation, and I&apos;ll be right there at the dinner table when the conversation gets wonderfully unhinged.</p>
            </div>
          </div>
        </div>
      </section>

      <Band tone="pinkLight" tag="this one's for the woman who" title="this one's" accent="for the woman who...">
        <ForYouIf
          items={[
            "Has spent years being the good girl and is ready to find out who she is without everybody else's expectations.",
            "Loves astrology, witchcraft, personal development and the occasional existential revelation over cocktails.",
            "Wants to feel more connected to her body, sensuality, desires and creativity.",
            "Is building a bigger, richer, more exciting life and wants women around her who understand that ambition.",
            "Wants to explore her shadow without being ashamed of the messy, complicated parts of herself.",
            "Craves beautiful experiences, meaningful friendships, delicious food, adventures and a little bit of magic.",
            "Is ready to make herself the main character in her own F*CKING LIFE.",
          ]}
        />
      </Band>

      <Band tone="lav" tag="imagine coming home with" title="imagine coming" accent="home with...">
        <ForYouIf
          items={[
            "A deeper understanding of your astrology, your patterns and your personal power.",
            "A new relationship with your body, your desires and your self-worth.",
            "Beautiful new friendships with women who see you and celebrate you.",
            "A collection of extraordinary memories, fabulous photographs, inside jokes and stories you'll be telling forever.",
          ]}
        />
        <p style={{ marginTop: 22 }}><strong>Most importantly, a renewed commitment to creating a life that feels outrageously, wonderfully YOURS.</strong></p>
      </Band>

      <Band tag="the details" title="the" accent="need-to-knows.">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ margin: "28px 0 0" }}>
          {DETAILS.map((d) => (
            <div key={d.label} style={{ border: "var(--border)", borderRadius: 18, padding: "18px 20px 20px", background: "var(--pink-light)" }}>
              <dt style={{ fontFamily: pp, fontSize: 13, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pink)" }}>{d.label}</dt>
              <dd style={{ fontSize: 15.5, lineHeight: 1.65, margin: "8px 0 0" }}>{d.body}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <WaitlistBand
        offer="retreat"
        title="a little mystery"
        accent="makes everything sexier."
        body={
          <>
            <p style={{ margin: "0 0 14px" }}>The villa? The experiences? The surprises?</p>
            <p style={{ margin: "0 0 14px" }}>We&apos;re putting together something seriously special, with the villa, dates, experiences and all the delicious details announced to our waitlist first.</p>
            <p style={{ margin: "0 0 14px" }}>If your whole body is already screaming YES, consider that your invitation.</p>
            <p style={{ margin: "0 0 14px", color: "#fff", fontWeight: 800 }}>Come be a little bit F*CKING MUCH with us.</p>
            <p style={{ margin: 0 }}>Your next favourite life experience might be closer than you think. 💜 🪩 🦄 ✨</p>
          </>
        }
      />

      <OfferCards exclude="retreat" />
    </>
  );
}
