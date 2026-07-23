import { redirect } from "next/navigation";

// "this szn" merged into "my szn" on /dashboard, one continuous scroll instead of two
// destinations. Every /your-season/* sub-page (life areas, wrapped, pattern, community, moon,
// theme reads) still lives at its own URL and is unaffected by this redirect.
export default function YourSeasonPage() {
  redirect("/dashboard");
}
