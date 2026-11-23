import HelpClient from "./HelpClient";

// The title deliberately omits the brand: the root layout's template already appends " | MY SZN".
export const metadata = {
  title: "Help",
  description: "Answers to everything about your MY SZN membership: live events, replays, your chart, the coven and billing.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return <HelpClient />;
}
