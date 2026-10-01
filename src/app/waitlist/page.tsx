import { redirect } from "next/navigation";

// /waitlist was a full landing page whose only conversion action was an email capture. It was
// replaced by the free 7-day trial, and the trial was itself retired on 1 Oct 2026, so anyone still
// arriving here from an old ad, email or search result is sent straight to the membership page.
//
// The old page is in git history (see the commit that added this redirect) if the copy is ever
// wanted again. It's also dropped from the sitemap so search stops indexing it.
export default function WaitlistPage() {
  redirect("/membership");
}
