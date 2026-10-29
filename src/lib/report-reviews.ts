// Reader reviews per report, word for word as Betty supplied them (29 Oct 2026). Shown on /reports
// and on each report's own page.

export type ReportReview = { head: string; body: string; name: string; role: string };

export const BBR_REVIEWS: ReportReview[] = [
  {
    head: "It's like someone handed me back the parts of myself I'd forgotten.",
    body: "I didn't realise how much I'd been shrinking myself until I read this. The whole thing felt like a conversation with someone who could see the version of me I've been too scared to become. Honestly, every woman needs to read something like this.",
    name: "Freya Collins",
    role: "Photographer",
  },
  {
    head: "I finished reading it and immediately applied for the job I'd been talking myself out of.",
    body: "That probably tells you everything! I loved how specific it was to my chart. It helped me understand why I second-guess myself, but also reminded me of the strengths I completely overlook. It gave me a proper kick up the arse, in the best possible way.",
    name: "Tessa Whitmore",
    role: "Project Manager",
  },
  {
    head: "I've never felt so seen by a PDF in my entire life 😂",
    body: "Seriously though, WOW. The confidence stuff hit hard, especially the parts about people-pleasing and needing everyone to approve of my decisions. I've reread it three times already. It feels like having a little manual for remembering who I am whenever I start doubting myself.",
    name: "Maya Fletcher",
    role: "Content Creator",
  },
];

export const RBR_REVIEWS: ReportReview[] = [
  {
    head: "I genuinely cried reading the part about my relationship with money.",
    body: "I've spent years feeling guilty for wanting more, especially as a woman running her own business. This report made me look at my patterns in a completely different way. It felt incredibly personal, and I've already started making changes to how I price my work and talk about money.",
    name: "Imogen Ellis",
    role: "Business Owner",
  },
  {
    head: "The accuracy was actually ridiculous.",
    body: "I've had astrology readings before, but nothing that explained my money habits like this. The way it connected my birth chart to how I earn, spend and value myself was WILD. I've got pages highlighted because I keep going back to them.",
    name: "Priya Dawson",
    role: "Marketing Consultant",
  },
  {
    head: "For the first time, wanting to be wealthy doesn't feel selfish.",
    body: "I grew up believing money was something you had to struggle for, and that wanting lots of it was somehow greedy. Reading this gave me so much to think about. I especially loved having practical things to work on instead of just being told I'd be rich one day.",
    name: "Eliza Morgan",
    role: "Creative Freelancer",
  },
];
