// Shared vocabulary for MY SZN IRL host applications, so the public form, the API route and the
// admin dashboard cannot drift into three different ideas of what an answer means.

export const LAUNCH_CITIES = [
  { slug: "london", name: "London" },
  { slug: "new-york", name: "New York" },
  { slug: "los-angeles", name: "Los Angeles" },
] as const;

export const ASTROLOGY_LEVELS = [
  { value: "very_confident", label: "Very confident with astrology" },
  { value: "know_my_chart", label: "Know my chart and regularly follow astrology" },
  { value: "basics", label: "Know the basics" },
  { value: "learning", label: "Interested and learning" },
  { value: "new_but_curious", label: "Very new but curious" },
] as const;

export const HOSTING_EXPERIENCE = [
  { value: "professionally", label: "Yes, professionally" },
  { value: "casually", label: "Yes, casually or socially" },
  { value: "a_little", label: "A little" },
  { value: "never_but_keen", label: "Never, but I'd love to" },
] as const;

export const FREQUENCY = [
  { value: "yes", label: "Yes" },
  { value: "usually", label: "Usually" },
  { value: "discuss", label: "Would need to discuss" },
] as const;

export const EVENINGS = [
  { value: "yes", label: "Yes" },
  { value: "mostly", label: "Mostly" },
  { value: "occasionally", label: "Occasionally" },
] as const;

export const TRAVEL = [
  { value: "yes", label: "Yes" },
  { value: "depends", label: "Depends on location" },
] as const;

export const SIDE_ROLE = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

export const PARTNERSHIPS = [
  { value: "yes", label: "Yes" },
  { value: "potentially", label: "Potentially" },
  { value: "hosting_only", label: "I'd rather focus on hosting" },
] as const;

export const STATUSES = [
  "new", "reviewing", "shortlisted", "interview", "second_interview",
  "accepted", "rejected", "hold", "other_city_waitlist",
] as const;
export type ApplicationStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  interview: "Interview",
  second_interview: "Second interview",
  accepted: "Accepted",
  rejected: "Rejected",
  hold: "Hold",
  other_city_waitlist: "Other city waitlist",
};

/** The eight internal scores. Never rendered anywhere an applicant can reach. */
export const RATING_FIELDS = [
  { key: "rating_warmth", label: "Warmth / community fit" },
  { key: "rating_communication", label: "Communication" },
  { key: "rating_reliability", label: "Reliability" },
  { key: "rating_hosting", label: "Hosting confidence" },
  { key: "rating_local", label: "Local knowledge" },
  { key: "rating_creativity", label: "Creativity" },
  { key: "rating_brand_fit", label: "Brand fit" },
  { key: "rating_partnerships", label: "Partnership potential" },
] as const;

const labelFrom = (list: readonly { value: string; label: string }[], v: string | null | undefined) =>
  list.find((x) => x.value === v)?.label ?? "";

export const astrologyLabel = (v?: string | null) => labelFrom(ASTROLOGY_LEVELS, v);
export const hostingLabel = (v?: string | null) => labelFrom(HOSTING_EXPERIENCE, v);
export const frequencyLabel = (v?: string | null) => labelFrom(FREQUENCY, v);
export const partnershipsLabel = (v?: string | null) => labelFrom(PARTNERSHIPS, v);

/** IRL-LDN-0007. Short enough to read down a phone and unique enough to search on. */
export function buildReference(citySlug: string, n: number): string {
  const code =
    citySlug === "london" ? "LDN" :
    citySlug === "new-york" ? "NYC" :
    citySlug === "los-angeles" ? "LA" : "OTH";
  return `IRL-${code}-${String(n).padStart(4, "0")}`;
}
