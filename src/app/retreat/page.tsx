import type { Metadata } from "next";
import { OfferHero, Band, Tiles, ForYouIf, WaitlistBand, OfferCards, HeroArt } from "@/components/Offer";

// The Bad B*tch Retreat: the in-person experience. Waitlist only. No location, dates or price are
// confirmed, so the page never names any of them; they go to the waitlist first.

export const metadata: Metadata = {
  title: "The Bad B*tch Retreat, an In-Person Astrology + Embodiment Retreat for Women",
  description:
    "The Bad B*tch Retreat is MY SZN's immersive in-person experience: body, sensuality, creativity, confidence, sexuality, shadow, personal power and self-love, through astrology, embodiment, movement, ritual and sisterhood. Join the waitlist.",
  alternates: { canonical: "/retreat" },
  openGraph: {
    title: "The Bad B*tch Retreat 🌴",
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
        kicker="the bad b*tch retreat 💜"
        title="your most unforgettable love affair"
        accent="starts with YOU."
        intro={
          <p>
            For women who want to feel EVERYTHING, experience EVERYTHING and fall completely, ridiculously, head-over-heels in love with being alive.
          </p>
        }
      />

      <PhotoStrip photos={PLACE_PHOTOS} />

      <Band tag="imagine" title="starting 2027" accent="in the right waaaayyyyyyyyyy.">
        <p>Imagine a few days dedicated to your pleasure, your power, your body, your dreams, your magic and every deliciously complicated part of being a woman.</p>
        <p>Days filled with astrology, witchcraft, movement, sensuality, shadow work, creativity, extraordinary conversations, outrageous laughter and the kind of female friendships that change your entire life.</p>
        <p>A place where you can be loud, emotional, ambitious, sensual, spiritual, ridiculous, vulnerable, wildly confident and completely yourself.</p>
        <p>Where you can cry during a breakthrough, dance until your feet hurt, have the most incredible conversation over dinner and realise you&apos;ve spent far too much of your life worrying about being acceptable.</p>
        <p><strong>We&apos;re bringing the entire woman to the party.</strong></p>
        <p><strong>Welcome to The Bad B*tch Retreat.</strong></p>
        <JoinButton>💜 get on the waitlist</JoinButton>
      </Band>

      <Band tone="lav" tag="your permission slip" title="consider this your permission slip" accent="to be a LOT.">
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

      <WaitlistBand
        offer="retreat"
        title="a little mystery"
        accent="makes everything sexier."
        body={
          <>
            <p style={{ margin: "0 0 14px" }}>The location? The experiences? The surprises?</p>
            <p style={{ margin: "0 0 14px" }}>We&apos;re putting together something seriously special, with the location, dates, experiences and all the delicious details announced to our waitlist first.</p>
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
