import { redirect } from "next/navigation";

// The 7-day free trial was retired on 1 Oct 2026: most trials cancelled on day 0 or 1 without ever
// using the platform, so joining is now paid from day one. This was the trial's landing page, and
// it stays as a redirect so every old ad, email, blog link and search result still lands on the
// real offer instead of a 404.
//
// The full landing page is in git history, in the commit that added this redirect, if any of its
// copy is ever wanted again. /free-trial/ended is separate and stays: it is the page a woman whose
// trial already ran out is sent to.
export default function FreeTrialPage() {
  redirect("/membership");
}
