export interface MockProfile {
  name: string;
  bio: string;
  sun: string;
  moon: string;
  rising: string;
}

function parseSignPhrase(phrase: string): { sign: string; body: string } | null {
  const [sign, ...rest] = phrase.split(" ");
  if (!sign || rest.length === 0) return null;
  return { sign, body: rest.join(" ") };
}

// Builds a fallback profile for any author appearing in the feed who isn't in MOCK_PROFILES,
// using whatever sign was attached to their post so no profile page is ever truly empty.
export function getFallbackProfile(author: string, signPhrase?: string): MockProfile {
  const parsed = signPhrase ? parseSignPhrase(signPhrase) : null;
  return {
    name: author,
    bio: "member of the community, becoming the main character one szn at a time.",
    sun: parsed?.body === "sun" ? parsed.sign : "Leo",
    moon: "Cancer",
    rising: parsed?.body === "rising" ? parsed.sign : "Aquarius",
  };
}
