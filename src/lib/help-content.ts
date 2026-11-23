// The member help section: every answer on /help, and what the Ask Us box searches as she types.
//
// Each answer is checked against the app as it is built (settings, events, replays, messages), so
// if a flow changes, change its answer here too. `words` are extra search terms for the ways women
// actually phrase things ("zoom", "refund", "card declined") that the answer itself doesn't say.

export interface HelpAnswer {
  id: string;
  q: string;
  a: string;
  link?: { href: string; label: string };
  words?: string[];
}

export interface HelpTopic {
  id: string;
  title: string;
  emoji: string;
  answers: HelpAnswer[];
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "start",
    title: "getting started",
    emoji: "💗",
    answers: [
      {
        id: "where-to-start",
        q: "I just joined, where do I start?",
        a: "Hiii my love, welcome in! Start on your season home, that's your personal read of what this szn is bringing up for YOU. Then open your chart, pop the next live event in your calendar, and come say hiiii in the coven. That's day one sorted.",
        link: { href: "/dashboard", label: "go to my season home" },
        words: ["new", "begin", "first", "welcome", "lost", "confused", "overwhelmed", "dashboard", "home"],
      },
      {
        id: "home-screen",
        q: "How do I put MY SZN on my phone like an app?",
        a: "On iPhone, open the site in Safari, tap the Share button (the square with the arrow), then tap Add to Home Screen. On Android, open it in Chrome, tap the three dots, then Install app or Add to Home screen. It opens full screen like a proper app, no App Store needed.",
        words: ["app", "iphone", "android", "install", "download", "phone", "mobile", "icon", "home screen"],
      },
      {
        id: "customise",
        q: "Can I make my season more about the things I care about?",
        a: "Yesss. Tell us what you want MORE of (money, love, confidence, all of it) and your season leans into it. You can change your picks any time.",
        link: { href: "/your-season/customise", label: "customise my szn" },
        words: ["personalise", "personalize", "preferences", "focus", "change", "picks"],
      },
    ],
  },
  {
    id: "events",
    title: "live events & replays",
    emoji: "🔮",
    answers: [
      {
        id: "join-live",
        q: "How do I join a live call?",
        a: "Head to Events and find the session. While you're a member, the join zoom meeting button sits right on the event card, so tap it when it's time. Tap add to calendar while you're there and it drops straight into your phone calendar so you never miss one.",
        link: { href: "/events", label: "see upcoming events" },
        words: ["zoom", "link", "call", "live", "workshop", "masterclass", "join", "meeting", "session", "calendar", "when"],
      },
      {
        id: "replays",
        q: "I missed it, where's the replay?",
        a: "Everything lands in the replay vault after it's happened. Watch in your own time, as many times as you like, and they stay there for as long as you're a member.",
        link: { href: "/events/replays", label: "open the replay vault" },
        words: ["missed", "recording", "replay", "rewatch", "watch", "video", "catch up", "past"],
      },
      {
        id: "cant-come-live",
        q: "Do I have to come live?",
        a: "Not at all, my love. Live is the full experience (you can ask questions and get the energy of the room) but the replay is there for every session, so you never fall behind.",
        words: ["live", "busy", "work", "timezone", "time zone", "attend", "miss"],
      },
    ],
  },
  {
    id: "chart",
    title: "your chart",
    emoji: "✨",
    answers: [
      {
        id: "chart-wrong",
        q: "My chart looks wrong, how do I fix it?",
        a: "Nine times out of ten it's a birth time or birth place that's a little off. Go to Settings, find your chart, and tap to fix your birth details. We recalculate everything (your chart, your season, all of it) the second you save.",
        link: { href: "/settings", label: "fix my birth details" },
        words: ["wrong", "incorrect", "birth", "time", "place", "date", "edit", "change", "recalculate", "rising", "ascendant", "sign"],
      },
      {
        id: "birth-time",
        q: "I don't know my birth time, what do I do?",
        a: "Your birth certificate is the best place to look (in some countries the long-form version has it), then hospital records, a baby book, or asking your mum or family. The time matters most for your rising sign and houses, so once you find it, pop it into your birth details and everything updates.",
        link: { href: "/settings", label: "update my birth details" },
        words: ["birth time", "unknown", "certificate", "hospital", "rising", "houses"],
      },
    ],
  },
  {
    id: "community",
    title: "the coven & messages",
    emoji: "💌",
    answers: [
      {
        id: "community-how",
        q: "How does the coven community work?",
        a: "It's the members-only space where the baddies chat, share wins and ask each other things. Jump into a room, post, react, reply. Everyone in there is a member, and the community guidelines keep it a safe space for all of us.",
        link: { href: "/community", label: "go to the coven" },
        words: ["community", "chat", "group", "rooms", "post", "members", "friends", "rules", "guidelines"],
      },
      {
        id: "message-betty",
        q: "Can I message Betty privately?",
        a: "Yesss. Your messages come straight to me, privately, and I read every single one. When I reply you get a little ping in the app and an email, so you don't have to keep checking.",
        link: { href: "/messages", label: "message betty" },
        words: ["betty", "contact", "message", "dm", "private", "talk", "reach", "support", "help", "email"],
      },
      {
        id: "notifications",
        q: "How will I know when something's new?",
        a: "The bell at the top of the site lights up when there's something for you (a reply, a new replay, a message from me). Replies to your private messages come by email too.",
        words: ["notifications", "bell", "alerts", "ping", "email", "updates"],
      },
    ],
  },
  {
    id: "billing",
    title: "membership & billing",
    emoji: "💳",
    answers: [
      {
        id: "my-plan",
        q: "Where can I see my plan and my next payment?",
        a: "Go to Settings, then membership & billing. It shows your plan, whether it's active, and the date it renews or ends.",
        link: { href: "/settings#membership", label: "membership & billing" },
        words: ["plan", "payment", "renew", "renewal", "date", "charge", "subscription", "billing", "invoice", "receipt"],
      },
      {
        id: "payment-failed",
        q: "My payment didn't go through, what now?",
        a: "No stress babe, it happens. Settings will show a payment issue on your membership with a button to update your card. Pop the new details in and you're all sorted.",
        link: { href: "/settings#membership", label: "update my card" },
        words: ["failed", "declined", "card", "payment issue", "expired", "update card", "billing"],
      },
      {
        id: "cancel",
        q: "How do I cancel?",
        a: "Go to Settings, then membership & billing, and tap cancel membership. It tells you exactly what happens before you confirm. If you paid for your 3 months upfront, there's nothing to cancel, it simply ends. If you're on the 3-payment plan, it can be cancelled once the third payment has gone through.",
        link: { href: "/settings#membership", label: "membership & billing" },
        words: ["cancel", "stop", "end", "leave", "quit", "unsubscribe", "pause", "refund"],
      },
      {
        id: "upgrade-la",
        q: "I'm in the online coven, can I upgrade to the LA in-person coven?",
        a: "Yesss! Email hello@thecosmicco.com with \"upgrade me to LA\" and we'll switch your plan over, so you only ever pay for one membership.",
        link: { href: "/baddie-coven/la", label: "see the LA coven" },
        words: ["upgrade", "la", "los angeles", "in person", "irl", "brunch", "switch"],
      },
      {
        id: "change-email",
        q: "How do I change the email on my account?",
        a: "That one I do for you, babe. Send me a message with your old email and the new one and I'll switch it over.",
        link: { href: "/messages", label: "message betty" },
        words: ["email", "change", "account", "login", "address"],
      },
    ],
  },
];

const STOP = new Set(
  "i me my a an the is are was do does did how what where when why can could i'm im to of in on for it its it's and or but with this that be have has get got just so not no".split(" ")
);

const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));

/** The answers that best match what she's typing, best first. Plain word matching, no AI. */
export function searchHelp(query: string, limit = 3): HelpAnswer[] {
  const qWords = tokens(query);
  if (qWords.length === 0) return [];
  const scored: { a: HelpAnswer; score: number }[] = [];
  for (const topic of HELP_TOPICS) {
    for (const a of topic.answers) {
      const qText = a.q.toLowerCase();
      const extra = (a.words ?? []).join(" ").toLowerCase();
      const body = a.a.toLowerCase();
      let score = 0;
      for (const w of qWords) {
        const stem = w.length > 4 ? w.slice(0, -1) : w; // "replays" finds "replay", "cancelled" finds "cancel"
        if (extra.includes(stem)) score += 3;
        if (qText.includes(stem)) score += 2;
        if (body.includes(stem)) score += 1;
      }
      if (score >= 3) scored.push({ a, score });
    }
  }
  return scored.sort((x, y) => y.score - x.score).slice(0, limit).map((s) => s.a);
}
